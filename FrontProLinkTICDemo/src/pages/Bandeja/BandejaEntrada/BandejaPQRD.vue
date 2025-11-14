<template>
  <div>
    <div class="tw-flex tw-justify-end" v-if="
      auth.$state.userInfo.role.toLowerCase() === 'asignador responsable' &&
      selection &&
      selection.length > 1
    ">
      <q-btn label="Asignacion Masiva" text-color="white" @click="() => (asignarMasivo = true)" style="width: 240px; height: 40px" color="primary"
            class="tw-rounded-xl tw-btn tw-p-2" />
    </div>

    <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat>
      <div class="flex items-center justify-between q-px-md row col-12">
        <span class="text-weight-bold text-h6" style="color: #2c3948">Listado de casos PQRD</span>
      </div>
      <!--      <div class="tw-flex tw-items-center tw-gap-x-3 tw-ml-auto" style="margin-left:80% ;">-->
      <!--        <q-input outlined dense rounded v-model="search" label="Buscador" class="tw-w-[300px]"-->
      <!--          @update:model-value="onSearch">-->
      <!--          <template v-slot:prepend>-->
      <!--            <q-icon name="search" />-->
      <!--          </template>-->
      <!--        </q-input>-->
      <!--      </div>-->
      <!---->
      <div :key="key" class="my-custom-table">
        <TablePQRD :key="tableKey"
          :TABLE_HEADER="isPublicador ? renderColumnsPublicador() : (isDevolucion ? DEVOLUTION_HEADER : FILTERED_TABLE_HEADER)"
          :TABLE_BODY="dataTable" :TABLE_TOTAL_ROWS="dataTableTotalRows" :selection="undefined"
          :isLoading="loadingTable" :isPublicador="isPublicador" :pagination.sync="pagination"
          @update:item-selected="handleSelection" @handle-edit-data="handleCaso" @handlePageChange="handlePageChange" v-model:item-selected="selection"
          @handleRowsPerPageChange="handleRowsPerPageChange" :label-data="filterNotLength"
          :data-paginator="dataPaginator" @search-change="handleSearch" :isDevolucion="isDevolucion"
          :pagination-message="customMessageTableResults" />
      </div>
    </q-card>
  </div>

  <q-dialog persistent full-width v-model="asignarMasivo">
    <q-card class="q-pa-xl tw-w-[3000px]">
      <AsignacionMasiva @close-modal="
        () => {
          asignarMasivo = false;
          selection = [];
          tableKey++;
        }
      " @assigned="getData" :pqr-data="selection" />
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { useQuasar } from "quasar";
import TablePQRD from "src/components/Tables/TablePQRD.vue";
import { SelectInput } from "src/interfaces";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import { Ref, onMounted, onUnmounted, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { ASIGNACION_HEADER_PQRD } from "src/pages/PQRD/Verificacion/index";
import AsignacionMasiva from "src/pages/PQRD/Verificacion/asignacionMasiva.vue";
import { formatDateWithTimeAndMeridiem } from "src/helpers/formtDate";
import { DataPaginator } from "pages/Bandeja/BandejaEntrada/index";
import { TableHeader } from "src/interfaces/TableHeaders";

interface PQRD {
  estado: string;
  numero: string;
  tipoTramite: string;
  ciudad: string;
  pageNo: number;
  pageSize: number;
  vencimiento: string;
}

const auth = useAuthStore();
const emit = defineEmits(["pageChange", "rowsChange"]);
const q = useQuasar();
let loadingTable = ref(false);
const router = useRouter();
const key = ref(0);
let TABLE_HEADERS: any[];
const asignarMasivo = ref(false);
const selection = ref([]);
const dataTable = ref([]);
const dataPaginator = ref<DataPaginator>();
const allData = ref([]);
const dataTableTotalRows = ref(0);
const tableKey = ref(0);
const searchTerm = ref('');
let pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0,
});
const isPublicador = computed(() => auth.$state.userInfo.role === "Publicador")
const optionsTipoTramite = ref<SelectInput[]>([]);
const filterNotLength = ref(false);
const customMessageTableResults = ref("")

