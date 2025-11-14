<template>
  <div class='tw-mb-6'>
    <p class="pl-4 tw-font-bold tw-text-xl tw-mt-5 tw-mb-3 text-bold">Selecciona una etapa procesal</p>
    <div class="tw-flex tw-gap-x-16">
      <div class="tw-flex tw-flex-col tw-gap-y-2 tw-items-center tw-justify-center tw-cursor-pointer"
           v-for="{label} in items" @click="handleItem(label)">

        <q-icon name="trip_origin" size="lg" :color="step === label ? 'secondary' : 'grey-6'"/>
        <p :class="[step === label ? 'tw-black tw-font-semibold' : 'tw-text-gray-dark']">{{ label }}</p>
      </div>
    </div>
  </div>

  <q-form ref="form" @submit.prevent="submit">
    <section>
      <p class="pl-4 tw-font-bold tw-text-xl tw-mt-5 tw-mb-3 text-bold">Datos del proceso</p>
      <div class="tw-grid tw-grid-cols-4 tw-gap-4">

        <div class="tw-col-span-2">
          <p class="tw-text-label tw-font-semibold">Radicados asignados a la etapa procesal</p>
          <q-input v-model='formData.tipoDocumentoRemitente' label="Inserte" dense filled disable/>
        </div>
        <div class="tw-col-span-2">
          <p class="tw-text-label tw-font-semibold">Número de siniestro</p>
          <q-input v-model='formData.tipoDocumentoRemitente' label="Inserte" dense outlined />
        </div>
        <div class="tw-col-span-2">
          <p class="tw-text-label tw-font-semibold">Dependencia</p>
          <q-select :options="tipoDocumento" map-options emit-value outlined
                    v-model='formData.tipoDocumentoRemitente' label="Inserte" dense />
        </div>
        <div class="tw-col-span-2">
          <p class="tw-text-label tw-font-semibold">Causal</p>
          <q-input v-model='formData.tipoDocumentoRemitente' label="Inserte" dense outlined />
        </div>
        <div class="tw-col-span-2">
          <p class="tw-text-label tw-font-semibold">Tiempo de respuesta</p>
          <q-input v-model='formData.tipoDocumentoRemitente' label="Inserte" dense outlined />
        </div>
        <div class="tw-col-span-2">
          <p class="tw-text-label tw-font-semibold">Estado de etapa</p>
          <q-select :options="tipoDocumento" map-options emit-value outlined
                    v-model='formData.tipoDocumentoRemitente' label="Inserte" dense />
        </div>
        <div class="tw-col-span-4">
          <p class="tw-text-label tw-font-semibold">Observación</p>
          <q-input v-model='formData.tipoDocumentoRemitente' label="Inserte" dense outlined type="textarea" />
        </div>
      </div>
    </section>
    <section>
      <p class="pl-4 tw-font-bold tw-text-xl tw-mt-5 tw-mb-3 text-bold">Datos del accionante</p>
      <div class="tw-grid tw-grid-cols-4 tw-gap-4">

        <div class="tw-col-span-2">
          <p class="tw-text-label tw-font-semibold">Tipo de documento*</p>
          <q-input v-model='formData.tipoDocumentoRemitente' label="Inserte" dense outlined />
        </div>
        <div class="tw-col-span-2">
          <p class="tw-text-label tw-font-semibold">Número de documento*</p>
          <q-input v-model='formData.tipoDocumentoRemitente' label="Inserte" dense outlined />
        </div>
        <div class="tw-col-span-2">
          <p class="tw-text-label tw-font-semibold">Primer nombre*</p>
          <q-select :options="tipoDocumento" map-options emit-value outlined
                    v-model='formData.tipoDocumentoRemitente' label="Inserte" dense />
        </div>
        <div class="tw-col-span-2">
          <p class="tw-text-label tw-font-semibold">Segundo nombre</p>
          <q-input v-model='formData.tipoDocumentoRemitente' label="Inserte" dense outlined />
        </div>
        <div class="tw-col-span-2">
          <p class="tw-text-label tw-font-semibold">Primer apellido*</p>
          <q-input v-model='formData.tipoDocumentoRemitente' label="Inserte" dense outlined />
        </div>
        <div class="tw-col-span-2">
          <p class="tw-text-label tw-font-semibold">Segundo apellido</p>
          <q-input v-model='formData.tipoDocumentoRemitente' label="Inserte" dense outlined />
        </div>
      </div>
    </section>
    <section>
      <p class="pl-4 tw-font-bold tw-text-xl tw-mt-5 tw-mb-3 text-bold">Datos del afectado</p>
      <div class="tw-grid tw-grid-cols-4 tw-gap-4">

        <div class="tw-col-span-2">
          <p class="tw-text-label tw-font-semibold">Tipo de documento*</p>
          <q-input v-model='formData.tipoDocumentoRemitente' label="Inserte" dense outlined />
        </div>
        <div class="tw-col-span-2">
          <p class="tw-text-label tw-font-semibold">Número de documento*</p>
          <q-input v-model='formData.tipoDocumentoRemitente' label="Inserte" dense outlined />
        </div>
        <div class="tw-col-span-2">
          <p class="tw-text-label tw-font-semibold">Primer nombre*</p>
          <q-select :options="tipoDocumento" map-options emit-value outlined
                    v-model='formData.tipoDocumentoRemitente' label="Inserte" dense />
        </div>
        <div class="tw-col-span-2">
          <p class="tw-text-label tw-font-semibold">Segundo nombre</p>
          <q-input v-model='formData.tipoDocumentoRemitente' label="Inserte" dense outlined />
        </div>
        <div class="tw-col-span-2">
          <p class="tw-text-label tw-font-semibold">Primer apellido*</p>
          <q-input v-model='formData.tipoDocumentoRemitente' label="Inserte" dense outlined />
        </div>
        <div class="tw-col-span-2">
          <p class="tw-text-label tw-font-semibold">Segundo apellido</p>
          <q-input v-model='formData.tipoDocumentoRemitente' label="Inserte" dense outlined />
        </div>
      </div>
    </section>

    <section>
      <p class="pl-4 tw-font-bold tw-text-xl tw-mt-5 tw-mb-3 text-bold">Cargue de documentos</p>
      <div class="tw-grid tw-grid-cols-4 tw-gap-4">

        <div class="tw-col-span-4">
          <p class="tw-text-label tw-font-semibold">Adjunte los documentos</p>
          <File  outlined label="Seleccione" dense />
        </div>
      </div>
    </section>
  </q-form>

  <div class="col col-12 row justify-center  tw-w-full tw-m-[10px] tw-mt-10 tw-flex tw-gap-4">
    <q-btn label="Cancelar" textColor="black" class=" tw-rounded-xl tw-p-3" />
    <q-btn type="submit" label="Insertar" @click="submit" color="secondary" textColor="white"
           class="tw-rounded-xl  tw-p-3" />
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
</template>

