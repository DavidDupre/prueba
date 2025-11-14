<template>
  <div class="tw-mt-10 tw-mx-4">
    <div class="tw-float-right">
      <q-btn icon="add"
        class="tw-bg-[#ff7500] tw-h-10 tw-w-48 tw-text-white tw-font-bold tw-rounded-lg hover:tw-bg-[#dc7347]"
        @click="router.push('admin-prefijos/crear')">Crear
        Prefijo/Oficina</q-btn>
    </div>

    <h2 class="tw-font-bold tw-text-2xl tw-pb-6">Búsqueda de prefijos y oficinas</h2>
    <q-card flat class="tw-p-4 tw-mb-6 tw-rounded-xl">
      <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2">Filtrar por</h2>
      <div class="tw-grid tw-grid-cols-4 tw-gap-4">
        <div class="tw-col-span-1">
          <p class="tw-text-label tw-font-semibold">Prefijo</p>
          <q-select :options="filteredPrefijos" outlined v-model='formData.idPrefijo' label="Inserte" dense
            @filter="filterPrefijos" use-input fill-input hide-selected>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="tw-col-span-1">
          <p class="tw-text-label tw-font-semibold">Oficina</p>
          <q-select :options="filteredOficinas" outlined v-model='formData.idOficina' label="Inserte" dense
            @filter="filterOficinas" use-input fill-input hide-selected>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="tw-col-span-1">
          <p class="tw-text-label tw-font-semibold">Revisión Masiva</p>
          <q-select :options="[{ label: 'Si', value: true }, { label: 'No', value: false }]" outlined
            v-model='formData.revisionMasiva' label="Seleccione" dense />
        </div>
        <div class="tw-col-span-1">
          <p class="tw-text-label tw-font-semibold">Aprobación Automática</p>
          <q-select :options="[{ label: 'Si', value: true }, { label: 'No', value: false }]" outlined
            v-model='formData.aprobacionAutomatica' label="Seleccione" dense />
        </div>
        <div class="tw-col-span-1">
          <p class="tw-text-label tw-font-semibold">Aprobación Masiva</p>
          <q-select :options="[{ label: 'Si', value: true }, { label: 'No', value: false }]" outlined
            v-model='formData.aprobacionMasiva' label="Seleccione" dense />
        </div>
        <div class="tw-col-span-1">
          <p class="tw-text-label tw-font-semibold">Tipo de firma</p>
          <q-select :options="opsFirmas" outlined v-model='formData.idTipoFirma' label="Seleccione" dense />
        </div>
        <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 tw-col-span-1">
          <label class="tw-w-full">
            <p class="tw-text-label tw-font-semibold">Estado</p>
            <q-select :options="estadoOptions" v-model="formData.estado" label="Seleccione" dense outlined
              class="tw-rounded-lg" map-options />
          </label>
        </div>
      </div>
      <br />
      <div class="row tw-flex tw-justify-center tw-gap-6 [&>*]:tw-p-2 tw-h-10">
        <q-btn label="Limpiar filtros" color="accent" textColor="black" class="tw-rounded-lg col-2"
          @click="resetForm" />
        <q-btn label="Buscar" color="primary" class="tw-rounded-lg col-2" @click="search" />
      </div>
    </q-card>
    <q-card flat class="tw-p-4 tw-rounded-xl tw-justify-between">
      <div class="tw-flex tw-justify-between">
        <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2 tw-ml-6">Listado de prefijos y oficinas</h2>
        <q-btn-dropdown color="accent" textColor="secondary" label="Exportar" class="tw-mt-1 tw-mr-2"
          style="width: 116px; height: 30px; border-radius: 8px" no-caps dropdown-icon="expand_more">
          <q-list separator dense>
            <q-item clickable v-close-popup @click="exportPDF">
              <q-item-section avatar>
                <q-avatar square>
                  <q-img v-lazy :data-url="PDFIcon" alt="csv" width="24px" height="24px" />
                </q-avatar>
              </q-item-section>
              <q-item-section>Exportar PDF</q-item-section>
            </q-item>

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
              <q-item-section>Exportar Excel</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <div :key="key" class="my-custom-table">
        <Table :key="tableKey" :TABLE_HEADER="ASIGNACION_HEADER" :TABLE_BODY="dataTable"
          :TABLE_TOTAL_ROWS="dataTableTotalRows" :selection="undefined" :isLoading="loadingTable"
          v-model:item-selected="selection" @handle-edit-data="handleCaso"
          @show-document-plantilla="onShowDocumentPlantilla" @handlePageChange="handlePageChange"
          @handleRowsPerPageChange="handleRowsPerPageChange" icon="edit" @update:item-selected="handleItemSelected" />
      </div>
    </q-card>
  </div>

  <q-dialog v-model="showModal" persistent>
    <q-card class="tw-h-full tw-w-[2000px] tw-z-[1000] tw-overflow-hidden">
      <q-btn @click="showModal = false"
        class="tw-absolute tw-ml-5 tw-mt-20 tw-z-[2000] tw-text-white tw-bg-red-500">Cerrar</q-btn>
      <iframe class="tw-h-full tw-w-full" :src="iframePdfUrl" frameborder="0"></iframe>
    </q-card>
  </q-dialog>

