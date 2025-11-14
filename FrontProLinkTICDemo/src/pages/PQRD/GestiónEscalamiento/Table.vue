<template>
  <div>
    <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId" table-header-class="text-black text-h6"
      class="q-mr-md full-width tw-bg-transparent table" rows-per-page-label="Páginas" hide-pagination
      v-model:pagination="pagination" :selection="isSelection" v-model:selected="selection" :loading="isLoading">

      <template v-slot:body-cell-estado="props">
        <q-td class="tw-w-[125px]">
          <p
            class="tw-py-1.5 tw-rounded-md col-8 tw-bg-[#e5edff] tw-px-4 tw-cursor-pointer tw-font-bold tw-border-[0.5px] tw-border-[#b3c8ff]">
            {{ props.row.estado}}
          </p>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td class="text-center tw-flex tw-justify-center">
          <q-btn class="tw-w-auto tw-h-9 flex tw-bg-[#f2f4f5]" v-if="!props.row.allInfo.anulado" @click="editData(props)">
            <span class="tw-px-2">Ver escalamiento</span>
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <div class="row justify-between q-mt-md" v-if="TABLE_BODY?.length > 0">
      <div class="tw-flex tw-gap-x-3 tw-items-center">
        <span>Filas</span>
        <q-select :options="[5, 25, 50, 100]" v-model:model-value="rowsPerPage" dense outlined @update:model-value="handleRowsPerPageChange" />
      </div>
      <q-pagination v-model="pagination.page" color="primary" :max="pagesNumber" size="md" direction-links boundary-links
        boundary-numbers @update:model-value="handlePageChange" />
      <q-btn icon="refresh" type="button" flat class="invisible" />
    </div>
  </div>
  <q-dialog full-width v-model="trazaModal">
      <q-card class="q-pa-xl tw-w-[3000px]">
        <a @click="trazaModal = false" class="tw-text-primary" style="text-decoration: none;">
            <q-icon size="1.5em" name="chevron_left" color="primary"/>
            <b>
                Volver
            </b>
        </a>
        <q-table flat :rows="trazabilidadData" :columns="trazabilidadColumns" :row-key="keyId" table-header-class="text-black text-h6"
            class="q-mr-md full-width tw-h-full" hide-pagination v-model:pagination="paginationTut"> </q-table>
    </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { sgdeaAxios } from "src/services";
import moment from "moment";

const trazabilidadData = ref()
const showInfo = ref(false)
const trazaModal = ref(false)
const trazabilidadColumns = ref([
  {
    name: "user",
    label: "Usuario",
    field: "nombre",
    align: "center",
    sortable: true
  },
  {
    name: "action",
    label: "Acción",
    field: "descripcion",
    align: "center",
    sortable: true
  },
  {
    name: "date",
    label: "Fecha",
    field: "fechaHora",
    align: "center",
    sortable: true
  },{
    name: "status",
    label: "Estado",
    field: "estado",
    align: "center",
    sortable: true
  },
  {
    name: "description",
    label: "Detalle",
    field: "descripcion",
    align: "center",
    sortable: true
  },
])

async function getTrazabilidad(id){
  const response = await sgdeaAxios.get('/trazabilidad/obtenerPorCodProceso/' + 'PQRD' + id);
  if (!response?.data || response.data.length === 0) {
            trazabilidadData.value = [];
            return;
        }

  trazabilidadData.value = response.data.sort((a, b) => a.id - b.id).map((item, index) => ({
            ...item,
            fechaHora: moment(item.fechaHora).add(1, 'day').format('DD/MM/YYYY'),
        }));
        trazaModal.value = true
}



const props = withDefaults(
  defineProps<{
    TABLE_BODY: any[];
    TABLE_HEADER: any[];
    TABLE_TOTAL_ROWS: number;
    selection: "none" | "single" | "multiple" | undefined;
    itemSelected: any[];
    icon?: string;
    keyId?: string;
    msgNoData?: string;
    rowId?: string;
    isSecondIcon?: boolean;
    secondIcon?: string;
    isToggle?: boolean;
    iconTrazabilidad?: string;
    isThridIcon?: boolean;
    thridIcon?: string;
    isSelection?: "none" | "single" | "multiple" | undefined;
    isLoading?: boolean;
    restore?: boolean;
  }>(),
  {
    selection: "none",
    keyId: "numero",
    secondIcon: "eye",
    isSelection: "multiple",
    icon: "printer",
    // target: ""
  }
);
const vuerouter = useRouter();
const route = useRoute();
let pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 20,
});

const excludeIconsFrom = ['trazabilidad', 'acciones'];
const rowsPerPage = ref(20);
const selection = ref([]);
const showingFullText = ref(false);

let pagesNumber = computed(() =>
  Math.ceil(props.TABLE_BODY.length / rowsPerPage.value)
);

const emit = defineEmits([
  "update:itemSelected",
  "update:inputDataProp",
  "handleEditData",
  "handleSecondIcon",
  "handleTrazabilidad",
  "handleCaso",
  "handleThridIcon",
  "handlePageChange",
  "handleRowsPerPageChange"
]);

const editData = (row) => {
  showInfo.value = true
  emit("handleEditData", row, showInfo);
};

const handleSecondIcon = (id: number) => {
  emit("handleSecondIcon", id);
};

const handleCaso = (id, idAsignacion) => {
  emit("handleCaso", {id, idAsignacion});
};

const handleTrazabilidad = (id) => {
  emit("handleTrazabilidad", id);
};

const handleThridIcon = (id: number) => {
  emit("handleThridIcon", id);
};

const handleRowsPerPageChange = (event: any) => {
  emit("handleRowsPerPageChange", event);
};

const handlePageChange = (event: any) => {
  emit("handlePageChange", event);
};

function onRequest (props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;

  pagination.value.rowsNumber = props.TABLE_TOTAL_ROWS;
  const fetchCount = rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;
  const startRow = (page - 1) * rowsPerPage;
  props.TABLE_BODY.value.splice(0, props.TABLE_BODY.value.length, ...props.TABLE_BODY.slice(startRow, startRow + fetchCount));
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  pagination.value.sortBy = sortBy
  pagination.value.descending = descending
}

watch(rowsPerPage, (value) => {
  pagination.value.rowsPerPage = value;
});

watch(selection, (newdateData) => {
  selection.value = newdateData;
  emit("update:itemSelected", selection.value);
});

watch(pagination, (value) => {

});

function editRow(id: number) {
  vuerouter.push(route.path + "/editar/" + id);
}

function viewDetails(id: number) {
  vuerouter.push(route.path + "/visualizacion/" + id);
}

const collapseContent = (text = "") => {
  if (showingFullText.value) {
    return text;
  }
  return `${text?.slice(0, 200).trim()}`;
};
</script>

<style>
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24
}
</style>

