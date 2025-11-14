<template>
  <div style="height: 100vh">
    <div class="tw-gap-4">
      <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold">
        7358552 - Data Dictionary V2
      </div>
      <p class="tw-text-lg tw-font-semibold">Información General</p>

      <div class="tw-flex tw-full q-col-gutter-md tw-mt-2">
        <div class="tw-w-2/4">
          <p class="tw-text-label tw-font-semibold tw-mb-1">Código expediente*</p>
          <q-input disable borderless dense class="tw-bg-blue-light"/>
        </div>
        <div class="tw-w-2/4">
          <p class="tw-text-label tw-font-semibold tw-mb-1">Nombre expediente*</p>
          <q-input  outlined dense />
        </div>
      </div>
      <div class="tw-flex tw-full q-col-gutter-md tw-mt-2">
        <div class="tw-w-2/4">
          <p class="tw-text-label tw-font-semibold tw-mb-1">Fecha inicio</p>
          <DatePicker mask="YYYY/MM/DD" label="aaaa / mm / dd" />
        </div>
        <div class="tw-w-2/4">
          <p class="tw-text-label tw-font-semibold tw-mb-1">Fecha fin</p>
          <DatePicker mask="YYYY/MM/DD" label="aaaa / mm / dd" />
        </div>
      </div>

      <div class="q-col-gutter-sm tw-mt-4">
        <p class="tw-text-label tw-font-semibold">Tipo de expediente</p>
        <div class="tw-flex tw-gap-x-3">
          <div
            class="tw-flex tw-border tw-items-center tw-gap-2 tw-py-2 tw-w-[170px] tw-rounded-lg "
            v-for="{label, img} in typesExpedientes">
            <q-radio size="xs" class="tw-mt-2 tw-ml-0.5"/>
            <img v-lazy :data-url="img" alt="expediente">
            <p>{{ label }}</p>
          </div>
        </div>
      </div>

      <div class="q-col-gutter-sm tw-mt-4 tw-border-b tw-pb-8">
        <p class="tw-text-label tw-font-semibold">Descripción</p>
        <q-input type="textarea" outlined></q-input>
      </div>

      <p class="tw-text-lg tw-font-semibold tw-mt-2">Documentos</p>

      <div class="tw-mt-4 tw-border-b tw-pb-8">
        <p class="tw-text-label tw-font-semibold tw-mb-1">Adjunte los documentos</p>
        <File v-model:model-value="file"/>
      </div>

      <div class="tw-flex tw-justify-center tw-mt-6 tw-pb-8 tw-gap-2">
        <q-btn
          label="Cancelar"
          text-color="secondary"
          outline
        />
        <q-btn
          label="Editar Expediente"
          color="secondary"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import DatePicker from "components/FormFields/datePickerComponent.vue";
import File from "components/FormFields/FileLoader.vue"
import Folder from "assets/folder.svg";
import Fisico from "assets/fisico-expediente.svg"
import Hibrido from "assets/hibrido-expediente.svg"

const file = ref()
const typesExpedientes = ref([
  {
    label: 'Expediente Electrónico',
    img: Folder
  },
  {
    label: 'Expediente Físico',
    img: Fisico
  },
  {
    label: 'Expediente Híbrido',
    img: Hibrido
  },
])


</script>
