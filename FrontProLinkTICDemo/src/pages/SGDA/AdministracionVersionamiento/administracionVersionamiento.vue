<template>
  <div>
    <BreadCrumbs :crumbs="routes" />
    <div class="tw-flex tw-justify-between tw-items-center tw-pt-4 tw-mb-8">
      <h2 class="tw-font-bold tw-text-4xl tw-py-4">Administración Versionamiento</h2>
      <a href="SGDA/administracion-versionamiento/crear">
        <q-btn label="Crear Versión" color="secondary" icon="add" class="tw-h-10 tw-rounded-lg" />
      </a>
    </div>

    <div>
      <q-card class="tw-flex tw-flex-col tw-rounded-xl" flat>

        <p class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">Filtros</p>

        <div class="tw-grid tw-grid-cols-4 tw-px-8 row q-col-gutter-md q-pb-md " :key="tableKey">

          <span class="tw-cols-1">
            <label class="tw-text-label" for="">Código versión</label>
            <q-input type="number" v-model="form.codigo" outlined dense class="tw-rounded-lg" label="Inserte"
              :rules="[v => lengthValidation(5, v)]" />
          </span>


          <span class="tw-cols-1">
            <label class="tw-text-label" for="">Nombre versión</label>
            <q-input v-model="form.nombreVersion" outlined dense class="tw-rounded-lg" label="Inserte"></q-input>
          </span>


          <span class="tw-cols-1">
            <label class="tw-text-label" for="">Fecha versión</label>
            <DatePicker v-model:input-data-prop="form.fechaVersion" label="aaaa - mm - dd" mask="YYYY-MM-DD"
              :rules="[validateDateWithoutLimit]" />
          </span>


          <span class="tw-cols-1">
            <label class="tw-text-label">Fondo</label>
            <q-select outlined v-model="form.fondo" map-options emit-value :options="fondoptions" label="Seleccione"
              dense />
          </span>

          <span class="tw-cols-1">
            <label class="tw-text-label" for="">Estado</label>
            <q-select v-model="form.estado" outlined dense class="tw-rounded-lg" label="Seleccione"
              :options="stateOptions" />
          </span>

          <span class="tw-cols-1">
            <label class="tw-text-label" for="">Fecha inicial</label>
            <DatePicker v-model:input-data-prop="form.fechaInicio" label="aaaa - mm - dd" mask="YYYY-MM-DD"
              :rules="[validateDateWithoutLimit]" />
          </span>

        </div>
        <span class="w-full flex justify-center tw-gap-4">

          <q-btn label="Limpiar Filtros" color="accent" textColor="secondary" class="tw-rounded-lg tw-p-3 tw-w-[200px]"
            @click="resetForm"></q-btn>
          <q-btn label="Buscar" color="secondary" class="tw-rounded-lg tw-p-3 tw-w-[200px] text-bold"
            @click="filterTable"></q-btn>
        </span>
      </q-card>

      <q-card class="tw-mt-6 tw-rounded-xl tw-p-7" flat>
        <div class="flex flex-center justify-between">
          <p class="tw-text-2xl tw-pl-6">Versionamiento</p>
        </div>

        <Table :TABLE_HEADER="PERIOCIDAD_HEADER" :TABLE_BODY="dataTable" selection="single" :msg-no-data="msgFilter"
          row-key="id" />
      </q-card>
    </div>

    <Modal v-model="errorModal" title="¡Error!" text="Ha ocurrido un error al intentar exportar el archivo"
      :is-success="false" text-button="Aceptar" @handleAccept="handleModal" />
    <Modal v-model="showModal" title="Exportación exitosa" text="El archivo se ha exportado correctamente" is-success
      text-button="¡Ok!" @handleAccept="handleModal" />


    <Modal v-model="errorFile" title="¡Error!" text="Ha ocurrido un error al intentar importar el archivo"
      :is-success="false" text-button="Aceptar" @handleAccept="handleModal" />
    <Modal v-model="succesFile" title="Exportación exitosa" text="El archivo se ha importado correctamente" is-success
      text-button="¡Ok!" @handleAccept="handleModal" />
  </div>
