<template>
  <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat>
    <div class="flex items-center justify-between q-px-md row col-12">
      <span class="text-weight-bold text-h6" style="color: #2c3948"
        >Listado de Radicados Entes de Control</span
      >
    </div>
    <div class="show-table-icons">
      <EntesDeControlTable
        @massAssignment="activeAsignacionMasiva"
        :TABLE_HEADER="renderColumns()"
        :TABLE_BODY="filteredRadicadas"
        ref="entesTable"
        :rol="rol"
        :pagination="pagination"
        :total-pages="totalPage"
        @handlePageChange="handlePageChange"
        @handleRowsPerPageChange="handleRowsPerPageChange"
         :pagination-message="customMessageTableResults"
      />
    </div>
  </q-card>

  <AsignarMasivamente
    :idsEntes="radicadosIds"
    :status="modals.asignar.status"
    @toggle="closeAsiganacionMasiva"
  />
</template>

<script setup lang="ts">
import AsignarMasivamente from "src/pages/EntesDeControl/Bandeja/Detalles/Asignar/AsignarMasivamente.vue";
import { useAuthStore } from "src/stores/auth.store";
import { ref, reactive, onMounted } from "vue";
import EntesDeControlTable from "src/pages/EntesDeControl/Bandeja/table.vue";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import moment from "moment";
import { formatDateWithTimeAndMeridiem } from "src/helpers/formtDate";

const authStore = useAuthStore();
const entesDeControl = ref([]);
const filteredRadicadas = ref([]);
const radicadosIds = ref([]);
const entesTable = ref(null);
// const stateOptions = ref();
const rol = ref(null);
const currPage = ref(0);
const totalPage = ref(0);
const totalElements = ref(0);
const selectFilterState= ref(null);
const customMessageTableResults = ref("")

let pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 0,
  rowsPerPage: 100,
  rowsNumber: 0,
});

const modals = reactive({
  asignar: {
    status: false,
    toggle: () => (modals.asignar.status = !modals.asignar.status),
  },
});

const activeAsignacionMasiva = (entes) => {
  radicadosIds.value = entes.map((ente) => ente.ente_control_id);
  reclamarMasivamente().then(() => {
    modals.asignar.toggle();
  });
};

const closeAsiganacionMasiva = (status) => {
  if (status == "cancel") {
    liberarMasivamente().then(() => {
      entesTable.value?.clearSelects();
      modals.asignar.toggle();
    });
  } else if (status == "success") {
    modals.asignar.toggle();
    entesTable.value?.clearSelects();
    getData(false);
  } else modals.asignar.toggle();
};

const filterForm = reactive({
  numeroRadicado: {
    val: null,
    ref: null,
  },
  fechaVencimiento: {
    val: null,
    ref: null,
  },
  fechaRadicacion: {
    val: null,
    ref: null,
  },
  estado: {
    val: null,
    ref: null,
  },
});

const reclamarMasivamente = () => {
  return sgdeaAxios
    .patch(`/api/entes/reclamar-masivamente-asignador`, {
      idsEntes: radicadosIds.value,
      usuarioId: authStore.userInfo.userid,
    })
    .then(() => toast.success("Casos reclamados con éxito"))
    .catch(() => toast.error("Algun caso ya ha sido reclamado"));
};

const liberarMasivamente = () => {
  return sgdeaAxios
    .patch(`/api/entes/liberar-masivamente-asignador`, {
      idsEntes: radicadosIds.value,
      usuarioId: authStore.userInfo.userid,
    })
    .then(() => {
      toast.success("Casos liberados con éxito");
      entesTable.value?.clearSelects();
    })
    .catch(() => toast.error("Algun caso ya ha sido liberado"));
};

