<template>
  <div>
    <div class="tw-p-3" v-if="!props.reasignar">
      <p class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold tw-mb-3">
        {{ props.title }}
      </p>
      <p class="tw-text-[#000000b0] tw-font-semibold">
        Filtrar por Dependencia
      </p>

      <q-select v-if="canSearch" :options="filteredDependencias" hide-selected fill-input input-debounce="0"
        use-input v-model="formData.Dependencias" class="tw-w-full tw-px-0 tw-mb-3" @filter="selectOptionsFilterDpn" outlined dense
        :placeholder="placeholder">
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-select>

      <div>
        <p class="tw-text-[#000000b0] tw-font-semibold">
          Filtrar por Oficina
        </p>
        <q-select v-if="canSearch" :options="filteredOficinas" hide-selected fill-input input-debounce="0"
                  use-input v-model="formData.Oficinas" class="tw-w-full tw-px-0" @filter="selectOptionsFilterFn" outlined dense
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

    </div>
    <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="rowKey" table-header-class="text-black text-h6"
      class="sizes q-mr-md" style="margin: 0 auto; border-radius: 15px; min-height: auto; max-height: 400px;"
      :filter="filterValue" rows-per-page-label="Páginas" :selection="isSelection ? 'multiple' : typeSelection"
      v-model:selected="selection" virtual-scroll :rows-per-page-options="[8]"  @row-dblclick="handleDoubleClick"
      v-if="!isDifferentOffice"
    >

      <template v-slot:body-cell-colaborador="props" :draggable="true" auto-width class="tw-bg-blue" >
        <td  class="tw-text-center tw-bg-blue tw-cursor-pointer" :draggable="true" @dragstart="dragGestor(props.row)" >
          {{ props.row.colaborador }}
        </td>
      </template>

      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            No hay resultados
          </q-item-section>
        </q-item>
      </template>
    </q-table>

    <q-table v-if="isDifferentOffice"
      flat :rows="TABLE_BODY_OFFICES" :columns="TABLE_HEADER_OFFICES" row-key="label" table-header-class="text-black text-h6"
      class="sizes q-mr-md" style="margin: 0 auto; border-radius: 15px; min-height: auto; max-height: 400px;"
      rows-per-page-label="Páginas" selection="multiple" v-model:selected="selection" virtual-scroll :rows-per-page-options="[8]"
       @row-dblclick="handleDoubleClick">
      <template v-slot:body-cell-label="props" :draggable="true" class="tw-bg-blue" >
        <td  class="tw-text-center tw-bg-blue tw-cursor-pointer" :draggable="true" @dragstart="dragGestor(props.row)" >
          {{ props.row.label }}
        </td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {onBeforeUpdate, ref, computed, watch, type Ref, onMounted} from "vue";
import {useAuthStore} from "stores/auth.store";

const selection = ref([])
const inputText = ref('')
const auth = useAuthStore();
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
  listadoDependencias: any[],
  listadoUsuarios: any[],
  filtered: any[]
  mySelection: any[],
  rowGestor: Ref<any>,
  estado?: number,
  reasignar?: boolean,
  usuarioOficina: any,
}>(), {
  title: 'Seleccione los usuarios que desea asignar al radicado',
  rowKey: 'numeroTable',
  isSelection: true,
  placeholder: 'Seleccione',
  canSearch: true,
  estado: 0,
  reasignar: false
})


const TABLE_HEADER_OFFICES = [
  {
    name: "label",
    label: "Oficinas",
    field: "label",
    sortable: true,
    align: "left",
  },
]

const formData = ref({
  Dependencias: '',
  Oficinas: '',
  Consolidador: '',
  Observaciones: '',
  Usuarios: ''
})

