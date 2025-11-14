<template>
  <main class="q-py-md">
    <div class="tw-flex tw-justify-between tw-pt-4">
      <h1 class="tw-text-3xl tw-font-bold">Factura Electrónica Manual</h1>
      <q-btn class="tw-w-52 tw-h-10 flex" color="primary" @click="load = !load">
        Carga de Facturas
      </q-btn>
    </div>
    <q-form ref="formLoad" v-if="load == true">
      <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
        <div class="col row">
          <p class="tw-text-2xl tw-font-bold">Adjunte de Documento</p>
        </div>

        <div class="tw-mt-2">
          <div class="row q-col-gutter-md q-pb-md q-px-md">
            <div class="col-12">
              <label class="tw-w-full">

                <FileLoader v-model="loadDocument" class="tw-w-full" accept-file="xls, xlsx"
                  :max-file-size="8 * 1024 * 1024" max-file-size-label="8" :max-files="1" @rejected="rejectedFiles" />
              </label>
            </div>
          </div>
        </div>
      </q-card>
      <div class="tw-flex tw-justify-center">
        <q-btn icon="upload" @click="uploadExcelFile" label="Cargar Archivo" text-color="white" style="width: 240px"
          color="primary" class="tw-rounded-xl tw-h-12 tw-p-2 tw-self-center" />
      </div>

    </q-form>
    <q-card flat>
      <q-expansion-item expand-separator default-opened class="q-bg-white q-mt-lg">
        <template v-slot:header>
          <div class="col row">
            <b class="tw-text-lg">Filtrar Por</b>
          </div>
        </template>
        <q-form>
          <div class="row q-px-md">
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">

              <label class="q-px-md tw-text-label">Fecha envío inicial
                <q-input :rules="[]" name="fechaInicial" outlined label="dd / mm / yyyy"
                  v-model="filtro.fechaEnvioInicial" dense>
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="filtro.fechaEnvioInicial" mask="DD/MM/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </label>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <label class="q-px-md tw-text-label">Fecha envío final
                <q-input :rules="[]" name="fechaFinal" outlined label="dd / mm / yyyy"
                  v-model:model-value="filtro.fechaEnvioFinal" dense>
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model:model-value="filtro.fechaEnvioFinal" mask="DD/MM/YYYY" :options="optionsDate"
                          today-btn>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </label>
            </div>
            <div class=" col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <label class="q-px-md tw-text-label">Tipo documento
                <q-select outlined label="Inserte" dense emit-value v-model="filtro.tipoDocumento"
                  :options="opTipodocumento" />
              </label>
            </div>
            <div class="col-12">
              <label class="q-px-md tw-text-label">Número Factura o Nit adquiriente
                <q-input v-model="filtro.numeroFacturaNitAdquiriente" type="search" dense label="Inserte" outlined
                  class="tw-rounded-lg" :rules="[v => maxLengthInput(12, v), onlyNumbers]">
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </label>
            </div>
          </div>

          <div class="tw-flex tw-justify-center tw-items-center tw-py-5 tw-gap-6">
            <q-btn label="Limpiar Filtros" type="reset" style="width: 240px" text-color="black" color="accent"
              class="tw-rounded-xl tw-h-12" @click="toClearFilters" />

            <q-btn label="Buscar" @click="filter" text-color="white" style="width: 240px" color="primary"
              class="tw-rounded-xl tw-h-12 tw-p-2" />
          </div>
        </q-form>
      </q-expansion-item>
    </q-card>

    <div class="tw-flex tw-justify-end">
      <div class="tw-grid text-right tw-place-items-end">
        <q-btn class="tw-w-60 tw-h-10 flex tw-float-right" icon-right="download" text-color="grey-7" color="white"
          @click="descargaPlantilla">
          <q-avatar size="24px" square>
            <img v-lazy :data-url="excelIcon" alt="docIcon" />
          </q-avatar>
          <span class="tw-px-5">Plantilla para cargue</span>

        </q-btn>
      </div>
    </div>

    <q-card class="q-py-md q-mt-lg" flat>
      <div>
        <p class="tw-text-lg text-weight-bold q-mx-lg">
          Resultados de la Búsqueda
        </p>
        <Table class="q-pa-md" :TABLE_HEADER="columns" :TABLE_BODY="filteredManual" key-id="id"
          :TABLE_TOTAL_ROWS="dataTableTotalRows" :pages-number="pagesNumber"
          @handle-edit-data="(id: any) => router.push(`/facturacion/facturas-manual/detalles/${id}/infoGeneral`)"
          select="multiple" @handlePageChange="handlePageChange" @handleRowsPerPageChange="handleRowsPerPageChange"
          msg-no-data="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente" />
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
    <ExcelModalError
  v-model="showErrorModal"
  :invalid-documents="invalidDocuments"
