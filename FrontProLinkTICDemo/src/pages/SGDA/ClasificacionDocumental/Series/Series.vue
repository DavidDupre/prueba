<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0  ">
      <BreadCrumbs :crumbs="routes" />
      <div class="tw-flex tw-justify-between tw-pt-4 ">

        <h1 class="tw-text-3xl tw-font-bold">Administración de Series Documentales</h1>
        <q-btn label="Crear Serie Documental" color="secondary" icon="add"
          class="tw-rounded-lg tw-flex-col gap-4 tw-h-[45px]" @click="router.push('/SGDA/series/crear')"></q-btn>
      </div>
      <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
        <p class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">Filtros</p>
        <!-- <q-form @submit.prevent="searchItems"> -->
        <div class="row q-col-gutter-md q-pb-md q-px-md">
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
            <span class="tw-text-label">Fondo </span>
            <q-select outlined v-model="form.fondo" :options="fondoptions"
              @update:model-value="(val) => onChangeFondo(val)" label="Seleccione" dense />

          </div>

          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
            <span class="tw-text-label">Versión</span>
            <q-select dense outlined :options="versiones" v-model="form.version"
              @update:model-value="(val) => onChangeVersion(val)" label="Seleccione" />

          </div>
          <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 tw-gap-4">
            <span class="tw-text-label">Dependencia </span>
            <SearchInput :options="optionsDependencias" v-model:input-data-prop="form.dependencia" />
          </div>
          <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 tw-gap-4">
            <span class="tw-text-label">Código</span>

            <q-input v-model="form.codigo" label="Seleccione" outlined class="mb-3" dense
              :rules="[(val => val.length <= 15 || 'Maximo 15 caracteres')]" />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
            <span class="tw-text-label">Nombre Serie documental </span>
            <q-input v-model="form.descripcion" label="Seleccione" outlined class="mb-3" dense
              :rules="[(val => val.length <= 20 || 'Maximo 20 caracteres')]" />

          </div>

          <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 ">
            <span class="tw-text-label">Estado</span>
            <q-select :options="stateOptions" label="Seleccione" outlined dense v-model="form.estados" />

          </div>
        </div>

        <div class="row tw-flex tw-justify-center tw-gap-6 [&>*]:tw-p-2">
          <q-btn label="Limpiar Filtros" color="accent" textColor="secondary" class="tw-rounded-lg col-2"
            @click="resetForm" />
          <q-btn label="Buscar" @click="searchItems" color="secondary" class="tw-rounded-lg col-2" />
        </div>
        <!-- </q-form> -->
      </q-card>

      <q-card class="q-mt-lg tw-p-7 tw-rounded-xl" flat>
        <p class="tw-text-2xl tw-pl-6">Listado de Series Documentales</p>
        <Table :TABLE_HEADER="Documental_HEADER" :TABLE_BODY="dataTable" :selection="undefined" :msg-no-data="textSearch"
          row-id="idSeriesubserie" />
      </q-card>

    </main>
  </section>
</template>

<script  lang="ts" setup>

import { useRouter } from "vue-router";
import { Ref, ref, onMounted } from "vue";

import { sgdeaAxios } from "src/services";
import { Documental_HEADER, ISearchData, stateOptions, IDataSerie } from ".";

import { formatDate } from "src/helpers/formtDate";

import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';
import DatePicker from 'src/components/FormFields/datePickerComponent.vue';
import Table from 'src/components/Table.vue';
import SearchInput from "src/components/SearchInput/SearchInput.vue";
import { useDependencias } from "src/composables/useEntidades";
import { useLoadingStore } from "src/stores/loading.store";
import { Dependencia, Fondo, Serie, VersionTRD } from "src/interfaces";
const router = useRouter()

const form: Ref<any> = ref({
  descripcion: "",
  estados: '',
  fecha_vigencia_inicial: '',
  fecha_vigencia_final: '',
  codigo: '',
  fondo: "",
  version: "",
  dependencia: "",
  codigo_serie: ""
});
const optionsDependencias = ref([])
const optionsDependenciasBackup = ref([])
const versiones = ref([])
const versionesBackup: Ref<{ label: string, value: any, fondo: any }[]> = ref([])
const textSearch = ref(null)
const dataTable: Ref<Serie[]> = ref([])
const fondoptions: Ref<{ label: string; value: string | number | boolean }[]> = ref([])

onMounted(async () => {
  const { data } = await sgdeaAxios.get<Dependencia[]>(`/seccionSubSeccion`);
  optionsDependenciasBackup.value = data?.map((item: any) => ({
    label: item.nombre,
    value: item.idSeccionSubSeccion,
    version: item.idversiontrd?.id
  })).filter((it: any) => !!it.label && !!it.value);

  await getItems()
  const { data: response } = await sgdeaAxios.get<Fondo[]>("/fondo/FondosActivos");

  if (response) {
    fondoptions.value = response.map((item: any) => ({
      label: item.nombre,
      value: item.idFondo
    }))
  }
  versionesBackup.value = await (await sgdeaAxios.get<VersionTRD[]>('/versiontrd/list')).data.map((item: any) => ({ label: `${item.nombreVersion}`, value: item.id, fondo: item.id_fondo }));
})

const getItems = async () => {
  let { data: response } = await sgdeaAxios.get<Serie[]>(`/serie/allSerie`);

  const series = response.filter((item: any) => {
    return item.padre === null
  })

  dataTable.value = series.map(it => ({
    ...it,
    dependencia: it.seccionSubSeccion?.nombre,
  }))
}

const searchItems = async () => {
  //idSerieSubserie -- Codigo Serie Documental

  const { data, status } =
    await sgdeaAxios.get<Serie[]>(`/serie/buscarSerie?idSeriesubserie=${form.value.codigo_serie ? form.value.codigo_serie : ''}&descripcion=${form.value.descripcion ? form.value.descripcion : ''}&codigo=${form.value.codigo ? form.value.codigo : ''}&estado=${form.value.estados ? form.value.estados.value : ''}&seccionSubSeccion=${form.value.dependencia?.value ? form.value.dependencia?.value : ''}&procedimiento=&padre=`);

  const successStatus = [200, 201, 204];

  if (successStatus.indexOf(status) === -1) {
    textSearch.value = 'No se encontraron datos con los criterios ingresados. Por favor verifique e intente nuevamente.'
    dataTable.value = []
  } else {
    dataTable.value = data?.map((item: any) => ({
      ...item,
      dependencia: item.seccionSubSeccion?.nombre,
    }))
  }
}

const resetForm = () => {
  form.value = ({
    descripcion: "",
    estados: '',
    fechaVigenciaInicial: new Date(),
    fechaVigenciaFinal: new Date(),
    id_padre: ""
  })
  getItems()
}

const onChangeFondo = async (e: Object) => {
  //@ts-ignore
  versiones.value = versionesBackup.value.filter((item) => item.fondo == e.value)
  form.value.version = '';
  form.value.dependencia = '';
  optionsDependencias.value = [];
}

const onChangeVersion = async (e: object) => {

  //@ts-ignore
  optionsDependencias.value = optionsDependenciasBackup.value.filter((item: any) => item.version == e.value)
};
</script>
