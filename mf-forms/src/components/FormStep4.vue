<template>
  <div class="q-pa-xl">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6 text-bold">Documentos adjuntos</div>
    </div>
    <FormComponentModel v-model="formData" :form="finalForm" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { fieldConfigParser } from "@shell/components/Forms/formParser";

import FormComponentModel from "@shell/components/Forms/FormComponentModel.vue";
import FormJs from "../boot/form.json";

interface FormStep4Props {
  formSections?: unknown;
  modelValue?: Record<string, unknown>;
}

const props = withDefaults(defineProps<FormStep4Props>(), {
  modelValue: () => ({}),
});

const emit = defineEmits<{
  (e: "update:modelValue", value: Record<string, unknown>): void;
}>();

const formData = computed({
  get() {
    return props.modelValue || {};
  },
  set(value: Record<string, unknown>) {
    emit("update:modelValue", value);
  },
});

const formAnexos = computed(() => FormJs.anexos);
const finalForm = computed(() => {
  const formConfig = JSON.parse(JSON.stringify(formAnexos.value));
  return fieldConfigParser(formConfig);
});
</script>
