<template>
  <q-dialog :model-value="modelValue" @update:model-value="val => emit('update:modelValue', val)" persistent>
    <q-card style="width: 700px; max-width: 90vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 tw-font-bold">Escanear o Adjuntar Documento</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="closeModal" />
      </q-card-section>

      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify">
        <q-tab name="scan" icon="scanner" label="Escanear Documento" />
        <q-tab name="upload" icon="upload_file" label="Adjuntar Archivo" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="scan" class="q-pa-md">
          <div class="tw-flex tw-gap-4">
            <q-btn @click="requestDevice" :disabled="!!device" color="primary" label="Conectar Escáner" />
            <q-btn @click="scan" :disabled="!device || scanning" color="secondary" label="Iniciar Escaneo">
              <q-spinner-dots v-if="scanning" class="q-ml-sm" />
            </q-btn>
          </div>

          <div v-if="imageUrl" class="tw-mt-4">
            <p class="tw-font-semibold">Resultado del Escaneo:</p>
            <img :src="imageUrl" alt="scan result" style="max-width:100%; border: 1px solid #ddd; border-radius: 4px;" />
            <div class="tw-mt-4">
              <q-btn
                label="Usar este documento"
                color="positive"
                icon="check_circle"
                @click="handleAcceptScan"
                :disable="!imageUrl"
              />
            </div>
          </div>
          <pre v-if="log" class="tw-mt-3 tw-bg-gray-100 tw-p-2 tw-rounded tw-text-xs tw-max-h-40 tw-overflow-auto">{{ log }}</pre>
        </q-tab-panel>

        <q-tab-panel name="upload" class="q-pa-md">
           <q-uploader
              @added="onFilesAdded"
              @removed="onFilesRemoved"
              label="Haga clic o arrastre los archivos aquí"
              multiple
              flat
              bordered
              class="tw-w-full"
            />
            <div class="row justify-end q-mt-md">
                <q-btn
                    label="Usar archivos adjuntos"
                    color="positive"
                    icon="check_circle"
                    :disable="uploadedFiles.length === 0"
                    @click="handleAcceptUpload"
                />
            </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { toast } from 'src/helpers/toast';

// --- Props y Emits para la comunicación con el componente padre ---
const props = defineProps<{
  modelValue: boolean;
}>();
const emit = defineEmits(['update:modelValue', 'files-ready']);
const $q = useQuasar();

// --- Lógica General del Modal ---
const tab = ref('scan');
const closeModal = () => emit('update:modelValue', false);

// --- Lógica para Pestaña de Uploader ---
const uploadedFiles = ref<File[]>([]);

const onFilesAdded = (addedFiles: File[]) => {
  uploadedFiles.value.push(...addedFiles);
};

const onFilesRemoved = (removedFiles: any[]) => {
  const removedKeys = removedFiles.map(f => f.__key);
  uploadedFiles.value = uploadedFiles.value.filter((f: any) => !removedKeys.includes(f.__key));
};

const handleAcceptUpload = () => {
    emit('files-ready', uploadedFiles.value);
    closeModal();
};


// --- Lógica para Pestaña de Escaneo (WebUSB) ---
const device = ref<USBDevice | null>(null);
const scanning = ref(false);
const imageUrl = ref<string | null>(null);
const log = ref('');

function appendLog(msg: string) {
  log.value += `> ${msg}\n`;
}

async function requestDevice() {
  try {
    appendLog('Solicitando dispositivo USB...');
    const usb = navigator.usb;
    if (!usb) throw new Error('WebUSB no está disponible en este navegador.');

    // !!! IMPORTANTE: DEBES CONFIGURAR ESTOS FILTROS !!!
    // Pide al fabricante el Vendor ID (vID) y Product ID (pID) de tu escáner.
     const filters = [
  { vendorId: 0x03f0, productId: 0x0781, name: 'HP LaserJet Enterprise MFP' },
  { vendorId: 0x03f0, productId: 0x0811, name: 'HP ScanJet Pro' },
  { vendorId: 0x03f0, productId: 0x4811, name: 'HP OfficeJet Pro' },
  { vendorId: 0x03f0, name: 'HP Scanner' }, // Filtro genérico HP
  // Agregado soporte para Kodak (basado en tu código actual)
  { vendorId: 0x29CC, productId: 0x1043, name: 'Kodak E1040' },
    ];

    const d = await usb.requestDevice({ filters });
    device.value = d;
    appendLog(`Conectado: ${d.productName} (vID: ${d.vendorId}, pID: ${d.productId})`);
  } catch (err: any) {
    appendLog('Error: ' + err.message);
    toast.error('No se pudo conectar al dispositivo.')
  }
}

