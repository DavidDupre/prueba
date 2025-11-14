<template>
  <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-4">Encargado de aprobación</h2>
  <div class="tw-flex">
    <div class="q-pr-md col-xs-12 col-sm-12 col-md-6 col-lg-6 q-pt-none">
      <q-card class="tw-rounded-2xl tw-px-6 tw-py-4 tw-w-full 2xl:tw-w-full lg:tw-w-[495px] md:tw-w-full sm:tw-w-full" flat bordered>
        <p class="tw-text-lg tw-font-semibold">Seleccione a los funcionarios a los cuales quiere enviar copiar</p>
        <div class="tw-w-2/4 tw-mb-4">
          <p class="tw-text-label tw-font-semibold">Filtrar por Usuario</p>
          <q-select :options="[]" map-options emit-value outlined
                    label="Seleccione" dense  />
        </div>
        <Table
          :TABLE_HEADER="TRAZABILIDAD_HEADER"
          :TABLE_BODY="dataTable"
          v-model:item-selected="item"
          key-id="grupo"
        />
      </q-card>
    </div>
    <div class="row col-xs-12 col-sm-12 col-md-6 col-lg-6  q-pl-md q-pt-none">
      <q-card bordered flat class="q-pa-md tw-rounded-2xl tw-min-w-min tw-w-[450px]">
        <div class="">
          <p class="tw-text-lg tw-font-semibold">Estos son los usuarios que ha seleccionado</p>
          <q-chip removable color="dark" t outline v-model="item[n]" v-for="(i, n) in item">
            {{ i.colaborador }}
          </q-chip>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { TRAZABILIDAD_HEADER } from "./";
import Table from "components/Table.vue";

const check = ref(false);
const dataTable = ref([
  {
    codigo: 'Mario Andres',
    dependencia: 'Documentacion',
    idSeriesubserie: 'De salida',
    descripcion: 'Oficina',
    cargado: 'Mario Andres',
    fecha: '10/12/2023',
    estado: 'Gola',
    asignar: 'hola',
    id: 1,
  },
  {
    codigo: 'Mario Andres',
    dependencia: 'Documentacion',
    idSeriesubserie: 'De salida',
    descripcion: 'Oficina',
    cargado: 'Mario Andres',
    fecha: '10/12/2023',
    estado: 'Gola',
    asignar: 'hola',
    id: 1,
  },
  {
    codigo: 'Mario Andres',
    dependencia: 'Documentacion',
    idSeriesubserie: 'De salida',
    descripcion: 'Oficina',
    cargado: 'Mario Andres',
    fecha: '10/12/2023',
    estado: 'Gola',
    asignar: 'hola',
    id: 1,
  },
])
const item = ref([]);
</script>
