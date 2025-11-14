<script setup>
import { sgdeaAxios } from 'src/services';
import { ref, computed } from 'vue'
import * as XLSX from 'xlsx'

const selectedEmail = ref(null)
const showFileModal = ref(false);
const fileDataURL = ref("");
const selectedRows = ref([])
const rowsPerPage = ref(20);
const page = ref(1)

// Nuevas variables para el testigo HTML
const showWitnessHtmlModal = ref(false);
const witnessHtmlContent = ref("");
const currentWitnessEmail = ref(null);

let pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 20,
});

// Props
const props = defineProps({
  emails: {
    type: Array,
    default: () => []
  },
  TABLE_TOTAL_ROWS: {
    type: Number,
    default: 0
  }
})

// Emits
const emit = defineEmits(['open-attachments', 'open-digital-witness', 'view-testigo-pdf', 'handleRowsPerPageChange', 'handlePageChange'])

const eventStatusTranslations = {
  'Delivered to Mailbox': 'Entregado al buzón',
  'Delivered and Opened': 'Entregado y abierto',
  'Delivered to Mail Server': 'Entregado al servidor de correo',
  'Delivery Failed': 'Entrega fallida',
  'Delivered to Mail Server': 'Entregado al servidor de correo',
}

const getEventStatus = (row) => {
  const matchingStatus = [...row.statusHistory].reverse().find(
    status => row.forTo === status.recipientAddress
  );

  if (matchingStatus) {
    const originalStatus = matchingStatus.deliveryStatus;
    const translatedStatus = eventStatusTranslations[originalStatus] || originalStatus;
    matchingStatus.translatedDeliveryStatus = translatedStatus;
    return matchingStatus;
  }

  return { deliveryStatus: 'Sin eventos', translatedDeliveryStatus: 'Sin eventos' };
}

// Definición de columnas para q-table
const columns = [
  {
    name: 'select',
    required: true,
    label: '',
    align: 'center',
    field: 'selection',
    sortable: false
  },
  {
    name: 'addressee',
    required: true,
    label: 'Destinatario',
    align: 'center',
    field: row => row.addressee?.name || 'Sin destinatario',
    sortable: true,
  },
  {
    name: 'subject',
    required: true,
    label: 'Asunto',
    align: 'center',
    field: 'subject',
    sortable: true,
  },
  {
    name: 'eventos',
    required: true,
    label: 'Eventos',
    align: 'center',
    field: () => 'Evento Estático',
    sortable: true,
  },
  {
    name: 'date',
    required: true,
    label: 'Fecha',
    align: 'center',
    field: 'sentAt',
    format: (val) => formatDate(val),
    sortable: true,
  },
  {
    name: 'status',
    required: true,
    label: 'Estado',
    align: 'center',
    field: 'status',
    sortable: true,
  },
  {
    name: 'certificate',
    required: true,
    label: 'Tipo de Envío',
    align: 'center',
    field: 'isCertificate',
    sortable: true,
  },
  {
    name: 'process',
    required: true,
    label: 'Proceso',
    align: 'center',
    field: 'process',
    sortable: true,
  }
]

// New method for bulk digital witness download
const downloadBulkDigitalWitnesses = async () => {
  if (selectedRows.value.length === 0) {
    return
  }

  try {
    const witnessFiles = selectedRows.value.reduce((acc, row) => {
      const rowWitnessFiles = row.files
        .filter(file => file.witness && file.base64)
        .map(file => ({
          name: `${row.trackingId}_${file.name}`,
          base64: file.base64
        }));
      return [...acc, ...rowWitnessFiles];
    }, []);

    if (witnessFiles.length === 0) {
      return;
    }

    const JSZip = await import('jszip');
    const zip = new JSZip.default();

    witnessFiles.forEach(file => {
      const fileBuffer = Uint8Array.from(atob(file.base64), c => c.charCodeAt(0));
      zip.file(file.name, fileBuffer);
    });

    const zipContent = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(zipContent);
    link.setAttribute("download", `testigos_digitales_${new Date().toISOString().split('T')[0]}.zip`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    selectedRows.value = [];

  } catch (error) {
    console.error(error);
  }
}

// Method to toggle row selection
const toggleRowSelection = (row) => {
  const index = selectedRows.value.findIndex(selectedRow => selectedRow.id === row.id)
  if (index === -1) {
    selectedRows.value.push(row)
  } else {
    selectedRows.value.splice(index, 1)
  }
}

// Method to check if a row is selected
const isRowSelected = (row) => {
  return selectedRows.value.some(selectedRow => selectedRow.id === row.id)
}

// Métodos
const formatDate = (date) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
  const formattedDate = new Date(date).toLocaleString('es-ES', options);
  const [fecha, hora] = formattedDate.split(', ');
  const [day, month, year] = fecha.split('/');
  const newFormatDate = `${day}/${month}/${year}`;
  return `${newFormatDate} ${hora}`;
}

