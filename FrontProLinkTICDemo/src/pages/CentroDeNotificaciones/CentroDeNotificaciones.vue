<template>
  <div class="q-pa-md">
    <!-- Encabezado -->
    <div class="row items-center justify-between q-mb-md">
      <div class="row items-center">
        <!-- <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logotipo%20HeaderSVG-wjBVsbj9ukxNlzFDtHBRILRrAZ8QwG.png"
          alt="Positiva Logo" class="q-mr-md" style="height: 63px; width: auto;" /> -->
        <h1 class="tw-text-3xl tw-font-bold">
          Centro de Notificaciones
        </h1>
      </div>
    </div>

    <q-btn-group outline rounded class="q-mb-md tw-space-x-5">
      <q-btn v-for="view in ['all', 'certified', 'notCertified']" :key="view" :label="viewLabels[view]"
        @click="changeView(view)" :color="currentView === view ? 'orange' : 'grey-7'" />
    </q-btn-group>

    <!-- Búsqueda y Filtros -->
    <q-card class="tw-bg-white tw-shadow-sm tw-rounded-lg tw-p-6 tw-mb-8 ">
      <!-- Búsqueda global y búsqueda avanzada -->
      <div class="tw-flex tw-flex-wrap tw-items-center tw-gap-4 tw-mb-4">
        <div class="tw-w-[80%]">
          <span class="tw-text-gray-600 tw-text-sm">
            ({{ filters.subject.length }} / 100)
          </span>
        </div>
        <q-input filled v-model="filters.subject" @input="filterEmails" :rules="[v => maxLengthInput(100, v)]"
          label="Buscar por asunto" placeholder="Buscar por asunto" class="tw-flex-grow q-mr-sm  tw-w-[80%]">
          <template v-slot:prepend>
            <q-icon name="search" class="tw-text-gray-400" />
          </template>
        </q-input>
        <q-btn @click="handleOpenModalSearch" label="Búsqueda avanzada" color="primary" outline
          class="tw-w-48 tw-h-12 tw-text-base tw-self-start" />
      </div>

      <!-- Filtros adicionales -->
      <div class="flex flex-wrap items-center tw-gap-7 tw-mt-4 tw-ml-3">
        <div class="relative" ref="datePickerContainer">
          <label for="date-range" class="block text-sm font-medium text-gray-700">Rango de fechas</label>
          <button @click="toggleDatePicker" type="button"
            class="relative tw-w-full tw-bg-white tw-border tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-pl-3 tw-pr-10 tw-py-2 tw-text-left tw-focus:outline-none tw-focus:ring-1 tw-focus:ring-orange-500 tw-focus:border-orange-500 tw-sm:text-sm">
            <span class="block truncate">
              {{ formatDateRange(filters.startDate, filters.endDate) }}
            </span>
            <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <q-icon name="chevron_down" class="h-5 w-5 text-gray-400" />
            </span>
          </button>
          <!-- Date picker dropdown -->
          <div v-if="showDatePicker"
            class="origin-top-right absolute tw-mt-2 tw-w-64 tw-p-4 tw-rounded-md tw-shadow-lg tw-bg-white tw-z-[100] tw-hover:z-[150]">
            <!-- Opciones de rango de fecha -->
            <div class="tw-py-1">
              <a v-for="range in ['last7', 'last30', 'thisMonth', 'lastMonth']" :key="range"
                @click="setDateRange(range)"
                class="tw-block tw-px-4 tw-py-2 tw-text-sm tw-text-gray-700 tw-hover:tw-bg-gray-100 tw-cursor-pointer">
                {{ dateRangeLabels[range] }}
              </a>
            </div>

            <div class="py-1">
              <a @click="showCustomDatePicker = true"
                class="tw-block tw-px-4 tw-py-2 tw-text-sm tw-text-gray-700 hover:tw-bg-gray-100 tw-cursor-pointer">Personalizado</a>
            </div>
          </div>
          <!-- Date picker personalizado -->
          <div v-if="showCustomDatePicker"
            class="tw-origin-top-right tw-absolute tw-right-0 tw-mt-2 tw-p-4 tw-w-64 tw-rounded-md tw-shadow-lg tw-bg-white tw-z-10">
            <div class="tw-mb-4">
              <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700">Fecha inicial</label>
              <input id="start-date" type="date" v-model="filters.startDate"
                class="tw-mt-1 tw-block tw-w-full tw-pl-3 tw-pr-10 tw-py-2 tw-text-base tw-border-gray-300 tw-focus:outline-none tw-focus:ring-orange-500 tw-focus:border-orange-500 tw-sm:text-sm tw-rounded-md">
              <!--  <q-date v-model="filters.startDate" mask="YYYY-MM-DD" class="q-mb-md" /> -->
            </div>
            <div class="tw-mb-4">
              <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700">Fecha final</label>
              <!--  <q-date v-model="filters.endDate" mask="YYYY-MM-DD" /> -->
              <input id="end-date" type="date" v-model="filters.endDate" :min="filters.startDate"
                :disabled="!filters.startDate"
                class="tw-mt-1 tw-block tw-w-full tw-pl-3 tw-pr-10 tw-py-2 tw-text-base tw-border-gray-300 tw-focus:outline-none tw-focus:ring-orange-500 tw-focus:border-orange-500 tw-sm:text-sm tw-rounded-md">
            </div>
            <button @click="applyCustomDateRange"
              class="tw-bg-orange-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-text-sm tw-hover:bg-orange-600">
              Aplicar
            </button>
          </div>
        </div>

