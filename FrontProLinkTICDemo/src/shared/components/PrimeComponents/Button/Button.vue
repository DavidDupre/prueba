<script setup lang="ts">
import { computed, defineProps, defineEmits } from "vue";
import Icon from "src/shared/components/PrimeComponents/Icon/Icon.vue";

const props = withDefaults(
  defineProps<{
    label?: string;
    type?: "primary" | "secondary" | "tertiary" | "danger";
    typeButton?: "button" | "submit" | "reset";
    class?: string;
    iconLeft?: string;
    iconRight?: string;
    color: string;
    disabled?: boolean;
  }>(),
  {
    type: "primary",
    disabled: false,
  }
);
const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const buttonClasses = computed(() => ({
  "tw-py-3 tw-px-[25px] tw-font-bold tw-text-base tw-rounded-lg hover:tw-opacity-70 hover:tw-shadow-md active:tw-opacity-100 disabled:tw-text-gray-dark disabled:tw-shadow-none":
    true,
  [`tw-bg-${props.color} tw-text-white disabled:tw-bg-gray-light`]:
    props.type === "primary",
  [`tw-bg-white tw-text-${props.color} tw-border-[1.5px] tw-border-${props.color} disabled:tw-border-gray-dark`]:
    props.type === "secondary",
  [`tw-bg-red-500 tw-text-white tw-border-[1.5px] disabled:tw-border-gray-dark`]:
    props.type === "danger",
  [`tw-bg-white tw-text-${props.color}`]: props.type === "tertiary",
  [props.class ?? ""]: !!props.class,
}));

const hasIconsOnly = computed(() => !props.label && (props.iconLeft || props.iconRight));
</script>

<template>
  <button :class="buttonClasses" :type="props.typeButton" :disabled="props.disabled" @click="emit('click', $event)">
    <div :class="['tw-flex tw-flex-row tw-justify-center tw-items-center', !hasIconsOnly ? 'tw-gap-4' : '']">
      <Icon v-if="props.iconLeft" :name="props.iconLeft" size="xl" />
      <div v-if="props.label">{{ props.label }}</div>
      <Icon v-if="props.iconRight" :name="props.iconRight" size="xl" />
    </div>
  </button>
</template>
