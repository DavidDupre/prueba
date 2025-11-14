<template>
  <q-table
    flat
    :rows="filteredData"
    :columns="TABLE_HEADER"
    :row-key="keyId"
    table-header-class="text-black text-h6"
    :selection="select"
    class="q-mr-md full-width"
    v-model:pagination="props.pagination.value"
    v-model:selected="selection"
    color="primary"
    no-data-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
    no-results-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
  >
    <template v-slot:top-right>
      <div class="tw-flex tw-items-center tw-gap-x-3">
        <q-input
          outlined
          dense
          rounded
          v-model="search"
          label="Buscar"
          class="tw-w-[280px]"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <div class="tw-flex tw-gap-1">
          <q-btn-dropdown
            class="!tw-px-4 !tw-py-1"
            color="accent"
            textColor="secondary"
            label="Exportar"
            no-caps
            dropdown-icon="expand_more"
            flat
          >
            <q-list separator dense>
              <q-item clickable v-close-popup @click="exportCSV()">
                <q-item-section avatar>
                  <q-avatar square>
                    <q-img
                      v-lazy
                      :data-url="require('src/assets/csv.svg')"
                      alt="csv"
                      width="24px"
                      height="24px"
                    />
                  </q-avatar>
                </q-item-section>

                <q-item-section>Exportar CSV</q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="exportXLSX()">
                <q-item-section avatar>
                  <q-avatar square>
                    <q-img
                      v-lazy
                      :data-url="require('src/assets/excel.svg')"
                      alt="excel"
                      width="24px"
                      height="24px"
                    />
                  </q-avatar>
                </q-item-section>

                <q-item-section>Exportar XLSX</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn
            class="!tw-px-4 !tw-py-1"
            color="primary"
            icon="send"
            label="Enviar correo"
            @click="modalReporte = true"
            :disable="!props.TABLE_BODY?.length"
            :readonly="!props.TABLE_BODY?.length"
          />
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
          <pre class="tipo-usuario">{{ props.row.numRadicado }}</pre>
          <pre
            v-if="props.row.flujo === 'COMUNICACIONES_MEDICINA'"
            class="tipo-usuario"
            >{{ props.row.radicadoSalida }}</pre
          >
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
        <q-td key="tipoUsuario">
          <pre class="tipo-usuario">{{ props.row.tipoUsuario }}</pre>
        </q-td>
        <q-td key="tipoTramite">
          {{ props.row.tipoTramite }}
        </q-td>
        <q-td key="estado">
          <div
            :class="[
              'tw-inline-block tw-p-1.5 tw-px-4 tw-rounded-lg tw-border tw-w-40',
              ESTADOS[props.row.estado],
            ]"
          >
            <span :class="['tw-font-semibold']"
              >{{ props.row.estado || "-" }}
            </span>
          </div>
        </q-td>
        <q-td key="trazabilidad">
          <q-btn
            flat
            color="primary"
            @click="getTrazabilidad(props.row.idRadicado, props.row.flujo)"
            icon="history"
          />
        </q-td>

        <q-td v-if="isConsultas" key="actions">
          <q-td class="text-center">
            <q-btn
              size="sm"
              color="primary"
              :icon="icon || 'visibility'"
              flat
              @click="editData(props.row, false, props.row.idTutela)"
            />
          </q-td>
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
      <div class="row tw-justify-between q-mt-md tw-w-[100%]">
        <div class="tw-flex tw-gap-x-3 tw-items-center">
          <span>Filas</span>
          <q-select
            :options="[5, 20, 50, 100]"
            v-model:model-value="props.pagination.rowsPerPage"
            dense
            outlined
            @update:model-value="handleRowsPerPageChange"
          />
        </div>
        <q-pagination
          v-model="pagination.page"
          max-pages="10"
          ellipsis
          color="primary"
          :max="totalPages2"
          size="md"
          direction-links
          boundary-links
          boundary-numbers
          @update:model-value="handlePageChange"
        />
        <div class="invisible"></div>

        <p class="tw-flex tw-gap-x-3 tw-items-center">
          {{ customMessageTableResults2 }}
        </p>
      </div>
    </template>
  </q-table>

  <q-dialog full-width v-model="trazaModal">
    <q-card class="q-pa-xl tw-w-[3000px]">
      <a
        @click="trazaModal = false"
        class="tw-text-primary"
        style="text-decoration: none"
      >
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
        <AdjuntarDocumentosTable
          :TABLE_HEADER="fileColumnsDocs"
          :TABLE_BODY="listDocs"
          @downloadDoc="download"
          @printDoc="print"
        />
      </div>
    </q-card>
  </q-dialog>
  <DialogEnviarReporte
    :open="modalReporte"
    :dataTable="props.TABLE_BODY"
    @cancelar="modalReporte = false"
    @aceptar="enviarCorreos"
  />
  <LoadingModal
    v-if="showModal"
    :total="100"
    @load-complete="showModal = false"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useAuthStore } from "stores/auth.store";
