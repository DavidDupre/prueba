<template>
  <div class="tw-my-[30px] tw-relative">
    <q-table selection="none" v-model:selected="multiSelected" :class="{ '!tw-h-[400px]': props.loading }"
      row-key="numeroRadicado" :columns="props.columns" :rows="filteredData" title="Listado de Reportes" class="tw-p-5"
      virtual-scroll bordered flat v-model:pagination="props.pagination" rows-per-page-label="Páginas" hide-pagination
      ref="tableReportes" @request="$emit('onRequest')"
      no-data-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
      no-results-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente">

      <template v-slot:top-right>
        <div class="tw-flex tw-justify-center tw-items-center tw-gap-8">
          <q-input outlined dense rounded v-model="search" label="Buscador" class="tw-w-[300px]"
            @update:model-value="generalFilter">
            <template v-slot:prepend>
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
                      <q-img v-lazy :data-url="require('src/assets/csv.svg')
                        " alt="csv" width="24px" height="24px" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>Exportar CSV</q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="exportXLSX()">
                  <q-item-section avatar>
                    <q-avatar square>
                      <q-img v-lazy :data-url="require('src/assets/excel.svg')
                        " alt="excel" width="24px" height="24px" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>Exportar XLSX</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-btn class="!tw-px-4 !tw-py-1" color="primary" icon="send" label="Enviar correo"
              @click="modalReporte = true" :disable="!props.rows?.length" :readonly="!props.rows?.length" />
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

      <template v-slot:body-cell-estado="slot">
        <q-td :props="slot">
          <span
            class="tw-border tw-rounded-full q-my-sm tw-max-w-max q-px-md q-py-xs tw-bg-orange-100 tw-border-orange-400">
            {{ slot.value }}</span>
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
        <div class="row justify-between q-mt-md tw-w-[100%]">
          <div class="tw-flex tw-gap-x-3 tw-items-center">
            <span>Filas</span>
            <q-select :options="[2, 5, 10, 20, 50, 100]" :model-value="props?.pagination?.rowsPerPage" dense
              outlined
              @update:model-value="(val) => { emit('pagination', { ...props?.pagination, rowsPerPage: val }); emit('onRequest'); }" />
          </div>
          <q-pagination :model-value="props?.pagination?.page+1" color="primary" :max="props?.pagination?.totalPages" size="md"
            direction-links boundary-links boundary-numbers @update:model-value="changePagination" />
          <div class="invisible"></div>
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
    :tipoReporte="props.tipoReporte" @aceptar="enviarCorreos" />
  <LoadingModal v-if="loadingModal" :total="280" @load-complete="loadingModal = false"
    title="Enviando información" subtitle="Espere un momento por favor"/>
</template>

<script lang="ts" setup>
import DialogEnviarReporte from 'src/pages/ReporteGeneral/DialogEnviarReporte.vue'
import { formatDateForDoc } from "src/helpers/formtDate";
import { exportFile } from "quasar";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { ref, watch, watchEffect } from "vue";
import { FilterFormI } from './types';
import * as XLSX from "xlsx";
import LoadingModal from "components/Modal/LoadingModal.vue";

const props = defineProps<{ pagination: any, rows: []; columns: []; loading: boolean, tipoReporte: number, filterForm: FilterFormI }>();
const emit = defineEmits(['changeLoading', 'onRequest', 'pagination']);
const loadingModal = ref(false);
const modalReporte = ref(false);
const tableReportes = ref(null);
const rowsCurrentPage = ref([]);
const multiSelected = ref([]);
const filteredData = ref([]);
const originData = ref([]);
const search = ref("");

const generalFilter = () => {
  filteredData.value = originData.value.filter((data) => {
    const fieldValues = Object.values(data).map(String);
    return fieldValues.some((value) =>
      value?.toLowerCase().includes(search.value?.toLowerCase())
    );
  });
};

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

