<template>
  <div>
    <BreadCrumbs :crumbs="routes" />

    <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold">
      Tablas de Valoración Documental
    </div>

    <q-card class="tw-rounded-xl tw-p-7" flat>

      <p class="tw-text-2xl tw-font-bold">Filtros</p>

      <q-form ref="CotizacionesForm" class="tw-mt-6">

        <div class="tw-flex tw-full q-col-gutter-md">
          <div class="tw-w-1/4">
            <p class="tw-text-label">Dependencia</p>
            <SelectDependecias :tvd="true" v-model:input-data-prop="filtersSearch.dependencia"/>
          </div>
          <div class="tw-w-1/4">
            <p class="tw-text-label">Disposición final</p>
            <q-select outlined v-model="filtersSearch.disposicionFinal" :options="disposiicionFinalOptions" label="Seleccione" dense/>
          </div>
          <div class="tw-w-1/4">
            <p class="tw-text-label">Serie</p>
            <q-select outlined v-model="filtersSearch.serie" :options="optionsSerie" label="Seleccione" dense/>
          </div>
          <div class="tw-w-1/4">
            <p class="tw-text-label">Subserie</p>
            <q-select outlined v-model="filtersSearch.subserie" :options="optionsSubserie" label="Inserte" dense/>
          </div>
        </div>

        <div class="tw-flex tw-full q-col-gutter-md tw-mt-0">
          <div class="tw-w-1/4">
            <p class="tw-text-label">Procedimiento</p>
            <q-input outlined v-model="filtersSearch.procedimiento" label="Inserte" dense/>
          </div>
        </div>

        <div class="col col-12 row justify-center q-gutter-x-md q-mt-lg">
          <q-btn @click="onClearFilter" label="Limpiar filtros" style="width: 240px;" color="accent" text-color="black"
                 class="tw-rounded-xl tw-p-2" />
          <q-btn label="Buscar" text-color="white" style="width: 240px;" class="tw-rounded-xl" color="secondary" dense @click="searchItems"/>
        </div>
      </q-form>
    </q-card>
    <q-card class="q-pa-md tw-mt-6 tw-rounded-xl" flat>
      <div class="col row tw-flex tw-justify-between">
        <p class="q-pa-md tw-font-bold tw-text-2xl">Tablas de valoración documental</p>

        <div class="tw-flex tw-gap-4 tw-items-center">
          <q-btn label='Importar' class="tw-h-[30px] tw-rounded-xl tw-border-2" @click="() => showFiles = true" color="white" text-color="black"></q-btn>
          <ExportFile @exportFiles="handleExportSelect"/>
          <FileModal
            title="Importación de TVD"
            text-button="Importar"
            v-model:file="file"
            v-model="showFiles"
            v-model:input-data-prop="selectValue"
            @handle-accept="confirm"
            accept-file=".csv, .xlsx"
            destino-title="Seleccione periodicidad destino importación"
            :options-select="optionsVersion"
            :key="modalKey"
          />
        </div>
      </div>

      <TableComponent
        :BODY_TABLE="dataTable"
        v-model:selected="rowsSelected"
        selection="multiple"
        :SUB_HEADER_TABLE="cols"
        :COLUMN_TABLE="header"
        row-key="id"
        :msg-no-data="msgFilter"
      />

    </q-card>
    <Modal v-model="errorModal" title="¡Error!"
           text="Ha ocurrido un error al intentar exportar el archivo" :is-success="false" text-button="Aceptar" @handleAccept="handleModal"/>

    <Modal v-model="showModal" title="Exportación exitosa"
           text="El archivo se ha exportado correctamente" is-success text-button="¡Ok!" @handleAccept="handleModal" />

    <Modal v-model="confirmModal" title="¡Espera un momento!" text="¿Seguro que quieres enviar el archivo específico?"
           :is-success="false" text-button="Aceptar" @handleAccept="submitFile(file)" cancel-button text-button-cancel="Cancelar" @closeModal="() => confirmModal = false" />

    <Modal v-model="errorFile" title="¡Error!" text="Ha ocurrido un error al intentar importar el archivo"
           :is-success="false" text-button="Aceptar" @handleAccept="() => errorFile = false" />

    <Modal v-model="succesFile" title="Importación exitosa" text="Se ha importado con éxito el archivo" is-success
           text-button="¡Ok!" @handleAccept="handleModal" />

    <Modal v-model="selectOption" title="¡Ups!" text="Debe seleccionar una periodicidad destino" :is-success="false"
           text-button="¡Ok!" @handleAccept="() => selectOption = false" />
  </div>
</template>
<script lang="ts" setup>
import {onMounted, onUpdated, Ref, ref} from 'vue';

import BreadCrumbs from 'components/BreadCrumbs/BreadCrumbs.vue';
import Modal from 'components/Modal/Modal.vue';
import TableComponent from 'components/Tables/TableComponent.vue';
import ExportFile from 'components/FormFields/exportFiles.vue'
import SelectDependecias from "components/SelectDependencias/SearchSelectDependecias.vue"
import FileModal from 'src/components/Modal/FileModal.vue'

import { cols, columns, routes, header, Filters } from ".";
import {disposiicionFinalOptions} from "src/constantes/valoracionDocumental";
import exportService from "src/services/ExportService";
import {useVersion} from "src/composables/useVersion";
import { sgdeaAxios } from '../../../../services/index';

const rowsSelected = ref([])
const confirmModal = ref(false);
const errorFile = ref(false);
const showFiles = ref(false)
const selectOption = ref(false)
const selectValue = ref('')


