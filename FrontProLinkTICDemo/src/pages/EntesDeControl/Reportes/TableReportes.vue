<template>
  <div class="tw-my-[30px] tw-relative">
    <q-table selection="multiple" v-model:selected="multiSelected" :loading="props.loading" :filter="filterSearch"
      :class="{ '!tw-h-[400px]': props.loading }" row-key="numeroRadicado" :columns="columns" :rows="props.rows"
      title="Listado de radicados de Entes de control" class="tw-p-5" bordered flat
      v-model:pagination="props.pagination" rows-per-page-label="Páginas" hide-pagination ref="tableReportes"
      no-data-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
      no-results-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente">

      <template v-slot:top-right>
        <div class="tw-flex tw-justify-center tw-items-center tw-gap-8">
          <q-input borderless dense debounce="300" v-model="filterSearch" placeholder="Buscador">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <div class="tw-flex tw-gap-1">
            <q-btn-dropdown class="!tw-px-4 !tw-py-1" color="accent" textColor="secondary" label="Exportar" no-caps
              dropdown-icon="expand_more" flat>
              <q-list separator dense>
                <q-item clickable v-close-popup @click="exportCSV()">
                  <q-item-section avatar>
                    <q-avatar square>
                      <q-img v-lazy :data-url="require('src/assets/csv.svg')" alt="csv" width="24px" height="24px" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>Exportar CSV</q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="exportXLSX()">
                  <q-item-section avatar>
                    <q-avatar square>
                      <q-img v-lazy :data-url="require('src/assets/excel.svg')" alt="excel" width="24px"
                        height="24px" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>Exportar XLSX</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-btn class="!tw-px-4 !tw-py-1" color="primary" icon="send" label="Enviar correo"
              @click="modalReporte = true" />
          </div>
        </div>
      </template>

      <template v-slot:header-cell="slot">
        <q-th :props="slot">
          <div style=" width: fit-content; display: inline-block; white-space: normal; ">
            {{ slot.col.label }}
          </div>
        </q-th>
      </template>

      <template v-slot:body-cell-remitente="slot">
        <q-td :props="slot">
          <div class="tw-flex tw-flex-wrap tw-justify-center">
            <span style="width: 100%">
              N° de Documento:
              <b>{{ slot.value.split(",")[0].split(":")[1] }}</b>
            </span>
            <span style="width: 100%">
              Nombre:
              <b>{{ slot.value.split(",")[1].split(":")[1] }}</b>
            </span>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-estado="slot">
        <q-td :props="slot">
          <span
            class="tw-border tw-rounded-full q-my-sm tw-max-w-max q-px-md q-py-xs tw-bg-orange-100 tw-border-orange-400">
            {{ slot.value }}</span>
        </q-td>
      </template>

      <template v-slot:body-cell-radicador="slot">
        <q-td :props="slot">
          <div class="tw-flex tw-flex-wrap tw-justify-center">
            <span style="width: 100%">
              N° de Documento:
              <b>{{ slot.value.split(",")[0].split(":")[1] }}</b>
            </span>
            <span style="width: 100%">
              Nombre:
              <b>{{ slot.value.split(",")[1].split(":")[1] }}</b>
            </span>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-clonado="slot">
        <q-td :props="slot">
          <div class="tw-flex tw-flex-wrap tw-justify-center">
            <span :class="[
              'tw-text-[15px] tw-p-[3px] tw-rounded-full',
              slot.value.includes('NO') ? 'tw-bg-yellow-300 tw-border tw-border-yellow-700 tw-text-[13px]'
                : slot.value.includes('SI') ? 'tw-bg-green-300 tw-border tw-border-green-700 tw-px-[8px]' : ''
            ]">
              {{ slot.value }}
            </span>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-oficinas="slot">
        <q-td :props="slot">
          <div class="tw-flex tw-flex-wrap tw-justify-center">
            <span style="width: 100%; margin-left: 10px" v-for="(val, index) in slot.value.split(', ')" :key="index">
              {{ val }}{{ index < slot.value.split(', ').length - 1 ? ", " : "" }}
                  </span>
              </div>
          </q-td>
      </template>

