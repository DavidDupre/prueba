<template>
  <div>
    <BreadCrumbs :crumbs="routes" />

    <div class="tw-flex tw-justify-between tw-items-center tw-py-4">
      <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold">
        Modulos y funcionalidades. word
      </div>
    </div>
    <embed src="https://docs.google.com/document/d/11Ozwtoh640V1qaJBaEU5s7lJ3aS_TrveNDbKJD-xcME/edit#heading=h.fav6scqmwu85"  width="100%" height="675" type="text/html">
  </div>
</template>
<script setup lang="ts">
import BreadCrumbs from "components/BreadCrumbs/BreadCrumbs.vue"
const routes = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'Módulo SGDEA',
    to: '/SGDA'
  },
  {
    name: 'Documentos',
  },
  {
    name: "Documentos temporales",
    to: "/documentos/temporales"
  },
  {
    name: 'Edición de plantilla',
  },
]
</script>
