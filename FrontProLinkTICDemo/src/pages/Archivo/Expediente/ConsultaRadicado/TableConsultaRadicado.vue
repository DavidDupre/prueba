<template>
  <div class="mt-10">
    <q-table
      flat
      :rows="TABLE_BODY"
      :columns="TABLE_HEADER"
      :row-key="keyId"
      table-header-class="text-black text-h6"
      :selection="select"
      class="q-mr-md full-width"
      hide-pagination
      v-model:pagination="pagination"
      v-model:selected="selection"
      :loading="loading"
    >
      <template v-slot:body-cell-acciones="props">
        <q-td class="text-center">
          <q-btn
            label="Ver"
            color="secondary"
            dense
            flat
            class="q-ml-sm"
            @click="emit('verDocumentos', props.row)"
          />
        </q-td>
      </template>

      <template v-slot:no-data>
        <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
          <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
            {{ msgNoData || "No existe data por el momento" }}
          </span>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = withDefaults(
  defineProps<{
    TABLE_BODY: any[];
    TABLE_HEADER: any[];
    keyId?: string;
    msgNoData?: string;
    select?: "none" | "single" | "multiple";
    totalPages?: number;
    loading?: boolean;
  }>(),
  {
    select: "none",
    keyId: "id",
    totalPages: 1,
    loading: false
  }
);

const emit = defineEmits([
  "verDetalles",
  "verDocumentos",
  "update:filas",
  "update:pages",
  "update:itemSelected"
]);

const numPage = ref(1);
const rowsPerPage = ref(10);
const selection = ref([]);
const pagination = ref({
  sortBy: "fechaRadicacion",
  descending: false,
  page: 1,
  rowsPerPage: 10,
});

watch(selection, (newSelection) => {
  emit("update:itemSelected", newSelection);
});

const handleFilas = () => {
  emit("update:filas", rowsPerPage.value);
};

const handlePage = () => {
  emit("update:pages", rowsPerPage.value, numPage.value - 1);
};
</script>