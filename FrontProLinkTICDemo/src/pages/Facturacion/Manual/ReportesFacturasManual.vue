<template>
    <div class="q-my-md">
        <div class="tw-flex tw-justify-between tw-items-center">
            <span class="tw-font-bold tw-text-3xl tw-my-5"> Reportes factura electrónica </span>
        </div>

        <q-card class="tw-rounded-xl tw-p-4" flat bordered>
            <q-expansion-item default-opened>
                <template v-slot:header>
                    <div class="col row">
                        <b class="tw-text-lg">Filtrar por</b>
                    </div>
                </template>

                <div class="row q-col-gutter-md q-pb-md q-px-md">
                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
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

                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                        <span class="text-weight-bold">Fecha final</span>
                        <q-input :rules="[]" name="fechaFinal" outlined label="dd/mm/yyyy" v-model="filtro.fechaFinal"
                            dense>
                            <template v-slot:append>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="filtro.fechaFinal" mask="DD/MM/YYYY" :options="optionsDate">
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Cerrar" color="primary" flat />
                                            </div>
                                        </q-date>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                        <span class="text-weight-bold">Tipo de documento</span>
                        <q-select :rules="[]" name="tipo" outlined v-model="filtro.tipoDocumento" label="Seleccione" dense
                            map-options emit-value :options="[{ label: 'Nota de Crédito', value: 'NotaCrédito' }, { label: 'Nota de Débito', value: 'NotaDébito' }, { label: 'Factura', value: 'Factura' }]" />
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                        <span class="text-weight-bold">Número de documento</span>
                        <q-input :rules="[]" name="identificacion" outlined v-model="filtro.numeroDocumento" label="Inserte"
                            dense />
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                        <span class="text-weight-bold">Consecutivo o número de radicado</span>
                        <q-input :rules="[]" name="numeroFactura" outlined v-model="filtro.consecutivoNumeroRadicado"
                            label="Inserte" dense />
                    </div>
                </div>

                <div class="tw-flex tw-justify-center tw-items-center tw-my-5 tw-gap-6">
                    <q-btn label="Limpiar filtros" type="reset" style="width: 240px" text-color="black" color="accent"
                        @click="cleanFilters" class="tw-rounded-xl tw-h-12" />

                    <q-btn type="submit" @click="getData" label="Consultar" text-color="white" style="width: 240px"
                        color="primary" class="tw-rounded-xl tw-h-12 tw-p-2" />
                </div>
            </q-expansion-item>
        </q-card>

        <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat bordered>
            <div class="flex items-center justify-between q-px-md q-mb-sm row col-12">
                <span class="text-weight-bold text-h6" style="color: #2c3948">Listado de documentos radicados</span>

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
                    </div>
                </div>
            </div>
            <TableDocumentosRadicados :TABLE_TOTAL_ROWS="dataTableTotalRows" :buscar="buscar" class="full-width" is-selection="none" :TABLE_HEADER="columns"
                :TABLE_BODY="filteredData" @handlePageChange="handlePageChange" @handleRowsPerPageChange="handleRowsPerPageChange" :pagination-message="customMessageTableResults" />
        </q-card>
        <template v-if="reportModal">
            <LoadingModal @load-complete="sendReportModal = true, reportModal = false" />
        </template>
        <template v-if="sendReportModal">
            <q-dialog v-model="sendReportModal" persistent transition-show="scale" transition-hide="scale"
                transition-duration="300">
                <q-card class="tw-p-10">
                    <q-card-section class="tw-bg-white">
                        <div class="full-width row  tw-justify-center tw-items-center">
                            <img v-lazy :data-url="mail" alt="email" />
                        </div>
                    </q-card-section>
                    <q-card-section>
                        <p class="tw-font-bold tw-text-2xl tw-text-center"> Enviar reporte al correo</p>
                        <p class="tw-font-bold tw-mt-3 tw-mb-1">Formato</p>
                        <q-select class="q-mb-lg" v-model="emailForm.format" outlined map-options emit-value
                            label="Seleccione" :options="[
                                { value: 'xlsx', label: 'XLSX' }
                            ]" />
                        <q-expansion-item default-opened>
                            <template v-slot:header>
                                <div class="col row">
                                    <b class="tw-text-base text-grey-7">Correos electrónicos</b>
                                </div>
                            </template>

                            <q-input bottom-slots @keyup.enter="addEmail()" v-model="email" label="Inserte el correo">
                                <template v-slot:append>
                                    <q-icon name="add" @click="addEmail()" class="q-mr-sm roundedDocBTN cursor-pointer"
                                        color="white" size="16px" />
                                </template>
                                <template v-slot:prepend>
                                    <q-icon name="check_circle" class="q-mr-sm cursor-pointer" color="grey-4" size="16px" />
                                </template>
                            </q-input>
                            <q-list bordered v-if="emailForm.listEmails.length > 0" class="rounded-borders"
                                style="max-width: 600px">
                                <!-- <q-item-label header>label</q-item-label> -->
                                <div v-for="list in emailForm.listEmails">
                                    <q-item>
                                        <q-item-section avatar>
                                            <q-icon name="check_circle" class="q-mr-sm cursor-pointer" color="grey-4"
                                                size="16px" />
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label>
                                                <span class="text-weight-medium">{{ list }}</span>
                                            </q-item-label>
                                        </q-item-section>

                                        <q-item-section side>
                                            <div class="text-grey-8 q-gutter-xs">
                                                <q-icon name="close" class="q-mr-sm cursor-pointer"
                                                    @click="deleteEmail(list)" color="grey-4" size="16px" />
                                            </div>
                                        </q-item-section>
                                    </q-item>

                                    <q-separator />
                                </div>


                            </q-list>
                        </q-expansion-item>
                    </q-card-section>

                    <div class="row justify-center q-mt-md">
                        <q-btn v-close-popup color="secondary" flat label="No" v-on:click=""
                            class=" col-5 q-ma-none q-py-md" style="width: 200px; height: 60px;" />

                        <q-btn v-close-popup color="secondary" label="Si" v-on:click=""
                            class="col-5 tw-bg-primary q-ma-none q-py-md" style="width: 200px; height: 60px;" />
                    </div>
                </q-card>
            </q-dialog>
        </template>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { exportFile } from "quasar";
