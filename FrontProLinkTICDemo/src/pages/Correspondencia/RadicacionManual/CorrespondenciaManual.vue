<template>
  <main class="q-py-md">
    <!-- <BreadCrumbs :crumbs="routes"></BreadCrumbs> -->
    <div class="tw-flex tw-justify-between ">
      <h1 class="tw-text-3xl tw-font-bold">Bandeja de Entrada</h1>
      <q-btn v-if="!isRolRadicador" @click="router.push('/correspondencia/radicacion-manual')"
        label="Crear Comunicación" text-color="white" style="width: 240px" color="primary"
        class="tw-rounded-xl tw-h-12 tw-p-2" />
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
            <p class="tw-text-label tw-font-semibold">Número de pre-radicado</p>
            <q-input outlined v-model='formulario.numeroRadicado' label="Inserte" dense />
          </div>
          <div class="col-4">
            <label class="q-px-md tw-text-label">Fecha desde
              <Datepicker mask="DD/MM/YYYY" label="dd / mm / aaaa" v-model:input-data-prop="formulario.fechaDesdePre"
                :requiredValitation="false" />
            </label>
          </div>
          <div class="col-4">
            <label class="q-px-md tw-text-label">Fecha hasta
              <Datepicker mask="DD/MM/YYYY" label="dd / mm / aaaa" v-model:input-data-prop="formulario.fechaHastaPre"
                :requiredValitation="false" />
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
      <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2">Trámites</h2>
    <div class="show-table-icons" v-if="['gestionador', 'asignador responsable', 'aprobador'].includes(getUserInfo().role.toLowerCase())">
        <Table class="q-pa-md" :TABLE_HEADER="renderColumns()" :TABLE_BODY="(getUserInfo().role.toLowerCase() == 'gestionador') ? filteredRadicadasGest : filteredRadicadasAprAsig" key-id="id"
          @handle-edit-data="(id: any) => router.push(`/correspondencia/detalle/${id}`)" select="multiple"
          @update:filas="getPageFilas" @update:detail-radicado="selectedRadicadoDetails" @update:pages="getPageFilas"
          :total-pages="totalPages" @delete-com="handleDeleteComunicacion" @incluirExp="incluirExpediente"
          @adjuntar-doc="adjuntarDocumento" @generar-radicado="generarRadicado" />
      </div>
      <div class="show-table-icons" v-if="!['gestionador', 'asignador responsable', 'aprobador'].includes(getUserInfo().role.toLowerCase())">
        <Table class="q-pa-md" :TABLE_HEADER="renderColumns()" :TABLE_BODY="filteredRadicadas" key-id="id"
          @handle-edit-data="(id: any) => router.push(`/correspondencia/detalle/${id}`)" select="multiple"
          @update:filas="getPageFilas" @update:detail-radicado="selectedRadicadoDetails" @update:pages="getPageFilas"
          :total-pages="totalPages" @delete-com="handleDeleteComunicacion" @incluirExp="incluirExpediente"
          @adjuntar-doc="adjuntarDocumento" @generar-radicado="generarRadicado" />
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

    <q-dialog full-width v-model="showModalDetalle">
      <q-card class="tw-w-[3000px]">
        <q-card-section>
          <a @click="showModalDetalle = false" class="tw-text-primary tw-cursor-pointer" style="text-decoration: none;">
            <q-icon size="1.5em" name="chevron_left" color="primary" />
            <b>
              Volver
            </b>
          </a>
          <SubTramite :details-radicado="detailRadicado" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <ConfirmModal @update:show-modal="handleRejectModal" @confirm-modal="handleSubmitEliminarRadicacion"
      :show-modal="showConfirmModal" text-show-modal="¿Esta seguro de eliminar esta comunicación?"
      text-confirm-modal="Si" text-cancel-modal="No" />

    <q-dialog v-model="showModalExpediente">
      <q-card style="min-width: 1300px;">
        <q-card-section>
          <a @click="showModalExpediente = false" class="tw-text-primary tw-cursor-pointer"
            style="text-decoration: none;">
            <q-icon size="1.5em" name="chevron_left" color="primary" />
            <b>
              Volver
            </b>
          </a>
          <IncluirExpediente :corData="detailRadicado" @update:is-expediente="reloadAfterSaveExpedient()" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog full-width v-model="showModalRadicar">
      <q-card class="tw-w-[3000px]">
        <q-card-section>
          <EditarManual :id="detailRadicado.id" @update:step="(sp) => stepEdit = sp" />
          <div class="tw-flex tw-justify-center tw-gap-5">
            <q-btn class="tw-rounded-xl tw-h-12 tw-p-2 tw-w-40" text-color="white" color="primary" label="Cancelar"
              @click="() => showModalRadicar = false" />
            <q-btn class="tw-rounded-xl tw-h-12 tw-p-2 tw-w-40" :disable="stepEdit === 0" text-color="white"
              color="primary" label="Generar radicado" @click="handleSubmitGenerarRadicado" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog full-width v-model="showModalAdjuntar">
      <q-card class="tw-w-[1000px]">
        <q-card-section>

          <AdjuntarDocumento :details-radicado="detailRadicado" type="Soporte" @backView="showModalAdjuntar = false"/>

        </q-card-section>
      </q-card>
    </q-dialog>


    <Modal v-model="showModalDescargaSticker" title="Exito"
      :text="`Se ha generado el radicado ${currentSal} exitosamente`" is-success cancel-button
      text-button="Imprimir Sticker" @handleAccept="imprimirSticker" />
  </main>
