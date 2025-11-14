<template>
  <div>
    <div class="tw-flex tw-justify-between tw-items-center">
      <div>
        <div class="tw-mt-2">
          <q-btn icon="chevron_left" label="Volver" flat class="tw-text-[#ff7500]" @click="router.go(-1)" />
        </div>
        <p class="pl-4 tw-font-bold tw-text-3xl tw-mb-3 text-bold">
          Radicado {{ dataReclasificacion?.informacionCaso?.idRadicado ||
            dataReclasificacion?.informacionCaso?.nroRadicado }}
        </p>
        <div
          :class="`tw-inline-block tw-p-1.5 tw-px-4 tw-rounded-lg tw-border ${ESTADOS[dataReclasificacion?.solicitud?.estado]}`">
          <span class="tw-font-semibold">{{ dataReclasificacion?.solicitud?.estado == 'PENDIENTE' ? 'Pendiente' :
            dataReclasificacion?.solicitud?.estado }}</span>
        </div>
      </div>
      <div class="tw-flex tw-justify-end tw-items-center tw-gap-2 tw-min-h-[36px] tw-w-[49%]"
        v-if="labelComponet === 'Solicitud reclasificación'">
        <q-btn label="Rechazar" color="secondary" class="tw-w-[125px] tw-h-8" @click="showModalRechazarRecl = true" />
        <q-btn label="Aceptar" color="primary" class="tw-w-[125px] tw-h-8"
          @click="showModalConfirmAceptarRecl = true" />
      </div>

    </div>
    <q-card :key="uiTabsKey" class="tw-rounded-xl tw-my-4 tw-mb-4" flat bordered>
      <q-tabs v-model="tab" inline-label no-caps outside-arrows align="left"
        class="tw-rounded-lg tw-bg-white custom-tabs tw-flex rowsTab-alingCenter" indicator-color="transparent"
        active-color="primary">
        <template v-if="true">
          <q-tab :key="tab.label" :name="tab.label" :ripple="false"
            class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]" @click="showComponents(tab.label)"
            v-for="tab in items" :label="tab.label" :icon="tab.icon">
          </q-tab>
        </template>
      </q-tabs>
    </q-card>
    <div v-if="dataEstado">
      <InformacionGeneral v-if="labelComponet == 'Información general'" :dataReclasificacion="dataReclasificacion" />
    </div>
    <SolicitudReclasificacion v-if="labelComponet == 'Solicitud reclasificación'"
      :dataReclasificacion="dataReclasificacion" />

    <Trazabilidad v-if="labelComponet == 'Trazabilidad'" />

    <DocumentosRelacionadosEntes v-if="labelComponet == 'Documentos relacionados' && moduloOrigen === '11'"
      :detailsRadicado="informacionGeneral" />

    <DocumentosRelacionadosPQRD :visualize="getBlobToIframe" :only-read-user="readOnlyGestionador"
      :segundaDevolucion="segundaDevolucion" v-model:detallePqrd="responsePqrd"
      v-if="labelComponet == 'Documentos relacionados' && moduloOrigen === '8'" :show-modal="modalDocuments"
      @changeDocType="changeDocType" @back-view="labelComponet = 'Información General'" v-model:finished="finished"
      @find-docs="getAllRegisters()" />
    <DocumentosRelacionadosTutela v-if="labelComponet == 'Documentos relacionados' && moduloOrigen === '10'"
      :visualize="getBlobToIframe" @find-docs="getAllRegisters" :is-soporte="true" :active-absolute="true"
      :detalle-tutela="detalleTutela" />
    <DocumentosRelacionadosML :visualize="getBlobToIframe" v-model:detalleML="responseML"
      v-show="labelComponet === 'Documentos relacionados' && moduloOrigen === '12'" :show-modal="modalDocuments"
      @changeDocType="changeDocType" v-model:finished="finished" />

    <DocumentosRelacionadosCOR :visualize="getBlobToIframe" v-model:detalleRadicado="detalleRadicado"
      v-show="labelComponet === 'Documentos relacionados' && moduloOrigen === '6'" :show-modal="modalDocuments"
      v-model:finished="finished" @updated="getData()" />
    <ComentariosPQRD
      v-if="labelComponet == 'Comentarios' && moduloOrigen === '8'"
      :only-read-user="false"
      :show-modal="true"
      :pqrd-data="commentDataPqrd"
      @closeModal="noteModal = false"
    />
    <ComentariosCOR
      v-if="labelComponet == 'Comentarios' && moduloOrigen === '6'"
      :details-radicado="commentDataCor"
      :key="incrementaKey"
      @update="handleUpdate"
      text-default="Ha comentado sobre la radicación"
     />

    <ComentariosML
      v-if="labelComponet == 'Comentarios' && moduloOrigen === '12'"
      :details-radicado="commentDataML"
      text-default="Ha comentado sobre la radicación"
      :show-modal="noteModal"
      @closeModal="noteModal = false"
    />

    <ComentariosENT
      v-if="labelComponet == 'Comentarios' && moduloOrigen === '11'"
      :details-radicado="commentDataENT"
    />

    <ConfirmModal text-cancel-modal="NO" text-confirm-modal="SÍ"
      text-show-modal="¿Está seguro de aprobar la solicitud de reclasificación?"
      @update:show-modal="() => (showModalConfirmAceptarRecl = false)" @confirm-modal="aceptarReclasificacion()"
      :show-modal="showModalConfirmAceptarRecl" />

    <RechazarModal title="Rechazo de reclasificación" @hide-modal="showModalRechazarRecl = false"
      :show-modal="showModalRechazarRecl" @update-modal="updateModalRechazar"
      text="Escriba aquí su motivo de rechazo." />

  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { sgdeaAxios } from "src/services";
