<template>
  <section>
    <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
      <div class="tw-bg-white q-mt-lg tw-rounded-md">
        <p class="tw-text-2xl tw-font-bold tw-pb-4 ">
          Asignar para enviar a revisión
        </p>

        <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex tw-flex-row">
          <div class="width-container tw-w-1/2 q-px-sm tw-rounded-xl" style="border: 1px solid #E3E4E5;">
            <p class="tw-text-base tw-font-bold tw-py-4">
              Seleccionar los usuarios que desea asignar
            </p>
            <p class="tw-text-sm tw-font-bold tw-mt-3">
              Nombre funcionario
            </p>
            <Search :list-users="originalListUsers" :dependencia="form.dependencieType"
              @update:value-filtered="val => valueFiltered = val" />

            <TableAsignar :TABLE_BODY="listUsers" :TABLE_HEADER="columnsAsignar" @update:item-selected="handleAssign"
              row-key="id" :is-selection="false" type-selection="single" :can-search="false" :editar="editar"
              @update:dragEvent="dragGestor" @update:handleDblClickEvent="handleDoubleClickEvent" />
          </div>

          <div class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl" style="border: 1px solid #e3e4e5"
            @dragover.prevent @drop="dropGestor()">
            <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
              Estos son los usuarios que ha seleccionado
            </span>
            <div class="flex wrap tw-gap-3 q-pt-sm">
              <div v-for="(asign, index) in cardsAsignar" :key="index">
                <div v-if="asign.visible"
                  class="q-px-sm tw-text-base q-py-sm tw-gap-2 flex justify-between tw-text-[#2C3948] tw-rounded-3xl"
                  style="border: 1px solid #e3e4e5">
                  <q-icon size="24px" name="person_outline" />
                  {{ asign.name }}
                  <q-icon class="tw-cursor-pointer" size="24px" name="close" @click="removeCardAsignar(asign.user)" />
                </div>
              </div>
              <div v-if="cardsAsignar.length === 0" class="tw-text-red-500 text-weight-bold">
                Debe seleccionar al menos un usuario
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card>

    <!-- <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
      <p class="tw-text-2xl tw-font-bold tw-pb-4 ">
        Motivo de asignación
      </p>
      <div class="col-12">
        <label class="q-px-md tw-text-label">Observaciones *
          <q-input type="textarea" outlined label="Inserte" dense emit-value
            v-model="formExitData.observacionesRevision"
            :rules="[inputRequired, v => maxLengthInputCustom(1000, v, 'campo'), v => minLengthInputCustomAsignacion(10, v, 'campo')]" />
        </label>
      </div>
    </q-card> -->
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { inputRequired, maxLengthInputCustom, minLengthInputCustomAsignacion } from "src/helpers/validations";
import TableAsignar from "components/Tables/TableAsignr2.vue";
import Search from "components/comunicacion/SearchML.vue";
import { columnsAsignar } from "src/pages/Facturacion/cobro";
import { sgdeaAxios } from "src/services";
import { useCrearComunicacionesLogic } from "src/pages/Correspondencia/Crear/CrearComunicaciones/CrearComunicaciones.Logic";
import { useAuthStore } from "src/stores/auth.store";

const props = withDefaults(defineProps<{
  dataInitial: any,
  aprobador?: any,
  editar?: boolean,
}>(), {
})

const auth = useAuthStore()
const form = ref({
  dependencieType: '',
})
const tableSelection = ref([])
const valueFiltered = ref('')
const formExitData = ref(props.dataInitial);
const cardsAsignar = ref([]);
const dependenciesTypesOptionsStatic = ref([])
const listadoOficinas = ref([])
const originalListUsers = ref([])
const listUsers = ref([])
const rowGestor = ref()
const emit = defineEmits(['update:itemSelected'])

onMounted(async () => {
  const { getDependenciesTypesOptions2 } = useCrearComunicacionesLogic();
  loadOficinas()
  dependenciesTypesOptionsStatic.value = await getDependenciesTypesOptions2();
  getAllRegisters()
});

const loadOficinas = async () => {
  const response = await sgdeaAxios.get('oficinas/all')
  listadoOficinas.value = response.data.map((e) => {
    return {
      label: e.nombre,
      value: e.id,
    }
  })
  listadoOficinas.value = listadoOficinas.value.filter((e) => { return e.value !== 26 })
}

const dragGestor = (row: any) => {
  rowGestor.value = row
}

const dropGestor = () => {
  const user = listUsers.value.find(element => element.id === rowGestor.value.id);
  const isCardsAsignarEmpty = !cardsAsignar.value.find(element => element.user === user.id)
  if (user && isCardsAsignarEmpty) {
    cardsAsignar.value.push({
      user: user.id,
      name: user.colaborador,
      cargo: user.cargo,
      oficinaId: user.oficinaId,
      visible: true,
    })
  }
}

const handleDoubleClickEvent = (row: any) => {
  const user = listUsers.value.find(element => element.id === row.id);
  const isCardsAsignarEmpty = !cardsAsignar.value.find(element => element.user === user.id)
  if (user && isCardsAsignarEmpty) {
    cardsAsignar.value.push({
      user: user.id,
      name: user.colaborador,
      cargo: user.cargo,
      oficinaId: user.oficinaId,
      visible: true,
    })
  }
}

const removeCardAsignar = (user) => {
  const indexSelection = tableSelection.value.findIndex(item => item.id == user)
  tableSelection.value.splice(indexSelection, 1)
  const newCardsAsignar = cardsAsignar.value.filter(card => card.user !== user);
  cardsAsignar.value = newCardsAsignar;
};

const mapListUsers = (data) => {
  return data.map((item) => ({
    colaborador: item.firstname + ' ' + item.lastname,
    cargo: item.cargo?.nombre,
    id: item.id,
    user: item.userName,
    oficinaId: item?.usuarioRelaciones[0]?.oficina?.id,
    grupo: item?.usuarioRelaciones[0]?.oficina?.nombre ?? '-'
  }))
}

async function getAllRegisters() {
  try {
    const response = await sgdeaAxios.get(`/api/usuarios/rolYoficina`, { params: { rolName: "Revisor" } })
    const users = response.data
    const res = mapListUsers(users)
    listUsers.value = [...res]
    originalListUsers.value = [...res]
  } catch (error) {
    listUsers.value = []
    originalListUsers.value = []
  }
}

const handleAssign = (array: any[]) => {

  if (array.length === 0) {
    cardsAsignar.value = [];
    tableSelection.value = []
  } else {
    cardsAsignar.value = array.map((item) => ({
      name: item.colaborador,
      oficinaId: item.oficinaId,
      oficina: item.grupo,
      visible: true,
      user: item.id
    }));
    tableSelection.value = array

    if (array.length > 0) {
      tableSelection.value = array
    }
  }
};

watch(valueFiltered, async (newValue: any) => {
  if (!newValue) {
    listUsers.value = originalListUsers.value
    return
  }
  listUsers.value = listUsers.value.filter((item) => item.colaborador.toLowerCase().includes(newValue.label.toLowerCase()))
});

watch(() => cardsAsignar.value, (newValue) => {
  emit('update:itemSelected', newValue[0])
}, { deep: true })

</script>
