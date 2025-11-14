<template>
  <q-card class="tw-p-8 tw-rounded-lg" flat>
    <section class="tw-flex tw-flex-col tw-gap-8 tw-mb-8">
      <div class="tw-flex tw-justify-between">
        <div>
          <Title label="Oficinas Productoras" />
        </div>

        <div class="tw-flex">
          <Button
            label="Agregar Oficina Productora"
            type="primary"
            color="primary"
            icon-right="circle-arrow-right"
            @click="navigateToCreate"
          />
        </div>
      </div>
      <div class="tw-w-full tw-flex tw-justify-end">
        <div class="tw-w-full tw-flex tw-justify-end tw-mb-4">
          <Button
            type="primary"
            color="secondary"
            @click="actionFilter"
            :label="isFilterVisible ? 'Ocultar filtros' : 'Filtrar'"
          />
        </div>
      </div>
      <q-form
        v-if="isFilterVisible"
        ref="formRef"
        greedy
        @submit="fetchData"
        class="tw-grid tw-grid-cols-2 tw-gap-x-6 tw-gap-y-2"
      >
        <div class="tw-flex tw-flex-col">
          <Label label="Código" />
          <q-input
            dense
            outlined
            type="text"
            v-model="codeInput"
            class="tw-w-full"
          />
        </div>
        <div class="tw-flex tw-flex-col">
          <Label label="Nombre" />
          <q-input
            dense
            outlined
            type="text"
            v-model="nameInput"
            class="tw-w-full"
          />
        </div>
        <div class="tw-flex tw-flex-col">
          <Label label="Estado" />
          <q-select
            outlined
            dense
            map-options
            emit-value
            :options="[
              { value: true, label: 'ACTIVO' },
              { value: false, label: 'INACTIVO' },
            ]"
            v-model="statusInput"
            class="tw-w-full"
          />
        </div>
        <div
          class="tw-col-span-2 tw-flex tw-justify-center tw-gap-5 tw-pt-6 tw-pb-8"
        >
          <Button
            label="Limpiar"
            type="tertiary"
            color="black"
            type-button="button"
            @click="resetForm"
            icon-left="circle-xmark"
          />
          <Button
            label="Buscar"
            type="primary"
            color="primary"
            type-button="submit"
            icon-right="search"
            :disabled="isSearchDisabled"
            class="button-disabled-white"
          />
        </div>
      </q-form>
    </section>
    <Table :columns="columns" :key="tableKey" :url="url" />
  </q-card>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "src/helpers/toast";
import Button from "src/shared/components/PrimeComponents/Button/Button.vue";
import Table from "src/shared/components/PrimeComponents/Table/Table.vue";
import Title from "src/shared/components/PrimeComponents/Fuentes/Title/Title.vue";
import { Column } from "src/shared/components/PrimeComponents/Table/Table";
import Label from "src/shared/components/PrimeComponents/Label/Label.vue";
const router = useRouter();
const route = useRoute();
const expedienteId = route.params["id"];
// Asumo que trdVersion viene como parámetro de la ruta, ajusta según tu caso

const trdVersion = route.params["id"];

const isFilterVisible = ref(false);
const statusInput = ref("");
const codeInput = ref("");
const nameInput = ref("");
const tableKey = ref(0);

// Modificamos la URL base para usar all-by-version
const BASE_URL = `/Office/positiva/all-by-version?versionId=${trdVersion}`;
const url = ref("");

const navigateToCreate = () => {
  router.push(
    `/archivo/clasificacion-documental/gestionar-versiones/crear-oficina-productoras?from=${expedienteId}`
  );
};

const actionFilter = () => {
  isFilterVisible.value = !isFilterVisible.value;
};

const resetForm = () => {
  statusInput.value = "";
  codeInput.value = "";
  nameInput.value = "";
  fetchInitialData();
  isFilterVisible.value = false;
};

const fetchData = async () => {
  try {
    const timestamp = new Date().getTime();

    url.value =
      BASE_URL +
      `${
        typeof statusInput.value === "boolean"
          ? `&estado=${encodeURIComponent(String(statusInput.value))}`
          : ""
      }${
        nameInput.value
          ? `&nombre=${encodeURIComponent(nameInput.value.toLowerCase())}`
          : ""
      }${
        codeInput.value ? `&codigo=${encodeURIComponent(codeInput.value)}` : ""
      }`;

    tableKey.value += 1;
    toast.success("Filtros aplicados correctamente");
  } catch (error) {
    toast.error("Error al aplicar los filtros");
  }
};

const fetchInitialData = () => {
  url.value = BASE_URL;
  tableKey.value += 1;
};

// Las columnas y demás lógica permanecen igual
const columns: Column[] = [
  { type: "number", header: "#", field: "idSeccionSubSeccion" },
  { type: "string", header: "Código", field: "codigo" },
  { type: "string", header: "Nombre", field: "nombre" },
  {
    type: "string",
    name: "observations",
    header: "Observaciones",
    field: "observacion",
    replaceValue: (value) => value || "-",
  },
  {
    type: "boolean",
    header: "Estado",
    field: "estado",
    format: "uppercase",
    replaceValue: (value) => (value ? "ACTIVO" : "INACTIVO"),
  },
  {
    field: "action",
    header: "Acciones",
    type: "string",
    format: "uppercase",
    classCss: "text-right",
    width: "50px",
    name: "actions",
    actions: [
      {
        icon: "eye",
        eventbtn: (row: any) => {
          router.push({
            path: "/archivo/clasificacion-documental/series-subseries",
            query: {
              idSeccionSubSeccion: row.idSeccionSubSeccion,
              versiontrd: trdVersion,
            },
          });
        },
        name: "detalle",
        color: "primary",
      },
    ],
  },
];

// Asegurarnos de cargar los datos iniciales
onMounted(() => {
  if (trdVersion) {
    fetchInitialData();
  } else {
    toast.error("No se ha especificado la versión TRD");
  }
});
const isSearchDisabled = computed(() => {
  return !codeInput.value && !nameInput.value && statusInput.value === "";
});
</script>

<style lang="scss">
.button-disabled-white {
  &:disabled,
  &[disabled] {
    color: white !important;
  }
}
</style>
