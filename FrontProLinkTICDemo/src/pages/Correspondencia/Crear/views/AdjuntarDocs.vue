<template>
    <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
      <p class="tw-text-2xl tw-font-bold tw-pb-4 ">
        Adjuntar documentos
      </p>
      <div class="col-12">
        <span class="tw-w-full">
          <p class="tw-mb-1 tw-pl-3">Adjuntar archivos</p>
          <FileLoader v-model="formDatosAdjuntos.files" class="tw-w-full"
            :multiple="true" accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
            :max-file-size="50 * 1024 * 1024" :max-files="30" max-file-size-label="50"
            @rejected="rejectedFiles" disable />
        </span>
      </div>
    </q-card>

    <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
      <TableDocuments :key="fileDataTable" class="full-width" :JUZGADOS_HEADER="DOCUMENTOS_HEADER"
      :JUZGADOS_BODY="fileDataTable" @update:show-printer="(value)=>printerDocument(value)"
      @update:item-deleted="(value)=>handleDelteFileTable(value)" @update:item-type-changed="(value)=>onChangeDocType(value)" />
    </q-card>
  </template>
  <script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { DOCUMENTOS_HEADER } from '../CrearComunicaciones/const/index';
  import { sgdeaAxios } from 'src/services';
  import { toast } from 'src/helpers/toast';
  import FileLoader from "components/FormFields/FileLoader.vue";
  import TableDocuments from 'src/components/comunicacion/TableDoc.vue';
import moment from 'moment';

  const props = withDefaults(defineProps<{
    id: number
  }>(), {
  });

  const fileDataTable = ref([]);
  const formDatosAdjuntos = ref({
    files: [],
  });

  const handleDelteFileTable=(filesId)=>{
    formDatosAdjuntos.value.files= formDatosAdjuntos.value.files.filter(file=>filesId.includes(file.name))
  }

  const onChangeDocType =  (value) => {
    const {idsSelected, esSalida}=value;

    fileDataTable.value= fileDataTable.value.map((item) => {
      if (idsSelected.includes(item.id)) {
        return {
          ...item,
          tipo: esSalida ? 'De salida' : 'De gestión'
        }
      }
      return item
    })
  }

  const printerDocument = async(nodeid)=>{
    const { data } = await sgdeaAxios.get(
      `/radicados/consultar_documento/${nodeid}`
    );
    const byteCharacters = atob(data.base64x);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const blobUrl = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobUrl;

    document.body.appendChild(iframe);
    iframe.onload = function () {
      iframe.contentWindow.print();
    };
  }

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

  const getDocs = async() => {
    const { data } = await sgdeaAxios.get(`/correspondencia/comunicacion/documentos/ENTRADA/${props.id}`);
    fileDataTable.value = data?.map((it) => ({
        formato: it.formato,
        nombre: it.nombre,
        tipo: 'SALIDA',
        fecha: moment(it.fechaCargue).format('DD/MM/YYYY'),
        cargado_por: it.usuario.firstname + ' ' + it.usuario.lastname,
        id: it.nodeId,
        username: it.usuario.userName
    }))
  }

  onMounted(async() => {
    await getDocs()
  })
  </script>
  <style>

  </style>
