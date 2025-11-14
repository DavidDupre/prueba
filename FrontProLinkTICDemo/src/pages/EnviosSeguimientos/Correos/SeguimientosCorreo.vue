<template>
  <div class="q-my-md">
    <div class="tw-flex tw-justify-between tw-items-center">
      <span class="tw-font-bold tw-text-3xl tw-my-5">Seguimiento de devoluciones</span>
    </div>
    <q-card class="tw-rounded-xl tw-p-4" flat bordered>
      <q-expansion-item default-opened>
        <div class="row q-col-gutter-md q-pb-md q-px-md">

          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Fecha Desde</span>
            <q-input ref="inputFrom" v-model="filtro.fechaDesde" outlined dense mask="##/##/####"
              :rules="[validateDateCoherence('desde'), validateNoFutureDate]" @copy.prevent @paste.prevent :options="opForInicial">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="filtro.fechaDesde" :options="opForHasta" mask="DD/MM/YYYY">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

          </div>

          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Fecha Hasta</span>
            <q-input ref="inputTo" v-model="filtro.fechaHasta" outlined dense mask="##/##/####"
              :rules="[validateDateCoherence('hasta'), validateNoFutureDate]" @copy.prevent @paste.prevent>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="filtro.fechaHasta" :options="opForHasta" mask="DD/MM/YYYY">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Radicado de salida</span>
            <q-input outlined dense hide-selected fill-input v-model="filtro.radicadoSalida" @filter="filterFn"
              use-input :options="optionsCode" :rules="[v => maxLengthInput(30, v)]" emit-value map-options
              label="Búsqueda" @keypress="onlyAlphaNumeric">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No se encontró
                  </q-item-section>
                </q-item>
              </template>
            </q-input>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Nombre destinatario</span>
            <q-input outlined dense hide-selected fill-input v-model="filtro.nombreDestinatario" @filter="filterFn"
              use-input :options="optionsCode" :rules="[v => maxLengthInput(80, v)]" emit-value map-options
              label="Búsqueda" @keypress="onlyAlphaNumeric">
            </q-input>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Correo destinatario</span>

            <q-input outlined dense hide-selected fill-input v-model="filtro.email" @filter="filterFn" use-input
              :options="optionsCode" :rules="[v => maxLengthInput(50, v)]" emit-value map-options label="Búsqueda">
            </q-input>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Tipo de Envío</span>
            <q-select :rules="[]" name="tipoEnvio" outlined v-model="filtro.tipoEnvio" label="Seleccione" dense
              map-options emit-value
              :options="[{ value: 1, label: 'Correo electrónico' }, { value: 2, label: 'Correo electrónico certificado' }]" />
          </div>
        </div>

        <div class="tw-flex tw-justify-center tw-items-center tw-my-5 tw-gap-6">
          <q-btn label="Limpiar" type="reset" style="width: 240px" text-color="black" color="accent"
            @click="cleanFilters" class="tw-rounded-xl tw-h-12" />

          <q-btn type="submit" label="Buscar" color="primary" text-color="white" class="tw-rounded-xl tw-h-12 tw-p-2"
            style="width: 240px" :disable="isSearchDisabled" @click="getData" />
        </div>
      </q-expansion-item>
    </q-card>

    <q-card v-if="showDataBandeja" class="tw-rounded-xl q-mt-lg tw-p-5" flat bordered>
      <div class="flex items-center justify-between q-px-md q-mb-sm row col-12">
        <span class="text-weight-bold text-h6" style="color: #2c3948">Seguimiento de devoluciones</span>

        <div class="tw-flex tw-items-center tw-gap-10">

          <div class="tw-flex tw-items-center tw-gap-2.5">
            <q-btn-dropdown color="accent" textColor="secondary" label="Exportar"
              style="width: 116px; height: 30px; border-radius: 8px" no-caps dropdown-icon="expand_more">
              <q-list separator dense>
                <q-item clickable v-close-popup @click="exportCSV">
                  <q-item-section avatar>
                    <q-avatar square>
                      <q-img v-lazy :data-url="csv" alt="csv" width="24px" height="24px" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>Exportar CSV</q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="exportXLSX">
                  <q-item-section avatar>
                    <q-avatar square>
                      <q-img v-lazy :data-url="excel" alt="excel" width="24px" height="24px" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>Exportar XLSX</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>

            <q-btn :disable="selectedRows.length > 0 ? false : true " color="orange-7" label="Devolver" style="width: 150px; height: 30px; border-radius: 8px" no-caps
              icon="send" @click="toggleReturnConfirmation" />
          </div>
        </div>
      </div>
      <TableBandeja :buscar="buscar" class="full-width" key-id="idCaso" :TABLE_TOTAL_ROWS="dataTableTotalRows"
        :TABLE_TOTAL_PAGES="dataTableTotalPages" :TABLE_HEADER="columns" :TABLE_BODY="filteredDataTable"
        select="single" @update:itemSelected="selectRows"
        msg-no-data="No se encontraron resultados con los filtros aplicados, valide y consulte nuevamente"
        @update:filas="getPageFilas" @update:pages="getPageFilas" @handlePageChange="handlePageChange"
        @handleRowsPerPageChange="handleRowsPerPageChange" @show-docs="showModalDocs"
        @handleEditData="navigateToComponent" />
    </q-card>
    <!-- modalcarga -->
     <template v-if="showModalDocsOutputDocuments">
      <LoadingModal @load-complete="toggleData" />
    </template>
    <template v-if="reportModal">
      <LoadingModal @load-complete="sendReportModal = true" />
    </template>
    <template>
      <q-dialog v-model="sendReportModal" persistent transition-show="scale" transition-hide="scale"
        transition-duration="300">
        <q-card class="tw-p-10">
          <q-card-section class="tw-bg-white">
            <div class="full-width row  tw-justify-center tw-items-center">
              <img v-lazy :data-url="mail" alt="email" />
            </div>
          </q-card-section>
          <q-card-section>
            <p class="tw-font-bold tw-text-2xl tw-text-center"> Enviar Reporte al Correo</p>
            <p class="tw-font-bold tw-mt-3 tw-ms-4 tw-mb-1">Formato *</p>
            <q-form ref="selectModal">
              <q-select v-model="inputFormat" :rules="[inputRequired]" outlined map-options emit-value
                label="Seleccione" :options="[
                  { value: 'xlsx', label: 'Excel' },
                  { value: 'csv', label: 'CSV' }
                ]" />
            </q-form>

            <q-expansion-item label="Correo Electrónico *" header-class="tw-font-bold tw-mt-3 tw-mb-1">
              <q-card>
                <q-list bordered>
                  <q-item>
                    <q-item-section>
                      <q-form ref="emailForm">
                        <q-select :disable="emailList.length < 3 ? false : true" :rules="[inputRequired]"
                          v-model="correo" use-input hide-selected fill-input input-debounce="0"
                          :options="optionsCorreos" @filter="filterFnCorreos">
                          <template v-slot:no-option>
                            <q-item>
                              <q-item-section class="text-grey">
                                Sin resultados
                              </q-item-section>
                            </q-item>
                          </template>
                          <template v-slot:prepend>
                            <q-icon name="check_circle" />
                          </template>
                          <template v-slot:append>
                            <q-btn icon="add_circle" color="primary" flat v-on:click="addEmail()" />
                          </template>
                        </q-select>
                      </q-form>
                    </q-item-section>
                  </q-item>
                  <q-item v-for="email in emailList">
                    <q-item-section side>
                      <q-icon color="gray" name="check_circle" />
                    </q-item-section>
                    <q-item-section>
                      {{ email }}
                    </q-item-section>
                    <q-item-section side>
                      <q-btn icon="close" flat v-on:click="deleteEmail(email)" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </q-expansion-item>
          </q-card-section>

          <div class="row justify-center q-mt-md">
            <q-btn color="secondary" flat label="No" v-on:click="confirmCancelarModalEnvioCorreo = true"
              class=" col-5 q-ma-none q-py-md" style="width: 200px; height: 60px;" />

            <q-btn color="secondary" label="Si" v-on:click="reportSuccess" class="col-5 tw-bg-primary q-ma-none q-py-md"
              style="width: 200px; height: 60px;" />
          </div>
        </q-card>
      </q-dialog>
      <Modal v-model="confirmCancelarModalEnvioCorreo" title="Confirmación"
        text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
        :is-success="false" cancel-button text-button-cancel="No" text-button="Si"
        @handleAccept="cancelarEnviarModal" />


      <q-dialog full-width v-model="modalDocs">
        <q-card class="q-pa-xl tw-w-[3000px]">
          <a @click="modalDocs = false" class="tw-text-primary" style="text-decoration: none;">
            <q-icon size="1.5em" name="chevron_left" color="primary" />
            <b>
              Volver
            </b>
          </a>
          <Table :TABLE_BODY="listDocs" :TABLE_HEADER="fileColumns" icon="download" isSecondIcon isThirdIcon
            secondIcon="delete" thirdIcon="print" :loading="loading" is-selection="none" @handleEditData="download"
            @handleThirdIcon="print"
            :key-id="'idCaso'" />
        </q-card>
      </q-dialog>
      <q-dialog v-model="showReturnConfirmation" persistent>
        <q-card class="tw-w-[3000px]">
          <q-card-section class="tw-text-center tw-p-10">
            <h2 class="tw-text-bold tw-mb-10 tw-text-secondary tw-font-bold tw-text-lg">¿Desea hacer la devolución {{
              selectedRows.length === 1
                ? 'del siguiente caso'
                : 'de los siguientes casos' }}?</h2>
            <div class="tw-mb-6">
              <div class="tw-font-semibold tw-mb-2">Número de Radicado de Salida</div>

              <div v-for="row in selectedRows" :key="row.id" class="tw-text-base tw-text-gray-700">
                • {{ row.radicadoSalida }}
              </div>
            </div>
            <div class="tw-flex tw-justify-between tw-mt-5">
              <q-btn label="Cancelar" type="reset" style="width: 200px" text-color="white" color="secondary"
                @click="toggleReturnConfirmation" class="tw-rounded-xl tw-h-12" />
              <q-btn label="Aceptar" type="reset" style="width: 200px" text-color="white" color="primary"
                @click="updateSelectedCases" class="tw-rounded-xl tw-h-12" />
            </div>
          </q-card-section>


        </q-card>
      </q-dialog>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { exportFile } from "quasar";