<!--        <q-select v-model="filters.process" @change="handleProcessChange" :options="processes" label="Proceso"-->
<!--          class="mt-1 tw-w-44" />-->
        <q-select v-model="filters.status" @change="handleStatusChange" :options="statuses" label="Estado"
          class="mt-1 tw-w-44" />
        <q-input v-model="filters.nroDocument" @input="handleDocumentChange" label="Número de Documento" placeholder=""
          :rules="[v => maxLengthInput(15, v), onlyNumbers]" class="tw-w-70 tw-h-12 tw-text-base" />
        <q-btn @click="handleSearch" label="Buscar" color="primary" outline class="tw-w-32 tw-h-12 tw-text-base" />
        <q-btn @click="handleClearFilter" label="Limpiar Filtros" color="secondary" outline
          class="tw-w-32 tw-h-12 tw-text-base" />
      </div>
    </q-card>
  </div>

  <!-- Tabla de Correos / Detalles del Correo -->
  <EmailTable :emails="filteredEmails" @open-attachments="openAttachmentsModal" @view-testigo-pdf="viewTestigoPdf"
    @open-digital-witness="openAWitnessModal" :TABLE_TOTAL_ROWS="dataTableTotalRows"
    @handlePageChange="handlePageChange" @handleRowsPerPageChange="handleRowsPerPageChange" />

  <!-- Modal de Adjuntos -->
  <AttachmentsModal :show="showAttachmentsModal" :attachments="currentAttachments" @close="closeAttachmentsModal" />

  <!-- Modal de Testigos Digitales - Ahora usa trackingId en lugar de witnesses -->
  <WitnessModal :show="showWitnessModal" :trackingId="selectedEmailTrackingId" @close="closeWitnessModal" />

  <q-dialog v-model="showAdvancedSearch">
    <q-card style="max-width: 600px; width: 100%;">
      <q-card-section>
        <div class="text-h6">Búsqueda Avanzada</div>
        <q-form @submit.prevent="applyAdvancedSearch">
          <div class="q-mt-md">
            <q-input filled v-model="advancedFilters.from" :rules="[v => maxLengthInput(100, v), validationEmail]"
              label="De" />
          </div>
          <div class="q-mt-md">
            <q-input filled v-model="advancedFilters.to" label="Para"
              :rules="[v => maxLengthInput(100, v), validationEmail]" />
          </div>
          <div class="q-mt-md">
            <q-input filled v-model="advancedFilters.subject" label="Asunto" :rules="[v => maxLengthInput(100, v)]" />
          </div>
          <div class="q-mt-md">
            <q-input filled v-model="advancedFilters.contains" label="Contiene las palabras"
              :rules="[v => maxLengthInput(100, v)]" />
          </div>
          <div class="q-mt-md">
            <q-checkbox v-model="advancedFilters.hasAttachments" label="Contiene archivos adjuntos" />
          </div>
        </q-form>
      </q-card-section>
      <q-card-actions>
        <q-btn label="Buscar" @click="applyAdvancedSearch" color="primary" outline
          class="tw-w-32 tw-h-12 tw-text-base" />
        <q-btn label="Cancelar" @click="handleCloseModalSearch" color="secondary" outline
          class="tw-w-32 tw-h-12 tw-text-base" />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>