import { onMounted, ref } from "vue";
import { ESTADOS } from "src/assets/estados/estados";
import { useAuthStore } from "src/stores/auth.store";
import InformacionGeneral from "./InformacionGeneral/informacionGeneral.vue";
import SolicitudReclasificacion from "./SolicitudReclasificacion/solicitudReclasificacion.vue"
import ConfirmModal from "src/components/Modal/ConfirmModal.vue";
import RechazarModal from "src/components/Modal/RechazarModal.vue";
import Trazabilidad from "../Trazabilidad/trazabilidad.vue";
import ComentariosPQRD from "../Comentarios/comentarios.vue";
import ComentariosCOR from "src/pages/Correspondencia/Comentarios/Comentarios.vue";
import ComentariosML from "src/pages/MedicinaLaboral/Comentarios/comentarios.vue";
import ComentariosENT from "src/pages/EntesDeControl/Bandeja/Detalles/Comentarios/Comentarios.vue";
import { ITutelaDetalles } from "src/pages/SGDA/ClasificacionDocumental/Tutelas";
import { Ref } from "vue";
import { IRadicadoDetalles } from "src/pages/Correspondencia";
import DocumentosRelacionadosEntes from "src/pages/EntesDeControl/Bandeja/Detalles/DocumentosRelacionados/DocumentosRelacionados.vue";
import { dataMapping, informacionGeneralEmptyDefault } from "src/pages/EntesDeControl/Bandeja/Detalles/utils";
import { Medicina } from "src/interfaces";
import { toast } from "src/helpers/toast";
import DocumentosRelacionadosPQRD from "../DocumentosRelacionados/DocumentosRelacionados.vue";
import DocumentosRelacionadosTutela from "src/pages/SGDA/ClasificacionDocumental/Tutelas/DocumentosRelacionados/DocumentosRelacionados.vue";
import axios from "axios";
import DocumentosRelacionadosML from "src/pages/MedicinaLaboral/DocumentosRelacionados/DocumentosRelacionados.vue";
import DocumentosRelacionadosCOR from "src/pages/Correspondencia/DocumentosRelacionados/DocumentosRelacionados.vue";
import { crearTrazabilidad } from "src/helpers/trazabilidad";



const uiTabsKey = ref(0);
const tab = ref("infoGeneral");
const route = useRoute();
const router = useRouter();
const dataReclasificacion = ref();
const labelComponet = ref("Información general");
const dataEstado = ref(false);
const showModalConfirmAceptarRecl = ref(false);
const showModalRechazarRecl = ref(false);
const auth = useAuthStore();
const moduloOrigenValue = ref()
const moduloOrigen = route.query.moduloOrigen;
const noteModal = ref(false);
interface commentDataPqrd {
  id: string;
  idRadicado: string;
  estado: object;
}

interface commentDataCor{
  id: string;
  idRadicado: string;
  estadoProceso: object;
  tipoTramite: object;
}

interface commentDataENT{
  id: string;
  nroRadicado: string;
  estado: object;
}

const commentDataPqrd = ref<commentDataPqrd | null>(null);
const commentDataCor = ref<commentDataCor | null>(null);
const commentDataML = ref<commentDataPqrd | null>(null);
const commentDataENT = ref<commentDataENT | null>(null);
const incrementaKey = ref(0);
const responseML: Ref<Medicina | null> = ref(null);
const detalleTutela: Ref<Partial<ITutelaDetalles>> = ref({});
const detalleRadicado: Ref<Partial<IRadicadoDetalles>> = ref({});
const informacionGeneral = ref<any>(informacionGeneralEmptyDefault);
const responsePqrd = ref({});
// Definición de propiedades y métodos
const readOnlyGestionador = ref(false);
const segundaDevolucion = ref(false);
const data = ref(null);

const modalDocuments = ref(true);
const finished = ref(false);
const ente_id = ref(String(route.params.id));
const idRadicado = ref("");



const getBlobToIframe = async (id, list) => {
  // Lógica para obtener el blob y mostrar en iframe
};

const changeDocType = (items) => {
  // Lógica para cambiar el tipo de documento
};

const getAllRegisters = () => {
  // Lógica para obtener todos los registros
};

const handleUpdate = () => {
  incrementaKey.value++;
};

const items = ref([
  {
    label: "Información general",
    icon: "info",
  },
  {
    label: "Documentos relacionados",
    icon: "folder_open",
  },
  {
    label: "Trazabilidad",
    icon: "history",
  },
  {
    label: "Comentarios",
    icon: "forum",
  },
  {
    label: "Solicitud reclasificación",
    icon: "shuffle",
  },
]);

