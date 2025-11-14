<template>
  <div>
    <div>
      <q-tab-panels keep-alive v-model="step" animated>
        <q-tab-panel class="tw-bg-white" :name="1">
          <StepOne
            @next-step="step++"
            keep-alive
            v-model:datos-salida="datosSalidaForm"
            @cancel="cancelModal = true"
            :estado="estado"
            :pqrd-data="props.pqrdData"
            :remitente="props.pqrdData.informacionRemitente"
          />
        </q-tab-panel>
        <q-tab-panel class="tw-bg-white" :name="2">
          <StepTwo
            v-model:datos-salida="datosSalidaForm"
            keep-alive
            @next-step="step++"
            @previous-step="step--"
            @cancel="cancelModal = true"
          />
        </q-tab-panel>
        <q-tab-panel class="tw-bg-white" :name="3">
          <StepThree
            v-model:datos-salida="datosSalidaForm"
            @save="saveDatosSalida"
            @previous-step="step--"
            @cancel="cancelModal = true"
          />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>

  <Modal
    v-model:model-value="cancelModal"
    title="¡Espera un momento!"
    text="Al cancelar el proceso perderá los datos
  ingresados en el formulario, ¿desea realizar la acción?"
    :is-success="false"
    textButtonCancel="No"
    cancel-button
    @handleAccept="
      cancelModal = false;
      resetForm();
    "
    text-button="Si"
    @close-modal="() => (cancelModal = false)"
  />

  <Modal
    v-model="confirmModal"
    title="¡Espera un momento!"
    text="¿Está seguro que desea enviar el trámite para aprobación?"
    :is-success="false"
    text-button="SI"
    cancel-button
    text-button-cancel="NO"
    @handleAccept="
      () => {
        confirmModal = false;
        successModal = true;
      }
    "
    @closeModal="confirmModal = false"
  />

  <Modal
    v-model="successModal"
    title="Confirmación"
    text="¿Está seguro que desea enviar el trámite para aprobación?"
    is-success
    text-button="OK"
    @handleAccept="successModal = false"
  />

  <Modal
    v-model="showModalOk"
    title="Exito"
    :text="`Los datos de salida han sido confirmados correctamente`"
    is-success
    text-button="Aceptar"
    @handleAccept="reload"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";

import StepOne from "./StepOne/StepOne.vue";
import StepTwo from "./StepTwo/StepTwo.vue";
import StepThree from "./StepThree/StepThree.vue";
import Modal from "components/Modal/Modal.vue";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { useAuthStore } from "src/stores/auth.store";
import { crearTrazabilidad } from "src/helpers/trazabilidad";

const props = withDefaults(defineProps<{
  pqrdData: any;
  estado: string;
}>(), {})

const step = ref(1)
const confirmModal = ref(false)
const successModal = ref(false)
const cancelModal = ref(false)
const showModalOk = ref(false)

onMounted(() => {
  getInitialData()
})

const auth = useAuthStore()

const datosSalidaForm = ref({
  "destinatario": {
    "nombre": "",
    "direccion": "",
    "correo": "",
    "usuario_id": 0,
    "forma_envio_id": 0,
    "tipo_documento_id": 0,
    "numero_documento": "",
    "pais_id": 0,
    "departamento_id": 0,
    "municipio_id": 0,
    "numero_celular": "",
    "numero_telefono": "",
    "tipo_documento_nombre": '',
    "pais_nombre": '',
    "departamento_nombre": '',
    "municipio_nombre": ''
  },
  "anexos": 0,
  "asunto": "",
  "copia": "Ninguna",
  "observacion": "",
  "usuariosCopia": [
    {
      "nombre": "",
      "direccion": "",
      "correo": "",
      "id": 0,
      "externo": true,
      "usuario_id": 0,
      "forma_envio_id": 0,
      "tipo_documento_id": 0,
      "numero_documento": "",
      "pais_id": 0,
      "departamento_id": 0,
      "municipio_id": 0,
      "numero_celular": "",
    }
  ]
})

