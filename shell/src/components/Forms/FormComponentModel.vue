<!-- CustomInput.vue -->
<script setup lang="ts">
import { computed } from "vue";
import type { FormStructure } from "./index"; // Agregar type
import FormComponentModelInputs from "./FormComponentModelInputs.vue";

const props = defineProps<{
  form: FormStructure;
  modelValue: Record<string, unknown>; // Cambiar any por tipo específico
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Record<string, unknown>): void;
}>();

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value: Record<string, unknown>) {
    emit("update:modelValue", value);
  },
});
</script>
<template>
  <div>
    <div class="col row q-pa-md">
      <b class="h7">{{ form.title }}</b>
    </div>

    <FormComponentModelInputs v-model="value" :form="form" />
  </div>
</template>

<style lang="scss">
.file-loader_custom {
  height: 200px;
  min-width: 1080px;
  max-width: 500px;
}
</style>
