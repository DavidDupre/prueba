<template>
  <div class="">
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="infoGeneral" class="q-pa-none">
        <q-form ref="form" greedy>
          <q-stepper ref="stepper" v-model="step" animated flat keep-alive header-class="hidden">
            <q-step :done="step > 1" :name="1" prefix="1" title="Datos del destinatario">
              <q-form ref="step1" greedy>
                <DatosDestinatarioCOR :form="formDatosDestinatario" :ops-envio="opEnvio"
                  :ops-tipo-doc="opTipoDocOriginal" :isDisabled="isDisabled"/>
                <DatosSalidaCOR :form="formSalida" :ops-tipo-doc="opTipoDoc"  :isDisabled="isDisabled" />
              </q-form>
            </q-step>
            <q-step :done="step > 2" :name="2" prefix="2" title="Datos del afectado">
              <q-form ref="step2" greedy>
                <CopiaCOR ref="step2Copia" :form="formcopia" :ops-envio="opEnvio"
                  :ops-tipo-doc="opTipoDoc" :tipo-copia="tipoCopia"
                  @update:form-copia="clear" @update:item-table="itemsTable"
                  :copias-externa="copias.external" :copias-interna="copias.internal"
                  :table-copias-externa="labelsCopiaExterna" :table-copias-interna="labelsCopiaInterna"
                />
              </q-form>
            </q-step>

            <template v-slot:navigation>
              <q-stepper-navigation class="col row tw-justify-center tw-gap-10 q-gutter-x-md q-mt-md">
                <q-btn color="accent" textColor="secondary" label="Cancelar" class="tw-w-64 tw-h-12"
                  style="border-radius: 8px; font-size: 18px;" @click="cancelModal = true" no-caps  :disable="isDisabled"/>

                <q-btn color="primary" :label="step == 2 ? 'Guardar' : 'Continuar'" class="tw-w-64 tw-h-12"
                  style="border-radius: 8px; font-size: 18px;" no-caps @click="validateStep" :disable="isDisabled" />
              </q-stepper-navigation>
            </template>
          </q-stepper>
        </q-form>
      </q-tab-panel>
    </q-tab-panels>
  </div>
  <Modal v-model="cancelModal" title="Confirmación" :is-success="false" @handleAccept="handleCancelar" cancel-button
    textButtonCancel="No" textButton="Si"
    text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
    @close-modal="cancelModal = false" type="button" />
</template>

<script setup lang="ts">
import { Ref, onMounted, ref, watch } from "vue";

import DatosDestinatarioCOR from "src/components/Stepper/EnvioRespuesta/DatosDestinatarioCOR.vue";
import DatosSalidaCOR from "src/components/Stepper/EnvioRespuesta/DatosSalidaCOR.vue";
import CopiaCOR from "src/components/Stepper/EnvioRespuesta/CopiaCOR.vue";
import Modal from 'components/Modal/Modal.vue';
import { QForm } from "quasar";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { useRouter } from "vue-router";
import Correspondencia from "src/components/Stepper/EnvioRespuesta/Correspondencia.vue";
import { useAuthStore } from "src/stores/auth.store";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { isNullOrUndefined } from "src/shared/utils/Input/validationInput";

const props = withDefaults(defineProps<{
  detailsRadicado: any,
  isCertificado: any,
  detailsCopies: any,
}>(), {
})

const step = ref(1)
const tab = ref('infoGeneral')
const router = useRouter()
const emit = defineEmits(['update:datosSalida'])
const isDisabled = ref(false);
const form: Ref<QForm | null> = ref(null);
const step1: Ref<QForm | null> = ref(null);
const step2: Ref<QForm | null> = ref(null);
// const step3: Ref<QForm | null> = ref(null);
const tipoCopia = ref();
const labelsCopiaExterna = ref([]);
const labelsCopiaInterna: Ref<[]> = ref([]);
const step2Copia = ref<InstanceType<typeof CopiaCOR> | null>(null)
const cancelModal = ref(false)
const opTipoDoc = ref([])
const opTipoDocOriginal = ref([])
const opEnvio = ref([])
const formDatosDestinatario = ref({
  formaEnvio: { label: '', value: '' },
  tipoDocumento: { label: '', value: '' },
  numeroDocumentoDestinatario: '',
  nombreDestinatario: '',
  direccionDestinatario: '',
  paisDestinatario: { label: 'Colombia', value: 425 },
  departamentoDestinatario: { label: '', value: '' },
  municipioDestinatario: { label: '', value: '' },
  telefonoDestinatario: '',
  correoElectronico: ''
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
  departamento: { label: '', value: '' },
  municipio: { label: '', value: '' },
  telefono: '',
  correo: '',
  copiaBody: [],
  copiaExterna: [],
})
const copias = ref({
  internal: [],
  external: [],
})
const formSalida = ref({
  anexos: '',
  asunto: '',
  observacion: '',
  tipoDocumentoAfectado: { label: '', value: '' },
  numeroDocumentoAfectado: '',
  nombreAfectado: ''
})

