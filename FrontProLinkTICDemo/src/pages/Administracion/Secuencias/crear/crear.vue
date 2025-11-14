<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0  ">
      <BreadCrumbs :crumbs="crear_routes" />
      <div class="tw-flex tw-justify-between tw-items-center tw-pt-4 ">

        <h1 class="tw-text-3xl tw-font-bold tw-my-4">Crear Secuencia</h1>

      </div>
      <q-card class="tw-mt-[20px] tw-rounded-xl q-pa-lg" flat>
          <h3 class="tw-text-2xl tw-font-bold tw-pl-2 tw-pb-6">Tipo de Secuencia</h3>
          <q-form @submit.prevent="createTipoSecuencia" ref="createTypeForm">
            <div
              class="tw-grid tw-grid-cols-6 tw-gap-4 tw-border-b tw-border-b-gray-[#969EAF] tw-h-auto [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2">

              <span class="tw-col-span-3">
                <label for="code" class="tw-text-label">Nombre del Tipo de Secuencia * </label>
                <q-input name="nombre" v-model="dataType.nombre" label="Inserte" outlined class="mb-3" dense
                  :rules="[inputRequired, v => maxLengthInput(50, v)]" />
              </span>
              <span class="tw-col-span-3">
                <label for="code" class="tw-text-label">Nombre Corto del tipo de secuencia * </label>
                <q-input name="nombreCorto" v-model="dataType.nombreCorto" label="Inserte" outlined class="mb-3" dense
                  :rules="[inputRequired, v => maxLengthInput(20, v)]" />
              </span>
            </div>

            <div class="row tw-flex tw-mt-20 tw-justify-center tw-cols-6 tw-gap-2 [&>*]:tw-p-2">
              <q-btn label="Limpiar" color="accent" textColor="black" class="tw-rounded-lg col-2"
                @click="dataType.nombre = ''; dataType.nombreCorto = ''" />
              <q-btn label="Crear" type="submit" color="secondary" class="tw-rounded-lg col-2"></q-btn>
            </div>
          </q-form>
        </q-card>
      <q-card class="tw-mt-[20px] tw-rounded-xl q-pa-lg" flat>
        <h3 class="tw-text-2xl tw-font-bold tw-pl-2 tw-pb-6">Secuencia</h3>
        <q-form @submit.prevent="createSecuencia" ref="createForm">
          <div
            class="tw-grid tw-grid-cols-6 tw-gap-4 tw-border-b tw-border-b-gray-[#969EAF] tw-h-auto [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2">

            <span class="tw-col-span-3">
              <label for="code" class="tw-text-label">Nombre Secuencia * </label>
              <q-input v-model="data.nombre" label="Inserte" outlined class="mb-3" dense
                :rules="[inputRequired, v => maxLengthInput(50, v)]" />
            </span>
            <span class="tw-col-span-3">
              <label for="code" class="tw-text-label">Nombre Corto </label>
              <q-input v-model="data.nombreCorto" label="Inserte" outlined class="mb-3" dense
                :rules="[v => maxLengthInput(20, v)]" />
            </span>
            <span class="tw-col-span-3">
              <label for="code" class="tw-text-label">Funcionalidad * </label>
              <q-select outlined v-model="data.idTipoSecuencia" :options="optionsEntidades" label="Seleccione" dense
                :rules="[inputRequired]" />
            </span>
            <span class="tw-col-span-3">
              <label for="code" class="tw-text-label">Prefijo</label>
              <q-input v-model="data.prefijo" label="Inserte" outlined class="mb-3" dense
                :rules="[v => maxLengthInput(5, v)]" />
            </span>
            <span class="tw-col-span-3">
              <label for="code" class="tw-text-label">Cantidad de dígitos * </label>
              <q-input v-model="data.digitosSecuencia" label="Inserte" outlined class="mb-3" dense type="text"
                :rules="[inputRequired, onlyNumbers,  v => maxLengthInput(9, v)]" />
            </span>
            <span class="tw-col-span-3">
              <label for="code" class="tw-text-label">Sufijo *</label>
              <q-input v-model="data.sufijo" label="Inserte" outlined class="mb-3" dense
                :rules="[inputRequired, v => maxLengthInput(5, v)]" />
            </span>

            <!-- <section class='tw-w-full tw-col-span-6 tw-flex tw-flex-row tw-h-[490px]'>
              <p class="tw-text-gray-500 tw-text-[16px] tw-py-8">Seleccione los datos adicionales para la parametrizacion
                del proceso seleccionado</p>
              <q-table :rows="rows" :columns="columns" row-key="id" hide-pagination card-class="card-table"
                table-header-class="header-class" rows-per-page-options="6">
                <template v-slot:body-cell-name="{ row }">
                  <td>
                    <p class="tw-text-[15px] tw-font-extralight tw-text-left">{{ row.name }}</p>
                  </td>
                </template>
                <template v-slot:body-cell="{ row, col }">
                  <td> -->
                    <!-- {{ JSON.stringify(row) + JSON.stringify(col) }} -->
                    <!-- <q-radio v-model="row[col.field]" :id="row.name" :name="row.name" :val="false"></q-radio> -->
                    <!-- <q-radio v-model="row[col.field]" :val="true" size="xs"/>
                  </td>

                </template>
              </q-table>
            </section> -->

            <div class="tw-col-span-6 tw-h-[200px]">
              <p class="tw-text-label">Comentario</p>
              <q-input outlined v-model="data.comentario" label="Inserte" class="tw-h-5"
                type="textarea" dense :rules="[v => maxLengthInput(1000, v)]" />
            </div>

            <span class="tw-col-span-3">
              <label class="tw-text-label" for="state">Reinicio Anual</label>
              <div class="tw-flex items-center tw-justify-between">
                <p>{{ data.reinicioAnual === true ? 'Activo' : 'Inactivo' }}</p>

                <q-toggle v-model="data.reinicioAnual" color="secondary"></q-toggle>
              </div>

            </span>

          </div>

          <div class="row tw-flex tw-mt-20 tw-justify-center tw-cols-6 tw-gap-2 [&>*]:tw-p-2">
            <q-btn label="Cancelar" color="accent" textColor="black" class="tw-rounded-lg col-2"
              @click="cancelModal = true" />
            <q-btn label="Crear" type="submit" color="secondary" class="tw-rounded-lg col-2"></q-btn>
          </div>
        </q-form>
      </q-card>
      <Modal v-model="cancelModal" title="¡Espera un momento!"
        text="¿Está seguro de abandonar la creación de la secuencia en curso?" text-cancel-button="NO" text-button="SI"
        @handleAccept="router.push('/administracion/secuencias')" cancel-button @closeModal="() => cancelModal = false"
        text-button-cancel="NO" />
      <Modal v-model="showModal" title="Creación exitosa"
        :text="`La Secuencia ${successMessage} fue creada correctamente.`" is-success text-button="¡Ok!"
        @handleAccept="handleModal" />
      <Modal v-model="errorModal" title="Error" :text="`${errorMessage}`" :is-success="false" text-button="Aceptar"
        @handleAccept="handleModal" />
    </main>
  </section>
