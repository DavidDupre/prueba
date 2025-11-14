<template>
  <q-page class="tw-pt-6">
    <div>
      <router-link to="/medicina/bandeja-comunicaciones">
        <q-btn flat color="primary" label="Volver" icon="chevron_left" class="-tw-ml-2" />
      </router-link>
    </div>

    <div class="tw-flex tw-items-center">
      <div class="tw-flex tw-w-full tw-justify-between ">
        <div>
          <ComponentTitle class="tw-mt-1" :title="`Comunicaciones oficiales`" classTitle="tw-font-bold tw-text-4xl" />

          <div :class="`tw-inline-block tw-p-1.5 tw-px-4 tw-rounded-lg tw-border ${ESTADOS[state]}`">
            <span class='tw-font-semibold'>{{ state }}</span>
          </div>
        </div>
      </div>
    </div>

    <q-card class="tw-mt-8" flat>
      <q-tabs v-model="tab" no-caps inline-label indicator-color="transparent" active-color="primary" align="left"
        outside-arrows class="tw-rounded-lg tw-bg-white custom-tabs tw-flex">
        <div v-for="tab in filteredTabs">
          <q-tab :icon="tab.icon" :key="tab.key" :name="tab.key" square :ripple="false"
            class="tw-rounded-lg q-pa-sm tw-text-sm tw-px-3 tw-text-[#6B737C]" :label="tab.name" />
        </div>
      </q-tabs>
    </q-card>

    <CrearCorrespondenciaModal @update:showModal="val => showFormModalComunication = val"
      :showModal="showFormModalComunication" @create-new-communication="handleNewCommunicationInfo" />

    <q-tab-panels v-model="tab" animated class="tw-bg-transparent">
      <q-tab-panel name="documento-salida" class="q-pa-none">
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <DocumentoSalidaEmpty v-if="tipoPlantillaSeleted === 0" :mlData="allData"
            @update-parrafo-text="(value) => updateHtmldoc = value" @updated="getAllData(true)" />
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="metadatos" class="q-pa-none">
        <q-form greedy ref="myForm0">
          <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
            <p class="tw-text-2xl tw-font-bold tw-pb-4 ">
              Metadatos
            </p>
            <MetadatosForm :form="formGeneralData" :key="isErrasedMeta" @get-person="myForm0.reset()" />
          </q-card>
        </q-form>
      </q-tab-panel>

      <q-tab-panel name="datos-salida" class="q-pa-none">
        <q-form ref="myForm10" greedy>
          <q-card v-if="stepDataSend === 0" class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
            <p class="tw-text-2xl tw-font-bold tw-pb-4 ">
              Destinatarios
            </p>
            <FormFormDatosSalida :disable-options="false" :data-initial="formExitData" @get-person="myForm10.reset()" />
          </q-card>

          <q-card v-if="stepDataSend === 1" class="q-mt-md tw-rounded-xl q-pa-lg" flat>
            <p class="tw-text-2xl tw-font-bold tw-pb-4 ">
              Copia
            </p>
            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label tw-font-semibold">¿Con copia?*</label>
                  <q-select map-options emit-value dense outlined class="tw-rounded-lg" v-model="formExitData.copyType"
                    :options="copiesTypesOptions" label="Seleccione" :rules="[inputRequired]" />
                </span>
              </div>
            </div>
          </q-card>

          <div v-if="[1, 4].includes(Number(formExitData.copyType)) && stepDataSend === 1">
            <q-card class="q-mt-md tw-rounded-xl q-pa-lg" flat>
              <p class="tw-text-2xl tw-font-bold tw-pb-4 ">
                Copia Interna
              </p>
              <FormCopyInterna :is-fisr-render="isFisrRenderInterno" :id-comunicacion="idComunicacion"
                :key="isFormResetInterno" @update:item-added="(form) => handleClickAddNewDestinaryInterno(form)"
                :is-errased="isErrased" />
            </q-card>

            <q-card class="q-mt-md tw-rounded-xl q-pa-lg" flat>
              <TableDestinatarios key="bodyCopyInterna" class="full-width"
                :JUZGADOS_HEADER="DESTINARIOS_HEADER_COPY_INTERNA" :JUZGADOS_BODY="sortOptionsVal(bodyCopyInterna)"
                @update:item-deleted="(value) => bodyCopyInterna = value" />
            </q-card>
          </div>

          <div v-if="[2, 4].includes(Number(formExitData.copyType)) && stepDataSend === 1">
            <q-card class="q-mt-md tw-rounded-xl q-pa-lg" flat>
              <p class="tw-text-2xl tw-font-bold tw-pb-4 ">
                Copia Externa
              </p>
              <FormCopyExterna :is-fisr-render="isFisrRender" :id-comunicacion="Number(idComunicacion)"
                :is-medicina-laboral="true" :key="isFormResetExterno"
                @update:item-added="(form) => handleClickAddNewDestinaryExterno(form)" :is-errased="isErrased" />
            </q-card>

            <q-card class="q-mt-md tw-rounded-xl q-pa-lg" flat>
              <TableDestinatarios key="bodyCopyExterna" class="full-width" title="Usuarios externos con copia"
                :JUZGADOS_HEADER="DESTINARIOS_HEADER_COPY_EXTERNA" :JUZGADOS_BODY="bodyCopyExterna"
                @update:item-deleted="(value) => bodyCopyExterna = value" />
            </q-card>
          </div>

          <FormEditor v-if="stepDataSend === 2" :data-initial="formExitData" />
        </q-form>
      </q-tab-panel>

      <q-tab-panel name="adjuntar-documento" class="q-pa-none">
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <p class="tw-text-2xl tw-font-bold tw-pb-4 ">
            Adjuntar documentos de Salida
          </p>
          <div class="col-12">
            <span class="tw-w-full">
              <p class="tw-mb-1 tw-pl-3">Adjuntar archivos</p>
              <FileLoader v-model="formDatosAdjuntos.files" class="tw-w-full" :multiple="true"
              sub-title="Puede adjuntar (30) Archivo(s) cada uno con un tamaño permitido de 50MB en cualquiera de las siguientes extenciones <hr>(pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)"
                accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg" :max-file-size="50 * 1024 * 1024"
                :max-files="30" max-file-size-label="50" @rejected="rejectedFiles" />
            </span>
          </div>
        </q-card>

        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <TableDocuments :is-change-doc-type="false" :key="fileDataTable" class="full-width"
            :JUZGADOS_HEADER="DOCUMENTOS_HEADER" :JUZGADOS_BODY="fileDataTable"
            @update:item-deleted="(value) => handleDelteFileTable(value)" />
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="incluir-exp">
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <IncluirExpediente :com-data="allData" @update:is-expediente="getExpediente" />
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="trazabilidad">
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <Trazabilidad :id-comunicacion="idComunicacion" />
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="comentarios">
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <Comentarios :estado="state" :secuencia="secuencia" :id-comunicacion="idComunicacion"
            text-default="Ha comentado sobre la comunicación" :show-modal="noteModal" @closeModal="noteModal = false" />
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="enviar-revision">
        <q-form ref="myForm20" greedy>
          <FormRevision :data-initial="formRevision" @update:item-selected="val => userSeletecdByRevision = val" />
          <TableOnlyShow v-if="isComunicacionAutomatica" :TABLE_HEADER="columnsAsignar2"
            :TABLE_BODY="aprobadorSelected" />
          <FormAprobacion v-else :data-initial="formAprobacion"
            @update:item-selected="val => userSeletecdByAprobacion = val" />
        </q-form>
      </q-tab-panel>
    </q-tab-panels>

    <div v-if="!['documento-salida', 'incluir-exp', 'comentarios', 'trazabilidad'].includes(tab)"
      class="tw-flex tw-justify-center tw-items-center tw-my-10 tw-gap-6">
      <q-btn v-if="tab === 'datos-salida' && stepDataSend" @click="handleComeBack()" label="Regresar" text-color="white"
        style="width: 240px" color="primary" class="tw-rounded-xl tw-h-12 tw-p-2" />

      <q-btn @click="showCancelModal = true" :label="'Cancelar'" type="reset" style="width: 240px" text-color="black"
        color="accent" class="tw-rounded-xl tw-h-12" />

      <q-btn v-if="stepDataSend !== 1" @click="next()"
        :label="(tab === 'datos-salida') ? labelBtnDatosSalida : 'Guardar'" text-color="white" style="width: 240px"
        color="primary" class="tw-rounded-xl tw-h-12 tw-p-2" />

      <q-btn v-if="tab === 'datos-salida' && stepDataSend === 1 && activeButtonCopy" @click="next()"
        :label="(tab === 'datos-salida') ? labelBtnDatosSalida : 'Guardar'" text-color="white" style="width: 240px"
        color="primary" class="tw-rounded-xl tw-h-12 tw-p-2" />
    </div>

    <Modal v-model:model-value="showCancelModal" title="Confirmación"
      :text="'Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?'"
      :is-success="false" :cancelButton="true" @handle-accept="handleAcceptModal" textButtonCancel="No"
      text-button="Si" />

    <!-- ! Compromisos Proximos -->
    <q-dialog v-model="showModalCompromisos" backdrop-color="rgba(0, 0, 0, 0.5)" persistent>
      <q-card class="tw-w-full mx-auto tw-rounded-md">
        <q-form ref="formModalSalida" greedy>
          <q-card-section class="tw-px-8">
            <div class="tw-text-xl tw-font-bold tw-text-[#0a1b48] tw-mb-4 tw-mt-4">Compromisos próximos</div>
            <label class="tw-block tw-text-sm tw-font-bold tw-text-[#777e87]">Compromisos próximos *</label>
            <q-select :options="[{ label: 'Si', value: true }, { label: 'No', value: false }]" outlined label="Inserte"
              dense map-options v-model="formModal.compromisos" :rules="[inputRequired]" />
            <label class="tw-text-sm tw-font-bold tw-text-[#777e87]">Observaciones</label>
            <span v-if="formModal.compromisos?.label == 'Si'" class="tw-text-sm tw-font-bold tw-text-[#777e87]">
              *</span>
            <q-input type="textarea" outlined label="Seleccione" dense v-model="formModal.observaciones"
              :rules="[(v) => maxLengthInput(10000, v), formModal.compromisos?.label ? inputRequired : null]"
              :disable="formModal.compromisos?.label == 'No'" />
          </q-card-section>
          <div class="tw-flex tw-justify-center tw-items-center tw-pb-6 tw-gap-3">
            <q-btn flat label="Cancelar" color="secondary" class="tw-w-[40%] tw-h-10"
              @click="showModalCompromisos = false" />
            <q-btn label="Guardar" color="secondary" class="tw-w-[40%] tw-h-10" @click="handleSubmitCompromisos" />
          </div>
        </q-form>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { ref, onMounted, watch } from "vue";
