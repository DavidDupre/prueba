<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-w-full tw-p-7 tw-pt-0  ">

      <q-card class="tw-mt-[20px] tw-rounded-xl" flat>
        <h3 class="tw-text-2xl tw-font-bold tw-pl-2 tw-pb-6">Depósito</h3>
        <q-form ref="step1">
          <div class="tw-grid tw-grid-cols-2 tw-gap-x-5 tw-mb-6  tw-border-b-gray-[#969EAF] [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2">
                <span>
                        <label for="code" class="tw-text-label">Código ubicación * </label>
                        <q-input v-model="form.codigo" label="Inserte" outlined class="mb-3"
                                 type="number" dense disable filled />
                    </span>
            <span>
                        <label for="code" class="tw-text-label">Nombre ubicación * </label>
                        <q-input v-model="form.nombre" label="Inserte" outlined class="mb-3" :rules="[rulesValidation, v => lengthValidation(20, v)]"
                                 dense />
                </span>
            <span>
                      <label for="initialDate" class="tw-text-label">Sede *</label>
                      <q-input v-model="form.sede" label="Buscar" outlined
                               dense disable filled>
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                  </span>
            <span class="tw-mt-5">
                <label for="endingDate" class="tw-text-label">Fondo</label>
                 <q-input v-model="form.fondo" label="Buscar" outlined class="mb-3"
                          dense>
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
                    </span>
            <span class="">
                      <label for="endingDate" class="tw-text-label">Dependencia *</label>
                       <q-input v-model="form.dependecia" label="Buscar" outlined class="mb-3"
                                dense disable filled>
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                    </span>
            <span></span>
          </div>
          <div class="tw-mb-5">
            <label class="tw-text-label" for="state">Detalle</label>
            <q-input v-model="form.detalle" label="Buscar" outlined class="mb-3"
                     dense type="textarea" :rules="[v => lengthValidation(200, v)]">
            </q-input>
          </div>
          <div class="tw-w-1/2 tw-mb-4">
            <p class="tw-text-label tw-font-bold">Estado</p>
            <div class="tw-flex tw-items-center tw-justify-between q-gutter-x-xl">
              <p>Inactivo</p>
              <q-toggle
                color="accent"
                v-model="form.estado"
              />
            </div>
          </div>
          <h3 class="tw-text-2xl tw-font-bold tw-pl-2 tw-pb-6 tw-border-t-2 tw-pt-8">Pasillos</h3>
          <div
            class=" tw-gap-5 [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2">

                    <span class="tw-w-full">
                        <label for="code" class="tw-text-label">Número de pasillos * </label>
                        <q-input v-model="form.pasillos" label="Inserte" outlined class="mb-3" :rules="[rulesValidation, v => lengthValidation(5, v)]"
                                 type="number" dense />
                    </span>
          </div>
        </q-form>
      </q-card>
      <Modal v-model="showModal" title="Asignación exitosa"
             :text="`Se ha creado con éxito ${form.codigo} ${form.descripcion}.`" is-success text-button="¡Ok!" @handleAccept="handleModal" />
      <Modal v-model="errorModal" title="Error"
             text="¡Ha ocurrido un error!" :is-success="false" text-button="Aceptar" @handleAccept="handleModal" />
    </main>
  </section>
</template>


<script  lang="ts" setup>
import { ref, Ref, computed, watch } from "vue";
import { client } from 'src/services';

import { ICrearSerie, routes } from "./index"
import {useRoute, useRouter} from "vue-router";
import Modal from 'components/Modal/Modal.vue';

import {useUbicationStore} from "stores/ubicacion.store";

const props = defineProps<{
  step: number,
}>()

const route = useRoute()
const router = useRouter()
const showModal = ref(false)
const errorModal = ref(false)
const step1 = ref()

const form: Ref<any> = ref({
  codigo: 2,
  sede: 'sede',
  dependecia: 'dependencia',
  nombre: "",
  estado: false,
  fondo: '',
  pasillos: '',
  detalle: ''
});
const createForm = ref()
const store = useUbicationStore()

function validate() {
  return step1.value?.validate()
}


watch(form, (newForm) => {
  store.saveData(newForm, props.step)
}, { deep: true });

const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return 'Este campo es requerido'
  }
}

const lengthValidation = (n: number, val: string) => val.length <= n || 'Máximo ' + n + ' carácteres'

const handleModal = () => {
  if (showModal.value) {
    showModal.value = false
    router.push('/SGDA/series')
  } else {
    errorModal.value = false
  }
}


defineExpose({
  validate
})

</script>
