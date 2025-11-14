<template class="tw-bg-white">
  <q-btn label="Anular Escalamiento" color="secondary" class="absolute tw-left-[88%] tw-top-8"
    @click="showAnular = true" />
  <q-form>
    <section class="tw-mt-4">
      <div class="q-mt-sm">
        <div class="tw-w-full tw-px-7 tw-mb-5">
          <p class="tw-block tw-text-xs tw-font-bold tw-text-[#777e87]">Comentarios</p>
          <p>{{ props.infogestion.row.allInfo.respuesta ?? 'N/A Sin Respuesta' }}</p>
        </div>
        <div v-if="props.infogestion.row.allInfo.rechazado" class="tw-w-full tw-px-7 tw-mb-5">
          <p class="tw-block tw-text-xs tw-font-bold tw-text-[#777e87]">Motivo de Rechazo</p>
          <p>{{ props.infogestion.row.allInfo.motivoRechazo }}</p>
        </div>
        <div class="row tw-justify-between">
          <p class="tw-text-lg text-weight-bold q-mx-lg">
            Listado de documentos cargados
          </p>
          <div
            v-if="activeDelete && (auth.$state.userInfo.role == 'Administrador Master' || auth.$state.userInfo.role == 'Administrador de Trámite' || auth.$state.userInfo.role == 'Asignador Responsable')"
            class="row tw-gap-10 tw-items-center q-ml-lg">
            <p class="tw-text-label tw-text-sm">Cantidad seleccionada: <b>{{ listDocSelect.length }}</b> </p>
            <q-btn label="Eliminar" icon="delete" color="red" @click="deleteDocModal = true" class="tw-w-32 tw-h-10" />
          </div>
        </div>
        <TableInfoGes :visualize="props.visualize" ref="tableDoc" :TABLE_BODY="dataTable"
          :TABLE_HEADER="HEADER_DOCUMENTS" @update:item-selected="itemSelected" icon="download" isSecondIcon
          secondIcon="print" :loading="loading" is-selection="none" @handleEditData="download"
          @handleSecondIcon="validarComoSoporte" :key-id="'id'" />
      </div>


    </section>

    <Modal v-model="deleteDocModal" title="Confirmación" text="¿Está seguro de que desea eliminar el documento?"
      :is-success="false" cancel-button text-button-cancel="No" text-button="Si" @handleAccept="eliminarDoc" />
  </q-form>

  <q-dialog v-model="showAnular" backdrop-color="rgba(0, 0, 0, 0.5)">
    <q-card class="tw-w-[35%] mx-auto tw-p-5">
      <q-card-section>
        <div class="tw-text-xl tw-font-extrabold q-mx-lg tw-text-[#0a1b48] tw-mb-4">Anular Escalamiento</div>
        <label class="tw-block tw-text-sm tw-font-bold tw-text-[#777e87]">Escriba aquí su motivo de anulación*</label>
        <q-input type="textarea" outlined label="Inserte" dense emit-value v-model="formulario.motivoAnulacion" :rules="[
          (v) => inputRequired(v),
          (v) => maxLengthInput(500, v),
          (v) => minLengthInput(20, v),
        ]" />
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat label="Cancelar" color="secondary" v-close-popup @click="emit('backView')" />
        <q-btn label="Anular" color="secondary" @click="validarAnulamiento" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <Modal v-model="adjuntarModal" title="Confirmación"
    text="¿Está seguro de anexar este documento al Documento de salida?" :is-success="false" cancel-button
    text-button-cancel="No" text-button="Si" @handleAccept="adjuntarComoSoporte(docComoSoporte)" />

  <Modal v-model="confirmarAnular" title="Confirmación" text="¿Está seguro que se desea anular el escalamiento?"
    :is-success="false" cancel-button text-button-cancel="No" text-button="Si" @handleAccept="anular" />

</template>

<script lang="ts" setup>
//@ts-ignore
import { HEADER_DOCUMENTS } from ".";
import { ref, onMounted, watch } from 'vue'
import TableInfoGes from "./TableInfoGes.vue";
import Modal from "src/components/Modal/Modal.vue";
import { sgdeaAxios, intescoAxios } from "src/services";
import { useLoadingStore } from "src/stores/loading.store";
import { toast } from "src/helpers/toast";
import { fourthFormatDate, currentHourWithoutSec } from "src/helpers/formtDate";
import { DocsBD, DocumentoRadicado } from "src/interfaces";
import { useAuthStore } from "stores/auth.store";
import { useRoute } from "vue-router";
import { inputRequired, maxLengthInput, minLengthInput } from "src/helpers/validations";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import moment from "moment";

const props = withDefaults(defineProps<{
  detallePqrd: any,
  finished: boolean,
  infogestion: any,
  visualize?: () => {}
}>(), {
})

const formulario = ref({
  motivoAnulacion: ""
})

const { getUserInfo } = useAuthStore();
const auth = useAuthStore()
const route = useRoute();

