<template>
  <q-select
    outlined
    label="Sección"
    v-model="valorSeleccionado"
    :options="opcionDependencia"
    dense/>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { sgdeaAxios } from '../../services/index';

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
}>()

const opcionDependencia = ref([])
const valorSeleccionado = ref<string | null>(null);
const emit = defineEmits(['handleSelect'])

onMounted(async () => {
  if (props.tvd){
    await loadDataFiltroTvd();
  }else {
    await loadDataFiltro();
  }
});
async function loadDataFiltro() {

  const { data } = await sgdeaAxios.get("/seccionSubSeccion");

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
