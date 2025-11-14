<template>
  <a
    @click.prevent="router.back()"
    class="tw-text-primary q-mb-md block cursor-pointer"
    style="text-decoration: none"
  >
    <q-icon size="1.5em" name="chevron_left"></q-icon>
    <b>Regresar</b>
  </a>
  <q-card class="tw-p-8 tw-rounded-lg" flat>
    <section class="tw-flex tw-justify-between tw-mb-8">
      <div class="tw-flex-1">
        <Title label="Gestionar Series / Subseries" />
      </div>
      <div>
        <Button
          label="Agregar una nueva serie/subserie"
          type="primary"
          color="primary"
          :class="'tw-w-full'"
          icon-right="circle-arrow-right"
          @click="goToAgregarSerieSubserie"
        />
      </div>
    </section>
    <div class="tw-w-full tw-flex tw-justify-end tw-mb-4">
      <Button
        type="primary"
        color="secondary"
        @click="actionFilter"
        :label="isFilterVisible ? 'Ocultar filtros' : 'Filtrar'"
      />
    </div>
    <div class="tw-flex tw-justify-end"></div>

    <q-form
      v-if="isFilterVisible"
      ref="formRef"
      greedy
      @submit.prevent="fetchData"
      class="tw-grid tw-grid-cols-2 tw-gap-x-6 tw-gap-y-2"
      style="margin-bottom: 60px"
    >
      <div class="tw-flex tw-flex-col">
        <Label label="Código" />
        <q-input
          dense
          outlined
          type="text"
          v-model="serireSubserieCodigo"
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
          v-model="estado"
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
          @click="limpiar"
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

    <Table :columns="columns" :url="url" :key="tableKey" />
  </q-card>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, Ref, ref } from "vue";
import Button from "src/shared/components/PrimeComponents/Button/Button.vue";
import Table from "src/shared/components/PrimeComponents/Table/Table.vue";
import Label from "src/shared/components/PrimeComponents/Label/Label.vue";
import Title from "src/shared/components/PrimeComponents/Fuentes/Title/Title.vue";
import { Column } from "src/shared/components/PrimeComponents/Table/Table";

import { toast } from "src/helpers/toast";
const router = useRouter();
const route = useRoute();

const id = route.params["id"];
const versiontrd = route.query.versiontrd;
const estado = ref("");
const serireSubserieCodigo = ref("");
const nameInput = ref("");

const isFilterVisible = ref(false);

const formRef = ref();

//const url = ref(`archivo/trd/series-subseries/${route.params["id"]}/paginated`);
//const url = ref(`archivo/trd/series-subseries/paginated`);

// http://172.19.8.213/archivo/trd/series-subseries?trdVersionId=1

// const url = ref(`/trd/series-subseries/paginated`);

const idSeccionSubSeccion = route.query.idSeccionSubSeccion;
const BASE_URL = `/trd/positiva/series-subseries-by-office?officeId=${idSeccionSubSeccion}&page=0&size=10`;
const url = ref("");

const tableKey = ref(0);

const columns: Column[] = [
  {
    header: "#",
    field: "id",
    sort: true,
    type: "string",
  },
  /*{
    type: "string",
    header: "#",
    // field: (row) => `Id Serie: ${row.padre_id} /\n Id Subserie: ${row.hijo_id}`,
    field: (row) => {
      const idSerie = row.padre_id ? `Id Serie: ${row.padre_id}` : '';
      const idSubserie = row.hijo_id ? `Id Subserie: ${row.hijo_id}` : '';
      return [idSerie, idSubserie].filter(Boolean).join(' /\n ');
    },
    sort: true,
  },*/
  {
    type: "string",
    name: "codigoSerie",
    header: "Código de la Serie",
    field: (row) => row?.fatherId ? row?.fatherId?.code : row?.code || "-",
    sort: true,
  },
  {
    type: "string",
    name: "nombreSerie",
    header: "Nombre de la Serie",
    field: (row) => row?.fatherId ? row?.fatherId?.description : row?.description || "-",
    sort: true,
  },
  {
    type: "string",
    name: "codigoSubserie",
    header: "Código de la Subserie",
    field: (row) => row?.fatherId ? row?.code : "-",
    sort: true,
  },
  {
    type: "string",
    name: "nombreSubserie",
    header: "Nombre de la Subserie",
    field: (row) => row?.fatherId ? row?.description : "-",
    sort: true,
  },
  {
    type: "state",
    name: "status",
    header: "Estado",
    width: "160px",

    field: (row) => {
      const estadoSerie = `${row.status ? "Activa" : "Inactiva"}`;
      return [estadoSerie].filter(Boolean).join(" /\n ");
    },
    sort: true,
  },
  {
    field: "action",
    header: "Acciones",
    type: "string",
    format: "uppercase",
    classCss: "text-right",
    width: "30px",
    name: "actions",
    actions: [
      {
        icon: "edit",
        eventbtn: (row: any) => {
          if (row) {
            router.push({
              path: `/archivo/clasificacion-documental/gestionar-versiones/series-subseries/editar/${row.id}`,
              query: { subSerie: row.id },
            });
          } else {
            router.push(
              `/archivo/clasificacion-documental/gestionar-versiones/series-subseries/editar/${row.fatherId.id}`
            );
          }
        },
        name: "edit",
        color: "primary",
      },
      {
        icon: "eye",
        eventbtn: (row: any) => {
          router.push({
            path: `/archivo/clasificacion-documental/TipoDocumentalParams`,
            query: {
              idSeccionSubSeccion: idSeccionSubSeccion,
              versiontrd: versiontrd,
              serieSubserieId: row.id,
            },
          });
        },
        name: "view",
        color: "primary",
      },
    ],
  },
];

// const goToAgregarSerieSubserie = () => {
//   router.push(`/archivo/clasificacion-documental/gestionar-versiones/series-subseries/agregar/${versiontrd}`);
// };

const goToAgregarSerieSubserie = () => {
  router.push({
    path: `/archivo/clasificacion-documental/gestionar-versiones/series-subseries/agregar/${versiontrd}`,
    query: { officeId: route.query.idSeccionSubSeccion },
  });
};
const actionFilter = () => {
  isFilterVisible.value = !isFilterVisible.value;
};
const fetchData = async () => {
  try {
    const timestamp = new Date().getTime();

    url.value =
      BASE_URL +
      `${
        typeof estado.value === "boolean"
          ? `&estado=${encodeURIComponent(String(estado.value))}`
          : ""
      }${
        nameInput.value
          ? `&nombre=${encodeURIComponent(nameInput.value.toLowerCase())}`
          : ""
      }${
        serireSubserieCodigo.value ? `&codigo=${encodeURIComponent(serireSubserieCodigo.value)}` : ""
      }`;
    tableKey.value += 1;
    toast.success("Filtros aplicados correctamente");
  } catch (error) {
    toast.error("Error al aplicar los filtros");
  }
};

const limpiar = () => {
  estado.value = "";
  nameInput.value = "";
  serireSubserieCodigo.value = "";
  actionFilter();
  fetchData();
};
onMounted(() => {
  fetchData();
});

const isSearchDisabled = computed(() => {
  return estado.value === "" && !nameInput.value && !serireSubserieCodigo.value;
});
</script>
