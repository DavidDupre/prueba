<template>
  <div class="tw-flex tw-items-center tw-justify-between">
    <h2 class="tw-font-bold tw-text-3xl tw-pb-3 tw-pt-2">Subtrámites comunicaciones</h2>
  </div>
  <q-card class="tw-bg-white tw-px-4">
    <div class="tw-flex tw-items-center tw-justify-between">
      <h2 class="tw-font-bold tw-text-md tw-pb-3 tw-pt-2">Listado de trámites</h2>
      <q-input outlined dense rounded v-model="search" label="Buscador" class="tw-w-[300px]"
        @update:model-value="generalFilter">
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <q-table flat :rows="filteredData" :columns="TABLE_HEADER" :row-key="'id'"
      table-header-class="text-black text-center text-h6"
      class="q-mr-md full-width tw-bg-transparent table centerColumn" rows-per-page-label="Páginas" hide-pagination
      v-model:pagination="pagination" v-model:selected="selection" :selection="isSelection">

      <template v-slot:body-cell-estado="props">
        <q-td class="text-center">
          <div :class="[
            'tw-border tw-rounded-full q-my-sm tw-max-w-max q-px-md q-py-xs',
            (!(props.row?.tiempoXVencer) || (props.row?.tiempoXVencer !== 'Vencido')) ? 'tw-bg-orange-100 tw-border-orange-400' : 'tw-bg-red-100 tw-border-red-400 tw-text-red-500'
          ]">
            {{ props.row?.estado || '-' }}
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-verDocumento="props">
        <q-td class="tw-justify-center" style="height: 100% !important;">
          <q-btn class="tw-w-auto tw-h-9 tw-inline-block" icon="visibility" flat color="primary"
            @click="assignIdDoc(props.row.id)">
            <q-tooltip>Ver Documentos</q-tooltip>
          </q-btn>
          <q-btn class="tw-w-auto tw-h-9 tw-bg-[#f2f4f5] tw-ms-3" @click="openModalAd(props.row.id)" icon="attach_file"
            flat>
            <q-tooltip>Adjuntar documentos</q-tooltip>
          </q-btn>
          <q-btn class="tw-inline-block tw-w-auto tw-h-9 tw-ml-2" flat icon="file_open" color="secondary"
            @click="navigateToPlantilla(props.row)">
            <q-tooltip>Plantilla documentos</q-tooltip>
          </q-btn>
        </q-td>
      </template>
      <template v-slot:body-cell-trazabilidad="props">
        <q-td>
          <q-btn flat color="primary" @click="getTrazabilidad()" icon="history" />
        </q-td>
      </template>


    </q-table>
    <div class="row justify-between q-mt-md" v-if="TABLE_BODY?.length > 0">
      <div class="tw-flex tw-gap-x-3 tw-items-center">
        <span>Filas</span>
        <q-select :options="[5, 25, 50, 100]" v-model:model-value="rowsPerPage" dense outlined
          @update:model-value="handleRowsPerPageChange" />
      </div>
      <q-pagination v-model="pagination.page" color="primary" :max="pagesNumber" size="md" direction-links
        boundary-links boundary-numbers @update:model-value="handlePageChange" />
      <q-btn icon="refresh" type="button" flat class="invisible" />
    </div>
  </q-card>
  <q-dialog v-model="showModalAd" class="modal-custom-dialog">
    <q-card class="tw-p-[40px]   tw-w-[800px] tw-max-w-[800px] ">
      <q-card-section class="text-h6 tw-max-w-sm tw-px-0 tw-pt-0">
        <p class=" tw-text-xl tw-text-modal-blue-main-title text-weight-bold">Adjuntar documentos</p>
      </q-card-section>
      <q-form ref="formLoad">
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <q-card-section class="tw-px-0 tw-pt-0">
            <p class="tw-text-[16px] tw-text-modal-grey-subtitle tw-font-bold tw-ml-2">Adjunte de Documentos</p>
          </q-card-section>

          <div class="tw-mt-2">
            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-12">
                <q-form ref="formFile">
                  <label class="tw-w-full">

                    <FileLoader :rules="[inputRequired]" v-model="files" multiple class="tw-w-full"
                      accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
                      :max-file-size="50 * 1024 * 1024" max-file-size-label="50" :max-files="30"
                      @rejected="rejectedFiles" />
                  </label>
                </q-form>

              </div>
            </div>
          </div>
        </q-card>

        <q-card-actions align="middle" class="q-mt-sm tw-gap-[20px]">
          <q-btn type="button" flat label="Cancelar" class="tw-h-12 text-weight-bold tw-text-md" style="width: 40%"
            color="secondary" @click="showModalAd = false" />
          <q-btn :loading="loading" type="button" flat label="Guardar"
            class="tw-h-12 bg-secondary text-weight-bold tw-text-md !tw-bg-modal-black-button" style="width: 40%"
            color="white" @click="submitFiles()" />
        </q-card-actions>

      </q-form>

    </q-card>
  </q-dialog>
  <!-- <q-dialog full-width v-model="trazaModal">
    <q-card class="q-pa-xl tw-w-[3000px]">
      <a @click="trazaModal = false" class="tw-text-primary" style="text-decoration: none;">
        <q-icon size="1.5em" name="chevron_left" color="primary" />
        <b>
          Volver
        </b>
      </a>
      <q-table flat :rows="trazabilidadData" :columns="trazabilidadColumns" row-key="proceso"
        table-header-class="text-black text-h6" class="q-mr-md full-width tw-h-full"
        v-model:pagination="paginationTut" />
    </q-card>
  </q-dialog> -->

    <q-dialog full-width v-model="trazaModal">
    <q-card class="q-pa-xl tw-w-[3000px]">
      <a @click="trazaModal = false" class="tw-text-primary" style="text-decoration: none;">
        <q-icon size="1.5em" name="chevron_left" color="primary" />
        <b>
          Volver
        </b>
      </a>
      <Trazabilidad
      :doneItems="trazabilidadData"
    />
    </q-card>
  </q-dialog>

  <q-dialog full-width v-model="modalDocs">
    <q-card class="q-pa-xl tw-w-[3000px]">
      <a @click="modalDocs = false" class="tw-text-primary" style="text-decoration: none;">
        <q-icon size="1.5em" name="chevron_left" color="primary" />
        <b>
          Volver
        </b>
      </a>
      <Table :TABLE_BODY="listDocs" :TABLE_HEADER="fileColumns" icon="download" isSecondIcon isThirdIcon
        secondIcon="delete" thirdIcon="print" :loading="loading" is-selection="none" @handleEditData="download"
        @handleSecondIcon="deleteDoc" @handleThirdIcon="print" :key-id="'id'" />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { sgdeaAxios } from "src/services";
