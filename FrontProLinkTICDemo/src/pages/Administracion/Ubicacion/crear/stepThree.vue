<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-w-full tw-p-7 tw-pt-0  ">

      <q-card class="tw-mt-[20px] tw-rounded-xl" flat>
        <h3 class="tw-text-2xl tw-font-bold tw-pl-2 tw-pb-6">Estantes</h3>
          <div
            class=" tw-grid tw-grid-cols-2 tw-gap-5 tw-mb-12 tw-border-b tw-border-b-gray-[#969EAF] [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2">

                    <span>
                        <label for="code" class="tw-text-label">Seleccione al pasillo al que pertenece * </label>
                        <q-select v-model="form.pasillo" label="Inserte" outlined class="mb-3" :rules="[rulesValidation]"
                                  type="number" dense />
                    </span>
            <span>
                        <label for="code" class="tw-text-label">Seleccione al estante al que pertenece * </label>
                        <q-select v-model="form.estante" label="Inserte" outlined :rules="[rulesValidation]"
                                  type="number" dense />
                    </span>
            <span>
                        <label for="code" class="tw-text-label">Número de entrepaño </label>
                        <q-select v-model="form.entrepano" label="Inserte" outlined class="mb-3"
                                  type="number" dense />
                    </span>
            <span>
                        <label for="code" class="tw-text-label">Tipo de estante (capacidad) * </label>
                        <q-select v-model="form.capacidad_estanteria" label="Inserte" outlined class="mb-3" :rules="[rulesValidation]"
                                  type="number" dense />
                    </span>
          </div>

          <div class="tw-pb-12">
            <p>Seleccione el tipo de contenedor que posee el entrepaño *</p>
            <div class="tw-grid tw-grid-cols-2" >
              <q-radio   :label="label" v-model="radioValue" :val="value" v-for="{label, value} in radioList">

              </q-radio>
              <div class="tw-flex tw-items-center tw-gap-2 tw-mt-7" v-if="radioValue">
                <p>Capacidad</p>
                <q-input
                  label="Inserte"
                  dense
                  outlined
                  class="tw-w-[90px]"
                  v-model="form.contenedor"
                />
              </div>
            </div>
          </div>
          <div class="row tw-flex tw-justify-center tw-gap-2 [&>*]:tw-p-2">
            <q-btn
              label="Limpiar"
              color="accent"
              textColor="black"
              class="tw-rounded-lg tw-w-[170px]"
              @click="cleanForm"
            />
            <q-btn
              v-if="isEditButton"
              label="Actualizar Pasillo"
              type="submit"
              text-color="white"
              class="tw-rounded-lg tw-bg-[#003352] tw-w-[170px]"
            />
            <q-btn
              v-else
              label="Agregar pasillos"
              type="submit"
              text-color="white"
              class="tw-rounded-lg tw-bg-[#003352] tw-w-[170px]"
              icon="add"
            >
            </q-btn>
          </div>
      </q-card>

      <p class="tw-text-2xl tw-pl-6 tw-pt-8">Pasillos definidos</p>
      <Table
        :TABLE_HEADER="ESTANTES_DEFINIDOS_HEADER"
        :TABLE_BODY="dataTable"
        :selection="undefined"
        is-second-icon
        second-icon="delete"
        @handleEditData="editRow"
        v-model:item-selected="rowsSelected"
        row-id="#"
      />
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
import Table from 'src/components/Table.vue';
import { ESTANTES_DEFINIDOS_HEADER, radioList } from "./index";
import moment from "moment";
import {useUbicationStore} from "stores/ubicacion.store";

const route = useRoute()
const router = useRouter()
const showModal = ref(false)
const errorModal = ref(false)
const store = useUbicationStore()

const props = defineProps<{
  step: number,
}>()

const form: Ref<any> = ref({
  pasillo: '',
  estante: '',
  entrepano: '',
  capacidad_estanteria: '',
  contenedor: '',
  capacidad_contenedor: '',
});

const dataTable = [
  {
    '#': 1,
    pasillo: 'pasillo',
    estante: 'estante',
    entrepano: 'entrepano',
    capacidad_estanteria: 1,
    contenedor: 'carpetas',
    capacidad_contenedor: 'capacidad',
  }
]
const isEditButton = ref(false)
const radioValue = ref('')
const createForm = ref();

watch(form, (newForm) => {
  store.saveData(newForm, props.step)
}, { deep: true });

const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return 'Este campo es requerido'
  }
}


const editRow = (id: number) => {
  isEditButton.value = true
  form.value = dataTable.find((item: any) => item['#'] === id)
  radioValue.value = form.value.contenedor
}

const cleanForm = () => {
  form.value = {
    pasillo: '',
    estante: '',
    entrepano: '',
    capacidad_estanteria: '',
    contenedor: '',
    capacidad_contenedor: '',
  }
  radioValue.value = null
}

const handleModal = () => {
  if (showModal.value) {
    showModal.value = false
    router.push('/SGDA/series')
  } else {
    errorModal.value = false
  }
}

</script>