</template>

<script lang="ts" setup>
import Datepicker from "components/FormFields/datePickerComponent.vue";
import moment from "moment";
// import RadicacionManual from "../RadicacionManual.vue";
import ConfirmModal from "src/components/Modal/ConfirmModal.vue";
import { useQuasar } from 'quasar';
import Modal from "components/Modal/Modal.vue";
// import { useMunicipalities } from "src/composables/useVersion";
import { formatDateTimeStandTwo } from "src/helpers/formtDate";
// import {
//   alphanumeric,
//   maxLengthInput,
// } from 'src/helpers/validations';
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import Table from "./TableManual.vue";
import SubTramite from "./SubTramite/subTramite.vue";
import IncluirExpediente from "../Expedientes/IncluirExpediente.vue";
import AdjuntarDocumento from "./AdjuntarDocumento.vue";
import EditarManual from "./EditarManual.vue"
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { toast } from "src/helpers/toast";
// import { toast } from "src/helpers/toast";

const q = useQuasar();
const router = useRouter();
const formulario = ref({
  numeroRadicado: '',
  fechaDesdePre: "",
  fechaHastaPre: ""
});

const showModalDetalle = ref(false)
const showModal = ref(false)
const allRadicados = ref([])
const filteredRadicadas = ref([])
const filteredRadicadasAprAsig = ref([])
const filteredRadicadasGest = ref([])
const opForRadicados = ref([])
const detailRadicado = ref()
const comToDelete = ref()
const showModalRadicar = ref()
const showConfirmModal = ref(false)
const showModalExpediente = ref(false)
const showModalAdjuntar = ref(false)
const showModalDescargaSticker = ref(false)
const auth = useAuthStore()
const currentSal = ref()
const stepEdit = ref(0)
const hardcoreData = ref({
  codigoProceso: "",
  idRadicado: "",
  nodeId: "",
  informacionProceso: {
    numeroDocumentoAfectado: ""
  },
});
const isRolRadicador = ref(false)
const { getUserInfo } = useAuthStore();
function selectedRadicadoDetails(details) {


  detailRadicado.value = details
  showModalDetalle.value = true
}
onMounted(async () => {
  isRolRadicador.value = (await getUserInfo()).role.includes('Radicador - Ventanilla');
});
async function incluirExpediente(details) {


  detailRadicado.value = details
  showModalExpediente.value = true
}