onMounted(async () => {
  getData();

  if (moduloOrigen === '11') getInformacionGeneral()

  if (moduloOrigen === '8') getDatapqrd()

  if (moduloOrigen === '12') getDataMedicina()


});
const getDatapqrd = async () => {
  const isAsignacion = route.query?.idAsignacion
    ? `&idAsignacion=${route.query?.idAsignacion}`
    : "";

  try {
    const id = route.params.id;
    const response = await sgdeaAxios.get(
      `/pqrd/buscarCaso?idCaso=${id}${isAsignacion}&userId=${auth.$state.userInfo.userid}`
    );
    responsePqrd.value = response.data;
  } catch (error) {
    toast.error("Ocurrió un problema al obtener el caso.");
  }
};
const getInformacionGeneral = async () => {
  try {
    const response = await sgdeaAxios.get(`/api/entes/obtenerEnteControl/${ente_id.value}`);
    if (response.status === 200) {
      const { data } = response;
      informacionGeneral.value = dataMapping(data);
    }
  } catch (error) {
    console.error("Error", error);
  }
};
const getDataMedicina = async () => {
  try {
    const id = route.params.id;
    const response = await sgdeaAxios.get<Medicina>(`/medicina/casos/${id}`);
    responseML.value = response.data;

  } catch (error) {
    toast.error("Ocurrió un problema al obtener el caso.");

  }
};

const getData = async () => {
  try {
    const id = route.params.id;
    const moduloOrigen = route.query.moduloOrigen;
    moduloOrigenValue.value = moduloOrigen;

    const response = await sgdeaAxios.get(`/solicitud-reclasificacion/informacion/${moduloOrigen}/${id}`);
    if (response.status === 200 || response.status === 201) {
      dataReclasificacion.value = response.data;
      dataEstado.value = true;

      commentDataPqrd.value = {
        id: response.data.informacionCaso.id,
        idRadicado: response.data.informacionCaso.idRadicado,
        estado: response.data.informacionCaso.estado,
      }

      commentDataCor.value = {
        id: response.data.informacionCaso.id,
        idRadicado: response.data.informacionCaso.idRadicado,
        estadoProceso: response.data.informacionCaso.estadoProceso,
        tipoTramite: response.data.informacionCaso.tipoTramite,
      }

      commentDataML.value = {
        id: response.data.informacionCaso.id,
        idRadicado: response.data.informacionCaso.idRadicado,
        estado: response.data.informacionCaso.estado,
      }

      commentDataENT.value = {
        id: response.data.informacionCaso.id,
        nroRadicado: response.data.informacionCaso.nroRadicado,
        estado: response.data.informacionCaso.estado,
      }

      if (moduloOrigen === '10') {
        let url = "";
        if (process.env.API) {
          url = process.env.API;
        }
        detalleTutela.value = (
          await axios.get(`${url}tutela/info/${idRadicado.value}`, {})
        ).data;
      }
      if (moduloOrigen === '6') {
        detalleRadicado.value = (
          await sgdeaAxios.get(`/correspondencia/radicacion/${idRadicado.value}`)
        )?.data;
      }

    }
  } catch (error) {
    console.error(error);
  }
};

const aceptarReclasificacion = async () => {
  try {
    const id = dataReclasificacion.value.solicitud.id;
    const usuarioRespuestaId = auth.$state.userInfo.userid;
    const response = await sgdeaAxios.put(`/solicitud-reclasificacion/${id}/aprobar?usuarioRespuestaId=${usuarioRespuestaId}`);
    if (response.status === 200 || response.status === 201) {
      toast.success("Solicitud de reclasificación aprobada");
      router.go(-1);
    }
  } catch (error) {
    console.error(error);
  }
}

const showComponents = (name: string) => {
  labelComponet.value = name;
};

const rechazarReclasificacion = async (motivoRechazo: string) => {
  try {
    const id = dataReclasificacion.value.solicitud.id;
    const usuarioRespuestaId = auth.$state.userInfo.userid;

    const response = await sgdeaAxios.put(`/solicitud-reclasificacion/${id}/rechazar?motivoRechazo=${motivoRechazo}&usuarioRespuestaId=${usuarioRespuestaId}`);
    if (response.status === 200 || response.status === 201) {
      await crearTrazabilidad({
        proceso: `PQRD${dataReclasificacion.value.informacionCaso.id}`,
        secuencia: dataReclasificacion.value.informacionCaso.idRadicado,
        estado: "Rechazada",
        descripcion: `Usuario:${auth.$state.userInfo.name} \n` +
          `Estado: Rechazada \n` +
          `Motivo:${motivoRechazo}`,
        comentario: motivoRechazo,
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} rechazó la reclasificación de la PQRD`,
        tramite: "PQRD"
      });
      toast.success("Solicitud de reclasificación rechazada");
      router.go(-1);
    }
  } catch (error) {
    console.error(error);
  }
}

const updateModalRechazar = async (value) => {
  await rechazarReclasificacion(value.value)
};
</script>

<style></style>
