<template>
  <div>
    <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="rowKey" table-header-class="text-black text-h6"
      class="sizes q-mr-md" style="margin: 0 auto; border-radius: 15px; min-height: auto; max-height: 400px "
      rows-per-page-label="Páginas" :selection="isSelection ? 'multiple' : typeSelection" v-model:selected="selection"
      virtual-scroll :rows-per-page-options="[8]" @row-dblclick="handleDoubleClick">

      <template v-slot:top>
        <span class="tw-w-full tw-text-lg tw-text-[#2C3948] tw-font-bold tw-pb-2">
          {{ props.title }}
        </span>

        <div class="tw-w-full">
          <span class="tw-text-[#000000b0] tw-font-semibold">
            Filtrar por Oficina
          </span>
          <q-select v-if="canSearch" :options="filteredOffices" hide-selected fill-input input-debounce="0" use-input
            v-model="formData.Oficinas" @filter="selectOptionsFilter" outlined dense :placeholder="placeholder">
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
        </div>
      </template>

      <template v-slot:body-cell-oficinas="props" :draggable="true">
        <td class="tw-cursor-pointer !tw-text-left" :draggable="true" @dragstart="dragGestor(props.row)">
          {{ props.row.oficinas }}
        </td>
      </template>

    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = withDefaults(defineProps<{
  TABLE_BODY: any[],
  TABLE_HEADER: any[],
  itemsSelected?: any[],
  text?: string,
  rowKey: string,
  isSelection: boolean,
  typeSelection: 'none' | 'single' | 'multiple',
  placeholder: string,
  valueRadio?: string,
  title: string,
  canSearch?: boolean,
  listadoOffices: any[]
}>(), {
  title: 'Seleccione la oficina que desea reasignar al proceso',
  rowKey: 'numeroTable',
  isSelection: true,
  placeholder: 'Seleccione',
  canSearch: true,
})

const emit = defineEmits(
  ['update:itemSelected', 'update:dragEvent', 'update:handleDblClickEvent', 'update:officeSelected']
)

const formData = ref({
  Oficinas: '',
})

const listadoOficinas = ref()
const filteredOffices = ref()
const selection = ref([])

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

const selectOptionsFilter = (val: string, update: any) => {
  if (val === '') {
    update(() => {
      filteredOffices.value = listadoOficinas.value
    });
    return;
  }

  update(() => {
    filteredOffices.value = listadoOficinas.value.filter(option =>
      option.label?.toLowerCase().includes(val.toLowerCase())
    );
  });
};

watch(() => props.listadoOffices, (newListadoUsuarios) => {
  listadoOficinas.value = newListadoUsuarios
});

watch(selection, (newdateData) => {
  emit('update:itemSelected', newdateData)
});

watch(() => formData.value.Oficinas, (newUser) => {
  if (newUser && typeof newUser === 'object') {
    emit('update:officeSelected', {
      value: newUser.value,
      label: newUser.label
    });
  } else {
    emit('update:officeSelected', null); // fallback para limpiar
  }
});

</script>
