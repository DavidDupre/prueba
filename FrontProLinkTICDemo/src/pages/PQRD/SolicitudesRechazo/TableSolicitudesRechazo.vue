<template>
  <TableParrafos :TABLE_HEADER="PARRAFOS_PENDIENTES_HEADER" :TABLE_BODY="dataTable"
    :TABLE_TOTAL_ROWS="dataTableTotalRows" :selection="undefined" :isLoading="loadingTable"
    :pagination.sync="pagination" v-model:item-selected="selection" @aprobar="aprobar" @rechazar="rechazar"
     @exclude-cloned="excludeCloned"  @replace-cloned="replaceCloned" @assign-cloned="assignCloned"
     @handlePageChange="handlePageChange" @handleRowsPerPageChange="handleRowsPerPageChange" />
  <ConfirmModal text-cancel-modal="No" text-confirm-modal="Si"
    :text-show-modal="`¿Desea aceptar el rechazo del Gestionador clonado ${gestName}?`"
    @update:show-modal="() => (showModalAprobar = false)" @confirm-modal="onSubmitAprobar"
    :show-modal="showModalAprobar" />
  <ConfirmModal text-cancel-modal="No" text-confirm-modal="Si"
    text-show-modal="¿Está seguro de excluir el usuario clonado?"
    @update:show-modal="cancelProcessedCloned" @confirm-modal="onSubmitExclude"
    :show-modal="showModalExclude" :persistent="true" />
  <ConfirmModal text-cancel-modal="No" text-confirm-modal="Si"
    text-show-modal="¿Está seguro de reemplazar el usuario clonado?"
    @update:show-modal="cancelProcessedCloned" @confirm-modal="onSubmitReplace"
    :show-modal="showModalReplace" :persistent="true" />
  <AssignClonedModal v-if="showModalAssign" :dataClonados="dataTable"
    @update:show-modal="cancelProcessedCloned" @confirm-modal="onSubmitAssign" :pqrdData="props.pqrdData"
    :show-modal="showModalAssign" :persistent="true" :reemplazar="reemplazarClonado" :seleccionReemplazo="selectedClonedId"  />
</template>

<script lang="ts" setup>
import { sgdeaAxios } from 'src/services';
import ConfirmModal from "src/components/Modal/ConfirmModal.vue";
import { useAuthStore } from 'src/stores/auth.store';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import TableParrafos from './Table.vue'
import { inputRequired, maxLengthInput, minLengthInput } from "src/helpers/validations";
import { PARRAFOS_PENDIENTES_HEADER } from '.';
import { toast } from "src/helpers/toast";
import AssignClonedModal from "pages/PQRD/SolicitudesRechazo/AssignClonedModal.vue";

interface ParrafosPendientes {
  id: number;
  parrafo: string;
  aceptado: boolean;
  rechazado: boolean;
  motivoRechazo: string,
  id_asignacion: number;
  id_gestionador: number;
  nombre_gestionador: string;
  apellido_gestionador: string;
  nombre_dependencia: string;
  fecha_creacion: string;
}

const props = defineProps<{
    pqrdData: any[];
  }>()

interface FilterParrafosPendientes {
  pageNo: number;
  pageSize: number;
}

const route = useRoute();
const loadingTable = ref(false);
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0
});
const currPage = ref(0);
const pageSize = ref(100);
const data = ref<ParrafosPendientes[]>([]);
const showModalRechazar = ref(false)
const form = ref<FilterParrafosPendientes>({
  pageNo: 0,
  pageSize: 10
});
const observations = ref();
const selection = ref([]);
const auth = useAuthStore();
const solicitud = ref();
const gestName = ref();
const showModalAprobar = ref(false);
const showModalExclude = ref(false);
const showModalReplace = ref(false);
const showModalAssign = ref(false);
const dataTableTotalRows = ref<number>(0);
const dataTable = ref<ParrafosPendientes[]>([]);
const { getUserInfo } = useAuthStore();
const selectedClonedId = ref<number>(0);
const reemplazarClonado = ref(false);

onMounted(async () => {
  await getData();
});

const getData = async () => {
  const pqrdId = route.params.id;
  const userInfo = await getUserInfo();
  const userId = userInfo.userid;

  if (!pqrdId) return;

  try {
    const response = await sgdeaAxios.get(`/pqrd/asignaciones/listadopqrdclonacion`, {
      params: {
        idPqrd: pqrdId,
        page: form.value.pageNo,
        size: form.value.pageSize,
      },
    });
    // excluir a usuario actual que es el consolidador
    dataTable.value = response.data.content
      .filter(item => item.gestionador?.id !== auth.userInfo.userid)
      .map(item => ({
        id: item.gestionador?.id,
        oficina: item.gestionador?.usuarioRelaciones?.[0]?.oficina?.nombre
          || item.gestionador?.usuarioRelaciones[0]?.seccionSubSeccion?.nombre,
        usuario: item.gestionador?.fullname.toUpperCase(),
        idAsignacion: item.idAsignacion,
        cargo: item.gestionador?.cargo?.nombre,
        motivo_rechazo: item.motivoRechazo ? item.motivoRechazo : '-',
        estado: item.estado.estado,
      }));
  } catch (error) {
    console.error(error);
    dataTable.value = []
  }
};

