<template>
  <main class="q-py-md">
    <div @click="emit('closeComp')" class="text-primary q-mb-md block cursor-pointer" style="text-decoration: none">
      <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
      <b> Volver</b>
    </div>
    <BreadCrumbs :crumbs="routes"></BreadCrumbs>
    <div class="tw-flex tw-justify-between tw-pt-4 tw-mb-3">
      <h1 class="tw-text-3xl tw-font-bold">Radicado # {{ showRoute }}</h1>
      <div class="tw-flex" >
          <div class="tw-flex tw-gap-5" v-if="tab == 'vistaInformacionGeneral'">
            <q-btn class="tw-w-40 flex tw-mr-4" v-if="findRoles([0,7])  && detalleTutela.estado == 'Cerrado' || detalleTutela.estado == 'Cerrada'" color="primary" @click="reabrirRadicadoModal = true">
              Reabrir Gestión
            </q-btn>
            <q-btn class="tw-w-40 flex" color="primary" v-if="findRoles([0,7]) && detalleTutela.etapaProcesal" @click="showModalMover = true">
              Mover
            </q-btn>
            <q-btn class="tw-w-40 flex" color="primary" v-if="findRoles([0,7])"
              @click="router.push('/tutelas/excluir/' + showRoute)">
              Excluir
            </q-btn>
          </div>
      </div>
    </div>
    <span
      class="tw-bg-orange-100 q-my-sm tw-mb-3 tw-border-orange-400 tw-border tw-rounded-full tw-w-auto q-px-md q-py-xs">
      {{ status }}
    </span>

    <q-tabs no-caps align="left" indicator-color="primary" active-color="primary" v-model="tab" inline-label>
      <q-tab name="vistaInformacionGeneral" label="Información General"
        class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]" icon="info" />
      <q-tab name="docs" label="Documentos Relacionados" icon="folder_open" />
      <q-tab name="trazabilidad" label="Trazabilidad" icon="history" />
      <q-tab name="comentarios" label="Comentarios" icon="forum" />
      <q-tab name="radicados" label="Radicados Asociados" icon="handshake" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated v-if="loaded">
      <q-tab-panel name="vistaInformacionGeneral">
        <div v-if="(!isEditing && findRoles([6,1]) && detalleTutela.estado == 'En asignación' || detalleTutela.estado == 'Por asignar') || (!isEditing && findRoles([0,7]))" class="tw-flex tw-w-full tw-justify-end">
          <q-btn label="Editar" type="reset" text-color="white" color="primary" icon="edit"
                class="tw-rounded-xl tw-right-0" @click="isEditing = true" />
        </div>
        <InformacionGeneral v-if="!isEditing" :list-docs="listDocs" :all-valid="activeValidButton" @valid="validarAll"
          :download="download" :visualize="getBlobToIframe" :detalle-tutela="detalleTutela" />
        <EditarTutela v-else @cancelled="isEditing = false"  :list-docs="listDocs" :all-valid="activeValidButton" @valid="validarAll"
        :download="download" :visualize="getBlobToIframe" :detalle-tutela="detalleTutela" @success="editSuccess"/>
      </q-tab-panel>
      <q-tab-panel name="trazabilidad">
        <Trazabilidad :doneItems="trazabilidadData" />
      </q-tab-panel>
      <q-tab-panel name="docs">
        <DocumentosRelacionados :visualize="getBlobToIframe" @find-docs="getAllRegisters"
          :detalle-tutela="detalleTutela" :reloadData="reloadData" />
      </q-tab-panel>
      <q-tab-panel name="comentarios">
        <Comentarios :id-detalle="idDetalle"/>
      </q-tab-panel>
      <q-tab-panel name="radicados">
        <RadicadosAsociados :radicados="radicados" :codigo="detalleTutela.codigoProceso" />
      </q-tab-panel>
    </q-tab-panels>

    <Modal v-model="reabrirRadicadoModal" title="Confirmación" :is-success="false" @handleAccept="reabrirRadicado"
        cancel-button textButtonCancel="No" textButton="Si"
        text="¿Está seguro de Reabrir la gestión del radicado?"
        @close-modal="reabrirRadicadoModal = false, tab = 'vistaInformacionGeneral'" type="button" />

    <div v-if="visualizadorPDF" class="tw-h-full tw-w-full">
      <q-dialog v-model="visualizadorPDF" seamless position="right" class="">
        <q-card class="tw-h-full tw-w-[2000px] tw-z-[1000] tw-overflow-hidden">
          <q-btn @click="visualizadorPDF = false"
            class="tw-absolute tw-ml-12 tw-mt-3 tw-z-[2000] tw-text-white tw-bg-red-500">Cerrar</q-btn>
          <iframe class="tw-h-full tw-w-full" :src="iframePdfUrl" frameborder="0"></iframe>
        </q-card>
      </q-dialog>
    </div>

    <q-dialog v-model="showModalMover">
      <q-card>
        <q-card-section class=" tw-p-10">
          <q-form ref="moverForm">
            <h2 class=" tw-text-bold tw-mb-5 tw-px-2 tw-text-secondary tw-font-bold tw-text-lg">
              Mover Radicado
            </h2>
            <div class="tw-mt-3">
              <label for="etapa" class="tw-text-label">Etapa Procesal *</label>
              <q-select v-model="formMover.etapaId" id="etapa"
                name="etapaProcesal" outlined dense use-input hide-selected fill-input input-debounce="0"
                label="Seleccione" :options="etapaOp" :rules="[inputRequired]" @filter="filterDep">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="tw-mt-3">
              <label for="exclusion" class="tw-text-label">Observaciones * ({{ formMover.observacion ? formMover.observacion.length : '0'}} / 10000)</label>
              <q-input id="exclusion" type="textarea" v-model="formMover.observacion" dense outlined label="Inserte" class="tw-rounded-lg"
         :rules="[inputRequired, v => maxLengthInputCustom(10000, v, 'motivo'), v => minLengthInputCustomAsignacion(10, v) ]" />
            </div>
            <div class="tw-flex tw-gap-5 tw-mt-3">
              <q-btn label="Cancelar" type="reset" style="width: 200px" text-color="blue-grey-10" color="white"
                @click="cancelarMover" class="tw-rounded-xl tw-h-12" />
              <q-btn label="Mover" type="reset" style="width: 200px" text-color="white" color="blue-grey-10"
                class="tw-rounded-xl tw-h-12" @click="validateMover" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <Modal v-model="confirmMover" title="Confirmación" :is-success="false" @handleAccept="moverTutela"
    cancel-button textButtonCancel="No" textButton="Si"
    :text="`¿Está seguro de mover el radicado ${showRoute} a la etapa procesal ${formMover?.etapaId?.label}?`"
    @close-modal="confirmMover = false" type="button" />

  </main>