const getData = async (verify = true, isCounter = false) => {
  const preLink = "api/entes/";

  try {
    let response;
    let params;

    switch (rol.value) {
      case "Asignador Responsable":
        params = validateParams({
          asignador_id: authStore.userInfo.userid,
          isCounter
        });
        response = await sgdeaAxios.get(
          preLink + "obtenerListadoCasosAsignadores",
          params
        );
        break;
      case "Aprobador":
        params = validateParams({
          aprobador_id: authStore.userInfo.userid,
          isCounter
        });
        response = await sgdeaAxios.get(
          preLink + "obtenerListadoCasosAprobadores",
          params
        );
        break;
      case "Gestionador":
        params = validateParams({
          gestionador_id: authStore.userInfo.userid,
          oficina_id: authStore.userInfo.oficina,
          isCounter
        });
        response = await sgdeaAxios.get(
          preLink + "listadoCasosGestionadores",
          params
        );
        break;
      case "Revisor":
        params = validateParams({
          revisor_id: authStore.userInfo.userid,
          isCounter
        });
        response = await sgdeaAxios.get(
          preLink + "obtenerListadoCasosRevisores",
          params
        );
        break;
      default:
        return { data: [], total: 0, contadores: [] };
    }

    if (isCounter) {
      return {
        contadores: response.data.contadoresEstado || [],
        total: response.data.totalElements || 0,
        data: []
      };
    }

    entesDeControl.value = response.data.content || [];
    filteredRadicadas.value = entesDeControl.value;
    customMessageTableResults.value = response.data.paginationMessage
    totalPage.value = response.data.totalPages;
    totalElements.value = response.data.totalElements;

    return {
      data: filteredRadicadas.value,
      total: totalElements.value || 0,
      contadores: []
    };

  } catch (error) {
    console.error(error);
    return { data: [], total: 0, contadores: [] };
  }
};

const validateParams = (addParams = {}) => {
  let newParams = {
    estado_id: null,
    numero_radicado: null,
    fecha_vencimiento: null,
    fecha_radicacion: null,
  };

  if (filterForm.estado.val) newParams.estado_id = filterForm.estado.val.value;

  if (filterForm.numeroRadicado.val)
    newParams.numero_radicado = filterForm.numeroRadicado.val;

  if (filterForm.fechaVencimiento.val)
    newParams.fecha_vencimiento = filterForm.fechaVencimiento.val;

  if (filterForm.fechaRadicacion.val)
    newParams.fecha_radicacion = filterForm.fechaRadicacion.val;
  return {
    params: {
      ...addParams,
      ...newParams,
      page: currPage.value,
      size: pagination.value.rowsPerPage,
    },
  };
};

