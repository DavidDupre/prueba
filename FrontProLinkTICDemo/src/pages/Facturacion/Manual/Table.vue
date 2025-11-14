<template>
  <div>
    <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId" table-header-class="text-black text-h6"
      :selection="none" class="q-mr-md full-width" hide-pagination v-model:pagination="pagination"
      v-model:selected="selection">
      <template v-slot:body-cell-estados="props">
        <q-td class="tw-w-[125px]">
          <p :class="[
            'tw-border tw-h-[20px] tw-rounded-xl col-8',
            props.row.estados ? ' tw-border-green-700 tw-bg-green-100' : ' tw-border-gray-400 tw-bg-gray-200 tw-text-secondary'
          ]">
            {{ props.row.estados ? 'Activo' : '-' }}
          </p>
        </q-td>
      </template>

      <template v-slot:body-cell-estado="props">
        <q-td class="text-center">
          <div :class="[
            'tw-border tw-rounded-lg q-my-sm tw-max-w-max q-px-md q-py-xs',
            props.row.estado ? 'tw-bg-orange-100 tw-border-orange-400' : 'tw-bg-slate-200 tw-border-slate-400 tw-text-blue-500'
          ]">
            {{ props.row.estado }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-acciones="props">
        <q-td class="text-center">
          <q-btn class="tw-w-auto tw-h-9 flex" color="grey-2" text-color="grey-9" @click="editData(props.row.id)">

            <span class="tw-px-2">Gestionar</span>
          </q-btn>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td class="text-center">
          <q-btn size="sm" color="primary" :icon="icon || 'visibility'" flat @click="editData(props.row[rowId])" />
          <q-btn size="sm" color="secondary" :icon="secondIcon" flat v-if="isSecondIcon"
            @click="handleSecondIcon(props.row[rowId])" />
        </q-td>
      </template>

      <template v-slot:no-data="{ icon, message }">
        <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
          <img v-lazy :data-url="NoData" alt="" width="120">
          <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
            {{ msgNoData ? msgNoData : 'No existe data por el momento' }}
          </span>
        </div>
      </template>

      <template v-slot:body-cell-procedimiento="props">
        <div class="tw-border-b-[1px] tw-w-96 tw-px-2">
          <p class="tw-text-center tw-border-0">
            {{ collapseContent(props.row.procedimiento) }}
          </p>
          <div class="tw-flex tw-justify-end" v-if="props.row.procedimiento?.length >= 200">
            <q-btn flat color="secondary" @click="showingFullText = !showingFullText">
              {{ showingFullText ? 'Ver menos' : 'Ver más' }}
            </q-btn>
          </div>
        </div>
      </template>

      <template v-slot:body-cell-toggle="props">
        <q-td>
          <q-toggle v-model="props.row.toggle" color="secondary"></q-toggle>
        </q-td>
      </template>

      <template v-slot:body-cell-trazabilidad="props">
        <q-td>
          <q-btn flat color="primary" @click="getTrazabilidad(props.row.id, props.row.numeroFactura)" icon="history">
          </q-btn>
        </q-td>
      </template>

      <template v-slot:body-cell-documentos="props">
        <q-td>
          <div class="tw-flex">
            <q-btn flat color="primary" @click="
              editDataDoc(
                props.row.secuencia,
                'docRelacionado',
                props.row.id)
              ">
              <q-icon name="inventory" />
            </q-btn>
            <q-btn flat color="primary" @click="handleOpenUpload(props.row.secuencia,)">
              <q-icon name="backup" />
            </q-btn>
            <q-btn flat color="primary" @click="handleOpenCorreo(props.row.secuencia,
              'docRelacionado',
              props.row.id, props.row.numeroFactura, props.row)">
              <q-icon name="send" />
            </q-btn>

            <q-btn-dropdown dropdown-icon="visibility" color="primary"
              v-if="props.row.estado === 'EMITIDA' && props.row.emitidaDian == true">
              <q-list>
                <q-item clickable v-close-popup @click="handleOpenPdf(props.row)">
                  <q-item-section>
                    <q-item-label>PDF</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="dataDocOpen(props.row, 'xml')">
                  <q-item-section>
                    <q-item-label>XML</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="dataDocOpen(props.row, 'attached')">
                  <q-item-section>
                    <q-item-label>ATTACHED</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
          <!--  dataDocOpen(props.row.secuencia, props.row.id) handleOpenPdf(props.row)-->
        </q-td>

      </template>


      <template v-slot:body-cell-docs="props">
        <q-td>
          <q-btn flat color="secondary"
            @click="$router.push('/facturacion/facturas-manual/detalles/' + props.row.id) + '/docsRelacionados'"
            icon="folder">
          </q-btn>
        </q-td>
      </template>

    </q-table>
    <div class="row justify-between q-mt-md" v-if="TABLE_BODY?.length > 0">
      <div class="tw-flex tw-gap-x-3 tw-items-center">
        <span>Filas</span>
        <q-select :options="[5, 20, 25, 50, 100]" v-model:model-value="rowsPerPage" dense outlined
          @update:model-value="handleRowsPerPageChange" />
      </div>
      <q-pagination v-model="pagination.page" color="primary" :max="pagesNumber" size="md" direction-links
        boundary-links boundary-numbers @update:model-value="handlePageChange" />
      <q-btn icon="refresh" type="button" flat class="invisible" />
    </div>
  </div>
  <Trazabilidad :data="trazabilidadData" :trazaModal="trazaModal" @update:trazaModal="trazaModal = $event"
    :factNum="factNumber" />
  <q-dialog v-model="showDocs" full-width>
    <q-card class="q-pa-xl tw-w-[800px]">
      <div class="row tw-justify-between">
        <span class="tw-text-xl">Documentos</span>
        <q-btn icon="close" flat @click="showDocs = false" />
      </div>
      <div class="q-mt-sm">
        <AdjuntarDocumentosTable :TABLE_HEADER="fileColumnsDocs" :TABLE_BODY="listDocs" @downloadDoc="download"
          @printDoc="print" />
      </div>
    </q-card>
  </q-dialog>
  <q-dialog v-model="showUploadDocs" full-width>
    <q-card :class="['tw-px-3', 'tw-p-9 tw-w-[980px]']">
      <q-form greedy ref="adjuntrdocs">
        <q-card-section class="text-h6 tw-max-w-sm text-center text-weight-bold">
          Adjuntar documentos
        </q-card-section>
        <q-card-section class="tw-max-w-sm">

          <FileLoader :max-file-size="10 * 1024 * 1024" max-file-size-label="10" v-model:model-value="files"
            :max-files="10" accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg" @rejected="rejectedFiles" multiple />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn :label="`Adjuntar`" style="width: 250px; height: 45px; border-radius: 8px; font-size: 18px;"
            text-color="white" color="secondary" class="tw-rounded-xl tw-p-3 " @click="handleFileUpload" />
        </q-card-actions>
      </q-form>
    </q-card>

  </q-dialog>
  <EnviarCorreo :open="enviarCorreo" :filesOptions="combinedDocs" @cancelar="enviarCorreo = false"
    @aceptar="sendCorreo" />
  <PdfView :showDialog="showPdfViewer" :pdfUrl="pdfDocument" @update:showDialog="showPdfViewer = $event" />