const getStatusClass = (status) => {
  const classes = {
    'Rechazado': 'bg-red',
    'Pendiente': 'bg-yellow',
    'Enviado': 'bg-green'
  }
  return classes[status] || 'bg-grey'
}

const selectEmail = (email) => {
  selectedEmail.value = email
}

const openDigitalWitnessModal = (email) => {
  emit('open-digital-witness', email)
}

const openAttachmentsModal = (email) => {
  emit('open-attachments', email)
}

const hostname = window.location.hostname;

let BASE_URL = 'https://gcpcentronotificaciones.positivasgdea.com';

if (hostname.includes('docu') || hostname.includes('frontend-beta')) {
  BASE_URL = 'https://ms-centronotificaciones-beta.proyectos-3t.tech';
}

const EMAIL_WITNESS_PATH = "/api/email/witness";

// Función para obtener el testigo digital desde el servicio
const fetchDigitalWitness = async (trackingId) => {
  try {
    const url = `${BASE_URL}${EMAIL_WITNESS_PATH}?trackingId=${trackingId}`;
    const response = await sgdeaAxios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el testigo digital:', error);
    throw error;
  }
};

// Método para visualizar el HTML, PDF o Imagen del testigo
async function viewTestigoPdf(email) {
  try {
    if (!email.trackingId) {
      console.error('El email no tiene trackingId');
      return;
    }

    // Obtener el testigo digital del servicio
    const witnessData = await fetchDigitalWitness(email.trackingId);

    // Verificar si es un array y tomar el primer elemento si es necesario
    const witness = Array.isArray(witnessData) ? witnessData[0] : witnessData;

    if (!witness) {
      console.error('No se encontró testigo digital');
      return;
    }

    // Determinar el tipo de contenido y manejar la visualización
    if (typeof witness === 'string' && (witness.startsWith('<!doctype html') || witness.startsWith('<html'))) {
      // Si el contenido es HTML, usar el modal de testigo digital
      witnessHtmlContent.value = witness;
      currentWitnessEmail.value = email;
      showWitnessHtmlModal.value = true;
    }
    else if (witness.base64) {
      // Si tiene base64, crear data URL
      const dataURL = `data:${witness.contentType};base64,${witness.base64}`;
      fileDataURL.value = dataURL;
      showFileModal.value = true;
    }
    else if (witness.content) {
      fileDataURL.value = witnessData.content;
      showFileModal.value = true;
    }
    else {
      console.error('El testigo no tiene contenido para visualizar');
    }

  } catch (error) {
    console.error('Error al visualizar el testigo:', error);
  }
}

function closeFileModal() {
  showFileModal.value = false;
  if (fileDataURL.value) {
    URL.revokeObjectURL(fileDataURL.value);
  }
  fileDataURL.value = '';
}

const handleDigitalWitnessFromDetail = async (email) => {
  try {
    if (!email.trackingId) {
      console.error('El email no tiene trackingId');
      return;
    }

    const witnessData = await fetchDigitalWitness(email.trackingId);
    // Asumimos que witnessData es HTML directamente

    witnessHtmlContent.value = witnessData.content
    currentWitnessEmail.value = email;
    showWitnessHtmlModal.value = true;

  } catch (error) {
    console.error('Error al procesar el testigo digital:', error);
  }
};

