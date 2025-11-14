<template>
  <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat>
    <div class="flex items-center justify-between q-px-md row col-12">
      <span class="text-weight-bold text-h6" style="color: #2c3948">Listado de Radicados Correspondencia</span>
    </div>
    <div class="show-table-icons">
      <Table class="q-pa-md" :TABLE_HEADER="isPublicador ? renderColumnsPublicador() : renderColumns()"
        :TABLE_BODY="filteredRadicadas" key-id="idRadicacion"
        :pagination-message="customMessageTableResults"
        @handle-edit-data="(id: any) => router.push(`/correspondencia/detalle/${id}`)" @search-change="handleSearch" select="multiple"
        msg-no-data="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
        @update:filas="getPageFilas" @update:pages="getPageFilas" :total-pages="totalPages" :isLoading="loadingTable" />
    </div>
  </q-card>

  <!-- este modal para la carga -->

</template>

<script lang="ts" setup>
import moment from "moment";
import { useQuasar } from 'quasar';
import { useMunicipalities } from "src/composables/useVersion";
import { formatDateWithTimeAndMeridiem } from "src/helpers/formtDate";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import Table from "src/pages/Correspondencia/Table2.vue";

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
const selectFilterState = ref();

const emit = defineEmits(['pageChange', 'rowsChange'])

const showModal = ref(false);
const allRadicados = ref([]);
const filteredRadicadas = ref([])
const opForRadicados = ref([])
const opsEstado = ref()
const opsEstadoVentanilla = ref()
const opsTramites = ref()
const opsForCiudad = ref()
const customMessageTableResults = ref("")
//const opsForDepa = ref()
const auth = useAuthStore()
let isGestionador = ref(false);
let loadingTable = ref(false);
const searchTerm = ref("");

const getCanalType = () => {
  if (isGestionador.value) {
    return "Canal de Radicación";
  }

  return "Canal de Recepción"
};


const isPublicador = computed(() => auth.$state.userInfo.role === "Publicador")