<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { sgdeaAxios } from "src/services";
import EmailTable from "src/components/Tables/EmailTable.vue";
import AttachmentsModal from "src/components/Modal/AttachmentsModal.vue";
import WitnessModal from "src/components/Modal/witnessModal.vue";
import moment from "moment";
import { toast } from "src/helpers/toast";
import { useAuthStore } from "src/stores/auth.store";
import { maxLengthInput, onlyNumbers, validationEmail } from "src/helpers/validations";

// Constants
const processes = [
  "Sin procesos",
  "Renovación",
  "Legal",
  "Cobranza",
  "Siniestros",
  "Atención al Cliente",
  "Notificación de mail",
  "Histórico sealmail",
  "Comunicacion Masiva",
  "ENVIO_EMAIL",
  "ML"
];
const statuses = ["Enviado", "Rechazado"];

const viewLabels = {
  all: "Todos los correos",
  certified: "Correos Certificados",
  notCertified: "Correos No Certificados",
};

const dateRangeLabels = {
  last7: "7 días hábiles",
  last30: "30 días hábiles",
  thisMonth: "Este mes",
  lastMonth: "Mes pasado",
};

// State
const filters = ref({
  globalSearch: "",
  startDate: "",
  endDate: "",
  process: "",
  status: "",
  nroDocument: "",
  subject: "",
  isCertificate: null
});

const currentView = ref("all");
const currentPage = ref(1);
const showDatePicker = ref(false);
const showCustomDatePicker = ref(false);
const datePickerContainer = ref(null);
const showAttachmentsModal = ref(false);
const showWitnessModal = ref(false);
const currentAttachments = ref([]);

// Nueva variable para almacenar el trackingId del email seleccionado
const selectedEmailTrackingId = ref('');

const showAdvancedSearch = ref(false);
const token = useAuthStore();
const dataTableTotalRows = ref(0);

const userToken = ref(token.$state.token);
const advancedFilters = ref({
  from: "",
  to: "",
  subject: "",
  contains: "",
  notContains: "",
  sizeComparison: "greater",
  size: "",
  startDate: "",
  endDate: "",
  searchIn: "all",
  hasAttachments: false,
});
const dataEmails = ref();

function formatDate(dateString) {
  const date = new Date(dateString);
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return date.toLocaleDateString("es-ES", options);
}

async function viewTestigoPdf(email) {
}

// Función para limpiar los filtros avanzados
function handleClearFilter() {
  advancedFilters.value = {
    from: '',
    to: '',
    subject: '',
    contains: '',
    startDate: '',
    endDate: '',
    searchIn: 'all',
    hasAttachments: false
  };
  filters.value.subject = ""
  filters.value.startDate = ""
  filters.value.endDate = ""
  filters.value.nroDocument = ""
  filters.value.globalSearch = ""

  filters.value.process = "";
  filters.value.status = "";

  // Volver a cargar los datos sin filtros
  getData({}, 0);
}

function handleCloseModalSearch() {
  showAdvancedSearch.value = false
  advancedFilters.value = []
  advancedFilters.value.hasAttachments = false
  // Volver a cargar los datos sin filtros
  // getData({}, 0);
}
function handleOpenModalSearch() {
  showAdvancedSearch.value = true
}

