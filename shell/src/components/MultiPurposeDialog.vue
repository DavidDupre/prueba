<template>
  <q-dialog v-model="card" persistent :maximized="fullscreen">
    <q-card class="my-card" :style="cardStyle">
      <!-- Header with title and close button, title positionable -->
      <q-card-section v-if="showHeader" class="row items-center q-pa-md bg-white">
        <div
          :class="['text-h6', 'text-weight-bold', 'text-black', headerTitlePositionClass]"
          style="width: 100%"
        >
          {{ headerTitle }}
        </div>
        <q-space v-if="headerTitlePosition !== 'center'" />
        <q-btn icon="close" flat round dense @click="handleCancel" color="grey-7" />
      </q-card-section>

      <!-- Contenido con ícono (solo si viene type en las props y no fullscreen) -->
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

      <!-- Main content section with title position support -->
      <q-card-section class="bg-white" :class="contentClass">
        <div
          v-if="preTitle && !fullscreen"
          :class="['text-black', preTitlePositionClass, 'q-mb-xs']"
          style="word-break: break-word; color: #666; font-size: 15px"
        >
          {{ preTitle }}
        </div>

        <div
          v-if="title && !fullscreen"
          :class="['text-black', 'text-weight-bold', titlePositionClass, 'q-mb-sm', titleSizeClass]"
          style="word-break: break-word; font-size: 24px"
        >
          {{ title }}
        </div>

        <div
          v-if="subtitle && !fullscreen"
          :class="['text-black', subtitlePositionClass, 'q-mb-md']"
          style="word-break: break-word; color: #666; font-size: 15px"
          v-html="subtitle"
        ></div>

        <div
          v-if="description && !fullscreen"
          :class="['text-black', descriptionPositionClass, 'q-mb-lg']"
          style="word-break: break-word; color: #333; font-size: 15px; line-height: 1.5"
          v-html="description"
        ></div>
        <div
          v-if="user && !fullscreen"
          :class="['text-black', descriptionPositionClass, 'q-mb-lg']"
          style="word-break: break-word; color: #333; font-size: 15px; line-height: 1.5"
          v-html="user"
        ></div>

        <!-- Slot para contenido personalizado (tablas, formularios, etc) -->
        <div v-if="$slots.default && showSlot" :class="slotClass">
          <slot></slot>
        </div>

        <!-- Botones -->
        <div v-if="!hideActions" class="row justify-center q-gutter-md" :class="actionsClass">
          <q-btn
            v-if="cancelLabel"
            :label="cancelLabel"
            @click="handleCancel"
            flat
            no-caps
            class="q-px-xl q-py-sm"
            style="color: #666; font-weight: 500; font-size: 15px; width: 200px; height: 60px"
          />
          <q-btn
            v-close-popup
            :label="acceptLabel"
            @click="handleAccept"
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
          <q-btn
            v-if="downloadLabel"
            :label="downloadLabel"
            @click="handleDownload"
            outline
            no-caps
            class="q-px-xl q-py-sm"
            style="
              border-color: #2c3e50;
              color: #2c3e50;
              font-weight: 500;
              font-size: 15px;
              border-radius: 6px;
              width: 200px;
              height: 60px;
            "
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { QDialog, QCard, QCardSection, QBtn, QSpace } from 'quasar';
// import trash from "assets/dialog/trash.svg"
// import error from "assets/dialog/cross.svg"
import success from '../assets/dialog/check.svg';
import question from '../assets/dialog/question.svg';

const card = ref(true);

const props = withDefaults(
  defineProps<{
    type?: 'success' | 'trash' | 'error' | 'question';
    title?: string;
    preTitle?: string;
    subtitle?: string;
    description?: string;
    user?: string;
    action?: () => void;
    cancelLabel?: string;
    cancelAction?: () => boolean | void;
    acceptLabel?: string;
    downloadLabel?: string;
    downloadAction?: () => void;
    showSlot?: boolean;
    titleSize?: 'small' | 'medium' | 'large';
    fullscreen?: boolean;
    showHeader?: boolean;
    headerTitle?: string;
    hideActions?: boolean;
    maxWidth?: string;
    // NUEVO: property for title position ("center" or "start" (default))
    titlePosition?: 'center' | 'start';
    // For descriptive sections
    preTitlePosition?: 'center' | 'start';
    subtitlePosition?: 'center' | 'start';
    descriptionPosition?: 'center' | 'start';
    // For header title
    headerTitlePosition?: 'center' | 'start';
  }>(),
  {
    action: () => {},
    cancelLabel: '',
    cancelAction: () => {},
    acceptLabel: 'Aceptar',
    downloadLabel: '',
    downloadAction: () => {},
    showSlot: true,
    titleSize: 'large',
    fullscreen: false,
    showHeader: false,
    headerTitle: '',
    hideActions: false,
    maxWidth: '500px',
    titlePosition: 'center',
    preTitlePosition: 'center',
    subtitlePosition: 'center',
    descriptionPosition: 'center',
    headerTitlePosition: 'start',
  },
);

const titleSizeClass = computed(() => {
  switch (props.titleSize) {
    case 'small':
      return 'text-h6';
    case 'medium':
      return 'text-h5';
    case 'large':
    default:
      return 'text-h4';
  }
});

const titlePositionClass = computed(() => {
  return props.titlePosition === 'center' ? 'text-center' : 'text-left';
});
const preTitlePositionClass = computed(() => {
  return props.preTitlePosition === 'center' ? 'text-center' : 'text-left';
});
const subtitlePositionClass = computed(() => {
  return props.subtitlePosition === 'center' ? 'text-center' : 'text-left';
});
const descriptionPositionClass = computed(() => {
  return props.descriptionPosition === 'center' ? 'text-center' : 'text-left';
});
const headerTitlePositionClass = computed(() => {
  return props.headerTitlePosition === 'center' ? 'text-center' : 'text-left';
});

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

function handleCancel() {
  const result = props.cancelAction();
  if (result === false || result === undefined) {
    card.value = false;
  }
}

function handleAccept() {
  props.action();
  card.value = false;
}

function handleDownload() {
  if (props.downloadAction) {
    props.downloadAction();
  }
}
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
</style>
