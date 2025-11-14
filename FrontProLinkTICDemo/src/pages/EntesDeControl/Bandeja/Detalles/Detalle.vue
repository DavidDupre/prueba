<template>
  <div class="container mx-auto p-4">
    <button
      class="text-primary q-mb-md block"
      style="text-decoration: none"
      @click="validateVolver()"
    >
      <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
      <b>Volver</b>
    </button>

    <div class="tw-flex tw-justify-between tw-pt-4 tw-mb-3">
      <h1 class="tw-text-3xl tw-font-bold">Radicado {{ nroRadicado }}</h1>
    </div>

    <div class="tw-flex tw-justify-between">
      <div
        :class="[
          ['vencido', '0 días', '0 horas'].includes(
            informacionGeneral.tiempoPorVencer
          ) && '!tw-border-red-700 !tw-pl-6',
          'q-my-sm tw-mb-3 tw-border tw-rounded-full tw-w-auto q-px-md q-py-xs tw-relative',
          ESTADOS[status],
        ]"
      >
        <span
          v-if="
            ['vencido', '0 días', '0 horas'].includes(
              informacionGeneral.tiempoPorVencer
            )
          "
          class="tw-inline-block tw-w-3 tw-bg-red-500 tw-absolute tw-rounded-l-full"
          style="top: 0; left: 0px; height: 29px"
        ></span>
        {{ status }}
      </div>
      <!-- TODO: validar el status del radicado  -->
      <div class="tw-flex">
        <q-btn
          v-if="showBotonRechazar && auth.userInfo.role !== 'Aprobador'"
          type="submit"
          label="Rechazar"
          class="tw-w-36 tw-h-[40px]"
          color="primary"
          @click="showModalRechazarRadicado = true"
        />

        <q-btn
          v-if="
            showBotonRechazarAprobacion && auth.userInfo.role === 'Aprobador'
          "
          type="submit"
          label="Rechazar"
          class="tw-w-36 tw-h-[40px]"
          color="primary"
          @click="showModalRechazarRadicadoAprobacion = true"
        />

        <q-btn
          v-if="showBotonAprobar"
          type="submit"
          label="Aprobar"
          class="tw-w-36 tw-ml-2 tw-h-[40px]"
          color="secondary"
          @click="showModalAprobarRadicado = true, changeTab('DocumentoDeSalida')"
        />

        <q-btn
          v-if="showBotonRechazarClonado"
          type="submit"
          label="Rechazar"
          class="tw-w-36 tw-h-[40px]"
          color="primary"
          @click="showModalRechazarRadicadoClonado = true"
        />

        <q-btn
          v-if="showBotonTerminarEdicion"
          type="submit"
          label="Terminar Edición"
          class="tw-w-36 tw-ml-2 tw-h-[40px]"
          color="primary"
          @click="validateClonedParagraph"
        />
      </div>
    </div>
    <div>
      <q-card v-if="tabs.length > 1" class="tw-my-4" flat bordered>
        <q-tabs
          inline-label
          no-caps
          outside-arrows
          align="left"
          class="tw-rounded-lg tw-bg-white tw-flex rowsTab-alingCenter"
          indicator-color="transparent"
          active-color="primary"
          v-model="currentTab"
        >
          <q-tab
            v-for="tab in tabs"
            :key="tab.label"
            :name="tab.label"
            :label="tab.label"
            :icon="tab.icon"
            :ripple="false"
            :class="[
              'tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]',
              {
                '!tw-text-primary !tw-border-primary color-icon !tw-bg-transparent':
                  tab.name === currentTab,
              },
            ]"
            @click="
              [
                changeTab(tab.name),
                currentTab == allNameTabs.ReinicioDeLaGestion
                  ? (showModalReiniciarGestion = true)
                  : null,
              ]
            "
          >
          </q-tab>
        </q-tabs>
      </q-card>

      <!-- Asignador -->
      <InformacionGeneral
        v-if="currentTab === allNameTabs.InformacionGeneral"
        :informacionGeneral="informacionGeneral"
      />
      <Trazabilidad v-if="currentTab === allNameTabs.Trazabilidad" />
      <TrazabilidadDocumento
        v-if="currentTab === allNameTabs.TrazabilidadDocumento"
        :ml-data="trazaDocument"
      />
      <MetaDatos
        v-if="currentTab === allNameTabs.MetaDatos"
        :informacionGeneral="informacionGeneral"
        :metadatos="metadatos"
        @changeView="changeTab(allNameTabs.InformacionGeneral)"
        @success="giveMeta"
      />
      <Asignar
        v-if="currentTab === allNameTabs.Asignar"
        @error-metada="changeTab(allNameTabs.MetaDatos)"
        @changeView="changeTab(allNameTabs.InformacionGeneral)"
        :informacionGeneral="informacionGeneral"
      />

      <ReasignarOficina
        v-if="currentTab === allNameTabs.Reasignar"
        :data="informacionGeneral"
        @redirect="changeTab(allNameTabs.InformacionGeneral)"
        @handleAcceptModal="saveReasignacion"
      />

      <Reclasificar
        v-if="currentTab === allNameTabs.Reclasificar"
        :informacionGeneral="informacionGeneral"
      />
      <AdjuntarDocumentos
        v-if="currentTab === allNameTabs.AdjuntarDocumentos"
        :detailsRadicado="informacionGeneral"
        :rol="rol"
        type=""
        @back-view="() => (currentTab = allNameTabs.InformacionGeneral)"
      />
      <Comentarios
        v-if="currentTab === allNameTabs.Comentarios"
        :detailsRadicado="informacionGeneral"
      />

      <!-- Gestionador -->
      <MetadatosGestionador
        v-if="currentTab === allNameTabs.MetaDatosGestionador"
        :metadatos="metadatos"
        :informacionGeneral="informacionGeneral"
        @changeView="changeTab(allNameTabs.InformacionGeneral)"
        @get-informacion-general="getInformacionGeneral"
      />
      <DatosSalidaGestionador
        v-if="currentTab === allNameTabs.DatosDeSalida"
        :informacionGeneral="informacionGeneral"
        @get-informacion-general="getInformacionGeneral"
      />
      <ReasignarGestionador
        v-if="currentTab === allNameTabs.ReasignarGestionador"
        :rol="rol"
        @error-metada="changeTab(allNameTabs.MetaDatos)"
        @changeView="changeTab(allNameTabs.InformacionGeneral)"
        :informacionGeneral="informacionGeneral"
      />
      <IncluirExpediente
        v-if="currentTab === allNameTabs.IncluirExpediente"
        :informacionGeneral="informacionGeneral"
        @success="successIncluirExpediente"
      />
      <Editor
        v-if="currentTab === allNameTabs.DocumentoDeSalida"
        :data="dataFooter"
        :referentKey="referentKey"
        :restric="false"
        :base64="documentoFile"
        :isEditorEmpty="true"
        @datos-response="autoSaveDocument"
        :img-base64="imgBase64"
        :document="htmlContent"
        @aprobado="aprobarCasoAprobador"
        :aprobado="aprobado"
        :collaboration="isConsolidator"
        :changesCollaborators="dataClonado"
        :is-cloner="isCloned"
        :isDisable="isPorAprobarPorRevisar"
      />
      <EnviarAprobacion
        v-if="currentTab === allNameTabs.EnviarAprobacion"
        :informacionGeneral="informacionGeneral"
        :isAprobacion="true"
        @changeView="goToFirstTab()"
        :documento="htmlContent"
        :documentoEntes="documentoEntes"
        @error-metada="changeTab(allNameTabs.MetaDatosGestionador)"
        @error-datos-salida="changeTab(allNameTabs.DatosDeSalida)"
        @error-expediente="changeTab(allNameTabs.IncluirExpediente)"
      />
      <EnviarRevision
        v-if="currentTab === allNameTabs.EnviarARevision"
        :informacionGeneral="informacionGeneral"
        @error-expediente="changeTab(allNameTabs.IncluirExpediente)"
        :documento="htmlContent"
        :documentoEntes="documentoEntes"
        @error-metada="changeTab(allNameTabs.MetaDatosGestionador)"
        :isAprobacion="false"
        @changeView="changeTab(allNameTabs.InformacionGeneral)"
        @error-datos-salida="changeTab(allNameTabs.DatosDeSalida)"
      />
      <DocumentosRelacionados
        v-if="currentTab === allNameTabs.DocumentosRelacionados"
        :from="allNameTabs.DocumentosRelacionados"
        :rol="rol"
        :detailsRadicado="informacionGeneral"
        @changeView="changeTab(allNameTabs.DocumentosRelacionados)"
      />
      <ExcluirGestionadores
        @changeView="
          getInformacionGeneral(), changeTab(allNameTabs.InformacionGeneral)
        "
        :informacionGeneral="informacionGeneral"
        v-if="currentTab === allNameTabs.ExcluirGestionadores && isConsolidador"
      />
      <Solictudes
        :informacionGeneral="informacionGeneral"
        v-if="currentTab === allNameTabs.Solictudes && isConsolidadorTwo"
      />
      <AdjuntosClonación
        v-if="currentTab === allNameTabs.AdjuntosClonación && isConsolidador"
        :detailsRadicado="informacionGeneral"
        :rol="rol"
        type=""
        @back-view="() => (currentTab = allNameTabs.InformacionGeneral)"
      />
      <EnviarPorCorrespondencia
        v-if="currentTab === allNameTabs.EnviarPorCorrespondencia"
        :radicado-salida="informacionGeneral?.radicadoSalida"
        :detalle-radicado="informacionGeneral"
        :datos-remitente="informacionGeneral.informacionRemitente"
        @back-view="() => (currentTab = allNameTabs.InformacionGeneral)"
        endpoint=""
      />
      <EnviarPorCorreo
        v-if="currentTab === allNameTabs.EnviarPorCorreo"
        :detalle-radicado="informacionGeneral"
        :datos-remitente="informacionGeneral.informacionRemitente"
        type-view="Entes de Control"
      />
      <EnviarPublicacion
        v-if="currentTab === allNameTabs.EnviarAPublicacion"
        typeFlujoSgda="Entes de Control"
        :idCaso="informacionGeneral.id"
        :detalle-radicado="informacionGeneral"
        pathBandeja="/bandeja"
        @back-view="() => (currentTab = allNameTabs.InformacionGeneral)"
      />
      <AdjuntarDocsComunicaciones
        v-if="currentTab === allNameTabs.AdjuntarDocumento"
        :id="informacionGeneral.id"
      />
    </div>

    <!-- ! Reiniciar Gestion -->
    <q-dialog
      v-model="IsModalReiniciarGestion"
      backdrop-color="rgba(0, 0, 0, 0.5)"
      persistent
    >
      <q-card class="tw-w-[45%] mx-auto tw-rounded-md">
        <div class="tw-flex tw-justify-center tw-mt-3">
          <span
            class="tw-rounded-[100px] tw-flex tw-justify-center"
            style="background-color: #f6f6f9; width: 82px; height: 82px"
          >
            <img
              v-lazy :data-url="require('src/assets/interrogation-modal.svg')"
              alt="check"
            />
          </span>
        </div>
        <q-form ref="formReinicioGestion" greedy>
          <q-card-section class="tw-px-8">
            <div
              class="tw-text-xl tw-font-bold tw-text-[#0a1b48] tw-mb-4 tw-mt-2 flex tw-justify-center"
            >
              Confirmación
            </div>
            <div
              class="tw-text-sm tw-font-bold tw-text-[#0a1b48] tw-mb-4 tw-mt-4 flex tw-justify-center"
            >
              ¿Desea reiniciar la gestión?
            </div>
            <CommentTextArea
              v-model="observacionesReinicio.value"
              :is-required="true"
              :max-length="1000"
              label="Observaciones"
            />
          </q-card-section>
          <div
            class="tw-flex tw-justify-center tw-items-center tw-pb-6 tw-gap-3"
          >
            <q-btn
              flat
              label="NO"
              color="secondary"
              class="tw-w-[35%] tw-h-10"
              @click="CancelModalReiniciarGestion()"
            />
            <q-btn
              label="SI"
              color="secondary"
              class="tw-w-[35%] tw-h-10"
              @click="getModalReinicio"
            />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
    <!-- ! END Reiniciar Gestion -->

    <!-- ! Rechazar Radicado -->
    <q-dialog
      v-model="showModalRechazarRadicado"
      backdrop-color="rgba(0, 0, 0, 0.5)"
      persistent
    >
      <q-card class="tw-w-[45%] mx-auto tw-rounded-md">
        <div class="tw-flex tw-justify-center tw-mt-3">
          <span
            class="tw-rounded-[100px] tw-flex tw-justify-center"
            style="background-color: #f6f6f9; width: 82px; height: 82px"
          >
            <img v-lazy :data-url="require('src/assets/x-modal.webp')" alt="check" />
          </span>
        </div>
        <q-form ref="formRechazar" greedy>
          <q-card-section class="tw-px-8">
            <div class="tw-text-sm tw-font-bold tw-mb-4 tw-mt-4 tw-text-center">
              <div class="tw-text-[#0a1b48]">
                ¿Está seguro de rechazar la asignación <br />para gestión del
                radicado #{{ nroRadicado }}? Recuerde que una vez que rechace la
                asignación no podrá volver a visualizar el trámite
              </div>
              <div class="tw-text-[#a5a9b4] tw-mt-3 tw-mb-8">
                Por favor indíquenos el motivo de rechazo
              </div>
            </div>
            <label class="tw-block tw-text-sm tw-font-bold tw-text-[#777e87]"
              >Motivo de Rechazo *</label
            >
            <q-input
              type="textarea"
              outlined
              label="Inserte"
              dense
              emit-value
              v-model="observacionesRechazar"
              :rules="[
                inputRequired,
                (v) =>
                  !validarRol([Roles.REVISOR, Roles.APROBADOR]) ||
                  minLengthInputCustom(10, v, 'campo'),
                (v) => maxLengthInput(1000, v),
              ]"
            />
          </q-card-section>
          <div
            class="tw-flex tw-justify-center tw-items-center tw-pb-6 tw-gap-3"
          >
            <q-btn
              flat
              label="No"
              color="secondary"
              class="tw-w-[35%] tw-h-10"
              @click="CancelModalRechazarRadicado()"
            />
            <q-btn
              label="Si"
              color="secondary"
              class="tw-w-[35%] tw-h-10"
              @click="rechazar(observacionesRechazar)"
            />
          </div>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- ! Rechazar Radicado Aprobacion -->
    <RechazarModalEntes
      :motivo-limit="1000"
      title="Rechazar"
      @hide-modal="CancelModalRechazarRadicado()"
      :show-modal="showModalRechazarRadicadoAprobacion"
      @update-modal="rechazar"
    />

    <!-- ! Rechazar Radicado Clonado -->
    <q-dialog
      v-model="showModalRechazarRadicadoClonado"
      backdrop-color="rgba(0, 0, 0, 0.5)"
      persistent
    >
      <q-card class="tw-w-[45%] mx-auto tw-rounded-md">
        <div class="tw-flex tw-justify-center tw-mt-3">
          <span
            class="tw-rounded-[100px] tw-flex tw-justify-center"
            style="background-color: #f6f6f9; width: 82px; height: 82px"
          >
            <img v-lazy :data-url="require('src/assets/x-modal.webp')" alt="check" />
          </span>
        </div>
        <q-form ref="formRechazarClone" greedy>
          <q-card-section class="tw-px-8">
            <div
              class="tw-text-sm tw-font-bold tw-text-[#0a1b48] tw-mb-4 tw-mt-4 flex tw-justify-center tw-text-center"
            >
              ¿Está seguro de rechazar la clonación del radicado #{{
                nroRadicado
              }}? Recuerde que una vez rechace la clonación no podrá volver a
              visualizar el trámite.
            </div>
            <label class="tw-block tw-text-sm tw-font-bold tw-text-[#777e87]"
              >Motivo de Rechazo*</label
            >
            <q-input
              type="textarea"
              outlined
              label="Inserte"
              dense
              emit-value
              v-model="observacionesClonacionRechazar"
              :rules="[
                inputRequired,
                (v) =>
                  !validarRol([Roles.REVISOR, Roles.APROBADOR]) ||
                  minLengthInputCustom(10, v, 'campo'),
                (v) => maxLengthInput(1000, v),
              ]"
            />
          </q-card-section>
          <div
            class="tw-flex tw-justify-center tw-items-center tw-pb-6 tw-gap-3"
          >
            <q-btn
              flat
              label="NO"
              color="secondary"
              class="tw-w-[35%] tw-h-10"
              @click="cancelModalRechazarRadicadoClonado()"
              type="reset"
            />
            <q-btn
              label="SI"
              color="secondary"
              class="tw-w-[35%] tw-h-10"
              @click="rechazarGestorClonado"
            />
          </div>
        </q-form>
      </q-card>
    </q-dialog>

    <Modal
      v-model="modalLiberarRadicado"
      title="¡Espera!"
      :text="`¿Está seguro de abandonar el radicado sin asignar?`"
      text-button="Sí"
      cancel-button
      text-button-cancel="No"
      @handleAccept="liberarRad"
      label="Confirmar"
      @close-modal="() => (modalLiberarRadicado = false)"
    />

    <!-- ! END Edictar terminada -->
    <Modal
      v-model="showModalTerminarEdicion"
      title="¡Espera!"
      :text="`¿Está seguro de terminar la edición?`"
      text-button="Sí"
      cancel-button
      text-button-cancel="No"
      @handleAccept="terminarEdicion"
      label="Confirmar"
      @close-modal="() => (showModalTerminarEdicion = false)"
    />

    <Modal
      v-model="finalModal"
      title="Exito"
      :is-success="true"
      textButton="Ok"
      text="Edición del párrafo dinámico finalizada"
      type="button"
      @handleAccept="validateVolver()"
    />
    <!-- ! END Rechazar Radicado -->
    <Modal
      v-model="modalLiberarRadicado"
      title="¡Espera!"
      :text="`¿Está seguro de abandonar el radicado sin asignar?`"
      text-button="Sí"
      cancel-button
      text-button-cancel="No"
      @handleAccept="liberarRad"
      label="Confirmar"
      @close-modal="() => (modalLiberarRadicado = false)"
    />
    <ConfirmModal
      text-cancel-modal="NO"
      text-confirm-modal="SI"
      persistent
      text-show-modal="¿Está seguro de dar el visto bueno a la respuesta proyectada?"
      @update:show-modal="cancelarAprobacionRevision"
      @confirm-modal="
        validarRol([Roles.APROBADOR])
          ? beforeAprobacion()
          : aprobarRevisionRadicado()
      "
      :show-modal="showModalAprobarRadicado"
    />
    <!--    (showModalAprobacionRadicado = true, showModalAprobarRadicado = false, currentTab = allNameTabs.DocumentoDeSalida)-->
    <ConfirmModal
      text-cancel-modal="Descargar"
      text-confirm-modal="Finalizar"
      persistent
      :text-show-modal="dataAprobacionAprobador.mensaje.replace(/-/g, '')"
      @update:show-modal="descargaPdf"
      @confirm-modal="cancelarAprobacion"
      :show-modal="showModalExitoAprobacionRadicado"
    />

    <Modal
      v-if="currentTab === allNameTabs.NuevoDocumentoSalida"
      v-model="modalNuevoDoc"
      title="Confirmación"
      cancelButton
      @handleAccept="nuevoDocumento"
      @closeModal="() => (currentTab = allNameTabs.InformacionGeneral)"
      textButtonCancel="Cancelar"
      text-button="Aceptar"
      text="¿Desea crear un nuevo documento de salida?"
      type="button"
    />

    <Modal
      v-model="modalSegundaDevolucion"
      :is-success="false"
      @handleAccept="closeModal"
      textButton="Aceptar"
      text="El documento ha cumplido dos devoluciones, gestionar publicación en Página WEB"
      type="button"
      :title="undefined"
    />

    <q-dialog v-model="showModalAprobacionRadicado">
      <q-card :class="['tw-px-3', 'tw-p-9 tw-w-[980px]']">
        <q-form greedy ref="firmaForm">
          <q-card-section
            class="text-h6 tw-max-w-sm text-center text-weight-bold"
          >
            Cargar firma
          </q-card-section>
          <q-card-section class="tw-max-w-sm">
            Adjuntar firma *
            <FileLoader2
              :max-file-size="2 * 1024 * 1024"
              max-file-size-label="2"
              v-model:model-value="firmaAprobador"
              :max-files="1"
              accept-file="png, jpg, jpeg, webp"
              @rejected="rejectedTypesAprob"
              :rules="[inputRequired]"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              label="Cancelar"
              color="accent"
              text-color="black"
              class="tw-p-3"
              style="
                width: 250px;
                height: 45px;
                border-radius: 8px;
                font-size: 18px;
              "
              @click="showModalAprobacionRadicado = false"
            />
            <q-btn
              label="Aprobar"
              style="
                width: 250px;
                height: 45px;
                border-radius: 8px;
                font-size: 18px;
              "
              text-color="white"
              color="secondary"
              class="tw-rounded-xl tw-p-3"
              @click=""
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  inputRequired,
  maxLengthInput,
  minLengthInputCustom,
} from "src/helpers/validations";
import { dataMapping, informacionGeneralEmptyDefault } from "./utils";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { computed, onMounted, reactive, ref } from "vue";
import { Roles } from "src/pages/EntesDeControl/types";
import { ESTADOS } from "src/assets/estados/estados";
import { useAuthStore } from "src/stores/auth.store";
import { useRoute, useRouter } from "vue-router";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";
import RechazarModalEntes from "src/components/Modal/RechazarModalEntes.vue";
import DocumentosRelacionados from "./DocumentosRelacionados/DocumentosRelacionados.vue";
import ExcluirGestionadores from "./ExcluirGestionadores/excluirGestionadores.vue";
import DatosSalidaGestionador from "./DatosSalida/DatosSalidaGestionador.vue";
import InformacionGeneral from "./InformacionGeneral/InformacionGeneral.vue";
import AdjuntarDocumentos from "./AdjuntarDocumentos/AdjuntarDocumentos.vue";
import IncluirExpediente from "./IncluirExpedientes/IncluirExpediente.vue";
import AdjuntosClonación from "./AdjuntosClonación/AdjuntosClonación.vue";
import MetadatosGestionador from "./MetaDatos/MetadatosGestionador.vue";
import ReasignarGestionador from "./Reasignar/ReasignarGestionador.vue";
import EnviarAprobacion from "./EnviarAprobacion/EnviarAprobacion.vue";
import EnviarRevision from "./EnviarAprobacion/EnviarRevision.vue";
import FileLoader2 from "src/components/FormFields/FileLoader.vue";
import ConfirmModal from "src/components/Modal/ConfirmModal.vue";
import Reclasificar from "./Reclasificar/Reclasificar.vue";
import Trazabilidad from "./Trazabilidad/Trazabilidad.vue";
import Comentarios from "./Comentarios/Comentarios.vue";
import Solictudes from "./Solicitudes/solicitudes.vue";
import Modal from "src/components/Modal/Modal.vue";
import MetaDatos from "./MetaDatos/Metadatos.vue";
import Asignar from "./Asignar/Asignar.vue";
import ReasignarOficina from "src/shared/components/ReasignarOficina/reasignacion.vue";
import Editor from "components/Editor/editor.vue";
import TrazabilidadDocumento from "src/pages/MedicinaLaboral/TrazabilidadDocumento/TrazabilidadDocumento.vue";
import EnviarPublicacion from "components/Devolucion/EnviarPublicacion.vue";
import EnviarPorCorrespondencia from "components/Devolucion/EnviarCorrespondencia.vue";
import EnviarPorCorreo from "components/Devolucion/EnviarCorreo.vue";
import AdjuntarDocsComunicaciones from "pages/Correspondencia/Crear/views/AdjuntarDocs.vue";
import { crearTrazabilidadDocumento } from "src/helpers/trazabilidadDocumento";

