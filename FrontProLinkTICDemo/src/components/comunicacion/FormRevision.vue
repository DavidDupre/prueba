<template>
  <section>
    <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
      <div class="tw-bg-white q-mt-lg tw-rounded-md">
        <p class="tw-text-2xl tw-font-bold tw-pb-4 ">
          Asignar para revisión
        </p>

        <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex tw-flex-row">
          <div class="width-container tw-w-1/2 q-px-sm tw-rounded-xl" style="border: 1px solid #E3E4E5;">
            <p class="tw-text-base tw-font-bold tw-py-4">
              Seleccione usuarios que desea reasignar
            </p>
            <p class="tw-text-base tw-font-bold">
              Oficinas
            </p>
            <Search @update:value-filtered="val=>valueFiltered=val" />
            <TableAsignar
              :selectionWrapper="cardsAsignar2"
              :TABLE_BODY="listUsers"
              :TABLE_HEADER="columnsAsignar"
              @update:item-selected="handleAssign"
              row-key="id"
              :is-selection="false"
              type-selection="single"
              :can-search="false"
              :user="user"
              :editar="editar"
            />
          </div>

          <div class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl" style="border: 1px solid #e3e4e5">
            <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
              Estos son los usuarios que ha seleccionado
            </span>
            <div class="flex wrap tw-gap-3 q-pt-sm">
              <div v-for="(asign, index) in cardsAsignar" :key="index">
                <div v-if="asign.visible" class="q-px-sm tw-text-base q-py-sm tw-gap-2 flex justify-between tw-text-[#2C3948] tw-rounded-3xl" style="border: 1px solid #e3e4e5">
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

    <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
      <p class="tw-text-2xl tw-font-bold tw-pb-4 ">
        Motivo de asignación
      </p>

      <div class="col-12">
        <label class="q-px-md tw-text-label">Observaciones *
          <q-input type="textarea" outlined label="Inserte" dense emit-value v-model="formExitData.observacionesRevision"
            :rules="[inputRequired, v => maxLengthInputCustom(1000, v, 'motivo'), v => minLengthInputCustomAsignacion(10, v) ]" />
        </label>
      </div>
    </q-card>

  </section>
</template>

<script lang="ts" setup>

import { onMounted, ref, watch } from "vue";
import { inputRequired, maxLengthInputCustom,minLengthInputCustomAsignacion } from "src/helpers/validations";
import TableAsignar from "components/Tables/TableAsignr2.vue";
import Search from "components/comunicacion/SearchAsigancion.vue";
import { columnsAsignar } from "src/pages/Facturacion/cobro";
import { sgdeaAxios } from "src/services";

const props = withDefaults(defineProps<{
  dataInitial: any,
  user: any,
  editar: boolean
}>(), {
})

const rolName='Revisor'
const valueFiltered = ref('')
const formExitData = ref(props.dataInitial);
const cardsAsignar = ref([]);
const cardsAsignar2 = ref([]);

const listUsers = ref([])
const emit = defineEmits(['update:itemSelected'])

onMounted(async () => {
  await getAllRegisters()
});

const removeCardAsignar = (index) => {
  cardsAsignar.value.splice(index, 1);
  cardsAsignar2.value.splice(index, 1);
};


const mapListUsers=(data)=>{
  listUsers.value = data.map((item) => ({
    colaborador: item.firstname + ' ' + item.lastname,
    cargo: item.cargo,
    id: item.id,
    user: item.userName,
    grupo:item?.usuarioRelaciones[0]?.oficina?.nombre ?? '-'
  }))
}

async function getAllRegisters() {
  const { data } = await sgdeaAxios.get(
    `/roles/usuarios?rol=${rolName}`
  );
  mapListUsers(data)
}

const handleAssign = (array: any[]) => {
  cardsAsignar2.value = array
  cardsAsignar.value = array.map((item) => ({
    name: item.colaborador,
    oficina: item?.oficina || '-',
    visible: true,
    user: item.user
  }));
};

const getUsersByRolAndOffice=async(idOffice)=>{

  const {data}=await sgdeaAxios.get(`/api/usuarios/rolYoficina?rolName=${rolName}&oficinaId=${idOffice}`)
  mapListUsers(data)
}

watch(valueFiltered, async(newValue:any) => {


  if(newValue=== null){
    await getAllRegisters()
    return
  }
  await getUsersByRolAndOffice(newValue.value)
  // listUsers.value= listUsers.value.filter((item) => item.colaborador.toLowerCase().includes(newValue.label.toLowerCase()))
});

watch(()=>cardsAsignar2, (newValue)=>{
  emit('update:itemSelected', newValue.value[0]?.id)
}, {deep:true})

</script>
