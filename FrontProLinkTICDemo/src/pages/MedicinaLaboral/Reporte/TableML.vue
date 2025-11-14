<template>
  <div>
    <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId" table-header-class="text-black text-h6 "
      class="q-mr-md full-width tw-bg-transparent" rows-per-page-label="Páginas" hide-pagination
      v-model:pagination="pagination" :selection="select" v-model:selected="selection">

      <template v-slot:body-cell-id="props">
        <q-td class="tw-flex tw-items-center tw-justify-center tw-gap-2">
          <p>
            {{ props.row.id }}
          </p>
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
        <div class="row tw-justify-between q-mt-lg tw-w-[100%]" v-if="TABLE_BODY?.length > 0">
          <div class="tw-flex tw-gap-x-2 tw-items-center">
            <span>Filas</span>
            <q-select :options="[5, 25, 50, 100]" v-model:model-value="rowsPerPage" dense outlined
              @update:model-value="handleRowsPerPageChange" />
          </div>
          <q-pagination v-model="page" max-pages="15" ellipsis color="primary" :max="TABLE_TOTAL_ROWS" size="md"
            direction-links boundary-links boundary-numbers @update:model-value="handlePageChange" />
          <q-btn icon="refresh" type="button" flat class="invisible" />
            <p class="tw-flex tw-gap-x-3 tw-items-center">
        {{ paginationMessage }}
      </p>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = withDefaults(defineProps<{
  TABLE_BODY: any[],
  TABLE_HEADER: any[],
  TABLE_TOTAL_ROWS: number;
  icon?: string,
  keyId?: any,
  msgNoData?: string,
  rowId?: string,
  isSecondIcon?: boolean,
  secondIcon?: string,
  paginationMessage?: string;
  select: "none" | "single" | "multiple"
}>(), {
  select: "none",
  keyId: "codigo",
  secondIcon: "eye"
})

const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 20,
});

const page = ref(1)
const rowsPerPage = ref(20);
const selection = ref([]);

const emit = defineEmits([
  "update:itemSelected",
  "handleRowsPerPageChange",
  "handlePageChange"
]);

const handleRowsPerPageChange = (event: any) => {
  pagination.value.rowsPerPage = event
  if (pagination.value.page > 0) {
    pagination.value.page = pagination.value.page - 1
  }
  emit("handleRowsPerPageChange", pagination.value);
};

const handlePageChange = () => {
  emit("handlePageChange", { page: page.value, rowsPerPage: pagination.value.rowsPerPage });
};

watch(selection, (newdateData) => {
  selection.value = newdateData;
  emit("update:itemSelected", selection.value);
});

watch(rowsPerPage, (value) => {
  pagination.value.rowsPerPage = value;
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