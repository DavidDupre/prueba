<template>
  <q-btn-dropdown
    class="tw-rounded-xl tw-border-2 tw-border-gray-300 tw-px-4 tw-py-1"
    label="Exportar en"
    :disable="disabled"
    dropdown-icon="expand_more"
    flat
  >
    <q-list class="tw-p-2">
      <q-item
        v-for="{ img, label, value } in optionsExport"
        :key="label"
        clickable
        v-close-popup
        @click="handleButton(value)"
        class="tw-rounded-lg tw-px-3 tw-py-2 hover:tw-bg-gray-100"
      >
        <q-item-section class="tw-flex tw-items-center tw-flex-row tw-gap-3">
          <img v-lazy :data-url="img" alt="icon" class="tw-w-5 tw-h-5">
          <q-item-label class="tw-text-gray-800">{{ label }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import XML from "assets/xml.svg";
import PDF from "assets/pdf.svg";
import CSV from "assets/csv.svg";
import EXCEL from "assets/excel.svg";

const props = defineProps<{
  disabled?: boolean,
  notExcel?: boolean
}>();

const emit = defineEmits(['exportFiles']);

const options = [
  {
    label: 'Exportar XML',
    value: 'XML',
    img: XML,
  },
  {
    label: 'Exportar PDF',
    value: 'PDF',
    img: PDF,
  },
  {
    label: 'Exportar CSV',
    value: 'CSV',
    img: CSV,
  },
  {
    label: 'Exportar Excel',
    value: 'Excel',
    img: EXCEL,
  },
];

const optionsExport = computed(() => {
  if (props.notExcel) {
    return options.filter(opt => opt.value !== 'Excel');
  }
  return options;
});

const handleButton = (item: string) => {
  emit('exportFiles', item);
};
</script>

<style scoped>
/* Estilos adicionales para el dropdown */
.q-btn-dropdown__arrow {
  margin-left: 8px;
}
</style>
