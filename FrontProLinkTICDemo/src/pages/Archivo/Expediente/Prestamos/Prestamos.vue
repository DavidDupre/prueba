<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
      <div class="tw-flex tw-justify-between tw-items-center tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold tw-my-4">
          Prestamos
        </h1>
      </div>
      <q-card class="tw-mt-6 tw-rounded-xl tw-p-7" flat>
        <div class="flex flex-center justify-between">
          <p class="tw-text-2xl tw-pl-6">Listado de expedientes</p>
        </div>
        <Table
          :TABLE_HEADER="dataHeader"
          :TABLE_BODY="dataTable"
          :selection="undefined"
          v-model:item-selected="selected"
          key-id="id"
          @update:load-expedientes="loadExpedientes"
        />
      </q-card>
    </main>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref, watch } from "vue";
import Table from "./Table.vue";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from 'src/stores/auth.store';


const form = ref({
  buscador: "",
});

const selected = ref([]);

const dataHeader = ref([
  {
    name: "expedienteId",
    align: "center",
    label: "Número expediente",
    field: "expedienteId",
    sortable: true,
  },
  {
    name: "titulo",
    align: "center",
    label: "Título",
    field: "titulo",
    sortable: true,
  },
  {
    name: "nombre_tipologia_documental",
    align: "center",
    label: "Tipología documental",
    field: "nombre_tipologia_documental",
    sortable: true,
  },
  {
    name: "codIdentificacion",
    align: "center",
    label: "Código identificación",
    field: "codIdentificacion",
    format: val => val === "" ? "-" : val,
    sortable: true,
  },
  {
    name: "nivelSeguridad",
    align: "center",
    label: "Nivel de seguridad",
    field: "nivelSeguridad",
    sortable: true,
  },
  {
    name: "observaciones",
    align: "center",
    label: "Observaciones",
    field: "observaciones",
    sortable: true,
  },
  {
    name: "responsable_nombre",
    align: "center",
    label: "Responsable",
    field: "responsable_nombre",
    sortable: true,
  },
  {
    name: "nombreModulo",
    align: "center",
    label: "Módulo",
    field: "nombreModulo",
    sortable: true,
  },
  {
    name: "dependencia_nombre",
    align: "center",
    label: "Dependencia",
    field: "dependencia_nombre",
    sortable: true,
  },
  {
    name: "nombre_serie",
    align: "center",
    label: "Serie",
    field: "nombre_serie",
    sortable: true,
  },
  {
    name: "nombre_subserie",
    align: "center",
    label: "Subserie",
    field: "nombre_subserie",
    sortable: true,
  },
  {
    name: "estado_prestamo",
    align: "center",
    label: "Estado",
    field: "estado_prestamo",
    format: val => val === "DISPONIBLE" ? "Disponible" : "No disponible",
    sortable: true,
  },
  {
        name: "acciones",
        label: "Acciones",
        field: "acciones",
        sortable: false,
        align: "center",
    },
]);
const dataTable = ref([]);
const auth = useAuthStore();

onMounted(async () => {
  await loadExpedientes();
});

const loadExpedientes = async () => {
try {
  const response = await sgdeaAxios.get('/expediente/expedientesPorMetadata', {
    headers: {
      'tenantName': auth.$state.userInfo.username
      }
  });
  const modulos = await sgdeaAxios.get('/notificaciones/modulos');
  const modulosMap = new Map(modulos.data.map(modulo => [modulo.id, modulo.nombre]));

  dataTable.value = response.data.map(expediente => {
    return {
      ...expediente,
      nombreModulo: modulosMap.get(expediente.moduloId) || '-'
    };
  });
} catch (error) {
  console.error(error);
}
};

</script>

<style></style>