const emit = defineEmits(['download', 'cleanDocs', 'findDocs', 'loadTrue', 'changeDocType', 'update:detallePqrd', 'update:finished', 'back', 'anulado', 'backView'])
const listDocSelect = ref([])
const deleteDocModal = ref(false)
const activeDelete = ref(false)
const showAnular = ref(false)
const adjuntarModal = ref(false)
const listDocs = ref([])
const loading = ref(true)
const nameDocument = ref()
const tableDoc = ref()
const confirmarAnular = ref(false)
const docComoSoporte = ref()
const userInfo = ref()
onMounted(async () => {
  userInfo.value = await getUserInfo();
  getDocuments()
})

function validarComoSoporte(data) {
  docComoSoporte.value = data
  adjuntarModal.value = true
}

function validarAnulamiento() {
  if (!formulario.value.motivoAnulacion || formulario.value.motivoAnulacion.length < 20 || formulario.value.motivoAnulacion.length > 500) {
    toast.error("Debe diligenciar los campos obligatorios");
  } else {
    confirmarAnular.value = true
  }
}

async function adjuntarComoSoporte(data) {
  const response = await sgdeaAxios.put('/pqrd/cambiarTipoDocumento', [{
    id: data.id,
    nodeId: data.nodeId,
    tipo: 'De salida',
    pqrdId: props.detallePqrd.id
  }]);
  toast.success('El documento se ha anexado al documento de salida con éxito')
  await getDocuments()
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

  try {
    // Llamadas a la API para obtener documentos
    const sopoerteEscalamiento = props.infogestion?.row.allInfo.soportesEscalamiento
    const response = await sgdeaAxios.get(`/pqrd/obtenerDocs?idPqrd=${props.detallePqrd.id}`);
    const responseDocs = await intescoAxios.get(`/bandeja/consultarAnexosPorCarpeta?nodeId=${props.detallePqrd.nodeID}`);

    // Procesamiento de los datos obtenidos
    const finalArray = sopoerteEscalamiento.map(item2 => {
      let item1
      let item02

      item1 = response.data.find(item => item.nodeId === item2.nodeId);
      item02 = responseDocs.data.result.radicado.find(item => item.node.entry.id === item1.nodeId);

      if (item1) {
        return {
          usuario: item2.usuario,
          nodeId: item2.nodeId,
          id: item2.id,
          nombre: item1.nombre,
          tipo: item1.tipo.replace("De","Para"),
          mimeType: item02.node.entry.content.mimeType,
          createdAt: item02.node.entry.createdAt
        };
      }
    }).filter(item => item !== undefined);
    // Asignar los documentos procesados a listDocs
    listDocs.value = finalArray.map((it) => ({
      id: it.id,
      formato: it.mimeType,
      nombre: it.nombre,
      tipo: it.tipo,
      fecha: moment(it.createdAt).format('DD/MM/YYYY'),
      cargado_por: `${props.infogestion.row.allInfo.usuario.firstname} ${props.infogestion.row.allInfo.usuario.lastname}`,
      nodeId: it.nodeId
    }));
    // Asignar listDocs a dataTable para que la tabla muestre los datos
    dataTable.value = listDocs.value;
  } catch (error) {
    console.error(error);
    toast.error('Error al cargar los documentos');
  } finally {
    loading.value = false;
    tableDoc.value.cleanSelect();
  }
};

const itemSelected = (items) => {
  items = items.filter((item) => item.nombre !== props.detallePqrd.idRadicado + '.pdf')
  emit('changeDocType', items);

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
    console.error(error);
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
    console.error(error);
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
      return data.data; // Retornar el resultado de la solicitud de eliminación
    }));

    // Si todas las solicitudes de eliminación fueron exitosas
    listDocSelect.value = [];
    activeDelete.value = false;
    toast.success('Documentos eliminados con éxito');
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

const dataTable = ref([
])

const back = (showInfo) => {
  showInfo.value = false

  emit("back", showInfo);
};

const anular = async () => {

  if (!formulario.value.motivoAnulacion || formulario.value.motivoAnulacion.length < 20 || formulario.value.motivoAnulacion.length > 500) {
    toast.error("Debe diligenciar los campos obligatorios");
  } else {
    try {
      const response = await sgdeaAxios.patch(`/pqrd/escalamiento/anular/${props.infogestion.row.id}`, {
        motivoAnulacion: formulario.value.motivoAnulacion,
      })

      if (response.status == 200 || response.status == 201) {
        await crearTrazabilidad({
          proceso: "PQRD" + props.detallePqrd.id,
          secuencia: props.detallePqrd.idRadicado,
          estado: props.detallePqrd.estado.estado,
          descripcion: `Usuario Escalador: ${auth.$state.userInfo.name} \n` +
          `Usuario de tramite: ${props.infogestion.row.allInfo.usuario.firstname} ${props.infogestion.row.allInfo.usuario.lastname} \n` +
          `Motivo: ${formulario.value.motivoAnulacion}`,
          comentario: 'Respuesta de escalamiento nulada',
          nombre: auth.$state.userInfo.name,
          accion: `${auth.$state.userInfo.name} ha anulado la respuesta de escalamiento de la PQRD ${props.detallePqrd.idRadicado}`,
          tramite: props.detallePqrd.informacionSolicitud.tipologiaEntity.id == 7 ? 'PQRD Express' : 'PQRD',
        })
        toast.success("El escalamiento se ha anulado de manera correcta");
        emit('anulado')
      } else {
        toast.error("Ha ocurrido un problema inesperado");
      }
    } catch (error) {
      console.error(error);
    }
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
