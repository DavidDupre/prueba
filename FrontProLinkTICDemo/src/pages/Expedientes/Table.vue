
<template>
  <div>
    <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER"
      row-key="codigoExpediente" table-header-class="text-black text-h6 " class="q-mr-md full-width" selection="multiple" v-model:selected="selection" hide-pagination v-model:pagination="pagination" >
      <template v-slot:body-cell-estados="props">
        <q-td class="">

          <span class="tw-border tw-border-green-700 tw-bg-green-100   tw-rounded-xl col-8 tw-py-2 tw-px-4">
            {{ props.row.estados ? 'Activo' : 'Inactivo' }}
          </span>
        </q-td>
      </template>

      <template v-slot:body-cell-estado="props">
        <q-td class="">

          <span class="tw-border tw-border-green-700 tw-bg-green-100   tw-rounded-xl col-8 tw-py-2 tw-px-4">
            {{ props.row.estado ? 'Activo' : 'Inactivo' }}
          </span>
        </q-td>
      </template>



      <template v-slot:body-cell-acciones="props">

        <q-td class="text-center">
          <!-- <a :href="'/expediente/detalle/' + props.row.codigoExpediente">
            <q-btn size="sm" color="secondary" :icon="icon || 'edit'" flat />
          </a> -->
          <q-btn type="button" color="transparent" text-color="secondary" icon="settings" size="sm" rounded round flat @click="handleAnular(props.row.idExpediente)"></q-btn>
          <q-btn type="button" color="transparent" text-color="secondary" icon="delete" size="sm" rounded round flat @click="handleEliminar(props.row.idExpediente)"></q-btn>
          <q-btn type="button" color="transparent" text-color="secondary" icon="link" size="sm" rounded round flat @click="handleAsociarExp(props.row.idExpediente)"></q-btn>
          <q-btn type="button" color="transparent" text-color="secondary" icon="attachment" size="sm" rounded round flat @click="handleAsociarRad(props.row.idExpediente)"></q-btn>
        </q-td>

      </template>
      <template v-slot:no-data="">
        <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
          <img v-lazy :data-url="NoData" alt="" width="120">
          <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
            {{ msgNoData ? msgNoData : 'No existe data por el momento' }}
          </span>
        </div>
      </template>
    </q-table>
    <div class="row justify-between q-mt-md" v-if="TABLE_BODY?.length > 0">
      <div class="tw-flex tw-gap-x-3 tw-items-center">
        <span>Filas por página</span>
        <q-select :options="[5, 25, 50, 100]" v-model:model-value="rowsPerPage" dense outlined/>
      </div>
      <q-pagination v-model="pagination.page" color="secondary" :max="pagesNumber" size="md" direction-links boundary-links boundary-numbers />
      <q-btn icon="refresh" type="button" flat class="invisible"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import NoData from "assets/filterImage.svg";

const vuerouter = useRouter()
const route = useRoute();

const selection = ref([])

const props = withDefaults(defineProps<{
  TABLE_BODY: any[],
  TABLE_HEADER: any[],
  selection: "none" | "single" | "multiple" | undefined,
  itemSelected?: any[],
  icon: string,
  msgNoData: string
  // buscar: string,
  // action: string,
  // target?: string,
}>(), {
  selection: "none"
  // target: ""
})

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 5
})

let pagesNumber = computed(() => Math.ceil(props.TABLE_BODY.length / rowsPerPage.value))
const rowsPerPage = ref(5);

const emit = defineEmits(['update:itemSelected', 'anular', 'eliminar', 'asociarExp', 'asociarRad'])

watch(selection, (newdateData) => {
  selection.value = newdateData
  emit('update:itemSelected', selection.value)
});
watch(rowsPerPage, (value) => {
  pagination.value.rowsPerPage = value;
})
const fakeAlerta = ["alerta", "falso"];


function editRow(id: number) {
  vuerouter.push(route.path + '/editar/' + id)
}

function handleAnular(id: number) {
  emit("anular", id)
}
function handleEliminar(id: number) {
  emit("eliminar", id)
}
function handleAsociarExp(id: number) {
  emit("asociarExp", id)
}
function handleAsociarRad(id: number) {
  emit("asociarRad", id)
}


</script>

<style lang="scss" scoped></style>