const handlePageChange = async (event) => {
  await getData({
    status: filters.value.status,
    process: filters.value.process,
    nroDocument: filters.value.nroDocument,
    subject: filters.value.subject,
    startDate: filters.value.startDate,
    endDate: filters.value.endDate,
    ...advancedSearchFilters.value,
  }, event.page - 1, event.rowsPerPage);
  // emit('pageChange', dataTable.value)
}

const handleRowsPerPageChange = async (event) => {
  await getData({
    status: filters.value.status,
    // Puedes incluir otros filtros si es necesario
    process: filters.value.process,
    nroDocument: filters.value.nroDocument,
    subject: filters.value.subject,
    startDate: filters.value.startDate,
    endDate: filters.value.endDate,
    ...advancedSearchFilters.value,
  }, event.page, event.rowsPerPage);
  // emit('pageChange', dataEmails.value)
}


function toggleDatePicker() {
  showDatePicker.value = !showDatePicker.value;
  showCustomDatePicker.value = false;
}

// Actualizar la función setDateRange
function setDateRange(range) {
  const today = new Date();
  let endDate = new Date(today);
  let startDate;

  switch (range) {
    case "last7":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      break;
    case "last30":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 30);
      break;
    case "thisMonth":
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case "lastMonth":
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      break;
    case "custom":
      // Aquí podrías establecer un rango de fechas personalizado
      startDate = filters.value.startDate ? new Date(filters.value.startDate) : null;
      endDate = filters.value.endDate ? new Date(filters.value.endDate) : null;
      break;
  }

  // Actualizar los filtros
  if (startDate) {
    filters.value.startDate = startDate.toISOString(); // Enviar en formato ISO
  }
  if (endDate) {
    endDate.setHours(23, 59, 59); // Establecer al final del día
    filters.value.endDate = endDate.toISOString(); // Enviar en formato ISO
  }

  showDatePicker.value = false;

  // Llamar a getData con los nuevos filtros
  handleDateFilter();
}

// Actualizar la función applyCustomDateRange
function applyCustomDateRange() {
  showCustomDatePicker.value = false;
  showDatePicker.value = false;

  if (!filters.value.startDate && !filters.value.endDate) {
    toast.error("Por favor, selecciona tanto la fecha inicial como la fecha final.");
    return;
  } else if (!filters.value.endDate) {
    toast.error("Por favor, selecciona una fecha final.");
    return;
  }
  // Llamar a getData con los nuevos filtros
  handleDateFilter();
}
function formatDateRange(start, end) {
  if (!start && !end) return "Seleccionar rango de fechas";
  if (start && !end) return `Desde ${formatDate(start)}`;
  if (!start && end) return `Hasta ${formatDate(end)}`;
  return `${formatDate(start)} - ${formatDate(end)}`;
}

function openAttachmentsModal(email) {
  currentAttachments.value = email.files;
  showAttachmentsModal.value = true;
}

// Función modificada para manejar el modal de testigos
function openAWitnessModal(email) {
  // Guardar el trackingId del email seleccionado
  selectedEmailTrackingId.value = email.trackingId;
  // Abrir el modal
  showWitnessModal.value = true;
}

function closeAttachmentsModal() {
  showAttachmentsModal.value = false;
  currentAttachments.value = [];
}

function closeWitnessModal() {
  showWitnessModal.value = false;
  // Limpiar el trackingId cuando se cierre el modal
  selectedEmailTrackingId.value = '';
}

const advancedSearchFilters = ref();

