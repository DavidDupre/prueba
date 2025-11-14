<template>
    <main class="q-py-md">
        <div @click="handleVolverClick" class="text-primary q-mb-md block cursor-pointer" style="text-decoration: none">
            <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
            <b> Volver</b>
        </div>
        <div class="tw-flex tw-justify-between tw-pt-4 tw-mb-3">
            <h1 class="tw-text-3xl tw-font-bold">Radicado # {{ showRoute }}</h1>
        </div>
        <span
            class="tw-bg-orange-100 q-my-sm tw-mb-3 tw-border-orange-400 tw-border tw-rounded-full tw-w-auto q-px-md q-py-xs">
            {{idDetalle.estado || '-' }}
        </span>

        <q-tabs no-caps align="left" indicator-color="primary" active-color="primary" v-model="tab" inline-label>
            <q-tab name="vistaInformacionGeneral" label="Información General"
                class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]" icon="info" />
                   <!-- Nuevas pestañas condicionales -->
            <q-tab v-if="idDetalle.estado === 'Publicacion rechazada'"
                   name="publicar"
                   label="Publicar"
                   icon="publish" />

            <q-tab v-if="idDetalle.estado === 'Publicacion rechazada'"
                   name="rechazar"
                   label="Rechazar Publicación"
                   icon="block" />
            <q-tab name="docs" label="Documentos Relacionados" icon="folder_open" />
            <q-tab name="trazabilidad" label="Trazabilidad" icon="history" />
        </q-tabs>
        <q-tab-panels v-model="tab" animated v-if="loaded">
            <q-tab-panel name="vistaInformacionGeneral">
                <InformacionGeneral v-if="idDetalle.flujo === 'PQRD'" ref="infoComp" :data="responsePqrd"
                    :visualize="getBlobToIframe" :metadatos="responseMetadatos" class="tw-w-[100%]"
                    @success="initData()" />

                <InformacionGeneralML v-if="idDetalle.flujo === 'MEDICINA_LABORAL'" v-model:data="responseML"
                    :docs="allDocs" class="tw-w-[100%]" :visualize="getBlobToIframe" :metadatos-info="metadatosInfo"
                    :allTypesDocs="listDocs2" :hideEditButton="true" />

                <InformacionGeneralEN v-if="idDetalle.flujo === 'ENTES_DE_CONTROL'"
                    :informacionGeneral="informacionGeneral" />

                <InformacionGeneralTUT v-if="idDetalle.flujo === 'TUTELAS'" :list-docs="listDocsTutela"
                    :visualize="getBlobToIframe" :detalle-tutela="responsePqrd" :download="download" />

                <InformacionGeneralCOr v-if="idDetalle.flujo === 'CORRESPONDENCIA'" :list-docs="listDocs"
                    :list-docs2="listDocs2" :visualize="getBlobToIframe" :details-radicado="detalleRadicado"
                    :details-asignaciones="detalleAsignaciones" class="tw-w-[100%]" />

                <InformacionGeneralCom v-if="idDetalle.flujo === 'CORRESPONDENCIA_COMUNICACION'" :list-docs="listDocs"
                    :list-docs2="listDocs2" :visualize="getBlobToIframe" :details-radicado="detalleComunicaciones"
                    class="tw-w-[100%]" />

                    <InformacionGeeralCorMunicaciones v-if="idDetalle.flujo === 'COMUNICACION_MANUAL'" :list-docs="listDocs"
                    :list-docs2="listDocs2" :visualize="getBlobToIframe" :details-radicado="detalleComunicaciones"
                    class="tw-w-[100%]"/>

                <InfoGeneral v-if="idDetalle.flujo === 'FAC_AMIN'" @update:data="handleUpdate"
                    v-model:data="responseFAC" />
                <InforGeneral v-if="idDetalle.flujo === 'COMUNICACIONES_MEDICINA'" :data="allInfo" />
            </q-tab-panel>
            <q-tab-panel name="publicar" v-if="idDetalle.estado === 'Publicacion rechazada'">
                <Publicar
                    :detalles-registro="responseML"
                    @back-view="backView" :type="'correspondencia'"
                />
            </q-tab-panel>

            <q-tab-panel name="rechazar" v-if="idDetalle.estado === 'Publicacion rechazada'">
                <RechazarPublicacion
                    :detalles-registro="responseML"
                    :type="'Medicina'"
                     @back-view="backView" @back-page="router.push('/bandeja')"
                />
            </q-tab-panel>

               <q-tab-panel name="trazabilidad">
                <Trazabilidad :doneItems="trazabilidadData" />
            </q-tab-panel>
            <q-tab-panel name="trazabilidad">
                <Trazabilidad :doneItems="trazabilidadData" />
            </q-tab-panel>
            <q-tab-panel name="docs">
                <DocumentosRelacionados v-if="idDetalle.flujo === 'PQRD'" :visualize="getBlobToIframe"
                    :only-read-user="readOnlyGestionador" :segundaDevolucion="segundaDevolucion"
                    :isDevolucion="data?.estado?.estado == 'Devolucion' ? true : false"
                    v-model:detallePqrd="responsePqrd" @updateTotalList="handleTotalList"/>

                <DocumentosRelacionadosTUT v-if="idDetalle.flujo === 'TUTELAS'" :visualize="getBlobToIframe"
                    :detalle-tutela="responsePqrd" :reloadData="reloadData" @updateTotalList="handleTotalList" />

                <DocumentosRelacionadosML v-if="idDetalle.flujo === 'MEDICINA_LABORAL'" :visualize="getBlobToIframe"
                    v-model:detalleML="responseML" @updateTotalList="handleTotalList" />

                <DocumentosRelacionadosEN v-if="idDetalle.flujo === 'ENTES_DE_CONTROL'"
                    :detailsRadicado="informacionGeneral" />
                <!-- <DocumentosRelacionadosEN v-if="idDetalle.flujo === 'FAC_AMIN'" :detailsRadicado="responseFAC" /> -->

                <q-tab-panel name="docsRelacionados" v-if="idDetalle.flujo === 'FAC_AMIN'">
                    <q-card class="tw-flex tw-p-2 tw-gap-10">
                        <q-btn :color="typeDoc === 'De Entrada' ? 'primary' : 'grey-7'" outline icon="info"
                            label="De entrada" @click="changeDocs('De Entrada')" />
                        <q-btn :color="typeDoc === 'De Salida' ? 'primary' : 'grey-7'" outline icon="info"
                            label="De salida" @click="changeDocs('De Salida')" />
                    </q-card>
                    <q-card class="tw-rounded-xl tw-mt-4 q-pa-md tw-max-w-full" flat bordered>
                        <div class="col ">
                            <div class="tw-flex tw-justify-between tw-mb-4">
                                <p class="tw-text-lg text-weight-bold q-mx-lg">
                                    Listado de Documentos Cargados
                                </p>
                                <!-- <q-btn label="Subir un documento" color="primary" icon="add" @click="modalDocuments = true" /> -->
                            </div>
                            <div class="flex row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md tw-max-w-full">
                                <TableDocs :DOCUMENTOS_BODY="filteredDocs" class="tw-w-full"
                                    v-model:selected-items="selectedDocs" :visualize="getBlobToIframe" />
                            </div>
                        </div>
                    </q-card>
                </q-tab-panel>

                <DocumentosRelacionadosCor v-if="idDetalle.flujo === 'CORRESPONDENCIA'" :visualize="getBlobToIframe"
                    v-model:detalleRadicado="detalleRadicado" :show-modal="modalDocuments" :list-docs="listDocs"
                    :list-docs2="listDocs2" :list-docs3="listDocs3" v-model:finished="finished" @updated="getDataCor()"
                    @updateTotalList="handleTotalList" />

                <DocumentosRelacionadosCor v-if="idDetalle.flujo === 'CORRESPONDENCIA_COMUNICACION' || idDetalle.flujo === 'COMUNICACION_MANUAL'"
                    :visualize="getBlobToIframe" v-model:detailsComunicacion="detalleComunicaciones" :list-docs="listDocs"
                    :list-docs2="listDocs2" :list-docs3="listDocs3" @updated="getDataCor()" @updateTotalList="handleTotalList"/>

                <DocumentosRelacionadosCM v-if="idDetalle.flujo === 'COMUNICACIONES_MEDICINA'" :visualize="getBlobToIframe" v-model:detalleML="allInfo"
                    :show-modal="modalDocuments" @changeDocType="changeDocType" v-model:finished="finished"
                    @updated="getAllData()" />
            </q-tab-panel>
        </q-tab-panels>
        <div v-if="visualizadorPDF" class="tw-h-full tw-w-full">
            <q-dialog v-model="visualizadorPDF" seamless position="right" class="">
                <q-card class="tw-h-full tw-w-[2000px] tw-z-[1000] tw-overflow-hidden">
                    <q-card-section>
                        <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                            <div>
                                <q-btn @click="visualizadorPDF = false"
                                    class="tw-absolute tw-ml-12 tw-mt-3 tw-z-[2000] tw-text-white tw-bg-red-500">
                                    Cerrar
                                </q-btn>
                                <iframe class="tw-h-[80vh] tw-w-full" :src="iframePdfUrl" frameborder="0"></iframe>

                                <!-- Sección de documentos -->
                                <template v-if="listForVizualiser.length > 0">
                                    <!-- Documentos de Entrada -->
                                    <p class="text-weight-bold tw-mt-2">Documentos de Entrada</p>
                                    <q-tabs v-model="tabsFiles" dense align="justify" narrow-indicator>
                                        <q-tab
                                            v-for="item in listForVizualiser.filter(it => it.tipoDocumento === 'ENTRADA' || it.tipo === 'De Entrada')"
                                            :key="item.nodeId" :name="item.nombre">
                                            <q-card class="tw-h-[10vh] tw-w-auto tw-p-3"
                                                @click="getBlobToIframe(item.nodeId, null)">
                                                <q-img v-lazy :data-url="docImg" style="width: 30px" />
                                                <p class="tw-text-gray-dark textFile tw-mt-2">{{ item.nombre }}</p>
                                                <q-tooltip class="text-body2" anchor="top middle" self="bottom middle"
                                                    :offset="[10, 10]">
                                                    {{ item.nombre }}
                                                </q-tooltip>
                                            </q-card>
                                        </q-tab>
                                    </q-tabs>

                                    <!-- Documentos de Gestión -->
                                    <p class="text-weight-bold tw-pt-5">Documentos de Gestión</p>
                                    <q-tabs v-model="tabsFiles" dense align="justify" narrow-indicator>
                                        <q-tab
                                            v-for="item in listForVizualiser.filter(it => it.tipoDocumento === 'GESTION' || it.tipo === 'De gestión')"
                                            :key="item.nodeId" :name="item.nombre">
                                            <q-card class="tw-h-[10vh] tw-w-auto tw-p-3"
                                                @click="getBlobToIframe(item.nodeId, null)">
                                                <q-img v-lazy :data-url="docImg" style="width: 30px" />
                                                <p class="tw-text-gray-dark textFile tw-mt-2">{{ item.nombre }}</p>
                                                <q-tooltip class="text-body2" anchor="top middle" self="bottom middle"
                                                    :offset="[10, 10]">
                                                    {{ item.nombre }}
                                                </q-tooltip>
                                            </q-card>
                                        </q-tab>
                                    </q-tabs>

                                    <!-- Documentos de Salida -->
                                    <p class="text-weight-bold tw-pt-5">Documentos de Salida</p>
                                    <q-tabs v-model="tabsFiles" dense align="justify" narrow-indicator>
                                        <q-tab
                                            v-for="item in listForVizualiser.filter(it => it.tipoDocumento === 'SALIDA' || it.tipo === 'De salida')"
                                            :key="item.nodeId" :name="item.nombre">
                                            <q-card class="tw-h-[10vh] tw-w-auto tw-p-3"
                                                @click="getBlobToIframe(item.nodeId, null)">
                                                <q-img v-lazy :data-url="docImg" style="width: 30px" />
                                                <p class="tw-text-gray-dark textFile tw-mt-2">{{ item.nombre }}</p>
                                                <q-tooltip class="text-body2" anchor="top middle" self="bottom middle"
                                                    :offset="[10, 10]">
                                                    {{ item.nombre }}
                                                </q-tooltip>
                                            </q-card>
                                        </q-tab>
                                    </q-tabs>
                                </template>
                            </div>
                        </transition>
                    </q-card-section>
                </q-card>
            </q-dialog>
        </div>
    </main>