</template>
<script setup lang="ts">

import { computed, ref, watch } from "vue";
import Trazabilidad from "./Trazabilidad/TrazabilidadModal.vue"
import AdjuntarDocumentosTable from "src/pages/EntesDeControl/Bandeja/Detalles/AdjuntarDocumentos/AdjuntarDocumentosTable.vue";
import FileLoader from "src/components/FormFields/FileLoader.vue";
import EnviarCorreo from "./enviarCorreo.vue";
//@ts-ignore
import NoData from "assets/filterImage.svg"
import moment from "moment";
import { sgdeaAxios } from "src/services";
import { DocumentoRadicado } from "src/interfaces";
import { toast } from "src/helpers/toast";
import PdfView from "src/shared/components/PdfView/PdfView.vue";
const props = withDefaults(defineProps<{
  TABLE_BODY: any[],
  TABLE_HEADER: any[],
  TABLE_TOTAL_ROWS: number;
  icon?: string,
  keyId?: string,
  msgNoData?: string,
  rowId?: string,
  isSecondIcon?: boolean,
  secondIcon?: string,
  select: "none" | "single" | "multiple",
  pagesNumber?: number,
  // buscar: string,
  // action: string,
  // target?: string,
}>(), {
  select: "none",
  keyId: "codigo",
  secondIcon: "eye",
  pagesNumber: 1,
  // target: ""
})
const pagination = ref({
  sortBy: 'fecha',
  descending: true,
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0
})
const trazabilidadData = ref<{
  mensajeInicial: string;
  mensajeCompleto: string;
  fechaInicio: string;
  estado: string;
  reglas: string[];
}>({
  mensajeInicial: "",
  mensajeCompleto: "",
  fechaInicio: "",
  estado: "",
  reglas: []
});


