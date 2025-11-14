<template>
  <div class="tw-col-span-6">
    <p class="tw-text-label tw-font-semibold">{{ label }} {{ isRequired ? "*" : "" }} {{  (modelValue || '').length }}/{{ maxLength }}</p>
    <p> {{ description }} </p>
    <Input
    :modelValue="modelValue"
      :isRequired="isRequired"
      :maxLength="maxLength"
      :minLength="minLength"
      type="textarea"
      label="Inserte"
      @update:modelValue="updateValue"
    />
  </div>
</template>

<script lang="ts" setup>
 import Input  from '../Input/Input.vue'
// Define props
defineProps({
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
  label: {
    type: String,
    default: "",
  },
  description:{
    type: String,
    default: "",
  }
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (newValue: string) => {
  emit('update:modelValue', newValue);
};
</script>