</template>

<script lang="ts" setup>
import { Ref, onMounted, ref, watch } from "vue";
import { toast } from "src/helpers/toast";
import { currentHourWithoutSec, formatDateTimeStandTwo, fourthFormatDate } from "src/helpers/formtDate";
import Trazabilidad from "src/pages/Expedientes/Trazabilidad/Trazabilidad.vue";
import DocumentosRelacionados from "../PQRD/DocumentosRelacionados/DocumentosRelacionados.vue";
import InformacionGeneral from "../PQRD/InformacionGeneral/informacionGeneral.vue";
import InformacionGeneralTUT from "../SGDA/ClasificacionDocumental/Tutelas/InformacionGeneral/InformacionGeneral.vue";
import DocumentosRelacionadosTUT from "../SGDA/ClasificacionDocumental/Tutelas/DocumentosRelacionados/DocumentosRelacionados.vue";
import InformacionGeneralCOr from "../Correspondencia/InformacionGeneral/InformacionGeneral.vue";
import DocumentosRelacionadosEN from "../EntesDeControl/Bandeja/Detalles/DocumentosRelacionados/DocumentosRelacionados.vue";
import InformacionGeneralEN from "../EntesDeControl/Bandeja/Detalles/InformacionGeneral/InformacionGeneral.vue";
import { sgdeaAxios } from "src/services";
import { DocsBD, DocumentoRadicado, Medicina } from "src/interfaces";
import InformacionGeneralML from '../MedicinaLaboral/InformacionGeneral/informacionGeneral.vue'
import DocumentosRelacionadosML from '../MedicinaLaboral/DocumentosRelacionados/DocumentosRelacionados.vue'
import DocumentosRelacionadosCor from '../Correspondencia/DocumentosRelacionados/DocumentosRelacionados.vue'
import InformacionGeneralCom from '../Consultageneral/InformacionGeneral/InformacionGeneralCom.vue'
import InformacionGeeralCorMunicaciones from '../Consultageneral/InformacionGeneral/InformacionGeeralCorMunicaciones.vue'
import { Meta } from "src/components/models";
import { dataMapping, informacionGeneralEmptyDefault } from "../EntesDeControl/Bandeja/Detalles/utils";
import InfoGeneral from "../Facturacion/cobro/components/InfoGeneral.vue";
import { IAsignacionDetalles, IComunicacionesDetalles, IRadicadoDetalles } from "../Correspondencia";
import TableDocs from "../Facturacion/cobro/components/TableDocs.vue";
import { computed } from "vue";
import moment from "moment";
import docImg from "src/assets/icon-lines.svg";
import Publicar from "src/components/Devolucion/Publicar.vue";
import RechazarPublicacion from "src/components/Devolucion/RechazarPublicacion.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth.store";
import InforGeneral from "src/pages/MedicinaLaboral/comunicaciones/Edit/InfoGeneral.vue";
import { getAllDataComunicacion } from 'src/pages/Correspondencia/API/endpointsData';
import DocumentosRelacionadosCM from "src/pages/MedicinaLaboral/comunicaciones/Edit/DocumentosRelacionados/DocumentosRelacionados.vue";
import { useCrearComunicacionesLogic } from "src/pages/Correspondencia/Crear/CrearComunicaciones/CrearComunicaciones.Logic";
import {
  dictionaryTypeCopy,
} from "src/pages/Correspondencia/Crear/CrearComunicaciones/const";
import { getAcronimobyDoc } from "src/helpers/prefijoTipoDoc";
import { useDocumentStore } from "src/stores/documentStore";
import { HistorialDocSalida } from "src/interfaces/DocSalidaHistorial";
const data = ref(null);
const auth = useAuthStore();
const props = withDefaults(defineProps<{
    idDetalle: any,
}>(), {
})