import moment from "moment";
import { inputRequired } from 'src/helpers/validations';
import FileLoader from "src/components/FormFields/FileLoader.vue";
import { toast } from "src/helpers/toast";
import Table from "../AdjuntarDocumentosTable.vue";
import { useAuthStore } from "src/stores/auth.store";
import { AccionesDocumentos } from "../types";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import Trazabilidad from "src/pages/Expedientes/Trazabilidad/Trazabilidad.vue";

let pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 25,
})

// let paginationTut = ref({
//   sortBy: "desc",
//   descending: false,
//   page: 1,
// })

const rowsPerPage = ref(25)
const loading = ref(false)
const filteredData = ref([])
const originData = ref([])
const pagesNumber = ref(1)
const search = ref('')
const files = ref(null)
const listDocs = ref();
const vuerouter = useRouter()
const route = useRoute()
const modalDocs = ref(false)
const trazabilidadData = ref([])
const trazaModal = ref(false)
const selection = ref([])
const showModalAd = ref(false)
const nameDocument = ref()
const formFile = ref()
const idForSubmit = ref()
const auth = useAuthStore();
const idForDoc = ref()
const router = useRouter();

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
    label: "Nombre del documento",
    field: "nombre",
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
    label: "Fecha de cargue",
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

// const trazabilidadColumns = [
//   // {
//   //   name: "proceso",
//   //   label: "Proceso",
//   //   field: "proceso",
//   //   sortable: true,
//   //   align: "center",
//   // },
//   // {
//   //   name: "secuencia",
//   //   label: "Secuencia",
//   //   field: "secuencia",
//   //   sortable: true,
//   //   align: "center",
//   // },
//   {
//     name: "estado",
//     label: "Estado",
//     field: "estado",
//     sortable: true,
//     align: "center",
//   }, {
//     name: "fechaHora",
//     label: "Fecha Hora",
//     field: "fechaHora",
//     sortable: true,
//     align: "center",
//   },
//   {
//     name: "comentario",
//     label: "Comentario",
//     field: "comentario",
//     sortable: true,
//     align: "center",
//   },
//   {
//     name: "descripcion",
//     label: "Descripción",
//     field: "descripcion",
//     sortable: true,
//     align: "center",
//   },
//   {
//     name: "accion",
//     label: "Acción",
//     field: "accion",
//     sortable: true,
//     align: "center",
//   },
//   {
//     name: "tramite",
//     label: "Trámite",
//     field: "tramite",
//     sortable: true,
//     align: "center",
//   },
//   {
//     name: "cargoUsuario",
//     label: "Cargo Usuario",
//     field: "cargoUsuario",
//     sortable: true,
//     align: "center",
//   },
//   {
//     name: "detalle",
//     label: "Detalle",
//     field: "detalle",
//     sortable: true,
//     align: "center",
//   },
// ]