<template v-slot:body-cell-gestionadoresIntervienenRespuesta="slot">
          <q-td :props="slot">
              <div class="tw-flex tw-flex-wrap tw-justify-center">
                  <span
                      style="width: 100%; margin-left: 4px"
                      v-for="(val, index) in slot.value.split(' ,')" :key="index">
                {{ val }}{{ index < slot.value.split(',').length - 1 ? ", " : "" }} </span>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-diasOtorgadosGestionadoresClonados="slot">
        <q-td :props="slot">
          <div class="tw-flex tw-flex-wrap tw-justify-center">
            <span style="width: 100%; margin-left: 4px" v-for="(val, index) in slot.value.split(',')" :key="index">
              {{ val }}{{ index < slot.value.split(',').length - 1 ? ", " : "" }} </span>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-fechaMaxRespuestaGestionadoresClonados="slot">
        <q-td :props="slot">
          <div class="tw-flex tw-flex-wrap tw-justify-center">
            <span style="width: 100%; margin-left: 10px" v-for="(val, index) in slot.value.split(',')" :key="index">
              {{ val }}{{ index < slot.value.split(',').length - 1 ? ", " : "" }} </span>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-fechaCierreGestionadoresClonados="slot">
        <q-td :props="slot">
          <div class="tw-flex tw-flex-wrap tw-justify-center">
            <span style="width: 100%; margin-left: 10px" v-for="(val, index) in slot.value.split(',')" :key="index">
              {{ val }}{{ index < slot.value.split(',').length - 1 ? ", " : "" }} </span>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-condicionEspecial="slot">
        <q-td :props="slot">
          <div class="tw-flex tw-flex-wrap tw-justify-center">
            <span :class="[
              ' tw-text-[15px] tw-p-[3px] tw-rounded-full', slot.value.includes('NO')
                ? 'tw-bg-gray-300 tw-border tw-border-gray-700 tw-text-[13px]' : slot.value.includes('SI')
                  ? 'tw-bg-amber-300 tw-border tw-border-amber-700 tw-px-[8px]' : '']">
              {{ slot.value }}
            </span>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-tutela="slot">
        <q-td :props="slot">
          <div class="tw-flex tw-flex-wrap tw-justify-center">
            <span :class="[
              ' tw-text-[15px] tw-p-[3px] tw-rounded-full', slot.value.includes('NO')
                ? 'tw-bg-purple-300 tw-border tw-border-purple-700 tw-text-[13px]'
                : slot.value.includes('SI') ? 'tw-bg-sky-300 tw-border tw-border-sky-700 tw-px-[8px]' : '']">
              {{ slot.value }}
            </span>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-conCopia="slot">
        <q-td :props="slot">
          <div class="tw-flex tw-flex-wrap tw-justify-center">
            <span :class="[
              ' tw-text-[15px] tw-p-[3px] tw-rounded-full', slot.value.includes('NO')
                ? 'tw-bg-indigo-300 tw-border tw-border-indigo-700 tw-text-[13px]'
                : slot.value.includes('SI') ? 'tw-bg-orange-300 tw-border tw-border-orange-700 tw-px-[8px]' : '']">
              {{ slot.value }}
            </span>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-enviadoConCopia="slot">
        <q-td :props="slot">
          <div class="tw-flex tw-flex-wrap tw-justify-center">
            <span style="width: 100%; margin-left: 10px" v-for="(val, index) in slot.value.split(',')" :key="index">
              {{ val }}{{ index < slot.value.split(',').length - 1 ? ", " : "" }} </span>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-formaEnvioConCopia="slot">
        <q-td :props="slot">
          <div class="tw-flex tw-flex-wrap tw-justify-center">
            <span style="width: 100%; margin-left: 10px" v-for="(val, index) in slot.value.split(',')" :key="index">
              {{ val }}{{ index < slot.value.split(',').length - 1 ? ", " : "" }} </span>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-formaEnvioDestinatarioCopia="slot">
        <q-td :props="slot">
          <div class="tw-flex tw-flex-wrap tw-justify-center">
            {{ slot.value }}
            <span style="width: 100%; margin-left: 10px" v-for="(val, index) in slot.value.split(',')" :key="index">
              {{ val }}{{ index < slot.value.split(',').length - 1 ? ", " : "" }} </span>
          </div>
        </q-td>
      </template>

      <template v-slot:no-data="{ message }">
        <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
          <img v-lazy :data-url="require('src/assets/filterImage.svg')" alt="" width="120">
          <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
            {{ message }}
          </span>
        </div>
      </template>

      <template v-slot:bottom>
        <div class="row items-center q-mt-md tw-w-full">
          <div class="col-auto tw-flex tw-gap-x-3 tw-items-center">
            <span>Filas</span>
            <q-select :options="[10, 20, 50, 100]" :model-value="props.pagination.rowsPerPage" dense outlined
              @update:model-value="handleRowsPerPageChange" />
          </div>

          <div class="col tw-flex tw-justify-center">
            <q-pagination :model-value="props.pagination.page + 1" :max="props.totalPages" :max-pages="50"
              color="primary" size="md" direction-links boundary-links ellipsis
              @update:model-value="handlePageChange" />
          </div>

          <div class="col-auto tw-flex tw-items-center tw-text-right">
            {{ paginationMessage }}
            <div class="invisible"></div>
          </div>
        </div>
      </template>

    </q-table>


    <q-card-section v-show="props.loading"
      class="tw-absolute tw-top-0 tw-left-0 tw-w-[100%] tw-h-[100%] tw-bg-white tw-flex tw-justify-center tw-items-center">
      <div class="text-center">
        <q-circular-progress indeterminate class="tw-font-bold w-full" size="80px" color="primary" />
        <section class="tw-mt-10">
          <div class="tw-text-2xl tw-font-bold">Consultando información</div>
          <div class="text-subtitle1 tw-mt-2">Espere un momento por favor</div>
        </section>
      </div>
    </q-card-section>
  </div>

  <DialogEnviarReporte :open="modalReporte" :dataTable="props.rows" @cancelar="modalReporte = false"
    @aceptar="enviarCorreos" />
