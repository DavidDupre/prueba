<template>
  <main>
    <BreadCrumbs :crumbs="routes" class="tw-pl-6" />
    <div class="tw-flex tw-justify-between tw-items-center tw-pt-4 tw-mb-8">
      <h2 class="tw-font-bold tw-text-4xl tw-pl-8 tw-py-4">Crear Versión</h2>
    </div>

    <q-form ref="form" class="tw-mt-3 tw-h-full" @submit.prevent="createVersion">

      <div class="tw-w-full flex justify-center items-center tw-flex-col tw-gap-4">

        <div class="flex tw-flex-col tw-w-11/12 tw-gap-4  tw-bg-white tw-p-8 tw-rounded-lg flex-wrap ">

          <div class="flex tw-gap-4">
            <span class="tw-w-full">
              <label class="tw-text-label">Nombre versión*</label>
              <q-input v-model="formData.nombreVersion" type="text" outlined class="tw-rounded-lg" label="Inserte" dense
                :rules="[(val) => rulesValidation(50, val), inputRequired, alphanumericNotSpecial]"></q-input>
            </span>
          </div>

          <div class="tw-flex tw-gap-6">
              <span class="tw-w-1/2">
                <label class="tw-text-label" for="">Fecha inicial*</label>
                <DatePickerComponent v-model:input-data-prop="formData.fechaInicio" label="Inserte" mask="YYYY-MM-DD" :rules="[inputRequired, validateDateWithoutLimit]" />
              </span>

              <div class="tw-w-1/2">
            <p class="tw-text-label">Fondo *</p>
            <q-select outlined v-model="formData.idFondo" :options="optionsFondo" map-options emit-value label="Seleccione" dense :rules="[inputRequired]" />
          </div>

          </div>
        </div>

        <span v-if="showActions" class="w-full flex justify-center tw-gap-4 tw-mt-8">

          <q-btn label="Cancelar" color="accent" textColor="secondary" class="tw-rounded-lg tw-p-2 tw-w-[200px]"
             @click="() => cancelModal = true"></q-btn>
          <q-btn label="Crear" type="submit" color="secondary" class="tw-rounded-lg tw-w-[200px] text-bold" />
        </span>
      </div>
    </q-form>
    <Modal v-model="cancelModal" title="¿Desea cancelar la acción?" text-cancel-button="NO" text-button="SI"
      @handleAccept="() => router.push('/SGDA/administracion-versionamiento')" cancel-button @closeModal="() => cancelModal = false"
      text-button-cancel="NO" />
    <Modal v-model="showModal" title="Creación exitosa" :text="`Se ha creado con éxito.`" is-success text-button="¡Ok!"
      @handleAccept="closeModal" />
    <Modal v-model="errorModal" title="Error" text="¡Ha ocurrido un error!" :is-success="false" text-button="Aceptar"
      @handleAccept="closeModal" />
  </main>
</template>

<script lang="ts" setup>

import { Ref, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import DatePickerComponent from "components/FormFields/datePickerComponent.vue";
import BreadCrumbs from "components/BreadCrumbs/BreadCrumbs.vue"
import Modal from 'components/Modal/Modal.vue'
import service from "src/services/Api";
import {  sgdeaAxios } from "src/services";
import {alphanumericNotSpecial, inputRequired, validateDate, validateDateWithoutLimit} from "src/helpers/validations";
import { Fondo, SelectInput } from 'src/interfaces';
import { useLoadingStore } from 'src/stores/loading.store';

const formData = ref({
  nombreVersion: "",
  fechaInicio: "",
  fechaFin: "2030-12-31",
  idFondo: ""
});

const showActions = ref(true);
const cancelModal = ref(false)
const showModal = ref(false)
const errorModal = ref(false)
const form = ref()
const optionsFondo: Ref<SelectInput[]> = ref([])
const router = useRouter()

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
    name: 'Administracion de Versionamiento',
    to: '/SGDA/administracion-versionamiento'
  },
  {
    name: 'Crear versión',
  }
]

onMounted(async () => {
  const { data }  = await sgdeaAxios.get<Fondo[]>("/fondo/FondosActivos");
  optionsFondo.value = data.map((it) => ({
    value: it.idFondo,
    label: it.nombre
  }))
})

const createVersion = async () => {

  if (form.value.validate()) {

    service
      .createAdministracionVerion({
        ...formData.value,
        id_fondo: formData.value.idFondo
      })
      .then((result) => {

        showModal.value = true
      })
      .catch((error) => {

        errorModal.value = true
      });
  }
}

const requiredInput = (val: any) => {
  if (val?.length === 0 || val === null) {
    return 'Este campo es requerido'
  }
}

const rulesValidation = (n: number, val: string) => val.length < n || 'Maximo ' + n + ' Caracteres'

const handleModal = async () => {
  const response = await sgdeaAxios.post("/versionestrd/", formData)

  if ([405, 401, 404, 400, 403, 500].includes(response?.status)) {
    errorModal.value = true
  } else if ([200, 201].includes(response.status)) {
    showModal.value = true
  }
}

const closeModal = () => {
  if (showModal.value) {
    showModal.value = false
    router.push('/SGDA/administracion-versionamiento')
  }

  errorModal.value = false
  cancelModal.value = false
}
</script>

<style lang="scss"></style>
