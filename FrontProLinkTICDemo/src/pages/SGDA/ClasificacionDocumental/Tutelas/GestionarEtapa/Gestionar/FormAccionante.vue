<template>
  <q-expansion-item dense expand-separator default-opened class="tw-bg-white q-mt-md" style="border-radius: 5px">
    <template v-slot:header>
      <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Datos del Accionante</h3>
    </template>
    <div class='tw-flex tw-flex-col tw-w-full tw-p-4'>
      <span class="tw-font-bold">
        <label for="description" class="tw-text-gray-dark">Tipo de Documento*</label>
        <q-select emit-value label="Seleccione" outlined :options="opTipoDoc" dense
          v-model="props.form.tipoDocumento" :rules="[inputRequired]" map-options @update:model-value="clearAccionante" @blur="getPerson" :disable="isPorAprobar" />
      </span>
    </div>
    <div class="tw-flex tw-flex-col tw-w-full tw-p-4">
      <span class="tw-w-full tw-font-bold">
        <label class="tw-text-gray-dark" for="">Número Documento*</label>
        <q-input v-model="form.numeroDocumento" outlined class="tw-rounded-lg" label="Inserte" dense
          :rules="[inputRequired, v => maxLengthInput(15, v), alphanumeric]" @blur="getPerson" :disable="isPorAprobar" />
      </span>
    </div>

    <template v-if="isNit">
      <div class="tw-flex tw-flex-col tw-w-full tw-p-4">
        <span class="tw-w-full">
          <label class="tw-font-bold tw-text-gray-dark">Nombre Comercial *</label>
          <q-input v-model="form.primerNombre" outlined class="tw-rounded-lg" label="Inserte" dense
            :rules="[v => maxLengthInput(100, v), alphanumeric, inputRequired]" :disable="isPorAprobar"></q-input>
        </span>
      </div>
      <div class="tw-flex tw-flex-col tw-w-full tw-p-4">
        <span class="tw-w-full">
          <label class="tw-font-bold tw-text-gray-dark">Razón Social *</label>
          <q-input v-model="form.primerApellido" outlined class="tw-rounded-lg" label="Inserte" dense
            :rules="[v => maxLengthInput(100, v), alphanumeric, inputRequired]" :disable="isPorAprobar"></q-input>
        </span>
      </div>
    </template>

    <template v-else>
      <div class="tw-flex tw-flex-col tw-w-full tw-p-4">
        <span class="tw-w-full tw-font-bold">
          <label class="tw-text-gray-dark" for="">Primer Nombre*</label>
          <q-input v-model="form.primerNombre" outlined class="tw-rounded-lg" label="Inserte" dense
            :rules="[v => maxLengthInput(100, v), inputRequired, alphanumeric]" :disable="isPorAprobar"></q-input>
        </span>
      </div>
      <div class="tw-flex tw-flex-col tw-w-full tw-p-4">
        <span class="tw-w-full tw-font-bold">
          <label class="tw-text-gray-dark" for="">Segundo Nombre</label>
          <q-input v-model="form.segundoNombre" outlined class="tw-rounded-lg" label="Inserte" dense
            :rules="[v => maxLengthInput(100, v), alphanumeric]" :disable="isPorAprobar"></q-input>
        </span>
      </div>
      <div class="tw-flex tw-flex-col tw-w-full tw-p-4">
        <span class="tw-w-full tw-font-bold">
          <label class="tw-text-gray-dark" for="">Primer Apellido*</label>
          <q-input v-model="form.primerApellido" outlined class="tw-rounded-lg" label="Inserte" dense
            :rules="[v => maxLengthInput(100, v), inputRequired, alphanumeric]" :disable="isPorAprobar"></q-input>
        </span>
      </div>
      <div class="tw-flex tw-flex-col tw-w-full tw-p-4">
        <span class="tw-w-full tw-font-bold">
          <label class="tw-text-gray-dark" for="">Segundo Apellido</label>
          <q-input v-model="form.segundoApellido" outlined class="tw-rounded-lg" label="Inserte" dense
            :rules="[v => maxLengthInput(100, v), alphanumeric]" :disable="isPorAprobar"></q-input>
        </span>
      </div>
    </template>
  </q-expansion-item>
</template>

<script setup>
import { computed, ref } from 'vue';

import { alphanumeric, inputRequired, maxLengthInput } from "src/helpers/validations"
import { sgdeaAxios } from 'src/services';

let props = defineProps(['datosGestion', 'validForm', 'form', 'isPorAprobar']);

const isNit = computed(() => {
  return (props.form.tipoDocumento === 'Sociedad Extranjera sin NIT en Colombia' || props.form.tipoDocumento === 'Número de Identificación Tributaria (NIT)');
});
const opTipoDoc = ref([
  "Cédula de Ciudadanía",
  "Cédula de Extranjería",
  "Carné Diplomático",
  "Fideicomiso, Fondos de Inversión Colectiva",
  "Fondo o Patrimonio Autónomo",
  "Número de Identificación Tributaria (NIT)",
  "Número Único de Identificación Personal (NUIP)",
  "Permiso Por Protección Temporal (PPT)",
  "Permiso Especial de Permanencia (PEP)",
  "Pasaporte",
  "Sociedad Extranjera sin NIT en Colombia",
  "Tarjeta de Identidad",
])

const options = ref(['Option1', 'Option2'])
const etapaForm = ref()

const clearAccionante = () => {
  props.form.primerNombre = ''
  props.form.segundoNombre = ''
  props.form.primerApellido = ''
  props.form.segundoApellido = ''
}

async function getPerson() {
  const tipoDoc = props.form.tipoDocumento === 'Cédula de Ciudadanía' ? 'cc' : '';
  const number = props.form.numeroDocumento ? props.form.numeroDocumento : '';

  if (tipoDoc !== '' && number !== '') {
    try {
      const response = await sgdeaAxios.get("/personas", {
        params: {
          tipoDocumento: tipoDoc,
          numeroDocumento: number
        }
      });
      props.form.primerNombre = response.data?.nombre1 || '';
      props.form.segundoNombre = response.data?.nombre2 || '';
      props.form.primerApellido = response.data?.apellido1 || '';
      props.form.segundoApellido = response.data?.apellido2 || '';
    } catch (error) {
      props.form.primerNombre = '';
      props.form.segundoNombre = '';
      props.form.primerApellido = '';
      props.form.segundoApellido = '';
    }
  }
}
</script>
