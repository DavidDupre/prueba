<template>
  <q-form ref="myForm3">
    <q-card class="tw-rounded-xl q-pa-lg" flat>
      <div class="col row">
        <p class="tw-text-2xl tw-font-bold">Documento de entrada</p>
      </div>
      <div class="tw-mt-2">
        <div class="row q-col-gutter-md q-pb-md q-px-md">
          <div class="col-12">
            <label class="tw-w-full">
              <span class="tw-text-label">Adjunte los documentos</span>
              <FileLoader v-model="form3.docs" class="tw-w-full"
                accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
                sub-title="Puede adjuntar (30) Archivo(s) cada uno con un tamaño permitido de 50MB en cualquiera de las siguientes extenciones <hr>(pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)"
                :max-file-size="50 * 1024 * 1024" multiple max-file-size-label="50" :max-files="30"
                @rejected="rejectedFiles" />
            </label>
          </div>
        </div>
      </div>
    </q-card>
    <div class="tw-flex tw-justify-center tw-items-center tw-my-10 tw-gap-6">
      <q-btn label="Regresar" text-color="white" icon="chevron_left" style="width: 220px" color="primary"
        class="tw-rounded-xl tw-h-12 tw-p-2" @click="emit('prev-step')">
      </q-btn>
      <q-btn label="Cancelar" type="reset" style="width: 220px" text-color="black" color="accent"
        class="tw-rounded-xl tw-h-12" @click="emit('cancel')" />
      <q-btn type="button" label="Radicar" text-color="white" style="width: 240px" color="primary"
        class="tw-rounded-xl tw-h-12 tw-p-2" @click="createRadicacion" :disabled="isButtonDisabled"
        :loading="isLoading" />
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import FileLoader from '../FileLoader.vue';
import { toast } from 'src/helpers/toast';

const emit = defineEmits(['cancel', 'next-step', 'prev-step'])
const props = defineProps({
  isLoading: Boolean
})

const form3 = ref({
  docs: ''
})
const MAX_FILE = 30
const isButtonDisabled = ref(false)

function createRadicacion() {
  isButtonDisabled.value = true
  emit("next-step", form3.value)
}

const rejectedFiles = (error: any[]) => {
  if (error.some((it: { failedPropValidation: string; }) => it.failedPropValidation === 'max-file-size')) {
    toast.error("El peso permitido es hasta 50MB.")
  }
  if (error.some((it: { failedPropValidation: string; }) => it.failedPropValidation === 'max-files')) {
    toast.error(`Solo se pueden adjuntar ${MAX_FILE} archivos.`)
  }
  if (error.some((it: { failedPropValidation: string; }) => it.failedPropValidation === 'duplicate')) {
    toast.error('No puedes subir archivos duplicados')
  }
  if (error.some((it: { failedPropValidation: string; }) => it.failedPropValidation === 'accept')) {
    toast.error('Formato inválido, los formatos permitidos son (pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg).')
  }
}
</script>
