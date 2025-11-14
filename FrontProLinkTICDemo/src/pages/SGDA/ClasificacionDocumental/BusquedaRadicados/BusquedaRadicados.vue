<template>
  <div>
    <BreadCrumbs :crumbs="routes" />

    <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold">
      Búsqueda de radicados
    </div>

    <q-card class="tw-rounded-lg tw-p-7" flat>

      <p class="tw-text-2xl tw-font-bold">Filtros</p>

      <q-form ref="CotizacionesForm" class="tw-mt-6" @submit.prevent="searchItems">

        <div class="tw-flex tw-full q-col-gutter-md">
          <div class="tw-w-1/4">
            <p class="tw-text-label">Id Radicado</p>
            <!--            <q-select outlined v-model="form.id_tipo_radicado" :options="radicadoOptions" label="Seleccione" dense/>-->
            <q-input v-model="form.id_radicado" label="Inserte" outlined class="mb-3 " dense type="number"/>
          </div>
<!--          <div class="tw-w-1/4">-->
<!--            <p class="tw-text-label">Tipo de radicado</p>-->
<!--            <q-select outlined v-model="form.id_tipo_radicado" :options="rOptions" label="Seleccione" dense />-->
<!--          </div>-->
          <!--          <div class="tw-w-1/4">-->
          <!--            <p class="tw-text-label">ID Tipo radicado</p>-->
          <!--            <q-input outlined v-model="form.id_radicado" :options="options" label="Seleccione" dense/>-->
          <!--          </div>-->
          <div class="tw-w-1/4">
            <p class="tw-text-label">Tipo de documento</p>
            <q-select outlined v-model="form.id_tipo_documento" :options="tipoDocument" label="Seleccione" dense />
          </div>
          <div class="tw-w-1/4">
            <p class="tw-text-label">Número de documento</p>
            <q-input outlined v-model="form.documento" :options="options" label="Inserte" dense type="number" 
            :rules="[inputRequired, v => maxLengthInput(15, v), Number(form.id_tipo_documento) == 11 ? alphanumeric : (v: string) => onlyNumbers(v)]"
              @keypress="Number(form.id_tipo_documento) == 11 ? alphanumeric : onlyNumbers" />
          </div>
          <div class="tw-w-1/4">
            <p class="tw-text-label">Fecha de radicado</p>
            <!--            <Datepicker label="Fecha radicado" required v-model:input-data-prop="form.fecha_radicado" />-->
            <q-input label="Fecha radicado" outlined v-model="form.fecha_radicado" mask="date" class="col-6"
              :dense="true">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.fecha_radicado">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="accent" flat></q-btn>
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
        <div class="tw-flex tw-full q-col-gutter-md">

          <div class="tw-w-1/4">
            <p class="tw-text-label">Tipo de radicado</p>
            <q-select outlined v-model="form.id_tipo_radicado" :options="rOptions" label="Seleccione" dense />
          </div>
        </div>

        <!--        <div class="tw-flex tw-full q-col-gutter-md tw-mt-0">-->
        <!--          <div class="tw-w-1/4">-->
        <!--            <p class="tw-text-label">Tipo de radicado</p>-->
        <!--            <q-select outlined v-model="form.id_radicado" :options="radicadoOptions" label="Seleccione" dense/>-->
        <!--          </div>-->
        <!--        </div>-->

        <div class="col col-12 row justify-center q-gutter-x-md q-mt-xl">
          <q-btn label="Limpiar filtros" style="width: 240px; " text-color="black" color="accent" class="tw-rounded-xl -lighter"
            @click="resetForm" />
          <q-btn label="Buscar" text-color="white" style="width: 240px;" class="tw-rounded-xl tw-p-2 " color="secondary" dense
            type="submit" />
        </div>
      </q-form>
    </q-card>
    <q-card class="q-pa-md tw-mt-4 tw-rounded-lg" flat>
      <div class="col row tw-flex tw-justify-between tw-items-center tw-pb-4">
        <p class="q-pa-md tw-font-bold tw-text-2xl">Listado de radicados</p>

        <div class="tw-flex tw-gap-4">
          <!--          <q-btn-->
          <!--            label="Importar"-->
          <!--            style="width: 120px; height: 20px; color: #003352"-->
          <!--            class="tw-rounded-xl tw-border-2"-->
          <!--          />-->

          <ExportFile @exportFiles="handleExportSelect" :disabled="dataTable.length <= 0" />
        </div>
      </div>
      <Table :TABLE_HEADER="header" key-id="id" :TABLE_BODY="dataTable" :selection="undefined" icon="visibility"
             msgNoData="No se encontraron datos con los criterios ingresados. Por favor verifique e intente nuevamente"/>
    </q-card>
    <Modal v-model="errorModal" title="¡Error!" text="Ha ocurrido un error al intentar exportar el archivo"
      :is-success="false" text-button="Aceptar" @handleAccept="handleModal" />
    <Modal v-model="showModal" title="Exportación exitosa" text="El archivo se ha exportado correctamente" is-success
      text-button="¡Ok!" @handleAccept="handleModal" />
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { onMounted, onUpdated, Ref, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import moment from "moment/moment";
import {
  onlyNumbers,
  maxLengthInput,
  inputRequired,
  alphanumeric,
} from "src/helpers/validations";

import Table from 'src/components/Table.vue';
import BreadCrumbs from 'components/BreadCrumbs/BreadCrumbs.vue';
import Modal from 'components/Modal/Modal.vue';
import Datepicker from 'components/FormFields/datePickerComponent.vue';
import TableComponent from 'components/Tables/TableComponent.vue';
import { tipoDocument } from '../../../../constantes/tipoDocumento'
//import { radicadoOptions } from '../../../../constantes/tipoRadicado'

import { ISearchData } from "pages/SGDA/ClasificacionDocumental/Series";
import ExportFile from 'components/FormFields/exportFiles.vue'

import { routes, header } from ".";
import exportService from "src/services/ExportService";
import { sgdeaAxios } from 'src/services';

const options = ref([])
const file = ref();
const radicadoOptions = ref([])

const dataTable = ref([]);
const dataTemp = ref([])
const q = useQuasar();
const route = useRoute()
const router = useRouter()
const showModal = ref(false)
const errorModal = ref(false);

const form = ref({
  id_radicado: "",
  id_tipo_radicado: "",
  id_tipo_documento: '',
  documento: '',
  fecha_radicado: '',
  id_padre: ""
});


const resetForm = () => {
  form.value = ({
    id_radicado: "",
    id_tipo_radicado: "",
    id_tipo_documento: '',
    documento: '',
    fecha_radicado: '',
    id_padre: ""
  })

  dataTable.value = [];
  loadData()
}

const searchItems = async () => {

  loadData();

}


const handleExportSelect = async (item: string) => {

  const tvdList = {
    tvdList: JSON.parse(JSON.stringify(dataTable.value))
  }


  try {
    const headers = {
      "Accept": "*/*",
      "Content-Type": "application/json"
    }
    let response: any;
    if (item.toLowerCase() == 'excel') {
      response = await sgdeaAxios.post(
        `/operacionesradicados/export/${item.toLowerCase()}?tipoArchivo=xls`,
        {
          tvdList: tvdList.tvdList
        });
    }
    else {
      response = await sgdeaAxios.post(
        `/operacionesradicados/export/${item.toLowerCase()}`,
        {
          tvdList: tvdList.tvdList
        });
    }

    await exportService.Download(item.toLowerCase(), response.data);

    if ([200, 201].includes(response.status)) {
      showModal.value = true
    }
  } catch (e) {
    errorModal.value = true
  }
}

const handleModal = () => {
  if (showModal.value) {
    showModal.value = false
  } else {
    errorModal.value = false
  }
}

onMounted(async () => {
  await loadDataFilter();
  await loadData();
});
async function loadData() {
  // const { data } = await sgdeaAxios.get(`/radicados/search?page=0&size=10`)

  const {data}  = (await sgdeaAxios.post("/operacionesradicados/paginate?pageNumber=0&pageSize=10000", {
    idRadicado: form.value.id_radicado ? parseInt(form.value.id_radicado) : null,
    tipoDocumento:form.value.id_tipo_documento ? form.value.id_tipo_documento.value : null,
    numeroDocumento: form.value.documento ? parseInt(form.value.documento) : null,
    fechaRadicado: form.value.fecha_radicado ? form.value.fecha_radicado.split("T")[0] : null,
    tipoRadicado: form.value.id_tipo_radicado ? form.value.id_tipo_radicado.value : null
  }))

  const  dataDoc  = await sgdeaAxios.get(`/entidades/list/1`)

  let index = 1;
  dataTable.value = []
  dataTable.value = [...dataTable.value, ...data.content.map((val: any) => {
    return {
      uid: index++,
      id: val.idRadicado,
      id_tipo_documento: dataDoc.data.find((valu:any)=>valu.idEntidad == val.idTipoDocumento).descripcion ,
      documento: val.documento,
      nombre_completo: val.nombreCompleto,
      fecha_radicado: val.fechaRadicado.split("T")[0],
      id_tipo_radicado: val.tipoRadicado ? val.tipoRadicado.nombreTipoRadicado : '',
      id_tipo_documental: val.tipoDocumentaL ? val.tipoDocumentaL.descripcion : '',
    }
  })]

  dataTemp.value = data;

}


const rOptions: Ref<any[]> = ref([])
async function loadDataFilter() {
  const { data } = await sgdeaAxios.get(`/tiporadicados/list`)

  rOptions.value = [...radicadoOptions.value, ...data.map((val: any) => {
    return {
      label: val.nombreTipoRadicado,
      value: val.idTipoRadicado
    }
  })]

  const  dataDoc  = await sgdeaAxios.get(`/entidades/list/1`)

  tipoDocument.value = []
  tipoDocument.value = [...tipoDocument.value, ...dataDoc.data.map((val:any)=>{
    return{
      label: val.descripcion,
      value: val.idEntidad,
    }
  })]


}
</script>

<style lang="scss" scoped></style>

<style>

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] { -moz-appearance:textfield; }
</style>
