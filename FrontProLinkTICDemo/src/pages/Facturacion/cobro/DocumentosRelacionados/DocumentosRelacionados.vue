<template>
  <q-form>
    <section>
      <q-card class="tw-flex tw-p-2 tw-gap-10">
        <q-btn :color="typeDoc === 'De entrada' ? 'primary' : 'grey-7'" outline icon="info" label="De entrada"
          @click="changeDocs('De entrada')" />
        <q-btn :color="typeDoc === 'De salida' ? 'primary' : 'grey-7'" outline icon="info" label="De salida"
          @click="changeDocs('De salida')" />
      </q-card>
      <q-card class="tw-p-6 q-mt-md">
        <div class="q-mt-sm">
          <div class="row tw-justify-between">
            <p class="tw-text-lg text-weight-bold q-mx-lg">
              Listado de documentos cargados
            </p>
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
            icon="download" isSecondIcon secondIcon="print" :loading="loading" is-selection="none"
            @handleEditData="download" @handleSecondIcon="print" :key-id="'id'" />
        </div>
      </q-card>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
import { toast } from "src/helpers/toast";
import { DocumentoRadicado } from "src/interfaces";
import { intescoAxios, sgdeaAxios } from "src/services";
import { useLoadingStore } from "src/stores/loading.store";
import { onMounted, ref, watch } from 'vue';
import { HEADER_DOCUMENTS } from ".";
import Table from "./Table.vue";
import moment from "moment";

const props = withDefaults(defineProps<{
  detalleRadicado: any,
  finished: boolean,
  visualize?: (id, list, action) => {},
}>(), {
})

const emit = defineEmits(['download', 'cleanDocs', 'findDocs', 'loadTrue', 'changeDocType', 'update:detalleRadicado', 'update:finished', 'showUpload'])
const listDocs = ref([])
const loading = ref(true)
const nameDocument = ref()
const tableDoc = ref()
const typeDoc = ref('')
const copyListDcos = ref([])
const listDocsFilter = ref([])
const filterListDocs = ref([])
const selectDoc = ref()
const opsSelectDoc = ref([])

watch(() => props.finished, (value) => {
  if (value) {
    getDocs(value)
    value = false;
    tableDoc.value.cleanSelect();
    emit('update:finished', false)
  }
});

watch(() => props.detalleRadicado, (value) => {
  if (value) {
    getDocs(value);
    tableDoc.value.cleanSelect();
  }
});

async function getDocs(props) {
  try {
    loading.value = true
    listDocs.value = []

    const responseEntrada = await sgdeaAxios.get(`correspondencia/radicacion/documentos/ENTRADA/${props.id}`)
    const responseSoporte = await sgdeaAxios.get(`correspondencia/radicacion/documentos/SOPORTE/${props.id}`)
    const responseSalida = await sgdeaAxios.get(`correspondencia/radicacion/documentos/SALIDA/${props.id}`)
    const response = await intescoAxios.get('/bandeja/consultarAnexosPorCarpeta?nodeId=' + props.nodeId);
    const documentoEntrada = response.data.result.radicado.find((item) => item.node.entry.name == props.idRadicado + ".pdf").node.entry
    const docEntrada = [{
      formato: "pdf",
      nombre: documentoEntrada.name,
      tipoDocumento: "ENTRADA",
      fechaCargue: documentoEntrada.createdAt,
      usuario: props.usuarioCreador,
      id: documentoEntrada.id,
      nodeId: documentoEntrada.id
    }]

    const totalList = [...responseEntrada.data, ...responseSalida.data, ...responseSoporte.data, ...docEntrada]
    listDocs.value = totalList.map((it) => {
      return {
        formato: it.formato,
        nombre: it.nombre,
        tipo: `De ${it.tipoDocumento.toLowerCase()}`,
        fecha: moment(it.fechaCargue).format('DD/MM/YYYY'),
        cargado_por: it?.usuario?.firstname + ' ' + it?.usuario?.lastname,
        id: it?.nodeId,
        nodeId: it?.nodeId,
      }
    }).sort((a, b) => {
      if (a.nombre === props?.idRadicado + '.pdf') return -1;
      if (b.nombre === props?.idRadicado + '.pdf') return 1;
      return 0;
    })


    setTimeout(() => {
      loading.value = false
    }, 500);
    tableDoc.value?.cleanSelect();
    copyListDcos.value = listDocs.value
    changeDocs('De entrada')
  } catch (error) {
    toast.error('Ha ocurrido un error')
    console.error(error)
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
    console.error(error)
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
    console.error(error)
  } finally {
  }
}

const changeDocs = async (type: string) => {
  typeDoc.value = type
  listDocs.value = copyListDcos.value.filter(it => it.tipo === type)
  listDocsFilter.value = listDocs.value
  filterListDocs.value = listDocs.value.map(({ nombre, id }) => { return { label: nombre, value: id } }).sort((a, b) => a.label.localeCompare(b.label));
  props.visualize(listDocs.value[0]?.nodeId, copyListDcos.value.filter(e => e.formato === 'pdf'), false)
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

watch(() => selectDoc.value, async (value) => {
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
});

</script>
