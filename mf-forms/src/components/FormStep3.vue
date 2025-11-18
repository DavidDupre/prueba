<template>
  <div class="q-pa-xl">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6 text-bold">Información de la solicitud</div>
      <q-icon name="keyboard_arrow_down" size="sm" />
    </div>

    <FormComponentModel v-model="formData" :form="finalForm" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import FormComponentModel from "@shell/components/Forms/FormComponentModel.vue";
import { fieldConfigParser } from "@shell/components/Forms/formParser";
import FormJs from "../boot/form.json";

const formData = reactive<Record<string, unknown>>({});
const formSolicitud = computed(() => FormJs.solicitud);

const finalForm = computed(() => {
  const formConfig = JSON.parse(JSON.stringify(formSolicitud.value));
  return fieldConfigParser(formConfig);
});
</script>