function generarRadicado(details) {


  detailRadicado.value = details
  showModalRadicar.value = true
}

function adjuntarDocumento(details){


  detailRadicado.value = details
  showModalAdjuntar.value = true
}

const renderColumns = () => {
  const columns = [
    {
      name: "radicado",
      label: "Consecutivo",
      field: (row) =>
        row.secuenciaRadicado ?? row.preRadicado,
      sortable: true,
    },
    {
      name: "nombreComunicacion",
      label: "Nombre de la comunicación",
      field: (row) => row.nombre || "-",
      sortable: true,
    },
    {
      name: "fechaCreacion",
      label: "Fecha de Creación",
      field: "fechaRadicacion",
      sortable: true,
      format: (value) => (value !== "" ? formatDateTimeStandTwo(value) : "-"),
    },
    {
      name: "tipoComunicacion",
      label: "Tipo de Comunicación",
      field: (row) =>
        row?.tipoComunicacion
          ? row?.tipoComunicacion.nombre
          : "-",
      sortable: true,
    },
    {
      name: "cantidad",
      label: "Cantidad",
      field: (row) =>
        row?.comunicacionManualDG.anexos
        ?? "-",
      sortable: true,
    },
    {
      name: "verDetalle",
      label: "Ver detalle",
      field: (row) =>
        row?.fechaVencimiento
          ? moment(row.fechaVencimiento).format("DD/MM/YYYY")
          : "-",
      sortable: true,
    },
    {
      name: "trazabilidad",
      label: "Trazabilidad",
      field: (row) =>
        row?.nombreAfectado && row?.documentoAfectado
          ? row?.documentoAfectado + " - " + row?.nombreAfectado
          : "-",
      sortable: true,
    },
    {
      name: "states",
      label: "Estados",
      field: "estado"
    },
    {
      name: "actions",
      label: "Acciones",
      field: (row) =>
        row?.nombreRemitente && row?.documentoRemitente
          ? row?.documentoRemitente + " - " + row?.nombreRemitente
          : "-",
      sortable: true,
    },
  ];

  return columns;
};

function handleDeleteComunicacion(id) {
  comToDelete.value = id
  showConfirmModal.value = true
}

async function handleSubmitEliminarRadicacion() {
  const response = await sgdeaAxios.delete(`/correspondencia/comunicacionManual/eliminar?idComunicacionManual=${comToDelete.value}`);
  if (response.status === 200) {
    toast.success('La información fue eliminada correctamente')
    fetchData(path.value);
    showConfirmModal.value = false
  }
}

async function imprimirSticker() {
  try {
    const response = await sgdeaAxios.post(`/sticker/generarSticker/comunicacionManual/pdf?idradicado=${detailRadicado.value.id}&idUsuario=${auth.$state.userInfo.userid}`, null, {
      responseType: 'blob' // Set the response type to 'blob'
    });

    if (response.status === 200) {

      // Create a Blob object from the response data
      const fileBlob = new Blob([response.data], { type: 'application/pdf' });

      // Create a link element
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(fileBlob);
      link.download = `${currentSal.value}.pdf`; // Specify the file name

      // Append the link to the body
      document.body.appendChild(link);

      // Programmatically trigger a click on the link to download the file
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);

      // Additional logic
      fetchData(path.value);
      showConfirmModal.value = false;
    }
    await crearTrazabilidad({
          proceso: `PRE${detailRadicado.value.id}`,
          secuencia: detailRadicado.value.secuenciaRadicado,
          estado: 'RADICADO',
          descripcion: `Se ha impreso el sticker para la comunicación manual`,
          comentario: 'Radicación',
          nombre: useAuthStore().$state.userInfo.name,
          tramite: 'Comunicación Manual',
          accion: `Se ha impreso el sticker para la comunicación manual`
        })
  } catch (error) {
    console.error('Error while downloading the file:', error);
  }
}

