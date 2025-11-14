<template>
  <div class="q-my-md">
    <div class="tw-flex tw-justify-between tw-items-center">
      <span class="tw-font-bold tw-text-3xl tw-my-5">
        Seguimiento Envíos - Por Enviar
      </span>
    </div>
    <q-card class="tw-rounded-xl tw-px-5 tw-pt-8 tw-pb-2" flat bordered>
      <div class="row q-col-gutter-lg q-pb-sm q-px-md">
        <div v-if="filtro.tipoTramite == 'Tutelas' || !filtro.tipoTramite"
          class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <span class="text-weight-bold">Fecha Desde</span>
          <q-input :rules="[]" name="fechaInicial" outlined label="dd/mm/yyyy" v-model="filtro.fechaInicial" dense
            mask="##/##/####">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="filtro.fechaInicial" :options="opForInicial" mask="DD/MM/YYYY">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Cerrar" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div v-if="filtro.tipoTramite == 'Tutelas' || !filtro.tipoTramite"
          class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <span class="text-weight-bold">Fecha Hasta</span>
          <q-input :rules="[]" name="fechaFinal" outlined label="dd/mm/yyyy" v-model="filtro.fechaFinal" dense
            mask="##/##/####">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="filtro.fechaFinal" mask="DD/MM/YYYY" :options="opForFinal">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Cerrar" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div v-if="filtro.tipoTramite == 'Tutelas' || !filtro.tipoTramite"
          class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <span class="text-weight-bold">Punto de Radicación</span>
          <q-select :rules="[]" name="tipoDoc" outlined v-model="filtro.puntoRadicacion" label="Seleccione" dense
            map-options emit-value :options="puntosRadicacionOp" @update:model-value="filterUsers" />
        </div>

        <div v-if="filtro.tipoTramite == 'Tutelas' || !filtro.tipoTramite"
          class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <span class="text-weight-bold">Usuario</span>
          <q-select :rules="[]" name="tipoDoc" outlined v-model="filtro.usuario" label="Seleccione" dense map-options
            emit-value :options="usuariosOptions" />
        </div>
      </div>

      <section class="tw-flex tw-justify-center tw-mt-12 tw-pb-3" v-if="activeChart">
          <div class="chart-container">
          <!-- Chart principal: bandeja por tipo de envío -->
          <Chart ref="chartRef" :config="config" @click="changeBandeja" />
        </div>

        <div class="chart-container" :key="estadosKey" v-if="selectedBandeja">
          <!-- Chart secundario: estados de la bandeja -->
          <Chart ref="chartRefStatus" :config="configEstados" @click="changeFiltro" />
        </div>
      </section>

      <div class="tw-flex tw-justify-center tw-items-center tw-my-5 tw-gap-6">
        <q-btn label="Limpiar" type="reset" style="width: 240px" text-color="black" color="accent" @click="cleanFilters"
          class="tw-rounded-xl tw-h-12" />

        <q-btn type="submit" label="Buscar" text-color="white" style="width: 240px" color="primary"
          @click="getData(0, 20)" class="tw-rounded-xl tw-h-12 tw-p-2" />
      </div>
    </q-card>

    <q-card v-if="showDataBandeja" class="tw-rounded-xl q-mt-lg tw-p-5" flat bordered>
      <div class="flex items-center justify-between q-px-md q-mb-sm row col-12">
        <span class="text-weight-bold text-h6" style="color: #2c3948">{{
          filteredDataTable.length > 0
            ? "Por Enviar"
            : "Resultado de la Búsqueda"
        }}</span>

        <div class="tw-flex tw-items-center tw-gap-10">
          <q-input outlined dense rounded v-model="search" label="Buscador" class="tw-w-[300px]"
            @update:model-value="generalFilter">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <div class="tw-flex tw-items-center tw-gap-2.5">
            <div v-if="estadoActual == 3">
              <q-btn :disable="selectedRows.length > 0 ? false : true" color="secondary" label="Enviar"
                style="width: 100px; height: 40px; border-radius: 8px" no-caps icon="send" @click="enviarMensajeria" />
              <q-btn color="secondary" class="tw-ml-3" outline label="Descargar"
                style="width: 100px; height: 40px; border-radius: 8px" no-caps @click="exportXLSXMen" />
              <q-btn color="primary" :disable="selectedRows.length > 0 ? false : true" class="tw-ml-3" label="Anular"
                style="width: 100px; height: 40px; border-radius: 8px" no-caps @click="anularModal = true" />
            </div>
            <div v-if="estadoActual == 2">
              <q-btn :disable="selectedRows.length > 0 ? false : true" color="secondary" label="Enviar"
                style="width: 100px; height: 40px; border-radius: 8px" no-caps icon="send"
                @click="pushDataForSendGuide" />
              <q-btn color="" class="tw-ml-3" style="
                  padding-left: 15px !important;
                  padding-right: 15px !important;
                  height: 40px;
                  border-radius: 8px;
                " no-caps @click="showLoadModal = true">
                <q-img v-lazy :data-url="excel" alt="excel" width="24px" height="24px" class="tw-mr-3" />
                <span class="text-secondary">Cargar Excel</span>
              </q-btn>
              <q-btn color="secondary" class="tw-ml-3" outline label="Descargar"
                style="width: 100px; height: 40px; border-radius: 8px" no-caps @click="findExcelCorr" />
              <q-btn color="primary" :disable="selectedRows.length > 0 ? false : true" class="tw-ml-3" label="Anular"
                style="width: 100px; height: 40px; border-radius: 8px" no-caps @click="anularModal = true" />
            </div>

            <q-btn v-if="estadoActual == 1" color="orange-7" class="tw-px-4"
              :disable="selectedRows.length > 0 ? false : true" label="Recibir por Correspondencia"
              style="width: 230px; height: 30px; border-radius: 8px" no-caps @click="receiveCorrespondencia" />
          </div>
        </div>
      </div>
      <TableBandeja :buscar="buscar" class="full-width" ref="bandejaTable" :key-id="'id'"
        :TABLE_TOTAL_PAGES="dataTableTotalPages" :TABLE_HEADER="REPORTES_HEADER" :TABLE_BODY="filteredDataTable"
        :first-content-id="firstContentId" select="multiple" @update:itemSelected="selectRows"
        msg-no-data="No se encontraron resultados con los filtros aplicados, valide y consulte nuevamente"
        @update:filas="getPageFilas" @update:pages="getPageFilas" @handlePageChange="handlePageChange"
        @handleRowsPerPageChange="handleRowsPerPageChange" @handleEditData="showModalDocs" />
    </q-card>
    <template v-if="reportModal">
      <LoadingModal @load-complete="sendReportModal = true" />
    </template>
    <template>
      <q-dialog v-model="sendReportModal" persistent transition-show="scale" transition-hide="scale"
        transition-duration="300">
        <q-card class="tw-p-10">
          <q-card-section class="tw-bg-white">
            <div class="full-width row tw-justify-center tw-items-center">
              <img v-lazy :data-url="mail" alt="email" />
            </div>
          </q-card-section>
          <q-card-section>
            <p class="tw-font-bold tw-text-2xl tw-text-center">
              Enviar Reporte al Correo
            </p>
            <p class="tw-font-bold tw-mt-3 tw-ms-4 tw-mb-1">Formato *</p>
            <q-form ref="selectModal">
              <q-select v-model="inputFormat" :rules="[inputRequired]" outlined map-options emit-value
                label="Seleccione" :options="[
                  { value: 'xlsx', label: 'Excel' },
                  { value: 'csv', label: 'CSV' },
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
              class="col-5 q-ma-none q-py-md" style="width: 200px; height: 60px" />

            <q-btn color="secondary" label="Si" v-on:click="reportSuccess" class="col-5 tw-bg-primary q-ma-none q-py-md"
              style="width: 200px; height: 60px" />
          </div>
        </q-card>
      </q-dialog>
      <q-dialog v-model="sendGuiaModal" persistent transition-show="scale" transition-hide="scale"
        transition-duration="300">
        <q-card class="tw-p-10" style="width: 1200px; max-width: 80vw">
          <q-card-section>
            <p class="tw-font-bold tw-text-2xl">Envío:</p>
            <div class="tw-mt-2">
              <div class="row q-col-gutter-md q-pb-md">
                <div class="col-12">
                  <q-scroll-area style="height: 350px">
                    <div class="q-py-xs">
                      <q-form ref="sendGuiaForm" greedy>
                        <q-table hide-pagination :rows="rowsEnvioguias" :columns="columnsEnviosGuias"
                          class="my-sticky-header-table" row-key="name">
                          <template v-slot:body-cell-courier="props">
                            <q-td key="courier" :props="props">
                              {{ optionsEstadoEnvio[0].label }}
                            </q-td>
                          </template>
                          <template v-slot:body-cell-numeroGuia="props">
                            <q-td key="courier" :props="props">
                              <q-input :rules="[inputRequired]" v-model="props.row.numeroGuia"
                                :error="!!props.row.error" :error-message="props.row.error" class="tw-mt-2 tw-w-[200px]"
                                outlined label="Número de Guía" dense @update:model-value="validateGuia(props.row)">
                              </q-input>

                            </q-td>
                          </template>
                        </q-table>
                      </q-form>
                    </div>
                  </q-scroll-area>
                </div>
              </div>
            </div>
          </q-card-section>

          <div class="row justify-center q-mt-md">
            <q-btn color="secondary" flat label="Cancelar" v-on:click="sendGuiaModal = false"
              class="col-5 q-ma-none q-py-md" style="width: 200px; height: 60px" />

            <q-btn color="secondary" label="Enviar" v-on:click="sendGuia" class="col-5 tw-bg-primary q-ma-none q-py-md"
              style="width: 200px; height: 60px" />
          </div>
        </q-card>
      </q-dialog>
      <Modal v-model="confirmCancelarModalEnvioCorreo" title="Confirmación"
        text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
        :is-success="false" cancel-button text-button-cancel="No" text-button="Si"
        @handleAccept="cancelarEnviarModal" />
      <q-dialog full-width v-model="modalDocs">
        <q-card class="q-pa-xl tw-w-[3000px]">
          <a @click="modalDocs = false" class="tw-text-primary" style="text-decoration: none">
            <q-icon size="1.5em" name="chevron_left" color="primary" />
            <b> Volver </b>
          </a>
          <Table :TABLE_BODY="listDocs" :TABLE_HEADER="fileColumns" icon="download" isSecondIcon isThirdIcon
            secondIcon="delete" thirdIcon="print" :loading="loading" is-selection="none" @handleEditData="download"
            @handleThirdIcon="print" :key-id="'id'" />
        </q-card>
      </q-dialog>
      <cargaMasivaModal :showModal="showLoadModal" @closeModal="showLoadModal = false" />
      <q-dialog v-model="anularModal">
        <q-card :class="['tw-px-10 tw-py-6']" style="width: 700px; max-width: 80vw">
          <h3 class="text-bold text-grey-7 tw-text-2xl tw-flex-1 q-py-md">
            Anular
          </h3>

          <q-form ref="anularForm">
            <label class="q-px-md tw-mt-2 tw-text-label">Observación de Anulación *
              <q-input type="textarea" outlined label="Observación" dense emit-value v-model="observacionAnular" :rules="[
                inputRequired,
                (v) => maxLengthInput(1000, v),
                (v) => minLengthInput(10, v),
              ]" />
            </label>
          </q-form>

          <q-card-actions align="center">
            <q-btn flat label="Cancelar" class="tw-w-48 tw-h-12" color="secondary" @click="observacionAnular = ''"
              v-close-popup />
            <q-btn label="Anular" class="tw-w-48 tw-h-12" color="secondary" @click="anularFunct" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Modal from "src/components/Modal/Modal.vue";
