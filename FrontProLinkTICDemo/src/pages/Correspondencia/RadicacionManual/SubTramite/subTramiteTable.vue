<template>
  <div class="tw-bg-white">
    <div class="tw-flex tw-items-center tw-justify-between">
      <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2">Tramites comunicacionales</h2>

      <q-input outlined dense rounded v-model="search" label="Buscador" class="tw-w-[300px]"
        @update:model-value="generalFilter">
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>

    </div>
    <!-- <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER"
      row-key="codigoExpediente" table-header-class="text-black text-h6 " class="q-mr-md full-width"
      selection="multiple" v-model:selected="selection"> -->

    <q-table flat :rows="filteredData" :columns="TABLE_HEADER" :row-key="'codigoExpediente'"
      table-header-class="text-black text-h6" class="q-mr-md full-width tw-bg-transparent table"
      rows-per-page-label="Páginas" hide-pagination v-model:pagination="pagination" v-model:selected="selection"
      :selection="isSelection">

      <template v-slot:body-cell-estado="props">
        <q-td class="text-center">
          <div :class="[
        'tw-border tw-rounded-full q-my-sm tw-max-w-max q-px-md q-py-xs',
        (!(props.row?.tiempoXVencer) || (props.row?.tiempoXVencer !== 'Vencido')) ? 'tw-bg-orange-100 tw-border-orange-400' : 'tw-bg-red-100 tw-border-red-400 tw-text-red-500'
      ]">
            {{ props.row?.estado || '-' }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-verDocumento="props">
        <q-td class="tw-justify-center" style="height: 100% !important;">
          <q-btn class="tw-w-auto tw-h-9 tw-bg-[#f2f4f5]" @click="verSubTramites(props.row.id)">
            <span class="tw-px-2">Ver Documentos</span>
          </q-btn>
        </q-td>
      </template>


      <template v-slot:body-cell-trazabilidad="props">
        <q-td>
          <q-btn flat color="primary" @click="getTrazabilidad(props.row.id)" icon="history" />
        </q-td>
      </template>


    </q-table>
    <div class="row justify-between q-mt-md" v-if="TABLE_BODY?.length > 0">
      <div class="tw-flex tw-gap-x-3 tw-items-center">
        <span>Filas</span>
        <q-select :options="[5, 25, 50, 100]" v-model:model-value="rowsPerPage" dense outlined
          @update:model-value="handleRowsPerPageChange" />
      </div>
      <q-pagination v-model="pagination.page" color="primary" :max="pagesNumber" size="md" direction-links
        boundary-links boundary-numbers @update:model-value="handlePageChange" />
      <q-btn icon="refresh" type="button" flat class="invisible" />
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
  </div>
</template>

<script setup lang="ts">

import { useQuasar } from "quasar";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { sgdeaAxios } from "src/services";
import moment from "moment";

let pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 25,
})


const rowsPerPage = ref(25)

const filteredData = ref([])
const originData = ref([])
const pagesNumber = ref(1)
const search = ref('')


const vuerouter = useRouter()
const route = useRoute()

const q = useQuasar();
const trazabilidadData = ref([])
const trazaModal = ref(false)
const selection = ref([])

const props = withDefaults(defineProps<{
  TABLE_BODY: any[],
  TABLE_HEADER: any[],
  isSelection?: "none" | "single" | "multiple" | undefined;
  itemSelected?: any[],
  icon: string,
  idTramite: any
}>(), {
  selection: "none",
  keyId: "numero",
  secondIcon: "eye",
  isSelection: "multiple",
  icon: "printer",
})

const emit = defineEmits(['update:itemSelected', 'handleRowsPerPageChange', 'handlePageChange'])

watch(selection, (newdateData) => {
  selection.value = newdateData
  emit('update:itemSelected', selection.value)
});

onMounted(() => {
  originData.value = props.TABLE_BODY
  filteredData.value = props.TABLE_BODY
})

watch(() => props.TABLE_BODY, (newValue, oldValue) => {
  originData.value = newValue;
  filteredData.value = newValue
})

watch(() => filteredData.value, (newValue) => {
  pagesNumber.value = parseInt(filteredData.value.length / pagination.value.rowsPerPage) || 1
})

const fakeAlerta = ["alerta", "falso"];


function editRow(id: number) {
  vuerouter.push(route.path + '/editar/' + id)
}

function verSubTramites(id: number) {
  vuerouter.push(route.path + '/editar/' + id)
}

function gestionDocumental(id: number) {
  vuerouter.push(route.path + '/editar/' + id)
}

async function getTrazabilidad(id) {
  // const { data } = await sgdeaAxios.get(`/correspondencia/radicacion/${id}`)
  const response = await sgdeaAxios.get('/trazabilidad/obtenerPorCodProceso/' + 'COR' + props.idTramite);
  if (!response?.data || response.data.length === 0) {
    trazabilidadData.value = [];
    trazaModal.value = true
    return;
  }

  trazabilidadData.value = response.data.sort((a, b) => a.id - b.id).map((item, index) => ({
    ...item,
    fechaHora: moment(item.fechaHora).add(1, 'day').format('DD/MM/YYYY'),
  }));
  trazaModal.value = true
}


const generalFilter = () => {
  filteredData.value = originData.value.filter(obj => {
    // Convertimos el objeto a un array de sus valores
    var valores = Object.values(obj);
    var concatArray = [];
    valores.forEach(element => {
      if (typeof element == 'object' && element != null) {
        var newArr = Object.values(element);
        concatArray = [...concatArray, ...newArr];
      }
    });
    valores = [...valores, ...concatArray];
    // Buscamos si el string de búsqueda coincide con alguno de los valores
    return valores.some(valor => {
      if (valor != null) {
        if (typeof valor == 'object') {
          for (const propiedad in valor) {
            const regexEspacioDoble = /\s\s/;
            var dataFinal = valor[propiedad].toString().toLowerCase().trim().replace(regexEspacioDoble, " ");
            return dataFinal.includes(search.value.toLowerCase());
          }
        }
        if (typeof valor == 'string') {
          const regexEspacioDoble = /\s\s/;
          var dataFinal = valor.toString().toLowerCase().trim().replace(regexEspacioDoble, " ");
          return dataFinal.includes(search.value.toLowerCase());
        }
      }
      return false;
    });
  });

}



const handleRowsPerPageChange = (event: any) => {
  emit("handleRowsPerPageChange", event);
};

const handlePageChange = (event: any) => {
  emit("handlePageChange", event);
};

watch(rowsPerPage, (value) => {
  pagination.value.rowsPerPage = value;
  pagesNumber.value = parseInt(filteredData.value.length / pagination.value.rowsPerPage) || 1
});

watch(selection, (newdateData) => {
  selection.value = newdateData;
  emit("update:itemSelected", selection.value);
})


</script>

<style lang="scss" scoped></style>
