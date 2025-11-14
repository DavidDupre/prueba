<template>
  <q-card class="tw-rounded-xl q-mt-lg tw-p-5 my-custom-table" flat>
    <div class="row tw-flex justify-between tw-w-full tw-pr-8">
      <div class="flex items-center justify-between q-px-md row col-12">
        <span class="text-weight-bold text-h6" style="color: #2c3948">Listado de Radicados ML</span>
      </div>
      <div class="tw-flex tw-gap-2 tw-pb-1"
        v-if="auth.userInfo.role === 'Revisor' && selectedCaso && selectedCaso?.length > 1">
        <q-btn label="Rechazar" outline color="black" @click="showModalRechazarRevision = true"
          class="tw-w-24 tw-h-8" />
        <q-btn label="Aprobar" color="primary" @click="aprobarMasivaRevision(selectedCaso)"
          class="!tw-px-8 tw-w-22 tw-h-8" />
      </div>

      <div class="tw-flex tw-gap-2 tw-pb-1"
        v-if="auth.userInfo.role === 'Aprobador' && selectedCaso && selectedCaso?.length > 1">
        <q-btn label="Rechazar" outline color="black" @click="showModalRechazarRevision = true"
          class="tw-w-22 tw-h-8" />
        <q-btn label="Aprobar" color="primary" @click="aprobarMasivaAprobacion(selectedCaso)"
          class="!tw-px-8 tw-w-22 tw-h-8" />
      </div>
    </div>
    <Table   :TABLE_HEADER="
    auth.userInfo.role === 'Publicador' ? Casos_HEADER_PUBLICADOR :
    filterSearch.estado === 'Devolucion' ? DEVOLUTION_HEADER :
    Casos_HEADER
  "
      :TABLE_BODY="dataTableFilteredRows" selection="multiple" key-id="numero"
      v-model:item-selected="selected"
      @handleEditData="({ numero }) => $router.push(`/medicina/casos/detalle/${numero}`)"
      :TABLE_TOTAL_ROWS="dataTableTotalRows" :user-id="auth.userInfo.userid" :role="auth.userInfo.role"
      @handlePageChange="handlePageChange" @handleRowsPerPageChange="handleRowsPerPageChange" :isLoading="loadingTable"
      @update:item-selected="selectionCaso" @search-change="handleSearch" />
  </q-card>

  <RechazarModalMedicina @hide-modal="hideModal" :show-modal="showModalRechazarRevision" @update-modal="updateModal" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Table from "src/pages/MedicinaLaboral/Bandeja/Table.vue";
import { Casos_HEADER, ISearchCasosData, Casos_HEADER_PUBLICADOR } from "src/pages/MedicinaLaboral/Bandeja/index"
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import moment from "moment";
import RechazarModalMedicina from "src/pages/MedicinaLaboral/RechazarModal.vue"
import { toast } from "src/helpers/toast";
import {TableHeader} from "src/interfaces/TableHeaders";
import {formatDateWithTimeAndMeridiemWithInputFormat} from "src/helpers/formtDate";

const router = useRouter();

const DEFAULT_FILTER_SEARCH: ISearchCasosData = {
  numeroRadicado: { label: '', value: '' },
  siniestro: "",
  estado: "",
  fechaRadicacion: "",
  fechaVencimiento: "",
  size: 20,
  page: 0
};

const form = ref({
  motivoRechazo: '',
});

let loadingTable = ref(false);
const auth = useAuthStore();
const filterSearch = ref<ISearchCasosData>(DEFAULT_FILTER_SEARCH);
const dataTable = ref([]);
const selected = ref([]);
const dataTableFilteredRows = ref([])
const selectedCaso = ref([]);
const listadoRadicados = ref([])
const showModalRechazarRevision = ref(false)
const showModalAprobarRevision = ref(false)
const data = ref()
const aprobado = ref(false)
const isActive = ref(false)
const documentosSalidaInstances = ref([]);
const radicaciones = ref()
const newArray = ref([])
const stateOptions = ref([])
const dataTableTotalRows = ref(0);
const emit = defineEmits(['pageChange', 'rowsChange'])
const DEVOLUTION_HEADER: TableHeader[] = ref([]);

