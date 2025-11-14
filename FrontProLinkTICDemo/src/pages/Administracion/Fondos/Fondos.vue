<template>
  <div>
    <BreadCrumbs :crumbs="routes" />

    <div class="tw-flex tw-justify-between tw-items-center tw-py-4">
      <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold">
        Administración de Fondos
      </div>

      <q-btn label="Crear Fondo" color="secondary" icon="add" class="tw-h-10 tw-rounded-lg"
        @click="router.push('/SGDA/fondos/crear')" />

    </div>


    <q-card class="tw-rounded-xl tw-p-7s" flat>


      <q-form ref="fondosForm" class="tw-mt-6" @submit="handleSearch">
        <p class="tw-text-2xl tw-pl-8 tw-pt-4 tw-font-bold">Filtros</p>

        <div class="tw-grid tw-grid-cols-3 tw-full tw-justify-center q-col-gutter-md tw-px-8 tw-py-4">

          <div class="tw-cols-1">
            <p class="tw-text-label">Nombre fondo</p>
            <q-input outlined v-model="filtersSearch.nombre" label="Inserte" dense />
          </div>
          <!-- <div class="tw-cols-1">
            <p class="tw-text-label">Código fondo</p>
            <q-input outlined v-model="filtersSearch.codigo_fondo" label="Inserte" dense :rules="[nonRequiredOnlyNumbers]" />
          </div> -->
          <div class="tw-cols-1">
            <p class="tw-text-label">Estado</p>
            <q-select outlined v-model="filtersSearch.estado" emit-value map-options :options="stateOptions"
              label="Seleccione" dense />
          </div>
        </div>
        <div class="row tw-flex tw-justify-center tw-gap-6 [&>*]:tw-p-2 tw-mt-6 tw-pb-6">
          <q-btn label="Limpiar Filtros" color="accent" textColor="secondary" class="tw-rounded-lg col-2"
            @click="resetForm"></q-btn>
          <q-btn label="Buscar" color="secondary" class="tw-rounded-lg col-2" type="submit"></q-btn>
        </div>
      </q-form>
    </q-card>
    <q-card class="q-pa-md tw-mt-4 tw-rounded-xl" flat>
      <div class="col row">
        <p class="tw-text-2xl tw-pl-6">Listado de Fondos</p>
      </div>
      <Table :TABLE_HEADER="SUBSERIES_HEADER" :TABLE_BODY="dataTable" :selection="undefined" key-id="id"
        :item-selected="selected" />
    </q-card>
    <Modal v-model="showModal" title="Asignación exitosa"
      text="Se ha asignado con éxito los tipos documentales a la dependencia x." is-success text-button="¡Ok!" />
  </div>
</template>
<script lang="ts" setup>
import { Ref, ref, onMounted } from 'vue';
import { sgdeaAxios } from "src/services";
import { useRouter } from "vue-router";

import BreadCrumbs from 'components/BreadCrumbs/BreadCrumbs.vue';
import Modal from 'components/Modal/Modal.vue';
import Table from 'src/components/Table.vue';
import { SUBSERIES_HEADER } from ".";
import { stateOptions } from 'src/constantes/state';
import { Fondo } from 'src/interfaces';
import { useLoadingStore } from 'src/stores/loading.store';
import { nonRequiredOnlyNumbers, onlyNumbers } from 'src/helpers/validations';
import { QForm } from 'quasar';

const router = useRouter()
const showModal = ref(false)
const fondosForm: Ref<QForm | null> = ref(null)
const filtersSearch: Ref<Filters> = ref({});

interface Filters {
  nombre?: string,
  codigo_fondo?: string,
  estado?: string
}

//datatable
const dataTable = ref([])
const selected = ref([]);

// Llamada a la api
let response: any[]
onMounted(async () => await getDataTable())

const getDataTable = async () => {
  const { data: res } = await sgdeaAxios.get<Fondo[]>("/fondo");

  dataTable.value = res.map((item) => ({
    nombreFondo: item.nombre,
    nitFondo: item.nitFondo,
    empresa: item.empresa.idEmpresa,
    estados: item.estado.toString().trim() === "true",
    id: item.idFondo,
  }))

}

const resetForm = async () => {

  filtersSearch.value = ({})
  await getDataTable()

}

const handleSearch = async () => {
  if (fondosForm.value.validate()) {

    const { data: res } = await sgdeaAxios.post<Fondo[]>('/fondo/buscar', {
      ...filtersSearch.value, codigo_fondo: parseInt(filtersSearch.value.codigo_fondo)
    })

    dataTable.value = res.map((item) => ({
      nombreFondo: item.nombre,
      nitFondo: item.nitFondo,
      empresa: item.empresa.idEmpresa,
      estados: item.estado.toString().trim() === "true",
      idFondo: item.idFondo,
    }))
  }
}

const routes = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'Módulo Administración',
  },
  {
    name: 'Fondos',
    to: '/home'
  },
]

</script>
