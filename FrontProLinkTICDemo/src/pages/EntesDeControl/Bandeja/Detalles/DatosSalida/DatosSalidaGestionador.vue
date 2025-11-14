<template>
  <q-tab-panels keep-alive v-model="step" animated>
    <q-tab-panel class="tw-bg-white" :name="1">
      <StepOne @next-step="step++" keep-alive :datosSalida="datosSalidaForm" :informacionGeneral="informacionGeneral" @cancel="cancelModal = true" />
    </q-tab-panel>
    <q-tab-panel class="tw-bg-white" :name="2">
      <StepTwo :datosSalida="datosSalidaForm" keep-alive @save="saveDatosSalida" :informacionGeneral="informacionGeneral" @next-step="step++" @previous-step="step--" @cancel="cancelModal = true" />
    </q-tab-panel>
  </q-tab-panels>

  <Modal v-model:model-value="cancelModal" title="¡Espera un momento!" text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?" :is-success="false" textButtonCancel="No" cancel-button @handleAccept=" cancelModal = false; resetForm();" text-button="Si" @close-modal="() => (cancelModal = false)" />

  <Modal v-model="confirmModal" title="¡Espera un momento!" text="¿Está seguro que desea enviar el trámite para aprobación?" :is-success="false" text-button="SI" cancel-button text-button-cancel="NO" @handleAccept="() => { confirmModal = false; successModal = true }" @closeModal="confirmModal = false" />

  <Modal v-model="successModal" title="Confirmación" text="¿Está seguro que desea enviar el trámite para aprobación?" is-success text-button="OK" @handleAccept="successModal = false" />

  <Modal v-model="showModalOk" title="Exito" :text="`Los datos de salida han sido confirmados correctamente`" is-success text-button="Aceptar" @handleAccept="reload" />
</template>

<script setup lang="ts">
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { useAuthStore } from "src/stores/auth.store";
import StepThree from "./StepThree/StepThree.vue";
import Modal from "components/Modal/Modal.vue";
import StepOne from "./StepOne/StepOne.vue";
import StepTwo from "./StepTwo/StepTwo.vue";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { InfoGeneral } from '../types';
import { useRoute } from "vue-router";
import { ref, onMounted } from 'vue'
import { useQuasar } from "quasar";

const q = useQuasar();

const route = useRoute();
const ente_id = ref(String(route.params.id));

const step = ref(1)
const confirmModal = ref(false)
const successModal = ref(false)
const cancelModal = ref(false)
const showModalOk = ref(false)

const props = defineProps<{informacionGeneral: InfoGeneral;}>();
const emit = defineEmits(['getInformacionGeneral']);

const datosSalidaForm = ref(
{
  id: null,
  anexos: null,
  asunto: null,
  observacion: null,
  destinatario: {
    nombre: null,
    direccion: null,
    correo: null,
    usuario_id: null,
    forma_envio_id: null,
    tipo_documento_id: null,
    tipo_documento_nombre: null,
    numero_documento: null,
    pais_id: null,
    departamento_id: null,
    departamento_nombre: null,
    municipio_id: null,
    municipio_nombre: null,
    numero_celular: null,
  },
  copia:'',
  usuariosCopia: [],
  nombreAfectado: null,
  numeroDocumentoAfectado: null,
  tipoDocumentoAfectado: null
}
);

onMounted( () => {
  getDatosSalida();
});

const getDatosSalida = () => {
  sgdeaAxios.get(`api/entes/obtener-datos-salida/${ente_id.value}`)
  .then( (response) => {
    setDatosSalida(response.data);
  })
  .catch( (error) => {
    console.error(error);
    setDatosSalida(null);
  })
}

const setDatosSalida = (data) => {
  datosSalidaForm.value.id = data?.id || null;
  datosSalidaForm.value.asunto = data?.asunto;
  datosSalidaForm.value.observacion = data?.observacion;
  datosSalidaForm.value.anexos = data?.anexos || null;

  //destinatario
  datosSalidaForm.value.destinatario.forma_envio_id = data?.destinatario?.forma_envio_id == 0 ? null : data?.destinatario?.forma_envio_id,
  datosSalidaForm.value.destinatario.tipo_documento_id = data?.destinatario?.tipo_documento_id || props.informacionGeneral.informacionRemitente.tipoDocumentoRemitente || null;
  datosSalidaForm.value.destinatario.numero_documento = data?.destinatario?.numero_documento || props.informacionGeneral.informacionRemitente.numeroDocumentoremitente || null;
  datosSalidaForm.value.destinatario.nombre = data?.destinatario?.nombre || props.informacionGeneral.informacionRemitente.nombreRemitente;


  datosSalidaForm.value.destinatario.direccion = data?.destinatario?.direccion ?? props.informacionGeneral.informacionContacto.direccionContacto;
  datosSalidaForm.value.destinatario.pais_id = data?.destinatario?.pais_id || props.informacionGeneral.informacionContacto.paisContacto;
  datosSalidaForm.value.destinatario.departamento_id = data?.destinatario?.departamento_id || props.informacionGeneral.informacionContacto.departamentoContacto;
  datosSalidaForm.value.destinatario.municipio_id = data?.destinatario?.municipio_id || props.informacionGeneral.informacionContacto.municipioContacto;
  datosSalidaForm.value.destinatario.numero_celular = data?.destinatario?.numero_celular || props.informacionGeneral.informacionContacto.telefonoCelular;
  datosSalidaForm.value.destinatario.correo = data?.destinatario?.correo || props.informacionGeneral.informacionContacto.email;

  //copia
  datosSalidaForm.value.copia = data?.copia;
  datosSalidaForm.value.usuariosCopia = data?.usuariosCopia;

  //afectado
  datosSalidaForm.value.nombreAfectado = data?.nombreAfectado || props.informacionGeneral.informacionAfectado.nombresAfectado;
  datosSalidaForm.value.numeroDocumentoAfectado = data?.numeroDocumentoAfectado || props.informacionGeneral.informacionAfectado.numeroDocumentoAfectado;
  datosSalidaForm.value.tipoDocumentoAfectado = data?.tipoDocumentoAfectado.id || props.informacionGeneral.informacionAfectado.tipoDocumentoAfectado;
}

const errorForm = () => {
  toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos.")
}


const saveDatosSalida = () => {
  const data = {...datosSalidaForm.value, tipoDocumentoAfectado: { id: datosSalidaForm.value.tipoDocumentoAfectado} }
  sgdeaAxios.post(`api/entes/guardar-datos-salida/${ente_id.value}`, data)
  .then( (response) => {
    toast.success('Datos de salida actualizados correctamente');
    newTrazabilidad();
    getDatosSalida();
    emit('getInformacionGeneral');
    step.value = 1
  })
  .catch( (error) => {
    console.error(error);
  })
};

const newTrazabilidad = async () => {
  const status = datosSalidaForm.value?.id ? "actualizado" : "guardado";

  await crearTrazabilidad({
    proceso: `ENTC${props.informacionGeneral.id}`,
    secuencia: props.informacionGeneral.nroRadicado,
    estado: props.informacionGeneral.estado.estado,
    descripcion: `Ha ${status} los datos de salida del radicado`,
    comentario: "Datos de salida",
    nombre: useAuthStore().$state.userInfo.name,
    accion: `Se han ${status} los datos de salida del radicado`,
    tramite: "Entes de Control",
  });
};

async function resetForm() {
  location.reload()
}

function reload() {
  location.reload()
}
</script>
