<template>
  <section>
    <q-dialog v-model="open">
      <q-card class="tw-p-5 tw-w-[450px] tw-h-[auto]">
        <div class="tw-flex tw-justify-center tw-mt-3">
          <span class="tw-rounded-[50px] tw-flex tw-justify-center" v-if="isSuccess"
            style="background-color: rgba(0, 219, 0, 0.05); width: 130px; height: 82px">
            <img v-lazy :data-url="Check" alt="check" width="40">
          </span>

          <span class="tw-rounded-[100px] tw-flex tw-justify-center" v-else
            style="background-color: #F6F6F9; width: 82px; height: 82px">
            <img v-lazy :data-url="InterrogationModal" alt="check" />
          </span>

        </div>
        <q-card-section class="flex justify-center items-center">
          <p class="tw-text-[24px] text-center tw-font-bold q-mt-xs">
            {{ title }}
          </p>
          <div>
            <slot />
          </div>
          <div class="tw-rounded-lg  tw-mt-3">
            <div class="tw-flex tw-gap-2 tw-justify-center tw-items-center tw-pt-10">
              <q-btn :label="leftTitleButton ? leftTitleButton : 'Cancelar'" text-color="secondary" class="tw-p-3"
                style="width: 200px; height: 50px;" flat @click="hideModal" />
              <q-btn :label="titleButton ? titleButton : 'Aceptar'" color="secondary" @click="acceptModal"
                style="width: 200px; height: 50px;" class="tw-rounded-xl tw-p-3" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </section>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import Check from "src/assets/check.svg";
import InterrogationModal from "src/assets/interrogation-modal.svg";
const props = defineProps<{
  modelValue: boolean,
  titleButton?: string,
  leftTitleButton?: string,
  isSuccess?: boolean,
  title: string,
}>()

const emit = defineEmits(['update:modelValue', 'closeModal', 'handleAccept'])

function hideModal() {
  emit('closeModal')
}

function acceptModal() {
  emit('handleAccept')
}

const open = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>