const formCor = ref({
  asunto: '',
  cuerpo: ''
})

const validateStep = async () => {
  if (step.value == 1 && await step1.value?.validate()) {
    step.value++
  } else if (step.value == 2 && await step2.value?.validate()) {
    if (await form.value?.validate() && (formcopia.value.copia != '3')) {
      if (formcopia.value.copia == '1' && (copias.value.internal.length > 0)) {
        step.value++
      } else if (formcopia.value.copia == '2' && copias.value.external.length > 0) {
        step.value++
      } else if (formcopia.value.copia == '4' && copias.value.internal.length > 0 && copias.value.external.length > 0) {
        step.value++
      } else {
        toast.error('Debe agregar como mínimo un destinatario copia')
      }
    }

    try {
      const body = {
        formaEnvio: formDatosDestinatario.value.formaEnvio.value,
        tipoDocumentoDestinatario: formDatosDestinatario.value.tipoDocumento.value ? formDatosDestinatario.value.tipoDocumento.value : formDatosDestinatario.value.tipoDocumento,
        numeroDocumentoDestinatario: formDatosDestinatario.value.numeroDocumentoDestinatario,
        nombreDestinatario: formDatosDestinatario.value.nombreDestinatario,
        direccionDestinatario: formDatosDestinatario.value.direccionDestinatario,
        pais: formDatosDestinatario.value.paisDestinatario.value,
        departamento: formDatosDestinatario.value.departamentoDestinatario.value,
        municipio: formDatosDestinatario.value.municipioDestinatario.value,
        telefonoDestinatario: String(formDatosDestinatario.value.telefonoDestinatario),
        correoDestinatario: formDatosDestinatario.value.correoElectronico,
        anexos: Number(formSalida.value.anexos),
        asunto: formSalida.value.asunto,
        observacion: formSalida.value.observacion,
        tipoDocumentoAfectado: formSalida.value.tipoDocumentoAfectado.value ? formSalida.value.tipoDocumentoAfectado.value : formSalida.value.tipoDocumentoAfectado,
        numeroDocumentoAfectado: formSalida.value.numeroDocumentoAfectado,
        nombreAfectado: formSalida.value.nombreAfectado,
        tipoCopia: formcopia.value.copia,
        comunicacionAsunto: formCor.value.asunto,
        comunicacionCuerpoCorreo: formCor.value.cuerpo,
        usuario: useAuthStore().$state.userInfo.name,
      }

      if (formcopia.value.copia != '3') {
        if (formcopia.value.copia == '1' || formcopia.value.copia == '4') {
          body['copiasInternas'] = copias.value.internal
        }
        if (formcopia.value.copia == '2' || formcopia.value.copia == '4') {
          body['copiasExternas'] = copias.value.external
        }
      }

      const response = await sgdeaAxios.post(`/correspondencia/crearDatosSalida/${props.detailsRadicado.id}`, body)
      if (response.status === 200) {
        if (props.detailsRadicado.estadoProceso !== 'Para gestión') {
          emit('update:datosSalida');
        }
        toast.success('Datos guardados exitosamente')
        step.value = 1
        if (!isNullOrUndefined(props.detailsRadicado.datosSalida)) {
          await crearTrazabilidad({
            proceso: `COR${props.detailsRadicado.id}`,
            secuencia: props.detailsRadicado.id,
            estado: props.detailsRadicado.estadoProceso.estado,
            descripcion: `Usuario:${useAuthStore().$state.userInfo.name}` + `Destinatario:${formDatosDestinatario.value.nombreDestinatario}` + `Comentario:Los datos de salida se han guardado correctamente.`,
            comentario: useAuthStore().$state.userInfo.name + ' ha guardado los datos de salida para el tramite',
            nombre: useAuthStore().$state.userInfo.name,
            tramite: props.detailsRadicado.tipoTramite.nombre,
            accion: `Se han guardado los datos de salida`
          })
        }

      }
    } catch (error) {
      toast.error('Ha ocurrido un error inesperado')
    }
  } else {
    toast.error('Complete todos los campos para proceder a radicar')
  }
}