const DEVOLUTION_HEADER: TableHeader[] = ref([
  {
    name: "canalRadicacion",
    label: auth.userInfo.role.includes("Gestionador") ? "Canal de Radicación" : "Canal de Recepción",
    field: "canalRadicacion",
    sortable: true,
  },
  {
    name: "radicadoSalidaAprobar",
    label: "Radicado de salida",
    field: "radicadoSalida",
    sortable: true,
  },
  {
    name: "destinatario",
    label: "Destinatario",
    field: "nombreDestinatario",
    sortable: true,
  },
  {
    name: "fechaEnvio",
    label: "Fecha de envío",
    field: "fechaRadicacion",
    sortable: true,
  },
  {
    name: "tipoEnvio",
    label: "Tipo de envío",
    field: "formaEnvio",
    sortable: true,
  },
  {
    name: "estado",
    label: "Estado",
    field: "estado",
    sortable: true,
  },
  {
    name: "correoElectronico",
    label: "Correo electrónico",
    field: "correoDestinatario",
    sortable: true,
  },
  {
    name: "tiempoAsignado",
    label: "Tiempo Asignado",
    field: 'tiempoAsignado',
    sortable: true,
  },
  {
    name: "tiempoXVencer",
    label: "Tiempo por Vencer",
    field: 'diasPorVencer',
    sortable: true,
  },
  {
    name: "fechaVencimiento",
    label: "Fecha de Vencimiento",
    field: "fechaDeVencimiento",
    sortable: true,
  },
  {
    name: "nombreAfectado",
    label: "Nombre",
    field: 'afectado',
    sortable: true,
  },
  {
    name: "trazabilidad",
    label: "Trazabilidad",
    field: "trazabilidad",
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    sortable: false,
    align: "center",
  },
]);

const formData: Ref<PQRD> = ref({
  estado: "",
  numero: "",
  tipoTramite: "",
  ciudad: "",
  pageNo: 0,
  pageSize: 20,
  rowsPerPage: 20,
  vencimiento: "",
});

function handleSelection(newSelection: any[]) {
  selection.value = newSelection;
}

const renderColumnsPublicador = () => {
  const columns = [
    {
      name: "idRadicado",
      label: "Radicado de Entrada",
      field: "idRadicado",
      sortable: true,
    },
    {
      name: "idRadicado",
      label: "Radicado de Salida",
      field: "idRadicado",
      sortable: true,
    },
    {
      name: "tipoTramite",
      label: "Tipo de Trámite",
      field: "tipoTramite",
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
      label: "Fecha de Envío",
      field: "fechaEnvio",
      sortable: true,
    },
    {
      name: "canalEnvio",
      label: "Canal de envío",
      field: "canalEnvio",
      sortable: true,
    },
    {
      name: "estado",
      label: "Estado",
      field: "estado",
      sortable: true,
    },
    {
      name: "tiempoAsignado",
      label: "Tiempo Asignado",
      field: 'tiempoAsignado',
      sortable: true,
    },
    {
      name: "diasPorVencer",
      label: "Tiempo por Vencer",
      field: (row) =>
        row?.diasPorVencer
          ? row.diasPorVencer < 0
            ? "Vencido"
            : row.diasPorVencer + " " + (row?.tiempoAsignado.medida === 'DIAS' ? 'Días' : 'Horas')
          : "-",
      sortable: true,
    },
    {
      name: "fechaDeVencimiento",
      label: "Fecha de Vencimiento",
      field: (row) => row.fechaDeVencimiento || "-",
      sortable: true,
    },
    {
      name: "nombre",
      label: "Nombre",
      field: "nombre",
      sortable: true,
    },
    {
      name: "documento",
      label: "Documento",
      field: "documento",
      sortable: true,
    },
    {
      name: "acciones",
      label: "Acciones",
      field: "acciones",
    },
    {
      name: "trazabilidad",
      label: "Trazabilidad",
      field: "trazabilidad",
    }

  ];

  return columns;
};


const FILTERED_TABLE_HEADER = computed(() => {
  const rolesUsuario = auth.relations?.map((rel) => rel.idRol) || [];
  if (rolesUsuario.includes(6) || rolesUsuario.includes(10)) {
    return ASIGNACION_HEADER_PQRD.filter(
      (header) => header.name !== "tiempoRevisor"
    );
  }
  return ASIGNACION_HEADER_PQRD;
});