interface DocumentFooter {
  anexos: string;
  asunto: string;
  copia: string;
  elaboro: string;
  formaEnvio: string;
  aprobo: string;
  reviso: string;
  firmaAprobador: string;
  cargoAprobador: string;
  dependenciaAprobador: string;
}

interface DocumentHeader {
  NombredeDestinatario: string;
  TipoDeDocumentoDestinatario: string;
  DireccionDeDestinatario: string;
  TelefonoDeDestinatario: string;
  DepartamentoYMunicipioDestinatario: string;
  CorreoDestinatario: string;
  Firma: string;
  asunto: string;
}

const { getUserInfo } = useAuthStore();
const auth = useAuthStore();
const router = useRouter();
const isPorAprobarPorRevisar = computed(() => {
  return (
    ["por revisar", "por aprobar", "aprobado"].includes(
      status.value.toLowerCase()
    ) && validarRol([Roles.GESTIONADOR])
  );
});
const route = useRoute();
const informacionGeneral = ref<any>(informacionGeneralEmptyDefault);
const datosSalida = ref<any>({});
const ente_id = ref(String(route.params.id));
const tabs = ref([]);
const imgBase64 = ref();
const dataClonado = ref();
const firmaAprobador = ref(null);
const userInfo = ref(null);
const rol = ref(null);
const isCloned = ref(false);
const isConsolidator = ref(false);
const observacionesClonacionRechazar = ref("");
const currentTab = ref("InformacionGeneral");
const observacionesRechazar = ref("");
const observacionesReinicio = reactive({ value: "", ref: null });
const nroRadicado = ref("");
const status = ref("");
const documentoFile = ref("");
const formRechazarClone = ref();
const dinamicSentence = ref();
const formRechazar = ref();
const metadatos = ref();
const firmaForm = ref();
const htmlContent = ref("");
const showModalExitoAprobacionRadicado = ref(false);
const showModalRechazarRadicadoClonado = ref(false);
const showModalAprobacionRadicado = ref(false);
const showModalRechazarRadicado = ref(false);
const showModalRechazarRadicadoAprobacion = ref(false);
const showModalReiniciarGestion = ref(false);
const showModalAprobarRadicado = ref(false);
const showModalTerminarEdicion = ref(false);
const modalLiberarRadicado = ref(false);
const isGestionIniciada = ref(false);
const isAprobacion = ref(false);
const finalModal = ref(false);
const aprobado = ref(false);
const modalNuevoDoc = ref(true);
const modalSegundaDevolucion = ref(false);
const dataFooter = ref<DocumentFooter>();
const referentKey = ref<DocumentHeader>();
const dataAprobacionAprobador = ref({ nodeId: "", mensaje: "" });
const selectedSignature = ref();
const aprobador = ref();
const formReinicioGestion = ref();
const parrafoText = ref("");
const formasEnvio = [
  { id: 1, nombre: "Correo electrónico" },
  { id: 2, nombre: "Correo electrónico certificado" },
  { id: 3, nombre: "Courier" },
  { id: 4, nombre: "Mensajería" },
  { id: 5, nombre: "Personal" },
  { id: 6, nombre: "Mensajero" },
];

