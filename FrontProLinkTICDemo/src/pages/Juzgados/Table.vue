<template>
  <div>
    <q-table flat :rows="JUZGADOS_BODY" :columns="JUZGADOS_HEADER" row-key="id"
      table-header-class="text-black text-h6 " class="q-mr-md full-width"
      no-data-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
      no-results-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
      v-model:pagination="pagination" hide-pagination>

      <template v-slot:body-cell-estado="props">
        <q-td>
          <q-toggle :modelValue="props.row.estado" @update:modelValue="confirmModal(props.rowIndex, props.row.id)" color="primary"  />
        </q-td>
      </template>

      <template v-slot:body-cell-acciones="props">
        <q-td>
          <router-link :to="'/juzgados/editar/' + props.row.id">
            <q-btn no-caps style="color: #FF7500;" unelevated icon="edit" />
          </router-link>
        </q-td>
      </template>

      <template v-slot:bottom>
        <div class="row tw-justify-between q-mt-md tw-w-[100%]">
          <div class="tw-flex tw-gap-x-3 tw-items-center">
            <span>Filas</span>
            <q-select
              style="width: 120px; height: 40px"
              outlined
              dense
              mapOptions
              emitValue
              :options="[5, 20, 25, 50, 100]"
              v-model:model-value="pagination.rowsPerPage"
            />
          </div>
          <q-pagination
            v-model="pagination.page"
            color="primary"
            :max="pagesNumber"
            size="md"
            ellipses
            max-pages="10"
            direction-links
            boundary-links
            boundary-numbers
          />
          <div class="invisible"></div>
        </div>
      </template>

      <template v-slot:no-data="{ message }">
        <div class="flex items-center justify-center full-width">
          <div class="flex items-center justify-center q-mt-lg"
            style="padding: 15px; border: 1px solid #E3E4E5; border-radius: 5px; gap: 9px;">
            <q-icon size="20px" name="cancel" color="negative" />
            <span class="text-weight-medium">
              {{ message }}
            </span>
          </div>
        </div>
      </template>
    </q-table>
  </div>
  <Modal v-model:model-value="changeState" title="Confirmación" persistent
    :text="`¿Está seguro de ${getDataProp?.estado ? 'inactivar' : 'activar'} el juzgado ${getDataProp?.nombre} - ${getDataProp?.codigo}?`"
    :is-success="false" :cancelButton="true" @handle-accept="cambiarEstado" textButtonCancel="No"
    text-button="Si" @close-modal="changeState = false" />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

import Modal from 'src/components/Modal/Modal.vue'
import { JUZGADOS_HEADER } from ".";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";


const props = withDefaults(defineProps<{
  JUZGADOS_HEADER: any[],
  JUZGADOS_BODY: any[],
  action?: string,
  target?: string
}>(), {
  target: ""
})
const changeState = ref(false)

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  sortBy: 'nombre',
  descending: false,
})
const idItem = ref(null)
const selectedIndex = ref(null)

const confirmModal = async(clickedIndex, id) => {
  changeState.value = true
  idItem.value = id
  selectedIndex.value = clickedIndex
}

const cambiarEstado = async () => {
  try {
    const response = await sgdeaAxios.put(`/juzgados/${idItem.value}`);
    const statusItem = props.JUZGADOS_BODY[selectedIndex.value].estado = !props.JUZGADOS_BODY[selectedIndex.value].estado
    if (response.status === 200) {
      toast.success(`Juzgado ${statusItem ? 'activado' : 'inactivado'} exitosamente.`)
    } else {
      toast.error(`No se a podido ${statusItem ? 'activado' : 'inactivado'} exitosamente.`)
    }
  } catch (error) {
    toast.error('Ha ocurrido un error.')
  }
}

const getLabelEstados = (row) => {
  const rowLabel = row.toLowerCase();

  if (rowLabel === 'radicado') return 'Asignar';
  if (rowLabel === 'gestionado') return 'Aprobar';

  return 'Gestionar'
}
const pagesNumber = computed(() => Math.ceil(props.JUZGADOS_BODY.length / pagination.value.rowsPerPage));
const getDataProp = computed(() => props.JUZGADOS_BODY[selectedIndex.value]);

</script>