import CrearCorrespondenciaModal from "src/components/Modal/CrearComunicacionModalML.vue";
import { useAuthStore } from "src/stores/auth.store";
import ComponentTitle from "src/components/ComponentTitle/ComponentTitle.vue";
import FormFormDatosSalida from "./DatosSalida/FormDatosSalida.vue";
import { useCrearComunicacionesLogic } from "src/pages/Correspondencia/Crear/CrearComunicaciones/CrearComunicaciones.Logic";
import FormCopyExterna from './DatosSalida/FormCopyExterna.vue';
import FormCopyInterna from './DatosSalida/FormCopyInterna.vue';
import TableDestinatarios from './DatosSalida/TableDestinatarios.vue';
import IncluirExpediente from './Expediente/IncluirExpediente.vue'
import FormEditor from 'src/components/comunicacion/FormEditorML.vue';
import {
  DOCUMENTOS_HEADER, DESTINARIOS_HEADER_COPY_INTERNA, dictionaryTypeCopy,
  DESTINARIOS_HEADER_COPY_EXTERNA, objResponse
} from 'src/pages/Correspondencia/Crear/CrearComunicaciones/const';
import MetadatosForm from 'src/components/medicina_laboral/MetadatosForm.vue';
import { inputRequired, maxLengthInput } from "src/helpers/validations";
import { toast } from 'src/helpers/toast';
import moment from "moment";
import Modal from 'src/components/Modal/Modal.vue'
import { sgdeaAxios } from "src/services";
import FileLoader from "src/components/FormFields/FileLoader.vue";
import TableDocuments from 'src/components/comunicacion/TableDocML.vue';
import FormAprobacion from 'src/components/comunicacion/FormAsigancionML.vue';
import TableOnlyShow from 'src/components/Tables/TableOnlyShow.vue';
import { columnsAsignar2 } from "src/pages/Facturacion/cobro";
import FormRevision from 'src/components/comunicacion/FormRevisionML.vue';
import Trazabilidad from "src/pages/MedicinaLaboral/comunicaciones/Trazabilidad.vue";
import Comentarios from "src/pages/MedicinaLaboral/comunicaciones/Comentarios.vue";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { useDepartments, useMunicipalities, useCountries } from "src/composables/useVersion";
import { ESTADOS } from 'src/assets/estados/estados';
import { getAcronimobyDoc } from "src/helpers/prefijoTipoDoc";


