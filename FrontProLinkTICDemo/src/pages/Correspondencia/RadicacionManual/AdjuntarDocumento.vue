<template>
  <div class="row q-col-gutter-md q-pb-md q-px-md tw-mt-5">
    <div class="col row">
      <h3 class="tw-text-xl text-bold">
        {{ type === "Entrada" ? "Documento" : "Soportes" }} de
        {{ type === "Soporte" ? "Salida" : "Entrada" }}
      </h3>
    </div>

    <div class="cols-12 full-width">
    <q-form ref="formFile">
      <span class="tw-text-label">Adjunte los documentos </span>
      <FileLoader
        class="tw-w-full"
        multiple
        :rules="[inputRequired]"
        :disable="fileDisable"
        :loading="fileLoading"
        v-model:model-value="files"
        accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
        :max-file-size="50 * 1024 * 1024"
        :max-files="30"
        max-file-size-label="50"
        @rejected="rejectedFiles"
      />
    </q-form>

    </div>
  </div>
  <q-card class="col-12 tw-mx-4">
    <q-expansion-item
      dense
      expand-separator
      class="tw-bg-white q-mt-md"
      style="border-radius: 5px"
    >
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
          Documentos cargados
        </h3>
      </template>
      <q-card class="tw-p-6 q-mt-md">
        <div class="q-mt-sm">
          <div class="row tw-justify-between"></div>
          <Table
            :TABLE_BODY="listDocs"
            :TABLE_HEADER="fileColumns"
            icon="download"
            isSecondIcon
            isThirdIcon
            thirdIcon="print"
            secondIcon="delete"
            :loading="loading"
            is-selection="none"
            @handleEditData="download"
            @handleSecondIcon="deleteDoc"
            @handleThirdIcon="print"
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
  <Modal
    v-model="confirmModal"
    title="Confirmación"
    persistent
    :text="`¿Está seguro de adjuntar un soporte para el documento de ${
      type === 'Soporte' ? 'salida' : 'entrada'
    }?`"
    :is-success="false"
    :cancelButton="true"
    @closeModal="confirmModal = false"
    textButtonCancel="No"
    text-button="Si"
    @handleAccept="handleFileUpload"
  />
</template>

<script lang="ts" setup>
import FileLoader from "src/components/FormFields/FileLoader.vue";
import { toast } from "src/helpers/toast";
import { ref, onMounted, watch } from "vue";
import { useLoadingStore } from "src/stores/loading.store";
import { intescoAxios, sgdeaAxios } from "src/services";
import Table from "./AdjuntarDocumentosTable.vue";
import Modal from "components/Modal/Modal.vue";
import { DocumentoRadicado } from "src/interfaces";
import { useAuthStore } from "src/stores/auth.store";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import moment from "moment";
import { AccionesDocumentos } from "./types";
import { inputRequired } from 'src/helpers/validations';

const props = withDefaults(
  defineProps<{
    type: string;
    detailsRadicado: any;
  }>(),
  {}
);

const emit = defineEmits(["findDocs", "backView"]);

const files = ref(null);
const fileLoading = ref(false);
const fileDisable = ref(false);
const listDocs = ref([]);
const loading = ref(false);
const confirmModal = ref(false);
const auth = useAuthStore();
const formFile = ref()
const nameDocument = ref()
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
    name: "cargado_por",
    label: "Cargado por",
    field: "cargado_por",
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
    name: "actions",
    label: "Acciones",
    field: "actions",
    sortable: true,
    align: "center",
  },
];

watch(
  () => files.value,
  async (newValue) => {
    if (!newValue || newValue?.length === 0) return;

    newValue.forEach((file) => {
      const findDoc = listDocs.value.find((doc) => doc.nombre === file.name);
      if (findDoc) {
        toast.error(`El documento "${findDoc.nombre}" ya ha sido cargado`);
        files.value = files.value.filter((it) => it.name !== findDoc.nombre);
      }
    });
  }
);

const rejectedFiles = (error) => {
  if (error.some((it) => it.failedPropValidation === "max-file-size")) {
    toast.error("El peso permitido es hasta 50MB.");
  }
  if (error.some((it) => it.failedPropValidation === "max-files")) {
    toast.error("Solo se pueden adjuntar 30 archivos.");
  }
  if (error.some((it) => it.failedPropValidation === "accept")) {
    toast.error(
      "Formato inválido, los formatos permitidos son (pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)."
    );
  }
};

onMounted(async () => {
  await getDocuments();
});

const getDocuments = async () => {
  const response = await sgdeaAxios.get(`/radicados/obtenerHijosPorNodo/${props.detailsRadicado.nodeId}`)

  if (response.status !== 200 && response.status !== 201) {
      return;
    }
  if (response.status === 200) {
    const { data } = response;

    listDocs.value = data.list?.entries?.map((it) => ({
      formato: it.entry.content.mimeType,
      nombre: it.entry.name,
      id: it.entry.id,
      nodeId: it.entry.id,
      fecha: moment(it.entry.createdAt).format("DD/MM/YYYY"),
      cargado_por: it.entry.createdByUser.displayName,
    }));

    loading.value = false;
  }
};

const print = async(id) => {
  try {
    const { data } = await sgdeaAxios.get<DocumentoRadicado>(
      `/radicados/consultar_documento/${id}`
    );
    if (id) {
      nameDocument.value = listDocs.value.find((it) => it.id === id)?.nombre
    }
    const byteCharacters = atob(data.base64x);
    const byteNumbers = new Array(byteCharacters?.length);
    for (let i = 0; i < byteCharacters?.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const blobUrl = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.name = 'nombre archivo'
    // iframe.style.display = 'none';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    var doc = iframe.contentDocument || iframe.contentWindow.document;
    var titulo = doc.createElement('title')
    titulo.textContent = 'prueba'
    doc.head.appendChild(titulo);
    // Función para manejar el evento afterprint
    function handleAfterPrint() {
      // Eliminar el iframe después de imprimir o cancelar
      document.body.removeChild(iframe);
      window.removeEventListener('afterprint', handleAfterPrint);
    }

    // Agregar evento afterprint para manejar la impresión
    window.addEventListener('afterprint', handleAfterPrint);

    // Esperar a que se cargue el contenido del iframe antes de imprimir
    iframe.onload = function () {
      // Imprimir el contenido del iframe
      iframe.contentWindow.print();
      setTimeout(() => {
        document.querySelector("head title").textContent = "titulo"
      }, 500);

    };

  } catch (error) {
    toast.error('Ha ocurrido un error')
  } finally{
  }
}

const download = async (id) => {
  const { data } = await sgdeaAxios.get<DocumentoRadicado>(
    `/radicados/consultar_documento/${id}`
  );

  if (id) {
    const nameDocument = listDocs.value.find((it) => it.nodeId === id)?.nombre;

    const byteCharacters = atob(data.base64x);
    const byteNumbers = new Array(byteCharacters?.length);
    for (let i = 0; i < byteCharacters?.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = nameDocument;

    link.click();

    URL.revokeObjectURL(blobUrl);
  }

};

const deleteDoc = async (nodeId) => {
  try {
    const response = await sgdeaAxios.delete(
      `/alfresco/deleteFile/${nodeId}`
    );

    if (response.status === 200) {
      toast.success("El documento fué eliminado correctamente");
      await getDocuments();
      await trazabilidad(AccionesDocumentos.ELIMINAR_DOCS);
    }
  } catch (error) {
    toast.error("Ha ocurrido un error al eliminar un documento");
  }
};

const handleFileUpload = async () => {
  if (await formFile.value.validate()) {
    const id = props.detailsRadicado.id;

    const formdata = new FormData();
    for (let i = 0; i < files.value?.length; i++) {
      formdata.append("anexos", files.value[i]);
    }

    formdata.append("idRadicado", props.detailsRadicado.nodeId);
    formdata.append("descripcionRadicado", "test");

    try {
      const response = await sgdeaAxios.post(
        `api/v1/integracion/alfresco/agregarAnexos/ComunicacionManual?comunicacionManualId=${props.detailsRadicado.id}&usuarioId=${auth.$state.userInfo.userid}`,
        formdata,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "accept": "*",
            "Content-Type": "multipart/form-data",
            "Content-Transfer-Encoding": "BINARY"
          },
        }
      );
      if (response.status === 200) {
        toast.success("Los documentos fueron adjuntados correctamente");
        files.value = [];
        await getDocuments();
        await trazabilidad(AccionesDocumentos.AGREGAR_DOCS);
      }
    } catch (error) {
      toast.error("Ha ocurrido un error");
    }
  }

};

const trazabilidad = async (type) => {
  const acciones = {
    [AccionesDocumentos.ELIMINAR_DOCS]: {
      descripcion: "Se eliminó un documento de soporte del radicado",
      comentario: "Se eliminó un documento de soporte del radicado",
      accion: "Se eliminó un documento de soporte del radicado",
    },
    [AccionesDocumentos.AGREGAR_DOCS]: {
      descripcion: "Se agregaron documento(s) de soporte al radicado",
      comentario: "Se agregaron documento(s) de soporte al radicado",
      accion: "Se agregaron documento(s) de soporte al tramite",
    },
  };

  if (acciones[type]) {
    const { descripcion, comentario, accion } = acciones[type];
    try {
      await crearTrazabilidad({
        proceso: `PRE${props.detailsRadicado.id}`,
        secuencia: props.detailsRadicado.preRadicado,
        estado: "RADICADO",
        descripcion,
        comentario,
        nombre: auth.$state.userInfo.name,
        tramite: props.detailsRadicado.tipoComunicacion.nombre,
        accion,
      });
    } catch (error) {
      console.error(
        `error en crear la trazabilidad al ${descripcion.toLowerCase()}`
      );
    }
  }
};
</script>
