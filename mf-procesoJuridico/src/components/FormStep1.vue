<template>
  <div class="q-pa-xl">
    <div class="q-mb-lg">
      <h5 class="text-h5 q-ma-none q-mb-md">Datos del Remitente</h5>
    </div>

    <!-- Sección: Datos Básicos -->
    <FormComponentModel v-model="formData" :form="datosBasicos" />

    <!-- Separador -->
    <q-separator class="q-my-lg" />

    <!-- Título: Información del Juzgado -->
    <div class="q-mb-md">
      <h6 class="text-h6 q-ma-none text-weight-bold">Información del juzgado</h6>
    </div>

    <!-- Sección: Datos del Juzgado -->
    <FormComponentModel v-model="formData" :form="datosJuzgado" />

    <!-- Botones -->
    <div class="flex justify-center items-center q-pb-md">
      <q-btn
        label="Editar Juzgado"
        icon="mode_edit"
        color="primary"
        style="border-radius: 8px; width: 240px; height: 48px"
        no-caps
      />
    </div>

    <q-separator class="q-my-lg" />

    <!-- Título: Información del Proceso -->
    <div class="q-mb-md">
      <h6 class="text-h6 q-ma-none text-weight-bold">Información del proceso</h6>
    </div>

    <!-- Sección: Datos del Proceso -->
    <FormComponentModel v-model="formData" :form="datosProceso" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import FormJs from '../boot/form.json';
import FormComponentModel from '@shell/components/Forms/FormComponentModel.vue';
import { fieldConfigParser } from '@shell/components/Forms/formParser';

const props = defineProps<{
  cotizacionId?: string | number;
  isEdit?: boolean;
  isCotFromCore: boolean;
  ramo: number;
}>();

// estado reactivo para los valores del formulario (v-model)
const formData = reactive<Record<string, unknown>>({});

// helper que soporta tanto JSON-objeto como función exportada
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

const finalForm = computed(() => fieldConfigParser(formFieldsDatosGenerales.value));

// Dividir el formulario en secciones
const datosBasicos = computed(() => {
  const inputs = finalForm.value.inputs.filter((input) => {
    // Campos antes del primer separador (índices 0-6)
    const idx = finalForm.value.inputs.indexOf(input);
    return idx >= 0 && idx <= 6;
  });
  return { ...finalForm.value, inputs };
});

const datosJuzgado = computed(() => {
  const inputs = finalForm.value.inputs.filter((input) => {
    // Campos del juzgado (índices 9-14, después del separador y título)
    const idx = finalForm.value.inputs.indexOf(input);
    return idx >= 9 && idx <= 14;
  });
  return { ...finalForm.value, inputs };
});

const datosProceso = computed(() => {
  const inputs = finalForm.value.inputs.filter((input) => {
    // Campos del proceso (índices 17-19, después del segundo separador y título)
    const idx = finalForm.value.inputs.indexOf(input);
    return idx >= 17 && idx <= 19;
  });
  return { ...finalForm.value, inputs };
});

const emit = defineEmits<{
  cancel: [];
  continue: [data: Record<string, unknown>];
}>();

function onCancel() {
  emit('cancel');
}

function onContinue() {
  emit('continue', formData);
}
</script>
