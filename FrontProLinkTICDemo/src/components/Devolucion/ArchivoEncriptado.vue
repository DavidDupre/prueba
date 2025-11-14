<template>
  <q-card class="col-12  tw-mx-4">
  <div class="row q-col-gutter-md q-pb-md q-px-md tw-mt-5">
      <div class="col row">
        <h3 class="tw-text-xl text-bold">Adjuntar Archivo Encriptado</h3>
      </div>

      <div class="cols-12 full-width">
        <span class="tw-text-label">Adjunte los documentos</span>
        <FileLoader
        class="tw-w-full"
        multiple
        :disable="fileDisable" :loading="fileLoading"
        v-model:model-value="files"
        accept-file=".enc, .gpg, .pgp, .aes, .kdbx"
        :max-file-size="10 * 1024 * 1024"
        :max-files="1"
        max-file-size-label="10"
        @rejected="rejectedFiles"
        />
      </div>
    </div>
  </q-card>
  <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
    <q-btn
      class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]"
      no-caps
      style="border: 1px solid #2c3948"
      label="Cancelar"
      @click="$emit('backView')"
    />
    <q-btn
      class="tw-w-1/4 tw-h-11 bg-primary text-white"
      type="submit"
      label="Guardar"
      @click="confirmModal = true"
    />
  </div>
  <Modal v-model="confirmModal" title="Confirmación" persistent
      :text="`¿Está seguro de adjuntar un soporte para el documento de ?`"
      :is-success="false" :cancelButton="true" @closeModal="confirmModal = false" textButtonCancel="No" text-button="Si"
      @handleAccept="handleFileUpload(files)" />
</template>

<script lang="ts" setup>
import FileLoader from 'src/components/FormFields/FileLoader.vue';
import { toast } from 'src/helpers/toast';
import { ref, onMounted, watch } from 'vue';
import Modal from 'components/Modal/Modal.vue';

const props = withDefaults(defineProps<{
  listDocs: [],
  visualize: () => {},
  download: () => {},
  deleteDoc: () => {},
  handleFileUpload: (files) => {}
}>(), {
})

const emit = defineEmits(['findDocs', 'backView'])
const files = ref([])
const fileLoading = ref(false)
const fileDisable = ref(false)
const listDocs = ref([])
const confirmModal = ref(false)


watch(
    () => files.value,
    async(newValue) => {
      if (!newValue || newValue.length === 0) return;

      newValue.forEach(file => {
        const findDoc = listDocs.value.find(doc => doc.nombre === file.name);
        if (findDoc) {
          toast.error(`El documento "${findDoc.nombre}" ya ha sido cargado`);
          files.value = files.value.filter(it => it.name !== findDoc.nombre);
        }
      });
    }
);

const rejectedFiles = (error) => {
  if (error.some((it) => it.failedPropValidation === 'max-file-size')) {
    toast.error('El peso permitido es hasta 50MB.')
  }
  if (error.some((it) => it.failedPropValidation === 'max-files')) {
    toast.error('Solo se pueden adjuntar 30 archivos.')

  }
  if (error.some((it) => it.failedPropValidation === 'accept')) {
    toast.error('Formato inválido, los formatos permitidos son (enc, gpg, pgp, aes, kdbx).')
  }
}

onMounted(async () => {
})
</script>
