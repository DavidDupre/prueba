<template>
  <div class="row q-col-gutter-md q-pb-md q-px-md tw-mt-5">
    <div class="col row">
      <h3 class="tw-text-xl text-bold">Adjuntar documento</h3>
    </div>

    <div class="cols-12 full-width">
      <span class="tw-text-label">Adjunte los documentos </span>
      <FileLoader
      class="tw-w-full"
      multiple
      :disable="fileDisable" :loading="fileLoading"
      v-model:model-value="files"
      accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
      :max-file-size="50 * 1024 * 1024"
      :max-files="30"
      max-file-size-label="50"
      @rejected="rejectedFiles"
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
                  <p class="tw-text-lg text-weight-bold q-mx-lg">
                    Listado de documentos cargados
                  </p>
                </div>
                <Table
                  :TABLE_BODY="listDocs"
                  :TABLE_HEADER="fileColumns"
                  icon="download"
                  :loading="loading"
                  is-selection="none"
                  @handleEditData="download"
                  :key-id="'id'"
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
      @click="emit('backView', true)"
    />
    <q-btn
      class="tw-w-1/4 tw-h-11 bg-primary text-white"
      type="submit"
      label="Guardar"
      @click="confirmModal = true"
    />
  </div>
  <Modal v-model="confirmModal" title="Confirmación" persistent
      :text="`¿Esta seguro se adjunta un soporte para el radicado de entrada?`"
      :is-success="false" :cancelButton="true" @closeModal="confirmModal = false" textButtonCancel="Cancelar" text-button="Aceptar"
      @handleAccept="handleFileUpload" />
</template>

<script lang="ts" setup>
import FileLoader from 'src/components/FormFields/FileLoader.vue';
import { toast } from 'src/helpers/toast';
import { ref, onMounted, watch } from 'vue';
import { sgdeaAxios } from "src/services";
import { fourthFormatDate } from "src/helpers/formtDate";
import Table from "src/components/Table.vue";
import Modal from 'components/Modal/Modal.vue';
import { DocumentoRadicado } from "src/interfaces";
import { useAuthStore } from 'src/stores/auth.store';

const props = withDefaults(defineProps<{
  detailsRadicado: any,
}>(), {
})

const emit = defineEmits(['findDocs', 'backView'])


const files = ref([])
const fileLoading = ref(false)
const fileDisable = ref(false)
const listDocs = ref([])
const loading = ref(false)
const nameDocument = ref()
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

      newValue.forEach(file => {
        const findDoc = listDocs.value.find(doc => doc.nombre === file.name);
        if (findDoc) {
          toast.error(`El documento "${findDoc.nombre}" ya ha sido cargado`);
          files.value = files.value.filter(it => it.name !== findDoc.nombre);
        }
      });
    }
);

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

const getDocuments = async () => {
    const { data } = await sgdeaAxios.get<any>(
        `/radicados/obtenerHijosPorNodo/${props.detailsRadicado.nodeId}`
    );


    listDocs.value = data.list.entries?.map((it) => ({
        formato: it.entry.content.mimeType,
        nombre: it.entry.name,
        fecha: fourthFormatDate(it.entry.createdAt),
        cargado_por: it.entry.createdByUser.displayName,
        id: it.entry.id
    }))
    loading.value = false
}

onMounted(async () => {
    getDocuments()
})

const download = async (id) => {

    const { data } = await sgdeaAxios.get<DocumentoRadicado>(
        `/radicados/consultar_documento/${id}`
    );

    if (id) {
        nameDocument.value = listDocs.value.find((it) => it.id === id)?.nombre
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

const handleFileUpload = async() => {
    if (files.value.length == 0) return;
    const id = props.detailsRadicado.id

    const formdata = new FormData();
    for (let i = 0; i < files.value.length; i++) {
        formdata.append("files", files.value[i]);
    }

    try {
      const response = await sgdeaAxios.post(`correspondencia/soportes/${id}?user=${auth.$state.userInfo.userid}`, formdata)
      if (response.status === 200) {
        toast.success('Proceso de cargue finalizado correctamente')
        files.value = []
        getDocuments()
      }
    } catch (error) {
      toast.error('Ha ocurrido un error')
    }
}

</script>
