<template>
  <q-btn
    flat
    no-caps
    class="navigation-item"
    :class="{ 'navigation-item--active': isActive }"
    @click="handleClick"
  >
    <div class="navigation-item__content">
      <q-icon :name="icon" size="20px" class="navigation-item__icon" />
      <span class="navigation-item__label">{{ label }}</span>
    </div>
  </q-btn>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

// Props
interface Props {
  icon: string;
  label: string;
  isActive?: boolean;
}

defineProps<Props>();

// Emits
const emit = defineEmits<{
  click: [];
}>();

// Methods
const handleClick = (): void => {
  emit('click');
};
</script>

<style lang="scss" scoped></style>