import { ESTADOS } from "src/assets/estados/estados";
import AdjuntarDocumentosTable from "src/pages/EntesDeControl/Bandeja/Detalles/AdjuntarDocumentos/AdjuntarDocumentosTable.vue";
import { sgdeaAxios } from "src/services";
import moment from "moment";
import { DocumentoRadicado } from "src/interfaces";
import { toast } from "src/helpers/toast";
import DialogEnviarReporte from "../ReporteGeneral/DialogEnviarReporte.vue";
import { formatDateWithTimeAndMeridiem } from "src/helpers/formtDate";
import Trazabilidad from "../PQRD/Trazabilidad/trazabilidad.vue";
import LoadingModal from "src/components/Modal/LoadingModal.vue";

const props = withDefaults(
  defineProps<{
    TABLE_BODY: any[];
    TABLE_HEADER: any[];
    icon?: string;
    keyId?: any;
    msgNoData?: string;
    rowId?: string;
    isSecondIcon?: boolean;
    secondIcon?: string;
    select: "none" | "single" | "multiple";
    isConsultas: boolean;
    pagination: any;
    totalPages: number;
    formulario: any;
    customMessageTableResults: any;
    filtrosLista: any[];
    totalData: any[];
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
const { getUserInfo } = useAuthStore();
const userInfo = ref();
const listDocs = ref();
const showDocs = ref(false);
const modalReporte = ref(false);
const showModal = ref(false);

const trazabilidadData = ref();
const rowsPerPage = ref(20);
const selection = ref([]);
const trazaModal = ref(false);
const isRolAprobador = ref(false);

const filteredData = ref([]);
const originData = ref([]);
const originDataTotal = ref([]);
const totalPages2 = ref(0);
const rowsNumber = ref(0);
const search = ref("");
const customMessageTableResults2 = ref("");
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

const formatRemitente = (text) => {
  if (!text) return "-";
  return text.replace(/(.{80})/g, "$1<br>");
};

const findRoles = (role) => {
  var nomenclatura = [
    "Administrador", //0
    "Asignador Responsable", //1
    "aprobador_sgdea", //2
    "Gestionador", //3
    "Radicador - Web", //4
    "Aprobador", //5
  ];
  var valid = false;
  role.forEach((element) => {
    if (userInfo.value?.role?.includes(nomenclatura[element])) {
      valid = true;
    }
  });
  return valid;
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

    const response = await sgdeaAxios.post(url, {
      filtros: filtrosObj,
    });

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
    toast.success("El reporte de radicados ha sido exportar en formato CSV.");
    showModal.value = false;
  }
};

const exportXLSX = async () => {
  try {
    showModal.value = true;
    const params = new URLSearchParams();

    // Agregar fechas y tipo de archivo
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

    const response = await sgdeaAxios.post(url, {
      filtros: filtrosObj,
    });

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
    toast.success("El reporte de radicados ha sido exportar en formato XLSX.");
    showModal.value = false;
  }
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

    await sgdeaAxios.post(url, {
      filtros: filtrosObj,
    });

    modalReporte.value = false;
    toast.success(
      "El reporte de radicados ha sido enviado con éxito a los correos ingresados."
    );
  } catch (error) {
    toast.error("Hubo un error al enviar el correo.");
  } finally {
    showModal.value = false;
  }
};

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
        fechaHora: moment(item.fechaHora).format("DD/MM/YYYY hh:mm"),
      }));

    // Abrir el modal con los datos de trazabilidad
    trazaModal.value = true;
  } catch (error) {
    console.error(error);
  }
}

