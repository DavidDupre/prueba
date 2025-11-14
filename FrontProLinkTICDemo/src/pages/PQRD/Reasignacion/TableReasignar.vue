<template>
  <div>
    <q-table
      flat
      :rows="filteredRows"
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
      rows-per-page-label="Páginas"
      :selection="isSelection ? 'multiple' : typeSelection"
      v-model:selected="selection"
      virtual-scroll
      :rows-per-page-options="[8]"
      @row-dblclick="handleDoubleClick"
    >
      <template v-slot:body-cell-colaborador="props">
        <td
          class="tw-text-center tw-bg-orage cursor-pointer"
          :draggable="true"
          @dragstart="dragGestor(props.row)"
        >
          {{ props.row.colaborador }}
        </td>
      </template>

      <template v-slot:top-left>
        <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
          {{ props.title }}
        </span>
        <div class="tw-flex tw-w-full tw-gap-2 tw-justify-center" >
          <div class="tw-w-[45%]" v-if="canSearch">
            <span class="tw-font-bold tw-text-label tw-w-full tw-mb-0.5">
              Filtrar por oficina
            </span>
            <q-select
              v-if="canSearch"
              :options="filteredOficinas"
              hide-selected
              fill-input
              input-debounce="0"
              use-input
              v-model="formData.Oficinas"
              class="tw-w-full"
              @filter="selectOfficeFilterFn"
              @update:model-value="filterUsersByOffice"
              outlined
              dense
              :placeholder="placeholder"
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
          </div>
          <div class="tw-w-full">
            <span class="tw-font-bold tw-text-label tw-w-full tw-mb-0.5">
              Filtrar por usuario
            </span>
            <q-select
              v-if="canUser"
              :options="filteredUsers"
              hide-selected
              fill-input
              input-debounce="0"
              use-input
              v-model="formData.Usuario"
              class="tw-w-full"
              @filter="selectUserFilterFn"
              @update:model-value="filterRows"
              outlined
              dense
              placeholder="Seleccione un usuario"
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
          </div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";

const selection = ref([]);
const emit = defineEmits([
  "update:itemSelected",
  "update:officeSelected",
  "update:dragEvent",
  "update:handleDblClickEvent",
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
    canUser: boolean
  }>(),
  {
    title: "Seleccione el usuario que desea asignar",
    rowKey: "numeroTable",
    isSelection: true,
    placeholder: "Seleccione",
    canSearch: true,
  }
);

const formData = ref({
  Oficinas: null,
  Usuario: null,
  Consolidador: "",
  Observaciones: "",
});

const rows = ref(props.TABLE_BODY);
const copyRows = ref()
const filteredRows = ref(rows.value);
const listadoOficinas = ref(props.listadoOficinas);
const filteredOficinas = ref(props.listadoOficinas);

// Create a list of users from TABLE_BODY
const users = computed(() => {
  return [...new Set(rows.value.map(row => row.colaborador))].map(user => ({
    label: user,
    value: user
  }));
});
const filteredUsers = ref(users.value);

const dragGestor = (row: any) => {
  selection.value = [];
  const newRow = { ...row, selected: true };
  selection.value.push(newRow);
  emit("update:dragEvent", row);
};

const handleDoubleClick = (_, row: any) => {
  if (row) {
    selection.value = [];
    const newRow = { ...row, selected: true };
    selection.value.push(newRow);
    emit("update:handleDblClickEvent", row);
  }
};

const selectOfficeFilterFn = (val: string, update: any) => {
  if (val === "") {
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

const selectUserFilterFn = (val: string, update: any) => {
  if (val === "") {
    update(() => {
      filteredUsers.value = users.value;
    });
    return;
  }
  update(() => {
    filteredUsers.value = users.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  });
};

const filterUsersByOffice = () => {
  if (formData.value.Oficinas) {
    const officeUsers = rows.value.filter(
      (row) => row.oficina === formData.value.Oficinas.value
    );
    filteredUsers.value = [...new Set(officeUsers.map(row => row.colaborador))].map(user => ({
      label: user,
      value: user
    }))

    filteredRows.value = officeUsers;

  } else {
    filteredUsers.value = users.value;
    filteredRows.value = rows.value;
  }
  formData.value.Usuario = null;
};

const filterRows = () => {
  let filteredByOffice = rows.value;

  if (formData.value.Oficinas) {
    filteredByOffice = rows.value.filter(
      (row) => row.oficina === formData.value.Oficinas.value
    );
  }

  if (formData.value.Usuario) {
    const filteredByUser = filteredByOffice.filter((row) => {
      return row.colaborador.includes(formData.value.Usuario.value); // Uso de `includes` para pruebas
    });
    filteredRows.value = filteredByUser;
  } else {
    filteredRows.value = filteredByOffice;
  }
};


const validado = ref(0);
watch(() => props.abogado, (newValue) => {
  if (newValue && validado.value === 0) {
    validado.value++;
    selection.value = [props.TABLE_BODY[newValue]];
  } else if (!newValue && validado.value === 1) {
    validado.value = 0;
    selection.value = [];
  }
});

watch(() => props.valueRadio, (newValue) => {
  if (newValue === "YES" && validado.value === 1) {
    selection.value = [props.TABLE_BODY[props.abogado]];
  }
});

watch(selection, (newdateData) => {
  emit("update:itemSelected", newdateData);
});

watch(
  () => formData.value.Oficinas,
  (newOffice) => {
    emit("update:officeSelected", newOffice ? newOffice.value : null);
  }
);

watch(
  () => props.listadoOficinas,
  (newListadoOficinas) => {
    listadoOficinas.value = newListadoOficinas;
    filteredOficinas.value = newListadoOficinas;
  },
  { immediate: true }
);

watch(() => props.TABLE_BODY, (newTableBody) => {
  rows.value = newTableBody;
  filteredRows.value = newTableBody;
}, { immediate: true });

watch(props.mySelection, (newValue) => {
  if (newValue) {
    filteredRows.value = rows.value.filter((row) =>
      row.colaborador.toLowerCase().includes(newValue.toLowerCase())
    );
  }
});
</script>

<style lang="scss" scoped>
/* your styles here */
</style>
