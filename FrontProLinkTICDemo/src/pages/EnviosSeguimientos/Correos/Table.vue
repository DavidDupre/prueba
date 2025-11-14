<template>
  <div>
    <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId" table-header-class="text-black text-h6"
      :selection="select" class="q-mr-md full-width" hide-pagination v-model:pagination="pagination"
      v-model:selected="selection" color="primary">

      <template v-slot:body-cell-asignaciones="props">
        <q-td class="tw-w-[125px]">
          <p :class="[
            'tw-border tw-h-[20px] tw-rounded-xl col-8',
            props.row.escalado ? ' tw-border-green-700 tw-bg-green-100' : ' tw-border-gray-400 tw-bg-gray-200 tw-text-secondary'
          ]">
            {{ props.row.asignaciones.etapa }}
            {{ props.row.escalado ? 'Si' : 'No' }}
          </p>
        </q-td>
      </template>

      <template v-slot:body-cell-estado="props">
        <q-td class="text-center">
          <div :class="[
            'tw-border tw-rounded-full q-my-sm tw-max-w-max q-px-md q-py-xs', 'tw-bg-orange-100 tw-border-orange-400'
          ]">
            {{ props.row.estado }}
          </div>
        </q-td>
      </template>

      <!-- <template v-slot:body-cell-accion="props">
        <q-td style="height: 100% !important;">
          <q-btn class="tw-w-auto tw-h-9 flex tw-bg-[#f2f4f5]" @click="editData(props.row)">
            <span class="tw-px-2">{{ "Asignar" }}</span>
          </q-btn>
        </q-td>
      </template> -->

      <template v-slot:body-cell-acciones="props">
        <q-td class="text-center">
          <q-btn flat color="primary" @click="showDocs(props.row)" icon="inventory_2">
          </q-btn>
        </q-td>
      </template>

      <template v-slot:no-data="{ icon, message }">
        <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
          <img v-lazy :data-url="NoData" alt="" width="120">
          <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
            {{ msgNoData ? msgNoData : 'No existe data por el momento' }}
          </span>
        </div>
      </template>

      <template v-slot:body-cell-trazabilidad="props">
        <q-td>
          <q-btn flat color="primary" @click="getTrazabilidad(props.row)" icon="history">
          </q-btn>
        </q-td>
      </template>

    </q-table>
    <div class="row justify-between q-mt-md" v-if="TABLE_BODY?.length > 0">
      <div class="tw-flex tw-gap-x-3 tw-items-center">
        <span>Filas</span>
        <q-select :options="[5, 20, 25, 50, 100]" v-model:model-value="rowsPerPage" dense outlined />
      </div>
      <q-pagination v-model="pagination.page" color="primary" :max="pagesNumber" :max-pages="6" size="md"
        direction-links boundary-links boundary-numbers />
      <q-btn icon="refresh" type="button" flat class="invisible" />
    </div>
  </div>
  <q-dialog full-width v-model="trazaModal">
    <q-card class="q-pa-xl tw-w-[3000px]">
      <a @click="trazaModal = false" class="tw-text-primary" style="text-decoration: none;">
        <q-icon size="1.5em" name="chevron_left" color="primary" />
        <b>
          Volver
        </b>
      </a>
      <q-table flat :rows="trazabilidadData" :columns="trazabilidadColumns" :row-key="keyId"
        table-header-class="text-black text-h6" class="q-mr-md full-width tw-h-full" hide-pagination
        v-model:pagination="paginationTut"> </q-table>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
//@ts-ignore
import NoData from "assets/filterImage.svg"
import { sgdeaAxios } from "src/services";
import moment from "moment";
import { trazabilidadColumns } from ".";

const props = withDefaults(defineProps<{
  TABLE_BODY: any[],
  TABLE_HEADER: any[],
  icon?: string,
  keyId?: any,
  msgNoData?: string,
  rowId?: string,
  isSecondIcon?: boolean,
  secondIcon?: string,
  select: "none" | "single" | "multiple",
  TABLE_TOTAL_PAGES: number
}>(), {
  select: "none",
  keyId: "codigo",
  secondIcon: "eye",
})

const emit = defineEmits(['update:itemSelected', 'handleEditData', 'showDocs'])
const sortFor = ref()
const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  sortBy: sortFor.value,
  descending: false,
})
const paginationTut = ref({
  page: 1,
  rowsPerPage: 20
})
let pagesNumber = computed(() => Math.ceil(props.TABLE_BODY.length / rowsPerPage.value))

const trazabilidadData = ref()
const rowsPerPage = ref(10)
const selection = ref([])
const trazaModal = ref(false)

async function getTrazabilidad(row) {
  let response
  switch(row.idFlujo.id){
    case 1:
    response = await sgdeaAxios.get('/trazabilidad/obtenerPorCodProceso/' + 'COR' + row.idCaso);
  if (!response?.data || response.data.length === 0) {
    trazabilidadData.value = [];
    return;
  }
  break;
    case 5:
     response = await sgdeaAxios.get('/trazabilidad/obtenerPorCodProceso/' + 'PQRD' + row.idCaso);
  if (!response?.data || response.data.length === 0) {
    trazabilidadData.value = [];
    return;
  }
  break;
    case 6:
     response = await sgdeaAxios.get('/trazabilidad/obtenerPorCodProceso/' + 'TUT' + row.idCaso);
  if (!response?.data || response.data.length === 0) {
    trazabilidadData.value = [];
    return;
  }
  break;
    case 7:
    response = await sgdeaAxios.get('/trazabilidad/obtenerPorCodProceso/' + 'ENTC' + row.idCaso);
  if (!response?.data || response.data.length === 0) {
    trazabilidadData.value = [];
    return;
  }
  break;
    case 8:
     response = await sgdeaAxios.get('/trazabilidad/obtenerPorCodProceso/' + 'ML' + row.idCaso);
  if (!response?.data || response.data.length === 0) {
    trazabilidadData.value = [];
    return;
  }
  break;
  }

  trazabilidadData.value = response.data.sort((a, b) => a.id - b.id).map((item, index) => ({
    ...item,
    fechaHora: moment(item.fechaHora).format('DD/MM/YYYY HH:mm'),
  }));
  trazaModal.value = true
}

// const editData = (id: number) => {
//   emit('handleEditData', id)
// }

const showDocs = (rowData: any) => {
  emit('showDocs', rowData)
}

watch(rowsPerPage, (value) => {
  pagination.value.rowsPerPage = value;
})

watch(selection, (newdateData) => {
  selection.value = newdateData
  emit('update:itemSelected', selection.value)
});

</script>
