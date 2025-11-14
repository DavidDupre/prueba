<template>
  <section class="tw-flex tw-flex-row">

    <!--CONTENIDO PRICIPAL-->
    <main class="tw-min-h-screen tw-w-full tw-pt-0  ">
      <BreadCrumbs :crumbs="crumbs" />
      <div class="tw-flex tw-justify-between tw-pt-4 ">

        <h2 class="tw-font-bold tw-text-4xl ">Tipologías Documentales</h2>
        <q-btn label="Crear Tipología Documental" color="secondary" icon="add" class="tw-rounded-lg"
               @click="handleRoute"></q-btn>
      </div>
      <q-card class="q-mt-xl tw-rounded-lg tw-p-7" flat>
        <b class="tw-text-2xl tw-text-left tw-font-bold tw-pl-6">Filtros</b>

        <div class="row q-col-gutter-md q-pb-md q-px-md">
          <!-- <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2 tw-gap-4">
            <span class="tw-text-label">Código</span>
            <q-input v-model="filterForm.codigo" label="Inserte" outlined class="mb-3" dense/>
          </div> -->
          <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 tw-gap-4">
            <span class="tw-text-label">Nombre tipología documental</span>
            <q-input v-model="filterForm.nombre" label="Inserte" outlined class="mb-3" dense/>
          </div>
          <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 tw-gap-4">
            <span class="tw-text-label">Sigla</span>
            <q-input v-model="filterForm.siglaIndice" label="Inserte" outlined class="mb-3" dense/>
          </div>
          <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 tw-gap-4">
            <span class="tw-text-label">Tipología de documento</span>
            <q-select v-model="filterForm.codigoTipologiaDocumental" :options="typeDocumentalsOptions" label="Seleccione" outlined class="mb-3" dense/>
          </div>
          <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 tw-gap-4">
            <span class="tw-text-label">Estado</span>
            <q-select v-model="filterForm.estado" :options="stateOptions" label="Seleccione" outlined class="mb-3" dense/>
          </div>
        </div>
        <footer class="row tw-flex tw-justify-center tw-gap-2">
          <q-btn label="Limpiar Filtros" color="accent" textColor="secondary" class="tw-rounded-lg col-2"
                 @click="resetFilters"></q-btn>
          <q-btn label="Buscar" color="secondary" class="tw-rounded-lg col-2" @click="searchFilterData"></q-btn>
        </footer>

      </q-card>

      <q-card class="q-mt-lg tw-p-7" flat>
         <p class="tw-text-2xl tw-font-bold tw-pl-6">Listado de Tipologías Documentales</p>
        <Table
          :TABLE_HEADER="DOCUMENTAL_HEADER"
          :TABLE_BODY="dataTable"
          row-key="id"
          key-id="id"
          row-id="id"
          :selection="undefined"
          @handleEditData="handleEditRoute"
        />
      </q-card>
    </main>
    <!-- END BLOCK -->

  </section>
</template>

<script  lang="ts" setup>
  import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';
  import Table from 'src/components/Table.vue';
  import { useTiposDocumentalesData } from './useTiposDocumentales.Logic';
  import LoadingScreen from 'src/components/LoadingScreen/LoadingScreen.vue';

  const {typeDocumentalsOptions, filterForm, dataTable, isLoading, pagination, intervalLabel, nextPage, prevPage, DOCUMENTAL_HEADER, stateOptions, router, crumbs, radicadoOptions, searchFilterData, resetFilters, firstPage, lastPage, handleRoute, handleEditRoute } = useTiposDocumentalesData();
</script>
