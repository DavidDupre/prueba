<template>
  <Trazabilidad :doneItems="trazabilidadData" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { sgdeaAxios } from "src/services";
import Trazabilidad from "../TrazabilidadTable/Trazabilidad.vue";
import moment from "moment";

const props = defineProps<{
  mlData: any
}>()

const route = useRoute();
const showRoute = ref(props.mlData.id);
const trazabilidadData = ref<any[]>([])

onMounted(async () => {
  await getTraza()
})

const getTraza = async () => {
  const response = await sgdeaAxios.get('/trazabilidad/obtenerPorCodProceso/' + 'ML' + showRoute.value);

  if (!response?.data || response.data.length === 0) {
    trazabilidadData.value = [];
    return;
  }
  trazabilidadData.value = response.data.sort((a, b) => a.id - b.id).map((item) => { return { ...item, fechaHora: moment(item.fechaHora).format('DD/MM/YYYY HH:mm') } })
}

</script>