const showModalCompromisos = ref(false)
const municipioOptions = ref([]);
const { optionsCountries } = useCountries()
const departmentsOptions = ref([]);
const noteModal = ref(false);
const isFisrRenderInterno = ref(true)
const isFisrRender = ref(true)
const aprobadorSelected = ref([])
const isComunicacionAutomatica = ref(false)
const isSendCopies = ref(false)
const idSendDatos = ref(false)
const isSendContenidoDoc = ref(false)
const secuencia = ref('')
const fileDataTable = ref();
const userSeletecdByRevision = ref()
const userSeletecdByAprobacion = ref()
const idMedatadoSave = ref()
const labelBtnDatosSalida = ref('Siguiente');
const bodyCopyInterna = ref([]);
const bodyCopyExterna = ref([]);
const isFormResetInterno = ref(0);
const isFormResetExterno = ref(0);
const showCancelModal = ref(false)
const stepDataSend = ref(0)
const state = ref('En edición')
const auth = useAuthStore();
const firstname = auth.userInfo.name.split(' ')[0]
const lastname = auth.userInfo.name.split(' ')[1]
const idComunicacion = ref()
const tab = ref("metadatos");
const showFormModalComunication = ref(true);
const tipoPlantillaSeleted = ref(1)
const updateHtmldoc = ref(null)
const shippingMethodsOptions = ref([])
const copiesTypesOptions = ref([])
const myForm0 = ref(null)
const myForm10 = ref(null)
const myForm20 = ref(null)
const formModalSalida = ref(null)
const updateTypeCopy = ref(null)
const sendMetadatos = ref(false)
const countMetadatosbyUpdate = ref(0)
const countDatosSalidabyUpdate = ref(0)
const countDatosSalidaUsersbyUpdate = ref(0)
const countDatosSalidaCorreobyUpdate = ref(0)
const router = useRouter()
const allData = ref()
const isErrased = ref(false)
const isErrasedMeta = ref()
const getCopy = ref(null)
const activeButtonCopy = ref(false)
const isExpedientes = ref()
const formModal = ref({
  compromisos: null,
  observaciones: '',
})

const formAprobacion = ref({
  observacionesAprobacion: '',
});

const formRevision = ref({
  observacionesRevision: '',
});

const formDatosAdjuntos = ref({
  files: [],
});

const objKeys = {
  asunto: "asunto",
  tipoDocumento: "tipoDocumento",
  nombreAfectado: "afectado",
  numeroDocumento: "numeroDocumento",
  radNumero: "listMl",
  date: "fechaSiniestro",
  origen: "origenEvento",
  evento: "tipoEvento",
  numeroSiniestro: "listSiniestro",
}

const originFormGeneralData = {
  asunto: "",
  tipoDocumento: "",
  nombreAfectado: "",
  numeroDocumento: "",
  radNumero: [],
  date: "",
  origen: "",
  evento: "",
  numeroSiniestro: [],
}

const formGeneralData = ref({ ...originFormGeneralData })

const originalFormExitData = {
  asunto: '',
  anexos: '',
  datosSalidaFormaEnvioId: '',
  datosSalidaTipoDocumentoDestinatarioId: '',
  datosSalidaNumeroDocumentoDestinatario: '',
  datosSalidaNombreDestinatario: '',
  datosSalidaDireccion: '',
  datosSalidaPaisId: { value: 425, label: 'Colombia' },
  datosSalidaDeptoId: '',
  datosSalidaMunicipioId: '',
  datosSalidaCorreo: '',
  datosSalidaTelefono: '',
  asuntoCorreo: '',
  contenidoCorreo: '',
  copyType: "",
}

const formExitData = ref({ ...originalFormExitData })

const datosSalida = ref({
  destinatario: {
    nombre: '',
    direccion: '',
    numero_celular: '',
    asunto: '',
    anexos: '',
    departamento: '',
    municipio: '',
    copiesExterna: [],
    copiesInterna: [],
    radNumero: '',
    shippingMethod: '',
  }
})

const formRefs = ref({
  "metadatos": [myForm0],
  "datos-salida": [myForm10],
  "enviar-revision": [myForm20],
});

const filteredTabs = ref([
  { key: "metadatos", name: "Metadatos", icon: "fa-solid fa-database" },
  { key: "datos-salida", name: "Datos de Salida", icon: "account_tree" },
  { key: "documento-salida", name: "Documento de Salida", icon: "post_add" },
  { key: "adjuntar-documento", name: "Adjuntar documentos de salida", icon: "attach_file" },
  { key: "incluir-exp", name: "Incluir Expediente", icon: "adf_scanner" },
  { key: "enviar-revision", name: "Enviar a Revisión", icon: "assignment_turned_in" },
  { key: "trazabilidad", name: "Trazabilidad", icon: "history" },
  { key: "comentarios", name: "Comentarios", icon: "forum" }
]);

const validationsTypeCopy = (copy) => {
  updateTypeCopy.value = copy
  formExitData.value.copyType = updateTypeCopy.value
}

onMounted(async () => {
  await getAllData(false)
  // @ts-expect-error
  departmentsOptions.value = (await useDepartments().then(({ optionsDepartments }) => optionsDepartments)).value
});

