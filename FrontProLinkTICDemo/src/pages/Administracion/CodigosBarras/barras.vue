<template>
  <div>
    <BreadCrumbs :crumbs="routes" />

    <div class="tw-flex tw-justify-between tw-items-center tw-py-4">
      <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold">
        Administración tipos códigos de barras
      </div>

    </div>

    <div class="col row">

    </div>
    <q-card class="q-pa-md tw-mt-4 tw-rounded-xl" flat>


      <div class="tw-flex tw-justify-between">
        <p class="tw-text-2xl tw-font-bold tw-pl-6 tw-pt-4">Listado de tipos de códigos de barras</p>

        <div class="tw-flex tw-gap-4 tw-p-4">
          <q-btn label="Inactivar" color="accent" class="tw-h-10 tw-w-[150px] !tw-text-[#003352] tw-rounded-lg"
            @click="() => (rowsSelected.length ? desactivacionMasiva = true : '')" />
          <q-btn label="Activar" color="secondary" class="tw-h-10 tw-w-[150px] tw-rounded-lg"
            @click="() => (rowsSelected.length ? activacionMasiva = true : '')" />


        </div>
      </div>

      <Table :TABLE_HEADER="SUBSERIES_HEADER" :TABLE_BODY="dataTable" :selection="undefined" key-id="id" icon="visibility"
        :msg-no-data="msgFilter" row-id="id" v-model:item-selected="rowsSelected">
      </Table>

      <Modal v-model="showModal" title="Asignación exitosa"
        text="Se ha asignado con éxito los tipos documentales a la dependencia x." text-button="¡Ok!"
        @handleAccept="handleModal" />


      <Modal v-model="confirmSingleModal" title="¡Espera un momento!"
        :text="`¿Estás seguro de activar el tipo de codigo de barras seleccionado?`" text-button="Sí"
        @handleAccept="handleModal" @closeModal="cancelModal = false" label="Confirmar" cancelButton
        text-button-cancel="No" />

      <Modal v-model="desactivacionMasiva" title="¡Espera un momento!"
        :text="`¿Estás seguro de desactivar los tipos de codigos de barras seleccionados?`" text-button="Sí"
        @handleAccept="toDesactive" @closeModal="desactivacionMasiva = false" label="Confirmar" cancelButton
        text-button-cancel="No" />

      <Modal v-model="activacionMasiva" title="¡Espera un momento!"
        :text="`¿Estás seguro de activar los tipos de codigos de barras seleccionados?`" text-button="Sí"
        @handleAccept="toActivate" @closeModal="activacionMasiva = false" label="Confirmar" cancelButton
        text-button-cancel="No" />

      <Modal v-model="singleSuccess" title="Activacion exitosa" is-success
        text="Se activaron correctamente los tipos de codigos de barras seleccionados" text-button="Sí"
        @handleAccept="handleModal" label="Confirmar" />

      <Modal v-model="singleSuccessDeactivate" title="Inactivacion exitosa" is-success
        text="Se inactivaron correctamente los tipos de codigos de barras seleccionados" text-button="Sí"
        @handleAccept="handleModal" @closeModal="" label="Confirmar" />

    </q-card>
  </div>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { Ref, ref, onMounted } from 'vue';
import httpClient, { client } from "src/services";
import { useRoute, useRouter } from "vue-router";

import BreadCrumbs from 'components/BreadCrumbs/BreadCrumbs.vue';
import Modal from 'components/Modal/Modal.vue';
import Table from './Table.vue';

import { stateOptions } from "src/constantes/state";
import { lengthInput } from "src/helpers/validations";
import { useEntidades } from "src/composables/useEntidades";
import {
  SUBSERIES_HEADER,
  routes,
} from ".";




const route = useRoute()
const router = useRouter()

const showModal = ref(false)
const confirmSingleModal = ref(false)
const desactivacionMasiva = ref(false)
const activacionMasiva = ref(false)
const options = ref([])
const dataTable = ref([])

const rowsSelected = ref([])

const singleSuccess = ref(false)
const singleSuccessDeactivate = ref(false)

dataTable.value = [
  {
    id: 0,
    tiposCodigo: 'lorem',
    detalle: 'lorem',
    estados: false,

  },
  {
    id: 2,
    tiposCodigo: 'lorem',
    detalle: 'lorem',
    estados: true,

  },
  {
    id: 1,
    tiposCodigo: 'lorem',
    detalle: 'lorem',
    estados: true,

  },

]
const filtersSearch = ref({
  activo: null,
  idFuncionalidad: null,
  idSecuencia: null,
  nombre: null,
  prefijo: null,
  sufijo: null,
});

const toDesactive = () => {

  desactivacionMasiva.value = false;

  rowsSelected.value.forEach((n) => {
    n.estados ? (n.estados = false, dataTable.value.map((item) => {
      if (n.id == item.id) {
        item.estados = n.estados;
      }


    }), singleSuccessDeactivate.value = true) : ''
  })
}

const toActivate = () => {
  activacionMasiva.value = false;
  rowsSelected.value.forEach((n) => {
    n.estados ? '' : (n.estados = true, dataTable.value.map((item) => {
      if (n.id == item.id) {
        item.estados = n.estados;
      }
    }), singleSuccess.value = true)
  })
}

const msgFilter = ref('')

const handleModal = () => {
  if (showModal.value || activacionMasiva.value || desactivacionMasiva.value || singleSuccess || singleSuccessDeactivate || confirmSingleModal.value) {
    showModal.value = false
    activacionMasiva.value = false
    desactivacionMasiva.value = false
    singleSuccess.value = false
    singleSuccessDeactivate.value = false;
    confirmSingleModal.value = false;
  }
}



</script>
