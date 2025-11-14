<template>
  <div>
    <div class='tw-mb-6'>
      <p class="pl-4 tw-font-bold tw-text-3xl tw-mt-5 tw-mb-3 text-bold">Seguimiento correo electrónico y correo
        electrónico certificado</p>
    </div>
    <q-card flat class="tw-p-4 tw-mb-6 tw-rounded-xl">
      <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2">Filtrar por</h2>
      <div class="tw-grid tw-grid-cols-3 tw-gap-4">
        <div class="tw-col-span-1">
          <div class="tw-w-full">
            <p class="tw-text-label">Fecha Desde</p>
            <Datepicker mask="DD-MM-YYYY" label="dd / mm / aaaa" :options="optionsDateFunc"
              v-model:input-data-prop="formData.vencimiento" @valida-fecha="true" future :required-valitation="false" />
          </div>
        </div>
        <div class="tw-col-span-1">
          <div class="tw-w-full">
            <p class="tw-text-label">Fecha de Hasta</p>
            <Datepicker mask="DD-MM-YYYY" label="dd / mm / aaaa" :options="optionsDateFunc"
              v-model:input-data-prop="formData.vencimiento" @valida-fecha="true" future :required-valitation="false" />
          </div>
        </div>
        <div class="tw-col-span-1">
          <p class="tw-text-label tw-font-semibold">Número de radicado de Salida</p>
          <q-input outlined v-model='formData.numero' label="Inserte" dense />
        </div>
      </div>
      <div class="tw-grid tw-grid-cols-3 tw-gap-4">
        <div class="tw-col-span-1">
          <p class="tw-text-label tw-font-semibold">Nombre destinatario</p>
          <q-input outlined v-model='formData.numero' label="Inserte" dense />
        </div>
        <div class="tw-col-span-1">
          <p class="tw-text-label tw-font-semibold">Correo destinatario</p>
          <q-input outlined v-model='formData.numero' label="Inserte" dense />
        </div>
        <div class="tw-col-span-1">
          <p class="tw-text-label tw-font-semibold">Tipo de Envio</p>
          <q-input outlined v-model='formData.numero' label="Inserte" dense />
        </div>
      </div>
      <br />
      <div class="row tw-flex tw-justify-center tw-gap-6 [&>*]:tw-p-2">
        <q-btn label="Limpiar filtros" color="accent" textColor="black" class="tw-rounded-lg col-2"
          @click="resetForm" />
        <q-btn label="Buscar" color="primary" class="tw-rounded-lg col-2" @click="search" />
      </div>
    </q-card>
    <q-card flat class="tw-p-4 tw-rounded-xl">
      <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2">Resultados de la búsqueda</h2>
      <div :key="key" class="my-custom-table">
        <Table class="q-pa-md" :TABLE_HEADER="DEVOLUCIONES_HEADER" :TABLE_BODY="data" key-id="idRadicado"
          select="multiple" @handle-edit-data="(id: any) => router.push(`/Correspondencia/Devoluciones/${id}`)"
          msg-no-data="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente" />
      </div>
    </q-card>
  </div>
  <q-dialog persistent full-width v-model="asignarMasivo">
    <q-card class="q-pa-xl tw-w-[3000px]">

    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import Datepicker from 'components/FormFields/datePickerComponent.vue';
import moment from 'moment';
import { useQuasar } from 'quasar';
import { SelectInput } from 'src/interfaces';
import { sgdeaAxios } from 'src/services';
import { useAuthStore } from 'src/stores/auth.store';
import { Ref, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from "vue-router";
import TableDevoluciones from './TableDevoluciones.vue';
import Table from './Table.vue';
import { toast } from 'src/helpers/toast';

interface PQRD {
  estado: string;
  numero: string;
  tipoTramite: string;
  ciudad: string;
  pageNo: number;
  pageSize: number;
  vencimiento: string
}

const data = [
  {
    canalRadicacion: "Canal 1",
    radicadoSalida: "RS123",
    destinatario: "Destinatario 1",
    fechaEnvio: "2024-05-31",
    tipoEnvio: "Tipo 1",
    estado: "Estado 1",
    correoElectronico: "correo@ejemplo.com",
    tiempoAsignado: "30 días",
    tiempoPorVencer: "10 días",
    fechaVencimiento: "2024-06-30",
    nombre: "Nombre 1",
    documento: "Doc123",
    trazabilidad: "Trazabilidad 1",
  },
]

const auth = useAuthStore()

let loadingTable = ref(false);
const router = useRouter();
const key = ref(0);
const asignarMasivo = ref(false)
const tableData = ref([]);
const selection = ref([]);
const selectedRows = ref()
const dataTable = ref([]);
const dataTableTotalRows = ref(0);
const tableKey = ref(0)
let pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0
});

const optionsEstados = ref<SelectInput[]>([]);
const optionsTipoTramite = ref<SelectInput[]>([]);
const optionsCiudades = ref<SelectInput[]>();
const formData: Ref<PQRD> = ref({
  estado: '',
  numero: '',
  tipoTramite: '',
  ciudad: '',
  pageNo: 0,
  pageSize: 20,
  rowsPerPage: 20,
  vencimiento: ''
});
onUnmounted(() => {
  q.iconSet.table.arrowUp = 'arrow_upward'
})
onMounted(async () => {
  q.iconSet.table.arrowUp = 'import_export'
  getEstados();
  getCiudades();
  getTiposSolicitud();
  getData();
});

