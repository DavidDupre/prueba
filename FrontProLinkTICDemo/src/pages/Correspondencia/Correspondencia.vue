<template>
  <main class="q-py-md">
    <!-- <BreadCrumbs :crumbs="routes"></BreadCrumbs> -->
    <div class="tw-flex tw-justify-between ">
      <h1 class="tw-text-3xl tw-font-bold">Bandeja de Entrada</h1>
    </div>
    <q-card flat class="tw-mb-6">
      <q-expansion-item expand-separator default-opened class="q-bg-white q-mt-lg">
        <template v-slot:header>
          <div class="col row">
            <b class="tw-text-lg">Filtrar por</b>
          </div>
        </template>
        <div class="row q-px-md">
          <div class="col-4">
            <label class="q-px-md tw-text-label">Tipo de Trámite
              <q-select v-model="formulario.idTipoTramite" emit-value map-options outlined dense :options="opsTramites" label="Seleccione" />
            </label>
          </div>
          <div class=" col-4">
            <label class="q-px-md tw-text-label">Estado
              <q-select v-model="formulario.idEstado" emit-value map-options outlined dense :options="opsEstado" label="Seleccione" />
            </label>
          </div>
          <div class="col-4">
            <label class="q-px-md tw-text-label">Número de Radicado
              <q-select v-model="formulario.idRadicado" emit-value map-options outlined dense use-input hide-selected
                fill-input input-debounce="0" label="Inserte" :options="radicadoOptions" @filter="filterRa"
                :rules="[v => maxLengthInput(50, v), alphanumeric]" @input-value="v => addValue(v, 'idRadicado')" >
                  <template v-slot:prepend>
                      <q-icon name="search" />
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Sin resultados
                      </q-item-section>
                    </q-item>
                  </template>
              </q-select>
            </label>
          </div>
          <div class="col-4">
            <label class="q-px-md tw-text-label">Fecha de Vencimiento
              <Datepicker mask="DD/MM/YYYY" label="dd / mm / aaaa" v-model:input-data-prop="formulario.tiempoPorVencer" :requiredValitation="false" />
            </label>
          </div>
          <div class=" col-4">
            <label class="q-px-md tw-text-label">Departamento
              <q-select v-model="formulario.idDepartamento" emit-value map-options outlined dense use-input hide-selected
                fill-input label="Inserte" :options="opsDepa" @filter="filterDep"
                :rules="[v => maxLengthInput(50, v)]">
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Sin resultados
                      </q-item-section>
                    </q-item>
                  </template>
              </q-select>
            </label>
          </div>
          <div class=" col-4">
            <label class="q-px-md tw-text-label">Ciudad
              <q-select v-model="formulario.idCiudad" :disable="formulario.idDepartamento == ''" emit-value map-options outlined dense use-input hide-selected
                fill-input label="Inserte" :options="opsCiudad" @filter="filterCiu"
                :rules="[v => maxLengthInput(50, v)]">
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Sin resultados
                      </q-item-section>
                    </q-item>
                  </template>
              </q-select>
            </label>
          </div>
        </div>

        <div class="tw-flex tw-justify-center tw-items-center tw-py-5 tw-gap-6">
          <q-btn label="Limpiar Filtros" type="reset" style="width: 240px" text-color="black" color="accent"
              class="tw-rounded-xl tw-h-12" @click="toClearFilters" />

          <q-btn @click="filterService" label="Buscar" text-color="white" style="width: 240px" color="primary"
              class="tw-rounded-xl tw-h-12 tw-p-2" />
        </div>
      </q-expansion-item>
    </q-card>

    <q-card flat class="tw-p-4 tw-rounded-xl">
      <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2">Listado de Radicados</h2>
      <div class="show-table-icons">
        <Table class="q-pa-md" :TABLE_HEADER="isPublicador ? renderColumnsPublicador() : renderColumns()" :TABLE_BODY="filteredRadicadas"
          key-id="idRadicacion" @handle-edit-data="(id: any) => router.push(`/correspondencia/detalle/${id}`)" select="multiple"
          msg-no-data="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
          @update:filas="getPageFilas" @update:pages="getPageFilas" :total-pages="totalPages" :isLoading="loadingTable" />
        </div>
    </q-card>

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
import moment from "moment";
import { useQuasar } from 'quasar';
import { useMunicipalities } from "src/composables/useVersion";
import { formatDateTimeStandTwo } from "src/helpers/formtDate";
import {
  alphanumeric,
  maxLengthInput,
} from 'src/helpers/validations';
import { adminAxios, sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import Table from "./Table2.vue";

const q = useQuasar();
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
const opsEstadoVentanilla = ref()
const opsTramites = ref()
const opsCiudad = ref()
const opsDepa = ref()
const opsForCiudad = ref()
const opsForDepa = ref()
const auth = useAuthStore()
let isGestionador = ref(false);
let loadingTable = ref(false);

const getCanalType = () => {
  if (isGestionador.value) {
    return "Canal de Radicación";
  }

  return "Canal de Recepción"
};

const isPublicador = computed(() => auth.$state.userInfo.role === "Publicador")

const renderColumns = () => {
  const estadosRadicadoSalida = ["Devolucion","Publicacion rechazada", "Por Publicar", "Publicado", "Publicacion cerrada"]

  const columns = [
    {
      name: "canal",
      label: getCanalType(),
      field: (row) =>
        row.tipoTramite === "Comunicación Interna" ? "Comunicación" : "Ventanilla" ,
      sortable: true,
    },
    {
      name: "idRadicacion",
      label: "Radicado",
      field: (row) => estadosRadicadoSalida.includes(row.estado) ? row.documentos?.radicadoSalidaAprobar : row.idRadicacion || "-",
      sortable: true,
    },
    {
      name: "fechaRadicacion",
      label: "Fecha de Radicación",
      field: "fechaRadicacion",
      sortable: true,
      format: (value) => (value !== "" ? formatDateTimeStandTwo(value) : "-"),
    },
    {
      name: "tiempoAsignado",
      label: "Tiempo Asignado",
      field: (row) =>
        row?.tiempoAsignado
          ? `${row.tiempoAsignado} ${row.tipoTiemposAsignado === 'DIA' ? (row.tiempoAsignado === 1 ? 'Día' : 'Días') : (row.tiempoAsignado === 1 ? 'Hora' : 'Horas')}`
          : "-",
      sortable: true,
    },
    {
      name: "tiempoPorVencer",
      label: "Tiempo por Vencer",
      field: (row) =>
        row?.tiempoXVencer
          ? row.tiempoXVencer < 0
            ? "Vencido"
            : row.tiempoXVencer + " " + (row?.tipoTiemposAsignado === 'DIA' ? 'Días' : 'Horas')
          : "-",
      sortable: true,
    },
    {
      name: "fecha",
      label: "Fecha de Vencimiento",
      field: (row) =>
        row?.fechaVencimiento
          ? moment(row.fechaVencimiento).format("DD/MM/YYYY")
          : "-",
      sortable: true,
    },
    {
      name: "nombreAfectado",
      label: "Afectado",
      field: (row) =>
        row?.nombreAfectado && row?.documentoAfectado
          ? row?.documentoAfectado + " - " + row?.nombreAfectado
          : "-",
      sortable: true,
    },
    {
      name: "nombreRemitente",
      label: "Remitente",
      field: (row) =>
        row?.nombreRemitente && row?.documentoRemitente
          ? row?.documentoRemitente + " - " + row?.nombreRemitente
          : "-",
      sortable: true,
    },
    {
      name: "municipio",
      label: "Ciudad - Departamento",
      align: "center",
      field: (row) =>
        row.pais
          ? (row?.ciudad || row?.pais) +
            " - " +
            (row?.departamento || row?.pais)
          : "-",
      sortable: true,
    },
    {
      name: "etapaProcesal",
      label: "Tipo Trámite",
      field: (row) => row?.tipoTramite || "-",
      sortable: true,
    },
    {
      name: "trazabilidad",
      label: "Trazabilidad",
      field: "trazabilidad",
    },
    {
      name: "estado",
      label: "Estado",
      field: "estado",
      sortable: true,
    },
    {
      name: "acciones",
      label: "Acciones",
      field: "acciones",
    },
  ];

  return columns;
};

const renderColumnsPublicador = () => {
  const columns = [
    {
      name: "radicadoEntrada",
      label: "Radicado de Entrada",
      field: "radicadoEntrada",
      sortable: true,
    },
    {
      name: "radicadoSalida",
      label: "Radicado de Salida",
      field: "radicadoSalida",
      sortable: true,
    },
    {
      name: "tipoTramite",
      label: "Tipo de Trámite",
      field: "tipoTramite",
      sortable: true,
    },
    {
      name: "destinatario",
      label: "Destinatario",
      field: "destinatario",
      sortable: true,
    },
    {
      name: "fechaEnvio",
      label: "Fecha de Envío",
      field: "fechaEnvio",
      sortable: true,
    },
    {
      name: "canalEnvio",
      label: "Canal de envío",
      field: "canalEnvio",
      sortable: true,
    },
    {
      name: "estado",
      label: "Estado",
      field: "estado",
      sortable: true,
    },
    {
      name: "tiempoAsignado",
      label: "Tiempo Asignado",
      field: (row) => `${row.tiempoAsignado.unidad} ${row.tiempoAsignado.medida}`,
      sortable: true,
    },
    {
      name: "tiempoPorVencer",
      label: "Tiempo por Vencer",
      field: (row) =>
        row?.tiempoPorVencer
          ? row.tiempoPorVencer < 0
            ? "Vencido"
            : row.tiempoPorVencer + " " + (row?.tiempoAsignado.medida === 'DIAS' ? 'Días' : 'Horas')
          : "-",
      sortable: true,
    },
    {
      name: "fechaVencimiento",
      label: "Fecha de Vencimiento",
      field: (row) => row.fechaVencimiento || "-",
      sortable: true,
    },
    {
      name: "nombre",
      label: "Nombre",
      field: "nombre",
      sortable: true,
    },
    {
      name: "documento",
      label: "Documento",
      field: "documento",
      sortable: true,
    },
    {
      name: "acciones",
      label: "Acciones",
      field: "acciones",
    },
    {
      name: "trazabilidad",
      label: "Trazabilidad",
      field: "trazabilidad",
    }
  ];

  return columns;
};

function getRolForEndpoint(rol){
  if(rol.includes('Gestionador')){
    return 'GESTIONADOR'
  } else if (rol.includes('Asignador') || rol.includes('Administrador')){
    return 'ASIGNADOR'
  } else {
    return rol.toUpperCase()
  }
}

const path = ref('')
onUnmounted( ()=>{
  q.iconSet.table.arrowUp = 'arrow_upward'
})
onMounted(async () => {
  const rolUser = auth.$state.userInfo.role
  renderColumns();

  q.iconSet.table.arrowUp = 'import_export'

  const parametroApi = rolUser.toLowerCase().includes('administrador') || rolUser.toLowerCase().includes('asignador') ? 'ASIGNADOR' : rolUser.toUpperCase() || rolUser.toLowerCase().includes('gestionador_escalador') ? 'GESTIONADOR_ESCALADOR' : rolUser.toUpperCase()
  path.value = isPublicador.value ? '/correspondencia/bandejaPublicador' : `/correspondencia/bandeja/${parametroApi}`
  const { data: tramites } = await sgdeaAxios.get('/correspondencia/comunicacion/listadoTipoTramite')
  opsTramites.value = tramites.map((data) => ({
    label: data.nombre,
    value: data.id,
  })).filter(it => it.label !== 'PQRD' && it.label !== 'Correspondencia' ).sort((a, b) => a.label.localeCompare(b.label))

  await getNumRadicados()

  if ((rolUser).toLowerCase().includes('gestionador') ) {
    // @ts-ignore
    // formulario.value.idTipoTramite = 6
    isGestionador.value = true;
    renderColumns();
    await filterService();
  } else {
    await fetchData(path.value);
  }
  const { data: estados } = await sgdeaAxios.get('/estadosProceso/all')
  const { data: departamentos } = await adminAxios.get(`/departamentos/list/${425}`)

  opsEstadoVentanilla.value = estados.map((data) => ({
    label: data.estado,
    value: data.id,
  }))

  opsEstado.value = opsEstadoVentanilla.value

  filterEstadoXUser(rolUser)

  opsForDepa.value = departamentos.map((data) => ({
    label: data.nombre,
    value: data.idDepartamento,
  })).sort((a, b) => a.label.localeCompare(b.label));
});

const filterEstadoXUser = (rolUser:string) => {
  let filteredOps;
  if (rolUser == 'Asignador Responsable') {
    filteredOps = opsEstado.value.filter(it => it.label === 'Por asignar')
  } else if (rolUser.toLowerCase().includes('revisor')) {
    filteredOps = opsEstado.value.filter(it => it.label === 'Por revisar')
  } else {
    const valoresAFiltrar = [3, 5, 7, 8, 11, 18];
    filteredOps = opsEstado.value.filter(it => valoresAFiltrar.includes(it.value)).sort((a, b) => a.label.localeCompare(b.label));
  }
  opsEstado.value = filteredOps.sort((a, b) => a.label.localeCompare(b.label))
}

const filterService = async () => {
  const entries = Object.entries(formulario.value);
  const body = filterEmptyValues(entries);
  body['size'] = filasGrilla.value || 20
  body['page'] = 0
  body['usuario'] = auth.$state.userInfo.userid
  body['idOficina'] = auth.$state.userInfo.oficina

  const role = auth.$state.userInfo.role
  const isAdminOrAsignador = role.toLowerCase().includes('administrador') || role.toLowerCase().includes('asignador')
  if (body.hasOwnProperty('tiempoPorVencer') && isAdminOrAsignador) {
    filteredRadicadas.value = []
    return;
  }

  // @ts-ignore
  await fetchData(path.value, body);
}

const totalPages = ref()
const totalElements = ref()
const filasGrilla = ref()
const numPageGrilla = ref()

async function fetchData(path: string, body = { size: 20, page: 0, usuario: auth.$state.userInfo.userid, idOficina:  auth.$state.userInfo.oficina}) {
  loadingTable.value = true;
  const { data } = await sgdeaAxios.post(path, body);
  totalElements.value = data.totalElements
  totalPages.value = data.totalPages


  allRadicados.value = data.content.map((it) => ({
    ...it,
    id: it?.idRadicacion || it?.radicadoEntrada,
    idTramite: it.id
  }));

   // Filter radicados based on user role
   if (auth.$state.userInfo.role === 'Asignador Responsable') {
    filteredRadicadas.value = allRadicados.value.filter(radicado => radicado.estado === 'Por asignar');
  } else {
    filteredRadicadas.value = allRadicados.value;
  }

  loadingTable.value = false;
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
  // @ts-ignore
  formulario.value = {
    idRadicado: '',
    idTipoTramite: '',
    idEstado: '',
    tiempoPorVencer: '',
    idDepartamento: '',
    idCiudad: ''
  }

  // if (auth.$state.userInfo.role.includes('Gestionador')) {
  //   // @ts-ignore
  //   formulario.value.idTipoTramite = 6
  //   await filterService()
  // } else {
    await fetchData(path.value);
  // }
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
    await fetchData(path.value, { size: filas, page, usuario: auth.$state.userInfo.userid, idOficina:  auth.$state.userInfo.oficina });
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
    formulario.value.idCiudad = ''
    // @ts-ignore
    const { optionsMunicipalities } = await useMunicipalities(value);
    opsForCiudad.value = optionsMunicipalities.value.sort((a,b) => a.label.localeCompare(b.label))

  }
)

