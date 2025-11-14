<script lang="ts" setup>
import {
  withDefaults,
  defineProps,
  defineEmits,
  ref,
  watch,
} from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Paginator from "primevue/paginator";
import IconField from "primevue/iconfield";
import ButtonComponent from "src/shared/components/PrimeComponents/Button/Button.vue";
import InputTextComponent from "src/shared/components/PrimeComponents/Input/InputText.vue";
import Icon from "src/shared/components/PrimeComponents/Icon/Icon.vue";
import { useDataTable } from "./useDataTable";
// import empty from "src/assets/empty.svg";
import { fourthFormatDate } from "src/helpers/formtDate";
import ExportFile from "components/FormFields/exportFiles.vue";
const tablaRef = ref(null);
const emit = defineEmits([
  "update:page",
  "update:rowsPerPage",
  "searchInput",
  "update:selected",
]);
const props = withDefaults(
  defineProps<{
    columns: any[];
    url: string;
    showSearch?: boolean;
    instance?: any;
    filter?: any;
    params?: any;
    viewPagination?: boolean;
    title?: string;
    dataKey?: string;
    noDataMessage?: string;
    exportFile?: boolean;
    placeholderSearch?: string;
    isSeleccion?: boolean;
    metodo?: string;
    body?: any;
  }>(),
  {
    showSearch: false,
    placeholderSearch: "Buscar...",
    viewPagination: true,
    noDataMessage: "No se encontraron registros que coincidan con su consulta.",
    exportFile: true,
    isSeleccion: false,
    metodo: undefined,
    body: null,
  }
);

// Usa la lógica extraída
const {
  globalFilter,
  dataTable,
  totalElements,
  currentPage,
  rowsPerPage,
  isLoading,
  onPageChange,
  onPaginatorChange,
  getSemaforoClass,
  selectedElements,
} = useDataTable(
  props.url,
  props.columns,
  props.instance,
  props.filter,
  props.params,
  props.dataKey,
  props.metodo,
  props.body
);

watch(selectedElements, (newSelection) => {
  emit("update:selected", newSelection);
});
</script>

<template>
  <div class="card">
    <h4 class="tw-font-semibold tw-text-lg tw-text-black tw-text-<18px>/<22px>">
      {{ props.title }}
    </h4>
    <template v-if="dataTable.length === 0">
      <div
        class="tw-py-6 tw-pt-[150px] tw-text-base tw-text-center tw-text-gray-500 tw-flex tw-flex-col tw-items-center tw-h-[100%]"
      >
        <!-- <img
          :src="empty"
          class="tw-w-[400px] tw-mb-4 tw-font-semibold"
          alt="No hay datos"
        /> -->
        <p class="tw-text-label">
          {{ props.noDataMessage }}
        </p>
      </div>
    </template>
    <div v-else>
      <DataTable
        :totalRecords="totalElements"
        :value="dataTable"
        :rows="rowsPerPage"
        size="large"
        @page="onPageChange"
        :globalFilter="globalFilter"
        :loading="isLoading"
        ref="tablaRef"
        v-bind="$attrs"
        v-model:selection="selectedElements"
      >
        <template #header v-if="showSearch">
          <div class="tw-flex tw-justify-end tw-w-full">
            <IconField>
              <InputTextComponent
                :placeholder="placeholderSearch"
                v-model:modelValue="globalFilter"
                iconLeft="search"
                iconColor="primary"
                class="!tw-rounded-full"
                :rounded="true"
              />
            </IconField>
          </div>
        </template>

        <Column
          selectionMode="multiple"
          headerStyle="width: 3rem"
          class="tw-text-center"
          v-if="isSeleccion"
        ></Column>

        <Column
          v-for="col of columns"
          :key="col.field"
          :field="col.field"
          :header="col.header"
          :style="{ width: col.width }"
          :sortable="col.sort"
          class="tw-text-center tw-hover:bg-sky-700 tw-whitespace-pre-line"
        >
          <template #body="slotProps">
            <div v-if="col.name === 'actions'" class="tw-gap-2 tw-flex tw-row">
              <ButtonComponent
                v-for="action in col.actions.filter(
                  (a) => !a.isVisible || a.isVisible(slotProps.data)
                )"
                :key="action.label"
                :iconLeft="action.icon"
                :iconRight="action.iconRight"
                type="tertiary"
                :color="action.color"
                class="!tw-shadow-none"
                :class="action.style || 'tw-w-4 tw-h-[48px]'"
                :label="action.label"
                @click="() => action.eventbtn(slotProps.data)"
              />
            </div>
            <div
              v-else-if="col.name === 'semaforo'"
              class="tw-flex tw-items-center tw-p-2 tw-item-center tw-justify-center"
              :class="getSemaforoClass(slotProps.data[col.field])"
            >
              <Icon name="circle" size="3xl" />
            </div>
            <div v-else-if="col.name === 'toggle'">
              <q-toggle
                v-model="slotProps.data[col.field]"
                :true-value="col.toggleTrue"
                :false-value="col.toggleFalse"
                color="primary"
                @update:model-value="() => col.eventToggle(slotProps.data)"
              />
            </div>
            <div
              v-else
              :class="
                slotProps.data[col.field]?.length > 50 ? 'tw-text-justify' : ''
              "
            >
              {{
                col.replaceValue
                  ? col.replaceValue(slotProps.data[col.field])
                  : col.format === "date"
                  ? fourthFormatDate(slotProps.data[col.field])
                  : typeof col.field === "function"
                  ? col.field(slotProps.data)
                  : slotProps.data[col.field]
              }}
            </div>
          </template>
        </Column>
      </DataTable>

      <Paginator
        v-if="viewPagination"
        :first="currentPage * rowsPerPage"
        :rows="rowsPerPage"
        :rowsPerPageOptions="[20, 50, 100]"
        :totalRecords="totalElements"
        @page="onPaginatorChange"
      />
    </div>
    <!-- <div class="tw-flex tw-justify-start tw-mt-4">
      <ExportFile
        v-if="props.exportFile"
        :tableData="dataTable"
        :columns="columns"
        fileName="Data"
      />
    </div> -->
  </div>
