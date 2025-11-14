<template>
  <q-form>
    <section>
      <q-card class="tw-flex tw-p-2 tw-gap-10">
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
            <div
              v-if="activeDelete && (auth.$state.userInfo.role == 'Administrador de Trámite' || auth.$state.userInfo.role == 'Administrador de Master' || auth.$state.userInfo.role.includes('Gestionador'))"
              class="row tw-gap-10 tw-items-center q-ml-lg">
              <p class="tw-text-label tw-text-sm">Cantidad seleccionada: <b>{{ listDocSelect.length }}</b> </p>
              <q-btn label="Eliminar" icon="delete" color="red" @click="deleteDocModal = true"
                class="tw-w-32 tw-h-10" />
            </div>
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
import { HEADER_DOCUMENTS } from ".";
import Table from "./Table.vue";
import moment from "moment";
import { isNullOrUndefined } from "src/shared/utils/Input/validationInput";


const props = withDefaults(defineProps<{
  detalleML: Medicina,
  finished: boolean,
  visualize?: (id, list, action) => {},
}>(), {
})

const { getUserInfo } = useAuthStore();
const auth = useAuthStore()
const emit = defineEmits(['download','updateTotalList', 'cleanDocs', 'findDocs', 'loadTrue', 'changeDocType', 'update:detalleML', 'update:finished', 'showUpload'])
const listDocSelect = ref([])
const deleteDocModal = ref(false)
const activeDelete = ref(false)
const listDocs = ref([])
const loading = ref(true)
const nameDocument = ref()
const tableDoc = ref()
const userInfo = ref()
const typeDoc = ref('')
const copyListDcos = ref([])
const listDocsFilter = ref([])
const filterListDocs = ref([])
const selectDoc = ref()
const opsSelectDoc = ref([])

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

async function getDocs() {
  try {
    loading.value = true
    listDocs.value = []
    if(isNullOrUndefined<Object>(props.detalleML)){
      return;
    }
    const idMl = props.detalleML!.id;
    const { data: files } = await sgdeaAxios.get(`/medicina/documentos/${idMl}`);
    emit('updateTotalList', files)
    listDocs.value = files.map((it) => {
      return {
        formato: it.formato,
        nombre: it.nombre,
        tipo: `De ${it.tipoDocumento.toLowerCase()}`,
        fecha: moment(it.fechaCargue).format('DD/MM/YYYY'),
        cargado_por: it.usuario.firstname + ' ' + it.usuario.lastname,
        id: it?.nodeId,
        nodeId: it?.nodeId,
      }
    }).sort((a, b) => {
      if (a.nombre === props?.detalleML?.idRadicado + '.pdf') return -1;
      if (b.nombre === props?.detalleML?.idRadicado + '.pdf') return 1;
      return 0;
    })

    setTimeout(() => {
      loading.value = false
    }, 500);
    tableDoc.value?.cleanSelect();
    copyListDcos.value = listDocs.value
    changeDocs('De entrada')
  } catch (error) {
    console.error(error)
  }
}

const itemSelected = (items) => {
  items = items.filter((item) => item.nombre !== props.detalleML.idRadicado + '.pdf')
  emit('changeDocType', items);
  if (items.length > 0 && !items.find((item) => item.tipo == 'De entrada')) {
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
  }
}

const eliminarDoc = async () => {
  loading.value = true
  listDocs.value = []
  try {
    // Utilizar Promise.all para esperar todas las solicitudes de eliminación
    await Promise.all(listDocSelect.value.map(async (selectedDocs) => {
      const data = await sgdeaAxios.delete<any>(`/medicina/documentos/${selectedDocs.id}`);
      await crearTrazabilidad({
        proceso: `ML${props.detalleML.id}`,
        secuencia: props.detalleML.idRadicado,
        estado: props.detalleML.estado.estado,
        descripcion: `Usuario: ${auth.$state.userInfo.name}`+`Documento eliminado: ${selectedDocs.nombre}` + `Tipo de documento: ${selectedDocs.tipo}`,
        comentario: "Se ha eliminado un documento de Medicina Laboral",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} ha eliminado un documento PQRD`,
        tramite: 'Medicina Laboral',
      })
      return data.data;
    }));

    // Si todas las solicitudes de eliminación fueron exitosas
    listDocSelect.value = [];
    activeDelete.value = false;
    toast.success('Los documentos seleccionados han sido eliminados');
    emit('findDocs')
    getDocs();
  } catch (error) {
    listDocSelect.value = [];
    activeDelete.value = false;
    toast.error('Hubo un error, inténtelo de nuevo');
    emit('findDocs')
  }
}

const changeDocs = async (type: string) => {
  typeDoc.value = type
  listDocs.value = copyListDcos.value.filter(it => it.tipo === type)
  listDocsFilter.value = listDocs.value
  filterListDocs.value = listDocs.value.map(({ nombre, id }) => { return { label: nombre, value: id } }).sort((a, b) => a.label.localeCompare(b.label));
  props.visualize(listDocs.value[0]?.nodeId, copyListDcos.value.filter(e => e.formato === 'pdf'), false)

  if (type === 'De soporte') emit('showUpload', true)
  else emit('showUpload', false)
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

</script>