const addValue = (value, type) => {
  formulario.value[type] = value
}

const getNumRadicados = async(isComunicacion = false) => {
  const body = isComunicacion ? { size: totalElements.value, usuario: auth.$state.userInfo.userid, idTipoTramite: 9, idOficina:  auth.$state.userInfo.oficina } : { size: totalElements.value, usuario: auth.$state.userInfo.userid, idOficina:  auth.$state.userInfo.oficina };
  const { data } = await sgdeaAxios.post(path.value, body);

  opForRadicados.value = data.content.map((data) => ({
    label: data.idRadicacion,
    value: data.idRadicacion,
  }));
}

watch(
  () => formulario.value.idTipoTramite,
  async(value) => {
    if (value == '9') {
      const { data: estados } = await sgdeaAxios.get('/correspondencia/comunicacion/listadoEstadosComunicacion')
      opsEstado.value = estados.map((data) => ({
        label: data.nombre,
        value: data.id,
      }))
      await getNumRadicados(true)
    } else {
      await getNumRadicados()
      opsEstado.value = opsEstadoVentanilla.value
      filterEstadoXUser(auth.$state.userInfo.role)
    }
  }
)
// const tiempoAsignado = (time) => {
//   const partes = time.split(' ')
//   const typeTiempo = partes[0] == 0 || partes[0] > 1 ? 'días' : 'día'
//   return `${partes[0]} ${typeTiempo}`
// }
</script>

<style>
  label {
    padding: 0px 10px;
  }
</style>

<style  scoped lang="scss">
.show-table-icons  {
  &::v-deep {
    .q-table__sort-icon {
      opacity: 1;
    }
   th{
      text-align: center;
    }
  }
}
</style>
