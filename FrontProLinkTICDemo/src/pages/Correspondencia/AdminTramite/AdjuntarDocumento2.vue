<template>
  <div class="row q-col-gutter-md q-pb-md q-px-md tw-mt-5">
    <div class="col row">
      <h3 class="tw-text-xl text-bold">Adjuntar documento al radicado</h3>
    </div>

    <div class="cols-12 full-width">
      <q-form ref="formFile">
        <span class="tw-text-label">Adjunte los documentos</span>
        <FileLoader
          class="tw-w-full"
          multiple
          :rules="[inputRequired]"
          :disable="fileDisable"
          :loading="fileLoading"
          v-model:model-value="files"
          accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
          :max-file-size="50 * 1024 * 1024"
          :max-files="30"
          max-file-size-label="50"
          @rejected="rejectedFiles"
        />
      </q-form>
    </div>
  </div>
  <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
    <q-btn
      class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]"
      no-caps
      style="border: 1px solid #2c3948"
      label="Cancelar"
      @click="emit('backView', false)"
    />
    <q-btn
      class="tw-w-1/4 tw-h-11 bg-primary text-white"
      type="submit"
      label="Guardar"
      @click="handleConfirmation"
    />
  </div>
</template>

<script lang="ts" setup>
import FileLoader from "src/components/FormFields/FileLoader.vue";
import { toast } from "src/helpers/toast";
import { ref, watch } from "vue";
import { inputRequired } from "src/helpers/validations";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";

const props = withDefaults(
  defineProps<{
    type: string;
    detailsRadicado: any;
  }>(),
  {}
);

const emit = defineEmits(["findDocs", "backView", "succesView", "updateFile"]);

const files = ref(null);
const fileLoading = ref(false);
const fileDisable = ref(false);
const confirmModal = ref(false);
const formFile = ref();
const auth = useAuthStore();

const userId = ref(auth.$state.userInfo.userid);

const handleConfirmation = async () => {
  const dataDetails = props.detailsRadicado;

  const formData = new FormData();
  // If you have files to upload, append them here
  if (files.value) {
    for (let i = 0; i < files.value.length; i++) {
      formData.append("files", files.value[i]);
    }
  }

  try {
    const response = await sgdeaAxios.post(
      `/administracion-tramite/adjuntarDocumentos/${dataDetails.entidadId}?flujo=${dataDetails.idFlujo}&user=${userId.value}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200) {
      toast.success("Adjunto exito");
      emit('succesView', false)
    }
  } catch (error) {
    toast.error("Por favor ingresa un documento Adjunto");
  } finally {
    confirmModal.value = false;
  }
};

watch(
  () => files.value,
  async (newValue) => {
    if (!newValue || newValue.length === 0) return;
    emit("updateFile", files.value);
  }
);

const rejectedFiles = (error) => {
  if (error.some((it) => it.failedPropValidation === "max-file-size")) {
    toast.error("El peso permitido es hasta 50MB.");
  }
  if (error.some((it) => it.failedPropValidation === "max-files")) {
    toast.error("Solo se pueden adjuntar 30 archivos.");
  }
  if (error.some((it) => it.failedPropValidation === "accept")) {
    toast.error(
      "Formato inválido, los formatos permitidos son (pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)."
    );
  }
};
</script>
