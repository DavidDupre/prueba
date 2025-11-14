<template>
  <div class="tw-bg-white tw-p-10" style="border-radius: 5px">

    <div class="flex justify-between">
      <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2">Ver solicitudes</h2>
      <q-btn type="submit" label="Agregar Clonación" class="tw-w-36 tw-ml-2 tw-h-[40px]" color="primary"
        @click="assignCloned()" />
    </div>
    <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId" table-header-class="text-black text-h6"
      class="q-mr-md full-width tw-bg-transparent" rows-per-page-label="Páginas" hide-pagination
      v-model:pagination="pagination" :selection="isSelection" v-model:selected="selection" :loading="isLoading"
      @request="onRequest">
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

      <!--      <template v-slot:body-cell-trazabilidad="props">-->
      <!--        <q-td class="tw-cursor-pointer">-->
      <!--          <q-icon size="1.5rem">-->
      <!--            <img v-lazy :data-url="trazabilidad_icon_pqrd">-->
      <!--          </q-icon>-->
      <!--        </q-td>-->
      <!--      </template>-->

      <!--      <template v-slot:body-cell-estado="props">-->
      <!--        <q-td class="tw-w-[125px]">-->
      <!--          <p class="tw-py-1.5 tw-rounded-md col-8 tw-bg-[#e5edff] tw-px-4 tw-cursor-pointer tw-font-bold tw-border-[0.5px] tw-border-[#b3c8ff]">-->
      <!--            {{ props.row.estado }}-->
      <!--          </p>-->
      <!--        </q-td>-->
      <!--      </template>-->

      <template v-slot:body-cell-aceptacion="props">
        <q-td class="text-center">
          <q-btn v-if="props.row?.estado !== 'Excluido'" flat class="tw-w-auto tw-h-8 tw-bg-[#fde5e5]" @click="rechazar(props.row.idAsignacion)">
            <span class="tw-pr-4 tw-pl-3 text-blue-grey-10"><q-icon name="close" size="24px"
                class="tw-mr-2" />Rechazar</span>
          </q-btn>
          <q-btn v-if="props.row?.estado !== 'Excluido'" flat class="tw-w-auto tw-ml-2 tw-h-8 tw-bg-[#ebf8ea]"
            @click="aprobar(props.row.idAsignacion, props.row?.usuario)">
            <span class="tw-pr-4 tw-pl-3 text-blue-grey-10"> <q-icon name="check" size="24px"
                class="tw-mr-2" />Aceptar</span>
          </q-btn>
          <!-- <q-btn size="sm" color="secondary" :icon="icon || 'edit'" flat @click="editRow(props.row.id_seriesubserie || props.row.id || props.row[rowId])" />
          <q-btn size="sm" color="secondary" :icon="secondIcon" flat v-if="isSecondIcon" @click="viewDetails(props.row[rowId])" /> -->
        </q-td>
      </template>

      <template v-slot:body-cell-acciones="props">
        <q-td class="text-center">
          <q-btn @click="excludeCloned(props.row)" title="Excluir" type="button" color="transparent" text-color="red"
            icon="close" size="md" rounded round flat :disabled="props.row?.estado === 'Excluido'">
          </q-btn>
          <q-btn @click="replaceCloned(props.row)" title="Reemplazar" type="button" color="transparent"
            text-color="secondary" icon="autorenew" size="md" rounded round flat>
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <div class="row justify-between q-mt-md" v-if="TABLE_BODY?.length > 0">
      <div class="tw-flex tw-gap-x-3 tw-items-center">
        <span>Filas</span>
        <q-select :options="[5, 10, 20, 50, 100]" v-model:model-value="rowsPerPage" dense outlined
          @update:model-value="handleRowsPerPageChange" />
      </div>
      <q-pagination v-model="pagination.page" color="primary" :max="pagesNumber" size="md" direction-links
        boundary-links boundary-numbers @update:model-value="handlePageChange" />
      <q-btn icon="refresh" type="button" flat class="invisible" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
// import trazabilidad_icon_pqrd from "assets/trazabilidad_icon_pqrd.svg"
// import ConfirmModal from "components/Modal/ConfirmModal.vue";

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
  rowsPerPage: 10,
  rowsNumber: 0
});

const excludeIconsFrom = ['trazabilidad', 'acciones'];
const rowsPerPage = ref(10);
const selection = ref([]);
const showingFullText = ref(false);
const showExcludeModal = ref(false);
const selectedCloned = ref(null);

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
  'rechazar',
  "handleThridIcon",
  "handlePageChange",
  "handleRowsPerPageChange",
  "aprobar",
  "excludeCloned",
  "replaceCloned",
  "assignCloned"
]);

const editData = (id: number) => {
  emit("handleEditData", id);
};

const rechazar = (data) => {
  emit("rechazar", data)
}

const aprobar = (data, nombre) => {
  emit("aprobar", { data, nombre })
}

const assignCloned = () => {
  emit("assignCloned");
}

const excludeCloned = (data) => {
  emit("excludeCloned", { data });
}

const replaceCloned = (data) => {
  emit("replaceCloned", { data });
}

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
