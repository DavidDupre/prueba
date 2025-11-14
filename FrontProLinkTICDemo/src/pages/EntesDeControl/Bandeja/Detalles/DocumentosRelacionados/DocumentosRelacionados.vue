<template>
  <q-card class="col-12 tw-mx-4">
    <q-expansion-item
      dense
      default-opened
      expand-separator
      class="tw-bg-white q-mt-md"
      style="border-radius: 5px"
    >
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Lista de Anexos</h3>
      </template>
      <q-card class="tw-p-6">
        <div class="tw-flex tw-mb-4 tw-gap-2">
          <q-btn
            :label="'De entrada'"
            :color="selectedType === 'entrada' ? 'primary' : 'grey-7'"
            outline
            icon="info"
            @click="filterDocsByType('entrada')"
          />
          
          <q-btn
            :label="'De gestión'"
            :color="selectedType === 'gestion' ? 'primary' : 'grey-7'"
            outline
            icon="info"
            @click="filterDocsByType('gestion')"
          />

          <q-btn
            :label="'De salida'"
            :color="selectedType === 'salida' ? 'primary' : 'grey-7'"
            outline
            icon="info"
            @click="filterDocsByType('salida')"
          />
        </div>

        <Table
          :TABLE_HEADER="fileColumns"
          :TABLE_BODY="listDocsFiltered"
          :btnDelete="true"
          @downloadDoc="download"
          @printDoc="print"
          :loading="loading"
          :from="from"
        />
      </q-card>
    </q-expansion-item>
  </q-card>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted } from "vue";
import Table from "../AdjuntarDocumentos/AdjuntarDocumentosTable.vue";
import moment from "moment";
import { sgdeaAxios } from "src/services";
import { DocumentoRadicado } from "src/interfaces";
import { toast } from "src/helpers/toast";

const loading = ref(false);
const listDocs = ref([]);
const listDocsFiltered = ref([]);
const nameDocument = ref();
const selectedType = ref<string | null>('entrada'); // Establecer 'entrada' como valor predeterminado

const props = defineProps<{
  type?: string;
  detailsRadicado: any;
  rol: any;
  from: string;
}>();

const fileColumns = [
  {
    name: "formato",
    label: "Formato",
    field: "formato",
    sortable: false,
    align: "center",
  },
  {
    name: "nombre",
    label: "Nombre del Documento",
    field: "nombre",
    sortable: true,
    align: "center",
  },
  {
    name: "tipo",
    label: "Tipo de Documento",
    field: "tipo",
    sortable: true,
    align: "center",
  },
  {
    name: "cargado_por",
    label: "Cargado por",
    field: "cargado_por",
    sortable: true,
    align: "center",
  },
  {
    name: "fecha",
    label: "Fecha de Cargue",
    field: "fecha",
    sortable: true,
    align: "center",
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    sortable: true,
    align: "center",
  },
];

onMounted(() => {
  getDocuments();
});

const getDocuments = () => {
  loading.value = true;
  const url = `/api/entes/getDocumentosByEnteControlId/${props.detailsRadicado.id}`;
  sgdeaAxios
    .get(url)
    .then((response) => {
      listDocs.value = response.data?.map((it) => {
        if (it.documentoAdjuntado === null || it.documentoAdjuntado) {
          if (
            it.tipoArchivo.toLowerCase().includes("entrada_r") &&
            props?.rol?.toLowerCase().includes("asignador")
          ) {
            it.tipoArchivo = "De entrada";
          } else if (it.tipoArchivo.toLowerCase().includes("entrada")) {
            it.tipoArchivo = "De entrada";
          } else if (it.tipoArchivo.toLowerCase().includes("salida")) {
            it.tipoArchivo = "De salida";
          } else if (
            ["gestion", "gestion_c"].includes(it.tipoArchivo.toLowerCase())
          ) {
            it.tipoArchivo = "De gestión";
          }

          return {
            tipo: it.tipoArchivo,
            nombre: it.nombreArchivo,
            id: it.id,
            nodeId: it.nodeId,
            fecha: moment(it.fechaCargue).format("DD/MM/YYYY HH:mm"),
            cargado_por: it.usuario.userName,
          };
        }
      });

      listDocs.value = listDocs.value.filter(Boolean);

      if (props?.rol?.toLowerCase().includes("asignador")) {
        listDocs.value = listDocs.value.filter((it) => it.tipo !== "De entrada");
      }

      // Filtrar y ordenar los documentos
      const listDocsENT = listDocs.value.filter((docs) =>
        docs.nombre.startsWith("ENT")
      );
      listDocsENT.sort((a, b) => {
        if (a.nombre.includes(props.detailsRadicado.nroRadicado)) return -1;
        if (b.nombre.includes(props.detailsRadicado.nroRadicado)) return 1;
        return a.nombre.localeCompare(b.nombre);
      });

      const listDocsNotENT = listDocs.value.filter(
        (doc) => !doc.nombre.startsWith("ENT")
      );
      listDocs.value = listDocsENT.concat(listDocsNotENT);

      // Mostrar los documentos de entrada por defecto
      filterDocsByType('entrada');

      return response;
    })
    .finally(() => (loading.value = false));
};

const filterDocsByType = (type: string) => {
  selectedType.value = type;
  switch (type) {
    case "entrada":
      listDocsFiltered.value = listDocs.value.filter(
        (doc) => doc.tipo === "De entrada"
      );
      break;
    case "salida":
      listDocsFiltered.value = listDocs.value.filter(
        (doc) => doc.tipo === "De salida"
      );
      break;
    case "gestion":
      listDocsFiltered.value = listDocs.value.filter(
        (doc) => doc.tipo === "De gestión"
      );
      break;
    default:
      listDocsFiltered.value = listDocs.value;
  }
};

const print = (id) => {
  const url = `/radicados/consultar_documento/${id}`;
  if (id)
    nameDocument.value = listDocs.value.find((it) => it.id === id)?.nombre;

  sgdeaAxios
    .get<DocumentoRadicado>(url)
    .then(({ data }: any) => {
      const byteCharacters = atob(data.base64x);
      let byteNumbers = new Array(byteCharacters.length);
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

const download = (id: string, name: string) => {
  const url = `/radicados/consultar_documento/${id}`;
  sgdeaAxios
    .get(url)
    .then((response) => {
      const name = listDocs.value.find((it) => it.nodeId === id)?.nombre;

      const byteCharacters = atob(response.data.base64x);
      const byteNumbers = new Array(byteCharacters?.length);

      for (let i = 0; i < byteCharacters?.length; i++) {
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
    })
    .catch(() => toast.error("Ha ocurrido un error al descargar"));
};
</script>
