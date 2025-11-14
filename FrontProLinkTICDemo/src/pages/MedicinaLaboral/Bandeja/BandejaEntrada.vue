<template>
  <div class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
    <div class="tw-flex tw-justify-between tw-pt-4">
      <h1 class="tw-text-3xl tw-font-bold">Bandeja de entrada</h1>
    </div>
    <q-form>
      <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
        <q-expansion-item default-opened>
          <template v-slot:header>
            <div class="col row">
              <b class="tw-text-lg">Filtrar por</b>
            </div>
          </template>
          <div class="row q-col-gutter-md q-pb-md q-px-md">
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <label class="tw-text-label">Número de radicado
                <SearchInput map-options :options="listadoRadicados"
                  v-model:input-data-prop="filterSearch.numeroRadicado" label="Búsqueda" maxlength="20" />
              </label>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <label class="tw-text-label">Siniestros
                <q-input type="text" outlined label="Seleccione" dense emit-value v-model="filterSearch.siniestro"
                  :rules="[v => maxLengthInput(20, v), alphanumeric]" />
              </label>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <label class="tw-text-label">Fecha de radicación
                <Datepicker mask="DD-MM-YYYY" label="dd / mm / aaaa" :options="optionsDateFunc"
                  v-model:input-data-prop="filterSearch.fechaRadicacion" @valida-fecha="true" />
              </label>
            </div>
            <div v-if="auth.userInfo.role !== 'Asignador Responsable'" class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <label class="tw-text-label">Fecha de vencimiento
                <Datepicker mask="DD-MM-YYYY" label="dd / mm / aaaa" :options="optionsDateFunc"
                  v-model:input-data-prop="filterSearch.fechaVencimiento" @valida-fecha="true" />
              </label>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <label class="tw-w-full">
                <span class="tw-text-label">Estado</span>
                <q-select v-model="filterSearch.estado" label="Seleccione" dense outlined class="tw-rounded-lg"
                  :options="stateOptions">
                </q-select>
              </label>
            </div>
          </div>
          <div class="tw-flex tw-justify-center tw-items-center tw-py-5 tw-gap-6">
            <q-btn label="Limpiar filtros" style="width: 240px" text-color="black" color="accent" @click="clearFilters"
              class="tw-rounded-xl tw-h-12" />
            <q-btn type="button" label="Buscar" text-color="white" style="width: 240px" color="primary"
              class="tw-rounded-xl tw-h-12 tw-p-2" @click="sendFilters(0, 20)" />
          </div>
        </q-expansion-item>
      </q-card>
    </q-form>
    <q-card class="q-pa-md tw-mt-4 tw-rounded-xl my-custom-table" flat>
      <div class="row tw-flex tw-w-full tw-mb-1">
        <p class="tw-text-2xl">Listado de radicados</p>
        <div class="tw-flex tw-min-h-[32px] tw-gap-2 tw-relative tw-left-[68%]"
          v-if="auth.userInfo.role === 'Revisor' && selectedCaso && selectedCaso?.length > 1">
          <q-btn label="Rechazar" outline color="black" @click="showModalRechazarRevision = true" class="tw-w-22" />
          <q-btn label="Aprobar" color="primary" @click="aprobarMasivaRevision(selectedCaso)"
            class="!tw-px-8 tw-w-20" />
        </div>

        <div class="tw-flex tw-min-h-[32px] tw-gap-2 tw-relative tw-left-[68%]"
          v-if="auth.userInfo.role === 'Aprobador' && selectedCaso && selectedCaso?.length > 1">
          <q-btn label="Rechazar" outline color="black" @click="showModalRechazarRevision = true" class="tw-w-22" />
          <q-btn label="Aprobar" color="primary" @click="aprobarMasivaAprobacion(selectedCaso)"
            class="!tw-px-8 tw-w-20" />
        </div>
      </div>
      <Table :TABLE_HEADER="Casos_HEADER" :TABLE_BODY="dataTable" selection="multiple" key-id="numero"
        v-model:item-selected="selected" @handleEditData="({ numero }) => $router.push(`./casos/detalle/${numero}`)"
        :TABLE_TOTAL_ROWS="dataTableTotalRows" :user-id="String(auth.userInfo.userid)" :role="auth.userInfo.role"
        @handlePageChange="handlePageChange" @handleRowsPerPageChange="handleRowsPerPageChange"
        :isLoading="loadingTable" @update:item-selected="selectionCaso" />
    </q-card>
  </div>

  <RechazarModalMedicina @hide-modal="hideModal" :show-modal="showModalRechazarRevision" @update-modal="updateModal" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Table from "./Table.vue";
