<template>
  <div>
    <div class='tw-flex tw-justify-between tw-items-center'>

      <div>
        <p class="pl-4 tw-font-bold tw-text-3xl tw-mt-5 tw-mb-3 text-bold">Caso #845784</p>
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

      <div class="tw-flex tw-gap-2">
        <q-btn
          label="Rechazar"
          text-color="secondary"
          outline
          @click="showModal = true"
        />
        <q-btn
          label="Aprobar"
          color="secondary"
        />
      </div>
    </div>

    <div class="tw-flex tw-gap-2 tw-my-4">
      <div v-for="{label, icon} in items" class="tw-flex tw-gap-1 tw-justify-center tw-items-center tw-border tw-rounded-xl tw-px-2">
        <q-icon :name="icon" style="color: #787E8C"/>
        <p class="tw-text-gray-dark">
          {{label}}
        </p>
      </div>

    </div>
    <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2">Listado de documentos cargados</h2>
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
    />
  </div>

  <section>
    <q-dialog v-model="showModal">
      <q-card class="tw-p-5 tw-w-[400px] tw-h-10/12">
        <h2 class="tw-font-bold tw-text-lg tw-pb-3">Cargar documento</h2>
        <p>Cargue sus documentos de respuestas aquí</p>
        <div class="tw-rounded-lg  tw-mt-3">
          <p class="tw-text-label tw-font-semibold">Seleccione la plantilla</p>
          <q-select :options="[{ label: 'Reservada', value: 1 }, { label: 'Clasificada', value: 2 }]" map-options
                    emit-value  outlined
                    label="Seleccione" dense />
          <p class="tw-text-label tw-font-semibold tw-mt-5">¿Es documento de salida?</p>
          <q-select :options="[{ label: 'Reservada', value: 1 }, { label: 'Clasificada', value: 2 }]" map-options
                    emit-value  outlined
                    label="Seleccione" dense />

          <div class="tw-flex tw-gap-2 tw-justify-center tw-items-center tw-pt-10">
            <q-btn
              label="Cancelar"
              text-color="secondary"
              outline
              @click="showModal = false"
            />
            <q-btn
              label="Cargar"
              color="secondary"
              icon="add"
            />
          </div>
        </div>
      </q-card>
    </q-dialog>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref, watch } from 'vue';

import { adminAxios } from 'src/services';
import { useDepartments, useMunicipalities } from 'src/composables/useVersion';
import { tipoRemitente } from "src/constantes/options";
import DatePicker from "components/FormFields/datePickerComponent.vue";
import Table from "components/Table.vue";
import { TRAZABILIDAD_HEADER } from "./";

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


const state = ref('Pendiente')
const step = ref(1)
const form = ref()
const dataTable = ref([
  {
    codigo: 'Mario Andres',
    dependencia: 'Documentacion',
    idSeriesubserie: 'De salida',
    descripcion: 'Oficina',
    cargado: 'Mario Andres',
    fecha: '10/12/2023',
    estado: 'Gola',
    asignar: 'hola',
    id: 1,
  },
  {
    codigo: 'Mario Andres',
    dependencia: 'Documentacion',
    idSeriesubserie: 'De salida',
    descripcion: 'Oficina',
    cargado: 'Mario Andres',
    fecha: '10/12/2023',
    estado: 'Gola',
    asignar: 'hola',
    id: 1,
  },
  {
    codigo: 'Mario Andres',
    dependencia: 'Documentacion',
    idSeriesubserie: 'De salida',
    descripcion: 'Oficina',
    cargado: 'Mario Andres',
    fecha: '10/12/2023',
    estado: 'Gola',
    asignar: 'hola',
    id: 1,
  },
])

const items = ref([
  {
    label: 'Información General',
    icon: 'info'
  },
  {
    label: 'Trazabilidad',
    icon: 'history'
  },
  {
    label: 'Documentos relacionados',
    icon: 'folder_open'
  },
  {
    label: 'Incluir expediente',
    icon: 'summarize'
  },
  {
    label: 'Comentarios',
    icon: 'forum'
  },
  {
    label: 'Asignar',
    icon: 'room_preferences'
  },
  {
    label: 'Metadatos',
    icon: 'feed'
  },
  {
    label: "Reasignar",
    icon: "move_up",
  },
])
const showModal = ref(false)
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

</script>

<style lang="scss">

</style>
