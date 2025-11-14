<template>
  <div>
    <q-table flat :rows-per-page-options="[5, 25, 50, 100]" :rows="dataTable" :columns="PARRAFOS_HEADER" :row-key="keyId"
             table-header-class="text-black" class="q-mr-md full-width" rows-per-page-label="Páginas" color="secondary"
             selection="multiple" v-model:selected="selection">
      <template v-slot:body-cell-parrafo="props">
        <q-td class="tw-whitespace-normal">
          <p class="">{{ props.row.parrafo }}</p>
        </q-td>
      </template>
      <template v-slot:body-cell-request="props">
        <q-td>
          <div class="tw-flex tw-items-center tw-gap-2">
            <div class="tw-flex tw-items-center tw-bg-rosa tw-px-2 tw-rounded tw-cursor-pointer" @click="showModal = true">
              <q-icon name="close" />
              <p class="tw-font-bold">Rechazar</p>
            </div>
            <div class="tw-flex tw-items-center tw-bg-green-light tw-px-2 tw-rounded tw-cursor-pointer" @click="showModal = true">
              <q-icon name="check" />
              <p class="tw-font-bold">Aprobar</p>
            </div>
          </div>
        </q-td>
      </template>
      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
          <img v-lazy :data-url="NoData" alt="" width="120">
          <span class="tw-text-lg tw-mt-4 tw-w-[480px] tw-text-center tw-leading-5">
            {{ msgNoData
            ? msgNoData
            : 'No se encontraron datos con los criterios ingresados.Por favor verifique e intente nuevamente.'
            }}
          </span>
        </div>
      </template>
    </q-table>
  </div>

  <Modal
    v-model="showModal"
    title="¡Espera un momento!"
    text="¿Está seguro que desea realizar esta accion?"
    :is-success="false"
    text-button="SI"
    cancel-button
    text-button-cancel="NO"
    @handleAccept="showModal = false"
    @closeModal="showModal = false"
  />
</template>

<script setup lang="ts">

import { ref } from "vue";

import NoData from "assets/filterImage.svg";
import Modal from "components/Modal/Modal.vue";

import { PARRAFOS_HEADER } from ".."

const props = withDefaults(defineProps<{
  isSelection?: boolean,
}>(), {
})

const showModal = ref(false)

const dataTable = ref([
  {
    usuario: 'Usuario',
    dependencia: 'Dependecia',
    parrafo: 's simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.',

  }
])
</script>

<style lang="scss">
.q-table--no-wrap th, .q-table--no-wrap td{
  white-space: normal !important;
}
</style>