import Modal from "src/components/Modal/Modal.vue";
import TableBandeja from "./Table.vue";
import { inputRequired, maxLengthInput, onlyAlphaNumeric } from 'src/helpers/validations';
import { fourthFormatDate, reverseFormatDate } from "src/helpers/formtDate";
import mail from "src/assets/mail.svg";
import excel from "src/assets/excel.svg";
import csv from "src/assets/csv.svg";
import LoadingModal from "src/components/Modal/LoadingModal.vue";
import Table from "./AdjuntarDocumentosTable.vue";
import { sgdeaAxios } from "src/services";
import moment from "moment";
import * as XLSX from 'xlsx';
import { toast } from "src/helpers/toast";
import { useAuthStore } from "src/stores/auth.store";
import { fileColumns, REPORTES_HEADER } from ".";
import { useRouter } from "vue-router";
import { DocsBD, DocumentoRadicado } from "src/interfaces";
import { crearTrazabilidad } from "src/helpers/trazabilidad";

const columns = ref(REPORTES_HEADER.filter(col => col.name !== "accion"));
const confirmCancelarModalEnvioCorreo = ref(false)
const modalDocs = ref(false)
const listDocs = ref([]);
const currPage = ref(0)
const pageSize = ref(20) //FIXME:
const usuariosOptions = ref([])
const dataTableTotalRows = ref()
const dataTableTotalPages = ref()
const search = ref()
const listadoDevoluciones = ref([])
const listadoDevolucionesMensajeria = ref([])
const optionsCode = ref()
const selectedRows = ref([])
const inputFormat = ref('')
const correo = ref()
const emailList = ref([])
const emailForm = ref()
const selectModal = ref()
const correosPositiva = ref([])
const optionsCorreos = ref([])
const puntosRadicacionOp = ref()
const listadoEstadoEnviosOp = ref()
const loading = ref(false)
const router = useRouter()
const showDataBandeja = ref(false)
const showReturnConfirmation = ref(false)
const showModalSeguimientoCourierDevuelto = ref(false)
const seguimientoCourierSelection = ref()
const showModalSeguimientoCourierEntregado = ref(false)
const facData = ref([]);
let buscar = ref("");
const opCodeJuz = ref([])
const auth = useAuthStore()

