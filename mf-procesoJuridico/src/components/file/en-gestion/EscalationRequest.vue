<template>
  <div class="q-pa-xl">
    <h5 class="text-weight-bold text-h5" style="margin-bottom: 20px">Motivo de escalamiento</h5>
    <div>
      <FormComponentModel v-model="formData" :form="finalFormFiltrado" disable />
    </div>

    <!-- Tabla de documentos adjuntos separada -->
    <div class="q-mt-lg">
      <div class="text-weight-bold text-h6 q-mb-md">Documentos adjuntos</div>
      <q-table
        :rows="documentosAdjuntos"
        :columns="columnasDocumentos"
        flat
        hide-pagination
        :rows-per-page-options="[0]"
      >
      </q-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import FormJs from '../../../boot/formEscalar.json';
import FormComponentModel from '@shell/components/Forms/FormComponentModel.vue';
import { fieldConfigParser } from '@shell/components/Forms/formParser';

const formData = reactive<Record<string, unknown>>({});

// Datos de documentos adjuntos
const documentosAdjuntos = [
  {
    formato: 'ENT202050528002352.pdf',
    nombre: 'De entrada',
    tipo: 'Documento principal',
    fecha: '20/10/2025 09:42',
    usuario: 'default_radicador',
  },
  {
    formato: 'ENT202050528002352.jpg',
    nombre: 'De entrada',
    tipo: 'Imagen anexa',
    fecha: '20/10/2025 09:42',
    usuario: 'default_radicador',
  },
];

const columnasDocumentos = [
  { name: 'formato', label: 'Formato', field: 'formato', align: 'center' },
  { name: 'nombre', label: 'Nombre del documento', field: 'nombre', align: 'center' },
  { name: 'tipo', label: 'Tipo de documento', field: 'tipo', align: 'center' },
  { name: 'fecha', label: 'Fecha de cargue', field: 'fecha', align: 'center' },
  { name: 'usuario', label: 'Cargada por', field: 'usuario', align: 'center' },
];

const props = defineProps<{
  cotizacionId?: string | number;
  isEdit?: boolean;
  isCotFromCore: boolean;
  ramo: number;
}>();

const resolveFormSource = (src: unknown, ramo: number | string) => {
  if (typeof src === 'function') {
    return src(ramo);
  }
  const key = String(ramo);
  return src && typeof src === 'object' && key in src ? (src as Record<string, unknown>)[key] : src;
};

const formFieldsDatosGenerales = computed(() => {
  const resolved = resolveFormSource(FormJs, props.ramo);
  return resolved;
});

// Formulario filtrado SIN campo de subida de documentos
const finalFormFiltrado = computed(() => {
  const parsedForm = fieldConfigParser(formFieldsDatosGenerales.value);
  let filtrados = parsedForm;
  // Si el resultado tiene 'inputs', filtra dentro de ese array
  if (parsedForm && parsedForm.inputs && Array.isArray(parsedForm.inputs)) {
    filtrados = {
      ...parsedForm,
      inputs: parsedForm.inputs.filter(
        (field) => field.label !== 'anexos_upload' && field.type !== 'file',
      ),
    };
  }
  return filtrados;
});

const descargarDocumento = (documento: any) => {
  console.log('Descargando:', documento.nombre);
};
</script>
