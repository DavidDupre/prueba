<template>
  <div class="q-my-md">
    <div class="tw-flex tw-justify-between tw-items-center">
      <span class="tw-font-bold tw-text-3xl tw-my-5"> Reportes </span>
    </div>

    <q-card class="tw-rounded-xl tw-p-4" flat bordered>
      <q-expansion-item default-opened>
        <template v-slot:header>
          <div class="col row">
            <b class="tw-text-lg">Filtrar por</b>
          </div>
        </template>

        <div class="row q-col-gutter-md q-pb-md q-px-md">
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Tipo</span>
            <q-select
              :rules="[]"
              name="tipoTramite"
              outlined
              v-model="filtro.tipoTramite"
              label="Seleccione"
              dense
              map-options
              emit-value
              :options="[{ value: 'Facturas administrativas', label: 'Facturas administrativas' }, { value: 'Cuentas de Cobro', label: 'Cuentas de Cobro' }]"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Fecha inicial</span>
            <q-input :rules="[]" name="fechaInicial" outlined label="dd/mm/yyyy" v-model="filtro.fechaInicial"
                            dense>
                            <template v-slot:append>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="filtro.fechaInicial" mask="DD/MM/YYYY">
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
            <span class="text-weight-bold">Fecha final</span>
            <q-input :rules="[]" name="fechaFinal" outlined label="dd/mm/yyyy" v-model="filtro.fechaFinal"
                            dense>
                            <template v-slot:append>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="filtro.fechaFinal" mask="DD/MM/YYYY" :options="(date) => date <= moment().format('YYYY/MM/DD')">
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
            <span class="text-weight-bold">Identificación</span>
            <q-input
              :rules="[]"
              name="identificacion"
              outlined
              v-model="filtro.identificacion"
              label="Inserte"
              dense
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Tipo de Documento</span>
            <q-select
              :rules="[]"
              name="tipoDoc"
              outlined
              v-model="filtro.tipoDoc"
              label="Seleccione"
              dense
              map-options
              emit-value
              :options="tipoDocumento"
            />
          </div>

          <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Número de factura</span>
            <q-input
              :rules="[]"
              name="numeroFactura"
              outlined
              v-model="filtro.numeroFactura"
              label="Inserte"
              dense
            />
          </div> -->
        </div>

        <div class="tw-flex tw-justify-center tw-items-center tw-my-5 tw-gap-6">
          <q-btn
            label="Limpiar filtros"
            type="reset"
            style="width: 240px"
            text-color="black"
            color="accent"
            @click="cleanFilters"
            class="tw-rounded-xl tw-h-12"
          />

          <q-btn
            type="submit"
            label="Consultar"
            text-color="white"
            style="width: 240px"
            color="primary"
            @click="getData"
            class="tw-rounded-xl tw-h-12 tw-p-2"
          />
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat bordered>
      <div class="flex items-center justify-between q-px-md q-mb-sm row col-12">
        <span class="text-weight-bold text-h6" style="color: #2c3948"
          >Listado de documentos radicados</span
        >

        <div class="tw-flex tw-items-center tw-gap-10">
          <!-- <q-input
            v-model="buscar"
            outlined
            dense
            name="search"
            label="Buscador"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input> -->

          <div class="tw-flex tw-items-center tw-gap-2.5">
            <q-btn-dropdown
              color="accent"
              textColor="secondary"
              label="Exportar"
              style="width: 116px; height: 30px; border-radius: 8px"
              no-caps
              dropdown-icon="expand_more"
            >
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
          </div>
        </div>
      </div>
      <TableDocumentosRadicados
        :buscar="buscar"
        :key="tableKey"
        class="full-width"
        :TABLE_TOTAL_ROWS="dataTableTotalRows"
        :TABLE_HEADER="columns"
        :TABLE_BODY="filteredDataTable"
        :is-selection="'none'"
        :pagination-message="customMessageTableResults"
        @handlePageChange="handlePageChange" @handleRowsPerPageChange="handleRowsPerPageChange"
      />
    </q-card>
    <template v-if="reportModal">
      <LoadingModal @load-complete="sendReportModal = true" />
    </template>
    <template v-if="sendReportModal">
      <ReportModal
        title="Enviar reporte al correo"
        label="Formato"
        model-value=""
        accept-label="Sí"
        action-label="No"
        :action="reportSuccess"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { exportFile } from "quasar";
