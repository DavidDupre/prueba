
<template>
  <div>
    <q-table flat :rows-per-page-options="[5, 25, 50, 100]" :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId"
      table-header-class="text-black text-h6 " class="q-mr-md full-width" rows-per-page-label="Páginas"
      selection="multiple" v-model:selected="selection">
      <template v-slot:body-cell-estados="props">
        <q-td class="">

          <span :class="[
            'tw-border tw-rounded-xl col-8 tw-py-2 tw-px-4',
            props.row.estados ? ' tw-border-green-700 tw-bg-green-100 ' : 'tw-border-gray-400 tw-bg-gray-200 tw-text-secondary'
          ]">
            {{ props.row.estados ? 'Activo' : 'Inactivo' }}
          </span>
        </q-td>
      </template>

      <template v-slot:body-cell-descargar="props">

        <q-td class="">
          <q-btn color="blue-8" icon="download" flat no-caps :href="props.row.descargar">Descargar</q-btn>

        </q-td>


      </template>
      <template v-slot:body-cell-formato="props">

        <q-td>
          <div class="text-center row tw-justify-center tw-items-center tw-gap-4">

            <img v-lazy :data-url="formatos[props.row.formato]" alt="">
            <p>{{ props.row.formato }}</p>
          </div>

        </q-td>


      </template>
      <template v-slot:no-data="{ icon, message }">
        <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
          <img v-lazy :data-url="NoData" alt="" width="120">
          <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
            {{ 'No existe data por el momento' }}
          </span>
        </div>
      </template>

    </q-table>
  </div>
</template>

<script setup lang="ts">
import excel from "assets/excel.svg"
import pdf from "assets/pdf.svg"
import word from "assets/word.svg"

const formatos: any = {
  excel, pdf, word
}

import { ref, watch } from "vue";

import NoData from "assets/filterImage.svg"
const props = withDefaults(defineProps<{
  TABLE_BODY: any[],
  TABLE_HEADER: any[],
  icon?: string,
  keyId?: string,
  // buscar: string,
  // action: string,
  // target?: string,
}>(), {

  // target: ""
})

const selection = ref([])

const emit = defineEmits(['update:itemSelected', 'handleEditData', 'handleSecondIcon'])

watch(selection, (newdateData) => {
  selection.value = newdateData
  emit('update:itemSelected', selection.value)
});
</script>

<style lang="scss" scoped></style>

