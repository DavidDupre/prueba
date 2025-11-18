<template>
  <div class="q-pa-md">
    <div class="col-12">
      <q-input
        label="Descripción"
        type="textarea"
        outlined
        rows="5"
        :rules="[(val) => !!val || 'Campo requerido']"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';

interface Document {
  id: number;
  name: string;
  type: string;
  date: string;
  status: string;
}

const $q = useQuasar();
const generateDialog = ref(false);

const columns = [
  { name: 'name', label: 'Nombre', field: 'name', align: 'left' as const },
  { name: 'type', label: 'Tipo', field: 'type', align: 'left' as const },
  { name: 'date', label: 'Fecha', field: 'date', align: 'left' as const },
  { name: 'status', label: 'Estado', field: 'status', align: 'center' as const },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' as const },
];

const documents = ref([
  {
    id: 1,
    name: 'Oficio_Respuesta_001.pdf',
    type: 'Oficio',
    date: '23/05/2025',
    status: 'Firmado',
  },
  {
    id: 2,
    name: 'Anexo_Tecnico.docx',
    type: 'Anexo',
    date: '23/05/2025',
    status: 'En Elaboración',
  },
]);

const documentTypes = ['Oficio', 'Resolución', 'Concepto', 'Informe', 'Certificado', 'Anexo'];

const templates = [
  'Plantilla Oficio Estándar',
  'Plantilla Resolución',
  'Plantilla Concepto Jurídico',
];

const newDocument = ref({
  type: '',
  template: '',
  subject: '',
});

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Firmado: 'positive',
    'En Elaboración': 'warning',
    Pendiente: 'orange',
    Enviado: 'info',
  };
  return colors[status] || 'grey';
};

const generateDocument = () => {
  $q.notify({
    type: 'positive',
    message: 'Documento generado correctamente',
    position: 'top-right',
  });
  generateDialog.value = false;
};

const editDocument = (doc: Document) => {
  $q.notify({
    message: `Editando: ${doc.name}`,
    position: 'top-right',
  });
};

const viewDocument = (doc: Document) => {
  $q.notify({
    message: `Visualizando: ${doc.name}`,
    position: 'top-right',
  });
};

const downloadDocument = (doc: Document) => {
  $q.notify({
    type: 'positive',
    message: `Descargando: ${doc.name}`,
    position: 'top-right',
  });
};
</script>
