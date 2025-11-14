<script setup lang="ts">
import { FormDataExpediente } from "src/interfaces/Expediente";
import { useDocumentosExpediente } from "./DocumentosExpediente";


import ConfirmModal from "src/components/Modal/ConfirmModal.vue";
import FileLoader from "src/components/FormFields/FileLoader.vue";
import Button from "src/shared/components/PrimeComponents/Button/Button.vue";
import Label from "src/shared/components/PrimeComponents/Label/Label.vue";
import TablaDocumentosExpediente from "./TablaDocumentos/TablaDocumentosExpediente.vue";
const props = defineProps<{ expediente: any }>();

const {
  columns,
  formFilter,
  origenes,
  tiposDocumentales,
  url,
  router,
  files,
  showModalSend,
  count,
  onSendFile,
  rejectedFiles,
  validateFile,
  filtroApply,
  clearFilter,
  fetchDocuments,
  documentos,
  refreshKey, // 🔹 Asegurar que la tabla se actualice
} = useDocumentosExpediente(props.expediente);
</script>

<template>
  <section class="tw-flex tw-justify-between tw-items-center tw-mb-4">
    <h2 class="text-bold tw-text-xl">Filtro Documentos</h2>
  </section>

  <q-form class="tw-grid tw-grid-cols-2 tw-gap-6 tw-bg-white tw-p-3">
    <!-- <div>
      <Label label="Tipo Documental" />
      <q-select
        v-model="formFilter.tipoDocumental"
        emit-value
        map-options
        dense
        outlined
        :options="tiposDocumentales"
        class="tw-mt-2 tw-rounded-lg"
      />
    </div>

    <div>
      <Label label="Asunto / Contenido" />
      <q-input
        v-model="formFilter.asunto"
        outlined
        dense
        class="tw-mt-2 tw-rounded-lg"
      />
    </div>

    <div>
      <Label label="Radicado" />
      <q-input
        v-model="formFilter.radicado"
        outlined
        dense
        class="tw-mt-2 tw-rounded-lg"
      />
    </div>

    <div>
      <Label label="Origen" />
      <q-select
        v-model="formFilter.origen"
        emit-value
        map-options
        dense
        outlined
        :options="origenes"
        class="tw-mt-2 tw-rounded-lg"
      />
    </div> -->

    <fieldset
      class="tw-grid tw-grid-cols-2 tw-col-span-2 tw-gap-6 tw-bg-white tw-p-4 tw-rounded-lg"
    >
      <span class="tw-col-span-2 tw-h-5 tw-text-label"> Rango de Fechas </span>
      <div>
        <Label label="Fecha Inicial" />
        <q-input
          v-model="formFilter.fechaInicio"
          type="date"
          dense
          outlined
          :max="formFilter.fechaFin || undefined"
          class="tw-mt-2 tw-rounded-lg"
        />
      </div>
      <div>
        <Label label="Fecha Final" />
        <q-input
          v-model="formFilter.fechaFin"
          type="date"
          dense
          outlined
          :min="formFilter.fechaInicio || undefined"
          class="tw-mt-2 tw-rounded-lg"
        />
      </div>
    </fieldset>
    <div class="tw-col-span-2">
       <div class="tw-flex tw-justify-center tw-gap-4">
         <Button
           label="Buscar"
           type="primary"
           color="primary"
           type-button="button"
           icon-right="search"
           @click="filtroApply"
         />
         <Button
           label="Limpiar"
           type="tertiary"
           color="black"
           type-button="button"
           @click="clearFilter"
           icon-left="circle-xmark"
         />
       </div>
     </div>
  </q-form>

  <section
    class="tw-bg-white tw-mt-6 tw-rounded-lg tw-p-6"
  >
    <TablaDocumentosExpediente
      :url="url"
      :columns="columns"
      :key="count"
    />
  </section>

  <section
    v-if="expediente.status != 'INACTIVO'"
    class="tw-col-span-2 tw-bg-white tw-p-4 tw-rounded-lg tw-mt-6"
  >
    <FileLoader
      class="tw-w-full tw-col-span-2 tw-rounded-lg tw-mt-4"
      multiple
      v-model:model-value="files"
      accept-file=".pdf"
      :max-file-size="50 * 1024 * 1024"
      max-file-size-label="50"
      @rejected="rejectedFiles"
    />
    <div class="tw-col-span-2 tw-flex tw-justify-end">
      <ConfirmModal
        :show-modal="showModalSend"
        text-show-modal="¿Está seguro que desea incluir el documento en el expediente seleccionado?"
        text-confirm-modal="Aceptar"
        text-cancel-modal="Cancelar"
        @confirm-modal="onSendFile()"
        @update:show-modal="showModalSend = false"
      />
      <Button
        @click="validateFile"
        label="Incluir Documento"
        type="primary"
        color="primary"
        icon-right="circle-plus"
        type-button="button"
      />
    </div>
  </section>
</template>
