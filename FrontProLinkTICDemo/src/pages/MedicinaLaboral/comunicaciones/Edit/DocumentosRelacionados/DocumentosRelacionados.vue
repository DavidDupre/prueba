<template>
  <q-form>
    <section>
      <q-card class="tw-flex tw-p-2 tw-mt-4 tw-gap-10">
        <q-btn :color="typeDoc === 'De entrada' ? 'primary' : 'grey-7'" outline icon="info" label="De entrada"
          @click="changeDocs('De entrada')" />
        <q-btn :color="typeDoc === 'De soporte' ? 'primary' : 'grey-7'" outline icon="info" label="De soporte"
          @click="changeDocs('De soporte')" />
        <q-btn :color="typeDoc === 'De salida' ? 'primary' : 'grey-7'" outline icon="info" label="De salida"
          @click="changeDocs('De salida')" />
      </q-card>
      <q-card class="tw-p-6 q-mt-md">
        <div class="q-mt-sm">
          <div class="row tw-justify-between">
            <p class="tw-text-lg text-weight-bold q-mx-lg">
              Listado de documentos cargados
            </p>
            <!-- <div
              v-if="activeDelete && (auth.$state.userInfo.role == 'Administrador de Trámite' || auth.$state.userInfo.role == 'Administrador de Master' || auth.$state.userInfo.role == 'Asignador Responsable' || auth.$state.userInfo.role == 'Revisor' || auth.$state.userInfo.role.includes('Gestionador'))"
              class="row tw-gap-10 tw-items-center q-ml-lg">
              <p class="tw-text-label tw-text-sm">Cantidad seleccionada: <b>{{ listDocSelect.length }}</b> </p>
              <q-btn label="Eliminar" icon="delete" color="red" @click="deleteDocModal = true"
                class="tw-w-32 tw-h-10" />
            </div> -->
            <q-select v-model="selectDoc" emit-value map-options outlined dense use-input hide-selected
              class="row tw-items-center" fill-input label="Seleccione" :options="opsSelectDoc"
              @filter="docsOptionsFilterFn" @input-value="addValue">
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
            is-selection="multiple" @handleEditData="download" @handleSecondIcon="print" :key-id="'id'" />
        </div>
      </q-card>
    </section>

    <Modal v-model="deleteDocModal" title="Confirmación" text="¿Está seguro de eliminar los documentos seleccionados?"
      :is-success="false" cancel-button text-button-cancel="No" text-button="Si" @handleAccept="eliminarDoc" />
  </q-form>
</template>

<script lang="ts" setup>
//@ts-ignore
import Modal from "src/components/Modal/Modal.vue";
import { toast } from "src/helpers/toast";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { DocumentoRadicado, Medicina } from "src/interfaces";
import { sgdeaAxios } from "src/services";
import { useLoadingStore } from "src/stores/loading.store";
import { useAuthStore } from "stores/auth.store";
import { onMounted, ref, watch } from 'vue';
import { HEADER_DOCUMENTS } from "./index";
import Table from "./Table.vue";
import moment from "moment";


const props = withDefaults(defineProps<{
  detalleML: Medicina,
  finished: boolean,
  visualize?: (id, list, action) => {},
}>(), {
})

const { getUserInfo } = useAuthStore();
const auth = useAuthStore()
const emit = defineEmits(['download', 'cleanDocs', 'findDocs', 'loadTrue', 'changeDocType', 'update:detalleML', 'update:finished', 'showUpload'])
const listDocSelect = ref([])
const deleteDocModal = ref(false)
const activeDelete = ref(false)
const listDocs = ref([])
const loading = ref(true)
const nameDocument = ref()
const tableDoc = ref()
const userInfo = ref()
const dataPqrd = ref<any>({})
const typeDoc = ref('')
const copyListDcos = ref([])
const selectDoc = ref()
const opsSelectDoc = ref([])
const filterListDocs = ref([])
const listDocsFilter = ref([])

onMounted(async () => {
  userInfo.value = await getUserInfo();
  getDocs()
})

watch(() => props.finished, (value) => {
  if (value) {
    getDocs()
    value = false;
    tableDoc.value.cleanSelect();
    emit('update:finished', false)
  }
});

watch(() => props.detalleML, (value) => {
  if (value) {
    getDocs();
    tableDoc.value.cleanSelect();
  }
});

watch(
  () => selectDoc.value,
  (value) => {
    if (value === 'Todos' || !value) {
      listDocs.value = [...listDocsFilter.value];
    } else {
      const doc = listDocsFilter.value.find(it => it.id === value);
      listDocs.value = doc ? [doc] : [];
    }
  }
);

