<template>
  <main class="q-py-md">
    <a @click.prevent="goBack" class="text-primary q-mb-md block cursor-pointer" style="text-decoration: none">
      <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
      <b> Volver</b>
    </a>
    <div class="tw-flex tw-justify-between tw-pt-4 tw-mb-3">
      <h1 class="tw-text-3xl tw-font-bold">
        Radicado #
        {{ (radicadoSalidaComunicacion && radicadoSalidaComunicacion !== "") ? radicadoSalidaComunicacion :
          (detalleAsignaciones?.radicadoSalidaAprobar ?? showRoute) }}

      </h1>
      <div class="tw-flex tw-min-h-[36px] tw-pr-2 tw-gap-2" v-if="isAprobador">
        <Modal v-model="cancelModalDoc" title="Confirmación" persistent
          text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
          :cancelButton="true" @closeModal="cancelModalDoc = false" textButtonCancel="No" text-button="Si"
          @handleAccept="backViewDocSalida" />
      </div>
      <div class="tw-flex tw-min-h-[36px] tw-pr-2 tw-gap-2" v-if="isAprobador && status === 'Por aprobar'">
        <q-btn label="Rechazar" color="secondary" icon="close" @click="openConfirmationRechazoAprobador = true"
          class="tw-w-40" />
        <q-btn label="Aprobar" color="primary" icon="check" @click="
          openConfirmationAprobador = true;
        currentTab = 'docSalida';
        " class="!tw-px-8 tw-w-40" />
      </div>
    </div>
    <span
      class="tw-bg-orange-100 q-my-sm tw-mb-3 tw-border-orange-400 tw-border tw-rounded-full tw-w-auto q-px-md q-py-xs">
      {{ status }}
    </span>

    <q-tabs inline-label no-caps outside-arrows align="left"
      class="tw-rounded-lg tw-my-4 tw-bg-white custom-tabs tw-flex rowsTab-alingCenter" indicator-color="transparent"
      active-color="primary" v-model="currentTab">
      <q-tab :class="[
        'tw-rounded-lg q-pa-sm tw-text-sm',
        {
          '!tw-text-primary !tw-border-primary color-icon !tw-bg-transparent':
            tab.name == currentTab,
        },
      ]" v-for="tab in tabs" :key="tab.label" :name="tab.label" :ripple="false" @click="changeTab(tab.name)"
        :icon="tab.icon" :label="tab.label">
      </q-tab>
    </q-tabs>

    <Asignar v-if="currentTab === allNameTabs.asignar && !isRevisor && !isAprobador"
      :details-radicado="detalleRadicado" />

    <!-- <AsignacionDevolucion v-if="
      currentTab === allNameTabs.asignarDevolucion &&
      !isRevisor &&
      !isAprobador
    " :idFlujo="1" :idCaso="detalleRadicado.id" /> -->

    <InformacionGeneral v-if="currentTab === 'vistaInformacionGeneral'"
      :tiempo-vencer="detalleAsignaciones?.fechaVencimiento" :list-docs="listDocs" :list-docs2="listDocs2"
      :list-docs3="listDocs3" :visualize="getBlobToIframe" :download="download" :details-radicado="detalleRadicado"
      :isRevisor="isRevisor" :isAprobador="isAprobador" class="tw-w-[100%]" :colaborador="detalleAsignaciones?.usuario"
      :isDevolucion="isDevolucion" :status="status" :details-asignaciones="detalleAsignaciones"
      :details-comunicacion="detalleComunicaciones" />

    <DocumentosRelacionados :visualize="getBlobToIframe" v-model:detalleRadicado="detalleRadicado"
      :details-comunicacion="detalleComunicaciones" v-show="currentTab === allNameTabs.documentosRelacionados"
      :show-modal="modalDocuments" v-model:finished="finished" @updated="getData()" />

    <ReasignarOficina v-if="currentTab === allNameTabs.reasignar" :data="detalleRadicado" @redirect="backView"
      @handleAcceptModal="saveReasignacion" />

    <ajuntarDocumento v-if="currentTab === allNameTabs.DocumentoEntrada" :details-radicado="detalleRadicado"
      @back-view="backView" type="Entrada" @updateData="getData" />

    <Trazabilidad v-if="currentTab === allNameTabs.trazabilidad" :doneItems="trazabilidadData" />

    <TrazabilidadDocumento v-if="currentTab === allNameTabs.trazabilidadDocumento" :cor-data="trazaDocument"
      :id="detalleRadicado.id" />

    <Comentarios v-if="currentTab === allNameTabs.comentarios" @update="handleUpdate" :key="incrementaKey"
      text-default="Ha comentado sobre la radicación" :details-radicado="detalleRadicado" />

    <div v-if="currentTab === allNameTabs.docSalida && viewEditor">
      <Editor :data="dataFooter" :referentKey="referentKey" :restric="false" :base64="documentoFile"
        :isEditorEmpty="true" @datos-response="autoSaveDocument" @aprobado="aprobarCasoAprobador"
        :img-base64="imgBase64" :aprobado="aprobadoDocSal" :internal-com="internalCom"
        v-if="currentTab === allNameTabs.docSalida && viewEditor == true" :document="htmlContent" />
    </div>

    <div v-if="currentTab === allNameTabs.docSalidaDevolucion && viewEditor">
      <Editor :data="dataFooter" :referentKey="referentKey" :restric="false" :base64="documentoFile"
        :isEditorEmpty="true" @datos-response="autoSaveDocument" @aprobado="aprobarCasoAprobador"
        :img-base64="imgBase64" :aprobado="aprobadoDocSal" :document="htmlContent" />
    </div>

    <div v-if="currentTab === allNameTabs.vistoBueno">
      <Modal v-model="vistoBuenoModal" title="Confirmación" :is-success="false" @handleAccept="submitVistoBueno"
        :isRevisor="isRevisor" :gestionador="gestionador" cancel-button textButtonCancel="Cancelar"
        textButton="Visto bueno" text="¿Está seguro de dar el visto bueno a la respuesta proyectada?"
        @close-modal="currentTab = 'vistaInformacionGeneral'" type="button" />
      <Modal v-model="succesVistoBueno" title="Éxito" :is-success="true" @handleAccept="finishVisto"
        textButton="Continuar" text="La respuesta proyectada tiene su visto bueno" @close-modal="finishVisto"
        type="button" />
    </div>

    <div v-if="currentTab === allNameTabs.rechazarRespuesta">
      <RechazarModalCorrespondencia :motivo-limit="1000" title="Rechazar Documento"
        @hide-modal="currentTab = 'vistaInformacionGeneral'" :show-modal="openRMAprobador" :isRevisor="isRevisor"
        :gestionador="gestionador" @update-modal="updateModalAprobadorRechazo" />
    </div>

    <div v-if="openConfirmationRechazoAprobador == true">
      <RechazarModalCorrespondencia :motivo-limit="1000" title="Rechazar Documento"
        @hide-modal="openConfirmationRechazoAprobador = false" :show-modal="openRMAprobador"
        @update-modal="updateModalAprobadorRechazo" />
    </div>

    <DatosSalida v-if="currentTab === allNameTabs.datosSalida" :details-radicado="detalleRadicado"
      @update:datos-salida="updateDatosSalida" :isCertificado="isCertificado" :details-copies="copias" />

    <ajuntarDocumento v-if="currentTab === allNameTabs.soporteSalida" :details-radicado="detalleRadicado"
      :visualize="viewDoc" @back-view="backView" type="Salida" @updateData="getData" />

    <div v-if="currentTab === allNameTabs.manual">
      <Modal v-model="manual" title="Gestión Manual" persistent
        text="¿Esta seguro de iniciar la gestión manual del trámite?" :is-success="false" :cancelButton="true"
        @closeModal="closeModal" textButtonCancel="No" text-button="Si" @handleAccept="gestionManual" />
    </div>

    <Gestion v-if="currentTab === allNameTabs.cerrar" :details-asignaciones="detalleAsignaciones"
      @update:modelValue="backView" persistent mode="Cerrar" :user="userInfo?.name" />

    <div v-if="currentTab === allNameTabs.enviarRevision">
      <Enviar :details-asignaciones="detalleRadicado" @back-view="backView" :isMetadatos='isMetadatos'
        :change-document="changeGestionador" :documento="responseDocSalida" :user-name="auth.userInfo.name"
        :user-rol="auth.userInfo.role" />
    </div>



    <Gestion v-if="currentTab === allNameTabs.reiniciar" :details-asignaciones="detalleAsignaciones"
      @update:modelValue="backViewGestion" persistent mode="Reiniciar" :user="userInfo?.name" />

    <IncluirExpediente v-if="currentTab === allNameTabs.expediente" :cor-data="hardcoreData" :isExpediente="isExpe"
      :id-cor="detalleRadicado.id" />

    <EnviarAprobacion v-if="currentTab === allNameTabs.enviarAprobacion" :details-asignaciones="detalleRadicado"
      @back-view="backView" :isMetadatos='isMetadatos' :change-document="changeGestionador"
      :documento="responseDocSalida" :user-name="auth.userInfo.name" :user-rol="auth.userInfo.role" />

    <EnviarAprobacionDev v-if="currentTab === allNameTabs.enviarAprobacionDev" :idComunicacion="detalleRadicado.id"
      :expedienteData="detalleRadicado" />

    <ReasignarGestor v-if="currentTab === allNameTabs.reasignarGestor" @back-view="backView"
      :details-asignaciones="detalleAsignaciones" />

    <DatosGenerales v-if="currentTab === allNameTabs.datosGeneralesComunicaciones"
      :detalles-comunicaciones="detalleComunicaciones" />

    <DatosSalidaComunicaciones v-if="currentTab === allNameTabs.datosSalidaComunicaciones"
      :detalles-comunicaciones="detalleComunicaciones" />

    <AdjuntarDocsComunicaciones v-if="currentTab === allNameTabs.adjuntarDocsComunicaciones"
      :id="detalleComunicaciones.id" />

    <EliminarComunicacion v-if="currentTab === allNameTabs.eliminarComunicacion" :id="detalleComunicaciones.id"
      @back="changeTab" />

    <IncluirExpedienteComunicaciones v-if="currentTab === allNameTabs.incluirExpedienteComunicaciones"
      :tutelasData="hardcoreData" :isExpediente="true" />

    <CambiarUserComunicaciones v-if="currentTab === allNameTabs.cambiarAprobadorComunicaciones"
      :id="detalleComunicaciones?.id" is-aprobador @change-status="getData" />

    <CambiarUserComunicaciones v-if="currentTab === allNameTabs.cambiarRevisorComunicaciones"
      :id="detalleComunicaciones?.id" :is-aprobador="false" @change-status="getData" />

    <Reclasificar :detalleCorrespondencia="detalleRadicado" v-if="currentTab === allNameTabs.reclasificar" />

    <EnviarPorCorrespondencia v-if="currentTab === allNameTabs.enviarPorCorrespondencia"
      :radicado-salida="radicadoSalida" @back-view="backView" :detalleRadicado="detalleRadicado"
      :datos-remitente="detalleRadicado?.remitente" />

    <EnviarPorCorreo v-if="currentTab === allNameTabs.enviarPorCorreo" :detalle-radicado="detalleRadicado"
      :list-docs="listDocs" @back-view="backView" typeView="Correspondencia" />

    <CerrarDevolucion v-if="currentTab === allNameTabs.cerrarDevolucion" @back-view="backView"
      :detallesRadicado="detalleRadicado" typeFlujoSgda="Correpondencia-Ventanilla" pathBandeja="/correspondencia" />

    <AnexosSalida v-if="currentTab === allNameTabs.anexosSalida" :segunda-devolucion="segundaDevolucion"
      :is-devolucion="isDevolucion" :detalle-radicado="detalleRadicado" @back-view="backView" />

    <EnviarPublicacion v-if="currentTab === allNameTabs.enviarPublicacion" @back-view="backView"
      typeFlujoSgda="Correpondencia-Ventanilla" :idCaso="detalleRadicado.id" :detalle-radicado="detalleRadicado"
      pathBandeja="/correspondencia" />

    <ArchivoEncriptado v-if="currentTab === allNameTabs.archivoEncriptado" @back-view="backView" />

    <Publicar @back-view="backView" v-if="currentTab === allNameTabs.publicar" :type="'correspondencia'"
      :detalles-registro="detalleRadicado" />

    <RechazarPublicacion @back-view="backView" @back-page="router.push('/correspondencia')"
      :detalles-registro="detalleRadicado" :type="'correspondencia'"
      v-if="currentTab === allNameTabs.rechazarPublicacion" />

    <ArchivosDesfijacion :detalles-registro="detalleRadicado" :type="'correspondencia'"
      v-if="currentTab === allNameTabs.archivosDesfijacion" @back-view="router.push('/correspondencia')" />

    <CierrePublicacion :detallesRegistro="detalleRadicado" @reload="getData()"
      v-if="currentTab === allNameTabs.cierrePublicacion" :type="'correspondencia'" />

    <Metadatos v-if="currentTab === allNameTabs.metadatosDinamicos" :metadatos="metadatos"
      :detalle-radicado="detalleRadicado" />

    <div v-if="visualizadorPDF" class="tw-h-full tw-w-full">
      <q-dialog v-model="visualizadorPDF" seamless position="right" class="">
        <q-card class="tw-h-full tw-w-[2000px] tw-z-[1000] tw-overflow-hidden">
          <q-card-section>
            <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
              <div>
                <q-btn v-if="!visibleDoscRead" @click="visualizadorPDF = false"
                  class="tw-absolute tw-ml-5 tw-mt-20 tw-z-[2000] tw-text-white tw-bg-red-500">Cerrar</q-btn>
                <iframe class="tw-h-[80vh] tw-w-full" :src="iframePdfUrl" frameborder="0"></iframe>

                <q-tabs v-model="tabsFiles" dense align="justify" narrow-indicator>
                  <q-tab v-for="item in listForVizualiser" :name="item.nombre">
                    <q-card class="tw-h-[10vh] tw-w-[150px] tw-p-3" @click="getBlobToIframe(item.nodeId, null)">
                      <q-img v-lazy :data-url="docImg" style="width: 30px"> </q-img>
                      <p class="tw-text-gray-dark textFile tw-mt-2">
                        {{ item.nombre }}
                      </p>
                    </q-card>
                  </q-tab>
                </q-tabs>
              </div>
            </transition>
          </q-card-section>
          <q-inner-loading :showing="visibleDoscRead" label-class="text-teal" label-style="font-size: 1.1em" />
        </q-card>
      </q-dialog>
    </div>
    <ConfirmModal text-cancel-modal="No" text-confirm-modal="Si" :text-show-modal="tipoDeComunicacion === 1
      ? '¿Está seguro de aprobar el memorando interno?'
      : '¿Está seguro de aprobar el documento de salida?'"
      @update:show-modal="currentTab = 'vistaInformacionGeneral', openConfirmationAprobador = false"
      @confirm-modal="beforeAprobacion()" :show-modal="openConfirmationAprobador" :loading="loadingEnvios" />

    <ConfirmModal text-cancel-modal="No" text-confirm-modal="Sí"
      text-show-modal="¿Está seguro de rechazar el documento de salida?"
      @update:show-modal="() => (openConfirmationRechazoAprobador = false)" @confirm-modal="rechazarAprobacion"
      :show-modal="openRechazoAprobador" />

    <Modal v-model="modalRechazo" title="Trámite Rechazo"
      :text="`Trámite Rechazado, se envío correo electrónico al gestionador correspondiente`" text-button="Aceptar"
      label="Confirmar" />

    <div v-if="currentTab === allNameTabs.nuevoDocSalida">
      <Modal v-model="modalNuevoDoc" title="Confirmación" cancelButton @handleAccept="nuevoDocumento"
        @closeModal="closeModal" textButtonCancel="Cancelar" text-button="Aceptar"
        text="¿Desea crear un nuevo documento de salida?" type="button" />
    </div>


    <q-dialog v-model="aprobarCasoModal">
      <q-card :class="['tw-px-3', 'tw-p-9 tw-w-[980px]']">
        <q-form greedy ref="firmaForm">
          <q-card-section class="text-h6 tw-max-w-sm text-center text-weight-bold">
            Cargar firma
          </q-card-section>
          <q-card-section class="tw-max-w-sm">
            Adjuntar firma *
            <FileLoader :max-file-size="2 * 1024 * 1024" max-file-size-label="2" v-model:model-value="firmaAprobador"
              :max-files="1" accept-file="png, jpg, jpeg, webp" @rejected="rejectedTypesAprob" :rules="[inputRequired]" />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn :label="`Aprobar`" style="
                width: 250px;
                height: 45px;
                border-radius: 8px;
                font-size: 18px;
              " text-color="white" color="secondary" class="tw-rounded-xl tw-p-3" @click="updateModalApruebaCaso" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <div v-if="currentTab === allNameTabs.devolverAdmin">
      <q-dialog v-model="devolverAdminModal" persistent class="">
        <q-card class="tw-px-3 tw-p-9 tw-w-[980px] tw-gap-y-5">
          <h2 class="tw-font-bold tw-text-labels tw-text-xl tw-text-center tw-mb-5">
            Devolver
          </h2>
          <div class="col-sm-12 tw-p-2">
            <p class="tw-text-label tw-font-semibold">
              Ingrese la observación * {{ devolverObservacion ? devolverObservacion.length : '0' }}/1000
            </p>
            <q-input type="textarea" outlined label="Inserte" dense emit-value maxLengthInput="5000"
              v-model="devolverObservacion" :rules="[
                (v) => inputRequired(v),
                (v) => maxLengthInput(1000, v),
                (v) => minLengthInput(10, v),
              ]" />
          </div>
          <div class="tw-flex tw-justify-between tw-p-5 tw-gap-5">
            <q-btn label="Cancelar" style="
                width: 250px;
                height: 45px;
                border-radius: 8px;
                font-size: 18px;
              " text-color="white" color="secondary" class="tw-rounded-xl tw-p-3"
              @click="() => (currentTab = 'vistaInformacionGeneral')" />
            <q-btn label="Guardar" style="
                width: 250px;
                height: 45px;
                border-radius: 8px;
                font-size: 18px;
              " text-color="white" color="primary" class="tw-rounded-xl tw-p-3" @click="devolverAdministrador" />
          </div>
        </q-card>
      </q-dialog>
    </div>

    <Modal v-model="modalSegundaDevolucion" :is-success="false" @handleAccept="currentTab = 'vistaInformacionGeneral'"
      textButton="Aceptar" text="El documento ha cumplido dos devoluciones, gestionar publicación en Página WEB"
      type="button" />

    <Modal v-model="showModalExitoApro" :is-success="false" @handleAccept="goBack()" textButton="Aceptar"
           :text="`La respuesta proyectada tiene su visto bueno. Radicado de salida generado ${SAL}`" type="button" />


  </main>