import { Casos_HEADER, ISearchCasosData } from './index'
import SearchInput from "src/components/SearchInput/SearchInput.vue";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import Datepicker from '../datePicker.vue';
import moment from "moment";
import RechazarModalMedicina from "../RechazarModal.vue"
import { toast } from "src/helpers/toast";
import { alphanumeric, maxLengthInput } from "src/helpers/validations";

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
const selectedCaso = ref([]);
const listadoRadicados = ref([])
const showModalRechazarRevision = ref(false)
const showModalAprobarRevision = ref(false)
const refSalida = ref()
const data = ref()
const aprobado = ref(false)
const isActive = ref(false)
const documentosSalidaInstances = ref([]);
const radicaciones = ref()
const newArray = ref([])
const stateOptions = ref([])
const dataTableTotalRows = ref(0);

onMounted(() => {
  sendFilters(0, 20);

  if (auth.userInfo.role.includes("Gestionador")) {
    stateOptions.value = ['Para gestión', 'En edición', 'Por revisar', 'Por aprobar', 'Revisión rechazada', 'Aprobación rechazada']
  } else {
    stateOptions.value = ['Por asignar', 'Gestión rechazada']
  }
});

const sendFilters = async (page: number, size: number) => {
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
      estado = ["ASIGNACION","REVISION","EDICION","RRECHAZADA","RECHAZAR","ANULACION","APROBACION","DEVOLUCION","PUBLICADO","PUBLICACION_RECHAZADA","PUBLICACION_CERRADA"]
      break;
    case "revisor":
      estado = ['REVISION'];
      break;
    case "aprobador":
      estado = ['APROBACION'];
      break;
    case "administrador de trámite":
      estado = ['RADICACION', 'GESTION_RECHAZADA', 'RECLAMACION', 'ASIGNACION', 'REVISION', 'EDICION', 'RRECHAZADA', 'RECHAZAR', 'REVISION', 'APROBACION'];
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
      etapaProceso: 'Por publicar',
      estado: filterState || null,
      numeroRadicado: filterSearch.value.numeroRadicado.label || null,
      siniestro: filterSearch.value.siniestro || null,
      tipoTramite: null,
      fechaRadicacion: filterSearch.value.fechaRadicacion === '' ? null : splitFechaRadicacion,
      fechaVencimiento: filterSearch.value.fechaVencimiento === '' ? null : splitFechaVencimiento,
      usuario: auth.userInfo.userid,
      size: size,
      page: page,
      oficina: auth.userInfo.role.toLowerCase() === 'asignador responsable' ? auth.$state.userInfo.oficina : null
    })

    if (response.status === 200) {
      dataTable.value = response.data.content.map(ibuprofen => ({
        ...ibuprofen,
        canal: ibuprofen.canalRadicacion,
        numero: ibuprofen.numeroRadicado,
        siniestro: ibuprofen.numeroSiniestro || '-',
        nombreAfectado: ibuprofen.nombreAfectado,
        documentoAfectado: ibuprofen.documentoAfectado,
        remitente: ibuprofen.nombreRemitente,
        documentoRemitente: ibuprofen.documentoRemitente || '-',
        tiempoVencer: ibuprofen.tiempo <= 0 ? "Vencido" : ibuprofen.tiempo + (ibuprofen.tiempo == 1 ? " día" : " días"),
        fechaVencimiento: ibuprofen?.fechaVencimiento ? moment(ibuprofen?.fechaVencimiento)?.format("DD-MM-YYYY HH:mm") : '-',
        proceso: ibuprofen.proceso || '-',
        subproceso: ibuprofen.subProceso || '-',
        prefijo: ibuprofen.prefijo || '-',
        fechaCreacion: ibuprofen.fechaCreacionDocumento ? moment(ibuprofen.fechaCreacionDocumento).format("DD-MM-YYYY HH:mm") : '-',
        fechaRadicacion: ibuprofen.fechaRadicacion ? moment(ibuprofen.fechaRadicacion).format("DD-MM-YYYY HH:mm") : '-'
      }))

      dataTableTotalRows.value = response.data.totalPages
    }
    loadingTable.value = false
    await getRadicados()
  } catch (error) {
    loadingTable.value = false;
    console.error(error)
  }
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
    console.error(error)
  }
}

