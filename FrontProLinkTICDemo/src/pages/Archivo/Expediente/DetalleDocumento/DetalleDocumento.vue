<script setup lang="ts">

import { useRoute } from 'vue-router';
import { useDetalleDocumento } from "./DetalleDocumento";

import EmbeddedPdfView from "src/components/EmbeddedPdfView/EmbeddedPdfView.vue";
import CintaOpciones from "src/shared/components/PrimeComponents/CintaOpciones/CintaOpciones.vue";
import Title from 'src/shared/components/PrimeComponents/Fuentes/Title/Title.vue';
import Seguridad from './Seguridad/Seguridad.vue';
import HistorialEventos from './HistorialEventos/HistorialEventos.vue';
import InformacionDocumento from '../InformacionDocumento/InformacionDocumento.vue';

const route = useRoute();
const idFile = route.params["documento"] as string;

const { tabs, activeTab, router, base64Url } = useDetalleDocumento();
</script>

<template>
  <a
    @click.prevent="router.back()"
    class="text-primary block tw-cursor-pointer tw-pointer tw-mb-5"
    style="text-decoration: none"
  >
    <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
    <b>Regresar al Expediente</b>
  </a>

  <q-card flat class="tw-p-6 tw-rounded-lg">
    <div class="tw-p-2 tw-mb-4">
      <Title label="Consultar Documento" />
    </div>
    <CintaOpciones
      :tabs="tabs"
      defaultTab="preview"
      @update:tab="(tab) => (activeTab = tab)"
    >
      <template #preview>
        <div class="tw-flex tw-min-h-screen">
          <EmbeddedPdfView :pdfUrl="base64Url"></EmbeddedPdfView>
        </div>
      </template>
      <template #informacion>
        <InformacionDocumento />
      </template>
      <!-- <template #seguridad>
        <Seguridad :id-file="idFile"></Seguridad>
      </template>
      <template #trazabilidad>
        <HistorialEventos :id-file="idFile"></HistorialEventos>
      </template> -->
    </CintaOpciones>
  </q-card>
</template>
