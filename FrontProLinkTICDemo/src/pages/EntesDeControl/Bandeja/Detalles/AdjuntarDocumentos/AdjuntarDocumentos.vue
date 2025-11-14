<template>
  <div class="row q-col-gutter-md q-pb-md q-px-md tw-mt-5">
    <div class="col row">
      <h3 class="tw-text-xl text-bold">
        Adjuntar Documentos
      </h3>
    </div>

    <div class="cols-12 full-width">
      <q-form ref="formFile">
        <span class="tw-text-label">Adjunte los Documentos</span>
        <FileLoader class="tw-w-full" multiple v-model:model-value="files"
          accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg" :max-file-size="50 * 1024 * 1024"
          :max-files="30" max-file-size-label="50" @rejected="rejectedFiles" ref="documentosForm"
          detailsMsgFile="Puede adjuntar (30) archivo(s) cada uno con un tamaño permitido de 50 MB en cualquiera de las siguientes extensiones (pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)"
          :isShowDetailMsgFile="true" />
      </q-form>
    </div>
  </div>

  <q-card class="col-12 tw-mx-4">
    <q-expansion-item  dense default-opened expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
          Lista de Anexos
        </h3>
      </template>
      <q-card class="tw-p-6">
          <Table :TABLE_HEADER="fileColumns" :TABLE_BODY="listDocs" :btnDelete="true" @deleteDoc="deleteDoc" @downloadDoc="download" @printDoc="print" :loading="loading"  @AdjuntarComoSalida="AdjuntarComoSalida" :rol="rol"/>
      </q-card>
    </q-expansion-item>
  </q-card>

  <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5" v-if="files?.length">
    <q-btn class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]" no-caps style="border: 1px solid #2c3948" label="Cancelar" @click="cancelModal = true" />
    <q-btn class="tw-w-1/4 tw-h-11 bg-primary text-white" type="submit" label="Guardar" @click="handleFileUpload()"/>
  </div>
  <Modal v-model="cancelModal" title="¡Espera un momento!" :is-success="false" @handleAccept="emit('backView', true)"
    cancel-button textButtonCancel="No" textButton="Si"
    text="Al cancelar la acción perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
    type="button" />
</template>

<script lang="ts" setup>
import FileLoader from "src/components/FormFields/FileLoader.vue";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { ref, onMounted, watch, computed } from "vue";
import { useAuthStore } from "src/stores/auth.store";
import { DocumentoRadicado } from "src/interfaces";
import Table from "./AdjuntarDocumentosTable.vue";
import Modal from "components/Modal/Modal.vue";
import { AccionesDocumentos } from "../types";
import { toast } from "src/helpers/toast";
import { sgdeaAxios } from "src/services";
import { useRoute } from "vue-router";
import moment from "moment";

const route = useRoute();

const props = defineProps<{ type: string; detailsRadicado: any; rol: string; }>();
const emit = defineEmits(["findDocs", "backView"]);

const auth = useAuthStore();

const ente_id = route.params.id;

const isGestionador = ref(false);
const isAsignador = ref(false);
const cancelModal = ref(false);
const listDocsCopy = ref([]);
const nameDocument = ref();
const loading = ref(false);
const listDocs = ref([]);
const files = ref([]);
const formFile = ref();
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

const rejectedFiles = (error) => {
  if (error.some((it) => it.failedPropValidation === "max-file-size")) {
    toast.error("El peso permitido es hasta 50MB.");
  }
  if (error.some((it) => it.failedPropValidation === "max-files")) {
    toast.error("Solo se pueden adjuntar 30 archivos.");
  }
  if (error.some((it) => it.failedPropValidation === "accept")) {
    toast.error("Formato inválido, los formatos permitidos son (pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg).");
  }
  if (error.some((it) => it.failedPropValidation === "duplicate")) {
    toast.error("No se pueden subir archivos duplicados.");
  }
};

const validateRolGestionador = () => {
  return props.rol.toLowerCase().includes('gestionador');
}
const validateRolAsignador = () => {
  return props.rol.toLowerCase().includes('asignador');
}

const isRadicadoClonado = computed(() => props.detailsRadicado.clonado && auth.$state.userInfo.role === "Gestionador")
const isConsolidador = computed(() => props.detailsRadicado.clonado && props.detailsRadicado.consolidadorId === auth.$state.userInfo.userid && auth.$state.userInfo.role === "Gestionador")

const getDocuments = () => {
  loading.value = true;
  const asignacion = props.detailsRadicado.asignaciones.find(asignacion=> asignacion.idGestionador === auth.$state.userInfo.userid ) ;
  const url = isRadicadoClonado.value && !isConsolidador.value ? `api/entes/clonacion/getDocumentos/${asignacion.idAsignacion}` : `/api/entes/getDocumentosByEnteControlId/${props.detailsRadicado.id}`;

  return sgdeaAxios.get(url)
    .then((response) => {

      let newData = response.data?.map((doc) => {
        if (doc.usuario.id === auth.$state.userInfo.userid) {
          if (doc.tipoArchivo.toLowerCase().includes("entrada_r")) {
            doc.tipoArchivo = "r";
          } else if (doc.tipoArchivo.toLowerCase().includes("entrada")) {
            doc.tipoArchivo = "De entrada";
          } else if (doc.tipoArchivo.toLowerCase().includes("salida")) {
            doc.tipoArchivo = "De salida";
          } else if (doc.tipoArchivo.toLowerCase().includes("gestion")) {
            doc.tipoArchivo = "De gestión";
          }

          return {
            tipo: doc.tipoArchivo,
            nombre: doc.nombreArchivo,
            id: doc.id,
            nodeId: doc.nodeId,
            fecha: moment(doc.fechaCargue).format("DD/MM/YYYY HH:mm"),
            cargado_por: doc.usuario.userName,
            showBotonAdjuntar: (isConsolidador.value || !props.detailsRadicado.clonado)
            && auth.$state.userInfo.role === "Gestionador" &&  doc.tipoArchivo !== 'De salida'
          }
        }
      });

      newData = newData.filter(Boolean)
      listDocsCopy.value = newData
      listDocs.value = newData.filter(doc => doc?.tipo != 'r');

      return response;
    })
    .finally(() => loading.value = false);
};