const mensajeriaSeguimiento = ref({
  estadoRecibido: null,
  fechaSeguimiento: null,
  causal: null,
  observacion: null,
  archivos: null
})

const filtro = ref({
  fechaDesde: "",
  fechaHasta: "",
  puntoRadicacionId: "",
  usuarioId: "",
  radicadoSalida: "",
  tipoEnvio: "",
  estadoEnviosId: "",
  nombreDestinatario: "",
  email: ""
});

const reportModal = ref(false);
const sendReportModal = ref(false);
const showModalDocsOutputDocuments = ref(false);

onMounted(async () => {
  getFilterData()
  getTipoDevoluciones();
  filtro.value.usuarioId = useAuthStore().$state.userInfo.userid
});
onMounted(() => {
  if (!filtro.value.fechaDesde && !filtro.value.fechaHasta) {
    const oneMonthAgo = moment().subtract(1, 'months');
    filtro.value.fechaDesde = oneMonthAgo.format("DD/MM/YYYY");
  }
});

async function getFilterData() {
  try {

    const listadoEstadoEnvios = await sgdeaAxios.get('/envios/listadoEstadoEnvios')

    listadoEstadoEnviosOp.value = listadoEstadoEnvios.data.map((item) => ({
      label: item.nombre,
      value: item.id
    }))

    const listadoPuntosRadicacion = await sgdeaAxios.get('/correspondencia/puntoRadicacion/listadoActive')

    puntosRadicacionOp.value = listadoPuntosRadicacion.data.map((item) => ({
      label: item.nombrePunto,
      value: item.id
    }))

    const listadoUsuarios = await sgdeaAxios.get('/usuarios/all')
    usuariosOptions.value = listadoUsuarios.data.map((item) => ({
      label: item.firstname + " " + item.lastname,
      value: item.id
    }))

    filtro.value.fechaHasta = moment().format('DD/MM/YYYY')
  } catch (error) {
    console.error(error)
  }
}

