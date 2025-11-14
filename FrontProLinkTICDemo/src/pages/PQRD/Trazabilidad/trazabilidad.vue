<template>
  <Trazabilidad :doneItems="trazabilidadData" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { sgdeaAxios } from "src/services";
import Trazabilidad from "src/pages/Expedientes/Trazabilidad/Trazabilidad.vue";
import { useAuthStore } from "src/stores/auth.store";

import moment from "moment";

const route = useRoute();
const showRoute = ref(route.params.id);
const trazabilidadData = ref<any[]>([]);
const auth = useAuthStore();

onMounted(async () => {
  const moduloOrigen = route.query.moduloOrigen;

  switch (moduloOrigen) {
    case "10":
      // L�gica especial para m�dulo 10
      const response10 = await sgdeaAxios.get(
        "/trazabilidad/obtenerPorCodProceso/" + "TUT" + showRoute.value
      );

      trazabilidadData.value = response10?.data?.length
        ? response10.data
            .sort((a, b) => a.id - b.id)
            .map((item) => ({
              ...item,
              detalle: item.descripcion,
            }))
        : [];
      break;

    case "11":
      // L�gica especial para m�dulo 11
      const response11 = await sgdeaAxios.get(
        "/trazabilidad/obtenerPorCodProceso/" + "ENTC" + showRoute.value
      );

      trazabilidadData.value = response11?.data?.length
        ? response11.data
            .sort((a, b) => a.id - b.id)
            .map((item) => ({
              ...item,
              detalle: item.descripcion,
            }))
        : [];
      break;
    case "12":
      // L�gica especial para m�dulo 11
      const response12 = await sgdeaAxios.get(
        "/trazabilidad/obtenerPorCodProceso/" + "ML" + showRoute.value
      );

      trazabilidadData.value = response12?.data?.length
        ? response12.data
            .sort((a, b) => a.id - b.id)
            .map((item) => ({
              ...item,
              detalle: item.descripcion,
            }))
        : [];
      break;
    case "6":
      // L�gica especial para m�dulo 6
      const response6 = await sgdeaAxios.get(
        "/trazabilidad/obtenerPorCodProceso/" + "COR" + showRoute.value
      );

      trazabilidadData.value = response6?.data?.length
        ? response6.data
            .sort((a, b) => a.id - b.id)
            .map((item) => ({
              ...item,
              detalle: item.descripcion,
            }))
        : [];
      break;
    case "8":
      // L�gica especial para m�dulo 8
      const datapqrd = await sgdeaAxios.get(
        `/pqrd/buscarCaso?idCaso=${showRoute.value}&userId=${auth.$state.userInfo.userid}`
      );

      const response8 = await sgdeaAxios.get(
        "/trazabilidad/obtenerPorCodProceso/" + "PQRD" + datapqrd.data.id
      );
      trazabilidadData.value = response8?.data?.length
        ? response8.data
            .sort((a, b) => a.id - b.id)
            .map((item) => ({
              ...item,
              detalle: item.descripcion,
            }))
        : [];
      break;
    default:
      // L�gica est�ndar
      // const data = await sgdeaAxios.get(
      //   `/pqrd/buscarCaso?idCaso=${showRoute.value}`
      // );

      const responseDefault = await sgdeaAxios.get(
        "/trazabilidad/obtenerPorCodProceso/" + "PQRD" + showRoute.value
      );

      trazabilidadData.value = responseDefault?.data?.length
        ? responseDefault.data
            //.filter((item) => item.estado === "Por asignar")
            .sort((a, b) => a.id - b.id)
            .map((item) => ({
              ...item,
              detalle: item.descripcion,
              fechaHora : moment(item.fechaHora).format("DD/MM/YYYY HH:mm"),
            }))
        : [];
      break;
  }
});
</script>
