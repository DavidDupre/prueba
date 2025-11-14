<template>
  <q-table
    flat
    :rows="filteredData"
    :columns="TABLE_HEADER"
    :row-key="keyId"
    table-header-class="text-black text-h6"
    :selection="select"
    class="q-mr-md full-width"
    hide-pagination
    v-model:pagination="pagination"
    v-model:selected="selection"
    :loading="isLoading"
    no-data-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
    no-results-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
  >
    <template v-slot:top-right>
      <div class="tw-flex tw-items-center tw-gap-x-3">
        <!-- <q-input
          outlined
          dense
          rounded
          v-model="search"
          label="Buscador"
          class="tw-w-[300px]"
          @update:model-value="generalFilter"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input> -->
          <q-input
    outlined
    dense
    rounded
    v-model="search"
    label="Buscador"
    class="tw-w-[300px]"
    @update:model-value="handleSearch"
  >
    <template v-slot:prepend>
      <q-icon name="search" />
    </template>
  </q-input>
      </div>
    </template>

    <template v-slot:body-cell-estados="props">
      <q-td class="tw-w-[125px]">
        <p
          :class="[
            'tw-border tw-h-[20px] tw-rounded-xl col-8',
            props.row.estados
              ? ' tw-border-green-700 tw-bg-green-100'
              : ' tw-border-gray-400 tw-bg-gray-200 tw-text-secondary',
          ]"
        >
          {{ props.row.estados ? "Activo" : "-" }}
        </p>
      </q-td>
    </template>

    <template v-slot:body-cell-estado="props">
      <q-td class="text-center">
        <div
          :class="[
            'tw-inline-block tw-p-1.5 tw-px-4 tw-rounded-lg tw-border tw-w-40',
            !props.row?.tiempoXVencer || props.row?.tiempoXVencer !== 'Vencido'
              ? ESTADOS[props.row.estado]
              : 'tw-bg-red-100 tw-border-red-400 tw-text-red-500',
          ]"
        >
          {{ props.row?.estado || "-" }}
        </div>
      </q-td>
    </template>

    <template v-slot:body-cell-acciones="props">
      <q-td class="text-center">
        <div class="tw-flex tw-row">
          <!-- <q-btn class="tw-w-24 tw-h-9" flat @click="editData(props.row.id)">
              <span class="tw-px-2">{{
                getLabelEstados(
                  props.row.estado,
                  props.row.clonado,
                  props.row.isConsolidador,
                  props.row.isEscalamiento
                )
              }}</span>
            </q-btn> -->
          <q-btn class="tw-w-24 tw-h-9" flat @click="editData(props.row.id, props.row.estado, props.row.idTramite)">
            <q-icon
              color="primary"
              name="visibility"
              @click="but(props.row)"
            />
<!--          >>> {{ props.row.idTramite}}-->

          </q-btn>
          <q-btn
            class="tw-w-auto tw-h-8 tw-ml-2"
            flat
            icon="file_open"
            color="secondary"
            @click="
              editDataDoc(props.row.idTramite, 'docRelacionado', props.row.id)
            "
          />
        </div>
      </q-td>
    </template>

    <template v-slot:body-cell-actions="props">
      <q-td class="text-center">
        <q-btn
          size="sm"
          color="primary"
          :icon="icon || 'visibility'"
          flat
          @click="editData(props.row.idTramite, props.row.estado)"
        />
        <q-btn
          size="sm"
          color="secondary"
          :icon="secondIcon"
          flat
          v-if="isSecondIcon"
          @click="handleSecondIcon(props.row[rowId])"
        />
      </q-td>
    </template>

    <template v-slot:body-cell-procedimiento="props">
      <div class="tw-border-b-[1px] tw-w-96 tw-px-2">
        <p class="tw-text-center tw-border-0">
          {{ collapseContent(props.row.procedimiento) }}
        </p>
        <div
          class="tw-flex tw-justify-end"
          v-if="props.row.procedimiento?.length >= 200"
        >
          <q-btn
            flat
            color="secondary"
            @click="showingFullText = !showingFullText"
          >
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

    <template v-slot:body-cell-trazabilidad="props">
      <q-td>
        <q-btn
          flat
          color="primary"
          @click="getTrazabilidad(props.row.idTramite)"
          icon="history"
        />
      </q-td>
    </template>

    <template v-slot:bottom>
      <div class="row tw-justify-between q-mt-md tw-w-[100%]">
        <div class="tw-flex tw-gap-x-3 tw-items-center">
          <span>Filas</span>
          <q-select
            style="width: 120px; height: 40px"
            outlined
            dense
            mapOptions
            emitValue
            :options="[5, 20, 25, 50, 100]"
            v-model:model-value="rowsPerPage"
            @update:model-value="handleFilas"
          />
        </div>
        <q-pagination
          v-model="numPage"
          color="primary"
          :max="totalPages"
          size="md"
          ellipses
          max-pages="10"
          direction-links
          boundary-links
          boundary-numbers
          @update:model-value="handlePage"
        />
        <div class="invisible"></div>
      </div>
    </template>

    <template v-slot:no-data="{ message }">
      <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
        <img v-lazy :data-url="require('src/assets/filterImage.svg')" alt="" width="120" />
        <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
          {{ message }}
        </span>
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
        <b> Cerrar </b>
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
</template>

