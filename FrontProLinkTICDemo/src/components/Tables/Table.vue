<template>
  <div>
    <q-table flat :rows-per-page-options="[5, 25, 50, 100]" :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId"
      table-header-class="text-black" class="q-mr-md full-width" rows-per-page-label="Páginas" color="secondary"
      :selection="isSelection ? 'multiple' : 'none'" v-model:selected="selection">
      <template v-slot:body-cell-estados="props">
        <q-td class="tw-w-[125px]" v-if="isToggle">
          <q-toggle v-model="toggleValue" color="secondary" />
        </q-td>
        <q-td class="tw-w-[125px]" v-else>
          <p :class="[
            'tw-border  tw-h-[20px] tw-rounded-xl col-8',
            props.row.estados ? ' tw-border-green-700 tw-bg-green-100' : ' tw-border-gray-400 tw-bg-gray-200 tw-text-black'
          ]">
            {{ props.row.estados ? 'Activo' : 'Inactivo' }}
          </p>
        </q-td>
      </template>

      <template v-slot:body-cell-trazabilidad="props">
        <q-td class="tw-cursor-pointer">
          <q-icon :name="iconTrazabilidad" size="xs" @click="handleTrazabilidad" />
        </q-td>
      </template>

      <template v-slot:body-cell-caso="props">
        <q-td class="tw-w-[125px]" @click="handleCaso(props.row[rowId])">
          <p
            class="tw-border  tw-h-[20px] tw-rounded-xl col-8 tw-border-black tw-bg-gray-texts tw-px-4 tw-cursor-pointer">
            {{ props.row.caso }}
          </p>
        </q-td>
      </template>

      <template v-slot:body-cell-acciones="props">
        <q-td class="text-center">
          <q-btn size="sm" color="secondary" :icon="icon || 'edit'" flat
            @click="editRow(props.row.id_seriesubserie || props.row.id || props.row[rowId])" />
          <q-btn size="sm" color="secondary" :icon="secondIcon" flat v-if="isSecondIcon"
            @click="viewDetails(props.row[rowId])" />
          <q-btn size="sm" color="secondary" :icon="thridIcon" flat v-if="isThridIcon"
            @click="handleThridIcon(props.row[rowId])" />
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td class="text-center">
          <q-btn size="sm" color="secondary" class="tw-p-0" :icon="icon || 'edit'" flat
            @click="editData(props.row[rowId] || props.row.id)" />
          <q-btn size="sm" color="secondary" :icon="secondIcon" flat v-if="isSecondIcon"
            @click="handleSecondIcon(props.row[rowId])" />
          <q-btn size="sm" color="secondary" :icon="thridIcon" flat v-if="isThridIcon"
            @click="handleThridIcon(props.row[rowId])" />
        </q-td>
      </template>

      <template v-slot:no-data="{ icon, message }">
        <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
          <img v-lazy :data-url="require('src/assets/filterImage.svg')" alt="" width="120">
          <span class="tw-text-lg tw-mt-4 tw-w-[480px] tw-text-center tw-leading-5">
            {{ msgNoData ? msgNoData : 'No se encontraron datos con los criterios ingresados. Por favor verifique e intente nuevamente.' }}
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
              {{ showingFullText ? 'Ver menos' : 'Ver más' }}
            </q-btn>
          </div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">

import { useQuasar } from "quasar";
import { computed, onMounted, onUpdated, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { TableHeader } from 'src/interfaces/TableHeaders'

const props = withDefaults(defineProps<{
  TABLE_BODY: any[],
  TABLE_HEADER: TableHeader[],
  selection: "none" | "single" | "multiple" | undefined,
  inputDataProp?: string | undefined,
  itemSelected: any[],
  icon?: string,
  keyId?: string,
  msgNoData?: string,
  rowId: string,
  isSecondIcon?: boolean,
  secondIcon?: string,
  isThridIcon?: boolean,
  thridIcon: string,
  isSelection?: boolean,
  isToggle?: boolean,
  iconTrazabilidad?: string
}>(), {
  selection: "none",
  keyId: "codigo",
  secondIcon: "eye",
  isSelection: true,
  // target: ""
})
const vuerouter = useRouter()
const route = useRoute()
const q = useQuasar();

const selection = ref([])
const maxNumber = ref(0)
const showingFullText = ref(false)
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 3
})

const emit = defineEmits([
  'update:itemSelected',
  'handleEditData',
  'handleSecondIcon',
  'handleThridIcon',
  'handleCaso',
  'update:inputDataProp',
  'handleTrazabilidad'
])


const toggleValue = computed({
  get() {
    return props.inputDataProp
  },
  set(value) {
    emit('update:inputDataProp', value)
  }
})

const editData = (id: number) => {

  emit('handleEditData', id)

}

const handleCaso = (id) => {
  emit('handleCaso', id)
}

const handleTrazabilidad = (id) => {
  emit('handleTrazabilidad', id)
}

const handleSecondIcon = (id: number) => {
  emit('handleSecondIcon', id)
}

const handleThridIcon = (id: number) => {
  emit('handleThridIcon', id)
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