</template>

<script lang="ts" setup>
import { Ref, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Modal from "components/Modal/Modal.vue";
import { toast } from "src/helpers/toast";
import {
  inputRequired,
  maxLengthInput,
  minLengthInput,
} from "src/helpers/validations";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { DocumentoRadicado } from "src/interfaces";
import Trazabilidad from "src/pages/Expedientes/Trazabilidad/Trazabilidad.vue";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import {
  IAsignacionDetalles,
  IRadicadoDetalles,
  IComunicacionesDetalles,
} from ".";
import ajuntarDocumento from "./AjuntarDocs/AjuntarDocumento.vue";
import Asignar from "./Asignar/Asignar.vue";
import Comentarios from "./Comentarios/Comentarios.vue";
import DatosSalida from "./DatosSalida/DatosSalida.vue";
import Enviar from "./Enviar/Enviar.vue";
import EnviarAprobacion from "./Enviar/EnviarAprobacion.vue";
import IncluirExpediente from "./IncluirExpediente/IncluirExpediente.vue";
import Gestion from "./Gestion/Gestion.vue";
import InformacionGeneral from "./InformacionGeneral/InformacionGeneral.vue";
import ReasignarGestor from "./Reasignar/ReasignarGestor.vue";
import Reclasificar from "./Reclasificar/Reclasificar.vue";
import ConfirmModal from "src/components/Modal/ConfirmModal.vue";
import RechazarModalCorrespondencia from "src/components/Modal/RechazarModalCorrespondencia.vue";
import FileLoader from "src/components/FormFields/FileLoader.vue";
import DatosGenerales from "src/pages/Correspondencia/Crear/views/DatosGenerales.vue";
import DatosSalidaComunicaciones from "src/pages/Correspondencia/Crear/views/DatosSalida.vue";
import EliminarComunicacion from "src/pages/Correspondencia/Crear/views/EliminarComunicacion.vue";
import AdjuntarDocsComunicaciones from "src/pages/Correspondencia/Crear/views/AdjuntarDocs.vue";
import IncluirExpedienteComunicaciones from "src/components/comunicacion/expediente/IncluirExpediente.vue";
import CambiarUserComunicaciones from "src/pages/Correspondencia/Crear/views/CambiarUser.vue";
import EnviarPorCorrespondencia from "src/components/Devolucion/EnviarCorrespondencia.vue";
import EnviarPorCorreo from "src/components/Devolucion/EnviarCorreo.vue";
import CerrarDevolucion from "src/components/Devolucion/CerrarDevolucion.vue";
import AnexosSalida from "src/components/Devolucion/AnexosSalida.vue";
import EnviarPublicacion from "src/components/Devolucion/EnviarPublicacion.vue";
import ArchivoEncriptado from "src/components/Devolucion/ArchivoEncriptado.vue";
import Publicar from "src/components/Devolucion/Publicar.vue";
import RechazarPublicacion from "src/components/Devolucion/RechazarPublicacion.vue";
import ArchivosDesfijacion from "src/components/Devolucion/ArchivosDesfijacion.vue";
import CierrePublicacion from "src/components/Devolucion/CierrePublicacion.vue";
import ReasignarOficina from "src/shared/components/ReasignarOficina/reasignacion.vue";
import Editor from "src/components/Editor/editor.vue";
import { useDocumentStore } from "src/stores/documentStore";
import DocumentosRelacionados from "./DocumentosRelacionados/DocumentosRelacionados.vue";
import { crearTrazabilidadDocumento } from "src/helpers/trazabilidadDocumento";
import TrazabilidadDocumento from "src/pages/Correspondencia/TrazabilidadDocumento/TrazabilidadDocumento.vue";
// @ts-ignore
import docImg from "src/assets/icon-lines.svg";
import { DocsBD } from "src/interfaces";
import Metadatos from "src/components/metadtos/DynamicFields/Metadatos.vue";
import EnviarAprobacionDev from "./Crear/CrearComunicaciones/EnviarAprobacionComunicacion.vue";
import ExitoModal from "src/components/Modal/ExitoModal.vue";

const changeGestionador = ref(false)
const changerevisor = ref(false)
const changeAprobador = ref(false)

const route = useRoute();
const router = useRouter();
const showRoute = ref(route.params.id);
const currentTab = ref("vistaInformacionGeneral");
const status = ref("");
const detalleRadicado: Ref<Partial<IRadicadoDetalles>> = ref({});
const detalleAsignaciones: Ref<Partial<IAsignacionDetalles>> = ref({});
const detalleComunicaciones: Ref<Partial<IComunicacionesDetalles>> = ref({});
const listDocs = ref([]);
const listDocs2 = ref([]);
const listDocs3 = ref([]);
const nameDocument = ref(null);
const trazabilidadData = ref<any[]>([]);
const incrementaKey = ref(0);
const iframePdfUrl = ref();
const visualizadorPDF = ref(false);
const userInfo = ref();
const { getUserInfo } = useAuthStore();
const auth = useAuthStore();
const manual = ref(true);
const SAL = ref();
const modalNuevoDoc = ref(true);

const loadingEnvios = ref(false);
const aprobado = ref(false);
const aprobadoDocSal = ref(false);
const radicadoSalida = ref("");
const documentStore = useDocumentStore();
const vistoBuenoModal = ref(true);
const succesVistoBueno = ref(false);
const openRMAprobador = ref(true);
const openConfirmationRechazoAprobador = ref(false);
const openRechazoAprobador = ref(false);
const openConfirmationAprobador = ref(false);
const cancelModalDoc = ref(false);
const dataSave = ref(null);
const docSalidaComp = ref();
let isRevisor = ref(false);
let isAprobador = ref(false);
let isGestionador = ref(false);
let isComunicaciones = ref(false);
let isDevolucion = ref(false);
const modalDocuments = ref(false);
const finished = ref(false);
const aprobarCasoModal = ref(false);
const modalRechazo = ref(false);
const observacionesRechazoAprobador = ref();
const firmaAprobador = ref(null);
let gestionador = ref("");
const oficinas = ref([]);
const filteredOficinas = ref([]);
const selectedOficinaAsignar = ref("");
const devolverAdminModal = ref(true);
const devolverObservacion = ref();
const isExpe = ref(false);
const visibleDoscRead = ref(false);
const tabsFiles = ref();
const listForVizualiser = ref();
const isNewDocCreated = ref(false);
const isPorPublicar = ref(false);
const isDesfijacion = ref(false);
const hardcoreData = ref({
  codigoProceso: "",
  idRadicado: "",
  nodeId: "",
  informacionProceso: {
    numeroDocumentoAfectado: "",
  },
  estadoProceso: "",
  tipoTramite: "",
});
const segundaDevolucion = ref(false);
const modalSegundaDevolucion = ref(false);
const detalles = ref();
const isMetadatos = ref(false);
const metadatos = ref([]);
const viewEditor = ref(false);
const htmlContent = ref("");
const documentoFile = ref("");
const imgBase64 = ref();
let referentKey = {};
const responseDocSalida = ref();
const isEditorDataReady = ref(false);
const dataFooter = ref({});
const isCertificado = ref();
const radicadoSalidaComunicacion = ref("");
const docEntrada = ref();
const changeTab = (tab) => {
  currentTab.value = tab;
};
const gestionadorCambio = ref(false);
const revisorCambio = ref(false);
const aprobadorCambio = ref(false);
const trazaDocument = ref();
const selectedSignature = ref();
const gettrazabilidadDocumento = async () => {
  if (responseDocSalida.value) {
    try {
      const response = await sgdeaAxios.get(
        `/api/documentos/ENC/${responseDocSalida.value.id}/historial`
      );
      trazaDocument.value = response.data;
    } catch {
      toast.error("Ha ocurrido un error al obtener la información");
    }
  }
};
const internalCom = ref();
const allNameTabs = {
  vistaInformacionGeneral: "vistaInformacionGeneral",
  verDatos: "verDatos",
  trazabilidad: "trazabilidad",
  comentarios: "comentarios",
  iniciarGestion: "iniciarGestion",
  asignar: "asignar",
  reasignar: "reasignar",
  reasignarGestor: "reasignarGestor",
  DocumentoEntrada: "DocumentoEntrada",
  expediente: "expediente",
  manual: "manual",
  cerrar: "cerrar",
  vistoBueno: "vistoBueno",
  rechazarRespuesta: "rechazarRespuesta",
  docSalida: "docSalida",
  docSalidaDevolucion: "docSalidaDevolucion",
  datosSalida: "datosSalida",
  soporteSalida: "soporteSalida",
  enviarRevision: "enviarRevision",
  enviarAprobacion: "enviarAprobacion",
  enviarAprobacionDev: "enviarAprobacionDev",
  reiniciar: "reiniciar",
  aprobDoc: "aprobDoc",
  rechazarDoc: "rechazarDoc",
  devolverAdmin: "devolverAdmin",
  datosGeneralesComunicaciones: "datosGeneralesComunicaciones",
  datosSalidaComunicaciones: "datosSalidaComunicaciones",
  adjuntarDocsComunicaciones: "adjuntarDocsComunicaciones",
  eliminarComunicacion: "eliminarComunicacion",
  incluirExpedienteComunicaciones: "incluirExpedienteComunicaciones",
  cambiarRevisorComunicaciones: "cambiarRevisorComunicaciones",
  cambiarAprobadorComunicaciones: "cambiarAprobadorComunicaciones",
  reclasificar: "reclasificar",
  enviarPorCorrespondencia: "enviarPorCorrespondencia",
  enviarPorCorreo: "enviarPorCorreo",
  nuevoDocSalida: "nuevoDocSalida",
  cerrarDevolucion: "cerrarDevolucion",
  anexosSalida: "anexosSalida",
  enviarPublicacion: "enviarPublicacion",
  archivoEncriptado: "archivoEncriptado",
  publicar: "Publicar",
  rechazarPublicacion: "rechazarPublicacion",
  archivosDesfijacion: "archivosDesfijacion",
  cierrePublicacion: "cierrePublicacion",
  metadatosDinamicos: "metadatosDinamicos",
  documentosRelacionados: "documentosRelacionados",
  trazabilidadDocumento: "trazabilidadDocumento",
};

const tabs = ref([]);

function goBack() {
  router.go(-1);
}

const getTabs = () => {
  if (isDevolucion.value && userInfo?.value?.role == "Asignador Responsable") {
    tabs.value = [
      {
        label: "Información General",
        name: allNameTabs.vistaInformacionGeneral,
        icon: "info",
      },
      {
        label: "Asignar",
        name: allNameTabs.asignar,
        icon: "move_up",
      },
      {
        label: "Reasignar",
        name: allNameTabs.reasignar,
        icon: "move_up",
      },
      {
        label: "Trazabilidad",
        name: allNameTabs.trazabilidad,
        icon: "history",
      },
      {
        label: "Documentos Relacionados",
        name: allNameTabs.documentosRelacionados,
        icon: "folder_open",
      },
    ];

    return tabs;
  }

  if (userInfo?.value?.role == "Asignador Responsable") {
    tabs.value = [
      {
        label: "Información General",
        name: allNameTabs.vistaInformacionGeneral,
        icon: "info",
      },
      {
        label: "Asignar",
        name: allNameTabs.asignar,
        icon: "move_up",
      },
      {
        label: "Reasignar",
        name: allNameTabs.reasignar,
        icon: "move_up",
      },
      // {
      //   label: "Ver c",
      //   name: allNameTabs.verDatos,
      //   icon: "description",
      // },
      {
        label: "Adjuntar Documento",
        name: allNameTabs.DocumentoEntrada,
        icon: "feed",
      },
      {
        label: "Trazabilidad",
        name: allNameTabs.trazabilidad,
        icon: "history",
      },
      {
        label: "Documentos Relacionados",
        name: allNameTabs.documentosRelacionados,
        icon: "folder_open",
      },
      {
        label: "Comentarios",
        name: allNameTabs.comentarios,
        icon: "forum",
      },
      {
        label: "Reclasificar Trámite",
        name: allNameTabs.reclasificar,
        icon: "handshake",
      },
    ];
    return tabs.value;
  }

  if (isPorPublicar.value && !isDesfijacion.value) {
    tabs.value = [
      {
        label: "Información General",
        name: allNameTabs.vistaInformacionGeneral,
        icon: "info",
      },
      {
        label: "Publicar",
        name: allNameTabs.publicar,
        icon: "open_in_browser",
      },
      {
        label: "Rechazar Publicación",
        name: allNameTabs.rechazarPublicacion,
        icon: "cancel",
      },
      {
        label: "Trazabilidad",
        name: allNameTabs.trazabilidad,
        icon: "history",
      },
      {
        label: "Documentos Relacionados",
        name: allNameTabs.documentosRelacionados,
        icon: "folder_open",
      },
    ];
    return tabs;
  }

  if (isDesfijacion.value) {
    tabs.value = [
      {
        label: "Adjuntar Documento",
        name: allNameTabs.archivosDesfijacion,
        icon: "post_add",
      },
      {
        label: "Cierre de Publicación",
        name: allNameTabs.cierrePublicacion,
        icon: "cancel",
      },
    ];
    return tabs.value;
  }

  watch(
    [documentoFile, dataFooter, referentKey, htmlContent],
    () => {
      isEditorDataReady.value =
        documentoFile.value !== "" &&
        Object.keys(dataFooter).length > 0 &&
        Object.keys(referentKey).length > 0 &&
        htmlContent.value !== undefined;
    },
    { immediate: true }
  );

  if (isDevolucion.value && !(userInfo.value.role == "Asignador Responsable")) {
    tabs.value = [
      {
        label: "Información General",
        name: allNameTabs.vistaInformacionGeneral,
        icon: "info",
      },
    ];

    if (
      !isNewDocCreated.value ||
      (isNewDocCreated.value && !segundaDevolucion.value)
    ) {
      tabs.value.push(
        {
          label: "Enviar por Correspondencia",
          name: allNameTabs.enviarPorCorrespondencia,
          icon: "send",
        },
        {
          label: "Enviar por Correo",
          name: allNameTabs.enviarPorCorreo,
          icon: "send",
        },
        {
          label: "Nuevo Documento de Salida",
          name: allNameTabs.nuevoDocSalida,
          icon: "post_add",
        }
      );
    }

    if (isNewDocCreated.value && !segundaDevolucion.value) {
      tabs.value.push(
        {
          label: "Enviar a Aprobación",
          name: allNameTabs.enviarAprobacionDev,
          icon: "send",
        },
        {
          label: "Adjuntar Anexos de Salida",
          name: allNameTabs.anexosSalida,
          icon: "folder_open",
        }
      );
    }

    if (isNewDocCreated.value && segundaDevolucion.value) {
      tabs.value.push(
        {
          label: "Enviar a Publicación",
          name: allNameTabs.enviarPublicacion,
          icon: "send",
        },
        {
          label: "Adjuntar Documento",
          name: allNameTabs.anexosSalida,
          icon: "feed",
        }
      );
    }
    if (detalleAsignaciones.value?.radicadoSalidaAprobar !== 'SAL20240000265599') {
      tabs.value.push({
        label: "Solicitud Cierre de Devolución",
        name: allNameTabs.cerrarDevolucion,
        icon: "cancel",
      });
    }


    tabs.value.push({
      label: "Trazabilidad",
      name: allNameTabs.trazabilidad,
      icon: "history",
    });

    tabs.value.push({
      label: "Documentos Relacionados",
      name: allNameTabs.documentosRelacionados,
      icon: "folder_open",
    });

    return tabs.value;
  }

  if (isComunicaciones.value && isAprobador.value) {
    tabs.value = [
      {
        label: "Información General",
        name: allNameTabs.vistaInformacionGeneral,
        icon: "info",
      },
      {
        label: "Datos Generales",
        name: allNameTabs.datosGeneralesComunicaciones,
        icon: "info",
      },
      {
        label: "Documento de Salida",
        name: allNameTabs.docSalida,
        icon: "post_add",
      },
      {
        label: "Documentos Relacionados",
        name: allNameTabs.documentosRelacionados,
        icon: "folder_open",
      },
      {
        label: "Trazabilidad",
        name: allNameTabs.trazabilidad,
        icon: "history",
      },
      {
        label: "Trazabilidad de Documento",
        name: allNameTabs.trazabilidadDocumento,
        icon: "description",
      },
    ];

    return tabs.value;
  }

  if (isRevisor.value && isComunicaciones.value) {
    tabs.value = [
      {
        label: "Información General",
        name: allNameTabs.vistaInformacionGeneral,
        icon: "info",
      },
      {
        label: "Documento de Salida",
        name: allNameTabs.docSalida,
        icon: "description",
      },
      {
        label: "Documentos Relacionados",
        name: allNameTabs.documentosRelacionados,
        icon: "folder_open",
      },
      {
        label: "Visto Bueno Respuesta",
        name: allNameTabs.vistoBueno,
        icon: "task_alt",
      },
      {
        label: "Rechazar Respuesta",
        name: allNameTabs.rechazarRespuesta,
        icon: "cancel",
      },
      {
        label: "Trazabilidad",
        name: allNameTabs.trazabilidad,
        icon: "history",
      },
      {
        label: "Trazabilidad de Documento",
        name: allNameTabs.trazabilidadDocumento,
        icon: "description",
      },

    ];

    return tabs.value;
  }

  if (isRevisor.value) {
    tabs.value = [
      {
        label: "Información General",
        name: allNameTabs.vistaInformacionGeneral,
        icon: "info",
      },
      {
        label: "Documento de Salida",
        name: allNameTabs.docSalida,
        icon: "description",
      },
      {
        label: "Visto Bueno Respuesta",
        name: allNameTabs.vistoBueno,
        icon: "task_alt",
      },
      {
        label: "Rechazar Respuesta",
        name: allNameTabs.rechazarRespuesta,
        icon: "cancel",
      },
      {
        label: "Trazabilidad",
        name: allNameTabs.trazabilidad,
        icon: "history",
      },
      {
        label: "Documentos Relacionados",
        name: allNameTabs.documentosRelacionados,
        icon: "folder_open",
      },
      {
        label: "Comentarios",
        name: allNameTabs.comentarios,
        icon: "forum",
      },
    ];

    // tabs.value.push(
    //   {
    //     label: "Trazabilidad de Documento",
    //     name: allNameTabs.trazabilidadDocumento,
    //     icon: "description",
    //   },
    // );

    if (isMetadatos.value) {
      tabs.value.push({
        label: "Metadatos",
        name: allNameTabs.metadatosDinamicos,
        icon: "folder_open",
      });
    }

    return tabs.value;
  }

  if (isAprobador.value) {
    tabs.value = [
      {
        label: "Información General",
        name: allNameTabs.vistaInformacionGeneral,
        icon: "info",
      },
      {
        label: "Documento de Salida",
        name: allNameTabs.docSalida,
        icon: "description",
      },
      {
        label: "Trazabilidad",
        name: allNameTabs.trazabilidad,
        icon: "history",
      },
      {
        label: "Documentos Relacionados",
        name: allNameTabs.documentosRelacionados,
        icon: "folder_open",
      },
      {
        label: "Comentarios",
        name: allNameTabs.comentarios,
        icon: "forum",
      },
    ];

    tabs.value.push(
      {
        label: "Trazabilidad de Documento",
        name: allNameTabs.trazabilidadDocumento,
        icon: "description",
      },
    );

    if (isMetadatos.value) {
      tabs.value.push({
        label: "Metadatos",
        name: allNameTabs.metadatosDinamicos,
        icon: "folder_open",
      });
    }

    return tabs.value;
  }

  if (status.value === "Aprobado" &&
    userInfo.value.role === "Gestionador" &&
    detalleComunicaciones.value?.estado?.id !== 4 &&
    datosSalida.value?.destinatario) {
    tabs.value = [
      {
        label: "Información General",
        name: allNameTabs.vistaInformacionGeneral,
        icon: "info",
      },
      {
        label: "Documentos Relacionados",
        name: allNameTabs.documentosRelacionados,
        icon: "folder_open",
      },
      {
        label: "Trazabilidad",
        name: allNameTabs.trazabilidad,
        icon: "history",
      },
    ];
    // tabs.value.push(
    //   {
    //     label: "Trazabilidad de Documento",
    //     name: allNameTabs.trazabilidadDocumento,
    //     icon: "description",
    //   },
    // );

    return tabs.value;
  }

  tabs.value = [
    {
      label: "Información General",
      name: allNameTabs.vistaInformacionGeneral,
      icon: "info",
    },
  ];

  // ! Iniciar Gestion

  if (
    findRoles([0, 3, 5, 6]) &&
    !detalleAsignaciones.value?.isManual &&
    !detalleAsignaciones.value?.iniciada &&
    detalleComunicaciones.value?.estado?.id !== 4
  ) {
    tabs.value.push({
      label: "Iniciar Gestión",
      name: allNameTabs.iniciarGestion,
      icon: "play_arrow",
    });
  }

  if (
    findRoles([0, 3, 5, 6]) &&
    !detalleAsignaciones.value?.isManual &&
    status.value === "Para gestión" &&
    !detalleAsignaciones.value?.iniciada
  ) {
    tabs.value.push({
      label: "Reasignar gestión",
      name: allNameTabs.reasignarGestor,
      icon: "move_up",
    });
  }

  if (
    findRoles([0, 3, 5, 6]) &&
    !detalleAsignaciones.value?.isManual &&
    !detalleAsignaciones.value?.iniciada &&
    detalleComunicaciones.value?.estado?.id !== 4
  ) {
    tabs.value.push({
      label: "Adjuntar Documento al trámite de entrada",
      name: allNameTabs.DocumentoEntrada,
      icon: "folder_open",
    });
  }

  if (
    findRoles([0, 3, 5, 6]) &&
    !detalleAsignaciones.value?.isManual &&
    status.value === "Para gestión" &&
    !detalleAsignaciones.value?.iniciada
  ) {
    tabs.value.push({
      label: "Incluir Expediente",
      name: allNameTabs.expediente,
      icon: "adf_scanner",
    });
  }

  if (
    findRoles([3, 5, 6]) &&
    !detalleAsignaciones.value?.isManual &&
    !detalleAsignaciones.value?.iniciada
  ) {
    if (detalleComunicaciones.value?.estado?.id !== 4) {
      tabs.value.push({
        label: "Comentarios",
        name: allNameTabs.comentarios,
        icon: "forum",
      });
    }

    if (isComunicaciones.value) {
      tabs.value.push({
        label: "Trazabilidad de Documento",
        name: allNameTabs.trazabilidadDocumento,
        icon: "description",
      },)
    }

    tabs.value.push({
      label: "Documentos Relacionados",
      name: allNameTabs.documentosRelacionados,
      icon: "folder_open",
    });

    tabs.value.push({
      label: "Trazabilidad",
      name: allNameTabs.trazabilidad,
      icon: "history",
    });
  }

  if (
    findRoles([0, 3, 5, 6]) &&
    !detalleAsignaciones.value?.iniciada &&
    !detalleAsignaciones.value?.isManual &&
    detalleComunicaciones.value?.estado?.id !== 4
  ) {
    tabs.value.push({
      label: "Gestión Manual",
      name: allNameTabs.manual,
      icon: "engineering",
    });
  }

  if (
    findRoles([0, 3, 5, 6]) &&
    !detalleAsignaciones.value?.isManual &&
    !detalleAsignaciones.value?.iniciada &&
    detalleComunicaciones.value?.estado?.id !== 4

  ) {
    tabs.value.push({
      label: "Cerrar gestión",
      name: allNameTabs.cerrar,
      icon: "do_not_disturb_on",
    });
  }

  // ! Gestion Iniciada
  if (findRoles([0, 3, 5, 6]) && detalleAsignaciones.value?.iniciada) {
      tabs.value.push({
      label: "Datos de Salida",
      name: allNameTabs.datosSalida,
      icon: "error_outline",
    });

    tabs.value.push({
      label: "Documento de salida",
      name: allNameTabs.docSalida,
      icon: "description",
    });

    tabs.value.push({
      label: "Adjuntar Documento al trámite de entrada",
      name: allNameTabs.DocumentoEntrada,
      icon: "folder_open",
    });
  }

  if (findRoles([0, 3, 5, 6]) && detalleAsignaciones.value?.iniciada) {
    if (detalleAsignaciones.value.radicacion.estadoProceso.id == 3) {
      tabs.value.push({
        label: "Adjuntar documentos soporte de salida",
        name: allNameTabs.soporteSalida,
        icon: "drive_file_move",
      });
    }
  }

        if (
    findRoles([0, 3, 5, 6]) &&
    detalleAsignaciones.value?.iniciada &&
    status.value === "Para gestión"
  ) {
    tabs.value.push({
      label: "Incluir Expediente",
      name: allNameTabs.expediente,
      icon: "adf_scanner",
    });

    tabs.value.push({
      label: "Documentos Relacionados",
      name: allNameTabs.documentosRelacionados,
      icon: "folder_open",
    });
  }

  if (
    (findRoles([0, 3, 5, 6]) &&
      !detalleAsignaciones.value?.isManual &&
      status.value !== "Revisado" &&
      detalleAsignaciones.value?.iniciada) ||
    findRoles([0])
  ) {
    tabs.value.push({
      label: "Enviar a Revisión",
      name: allNameTabs.enviarRevision,
      icon: "rate_review",
    });

    tabs.value.push({
      label: "Enviar a Aprobación",
      name: allNameTabs.enviarAprobacion,
      icon: "send",
    });
    // tabs.value.push(
    //   {
    //     label: "Trazabilidad de Documento",
    //     name: allNameTabs.trazabilidadDocumento,
    //     icon: "description",
    //   },
    // );
  }

  if (
    findRoles([0, 3, 5, 6]) &&
    !detalleAsignaciones.value?.isManual &&
    status.value === "Revisado"
  ) {
    // tabs.value.push({
    //   label: "Enviar a Aprobación",
    //   name: allNameTabs.enviarAprobacion,
    //   icon: "send",
    // });
  }

  if (
    (findRoles([0, 3, 5, 6]) &&
      detalleAsignaciones.value?.iniciada &&
      status.value === "Revisión rechazada") ||
    status.value === "Aprobación rechazada"
  ) {
    tabs.value.push({
      label: "Trazabilidad",
      name: allNameTabs.trazabilidad,
      icon: "history",
    });

    tabs.value.push({
      label: "Documentos Relacionados",
      name: allNameTabs.documentosRelacionados,
      icon: "folder_open",
    });

    tabs.value.push({
      label: "Comentarios",
      name: allNameTabs.comentarios,
      icon: "forum",
    });
  }

  if (
    findRoles([0, 3, 5, 6]) &&
    detalleAsignaciones.value?.iniciada &&
    status.value === "Para gestión"
  ) {
    // tabs.value.push({
    //   label: "Ver Datos",
    //   name: allNameTabs.verDatos,
    //   icon: "description",
    // });

    tabs.value.push({
      label: "Trazabilidad",
      name: allNameTabs.trazabilidad,
      icon: "history",
    });

    tabs.value.push({
      label: "Comentarios",
      name: allNameTabs.comentarios,
      icon: "forum",
    });

    tabs.value.push({
      label: "Reiniciar Gestión",
      name: allNameTabs.reiniciar,
      icon: "move_down",
    });
    // tabs.value.push(
    //   {
    //     label: "Trazabilidad de Documento",
    //     name: allNameTabs.trazabilidadDocumento,
    //     icon: "description",
    //   },
    // );

  }

  if (findRoles([0, 1])) {
    // tabs.value.push({
    //   label: "Asignar",
    //   name: allNameTabs.asignar,
    //   icon: "move_up",
    // });
    tabs.value.push({
      label: "Devolver",
      name: allNameTabs.devolverAdmin,
      icon: "shuffle",
    });
    tabs.value.push({
      label: "Reclasificar Trámite",
      name: allNameTabs.reclasificar,
      icon: "handshake",
    });
    tabs.value.push({
      label: "Ver Datos",
      name: allNameTabs.verDatos,
      icon: "description",
    });
    tabs.value.push({
      label: "Trazabilidad",
      name: allNameTabs.trazabilidad,
      icon: "history",
    });
    tabs.value.push({
      label: "Comentarios",
      name: allNameTabs.comentarios,
      icon: "forum",
    });
  }

  if (
    findRoles([0, 3, 5, 6, 7]) &&
    !detalleAsignaciones.value?.isManual &&
    status.value === "Por asignar"
  ) {
    tabs.value.push({
      label: "Reasignar",
      name: allNameTabs.reasignar,
      icon: "move_up",
    });
  }

  if (findRoles([0, 3, 5, 6, 7]) && detalleAsignaciones.value?.isManual) {
    // tabs.value.push({
    //   label: "Confirmar datos de salida",
    //   name: allNameTabs.enviarAprobacion,
    //   icon: "account_tree",
    // });

    tabs.value.push({
      label: "Trazabilidad",
      name: allNameTabs.trazabilidad,
      icon: "history",
    });
    tabs.value.push({
      label: "Enviar a Aprobación",
      name: allNameTabs.enviarAprobacionDev,
      icon: "send",
    });
    tabs.value.push({
      label: "Datos de Salida",
      name: allNameTabs.datosSalida,
      icon: "error_outline",
    });
    // tabs.value.push({
    //   label: "Ver Datos",
    //   name: allNameTabs.verDatos,
    //   icon: "description",
    // });

    tabs.value.push({
      label: "Reiniciar Gestión",
      name: allNameTabs.reiniciar,
      icon: "move_down",
    });
  }

  // if (!detalleAsignaciones.value?.isManual) {
  //   tabs.value.push({
  //     label: "Adjuntar Documento",
  //     name: allNameTabs.DocumentoEntrada,
  //     icon: "folder_open",
  //   });
  // }

  if (
    findRoles([0, 5, 6]) &&
    (detalleAsignaciones.value?.iniciada || findRoles([0])) &&
    status.value == "Por revisar"
  ) {
    tabs.value.push({
      label: "Visto bueno respuesta",
      name: allNameTabs.vistoBueno,
      icon: "task_alt",
    });
  }

  if (
    findRoles([0, 5, 6]) &&
    (detalleAsignaciones.value?.iniciada || findRoles([0])) &&
    status.value == "Por revisar"
  ) {
    tabs.value.push({
      label: "Rechazar respuesta",
      name: allNameTabs.rechazarRespuesta,
      icon: "cancel",
    });
  }

  if (
    detalleComunicaciones.value.estado.id == 16) {
    tabs.value = [
      {
        label: "Información General",
        name: allNameTabs.vistaInformacionGeneral,
        icon: "info",
      },
      {
        label: "Documento de Salida",
        name: allNameTabs.docSalida,
        icon: "post_add",
      },
      {
        label: "Datos de Salida",
        name: allNameTabs.datosSalida,
        icon: "error_outline",
      },
      {
        label: "Adjuntar Documento",
        name: allNameTabs.DocumentoEntrada,
        icon: "feed",
      },
      {
        label: "Eliminar Comunicación",
        name: allNameTabs.eliminarComunicacion,
        icon: "delete",
      },
      {
        label: "Incluir Expediente",
        name: allNameTabs.expediente,
        icon: "adf_scanner",
      },
      {
        label: "Enviar a Revisión",
        name: allNameTabs.enviarRevision,
        icon: "rate_review",
      },
      {
        label: "Enviar a Aprobación",
        name: allNameTabs.enviarAprobacionDev,
        icon: "send",
      },
      {
        label: "Trazabilidad",
        name: allNameTabs.trazabilidad,
        icon: "history",
      },
    ]
  }
  if (
    detalleRadicado.value &&
    (detalleRadicado.value.estadoProceso?.id == 1 ||
      detalleRadicado.value.estadoProceso?.id == 16) &&
    detalleRadicado.value.es_mesaback == true
  ) {
    tabs.value = [
      {
        label: "Información General",
        name: allNameTabs.vistaInformacionGeneral,
        icon: "info",
      },
      // {
      //   label: "Ver Datos",
      //   name: allNameTabs.verDatos,
      //   icon: "description",
      // },
      // {
      //   label: "Asignar Oficina",
      //   name: allNameTabs.asignarOficina,
      //   icon: "desk",
      // },
      {
        label: "Asignar Oficina",
        name: allNameTabs.reclasificar,
        icon: "desk",
      },
    ];

    if (userInfo?.value?.role == "Asignador Oficina") {
      tabs.value.push({
        label: "Devolver",
        name: allNameTabs.devolverAdmin,
        icon: "shuffle",
      });
    }

    tabs.value.push({
      label: "Trazabilidad",
      name: allNameTabs.trazabilidad,
      icon: "history",
    });

    tabs.value.push({
      label: "Documentos Relacionados",
      name: allNameTabs.documentosRelacionados,
      icon: "folder_open",
    });

    tabs.value.push({
      label: "Comentarios",
      name: allNameTabs.comentarios,
      icon: "forum",
    });
  }
  if (isMetadatos.value) {
    tabs.value.push({
      label: "Metadatos",
      name: allNameTabs.metadatosDinamicos,
      icon: "folder_open",
    });
  }

  return tabs;
};

const handleUpdate = () => {
  incrementaKey.value++;
};

const closeModal = () => {
  manual.value = false;
  currentTab.value = "vistaInformacionGeneral";
};

// function removeButton(name) {
//   const filteredTabs = tabs.value.filter((item) => item.name !== name);
//   tabs.value = filteredTabs;
// }

onMounted(async () => {
  await userCertificado();
  await getOficinas();
  await getData();
  await getDocSalida();
  getTabs();
  // if (
  //   detalleRadicado.value.tipoTramite?.nombre == "Correspondencia" &&
  //   userInfo.value.role == "Asignador Responsable"
  // ) {
  //   removeButton(allNameTabs.asignar);
  //   removeButton(allNameTabs.reasignar);
  // }
});

const getData = async () => {
  userInfo.value = await getUserInfo();

  setRoleFlags(userInfo.value.role);

  if (isInternalCommunication(route.params.id) && route.query.isComunicacion) {
    await handleInternalCommunication();
    await getDocs(
      `/correspondencia/comunicacion/documentos/SALIDA/${detalleComunicaciones.value.id}`
    );
    await getDocs2();
    return;
  }

  if (isAdminOrAsignador(userInfo.value.role)) {
    await handleAdminOrAsignador();
  } else {
    await handleOtherRoles();
  }

  await getDimanicDatos();

  const tipoTramite = detalleRadicado.value.tipoTramite.nombre;
  if (tipoTramite === "Informativos" || tipoTramite === "Retiro de empresa") {
    await getDimanicDatos();
  }

  await dataExpediente();

  if (detalleRadicado.value.id) {
    await getDocs(
      `/correspondencia/radicacion/documentos/SALIDA/${detalleRadicado.value.id}`
    );
    await getDocs2();
  }

  // @ts-ignore
  status.value = detalleRadicado.value?.estadoProceso?.estado;

  isDevolucion.value =
    status.value === "Devolucion" || status.value === "Devolucion Pendiente";
  if (
    status.value == "Por Publicar" ||
    status.value == "Publicado" ||
    status.value == "Publicacion rechazada" ||
    status.value == "Publicacion cerrada"
  ) {
    isPorPublicar.value = true;
  }

  if (detalleRadicado.value.datosSalida) {
    cargarDatosSalida();
  }
};

const getFirma = async (idAprobador, idFirma) => {
  try {
    const response = await sgdeaAxios.get(
      `/usuarios/obtener-firma/${idAprobador || 0}`
    );
    const { data } = response;
    if (data && data.length > 0 && idFirma) {
      selectedSignature.value = data.find(
        (firma) => firma.id === idFirma
      );
    }
  } catch (error) {
    toast.error("Hubo un error al cargar la firma del aprobador")
  }
};

const idDocumentoSalida = ref();
const idDocumento = ref();
async function getDocSalida() {
  if (!isComunicaciones.value) {
    if (userInfo.value.role !== "Asignador Responsable") {
      try {
        const response = await sgdeaAxios.get(
          `/correspondencia/BuscarDocumentoSalida?correspondenciaId=${isComunicaciones.value
            ? detalleComunicaciones.value.id
            : detalleRadicado.value.id
          }`
        );

        htmlContent.value = response.data?.html_content;
        responseDocSalida.value = response.data
        idDocumentoSalida.value = response.data?.id;
      } catch (error) {
        console.error(error);
      }
      viewEditor.value = true;
      await gettrazabilidadDocumento();
    }
  } else {
    try {
      const response = await sgdeaAxios.get(
        `/correspondencia/comunicacion/BuscarDocumentoSalida?comunicacionId=${detalleComunicaciones.value.id}`, { showLoader: false }
      );
      htmlContent.value = response.data?.html_content;
      idDocumento.value = response.data?.id;
      viewEditor.value = true;
    } catch (error) {
      console.error(error);
    }
  }
}

async function getDimanicDatos() {
  const rolUserId = userInfo.value.relations.find(
    (it) => it.rol === userInfo.value.role
  );

  const { data: getDimanicDatos } = await sgdeaAxios.get(
    `/parametrizacion-formulario/ListadoParametrizacion?id_flujo=${detalleRadicado.value.tipoTramite.nombre === "Informativos" ? "11" : "12"
    }&id_rol=${rolUserId.idRol}&id_oficina=${userInfo.value.oficina ? userInfo.value.oficina : ""
    }&id_estado_proceso=${detalleRadicado.value.estadoProceso.id}`
  );

  if (getDimanicDatos.content.length > 0) {
    isMetadatos.value = true;
    metadatos.value = await getDimanicDatos.content;
  } else {
    isMetadatos.value = false;
  }
}

const userCertificado = async () => {
  const response = await sgdeaAxios.get(`/usuarios/${auth.$state.userInfo.userid}`);
  isCertificado.value = response.data.isCertificado;
}

const dataExpediente = async () => {
  let codigo = null;

  try {
    const response = await sgdeaAxios.get(
      `/correspondencia/buscarCaseIDVentanillaXRadicado/${detalleRadicado.value.idRadicado}`
    );
    codigo = response.data;
  } catch (error) {
    console.error(error);
  }

  hardcoreData.value = {
    codigoProceso: codigo ? codigo.casoBonitaId : "NA", // Valor por defecto si no hay código
    idRadicado: detalleRadicado.value.idRadicado,
    nodeId: detalleRadicado.value.nodeId,
    estadoProceso: detalleRadicado.value.estadoProceso,
    tipoTramite: detalleRadicado.value.tipoTramite,
    informacionProceso: {
      numeroDocumentoAfectado:
        detalleRadicado.value.afectado.numeroDocumento === ""
          ? "NA"
          : detalleRadicado.value.afectado.numeroDocumento,
    },
  };
};


const isInternalCommunication = (id) => id.includes("INT") || id.includes("ENT") || id.includes("PRDSAL");
const internalCopyComunication = ref();
const externalCopyComunication = ref();
const copias = ref({
  internal: [],
  external: [],
})
const arrayCopyInternaComunication = ref();
const arrayCopyExternaComunication = ref();
const arrayAllCopysComunication = ref();
const getRevisorComunication = ref();
const getAprobadorComunicaciones = ref();
const tipoDeComunicacion = ref();

const getRevisorCom = async () => {
  try {
    const response = await sgdeaAxios.get(
      `/correspondencia/obtenerRevisor/${detalleComunicaciones.value.id}`
    );
    if (response.status === 200 && response.data?.usuario) {
      getRevisorComunication.value = response.data?.usuario;
    }
  } catch (error) {
    console.error(error);
  }
};

const getAprobador = async () => {
  try {
    const response = await sgdeaAxios.get(
      `/correspondencia/obtenerAprobador/${detalleComunicaciones.value.id}`)
    if (response.status === 200 && response.data?.usuario) {
      getAprobadorComunicaciones.value = response.data?.usuario;
    }
  }
  catch (error) {
    console.error(error);
  }
}

const handleInternalCommunication = async () => {
  let infoRevisor;
  let infoAprobador;

  detalleComunicaciones.value = (
    await sgdeaAxios.get(
      `/correspondencia/obtenerCorrespondenciaComunicacion/${route.params.id}`
    )
  ).data;

  radicadoSalidaComunicacion.value = detalleComunicaciones.value.radicadoSalida;

  tipoDeComunicacion.value = detalleComunicaciones.value.tipoComunicacion.id;

  hardcoreData.value.nodeId = detalleComunicaciones.value.nodeId;
  status.value = detalleComunicaciones.value?.estado.nombre;
  isDevolucion.value =
    status.value === "Devolucion" || status.value === "Devolucion Pendiente";
  isComunicaciones.value = true;

  const getPlantilla = await getPlantillaSinPrefijo();
  documentoFile.value = getPlantilla.base64x;

  await getRevisorCom();
  if (getRevisorComunication.value) {
    infoRevisor = `${getRevisorComunication.value.fullname.toUpperCase()} - ${getRevisorComunication.value.cargo.nombre ?? ""
      } - ${getRevisorComunication.value?.usuarioRelaciones[0]?.oficina?.dependencia?.nombre ?? ""
      }`;
  }

  await getAprobador();
  if (getAprobadorComunicaciones.value) {
    infoAprobador = `${getAprobadorComunicaciones.value.fullname.toUpperCase()} - ${getAprobadorComunicaciones.value.cargo.nombre ?? ""
      } - ${getAprobadorComunicaciones.value?.usuarioRelaciones[0]?.oficina?.dependencia?.nombre ?? ""
      }`;
    await getFirma(getAprobadorComunicaciones.value.id, getAprobadorComunicaciones.value?.firmaPredeterminadaId);
    aprobadoDocSal.value = status.value === "Aprobado";
  }

  referentKey = {
    asunto: detalleComunicaciones.value?.datosGenerales?.asunto ?? "",
    NombredeDestinatario: detalleComunicaciones.value.datosSalida.nombreDestinatario ?? "",
    NumeroDocDestinatario: detalleComunicaciones.value.datosSalida.numeroDocumentoDestinatario ?? "",
    DireccionDeDestinatario: detalleComunicaciones.value.datosSalida.direccionDestinatario ?? "",
    TelefonoDeDestinatario: detalleComunicaciones.value.datosSalida.direccionDestinatario ?? "",
    DepartamentoYMunicipioDestinatario: "",
    CorrreoDestinatario: "",
    NombreAfectado: detalleComunicaciones.value?.datosGenerales?.nombreAfectado ?? "",

    TIpoDeDocumentoAfectado: "",
    NumerodedocumentoAfectado: "", //"detalleComunicaciones.value?.datosGenerales.numeroDocumentoAfectado",
    Firma: selectedSignature?.value
      ? selectedSignature?.value?.tipoFirmaUsuario?.nombre === 'Grafo'
        ? selectedSignature?.value?.fileData : selectedSignature?.value?.fileName
      : "",
    NombreAprobador: getAprobadorComunicaciones?.value
      ? getAprobadorComunicaciones.value?.fullname?.toUpperCase().trim() ?? "" : "",
    CargoAprobador: getAprobadorComunicaciones?.value
      ? getAprobadorComunicaciones.value?.cargo?.nombre ?? "" : "",
    DependenciaAprobador: getAprobadorComunicaciones?.value?.usuarioRelaciones
      && getAprobadorComunicaciones?.value.usuarioRelaciones.length > 0
      ? getAprobadorComunicaciones?.value.usuarioRelaciones[0]?.oficina?.dependencia?.nombre ?? "" : "",
  };

  internalCom.value = {
    nombreElaboro: detalleComunicaciones.value?.usuarioCreador.fullname
      ? detalleComunicaciones.value?.usuarioCreador?.firstname?.toUpperCase().trim()
      + ` ${detalleComunicaciones.value?.usuarioCreador?.lastname?.toUpperCase().trim() ?? ""}` : "",
    oficinaElaboro: detalleComunicaciones.value?.usuarioCreador?.usuarioRelaciones
      && detalleComunicaciones.value?.usuarioCreador?.usuarioRelaciones.length > 0
      ? detalleComunicaciones.value?.usuarioCreador?.usuarioRelaciones[0]?.oficina?.nombre ?? "" : "",
    nombreDestinatario: detalleComunicaciones.value.datosSalida.nombreDestinatario ?? "",
    oficinaDestinatario: detalleComunicaciones.value.datosSalida.nombreDestinatario ?? "",
    asunto: detalleComunicaciones.value?.datosGenerales?.asunto ?? "",
    radicado: detalleComunicaciones.value?.idRadicado ?? "",
  }


  const usuarioElaboro = `${detalleComunicaciones.value?.usuarioCreador.fullname.toUpperCase()} - ${detalleComunicaciones.value?.usuarioCreador.cargo?.nombre
    } - ${detalleComunicaciones.value?.usuarioCreador.usuarioRelaciones[0].oficina
      ?.dependencia.nombre
    } `;
  internalCopyComunication.value = (
    await sgdeaAxios.get(
      `/correspondencia/comunicacion/copiaInterna/${detalleComunicaciones.value.datosSalida?.id}`
    )
  ).data;
  externalCopyComunication.value = (
    await sgdeaAxios.get(
      `/correspondencia/comunicacion/copiaExterna/${detalleComunicaciones.value.datosSalida?.id}`
    )
  ).data;

  if (
    internalCopyComunication.value.length > 0 ||
    externalCopyComunication.value.length > 0
  ) {
    arrayCopyExternaComunication.value = externalCopyComunication.value.map(
      (item) => formatCopyExterna(item)
    );
    arrayCopyInternaComunication.value = internalCopyComunication.value.map(
      (item) => formatCopyInterna(item)
    );
    arrayAllCopysComunication.value = arrayCopyInternaComunication.value.concat(
      arrayCopyExternaComunication.value
    );
    copias.value.internal = internalCopyComunication.value && internalCopyComunication.value.length > 0
      ? internalCopyComunication.value
      : [];
    copias.value.external = externalCopyComunication.value && externalCopyComunication.value.length > 0
      ? externalCopyComunication.value
      : [];
  } else {
    arrayCopyExternaComunication.value = [];
    arrayCopyInternaComunication.value = [];
    arrayAllCopysComunication.value = 0;
  }

  dataFooter.value = {
    Anexo: detalleComunicaciones.value?.datosGenerales?.numeroAnexos ?? "",
    Copia: arrayAllCopysComunication?.value || "",
    //asunto: detalleComunicaciones.value?.datosGenerales?.asuntoCorreo ?? "",
    DatosGestionador: usuarioElaboro ?? "",
    DatosAprobador: infoAprobador ?? "",
    DatosRevisor: infoRevisor ?? "",
    FormadeEnvio: detalleComunicaciones.value?.datosSalida?.formaEnvio?.nombre ?? "",
    //formaEnvio: "",
    //cargoAprobador: "",
    //dependenciaAprobador: "",
  };

  if (detalleComunicaciones.value.fechaPublicacion) {
    const givenDateString = detalleComunicaciones.value.fechaPublicacion;
    const givenDate = new Date(givenDateString);
    const currentDate = new Date();
    const millisecondsDiff = currentDate.getTime() - givenDate.getTime();
    const daysDiff = millisecondsDiff / (1000 * 60 * 60 * 24);
    if (daysDiff >= 6) {
      currentTab.value = allNameTabs.archivosDesfijacion;
      isDesfijacion.value = true;
    }
  }

  if (isDevolucion.value) {
    detalles.value = detalleComunicaciones.value;
    validacionesDevolucion();
  }
};

const isAdminOrAsignador = (role) => {
  return (
    role.toLowerCase().includes("administrador") ||
    role.toLowerCase() === "asignador responsable" ||
    role.toLowerCase() === "asignador oficina"
  );
};

const nuevoDocumento = async () => {
  await reiniciarGestionNuevoDoc();
  modalNuevoDoc.value = false;

}

const reiniciarGestionNuevoDoc = async () => {
  try {
    const response = await sgdeaAxios.post(`/correspondencia/devolucion/reiniciargestiondevolucion?idAsignacion=${detalleAsignaciones.value.id}&userId=${auth.$state.userInfo.userid}`)

    if (response.status === 200 || response.status === 201) {
      toast.success("Se ha reiniciado la gestión correctamente");
    }
  } catch (error) {

  }
}

const handleAdminOrAsignador = async () => {
  detalleRadicado.value = (
    await sgdeaAxios.get(`/correspondencia/radicacion/${route.params.id}`)
  )?.data;

  if (detalleRadicado.value?.estadoProceso?.estado === "Devolucion") {
    detalles.value = detalleRadicado.value;
    validacionesDevolucion();
  }
};

const handleOtherRoles = async () => {
  const { data } = await sgdeaAxios.get(
    `/correspondencia/radicacion/asignaciones/${route.params.id}`
  );


  detalleAsignaciones.value = data[data.length - 1];
  detalleRadicado.value = data[data.length - 1]?.radicacion;
  detalleRadicado.value.radicadoSalida =
    detalleAsignaciones.value?.radicadoSalidaAprobar;
  gestionador.value = String(
    detalleAsignaciones.value?.usuario?.firstname +
    " " +
    detalleAsignaciones.value?.usuario?.lastname
  );

  dataDoc.value.asignacionCOREntity.revisor = {
    fullname: detalleRadicado.value?.revision?.revisor?.firstname
      ? detalleRadicado.value?.revision?.revisor?.firstname +
      " " +
      detalleRadicado.value?.revision?.revisor?.lastname
      : "Nombre Apellido",
    oficina:
      detalleRadicado.value?.revision?.revisor?.usuarioRelaciones[0].oficina
        .nombre || "Oficina",
  };
  radicadoSalida.value = detalleAsignaciones.value?.radicadoSalidaAprobar;
  if (
    detalleRadicado.value?.estadoProceso?.estado === "Devolucion" ||
    detalleRadicado.value?.estadoProceso?.estado === "Devolucion Pendiente"
  ) {
    isDevolucion.value = true;
    detalleRadicado.value.isCierreDevolucion = true;
    detalles.value = detalleRadicado.value;
    validacionesDevolucion();
  }
  if (detalleRadicado.value?.estadoProceso?.estado === "Publicado") {
    isDesfijacion.value = true;
    currentTab.value = "archivosDesfijacion";
  }
  const getPlantilla = await getPlantillaSinPrefijo();
  mapDataToEditor(data[0], data[0].radicacion?.datosSalida, getPlantilla);
};
const arrayCopyInterna = ref();
const arrayCopyExterna = ref();
const arrayAllCopys = ref();
let trazabilidadRegistrada = false;

function formatCopyInterna(data) {
  return `${data?.correspondenciaFuncionario?.fullname?.toUpperCase().trim()}${data?.correspondenciaFuncionario?.email
    ? ' / ' + data?.correspondenciaFuncionario?.email.trim() : ''}`;
}

function formatCopyExterna(data) {
  if ([1, 2].includes(data?.formaEnvio?.id)) {
    return `${data?.nombreDestinatario?.toUpperCase().trim()}${data?.correoElectronico
      ? ' / ' + data?.correoElectronico.trim() : ''}`;
  }
  return `${data.nombreDestinatario.toUpperCase().trim()}${data?.direccionDestinatario
    ? ' / Dirección: ' + data?.direccionDestinatario.trim() : ''}${data?.departamentoDestinatario?.nombre
      ? ' / Departamento: ' + data?.departamentoDestinatario?.nombre.trim() : ''}${data?.municipioDestinatario?.nombre
        ? ' / Municipio: ' + data?.municipioDestinatario?.nombre.trim() : ''}${data.telefonoDestinatario
          ? ' / Teléfono: ' + data?.telefonoDestinatario.trim() : ''}`
}

async function mapDataToEditor(allData, datosSalida, getPlantilla) {
  documentStore.clearDocumentContent();
  documentoFile.value = getPlantilla.base64x;
  const aprobador = allData.aprobador;
  // Validar si se agrega la firma del aprobador
  if (aprobador && aprobador.firmaPredeterminadaId && datosSalida) {
    await getFirma(aprobador.id, aprobador?.firmaPredeterminadaId);
    aprobadoDocSal.value = status.value === "Aprobado"
  }

  referentKey = {
    asunto: datosSalida?.asunto || "",
    NombredeDestinatario: datosSalida?.nombreDestinatario || "",
    NumeroDocDestinatario: datosSalida?.numeroDocumentoDestinatario || "",
    DireccionDeDestinatario: datosSalida?.direccionDestinatario || "",
    TelefonoDeDestinatario: datosSalida?.telefonoDestinatario || "",
    DepartamentoYMunicipioDestinatario:
      datosSalida?.departamento && datosSalida?.municipio
        ? `${datosSalida?.departamento?.nombre} - ${datosSalida?.municipio?.nombre}`
        : "",
    CorrreoDestinatario: datosSalida?.correoDestinatario,
    NombreAfectado: datosSalida?.nombreAfectado,
    TIpoDeDocumentoAfectado: datosSalida?.tipoDocumentoAfectado
      ? datosSalida.tipoDocumentoAfectado?.nombre
      : "",
    NumerodedocumentoAfectado: datosSalida?.numeroDocumentoAfectado,
    Firma: selectedSignature?.value
      ? selectedSignature?.value?.tipoFirmaUsuario?.nombre === 'Grafo'
        ? selectedSignature?.value?.fileData : selectedSignature?.value?.fileName
      : "",
    NombreAprobador: aprobador ? aprobador.nombreCompleto?.toUpperCase().trim() || "" : "",
    CargoAprobador: aprobador ? aprobador.cargo?.toUpperCase() || "" : "",
    DependenciaAprobador: aprobador ? aprobador?.dependencia?.toUpperCase() || "" : "",
  };

  if (datosSalida && (allData?.copiaExterna?.length > 0 || allData?.copiaInterna?.length > 0)) {
    arrayCopyExterna.value = allData?.copiaExterna.map((item) =>
      formatCopyExterna(item)
    );
    arrayCopyInterna.value = allData?.copiaInterna.map((item) =>
      formatCopyInterna(item)
    );
    arrayAllCopys.value = [...arrayCopyInterna.value, ...arrayCopyExterna.value];
    copias.value.internal = allData?.copiaInterna && allData?.copiaInterna?.length > 0
      ? allData?.copiaInterna
      : [];
    copias.value.external = allData?.copiaExterna && allData?.copiaExterna?.length > 0
      ? allData?.copiaExterna
      : [];
  } else {
    arrayCopyExterna.value = [];
    arrayCopyInterna.value = [];
    arrayAllCopys.value = 0;
  }

  dataFooter.value = {
    Anexo: datosSalida?.anexos || "",
    // asunto: datosSalida?.asunto || "",
    Copia: arrayAllCopys?.value || "",
    DatosGestionador: allData?.gestionador
      ? `${allData?.gestionador?.nombreCompleto?.toUpperCase().trim()
      } - ${allData?.gestionador?.cargo?.toUpperCase()} - ${allData?.gestionador?.dependencia?.toUpperCase()}`
      : "",
    DatosAprobador: !["Aprobación rechazada"].includes(detalleRadicado.value?.estadoProceso?.estado) && allData?.aprobador
      ? `${allData?.aprobador?.nombreCompleto?.toUpperCase().trim()
      } - ${allData?.aprobador?.cargo?.toUpperCase()} - ${allData?.aprobador?.dependencia?.toUpperCase()}`
      : "",
    DatosRevisor: !["Revisión rechazada"].includes(detalleRadicado.value?.estadoProceso?.estado) && allData?.revisor
      ? `${allData?.revisor?.nombreCompleto.toUpperCase().trim()
      } - ${allData?.revisor?.cargo?.toUpperCase()} - ${allData?.revisor?.dependencia?.toUpperCase()}`
      : "",
    // firmaAprobador: allData?.aprobador
    //   ? allData?.aprobador.nombreCompleto.toUpperCase()
    //   : "",
    // cargoAprobador: allData?.aprobador
    //   ? allData?.aprobador.cargo.toUpperCase()
    //   : "",
    // dependenciaAprobador: allData?.aprobador
    //   ? allData?.aprobador.dependencia.toUpperCase()
    //   : "",
    FormadeEnvio: datosSalida?.formaEnvio ? datosSalida?.formaEnvio?.nombre : "",
  };
}

const getPlantillaSinPrefijo = async () => {
  const nodeid = process.env.NODE_SIN_PREFIJO;

  const response = await sgdeaAxios.get<any>(
    `/radicados/consultar_documento/${nodeid}`
  );

  return response.data;
};
const docChange = ref();
async function autoSaveDocument({ paragraf, pdf }) {
  try {
    const htmlContentPara = paragraf;
    const blob = new Blob([htmlContentPara], {
      type: "text/html;charset=UTF-8",
    });
    let response;
    const userRole = auth.$state.userInfo.role; // Suponiendo que el rol está almacenado en userInfo.role
    if (userRole === "Gestionador") {
      changeGestionador.value = true;
      gestionadorCambio.value = true;
    } else if (userRole === "Revisor") {
      changerevisor.value = true;
      revisorCambio.value = true;
    } else if (userRole === "Aprobador") {
      changeAprobador.value = true;
      aprobadorCambio.value = true;
    }
    if (isComunicaciones.value) {
      response = await sgdeaAxios.patch(
        "/correspondencia/comunicacion/actualizarDocumentoSalida",
        {
          idComunicacion: detalleComunicaciones.value.id,
          id_documentoSalida: idDocumento.value,
          contenido_html: htmlContentPara,
          usuarioCreadorId: auth.userInfo.userid,
        }, { showLoader: false }
      );
    } else {
      if (htmlContent.value === undefined) {
        response = await sgdeaAxios.post(
          "correspondencia/guardarDocumentoSalida",
          {
            idCorrespondencia: detalleRadicado.value.id,
            contenido_html: htmlContentPara,
            usuarioCreadorId: userInfo.value.userid,
            id_documentoSalida: idDocumentoSalida.value,
          }
        );
        //   await crearTrazabilidad({
        //   proceso: `COMIND${detalleComunicaciones.value.id}`,
        //   secuencia: detalleComunicaciones.value.idRadicado,
        //   estado: detalleComunicaciones.value.estado.nombre || "",
        //   descripcion:
        //     `Usuario:${userInfo.value.name} ` +
        //     `Comentario: Se ha modificado el documento de salida`,
        //   comentario: "Se ha modificado el documento de salida",
        //   nombre: userInfo.value.name,
        //   tramite: detalleComunicaciones.value?.tipoComunicacion?.nombre || "",
        //   accion: `${userInfo.value.name} modificó el documento de salida de la comunciación`,
        // });
      } else {
        response = await sgdeaAxios.patch(
          "correspondencia/actualizarDocumentoSalida",
          {
            idCorrespondencia: detalleRadicado.value.id,
            contenido_html: htmlContentPara,
            usuarioCreadorId: userInfo.value.userid,
            id_documentoSalida: idDocumentoSalida.value,
          }
        );
        if (response.status === 200 || response.status === 201) {
          docChange.value = htmlContentPara.value;
          toast.success("Se guardó el documento exitosamente");
          if (!trazabilidadRegistrada) {
            await crearTrazabilidad({
              proceso: `COR${detalleRadicado.value.id}`,
              secuencia: detalleRadicado.value.idRadicado,
              estado: detalleRadicado.value.estadoProceso.estado,
              descripcion: `Se ha modificado el documento de salida`,
              comentario: "Modificación",
              nombre: userInfo.value.name,
              tramite: detalleRadicado.value.tipoTramite.nombre,
              accion: `${userInfo.value.name}  ha modificado el documento de salida del caso  ${hardcoreData.value.idRadicado}`,
            });
            trazabilidadRegistrada = true;
          }
        }
      }
    }

    await getDocSalida();
  } catch (error) {
    toast.error("Hubo un error al guardar el documento.");
  }
}

const validacionesDevolucion = () => {
  if (
    detalleRadicado.value.numeroDevoluciones > 1 &&
    detalleRadicado.value.isCierreDevolucion
  ) {
    modalSegundaDevolucion.value = true;
    isNewDocCreated.value = true;
    segundaDevolucion.value = true;
  }
};

const setRoleFlags = (role) => {
  if (role === "Revisor") isRevisor.value = true;
  if (role === "Aprobador") isAprobador.value = true;
  if (role.includes("Gestionador")) isGestionador.value = true;
};

const backView = () => {
  currentTab.value = "vistaInformacionGeneral";
};

const backViewGestion = () => {
  getTabs();
  currentTab.value = "vistaInformacionGeneral";
};

const backViewTotal = () => {
  router.push("/correspondencia");
};

const backViewDocSalida = () => {
  openConfirmationRechazoAprobador.value = false;
  currentTab.value = "vistaInformacionGeneral";
  cancelModalDoc.value = false;
};

watch(currentTab, async (val) => {
  if (val === "trazabilidad") {
    const proceso = isComunicaciones.value ? "COMIND" + detalleComunicaciones.value.id : "COR" + detalleRadicado.value.id
    const response = await sgdeaAxios.get(
      "/trazabilidad/obtenerPorCodProceso/" + proceso
    );

    if (!response?.data || response.data.length === 0) {
      trazabilidadData.value = [];
      return;
    }

    trazabilidadData.value = response.data
      .sort((a, b) => a.id - b.id)
      .map((item, index) => ({
        ...item,
        detalle: item.descripcion,
      }));
  }
  if (val === "iniciarGestion") {
    try {
      const response = await sgdeaAxios.put(
        `/correspondencia/asignacion/inicarGestion/${detalleAsignaciones.value.id}` // detalleAsignaciones.value.id
      );

      if (response.status == 200) {
        await crearTrazabilidad({
          proceso: `COR${detalleRadicado.value.id}`,
          secuencia: detalleRadicado.value.idRadicado,
          estado: detalleRadicado.value.estadoProceso.estado,
          descripcion: `Usuario: ${userInfo.value.name} Comentario:El gestionador a iniciado la gestión al radicado`,
          comentario: "Iniciar Gestión",
          nombre: userInfo.value.name,
          tramite: detalleRadicado.value.tipoTramite.nombre,
          accion: `Se ha iniciado gestión en el trámite`,
        });
        detalleAsignaciones.value = response.data;
        detalleRadicado.value = response.data.radicacion;

        window.location.reload()

        toast.success("Se ha iniciado la gestión correctamente");
      }
    } catch (error) {
      toast.error("Ha ocurrido un error inesperado");
    }
    getTabs();
    currentTab.value = "vistaInformacionGeneral";
  }
  if (val === "manual") {
    manual.value = true;
  }
});

const download = async (id) => {

  const { data } = await sgdeaAxios.get<DocumentoRadicado>(
    `/radicados/consultar_documento/${id}`
  );

  if (id) {
    nameDocument.value = listDocs.value.find((it) => it.id === id)?.nombre;
  }

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
  link.download = nameDocument.value;

  link.click();

  URL.revokeObjectURL(blobUrl);


};

const getDocs = async (path) => {
  try {
    const { data: getDocs } = await sgdeaAxios.get<any>(`${path}`);

    const nodeId = getDocs.length > 0 ? getDocs[0]?.nodeId : null;
    listDocs.value = getDocs;

    if (nodeId) {
      const { data: getDocAlf } = await sgdeaAxios.get<DocumentoRadicado>(
        `/radicados/consultar_documento/${nodeId}`
      );

      const decodedContent = await decodeBase64ToUTF8(getDocAlf.base64x);
      dataSave.value = decodedContent;
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

const getDocs2 = async () => {

  try {
    let responseEntrada, responseSoporte, responseAlf, responseAdjuntos, responseSalida;

    if (isComunicaciones.value) {
      [responseEntrada, responseSoporte, responseAlf, responseAdjuntos] = await Promise.all([
        sgdeaAxios.get<DocsBD[]>(
          `correspondencia/comunicacion/documentos/ENTRADA/${detalleComunicaciones.value.id}`
        ),
        sgdeaAxios.get<DocsBD[]>(
          `correspondencia/comunicacion/documentos/SOPORTE/${detalleComunicaciones.value.id}`
        ),
        sgdeaAxios.get(
          "/radicados/obtenerHijosPorNodo/" + detalleComunicaciones.value.nodeId
        ),
        sgdeaAxios.get<DocsBD[]>(
          `correspondencia/comunicacion/documentos/COLILLA/${detalleComunicaciones.value.id}`
        ),
      ]);
    } else {
      [responseEntrada, responseSoporte, responseAdjuntos] = await Promise.all([
        sgdeaAxios.get<DocsBD[]>(
          `correspondencia/radicacion/documentos/ENTRADA/${detalleRadicado.value.id}`
        ),
        sgdeaAxios.get<DocsBD[]>(
          `correspondencia/radicacion/documentos/SOPORTE/${detalleRadicado.value.id}`
        ),
        sgdeaAxios.get<DocsBD[]>(
          `correspondencia/radicacion/documentos/COLILLA/${detalleRadicado.value.id}`
        ),
      ]);
    }

    // Process main document
    docEntrada.value = responseAlf?.data?.list?.entries?.find(
      (item) => item.entry.name == detalleRadicado.value.idRadicado + ".pdf"
    )?.entry;

    const docsFromAlf = responseAlf?.data?.list?.entries
      .filter(doc => doc.entry.name.startsWith('SAL'))
      .map(doc => {
        // const anexo = doc.anexos.find(a => a.nombreAnexo === `${doc.entry.name}.pdf`);
        return {
          id: null,
          nombre: doc.entry.name + (doc.entry.content?.mimeType === 'application/pdf' ? '.pdf' : ''),
          nodeId: doc.entry.id,
          formato: doc.entry.content?.mimeType === 'application/pdf' ? 'pdf' : 'unknown',
          tipoDocumento: 'SALIDA',
          fechaCargue: doc.entry.createdAt
        };
      }).filter(doc => doc.nodeId);

    listDocs.value = Array.isArray(docsFromAlf) ? [...docsFromAlf, ...listDocs.value] : [...listDocs.value];

    // Process other documents
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
    toast.error('Error al cargar los documentos');
  }
};

const getBlobToIframe = async (id, list) => {
  if (currentTab.value === allNameTabs.documentosRelacionados || currentTab.value === 'vistaInformacionGeneral') {
    if (id) {
      visibleDoscRead.value = true;
      const { data } = await sgdeaAxios.get<DocumentoRadicado>(
        `/radicados/consultar_documento/${id}`
      );

      // nameDocument.value = listDocs.value.find((it) => it.id === id)?.nombre
      tabsFiles.value = data.name;

      const byteCharacters = atob(data.base64x);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      iframePdfUrl.value = URL.createObjectURL(blob);

      visualizadorPDF.value = true;
      if (list) {
        listForVizualiser.value = list;
      }
      visibleDoscRead.value = false;
    }
  }

};

const viewDoc = async (id) => {
  const { data } = await sgdeaAxios.get(`/radicados/consultar_documento/${id}`);

  const byteCharacters = atob(data.base64x);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], { type: "application/pdf" });

  iframePdfUrl.value = URL.createObjectURL(blob);
  visualizadorPDF.value = true;
};

const findRoles = (role) => {
  var nomenclatura = [
    // 'Administrador de Trámite', //0
    "administrador", //0
    "asignador", //1
    "aprobador_sgdea", //2
    "gestionador", //3
    "radicador - web", //4
    "gestionador consolidador", //5
    "gestionador escalador", //6
    "asignador responsable", // 7
  ];
  var valid = false;
  role.forEach((element) => {
    if (userInfo.value?.role?.toLowerCase().includes(nomenclatura[element])) {
      valid = true;
    }
  });
  return valid;
};

const submitVistoBueno = async () => {
  if (!isComunicaciones.value) {
    const email = detalleAsignaciones.value?.usuario?.email;
    const vistoBueno = await sgdeaAxios.put(
      `/correspondencia/revision/responder/${detalleAsignaciones?.value?.radicacion?.revision?.id}`,
      {
        respuestaRevision: "VISTO_BUENO",
        correoGestionado: email,
      }
    );
    if (vistoBueno.status == 200) {
      if (revisorCambio.value == true) {
        await crearTrazabilidadDocumento(
          {
            htmlContent: responseDocSalida.value.html_content,
            usuario: auth.userInfo.name,
            rol: auth.userInfo.role,
          },
          responseDocSalida.value.id, 'ENC'
        );
      }
      await crearTrazabilidad({
        proceso: `COR${detalleRadicado.value.id}`,
        secuencia: detalleRadicado.value.idRadicado,
        estado: detalleRadicado.value.estadoProceso.estado,
        descripcion:
          `Usuario:${userInfo.value.name} ` +
          `Comentario: El revisor ha dado su visto bueno al documento`,
        comentario: "Visto bueno",
        nombre: userInfo.value.name,
        tramite: detalleRadicado.value.tipoTramite.nombre,
        accion: `Se dio el visto bueno`,
      });
      succesVistoBueno.value = true;
    }
  } else {
    const vistoBueno = await sgdeaAxios.put(
      `/correspondencia/comunicacion/actualizarEstado/${detalleComunicaciones.value.id}?idNuevoEstado=4`);
    if (vistoBueno.status == 200) {
      await crearTrazabilidad({
        proceso: `COMIND${detalleComunicaciones.value.id}`,
        secuencia: detalleComunicaciones.value.idRadicado,
        estado: detalleComunicaciones.value.estado.nombre,
        descripcion:
          `Usuario:${userInfo.value.name} ` +
          `Comentario: El revisor ha dado su visto bueno al documento`,
        comentario: "Visto bueno",
        nombre: userInfo.value.name,
        tramite: detalleComunicaciones.value.tipoComunicacion.nombre,
        accion: `Se dio el visto bueno`,
      });
      succesVistoBueno.value = true;
    }
  }
};

const finishVisto = () => {
  router.push("/bandeja");
};

const gestionManual = async () => {
  try {
    const { data: isExpediente } = await sgdeaAxios.post(
      `/correspondencia/${route.params.id}/expediente`
    );

    if (!isExpediente) {
      toast.error("Debe incluir el radicado a un expediente");
      backView();
      return;
    }

    const response = await sgdeaAxios.put(
      `/correspondencia/asignacion/gestionarManual/${detalleAsignaciones.value.id}`
    );

    if (response.status == 200) {
      await crearTrazabilidad({
        proceso: `COR${detalleRadicado.value.id}`,
        secuencia: detalleRadicado.value?.idRadicado,
        estado: detalleRadicado.value.estadoProceso.estado,
        descripcion:
          `Usuario:${userInfo.value.name}` +
          `Comentario:El radicado ha sido cambiado al modo de Gestión Manual`,
        comentario: "Gestión Manual",
        nombre: userInfo.value.name,
        tramite: detalleRadicado.value.tipoTramite.nombre,
        accion: `Se cambio el modo al trámite`,
      });
      toast.success("Trámite disponible para la gestión manual");
      detalleAsignaciones.value = response.data;
      backView();
    }
  } catch (error) {
    toast.error("Ha ocurrido un error inesperado");
  }
};

const dataDoc = ref({
  clonado: false,
  asignacionCOREntity: {
    revisor: {
      fullname: "Nombre Apellido",
      oficina: "Oficina",
    },
  },
});

const updateDatosSalida = async () => {
  await getData();
  const datos = detalleRadicado.value.datosSalida;

  // @ts-ignore
  datosSalida.value.destinatario = {
    forma_envio: datos.formaEnvio.nombre,
    nombre: datos.nombreDestinatario,
    direccion: datos.direccionDestinatario,
    numero_celular: datos.telefonoDestinatario,
    asunto: datos.asunto,
    anexos: datos.anexos,
    departamento: datos.departamento.nombre,
    municipio: datos.municipio.nombre,
  };

  currentTab.value = "docSalida";
  setTimeout(() => {
    emitSaveDoc();
  }, 2000);
};

const cargarDatosSalida = async () => {
  const datos = detalleRadicado.value.datosSalida;
  const tipoCopia = datos.tipoCopia.nombre;

  // @ts-ignore
  datosSalida.value.destinatario = {
    anexos: datos.anexos,
    forma_envio: datos.formaEnvio.nombre,
  };

  await getCopias(tipoCopia, datos.id);
};

const getCopias = async (tipoCopia, id) => {
  if (tipoCopia !== "Ninguno") {
    const { data: copias } = await sgdeaAxios.get(
      `/correspondencia/comunicacion/${tipoCopia === "Externa" ? "copiaExterna" : "copiaInterna"
      }/${id}`
    );

    if (tipoCopia === "Interna") {
      datosSalida.value.destinatario.copiesInterna = copias;
    } else {
      datosSalida.value.destinatario.copiesExterna = copias;
    }
  }
};

const datosSalida = ref({
  destinatario: {
    forma_envio: "",
    nombre: "",
    direccion: "",
    numero_celular: "",
    asunto: "",
    anexos: "",
    departamento: "",
    municipio: "",
    copiesExterna: [],
    copiesInterna: [],
  },
});

const updateModalAprobadorRechazo = (value) => {
  observacionesRechazoAprobador.value = value.value;
  openRechazoAprobador.value = true;
};

function rejectedTypesAprob(fileEntries) {
  if (!fileEntries.length) {
    return;
  }

  if (fileEntries[0]?.file.size >= 50 * 1024 * 1024) {
    toast.error(`El peso máximo permitido es de 50MB`);
  } else {
    const allowedFileTypes = [
      "pdf",
      "png",
      "jpg",
      "jpeg",
      "txt",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "mp3",
      "mp4",
      "avi",
      "webp",
    ];
    const fileTypes = fileEntries.map((entry) =>
      entry.file.name.split(".").pop()
    );
    const invalidFileTypes = fileTypes.filter(
      (type) => !allowedFileTypes.includes(type)
    );

    if (invalidFileTypes.length > 0) {
      toast.error("El formato que está intentando cargar no se encuentra permitido, solo se manejan formatos de tipo png, jpg, jpeg, webp");
    }
  }
}

const rechazarAprobacion = async () => {
  if (isComunicaciones.value) {
    try {
      let response;
      if (!isRevisor.value) {
        response = await sgdeaAxios.patch(
          `/correspondencia/comunicacion/rechazar-aprobacion/${detalleComunicaciones.value.id}`,
          {
            motivoRechazo: observacionesRechazoAprobador.value,
          }
        );
        await crearTrazabilidad({
          proceso: `COMIND${detalleComunicaciones.value.id}`,
          secuencia: detalleComunicaciones.value.idRadicado,
          estado: detalleComunicaciones.value.estado.nombre,
          descripcion:
            `Usuario:${userInfo.value.name} ` +
            `Comentario: El revisor rechazo el tramite `,
          comentario: "Trámite Rechazado ",
          nombre: userInfo.value.name,
          tramite: detalleComunicaciones.value.tipoComunicacion.nombre,
          accion: `${userInfo.value.name} rechazo el tramite `,
        });
      } else {
        response = await sgdeaAxios.patch(
          `/correspondencia/comunicacion/rechazar-revision/${detalleComunicaciones.value.id}`,
          {
            motivoRechazo: observacionesRechazoAprobador.value,
          }
        );
      }
      if (response.status === 200) {
        modalRechazo.value = true;
        toast.success("La respuesta proyectada fue rechazada");
        await crearTrazabilidad({
          proceso: `COMIND${detalleComunicaciones.value.id}`,
          secuencia: detalleComunicaciones.value.idRadicado,
          estado: detalleComunicaciones.value.estado.nombre,
          descripcion:
            `Usuario:${userInfo.value.name} ` +
            `Comentario: El aprobador rechazo el tramite `,
          comentario: "Trámite Rechazado ",
          nombre: userInfo.value.name,
          tramite: detalleComunicaciones.value.tipoComunicacion.nombre,
          accion: `${userInfo.value.name} rechazo el tramite `,
        });
      }
      router.push("/correspondencia");
    } catch (error) {
      toast.error("Hubo un error al rechazar el trámite")
    }
  } else {
    let response
    if (!isRevisor.value) {
      response = await sgdeaAxios.put(
        `/correspondencia/aprobacion/rechazar/${detalleAsignaciones?.value.radicacion?.id}`,
        {
          observaciones: observacionesRechazoAprobador.value,
        }
      );
      if (response.status == 200 || response.status == 201) {
        if (aprobadorCambio.value == true) {
          await crearTrazabilidadDocumento(
            {
              htmlContent: responseDocSalida.value.html_content,
              usuario: auth.userInfo.name,
              rol: auth.userInfo.role,
            },
            responseDocSalida.value.id, 'ENC'
          );
        }
      }
    } else {
      const email = detalleAsignaciones.value?.usuario?.email;
      response = await sgdeaAxios.put(
        `/correspondencia/revision/responder/${detalleAsignaciones?.value?.radicacion?.revision?.id}`,
        {
          observaciones: observacionesRechazoAprobador.value,
          correoGestionado: email,
          respuestaRevision: "RECHAZADA",
        }
      );
      if (response.status == 200 || response.status == 201) {
        if (revisorCambio.value == true) {
          await crearTrazabilidadDocumento(
            {
              htmlContent: responseDocSalida.value.html_content,
              usuario: auth.userInfo.name,
              rol: auth.userInfo.role,
            },
            responseDocSalida.value.id, 'ENC'
          );
        }
      }
    }

    if (response.status === 200) {
      modalRechazo.value = true;
      toast.success("Trámite Rechazado, se envió correo electrónico al gestionador correspondiente")
      await crearTrazabilidad({
        proceso: `COR${detalleRadicado.value.id}`,
        secuencia: detalleRadicado.value.idRadicado,
        estado: `${isRevisor.value ? 'Revisión rechazada' : 'Aprobación rechazada'}`,
        descripcion:
          `${isRevisor.value ? 'Revisor: ' : 'Aprobador: '}${userInfo.value.name}` +
          `Motivo: ${observacionesRechazoAprobador.value}`,
        comentario: "Trámite Rechazado",
        nombre: userInfo.value.name,
        tramite: detalleRadicado.value.tipoTramite.nombre,
        accion: `Se rechazo el trámite`,
      });
      router.push("/bandeja");
    }
  }
};

const showModalExitoApro = ref(false);


function beforeAprobacion() {
  loadingEnvios.value = true;
  aprobadoDocSal.value = true;
}

const aprobarCasoAprobador = async (data) => {
  // aprobado.value = true;

  const formData = new FormData();
  formData.append("file", data, `[object Object].pdf`);
  if (!isComunicaciones.value) {
    try {
      const response = await sgdeaAxios.patch(
        `/correspondencia/aprobacion/aprobar/${detalleAsignaciones.value.radicacion.id}`,
        formData
      );
      if (response.status === 200) {
        //goBack();
        SAL.value =
          (response.data as { radicadoSalidaAprobar?: string })
            ?.radicadoSalidaAprobar ?? "";
          showModalExitoApro.value = true;

        //toast.success(`Trámite aprobado correctamente. Se generó el radicado de salida ${SAL.value}`
        if (aprobadorCambio.value == true) {
          await crearTrazabilidadDocumento(
            {
              htmlContent: responseDocSalida.value.html_content,
              usuario: auth.userInfo.name,
              rol: auth.userInfo.role,
            },
            responseDocSalida.value.id, 'ENC'
          );
        }

        await crearTrazabilidad({
          proceso: `COR${detalleRadicado.value.id}`,
          secuencia: detalleRadicado.value.idRadicado,
          estado: "Por Recibir En Correspondencia",
          descripcion:
            `Usuario: ${userInfo.value.name}` +
            `Rol: ${userInfo.value.role} ` +
            `Comentario: El proceso de aprobación ha concluido exitosamente, y el radicado ha sido oficialmente aprobado.`,
          comentario: "El radicado ha sido aprobado.",
          nombre: userInfo.value.name,
          tramite: detalleRadicado.value.tipoTramite.nombre,
          accion: `Se a enviado a correspondencia`,
        });
      }
    } catch (error) {
      console.error(error);
    }
  } else {

    try {
      const response = await sgdeaAxios.patch(
        `/correspondencia/comunicacion/aprobacion/aprobar/${detalleComunicaciones.value.id}`,
        formData
      );
      if (response.status === 200) {
        // goBack();
        aprobadoDocSal.value = false;
        SAL.value =
          (response.data as { radicadoSalidaAprobar?: string })
            ?.radicadoSalidaAprobar ?? "";

        showModalExitoApro.value = true;

        // toast.success(`Trámite aprobado correctamente. Se generó el radicado de salida ${SAL.value}`)

        await crearTrazabilidad({
          proceso: `COMIND${detalleComunicaciones.value.id}`,
          secuencia: detalleComunicaciones.value.idRadicado,
          estado: detalleComunicaciones.value.estado.nombre,
          descripcion:
            `Usuario: ${userInfo.value.name}` +
            `Rol: ${userInfo.value.role} ` +
            `Comentario: El proceso de aprobación ha concluido exitosamente, y el radicado ha sido oficialmente aprobado.`,
          comentario: "El radicado ha sido aprobado.",
          nombre: userInfo.value.name,
          tramite: detalleComunicaciones.value.tipoComunicacion.nombre,
          accion: `Se devolvió el trámite al administrador: ${detalleComunicaciones.value.idRadicado}`,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
};

const updateModalApruebaCaso = () => {
  aprobado.value = true;
  //location.reload()
};

const emitSaveDoc = () => {
  if (isDevolucion.value) {
    docSalidaComp.value?.finalDocument();
  } else {
    docSalidaComp.value?.saveDoc();
  }
};

async function asignarOficina() {
  if (!(await asignarOficinaForm.value.validate())) {
    toast.error(
      "Debe diligenciar los campos obligatorios para continuar con el proceso"
    );
    return;
  }

  const formAsignarOficina = new FormData();

  formAsignarOficina.append("idOficina", selectedOficinaAsignar.value);
  formAsignarOficina.append("idCorrespondencia", detalleRadicado.value.id);

  const response = await sgdeaAxios.patch(
    "/correspondencia/relacionarCorrespondenciaAoficina",
    formAsignarOficina
  );
  if (response.status == 200 || response.status == 201) {
    await crearTrazabilidad({
      proceso: `COR${detalleRadicado.value.id}`,
      secuencia: detalleRadicado.value.idRadicado,
      estado: detalleRadicado.value.estadoProceso.estado,
      descripcion: `Se asigno una oficina al trámite`,
      comentario: "Asignación Oficina",
      nombre: userInfo.value.name,
      tramite: detalleRadicado.value.tipoTramite.nombre,
      accion: `Se asignó una oficina al trámite`,
    });
    toast.success("La asignación de oficina ha sido exitosa");
    router.push("/mesa-back");
  }
}

async function devolverAdministrador() {
  if (!devolverObservacion.value) {
    toast.error(
      "Debe diligenciar los campos obligatorios para continuar con el proceso"
    );
    return;
  }

  const response = await sgdeaAxios.post(
    `/correspondencia/devolverCorrespondenciaAdministracion/${detalleRadicado.value.id}`,
    {
      observaciones: devolverObservacion.value,
    }
  );
  if (response.status == 200 || response.status == 201) {
    await crearTrazabilidad({
      proceso: `COR${detalleRadicado.value.id}`,
      secuencia: detalleRadicado.value.idRadicado,
      estado: detalleRadicado.value.estadoProceso.estado,
      descripcion:
        `Usuario: ${auth.userInfo.name}\n` +
        `Comentario: ${devolverObservacion.value}`,
      comentario: "Se devolvió el trámite al administrador",
      nombre: userInfo.value.name,
      tramite: detalleRadicado.value.tipoTramite.nombre,
      accion: `Se devolvió el trámite al administrador`,
    });
    toast.success("La devolución del trámite ha sido exitosa");
    router.push("/mesa-back");
  }
}

async function getOficinas() {
  try {
    const { data } = await sgdeaAxios.get("oficinas/all");
    oficinas.value = data
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
      .map(({ nombre, id }) => {
        return {
          label: nombre,
          value: id,
        };
      });
    filteredOficinas.value = oficinas.value;
  } catch (error) {
    console.error(error);
  }
}

const saveReasignacion = async (event) => {
  const response = await sgdeaAxios.get(
    `/correspondencia/puntoRadicacion/listado`
  );
  const { data } = await sgdeaAxios.get(
    `/correspondencia/comunicacion/listadoDependencias`
  );

  const puntoRadicacion = response.data.find(
    (i) => i.id === detalleRadicado.value?.puntoRadicacion
  )?.nombrePunto;
  const dependencia = data.find(
    (d) => d.id === detalleRadicado.value?.dependencia
  )?.nombre;
  try {
    const oficinaFinal = [];
    oficinaFinal.push(event.oficinaId);
    const response = await sgdeaAxios.put(`/oficinas/reasignar`, {
      idFlujo: 1,
      idCaso: detalleRadicado.value.id,
      idOficina: oficinaFinal,
    });
    if (response.status == 200 || response.status == 201) {
      toast.success("El caso se reasigno con éxito");
      try {
        // Intentar crear la trazabilidad
        await crearTrazabilidad({
          proceso: `COR${detalleRadicado.value.id}`,
          secuencia: detalleRadicado.value.idRadicado,
          estado: detalleRadicado.value.estadoProceso.estado,
          descripcion:
            `Usuario: ${userInfo.value.name} ` +
            `Oficina anterior: ${detalleRadicado.value.idOficina
              ? detalleRadicado.value.idOficina.nombre
              : "No presenta Oficina"
            } ` +
            `Punto Radicacion anterior: ${detalleRadicado.value?.puntoRadicacion
              ? puntoRadicacion
              : "No presenta punto de radicación"
            }` +
            `Dependencia anterior: ${detalleRadicado.value?.dependencia
              ? dependencia
              : "No presenta dependencia"
            }` +
            `Oficina nueva: ${event.oficinaAsignada} ` +
            `Comentario: Se ha reasignado la oficina del radicado`,
          comentario: event.motivoAsignacion,
          nombre: userInfo.value.name,
          accion: `${userInfo.value.name} ha reasignado la oficina del radicado ${detalleRadicado.value.idRadicado}`,
          tramite: detalleRadicado.value.tipoTramite.nombre,
        });
      } catch (error) {
        // Manejo del error al crear la trazabilidad
        toast.error("Error al crear la trazabilidad: " + error.message);
      }

      router.push("/Correspondencia/");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
</script>

<style scoped lang="scss">
.modal-custom-input {
  &::v-deep {
    .q-field__control.relative-position.row.no-wrap {
      height: 116px;
    }

    .q-field__inner.relative-position.col.self-stretch {
      margin-top: 3px;
    }

    textarea {
      color: theme("colors.modal-input");
      resize: none !important;
    }

    .q-field__control.relative-position.row.no-wrap {
      border-radius: 8px;
    }
  }
}
</style>
<style>
body {
  overflow-y: auto !important;
  overflow-x: auto !important;
}

.border__btn {
  border: 1px solid #b2bdc9;
}
</style>