import mail from "src/assets/mail.svg";
import TableBandeja from "./Table.vue";
import {
  inputRequired,
  maxLengthInput,
  minLengthInput,
} from "src/helpers/validations";
import {
  formatDateTimeStand,
  fourthFormatDate,
  reverseFormatDate,
} from "src/helpers/formtDate";
import excel from "src/assets/excel.svg";
import LoadingModal from "src/components/Modal/LoadingModal.vue";
import { sgdeaAxios } from "src/services";
import moment from "moment";
import cargaMasivaModal from "./cargaMasivaModal.vue";
import { useMunicipalities } from "src/composables/useVersion";
import * as XLSX from "xlsx";
import { toast } from "src/helpers/toast";
import { useAuthStore } from "src/stores/auth.store";
import Chart from "src/components/Charts/chart_donuts.vue";
import Table from "./AdjuntarDocumentosTable.vue";
import { crearTrazabilidad } from "src/helpers/trazabilidad";

const { getUserInfo } = useAuthStore();
const showLoadModal = ref(false);
const userInfo = ref();
const anularModal = ref();
const confirmCancelarModalEnvioCorreo = ref(false);
const currPage = ref(0);
const pageSize = ref(5);
const anularForm = ref();
const usuariosOptions = ref([]);
const municipioOptions = ref([]);
const dataTableTotalRows = ref();
const loading = ref(false);
const dataTableTotalPages = ref(1);
const observacionAnular = ref(null);
const search = ref();
const selectedRows = ref([]);
const inputFormat = ref("");
const correo = ref();
const emailList = ref([]);
const emailForm = ref();
const selectModal = ref();
const correosPositiva = ref([]);
const optionsCorreos = ref([]);
const activeCorrespondencia = ref(true);
const listadoEstadoEnviosOp = ref();
const bandejaTable = ref();
const sendGuiaModal = ref(false);
const sendGuiaForm = ref();
const modalDocs = ref(false);
const nameDocument = ref();
const listDocs = ref();
const puntosRadicacionOp = ref();
const estadoActual = ref(null);
const firstContentId = ref(null);
const optionsEstadoEnvio = ref([{ label: "472", value: 1 }]);
const numeroGuia = ref("");
const showDataBandeja = ref(false);

