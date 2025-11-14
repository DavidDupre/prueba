<template>
  <div v-if="trazaDocument.length > 0" class="card-grid">

    <TrazabilidadDocumento :ml-data="trazaDocument" />

  </div>
  <template v-else >
        <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
          <img v-lazy :data-url="NoData" alt="" width="120" />
          <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
            {{ noDataMessage }}
          </span>
        </div>
        {{ corData }}
      </template>
</template>

<script lang="ts" setup>
import TrazabilidadDocumento from "../../MedicinaLaboral/TrazabilidadDocumento/TrazabilidadDocumento.vue";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import NoData from "src/assets/filterImage.svg";

const props = defineProps<{
  corData: any;
  id: number;
}>();

const route = useRoute();
const trazaDocument = ref([]);
const noDataMessage = "No existe data por el momento";

onMounted(async()=>{
    try {
      const response = await sgdeaAxios.get(
        `/api/documentos-salida/${props.id}/historial`
      );
      trazaDocument.value = response.data;
    } catch {
        toast.error("Ha ocurrido un error al obtener la información");
    }
})

</script>

<style scoped>
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card-item {
  max-width: 100%; /* Asegura que la tarjeta no se salga de los límites */
  box-sizing: border-box; /* Hace que el padding no aumente el ancho total */
}
.card-item .content p {
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
.content {
  flex-grow: 1;
}

.actions {
  margin-top: auto;
}
</style>