// Agregar la variable para el término de búsqueda
const searchTerm = ref('');

onMounted(() => {
  sendFilters(0, 20);
  DEVOLUTION_HEADER.value = [
    {
      name: "canalRadicacion",
      label: auth.userInfo.role.includes("Gestionador") ? "Canal de Radicación" : "Canal de Recepción",
      field: "canalRadicacion",
      sortable: true,
    },
    {
      name: "correoElectronicoOrigen",
      label: "Correo electrónico origen",
      field: "correoRemitente",
      sortable: true,
    },
    {
      name: "radicadoSalidaAprobar",
      label: "Radicado de salida",
      field: "numeroRadicadoSalida",
      sortable: true,
    },
    {
      name: "destinatario",
      label: "Destinatario",
      field: "nombreDestinatario",
      sortable: true,
    },
    {
      name: "fechaEnvio",
      label: "Fecha de envío",
      field: "fechaEnvioAprobacion",
      sortable: true,
      format: (value) => (value !== "" ? formatDateWithTimeAndMeridiemWithInputFormat(value) : "-"),
    },
    {
      name: "fechaRadicacion",
      label: "Fecha de Radicación",
      field: "fechaRadicacion",
      sortable: true,
      format: (value) => (value !== "" ? formatDateWithTimeAndMeridiemWithInputFormat(value) : "-"),
    },
    {
      name: "tipoEnvio",
      label: "Tipo de envío",
      field: "formaEnvio",
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
      field: "correoDestinatario",
      sortable: true,
    },
    {
      name: "tiempoAsignado",
      label: "Tiempo Asignado",
      field: (row) => "1 Día", // Por defecto se deja este valor para devoluciones
      sortable: true,
    },
    {
      name: "tiempoXVencer",
      label: "Tiempo por Vencer",
      field: (row) => {
        if (row.fechaDevolucion) {
          const diffDays = getDiffDaysFromDate(row.fechaDevolucion, new Date())
          return diffDays > 1 ? "Vencido" : "1 Día";
        }
        return "-";
      },

      sortable: true,
    },
    {
      name: "fechaVencimiento",
      label: "Fecha de Vencimiento",
      field: 'fechaVencimiento',
      format: (value) => (value !== "" ? formatDateWithTimeAndMeridiemWithInputFormat(value) : "-"),
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
          (row?.municipioDestinatario || "") +
          " - " +
          (row?.departamentoDestinatario || ""),
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
      name: "actions",
      label: "Acciones",
      field: "actions",
      sortable: false,
      align: "center",
    },
  ];

  if (auth.userInfo.role.includes("Gestionador")) {
    stateOptions.value = ['Para gestión', 'En edición', 'Por revisar', 'Por aprobar', 'Revisión rechazada', 'Aprobación rechazada']
  } else {
    stateOptions.value = ['Por asignar', 'Gestión rechazada']
  }
});

