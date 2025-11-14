<template>
  <q-card class="tw-w-[700px] tw-px-10 tw-py-8 tw-rounded-2xl tw-shadow-lg">
    <!-- Header -->
    <q-card-section class="text-h5 text-weight-bold tw-text-center tw-border-b tw-border-gray-200 tw-pb-4">
      Selecciona la ubicación de la firma en el documento
    </q-card-section>

    <!-- Contenido -->
    <q-card-section>
      <!-- Opciones -->
      <div class="tw-grid tw-grid-cols-4 tw-gap-4 tw-mt-6">
        <q-btn
          :class="{ 'selected-button': selectedOption === 'superior' }"
          :outline="selectedOption !== 'superior'"
          class="tw-w-full tw-h-32"
          color="secondary"
          size="md"
          @click="handleOption('superior')"
        >
          <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-2">
            <img :src="Recurso1" alt="" class="tw-w-12 tw-h-12"/>
            <span class="tw-text-sm tw-font-medium">Superior</span>
          </div>
        </q-btn>
        <q-btn
          :class="{ 'selected-button': selectedOption === 'mid' }"
          :outline="selectedOption !== 'mid'"
          class="tw-w-full tw-h-32"
          color="secondary"
          size="md"
          @click="handleOption('mid')"
        >
          <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-2">
            <img :src="mitad" alt="" class="tw-w-12 tw-h-12"/>
            <span class="tw-text-sm tw-font-medium">Mitad</span>
          </div>
        </q-btn>
        <q-btn
          :class="{ 'selected-button': selectedOption === 'footer' }"
          :outline="selectedOption !== 'footer'"
          class="tw-w-full tw-h-32"
          color="secondary"
          size="md"
          @click="handleOption('footer')"
        >
          <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-2">
            <img :src="fina" alt="" class="tw-w-12 tw-h-12"/>
            <span class="tw-text-sm tw-font-medium">Inferior</span>
          </div>
        </q-btn>
        <q-btn
          :class="{ 'selected-button': selectedOption === 'new-page' }"
          :outline="selectedOption !== 'new-page'"
          class="tw-w-full tw-h-32"
          color="secondary"
          size="md"
          @click="handleOption('new-page')"
        >
          <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-2">
            <img :src="nuevahoja" alt="" class="tw-w-12 tw-h-12"/>
            <span class="tw-text-sm tw-font-medium">Nueva página</span>
          </div>
        </q-btn>
      </div>
    </q-card-section>

    <!-- Footer -->
    <q-card-actions align="center" class="tw-mt-6 tw-border-t tw-border-gray-200 tw-pt-4">
      <q-btn
        class="tw-h-12 tw-text-lg tw-font-semibold tw-w-[45%]"
        color="secondary"
        flat
        label="Cerrar"
        @click="$emit('close')"
      />
      <q-btn
        class="tw-h-12 tw-text-lg tw-font-semibold tw-w-[50%] bg-secondary"
        color="white"
        flat
        label="Elegir firma"
        @click="firmar"
      />
    </q-card-actions>
  </q-card>
  <q-inner-loading :showing="isLoading" label-class="text-teal" label-style="font-size: 1.1em"/>
</template>

<script lang="ts" setup>
import {defineEmits, ref, watch} from "vue";
import Recurso1 from 'src/assets/Recurso1.svg'
import mitad from 'src/assets/mitad.svg'
import fina from 'src/assets/final.svg'
import nuevahoja from 'src/assets/nueva-hoja.svg'
import {sgdeaAxios} from "src/services";
import {toast} from "src/helpers/toast";

const props = defineProps<{
  data: any,
  data_footer: any,
  referentKey: {
    require: true,
    type: Object,
  }
}>()
const ubicacion = ref()
const isLoading = ref(false)
const selectedOption = ref('')
const emit = defineEmits(['close', "aprobate"])
const selectedSignature = ref();

