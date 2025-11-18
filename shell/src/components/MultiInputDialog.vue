<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="closeDialog"
    persistent
    :maximized="fullscreen"
  >
    <q-card class="my-card" :style="cardStyle">
      <!-- Contenido con ícono -->
      <q-card-section v-if="!fullscreen" class="bg-white text-black q-pt-xl q-pb-md">
        <div v-if="type" class="full-width row justify-center items-center content-start">
          <div class="icon-container">
            <img :src="trash" alt="" v-if="type == 'trash'" style="width: 60px; height: 60px" />
            <img
              :src="error"
              alt=""
              v-else-if="type == 'error'"
              style="width: 60px; height: 60px"
            />
            <img
              :src="question"
              alt=""
              v-else-if="type == 'question'"
              style="width: 60px; height: 60px"
            />
            <img :src="success" alt="" v-else style="width: 60px; height: 60px" />
          </div>
        </div>
      </q-card-section>

      <q-card-section class="bg-white" :class="contentClass">
        <div
          v-if="title && !fullscreen"
          class="text-black text-weight-bold text-center q-mb-sm text-h4"
          style="word-break: break-word"
        >
          {{ title }}
        </div>
        <div
          v-if="subtitle && !fullscreen"
          class="text-black text-center q-mb-md"
          style="word-break: break-word; color: #666; font-size: 15px"
        >
          {{ subtitle }}
        </div>
        <q-form ref="InputsForm" @submit.prevent.stop="finish" @reset="t" greedy>
          <div class="full-width input" :class="slotClass">
            <span class="label q-mb-sm">{{ label }}</span>
            <q-input
              outlined
              dense
              type="text"
              v-if="input == 'text'"
              :label="label"
              v-model="value"
            />
            <q-input
              outlined
              dense
              type="date"
              v-else-if="input == 'date'"
              v-model="value"
              :label="label"
            />
            <q-select
              outlined
              dense
              v-else-if="input == 'select'"
              map-options
              emit-value
              :options="options"
              :label="label"
              v-model="value"
            />
            <q-input
              outlined
              dense
              type="textarea"
              v-else-if="input == 'textarea'"
              :label="label"
              v-model="value"
            />
            <q-input
              outlined
              dense
              type="textarea"
              v-else-if="input == 'textarea-length'"
              :label="label"
              v-model="value"
            />
            <q-input
              outlined
              dense
              type="time"
              v-else-if="input == 'time'"
              v-model="value"
              :label="label"
            />
          </div>

          <div class="row justify-center q-gutter-md" :class="actionsClass">
            <q-btn
              v-close-popup
              flat
              :label="cancelarLabel"
              type="reset"
              @click="handleCancel"
              no-caps
              class="q-px-xl q-py-sm"
              style="color: #666; font-weight: 500; font-size: 15px; width: 200px; height: 60px"
            />
            <q-btn
              :label="acceptLabel"
              type="submit"
              unelevated
              no-caps
              class="q-px-xl q-py-sm"
              style="
                background-color: #2c3e50;
                color: white;
                font-weight: 500;
                font-size: 15px;
                border-radius: 6px;
                width: 200px;
                height: 60px;
              "
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import success from '../assets/dialog/check.svg';
// import error from "assets/dialog/cross.svg";
import question from '../assets/dialog/question.svg';
import { ref, watch, computed } from 'vue';

import { QDialog, QCard, QCardSection, QBtn, QInput, QForm, QSelect } from 'quasar';
// import validations from "src/helpers/rules";
// const { isRequired } = validations;

const emit = defineEmits(['update:modelValue', 'update:textValue']);

const props = withDefaults(
  defineProps<{
    type: 'success' | 'trash' | 'error' | 'question';
    input: 'text' | 'date' | 'select' | 'textarea' | 'time' | 'textarea-length';
    options: {};
    title: string;
    subtitle: string;
    label: string;
    action?: () => void;
    cancelarLabel: string;
    cancelarAction: () => void;
    acceptLabel: string;
    modelValue: boolean;
    textValue: string;
    fullscreen?: boolean;
    maxWidth?: string;
  }>(),
  {
    action: () => {},
    cancelarLabel: 'Cancelar',
    cancelarAction: () => {},
    acceptLabel: 'Aceptar',
    modelValue: false,
    textValue: '',
    fullscreen: false,
    maxWidth: '500px',
  },
);

const cardStyle = computed(() => {
  if (props.fullscreen) {
    return '';
  }
  return `min-width: 400px; max-width: ${props.maxWidth}; border-radius: 12px;`;
});

const contentClass = computed(() => {
  if (props.fullscreen) {
    return 'q-pa-md';
  }
  return 'q-pt-none q-px-lg q-pb-xl';
});

const slotClass = computed(() => {
  if (props.fullscreen) {
    return '';
  }
  return 'q-mx-sm q-mb-lg';
});

const actionsClass = computed(() => {
  if (props.fullscreen) {
    return 'q-mt-lg';
  }
  return 'q-mt-md';
});

const InputsForm = ref<QForm | null>(null); // Ref para el formulario
const value = ref(props.textValue);

function closeDialog(val: boolean) {
  emit('update:modelValue', val);
}
function handleCancel() {
  props.cancelarAction();
  closeDialog(false);
}

async function finish() {
  await props.action();
  closeDialog(false);
}
watch(
  () => props.textValue,
  (newValue) => {
    value.value = newValue;
  },
);

watch(value, (newValue) => {
  emit('update:textValue', newValue);
});
</script>

<style scoped>
.my-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.label {
  color: #6b737c;
  font-weight: 700;
}

.input {
  display: flex;
  flex-direction: column;
}
</style>
