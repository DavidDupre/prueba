<template>
 <q-dialog v-bind="dialogProps" @hide="closeModal">
    <q-card class="q-ma-md">
      <q-card-section>
        <h1 class="text-h6 tw-font-bold">{{ title }}</h1>
        <p class="q-my-md">{{ detalle }}</p>
      </q-card-section>
      <q-card-actions class="q-mt-md q-pt-none q-pb-md justify-center">
        <q-btn flat class="tw-bg-primary  tw-w-52" label="Cerrar" @click="closeModal" color="white" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps<{
  isVisible: boolean;
  detalle: string;
  title: string;
}>();

const emit = defineEmits<{
  (event: 'update:isVisible', value: boolean): void;
}>();

const dialogProps = computed(() => ({
  modelValue: props.isVisible,
  'onUpdate:modelValue': (value: boolean) => emit('update:isVisible', value),
}));

const closeModal = () => {
  emit('update:isVisible', false);
};
</script>