const emit = defineEmits(['closeComp'])
const showRoute = ref(
    (props.idDetalle.numRadicado.match(/ENT\d+/) ||
        props.idDetalle.numRadicado.match(/SAL\d+/) ||
        [props.idDetalle.numRadicado])[0]
);
const trazabilidadData = ref<any[]>([])
const tab = ref("vistaInformacionGeneral");
const loaded = ref(true);
const listDocs = ref([])
const listDocsTutela = ref([])
const nameDocument = ref(null)
const iframePdfUrl = ref()
const visualizadorPDF = ref(false)
const loadingDocs = ref(true)
const responsePqrd = ref([]);
const responseMetadatos = ref();
const responseFAC = ref();
const typeDoc = ref('De Entrada')
const selectedDocs = ref<any[]>([]);
const readOnlyGestionador = ref(false);
const segundaDevolucion = ref(false);
const incrementaKey = ref(0);
const reloadData = ref(false)

const metadatosInfo: Ref<Meta | null> = ref(null);
const detalleRadicado: Ref<Partial<IRadicadoDetalles>> = ref({});
const detalleAsignaciones: Ref<Partial<IAsignacionDetalles>> = ref({});
const modalDocuments = ref(false);
const finished = ref(false);
const allDocs = ref();
const listDocs2 = ref([]);
const listDocs3 = ref([]);
const docEntrada = ref();
const informacionGeneral = ref<any>(informacionGeneralEmptyDefault);
const responseML: Ref<Medicina | null> = ref(null);
const detalleComunicaciones: Ref<Partial<IComunicacionesDetalles>> = ref({});
const loadedDocs = ref<any[]>([]);
const tabsFiles = ref();
const listForVizualiser = ref([])
const allInfo = ref();
const loadedDocsToChangeType = ref([]);
const showChangeDocType = ref<boolean>(false);
const copia = ref("");
const isDisabled = ref(false);
const fileDataTable = ref();
const documentosData = ref();
const isExpedientes = ref();
const isDocSalida = ref();const filteredTabs = ref([
  { key: "informacion-general", name: "Información General", icon: "info" },
  {
    key: "documentos-relacionados",
    name: "Documentos Relacionados",
    icon: "folder_open",
  },
  { key: "metadatos", name: "Metadatos", icon: "fa-solid fa-database" },
  { key: "datos-salida", name: "Datos de Salida", icon: "account_tree" },
  { key: "documento-salida", name: "Documento de Salida", icon: "post_add" },
  {
    key: "adjuntar-documento",
    name: "Adjuntar documentos de salida",
    icon: "attach_file",
  },
  { key: "incluir-exp", name: "Incluir Expediente", icon: "adf_scanner" },
  {
    key: "enviar-revision",
    name: "Enviar a Revisión",
    icon: "assignment_turned_in",
  },
  { key: "trazabilidad", name: "Trazabilidad", icon: "history" },
  { key: "comentarios", name: "Comentarios", icon: "forum" },
  {
    key: "trazabilidad-documento",
    name: "Trazabilidad de Documento",
    icon: "history",
  },
]);
const meta = ref(0);
const formGeneralData = ref({
  asunto: "",
  tipoDocumento: "",
  nombreAfectado: "",
  numeroDocumento: "",
  radNumero: [],
  date: "",
  origen: "",
  evento: "",
  numeroSiniestro: [],
  eventoLabel: "",
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
};
const giveMetadatos = ref(false);
const objKeysDestinatarios = {
  datosSalidaFormaEnvioId: "formaEnvio",
  datosSalidaTipoDocumentoDestinatarioId: "tipoDocumentoDestinatario",
  datosSalidaNumeroDocumentoDestinatario: "numeroDocumento",
  datosSalidaNombreDestinatario: "nombreDestinatario",
  datosSalidaDireccion: "direccionDestinatario",
  datosSalidaPaisId: "pais",
  datosSalidaDeptoId: "departamento",
  datosSalidaMunicipioId: "municipio",
  datosSalidaTelefono: "telefonoDestinatario",
  datosSalidaCorreo: "correoDestinatario",
};
const originalFormExitData = {
  asunto: "",
  anexos: "",
  datosSalidaFormaEnvioId: "",
  datosSalidaTipoDocumentoDestinatarioId: "",
  datosSalidaNumeroDocumentoDestinatario: "",
  datosSalidaNombreDestinatario: "",
  datosSalidaDireccion: "",
  datosSalidaPaisId: { value: 425, label: "Colombia" },
  datosSalidaDeptoId: "",
  datosSalidaMunicipioId: "",
  datosSalidaCorreo: "",
  datosSalidaTelefono: "",
  asuntoCorreo: "",
  contenidoCorreo: "",
  copyType: "",
};
const formExitData = ref({ ...originalFormExitData });
const isSendDestinatarios = ref(false);
const giveDestinatario = ref(false);
const updateTypeCopy = ref(null);
const getCopy = ref(null);
const bodyCopyInterna = ref([]);
const isFisrRenderInterno = ref(true);
const isFormResetInterno = ref(0);
const bodyCopyExterna = ref([]);
const isFisrRender = ref(true);
const isFormResetExterno = ref(0);
const objKeysCorreo = {
  asuntoCorreo: "",
  contenidoCorreo: "",
};
const giveCorreo = ref(false);
const isSendContenidoDoc = ref(false);
const isComunicacionAutomatica = ref(false);
const aprobadorSelected = ref([]);
const tipoPlantillaSeleted = ref(1);
const secuencia = ref("");
const state = ref("En edición");
const copiesTypesOptions = ref([]);
const shippingMethodsOptions = ref([]);
const documentStore = useDocumentStore();
const documentoFile = ref("");
const restric = ref(false);
const htmlContent = ref("");
const selectedSignature = ref();
const aprobado = ref(false);
let referentKey = {};
const arrayCopyInterna = ref();
const arrayCopyExterna = ref();
const arrayAllCopys = ref();
const dataFooter = ref({});
const router = useRouter();

const handleVolverClick = () => {
    localStorage.removeItem('idDocEntes');
    emit('closeComp');
};

const backView = () => {
  tab.value = "vistaInformacionGeneral";
  // Otras acciones que necesites realizar
  loaded.value = false; // Por ejemplo, recargar datos
  setTimeout(() => loaded.value = true, 100);
};
const handleUpdate = () => {
    incrementaKey.value++;
};

const changeDocs = (type) => {
    typeDoc.value = type;
}

const getDocDownl = async (id) => {
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

    return URL.createObjectURL(blob);
}

const download = async (id, path = '') => {
    try {

        const blobUrl = await getDocDownl(id);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = nameDocument.value;

        link.click();

        URL.revokeObjectURL(blobUrl);

        // if (path != '') {
        //     router.push(path);
        // }
    } catch (error) {
        toast.error('Ha ocurrido un error al descargar el documento.');
    }
};


const getDataCor = async () => {

    if (detalleRadicado.value.id) {
        await getDocsCor(
            `/correspondencia/radicacion/documentos/SALIDA/${detalleRadicado.value.id}`
        );
        await getDocs2();
    }


};

const getDocsCor = async (path) => {
    try {
        const { data: getDocs } = await sgdeaAxios.get<any>(`${path}`);

        const nodeId = getDocs.length > 0 ? getDocs[0]?.nodeId : null;
        listDocs.value = getDocs;

        if (nodeId) {
            const { data: getDocAlf } = await sgdeaAxios.get<DocumentoRadicado>(
                `/radicados/consultar_documento/${nodeId}`
            );

            const decodedContent = await decodeBase64ToUTF8(getDocAlf.base64x);
            //   dataSave.value = decodedContent;
        }
    } catch (error) {
        console.error(error);
    }
};

const decodeBase64ToUTF8 = async (base64Data) => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Uint8Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const decoder = new TextDecoder("utf-8");
    const decodedText = decoder.decode(byteNumbers);

    return decodedText;
};
const filteredDocs = computed(() => {
    return loadedDocs.value.filter(doc => doc.tipoDocumento === typeDoc.value);
});