const rechazar = (data) => {
  solicitud.value = data
  onSubmitRechazo()
}

const aprobar = (data) => {
  solicitud.value = data.data
  gestName.value = data?.nombre ? data.nombre.trim() : "";
  showModalAprobar.value = true
}

const excludeCloned = (data) => {
  selectedClonedId.value = data.data.id;
  showModalExclude.value = true;
}

const replaceCloned = (data) => {
  selectedClonedId.value = data.data.id;
  reemplazarClonado.value = true;
  showModalReplace.value = true;
}

const cancelProcessedCloned = () => {
  showModalExclude.value = false;
  showModalReplace.value = false;
  showModalAssign.value = false;
  selectedClonedId.value = 0;
}

const assignCloned = () => {
  showModalAssign.value = true;
}

const closeAssignCloned = () => {
  showModalAssign.value = false;
}

const onSubmitExclude = async () => {
  showModalExclude.value = false;
  const body = {
    idGestionadores: [selectedClonedId.value],
    motivoExclusion: "true"
  }
  try {
    const response = await sgdeaAxios.patch(`/pqrd/excluirGestionadores/${route.params.id}`, body)
    if(response.status === 200 || response.status === 201) {
      toast.success('Se ha excluido el usuario clonado exitosamente')
      await getData();
      const dataTrazabilidad = {
        proceso: `PQRD${props.pqrdData.id}`,
        secuencia: props.pqrdData.idRadicado,
        estado: props.pqrdData.estado.estado,
        descripcion: 'Se ha excluido el usuario gestionador',
        comentario: 'Excluido',
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} ha excluido un usuario gestionador`,
        tramite: props.pqrdData.informacionSolicitud?.tipologiaEntity.id == 7 ? 'PQRD Express' : 'PQRD',
      }
      await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad);
    }
  } catch (error) {
    console.error(error);
  }
}

const onSubmitReplace = async () => {
  showModalReplace.value = false;
  assignCloned();
}

const onSubmitRechazo = async () => {
  try {
    const response = await sgdeaAxios.patch(`/pqrd/rechazar-solicitud-rechazo-asignacion/${solicitud.value}`, {
      motivo_rechazo: observations.value
    });
    if (response.status === 200 || response.status === 201) {
      toast.success('Se ha rechazado la solicitud exitosamente')
      await getData();
      const dataTrazabilidad = {
        proceso: `PQRD${props.pqrdData.id}`,
        secuencia: props.pqrdData.idRadicado,
        estado: props.pqrdData.estado.estado,
        descripcion: 'Se ha rechazado la solicitud de rechazo de clonación',
        comentario: 'Rechazado',
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} ha rechazado la solicitud de rechazo de clonación`,
        tramite: props.pqrdData.informacionSolicitud?.tipologiaEntity.id == 7 ? 'PQRD Express' : 'PQRD',
      }
      await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad);
    } else if (response.status === 204) {
      toast.error("No se ha encontrado el id de asignación");
    }
  } catch (error) {
    if (error.response.status === 409) {
      toast.error(error.response.data.message)
    } else {
      toast.error("Hubo un error al rechazar la solicitud de rechazo");
    }
  } finally {
    showModalAprobar.value = false;
  }
}

const onSubmitAprobar = async () => {
  try {
    const response = await sgdeaAxios.patch(`/pqrd/aprobar-solicitud-rechazo-asignacion/${solicitud.value}`);
    if (response.status === 200 || response.status === 201) {
      toast.success('Se ha aprobado la solicitud exitosamente')
      await getData();
      const dataTrazabilidad = {
        proceso: `PQRD${props.pqrdData.id}`,
        secuencia: props.pqrdData.idRadicado,
        estado: props.pqrdData.estado.estado,
        descripcion: 'Se ha aprobado la solicitud de rechazo de clonación',
        comentario: 'Aprobado',
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} ha aprobado la solicitud de rechazo de clonación`,
        tramite: props.pqrdData.informacionSolicitud?.tipologiaEntity.id == 7 ? 'PQRD Express' : 'PQRD',
      }
      await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad);
    } else if (response.status === 204) {
      toast.error("No se ha encontrado el id de asignación");
    }
  } catch (error) {
    if (error.response.status === 409) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Hubo un error al aprobar la solicitud de rechazo");
    }
  } finally {
    showModalAprobar.value = false;
  }

}

const onSubmitAssign = () => {
  if (selectedClonedId.value) {
    // procesar como reemplazo
  } else {
    // procesar por agregar
  }
}

const handlePageChange = async (page: number) => {
  currPage.value = page <= 0 ? 0 : page - 1;
  await getData();
}

const handleRowsPerPageChange = async (rowsPerPage: any) => {
  pageSize.value = rowsPerPage;
  await getData();
}

</script>