async function getData() {
  let params = [];
  filteredDataTable.value = [];
  const paramMapping = {
    fechaDesde: 'fechaDesde',
    fechaHasta: 'fechaHasta',
    radicadoSalida: 'radicadoSalida',
    tipoEnvio: 'tipoEnvio',
    email: 'correoElectronico',
    nombreDestinatario: 'destinatarioFiltro'
  };

  // Loop over the mapping and generate parameters
  Object.keys(paramMapping).forEach(key => {
    const field = filtro.value[key];

    if (field?.value) {
      params.push(`${paramMapping[key]}=${field.label}`);
    } else if (field) {
      if (key === "fechaDesde" || key === "fechaHasta") {
        const isValid = moment(field, "DD/MM/YYYY", true).isValid();

        if (!isValid) {
          toast.error("La fecha ingresada es incorrecta, verifique e intente nuevamente");
          return;
        }

        const timeSuffix = key === "fechaHasta" ? "T23:59:59" : "T00:00:00";
        params.push(`${paramMapping[key]}=${reverseFormatDate(field)}${timeSuffix}`);
      } else {
        const dataFil = typeof field === "string" ? quitarTildes(field) : field;
        params.push(`${paramMapping[key]}=${dataFil}`);
      }
    }
  });

  let url = `/asignarDev/bandejaSegumientoASignacionDEV?size=${pageSize.value}&page=${currPage.value}`;


  if (params.length) {
    url += `&${params.join('&')}`;
  }

  const response = await sgdeaAxios.get(url);

  if(response.data.content.length === 0) {
    return toast.warning("No se encontraron resultados con los filtros aplicados, valide y consulte nuevamente");
  }

  showDataBandeja.value = true;
  dataTableTotalPages.value = response.data.content
  facData.value = response.data.elementos || response.data.content;
  dataTableTotalRows.value = response.data.totalElements
  //filteredDataTable.value = facData.value.filter((item) => [6, 7].includes(item.estadoEnvios.id))

  var filter = facData.value.sort((a, b) => new Date(a.fechaRadicacion) - new Date(b.fechaRadicacion))

  filteredDataTable.value = filter
  selectedRows.value.length = 0
}