const selectionCaso = (value) => {
  selectedCaso.value = value;
}

const clearFilters = async () => {
  filterSearch.value = {
    numeroRadicado: { label: '', value: '' },
    siniestro: "",
    estado: "",
    fechaRadicacion: "",
    fechaVencimiento: "",
    size: 20,
    page: 0
  };

  await sendFilters(0, 20)
}

function optionsDateFunc(date) {
  return true
}

const handlePageChange = async (event) => {
  await sendFilters(event.page - 1, event.rowsPerPage);
}

const handleRowsPerPageChange = async (event: any) => {
  await sendFilters(event.page, event.rowsPerPage);
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
    toast.error(
      "Al menos uno de los radicados seleccionados no cuenta con un prefijo asociado con la parametrización de revision masiva"
    );
    return
  }

  try {
    let radicados = selectedCaso.map((caso) => {
      return {
        id: caso.id,
      };
    });

    const response = await sgdeaAxios.patch(`/medicina/aprobarRevisiones`, { radicados })
    if (response.status == 200) {
      toast.success(
        "Los radicados seleccionados registraron el visto bueno con éxito"
      );
      router.go(0)
      const dataTrazabilidad = {
        proceso: `ML${radicados.value?.id}`,
        secuencia: radicados.value.idRadicado,
        estado: radicados.value.estado.estado,
        descripcion: "Se ha dado visto bueno a la respuesta proyectada",
        comentario: 'Revisada',
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} dió visto bueno a la respuesta proyectada para el caso`,
        tramite: "Medicina Laboral"
      }
      const crearTrazabilidad = await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad)
    }
    showModalAprobarRevision.value = false
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
    toast.error(
      "Al menos uno de los radicados seleccionados no cuenta con un prefijo asociado con la parametrización de aprobación masiva")
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
      toast.success("Los radicados seleccionados registraron el visto bueno con éxito");
      router.go(0)
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
      const crearTrazabilidad = await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad)
    }
    showModalAprobarRevision.value = false
    newArray.value = []
  } catch (error) {
    console.error(error)
  }
}

const rechazarMasivaRevision = async (selectedCaso) => {
  if (selectedCaso.some(caso => caso.revisionMasiva === false)) {
    toast.error(
      "Al menos uno de los radicados seleccionados no cuenta con un prefijo asociado con la parametrización de revision masiva"
    );
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
        router.go(0)
        toast.success("Los radicados seleccionados se han rechazado con éxito");
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

          const crearTrazabilidad = await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad)
        })

      }
      showModalAprobarRevision.value = false
    } catch (error) {
      console.error(error)
    }
  }
}

const rechazarMasivaAprobacion = async (selectedCaso) => {
  if (selectedCaso.some(caso => caso.revisionMasiva === false)) {
    toast.error(
      "Al menos uno de los radicados seleccionados no cuenta con un prefijo asociado con la parametrización de aprobación masiva")
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
        toast.success("Los radicados seleccionados se han rechazado con éxito");

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

          const crearTrazabilidad = await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad)
        })
      }
      showModalRechazarRevision.value = false
      showModalAprobarRevision.value = false
      setTimeout(() => {
        router.go(0)
      }, 3000);
    } catch (error) {
      console.error(error)
    }
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