const files = ref([])
const enviarCorreo = ref(false);

const fileColumnsDocs = ref([
  {
    name: "formato",
    label: "Formato",
    align: "center",
    field: (row) => row.formato,
  },
  {
    name: "nombre",
    label: "Nombre",
    align: "center",
    field: (row) => row.nombre,
  },
  { name: "tipo", label: "Tipo", align: "center", field: (row) => row.tipo },
  {
    name: "nodeId",
    label: "Node ID",
    align: "center",
    field: (row) => row.nodeId,
  },
  { name: "fecha", label: "Fecha", align: "center", field: (row) => row.fecha },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    sortable: true,
    align: "center",
  },
]);
const trazaModal = ref(false);

const rowsPerPage = ref(20)
const selection = ref([])
const showingFullText = ref(false)
const listDocs = ref([]);
const listDocsOpen = ref([]);
const showDocs = ref(false);
const showUploadDocs = ref(false);
const radicadoNumber = ref();
const factNumber = ref();
const availableFiles = ref([]);
const facturaNumber = ref();
let pagesNumber = computed(() =>
  Math.ceil((props.TABLE_TOTAL_ROWS ?? props.TABLE_BODY.length) / rowsPerPage.value) ?? props.pagesNumber
);

const emit = defineEmits([
  'update:itemSelected',
  'handleEditData',
  'handleSecondIcon',
  "handlePageChange",
  "handleRowsPerPageChange"
]);

const editData = (id: number) => {
  emit('handleEditData', id)
}

const handleSecondIcon = (id: number) => {
  emit('handleSecondIcon', id)
}

watch(rowsPerPage, (value) => {
  pagination.value.rowsPerPage = value;
})

watch(selection, (newdateData) => {
  selection.value = newdateData
  emit('update:itemSelected', selection.value)
});

const handleRowsPerPageChange = (event: any) => {
  emit("handleRowsPerPageChange", event);
};

const handlePageChange = (event: any) => {
  emit("handlePageChange", event);
};

const collapseContent = (text = '') => {
  if (showingFullText.value) {
    return text;
  }
  return `${text?.slice(0, 200).trim()}`;
}

async function getTrazabilidad(id: number, numeroFactura) {
  const url = `/facManual/obtenerListadoTrazabilidadFacManualXID/${id}`;
  try {
    const response = await sgdeaAxios.get(url);
    trazabilidadData.value = response.data;
    trazaModal.value = true;
  } catch (error) {
    console.error('Error al obtener trazabilidad:', error);
  }
  factNumber.value = numeroFactura
}

const editDataDoc = (id: number, type: string, numeroRadicado: string) => {
  if (type === "docRelacionado") {
    getDocs(id, numeroRadicado);
    showDocs.value = true;
  }
};

