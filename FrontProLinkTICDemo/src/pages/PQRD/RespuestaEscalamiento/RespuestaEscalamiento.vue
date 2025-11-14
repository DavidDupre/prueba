<template>
  <div class="tw-bg-white">
    <q-form ref="refForm">
      <q-card class="tw-p-6 q-mt-md" flat>
        <div class="row tw-justify-between">
          <p class="tw-text-lg text-weight-bold tw-mb-3">
            Respuesta de escalamiento
          </p>
          <div class="tw-w-full">
            <div class="tw-col-span-6 tw-mb-5">
              <p class="tw-text-label tw-font-semibold">
                Respuesta de escalamiento *
                {{ cleanContentLength(formData.observaciones) }}/9000
              </p>
              <q-field
                ref="fieldRef"
                v-model="formData.observaciones"
                borderless
                :rules="[inputRequired, (v: string) => maxLengthInputForRich(9000, v)]"
                class="tw-pt-0"
              >
                <template #control>
                  <q-editor
                    @paste="pasteCapture"
                    ref="editorResp"
                    v-model="formData.observaciones"
                    :toolbar="[]"
                    class="full-width"
                    id="editorRich"
                    style="cursor: auto"
                    :style="
                      fieldRef && fieldRef.hasError
                        ? 'border-color: var(--q-negative)'
                        : ''
                    "
                  />
                </template>
              </q-field>
            </div>

            <div class="tw-col-span-6">
              <p class="tw-text-label tw-font-semibold">
                Adjuntar soportes al escalamiento
              </p>
              <FileLoader
                :max-file-size="50 * 1024 * 1024"
                max-file-size-label="50"
                v-model:model-value="formData.files"
                :rules="[]"
                :max-files="30"
                accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
                multiple
                @rejected="rejectedFiles"
                @update:model-value="moveFileToTable"
              />
            </div>
          </div>
        </div>
      </q-card>
    </q-form>
  </div>

  <section>
    <q-card class="tw-p-6 q-mt-md" flat>
      <div class="q-mt-sm">
        <div class="row tw-justify-between">
          <p class="tw-text-lg text-weight-bold q-mx-lg">
            Listado de documentos cargados
          </p>
          <div
            v-if="activeDelete"
            class="row tw-gap-10 tw-items-center q-ml-lg"
          >
            <p class="tw-text-label tw-text-sm">
              Cantidad seleccionada: <b>{{ listDocSelect.length }}</b>
            </p>
            <q-btn
              label="Eliminar"
              icon="delete"
              color="red"
              @click="deleteDocModal = true"
              class="tw-w-32 tw-h-10"
            />
          </div>
        </div>
        <Table
          :visualize="props.visualize"
          ref="tableDoc"
          :TABLE_BODY="listDocs"
          :TABLE_HEADER="HEADER_DOCUMENTS"
          @update:item-selected="itemSelected"
          icon="download"
          isSecondIcon
          secondIcon="print"
          :loading="false"
          is-selection="multiple"
          @handleEditData="download"
          @handleSecondIcon="print"
          :key-id="'id'"
        />
      </div>
    </q-card>
    <div class="col row justify-center q-gutter-x-md q-mt-md">
      <q-btn
        color="accent"
        textColor="secondary"
        label="Cancelar"
        style="
          width: 230px;
          height: 40px;
          border-radius: 8px;
          font-size: 15px;
          border: 2px solid #050505;
        "
        @click="cancelarModal = true"
        no-caps
      />

      <q-btn
        color="primary"
        label="Guardar"
        style="width: 230px; height: 40px; border-radius: 8px; font-size: 15px"
        no-caps
        @click="guardar"
        :disable="enviado"
      />
      <q-btn
        color="secondary"
        @click="validateBeforeSend"
        label="Enviar respuesta"
        style="width: 230px; height: 40px; border-radius: 8px; font-size: 15px"
        no-caps
        :disable="enviado"
      />
    </div>
  </section>

  <Modal
    v-model="deleteDocModal"
    title="Confirmación"
    text="¿Está seguro de que desea eliminar el documento?"
    :is-success="false"
    cancel-button
    text-button-cancel="No"
    text-button="Si"
    @handleAccept="eliminarDoc"
  />
  <Modal
    v-model="cancelarModal"
    title="Cancelar"
    text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
    :is-success="false"
    cancel-button
    text-button-cancel="No"
    text-button="Si"
    @handleAccept="
      emit('cancelar');
      files = [];
      listDocs = [];
      formData.observaciones = '';
      cancelarModal = false;
    "
    @close-modal="cancelarModal = false"
  />
  <Modal
    v-model="enviarModal"
    title="Enviar Respuesta"
    text="¿Está seguro que desea enviar la respuesta del escalamiento?"
    :is-success="false"
    cancel-button
    text-button-cancel="No"
    text-button="Si"
    @handleAccept="enviar"
    @close-modal="enviarModal = false"
  />
