<template>
  <div>
    <q-table flat :rows="filteredData" :columns="TABLE_HEADER" :row-key="keyId" table-header-class="text-black"
      class="q-mr-md full-width" rows-per-page-label="Páginas" color="secondary" hide-pagination
      v-model:pagination="pagination" :selection="isSelection" v-model:selected="selection" :loading="isLoading"
      no-data-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
      no-results-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente">

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
      <template v-slot:body-cell-nombreAfectado="props">
        <q-td class="tw-w-[125px]">
          <span>
            {{ props.row.nombreAfectado }} <br />
            {{ props.row.documentoAfectado || "-" }}
          </span>
        </q-td>
      </template>
      <template v-slot:body-cell-remitente="props">
        <q-td class="tw-w-[125px]">
          <span>
            {{ props.row.nombreRemitente }} <br />
            {{ props.row.documentoRemitente || "-" }}
          </span>
        </q-td>
      </template>


      <template v-slot:body-cell-estado="props">
        <q-td class="tw-w-[125px]">
          <span
            :class="`tw-inline-block tw-py-2 tw-min-w-36 tw-font-semibold tw-border-[0.5px] tw-rounded-lg ${ESTADOS[props.row.estado]}`">
            {{ props.row.estado }}
          </span>
        </q-td>
      </template>

      <template v-slot:body-cell-trazabilidad="props">
        <q-td class="tw-cursor-pointer">
          <q-icon name="history" size="sm" color="primary" @click="() => handleTrazabilidad(props.row.id)" />
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td style="height: 100% !important">
          <q-btn v-if="auth.$state.userInfo.role === 'Publicador'" flat class="tw-w-24 tw-h-9 tw-inline-block"
            @click="editData(props.row)">
            <span class="tw-px-2">Gestionar</span>
          </q-btn>

          <template v-else>
            <q-btn v-if="props.row.estado === 'Por revisar' ||
              (props.row.estado.toLowerCase() === 'anulado' &&
                props.row.fechaAnulacion !== null &&
                props.row.anulacionConReinicio === false &&
                auth.$state.userInfo.role === 'Gestionador')" class="tw-w-auto tw-h-9 tw-inline-block"
              icon="visibility" flat color="primary" @click="editData(props.row)">
            </q-btn>
            <q-btn v-else flat class="tw-w-24 tw-h-9 tw-inline-block" @click="editData(props.row)">
              <span class="tw-px-2">{{ getEstado(props.row.estado) }}</span>
            </q-btn>
          </template>

          <q-btn class="tw-inline-block tw-w-auto tw-h-9 tw-ml-2" flat icon="file_open" color="secondary"
            @click="getDocuments(props.row)" />
        </q-td>
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
            <q-select :options="[5, 25, 50, 100]" v-model:model-value="rowsPerPage" dense outlined
              @update:model-value="handleRowsPerPageChange" />
          </div>
          <q-pagination v-model="page" max-pages="20" ellipsis color="primary" :max="TABLE_TOTAL_ROWS" size="md"
            direction-links boundary-links boundary-numbers @update:model-value="handlePageChange" />
          <div class="invisible"></div>
        </div>
      </template>
    </q-table>
  </div>

  <!-- ! Trazabilidad -->
  <q-dialog full-width v-model="trazaModal">
    <q-card class="tw-px-8 tw-py-7 tw-w-[300px]">
      <a @click="trazaModal = false" class="tw-text-primary tw-cursor-pointer" style="text-decoration: none">
        <q-icon size="1.5em" name="chevron_left" color="primary" />
        <b>Volver</b>
      </a>
      <p class="tw-font-bold tw-mt-2 tw-mb-4 tw-text-xl">Trazabilidad</p>
      <q-table flat :rows="trazabilidadData" :columns="trazabilidadColumns" :row-key="keyId"
        table-header-class="text-black text-h6" class="q-mr-md full-width tw-h-full">
      </q-table>
    </q-card>
  </q-dialog>

  <!-- ! Docs Relacionados -->
  <q-dialog full-width v-model="docsModal">
    <q-card>
      <q-form>
        <section>
          <q-card class="tw-p-6 q-mt-md">
            <div class="q-mt-sm">
              <div class="row tw-justify-between">
                <p class="tw-text-lg text-weight-bold q-mx-lg">
                  Listado de documentos cargados
                </p>
              </div>
              <Table :TABLE_BODY="listDocs" :TABLE_HEADER="HEADER_DOCUMENTS" icon="download" isSecondIcon
                secondIcon="print" :loading="loading" is-selection="none" @handleEditData="download"
                @handleSecondIcon="print" :key-id="'id'" />
            </div>
          </q-card>
        </section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import Table from '../Documentos/Table.vue'
