
<template>
<p class="!tw-text-label tw-font-medium tw-text-sm tw-mt-2">
    {{props.label }}
    <span class="tw-text-secondary">{{ props.isRequiered ? "*" : "" }}</span>
  </p>
</template>
<script setup lang="ts">
const props = defineProps<{
  isRequiered?: boolean;
  label: string;
}>();

</script>

