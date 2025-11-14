<template>
  <div>
    <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId" table-header-class="text-black text-h6"
      class="q-mr-md full-width tw-bg-transparent table" rows-per-page-label="Páginas" hide-pagination
      v-model:pagination="pagination" :loading="isLoading" @request="onRequest">

      <!-- Encabezados de la tabla -->
      <template v-for="column in TABLE_HEADER" :key="column.name" v-slot:[`header-cell-${column.name}`]="props">
        <q-th v-if="!excludeIconsFrom.includes(column.name)" class="tw-relative">
          <div class="tw-flex tw-items-center tw-justify-center tw-gap-0.5">
            <p>{{ props.col.label }}</p>
          </div>
        </q-th>
      </template>

      <!-- Celdas de Estado -->
      <template v-slot:body-cell-estado="props">
        <q-td class="tw-w-[125px]">
          <p
            class="tw-py-1.5 tw-rounded-md tw-bg-[#e5edff] tw-px-4 tw-cursor-pointer tw-font-bold tw-border-[0.5px] tw-border-[#b3c8ff]">
            {{ props.row.estado }}
          </p>
        </q-td>
      </template>

      <!-- Celdas de Número de Radicado -->
      <template v-slot:body-cell-numeroRadicado="props">
        <q-td>
          <p>{{ props.row.numeroRadicado || 'Sin número' }}</p>
        </q-td>
      </template>

      <!-- Mensaje cuando no hay datos -->
      <template v-slot:no-data="props">
        <q-td class="tw-flex">
          <q-icon name="warning" />
          <p class="tw-py-1.5 tw-px-4">
            No se encontraron datos con los criterios ingresados, Por favor verifique e intente nuevamente.
          </p>
        </q-td>
      </template>

      <!-- Botón de Acciones -->
      <template v-slot:body-cell-acciones="props">
        <q-td class="text-center">
          <q-btn class="tw-w-auto tw-h-9 flex tw-bg-[#f2f4f5]"
            @click="editData(props.row.radicado, props.row.moduloOrigen, props.row.fechaVencimiento, props.row.tiempoPorVencer)">
            <span class="tw-px-2">Reclasificación</span>
          </q-btn>

        </q-td>
      </template>
    </q-table>

    <!-- Paginación y control de filas -->
    <div class="row items-center q-mt-md" v-if="TABLE_BODY?.length > 0">
      <div class="col-auto tw-flex tw-gap-x-3 tw-items-center">
        <span>Filas</span>
        <q-select :options="[5, 25, 50, 100]" v-model="rowsPerPage" dense outlined
          @update:model-value="handleRowsPerPageChange" />
      </div>

      <div class="col tw-flex tw-justify-center">
        <q-pagination v-model="pagination.page" color="primary" :max="pagesNumber" size="md" direction-links
          boundary-links boundary-numbers @update:model-value="handlePageChange" />
      </div>
      <div class="col-auto tw-text-right">
        {{ paginationMessage }}
      </div>
    </div>

  </div>

  <!-- Modal de Trazabilidad -->
  <q-dialog full-width v-model="trazaModal">
    <q-card class="q-pa-xl tw-w-[3000px]">
      <a @click="trazaModal = false" class="tw-text-primary" style="text-decoration: none;">
        <q-icon size="1.5em" name="chevron_left" color="primary" />
        <b>Volver</b>
      </a>
      <q-table flat :rows="trazabilidadData" :columns="trazabilidadColumns" :row-key="keyId"
        table-header-class="text-black text-h6" class="q-mr-md full-width tw-h-full" hide-pagination>
      </q-table>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const trazabilidadData = ref([]);
const trazaModal = ref(false);
const rowsPerPage = ref(20);
const selection = ref([]);
const excludeIconsFrom = ['trazabilidad', 'acciones'];

const trazabilidadColumns = ref([
  { name: "user", label: "Usuario", field: "nombre", align: "center", sortable: true },
  { name: "action", label: "Acción", field: "descripcion", align: "center", sortable: true },
  { name: "date", label: "Fecha", field: "fechaHora", align: "center", sortable: true },
  { name: "status", label: "Estado", field: "estado", align: "center", sortable: true },
  { name: "description", label: "Detalle", field: "descripcion", align: "center", sortable: true },
]);

const props = defineProps<{
  TABLE_BODY: any[];
  TABLE_HEADER: any[];
  TABLE_TOTAL_ROWS: number;
  selection: "none" | "single" | "multiple";
  itemSelected: any[];
  icon?: string;
  keyId?: string;
  msgNoData?: string;
  isLoading?: boolean;
  paginationMessage?: string;
}>();

const emit = defineEmits([
  "update:itemSelected",
  "handleEditData",
  "handlePageChange",
  "handleRowsPerPageChange"
]);

const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0
});

const pagesNumber = computed(() =>
  Math.ceil((props.TABLE_TOTAL_ROWS ?? props.TABLE_BODY.length) / rowsPerPage.value)
);

const editData = (id: number, moduloOrigen: number, fechaVencimiento: string, tiempoPorVencer: string) => {
  emit("handleEditData", id, moduloOrigen, fechaVencimiento, tiempoPorVencer);
};

const handleRowsPerPageChange = (event: any) => {
  emit("handleRowsPerPageChange", event);
};

const handlePageChange = (event: any) => {
  emit("handlePageChange", event);
};

function onRequest(props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  pagination.value.rowsNumber = props.TABLE_TOTAL_ROWS;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;
}

watch(rowsPerPage, (value) => {
  pagination.value.rowsPerPage = value;
});

watch(selection, (newData) => {
  selection.value = newData;
  emit("update:itemSelected", selection.value);
});
</script>

<style>
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}
</style>