let trazabilidadRegistrada = false;

const IsModalReiniciarGestion = computed(
  () =>
    showModalReiniciarGestion.value &&
    currentTab.value == allNameTabs.ReinicioDeLaGestion
);
const isConsolidador = computed(
  () =>
    validarRol([Roles.GESTIONADOR]) &&
    informacionGeneral.value.consolidadorId === userInfo.value.userid &&
    informacionGeneral.value.clonado
);
const isConsolidadorTwo = computed(
  () =>
    validarRol([Roles.GESTIONADOR]) &&
    informacionGeneral.value.consolidadorId === userInfo.value.userid
);

const showBotonRechazar = computed(() => {
  return (
    (["para gestión"].includes(status.value.toLowerCase()) &&
      validarRol([Roles.GESTIONADOR]) &&
      !isGestionIniciada.value) ||
    (["por revisar"].includes(status.value.toLowerCase()) &&
      validarRol([Roles.REVISOR]))
  );
});

const showBotonRechazarAprobacion = computed(() => {
  return (
    ["por aprobar"].includes(status.value.toLowerCase()) &&
    validarRol([Roles.APROBADOR])
  );
});

// funcion de clonar
const showBotonRechazarClonado = computed(() => {
  return (
    ["gestión clonada"].includes(status.value.toLowerCase()) &&
    validarRol([Roles.GESTIONADOR]) &&
    informacionGeneral.value.clonado &&
    !isConsolidador.value
  );
});