/>
    <ExcelModal v-model="fileErrorModal" title="Excel inválido" :errors="excelErrors" :total-errors="totalErrors" />
  </main>
</template>

<script lang="ts" setup>
import excelIcon from "../../../assets/excel.svg";
import moment from "moment";
import FileLoader from "src/components/FormFields/FileLoader.vue";
import ExcelModal from "src/components/Modal/ExcelModal.vue";
import { dateForOptions } from "src/helpers/formtDate";
import { toast } from "src/helpers/toast";
import { maxLengthInput, onlyNumbers } from "src/helpers/validations";
import { sgdeaAxios } from "src/services";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import Table from "./Table.vue";
import ExcelModalError from "./ExcelModalError.vue";

const showErrorModal = ref(false);
const invalidDocuments = ref<any[]>([]);
const router = useRouter();
const filtro = ref({
  fechaEnvioInicial: moment().add(-1, 'month').format('DD/MM/YYYY'),
  fechaEnvioFinal: moment().format('DD/MM/YYYY'),
  tipoDocumento: "Todos",
  numeroFacturaNitAdquiriente: ""
});


const opTipodocumento = ref([
  'Todos',
  'Factura',
  'Nota Crédito',
  'Nota Débito'
])

const optionsDate = (date) => {
  return date > dateForOptions(filtro.value.fechaEnvioInicial)
}

const dataTableTotalRows = ref(0);
const showModal = ref(false);
const fileErrorModal = ref(false);
const load = ref(false);
const allFacturasManual = ref([]);
const filteredManual = ref([])
const loadDocument = ref()
const currPage = ref(0)
const pageSize = ref(20)
const pagesNumber = ref(1);
const excelErrors = ref([]);
const totalErrors = ref(0);
const progressValue = ref(0);
const series = ref([]);
const seriesToday = ref([]);
const savedEstadosAmount = ref({})


const columns = [
  {
    name: "numeroRadicado",
    label: "Número de radicado",
    field: "secuencia",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaRadicado",
    label: "Fecha de radicado",
    field: "fechaExpedicion",
    sortable: true,
    align: "center",
    format: (value) => moment(value).add(1, 'day').format('DD/MM/YYYY')
  },
  {
    name: "prefijoNumeroFactura",
    label: "Prefijo y número de factura",
    field: (row) =>(row?.prefijoFactura|| '-') + "  " + (row?.numeroFactura || '-'),
    sortable: true,
    align: "center",
  },
  {
    name: "adquiriente",
    label: "Adquiriente",
    field: (row)=>"NIT"+" "+(row.nitAdquiriente),
    sortable: true,
    align: "center",
  },
  {
    name: "estado",
    label: "Estado",
    field: "estado",
    sortable: true,
    align: "center",
  },
  {
    name: "trazabilidad",
    label: "Trazabilidad",
    field: "trazabilidad",
    sortable: true,
    align: "center",
  },
  {
    name: "documentos",
    label: "Documentos",
    field: "documentos",
    sortable: true,
    align: "center",
  },
];

const chartOptions = ref({
  chart: {
    type: 'donut',
  },
  labels: [],
  legend: {
    show: false,
  },
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          total: {
            show: true,
            showAlways: true
          }
        }
      }
    }
  }
});

const chartOptionsToday = ref({
  chart: {
    type: 'donut',
  },
  labels: [],
  legend: {
    show: false,
  },
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          total: {
            show: true,
            showAlways: true
          }
        }
      }
    }
  }
});

onMounted(async () => {
  const day = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const fecha = `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}`;
  filtro.value.fechaEnvioFinal = fecha;

  if (month === 1) {
    filtro.value.fechaEnvioInicial = `${day < 10 ? `0${day}` : day}/12/${year - 1}`;
  } else {
    filtro.value.fechaEnvioInicial = `${day < 10 ? `0${day}` : day}/${month - 1 < 10 ? `0${month - 1}` : month - 1}/${year}`;
  }

  chartOptions.value.labels.push('Facturas Administrativas')
  chartOptions.value.labels.push('Facturas Emision Manual')
  chartOptions.value.labels.push('Facturas Cuentas de Cobro')
  series.value.push(2)
  series.value.push(8)
  series.value.push(10)

  chartOptionsToday.value.labels.push('Emisiones Hoy')
  seriesToday.value.push(2)

  await getAllFacturasManual();
});

setTimeout(() => {
  progressValue.value = 76;
}, 300);

const handlePageChange = async (page: number) => {
  currPage.value = page <= 0 ? 0 : page - 1;
  await getAllFacturasManual();
}