async function getDocs() {
    const { data: files }: { data } = await sgdeaAxios.get(
        `/medicina/documentos/${responseML.value?.id}`
    );

    listDocs.value = files
        .map((it) => ({
            formato: it?.formato,
            nombre: it?.nombre,
            fecha: fourthFormatDate(it.fechaCargue),
            cargado_por: it.usuario.firstname + " " + it.usuario.lastname,
            tipo: `De ${it.tipoDocumento.toLowerCase()}`,
            id: it?.nodeId,
        }))
        .filter((it) => !it.tipo.includes("Respuesta"));

    listDocs2.value = files
        .map((it) => ({
            formato: it?.formato,
            nombre: it?.nombre,
            fecha: fourthFormatDate(it.fechaCargue),
            cargado_por: it.usuario.firstname + " " + it.usuario.lastname,
            tipo: `De ${it.tipoDocumento.toLowerCase()}`,
            id: it?.nodeId,
            tipoDocumento: it.tipoDocumento,
        }))
        .filter((it) => !it.tipo.includes("Respuesta"));

    const archivoRadicado = [];
    const otrosArchivos = [];
    listDocs.value.forEach((archivo) => {
        if (archivo.nombre.includes(responseML.value.idRadicado)) {
            archivoRadicado.push(archivo);
        } else {
            otrosArchivos.push(archivo);
        }
    });

    allDocs.value = { soporte: archivoRadicado, adjunto: otrosArchivos };
    loadingDocs.value = false;
}

