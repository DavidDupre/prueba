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
        <q-icon name="toggle_on" style="color: #787E8C"/>
        <p class="tw-text-black">
          Solicitar inactivación
        </p>
      </div>
    </div>
    <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2">Solicitar inactivación de gestión</h2>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
      <span class="tw-text-label">Observación* </span>
      <q-input dense label="Inserte" outlined class="mb-3 " :rules="[]" required
               type="textarea" />
    </div>
    <div class="tw-rounded-lg  tw-mt-3">
      <div class="tw-flex tw-gap-2 tw-justify-center tw-items-center tw-pt-10">
        <q-btn
          label="Rechazar solicitud"
          text-color="secondary"
          outline
          @click="hideModal"
        />
        <q-btn
          label="Aceptar solicitud"
          color="secondary"
          @click="showModal = true"
        />
      </div>
    </div>
    <Modal
      v-model="showModal"
      title="¡Espera un momento!"
      text="¿Está seguro que desea inactivar la clonación?"
      :is-success="false"
      text-button="SI"
      cancel-button
      text-button-cancel="NO"
      @handleAccept="showModal = false"
      @closeModal="showModal = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref, watch } from 'vue';

import Modal from "components/Modal/Modal.vue";

const state = ref('Pendiente')
const labelComponet = ref('Informacion General')
const step = ref(1)
const form = ref()
const showModal = ref(false)
const modalDocuments = ref(false)
const items = ref([
  {
    label: 'Información General',
    icon: 'info',
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
])

const handleRequest = (name: string) => {
  showModal.value = true
}
</script>

<style lang="scss">

</style>