</template>

<script  lang="ts" setup>
import { onMounted, ref, Ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';
import Modal from 'components/Modal/Modal.vue';

import { inputRequired, lengthInput, maxLengthInput, onlyNumbers, preciseLengthInput } from "src/helpers/validations";
import { sgdeaAxios } from '../../../../services/index';
import {
  columns,
  crear_routes,
} from "../";
import { SelectInput, TipoSecuencia } from "src/interfaces";
import { QForm } from "quasar";

const data = ref({
  comentario: '',
  digitosSecuencia: '',
  idTipoSecuencia: '',
  nombre: '',
  nombreCorto: '',
  prefijo: '',
  reinicioAnual: false,
  sufijo: ''
})

const dataType = ref({
  nombre: '',
  nombreCorto: '',
})

const route = useRoute()
const router = useRouter()
const showModal = ref(false)
const errorModal = ref(false)
const createdSequenceType = ref(false)
const optionsEntidades: Ref<SelectInput[]> = ref([]);
const cancelModal = ref(false)

const createForm = ref()
const createTypeForm: Ref<QForm | null> = ref()

let errorMessage = "¡Ha ocurrido un error!";
let successMessage = "";

const getData = async () => {
  const {data} = await sgdeaAxios.get<TipoSecuencia[]>('/tipo_secuencia/all')
  optionsEntidades.value = data.map(item => ({
    label: item.nombre,
    value: item.id
  }))
}

onMounted(async () => await getData())

const createSecuencia = async () => {
  createdSequenceType.value = false;

  // let parametrizacionObject = {};

  const value = {
    antesPrefijo: false,
    despuesPrefijo: false,
    antesSufijo: false,
    despuesSufijo: false,
  };

  if (await createForm.value.validate()) {
    const response = await sgdeaAxios.post("/secuencias", {
      ...data.value,
      //@ts-ignore
      idTipoSecuencia: data.value.idTipoSecuencia.value
    })

    if ([405, 401, 404, 400, 403, 500].includes(response?.status)) {
      errorMessage = "¡Ha ocurrido un error!";
      if (typeof response.data?.message == "string") {
        errorMessage = response.data.message;
      }
      errorModal.value = true
    } else if ([200, 201].includes(response.status)) {
      successMessage = `${response.data.idSecuencia} - ${response.data.nombre}`;
      showModal.value = true
    }
  }
}

const createTipoSecuencia = async () => {
  if (await createTypeForm.value.validate()) {
    const response = await sgdeaAxios.post('/tipo_secuencia/', { ...dataType.value, id: 0 })
    if ([405, 401, 404, 400, 403, 500].includes(response?.status)) {
      errorMessage = "¡Ha ocurrido un error!";
      if (typeof response.data?.message == "string") {
        errorMessage = response.data.message;
      }
      errorModal.value = true
    } else if ([200, 201].includes(response.status)) {
      successMessage = `${response.data.idSecuencia} - ${response.data.nombre}`;
      createdSequenceType.value = true;
      dataType.value = {
        nombre: '',
        nombreCorto: ''
      }
      showModal.value = true
    }
  }
}
const handleModal = () => {
  if (showModal.value) {
    showModal.value = false
    if (createdSequenceType.value) {
      getData();
      return;
    }
    router.push('/administracion/secuencias')
  } else {
    errorModal.value = false
  }
}

</script>


<style lang="scss">
.card-table {
  box-shadow: none !important;

  .header-class th {
    font-weight: 600 !important;
    font-size: 16px !important;
  }
}
</style>
