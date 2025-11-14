<template>
  <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat>
    <div class="flex items-center justify-between q-px-md row row col-12">
      <span class="text-weight-bold text-h6" style="color: #2c3948">Listado de Comunicaciones ML</span>
    </div>
    <Table :TABLE_HEADER="Comunicaciones_HEADER" :TABLE_BODY="dataTable" key-id="numeroComunicacion"
      @handleEditData="(id) => $router.push(`/medicina/comunicaciones/${id}`)" :isLoading="loadingTable"
      :TABLE_TOTAL_ROWS="dataTableTotalRows" @handlePageChange="handlePageChange"
      @search-change="handleSearch"
      @handleRowsPerPageChange="handleRowsPerPageChange" @send-to-docs="
        (id, tab) => $router.push(`/medicina/comunicaciones/${id}/?tab=${tab}`)
      " />
  </q-card>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref } from "vue";
import Table from "src/pages/MedicinaLaboral/comunicaciones/Table.vue";
import {
  Comunicaciones_HEADER,
  ISearchCasosData,
} from "src/pages/MedicinaLaboral/comunicaciones/index";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import moment from "moment";

const DEFAULT_FILTER_SEARCH: ISearchCasosData = {
  numeroRadicado: { label: "", value: "" },
  siniestro: "",
  estado: "",
  fechaRadicacion: "",
  fechaVencimiento: "",
  size: 20,
  page: 0,
};

const emit = defineEmits(["pageChange", "rowsChange"]);
let loadingTable = ref(false);
const auth = useAuthStore();
const filterSearch = ref<ISearchCasosData>(DEFAULT_FILTER_SEARCH);
const dataTable = ref<any[]>([]);
const opcionesSiniestros = ref([]);
const numRadicado: Ref<{ label: string; value: any }[]> = ref([]);
const dataTableTotalRows = ref(0);
const allData = ref();
const searchTerm = ref('');


onMounted(() => {
  // getSiniestros();
  sendFilters(0, 20);
});

// const getSiniestros = async () => {
//   const siniestros = await sgdeaAxios.get("/medicina/getSiniestrosUnico");
//   opcionesSiniestros.value = siniestros.data.map((item) => item.siniestro);
//   opcionesSiniestros.value = opcionesSiniestros.value.filter(
//     (siniestro) => siniestro !== "No aplica"
//   );
// };

const sendFilters = async (page: number, size: number, isCounter = false, searchTermParam = '') => {
  try {
    loadingTable.value = true;
    const response = await sgdeaAxios.put(
      `/medicina/getAllUsers/${auth.userInfo.userid}`,
      {
        isCounter: isCounter,
        numeroComunicacion: filterSearch.value.numeroRadicado.value
          ? filterSearch.value.numeroRadicado.value
          : null,
        siniesto: filterSearch.value.siniestro
          ? filterSearch.value.siniestro
          : null,
        estado: filterSearch.value.estado ? filterSearch.value.estado : null,
        fecha: filterSearch.value.fechaRadicacion
          ? filterSearch.value.fechaRadicacion
          : null,
        rol: auth.userInfo.role,
        page: page,
        size: size,
        buscador: searchTermParam || searchTerm.value || ''
      },
      {
        params: {
          sort: [null],
        },
      }
    );

    if (response.status === 200) {

      if (isCounter) {
        return {
          contadores: response.data.content[0]?.contadoresEstado?.map(item => ({
            estado: item.estado,
            contador: item.contador
          })) || [],
          total: response.data.content[0]?.totalContadores || 0,
          data: []
        };
      }
      numRadicado.value = response.data.content?.map((item) => ({
        value: item.idRadicado,
        label: item.idRadicado,
      }));

      dataTable.value = response.data.content.map((item) => ({
        ...item,
        numeroComunicacion: item?.idRadicado || "-",
        tipoComunicacion: item?.tipoComunicacion?.nombre || "-",
        fechaComunicacion: item?.fechaRadicacion
          ? moment(item?.fechaRadicacion).format("DD/MM/YYYY HH:mm")
          : "-",
        siniestro: item?.metadatos?.listSiniestro || "-",
        prefijo: item?.prefijo?.prefijo?.nombre || "-",
        afectado: item?.metadatos?.numeroDocumento
          ? item?.metadatos?.numeroDocumento + " - " + item?.metadatos?.afectado
          : "-",
        tipoTramite: "Medicina Laboral",
        fechaCreacionDocumento: item?.fechaDoc
          ? moment(item?.fechaDoc).format("DD/MM/YYYY HH:mm")
          : "-",
        tipoEvento: item?.metadatos?.tipoEvento?.nombre || "-",
        origenEvento: item?.metadatos?.origenEvento?.evento || "-",
        trazabilidad: "-",
        estado: item?.estado || "-",
        actions: "-",
      }));

      dataTableTotalRows.value = response.data.totalPages;
      allData.value = dataTable.value;
    }
    loadingTable.value = false;
    return { data: dataTable.value, total: response.data.totalElements || 0,  contadores: []};
  } catch (error) {
    loadingTable.value = false;
    console.error(error);
  }
};

const handleSearch = (term: string) => {
  searchTerm.value = term;
  filterSearch.value.page = 0;
  sendFilters(0, filterSearch.value.size, false, term);
};

const handlePageChange = async (event) => {
  await sendFilters(event.page - 1, event.rowsPerPage, false, searchTerm.value);
  emit("rowsChange", dataTable.value);
};

const handleRowsPerPageChange = async (event: any) => {
  await sendFilters(event.page, event.rowsPerPage, false, searchTerm.value);
  emit("rowsChange", dataTable.value);
};

defineExpose({
  sendFilters,
  filterByState,
});

function filterByState(estado) {
  if (!estado) {
    dataTable.value = allData.value;
  } else {
    dataTable.value = allData.value.filter((item) => item.estado == estado);
  }
}
</script>
