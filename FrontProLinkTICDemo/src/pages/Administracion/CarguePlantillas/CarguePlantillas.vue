<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0  ">
      <BreadCrumbs :crumbs="routes" />
      <div class="tw-flex tw-justify-between tw-pt-4 ">

        <h1 class="tw-text-3xl tw-font-bold">Cargar documento plantilla</h1>
        <q-btn
          label="Cargar plantilla"
          color="secondary"
          icon="add"
          class="tw-rounded-lg tw-flex-col gap-4 tw-h-[45px]"
          @click="loadFile = true">
        </q-btn>
      </div>
      <q-card class="q-mt-lg tw-p-7 tw-rounded-xl" flat>
        <div class="tw-flex tw-justify-between">
          <p class="tw-text-2xl tw-pl-6">Listado de plantillas</p>
          <q-btn
            v-if="rowsSelected.length"
            text-color="white"
            class="tw-bg-red-button"
            icon="delete"
            @click="confirmModal = true"
          >
            Eliminar ({{ rowsSelected.length }})
          </q-btn>
        </div>

        <Table
          :TABLE_HEADER="CARGUE_HEADER"
          :TABLE_BODY="dataTable"
          :msg-no-data="textSearch"
          selection="multiple"
          is-second-icon
          v-model:item-selected="rowsSelected"
          second-icon="visibility"
          icon="delete"
          row-id="codigo"
          key-id="codigo"
        />
        <Modal
          v-model="confirmModal"
          title="¡Espera un momento!"
          :text="confirmText"
          :is-success="false"
          text-button="SI"
          text-button-cancel="NO"
          cancel-button
          @handleAccept="deleteItems"
          @closeModal="confirmModal = false"
        />
        <Modal
          v-model="successModal"
          :title="titleSuccessModal"
          :text="confirmText"
          is-success
          text-button="¡Ok!"
          @handleAccept="closeModal"
        />
        <ModalFile
          v-model:file="file"
          v-model="loadFile"
          v-model:input-data-prop="selectValue"
          v-model:input-value="valueInput"
          title="Cargar plantilla"
          text-button="Guardar"
          @handle-accept="confirmModal = true"
          accept-file=".xlsx"
          :key="modalKey"
          is-input
          title-input="Nombre de plantilla"
        />
      </q-card>

    </main>
  </section>
</template>

<script  lang="ts" setup>

import {useRouter} from "vue-router";
import { Ref, ref, onMounted, watch } from "vue";
import Modal from "components/Modal/Modal.vue";
import ModalFile from "components/Modal/FileModal.vue";
import {
  CARGUE_HEADER,
  routes
} from ".";

import { formatDate } from "src/helpers/formtDate";

import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';
import DatePicker from 'src/components/FormFields/datePickerComponent.vue';
import Table from 'src/components/Table.vue';
import { sgdeaAxios } from "src/services";

const router = useRouter()
const rowsSelected = ref([])
const valueInput = ref('')
const file = ref([])
const textSearch = ref(null)
const confirmModal = ref(false)
const confirmText = ref('')
const successModal = ref(false)
const titleSuccessModal = ref('')
const loadFile = ref(false)
const modalKey = ref(0)
const dataTable: Ref<any> = ref([
  {
    id_seriesubserie: 0,
    descripcion: " ",
    estados: false,
    tipo_de_soporte: 0,
    id_padre: 0,
    fecha_vigencia_inicial: null,
    fecha_vigencia_final: null,
    observacion: ""
  }
])

onMounted( async () => {
  let response = (await sgdeaAxios.get(`/serie/serie`)).data;

  let series = response.filter((item:any) => {
    return item.padre === null
  })
  dataTable.value = series;
})



const getItems = async () => {
  const response = (await new httpClient('/serie/serie').get()).data;
  dataTable.value = response?.map((item: any) => ({
    ...item,
    fecha_vigencia_final: formatDate(item.fecha_vigencia_final),
    fecha_vigencia_inicial: formatDate(item.fecha_vigencia_inicial)
  }))
}

const deleteItems = async () => {
  confirmModal.value = false
  successModal.value = true
}

const closeModal = () => {
  confirmModal.value = false
  successModal.value = false
  loadFile.value = false
  modalKey.value++
}

watch(confirmModal, () => {
  if (rowsSelected.value.length) {
    rowsSelected.value.length === 1 ?
      confirmText.value = `¿Está seguro de eliminar  la plantilla text?`
      :  confirmText.value = `¿Está seguro de eliminar  ${rowsSelected.value.length} plantillas?`
  } else {
    file.value.length >= 2 ?
      confirmText.value = '¿Está seguro de cargar las plantilla seleccionadas?'
    : confirmText.value = '¿Está seguro de cargar la plantilla seleccionada?'
  }
})

watch(successModal, () => {
  if (rowsSelected.value.length) {
    titleSuccessModal.value = 'Eliminación exitosa'
    rowsSelected.value.length === 1 ?
      confirmText.value = `Se eliminó correctamente la plantilla: “Nombre plantilla:`
      :  confirmText.value = `Se eliminaron correctamente ${rowsSelected.value.length} plantillas?`
  } else {
    titleSuccessModal.value = 'Cargue exitoso'
    file.value.length >= 2 ?
      confirmText.value = `Se cargaron correctamente ${file.value.length} plantillas`
      : confirmText.value = 'Se cargó correctamente la plantilla Nombre de plantilla'

  }
})
</script>