async function applyAdvancedSearch() {
  try {
    // Validar que al menos un filtro esté presente
    const hasFilters = [
      advancedFilters.value.from,
      advancedFilters.value.to,
      advancedFilters.value.subject,
      advancedFilters.value.contains,
      advancedFilters.value.hasAttachments,
      advancedFilters.value.dateRange
    ].some(filter => filter && filter !== '');

    // Si no hay filtros, mostrar un toast de error
    if (!hasFilters) {
      toast.error(
        "Debe agregar por lo menos un filtro de búsqueda"
      );
      return; // Salir de la función sin continuar
    }

    // Preparar los filtros avanzados para la consulta
    advancedSearchFilters.value = {
      // Mantener los filtros existentes si es necesario
      ...filters.value,

      // Agregar los filtros avanzados
      from: advancedFilters.value.from,
      to: advancedFilters.value.to,
      subject: advancedFilters.value.subject,
      contains: advancedFilters.value.contains,
      containsAttachments: advancedFilters.value.hasAttachments,

      // Manejar las fechas según el rango seleccionado
      startDate: null,
      endDate: null
    };

    // Manejar el rango de fechas
    if (advancedFilters.value.dateRange === 'custom') {
      // Si es rango personalizado, usar las fechas seleccionadas
      if (advancedFilters.value.startDate) {
        advancedSearchFilters.startDate = advancedFilters.value.startDate;
      }
      if (advancedFilters.value.endDate) {
        advancedSearchFilters.endDate = advancedFilters.value.endDate;
      }
    } else {
      // Si es un rango predefinido (1 día, 1 semana, etc.)
      const days = parseInt(advancedFilters.value.dateRange);
      if (!isNaN(days)) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        advancedSearchFilters.startDate = startDate.toISOString();
        advancedSearchFilters.endDate = endDate.toISOString();
      }
    }

    // Resetear a la primera página
    currentPage.value = 1;

    // Llamar a getData con los filtros avanzados
    await getData({ ...advancedSearchFilters.value, ...filters.value }, 0);

    // Si hay un searchIn específico diferente de 'all'
    if (advancedFilters.value.searchIn !== 'all') {
      filteredEmails.value = filteredEmails.value.filter(email => {
        switch (advancedFilters.value.searchIn) {
          case 'inbox':
            return email.status === 'Enviado';
          case 'sent':
            return email.status === 'Enviado';
          case 'drafts':
            return email.status === 'Rechazado';
          default:
            return true;
        }
      });
    }

    // Cerrar el modal de búsqueda avanzada
    showAdvancedSearch.value = false;

  } catch (error) {
    console.error(error);
  }
}

async function handleSearch() {
  // Validar que al menos un filtro esté presente
  const hasFilters = [
    filters.value.status,
    filters.value.process,
    filters.value.nroDocument,
    filters.value.subject,
    filters.value.startDate,
    filters.value.endDate
  ].some(filter => filter && filter !== '');

  // Si no hay filtros, mostrar un toast de error
  if (!hasFilters) {
    toast.error(
      "Debe agregar por lo menos un filtro de búsqueda"
    );
    return; // Salir de la función sin continuar
  }

  await getData({
    status: filters.value.status,
    // Puedes incluir otros filtros si es necesario
    process: filters.value.process,
    nroDocument: filters.value.nroDocument,
    subject: filters.value.subject,
    startDate: filters.value.startDate,
    endDate: filters.value.endDate,
    ...advancedSearchFilters.value,
  });

}
// Estado para los datos y loading
const filteredEmails = ref([]);

// Función para obtener los datos con filtros
let totalItems = ref(0); // Variable reactiva para almacenar el total de elementos

