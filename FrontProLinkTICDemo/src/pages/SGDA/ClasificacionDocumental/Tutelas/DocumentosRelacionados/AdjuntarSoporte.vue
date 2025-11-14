<template>
  <div class="row q-col-gutter-md q-pb-md q-px-md tw-mt-5">
    <div class="col row">
      <h3 class="tw-text-xl text-bold tw-ms-7">{{segundaDevolucion ? 'Adjuntar archivo encriptado' : 'Adjuntar Soporte'}}</h3>
    </div>

    <div class="cols-12 full-width">
      <span class="tw-text-label tw-ms-7">Adjunte los Documentos</span>
      <FileLoader
      v-if="!segundaDevolucion"
      class="tw-w-full"
      multiple
      :disable="fileDisable" :loading="fileLoading"
      v-model:model-value="files"
      sub-title="Puede adjuntar (30) Archivo(s) cada uno con un tamaño permitido de 50MB en cualquiera de las siguientes extenciones <br/>(pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)"
      accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
      :max-file-size="50 * 1024 * 1024"
      :max-files="30"
      max-file-size-label="50"
      @rejected="rejectedFiles"
      />
      <FileLoader
      v-else
      class="tw-w-full"
      v-model:model-value="files"
      accept-file="pdf"
      :max-file-size="10 * 1024 * 1024"
      :max-files="1"
      max-file-size-label="10"
      @rejected="rejectedFilesTwo"
      />
    </div>
  </div>
  <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
    <q-btn
      class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]"
      no-caps
      style="border: 1px solid #2c3948"
      label="Cancelar"
      @click="cancel"
    />
    <q-btn
      class="tw-w-1/4 tw-h-11 bg-primary text-white"
      type="submit"
      label="Guardar"
      @click="handleFileUpload"
      :disable="detalleTutela.estado === 'Por Aprobar'"
    />
  </div>
</template>

<script lang="ts" setup>
import FileLoader from 'src/components/FormFields/FileLoader.vue';
import { toast } from 'src/helpers/toast';
import { ref, onMounted } from 'vue';
import service from "src/services/Api";
import { useLoadingStore } from "src/stores/loading.store";
import { sgdeaAxios, intescoAxios } from "src/services";
import { formatDateTimeStandTwo, currentHourWithoutSec } from "src/helpers/formtDate";
import Table from "src/components/Table.vue";
import { DocumentoRadicado } from "src/interfaces";
import { useAuthStore } from "stores/auth.store";

const props = withDefaults(defineProps<{
  detalleTutela: any,
  isDevolucion: boolean,
  segundaDevolucion: boolean
}>(), {
})

const emit = defineEmits(['findDocs', 'cancel'])

const { getUserInfo } = useAuthStore();
const files = ref([])
const fileLoading = ref(false)
const fileDisable = ref(false)
const listDocs = ref()
const loading = ref(false)
const nameDocument = ref()
const userInfo = ref()

const fileColumns = [
  {
    name: "formato",
    label: "Formato",
    field: "formato",
    sortable: false,
    align: "center",
  },
  {
    name: "nombre",
    label: "Nombre del documento",
    field: "nombre",
    sortable: true,
    align: "center",
  },
  {
    name: "fecha",
    label: "Fecha de cargue",
    field: "fecha",
    sortable: true,
    align: "center",
  },
  {
    name: "cargado_por",
    label: "Cargado por",
    field: "cargado_por",
    sortable: true,
    align: "center",
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    sortable: true,
    align: "center",
  },
];



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

const rejectedFilesTwo = (error) => {
  if (error.some((it) => it.failedPropValidation === 'max-file-size')) {
    toast.error('El peso permitido es hasta 10MB.')
  }
  if (error.some((it) => it.failedPropValidation === 'max-files')) {
    toast.error('Solo se puede adjuntar 1 archivo.')

  }
  if (error.some((it) => it.failedPropValidation === 'accept')) {
    toast.error('Formato inválido, los formatos permitidos son (pdf).')
  }
}

const getDocuments = async () => {
    const { data } = await sgdeaAxios.get<any>(
      `/tutela/${props.detalleTutela.idTutela}/archivos`
    );

    listDocs.value = data.map((it) => ({
        formato: /[^.]+$/.exec(it.nombre)[0],
        nombre: it.nombre,
        tipo: it.tipo,
        fecha: formatDateTimeStandTwo(it.fechaCreacion) + ' ' + currentHourWithoutSec(it.fechaCreacion),
        cargado_por: it.usuario,
        id: it.id,
        nodeId: it.nodeId,
        es_devolucion: it.es_devolucion
    }))
    if (props.isDevolucion) {
      listDocs.value = listDocs.value.filter((item) => item.es_devolucion)
    }
    loading.value = false
}

onMounted(async () => {
    getDocuments()
    userInfo.value = await getUserInfo();
})

const cancel = () => {
  files.value = []
  emit('cancel')
}

const download = async (id) => {

    const { data } = await sgdeaAxios.get<DocumentoRadicado>(
        `/radicados/consultar_documento/${id}`
    );

    if (id) {
        nameDocument.value = data.name
    }

    const byteCharacters = atob(data.base64x);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = nameDocument.value;

    link.click();

    URL.revokeObjectURL(blobUrl);

};

const handleFileUpload = () => {
    fileLoading.value = true
    fileDisable.value = true
    var data = {
        files: files.value,
        tutelaId: props.detalleTutela.idTutela,
        tipo: 'De salida',
        userId: userInfo.value.userid
    }

    service.subirArchivos(data, props.isDevolucion)
    .then((resp) => {
        files.value = []
        fileLoading.value = false
        fileDisable.value = false
        if (resp.status == 200) {
            if (resp.data.failedUploads.length) {
              var valid = resp.data.failedUploads.length > 1 ? true : false
              var docs = resp.data.failedUploads.map( item => item.name).join(", ")
              toast.error(`${valid ? 'Los documentos' : 'El documento'} ${docs} ya ${valid ? 'han sido cargados' : 'ha sido cargado'}`)
            }
            if (resp.data.successfulUploads.length) {
              toast.success('Documento(s) subidos con éxito')
              emit('findDocs', resp.data)
            }
        }else{
            toast.error('Hubo un error intente de nuevo')
        }
    })
}

</script>