const props = withDefaults(defineProps<{
  TABLE_BODY: any[],
  TABLE_HEADER: any[],
  isSelection?: "none" | "single" | "multiple" | undefined;
  itemSelected?: any[],
  icon: string,
  idTramite: any,
  nodeId: any,
  detalleRadicado: any
}>(), {
  selection: "none",
  keyId: "numero",
  secondIcon: "eye",
  isSelection: "multiple",
  icon: "printer",
})

const download = async (id) => {
  const { data } = await sgdeaAxios.get<DocumentoRadicado>(
    `/radicados/consultar_documento/${id}`
  );

  if (id) {
    const nameDocument = listDocs.value.find((it) => it.nodeId === id)?.nombre;

    const byteCharacters = atob(data.base64x);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = nameDocument;

    link.click();

    URL.revokeObjectURL(blobUrl);
  }

};

const navigateToPlantilla = (rowData) => {
  router.push({
    path: `/correspondencia/detalle-plantilla/${rowData.id}`,
    state: { rowData }
  });
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
    iframe.name = 'nombre archivo'
    // iframe.style.display = 'none';
    iframe.src = blobUrl;

    document.body.appendChild(iframe);
    var doc = iframe.contentDocument || iframe.contentWindow.document;
    var titulo = doc.createElement('title')
    titulo.textContent = 'prueba'
    doc.head.appendChild(titulo);
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
      setTimeout(() => {
        document.querySelector("head title").textContent = "titulo"
      }, 500);

    };

  } catch (error) {
    toast.error('Ha ocurrido un error')
  }
}

const assignIdDoc = (id) => {
  idForDoc.value = id
  getDocuments(idForDoc.value)
}

const deleteDoc = async (id, nodeId) => {
  try {
    const response = await sgdeaAxios.delete(
      `/alfresco/deleteFile/${nodeId}`
    );

    if (response.status === 200) {
      toast.success("El documento fué eliminado correctamente");
      await getDocuments(idForDoc);
      await trazabilidad(AccionesDocumentos.ELIMINAR_DOCS);
    }
  } catch (error) {
    toast.error("Ha ocurrido un error al eliminar un documento");
  }
};

const emit = defineEmits(['update:itemSelected', 'handleRowsPerPageChange', 'handlePageChange'])

watch(selection, (newdateData) => {
  selection.value = newdateData
  emit('update:itemSelected', selection.value)
});

const getDocuments = async (id) => {
  const response = await sgdeaAxios.get<any>(
    `/correspondencia/obtenerDocs?idComunicacionMasivaId=${props.idTramite}`
  );

  if (response.status === 200) {
    const { data } = response;

    listDocs.value = data
      ?.filter((it) => it.destinatarioId === null || it.destinatarioId === id)
      .map((it) => ({
        formato: it.tipo,
        nombre: it.nombreArchivo,
        id: it.id,
        nodeId: it.nodeId,
        fecha: moment(it.fechaSubida).format("DD/MM/YYYY"),
        cargado_por: it.usuario.userName,
      }));

    loading.value = false;
    modalDocs.value = true
  }

};

onMounted(() => {
  originData.value = props.TABLE_BODY
  filteredData.value = props.TABLE_BODY

})

watch(() => props.TABLE_BODY, (newValue, oldValue) => {
  originData.value = newValue;
  filteredData.value = newValue
})

watch(() => filteredData.value, (newValue) => {
  pagesNumber.value = parseInt(filteredData.value.length / pagination.value.rowsPerPage) || 1
})

async function getTrazabilidad() {
  // const { data } = await sgdeaAxios.get(`/correspondencia/radicacion/${id}`)
  const response = await sgdeaAxios.get('/trazabilidad/obtenerPorCodProceso/' + 'CORMAS' + props.idTramite);
  if (!response?.data || response.data.length === 0) {
    trazabilidadData.value = [];
    trazaModal.value = true
    return;
  }

trazabilidadData.value = response.data
  .sort((a, b) => a.id - b.id)
  .map((item) => {
    const procesoNumero = item.proceso?.replace('CORMAS', '');

    const nuevaAccion = item.accion?.includes(item.secuencia)
      ? item.accion.replace(item.secuencia, procesoNumero)
      : item.accion;

    return {
      ...item,
      fechaHora: moment(item.fechaHora).format('DD/MM/YYYY hh:mm'),
      canal: "Comunicación",
      tramite: "Comunicación Masiva",
      accion: nuevaAccion,
    };
  });

  trazaModal.value = true
}


