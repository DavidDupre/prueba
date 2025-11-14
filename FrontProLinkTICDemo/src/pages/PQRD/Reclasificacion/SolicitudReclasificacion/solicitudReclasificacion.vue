<template>
  <div class="[&>*]:tw-mb-4">
    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl tw-w-full" flat>
      <q-expansion-item label="Información básica" header-class="tw-text-lg tw-font-bold tw-pl-0" default-opened
        class="tw-bg-white tw-px-4 tw-py-5">
        <template v-slot:header>
          <div class="row justify-between tw-w-full">
            <b class="tw-text-lg">Información básica</b>
          </div>
        </template>
        <div class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pl-3">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Número de Radicado
            </p>
            <p>
              {{
                $props.dataReclasificacion?.informacionCaso?.idRadicado ||
                $props.dataReclasificacion?.informacionCaso?.nroRadicado
              }}
            </p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Reclasificar trámite*
            </p>
            <p>
              {{
                tiposPQRD.find(tramite => tramite.value ===
                  $props.dataReclasificacion?.solicitud?.moduloDestinoTramiteId)?.label
              }}
            </p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de trámite
            </p>
            <p>{{ tipoTramiteOrigen }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Oficina</p>
            <p>
              {{
                oficinas.find(oficina => oficina.value ===
                  $props.dataReclasificacion?.solicitud?.oficinaId)?.label ?? 'Oficina no asignada'
              }}
            </p>
          </div>
        </div>
        <div class="tw-grid tw-grid-cols-3 tw-gap-4 tw-pl-3 tw-mt-5">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tiempo por vencer
            </p>
            <p>{{ tiempoPorVencer }} {{ tiempoPorVencer === 1 ? 'día' : '' }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Fecha de vencimiento
            </p>
            <p>{{ fechaVencimiento }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Estado</p>
            <p>
              {{ dataReclasificacion?.solicitud?.estado == 'PENDIENTE' ? 'Pendiente' :
                dataReclasificacion?.solicitud?.estado }}
            </p>
          </div>
        </div>
        <div class="tw-grid-cols-1 tw-gap-4 tw-pl-3 tw-mt-5">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Observaciones</p>
            <p>
              {{
                $props.dataReclasificacion?.solicitud?.observaciones
              }}
            </p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { sgdeaAxios } from "src/services";
import { ref, onMounted } from "vue";
import { decode } from "js-base64";
import { useRoute } from 'vue-router';
const route = useRoute();
const fechaVencimiento = ref(route.query.fecha ? decode(route.query.fecha as string) : "Sin fecha");
const tiempoPorVencer = ref(route.query.tiempo ? decode(route.query.tiempo as string) : "-");

const props = withDefaults(
  defineProps<{
    dataReclasificacion: any;
  }>(),
  {
    dataReclasificacion: null,
  }
);

const tiposPQRD = ref([]);
const oficinas = ref([]);
const tipoTramiteOrigen = ref();
const selectedOficina = ref();
const selectedReclasificarTramite = ref();

onMounted(async () => {
  await Promise.all([getTiposPQRD(), getOficinas()]);
});

async function getTiposPQRD() {
  try {
    const { data } = await sgdeaAxios.get(`/reclasificacion/listadoTiposTramite`);
    tiposPQRD.value = data
      .sort((a, b) => a.nombreTramite.localeCompare(b.nombreTramite))
      .map(({ nombreTramite, id }) => ({
        label: nombreTramite,
        value: id,
      }));
    tipoTramiteOrigen.value = tiposPQRD.value.find(
      tramite => tramite.value === props.dataReclasificacion?.solicitud?.moduloOrigenTramiteId
    )?.label;
  } catch (error) {
    console.error(error);
  }
}

async function getOficinas() {
  try {
    const { data } = await sgdeaAxios.get("oficinas/all");
    oficinas.value = data
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
      .map(({ nombre, id }) => ({
        label: nombre,
        value: id,
      }));
    selectedOficina.value = oficinas.value.find(
      oficina => oficina.value === props.dataReclasificacion?.solicitud?.oficinaId
    )?.label;
  } catch (error) {
    console.error(error);
  }
}
</script>

<style>
/* Add your styles here */
</style>
