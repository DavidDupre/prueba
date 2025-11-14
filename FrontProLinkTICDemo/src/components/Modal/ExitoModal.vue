<template>
  <q-dialog persistent v-bind:model-value="showModal">
    <q-card class="q-py-md q-px-xl">
      <img class="q-mx-auto" style="width: 100px" v-lazy :data-url="ExclamationModal" />
      <q-card-section class="text-h6 tw-max-w-sm text-center text-weight-bold">
        Confirmación
      </q-card-section>

      <p class="tw-max-w-sm text-center tw-text-lg">
        {{ textShowModal }}
      </p>
      <q-card-actions align="center" class="q-mt-lg">
        <q-btn
          type="button"
          flat
          :label="textCancelModal"
          class="tw-h-12 text-weight-bold tw-text-lg"
          style="width: 45%"
          color="secondary"
          @click="$emit('update:showModal', false)"
          v-close-popup
        />
        <q-btn
          type="button"
          flat
          :label="textConfirmModal"
          class="tw-h-12 bg-secondary text-weight-bold tw-text-lg"
          style="width: 50%"
          color="white"
          @click="emitConfirmModal"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import ExclamationModal from 'src/assets/exclamation-modal.svg';

const props = withDefaults(defineProps<{
  showModal: boolean;
  textShowModal: string;
  textCancelModal: string;
  textConfirmModal: string;
  persistent: boolean;
}>(), {
  persistent: false,
});

const emit = defineEmits(["confirmModal", "update:showModal"]);

const emitConfirmModal = () => {
  emit("confirmModal");
};
</script>