const showBotonTerminarEdicion = computed(() => {
  return (
    ["clonación en edición"].includes(status.value.toLowerCase()) &&
    informacionGeneral.value.clonado &&
    validarRol([Roles.GESTIONADOR]) &&
    !isConsolidador.value
  );
});

const showBotonAprobar = computed(() => {
  return (
    ["por revisar", "por aprobar"].includes(status.value.toLowerCase()) &&
    validarRol([Roles.REVISOR, Roles.APROBADOR])
  );
});

const allNameTabs = {
  InformacionGeneral: "InformacionGeneral",
  AdjuntarDocumentos: "AdjuntarDocumentos",
  Reclasificar: "Reclasificar",
  Trazabilidad: "Trazabilidad",
  TrazabilidadDocumento: "TrazabilidadDocumento",
  MetaDatos: "MetaDatos",
  Reasignar: "Reasignar",
  Asignar: "Asignar",
  //Gestionador
  MetaDatosGestionador: "MetaDatosGestionador",
  ReasignarGestionador: "ReasignarGestionador",
  IncluirExpediente: "IncluirExpediente",
  IniciarGestion: "IniciarGestion",
  Comentarios: "Comentarios",
  //Gestionador Iniciar Gestion
  DocumentosRelacionados: "DocumentosRelacionados",
  ReinicioDeLaGestion: "ReinicioDeLaGestion",
  DocumentoDeSalida: "DocumentoDeSalida",
  EnviarAprobacion: "EnviarAprobacion",
  EnviarARevision: "EnviarARevision",
  DatosDeSalida: "DatosDeSalida",
  Solictudes: "Solicitudes",
  ExcluirGestionadores: "ExcluirGestionadores",
  AdjuntosClonación: "AdjuntosClonación",
  //MetadatosDinamicos
  MetadatosDinamic: "MetadatosDinamic",
  //Devolución
  EnviarPorCorrespondencia: "EnviarPorCorrespondencia",
  EnviarPorCorreo: "EnviarPorCorreo",
  NuevoDocumentoSalida: "NuevoDocumentoSalida",
  EnviarAPublicacion: "EnviarAPublicacion",
  AdjuntarDocumento: "AdjuntarDocumento",
};

const nuevoDocumento = async () => {
  await reiniciarGestionNuevoDoc().then(async () => {
    // Recargar los servicios y también los tabs
    await getInformacionGeneral();
    await getDatosSalida();
    await getData();
  });
};

const reiniciarGestionNuevoDoc = async () => {
  try {
    const response = await sgdeaAxios.patch(
      `/api/entes/reiniciarGestion/${informacionGeneral.value.asignaciones[0].id}`,
      {
        motivo: "Nuevo Documento de Salida",
      }
    );
    if (response.status === 200) {
      toast.success("Se ha reiniciado la gestión correctamente");
    }
  } catch (error) {
    toast.error("Hubo un error al reiniciar la gestión");
  } finally {
    currentTab.value = allNameTabs.InformacionGeneral;
  }
};

const getFormaEnvioNombre = (formaEnvioId) => {
  const formaEnvio = formasEnvio.find((item) => item.id === formaEnvioId);
  return formaEnvio ? formaEnvio.nombre : "";
};

const changeTab = async (tab: string) => {
  if (tab === allNameTabs.IniciarGestion) {
    iniciarGestionTabs();
  }
  if (tab === allNameTabs.EnviarAprobacion) {
    isAprobacion.value = true;
  }
  if (tab === allNameTabs.EnviarARevision) {
    isAprobacion.value = false;
  }
  currentTab.value = tab;
};

function goToFirstTab() {
  currentTab.value = tabs.value[0].label;
  setTimeout(() => {
    currentTab.value = allNameTabs.InformacionGeneral;
  }, 100);
}

const getTabs = async () => {
  let tabs = [];

  tabs = [
    {
      label: "Información General",
      name: allNameTabs.InformacionGeneral,
      icon: "info",
    },
  ];

  if (rol?.value.toLowerCase().includes("asignador")) {
    tabs.push(
      {
        label: "Trazabilidad",
        name: allNameTabs.Trazabilidad,
        icon: "history",
      },
      {
        label: "Metadatos",
        name: allNameTabs.MetaDatos,
        icon: "folder_open",
      },
      {
        label: "Asignar",
        name: allNameTabs.Asignar,
        icon: "assignment_turned_in",
      },
      {
        label: "Reasignar",
        name: allNameTabs.Reasignar,
        icon: "move_up",
      },
      {
        label: "Reclasificar",
        name: allNameTabs.Reclasificar,
        icon: "shuffle",
      },
      {
        label: "Adjuntar Documento",
        name: allNameTabs.AdjuntarDocumentos,
        icon: "folder_open",
      },
      {
        label: "Comentarios",
        name: allNameTabs.Comentarios,
        icon: "forum",
      }
    );
  }

  if (rol?.value.toLowerCase().includes("gestionador")) {
    tabs.push(
      {
        label: "Iniciar Gestión",
        name: allNameTabs.IniciarGestion,
        icon: "play_arrow",
      },
      {
        label: "Trazabilidad",
        name: allNameTabs.Trazabilidad,
        icon: "history",
      },
      {
        label: "Comentarios",
        name: allNameTabs.Comentarios,
        icon: "forum",
      },
      {
        label: "Incluir a Expediente",
        name: allNameTabs.IncluirExpediente,
        icon: "folder_open",
      },
      {
        label: "Reasignar",
        name: allNameTabs.ReasignarGestionador,
        icon: "move_up",
      }
    );
  }

  if (validarRol([Roles.REVISOR, Roles.APROBADOR])) {
    tabs.push(
      {
        label: "Documentos Relacionados",
        name: allNameTabs.DocumentosRelacionados,
        icon: "folder_open",
      },
      {
        label: "Documento de Salida",
        name: allNameTabs.DocumentoDeSalida,
        icon: "drive_file_move",
      },
      {
        label: "Trazabilidad",
        name: allNameTabs.Trazabilidad,
        icon: "history",
      },
      {
        label: "Trazabilidad de Documento",
        name: allNameTabs.TrazabilidadDocumento,
        icon: "drive_file_move",
      },
      {
        label: "Comentarios",
        name: allNameTabs.Comentarios,
        icon: "forum",
      }
    );
  }

  return tabs;
};

const iniciarGestionTabs = () => {
  const asignacion = informacionGeneral.value.asignaciones.find(
    (asignacion) => asignacion.idGestionador === auth.userInfo.userid
  );
  sgdeaAxios
    .patch(`/api/entes/iniciarGestion/${asignacion.idAsignacion}`)
    .then((res) => {
      if (res) {
        newTrazabilidad("iniciado");
        toast.success("Gestión iniciada correctamente");
        isGestionIniciada.value = true;
        status.value = informacionGeneral.value.clonado
          ? "Clonación en edición"
          : "En edición";
        if (informacionGeneral.value.clonado && !isConsolidador.value) {
          gestionEdictaTabs();
        } else {
          gestionIniciadaTabs();
        }

        changeTab(allNameTabs.InformacionGeneral);
      }
    })
    .catch((error) => {
      toast.error("Error al iniciar la gestión");
    });
};

const gestionEdictaTabs = () => {
  tabs.value = [
    {
      label: "Información General",
      name: allNameTabs.InformacionGeneral,
      icon: "info",
    },
    {
      label: "Documentos Relacionados",
      name: allNameTabs.DocumentosRelacionados,
      icon: "folder_open",
    },
    {
      label: "Documento de Salida",
      name: allNameTabs.DocumentoDeSalida,
      icon: "drive_file_move",
    },
    {
      label: "Adjuntar Documentos",
      name: allNameTabs.AdjuntarDocumentos,
      icon: "attach_file",
    },
    {
      label: "Reinicio de la Gestión",
      name: allNameTabs.ReinicioDeLaGestion,
      icon: "folder_open",
    },
    {
      label: "Trazabilidad",
      name: allNameTabs.Trazabilidad,
      icon: "history",
    },
    {
      label: "Comentarios",
      name: allNameTabs.Comentarios,
      icon: "forum",
    },
  ];
};

const gestionClonadosTabs = () => {
  tabs.value = [
    {
      label: "Información General",
      name: allNameTabs.InformacionGeneral,
      icon: "info",
    },
    {
      label: "Iniciar Gestión",
      name: allNameTabs.IniciarGestion,
      icon: "play_arrow",
    },
    {
      label: "Trazabilidad",
      name: allNameTabs.Trazabilidad,
      icon: "history",
    },
    {
      label: "Comentarios",
      name: allNameTabs.Comentarios,
      icon: "forum",
    },
  ];

  if (isConsolidador.value) {
    tabs.value.push(
      {
        label: "Incluir a Expediente",
        name: allNameTabs.IncluirExpediente,
        icon: "folder_open",
      },
      {
        label: "Reasignar",
        name: allNameTabs.ReasignarGestionador,
        icon: "move_up",
      }
    );
  }
};