const getAllData = async (isUpdate: boolean) => {
  const { getCopiesTypesOptions, getShippingWayOptions, getAllDataByID } = useCrearComunicacionesLogic();
  const promises = isUpdate ? [getCopiesTypesOptions(), getAllDataByID(idComunicacion.value)] : [getCopiesTypesOptions()]

  // @ts-expect-error
  const [copias, allDataLoaded] = await Promise.allSettled(promises);
  allData.value = allDataLoaded?.value

  if (!sendMetadatos.value) {
    removeButton("datos-salida")
    removeButton("incluir-exp")
    removeButton("adjuntar-documento")
    removeButton("documento-salida")
    removeButton("trazabilidad")
    removeButton("comentarios")
    removeButton("enviar-revision")
  } else {
    addButton('datos-salida', 'Datos de Salida', 'account_tree')
    addButton('documento-salida', 'Documento de Salida', 'post_add')
    addButton('adjuntar-documento', 'Adjuntar documentos de salida', 'attach_file')
    addButton('incluir-exp', 'Incluir Expediente', 'adf_scanner')
    addButton('trazabilidad', 'Trazabilidad', 'history')
    addButton('comentarios', 'Comentarios', 'forum')
    addButton('enviar-revision', 'Enviar a Revisión', 'assignment_turned_in')
  }

  if (isUpdate) {
    await getAllDocs()
    await getExpediente()
  }

  if (allDataLoaded?.value?.metadatos) {
    mapDataToFormMetadatos(allDataLoaded?.value?.metadatos)
  }

  if (allDataLoaded?.value) {
    validationsTypeCopy(allDataLoaded?.value?.tipoCopia)
    getCopy.value = allDataLoaded?.value?.tipoCopia
  }

  if (allDataLoaded?.value?.docSalida) isSendContenidoDoc.value = true


  if (allDataLoaded?.value?.listCopia?.interna?.length) {
    const mapUserInterno = allDataLoaded?.value?.listCopia?.interna.map((e) => {
      return {
        id: `${e.usuario.id}-${e.dependencia.idSeccionSubSeccion}`,
        official: e.usuario.id,
        dependencieType: e.dependencia.idSeccionSubSeccion,
        dependencia_label: e.dependencia.nombre,
        nombre_label: e.usuario.firstname + ' ' + e.usuario.lastname,
      }
    })

    handleClickAddNewDestinaryInterno(mapUserInterno)
  }

  if (allDataLoaded?.value?.listCopia?.externa?.length) {
    const mapUserExterno = allDataLoaded?.value?.listCopia?.externa.map((e) => {
      return {
        emailRecipientCopyExterna: e.correoDestinatario,
        shippingMethodCopyExterna: e.formaEnvio.id,
        recipientDocumentTypeCopyExterna: { id: e.tipoDocumento.id, nombre: e.tipoDocumento.nombre },
        recipientNameCopyExterna: e.nombreDest,
        addressRecipientCopyExterna: e.direccionDestinatario,
        countryRecipientCopyExterna: { label: e.pais.nombre, value: e.pais.idPais },
        departmentRecipientCopyExterna: e.departamento.idDepartamento,
        municipalityRecipientCopyExterna: e.municipio.idMunicipio,
        telephoneRecipientCopyExterna: e.telefonoDestinatario,
        municipio_label: e.municipio.nombre,
        departamento_label: e.departamento.nombre,
        forma_label: e.formaEnvio.forma,
        tipo_label: e.tipoDocumento.nombre
      }
    })

    handleClickAddNewDestinaryExterno(mapUserExterno)
  }

  // ! Asunto
  const prefijoAsunto = allDataLoaded?.value.prefijo?.prefijo?.nombre || ''
  const nameEnterprise = 'Positiva S.A'
  const tipoDocAsunto = getAcronimobyDoc(allDataLoaded?.value?.metadatos?.tipoDocumento?.nombre)
  const numDocAsunto = allDataLoaded?.value?.metadatos?.numeroDocumento
  const nombreAsunto = allDataLoaded?.value?.metadatos?.afectado
  const gestionadorOficinaAsunto = allDataLoaded?.value?.idRadicador?.usuarioRelaciones?.[0]?.oficina?.nombre || '';
  const radicadoAsunto = allDataLoaded?.value.idRadicado

  const partesAsunto = [prefijoAsunto, tipoDocAsunto, numDocAsunto, nombreAsunto].filter(Boolean)
  const asunto1 = partesAsunto.join(' - ').trim()
  const asunto2 = [nameEnterprise, ...partesAsunto, gestionadorOficinaAsunto, radicadoAsunto].filter(Boolean).join(' - ').trim()

  formExitData.value.asunto = asunto1
  formExitData.value.asuntoCorreo = asunto2
  formExitData.value.anexos = allDataLoaded?.value?.anexos

  copiesTypesOptions.value = copias?.value
  shippingMethodsOptions.value = await getShippingWayOptions()
}

const getAllDocs = async () => {
  const response = await sgdeaAxios.get(`/medicina/getAnexosCargados/${idComunicacion.value}`)
  fileDataTable.value = mapDataToFileDataTable(response.data.listaAnexos)
}

const getExpediente = async () => {
  const { data: expediente } = await sgdeaAxios.get("/expediente/children", {
    params: { nodeId: allData.value?.nodeIdCarpeta }
  });

  if (Object.keys(expediente).length) isExpedientes.value = true
  else isExpedientes.value = false
}

const handleDelteFileTable = async (filesId) => {
  try {
    fileDataTable.value = [...fileDataTable.value.filter(file => filesId !== file.id)]
  } catch (error) {
    toast.error(objResponse.default_error)
  }
}

const handleNewCommunicationInfo = async (comunicacionInfo) => {

  if (comunicacionInfo.prefijoComunicacion?.value !== 1) {
    isComunicacionAutomatica.value = comunicacionInfo.prefijoComunicacion?.aprobacionAutomatica
    aprobadorSelected.value = [{
      id: comunicacionInfo.prefijoComunicacion.idAprobador,
      grupo: comunicacionInfo.prefijoComunicacion.grupo,
      colaborador: comunicacionInfo.prefijoComunicacion.nameAprobador,
      cargo: 'Aprobador'
    }]
    showFormModalComunication.value = false
  }

  if (!comunicacionInfo.tipoPlantilla) {
    tipoPlantillaSeleted.value = 0
  } else {
    tipoPlantillaSeleted.value = comunicacionInfo.tipoPlantilla?.value || 1
  }

  const oficinaName = auth.userInfo.relations.find(e => e.idOficina === auth.userInfo.oficina).oficina

  const objToSend = {
    nombre: comunicacionInfo?.nombreComunicacion,
    tipoComunicacion: comunicacionInfo?.tipoComunicacion,
    prefijo: comunicacionInfo.prefijoComunicacion?.value === 1 ? null : comunicacionInfo.prefijoComunicacion?.value,
    nodeIdPlantilla: comunicacionInfo.prefijoComunicacion?.plantilla || comunicacionInfo.tipoPlantilla,
    oficinaRadicador: oficinaName,
    procesoId: comunicacionInfo.proceso.value,
    subProcesoId: comunicacionInfo.subProceso.value,
  }

  try {
    await generarSecuencia()
    const { data } = await sgdeaAxios.post('/medicina/crearComunicacion', { ...objToSend, idRadicador: auth.userInfo.userid, idRadicado: secuencia.value, estado: 'En edición' });
    allData.value = data
    idComunicacion.value = data.id
    showFormModalComunication.value = false
    router.push(`/medicina/comunicaciones/${idComunicacion.value}`)

    await crearTrazabilidad({
      proceso: `MLCOM${idComunicacion.value}`,
      secuencia: secuencia.value,
      estado: state.value,
      descripcion: `El gestionador a comenzado la comunicación`,
      comentario: 'Comenzó comunicación',
      nombre: `${firstname} ${lastname}`,
      tramite: 'Medicina laboral comunicaciones',
      accion: `Se ha comenzado la comunicación comunicación`
    })

    await getAllData(true)
  } catch (error) {
    console.error(error)
    toast.error(objResponse.default_error)
  }
}