async function getData(filters = {}, page = 0, size = 20) {
  const hostname = window.location.hostname;

  let BASE_URL = 'https://gcpcentronotificaciones.positivasgdea.com';

  if (hostname.includes('docu') || hostname.includes('frontend-beta')) {
    BASE_URL = 'https://ms-centronotificaciones-beta.proyectos-3t.tech';
  }

  const EMAIL_API_PATH = "/api/email/all";

  try {
    const url = `${BASE_URL}${EMAIL_API_PATH}`;

    // Formatear las fechas si existen
    let startDate = null;
    let endDate = null;

    if (filters.startDate) {
      startDate = moment(filters.startDate).startOf('day').utc().format("YYYY-MM-DDTHH:mm:ss");
    }

    if (filters.endDate) {
      endDate = moment(filters.endDate).endOf('day').format("YYYY-MM-DDTHH:mm:ss");
    }

    // Construir los parámetros de la consulta
    const params = new URLSearchParams({
      pageNo: page,
      pageSize: size,
      ...(filters.from && { of: filters.from }),
      ...(filters.to && { to: filters.to }),
      ...(filters.globalSearch && { to: filters.globalSearch }),
      ...(filters.subject && { containsWords: filters.subject }),
      ...(filters.contains && { containsWords: filters.contains }),
      ...(filters.process && { process: filters.process }),
      ...(filters.status && { status: filters.status }),
      ...(filters.nroDocument && { nroDocument: filters.nroDocument }),
      ...(startDate && { startDate: startDate }),
      ...(endDate && { endDate: endDate }),
      ...(filters.containsAttachments !== undefined && { containsAttachments: filters.containsAttachments }),
      ...(filters.isCertificate !== null && filters.isCertificate !== undefined && { isCertificate: filters.isCertificate })
    });

    const config = {
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    };

    const response = await sgdeaAxios.get(`${url}?${params}`, config);

    dataEmails.value = response.data;
    filteredEmails.value = response.data;
    dataTableTotalRows.value = response.data.totalPages
    totalItems.value = response.totalItems || response.data.length;

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// También necesitas actualizar la función filterEmails para manejar el nuevo formato:
function filterEmails() {
  // Asegurarse de que dataEmails.value sea un array
  if (!Array.isArray(dataEmails.value)) {
    console.error('dataEmails.value no es un array:', dataEmails.value);
    filteredEmails.value = [];
    return;
  }

  const search = filters.value.globalSearch?.toLowerCase() || "";

  filteredEmails.value = dataEmails.value.filter((email) => {
    const to = email.forTo?.toLowerCase() || "";
    const subject = email.subject?.toLowerCase() || "";

    const matchesProcess = !filters.value.process || email.process === filters.value.process;
    const matchesCertification = currentView.value === "all" ||
      (currentView.value === "certified" && email.isCertificate) ||
      (currentView.value === "notCertified" && !email.isCertificate);
    const matchesSearch = !search ||
      to.includes(search) ||
      subject.includes(search) ||
      (email.body && email.body.toLowerCase().includes(search));

    return matchesProcess && matchesCertification && matchesSearch;
  });
}

// Y actualizar la función changeView para que llame a getData en lugar de filterEmails:
function changeView(view) {
  currentView.value = view;

  // Establecer el valor de isCertificate según la vista seleccionada
  switch (view) {
    case 'certified':
      filters.value.isCertificate = true;
      break;
    case 'notCertified':
      filters.value.isCertificate = false;
      break;
    default: // 'all'
      filters.value.isCertificate = null;
      break;
  }

  getData({
    ...filters.value,
    ...advancedSearchFilters.value
  }, 0);
}

// Función auxiliar para aplicar el filtro de fechas
function handleDateFilter() {
  getData({
    ...advancedSearchFilters.value,
    ...filters.value,
    startDate: filters.value.startDate,
    endDate: filters.value.endDate
  }, currentPage.value - 1);
}


// Función que se ejecuta cuando cambia el proceso
async function handleProcessChange() {
  await getData({
    process: filters.value.process,
    status: filters.value.status, // Mantenemos el estado si existe
    ...advancedSearchFilters.value,
  });
}

// Función que se ejecuta cuando cambia el estado
async function handleStatusChange() {
  await getData({
    process: filters.value.process, // Mantenemos el proceso si existe
    status: filters.value.status,
    ...advancedSearchFilters.value,
  });
}

// Nuevo manejador para el número de documento
async function handleDocumentChange() {
  if (filters.value.nroDocument.length >= 6) {
    // Si el número de documento tiene al menos 6 caracteres, se filtra
    await getData({
      nroDocument: filters.value.nroDocument,
    });
  } else if (filters.value.nroDocument.length === 0) {
    // Si está vacío, se trae toda la data
    await getData();
  }
}

// Lifecycle hooks
onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
  await getData();
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Event handlers
function handleClickOutside(event) {
  if (
    datePickerContainer.value &&
    !datePickerContainer.value.contains(event.target)
  ) {
    showDatePicker.value = false;
    showCustomDatePicker.value = false;
  }
}
</script>
