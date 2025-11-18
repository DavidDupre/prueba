<template>
  <div class="q-pa-xl container_background">
    <TrazabilidadDialog />
  </div>
  <div class="flex justify-center items-center q-gutter-x-md q-pb-xl">
    <q-btn
      color="primary"
      label="Cancelar"
      @click="modalVisibleCancelar = true"
      style="padding: 18px 60px; border-radius: 8px; width: 240px; height: 48px"
    />
  </div>
  <MultiPurposeDialog
    v-if="modalVisibleCancelar"
    type="question"
    title="NESTOR FABIAN UCHAMOCHA CARDONA"
    :subtitle="`Ha radicado el Ministerio del Trabajo <br><strong>ENT20250000870334</strong>`"
    cancel-label=""
    accept-label="Cerrar"
    :action="
      () => {
        modalVisibleCancelar = false;
      }
    "
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TrazabilidadDialog from '@shell/components/TrazabilidadDialog.vue';
import MultiPurposeDialog from '@shell/components/MultiPurposeDialog.vue';

const modalVisibleCancelar = ref(false);
</script>
