<template>
  <div class="my-custom-table">
    <q-table flat :rows="filteredData" :columns="TABLE_HEADER" :row-key="'numero_radicado'"
      :class="{ '!tw-h-[400px]': props.loading }" rows-per-page-label="Páginas" hide-pagination
      v-model:pagination="props.pagination" v-model:selected="selection" @update:selected="filterSelect" :selection="props?.rol?.toLowerCase().includes('asignador') ? isSelection : 'none'
        " table-header-class="text-center sortable"
      no-data-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
      no-results-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente">
      <template v-slot:top-right>
        <div class="tw-flex tw-items-center tw-gap-x-3">
          <q-input outlined dense rounded v-model="search" label="Buscador" class="tw-w-[300px]"
            @update:model-value="generalFilter">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn v-if="
            props?.rol?.toLowerCase().includes('asignador') &&
            selection.length > 1
          " label="Asignación Masiva" color="primary" class="tw-mr-10 !tw-px-3"
            @click="emit('massAssignment', selection)" />
        </div>
      </template>

      <template v-slot:body-selection="scope">
        <q-td v-if="scope?.row?.estado?.toLowerCase()?.includes('por') || false">
          <q-checkbox v-model="scope.selected" />
        </q-td>
      </template>

      <template v-slot:body-cell-trazabilidad="scope">
        <q-td>
          <q-btn flat color="primary" @click="getTrazabilidad(scope.row.ente_control_id)" icon="history" />
        </q-td>
      </template>

      <template v-slot:body-cell-estado="scope">
        <q-td class="text-center">
          <div class="tw-flex">
            <div v-if="
              ['vencido', '0 días', '0 horas'].includes(
                scope.row?.tiempo_por_vencer
              )
            " class=" tw-w-3 tw-h-8 tw-bg-red-500 tw-absolute  tw-left-[16px] tw-rounded-l-lg"></div>
            <div :class="[
              'tw-inline-block tw-p-1.5 tw-px-4 tw-rounded-lg tw-border tw-w-40',
              ['vencido', '0 días', '0 horas'].includes(
                scope.row?.tiempo_por_vencer
              ) && '!tw-border-red-700',
              ESTADOS[scope.row.estado],
            ]">
              {{ scope.row?.estado || "-" }}
            </div>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-acciones="scope">
        <q-td>
          <div class="tw-flex tw-items-center tw-justify-end">
            <q-btn class="tw-w-24 tw-h-9" flat @click="accion(scope.row.ente_control_id)">
              <q-icon v-if="action.toLowerCase().includes('gestionar') &&
                (['por aprobar', 'por revisar', 'aprobado', 'aprobación rechazada'].includes(scope.row.estado.toLowerCase()) ||
                  (scope.row.estado.toLowerCase() === 'anulado' &&
                    scope.row.fecha_anulacion &&
                    scope.row.fecha_anulacion !== '-' &&
                    moment(scope.row.fecha_anulacion, 'DD/MM/YYYY HH:mm').isValid())) &&
                scope.row.anulacion_reinicio !== true" color="primary" name="visibility" />
              <span v-else-if="
                isConsolidador(
                  scope.row.consolidador_id,
                  scope.row.es_clonado,
                  scope.row.estado
                )
              ">Consolidar</span>
              <span v-else>{{ action }}</span>
            </q-btn>
            <q-btn class="tw-w-auto tw-h-8 tw-ml-2" flat icon="file_open" color="secondary" @click="
              editData(
                scope.row.ente_control_id,
                'docRelacionado',
                scope.row.numero_radicado
              )
              " />
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell="props">
        <q-td :props="props">
          <div class="tw-break-words tw-whitespace-normal tw-w-44">
            {{ props.value }}
          </div>
        </q-td>
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
    <BasePagination :rows-per-page="props.pagination.rowsPerPage" :page="props.pagination.page"
      :total-pages="totalPages" :pagination-message="paginationMessage" :rows-options="[5, 20, 25, 50, 100]"
      :max-pages="15" @update:rowsPerPage="handleRowsPerPageChange" @update:page="handlePageChange" />

    <q-card-section v-show="props.loading"
      class="tw-absolute tw-top-0 tw-left-0 tw-w-[100%] tw-h-[100%] tw-bg-white tw-flex tw-justify-center tw-items-center">
      <div class="text-center">
        <q-circular-progress indeterminate class="tw-font-bold w-full" size="80px" color="primary" />
        <section class="tw-mt-10">
          <div class="tw-text-2xl tw-font-bold">Consultando información</div>
          <div class="text-subtitle1 tw-mt-2">Espere un momento por favor</div>
        </section>
      </div>
    </q-card-section>
  </div>

  <q-dialog full-width v-model="trazaModal">
    <q-card class="q-pa-xl tw-w-[3000px]">
      <a @click="trazaModal = false" class="tw-text-primary" style="text-decoration: none">
        <q-icon size="1.5em" name="chevron_left" color="primary" />
        <b> Volver </b>
      </a>
      <TrazabilidadTable :TABLE_BODY="trazabilidadData" :TABLE_HEADER="trazabilidadColumns" />
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
</template>