</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import Table from './TablePrefijosOficinas.vue';
import { ASIGNACION_HEADER, EXPORT_HEADER } from '.';
import { useRouter } from 'vue-router';
import { sgdeaAxios } from "src/services";
import * as XLSX from 'xlsx';
import { exportFile } from 'quasar';
import csv from "../../../assets/csv.svg";
import excel from "../../../assets/excel.svg";
import PDFIcon from "src/assets/pdf.svg";
import jsPDF from 'jspdf';
import 'jspdf-autotable'
import moment from 'moment';
import { toast } from 'src/helpers/toast';

const opsFirmas = ref([])
const dateNow = moment().format('DD-MM-YYYY')
const sizeTotal = ref(20)
const modifiedTable = ref([])
const showModal = ref(false)
const router = useRouter()
const dataTable = ref([]);
const key = ref(0);
const tableKey = ref(0)
const dataTableTotalRows = ref(0);
const columnsExport: any = EXPORT_HEADER
const selection = ref([]);
const formData = ref({
  idPrefijo: '',
  idOficina: '',
  revisionMasiva: '',
  aprobacionMasiva: '',
  aprobacionAutomatica: '',
  estado: '',
  idTipoFirma: '',
})

const iframePdfUrl = ref()
const listadoPrefijos = ref()
const listadoOficinas = ref()
const filteredPrefijos = ref()
const filteredOficinas = ref()
const estadoOptions = ref([
  { label: 'Activo', value: true },
  { label: 'Inactivo', value: false }
])
let loadingTable = ref(false);
const totalElements = ref()
const totalPages = ref()

onMounted(async () => {
  await getPrefijosOficina(0, 20, undefined)
  await getPrefijos()
  await loadOficinas()
  await loadFirmas()
})

const getPrefijos = async () => {
  const getPrefijos = await sgdeaAxios.get('/medicina/prefijos');
  listadoPrefijos.value = getPrefijos.data.map((e) => {
    return {
      label: e.nombre,
      value: e.id,
    }
  }).filter(e => e.activo !== true)
  }

const getPrefijosOficina = async (page: number, size: number, filters: object) => {
  const body = {
    size: size,
    page: page,
    ...filters
  }

  try {
    const getDataPrefijosOficina = await sgdeaAxios.post('/medicina/prefijo-oficina/filtrar', body);
    totalElements.value = getDataPrefijosOficina.data
    totalPages.value = getDataPrefijosOficina.data
    sizeTotal.value = getDataPrefijosOficina.data.totalElements

    const newValuesPrefijos = getDataPrefijosOficina.data.content.map((row) => {
      return {
        ...row,
        nombre: row?.prefijo?.nombre,
        descripcion: row?.prefijo?.descripcion,
        fecha_c: row?.fechaCreacion,
        oficina: row?.oficina?.nombre,
        aprobador: row?.aprobador?.firstname ? row?.aprobador?.firstname + ' ' + row?.aprobador?.lastname : '-',
        firma: row?.tipoFirma?.tipoFirma,
        usuario: row?.usuario?.firstname ? row?.usuario?.firstname + ' ' + row?.usuario?.lastname : '-',
        proceso: row?.subProceso?.proceso?.proceso || '-',
        subproceso: row?.subProceso?.subProceso || '-'
      }
    }).filter((e: { prefijo: { id: number; }; }) => e.prefijo?.id !== 1)

    dataTable.value = [...newValuesPrefijos]
    dataTableTotalRows.value = getDataPrefijosOficina.data.totalPages
  } catch (error) {
    toast.error("Ha ocurrido un error al cargar los prefijos")
  }
}

const loadOficinas = async () => {
  const response = await sgdeaAxios.get('oficinas/all')
  listadoOficinas.value = response.data.map((e) => {
    return {
      label: e.nombre,
      value: e.id,
    }
  })
  listadoOficinas.value = listadoOficinas.value.filter((e) => { return e.value !== 26 })
}

const loadFirmas = async () => {
  const getFirmas = await sgdeaAxios.get('/medicina/tipos-firmas')
  opsFirmas.value = getFirmas.data.map((item) => ({
    label: item.tipoFirma,
    value: item.id,
  }))
}

const handleCaso = (id) => {
  router.push(`admin-prefijos/${id}`)
}

const handlePageChange = async (event) => {
  await getPrefijosOficina(event.page - 1, event.rowsPerPage, undefined)
}

const handleRowsPerPageChange = async (event) => {
  await getPrefijosOficina(event.page, event.rowsPerPage, undefined)
}