const gestionIniciadaTabs = () => {
  tabs.value = [
    {
      label: "Información General",
      name: allNameTabs.InformacionGeneral,
      icon: "info",
    },
    {
      label: "Documentos Relacionados",
      name: allNameTabs.DocumentosRelacionados,
      icon: "folder_open",
    },
    {
      label: "Metadatos",
      name: allNameTabs.MetaDatosGestionador,
      icon: "folder_open",
    },
    {
      label: "Datos de Salida",
      name: allNameTabs.DatosDeSalida,
      icon: "send",
    },
    {
      label: "Documento de Salida",
      name: allNameTabs.DocumentoDeSalida,
      icon: "drive_file_move",
    },
    {
      label: "Adjuntar Documentos",
      name: allNameTabs.AdjuntarDocumentos,
      icon: "attach_file",
    },
    {
      label: "Incluir a Expediente",
      name: allNameTabs.IncluirExpediente,
      icon: "description",
    },
    {
      label: "Enviar a Revisión",
      name: allNameTabs.EnviarARevision,
      icon: "rate_review",
    },
    {
      label: "Enviar a Aprobación",
      name: allNameTabs.EnviarAprobacion,
      icon: "task_alt",
    },
    {
      label: "Reasignar",
      name: allNameTabs.ReasignarGestionador,
      icon: "move_up",
    },
    {
      label: "Trazabilidad",
      name: allNameTabs.Trazabilidad,
      icon: "history",
    },
    {
      label: "Comentarios",
      name: allNameTabs.Comentarios,
      icon: "forum",
    },
    {
      label: "Reinicio de la Gestión",
      name: allNameTabs.ReinicioDeLaGestion,
      icon: "folder_open",
    },
  ];

  if (isConsolidador.value) {
    tabs.value.push(
      {
        label: "Exclusión",
        name: allNameTabs.ExcluirGestionadores,
        icon: "arrow_right_alt",
      },
      {
        label: "Adjuntos de la Clonación",
        name: allNameTabs.AdjuntosClonación,
        icon: "attach_file",
      },
      {
        label: "Ver Solicitudes",
        name: allNameTabs.Solictudes,
        icon: "visibility",
      },
      {
        label: "Trazabilidad de Documento",
        name: "",
        icon: "description",
      }
    );
  }
};

const gestionPorAprobarYPorRevisarTabs = () => {
  tabs.value = [
    {
      label: "Información General",
      name: allNameTabs.InformacionGeneral,
      icon: "info",
    },
    {
      label: "Documentos Relacionados",
      name: allNameTabs.DocumentosRelacionados,
      icon: "folder_open",
    },
    {
      label: "Metadatos",
      name: allNameTabs.MetaDatosGestionador,
      icon: "folder_open",
    },
    {
      label: "Datos de Salida",
      name: allNameTabs.DatosDeSalida,
      icon: "send",
    },
    {
      label: "Documento de Salida",
      name: allNameTabs.DocumentoDeSalida,
      icon: "drive_file_move",
    },
    {
      label: "Incluir a Expediente",
      name: allNameTabs.IncluirExpediente,
      icon: "description",
    },
    {
      label: "Trazabilidad",
      name: allNameTabs.Trazabilidad,
      icon: "history",
    },
    {
      label: "Ver Solicitudes",
      name: allNameTabs.Solictudes,
      icon: "visibility",
    },
  ];
};

const gestionDevolucionTabs = () => {
  if (
    informacionGeneral.value?.numeroDevoluciones &&
    informacionGeneral.value.numeroDevoluciones > 1
  ) {
    modalSegundaDevolucion.value = true;
    tabs.value = [
      {
        label: "Información General",
        name: allNameTabs.InformacionGeneral,
        icon: "info",
      },
      {
        label: "Enviar a Publicación",
        name: allNameTabs.EnviarAPublicacion,
        icon: "send",
      },
      {
        label: "Adjuntar Documento",
        icon: "feed",
      },
      {
        label: "Trazabilidad",
        name: allNameTabs.Trazabilidad,
        icon: "history",
      },
      {
        label: "Documentos Relacionados",
        name: allNameTabs.DocumentosRelacionados,
        icon: "folder_open",
      },
    ];
  } else {
    tabs.value = [
      {
        label: "Información General",
        name: allNameTabs.InformacionGeneral,
        icon: "info",
      },
      {
        label: "Enviar por Correspondencia",
        name: allNameTabs.EnviarPorCorrespondencia,
        icon: "send",
      },
      {
        label: "Enviar por Correo",
        name: allNameTabs.EnviarPorCorreo,
        icon: "send",
      },
      {
        label: "Nuevo Documento de Salida",
        name: allNameTabs.NuevoDocumentoSalida,
        icon: "post_add",
      },
      {
        label: "Trazabilidad",
        name: allNameTabs.Trazabilidad,
        icon: "history",
      },
      {
        label: "Documentos Relacionados",
        name: allNameTabs.DocumentosRelacionados,
        icon: "folder_open",
      },
    ];
  }
};

const getInformacionGeneral = async () => {
  try {
    const response = await sgdeaAxios.get(
      `/api/entes/obtenerEnteControl/${ente_id.value}`
    );
    if (response.status === 200) {
      const { data } = response;
      informacionGeneral.value = dataMapping(data);
      const asignacion = informacionGeneral.value.asignaciones.find(
        (asignacion) => asignacion.idGestionador === auth.userInfo.userid
      );
      nroRadicado.value = informacionGeneral.value?.nroRadicado;
      status.value =
        informacionGeneral.value.clonado && auth.userInfo.role === "Gestionador"
          ? asignacion.estado
          : informacionGeneral.value.estado.estado;
    }
  } catch (error) {
    console.error("Error", error);
  }
};

const getDatosSalida = async () => {
  try {
    const response = await sgdeaAxios.get(
      `api/entes/obtener-datos-salida/${informacionGeneral.value.id}`
    );
    datosSalida.value = response.data;
  } catch (error) {
    toast.error("Hubo un error al obtener los datos de salida");
  }
};

const getPlantillaSinPrefijo = async () => {
  const nodeId = process.env.NODE_SIN_PREFIJO;

  const response = await sgdeaAxios.get<any>(
    `/radicados/consultar_documento/${nodeId}`
  );

  return response.data;
};

