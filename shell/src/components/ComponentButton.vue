<template>
  <q-btn
    :color="colorButton"
    :text-color="colorText"
    :class="[classButton, 'rounded-borders']"
    @click.stop="handler"
    typeButton
    :icon="icon"
    :icon-right="iconRight"
    :size="sizeButton"
    style="text-transform: none; min-width: 150px"
    :disable="disabledButton"
    :type="type"
    :label="text"
    :name="text"
    :aria-label="text"
  >
    <img v-if="img" :src="img" alt="button icon" class="q-pr-sm" />
  </q-btn>
</template>

<script setup lang="ts">
import { QBtn } from 'quasar';
const props = defineProps<{
  text: string;
  colorText: string;
  colorButton: string;
  classButton?: string;
  handleButton?: Function;
  typeButton?: 'flat' | 'outline' | 'unelevated' | 'glossy' | 'push';
  sizeButton?: string;
  icon?: string;
  iconRight?: string;
  img?: string;
  disabledButton?: boolean;
  type?: string;
}>();

function handler() {
  if (props.handleButton) {
    props.handleButton();
  }
}
</script>
