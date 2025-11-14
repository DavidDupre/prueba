<template>
  <div>
    <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId" table-header-class="text-black text-h6"
      :hide-header="TABLE_BODY.length > 0 ? false : true" :selection="select" class="q-mr-md full-width" hide-pagination
      v-model:selected="selection" color="primary" v-model:pagination="pagination">
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

      <template v-slot:body-cell-asignaciones="props">
        <q-td class="tw-w-[125px]">
          <p :class="[
            'tw-border tw-h-[20px] tw-rounded-xl col-8',
            props.row.escalado ? ' tw-border-green-700 tw-bg-green-100' : ' tw-border-gray-400 tw-bg-gray-200 tw-text-secondary'
          ]">
            {{ props.row.asignaciones.etapa }}
            {{ props.row.escalado ? 'Si' : 'No' }}
          </p>
        </q-td>
      </template>

      <template v-slot:body-cell-estado="props">
        <q-td class="text-center">
          <div :class="[
            'tw-border tw-rounded-md q-my-sm tw-max-w-max q-px-md q-py-xs tw-bg-green-100 tw-border-green-400 tw-text-black-500'
          ]">
            {{ props.row.estadoEnvios?.nombre }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-escaladores="props">
        <q-td class="text-center">
          {{ props.row.escaladores?.join(' / ') || '-' }}
        </q-td>
      </template>

      <template v-slot:body-cell-acciones="props">
        <q-td class="text-center">
          <q-btn flat color="primary" @click="editData(props.row.nodeId)" icon="inventory_2">
          </q-btn>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td class="text-center">
          <q-btn size="sm" color="primary" :icon="icon || 'visibility'" flat @click="editData(props.row.nodeId)" />
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
          <q-btn flat color="primary" @click="getTrazabilidad(props.row.id)" icon="history">
          </q-btn>
          <q-btn class="tw-w-auto tw-h-8 tw-ml-2" flat icon="file_open" color="secondary"
            @click="getDocs(props.row.id, props.row.nodeId)" />
        </q-td>
      </template>

      <template v-slot:body-cell-docs="props">
        <q-td>
          <q-btn flat color="secondary" @click="$router.push('/bandeja/carpeta/entrada/' + props.row.id)" icon="folder">
          </q-btn>
        </q-td>
      </template>

    </q-table>
    <div class="row justify-between q-mt-md" v-if="TABLE_BODY?.length > 0">
      <div class="tw-flex tw-gap-x-3 tw-items-center">
        <span>Filas</span>
        <q-select :options="[5, 25, 50, 100]" v-model:model-value="rowsPerPage" dense outlined
          @update:model-value="handleRowsPerPageChange" />
      </div>
      <q-pagination v-model="page" max-pages="20" ellipsis color="primary" :max="TABLE_TOTAL_PAGES" size="md"
        direction-links boundary-links boundary-numbers @update:model-value="handlePageChange" />
      <q-btn icon="refresh" type="button" flat class="invisible" />
    </div>

  </div>
  <q-dialog full-width v-model="trazaModal">
    <q-card class="q-pa-xl tw-w-[3000px]">
      <a @click="trazaModal = false" class="tw-text-primary" style="text-decoration: none">
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
        <AdjuntarDocumentosTable :TABLE_HEADER="fileColumnsDocs" :TABLE_BODY="listDocs" @downloadDoc="download"
          @printDoc="print" />
      </div>
    </q-card>
  </q-dialog>

</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useAuthStore } from "stores/auth.store";
//@ts-ignore
import NoData from "assets/filterImage.svg"
import { sgdeaAxios } from "src/services";
import moment from "moment";
import Trazabilidad from "src/pages/Expedientes/Trazabilidad/Trazabilidad.vue";
import { DocumentoRadicado } from "src/interfaces";
import AdjuntarDocumentosTable from "src/pages/EntesDeControl/Bandeja/Detalles/AdjuntarDocumentos/AdjuntarDocumentosTable.vue";
import { toast } from "src/helpers/toast";

const props = withDefaults(defineProps<{
  TABLE_BODY: any[],
  TABLE_HEADER: any[],
  icon?: string,
  keyId?: any,
  msgNoData?: string,
  rowId?: string,
  isSecondIcon?: boolean,
  secondIcon?: string,
  select: "none" | "single" | "multiple",
  TABLE_TOTAL_PAGES: number
  firstContentId: number | null,
}>(), {
  select: "none",
  keyId: "codigo",
  secondIcon: "eye",
  firstContentId: null,
})

