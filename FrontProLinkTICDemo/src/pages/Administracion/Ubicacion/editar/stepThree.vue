<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-w-full tw-p-7 tw-pt-0  ">

      <q-card class="tw-mt-[20px] tw-rounded-xl" flat>
        <h3 class="tw-text-2xl tw-font-bold tw-pl-2 tw-pb-6">Estantes</h3>
        <q-form ref="step3">
          <div
            class=" tw-grid tw-grid-cols-2 tw-gap-5 tw-mb-12 tw-border-b tw-border-b-gray-[#969EAF] [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2">

                    <span>
                        <label for="code" class="tw-text-label">Seleccione al pasillo al que pertenece * </label>
                        <q-select v-model="form.pasillo" label="Inserte" outlined class="mb-3"
                                  :rules="[rulesValidation]"
                                  type="number" dense :options="['hola']"/>
                    </span>
            <span>
                        <label for="code" class="tw-text-label">Seleccione al estante al que pertenece * </label>
                        <q-select v-model="form.estante" label="Inserte" outlined :rules="[rulesValidation]"
                                  type="number" dense :options="['hola']"/>
                    </span>
            <span>
                        <label for="code" class="tw-text-label">Número de entrepaño * </label>
                        <q-select v-model="form.entrepano" label="Inserte" outlined class="mb-3" :rules="[rulesValidation]"
                                  type="number" dense :options="['hola']"/>
                    </span>
            <span>
                        <label for="code" class="tw-text-label">Tipo de estante (capacidad) * </label>
                        <q-select v-model="form.capacidad_estante" label="Inserte" outlined class="mb-3" :rules="[rulesValidation]"
                                  type="number" dense :options="['hola']"/>
                    </span>
          </div>

          <div class="tw-pb-12">
            <p>Seleccione el tipo de contenedor que posee el entrepaño *</p>
            <div class="tw-grid tw-grid-cols-3">
              <q-field
                hide-bottom-space borderless
                item-aligned
                class=""
                v-model="radioValue"
                :rules="[val => val.length >= 1  || 'El Campo requerido']"
              >
                <q-option-group
                  :options="radioList"
                  label="Notifications"
                  type="radio"
                  v-model="radioValue"
                  class="tw-grid tw-grid-cols-2 tw-gap-x-16 tw-text-black"
                />
              </q-field>
              <div class="tw-flex tw-items-center tw-gap-2" v-if="radioValue.length">
                <p class="-tw-mt-4">Capacidad</p>
                <q-input
                  label="Inserte"
                  dense outlined
                  class="tw-w-[90px]"
                  :rules="[!isEditButton && (rulesValidation, v => lengthValidation(5, v))]"
                  type="number"
                  v-model="form.contenedor_capacidad"
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
              @click="router.push('/SGDA/series')"
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
              label="Agregar estante"
              type="submit"
              text-color="white"
              class="tw-rounded-lg tw-bg-[#003352] tw-w-[170px]"
              icon="add"
            >
            </q-btn>
          </div>
        </q-form>
      </q-card>

      <div class="tw-flex tw-justify-between tw-items-center tw-mt-12 tw-mb-6">
        <p class="tw-text-2xl tw-font-bold">Estantes definidos</p>
        <q-btn v-if="rowsSelected.length" text-color="white" class="tw-bg-red-button" icon="delete">Eliminar
          ({{ rowsSelected.length }})
        </q-btn>
      </div>

      <Table
        :TABLE_HEADER="ESTANTES_DEFINIDOS_HEADER"
        :TABLE_BODY="dataTable"
        selection="multiple"
        is-second-icon
        second-icon="delete"
        v-model:item-selected="rowsSelected"
        key-id="descripcion"
        row-id="#"
        @handleEditData="editRow"
      />

      <div class="tw-mb-12">
        <p class="tw-text-2xl tw-py-2 tw-pt-8 tw-font-bold">Observaciones</p>
        <label class="tw-text-label" for="state">Observaciones</label>
        <q-input v-model="form.descripcion" label="Inserte" outlined class="mb-3"
                 dense type="textarea" :rules="[rulesValidation, v => lengthValidation(200, v)]">
        </q-input>
      </div>
      <Modal v-model="showModal" title="Asignación exitosa"
             :text="`Se ha modificado con éxito.`" is-success text-button="¡Ok!" @handleAccept="handleModal"/>
      <Modal v-model="errorModal" title="Error"
             text="¡Ha ocurrido un error!" :is-success="false" text-button="Aceptar" @handleAccept="handleModal"/>
    </main>
  </section>
</template>


<script lang="ts" setup>
import {ref, Ref, watch} from "vue";
import {client} from 'src/services';

import {useRoute, useRouter} from "vue-router";
import Modal from 'components/Modal/Modal.vue';
import Table from 'src/components/Table.vue';
import {ESTANTES_DEFINIDOS_HEADER, radioList} from "./index";
import moment from "moment";
import {useUbicationStore} from "stores/ubicacion.store";

const props = defineProps<{
  step: number,
}>()

const route = useRoute()
const router = useRouter()
const showModal = ref(false)
const errorModal = ref(false)
const rowsSelected = ref([])
const step3 = ref()
const isEditButton = ref(false)

const form: Ref<any> = ref({
  pasillo: "",
  estante: "",
  entrepano: "",
  contenedor: '',
  capacidad_estante: "",
  contenedor_capacidad: ""
});

const createForm = ref();
const radioValue = ref([]);
const store = useUbicationStore()

watch(form, (newForm) => {
  store.saveData(newForm, props.step)
}, { deep: true });

const dataTable = [
  {
    '#': 1,
    pasillo: "pasillo",
    estante: "estante",
    entrepano: "entrepano",
    contenedor: 'tomos',
    capacidad_estante: 1,
    contenedor_capacidad: 2
  }
]

const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return 'Este campo es requerido'
  }
}
const lengthValidation = (n: number, val: string) => val?.length < n || 'Maximo ' + n + ' Caracteres'

const handleModal = () => {
  if (showModal.value) {
    showModal.value = false
    router.push('/SGDA/series')
  } else {
    errorModal.value = false
  }
}

const editRow = (id: number) => {
  isEditButton.value = true
  form.value = dataTable.find((item: any) => item['#'] === id)

  if (form.value.contenedor_capacidad){
    radioValue.value = form.value.contenedor
  }
}

function validate() {
  return step3.value?.validate()
}

defineExpose({
  validate
})

</script>
