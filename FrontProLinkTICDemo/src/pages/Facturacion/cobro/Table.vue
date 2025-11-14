<template>
  <div>
    <q-table flat :rows="filteredData" :columns="FACTURA_HEADER" row-key="id_factura_a"
      table-header-class="text-black text-h6 " class="q-mr-md full-width"
      no-data-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
      no-results-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
      v-model:pagination="pagination" hide-pagination :loading="isLoading">
      <template v-slot:top-right>
        <div class="tw-flex tw-items-center tw-gap-x-3">
          <q-input outlined dense rounded v-model="search" label="Buscador" class="tw-w-[300px]"
            @update:model-value="generalFilter">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" :class="{
          'tw-bg-[#FFC7CE]': isOver72Hours(props.row.fecha, props.row.hora),
        }">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <div v-if="col.name == 'estado'" :class="[
              'tw-inline-block tw-p-1.5 tw-px-4 tw-rounded-lg tw-border tw-w-40',
              col.value === 'Por asignar' &&
                !checkIfMoreThanADay(props.row.fecha, col.value)
                ? 'tw-bg-[#FFECDC] tw-border-[#FF7500] tw-text-[#2C3948]'
                : col.value === 'Rechazado' ||
                  (col.value === 'Por asignar' &&
                    checkIfMoreThanADay(props.row.fecha, col.value))
                  ? 'tw-bg-[#FDE5E5] tw-border-[#EA0000] tw-text-[#2C3948]'
                  : ESTADOS[props.row.estado],
            ]">
              <span :class="['tw-font-semibold']">{{
                checkStatus(col.value)
              }}</span>
            </div>
            <div v-else-if="col.name == 'acciones'" class="tw-flex tw-row">
              <q-btn :label="getLabelEstados(props.row.estado)" no-caps class="tw-w-24 tw-h-9" flat unelevated @click="
                viewDetails(props.row.idCto, props.row.estado.toLowerCase())
                " v-if="
                  !(
                    props.row.estado.toLowerCase() == 'aprobado' ||
                    props.row.estado.toLowerCase() == 'gestión rechazada' ||
                    props.row.estado.toLowerCase() == 'aprobación rechazada' ||
                    props.row.estado.toLowerCase() == 'rechazado'
                  )
                " />
              <q-btn class="tw-w-auto tw-h-8 tw-ml-2" flat icon="file_open" color="secondary" @click="
                editDataDoc(props.row.nodeId, 'docRelacionado', props.row.sec)
                " />
              <q-btn v-if="props.row.estado.toLowerCase() == 'aprobado'" flat color="primary"
                @click="handleOpenPdf(props.row, 'pdf')">
                <q-icon name="visibility" />
              </q-btn>
            </div>
            <p v-else>{{ col.value }}</p>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:no-data="{ message }">
        <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
          <img v-lazy :data-url="require('src/assets/filterImage.svg')" alt="" width="120" />
          <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
            {{ message }}
          </span>
        </div>
      </template>

      <template v-slot:bottom>
        <div class="row items-center q-mt-md tw-w-full">
          <div class="col-auto tw-flex tw-gap-x-3 tw-items-center">
            <span>Filas</span>
            <q-select :options="[5, 25, 50, 100]" v-model:model-value="rowsPerPage" dense outlined
              @update:model-value="handleRowsPerPageChange" />
          </div>

          <div class="col tw-flex tw-justify-center">
            <q-pagination v-model="page" max-pages="20" ellipses color="primary" :max="TABLE_TOTAL_ROWS" size="md"
              direction-links boundary-links boundary-numbers @update:model-value="handlePageChange" />
          </div>

          <div class="col-auto tw-flex tw-items-center tw-text-right">
            {{ paginationMessage }}
            <div class="invisible"></div>
          </div>
        </div>
      </template>

    </q-table>
  </div>

  <!-- ! Docs -->
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
  <PdfView :showDialog="showPdfViewer" :pdfUrl="pdfDocument" @update:showDialog="showPdfViewer = $event" />

</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { checkStatus } from "src/helpers/checkStatus";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { useAuthStore } from "stores/auth.store";
import { checkIfMoreThanADay } from "src/helpers/filters";
import PdfView from "src/shared/components/PdfView/PdfView.vue";
import { ESTADOS } from "src/assets/estados/estados";
import moment from "moment";
import { fileColumnsDocs } from ".";
import { DocumentoRadicado } from "src/interfaces";
import AdjuntarDocumentosTable from "src/pages/EntesDeControl/Bandeja/Detalles/AdjuntarDocumentos/AdjuntarDocumentosTable.vue";

const props = withDefaults(
  defineProps<{
    FACTURA_HEADER: any[];
    FACTURA_BODY: any[];
    TABLE_TOTAL_ROWS: number;
    isLoading?: boolean;
    paginationMessage?: string;
  }>(), {}
);

