<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0  ">
      <BreadCrumbs :crumbs="routes" />
      <div class="tw-flex tw-justify-between tw-items-center tw-pt-4 ">

        <h1 class="tw-text-3xl tw-font-bold tw-my-4">Crear Nivel de Seguridad</h1>

      </div>
      <q-card class="tw-mt-[20px] tw-rounded-xl q-pa-lg" flat>
        <h3 class="tw-text-2xl tw-font-bold tw-pl-2 tw-pb-6">Nivel de Seguridad</h3>
        <q-form ref="createForm" @submit="submit">
          <div
            class="tw-grid tw-grid-cols-6 tw-gap-4 tw-border-b tw-border-b-gray-[#969EAF] tw-h-auto [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2">

            <span class="tw-col-span-6">
              <label for="code" class="tw-text-label">Nombre de Nivel de Seguridad * </label>
              <q-input v-model="form.nombre" label="Inserte" outlined class="mb-3" :rules="[rulesValidation]" dense />
            </span>
            <span class="tw-col-span-6">
              <label for="code" class="tw-text-label">Descripcion * </label>
              <q-input v-model="form.descripcion" label="Inserte" outlined class="mb-3" :rules="[rulesValidation]"
                dense />
            </span>




          </div>

          <div class="row tw-flex tw-justify-center tw-cols-6 tw-gap-2 tw-pt-12 [&>*]:tw-p-2">
            <q-btn label="Cancelar" color="accent" textColor="black" class="tw-rounded-lg col-2"
              @click="confirmModal = true" />
            <q-btn label="Crear" type="submit" color="secondary" class="tw-rounded-lg col-2"></q-btn>
          </div>
        </q-form>
      </q-card>
      <Modal v-model="showModal" title="Creación exitosa" :text="successMsg" is-success text-button="¡Ok!"
        @handleAccept="handleModal" />

      <Modal v-model="confirmModal" @close-modal="() => confirmModal = false" title="¡Espera un momento!"
        text="¿Estas seguro de abandonar la creacion del nivel de seguridad en curso?" textButtonCancel="No" cancelButton
        :is-success="false" text-button="Si" @handleAccept="handleModal" />
      <Modal v-model="errorModal" title="Error" text="¡Ha ocurrido un error!" :is-success="false" text-button="Aceptar"
        @handleAccept="handleModal" />
    </main>
  </section>
</template>

<script  lang="ts" setup>
import { ref, Ref } from "vue";

import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';

import { useRoute, useRouter } from "vue-router";
import Modal from 'components/Modal/Modal.vue';
import { sgdeaAxios } from "src/services";

const data = ref()

const routes = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'Administracion',
    to: '/administracion'
  },
  {
    name: 'Niveles de Seguridad',
    to: '/administracion/seguridad/'

  },
  {
    name: 'Crear Nivel de Seguridad',
    to: '/administracion/seguridad/crear'

  },

]

const successMsg = ref('')
const route = useRoute()
const router = useRouter()
const showModal = ref(false)
const errorModal = ref(false)
const confirmModal = ref(false)


const form: Ref<any> = ref({
  nombre: '',
  descripcion: '',
});
const createForm = ref()

const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return 'Este campo es requerido'
  }
}

const submit = async () => {

  const response = (await sgdeaAxios.post("/nivelseguridad/create", {
    nombre: form.value.codigo,
    descripcion: form.value.descripcion,
  }))

  if ([405, 401, 404, 400, 403, 500].includes(response.status)) {
    errorModal.value = true
  } else if ([200, 201].includes(response.status)) {
    successMsg.value = `El nivel de seguridad ${form.value.nombre} ${form.value.descripcion} se ha creado exitosamente`
    showModal.value = true
  }
}



const handleModal = () => {
  if (showModal.value) {

    showModal.value = false
    router.push('/administracion/seguridad')
  }
  else if (confirmModal.value) {
    router.push('/administracion/seguridad')
    confirmModal.value = false;
  }

  else {

    errorModal.value = false
  }
}

</script>
