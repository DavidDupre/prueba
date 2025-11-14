<script setup lang="ts">

import {defineEmits} from "vue";

const props = defineProps({
  userName: {
    type: String,
    required: true,
    default: "Nombre Usuario"
  }
});

const emit = defineEmits<{
  (e: 'remove'): void;
  (e: 'confir'): void;
}>();
</script>

<template>

  <div class="tw-ml-4 tw-mr-4 tw-mb-4">
    <div
      class="tw-max-w tw-rounded-lg tw-bg-white tw-text-[0.8125rem]/5 tw-text-slate-900 tw-shadow-xl tw-shadow-black/5 tw-ring-1 tw-ring-slate-700/10">
      <div class="tw-flex tw-items-center tw-p-4 tw-pb-0">
        <div class="tw-flex-auto">
          <div class="tw-font-medium"><strong>{{ props.userName }}</strong></div>
        </div>
      </div>
      <div class="tw-flex tw-gap-3 tw-p-4">
        <div
          title="Confirmar cambios"
          @click="emit('confir')"
          class="accept tw-pointer-events-auto tw-rounded-md tw-bg-orange-600 tw-px-3 tw-py-2 tw-text-[0.8125rem]/5 tw-font-semibold tw-text-white tw-hover:bg-indigo-500">
          <i class="fa-solid fa-check"></i>
        </div>
        <div
          title="Descartar cambios"
          @click="emit('remove')"
          class="refuse tw-pointer-events-auto tw-rounded-md tw-px-4 tw-py-2 tw-text-center tw-font-medium tw-shadow-sm tw-ring-1 tw-ring-slate-700/10 tw-hover:bg-slate-50">
          <i class="fa-solid fa-x"></i>
        </div>
      </div>
    </div>

  </div>

</template>

<style lang="scss" scoped>
  .accept, .refuse {
    width: 2.5rem;
    height: 1.8rem;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all .3s;
    &:hover {
      opacity: .8;
    }
  }
</style>