const selectRows = (data) => {
  selectedRows.value = data
}

async function getEstados() {
  const { data } = await sgdeaAxios.get('/estadosProceso/all')
  optionsEstados.value = data.sort((a, b) => a.estado.localeCompare(b.estado)).map((estado: any) => ({
    label: estado.estado,
    value: estado.id
  }));
  optionsEstados.value = auth.$state.userInfo.role == "Defensor del Consumidor"
    ? optionsEstados.value.filter((e) => { return e.value == 5 || e.value == 11 })
    : optionsEstados.value
}

async function getTiposSolicitud() {
  const { data } = await sgdeaAxios.get('/pqrd/listadoTiposSolicitud')
  optionsTipoTramite.value = data.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((tipo: any) => ({
    label: tipo.nombre,
    value: tipo.id
  }));
}

async function getCiudades() {
  const { data } = await sgdeaAxios.get('pqrd/listadoMunicipios?departamentoID=0');
  optionsCiudades.value = data.sort((a, b) => a.nombre.localeCompare(b.nombre)).map(({ nombre, idMunicipio }) => {
    return {
      label: nombre,
      value: idMunicipio
    };
  });
}

const getData = async () => {

}

const handleCaso = ({ id, idAsignacion }) => {
  let url = `/pqrd/informacion/${id}`
  if (idAsignacion) {
    url = url + `?idAsignacion=${idAsignacion}`
  }
  router.push(url)
}

const resetForm = () => {
  formData.value = {
    estado: '',
    numero: '',
    tipoTramite: '',
    ciudad: '',
    pageNo: 1,
    pageSize: 20,
    vencimiento: ''
  }
  pagination.value = {
    sortBy: "desc",
    descending: false,
    page: 1,
    rowsPerPage: 20,
    rowsNumber: 0
  };
  getData();
};

const q = useQuasar();

const search = async () => {
  const filter = {
    estado: formData.value?.estado,
    numero: formData.value?.numero,
    fechaVencimiento: formData.value?.vencimiento,
    ciudad: formData.value?.ciudad,
  };

  if (Object.values(filter).every(val => !val)) {
    toast.error('Por favor, seleccione al menos un filtro.');
    return;
  }

  await getData();
}

const handlePageChange = async (page: number) => {
  formData.value.pageNo = page <= 0 ? 0 : page - 1;
  await getData();
}

const handleRowsPerPageChange = async (rowsPerPage: any) => {
  formData.value.pageSize = rowsPerPage;
  await getData();
}

function optionsDateFunc(date) {
  return true
}

const validate = ref({
  fecha: false,
  hora: false,
});

const emitValidation = ({ type, data }) => {
  validate.value[type] = data
}

const DEVOLUCIONES_HEADER = [
  {
    name: "canalRadicacion",
    label: "Canal de radicación",
    field: "canalRadicacion",
    sortable: true,
    align: 'center'
  },
  {
    name: "radicadoSalida",
    label: "Radicado de salida",
    field: "radicadoSalida",
    sortable: true,
    align: 'center'
  },
  {
    name: "destinatario",
    label: "Destinatario",
    field: "destinatario",
    sortable: true,
    align: 'center'
  },
  {
    name: "fechaEnvio",
    label: "Fecha de envío",
    field: "fechaEnvio",
    sortable: true,
    align: 'center'
  },
  {
    name: "tipoEnvio",
    label: "Tipo de envío",
    field: "tipoEnvio",
    sortable: true,
    align: 'center'
  },
  {
    name: "estado",
    label: "Estado",
    field: "estado",
    sortable: true,
    align: 'center'
  },
  {
    name: "correoElectronico",
    label: "Correo electrónico",
    field: "correoElectronico",
    sortable: true,
    align: 'center'
  },
  {
    name: "tiempoAsignado",
    label: "Tiempo asignado",
    field: "tiempoAsignado",
    sortable: true,
    align: 'center'
  },
  {
    name: "tiempoPorVencer",
    label: "Tiempo por vencer",
    field: "tiempoPorVencer",
    sortable: true,
    align: 'center'
  },
  {
    name: "fechaVencimiento",
    label: "Fecha de vencimiento",
    field: "fechaVencimiento",
    sortable: true,
    align: 'center'
  },
  {
    name: "nombre",
    label: "Nombre",
    field: "nombre",
    sortable: true,
    align: 'center'
  },
  {
    name: "documento",
    label: "Documento",
    field: "documento",
    sortable: true,
    align: 'center'
  },
  {
    name: "trazabilidad",
    label: "Trazabilidad",
    field: "trazabilidad",
    sortable: true,
    align: 'center'
  },
  {
    name: "acciones",
    label: "Acciones",
    field: "actions",
    sortable: false,
    align: "center",
  },
];


</script>

<style scoped lang="scss">
.my-custom-table {
  &::v-deep {
    .q-table__sort-icon {
      opacity: 1;
    }

    th {
      text-align: center;
    }
  }
}
</style>