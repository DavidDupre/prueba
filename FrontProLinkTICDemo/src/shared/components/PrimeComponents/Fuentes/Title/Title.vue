<template>
  <h2 class="pl-4 tw-font-bold tw-text-3xl tw-my-2 text-bold lg:tw-ml-2">
    {{ props.label }}
  </h2>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = withDefaults(
  defineProps<{
    label?: string;
  }>(),
  {}
);
</script>
