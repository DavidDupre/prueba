<template>
  <div>
    <!-- Badge de Estado -->
    <div class="q-mb-md">
      <q-card-section class="q-py-sm">
        <div class="row items-center justify-between">
          <div class="row items-center q-gutter-md">
            <q-badge
              :label="getStatusLabel()"
              class="text-subtitle2"
              :style="getStatusBadgeStyle()"
            />
          </div>
          <component-button
            v-if="processStatus === 'por-gestionar'"
            :colorButton="'secondary'"
            :colorText="''"
            text="Rechazar"
            @click="openRejectDialog"
            style="width: 130px; height: 42px"
          />

          <!-- Botones para por-revisar y por-aprobar -->
          <div
            v-if="processStatus === 'por-revisar' || processStatus === 'por-aprobar'"
            class="row justify-end q-gutter-sm"
          >
            <component-button
              flat
              :colorButton="'secondary'"
              :colorText="''"
              text="Rechazar"
              @click="openRejectDialog"
              style="width: 130px; height: 42px"
            />
            <component-button
              :colorButton="'primary'"
              :colorText="'white'"
              text="Aprobar"
              @click="approveRequest"
              style="width: 130px; height: 42px"
            />
          </div>
        </div>
      </q-card-section>
    </div>

    <!-- Navigation Tabs -->
    <NavigationBar :tabs="tabMeta" v-model="activeTab" default-tab="general" />
    <div class="tab-content-wrapper q-mt-lg container_background">
      <KeepAlive>
        <component :is="currentTab?.component" />
      </KeepAlive>
    </div>
  </div>

  <!-- Modal para ingresar motivo de rechazo, textos dinámicos según estado -->
  <MultiInputDialog
    :model-value="showInputDialog"
    :title="
      processStatus === 'por-aprobar'
        ? '¿Seguro de rechazar la solicitud?'
        : '¿Estás seguro de rechazar la solicitud?'
    "
    :subtitle="
      processStatus === 'por-aprobar'
        ? 'Escribe aquí motivo de rechazo:'
        : 'Escriba el motivo del rechazo*:'
    "
    :action="onAddComment"
    accept-label="Rechazar Solicitud"
    cancelar-label="Cancelar"
    input="textarea-length"
    label="Comentarios"
    :options="[]"
    :cancelarAction="onCloseInputDialog"
    :textValue="commentText"
    @update:textValue="commentText = $event"
  />

  <!-- Modal de confirmación de rechazo exitoso - SOLO VISIBLE EN POR-REVISAR Y POR-APROBAR -->
  <MultiPurposeDialog
    v-if="processStatus === 'por-revisar' || processStatus === 'por-aprobar'"
    v-model="showConfirmationDialog"
    type="success"
    :title="'Rechazo registrado con éxito'"
    :subtitle="'La solicitud fue rechazada correctamente.'"
    accept-label="Finalizar"
    cancel-label=""
    :action="onCloseConfirmationDialog"
    :cancel-action="onCloseConfirmationDialog"
  />

  <!-- Modal de aprobación - SOLO VISIBLE EN POR-REVISAR/POR-APROBAR Y TAB COMENTARIOS-REVISAR -->
  <MultiPurposeDialog
    v-if="
      showApproveDialog &&
      (processStatus === 'por-revisar' || processStatus === 'por-aprobar') &&
      activeTab === 'comentarios-revisar'
    "
    v-model="showApproveDialog"
    type="question"
    :title="processStatus === 'por-aprobar' ? 'Confirma la aprobación' : 'Aprobación registrada'"
    :subtitle="
      processStatus === 'por-aprobar'
        ? '¿Está seguroavisto bueno a la respuesta proyectada?'
        : 'La respuesta proyectada fue aprobada correctamente.'
    "
    :accept-label="processStatus === 'por-aprobar' ? 'Sí' : 'Finalizar'"
    :cancel-label="processStatus === 'por-aprobar' ? 'No' : ''"
    :action="() => onCloseApproveDialog(true)"
    :cancel-action="() => onCloseApproveDialog(false)"
  />

  <!-- Segundo modal de confirmación exitosa para por-aprobar -->
  <MultiPurposeDialog
    v-if="showApproveSuccessDialog && processStatus === 'por-aprobar'"
    v-model="showApproveSuccessDialog"
    type="success"
    title="Confirmación exitosa"
    :subtitle="'La respuesta proyectada tiene su visto bueno. El número de Radicado de salida es:'"
    :description="'<b>SAL-2025-00001238</b>'"
    accept-label="Finalizar"
    cancel-label="Descargar"
    :action="onCloseApproveSuccessDialog"
    :cancel-action="onCloseApproveSuccessDialog"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, provide, onMounted } from 'vue';
