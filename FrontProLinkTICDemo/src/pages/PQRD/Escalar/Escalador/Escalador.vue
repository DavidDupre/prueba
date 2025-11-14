<template>
  <div>
    <div class='tw-mb-4 tw-flex tw-items-center tw-justify-between'>

      <p class="pl-4 tw-font-bold tw-text-3xl tw-mt-5 text-bold">Casos</p>
      <div class="q-gutter-x-md">
        <q-btn label="Rechazar" outline @click="() => showModal = true" />
        <q-btn label="Aprobar" color="secondary" @click="() => confirmModal = true" />
      </div>
    </div>

    <section>
      <div class="tw-grid tw-grid-cols-4 tw-gap-x-4">
        <div class="tw-col-span-1">
          <p class="tw-text-label tw-font-semibold">Estado</p>
          <q-select :options="tipoRemitente" map-options emit-value outlined v-model='formData.estado'
                    label="Inserte" dense />
        </div>
        <div class="tw-col-span-1">
          <p class="tw-text-label tw-font-semibold">Número de radicado</p>
          <q-input type="number" outlined v-model='formData.radicado' label="Inserte" dense
                   />
        </div>
        <div class="tw-col-span-1">
          <p class="tw-text-label tw-font-semibold">Fecha de vencimiento</p>
          <DatePicker v-model='formData.fecha' label="Seleccione" dense />
        </div>
      </div>
    </section>
    <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2 tw-mt-4">Listado de casos</h2>
    <Table
      :TABLE_HEADER="ASIGNACION_HEADER "
      :TABLE_BODY="dataTable"
      :selection="undefined"
    />
    <CustomModal :show-modal="showModal" title-button="Rechazar">
      <div>
        <p class="pl-4 tw-font-bold tw-text-xl tw-mt-5 tw-mb-3">
          Rechazar caso
        </p>
        <p class="pl-4 tw-text-md tw-mt-2 tw-mb-3">
          Escriba aqui el motivo del rechazo
        </p>
        <div>
          <p class="tw-text-label tw-font-semibold">Observaciones</p>
          <q-input type="textarea" outlined v-model='formData.observaciones' label="Inserte" dense
          />
        </div>
      </div>
    </CustomModal>
    <Modal
      v-model="confirmModal"
      title="¡Espera un momento!"
      text="¿Está seguro que desea completar el caso?"
      text-button="Sí"
      @handleAccept="confirmModal = false"
      @closeModal="confirmModal = false"
      cancelButton
      text-button-cancel="No"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref, watch } from 'vue';

import DatePicker from "components/FormFields/datePickerComponent.vue";
import Table from "components/Table.vue";
import CustomModal from "components/Modal/CustomModal.vue";
import Modal from "components/Modal/Modal.vue";

import { tipoRemitente } from "src/constantes/options";

import { ASIGNACION_HEADER } from "../";

interface PQRD {
  observaciones: string;
  estado: string;
  radicado: string;
  fecha: string
}



const step = ref(1)
const form = ref()
const showModal = ref(false);
const confirmModal = ref(false)

const formData: Ref<PQRD> = ref({
  estado: '',
  radicado: '',
  fecha: '',
  observaciones: '',
})

const dataTable = ref([
  {
    codigo: 1222,
    solicitud: 'Solicitud',
    afectaod: 'Jose M',
    colaborador: 'Mario A',
    fecha: '11 / 11 / 2025',
    estado: 'Pendiente',
    caso: 'Asignar caso',
  }
])

const handleCaso = () => {
  showModal.value = true
}


</script>

<style lang="scss">

</style>
