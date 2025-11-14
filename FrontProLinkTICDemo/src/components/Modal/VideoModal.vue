<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="(val) => emit('update:modelValue', val)"
  >
    <q-card style="width: 800px; max-width: 90vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Tutorial: ¿Cómo cambiar tu contraseña?</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-video :ratio="16 / 9" :src="videoUrl" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  videoUrl: string;
}>();

const emit = defineEmits(['update:modelValue']);
</script>