<template>
  <q-form>
    <section>
      <q-card v-if="!(props.isResponse || props.isSoporte || props.isGestion)" class="tw-flex tw-p-2 tw-gap-10">
        <q-btn :color="typeDoc === 'De entrada' ? 'primary' : 'grey-7'" outline icon="info" label="De entrada" @click="changeDocs('De entrada')" />
        <q-btn :color="typeDoc === 'De gestión' ? 'primary' : 'grey-7'" outline icon="info" label="De gestión" @click="changeDocs('De gestión')" />
        <q-btn :color="typeDoc === 'De Salida' ? 'primary' : 'grey-7'" outline icon="info" label="De salida" @click="changeDocs('De Salida')" />
      </q-card>
      <q-card class="tw-p-6 q-mt-md">
        <div class="q-mt-sm">
          <div v-if="!activeGestEscalamiento"class="row tw-justify-between tw-items-center">
            <p class="tw-text-lg text-weight-bold q-mx-lg">
              {{ props.isResponse || props.isSoporte ? 'Lista de Anexos' : 'Listado de Documentos Cargados' }}
            </p>
            <div v-if="activeDelete && auth.$state.userInfo.role == 'Administrador' || activeDelete && activeAbsolute" class="row tw-gap-10 tw-items-center q-ml-lg">
              <p class="tw-text-label tw-text-sm">Cantidad seleccionada: <b>{{ listDocSelect.length }}</b> </p>
              <q-btn label="Eliminar" icon="delete" color="red" @click="deleteDocModal = true" class="tw-w-32 tw-h-10" />
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
          <Table :visualize="props.visualize" @adjuntar-doc-soporte-escalamiento="adjuntarDocSopEscl" ref="tableDoc" :TABLE_BODY="listDocs" :TABLE_HEADER="HEADER_DOCUMENTS" @update:item-selected="itemSelected" icon="download" isSecondIcon secondIcon="print" :loading="loading" :is-selection="findRoles([0]) && !activeGestEscalamiento || activeAbsolute && !activeGestEscalamiento ?  'multiple' : 'none'" :activeGesEsc="activeGestEscalamiento" @handleEditData="download" @handleSecondIcon="print" :key-id="'id'":user-role="userInfo?.role" @eliminarDocumento="manejarEliminacionDocumento"/>
        </div>

        <!-- <DocumentosRelacionados :list-docs="listDocs" :download="download" /> -->
      </q-card>
    </section>

    <Modal v-model="deleteDocModal" title="Confirmación" text="¿Está seguro de que desea eliminar el documento?" :is-success="false" cancel-button text-button-cancel="No" text-button="Si" @handleAccept="eliminarDoc" />


    <q-dialog v-model="showModalRechazar">
      <q-card class="q-py-md q-px-md md:tw-w-[50%]">
        <q-card-section class="text-h6 tw-max-w-sm">
          <p class="tw-text-xl text-weight-bold">Rechazar caso</p>
          <p class="tw-text-md q-mt-sm">
            Escriba aquí el motivo de rechazo.
          </p>
        </q-card-section>

        <q-form @submit.prevent="onSubmit">
          <label class="tw-text-label"> Observaciones </label>
          <q-input v-bind="$attrs" type="textarea" label="Inserte" outlined dense :rules="[isSuccess]"
            v-model="observations" />
          <q-card-actions align="center" class="q-mt-sm">
            <q-btn type="button" flat label="Cancelar" class="tw-h-12 text-weight-bold tw-text-md" style="width: 40%"
              color="secondary" @click="() => (showModalRechazar = false)" />
            <q-btn type="submit" flat label="Rechazar" class="tw-h-12 bg-secondary text-weight-bold tw-text-md"
              style="width: 40%" color="white" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showModalCancel">
      <q-card class="q-py-xl q-px-xl">
        <img class="q-mx-auto" style="width: 100px" v-lazy :data-url="InterrogationModal" />
        <q-card-section class="text-h6 tw-max-w-sm text-center text-weight-bold">
          Confirmación
        </q-card-section>
        <p class="tw-max-w-sm text-center tw-text-lg">
          ¿Está seguro de rechazar el trámite?
        </p>
        <q-card-actions align="center" class="q-mt-sm">
          <q-btn type="button" flat label="Cancelar" class="tw-h-12 text-weight-bold tw-text-lg" style="width: 45%"
            color="secondary" v-close-popup />
          <q-btn type="button" flat label="Aceptar" class="tw-h-12 bg-secondary text-weight-bold tw-text-lg"
            style="width: 50%" color="white" @click="handleModal" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-form>
</template>

<script lang="ts" setup>
import { HEADER_DOCUMENTS } from "..";
import { Ref, defineEmits, ref, onMounted, watch } from 'vue'
import Table from "./Table.vue";
import Modal from "src/components/Modal/Modal.vue";
import { sgdeaAxios, intescoAxios } from "src/services";
import InterrogationModal from "src/assets/interrogation-modal.svg";
import { useLoadingStore } from "src/stores/loading.store";
import { toast } from "src/helpers/toast";
import { formatDateTimeStandTwo, currentHourWithoutSec } from "src/helpers/formtDate";
import { DocumentoRadicado } from "src/interfaces";
import { useAuthStore } from "stores/auth.store";


const props = withDefaults(defineProps<{
  reloadData: boolean,
  activeAbsolute: boolean,
  detalleTutela: any,
  user: any,
  isResponse?: boolean,
  isSoporte?: boolean,
  isGestion?: boolean,
  userGestion?: string,
  activeGestEscalamiento?: boolean,
  visualize?: (id, list) => {},
  isDevolucion: boolean
}>(), {
  activeGestEscalamiento: false,
  isResponse: false,
  isSoporte: false,
  isGestion: false,
  userGestion: ''
})