const filterValue = ref('')
const rows = props.TABLE_BODY
const filteredRows = ref(rows)
const searchHelpData = rows.map((row) => { return { label: row.colaborador, value: row.colaborador } })
const searchHelpDataFiltered = ref(searchHelpData)
const listadoOficinas = ref([]);
const listadoUsuarios = ref([]);
const listadoDependencias = ref([]);
const filteredDependencias = ref()
const filteredOffices = ref();
const filteredUsuarios = ref();
const filteredOficinas = ref();
const isDifferentOffice = ref(false);
const isDifferentDependency = ref(false);
const TABLE_BODY_OFFICES = ref([]);


watch(() => formData.value.Dependencias, (newDependencia, oldDependencia) => {
  isDifferentOffice.value = true;
  if (newDependencia !== oldDependencia) {
    formData.value.Oficinas = '';
    filterValue.value = '';
    filteredRows.value = rows;
    filteredOficinas.value = listadoOficinas.value.filter(
      oficina => oficina.dependencia === newDependencia.value
    );
    TABLE_BODY_OFFICES.value = filteredOficinas.value.filter(
      oficina => oficina.value !== auth.userInfo.oficina
    );
    emit('dependencia-selected', newDependencia);
  }
});

watch(() => formData.value.Oficinas, (newOffice) => {
  if (newOffice) {
    isDifferentOffice.value = newOffice?.value && newOffice.value !== auth.userInfo.oficina;
    TABLE_BODY_OFFICES.value = listadoOficinas.value.filter(
      oficina => oficina.value === newOffice.value
    );

    // @ts-ignore
    emit('update:officeSelected', newOffice.value);
  }
});


watch(() => formData.value.Usuarios, (newUsuarios) => {
  if (newUsuarios) {
    emit('update:userSelected', newUsuarios);
  }
});

watch(filterValue, (newValue) => {
  if (newValue) {
    filteredRows.value = rows.filter(row =>
      row.colaborador.toLowerCase().includes(newValue.toLowerCase())
    );
  } else {
    filteredRows.value = rows;
  }
});

watch(() => props.listadoOficinas, (newListadoOficinas) => {
  listadoOficinas.value = newListadoOficinas.filter(oficina => oficina.value !== 13) // Omitir Mesa Back de Medicina Laboral
});

watch(() => props.TABLE_BODY, () => {
  formData.value.Usuarios = null;
});

watch(() => props.listadoUsuarios, (newUsuarios) => {
  listadoUsuarios.value = newUsuarios
});


watch(() => props.listadoDependencias, (newListadoDependencias) => {
  listadoDependencias.value = newListadoDependencias
});


const pagination = ref({
  page: 3,
  rowsPerPage: 5,
})
const model = ref('')

const dragGestor = (row: any) => {
  const newRow = { ...row, selected: true };
  selection.value.push(newRow);
  emit('update:dragEvent', row);
}

const handleDoubleClick = (_, row: any) => {
  if (row) {
    selection.value = [row];
    emit('update:handleDblClickEvent', row);
  }
}


const selectOptionsFilterFn = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredOficinas.value = listadoOficinas.value.filter(oficina =>
        oficina.dependencia === formData.value.Dependencias.value
      );
    })
    return
  }
  update(() => {
    filteredOficinas.value = listadoOficinas.value
      .filter(oficina =>
        oficina.dependencia === formData.value.Dependencias.value
      )
      .filter((option) => {
        return option.label.toLowerCase().includes(val.toLowerCase()
      );
    });
  });
};

const selectOptionsFilterDpn = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredDependencias.value = listadoDependencias.value
    })
    return
  }
  update(() => {
    filteredDependencias.value = listadoDependencias.value.filter((option) => {
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

const selectOptionsFilterUsers = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredUsuarios.value = listadoUsuarios.value
    })
    return
  }
  update(() => {
    filteredUsuarios.value = listadoUsuarios.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const selectOptionsFilter = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredOffices.value = listadoOficinas.value
    })
    return
  }
  update(() => {
    filteredOffices.value = listadoOficinas.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

</script>

<style lang="scss" scoped>
/* your styles here */
</style>