const dataDocOpen = async (row: any, tipoArchivo: string) => {
  getDocsOpen(row, tipoArchivo);
};

const docsLoaded = ref(false);
const getDocs = async (id: number, numeroRadicado: string) => {
  const url = `/facManual/getDocumentosByFacManual/${id}`;
  try {
    const response = await sgdeaAxios.get(url);
    if (Array.isArray(response.data)) {
      listDocs.value = response.data
        .map((doc) => {
          if (doc.tipoArchivo.toLowerCase().includes("entrada")) {
            doc.tipoArchivo = "De entrada";
          } else if (doc.tipoArchivo.toLowerCase().includes("salida")) {
            doc.tipoArchivo = "De salida";
          }

          return {
            tipo: doc.tipoArchivo,
            nombre: doc.nombreArchivo,
            id: doc.id,
            nodeId: doc.nodeId,
            fecha: moment(doc.fechaCargue).format("DD/MM/YYYY HH:mm"),
          };
        })
        .filter((doc) => doc !== null);
      const listDocsENT = listDocs.value.filter((docs) =>
        docs.nombre.startsWith("ENT")
      );
      listDocsENT.sort((a, b) => {
        if (a.nombre.includes(id)) return -1;
        if (b.nombre.includes(id)) return 1;
        return a.nombre.localeCompare(b.nombre);
      });

      const listDocsNotENT = listDocs.value.filter(
        (doc) => !doc.nombre.startsWith("ENT")
      );
      listDocs.value = listDocsENT.concat(listDocsNotENT);
      docsLoaded.value = true;
    } else {
      console.error("La respuesta no es un array:", response.data);
    }
  } catch (error) {
    console.error("Error al obtener documentos:", error);
  }
  availableFiles.value = listDocs.value;
};