const flowUrlMap = new Map<number, (id: number) => string>([
  [5, (id: number) => `/pqrd/obtenerDocs?idPqrd=${id}`],
  [8, (id: number) => `/medicina/documentos/${id}`],
]);
const outgoingDocByFlow  = new Map<number, (file: DocsBD) => boolean>([
  [5, (file) => file.tipo === 'De salida'],
  [8, (file) => file.tipoDocumento === 'SALIDA'],
]);
const showModalDocs = async (rowData: any) => {
  listDocs.value = []
  const idFlujo = rowData?.idFlujo?.id;
  const idCaso = rowData?.idCaso;
  if (!idFlujo || !idCaso) {
    console.error('idFlujo o id no definido');
    return;
  }

  const urlGenerator = flowUrlMap.get(idFlujo);
  const salidaDocMatcher = outgoingDocByFlow.get(idFlujo);

  if (!urlGenerator) {
    console.error(`No hay función para generar URL con idFlujo: ${idFlujo}`);
    return;
  }

  const url = urlGenerator(idCaso);
  showModalDocsOutputDocuments.value = true
  try {
    const { data: files }: { data: DocsBD[] } = await sgdeaAxios.get(url);

    const salidaDoc = files.find(salidaDocMatcher);

    if (!salidaDoc) {
      return;
    }

    const nodeId = salidaDoc.nodeId;
    const { data }: { data: DocumentoRadicado } = await sgdeaAxios.get(
      `/radicados/consultar_documento/${nodeId}`
    );
    const docsPromises = files.map(async (file) => {
      if (file.nodeId) {
        const { data: docData } = await sgdeaAxios.get(
          `/radicados/consultar_documento_entry/${file.nodeId}`,{showLoader: false}
        );
        return docData;
      }
      return null;
    });

    const allDocs = (await Promise.all(docsPromises))
      .filter(Boolean);

    listDocs.value = allDocs
      .sort((a, b) =>
        new Date(b.entry?.createdAt).getTime() -
        new Date(a.entry?.createdAt).getTime()
      )
      .map((it) => {
        const foundFile = files.find((itFile) => itFile.nodeId === it.entry?.id);

        return {
          formato: it.entry?.content?.mimeType ?? 'No disponible',
          nombre: it.entry?.name,
          fecha: fourthFormatDate(it.entry?.createdAt),
          tipo: foundFile ? foundFile.tipo : 'De gestión',
          id: it.entry?.id,
          es_devolucion: foundFile?.es_devolucion || false
        };
      })
      .filter(it => !it.tipo?.includes("Respuesta"))
  } catch (error) {
    console.error("Error al mostrar el documento de salida:", error);
  }
};
const toggleData = () => {
  modalDocs.value = !modalDocs.value;
  showModalDocsOutputDocuments.value = !showModalDocsOutputDocuments.value;
};
const print = async (rowEditData) => {
  try {
    const { data } = await sgdeaAxios.get<DocumentoRadicado>(
      `/radicados/consultar_documento/${rowEditData.id}`
    );

    const byteCharacters = atob(data.base64x);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const blobUrl = URL.createObjectURL(blob);

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    // Función para manejar el evento afterprint
    function handleAfterPrint() {
      // Eliminar el iframe después de imprimir o cancelar
      document.body.removeChild(iframe);
      window.removeEventListener('afterprint', handleAfterPrint);
    }

    // Agregar evento afterprint para manejar la impresión
    window.addEventListener('afterprint', handleAfterPrint);

    // Esperar a que se cargue el contenido del iframe antes de imprimir
    iframe.onload = function () {
      // Imprimir el contenido del iframe
      iframe.contentWindow.print();
    };

  } catch (error) {
    toast.error('Ha ocurrido un error')
  } finally {
  }
}

const selectRows = (data) => {
  selectedRows.value = data
}

const cleanFilters = () => {
  for (let key in filtro.value) {
    filtro.value[key] = "";
  }
  currPage.value = 0
  search.value = ''
  // getData()
};

const addEmail = async () => {
  if (await emailForm.value.validate()) {
    if (emailList.value.includes(correo.value.label)) {
      toast.error("El correo ingresado ya se encuentra en la lista")
    } else {
      emailList.value.push(correo.value.label)
      correo.value = ''
      emailForm.value.reset()
    }
  }
}

const deleteEmail = (email) => {
  emailList.value = emailList.value.filter((item) => item != email)
}

const cancelarEnviarModal = () => {
  emailList.value = []
  correo.value = ''
  inputFormat.value = ''
  sendReportModal.value = false
}

function navigateToComponent(row){
  switch(row.idFlujo.id){
    case 1:
      router.push(`/correspondencia/detalle/${row.idRadicado}`)
      break;
    case 5:
      router.push(`/pqrd/informacion/${row.idCaso}`)
      break;
    case 6:
      router.push(`/tutelas/bandeja/detalle/${row.idRadicado}`)
      break;
    case 7:
      router.push(`/entes-de-control/bandeja/detalle/${row.idCaso}`)
      break;
    case 8:
      router.push({
        name: 'detalleCaso',
        params: {
          id: row.idRadicado,
          ...(row.idFlujo?.id && { idFlujo: row.idFlujo.id })
        }
      });
  }
}