import TableDocumentosRadicados from "./Table.vue";
import { REPORTES_HEADER, REPORTES_HEADER_CTO } from ".";
import { IFiltros } from ".";
import excel from "../../../assets/excel.svg";
import csv from "../../../assets/csv.svg";
import { tipoDocumento } from "src/constantes/options";
import LoadingModal from "src/components/Modal/LoadingModal.vue";
import ReportModal from "src/components/Modal/ReportModal.vue";
import { sgdeaAxios } from "src/services";
import moment from "moment";
import * as XLSX from 'xlsx';
import { toast } from "src/helpers/toast";

const columns = ref(REPORTES_HEADER);
const rows = ref([]);
const currPage = ref(0)
const pageSize = ref(20)
const dataTableTotalRows = ref()
const customMessageTableResults = ref("")

const filtro = ref<IFiltros>({
  tipoTramite: "",
  fechaInicial: "",
  fechaFinal: "",
  identificacion: "",
  tipoDoc: ""
});

const tableKey = ref(0)

const facData = ref([]);

const cleanFilters = () => {
  for (let key in filtro.value) {
    filtro.value[key] = "";
  }
  currPage.value = 0
  getData()
};

let buscar = ref("");

onMounted(() => {
  getData();
});

async function getData(){
  let params = [];

  if (filtro.value.fechaInicial) {
    params.push(`startDate=${filtro.value.fechaInicial}`);
  }
  if (filtro.value.tipoDoc) {
    params.push(`docType=${filtro.value.tipoDoc}`);
  }
  if (filtro.value.fechaFinal) {
    params.push(`endDate=${filtro.value.fechaFinal}`);
  }
  if (filtro.value.identificacion) {
    params.push(`numeroDocumento=${filtro.value.identificacion}`);
  }

  let url = `/facturacion/getReports?pageSize=${pageSize.value}&pageNumber=${currPage.value}`;

  if(filtro.value.tipoTramite == 'Cuentas de Cobro'){
    columns.value = REPORTES_HEADER_CTO
    url = `/facturacion/getCuentasCobro?pageSize=${pageSize.value}&pageNumber=${currPage.value}`
    tableKey.value++
  } else {
    columns.value = REPORTES_HEADER
    tableKey.value++
  }



  if (params.length) {
    url += `&${params.join('&')}`;
  }

  const response = await sgdeaAxios.get(url);

  facData.value = response.data.elementos || response.data.content;

  dataTableTotalRows.value = response.data.totalElements
  customMessageTableResults.value =  response?.data?.paginationMessage;
  filteredDataTable.value = facData.value;
}

const handlePageChange = async (page: number) => {
  currPage.value = page <= 0 ? 0 : page - 1;
  await getData();
}

const handleRowsPerPageChange = async (rowsPerPage: any) => {
  pageSize.value = rowsPerPage;
  await getData();
}

const filteredDataTable = ref([])

const exportXLSX = () => {
  let ws_data = [
    columns.value.map((col) => col.label),
    ...facData.value.map((row) =>
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
    XLSX.writeFile(wb, "reporte-facturacion-manual.xlsx");
    toast.success("Archivo descargado con éxito!");
  } catch (error) {
    toast.error("El navegador rechazó la descarga del archivo...");
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
  const content = [
    columns.value.map((col) => csvValue(col.label, undefined, undefined)),
    ...facData.value.map((row) =>
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

  const status = exportFile("reporte-tutelas.csv", content, "text/csv");

  if (status !== true) {
    toast.error("El navegador rechazó la descarga del archivo...");
  } else {
    toast.success("Archivo descargado con éxito!");
  }
};

const reportModal = ref(false);
const sendReportModal = ref(false);

const reportSuccess = () => {
  toast.success("El reporte de tutelas ha sido enviado con éxito a los correos ingresados.");
};
</script>