import { ref, watch } from "vue";
import { HEADER_DOCUMENTS, trazabilidadColumns } from ".";
import { sgdeaAxios } from "src/services";
import moment from "moment";
import { toast } from "src/helpers/toast";
import { DocumentoRadicado } from "src/interfaces";
import { useAuthStore } from 'src/stores/auth.store';
import { useQuasar } from 'quasar';
import { ESTADOS } from "src/assets/estados/estados";

const search = ref('')
const debounceTimeout = ref<any>(null)

const props = withDefaults(
  defineProps<{
    TABLE_BODY: any[];
    TABLE_HEADER: any[];
    TABLE_TOTAL_ROWS: number;
    selection: "none" | "single" | "multiple" | undefined;
    inputDataProp?: string | undefined;
    itemSelected: any[];
    icon?: string;
    keyId?: string;
    msgNoData?: string;
    isSecondIcon?: boolean;
    secondIcon?: string;
    isThridIcon?: boolean;
    isSelection?: "none" | "single" | "multiple" | undefined;
    isToggle?: boolean;
    iconTrazabilidad?: string;
    userId?: string;
    role?: string;
    isLoading?: boolean;
  }>(),
  {
    selection: "multiple",
    keyId: "codigo",
    secondIcon: "eye",
    isSelection: 'multiple',
  }
);

const filteredData = ref([]);
const originData = ref([]);

const auth = useAuthStore()
const trazabilidadData = ref();
const trazaModal = ref(false);
const docsModal = ref(false);
const selection = ref([]);
const showingFullText = ref(false);
const listDocs = ref()
const loading = ref(true)
const nameDocument = ref()
let pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 20,
})
const page = ref(1)
const rowsPerPage = ref(20);
const $q = useQuasar();
$q.iconSet.table.arrowUp = 'import_export';

const emit = defineEmits([
  "update:itemSelected",
  "handleEditData",
  "handleRowsPerPageChange",
  "handlePageChange",
  "search-change"
]);

const emitSearch = () => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }

  debounceTimeout.value = setTimeout(() => {
    emit('search-change', search.value);
  }, 3000) // 3 segundos de debounce

}

const editData = async (row: any) => {
  const isAsignador = props.role.toLowerCase() === "asignador responsable"
  if (isAsignador) {
    try {
      const response = await sgdeaAxios.put("/medicina/reclamo", null, {
        params: { id: row.id, idUser: props?.userId },
      });
      if (response.status === 200) {
        toast.success("En proceso de Asignación, tiene 15 min. para su gestión");
        emit("handleEditData", row);
      } else if (response.status === 202) {
        emit("handleEditData", row);
      }
    } catch (error) {
      if (error.response.status === 304) {
        toast.error("El caso ya ha sido reclamado");
      }
    }
  } else {
    emit("handleEditData", row);
  }
};

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