import { ColoresEstado } from '@shell/assets/estados/estados';
import { useRoute } from 'vue-router';
import { useQuasar, Dialog } from 'quasar';
import NavigationBar from '@shell/components/NavigationBar.vue';
import ComponentButton from '@shell/components/ComponentButton.vue';
import MultiInputDialog from '@shell/components/MultiInputDialog.vue';
import MultiPurposeDialog from '@shell/components/MultiPurposeDialog.vue';

// Componentes compartidos
import GeneralInformation from './GeneralInformation.vue';
// import ProcessMetadata from './ProcessMetadata.vue';
import Traceability from './Traceability.vue';
import Comments from './Comments.vue';

// Componentes de "Por Asignar"
import AssignProcess from './por-asignar/AssignProcess.vue';
import Reassignment from './por-asignar/Reassignment.vue';

// Componentes de "Por Gestionar"
import StartManagement from './por-gestionar/StartManagement.vue';
import RelatedDocuments from './por-gestionar/RelatedDocuments.vue';

// Componentes de "En Gestión"
import OutputData from './en-gestion/OutputData.vue';
import OutputDocuments from './en-gestion/OutputDocuments.vue';
import AttachDocuments from './en-gestion/AttachDocuments.vue';
import IncludeFile from './en-gestion/IncludeFile.vue';
import EscalateProcess from './en-gestion/EscalateProcess.vue';
import EscalationManagement from './en-gestion/EscalationManagement.vue';
import SendToReview from './en-gestion/SendToReview.vue';
import SendToApproval from './en-gestion/SendToApproval.vue';
import EscalationRequest from './en-gestion/EscalationRequest.vue';
import EscalationResponse from './en-gestion/EscalationResponse.vue';
import { useRouter } from 'vue-router';

// Variables para controlar los modales
const showInputDialog = ref(false);
const showConfirmationDialog = ref(false);
const showApproveDialog = ref(false);
const showApproveSuccessDialog = ref(false);
const commentText = ref('');

// Función para abrir el diálogo de rechazo
function openRejectDialog() {
  console.log('Abriendo modal de rechazo...');
  // Resetear el comentario al abrir el modal
  commentText.value = '';
  showInputDialog.value = true;
  console.log('showInputDialog después de abrir:', showInputDialog.value);
}

// Función para cerrar el diálogo de input
function onCloseInputDialog() {
  console.log('Cerrando modal de input');
  showInputDialog.value = false;
  commentText.value = '';
}

// Función para procesar el comentario de rechazo
function onAddComment() {
  console.log(
    'Procesando comentario de rechazo:',
    commentText.value,
    'Tipo:',
    typeof commentText.value,
  );

  // Cerrar el modal de input
  showInputDialog.value = false;

  // Aquí podrías hacer una llamada API para guardar el rechazo

  // Mostrar el modal de confirmación si estamos en POR-REVISAR o POR-APROBAR
  if (processStatus.value === 'por-revisar' || processStatus.value === 'por-aprobar') {
    showConfirmationDialog.value = true;
  } else {
    // Para otros estados, mostrar solo una notificación
    $q.notify({
      type: 'negative',
      message: 'Solicitud rechazada correctamente',
      position: 'top',
    });
  }

  // Limpiar el comentario
  commentText.value = '';
}

// Función para cerrar el diálogo de confirmación
function onCloseConfirmationDialog() {
  showConfirmationDialog.value = false;
  return false;
}