</template>

<script lang="ts" setup>
import { columns } from "src/pages/EntesDeControl/Reportes/data";
import DialogEnviarReporte from "./DialogEnviarReporte.vue";
import { formatDateForDoc } from "src/helpers/formtDate";
import { exportFile } from "quasar";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import * as XLSX from "xlsx";
import { ref, watchEffect } from "vue";

const props = defineProps<{
  rows: [];
  loading: boolean;
  pagination: any;
  totalPages?: number;
  paginationMessage?: string;
  TABLE_TOTAL_ROWS: number;
  filterForm:any;
}>();

const emit = defineEmits([
  "changeLoading",
  "handleRowsPerPageChange",
  "handlePageChange",
]);

const modalReporte = ref(false);
const multiSelected = ref([]);
const filterSearch = ref("");
const valueProgress = ref(0);
const tableReportes = ref(null);
const rowsCurrentPage = ref([]);

const interval = setInterval(() => {
  valueProgress.value += 10;
  if (valueProgress.value >= 100) {
    clearInterval(interval);
    emit('changeLoading', false)
  }
}, 200);

const csvValue = (value, format, row) => {
  if (format) {
    if (typeof format === "function") return format(value, row);
    else return value;
  } else {
    let stringValue = String(value);
    stringValue = stringValue.replace(/"/g, '""');
    if (
      stringValue.includes(",") ||
      stringValue.includes("\n") ||
      stringValue.includes('"')
    )
      return `"${stringValue}"`;
    return stringValue;
  }
};

const exportCSV = async (ifBinary = false) => {
  let tableData: any = [];

  try {
    const response = await sgdeaAxios.get("/api/entes/reporteDescargable", {
      params: {
        fechaInicial: props.filterForm.fechaInicial.val,
        fechaFinal: props.filterForm.fechaFinal.val,
        nroDocumento: props.filterForm.numIdentificacion.val,
        idGestionador: props.filterForm.gestionador.val?.value,
        page: 0,
        size: 1000 },
    });

    if (response.status === 200 || response.status === 201) {
      tableData = response.data.content;
    }
  } catch (error) {
    console.error(error);
    toast.error("Error al obtener datos para exportar.");
    return;
  }

  if (tableData.length < 1) {
    toast.error("No hay datos para exportar.");
    return;
  }

  const content = [
    columns
      .map((col: any) => csvValue(col.label, undefined, undefined))
      .join(","),
    ...tableData.map((row: any) =>
      columns
        .map((col: any) => {
          let value = csvValue(
            typeof col.field === "function"
              ? col.field(row)
              : row[col.field === void 0 ? col.name : col.field],
            col?.format,
            row,
          );
          if (col.name == "remitente") value = value.split(", Nombre:")[1];
          return value;
        })
        .join(","),
    ),
  ].join("\r\n");

  if (!ifBinary) {
    const status = exportFile(`Listado de radicados ${formatDateForDoc(new Date())}.csv`, content, "text/csv");

    if (status !== true) {
      toast.error('El navegador rechazó la descarga del archivo...')
    } else {
      toast.success('El reporte ha sido descargado con éxito');
    }
    return null;
  }
  else return new Blob([content], { type: "text/csv;charset=utf-8;" });
};

const exportXLSX = async (ifBinary = false) => {
  let tableData: any = [];

  try {
    const response = await sgdeaAxios.get("/api/entes/reporteDescargable", {
      params: {
        fechaInicial: props.filterForm.fechaInicial.val,
        fechaFinal: props.filterForm.fechaFinal.val,
        nroDocumento: props.filterForm.numIdentificacion.val,
        idGestionador: props.filterForm.gestionador.val?.value,
        page: 0,
        size: 1000 },
    });

    if (response.status === 200 || response.status === 201) {
      tableData = response.data.content;
    }
  } catch (error) {
    console.error(error);
    toast.error("Error al obtener datos para exportar.");
    return;
  }

  if (tableData.length < 1) {
    toast.error("No hay datos para exportar.");
    return;
  }

  let ws_data = [
    columns.map((col: any) => col.label),
    ...tableData.map((row: any) =>
      columns.map((col: any) => {
        let value =
          typeof col.field === "function"
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field];

        if (col.format && typeof col.format === "function") {
          value = col.format(value, row);
        }

        if (col.name === "remitente") value = value.split(", Nombre:")[1];
        return value;
      })
    ),
  ];

  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

  if (!ifBinary) {
    XLSX.writeFile(
      wb,
      `Listado de radicados ${formatDateForDoc(new Date())}.xlsx`
    );
    toast.success("El reporte ha sido descargado con éxito");
    return null;
  } else {
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    return s2ab(wbout);
  }
};

