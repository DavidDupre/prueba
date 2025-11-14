<script lang="ts" setup>
const props = defineProps<{
  text: string

}>()
import error from "assets/error.svg"
</script>
<template>
  <!-- ESTO DEBE APARECER CUANDO HAY ERROR EN INICIAR SESION -->
  <!-- YA TIENE LAS MEDIDAS NECESARIAS PARA CUANDO APAREZCA EN EL LOGIN -->

  <div class="tw-border tw-border-redbordertrigger tw-bg-redtrigger tw-rounded-md tw-flex tw-py-2 tw-mt-5 tw-pr-3">
    <img v-lazy :data-url="error" alt="error-icon" class="tw-mx-2">
    <span class="tw-leading-5">{{ text }}</span>
  </div>
</template>
