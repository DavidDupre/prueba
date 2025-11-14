<template>
  <main class="q-py-md">
    <!-- <BreadCrumbs :crumbs="routes"></BreadCrumbs> -->
    <div class="tw-flex tw-justify-between ">
      <h1 class="tw-text-3xl tw-font-bold">Bandeja de Entrada</h1>
    </div>


    <div class="q-mt-xl">
      <p class="tw-text-lg text-weight-bold q-mx-lg">
        Listado de Radicados
      </p>
      <Table class="q-pa-md" :TABLE_HEADER="columns" :TABLE_BODY="filteredRadicadas" key-id="id"
        @handle-edit-data="(id: any) => router.push(`/correspondencia/detalle/${id}`)" select="multiple"
        msg-no-data="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
        @update:filas="getPageFilas" @update:pages="getPageFilas" @search-change="handleSearch" :total-pages="totalPages" />
    </div>

      <!-- este modal para la carga -->
    <q-dialog v-model="showModal">
      <q-card class="q-py-xl q-px-xl">
        <div class="q-mx-auto text-center">
          <p
            class="text-bold tw-text-xl q-mx-auto tw-border-[10px] tw-border-yellow-400 tw-rounded-full tw-w-24 q-pa-lg">
            20%
          </p>
        </div>
        <q-card-section class="text-h6 tw-max-w-sm text-center text-weight-bold">
          Consultando información
        </q-card-section>
        <p class="tw-max-w-xs text-center tw-text-lg">
          Espere un momento por favor
        </p>
      </q-card>
    </q-dialog>
  </main>
</template>

<script lang="ts" setup>
import Datepicker from "components/FormFields/datePickerComponent.vue";
import { formatDateTimeStandTwo } from "src/helpers/formtDate";
import { adminAxios, sgdeaAxios } from "src/services";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import Table from "./Table2.vue";
import {
  alphanumeric,
  maxLengthInput,
} from 'src/helpers/validations';
import { useAuthStore } from "src/stores/auth.store";
import moment from "moment";
import { useMunicipalities } from "src/composables/useVersion";

const router = useRouter();
const formulario = ref({
    idRadicado: '',
    idTipoTramite: '',
    idEstado: '',
    tiempoPorVencer: '',
    idDepartamento: '',
    idCiudad: ''
});

const showModal = ref(false);
const allRadicados = ref([]);
const filteredRadicadas = ref([])
const radicadoOptions = ref()
const opForRadicados = ref([])
const opsEstado = ref()
const opsTramites = ref()
const opsCiudad = ref()
const opsDepa = ref()
const opsForCiudad = ref()
const opsForDepa = ref()
const auth = useAuthStore()
const searchTerm = ref('');

const columns = [
  {
    name: "canal",
    label: "Canal de Radicación",
    field: row => row.canal || 'Ventanilla',
    sortable: true,
  },
  {
    name: "idRadicacion",
    label: "Número de Radicado",
    field: "idRadicado",
    align: 'center',
    sortable: true,
  },
  {
    name: "fechaRadicacion",
    label: "Fecha de Radicación",
    field: "fechaRadicacion",
    align: 'center',
    sortable: true,
    format: (value) => value != '' ? formatDateTimeStandTwo(value) : '-',
  },
  {
    name: "tiempoAsignado",
    label: "Tiempo Asignado",
    align: 'center',
    field: (row) => row?.tiempoAsignado ? tiempoAsignado(row?.tiempoAsignado) : '-' ,
    sortable: true,
  },
  {
    name: "tiempoPorVencer",
    label: "Tiempo por vencer",
    align: 'center',
    field: (row) => row?.tiempoXVencer ? (row.tiempoXVencer > 0 ? 'Vencido' : Math.abs(row?.tiempoXVencer) + (Math.abs(row?.tiempoXVencer) == 1 ? ' día' : ' días' )) : '-',
    sortable: true,
  },
  {
    name: "fecha",
    label: "Fecha de Vencimiento",
    align: 'center',
    field: row => row?.fechaVencimiento ? moment(row.fechaVencimiento).format('DD/MM/YYYY')  : '-',
    sortable: true,
  },
  {
    name: "nombreAfectado",
    label: "Documento / Nombre de Afectado",
    field: (row) => row.afectado ? row.afectado.numeroDocumento + " - " + row.afectado?.nombre : '-',
    align: 'center',
    sortable: true,
  },
  {
    name: "nombreRemitente",
    label: "Documento / Nombre de Remitente",
    field: (row) => row?.remitente.nombre || row?.remitente.numeroDocumento ? row.remitente.numeroDocumento + " - " + row.remitente.nombre : '-',
    align: 'center',
    sortable: true,
  },
  {
    name: "municipio",
    label: "Municipio / Departamento",
    align: 'center',
    field: (row) => row?.remitente?.municipio && row?.remitente?.departamento ? (row?.remitente?.municipio?.nombre || '-') + " / " + (row?.remitente?.departamento?.nombre || '-') : "-",
    sortable: true,
  },
  {
    name: "etapaProcesal",
    label: "Tipo de Trámite",
    field: row => (row?.tipoTramite || '-'),
    align: 'center',
    sortable: true,
  },
  {
    name: "trazabilidad",
    label: "Trazabilidad",
    field: "trazabilidad",
    align: 'center',
    sortable: true,
  },
  {
    name: "estado",
    label: "Estado",
    field: "estado",
    sortable: true,
    align: "center",
  },
  {
    name: "acciones",
    label: "Acciones",
    field: "acciones",
    sortable: true,
    align: "center",
  },
];