</template>

<script setup lang="ts">
import Table from './table.vue';
import { Ref, computed, onMounted, ref, watch } from "vue"
import { sgdeaAxios } from "src/services";
import DatePicker from 'src/components/FormFields/datePickerComponent.vue';
import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';
import Modal from 'src/components/Modal/Modal.vue'
import service from "src/services/Api";
import { PERIOCIDAD_HEADER, routes } from "."
import { validateDateWithoutLimit } from "src/helpers/validations";
import { VersionTRD } from 'src/interfaces';
import { useLoadingStore } from 'src/stores/loading.store';

const dataTable = ref([])
const data = ref();

const form = ref({
  codigo: "",
  estado: "",
  fechaVersion: "",
  nombreVersion: "",
  fechaInicio: "",
  fechaFin: "",
  observaciones: "",
  fondo: ""
});

const msgFilter = ref('');
const tableKey = ref();
const showModal = ref(false)
const errorModal = ref(false);
const showFiles = ref(false);
const loadData = ref(false);
const succesFile = ref(false);
const errorFile = ref(false);
const modalKey = ref('');
const isFilterTable = ref(false);
const fondoptions: Ref<{ label: string; value: string | number | boolean }[]> = ref([])
onMounted(async () => {
  isFilterTable.value = false
  await getItems()
})

const initialData = ref([])
const getItems = async () => {
  const {data: response} = await sgdeaAxios.get("/fondo/FondosActivos");

  if (response) {
    fondoptions.value = response.map((item: any) => ({
      label: item.nombre,
      value: item.idFondo
    }))
  }

  const { data } = await sgdeaAxios.get<VersionTRD[]>('/versiontrd/list')
  initialData.value = data.map((item: any) => ({ ...item, estados: item.estado }));
  dataTable.value = initialData.value.map((it: any) => ({ ...it, fondoId: it.id_fondo, estados: it.estado }))
}

const file = ref();

const stateOptions = [
  {
    label: 'Diseño',
    value: 55
  },
  {
    label: 'Inactivo',
    value: 56
  },
  {
    label: 'Productivo',
    value: 54
  }
];

watch(file, async (newQuestion) => {
  file.value = newQuestion
})


const resetForm = async () => {
  form.value = ({
    codigo: "",
    estado: "",
    fechaFin: "",
    fechaVersion: "",
    fondo: '',
    fechaInicio: "",
    nombreVersion: "",
    observaciones: ""
  })
  loadData.value = false
  msgFilter.value = ''
  dataTable.value = initialData.value.map((it: any) => ({ ...it, fondoId: it.id_fondo, estados: it.estado }))
}

const lengthValidation = (n, val) => val.length <= n || 'Máximo ' + n + ' carácteres'

function filterTable() {

  service
    .searchAdministracionVerion(
      form.value.codigo,
      form.value.estado.value,
      form.value.fechaVersion,
      form.value.nombreVersion,
      form.value.fechaInicio,
      form.value.fechaFin, "", form.value.fondo
    )
    .then((response) => {

      dataTable.value = [];
      response.map(function (value, key) {
        dataTable.value = [
          ...dataTable.value,
          {
            nombreVersion: value.nombreVersion,
            fechaInicio: value.fechaInicio,
            fechaFin: value.fechaFin,
            id: value.id,
            codigo: value.codigo,
            fechaVersion: value.fechaVersion,
            observaciones: value.observaciones,
            estados: value.estado,
            fondoId: value.id_fondo,
          },
        ];
      });

    })
    .catch((error) => {
      console.error(error);

    });

}
const handleModal = () => {
  if (showModal.value || succesFile.value) {
    showModal.value = false
    succesFile.value = false

    if (!succesFile.value) {
      showFiles.value = false
      modalKey.value++
    }
  } else {
    errorModal.value = false
    errorFile.value = false
  }
}

</script>




<style scoped>
h2,
h3 {
  color: #222222;
}
</style>
