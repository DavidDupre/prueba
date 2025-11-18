<template>
  <div class="q-pa-xl">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6 text-bold">Respuesta de escalamiento</div>
    </div>
    <FormComponentModel v-model="formData" :form="finalForm" />

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

    <div class="row justify-center q-mt-md q-gutter-sm">
      <q-btn
        label="Cancelar"
        text-color="black"
        style="border-radius: 8px; width: 200px; height: 48px; border: 1px solid #f2f4f5"
        no-caps
      />
      <q-btn
        label="Guardar"
        color="primary"
        style="border-radius: 8px; width: 200px; height: 48px; border: 1px solid #f2f4f5"
        no-caps
      />
      <q-btn
        label="Enviar Respuesta"
        color="secondary"
        style="border-radius: 8px; width: 200px; height: 48px"
        no-caps
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { fieldConfigParser } from '@shell/components/Forms/formParser';

import FormComponentModel from '@shell/components/Forms/FormComponentModel.vue';
import FormJs from '../../../boot/formEscalar.json';

interface FormStep4Props {
  formSections?: unknown;
  modelValue?: Record<string, unknown>;
}

const props = withDefaults(defineProps<FormStep4Props>(), {
  modelValue: () => ({}),
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, unknown>): void;
}>();

const formData = computed({
  get() {
    return props.modelValue || {};
  },
  set(value: Record<string, unknown>) {
    emit('update:modelValue', value);
  },
});

const formAnexos = computed(() => FormJs.respuesta);
const finalForm = computed(() => {
  const formConfig = JSON.parse(JSON.stringify(formAnexos.value));
  return fieldConfigParser(formConfig);
});

// Datos de documentos adjuntos
const documentosAdjuntos = [
  {
    formato: 'pdf',
    nombre: 'De entrada',
    tipo: 'Documento principal',
    fecha: '20/10/2025 09:42',
    usuario: 'default_radicador',
  },
  {
    formato: 'jpg',
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
</script>
