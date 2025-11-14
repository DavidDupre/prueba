<template>
  <q-form>
    <section>
      <q-card class="tw-flex tw-p-2 tw-gap-10">
        <q-btn :color="typeDoc === 'De Entrada' ? 'primary' : 'grey-7'" outline icon="info" label="De entrada" @click="changeDocs('De Entrada')" />
        <q-btn :color="typeDoc === 'De gestión' ? 'primary' : 'grey-7'" outline icon="info" label="De gestión" @click="changeDocs('De gestión')" />
        <q-btn :color="typeDoc === 'De salida' ? 'primary' : 'grey-7'" outline icon="info" label="De salida" @click="changeDocs('De salida')" />
      </q-card>
      <q-card class="tw-p-6 q-mt-md">
        <div class="q-mt-sm">
          <div class="row tw-justify-between">
            <div v-if="isDevolucion" class="cols-12 full-width">
              <span class="tw-text-label"> {{segundaDevolucion ? 'Adjuntar archivo encriptado' : 'Adjuntar documento al comunicado'}}</span>
              <FileLoader
              v-if="!segundaDevolucion"
              class="tw-w-full"
              multiple
              v-model:model-value="newFileInput"
              accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
              :max-file-size="50 * 1024 * 1024"
              :max-files="30"
              max-file-size-label="50"
              @rejected="rejectedFiles"
              />
              <FileLoader
              v-else
              class="tw-w-full"
              v-model:model-value="newFileInput"
              accept-file="pdf"
              :max-file-size="10 * 1024 * 1024"
              :max-files="1"
              max-file-size-label="10"
              @rejected="rejectedFilesTwo"
              />
              <center class="tw-mt-4">
                <q-btn label="Cancelar" @click="$emit('backView')" class="!tw-px-6 !tw-py-2 tw-me-4 tw-w-56" />
                <q-btn label="Guardar" color="secondary" @click="handleUploadFile" class="!tw-px-6 !tw-py-2 tw-w-56" />
              </center>

            </div>
            <p class="tw-text-lg text-weight-bold q-mx-lg  tw-mt-6">
              Listado de Documentos Cargados
            </p>
            <div v-if="activeDelete"
              class="row tw-gap-10 tw-items-center q-ml-lg">
              <p class="tw-text-label tw-text-sm">Cantidad seleccionada: <b>{{ listDocSelect.length }}</b> </p>
              <q-btn label="Eliminar" icon="delete" color="red" @click="deleteDocModal = true"
                class="tw-w-32 tw-h-10" />
            </div>
            <q-select v-model="selectDoc" emit-value map-options outlined dense use-input hide-selected class="row tw-items-center"
              fill-input label="Seleccione" :options="opsSelectDoc" @filter="docsOptionsFilterFn" @input-value="addValue">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin resultados
                    </q-item-section>
                  </q-item>
                </template>
            </q-select>
          </div>
          <Table :visualize="props.visualize" ref="tableDoc" :TABLE_BODY="listDocs" :TABLE_HEADER="HEADER_DOCUMENTS"
            @update:item-selected="itemSelected" icon="download" isSecondIcon secondIcon="print" :loading="loading"
            :is-selection="onlyReadUser ? 'none' : 'multiple'" @handleEditData="download" @handleSecondIcon="print"
            :key-id="'id'" />
        </div>
        <!-- <DocumentosRelacionados :list-docs="listDocs" :download="download" /> -->
      </q-card>
    </section>

    <Modal v-model="deleteDocModal" title="Confirmación" text="¿Está seguro de eliminar los documentos seleccionados?"
      :is-success="false" cancel-button text-button-cancel="No" text-button="Si" @handleAccept="eliminarDoc" />
  </q-form>
</template>

<script lang="ts" setup>
//@ts-ignore
import Modal from "src/components/Modal/Modal.vue";
import { fourthFormatDate } from "src/helpers/formtDate";
import { toast } from "src/helpers/toast";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { DocsBD, DocumentoRadicado } from "src/interfaces";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "stores/auth.store";
import { onMounted, ref, watch } from 'vue';
import { useRoute } from "vue-router";
import { HEADER_DOCUMENTS } from ".";
import Table from "./Table.vue";
import FileLoader from 'src/components/FormFields/FileLoader.vue';

const props = withDefaults(defineProps<{
  detallePqrd: any,
  finished: boolean,
  visualize?: (nodeId, list) => {},
  isDevolucion: boolean,
  segundaDevolucion: boolean,
  onlyReadUser: boolean
}>(), {
  onlyReadUser: false
})

const { getUserInfo } = useAuthStore();
const auth = useAuthStore()