<script setup lang="ts">
import AdjuntarDocumentosTable from "./Detalles/AdjuntarDocumentos/AdjuntarDocumentosTable.vue";
import {
  trazabilidadColumns,
  fileColumnsDocs,
} from "src/pages/EntesDeControl/Bandeja/data";
import TrazabilidadTable from "./Detalles/Trazabilidad/TrazabilidadTable.vue";
import { useAuthStore } from "src/stores/auth.store";
import { ESTADOS } from "src/assets/estados/estados";
import { DocumentoRadicado } from "src/interfaces";
import { ref, watch, onMounted } from "vue";
import { toast } from "src/helpers/toast";
import { sgdeaAxios } from "src/services";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import moment from "moment";
import BasePagination from "src/components/Tables/BasePagination.vue";

const authStore = useAuthStore();
const $q = useQuasar();

const router = useRouter();

const emit = defineEmits([
  "update:itemSelected",
  "massAssignment",
  "update:filas",
  "update:pages",
  "handleRowsPerPageChange",
  "handlePageChange",
]);

const props = withDefaults(
  defineProps<{
    TABLE_BODY: any[];
    TABLE_HEADER: any[];
    isSelection?: "none" | "single" | "multiple";
    itemSelected?: any[];
    keyId?: string;
    rol?: string;
    pagination: any;
    loading?: boolean;
    totalPages?: number;
    paginationMessage?: string;
  }>(),
  {
    isSelection: "multiple",
    keyId: "id",
  }
);

const trazaModal = ref(false);
const showDocs = ref(false);
const trazabilidadData = ref([]);
const filteredData = ref([]);
const originData = ref([]);
const selection = ref([]);
const listDocs = ref([]);
const action = ref("");
const search = ref("");

const validateRol = () => {
  if (!props?.rol) {
    return;
  }
  if (props?.rol?.toLocaleLowerCase().includes("asignador")) {
    action.value = "Asignar";
  }
  if (props?.rol?.toLocaleLowerCase()?.includes("gestionador")) {
    action.value = "Gestionar";
  }
  if (props?.rol?.toLocaleLowerCase()?.includes("revisor")) {
    action.value = "Revisar";
  }
  if (props?.rol?.toLocaleLowerCase()?.includes("aprobador")) {
    action.value = "Aprobar";
  }
};

const isConsolidador = (consolidador_id, es_clonado, estado) => {
  return (
    props?.rol.toLowerCase().includes("gestionador") &&
    ["Clonación en edición", "Gestión clonada"].includes(estado) &&
    consolidador_id === authStore.userInfo.userid &&
    es_clonado
  );
};