async function handleAcceptModal() {
  if (['metadatos'].includes(tab.value)) {
    if (countMetadatosbyUpdate.value === 0) {
      formGeneralData.value = { ...originFormGeneralData }
      isErrasedMeta.value++
    } else {
      await getAllData(true)
    }
  }

  if (['documento-salida', 'adjuntar-documento', 'enviar-revision'].includes(tab.value)) {
    tab.value = 'metadatos'
  }

  if (['datos-salida'].includes(tab.value)) {
    tab.value = 'metadatos'

    if (countDatosSalidabyUpdate.value === 0) {
      formExitData.value = { ...originalFormExitData }
      await getAllData(true)
    } else {
      await getAllData(true)
    }

    if (countDatosSalidaUsersbyUpdate.value === 0) {
      formExitData.value.copyType = ''
      bodyCopyInterna.value = []
      bodyCopyExterna.value = []
    } else {
      bodyCopyInterna.value = []
      bodyCopyExterna.value = []
      await getAllData(true)
    }

    if (countDatosSalidaCorreobyUpdate.value === 0) {
      isErrased.value = true
    } else {
      await getAllData(true)
    }

    stepDataSend.value = 0
  }

  showCancelModal.value = false
}

const submitDestinatarios = async () => {
  const objToSend = {
    asunto: formExitData.value.asunto,
    formaEnvio: formExitData.value.datosSalidaFormaEnvioId,
    tipoDocumento: formExitData.value.datosSalidaTipoDocumentoDestinatarioId,
    numeroDocumento: formExitData.value.datosSalidaNumeroDocumentoDestinatario,
    nombreDestinatario: formExitData.value.datosSalidaNombreDestinatario,
    direccionDestinatario: formExitData.value.datosSalidaDireccion,
    paisDestinatario: typeof formExitData.value.datosSalidaPaisId === 'object'
      ? formExitData.value.datosSalidaPaisId.value
      : formExitData.value.datosSalidaPaisId,
    departamentoDestinatario: typeof formExitData.value.datosSalidaDeptoId === 'string'
      ? null
      : formExitData.value.datosSalidaDeptoId,
    municipioDestinatario: typeof formExitData.value.datosSalidaMunicipioId === 'string'
      ? null
      : formExitData.value.datosSalidaMunicipioId,
    telefonoDestinatario: +formExitData.value.datosSalidaTelefono || null,
    correoDestinatario: formExitData.value?.datosSalidaCorreo || null,
  }

  try {
    const response = countDatosSalidabyUpdate.value === 0
      ? await sgdeaAxios.post(`/medicina/crearComunicacionesDestinatarios/${idComunicacion.value}`, objToSend)
      : await sgdeaAxios.put(`/medicina/putComunicacionesDestinatarios/${idComunicacion.value}`, objToSend)

    countDatosSalidabyUpdate.value++

    if (response.status === 200 || response.status === 201) {
      await crearTrazabilidad({
        proceso: `MLCOM${idComunicacion.value}`,
        secuencia: secuencia.value,
        estado: state.value,
        descripcion: `El gestionador a agregado destinatarios a la comunicación`,
        comentario: 'Agregar destinatarios',
        nombre: `${firstname} ${lastname}`,
        tramite: 'Medicina laboral comunicaciones',
        accion: `Se ha agregado destinatarios a la comunicación`
      })
      await getAllData(true)
      stepDataSend.value += 1
    }

    labelBtnDatosSalida.value = [3, 6].includes(Number(formExitData.value.datosSalidaFormaEnvioId)) ? 'Guardar' : 'Siguiente'
  } catch (error) {
    toast.error(objResponse.default_error)
  }
}

const buildArrayDestinatarios = (type) => {
  if (type === dictionaryTypeCopy[1]) {
    return ['ListacopiaInterna'];
  }

  if (type === dictionaryTypeCopy[2]) {
    return ['ListacopiaExterna'];
  }

  if (type === dictionaryTypeCopy[4]) {
    return ['ListacopiaInterna', 'ListacopiaExterna'];
  }
}

const buildFormDataListDestinatarios = (type) => {
  if (type === 'ListacopiaInterna') {
    return bodyCopyInterna.value.map(({ dependencia, nombre }) => {
      return {
        dependencia: dependencia,
        idUser: nombre
      }
    })
  }

  if (type === 'ListacopiaExterna') {
    return bodyCopyExterna.value.map(({ forma, tipo, nombre, direccion, pais, departamento, municipio,
      telefonoDestinatario, correoDestinatario }) => {
      return {
        formaEnvio: forma,
        tipoDocumento: tipo.id || tipo,
        nombreDestinatario: nombre,
        direccionDestinatario: direccion,
        paisDestinatario: pais.value,
        departamentoDestinatario: typeof departamento === 'string' ? 1 : departamento,
        municipioDestinatario: typeof municipio === 'string' ? 1 : municipio,
        telefonoDestinatario: telefonoDestinatario ? +telefonoDestinatario : null,
        correoDestinatario,
      }
    })
  }
}

