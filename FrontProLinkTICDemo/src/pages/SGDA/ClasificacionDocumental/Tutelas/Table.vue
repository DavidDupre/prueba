<template>
  <q-table flat :rows="filteredData" :columns="TABLE_HEADER" :row-key="keyId" table-header-class="text-black text-h6"
    :selection="select" class="q-mr-md full-width" hide-pagination v-model:pagination="props.pagination"
    v-model:selected="selection" color="primary"
    no-data-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
    no-results-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente" @request="onRequest">
    <template v-slot:top-right>
      <div class="tw-flex tw-items-center tw-gap-x-3">
        <!-- <q-input outlined dense rounded v-model="search" label="Buscador" class="tw-w-[300px]"
          @update:model-value="generalFilter">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input> -->
        <q-input outlined dense rounded v-model="search" label="Buscar por Radicado" class="tw-w-[300px]"
  debounce="500"
  @update:model-value="value => emit('search-change', value)">
  <template v-slot:prepend>
    <q-icon name="search" />
  </template>
</q-input>
      </div>
    </template>

    <template #body="props">
      <q-tr :props="props" :class="props.row.visto ? 'bg-orange-1' : ''">
        <q-td key="selected">
          <q-checkbox v-model="props.selected" />
        </q-td>
        <q-td key="codigo">
          {{ props.row.codigo }}
        </q-td>
        <q-td v-if="!isConsultas" key="nombreJuzgado">
          <div class="tw-break-words tw-whitespace-normal tw-w-44">
            {{ props.row.nombreJuzgado }}
          </div>
        </q-td>
        <q-td key="canal">
          {{ props.row.canal }}
        </q-td>
        <q-td key="idRadicado">
          {{ props.row.idRadicado }}
        </q-td>
        <q-td key="fechaRadicacion">
          {{ props.row.fechaRadicacion }}
        </q-td>
        <q-td key="fechaIngreso">
          {{ props.row.fechaIngreso }}
        </q-td>
       <q-td key="tiempoAsignado">
  {{
    props.row.tiempoAsignado
      ? props.row.tiempoAsignado.replace(' días ', ' días, ')
      : "-"
  }}
</q-td>
<q-td key="tiempoVencer">
  {{
    (props.row.tiempoVencer == "0 días 0 horas y 0 minutos")
      ? 'Vencido'
      : (props.row.tiempoVencer ? props.row.tiempoVencer.replace(' días ', ' días, ') : '-')
  }}
</q-td>
        <q-td key="fechaVencimiento">
          {{ props.row.fechaVencimiento || "-" }}
        </q-td>

        <q-td key="nombresAfectado">
          <center>
            <div class="tw-break-words tw-whitespace-normal tw-w-44">
              {{ props.row.nombresAfectado }} <br />
              {{ props.row.identificacionAfectado }}
            </div>
          </center>
        </q-td>
        <q-td key="nombresRemitente">
          <center>
            <div class="tw-break-words tw-whitespace-normal tw-w-44">
              {{ props.row.nombresRemitente }} <br>
              {{ props.row.identificacionRemitente }}
            </div>
          </center>

        </q-td>
        <q-td key="ciudad">
          {{ props.row.ciudad }} / {{ props.row.departamento }}
        </q-td>
        <q-td key="tipoTramite">
          {{
            props.row.tipoTramite && props.row.etapaProcesal
              ? (props.row.tipoTramite || "-") +
              " / " +
              (props.row.etapaProcesal || "-")
              : "N/A"
          }}
        </q-td>
        <q-td key="abogado">
          {{ props.row.abogado || "-" }}
        </q-td>
        <q-td v-if="!isConsultas" key="asignaciones">
          <p :class="[
            'tw-border tw-h-[20px] tw-rounded-xl col-8',
            props.row.escalado
              ? ' tw-border-green-700 tw-bg-green-100'
              : ' tw-border-gray-400 tw-bg-gray-200 tw-text-secondary',
          ]">
            {{ props.row.asignaciones.etapa }}
            {{ props.row.escalado ? "Si" : "No" }}
          </p>
        </q-td>
        <q-td key="trazabilidad">
          <q-btn flat color="primary" @click="getTrazabilidad(props.row.id)" icon="history" />
        </q-td>
        <q-td key="estado">
          <div :class="[
            'tw-inline-block tw-p-1.5 tw-px-4 tw-rounded-lg tw-border tw-w-40',
            ESTADOS[props.row.estado]
          ]">
            <span :class="['tw-font-semibold']">{{ props.row.estado }}</span>
          </div>
        </q-td>
        <q-td v-if="!isConsultas" key="acciones">
  <q-btn class="tw-w-24 tw-h-9" flat @click="
    editData(
      props.row.id,
      props.row.estado == 'Aprobado' ? 'docSalida' : 'otra',
      props.row.idTutela
    )
    ">
    <q-icon
      v-if="props.row.estado.toLowerCase() === 'anulado' && props.row.fechaAnulacion !== null && props.row.anulacionConReinicio === false"
      color="primary"
      name="visibility"
    />
    <span v-else-if="isRolAprobador && props.row.estado != 'Aprobado'" class="tw-px-2">
      Aprobar</span>
    <span v-else-if="props.row.estado == 'Aprobado'" class="tw-px-2">
      Para enviar</span>
    <span v-else class="tw-px-2">
      {{ isRolGestionador ? "Gestionar" : "Asignar" }}</span>
  </q-btn>
  <q-btn class="tw-w-auto tw-h-9 tw-ml-2" flat icon="file_open" color="secondary" @click="
    editData(props.row.id, 'docRelacionado', props.row.idTutela)
    " />
