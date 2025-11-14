<template>
  <div>
    <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="rowKey" table-header-class="text-black text-h6 "
      class="sizes q-mr-md" style="margin: 0 auto; border-radius: 15px; min-height: auto; max-height: 400px "
      :filter="filterValue" rows-per-page-label="Páginas" :selection="isSelection ? 'multiple' : typeSelection"
      v-model:selected="selection" virtual-scroll :pagination="pagination"
      :rows-per-page-options="[8, 10, 15, 20, 25, 50, 0]">

      <template v-slot:top-left>
        <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
          {{ props.title }}
        </span>
        <q-select v-if="canSearch" :options="filteredOficinas" hide-selected fill-input input-debounce="0" use-input
          v-model="formData.Oficinas" class="tw-w-full tw-pt-3" @filter="selectOptionsFilterFn" outlined dense clearable
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
      </template>

    </q-table>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUpdate, onMounted, ref, watch } from "vue";

const selection = ref([])
const emit = defineEmits(['update:itemSelected', 'update:officeSelected'])

const props = withDefaults(defineProps<{
  TABLE_BODY: any[],
  TABLE_HEADER: any[],
  itemsSelected?: any[],
  text?: string,
  rowKey: string,
  isSelection: boolean,
  typeSelection: 'none' | 'single' | 'multiple',
  placeholder: string,
  title: string,
  canSearch?: boolean,
  listadoOficinas: any[],
  mySelection: any[],
  user?: any,
  mode?: string
}>(), {
  title: 'Seleccionar los aprobadores',
  rowKey: 'numeroTable',
  isSelection: true,
  placeholder: 'Busque por nombre de usuario',
  canSearch: true,
  mode: 'Crear'
})

const formData = ref({
  Oficinas: '',
  Consolidador: '',
  Observaciones: '',
})

const filterValue = ref('')
const rows = props.TABLE_BODY
const filteredRows = ref(rows)
const listadoOficinas = ref()
const initialSet = ref(false)
const filteredOficinas = ref()

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
      row.colaborador.toLowerCase().includes(newValue.toLowerCase())
    );
  }
});

watch(() => props.listadoOficinas, (newListadoOficinas) => {
  selection.value = []
  formData.value.Oficinas = ''
  listadoOficinas.value = newListadoOficinas.map((it: any) => {
    return {
      label: it.colaborador,
      value: it.colaborador
    }
  })
});

const pagination = ref({
  page: 1,
  rowsPerPage: 8,
  sortBy: 'colaborador',
})

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

onBeforeUpdate(() => {
  if (props.mode == 'Editar') {
    const userTable = props.TABLE_BODY.find(it => it.id == props.user)
    if (userTable !== selection.value[0] && !initialSet.value) {
      selection.value = [userTable]
      initialSet.value = true
    }
  }
})

onMounted(() => {
  listadoOficinas.value = props.listadoOficinas.map((it: any) => {
    return {
      label: it.colaborador,
      value: it.colaborador
    }
  })
})

watch(selection, (newdateData) => {

  emit('update:itemSelected', newdateData)
});


watch(() => formData.value.Oficinas, (newOffice) => {
  // @ts-ignore
  if (!newOffice) {
    emit('update:officeSelected', '');
    return
  }

  // @ts-expect-error
  emit('update:officeSelected', newOffice.value);
});

</script>