const quitarTildes = (texto) => {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const filasGrilla = ref()
const numPageGrilla = ref()

const getPageFilas = async (filas = 20, page = 0) => {
  filasGrilla.value = filas
  numPageGrilla.value = page
  let params = [];

  // Define the mapping between filtro.value properties and URL parameters
  const paramMapping = {
    fechaDesde: 'fechaDesde',
    fechaHasta: 'fechaHasta',
    identificacion: 'numeroIdentificacion',
    siniestro: 'numerosiniestro',
    usuario: 'nombreGestionador',
    juzgado: 'idJuzgado',
    etapa: 'idEtapaProcesal',
    codigo: 'codigoJuzgado',
    departamento: 'departamento',
    municipio: 'municipio'
  };

  // Loop over the mapping and generate parameters
  Object.keys(paramMapping).forEach(key => {
    if (filtro.value[key].value) {
      params.push(`${paramMapping[key]}=${filtro.value[key].label}`);
    } else if (filtro.value[key]) {
      params.push(`${paramMapping[key]}=${filtro.value[key]}`);
    }
  });

  let url = `/tutela/listadoReporteTutelas?pageSize=${filas}&pageNo=${page}`;

  if (params.length) {
    url += `&${params.join('&')}`;
  }

  const response = await sgdeaAxios.get(url);

  facData.value = response.data.elementos || response.data.content;
  dataTableTotalRows.value = response.data.totalElements
  dataTableTotalPages.value = response.data.totalPages
  var filter = facData.value.sort((a, b) => new Date(a.fechaRadicacion) - new Date(b.fechaRadicacion))
  filteredDataTable.value = filter
}
const opForHasta = (date) => {
  const hoy = moment();
  const d = moment(date, "YYYY/MM/DD");
  return d.isSameOrBefore(hoy, "day");
};

const opForInicial = (date) => {
  const d = moment(date, "YYYY/MM/DD");
  const hoy = moment();

  let limiteSuperior = hoy;

  if (filtro.value.fechaHasta) {
    const hasta = moment(filtro.value.fechaHasta, "DD/MM/YYYY");
    if (hasta.isBefore(hoy)) {
      limiteSuperior = hasta;
    }

    const unMesAntes = moment(hasta).subtract(1, "months");
    return (
      d.isSameOrAfter(unMesAntes, "day") &&
      d.isSameOrBefore(limiteSuperior, "day")
    );
  }
  return d.isSameOrBefore(hoy, "day");
};


const validateDateCoherence = (campo) => {
  return (val) => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    const esValida = moment(val, "DD/MM/YYYY", true).isValid();
    const fromDate = filtro.value.fechaDesde;
    const hasta = filtro.value.fechaHasta;

    if (!fromDate
 && !hasta) return true;

    if (campo === 'desde' && !val && hasta) {
      return "Debe ingresar la Fecha Desde";
    }

    if (campo === 'hasta' && !val && fromDate
) {
      return "Debe ingresar la Fecha Hasta";
    }

    if (!regex.test(val) || !esValida) {
      return "La fecha ingresada es incorrecta. Formato requerido: dd/mm/yyyy";
    }

    const desdeMoment = moment(fromDate, "DD/MM/YYYY", true);
    const hastaMoment = moment(hasta, "DD/MM/YYYY", true);

    if (desdeMoment.isValid() && hastaMoment.isValid()) {
      if (desdeMoment.isAfter(hastaMoment)) {
        return campo === 'desde'
          ? "La Fecha Desde no puede ser mayor que la Fecha Hasta"
          : "La Fecha Hasta no puede ser menor que la Fecha Desde";
      }
    }

    return true;
  };
};
const validateNoFutureDate = (val: string) => {
  const date = moment(val, 'DD/MM/YYYY', true);
  const today = moment();

  if (!date.isValid()) return true;
  if (date.isAfter(today)) return 'La fecha no puede ser mayor a hoy';

  return true;
};
const isSearchDisabled = computed(() => {
  const valDesdeCoherence = validateDateCoherence('desde')(filtro.value.fechaDesde);
  const valHastaCoherence = validateDateCoherence('hasta')(filtro.value.fechaHasta);
  const valDesdeNoFuture = validateNoFutureDate(filtro.value.fechaDesde);
  const valHastaNoFuture = validateNoFutureDate(filtro.value.fechaHasta);

  return (
    valDesdeCoherence !== true ||
    valHastaCoherence !== true ||
    valDesdeNoFuture !== true ||
    valHastaNoFuture !== true
  );
});


const inputFrom = ref();
const inputTo = ref();

