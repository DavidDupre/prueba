<template>
  <div>
    <q-form ref="CotizacionesForm" class="q-pa-xl">
      <div class="row q-col-gutter-md q-pb-md q-px-md">
        <div class="col-12 q-pr-xl">
          <span class="custom-label text-weight-bold">Adjunte los documentos</span>
          <FileLoader v-model="documentos" hint="" />
        </div>
      </div>
    </q-form>
    <q-dialog v-model="showSuccessModal">
      <q-card>
        <q-card-section>
          <div class="text-h6">Cargue masivo</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ cargueMasivoResponse }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FileLoader from '@shell/components/Forms/fileLoader.vue';

interface FormStep3Props {
  formSections?: unknown;
  modelValue?: object;
}

defineProps<FormStep3Props>();

const documentos = ref<File[]>([]);
const showSuccessModal = ref(false);
const cargueMasivoResponse = ref('');

// Eliminar completamente la función handleCargue ya que no se usa
// const handleCargue = () => {
//   showSuccessModal.value = !!cargueMasivoResponse.value;
// };
</script>
