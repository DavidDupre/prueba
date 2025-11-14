<template>
  <q-select
    outlined
    dense
    v-model="selectData"
    use-input
    hide-selected
    fill-input
    input-debounce="0"
    :options="options"
    @filter="filterFn"
    label="Búsqueda"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          No se encontro
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { sgdeaAxios } from "src/services";
import { onMounted, ref, watch, computed } from "vue";


interface dataSelect {
  label: string,
  value: number
}
const datatemp: dataSelect[]=[]

const props = defineProps<{
  tvd: {
    type: Boolean,
    default: false,
  },
  inputDataProp: any,
}>()

const opcionDependencia = ref([])
const valorSeleccionado = ref<string | null>(null);
const options = ref([])

const emit = defineEmits(['handleSelect', 'update:inputDataProp'])

const selectData = computed({
  get() {
    return props.inputDataProp
  },
  set(value) {
    emit('update:inputDataProp', value)
  }
})

onMounted(async () => {
  if (props.tvd){
    await loadDataFiltroTvd();
  }else {
    await loadDataFiltro();
  }

});


const filterFn  = (val, update, abort) =>  {
  update(() => {
    const needle = val.toLowerCase()
    options.value = opcionDependencia.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}

async function loadDataFiltro() {

  const {data}  = await sgdeaAxios.get("/seccionSubSeccion");

  const padres = ref([])

  padres.value = [...padres.value,...data?.filter((val:any)=>val.padre==null).map((val:any)=>{
    return{
      label: val.codigo + " - " + val.nombre,
      value: val.idSeccionSubSeccion
    }
  })]

  padres.value.forEach(async (val:any)=>{
    await createList(val.label, val.value)
  })
}

async function createList(labelIn: string, valueIn: number, padre: string=""){

  opcionDependencia.value = []

  let temp: dataSelect = {
    label: padre + labelIn,
    value: valueIn
  }

  datatemp.push(temp)

  const children  = await sgdeaAxios.get(`/seccionSubSeccion/selectByIdPadre?idPadre=${valueIn}`);

  children.data.forEach(async (val:any)=>{
    await createList(await val.codigo + " - " + await val.nombre, await val.idSeccionSubSeccion, padre + labelIn + " > ")
  })

  opcionDependencia.value = [...opcionDependencia.value, ...datatemp.map((val:any)=>{
    return{
      label: val.label,
      value: val.value
    }
  })]
}

async function loadDataFiltroTvd() {

  const {data}  = await sgdeaAxios.get("/tvd/dependencias");
  const padres = ref([])

  padres.value = [...padres.value,...data?.filter((val:any)=>val.padre==null).map((val:any)=>{
    return{
      label: val.nombre,
      value: val.idSeccionsubseccion
    }
  })]

  padres.value.forEach(async (val:any)=>{
    await createListTvd(val.label, val.value)
  })
}

async function createListTvd(labelIn: string, valueIn: number, padre: string=""){
  opcionDependencia.value = []

  let temp: dataSelect = {
    label: padre + labelIn,
    value: valueIn
  }

  datatemp.push(temp)

  const children  = await sgdeaAxios.get(`tvd/subdependencia/id/dependenciatvd/${valueIn}`);
  if (children.data.length > 0){
    children.data.forEach(async (val:any)=>{
      await createListTvd(await val.nombre, await val.idSeccionsubseccion, padre + labelIn + " > ")
    })
  }


  opcionDependencia.value = [...opcionDependencia.value, ...datatemp.map((val:any)=>{
    return{
      label: val.label,
      value: val.value
    }
  })]
}

watch(valorSeleccionado, (nuevoValor) => {
  emit("handleSelect", nuevoValor.value)
});


</script>

<style lang="scss" scoped>
.border-header {
  border-color: rgba(0, 0, 0, 0.12);
  border-top: 10px;
  border-left: 0;
  border-bottom-width: 1px;
}

.border {
  border: transparent;
}
</style>