const emit = defineEmits(['download', 'cleanDocs', 'updateTotalList', 'findDocs', 'loadTrue', 'changeDocType', 'update:detallePqrd', 'update:finished', 'backView'])
const listDocSelect = ref([])
const deleteDocModal = ref(false)
const activeDelete = ref(false)
const listDocs = ref([])
const copyListDocs = ref([])
const listDocsFilter = ref([])
const filterListDocs = ref([])
const loading = ref(true)
const nameDocument = ref()
const tableDoc = ref()
const userInfo = ref()
const dataPqrd = ref<any>({})
const newFileInput = ref([])
const typeDoc = ref('De salida')
const opsSelectDoc = ref([])
const selectDoc = ref()

const route = useRoute()
onMounted(async () => {
  userInfo.value = await getUserInfo();
  getDocuments();
  await loadCaseData()
})

async function loadCaseData() {
  try {
    const idPqrd = route.params.id || props.detallePqrd.id;
    const data = await sgdeaAxios.get(`/pqrd/buscarCaso?idCaso=${idPqrd}&userId=${auth.$state.userInfo.userid}`);
    dataPqrd.value = { ...data.data }
  } catch (error) {
    console.error(error);
  }
}

watch(() => props.finished, (value) => {

  if (value) {
    getDocuments();
    value = false;
    tableDoc.value.cleanSelect();
    emit('update:finished', false)
  }
});

watch(() => props.detallePqrd, (value) => {
  if (value) {
    getDocuments();
    tableDoc.value.cleanSelect();
  }
});

const getDocuments = async () => {
  loading.value = true;
  listDocs.value = [];

  if (!props?.detallePqrd?.nodeID) return;

  const { data: files }: { data: DocsBD[] } = await sgdeaAxios.get(
    `/pqrd/obtenerDocs?idPqrd=${props.detallePqrd.id}`
  );

  emit('updateTotalList', files);

  const allDocs = files;

  listDocs.value = allDocs
    .map((it) => {
      return {
        formato: it.nombre.substring(it.nombre.lastIndexOf('.') + 1),
        nombre: it.nombre,
        fecha: fourthFormatDate(it.fechaCargue),
        cargado_por: (it && it.usuario)
          ? it.usuario?.firstname + ' ' + it.usuario?.lastname
          : 'Administrador',
        tipo: it.tipo ? it.tipo : 'De gestión',
        id: it.nodeId,
        es_devolucion: it.es_devolucion
      };
    })
    .filter(it => !it.tipo.includes("Respuesta"));

  if (props.detallePqrd?.numeroAprobaciones > 0 && props.detallePqrd?.refRadicadoSalida != null) {
    const file = files.find((item) => item.nombre.includes(props.detallePqrd?.refRadicadoSalida));
    if (file) {
      const Datap = {
        formato: "application/pdf",
        nombre: file.nombre,
        fecha: fourthFormatDate(file['fechaCargue']),
        cargado_por: (file && file.usuario)
          ? file.usuario?.firstname + ' ' + file.usuario?.lastname
          : 'Administrador',
        tipo: file ? file.tipo : 'De gestión',
        id: file.nodeId,
        es_devolucion: file?.es_devolucion || false
      };
      listDocs.value = [...listDocs.value, Datap];
    }
  }

  // if (props.isDevolucion) {
  //   listDocs.value = listDocs.value.filter((item) => item.es_devolucion);
  // }

  copyListDocs.value = listDocs.value;
  //changeDocs('De salida');

  setTimeout(() => {
    loading.value = false;
  }, 500);

  tableDoc.value.cleanSelect();
};


