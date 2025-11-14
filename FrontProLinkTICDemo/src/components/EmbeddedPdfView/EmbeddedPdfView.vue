<template>
  <div class="pdf-container">
    <PDFViewer
      ref="pdfViewer"
      :source="localPdfUrl"
      :controls="['zoom', 'switchPage']"
      :settings="{ defaultZoom: 175 }"
      class="pdf-viewer"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import PDFViewer from "pdf-viewer-vue";

// Props desde el padre
const props = defineProps({
  pdfUrl: { type: String, required: true },
  styleClass: { type: String, required: false },
});

// Estado local para la URL del PDF
const localPdfUrl = ref(props.pdfUrl);

watch(
  () => props.pdfUrl,
  (newVal) => {
    localPdfUrl.value = newVal;
  }
);

onMounted(() => {
  // setTimeout(() => {
  //   const pdfViewer = document.querySelector(".pdf-viewer");
  //   if (pdfViewer) {
  //     pdfViewer.style.height = "100vh"; // Ocupar toda la pantalla
  //     pdfViewer.style.width = "100%"; // Ocupar todo el ancho
  //   }
  // }, 500);
});
</script>

<style scoped>
.pdf-container {
  width: 100vw;
  height: 100vh; /* Asegura que ocupe toda la pantalla */
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f4f4;
  overflow: hidden;
}

.pdf-viewer {
  width: 100%;
  height: 100vh; /* Hace que ocupe todo el alto de la pantalla */
  object-fit: contain; /* Evita recortes y ajusta la vista */
}
</style>
