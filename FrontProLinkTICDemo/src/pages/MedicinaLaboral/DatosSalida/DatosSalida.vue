<template>
  <div>
    <div>
      <q-tab-panels class="tw-bg-transparent" keep-alive v-model="step" animated>
        <q-tab-panel :name="1" class="tw-p-0 tw-pb-2">
          <StepOne @next-step="step++; stepTwo = true" :datos-salida="datosSalidaForm" :docs="docs" :ml-data="mlData"
            :is-disabled="isDisabled" @cancel="cancelModal = true" />
        </q-tab-panel>

        <q-tab-panel :name="2" class="tw-p-0 tw-pb-2">
          <StepTwo v-if="stepTwo" :datos-salida="datosSalidaForm" @previous-step="takeTwoForm" @next-step="step++"
            @is-send="giveDataSend" @cancel="cancelModal = true" :form-two="formTwo" />
        </q-tab-panel>

        <q-tab-panel :name="3" class="tw-p-0 tw-pb-2">
          <StepThree v-if="step === 3" :datos-salida="datosSalidaForm" @save="saveDatosSalida" @previous-step="step--"
            @cancel="cancelModal = true" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>

  <Modal v-model:model-value="cancelModal" title="¡Espera un momento!" text="Al cancelar el proceso perderá los datos
  ingresados en el formulario, ¿desea realizar la acción?" :is-success="false" textButtonCancel="No" cancel-button
    @handleAccept=" cancelModal = false; resetForm();" text-button="Si" @close-modal="() => (cancelModal = false)" />

  <Modal v-model="confirmModal" title="¡Espera un momento!"
    text="¿Está seguro que desea enviar el trámite para aprobación?" :is-success="false" text-button="SI" cancel-button
    text-button-cancel="NO" @handleAccept="() => { confirmModal = false; successModal = true }"
    @closeModal="confirmModal = false" />

  <Modal v-model="successModal" title="Confirmación" text="¿Está seguro que desea enviar el trámite para aprobación?"
    is-success text-button="OK" @handleAccept="successModal = false" />

  <Modal v-model="showModalOk" title="Exito" :text="`Los datos de salida han sido confirmados correctamente`" is-success
    text-button="Aceptar" @handleAccept="reload" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import StepOne from "./StepOne/StepOne.vue";
import StepTwo from "./StepTwo/StepTwo.vue";
import StepThree from "./StepThree/StepThree.vue";
import Modal from "components/Modal/Modal.vue";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { useAuthStore } from "src/stores/auth.store";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { Medicina } from "src/interfaces";
import { getAcronimobyDoc } from "src/helpers/prefijoTipoDoc";

const props = withDefaults(defineProps<{
  mlData: Medicina,
  docs: any,
  isDisabled: boolean
}>(), {})

const emit = defineEmits(['success', 'successSave'])
const auth = useAuthStore()

const prefijoAsunto = props.mlData.asignacion?.datosSalida?.documentoSalida?.prefijo?.prefijo?.nombre || ''
const nameEnterprise = 'Positiva S.A'
const tipoDocAsunto = getAcronimobyDoc(props.mlData.afectado.tipoDocumento.nombre)
const numDocAsunto = props.mlData.afectado.numeroDocumento
const nombreAsunto = props.mlData.afectado.nombre
const gestionadorOficinaAsunto = props.mlData.asignacion.idGestionador.usuarioRelaciones.filter((e) => e.rol?.nombre == auth.$state.userInfo.role && e.oficina?.id == auth.$state.userInfo.oficina)[0].oficina.nombre

const radicadoAsunto = props.mlData.idRadicado

const partesAsunto = [prefijoAsunto, tipoDocAsunto, numDocAsunto, nombreAsunto].filter(Boolean)
const asunto1 = partesAsunto.join(' - ').trim()
const asunto2 = [nameEnterprise, ...partesAsunto, gestionadorOficinaAsunto, radicadoAsunto].filter(Boolean).join(' - ').trim()