async function handleUploadFile() {
  const files: File[] | File = newFileInput.value;

  if (Array.isArray(files) && files.length === 0 || files === null) {
    toast.error("Debe seleccionar un archivo y/o seleccionar una opción.")
    return;
  }

  const formData = new FormData();
  for (const file of Array.isArray(files) ? files : [files]) {
    formData.append("anexos", file);
  }

  formData.append("idRadicado", props.detallePqrd.nodeID);
  formData.append("descripcionRadicado", 'De salida');
  formData.append("usuarioId", auth.$state.userInfo.userid)
  try {
    const { data } = await sgdeaAxios.post("/api/v1/integracion/alfresco/agregarAnexos?es_devolucion=true", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        pqrd: route.params.id,
      }
    });


    if (data) {
      toast.success('Se realizó el cargue correctamente')
      await crearTrazabilidad({
        proceso: "PQRD" + props.detallePqrd.id,
        secuencia: props.detallePqrd.idRadicado,
        estado: props.detallePqrd.estado.estado,
        descripcion: "Se ha adjuntado un documento a la PQRD",
        comentario: 'Adjunto',
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} añadió un documento a la PQRD`,
        tramite: props.detallePqrd.informacionSolicitud.tipologiaEntity.id == 7 ? 'PQRD Express' : 'PQRD',
      })
      newFileInput.value = [];
      emit('findDocs')
      getDocuments()
    }
  } catch (error) {
    toast.error("Está intentando cargar el mismo archivo más de una vez")
  }

}

const itemSelected = (items) => {

  items = items.filter((item) => item.nombre !== props.detallePqrd.idRadicado + '.pdf')

  emit('changeDocType', items);

  if (items.length > 0 && !items.find((item) => item.tipo == 'De Entrada')) {
    activeDelete.value = true
  } else {
    activeDelete.value = false
  }
  listDocSelect.value = items
}

const rejectedFiles = (error) => {
  if (error.some((it) => it.failedPropValidation === 'max-file-size')) {
    toast.error('El peso permitido es hasta 50MB.')
  }
  if (error.some((it) => it.failedPropValidation === 'max-files')) {
    toast.error('Solo se pueden adjuntar 30 archivos.')

  }
  if (error.some((it) => it.failedPropValidation === 'accept')) {
    toast.error('Formato inválido, los formatos permitidos son (pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg).')
  }
}

const rejectedFilesTwo = (error) => {
  if (error.some((it) => it.failedPropValidation === 'max-file-size')) {
    toast.error('El peso permitido es hasta 10MB.')
  }
  if (error.some((it) => it.failedPropValidation === 'max-files')) {
    toast.error('Solo se puede adjuntar 1 archivo.')

  }
  if (error.some((it) => it.failedPropValidation === 'accept')) {
    toast.error('Formato inválido, los formatos permitidos son (pdf).')
  }
}

const download = async (id) => {
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

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = nameDocument.value;

    link.click();

    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    toast.error('Ha ocurrido un error')
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
  } finally {
  }
}

const eliminarDoc = async () => {
  loading.value = true
  listDocs.value = []
  try {
    const docsSelected = listDocSelect.value.map(doc => doc.id);
    await sgdeaAxios.delete(`/pqrd/eliminarDocumentos`, { data: docsSelected });
    const documentos = listDocSelect.value.map(doc => doc.nombre).join(", ");
    await crearTrazabilidad({
        proceso: `PQRD${dataPqrd.value.id}`,
        secuencia: dataPqrd.value.idRadicado,
        estado: dataPqrd.value.estado.estado,
        descripcion: `Usuario: ${auth.$state.userInfo.name} Documentos: ${documentos}`,
        comentario: "Eliminado",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} ha eliminado un documento PQRD`,
        tramite: dataPqrd.value.informacionSolicitud.tipologiaEntity.id == 7 ? 'PQRD Express' : 'PQRD',
      })
    // Si todas las solicitudes de eliminación fueron exitosas
    listDocSelect.value = [];
    activeDelete.value = false;
    toast.success('Los documentos seleccionados han sido eliminados');
    emit('findDocs')
    getDocuments();
  } catch (error) {
    // Manejar errores
    listDocSelect.value = [];
    activeDelete.value = false;
    toast.error('Hubo un error, inténtelo de nuevo');
    emit('findDocs')
    getDocuments();
  }
}

watch(
  () => selectDoc.value,
  async (value) => {
    if (value) {
        const doc = listDocs.value.find(it => {
          // @ts-ignore
          return it.nombre.includes(value) || it.id === value;
        });

        if (doc) {
          listDocs.value = listDocs.value.filter(it => it.id === doc.id)
        }
      } else {
        listDocs.value = listDocsFilter.value
      }
    }
);

const changeDocs = async(type: string) => {
  typeDoc.value = type
  listDocs.value = copyListDocs.value.filter(it => it.tipo === type)
  listDocsFilter.value = listDocs.value
  filterListDocs.value = listDocs.value.map(({ nombre, id }) => { return { label: nombre, value: id } }).sort((a, b) => a.label.localeCompare(b.label));

  if (listDocs.value.length && (listDocs.value[0].formato.toLowerCase() == 'application/pdf' || listDocs.value[0].formato.toLowerCase() === 'pdf')) {
    await props.visualize(listDocs.value[0].id, copyListDocs.value)
  }

}

const docsOptionsFilterFn = (val: string, update: any) => {
  if (val === '') {
    update(() => {
      opsSelectDoc.value = filterListDocs.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    opsSelectDoc.value = filterListDocs.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
};

const addValue = (value) => {
  selectDoc.value = value
}

</script>
