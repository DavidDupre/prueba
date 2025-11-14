<template>
  <div class="q-my-md">
    <div class="tw-flex tw-justify-between tw-items-center">
      <span class="tw-font-bold tw-text-3xl tw-my-5"> Facturación </span>
    </div>

    <q-card class="tw-rounded-xl tw-p-4" flat bordered>
      <q-expansion-item default-opened>
        <template v-slot:header>
          <div class="col row">
            <b class="tw-text-lg">Filtrar por</b>
          </div>
        </template>

        <div class="row q-col-gutter-md q-pb-md q-px-md">
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Estado</span>
            <q-select
              :rules="[]"
              name="estado"
              outlined
              v-model="filtro.estado"
              label="Seleccione"
              dense
              map-options
              emit-value
              :options="stateOptions"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Numero de radicado</span>
            <q-input
              :rules="[]"
              name="numeroRadicado"
              outlined
              v-model="filtro.numeroRadicado"
              label="Inserte"
              dense
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Fecha de vencimiento</span>
            <q-input
              :rules="[]"
              name="fechaVencimiento"
              outlined
              v-model="filtro.fechaVencimiento"
              dense
              type="date"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Ciudad</span>
            <q-select
              :rules="[]"
              name="ciudad"
              outlined
              v-model="filtro.ciudad"
              label="Seleccione"
              dense
              map-options
              emit-value
              :options="[{ value: 'BOG', label: 'Bogotá D.C' }]"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Tipo de trámite</span>
            <q-select
              :rules="[]"
              name="tipoTramite"
              outlined
              v-model="filtro.tipoTramite"
              label="Seleccione"
              dense
              map-options
              emit-value
              :options="[{ value: 'Remitente', label: 'Remitente' }]"
            />
          </div>
        </div>

        <div class="tw-flex tw-justify-center tw-items-center tw-my-5 tw-gap-6">
          <q-btn
            label="Limpiar filtros"
            type="reset"
            style="width: 240px"
            text-color="black"
            color="accent"
            class="tw-rounded-xl tw-h-12"
          />

          <q-btn
            type="submit"
            label="Filtrar"
            text-color="white"
            style="width: 240px"
            color="primary"
            class="tw-rounded-xl tw-h-12 tw-p-2"
          />
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat bordered>
      <div class="flex items-center justify-between q-px-md q-mb-sm row col-12">
        <span class="text-weight-bold text-h6" style="color: #2c3948"
          >Listado de facturas adminsitrativas radicadas</span
        >
      </div>

      <TableFacturasRadicadas
        class="full-width"
        :RADICADO_HEADER="RADICADO_HEADER"
        :RADICADO_BODY="RADICADO_BODY"
      />
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import TableFacturasRadicadas from "./Table.vue";
import { RADICADO_HEADER, RADICADO_BODY, Filtro } from ".";

const filtro = ref<Filtro>({
  estado: "",
  numeroRadicado: "",
  fechaVencimiento: "",
  ciudad: "",
  tipoTramite: "",
});

const stateOptions = [
  {
    label: "Asignado",
    value: "asignado",
  },
  {
    label: "Por asignar",
    value: "porAsignar",
  },
  {
    label: "Rechazado",
    value: "rechazado",
  },
];
</script>