const allData = ref();
const activeChart = ref(false);
const seriesTipo = ref([]);
const seriesEstado = ref([]);
const dataDon = ref(0);
const estadosKey = ref(0);
const chartRef = ref(null);
const chartRefStatus = ref(null);
const savedEstadosAmount = ref({});
const selectedBandeja = ref(false);

const dataChart = ref({
  labels: [],
  datasets: [
    {
      label: "Unidades",
      data: [],
      backgroundColor: [
        "rgb(255, 99, 132)", // Red
        "rgb(54, 162, 235)", // Blue
        "rgb(255, 205, 86)", // Yellow
        "rgb(75, 192, 192)", // Teal
        "rgb(153, 102, 255)", // Purple
        "rgb(255, 159, 64)", // Orange
        "rgb(201, 203, 207)", // Grey
        "rgb(255, 99, 71)", // Tomato
        "rgb(255, 140, 0)", // Dark Orange
        "rgb(0, 128, 0)", // Green
        "rgb(0, 0, 255)", // Blue
        "rgb(255, 20, 147)", // Deep Pink
        "rgb(255, 228, 196)", // Bisque
        "rgb(135, 206, 235)", // Sky Blue
        "rgb(240, 230, 140)", // Khaki
        "rgb(128, 0, 128)", // Purple
      ],
      hoverOffset: 4,
    },
  ],
});

const dataChartEstados = ref({
  labels: [],
  datasets: [
    {
      label: "Unidades",
      data: [],
      backgroundColor: [
        "rgb(255, 99, 132)", // Red
        "rgb(54, 162, 235)", // Blue
        "rgb(255, 205, 86)", // Yellow
        "rgb(75, 192, 192)", // Teal
        "rgb(153, 102, 255)", // Purple
        "rgb(255, 159, 64)", // Orange
        "rgb(201, 203, 207)", // Grey
        "rgb(255, 99, 71)", // Tomato
        "rgb(255, 140, 0)", // Dark Orange
        "rgb(0, 128, 0)", // Green
        "rgb(0, 0, 255)", // Blue
        "rgb(255, 20, 147)", // Deep Pink
        "rgb(255, 228, 196)", // Bisque
        "rgb(135, 206, 235)", // Sky Blue
        "rgb(240, 230, 140)", // Khaki
        "rgb(128, 0, 128)", // Purple
      ],
      hoverOffset: 4,
    },
  ],
});

const totalTextPluginEstados = {
  id: "totalText",
  beforeDraw(chart: any) {
    const { ctx, width, height } = chart;
    const total = dataChartEstados.value.datasets[0].data.reduce(
      (sum, value) => sum + value,
      0
    );

    ctx.save();
    ctx.font = "bold 2.5rem Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const text = `${total}`;
    const textWidth = ctx.measureText(text).width;
    ctx.fillText(`${total}`, width / 2 - 5, height / 2);
    ctx.restore();
  },
};

const totalTextPlugin = {
  id: "totalTextPluginEstados",
  beforeDraw(chart: any) {
    const { ctx, width, height } = chart;
    const total = dataChart.value.datasets[0].data.reduce(
      (sum, value) => sum + value,
      0
    );

    ctx.save();
    ctx.font = "bold 2.5rem Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(` ${total}`, width / 2 - 10, height / 2);
    ctx.restore();
  },
};

const chartOptionsTipo = ref({
  chart: {
    type: "donut",
  },
  labels: [],
  legend: {
    show: false,
  },
  plotOptions: {
    pie: {
      customScale: 0.7,
      donut: {
        labels: {
          show: true,
          total: {
            show: true,
            showAlways: true,
          },
        },
      },
    },
  },
});

const config = ref({
  type: "doughnut",
  data: dataChart.value, // Aquí no hay problema, pero si hay errores, usar watchEffect
  options: {
    events: ["mousemove", "mouseout", "click", "touchstart", "touchmove"],
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      totalText: true,
    },
  },
  plugins: [totalTextPlugin],
});

const configEstados = ref({
  type: "doughnut",
  data: dataChartEstados.value,
  options: {
    events: ["mousemove", "mouseout", "click", "touchstart", "touchmove"],
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      totalTextPluginEstados: true,
    },
  },
  plugins: [totalTextPluginEstados],
});

const bandejasCargadas = ref(new Set());

// function handleDataPointSelection(event, chartContext, dataPointIndex) {
//   if (dataPointIndex.selectedDataPoints[0].length) {
//     selectedType.value =
//       chartOptionsTipo.value.labels[dataPointIndex.dataPointIndex];
//   } else {
//     selectedType.value = null;
//   }
//   filterData();
// }

function changeBandeja(event) {
  if (chartRef.value) {
    const chartData = chartRef.value.getChartDataAtEvent(event);
    if (chartData) {
      selectedType.value = chartData.label;
      estadosKey.value++;

      if (bandejasCargadas.value.has(selectedType.value)) {
        updateChartEstados(selectedType.value);
        selectedBandeja.value = true;
        return;
      }
      updateChartEstados(selectedType.value);
      bandejasCargadas.value.add(selectedType.value);
      selectedBandeja.value = true;
    }
  }
  filterData();
}

function changeFiltro(event) {
  const chartData = chartRefStatus.value.getChartDataAtEvent(event);
  if (chartData && chartData.label) {
    selectedState.value = chartData.label;
    estadoActual.value =
      selectedState.value == "Por enviar Courier"
        ? 2
        : selectedState.value == "Por recibir en correspondencia"
          ? 1
          : 3;
  }
  filterData();
}

function updateChartEstados(bandeja) {
  const estados = savedEstadosAmount.value[bandeja] || {};
  dataChartEstados.value.labels = Object.keys(estados);
  dataChartEstados.value.datasets[0].data = Object.values(estados);
  estadosKey.value++;
}

const chartOptionsEstado = ref({
  chart: {
    type: "donut",
  },
  labels: [],
  legend: {
    show: false,
  },
  plotOptions: {
    pie: {
      customScale: 0.7,
      donut: {
        labels: {
          show: true,
          total: {
            show: true,
            showAlways: true,
          },
        },
      },
    },
  },
});

const rowsEnvioguias = ref([]);

const columnsEnviosGuias = ref([
  {
    name: "numeroRadicado",
    align: "center",
    label: "Número de Radicado",
    field: "numeroRadicado",
    sortable: true,
  },
  {
    name: "courier",
    align: "center",
    label: "Courier",
    field: "courier",
    sortable: true,
  },
  {
    name: "nombreDestinatario",
    align: "center",
    label: "Nombre de Destinatario",
    field: "destinatario",
    sortable: true,
  },
  {
    name: "numeroGuia",
    align: "center",
    label: "Número de Guía",
    field: "numeroGuia",
    sortable: true,
  },
]);

