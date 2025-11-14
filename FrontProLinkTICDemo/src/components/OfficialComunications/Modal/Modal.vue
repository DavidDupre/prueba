<style scoped src="./Modal.css"></style>

<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="custom-modal">
      <q-card-section>
        <h2 class="modal-title">Comunicaciones oficiales</h2>
        <p class="modal-subtitle">Seleccione la plantilla de la comunicación oficial</p>
        <q-select
          v-model="selectedOption"
          color="secondary"
          outlined
          :options="options"
          label="Seleccione una opción"
        />
      </q-card-section>
      <q-card-section class="buttons-section">
        <q-btn label="Cancelar" @click="cancel" class="modal-button" color="accent" text-color="black" />
        <q-btn label="Continuar" color="primary" text-color="white" @click="submit" class="modal-button primary" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
  import { useModalLogic } from './useModal.Logic';
  import { defineComponent } from "vue";

  export default defineComponent({
  name: "Modal",
  setup(_, { emit }) {
    const { options, cancel, submit, isOpen, selectedOption } = useModalLogic(emit);
    return {
      options, cancel, submit, isOpen, selectedOption
    }
  }
});
</script>


