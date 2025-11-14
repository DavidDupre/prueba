<template>
  <div class="[&>*]:tw-mb-4 tw-mt-6">
    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl tw-w-full" flat>
      <q-expansion-item label="Datos de la comunicación" header-class="tw-text-lg tw-font-bold tw-pl-0" default-opened
        class="tw-bg-white tw-px-4 tw-py-5">
        <div class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pl-3">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Número de comunicación</p>
            <p>{{ $props?.data?.idRadicado }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Nombre de la comunicación</p>
            <p>{{ $props?.data?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Tipo de comunicación</p>
            <p>{{ $props?.data?.tipoComunicacion?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Prefijo</p>
            <p>{{ $props?.data?.prefijo?.prefijo?.nombre }}</p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl tw-w-full" flat>
      <q-expansion-item label="Metadatos" header-class="tw-text-lg tw-font-bold tw-pl-0" default-opened
        class="tw-bg-white tw-px-4 tw-py-5">
        <div class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pl-3">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Asunto</p>
            <p>{{ $props?.data?.metadatos?.asunto }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Tipo de documento del afectado</p>
            <p>{{ $props?.data?.metadatos?.tipoDocumento?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Número de documento del afectado</p>
            <p>{{ $props?.data?.metadatos?.numeroDocumento }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Nombre del afectado</p>
            <p>{{ $props?.data?.metadatos?.afectado }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Radicado Asociado</p>
            <p>{{ $props?.data?.metadatos?.listMl }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Siniestro</p>
            <p>{{ $props?.data?.metadatos?.listSiniestro }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Fecha del siniestro</p>
            <p>{{ $props?.data?.metadatos?.fechaSiniestro }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Tipo de evento</p>
            <p>{{ $props?.data?.metadatos?.tipoEvento?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Origen del evento</p>
            <p>{{ $props?.data?.metadatos?.origenEvento?.evento }}</p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
interface InfoGeneralProps {
  data: any,
}

const props = defineProps<InfoGeneralProps>();
</script>