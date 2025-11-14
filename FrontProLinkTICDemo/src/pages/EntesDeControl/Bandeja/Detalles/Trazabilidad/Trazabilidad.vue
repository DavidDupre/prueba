<template>
  <div class="tw-bg-white tw-p-4 tw-border-2 tw-rounded-lg">
    <Trazabilidad :TABLE_BODY="trazabilidadData" />
  </div>
</template>

<script lang="ts" setup>
import Trazabilidad from "./TrazabilidadTable.vue";
import { sgdeaAxios } from "src/services";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import moment from "moment";

const route = useRoute();

const routeID = ref(String(route.params.id));
const trazabilidadData = ref([]);

const getTrazabilidad = () => {
  const url = "/trazabilidad/obtenerPorCodProceso/ENTC" + routeID.value;
  sgdeaAxios.get(url).then((response) => {
    trazabilidadData.value = response.data.map((item) => ({
        ...item,
        fechaHora: moment(item.fechaHora).format("DD/MM/YYYY HH:mm A"),
      }))
      .sort((a, b) => a.id - b.id);
  });
};

onMounted(() => {
  getTrazabilidad();
});
</script>