</template>

<script lang="ts" setup>
import FileLoader from "components/FormFields/FileLoader.vue";
import { Notify } from "quasar";
import { Ref, onMounted, ref } from "vue";
import { HEADER_DOCUMENTS } from ".";
import Modal from "../../../components/Modal/Modal.vue";
import { fourthFormatDate } from "../../../helpers/formtDate";
import { toast } from "../../../helpers/toast";
import { DocsBD, DocumentoRadicado } from "../../../interfaces";
import { sgdeaAxios } from "../../../services";
import { useAuthStore } from "../../../stores/auth.store";
import { useLoadingStore } from "../../../stores/loading.store";
import Table from "./Table.vue";
import { useRouter } from "vue-router";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { maxLengthInputForRich, inputRequired } from "src/helpers/validations";

const props = withDefaults(
  defineProps<{
    pqrdData: any;
    finished: boolean;
    visualize?: () => {};
  }>(),
  {}
);

const emit = defineEmits([
  "download",
  "cleanDocs",
  "findDocs",
  "loadTrue",
  "changeDocType",
  "update:detallePqrd",
  "update:finished",
  "cancelar",
]);

const refForm = ref();
const countImgs = ref(0);
const fieldRef = ref();
const editorResp = ref();
const formData = ref({
  observaciones: "",
  files: [],
});
const router = useRouter();
const auth = useAuthStore();
const listDocSelect = ref([]);
const deleteDocModal = ref(false);
const activeDelete = ref(false);
const cancelarModal = ref(false);
const enviarModal = ref(false);
const loading = ref(true);
const nameDocument = ref();
const tableDoc = ref();
const files: Ref<File[]> = ref([]);
const escalamientoId = ref(0);
const enviado = ref(false);
const listDocs: Ref<
  {
    formato: string;
    nombre: string;
    tipo: string;
    fecha: string;
    cargado_por: string;
    id: number;
  }[]
> = ref([]);

onMounted(async () => {
  await getData();
  contarImagenes();
});

const getData = async () => {

  //@ts-ignore
  const { data } = await sgdeaAxios.get(
    `/pqrd/escalamiento/obtener/${props.pqrdData.id}`,
    { params: { gestionador: auth.$state.userInfo.userid } }
  );

  escalamientoId.value = data.id;
  enviado.value = data.send;

  if (!enviado.value) {
    const { data: documentos }: { data: any } = await sgdeaAxios.get<any>(
      `/radicados/obtenerHijosPorNodo/${props.pqrdData.nodeID}`
    );

    //@ts-ignore
    const {
      data: docs,
    }: {
      data: DocsBD[];
    } = await sgdeaAxios.get(
      `/pqrd/escalamiento/documentosRespuesta/${escalamientoId.value}`,
      { params: { usuarioId: auth.$state.userInfo.userid } }
    );
    listDocs.value = docs
      .map((it, i: number) => ({
        id: it.nodeId,
        formato:
          documentos.list.entries?.find(
            (itDoc) => itDoc?.entry?.id === it.nodeId
          )?.entry?.content?.mimeType ?? "No disponible",
        nombre:
          documentos.list.entries?.find(
            (itDoc) => itDoc?.entry?.id === it.nodeId
          )?.entry?.name ?? "No disponible",
        tipo: "Respuesta de Escalamiento",
        fecha: fourthFormatDate(new Date()),
        cargado_por: auth.userInfo.name,
        isSaved: true,
      }))
      .filter((it) => it.nombre !== "No disponible");
    formData.value.observaciones = data.respuesta;
  }


};

