<template>
  <div>
    <BreadCrumbs :crumbs="routes" />

    <div class="tw-flex tw-justify-between tw-items-center tw-py-4">
      <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold">
        Tablas de Retención Documental
      </div>
    </div>

    <q-card class="tw-rounded-lg tw-p-7" flat>
      <p class="tw-text-2xl tw-font-bold">Filtros</p>

      <q-form ref="CotizacionesForm" class="tw-mt-6">

        <div class="tw-grid tw-grid-cols-4 tw-full tw-gap-4">
          <div class="tw-cols-1">
            <p class="tw-text-label">Código dependencia</p>
            <q-input outlined v-model="filtersSearch.codigoSerie" label="Inserte" :rules="numeroRule" dense
              type="number" />
          </div>

          <div class="tw-cols-1">
            <p class="tw-text-label">Serie</p>
            <q-select outlined v-model="filtersSearch.codigoSubserie" :options="optionsSeries" label="Seleccione" dense />
          </div>

          <div class="tw-cols-1">
            <p class="tw-text-label">Subserie</p>
            <q-select outlined v-model="filtersSearch.estado" :options="optionsSubseries" label="Seleccione" dense />
          </div>

          <div class="tw-cols-1">
            <p class="tw-text-label">Disposición final</p>
            <q-select outlined v-model="filtersSearch.disposicionFinal" :options="optionsDisposicionFinal"
              label="Seleccione" dense />
          </div>


          <div class="tw-cols-1">
            <p class="tw-text-label">Dependencia</p>
            <SelectDependecias :tvd="false" v-model:input-data-prop="filtersSearch.dependencia" />
          </div>
          <div class="tw-cols-1">
            <p class="tw-text-label">Fecha inicial</p>
            <DatePicker mask="YYYY/MM/DD" label="aaaa / mm / dd" v-model:input-data-prop="filtersSearch.tiempoGestion"
              dense />
          </div>
          <div class="tw-cols-1">
            <p class="tw-text-label">Fecha final</p>
            <DatePicker mask="YYYY/MM/DD" label="aaaa / mm / dd" v-model:input-data-prop="filtersSearch.tiempoCentral"
              dense />
          </div>
          <div class="tw-cols-1">
            <p class="tw-text-label">Procedimiento</p>
            <q-input outlined v-model="filtersSearch.procedimiento" label="Inserte" maxlength="264" dense
              :rules="[maxLengthRule]" />
          </div>
        </div>
        <div class="col col-12 row justify-center q-gutter-x-md q-mt-lg">
          <q-btn @click="onClearFilter" label="Limpiar filtros" style="width: 240px" color="accent" text-color="black"
            class="tw-rounded-xl" />
          <q-btn @click="onSearchFilter" label="Buscar" text-color="white" style="width: 240px" color="secondary"
            class="tw-rounded-xl tw-p-2" dense />
        </div>
      </q-form>
    </q-card>
    <q-card class="q-pa-md tw-mt-4 tw-rounded-lg" flat>
      <div class="col row tw-flex tw-justify-between">
        <p class="q-pa-md tw-font-bold tw-text-2xl">
          Listado de tablas de retención documental
        </p>

        <div class="tw-flex tw-gap-4">
          <div>
            <ExportFile @exportFiles="onItemClick" :not-excel="true" />
          </div>
        </div>
      </div>

      <TableComponent :BODY_TABLE="columns" :SUB_HEADER_TABLE="cols" selection="none"
        :COLUMN_TABLE="header"
        msg-no-data="No se encontraron datos con los criterios ingresados. Por favor verifique e intente nuevamente." />
    </q-card>
    <Modal v-model="showModal" v-model:model-value="showFiles" title="¡Espera un momento!"
      text="¿Estás seguro de realizar la importación del archivo?" text-button="Continuar" cancel-button
      @handleAccept="submit" @closeModal="() => showFiles = false" />
    <Modal v-model="selectOption" title="¡Ups!" text="Debe seleccionar una periodicidad destino" :is-success="false"
      text-button="¡Ok!" @handleAccept="() => selectOption = false" />

    <Modal v-model="errorFile" title="¡Error!" text="Ha ocurrido un error al intentar importar el archivo"
      :is-success="false" text-button="Aceptar" @handleAccept="handleModal" />
    <Modal v-model="succesFile" title="Exportación exitosa" text="El archivo se ha exportado correctamente" is-success
      text-button="¡Ok!" @handleAccept="handleModal" />
    <Modal v-model="succesImportFile" title="Importación exitosa" text="El archivo se ha importado correctamente"
      is-success text-button="¡Ok!" @handleAccept="handleModal" />
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from "quasar";
import { onMounted, Ref, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import BreadCrumbs from "components/BreadCrumbs/BreadCrumbs.vue";
import Modal from "components/Modal/Modal.vue";
import DatePicker from "components/FormFields/datePickerComponent.vue";
import TableComponent from "components/Tables/TableComponent.vue";
import service from "../../../../services/TrdService";
import exportService from "../../../../services/ExportService";
import trdService from "../../../../services/TrdService";
import ExportFile from "components/FormFields/exportFiles.vue";
import {
  cols,
  header,
  Filters,
  routes,
  optionsDisposicionFinal,
  disposicionamiento
} from ".";
import axios from "axios";
import SelectDependecias from "components/SelectDependencias/SearchSelectDependecias.vue";
import { sgdeaAxios } from "src/services";

const file = ref();
const showFiles = ref(false);
const succesFile = ref(false);
const errorFile = ref(false);
const selectOption = ref(false)

const filtersSearch: Ref<Filters> = ref({
  codigoSerie: "",
  codigoSubserie: "",
  fechaInicial: "",
  fechaFinal: "",
  descripcion: "",
  tiempoGestion: "",
  tiempoCentral: "",
  soporte: "",
  disposicionFinal: "",
  estado: "",
  procedimiento: "",
  dependencia: ""
});

const initialFilters = {
  codigoSerie: "",
  codigoSubserie: "",
  fechaInicial: "",
  fechaFinal: "",
  descripcion: "",
  tiempoGestion: "",
  tiempoCentral: "",
  soporte: "",
  disposicionFinal: "",
  estado: "",
  procedimiento: "",
  dependencia: ""
};

let columns = ref([]);
const showModal = ref(false);
const errorModal = ref(false);
const optionsSeries = ref([]);
const optionsSubseries = ref([]);
const selectValue = ref('');
const succesImportFile = ref(false)
const modalKey = ref()
let contador = 0;

const numeroRule = [
  (number) => /^[0-9]+$/.test(number) || "Solo se permiten números",
];

onMounted(async () => {
  await loadDataFilter();
  await loadData();
});

const confirm = () => {
  if (file.value) {
    if (!selectValue.value) {
      selectOption.value = true
    } else {
      showModal.value = true;
    }
  } else {
    errorModal.value = true;
  }
}

const submit = async () => {
  let response = await sgdeaAxios.post("/seccionSubSeccion/create", {
    codigo: "95003",
    estado: true,
    fondo: 1,
    idSeccionSubSeccion: 0,
    nombre: "GERENCIA JURÍDICA",
    observacion: "creado",
    padre: null
  });

  if ([405, 401, 404, 400, 403, 500].includes(response?.status)) {
    errorModal.value = true
  } else if ([200, 201].includes(response.status)) {
    showModal.value = true
  }

  const { data: { content } } = await sgdeaAxios.post(
    "/seccionSubSeccion/paginate?pageNumber=0&pageSize=10000",
    { codigoDependencia: "95003" }
  );

  const dependencia = content[0]

  response = await sgdeaAxios.post("/serie/serie", {
    codigo: "2",
    descripcion: "ACCIONES CONSTITUCIONALES",
    disposicion_final: "4",
    estado: true,
    fecha_vigencia_inicial: "2023-09-15",
    fecha_vigencia_final: "2024-01-01",
    idDependencia: Number(dependencia.idSeccionSubSeccion),
    id_padre: 0,
    id_seriesubserie: 0,
    idcc: 0,
    soporte: 1,
    procedimiento: "Documentos que contienen las acciones de tutela que se interponen con el objeto de exigir la protección de los derechos constitucionales fundamentales vulnerados o amenazados por acción u omisión, reguladas por el artículo 86 de la Constitución Política de Colombia.",
    tiempo_central: 2,
    tiempo_gestion: 8,
    observacion: ""
  });

  if ([405, 401, 404, 400, 403, 500].includes(response?.status)) {
    errorModal.value = true
  } else if ([200, 201].includes(response.status)) {
    showModal.value = true
  }

  response = (await sgdeaAxios.get(`/serie/?codigo=2`)).data;

  //@ts-ignore
  const serie = response.filter((item: any) => {
    return item.padre === null
  })[0]

  for (let i = 4; i < 11; i++) {
    response = await sgdeaAxios.post("/serie/serie", {
      codigo: `${i}`,
      descripcion: "ACCIONES CONSTITUCIONALES",
      disposicion_final: "4",
      estado: true,
      fecha_vigencia_inicial: "2023-09-15",
      fecha_vigencia_final: "2024-01-01",
      idDependencia: Number(dependencia.idSeccionSubSeccion),
      id_padre: serie.idSeriesubserie,
      id_seriesubserie: 0,
      idcc: 0,
      soporte: 1,
      procedimiento: "Documentos que contienen las acciones de tutela que se interponen con el objeto de exigir la protección de los derechos constitucionales fundamentales vulnerados o amenazados por acción u omisión, reguladas por el artículo 86 de la Constitución Política de Colombia.",
      tiempo_central: 2,
      tiempo_gestion: 8,
      observacion: ""
    });

    if ([405, 401, 404, 400, 403, 500].includes(response?.status)) {
      errorModal.value = true
    } else if ([200, 201].includes(response.status)) {
      showModal.value = true
    }
  }
}

const handleDownloadFile = async () => {
  const response = await axios.get(`${process.env.API}/trd/file`, { responseType: 'blob' });
  await exportService.Download("excel", response);
};

async function onItemClick(this: any, formato: String) {
  const trdSend = {
    formato: formato,
    trdList: JSON.parse(JSON.stringify(columns.value)),
  };

  var trdExport = await service.TrdExport(trdSend);
  await exportService.Download(formato, trdExport);
}

async function loadDataFilter() {
  let data = await trdService.getSeries();
  data.forEach((objeto: any) => {
    if (objeto.padre === null) {
      optionsSeries.value = [
        ...optionsSeries.value,
        {
          value: objeto.idSeriesubserie,
          label: `${objeto.codigo} ${objeto.descripcion}`,
        },
      ];
    }

    if (objeto.padre !== null) {
      optionsSubseries.value = [
        ...optionsSubseries.value,
        {
          value: objeto.idSeriesubserie,
          label: `${objeto.codigo} ${objeto.descripcion}`,
        },
      ];
    }
  });
}
async function loadData() {
  try {
    const page = await service.getPaginate(
      0,
      10000,
      JSON.parse(JSON.stringify(filtersSearch.value))
    );

    columns.value = [];

    if (!page.content.length) {
      errorModal.value = true;
    }

    page.content.forEach((data: any) => {
      let sstd = "";
      if (data.idSerieSubserie.padre != null) {
        sstd +=
          data.idSerieSubserie.padre.codigo +
          " " +
          data.idSerieSubserie.padre.descripcion +
          ", ";
      }

      if (data.idSerieSubserie != null) {
        sstd +=
          data.idSerieSubserie.codigo +
          " " +
          data.idSerieSubserie.descripcion +
          ", ";
      }

      if (data.tipoDocumento !== null) {
        sstd +=
          data.tipoDocumento.id_tipo_documental + " " + data.tipoDocumento.descripcion;
      }

      columns.value = [
        ...columns.value,
        {
          number: contador += 1,
          dependencia: data.idDependencia.nombre,
          codigoDependencia: data.idDependencia.codigo,
          series: sstd,
          archivosGestion: data?.tiempo_archivo_gestion,
          archivosCentral: data?.tiempo_archivo_central,
          ct: data.ct ? 'X' : '',
          e: data.e ? 'X' : '',
          md: data.md ? 'X' : '',
          s: data.s ? 'X' : '',
          procedimiento: data.procedimiento ? data.procedimiento : '',
        },
      ];

    });
  } catch (e) {
    errorModal.value = true;
  }
}

async function onClearFilter() {
  filtersSearch.value = { ...initialFilters };
  loadData();
}

async function onSearchFilter() {
  loadData();
}

const handleModal = () => {
  if (succesFile.value || succesImportFile.value) {
    succesFile.value = false;
    showFiles.value = false;
    succesImportFile.value = false;
    showModal.value = false;
  }
  modalKey.value++
  errorFile.value = false;
  errorModal.value = false;
};

const maxLengthRule = (value: string) => {
  if (value && value.length > 264) {
    return `Has alcanzado el límite máximo de caracteres 264.`;
  }
  return true;
};
</script>

<style lang="scss">
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
