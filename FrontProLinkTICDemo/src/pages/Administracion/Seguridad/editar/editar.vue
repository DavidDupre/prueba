<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0  ">
      <BreadCrumbs :crumbs="routes" />
      <div class="tw-flex tw-justify-between tw-items-center tw-pt-4 ">

        <h1 class="tw-text-3xl tw-font-bold tw-my-4">Editar Nivel de Seguridad</h1>

      </div>
      <q-card class="tw-mt-[20px] tw-rounded-xl q-pa-lg" flat>
        <h3 class="tw-text-2xl tw-font-bold tw-pl-2 tw-pb-6">Nivel de Seguridad</h3>
        <q-form ref="createForm" @submit='submit'>
          <div
            class="tw-grid tw-grid-cols-6 tw-gap-4 tw-border-b tw-border-b-gray-[#969EAF] tw-h-auto [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2">

            <span class="tw-col-span-3">
              <label for="code" class="tw-text-label">Codigo Nivel de Seguridad </label>
              <q-input v-model="form.codigo" readonly label="Inserte" outlined class="mb-3" :rules="[rulesValidation]" dense />
            </span>
            <span class="tw-col-span-3">
              <label for="code" class="tw-text-label">Nombre de Nivel de Seguridad * </label>
              <q-input v-model="form.nombre" label="Inserte" outlined class="mb-3" :rules="[rulesValidation]" dense />
            </span>

            <div class="tw-col-span-6 tw-h-[200px]">
              <p class="tw-text-label tw-font-bold">Descripcion *</p>
              <q-input outlined v-model="form.descripcion" :options="options" label="Procedimiento" class="tw-h-5" type="textarea"
                dense />
            </div>
            <span class="tw-col-span-3">
              <label class="tw-text-label" for="state">Estado</label>
              <div class="tw-flex items-center tw-justify-between">
                <p>{{ form.estado === true ? 'Activo' : 'Inactivo' }}</p>

                <q-toggle v-model="form.estado" :rules="[rulesValidation]" color="secondary"></q-toggle>
              </div>

            </span>


            <div class="tw-col-span-6 tw-h-[200px]">
              <p class="tw-text-label tw-font-bold">Observacion *</p>
              <q-input outlined v-model="form.observacion" :options="options" label="Procedimiento" class="tw-h-5" type="textarea"
                dense />
            </div>
          </div>

          <div class="row tw-flex tw-justify-center tw-cols-6 tw-gap-2 tw-pt-12 [&>*]:tw-p-2">
            <q-btn label="Cancelar" color="accent" textColor="black" class="tw-rounded-lg col-2"
              @click="router.push('/administracion/seguridad')" />
            <q-btn label="Editar" type="submit" color="secondary" class="tw-rounded-lg col-2"></q-btn>
          </div>
        </q-form>
      </q-card>
      <Modal v-model="showModal" title="Modificacion exitosa"
        :text="successMsg" is-success text-button="¡Ok!"
        @handleAccept="handleModal" />
      <Modal v-model="errorModal" title="Error" text="¡Ha ocurrido un error!" :is-success="false" text-button="Aceptar"
        @handleAccept="handleModal" />
    </main>
  </section>
</template>

<script  lang="ts" setup>
import { ref, Ref, onMounted } from "vue";

import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';

import { useRoute, useRouter } from "vue-router";
import Modal from 'components/Modal/Modal.vue';
import { sgdeaAxios } from "src/services";

const data = ref()
const successMsg = ref('')


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
    name: 'Editar Nivel de Seguridad',
    to: '/administracion/seguridad/editar'

  },

]

onMounted( async () => {
  const response = (await sgdeaAxios.get(`/nivelseguridad`)).data

  const item = response.find((item:any) => {
    return item.id == route.params.id
  })

    form.value = {
      codigo: item.codigo,
      descripcion: item.descripcion,
      estado: item.estado,
      id: item.id,
      nombre: item.nombre,
      observacion: item.observacion

    }

})

const route = useRoute()
const router = useRouter()
const showModal = ref(false)
const errorModal = ref(false)

const form: Ref<any> = ref({
codigo: '',
descripcion: '',
estado: false,
id: '',
nombre: '',
observacion: ''
});


const createForm = ref()

const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return 'Este campo es requerido'
  }
}

const submit = async () => {

    const response = (await client.put("/nivelseguridad", {
      codigo: form.value.codigo,
      descripcion: form.value.descripcion,
      estado: form.value.estado,
      id: form.value.id,
      nombre: form.value.nombre,
      observacion: form.value.observacion
    }))

    if ([405, 401, 404, 400, 403, 500].includes(response.response?.status)) {

     errorModal.value = true
    } else if ([200,201].includes(response.status)) {
    successMsg.value = `El nivel de seguridad "${form.value.codigo} + ${form.value.nombre}" fue modificado exitosamente.`
      showModal.value = true
    }
  }



const handleModal = () => {
  if (showModal.value) {
    showModal.value = false
    router.push('/administracion/seguridad')
  } else {
    errorModal.value = false
  }
}

</script>
