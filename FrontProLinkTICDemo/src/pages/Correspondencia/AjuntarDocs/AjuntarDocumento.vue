<template>
  <div class="row q-col-gutter-md q-pb-md q-px-md tw-mt-5">
    <div class="col row">
      <h3 class="tw-text-xl text-bold">{{ type === 'Entrada' ? 'Documento' : 'Soportes' }} de {{ type === 'Salida' ? 'Salida' : 'Entrada' }}</h3>
    </div>

    <div class="cols-12 full-width">
      <span class="tw-text-label">Adjunte los documentos </span>
      <FileLoader
      class="tw-w-full"
      multiple
      :disable="fileDisable" :loading="fileLoading"
      v-model:model-value="files"
      accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
      sub-title="Puede adjuntar (30) Archivo(s) cada uno con un tamaño permitido de 50MB en cualquiera de las siguientes extenciones <br/>(pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)"

      :max-file-size="50 * 1024 * 1024"
      :max-files="30"
      max-file-size-label="50"
      @rejected="rejectedFiles"
      :existing-files="listDocsCompleta.map(doc => doc.nombre)"
      />
    </div>
  </div>
  <q-card class="col-12  tw-mx-4">
    <q-expansion-item dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
        <template v-slot:header>
            <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Documentos cargados</h3>
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
      @click="cancelModal = true"
      :disable="files.length == 0"
    />
    <q-btn
      class="tw-w-1/4 tw-h-11 bg-primary text-white"
      type="submit"
      label="Guardar"
      @click="confirmModal = true"
      :disable="files.length == 0"
    />
  </div>
  <Modal v-model="cancelModal" title="Confirmación" persistent
      text="Al cancelar el proceso perderá los archivos cargados en el formulario, ¿desea realizar la acción?"
      :is-success="false" :cancelButton="true" @closeModal="cancelModal = false" textButtonCancel="No" text-button="Si"
      @handleAccept="router.push('/correspondencia')" />
  <Modal v-model="confirmModal" title="Confirmación" persistent
      :text="`¿Está seguro de adjuntar un soporte para el documento de ${type === 'Salida' ? 'salida' : 'entrada'}?`"
      :is-success="false" :cancelButton="true" @closeModal="confirmModal = false" textButtonCancel="No" text-button="Si"
      @handleAccept="handleFileUpload" />
</template>

<script lang="ts" setup>
import FileLoader from 'src/components/FormFields/FileLoader.vue';
import { toast } from 'src/helpers/toast';
import { ref, onMounted } from 'vue';
import { sgdeaAxios } from "src/services";
import Table from "src/components/Table.vue";
import Modal from 'components/Modal/Modal.vue';
import { DocumentoRadicado } from "src/interfaces";
import { useAuthStore } from 'src/stores/auth.store';
import moment from 'moment';
import { crearTrazabilidad } from 'src/helpers/trazabilidad';
import { useRouter } from 'vue-router';

const props = withDefaults(defineProps<{
  type: string,
  detailsRadicado: any,
  visualize:  (id: any) => Promise<void>,
}>(), {
})

const emit = defineEmits(['findDocs', 'backView', 'updateData'])

const router = useRouter()
const files = ref([])
const fileLoading = ref(false)
const fileDisable = ref(false)
const listDocs = ref([])
const listDocsCompleta = ref([])
const loading = ref(false)
const confirmModal = ref(false)
const cancelModal = ref(false)
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

onMounted(async () => {
  await getDocuments()
})


const getDocuments = async () => {
  const { data: entradaData } = await sgdeaAxios.get<any>(`/correspondencia/radicacion/documentos/ENTRADA/${props.detailsRadicado.id}`);
  const { data: salidaData } = await sgdeaAxios.get<any>(`/correspondencia/radicacion/documentos/SALIDA/${props.detailsRadicado.id}`);

  const entradaDocs = entradaData?.map((it) => ({
    formato: it.formato,
    nombre: it.nombre,
    fecha: moment(it.fechaCargue).format('DD/MM/YYYY'),
    cargado_por: it.usuario.firstname + ' ' + it.usuario.lastname,
    id: it.id,
    nodeId: it.nodeId,
    username: it.usuario.userName,
  })) || []

  const salidaDocs = salidaData?.map((it) => ({
    formato: it.formato,
    nombre: it.nombre,
    fecha: moment(it.fechaCargue).format('DD/MM/YYYY'),
    cargado_por: it.usuario.firstname + ' ' + it.usuario.lastname,
    id: it.id,
    nodeId: it.nodeId,
    username: it.usuario.userName,
  })) || []

  if (props.type.toUpperCase() === 'ENTRADA') {
    listDocs.value = entradaDocs
  } else if (props.type.toUpperCase() === 'SALIDA') {
    listDocs.value = salidaDocs
  }
  listDocsCompleta.value = [...entradaDocs, ...salidaDocs]
  loading.value = false
}

const download = async (id) => {
  const { data } = await sgdeaAxios.get<DocumentoRadicado>(
    `/radicados/consultar_documento/${id}`
  );

  if (id) {
    const nameDocument = listDocs.value.find((it) => it.nodeId === id)?.nombre

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
    link.download = nameDocument;

    link.click();

    URL.revokeObjectURL(blobUrl);
  }
};

const deleteDoc = async(id) => {
  const nameDocument = listDocs.value.find((it) => it.nodeId === id)?.nombre
  try {
    const response = await sgdeaAxios.delete(`/correspondencia/documentos/${id}`)

    if (response.status == 200) {
      await crearTrazabilidad({
        proceso: `COR${props.detailsRadicado.id}`,
        secuencia: props.detailsRadicado.idRadicado,
        estado: props.detailsRadicado.estadoProceso.estado,
        descripcion: `Usuario: ${auth.$state.userInfo.name} Documento eliminado: ${nameDocument} Comentario: Se ha eliminado un documento de ${props.type} del radicado`,
        comentario: props.type,
        nombre: auth.$state.userInfo.name,
        tramite: props.detailsRadicado.tipoTramite.nombre,
        accion: `Se elimino un documento del trámite`
      })
      await getDocuments()
      toast.success("Documento eliminado con exito")
    }
  } catch (error) {
    toast.error('Ha ocurrido un error inesperado')
  }
}

const handleFileUpload = async() => {
  if (files.value.length == 0) return;
  const id = props.detailsRadicado.id

  const formdata = new FormData();
  for (let i = 0; i < files.value.length; i++) {
    formdata.append("files", files.value[i]);
  }

  try {
    const response = await sgdeaAxios.post(`correspondencia/documentos/${id}?user=${auth.$state.userInfo.userid}&tipoDocumento=${props?.type.toUpperCase()}`, formdata)
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
        proceso: `COR${props.detailsRadicado.id}`,
        secuencia: props.detailsRadicado.idRadicado,
        estado: props.detailsRadicado.estadoProceso.estado,
        descripcion: `Usuario: ${auth.$state.userInfo.name}`+`${files.value.length>1? "Documentos": "Documento"}: ${files.value.map(i => i.name)} Comentario:Se agregaron documento(s) de ${props.type} al radicado`,
        comentario: props.type,
        nombre: auth.$state.userInfo.name,
        tramite: props.detailsRadicado.tipoTramite.nombre,
        accion: `Se agregaron documento(s) al trámite`
      })
      toast.success(props.type === 'Entrada' ? 'Documentos de entrada cargados exitosamente' : 'Adjuntos cargados exitosamente')
      files.value = []
      getDocuments()
      emit('updateData')
    }
  } catch (error) {
    toast.error('Ha ocurrido un error')
  }
}

</script>
