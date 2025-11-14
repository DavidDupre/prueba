<template>
  <div>
    <q-table
      flat
      :rows="TABLE_BODY"
      :columns="TABLE_HEADER"
      :row-key="rowKey"
      table-header-class="text-black text-h6 "
      class="sizes q-mr-md tableclass"
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
      color="primary"
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
        <q-select
          v-if="canSearch"
          :options="searchHelpDataFiltered"
          hide-selected
          use-input
          v-model="formData.usuario"
          class="tw-w-full tw-pl-2"
          @filter="selectOptionsFilterFn"
          outlined
          dense
          :placeholder="placeholder"
          map-options
          emit-value
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
import { Ref, onBeforeUpdate, onMounted, ref, watch } from "vue";

const selection = ref([]);
const emit = defineEmits(["update:itemSelected", "update:userSelected",'update:handleDblClickEvent','update:dragEvent']);

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
  }>(),
  {
    title: "Seleccione el usuario que desea asignar al radicado",
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
const formData = ref({
  Oficinas: "",
  Consolidador: "",
  Observaciones: "",
  usuario: "",
});

const filterValue = ref("");
const rows = props.TABLE_BODY;
const filteredRows = ref(rows);
const searchHelpData = ref(
  props.TABLE_BODY.map((row) => ({
    label: row.colaborador,
    value: row.colaborador,
  }))
);
const searchHelpDataFiltered: Ref<{ label: string; value: string }[]> = ref([]);
const listadoOficinas = ref([]);
const filteredOficinas = ref();

const handleDoubleClick = (_, row: any) => {
  if (row) {
    selection.value = [];
    const newRow = { ...row, selected: true };
    selection.value.push(newRow);
    emit('update:handleDblClickEvent', row);
  }
};

onMounted(() => {
  searchHelpData.value = props.TABLE_BODY.map((row) => ({
    label: row.colaborador,
    value: row.colaborador,
  }));
  searchHelpDataFiltered.value = searchHelpData.value;
});

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

const selectOptionsFilterFn = (val: string, update: any) => {
  const oficinasEmpty = listadoOficinas.value.length == 0;

  if (val == "") {
    update(() => {
      if (oficinasEmpty) {
        searchHelpDataFiltered.value = searchHelpData.value;
        return;
      }

      filteredOficinas.value = listadoOficinas.value;
    });

    return;
  }
  update(() => {
    if (oficinasEmpty) {
      searchHelpDataFiltered.value = searchHelpData.value.filter((option) =>
        option.label.toLowerCase().includes(val.toLowerCase())
      );
      return;
    }
    filteredOficinas.value = listadoOficinas.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  });
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

watch(
  () => props.TABLE_BODY,
  (newData) => {
    searchHelpData.value = newData.map((row) => ({
      label: row.colaborador,
      value: row.colaborador,
    }));
    searchHelpDataFiltered.value = searchHelpData.value;
  }
);

watch(selection, (newdateData) => {
  emit("update:itemSelected", newdateData);
});

watch(
  () => formData.value.usuario,
  (newUser) => {
    // @ts-ignore
    emit("update:userSelected", newUser);
    selection.value = [
      props.TABLE_BODY.find((item) => item.colaborador === newUser),
    ];
  }
);
</script>

<style lang="scss" scoped>
.tableclass ::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

.tableclass ::-webkit-scrollbar-thumb {
  background-color: #ffa51e;
  width: 5px;
}

.tableclass ::-webkit-scrollbar-track {
  background-color: #ecf0f1;
}
</style>
