<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0  ">
      <BreadCrumbs :crumbs="routes" />
      <div class="tw-flex tw-justify-between tw-items-center tw-pt-4 ">

        <h1 class="tw-text-3xl tw-font-bold tw-my-4">Crear Fondo</h1>

      </div>
      <q-card class="tw-mt-[20px] tw-rounded-xl q-pa-lg" flat>
        <h3 class="tw-text-2xl tw-font-bold tw-pl-2 tw-pb-6">Fondo</h3>
        <q-form ref="fondosForm" @submit="createFondo">
          <div
            class="tw-grid tw-grid-cols-2 tw-gap-5 tw-mb-12 tw-border-b tw-border-b-gray-[#969EAF] [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2">
            <span class="">
              <label for="code" class="tw-text-label">Nombre Fondo * </label>
              <q-input v-model="form.nombre_fondo" label="Inserte" outlined class="mb-3"
                :rules="[rulesValidation, val => maxLengthInput(50, val)]" dense />
            </span>
            <span class="">
              <label for="description" class="tw-text-label">NIT Fondo * </label>
              <q-input v-model="form.nit_fondo" label="Inserte" outlined class="mb-3 " :rules="[rulesValidation,
                val => preciseLengthInput(9, val),
                val => onlyNumbers(val)
              ]" id="description" dense />


            </span>
            <span class="">
              <label for="initialDate" class="tw-text-label">Empresa *</label>
              <q-select v-model="form.id_empresa" label="Seleccione" outlined class="mb-3 " id="description"
                :options="options" dense :rules="[rulesValidationSelect]" />
            </span>
            <span class="tw-mb-4">
              <label class="tw-text-label" for="state">Estado</label>
              <div class="tw-flex items-center tw-justify-between">
                <p>{{ form.estado === true ? 'Activo' : 'Inactivo' }}</p>

                <q-toggle v-model="form.estado" :rules="[(val: boolean) => rulesValidation]" color="secondary"></q-toggle>
              </div>

            </span>
          </div>

          <div class="row tw-flex tw-justify-center tw-gap-2 [&>*]:tw-p-2">
            <q-btn label="Cancelar" color="accent" textColor="black" class="tw-rounded-lg col-2"
              @click="cancelModal = true" />
            <q-btn label="Crear" type="submit" color="secondary" class="tw-rounded-lg col-2"></q-btn>
          </div>
        </q-form>
      </q-card>
      <Modal v-model="cancelModal" title="¿Desea cancelar la acción?" :text="``" text-button="Si"
        @handleAccept="() => router.push('/SGDA/fondos')" label="Confirmar" cancelButton
        text-button-cancel="No"
        @close-modal="() => cancelModal = false" />
      <Modal v-model="showModal" title="Creación exitosa" :text="`Se ha creado con éxito el fondo ${form.nombre_fondo}.`"
        is-success text-button="¡Ok!" @handleAccept="handleModal" />
      <Modal v-model="errorModal" title="Error" text="¡Ha ocurrido un error!" :is-success="false" text-button="Aceptar"
        @handleAccept="handleModal" />
      <Modal v-model="validationsModal" title="¡UPS!" :text="validationText" :is-success="false" text-button="Aceptar"
        @handleAccept="validationsModal = false" />
    </main>
  </section>
</template>

<script  lang="ts" setup>
import { onMounted, ref, Ref, toRaw } from "vue";
import { adminAxios, sgdeaAxios } from 'src/services';

import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';

import { lengthInput, preciseLengthInput, onlyNumbers, maxLengthInput, validateNumber } from 'src/helpers/validations'


import { useRoute, useRouter } from "vue-router";
import Modal from 'components/Modal/Modal.vue';
import { useLoadingStore } from "src/stores/loading.store";

const options = ref([])
const validationsModal = ref(false)
let nitCollection = ref([])
const route = useRoute()
const router = useRouter()
const showModal = ref(false)
const errorModal = ref(false)
const cancelModal = ref(false)
const validationText = ref('')

interface Fondo {
  id_empresa: number | string,
  estado: boolean | string,
  nit_fondo: string | number,
  nombre_fondo: string,
  version: string,
}

const form: Ref<Fondo> = ref({
  id_empresa: '',
  estado: false,
  nit_fondo: '',
  nombre_fondo: '',
  version: ''
});
const createForm = ref()


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
    name: 'Crear Fondos',

  },

]


// two
onMounted(async () => {
  const { data: response } = await sgdeaAxios.get("/fondo");

  const collection = response.map((item) => {
    return item.nitFondo
  })

  const { data: { content } }: { data: { content: any[] } } = await adminAxios.get("/empresas/listado")
  options.value = content.map(it => ({ value: it.idEmpresa, label: it.nombre }))

  return (nitCollection.value = collection);
})

const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return 'Este campo es requerido'
  }
}

const rulesValidationSelect = (val) => (val || val === 0 || val === false ? true : "Este campo es requerido");


const createFondo = async () => {

  const response = await sgdeaAxios.post("/fondo/crear", {
    //@ts-ignore
    empresa_id: form.value.id_empresa.value,
    estado: form.value.estado,
    nit_fondo: parseInt(form.value.nit_fondo.toString()),
    nombre_fondo: form.value.nombre_fondo
  })


  if ([405, 401, 404, 400, 403, 500].includes(response?.status)) {
    errorModal.value = true
  } else if ([200, 201].includes(response.status)) {
    showModal.value = true
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
