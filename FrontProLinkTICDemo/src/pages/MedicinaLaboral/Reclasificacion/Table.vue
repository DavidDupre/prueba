<template>
    <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId" table-header-class="text-black text-h6"
      class="q-mr-md full-width tw-bg-transparent table" rows-per-page-label="Páginas" hide-pagination
      v-model:pagination="pagination" :loading="isLoading" @request="onRequest"
      no-data-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
      no-results-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente">

      <template v-slot:top-right>
        <div class="tw-flex tw-items-center tw-gap-x-3">
          <q-input outlined dense rounded v-model="search" label="Buscador" class="tw-w-[300px]"
            @update:model-value="generalFilter">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </template>

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
            <span class="tw-px-2">Reclasificación</span>
          </q-btn>
        </q-td>
      </template>

      <template v-slot:no-data="{ message }">
        <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
          <img v-lazy :data-url="require('src/assets/filterImage.svg')" alt="" width="120" />
          <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
            {{ message }}
          </span>
        </div>
      </template>

      <template v-slot:bottom>
        <div class="row tw-justify-between q-mt-md tw-w-[100%]">
          <div class="tw-flex tw-gap-x-3 tw-items-center">
            <span>Filas</span>
            <q-select :options="[5, 25, 50, 100]" v-model:model-value="rowsPerPage" dense outlined
              @update:model-value="handleRowsPerPageChange" />
          </div>
          <q-pagination v-model="pagination.page" max-pages="10" ellipsis color="primary" :max="pagesNumber" size="md"
            direction-links boundary-links boundary-numbers @update:model-value="handlePageChange" />
          <div class="invisible"></div>
        </div>
      </template>
    </q-table>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    TABLE_BODY: any[];
    TABLE_HEADER: any[];
    TABLE_TOTAL_ROWS: number;
    keyId?: string;
    isLoading?: boolean;
  }>(),
  {
    selection: "none",
    keyId: "numero",
    secondIcon: "eye",
    isSelection: "multiple",
    icon: "printer"
  }
);

const excludeIconsFrom = ['trazabilidad', 'acciones'];
const filteredData = ref([]);
const originData = ref([]);
const search = ref("");

const rowsPerPage = ref(20);
const selection = ref([]);
let pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0
});

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

const generalFilter = () => {
  filteredData.value = originData.value.filter((data) => {
    const fieldValues = Object.values(data).map(String);
    return fieldValues.some((value) =>
      value?.toLowerCase().includes(search.value?.toLowerCase())
    );
  });
};

function onRequest(props) {
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

watch(
  () => props.TABLE_BODY,
  (newValue, oldValue) => {
    originData.value = newValue;
    filteredData.value = newValue;
  }
);
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
