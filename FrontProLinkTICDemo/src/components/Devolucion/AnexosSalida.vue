<template>
  <div class="row q-col-gutter-md q-pb-md q-px-md tw-mt-5">
    <div class="col row">
      <h3 class="tw-text-xl text-bold">{{segundaDevolucion ? 'Adjuntar archivo encriptado' : 'Adjuntar documento al comunicado'}}</h3>
    </div>

    <div class="cols-12 full-width">
      <span class="tw-text-label">Adjunte los documentos</span>
      <FileLoader
      v-if="!segundaDevolucion"
      class="tw-w-full"
      multiple
      :disable="fileDisable" :loading="fileLoading"
      v-model:model-value="files"
      accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
      sub-title="Puede adjuntar (30) Archivo(s) cada uno con un tamaño permitido de 50MB en cualquiera de las siguientes extenciones <hr>(pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)"
      :max-file-size="50 * 1024 * 1024"
      :max-files="30"
      max-file-size-label="50"
      @rejected="rejectedFiles"
      />
      <FileLoader
      v-else
      class="tw-w-full"
      :disable="fileDisable" :loading="fileLoading"
      v-model:model-value="files"
      accept-file="pdf"
      :max-file-size="10 * 1024 * 1024"
      :max-files="1"
      sub-title="Puede adjuntar (1) Archivo con un tamaño permitido de 10MB en  <hr>(pdf)"
      max-file-size-label="10"
      @rejected="rejectedFilesTwo"
      />
    </div>
  </div>
  <q-card class="col-12  tw-mx-4">
    <q-expansion-item dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
        <template v-slot:header>
            <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Lista de Anexos</h3>
        </template>
        <q-card class="tw-p-6 q-mt-md">
            <div class="q-mt-sm">
                <div class="row tw-justify-between">
                </div>
                <Table
                  :TABLE_BODY="listDocs"
                  :TABLE_HEADER="fileColumns"
                  icon="download"
                  :loading="loading"
                  is-selection="none"
                  @view-doc="visualize"
                  @handleEditData="download"
                  @handleSecondIcon="deleteDoc"
                  :key-id="'id'"
                  isSecondIcon
                  secondIcon="delete"
                  view
                />
              </div>
        </q-card>
    </q-expansion-item>
</q-card>
  <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
    <q-btn
      class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]"
      no-caps
      style="border: 1px solid #2c3948"
      label="Cancelar"
      @click="$emit('backView')"
    />
    <q-btn
      class="tw-w-1/4 tw-h-11 bg-primary text-white"
      type="submit"
      label="Guardar"
      @click="confirmModal = true"
    />
  </div>
  <Modal v-model="confirmModal" title="Confirmación" persistent
      :text="`¿Está seguro de que desea adjuntar el archivo encriptado?`"
      :is-success="false" :cancelButton="true" @closeModal="confirmModal = false" textButtonCancel="No" text-button="Si"
      @handleAccept="handleFileUpload()" />
</template>

<script lang="ts" setup>
import FileLoader from 'src/components/FormFields/FileLoader.vue';
import { toast } from 'src/helpers/toast';
import { ref, onMounted, watch } from 'vue';
import Table from "src/components/Table.vue";
import Modal from 'components/Modal/Modal.vue';
import { useAuthStore } from 'src/stores/auth.store';
import { sgdeaAxios } from "src/services";
import { crearTrazabilidad } from 'src/helpers/trazabilidad';

import moment from 'moment';
const props = withDefaults(defineProps<{
  listDocs: [],
  detalleRadicado: any,
  visualize: () => {},
  download: () => {},
  deleteDoc: () => {},
  isDevolucion: boolean,
  segundaDevolucion: boolean
}>(), {
})

const emit = defineEmits(['findDocs', 'backView'])
const files = ref([])
const fileLoading = ref(false)
const fileDisable = ref(false)
const listDocs = ref([])
const loading = ref(false)
const confirmModal = ref(false)
const auth = useAuthStore()

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

watch(
    () => files.value,
    async(newValue) => {
      if (!newValue || newValue.length === 0) return;

      if(!newValue.length){
        newValue = [newValue]
      }
      newValue.forEach(file => {

        const findDoc = listDocs.value.find(doc => doc.nombre === file.name);
        if (findDoc) {
          toast.error(`El documento "${findDoc.nombre}" ya ha sido cargado`);
          files.value = files.value.filter(it => it.name !== findDoc.nombre);
        }
      });
    }
);

const getDocuments = async () => {
  loading.value = true

  const { data } = await sgdeaAxios.get(`/correspondencia/radicacion/documentos/SALIDA/${props.detalleRadicado.id}`);

  listDocs.value = data?.map((it) => ({
      formato: it.formato,
      nombre: it.nombre,
      fecha: moment(it.fechaCargue).format('DD/MM/YYYY'),
      cargado_por: it.usuario.firstname + ' ' + it.usuario.lastname,
      id: it.id,
      nodeId: it.nodeId,
      username: it.usuario.userName,
      es_devolucion: it.es_devolucion
  }))

  if (props.isDevolucion) {
    //listDocs.value = listDocs.value.filter((item) => item.es_devolucion)
  }

  loading.value = false
}

const handleFileUpload = async() => {
  if (files.value.length == 0) return;
  const id = props.detalleRadicado.id

  const formdata = new FormData();
  if(!files.value.length){
    files.value = [files.value]
  }
  for (let i = 0; i < files.value.length; i++) {
    formdata.append("files", files.value[i]);
  }

  try {
    const response = await sgdeaAxios.post(`correspondencia/documentos/${id}?user=${auth.$state.userInfo.userid}&tipoDocumento=SALIDA&es_devolucion=${props.isDevolucion}`, formdata)
    const duplicateFiles = response.data.filter(it => it.message?.includes('already exists'))

    for (let i = 0; i < duplicateFiles.length; i++) {
      toast.error(`el archivo "${duplicateFiles[i].name}" se encuentra duplicado`)
    }

    if (!response.data.find(it => it.status?.includes('CREATED'))) {
      files.value = []
      return;
    }

    if (response.status === 200) {

      await crearTrazabilidad({
        proceso: `COR${props.detalleRadicado.id}`,
        secuencia: props.detalleRadicado.idRadicado,
        estado: props.detalleRadicado.estadoProceso.estado,
        descripcion: `Se agregaron documento(s) de salida al radicado`,
        comentario: 'Se agregaron documento(s) al trámite',
        nombre: auth.$state.userInfo.name,
        tramite: props.detalleRadicado.tipoTramite.nombre,
        accion: `Se agregaron documento(s) al trámite`
      })
      toast.success('Adjuntos cargados exitosamente')
      files.value = []
      getDocuments()
    }
  } catch (error) {
    toast.error('Ha ocurrido un error')
  }
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

onMounted(async () => {
  getDocuments()
})
</script>
