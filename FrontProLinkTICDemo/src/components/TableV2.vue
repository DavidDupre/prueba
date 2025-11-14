
<template>
  <div>
    <q-table flat :rows-per-page-options="[5, 25, 50, 100]" :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId"
      table-header-class="text-black text-h6 " class="q-mr-md full-width" rows-per-page-label="Páginas" :pagination.sync="pagination"
      selection="multiple" v-model:selected="selection">


      <template v-slot:pagination="scope">
        <span style="font-size: 14px; padding-bottom: 2px;">{{ intervalLabel }}</span>

        <q-btn
          v-if="pagination.page > 1"
          icon="first_page"
          color="grey-8"
          round
          dense
          flat
          :disable="pagination.page <= 1"
          @click="firstPage"
        />

        <q-btn
          icon="chevron_left"
          color="grey-8"
          round
          dense
          flat
          :disable="pagination.page <= 1"
          @click="prevPage"
        />

        <q-btn
          icon="chevron_right"
          color="grey-8"
          round
          dense
          flat
          :disable="(pagination.page*pagination.rowsPerPage) >= pagination.rowsNumber"
          @click="nextPage"
        />

        <q-btn
          v-if="pagination.page > 1"
          icon="last_page"
          color="grey-8"
          round
          dense
          flat
          :disable="(pagination.page*pagination.rowsPerPage) >= pagination.rowsNumber"
          @click="lastPage"
        />
      </template>

      <template v-slot:body-cell-estados="props">
        <q-td class="tw-w-[125px]">
          <p :class="[
            'tw-border  tw-h-[20px] tw-rounded-xl col-8',
           props.row.estados ? ' tw-border-green-700 tw-bg-green-100' : ' tw-border-gray-400 tw-bg-gray-200 tw-text-secondary'
           ]">
            {{ props.row.estados ? 'Activo' : 'Inactivo' }}
          </p>
        </q-td>
      </template>

      <template v-slot:body-cell-acciones="props">
        <q-td class="text-center">
          <q-btn size="sm" color="secondary" :icon="icon || 'edit'" flat
            @click="editRow(props.row.id_seriesubserie || props.row.id || props.row[rowId])" />
          <q-btn size="sm" color="secondary" :icon="secondIcon" flat v-if="isSecondIcon"
                 @click="viewDetails(props.row[rowId])" />
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td class="text-center">
          <q-btn size="sm" color="secondary" :icon="icon || 'edit'" flat
                 @click="editData(props.row[rowId])" />
          <q-btn size="sm" color="secondary" :icon="secondIcon" flat v-if="isSecondIcon"
                 @click="handleSecondIcon(props.row[rowId])" />
        </q-td>
      </template>

      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
          <img v-lazy :data-url="NoData" alt="" width="120">
          <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
            {{ msgNoData ? msgNoData : 'No existe data por el momento' }}
          </span>
        </div>
      </template>

      <template v-slot:body-cell-procedimiento="props">
        <div class="tw-border-b-[1px] tw-w-96 tw-px-2">
          <p class="tw-text-center tw-border-0">
            {{ collapseContent(props.row.procedimiento) }}
          </p>
          <div class="tw-flex tw-justify-end" v-if="props.row.procedimiento?.length >= 200">
            <q-btn flat color="secondary" @click="showingFullText = !showingFullText">
              {{ showingFullText ? 'Ver menos' : 'Ver más'}}
            </q-btn>
          </div>
        </div>
      </template>

    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import NoData from "assets/filterImage.svg"
const props = withDefaults(defineProps<{
  TABLE_BODY: any[],
  TABLE_HEADER: any[],
  selection: "none" | "single" | "multiple" | undefined,
  itemSelected: any[],
  icon?: string,
  keyId?: string,
  msgNoData: string,
  rowId: string,
  isSecondIcon: boolean,
  secondIcon: string,
  pagination: object;
  nextPage
  prevPage
  firstPage
  lastPage
  intervalLabel
  // buscar: string,
  // action: string,
  // target?: string,
}>(), {
  selection: "none",
  keyId: "codigo",
  secondIcon: "eye",
  // target: ""
})
const vuerouter = useRouter()
const route = useRoute()

const selection = ref([])
const showingFullText = ref(false)

const emit = defineEmits(['update:itemSelected', 'handleEditData', 'handleSecondIcon'])

const editData = (id: number) => {
  emit('handleEditData', id)
}

const handleSecondIcon = (id: number) => {
  emit('handleSecondIcon', id)
}

watch(selection, (newdateData) => {
  selection.value = newdateData
  emit('update:itemSelected', selection.value)
});


function editRow(id: number) {
  vuerouter.push(route.path + '/editar/' + id)
}

function viewDetails(id: number) {
  vuerouter.push(route.path + '/visualizacion/' + id)
}

const collapseContent = (text = '') => {
  if (showingFullText.value) {
    return text;
  }
  return `${text?.slice(0, 200).trim()}`;
}
</script>

<style lang="scss" scoped></style>