<script lang="ts" setup>
import File from "components/FormFields/FileLoader.vue";
import Modal from 'components/Modal/Modal.vue';

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

import { onUpdated, onMounted, Ref, ref, watch } from 'vue';
import BreadCrumbs from 'components/BreadCrumbs/BreadCrumbs.vue';
import FileLoader from 'components/FormFields/FileLoader.vue';
import otp from '../confirmacion.vue'
import successPage from '../exitoso.vue'
import { client, adminAxios } from 'src/services';
import { useDepartments, useMunicipalities } from 'src/composables/useVersion';
import { tipoRemitente, tipoDocumento, condicionEspecialOptions, genOptions, medioOptions, tipoSolicitudOptions, tipoProductoOptions, tipoPqrdOptions } from "src/constantes/options"
const form = ref()
const confirmModal = ref(false)
const step = ref('Avoco')

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

const items = ref([
  {
    label: 'Avoco',
  },
  {
    label: 'Fallo de primera instancia',
  },
  {
    label: 'Fallo de segunda instancia',
  },
  {
    label: 'Revision corte',
  },
])

const submit = async () => {
  confirmModal.value = true
}

const handleItem = (label: string) => {
  step.value = label
}

const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return 'Este campo es requerido'
  }
  return true
}

const lengthValidation = (n, val: string) => val.length < n || 'Maximo ' + (n - 1) + ' Caracteres'


</script>
