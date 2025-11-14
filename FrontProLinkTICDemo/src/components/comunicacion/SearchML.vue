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
// import { sgdeaAxios } from "src/services";

const props = withDefaults(defineProps<{
  listUsers: any,
  dependencia: any,}>(), {})

// const rolName='Aprobador'
let stringOptions = []
const value=ref('')
const filterOptions = ref([])
const emit = defineEmits(['update:valueFiltered'])

watch(()=>props.listUsers, async (newValue) => {
  stringOptions= mapListUsers(newValue)
  filterOptions.value = [...stringOptions]
},{deep:true});

// onMounted(async() => {

//   // stringOptions= props.listUsers
//   // filterOptions.value = stringOptions
// })

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

function mapListUsers(data) {
  // const { data } = await sgdeaAxios.get(
  //   `/roles/usuarios?rol=${rolName}`
  // );

  const sortedData = data.sort((a, b) => {
    const firstNameA = a.firstname?.toLowerCase();
    const firstNameB = b.firstname?.toLowerCase();
    const lastNameA = a.lastname?.toLowerCase();
    const lastNameB = b.lastname?.toLowerCase();

    // Ordenar por firstname
    if (firstNameA < firstNameB) return -1;
    if (firstNameA > firstNameB) return 1;

    // Si los firstnames son iguales, ordenar por lastname
    if (lastNameA < lastNameB) return -1;
    if (lastNameA > lastNameB) return 1;

    return 0; // Si son iguales
  });

  return sortedData.map((item) => ({
    value: item.id,
    label: item.colaborador,
  }));
}

// watch(()=>props.dependencia, async (newValue) => {
//   value.value=''

//   if(!newValue){
//     stringOptions=await getAllRegisters()
//     return
//   }
//   const {data}=await sgdeaAxios.get(`/api/usuarios/rolYSeccionSubseccion/${newValue}?rolName=${rolName}`)
//   stringOptions = data.map((item) => ({
//     value: item.id,
//     label: item.firstname + ' ' + item.lastname,
//   }));

// },{deep:true});


</script>
