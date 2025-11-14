<template>
  <div>
    <q-table v-model:pagination="pagination" v-model:selected="selection" :columns="TABLE_HEADER" :loading="isLoading"
      :row-key="keyId" :rows="filteredData" :selection="isSelection" class="q-mr-md full-width tw-bg-transparent table"
      color="primary" flat hide-pagination
      no-data-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
      no-results-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
      rows-per-page-label="Páginas" table-header-class="text-black text-h6">

      <template v-slot:top-right>
        <div class="tw-flex tw-items-center tw-gap-x-3">
          <q-input v-model="search" class="tw-w-[300px]" dense label="Buscador" outlined rounded
            @update:model-value="emitSearch" @blur="emitSearch">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </template>

      <template #body="props">
        <q-tr v-if="isDevolucion" :class="`${isDevuelta(props.row) || isRevisar(props.row)}`" :props="props"
          @dblclick="rowdblclick(props.row)">
          <q-td key="selected">
            <q-checkbox v-model="props.selected" />
          </q-td>
          <q-td key="canal_radication">
            {{ props.row.canal_radication }}
          </q-td>
          <q-td key="radicadoSalida">
            {{ props.row.radicadoSalida }}
          </q-td>
          <q-td key="destinatario">
            {{ props.row.destinatario }}
          </q-td>
          <q-td key="fechaEnvioOperador">
            {{ props.row.fechaEnvioOperador || '-' }}
          </q-td>
          <q-td key="tipoEnvio">
            {{ props.row.tipoEnvio }}
          </q-td>
          <q-td key="estado">
            <p :class="[
              'tw-inline-block tw-p-1.5 tw-px-4 tw-rounded-lg tw-border tw-w-40',
              ESTADOS[props.row.estado]]" :style="props.row.reclasificacionRechazada ? 'margin-left:20px' : ''">
              {{ props.row.estado }}
            </p>
          </q-td>
          <q-td key="correoDestinatario">
            {{ props.row.correoDestinatario }}
          </q-td>
          <!-- <q-td key="fecha_radicacion">
            {{ props.row.fecha_radicacion }}
          </q-td> -->
          <!-- <q-td key="motivoDevolucion">
            {{ props.row.motivoDevolucion }}
          </q-td> -->
          <q-td key="tiempo">
            {{ '1 Día' }}
          </q-td>
          <q-td key="diasPorVencer">
            {{ props.row.diasPorVencer }}
          </q-td>
          <q-td key="fechaDeVencimiento">
            {{ props.row.fechaDeVencimiento }}
          </q-td>
          <q-td key="afectado">
            {{ props.row.nombre_afectado }}
          </q-td>
          <!-- <q-td key="remitente">
            {{ props.row.remitente }}
          </q-td> -->
          <!-- <q-td key="ubicacion">
            {{ props.row.city }} -
            {{ props.row.department || "-" }}
          </q-td> -->
          <q-td key="trazabilidad">
            <q-btn color="primary" flat icon="history" @click="getTrazabilidad(props.row.id)" />
          </q-td>
          <q-td key="acciones">
            <div class="tw-flex tw-row">
              <q-btn class="tw-w-32 tw-h-9 flex" flat @click="editData(props.row)">
                <span class="tw-px-2">{{
                  getLabelEstados(
                    props.row.estado,
                    props.row.clonado,
                    props.row.isConsolidador,
                    props.row.isEscalamiento,
                    props.row.fecha_radicacion
                  )
                }}</span>
              </q-btn>
              <q-btn class="tw-w-auto tw-h-8 tw-ml-2" color="secondary" flat icon="file_open" @click="
                editDataDoc(
                  props.row.id,
                  'docRelacionado',
                  props.row.idRadicado
                )
                " />
            </div>
          </q-td>
        </q-tr>
        <q-tr v-if="isPublicador" :class="`${isDevuelta(props.row) || isRevisar(props.row)}`" :props="props"
          @dblclick="rowdblclick(props.row)">
          <q-td key="selected">
            <q-checkbox v-model="props.selected" />
          </q-td>
          <q-td key="idRadicado">
            {{ props.row.idRadicado }}
          </q-td>
          <q-td key="idRadicado">
            {{ props.row.idRadicado }}
          </q-td>
          <q-td key="tipoTramite">
            {{ props.row.tipoTramite }}
          </q-td>
          <!-- <q-td key="destinatario">
            {{ props.row.destinatario }}
          </q-td> -->
          <!-- <q-td key="destinatario">
            {{ props.row.destinatario }}
          </q-td> -->
          <q-td key="destinatario">
            {{ props.row.destinatario }}
          </q-td>

          <q-td key="fechaEnvio">
            {{ props.row.fechaEnvio }}
          </q-td>
          <q-td key="canalEnvio">
            {{ props.row.canalEnvio }}
          </q-td>
          <q-td key="estado">
            <p :class="[
              'tw-inline-block tw-p-1.5 tw-px-4 tw-rounded-lg tw-border tw-w-40',
              ESTADOS[props.row.estado]]" :style="props.row.reclasificacionRechazada ? 'margin-left:20px' : ''">
              {{ props.row.estado }}
            </p>
          </q-td>
          <q-td key="tiempoAsignado">
            {{ props.row.tiempoAsignado }}
          </q-td>
          <!-- <q-td key="destinatario">
            {{ props.row.destinatario }}
          </q-td> -->
          <!-- <q-td key="fechaEnvio">
            {{ props.row.fechaEnvio }}
          </q-td> -->
          <!-- <q-td key="canalEnvio">
            {{ props.row.canalEnvio }}
          </q-td> -->
          <q-td key="diasPorVencer">
            {{ props.row.diasPorVencer }}
          </q-td>
          <q-td key="fechaDeVencimiento">
            {{ props.row.fechaDeVencimiento }}
          </q-td>
          <q-td key="nombre_afectado">
            {{ props.row.nombre_afectado }}
          </q-td>
          <q-td key="documento">
            {{ props.row.documento }}
          </q-td>

          <!-- <q-td key="fechaDeVencimiento">
            {{ props.row.fechaDeVencimiento }}
          </q-td>
          <q-td key="fechaDeVencimiento">
            {{ props.row.fechaDeVencimiento }}
          </q-td>
          <q-td key="fechaDeVencimiento">
            {{ props.row.fechaDeVencimiento }}
          </q-td> -->
          <q-td key="acciones">
            <div class="tw-flex tw-row">
              <q-btn class="tw-w-32 tw-h-9 flex" flat @click="editData(props.row)">
                <span class="tw-px-2">{{
                  getLabelEstados(
                    props.row.estado,
                    props.row.clonado,
                    props.row.isConsolidador,
                    props.row.isEscalamiento,
                    props.row.fecha_radicacion
                  )
                }}</span>
              </q-btn>
              <q-btn class="tw-w-auto tw-h-8 tw-ml-2" color="secondary" flat icon="file_open" @click="
                editDataDoc(
                  props.row.id,
                  'docRelacionado',
                  props.row.idRadicado
                )
                " />
            </div>
          </q-td>
          <q-td key="trazabilidad">
            <q-btn color="primary" flat icon="history" @click="getTrazabilidad(props.row.id)" />
          </q-td>
        </q-tr>
        <q-tr v-else :class="`${isDevuelta(props.row) || isRevisar(props.row)}`" :props="props"
          @dblclick="rowdblclick(props.row)">
          <q-td key="selected">
            <q-checkbox v-model="props.selected" />
          </q-td>
          <q-td key="canal_radication">
            {{ props.row.canal_radication }}
          </q-td>
          <q-td key="codigo">
            {{ props.row.numero }}
          </q-td>
          <q-td key="fecha_radicacion">
            {{ props.row.fecha_radicacion }}
          </q-td>
          <q-td key="tiempo">
            {{ props.row.tiempo }}
          </q-td>
          <q-td key="diasPorVencer">
            {{ props.row.diasPorVencer }}
          </q-td>
          <q-td key="fechaDeVencimiento">
            {{ props.row.fechaDeVencimiento }}
          </q-td>
          <q-td key="nombre_afectado">
            <div class="tw-break-words tw-whitespace-normal tw-text-center">
              {{ props.row.nombre_afectado }} <br />
              {{ props.row.identificacionAfectado || "-" }}
            </div>
          </q-td>
          <q-td key="remitente">
            <div class="tw-break-words tw-whitespace-normal tw-text-center">
              {{ props.row.remitente }} <br />
              {{ props.row.identificacionRemitente || "-" }}
            </div>
          </q-td>
          <q-td key="city">
            {{ props.row.city }} / {{ props.row.department }}
          </q-td>
          <q-td key="tramite_type">
            {{ props.row.tramite_type }}
          </q-td>
          <q-td key="trazabilidad">
            <q-btn color="primary" flat icon="history" @click="getTrazabilidad(props.row.id)" />
          </q-td>
          <q-td v-if="!tieneRolRestringido" key="tiempoRevisor">
            {{ props.row.tiempoRevisor }}
          </q-td>
          <!-- <q-td key="fechaAprobador">
            {{
              props.row.fechaAprobador !== "N/A"
                ? props.row.fechaAprobador
                : props.row.fechaAprobador
            }}
          </q-td> -->
          <q-td key="estado">
            <p :class="[
              'tw-inline-block tw-p-1.5 tw-px-4 tw-rounded-lg tw-border tw-w-40',
              ESTADOS[props.row.estado]]" :style="props.row.reclasificacionRechazada ? 'margin-left:20px' : ''">
              {{ props.row.estado }}
            </p>
            <q-icon v-if="props.row.reclasificacionRechazada" class="text-red tw-ml-1" name="fiber_manual_record"
              size="xs">
              <q-tooltip :offset="[10, 0.1]" anchor="top middle" self="bottom middle">
                <p><strong>Reclasificación Rechazada</strong></p>
              </q-tooltip>
            </q-icon>
          </q-td>
          <q-td key="acciones">
            <div class="tw-flex tw-row">
              <q-btn class="tw-w-32 tw-h-9 flex" flat @click="editData(props.row)">
                <q-icon v-if="
                  (props.row.estado.toLowerCase() === 'aprobado' && auth.userInfo.role === 'Gestionador') ||
                  (props.row.estado.toLowerCase() === 'aprobado' && auth.userInfo.role === 'Gestionador Escalador') ||
                  props.row.estado.toLowerCase() === 'anulado' &&
                  props.row.fechaAnulacion !== null &&
                  props.row.anulacionConReinicio === false" color="primary" name="visibility"
                  @click="but(props.row)" />

                <span v-else class="tw-px-2">{{
                  getLabelEstados(
                    props.row.estado,
                    props.row.clonado,
                    props.row.isConsolidador,
                    props.row.isEscalamiento,
                    props.row.fecha_radicacion
                  )
                }}</span>


              </q-btn>

              <q-btn class="tw-w-auto tw-h-8 tw-ml-2" color="secondary" flat icon="file_open" @click="
                editDataDoc(
                  props.row.id,
                  'docRelacionado',
                  props.row.idRadicado
                )
                " />
              <q-btn
                v-if="['gestionador', 'gestionador consolidador'].includes(auth.$state.userInfo.role.toLowerCase()) && props.row.solicitudRechazo != false"
                class="tw-w-auto tw-h-8 tw-ml-2" color="red" flat icon="flag" @click="openMenu(props.row.id)">
                <q-menu ref="menu">
                  <q-list style="min-width: 100px">
                    <q-item v-for="rechazo in listRechazos" :key="rechazo.id" v-close-popup>
                      <q-item-section>{{
                        rechazo.nombre_gestionador
                      }}{{ rechazo.apellido_gestionador }} -
                        {{ rechazo.nombre_oficina_gestionador }}
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
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
            <q-select v-model:model-value="rowsPerPage" :options="[5, 25, 50, 100]" dense outlined
              @update:model-value="handleRowsPerPageChange" />
          </div>


          <div class="col tw-flex tw-justify-center">
            <q-pagination v-model="page" :max="TABLE_TOTAL_ROWS" boundary-links boundary-numbers color="primary"
              direction-links ellipsis max-pages="15" size="md" @update:model-value="handlePageChange" />
          </div>


          <div class="col-auto tw-flex tw-items-center tw-text-right">
            {{ paginationMessage }}
            <div class="invisible"></div>
          </div>
        </div>
      </template>

    </q-table>
  </div>
  <q-dialog v-model="trazaModal" full-width>
    <q-card class="q-pa-xl tw-w-[3000px]">
      <a class="tw-text-primary" style="text-decoration: none" @click="trazaModal = false">
        <q-icon color="primary" name="chevron_left" size="1.5em" />
        <b> Volver </b>
      </a>
      <Trazabilidad :doneItems="trazabilidadData" />

    </q-card>
  </q-dialog>
  <q-dialog v-model="showDocs" full-width>
    <q-card class="q-pa-xl tw-w-[800px]">
      <div class="row tw-justify-between">
        <span class="tw-text-xl">Documentos</span>
        <q-btn flat icon="close" @click="showDocs = false" />
      </div>
      <div class="q-mt-sm">
        <AdjuntarDocumentosTable :TABLE_BODY="listDocs" :TABLE_HEADER="fileColumnsDocs" @downloadDoc="download"
          @printDoc="print" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import AdjuntarDocumentosTable
  from "src/pages/EntesDeControl/Bandeja/Detalles/AdjuntarDocumentos/AdjuntarDocumentosTable.vue";