import TableDocumentosRadicados from "./TableReportes.vue";
import excel from "../../../assets/excel.svg";
import csv from "../../../assets/csv.svg";
import mail from "src/assets/mail.svg";
import LoadingModal from "src/components/Modal/LoadingModal.vue";
import { dateForOptions } from "src/helpers/formtDate";
import { sgdeaAxios } from "src/services";
import moment from "moment";
import * as XLSX from 'xlsx';
import { toast } from "src/helpers/toast";

const email = ref()
const reportModal = ref(false);
const dataTableTotalRows = ref()
const sendReportModal = ref(false);
const currPage = ref(0)
const pageSize = ref(20)
const emailForm = ref({
    format: '',
    listEmails: []
})
const filteredData = ref([])
const allReportes = ref([])
const customMessageTableResults = ref("")

const filtro = ref<IFiltros>({
    tipoDocumento: "",
    fechaInicial: "",
    fechaFinal: "",
    numeroDocumento: "",
    consecutivoNumeroRadicado: "",
});

const cleanFilters = () => {
    for (let key in filtro.value) {
        filtro.value[key] = "";
    }
};

const optionsDate = (date) => {
    return date > dateForOptions(filtro.value.fechaInicial) && date <= moment().format("YYYY/MM/DD");
}

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
        field: "prefijoFactura",
        sortable: true,
        align: "center",
    },
    {
        name: "adquiriente",
        label: "Adquiriente",
        field: "nitAdquiriente",
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

const rows = ref([

])

let buscar = ref("");

onMounted(async () => {
    getData()
})

async function getData(){
  let params = [];

  if (filtro.value.tipoDocumento) {
    params.push(`docType=${filtro.value.tipoDocumento}`);
  }
  if (filtro.value.fechaInicial) {
    params.push(`startDate=${filtro.value.fechaInicial}`);
  }
  if (filtro.value.fechaFinal) {
    params.push(`endDate=${filtro.value.fechaFinal}`);
  }
  if (filtro.value.numeroDocumento) {
    params.push(`numeroDocumento=${filtro.value.numeroDocumento}`);
  }
  if (filtro.value.consecutivoNumeroRadicado) {
    params.push(`consecutivoOradicado=${filtro.value.consecutivoNumeroRadicado}`);
  }

  let url = `/facManual/getReports?pageSize=${pageSize.value}&pageNumber=${currPage.value}`;

  if (params.length) {
    url += `&${params.join('&')}`;
  }

  const response = await sgdeaAxios.get(url);

  allReportes.value = response.data.content;
  dataTableTotalRows.value = response.data.totalElements
  customMessageTableResults.value =  response?.data?.paginationMessage;
  filteredData.value = allReportes.value;
}

function csvValue(val, formatFn, row) {
    let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

    formatted =
        formatted === void 0 || formatted === null ? "" : String(formatted);

    formatted = formatted.split('"').join('""');

    return `"${formatted}"`;
}

const exportXLSX = () => {
  let ws_data = [
    columns.map((col) => col.label),
    ...allReportes.value.map((row) =>
      columns.map((col) => {
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

const exportCSV = () => {
  const content = [
    columns.map((col) => csvValue(col.label, undefined, undefined)),
    ...allReportes.value.map((row) =>
      columns.map((col) =>
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

const addEmail = () => {
    if (!emailForm.value.listEmails.includes(email.value)) {
        const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!patron.test(email.value)) {
            showNotif('Ingrese un correo electrónico válido')
        } else {
            emailForm.value.listEmails.push(email.value)
            email.value = ''
        }
    } else {
        showNotif("El correo ya se encuentra en la lista");
    }
}

const deleteEmail = (data) => {
    emailForm.value.listEmails = emailForm.value.listEmails.filter(item => item !== data);
}

watch(
    () => filtro.value.fechaInicial,
    (value) => {
        filtro.value.fechaFinal = ''
    }
);

function showNotif(title: string) {
  toast.error(title);
}

const handlePageChange = async (page: number) => {
  currPage.value = page <= 0 ? 0 : page - 1;
  await getData();
}

const handleRowsPerPageChange = async (rowsPerPage: any) => {
  pageSize.value = rowsPerPage;
  await getData();
}

</script>
<style>
.roundedDocBTN {
    background-color: #ff7500;
    border-radius: 9999px;
}
</style>
