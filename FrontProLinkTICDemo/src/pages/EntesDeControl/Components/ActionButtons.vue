<template>
  <div class="tw-flex tw-justify-center tw-items-center tw-my-10 tw-gap-6">
    <div v-if="!showBackButton">
      <q-btn
        label="Cancelar"
        type="reset"
        style="width: 240px"
        text-color="black"
        color="accent"
        class="tw-rounded-xl tw-h-12"
        @click="handleCancelClick"
      />
      <q-btn
        :label="nextLabel"
        text-color="white"
        style="width: 240px"
        :color="primaryColor"
        class="tw-rounded-xl tw-h-12 tw-p-2"
        @click="handleNextClick"
      />
    </div>
    <div v-if="showBackButton">
      <q-btn
        label="Regresar"
        text-color="white"
        style="width: 240px"
        :color="primaryColor"
        class="tw-rounded-xl tw-h-12 tw-p-2"
        @click="handleBackClick"
        :disabled="isBtnDisabled"
      />
      <q-btn
        label="Cancelar"
        type="reset"
        style="width: 240px"
        text-color="black"
        color="accent"
        class="tw-rounded-xl tw-h-12"
        @click="handleCancelClick"
        :disabled="isBtnDisabled"
      />
      <q-btn
        :label="nextLabel"
        text-color="white"
        style="width: 240px"
        :color="primaryColor"
        class="tw-rounded-xl tw-h-12 tw-p-2"
        @click="handleNextClick"
        :disabled="isBtnDisabled"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";

defineProps({
  nextLabel: {
    type: String,
    required: true,
  },
  primaryColor: {
    type: String,
    required: true,
  },
  showBackButton: {
    type: Boolean,
    required: true,
  },
  isBtnDisabled: {
    type: Boolean,
    required: false
  }
});

const emits = defineEmits(["next", "cancel", "back"]);

const handleNextClick = () => {
  emits("next");
};

const handleCancelClick = () => {
  emits("cancel");
};

const handleBackClick = () => {
  emits("back");
};
</script>
