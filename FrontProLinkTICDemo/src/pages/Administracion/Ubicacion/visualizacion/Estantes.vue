<template>
  <p class="tw-text-2xl tw-font-bold tw-py-4">Estantes definidos</p>
  <q-table
    :rows="[]"
    :columns="ESTANTES_HEADER"
    row-key="name"
    table-header-class="text-black text-h6 "
    class="q-mr-md full-width"
    rows-per-page-label="Páginas"
    flat
  >
    <template v-slot:no-data="{ icon, message, filter }">
      <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
        <img v-lazy :data-url="NoData" alt="" width="120">
        <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
            No existe data por el momento
          </span>
      </div>
    </template>
  </q-table>
</template>

<script setup>
import { ESTANTES_HEADER } from ".";
import NoData from "assets/filterImage.svg"
</script>