const submitDatosSalidaCopia = async () => {
  const keys = buildArrayDestinatarios(dictionaryTypeCopy[formExitData.value.copyType])
  let objToSend = {
    listUser: [],
    externos: [],
    tipoCopia: formExitData.value.copyType
  }

  if (keys) {
    for (const key of keys) {
      if (key === 'ListacopiaInterna') {
        objToSend['listUser'] = buildFormDataListDestinatarios(key)
      }
      if (key === 'ListacopiaExterna') {
        objToSend['externos'] = buildFormDataListDestinatarios(key)
      }
    }
  }

  if (!objToSend.listUser.length) bodyCopyInterna.value = []
  if (!objToSend.externos.length) bodyCopyExterna.value = []

  try {
    const { data } = countDatosSalidaUsersbyUpdate.value === 0
      ? await sgdeaAxios.post(`/medicina/crearComunInterExter/${idComunicacion.value}`, objToSend)
      : await sgdeaAxios.put(`/medicina/putComunInterExter/${idComunicacion.value}`, objToSend)

    countDatosSalidaUsersbyUpdate.value++
    await crearTrazabilidad({
      proceso: `MLCOM${idComunicacion.value}`,
      secuencia: secuencia.value,
      estado: state.value,
      descripcion: `El gestionador a agregado copias a la comunicación`,
      comentario: 'Agregar copias',
      nombre: `${firstname} ${lastname}`,
      tramite: 'Medicina laboral comunicaciones',
      accion: `Se ha agregado copias a la comunicación`
    })

    if (labelBtnDatosSalida.value === 'Guardar') {
      idSendDatos.value = true
      toast.success(objResponse.success_medicina)
      return
    }
    await getAllData(true)
    stepDataSend.value += 1
  } catch (error) {
    toast.error(objResponse.default_error)
  }
}

const submitAsuntosCorreo = async () => {
  try {
    const { data } = countDatosSalidaCorreobyUpdate.value === 0
      ? await sgdeaAxios.post(`/medicina/crearComunRespSalida/${idComunicacion.value}`, {
        "asunto": formExitData.value.asuntoCorreo,
        "cuerpoCorreo": ''
      })
      : await sgdeaAxios.put(`/medicina/putComunRespSalida/${idComunicacion.value}`, {
        "asunto": formExitData.value.asuntoCorreo,
        "cuerpoCorreo": ''
      })

    isSendCopies.value = true
    countDatosSalidaCorreobyUpdate.value++
    isErrased.value = false

    crearTrazabilidad({
      proceso: `MLCOM${idComunicacion.value}`,
      secuencia: secuencia.value,
      estado: state.value,
      descripcion: `El gestionador a agregado asunto y cuerpo del correo a la comunicación`,
      comentario: 'Agregar asunto y cuerpo del correo',
      nombre: `${firstname} ${lastname}`,
      tramite: 'Medicina laboral comunicaciones',
      accion: `Se ha agregado asunto y cuerpo del correo a la comunicación`
    })
    idSendDatos.value = true
    toast.success(objResponse.success_medicina)
    await getAllData(true)
  } catch (error) {
    console.error(error)
    toast.error(objResponse.default_error)
  }
}

const mapDataToFormMetadatos = (data) => {
  let objToUpdate = {}

  Object.keys(formGeneralData.value).forEach((key) => {
    let keyToObjResponse = objKeys[key]
    if (['listMl'].includes(keyToObjResponse)) {
      objToUpdate[key] = data[keyToObjResponse].split(',').map(String)
    } else if (keyToObjResponse === 'fechaSiniestro') {
      objToUpdate[key] = moment(data[keyToObjResponse], "DD-MM-YYYY").format('DD/MM/YYYY')
    }
    else {
      objToUpdate[key] = typeof data[keyToObjResponse] === 'object' ? data[keyToObjResponse]?.id : data[keyToObjResponse]
    }
  })

  formGeneralData.value = { ...formGeneralData.value, ...objToUpdate }
}

const handleComeBack = () => {
  if (stepDataSend.value === 2) {
    labelBtnDatosSalida.value = 'Siguiente'
  }
  stepDataSend.value -= 1
}

const handleSubmitDatosSalida = () => {
  if (stepDataSend.value === 0) {
    submitDestinatarios()
    return
  }

  if (stepDataSend.value === 1) {
    submitDatosSalidaCopia()
    return
  }

  if (stepDataSend.value === 2) {
    if (idMedatadoSave.value) {
      submitAsuntosCorreo()
      return
    }
    toast.error(objResponse.metadato_vacio)
    return
  }
}

const handleSubmitMetadato = async () => {
  const objToSend = {
    asunto: formGeneralData.value.asunto,
    tipoDocumento: formGeneralData.value.tipoDocumento,
    numeroDocumento: formGeneralData.value.numeroDocumento,
    nombreAfectado: formGeneralData.value.nombreAfectado,
    listMl: formGeneralData.value.radNumero.join(','),
    // @ts-expect-error
    siniestro: formGeneralData.value.numeroSiniestro.label,
    fechaSiniestro: moment(formGeneralData.value.date, "DD-MM-YYYY").format('DD/MM/YYYY'),
    evento: formGeneralData.value.evento,
    origenEvento: formGeneralData.value.origen
  }

  try {
    const { data } = countMetadatosbyUpdate.value === 0
      ? await sgdeaAxios.post(`/medicina/crearComunicacionMetadatos/${idComunicacion.value}`, objToSend)
      : await sgdeaAxios.put(`/medicina/putComunicacionMetadatos/${idComunicacion.value}`, objToSend)

    sendMetadatos.value = true
    countMetadatosbyUpdate.value++

    await crearTrazabilidad({
      proceso: `MLCOM${idComunicacion.value}`,
      secuencia: secuencia.value,
      estado: state.value,
      descripcion: `El gestionador a agregado metadatos a la comunicación`,
      comentario: 'Agregar metadatos',
      nombre: `${firstname} ${lastname}`,
      tramite: 'Medicina laboral comunicaciones',
      accion: `Se ha agregado metadatos a la comunicación`
    })

    await getAllData(true)
    idMedatadoSave.value = data.id
    toast.success(objResponse.success_medicina)
  } catch (error) {
    toast.error(objResponse.default_error)
  }
}

const next = async () => {
  if (tab.value === 'documento-salida') {
    return
  }

  const formName = tab.value
  const isValid = formRefs.value[formName] && formName !== 'enviar-revision' ? await verifyFormIsValid(formName) : true;

  if (!isValid) return

  if (tab.value === 'metadatos') {
    handleSubmitMetadato()
    return
  }

  if (tab.value === 'datos-salida') {
    handleSubmitDatosSalida()
    return
  }

  if (tab.value === 'adjuntar-documento') {
    handleSubmitDocs('files', formDatosAdjuntos.value.files)
    return
  }

  if (tab.value === 'enviar-revision') {
    handleSubmitRevisionAprobacion()
    return
  }
}

const mapDataToFileDataTable = (data) => {
  return data.map(doc => ({
    formato: doc.nombreAnexo.split('.').pop(),
    nombre: doc.nombreAnexo.split('.').shift(),
    tipo: 'De salida',
    fecha: doc.fecha,
    cargado_por: doc.cargadoPor,
    id: doc.nodeIdAnexo,
  }))
}

