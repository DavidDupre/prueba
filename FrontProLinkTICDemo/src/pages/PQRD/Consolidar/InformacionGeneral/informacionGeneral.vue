<template>
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
    <q-btn
      label="Gestionar"
      color="secondary"
      @click="handleCaso"
    />
  </div>
  <div class="tw-flex tw-gap-2 tw-my-4">
    <div class="tw-cursor-pointer tw-flex tw-gap-1 tw-justify-center tw-items-center tw-border tw-rounded-xl tw-px-2
          tw-bg-gray-texts tw-border-gray-dark"
    >
      <q-icon name="info" style="color: #787E8C"/>
      <p class="tw-text-black">
        Información General
      </p>
    </div>
  </div>
  <section>
    <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2">Información General del caso</h2>
    <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Número de radicado</p>
        <p>346456456</p>
      </div>
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Tipo de solicitud</p>
        <p>346456456</p>
      </div>
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Afectado</p>
        <p>346456456</p>
      </div>
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Colaborador</p>
        <p>346456456</p>
      </div>
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Fecha de vencimiento</p>
        <p>346456456</p>
      </div>
    </div>
  </section>
  <section>
    <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2">Remitente</h2>
    <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Tipo de remitente</p>
        <p>346456456</p>
      </div>
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Tipo de documento de remitente</p>
        <p>346456456</p>
      </div>
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Numero de documento de remitente</p>
        <p>346456456</p>
      </div>
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Nombre del remitente</p>
        <p>346456456</p>
      </div>
    </div>
  </section>
  <section>
    <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2">Afectado</h2>
    <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Tipo de documento afectado</p>
        <p>346456456</p>
      </div>
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Número de documento afectado</p>
        <p>346456456</p>
      </div>
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Nombre del remitente</p>
        <p>346456456</p>
      </div>
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">¿Pertenece a la comunidad LGTBQ+?</p>
        <p>346456456</p>
      </div>
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Sexo</p>
        <p>346456456</p>
      </div>
      <div class="tw-col-span-2">
        <p class="tw-text-label tw-font-semibold">Condición Especial</p>
        <p>346456456</p>
      </div>
    </div>
  </section>
  <section>
    <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2">Medios de contacto y respuesta</h2>
    <div class="tw-grid tw-grid-cols-6 tw-gap-x-4 tw-gap-y-4">
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Correo electrónico</p>
        <p>346456456</p>
      </div>
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Télefono celular</p>
        <p>346456456</p>
      </div>
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Télefono fijo</p>
        <p>346456456</p>
      </div>
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">País de contacto</p>
        <p>346456456</p>
      </div>
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Departamento de contacto</p>
        <p>346456456</p>
      </div>
      <div class="tw-col-span-1" />
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Ciudad de contacto</p>
        <p>346456456</p>
      </div>
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Dirección de contacto</p>
        <p>346456456</p>
      </div>
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Medio por el que desea recibir respuesta</p>
        <p>346456456</p>
      </div>
    </div>
  </section>
  <section>
    <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2">Solicitud</h2>
    <div class="tw-grid tw-grid-cols-6 tw-gap-x-4 tw-gap-y-4 tw-mb-5">
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Tipo de solicitud</p>
        <p>346456456</p>
      </div>
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Detalle</p>
        <p>346456456</p>
      </div>
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Producto</p>
        <p>346456456</p>
      </div>
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Acceso de información pública</p>
        <p>346456456</p>
      </div>
      <div class="tw-col-span-6">
        <p class="tw-text-label tw-font-semibold">Descripción - Acceso a la información pública</p>
        <p>346456456</p>
      </div>
      <div class="tw-col-span-6">
        <p class="tw-text-label tw-font-semibold">Observación</p>
        <p>No</p>
      </div>
      <div class="tw-col-span-1">
        <p class="tw-text-label tw-font-semibold">Documentos adjuntos</p>
        <div class="tw-flex tw-items-center tw-gap-6 tw-border tw-rounded tw-justify-between tw-w-[180px]">
          <img v-lazy :data-url="PDF" alt="">
          <p class="-tw-ml-8">evidencia.pdf</p>
          <span>
            <q-icon name="info" style="color: #787E8C"></q-icon>
          <q-icon name="download" style="color: #787E8C"></q-icon>
          </span>

        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue';
import { useRouter, useRoute } from "vue-router";

import PDF from "assets/pdf.svg"


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

const router = useRouter()
const route = useRoute()

const state = ref('Pendiente')

const handleCaso = () => {
  router.push(`/SGDA/pqrd/consolidar-documentos/${route.params.id}`)
}
</script>

<style lang="scss">

</style>