const getDocsOpen = async (datarow: { prefijoFactura, numeroFactura, nitOferente, tipoDocumento }, tipoArchivo: string) => {
  const { prefijoFactura: prefijo, numeroFactura: consecutivo, nitOferente: ofe_identificacion, tipoDocumento: tipo_documento } = datarow;
  const url = `/facManual/obtenerDocumento/${tipoArchivo}`;

  let postData = new FormData();
  postData.append('tipo_documento', tipo_documento);
  postData.append('prefijo', prefijo);
  postData.append('consecutivo', consecutivo);
  postData.append('ofe_identificacion', ofe_identificacion);

  try {
    const response = await sgdeaAxios.post(url, postData);

    const base64Data = response.data.xml_ubl || response.data.attached_document;
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    let fileName = '';

    if (response.data.xml_ubl) {
      fileName = `${prefijo}_${consecutivo}.xml`;
    } else if (response.data.attached_document) {
      fileName = `attached_${prefijo}_${consecutivo}_${tipoArchivo}.xml`;
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error) {
    console.error('Error al descargar el documento:', error);
  }
};

let responsePdf, responseXml, responseAttached;

const getAllDocsOpen = async (datarow: { prefijoFactura, numeroFactura, nitOferente, tipoDocumento }, isEmitida: boolean) => {
  const { prefijoFactura: prefijo, numeroFactura: consecutivo, nitOferente: ofe_identificacion, tipoDocumento: tipo_documento } = datarow;
  const urlPdf = `/facManual/obtenerDocumento/pdf`;
  const urlXml = `/facManual/obtenerDocumento/xml`;
  const urlAttached = `/facManual/obtenerDocumento/attached`;

  let postData = new FormData();
  postData.append('tipo_documento', tipo_documento);
  postData.append('prefijo', prefijo);
  postData.append('consecutivo', consecutivo);
  postData.append('ofe_identificacion', ofe_identificacion);

  try {
     [responsePdf, responseXml, responseAttached] = await Promise.all([
      sgdeaAxios.post(urlPdf, postData),
      sgdeaAxios.post(urlXml, postData),
      sgdeaAxios.post(urlAttached, postData),
    ]);

    function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    const generateId = () => Math.floor(Math.random() * 1000000);

    // Verifica si la respuesta contiene datos antes de hacer push
    if (responsePdf && responsePdf.data && isEmitida) {
      listDocsOpen.value.push({
        id: generateId(),
        nodeId: generateUUID(),
        formato: 'pdf',
        fechaCargue: new Date().toISOString(),
        tipoArchivo: 'SALIDA',
        nombre: `${prefijo}_${consecutivo}.pdf`
      });
    }

    if (responseXml && responseXml.data && isEmitida) {
      listDocsOpen.value.push({
        id: generateId(),
        nodeId: generateUUID(),
        formato: 'xml',
        fechaCargue: new Date().toISOString(),
        tipoArchivo: 'SALIDA',
        nombre: `${prefijo}_${consecutivo}.xml`
      });
    }

    if (responseAttached && responseAttached.data && isEmitida) {
      listDocsOpen.value.push({
        id: generateId(),
        nodeId: generateUUID(),
        formato: 'attached', // Ajusta según el formato del archivo attached
        fechaCargue: new Date().toISOString(),
        tipoArchivo: 'SALIDA',
        nombre: `attached_${prefijo}_${consecutivo}_${tipo_documento}.xml`
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const combinedDocs = computed(() => {
  return [...listDocs.value, ...listDocsOpen.value];
});

const download = async (id: string, name: string) => {
  try {
    const response = await sgdeaAxios.get(
      "/radicados/consultar_documento/" + id
    );

    const name = listDocs.value.find((it) => it.nodeId === id)?.nombre;

    const byteCharacters = atob(response.data.base64x);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const enlaceDescarga = document.createElement("a");
    enlaceDescarga.href = URL.createObjectURL(blob);
    enlaceDescarga.download = name;

    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
    document.body.removeChild(enlaceDescarga);
  } catch (error) {
    console.error(error);
  }
};

const print = (id) => {
  const url = `/radicados/consultar_documento/${id}`;

  sgdeaAxios
    .get<DocumentoRadicado>(url)
    .then(({ data }) => {
      const byteCharacters = atob(data.base64x);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      let iframe = document.createElement("iframe");
      iframe.name = data.name;
      iframe.src = blobUrl;
      document.body.querySelector("#load-docs").appendChild(iframe);

      iframe.onload = function () {
        iframe.contentWindow.print();
        document.querySelector("head title").textContent = data.name;
      };
    })
    .catch((error) => {
      toast.error("Ha ocurrido un error al cargar el documento");
    });
};
const rejectedFiles = (error) => {
  if (error.some((it) => it.failedPropValidation === 'max-file-size')) {
    toast.error('El peso permitido es hasta 10MB.')
  }
  if (error.some((it) => it.failedPropValidation === 'max-files')) {
    toast.error('Solo se pueden adjuntar 10 archivos.')
  }
  if (error.some((it) => it.failedPropValidation === 'accept')) {
    toast.error('Formato inválido, los formatos permitidos son (pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg).')
  }
}
const handleOpenUpload = (numeroRadicado: string) => {
  radicadoNumber.value = numeroRadicado
  showUploadDocs.value = true
}

const handleFileUpload = async () => {

  if (files.value.length == 0) return;
  const numeroRadicado = radicadoNumber.value

  const formdata = new FormData();
  for (let i = 0; i < files.value.length; i++) {
    formdata.append("archivos", files.value[i]);

  }

  try {
    const response = await sgdeaAxios.post(`facManual/adjuntarDocumentos/${numeroRadicado}`, formdata)
    if (response.status === 200) {
      files.value = []
      toast.success("Archivos subidos con exito");

    }
  } catch (error) {
    let errorMessage = 'Ha ocurrido un error';

    if (error.response && error.response.data && typeof error.response.data.message === 'string') {
      const responseDataMessage = error.response.data.message;

      if (responseDataMessage.includes('Error inesperado al subir archivos a Alfresco')) {
        const extractedMessage = responseDataMessage.split(':')[1]?.trim();
        if (extractedMessage) {
          const cleanedMessage = extractedMessage.replace(/en Alfresco/i, '').trim();
          errorMessage = ` ${cleanedMessage}`;
        }
      } else {
        errorMessage;
      }
    }
    toast.error(errorMessage);
  }

}


function handleOpenCorreo(id: number, type: string, numeroRadicado: string, numerofact: string, row: any) {

  facturaNumber.value = numerofact;
  listDocsOpen.value = [];
  getDocs(id, numeroRadicado);
  getAllDocsOpen(row, (row.estado === 'EMITIDA' && row.emitidaDian == true));

  enviarCorreo.value = true;
}

async function sendCorreo(selectedCorreos, asunto, files) {
  let formData = new FormData();

  for (const item of files) {
    const { data } = await sgdeaAxios.get(`/radicados/consultar_documento/${item.nodeId}`);
    if (data) {
      const nombreDocumento = data.name;
      const byteCharacters = atob(data.base64x);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const file = new File([blob], nombreDocumento, { type: 'application/pdf' });
      formData.append('archivos', file);

    }
  }
  for (const item of files) {
    // Si el formato es PDF, usa el responsePdf.pdf_notificacion
    if (item.formato && item.formato.toLowerCase() === 'pdf') {
      // Convertir base64 a Blob y luego a File para adjuntar al FormData
      const base64 = responsePdf.data.pdf_notificacion;
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const file = new File([blob], item.nombre || 'documento.pdf', { type: 'application/pdf' });
      formData.append('archivos', file);
    } else if (item.formato && item.formato.toLowerCase() === 'xml') {
      // Convertir base64 a Blob y luego a File para adjuntar al FormData
      const base64 = responseXml.data.xml_ubl;
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/xml' });
      const file = new File([blob], item.nombre || 'documento.xml', { type: 'application/xml' });
      formData.append('archivos', file);
    } else if (item.formato && item.formato.toLowerCase() === 'attached') {
        // Convertir base64 a Blob y luego a File para adjuntar al FormData
        const base64 = responseAttached.data.attached_document;
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/xml' });
        const file = new File([blob], item.nombre || 'attached.xml', { type: 'application/xml' });
        formData.append('archivos', file);
      }
    }

  formData.append('email', selectedCorreos);
  formData.append('asunto', asunto);
  formData.append('nroFactura', facturaNumber.value);

  try {
    const response = await sgdeaAxios.post(`/facManual/envioCSV`, formData);
    if (response.status === 200) {
      toast.success("Correo enviado con exito");
    }
  } catch (error) {
    toast.error('Error al enviar correo');
  }
}
const showPdfViewer = ref(false);

const handleOpenPdf = (row: any) => {
  getDocsDian(row);
}
const pdfDocument = ref(null);

const getDocsDian = async (datarow) => {
  const { prefijoFactura: prefijo, numeroFactura: consecutivo, nitOferente: ofe_identificacion, tipoDocumento: tipo_documento } = datarow;
  const url = '/facManual/obtenerDocumento/pdf';
  let postData = new FormData();

  postData.append('tipo_documento', tipo_documento);
  postData.append('prefijo', prefijo);
  postData.append('consecutivo', consecutivo);
  postData.append('ofe_identificacion', ofe_identificacion);

  try {
    const responsePdf = await sgdeaAxios.post(url, postData);

    const byteCharacters = atob(responsePdf.data.pdf_notificacion);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray]);
    const blobUrl = URL.createObjectURL(blob);
    pdfDocument.value = blobUrl

    showPdfViewer.value = true;
  } catch (error) {
    console.error(error);
  }
  availableFiles.value = listDocs.value;
};

</script>
<style>
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24
}

.pdf-viewer .download-button {
  display: none;
}

/* Ocultar el botón de impresión */
.pdf-viewer .print-button {
  display: none;
}
</style>
