<template>
  <q-input
      :type="type"
      :rules="computedRules"
      outlined
      dense
      :model-value="modelValue"
      @update:model-value="updateValue"
    />
</template>
<script lang="ts" setup>
 import { validateRequiredField, maxLengthField, minLengthField } from "src/shared/utils/Input/validationInput";
import { computed } from "vue";
// Define props
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  maxLength: {
    type: Number,
    default: 0,
  },
  minLength: {
    type: Number,
    default: 0,
  },
  type:{type: String as () => "text" | "number" | "search" | "password" | "textarea" | "email" | "tel" | "file" | "url" | "time" | "date" | "datetime-local",
    default: "text"}
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (newValue: string) => {
  emit('update:modelValue', newValue);
};
const computedRules = computed(() => {
  // Always include the required field validation if needed
  const rules = [props.isRequired ? validateRequiredField : null];

  // Add additional validations only if the type is text or textarea
  if (props.type === 'text' || props.type === 'textarea') {
    rules.push(
      props.maxLength ? (v) => maxLengthField(props.maxLength, v) : null,
      props.minLength ? (v) => minLengthField(props.minLength, v) : null
    );
  }

  return rules.filter(rule => rule !== null);
});
</script>
