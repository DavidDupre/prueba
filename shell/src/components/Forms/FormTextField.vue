<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);

function update(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
}
</script>

<template>
  <div class="mf-form-textfield">
    <label v-if="label">{{ label }}</label>
    <input
      :placeholder="placeholder"
      :value="modelValue"
      @input="update"
      class="mf-input"
    />
  </div>
</template>

<style scoped>
.mf-input {
  padding: 0.4rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
