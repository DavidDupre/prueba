<template>
  <q-dialog v-model="localTrazaModal" fullwidth>
    <q-card class="q-pa-none" style="width: 90vw; height: 90vh;">
      <div class="q-pa-sm q-gutter-none" style="display: flex; justify-content: flex-end;">
        <a @click="closeDialog" class="tw-text-primary tw-cursor-pointer" style="text-decoration: none">
          <q-icon size="1.5em" name="close" color="primary" />
        </a>
      </div>

      <q-card-section class="q-pa-none" style="height: calc(100% - 48px); width: 100%;">
        <PDFViewer
          ref="pdfViewer"
          :source="localPdfUrl"
          style="width: 100%; height: 100%;"
          :controls="['zoom', 'switchPage']"
          :settings="{
            defaultZoom:175
          }"
          class="pdf-viewer"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import PDFViewer from 'pdf-viewer-vue';

// Define props to receive from the parent component
const props = defineProps({
  showDialog: {
    type: Boolean,
    required: true,
  },
  pdfUrl: {
    type: String,
    required: true,
  },
  isPdf:{
    type: Boolean,
    requiered: false,
  }
},{
  isPdf:false,
});

// Local state for the dialog and PDF URL
const localTrazaModal = ref(props.showDialog);
const localPdfUrl = ref(props.pdfUrl);

// Zoom level you want to set by default
const zoomLevel = 170;

const emit = defineEmits(['update:showDialog']);

// Watch for changes in props and update local state
watch(() => props.showDialog, (newVal) => {
  localTrazaModal.value = newVal;
});

watch(() => props.pdfUrl, (newVal) => {
  localPdfUrl.value = newVal;
  if (newVal) {
    localTrazaModal.value = true;
  }
});

// Emit the dialog state when it changes
watch(localTrazaModal, (value) => {
  emit('update:showDialog', value);
});

// Function to close the dialog
const closeDialog = () => {
  localTrazaModal.value = false;
};

// Handle zoom adjustment after the component mounts
onMounted(() => {
  setTimeout(() => {
    const pdfViewer = document.querySelector('.pdf-viewer');
    if (pdfViewer) {
      // Use the zoom input if available
      const zoomInput = pdfViewer.querySelector('input[type="range"]'); // Adjust selector if necessary
      if (zoomInput) {
        zoomInput.value = zoomLevel;
        zoomInput.dispatchEvent(new Event('input')); // Trigger input event to apply zoom
      }
    }
  }, 1000); // Ensure the PDF is loaded
});
</script>

<style scoped>
/* Add any specific styles for your component here */
.pdf-viewer {
  /* Adjust the class name if necessary */
}
</style>