async function handleTrazabilidad(id) {
  const response = await sgdeaAxios.get(
    "/trazabilidad/obtenerPorCodProceso/" + "ML" + id
  );
  if (!response || !response?.data || response?.data?.length === 0) {
    trazabilidadData.value = [];
    trazaModal.value = true;
    return;
  } else {
    trazabilidadData.value = response.data
      .sort((a, b) => a.id - b.id)
      .map((item, index) => ({
        ...item,
        fechaHora: moment(item.fechaHora).format("DD/MM/YYYY HH:mm"),
      }));
    trazaModal.value = true;
  }
  trazaModal.value = true;
}

const getEstado = (estado) => {
  const rowLabel = estado.toLowerCase();

  if (rowLabel === 'por asignar' || rowLabel === 'gestión rechazada' || rowLabel === 'en asignación') return 'Asignar';
  if (rowLabel === 'para gestión' || rowLabel === 'en edición' || rowLabel === 'revisión rechazada' || rowLabel === 'aprobación rechazada' || rowLabel === 'devolucion') return 'Gestionar';
  if (rowLabel === 'por revisar') return 'Revisar';
  if (rowLabel === 'por aprobar') return 'Aprobar';
  if (rowLabel === 'anulado') return 'Gestionar';
}

watch(selection, (newdateData) => {
  selection.value = newdateData;
  emit("update:itemSelected", selection.value);
});

watch(rowsPerPage, (value) => {
  pagination.value.rowsPerPage = value;
});

const collapseContent = (text = "") => {
  if (showingFullText.value) {
    return text;
  }
  return `${text?.slice(0, 200).trim()}`;
};

const getDocuments = async (info: any) => {
  try {
    loading.value = true
    const response = await sgdeaAxios.get<any>(`/medicina/documentos/${info.id}`);
    if (response.status === 200) {
      listDocs.value = response.data.map((it) => {
        return {
          formato: it.formato,
          nombre: it.nombre,
          fecha: moment(it.fechaCargue).format('DD/MM/YYYY'),
          cargado_por: it.usuario.firstname + ' ' + it.usuario.lastname,
          id: it.id,
          nodeId: it.nodeId,
          tipo: `De ${it.tipoDocumento.toLowerCase()}`,
          username: it.usuario.userName
        }
      }).sort((a, b) => {
        if (a.nombre === info.numeroRadicado + '.pdf') return -1;
        if (b.nombre === info.numeroRadicado + '.pdf') return 1;
        return 0;
      })

      docsModal.value = true
      loading.value = false
    }
  } catch (error) {
    console.error(error)
  }
}

const download = async (id) => {
  const { data } = await sgdeaAxios.get<DocumentoRadicado>(
    `/radicados/consultar_documento/${id}`
  )

  if (id) {
    const nameDocument = listDocs.value.find((it) => it.nodeId === id)?.nombre
    const byteCharacters = atob(data.base64x);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = nameDocument;
    link.click();
    URL.revokeObjectURL(blobUrl);
  }
};

const print = async (id) => {
  try {
    const { data } = await sgdeaAxios.get<DocumentoRadicado>(
      `/radicados/consultar_documento/${id}`
    );

    if (id) {
      nameDocument.value = listDocs.value.find((it) => it.id === id)?.nombre
    }

    const byteCharacters = atob(data.base64x);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const blobUrl = URL.createObjectURL(blob);

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    // Función para manejar el evento afterprint
    function handleAfterPrint() {
      // Eliminar el iframe después de imprimir o cancelar
      document.body.removeChild(iframe);
      window.removeEventListener('afterprint', handleAfterPrint);
    }

    // Agregar evento afterprint para manejar la impresión
    window.addEventListener('afterprint', handleAfterPrint);

    // Esperar a que se cargue el contenido del iframe antes de imprimir
    iframe.onload = function () {
      // Imprimir el contenido del iframe
      iframe.contentWindow.print();
    };

  } catch (error) {
    toast.error('Ha ocurrido un error')
  }
}

watch(
  () => props.TABLE_BODY,
  (newValue, oldValue) => {
    originData.value = newValue;
    filteredData.value = newValue;
  }
);
</script>
