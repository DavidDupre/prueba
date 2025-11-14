<template>
  <div>
    <q-table flat :rows="props.TABLE_BODY" :columns="props.TABLE_HEADER" :row-key="props.keyId"
      table-header-class="text-black text-h6" class="q-mr-md full-width tw-bg-transparent" hide-pagination
      :loading-label="loadingLabel" :selection="props.select" :loading="props.isLoading" v-model:selected="selection"
      :pagination="pagination" @update:pagination="updatePagination">
      <template v-slot:body-cell-id="props">
        <q-td class="tw-flex tw-items-center tw-justify-center tw-gap-2">
          <p>
            {{ props.row.id }}
          </p>
        </q-td>
      </template>

      <template v-slot:body-cell-caso="props">
        <q-td class="tw-w-[125px]" @click="handleCaso(props.row[rowId])">
          <p class="tw-py-1.5 tw-rounded-md col-8 tw-bg-gray-texts tw-px-4 tw-cursor-pointer tw-font-bold">
            {{ props.row.caso }}
          </p>
        </q-td>
      </template>

      <template v-slot:body-cell-toggle="props">
        <q-td>
          <q-toggle v-model="props.row.toggle" color="secondary"></q-toggle>
        </q-td>
      </template>
    </q-table>
    <div class="row justify-between q-mt-md" v-if="TABLE_BODY?.length > 0">
      <div class="tw-flex tw-gap-x-3 tw-items-center">
        <span>Filas</span>
        <q-select :options="[10, 20, 50, 100]" v-model="rowsPerPage" dense outlined
          @update:model-value="handleRowsPerPageChange" />
      </div>
      <q-pagination v-model="pagination.page" color="primary" :max="pagesNumber" size="md" direction-links
        boundary-links boundary-numbers @update:model-value="handlePageChange" :max-pages="7"/>
         {{ paginationMessage }}
      <q-btn icon="refresh" type="button" flat class="invisible" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = withDefaults(defineProps<{
  TABLE_BODY: any[],
  TABLE_HEADER: any[],
  TABLE_TOTAL_ROWS?: number,
  icon?: string,
  keyId?: any,
  msgNoData?: string,
  rowId?: string,
  isSecondIcon?: boolean,
  secondIcon?: string,
  select: "none" | "single" | "multiple",
  isLoading?: boolean;
  paginationMessage?: string;
}>(), {
  select: "none",
  keyId: "codigo",
  secondIcon: "eye",
  TABLE_TOTAL_ROWS: 0,
})

const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: props.TABLE_TOTAL_ROWS
});
const loadingLabel = ref('Cargando información, por favor espere...');
const rowsPerPage = ref(10);
const selection = ref([]);

let pagesNumber = computed(() =>
  props.TABLE_TOTAL_ROWS ? Math.ceil(props.TABLE_TOTAL_ROWS / rowsPerPage.value) : 1
);

watch(() => props.TABLE_TOTAL_ROWS, (newTotal) => {
  pagination.value.rowsNumber = newTotal;
});

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

const handlePageChange = (page: number) => {
  pagination.value.page = page;
  emit('handlePageChange', page);
};

const handleRowsPerPageChange = (newSize: number) => {
  pagination.value.rowsPerPage = newSize;
  pagination.value.page = 1; // Reset to first page
  emit('handleRowsPerPageChange', newSize);
};

const updatePagination = (newPagination) => {
  pagination.value = newPagination;
};

const handleCaso = (id) => {
  emit("handleCaso", id);
};

watch(rowsPerPage, (value) => {
  pagination.value.rowsPerPage = value;
});

watch(selection, (newdateData) => {
  selection.value = newdateData;
  emit("update:itemSelected", selection.value);
});

const cleanSelect = () => {
  selection.value = []
}

defineExpose({
  cleanSelect
})

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