const isRolGestionador = ref(false);

const generalFilter = () => {
  const resultadosFiltrados = originDataTotal.value.filter((data) => {
    if (!search.value) return true;

    const searchTerm = search.value.toLowerCase();
    const isPartialDate = (text) => {
      return /^\d{1,2}(\/\d{0,2}(\/\d{0,4})?)?$/.test(text);
    };
    if (isPartialDate(searchTerm)) {
      const searchParts = searchTerm.split("/");

      return Object.values(data).some((value) => {
        const strValue = String(value);
        if (strValue.match(/^\d{4}-\d{2}-\d{2}T/)) {
          const date = new Date(strValue);
          const formattedDate = formatDateWithTimeAndMeridiem(date);
          const dateParts = formattedDate.split("/");
          for (let i = 0; i < searchParts.length; i++) {
            if (
              searchParts[i] &&
              dateParts[i]?.startsWith(searchParts[i]) === false
            ) {
              return false;
            }
          }
          return true;
        }
        return strValue.toLowerCase().includes(searchTerm);
      });
    }
    return Object.values(data).some((value) =>
      String(value).toLowerCase().includes(searchTerm)
    );
  });

  const total = resultadosFiltrados.length;
  const pageSize = props.pagination.rowsPerPage;
  const maxPage = Math.ceil(total / pageSize);

  if (props.totalPages >= maxPage) {
    totalPages2.value = maxPage || 1;
  }

  const currentPage = props.pagination.page - 1;
  const firstElement = currentPage * pageSize + 1;
  const lastElement = Math.min(currentPage * pageSize + pageSize, total);

  customMessageTableResults2.value =
    total === 0
      ? "No se encontraron resultados"
      : `Mostrando ${firstElement} al ${lastElement} de ${total} resultados`;

  filteredData.value = resultadosFiltrados.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );
};

const emit = defineEmits([
  "update:itemSelected",
  "handleEditData",
  "handleSecondIcon",
  "update:filas",
  "update:pages",
  "handleRowsPerPageChange",
  "handlePageChange",
  "searchValue",
]);

const editData = (row, validView, idTutela: number) => {
  emit("handleEditData", row, validView, idTutela);
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

watch(rowsPerPage, (value) => {
  props.pagination.rowsPerPage = value;
});

watch(selection, (newdateData) => {
  selection.value = newdateData;
  emit("update:itemSelected", selection.value);
});

const handleRowsPerPageChange = (rows) => {
  props.pagination.rowsPerPage = rows;
  props.pagination.page = 1; // reinicia a la primera página
  generalFilter(); // ← aquí también
  emit("handleRowsPerPageChange", rows);
};
const handlePageChange = (page) => {
  props.pagination.page = page;
  generalFilter(); // ← aquí llamas a la función
  emit("handlePageChange", page);
};

onMounted(() => {
  props.pagination.value = { page: 1, rowsPerPage: 20, sortBy: "desc" };
  generalFilter();
  userInfo.value = getUserInfo();
  isRolGestionador.value = String(getUserInfo().role)?.includes("Gestionador");
  isRolAprobador.value = String(getUserInfo().role) == "Aprobador";

  if (findRoles([1])) {
    props.pagination.sortBy = "fechaRadicacion";
  }
  if (findRoles([3, 0])) {
    props.pagination.sortBy = null;
  }
  if (findRoles([5])) {
    props.pagination.sortBy = "fechaRadicacion";
  }
});

watch(
  () => ({
    tableBody: props.TABLE_BODY,
    totalData: props.totalData,
    customMessageTableResults: props.customMessageTableResults,
    totalPages: props.totalPages,
    rowsNumber: props.pagination.rowsNumber,
  }),
  (newValues) => {
    originData.value = newValues.tableBody;
    filteredData.value = newValues.tableBody;
    originDataTotal.value = newValues.totalData;
    customMessageTableResults2.value = newValues.customMessageTableResults;
    totalPages2.value = newValues.totalPages;
    rowsNumber.value = newValues.rowsNumber;
  },
  { deep: true }
);
watch(search, () => {
  generalFilter();
});
</script>

<style>
.tipo-usuario {
  font-family: Arial, sans-serif;
}
</style>