<script setup lang="ts">
import { useAuthStore } from "stores/auth.store";
import { onMounted, ref, watch } from "vue";
import AdjuntarDocumentosTable from "src/pages/EntesDeControl/Bandeja/Detalles/AdjuntarDocumentos/AdjuntarDocumentosTable.vue";
import { ESTADOS } from "src/assets/estados/estados";
import Trazabilidad from "src/pages/Expedientes/Trazabilidad/Trazabilidad.vue";
import moment from "moment";
import { sgdeaAxios } from "src/services";
import { DocumentoRadicado } from "src/interfaces";
import { toast } from "src/helpers/toast";

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
    isLoading?: boolean;
    // buscar: string,
    // action: string,
    // target?: string,
  }>(),
  {
    select: "none",
    keyId: "codigo",
    secondIcon: "eye",
    isLoading: false,
    // target: ""
  }
);
const { getUserInfo } = useAuthStore();

const search = ref("");
const filteredData = ref([]);
const originData = ref([]);

const numPage = ref(1);
const pagination = ref({
  sortBy: "fechaRadicacion",
  descending: false,
  page: 1,
  rowsPerPage: 20,
});

const trazabilidadData = ref();
const rowsPerPage = ref(20);
const selection = ref([]);
const showingFullText = ref(false);
const trazaModal = ref(false);
const listDocs = ref([]);
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

// const generalFilter = () => {
//   filteredData.value = originData.value.filter((data) => {
//     const fieldValues = Object.values(data).map(String);
//     return fieldValues.some((value) =>
//       value?.toLowerCase().includes(search.value?.toLowerCase())
//     );
//   });
// };

async function getTrazabilidad(id) {
  const response = await sgdeaAxios.get(
    "/trazabilidad/obtenerPorCodProceso/" + "COMIND" + id
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

const isRolGestionador = ref(false);

const emit = defineEmits([
  "update:itemSelected",
  "handleEditData",
  "handleSecondIcon",
  "update:filas",
  "update:pages",
  "update:search"
]);

const handleSearch = (value: string) => {
  emit("update:search", value);
};

// const getLabelEstados = (row, clonado, isConsolidador, isEscalamiento) => {
//   const rowLabel = row.toLowerCase();

//   if (rowLabel === "para gestión" && isEscalamiento)
//     return "Gestionar escalado";
//   if (rowLabel === "por asignar" || rowLabel === "radicado") return "Asignar";
//   if (rowLabel === "por aprobar" || rowLabel === "gestionado") return "Aprobar";
//   if (rowLabel === "para gestión" && clonado && isConsolidador)
//     return "Por consolidar";
//   if (rowLabel === "por revisar") return "Revisar";
//   if (rowLabel === "para gestión" && clonado) return "Gestionar clonado";
//   if (rowLabel === "aprobada") return "Entregar";
//   if (rowLabel === "escalado") return "Gestionar escalado";
//   if (rowLabel === "creada") return "Creada";
//   return "Gestionar";
// };

const but = (row) => {

};

const editData = (id: number, estado: string, idTramite:int) => {
  emit("handleEditData", { id, estado, idTramite });
};


const handleSecondIcon = (id: number) => {
  emit("handleSecondIcon", id);
};

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

const handleFilas = (event: any) => {
  pagination.value.rowsPerPage = event;

  if (pagination.value.page > 0) {
    pagination.value.page = pagination.value.page - 1;
  }

  emit("update:filas", pagination.value);
};

const handlePage = (event) => {
  emit("update:pages", {
    page: event,
    rowsPerPage: pagination.value.rowsPerPage,
  });
};
const editDataDoc = (id: number, type: string, numeroRadicado: string) => {
  if (type === "docRelacionado") {
    getDocs(id, numeroRadicado);
  }
};
const getDocs = async (id: number, numeroRadicado: string) => {
  const url = `/correspondencia/radicacion/documentos/TODOS/${id}`;
  try {
    const response = await sgdeaAxios.get(url);
    if (Array.isArray(response.data)) {
      listDocs.value = response.data
        .map((doc) => {
          if (doc.tipoDocumento.toLowerCase().includes("entrada")) {
            doc.tipoDocumento = "De entrada";
          } else if (doc.tipoDocumento.toLowerCase().includes("salida")) {
            doc.tipoDocumento = "De salida";
          }

          return {
            tipo: doc.tipoDocumento,
            nombre: doc.nombre,
            id: doc.id,
            nodeId: doc.nodeId,
            fecha: moment(doc.fechaCargue).format("DD/MM/YYYY HH:mm"),
            cargado_por: doc.usuario.userName,
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

watch(
  () => props.TABLE_BODY,
  (newValue, oldValue) => {
    originData.value = newValue;
    filteredData.value = newValue;
  }
);
</script>
