<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        class="tw-fixed tw-inset-0 tw-z-[9999] tw-flex tw-items-center tw-justify-center"
      >
        <div
          class="tw-absolute tw-inset-0 tw-bg-black/70"
          @click="closeModal"
        ></div>

        <div
          :class="[widthClass, maxWidthClass]"
          class="tw-relative tw-mx-4 tw-bg-white tw-rounded-lg tw-overflow-hidden"
          @click.stop
        >
          <div class="tw-relative">
            <img
              :alt="altText"
              :src="imageUrl"
              class="tw-w-full tw-h-full tw-object-cover"
            />
            <button
              @click="closeModal"
              class="tw-absolute tw-top-1 tw-right-3 tw-flex tw-items-center tw-justify-center tw-w-8 tw-h-8 tw-rounded-full tw-bg-black/80 tw-transition-colors"
              aria-label="Cerrar modal"
            >
              <svg class="tw-w-5 tw-h-5 tw-text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="tw-p-4 tw-flex tw-justify-start">
            <button
              @click="openVideo"
              class="tw-bg-primary hover:tw-bg-orange-600 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded-lg tw-flex tw-items-center tw-gap-2 tw-transition-colors"
            >
              <svg class="tw-w-5 tw-h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path>
              </svg>
              Ver video: ¿Cómo cambiar mi contraseña?
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  imageUrl: { type: String, required: true },
  altText: { type: String, default: 'Banner promocional' },
  widthClass: { type: String, default: 'tw-w-[1200px]' },
  maxWidthClass: { type: String, default: 'tw-max-w-[95vw]' },
});

const emit = defineEmits(['update:modelValue', 'open-video']);

const closeModal = () => {
  emit('update:modelValue', false);
};

const openVideo = () => {
  emit('open-video');
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    closeModal();
  }
};

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>