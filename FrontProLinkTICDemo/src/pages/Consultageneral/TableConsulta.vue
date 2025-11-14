<template>
  <div>
    <q-table flat :rows="filteredData" :columns="TABLE_HEADER" :row-key="keyId" table-header-class="text-black text-h6"
      :selection="select" class="q-mr-md full-width" hide-pagination v-model:pagination="pagination"
      v-model:selected="selection">
      <template v-slot:top-right>
        <div class="tw-flex tw-items-center tw-gap-x-3">
          <q-input outlined dense rounded v-model="search" label="Buscar" class="tw-w-[280px]">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <div class="tw-flex tw-gap-1">
            <q-btn-dropdown class="!tw-px-4 !tw-py-1" color="accent" textColor="secondary" label="Exportar" no-caps
              dropdown-icon="expand_more" flat>
              <q-list separator dense>
                <q-item clickable v-close-popup @click="exportCSV()">
                  <q-item-section avatar>
                    <q-avatar square>
                      <q-img v-lazy :data-url="require('src/assets/csv.svg')" alt="csv" width="24px" height="24px" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>Exportar CSV</q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="exportXLSX()">
                  <q-item-section avatar>
                    <q-avatar square>
                      <q-img v-lazy :data-url="require('src/assets/excel.svg')" alt="excel" width="24px"
                        height="24px" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>Exportar XLSX</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-btn class="!tw-px-4 !tw-py-1" color="primary" icon="send" label="Enviar correo"
              @click="modalReporte = true" :disable="!props.TABLE_BODY?.length" :readonly="!props.TABLE_BODY?.length" />
          </div>
        </div>
      </template>

      <template #body="props">
        <q-tr :props="props" :class="props.row.visto ? 'bg-orange-1' : ''">
          <q-td key="selected">
            <q-checkbox v-model="props.selected" />
          </q-td>
          <q-td key="canalRad">
            {{ props.row.canalRad }}
          </q-td>

          <q-td key="fechaRad">
            {{ formatDateWithTimeAndMeridiem(props.row.fechaRad) }}
          </q-td>
          <q-td key="numRadicado">
            <p class="tipo-usuario" v-html="props.row.numRadicado.replace(/\n/g, '<br>')"></p>
            <p v-if="props.row.flujo === 'COMUNICACIONES_MEDICINA'" class="tipo-usuario">{{ props.row.radicadoSalida }}
            </p>
          </q-td>
          <q-td key="nroRadicadoRemitente">
            {{ props.row.nroRadicadoRemitente }}
          </q-td>
          <q-td key="nomRemitente">
            <div v-html="formatRemitente(props.row.nomRemitente)"></div>
          </q-td>
          <q-td key="numDocAfectado">
            {{ props.row.numDocAfectado }}
          </q-td>
          <q-td key="oficina">
            {{ props.row.oficina }}
          </q-td>
          <q-td key="tipoUsuario" style="white-space: normal;">
            <div v-if="props.row.tipoUsuario">
              <div v-for="(usuario, index) in props.row.tipoUsuario.split('\n').filter(line => line.trim() !== '')"
                :key="index" class="q-my-xs">
                <q-chip icon="person" dense>
                  
                  <span v-if="usuario.includes('/')">&nbsp;{{ usuario.split('/')[1].trim() }}: </span>
                  <strong v-if="usuario.includes('/')">{{ usuario.split('/')[0].trim() }} </strong>
                  <span v-else>{{ usuario.trim() }}</span>
                </q-chip>
              </div>
            </div>
            <div v-else>
              -
            </div>
          </q-td>
          <q-td key="tipoTramite">
            {{ props.row.tipoTramite }}
          </q-td>
          <q-td key="estado">
            <div :class="[
              'tw-inline-block tw-p-1.5 tw-px-4 tw-rounded-lg tw-border tw-w-40',
              ESTADOS[props.row.estado],
            ]">
              <span :class="['tw-font-semibold']">{{ props.row.estado || "-" }}
              </span>
            </div>
          </q-td>
          <q-td key="trazabilidad">
            <q-btn flat color="primary" @click="getTrazabilidad(props.row.idRadicado, props.row.flujo)"
              icon="history" />
          </q-td>

          <q-td v-if="isConsultas" key="actions">
            <q-td class="text-center">
              <q-btn size="sm" color="primary" :icon="icon || 'visibility'" flat
                @click="editData(props.row, false, props.row.idTutela)" />
            </q-td>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:body-cell-estado="props">
        <q-td class="text-center">
          <div :class="[
            'tw-inline-block tw-p-1.5 tw-px-4 tw-rounded-lg tw-border tw-w-40',
            !props.row?.tiempoXVencer ||
              props.row?.tiempoXVencer !== 'Vencido'
              ? ESTADOS[props.row.estado]
              : 'tw-bg-red-100 tw-border-red-400 tw-text-red-500',
          ]">
            {{ props.row?.estado || "-" }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-acciones="props">
        <q-td class="text-center">
          <div class="tw-flex tw-flex-row tw-w-32">
            <q-btn flat class="tw-w-24 tw-h-9" @click="editData(props.row.id)">
              <span class="tw-px-2">{{
                getLabelEstados(
                  props.row.estado,
                  props.row.clonado,
                  props.row.isConsolidador,
                  props.row.isEscalamiento
                )
              }}</span>
            </q-btn>
            <!-- <q-btn
              class="tw-w-auto tw-h-8 tw-ml-2"
              flat
              icon="file_open"
              color="secondary"
              @click="
                editDataDoc(
                  props.row.idTramite,
                  'docRelacionado',
                  props.row.nodeId,
                )
              "
            /> -->
          </div>
        </q-td>
      </template>

      <!-- <template v-slot:body-cell-acciones="props">
                <q-td class="text-center">
                    <q-btn class="tw-w-auto tw-h-9 flex" @click="editData(props.row.id)">
                        <span class="tw-px-2"> {{ isRolGestionador ? 'Gestionar': 'Asignar' }}</span>
                    </q-btn>
                     <q-btn size="sm" color="secondary" :icon="icon || 'edit'" flat
                        @click="editRow(props.row.id_seriesubserie || props.row.id || props.row[rowId])" />
                    <q-btn size="sm" color="secondary" :icon="secondIcon" flat v-if="isSecondIcon"
                        @click="viewDetails(props.row[rowId])" />
                </q-td>
            </template> -->

      <template v-slot:body-cell-actions="props">
        <q-td class="text-center">
          <q-btn size="sm" color="primary" :icon="icon || 'visibility'" flat @click="editData(props.row.id)" />
          <q-btn size="sm" color="secondary" :icon="secondIcon" flat v-if="isSecondIcon"
            @click="handleSecondIcon(props.row[rowId])" />
        </q-td>
      </template>

      <template v-slot:no-data="{ icon, message }">
        <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
          <img v-lazy :data-url="NoData" alt="" width="120" />
          <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
            {{ msgNoData ? msgNoData : "No existe data por el momento" }}
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
              {{ showingFullText ? "Ver menos" : "Ver más" }}
            </q-btn>
          </div>
        </div>
      </template>

      <template v-slot:body-cell-toggle="props">
        <q-td>
          <q-toggle v-model="props.row.toggle" color="secondary"></q-toggle>
        </q-td>
      </template>

    </q-table>
    <div class="row justify-between q-mt-md" v-if="TABLE_BODY?.length > 0">
      <div class="tw-flex tw-gap-x-3 tw-items-center">
        <span>Filas</span>
        <q-select :options="[5, 20, 50, 100]" v-model:model-value="rowsPerPage" dense outlined
          @update:model-value="handleFilas" />
      </div>
      <q-pagination v-model="numPage" color="primary" :max="totalPages" max-pages="10" size="md" direction-links
        boundary-links boundary-numbers @update:model-value="handlePage" />
      <div class="invisible"></div>

      <p class="tw-flex tw-gap-x-3 tw-items-center">
        {{ paginationMessage }}
      </p>
    </div>
  </div>
  <LoadingModal v-if="showModal" :total="100" @load-complete="showModal = false" />

  <q-dialog full-width v-model="trazaModal">
    <q-card class="q-pa-xl tw-w-[3000px]">
      <a @click="trazaModal = false" class="tw-text-primary" style="text-decoration: none">
        <q-icon size="1.5em" name="chevron_left" color="primary" />
        <b> Volver </b>
      </a>
      <Trazabilidad :doneItems="trazabilidadData" />
    </q-card>
  </q-dialog>
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
  <DialogEnviarReporte :open="modalReporte" :dataTable="props.TABLE_BODY" @cancelar="modalReporte = false"
    @aceptar="enviarCorreos" />
</template>

<script setup lang="ts">
import { useAuthStore } from "stores/auth.store";
import { computed, onMounted, ref, watch } from "vue";
import Trazabilidad from "../PQRD/Trazabilidad/trazabilidad.vue";
import DialogEnviarReporte from "../ReporteGeneral/DialogEnviarReporte.vue";
import AdjuntarDocumentosTable from "src/pages/EntesDeControl/Bandeja/Detalles/AdjuntarDocumentos/AdjuntarDocumentosTable.vue";
//@ts-ignore
import NoData from "assets/filterImage.svg";
import moment from "moment";
import { sgdeaAxios } from "src/services";
import { DocumentoRadicado } from "src/interfaces";
import { toast } from "src/helpers/toast";
import { ESTADOS } from "src/assets/estados/estados";
import { formatDateWithTimeAndMeridiem } from "src/helpers/formtDate";
import LoadingModal from "src/components/Modal/LoadingModal.vue";

const props = withDefaults(
  defineProps<{
    TABLE_BODY: any[];
    TABLE_HEADER: any[];
    icon?: string;
    keyId?: string;
    msgNoData?: string;
    rowId?: string;
    isSecondIcon?: boolean;
    secondIcon?: string;
    select: "none" | "single" | "multiple";
    totalPages: number;
    paginationMessage?: string;
    isConsultas: boolean;
    formulario: any;
    filtrosLista: any[];
    // buscar: string,
    // action: string,
    // target?: string,
  }>(),
  {
    select: "none",
    keyId: "codigo",
    secondIcon: "eye",
    isConsultas: false,
    // target: ""
  }
);

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
    name: "cargado_por",
    label: "Cargado Por",
    align: "center",
    field: (row) => row.cargado_por,
  },
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