import { ESTADOS } from "src/assets/estados/estados";
import { computed, ref, watch } from "vue";
import { sgdeaAxios } from "src/services";
import moment from "moment";
import { toast } from "src/helpers/toast";
import { DocumentoRadicado } from "src/interfaces";
import { useAuthStore } from 'src/stores/auth.store';
import Trazabilidad from "src/pages/Expedientes/Trazabilidad/Trazabilidad.vue";
import { DataPaginator } from "pages/Bandeja/BandejaEntrada";
// import {formatDateWithTimeAndMeridiem} from "src/helpers/formtDate";
const search = ref('')
const debounceTimeout = ref<any>(null)

const emitSearch = () => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }

  debounceTimeout.value = setTimeout(() => {
    emit('search-change', search.value);

  }, 3000) // 5 segundos
}
const auth = useAuthStore()

const filteredData = ref([]);
const originData = ref([]);
const disableAsignar = ref(false)

const tieneRolRestringido = computed(() =>
  auth.relations?.some(rel => [6, 10].includes(rel.idRol)) ?? false
);

const evaluateDisableAsignar = (row) => {
  if (row.estado.toLowerCase() === 'por asignar' || row.estado.toLowerCase() === 'radicado') {
    const fechaDada = moment(row.fecha_radicacion, "DD/MM/YYYY hh:mm A", true);
    const hoy = moment().set({ hour: 16, minute: 30, second: 0, millisecond: 0 });
    const diferencia = hoy.diff(fechaDada, "days");
    return disableAsignar.value = diferencia > 3;
  }
  return false;
}

