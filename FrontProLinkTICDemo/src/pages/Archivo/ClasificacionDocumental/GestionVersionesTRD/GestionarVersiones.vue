<template>
  <q-card class="tw-rounded-lg tw-p-8" flat>
    <div class="tw-flex tw-justify-between tw-items-center tw-mb-8">
      <div class="tw-flex-1">
        <Title label="Consultar Tablas de Retención Documental" />
      </div>
      <div>
        <Button
          label="Crear TRD"
          type="primary"
          color="primary"
          :class="'tw-w-full'"
          icon-right="circle-arrow-right"
          @click="
            router.push('/archivo/clasificacion-documental/gestionar-versiones/crear')
          "
        />
      </div>
    </div>
    <Table :columns="columns" :url="url" />
  </q-card>
</template>
<script lang="ts" setup>
import { useRouter } from "vue-router";
import Button from "src/shared/components/PrimeComponents/Button/Button.vue";
import Table from "src/shared/components/PrimeComponents/Table/Table.vue";
import { Column } from "src/shared/components/PrimeComponents/Table/Table";
import Title from "src/shared/components/PrimeComponents/Fuentes/Title/Title.vue";
import { fourthFormatDate } from "src/helpers/formtDate";

const url = `/trd/positiva/version`;
const router = useRouter();
const columns: Column[] = [
  {
    field: "id",
    header: "#",
    type: "string",
    tooltip: "Canal por el cual se realizó la radicación",
    sort: true,
  },
  {
    field: "versionName",
    header: "Nombre Versión TRD ",
    type: "string",
    format: "uppercase",
    classCss: "text-right",
    sort: true,
  },
  {
    field: "instrumentType",
    header: "Tipo de Instrumento",
    type: "string",
    format: "uppercase",
    classCss: "text-right",
    sort: true,
  },
  {
    field: "startDate",
    header: "Fecha Inicio de Aplicación",
    replaceValue: (value: any) => (value ? fourthFormatDate(value) : "N/A"),
    type: "string",
    sort: true,
  },

  {
    field: "endDate",
    header: "Fecha Final Aplicación",
    type: "string",
    replaceValue: (value: any) => (value ? fourthFormatDate(value) : "N/A"),
    sort: true,
  },
  {
    field: "status",
    header: "Estado",
    type: "string",
    format: "uppercase",
    classCss: "text-right",
    replaceValue: (value: any) => (value == "Proyecto" ? "Borrador" : value),
    sort: true,
  },
  {
    field: "action",
    header: "Acciones",
    type: "string",
    format: "uppercase",
    classCss: "text-right",
    name: "actions",
    actions: [
      {
        icon: "edit", // Cambia el ícono a un ojo
        eventbtn: (rowData: any) => {
          router.push(
            `/archivo/clasificacion-documental/gestionar-versiones/detalle/${rowData.id}`
          );
        },
        name: "view",
        color: "primary",
      },
    ],
  },
];
</script>

<style lang="scss">
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
