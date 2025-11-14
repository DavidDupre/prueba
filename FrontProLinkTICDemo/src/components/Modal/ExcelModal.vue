<template>
  <q-dialog v-model="open" persistent>
    <q-card class="modal-card">
      <q-card-section class="modal-section">
        <div class="tw-flex tw-justify-center tw-mt-3">
        <span class="tw-rounded-[100px] tw-flex tw-justify-center"
          style="background-color: #F6F6F9; width: 82px; height: 82px">
          <img v-lazy :data-url="ExclamationModal" alt="check" />
        </span>
      </div>
        <p class="modal-title">
          {{ title }}
        </p>
        <p class="modal-subtitle">El excel tiene {{ props.totalErrors > 1 ? 'los siguientes errores' : 'el siguiente error' }}:</p>
        <div class="modal-errors-container">
          <div v-for="(error, index) in errors" :key="index" class="modal-error">
            <p><strong>Fila:</strong> {{ error.fila }}, <strong>Columna:</strong> {{ error.columna }},
              <strong>Valor:</strong> {{ error.valor }}
            </p>
            <p class="modal-error-message">{{ error.mensajeError }}</p>
          </div>
        </div>
        <div class="modal-buttons">
          <q-btn label="OK" class="modal-button" @click="hideModal" style="width: 200px; height: 50px;" text-color="white" color="secondary" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import ExclamationModal from 'src/assets/exclamation-modal.svg';
import { computed } from 'vue';
import { QBtn, QDialog, QCard, QCardSection } from 'quasar';

const props = defineProps<{
  title: string,
  totalErrors: number,
  errors: Array<{
    fila: number,
    columna: string,
    valor: string,
    mensajeError: string
  }>,
  modelValue: boolean,
}>()

const emit = defineEmits(['update:modelValue'])

const open = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

function hideModal() {
  open.value = false;
}
</script>
<style scoped>
.modal-card {
  width: 500px;
  background-color: white;
}

.modal-section {
  text-align: center;
}

.modal-icon-wrapper {
  display: flex;
  justify-content: center;
}

.modal-title {
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
}

.modal-subtitle {
  font-size: 18px;
  margin-top: 10px;
}

.modal-errors-container {
  margin-top: 20px;
  max-height: 300px;
  /* Ajustar según sea necesario */
  overflow-y: auto;
}

.modal-error {
  margin-bottom: 10px;
}

.modal-error-message {
  color: #D32F2F;
  /* o cualquier otro color para errores */
}

.modal-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
}

.modal-button {
  width: 100px;
  height: 40px;
}
</style>