const getLabelEstados = (row, clonado, isConsolidador, isEscalamiento, completeRow) => {
  const rowLabel = row.toLowerCase();

  if (rowLabel === 'para gestión' && isEscalamiento) return 'Gestionar escalado';
  if (rowLabel === 'por asignar' || rowLabel === 'radicado') return 'Asignar';
  if (rowLabel === 'por aprobar' || rowLabel === 'gestionado') return 'Aprobar';
  if (rowLabel === 'para gestión' && clonado && isConsolidador) return 'Por consolidar';
  if (rowLabel === 'por revisar') return 'Revisar';
  if (rowLabel === 'para gestión' && clonado) return 'Gestionar clonado';
  if (rowLabel === 'aprobado') return 'Para enviar';
  if (rowLabel === 'escalado' || auth.userInfo.role === 'Gestionador Escalador') return 'Gestionar escalado';

  return "Gestionar";
};

function isDevuelta(row) {
  if (row.fechaRevisor && row.estado == "En edición") {
    var now = new Date();
    var fechaRevisor = new Date(row.fechaRevisor);
    var diffInHours = Math.abs(Number(now) - Number(fechaRevisor)) / 36e5; // divide by 36e5 to convert milliseconds to hours
    if (diffInHours > 24) {
      return "orange-row";
    }
  }
  return "";
}