const { getUserInfo } = useAuthStore();
const userInfo = ref()
const sortFor = ref()
const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  sortBy: sortFor.value,
  descending: false,
})

const trazabilidadData = ref<any[]>([])
const page = ref(1)
const rowsPerPage = ref(20)
const selection = ref([])
const showingFullText = ref(false)
const trazaModal = ref(false)
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
  { name: "fecha", label: "Fecha", align: "center", field: (row) => row.fecha },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    sortable: true,
    align: "center",
  },
]);

async function getTrazabilidad(id) {
  try {

    const getenvio = await sgdeaAxios.get(`/envios/obtenerCaso/${id}`);

    let prefix;
    switch (getenvio.data.idFlujo.id) {
      case 1:
        prefix = 'COR';
        break;
      case 5:
        prefix = 'PQRD';
        break;
      case 3:
        prefix = 'FAC';
        break;
      case 4:
        prefix = 'CTO';
        break;
      case 8:
        prefix = 'ML';
        break;
      case 6:
        prefix = 'TUT';
        break;
      case 7:
        prefix = 'ENTC';
        break;
      default:
        trazaModal.value = false;
        return;
    }

    const response = await sgdeaAxios.get(`/trazabilidad/obtenerPorCodProceso/${prefix}${getenvio.data.idCaso}`);

    if (!response?.data || response.data.length === 0) {
      trazabilidadData.value = [];
      return;
    }

    trazabilidadData.value = response.data
      .sort((a, b) => a.id - b.id)
      .map(item => ({
        ...item,
        fechaHora: moment(item.fechaHora).format('DD/MM/YYYY HH:mm'),
      }));
    trazaModal.value = true;
  } catch (error) {
    console.error('Error al obtener la trazabilidad:', error);
    trazabilidadData.value = [];
  } finally {
    trazaModal.value = true;
  }
}

const pagesNumber = ref(1)

const cleanSelect = () => {
  selection.value = []
}

defineExpose({
  cleanSelect
})

const emit = defineEmits(['update:itemSelected', 'handleEditData', 'handleSecondIcon', 'update:filas', 'update:pages', 'handlePageChange'])

const editData = (id: number) => {
  emit('handleEditData', id)
}

const handleSecondIcon = (id: number) => {
  emit('handleSecondIcon', id)
}

const handleRowsPerPageChange = (event: any) => {
  pagination.value.rowsPerPage = event
  if (pagination.value.page > 0) {
    pagination.value.page = pagination.value.page - 1
  }
  emit("handlePageChange", pagination.value);
};

const handlePageChange = () => {
  emit("handlePageChange", { page: page.value, rowsPerPage: pagination.value.rowsPerPage });
};

watch(rowsPerPage, (value) => {
  pagination.value.rowsPerPage = value;
})

watch(selection, (newdateData) => {
  selection.value = newdateData
  emit('update:itemSelected', selection.value)
});

onMounted(async () => {
  userInfo.value = await getUserInfo();
  pagesNumber.value = props?.TABLE_TOTAL_PAGES
});

const collapseContent = (text = '') => {
  if (showingFullText.value) {
    return text;
  }
  return `${text?.slice(0, 200).trim()}`;
}


const getDocs = async (id: number, nodeId: string) => {
  try {
    const response = await sgdeaAxios.get(`/radicados/obtenerHijosPorNodo/${nodeId}`);
    if (Array.isArray(response.data.list.entries)) {
      listDocs.value = response.data.list.entries.filter(doc=> doc.entry.name.startsWith("SAL"))
        .map((doc) => {
          doc.tipoDocumento = "De salida";
          return {
            tipo: doc.tipoDocumento,
            nombre: doc.entry.name + ".pdf",
            id: doc.entry.id,
            nodeId: doc.entry.id,
            fecha: moment(doc.entry.createdAt).format("DD/MM/YYYY HH:mm"),
            cargado_por: doc.entry.createdByUser.displayName,
          };
        })
        .filter((doc) => doc !== null);
      showDocs.value = true;
    } else {
      console.error(response.data);
    }
    showDocs.value = true;
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