// Función para aprobar solicitud
function approveRequest() {
  // Solo abrir el modal si estamos en por-revisar o por-aprobar y en la tab de comentarios
  if (
    (processStatus.value === 'por-revisar' || processStatus.value === 'por-aprobar') &&
    activeTab.value === 'comentarios-revisar'
  ) {
    showApproveDialog.value = true;
  } else {
    // Lógica para aprobar normal
    $q.notify({
      type: 'positive',
      message: 'Solicitud aprobada correctamente',
      position: 'top',
    });
  }
}
function onCloseApproveDialog(approved = false) {
  showApproveDialog.value = false;
  if (approved && processStatus.value === 'por-aprobar') {
    showApproveSuccessDialog.value = true;
  }
}
function onCloseApproveSuccessDialog() {
  showApproveSuccessDialog.value = false;
}

// Estado del proceso
const processStatus = ref<
  'por-asignar' | 'por-gestionar' | 'por-revisar' | 'por-aprobar' | 'en-gestionar'
>('por-asignar');
const route = useRoute();
const $q = useQuasar();

onMounted(() => {
  // Detecta el estado desde el parámetro de la ruta (puede ser id o estado)
  // Si el parámetro es un estado válido, lo asigna
  const estadoParam = (route.params.estado || route.params.id) as string;
  if (
    estadoParam === 'por-asignar' ||
    estadoParam === 'por-gestionar' ||
    estadoParam === 'en-gestionar' ||
    estadoParam === 'por-revisar' ||
    estadoParam === 'por-aprobar'
  ) {
    processStatus.value = estadoParam as
      | 'por-asignar'
      | 'por-gestionar'
      | 'por-revisar'
      | 'por-aprobar'
      | 'en-gestionar';
  }
});

const statusOptions = [
  { label: 'Por Asignar', value: 'por-asignar' },
  { label: 'Por Gestionar', value: 'por-gestionar' },
  { label: 'En Edición', value: 'en-gestionar' },
  { label: 'Por Revisar', value: 'por-revisar' },
  { label: 'Por Aprobar', value: 'por-aprobar' },
];

// Función para cambiar el estado a "Por Gestionar" (después de asignar)
const assignProcess = () => {
  processStatus.value = 'por-gestionar';
  activeTab.value = 'general';
};
const router = useRouter();
// Función para cambiar el estado a "En Gestión" (después de iniciar gestión)
const startManagement = () => {
  processStatus.value = 'en-gestionar';
  activeTab.value = 'general';
  router.push('/form-Ministerio/file/en-gestionar');
};

// Función para cambiar el estado del proceso desde un hijo
const changeProcessStatus = (
  newStatus: 'por-asignar' | 'por-gestionar' | 'en-gestionar' | 'por-revisar' | 'por-aprobar',
) => {
  processStatus.value = newStatus;
};

// Proveer las funciones a los componentes hijos
provide('assignProcess', assignProcess);
provide('startManagement', startManagement);
provide('processStatus', processStatus);
provide('changeProcessStatus', changeProcessStatus);

