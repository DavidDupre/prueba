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
          <router-link :to="'/administracion/puntos-radicacion/editar/' + props.row.id">
            <q-btn no-caps style="color: #FF7500;" unelevated icon="edit" />
          </router-link>
        </q-td>
      </template>

      <template v-slot:bottom>
        <div class="row q-mt-md" style="width: 100%;">
          <div class="col">
            <label for="" class="flex items-center q-gutter-x-md">
              <span style="font-size: 14px; font-weight: 500;">
                Filas por página
              </span>
              <q-select style="width: 120px; height: 40px;" outlined dense mapOptions emitValue
                :options="[5, 25, 50, 100]" v-model:model-value="pagination.rowsPerPage" />
            </label>
          </div>

          <q-pagination v-model="pagination.page" color="black" active-color="primary" direction-links gutter="20px"
            :max="pagesNumber" :max-pages="6" class="col-8 q-pl-xl" />
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
    :text="`¿Está seguro de ${getDataProp?.estado ? 'inactivar' :  'activar'} el punto?`"
    :is-success="false" :cancelButton="true" @handle-accept="cambiarEstado" textButtonCancel="No"
    text-button="Si" @close-modal="changeState = false" />
  <Modal v-model:model-value="changeStatePending" title="Confirmación" persistent
    text="La oficina a inactivar tiene trámites pendientes en la bandeja del asignador de responsable"
    @handle-accept="changeState = false" text-button="Aceptar" @close-modal="changeState = false" />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

import Modal from 'src/components/Modal/Modal.vue'
// import { JUZGADOS_HEADER } from ".";
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

const emit = defineEmits(['updated-status'])

const changeState = ref(false)
const changeStatePending = ref(false)

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  sortBy: 'point_name',
})
const idItem = ref(null)
const selectedIndex = ref(null)

const confirmModal = async(clickedIndex, id) => {

  changeState.value = true
  idItem.value = id
  selectedIndex.value = clickedIndex
}

const cambiarEstado = async () => {

  const wantedIndexSelected= props.JUZGADOS_BODY.findIndex((item) => item.id === idItem.value)
  const statusItem =  !props.JUZGADOS_BODY[wantedIndexSelected].estado
  try {
    await sgdeaAxios.patch(`/correspondencia/puntoRadicacion/alternarEstado/${idItem.value}`);
    props.JUZGADOS_BODY[wantedIndexSelected].estado = statusItem
    emit('updated-status', {index: wantedIndexSelected, status: statusItem})
    toast.success(`El punto de radicación ha sido ${statusItem ? 'activado' : 'inactivado'} exitosamente.`)
  } catch (error) {
    if (error.response.status === 506) {
      changeStatePending.value = true
    }
    toast.error(`${statusItem ? 'Activación' : 'Inactivación'} de oficina no exitosa.`)
  }
}

const pagesNumber = computed(() => Math.ceil(props.JUZGADOS_BODY.length / pagination.value.rowsPerPage));
const getDataProp = computed(() => props.JUZGADOS_BODY.find(item => item.id == idItem.value));



</script>
