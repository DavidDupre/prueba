<template>
  <div>
    <q-table flat :rows="filteredData" :columns="TABLE_HEADER" row-key="id" table-header-class="text-black text-h6 "
      class="q-mr-md full-width"
      no-data-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
      no-results-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
      v-model:pagination="props.pagination" hide-pagination>

      <template v-slot:top-right>
        <div class="tw-flex tw-items-center tw-gap-x-3">
          <q-input outlined dense rounded v-model="search" label="Buscador" class="tw-w-[300px]"
            @update:model-value="generalFilter">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </template>

      <template v-slot:body-cell-estado="props">
        <q-td>
          <q-toggle :modelValue="props.row.estado" @update:modelValue="confirmModal(props.rowIndex, props.row.id)"
            color="primary" />
        </q-td>
      </template>

      <template v-slot:body-cell-acciones="props">
        <q-td>
          <router-link :to="'/juntas-eps-arl/editar/' + props.row.id">
            <q-btn no-caps style="color: #FF7500;" unelevated icon="edit" />
          </router-link>
          <q-btn no-caps style="color: red;" unelevated icon="delete"
            @click="confirmModalDelete(props.rowIndex, props.row.id)" />
        </q-td>
      </template>

      <template v-slot:bottom>
        <div class="row tw-justify-between q-mt-md tw-w-[100%]">
          <div class="tw-flex tw-gap-x-3 tw-items-center">
            <span>Filas</span>
            <q-select :options="[5, 20, 25, 50, 100]" v-model:model-value="props.pagination.rowsPerPage" dense outlined
              @update:model-value="handleRowsPerPageChange" />
          </div>
          <q-pagination :model-value="Number(props.pagination.page)+1" max-pages="10" ellipsis color="primary"
            :max="props.totalPages" size="md" direction-links boundary-links boundary-numbers
            @update:model-value="handlePageChange" />
          <div class="invisible"></div>
        </div>
      </template>

      <template v-slot:no-data="{message}">
        <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
          <img v-lazy :data-url="require('src/assets/filterImage.svg')" alt="" width="120">
          <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
            {{message}}
          </span>
        </div>
      </template>
    </q-table>
  </div>
  <Modal v-model:model-value="changeState" title="Confirmación" persistent
    :text="`¿Está Seguro de ${getDataProp?.estado ? 'Desactivar' : 'Activar'} la Junta Eps y Arl del Remitente${getDataProp?.nombreRemitente}`"
    :is-success="false" :cancelButton="true" @handle-accept="cambiarEstado" textButtonCancel="No" text-button="Si"
    @close-modal="changeState = false" />

  <Modal v-model:model-value="changeStateDelete" title="Confirmación" persistent
    text="¿Está Seguro de Eliminar esta Junta Eps y Arl?" :is-success="false" :cancelButton="true"
    @handle-accept="deleteJunta" textButtonCancel="No" text-button="Si" @close-modal="changeStateDelete = false" />
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

import { TABLE_HEADER } from "src/pages/Juntas-eps-arl";
import Modal from 'src/components/Modal/Modal.vue'
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";

const emit = defineEmits([
  "handleRowsPerPageChange",
  "handlePageChange",
  "refresh"
]);

const props = withDefaults(defineProps<{
  TABLE_HEADER: any[];
  TABLE_BODY: any[];
  totalPages?: number;
  action?: string;
  pagination: any;
  target?: string;
}>(), { target: "" });


const filteredData = ref([]);
const originData = ref([]);
const search = ref("");

const getDataProp = computed(() => filteredData.value[selectedIndex.value]);
const changeState = ref(false)
const changeStateDelete = ref(false)

const idItem = ref(null)
const selectedIndex = ref(null)

const confirmModal = async(clickedIndex, id) => {
  changeState.value = true
  idItem.value = id
  selectedIndex.value = clickedIndex
}
const confirmModalDelete = async(clickedIndex, id) => {
  changeStateDelete.value = true
  idItem.value = id
  selectedIndex.value = clickedIndex
}

const cambiarEstado = async () => {
  try {
    const response = await sgdeaAxios.patch(`medicina/juntas-eps-arl`, {
      ...getDataProp.value,
      estado: !getDataProp.value.estado
    });
    const statusItem = filteredData.value[selectedIndex.value].estado = !filteredData.value[selectedIndex.value].estado
    if (response.status === 200) {
      toast.success(`Junta ${statusItem ? 'activada' : 'Desactivada'} exitosamente.`)
    } else {
      toast.error(`No se a Podido ${statusItem ? 'Activar' : 'Desactivar'}.`)
    }
  } catch (error) {
    toast.error('Ha ocurrido un error.')
  }
} 

const deleteJunta = async () => {
  try {
    const response = await sgdeaAxios.delete(`medicina/juntas-eps-arl/${getDataProp.value.id}`);
    if (response.status === 200) {
      toast.success(`Junta Eliminada exitosamente.`)
      emit("refresh");
    } else {
      toast.error(`No se Pudo Eliminar la Junta.`)
    }
  } catch (error) {
    toast.error('Ha ocurrido un error.')
  }
} 

const generalFilter = () => {
  filteredData.value = originData.value.filter((data) => {
    const fieldValues = Object.values(data).map(String);
    return fieldValues.some((value) =>
      value?.toLowerCase().includes(search.value?.toLowerCase())
    );
  });
};

watch(
  () => props.TABLE_BODY,
  (newValue, oldValue) => {
    originData.value = newValue;
    filteredData.value = newValue;
  }
);

const handleRowsPerPageChange = (event: number) => {
  emit("handleRowsPerPageChange", event);
};

const handlePageChange = (event: number) => {
  emit("handlePageChange", event-1);
};
</script>