const path = ref('')

onMounted(async () => {
  path.value = `/correspondencia/listadoMesaBack`
  if(auth.$state.userInfo.role.toLowerCase().includes('admin')){
    path.value = `/correspondencia/listadoMesaBackAdministrador`
  }
  await fetchData(path.value);

  if (opsEstado.value) {
    if (auth.$state.userInfo.role == 'Asignador Responsable') {
      opsEstado.value = opsEstado.value.filter(it => it.label === 'Por asignar')
    } else {
      const valoresAFiltrar = ["Para gestión", "Por revisar", "Revisado", "Por aprobar", "Aprobada"];
      opsEstado.value = opsEstado.value.filter(it => valoresAFiltrar.includes(it.label));
    }
  }

});

const handleSearch = (term: string) => {
  searchTerm.value = term;
  getPageFilas(filasGrilla.value || 20, 0);
};

const filterService = async () => {
  const entries = Object.entries(formulario.value);
  const body = filterEmptyValues(entries);
  body['pageSize'] = filasGrilla.value || 20
  body['pageNumber'] = 0
  body['buscador'] = searchTerm.value

  await fetchData(path.value, body);
}

const totalPages = ref()
const totalElements = ref()
const filasGrilla = ref()
const numPageGrilla = ref()

async function fetchData(path: string, body = { 
  pageSize: 20, 
  pageNumber: 0, 
  idOficina: null, 
  idPuntoRadicacion: null, 
  idDependencia: null,
  buscador: ''
}): Promise<void> {
  let params = { ...body };
  
  params.buscador = searchTerm.value;
  
  if (!auth.$state.userInfo.role.toLowerCase().includes('admin')) {
    params.idOficina = auth.$state.userInfo.oficina;
    params.idPuntoRadicacion = auth.$state.userInfo.puntoRadicacion;
    params.idDependencia = auth.$state.userInfo.dependencia;
  }
  const { data } = await sgdeaAxios.get(path, { params });
  totalElements.value = data.totalElements
  totalPages.value = data.totalPages

  allRadicados.value = data.content.sort((a, b) => b.id - a.id).map((it) => ({
    ...it,
    id: it.idRadicado,
    estado: it.estadoProceso.estado,
    tipoTramite: it.tipoTramite.nombre,
    idTramite: it.id
  }))

  filteredRadicadas.value = allRadicados.value;
}

function filterEmptyValues(entries) {
  const body = {};
  entries.forEach(([key, value]) => {
    if (value) {
      body[key] = value;
    }
  });
  return body;
}

async function toClearFilters(): Promise<void> {
  formulario.value = {
    idRadicado: '',
    idTipoTramite: '',
    idEstado: '',
    tiempoPorVencer: '',
    idDepartamento: '',
    idCiudad: ''
  }
  
  searchTerm.value = '';

  await fetchData(path.value)
}

const getPageFilas = async(filas = 20, page = 0) => {
  filasGrilla.value = filas
  numPageGrilla.value = page
  const entries = Object.entries(formulario.value);
  let isEmpty = true;

  entries.forEach(([_, value]) => {
    if (value !== '') {
      isEmpty = false;
    }
  });
  
  if (isEmpty) {
    await fetchData(path.value, { 
      pageSize: filas, 
      pageNumber: page,
      buscador: searchTerm.value
    });
  } else {
    filterService()
  }
}

const routes = [
  {
      name: "Inicio",
      to: "/home",
  },
  {
      name: "Correspondencia",
  },
  {
      name: "Radicados",
  },
];

const filterRa = (val, update) => {
  if (val === '') {
    update(() => {
      radicadoOptions.value = opForRadicados.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    radicadoOptions.value = opForRadicados.value.filter(v => v.value.toLowerCase().indexOf(needle) > -1)
  })
}

const filterCiu = (val, update) => {
  if (val === '') {
    update(() => {
      opsCiudad.value = opsForCiudad.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    opsCiudad.value = opsForCiudad.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}

const filterDep = (val, update) => {
  if (val === '') {
    update(() => {
      opsDepa.value = opsForDepa.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    opsDepa.value = opsForDepa.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}

watch(
  () => formulario.value.idDepartamento,
  async(value) => {
    const { optionsMunicipalities } = await useMunicipalities(value);
    opsForCiudad.value = optionsMunicipalities.value

  }
)

const addValue = (value, type) => {
  formulario.value[type] = value
}

const getNumRadicados = async() => {
  const { data } = await sgdeaAxios.post(path.value, { size: totalElements.value, usuario: auth.$state.userInfo.userid });
  opForRadicados.value = data.content.map((data) => ({
    label: data.idRadicacion,
    value: data.idRadicacion,
  }));
}

const tiempoAsignado = (time) => {
  const partes = time.split(' ')
  const typeTiempo = partes[0] == 0 || partes[0] > 1 ? 'días' : 'día'
  return `${partes[0]} ${typeTiempo}`
}
</script>

<style>
  label {
    padding: 0px 10px;
  }
</style>