const handleSubmitDocs = async (key, files) => {
  const formDataFiles = new FormData();
  for (var i = 0; i < files.length; i++) {
    formDataFiles.append(key, files[i]);
  }

  try {
    const { status } = fileDataTable?.value?.length > 0
      ? await sgdeaAxios.put(`/medicina/updateAnexosComunicaciones/${idComunicacion.value}?cargadoPor=${firstname} ${lastname} &fecha=${moment().format('DD/MM/YYYY')}`, formDataFiles)
      : await sgdeaAxios.post(`/medicina/comuEnviarDocs/${idComunicacion.value}?cargadoPor=${firstname} ${lastname} &fecha=${moment().format('DD/MM/YYYY')}`, formDataFiles)

    formDatosAdjuntos.value.files = []

    if (status === 200 || status === 201) {
      toast.success(objResponse.doc_saved)
      await getAllData(true)
    }
  } catch (error) {
    toast.error(objResponse.default_error)
  }
}

const generarSecuencia = async () => {
  try {
    const { data } = await sgdeaAxios.get(`/generar/secuencia/MLCOM`)
    secuencia.value = data
  } catch (error) {
    console.error(error)
    toast.error(objResponse.default_error)
  }
}

const mapFormDataToDestinataires = (formExitData, type) => {
  if (type === dictionaryTypeCopy[1]) {
    return {
      id: `${formExitData.official}-${formExitData.dependencieType}`,
      nombre: formExitData.official,
      dependencia: formExitData.dependencieType,
      dependencia_label: formExitData.dependencia_label,
      nombre_label: formExitData.nombre_label,
    }
  }

  if (type === dictionaryTypeCopy[2]) {
    return {
      id: formExitData.emailRecipientCopyExterna,
      forma: formExitData.shippingMethodCopyExterna,
      tipo: formExitData.recipientDocumentTypeCopyExterna,
      nombre: formExitData.recipientNameCopyExterna,
      direccion: formExitData.addressRecipientCopyExterna,
      pais: formExitData.countryRecipientCopyExterna,
      departamento: formExitData.departmentRecipientCopyExterna,
      municipio: formExitData.municipalityRecipientCopyExterna,
      telefonoDestinatario: formExitData.telephoneRecipientCopyExterna,
      correoDestinatario: formExitData.emailRecipientCopyExterna,
      municipio_label: formExitData.municipio_label,
      departamento_label: formExitData.departamento_label,
      pais_label: formExitData.countryRecipientCopyExterna.label,
      forma_label: formExitData.forma_label,
      tipo_label: formExitData.tipo_label,
    }
  }
}

// ! Add Users Interno
const handleClickAddNewDestinaryInterno = (formExitDataCopyInterno) => {
  const mapTypeCopyValue = 'interno';

  if (Array.isArray(formExitDataCopyInterno)) {
    formExitDataCopyInterno.map(obj => bodyCopyInterna.value =
      [...bodyCopyInterna.value, mapFormDataToDestinataires(obj, mapTypeCopyValue)])
    const resultado = Array.from(new Map(bodyCopyInterna.value.map(item => [item.id, item])).values());
    bodyCopyInterna.value = resultado
    isFisrRenderInterno.value = false;
    return
  }

  bodyCopyInterna.value = [...bodyCopyInterna.value, mapFormDataToDestinataires(formExitDataCopyInterno, mapTypeCopyValue)];
  isFormResetInterno.value = isFormResetInterno.value + 1;
}


// ! Add Users Externo
const handleClickAddNewDestinaryExterno = (formExitDataCopyExterno) => {
  const mapTypeCopyValue = 'externo';

  if (Array.isArray(formExitDataCopyExterno)) {
    formExitDataCopyExterno.map(obj => bodyCopyExterna.value =
      [...bodyCopyExterna.value, mapFormDataToDestinataires(obj, mapTypeCopyValue)])
    isFisrRender.value = false;
    const resultado = Array.from(new Map(bodyCopyExterna.value.map(item => [item.id, item])).values());
    bodyCopyExterna.value = resultado
    return
  }

  bodyCopyExterna.value = [...bodyCopyExterna.value, mapFormDataToDestinataires(formExitDataCopyExterno, mapTypeCopyValue)];
  isFormResetExterno.value = isFormResetExterno.value + 1;
}

const validateListDestinatarios = (type) => {

  if (['interno', 'interno y externo'].includes(type)) {
    return bodyCopyInterna.value.length > 0;
  }

  if (['externo', 'interno y externo'].includes(type)) {
    return bodyCopyExterna.value.length > 0;
  }
  return true;
}

const verifyFormIsValid = async (formName) => {
  if (formName === 'documento-salida') {
    return Promise.resolve(true);
  }

  if (formName === 'datos-salida' && stepDataSend.value === 1) {
    const isEmptyListDestinatarios = validateListDestinatarios(dictionaryTypeCopy[formExitData.value?.copyType]);

    if (!isEmptyListDestinatarios) {
      toast.error(objResponse.lista_vacia);
      return Promise.resolve(false);
    }
  }

  const myForms = formRefs.value[formName];
  const validations = myForms.map(form => form.value.validate());
  // @ts-expect-error
  return Promise.allSettled(validations).then(results => {
    const allValid = results.every(result => result.status === 'fulfilled' && result.value);
    if (!allValid) {
      if (results[0].status === 'rejected' && results[0].reason) {
        toast.error(results[0].reason.message);
        return false;
      }
      toast.error(objResponse.campos_obligatorios);
      return false;
    }
    return true;
  });
}

const rejectedFiles = (error) => {
  if (error.some((it) => it.failedPropValidation === 'max-file-size')) {
    toast.error('El peso permitido es hasta 50MB.')
  }
  if (error.some((it) => it.failedPropValidation === 'max-files')) {
    toast.error('Solo se pueden adjuntar 30 archivos.')
  }
  if (error.some((it) => it.failedPropValidation === 'accept')) {
    toast.error('Formato inválido, los formatos permitidos son (pdf, png, jpg, txt, doc, docx, xls, xlsx, mp3, mp4, avi).')
  }
}

