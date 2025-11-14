<template>
  <div>
    <BreadCrumbs :crumbs="routes" />

    <div class="tw-flex tw-flex-col tw-justify-between tw-items-center tw-py-4 md:tw-flex-row">
      <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold lg:tw-ml-8">
        Administración de Subseries Documentales
      </div>
      <a href="SGDA/subseries/crear">
        <q-btn label="Crear Subserie Documental" color="secondary" icon="add"
          class="tw-h-10 tw-rounded-lg tw-min-w-[220px]" />
      </a>
    </div>


    <q-card class="tw-rounded-xl lg:" flat>

      <p class="tw-text-2xl tw-font-bold tw-pt-8 tw-pl-8 ">Filtros</p>

      <div class="q-pl-lg tw-flex tw-w-[90%] tw-flex-wrap tw-mx-auto md:tw-gap-8 md:tw-w-full lg:tw-w-full">
        <div class="tw-w-full md:tw-w-[20%] xl:tw-w-[22%]">
          <p class="tw-text-label">Fondo</p>
          <q-select outlined v-model="filtersSearch.fondo" :options="fondoptions" @update:model-value="(val) => onChangeFondo(val)" label="Seleccione"
                dense />
        </div>
        <div class="tw-w-full md:tw-w-[20%] xl:tw-w-[22%]">
          <p class="tw-text-label">Versión</p>
          <q-select dense outlined :options="versiones" v-model="filtersSearch.version" @update:model-value="(val) => onChangeVersion(val)" label="Seleccione" />
        </div>
        <div class="tw-w-full md:tw-w-[20%] xl:tw-w-[22%]">
          <p class="tw-text-label">Dependecia</p>
          <SearchInput :options="optionsDependencias" v-model:input-data-prop="filtersSearch.seccionSubSeccion" map-options
            emit-value />
        </div>
        <div class="tw-w-full md:tw-w-[20%] xl:tw-w-[22%]">
          <p class="tw-text-label">ID serie documental</p>
          <q-input outlined v-model="filtersSearch.padre" dense label="Buscar" />
        </div>
      </div>

      <div class="q-pl-lg tw-flex tw-w-[90%] tw-flex-wrap tw-mx-auto md:tw-gap-8 md:tw-w-full lg:tw-w-full">
        <div class="tw-w-full md:tw-w-[20%] xl:tw-w-[22%]">
          <p class="tw-text-label">Código subserie documental</p>
          <q-input outlined v-model="filtersSearch.codigo" label="Inserte" dense />
        </div>
        <div class="tw-w-full md:tw-w-[20%] xl:tw-w-[22%]">
          <p class="tw-text-label">Descripción Subserie documental</p>
          <q-input outlined v-model="filtersSearch.descripcion" :options="options" label="Inserte" dense
            :rules="[v => lengthInput(250, v)]" />
        </div>
        <div class="tw-w-full md:tw-w-[20%] xl:tw-w-[22%]">
          <p class="tw-text-label">Estado</p>
          <q-select outlined v-model="filtersSearch.estado"
                    :options="[{ label: 'Activo', value: true }, { label: 'Inactivo', value: false }]" label="Seleccione" dense
                    emit-value map-options />
        </div>
      </div>
      <div class="row tw-flex tw-flex-wrap tw-justify-center tw-gap-6 [&>*]:tw-p-2 tw-mt-8 tw-pb-8  [&>*]:lg:tw-p-3 ">
        <q-btn @click="reset" label="Limpiar Filtros" type="reset" color="accent" textColor="secondary"
          class="tw-rounded-lg tw-w-8/12 tw-max-w-[270px]"></q-btn>
        <q-btn label="Buscar" type="submit" @click="submit" color="secondary"
          class="tw-rounded-lg tw-w-8/12 tw-max-w-[270px]"></q-btn>
      </div>
    </q-card>
    <q-card class="q-pa-md tw-mt-4 tw-rounded-xl" flat>
      <div class="col row">
        <p class="tw-text-2xl tw-pl-6">Listado de Subseries Documentales</p>
      </div>
      <Table :TABLE_HEADER="SUBSERIES_HEADER" :TABLE_BODY="dataTable" :selection="undefined" :key="tableKey"
        row-id="idseriesubserie" />
    </q-card>
    <Modal v-model="showModal" title="Asignación exitosa" :text="`Se ha editado con éxito.`" is-success text-button="¡Ok!"
      @handleAccept="handleModal" />
    <Modal v-model="errorModal" title="Error" text="¡Ha ocurrido un error!" is-success text-button="Aceptar"
      @handleAccept="handleModal" />
  </div>
