<template>
  <div>
    <q-table
      flat
      :rows="TABLE_BODY"
      :columns="TABLE_HEADER"
      :row-key="keyId"
      table-header-class="text-black text-h6"
      :selection="select"
      class="q-mr-md full-width"
      hide-pagination
      v-model:pagination="pagination"
      v-model:selected="selection"
    >
    <template v-slot:top-right>
        <div class="tw-flex tw-items-center tw-gap-x-3">
          <q-input outlined dense rounded v-model="search" label="Buscador" class="tw-w-[300px]"
            @update:model-value="handleSearch">
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
              !props.row?.tiempoXVencer ||
              props.row?.tiempoXVencer !== 'Vencido'
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
          <div class="tw-flex tw-flex-row tw-w-32">
            <q-btn
              flat
              class="tw-w-24 tw-h-9"
              @click="editData(props.row.id)"
            >
              <span class="tw-px-2">{{
                getLabelEstados(
                  props.row.estado,
                  props.row.clonado,
                  props.row.isConsolidador,
                  props.row.isEscalamiento
                )
              }}</span>
            </q-btn>
            <q-btn
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
            @click="editData(props.row.id)"
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
            @click="getTrazabilidad(props.row.id)"
            icon="history"
          />
        </q-td>
      </template>
    </q-table>
    <div class="row justify-between q-mt-md" v-if="TABLE_BODY?.length > 0">
      <div class="tw-flex tw-gap-x-3 tw-items-center">
        <span>Filas</span>
        <q-select
          :options="[5, 20, 25, 50, 100]"
          v-model:model-value="rowsPerPage"
          dense
          outlined
          @update:model-value="handleFilas"
        />
      </div>
      <q-pagination
        v-model="numPage"
        color="primary"
        :max="totalPages"
        size="md"
        direction-links
        boundary-links
        boundary-numbers
        @update:model-value="handlePage"
      />
      <q-btn icon="refresh" type="button" flat class="invisible" />
    </div>
  </div>
  <q-dialog persistent full-width v-model="trazaModal">
    <q-card class="q-pa-xl tw-w-[3000px]">
      <a
        @click="trazaModal = false"
        class="tw-text-primary tw-cursor-pointer"
        style="text-decoration: none"
      >
        <q-icon size="1.5em" name="chevron_left" color="primary" />
        <b> Cerrar </b>
      </a>
      <p class="tw-font-bold">Trazabilidad</p>
      <q-table
        flat
        :rows="trazabilidadData"
        :columns="trazabilidadColumns"
        :row-key="keyId"
        table-header-class="text-black text-h6"
        class="q-mr-md full-width tw-h-full"
        hide-pagination
        v-model:pagination="paginationTut"
      >
      </q-table>
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
import { computed, onMounted, ref, watch } from "vue";
import AdjuntarDocumentosTable from "src/pages/EntesDeControl/Bandeja/Detalles/AdjuntarDocumentos/AdjuntarDocumentosTable.vue";
//@ts-ignore
import NoData from "assets/filterImage.svg";
import moment from "moment";
import { sgdeaAxios } from "src/services";
import { DocumentoRadicado } from "src/interfaces";
import { toast } from "src/helpers/toast";
import { ESTADOS } from "src/assets/estados/estados";

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
  }>(),
  {
    select: "none",
    keyId: "codigo",
    secondIcon: "eye",
  }
);
const rows = computed(() => props.TABLE_BODY);
const { getUserInfo } = useAuthStore();
const numPage = ref(1);
const search = ref("");
const pagination = ref({
  sortBy: "fecha",
  descending: true,
  page: 1,
  rowsPerPage: 20,
});
const paginationTut = ref({
  sortBy: "fecha",
  descending: true,
  page: 1,
  rowsPerPage: 20,
});
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
    name: "fecha",
    label: "Fecha",
    align: "center",
    field: (row) => row.fecha,
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    sortable: true,
    align: "center",
  },
]);
const trazabilidadData = ref();
const rowsPerPage = ref(20);
const selection = ref([]);
const showingFullText = ref(false);
const trazaModal = ref(false);
const showDocs = ref(false);
const listDocs = ref([]);

const trazabilidadColumns = ref([
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
  {},
]);

async function getTrazabilidad(id) {
  const { data } = await sgdeaAxios.get(`/correspondencia/radicacion/${id}`);
  const response = await sgdeaAxios.get(
    "/trazabilidad/obtenerPorCodProceso/" + "COR" + data.id
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
  "search-change" 
]);

const handleSearch = (term: string) => {
  search.value = term;
  emit('search-change', term);
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

const editData = (id: number) => {
  emit("handleEditData", id);
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

const handleFilas = () => {
  emit("update:filas", rowsPerPage.value);
};

const handlePage = () => {
  emit("update:pages", rowsPerPage.value, numPage.value - 1);
};
const editDataDoc = (id: number, type: string, nodeId: string) => {
  if (type === "docRelacionado") {
    getDocs(id, nodeId);
  }
};
const getDocs = async (id: number, nodeId: string) => {
  const url = `/radicados/obtenerHijosPorNodo/${nodeId}`;
  try {
    const response = await sgdeaAxios.get(url);
    if (Array.isArray(response.data.list.entries)) {
      listDocs.value = response.data.list.entries
        .map((doc) => {
           return{
            tipo: "De entrada",
            nombre: doc.entry.name,
            id: doc.entry.id,
            nodeId: doc.entry.id,
            fecha: moment(doc.entry.createdAt).format("DD/MM/YYYY HH:mm"),
            cargado_por: doc.entry.createdByUser.displayName,
          }
        })
       .filter((doc) => doc !== null);
       const listDocsENT = listDocs.value.filter((docs) =>
         docs.nombre.startsWith("ENT")
       );
       listDocsENT.sort((a, b) => {
         if (a.nombre.includes(nodeId)) return -1;
         if (b.nombre.includes(nodeId)) return 1;
       return a.nombre.localeCompare(b.nombre);
       });

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

</script>