// Definición de todas las tabs organizadas por estado
const allTabs: TabDef[] = [
  // Tabs para "Por Asignar"
  {
    id: 'general',
    label: 'Información General',
    icon: 'info',
    color: 'bg-orange-6',
    component: GeneralInformation,
    allowedStates: ['por-asignar'],
  },
  {
    id: 'asignar',
    label: 'Asignar',
    icon: 'assignment',
    color: 'bg-blue-6',
    component: AssignProcess,
    allowedStates: ['por-asignar'],
  },
  {
    id: 'reasignar',
    label: 'Reasignar',
    icon: 'people',
    color: 'bg-purple-6',
    component: Reassignment,
    allowedStates: ['por-asignar'],
  },
  {
    id: 'trazabilidad',
    label: 'Trazabilidad',
    icon: 'timeline',
    color: 'bg-indigo-6',
    component: Traceability,
    allowedStates: ['por-asignar'],
  },
  {
    id: 'comentarios-inicial',
    label: 'Comentarios',
    icon: 'chat',
    color: 'bg-pink-6',
    component: Comments,
    allowedStates: ['por-asignar'],
  },

  // Tabs para "Por Gestionar"
  {
    id: 'general-gestionar',
    label: 'Información General',
    icon: 'info',
    color: 'bg-orange-6',
    component: GeneralInformation,
    allowedStates: ['por-gestionar'],
  },
  {
    id: 'iniciar-gestion',
    label: 'Iniciar Gestión',
    icon: 'play_arrow',
    color: 'bg-green-6',
    component: StartManagement,
    allowedStates: ['por-gestionar'],
  },
  {
    id: 'documentos-gestionar',
    label: 'Documentos Relacionados',
    icon: 'folder',
    color: 'bg-teal-6',
    component: RelatedDocuments,
    allowedStates: ['por-gestionar'],
  },
  {
    id: 'trazabilidad-gestionar',
    label: 'Trazabilidad',
    icon: 'timeline',
    color: 'bg-indigo-6',
    component: Traceability,
    allowedStates: ['por-gestionar'],
  },
  {
    id: 'comentarios-inicial',
    label: 'Comentarios',
    icon: 'chat',
    color: 'bg-pink-6',
    component: Comments,
    allowedStates: ['por-gestionar'],
  },

  // Tabs para "Por Revisar" (menú solicitado)
  {
    id: 'general-revisar',
    label: 'Información General',
    icon: 'info',
    color: 'bg-orange-6',
    component: GeneralInformation,
    allowedStates: ['por-revisar', 'por-aprobar'],
  },
  {
    id: 'documentos-relacionados-revisar',
    label: 'Documentos relacionados',
    icon: 'folder',
    color: 'bg-teal-6',
    component: RelatedDocuments,
    allowedStates: ['por-revisar', 'por-aprobar'],
  },
  {
    id: 'documentos-salida-revisar',
    label: 'Documentos de salida',
    icon: 'description',
    color: 'bg-purple-6',
    component: OutputDocuments,
    allowedStates: ['por-revisar', 'por-aprobar'],
  },
  {
    id: 'trazabilidad-revisar',
    label: 'Trazabilidad',
    icon: 'timeline',
    color: 'bg-indigo-6',
    component: Traceability,
    allowedStates: ['por-revisar', 'por-aprobar'],
  },
  {
    id: 'comentarios-revisar',
    label: 'Comentarios',
    icon: 'chat',
    color: 'bg-pink-6',
    component: Comments,
    allowedStates: ['por-revisar', 'por-aprobar'],
  },

  // Tabs para "Edicion" (en-gestion)
  {
    id: 'general-edicion',
    label: 'Información General',
    icon: 'info',
    color: 'bg-orange-6',
    component: GeneralInformation,
    allowedStates: ['en-gestionar'],
  },
  {
    id: 'documentos-relacionados',
    label: 'Documentos relacionados',
    icon: 'folder',
    color: 'bg-teal-6',
    component: RelatedDocuments,
    allowedStates: ['en-gestionar'],
  },
  {
    id: 'datos-salida',
    label: 'Datos de salida',
    icon: 'output',
    color: 'bg-blue-6',
    component: OutputData,
    allowedStates: ['en-gestionar'],
  },
  {
    id: 'documentos-salida',
    label: 'Documentos de salida',
    icon: 'description',
    color: 'bg-purple-6',
    component: OutputDocuments,
    allowedStates: ['en-gestionar'],
  },
  {
    id: 'adjuntar',
    label: 'Adjuntar documentos',
    icon: 'attach_file',
    color: 'bg-cyan-6',
    component: AttachDocuments,
    allowedStates: ['en-gestionar'],
  },

  {
    id: 'incluir-expediente',
    label: 'Incluir expediente',
    icon: 'folder_shared',
    color: 'bg-amber-6',
    component: IncludeFile,
    allowedStates: ['en-gestionar'],
  },
  // {
  //   id: 'escalar',
  //   label: 'Escalar',
  //   icon: 'trending_up',
  //   color: 'bg-deep-orange-6',
  //   component: EscalateProcess,
  //   allowedStates: ['en-gestionar'],
  // },
  // {
  //   id: 'solicitud-escalamiento',
  //   label: 'Solicitud de escalamiento',
  //   icon: 'swap_vert',
  //   color: 'bg-brown-6',
  //   component: EscalationRequest,
  //   allowedStates: ['en-gestionar'],
  // },
  // {
  //   id: 'respuesta-escalamiento',
  //   label: 'Respuesta de escalamiento',
  //   icon: 'swap_vert',
  //   color: 'bg-brown-6',
  //   component: EscalationResponse,
  //   allowedStates: ['en-gestionar'],
  // },
  // {
  //   id: 'gestion-escalamiento',
  //   label: 'Gestión de escalamiento',
  //   icon: 'swap_vert',
  //   color: 'bg-brown-6',
  //   component: EscalationManagement,
  //   allowedStates: ['en-gestionar'],
  // },
  {
    id: 'enviar-revision',
    label: 'Enviar a revisión',
    icon: 'rate_review',
    color: 'bg-light-blue-6',
    component: SendToReview,
    allowedStates: ['en-gestionar'],
  },
  {
    id: 'enviar-aprobacion',
    label: 'Enviar a aprobación',
    icon: 'check_circle',
    color: 'bg-light-green-6',
    component: SendToApproval,
    allowedStates: ['en-gestionar'],
  },
  {
    id: 'trazabilidad-edicion',
    label: 'Trazabilidad',
    icon: 'timeline',
    color: 'bg-indigo-6',
    component: Traceability,
    allowedStates: ['en-gestionar'],
  },
  {
    id: 'comentarios-edicion',
    label: 'Comentarios',
    icon: 'chat',
    color: 'bg-pink-6',
    component: Comments,
    allowedStates: ['en-gestionar'],
  },
];

