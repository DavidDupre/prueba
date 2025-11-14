<template>

  <section>
    <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
      <div class="tw-bg-white q-mt-lg tw-rounded-md">

        <p class="tw-text-2xl tw-font-bold tw-pb-4 ">
          Funcionarios Aprobadores
        </p>

        <Search @update:value-filtered="val => valueFiltered = val" ref="searchInput" />

        <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex tw-flex-row">
          <div class="width-container tw-w-1/2 q-px-sm tw-rounded-xl" style="border: 1px solid #E3E4E5;">
            <p class="tw-text-lg tw-font-bold tw-pb-4 ">
              Seleccione el usuario que desea asignar
            </p>
            <TableAsignar :selectionWrapper="cardsAsignar2" :TABLE_BODY="listUsers" :TABLE_HEADER="columnsAsignar"
              @update:item-selected="handleAssign" row-key="id" :is-selection="true" type-selection="single"
              :can-search="false" />
          </div>

          <div class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl" style="border: 1px solid #e3e4e5">
            <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
              Este es el usuario que ha seleccionado
            </span>
            <div class="flex wrap tw-gap-3 q-pt-sm">
              <div v-for="(asign, index) in cardsAsignar" :key="index">
                <div v-if="asign.visible"
                  class="q-px-sm tw-text-base q-py-sm tw-gap-2 flex justify-between tw-text-[#2C3948] tw-rounded-3xl"
                  style="border: 1px solid #e3e4e5">
                  <q-icon size="24px" name="person_outline" />
                  {{ asign.name }}
                  <q-icon class="tw-cursor-pointer" size="24px" name="close" @click="removeCardAsignar(index)" />
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
  </section>
</template>

<script lang="ts" setup>

import { onBeforeMount, onMounted, ref, watch } from "vue";
import { inputRequired, maxLengthInputCustom, minLengthInputCustomAsignacion } from "src/helpers/validations";
import TableAsignar from "components/Tables/TableAsignr2.vue";
import Search from "components/comunicacion/radicacion/Search.vue";
import { columnsAsignar } from "src/pages/Facturacion/cobro";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";

const valueFiltered = ref('')
const cardsAsignar = ref([]);
const cardsAsignar2 = ref([]);
const searchInput = ref()
const auth = useAuthStore()
const listUsers = ref([])
const emit = defineEmits(['update:itemSelected'])


onBeforeMount(async () => {
  await getAllRegisters()
});

const removeCardAsignar = (index) => {
  cardsAsignar.value.splice(index, 1);
  cardsAsignar2.value.splice(index, 1);
};

async function getAllRegisters() {
  const oficinaUser = auth.userInfo.oficina
  const dependenciaUser = auth.userInfo.dependencia

  let data

  if (oficinaUser) {

    data = await sgdeaAxios.get(`/api/usuarios/rolYoficina?rolName=Aprobador`);

  } else {


    data = await sgdeaAxios.get(`/api/usuarios/rolesYSeccionSubseccion/${dependenciaUser}?rolNames=Aprobador`);

  }

 listUsers.value = data.data
  .map((item) => {
    const relacionAprobador = item.usuarioRelaciones.find(
      (rel) => rel.rol?.nombre === 'Aprobador'
    );

    if (!relacionAprobador) return null;

    return {
      colaborador: item.firstname + ' ' + item.lastname,
      cargo: item.cargo?.nombre,
      id: item.id,
      user: item.userName,
      grupo:
        relacionAprobador.oficina?.nombre ??
        relacionAprobador.seccionSubSeccion?.nombre ??
        '',
    };
  })
  .filter(Boolean);


}

const handleAssign = (array: any[]) => {
  cardsAsignar2.value = array
  cardsAsignar.value = array.map((item) => ({
    name: item.colaborador,
    oficina: item?.oficina || '-',
    visible: true,
    user: item.user
  }));
  searchInput.value.clearInput()
};

watch(valueFiltered, async (newValue: any) => {
  if (newValue === null) {
    await getAllRegisters()
    return
  }
  listUsers.value = listUsers.value.filter((item) => item.colaborador.toLowerCase().includes(newValue.label.toLowerCase()))
});

watch(() => cardsAsignar2, (newValue) => {
  const ids = newValue.value.map(item => item.id);
  emit('update:itemSelected', ids)
}, { deep: true })



</script>
