<template >
  <main>
    <BreadCrumbs :crumbs="crumbs" />
    <h2 class="tw-font-bold tw-text-4xl tw-py-4">Nuevo documento a partir de plantillas</h2>
    <q-card class="q-pa-lg row q-col-gutter-md tw-justify-between q-mt-md">
      <div class="col-12 row ">
        <h3 class="tw-font-bold tw-text-2xl tw-py-4 q-pl-sm tw-mr-auto tw-items-center">Listado de plantillas
        </h3>
        <q-btn flat icon="o_view_agenda" :color="view == 'table' ? 'primary' : 'grey-8'"
          @click="() => view = 'table'"></q-btn>
        <q-btn flat icon="o_grid_view" :color="view == 'grid' ? 'primary' : 'grey-8'"
          @click="() => view = 'grid'"></q-btn>
        <q-input v-model="search" label="Buscar" outlined dense class="q-pt-md"></q-input>
      </div>
      <template v-if="view == 'table'">
        <div class="col-12">

          <Table :TABLE_BODY="DOCUMENTOS_DUMMY_DATA" :TABLE_HEADER="DOCUMENTOS_HEADER"></Table>
        </div>
      </template>
      <template v-else-if="view == 'grid'">
        <article class="col-3 q-pa-md tw-border tw-rounded-md">
          <div class="row tw-items-center">
            <img v-lazy :data-url="excel" alt="">
            <h4 class="tw-font-bold   q-pl-sm tw-mr-auto tw-items-center">Módulos y funcionalidades</h4>
            <q-icon name="fas fa-ellipsis-vertical" color="grey-8"></q-icon>
          </div>
          <img v-lazy :data-url="formatDummy" alt="">
          <div class="row">
            <q-btn icon="edit" flat color="blue-10" class="tw-ml-auto align">Editar</q-btn>

          </div>
        </article>
        <article class="col-3 q-pa-md tw-border tw-rounded-md">
          <div class="row tw-items-center">
            <img v-lazy :data-url="pdf" alt="">
            <h4 class="tw-font-bold   q-pl-sm tw-mr-auto tw-items-center">Módulos y funcionalidades</h4>
            <q-icon name="fas fa-ellipsis-vertical" color="grey-8"></q-icon>
          </div>
          <img v-lazy :data-url="formatDummy" alt="">
          <div class="row">
            <q-btn icon="edit" flat color="blue-10" class="tw-ml-auto align">Editar</q-btn>

          </div>
        </article>
        <article class="col-3 q-pa-md tw-border tw-rounded-md">
          <div class="row tw-items-center">
            <img v-lazy :data-url="word" alt="">
            <h4 class="tw-font-bold   q-pl-sm tw-mr-auto tw-items-center">Módulos y funcionalidades</h4>
            <q-icon name="fas fa-ellipsis-vertical" color="grey-8"></q-icon>
          </div>
          <img v-lazy :data-url="formatDummy" alt="">
          <div class="row">
            <q-btn icon="edit" flat color="blue-10" class="tw-ml-auto align" to="editar">Editar</q-btn>

          </div>
        </article>
        <div class="q-pa-lg col-12">
          <div class="q-gutter-md flex tw-justify-between">
            <span class="flex tw-items-center tw-gap-2">
              <p>Filar por pagina</p>
              <q-select :options="['10']" v-model="paginate" outlined dense></q-select>
            </span>
            <q-pagination v-model="pages" max="5" direction-links flat color="grey" active-color="accent"
              class="tw-mx-auto" />
            <q-btn icon="restart_alt" color="blue-3" text-color="blue-10"></q-btn>
          </div>
        </div>
      </template>
    </q-card>
  </main>
</template>


<script lang="ts" setup>
import { ref } from 'vue';
import BreadCrumbs from 'components/BreadCrumbs/BreadCrumbs.vue';
import { nuevoCrumbs as crumbs, DOCUMENTOS_DUMMY_DATA, DOCUMENTOS_HEADER } from "../"
import Table from '../Table.vue'

import excel from "assets/excel.svg"
import pdf from "assets/pdf.svg"
import word from "assets/word.svg"
import formatDummy from "assets/mockup formato archivo.png"

const search = ref("")
const pages = ref(1)
const view = ref('grid')

const paginate = ref()

</script>
