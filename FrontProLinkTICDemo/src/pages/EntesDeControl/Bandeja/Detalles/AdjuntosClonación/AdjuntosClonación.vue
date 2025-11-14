<template>
  <q-card class="col-12 tw-mx-4">
    <q-expansion-item dense default-opened expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
          Documentos del Caso
        </h3>
      </template>
      <q-card class="tw-p-6">
        <Table :TABLE_HEADER="fileColumns" :TABLE_BODY="listDocs" :btnDelete="true" @editName="editName"
          @habilitarEditarNombre="habilitarEditarNombre" @downloadDoc="download" @printDoc="print" :loading="loading"
          @AdjuntarComoSalida="AdjuntarComoSalida" :rol="rol" />
      </q-card>
    </q-expansion-item>
  </q-card>

  <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5" v-if="listDocs?.length">
    <q-btn class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]" no-caps style="border: 1px solid #2c3948"
      label="Cancelar" @click="cancelModal = true" />
    <q-btn class="tw-w-1/4 tw-h-11 bg-primary text-white" type="submit" label="Guardar" @click="adjuntarDocumentos()" />
  </div>
  <Modal v-model="cancelModal" title="¡Espera un momento!" :is-success="false" @handleAccept="emit('backView', true)"
    cancel-button textButtonCancel="No" textButton="Si"
    text="Al cancelar la acción perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
    type="button" />
</template>

<script lang="ts" setup>
import { AccionesDocumentosClonacion, InfoGeneral } from "../types";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { useAuthStore } from "src/stores/auth.store";
import { DocumentoRadicado } from "src/interfaces";
import Table from "./AdjuntarClonadosTable.vue";
import Modal from "components/Modal/Modal.vue";
import { ref, onMounted, watch } from "vue";
import { toast } from "src/helpers/toast";
import { sgdeaAxios } from "src/services";
import { useRoute } from "vue-router";
import moment from "moment";

const route = useRoute();

const props = defineProps<{
  type: string;
  detailsRadicado: InfoGeneral;
  rol: string;
}>();
const emit = defineEmits(["findDocs", "backView"]);

const auth = useAuthStore();

const ente_id = route.params.id;
const validationsWords = ref(false)
const cancelModal = ref(false);
const nameDocument = ref();
const loading = ref(false);
const listDocs = ref([]);
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

const habilitarEditarNombre = (id) => {
  const index = listDocs.value.findIndex((list) => list.id === id);
  listDocs.value[index].editName = !listDocs.value[index].editName;
};

const getDocuments = async () => {
  loading.value = true;

  await Promise.all(
    props.detailsRadicado.asignaciones.map((asignacion) => {
      const url = `api/entes/clonacion/getDocumentos/${asignacion.idAsignacion}`;
      return sgdeaAxios.get(url);
    })
  ).then(function (values) {
    const array = values.map((val) => val.data).flat();

    const newData = array?.map((doc) => {
      if (!doc.documentoAdjuntado) {
        const extension = doc.formato.match(/\.([^.]+)$/)
        return {
          tipo: doc.tipoArchivo.toLowerCase().includes("gestion") ? "De gestión" : "De salida",
          nombre: doc.nombreArchivo,
          id: doc.id,
          nodeId: doc.nodeId,
          fecha: moment(doc.fechaCargue).format("DD/MM/YYYY HH:mm"),
          cargado_por: doc.usuario.userName,
          editName: false,
          extension: extension ? extension[1] : doc.formato,
          nombreArchivo: doc.nombreArchivo.lastIndexOf('.') === -1 ? doc.nombreArchivo : doc.nombreArchivo.substring(0, doc.nombreArchivo.lastIndexOf('.'))
        };
      }
    });

    listDocs.value = newData.filter(Boolean);
  });

  loading.value = false;
};

const editName = (nodeId, newName, extensionFile) => {
  const totalFile = newName.length - extensionFile.length - 1
  if (totalFile > 100) {
    validationsWords.value = true
  } else {
    const url = `/api/entes/clonacion/cambiarNombreDocumento/${nodeId}?newName=${newName}`;
    sgdeaAxios
      .patch(url)
      .then(async (response) => {
        toast.success("El nombre del documento fue editado correctamente");
        getDocuments();
        await trazabilidad(AccionesDocumentosClonacion.EDITAR);
      })
      .catch(() => {
        toast.error("Ha ocurrido un error al editar el nombre del documento");
        listDocs.value.forEach(doc => doc.editName = false)
      });
  }
};

const trazabilidad = async (type: AccionesDocumentosClonacion) => {
  const acciones = {
    [AccionesDocumentosClonacion.ADJUNTAR]: {
      descripcion: "Ha guardado los archivos adjuntos al documento",
      comentario: "Documento guardado",
      accion: "Se guardo los archivos adjuntos al documento",
    },
    [AccionesDocumentosClonacion.EDITAR]: {
      descripcion: "Ha editado el nombre del documento",
      comentario: "Nombre del documento editado",
      accion: "Se edito el nombre del documento",
    },
  };

  if (acciones[type]) {
    const { descripcion, comentario, accion } = acciones[type];
    await crearTrazabilidad({
      proceso: `ENTC${props.detailsRadicado.id}`,
      secuencia: props.detailsRadicado.nroRadicado,
      estado: props.detailsRadicado.estado.estado,
      nombre: auth.$state.userInfo.name,
      tramite: "Entes de Control",
      descripcion,
      comentario,
      accion,
    }).catch(() => toast.error("Ha ocurrido un error en la trazabilidad"));
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

const AdjuntarComoSalida = async (id: number) => {
  sgdeaAxios
    .patch(
      `/api/entes/cambiarTipoDocumento/${id}?enteId=${ente_id}&tipoDocumento=SALIDA`
    )
    .then((response) => {
      toast.success(
        "El soporte se ha anexado al documento de salida con éxito"
      );
      getDocuments();
    })
    .catch(() =>
      toast.error("Ha ocurrido un error al anexar al documento de salida")
    );
};

const adjuntarDocumentos = async () => {
  if (validationsWords.value) {
    toast.error("El nombre del documento debe tener como máximo 100 caracteres")
    return
  }

  const url = `/api/entes/consolidador/adjuntarSoporte/${route.params.id}`;

  // const data = listDocs.value.map((doc) => {
  //   return {
  //     idDocumento: doc.id,
  //   };
  // });

  // await Promise.all(
  //   data.map((doc) => {
  //     return sgdeaAxios
  //     .patch(url, doc)
  //   })
  // ).then(function (values) {
  //   trazabilidad(AccionesDocumentosClonacion.ADJUNTAR);
  //     toast.success("Datos guardados exitosamente");
  //     getDocuments();
  //     emit("backView", true);
  // }) .catch((error) => {
  //       toast.error("Ha ocurrido un error al adjuntar archivos");
  //     });
};

onMounted(() => {
  getDocuments();
});
</script>
