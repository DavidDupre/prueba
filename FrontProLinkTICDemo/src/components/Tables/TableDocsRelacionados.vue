<template>
  <div>
    <q-table
      flat
      :rows="TABLE_BODY"
      :columns="columns"
      :row-key="rowKey"
      table-header-class="text-black text-h6 "
      class="sizes q-mr-md"
      rows-per-page-label="Páginas"
      :selection="isSelection ? 'multiple' : typeSelection"
      v-model:selected="selection"
    >
      <template v-slot:body-cell-formato="props">
        <q-td class="" :props="props">
          <q-avatar>
            <img style="width: 26px" v-lazy :data-url="selectIcon(props.row.formato)">
          </q-avatar>
        </q-td>
      </template>

      <template v-slot:body-cell-acciones="props">
        <q-td class="" :props="props">
          <q-avatar>
            <q-icon color="orange" name="download" class="tw-cursor-pointer" />
            <q-icon color="orange" name="print" class="tw-cursor-pointer" />
          </q-avatar>
        </q-td>
      </template>

      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
          <img v-lazy :data-url="NoData" alt="" width="120" />
          <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
            {{ msgNoData ? msgNoData : "No existe data por el momento" }}
          </span>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {  ref, watch } from "vue";
import NoData from "assets/filterImage.svg";
import PDFIcon from "src/assets/pdf.svg";
import WordIcon from "src/assets/word.svg";
const selection = ref([]);
const emit = defineEmits(["update:itemSelected"]);
const props = withDefaults(
  defineProps<{
    TABLE_BODY: any[];
    TABLE_HEADER: any[];
    itemsSelected?: any[];
    msgNoData?: string;
    text?: string;
    rowKey: string;
    isSelection: boolean;
    typeSelection: "none" | "single";
  }>(),
  {
    rowKey: "numeroTable",
    isSelection: true,
  }
);

const selectIcon = (icon) => {
  if (icon === 'pdf') {
    return PDFIcon;
  } else {
    return WordIcon;
  }
}

const columns = [
  {
    name: "formato",
    label: "Formato",
    field: "formato",
    sortable: true,
    align: "center",
  },
  {
    name: "nombre_documento",
    label: "Nombre del documento",
    field: "nombre_documento",
    sortable: true,
    align: "center",
  },
  {
    name: "tipo_documento",
    label: "Tipo de documento",
    field: "tipo_documento",
    sortable: true,
    align: "center",
  },
  {
    name: "fecha_cargue",
    label: "Fecha de cargue",
    field: "fecha_cargue",
    sortable: true,
    align: "center",
  },
  {
    name: "cargado_por",
    label: "Cargado por",
    field: "cargado_por",
    sortable: true,
    align: "center",
  },
  {
    name: "acciones",
    label: "Acciones",
    field: "acciones",
    sortable: true,
    align: "center",
  },
];

watch(selection, (newdateData) => {
  selection.value = newdateData;
  emit("update:itemSelected", selection.value);
});
</script>

<style lang="scss" scoped></style>
