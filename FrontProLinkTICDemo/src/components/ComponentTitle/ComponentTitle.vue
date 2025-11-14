<template>
  <header class="tw-w-full">
    <div class="col q-col-gutter-sm">
      <h5 :class="[classTitle, 'text-weight-semibold text-semibold q-my-none']">
        {{ title }}
      </h5>
      <p>{{ subtitle }}</p>
    </div>
  </header>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  subtitle?: string
  classTitle?: string
}>(), {
  classTitle: ''
})
</script>