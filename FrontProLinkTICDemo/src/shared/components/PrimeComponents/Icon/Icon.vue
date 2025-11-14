<template>
  <i :class="createCss()"></i>
</template>
<script setup lang="ts">
const props = defineProps<{
  name: string;
  color?: string;
  size: string;
  class?: string;
}>();

const createCss = () => {
  let css = ``;
  css = `fa-solid fa-${props.name} tw-bg-${props.color} tw-text-${props.size} ${props.class}`;
  return css;
};
</script>