const renderColumns = () => {
  if (selectFilterState.value === "Devolucion") {
    return [
      {
        name: "canal_radicacion",
        label: "Canal de Radicación",
        field: "canal_radicacion",
        sortable: true,
      },
      {
        name: "correoOrigen",
        label: "Correo electrónico origen",
        field: "correoOrigen",
        sortable: true,
      },
      {
        name: "radicadoSalida",
        label: "Radicado de salida",
        field: row => row.gestionEnvios?.radicadoSalida ?? "",
        sortable: true,
      },
      {
        name: "destinatario",
        label: "Destinatario",
        field: "destinatario",
        sortable: true,
      },
      {
        name: "fechaEnvio",
        label: "Fecha de envío",
        field: row => row.fechaEnvio || "-",
        sortable: true,

      },
      {
        name: "fechaRadicacion",
        label: "Fecha de Radicación",
        field: (row) => formatDateWithTimeAndMeridiem(row.fecha_radicacion),
        sortable: true,
      },
      {
        name: "tipoEnvio",
        label: "Tipo de envío",
        field: "tipoEnvio",
        sortable: true,
      },
      {
        name: "tipo_tramite",
        label: "Tipo de Trámite",
        field: () => "Entes de control",
        sortable: true,
      },
      {
        name: "motivoDevolucion",
        label: "Motivo de devolución",
        field: row => row.motivoDevolucion || "-",
        sortable: true,
      },
      {
        name: "correo",
        label: "Correo electrónico",
        field: "correo",
        sortable: true,
      },
      {
        name: "tiempo_asignado",
        label: "Tiempo Asignado",
        field: "tiempo_asignado",
        sortable: true,
        format: () => "1 día"
      },
      {
        name: "tiempo_por_vencer",
        label: "Tiempo por Vencer",
        field: (row) =>
          ["vencido", "0 días", "0 horas"].includes(row?.tiempo_por_vencer)
            ? "Vencido"
            : row.tiempo_por_vencer,
        sortable: true,
      },
      {
        name: "fecha_vencimiento",
        label: "Fecha de Vencimiento",
        field: (row) => formatDateWithTimeAndMeridiem(row.fecha_vencimiento),
        sortable: true,
      },
      {
        name: "afectado",
        label: "Nombre - Identificación Afectado",
        field: "afectado",
        sortable: true,
      },
      {
        name: "nombreRemitente",
        label: "Remitente",
        field: "remitente",
        sortable: true,
      },
      {
        name: "municipio",
        label: "Ciudad",
        field: "municipio",
        sortable: true,
      },
      {
        name: "departamento",
        label: "Departamento",
        field: "departamento",
        sortable: true,
      },
      {
        name: "trazabilidad",
        label: "Trazabilidad",
        field: "trazabilidad",
      },
      {
        name: "estado",
        label: "Estado",
        field: "estado",
        sortable: true,
      },
      {
        name: "acciones",
        label: "Acciones",
        field: "acciones",
      },
    ];
  } else {
    return [
      {
        name: "canal_radicacion",
        label: "Canal de Radicación",
        field: "canal_radicacion",
        sortable: true,
      },
      {
        name: "numero_radicado",
        label: "Número de Radicado",
        field: "numero_radicado",
        sortable: true,
      },
      {
        name: "fecha_radicacion",
        label: "Fecha de Radicación",
        // field: "fecha_radicacion",
        field: (row) => formatDateWithTimeAndMeridiem(row.fecha_radicacion),
        sortable: true,
      },
      {
        name: "tiempo_asignado",
        label: "Tiempo Asignado",
        field: "tiempo_asignado",
        sortable: true,
      },
      {
        name: "tiempo_por_vencer",
        label: "Tiempo por Vencer",
        field: (row) =>
          ["vencido", "0 días", "0 horas"].includes(row?.tiempo_por_vencer)
            ? "Vencido"
            : row.tiempo_por_vencer,
        sortable: true,
      },
      {
        name: "fecha_vencimiento",
        label: "Fecha de Vencimiento",
        field: (row) => formatDateWithTimeAndMeridiem(row.fecha_vencimiento),
        sortable: true,
      },
      {
        name: "afectado",
        label: "Nombre - Identificación Afectado",
        field: "afectado",
        sortable: true,
      },
      {
        name: "remitente",
        label: "Nombre - Identificación Remitente",
        field: "remitente",
        sortable: true,
      },
      {
        name: "municipio",
        label: "Ciudad",
        field: "municipio",
        sortable: true,
      },
      {
        name: "departamento",
        label: "Departamento",
        field: "departamento",
        sortable: true,
      },
      {
        name: "tipo_tramite",
        label: "Tipo de Trámite",
        field: () => "Entes de control",
        sortable: true,
      },
      {
        name: "trazabilidad",
        label: "Trazabilidad",
        field: "trazabilidad",
      },
      {
        name: "estado",
        label: "Estado",
        field: "estado",
        sortable: true,
      },
      {
        name: "acciones",
        label: "Acciones",
        field: "acciones",
      },
    ];
  }
};
const getDiffDaysFromDate = (date1: string, date2: string) => {
  const creationDate = new Date(date1);
  const expirationDate = new Date(date2);
  const difference = Math.abs(creationDate.getTime() - expirationDate.getTime());
  return Math.floor(difference / (24 * 60 * 60 * 1000));
}
const handlePageChange = async (page: number) => {
  pagination.value.page = page;
  currPage.value = page <= 0 ? 0 : page - 1;

  await getData(false);
  emit("pageChange", filteredRadicadas.value);
};

const handleRowsPerPageChange = async (rowsPerPage: any) => {
  pagination.value.rowsPerPage = rowsPerPage;

  await getData(false);
  emit("rowsChange", filteredRadicadas.value);
};

const emit = defineEmits(["pageChange", "rowsChange"]);

onMounted(() => {
  rol.value = authStore.userInfo.role;
  // getStateOptions();
  getData(false);
});

defineExpose({
  getData,
  filterByState,
});

function filterByState(estado) {
  if (!estado) {
    filteredRadicadas.value = entesDeControl.value;
  } else {
    filteredRadicadas.value = entesDeControl.value.filter(
      (item) => item.estado == estado
    );
    selectFilterState.value = estado;
  }
}
</script>

<style scoped>
.table {
  text-align: center !important;
}

.pb-15 {
  padding-bottom: 15px;
}
</style>