const sendFilters = async (page: number, size: number, searchTermParam = '', isCounter = false) => {
  let partesRadicacion = filterSearch.value.fechaRadicacion.split("-");
  let partesVencimiento = filterSearch.value.fechaVencimiento.split("-");
  let splitFechaRadicacion = `${partesRadicacion[2]}-${partesRadicacion[1]}-${partesRadicacion[0]}`;
  let splitFechaVencimiento = `${partesVencimiento[2]}-${partesVencimiento[1]}-${partesVencimiento[0]}`;
  let estado = [];
  let filterState = ''

  switch (auth.userInfo.role.toLowerCase()) {
    case "asignador responsable":
      estado = ['RADICACION', 'GESTION_RECHAZADA', 'RECLAMACION'];
      break;
    case "gestionador":
      estado = ['ASIGNACION', 'REVISION', 'EDICION', 'RRECHAZADA', 'RECHAZAR', 'ANULACION', 'APROBACION', 'DEVOLUCION', 'PUBLICADO','PUBLICACION_RECHAZADA','PUBLICACION_CERRADA'];
      break;
    case "revisor":
      estado = ['REVISION'];
      break;
    case "aprobador":
      estado = ['APROBACION'];
      break;
  }

  switch (filterSearch.value.estado) {
    case 'Por asignar':
      filterState = 'RADICACION'
      break;
    case 'Gestión rechazada':
      filterState = 'GESTION_RECHAZADA'
      break;
    case 'Para gestión':
      filterState = 'ASIGNACION'
      break;
    case 'En edición':
      filterState = 'EDICION'
      break;
    case 'Por revisar':
      filterState = 'REVISION'
      break;
    case 'revisado':
      filterState = 'REVISADO'
      break;
    case 'Por aprobar':
      filterState = 'APROBACION'
      break;
    case 'Revisión rechazada':
      filterState = 'RRECHAZADA'
      break;
    case 'Aprobación rechazada':
      filterState = 'RECHAZAR'
      break;
    case 'Devolucion':
      filterState = 'DEVOLUCION'
      break;
  }

  try {
    loadingTable.value = true;
    const response = await sgdeaAxios.post('/medicina/buscar-ml-flt', {
      etapaProceso: estado || null,
      estado: filterState || null,
      numeroRadicado: filterSearch.value.numeroRadicado.label || null,
      siniestro: filterSearch.value.siniestro || null,
      tipoTramite: null,
      fechaRadicacion: filterSearch.value.fechaRadicacion === '' ? null : splitFechaRadicacion,
      fechaVencimiento: filterSearch.value.fechaVencimiento === '' ? null : splitFechaVencimiento,
      usuario: auth.userInfo.userid,
      size: size,
      page: page,
      isCounter: isCounter,
      oficina: auth.userInfo.role.toLowerCase() === 'asignador responsable' ? auth.$state.userInfo.oficina : null,
      // Agregar el parámetro de búsqueda
      buscador: searchTermParam || searchTerm.value || ''
    })

    if (response.status === 200) {

      if (isCounter) {
        return {
          contadoresEstado: response.data.content[0]?.contadoresEstado || [],
          total: response.data.totalElements || 0,
          data: []
        };
      }

      dataTable.value = response.data.content.map(ibuprofen => ({
        ...ibuprofen,
        canal: ibuprofen.canalRadicacion,
        numero: ibuprofen.numeroRadicado,
        siniestro: ibuprofen.numeroSiniestro || '-',
        nombreAfectado: ibuprofen.nombreAfectado,
        documentoAfectado: ibuprofen.documentoAfectado,
        remitente: ibuprofen.nombreRemitente,
        documentoRemitente: ibuprofen.documentoRemitente || '-',
        tiempoVencer: ibuprofen.tiempo || '-',
        fechaVencimiento: ibuprofen?.fechaVencimiento ? moment(ibuprofen?.fechaVencimiento)?.format("DD/MM/YYYY HH:mm") : '-',
        proceso: ibuprofen.proceso || '-',
        subproceso: ibuprofen.subProceso || '-',
        prefijo: ibuprofen.prefijo || '-',
        fechaCreacion: ibuprofen.fechaCreacionDocumento ? moment(ibuprofen.fechaCreacionDocumento).format("DD/MM/YYYY HH:mm") : '-',
        fechaRadicacion: ibuprofen.fechaRadicacion ? moment(ibuprofen.fechaRadicacion).format("DD/MM/YYYY HH:mm") : '-'
      }))

      dataTableTotalRows.value = response.data.totalPages
    }
    loadingTable.value = false
    await getRadicados()
    dataTableFilteredRows.value = dataTable.value
     return {
        data: dataTable.value,
        total: response.data.totalElements || 0,
        contadoresEstado: []
      };
  } catch (error) {
    loadingTable.value = false;
    console.error(error)
  }
}

const getDiffDaysFromDate = (date1: string, date2: string) => {
  const creationDate = new Date(date1);
  const expirationDate = new Date(date2);
  const difference = Math.abs(creationDate.getTime() - expirationDate.getTime());
  return Math.floor(difference / (24 * 60 * 60 * 1000));
}