async function handleSubmitGenerarRadicado() {

  const response = await sgdeaAxios.post(`/correspondencia/comunicacionManual/radicar?idComunicacionManual=${detailRadicado.value.id}`);
  if (response.status === 200) {
    toast.success('Se ha generado el radicado exitosamente');
    // Si se generó correctamente, se cierra modal de radicar
    showModalRadicar.value = false;
    await crearTrazabilidad({
          proceso: `PRE${detailRadicado.value.id}`,
          secuencia: detailRadicado.value.preRadicado,
          estado: 'RADICADO',
          descripcion: `Se ha generado el radicado de salida ${response.data.secuenciaRadicado} para la comunicación manual`,
          comentario: 'Radicación',
          nombre: useAuthStore().$state.userInfo.name,
          tramite: 'Comunicación Manual',
          accion: `Se ha generado el radicado de salida de la comunicación manual`
        })
    fetchData(path.value);
    detailRadicado.value = response.data
    currentSal.value = response.data.secuenciaRadicado
    showModalDescargaSticker.value = true
  }
}

function handleRejectModal() {
  showConfirmModal.value = false
}

const path = ref('')
onUnmounted(() => {
  q.iconSet.table.arrowUp = 'arrow_upward'
})
onMounted(async () => {
  renderColumns();

  q.iconSet.table.arrowUp = 'import_export'
  path.value = `/correspondencia/radicacionesManuales/tramites`
  renderColumns();
  await filterService()
  await fetchData(path.value);
});

const reloadAfterSaveExpedient = async () => {
  showModalExpediente.value = false;
  await filterService();
}

const filterService = async () => {
  const entries = Object.entries(formulario.value);
  const body = filterEmptyValues(entries);
  body['pageSize'] = filasGrilla.value || 20
  body['pageNo'] = numPageGrilla.value || 0

  // @ts-ignore
  await fetchData(path.value, body);
}

const totalPages = ref()
const totalElements = ref()
const filasGrilla = ref()
const numPageGrilla = ref()

async function fetchData(path: string, body = { pageSize: 20, pageNo: 0 }) {
  body['userId'] = auth.$state.userInfo.userid;
  const { data } = await sgdeaAxios.get(path, { params: body });
  totalElements.value = data.totalElements
  totalPages.value = data.totalPages

  allRadicados.value = data.content;

  filteredRadicadas.value = allRadicados.value.filter((radicado) => radicado.estado.nombre !== 'Aprobado');
  filteredRadicadasAprAsig.value = allRadicados.value.filter((radicado) => radicado.usuarioCreador.userName == getUserInfo().username && radicado.secuenciaRadicado == null && radicado.estado.nombre !== 'Aprobado');
  filteredRadicadasGest.value = allRadicados.value.filter((radicado) => radicado.usuarioCreador.userName == getUserInfo().username  && radicado.estado.nombre !== 'Aprobado');
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
    numeroRadicado: "",
    fechaDesdePre: "",
    fechaHastaPre: ""
  }

  await fetchData(path.value);
}

const getPageFilas = async (filas = 20, pageNo = 0) => {
  filasGrilla.value = filas
  numPageGrilla.value = pageNo
  const entries = Object.entries(formulario.value);
  let isEmpty = true;

  entries.forEach(([_, value]) => {
    if (value !== '') {
      isEmpty = false;
    }
  });
  if (isEmpty) {
    await fetchData(path.value, { pageSize: filas, pageNo });
  } else {
    filterService()
  }
}


const getNumRadicados = async () => {
  const { data } = await sgdeaAxios.post(path.value, { size: totalElements.value, usuario: auth.$state.userInfo.userid });
  opForRadicados.value = data.content.map((data) => ({
    label: data.idRadicacion,
    value: data.idRadicacion,
  }));
}

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
