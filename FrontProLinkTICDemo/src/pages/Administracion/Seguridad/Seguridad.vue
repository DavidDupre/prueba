<template>
  <div>
    <BreadCrumbs :crumbs="routes" />

    <div class="tw-flex tw-justify-between tw-items-center tw-py-4">
      <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold">
        Asignacion de Niveles de Seguridad
      </div>
      <a href="/administracion/seguridad/crear">
        <q-btn label="Crear nivel de Seguridad" color="secondary" icon="add" class="tw-h-10 tw-rounded-lg" />
      </a>
    </div>


    <q-card class="tw-rounded-xl tw-p-7s" flat>

      <p class="tw-text-2xl tw-font-bold tw-pt-8 tw-pl-8">Filtros</p>

      <q-form ref="CotizacionesForm" class="tw-mt-6">

        <div class="tw-flex tw-full tw-justify-center q-col-gutter-md">

          <div class="tw-w-[31%]">
            <p class="tw-text-label">Codigo nivel de Seguridad</p>
            <q-input outlined v-model="data.codigo" :options="data" label="Inserte" dense />
          </div>

          <div class="tw-w-[31%]">
            <p class="tw-text-label">Nombre nivel de Seguridad</p>
            <q-input outlined v-model="data.nombre" :options="data" label="Inserte" dense />
          </div>
          <div class="tw-w-[31%]">
            <p class="tw-text-label">Estado</p>
            <q-select outlined v-model="data.estado" :options="stateOptions" label="Inserte" dense map-options
              emit-value />

          </div>

        </div>





        <div class="row tw-flex tw-justify-center tw-gap-6 [&>*]:tw-p-2 tw-mt-12">
          <q-btn label="Limpiar filtros" color="accent" textColor="black" class="tw-rounded-lg col-2"
            @click="clearFilter"></q-btn>
          <q-btn label="Buscar" color="secondary" class="tw-rounded-lg col-2" @click="handleFilters"></q-btn>
        </div>
      </q-form>
    </q-card>
    <q-card class="q-pa-md tw-mt-4 tw-rounded-xl" flat>
      <div class="col row">
        <p class="tw-text-2xl tw-pl-6">Niveles de seguridad</p>
      </div>
      <Table :TABLE_HEADER="SEGURIDAD_HEADER" :TABLE_BODY="dataTable" :selection="undefined"></Table>
    </q-card>
    <Modal v-model="showModal" title="Asignación exitosa"
      text="Se ha asignado con éxito los tipos documentales a la dependencia x." is-success text-button="¡Ok!" />
  </div>
</template>
<script lang="ts" setup>
import { Ref, ref, onMounted } from 'vue';


interface IData {
  codigo?: string,
  nombre?: string,
  estado?: string
}

const data: Ref<IData> = ref({

})

import BreadCrumbs from 'components/BreadCrumbs/BreadCrumbs.vue';
import Modal from 'components/Modal/Modal.vue';
import Table from './Table.vue';
import { SEGURIDAD_HEADER, IDataSucursal, stateOptions } from ".";
import { sgdeaAxios } from '../../../services/index';




interface Filters {
  codigo_sucursal: string,
  nombre_sucursal: string,
  empresa: string,
  pais: string,
  departamento: string,
  municipio: string,
  direccion: string,
  telefono: string,
  email: string,
  localidad: string,
  estado: string
}

//datatable
const dataTable: Ref<IDataSucursal[]> = ref([
  {

  }
])

let response: any[] = []
onMounted(async () => {
  response = (await sgdeaAxios.get("/nivelseguridad")).data;
  dataTable.value = response
})

const showModal = ref(false)


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
    name: 'Niveles de Seguridad',
    to: '/home'
  },
]

async function clearFilter() {
  data.value = {};
  dataTable.value = response;

}

const handleFilters = () => {
  const entries = Object.entries(data.value)

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