</template>

<script lang="ts" setup>
import { Ref, onMounted, ref, watch, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Modal from "src/components/Modal/Modal.vue";

import { formatDate } from "src/helpers/formtDate";
import { useLoadingStore } from "src/stores/loading.store";
import {
  homePhoneNumber,
  phoneFormat,
  mobilePhonNumber,
  validationEmail,
  maxLengthInput,
  inputRequired,
  minLengthInput,
  alphanumeric,
  maxLengthInputCustom,
  minLengthInputCustomAsignacion
} from 'src/helpers/validations';
import { toast } from "src/helpers/toast";
import { useLastTutelaStore } from "src/stores/lastTutela.store";
import { useStateStore } from "src/stores/status.store";
import { ITutelaDetalles } from ".";
import EditarTutela from "./EditarTutela.vue";
import { fourthFormatDate, formatDateTimeStand, formatDateTimeStandTwo, currentHourWithoutSec } from "src/helpers/formtDate";
import BreadCrumbs from "src/components/BreadCrumbs/BreadCrumbs.vue";
import Trazabilidad from "src/pages/Expedientes/Trazabilidad/Trazabilidad.vue";
import DocumentosRelacionados from "./DocumentosRelacionados/DocumentosRelacionados.vue";
import Comentarios from "./Comentarios/Comentarios.vue"
import RadicadosAsociados from './Radicados/RadicadosConsulta.vue'
import InformacionGeneral from "./InformacionGeneral/InformacionGeneral.vue";
import { sgdeaAxios } from "src/services";
import { DocsRadicados, DocumentoRadicado, DataSteps } from "src/interfaces";
import moment from 'moment';
import { useAuthStore } from "src/stores/auth.store";
import { crearTrazabilidad } from 'src/helpers/trazabilidad';

const props = withDefaults(defineProps<{
    idDetalle: any,
}>(), {
})

const emit = defineEmits(['closeComp'])

const auth = useAuthStore()
const route = useRoute();
const router = useRouter();
const showRoute = ref(props.idDetalle);
const trazabilidadData = ref<any[]>([])
const storeStatus = useStateStore();
const tutelaData = useLastTutelaStore()
const moverForm = ref()
const etapaOp = ref([])
const showModalMover = ref(false)
const state = storeToRefs(storeStatus);
const reloadData = ref(false)
const isEditing = ref(false)
const confirmMover = ref(false)
const doc = ref(false)
const reabrirRadicadoModal = ref(false)
const tab = ref("vistaInformacionGeneral");
const stepsEtapaProcesal: Ref<DataSteps[]> = ref([]);
const stepName = ref('Avoco');
const idEtapaProcesal = ref(null);
const asignar = ref([]);
const departmentsList = ref([])
const loaded = ref(true);
let showModal = ref(false);
const status = ref("");
const detalleTutela: Ref<Partial<ITutelaDetalles>> = ref({});
const infoGestion = ref({})
const showModalCancel = ref(false);
const idDocuments = ref()
const listDocs = ref([])
const municipiosList = ref([])
const nameDocument = ref(null)
const tiposDocumentos = ref()
const radicados = ref([])
const hasEtapa = ref(false)
const iframePdfUrl = ref()
const visualizadorPDF = ref(false)
const loadingDocs = ref(true)
const formMover = ref({
  etapaId: null,
  observacion: null
})

const headers = {
  "Access-Control-Allow-Origin": "*",
  accept: "application/json",
  "Content-Type": "application/json",
};

async function getData(){

  await getTutelaStatus();

  etapaOp.value = (await sgdeaAxios.get("/tutela/listadoEtapaProcesal")).data.map((item) => {return {value: item.id, label: item.nombre}})
  detalleTutela.value = (
    await sgdeaAxios.get(`/tutela/info/${props.idDetalle}`, {})
  ).data;

  radicados.value = (
    await sgdeaAxios.get(`/tutela/listadoEtapaProcesalXTutela/${detalleTutela.value.idTutela}`)
  ).data

  try {
    const { data } = await sgdeaAxios.get<DocsRadicados>(
      '/api/v1/integracion/bonita/models/tipoidentificacion'
    );

    tiposDocumentos.value = data.map((it) => ({
      value: it.id,
      label: it.nombre
    }))


    infoGestion.value = await sgdeaAxios.get('/api/v1/integracion/bonita/tutela/' + detalleTutela.value.codigoProceso)
  } catch (error) {
    console.error(error);
  }
  status.value = detalleTutela.value.estado
  useLastTutelaStore().saveTutela(detalleTutela.value);
  detalleTutela.value = useLastTutelaStore().getTutela();
  await getAllRegisters();
}

async function editSuccess(){
  isEditing.value = false
  getData()
}

onMounted(async () => {
  await getData()
});

onBeforeMount(async () => {

  await getDepartments();
  await getMunicipios();
  await getEtapasProcesales();

  const findDeparment = departmentsList.value.find((it) => it.label === detalleTutela.value.departamento)?.value;
  const findMunicipio = municipiosList.value.find((it) => it.label === detalleTutela.value.municipio)?.value;


  const updateTutelasData = {
    ...detalleTutela.value,
    departamento: findDeparment,
    municipio: findMunicipio,
  }

  useLastTutelaStore().saveTutela(updateTutelasData);
  detalleTutela.value = useLastTutelaStore().getTutela();
})

const reabrirRadicado = async () => {



  try {
        const cierreGestion = await sgdeaAxios.patch(`/tutela/ReabrirGestion?tutelaId=${detalleTutela.value.idTutela}`)
        if (cierreGestion.status == 200) {
            await crearTrazabilidad({
                proceso: `TUT${detalleTutela.value.idTutela}`,
                secuencia: detalleTutela.value.idRadicado,
                estado: cierreGestion.data.estado,
                nombre: auth.$state.userInfo.name,
                comentario: 'Se ha reabierto la gestión',
                descripcion: `Usuario: ${auth.$state.userInfo.name} \n` +
              `Descripción: Se ha reabierto la gestión del radicado ${detalleTutela.value.idRadicado}`,
                accion: `${auth.$state.userInfo.name} ha reabierto la gestión del radicado ${detalleTutela.value.idRadicado}`,
                tramite: "Tutela"
            })
            toast.success("El radicado fue Reabierto para gestión exitosamente")
        }
    } catch (error) {
        toast.error("Error al reabrir gestión intente de nuevo")
        console.error(error);
    }
}

const getTutelaStatus = async () => {
  const { data } = await sgdeaAxios.get<any>(
    `/tutela/tutelastatus/${props.idDetalle}`
  );
  await storeStatus.setDataState(data);
  status.value = storeStatus.getTutelaState()
}

const getBlobToIframe = async (id) => {
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

  iframePdfUrl.value = URL.createObjectURL(blob);

  visualizadorPDF.value = true
}

function cancelarMover(){
  formMover.value = {
    etapaId: null,
    observacion: null
  }
  showModalMover.value = false
}

async function getAllRegisters() {
  const { data } = await sgdeaAxios.get<any>(
        `/tutela/${detalleTutela.value.idTutela}/archivos`
    );

    listDocs.value = data.map((it) => ({
        formato: /[^.]+$/.exec(it.nombre)[0],
        nombre: it.nombre,
        tipo: it.tipo,
        fecha: formatDateTimeStandTwo(it.fechaCreacion) + ' ' + currentHourWithoutSec(it.fechaCreacion),
        cargado_por: it.usuario,
        id: it.id,
        username: it.username,
        nodeId: it.nodeId,
        extension: it.extension
    }))

  loadingDocs.value = false

  // const { data } = await intescoAxios.get<DocsRadicados>(
  //   'bandeja/consultarDocsRadicados?filtro=tutelas'
  // );

  // const documentData = data.result.radicado?.find((item) => (item.node.entry.name === tutelaData.data.idRadicado))

  // //const documentData = data.result.radicado?.find((item) => (item.node.entry.name === "TUT2023339321"))

  // idDocuments.value = documentData.node?.entry.id

  // listDocs.value = documentData?.anexos.map((it) => ({
  //   formato: it.nombreAnexo.split('.')[1],
  //   nombre: it.nombreAnexo,
  //   id: it.docAnexo,
  // }))

  // const resp = await sgdeaAxios.get<DocsRadicados>(
  //   `radicados/consultar_documento/449c4084-ed87-4f8b-87d7-1b95ce897d45`
  // );

  // listDocs.value = listDocs.value.map((it) => ({
  //   ...it,
  //   fecha: formatDate(resp.data.fecha_recepcion),
  //   documento: resp.data.documento
  // }))

}

async function moverTutela(){
  if(await moverForm.value.validate()){
     //formExcluir.value.codigoProceso = re
     const formdata = {
      tutelaId: detalleTutela.value.idTutela,
      etapaId: formMover.value.etapaId.value
     }
     const response = await sgdeaAxios.patch(`/tutela/moverTutelaNuevaEtapaProcesal`, formdata);
     if(response.status == 200){
      toast.success('Se movió el radicado correctamente')
      confirmMover.value = false
      await crearTrazabilidad({
        proceso: `TUT${detalleTutela.value.idTutela}`,
        secuencia: detalleTutela.value.idRadicado,
        estado: detalleTutela.value.estado,
        descripcion: `Usuario: ${auth.$state.userInfo.name} \n` +
              `Motivo: ${formMover.value.observacion}`,
        comentario: formMover.value.observacion,
        nombre: useAuthStore().$state.userInfo.name,
        tramite: 'Tutela',
        accion: `${auth.$state.userInfo.name} ha movido el radicado ${detalleTutela.value.idRadicado} a la etapa procesal ${formMover.value.etapaId.label}`,
      })
      cancelarMover()
      getData()
     }
  } else {
    toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos')
      return;
  }
}

async function validateMover(){
  if(await moverForm.value.validate()){
    confirmMover.value = true
  } else {
    toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos')
      return;
  }
}

const getDepartments = async () => {
  const { data } = await sgdeaAxios.get<DocsRadicados>(
    'api/v1/integracion/bonita/models/departamentosBonitaXNombre?p=0&c=1000'
  );
  departmentsList.value = data.map((it) => ({
    label: it.nombre,
    value: it.persistenceId
  }))
}

watch(tab, async (val) => {
  if (val === "trazabilidad") {

    const { data } = await sgdeaAxios.get(`/tutela/info/${showRoute.value}`);
    const response = await sgdeaAxios.get('/trazabilidad/obtenerPorCodProceso/' + 'TUT' + data.idTutela);

    if (!response?.data || response.data.length === 0) {
      trazabilidadData.value = [];
      return;
    }

    trazabilidadData.value = response.data.sort((a, b) => a.id - b.id).map((item, index) => ({
      ...item,
      detalle: item.detalle,
    }));
  }
})

const getMunicipios = async () => {
  const { data } = await sgdeaAxios.get<DocsRadicados>(
    'api/v1/integracion/bonita/models/municipiosBonitaXNombre?p=0&c=1000'
  );
  municipiosList.value = data.map((it) => ({
    label: it.nombre,
    value: it.persistenceId
  }))
}

const getEtapasProcesales = async () => {
  const { data } = await sgdeaAxios.get<DataSteps[]>(
    `api/v1/integracion/bonita/models/tutelaPorCodigoProceso/${tutelaData.data.codigoProceso}`
  );

  stepsEtapaProcesal.value = data;

  if (data) {
    idEtapaProcesal.value = stepsEtapaProcesal.value.find((it) => it.nombre === stepName.value)?.persistenceId;
  }
}

const download = async (id) => {

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

};

const handleSteps = (item: string, id) => {
  stepName.value = item;
  idEtapaProcesal.value = id;
}

const handleModal = () => {
  showModalCancel.value = false;
};

const findRoles = (role) => {
  var nomenclatura = [
    'Administrador', //0
    'Asignador Responsable', //1
    'aprobador_sgdea', //2
    'Gestionador', //3
    'Radicador - Web', //4
    'Aprobador', //5
    'Asignador Lider', //6
    'Administrador de Trámite' //7
  ]
  var valid = false
  role.forEach(element => {
    if (useAuthStore().$state.userInfo.role?.includes(nomenclatura[element])) {

      valid = true
    }
  });
  return valid
}

</script>

<style></style>
