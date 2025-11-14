<template>
  <Dialog
    v-model:visible="props.visible"
    :style="{ width: '75vw' }"
    :modal="true"
    :closable="false"
    class="white-modal tw-p-6"
  >
    <Table
      title="Resultados"
      :columns="columns"
      :url="'/trd/errors/' + batch"
    />

    <template #footer>
      <Button
        label="Cerrar"
        type="primary"
        color="secondary"
        type-button="button"
        icon-right="circle-xmark"
        @click="closeModal"
      />
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import Dialog from "primevue/dialog";
import Button from "../Button/Button.vue";
import Table from "../Table/Table.vue";
import { Column } from "../Table/Table";

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  errors: {
    type: Array,
    required: false,
  },
  batch: {
    type: String,
    required: true,
  },
});

// Emits
const emit = defineEmits(["update:visible"]);

// Cerrar el modal
const closeModal = () => {
  emit("update:visible", false);
};

const columns: Column[] = [
  {
    type: "number",
    header: "Número de Linea",
    field: "lineNumber",
    sort: true,
  },
  {
    type: "string",
    header: "Columna",
    field: "column",
    sort: true,
  },
  {
    type: "string",
    header: "Contenido de la Celda",
    field: "cellValue",
    sort: true,
  },
  {
    type: "string",
    header: "Error",
    field: "error",
    sort: true,
  },
  {
    type: "string",
    header: "Sugerencia",
    field: "suggestion",
    sort: true,
  },
];

const onPaginatorChange = (val) => {};
</script>

<style>
.white-modal {
  background: white !important;
  color: black !important;
}

.white-modal :deep(.p-dialog-header) {
  background: white !important;
  color: black !important;
  border-bottom: 1px solid #e5e7eb !important;
}

.white-modal :deep(.p-dialog-content) {
  background: white !important;
  color: black !important;
}

.white-modal :deep(.p-dialog-footer) {
  background: white !important;
  color: black !important;
  border-top: 1px solid #e5e7eb !important;
}

.white-datatable :deep(.p-datatable) {
  background: white !important;
  color: black !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 8px !important;
}

.white-datatable :deep(.p-datatable-header) {
  background: white !important;
  color: black !important;
  border-bottom: 1px solid #e5e7eb !important;
}

.white-datatable :deep(.p-datatable-thead) {
  background: white !important;
  color: black !important;
}

.white-datatable :deep(.p-datatable-tbody) {
  background: white !important;
  color: black !important;
}

.white-datatable :deep(.p-datatable-tbody > tr > td) {
  background: white !important;
  color: black !important;
  border-bottom: 1px solid #e5e7eb !important;
}

.white-datatable :deep(.p-datatable-column-header-content) {
  background: white !important;
  color: black !important;
}

.white-datatable :deep(.p-datatable-column-title) {
  background: white !important;
  color: black !important;
}

.white-datatable :deep(.p-datatable-sort-icon) {
  color: black !important;
}

.white-datatable :deep(.p-datatable-paginator) {
  background: white !important;
  color: black !important;
  border-top: 1px solid #e5e7eb !important;
}
</style>
