<template>
  <q-table flat :rows="filteredData" :columns="TABLE_HEADER" :row-key="keyId" table-header-class="text-black"
    class="q-mr-md full-width" rows-per-page-label="Páginas" color="secondary" hide-pagination
    v-model:pagination="pagination" :selection="isSelection" v-model:selected="selection" :loading="isLoading"
    no-data-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
    no-results-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente">

    <template v-slot:top-right>
      <div class="tw-flex tw-items-center tw-gap-x-3">
        <q-input v-model="search" class="tw-w-[300px]" dense label="Buscador" outlined rounded
          @update:model-value="emitSearch" @blur="emitSearchImmediate">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </template>

    <template v-slot:body-cell-estado="props">
      <q-td class="tw-w-[125px]">
        <span
          :class="`tw-inline-block tw-py-2 tw-min-w-36 tw-font-semibold tw-border-[0.5px] tw-rounded-lg ${ESTADOS[props.row.estado]}`">
          {{ props.row.estado }}
        </span>
      </q-td>
    </template>

    <template v-slot:body-cell-trazabilidad="props">
      <q-td class="tw-cursor-pointer">
        <q-icon name="history" size="sm" color="primary" @click="() => handleTrazabilidad(props.row.id)" />
      </q-td>
    </template>

    <template v-slot:body-cell-actions="props">
      <q-td v-if="auth.userInfo.role === 'Gestionador'">
        <q-btn size="sm" color="primary" class="-tw-ml-4" :icon="'delete'" flat @click="showModalDelete(props.row)"
          :disabled="props.row.estado === 'Eliminada'" />
        <q-btn
          v-if="props.row.estado === 'Por revisar' || props.row.estado === 'Revisado' || props.row.estado === 'Por aprobar' || props.row.estado === 'Aprobado'"
          size="sm" color="primary" icon="visibility" flat @click="editData(props.row.id)" />

        <q-btn v-else size="sm" color="primary" icon='edit' flat @click="editData(props.row.id)" />

        <q-btn flat class="tw-cursor-pointer" icon="file_open" @click="sendToDoc(props.row.id, 'adjuntar-documento')"
          color="secondary" size="sm" />
      </q-td>

      <q-td v-else>
        <q-btn flat class="tw-w-24 tw-h-9 tw-inline-block" @click="editData(props.row.id)">
          <span class="tw-px-2">{{ getAction(props.row.estado) }}</span>
        </q-btn>

        <q-btn class="tw-inline-block tw-w-auto tw-h-9" icon="file_open" flat
          @click="sendToDoc(props.row.id, 'documentos-relacionados')" color="secondary" />
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
        <q-pagination v-model="page" max-pages="20" ellipsis color="primary" :max="TABLE_TOTAL_ROWS" size="md"
          direction-links boundary-links boundary-numbers @update:model-value="handlePageChange" />
        <div class="invisible"></div>
      </div>
    </template>
  </q-table>

  <!-- ! Trazabilidad -->
  <q-dialog full-width v-model="trazaModal">
    <q-card class="tw-px-8 tw-py-7 tw-w-[300px]">
      <a @click="trazaModal = false" class="tw-text-primary tw-cursor-pointer" style="text-decoration: none">
        <q-icon size="1.5em" name="chevron_left" color="primary" />
        <b>Volver</b>
      </a>
      <Trazabilidad :doneItems="trazabilidadData" />

    </q-card>
  </q-dialog>
  <Modal v-model:model-value="showModal" title="Confirmación" persistent
    :text="`¿Está seguro de eliminar la comunicación ${isCom?.nombre}?`" :is-success="false" :cancelButton="true"
    @handle-accept="deleteData" textButtonCancel="No" text-button="Si" />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { sgdeaAxios } from "src/services";
import moment from "moment";
import Modal from "src/components/Modal/Modal.vue";
import { useAuthStore } from "src/stores/auth.store";
import { ESTADOS } from "src/assets/estados/estados";
import Trazabilidad from "src/pages/Expedientes/Trazabilidad/Trazabilidad.vue";
import { toast } from "src/helpers/toast";
//ss
const props = withDefaults(
  defineProps<{
    TABLE_BODY: any[];
    TABLE_HEADER: any[];
    TABLE_TOTAL_ROWS: number;
    selection: "none" | "single" | "multiple" | undefined;
    inputDataProp?: string | undefined;
    itemSelected: any[];
    icon?: string;
    keyId?: string;
    msgNoData?: string;
    isSecondIcon?: boolean;
    secondIcon?: string;
    isThridIcon?: boolean;
    isSelection?: "none" | "single" | "multiple" | undefined;
    isToggle?: boolean;
    iconTrazabilidad?: string;
    userId?: string;
    role?: string;
    isLoading?: boolean;
  }>(),
  {
    selection: "multiple",
    keyId: "codigo",
    secondIcon: "eye",
    isSelection: 'multiple',
  }
);

const auth = useAuthStore()
const trazabilidadData = ref();
const trazaModal = ref(false);
const rowsPerPage = ref(25);
const selection = ref([])
const showModal = ref(false)
const isCom = ref()
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 25
})
const page = ref(1)

const filteredData = ref([]);
const originData = ref([]);
const search = ref("");
const debounceTimeout = ref<any>(null);
const emit = defineEmits([
  'handleEditData',
  'handleRowsPerPageChange',
  'handlePageChange',
  'sendToDocs',
  'updateTable',
  'search-change'
])

// Función para emitir búsqueda con debounce
const emitSearch = () => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }

  debounceTimeout.value = setTimeout(() => {
    emit('search-change', search.value);
  }, 300);
};

// Función para búsqueda inmediata al perder foco
const emitSearchImmediate = () => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }
  emit('search-change', search.value);
};


const getAction = (state) => {
  if (state === 'Por revisar') return 'Revisar'
  if (state === 'Por aprobar') return 'Aprobar'
  return state
}

const editData = (id: number) => {
  emit('handleEditData', id)
}

const sendToDoc = (id: number, tab: string) => {
  emit('sendToDocs', id, tab)
}

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

async function handleTrazabilidad(id) {
  const response = await sgdeaAxios.get(
    "/trazabilidad/obtenerPorCodProceso/" + "MLCOM" + id
  );
  if (!response || !response?.data || response.data.length === 0) {
    trazabilidadData.value = [];
    trazaModal.value = true;
    return;
  } else {
    trazabilidadData.value = response.data
      .sort((a, b) => a.id - b.id)
      .map((item, index) => ({
        ...item,
        fechaHora: moment(item.fechaHora).format("DD/MM/YYYY HH:mm"),
      }));
    trazaModal.value = true;
  }
  trazaModal.value = true;
}

const showModalDelete = async (rowData) => {
  isCom.value = rowData
  showModal.value = true
}

const deleteData = async () => {
  try {
    const response = await sgdeaAxios.put(`/medicina/comunicacionEliminar/${isCom.value.id}`)
    if (response.status === 200) {
      toast.success(`La comunicación ${isCom.value?.nombre} fue eliminada correctamente`)
      emit('updateTable', page.value, pagination.value.rowsPerPage)
    }
  } catch (error) {
    toast.error("Ha ocurrido un error al eliminar la comunicación")
  }
}

watch(rowsPerPage, (value) => {
  pagination.value.rowsPerPage = value;
});
watch(
  () => props.TABLE_BODY,
  (newValue, oldValue) => {
    originData.value = newValue;
    filteredData.value = newValue;
  }
);
</script>
