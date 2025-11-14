<template>
  <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="rowKey" table-header-class="text-black text-h6"
    class="sizes q-mr-md" style="margin: 0 auto; border-radius: 15px; min-height: auto; max-height: 400px "
    rows-per-page-label="Páginas" :rows-per-page-options="[8, 10, 15, 20, 25, 50, 0]" :pagination="pagination"
    v-model:selected="selection" virtual-scroll :selection="isSelection ? 'multiple' : typeSelection"
    @row-dblclick="handleDoubleClick">
    <template v-slot:body-cell-colaborador="props" auto-width class="tw-bg-blue" :draggable="true">
      <td class="tw-text-center tw-bg-blue tw-cursor-pointer" :draggable="true" @dragstart="dragGestor(props.row)">
        {{ props.row.colaborador }}
      </td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { onBeforeUpdate, ref, watch } from "vue";

const selection = ref([])
const emit = defineEmits(['update:itemSelected', 'update:dragEvent', 'update:handleDblClickEvent'])

const props = withDefaults(defineProps<{
  TABLE_BODY: any[],
  TABLE_HEADER: any[],
  itemsSelected?: any[],
  text?: string,
  rowKey: string,
  abogado?: number,
  isSelection?: boolean,
  typeSelection?: 'none' | 'single',
  placeholder?: string,
  editar?: boolean,
  valueRadio?: string,
}>(), {
  rowKey: 'numeroTable',
  isSelection: true,
  placeholder: 'Busque por dependencia del proceso',
  editar: false
})

const pagination = ref({
  page: 1,
  rowsPerPage: 8,
  sortBy: 'colaborador',
})

const filterValue = ref('')
const rows = props.TABLE_BODY
const filteredRows = ref(rows)

watch(filterValue, (newValue) => {

  if (newValue) {
    filteredRows.value = rows.filter(row =>
      row.colaborador.toLowerCase().includes(newValue.toLowerCase())
    );
  } else {
    filteredRows.value = rows;
  }
});

const validado = ref(0)
onBeforeUpdate(() => {
  if (props.abogado && validado.value == 0) {
    validado.value++
    selection.value = [props.TABLE_BODY[props.abogado]];
  } else if (!props.abogado && validado.value == 1) {
    validado.value = 0
    selection.value = []
  } else if (props.valueRadio == 'YES' && validado.value == 1) {
    selection.value = [props.TABLE_BODY[props.abogado]];
  }
})

const dragGestor = (row: any) => {
  selection.value = [];
  const newRow = { ...row, selected: true };
  selection.value.push(newRow);
  emit('update:dragEvent', row);
}

const handleDoubleClick = (_, row: any) => {
  if (row) {
    selection.value = [];
    const newRow = { ...row, selected: true };
    selection.value.push(newRow);
    emit('update:handleDblClickEvent', row);
  }
}

watch(selection, (newdateData) => {
  emit('update:itemSelected', newdateData)
});

</script>
