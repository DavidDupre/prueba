<template>
  <div class="tw-mt-4">
    <q-card flat class="tw-p-4 tw-rounded-xl">
      <div v-if="isDetails" class="tw-flex-1 tw-mb-4">
        <Title label="Historial de Eventos" />
      </div>
      <div  v-if="isDetails" class="row items-center tw-gap-4">
        <div class="row tw-w-full tw-gap-4">
          <q-input outlined v-model="input1" label="Número Consecutivo" class="tw-flex-1" />
          <q-input outlined v-model="input2" label="Estado" class="tw-flex-1" />
        </div>
      </div>
      <div v-if="isDetails" class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
        <Button label="Limpiar" type="tertiary" color="segundary" type-button="button" @click="resetForm"
          icon-left="circle-xmark" />
        <Button label="Buscar" type="primary" color="primary" type-button="submit" icon-right="circle-arrow-right"
          @click="onFilterTable" />

      </div>
      <Table :url="url" :show-search="false" :key="url" :columns="columns" />
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import { FormDataExpediente } from "src/interfaces/Expediente";
import Button from "src/shared/components/PrimeComponents/Button/Button.vue";
import Title from "src/shared/components/PrimeComponents/Fuentes/Title/Title.vue";
import { Column } from "src/shared/components/PrimeComponents/Table/Table";
import Table from "src/shared/components/PrimeComponents/Table/Table.vue";

import { ref } from "vue";

const props = defineProps<{ expediente: FormDataExpediente }>();

const input1 = ref("");
const input2 = ref("");
const isDetails = ref(!props?.expediente?.title ? true : false);
const initialUrl = !props?.expediente?.title ? ref(`ttp://172.19.8.213/systemlog/sytemlog/all`) : ref(`ttp://172.19.8.213/systemlog/sytemlog/all?consecutivo=${props.expediente.title}`);
// const initialUrl = !props?.expediente?.title ? ref(`https://ms-sgdea-acueducto.linktic.com/systemlog/sytemlog/all`) : ref(`https://ms-sgdea-acueducto.linktic.com/systemlog/sytemlog/all?consecutivo=${props.expediente.title}`);



const url = ref(initialUrl.value);


const onFilterTable = () => {
  url.value = `systemlog/sytemlog/all${input1.value ? `?consecutivo=${input1.value}` : ""}${input2.value ? `&state=${input2.value}` : ""}`
}

const columns: Column[] = [
  {
    field: "consecutiveNumber",
    header: "Número Consecutivo",
    type: "string",
    width: "200px",
    sort: true,
  },
  {
    field: "state",
    header: "Estado",
    type: "string",
    width: "150px",
    sort: true,
  },
  {
    field: "timestamp",
    header: "Fecha y Hora",
    type: "string",
    width: "180px",
    sort: true,
    // replaceValue: (value: any) => (value ? moment(value).format("DD/MM/YYYY HH:mm:ss") : "-"),
  },
  {
    field: "user",
    header: "Usuario",
    type: "string",
    width: "150px",
    sort: true,
  },
  {
    field: "dependenci",
    header: "Dependencia",
    type: "string",
    width: "180px",
    sort: true,
  },
  {
    field: "transactionType",
    header: "Transacción",
    type: "string",
    width: "180px",
    sort: true,
  },
  {
    field: "description",
    header: "Observación",
    type: "string",
    width: "180px",
    sort: true,
  },
];

// Restablecer formulario y recargar datos
const resetForm = () => {
  input1.value = "";
  input2.value = "";
};

</script>

<style scoped>
::v-deep(.q-table thead th) {
  text-align: center !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}
</style>