// Estilos completos para el badge de estado
const getStatusBadgeStyle = () => {
  const estadoMap: Record<string, string> = {
    'por-asignar': 'Por asignar',
    'por-gestionar': 'Por gestionar',
    'en-gestionar': 'En edición',
    'por-revisar': 'Por revisar',
    'por-aprobar': 'Por aprobar',
  };
  const estado = estadoMap[processStatus.value] ?? processStatus.value;
  const { bg, text, border } = ColoresEstado(estado);
  return {
    background: bg,
    color: text,
    border: border ? `1.5px solid ${border}` : undefined,
    fontWeight: 'bold',
    borderRadius: '12px',
    width: '170px',
    height: '32px',
    justifyContent: 'center',
  };
};

const getStatusLabel = () => {
  const labels = {
    'por-asignar': 'Por Asignar',
    'por-gestionar': 'Por Gestionar',
    'en-gestionar': 'En Edición',
    'por-revisar': 'Por Revisar',
    'por-aprobar': 'Por Aprobar',
  };
  return labels[processStatus.value];
};

// Tabs filtradas según el estado actual
const tabs = computed(() =>
  allTabs.filter((tab) => tab.allowedStates.includes(processStatus.value)),
);

// Metadata sin la referencia de componente para NavigationBar (solo UI)
const tabMeta = computed(() =>
  tabs.value.map(({ id, label, icon, color }) => ({ id, label, icon, color })),
);

const activeTab = ref('general');
const currentTab = computed(() => tabs.value.find((t) => t.id === activeTab.value));

provide('activeTab', activeTab);

// Cambiar a la primera tab disponible cuando cambia el estado
watch(processStatus, () => {
  const firstAvailableTab = tabs.value[0]?.id;
  if (firstAvailableTab && !tabs.value.some((t) => t.id === activeTab.value)) {
    activeTab.value = firstAvailableTab;
  }
});

// Función para rechazar solicitud (mantenida por si la necesitas)
</script>

<style lang="scss" scoped>
.page-container {
  width: 100%;
}

.welcome-message {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;

  p {
    margin: 0;
    color: #616161;
  }
}

/* Sobrescribe los shadows del monolito con máxima prioridad */
:deep(.q-field--outlined .q-field__control:before),
:deep(.q-field--outlined .q-field__control:after),
:deep(.q-field__control:before),
:deep(.q-field__control:after) {
  box-shadow: none !important;
}

:deep(.q-checkbox__bg) {
  box-shadow: none !important;
}
</style>
