<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-h- tw-p-7 tw-pt-0 ">
      <BreadCrumbs :crumbs="routes_details" />
      <div class="tw-flex tw-justify-between tw-pt-4 ">

        <h1 class="tw-text-3xl tw-font-bold">Carta de receso laboral</h1>
      </div>
      <q-card class="q-mt-lg tw-p-7 tw-rounded-xl tw-h-screen" flat>
        <div class="tw-flex tw-flex-col tw-w-[300px] tw-p-3 tw-pb-4" style="border: 1px solid #EAECF0">
          <div class="tw-flex tw-p-2">
            <img v-lazy :data-url="PDF" alt="">
            <span class="tw-font-bold tw-text-left">Nombre documento.PDF</span>
          </div>

          <div class="tw-flex tw-items-center tw-justify-center">
            <iframe
              width="250"
              height="200"
              src="https://www.africau.edu/images/default/sample.pdf"
            />
          </div>
          <div class="tw-flex tw-items-center tw-gap-2 tw-mt-4">
            <q-icon name="person"/>
            <span class="">German Garcia</span>
          </div>
          <div class="tw-flex tw-items-center tw-justify-between">
            <div class="tw-flex tw-items-center tw-gap-2">
              <q-icon name="calendar_today"/>
              <span class="">15/02/2023</span>
            </div>
            <div>
              10 MB
            </div>
          </div>

        </div>
      </q-card>

    </main>
  </section>
</template>

<script  lang="ts" setup>
import {useRouter} from "vue-router";
import { onMounted } from "vue";
import PDF from "assets/pdf.svg";

import {
  routes_details
} from "..";

import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';

const router = useRouter()

onMounted( async () => {
})

</script>