async function getInitialData() {
  const response = await sgdeaAxios.get(`/pqrd/obtener-datos-salida/${props.pqrdData.id}`)


  if (response.data) {
    if (props.pqrdData.canalRadicacion.id !== 5) {
      datosSalidaForm.value = {
      ...response.data,
      destinatario: {
        ...response.data.destinatario,
        pais_nombre: response.data.destinatario?.pais_nombre ?? "Colombia",
        pais_id: response.data.destinatario?.pais_id ?? 425,
        departamento_nombre: response.data.destinatario?.departamento_nombre ?? "BOGOTÁ",
        departamento_id: response.data.destinatario?.departamento_id ?? 6,
        municipio_nombre: response.data.destinatario?.municipio_nombre ?? "BOGOTÁ D.C.",
        municipio_id: response.data.destinatario?.municipio_id ?? 149,
        direccion: response.data.destinatario?.direccion ?? "",
        forma_envio_id: response.data.destinatario?.forma_envio_id ?? 1,
      }
    }
    }else{
      // const responseUser = await sgdeaAxios.get(`/usuarios/133`)
      const responseUser = await sgdeaAxios.get(`/usuarios/${props.pqrdData.usuarioCreadorId}`)
      datosSalidaForm.value = {
      ...response.data,
      destinatario: {
        tipo_documento_id: 1,
        tipo_documento_nombre: "Cédula ciudadanía",
        numero_documento: responseUser.data.numeroDocumento ?? "",
        nombre: responseUser.data.fullname ?? "",
        numero_celular: responseUser.data.celular ?? "",
        correo: responseUser.data.email ?? "",
        pais_nombre: "Colombia",
        pais_id: responseUser.data.departamento?.idPais ?? 425,
        departamento_nombre: responseUser.data.departamento?.nombre ?? "BOGOTÁ",
        departamento_id: responseUser.data.departamento?.idDepartamento ?? 6,
        municipio_nombre: responseUser.data.municipio?.nombre ?? "BOGOTÁ D.C.",
        municipio_id: responseUser.data.municipio?.idMunicipio ?? 149,
        direccion: responseUser.data.direccion ?? "",
        forma_envio_id: response.data.destinatario?.forma_envio_id ?? 1,
      }
    }
    }

    if (props.pqrdData?.informacionContacto?.medioRespuestaEntity?.id == 1) {
      datosSalidaForm.value.destinatario.forma_envio_id = 2
    } else if (props.pqrdData?.informacionContacto?.medioRespuestaEntity?.id == 2) {
      datosSalidaForm.value.destinatario.forma_envio_id = 3
    }
  }
}

async function saveDatosSalida() {

  try {
    const newForm = { ...datosSalidaForm.value }
    const pais_nombre = newForm.destinatario.pais_nombre
    const departamento = newForm.destinatario.departamento_nombre
    const municipio = newForm.destinatario.municipio_nombre
    const documento = newForm.destinatario.tipo_documento_nombre
    delete newForm.destinatario.tipo_documento_nombre
    delete newForm.destinatario.pais_nombre
    delete newForm.destinatario.departamento_nombre
    delete newForm.destinatario.municipio_nombre
    // @ts-expect-error
    newForm.destinatario.pais_id = newForm.destinatario?.pais_id?.value || newForm.destinatario?.pais_id
    // @ts-expect-error
    newForm.destinatario.departamento_id = newForm.destinatario.departamento_id?.value || newForm.destinatario?.departamento_id
    // @ts-expect-error
    newForm.destinatario.municipio_id = newForm.destinatario.municipio_id?.value || newForm.destinatario?.municipio_id
    if (datosSalidaForm.value.copia == "Ninguna") {
      newForm.usuariosCopia = []
    }
    const response = await sgdeaAxios.post(`/pqrd/guardar-datos-salida/${props.pqrdData.id}`, newForm)
    if (response.status == 200 || response.status == 201) {
      showModalOk.value = true
      await crearTrazabilidad({
        proceso: "PQRD" + props.pqrdData.id,
        secuencia: props.pqrdData.idRadicado,
        estado: props.pqrdData.estado.estado,
        descripcion:`Destinatario: Nombre:${newForm.destinatario.nombre} Correo:${newForm.destinatario.correo ?? ""}` +
        ` País: ${pais_nombre ?? ""}`+
        `Departamento: ${departamento ?? ""} Dirección: ${newForm.destinatario.direccion ?? ""}`+
        `Municipio: ${municipio ?? ""} `
        +`Documento: ${documento ?? ""} - ${newForm.destinatario.numero_documento ?? ""}`+
        ` Teléfono: ${newForm.destinatario.numero_celular ?? "" }` +
        `Anexos: ${newForm.anexos ?? ""}` +
        `Asunto: ${newForm.asunto ?? ""}`+ `Copia: ${newForm.copia ?? ""}`
        ,
        comentario: 'Adjunto',
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} modificó los datos de salida de la PQRD ${props.pqrdData.idRadicado}`,
        tramite: props.pqrdData.informacionSolicitud.tipologiaEntity.id == 7 ? 'PQRD Express' : 'PQRD',
      })
    }
  } catch (error) {
    toast.error("Ha ocurrido un error")
   }
}

async function resetForm() {
  location.reload()
}

function reload() {
  location.reload()
}
</script>
