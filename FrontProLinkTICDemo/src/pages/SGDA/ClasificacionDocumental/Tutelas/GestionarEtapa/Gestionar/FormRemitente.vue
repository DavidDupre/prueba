<template>
  <q-expansion-item dense expand-separator default-opened class="tw-bg-white q-mt-md" style="border-radius: 5px">
    <template v-slot:header>
      <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Datos del remitente</h3>
    </template>
    <div class="tw-grid tw-grid-cols-3">
      <div class='tw-flex tw-flex-col tw-w-full tw-p-4'>
        <span class="tw-font-bold">
          <label for="description" class="text-[--subtitle-color]">País</label>
          <q-select
            emit-value
            placeholder="Seleccione"
            outlined
            :options="[{ label: 'Colombia', id: '57'}]"
            dense
            v-model="props.form.pais"
            :rules="[inputRequired]"
          />
        </span>
      </div>
      <div class='tw-flex tw-flex-col tw-w-full tw-p-4'>
          <span class="tw-font-bold">
            <label for="description" class="text-[--subtitle-color]">Departamento</label>
            <q-select
              placeholder="Seleccione"
              outlined
              :options="departmentsList"
              dense
              v-model="props.form.departamento"
              :rules="[inputRequired]"
              map-options
              emit-value
            />
          </span>
      </div>
      <div class='tw-flex tw-flex-col tw-w-full tw-p-4'>
          <span class="tw-font-bold">
            <label for="description" class="text-[--subtitle-color]">Municipio</label>
            <q-select
              emit-value
              placeholder="Seleccione"
              outlined
              :options="municipiosList"
              dense
              v-model="props.form.municipio"
              :rules="[inputRequired]"
              map-options
            />
          </span>
      </div>
      <div class="tw-flex tw-flex-col tw-w-full tw-p-4">
        <span class="tw-w-full">
          <label class="tw-font-bold" for="">Nombre del juzgado*</label>
          <q-input
            v-model="props.form.nombre"
            outlined
            class="tw-rounded-lg"
            label="Inserte"
            dense
            :rules="[inputRequired]"
          ></q-input>
        </span>
      </div>
      <div class="tw-flex tw-flex-col tw-w-full tw-p-4">
        <span class="tw-w-full">
          <label class="tw-font-bold" for="">Dirección de juzgado*</label>
          <q-input
            v-model="props.form.direccion"
            outlined class="tw-rounded-lg" label="Inserte"
            dense
            :rules="[inputRequired]"
          ></q-input>
        </span>
      </div>
      <div class="tw-flex tw-flex-col tw-w-full tw-p-4">
        <span class="tw-w-full">
          <label class="tw-font-bold" for="">Teléfono</label>
          <q-input
            v-model="props.form.telefono"
            outlined class="tw-rounded-lg" label="Inserte"
            dense
            type="number"
          ></q-input>
        </span>
      </div>
      <div class="tw-flex tw-flex-col tw-w-full tw-p-4">
        <span class="tw-w-full">
          <label class="tw-font-bold" for="">Celular*</label>
          <q-input
            v-model="props.form.celular"
            outlined class="tw-rounded-lg" label="Inserte"
            dense
          ></q-input>
        </span>
      </div>
      <div class="tw-flex tw-flex-col tw-w-full tw-p-4">
        <span class="tw-w-full">
          <label class="tw-font-bold" for="">Correo electrónico del remitente*</label>
          <q-input
            v-model="props.form.correo"
            outlined class="tw-rounded-lg" label="Inserte"
            dense
            :rules="[inputRequired]"
          ></q-input>
        </span>
      </div>
      <div class="tw-flex tw-flex-col tw-w-full tw-p-4">
        <span class="tw-w-full">
          <label class="tw-font-bold" for="">Código del proceso</label>
          <q-input
            v-model="props.form.codigo"
            outlined class="tw-rounded-lg" label="Inserte"
            dense
            disable
            filled
          ></q-input>
        </span>
      </div>
      <div class="tw-flex tw-flex-col tw-w-full tw-p-4">
        <span class="tw-w-full">
          <label class="tw-font-bold" for="">Tiempo Respuesta*</label>
          <DatePicker
            v-model:input-data-prop="props.form.tiempoRespuesta"
            outlined
            label="Seleccione"
            dense
            mask="YYYY/MM/DD"
            :rules="[inputRequired]"
          ></DatePicker>
        </span>
      </div>
    </div>
    <div class="tw-flex tw-flex-col tw-w-full tw-p-4">
        <span class="tw-w-full">
          <label class="tw-font-bold" for="">Observaciones</label>
          <q-input
            v-model="props.form.observaciones"
            outlined
            label="Seleccione"
            dense
            type="textarea"
          ></q-input>
        </span>
    </div>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { tipoDocumento } from "src/constantes/options"
import { ref } from 'vue';

import { inputRequired } from "src/helpers/validations";

import DatePicker from "src/components/FormFields/datePickerComponent.vue";

import {useLastTutelaStore} from "stores/lastTutela.store";
const props = withDefaults(defineProps<{
  departmentsList: any[],
  municipiosList: any[],
  form: object,
}>(), {
})

</script>
