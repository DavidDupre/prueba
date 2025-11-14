<template>
  <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
    <div v-if="!showForm" class="tw-flex tw-gap-x-3">
      <div class="tw-w-[50%]">
        <div>
          <div class='tw-mb-6'>
            <p class="pl-4 tw-font-bold tw-text-xl tw-mt-5 tw-mb-3 text-bold">Radicado entrada</p>
            <div class="tw-grid tw-grid-cols-4 tw-gap-x-4">

              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Número de radicado de entrada</p>
                <p>3151202</p>
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Fecha de radicación de entrada</p>
                <p>14 / 04 / 2019</p>
              </div>
            </div>
          </div>

          <q-form ref="form" @submit.prevent="submit">
            <section>
              <p class="pl-4 tw-font-bold tw-text-xl tw-mt-5 tw-mb-3 text-bold">Información del proceso</p>
              <div class="tw-grid tw-grid-cols-4 tw-gap-x-4">

                <div class="tw-col-span-2">
                  <p class="tw-text-label tw-font-semibold">Departamento *</p>
                  <q-select :options="tipoRemitente" map-options emit-value outlined v-model='formData.tipoRemitente'
                            label="Inserte" dense :rules="[rulesValidation]" />
                </div>
                <div class="tw-col-span-2">
                  <p class="tw-text-label tw-font-semibold">Municipio *</p>
                  <q-select :options="tipoDocumento" map-options emit-value outlined
                            v-model='formData.tipoDocumentoRemitente' label="Inserte" dense />
                </div>
                <div class="tw-col-span-2">
                  <p class="tw-text-label tw-font-semibold">Tipo de documento accionante *</p>
                  <q-select :options="tipoDocumento" map-options emit-value outlined
                            v-model='formData.tipoDocumentoRemitente' label="Inserte" dense />
                </div>
                <div class="tw-col-span-2">
                  <p class="tw-text-label tw-font-semibold">Documento accionante</p>
                  <q-input v-model='formData.tipoDocumentoRemitente' label="Inserte" dense outlined />
                </div>
                <div class="tw-col-span-2 tw-mt-4">
                  <p class="tw-text-label tw-font-semibold">Nombre del accionante *</p>
                  <q-input v-model='formData.tipoDocumentoRemitente' label="Inserte" dense outlined />
                </div>
                <div class="tw-col-span-2">
                  <p class="tw-text-label tw-font-semibold">Tipo de documento afectado *</p>
                  <q-select :options="tipoDocumento" map-options emit-value outlined
                            v-model='formData.tipoDocumentoRemitente' label="Inserte" dense />
                </div>
                <div class="tw-col-span-2 tw-mt-4">
                  <p class="tw-text-label tw-font-semibold">Documento afectado</p>
                  <q-input v-model='formData.tipoDocumentoRemitente' label="Inserte" dense outlined />
                </div>
                <div class="tw-col-span-2 tw-mt-4">
                  <p class="tw-text-label tw-font-semibold">Nombre del afectado</p>
                  <q-input v-model='formData.tipoDocumentoRemitente' label="Inserte" dense outlined />
                </div>
                <div class="tw-col-span-4 tw-mt-4">
                  <p class="tw-text-label tw-font-semibold">Código del proceso</p>
                  <q-input v-model='formData.tipoDocumentoRemitente' label="Inserte" dense outlined />
                </div>
              </div>
            </section>
          </q-form>
        </div>

        <div class="col col-12 row justify-center  tw-w-full tw-m-[10px] tw-mt-10 tw-flex tw-gap-4">
          <q-btn label="Cancelar" textColor="black" class=" tw-rounded-xl tw-p-3 tw-w-[200px]" />
          <q-btn type="submit" label="Validar proceso" @click="submit" color="primary" textColor="white"
                class="tw-rounded-xl  tw-p-3 tw-w-[200px]" />
        </div>

        <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2">Resultados de la búsqueda</h2>
        <Table
          :TABLE_HEADER="TRAZABILIDAD_HEADER"
          :TABLE_BODY="dataTable"
          :selection="undefined"
          icon="visibility"
          is-second-icon
          second-icon="download"
          is-thrid-icon
          thrid-icon="print"
          row-id="id"
          key-id="id"
          :is-selection="false"
          @handleCaso="handleTable"
        />
      </div>

      <div class="tw-w-[50%] tw-mb-4">
        <iframe
          src="https://www.africau.edu/images/default/sample.pdf"
          style="overflow: hidden; pointer-events: none;"
          width="100%"
          height="100%"
        />
      </div>
      <Modal
        v-model="confirmModal"
        title="Confirmación"
        text="¿Está seguro que desea incluir el radicado en este proceso?"
        :is-success="false"
        text-button="SI"
        cancel-button
        text-button-cancel="NO"
        @handleAccept="confirmModal = false"
      />
    </div>
    <div v-else>
      <EtapasSteps />
    </div>
</q-card>

</template>

<script lang="ts" setup>
import Table from "components/Table.vue";
import Modal from "components/Modal/Modal.vue";

import EtapasSteps  from "./EtapaSteps/EtapaSteps.vue";

import { TRAZABILIDAD_HEADER } from ".";

interface PQRD {
  tipoRemitente: string;
  tipoDocumentoRemitente: string;
  numeroDocumentoRemitente: string;
  nombresRemitente: string;
  tipoDocumentoAfectado: string;
  numeroDocumentoAfectado: string;
  nombresAfectado: string;
  lgtbtq: boolean,
  sexo: string;
  condicionEspecial: string;
  correoAfectado: string;
  tlfCelularAfectado: string;
  tlfFijoAfectado: string;
  paisContacto: string;
  departamentoContacto: string;
  ciudadContacto: string;
  remitenteAfectado: boolean,
  direccionContacto: string;
  medioRespuestaContacto: string;
  tipologiaPQRD: string;
  tipoSolicitud: string;
  producto: string;
  accesopPublico: boolean;
  descripcionAccesoInfo: string;
  observaciones: string;
  documentos: string | FileList;
}

import { Ref, ref } from 'vue';
import { tipoRemitente, tipoDocumento } from "src/constantes/options"
const form = ref()
const showForm = ref(false)
const confirmModal = ref(false)

const formData: Ref<PQRD> = ref({
  tipoRemitente: '',
  tipoDocumentoRemitente: '',
  numeroDocumentoRemitente: '',
  nombresRemitente: '',
  tipoDocumentoAfectado: '',
  numeroDocumentoAfectado: '',
  nombresAfectado: '',
  lgtbtq: false,
  sexo: '',
  condicionEspecial: '',
  correoAfectado: '',
  tlfCelularAfectado: '',
  tlfFijoAfectado: '',
  paisContacto: '',
  departamentoContacto: '',
  ciudadContacto: '',
  remitenteAfectado: false,
  direccionContacto: '',
  medioRespuestaContacto: '',
  tipologiaPQRD: '',
  tipoSolicitud: '',
  producto: '',
  accesopPublico: false,
  descripcionAccesoInfo: 1,
  observaciones: '',
  documentos: '',
})

const dataTable = ref([
  {
    id: 1,
    red: 'Red Juzgado',
    abogado: 'Aboado',
    departamento: 'Bogota',
    nombres: 'Victoria',
    juzgado: 'Juzgado',
    documento: '1212121',
    nombre_afectado: 'Nombre afectado',
    caso: 'Seleccionar registro'
  }
])

const handleTable = (id: number) => {
  if (id) {
    showForm.value = true
  }
}

const submit = async () => {
  confirmModal.value = true
}


const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return 'Este campo es requerido'
  }
  return true
}

</script>

<style lang="scss">

</style>