const pasteCapture = (paste) => {
  if (paste.clipboardData.getData("Text") == "") {
    if (countImgs.value >= 6) {
      paste.preventDefault();
      paste.stopPropagation();
      toast.error("Máximo 6 recortes");
    }
  } else {
    if (paste.target.nodeName === "INPUT") return;
    let text, onPasteStripFormattingIEPaste;
    paste.preventDefault();
    paste.stopPropagation();
    if (paste.originalEvent && paste.originalEvent.clipboardData.getData) {
      text = paste.originalEvent.clipboardData.getData("text/plain");
      editorResp.value.runCmd("insertText", text);
    } else if (paste.clipboardData && paste.clipboardData.getData) {
      text = paste.clipboardData.getData("text/plain");
      editorResp.value.runCmd("insertText", text);
    }
    // @ts-expect-error
    else if (window.clipboardData && window.clipboardData.getData) {
      if (!onPasteStripFormattingIEPaste) {
        onPasteStripFormattingIEPaste = true;
        editorResp.value.runCmd("ms-pasteTextOnly", text);
      }
      onPasteStripFormattingIEPaste = false;
    }
  }
};

const contarImagenes = () => {
  // Expresión regular para encontrar imágenes
  const regexImagenes = /<img\s+[^>]*>/g;

  // Buscar todas las coincidencias en el texto
  const coincidencias = formData.value.observaciones?.match(regexImagenes);

  // Si hay coincidencias, devolver la cantidad
  if (coincidencias) {
    countImgs.value = coincidencias.length;
  }
};

async function validateBeforeSend() {
  if (!(await refForm.value.validate())) {
    return toast.error(
      "Debe diligenciar los campos obligatorios para continuar con el proceso"
    );
  }
  return (enviarModal.value = true);
}

const itemSelected = (items) => {
  emit("changeDocType", items);

  if (items.length > 0) {
    activeDelete.value = true;
  } else {
    activeDelete.value = false;
  }
  listDocSelect.value = items;
};

const download = async (id) => {
  try {

    const { data } = await sgdeaAxios.get<DocumentoRadicado>(
      `/radicados/consultar_documento/${id}`
    );
    if (id) {
      nameDocument.value = listDocs.value.find((it) => it.id === id)?.nombre;
    }

    const byteCharacters = atob(data.base64x);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = nameDocument.value;

    link.click();

    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    toast.error("Ha ocurrido un error");
    console.error(error);
  }
};

const print = async (id) => {
  try {
    const { data } = await sgdeaAxios.get<DocumentoRadicado>(
      `/radicados/consultar_documento/${id}`
    );

    if (id) {
      nameDocument.value = listDocs.value.find((it) => it.id === id)?.nombre;
    }

    const byteCharacters = atob(data.base64x);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const blobUrl = URL.createObjectURL(blob);

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = blobUrl;
    document.body.appendChild(iframe);

    // Función para manejar el evento afterprint
    function handleAfterPrint() {
      // Eliminar el iframe después de imprimir o cancelar
      document.body.removeChild(iframe);
      window.removeEventListener("afterprint", handleAfterPrint);
    }

    // Agregar evento afterprint para manejar la impresión
    window.addEventListener("afterprint", handleAfterPrint);

    // Esperar a que se cargue el contenido del iframe antes de imprimir
    iframe.onload = function () {
      // Imprimir el contenido del iframe
      iframe.contentWindow.print();
    };
  } catch (error) {
    toast.error("Ha ocurrido un error");
    console.error(error);
  } finally {
  }
};

const eliminarDoc = async () => {
  loading.value = true;
  try {
    // Process each selected document
    await Promise.all(
      listDocSelect.value.map(async (doc) => {
        // If the document is saved, call the backend service to delete it
        if (doc.isSaved) {
          await sgdeaAxios.delete<any>(`/alfresco/deleteFile/${doc.id}`);
        }

        // Remove the document from the list
        listDocs.value = listDocs.value.filter((it) => it.id !== doc.id);
      })
    );

    activeDelete.value = false;
    toast.success("Documentos eliminados con éxito");
    listDocSelect.value = [];
  } catch (error) {
    // Manejar errores
    activeDelete.value = false;
    toast.error("Hubo un error, inténtelo de nuevo");
    listDocSelect.value = [];
  }
};