const handleRowsPerPageChange = async (rowsPerPage: any) => {
  pageSize.value = rowsPerPage;
  await getAllFacturasManual();
}

async function getAllFacturasManual() {
  const getManuales = await sgdeaAxios.get(`/facManual/getReports?page=${currPage.value}&size=${pageSize.value}&sortBy=numeroFactura`)
  // Traer facturas manuales aqui
  dataTableTotalRows.value = getManuales.data.totalElements;
  pagesNumber.value = getManuales.data.totalPages;
  allFacturasManual.value = getManuales.data.content;
  filteredManual.value = allFacturasManual.value.map((fm, index) => ({
    ...fm,
  }));

  //Guardarlas aqui
}
async function uploadExcelFile() {
  const formData = new FormData();
  if (loadDocument.value.length === 0) {
    toast.error('Debe adjuntar un archivo');
    return;
  }

  formData.append('file', loadDocument.value);
  try {
    showModal.value = true;
    const response = await sgdeaAxios.post('/facManual/cargueExcelFacManual', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    invalidDocuments.value = [];

    if (response.data.documentosInvalidos && response.data.documentosInvalidos.length > 0) {
      invalidDocuments.value.push(...response.data.documentosInvalidos);
    }

    if (response.data.documentosInconsistentes && response.data.documentosInconsistentes.length > 0) {
      invalidDocuments.value.push(...response.data.documentosInconsistentes);
    }

    if (response.data.documentosEmitidos && response.data.documentosEmitidos.length > 0) {
      const docsEmitidosConError = response.data.documentosEmitidos.filter(doc => doc.errores && doc.errores.length > 0);
      if (docsEmitidosConError.length > 0) {
        invalidDocuments.value.push(...docsEmitidosConError);
      }
    }

    if (response.data.documentosEnValidacion && response.data.documentosEnValidacion.length > 0) {
      const docsEnValidacionConError = response.data.documentosEnValidacion.filter(doc => doc.errores && doc.errores.length > 0);
      if (docsEnValidacionConError.length > 0) {
        invalidDocuments.value.push(...docsEnValidacionConError);
      }
    }

    if (invalidDocuments.value.length > 0) {
      showErrorModal.value = true;
    } else {
      toast.success('Se han cargado las facturas correctamente');
    }

    load.value = false;
    loadDocument.value = null;
    await getAllFacturasManual();
  } catch (error) {
    fileErrorModal.value = true;
    load.value = false;
    loadDocument.value = null;
    excelErrors.value = error.response.data.celdasConErrores;
    totalErrors.value = error.response.data.totalRegistrosConErrores;
  } finally {
    showModal.value = false;
  }
}
function toClearFilters(): void {
  filtro.value = {
    fechaEnvioInicial: moment().add(-1, 'month').format('DD/MM/YYYY'),
    fechaEnvioFinal: moment().format('DD/MM/YYYY'),
    tipoDocumento: "Todos",
    numeroFacturaNitAdquiriente: ""
  }

  filteredManual.value = allFacturasManual.value;
}

watch(
  () => filtro.value.fechaEnvioInicial,
  (value) => {
    filtro.value.fechaEnvioFinal = ''
  }
);

const filter = async () => {
  const response = await sgdeaAxios.get("/facManual/listadoRegistroExcelFacturaManual", {
    params: {
      startDate: filtro.value.fechaEnvioInicial,
      endDate: filtro.value.fechaEnvioFinal,
      tipoDoc: filtro.value.tipoDocumento,
      numeroDocumento: filtro.value.numeroFacturaNitAdquiriente,
      size: pageSize.value,
      page: currPage.value
    }
  });
};

const descargaPlantilla = () => {
  window.location.href = '/documents/estructuraPlanoFE.xlsx';
};

function showNotif(title: string) {
  toast.error(title);
}

const rejectedFiles = (error) => {
  if (error.some((it) => it.failedPropValidation === "max-file-size")) {
    showNotif("El peso permitido es hasta 8MB.");
  }
  if (error.some((it) => it.failedPropValidation === "max-files")) {
    showNotif("Solo se pueden adjuntar 30 archivos.");
  }
  if (error.some((it) => it.failedPropValidation === 'accept')) {
    showNotif('Formato inválido, los formatos permitidos son (xls, xlsx).')
  }
};

</script>

<style>
label {
  padding: 0px 10px;
}

.radiusCircleBars {
  border-radius: 1rem;
  border-top-right-radius: 3rem;
  border-bottom-left-radius: 2rem;
}

.chart-container {
  position: relative;
  /* margin: auto; */
  width: 369px;
  height: 268px;
}
</style>
