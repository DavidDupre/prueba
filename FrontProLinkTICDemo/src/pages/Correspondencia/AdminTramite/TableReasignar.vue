<template>
  <div>
    <q-table flat :rows="bodyTable" :columns="TABLE_HEADER" :row-key="rowKey" table-header-class="text-black text-h6"
      class="sizes q-mr-md" style="margin: 0 auto; border-radius: 15px; min-height: auto; max-height: 400px "
      rows-per-page-label="Páginas" :selection="isSelection ? 'multiple' : typeSelection" v-model:selected="selection"
      virtual-scroll :rows-per-page-options="[8]" @row-dblclick="handleDoubleClick">

      <template v-slot:top>
        <span class="tw-w-full tw-text-lg tw-text-[#2C3948] tw-font-bold tw-pb-2">
          {{adjustedTitle}}
        </span>

        <div class="tw-w-full">
          <span class="tw-text-[#000000b0] tw-font-semibold">
            Filtrar por Oficina
          </span>
          <q-select v-if="canSearch" :options="filteredOffices" hide-selected fill-input input-debounce="0" use-input
            v-model="formData.Oficinas" @filter="selectOptionsFilter" @update:model-value="handleTramiteChange" outlined dense :placeholder="placeholder" :disable="isAdminTramite">
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
          <span class="tw-text-[#000000b0] tw-font-semibold">
            Filtrar por Usuario
          </span>
          <q-select v-if="canSearch" :options="filteredUsuarios" hide-selected fill-input input-debounce="0" use-input
                    v-model="formData.Usuarios" class="tw-w-full" @filter="selectOptionsFilterUsers" outlined dense
                    placeholder="Buscar usuario...">
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
import {computed, onMounted, ref, watch} from "vue";
import {useAuthStore} from "stores/auth.store";
import { sgdeaAxios } from "src/services";

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
  listadoOffices: any[],
  listadoUsuarios: any[]
  isAdminTramite: boolean
  detailsRadicado?: any
}>(), {
  title: 'Seleccione la oficina que desea reasignar al proceso',
  rowKey: 'numeroTable',
  isSelection: true,
  placeholder: 'Seleccione',
  canSearch: true,
  isAdminTramite: false
})

const adjustedTitle = computed(() => {
  return props.isAdminTramite
    ? 'Seleccione el usuario que desea reasignar al proceso'
    : props.title; // Usamos el title original cuando no es admin
});

const emit = defineEmits(
  ['update:itemSelected', 'update:dragEvent', 'update:handleDblClickEvent', 'update:officeSelected', 'update:userSelected']
)

const formData = ref({
  Oficinas: '',
  Usuarios: ''
})
const auth = useAuthStore();
const listadoOficinas = ref()
const filteredOffices = ref()
const selection = ref([])
const filteredUsuarios = ref();
const listadoUsuarios = ref([]);
const bodyTable = ref(props.TABLE_BODY);
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


const handleTramiteChange = async (newValue?) => {
  const rolName =
    props.detailsRadicado.estado === "Por revisar" && props.detailsRadicado.asignador === false
      ? "Revisor"
      : props.detailsRadicado.estado === "Por aprobar" &&
        !props.detailsRadicado.asignador
      ? "Aprobador"
      : props.detailsRadicado.asignador != null && props.detailsRadicado.asignador === true
      ? "Asignador Responsable"
      : "Gestionador";

  const oficinaId = newValue?.value || props.detailsRadicado.idOficina;

  const { data } = await sgdeaAxios.get(
    `/api/usuarios/rolYoficina?rolName=${rolName}&oficinaId=${oficinaId}`
  );

  bodyTable.value = data
    .filter((item) => item.id !== auth.userInfo.userid && item.firstname + " " + item.lastname !== props.detailsRadicado.nombreUsuario)
    .map((item) => ({
      colaborador: item.firstname + " " + item.lastname,
      enabled: item.enabled,
      id: item.id,
      user: item.userName,
      cargo: rolName,
      grupo: newValue?.label || props.detailsRadicado.nombreOficina,
    }))
    .sort((a, b) => a.colaborador.localeCompare(b.colaborador));
  filteredUsuarios.value = listadoUsuarios.value.map((row) => {
    return { label: row.colaborador, value: row.id };
  });
};

watch(() => props.listadoOffices, (newListadoUsuarios) => {
  listadoOficinas.value = newListadoUsuarios

    formData.value.Oficinas = listadoOficinas.value.find(office => office.value === auth.userInfo.oficina)
    handleTramiteChange(formData.value.Oficinas);
});

watch(selection, (newdateData) => {
  emit('update:itemSelected', newdateData)
});

watch(() => formData.value.Oficinas, (newUser) => {

  // @ts-ignore
  emit('update:officeSelected', newUser.value);
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

watch(() => formData.value.Usuarios, (newUsuarios) => {

  if (newUsuarios) {
    emit('update:userSelected', newUsuarios);
  }
});

watch(() => props.listadoUsuarios, (newUsuarios) => {
  listadoUsuarios.value = newUsuarios
});


onMounted(() => {
  bodyTable.value = props.TABLE_BODY;
})
</script>