const rows = computed(() => props.TABLE_BODY);
const { getUserInfo } = useAuthStore();
const numPage = ref(1);
const search = ref("");
const filteredData = ref([]);
const originData = ref([]);
const pagination = ref({
  sortBy: "desc",
  descending: true,
  page: 1,
  rowsPerPage: 20,
});
const showModal = ref(false);
const trazabilidadData = ref();
const rowsPerPage = ref(20);
const selection = ref([]);
const showingFullText = ref(false);
const trazaModal = ref(false);
const showDocs = ref(false);
const listDocs = ref([]);
const modalReporte = ref(false);

async function getTrazabilidad(id: number, flujo: string) {
  let processCode = id;
  let prefix = "";

  try {
    switch (flujo) {
      case "TUTELAS":
        prefix = "TUT";
        break;

      case "CORRESPONDENCIA":
        prefix = "COR";
        break;

      case "PQRD":
        prefix = "PQRD";
        break;

      case "ENTES_DE_CONTROL":
        prefix = "ENTC";
        break;

      case "MEDICINA_LABORAL":
        prefix = "ML";
        break;

      case "FAC_AMIN":
        prefix = "CTO";
        break;

      case "CORRESPONDENCIA_COMUNICACION":
        prefix = "COMIND";
        break;
      case "COMUNICACION_MANUAL":
        prefix = "PRE";
        break;
      case "COMUNICACIONES_MEDICINA":
        prefix = "MLCOM";
        break;
      default:
        console.error(`Flujo no soportado: ${flujo}`);
        return;
    }

    // Hacer la consulta de trazabilidad
    const response = await sgdeaAxios.get(
      `/trazabilidad/obtenerPorCodProceso/${prefix}${processCode}`
    );

    // Manejar respuesta
    if (!response?.data || response.data.length === 0) {
      trazabilidadData.value = [];
      return;
    }

    // Procesar los datos de trazabilidad
    trazabilidadData.value = response.data
      .sort((a, b) => a.id - b.id)
      .map((item) => ({
        ...item,
        fechaHora: item.fechaHora,
      }));

    // Abrir el modal con los datos de trazabilidad
    trazaModal.value = true;
  } catch (error) {
    console.error(error);
  }
}