const docsOptionsFilterFn = (val: string, update: any) => {
  const baseOptions = filterListDocs.value;
  if (val === '') {
    update(() => {
      opsSelectDoc.value = baseOptions.length > 0
        ? [{ label: 'Todos', value: 'Todos' }, ...baseOptions]
        : [];
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    const filtered = baseOptions.filter(v =>
      v.label.toLowerCase().includes(needle)
    );
    opsSelectDoc.value = filtered.length > 0
      ? [{ label: 'Todos', value: 'Todos' }, ...filtered]
      : [];
  });
};

const changeDocs = async (type: string) => {
  typeDoc.value = type
  listDocs.value = copyListDcos.value.filter(it => it.tipo === type)
  listDocsFilter.value = listDocs.value
  filterListDocs.value = listDocs.value.map(({ nombre, id }) => { return { label: nombre, value: id } }).sort((a, b) => a.label.localeCompare(b.label));
  props.visualize(listDocs.value[0]?.nodeId, copyListDcos.value.filter(e => e.formato === 'pdf'), false)
  selectDoc.value = listDocs.value.length > 0 ? 'Todos' : null;

  if (type === 'De soporte') emit('showUpload', true)
  else emit('showUpload', false)
}

const addValue = (value) => {
  selectDoc.value = value
}

async function getDocs() {
  try {
    loading.value = true
    listDocs.value = []
    const { data: files } = await sgdeaAxios.get(`/medicina/getAnexosCargados/${props.detalleML?.id}`);
    listDocs.value = files.listaAnexos.map((it) => {
      return {
        formato: it.nombreAnexo.split('.').pop(),
        nombre: it.nombreAnexo.split('.').shift(),
        tipo: `De salida`,
        fecha: it.fecha,
        cargado_por: it.cargadoPor.trim(),
        id: it.nodeIdAnexo,
        nodeId: it.nodeIdAnexo,
      }
    })
    copyListDcos.value = listDocs.value
    changeDocs('De entrada')
    opsSelectDoc.value = listDocs.value.length > 0
  ? [
      { label: 'Todos', value: 'Todos' },
      ...listDocs.value.map(({ nombre, id }) => ({ label: nombre, value: id }))
        .sort((a, b) => a.label.localeCompare(b.label))
    ]
  : [];

    setTimeout(() => {
      loading.value = false
    }, 500);
    tableDoc.value.cleanSelect();
  } catch (error) {
    console.error(error)
  }
}

const itemSelected = (items) => {
  items = items.filter((item) => item.nombre !== props.detalleML.idRadicado + '.pdf')
  emit('changeDocType', items);
  if (items.length > 0 && !items.find((item) => item.tipo == 'De Entrada')) {
    activeDelete.value = true
  } else {
    activeDelete.value = false
  }
  listDocSelect.value = items
}

const download = async (id) => {
  try {
    const { data } = await sgdeaAxios.get<DocumentoRadicado>(
      `/radicados/consultar_documento/${id}`
    );
    if (id) {
      const doc = listDocs.value.find((it) => it.id === id);
      nameDocument.value = doc?.nombre;
      const extension = doc?.formato ? `.${doc.formato}` : '';
      const fileName = `${nameDocument.value}${extension}`;

      const mimeTypes = {
        pdf: 'application/pdf',
        doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        xls: 'application/vnd.ms-excel',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        txt: 'text/plain',
        csv: 'text/csv',
      };
      const mimeType = mimeTypes[doc?.formato?.toLowerCase()] || 'application/octet-stream';

      const byteCharacters = atob(data.base64x);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;

      link.click();

      URL.revokeObjectURL(blobUrl);
    }
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
    // Utilizar Promise.all para esperar todas las solicitudes de eliminación
    await Promise.all(listDocSelect.value.map(async (el) => {
      const data = await sgdeaAxios.delete<any>(`/alfresco/deleteFile/${el.id}`);
      await crearTrazabilidad({
        proceso: `PQRD${dataPqrd.value.id}`,
        secuencia: dataPqrd.value.idRadicado,
        estado: dataPqrd.value.estado.estado,
        descripcion: "Se ha eliminado un documento de PQRD",
        comentario: "Eliminado",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} ha eliminado un documento PQRD`,
        tramite: dataPqrd.value.informacionSolicitud.tipologiaEntity.id == 7 ? 'PQRD Express' : 'PQRD',
      })
      return data.data; // Retornar el resultado de la solicitud de eliminación
    }));

    // Si todas las solicitudes de eliminación fueron exitosas
    listDocSelect.value = [];
    activeDelete.value = false;
    toast.success('Los documentos seleccionados han sido eliminados');
    emit('findDocs')
    getDocs();
  } catch (error) {
    // Manejar errores
    listDocSelect.value = [];
    activeDelete.value = false;
    toast.error('Hubo un error, inténtelo de nuevo');
    emit('findDocs')
    // getDocuments();
  }
}

const findRoles = (role) => {
  var nomenclatura = [
    'Administrador', //0
    'Asignador', //1
    'aprobador_sgdea', //2
    'Gestionador', //3
    'Radicador' //4
  ]
  var valid = false
  role.forEach(element => {
    if (userInfo.value?.role?.includes(nomenclatura[element])) {
      valid = true
    }
  });
  return valid
}

</script>