</q-td>
        <q-td v-if="isConsultas" key="actions">
          <q-td class="text-center">
            <q-btn size="sm" color="primary" :icon="icon || 'visibility'" flat
              @click="editData(props.row.id, false, props.row.idTutela)" />
            <q-btn size="sm" color="secondary" :icon="secondIcon" flat v-if="isSecondIcon"
              @click="handleSecondIcon(props.row[rowId])" />
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
          <q-select :options="[5, 25, 50, 100]" v-model:model-value="props.pagination.rowsPerPage" dense outlined
            @update:model-value="handleRowsPerPageChange" />
        </div>
        <q-pagination v-model="pagination.page" max-pages="10" ellipsis color="primary" :max="props.totalPages"
          size="md" direction-links boundary-links boundary-numbers @update:model-value="handlePageChange" />
        <div class="invisible"></div>
      </div>
    </template>
  </q-table>

  <q-dialog full-width v-model="trazaModal">
    <q-card class="q-pa-xl tw-w-[3000px]">
      <a @click="trazaModal = false" class="tw-text-primary" style="text-decoration: none">
        <q-icon size="1.5em" name="chevron_left" color="primary" />
        <b> Volver </b>
      </a>
      <q-table flat :rows="trazabilidadData" :columns="trazabilidadColumns" :row-key="keyId"
        table-header-class="text-black text-h6" class="q-mr-md full-width tw-h-full" hide-pagination
        v-model:pagination="paginationTut">
        <template #body-cell-action="props">
          <q-td :props="props">
            <div class="tw-whitespace-pre-wrap tw-break-words tw-max-w-[200px]">
              <span>
                {{
                  props.row.descripcion?.length > 100
                    ? props.row.descripcion.slice(0, 100) + '...'
                    : props.row.descripcion
                }}
              </span>
              <q-tooltip class="custom-tooltip-content" v-if="props.row.descripcion?.length > 100" anchor="center right" self="center left"
                :offset="[10, 10]">
                <div  style="white-space: pre-wrap; max-width: 300px;">
                  {{ props.row.descripcion }}
                </div>
              </q-tooltip>
            </div>
          </q-td>
        </template>

        <template #body-cell-description="props">
          <q-td :props="props">
            <div class="tw-whitespace-pre-wrap tw-break-words tw-max-w-[200px]">
              <span>
                {{
                  props.row.detalle?.length > 100
                    ? props.row.detalle.slice(0, 100) + '...'
                    : props.row.detalle
                }}
              </span>
              <q-tooltip class="custom-tooltip-content" v-if="props.row.detalle?.length > 100" anchor="center left" self="center right"
                :offset="[-10, 5]">
                <div style="white-space: pre-wrap; max-width: 300px;">
                  {{ props.row.detalle }}
                </div>
              </q-tooltip>
            </div>
          </q-td>
        </template>
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
import { onMounted, ref, watch } from "vue";
import { useAuthStore } from "stores/auth.store";
import { ESTADOS } from "src/assets/estados/estados"
import AdjuntarDocumentosTable from "src/pages/EntesDeControl/Bandeja/Detalles/AdjuntarDocumentos/AdjuntarDocumentosTable.vue";
import { sgdeaAxios } from "src/services";
import moment from "moment";
import { DocumentoRadicado } from "src/interfaces";
import { toast } from "src/helpers/toast";

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
const listDocs = ref()
const showDocs = ref(false);