const isRolGestionador = ref(false);

const emit = defineEmits([
  "update:itemSelected",
  "handleEditData",
  "handleSecondIcon",
  "update:filas",
  "update:pages",
]);

const formatRemitente = (text) => {
  if (!text) return "-";
  return text.replace(/(.{80})/g, "$1<br>");
};

const getLabelEstados = (estado, clonado, isConsolidador, isEscalamiento) => {
  const rowLabel = (estado || "").toLowerCase();

  if (rowLabel === "para gestión" && isEscalamiento)
    return "Gestionar escalado";
  if (rowLabel === "por asignar" || rowLabel === "radicado") return "Asignar";
  if (rowLabel === "por aprobar" || rowLabel === "gestionado") return "Aprobar";
  if (rowLabel === "para gestión" && clonado && isConsolidador)
    return "Por consolidar";
  if (rowLabel === "por revisar") return "Revisar";
  if (rowLabel === "para gestión" && clonado) return "Gestionar clonado";
  if (rowLabel === "aprobada") return "Entregar";
  if (rowLabel === "escalado") return "Gestionar escalado";

  return "Asignar";
};

const exportCSV = async () => {
  try {
    showModal.value = true;
    const params = new URLSearchParams();

    if (props.formulario.fechaInicio) {
      params.append("fechaInicial", props.formulario.fechaInicio);
    }

    if (props.formulario.fechaFinal) {
      params.append("fechaFinal", props.formulario.fechaFinal);
    }

    params.append("tipoArchivo", "1");
    const url = `/consultaGeneral/exportarReporte?${params}`;

    // Construir el objeto de filtros
    const filtrosObj = {};
    props.filtrosLista.forEach((filtro) => {
      if (filtro.value && typeof filtro.value === "object") {
        filtrosObj[filtro.field] = filtro.value.value;
      } else {
        filtrosObj[filtro.field] = filtro.value;
      }
    });

    // Obtener IDs de las filas seleccionadas
    const idsSeleccionados = selection.value.length > 0
      ? selection.value.map(item => item.idRadicado)
      : null;

    const body = {
      filtros: filtrosObj,
      ...(idsSeleccionados && { ids: idsSeleccionados })
    };

    const response = await sgdeaAxios.post(url, body);

    const base64Data = response.data;
    const binaryData = atob(base64Data);
    const byteArray = new Uint8Array(binaryData.length);

    for (let i = 0; i < binaryData.length; i++) {
      byteArray[i] = binaryData.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: "text/csv" });
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", `reporte_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(link);
  } catch (error) {
    console.error(error);
  } finally {
    const message = selection.value.length > 0
      ? "Los registros seleccionados han sido exportados en formato CSV."
      : "El reporte de radicados ha sido exportado en formato CSV.";
    toast.success(message);
    showModal.value = false;
  }
};