const generalFilter = () => {
  filteredData.value = originData.value.filter((data) => {
    const fieldValues = Object.values(data).map(String);
    return fieldValues.some((value) =>
      value?.toLowerCase().includes(search.value?.toLowerCase())
    );
  });
};

function isRevisar(row) {
  if (
    row.fechaRevisor &&
    row.fecha_radicacion &&
    row.estado === "Por revisar"
  ) {
    // Validar el resaltado si pasaron 24 horas en la fecha del revisor
    return (Number(new Date()) - Number(new Date(row.fechaRevisor))) / 36e5 > 24
      ? "orange-row"
      : "";
  }
  return "";
}

const trazabilidadData = ref();
const trazaModal = ref(false);
let pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 20,
});
const page = ref(1)
const rowsPerPage = ref(20);
const selection = ref([]);
const trazabilidadColumns = ref<any>([
  {
    name: "user",
    label: "Usuario",
    field: "nombre",
    align: "center",
    sortable: true,
  },
  {
    name: "action",
    label: "Acción",
    field: "descripcion",
    align: "center",
    sortable: true,
  },
  {
    name: "date",
    label: "Fecha",
    field: "fechaHora",
    align: "center",
    sortable: true,
  },
  {
    name: "status",
    label: "Estado",
    field: "estado",
    align: "center",
    sortable: true,
  },
  {
    name: "description",
    label: "Detalle",
    field: "descripcion",
    align: "center",
    sortable: true,
  },
]);
const listDocs = ref([]);
const listRechazos = ref([]);
const showDocs = ref(false);
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