watch(
  [() => filtro.value.fechaDesde, () => filtro.value.fechaHasta],
  () => {
    if (inputFrom.value) inputFrom.value.validate();
    if (inputTo.value) inputTo.value.validate();
  }
);

watch(
  () => filtro.value.fechaHasta,
  (newToDate) => {
    if (!newToDate) return;

    const toDate = moment(newToDate, "DD/MM/YYYY", true);
    const fromDate = moment(filtro.value.fechaDesde, "DD/MM/YYYY", true);
    const oneMonthAgo = moment(toDate).subtract(1, "months");
    const today = moment();

    if (!fromDate.isValid() || fromDate.isAfter(toDate) || fromDate.isAfter(today)) {
      filtro.value.fechaDesde = oneMonthAgo.format("DD/MM/YYYY");
    }
  }
);

watch(
  () => mensajeriaSeguimiento.value.estadoRecibido,
  async (value) => {
    if (value == 'Devuelto') {
      listadoDevolucionesMensajeria.value = listadoDevoluciones.value.filter((item) => [4, 5, 13, 14].includes(item.value))
    } else if (value == 'Entrega Exitosa') {
      listadoDevolucionesMensajeria.value = [{ label: 'EFECTIVA', value: 'EFECTIVA' }]
    }
  }
);

const handlePageChange = async (page: number) => {
  currPage.value = page <= 0 ? 0 : page - 1;
  await getData();
}

const handleRowsPerPageChange = async (rowsPerPage: any) => {
  pageSize.value = rowsPerPage;
  await getData();
}

const filterFn = (val, update, abort) => {
  if (val === '') {
    update(() => {
      optionsCode.value = opCodeJuz.value
    })
    return
  }

  update(() => {
    const needle = val.toLocaleLowerCase()
    optionsCode.value = opCodeJuz.value.filter(v => v.label.toLocaleLowerCase().indexOf(needle) > -1)
  })
}

const filteredDataTable = ref([
])

const exportXLSX = () => {
  var dataFinal = selectedRows.value.length > 0 ? selectedRows.value : facData.value
  let ws_data = [
    columns.value.map((col) => col.label),
    ...dataFinal.map((row) =>
      columns.value.map((col) => {
        let value = typeof col.field === "function"
          ? col.field(row)
          : row[col.field === void 0 ? col.name : col.field];
        // check if col.format is a function and apply it
        if (col.format && typeof col.format === "function") {
          value = col.format(value);
        }
        return value;
      })
    ),
  ];

  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

  try {
    XLSX.writeFile(wb, `Listado Envios`);
    toast.success("Archivo descargado con exito!");
  } catch (error) {
    toast.error("El navegador rechazó la descarga del archivo...");
  }
};

async function getTipoDevoluciones() {
  const response = await sgdeaAxios.get('/envios/tipo_devoluciones')
  listadoDevoluciones.value = response.data.map((item) => { return { label: item.valor, value: item.id } })
  listadoDevolucionesMensajeria.value = listadoDevoluciones.value.filter((item) => [4, 5, 13, 14].includes(item.value))
}

const toggleReturnConfirmation = () => {
  showReturnConfirmation.value = !showReturnConfirmation.value
}
const updateSelectedCases = async () => {
  try {
    const response = await sgdeaAxios.get(`/envios/mailing/devolucion/${selectedRows.value[0].idCaso}/${selectedRows.value[0].idFlujo.id}`)

    await crearTrazabilidad(({
      proceso: `${selectedRows.value[0].idCaso}`,
      secuencia: selectedRows.value[0].radicadoSalida,
      estado: 'Devuelto',
      descripcion: `Usuario:${auth.$state.userInfo.name} Motivo: Desconocido`,
      comentario: 'Devolución exitosa',
      nombre: auth.$state.userInfo.name,
      accion: `${auth.$state.userInfo.name} Ha devuelto el caso ${selectedRows.value[0].radicadoSalida}`,
      tramite: "Trámite",
    }))

    toast.success(selectedRows.value.length === 1 ? 'Su caso ha sido devuelto exitosamente.' : 'Sus casos han sido devueltos exitosamente.')

  } catch (error) {
    toast.error('Ha ocurrido un error')
  } finally {
    toggleReturnConfirmation()
    await getData()
    getFilterData()
    getTipoDevoluciones();
    filtro.value.usuarioId = useAuthStore().$state.userInfo.userid
  }
}
function determineModalCourier() {
  if (seguimientoCourierSelection.value == "Devuelto") {
    showModalSeguimientoCourierDevuelto.value = true
  } else {
    showModalSeguimientoCourierEntregado.value = true
  }
}

