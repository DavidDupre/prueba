<template>
  <div>
    <div class="tw-flex tw-justify-between tw-items-center"></div>

    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
      <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2">
        Listado de documentos cargados
      </h2>
      <Table
        :TABLE_HEADER="DOCUMENTOS_SOPORTE_HEADER"
        :TABLE_BODY="dataTable"
        :selection="undefined"
        icon="visibility"
        is-second-icon
        second-icon="download"
        is-thrid-icon
        thrid-icon="print"
        row-id="id"
        key-id="id"
        @handleEditData="handleThridIcon"
        is-selection="none"
      />
    </q-card>
  </div>

  <section>
    <q-dialog v-model="open">
      <q-card class="tw-p-5 tw-w-[400px] tw-h-11/12">
        <h2 class="tw-font-bold tw-text-lg tw-pb-3">Cargar documento</h2>
        <p>Cargue sus documentos de respuestas aquí</p>
        <div class="tw-rounded-lg tw-mt-3">
          <p class="tw-text-label tw-font-semibold">Seleccione la plantilla</p>
          <q-select
            :options="[
              { label: 'Reservada', value: 1 },
              { label: 'Clasificada', value: 2 },
            ]"
            map-options
            emit-value
            outlined
            label="Seleccione"
            dense
          />
          <p class="tw-text-label tw-font-semibold tw-mt-5">
            ¿Es documento de salida?
          </p>
          <FileLoader
            :max-file-size="5 * 1024 * 1024"
            max-file-size-label="5MB"
            v-model:model-value="formData.documentos"
            accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
          >
          </FileLoader>

          <div
            class="tw-flex tw-gap-2 tw-justify-center tw-items-center tw-pt-10"
          >
            <q-btn
              label="Cancelar"
              text-color="secondary"
              outline
              @click="showModal = false"
            />
            <q-btn label="Cargar" color="secondary" />
          </div>
        </div>
      </q-card>
    </q-dialog>
  </section>
</template>

<script lang="ts" setup>
import { computed, Ref, ref, defineEmits } from "vue";
import FileLoader from "components/FormFields/FileLoader.vue";

import Table from "components/Table.vue";
import { DOCUMENTOS_SOPORTE_HEADER } from "./";
const props = defineProps<{
  showModal: boolean;
}>();

const dataTable = ref([
  {
    formato: "PDF",
    nombre: "Documentacion",
    documento: "De salida",
    fecha: "10/12/2023",
    cargado: "Mario Andres",
    id: 1,
  },
  {
    formato: "PDF",
    nombre: "Documentacion",
    documento: "De salida",
    fecha: "10/12/2023",
    cargado: "Mario Andres",
    id: 2,
  },
  {
    formato: "PDF",
    nombre: "Documentacion",
    documento: "De salida",
    fecha: "10/12/2023",
    cargado: "Mario Andres",
    id: 3,
  },
  {
    formato: "PDF",
    nombre: "Documentacion",
    documento: "De salida",
    fecha: "10/12/2023",
    cargado: "Mario Andres",
    id: 4,
  },
  {
    formato: "PDF",
    nombre: "Documentacion",
    documento: "De salida",
    fecha: "10/12/2023",
    cargado: "Mario Andres",
    id: 5,
  },
]);

const currentURL = ref();
const formData: Ref<PQRD> = ref({
  tipoRemitente: "",
  tipoDocumentoRemitente: "",
  numeroDocumentoRemitente: "",
  nombresRemitente: "",
  tipoDocumentoAfectado: "",
  numeroDocumentoAfectado: "",
  nombresAfectado: "",
  lgtbtq: false,
  sexo: "",
  condicionEspecial: "",
  correoAfectado: "",
  tlfCelularAfectado: "",
  tlfFijoAfectado: "",
  paisContacto: "",
  departamentoContacto: "",
  ciudadContacto: "",
  remitenteAfectado: false,
  direccionContacto: "",
  medioRespuestaContacto: "",
  tipologiaPQRD: "",
  tipoSolicitud: "",
  producto: "",
  accesopPublico: false,
  descripcionAccesoInfo: 1,
  observaciones: "",
  documentos: "",
});

const emit = defineEmits(["update:modelValue"]);

const handleThridIcon = (id: number) => {
  currentURL.value = `${window.location.href}/editar/${id}`;
  window.open(currentURL.value, "_blank");
};

const open = computed({
  get() {
    return props.showModal;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>

<style lang="scss"></style>
