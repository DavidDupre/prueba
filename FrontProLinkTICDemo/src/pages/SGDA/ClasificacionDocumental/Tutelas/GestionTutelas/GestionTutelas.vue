<template>
  <template>
    <q-dialog v-model="open" :persistent="persistent">
      <q-card class="tw-px-3 tw-h-[610px] tw-w-[500px]">
        <q-card-section class="">
          <p class="tw-text-[24px] text-center tw-font-bold q-mt-lg">
            Gestión Tutelas
          </p>

          <q-form ref="formValidate">
            <div class="[&>*]:tw-mb-4">

              <label>Gestionar radicado de salida</label>
              <q-file bottom-slots label="Seleccione un archivo" dense outlined v-model="form.fileRadicado"
                :rules="[inputRequired]">
                <template v-slot:prepend>
                  <q-icon name="attach_file" @click.stop.prevent />
                </template>
                <template v-slot:append>
                  <q-icon name="close" class="cursor-pointer" @click.stop.prevent="form.fileRadicado = null" />
                </template>
              </q-file>

              <label>Anexos al radicado de salida</label>
              <File v-model:model-value="form.filesAnexos" accept-file=".pdf" :rules="[inputRequired]" />

              <label>Siniestro</label>
              <q-input outlined dense v-model="form.siniestro" :rules="[inputRequired]" />
            </div>

            <div class="tw-flex tw-mt-8">
              <q-btn label="Cancelar" color="accent" text-color="black" class="tw-p-3" style="width: 210px;" flat
                @click="modelValue = false" />
              <q-btn label="Guardar" style="width: 200px" text-color="white" color="primary" class="tw-rounded-xl tw-p-3 "
                @click="uploadFiles" />
            </div>
          </q-form>

        </q-card-section>
      </q-card>
    </q-dialog>
  </template>

  <Modal v-model="successModal" title="Operación exitosa" :text="textModal" is-success text-button="¡Ok!"
    @handleAccept="successModal = false" />
  <Modal v-model="errorModal" title="Ha ocurrido un error" :text="textModal" :is-success="false" text-button="Aceptar"
    cancel-button="Cancelar" @handleAccept="errorModal = false" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useQuasar } from "quasar";

import { sgdeaAxios } from "src/services";

import { inputRequired } from "src/helpers/validations";
import File from "src/components/FormFields/FileLoader.vue";
import Modal from "src/components/Modal/Modal.vue";


const props = defineProps<{
  persistent?: boolean
}>();

const q = useQuasar()
const form = ref({
  fileRadicado: '',
  filesAnexos: [],
  siniestro: ''
});
const formValidate = ref()
const successModal = ref(false);
const textModal = ref(null);
const errorModal = ref(false)

const emit = defineEmits(['update:modelValue'])

const open = ref(true)

const uploadFiles = async () => {
  if (await formValidate.value.validate()) {
    const files = form.value.filesAnexos
    let formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      await uploadFileServie(formData)
    }

    if (form.value.fileRadicado) {
      formData.append('file', form.value.fileRadicado);
      await uploadFileServie(formData)
    }
  }
}

onMounted(() => open.value = true)

const uploadFileServie = async (formData: any) => {
  try {

    const response = await sgdeaAxios.post('/api/v1/integracion/bonita/fileUpload', formData);

    if (response?.status === 200) {
      successModal.value = true
      textModal.value = 'La subida de archivos ha sido exitoso';
      form.value = {
        fileRadicado: null,
        filesAnexos: null,
        siniestro: null,
      }
    }
  } catch (error) {
    console.error('Error al subir archivos:', error);
    errorModal.value = true
    textModal.value = 'Ha ocurrido un error en la subida de archivos';
  }
}
</script>