const fileColumns = [
  {
    name: "formato",
    label: "Formato",
    field: "formato",
    sortable: false,
    align: "center",
  },
  {
    name: "nombre",
    label: "Nombre del documento",
    field: "nombre",
    sortable: true,
    align: "center",
  },
  {
    name: "fecha",
    label: "Fecha de cargue",
    field: "fecha",
    sortable: true,
    align: "center",
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    sortable: true,
    align: "center",
  },
];

const REPORTES_HEADER = [
  {
    name: "numeroRadicadoSalida",
    label: "Número de Radicado de Salida",
    field: "radicadoSalida",
    sortable: true,
    align: "center",
  },
  {
    name: "destinatario",
    label: "Destinatario",
    field: (row) =>
      row.isCopia ? "Copia: " + row.destinatario : row.destinatario,
    sortable: true,
    align: "center",
  },
  {
    name: "fechaRadicadoSalida",
    label: "Fecha de Radicado de Salida",
    field: (row) => fourthFormatDate(row.fechaRadicadoSalida),
    sortable: true,
    align: "center",
  },
  {
    name: "oficina",
    label: "Oficina",
    field: (row) => row?.usuario?.usuarioRelaciones[0]?.oficina?.nombre ?? '-',
    sortable: true,
    align: "center",
  },
  {
    name: "usuario",
    label: "Usuario",
    field: (row) => row.usuario.firstname + " " + row.usuario.lastname,
    sortable: true,
    align: "center",
  },
  {
    name: "tipoEnvio",
    label: "Tipo de Envío",
    field: "tipoEnvio",
    sortable: true,
    align: "center",
  },
  {
    name: "estado",
    label: "Estado",
    field: (row) => row.estadoEnvios.nombre,
    sortable: true,
    align: "center",
  },
  {
    name: "puntosRadicacion",
    label: "Puntos de Radicación",
    field: (row) => row.puntoRadicacion?.nombrePunto,
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
  {
    name: "trazabilidad",
    label: "Trazabilidad",
    field: "trazabilidad",
    sortable: true,
    align: "center",
  },
];

const columns = ref([
  {
    label: "Destinatario",
    field: "destinatario",
  },
  {
    label: "Número documento",
    field: (row) => "test",
  },
  {
    label: "Dirección",
    field: (row) => "test",
  },
  {
    label: "Teléfono",
    field: (row) => "test",
  },
  {
    label: "Municipio-Departamento",
    field: (row) => "test",
  },
  {
    label: "Número de radicado de salida",
    field: "radicadoSalida",
  },
  {
    label: "Código Dependencia",
    field: (row) => "test",
  },
  {
    label: "ID único de envíos del Gestor",
    field: (row) => "test",
  },
  {
    label: "Número de Guía",
    field: "codigoGuia",
  },
]);

const filtro = ref({
  fechaInicial: "",
  fechaFinal: "",
  puntoRadicacion: "",
  usuario: "",
  tipoEnvio: "",
  estado: "",
  tipoTramite: "",
  identificacion: "",
  tipoDoc: "",
  etapa: "",
  juzgado: "",
  siniestro: "",
  municipio: "",
  departamento: "",
  codigo: "",
});

const selectRows = (data) => {
  selectedRows.value = data;
};

const validateGuia = (row) => {
  // Puedes agregar validaciones adicionales aquí
  if (row.numeroGuia && row.numeroGuia.length < 5) {
    row.error = "El número de guía debe tener al menos 5 caracteres";
  } else {
    row.error = "";
  }
};

const pushDataForSendGuide = () => {
  rowsEnvioguias.value = selectedRows.value.map((item) => ({
    id: item.id,
    numeroRadicado: item.radicadoSalida,
    destinatario: item.isCopia
      ? "Copia: " + item.destinatario
      : item.destinatario,
    courier:
      item.courierEnvios?.nombre && item.courierEnvios?.id
        ? { label: item.courierEnvios?.nombre, value: item.courierEnvios?.id }
        : "",
    numeroGuia: item.codigoGuia,
  }));

  sendGuiaModal.value = true;
};

const sendGuia = async () => {
  if (await sendGuiaForm.value.validate()) {
    try {
      // Validar que todos los números de guía sean únicos y no estén vacíos
      const guias = new Set();
      let hasEmptyFields = false;
      let hasDuplicates = false;

      rowsEnvioguias.value.forEach(row => {
        if (!row.numeroGuia || row.numeroGuia.trim() === '') {
          row.error = "Este campo es obligatorio";
          hasEmptyFields = true;
        } else if (guias.has(row.numeroGuia)) {
          row.error = "Número de guía duplicado";
          hasDuplicates = true;
        } else {
          guias.add(row.numeroGuia);
          row.error = "";
        }
      });

      if (hasEmptyFields) {
        toast.error("Todos los números de guía son obligatorios");
        return;
      }

      if (hasDuplicates) {
        toast.error("Los números de guía deben ser únicos para cada envío");
        return;
      }

      // Preparar los datos para enviar
      const data = rowsEnvioguias.value.map((item) => ({
        id: item.id,
        courier: optionsEstadoEnvio.value.length > 0
          ? optionsEstadoEnvio.value[0].value
          : "Desconocido",
        numeroGuia: item.numeroGuia,
        flujoPrefixes: flujoPrefixes[item.idFlujo?.id] || "N/A"
      }));

      const send = await sgdeaAxios.patch(
        `/envios/comunicacionSeguimiento/envioCourier`,
        data
      );

      if (send.data.exitosos > 0) {
        toast.success("Guardado exitoso");

        // Crear trazabilidad para cada envío exitoso
        const envios = await Promise.all(
          data.map(async (item) => {
            const envio = await sgdeaAxios.get(
              `/envios/obtenerCaso/${item.id}`
            );
            return { ...envio.data, numeroGuia: item.numeroGuia };
          })
        );

        for (const envio of envios) {
          const currentPrefix = flujoPrefixes[envio.idFlujo?.id] || "N/A";
          await crearTrazabilidad({
            proceso: currentPrefix + envio.idCaso,
            secuencia: envio.radicadoSalida,
            estado: "Enviado Courier",
            descripcion: `Usuario:${userInfo.value.name}` +
              `Comentario:El radicado ha sido procesado y enviado por courier correctamente` +
              `Número de Guía:${envio.numeroGuia}`,
            comentario: `El radicado ${envio.radicadoSalida} ha sido enviado exitosamente por courier.`,
            nombre: userInfo.value.name,
            accion: `El radicado ${envio.radicadoSalida} ha sido enviado exitosamente por courier`,
            tramite: "Correspondencia",
          });
        }

        sendGuiaModal.value = false;
        bandejaTable.value.cleanSelect();
        getData(0, 20);
      }

      if (send.data.fallidos > 0) {
        // Manejar los errores mostrándolos en las filas correspondientes
        send.data.subidosFallidos.forEach((fallido) => {
          const index = rowsEnvioguias.value.findIndex(
            (row) => row.id === fallido.id
          );
          if (index !== -1) {
            rowsEnvioguias.value[index].error = fallido.error || "Error al enviar";
          }
        });
        toast.warning(`Algunos envíos no se pudieron procesar: ${send.data.fallidos}`);
      }

    } catch (error) {
      console.error(error);
      // toast.error("Error de red: " + (error.message || "No se pudo completar la operación"));
    }
  } else {
    toast.error(
      "Para continuar, asegúrese de que todos los campos requeridos estén completos"
    );
  }
};

const originalUsers = ref([]);
const facData: any = ref([]);

const cleanFilters = () => {
  for (let key in filtro.value) {
    filtro.value[key] = "";
  }
  setTimeout(() => {
    // @ts-expect-error
    filtro.value.fechaActual = "";
  }, 200);

  activeChart.value = false;
  showDataBandeja.value = false;
  currPage.value = 0;
  search.value = "";
  estadoActual.value = null;
  filteredDataTable.value = [];
  selectedRows.value.length = 0;
};

const addEmail = async () => {
  if (await emailForm.value.validate()) {
    if (emailList.value.includes(correo.value.label)) {
      toast.error("El correo ingresado ya se encuentra en la lista");
    } else {
      emailList.value.push(correo.value.label);
      correo.value = "";
      emailForm.value.reset();
    }
  }
};

const deleteEmail = (email) => {
  emailList.value = emailList.value.filter((item) => item != email);
};

let buscar = ref("");
onMounted(async () => {
  getFilterData();
  filtro.value.fechaFinal = moment().format("DD/MM/YYYY");
  userInfo.value = await getUserInfo();
  //filtro.value.usuario = userInfo.value.userid;
  //filtro.value.puntoRadicacion = userInfo.value.puntoRadicacion;
});

const cancelarEnviarModal = () => {
  emailList.value = [];
  correo.value = "";
  inputFormat.value = "";
  sendReportModal.value = false;
};

const download = async (id) => {
  const { data } = await sgdeaAxios.get(`/radicados/consultar_documento/${id}`);

  if (id) {
    const nameDocument = listDocs.value.find((it) => it.nodeId === id)?.nombre;

    const byteCharacters = atob(data.base64x);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = nameDocument;

    link.click();

    URL.revokeObjectURL(blobUrl);
  }

};

const print = async (id) => {
  try {
    const { data } = await sgdeaAxios.get(
      `/radicados/consultar_documento/${id}`
    );
    if (id) {
      nameDocument.value = listDocs.value.find((it) => it.id === id)?.nombre;
    }
    const byteCharacters = atob(data.base64x);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const blobUrl = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.name = "nombre archivo";
    // iframe.style.display = 'none';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    var doc = iframe.contentDocument || iframe.contentWindow.document;
    var titulo = doc.createElement("title");
    titulo.textContent = "prueba";
    doc.head.appendChild(titulo);
    // Función para manejar el evento afterprint
    function handleAfterPrint() {
      // Eliminar el iframe después de imprimir o cancelar
      document.body.removeChild(iframe);
      window.removeEventListener("afterprint", handleAfterPrint);
    }

    // Agregar evento afterprint para manejar la impresión
    window.addEventListener("afterprint", handleAfterPrint);

    // Esperar a que se cargue el contenido del iframe antes de imprimir
    iframe.onload = function () {
      // Imprimir el contenido del iframe
      iframe.contentWindow.print();
      setTimeout(() => {
        document.querySelector("head title").textContent = "titulo";
      }, 500);
    };
  } catch (error) {
    toast.error("Ha ocurrido un error");
  } finally {
  }
};

async function getFilterData() {
  try {
    const listadoEstadoEnvios = await sgdeaAxios.get(
      "/envios/listadoEstadoEnvios"
    );

    listadoEstadoEnviosOp.value = listadoEstadoEnvios.data
      .filter((item) => item.id <= 3)
      .map((item) => ({
        label: item.nombre,
        value: item.id,
      }));

    const listadoPuntosRadicacion = await sgdeaAxios.get(
      "/correspondencia/puntoRadicacion/listadoActive"
    );

    puntosRadicacionOp.value = listadoPuntosRadicacion.data
      .map((item) => ({
        label: item.nombrePunto,
        value: item.id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    puntosRadicacionOp.value.unshift({ label: "Todos", value: 0 });

    const listadoUsuarios = await sgdeaAxios.get("/usuarios/all");
    originalUsers.value = listadoUsuarios.data;
    usuariosOptions.value = listadoUsuarios.data
      .map((item) => ({
        label: item.firstname + " " + item.lastname,
        value: item.id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  } catch (error) {
    console.error(error);
  }
}

const filterUsers = async (value) => {
  const puntoRadicacionId = value;
  const { userid } = userInfo.value;

  // if (filtro.value.usuarioId !== userid) {
  //   filtro.value.usuarioId = ''
  // }

  usuariosOptions.value = originalUsers.value
    .filter(
      (user) =>
        user.usuarioRelaciones.some(
          (rel) =>
            rel.rol.id === 10 &&
            (puntoRadicacionId === 0 ||
              rel.puntoRadicacion?.id === puntoRadicacionId)
        ) || user.id === userid
    )
    .map((user) => ({
      label: `${user.firstname} ${user.lastname}`,
      value: user.id,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

watch(
  () => filtro.value.departamento,
  async (value) => {
    // @ts-expect-error
    if (value.value) {
      filtro.value.municipio = "";
      // @ts-expect-error
      const { optionsMunicipalities } = await useMunicipalities(value.value);
      municipioOptions.value = optionsMunicipalities.value;
    }
  }
);

async function getData(page, size) {
  selectedBandeja.value = false;
  let params = [];

  const paramMapping = {
    fechaInicial: "fechaDesde",
    fechaFinal: "fechaHasta",
    puntoRadicacion: "puntoRadicacionId",
    usuario: "usuarioId",
    numeroRadicadoSalida: "radicadoSalida",
    tipoEnvio: "tipoEnvio",
    estado: "estadoEnviosId",
  };

  // @ts-expect-error
  activeCorrespondencia.value = filtro.value.estado !== 1;

  // Loop over the mapping and generate parameters
  Object.keys(paramMapping).forEach((key) => {
    if (filtro.value[key]?.value) {
      params.push(`${paramMapping[key]}=${filtro.value[key].label}`);
    } else if (filtro.value[key]) {
      if (key == "fechaInicial" || key == "fechaFinal") {
        params.push(
          `${paramMapping[key]}=${reverseFormatDate(filtro.value[key])}${key == "fechaFinal" ? "T23:59:59" : "T00:00:00"
          }`
        );
      } else {
        const dataFil =
          typeof filtro.value[key] == "string"
            ? filtro.value[key]
            : filtro.value[key];
        params.push(`${paramMapping[key]}=${dataFil}`);
      }
    }
  });

  params.push("bandeja=True");
  let url = `/envios/obtenerGestionEnviosListado?page=${page}&size=${size}`;
  let urlContador = `/envios/obtenerGestionEnviosListado?page=${page}&size=${size}&isCounter=true&bandeja=True`;

  if (params.length) {
    url += `&${params.join("&")}`;
  }

  const contador = await sgdeaAxios.get(urlContador);
  const response = await sgdeaAxios.get(url);

  if (response.data.elementos.length === 0) {
    toast.warning("No se encontraron resultados con los filtros aplicados, valide y consulte nuevamente");
    return;
  }

  chartOptionsTipo.value.labels = [];
  chartOptionsEstado.value.labels = [];
  seriesTipo.value = [];
  seriesEstado.value = [];

  const newSeries = [];
  const newLabels = ['Mensajería', 'Courier'];




  const count = {
    Mensajería: 0,
    Courier: 0,
    estadoMensajeria: 0,
    estadoCorrespondencia: 0,
    estadoCourier: 0,
  };

  response.data.elementos.forEach((element) => {
    if (element.tipoEnvio === "Mensajero") count.Mensajería++;
    if (element.tipoEnvio === "Courier") count.Courier++;
    if (element.estadoEnvios.nombre === "Por recibir en correspondencia") count.estadoCorrespondencia++;
    if (element.estadoEnvios.nombre === "Por enviar Mensajería") count.estadoMensajeria++;
    if (element.estadoEnvios.nombre === "Por enviar Courier") count.estadoCourier++;
  });

  const estadosCount = {};
response.data.elementos.forEach(item => {
  const estado = item.estadoEnvios.nombre;
  if (estado) {
    estadosCount[estado] = (estadosCount[estado] || 0) + 1;
  }
});
savedEstadosAmount.value['Mensajería'] = estadosCount;
savedEstadosAmount.value['Courier'] = estadosCount;
savedEstadosAmount.value['Por recibir en correspondencia'] = estadosCount;
savedEstadosAmount.value['Por enviar Mensajería'] = estadosCount;
savedEstadosAmount.value['Por enviar Courier'] = estadosCount;

  newSeries[0] = count.Mensajería;
  newSeries[1] = count.Courier;

  const allTodo = [
    {
      tipo: "Mensajería",
      series: seriesTipo.value,
      chart: chartOptionsTipo.value,
      count: count.Mensajería,
    },
    {
      tipo: "Courier",
      series: seriesTipo.value,
      chart: chartOptionsTipo.value,
      count: count.Courier,
    },
    {
      tipo: "Por recibir en correspondencia",
      series: seriesEstado.value,
      chart: chartOptionsEstado.value,
      count: count.estadoCorrespondencia,
    },
    {
      tipo: "Por enviar Mensajería",
      series: seriesEstado.value,
      chart: chartOptionsEstado.value,
      count: count.estadoMensajeria,
    },
    {
      tipo: "Por enviar Courier",
      series: seriesEstado.value,
      chart: chartOptionsEstado.value,
      count: count.estadoCourier,
    },
  ];

  activeChart.value = false;

  for (const item of allTodo) {
    updateChartData(item.chart, item.series, item.tipo, item.count);
  }

  setTimeout(() => {
    activeChart.value = true;
  }, 50);

  dataChart.value.labels = [...newLabels];

    dataChart.value.datasets[0].data = [
      ...newSeries,
    ];

    dataDon.value++;

  firstContentId.value = response.data.elementos[0]?.id;
  facData.value = response.data.elementos || response.data.content;
  dataTableTotalRows.value = response.data.totalElementsEstado;
  // Calcula el total de páginas basado en el total de filas y el tamaño de página
  dataTableTotalPages.value = Math.ceil((response.data.totalElementsEstado || facData.value.length) / (size || 20));
  filteredDataTable.value = facData.value;
  allData.value = filteredDataTable.value;
  estadoActual.value = filtro.value.estado;
  selectedRows.value.length = 0;
}

function updateChartData(chartOptions, series, label, countValue) {
  if (countValue > 0) {
    chartOptions.labels = [...chartOptions.labels, label];
    series.push(countValue);
  }
}

const filasGrilla = ref();
const numPageGrilla = ref();

const getPageFilas = async (filas = 20, page = 0) => {
  filasGrilla.value = filas;
  numPageGrilla.value = page;
  let params = [];

  // Define the mapping between filtro.value properties and URL parameters
  const paramMapping = {
    fechaInicial: "startDate",
    fechaFinal: "endDate",
    identificacion: "numeroIdentificacion",
    siniestro: "numerosiniestro",
    usuario: "nombreGestionador",
    juzgado: "idJuzgado",
    etapa: "idEtapaProcesal",
    codigo: "codigoJuzgado",
    departamento: "departamento",
    municipio: "municipio",
  };

  // Loop over the mapping and generate parameters
  Object.keys(paramMapping).forEach((key) => {
    if (filtro.value[key].value) {
      params.push(`${paramMapping[key]}=${filtro.value[key].label}`);
    } else if (filtro.value[key]) {
      params.push(`${paramMapping[key]}=${filtro.value[key]}`);
    }
  });

  let url = `/tutela/listadoReporteTutelas?pageSize=${filas}&pageNo=${page}`;

  if (filtro.value.tipoTramite == "Juzgados") {
    url = `/tutela/listadoReporteJuzgado?pageSize=${pageSize.value}&pageNo=${currPage.value}`;
  }

  if (params.length) {
    url += `&${params.join("&")}`;
  }

  const response = await sgdeaAxios.get(url);
  facData.value = response.data.elementos || response.data.content;
  dataTableTotalRows.value = response.data.totalElements;
  dataTableTotalPages.value = response.data.totalPages;
  // @ts-expect-error
  var filter = facData.value.sort(
    (a, b) => new Date(a.fechaRadicacion) - new Date(b.fechaRadicacion)
  );
  filteredDataTable.value = filter;
};

const opForFinal = (date) => {
  if (filtro.value.fechaInicial != "") {
    const inicial = moment(filtro.value.fechaInicial, "DD/MM/YYYY").format(
      "YYYY/MM/DD"
    );
    return date >= inicial;
  } else {
    return true;
  }
};

const opForInicial = (date) => {
  if (filtro.value.fechaFinal != "") {
    const final = moment(filtro.value.fechaFinal, "DD/MM/YYYY").format(
      "YYYY/MM/DD"
    );

    return date <= final && date <= moment().format("YYYY/MM/DD");
  } else {
    return date <= moment().format("YYYY/MM/DD");
  }
};

watch(
  () => filtro.value.fechaFinal,
  async (value) => {
    if (filtro.value.fechaInicial == "" && filtro.value.fechaFinal != "") {
      const fechaMoment = moment(value, "DD/MM/YYYY");
      const fechaAnteriorMoment = fechaMoment.subtract(1, "months");
      const fechaAnterior = fechaAnteriorMoment.format("DD/MM/YYYY");
      filtro.value.fechaInicial = fechaAnterior;
    }
  }
);

const generalFilter = () => {
  filteredDataTable.value = facData.value.filter((obj) => {
    // Convertimos el objeto a un array de sus valores
    var valores = Object.values(obj);
    var concatArray = [];
    valores.forEach((element) => {
      if (typeof element == "object" && element != null) {
        var newArr = Object.values(element);
        concatArray = [...concatArray, ...newArr];
      }
    });
    valores = [...valores, ...concatArray];
    // Buscamos si el string de búsqueda coincide con alguno de los valores
    return valores.some((valor) => {
      if (valor != null) {
        if (typeof valor == "object") {
          for (const propiedad in valor) {
            const regexEspacioDoble = /\s\s/;
            var dataFinal = valor[propiedad]
              .toString()
              .toLowerCase()
              .trim()
              .replace(regexEspacioDoble, " ");
            return dataFinal.includes(search.value.toLowerCase());
          }
        }
        if (typeof valor == "string") {
          const regexEspacioDoble = /\s\s/;
          var dataFinal = valor
            .toString()
            .toLowerCase()
            .trim()
            .replace(regexEspacioDoble, " ");
          return dataFinal.includes(search.value.toLowerCase());
        }
      }
      return false;
    });
  });
};

const handlePageChange = async (event) => {
  await getData(event.page, event.rowsPerPage);
};

const handleRowsPerPageChange = async (event: any) => {
  await getData(event.page, event.rowsPerPage);
};

const filteredDataTable = ref([]);

const exportXLSXMen = async () => {
  if (selectedRows.value.length > 0) {
    const idList = selectedRows.value.map((item) => item.id);
    const excel = await sgdeaAxios.post(
      "/envios/generarExcelMensajeria",
      idList,
      { responseType: "blob" }
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(excel.data);
    link.download = "Plantilla cargue de guias.xlsx";
    link.click();
    URL.revokeObjectURL(link.href);
    bandejaTable.value.cleanSelect();
  }
};

const findExcelCorr = async () => {
  if (selectedRows.value.length > 0) {
    const idList = selectedRows.value.map((item) => item.id);
    const excel = await sgdeaAxios.post("/envios/generarExcelEnvios", idList, {
      responseType: "blob",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(excel.data);
    link.download = "Plantilla cargue de guias.xlsx";
    link.click();
    URL.revokeObjectURL(link.href);
    bandejaTable.value.cleanSelect();
  }
};

function csvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

const filterFnCorreos = (val, update, abort) => {
  if (val.length < 1) {
    abort();
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    optionsCorreos.value = correosPositiva.value.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};
const reportModal = ref(false);
const sendReportModal = ref(false);
const flujoPrefixes = {
  1: "COR",
  5: "PQRD",
  3: "FAC",
  4: "CTO",
  8: "ML",
  6: "TUT",
  7: "ENTC",
};
const receiveCorrespondencia = async () => {
  const ids = selectedRows.value.map((item) => item.id);

  try {
    const correspondencia = await sgdeaAxios.put(`/envios/marcarRecibido`, ids);

    if (correspondencia.status === 200) {
      toast.success("Guardado exitoso");

      selectedRows.value.map(async (item) => {
        const envio = await sgdeaAxios.get(`/envios/obtenerCaso/${item.id}`);

        const radicado = await sgdeaAxios.get(`/correspondencia/radicacion/asignaciones/${envio.data?.radicadoEntrada}`)

        const currentPrefix = flujoPrefixes[envio.data.idFlujo.id] || "N/A";

        await crearTrazabilidad({
          proceso: currentPrefix + envio.data.idCaso,
          secuencia: envio.data.radicadoSalida,
          estado: "Por enviar Courier",
          descripcion:
            `Usuario: ${userInfo.value.name}, ` +
            `Comentario: El radicado ha sido procesado y enviado por correspondencia correctamente.`,
          comentario: `El radicado ${envio.data.radicadoSalida} ha sido enviado exitosamente por correspondencia.`,
          nombre: userInfo.value.name,
          accion: `El radicado ${envio.data.radicadoSalida} ha sido enviado exitosamente por correspondencia.`,
          tramite: radicado.data[0]?.radicacion?.tipoTramite?.nombre
        });

        bandejaTable.value.cleanSelect();
        await getData(0, 20);
      });
    } else {
      toast.error("Error de red, intente nuevamente");
    }
  } catch (error) {
    toast.error("Ocurrió un error al procesar los envíos.");
  }
};

const showModalDocs = async (nodeid) => {
  const response = await sgdeaAxios.get<any>(
    `/api/v1/integracion/alfresco/general/1/${nodeid}/archivos`
  );

  if (response.status === 200) {
    const { data } = response;

    listDocs.value = data?.map((it) => ({
      flujo: it.flujo,
      nombre: it.nombreArchvio,
      id: it.id,
      identificador: it.identificador,
      nodeId: it.nodeidFile,
      fecha: moment(it.fechaCreacion).format("DD/MM/YYYY"),
    }));
  }
  //Funcion buscar documentos con nodeid
  modalDocs.value = true;
};

const anularFunct = async () => {
  if (await anularForm.value.validate()) {
    const data = selectedRows.value.map((item) => ({
      id: item.id,
      observacion: observacionAnular.value,
    }));
    const nulled = await sgdeaAxios.post(
      `/envios/gestionEnvio/anulacion`,
      data
    );
    if (nulled.status == 200) {
      toast.success("Anulado exitoso");
      anularModal.value = false;
      observacionAnular.value = "";
      bandejaTable.value.cleanSelect();
      getData(0, 20);
    } else {
      toast.error("Error de red intente nuevamente");
    }
  } else {
    toast.error(
      "Por favor ingrese la observación. Debe tener mínimo 10 caracteres"
    );
  }
};

const enviarMensajeria = async () => {
  const ids = selectedRows.value.map((item) => item.id);
  try {
    const enviarMsj = await sgdeaAxios.put(`/envios/enviarMensajeria`, ids);
    if (enviarMsj.status == 200) {
      const envios = await Promise.all(
        ids.map(async (id) => {
          const envio = await sgdeaAxios.get(`/envios/obtenerCaso/${id}`);
          return envio.data; // Extraer los datos de la respuesta
        })
      );

      for (const envio of envios) {
        const currentPrefix = flujoPrefixes[envio.idFlujo.id] || "N/A";
        await crearTrazabilidad({
          proceso: currentPrefix + envio.idCaso,
          secuencia: envio.radicadoSalida,
          estado: "Por enviar Mensajería",
          descripcion:
            `Usuario:${userInfo.value.name}` +
            `Comentario:: El radicado ha sido procesado y enviado correctamente a través de mensajería`,
          comentario: `El radicado ha sido enviado  por mensajería`,
          nombre: userInfo.value.name,
          accion: `El radicado ${envio.radicadoSalida} ha sido enviado  por mensajería. `,
          tramite: "Correspondencia",
        });
      }
      toast.success("Guardado exitoso");
      bandejaTable.value.cleanSelect();
      getData(0, 20);
    } else {
      toast.error("Error de red intente nuevamente");
    }
  } catch { }
};

const selectedType = ref(null);
const selectedState = ref(null);

function filterData() {
  showDataBandeja.value = true;
  filteredDataTable.value = allData.value.filter((item) => {
    let matchesType = true;
    if (selectedType.value) {
      if (selectedType.value === 'Mensajería') {
        // Incluir tanto 'Mensajería' como 'Mensajero'
        matchesType = ['Mensajería', 'Mensajero'].includes(item.tipoEnvio);
      } else {
        matchesType = item.tipoEnvio === selectedType.value;
      }
    }
    const matchesState = selectedState.value
      ? item.estadoEnvios.nombre === selectedState.value
      : true;
    return matchesType && matchesState;
  });
}

function handleDataPointSelection(event, chartContext, dataPointIndex) {
  if (dataPointIndex.selectedDataPoints[0].length) {
    selectedType.value =
      chartOptionsTipo.value.labels[dataPointIndex.dataPointIndex];
  } else {
    selectedType.value = null;
  }
  filterData();
}

function handleDataPointSelectionState(event, chartContext, dataPointIndex) {

  if (dataPointIndex.selectedDataPoints[0].length) {
    selectedState.value =
      chartOptionsEstado.value.labels[dataPointIndex.dataPointIndex];
    estadoActual.value =
      selectedState.value == "Por enviar Courier"
        ? 2
        : selectedState.value == "Por recibir en correspondencia"
          ? 1
          : 3;

  } else {
    selectedState.value = null;
  }
  filterData();
}

function handleDataPointSelectionState2(bandeja) {
  const estados = savedEstadosAmount.value[bandeja] || {};

  let keys = Object.keys(estados);
  let values = Object.values(estados);
  // Actualizamos la gráfica
  dataChartEstados.value.labels = keys;
  dataChartEstados.value.datasets[0].data = values;
  // Forzamos actualización del componente
  estadosKey.value++;
}

const reportSuccess = async () => {
  if (await selectModal.value.validate()) {
    if (emailList.value.length > 0) {
      if (inputFormat.value == "xlsx") {
        //EXCEL
        var dataFinal =
          selectedRows.value.length > 0 ? selectedRows.value : facData.value;
        let ws_data = [
          columns.value.map((col) => col.label),
          ...dataFinal.map((row) =>
            columns.value.map((col) => {
              let value =
                typeof col.field === "function"
                  ? col.field(row)
                  : // @ts-expect-error
                  row[col.field === void 0 ? col.name : col.field];
              // check if col.format is a function and apply it
              // @ts-expect-error
              if (col.format && typeof col.format === "function") {
                // @ts-expect-error
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
          let binaryData = XLSX.write(wb, { type: "binary", bookType: "xlsx" });
          let data = new Uint8Array(binaryData.length);
          for (let i = 0; i != binaryData.length; ++i) {
            data[i] = binaryData.charCodeAt(i) & 0xff;
          }
          let blob = new Blob([data], { type: "application/octet-stream" });
          let file = new File(
            [blob],
            `Listado ${filtro.value.tipoTramite.toLowerCase() || "tutelas"} ${filtro.value.tipoTramite.toLowerCase() == "tutelas" ||
              filtro.value.tipoTramite.toLowerCase() == ""
              ? "radicadas"
              : ""
            } ${formatDateTimeStand(new Date())}.xlsx`
          );
          const formdata = new FormData();
          formdata.append("email", emailList.value.join(","));
          formdata.append("archivo", file);
          const headers = {
            "Access-Control-Allow-Origin": "*",
            accept: "*",
            "Content-Type": "multipart/form-data",
            "Content-Transfer-Encoding": "BINARY",
          };
          var enviarCorreo = await sgdeaAxios.post(
            "/tutela/envioCSV",
            formdata,
            { headers }
          );
          if (enviarCorreo) {
            toast.success(
              `El reporte de ${filtro.value.tipoTramite == "Juzgados" ? "Juzgados" : "Tutelas"
              } ha sido enviado con éxito a los correos  ingresados.`
            );
            sendReportModal.value = false;
          }
        } catch (error) {
          toast.error("Hubo un error al generar el archivo...");
        }
      } else {
        ////CSV
        var dataFinal =
          selectedRows.value.length > 0 ? selectedRows.value : facData.value;
        const content = [
          columns.value.map((col) => csvValue(col.label, undefined, undefined)),
          ...dataFinal.map((row) =>
            columns.value.map((col) =>
              csvValue(
                typeof col.field === "function"
                  ? col.field(row)
                  : // @ts-expect-error
                  row[col.field === void 0 ? col.name : col.field],
                // @ts-expect-error
                col.format,
                row
              )
            )
          ),
        ].join("\r\n");

        try {
          let blob = new Blob([content], { type: "text/csv" });
          let file = new File(
            [blob],
            `Listado ${filtro.value.tipoTramite.toLowerCase() || "tutelas"} ${filtro.value.tipoTramite.toLowerCase() == "tutelas" ||
              filtro.value.tipoTramite.toLowerCase() == ""
              ? "radicadas"
              : ""
            } ${formatDateTimeStand(new Date())}.csv`
          );
          const formdata = new FormData();
          formdata.append("email", emailList.value[0]);
          formdata.append("archivo", file);
          const headers = {
            "Access-Control-Allow-Origin": "*",
            accept: "*",
            "Content-Type": "multipart/form-data",
            "Content-Transfer-Encoding": "BINARY",
          };
          var enviarCorreo = await sgdeaAxios.post(
            "/tutela/envioCSV",
            formdata,
            { headers }
          );
          if (enviarCorreo) {
            toast.success(
              `El reporte de ${filtro.value.tipoTramite == "Juzgados" ? "Juzgados" : "Tutelas"
              } ha sido enviado con éxito a los correos  ingresados.`
            );
            sendReportModal.value = false;
          }
        } catch (error) {
          toast.error("Hubo un error al generar el archivo...");
        }
      }
    } else {
      toast.error("Debe ingresar un correo electrónico válido para continuar");
    }
  } else {
    toast.error(
      "Para poder continuar con el proceso debe seleccionar un formato"
    );
  }
};
</script>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 310px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #fff

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>

<style>
.chart-container {
  position: relative;
  display: flex;
  justify-content: center;
  height: 30vh;
  width: 30vw;
}
</style>
