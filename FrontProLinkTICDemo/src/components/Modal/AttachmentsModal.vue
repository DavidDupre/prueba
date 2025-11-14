<template>
  <q-dialog v-model="props.show" persistent>
    <q-card class="full-width" style="max-width: 700px">
      <q-card-section class="row items-center">
        <div class="text-h6">Adjuntos</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="$emit('close')" />
      </q-card-section>

      <q-card-section class="q-pa-md">
        <div class="tw-text-black q-mb-md">
          Total archivos: {{ filteredAttachments?.length || 0 }}
        </div>

        <q-list separator>
          <q-item v-for="attachment in filteredAttachments" :key="attachment.id" class="q-py-md">
            <q-item-section avatar>
              <q-icon :name="getQuasarIcon(attachment.contentType)" size="md" color="grey-6" />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ attachment.nameFile }}</q-item-label>
              <q-item-label caption>
                {{ formatFileSize(attachment.fileSize) }}
                <span class="q-ml-sm">{{ attachment.contentType }}</span>
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn flat color="primary" label="Ver" @click="viewFile(attachment)"
                :disable="!isSupportedFile(attachment)" />
              <q-btn flat color="secondary" label="Descargar" @click="downloadFile(attachment)"
                :disable="!attachment.base64" />
            </q-item-section>
          </q-item>

          <q-item v-if="filteredAttachments.length === 0">
            <q-item-section>
              <q-item-label class="text-center text-grey">
                No hay archivos adjuntos disponibles
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right" class="bg-grey-2">
        <q-btn flat label="Cerrar" color="primary" v-close-popup @click="$emit('close')" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Modal para ver archivos -->
  <q-dialog v-model="showFileModal" max-width="1600px" persistent>
    <q-card class="tw-w-full">
      <q-bar class="bg-primary text-white">
        <div>Vista Previa Archivo</div>
        <q-space />
        <q-btn dense flat icon="close" @click="closeFileModal">
          <q-tooltip>Cerrar</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="q-pa-none">
        <iframe v-if="fileDataURL && isPDFFile(currentFile)" :src="fileDataURL"
          style="width: 100%; height: 800px; border: none; margin: auto; display: block;" />
        <div v-else-if="fileDataURL && (isDOCXFile(currentFile) || isXLSFile(currentFile))">
          <iframe :src="fileDataURL" style="width: 100%; height: 800px; border: none; margin: auto; display: block;" />
          <p>Para ver DOCX y XLS, se recomienda usar un visor en línea.</p>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, watch } from 'vue';
import { toast } from 'src/helpers/toast';

const props = defineProps({
  show: Boolean,
  attachments: {
    type: Array,
    default: () => []
  }
});
const emit = defineEmits(['close', 'update:show']);

// Estados reactivos
const showFileModal = ref(false);
const fileDataURL = ref("");
let currentFile = null;

// Computed
const filteredAttachments = computed(() => {
  return (
    props.attachments
      ?.filter(file => file && file.witness === false)
      .sort((a, b) => {
        const containsSAL_A = a.nameFile.toUpperCase().includes("SAL") ? 1 : 0;
        const containsSAL_B = b.nameFile.toUpperCase().includes("SAL") ? 1 : 0;
        return containsSAL_B - containsSAL_A;
      }) || []
  );
});

// Watch para debug
watch(() => props.attachments, (newVal) => {

}, { deep: true });

// Métodos de utilidad
function isSupportedFile(attachment) {
  return isPDFFile(attachment) || isDOCXFile(attachment) || isXLSFile(attachment);
}

function isPDFFile(attachment) {
  return attachment?.contentType?.toLowerCase().includes('pdf');
}

function isDOCXFile(attachment) {
  return attachment?.contentType?.toLowerCase().includes('vnd.openxmlformats-officedocument.wordprocessingml.document');
}

function isXLSFile(attachment) {
  return attachment?.contentType?.toLowerCase().includes('vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}

function getQuasarIcon(fileType) {
  if (!fileType) return 'insert_drive_file';

  const type = fileType.toLowerCase();
  if (isPDFFile({ contentType: fileType })) {
    return 'picture_as_pdf';
  } else if (isDOCXFile({ contentType: fileType })) {
    return 'description'; // Icono para DOCX
  } else if (isXLSFile({ contentType: fileType })) {
    return 'table_chart'; // Icono para XLS
  } else if (type.includes('image')) {
    return 'image';
  }
  return 'insert_drive_file';
}

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function viewFile(attachment) {
  currentFile = attachment;
  if (!attachment?.base64) {
    toast.warning('El archivo no está disponible para previsualización');
    return;
  }

  try {
    fileDataURL.value = `data:${attachment.contentType};base64,${attachment.base64}`;
    showFileModal.value = true;
  } catch (error) {
    toast.error('Error al mostrar el archivo');
  }
}

function closeFileModal() {
  showFileModal.value = false;
  fileDataURL.value = '';
}

function downloadFile(attachment) {
  if (!attachment?.base64) {
    toast.warning('El archivo no está disponible para descargar');
    return;
  }

  const link = document.createElement('a');
  link.href = `data:${attachment.contentType};base64,${attachment.base64}`;
  link.download = attachment.nameFile || 'archivo';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<style>
.pdf-iframe {
  width: 80%;
  /* Cambia este valor según sea necesario */
  height: 80%;
  /* Cambia este valor según sea necesario */
  border: none;
  margin: auto;
  /* Centra el iframe */
  display: block;
  /* Asegura que el iframe sea un bloque para centrarlo */
}
</style>