const usuariosCopiaInterna = props.mlData.asignacion?.datosSalida?.copiasInternas?.map((e) => {
  return {
    dependencia: e?.dependencia?.idSeccionSubSeccion,
    funcionario: e?.funcionario?.id
  }
}) ?? []

const usuariosCopiaExterna = props.mlData.asignacion?.datosSalida?.copiasExternas?.map((e) => {
  return {
    formaEnvio: e.formaEnvio.id,
    tipoDocumentoDestinatario: e.tipoDocumentoDestinatario.id,
    nombreDestinatario: e.nombreDestinatario,
    direccionDestinatario: e.direccionDestinatario,
    paisDestinatario: e.paisDestinatario.idPais,
    departamentoDestinatario: e.departamentoDestinatario.idDepartamento,
    municipioDestinatario: e.municipioDestinatario.idMunicipio,
    telefonoDestinatario: e.telefonoDestinatario,
    correoElectronico: e.correoElectronico
  }
})

const tipoDocEntity = {
  label: props.mlData.asignacion?.datosSalida?.tipoDocumentoDestinatario?.nombre || props.mlData.remitente.tipoDocumento.nombre,
  value: props.mlData.asignacion?.datosSalida?.tipoDocumentoDestinatario?.id || props.mlData.remitente.tipoDocumento.id
}

const tipoDocEntityAfectado = {
  label: props.mlData.asignacion?.datosSalida?.tipoDocumentoAfectado?.nombre || props.mlData.afectado.tipoDocumento.nombre,
  value: props.mlData.asignacion?.datosSalida?.tipoDocumentoAfectado?.id || props.mlData.afectado.tipoDocumento.id
}

const paisEntity = {
  label: props.mlData.asignacion?.datosSalida?.pais?.nombre || props.mlData.remitente.pais.nombre,
  value: props.mlData.asignacion?.datosSalida?.pais?.idPais || props.mlData.remitente.pais.idPais
}

const depEntity = {
  label: props.mlData.asignacion?.datosSalida?.departamento?.nombre || props.mlData.remitente.departamento.nombre,
  value: props.mlData.asignacion?.datosSalida?.departamento?.idDepartamento || props.mlData.remitente.departamento.idDepartamento
}

const munEntity = {
  label: props.mlData.asignacion?.datosSalida?.municipio?.nombre || props.mlData.remitente.municipio.nombre,
  value: props.mlData.asignacion?.datosSalida?.municipio?.idMunicipio || props.mlData.remitente.municipio.idMunicipio
}

const formEnvioEntity = {
  label: props.mlData.asignacion?.datosSalida?.formaEnvio?.nombre,
  value: props.mlData.asignacion?.datosSalida?.formaEnvio?.id
}

const cantidadDocsSalida = props.docs?.filter((e) => { return e?.tipoDocumento === "SALIDA" }).length
const step = ref(1)
const confirmModal = ref(false)
const successModal = ref(false)
const cancelModal = ref(false)
const showModalOk = ref(false)

const formTwo = ref()
const stepTwo = ref(false)

const datosSalidaForm = ref({
  destinatario: {
    tipo_documento: tipoDocEntity,
    numero_documento: props.mlData.asignacion?.datosSalida?.numeroDocumentoDestinatario || props.mlData.remitente.numeroDocumento,
    nombre: props.mlData.asignacion?.datosSalida?.nombreDestinatario || props.mlData.remitente.nombre,
    direccion: props.mlData.asignacion?.datosSalida?.direccionDestinatario || props.mlData.remitente.direccion,
    pais: paisEntity,
    departamento: depEntity,
    municipio: munEntity,
    numero_celular: props.mlData.asignacion?.datosSalida?.telefonoDestinatario || props.mlData.remitente.telefono,
    correo: props.mlData.asignacion?.datosSalida?.correoDestinatario || props.mlData.remitente.email,
  },
  afectado: {
    tipo_documento: tipoDocEntityAfectado,
    numero_documento: props.mlData.asignacion?.datosSalida?.numeroDocumentoAfectado || props.mlData.afectado.numeroDocumento,
    nombre: props.mlData.asignacion?.datosSalida?.nombreAfectado || props.mlData.afectado.nombre,
  },
  forma_envio: formEnvioEntity.label ? formEnvioEntity : '',
  anexos: cantidadDocsSalida || 0,
  asunto: asunto1 || "",
  tipoCopia: "",
  observacion: props.mlData.asignacion?.datosSalida?.observacion || '',
  correoRespuestaAsunto: asunto2 || '',
  copiasInternas: usuariosCopiaInterna?.length > 0 ? usuariosCopiaInterna : [],
  copiasExternas: usuariosCopiaExterna?.length > 0 ? usuariosCopiaExterna : []
})

