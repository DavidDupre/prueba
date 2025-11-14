<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-w-full tw-p-7 tw-pt-0  ">

      <q-card class="tw-mt-[20px] tw-rounded-xl" flat>
        <h3 class="tw-text-2xl tw-font-bold tw-pl-2 tw-pb-6">Adición de pasillo</h3>
          <div
            class=" tw-gap-5 [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2">

                    <span class="tw-w-full">
                        <label for="code" class="tw-text-label">Número de pasillos * </label>
                        <q-select
                          v-model="form.numero_pasillos"
                          label="Inserte"
                          outlined
                          class="mb-3"
                          :rules="[rulesValidation]"
                          type="number"
                          dense
                          :options="['hola']"
                        />
                    </span>
          </div>

          <div class="tw-pb-12">
            <p>Seleccione los estantes que posee el pasillo *</p>
            <div class="tw-grid tw-grid-cols-3">
              <q-checkbox color="accent" label="Fijo" v-model="checkFijoValue" val="fijo"/>
              <div class="tw-flex tw-items-center tw-gap-2">
                <p>Cantidad</p>
                <q-input
                  label="Inserte"
                  dense
                  outlined
                  class="tw-w-[90px]"
                  :disable="!checkFijoValue"
                  :rules="[rulesValidation, v => lengthValidation(5, v)]"
                  type="number"
                  v-model="form.estantes_fijos"
                />
              </div>
              <div class="tw-flex tw-items-center tw-gap-2">
                <p>Capacidad</p>
                <q-input
                  label="Inserte"
                  dense
                  outlined
                  class="tw-w-[90px]"
                  :disable="!checkFijoValue"
                  :rules="[rulesValidation, v => lengthValidation(5, v)]"
                  type="number"
                  v-model="form.capacidad_estantes_fijos"
                />
              </div>
            </div>
            <div class="tw-grid tw-grid-cols-3 tw-mt-4">
              <q-checkbox color="accent" label="Rodante" v-model="checkRodanteValue" val="rodante"/>
              <div class="tw-flex tw-items-center tw-gap-2">
                <p>Cantidad</p>
                <q-input
                  label="Inserte"
                  dense
                  outlined
                  class="tw-w-[90px]"
                  :disable="!checkRodanteValue"
                  :rules="[rulesValidation, v => lengthValidation(5, v)]"
                  type="number"
                  v-model="form.estantes_rodantes"
                />
              </div>
              <div class="tw-flex tw-items-center tw-gap-2">
                <p>Capacidad</p>
                <q-input
                  label="Inserte"
                  dense
                  outlined
                  class="tw-w-[90px]"
                  :disable="!checkRodanteValue"
                  :rules="[rulesValidation, v => lengthValidation(5, v)]"
                  type="number"
                  v-model="form.capacidad_estantes_rodantes"
                />
              </div>
            </div>

          </div>

          <div
            class=" tw-gap-5 [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2">
              <span class="tw-w-full">
                  <label for="code" class="tw-text-label">Número total de entrepaños * </label>
                  <q-select
                    v-model="form.codigo"
                    label="Inserte"
                    outlined
                    class="mb-3"
                    :rules="[v => lengthValidation(5, v)]"
                    type="number"
                    dense
                    :options="['hola']"
                  />
              </span>
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

          <q-card class="q-mt-lg tw-py-7 tw-rounded-xl" flat>
            <div class="tw-flex tw-justify-between tw-items-center tw-mt-12 tw-mb-6">
              <p class="tw-text-2xl">Pasillos definidos</p>
              <q-btn v-if="rowsSelected.length" text-color="white" class="tw-bg-red-button" icon="delete">Eliminar ({{ rowsSelected.length }})</q-btn>
            </div>

            <Table
              :TABLE_HEADER="PASILLOS_DEFINIDOS_HEADER"
              :TABLE_BODY="dataTable"
              :selection="undefined"
              is-second-icon
              second-icon="delete"
              @handleEditData="editRow"
              v-model:item-selected="rowsSelected"
              row-id="#"
            />
          </q-card>
      </q-card>
      <Modal v-model="showModal" title="Asignación exitosa"
             :text="`Se ha creado con éxito ${form.codigo} ${form.descripcion}.`" is-success text-button="¡Ok!" @handleAccept="handleModal" />
      <Modal v-model="errorModal" title="Error"
             text="¡Ha ocurrido un error!" :is-success="false" text-button="Aceptar" @handleAccept="handleModal" />
    </main>
  </section>
</template>


<script  lang="ts" setup>
import {ref, Ref, watch} from "vue";
import { client } from 'src/services';

import { ICrearSerie, routes } from "./index"
import {useRoute, useRouter} from "vue-router";
import Modal from 'components/Modal/Modal.vue';
import Table from 'src/components/Table.vue';
import { PASILLOS_DEFINIDOS_HEADER } from "./index";
import moment from "moment";
import {useUbicationStore} from "stores/ubicacion.store";

const route = useRoute()
const router = useRouter()
const showModal = ref(false)
const errorModal = ref(false)
const checkFijoValue = ref(false)
const checkRodanteValue = ref(false)
const rowsSelected = ref([])

const props = defineProps<{
  step: number,
}>()


const form: Ref<any> = ref({
  numero_pasillos: '',
  estantes_fijos: '',
  capacidad_estantes_fijos: '',
  estantes_rodantes: '',
  capacidad_estantes_rodantes: '',
  total_entrepanos: ''
});

const createForm = ref();
const isEditButton = ref(false)
const store = useUbicationStore()

const dataTable = [
  {
    '#': 1,
    pasillo: 'pasillo',
    numero_pasillos: 1,
    estantes_fijos: 1,
    capacidad_estantes_fijos: 1,
    estantes_rodantes: 2,
    capacidad_estantes_rodantes: 1,
    total_entrepanos: 1
  }
]

watch(form, (newForm) => {
  store.saveData(newForm, props.step)
}, { deep: true });

const lengthValidation = (n: number, val: string) => val?.length <= n || 'Maximo ' + n + ' Caracteres';

const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return 'Este campo es requerido'
  }
}

const editRow = (id: number) => {
  isEditButton.value = true
  form.value = dataTable.find((item: any) => item['#'] === id)
}

const cleanForm = () => {
  form.value = {
    pasillo: '',
    numero_pasillos: '',
    estantes_fijos: '',
    capacidad_estantes_fijos: '',
    estantes_rodantes: '',
    capacidad_estantes_rodantes: '',
    total_entrepanos: ''
  }
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