function getFirma() {
  let referentKey = {...props.referentKey};
  let isImage = referentKey?.Firma && referentKey?.Firma?.length > 50;
  let footer = props.data_footer;

  let html = `
      <p style="text-align: left; font-size: 8px !important; font-famileditor-eventy: Arial, sans-serif !important; font-family: Arial, sans-serif !important; margin: 25px 0;">
        Cordialmente,
      </p>
      ${
    isImage && referentKey?.Firma
      ? `<div style="display: flex; justify-content: start; width: 100%;">
             <img style="aspect-ratio:1365/765;" alt="firma aprobador" align="center" src="data:image/png;base64,${referentKey?.Firma}" width="150" height="50"/>
           </div>`
      : `<p style="font-size: 25px !important; font-family: Arial, sans-serif !important; font-famileditor-eventy: Arial, sans-serif !important; margin: 0;">${
        referentKey?.Firma || "&nbsp;"
      }</p>`
  }
      <div style="text-align: left; font-size: 8px !important; font-family: Arial, sans-serif !important; font-famileditor-eventy: Arial, sans-serif !important; margin-bottom: 12px; font-weight: 600;">
        ${
    referentKey?.NombreAprobador
      ? `<p style="margin:2px 0;">${referentKey?.NombreAprobador}</p>`
      : ""
  }
        <p style="margin: 0;">${referentKey?.CargoAprobador || "&nbsp;"}</p>
        <p style="margin: 0;">${
    referentKey?.DependenciaAprobador || "&nbsp;"
  }</p>
        <br>
      </div>
      <footer style="text-align: left; font-size: 2px !important; font-famileditor-eventy: Arial, sans-serif !important; ">
        <p style="margin: 0;">Anexo: ${footer.Anexo || "0"}</p>
        ${
    Array.isArray(footer.Copia)
      ? footer.Copia.map((copia: string, index: number) =>
        formatCopia(copia, index)
      ).join("")
      : `<p style="margin: 0;">Copia: ${footer.Copia || "0"}</p>`
  }
        <p style="margin: 0;">Elaboró: ${footer.DatosGestionador || ""}</p>
        <p style="margin: 0;">Revisó: ${footer.DatosRevisor || ""}</p>
        <p style="margin: 0;">Aprobador: ${footer.DatosAprobador || ""}</p>
        <p style="margin: 0;">Forma de envío: ${footer.FormadeEnvio || ""}</p>
      </footer>`;
  return html.replace(/\n|\r|\s{2,}/g, '');
}

const formatCopia = (copia: string, index: number) => {
  return `<p style="margin: 0;">Copia ${String(index + 1)}: ${copia}</p>`;
};

function convertToBlob(base64) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], {type: "application/pdf"});
}

async function firmar() {
  try {
    isLoading.value = true
    let body = {
      pdfBase64: props.data,
      ubicacion: ubicacion.value,
      textoExtra: getFirma()
    }
    let result = await sgdeaAxios.post("/pdf/agregarfirma", body)
    isLoading.value = false
    if (result.status === 200 || result.status === 201) {
      emit("aprobate", convertToBlob(result.data))
    } else {
      toast.error("No se pudo firmar el documento.");
    }
    closeModal()
  } catch (error) {
    toast.error("No se pudo firmar el documento.");
    closeModal()
  }
}

function closeModal() {
  isLoading.value = false
  emit('close')
}

const handleOption = (option: string) => {
  selectedOption.value = option
  switch (option) {
    case 'superior':
      ubicacion.value = "700"
      break
    case 'mid':
      ubicacion.value = "500"
      break
    case 'footer':
      ubicacion.value = "300"
      break
    case 'new-page':
      ubicacion.value = "50"
      break
  }
}
</script>

<style scoped>
.selected-button {
  background-color: #5d849c !important;
  color: white !important;
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.selected-button:hover {
  transform: scale(1.03);
}

.q-btn {
  transition: all 0.2s ease;
}
</style>