const tomarRadicadoParaReclamar = (ente_id: number) => {
  router.push(`/entes-de-control/bandeja/detalle/${ente_id}`);
  // const query = `?userId=${authStore.userInfo.userid}`;
  // const url = `/api/entes/reclamar-radicado-asignador/${ente_id}${query}`;
  // return sgdeaAxios
  //   .patch(url, null)
  //   .then((response) => {
  //     toast.success("Caso reclamado con éxito");
  //     router.push(`/entes-de-control/bandeja/detalle/${ente_id}`);
  //   })
  //   .catch((error) => {
  //     if (error.response.status === 304) {
  //       return router.push(`/entes-de-control/bandeja/detalle/${ente_id}`);
  //     }
  //     toast.error("El caso ya ha sido reclamado");
  //   });
};

const accion = (id: number) => {

  switch (props.rol) {
    case "Gestionador":
      router.push(`/entes-de-control/bandeja/detalle/${id}`);
      break;
    case "Revisor":
      router.push(`/entes-de-control/bandeja/detalle/${id}`);
      break;
    case "Aprobador":
      router.push(`/entes-de-control/bandeja/detalle/${id}`);
      break;
    // case 'Asignador':
    case "Asignador Responsable":
      tomarRadicadoParaReclamar(id);
      break;
  }
};
const editData = (id: number, type: string, numeroRadicado: string) => {
  if (type === "docRelacionado") getDocs(id, numeroRadicado);
};

const getDocs = (id, numeroRadicado: string) => {
  const url = `/api/entes/getDocumentosByEnteControlId/${id}`;
  sgdeaAxios.get(url).then((response) => {
    listDocs.value = response.data.map((doc) => {
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
        cargado_por: doc.usuario.userName,
      };
    });

    // Filtrar los objetos que inicien por "ENT"
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

const getTrazabilidad = (id) => {
  const url = "/trazabilidad/obtenerPorCodProceso/ENTC" + id;
  sgdeaAxios.get(url).then((response) => {
    if (!response?.data || response.data.length === 0) {
      trazabilidadData.value = [];
      trazaModal.value = true;
      return;
    }
    trazabilidadData.value = response.data
      .sort((a, b) => a.id - b.id)
      .map((item, index) => ({
        ...item,
        fechaHora: moment(item.fechaHora).format("DD/MM/YYYY HH:mm A"),
      }));
    trazaModal.value = true;
  });
};

const generalFilter = () => {
  filteredData.value = originData.value.filter((data) => {
    const fieldValues = Object.values(data).map(String);
    return fieldValues.some((value) =>
      value?.toLowerCase().includes(search.value?.toLowerCase())
    );
  });
};

const filterSelect = () => {
  selection.value = selection.value.filter((select) =>
    select.estado.toLowerCase().includes('por')
  )
}

watch(selection, (newdateData) => {
  emit("update:itemSelected", newdateData);
});

watch(
  () => props.TABLE_BODY,
  (newValue, oldValue) => {
    originData.value = newValue;
    filteredData.value = newValue;
  }
);

watch(
  () => props.rol,
  (newValue, oldValue) => {
    validateRol();
  }
);

const clearSelects = () => {
  selection.value = [];
};

defineExpose({ clearSelects });

onMounted(() => {
  $q.iconSet.table.arrowUp = "import_export";
  originData.value = props.TABLE_BODY;
  filteredData.value = props.TABLE_BODY;
  validateRol();
});


const handleRowsPerPageChange = (event: number) => {
  const lastPage = Math.ceil(Number(props.pagination.total) / Number(props.pagination.rowsPerPage));
  emit("handleRowsPerPageChange", event);
};

const handlePageChange = (event: number) => {
  emit("handlePageChange", event);
};
</script>

<style scoped lang="scss">
.my-custom-table {
  &::v-deep {
    .q-table__sort-icon {
      opacity: 1;
    }

    th {
      text-align: center;
    }
  }
}
</style>