const handleSubmitRevisionAprobacion = async () => {
  // Revisa si ya se incluyo en expediente
  if (!isExpedientes.value) {
    toast.error('Documento pendiente de inclusión en expediente')
    return
  }

  // Revisa los datos y documento de salida
  if (!isSendContenidoDoc.value || !isSendCopies.value) {
    toast.error("Debe diligenciar los datos y el documento de salida para poder completar la acción")
    return
  }

  // Valida si seleccionó un usuario revisor
  if (!userSeletecdByRevision.value?.user) {
    toast.error(objResponse.select_user)
    return
  }

  // Valida si seleccionó un usuario aprobador
  if (!isComunicacionAutomatica.value) {
    if (!userSeletecdByAprobacion.value) {
      toast.error(objResponse.select_user)
      return
    }
  }

  // Valida campos obligatorios
  if (!await verifyFormIsValid('enviar-revision')) return

  toast.warning('Recuerde asegurarse de cargar los anexos requeridos para la comunicación')
  showModalCompromisos.value = true
}

const handleSubmitCompromisos = async () => {
  const isValidateCompromisos = await formModalSalida.value.validate()

  if (!isValidateCompromisos) {
    return
  }

  try {
    await sgdeaAxios.put(`medicina/enviarComRevision/${idComunicacion.value}`, {
      idUserResvisor: userSeletecdByRevision.value?.user,
      motivoRevisor: formRevision.value.observacionesRevision,
    })

    await sgdeaAxios.put(`medicina/enviarComAprobador/${idComunicacion.value}`, {
      idUserAprobador: isComunicacionAutomatica.value ? aprobadorSelected.value[0].id : userSeletecdByAprobacion.value?.user,
      motivoAprobador: formAprobacion.value.observacionesAprobacion,
      oficinaDestinoId: userSeletecdByAprobacion.value?.oficinaId,
    })

    await sgdeaAxios.put(`medicina/compromisosProximosCom/${idComunicacion.value}?comp=${formModal.value.compromisos?.label ? 'Si' : 'No'}&observa=${formModal.value.observaciones}`)
    crearTrazabilidad({
      proceso: `MLCOM${idComunicacion.value}`,
      secuencia: secuencia.value,
      estado: state.value,
      descripcion: `El gestionador a enviado la comunicación a revisión y aprobación`,
      comentario: 'Enviar a revisión y aprobación',
      nombre: `${firstname} ${lastname}`,
      tramite: 'Medicina laboral comunicaciones',
      accion: formAprobacion.value.observacionesAprobacion || formRevision.value.observacionesRevision
    })
    showFormModalComunication.value = false
    state.value = 'Por revisar'
    toast.success(objResponse.succes_radicado)
    router.push('/medicina/bandeja-comunicaciones')
  } catch (error) {
    toast.error(objResponse.default_error)
  }
}

const sortOptionsVal = (vals: any[]) => {
  return vals.sort(
    (leftItem: { dependencia_label: string }, rightItem: { dependencia_label: string }) => {
      const nombreA = leftItem.dependencia_label?.toLowerCase().trim();
      const nombreB = rightItem.dependencia_label?.toLowerCase().trim();

      if (nombreA < nombreB) {
        return -1;
      }

      if (nombreA > nombreB) {
        return 1;
      }

      return 0;
    }
  );
};

watch(() => tab.value, (newValue) => {
  if (newValue !== 'enviar-revision') {
    userSeletecdByAprobacion.value = null
    userSeletecdByRevision.value = null
  }
})

watch(() => formExitData.value, (value) => {
  const isPaisColombia = typeof formExitData.value.datosSalidaPaisId === 'number'
    ? formExitData.value.datosSalidaPaisId === 425
    : formExitData.value.datosSalidaPaisId.value === 425;

  datosSalida.value.destinatario = {
    ...datosSalida.value.destinatario,
    nombre: value.datosSalidaNombreDestinatario,
    direccion: value.datosSalidaDireccion,
    numero_celular: value.datosSalidaTelefono,
    departamento: isPaisColombia
      ? getLabel(formExitData.value.datosSalidaDeptoId, departmentsOptions.value)
      : getLabel(formExitData.value.datosSalidaPaisId, optionsCountries.value),
    municipio: isPaisColombia
      ? getLabel(formExitData.value.datosSalidaMunicipioId, municipioOptions.value)
      : getLabel(formExitData.value.datosSalidaPaisId, optionsCountries.value),
    shippingMethod: getLabel(formExitData.value.datosSalidaFormaEnvioId, shippingMethodsOptions.value),
  }
}, { deep: true });

watch(() => bodyCopyExterna.value, (_) => {
  datosSalida.value.destinatario = {
    ...datosSalida.value.destinatario,
    // @ts-expect-error
    copiesExterna: bodyCopyExterna.value.length ? bodyCopyExterna.value : '',
  }
}, { deep: true });

watch(() => bodyCopyInterna.value, (_) => {
  datosSalida.value.destinatario = {
    ...datosSalida.value.destinatario,
    // @ts-expect-error
    copiesInterna: bodyCopyInterna.value.length ? bodyCopyInterna.value : '',
  }
}, { deep: true });

watch(() => formGeneralData.value.asunto, (value) => {
  datosSalida.value.destinatario = {
    ...datosSalida.value.destinatario,
    asunto: value
  }
}, { deep: true })

watch(() => stepDataSend.value, (newValue) => {
  if (newValue === 0) labelBtnDatosSalida.value = 'Siguiente'
  if (newValue === 2) labelBtnDatosSalida.value = 'Guardar'
})

watch(() => updateTypeCopy.value, (value) => {
  formExitData.value.copyType = value
})

watch(() => formExitData.value.datosSalidaDeptoId, async (value) => {
  if (value && typeof value === 'number') {
    const { optionsMunicipalities } = await useMunicipalities(value);
    municipioOptions.value = optionsMunicipalities.value;
  }
});

watch(() => formExitData.value.copyType, (value) => {
  if (value) activeButtonCopy.value = true
  else if (!updateTypeCopy.value && !value) activeButtonCopy.value = false
})

const getLabel = (value, options) => {
  const option = options.find(option => option.value === value);
  return option ? option.label : '';
}

function removeButton(key) {
  const index = filteredTabs.value.findIndex(item => item.key === key);

  if (index !== -1) {
    filteredTabs.value.splice(index, 1);
  }
}

function addButton(key, name, icon) {
  const isButtonExists = filteredTabs.value.some(item => item.key === key && item.icon === icon);

  if (!isButtonExists) {
    filteredTabs.value.push({
      key: key,
      name: name,
      icon: icon
    });
  }
}

</script>
<style>
.image-class {
  display: inline;
  width: 100%;
  height: 100%;
  max-width: 200px;
  object-fit: cover;
}
</style>
