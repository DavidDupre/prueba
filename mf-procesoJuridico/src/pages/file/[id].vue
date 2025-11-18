<template>
  <MainContainer :title="`Radicado 355`">
    <!-- ${route.params.id} -->
    <div>
      <FilingParameterization :status="route.params.status" />
    </div>
  </MainContainer>
</template>

<script setup lang="ts">
import MainContainer from "../../../../mf-ministry-consultation/src/components/MainContainer.vue";
import FilingParameterization from "../../../../mf-procesoJuridico/src/components/file/FilingParameterization.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<style scoped></style>
