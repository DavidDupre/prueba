<template>
  <div class="q-pa-xl">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6 text-bold">Afectado</div>
      <q-icon name="keyboard_arrow_down" size="sm" />
    </div>

    <div class="row q-mt-md" style="padding: 15px">
      <q-toggle
        v-model="solicitudGeneral"
        label="Solicitud general"
        color="primary"
      />
    </div>
    <FormComponentModel v-model="formData" :form="finalForm" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from "vue";
import FormJs from "../boot/form.json";
import FormComponentModel from "@shell/components/Forms/FormComponentModel.vue";
import { fieldConfigParser } from "@shell/components/Forms/formParser";

const formData = reactive<Record<string, unknown>>({});
const solicitudGeneral = ref(false);
const formAfectado = computed(() => FormJs.afectado);

const finalForm = computed(() => {
  const formConfig = JSON.parse(JSON.stringify(formAfectado.value));
  if (solicitudGeneral.value) {
    for (const field of formConfig.components) {
      field.disabled = true;
      if (field.validate) {
        field.validate.required = false;
      }
    }
  }
  return fieldConfigParser(formConfig);
});

watch(solicitudGeneral, (newValue) => {
  if (newValue) {
    Object.keys(formData).forEach((key) => delete formData[key]);
  }
});
</script>
<style scoped>
/* Estilo para simular el campo deshabilitado con el mismo gris del paso anterior */
.field-disabled-active :deep(.q-field__control) {
  background-color: "primary" !important;
}

/* Borde gris para el botón de Cancelar */
.border-grey {
  border: 1px solid #ccc;
}

/* Contenedor principal de la tarjeta */
.form-container {
  max-width: 900px;
  margin: 20px auto;
  border: 1px solid #ddd;
  box-shadow: none;
}
</style>