const optionsSerie = ref([])
const optionsSubserie = ref([])
const file = ref();
const showModal = ref(false)
const errorModal = ref(false);
const dataTable = ref([]);
const msgFilter = ref('');
const isFilterTable = ref(false);
const succesFile = ref(false);
const modalKey = ref()

const filtersSearch: Ref<Filters> = ref({
  dependencia: null,
  disposicionFinal: null,
  pagina: 0,
  procedimiento: null,
  serie: null,
  subserie: null,
  tamañoPagina: 20000
});

const initialFilters ={
  dependencia: null,
  disposicionFinal: null,
  pagina: 0,
  procedimiento: null,
  serie: null,
  subserie: null,
  tamañoPagina: 20000
}

const dataExport = ref([]);

const { optionsVersion } = useVersion()

onMounted(async () => {
  isFilterTable.value = false
  await loadData();
});

const searchItems = async () => {
  isFilterTable.value = true
  loadData();
}

const submitFile = async (file: any) => {
  file.value = file[0];

  let formdata;
  formdata = new FormData();
  formdata.append("archivo", file[0], "/path/to/file");
  formdata.append("id_version", selectValue.value.value);

  sgdeaAxios.post(
    `/trd/import-excel`, formdata , {
      headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
    .then(response => {
      confirmModal.value = false
      succesFile.value = true
    })
    .catch(error => {
      errorFile.value = true
    });
};

const closeErrorModal = () => {
  errorFile.value = false
  confirmModal.value = false
}

const confirm = () => {
  if(file.value) {
    if (!selectValue.value) {
      selectOption.value = true
    } else {
      confirmModal.value = true;
    }
  } else {
    errorModal.value = true;
  }
}

const handleExportSelect = async (item: string) => {
  let dataResponse;

  let mappedData = rowsSelected.value.map((item: any) => {
    let found = dataExport.value.find(element => item.id === element.id)
    return {...item, ...(found||{}), id: undefined}
  })
  const response = await sgdeaAxios.post("/tvd/exportar", {
    formato: item,
    tvdList: JSON.parse(JSON.stringify(mappedData))
  });

  dataResponse = {
    archivo: response.data.archivo,
    nombre: `TVD-${response.data.nombre}`
  }

  await exportService.Download(item,dataResponse);

  if ([405, 401, 404, 400, 403, 500].includes(response?.status)) {
    errorModal.value = true
  } else if ([200,201].includes(response.status)) {
    showModal.value = true
  }
}

const handleModal = () => {
  if (showModal.value || succesFile.value) {
    showFiles.value = false
    showModal.value = false
    succesFile.value = false
    modalKey.value++
  } else {
    errorModal.value = false
    errorFile.value = false
  }

}

async function onClearFilter() {
  filtersSearch.value = { ...initialFilters };
  loadData();
}

async function loadData(){

  const {data}  = await sgdeaAxios.post("/tvd/filtrar", {
    dependencia: filtersSearch.value.dependencia !== null ? filtersSearch.value.dependencia.value : undefined,
    disposicionFinal: filtersSearch.value.disposicionFinal !== null ? filtersSearch.value.disposicionFinal.value : undefined,
    pagina: 0,
    procedimiento: filtersSearch.value.procedimiento !== null ? filtersSearch.value.procedimiento : undefined,
    serie: filtersSearch.value.serie !== null ? filtersSearch.value.serie.value : undefined,
    subserie: filtersSearch.value.subserie !== null ? filtersSearch.value.subserie.value : undefined,
    tamañoPagina: 20000
  })

  optionsSerie.value = []
  optionsSubserie.value = []

  let contador = 0;
  dataTable.value = [];
  data.forEach((val: any)=>{

    optionsSerie.value = [...optionsSerie.value,{
      label: val.serie.nombre,
      value: val.serie.codigo
    }]


    optionsSubserie.value = [...optionsSubserie.value, ...val.subseries.map((value) => {
      return {
        label: value.descripcion,
        value: value.id_seriesubserie
      };
    })];

    let sstd ='';

    if (val.serie != undefined){
      sstd += val.serie.codigo + ' ' + val.serie.nombre + ', '
    }

    if (val.subseries.codigo != undefined){
      sstd += val.subseries.codigo + ' ' + val.subseries.nombre + ', '
    }

    if (val.tiposDocumentales != undefined){
      sstd += val.tiposDocumentales.codigo + ' ' + val.tiposDocumentales.nombre + ', '
    }

    dataExport.value.push({...val, id:contador+=1})

    dataTable.value = [...dataTable.value,{
      id: contador,
      dependecia: val.dependencia.nombre,
      codigoDependecia: val.dependencia.código,
      series: sstd,
      archivosGestion: '',
      archivosCentral: '',
      CT: val.disposicionFinal.tipo.toLowerCase() === 'ct' ? 'X' : '',
      E: val.disposicionFinal.tipo.toLowerCase() === 'e' ? 'X' : '',
      MD: val.disposicionFinal.tipo.toLowerCase() === 'md' ? 'X' : '',
      S: val.disposicionFinal.tipo.toLowerCase() === 's' ? 'X' : '',
      procedimiento: val.procedimiento,
    }];
  });

  if (!dataTable.value.length) {
    isFilterTable.value = true
    msgFilter.value = 'No se encontraron datos con los criterios ingresados. Por favor verifique e intente nuevamente.'
  } else {
    msgFilter.value = ''
  }

}
</script>

<style lang="scss" scoped>

</style>
