<template>
  <div class="tw-bg-gray-100 tw-p-4 tw-border-l tw-border-gray-200 tw-h-full tw-w-80">
    <div class="tw-mb-4">
      <h1 class="tw-text-xl tw-font-bold tw-text-gray-900 tw-mb-10">
        Columna
      </h1>
      <div class="tw-relative tw-rounded-md tw-shadow-sm">
        <input id="searchField" type="text" v-model="searchTerm"
          class="tw-block tw-w-full tw-rounded-md tw-border-gray-300 tw-pl-3 tw-pr-10 tw-py-2 focus:tw-border-primary focus:tw-ring-primary sm:tw-text-sm"
          placeholder="Insertar texto" @keyup.enter="handleSearch" />
        <div class="tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-3">
          <svg class="tw-h-5 tw-w-5 tw-text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
            fill="currentColor">
            <path fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    </div>

    <button @click="emit('open-modal')"
      class="tw-w-full tw-flex tw-items-center tw-justify-center tw-px-4 tw-py-2 tw-border tw-border-transparent tw-rounded-md tw-shadow-sm tw-text-sm tw-font-medium tw-text-white tw-bg-primary hover:tw-bg-primary-dark focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-primary">
      <svg class="tw-h-5 tw-w-5 tw-mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd"
          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
          clip-rule="evenodd" />
      </svg>
      Agregar Campo
    </button>

    <div class="tw-mt-4 tw-space-y-2">
      <div v-for="field in fields" :key="field.id"
           @click="emit('insert-field', field)"
           class="tw-p-2 tw-border tw-border-gray-200 tw-rounded tw-bg-white tw-cursor-pointer hover:tw-bg-gray-50">
        <div class="tw-font-medium">{{ field.nombreCampo }}</div>
        <div class="tw-text-xs tw-text-gray-500 tw-mt-1">
          {{ getTypeLabel(field.tipoCampo) }} • {{ getFormatLabel(field.formatoVisualizacion) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

const searchTerm = defineModel<string>('searchTerm', { required: true });

const emit = defineEmits<{
  (e: 'open-modal'): void
  (e: 'search', term: string): void
  (e: 'insert-field', field: any): void
}>();

const props = defineProps({
  fields: {
    type: Array as PropType<Array<{
      id: number;
      nombreCampo: string;
      tipoCampo: string;
      formatoVisualizacion: string;
    }>>,
    default: () => []
  }
});

const handleSearch = () => {
  emit('search', searchTerm.value);
};

const getTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    'TEXTO_CORTO': 'Texto corto',
    'TEXTO_LARGO': 'Texto largo',
    'NUMERO': 'Número',
    'FECHA': 'Fecha',
    'EMAIL': 'Email',
    'SELECTOR': 'Selector'
  };
  return types[type] || type;
};

const getFormatLabel = (format: string) => {
  const formats: Record<string, string> = {
    'FORMATO_TEXTO': 'Texto',
    'FORMATO_NUMERO': 'Número',
    'FORMATO_FECHA': 'Fecha',
    'FORMATO_EMAIL': 'Email',
    'FORMATO_SELECTOR': 'Selector'
  };
  return formats[format] || format;
};
</script>
