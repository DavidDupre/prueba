<template>
  <div>
    <BreadCrumbs :crumbs="routes" />

    <div class="tw-flex tw-justify-between tw-items-center tw-py-4">
      <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold">
        Administración de Dependencias
      </div>

      <q-btn label="Crear Dependencia" color="secondary" icon="add" class="tw-h-10 tw-rounded-lg"
        @click="router.push('/SGDA/dependecias/crear')" />
    </div>

    <q-card class="tw-rounded-xl tw-p-7" flat>
      <p class="tw-text-2xl tw-font-bold">Filtros</p>

      <q-form ref="CotizacionesForm" class="tw-mt-6">
        <div class="tw-flex tw-full q-col-gutter-md">
          <div class="tw-w-1/2">
            <p class="tw-text-label">Código dependencia</p>
            <q-input type="text" outlined v-model="filtersSearch.codigoDependencia" label="Inserte" dense
              :rules="[(val) => maxLengthInput(255, val)]" />
          </div>
          <div class="tw-w-1/2">
            <p class="tw-text-label">Nombre dependencia</p>
            <q-input outlined v-model="filtersSearch.nombreDependencia" label="Inserte" dense maxlength="50" :rules="[
              val =>
                nonRequiredAlphanumeric(val)
            ]" />
          </div>
          <div class="tw-w-1/2">
            <p class="tw-text-label">Estado</p>
            <q-select outlined v-model="filtersSearch.estado" :options="binario" map-options emit-value label="Seleccione"
              dense />
          </div>
          <div class="tw-w-1/2">
            <p class="tw-text-label">Versión</p>
            <q-select map-options emit-value outlined v-model="filtersSearch.idversion" :options="versiones"
              label="Seleccione" dense />
          </div>
        </div>

        <div class="col col-12 row justify-center q-gutter-x-md q-mt-lg q-pb-md">
          <q-btn @click="onClearFilter" label="Limpiar Filtros" color="accent" text-color="black" style="width: 240px;"
            class="tw-rounded-xl" />
          <q-btn @click="toFilterTable" label="Buscar" text-color="white" color="secondary" style="width: 240px"
            class="tw-rounded-xl tw-p-2" />
        </div>
      </q-form>
    </q-card>
    <q-card class="q-pa-md tw-mt-4 tw-rounded-xl" flat>
      <div class="col row">
        <p class="q-pa-md tw-text-2xl">Listado de Dependencias</p>
      </div>
      <Table :TABLE_HEADER="SUBSERIES_HEADER" :TABLE_BODY="dataRow" :selection="undefined" row-key="id" row-id="id"
        key-id="id" />
    </q-card>
    <Modal v-model="showModal" title="Asignación exitosa"
      text="Se ha asignado con éxito los tipos documentales a la dependencia x." is-success text-button="¡Ok!" />
  </div>
</template>

<script lang="ts" setup>
import { useQuasar } from "quasar";
import { onMounted, Ref, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  nonRequiredAlphanumeric,
  maxLengthInput
} from "src/helpers/validations"

import BreadCrumbs from "components/BreadCrumbs/BreadCrumbs.vue";
import Modal from "components/Modal/Modal.vue";
import Table from "src/components/Table.vue";
import { SUBSERIES_HEADER, binario } from ".";
import { sgdeaAxios } from "src/services";
import { VersionTRD, Dependencia, SelectInput } from "src/interfaces";
import { useLoadingStore } from "src/stores/loading.store";

interface Filters {
  codigoDependencia: string;
  nombreDependencia: string;
  estado: boolean;
  idversion: string;
}

const router = useRouter();
const showModal = ref(false);
const dataRow = ref([]);
const filtersSearch: Ref<Filters> = ref({
  codigoDependencia: "",
  nombreDependencia: "",
  estado: null,
  idversion: ""
});

const initialFilters = {
  codigoDependencia: "",
  nombreDependencia: "",
  estado: null,
  idversion: ""
};

const routes = [
  {
    name: "Inicio",
    to: "/home",
  },
  {
    name: "Módulo SGDEA",
  },
  {
    name: "Clasificación documental",
    to: "/home",
  },
  {
    name: "Dependencias",
  },
];
const versiones: Ref<SelectInput[]> = ref([])

onMounted(async () => {
  fetchData()
})

async function fetchData() {
  try {
    const { data } = await sgdeaAxios.get<Dependencia[]>('/seccionSubSeccion');
    const { data: versions } = await sgdeaAxios.get<VersionTRD[]>('/versiontrd/list');
    const filteredVersions = versions.map(item => ({ label: item.nombreVersion, value: item.id }))

    versiones.value = filteredVersions;

    if (data) {
      dataRow.value = data.map((item: any) => ({
        id: item.idSeccionSubSeccion,
        codigo: item.codigo,
        nombre: item.nombre,
        idversiontrd: item.idversiontrd?.id,
        estados: item.estado,
        nombreFondo: item.fondo?.idFondo,
        version: item.idversiontrd
      }))


    }

  } catch (err) {
    console.error(err)
  }
}

// dataRow.value = data.map((item) => {
//   id: item.id,
// codigo: item.codigo,
// nombre: item.nombre,
// nombreFondo: item.,
// idversiontrd: number,
// estados: true,
// fondo: string,
// version: string
// })

// onMounted(async () => {
//   await loadData();
// });

async function toFilterTable() {

  const {data: {content: response}} = await sgdeaAxios.post('/seccionSubSeccion/paginate?pageNumber=0&pageSize=10000', {
    codigoDependencia: filtersSearch.value.codigoDependencia,
    nombreDependencia: filtersSearch.value.nombreDependencia,
    estado: filtersSearch.value.estado,
    idversion: filtersSearch.value.idversion,
  })

  dataRow.value = response.map((item: any) => ({
    id: item?.idSeccionSubSeccion,
    codigo: item?.codigo,
    nombre: item?.nombre,
    nombreFondo: item?.fondo?.nombre,
    idversiontrd: item?.idversiontrd?.id,
    estados: item.estado,
    fondo: item.fondo,
    version: item.idversiontrd
  }))

}

// async function loadData() {
//   const { data } = await client.post(
//     "/seccionSubSeccion/paginate?pageNumber=0&pageSize=10000",
//     {
//       codigoDependencia: filtersSearch.value.codigoSerie,
//       nombreDependencia: filtersSearch.value.nombreSerie,
//       estado: filtersSearch.value.estado?.value
//         ? filtersSearch.value.estado.value
//         : filtersSearch.value.estado,
//       idVersion: filtersSearch.value.version
//     }
//   );

//   dataRow.value = [];
//   dataRow.value = [
//     ...dataRow.value,
//     ...data.content.map((val: any) => {
//       return {
//         id: val.idSeccionSubSeccion,
//         codigodependencia: val.codigo,
//         nombre: val.nombre,
//         seccion: val.padre !== null ? val.padre.nombre : "",
//         estados: val.estado,
//         nombreFondo: val.version?.id_fondo ?? "",
//         idVersion: val?.version?.id ?? ""
//       };
//     }),
//   ];

//   versiones.value = (await new httpClient('/versiontrd/list').get()).data.map((item: any) => ({ label: `${item.id} ${item.nombreVersion}`, value: item.id }));
// }

// async function onSearchFilter() {
//   await loadData();
// }

async function onClearFilter() {

  filtersSearch.value = { ...initialFilters };
  await fetchData();

}
</script>

<style lang="scss">
.step_circle {
  width: 70px;
  height: 70px;
  border-radius: 100%;
  padding: 10px;
}
</style>