const download = async (rowEditData) => {
  try {
    const { data } = await sgdeaAxios.get(
      `/radicados/consultar_documento/${rowEditData.id}`
    );
    const byteCharacters = atob(data.base64x);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = rowEditData.nombre;

    link.click();

    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    toast.error('Ha ocurrido un error')
  }
};

function csvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

const exportCSV = () => {
  var dataFinal = selectedRows.value.length > 0 ? selectedRows.value : facData.value
  const content = [
    columns.value.map((col) => csvValue(col.label, undefined, undefined)),
    ...dataFinal.map((row) =>
      columns.value.map((col) =>
        csvValue(
          typeof col.field === "function"
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format,
          row
        )
      )
    ),
  ].join("\r\n");

  const status = exportFile(`Listado Envios.csv`, content, "text/csv");

  if (status !== true) {
    toast.error("El navegador rechazó la descarga del archivo...");
  } else {
    toast.success("Archivo descargado con exito!");
  }
};

const filterFnCorreos = (val, update, abort) => {
  if (val.length < 1) {
    abort()
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    optionsCorreos.value = correosPositiva.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}

const reportSuccess = async () => {

  if (await selectModal.value.validate()) {
    if (emailList.value.length > 0) {
      if (inputFormat.value == 'xlsx') {
        //EXCEL
        var dataFinal = selectedRows.value.length > 0 ? selectedRows.value : facData.value;
        let ws_data = [
          columns.value.map((col) => col.label),
          ...dataFinal.map((row) =>
            columns.value.map((col) => {
              let value = typeof col.field === "function"
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field];
              // check if col.format is a function and apply it
              if (col.format && typeof col.format === "function") {
                value = col.format(value);
              }
              return value;
            })
          ),
        ];

        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

        try {
          let binaryData = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });
          let data = new Uint8Array(binaryData.length);
          for (let i = 0; i != binaryData.length; ++i) {
            data[i] = binaryData.charCodeAt(i) & 0xFF;
          }
          let blob = new Blob([data], { type: "application/octet-stream" });
          let file = new File([blob], `Listado Envios.xlsx`);
          const formdata = new FormData();
          formdata.append('email', emailList.value.join(','))
          formdata.append("archivo", file);
          const headers = {
            "Access-Control-Allow-Origin": "*",
            accept: "*",
            "Content-Type": "multipart/form-data",
            "Content-Transfer-Encoding": "BINARY"
          };
          var enviarCorreo = await sgdeaAxios.post("/tutela/envioCSV", formdata, { headers })
          if (enviarCorreo) {
            toast.success(`El reporte de Envios ha sido enviado con éxito a los correos  ingresados.`)
            sendReportModal.value = false
          }

        } catch (error) {
          toast.error("Hubo un error al generar el archivo...")
        }
      } else {
        ////CSV
        var dataFinal = selectedRows.value.length > 0 ? selectedRows.value : facData.value;
        const content = [
          columns.value.map((col) => csvValue(col.label, undefined, undefined)),
          ...dataFinal.map((row) =>
            columns.value.map((col) =>
              csvValue(
                typeof col.field === "function"
                  ? col.field(row)
                  : row[col.field === void 0 ? col.name : col.field],
                col.format,
                row
              )
            )
          ),
        ].join("\r\n");

        try {
          let blob = new Blob([content], { type: "text/csv" });
          let file = new File([blob], `Listado Envios.csv`);
          const formdata = new FormData();
          formdata.append('email', emailList.value[0])
          formdata.append("archivo", file);
          const headers = {
            "Access-Control-Allow-Origin": "*",
            accept: "*",
            "Content-Type": "multipart/form-data",
            "Content-Transfer-Encoding": "BINARY"
          };
          var enviarCorreo = await sgdeaAxios.post("/tutela/envioCSV", formdata, { headers })
          if (enviarCorreo) {
            toast.success(`El reporte de Envios ha sido enviado con éxito a los correos  ingresados.`)
            sendReportModal.value = false
          }

        } catch (error) {
          toast.error("Hubo un error al generar el archivo...")
        }
      }

    } else {
      toast.error("Debe ingresar un correo electrónico válido para continuar")
    }
  } else {
    toast.error("Para poder continuar con el proceso debe seleccionar un formato")
  }
};

</script>