async function getAllRegisters() {
    const { data } = await sgdeaAxios.get<any>(
        `/tutela/${responsePqrd.value.idTutela}/archivos`
    );

    listDocsTutela.value = data.map((it) => ({
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
}

const getDocs2 = async () => {
    try {
        const [responseEntrada, responseSoporte, responseAdjuntos, responseSalida] = await Promise.all([
            sgdeaAxios.get<DocsBD[]>(
                `correspondencia/radicacion/documentos/ENTRADA/${detalleRadicado.value.id || detalleComunicaciones.value.id}`
            ),
            sgdeaAxios.get<DocsBD[]>(
                `correspondencia/radicacion/documentos/SOPORTE/${detalleRadicado.value.id || detalleComunicaciones.value.id}`
            ),
            sgdeaAxios.get<DocsBD[]>(
                `correspondencia/radicacion/documentos/COLILLA/${detalleRadicado.value.id || detalleComunicaciones.value.id}`
            ),
            sgdeaAxios.get<DocsBD[]>(
                `correspondencia/radicacion/documentos/SALIDA/${detalleRadicado.value.id || detalleComunicaciones.value.id}`
            ),
        ]);

        // Process other documents
        if (responseSalida.data?.length > 0) {
            listDocs.value = responseSalida.data; 
        }

        if (responseEntrada.data?.length > 0) {
            listDocs2.value = responseEntrada.data;
        }

        if (responseSoporte.data?.length > 0) {
            listDocs3.value = [...listDocs3.value, ...responseSoporte.data];
        }

        if (responseAdjuntos.data?.length > 0) {
            listDocs3.value = [...listDocs3.value, ...responseAdjuntos.data];
        }

        if (docEntrada.value) {
            listDocs2.value = [{
                id: null,
                nombre: docEntrada.value.name,
                nodeId: docEntrada.value.id,
                formato: "pdf",
                tipoDocumento: "ENTRADA",
                fechaCargue: docEntrada.value.createdAt
            }, ...listDocs2.value];
        }

    } catch (error) {
        console.error(error);
        // toast.error('Error al cargar los documentos');
    }
};

const getDataByFlujo = async () => {
    const moduloOrigen = props.idDetalle.flujo;

    try {
        switch (moduloOrigen) {
            case "PQRD":
                const radicadoPQRD = (props.idDetalle.numRadicado.match(/ENT\d+/) ||
                    props.idDetalle.numRadicado.match(/SAL\d+/) ||
                    [props.idDetalle.numRadicado])[0];
                const responsep = await sgdeaAxios.get(
                    `/pqrd/buscarCaso?idCaso=${props.idDetalle.idRadicado}&userId=${auth.$state.userInfo.userid}`
                );

                if (responsep.status === 200) {
                    responsePqrd.value = [];
                    responsePqrd.value = responsep.data;
                }
                break;

            case "MEDICINA_LABORAL":
                const radicadoML = (props.idDetalle.numRadicado.match(/ENT\d+/) ||
                    props.idDetalle.numRadicado.match(/SAL\d+/) ||
                    [props.idDetalle.numRadicado])[0];
                const responsem = await sgdeaAxios.get(
                    `/medicina/casos/${radicadoML}`
                );
                const responseMeta = await sgdeaAxios.get(
                    `/medicina/get-Ml-Metadatos/${props.idDetalle.idRadicado}`
                );

                if (responseMeta.status === 200) {
                    metadatosInfo.value = responseMeta.data;
                }
                if (responsem.status === 200) {
                    responseML.value = responsem.data;
                    await getDocs();
                }
                break;

            case "ENTES_DE_CONTROL":
                // const radicadoEC = (props.idDetalle.numRadicado.match(/ENT\d+/) ||
                //     props.idDetalle.numRadicado.match(/SAL\d+/) ||
                //     [props.idDetalle.numRadicado])[0];

                const radicadoECid = props.idDetalle.idRadicado;
                const responseEN = await sgdeaAxios.get(
                    `/api/entes/obtenerEnteControl/${radicadoECid}`
                );

                if (responseEN.status === 200) {
                    const { data } = responseEN;
                    localStorage.setItem('idDocEntes', data.id);
                    informacionGeneral.value = dataMapping(data);
                }
                break;

            case "FAC_AMIN":
                const radicadoFAC = (props.idDetalle.numRadicado.match(/ENT\d+/) ||
                    props.idDetalle.numRadicado.match(/SAL\d+/) ||
                    [props.idDetalle.numRadicado])[0];
                const response = await sgdeaAxios.get('/facturacion/geCto/' + radicadoFAC);

                responseFAC.value = {
                    ...response.data.cto,
                    fechaRadicar: response.data.cto.fechaFormateada.split(' ')[0],
                    horaInicio: response.data.cto.fechaFormateada.split(' ')[1],
                };

                const responseCto = await sgdeaAxios.get('/radicados/obtenerHijosPorNodo/' + responseFAC.value.nodeId);
                if (responseCto.status !== 200 && responseCto.status !== 201) {

                    return;
                }

                const docs = responseCto.data.list.entries.map(doc => {
                    return {
                        nombreDocumento: doc?.entry.name,
                        tipoDocumento: doc?.entry.name.startsWith('SAL') ? 'De Salida' : 'De Entrada',
                        fechaCargue: moment(doc?.entry?.createdAt, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('DD/MM/YYYY'),
                        cargadoPor: doc?.entry.createdByUser?.displayName,
                        nodeId: doc?.entry.id
                    }
                });
                loadedDocs.value = docs;
                break;

            case "TUTELAS":
                const radicadoTU = (props.idDetalle.numRadicado.match(/ENT\d+/) ||
                    props.idDetalle.numRadicado.match(/SAL\d+/) ||
                    [props.idDetalle.numRadicado])[0];
                const responseTU = await sgdeaAxios.get(
                    `/tutela/info/${radicadoTU}`
                );
                if (responseTU.status === 200) {
                    responsePqrd.value = responseTU.data;
                }
                await getAllRegisters();
                break;

            case "CORRESPONDENCIA":
                try {
                    const radicadoLimpio = (props.idDetalle.numRadicado.match(/ENT\d+/) ||
                        props.idDetalle.numRadicado.match(/SAL\d+/) ||
                        [props.idDetalle.numRadicado])[0];

                    const { data } = await sgdeaAxios.get(
                        `/correspondencia/radicacion${props.idDetalle?.estado === "Por asignar" ?
                            '/' : '/asignaciones/'}${radicadoLimpio}`
                    );

                    if (!data || data.length === 0) {
                        toast.error("Número de radicado no encontrado");
                        break;
                    }

                    if (props.idDetalle?.estado === "Por asignar") {
                        detalleRadicado.value = data;
                    } else {
                        detalleAsignaciones.value = data[data.length - 1];
                        detalleRadicado.value = data[data.length - 1]?.radicacion;
                        detalleRadicado.value.radicadoSalida = detalleAsignaciones.value?.radicadoSalidaAprobar;
                    }

                    await getDocs2();
                    finished.value = true;
                } catch (error) {
                    toast.error("Error al obtener los datos de correspondencia");
                }
                break;

            case "CORRESPONDENCIA_COMUNICACION":
                const radicadoCOM =
                    props.idDetalle.numRadicado.match(/PRDSAL\d+/)?.[0] ||
                    props.idDetalle.numRadicado.match(/SAL\d+/)?.[0] ||
                    props.idDetalle.numRadicado.match(/PRDINT\d+/)?.[0] ||
                    props.idDetalle.numRadicado.match(/INT\d+/)?.[0] ||
                    props.idDetalle.numRadicado;


                const { data } = await sgdeaAxios.get(
                    `/correspondencia/obtenerCorrespondenciaComunicacion/${radicadoCOM}`
                )

                detalleComunicaciones.value = data;
                await getDocs2();
                break;
                case "COMUNICACION_MANUAL":
                const responseManual = await sgdeaAxios.get(
                    `/correspondencia/obtenerComunicacionManual/${props.idDetalle.idRadicado}`
                );
                if (responseManual.status === 200) {
                  detalleComunicaciones.value = responseManual.data;


                }
                break;
            case "COMUNICACIONES_MEDICINA":
                try {
                    const { data } = await getAllDataComunicacion(props.idDetalle.idRadicado);
                    allInfo.value = data;
                } catch (error) {
                    toast.error("Ocurrió un error al cargar la información de la comunicación.");
                }
                break;
            default:
                toast.error("El flujo especificado no es válido o no está implementado.");
                break;
        }
    } catch (error) {
        toast.error("Ocurrió un error al obtener los datos.");
    }
};

onMounted(async () => {
    await getDataByFlujo()
    // await getInformacionGeneral()
});

async function initData() {
    try {

        const response = await sgdeaAxios.get(
            "pqrd/getMetadatosByPqrdId?pqrdId=" + props.idDetalle.idRadicado
        );
        if (response.status == 200) {
            responseMetadatos.value = response.data;
        }

        const responseDef = await sgdeaAxios.get(
            "pqrd/getMetadatosDefensorByPqrdId?pqrdId=" + props.idDetalle.idRadicado
        );
        if (responseDef.status == 200) {
            responseMetadatos.value = {
                ...responseMetadatos.value,
                ...responseDef.data,
            };
        }
    } catch (error) {
    }
}

const handleTotalList = (totalList) => {
    listForVizualiser.value = totalList;
}

const getBlobToIframe = async (id, list) => {
  try {
    const { data } = await sgdeaAxios.get<DocumentoRadicado>(
      `/radicados/consultar_documento/${id}`
    );

    if (!data?.base64x) {
      return;
    }

    if (id) {
      nameDocument.value = listDocs.value.find((it) => it.id === id)?.nombre;
    }
    const cleanedBase64 = data.base64x.split(',').pop().replace(/\s/g, '');

    const byteCharacters = atob(cleanedBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    iframePdfUrl.value = URL.createObjectURL(blob);

    if (listForVizualiser.value.length > 0) {
      visualizadorPDF.value = true;
    }

  } catch (error) {
    toast.error("No se pudo cargar el documento. Intenta nuevamente.");
  }
};

const changeDocType = (items: any[]) => {
  if (
    Array.isArray(items) &&
    items.length > 0 &&
    !items.find((item) => item.tipo == "De Entrada") &&
    !loadedDocsToChangeType.value.find((item) => item.tipo == "De Entrada")
  ) {
    loadedDocsToChangeType.value = items;
    showChangeDocType.value = true;
  } else {
    loadedDocsToChangeType.value = [];
    showChangeDocType.value = false;
  }
};
const getAllDocs = async () => {
  const response = await sgdeaAxios.get(
    `/medicina/getAnexosCargados/${props.idDetalle.idRadicado}`
  );
  fileDataTable.value = mapDataToFileDataTable(response.data.listaAnexos);
};
const mapDataToFileDataTable = (data) => {
  documentosData.value = data;
  return data.map((doc) => ({
    formato: doc.nombreAnexo.split(".").pop(),
    nombre: doc.nombreAnexo.split(".").shift(),
    tipo: "De salida",
    fecha: doc.fecha,
    cargado_por: doc.cargadoPor,
    id: doc.nodeIdAnexo,
  }));
};
const getExpediente = async () => {
  const { data: expediente } = await sgdeaAxios.get("/expediente/children", {
    params: { nodeId: allInfo.value?.nodeIdCarpeta },
  });

  if (Object.keys(expediente).length) isExpedientes.value = true;
  else isExpedientes.value = false;
};
function removeButton(key) {
  const index = filteredTabs.value.findIndex((item) => item.key === key);

  if (index !== -1) {
    filteredTabs.value.splice(index, 1);
  }
}
function addButton(key, name, icon) {
  const isButtonExists = filteredTabs.value.some(
    (item) => item.key === key && item.icon === icon
  );

  if (!isButtonExists) {
    filteredTabs.value.push({
      key: key,
      name: name,
      icon: icon,
    });
  }
}
const mapDataToFormMetadatos = (data) => {
  meta.value++;
  let objToUpdate = {};

  Object.keys(formGeneralData.value).forEach((key) => {
    let keyToObjResponse = objKeys[key];
    if (["listMl"].includes(keyToObjResponse)) {
      objToUpdate[key] = data[keyToObjResponse].split(",").map(String);
    } else if (keyToObjResponse === "fechaSiniestro") {
      objToUpdate[key] = moment(data[keyToObjResponse], "DD-MM-YYYY").format(
        "DD/MM/YYYY"
      );
    } else {
      objToUpdate[key] =
        typeof data[keyToObjResponse] === "object"
          ? data[keyToObjResponse]?.id
          : data[keyToObjResponse];
    }
  });

  formGeneralData.value = { ...formGeneralData.value, ...objToUpdate };
};
const mapDataToFormDestinatarios = (data) => {
  let objToUpdate = {};

  Object.keys(objKeysDestinatarios).forEach((key) => {
    let keyToObjResponse = objKeysDestinatarios[key];

    if (keyToObjResponse === "pais") {
      objToUpdate[key] = data[keyToObjResponse]?.idPais;
    } else if (keyToObjResponse === "departamento") {
      objToUpdate[key] =
        data["pais"]?.idPais === 425
          ? data[keyToObjResponse]?.idDepartamento
          : data["pais"]?.nombre;
    } else if (keyToObjResponse === "municipio") {
      objToUpdate[key] =
        data["pais"]?.idPais === 425
          ? data[keyToObjResponse]?.idMunicipio
          : data["pais"]?.nombre;
    } else {
      objToUpdate[key] =
        typeof data[keyToObjResponse] === "object" && data[keyToObjResponse]
          ? data[keyToObjResponse]?.id
          : data[keyToObjResponse];
    }
  });

  formExitData.value = { ...formExitData.value, ...objToUpdate };
  isSendDestinatarios.value = true;
};
const validationsTypeCopy = (copy) => {
  updateTypeCopy.value = copy;
  formExitData.value.copyType = updateTypeCopy.value;
};
const handleClickAddNewDestinaryInterno = (formExitDataCopyInterno) => {
  const mapTypeCopyValue = "interno";

  if (Array.isArray(formExitDataCopyInterno)) {
    formExitDataCopyInterno.map(
      (obj) =>
        (bodyCopyInterna.value = [
          ...bodyCopyInterna.value,
          mapFormDataToDestinataires(obj, mapTypeCopyValue),
        ])
    );
    const resultado = Array.from(
      new Map(bodyCopyInterna.value.map((item) => [item.id, item])).values()
    );
    bodyCopyInterna.value = resultado;
    isFisrRenderInterno.value = false;
    return;
  }

  bodyCopyInterna.value = [
    ...bodyCopyInterna.value,
    mapFormDataToDestinataires(formExitDataCopyInterno, mapTypeCopyValue),
  ];
  isFormResetInterno.value = isFormResetInterno.value + 1;
};
const mapFormDataToDestinataires = (formExitData, type) => {
  if (type === dictionaryTypeCopy[1]) {
    return {
      id: `${formExitData.official}-${formExitData.dependencieType}`,
      nombre: formExitData.official,
      dependencia: formExitData.dependencieType,
      dependencia_label: formExitData.dependencia_label,
      nombre_label: formExitData.nombre_label,
    };
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
      correoElectronico: formExitData.emailRecipientCopyExterna,
      numeroDeDocumeto: formExitData.numeroDeDocumeto,
    };
  }
};
const handleClickAddNewDestinaryExterno = (formExitDataCopyExterno) => {
  const mapTypeCopyValue = "externo";

  if (Array.isArray(formExitDataCopyExterno)) {
    formExitDataCopyExterno.map(
      (obj) =>
        (bodyCopyExterna.value = [
          ...bodyCopyExterna.value,
          mapFormDataToDestinataires(obj, mapTypeCopyValue),
        ])
    );
    isFisrRender.value = false;
    const resultado = Array.from(
      new Map(bodyCopyExterna.value.map((item) => [item.id, item])).values()
    );
    bodyCopyExterna.value = resultado;
    return;
  }

  bodyCopyExterna.value = [
    ...bodyCopyExterna.value,
    mapFormDataToDestinataires(formExitDataCopyExterno, mapTypeCopyValue),
  ];
  isFormResetExterno.value = isFormResetExterno.value + 1;
};
const mapDataToFormCorreo = (data) => {
  let objToUpdate = {};

  Object.keys(objKeysCorreo).forEach((key) => {
    let keyToObjResponse = objKeysCorreo[key];
    objToUpdate[key] =
      typeof data[keyToObjResponse] === "object" && data[keyToObjResponse]
        ? data[keyToObjResponse].id
        : data[keyToObjResponse];
  });

  formExitData.value = { ...formExitData.value, ...objToUpdate };
};
const mapPrefijoComunicacion = (prefijo) => {
  isComunicacionAutomatica.value = prefijo?.aprobacionAutomatica;
  aprobadorSelected.value = [
    {
      id: prefijo?.aprobador?.id,
      grupo: prefijo?.oficina?.nombre,
      colaborador: prefijo?.aprobador?.firstname + prefijo?.aprobador?.lastname,
      cargo: "Aprobador",
    },
  ];

  if (!prefijo?.plantilla) {
    tipoPlantillaSeleted.value = 0;
  } else {
    tipoPlantillaSeleted.value = prefijo?.plantilla || 1;
  }
};
const getPlantillaSinPrefijo = async () => {
  const nodeid = process.env.NODE_SIN_PREFIJO;

  const response = await sgdeaAxios.get<any>(
    `/radicados/consultar_documento/${nodeid}`
  );

  return response.data;
};
const getFirma = async (idAprobador, idFirma) => {
  try {
    const response = await sgdeaAxios.get(
      `/usuarios/obtener-firma/${idAprobador || 0}`
    );
    const { data } = response;
    if (data && data.length > 0 && idFirma) {
      selectedSignature.value = data.find((firma) => firma.id === idFirma);
    }
  } catch (error) {
    toast.error("Hubo un error al cargar la firma del aprobador");
  }
};
function formatCopyExterna(data, formaEnvioId) {

  if ([1, 2].includes(formaEnvioId)) {
    return `${data?.nombreDest?.trim()}${
      data?.correoDestinatario ? " / " + data?.correoDestinatario.trim() : ""
    }`;
  }
  return `${data?.nombreDest?.trim()}${
    data?.direccionDestinatario
      ? " / Dirección: " + data?.direccionDestinatario.trim()
      : ""
  }${
    data?.departamento?.nombre
      ? " / Departamento: " + data?.departamento?.nombre
      : ""
  }${
    data?.municipio?.nombre ? " / Municipio: " + data?.municipio?.nombre : ""
  }${
    data?.telefonoDestinatario
      ? " / Teléfono: " + data?.telefonoDestinatario
      : ""
  }`;
}
function formatCopyInterna(data, formaEnvioId) {
  if ([1, 2].includes(formaEnvioId)) {
    return `${data?.usuario?.fullname?.toUpperCase().trim()}${
      data?.usuario?.email ? " / " + data?.usuario?.email.trim() : ""
    }`;
  }
  return `${data.usuario.fullname?.toUpperCase().trim()}${
    data.usuario.direccion
      ? " / Dirección: " + data?.usuario?.direccion?.trim()
      : ""
  }${
    data?.usuario?.departamento?.nombre
      ? " / Departamento: " + data?.usuario?.departamento?.nombre
      : ""
  }${
    data?.usuario?.municipio?.nombre
      ? " / Municipio: " + data?.usuario?.municipio?.nombre
      : ""
  }${data?.usuario?.celular ? " / Teléfono: " + data?.usuario?.celular : ""}`;
}
const formatNombre = (nombre: string | undefined) => {
  if (!nombre) return "";
  const [nombrePrimero, ...resto] = nombre.trim().split(" ");
  const apellido = resto.join(" ");
  return `${nombrePrimero.charAt(0)}.${apellido}`;
};
const trazaDocument = ref<HistorialDocSalida[]>([]);
const gettrazabilidadDocumento = async () => {
  if (allInfo.value && allInfo.value?.id) {
    try {
      const response = await sgdeaAxios.get<HistorialDocSalida[]>(
        `/api/documentos-salida/${props.idDetalle.idRadicado}/historial`
      );
      trazaDocument.value = response.data;
    } catch {
      toast.error("Ha ocurrido un error al obtener la información");
    }
  }
};
const getAllData = async () => {
  const { getCopiesTypesOptions, getAllDataByID, getShippingWayOptions } =
    useCrearComunicacionesLogic();

  const promises = props.idDetalle.idRadicado
    ? [getCopiesTypesOptions(), getAllDataByID(props.idDetalle.idRadicado)]
    : [getCopiesTypesOptions()];

  // @ts-expect-error
  const [copias, allDataLoaded] = await Promise.allSettled(promises);

  copia.value = copias;
  allInfo.value = allDataLoaded?.value;
  isDisabled.value =
    (allDataLoaded?.value.estado === "Por revisar" ||
      allDataLoaded?.value.estado === "Por aprobar" ||
      allDataLoaded?.value.estado === "Revisado" ||
      allDataLoaded?.value.estado === "Aprobado") &&
    auth.userInfo.role === "Gestionador"
      ? true
      : false;

  await getAllDocs();
  await getExpediente();
  isDocSalida.value = allDataLoaded?.docSalida;

  if (!allDataLoaded.value?.metadatos) {
    removeButton("datos-salida");
    removeButton("incluir-exp");
    removeButton("adjuntar-documento");
    removeButton("documento-salida");
    removeButton("trazabilidad");
    removeButton("comentarios");
    removeButton("enviar-revision");
    removeButton("trazabilidad-documento");
  } else {
    addButton("datos-salida", "Datos de Salida", "account_tree");
    addButton("documento-salida", "Documento de Salida", "post_add");
    addButton(
      "adjuntar-documento",
      "Adjuntar documentos de salida",
      "attach_file"
    );
    addButton("incluir-exp", "Incluir Expediente", "adf_scanner");
    addButton("trazabilidad", "Trazabilidad", "history");
    addButton("comentarios", "Comentarios", "forum");
    addButton("enviar-revision", "Enviar a Revisión", "assignment_turned_in");
    addButton("trazabilidad-documento", "Trazabilidad de Documento", "history");
  }

  if (isDisabled.value) {
    removeButton("comentarios");
    removeButton("adjuntar-documento");
    removeButton("enviar-revision");
  }

  if (auth.userInfo.role === "Revisor" || auth.userInfo.role === "Aprobador") {
    removeButton("metadatos");
    removeButton("datos-salida");
    removeButton("incluir-exp");
    removeButton("adjuntar-documento");
    removeButton("enviar-revision");
  } else {
    removeButton("informacion-general");
    removeButton("documentos-relacionados");
  }

  if (allDataLoaded?.value?.metadatos) {
    mapDataToFormMetadatos(allDataLoaded?.value?.metadatos);
    giveMetadatos.value = true;
  }

  if (allDataLoaded?.value?.destinatarios) {
    mapDataToFormDestinatarios(allDataLoaded?.value?.destinatarios);
    giveDestinatario.value = true;
  }

  if (allDataLoaded?.value) {
    validationsTypeCopy(allDataLoaded?.value?.tipoCopia);
    getCopy.value = allDataLoaded?.value?.tipoCopia;
  }

  if (allDataLoaded?.value?.listCopia?.interna?.length) {
    const mapUserInterno = allDataLoaded?.value?.listCopia?.interna.map((e) => {
      return {
        id: `${e.usuario.id}-${e.dependencia.idSeccionSubSeccion}`,
        official: e.usuario.id,
        dependencieType: e.dependencia.idSeccionSubSeccion,
        dependencia_label: e.dependencia.nombre,
        nombre_label: e.usuario.firstname + " " + e.usuario.lastname,
      };
    });

    handleClickAddNewDestinaryInterno(mapUserInterno);
  }

  if (allDataLoaded?.value?.listCopia?.externa?.length) {
    const mapUserExterno = allDataLoaded?.value?.listCopia?.externa.map((e) => {
      return {
        emailRecipientCopyExterna: e.correoDestinatario,
        shippingMethodCopyExterna: e.formaEnvio.id,
        recipientDocumentTypeCopyExterna: {
          id: e.tipoDocumento.id,
          nombre: e.tipoDocumento.nombre,
        },
        recipientNameCopyExterna: e.nombreDest,
        addressRecipientCopyExterna: e.direccionDestinatario,
        countryRecipientCopyExterna: {
          label: e.pais.nombre,
          value: e.pais.idPais,
        },
        departmentRecipientCopyExterna: e.departamento.idDepartamento,
        municipalityRecipientCopyExterna: e.municipio.idMunicipio,
        telephoneRecipientCopyExterna: e.telefonoDestinatario,
        municipio_label: e.municipio.nombre,
        departamento_label: e.departamento.nombre,
        forma_label: e.formaEnvio.forma,
        tipo_label: e.tipoDocumento.nombre,
      };
    });

    handleClickAddNewDestinaryExterno(mapUserExterno);
  }

  if (allDataLoaded?.value?.respSal) {
    mapDataToFormCorreo(allDataLoaded?.value?.respSal);
    giveCorreo.value = true;
  }

  if (allDataLoaded?.value?.docSalida) isSendContenidoDoc.value = true;

  if (allDataLoaded?.value) {
    mapPrefijoComunicacion(allDataLoaded?.value?.prefijo);
  }

  // ! Asunto
  const prefijoAsunto = allDataLoaded?.value.prefijo?.prefijo?.nombre || "";
  const nameEnterprise = "Positiva S.A";
  const tipoDocAsunto = getAcronimobyDoc(
    allDataLoaded?.value?.metadatos?.tipoDocumento?.nombre
  );
  const numDocAsunto = allDataLoaded?.value?.metadatos?.numeroDocumento;
  const nombreAsunto = allDataLoaded?.value?.metadatos?.afectado;
  const gestionadorOficinaAsunto =
    allDataLoaded?.value.idRadicador.usuarioRelaciones[0]?.oficina?.nombre;
  const radicadoAsunto = allDataLoaded?.value.idRadicado;

  const partesAsunto = [
    prefijoAsunto,
    tipoDocAsunto,
    numDocAsunto,
    nombreAsunto,
  ].filter(Boolean);
  const asunto1 = partesAsunto.join(" - ").trim();
  const asunto2 = [
    nameEnterprise,
    ...partesAsunto,
    gestionadorOficinaAsunto,
    radicadoAsunto,
  ]
    .filter(Boolean)
    .join(" - ")
    .trim();

  formExitData.value.asunto = asunto1;
  formExitData.value.asuntoCorreo = asunto2;
  formExitData.value.anexos = allDataLoaded?.value?.anexos;

  secuencia.value = allDataLoaded?.value?.idRadicado;
  state.value = allDataLoaded?.value?.estado || "En edición";
  copiesTypesOptions.value = copias?.value;
  shippingMethodsOptions.value = await getShippingWayOptions();
  const getPlantilla = await getPlantillaSinPrefijo();
  documentStore.clearDocumentContent();

  if (
    allDataLoaded?.value.prefijo?.prefijo.nombre == null ||
    allDataLoaded?.value.prefijo?.prefijo.nombre === "Sin prefijo"
  ) {
    documentoFile.value = getPlantilla.base64x;

    restric.value = false;
  } else {
    const response = await sgdeaAxios.get(
      `medicina/prefijo-name/${allDataLoaded?.value.prefijo?.prefijo.nombre}/${allDataLoaded?.value.prefijo?.oficina.id}`
    );
    documentoFile.value = response.data.plantilla;
    restric.value = true;
  }

  htmlContent.value = allDataLoaded?.value.docSalida;

  if (allDataLoaded?.value.idAprobador) {
    await getFirma(
      allDataLoaded?.value.idAprobador.id,
      allDataLoaded?.value.idAprobador.firmaPredeterminadaId
    );
    aprobado.value = allDataLoaded?.value?.estado === "Aprobado";
  }
  referentKey = {
    asunto: allDataLoaded.value?.asunto,
    NombredeDestinatario: allDataLoaded.value.destinatarios?.nombreDestinatario,
    NumeroDocDestinatario: allDataLoaded.value.destinatarios?.numeroDocumento,
    DireccionDeDestinatario:
      allDataLoaded.value.destinatarios?.direccionDestinatario,
    TelefonoDeDestinatario:
      allDataLoaded.value.destinatarios?.telefonoDestinatario || "",
    DepartamentoYMunicipioDestinatario:
      allDataLoaded.value.destinatarios?.departamento &&
      allDataLoaded.value.destinatarios?.municipio
        ? `${allDataLoaded.value.destinatarios.departamento?.nombre} - ${allDataLoaded.value.destinatarios.municipio?.nombre}`
        : "",
    CorrreoDestinatario: allDataLoaded.value.destinatarios?.correoDestinatario,
    NombreAfectado: allDataLoaded.value.metadatos?.afectado,
    TIpoDeDocumentoAfectado: "", // "documento afectado",
    NumerodedocumentoAfectado: "", //"numerodocumento afectado",
    Firma: selectedSignature?.value
      ? selectedSignature?.value?.tipoFirmaUsuario?.nombre === "Grafo"
        ? selectedSignature?.value?.fileData
        : selectedSignature?.value?.fileName
      : "",
    // NombreAprobador: allDataLoaded.value?.idAprobador
    //   ? allDataLoaded.value?.idAprobador?.fullname.toUpperCase()
    //   : "",
    CargoAprobador: allDataLoaded.value?.idAprobador
      ? allDataLoaded.value?.idAprobador?.cargo?.nombre
      : "",
    DependenciaAprobador: allDataLoaded.value?.idAprobador
      ? "GERENCIA MÉDICA"
      : "",
    prefijo: allDataLoaded?.value.prefijo
      ? allDataLoaded?.value.prefijo?.prefijo?.nombre
      : "",
  };

  if (
    allDataLoaded.value.listCopia?.externa?.length > 0 ||
    allDataLoaded.value.listCopia?.interna?.length > 0
  ) {
    const formaEnvioId = allDataLoaded.value.destinatarios.formaEnvio.id;

    arrayCopyExterna.value =
      allDataLoaded.value.listCopia?.externa?.map((item) =>
        formatCopyExterna(item, item.formaEnvio.id)
      ) || [];
    arrayCopyInterna.value =
      allDataLoaded.value.listCopia?.interna.map((item) =>
        formatCopyInterna(item, item.formaEnvio.id)
      ) || [];
    arrayAllCopys.value = [
      ...arrayCopyInterna.value,
      ...arrayCopyExterna.value,
    ]; // arrayCopyInterna.value.concat(arrayCopyExterna.value);

  } else {
    arrayCopyExterna.value = [];
    arrayCopyInterna.value = [];
    arrayAllCopys.value = "0";
  }

  dataFooter.value = {
    Anexo: formExitData.value.anexos,
    Copia: arrayAllCopys.value,
    DatosGestionador: allDataLoaded.value?.idRadicador
      ? `${formatNombre(
          allDataLoaded.value?.idRadicador?.fullname?.toUpperCase()
        )} -
          ${allDataLoaded.value?.idRadicador?.cargo?.nombre} - GERENCIA MÉDICA`
      : "",
    DatosAprobador: allDataLoaded.value?.idAprobador
      ? `${formatNombre(
          allDataLoaded.value?.idAprobador?.fullname?.toUpperCase()
        )} -
    ${allDataLoaded.value?.idAprobador?.cargo?.nombre} - GERENCIA MÉDICA`
      : "",
    DatosRevisor: allDataLoaded.value?.idRevisor
      ? `${formatNombre(
          allDataLoaded.value?.idRevisor?.fullname?.toUpperCase()
        )} -
    ${allDataLoaded.value?.idRevisor?.cargo?.nombre} - GERENCIA MÉDICA`
      : "",
    FormadeEnvio: allDataLoaded.value?.destinatarios?.formaEnvio
      ? allDataLoaded.value?.destinatarios.formaEnvio.nombre
      : "",
    // firmaAprobador: allDataLoaded.value?.idAprobador
    //   ? allDataLoaded.value?.idAprobador?.fullname.toUpperCase()
    //   : "NOMBRE DEL APROBADOR",
    // cargoAprobador: allDataLoaded.value?.idAprobador
    //   ? allDataLoaded.value?.idAprobador?.cargo?.nombre
    //   : "CARGO DEL APROBADOR",
    // dependenciaAprobador: allDataLoaded.value?.idAprobador
    //   ? allDataLoaded.value?.idAprobador.usuarioRelaciones[0].oficina
    //       .dependencia.nombre
    //   : "",
  };
  await gettrazabilidadDocumento();
};
watch(tab, async (val) => {
    if (val === "trazabilidad") {

        const moduloOrigen = props.idDetalle.flujo

        switch (moduloOrigen) {
            case "TUTELAS":
                const response10 = await sgdeaAxios.get(
                    '/trazabilidad/obtenerPorCodProceso/' + 'TUT' + props.idDetalle.idRadicado
                );

                trazabilidadData.value = response10?.data?.length
                    ? response10.data.sort((a, b) => a.id - b.id).map((item) => ({
                        ...item,
                        detalle: item.descripcion,
                    }))
                    : [];
                break;

            case "ENTES_DE_CONTROL":
                const response11 = await sgdeaAxios.get(
                    '/trazabilidad/obtenerPorCodProceso/' + 'ENTC' + props.idDetalle.idRadicado
                );

                trazabilidadData.value = response11?.data?.length
                    ? response11.data.sort((a, b) => a.id - b.id).map((item) => ({
                        ...item,
                        detalle: item.descripcion,
                    }))
                    : [];
                break;
            case "MEDICINA_LABORAL":
                const response12 = await sgdeaAxios.get(
                    '/trazabilidad/obtenerPorCodProceso/' + 'ML' + props.idDetalle.idRadicado
                );

                trazabilidadData.value = response12?.data?.length
                    ? response12.data.sort((a, b) => a.id - b.id).map((item) => ({
                        ...item,
                        detalle: item.descripcion,
                    }))
                    : [];
                break;
                case "COMUNICACION_MANUAL":
                const responseManual = await sgdeaAxios.get(
                    '/trazabilidad/obtenerPorCodProceso/' + 'PRE' + props.idDetalle.idRadicado
                );

                trazabilidadData.value = responseManual?.data?.length
                    ? responseManual.data.sort((a, b) => a.id - b.id).map((item) => ({
                        ...item,
                        detalle: item.descripcion,
                    }))
                    : [];
                break;
            case "CORRESPONDENCIA":
                const response6 = await sgdeaAxios.get(
                    '/trazabilidad/obtenerPorCodProceso/' + 'COR' + props.idDetalle.idRadicado
                );

                trazabilidadData.value = response6?.data?.length
                    ? response6.data.sort((a, b) => a.id - b.id).map((item) => ({
                        ...item,
                        detalle: item.descripcion,
                    }))
                    : [];
                break;
            case "PQRD":
                const response8 = await sgdeaAxios.get(
                    "/trazabilidad/obtenerPorCodProceso/" + "PQRD" + props.idDetalle.idRadicado
                );
                trazabilidadData.value = response8?.data?.length
                    ? response8.data.sort((a, b) => a.id - b.id).map((item) => ({
                        ...item,
                        detalle: item.descripcion,
                    }))
                    : [];
                break;
            case "FAC_AMIN":
                const response = await sgdeaAxios.get('/trazabilidad/obtenerPorCodProceso/' + 'CTO' + props.idDetalle.idRadicado);
                if (!response?.data || response.data.length === 0) {
                    trazabilidadData.value = [];
                    return;
                }

                trazabilidadData.value = response.data
                    .sort((a, b) => a.id - b.id)
                    .map((item, index) => ({
                        ...item,
                        // action: item?.accion ?? item.descripcion,
                    }));
                break;
            case "CORRESPONDENCIA_COMUNICACION":
                const responseCM = await sgdeaAxios.get('/trazabilidad/obtenerPorCodProceso/' + 'COMIND' + props.idDetalle.idRadicado);
                if (!responseCM?.data || responseCM.data.length === 0) {
                    trazabilidadData.value = [];
                    return;
                }

                trazabilidadData.value = responseCM.data
                    .sort((a, b) => a.id - b.id)
                    .map((item, index) => ({
                        ...item,
                        // action: item?.accion ?? item.descripcion,
                    }));
                break;
            case "COMUNICACIONES_MEDICINA":
                const responseCMe = await sgdeaAxios.get(
                    "/trazabilidad/obtenerPorCodProceso/" + "MLCOM" + props.idDetalle.idRadicado
                );
                if (!responseCMe?.data || responseCMe.data.length === 0) {
                    trazabilidadData.value = [];
                    return;
                }

                trazabilidadData.value = responseCMe.data
                    .sort((a, b) => a.id - b.id)
                    .map((item, index) => ({
                        ...item,
                        fechaHora: moment(item.fechaHora).format("DD/MM/YYYY HH:mm"),
                    }));
                break;
            default:
                trazabilidadData.value = [];
                break;
        }
    }
})

</script>

<style></style>