onUnmounted(() => {
  q.iconSet.table.arrowUp = "arrow_upward";
});

onMounted(async () => {
  q.iconSet.table.arrowUp = "import_export";
  // @ts-expect-error
  await Promise.allSettled([
    getData(0, 20, "", ""),
    // getCiudades(),
    getTiposSolicitud(),
  ]);
});


async function getTiposSolicitud() {
  const { data } = await sgdeaAxios.get("/pqrd/listadoTiposSolicitud");
  optionsTipoTramite.value = data
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .map((tipo: any) => ({
      label: tipo.nombre,
      value: tipo.id,
    }));
}

const getData = async (page: number, size: number, idRadicado: string, searchTerm: string, isCounter = false) => {
  const isPublicador = auth.$state.userInfo.role.toLowerCase() == 'publicador';

  try {
    let numeroRadicado = idRadicado ?? "";
    loadingTable.value = true;
    let otherParams = {};

    const role = auth.$state.userInfo.role.toLowerCase();
    const userId = auth.$state.userInfo.userid;

    const tipoUsuarioMap: Record<string, string> = {
      "asignador responsable": "ASIGNADOR",
      "gestionador consolidador": "GESTIONADOR_CONSOLIDADOR",
      "gestionador": "GESTIONADOR",
      "gestionador escalador": "GESTIONADOR_ESCALADOR",
      "aprobador": "APROBADOR",
      "revisor": "REVISOR",
      "defensor del consumidor": "DEFENSOR_CONSUMIDOR",
      "administrador master": "ADMINISTRADOR",
    };

    const tipoUsuario = tipoUsuarioMap[role] || "ADMINISTRADOR";

    otherParams = {
      idUsuario: userId,
      tipoUsuario,
      ...(role === "asignador responsable" && { idEstado: 1 }),
    };

    let response;
    let data;

    // Configuración de parámetros comunes
    const requestParams = {
      ...otherParams,
      pageNo: isCounter ? 0 : page,
      pageSize: isCounter ? 10000 : size,
      isCounter,
      numeroRadicado,
      buscador: searchTerm || '',
      ...(role === "asignador responsable" && { oficinaId: auth.$state.userInfo.oficina }),
      dependenciaId: role === "asignador responsable" ? auth.$state.userInfo.dependencia : 0,
    };

    if (isPublicador && !isCounter) {
      response = await sgdeaAxios.get('/pqrd/obtenerListadoCasosPublicadores', {
        params: { page, size }
      });
    }

    const apiResponse = await sgdeaAxios.get("/pqrd/obtenerListadoCasos", {
      params: requestParams
    });
    data = apiResponse.data;

    if (isCounter) {
      return {
        contadores: data.contadores || [],
        total: data.totalContadores || 0,
        data: []
      };
    }

    filterNotLength.value = false;

    // Procesamiento completo de datos para la tabla
    if (data && data.elementos && !isPublicador) {
      dataTable.value = data?.elementos.map((item: any) => ({
        anulacionConReinicio: item.anulacionConReinicio,
        canal_radication: item.canalRadicacion ?? "",
        numero: item.idRadicado ?? "",
        fecha_radicacion: formatDateWithTimeAndMeridiem(item.fechaRadicacion),
        fechaAnulacion: item.fechaAnulacion,
        tiempo: item.tiempoAsignado,
        reclasificacionRechazada: item.reclasificacionRechazada,
        diasPorVencer: item.diasPorVencer == "0 dias" ? "Vencido" : item.diasPorVencer,
        fechaDeVencimiento: formatDateWithTimeAndMeridiem(item.fechaDeVencimiento),
        nombre_afectado: item.nombreAfectado ?? "",
        remitente: item.remitente ?? "",
        city: item.ciudad ?? "",
        department: item.departamento ?? "",
        tramite_type: item?.tipologia == "PQRD Express" ? "PQRD Express" : "PQRD",
        trazabilidad: "",
        estado: item.isEscalamiento
          ? "Escalado"
          : item.estado
            ? item.estado.charAt(0).toUpperCase() + item.estado.slice(1).toLowerCase()
            : "N/A",
        acciones: item.isEscalamiento == true
          ? "Gestionar escalado"
          : item.isClonado &&
            Boolean(item.idConsolidador) &&
            auth.$state.userInfo.userid === item.idConsolidador
            ? "Por consolidar"
            : "Gestionar",
        id: item.id,
        idAsignacion: item.idAsignacion,
        clonado: item.isClonado,
        isConsolidador: item.isClonado &&
          Boolean(item.idConsolidador) &&
          auth.$state.userInfo.userid === item.idConsolidador,
        isEscalamiento: item.isEscalamiento,
        fechaRevisor: item.fechaRevisor,
        fechaAprobador: item.tiempoAsignadoAprobador,
        identificacionAfectado: item.identificacionAfectado,
        identificacionRemitente: item.identificacionRemitente,
        solicitudRechazo: item.solicitudRechazo,
        tiempoRevisor: item.tiempoRevisor,
        correoDestinatario: item.correoDestinatario,
        radicadoSalida: item.radicadoSalida,
        destinatario: item.destinatario,
        fechaEnvioOperador: item.fechaEnvioOperador,
        tipoEnvio: item.tipoEnvio,
        tipoTramite: item.tipoTramite,
        motivoDevolucion: item.motivoDevolucion,
      }));
      dataPaginator.value = {
        start: data.pageable.pageNumber * data.pageable.pageSize + 1,
        end: Math.min((data.pageable.pageNumber + 1) * data.pageable.pageSize, data.totalElements),
        total: data.totalElements
      };
    }

    if (isPublicador && response?.data) {
      dataTable.value = response.data.elementos.map((item: any) => ({
        anulacionConReinicio: item.anulacionConReinicio,
        canal_radication: item.canalRadicacion ?? "",
        fechaEnvio: formatDateWithTimeAndMeridiem(item.fechaRadicacion),
        canalEnvio: item.canalRadicacion ?? "",
        documento: item.documento ?? "",
        reclasificacionRechazada: item.reclasificacionRechazada,
        numero: item.idRadicado ?? "",
        fecha_radicacion: formatDateWithTimeAndMeridiem(item.fechaRadicacion),
        fechaAnulacion: item.fechaAnulacion,
        tiempo: item.tiempoAsignado,
        diasPorVencer: item.diasPorVencer == "0 dias" ? "Vencido" : item.diasPorVencer,
        fechaDeVencimiento: formatDateWithTimeAndMeridiem(item.fechaDeVencimiento),
        nombre_afectado: item.nombreAfectado ?? "",
        remitente: item.remitente ?? "",
        city: item.ciudad ?? "",
        department: item.departamento ?? "",
        tramite_type: item?.tipologia == "PQRD Express" ? "PQRD Express" : "PQRD",
        trazabilidad: "",
        estado: item.isEscalamiento
          ? "Escalado"
          : item.estado
            ? item.estado.charAt(0).toUpperCase() + item.estado.slice(1).toLowerCase()
            : "N/A",
        acciones: item.isEscalamiento == true
          ? "Gestionar escalado"
          : item.isClonado &&
            Boolean(item.idConsolidador) &&
            auth.$state.userInfo.userid === item.idConsolidador
            ? "Por consolidar"
            : "Gestionar",
        id: item.id,
        idAsignacion: item.idAsignacion,
        clonado: item.isClonado,
        isConsolidador: item.isClonado &&
          Boolean(item.idConsolidador) &&
          auth.$state.userInfo.userid === item.idConsolidador,
        isEscalamiento: item.isEscalamiento,
        fechaRevisor: item.fechaRevisor,
        idRadicado: item.idRadicado,
        fechaAprobador: item.tiempoAsignadoAprobador,
        identificacionAfectado: item.identificacionAfectado,
        identificacionRemitente: item.identificacionRemitente,
        solicitudRechazo: item.solicitudRechazo,
        tiempoRevisor: item.tiempoRevisor,
        tiempoAsignado: '1 Día',
        correoDestinatario: item.correoDestinatario,
        radicadoSalida: item.radicadoSalida,
        destinatario: item.destinatario,
        fechaEnvioOperador: item.fechaEnvioOperador,
        tipoEnvio: item.tipoEnvio,
        tipoTramite: item.tipoTramite,
        motivoDevolucion: item.motivoDevolucion,
      }));
      dataPaginator.value = {
        start: response.data.pageable.pageNumber * response.data.pageable.pageSize + 1,
        end: Math.min((response.data.pageable.pageNumber + 1) * response.data.pageable.pageSize, response.data.totalElements),
        total: response.data.totalElements
      };
    }

    prioritizeHighlightedRecords();

    if (auth.$state.userInfo.role.includes("Gestionador")) {
      dataTable.value.sort((a, b) => {
        if (a.fechaRevisor && b.fechaRevisor) {
          // @ts-expect-error
          return new Date(a.fechaRevisor) - new Date(b.fechaRevisor);
        }
        if (a.fechaRevisor) return -1;
        if (b.fechaRevisor) return 1;
        return 0;
      });
    }

    if (auth.$state.userInfo.role === 'Gestionador') {
      const estadosExcluidos = ['PUBLICACION', 'POR PUBLICAR'];
      const idsExcluidos = [19, 51];

      dataTable.value = dataTable.value.filter(item => {
        const estadoActual = (item.estado || '').toUpperCase();
        return !estadosExcluidos.includes(estadoActual) && !idsExcluidos.includes(item.idEstado);
      });
    }
    loadingTable.value = false;
    allData.value = dataTable.value;
    customMessageTableResults.value = data.paginationMessage
    dataTableTotalRows.value = !isPublicador ? data?.totalPage : response?.data.totalPage;

    return {
      data: dataTable.value,
      total: !isPublicador ? data?.totalElements || 0 : response?.data.totalElements || 0,
      contadores: data?.contadores || []
    };

  } catch (error) {
    console.error(error);
    loadingTable.value = false;
    dataTable.value = [];

    return {
      data: [],
      total: 0,
      contadores: [],
      ...(isCounter && { data: undefined })
    };
  }
};