const props = withDefaults(
  defineProps<{
    TABLE_BODY: any[];
    TABLE_HEADER: any[];
    TABLE_TOTAL_ROWS: number;
    selection: "none" | "single" | "multiple" | undefined;
    itemSelected: any[];
    icon?: string;
    keyId?: string;
    msgNoData?: string;
    rowId?: string;
    isSecondIcon?: boolean;
    secondIcon?: string;
    isToggle?: boolean;
    iconTrazabilidad?: string;
    isThridIcon?: boolean;
    thridIcon?: string;
    isSelection?: "none" | "single" | "multiple" | undefined;
    isLoading?: boolean;
    restore?: boolean;
    labelData?: boolean;
    dataPaginator?: DataPaginator | undefined;
    isDevolucion?: boolean;
    isPublicador?: boolean;
    paginationMessage?: string;
  }>(),
  {
    selection: "none",
    keyId: "numero",
    secondIcon: "eye",
    isSelection: "multiple",
    icon: "printer",
  }
);

async function getTrazabilidad(id) {
  const response = await sgdeaAxios.get(
    "/trazabilidad/obtenerPorCodProceso/" + "PQRD" + id
  );
  if (!response?.data || response.data.length === 0) {
    trazabilidadData.value = [];
    return;
  }

  trazabilidadData.value = response.data
    .sort((a, b) => a.id - b.id)
    .map((item, index) => ({
      ...item,
      fechaHora: moment(item.fechaHora).format("DD/MM/YYYY"),
    }));
  trazaModal.value = true;
}

const emit = defineEmits([
  "update:itemSelected",
  "update:inputDataProp",
  "handleEditData",
  "handleSecondIcon",
  "handleTrazabilidad",
  "handleCaso",
  "handleThridIcon",
  "handlePageChange",
  "handleRowsPerPageChange",
  "handleRowdblclick",
  "search-change"
]);

// const emitSearch = () => {
//   // Emitimos el valor actual del buscador
//   emit('search-change', search.value);
// };

const rowdblclick = (row) => {
  emit("handleEditData", { id: row.id, idAsignacion: row.idAsignacion });
};

const editData = (row) => {
  emit("handleEditData", { id: row.id, idAsignacion: row.idAsignacion });
};

const but = (row) => {

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

watch(rowsPerPage, (value) => {
  pagination.value.rowsPerPage = value;
});

watch(selection, (newdateData) => {
  selection.value = newdateData;
  emit("update:itemSelected", selection.value);
});

const editDataDoc = (id: number, type: string, numeroRadicado: string) => {
  if (type === "docRelacionado") {
    getDocs(id, numeroRadicado);
  }
};
const getDocs = async (id: number, numeroRadicado: string) => {
  const url = `/pqrd/radicacion/documentos/TODOS/${id}`;
  try {
    const response = await sgdeaAxios.get(url);
    if (Array.isArray(response.data)) {
      listDocs.value = response.data
        .map((doc) => {
          if (doc.tipo.toLowerCase().includes("entrada")) {
            doc.tipo = "De entrada";
          } else if (doc.tipo.toLowerCase().includes("salida")) {
            doc.tipo = "De salida";
          }

          return {
            tipo: doc.tipo,
            nombre: doc.nombre,
            id: doc.id,
            nodeId: doc.nodeId,
            fecha: moment(doc.fechaCargue).format("DD/MM/YYYY HH:mm"),
            cargado_por: doc.cargadorPor,
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
    }
  } catch (error) {
    console.error(error);
  }
};

const print = (id) => {
  const url = `/radicados/consultar_documento/${id}`;

  sgdeaAxios
    .get<DocumentoRadicado>(url)
    .then(({ data }: any) => {
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

watch(
  () => props.TABLE_BODY,
  (newValue, oldValue) => {
    originData.value = newValue;
    filteredData.value = newValue;
  }
);
const openMenu = async (id: number) => {
  const url = `/pqrd/listar-solicitudes-rechazo-asignacion/${id}?page=0&size=5`;
  try {
    const response = await sgdeaAxios.get(url);

    listRechazos.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

</script>

<style>
.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
}

.orange-row {
  background-color: lightsalmon !important;
}
</style>
