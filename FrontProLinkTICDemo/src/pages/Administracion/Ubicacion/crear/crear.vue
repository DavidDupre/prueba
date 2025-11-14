<template>
  <div class="q-pa-md">
    <BreadCrumbs :crumbs="routes" class="tw-mb-8" />

    <h1 class="tw-text-3xl tw-font-bold tw-my-4">Crear Ubicación</h1>
    <q-form ref="form">
      <q-stepper v-model="step" ref="stepper" animated active-color="secondary" keep-alive>
        <q-step :name="1" prefix="1" :done="step > 1" title="Datos depósito">
          <StepOne :step="1"></StepOne>
        </q-step>

        <q-step :name="2" prefix="2" :done="step > 2" title="Definir pasillos">
          <StepTwo :step="2" />
        </q-step>

        <q-step :name="3" prefix="3" :done="step > 3" title="Definir estantes">
          <StepThree :step="3" />
        </q-step>

        <template v-slot:navigation>
          <q-stepper-navigation class="tw-flex tw-justify-center tw-gap-4">
            <q-btn v-if="step > 1" flat color="secondary" @click="step--" label="Regresar"
              class="q-ml-sm tw-bg-[#E0F3FE] tw-rounded-lg col-2" icon="chevron_left" />
            <q-btn @click="() => cancelModal = true" text-color="black" label="Cancelar" class="tw-rounded-lg"
              flat />
            <q-btn color="secondary" :label="step === 3 ? 'Crear' : 'Continuar'"
              :icon-right="step !== 3 && 'navigate_next'" class="tw-rounded-lg tw-text-center" @click="validateForms" />
            <Modal v-model="cancelModal" title="¿Está seguro de abandonar la creación de la ubicación en curso?"
              text-cancel-button="NO" text-button="SI" @handleAccept="handleCancel($refs.stepper.previous(), cancelModal)"
              cancel-button @closeModal="() => cancelModal = false" text-button-cancel="NO" />
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </q-form>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from "vue-router";

import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';
import Modal from 'components/Modal/Modal.vue';
import StepOne from "./stepOne.vue";
import StepTwo from "./stepTwo.vue";
import StepThree from "./stepThree.vue";

import { routes } from ".";


const step = ref(1);
const stepper = ref(null)
const form = ref();
const cancelModal = ref();
const route = useRoute()
const router = useRouter()

async function validateForms() {
  switch (step.value) {
    case 1:
      if (await form.value?.validate()) {
        stepper.value.next()
      }
      break;
    case 2:
      if (await form.value?.validate()) {
        stepper.value.next()
      }
      break;
    case 3:
      if (await form.value?.validate()) {
        stepper.value.next()
      }
      break;
    default:
      break;
  }
}

const handleCancel = (ref, close) => {
  if (close) {
    router.push('/administracion/ubicacion')
    cancelModal.value = false
  }

  return ref
}

</script>
