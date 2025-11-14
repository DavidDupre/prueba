<template>
  <div>
    <q-table
      flat
      :rows="TABLE_BODY"
      :columns="TABLE_HEADER"
      :row-key="rowKey"
      table-header-class="text-black text-h6 "
      class="sizes q-mr-md"
      style="
        margin: 0 auto;
        border-radius: 15px;
        min-height: auto;
        max-height: 400px;
      "
      :filter="filterValue"
      rows-per-page-label="Páginas"
      :selection="isSelection ? 'multiple' : typeSelection"
      v-model:selected="selection"
      virtual-scroll
      :rows-per-page-options="[8]"
      @row-dblclick="handleDoubleClick"
    >
    <template v-slot:body-cell-colaborador="props" :draggable="true" auto-width class="tw-bg-blue">
        <td class="tw-text-center tw-bg-orage -cursor-pointer" :draggable="true" @dragstart="dragGestor(props.row)">
          {{ props.row.colaborador }}
        </td>
      </template>
      <template v-slot:top-left>
        <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
          {{ props.title }}
        </span>
        <span class="tw-mt-2 tw-font-bold tw-text-label tw-w-full tw-mb-0.5">
          Filtrar por Usuario
        </span>
        <q-select
          v-if="canSearch"
          :options="filteredOficinas"
          hide-selected
          fill-input
          input-debounce="0"
          use-input
          v-model="formData.Oficinas"
          class="tw-w-[60%]"
          @filter="selectOptionsFilterFn"
          outlined
          dense
          :placeholder="placeholder"
          disable
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>

          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No hay resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeMount,
  onBeforeUpdate,
  onMounted,
  ref,
  watch,
} from "vue";

const inputText = ref("");
const emit = defineEmits([
  "update:itemSelected",
  "update:officeSelected",
  "update:mySelection",
  'update:dragEvent', 'update:handleDblClickEvent'
]);

const props = withDefaults(
  defineProps<{
    TABLE_BODY: any[];
    TABLE_HEADER: any[];
    itemsSelected?: any[];
    text?: string;
    rowKey: string;
    isSelection: boolean;
    typeSelection: "none" | "single" | "multiple";
    placeholder: string;
    abogado?: number;
    valueRadio?: string;
    title: string;
    canSearch?: boolean;
    listadoOficinas: any[];
    filtered: any[];
    mySelection: any[];
  }>(),
  {
    title: "Seleccione los usuarios que desea asignar al radicado",
    rowKey: "numeroTable",
    isSelection: true,
    placeholder: "Seleccione",
    canSearch: true,
  }
);
const dragGestor = (row: any) => {
  selection.value = [];
  const newRow = { ...row, selected: true };
  selection.value.push(newRow);
  emit('update:dragEvent', row);
}
const selection = computed({
  get() {
    return props.mySelection;
  },
  set(value) {
    emit("update:mySelection", value);
  },
});

const formData = ref({
  Oficinas: { label: "GRUPO TUTELAS", value: 18 },
  Consolidador: "",
  Observaciones: "",
});

const filterValue = ref("");
const rows = props.TABLE_BODY;
const filteredRows = ref(rows);
const searchHelpData = rows.map((row) => {
  return { label: row.colaborador, value: row.colaborador };
});
const searchHelpDataFiltered = ref(searchHelpData);
const listadoOficinas = ref();
const filteredOficinas = ref();

watch(filterValue, (newValue) => {
  if (newValue) {
    filteredRows.value = rows.filter((row) =>
      row.colaborador.toLowerCase().includes(newValue.toLowerCase())
    );
  } else {
    filteredRows.value = rows;
  }
});

watch(
  () => props.listadoOficinas,
  (newListadoOficinas) => {
    listadoOficinas.value = newListadoOficinas;
  }
);

const reset = () => {

};

const pagination = ref({
  page: 3,
  rowsPerPage: 5,
});
const model = ref("");

const selectOptionsFilterFn = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      filteredOficinas.value = listadoOficinas.value;
    });
    return;
  }
  update(() => {
    filteredOficinas.value = listadoOficinas.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  });
};
const handleDoubleClick = (_, row: any) => {
  if (row) {
    selection.value = [];
    const newRow = { ...row, selected: true };
    selection.value.push(newRow);
    emit("update:handleDblClickEvent", row);
  }
};
const validado = ref(0);
onBeforeUpdate(() => {
  if (props.abogado && validado.value == 0) {
    validado.value++;
    selection.value = [props.TABLE_BODY[props.abogado]];
  } else if (!props.abogado && validado.value == 1) {
    validado.value = 0;
    selection.value = [];
  } else if (props.valueRadio == "YES" && validado.value == 1) {
    selection.value = [props.TABLE_BODY[props.abogado]];
  }
});
watch(selection, (newdateData) => {
  emit("update:itemSelected", newdateData);
});

watch(
  () => formData.value.Oficinas,
  (newOffice) => {
    // @ts-ignore
    emit("update:officeSelected", newOffice.value);
  }
);
</script>

<style lang="scss" scoped>
/* your styles here */
</style>
