<template>
  <main>
    <a href="/cotizaciones" class="text-primary q-mb-md block" style="text-decoration: none;">
      <q-icon size="1.5em" name="chevron_left" color="accent"></q-icon>
      <b>
        Volver
      </b>
    </a>
    <BreadCrumbs :crumbs="routes"></BreadCrumbs>
    <q-form>
      <div class="tw-flex tw-justify-between tw-pt-4 ">

        <h1 class="tw-text-3xl tw-font-bold">Formulario de radicación</h1>

      </div>
      <q-card flat>


        <q-expansion-item expand-separator default-opened class="q-bg-white q-mt-lg">
          <template v-slot:header>
            <div class="col row">
              <b class="tw-text-lg">Información general</b>
            </div>
          </template>
          <div class=" row  q-pa-md ">


            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-pr-md">
              <span class="tw-text-label">Tipo de documento </span>
              <q-select :options="[]" dense emit-value label="Seleccione" map-options outlined
                :rules="[(val: string) => val.length > 0 || 'Escoja una opcion']" required id:="input.label"
                v-model="formulario.data" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 ">
              <span class="tw-text-label">Documento </span>
              <q-input v-model="formulario.data" dense label="Inserte" outlined class="mb-3 " :rules="[]" required />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 q-mb-md">
              <span class="tw-text-label">Documento </span>
              <q-input v-model="formulario.data" dense label="Inserte" outlined class="mb-3 " :rules="[]" required />
            </div>

            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-pr-md">
              <span class="tw-text-label">Tipo de persona</span>
              <q-select :options="[]" dense emit-value label="Seleccione" map-options outlined
                :rules="[(val: string) => val.length > 0 || 'Escoja una opcion']" required id:="input.label"
                v-model="formulario.data" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-pr-md">
              <span class="tw-text-label">Tipo de radicado </span>
              <q-select :options="[]" dense emit-value label="Seleccione" map-options outlined
                :rules="[(val: string) => val.length > 0 || 'Escoja una opcion']" required id:="input.label"
                v-model="formulario.data" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-pr-md">
              <span class="tw-text-label">Dignatario </span>
              <q-input v-model="formulario.data" dense label="Inserte" outlined class="mb-3 " :rules="[]" required />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 ">
              <span class="tw-text-label">Cargo </span>
              <q-input v-model="formulario.data" dense label="Inserte" outlined class="mb-3 " :rules="[]" required />
            </div>
          </div>
        </q-expansion-item>
        <q-expansion-item expand-separator default-opened class="q-bg-white ">
          <template v-slot:header>
            <div class="col row">
              <b class="tw-text-lg">Información de contacto</b>
            </div>
          </template>
          <div class=" row  q-pa-md ">


            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-pr-md">
              <span class="tw-text-label">Telefono </span>
              <q-select :options="[]" dense emit-value label="Seleccione" map-options outlined
                :rules="[(val: string) => val.length > 0 || 'Escoja una opcion']" required id:="input.label"
                v-model="formulario.data" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 ">
              <span class="tw-text-label">Email </span>
              <q-input v-model="formulario.data" dense label="Inserte" outlined class="mb-3 " :rules="[]" required />
            </div>


            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 q-pr-md">
              <span class="tw-text-label">Continente</span>
              <q-select :options="[]" dense emit-value label="Seleccione" map-options outlined
                :rules="[(val: string) => val.length > 0 || 'Escoja una opcion']" required id:="input.label"
                v-model="formulario.data" />
            </div>
            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 q-pr-md">
              <span class="tw-text-label">Pais</span>
              <q-select :options="[]" dense emit-value label="Seleccione" map-options outlined
                :rules="[(val: string) => val.length > 0 || 'Escoja una opcion']" required id:="input.label"
                v-model="formulario.data" />
            </div>
            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 q-pr-md">
              <span class="tw-text-label">Departamento</span>
              <q-select :options="[]" dense emit-value label="Seleccione" map-options outlined
                :rules="[(val: string) => val.length > 0 || 'Escoja una opcion']" required id:="input.label"
                v-model="formulario.data" />
            </div>
            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 ">
              <span class="tw-text-label">Municipio </span>
              <q-select :options="[]" dense emit-value label="Seleccione" map-options outlined
                :rules="[(val: string) => val.length > 0 || 'Escoja una opcion']" required id:="input.label"
                v-model="formulario.data" />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 ">
              <span class="tw-text-label">Email </span>
              <q-input v-model="formulario.data" dense label="Inserte" outlined class="mb-3 " :rules="[]" required />
            </div>
          </div>
        </q-expansion-item>
        <q-expansion-item expand-separator default-opened class="q-bg-white ">
          <template v-slot:header>
            <div class="col row">
              <b class="tw-text-lg">Información adicional</b>
            </div>
          </template>
          <div class=" row  q-pa-md ">


            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-pr-md">
              <span class="tw-text-label">Tipo documental </span>
              <q-select :options="[]" dense emit-value label="Seleccione" map-options outlined
                :rules="[(val: string) => val.length > 0 || 'Escoja una opcion']" required id:="input.label"
                v-model="formulario.data" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 ">
              <span class="tw-text-label">Medio de recepción </span>
              <q-select :options="[]" dense emit-value label="Seleccione" map-options outlined
                :rules="[(val: string) => val.length > 0 || 'Escoja una opcion']" required id:="input.label"
                v-model="formulario.data" />
            </div>


            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 q-pr-md">
              <span class="tw-text-label">Desc anexos</span>
              <q-input v-model="formulario.data" dense label="Inserte" outlined class="mb-4 " :rules="[]" required />
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 q-pr-md">
              <span class="tw-text-label">Número de folios</span>
              <q-input v-model="formulario.data" dense label="Inserte" outlined class="mb-4 " :rules="[]" required />
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 q-pr-md">
              <span class="tw-text-label">Número de anexos</span>
              <q-input v-model="formulario.data" dense label="Inserte" outlined class="mb-4 " :rules="[]" required />
            </div>

            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 q-my-lg">
              <span class="tw-text-label">Asunto </span>
              <q-input v-model="formulario.data" dense label="Inserte" outlined class="mb-3 " :rules="[]" required
                type="textarea" />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 ">
              <span class="tw-text-label">Adjunte los documentos </span>
              <FileLoader />
            </div>
            <footer class="row tw-flex tw-justify-center tw-gap-2 col-12 q-my-lg">
              <q-btn label="Limpiar filtros" color="accent" textColor="black" class="tw-rounded-lg col-2"></q-btn>
              <q-btn label="Buscar" color="secondary" class="tw-rounded-lg col-2"></q-btn>
            </footer>
          </div>
        </q-expansion-item>
      </q-card>
    </q-form>
  </main>
</template>

<script lang="ts" setup>
import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';
import FileLoader from 'src/components/FormFields/FileLoader.vue';
import { ref } from 'vue';

const formulario = ref({
  data: ""
})

const routes = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: '??',
    to: '/home'
  },
  {
    name: '??',
    to: '/home'
  },
  {
    name: 'Formulario de radicación '
  }
]
</script>
