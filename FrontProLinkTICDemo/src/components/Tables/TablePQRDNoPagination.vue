<template>
  <div>
    <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId" table-header-class="text-black text-h6"
      class="q-mr-md full-width tw-bg-transparent table" rows-per-page-label="Páginas" hide-pagination
      v-model:pagination="pagination" :selection="isSelection" v-model:selected="selection" :loading="isLoading">

      <template v-for="column in TABLE_HEADER" :key="column.name" v-slot:[`header-cell-${column.name}`]="props">
        <q-th v-if="!excludeIconsFrom.includes(column.name)" class="tw-relative">
          <div class="tw-flex tw-items-center tw-justify-center tw-gap-0.5">
            <p>{{ props.col.label }}</p>
          </div>
        </q-th>
        <q-th v-else>
          <div class="tw-flex tw-items-center tw-justify-center tw-gap-0.5">
            <p>{{ props.col.label }}</p>
          </div>
        </q-th>
      </template>

      <template v-slot:body-cell-trazabilidad="props">
                <q-td>
                    <q-btn flat color="primary" @click="getTrazabilidad(props.row.id)" icon="history">
                    </q-btn>
                </q-td>
            </template>

      <template v-slot:body-cell-estado="props">
        <q-td class="tw-w-[125px]">
          <p
            class="tw-py-1.5 tw-rounded-md col-8 tw-bg-[#e5edff] tw-px-4 tw-cursor-pointer tw-font-bold tw-border-[0.5px] tw-border-[#b3c8ff]">
            {{ props.row.estado }}
          </p>
        </q-td>
      </template>

      <template v-slot:body-cell-acciones="props">
        <q-td class="text-center">
          <q-btn class="tw-w-auto tw-h-9 flex tw-bg-[#f2f4f5]" @click="editData(props.row.id)">
            <span class="tw-px-2">{{ getLabelEstados(props.row.estado) }}</span>
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


const getLabelEstados = (row) => {
  const rowLabel = row.toLowerCase();

  if (rowLabel === 'por asignar' || rowLabel === 'radicado') return 'Asignar';
  if (rowLabel === 'por aprobar' || rowLabel === 'gestionado') return 'Aprobar';

  return 'Gestionar'
}

const trazabilidadData = ref()
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
  rowsNumber: 0
});

const excludeIconsFrom = ['trazabilidad', 'acciones'];
const rowsPerPage = ref(20);
const selection = ref([]);
const showingFullText = ref(false);

let pagesNumber = computed(() =>
  Math.ceil((props.TABLE_TOTAL_ROWS ?? props.TABLE_BODY.length) / rowsPerPage.value)
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

const editData = (id: number) => {
  emit("handleEditData", id);
};

const handleRowsPerPageChange = (event: any) => {
  emit("handleRowsPerPageChange", event);
};

const handlePageChange = (event: any) => {
  emit("handlePageChange", event);
};

watch(rowsPerPage, (value) => {
  pagination.value.rowsPerPage = value;
});

watch(selection, (newdateData) => {
  selection.value = newdateData;
  emit("update:itemSelected", selection.value);
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

