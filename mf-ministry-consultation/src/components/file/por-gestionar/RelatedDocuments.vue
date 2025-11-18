<template>
  <div class="q-pa-md container_background">
    <q-card flat>
      <q-card-section>
        <div class="text-weight-bold text-h5">Lista de Anexos</div>
      </q-card-section>

      <q-card-section>
        <!-- Filtros -->
        <div class="row q-gutter-md q-mb-md">
          <q-btn
            :color="filterType === 'entrada' ? 'primary' : 'grey-7'"
            outline
            icon="info"
            label="De entrada"
            @click="filterType = 'entrada'"
          />
          <q-btn
            :color="filterType === 'gestion' ? 'primary' : 'grey-7'"
            outline
            icon="info"
            label="De gestión"
            @click="filterType = 'gestion'"
          />
          <q-btn
            :color="filterType === 'salida' ? 'primary' : 'grey-7'"
            outline
            icon="info"
            label="De salida"
            @click="filterType = 'salida'"
          />
          <q-space />
        </div>

        <!-- Tabla de anexos -->
        <TableComponent
          :BODY="filteredDocuments"
          :HEADER="columns"
          :loading="false"
          :totalPages="totalPages"
          :pagination="pagination"
          :enableSelection="false"
          :showTrazabilidad="false"
          :showEstado="false"
          :showAcciones="true"
          @pagination-change="onPageChange"
          :accionesConfig="{
            showDownloadButton: true,
            showTrashButton: false,
          }"
          @descargar-documento="downloadDocument"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import TableComponent from '@shell/components/Table.vue';

const $q = useQuasar();
const uploadDialog = ref(false);
const filterType = ref('entrada');

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
});

const filterOptions = [
  { label: 'De entrada', value: 'entrada' },
  { label: 'De gestión', value: 'gestion' },
  { label: 'De salida', value: 'salida' },
];

const columns = [
  { name: 'formato', label: 'Formato', field: 'formato', align: 'center', sortable: true },
  {
    name: 'nombreDocumento',
    label: 'Nombre del documento',
    field: 'nombreDocumento',
    align: 'center',
    sortable: true,
  },
  {
    name: 'tipoDocumento',
    label: 'Tipo de documento',
    field: 'tipoDocumento',
    align: 'center',
    sortable: true,
  },
  {
    name: 'cargadaPor',
    label: 'Cargada por',
    field: 'cargadaPor',
    align: 'center',
    sortable: true,
  },
  {
    name: 'fechaCargue',
    label: 'Fecha de cargue',
    field: 'fechaCargue',
    align: 'center',
    sortable: true,
  },
  { name: 'acciones', label: 'Descargar', field: 'acciones', align: 'center' },
];

const documents = ref([
  {
    id: 1,
    formato: 'PDF',
    nombreDocumento: 'Solicitud_inicial.pdf',
    tipoDocumento: 'Solicitud',
    cargadaPor: 'Juan Pérez',
    fechaCargue: '21/05/2025',
    noRadicado: 'RAD-2025-001',
    remitente: 'María García',
    departamento: 'Cundinamarca',
    ciudad: 'Bogotá',
    nombreAfectado: 'Carlos Rodríguez',
    carpeta: 'Entrada',
    estadoProceso: 'En revisión',
    tipo: 'entrada',
  },
  {
    id: 2,
    formato: 'DOCX',
    nombreDocumento: 'Informe_gestion.docx',
    tipoDocumento: 'Informe',
    cargadaPor: 'Ana López',
    fechaCargue: '22/05/2025',
    noRadicado: 'RAD-2025-002',
    remitente: 'Pedro Martínez',
    departamento: 'Antioquia',
    ciudad: 'Medellín',
    nombreAfectado: 'Laura Fernández',
    carpeta: 'Gestión',
    estadoProceso: 'En proceso',
    tipo: 'gestion',
  },
  {
    id: 3,
    formato: 'PDF',
    nombreDocumento: 'Respuesta_final.pdf',
    tipoDocumento: 'Respuesta',
    cargadaPor: 'Roberto Silva',
    fechaCargue: '23/05/2025',
    noRadicado: 'RAD-2025-003',
    remitente: 'Sistema',
    departamento: 'Valle del Cauca',
    ciudad: 'Cali',
    nombreAfectado: 'Diego Morales',
    carpeta: 'Salida',
    estadoProceso: 'Finalizado',
    tipo: 'salida',
  },
]);

interface Document {
  id: number;
  formato: string;
  nombreDocumento: string;
  tipoDocumento: string;
  cargadaPor: string;
  fechaCargue: string;
  noRadicado: string;
  remitente: string;
  departamento: string;
  ciudad: string;
  nombreAfectado: string;
  carpeta: string;
  estadoProceso: string;
  tipo: string;
}

const filteredDocuments = computed(() => {
  return documents.value.filter((doc) => doc.tipo === filterType.value);
});

const totalPages = computed(() => {
  return Math.ceil(filteredDocuments.value.length / pagination.value.rowsPerPage);
});

const onPageChange = (page: number) => {
  pagination.value.page = page;
};

const newDocument = ref({
  file: null,
  description: '',
});

const attachDocument = () => {
  $q.notify({
    type: 'positive',
    message: 'Documento adjuntado correctamente',
    position: 'top-right',
  });
  uploadDialog.value = false;
};

const viewDocument = (doc: Document) => {
  $q.notify({
    message: `Visualizando: ${doc.nombreDocumento}`,
    position: 'top-right',
  });
};

const downloadDocument = (doc: Document) => {
  $q.notify({
    type: 'positive',
    message: `Descargando: ${doc.nombreDocumento}`,
    position: 'top-right',
  });
};

const deleteDocument = (doc: Document) => {
  $q.dialog({
    title: 'Confirmar',
    message: `¿Está seguro de eliminar ${doc.nombreDocumento}?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    $q.notify({
      type: 'positive',
      message: 'Documento eliminado',
      position: 'top-right',
    });
  });
};
</script>