const paginationTut = ref({
  page: 1,
  rowsPerPage: 20,
});

const trazabilidadData = ref();
const rowsPerPage = ref(20);
const selection = ref([]);
const trazaModal = ref(false);
const isRolAprobador = ref(false);

const filteredData = ref([]);
const originData = ref([]);
const search = ref("");

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
    style: 'white-space: pre-wrap; word-break: break-word; width: 150px',
  },
  {
    label: "Trámite",
    field: (row) => "Tutela",
    align: "center",
    sortable: true,
    name: "tramite",
  },
  //   {
  //     label: "Oficina del usuario",
  //     field: row => row.oficina ?? '-',
  //     align: "center",
  //     sortable: true,
  //     name: "oficina"
  //   },
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
    field: "detalle",
    align: "center",
    sortable: true,
    style: 'white-space: pre-wrap; word-break: break-word; width: 150px',
  },
]);

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

async function getTrazabilidad(id) {
  const tutData = await sgdeaAxios.get(`/tutela/info/${id}`);
  const response = await sgdeaAxios.get(
    "/trazabilidad/obtenerPorCodProceso/" + "TUT" + tutData.data.idTutela
  );
  if (!response?.data || response.data.length === 0) {
    trazabilidadData.value = [];
    return;
  }

  trazabilidadData.value = response.data
    .sort((a, b) => a.id - b.id)
    .map((item, index) => ({
      ...item,

      fechaHora: moment(item.fechaHora).format("DD/MM/YYYY hh:mm"),
    }));
  trazaModal.value = true;
}

const isRolGestionador = ref(false);
const generalFilter = () => {
  filteredData.value = originData.value.filter((data) => {
    const fieldValues = Object.values(data).map(String);
    return fieldValues.some((value) =>
      value?.toLowerCase().includes(search.value?.toLowerCase())
    );
  });
};


const emit = defineEmits([
  "update:itemSelected",
  "handleEditData",
  "handleSecondIcon",
  "update:filas",
  "update:pages",
  "handleRowsPerPageChange",
  "handlePageChange",
  "search-change",
  "sortChange"
]);

const editData = (id: number, validView, idTutela: number) => {
  emit("handleEditData", id, validView, idTutela);
};

const handleSecondIcon = (id: number) => {
  emit("handleSecondIcon", id);
};

function onRequest(requestProps: any) {
  const { pagination } = requestProps;
  emit('sortChange', pagination);
}

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

const getDocs = async (id: number, numeroRadicado: string) => {
  const url = `tutela/${id}/archivos`;
  try {
    const response = await sgdeaAxios.get(url);
    if (Array.isArray(response.data)) {
      listDocs.value = response.data
        .map((doc) => {
          return {
            tipo: doc.tipo,
            nombre: doc.nombre,
            id: doc.id,
            nodeId: doc.nodeId,
            fecha: moment(doc.fechaCreacion).format("DD/MM/YYYY HH:mm"),
            cargado_por: doc.usuario,
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

watch(rowsPerPage, (value) => {
  props.pagination.rowsPerPage = value;
});

watch(selection, (newdateData) => {
  selection.value = newdateData;
  emit("update:itemSelected", selection.value);
});

const handleRowsPerPageChange = (event: any) => {
  emit("handleRowsPerPageChange", event);
};

const handlePageChange = (event: any) => {
  emit("handlePageChange", event);
};

onMounted(() => {
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
  () => props.TABLE_BODY,
  (newValue, oldValue) => {
    originData.value = newValue;
    filteredData.value = newValue;
  }
);
</script>
<style lang="css">
.custom-tooltip-content {
  background-color: white;
  color: #222222;
  padding: 8px 12px;
  border-radius: 6px;
  max-width: 300px;
  white-space: pre-wrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style>
