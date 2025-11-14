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

    </div>
    <div class="tw-flex tw-gap-2 tw-my-4">
      <div class="tw-cursor-pointer tw-flex tw-gap-1 tw-justify-center tw-items-center tw-border tw-rounded-xl tw-px-2
          tw-bg-gray-texts tw-border-gray-dark"
      >
        <q-icon name="content_copy" style="color: #787E8C"/>
        <p class="tw-text-black">
          Clonación
        </p>
      </div>
    </div>
    <section>
      <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2">Asignación para clonación</h2>
    </section>

    <section>
      <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-4">Asignación</h2>
      <div class="tw-flex">
        <div class="q-pr-md col-xs-12 col-sm-12 col-md-6 col-lg-6 q-pt-none">
          <q-card class="tw-rounded-2xl tw-px-6 tw-py-4 tw-w-full 2xl:tw-w-full lg:tw-w-[560px] md:tw-w-full sm:tw-w-full" flat bordered>
            <p class="tw-text-lg tw-font-semibold">Seleccione los usuarios que desea asignar al rol</p>
            <div class="tw-flex tw-justify-between">
              <div class="tw-w-2/4 tw-mb-4">
                <p class="tw-text-label tw-font-semibold">Filtrar por Usuario</p>
                <q-select :options="[]" map-options emit-value outlined v-model='formData.tipoRemitente'
                          label="Seleccione" dense  />
              </div>
              <q-checkbox label="Asignador responsable" size="sm" />
            </div>

            <Table
              :TABLE_HEADER="ASIGNACION_HEADER"
              :TABLE_BODY="dataTable"
              v-model:item-selected="item"
              key-id="grupo"
            />
          </q-card>
        </div>
        <div class="row col-xs-12 col-sm-12 col-md-6 col-lg-6  q-pl-md q-pt-none">
          <q-card bordered flat class="q-pa-md tw-rounded-2xl tw-min-w-min tw-w-[400px]" :key="selectedTable">
            <div class="">
              <p class="tw-text-lg tw-font-semibold">Estos son los tipos documentales que has seleccionado</p>
              <q-chip removable color="dark" t outline v-model="item[n]" v-for="(i, n) in item">
                {{ i.colaborador }}
              </q-chip>
            </div>
          </q-card>
        </div>
      </div>
    </section>

    <section>
      <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-6">Motivo de Asignación</h2>
      <div class="">
        <div class="tw-col-span-1">
          <p class="tw-text-label tw-font-semibold">Observaciones*</p>
          <q-input type="textarea" :rules="[rulesValidation, (v) => lengthValidation(1500, v)]" outlined dense
                   v-model:model-value="formData.observaciones" />
        </div>
      </div>
    </section>
    <div class="justify-center  tw-w-full tw-m-[10px] tw-mt-10 tw-mb-6 tw-flex tw-gap-4">
      <q-btn label="Cancelar" textColor="black" class=" tw-rounded-xl tw-p-3" />
      <q-btn type="submit" label="Clonar" @click="showModal = true" color="secondary" textColor="white"
             class="tw-rounded-xl  tw-p-3" />
    </div>
    <Modal
      v-model="showModal"
      title="¡Espera un momento!"
      text="¿Está seguro que desea clonar la PQRDS?"
      :is-success="false"
      text-button="SI"
      cancel-button
      text-button-cancel="NO"
      @handleAccept=" () => { showModal = false ; successModal = true}"
      @closeModal="showModal = false"
    />
    <Modal
      v-model="successModal"
      title="¡Confirmación!"
      text="La asignación de rechazo fue exitosa. Fue enviado un correo de confirmación."
      is-success
      text-button="¡Ok!"
      @handleAccept="successModal = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref, watch } from 'vue';

import { adminAxios } from 'src/services';
import { useDepartments, useMunicipalities } from 'src/composables/useVersion';
import Table from "components/Table.vue";
import Modal from "components/Modal/Modal.vue";

import { ASIGNACION_HEADER } from "./"

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

const showModal = ref(false)
const successModal = ref(false)
const state = ref('Pendiente')
const step = ref(1)
const form = ref()
const dataTable = ref([
  {
    colaborador: 'Maria Jose',
    cargo: 'Coordinadora',
    grupo: 1
  },
  {
    colaborador: 'Maria Jose',
    cargo: 'Coordinadora',
    grupo: 2
  },
  {
    colaborador: 'Maria Jose',
    cargo: 'Coordinadora',
    grupo: 3
  },
  {
    colaborador: 'Maria Jose',
    cargo: 'Coordinadora',
    grupo: 8
  },
  {
    colaborador: 'Maria Jose',
    cargo: 'Coordinadora',
    grupo: 5
  },
  {
    colaborador: 'Maria Jose',
    cargo: 'Coordinadora',
    grupo: 9
  }
])
const item = ref([]);

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

const submit = async () => {

}

const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return 'Este campo es requerido'
  }
  return true
}

const lengthValidation = (n, val: string) => val.length < n || 'Maximo ' + (n - 1) + ' Caracteres'


</script>

<style lang="scss">

</style>
