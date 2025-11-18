<template>
  <div class="q-pa-xl">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6 text-bold">Documentos adjuntos</div>
    </div>
    <FormComponentModel v-model="formData" :form="finalForm" />

    <div class="row justify-center q-mt-md q-gutter-sm">
      <q-btn
        label="Cancelar"
        text-color="black"
        style="border-radius: 8px; width: 200px; height: 48px; border: 1px solid #f2f4f5"
        no-caps
      />
      <q-btn
        label="Siguiente"
        :icon-right="'chevron_right'"
        color="primary"
        style="border-radius: 8px; width: 200px; height: 48px"
        no-caps
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { fieldConfigParser } from '@shell/components/Forms/formParser';

import FormComponentModel from '@shell/components/Forms/FormComponentModel.vue';
import FormJs from '@mf-forms/boot/form.json';

interface FormStep4Props {
  formSections?: unknown;
  modelValue?: Record<string, unknown>;
}

const props = withDefaults(defineProps<FormStep4Props>(), {
  modelValue: () => ({}),
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, unknown>): void;
}>();

const formData = computed({
  get() {
    return props.modelValue || {};
  },
  set(value: Record<string, unknown>) {
    emit('update:modelValue', value);
  },
});

const formAnexos = computed(() => FormJs.anexos);
const finalForm = computed(() => {
  const formConfig = JSON.parse(JSON.stringify(formAnexos.value));
  return fieldConfigParser(formConfig);
});
</script>
