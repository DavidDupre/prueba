<template>
  <div>
    <q-table key="test" flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId"
      table-header-class="text-black text-h6" class="q-mr-md full-width tw-bg-transparent table"
      rows-per-page-label="Páginas" hide-pagination v-model:pagination="pagination" :selection="'multiple'"
      v-model:selected="selection" :loading="isLoading">

      <template v-slot:body-cell-plantilla="props">
        <q-td v-if="props.row?.plantilla" :class="`${isDevuelta(props.row)}`">
          <q-btn flat color="primary" @click="handleClickDocumnet(props.row.plantilla)" icon="file_open" />
        </q-td>

        <q-td v-else>
          <span> - </span>
        </q-td>

      </template>

      <template v-slot:body-cell-activo="props">
        <q-td :class="`tw-w-[125px] ${isDevuelta(props.row)}`">
          <q-toggle :modelValue="props.row.activo" @update:modelValue="handleToggle(props.row.id, props.row.activo)" />
        </q-td>
      </template>

      <template v-slot:body-cell-acciones="props">
        <q-td class="text-center">
          <q-btn size="sm" color="primary" :icon="icon" flat @click="editData(props.row)" />
        </q-td>
      </template>

      <template v-slot:no-data="{ icon, message }">
        <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
          <img v-lazy :data-url="NoData" alt="" width="120">
          <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
            No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente
          </span>
        </div>
      </template>
    </q-table>
    <div class="row justify-between q-mt-md" v-if="TABLE_BODY?.length > 0">
      <div class="tw-flex tw-gap-x-3 tw-items-center">
        <span>Filas</span>
        <q-select :options="[5, 25, 50, 100]" v-model:model-value="rowsPerPage" dense outlined
          @update:model-value="handleRowsPerPageChange" />
      </div>
      <q-pagination v-model="page" color="primary" :max="TABLE_TOTAL_ROWS" size="md" direction-links boundary-links
        boundary-numbers @update:model-value="handlePageChange" />
      <q-btn icon="refresh" type="button" flat class="invisible" />
    </div>
  </div>

  <Modal v-model:model-value="changeState" title="Confirmación" persistent
    :text="`¿Está seguro de ${getDataProp ? 'inactivar' : 'activar'} el prefijo?`" :is-success="false"
    :cancelButton="true" @handle-accept="cambiarEstado" textButtonCancel="No" text-button="Si"
    @close-modal="changeState = false" />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { sgdeaAxios } from "src/services";
import moment from "moment";
import { toast } from "src/helpers/toast";
import Modal from 'src/components/Modal/Modal.vue'
//@ts-ignore
import NoData from "assets/filterImage.svg"
import { useQuasar } from "quasar";

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
    labelData?: boolean,
    maxPages?: number,
    pagesPaginationProps?: any

  }>(),
  {
    selection: "none",
    keyId: "id",
    secondIcon: "eye",
    isSelection: "multiple",
    icon: "printer",
  }
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
  "handleRowsPerPageChange",
  "showDocumentPlantilla"
]);

let pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 20,
})
const page = ref(1)
const rowsPerPage = ref(20);
const selection = ref([]);
const itemSelectedToChange = ref(null);
const getDataProp = ref();
const changeState = ref(false)
const $q = useQuasar();
$q.iconSet.table.arrowUp = 'import_export';

async function handleToggle(id, isActive) {
  itemSelectedToChange.value = id
  getDataProp.value = isActive
  changeState.value = true
}

const cambiarEstado = async () => {
  const wantedIndexSelected = props.TABLE_BODY.findIndex((item) => item.id === itemSelectedToChange.value)
  const statusItem = getDataProp.value ? 'inactivar' : 'activar'
  try {
    props.TABLE_BODY[wantedIndexSelected].activo = statusItem === 'activar' ? true : false
    try {
      const id = props.TABLE_BODY[wantedIndexSelected].id
      await sgdeaAxios.put(`/medicina/prefijo-oficina/${id}`, {
        activo: statusItem === 'activar' ? true : false,
        descripcion: props.TABLE_BODY[wantedIndexSelected].descripcion
      });
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    toast.error(`No se ha podido ${statusItem} exitosamente.`)
  }
}

function isDevuelta(row) {
  if (row.fechaRevisor && row.estado == 'En edición' && moment().add(5, "hours").diff(row.fechaRevisor, 'hours') > 24) {

    return 'orange-row'
  }
  return ''
}

const handleClickDocumnet = (nodeId) => {
  emit('showDocumentPlantilla', nodeId)
}

const editData = (row) => {
  emit("handleEditData", row.id);
};

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