</template>

<style lang="css">
.p-datatable-header-cell,
.p-datatable-header,
.p-datatable-tbody > tr,
.p-datatable-tbody > tr > td,
.p-paginator,
.p-select {
  background: transparent !important;
  color: black !important;
  border-color: #e5e7eb !important;
}

.p-select-overlay {
  background: #ffff !important;
  color: black !important;
}

.p-select-label,
.p-select-option {
  color: black !important;
}

.p-datatable-column-header-content {
  display: flex;
  align-items: center;
  gap: var(--p-datatable-header-cell-gap);
  justify-content: center;
}

.p-paginator-page.p-paginator-page-selected,
.p-paginator-prev:hover,
.p-paginator-next:hover,
.p-paginator-last:hover,
.p-paginator-first:hover,
.p-select-option:hover,
.p-select-option:active,
.p-select-option:not(.p-select-option-selected):not(.p-disabled).p-focus,
.p-paginator-page:hover {
  background: var(--primary) !important;
  color: #ffff !important;
  opacity: 0.6 !important;
}

.p-select-option.p-select-option-selected.p-focus {
  background: var(--primary) !important;
}

.p-select-option.p-select-option-selected {
  background: var(--primary) !important;
  color: #ffff !important;
  opacity: 1 !important;
}

.p-select-option.p-select-option-selected.p-focus {
  color: #ffff !important;
}
.p-datatable-column-sorted {
  background: transparent !important;
  color: var(--primary) !important;
}
.p-datatable-column-sorted .p-datatable-sort-icon {
  color: var(--primary) !important;
}
.p-datatable-tbody > tr:hover {
  background-color: #f1f1f1 !important; /* Azul claro con opacidad */
  transition: background-color 0.3s ease-in-out;
}
.p-datatable-thead > tr > th,
.p-datatable-tbody > tr > td {
  text-align: center !important;
}

.p-checkbox .p-checkbox-box {
  background-color: transparent !important;
  border: 1px solid #0283c4 !important;
  transition: all 0.3s ease-in-out;
}

.p-checkbox.p-checkbox-checked .p-checkbox-box {
  background-color: #0283c4 !important;
  border-color: #0283c4 !important;
}

.p-checkbox.p-checkbox-checked .p-checkbox-box .p-checkbox-icon {
  color: white !important;
}

:deep(.p-checkbox.p-checkbox-checked .p-checkbox-box) {
  background-color: #0283c4 !important;
  border-color: #0283c4 !important;
}

:deep(.p-checkbox.p-checkbox-checked .p-checkbox-box .p-checkbox-icon) {
  color: white !important;
}

</style>