const { getUserInfo } = useAuthStore();
const auth = useAuthStore()

const emit = defineEmits(['download', 'updateTotalList', 'cleanDocs', 'findDocs', 'loadTrue', 'adjuntarDocSoporte', 'detalle-doc', 'eliminarDocumento']);
const listDocSelect = ref([])
const deleteDocModal = ref(false)
const activeDelete = ref(false)
const listDocs = ref<any[]>([])
const copyListDcos = ref([])
const filterListDocs = ref([])
const listDocsFilter = ref([])
const loading = ref(true)
const nameDocument = ref()
const tableDoc = ref()
const userInfo = ref()
const selectDoc = ref()
const opsSelectDoc = ref([])
const typeDoc = ref('')
onMounted(async () => {
  userInfo.value = await getUserInfo();
  getDocuments()
})

const getDocuments = async () => {
  try {
    loading.value = true;
    listDocs.value = []
    const { data } = await sgdeaAxios.get<any>(
      `/tutela/${props.detalleTutela.idTutela}/archivos`
    );
    listDocs.value = data.map((it) => ({
      formato: /[^.]+$/.exec(it.nombre)[0],
      nombre: it.nombre,
      tipo: it.tipo,
      fecha: formatDateTimeStandTwo(it.fechaCreacion) + ' ' + currentHourWithoutSec(it.fechaCreacion),
      cargado_por: it.usuario,
      id: it.id,
      nodeId: it.nodeId,
      username: it.username,
      usuario: it.usuario,
      fechaCreacion: it.fechaCreacion,
      extension: it.extension,
      es_devolucion: it.es_devolucion
    }));


    emit('updateTotalList', listDocs.value)
    // setTimeout(() => {
    //   loading.value = false
    // }, 500);
    tableDoc.value.cleanSelect()
    if (props.isResponse) {
      var filtro = listDocs.value.filter((item) => item.username == props.detalleTutela.usuarioEscalados[props.detalleTutela.usuarioEscalados?.length - 1]?.usuario)
      listDocs.value = filtro
    }

    if (props.isSoporte) {
      var filtro = listDocs.value.filter((item) => item.tipo.trim() == 'De Salida' || item.tipo.trim() == 'De salida')
      listDocs.value = filtro
    }

    if (props.isGestion) {
      var filtro = listDocs.value.filter((item) => item.tipo.trim() == 'De Salida' || item.tipo.trim() == 'De gestión' && item.username == props.userGestion || item.tipo.trim() == 'De salida' || item.tipo.trim() == 'De gestión' && item.username == props.detalleTutela.escalamientoTutelas?.usuarioEscalador)
      listDocs.value = filtro
    }
    if (props.isDevolucion) {
      listDocs.value = listDocs.value.filter((item) => item.es_devolucion)
    }
    copyListDcos.value = listDocs.value
    if (!props.isGestion) {
      await changeDocs('De salida');
    }

  } catch (error) {
    toast.error("Hubo un error en el cargue de los documentos")
  } finally {
    loading.value = false;
  }
}

const manejarEliminacionDocumento = async (id) => {
  const originalList = [...listDocs.value];
  try {
    listDocs.value = listDocs.value.filter(doc => doc.id !== id);
    
    emit('eliminarDocumento', id);
    
    setTimeout(async () => {
      await getDocuments();
    }, 500);
    
  } catch (error) { 
    listDocs.value = originalList;
    toast.error('Error al eliminar documento');
  }
};


defineExpose({
  getDocuments,
  listDocs
});

const itemSelected = (items) => {
  if (items.length > 0) {
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
        nameDocument.value = data.name
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
    emit('detalle-doc', data)
  } catch (error) {
    toast.error('Ha ocurrido un error')
    console.error(error)
  }
};

const print = async(id) => {
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
    console.error(error);
  } finally{
  }
}

const eliminarDoc = async () => {
    loading.value = true
    listDocs.value = []
    try {
        // Utilizar Promise.all para esperar todas las solicitudes de eliminación
        await Promise.all(listDocSelect.value.map(async (el) => {
            const data = await sgdeaAxios.delete<any>(`/tutela/archivos/${el.id}`);
            return data.data; // Retornar el resultado de la solicitud de eliminación
        }));

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

const findRoles = (role) => {
    var nomenclatura = [
        'Administrador', //0
        'Asignador Responsable', //1
        'aprobador_sgdea', //2
        'Gestionador', //3
        'Radicador - Web' //4
    ]
    var valid = false
    role.forEach(element => {
        if (userInfo.value?.role?.includes(nomenclatura[element])) {
            valid = true
        }
    });
    return valid
}

const adjuntarDocSopEscl = (data) => {
  emit('adjuntarDocSoporte', data)
}

watch(
  () => props.reloadData,
  async (value) => {
    if (value == true) {
      await getDocuments()
    }
  }
);

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
  listDocs.value = copyListDcos.value.filter(it => it.tipo.trim().toLowerCase() === type.toLowerCase())
  listDocsFilter.value = listDocs.value
  filterListDocs.value = listDocs.value.map(({ nombre, id }) => { return { label: nombre, value: id } }).sort((a, b) => a.label.localeCompare(b.label));
  if (listDocs.value.length && listDocs.value[0].formato.toLowerCase() == 'pdf') {
    props.visualize(listDocs.value[0].nodeId, copyListDcos.value)
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
