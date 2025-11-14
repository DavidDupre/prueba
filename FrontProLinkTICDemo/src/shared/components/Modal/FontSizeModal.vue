<template>
  <q-dialog v-model="localFontSizeModal" fullwidth>
    <q-card class="q-pa-none" style="width: 60vw; height: 30vh">
      <div
        class="q-pa-sm q-gutter-none"
        style="display: flex; justify-content: flex-end"
      >
        <a
          @click="closeModal"
          class="tw-text-primary tw-cursor-pointer"
          style="text-decoration: none"
        >
          <q-icon size="1.5em" name="close" color="primary" />
        </a>
      </div>
      <div class="q-pa-md">
        <h4 class="q-mb-md">Cambiar Tamaño de Fuente</h4>
        <q-input
          v-model="fontSize"
          label="Tamaño de Fuente"
          type="number"
          outlined
          min="10"
          max="72"
          hint="Ingresa el tamaño de la fuente en px"
        />
        <div class="q-mt-lg">
          <q-btn
            class="tw-w-36 tw-h-10 tw-p-10"
            color="primary"
            label="Aplicar"
            @click="applyFontSize"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { toast } from "src/helpers/toast";
import { ref, defineProps, defineEmits } from "vue";

// Propiedades para controlar la visibilidad del modal
const props = defineProps({
  showFontSizeModal: {
    type: Boolean,
    required: true,
  },
});

// Estado local para manejar la visibilidad del modal
const localFontSizeModal = ref(props.showFontSizeModal);
const fontSize = ref(11); // Valor inicial del tamaño de fuente
const emit = defineEmits(["update:showModalSize","update:Size"]);


// Función para cerrar el modal
const closeModal = () => {
  localFontSizeModal.value = false; // Cambia el estado local
  emit("update:showModalSize");
  emit("update:Size", fontSize);
};

// Función para aplicar el cambio de tamaño de fuente
const applyFontSize = () => {
  // Validar el tamaño de fuente
  if (fontSize.value < 6 || fontSize.value > 72) {
    toast.error("El tamaño de fuente debe estar entre 6 y 72.");
    return;
  }

  closeModal();
};
</script>

<style scoped>
/* Agrega estilos específicos para tu componente aquí */
</style>
