<template>
  <div class="col-12 tw-px-6 tw-mb-3">
    <div class="tw-w-full">
      <q-select label="Filtrar" dense clearable :use-input="!value" @filter="filterFn" :options="filterOptions" v-model="value"  class="tw-w-full tw-rounded-lg" rounded outlined>
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

<script setup lang="ts">
import { watch, ref, onMounted } from 'vue';
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";

interface Office {
  id: number,
  nombre: string,
  dependencia: number
}

const auth = useAuthStore()
const stringOptions = ref([])
const value=ref('')
const filterOptions = ref(stringOptions)
const emit = defineEmits(['update:valueFiltered'])

onMounted(()=>{
  getAprobadores()
})

watch(value, (newValue) => {
  emit('update:valueFiltered', newValue)
});

function filterFn (val, update) {

  if (val === '') {
    update(() => {
      filterOptions.value = stringOptions.value
    })
  }
  else {
    update(() => {
      const needle = val.toLowerCase()
      filterOptions.value = stringOptions.value.filter(
        v => v.label.toLowerCase().indexOf(needle) > -1
      )
    })
  }
}

function clearInput() {
  value.value = null
}

defineExpose({
  clearInput
})

const getAprobadores = async () => {
  const oficinaUser = auth.userInfo.oficina
  let data

  if (oficinaUser) {

    data = await sgdeaAxios.get(`/api/usuarios/rolYoficina?rolName=Aprobador`);

  } else {
    const dependenciaUser = auth.userInfo.dependencia

    data = await sgdeaAxios.get(`/api/usuarios/rolesYSeccionSubseccion/${dependenciaUser}?rolNames=Aprobador`);

  }

  stringOptions.value= data.data.map((aprobador:any)=>({
    value: aprobador.id,
    label: aprobador.firstname + ' ' + aprobador.lastname,
  }))
}

</script>
