<template>
  <div>
    <q-table ref="myTable" :rows="BODY_TABLE" :columns="COLUMN_TABLE" row-key="codigo" selection="multiple"
      v-model:selected="selected" hide-pagination v-model:pagination="pagination">
      <template v-slot:body-selection="props">
        <th>
          <q-checkbox v-model="props.selected" color="secondary" />
        </th>
      </template>
      <template v-slot:no-data>
        <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
          <img v-lazy :data-url="NoData" alt="" width="120">
          <span class="tw-text-lg tw-mt-4 tw-w-[480px] tw-text-center">
            {{ msgNoData ? msgNoData : 'No existe data por el momento' }}
          </span>
          <q-btn flat color="primary" @click="addProcess">
            <q-icon size="1.1em" name="add" class="q-mr-sm" color="primary"></q-icon>
            Crear nuevo proceso
          </q-btn>
        </div>
      </template>
    </q-table>
    <div class="row justify-between q-mt-md" v-if="BODY_TABLE?.length > 0">
      <div class="tw-flex tw-gap-x-3 tw-items-center">
        <span>Filas por página</span>
        <q-select :options="[5, 25, 50, 100]" v-model:model-value="pagination.rowsPerPage" dense outlined />
      </div>
      <q-pagination v-model="pagination.page" color="secondary" :max="pagesNumber" size="md" direction-links
        boundary-links boundary-numbers rounded />
      <q-btn icon="refresh" type="button"></q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import NoData from "assets/filterImage.svg"
const props = defineProps<{
  COLUMN_TABLE: any[],
  BODY_TABLE: any[],
  SUB_HEADER_TABLE: any[],
  value: any,
  msgNoData: string,
}>()

const selected = ref([]);;
const showingFullText = ref(false)

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 2,
  rowsPerPage: 5
})
let pagesNumber = computed(() => Math.ceil(props.BODY_TABLE.length / pagination.value.rowsPerPage))

const emit = defineEmits(['update:value', 'add'])

watch(selected, (selectedData) => {
  selected.value = selectedData
  emit('update:value', selected.value)
});


const addProcess = () => {
  emit('add', true);
}

</script>

<style lang="scss" scoped>
.border-header {
  border-color: rgba(0, 0, 0, 0.12);
  border-top: 10px;
  border-left: 0;
  border-bottom-width: 1px;
}

.border {
  border: transparent;
}
</style>