const clear = (form) => {
  formcopia.value = {
    copia: form.copia,
    dependencia: '',
    nombreFuncionario: '',
    formaEnvio: '',
    tipoDocumento: '',
    documento: '',
    nombre: '',
    direccion: '',
    pais: { label: 'Colombia', value: 425 },
    departamento: { label: '', value: '' },
    municipio: { label: '', value: '' },
    telefono: '',
    correo: '',
    copiaBody: formcopia.value.copiaBody,
    copiaExterna: formcopia.value.copiaExterna
  }
}

const itemsTable = (itemsInternal, itemsExternal) => {
  copias.value.external = itemsExternal
  copias.value.internal = itemsInternal
  // formcopia.value.copiaBody = [...itemsInternal]
}

const handleCancelar = async () => {
  router.push('/correspondencia')
}


const getData = async () => {
  const remitente = props.detailsRadicado.remitente;
  const afectado = props.detailsRadicado.afectado;
  const { data: opsTipoDoc } = await sgdeaAxios.get('/correspondencia/comunicacion/listadoTipoIdentificacion')

  copias.value.internal = props.detailsCopies.internal.map(copy => {
    return {
      correspondenciaDependencia: copy.correspondenciaDependencia.idSeccionSubSeccion,
      correspondenciaFuncionario: copy.correspondenciaFuncionario.id,
    }
  });
  labelsCopiaInterna.value = props.detailsCopies.internal.map(copy => {
    return {
      correspondenciaDependencia: copy.correspondenciaDependencia.nombre,
      correspondenciaFuncionario: copy.correspondenciaFuncionario.fullname,
    }
  });

  copias.value.external = props.detailsCopies.external.map(copy => {
    return {
      formaEnvio: copy?.formaEnvio?.id,
      tipoDocumentoDestinatario: copy?.tipoDocumentoDestinatario?.id,
      numeroDocumentoDestinatario: copy?.numeroDocumentoDestinatario,
      nombreDestinatario: copy?.nombreDestinatario,
      direccionDestinatario: copy?.direccionDestinatario,
      paisDestinatario: copy?.paisDestinatario.idPais,
      departamentoDestinatario: copy?.departamentoDestinatario?.idDepartamento,
      municipioDestinatario: copy?.municipioDestinatario?.idMunicipio,
      telefonoDestinatario: copy?.telefonoDestinatario,
      correoElectronico: copy?.correoElectronico
    }
  });
  labelsCopiaExterna.value = props.detailsCopies.external.map(copy => {
    return {
      formaEnvio: copy?.formaEnvio?.nombre,
      tipoDocumentoDestinatario: copy?.tipoDocumentoDestinatario?.nombre,
      numeroDocumentoDestinatario: copy?.numeroDocumentoDestinatario,
      nombreDestinatario: copy?.nombreDestinatario,
      direccionDestinatario: copy?.direccionDestinatario,
      paisDestinatario: copy?.paisDestinatario.nombre,
      departamentoDestinatario: copy?.departamentoDestinatario?.nombre,
      municipioDestinatario: copy?.municipioDestinatario?.nombre,
      telefonoDestinatario: copy?.telefonoDestinatario,
      correoElectronico: copy?.correoElectronico
    }
  });

  opTipoDocOriginal.value = opsTipoDoc?.map((items) => ({
    label: items.nombre,
    value: items.id
  })).sort((a, b) => a.label.localeCompare(b.label))

  opTipoDoc.value = opTipoDocOriginal.value.filter(({ label }) => label)

  tipoCopia.value = props.detailsRadicado?.datosSalida?.tipoCopia.id || null;

  const { data: opsEnvios } = await sgdeaAxios.get('/correspondencia/comunicacion/listadoFormaEnvio')
  opEnvio.value = opsEnvios?.map((items) => ({
    label: items.nombre,
    value: items.id
  })).filter(({ label }) => {
    if (!props.isCertificado && label === 'Correo electrónico certificado') {
      return false;
    }
    return label !== 'Mensajero';
  }).sort((a, b) => a.label.localeCompare(b.label));

  const datosSalidaExist = props.detailsRadicado.datosSalida;

  if (props.detailsRadicado.remitente.pais.nombre === 'Colombia') {



    if (datosSalidaExist) {
      formDatosDestinatario.value = {
        formaEnvio: { label: datosSalidaExist.formaEnvio.nombre, value: datosSalidaExist.formaEnvio.id },
        tipoDocumento: { label: datosSalidaExist.tipoDocumentoDestinatario.nombre, value: datosSalidaExist.tipoDocumentoDestinatario.id },
        numeroDocumentoDestinatario: datosSalidaExist.numeroDocumentoDestinatario,
        nombreDestinatario: datosSalidaExist.nombreDestinatario,
        direccionDestinatario: datosSalidaExist.direccionDestinatario,
        paisDestinatario: { label: datosSalidaExist.pais.nombre, value: datosSalidaExist.pais.idPais },
        departamentoDestinatario: { label: datosSalidaExist.departamento.nombre, value: datosSalidaExist.departamento.idDepartamento },
        municipioDestinatario: { label: datosSalidaExist.municipio.nombre, value: datosSalidaExist.municipio.idMunicipio },
        telefonoDestinatario: datosSalidaExist.telefonoDestinatario || '',
        correoElectronico: datosSalidaExist.correoDestinatario
      };
    } else {
      formDatosDestinatario.value = {
        formaEnvio: remitente.correo ? opEnvio.value.find(it => it.label === 'Correo electrónico certificado') : opEnvio.value.find(it => it.label === 'Courier'),
        tipoDocumento: { label: remitente.tipoDocumento.nombre, value: remitente.tipoDocumento.id },
        numeroDocumentoDestinatario: remitente.numeroDocumento,
        nombreDestinatario: remitente.nombre,
        direccionDestinatario: remitente.direccion,
        paisDestinatario: { label: props.detailsRadicado.remitente.pais.nombre, value: props.detailsRadicado.remitente.pais.idPais },
        departamentoDestinatario: { label: props.detailsRadicado.datosSalida ? props.detailsRadicado.datosSalida.departamento.nombre : remitente.departamento.nombre, value: props.detailsRadicado.datosSalida ? props.detailsRadicado.datosSalida.departamento.idDepartamento : remitente.departamento.idDepartamento },
        municipioDestinatario: { label: props.detailsRadicado.datosSalida ? props.detailsRadicado.datosSalida.municipio.nombre : remitente.municipio.nombre, value: props.detailsRadicado.datosSalida ? props.detailsRadicado.datosSalida.municipio.idMunicipio : remitente.municipio.idMunicipio },
        telefonoDestinatario: remitente.telefono || '',
        correoElectronico: props.detailsRadicado.datosSalida ? props.detailsRadicado.datosSalida.correoDestinatario : remitente.correo
      }
    }


  } else {
    formDatosDestinatario.value = {
      formaEnvio: remitente.correo ? opEnvio.value.find(it => it.label === 'Correo electrónico certificado') : opEnvio.value.find(it => it.label === 'Courier'),
      tipoDocumento: { label: remitente.tipoDocumento.nombre, value: remitente.tipoDocumento.id },
      numeroDocumentoDestinatario: remitente.numeroDocumento,
      nombreDestinatario: remitente?.nombre,
      direccionDestinatario: remitente.direccion,
      paisDestinatario: { label: props.detailsRadicado.remitente.pais.nombre, value: props.detailsRadicado.remitente.pais.nombre },
      departamentoDestinatario: { label: remitente.departamento?.nombre, value: remitente.departamento?.nombre },
      municipioDestinatario: { label: remitente.municipio?.nombre, value: remitente.municipio?.nombre },
      telefonoDestinatario: remitente.telefono || '',
      correoElectronico: remitente.correo
    }
  }

  formSalida.value = {
    anexos: '',
    asunto: '',
    observacion: '',
    tipoDocumentoAfectado: { label: afectado.tipoDocumento.nombre, value: afectado.tipoDocumento.id },
    numeroDocumentoAfectado: afectado.numeroDocumento,
    nombreAfectado: afectado.nombre
  }

  const datosSalida = props.detailsRadicado?.datosSalida
  if (datosSalida) {
    formSalida.value.anexos = datosSalida?.anexos,
      formSalida.value.asunto = datosSalida?.asunto,
      formDatosDestinatario.value.formaEnvio = { label: datosSalida?.formaEnvio.nombre, value: datosSalida?.formaEnvio.id },
      formSalida.value.observacion = datosSalida?.observacion
  }
}

const validateIsDisabled = () => {
  isDisabled.value = props.detailsRadicado?.estadoProceso?.estado === 'Por revisar';
}
onMounted(async () => {
  validateIsDisabled()
  await getData()
})
</script>