const search = ref("");
function onSearch(val: string) {
  getData(0, 20, val, "");
}

const prioritizeHighlightedRecords = () => {
  const highlightedRecords = [];
  let partialRecords = [];

  for (let i = 0; i < dataTable.value.length; i++) {
    const row = dataTable.value[i];
    if (
      row.fechaRevisor &&
      row.fecha_radicacion &&
      row.estado === "Por revisar" &&
      (Number(new Date()) - Number(new Date(row.fechaRevisor))) / 36e5 > 24
    ) {
      highlightedRecords.push(row);
    } else {
      partialRecords.push(row);
    }
  }
  partialRecords.unshift(...highlightedRecords);
  dataTable.value = partialRecords;
};

const handleCaso = ({ id, idAsignacion }) => {
  let url = `/pqrd/informacion/${id}`;
  if (idAsignacion) {
    url = url + `?idAsignacion=${idAsignacion}`;
  }
  router.push(url);
};

const handleSearch = (term) => {
  searchTerm.value = term;
  // Resetear paginación cuando se realiza una nueva búsqueda
  pagination.value.page = 1;
  // Llamar a getData con el término de búsqueda
  getData(0, pagination.value.rowsPerPage, "", term);
};

const handlePageChange = async (event) => {
  await getData(event.page - 1, event.rowsPerPage, "", "");
  emit("pageChange", dataTable.value);
};

const handleRowsPerPageChange = async (event) => {
  await getData(event.page, event.rowsPerPage, "", "");
  emit("pageChange", dataTable.value);
};

defineExpose({
  getData,
  filterByState,
});

const isDevolucion = ref(false);

function filterByState(estado) {
  isDevolucion.value = estado == "Devolucion" ? true : false;
  if (!estado) {
    dataTable.value = allData.value;
  } else {
    dataTable.value = allData.value.filter((item) => item.estado == estado);
  }
}

</script>

<style scoped lang="scss">
.my-custom-table {
  &::v-deep {
    .q-table__sort-icon {
      opacity: 1;
    }

    th {
      text-align: center;
    }
  }
}
</style>