async function saveDatosSalida() {
  try {
    const newForm = { ...datosSalidaForm.value }
    // @ts-expect-error
    delete newForm.copia
    // @ts-expect-error
    newForm.destinatario.pais = newForm.destinatario?.pais?.value || newForm.destinatario?.pais
    // @ts-expect-error
    newForm.destinatario.tipo_documento = newForm.destinatario?.tipo_documento?.value || newForm.remitente?.tipo_documento
    // @ts-expect-error
    newForm.afectado.tipo_documento = newForm.afectado?.tipo_documento?.value || newForm.afectado?.tipo_documento
    // @ts-expect-error
    newForm.destinatario.departamento = newForm.destinatario.departamento?.value || newForm.destinatario?.departamento
    // @ts-expect-error
    newForm.destinatario.municipio = newForm.destinatario.municipio?.value || newForm.destinatario?.municipio
    // @ts-expect-error
    newForm.forma_envio = newForm.forma_envio?.value || newForm.forma_envio
    if (Number(datosSalidaForm.value.tipoCopia) === 3) {
      newForm.copiasExternas = []
      newForm.copiasInternas = []
    }

    const newObject = {
      formaEnvio: newForm.forma_envio,
      tipoDocumentoDestinatario: newForm.destinatario.tipo_documento,
      nombreDestinatario: newForm.destinatario.nombre,
      numeroDocumentoDestinatario: newForm.destinatario.numero_documento,
      direccionDestinatario: newForm.destinatario.direccion,
      pais: newForm.destinatario.pais,
      departamento: newForm.destinatario.departamento,
      municipio: newForm.destinatario.municipio,
      telefonoDestinatario: newForm.destinatario.numero_celular,
      correoDestinatario: newForm.destinatario.correo,
      anexos: newForm.anexos,
      asunto: newForm.asunto,
      observacion: newForm.observacion,
      tipoDocumentoAfectado: newForm.afectado.tipo_documento,
      numeroDocumentoAfectado: newForm.afectado.numero_documento,
      nombreAfectado: newForm.afectado.nombre,
      tipoCopia: newForm.tipoCopia,
      correoRespuestaAsunto: newForm.correoRespuestaAsunto,
      correoRespuestaCuerpoCorreo: '',
      copiasExternas: newForm.copiasExternas,
      copiasInternas: newForm.copiasInternas,
      usuario: auth.$state.userInfo.name
    }

    const response = await sgdeaAxios.post(`/medicina/datosSalida/${props.mlData.id}`, newObject)
    if (response.status == 200 || response.status == 201) {
      showModalOk.value = true
      await crearTrazabilidad({
        proceso: "ML" + props.mlData.id,
        secuencia: props.mlData.idRadicado,
        estado: props.mlData.estado.estado,
        descripcion: `${auth.$state.userInfo.name} ha guardado datos de salida para el caso`,
        comentario: 'Adjunto',
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} modificó los datos de salida del caso`,
        tramite: 'Medicina Laboral',
      })
      emit("successSave")
    }
  } catch (error) {
    toast.error("Ha ocurrido un error")
  }
}

async function resetForm() {
  emit("success")
}

function reload() {
  emit("success")
}

const takeTwoForm = (info) => {
  formTwo.value = info
  step.value--
  stepTwo.value = false
}

const giveDataSend = async () => {
  await saveDatosSalida()
}

</script>
