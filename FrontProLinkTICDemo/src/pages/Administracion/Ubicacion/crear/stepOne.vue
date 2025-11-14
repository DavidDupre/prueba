<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-w-full tw-p-7 tw-pt-0  ">

      <q-card class="tw-mt-[20px] tw-rounded-xl" flat>
        <h3 class="tw-text-2xl tw-font-bold tw-pl-2 tw-pb-6">Depósito</h3>

          <div
            class=" tw-gap-5 [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2">

                    <span class="tw-w-full">
                        <label for="code" class="tw-text-label">Nombre ubicación * </label>
                        <q-input v-model="form.descripcion" label="Inserte" outlined class="mb-3"
                                 dense :rules="[rulesValidation, v => lengthValidation(20, v)]"/>
                    </span>
          </div>

          <div class="tw-grid tw-grid-cols-2 tw-gap-x-5 tw-mb-6  tw-border-b-gray-[#969EAF] [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2">
                  <span class="">
                        <label for="initialDate" class="tw-text-label">Sede *</label>
                        <q-input v-model="form.descripcion" label="Buscar" outlined class="mb-3"
                                 dense>
                          <template v-slot:append>
                            <q-icon name="search" />
                          </template>
                        </q-input>
                    </span>
            <span class="">
                        <label for="endingDate" class="tw-text-label">Fondo</label>
                         <q-input v-model="form.descripcion" label="Buscar" outlined class="mb-3"
                                  dense>
                          <template v-slot:append>
                            <q-icon name="search" />
                          </template>
                        </q-input>
                    </span>
            <span class="tw-mt-5">
                      <label for="endingDate" class="tw-text-label">Dependencia *</label>
                       <q-input v-model="form.descripcion" label="Buscar" outlined class="mb-3"
                                dense>
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                    </span>
            <span></span>
          </div>
          <div class="tw-mb-12">
            <label class="tw-text-label" for="state">Detalle</label>
            <q-input v-model="form.descripcion" label="Buscar" outlined class="mb-3"
                     dense type="textarea" :rules="[v => lengthValidation(500, v)]">
            </q-input>
          </div>
          <h3 class="tw-text-2xl tw-font-bold tw-pl-2 tw-pb-6">Pasillos</h3>
          <div
            class=" tw-gap-5 [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2">

                    <span class="tw-w-full">
                        <label for="code" class="tw-text-label">Número de pasillos * </label>
                        <q-input v-model="form.codigo" label="Inserte" outlined class="mb-3"
                                 type="number" dense :rules="[v => lengthValidation(5, v), rulesValidation]"/>
                    </span>
          </div>

      </q-card>
      <Modal v-model="showModal" title="Asignación exitosa"
             :text="`Se ha creado con éxito ${form.codigo} ${form.descripcion}.`" is-success text-button="¡Ok!" @handleAccept="handleModal" />
      <Modal v-model="errorModal" title="Error"
             text="¡Ha ocurrido un error!" :is-success="false" text-button="Aceptar" @handleAccept="handleModal" />
    </main>
  </section>
</template>


<script  lang="ts" setup>
import { ref, Ref, watch } from "vue";
import { client } from 'src/services';

import { ICrearSerie, routes } from "./index"
import {useRoute, useRouter} from "vue-router";
import Modal from 'components/Modal/Modal.vue';
import moment from "moment";
import {useUbicationStore} from "stores/ubicacion.store";

const route = useRoute()
const router = useRouter()
const showModal = ref(false)
const errorModal = ref(false)
const createForm = ref()
const store = useUbicationStore()

const props = defineProps<{
  step: number,
}>()

const form: Ref<any> = ref({
  descripcion: "",
  estados: false,
  fecha_vigencia_inicial:  moment(new Date()).format("YYYY-MM-DD"),
  fecha_vigencia_final:  moment(new Date()).format("YYYY-MM-DD"),
});


const lengthValidation = (n: number, val: string) => val.length <= n || 'Máximo ' + n + ' carácteres'

const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return 'Este campo es requerido'
  }
}

watch(form, (newForm) => {
  store.saveData(newForm, props.step)
}, { deep: true });

const handleModal = () => {
  if (showModal.value) {
    showModal.value = false
    router.push('/SGDA/series')
  } else {
    errorModal.value = false
  }
}

</script>
