<template>
  <div>
    <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId" table-header-class="text-black text-h6 "
      class="q-mr-md full-width tw-bg-transparent" rows-per-page-label="Páginas" hide-pagination
      v-model:pagination="pagination" :selection="isSelection" v-model:selected="selection" :loading="isLoading" @request="onRequest">

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
          <q-btn flat color="primary"
            @click="$router.push('/facturacion/facturas-manual/detalles/' + props.row.id + '/trazabilidad')"
            icon="history">
          </q-btn>
        </q-td>
      </template>

      <template v-slot:body-cell-estado="props">
        <q-td class="tw-w-[125px]">
          <p
            class="tw-py-1.5 tw-rounded-md col-8 tw-bg-[#ffe6d0ad] tw-px-4 tw-cursor-pointer tw-font-bold tw-border-[0.5px] tw-border-[#ff770065]">
            {{ props.row.estado }}
          </p>
        </q-td>
      </template>

      <template v-slot:body-cell-documentos="props">
        <q-td>
          <q-btn flat color="primary"
            @click="$router.push('/facturacion/facturas-manual/detalles/' + props.row.id + '/docsRelacionados')">
            <q-icon name="inventory" />
          </q-btn>
        </q-td>
      </template>

      <template v-slot:body-cell-acciones="props">
        <q-td class="text-center">
          <q-btn class="tw-w-auto tw-h-9 flex" @click="editData(props.row.id)">
            <span class="tw-px-2">{{ props.row.acciones }}</span>
          </q-btn>
          <!-- <q-btn size="sm" color="secondary" :icon="icon || 'edit'" flat
                        @click="editRow(props.row.id_seriesubserie || props.row.id || props.row[rowId])" />
                    <q-btn size="sm" color="secondary" :icon="secondIcon" flat v-if="isSecondIcon"
                        @click="viewDetails(props.row[rowId])" /> -->
        </q-td>
      </template>
    </q-table>
  <div class="row items-center q-mt-md tw-w-full" v-if="TABLE_BODY?.length > 0">
  <div class="col-auto tw-flex tw-gap-x-3 tw-items-center">
    <span>Filas</span>
    <q-select
      v-model:model-value="rowsPerPage"
      :options="[5, 25, 50, 100]"
      dense
      outlined
      style="width: 120px"
      @update:model-value="handleRowsPerPageChange"
    />
  </div>

  <div class="col tw-flex tw-justify-center">
    <q-pagination
      v-model="pagination.page"
      :max="pagesNumber"
      color="primary"
      size="md"
      direction-links
      boundary-links
      boundary-numbers
      @update:model-value="handlePageChange"
    />
  </div>

  <div class="col-auto tw-flex tw-items-center tw-text-right">
    {{ paginationMessage }}
    <q-btn icon="refresh" type="button" flat class="invisible" />
  </div>
</div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

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
    paginationMessage?: string;
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

const handleSecondIcon = (id: number) => {
  emit("handleSecondIcon", id);
};

const handleCaso = (id) => {
  emit("handleCaso", id);
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
