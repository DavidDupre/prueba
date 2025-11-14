<template>

  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0  ">
      <BreadCrumbs :crumbs="routes" />
      <div class="tw-flex tw-justify-between tw-items-center tw-pt-4 ">

        <h1 class="tw-text-3xl tw-font-bold tw-my-4">Nombre tipo codigo de barras</h1>

      </div>
      <q-card class="tw-mt-[20px] tw-rounded-xl q-pa-lg tw-h-[800px]" flat>

      </q-card>
     
    </main>
  </section>
</template>


<script  lang="ts" setup>
import { onMounted, ref, Ref, watch } from "vue";
import BreadCrumbs from 'components/BreadCrumbs/BreadCrumbs.vue';

import { routes } from "."

</script>
