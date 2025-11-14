<template>
  <div>
    <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId" table-header-class="text-black text-h6"
      class="q-mr-md full-width tw-bg-transparent table" rows-per-page-label="Páginas" hide-pagination
      v-model:pagination="pagination" :selection="'none'" v-model:selected="selection"
      :no-data-label="labelData ? 'No se encontraron datos con los criterios ingresados, Por favor verifique e intente nuevamente' : null"
      :loading="isLoading" row->

      <template v-slot:body-cell-trazabilidad="props">
        <q-td :class="`${isDevuelta(props.row)}`">
          <q-btn flat color="primary" @click="getTrazabilidad(props.row.id)" icon="history">
          </q-btn>
        </q-td>
      </template>

      <template v-slot:body-cell-estado="props">
        <q-td :class="`tw-w-[125px] ${isDevuelta(props.row)}`">
          <q-toggle v-model="props.row.activo" @click="() => handleToggle(props.row.id, props.row.activo)" />
        </q-td>
      </template>

      <template v-slot:body-cell-acciones="props">
        <q-td class="text-center">
          <q-btn size="sm" color="primary" :icon="icon" flat @click="editData(props.row)" />
        </q-td>
      </template>
    </q-table>
    <div class="row justify-between q-mt-md" v-if="TABLE_BODY?.length > 0">
      <div class="tw-flex tw-gap-x-3 tw-items-center">
        <span>Filas</span>
        <q-select :options="[5, 25, 50, 100]" v-model:model-value="rowsPerPage" dense outlined
          @update:model-value="handleRowsPerPageChange" />
      </div>
      <q-pagination v-model="pagination.page" color="primary" :max="pagesNumber" size="md" direction-links
        boundary-links boundary-numbers @update:model-value="handlePageChange" />
      <q-btn icon="refresh" type="button" flat class="invisible" />
    </div>
  </div>
  <q-dialog full-width v-model="trazaModal">
    <q-card class="q-pa-xl tw-w-[3000px]">
      <a @click="trazaModal = false" class="tw-text-primary" style="text-decoration: none;">
        <q-icon size="1.5em" name="chevron_left" color="primary" />
        <b>
          Volver
        </b>
      </a>
      <q-table flat :rows="trazabilidadData" :columns="trazabilidadColumns" :row-key="keyId"
        table-header-class="text-black text-h6" class="q-mr-md full-width tw-h-full" hide-pagination> </q-table>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { sgdeaAxios } from "src/services";
import moment from "moment";

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
    labelData?: boolean
  }>(),
  {
    selection: "none",
    keyId: "numero",
    secondIcon: "eye",
    isSelection: "multiple",
    icon: "printer",
  }
);


async function handleToggle(id, isActive) {
  isActive = !isActive;

  try {
    const response = await sgdeaAxios.patch(`/notificaciones/alternar/${id}`);

    return id;
  } catch (error) {
    console.error(error);
  }
}


const getLabelEstados = (row, clonado, isConsolidador, isEscalamiento) => {

  const rowLabel = row.toLowerCase();

  if (rowLabel === 'para gestión' && isEscalamiento) return 'Gestionar escalado';
  if (rowLabel === 'por asignar' || rowLabel === 'radicado') return 'Asignar';
  if (rowLabel === 'por aprobar' || rowLabel === 'gestionado') return 'Aprobar';
  if (rowLabel === 'para gestión' && clonado && isConsolidador) return 'Por consolidar';
  if (rowLabel === 'por revisar') return 'Revisar';
  if (rowLabel === 'para gestión' && clonado) return 'Gestionar clonado';
  if (rowLabel === 'aprobada') return 'Entregar';

  return 'Gestionar'
}

function isDevuelta(row) {
  if (row.fechaRevisor && row.estado == 'En edición' && moment().add(5, "hours").diff(row.fechaRevisor, 'hours') > 24) {

    return 'orange-row'
  }
  return ''
}

const trazabilidadData = ref()
const trazaModal = ref(false)
let pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 20,
})
const rowsPerPage = ref(20);
const selection = ref([]);
const trazabilidadColumns = ref<any>([
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
  }, {
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

async function getTrazabilidad(id) {
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
  emit("handleEditData", row.id);
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

.orange-row {
  background-color: lightsalmon !important;
}
</style>
