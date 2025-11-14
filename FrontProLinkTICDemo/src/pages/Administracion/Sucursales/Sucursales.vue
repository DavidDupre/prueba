<template>
  <div>
    <BreadCrumbs :crumbs="routes" />

    <div class="tw-flex tw-justify-between tw-items-center tw-py-4">
      <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold">
        Administración sucursales
      </div>

      <q-btn label="Crear sucursal" color="secondary" icon="add" class="tw-h-10 tw-rounded-lg"
        @click="router.push('/administracion/sucursales/crear')" />

    </div>


    <q-card class="tw-rounded-xl tw-p-7s" flat>

      <p class="tw-text-2xl tw-font-bold tw-pt-8 tw-pl-8">Filtros</p>

      <q-form ref="CotizacionesForm" class="tw-mt-6">

        <div class="row q-col-gutter-md q-pb-md q-px-md">

          <div class="tw-w-[23%]">
            <p class="tw-text-label">Nombre sucursal</p>
            <q-input outlined v-model="filtersSearch.nombre" :options="data" label="Inserte" dense :rules="[(val) => val.length > 50 ? 'Maximo 50 caracteres' : true ]" />
          </div>

          <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 ">
            <span class="tw-text-label">Departamento </span>
            <q-select :options="departamentoOptions" emit-value label="Seleccione" map-options outlined
              v-model="filtersSearch.departamento" dense />
          </div>

          <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 ">
            <span class="tw-text-label">Municipio </span>
            <q-select :options="municipioOptions" emit-value label="Seleccione" map-options outlined
              v-model="filtersSearch.municipio" dense />
          </div>

          <div class="tw-w-[23%]">
            <p class="tw-text-label">Estado</p>
            <q-select outlined v-model="filtersSearch.estado" emit-value :options="stateOptions" label="Seleccione"
              dense />
          </div>

        </div>

        <div class="row tw-flex tw-justify-center tw-gap-6 [&>*]:tw-p-2 tw-pb-6">
          <q-btn label="Limpiar filtros" color="accent" textColor="black" class="tw-rounded-lg col-2"
            @click="onClearFilter"></q-btn>
          <q-btn label="Buscar" color="secondary" class="tw-rounded-lg col-2" @click="handleFilters"></q-btn>
        </div>
      </q-form>
    </q-card>
    <q-card class="q-pa-md tw-mt-4 tw-rounded-xl" flat>
      <div class="col row">
        <p class="tw-text-2xl tw-pl-6">Sucursales</p>
      </div>
      <Table :TABLE_HEADER="SUBSERIES_HEADER" :TABLE_BODY="dataTable" :selection="undefined" key-id="id"></Table>
    </q-card>
    <Modal v-model="showModal" title="Asignación exitosa"
      text="Se ha asignado con éxito los tipos documentales a la dependencia x." is-success text-button="¡Ok!" />
  </div>
</template>
<script lang="ts" setup>
import { Ref, ref, onMounted } from 'vue';
import { useRouter } from "vue-router";

const data = ref()

import BreadCrumbs from 'components/BreadCrumbs/BreadCrumbs.vue';
import Modal from 'components/Modal/Modal.vue';
import Table from 'src/components/Table.vue';
import { SUBSERIES_HEADER, IDataSucursal, stateOptions } from ".";
import { adminAxios } from 'src/services';

interface Filters {
  nombre?: string,
  departamento?: string,
  municipio?: string,
  estado?: string
}

//datatable
const dataTable: Ref<IDataSucursal[]> = ref([
  {
    codigo_sucursal: "string",
    nombre_sucursal: "string",
    empresa: "string",
    pais: "string",
    departamento: "string",
    municipio: "string",
    direccion: "string",
    telefono: "string",
    email: "string",
    localidad: "string",
    estado: false,
  }
])

const departamentoOptions: Ref<any[]> = ref([])
const municipioOptions: Ref<any[]> = ref([])
const router = useRouter()
const showModal = ref(false)

const initialFilters = {

};

const filtersSearch: Ref<Filters> = ref({

});

const routes = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'Módulo Administracion',
    to: '/home'
  },
  {
    name: 'Sucursales',
    to: '/home'
  },
]

onMounted(async () => {
  getItems()
  loadFilter()
})
let response: any[]
const getItems = async () => {
  response = (await adminAxios.get('/sucursales')).data;
  response = response.map(x => ({ ...x, estado: x.activo, estados: x.activo }))
  dataTable.value = response;
}
async function loadFilter() {
  loadDepartamentos();
  loadMunicipios();
}

async function loadDepartamentos() {
  const { data } = await adminAxios.get("/departamentos/list");
  departamentoOptions.value = [...departamentoOptions.value, ...data.map((val: any) => {
    return {
      label: val.nombre,
      value: val.nombre
    }
  })]
}

async function loadMunicipios() {
  const { data } = await adminAxios.get("/municipios/list");
  municipioOptions.value = [...municipioOptions.value, ...data.map((val: any) => {
    return {
      label: val.nombre,
      value: val.nombre
    }
  })]

}

async function onClearFilter() {
  filtersSearch.value = { ...initialFilters };
  dataTable.value = response;

}

const handleFilters = () => {
  const entries = Object.entries(filtersSearch.value)

  let filteration = response;

  entries.forEach(val => {
    if (val[0] == 'estado') {
      filteration = filteration.filter((x: any) => {
        return x[val[0]] == (val[1])
      })
    } else {
      filteration = filteration.filter((x: any) => {
        return x[val[0]].includes(val[1])
      })

    }

  })
  dataTable.value = filteration
}
</script>