const rejectedFiles = (error: any[]) => {
  if (
    error.some(
      (it: { failedPropValidation: string }) =>
        it.failedPropValidation === "max-file-size"
    )
  ) {
    Notify.create({
      type: "error",
      message: "El peso permitido es hasta 30MB.",
    });
  }
  if (
    error.some(
      (it: { failedPropValidation: string }) =>
        it.failedPropValidation === "max-files"
    )
  ) {
    Notify.create({
      type: "error",
      message: `Solo se pueden adjuntar 30 archivos.`,
    });
  }
  if (
    error.some(
      (it: { failedPropValidation: string }) =>
        it.failedPropValidation === "accept"
    )
  ) {
    Notify.create({
      type: "error",
      message:
        "Formato inválido, los formatos permitidos son (pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg).",
    });
  }
};

const moveFileToTable = async () => {
  if (listDocs.value.length < 30 && formData.value.files.length < 30) {
    listDocs.value = [
      ...listDocs.value,
      ...formData.value.files.map((it: File, i: number) => ({
        id: (listDocs.value.length ?? 0) + i + 1,
        formato: it.type,
        nombre: it.name,
        tipo: "De gestión",
        fecha: fourthFormatDate(new Date()),
        cargado_por: auth.userInfo.name,
      })),
    ];
    files.value = [...files.value, ...formData.value.files];
    formData.value.files = [];
  } else {
    toast.error(
      formData.value.files.length +
        " archivo/s no cumple/n con el formato requerido, el limite de archivos o tiene/n un peso mayor a 50 MB"
    );
    formData.value.files = [];
  }
};

const guardar = async () => {
  if (!(await refForm.value.validate())) {
    return toast.error(
      "Debe diligenciar los campos obligatorios para continuar con el proceso"
    );
  }

  try {

    const form = new FormData();
    for (const file of files.value) {
      form.append("files", file);
    }

    form.append("respuesta", formData.value.observaciones);
    const filesSave = files.value.map((item) => item.name);
    const filesString = filesSave
  .map((name, index) => ` ${name}`)
  .join(", ");
    const response = await sgdeaAxios.patch(
      `/pqrd/escalamiento/guardarRespuesta/${escalamientoId.value}`,
      form
    );

    if ([200, 201, 202].includes(response.status)) {
      toast.success("Respuesta guardada con éxito");
      await crearTrazabilidad({
        proceso: "PQRD" + props.pqrdData.id,
        secuencia: props.pqrdData.idRadicado,
        estado: props.pqrdData.estado.estado,
        descripcion: `Usuario: ${auth.$state.userInfo.name} Documentos:${filesString} Motivo:${ formData.value.observaciones}`,
        comentario: "Respuesta de escalamiento",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} ha guardado su respuesta al escalamiento de la PQRD ${props.pqrdData.idRadicado}`,
        tramite:
          props.pqrdData.informacionSolicitud.tipologiaEntity.id == 7
            ? "PQRD Express"
            : "PQRD",
      });
    }
  } catch (error) {
    console.error(error);
  }
};
const cleanContentLength = (content) => {
  if (!content) return 0;
  const plainText = content.replace(/<\/?[^>]+(>|$)/g, ""); // Elimina etiquetas HTML
  return plainText.trim().length; // Calcula la longitud del texto limpio
};

const enviar = async () => {
  try {

    const form = new FormData();
    for (const file of files.value) {
      form.append("files", file);
    }

    form.append("respuesta", formData.value.observaciones);
    const response = await sgdeaAxios.patch(
      `/pqrd/escalamiento/responder/${escalamientoId.value}`,
      form
    );
    const filesSave = files.value.map((item) => item.name);
    const filesString = filesSave
  .map((name, index) => ` ${name}`)
  .join(", ");
    if ([200, 201, 202].includes(response.status)) {
      toast.success("El escalamiento se ha respondido con éxito");
      await crearTrazabilidad({
        proceso: "PQRD" + props.pqrdData.id,
        secuencia: props.pqrdData.idRadicado,
        estado: props.pqrdData.estado.estado,
        descripcion: `Usuario: ${auth.$state.userInfo.name} Documentos:${filesString} Motivo:${ formData.value.observaciones}`,
        comentario: "Respuesta de escalamiento",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} ha dado una respuesta al escalamienmto de la PQRD ${props.pqrdData.idRadicado}`,
        tramite:
          props.pqrdData.informacionSolicitud.tipologiaEntity.id == 7
            ? "PQRD Express"
            : "PQRD",
      });
      await router.push("/bandeja");
    }
  } catch (error) {
    console.error(error);
  }
};
</script>