function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xFF;
  }
  return new Blob([buf], { type: 'application/octet-stream' });
}

const enviarCorreos = (correosSelecionador: string[], typeVal: string | null) => {
  if (!typeVal || correosSelecionador.length <= 0) {
    toast.error("Complete todos los campos porfavor.");
    return;
  };

  let correos = correosSelecionador.join(',');
  let binary = null;

  if (typeVal == 'xlsx') binary = exportXLSX(true);
  else binary = exportCSV(true);

  const form = new FormData();
  form.append('archivo', binary, `Listado de radicados ${formatDateForDoc(new Date())}.${typeVal}`);

  sgdeaAxios.post(`/api/entes/envioCSV?email=${correos}`, form).then(() => {
    modalReporte.value = false;
    toast.success("El reporte de radicados ha sido enviado con éxito a los correos ingresados");
  })
    .catch(() => toast.error("Hubo un error al enviar el correo"))
}

const handleRowsPerPageChange = (event: number) => {
  const lastPage = Math.ceil(Number(props.pagination.total) / Number(props.pagination.rowsPerPage));
  // if (lastPage > props.pagination.page) emit("handlePageChange", lastPage);

  emit("handleRowsPerPageChange", event);
};

const handlePageChange = (event: number) => {
  emit("handlePageChange", event - 1);
};

watchEffect(() => {
  if (tableReportes.value) {
    rowsCurrentPage.value = tableReportes.value?.computedRows;
  }
});
</script>
