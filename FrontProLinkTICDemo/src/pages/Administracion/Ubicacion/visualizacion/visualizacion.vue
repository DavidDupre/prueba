<template>
  <div class="q-pa-md">
    <BreadCrumbs :crumbs="routes" class="tw-mb-8" />

    <h1 class="tw-text-3xl tw-font-bold tw-my-4">Ubicación</h1>

    <q-card flat class="tw-rounded-2xl tw-p-4">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="accent"
        indicator-color="accent"
        align="justify"
      >
        <q-tab name="deposito" label="Depósito" />
        <q-tab name="pasillos" label="Pasillos" />
        <q-tab name="estantes" label="Estantes" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="deposito">
          <Deposito />
        </q-tab-panel>

        <q-tab-panel name="pasillos">
          <Pasillos />
        </q-tab-panel>

        <q-tab-panel name="estantes">
         <Estantes />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>


  </div>
</template>

<script setup>
import { ref } from 'vue';

import {  routes } from ".";
import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';
import ExportFiles from 'src/components/FormFields/exportFiles.vue';

import Deposito from "./Deposito.vue";
import Pasillos from './Pasillos.vue';
import Estantes from './Estantes.vue';

const tab = ref("deposito")
</script>
