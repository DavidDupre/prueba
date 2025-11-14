<template>
  <a
    @click.prevent="
      router.push('/archivo/clasificacion-documental/gestionar-versiones/')
    "
    class="tw-text-primary q-mb-md block cursor-pointer"
    style="text-decoration: none"
  >
    <q-icon size="1.5em" name="chevron_left"></q-icon>
    <b>Regresar</b>
  </a>

  <CintaOpciones :tabs="tabsOptions" :defaultTab="activeTab">
    <template #detalle>
      <Crear :numberTRD="numberTRD" />
    </template>
    <template #MigrarTRD>
      <MigrarTRD />
    </template>
    <template #verTRD>
      <DataMigracionesTRD />
    </template>
    <template #OficinasProductoras>
      <OficinasProductoras />
    </template>
    <!-- <template #SeriesSubseries>
      <SeriesSubseries />
    </template> -->
    <template #TipoDocumental>
      <TipoDocumental />
    </template>
    <!-- <template #Nivel>
      <NivelDeSeguridad />
    </template>  -->
     <!-- <template #Metadatos>
      <MetadatosDeContenido />
    </template>  -->
  </CintaOpciones>
</template>

<script setup lang="ts">
import CintaOpciones from "src/shared/components/PrimeComponents/CintaOpciones/CintaOpciones.vue";
import { computed, onMounted, ref, watch } from "vue";
import Crear from "./GestionVersionesTRD/Crear/Crear.vue";
import MigrarTRD from "../ClasificacionDocumental/MigrarTRD/MigrarTRD.vue";
import SeriesSubseries from "../ClasificacionDocumental/SeriesSubseries/SeriesSubseries.vue";
import TipoDocumental from "./TipoDocumental/TipoDocumental.vue";
import NivelDeSeguridad from "./NivelDeSeguridad/NivelDeSeguridad.vue";
// import MetadatosDeContenido from "./MetadatosDeContenido/MetadatosDeContenido.vue";
import { useRoute, useRouter } from "vue-router";
import OficinasProductoras from "./OficinasProductoras/OficinasProductoras.vue";
import { sgdeaArchivoAxios, sgdeaAxios } from "src/services";
import DataMigracionesTRD from "../ClasificacionDocumental/DataMigracionesTRD/DataMigracionesTRD.vue";
import axios from "axios";

const router = useRouter();
const route = useRoute();
const activeTab = ref("detalle");
const version = ref();
const numberTRD = ref(0);
const id = route.params["id"];
const initial = route.query["initial"];

onMounted(async () => {
  if (initial) activeTab.value = initial as string;
  onGetInfo();
  onCountTrd();
});

const onGetInfo = async () => {
  const { data } = await sgdeaArchivoAxios.get(`/trd/positiva/version/${id}`);
  version.value = data;
};

const onCountTrd = async () => {
  const { data } = await sgdeaArchivoAxios.get(`/trd/positiva/count/${id}`);
  numberTRD.value = data;
};

const tabsOptions = computed(() => [
  { title: "Versión", value: "detalle", icon: "fas fa-file-alt" },
  ...(numberTRD.value > 0
    ? [
        { title: "Ver TRD", value: "verTRD", icon: "table" },
        {
          title: "Oficinas productoras",
          value: "OficinasProductoras",
          icon: "fas fa-building",
        },
        // {
        //   title: "Series / Subseries",
        //   value: "SeriesSubseries",
        //   icon: "fas fa-folder-tree",
        // },
        {
          title: "Tipos Documentales",
          value: "TipoDocumental",
          icon: "file-contract",
        },
        // {
        //   title: "Nivel de seguridad",
        //   value: "Nivel",
        //   icon: "fas fa-shield-alt",
        // },
        // {
        //   title: "Metadatos de contenido",
        //   value: "Metadatos",
        //   icon: "fas fa-database",
        // },
      ]
    : version.value?.status != "INACTIVA"
    ? [
        {
          title: "Migrar TRD",
          value: "MigrarTRD",
          icon: "upload",
        },
      ]
    : []),
]);
</script>