const generalFilter = () => {
  filteredData.value = originData.value.filter(obj => {
    // Convertimos el objeto a un array de sus valores
    var valores = Object.values(obj);
    var concatArray = [];
    valores.forEach(element => {
      if (typeof element == 'object' && element != null) {
        var newArr = Object.values(element);
        concatArray = [...concatArray, ...newArr];
      }
    });
    valores = [...valores, ...concatArray];
    // Buscamos si el string de búsqueda coincide con alguno de los valores
    return valores.some(valor => {
      if (valor != null) {
        if (typeof valor == 'object') {
          for (const propiedad in valor) {
            const regexEspacioDoble = /\s\s/;
            var dataFinal = valor[propiedad].toString().toLowerCase().trim().replace(regexEspacioDoble, " ");
            return dataFinal.includes(search.value.toLowerCase());
          }
        }
        if (typeof valor === 'string') {
          const regexEspacioDoble = /\s\s/;
          let dataFinal = valor.toLowerCase().trim().replace(regexEspacioDoble, " ");
          const momentFecha = moment(valor, 'DD-MM-YYYY HH:mm:ss', true);
          if (momentFecha.isValid()) {
            dataFinal = momentFecha.format('DD/MM/YYYY');
          }
          return dataFinal.includes(search.value.toLowerCase());
        }
      }
      return false;
    });
  });

}

const rejectedFiles = (error) => {
  if (error.some((it) => it.failedPropValidation === "max-file-size")) {
    toast.error("El archivo que está intentando importar supera los 50MB, para poder importar el archivo debe tener un tamaño menor, por favor verifique e intente nuevamente.");
  }
  if (error.some((it) => it.failedPropValidation === "max-files")) {
    toast.error("Solo se puede adjuntar 30 archivo.");
  }
  if (error.some((it) => it.failedPropValidation === "accept")) {
    toast.error(
      "Formato inválido, los formatos permitidos son (pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)."
    );
  }
};

const handleRowsPerPageChange = (event: any) => {
  emit("handleRowsPerPageChange", event);
};

const handlePageChange = (event: any) => {
  emit("handlePageChange", event);
};

const submitFiles = async () => {
  if (await formFile.value.validate()) {

    const formdata = new FormData();
    for (let i = 0; i < files.value.length; i++) {
      formdata.append("anexos", files.value[i]);
    }

    formdata.append("idRadicado", props.nodeId);
    formdata.append("descripcionRadicado", "test");
    formdata.append("destinatarioId", idForSubmit.value);

    try {
      const response = await sgdeaAxios.post(
        `api/v1/integracion/alfresco/agregarAnexos/ComunicacionMasiva?comunicacionMasivaId=${props.idTramite}&usuarioId=${auth.$state.userInfo.userid}&es_devolucion=false&destinatarioId=${idForSubmit.value}`,
        formdata,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "accept": "*",
            "Content-Type": "multipart/form-data",
            "Content-Transfer-Encoding": "BINARY"
          },
        }
      );
      if (response.status === 200) {
        toast.success("Los documentos fueron adjuntados correctamente");
        files.value = [];
        await trazabilidad('AGREGAR_DOCS');
        showModalAd.value = false
      }
    } catch (error) {
      toast.error("Ha ocurrido un error");
    }
  }

}

const trazabilidad = async (type) => {
  const acciones = {
    [AccionesDocumentos.ELIMINAR_DOCS]: {
      descripcion: "Se eliminó un documento de soporte del radicado",
      comentario: "Se eliminó un documento de soporte del radicado",
      accion: "Se eliminó un documento de soporte del radicado",
    },
    'AGREGAR_DOCS': {
      descripcion: "Se agregaron documento(s) de soporte al destinatario N°" + idForSubmit.value,
      comentario: "Se agregaron documento(s) de soporte al destinatario N°" + idForSubmit.value,
      accion: "Se agregaron documento(s) de soporte a un destinatario del tramite",
    },
  };

  if (acciones[type]) {
    const { descripcion, comentario, accion } = acciones[type];
    try {
      await crearTrazabilidad({
        proceso: `COR${props.detalleRadicado.idTramite}`,
        secuencia: props.detalleRadicado.idRadicado,
        estado: props.detalleRadicado.estadoProceso,
        descripcion,
        comentario,
        nombre: auth.$state.userInfo.name,
        tramite: props.detalleRadicado.tipoTramite,
        accion,
      });
    } catch (error) {
      console.error(error);
    }
  }
};

const openModalAd = (id) => {
  showModalAd.value = true
  idForSubmit.value = id

}

watch(rowsPerPage, (value) => {
  pagination.value.rowsPerPage = value;
  pagesNumber.value = parseInt(filteredData.value.length / pagination.value.rowsPerPage) || 1
});

watch(selection, (newdateData) => {
  selection.value = newdateData;
  emit("update:itemSelected", selection.value);
})


</script>

<style>
.centerColumn div table thead tr th {
  text-align: center !important;
}
</style>
