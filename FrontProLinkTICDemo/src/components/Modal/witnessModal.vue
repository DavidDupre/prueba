<template>
  <q-dialog v-model="props.show" persistent @show="onModalShow">
    <q-card class="full-width" style="max-width: 700px">
      <q-card-section class="row items-center">
        <div class="text-h6">Testigos Digitales</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="$emit('close')" />
      </q-card-section>

      <q-card-section class="q-pa-md">
        <!-- Loading state -->
        <div v-if="loading" class="text-center q-pa-lg">
          <q-spinner size="50px" color="primary" />
          <div class="q-mt-md">Cargando testigos...</div>
        </div>

        <!-- Content when loaded -->
        <div v-else>
          <q-list separator>
            <q-item v-for="(witness, index) in witnessesData" :key="index" class="q-py-md">
              <q-item-section avatar>
                <q-icon :name="getQuasarIcon(witness.contentType)" size="md" color="grey-6" />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ witness.fileName || witness.name || witness.filename || 'Archivo sin nombre' }}</q-item-label>
                <q-item-label caption>
                  {{ formatFileSize(witness.fileSize || witness.size) }}
                  <span class="q-ml-sm">{{ witness.contentType || witness.type || 'application/octet-stream' }}</span>
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn flat color="primary" label="Ver" @click="viewWitness(witness)" />
                <q-btn flat color="secondary" label="Descargar" @click="downloadWitness(witness)" />
              </q-item-section>
            </q-item>

            <q-item v-if="witnessesData && witnessesData.length === 0">
              <q-item-section>
                <q-item-label class="text-center text-grey">
                  No hay testigos disponibles
                </q-item-label>
              </q-item-section>
            </q-item>

            <!-- Error state -->
            <q-item v-if="error">
              <q-item-section>
                <q-item-label class="text-center text-negative">
                  Error al cargar los testigos: {{ error }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="bg-grey-2">
        <q-btn flat label="Cerrar" color="primary" v-close-popup @click="$emit('close')" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Modal para ver testigos - MUCHO MÁS ANCHO -->
  <q-dialog v-model="showWitnessModal" maximized persistent>
    <q-card class="tw-w-full tw-h-full">
      <q-bar class="bg-primary text-white">
        <div class="text-weight-bold">Vista Previa Testigo - {{ currentWitnessName }}</div>
        <q-space />
        <q-btn dense flat icon="close" @click="closeWitnessModal">
          <q-tooltip>Cerrar</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="q-pa-none tw-h-full">
        <iframe
          v-if="witnessDataURL"
          :src="witnessDataURL"
          class="tw-w-full tw-h-full"
          style="border: none;"
        />
        <div v-else class="text-center q-pa-lg">
          <q-icon name="error" size="xl" color="grey-6" />
          <div class="q-mt-md">No se puede visualizar el contenido</div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';
import { sgdeaAxios } from 'src/services';
import { useAuthStore } from 'src/stores/auth.store';
import { toast } from 'src/helpers/toast';
import axios from 'axios';

const token = useAuthStore();
const userToken = ref(token.$state.token);

const props = defineProps({
  show: Boolean,
  trackingId: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close']);

// Estados reactivos
const showWitnessModal = ref(false);
const witnessDataURL = ref("");
const currentWitnessName = ref("");
const witnessesData = ref([]);
const loading = ref(false);
const error = ref(null);

// Función para cargar los testigos desde la API
async function loadWitnesses() {
  if (!props.trackingId) {
    error.value = "No se proporcionó trackingId";
    return;
  }

  loading.value = true;
  error.value = null;
  witnessesData.value = [];

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    };

    const hostname = window.location.hostname;

    let BASE_URL = 'https://gcpcentronotificaciones.positivasgdea.com';

    if (hostname.includes('docu') || hostname.includes('frontend-beta')) {
      BASE_URL = 'https://ms-centronotificaciones-beta.proyectos-3t.tech';
    }

    const EMAIL_WITNESS_PATH = "/api/email/witness";

    const response = await axios.get(
      `${BASE_URL}${EMAIL_WITNESS_PATH}`,
      {
        ...config,
        params: {
          trackingId: props.trackingId,
        },
      }
    );

    // Manejar diferentes estructuras de respuesta
    if (Array.isArray(response.data)) {
      witnessesData.value = response.data;
    } else if (response.data && Array.isArray(response.data.witnesses)) {
      witnessesData.value = response.data.witnesses;
    } else if (response.data && Array.isArray(response.data.files)) {
      witnessesData.value = response.data.files;
    } else if (response.data && Array.isArray(response.data.data)) {
      witnessesData.value = response.data.data;
    } else {
      witnessesData.value = [response.data]; // Si es un objeto único
    }

  } catch (err) {
    console.error("Error loading witnesses:", err);
    error.value = err.response?.data?.message || err.message || "Error al cargar los testigos";
    toast.error("Error al cargar los testigos digitales");
  } finally {
    loading.value = false;
  }
}

// Función que se ejecuta cuando el modal se muestra
function onModalShow() {
  loadWitnesses();
}

// Limpiar datos cuando se cierre el modal
watch(() => props.show, (newVal) => {
  if (!newVal) {
    witnessesData.value = [];
    error.value = null;
    loading.value = false;
  }
});

function formatFileSize(bytes) {
  if (!bytes || bytes === 0 || isNaN(bytes)) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getQuasarIcon(fileType) {
  if (!fileType) return 'insert_drive_file';

  const type = fileType.toLowerCase();
  if (type.includes('html') || type.includes('htm')) {
    return 'html';
  } else if (type.includes('pdf')) {
    return 'picture_as_pdf';
  } else if (type.includes('word') || type.includes('doc')) {
    return 'description';
  } else if (type.includes('excel') || type.includes('xls') || type.includes('sheet')) {
    return 'table_chart';
  } else if (type.includes('image')) {
    return 'image';
  } else if (type.includes('text') || type.includes('txt')) {
    return 'text_fields';
  }
  return 'insert_drive_file';
}

function viewWitness(witness) {
  if (!witness) {
    toast.warning('Testigo no disponible');
    return;
  }

  try {
    currentWitnessName.value = witness.fileName || witness.name || witness.filename || 'Testigo';

    // Si tiene contenido directo (HTML como string)
    if (witness.content) {
      const blob = new Blob([witness.content], { type: 'text/html' });
      witnessDataURL.value = URL.createObjectURL(blob);
    }
    // Si tiene base64
    else if (witness.base64) {
      witnessDataURL.value = `data:${witness.contentType || 'text/html'};base64,${witness.base64}`;
    }
    // Si tiene data URL directa
    else if (witness.dataUrl) {
      witnessDataURL.value = witness.dataUrl;
    }
    else {
      toast.warning('El testigo no tiene contenido para visualizar');
      return;
    }

    showWitnessModal.value = true;
  } catch (error) {
    console.error('Error al mostrar el testigo:', error);
    toast.error('Error al mostrar el testigo');
  }
}

function closeWitnessModal() {
  showWitnessModal.value = false;

  // Liberar la URL del objeto para evitar fugas de memoria
  if (witnessDataURL.value) {
    URL.revokeObjectURL(witnessDataURL.value);
  }

  witnessDataURL.value = '';
  currentWitnessName.value = '';
}

async function downloadWitness(witness) {
  try {
    if (!witness) {
      toast.warning('Testigo no disponible para descargar');
      return;
    }

    let blob;
    let fileName = witness.fileName || witness.name || witness.filename || `testigo_${props.trackingId}`;

    // Si tiene contenido directo
    if (witness.content) {
      blob = new Blob([witness.content], { type: witness.contentType || 'text/html' });
    }
    // Si tiene base64
    else if (witness.base64) {
      const byteCharacters = atob(witness.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      blob = new Blob([byteArray], { type: witness.contentType || 'application/octet-stream' });
    }
    else {
      toast.warning('El testigo no tiene contenido para descargar');
      return;
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Descarga iniciada correctamente');

  } catch (error) {
    console.error('Error al descargar el testigo:', error);
    toast.error('Error al descargar el archivo');
  }
}

async function downloadDigitalWitness(trackingId) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
      responseType: 'arraybuffer'
    };

    const response = await sgdeaAxios.get(`https://gcpcentronotificaciones.positivasgdea.com/api/email/receipt`, {
      params: { trackingId, download: true },
      ...config
    }
    )

    const contentType = response.headers['content-type'] || 'application/zip';
    const blob = new Blob([response.data], { type: contentType });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${trackingId}.zip`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Descarga de todos los testigos iniciada');
  } catch (error) {
    console.error(error);
    toast.error('Error al descargar el archivo');
  }
}
</script>

<style>
.witness-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* Asegurar que el modal ocupe toda la pantalla */
.q-dialog__inner--maximized {
  padding: 0;
}

.q-card__section--maximized {
  padding: 0;
}
</style>
