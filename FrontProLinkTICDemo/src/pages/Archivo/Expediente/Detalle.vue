<template>
  <a
    @click.prevent="router.push('/archivo/expediente')"
    class="tw-text-primary q-mb-md block cursor-pointer"
    style="text-decoration: none"
  >
    <q-icon size="1.5em" name="chevron_left"></q-icon>
    <b>Regresar</b>
  </a>

  <div class="tw-mb-6 tw-px-2">
    <Title :label="'Consultar Expediente ' + expediente?.titulo" />
  </div>

  <q-inner-loading :showing="loading" />

  <CintaOpciones v-if="!loading" :tabs="tabsOptions" :defaultTab="activeTab">
    <template #informacion>
      <InformacionExpediente :expediente="dataExpediente" />
    </template>

    <template #documentos>
      <DocumentosExpediente :expediente="expediente" :key="expediente?.id" />
    </template>

    <!-- <template #seguridad>
      <Seguridad :expediente="expediente"></Seguridad>
    </template>

    <template #asignar>
      <HistorialEventos :expediente="expediente"></HistorialEventos>
    </template>

    <template #unidades>
      <UnidadesExpediente :expediente="expediente"></UnidadesExpediente>
    </template> -->
  </CintaOpciones>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth.store";
import { FormDataExpediente } from "src/interfaces/Expediente";
import CintaOpciones from "src/shared/components/PrimeComponents/CintaOpciones/CintaOpciones.vue";
import InformacionExpediente from "./InformacionExpediente/InformacionExpediente.vue";
import Title from "src/shared/components/PrimeComponents/Fuentes/Title/Title.vue";
import DocumentosExpediente from "./DocumentosExpediente/DocumentosExpediente.vue";
import Seguridad from "./Seguridad/Seguridad.vue";
import HistorialEventos from "./HistorialEventos/HistorialEventos.vue";
import UnidadesExpediente from "./UnidadesExpediente/UnidadesExpediente.vue";
import { sgdeaArchivoAxios, sgdeaAxios } from "src/services";

const router = useRouter();
const route = useRoute();
const initial = route.query["initial"];
const activeTab = ref("informacion");
const loading = ref(true);

// Datos del expediente
const expediente = ref();
const dataExpediente = ref();

// Obtener información del usuario
const { getUserInfo } = useAuthStore();
const user = ref(getUserInfo());

// Tabs disponibles
const tabs = [
  {
    title: "Información del Expediente",
    value: "informacion",
    icon: "fas fa-info-circle",
  },
  {
    title: "Documentos del Expediente",
    value: "documentos",
    icon: "fas fa-book",
  },
  // { title: "Seguridad", value: "seguridad", icon: "fas fa-user-lock" },
  // {
  //   title: "Trazabilidad del Expediente",
  //   value: "asignar",
  //   icon: "fas fa-user-plus",
  // },
  // {
  //   title: "Unidades Físicas",
  //   value: "unidades",
  //   icon: "fa-solid fa-list",
  // },
];

// Cargar datos del expediente
onMounted(async () => {
  try {
    loading.value = true;
    const id = route.query.titulo;

    // Si hay tab inicial en la URL, lo establecemos
    if (initial) activeTab.value = initial as string;

    // Obtener datos del expediente
    const response = await sgdeaArchivoAxios.get(
      `/record/positiva/detail?name=${id}`,
    );

    const responseDetails = await sgdeaArchivoAxios.get(
      `/alfresco/nodes/${response.data.nodeId}/details`,
    );

    dataExpediente.value = response.data;

    expediente.value = {
      ...response.data,
      ...responseDetails.data,
    };
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

// Mapeamos las tabs a las opciones del componente
const tabsOptions = computed(() => tabs);
</script>