const resetForm = async () => {
  formData.value = {
    idPrefijo: '',
    idOficina: '',
    revisionMasiva: '',
    aprobacionMasiva: '',
    aprobacionAutomatica: '',
    estado: '',
    idTipoFirma: '',
  }
  await getPrefijosOficina(0, 20, undefined)
}

const search = async () => {
  const filter = {
    idPrefijo: formData.value?.idPrefijo,
    idOficina: formData.value?.idOficina,
    revisionMasiva: formData.value?.revisionMasiva,
    aprobacionAutomatica: formData.value?.aprobacionAutomatica,
    aprobacionMasiva: formData.value?.aprobacionMasiva,
    idTipoFirma: formData.value?.idTipoFirma,
    estado: formData.value?.estado,
  };

  if (Object.values(filter).every(val => !val)) {
    toast.error('Por favor, seleccione al menos un filtro.');
    return;
  }

  const entries = Object.entries(formData.value);
  const entriesFiltered = entries.filter(([_, val]) => val);
  const dataObjet = entriesFiltered.reduce((acc, [key, val]) => {
    //@ts-ignore
    return { ...acc, [key]: val.value }
  }, {})

  await getPrefijosOficina(0, 20, dataObjet)
}

const filterPrefijos = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredPrefijos.value = listadoPrefijos.value
    })
    return
  }
  update(() => {
    filteredPrefijos.value = listadoPrefijos.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const filterOficinas = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredOficinas.value = listadoOficinas.value
    })
    return
  }
  update(() => {
    filteredOficinas.value = listadoOficinas.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const onShowDocumentPlantilla = async (nodeId) => {
  const { data } = await sgdeaAxios.get(`/radicados/consultar_documento/${nodeId}`)

  const byteCharacters = atob(data.base64x);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], { type: 'application/pdf' });

  iframePdfUrl.value = URL.createObjectURL(blob);
  showModal.value = true
}

function csvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;
  formatted = formatted === void 0 || formatted === null ? "" : String(formatted);
  formatted = formatted.split('"').join('""');
  return `"${formatted}"`;
}

watch(() => dataTable.value, () => {
  modifiedTable.value = dataTable.value.map((row) => {
    return {
      ...row,
      activo: row.activo ? 'Activo' : 'Inactivo',
      plantilla: row?.plantilla ? 'SI' : 'NO',
    }
  })
})

const handleItemSelected = (item) => {
  if (item.length) {
    modifiedTable.value = item.map((row) => {
      return {
        ...row,
        activo: row.activo ? 'Activo' : 'Inactivo',
        plantilla: row?.plantilla ? 'SI' : 'NO',
      }
    })
  } else {
    modifiedTable.value = dataTable.value.map((row) => {
      return {
        ...row,
        activo: row.activo ? 'Activo' : 'Inactivo',
        plantilla: row?.plantilla ? 'SI' : 'NO',
      }
    })
  }
}

const exportCSV = () => {
  const content = [
    columnsExport.map((col) => csvValue(col.label, undefined, undefined)),
    ...modifiedTable.value.map((row) =>
      columnsExport.map((col) =>
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

  const status = exportFile(`Listado Prefijos-Oficinas-${dateNow}.csv`, content, "text/csv");

  if (status !== true) {
    toast.error('El navegador rechazó la descarga del archivo...')
  } else {
    toast.success('La información se descargo correctamente')
  }
};

const exportXLSX = () => {
  let ws_data = [
    columnsExport.map((col) => col.label),
    ...modifiedTable.value.map((row) =>
      columnsExport.map((col) => {
        let value = typeof col.field === "function"
          ? col.field(row)
          : row[col.field === void 0 ? col.name : col.field];
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
    XLSX.writeFile(wb, `Listado Prefijos-Oficinas-${dateNow}.xlsx`);
    toast.success('La información se descargo correctamente')
  } catch (error) {
    toast.error('El navegador rechazó la descarga del archivo...')
  }
};

const exportPDF = () => {
  const doc = new jsPDF({
    orientation: 'landscape',
    format: 'a4'
  });
  const header = EXPORT_HEADER.map((col) => col.label);

  const data = modifiedTable.value.map((row) =>
    columnsExport.map((col) => {
      let value = typeof col.field === "function"
        ? col.field(row)
        : row[col.field === void 0 ? col.name : col.field];
      if (col.format && typeof col.format === "function") {
        value = col.format(value);
      }
      return value;
    })
  );

  // @ts-ignore
  doc.autoTable({
    head: [header],
    body: data,
    tableWidth: 'wrap',
    theme: 'grid',
    styles: { cellPadding: 0.5, fontSize: 7 },
    startY: 20,
    horizontalPageBreak: true,
  });
  doc.save(`Listado Prefijos-Oficinas-${dateNow}.pdf`);
  toast.success('La información se descargo correctamente')
};

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
