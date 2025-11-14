<template>
  <div class="col-12 tw-my-3">
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

let stringOptions = []
const value=ref('')
const filterOptions = ref(stringOptions)
const emit = defineEmits(['update:valueFiltered'])

onMounted(async() => {
  stringOptions= await getOffices()
})

watch(value, (newValue) => {
  emit('update:valueFiltered', newValue)
});

function filterFn (val, update) {
  update(() => {
    if (val === '') {
      filterOptions.value = stringOptions
    }
    else {
      const needle = val.toLowerCase()
      filterOptions.value = stringOptions.filter(
        v => v.label.toLowerCase().indexOf(needle) > -1
      )
    }
  })
}

const getOffices=async()=>{
  const {data}=await sgdeaAxios.get('/oficinas/all')
  return data.map(office=>({
    value:office.id,
    label:office.nombre
  }))
}

</script>
