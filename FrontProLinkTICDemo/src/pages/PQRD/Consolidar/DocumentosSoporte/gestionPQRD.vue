<template>
  <div>
    <div class='tw-flex tw-justify-between tw-items-center'>
      <div>
        <p class="pl-4 tw-font-bold tw-text-3xl tw-mt-5 tw-mb-3 text-bold">Caso #845784</p>
        <div>
          <div :class="['tw-flex tw-px-3 tw-items-center tw-gap-1 tw-rounded-lg tw-w-[110px]', state === 'Pendiente'
      ? 'tw-bg-yellow-100' :  state === 'Abierto' ? 'tw-bg-green-light': 'tw-bg-gray-texts']">
            <div  :class="['state-circle',
         state === 'Pendiente' ?
         'tw-bg-secondary'
         : state === 'Cerrado' ?
         'tw-border tw-border-secondary'
         : 'tw-hidden']"/>
            <span :class="['tw-font-semibold', state === 'abierto' ?? 'tw-text-secondary']">{{ state }}</span>

          </div>
        </div>
      </div>
      <div class="tw-flex tw-gap-2" v-if="labelComponet === 'Documentos relacionados'" >
        <q-btn
          label="Subir documento de respuesta"
          text-color="secondary"
          outline
          @click="modalDocuments = true"
        />
        <q-btn
          label="Subir un documento"
          color="secondary"
          icon="add"
        />
      </div>
    </div>
    <div class="tw-flex tw-gap-2 tw-my-4">
      <div v-for="{label, icon } in items"
           :class="['tw-cursor-pointer tw-flex tw-gap-1 tw-justify-center tw-items-center tw-border tw-rounded-xl tw-px-2',
           labelComponet === label ? 'tw-bg-gray-texts tw-border-gray-dark' : '']"
           @click="showComponents(label)"
      >
        <q-icon :name="icon" style="color: #787E8C"/>
        <p :class="[labelComponet === label ? 'tw-text-black' : 'tw-text-gray-dark']">
          {{label}}
        </p>
      </div>
    </div>
  </div>
  <DocumentosRelacionados v-if="labelComponet === 'Documentos relacionados'" :show-modal="modalDocuments" />
  <ParrafoRespuesta v-else />
</template>

<script lang="ts" setup>
import {computed, onMounted, Ref, ref, defineEmits} from 'vue';

import DocumentosRelacionados from "./documentosSoporte.vue";
import ParrafoRespuesta from "./ParrafoRespuesta/ParrafoRespuesta.vue";

const props = defineProps<{
  showModal: boolean,
}>()

const state = ref('Pendiente')
const step = ref(1)
const modalDocuments = ref(false)
const form = ref()
const labelComponet = ref('Documentos relacionados')
const items = ref([
  {
    label: 'Documentos relacionados',
    icon: 'folder_open'
  },
  {
    label: 'Párrafos de respuesta',
    icon: 'summarize'
  },
])
const dataTable = ref([
  {
    formato: 'PDF',
    nombre: 'Documentacion',
    documento: 'De salida',
    fecha: '10/12/2023',
    cargado: 'Mario Andres',
    id: 1,
  },
  {
    formato: 'PDF',
    nombre: 'Documentacion',
    documento: 'De salida',
    fecha: '10/12/2023',
    cargado: 'Mario Andres',
    id: 2
  },
  {
    formato: 'PDF',
    nombre: 'Documentacion',
    documento: 'De salida',
    fecha: '10/12/2023',
    cargado: 'Mario Andres',
    id: 3
  },
  {
    formato: 'PDF',
    nombre: 'Documentacion',
    documento: 'De salida',
    fecha: '10/12/2023',
    cargado: 'Mario Andres',
    id: 4
  },
  {
    formato: 'PDF',
    nombre: 'Documentacion',
    documento: 'De salida',
    fecha: '10/12/2023',
    cargado: 'Mario Andres',
    id: 5
  },
])

const currentURL = ref();
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

const emit = defineEmits(['update:modelValue'])

const handleThridIcon =  (id: number) => {
  currentURL.value = `${window.location.href}/editar/${id}`;
  window.open(currentURL.value, '_blank');
}

const open = computed({
  get() {
    return props.showModal
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const showComponents = (name: string) => {
  labelComponet.value = name
}
</script>

<style lang="scss">

</style>
