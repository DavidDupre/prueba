<template>
  <div>
    <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="rowKey" table-header-class="text-black text-h6 "
      class="sizes q-mr-md" style="margin: 0 auto; border-radius: 15px; min-height: auto; max-height: 400px "
      :filter="filterValue" rows-per-page-label="Páginas" :selection="isSelection ? 'multiple' : typeSelection"
      v-model:selected="selection" virtual-scroll :rows-per-page-options="[8]" @row-dblclick="handleDoubleClick">
      <template v-slot:body-cell-colaborador="props" :draggable="true" auto-width class="tw-bg-blue">
        <td class="tw-text-center tw-bg-blue tw-cursor-pointer" :draggable="true" @dragstart="dragGestor(props.row)">
          {{ props.row.colaborador }}
        </td>
      </template>

      <template v-slot:top>
        <span class="tw-w-full tw-text-lg tw-text-[#2C3948] tw-font-bold tw-pb-2">
          {{ props.title }}
        </span>
        <div class="tw-w-1/2">
          <span class="tw-text-[#000000b0] tw-font-semibold">
            Oficinas
          </span>
          <q-select v-if="canSearch" :options="filteredOficinas" hide-selected fill-input input-debounce="0" use-input
            v-model="formData.Oficinas" class="tw-w-full" @filter="selectOptionsFilterFn" outlined dense
            :placeholder="placeholder">
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

        <div class="tw-w-1/2">
          <span class="tw-text-[#000000b0] tw-font-semibold tw-pl-4">
            Usuarios
          </span>
          <q-select v-if="canSearch" :options="filteredUsers" hide-selected fill-input input-debounce="0" use-input
            v-model="formData.Usuarios" class="tw-w-full tw-pl-4" @filter="selectOptionsFilterUsers" outlined dense
            :placeholder="placeholder">
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

    </q-table>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUpdate, ref, watch, type Ref } from "vue";

const selection = ref([])
const emit = defineEmits(['update:itemSelected', 'update:officeSelected', 'update:dragEvent', 'update:handleDblClickEvent', 'update:userSelected'])

const props = withDefaults(defineProps<{
  TABLE_BODY: any[],
  TABLE_HEADER: any[],
  itemsSelected?: any[],
  text?: string,
  rowKey: string,
  isSelection: boolean,
  typeSelection: 'none' | 'single' | 'multiple',
  placeholder: string,
  abogado?: number,
  valueRadio?: string,
  title: string,
  canSearch?: boolean,
  listadoOficinas: any[],
  listadoUsuarios: any[],
  filtered: any[]
  mySelection: any[],
  rowGestor: Ref<any>,
}>(), {
  title: 'Seleccione los usuarios que desea reasignar al radicado',
  rowKey: 'numeroTable',
  isSelection: true,
  placeholder: 'Seleccione',
  canSearch: true,
})

const formData = ref({
  Oficinas: '',
  Usuarios: '',
  Consolidador: '',
  Observaciones: '',
})

const filterValue = ref('')
const rows = props.TABLE_BODY
const filteredRows = ref(rows)
const listadoOficinas = ref()
const listadoUsers = ref()
const filteredOficinas = ref()
const filteredUsers = ref()

watch(filterValue, (newValue) => {
  if (newValue) {
    filteredRows.value = rows.filter(row =>
      row.colaborador.toLowerCase().includes(newValue.toLowerCase())
    );
  } else {
    filteredRows.value = rows;
  }
});

watch(props.mySelection, (newValue) => {
  if (newValue) {
    filteredRows.value = rows.filter(row =>
      // @ts-expect-error
      row.colaborador.toLowerCase().includes(newValue.toLowerCase())
    );
  }
});

watch(() => props.listadoOficinas, (newListadoOficinas) => {
  listadoOficinas.value = newListadoOficinas
});

watch(() => props.listadoUsuarios, (newListadoUsuarios) => {
  listadoUsers.value = newListadoUsuarios
});

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

const selectOptionsFilterFn = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredOficinas.value = listadoOficinas.value
    })
    return
  }
  update(() => {
    filteredOficinas.value = listadoOficinas.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const selectOptionsFilterUsers = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredUsers.value = listadoUsers.value
    })
    return
  }
  update(() => {
    filteredUsers.value = listadoUsers.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

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

watch(selection, (newdateData) => {
  emit('update:itemSelected', newdateData)
});

watch(() => formData.value.Oficinas, (newOffice) => {
  formData.value.Usuarios = ''
  // @ts-ignore
  emit('update:officeSelected', newOffice.value);
});

watch(() => formData.value.Usuarios, (newUser) => {
  // @ts-ignore
  emit('update:userSelected', newUser.value);
});

</script>