async function scan() {
  if (!device.value) return;
  scanning.value = true;
  log.value = ''; // Limpiar log anterior
  imageUrl.value = null; // Limpiar imagen anterior
  appendLog('Iniciando escaneo...');

  try {
    const d = device.value;
    await d.open();
    if (d.configuration === null) await d.selectConfiguration(1);

    // !!! IMPORTANTE: AJUSTA ESTOS VALORES !!!
    // Estos números dependen 100% del protocolo de tu escáner.
    const ifaceNumber = 0;      // Número de la interfaz a reclamar.
    const inEndpointNumber = 1; // Endpoint de entrada (dispositivo -> PC).
    const outEndpointNumber = 2; // Endpoint de salida (si es necesario)
    await d.claimInterface(ifaceNumber);

    // --- Envío del comando para iniciar escaneo ---
    // Este es un ejemplo. El comando real (request, value, etc.)
    // debe estar en la documentación de tu escáner.
    await d.controlTransferOut({
      requestType: 'vendor',
      recipient: 'interface',
      request: 0x01, // Comando ficticio "iniciar escaneo".
      value: 0x0000,
      index: ifaceNumber
    });
    

    appendLog('Comando de inicio enviado, esperando datos...');

    // --- Lectura de datos del escáner ---
    const chunks: Uint8Array[] = [];
    let finished = false;
    while (!finished) {
      const res = await d.transferIn(inEndpointNumber, 64 * 1024); // Leer hasta 64KB
      if (res.status !== 'ok') {
        appendLog('Error en la transferencia: ' + res.status);
        break;
      }
      const view = res.data;
      if (!view || view.byteLength === 0) {
        finished = true; // El escáner terminó de enviar datos.
        break;
      }
      chunks.push(new Uint8Array(view.buffer));
      // La condición de finalización real depende del protocolo.
      // A menudo, se sabe que ha terminado si el paquete es más pequeño que el tamaño máximo.
      if (view.byteLength < (64 * 1024)) finished = true;
    }

    if (chunks.length === 0) {
        throw new Error('No se recibieron datos del escáner.');
    }

    // Unir todos los trozos de datos recibidos.
    const totalLen = chunks.reduce((s, c) => s + c.length, 0);
    const allData = new Uint8Array(totalLen);
    let offset = 0;
    for (const chunk of chunks) {
      allData.set(chunk, offset);
      offset += chunk.length;
    }

    // Convertir los datos a un objeto Blob para poder mostrarlo o usarlo.
    // El 'type' puede ser 'image/jpeg', 'image/png' o 'application/pdf' según lo que envíe tu escáner.
    const blob = new Blob([allData], { type: 'image/jpeg' });
    imageUrl.value = URL.createObjectURL(blob);
    appendLog('Escaneo completado con éxito.');

  } catch (err: any) {
    appendLog('Error durante el escaneo: ' + err.message);
     toast.error(`Error: ${err.message}`)
  } finally {
    scanning.value = false;
    if (device.value?.opened) {
      // Siempre intenta liberar la interfaz y cerrar el dispositivo.
      try {
        await device.value.releaseInterface(0); // Usa el mismo ifaceNumber
        await device.value.close();
        appendLog('Dispositivo liberado.');
      } catch (e: any) {
        appendLog('Error al liberar el dispositivo: ' + e.message);
      }
    }
  }
}

// Convierte la URL del Blob a un objeto File y lo emite
async function handleAcceptScan() {
    if (!imageUrl.value) return;
    const response = await fetch(imageUrl.value);
    const blob = await response.blob();
    const file = new File([blob], "escaneo.jpg", { type: blob.type });

    emit('files-ready', [file]);
    closeModal();
}
</script>

<style scoped>
/* Estilos opcionales para el log */
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
}
</style>