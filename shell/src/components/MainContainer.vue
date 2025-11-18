<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Radicación de demandas',
  },
  routerLabel: {
    type: String,
    default: 'Volver',
  },
  routerTo: {
    type: String,
    default: '/home',
  },
});
</script>

<template>
  <div class="q-pa-md q-pt-none">
    <div class="q-pt-md">
      <router-link :to="routerTo">
        <q-btn flat color="primary" :label="routerLabel" icon="chevron_left" />
      </router-link>
    </div>

    <div class="row justify-between items-center q-pt-md q-my-5">
      <h1 class="text-h4 text-bold q-my-auto">{{ title }}</h1>
    </div>
    <slot />
  </div>
</template>

<style scoped></style>
