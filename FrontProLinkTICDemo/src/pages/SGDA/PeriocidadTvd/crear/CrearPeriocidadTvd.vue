<template>
  <main>
    <BreadCrumbs :crumbs="routes" class="tw-pl-6" />
    <div class="tw-flex tw-justify-between tw-items-center tw-pt-4 tw-mb-8">
      <h2 class="tw-font-bold tw-text-4xl tw-pl-8 tw-py-4">Crear periodicidad TVD</h2>
    </div>

    <q-form ref="form" class="tw-mt-3 tw-h-full" @submit.prevent="createPeriocidad" @reset="clearPeriocidad">

      <div class="tw-w-full flex justify-center items-center tw-flex-col tw-gap-4">

        <div class="flex tw-flex-col tw-w-11/12 tw-gap-4  tw-bg-white tw-p-8 tw-rounded-lg flex-wrap ">

          <div class="flex tw-gap-4">
            <span class="tw-w-full">
              <label class="tw-text-label">Nombre periodicidad *</label>
              <q-input v-model="formData.nombre_periodicidad" outlined class="tw-rounded-lg" label="Inserte" dense
                :rules="[(val) => rulesValidation(val, 50), val => !!val || ' Campo  Requerido']" />
            </span>
          </div>

          <div class="tw-flex tw-gap-6">
            <span class="tw-w-1/2">
              <label class="tw-text-label" for="">Fecha inicio periodo *</label>
              <DatePickerComponent v-model:input-data-prop="formData.fecha_inicio_periodo" label="aaaa / mm / dd"
                :rules="[val => !!val || ' Campo  Requerido']" mask="YYYY/MM/DD" />
            </span>
            <span class="tw-w-1/2">
              <label class="tw-text-label" for="">Fecha final periodo *</label>
              <DatePickerComponent v-model:input-data-prop="formData.fecha_fin_periodo"
                :options="date => date >= formData.fecha_inicio_periodo" label="aaaa / mm / dd"
                :rules="[val => !!val || ' Campo  Requerido']" mask="YYYY/MM/DD" />
            </span>
          </div>
        </div>

        <span v-if="showActions" class="w-full flex justify-center tw-gap-4 tw-mt-8">
          <q-btn label="Cancelar" color="accent" textColor="black" class="tw-rounded-lg tw-p-2 tw-w-[200px]"
            type="reset"></q-btn>
          <q-btn label="Crear" type="submit" color="secondary" class="tw-rounded-lg tw-w-[200px] text-bold"></q-btn>
        </span>
      </div>
    </q-form>

    <Modal v-model="confirmModal" title="¡Espera un momento!" text="¿Está seguro de abandonar la creación de la periodicidad TVD en curso?" :is-success="false"
      text-button="SI" @handleAccept="() => router.push('/SGDA/periocidad-tvd')" @closeModal="confirmModal = false"
      text-button-cancel="NO" cancel-button />
    <Modal v-model="showModal" title="Creación exitosa"
      :text="`La periodicidad  '${periodicidad_creada} + ${formData.nombre_periodicidad}'  ha sido creada correctamente`" is-success text-button="¡Ok!"
      @handleAccept="() => router.push('/SGDA/periocidad-tvd')"  />
    <Modal v-model="errorModal" title="Error" text="¡Ha ocurrido un error!" :is-success="false" text-button="Aceptar"
      @handleAccept="closeModal" />
  </main>
</template>

<script lang="ts" setup>

import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { secondFormatDate } from "src/helpers/formtDate";

import DatePickerComponent from "components/FormFields/datePickerComponent.vue";
import BreadCrumbs from "components/BreadCrumbs/BreadCrumbs.vue"
import Modal from 'src/components/Modal/Modal.vue'
import { sgdeaAxios } from 'src/services';



const formData = ref({
  nombre_periodicidad: "",
  fecha_inicio_periodo: "",
  fecha_fin_periodo: "",
  codigo_periodicidad: 0,
  estado: true,
  id: 0,
  observacion: "",
  fecha_periodicidad: "",
});

let periodicidad_creada = 0;


const showActions = ref(true);
const form = ref()

const q = useQuasar();
const route = useRoute()
const router = useRouter()
const showModal = ref(false)
const errorModal = ref(false)
const confirmModal = ref(false);

const createPeriocidad = async () => {
  const response = await sgdeaAxios.post("/periodicidadtvd/periodicidadtvd", {
    ...formData.value,
    fecha_fin_periodo: secondFormatDate(formData.value.fecha_fin_periodo),
    fecha_inicio_periodo: secondFormatDate(formData.value.fecha_inicio_periodo),
  })

  if ([405, 401, 404, 400, 403, 500].includes(response?.status)) {
    errorModal.value = true
  } else if ([200, 201, 204].includes(response.status)) {
    periodicidad_creada = response.data;
    showModal.value = true
  }
}

const rulesValidation = (val: any, number?: number) => {
  if (val?.length > number) {
    return `Solo se permiten ${number} caracteres`
  }
}


const clearPeriocidad = () => {
  confirmModal.value = true

}

const closeModal = () => {
  if (showModal.value) {
    showModal.value = false

  }

  errorModal.value = false
  confirmModal.value = false
}
const routes = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'Módulo SGDEA',
  },
  {
    name: 'Clasificación documental',
  },
  {
    name: 'Periocidad TVD',
    to: '/SGDA/periocidad-tvd'
  },
  {
    name: 'Crear Periocidad',
  }
]
</script>

<style lang="scss"></style>
