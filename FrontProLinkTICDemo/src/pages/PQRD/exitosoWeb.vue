<template>
  <q-dialog v-model="open" persistent class="tw-w-full tw-h-full">
    <div
      class="modal__container tw-bg-white tw-flex tw-justify-center tw-items-center tw-flex-col tw-text-center tw-h-[50%] tw-gap-9">
      <q-card-section class="flex column justify-center items-center tw-mt-[-12px]">
        <div class="tw-flex tw-justify-center tw-items-center">
          <span class="tw-rounded-[50px] tw-flex tw-justify-center tw-items-center" v-if="isSuccess"
            style="background-color: rgba(0, 0, 0, 0.064); width: 78px; height: 78px">
            <img v-lazy :data-url="CheckPqrd" alt="check" style="height: 45px; width: 45px;">
          </span>

          <span class="tw-rounded-[100px] tw-flex tw-justify-center" v-else
            style="background-color: #F6F6F9; width: 77px; height: 77px">
            <img v-lazy :data-url="InterrogationModal" alt="check" />
          </span>

        </div>
        <p class="tw-text-[24px] text-center tw-font-bold q-mt-xs tw-px-[15rem]">
          {{ title }}
        </p>
      </q-card-section>
      <div class="tw-mt-[-12px]">
        <p :class="['tw-text-[18px] text-center', downloadFile ? 'tw-w-[370px]' : '']">La respuesta será enviada
          en plazos definidos por la ley al medio que nos indicó en su solicitud.
        </p>
        <p class="tw-text-[18px] text-center tw-mt-2">Se envió a su correo una copia de su
          solicitud, pero también puede descargarla aquí.</p>
      </div>

      <div v-if="downloadFile">
        <p class="tw-text-2xl text-center tw-font-bold q-mt-lg tw-mb-3">{{ titleDownloadFile }}</p>
        <div
          class="tw-w-[380px] tw-p-1 tw-flex tw-justify-center tw-items-center tw-border-[1px] tw-border-gray-200 tw-gap-x-4">
          <img v-lazy :data-url="EXCEL" alt="">
          <span class="tw-text-md tw-w-[280px]">{{ textDownloadFile }}</span>
          <q-icon name="file_download" color="#969EAF" @click="handleIcon" class="tw-cursor-pointer">
          </q-icon>
        </div>
      </div>

      <div class="tw-flex tw-items-center tw-w-[55%] tw-gap-4">
        <q-btn :label="textButtonCancel ? textButtonCancel : 'Cancelar'" color="accent" text-color="black"
          v-if="cancelButton" class="tw-w-[100%] cancelar-button tw-rounded-md tw-h-10" flat @click="hideModal"
          v-close-popup />
        <q-btn :label="textButton" text-color="white" v-close-popup
          class="tw-rounded-xl tw-font-bold tw-h-10 tw-w-[100%] tw-bg-[#FF7500]" @click="handleButton" />
      </div>

    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
// @ts-ignore
import EXCEL from "assets/excel.svg"
// @ts-ignore
import InterrogationModal from "src/assets/interrogation-modal.svg";
// @ts-ignore
import CheckPqrd from "assets/check_pqrd.webp"

const props = defineProps<{
  title: string,
  isSuccess?: boolean,
  textButton: string,
  textButtonCancel?: string,
  cancelButton?: boolean,
  modelValue: boolean,
  downloadFile?: boolean
  titleDownloadFile?: string,
  textDownloadFile?: string,
  persistent?: boolean,
}>()

const emit = defineEmits(['closeModal', 'handleAccept', 'update:modelValue', 'handleDownloadFile'])

function hideModal() {
  emit('closeModal')
}

function handleButton() {
  emit('handleAccept')
}

function handleIcon() {
  emit('handleDownloadFile')
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

<style>
.modal__container {
  position: absolute;
  margin: 0 auto;
  min-width: 900px;
}

.cancelar-button {
  border: 1px solid black
}
</style>
