<template>
    <div class="">
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="infoGeneral" class="q-pa-none">
            <q-form ref="form" greedy>
              <q-stepper ref="stepper" v-model="step" animated flat keep-alive header-class="hidden">
                <q-step :done="step > 1" :name="1" prefix="1" title="Datos del destinatario">
                  <q-form ref="step1" greedy>
                    <DatosDestinatario  :form="formDatosDestinatario" :is-por-aprobar="isPorAprobar" />
                    <DatosSalida :form="formSalida" :is-por-aprobar="isPorAprobar" />
                    <DatosCorreo :form="formSalida" :is-por-aprobar="isPorAprobar" />
                  </q-form>
                </q-step>
                <q-step :done="step > 2" :name="2" prefix="2" title="Datos del afectado">
                  <q-form ref="step2" greedy>
                    <Copia ref="step2Copia" :form="formcopia" :detailsTutela="detailsTutela" @update:items-table="itemsTable" :is-por-aprobar="isPorAprobar" />
                  </q-form>
                </q-step>
                <template v-slot:navigation>
                    <q-stepper-navigation class="col row tw-justify-center tw-gap-10 q-gutter-x-md q-mt-md">
                        <q-btn v-if="step > 1" color="primary" label="Regresar"
                          class="tw-w-64 tw-h-12"
                          style="border-radius: 8px; font-size: 18px;" no-caps
                          @click="step--" />

                        <q-btn color="accent" textColor="secondary" label="Cancelar"
                          class="tw-w-64 tw-h-12"
                          style="border-radius: 8px; font-size: 18px;"
                          @click="cancelModal = true"
                          no-caps />

                        <q-btn color="primary" :label="step === 1 ? 'Siguiente' : 'Guardar'"
                          class="tw-w-64 tw-h-12"
                          style="border-radius: 8px; font-size: 18px;" no-caps
                          @click="validateStep" :disable="step === 2 && detailsTutela.estado === 'Por Aprobar'" />
                    </q-stepper-navigation>
                </template>
              </q-stepper>
            </q-form>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <Modal v-model="cancelModal" title="¡Espera un momento!" :is-success="false" @handleAccept="handleCancelar" cancel-button
    textButtonCancel="No" textButton="Si"
    text="Al cancelar el proceso perderá los datos ingresados en el formulario ¿Desea realizar la acción?"
    @close-modal="cancelModal = false" type="button" />
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import DatosDestinatario from "src/components/Stepper/EnvioRespuesta/DatosDestinatario.vue";
import DatosSalida from "src/components/Stepper/EnvioRespuesta/DatosSalida.vue";
import DatosCorreo from "src/components/Stepper/EnvioRespuesta/DatosCorreo.vue";
import DatosAfectado from "src/components/Stepper/EnvioRespuesta/DatosAfectado.vue";
import Copia from "src/components/Stepper/EnvioRespuesta/Copia.vue";
import Modal from 'components/Modal/Modal.vue';
import { QForm } from "quasar";
import { adminAxios, sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { useAuthStore } from "src/stores/auth.store";

const props = withDefaults(defineProps<{
  detailsTutela: any
}>(), {
})
const isPorAprobar = computed(() => ['por aprobar'].includes(props.detailsTutela.estado.toLowerCase()));
const step = ref(1)
const tab = ref('infoGeneral')
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const form: Ref<QForm | null> = ref(null);
const step1: Ref<QForm | null> = ref(null);
const step2: Ref<QForm | null> = ref(null);

const step2Copia = ref<InstanceType<typeof Copia> | null>(null)
const step3Afectado = ref<InstanceType<typeof DatosAfectado> | null>(null)
const emit = defineEmits(['findTutela', 'cancel'])
const dataDatos = ref()
const cancelModal = ref(false)
const formDatosDestinatario = ref({
  formaEnvio: '',
  tipoDocumento: '',
  numeroDocumentoDestinatario: '',
  nombreDestinatario: '',
  direccionDestinatario: '',
  paisDestinatario: 'Colombia',
  departamentoDestinatario: { label: '', value: '' },
  municipioDestinatario: { label: '', value: '' },
  telefonoDestinatario: '',
  correoElectronico: ''
})
const formDatosAfectado = ref({
  anexoMediosMagneticos: '',
  anexoCantidadFolios: '',
  asunto: '',
  observacion: ''
})
const formcopia = ref({
  copia: '',
  dependencia: '',
  nombreFuncionario: '',
  formaEnvio: '',
  tipoDocumento: '',
  documento: '',
  nombre: '',
  direccion: '',
  pais: { label: 'Colombia', value: 425 },
  departamento: { label: '', value: null },
  municipio: { label: '', value: null },
  telefono: '',
  correo: '',
})
const formSalida = ref({
  anexos: '',
  asunto: '',
  observacion: '',
  tipoDocumentoAfectado: '',
  numeroDocumentoAfectado: '',
  nombreAfectado: '',
  razonSocial: '',
  asuntoCorreo: '',
  cuerpoCorreo: ''
})

const validateStep = async() => {
  if (step.value == 1 && await step1.value?.validate()) {
    step.value++
  } else if(step.value == 2 && await step2.value?.validate()){
    if (await form.value?.validate() || validaItems) {
      const response = await sgdeaAxios.post(`/tutela/tutelas/${props.detailsTutela.idTutela}/datossalida`, {
          formaEnvio: formDatosDestinatario.value.formaEnvio,
          juzgado: {
            idJuzgado: dataDatos.value.juzgado.idJuzgado,
            nombre: formDatosDestinatario.value.nombreDestinatario,
            direccion: formDatosDestinatario.value.direccionDestinatario,
            pais: typeof(formDatosDestinatario.value.paisDestinatario) == 'object' ? formDatosDestinatario.value.paisDestinatario.label : formDatosDestinatario.value.paisDestinatario,
            departamento: formDatosDestinatario.value.departamentoDestinatario.label,
            municipio: formDatosDestinatario.value.municipioDestinatario.label,
            codigo: dataDatos.value.juzgado.codigo,
            telefono: formDatosDestinatario.value.telefonoDestinatario,
            celular: dataDatos.value.juzgado.celular,
            correo: formDatosDestinatario.value.correoElectronico,
            estado: true
          },
          // tipoDocumentoDestinatario: formDatosDestinatario.value.tipoDocumento,
          // documentoDestinatario: formDatosDestinatario.value.numeroDocumentoDestinatario,
          // nombreDestinatario: formDatosDestinatario.value.nombreDestinatario,
          // direccionDestinatario: formDatosDestinatario.value.direccionDestinatario,
          // pais: formDatosDestinatario.value.paisDestinatario,
          // departamento: formDatosDestinatario.value.departamentoDestinatario.label,
          // municipio: formDatosDestinatario.value.municipioDestinatario.label,
          // telefonoDestinatario: formDatosDestinatario.value.telefonoDestinatario,
          // correoDestinatario: formDatosDestinatario.value.correoElectronico,
          anexos: formSalida.value.anexos,
          asunto: formSalida.value.asunto,
          observacion: formSalida.value.observacion,
          asuntoCorreo: formSalida.value.asuntoCorreo,
          cuerpoCorreo: formSalida.value.cuerpoCorreo
          // tipoDocumentoAfectado: formSalida.value.tipoDocumentoAfectado,
          // numeroDocumentoAfectado: formSalida.value.nombreAfectado,
          // nombreAfectado: formSalida.value.nombreAfectado
      })

      if (response.status === 200) {

        crearTrazabilidad({
          proceso: "TUT" + props.detailsTutela.idTutela,
          secuencia: props.detailsTutela.idRadicado,
          estado: props.detailsTutela.estado,
          descripcion:`Destinatario: Nombre:${formDatosDestinatario.value.nombreDestinatario} Correo:${formDatosDestinatario.value.correoElectronico ?? ""}` +
        ` País: ${formDatosDestinatario.value.paisDestinatario ?? ""}`+
        `Departamento: ${formDatosDestinatario.value.departamentoDestinatario.label ?? ""} Dirección: ${formDatosDestinatario.value.direccionDestinatario ?? ""}`+
        `Municipio: ${formDatosDestinatario.value.municipioDestinatario.label ?? ""} `
        +`Documento: ${formDatosDestinatario.value.tipoDocumento ?? ""} - ${formDatosDestinatario.value.numeroDocumentoDestinatario ?? ""}`+
        ` Teléfono: ${formDatosDestinatario.value.telefonoDestinatario ?? "" }` +
        `Anexos: ${formSalida.value.anexos ?? ""}` +
        `Asunto: ${formSalida.value.asunto ?? ""}`+ `Copia: ${formcopia.value.copia ?? ""}`
        ,
          comentario: 'Adjunto',
          nombre: auth.$state.userInfo.name,
          accion: `${auth.$state.userInfo.name} modificó los datos de salida del caso`,
          tramite: 'Tutela',
        })

        toast.success('Datos de salida guardados con éxito')
        step.value = 1
        emit("findTutela")
      } else {
        toast.error('Ha ocurrido un error.')
      }
  }
  }
  else {
      toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos.')
  }
}

const validaItems = ref(false)

const itemsTable = (data) => {
  if (data.length > 0) {
    validaItems.value = true
  }
}

const handleCancelar = async() => {
  // step.value = 1
  // formcopia.value = {
  //   copia: '',
  //   dependencia: '',
  //   nombreFuncionario: '',
  //   formaEnvio: '',
  //   tipoDocumento: '',
  //   documento: '',
  //   nombre: '',
  //   direccion: '',
  //   pais: { label: 'Colombia', value: 425 },
  //   departamento: { label: '', value: null },
  //   municipio: { label: '', value: null },
  //   telefono: '',
  //   correo: '',
  // }
  // await step2.value.reset()
  // getData()
  emit('cancel')
}

const getData = async() => {
  const { data } = await sgdeaAxios.get(`/tutela/info/${route.params.id}`)
  dataDatos.value = data
  const responsePais = (await adminAxios.get('/paises/list')).data
  const selectedCountry = responsePais.find((it) => it.nombre === data.juzgado.pais);

  if (selectedCountry?.nombre === 'Colombia') {
    const department = selectedCountry.departamentos.find((it) => it.nombre === data.juzgado.departamento);
    const municipio = department.municipios.find((it) => it.nombre === data.juzgado.municipio);
    formDatosDestinatario.value = {
      formaEnvio: '',
      tipoDocumento: '',
      numeroDocumentoDestinatario: '',
      nombreDestinatario: data.juzgado.nombre,
      direccionDestinatario: data.juzgado?.direccion,
      paisDestinatario: data.juzgado.pais,
      departamentoDestinatario: { label: data.juzgado.departamento, value: department?.idDepartamento },
      municipioDestinatario: { label: data.juzgado.municipio, value: municipio?.idMunicipio },
      telefonoDestinatario: data.juzgado?.telefono,
      correoElectronico: data.juzgado.correo
    }
  } else {
    formDatosDestinatario.value = {
      formaEnvio: '',
      tipoDocumento: '',
      numeroDocumentoDestinatario: '',
      nombreDestinatario: data.juzgado.nombre,
      direccionDestinatario: data.juzgado?.direccion,
      paisDestinatario: data.juzgado.pais,
      departamentoDestinatario: { label: data.juzgado.departamento, value: data.juzgado.departamento },
      municipioDestinatario: { label: data.juzgado.municipio, value: data.juzgado.municipio },
      telefonoDestinatario: data.juzgado?.telefono,
      correoElectronico: data.juzgado.correo
    }
  }

  formSalida.value = {
    anexos: '',
    asunto: '',
    observacion: '',
    tipoDocumentoAfectado: data.informacionProceso?.tipoDocumentoAfectado || '',
    numeroDocumentoAfectado: data.informacionProceso?.numeroDocumentoAfectado || '',
    nombreAfectado: data.informacionProceso ? [
        data.informacionProceso.primerNombreAfectado,
        data.informacionProceso.segundoNombreAfectado,
        data.informacionProceso.primerApellidoAfectado,
        data.informacionProceso.segundoApellidoAfectado
      ].filter(Boolean).join(' ')
    : '',
    razonSocial: data.informacionProceso?.primerApellidoAfectado || '',
    asuntoCorreo: '',
    cuerpoCorreo: '',
  }

  if (data.radicadoSalida) {
    formSalida.value.anexos = data.radicadoSalida?.anexos,
    formSalida.value.asunto = data.radicadoSalida?.asunto,
    formDatosDestinatario.value.formaEnvio = data.radicadoSalida?.formaEnvio,
    formSalida.value.observacion = data.radicadoSalida?.observacion,
    formSalida.value.asuntoCorreo = data.radicadoSalida?.asuntoCorreo || '',
    formSalida.value.cuerpoCorreo = data.radicadoSalida?.cuerpoCorreo || ''
  }
}
onMounted(getData)
</script>
