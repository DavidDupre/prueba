<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0  ">
      <BreadCrumbs :crumbs="routes" />
      <div class="tw-flex tw-justify-between tw-items-center tw-pt-4 ">

        <h1 class="tw-text-3xl tw-font-bold tw-my-4">Editar Fondo</h1>

      </div>
      <q-card class="tw-mt-[20px] tw-rounded-xl q-pa-lg" flat>
        <h3 class="tw-text-2xl tw-font-bold tw-pl-2 tw-pb-6">Fondo</h3>
        <q-form ref="createForm" @submit="Fondo">
          <div
            class="tw-flex tw-flex-wrap tw-justify-between tw-gap-5 tw-mb-12 tw-border-b tw-border-b-gray-[#969EAF] [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2">
            <span class="tw-w-[48%]">
              <label for="description" class="tw-text-label">Nombre Fondo * </label>
              <q-input v-model="form.nombre" label="Inserte" outlined class="mb-3 "
                :rules="[rulesValidation, val => maxLengthInput(50, val)]" id="description" dense />

            </span>
            <span class="tw-w-[48%]">
              <label for="initialDate" class="tw-text-label">NIT Fondo *</label>
              <q-input v-model="form.nit_fondo" label="Inserte" disable outlined class="mb-3 " :rules="[rulesValidation]"
                id="description" dense />
            </span>
            <span class="tw-w-[48%]">
              <label for="initialDate" class="tw-text-label">Empresa *</label>
              <q-select v-model="form.empresa" map-options emit-value :options="options" label="Inserte" readonly outlined
                class="mb-3 " disable :rules="[rulesValidation]" id="description" dense />
            </span>
            <span class="tw-w-[48%]">
              <label class="tw-text-label" for="state">Estado</label>
              <div class="tw-flex items-center tw-justify-between">
                <p>{{ form.estado === true ? 'Activo' : 'Inactivo' }}</p>

                <q-toggle v-model="form.estado" color="secondary"></q-toggle>
              </div>

            </span>

            <span class="tw-w-full ">
              <label for="description" class="tw-text-label">Observaciones </label>
              <q-input v-model="form.observacion" label="Inserte" outlined class="mb-3"
                :rules="[val => lengthInput(250, val)]" id="description" dense />

            </span>
          </div>

          <div class="row tw-flex tw-justify-center tw-gap-2 [&>*]:tw-p-2">
            <q-btn label="Cancelar" color="accent" textColor="black" class="tw-rounded-lg col-2"
              @click="cancelModal = true" />
            <q-btn label="Editar" type="submit" color="secondary" class="tw-rounded-lg col-2"></q-btn>
          </div>
        </q-form>
      </q-card>
      <Modal v-model="cancelModal" title="¿Desea cancelar la acción?" :text="``" text-button="Si"
        text-button-cancel="No"
        @handleAccept="() => router.push('/SGDA/fondos')" label="Confirmar" cancelButton
        @close-modal="() => cancelModal = false" />
      <Modal v-model="showModal" title="Edición exitosa" :text="`Se ha editado con éxito.`" is-success text-button="¡Ok!"
        @handleAccept="handleModal" />
      <Modal v-model="errorModal" title="Error" text="¡Ha ocurrido un error!" :is-success="false" text-button="Aceptar"
        @handleAccept="handleModal" />
      <Modal v-model="validationsModal" title="¡UPS!" :text="validationText" :is-success="false" text-button="Aceptar"
        @handleAccept="validationsModal = false" />
    </main>
  </section>
</template>

<script  lang="ts" setup>
import { onMounted, ref, Ref } from "vue";
import Modal from 'components/Modal/Modal.vue';
import { adminAxios, sgdeaAxios } from "src/services";
import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';

import { lengthInput, preciseLengthInput, onlyNumbers, maxLengthInput, alphanumeric } from 'src/helpers/validations'


import { useRoute, useRouter } from "vue-router";
import { useLoadingStore } from "src/stores/loading.store";

const routes = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'Módulo Administración',
  },
  {
    name: 'Fondos',
    to: '/SGDA/fondos'

  },
  {
    name: 'Editar Fondo',
    to: '/SGDA/fondos/editar'

  },

]

const route = useRoute()
const router = useRouter()
const showModal = ref(false)
const cancelModal = ref(false)
const errorModal = ref(false)
const options = ref([])

const form: Ref<any> = ref({
  codigo: '',
  nombre: '',
  nit_fondo: '',
  empresa: '',
  estado: false,
  observacion: '',
});
const createForm = ref()
const validationsModal = ref(false)
const validationText = ref('')
const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return 'Este campo es requerido'
  }
}

onMounted(async () => {
  const { data: response } = await sgdeaAxios.get("/fondo");
  if (response)  {
    let filteredItem = response.find((item: any) => {
      return item.idFondo == route.params.id
    })

    form.value = {
      codigo: filteredItem.codigo,
      nombre: filteredItem.nombre,
      nit_fondo: filteredItem.nitFondo,
      empresa: filteredItem.empresa.idEmpresa,
      estado: filteredItem.estado,
      observacion: filteredItem.observacion ? filteredItem.observacion : "",
    }

    const { data: { content } }: { data: { content: any[] } } = await adminAxios.get("/empresas/listado")
    options.value = content.map(it => ({ value: it.idEmpresa, label: it.nombre }))
  }
})

const Fondo = async () => {

  const response = await sgdeaAxios.put("/fondo", {
    estado: form.value.estado,
    //@ts-ignore
    id_fondo: parseInt(route.params.id),
    nombre: form.value.nombre,
    observacion: form.value.observacion

  })

  if ([405, 401, 404, 400, 403, 500].includes(response?.status)) {
    errorModal.value = true;
  } else if ([200, 201].includes(response.status)) {
    showModal.value = true;
  } else if ([203].includes(response.status)) {
    validationsModal.value = true
    validationText.value = response?.data.message
  }

}


const handleModal = () => {
  if (showModal.value) {
    showModal.value = false
    router.push('/SGDA/fondos')
  } else {
    errorModal.value = false
  }
}

</script>