const trazabilidad = async (type) => {
  const acciones = {
    [AccionesDocumentos.ELIMINAR_DOCS]: {
      descripcion: `Usuario: ${auth.$state.userInfo.name}, Ha eliminó un documento de soporte del radicado`,
      comentario: "Documento eliminado",
      accion: "Se eliminó un documento de soporte del radicado",
    },
    [AccionesDocumentos.AGREGAR_DOCS]: {
      descripcion: `Usuario: ${auth.$state.userInfo.name}, Ha agregado documento(s) de soporte al radicado`,
      comentario: "Documento agregado",
      accion: "Agregado documento(s) de soporte al tramite",
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
    })
      .catch(() => toast.error("Ha ocurrido un error en la trazabilidad"));
  }
};

const print = (id) => {
  const url = `/radicados/consultar_documento/${id}`;
  if (id) nameDocument.value = listDocs.value.find((it) => it.id === id)?.nombre;

  sgdeaAxios.get<DocumentoRadicado>(url).then(({ data }: any) => {
    const byteCharacters = atob(data.base64x);
    let byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);

    let iframe = document.createElement("iframe");
    iframe.name = data.name;
    iframe.src = blobUrl;
    document.body.querySelector('#load-docs').appendChild(iframe);

    iframe.onload = function () {
      iframe.contentWindow.print();
      document.querySelector("head title").textContent = data.name;
    };
  })
    .catch((error) => {
      toast.error("Ha ocurrido un error al cargar el documento")
    });
};

const download = (id: string, name: string) => {
  const url = `/radicados/consultar_documento/${id}`
  sgdeaAxios.get(url).then((response) => {
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
    .catch(() => toast.error("Ha ocurrido un error al descargar"))
};

const deleteDoc = (id: string) => {
  let nodeId = listDocs.value.find((it) => it.id === id)?.nodeId;

  const url = `/api/entes/deleteFileEntesControl/${nodeId}`;
  sgdeaAxios.delete(url).then(async (response) => {
    toast.success("El documento fué eliminado correctamente");

    getDocuments();
    await trazabilidad(AccionesDocumentos.ELIMINAR_DOCS);
  })
    .catch(() => {
      toast.error("Ha ocurrido un error al eliminar un documento");
    })
};
const AdjuntarComoSalida = async (id: number) => {
   sgdeaAxios.patch(`/api/entes/cambiarTipoDocumento/${id}?enteId=${ente_id}&tipoDocumento=SALIDA`).then((response) => {
    toast.success("El soporte se ha anexado al documento de salida con éxito");
    getDocuments();
  });

};

const handleFileUpload = () => {

  if (formFile.value.validate()) {
    const id = props.detailsRadicado.id;
    const tipoDocumento = isGestionador.value ? "SALIDA" : "ENTRADA";
    const headersBinary = {
      headers: {
        "Content-Type": "multipart/form-data",
        "Content-Transfer-Encoding": "BINARY",
        "Access-Control-Allow-Origin": "*",
        "accept": "*",
      },
    };

    const formdata = new FormData();
    for (let i = 0; i < files.value?.length; i++) {
      formdata.append("files", files.value[i]);
    }

    const query = `?user=${auth.$state.userInfo.userid}&tipoDocumento=${tipoDocumento}`;
    const asignacion = props.detailsRadicado.asignaciones.find(asignacion=> asignacion.idGestionador === auth.$state.userInfo.userid )
    const url =  props.detailsRadicado.clonado && !isConsolidador.value ?  `/api/entes/clonacion/adjuntarDocumentos/${asignacion.idAsignacion}?user=${auth.$state.userInfo.userid}` : `/api/entes/adjuntarDocumentos/${id}${query}`


    sgdeaAxios.post(url, formdata, headersBinary).then(async (response) => {
      response.data?.forEach(element => {
        if(element?.status === "FAIL") toast.error(`El documento "${element?.name}" ya ha sido cargado`);
      });
      if(response.data?.some(element => element?.status === "CREATED")) toast.success("Datos guardados exitosamente");
      getDocuments()
      await trazabilidad(AccionesDocumentos.AGREGAR_DOCS);
    }).catch(() => toast.error("Error al cargar documentos"))
    .finally(() => files.value = []);

  }
};

watch(
  () => files.value,
  (newValue) => {
    if (!newValue || newValue?.length === 0) return;

    return newValue.forEach((file) => {
      const findDoc = listDocsCopy.value?.find((doc) => doc.nombre === file.name);
      if (findDoc) {
        toast.error(`El documento "${findDoc.nombre}" ya ha sido cargado`);
        files.value = files.value.filter((it) => it.name !== findDoc.nombre);
      }
    });
  }
);

onMounted(() => {
  getDocuments();
  isGestionador.value = validateRolGestionador();
  isAsignador.value = validateRolAsignador();
});
</script>