const getClonados = async () => {
  try {
    const response = await sgdeaAxios.get(
      `/api/entes/listadoDocsSalida/${route.params.id}`,
      { showLoader: false }
    );

    dataClonado.value = response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

const validateClonedParagraph = () => {
  const paragraph = dinamicSentence?.value
    ? dinamicSentence.value
        .replace(/<span id="clonado">/g, "")
        .replace(/<\/span>/g, "")
        .replace(/&nbsp;/g, "")
    : "";
  if (!paragraph || paragraph.trim() === "") {
    toast.error("No puedes enviar un párrafo vacío");
  } else {
    showModalTerminarEdicion.value = true;
  }
};

const extractClonedParagraph = (text: string) => {
  if (text) {
    // Capturar sólo los párrafos en etiqueta P e imágenes con etiqueta Figure
    const match = text.match(/<(p|figure)[^>]*?>([\s\S]*?)<\/\1>/g);
    // Ahora se toman solo los párrafos después del Asunto
    const index = match.findIndex((text) => text.includes("Asunto:"));
    const onlyParagraphs =
      match && match.length > index
        ? match.filter((e, i) => i > index).join("")
        : "";
    // Purificar el bloque de texto clonado a enviar
    return `<span id="clonado">${
      match && match.length > index
        ? onlyParagraphs
            .replace(/<br>/g, "")
            .replace(/<p>/, "")
            .replace(/<\/p>/, "")
            .replace(/<span id="clonado">/g, "")
            .replace(/<\/span>/g, "")
        : ""
    }</span>`;
  }
  return "";
};

async function autoSaveDocument({ paragraf, pdf }) {
  try {
    //pdfBlob.value = pdf;
    let docResponseSave;

    parrafoText.value = paragraf;

    if (
      informacionGeneral.value.clonado == true &&
      auth.$state.userInfo.role === "Gestionador" &&
      auth.$state.userInfo.userid !== informacionGeneral.value.consolidadorId
    ) {
      // Extraer solo lo del texto a clonar
      dinamicSentence.value = extractClonedParagraph(paragraf);
      docResponseSave = await sgdeaAxios.post(
        `/api/entes/guardarDocSalida`,
        {
          idDocumentoSalida: 0,
          idEnteControl: informacionGeneral.value.id,
          htmlContent: dinamicSentence.value,
          // fechaEdicion: moment(),
          idUsuario: auth.$state.userInfo.userid,
          rol: auth.$state.userInfo.role,
        },
        { showLoader: false }
      );
    } else {
      docResponseSave = await sgdeaAxios.post(
        `/api/entes/guardarDocSalida`,
        {
          idDocumentoSalida: 0,
          idEnteControl: informacionGeneral.value.id,
          htmlContent: paragraf,
          // fechaEdicion: moment(),
          idUsuario: auth.$state.userInfo.userid,
          rol: auth.$state.userInfo.role,
        },
        { showLoader: false }
      );
    }

    if (docResponseSave.status === 200 || docResponseSave.status === 201) {
      // const userRole = auth.$state.userInfo.role; // Suponiendo que el rol está almacenado en userInfo.role
      // if (userRole === "Gestionador") {
      //   changeGestionador.value = true;
      // } else if (userRole === "Revisor") {
      //   changeRevisor.value = true;
      // } else if (userRole === "Aprobador") {
      //   changeAprobador.value = true;
      // }

      toast.success("Se guardó el documento exitosamente");
      // Crear trazabilidad
      if (!trazabilidadRegistrada) {
        await crearTrazabilidad({
          proceso: `ENTC${informacionGeneral.value.id}`,
          secuencia: informacionGeneral.value.nroRadicado,
          estado: informacionGeneral.value.estado.estado,
          descripcion: `Usuario: ${auth.$state.userInfo.name} Descripción: Se han hecho modificaciones al documento de salida `,
          comentario: "Modificación",
          nombre: auth.$state.userInfo.name,
          accion: `${auth.$state.userInfo.name} ha modificado el documento de salida del caso ${informacionGeneral.value.nroRadicado}`,
          tramite: "Entes de Control",
        });
        trazabilidadRegistrada = true;
      }

      await getData();
    }
  } catch (error) {
    toast.error("Hubo un error al guardar el documento.");
  }
}

const aprobarCasoAprobador = async (data) => {
  aprobado.value = true;
  await aprobacionApro(data);
};

const documentoEntes = ref();
const trazaDocument = ref();
const gettrazabilidadDocumento = async () => {
  if (datosSalida.value) {
    if (documentoEntes.value) {
      try {
        const response = await sgdeaAxios.get(
          `/api/entes/listadoDocsSalida?idDocSalida=${documentoEntes.value}`,
          { showLoader: false }
        );
        trazaDocument.value = response.data;
      } catch {
        toast.error("Ha ocurrido un error al obtener la información");
      }
    }
  }
};

const getParrafo = () => {
  // Elimina solo el header, pero conserva TODO lo demás (etiquetas, imágenes, estilos, etc.)
  const contentWithoutHeader = parrafoText.value
    .replace(/<span[^>]*id=["']header["'][^>]*>[\s\S]*?<\/span>/g, "")
    .trim();

  if (contentWithoutHeader && contentWithoutHeader.length > 0) {
    return `<span id="clonado">${contentWithoutHeader}</span>`;
  }
  return "";
};

const terminarEdicion = async () => {
  try {
    const parrafo = getParrafo();
    const asignacion = informacionGeneral.value.asignaciones.find(
      (asignacion) => asignacion.idGestionador === auth.userInfo.userid
    );

    if (!parrafo) {
      toast.error("El documento de salida no puede estar vacío");
      return;
    }
    // Se guarda el párrafo finalizado
    await onFinal(parrafo, asignacion);

    // Luego se termina la gestión del colaborador, ya no se puede volver a editar
    const response = await sgdeaAxios.patch(
      `/api/entes/clonacion/terminarGestion/${asignacion.idAsignacion}`
    );
    if (response.status === 200) {
      toast.success("Edición del párrafo dinámico finalizada");
      validateVolver();
    }
  } catch (error) {
    toast.error("Error al terminar la edición del párrafo dinámico");
  }
};

const liberarRad = async () => {
  modalLiberarRadicado.value = false;
  try {
    const data = await sgdeaAxios.patch(
      `/api/entes/liberar-radicado-asignador/${ente_id.value}`,
      null,
      { params: { userId: auth.userInfo.userid } }
    );
    toast.success("Radicado liberado correctamente");
    setTimeout(() => {
      router.push("/bandeja");
    }, 2000);
  } catch (error) {
    toast.error("Error al liberar el radicado");
  }
};

const getModalReinicio = async () => {
  if (await formReinicioGestion.value.validate()) {
    const asignacion = informacionGeneral.value.asignaciones.find(
      (asignacion) => asignacion.idGestionador === auth.userInfo.userid
    );
    sgdeaAxios
      .patch(
        `/api/entes/reiniciarGestion?asignacionId=${asignacion.idAsignacion}`,
        {
          motivo: observacionesReinicio.value,
        }
      )
      .then((response) => {
        toast.success("Se reinició la gestión del trámite con éxito");
        newTrazabilidad("reiniciado", observacionesReinicio.value);
        validateVolver();
      })
      .catch((error) => {
        toast.error("Error al reiniciar la gestión del trámite");
      });
  }
};

const rechazarRadicado = async () => {
  const asignador = informacionGeneral.value.asignaciones.find(
    (asignacion) =>
      asignacion.idGestionador === informacionGeneral.value.consolidadorId
  );
  const asignacion = informacionGeneral.value.clonado
    ? asignador.idAsignacion
    : informacionGeneral.value.asignaciones[0].idAsignacion;
  const motivoRechazo = isConsolidador
    ? observacionesClonacionRechazar.value
    : observacionesRechazar.value;
  sgdeaAxios
    .patch(`/api/entes/rechazarGestion/${asignacion}?motivo=${motivoRechazo}`)
    .then((response) => {
      toast.success(
        "Se rechazó la asignación para gestión del trámite con éxito"
      );
      newTrazabilidad("rechazado", motivoRechazo);
      validateVolver();
    })
    .catch((error) => {
      toast.error("Error al rechazar la asignación para gestión del trámite");
    })
    .finally(() => {
      observacionesRechazar.value = "";
      observacionesClonacionRechazar.value = "";
    });
  showModalRechazarRadicado.value = false;
  tabs.value = await getTabs();
};

const rechazarGestionadorClonado = async () => {
  const asignacion = informacionGeneral.value.asignaciones.find(
    (asignacion) => asignacion.idGestionador === auth.userInfo.userid
  );
  sgdeaAxios
    .patch(`/api/entes/clonacion/rechazarGestion/${asignacion.idAsignacion}`, {
      motivo_rechazo: observacionesClonacionRechazar.value,
    })
    .then((response) => {
      if (response.status === 200) {
        toast.success("Se rechazó la clonación del trámite con éxito");
        newTrazabilidad("rechazado", observacionesClonacionRechazar.value);
        validateVolver();
      }
    })
    .catch((error) => {
      toast.error("Error al rechazar la clonación del trámite ");
    })
    .finally(() => (observacionesClonacionRechazar.value = ""));
  showModalRechazarRadicadoClonado.value = false;
  tabs.value = await getTabs();
};

const rechazarRevisionRadicado = async () => {
  sgdeaAxios
    .patch(
      `/api/entes/rechazarRevision/${ente_id.value}?motivo=${observacionesRechazar.value}`
    )
    .then((response) => {
      if (response.status === 200) {
        toast.success("Se realizó el rechazo del radicado de manera exitosa");
        newTrazabilidad("rechazado", observacionesRechazar.value);
        validateVolver();
      }
    })
    .catch((error) => {
      toast.error("Error al rechazar el radicado");
    })
    .finally(() => (observacionesRechazar.value = ""));
  showModalRechazarRadicado.value = false;
  tabs.value = await getTabs();
};

const rechazarAprobacionRadicado = async () => {
  const asignador = informacionGeneral.value.asignaciones.find(
    (asignacion) =>
      asignacion.idGestionador === informacionGeneral.value.consolidadorId
  );

  const asignacion = informacionGeneral.value.clonado
    ? asignador.idAsignacion
    : informacionGeneral.value.asignaciones[0].idAsignacion;
  sgdeaAxios
    .patch(
      `/api/entes/rechazarAprobacion/${asignacion}?motivo=${observacionesRechazar.value?.value ?? observacionesRechazar.value}`
    )
    .then((response) => {
      if (response.status === 200) {
        toast.success("Se realizó el rechazo del radicado de manera exitosa");
        newTrazabilidad("rechazado", observacionesRechazar.value?.value ?? observacionesRechazar.value);
        validateVolver();
      }
    })
    .catch((error) => {
      toast.error("Error al rechazar el radicado");
    })
    .finally(() => (observacionesRechazar.value = ""));
  showModalRechazarRadicado.value = false;
  tabs.value = await getTabs();
};

const validateVolver = () => {
  router.push("/bandeja");
  // if (rol.value.toLowerCase().includes("asignador")) {
  //   modalLiberarRadicado.value = true;
  // } else {
  // router.push("/bandeja");
  // }
};

const successIncluirExpediente = (nodeId: string) => {
  if (nodeId) {
    getInformacionGeneral();
    getDatosSalida();
    getData();
  }
};

const newTrazabilidad = async (status: string, comentario = "") => {
  await crearTrazabilidad({
    proceso: `ENTC${informacionGeneral.value.id}`,
    secuencia: informacionGeneral.value.nroRadicado,
    estado: "En edición",
    descripcion: `Usuario: ${auth.$state.userInfo.name}, Ha rechazado la clonación Motivo:${comentario}`,
    comentario: comentario,
    nombre: useAuthStore().$state.userInfo.name,
    accion: `${useAuthStore().$state.userInfo.name} Ha rechazado la clonación`,
    tramite: "Entes de Control",
  });
};

const cancelarAprobacionRevision = () => {
  showModalAprobacionRadicado.value = false;
  showModalAprobarRadicado.value = false;
  changeTab("InformacionGeneral");
};

const cancelModalRechazarRadicadoClonado = () => {
  showModalRechazarRadicadoClonado.value = false;
  observacionesClonacionRechazar.value = "";
};

const CancelModalRechazarRadicado = () => {
  showModalRechazarRadicado.value = false;
  showModalRechazarRadicadoAprobacion.value = false;
  observacionesRechazar.value = "";
  changeTab("InformacionGeneral");
};

const CancelModalReiniciarGestion = () => {
  showModalReiniciarGestion.value = false;
  changeTab("InformacionGeneral");
};

const cancelarAprobacion = () => {
  validateVolver();
};

const aprobarRevisionRadicado = async () => {
  const asignador = informacionGeneral.value.asignaciones.find(
    (asignacion) =>
      asignacion.idGestionador === informacionGeneral.value.consolidadorId
  );
  const asignacion = informacionGeneral.value.clonado
    ? asignador.idAsignacion
    : informacionGeneral.value.asignaciones[0].idAsignacion;
  sgdeaAxios
    .post(
      `/api/entes/aprobacionRevision?enteId=${informacionGeneral.value.id}&asignacionId=${asignacion}`
    )
    .then((response) => {
      toast.success("La respuesta proyectada tiene su visto bueno");
      newTrazabilidad("aprobado");
      crearTrazabilidadDocumento(
        {
          htmlContent: htmlContent.value,
          usuario: auth.userInfo.name,
          rol: auth.userInfo.role,
        },
        documentoEntes.value,
        "ML"
      );
      validateVolver();
    })
    .catch((error) => {
      toast.error("Error al dar el visto bueno a la respuesta proyectada");
    });
  showModalAprobarRadicado.value = false;
  tabs.value = await getTabs();
};

const validarRol = (roles: string[]) => {
  return roles.includes(rol.value?.toLowerCase());
};

const rechazarGestorClonado = async () => {
  if (await formRechazarClone.value.validate()) {
    if (isConsolidador.value) rechazarRadicado();
    return rechazarGestionadorClonado();
  } else {
    toast.error(
      "Para continuar, asegúrese de que todos los campos requeridos estén completos"
    );
  }
};

const rechazar = async (text) => {
  if (text && text !== "") {
    // await formRechazar.value.validate()
    observacionesRechazar.value = text;

    if (validarRol([Roles.REVISOR])) return rechazarRevisionRadicado();
    if (validarRol([Roles.APROBADOR])) return rechazarAprobacionRadicado();
    await rechazarRadicado();
    showModalRechazarRadicadoAprobacion.value = false;
  } else {
    toast.error(
      "Para continuar, asegúrese de que todos los campos requeridos estén completos"
    );
  }
};

const descargaPdf = async () => {
  try {
    const { data } = await sgdeaAxios.get(
      `/radicados/consultar_documento/${dataAprobacionAprobador.value.nodeId}`
    );

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
    link.setAttribute("download", data.name.replace(/-/g, ""));

    link.click();

    URL.revokeObjectURL(blobUrl);

    validateVolver();
  } catch (error) {
    toast.error("Ocurrió un error inesperado.");
  }
};

const rejectedTypesAprob = (fileEntries) => {
  if (!fileEntries.length) {
    return;
  }

  if (fileEntries[0]?.file.size >= 50 * 1024 * 1024) {
    toast.error("El peso máximo permitido es de 50MB");
  } else {
    const allowedFileTypes = [
      "pdf",
      "png",
      "jpg",
      "txt",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "mp3",
      "mp4",
      "avi",
      "jpeg",
      "webp"
    ];
    const fileTypes = fileEntries.map((entry) =>
      entry.file.name.split(".").pop()
    );
    const invalidFileTypes = fileTypes.filter(
      (type) => !allowedFileTypes.includes(type)
    );

    if (invalidFileTypes.length > 0) {
      toast.error(
        `El formato que está intentando cargar no se encuentra permitido, solo se manejan formatos de tipo png, jpg, jpeg, webp`
      );
    }
  }
};

const beforeAprobacion = async () => {
  // if (await firmaForm.value.validate()) {
  //
  // }
  aprobado.value = true;
};

const aprobacionApro = async (data) => {
  const formData = new FormData();
  const radicadoSalida = await sgdeaAxios.get("/generar/secuencia/SAL");
  // Append file to the form
  formData.append("file", data, `${radicadoSalida.data}.pdf`);
  dataAprobacionAprobador.value = { nodeId: "", mensaje: "" };
  sgdeaAxios
    .patch(
      `/api/entes/aprobacionAprobador/${informacionGeneral.value.id}?aprobadorId=${auth.userInfo.userid}`,
      formData
    )
    .then((response) => {
      dataAprobacionAprobador.value = response.data;
      toast.success("Se ha aprobado la radicación de manera exitosa");
      newTrazabilidad("aprobado");
      crearTrazabilidadDocumento(
        {
          htmlContent: htmlContent.value,
          usuario: auth.userInfo.name,
          rol: auth.userInfo.role,
        },
        documentoEntes.value,
        "ML"
      );
      showModalExitoAprobacionRadicado.value = true;
      showModalAprobacionRadicado.value = false;
    })
    .catch((error) => {
      let errorMessage = "Se produjo un error al procesar la aprobación";

      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    });
};

const onFinal = async (paragraph: string, asignacion: any) => {
  try {
    const response = await sgdeaAxios.post(
      "/api/entes/crear-parrafo-documento-salida",
      {
        parrafo: paragraph,
        asignacion_id: asignacion.idAsignacion,
      }
    );

    if (response.status == 200 || response.status == 201) {
      const dataTrazabilidad = {
        proceso: `ENTC${informacionGeneral.value.id}`,
        secuencia: informacionGeneral.value.nroRadicado,
        estado: informacionGeneral.value.estado.estado,
        descripcion:
          "Se ha enviado el parrafo dinamico de salida del Ente de Control",
        comentario: "Radicado",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} envió su parrafo dinamico para el Ente de Control`,
        tramite: "Entes de Control",
      };
      await crearTrazabilidad(dataTrazabilidad);

      finalModal.value = true;
    }
  } catch (error) {
    toast.error("Error al guardar el pararafo");
  }
};

const getInfoFromUser = async (id: number, isAprobador: boolean) => {
  const response = await sgdeaAxios.get(`/usuarios/${id}`);
  if (response.status === 200) {
    const user = response.data;
    // Obtener firma del Aprobador y su info
    if (isAprobador && user?.firmaPredeterminadaId) {
      aprobador.value = user;
      await getFirma(user.id, user?.firmaPredeterminadaId);
    }
    // Ajustar texto para documento del funcionario gestionador, revisor o aprobador
    return `${user.firstname ? user.firstname.trim().toUpperCase() : ""} ${
      user.lastname ? user.lastname.trim().toUpperCase() : ""
    }
      ${user.cargo?.nombre ? ` - ${user.cargo?.nombre}` : ""}
      ${
        user.usuarioRelaciones?.[0]?.oficina?.dependencia?.nombre
          ? ` - ${user.usuarioRelaciones?.[0]?.oficina?.dependencia?.nombre}`
          : ""
      }
    `;
  }
  return "";
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

onMounted(async () => {
  userInfo.value = await getUserInfo();
  rol.value = userInfo.value?.role || "";
  tabs.value = await getTabs();
  await getInformacionGeneral();
  await getDatosSalida();

  isCloned.value = informacionGeneral.value.clonado;
  isConsolidator.value =
    informacionGeneral.value.clonado &&
    auth.$state.userInfo.userid === informacionGeneral.value.consolidadorId;

  // Tomar datos plantilla documento
  const getPlantilla = await getPlantillaSinPrefijo();
  documentoFile.value = getPlantilla.base64x;

  const usuarioElaboro =
    informacionGeneral.value?.asignaciones &&
    informacionGeneral.value?.asignaciones.length > 0 &&
    informacionGeneral.value?.asignaciones[0]?.idGestionador
      ? await getInfoFromUser(
          informacionGeneral.value?.asignaciones[0].idGestionador,
          false
        )
      : "";

  const infoAprobador =
    informacionGeneral.value?.asignaciones &&
    informacionGeneral.value?.asignaciones.length > 0 &&
    informacionGeneral.value?.asignaciones[0]?.idAprobador
      ? await getInfoFromUser(
          informacionGeneral.value?.asignaciones[0].idAprobador,
          true
        )
      : "";

  const infoRevisor =
    informacionGeneral.value?.asignaciones &&
    informacionGeneral.value?.asignaciones.length > 0 &&
    informacionGeneral.value?.asignaciones[0]?.idRevisor
      ? await getInfoFromUser(
          informacionGeneral.value?.asignaciones[0].idRevisor,
          false
        )
      : "";

  const formaEnvioId = datosSalida.value.destinatario.forma_envio_id; // Suponiendo que esto ya está definido
  const formaEnvioNombre = formaEnvioId
    ? getFormaEnvioNombre(formaEnvioId)
    : "";

  // Tomar datos del header del documento
  referentKey.value = {
    NombredeDestinatario: datosSalida.value?.destinatario?.nombre || "",
    TipoDeDocumentoDestinatario:
      datosSalida.value?.destinatario?.tipo_documento_nombre || "",
    DireccionDeDestinatario: datosSalida.value?.destinatario?.direccion || "",
    TelefonoDeDestinatario:
      datosSalida.value?.destinatario?.numero_celular ?? "",
    DepartamentoYMunicipioDestinatario:
      datosSalida.value?.destinatario?.departamento_nombre &&
      datosSalida.value?.destinatario?.municipio_nombre
        ? `${datosSalida.value?.destinatario?.departamento_nombre} - ${datosSalida.value?.destinatario?.municipio_nombre}`
        : "",
    CorreoDestinatario: datosSalida.value?.destinatario?.correo || "",
    Firma: selectedSignature?.value
      ? selectedSignature?.value?.tipoFirmaUsuario?.nombre === "Grafo"
        ? selectedSignature?.value?.fileData
        : getFormattedName(aprobador.value)
      : "",
    NombreAprobador: selectedSignature?.value
      ? selectedSignature?.value?.tipoFirmaUsuario?.nombre === "Grafo"
        ? getFormattedName(aprobador.value)
        : ""
      : "",
    CargoAprobador: aprobador?.value
      ? aprobador.value?.cargo?.nombre ?? ""
      : "",
    DependenciaAprobador:
      aprobador?.value?.usuarioRelaciones &&
      aprobador?.value.usuarioRelaciones.length > 0
        ? aprobador?.value.usuarioRelaciones[0]?.oficina?.dependencia?.nombre ??
          ""
        : "",
    asunto: datosSalida.value?.asunto || "",
  };

  // Tomar datos del footer del documento
  dataFooter.value = {
    Anexo: datosSalida.value?.anexos || "",
    Copia: datosSalida.value?.usuariosCopia
      ? datosSalida.value?.usuariosCopia.map((item) =>
          item.externo ? formatCopyExterna(item) : formatCopyInterna(item)
        )
      : "",
    DatosGestionador: usuarioElaboro || "",
    DatosAprobador: infoAprobador || "",
    DatosRevisor: infoRevisor || "",
    FormadeEnvio: formaEnvioNombre || "",
  };
  // Traer información documento salida
  await getData();

    if (isCloned.value === true) {
      await getDocList();
    }

  userInfo.value = getUserInfo();
  rol.value = userInfo.value.role;
  tabs.value = await getTabs();
  if (status.value === "Devolucion") {
    gestionDevolucionTabs();
  }
  if (rol.value.toLowerCase().includes("asignador responsable")) {
    await getMetadatos();
  }

  if (
    rol.value.toLowerCase().includes("gestionador") &&
    ["clonación en edición"].includes(status.value.toLowerCase()) &&
    informacionGeneral.value.clonado &&
    !isConsolidador.value
  ) {
    return gestionEdictaTabs();
  }
  if (
    (rol.value.toLowerCase().includes("gestionador") || isConsolidador.value) &&
    [
      "en edición",
      "aprobado",
      "aprobación rechazada",
      "clonación en edición",
    ].includes(status.value.toLowerCase())
  ) {
    return gestionIniciadaTabs();
  }
  if (
    rol.value.toLowerCase().includes("gestionador") &&
    ["por aprobar", "por revisar"].includes(status.value.toLowerCase())
  ) {
    return gestionPorAprobarYPorRevisarTabs();
  }
  if (
    rol.value.toLowerCase().includes("gestionador") &&
    ["gestión clonada"].includes(status.value.toLowerCase())
  ) {
    gestionClonadosTabs();
  }
  gettrazabilidadDocumento();
});

const getFormattedName = (user) => {
  try {
    if (user && user?.firstname) {
      return `${user.firstname.trim().charAt(0).toUpperCase()}. ${
        user.lastname && user.lastname.trim().length > 0
          ? user.lastname.charAt(0).toUpperCase() +
            user.lastname.substring(1).split(" ")[0].toLowerCase()
          : ""
      }`;
    }
    return "";
  } catch (error) {
    console.error("error:", error);
    return "";
  }
};

const getData = async () => {
  if (
    isCloned.value === true &&
    informacionGeneral.value.consolidadorId !== auth.userInfo.userid &&
    auth.userInfo.role === "Gestionador"
  ) {
    await getClonados();
    await getDocFromClonado();
  } else {
    await getDocSalida();

  }
};

const getDocList = async () => {
 try {
   const docResponse = await sgdeaAxios.get(
    `/api/entes/listar-parrafos-documento-salida/${informacionGeneral.value.id}`
  );

  if (docResponse.status === 200) {
    dataClonado.value = docResponse.data.map((paragraph) => {
      return {
        id: paragraph?.id,
        htmlContent: paragraph?.parrafo,
        usuarioCreadorId: paragraph?.gestionador_id,
        nombreUsuarioCreador: `${paragraph?.nombre_gestionador?.trim() || ""} ${
          paragraph?.apellido_gestionador?.trim() || ""
        }`.trim(),
        isProcesadoPorClonado: paragraph?.aceptado || paragraph?.rechazado,
        procesoClonacionTerminado: true,
        moduloActual: "ENTES",
      };
    });
  } else {
    dataClonado.value = [];
  }
 } catch (error) {
  toast.warning("Error al obtener los párrafos del documento clonado");
 }
};

const getDocSalida = async () => {
  const response = await sgdeaAxios.get(
    `/api/entes/listadoDocsSalida/${informacionGeneral.value.id}`,
    { showLoader: false }
  );

  if (response.status === 200) {
    // Filtrar según el rol del usuario
    const userChanges =
      auth.userInfo.role === "Gestionador" ||
      auth.userInfo.role === "Gestionador Consolidador"
        ? response?.data.filter(
            text => text.idUsuario === auth.userInfo.userid
          )
        : response?.data;

    // Buscar el documento marcado como actual (true)
    const actualDocument = userChanges.find(doc => doc.actual === true);

    if (actualDocument) {
      htmlContent.value = actualDocument.htmlContent;
      documentoEntes.value = actualDocument.idDocumentoSalida;
    } else if (userChanges.length > 0) {
      // Si no hay documento marcado como actual, tomar el último como fallback
      htmlContent.value = userChanges[userChanges.length - 1]?.htmlContent;
      documentoEntes.value = userChanges[userChanges.length - 1].idDocumentoSalida;
    }
  } else {
    htmlContent.value = "";
  }
};

const getDocFromClonado = async () => {
  const header = `
        <span id="header" style="text-align: left; font-size: 14px; font-family: Arial, sans-serif;" >
          <p style="margin: 0;">Señor(a):</p>
          <p style="margin: 0;">${
            referentKey.value.NombredeDestinatario ?? ""
          }</p>
          ${
            referentKey.value.DireccionDeDestinatario
              ? `<p style="margin: 0;">Dirección: ${
                  referentKey.value.DireccionDeDestinatario ?? ""
                }</p>`
              : ""
          }
          ${
            referentKey.value.TelefonoDeDestinatario
              ? `<p style="margin: 0;">Telefono: ${
                  referentKey.value.TelefonoDeDestinatario ?? ""
                }</p>`
              : ""
          }
          ${
            referentKey.value.CorreoDestinatario
              ? `<p style="margin: 0;">Correo: ${
                  referentKey.value.CorreoDestinatario ?? ""
                }</p>`
              : ""
          }
  <p style="margin: 0;">${
    referentKey.value.DepartamentoYMunicipioDestinatario ?? ""
  }</p>
  <br />
  <p style="margin: 0;">
     <strong>Asunto: ${referentKey.value.asunto ?? ""}</strong>
  </p>
  <br />
</span>
`;
  const response = await sgdeaAxios.get(
    `/api/entes/listadoDocsSalida/${informacionGeneral.value.id}`,
    { showLoader: false }
  );
  if (response.status === 200) {
    const userChanges = response?.data.filter(
      (text) => text.idUsuario === auth.userInfo.userid
    );
    if (userChanges.length > 0) {
      htmlContent.value =
        header + userChanges[userChanges.length - 1]?.htmlContent;
      dinamicSentence.value =
        userChanges.length > 0
          ? userChanges[userChanges.length - 1].htmlContent
          : "";
      return;
    }
  } else {
    htmlContent.value = header;
  }
};

const getMetadatos = async () => {
  try {
    await sgdeaAxios.get(
      `api/entes/getMetadatosByEnteControlId/${ente_id.value}`
    );
  } catch (error) {
    removeButton(allNameTabs.Asignar);
    removeButton(allNameTabs.Reasignar);
  }
};

function formatCopyInterna(data) {
  return `${data.nombre || ""} - ${data.correo || ""}`;
}

function formatCopyExterna(data) {
  return `${data.nombre || ""} - ${data.correo || ""} - ${
    data.numero_documento || ""
  }}`;
}

const giveMeta = async () => {
  await getMetadatos();
  tabs.value = await getTabs();
};

function removeButton(name) {
  const filteredTabs = tabs.value.filter((item) => item.name !== name);
  tabs.value = filteredTabs;
}

const saveReasignacion = async (event) => {
  try {
    const oficinaFinal = [];
    oficinaFinal.push(event.oficinaId);
    const response = await sgdeaAxios.put(`/oficinas/reasignar`, {
      idFlujo: 7,
      idCaso: informacionGeneral.value.id,
      idOficina: oficinaFinal,
    });
    if (response.status == 200 || response.status == 201) {
      toast.success("El caso se reasigno con éxito");
      await crearTrazabilidad({
        proceso: `ENTC${informacionGeneral.value.id}`,
        secuencia: informacionGeneral.value.nroRadicado,
        estado: informacionGeneral.value.estado.estado,
        descripcion:
          `Usuario:${auth.$state.userInfo.name} ha reasignado la oficina del radicado \n` +
          `Oficina nueva: ${event.oficinaAsignada} \n` +
          `Motivo:${event.motivoAsignacion}`,
        comentario: event.motivoAsignacion,
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} ha reasignado la oficina del radicado ${informacionGeneral.value.nroRadicado}`,
        tramite: "Entes de Control",
      });
      await router.push("/bandeja");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
</script>

<style>
.color-icon .q-icon {
  @apply tw-text-primary;
}
</style>