const getRadicados = async () => {
  try {
    listadoRadicados.value = dataTable.value.map((e) => {
      return {
        label: e.numero,
        value: e.id
      }
    })
  } catch (error) {
    console.error(error);
  }
}

const selectionCaso = (value) => {
  selectedCaso.value = value;
}

const handleSearch = (term) => {
  searchTerm.value = term;
  filterSearch.value.page = 0;
  sendFilters(0, filterSearch.value.size, term);
};

const handlePageChange = async (event) => {
  await sendFilters(event.page - 1, event.rowsPerPage, searchTerm.value);
  emit('pageChange', dataTableFilteredRows.value)
}

const handleRowsPerPageChange = async (event: any) => {
  await sendFilters(event.page, event.rowsPerPage, searchTerm.value);
  emit('rowsChange', dataTableFilteredRows.value)
}

const hideModal = (value) => {
  showModalRechazarRevision.value = value;
  router.go(0)
};

const updateModal = async (value) => {
  form.value.motivoRechazo = value.value;
  const message = 'Ha ocurrido un error al rechazar los casos de forma masiva'
  if (auth.userInfo.role === 'Revisor') {
    try {
      await rechazarMasivaRevision(selected.value)
    } catch (error) {
      toast.error(message)
    }
  }

  else if (auth.userInfo.role === 'Aprobador') {
    try {
      await rechazarMasivaAprobacion(selected.value)
    } catch (error) {
      toast.error(message)
    }
  }
};

const getById = async (idMedicina: number) => {
  const response = await sgdeaAxios.get(`/medicina/casos/${idMedicina}`)
  return response.data
}

const aprobarMasivaRevision = async (selectedCaso) => {
  if (selectedCaso.some(caso => caso.revisionMasiva === false)) {
    toast.error('Al menos uno de los radicados seleccionados no cuenta con un prefijo asociado con la parametrización de revision masiva')
    return
  }

  try {
    let radicados = selectedCaso.map((caso) => {
      return {
        id: caso.id,
        estado: caso.estado,
        idRadicado: caso.numeroRadicado
      };
    });

    const response = await sgdeaAxios.patch(`/medicina/aprobarRevisiones`, { radicados })
    if (response.status == 200) {
      toast.success('Los radicados seleccionados registraron el visto bueno con éxito');
      radicados.forEach(async (radicado) => {
        const dataTrazabilidad = {
          proceso: `ML${radicado.value?.id}`,
          secuencia: radicado.value.idRadicado,
          estado: 'Por aprobar',
          descripcion: "Se ha dado visto bueno a la respuesta proyectada",
          comentario: 'Revisada',
          nombre: auth.$state.userInfo.name,
          accion: `${auth.$state.userInfo.name} dió visto bueno a la respuesta proyectada para el caso`,
          tramite: "Medicina Laboral"
        }
        await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad)
      })


    }
    showModalAprobarRevision.value = false
    router.go(0)
  } catch (error) {
    console.error(error)
  }
}

const getPdfs = (data) => {
  newArray.value.push(data)
  if (newArray.value?.length == selectedCaso.value?.length) {
    finalSubmit(newArray.value)
  }
}

const aprobarMasivaAprobacion = async (selectedCaso) => {
  if (selectedCaso.some(caso => caso.revisionMasiva === false)) {
    toast.error('Al menos uno de los radicados seleccionados no cuenta con un prefijo asociado con la parametrización de aprobación masiva')
    return
  }

  let radicados = selectedCaso.map(async (caso) => {
    data.value = await getById(caso.numeroRadicado)
    isActive.value = true
    aprobado.value = true
    documentosSalidaInstances.value.push(caso.id);
    return {
      id: caso.id,
      file: `${caso.id}.pdf`,
      observaciones: 'Se ha mandado a aprobacion masiva'
    };
  })

  const rad = await Promise.all(radicados)
  radicaciones.value = rad
}