const exportCSV = (ifBinary = false) => {
  let tableData: any = rowsCurrentPage.value;
  if (multiSelected.value.length >= 1) tableData = multiSelected.value;

  if (tableData.length < 1) {
    toast.error('No hay datos para exportar.');
    return;
  }

  const content = [
    props.columns
      .map((col: any) => csvValue(col.label, undefined, undefined))
      .join(","),
    ...tableData.map((row: any) => props.columns
      .map((col: any) => {
        let value = csvValue(
          typeof col.field === "function" ? col.field(row) : row[col.field === void 0 ? col.name : col.field],
          col?.format,
          row,
        )
        if (col.name == 'remitente') value = value.split(', Nombre:')[1];
        return value;
      }).join(","),
    ),
  ].join("\r\n");

  if (!ifBinary) {
    const status = exportFile(`Listado de radicados ${formatDateForDoc(new Date())}.csv`, content, "text/csv");

    if (status !== true) {
      toast.error("El navegador rechazó la descarga del archivo...");
    } else {
      toast.success("El reporte ha sido descargado con éxito");
    }
    return null;
  }
  else return new Blob([content], { type: "text/csv;charset=utf-8;" });
};

const exportXLSX = (ifBinary = false) => {
  let tableData: any = rowsCurrentPage.value;
  if (multiSelected.value.length >= 1) tableData = multiSelected.value;

  if (tableData?.length < 1) {
    toast.error('No hay datos para exportar.');
    return;
  }

  let ws_data = [
    props.columns.map((col: any) => col.label),
    ...tableData.map((row: any) =>
      props.columns.map((col: any) => {
        let value = typeof col.field === "function" ?
          col.field(row) : row[col.field === void 0 ? col.name : col.field];
        if (col.format && typeof col.format === "function") {
          value = col.format(value, row);
        }

        if (col.name == 'remitente') value = value.split(', Nombre:')[1];
        return value;
      }),
    ),
  ];

  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

  if (!ifBinary) {
    XLSX.writeFile(wb, `Listado de radicados ${formatDateForDoc(new Date())}.xlsx`);
    toast.success("El reporte ha sido descargado con éxito");
    return null;
  }
  else {
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
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
  if (!typeVal) {
    toast.error("Complete todos los campos porfavor.");
    return;
  }
  if (correosSelecionador?.length < 1) {
    toast.error("Deben haber mínimo 5 correos para continuar.");
    return;
  }
  modalReporte.value = false;
  loadingModal.value = true;
  if (props.tipoReporte == 1) {
    sgdeaAxios.post(`/reportes/devoluciones/enviar-reporte`, {
      destinatarioFiltro: props.filterForm.destinatario.val,
      oficinaFiltro: props.filterForm.selectOficina.val,
      canalEnvio: props.filterForm.selectCanalEnvio.val,
      fechaInicial: props.filterForm.fechaInicial.val,
      fechaFinal: props.filterForm.fechaFinal.val,
      correos: correosSelecionador,
      tipo: typeVal,
    }).then(() => {
      toast.success("El reporte ha sido enviado con éxito a los correos ingresados");
    }).catch(() => toast.error("Hubo un error al enviar el correo"))
      .finally(() => loadingModal.value = false)
  }
  else if (props.tipoReporte == 2) {
    sgdeaAxios.post(`/reportes/entradas/enviar-reporte`, {
      page: props.pagination?.value?.page >= 1 ? props.pagination.value.page - 1 : 0,
      canalRadicacion: String(props.filterForm.selectCanalRadicacion?.val?.value ?? null),
      estado: props.filterForm.selectEstado.val?.label !== 'Todos' ? props.filterForm.selectEstado.val?.label?.toLowerCase() : null,
      tipoTramite: String(props.filterForm.selectTipoTramite?.val?.id ?? null),
      oficina: String(props.filterForm.selectOficina?.val?.label ?? null),
      radicado: props.filterForm.radicado?.val?.toLowerCase() ?? null,
      fechaInicial: props.filterForm.fechaInicial?.val ?? null,
      fechaFinal: props.filterForm.fechaFinal?.val ?? null,
      size: props.pagination?.value?.rowsPerPage ?? 10,
      correos: correosSelecionador,
      tipo: typeVal,
    }).then(() => {
      toast.success("El reporte ha sido enviado con éxito a los correos ingresados");
    }).catch(() => toast.error("Hubo un error al enviar el correo"))
      .finally(() => loadingModal.value = false)
  }
  else if (props.tipoReporte == 3) {
    sgdeaAxios.post(`/reportes/internos/enviar-reporte`, {
      oficinaOrigenId: props.filterForm.selectOficinaOrigen.val,
      oficinaDestinoId: props.filterForm.selectOficinaDestino.val,
      fechaInicial: props.filterForm.fechaInicial.val,
      fechaFinal: props.filterForm.fechaFinal.val,
      correos: correosSelecionador,
      tipo: typeVal,
    }).then(() => {
      toast.success("El reporte ha sido enviado con éxito a los correos ingresados");
    }).catch(() => toast.error("Hubo un error al enviar el correo"))
      .finally(() => loadingModal.value = false)
  }
  else if (props.tipoReporte == 4) {
    sgdeaAxios.post(`/reportes/reasignaciones/enviar-reporte`, {
      fechaInicial: props.filterForm.fechaInicial.val,
      fechaFinal: props.filterForm.fechaFinal.val,
      correos: correosSelecionador,
      tipo: typeVal,
    }).then(() => {
      toast.success("El reporte ha sido enviado con éxito a los correos ingresados");
    }).catch(() => toast.error("Hubo un error al enviar el correo"))
      .finally(() => loadingModal.value = false)
  }
  else if (props.tipoReporte == 5) {
    sgdeaAxios.post(`/reportes/observaciones/enviar-reporte`, {
      fechaInicial: props.filterForm.fechaInicial.val,
      fechaFinal: props.filterForm.fechaFinal.val,
      idRadicado: props.filterForm.radicado.val,
      correos: correosSelecionador,
      tipo: typeVal,
    }).then(() => {
      toast.success("El reporte ha sido enviado con éxito a los correos ingresados");
    }).catch(() => toast.error("Hubo un error al enviar el correo"))
      .finally(() => loadingModal.value = false)
  }
  else if (props.tipoReporte == 6) {
    sgdeaAxios.post(`/reportes/salidas/enviar-reporte`, {
      page: props.pagination?.value?.page >= 1 ? props.pagination.value.page - 1 : 0,
      fechaInicial: props.filterForm.fechaInicial.val,
      fechaFinal: props.filterForm.fechaFinal.val,
      size: props.pagination?.value?.rowsPerPage ?? 10,
      correos: correosSelecionador,
      tipo: typeVal,
    }).then(() => {
      toast.success("El reporte ha sido enviado con éxito a los correos ingresados");
    }).catch(() => toast.error("Hubo un error al enviar el correo"))
      .finally(() => loadingModal.value = false)
  }
  else if (props.tipoReporte == 7) {
    sgdeaAxios.post(`/reportes/seguimiento-comunicacion-salida/enviar-reporte`, {
      fechaInicial: props.filterForm.fechaInicial.val,
      fechaFinal: props.filterForm.fechaFinal.val,
      estado: props.filterForm.selectEstado.val,
      correos: correosSelecionador,
      tipo: typeVal,
    }).then(() => {
      toast.success("El reporte ha sido enviado con éxito a los correos ingresados");
    }).catch(() => toast.error("Hubo un error al enviar el correo"))
      .finally(() => loadingModal.value = false)
  } else {
    loadingModal.value = false;
  }
}

const changePagination = (val) => {
  emit('pagination', { ...props.pagination, page: val-1 });
  setTimeout(() => emit('onRequest'), 100);
}

watchEffect(() => {
  if (tableReportes.value) {
    rowsCurrentPage.value = tableReportes.value?.computedRows;
  }
});

watch(
  () => props.rows,
  (newValue, oldValue) => {
    originData.value = oldValue;
    filteredData.value = newValue;
  }
);
</script>