const downloadWitnessHtml = () => {
  if (!witnessHtmlContent.value || !currentWitnessEmail.value) {
    return;
  }

  const blob = new Blob([witnessHtmlContent.value], { type: 'text/html;charset=utf-8' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `testigo_digital_${currentWitnessEmail.value.trackingId || 'unknown'}.html`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

const closeWitnessHtmlModal = () => {
  showWitnessHtmlModal.value = false;
  witnessHtmlContent.value = '';
  currentWitnessEmail.value = null;
};

// Método para exportar el reporte
const exportReport = () => {
  if (selectedRows.value.length === 0) {
    return;
  }

  const getEventStatusForExport = (email) => {
    if (!email.statusHistory || !Array.isArray(email.statusHistory)) {
      return 'Sin eventos';
    }

    const matchingStatus = [...email.statusHistory].reverse().find(
      status => email.forTo === status.recipientAddress
    );

    if (matchingStatus) {
      const originalStatus = matchingStatus.deliveryStatus;
      return eventStatusTranslations[originalStatus] || originalStatus;
    }

    return 'Sin eventos';
  };

  const data = selectedRows.value.map(email => ({
    'Destinatario': email.addressee[0]?.email || 'Sin destinatario',
    'Asunto': email.subject || 'Sin asunto',
    'Fecha': formatDate(email.sentAt),
    'Estado': email.status || 'Estado desconocido',
    'Tipo De Envío': email.isCertificate ? "Certificado" : "No Certificado",
    'Proceso': email.process || 'Sin procesos',
    'Testigo': email.hasWitness ? "Sí" : "No",
    'Adjuntos': email.attachments && email.attachments > 0 ? "Sí" : "No",
    'Eventos': getEventStatusForExport(email)
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  const columnWidths = [
    { wch: 30 },
    { wch: 30 },
    { wch: 20 },
    { wch: 20 },
    { wch: 25 },
    { wch: 25 },
    { wch: 10 },
    { wch: 10 },
    { wch: 30 }
  ];

  ws['!cols'] = columnWidths;
  XLSX.utils.book_append_sheet(wb, ws, 'Reporte Emails');
  XLSX.writeFile(wb, `reporte_emails_seleccionados_${new Date().toISOString().split('T')[0]}.xlsx`);
}

const filteredEmails = computed(() => {
  return props.emails.content?.length > 0 ? props.emails.content : []
})

const allSelected = computed(() => {
  const selectableRows = filteredEmails.value.filter(row => row.hasWitness);
  return selectableRows.length > 0 && selectedRows.value.length === selectableRows.length;
});

const someSelected = computed(() => {
  return selectedRows.value.length > 0 && !allSelected.value;
});

const selectAll = (val) => {
  if (val) {
    selectedRows.value = filteredEmails.value.filter(row => row.hasWitness);
  } else {
    selectedRows.value = [];
  }
};

const handleRowsPerPageChange = (event) => {
  pagination.value.rowsPerPage = event
  if (pagination.value.page > 0) {
    pagination.value.page = pagination.value.page - 1
  }
  emit("handleRowsPerPageChange", pagination.value);
};

const handlePageChange = () => {
  emit("handlePageChange", { page: page.value, rowsPerPage: pagination.value.rowsPerPage });
};

</script>

<template>
  <div class="tw-flex tw-justify-between tw-items-center tw-p-4">
    <h2 class="tw-text-xl tw-font-bold tw-text-black">
      Listado de Notificaciones
    </h2>
    <div class="tw-flex tw-space-x-3">
      <q-btn color="primary" icon="download" label="Exportar Reporte" @click="exportReport"
        class="tw-mb-4 tw-w-44 tw-h-12" v-if="selectedRows.length > 0" />
      <q-btn v-if="selectedRows.length > 0" color="blue" icon="security" label="Descargar Testigos Masivos"
        @click="downloadBulkDigitalWitnesses" class="tw-mb-4 tw-w-60 tw-h-12" />
    </div>
  </div>

  <div class="tw-bg-white tw-shadow-sm tw-rounded-lg tw-overflow-visible">
    <!-- Botón para exportar reporte -->
    <div v-if="!selectedEmail">
      <q-table table-header-class="text-black text-h6 " class="q-mr-md full-width"
        no-data-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
        :rows="filteredEmails" :columns="columns" row-key="id" rows-per-page-label="Páginas" hide-pagination
        v-model:pagination="pagination" flat bordered>
        <!-- Slot para personalizar los encabezados de cada columna -->
        <template v-slot:header-cell="props">
          <q-th :props="props" class="tw-text-3xl tw-font-bold tw-text-black">
            {{ props.col.label }}
          </q-th>
        </template>

        <template v-slot:header-cell-select="props">
          <q-th :props="props">
            <q-checkbox :model-value="allSelected" :indeterminate="someSelected" @update:model-value="selectAll" />
          </q-th>
        </template>

        <!-- Body slot para los checkboxes individuales -->
        <template v-slot:body-cell-select="props">
          <q-td :props="props">
            <q-checkbox :model-value="isRowSelected(props.row)"
              @update:model-value="() => toggleRowSelection(props.row)" :disable="!props.row.hasWitness" />
          </q-td>
        </template>
        <!-- Personalización de las columnas -->
        <template v-slot:body-cell-addressee="props">
          <q-td :props="props">
            <div class="">
              <div class="tw-text-sm tw-font-medium tw-text-gray-900">
                {{ props.row.addressee ? props.row.addressee.name : 'Sin destinatario' }}
              </div>
              <div class="text-xs text-gray-500">
                {{ props.row.forTo }}
              </div>
              <div v-if="props.row.to?.length > 1" class="tw-text-sm tw-text-gray-500 tw-mt-1">
                +{{ props.row.to.length - 1 }} más
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-eventos="props">
          <q-td :props="props">
            <div class="tw-text-sm tw-text-gray-900 tw-font-medium">
              {{ getEventStatus(props.row).translatedDeliveryStatus }}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-subject="props">
          <q-td :props="props">
            <div class="tw-cursor-pointer tw-bg-white p-4 rounded-lg shadow-md" @click="selectEmail(props.row)">
              <q-tooltip class="tw-bg-white tw-border tw-border-gray-300">
                <div class="p-2 ">
                  <p class="tw-font-bold mb-1">{{ props.row.subject || 'Sin asunto' }}</p>
                  <p class="tw-text-gray-600 mb-1">De: {{ props.row.since || 'Desconocido' }}</p>
                  <p class="tw-text-gray-600 mb-1">Para: {{ props.row.forTo || 'Sin destinatario' }}</p>
                  <p class="tw-text-gray-600 mb-2">Fecha: {{ formatDate(props.row.sentAt) }}</p>
                  <p class="tw-text-gray-800">{{ props.row.body?.substring(0, 100) }}...</p>
                </div>
              </q-tooltip>
              <div class="tw-text-sm tw-text-gray-900 tw-font-medium">
                {{ props.row.subject || 'Sin asunto' }}
              </div>
              <div class="tw-mt-2 tw-space-x-2">
                <q-btn
                  v-if="props.row.attachments !== null && props.row.attachments > 0 && props.row.status === 'Enviado'"
                  flat dense color="orange-7" icon="attachment" label="Adjuntos"
                  @click.stop="openAttachmentsModal(props.row)" />
                <q-btn v-if="props.row.hasWitness != false" flat dense color="blue-7" icon="security" label="Testigo"
                  @click.stop="viewTestigoPdf(props.row)" />
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip :class="getStatusClass(props.row.status)" dense text-color="white">
              {{ props.row.status || 'Sin estado' }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-certificate="props">
          <q-td :props="props">
            <q-chip :color="props.row.isCertificate ? 'blue' : 'grey'" dense text-color="white" class="">
              {{ props.row.isCertificate ? "Certificado" : "No Certificado" }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-process="props">
          <q-td :props="props">
            <q-chip color="orange" dense text-color="white">
              {{ props.row?.process || 'Sin procesos' }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:no-data="{ message }">
          <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
            <img v-lazy :data-url="require('src/assets/filterImage.svg')" alt="" width="120" />
            <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
              {{ message }}
            </span>
          </div>
        </template>

        <template v-slot:bottom>
          <div class="row tw-justify-between q-mt-md tw-w-[100%]">
            <div class="tw-flex tw-gap-x-3 tw-items-center">
              <span>Filas</span>
              <q-select :options="[5, 25, 50, 100]" v-model:model-value="rowsPerPage" dense outlined
                @update:model-value="handleRowsPerPageChange" />
            </div>
            <q-pagination v-model="page" max-pages="15" ellipsis color="primary" :max="TABLE_TOTAL_ROWS" size="md"
              direction-links boundary-links boundary-numbers @update:model-value="handlePageChange" />
            <div class="invisible"></div>
          </div>
        </template>
      </q-table>
    </div>

    <!-- Vista detalle del email -->
    <div v-else class="tw-p-12">
      <q-btn flat color="orange" icon="chevron_left" label="Volver a la lista" @click="selectedEmail = null"
        class="tw-mb-10" />

      <h2 class="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-4">
        {{ selectedEmail.subject || 'Sin asunto' }}
      </h2>

      <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-4">
        <div>
          <p class="tw-text-sm tw-text-gray-600">
            <strong>De: </strong>{{ selectedEmail.since || 'Sin remitente' }}
          </p>
          <p class="tw-text-sm tw-text-gray-600">
            <strong>Para: </strong>{{ selectedEmail.forTo || 'Sin destinatario' }}
          </p>
          <p class="tw-text-sm tw-text-gray-600">
            <strong>Fecha: </strong>{{ formatDate(selectedEmail.sentAt) }}
          </p>
          <p class="tw-text-sm tw-text-gray-600">
            <strong>Proceso: </strong>{{ selectedEmail?.process || 'Sin proceso' }}
          </p>
          <p class="tw-text-sm tw-text-gray-600">
            <strong>Aplicación: </strong>{{ selectedEmail.nameApplication }}
          </p>
        </div>
        <div class="tw-text-right">
          <q-chip :class="getStatusClass(selectedEmail.status)" dense text-color="white">
            {{ selectedEmail.status || 'Estado desconocido' }}
          </q-chip>
          <q-chip :color="selectedEmail.isCertificate ? 'blue' : 'grey'" dense text-color="white"
            class="tw-ml-2 tw-px-3 tw-py-2">
            {{ selectedEmail.isCertificate ? "Certificado" : "No Certificado" }}
          </q-chip>
        </div>
      </div>

      <q-card class="tw-bg-grey tw-mb-4 no-shadow">
        <q-card-section class="tw-bg-gray-50 no-shadow">
          <div v-html="selectedEmail.body || 'Sin contenido'" class="tw-text-sm tw-text-gray-900"></div>
        </q-card-section>
      </q-card>

      <div class="tw-flex tw-justify-end tw-space-x-3">
        <q-btn v-if="selectedEmail.attachments && selectedEmail.attachments > 0 && selectedEmail.status === 'Enviado'"
          color="orange" icon="attachment" label="Ver adjuntos" class="tw-w-44 tw-h-12 tw-text-base"
          @click="openAttachmentsModal(selectedEmail)" />
        <q-btn v-if="selectedEmail.hasWitness != false" color="blue" icon="security" label="Testigos Digitales"
          class="tw-w-64 tw-h-12 tw-text-base" @click="openDigitalWitnessModal(selectedEmail)" />
        <q-btn v-if="selectedEmail.hasWitness === false && selectedEmail.isCertificate === true" color="blue"
          icon="security" label="Testigos Digitales" class="tw-w-64 tw-h-12 tw-text-base"
          @click="handleDigitalWitnessFromDetail(selectedEmail)" />
      </div>
    </div>

    <!-- Modal para visualizar PDF -->
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
          <div v-html="fileDataURL" v-if="fileDataURL"
            style="width: 100%; height: 800px; border: none; margin: auto; display: block;" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal para visualizar HTML del testigo digital -->
    <q-dialog v-model="showWitnessHtmlModal" maximized persistent>
      <q-card class="tw-w-full tw-h-full">
        <q-bar class="bg-blue text-white">
          <div>Testigo Digital - {{ currentWitnessEmail?.trackingId || 'Sin ID' }}</div>
          <q-space />
          <q-btn dense flat icon="download" @click="downloadWitnessHtml" class="q-mr-sm">
            <q-tooltip>Descargar HTML</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" @click="closeWitnessHtmlModal">
            <q-tooltip>Cerrar</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="q-pa-none tw-h-full">
          <div v-if="witnessHtmlContent" v-html="witnessHtmlContent"
            style="width: 100%; height: calc(100vh - 60px); overflow: auto; padding: 20px; background-color: #f5f5f5;"
            class="witness-html-container" />
          <div v-else class="tw-flex tw-justify-center tw-items-center tw-h-64">
            <q-spinner color="blue" size="40px" />
            <span class="tw-ml-2">Cargando testigo digital...</span>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<style>
.pdf-iframe {
  width: 80%;
  height: 80%;
  border: none;
  margin: auto;
  display: block;
}

.witness-html-container {
  /* Estilos para el contenedor del HTML del testigo */
  font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
  line-height: 1.4;
}
</style>
