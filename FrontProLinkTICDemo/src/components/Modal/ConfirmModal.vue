<template>
  <q-dialog persistent v-bind:model-value="showModal">
    <q-card class="q-py-xl q-px-xl">
      <img class="q-mx-auto" style="width: 100px" v-lazy :data-url="InterrogationModal" />
      <q-card-section class="text-h6 tw-max-w-sm text-center text-weight-bold">
        Confirmación
      </q-card-section>

      <p class="tw-max-w-sm text-center tw-text-lg">
        {{ textShowModal }}
      </p>

      <p v-if="textLinks && textLinks.length" class="tw-max-w-sm text-center tw-text-sm">
        <span v-for="(item, index) in textLinks" :key="index" class="tw-block tw-mb-1">
          {{ item.description }}
          <a :href="item.url" target="_blank" class="tw-ml-1 tw-text-primary tw-underline"
            style="color: var(--secondary)">
            {{ item.text }}
          </a>
        </span>
      </p>

 <q-card-actions align="center" class="q-mt-sm">
        <q-btn
          v-if="!loading"
          type="button"
          flat
          :label="textCancelModal"
          class="tw-h-12 text-weight-bold tw-text-lg"
          style="width: 45%"
          color="secondary"
          @click="textLinks && textLinks.length > 0 ? emitOnActionClick('cancel') : $emit('update:showModal', false)"
          v-close-popup
        />
        <q-btn
          v-if="!loading"
          type="button"
          flat
          :label="textConfirmModal"
          class="tw-h-12 bg-secondary text-weight-bold tw-text-lg"
          style="width: 50%"
          color="white"
          @click="textLinks && textLinks.length > 0 ? emitOnActionClick('confirm') : emitConfirmModal()"
        />
        <q-btn
          v-if="loading"
          type="button"
          flat
          :label="textConfirmModal"
          class="tw-h-12 text-weight-bold tw-text-2xl"
          style="width: 50%"
          color="orange"
          @click="textLinks && textLinks.length > 0 ? emitOnActionClick('confirm') : emitConfirmModal()"
          :loading="loading"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import InterrogationModal from "src/assets/interrogation-modal.svg";

interface TextLink {
  description: string;
  text: string;
  url: string;
}

const props = withDefaults(defineProps<{
  showModal: boolean;
  textShowModal: string;
  textCancelModal: string;
  textConfirmModal: string;
  persistent: boolean;
  loading?: boolean
  textLinks?: TextLink[];
}>(), {
  persistent: false,
});

const emit = defineEmits(["confirmModal", "update:showModal", "onActionClick"]);

const emitConfirmModal = () => {
  emit("confirmModal");
};
const emitOnActionClick = (action: 'confirm' | 'cancel') => {
  emit("onActionClick", action);
};
</script>