const exportXLSX = async () => {
  try {
    showModal.value = true;
    const params = new URLSearchParams();

    if (props.formulario.fechaInicio) {
      params.append("fechaInicial", props.formulario.fechaInicio);
    }

    if (props.formulario.fechaFinal) {
      params.append("fechaFinal", props.formulario.fechaFinal);
    }

    params.append("tipoArchivo", "2");
    const url = `/consultaGeneral/exportarReporte?${params}`;

    // Construir el objeto de filtros
    const filtrosObj = {};
    props.filtrosLista.forEach((filtro) => {
      if (filtro.value && typeof filtro.value === "object") {
        filtrosObj[filtro.field] = filtro.value.value;
      } else {
        filtrosObj[filtro.field] = filtro.value;
      }
    });

    // Obtener IDs de las filas seleccionadas
    const idsSeleccionados = selection.value.length > 0
      ? selection.value.map(item => item.idRadicado)
      : null;

    const body = {
      filtros: filtrosObj,
      ...(idsSeleccionados && { ids: idsSeleccionados })
    };

    const response = await sgdeaAxios.post(url, body);

    const base64Data = response.data;
    const binaryData = atob(base64Data);
    const byteArray = new Uint8Array(binaryData.length);

    for (let i = 0; i < binaryData.length; i++) {
      byteArray[i] = binaryData.charCodeAt(i);
    }

    const blob = new Blob([byteArray], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", `reporte_${new Date().toISOString()}.xlsx`);
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(link);
  } catch (error) {
    console.error(error);
  } finally {
    const message = selection.value.length > 0
      ? "Los registros seleccionados han sido exportados en formato XLSX."
      : "El reporte de radicados ha sido exportado en formato XLSX.";
    toast.success(message);
    showModal.value = false;
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

const enviarCorreos = async (
  correosSelecionador: string[],
  typeVal: number | null
) => {
  if (!typeVal || correosSelecionador.length <= 0) {
    toast.error("Complete todos los campos, por favor.");
    return;
  }

  try {
    showModal.value = true;
    const correos = correosSelecionador.join(",");

    // Construir parámetros base
    const params = new URLSearchParams();

    // Agregar fechas, tipo de archivo y correos
    if (props.formulario.fechaInicio) {
      params.append("fechaInicial", props.formulario.fechaInicio);
    }
    if (props.formulario.fechaFinal) {
      params.append("fechaFinal", props.formulario.fechaFinal);
    }
    params.append("tipoArchivo", typeVal.toString());
    params.append("email", correos);

    const url = `/consultaGeneral/enviarReporte?${params}`;

    // Construir el objeto de filtros
    const filtrosObj = {};
    props.filtrosLista.forEach((filtro) => {
      if (filtro.value && typeof filtro.value === "object") {
        filtrosObj[filtro.field] = filtro.value.value;
      } else {
        filtrosObj[filtro.field] = filtro.value;
      }
    });

    // Obtener IDs de las filas seleccionadas
    const idsSeleccionados = selection.value.length > 0
      ? selection.value.map(item => item.idRadicado)
      : null;

    const body = {
      filtros: filtrosObj,
      ...(idsSeleccionados && { ids: idsSeleccionados })
    };

    await sgdeaAxios.post(url, body);

    modalReporte.value = false;

    const message = selection.value.length > 0
      ? "El reporte de los registros seleccionados ha sido enviado con éxito a los correos ingresados."
      : "El reporte de radicados ha sido enviado con éxito a los correos ingresados.";

    toast.success(message);
  } catch (error) {
    toast.error("Hubo un error al enviar el correo.");
  } finally {
    showModal.value = false;
  }
};

const editData = (row, validView, idTutela: number) => {
  emit("handleEditData", row, validView, idTutela);
};

const handleSecondIcon = (id: number) => {
  emit("handleSecondIcon", id);
};

watch(
  () => props.TABLE_BODY,
  (newValue) => {
    originData.value = newValue;
    filteredData.value = newValue;
  }
);

watch(rowsPerPage, (value) => {
  pagination.value.rowsPerPage = rowsPerPage.value;
});

watch(selection, (newdateData) => {
  selection.value = newdateData;
  emit("update:itemSelected", selection.value);
});

onMounted(async () => {
  isRolGestionador.value = (await getUserInfo()).role.includes("Gestionador");
});

const collapseContent = (text = "") => {
  if (showingFullText.value) {
    return text;
  }
  return `${text?.slice(0, 200).trim()}`;
};

const handleFilas = () => {
  emit("update:filas", rowsPerPage.value);
};

const handlePage = () => {
  emit("update:pages", rowsPerPage.value, numPage.value);
};

//TODO: VALIDAR ERRORES DE CONSULTA, BORRAR FUNCIONES NO USADAS
</script>
