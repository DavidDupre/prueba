<template>
  <div class="row q-col-gutter-md q-pb-md q-px-md">
    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
      <span class="tw-w-full">
        <label class="tw-text-label">Asunto *</label>
        <q-input v-model="formExitData.datosGeneralesAsunto" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="[inputRequired, val => maxLengthInput(100, val)]" />
      </span>
    </div>

    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
      <span class="tw-w-full">
        <label class="tw-text-label">Numero de anexos *</label>
        <q-input v-model.number="formExitData.manualNroAnexos" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="[inputRequired,onlyNumbers, val => maxLengthInput(5, val)]" />
      </span>
    </div>

    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
      <span class="tw-w-full">
        <label class="tw-text-label">Tipo de radicado relacionado *</label>
        <q-select v-model="formExitData.manualTipoRadicadoSalidaId" label="Seleccione" map-options emit-value dense outlined
        :rules="[inputRequired]" :options="typeRadicadosList" class="tw-rounded-lg">
        </q-select>
      </span>
    </div>

    <div class="col-12">
      <span class="tw-w-full">
          <label class="tw-text-label">Adjunte los documentos</label>
          <FileLoader v-model="formExitData.files" class="tw-w-full"
            :multiple="true"
            accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
            sub-title="Puede adjuntar (30) Archivo(s) cada uno con un tamaño permitido de 50MB en cualquiera de las siguientes extenciones <hr>(pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)"
            :max-file-size="50 * 1024 * 1024" :max-files="30" max-file-size-label="50"
            @rejected="rejectedFiles" />
      </span>
   </div>

   <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
      <span class="tw-w-full">
        <label class="tw-text-label">Tipo de documento del afectado *</label>
        <q-select v-model="formExitData.datosGeneralesTipoDocumentoId" label="Seleccione" map-options emit-value dense outlined
          :options="tipoDocumentoOptions" class="tw-rounded-lg" :rules="[inputRequired]">
        </q-select>
      </span>
    </div>

    <div class="col-xs-12 col-sm-8 col-md-8 col-lg-8">
      <span class="tw-w-full">
        <label class="tw-text-label">Número de documento del afectado *</label>
        <q-input v-model.number="formExitData.datosGeneralesNumeroDocumento" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="[inputRequired, Number(formExitData.datosGeneralesTipoDocumentoId) == 11 ? alphanumeric : v => onlyNumbers(v), val => maxLengthInput(15, val)]" />
      </span>
    </div>

    <div class="col-12">
      <span class="tw-w-full">
        <label class="tw-text-label">Nombre del afectado *</label>
        <q-input v-model="formExitData.datosGeneralesNombre" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="[inputRequired,alphanumeric, val => maxLengthInput(200, val), alphabeticalWithSpecialCharacters]" />
      </span>
    </div>
  </div>
</template>

<script setup >
  import { ref, onMounted } from "vue";
  import { useCrearComunicacionesLogic } from "src/pages/Correspondencia/Crear/CrearComunicaciones/CrearComunicaciones.Logic";
  import { toast } from '../../../helpers/toast';
  import FileLoader from 'src/components/FormFields/FileLoader.vue';
  import {
    inputRequired,
    maxLengthInput,
    onlyNumbers,
    alphanumericWithSpaceAndHashtag,
    alphanumeric,
    alphabeticalWithSpecialCharacters
  } from "src/helpers/validations";

  const props=defineProps({
    dataInitial: Object,
  })

  const formExitData = ref(props.dataInitial);
  const typeRadicadosList = ref([]);
  const tipoDocumentoOptions = ref([]);

  onMounted(async () => {
    const { getListTypeRadicadoOptions, getTipoDocumentoOptions } = useCrearComunicacionesLogic();
    typeRadicadosList.value = await getListTypeRadicadoOptions();
    const tiposDocumentos= await getTipoDocumentoOptions();
    tipoDocumentoOptions.value = tiposDocumentos.filter((docu) => docu.value !== 12);

  });

  const rejectedFiles = (error) => {
    if (error.some((it) => it.failedPropValidation === 'max-file-size')) {
      toast.error('El peso permitido es hasta 50MB.')
    }
    if (error.some((it) => it.failedPropValidation === 'max-files')) {
      toast.error('Solo se pueden adjuntar 30 archivos.')
    }
    if (error.some((it) => it.failedPropValidation === 'accept')) {
      toast.error('Formato inválido, los formatos permitidos son (pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg).')
    }
}

</script>