const emit = defineEmits(["handleEdit", "handleRowsPerPageChange", "handlePageChange"]);
const router = useRouter();
const listDocs = ref([]);
const showDocs = ref(false);
const search = ref("");
const filteredData = ref([]);
const originData = ref([]);
const showPdfViewer = ref(false);
const pdfDocument = ref(null);
const { userInfo } = useAuthStore();
const pagination = ref({
  page: 1,
  rowsPerPage: 20,
});
const page = ref(1)
const rowsPerPage = ref(20);

const getLabelEstados = (row) => {
  const rowLabel = row.toLowerCase();

  if (rowLabel === "por asignar" || rowLabel === "radicado") return "Asignar";
  if (rowLabel === "por aprobar" || rowLabel === "gestionado") return "Aprobar";

  return "Gestionar";
};

const editDataDoc = (id: number, type: string, numeroRadicado: string) => {
  if (type === "docRelacionado") {
    getDocs(id, numeroRadicado);
  }
};

const getDocs = async (id: number, numeroRadicado: string) => {
  const url = `/facturacion/getDocumentosCuentaCobroByNodeId/${id}`;
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
            cargado_por: doc.usuario?.nombre || "-",
          };
        })
        .filter((doc) => doc !== null);
      const listDocsENT = listDocs.value.filter((docs) =>
        docs.nombre.startsWith("ENT")
      );
      listDocsENT.sort((a, b) => {
        if (a.nombre.includes(numeroRadicado)) return -1;
        if (b.nombre.includes(numeroRadicado)) return 1;
        return a.nombre.localeCompare(b.nombre);
      });

      // Agregar los objetos que no inicien por "ENT" al final de la lista
      const listDocsNotENT = listDocs.value.filter(
        (doc) => !doc.nombre.startsWith("ENT")
      );
      listDocs.value = listDocsENT.concat(listDocsNotENT);
      showDocs.value = true;
    } else {
      console.error("La respuesta no es un array:", response.data);
    }
  } catch (error) {
    console.error("Error al obtener documentos:", error);
  }
};

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

async function viewDetails(idFactura: number, row: string) {
  try {
    if (row.toLowerCase() === "por asignar") {
      const response = await sgdeaAxios.put(
        `facturacion/Reclamo?type=CUENTA&id=${idFactura}&idUser=${userInfo.userid}`
      );
    }

    let newroute = "";
    if (row.toLowerCase() === "por asignar") newroute = "radicadas";
    else newroute = "asignadas";

    router.push(`/facturacion/cuentas-cobro/${newroute}/detalle/` + idFactura);
  } catch (error) {
    if ([400, 401, 403, 404, 500].includes(error.response.status)) {
      toast.error("Esta cuenta de cobro ya fue reclamada por otro usuario.");
    }
  }
}

const handleOpenPdf = (row: any, tipoArchivo: string) => {
  getDocsDian(row, tipoArchivo);
};

const getDocsDian = async (
  datarow: { prefijo; consecutivo; nitOferente; tipoDocumento },
  tipoArchivo: string
) => {
  const { prefijo: prefijo, consecutivo: consecutivo } = datarow;
  const url = `/facManual/descargarPdfEmision`;

  const tipo_documento = "DS";
  const ofe_identificacion = "860011153";
  try {
    const response = await sgdeaAxios.get(url, {
      params: {
        tipo_documento,
        prefijo,
        consecutivo,
        ofe_identificacion
      }
    });
    if (response.status === 200) {
      const byteCharacters = atob(response.data.pdf);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray]);
      const blobUrl = URL.createObjectURL(blob);
      pdfDocument.value = blobUrl;
      showPdfViewer.value = true;
    } else {
      toast.error("Ocurrió un problema al aprobar el trámite.");
    }
  } catch (error) {
    const mensaje = error.response.data.message;
    if (mensaje.includes("El Documento")) {
      toast.error(mensaje);
    } else {
      toast.error("Ocurrió un problema al aprobar el trámite.");
    }
  }
};

const generalFilter = () => {
  filteredData.value = originData.value.filter((data) => {
    const fieldValues = Object.values(data).map(String);
    return fieldValues.some((value) =>
      value?.toLowerCase().includes(search.value?.toLowerCase())
    );
  });
};

function isOver72Hours(fecha, hora) {
  const rowDateTime = new Date(`${fecha} ${hora}`);
  const currentDateTime = new Date();
  const timeDifference = Number(currentDateTime) - Number(rowDateTime);
  const hoursDifference = timeDifference / (1000 * 60 * 60);

  return hoursDifference > 72;
}

const handleRowsPerPageChange = (event: any) => {
  pagination.value.rowsPerPage = event
  if (pagination.value.page > 0) {
    pagination.value.page = pagination.value.page - 1
  }
  emit("handleRowsPerPageChange", pagination.value);
};

const handlePageChange = () => {
  emit("handlePageChange", { page: page.value, rowsPerPage: pagination.value.rowsPerPage });
};

watch(() => props.FACTURA_BODY, (newValue) => {
  originData.value = newValue;
  filteredData.value = newValue;
});

</script>