const finalSubmit = async (data) => {

  const formData = new FormData()

  const bodyJson = JSON.stringify(radicaciones.value);
  formData.append('body', `{"radicados": ${bodyJson}}`)

  for (let i = 0; i < data?.length; i++) {
    const fileName = radicaciones.value[i].file;
    formData.append('files', data[i].file, fileName);
  }

  try {
    const response = await sgdeaAxios.patch(`/medicina/aprobarAprobacion`, formData)
    if (response.status == 200) {
      const dataTrazabilidad = {
        proceso: `ML${radicaciones.value[0].id}`,
        secuencia: radicaciones.value[0].numeroRadicado,
        estado: radicaciones.value[0].estado.estado,
        descripcion: "Se ha dado visto bueno a la respuesta proyectada",
        comentario: 'Aprobada',
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} dió visto bueno a la respuesta proyectada para el caso ML data.value.idRadicado`,
        tramite: "Medicina Laboral"
      }
      await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad)
      toast.success('Los radicados seleccionados registraron el visto bueno con éxito');
      router.go(0)
    }
    showModalAprobarRevision.value = false
    newArray.value = []
  } catch (error) {
    console.error(error)
  }
}

const rechazarMasivaRevision = async (selectedCaso) => {
  if (selectedCaso.some(caso => caso.revisionMasiva === false)) {
    toast.error('Al menos uno de los radicados seleccionados no cuenta con un prefijo asociado con la parametrización de revision masiva')
  } else {
    try {
      let radicados = selectedCaso.map((caso) => {
        return {
          id: caso.id,
          observaciones: form.value.motivoRechazo
        };
      });

      const response = await sgdeaAxios.patch(`/medicina/rechazarRevision`, { radicados })
      if (response.status == 200) {
        toast.success('Los radicados seleccionados se han rechazado con éxito');
        selectedCaso.forEach(async (radicado) => {
          const dataTrazabilidad = {
            proceso: `ML${radicado.id}`,
            secuencia: radicado.numeroRadicado,
            estado: radicado.estado,
            descripcion: "Se ha rechazado la respuesta proyectada",
            comentario: 'Rechazo Revisión',
            nombre: auth.$state.userInfo.name,
            accion: `${auth.$state.userInfo.name} rechazó la respuesta proyectada para el caso de ML data.value.idRadicado`,
            tramite: "Medicina Laboral"
          }
          await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad)
        })
      }
      router.go(0)
      showModalAprobarRevision.value = false
    } catch (error) {
      console.error(error)
    }
  }
}

const rechazarMasivaAprobacion = async (selectedCaso) => {
  if (selectedCaso.some(caso => caso.revisionMasiva === false)) {
    toast.error('Al menos uno de los radicados seleccionados no cuenta con un prefijo asociado con la parametrización de aprobación masiva')
  } else {
    try {
      let radicados = selectedCaso.map((caso) => {
        return {
          id: caso.id,
          observaciones: form.value.motivoRechazo
        };
      });

      const response = await sgdeaAxios.patch(`/medicina/rechazarAprobacion`, { radicados })
      if (response.status == 200) {
        toast.success('Los radicados seleccionados se han rechazado con éxito');

        selectedCaso.forEach(async (radicado) => {
          const dataTrazabilidad = {
            proceso: `ML${radicado.id}`,
            secuencia: radicado.numeroRadicado,
            estado: radicado.estado,
            descripcion: "Se ha rechazado la respuesta proyectada",
            comentario: 'Rechazo Revisión',
            nombre: auth.$state.userInfo.name,
            accion: `${auth.$state.userInfo.name} rechazó la respuesta proyectada para el caso de ML data.value.idRadicado`,
            tramite: "Medicina Laboral"
          }

          await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad)
        })
      }
      showModalRechazarRevision.value = false
      showModalAprobarRevision.value = false
      router.go(0)
    } catch (error) {
      console.error(error)
    }
  }
}

defineExpose({
  sendFilters,
  filterByState
})

function filterByState(estado) {
  filterSearch.value.estado = estado;
  if (!estado) {
    dataTableFilteredRows.value = dataTable.value
  } else {
    dataTableFilteredRows.value = dataTable.value.filter((item) => item.estado == estado)
  }
}

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
