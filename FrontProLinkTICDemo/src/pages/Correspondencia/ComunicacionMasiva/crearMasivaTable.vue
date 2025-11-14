<template>
  <div>

    <div class="tw-flex tw-items-center tw-justify-between">
        <h1 class="tw-text-xl tw-font-bold tw-ml-10">Listado de Comunicaciones Masivas</h1>
        <q-input outlined dense rounded v-model="search" label="Buscador" class="tw-w-[300px]"
          @update:model-value="generalFilter">
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <q-table flat :rows="filteredData" :columns="TABLE_HEADER" :row-key="'id'" table-header-class="text-black text-h6"
      class="q-mr-md full-width tw-bg-transparent table" rows-per-page-label="Páginas" hide-pagination
      v-model:pagination="pagination" v-model:selected="selection" :selection="isSelection" >
      >
      <template v-slot:body-cell-subTramite="props">
        <q-td>
          <div style="position: relative; left: 15px">
            <q-btn
              class="tw-w-auto tw-h-9 flex tw-bg-[#f2f4f5]"
              @click="verSubTramites(props.row.id)"
            >
              <span>Ver Sub Trámites</span>
            </q-btn>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-gestionDoc="props">
        <q-td>
          <div style="position: relative; left: 20px">
            <q-btn
              class="tw-w-auto tw-h-9 flex tw-bg-[#f2f4f5]"
              @click="gestionDocumental(props.row.id)"
            >
              <span>Gestión Documental</span>
            </q-btn>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-trazabilidad="props">
        <q-td>
          <q-btn
            flat
            color="primary"
            @click="getTrazabilidad(props.row.id)"
            icon="history"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-estado="props">
        <q-td class="text-center">
          <div
            :class="[
              'tw-inline-block tw-p-1.5 tw-px-4 tw-rounded-lg tw-border tw-w-40',
              !props.row?.tiempoXVencer ||
              props.row?.tiempoXVencer !== 'Vencido'
                ? ESTADOS[props.row.estado]
                : 'tw-bg-red-100 tw-border-red-400 tw-text-red-500',
          ]">
            {{ props.row?.estado || "-" }}
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-nombreComunicacion="props">
        <q-td class="text-center">
          <div class="whitespace-normal">
        <span v-if="props.row?.nombreComunicacion.length > 50">
          {{ props.row?.nombreComunicacion.slice(0, 50) }}<br />
          {{ props.row?.nombreComunicacion.slice(50) }}
        </span>
        <span v-else>
          {{ props.row?.nombreComunicacion }}
        </span>
          </div>
        </q-td>
      </template>
    </q-table>

    <div class="row justify-between q-mt-md" v-if="TABLE_BODY?.length > 0">
      <div class="tw-flex tw-gap-x-3 tw-items-center">
        <span>Filas</span>
        <q-select :options="[5, 25, 50, 100]" v-model:model-value="rowsPerPage" dense outlined
          @update:model-value="handleRowsPerPageChange" />
      </div>
      <q-pagination v-model="page" color="primary" :max="total" size="md" direction-links
        boundary-links boundary-numbers @update:model-value="handlePageChange" />
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
      <Trazabilidad
      :doneItems="trazabilidadData"
    />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { sgdeaAxios } from "src/services";
import moment from "moment";
import Trazabilidad from "src/pages/Expedientes/Trazabilidad/Trazabilidad.vue";
import {ESTADOS} from "assets/estados/estados";

const vuerouter = useRouter();
const route = useRoute();

const q = useQuasar();
const trazabilidadData = ref();
const trazaModal = ref(false);
const selection = ref([]);

const rowsPerPage = ref(20)
const pagesNumber = ref(1)
const filteredData = ref([])
const originData = ref([])
const page = ref(1)

const search = ref('')

let paginationTut = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
})

const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 20,
})

const trazabilidadColumns = ref([
  {
    name: "user",
    label: "Usuario",
    field: "nombre",
    align: "center",
    sortable: true
  },
  {
    name: "action",
    label: "Acción",
    field: "accion",
    align: "center",
    sortable: true
  },
  {
    name: "date",
    label: "Fecha",
    field: "fechaHora",
    align: "center",
    sortable: true
  }, {
    name: "status",
    label: "Estado",
    field: "estado",
    align: "center",
    sortable: true
  },
  {
    name: "description",
    label: "Detalle",
    field: "descripcion",
    align: "center",
    sortable: true
  },
])

const props = withDefaults(
  defineProps<{
    TABLE_BODY: any[];
    TABLE_HEADER: any[];
    isSelection?: "none" | "single" | "multiple" | undefined;
    itemSelected?: any[];
    icon: string;
    keyId?: string;
    total: number;
    module?: string;
  }>(),
  {
    isSelection: "multiple",
    keyId: "id",
    total: 1,
  }
);

onMounted(() => {
  pagesNumber.value = props.total
  originData.value = props.TABLE_BODY
  filteredData.value = props.TABLE_BODY

})
watch(() => props.TABLE_BODY, (newValue) => {

    originData.value = newValue;
  filteredData.value = newValue
});


watch(selection, (newdateData) => {
  selection.value = newdateData;
  emit("update:itemSelected", selection.value);
});

const fakeAlerta = ["alerta", "falso"];

const emit = defineEmits(['update:itemSelected', 'handleRowsPerPageChange', 'handlePageChange'])

function editRow(id: number) {
  vuerouter.push(route.path + "/editar/" + id);
}

function verSubTramites(id: number) {
  vuerouter.push("/correspondencia/crear-comunicaciones-masiva/subTramite/" + id);
}

function gestionDocumental(id: number) {
  vuerouter.push("/correspondencia/crear-comunicaciones-masiva/editar/" + id);
}

async function getTrazabilidad(id) {
  const response = await sgdeaAxios.get(
    "/trazabilidad/obtenerPorCodProceso/CORMAS"+ id
  );

  if (!response?.data || response.data.length === 0) {
    trazabilidadData.value = [];
    trazaModal.value = true;
    return;
  }

  switch (props.module) {
    case "crearMasiva":
      trazabilidadData.value = response.data
        .sort((a, b) => a.id - b.id)
        .map((item, index) => ({
          ...item,
          canal: "Comunicación",
          accion: getHumanizeAction(item, id),
          tramite: "Comunicación Masiva",
          fechaHora: moment(item.fechaHora).format("DD/MM/YYYY"),
        }));
      break;
    default:
      trazabilidadData.value = response.data
        .sort((a, b) => a.id - b.id)
        .map((item, index) => ({
          ...item,
          fechaHora: moment(item.fechaHora).format("DD/MM/YYYY"),
        }));
      break;
  }

  trazaModal.value = true;
}
const getHumanizeAction = (item, id) => {
  const { accion, secuencia } = item;
  const accionModificada = secuencia
    ? accion.replace(secuencia, id.toString())
    : accion;
  return accionModificada;
};

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
  pagination.value.rowsPerPage = event
  if (pagination.value.page > 0) {
    pagination.value.page = pagination.value.page - 1
  }
  emit("handleRowsPerPageChange", pagination.value);
};

const handlePageChange = (event: any) => {
  // if (pagination.value.page > 0) {
  //   pagination.value.page = pagination.value.page - 1
  // }
  emit("handlePageChange", {page: page.value, rowsPerPage: pagination.value.rowsPerPage});
};

watch(rowsPerPage, (value) => {
  pagination.value.rowsPerPage = value;
});

watch(selection, (newdateData) => {
  selection.value = newdateData;
  emit("update:itemSelected", selection.value);
})
</script>
