<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-w-full tw-p-7 tw-pt-0  ">

      <q-card class="tw-mt-[20px] tw-rounded-xl" flat>
        <h3 class="tw-text-2xl tw-font-bold tw-pl-2 tw-pb-6">Adición de pasillo</h3>
        <q-form ref="step2">
          <div
            class=" tw-gap-5 [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2">

                    <span class="tw-w-full">
                        <label for="code" class="tw-text-label">Número de pasillos * </label>
                        <q-select v-model="form.pasillos" label="Inserte" outlined class="mb-3" :rules="[rulesValidation]"
                                  type="number" dense :options="['hola']" />
                    </span>
          </div>

          <div class="tw-pb-12 tw-mt-4">
            <p>Seleccione los estantes que posee el pasillo *</p>
            <div class="">
              <q-field hide-bottom-space borderless  class="tw-flex tw-flex-col" v-model="checkFijo" :rules="[val => val.length >= 1  || 'El Campo requerido']">
                <div>
                  <div class="tw-grid tw-grid-cols-3 tw-mt-4">
                    <q-checkbox
                      color="accent"
                      label="Fijo"
                      v-model="checkFijo"
                      val="fijo"
                      class="tw-text-black"
                    />
                    <div class="tw-flex tw-items-center tw-gap-2">
                      <p class="tw-text-black">Cantidad</p>
                      <q-input
                        label="Inserte" dense
                        outlined
                        class="tw-w-[110px]"
                        v-model="form.cantidad_fijo"
                        :rules="[(!isEditButton) && (val => val.length >= 1  || 'El Campo requerido', v => lengthValidation(5, v))]"
                        type="number"
                        :disable="checkFijo[0]!=='fijo'"
                      />
                    </div>
                    <div class="tw-flex tw-items-center tw-gap-2">
                      <p class="tw-text-black">Capacidad</p>
                      <q-input
                        label="Inserte" dense
                        outlined
                        class="tw-w-[110px]"
                        :rules="[!isEditButton && (rulesValidation, v => lengthValidation(5, v))]"
                        v-model="form.capacidad_fijo"
                        type="number"
                        :disable="checkFijo[0]!=='fijo'"
                      />
                    </div>
                  </div>
                  <div class="tw-grid tw-grid-cols-3 tw-mt-4">
                    <q-checkbox
                      color="accent"
                      label="Rodante"
                      v-model="checkFijo"
                      val="rodante"
                      class="tw-text-black"
                    />
                    <div class="tw-flex tw-items-center tw-gap-2">
                      <p class="tw-text-black">Cantidad</p>
                      <q-input
                        label="Inserte" dense
                        outlined class="tw-w-[90px]"
                        :rules="[!isEditButton && (rulesValidation, v => lengthValidation(5, v))]"
                        type="number"
                        v-model="form.cantidad_rodante"
                        :disable="checkFijo[0]!=='rodante'"
                      />
                    </div>
                    <div class="tw-flex tw-items-center tw-gap-2">
                      <p class="tw-text-black">Capacidad</p>
                      <q-input
                        label="Inserte" dense
                        outlined class="tw-w-[90px]"
                        :rules="[!isEditButton && (rulesValidation, v => lengthValidation(5, v))]"
                        type="number"
                        v-model="form.capacidad_rodante"
                        :disable="checkFijo[0]!=='rodante'"
                      />
                    </div>
                  </div>
                </div>
              </q-field>
            </div>

          </div>

          <div
            class=" tw-gap-5 [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2">
                <span class="tw-w-full">
                    <label for="code" class="tw-text-label">Número total de entrepaños * </label>
                    <q-select v-model="form.entrepanos" label="Inserte" outlined class="mb-3" :rules="[rulesValidation]"
                              type="number" dense :options="['hola']"/>
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

          <q-card class="q-mt-lg tw-p-7 tw-rounded-xl" flat>
            <div class="tw-flex tw-justify-between tw-items-center tw-mt-12 tw-mb-6">
              <p class="tw-text-2xl tw-pl-2 tw-font-bold">Pasillos definidos</p>
              <q-btn v-if="rowsSelected.length" text-color="white" class="tw-bg-red-button" icon="delete">Eliminar ({{ rowsSelected.length }})</q-btn>
            </div>
            <Table
              :TABLE_HEADER="PASILLOS_DEFINIDOS_HEADER"
              :TABLE_BODY="dataTable"
              selection="multiple"
              is-second-icon
              v-model:item-selected="rowsSelected"
              second-icon="delete"
              row-id="#"
              @handleEditData="editRow"
            />
          </q-card>
        </q-form>
      </q-card>
      <Modal v-model="showModal" title="Asignación exitosa"
             :text="`Se ha modificado con éxito ${form.codigo} ${form.descripcion}.`" is-success text-button="¡Ok!" @handleAccept="handleModal" />
      <Modal v-model="errorModal" title="Error"
             text="¡Ha ocurrido un error!" :is-success="false" text-button="Aceptar" @handleAccept="handleModal" />
    </main>
  </section>
</template>


<script  lang="ts" setup>
import { ref, Ref, watch} from "vue";
import { client } from 'src/services';

import { ICrearSerie, routes } from "./index"
import {useRoute, useRouter} from "vue-router";
import Modal from 'components/Modal/Modal.vue';
import Table from 'src/components/Table.vue';
import { PASILLOS_DEFINIDOS_HEADER } from "./index";
import {useUbicationStore} from "stores/ubicacion.store";

const props = defineProps<{
  step: number,
}>()

const route = useRoute()
const router = useRouter()
const showModal = ref(false)
const errorModal = ref(false)
const rowsSelected = ref([])
const isEditButton = ref(false)
const step2 = ref()
const checkFijo = ref([])
const checkRodante = ref(false)
const form: Ref<any> = ref({
  pasillos: "",
  entrepanos: '',
  fijo: '',
  rodante: '',
  capacidad_fijo: '',
  capacidad_rodante: '',
  cantidad_fijo: '',
  cantidad_rodante: '',
  checkFijo: false,
  checkRodante: false
});
const createForm = ref();
const store = useUbicationStore()

watch(form, (newForm) => {
  store.saveData(newForm, props.step)
}, { deep: true });

const dataTable = [
  {
    '#': 1,
    pasillos: "pasillos",
    entrepanos: 'entrepano',
    fijo: 'fijo',
    rodante: 'rodante',
    capacidad_fijo: 1,
    capacidad_rodante: 1,
    cantidad_fijo: 1,
    cantidad_rodante: 1
  }
]

const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return 'Este campo es requerido'
  }
}
const lengthValidation = (n: number, val: string) => val.length <= n || 'Máximo ' + n + ' carácteres'

const editRow = (id: number) => {
  isEditButton.value = true
  form.value = dataTable.find((item: any) => item['#'] === id)
  if (form.value.cantidad_fijo || form.value.capacidad_fijo){
    checkFijo.value[0] = 'fijo'
  }
  if(form.value.cantidad_rodante || form.value.capacidad_rodante) {
    checkFijo.value[1] = 'rodante'
  }
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
  checkFijo.value = []
}

const handleModal = () => {
  if (showModal.value) {
    showModal.value = false
    router.push('/SGDA/series')
  } else {
    errorModal.value = false
  }
}

function validate() {
  return step2.value?.validate()
}

defineExpose({
  validate
})

</script>