</template>
<script lang="ts" setup>
import { Ref, ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import BreadCrumbs from 'components/BreadCrumbs/BreadCrumbs.vue';
import Modal from 'components/Modal/Modal.vue';
import Table from 'src/components/Table.vue';
import { SUBSERIES_HEADER, ISearchData, IDataSerie } from ".";
import { lengthInput } from "src/helpers/validations";
import SearchInput from 'src/components/SearchInput/SearchInput.vue';
import { useLoadingStore } from 'src/stores/loading.store';
import { sgdeaAxios } from 'src/services';

const options = ref([])
const tableKey = ref(0)

const router = useRouter()
const showModal = ref(false)
const errorModal = ref(false)
const optionsDependencias = ref([])
const fondoptions: Ref<{ label: string; value: string | number | boolean }[]> = ref([])
const optionsDependenciasBackup: Ref<{ label: string; value: string | number | boolean; fondo: any }[]> = ref([]);
const versionesBackup: Ref<{ label: string; value: string | number | boolean; version: any }[]> = ref([]);
const versiones: Ref<{ label: string; value: string | number | boolean; version: any }[]> = ref([]);

interface Filters {
  id_padre?: string;
  id_seriesubserie?: string;
  fecha_vigencia_inicial?: string;
  fecha_vigencia_final?: string;
  descripcion?: string;
  seccionSubSeccion?: string;
  tiempo_gestion?: string;
  tiempo_central?: string;
  soporte?: string;
  disposicionFinal?: string;
  estado?: string;
  procedimiento?: string;
  fondo?: string;
  version?: string;
  codigo?: string;
}

let codigosOptions = ref([])
const finalOptions = ref('')
const dataTable: Ref<IDataSerie[]> = ref([])

const dataTableBackup: Ref<IDataSerie[]> = ref([])

const filtersSearch: Ref<Filters> = ref({
  codigo: "",
  idSeriesubserie: "",
  descripcion: "",
  seccionSubSeccion: "",
  estado: '',
  fondo: "",
  version: "",
  padre: "",
});

const multipleOptionsDisposicionFinal = (form) => {

  let options = '';

  if (form.ct) {
    options += 'CT ';
  }
  if (form.e) {
    options += 'E ';
  }
  if (form.md) {
    options += 'MT ';
  }
  if (form.s) {
    options += 'S ';
  }

  finalOptions.value = options
  return finalOptions.value
};

onMounted(async () => {

  const { data, status } = await sgdeaAxios.get('/serie/allSubSerie');

  const { data: sec } = await sgdeaAxios.get(`/seccionSubSeccion`);
  optionsDependenciasBackup.value = sec?.map((item: any) => ({
    label: item.nombre,
    value: item.idSeccionSubSeccion,
    version: item.idversiontrd?.id
  })).filter((it: any) => !!it.label && !!it.value);

  if ([200, 201, 202].includes(status)) {

    dataTable.value = data.filter((it) => it.padre !== null)
      .map((item: any) => ({
        codigo: item.codigo,
        descripcion: item.descripcion,
        disposicion_final:  multipleOptionsDisposicionFinal(item),
        estados: item.estados,
        fecha_vigencia_inicial: item.fecha_vigencia_inicial,
        fecha_vigencia_final: item.fecha_vigencia_final,
        observacion: item.observacion,
        padre: item.padre,
        soporte: item.tipo_de_soporte,
        codigoSerie: item.padre?.idSeriesubserie,
        archivoGestion: item.tiempoArchivoGestion,
        archivoCentral: item.tiempoArchivoCentral,
        idseriesubserie: item.idSeriesubserie,
        dependencias: item.seccionSubSeccion?.nombre
      }))
    dataTableBackup.value = dataTable.value;

    codigosOptions.value = data.map((item: any) => ({ label: `${item.id_seriesubserie} ${item.descripcion}`, value: item.idSeriesubserie }))

    const {data:response} = await sgdeaAxios("/fondo/FondosActivos");

    if (response) {
      fondoptions.value = response.map((item: any) => ({
        label: item.nombre,
        value: item.idFondo
      }))
    }
    versionesBackup.value = await (await sgdeaAxios.get('/versiontrd/list')).data.map((item: any) => ({ label: `${item.nombreVersion}`, value: item.id, fondo: item.id_fondo }));
  }
  else {
    dataTable.value = [];
    console.error('Service error')
  }
})

const queryBuilder = (n: string[]) => {
  let str = n.join("&").replace(/ /g, '%20') //.normalize('NFC').replace(/ /g, '+').toLowerCase().replace(/[\u0300-\u036f]/g, "")

  return str
}

const submit = async () => {

  const queries = Object.entries(filtersSearch.value).filter(([key, value]) => value !== null && value !== "").filter(([key, value]) => key !== "fondo" && key !== "version").map((x: string[]) => {
    if (typeof x[1] == 'string') {

      return (x[0] + '=' + x[1].replace(/ /g, '%20').toLowerCase())
    } else {
      return x.join('=')
    }
  })
  const { data, status } = await sgdeaAxios.get(`/serie/buscarSub?${queryBuilder(queries)}`);

  if ([200, 201, 202].includes(status)) {
    dataTable.value = data.map((item: any) => ({
      codigo: item.codigo,
      descripcion: item.descripcion,
      disposicion_final: item.disposicion_final,
      estados: item.estados,
      observacion: item.observacion,
      padre: item.padre,
      soporte: item.tipoSoporte || item.tipo_de_soporte,
      codigoSerie: item.padre?.idSeriesubserie,
      archivoGestion: item.tiempoArchivoGestion,
      archivoCentral: item.tiempoArchivoCentral,
      idseriesubserie: item.idseriesubserie,
      dependencias: item.seccionSubSeccion?.nombre
    }))
  }
  else {
    dataTable.value = [];
    console.error('Service error')
  }

}

function reset() {
  filtersSearch.value = {

  }

  dataTable.value = dataTableBackup.value;
}

const handleModal = () => {
  if (showModal.value) {
    showModal.value = false;
    router.push('/SGDA/subseries')
  } else {
    errorModal.value = false
  }
}


const routes = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'Módulo SGDEA',
  },
  {
    name: 'Clasificación documental',
  },
  {
    name: 'Subseries'
  }// Composition API variant
]

const onChangeFondo = async (e: Object) => {
  //@ts-ignore
  versiones.value = versionesBackup.value.filter((item) => item.fondo == e.value)
}

const onChangeVersion = async (e: object) => {
  //@ts-ignore
  optionsDependencias.value = optionsDependenciasBackup.value.filter((item: any) => item.version == e.value)
};

</script>

<style lang="scss">
.step_circle {
  width: 70px;
  height: 70px;
  border-radius: 100%;
  padding: 10px;
}
</style>