const renderColumns = () => {
  const estadosRadicadoSalida = ["Devolucion", "Publicacion rechazada", "Por Publicar", "Publicado", "Publicacion cerrada"]

  if (selectFilterState.value !== "Devolucion") {

    if (isGestionador.value || auth.$state.userInfo.role === "Revisor") {
      const columns = [
      {
        name: "canal",
        label: getCanalType(),
        field: (row) =>
          row.tipoTramite === "Comunicación Interna" ? "Comunicación" : "Ventanilla",
        sortable: true,
        align: "center",
      },
      {
        name: "idRadicacion",
        label: "Radicado",
        field: (row) => estadosRadicadoSalida.includes(row.estado) ? row.documentos?.radicadoSalidaAprobar : row.idRadicacion || "-",
        sortable: true,
        align: "center",
      },
      {
        name: "fechaRadicacion",
        label: "Fecha de Radicación",
        field: "fechaRadicacion",
        sortable: true,
        format: (value) => (value !== "" ? formatDateWithTimeAndMeridiem(value) : "-"),
        align: "center",
      },
      {
        name: "tiempoAsignado",
        label: "Tiempo Asignado",
        field: () => "-",
        sortable: true,
        align: "center",
      },
      {
        name: "tiempoPorVencer",
        label: "Tiempo por Vencer",
        field: () => "-",
        sortable: true,
        align: "center",
      },
      {
        name: "fecha",
        label: "Fecha de Vencimiento",
        field: () => "-",
        sortable: true,
        align: "center",
      },
      {
        name: "nombreAfectado",
        label: "Afectado",
        field: (row) =>
          row?.nombreAfectado && row?.documentoAfectado
            ? row?.nombreAfectado + " - " +  row?.documentoAfectado 
            : "-",
        sortable: true,
        align: "center",
      },
      {
        name: "nombreRemitente",
        label: "Remitente",
        field: (row) =>
          row?.nombreRemitente && row?.documentoRemitente
            ? row?.nombreRemitente + " - " + row?.documentoRemitente
            : "-",
        sortable: true,
        align: "center",
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
        align: "center",
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
    }

    const columns = [
      {
        name: "canal",
        label: getCanalType(),
        field: (row) =>
          row.tipoTramite === "Comunicación Interna" ? "Comunicación" : "Ventanilla",
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
        format: (value) => (value !== "" ? formatDateWithTimeAndMeridiem(value) : "-"),
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

  } else{
    const columns = [
      {
        name: "canalEnvio",
        label: "Canal de envio",
        field: "canalEnvio",
        sortable: true,
      },
      {
        name: "canalRadicacion",
        label: getCanalType(),
        field: (row) =>
          row.tipoTramite === "Comunicación Interna" ? "Comunicación" : "Ventanilla",
        sortable: true,
      },
      {
        name: "correoElectronicoOrigen",
        label: "Correo electrónico origen",
        field: "correoElectronicoOrigen",
        sortable: true,
      },
      {
        name: "radicadoSalidaAprobar",
        label: "Radicado de salida",
        field: (row) => row.documentos?.radicadoSalidaAprobar ? row.documentos?.radicadoSalidaAprobar : "-",
        sortable: true,
      },
      {
        name: "destinatario",
        label: "Destinatario",
        field: (row) => row.documentos?.radicacion?.datosSalida?.nombreDestinatario,
        sortable: true,
      },
      {
        name: "fechaEnvio",
        label: "Fecha de envío",
        field: "fechaRadicacion",
        sortable: true,
        format: (value) => (value !== "" ? formatDateWithTimeAndMeridiem(value) : "-"),
      },
      {
        name: "fechaRadicacion",
        label: "Fecha de Radicación",
        field: "fechaRadicacion",
        sortable: true,
        format: (value) => (value !== "" ? formatDateWithTimeAndMeridiem(value) : "-"),
      },
      {
        name: "tipoEnvio",
        label: "Tipo de envío",
        field: (row) => row.documentos?.radicacion?.datosSalida?.formaEnvio?.nombre,
        sortable: true,
      },
      {
        name: "tipoTramite",
        label: "Tipo de tramite",
        field: "tipoTramite",
        sortable: true,
      },
      {
        name: "motivoDevolucion",
        label: "Motivo de devolución",
        field: (row) => row?.motivoDevolucion ?? "-",
        sortable: true,
      },
      {
        name: "correoElectronico",
        label: "Correo electrónico",
        field: (row) => row.documentos?.radicacion?.datosSalida?.correoDestinatario,
        sortable: true,
      },
      {
        name: "tiempoAsignado",
        label: "Tiempo Asignado",
        field: (row) => {
          if (row.fechaRadicacion && row.fechaVencimiento) {
            const diffDays = getDiffDaysFromDate(row.fechaRadicacion, row.fechaVencimiento);
            return `${diffDays} ${diffDays === 1 ? "Día": "Días"}`;
          }
          return "-";
        },
        sortable: true,
      },
      {
        name: "tiempoXVencer",
        label: "Tiempo por Vencer",
        field: (row) =>
          row?.tiempoXVencer !== null && row?.tiempoXVencer !== undefined
            ? row.tiempoXVencer <= 0
              ? "Vencido"
              : `${row.tiempoXVencer} ${row?.tipoTiemposAsignado.toUpperCase() === "DIAS"
                  ? (row.tiempoXVencer === 1 ? 'Día' : 'Días')
                  : (row.tiempoXVencer === 1 ? 'Hora' : 'Horas')}`
            : "-",
        sortable: true,
      },
      {
        name: "fechaVencimiento",
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
            : "No reporta",
        sortable: true,
      },
      {
        name: "nombreRemitente",
        label: "Remitente",
        field: (row) =>
          row?.nombreRemitente && row?.documentoRemitente
            ? row?.documentoRemitente + " - " + row?.nombreRemitente
            : "No reporta",
        sortable: true,
      },
      {
        name: "ciudadDepartamento",
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
  }


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
      name: "trazabilidad",
      label: "Trazabilidad",
      field: "trazabilidad",
    },
    {
      name: "acciones",
      label: "Acciones",
      field: "acciones",
    },
  ];

  return columns;
};

const getDiffDaysFromDate = (date1: string, date2: string) => {
  const creationDate = new Date(date1);
  const expirationDate = new Date(date2);
  const difference = Math.abs(creationDate.getTime() - expirationDate.getTime());
  return Math.floor(difference / (24 * 60 * 60 * 1000));
}


const path = ref('')
const getParametroApi = (rolUser: string): string => {
  const role = rolUser.toLowerCase();
  if (role.includes('administrador') || role.includes('asignador')) {
    return 'ASIGNADOR';
  } else if (role.includes('gestionador_escalador')) {
    return 'GESTIONADOR_ESCALADOR';
  } else if (role.includes('aprobador')) {
    return 'APROBADOR';
  } else if (role.includes('gestionador')) {
    return 'GESTIONADOR';
  } else {
    return rolUser.toUpperCase();
  }
};

onUnmounted(() => {
  q.iconSet.table.arrowUp = 'arrow_upward'
})

onMounted(async () => {
  const rolUser = auth.$state.userInfo.role
  renderColumns();

  q.iconSet.table.arrowUp = 'import_export'

  const parametroApi = getParametroApi(rolUser)
  path.value = isPublicador.value ? '/correspondencia/bandejaPublicador' : `/correspondencia/bandeja/${parametroApi}`
  const { data: tramites } = await sgdeaAxios.get('/correspondencia/comunicacion/listadoTipoTramite')
  opsTramites.value = tramites.map((data) => ({
    label: data.nombre,
    value: data.id,
  })).filter(it => it.label !== 'PQRD' && it.label !== 'Correspondencia').sort((a, b) => a.label.localeCompare(b.label))

  await getNumRadicados()

  if ((rolUser).toLowerCase().includes('gestionador')) {
    // @ts-ignore
    // formulario.value.idTipoTramite = 6
    isGestionador.value = true;
    renderColumns();
    await filterService();
  } else {
    await fetchData(path.value);
  }
  const { data: estados } = await sgdeaAxios.get('/estadosProceso/all')
  //const { data: departamentos } = await adminAxios.get(`/departamentos/list/${425}`)

  opsEstadoVentanilla.value = estados.map((data) => ({
    label: data.estado,
    value: data.id,
  }))

  opsEstado.value = opsEstadoVentanilla.value

  filterEstadoXUser(rolUser)

  // opsForDepa.value = departamentos.map((data) => ({
  //   label: data.nombre,
  //   value: data.idDepartamento,
  // })).sort((a, b) => a.label.localeCompare(b.label));
});

const filterEstadoXUser = (rolUser: string) => {
  if (rolUser == 'Asignador Responsable') {
    opsEstado.value = opsEstado.value.filter(it => it.label === 'Por asignar')
  } else if (rolUser.toLowerCase().includes('revisor')) {
    opsEstado.value = opsEstado.value.filter(it => it.label === 'Por revisar')
  } else {
    const valoresAFiltrar = ["Para gestión", "Por revisar", "Revisado", "Por aprobar", "Aprobado"];
    opsEstado.value = opsEstado.value.filter(it => valoresAFiltrar.includes(it.label));
  }
}

const filterService = async () => {
  const entries = Object.entries(formulario.value);
  const body = filterEmptyValues(entries);
  body['size'] = filasGrilla.value || 20;
  body['page'] = 0;
  body['usuario'] = auth.$state.userInfo.userid;
  body['idOficina'] = auth.$state.userInfo.oficina;
  body['puntoRadicacion'] = auth.$state.userInfo.puntoRadicacion;
  body['dependencia'] = auth.$state.userInfo.dependencia;
  body['idRadicado'] = searchTerm.value;

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

async function fetchData(path: string, body = { size: 20, page: 0, usuario: auth.$state.userInfo.userid, idOficina: auth.$state.userInfo.oficina,  puntoRadicacion: auth.$state.userInfo.puntoRadicacion, dependencia: auth.$state.userInfo.dependencia }) {
  loadingTable.value = true;

  let data;

  if (auth.$state.userInfo.role.toLowerCase() == "publicador") {
    const response = await sgdeaAxios.post(path, { size: 20, page: 0, usuario: auth.$state.userInfo.userid });
    data = response.data;
  } else {
    const response = await sgdeaAxios.post(path, body);
    data = response.data;
  }

  totalElements.value = data.totalElements;
  totalPages.value = data.totalPages;
  customMessageTableResults.value = data.paginationMessage

  allRadicados.value = data.content.map((it) => ({
    ...it,
    id: it?.idRadicacion || it?.radicadoEntrada,
    idTramite: it.id,
  }));

  // Filtrar radicados según el rol del usuario
  if (auth.$state.userInfo.role === 'Asignador Responsable') {
    filteredRadicadas.value = allRadicados.value.map(radicado => {
      if (radicado.estado === 'Para gestión') {
        radicado.estado = 'Devolucion';
      }
      return radicado;
    }).filter(radicado => radicado.estado === 'Por asignar' || radicado.estado === 'Devolucion' || radicado.estado === 'Devolucion Pendiente' || radicado.estado === 'Para gestión');
  } else {
    filteredRadicadas.value = allRadicados.value;
  }

  loadingTable.value = false;
  return { data: filteredRadicadas.value, total: filteredRadicadas.value.length || 0 };
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

const getPageFilas = async (filas = 20, page = 0) => {
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
    await fetchData(path.value,  { size: filas, page: page, usuario: auth.$state.userInfo.userid, idOficina: auth.$state.userInfo.oficina,  puntoRadicacion: auth.$state.userInfo.puntoRadicacion, dependencia: auth.$state.userInfo.dependencia });
  } else {
    filterService()
  }
  emit('pageChange', filteredRadicadas.value)
  emit('rowsChange', filteredRadicadas.value)
}

const handlePageChange = async (page: number) => {
  getPageFilas(filasGrilla.value, page)
}

watch(
  () => formulario.value.idDepartamento,
  async (value) => {
    formulario.value.idCiudad = ''
    // @ts-ignore
    const { optionsMunicipalities } = await useMunicipalities(value);
    opsForCiudad.value = optionsMunicipalities.value.sort((a, b) => a.label.localeCompare(b.label))
  }
)

const getNumRadicados = async (isComunicacion = false) => {
  const body = isComunicacion ? { size: totalElements.value, usuario: auth.$state.userInfo.userid, idTipoTramite: 9, idOficina: auth.$state.userInfo.oficina } : { size: totalElements.value, usuario: auth.$state.userInfo.userid, idOficina: auth.$state.userInfo.oficina };
  const { data } = await sgdeaAxios.post(path.value, body);

  opForRadicados.value = data.content.map((data) => ({
    label: data.idRadicacion,
    value: data.idRadicacion,
  }));
}

watch(
  () => formulario.value.idTipoTramite,
  async (value) => {
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

defineExpose({
  fetchData,
  filterByState
})

function filterByState(estado?) {
  if (!estado) {
    filteredRadicadas.value = allRadicados.value
  } else {
    filteredRadicadas.value = allRadicados.value.filter((item) => item.estado == estado)
  }
  selectFilterState.value = estado;
}

const handleSearch = (term: string) => {
    searchTerm.value = term;
    numPageGrilla.value = 0;
    filterService();
};

</script>

<style>
label {
  padding: 0px 10px;
}
</style>

<style scoped lang="scss">
.show-table-icons {
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
