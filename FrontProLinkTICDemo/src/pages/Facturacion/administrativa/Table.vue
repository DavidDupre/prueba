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
          'tw-bg-[#FFC7CE]': isOver24Hours(props.row.fecha, props.row.hora),
        }">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <div v-if="col.name == 'estado'" :class="[
              'tw-inline-block tw-p-1.5 tw-px-4 tw-rounded-lg tw-border tw-w-40',
              (col.value === 'Por asignar' && checkIfMoreThanADay(props.row.fecha, col.value))
                ? 'tw-bg-[#FDE5E5] tw-border-[#EA0000] tw-text-[#2C3948]'
                : ESTADOS[col.value]
            ]">
              <span :class="['tw-font-semibold']">{{
                checkStatus(col.value)
              }}</span>
            </div>
            <div v-else-if="col.name == 'acciones'" class="tw-flex tw-row">
              <q-btn v-if="props.row.estado.toLowerCase() === 'anulado' &&
                props.row.fechaAnulacion !== null &&
                props.row.anulacionConReinicio === false" flat icon="visibility" color="primary" class="tw-w-24 tw-h-9"
                @click="viewDetails(props.row.idFactura || props.row.id_factura_a, props.row.estado)">
                <q-tooltip>Anulado</q-tooltip>
              </q-btn>
              <q-btn v-else :label="getLabelEstados(props.row.estado)" no-caps class="tw-w-24 tw-h-9" flat unelevated
                @click="viewDetails(props.row.idFactura || props.row.id_factura_a, props.row.estado)" v-if="!(
                  props.row.estado.toLowerCase() == 'aprobado' ||
                  props.row.estado.toLowerCase() == 'gestión rechazada' ||
                  props.row.estado.toLowerCase() == 'aprobación rechazada' ||
                  props.row.estado.toLowerCase() == 'rechazado' ||
                  props.row.estado.toLowerCase() == 'retenido'
                )
                " />
              <q-btn class="tw-w-auto tw-h-8 tw-ml-2" flat icon="file_open" color="secondary" @click="
                editDataDoc(
                  props.row.nodeId,
                  'docRelacionado',
                  props.row.sec
                )
                " />
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
        <div class="row tw-justify-between q-mt-md tw-w-[100%]">
          <div class="tw-flex tw-gap-x-3 tw-items-center">
            <span>Filas</span>
            <q-select :options="[5, 25, 50, 100]" v-model:model-value="rowsPerPage" dense outlined
              @update:model-value="handleRowsPerPageChange" />
          </div>
          <q-pagination v-model="page" max-pages="15" ellipsis color="primary" :max="TABLE_TOTAL_ROWS" size="md"
            direction-links boundary-links boundary-numbers @update:model-value="handlePageChange" />
          <div class="invisible"></div>
        </div>
      </template>
    </q-table>
  </div>

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
import { checkIfMoreThanADay } from "src/helpers/filters";
import { checkStatus } from "src/helpers/checkStatus";
import { useAuthStore } from "src/stores/auth.store";
import AdjuntarDocumentosTable from "src/pages/EntesDeControl/Bandeja/Detalles/AdjuntarDocumentos/AdjuntarDocumentosTable.vue";
import moment from "moment";
import { DocumentoRadicado } from "src/interfaces";
import { ESTADOS } from "src/assets/estados/estados"
import { ref, watch } from "vue";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { useRouter } from "vue-router";
import { FACTURA_HEADER, fileColumnsDocs } from ".";

const props = withDefaults(
  defineProps<{
    FACTURA_HEADER: any[];
    FACTURA_BODY: any[];
    TABLE_TOTAL_ROWS: number;
    isLoading?: boolean;
  }>(), {}
);

const { userInfo } = useAuthStore();
const router = useRouter();
const listDocs = ref([]);
const showDocs = ref(false);
const search = ref("");
const filteredData = ref([]);
const originData = ref([]);
const page = ref(1)
const rowsPerPage = ref(20);
const pagination = ref({
  page: 1,
  rowsPerPage: 20,
});

const emit = defineEmits(["handleRowsPerPageChange", "handlePageChange"]);

function isOver24Hours(fecha, hora) {
  const rowDateTime = new Date(`${fecha} ${hora}`);
  const currentDateTime = new Date();
  const timeDifference = Number(currentDateTime) - Number(rowDateTime);
  const hoursDifference = timeDifference / (1000 * 60 * 60);

  return hoursDifference > 24;
}

const generalFilter = () => {
  filteredData.value = originData.value.filter((data) => {
    const fieldValues = Object.values(data).map(String);
    return fieldValues.some((value) =>
      value?.toLowerCase().includes(search.value?.toLowerCase())
    );
  });
};

const getLabelEstados = (row) => {
  const rowLabel = row.toLowerCase();

  if (rowLabel === "por asignar" || rowLabel === "radicado") return "Asignar";
  if (rowLabel === "por aprobar" || rowLabel === "gestionado") return "Aprobar";

  return "Gestionar";
};

async function viewDetails(idFactura: number, row: string) {
  try {
    await sgdeaAxios.put(`facturacion/Reclamo?type=FACTURA&id=${idFactura}&idUser=${userInfo.userid}`);
    let newroute = "";
    if (row.toLowerCase() === "radicado") newroute = "asignacion";
    else if (row.toLowerCase() === "gestionado") newroute = "aprobacion";
    else newroute = "gestion";

    router.push(`/facturacion/radicados/${newroute}/` + idFactura);
  } catch (error) {
    if ([400, 401, 403, 404, 500].includes(error.response.status)) {
      toast.error("Esta factura ya fue reclamada por otro usuario.");
    }
    console.error(error);
  }
}

const editDataDoc = (id: number, type: string, numeroRadicado: string) => {
  if (type === "docRelacionado") {
    getDocs(id);
  }
};

const getDocs = async (id: number) => {
  const response = await sgdeaAxios.get('/radicados/obtenerHijosPorNodo/' + id);

  if (response.status !== 200 && response.status !== 201) {
    return;
  }

    listDocs.value = response.data.list.entries.map((docs) => {
      return {
        ...docs?.entry,
        nodeId: docs?.entry.id,
        nombre: docs?.entry.name,
        tipo: docs?.entry.name.startsWith("ENT") ? "De salida" : "De entrada",
        fecha: moment(docs?.entry?.createdAt, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('DD/MM/YYYY'),
        cargado_por: docs?.entry.createdByUser.displayName,
        formato: docs?.entry?.content?.mimeType,
      }
    });

  showDocs.value = true;
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
