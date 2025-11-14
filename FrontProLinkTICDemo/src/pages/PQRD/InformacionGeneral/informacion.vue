<template>
  <div>
    <div class="tw-flex tw-justify-between tw-items-center">
      <div>
        <div class="tw-mt-2">
          <q-btn
            icon="chevron_left"
            label="Volver"
            flat
            class="tw-text-[#ff7500]"
            @click="router.push('/bandeja')"
          />
        </div>
        <p class="pl-4 tw-font-bold tw-text-3xl tw-mb-3 text-bold">
          Radicado
          {{
            data?.refRadicadoSalida ? data?.refRadicadoSalida : data?.idRadicado
          }}
        </p>

        <div
          :class="`tw-inline-block tw-p-1.5 tw-px-4 tw-rounded-lg tw-border ${ESTADOS[state]}`"
        >
          <span class="tw-font-semibold">{{ state }}</span>
        </div>
      </div>
      <div
        class="tw-flex tw-min-h-[36px]"
        v-if="
          labelComponet === 'Documento de salida' &&
          clonadoPqrd &&
          !isConsolidador &&
          auth.userInfo.role.includes('Gestionador')
        "
      >
        <q-btn
          class="tw-w-52"
          label="Terminar Edición"
          color="primary"
          @click="validateClonedParagraph"
        />
      </div>

      <div
        class="tw-flex tw-gap-2 tw-min-h-[36px]"
        v-if="
          labelComponet === 'Documentos Relacionados' && !readOnlyGestionador
        "
      >
        <q-btn
          label="Cambiar tipo de documento"
          color="secondary"
          class="!tw-px-4"
          v-if="
            showChangeDocType &&
            data.asignacionPqrdEntity?.estado.id !== 11 &&
            auth.$state.userInfo.role !== 'Gestionador Escalador'
          "
          @click="modalChangeDocType = true"
        />

        <q-btn
          v-if="
            getUserInfo().role !== 'Aprobador' &&
            data.asignacionPqrdEntity?.estado.id !== 11 &&
            !isDevolucion &&
            auth.$state.userInfo.role !== 'Gestionador Escalador'
          "
          label="Subir un documento"
          color="primary"
          icon="add"
          @click="openModalDocument"
          class="!tw-px-4"
        />
      </div>

      <div
        class="tw-flex tw-justify-end tw-items-center tw-gap-2 tw-min-h-[36px] tw-w-[49%]"
        v-if="
          labelComponet === 'Solicitud escalamiento' && !escalamientoId.aprobado
        "
      >
        <q-btn
          label="Rechazar"
          color="secondary"
          class="tw-w-[125px] tw-h-8"
          @click="rechazarEscala = true"
          :disable="isThirdDayAtFourThirtyPMAfterRadicationDate"
        />
        <q-btn
          label="Gestionar"
          color="primary"
          class="tw-w-[125px] tw-h-8"
          @click="gestionarEscala = true"
        />
      </div>
      <div
        class="tw-flex tw-justify-end tw-items-center tw-gap-2 tw-min-h-[36px] tw-w-[49%]"
        v-if="
          data &&
          data.estado.id == 5 &&
          auth.$state.userInfo.role !== 'Defensor del Consumidor' &&
          labelComponet == 'Información General'
        "
      >
        <q-btn
          label="Rechazar"
          color="secondary"
          class="tw-w-[125px] tw-h-8"
          @click="rechazarRevisionModal = true"
        />
        <q-btn
          label="Visto Bueno"
          color="primary"
          class="tw-w-[125px] tw-h-8"
          @click="vistoBuenoModal = true"
        />
      </div>

      <div
        class="tw-flex tw-justify-end tw-items-center tw-gap-2 tw-min-h-[36px] tw-w-[49%]"
        v-if="
          (labelComponet === 'Documento de salida' ||
            labelComponet === 'Segundo radicado de salida') &&
          !isDevolucion &&
          !readOnlyGestionador &&
          auth.$state.userInfo.role === 'Aprobador'
        "
      >
        <q-btn
          label="Rechazar"
          color="secondary"
          class="tw-w-[125px] tw-h-8"
          @click="rechazarAprobacionModal = true"
        />
        <q-btn
          label="Aprobar"
          color="primary"
          class="tw-w-[125px] tw-h-8"
          @click="showModalConfirmAprobacionAprobador = true"
        />
      </div>

      <div
        class="row tw-gap-3"
        v-if="isDevolucion && labelComponet === 'Documento de salida'"
      >
        <q-btn
          class="tw-w-56 tw-h-10"
          @click="tab = 'vistaInformacionGeneral'"
          label="Cancelar"
        />
        <q-btn class="tw-w-56 tw-h-10" color="secondary" @click="SaveNewDoc">
          Guardar
        </q-btn>
      </div>

      <div
        class="tw-flex tw-gap-2 tw-min-h-[36px]"
        v-if="
          labelComponet !== 'Comentarios' &&
          labelComponet !== 'Documentos relacionados' &&
          labelComponet !== 'Incluir etapa procesal' &&
          labelComponet !== 'Documento de salida' &&
          auth.$state.userInfo.role.toLowerCase() !== 'asignador responsable'
        "
      >
        <q-btn
          v-if="
            (state == 'Para gestión' &&
              !data.asignacionPqrdEntity?.motivoRechazo) ||
            clonadoPqrd
          "
          class="!tw-px-4"
          label="Rechazar"
          color="secondary"
          @click="showModal = true"
          :disable="isThirdDayAtFourThirtyPMAfterRadicationDate"
        />
        <q-btn
          v-if="state == 'Para gestión'"
          class="!tw-px-4"
          label="Gestionar"
          color="primary"
          @click="enableEditGestion()"
        />
      </div>

      <div
        class="tw-flex tw-gap-2 tw-min-h-[36px]"
        v-if="
          data?.canalRadicacion?.id == 5 &&
          labelComponet !== 'Documentos relacionados' &&
          auth.$state.userInfo.role == 'Defensor del Consumidor' &&
          data.estado.id == 5
        "
      >
        <q-btn
          class="!tw-px-4"
          label="Completado"
          color="primary"
          @click="modalRespDefensor = true"
        />
      </div>

      <div
        class="tw-flex tw-gap-2 tw-min-h-[36px]"
        v-if="
          data?.canalRadicacion?.id == 5 &&
          labelComponet == 'Información General' &&
          auth.$state.userInfo.role !== 'Defensor del Consumidor' &&
          data.estado.id == 5
        "
      >
        <q-btn
          class="!tw-px-4"
          label="Rechazar"
          color="secondary"
          @click="showModalRechazarDefensor = true"
        />
        <q-btn
          class="!tw-px-4"
          label="Dar visto bueno"
          color="primary"
          @click="showModalConfrimDefensor = true"
        />
      </div>

      <div
        class="tw-flex tw-gap-2 tw-min-h-[36px] tw-mr-10"
        v-if="
          data?.canalRadicacion?.id == 5 &&
          auth.$state.userInfo.role == 'Defensor del Consumidor' &&
          data.estado.id == 11 &&
          (labelComponet == 'Información General' ||
            labelComponet == 'Documento de salida' ||
            labelComponet == 'Segundo radicado de salida')
        "
      >
        <q-btn
          class="!tw-px-4"
          label="Completado"
          color="primary"
          @click="modalAprobar = true"
        />
      </div>
    </div>

    <q-card
      :key="uiTabsKey"
      class="tw-rounded-xl tw-my-4 tw-mb-4"
      flat
      bordered
    >
      <q-tabs
        v-model="tab"
        inline-label
        no-caps
        outside-arrows
        align="left"
        class="tw-rounded-lg tw-bg-white custom-tabs tw-flex rowsTab-alingCenter"
        indicator-color="transparent"
        active-color="primary"
      >
        <template
          v-if="data?.estado?.estado == 'Devolucion' && !isNewDocCreated"
        >
          <q-tab
            :disable="infoComp?.isEdit"
            :key="tab.label"
            :name="tab.label"
            :ripple="false"
            class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]"
            @click="showComponents(tab.label)"
            v-for="tab in itemsDevolucion"
            :label="tab.label"
            :icon="tab.icon"
          >
          </q-tab>
        </template>

        <template
          v-else-if="data?.estado?.estado == 'Devolucion' && isNewDocCreated"
        >
          <template v-if="!segundaDevolucion">
            <q-tab
              :disable="infoComp?.isEdit"
              :key="tab.label"
              :name="tab.label"
              :ripple="false"
              class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]"
              @click="showComponents(tab.component)"
              v-for="tab in itemsDevolucionIsDoc"
              :label="tab.label"
              :icon="tab.icon"
            >
            </q-tab>
          </template>

          <template v-else>
            <q-tab
              :disable="infoComp?.isEdit"
              :key="tab.label"
              :name="tab.label"
              :ripple="false"
              class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]"
              @click="showComponents(tab.component)"
              v-for="tab in itemsSegundaDevolucion"
              :label="tab.label"
              :icon="tab.icon"
            >
            </q-tab>
          </template>
        </template>

        <template v-else-if="isPublicacion && !isDesfijacion">
          <q-tab
            :disable="infoComp?.isEdit"
            :key="tab.label"
            :name="tab.label"
            :ripple="false"
            class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]"
            @click="showComponents(tab.component)"
            v-for="tab in itemsPorPublicar"
            :label="tab.label"
            :icon="tab.icon"
          >
          </q-tab>
        </template>

        <template v-else-if="escalado === true">
          <q-tab
            :disable="infoComp?.isEdit"
            :key="tab.label"
            :name="tab.label"
            :ripple="false"
            class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]"
            @click="showComponents(tab.component)"
            v-for="tab in itemsIsEscalado"
            :label="tab.label"
            :icon="tab.icon"
          >
          </q-tab>
        </template>

        <template v-else-if="isPublicacion && isDesfijacion">
          <q-tab
            :disable="infoComp?.isEdit"
            :key="tab.label"
            :name="tab.label"
            :ripple="false"
            class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]"
            @click="showComponents(tab.component)"
            v-for="tab in itemsDesfijacion"
            :label="tab.label"
            :icon="tab.icon"
          >
          </q-tab>
        </template>

        <template v-else>
          <q-tab
            :disable="infoComp?.isEdit"
            :key="tab.label"
            :name="tab.label"
            :ripple="false"
            class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]"
            @click="showComponents(tab.label)"
            v-for="tab in items"
            :label="tab.label"
            :icon="tab.icon"
          >
          </q-tab>
        </template>
      </q-tabs>
    </q-card>

    <InformacionGeneral
      ref="infoComp"
      v-if="labelComponet == 'Información General' && !edit"
      :data="data"
      :visualize="getBlobToIframe"
      :metadatos="responseMetadatos"
      class="tw-w-[100%]"
      @successSave="
        auth.userInfo.role == 'Asignador Responsable' ? addButtons() : ''
      "
      @success="initData()"
    />
    <EditarInfo
      v-if="labelComponet === 'Información General' && edit"
      v-model:data="data"
      class="tw-w-[100%]"
    />
    <Trazabilidad v-if="labelComponet === 'Trazabilidad'" />
    <DocumentosRelacionados
      :visualize="getBlobToIframe"
      2
      :only-read-user="readOnlyGestionador"
      :segundaDevolucion="segundaDevolucion"
      :isDevolucion="
        data?.estado?.estado == 'Devolucion' &&
        labelComponet !== 'Documentos Devolucion'
      "
      v-model:detallePqrd="responsePqrd"
      v-show="
        labelComponet === 'Documentos Relacionados' ||
        labelComponet === 'Documentos Devolucion'
      "
      :show-modal="modalDocuments"
      @changeDocType="changeDocType"
      @back-view="labelComponet = 'Información General'"
      v-model:finished="finished"
      @find-docs="getAllRegisters()"
    />
    <Comentarios
      :only-read-user="readOnlyGestionador"
      :pqrdData="data"
      v-if="labelComponet === 'Comentarios'"
      :show-modal="noteModal"
      @closeModal="noteModal = false"
      :key="incrementaKey"
      @update="handleUpdate"
    />
    <IncluirExpediente
      v-if="labelComponet === 'Incluir Expediente'"
      :pqrdData="data"
    />
    <Asignar v-if="labelComponet === 'Asignar'" :pqr-data="data" />

    <ReasignarOficina
      v-if="
        labelComponet === 'Reasignar' &&
        auth.userInfo.role === 'Asignador Responsable'
      "
      :data="data"
      @redirect="showComponents('Información General')"
      @handleAcceptModal="saveReasignacion"
    />

    <Reasignacion
      v-if="
        labelComponet === 'Reasignar' &&
        auth.userInfo.role !== 'Asignador Responsable'
      "
      :pqr-data="data"
      :estado="responsePqrd.estado.id"
    />

    <EtapaProcesal v-if="labelComponet === 'Incluir etapa procesal'" />
    <Modal
      v-model="newDocModal"
      title="Confimarción"
      cancelButton
      @handleAccept="nuevoDocumento()"
      @closeModal="
        (newDocModal = false), (labelComponet = 'Información General')
      "
      textButtonCancel="Cancelar"
      text-button="Aceptar"
      text="¿Desea crear un nuevo documento de salida?"
      type="button"
    />
    <Editor
      v-if="labelComponet === 'Documento de salida'"
      :data="dataFooter"
      :referentKey="referentKey"
      :restric="false"
      :base64="documentoFile"
      :isEditorEmpty="true"
      @datos-response="autoSaveDocument"
      :img-base64="imgBase64"
      :document="htmlContent"
      @aprobado="aprobarCasoAprobador"
      :aprobado="aprobadoDocSal"
      :collaboration="isConsolidador"
      :changesCollaborators="dataClonado"
      :is-cloner="data.clonado"
    />
    <Editor
      v-if="labelComponet === 'Segundo radicado de salida'"
      :data="dataFooter"
      :referentKey="referentKey"
      :restric="false"
      :base64="documentoFile"
      :isEditorEmpty="true"
      @datos-response="autoSaveDocument"
      :img-base64="imgBase64"
      :document="htmlContent"
      @aprobado="aprobarCasoAprobador"
      :aprobado="aprobadoDocSal"
    />

    <GestionEscalamiento
      @now-anulado="labelComponet = 'Información General'"
      :pqr-data="data"
      v-if="labelComponet === 'Gestion de escalamiento'"
      @back-view="labelComponet = 'Información General'"
    />
    <Metadatos
      :pqrdData="data"
      :is-asignador="isAsignador"
      :metadatos="metadatos"
      v-if="labelComponet === 'Metadatos'"
      @successSave="
        auth.userInfo.role == 'Asignador Responsable' ? addButtons() : ''
      "
      @success="initData()"
    />

    <!-- Hu 124 COR -->
    <MetadatosDinamic
      :metadatos="metadatos"
      v-if="labelComponet === 'Metadatos' && isMetadatos"
    />
    <Reasignacion v-if="labelComponet === 'Asignar '" :pqr-data="data" />
    <Escalar
      @volver="
        labelComponet = 'Información General';
        getData();
      "
      @escalado="router.push('/bandeja')"
      v-if="labelComponet === 'Escalar'"
      :pqr-data="data"
    />
    <DatosSalida
      :pqrd-data="data"
      :estado="state"
      v-if="labelComponet === 'Datos de salida'"
    />
    <Reclasificar
      :pqrdData="data"
      v-if="labelComponet === 'Reclasificar Trámite'"
    />
    <EnviarAprobacion
      v-if="labelComponet === 'Enviar a aprobación'"
      :pqr-data="data"
      :pqrd-metadata="responseMetadatos"
      :pqrd-docsalida="responseDocSalida"
      :pqrd-datossalida="responseDatosSalida"
      :is-change-doc="changeGestionador"
    />
    <EnviarRevision
      v-if="
        data?.canalRadicacion?.id !== 5 && labelComponet === 'Enviar a revisión'
      "
      :pqr-data="data"
      :pqrd-metadata="responseMetadatos"
      :pqrd-docsalida="responseDocSalida"
      :pqrd-datossalida="responseDatosSalida"
      :is-change-doc="changeGestionador"
    />
    <EnviarRevisionDefensor
      v-if="
        data?.canalRadicacion?.id == 5 && labelComponet === 'Enviar a revisión'
      "
      :pqr-data="data"
      :pqrd-metadata="responseMetadatos"
      :pqrd-docsalida="responseDocSalida"
      :pqrd-datossalida="responseDatosSalida"
    />
    <SolicitudReclasificar
      :pqrdData="data"
      v-if="labelComponet === 'Solicitud reclasificación'"
    />
    <SolicitudEscalamiento
      :escalamiento-info="escalamientoData"
      :escalamiento-data="escalamientoId"
      :pqrdData="data"
      v-if="labelComponet === 'Solicitud escalamiento'"
    />
    <RespuestaEscalamiento
      @cancelar="labelComponet = 'Información General'"
      :pqrdData="data"
      v-if="labelComponet === 'Respuesta escalamiento'"
    />
    <RechazosClonacion
      :pqrdData="data"
      v-if="labelComponet === 'Rechazos de clonación'"
    />
    <TrazabilidadDocumento
      v-if="labelComponet === 'Trazabilidad de Documento'"
      :ml-data="trazaDocument"
    />
    <EnviarPorCorrespondencia
      v-if="labelComponet === 'Enviar por Correspondencia'"
      @back-view="router.push('/bandeja')"
      :radicado-salida="data.refRadicadoSalida"
      :detalle-radicado="responsePqrd"
    />
    <EnviarPorCorreo
      v-if="labelComponet === 'Enviar por Correo'"
      @back-view="router.push('/bandeja')"
      :type-view="'PQRD'"
      :detalle-radicado="data"
    />
    <!-- <CerrarDevolucion
      v-if="labelComponet === 'Solicitud Cierre de Devolución'"
    /> -->

    <RechazarModal
      @hide-modal="hideModal"
      :show-modal="showModal"
      @update-modal="updateModal"
      text="Escriba aquí su motivo de rechazo."
    />

    <EnviarPublicacion
      :id-caso="data.id"
      :typeFlujoSgda="'PQRD'"
      :detalleRadicado="data"
      pathBandeja="/bandeja"
      v-if="labelComponet === 'Enviar a Publicación'"
      @back-view="labelComponet = 'Información General'"
    />

    <Publicar
      @back-view="labelComponet = 'Información General'"
      v-if="labelComponet === 'Publicar'"
      :type="'pqrd'"
      :detalles-registro="data"
    />

    <RechazarPublicacion
      @back-view="labelComponet = 'Información General'"
      @back-page="router.push('/bandeja')"
      :detalles-registro="data"
      :type="'pqrd'"
      v-if="labelComponet === 'rechazarPublicacion'"
    />

    <ArchivosDesfijacion
      :detalles-registro="data"
      :type="'pqrd'"
      v-if="labelComponet === 'documentoDesfijacion'"
    />

    <CierrePublicacion
      :detallesRegistro="data"
      @reload="getData()"
      v-if="labelComponet === 'cierrePublicacion'"
      :type="'pqrd'"
    />

    <ConfirmModal
      text-cancel-modal="Cancelar"
      text-confirm-modal="Aceptar"
      text-show-modal="¿Está seguro de rechazar el caso?"
      @update:show-modal="() => (showModalConfrim = false)"
      @confirm-modal="confirmModal"
      :show-modal="showModalConfrim"
    />

    <Modal
      v-model="showModalFinal"
      title="¡Espera un momento!"
      :is-success="false"
      @handleAccept="onFinal"
      cancel-button
      textButtonCancel="No"
      textButton="Si"
      text="¿Está seguro de terminar la edición de este párrafo?"
      @close-modal="showModalFinal = false"
      type="button"
    />

    <Modal
      v-model="finalModal"
      title="Exito"
      :is-success="true"
      textButton="Ok"
      text="Edición del párrafo dinámico finalizada"
      type="button"
      @handleAccept="router.push('/bandeja')"
    />

    <CustomModal
      v-model="modalChangeDocType"
      title-button="Guardar"
      left-title-button="Cancelar"
      :title="`Cambiar el tipo de documento de ${
        loadedDocsToChangeType.length
      } ${loadedDocsToChangeType.length > 1 ? 'documentos' : 'documento'}`"
      @close-modal="modalChangeDocType = false"
      @handle-accept="handleChangeDocType"
    >
      <div class="tw-p-4">
        <p class="tw-text-base tw-font-medium tw-mb-1">
          ¿Es un documento de salida?
        </p>
        <q-select
          v-model="esSalida"
          :options="[
            { label: 'Sí', value: true },
            { label: 'No', value: false },
          ]"
          label="Seleccione"
          dense
          outlined
          emit-value
          required
          map-options
        />
      </div>
    </CustomModal>

    <CustomModal
      v-model="completadoModal"
      title-button="Completar"
      left-title-button="Cancelar"
      :title="'Ingrese sus Documentos'"
      @close-modal="modalChangeDocType = false"
      @handle-accept="handleChangeDocType"
    >
      <div class="tw-p-4">
        <p class="tw-text-base tw-font-medium tw-mb-1">Documentos</p>
        <FileLoader
          class="tw-w-full"
          v-model:model-value="files"
          accept-file="pdf"
          :rules="[inputRequired]"
          :max-file-size="100 * 1024 * 1024"
          max-file-size-label="10"
          :max-files="3"
          :multiple="true"
          @rejected="rejectedFiles"
        />
      </div>
    </CustomModal>

    <q-dialog v-model="modalDocuments" persistent>
      <q-card class="tw-p-5 tw-max-w-[500px] tw-w-[500px]">
        <q-card-section class="row tw-p-4">
          <h2 class="tw-text-slate-500 text-center tw-text-2xl">
            Cargar documento
          </h2>
        </q-card-section>
        <q-card-section>
          <p>Cargue sus documentos de respuesta aquí.</p>
        </q-card-section>
        <q-card-section class="column tw-p-4" v-if="!isAsignador">
          <p class="tw-text-label tw-font-semibold">¿Es documento de salida?</p>
          <q-select
            class="tw-w-full tw-rounded-lg"
            filled
            v-model="esSalida"
            :options="[
              { label: 'Sí', value: true },
              { label: 'No', value: false },
            ]"
            label="Seleccione"
            dense
            outlined
            emit-value
            required
            use-input
            map-options
            fill-input
            hide-selected
            input-debounce="0"
          />
        </q-card-section>
        <q-card-section class="row tw-p-4">
          <p class="tw-text-label tw-font-semibold">Adjunte los documentos</p>
          <FileLoader
            class="tw-w-full"
            @rejected="rejectedTypes"
            v-model="newFileInput"
            accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
            :sub-title="messageDocuments"
            multiple
            :max-files="maxFiles"
            :maxFileSize="50 * 1024 * 1024"
            max-file-size-label="50"
          />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            label="Cancelar"
            @click="
              newFileInput = [];
              modalDocuments = false;
            "
            class="!tw-px-6 !tw-py-2"
          />
          <q-btn
            label="Cargar"
            color="secondary"
            @click="handleUploadFile"
            class="!tw-px-6 !tw-py-2"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div v-if="visualizadorPDF" class="tw-h-full tw-w-full">
      <q-dialog v-model="visualizadorPDF" seamless position="right" class="">
        <q-card class="tw-h-full tw-w-[2000px] tw-z-[1000] tw-overflow-hidden">
          <q-card-section>
            <transition
              appear
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
              <div>
                <q-btn
                  v-if="!visibleDoscRead"
                  @click="visualizadorPDF = false"
                  class="tw-absolute tw-ml-5 tw-mt-20 tw-z-[2000] tw-text-white tw-bg-red-500"
                  >Cerrar</q-btn
                >
                <iframe
                  class="tw-h-[80vh] tw-w-full"
                  :src="iframePdfUrl"
                  frameborder="0"
                ></iframe>

                <template v-if="listForVizualiser.length > 0">
                  <p class="text-weight-bold tw-mt-2">Documentos de Entrada</p>
                  <q-tabs
                    v-model="tabsFiles"
                    dense
                    align="justify"
                    narrow-indicator
                  >
                    <q-tab
                      v-for="item in listForVizualiser.filter(
                        (it) => it.tipo === 'De Entrada'
                      )"
                      :name="item.nombre"
                    >
                      <q-card
                        class="tw-h-[10vh] tw-w-[150px] tw-p-3"
                        @click="getBlobToIframe(item.id, null)"
                      >
                        <q-img v-lazy :data-url="docImg" style="width: 30px" />
                        <p class="tw-text-gray-dark textFile tw-mt-2">
                          {{ item.nombre }}
                        </p>
                        <q-tooltip
                          class="text-body2"
                          anchor="top middle"
                          self="bottom middle"
                          :offset="[10, 10]"
                        >
                          {{ item.nombre }}
                        </q-tooltip>
                      </q-card>
                    </q-tab>
                  </q-tabs>

                  <p class="text-weight-bold tw-pt-5">Documentos de Gestión</p>
                  <q-tabs
                    v-model="tabsFiles"
                    dense
                    align="justify"
                    narrow-indicator
                  >
                    <q-tab
                      v-for="item in listForVizualiser.filter(
                        (it) => it.tipo === 'De gestión'
                      )"
                      :name="item.nombre"
                    >
                      <q-card
                        class="tw-h-[10vh] tw-w-[150px] tw-p-3"
                        @click="getBlobToIframe(item.id, null)"
                      >
                        <q-img v-lazy :data-url="docImg" style="width: 30px" />
                        <p class="tw-text-gray-dark textFile tw-mt-2">
                          {{ item.nombre }}
                        </p>
                        <q-tooltip
                          class="text-body2"
                          anchor="top middle"
                          self="bottom middle"
                          :offset="[10, 10]"
                        >
                          {{ item.nombre }}
                        </q-tooltip>
                      </q-card>
                    </q-tab>
                  </q-tabs>

                  <p class="text-weight-bold tw-pt-5">Documentos de Salida</p>
                  <q-tabs
                    v-model="tabsFiles"
                    dense
                    align="justify"
                    narrow-indicator
                  >
                    <q-tab
                      v-for="item in listForVizualiser.filter(
                        (it) => it.tipo === 'De salida'
                      )"
                      :name="item.nombre"
                    >
                      <q-card
                        class="tw-h-[10vh] tw-w-[150px] tw-p-3"
                        @click="getBlobToIframe(item.id, null)"
                      >
                        <q-img v-lazy :data-url="docImg" style="width: 30px" />
                        <p class="tw-text-gray-dark textFile tw-mt-2">
                          {{ item.nombre }}
                        </p>
                        <q-tooltip
                          class="text-body2"
                          anchor="top middle"
                          self="bottom middle"
                          :offset="[10, 10]"
                        >
                          {{ item.nombre }}
                        </q-tooltip>
                      </q-card>
                    </q-tab>
                  </q-tabs>
                </template>
              </div>
            </transition>
          </q-card-section>
          <q-inner-loading
            :showing="visibleDoscRead"
            label-class="text-teal"
            label-style="font-size: 1.1em"
          />
        </q-card>
      </q-dialog>
    </div>
  </div>

  <q-dialog v-model="rechazarEscala" backdrop-color="rgba(0, 0, 0, 0.5)">
    <q-card class="tw-w-[35%] mx-auto tw-rounded-md">
      <q-card-section class="tw-px-8">
        <div
          class="tw-text-xl tw-font-extrabold q-mx-lg tw-text-[#0a1b48] tw-mb-4"
        >
          Rechazar Escalamiento
        </div>
        <p class="tw-block tw-text-sm tw-font-medium tw-text-[#777e87] tw-mb-4">
          Escriba aquí el motivo de rechazo*
        </p>
        <label class="tw-block tw-text-sm tw-font-bold tw-text-[#777e87]"
          >Observaciones</label
        >
        <q-input
          type="textarea"
          outlined
          label="Inserte"
          dense
          emit-value
          v-model="motivoRechazoEscala"
          :rules="[
            (v) => inputRequired(v),
            (v) => maxLengthInput(200, v),
            (v) => minLengthInput(10, v),
          ]"
        />
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          flat
          label="Cancelar"
          color="secondary"
          class="tw-w-[35%]"
          v-close-popup
        />
        <q-btn
          label="Rechazar"
          color="secondary"
          class="tw-w-[35%] tw-h-10"
          @click="rechazarEscalamiento"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <ConfirmModal
    text-cancel-modal="No"
    text-confirm-modal="Sí"
    text-show-modal="¿Está seguro que desea aceptar y gestionar el escalamiento?"
    @update:show-modal="() => (gestionarEscala = false)"
    @confirm-modal="aprobarEscalamiento"
    :show-modal="gestionarEscala"
  />

  <RechazarModal
    show-gestionador
    :gestionador="
      data?.asignacionPqrdEntity?.gestionador.firstname +
      ' ' +
      data?.asignacionPqrdEntity?.gestionador.lastname
    "
    title="Rechazar"
    @hide-modal="rechazarRevisionModal = false"
    :show-modal="rechazarRevisionModal"
    @update-modal="updateModalRevision"
    text="Observaciones"
  />

  <ConfirmModal
    text-cancel-modal="No"
    text-confirm-modal="Sí"
    text-show-modal="¿Está seguro que desea rechazar la respuesta proyectada?"
    @update:show-modal="() => (showModalConfirmRevision = false)"
    @confirm-modal="rechazarRevision"
    :show-modal="showModalConfirmRevision"
  />

  <ConfirmModal
    text-cancel-modal="Cancelar"
    text-confirm-modal="Aceptar"
    text-show-modal="¿Está seguro de dar el visto bueno a la respuesta proyectada?"
    @update:show-modal="() => (showModalConfirmAprobacionRevision = false)"
    @confirm-modal="aprobarRevision"
    :show-modal="showModalConfirmAprobacionRevision"
  />

  <RechazarModalDefensor
    @hide-modal="hideModalRechazoDefensor"
    :show-modal="showModalRechazarDefensor"
    @update-modal="updateModalDefensor"
    :gestionador-first="data?.asignacionPqrdEntity?.gestionador?.firstname"
    :gestionador-last="data?.asignacionPqrdEntity?.gestionador?.lastname"
    :show-gestionador="true"
  />

  <ConfirmModal
    text-cancel-modal="Cancelar"
    text-confirm-modal="Aceptar"
    text-show-modal="¿Está seguro de rechazar la respuesta proyectada?"
    @update:show-modal="() => (showModalConfrimRechazoDefensor = false)"
    @confirm-modal="rechazarRevisionDefensor"
    :show-modal="showModalConfrimRechazoDefensor"
  />

  <ConfirmModalDefensor
    text-cancel-modal="Cancelar"
    text-confirm-modal="Visto bueno"
    text-show-modal="¿Está seguro de dar el visto bueno a la respuesta proyectada?"
    @update:show-modal="() => (showModalConfrimDefensor = false)"
    @confirm-modal="showModalConfrimDefensorFinal = true"
    :show-modal="showModalConfrimDefensor"
    :show-gestionador="true"
    :gestionador-first="data?.asignacionPqrdEntity?.gestionador?.firstname"
    :gestionador-last="data?.asignacionPqrdEntity?.gestionador?.lastname"
    :aprobador-first="data?.asignacionPqrdEntity?.aprobador?.firstname"
    :aprobador-last="data?.asignacionPqrdEntity?.aprobador?.lastname"
    :showAprobador="true"
  />

  <ConfirmModal
    text-cancel-modal="Cancelar"
    text-confirm-modal="Aceptar"
    text-show-modal="¿Está seguro de dar el visto bueno a la respuesta proyectada?"
    @update:show-modal="() => (showModalConfrimDefensorFinal = false)"
    @confirm-modal="AprobarRevisionDefensor"
    :show-modal="showModalConfrimDefensorFinal"
  />

  <q-dialog v-model="vistoBuenoModal">
    <q-card :class="['tw-px-3', 'tw-p-9 tw-w-[980px]']">
      <q-card-section>
        <p class="tw-text-xl tw-font-bold">Respuesta</p>
        <p class="tw-mt-3 tw-text-gray-dark tw-font-bold">Gestionador</p>
        <p
          v-if="data.asignacionPqrdEntity?.gestionador"
          class="tw-text-gray-dark"
        >
          {{
            data.asignacionPqrdEntity?.gestionador?.firstname +
            " " +
            data.asignacionPqrdEntity?.gestionador?.lastname
          }}
        </p>

        <p class="tw-mt-3 tw-text-gray-dark tw-font-bold">Aprobador</p>
        <p
          v-if="data.asignacionPqrdEntity?.aprobador"
          class="tw-text-gray-dark"
        >
          {{
            data.asignacionPqrdEntity?.aprobador?.firstname +
            " " +
            data.asignacionPqrdEntity?.aprobador?.lastname
          }}
        </p>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          :label="`Cancelar`"
          color="accent"
          text-color="black"
          class="tw-p-3"
          style="
            width: 250px;
            height: 45px;
            border-radius: 8px;
            font-size: 18px;
          "
          @click="vistoBuenoModal = false"
        />
        <q-btn
          :label="`Visto bueno`"
          style="
            width: 250px;
            height: 45px;
            border-radius: 8px;
            font-size: 18px;
          "
          text-color="white"
          color="secondary"
          class="tw-rounded-xl tw-p-3"
          @click="updateModalApruebaRevision"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <RechazarModal
    :motivo-limit="1500"
    title="Motivo de rechazo"
    text="Escriba aquí su comentario."
    @hide-modal="rechazarAprobacionModal = false"
    :show-modal="rechazarAprobacionModal"
    @update-modal="updateModalAprobador"
  />

  <ConfirmModal
    text-cancel-modal="No"
    text-confirm-modal="Sí"
    text-show-modal="¿Está seguro que desea rechazar la aprobación del caso?"
    @update:show-modal="() => (showModalConfirmAprobador = false)"
    @confirm-modal="rechazarAprobacion"
    :show-modal="showModalConfirmAprobador"
  />

  <ConfirmModal
    text-cancel-modal="Cancelar"
    text-confirm-modal="Aceptar"
    text-show-modal="¿Está seguro que desea aprobar el caso?"
    @update:show-modal="() => (showModalConfirmAprobacionAprobador = false)"
    @confirm-modal="beforeAprobacion()"
    :show-modal="showModalConfirmAprobacionAprobador"
  />

  <Modal
    v-model="modalSegundaDevolucion"
    :is-success="false"
    @handleAccept="labelComponet = 'Información General'"
    textButton="Aceptar"
    text="El documento ha cumplido dos devoluciones, gestionar publicación en Página WEB"
    type="button"
  />

  <ReiniciarGestionModal
    :data="data"
    v-if="labelComponet === 'Reinicio de gestión'"
  />

  <q-dialog v-model="modalRespDefensor">
    <q-card :class="['tw-px-3', 'tw-p-9 tw-w-[980px]']">
      <q-form greedy ref="respDefForm">
        <img class="q-mx-auto" style="width: 100px" v-lazy :data-url="InterrogationModal" />
        <q-card-section
          class="text-center text-h6 tw-max-w-sm text-weight-bold"
        >
          Respuesta del Defensor
        </q-card-section>
        <q-card-section class="tw-max-w-sm">
          <p class="tw-ml-3 text-weight-bold">
            Cargue sus documentos de respuesta
          </p>
          <br />
          <p class="tw-text-label">Adjuntar documentos</p>
          <FileLoader
            multiple
            :max-file-size="50 * 1024 * 1024"
            max-file-size-label="50"
            v-model:model-value="respDefensor"
            :max-files="2"
            accept-file="pdf"
            @rejected="rejectedTypesRepDef"
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
              font-size: 16px;
            "
            @click="
              (modalRespDefensor = false),
                (labelComponet = 'Información General'),
                (respDefensor = [])
            "
          />
          <q-btn
            label="Aceptar"
            style="
              width: 250px;
              height: 45px;
              border-radius: 8px;
              font-size: 16px;
            "
            text-color="white"
            color="secondary"
            class="tw-rounded-xl tw-p-3"
            @click="updateModalRespDefensor"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <q-dialog v-model="modalAprobar" class="modal-custom-dialog">
    <q-card class="tw-p-[40px] tw-w-[800px] tw-max-w-[800px]">
      <q-card-section class="text-h6 tw-max-w-sm tw-px-0 tw-pt-0">
        <p class="tw-text-xl tw-text-modal-blue-main-title text-weight-bold">
          Adjuntar documentos
        </p>
      </q-card-section>
      <q-form ref="formLoad">
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <q-card-section class="tw-px-0 tw-pt-0">
            <p
              class="tw-text-[16px] tw-text-modal-grey-subtitle tw-font-bold tw-ml-2"
            >
              Adjunte de Documentos
            </p>
          </q-card-section>

          <div class="tw-mt-2">
            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-12">
                <q-form ref="formFile">
                  <label class="tw-w-full">
                    <FileLoader
                      :rules="[inputRequired]"
                      v-model="filesApro"
                      multiple
                      class="tw-w-full"
                      accept-file="pdf"
                      :max-file-size="50 * 1024 * 1024"
                      max-file-size-label="50"
                      :max-files="2"
                      @rejected="rejectedFiles"
                    />
                  </label>
                </q-form>
              </div>
            </div>
          </div>
        </q-card>

        <q-card-actions class="q-mt-sm tw-gap-[20px]">
          <q-btn
            type="button"
            flat
            label="Cancelar"
            class="tw-h-12 text-weight-bold tw-text-md"
            style="width: 40%"
            color="secondary"
            @click="modalAprobar = false"
          />
          <q-btn
            type="button"
            flat
            label="Aprobar"
            class="tw-h-12 bg-secondary text-weight-bold tw-text-md !tw-bg-modal-black-button"
            style="width: 40%"
            color="white"
            @click="submitFiles"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
  <ExitoModal
    text-cancel-modal="Descargar"
    text-confirm-modal="Finalizar"
    :text-show-modal="`La respuesta proyectada tiene su visto bueno. Radicado de salida generado ${idRadicacion}`"
    @update:show-modal="descargaPdf(idRadicacion, nodeIdAprobado)"
    @confirm-modal="exitoAprobacionApro"
    :show-modal="showModalExitoApro"
  />
</template>

<script lang="ts" setup>
import InterrogationModal from "src/assets/interrogation-modal.svg";
import FileLoader from "src/components/FormFields/FileLoader.vue";
import ConfirmModal from "src/components/Modal/ConfirmModal.vue";
import ConfirmModalDefensor from "src/components/Modal/ConfirmModalDefensor.vue";
import CustomModal from "src/components/Modal/CustomModal.vue";
// @ts-ignore
import docImg from "src/assets/icon-lines.svg";
import Modal from "src/components/Modal/Modal.vue";
import RechazarModal from "src/components/Modal/RechazarModal.vue";
import RechazarModalDefensor from "src/components/Modal/RechazarModalDefensor.vue";
import { fourthFormatDate } from "src/helpers/formtDate";
import { toast } from "src/helpers/toast";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import {
  inputRequired,
  maxLengthInput,
  minLengthInput,
} from "src/helpers/validations";
import { DocsBD, DocumentoRadicado } from "src/interfaces";
import DatosSalida from "src/pages/PQRD/EnvioRespuesta/EnvioRespuesta.vue";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import { Ref, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Asignar from "../Asignacion/asignacion.vue";
import Comentarios from "../Comentarios/comentarios.vue";
import DocumentosRelacionados from "../DocumentosRelacionados/DocumentosRelacionados.vue";
import EnviarAprobacion from "../EnviarAprobacion/EnviarAprobacion.vue";
import EnviarRevision from "../EnviarRevision/EnviarRevision.vue";
import EnviarRevisionDefensor from "../EnviarRevision/EnviarRevisionDefensor.vue";
import Escalar from "../Escalar/Escalar.vue";
import EtapaProcesal from "../EtapaProcesal/EtapaProcesal.vue";
import GestionEscalamiento from "../GestiónEscalamiento/GestiónEscalamiento.vue";
import IncluirExpediente from "../IncluirExpediente/incluirExpediente.vue";
import InformacionGeneral from "../InformacionGeneral/informacionGeneral.vue";
import Metadatos from "../Metadatos/metadatos.vue";
import MetadatosDinamic from "src/components/metadtos/DynamicFields/Metadatos.vue";
import Reasignacion from "../Reasignacion/reasignacion.vue";
import Reclasificar from "../Reclasificacion/Form/reclasificar.vue";
import SolicitudReclasificar from "../Reclasificacion/Solicitud/solicitud.vue";
import RespuestaEscalamiento from "../RespuestaEscalamiento/RespuestaEscalamiento.vue";
import SolicitudEscalamiento from "../SolicitudEscalamiento/SolicitudEscalar.vue";
import RechazosClonacion from "../SolicitudesRechazo/TableSolicitudesRechazo.vue";
import Trazabilidad from "../Trazabilidad/trazabilidad.vue";
import EditarInfo from "./EditarInfo.vue";
import EnviarPorCorrespondencia from "src/components/Devolucion/EnviarCorrespondencia.vue";
import EnviarPorCorreo from "src/components/Devolucion/EnviarCorreo.vue";
// import CerrarDevolucion from "src/components/Devolucion/CerrarDevolucion.vue";
import EnviarPublicacion from "src/components/Devolucion/EnviarPublicacion.vue";
import Publicar from "src/components/Devolucion/Publicar.vue";
import RechazarPublicacion from "src/components/Devolucion/RechazarPublicacion.vue";
import ArchivosDesfijacion from "src/components/Devolucion/ArchivosDesfijacion.vue";
import CierrePublicacion from "src/components/Devolucion/CierrePublicacion.vue";
import { ESTADOS } from "src/assets/estados/estados";
import ReasignarOficina from "src/shared/components/ReasignarOficina/reasignacion.vue";
import ReiniciarGestionModal from "src/components/ReinicioDeGestion/ReiniciarGestionModal.vue";
import Editor from "src/components/Editor/editor.vue";
import TrazabilidadDocumento from "../../MedicinaLaboral/TrazabilidadDocumento/TrazabilidadDocumento.vue";
import { crearTrazabilidadDocumento } from "src/helpers/trazabilidadDocumento";
import moment from "moment";
import ExitoModal from "src/components/Modal/ExitoModal.vue";

const route = useRoute();
const router = useRouter();
const state = ref();
const visualizadorPDF = ref(false);
const iframePdfUrl = ref();
const labelComponet = ref("Información General");
const refSalida = ref();
const edit = ref(false);
const newDocModal = ref(false);
const form = ref({
  motivoRechazo: "",
  motivoRechazoDefensor: "",
});
const maxFiles = ref(1);
const esSalida = ref(false);
const newFileInput = ref<any>([]);
const data = ref(null);
const noteModal = ref(false);
const modalDocuments = ref(false);
const showModal = ref<boolean>(false);
const firmaAprobador = ref(null);
const aprobado = ref(false);
const showModalConfrim = ref<boolean>(false);
const showModalConfrimDefensor = ref<boolean>(false);
const showModalConfrimDefensorFinal = ref<boolean>(false);
const showModalConfrimRechazoDefensor = ref<boolean>(false);
const responseMetadatos = ref();
const responseDocSalida = ref();
const responseDatosSalida = ref();
const datosSalida = ref();
const responsePqrd = ref();
const asignacionPqrdEntity = ref(null);
const listDocs = ref([]);
const loadingDocs = ref(true);
const showModalConfirmRevision = ref(false);
const showModalConfirmAprobacionRevision = ref(false);
const showModalConfirmAprobador = ref(false);
const showModalConfirmAprobacionAprobador = ref(false);
const isEscalador = ref(false);
const clonadoPqrd = ref(false);
const isConsolidador = ref(false);
const defensorApro = ref(false);
const showModalFinal = ref(false);
const finalModal = ref(false);
const completadoModal = ref(false);
const showModalRechazarDefensor = ref(false);
const rechazarEscala = ref(false);
const rechazarRevisionModal = ref(false);
const vistoBuenoModal = ref(false);
const rechazarAprobacionModal = ref(false);
const gestionarEscala = ref(false);
const loadedDocsToChangeType = ref([]);
const showChangeDocType = ref<boolean>(false);
const modalChangeDocType = ref<boolean>(false);
const dinamicSentence = ref();
const isNewDocCreated = ref(false);
const tab = ref("infoGeneral");
const uiTabsKey = ref(0);
const dbDocs: Ref<DocsBD[]> = ref([]);
const finished = ref(false);
const isAsignador = ref(false);
const isDevolucion = ref(false);
const segundaDevolucion = ref(false);
const modalSegundaDevolucion = ref(false);
const metadatos = ref([]);
const isMetadatos = ref(false);
const isDesfijacion = ref(false);
const isPublicacion = ref(false);
const modalRespDefensor = ref(false);
const respDefensor = ref([]);
const respDefForm = ref(null);
const visibleDoscRead = ref(false);
const listForVizualiser = ref([]);
const tabsFiles = ref();
const modalAprobar = ref(false);
const filesApro = ref(null);
const formFile = ref();
const MAX_FILE = 2;
const infoComp = ref();
const files = ref([]);
const readOnlyGestionador = ref(false);
const aprobadoDocSal = ref(false);
const loadingEnvios = ref(false);
const htmlContent = ref("");
const documentoFile = ref("");
const incrementaKey = ref(0);
const imgBase64 = ref();
let referentKey = {};
let dataFooter = {};
const idRadicacion = ref();
const nodeId = ref("");
const showModalExitoApro = ref(false);

const items = ref([
  {
    label: "Información General",
    icon: "info",
  },
  {
    label: "Asignar",
    icon: "move_up",
  },
  {
    label: "Reasignar",
    icon: "move_up",
  },
  {
    label: "Documentos Relacionados",
    icon: "folder_open",
  },
  {
    label: "Trazabilidad",
    icon: "history",
  },
  {
    label: "Comentarios",
    icon: "forum",
  },
  {
    label: "Escalar",
    icon: "move_up",
  },
  {
    label: "Gestion de escalamiento",
    icon: "move_up",
  },
  {
    label: "Documento de salida",
    icon: "drive_file_move",
  },
  // {
  //   label: "Primer radicado de salida",
  //   icon: "description",
  // },
  {
    label: "Segundo radicado de salida",
    icon: "description",
  },
  {
    label: "Datos de salida",
    icon: "send",
  },
  {
    label: "Incluir Expediente",
    icon: "description",
  },
  {
    label: "Metadatos",
    icon: "folder_open",
  },
  {
    label: "Enviar a revisión",
    icon: "rate_review",
  },
  {
    label: "Enviar a aprobación",
    icon: "task_alt",
  },
  {
    label: "Trazabilidad de Documento",
    icon: "description",
  },
  {
    label: "Solicitud reclasificación",
    icon: "shuffle",
  },
  {
    label: "Reclasificar Trámite",
    icon: "shuffle",
  },
  {
    label: "Solicitud escalamiento",
    icon: "move_up",
  },
  {
    label: "Respuesta escalamiento",
    icon: "move_up",
  },
  {
    label: "Rechazos de clonación",
    icon: "assignment",
  },
]);

const itemsIsEscalado = ref([
  {
    label: "Información General",
    icon: "info",
    component: "Información General",
  },
  {
    label: "Documentos Relacionados",
    icon: "folder_open",
    component: "Documentos Relacionados",
  },
  {
    label: "Comentarios",
    icon: "forum",
    component: "Comentarios",
  },
  {
    label: "Solicitud escalamiento",
    icon: "move_up",
    component: "Solicitud escalamiento",
  },
]);

const itemsDevolucionIsDoc = ref([
  {
    label: "Información General",
    icon: "info",
    component: "Información General",
  },
  {
    label: "Documento de Salida",
    icon: "task_alt",
    component: "Documento de salida",
  },
  {
    label: "Enviar a Aprobación",
    icon: "check_circled",
    component: "Enviar a aprobación",
  },
  {
    label: "Adjuntar Anexos de Salida",
    icon: "folder_open",
    component: "Documentos Relacionados",
  },
  {
    label: "Enviar por Correspondencia fisica",
    icon: "send",
    component: "Enviar por Correspondencia",
  },
  {
    label: "Enviar por Correo",
    icon: "send",
    component: "Enviar por Correo",
  },
  {
    label: "Trazabilidad",
    icon: "history",
    component: "Trazabilidad",
  },
]);

const itemsSegundaDevolucion = ref([
  {
    label: "Información General",
    icon: "info",
    component: "Información General",
  },
  {
    label: "Enviar a Publicación",
    component: "Enviar a Publicación",
    icon: "send",
  },
  {
    label: "Adjuntar Documento",
    icon: "folder_open",
    component: "Documentos Relacionados",
  },
  {
    label: "Documentos Relacionados",
    icon: "folder_open",
    component: "Documentos Devolucion",
  },
  // {
  //   label: "Solicitud Cierre de Devolución",
  //   icon: "close",
  //   component: "Solicitud Cierre de Devolución",
  // },
  {
    label: "Trazabilidad",
    icon: "history",
    component: "Trazabilidad",
  },

  // {
  //   label: "Adjuntar Documento",
  //   name: allNameTabs.archivoEncriptado,
  //   icon: "folder_open"
  // },
]);

const itemsPorPublicar = ref([
  {
    label: "Información General",
    icon: "info",
    component: "Información General",
  },
  {
    label: "Publicar",
    component: "Publicar",
    icon: "open_in_browser",
  },
  {
    label: "Trazabilidad",
    icon: "history",
    component: "Trazabilidad",
  },
]);

const itemsDesfijacion = ref([
  {
    label: "Adjuntar Documento",
    icon: "post_add",
    component: "documentoDesfijacion",
  },
  {
    label: "Cierre de Publicación",
    component: "cierrePublicacion",
    icon: "close",
  },
]);

const emit = defineEmits(["image-loaded"]);
const escalamientoId = ref();
const escalamientoData = ref([]);
const isRevisor = ref(false);
const isThirdDayAtFourThirtyPMAfterRadicationDate = ref(false);
const motivoRechazoEscala = ref("");
const motivoRechazoRevision = ref("");
const motivoRechazoAprobador = ref("");
const radicationDate = ref("");
const intervalId = ref(null);

const isEscalado = ref();
const { getUserInfo } = useAuthStore();
const auth = useAuthStore();
const pdfBlob = ref<Blob>();
const selectedSignature = ref();

function checkSpecificHour(targetHour, targetMinute) {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Check if current time is past the target time
  const isGreaterThanFourThirtyPM =
    currentHour > targetHour ||
    (currentHour === targetHour && currentMinute >= targetMinute);
  return isGreaterThanFourThirtyPM;
}

const disableButtonRechazarAfterThreeDaysSinceRadication = async () => {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format

  //making start date usable for calculate days function
  const radication_date = radicationDate.value.split(" ")[0];
  const start_date_parts = radication_date.split("/");
  const start_date = new Date(
    parseInt(start_date_parts[2]),
    parseInt(start_date_parts[1]) - 1,
    parseInt(start_date_parts[0])
  );

  const days = calculateDayDifference(start_date, today);

  if (days >= 3) {
    if (checkSpecificHour(16, 30)) {
      //check if it is 4:30 p.m
      isThirdDayAtFourThirtyPMAfterRadicationDate.value = true;
    }
  }
};

function calculateDayDifference(startDateString, endDateString) {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  const timeDiff = endDate.getTime() - startDate.getTime();

  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  return daysDiff;
}
const changeGestionador = ref(false);
const changeRevisor = ref(false);
const changeAprobador = ref(false);

let trazabilidadRegistrada = false;

async function autoSaveDocument({ paragraf, pdf }) {
  try {
    pdfBlob.value = pdf;
    let docResponseSave;
    if (
      responsePqrd.value.clonado == true &&
      auth.$state.userInfo.role === "Gestionador" &&
      auth.$state.userInfo.userid !== responsePqrd.value.idConsolidador
    ) {
      // Extraer solo lo del texto a clonar
      dinamicSentence.value = extractClonedParagraph(paragraf);
      docResponseSave = await sgdeaAxios.post(
        `/pqrd/guardarDocumentoSalidaClonado`,
        {
          idDocumentoSalida: 0,
          idPqrd: responsePqrd.value.id,
          htmlContent: dinamicSentence.value,
          fechaEdicion: moment(),
          user: auth.$state.userInfo.userid,
        },
        { showLoader: false }
      );
    } else {
      docResponseSave = await sgdeaAxios.post(`/pqrd/guardarDocumentoSalida`, {
        idDocumentoSalida: 0,
        idPqrd: responsePqrd.value.id,
        htmlContent: paragraf,
        fechaEdicion: moment(),
      });
    }

    if (docResponseSave.status === 200 || docResponseSave.status === 201) {
      const userRole = auth.$state.userInfo.role; // Suponiendo que el rol está almacenado en userInfo.role
      if (userRole === "Gestionador") {
        changeGestionador.value = true;
      } else if (userRole === "Revisor") {
        changeRevisor.value = true;
      } else if (userRole === "Aprobador") {
        changeAprobador.value = true;
      }

      toast.success("Se guardó el documento exitosamente");
      // Crear trazabilidad
      if (!trazabilidadRegistrada) {
        await crearTrazabilidad({
          proceso: "PQRD" + responsePqrd.value.id,
          secuencia: responsePqrd.value.idRadicado,
          estado: responsePqrd.value.estado.estado,
          descripcion: `Usuario: ${auth.$state.userInfo.name} Descripción: Se han hecho modificaciones al documento de salida `,
          comentario: "Modificación",
          nombre: auth.$state.userInfo.name,
          accion: `${auth.$state.userInfo.name} ha modificado el documento de salida del caso ${responsePqrd.value.idRadicado}`,
          tramite: "PQRD",
        });
        trazabilidadRegistrada = true;
      }
      await getData();
    }
  } catch (error) {
    toast.error("Hubo un error al guardar el documento.");
  }
}

// Función para cargar los datos del escalamiento
const loadEscalamientoData = async () => {
  try {
    const pqrdId = route.params.id;
    const usuarioId = auth.userInfo.userid;

    const response = await sgdeaAxios.get(
      `/pqrd/escalamientos/pqrd/${pqrdId}?usuarioId=${usuarioId}`
    );

    if (response.status === 200 || response.status === 201) {
      escalamientoData.value = response.data.map((item) => ({
        motivoEscalamiento: item.motivoEscalamiento || "",
        diasEscalamiento: item.diasEscalamiento || "1",
        horaEscalamiento: item.horaEscalamiento || "00:00",
        id: item.id || null,
      }));
    }
  } catch (err) {
    toast.warning("No se encontraron escalamientos para el PQRD seleccionado.");
  }
};

function formatCopies(data) {
  const formaEnvio = responseDatosSalida?.value?.destinatario?.forma_envio_id;
  if ([1, 2].includes(formaEnvio)) {
    return `${data?.nombre ? data.nombre.toUpperCase().trim() : ""}${
      data?.correo ? " / " + data.correo.trim() : ""
    }`;
  }
  return `${data?.nombre ? data?.nombre?.toUpperCase().trim() : ""}${
    data?.direccion ? " / Dirección: " + data?.direccion.trim() : ""
  }${
    data?.departamento_nombre
      ? " / Departamento: " + data?.departamento_nombre
      : ""
  }${data?.municipio_nombre ? " / Municipio: " + data?.municipio_nombre : ""}${
    data?.numero_celular ? " / Teléfono: " + data?.numero_celular : ""
  }`;
}

const formasEnvio = [
  { id: 2, nombre: "Correo electrónico certificado" },
  { id: 3, nombre: "Courier" },
  { id: 1, nombre: "Correo electrónico" },
  { id: 4, nombre: "Mensajería" },
  { id: 5, nombre: "Personal" },
  { id: 6, nombre: "Mensajero" },
];

function getFormaEnvioNombre(formaEnvioId) {
  const formaEnvio = formasEnvio.find((item) => item.id === formaEnvioId);
  return formaEnvio ? formaEnvio.nombre : "";
}

const numeroAprobacione = ref();

const messageDocuments = ref("");
const isClonado = ref();
const getData = async () => {
  const isAsignacion = route.query?.idAsignacion
    ? `&idAsignacion=${route.query?.idAsignacion}`
    : "";
  const authUserid = auth.$state.userInfo.userid
    ? `&userId=${auth.$state.userInfo.userid}`
    : "";
  try {
    const id = route.params.id;
    const response = await sgdeaAxios.get(
      `/pqrd/buscarCaso?idCaso=${id}${isAsignacion}${authUserid}`,
      { showLoader: false }
    );
    const getPlantilla = await getPlantillaSinPrefijo();

    responsePqrd.value = response.data;

    if (responsePqrd.value.estado == "Devolucion") {
      isDevolucion.value = true;
    }

    documentoFile.value = getPlantilla.base64x;
    if (responsePqrd.value.canalRadicacion.id == 5) {
      removeButton("Reclasificar Trámite");
    }

    if (responsePqrd.value.numeroDevoluciones > 1) {
      segundaDevolucion.value = true;
      modalSegundaDevolucion.value = true;
      isNewDocCreated.value = true;
    }

    if (
      responsePqrd.value.estado?.estado == "Por publicar" ||
      responsePqrd.value.estado?.estado == "Publicado" ||
      responsePqrd.value.estado?.estado == "Publicacion rechazada" ||
      responsePqrd.value.estado?.estado == "Publicacion cerrada"
    ) {
      isPublicacion.value = true;
    }

    if (responsePqrd.value.fechaPublicacion) {
      const givenDateString = responsePqrd.value.fechaPublicacion;
      const givenDate = new Date(givenDateString);
      const currentDate = new Date();
      const millisecondsDiff = currentDate.getTime() - givenDate.getTime();
      const daysDiff = millisecondsDiff / (1000 * 60 * 60 * 24);
      if (daysDiff >= 6) {
        labelComponet.value = "documentoDesfijacion";
        isDesfijacion.value = true;
      }
    }

    asignacionPqrdEntity.value = responsePqrd.value.asignacionPqrdEntity;

    numeroAprobacione.value = responsePqrd.value?.numeroAprobaciones;

    state.value = responsePqrd.value.estado.estado;

    data.value = response.data;

    defensorApro.value =
      data.value.estado.estado == "Aprobado" &&
      data.value.canalRadicacion.nombre == "Defensor del consumidor"
        ? true
        : false;

    isEscalado.value = data.value?.escalado;
    clonadoPqrd.value = data.value.clonado;
    isConsolidador.value =
      responsePqrd.value.idConsolidador == getUserInfo().userid;
    isEscalador.value =
      data.value.asignacionPqrdEntity?.gestionador.id == getUserInfo().userid;
    isRevisor.value =
      data.value.informacionRemitente.nombreRemitente == getUserInfo().name &&
      data.value.canalRadicacion.id == 5;

    //Using this only for rechazar button validation
    radicationDate.value = data.value.fechaRadicacion;
    disableButtonRechazarAfterThreeDaysSinceRadication();

    // Validar envío de la firma
    const aprobador = responsePqrd.value.asignacionPqrdEntity?.aprobador;
    if (aprobador) {
      await getFirma(aprobador.id, aprobador.firmaPredeterminadaId);
      aprobadoDocSal.value = responsePqrd.value.estado?.estado === "Aprobado";
    }

    referentKey = {
      NombredeDestinatario: responseDatosSalida.value.destinatario.nombre ?? "",
      TipoDeDocumentoDestinatario: responseDatosSalida.value.destinatario
        .tipo_documento_nombre
        ? responseDatosSalida.value.destinatario.tipo_documento_nombre
        : "",
      DireccionDeDestinatario:
        responseDatosSalida.value.destinatario.direccion ?? "",
      TelefonoDeDestinatario:
        responseDatosSalida.value.destinatario.numero_celular ?? "",
      DepartamentoYMunicipioDestinatario:
        responseDatosSalida.value.destinatario.departamento_nombre &&
        responseDatosSalida.value.destinatario.municipio_nombre
          ? `${responseDatosSalida.value.destinatario.departamento_nombre} - ${responseDatosSalida.value.destinatario.municipio_nombre}`
          : "",
      CorrreoDestinatario: responseDatosSalida.value.destinatario.correo ?? "",
      asunto: responseDatosSalida?.value?.asunto || "",
      Firma: selectedSignature?.value
        ? selectedSignature?.value?.tipoFirmaUsuario?.nombre === "Grafo"
          ? selectedSignature?.value?.fileData
          : getFormattedName(aprobador)
        : "",
      NombreAprobador: selectedSignature?.value
        ? selectedSignature?.value?.tipoFirmaUsuario?.nombre === "Grafo"
          ? getFormattedName(aprobador)
          : ""
        : "",
      CargoAprobador: aprobador?.cargo?.nombre || "",
      DependenciaAprobador: aprobador
        ? aprobador?.usuarioRelaciones?.[0]?.oficina?.dependencia?.nombre
        : "",
    };

    if (
      data.value.clonado === true &&
      data.value.idConsolidador !== auth.userInfo.userid &&
      auth.userInfo.role === "Gestionador"
    ) {
      // Cargar información del clonado
      await getClonado();
      await getDocFromClonado();
    } else {
      // Cargar información del consolidador o gestionador normal
      await getDocSalida();
      await getDoc();
      // Listar los párrafos del consolidador
      if (isClonado.value) {
        await getDocList();
      }
    }

    const arrayCopyInterna = {
      value: responseDatosSalida.value.usuariosCopia
        ? responseDatosSalida.value.usuariosCopia.map((item) =>
            formatCopies(item)
          ) // Formateamos las copias
        : [], // Si es null, asignamos una cadena vacía
    };

    const formaEnvioId = responseDatosSalida.value.destinatario.forma_envio_id; // Suponiendo que esto ya está definido
    const formaEnvioNombre = getFormaEnvioNombre(formaEnvioId);

    let infoAprobador = "";
    if (
      auth.userInfo.role === "Aprobador" &&
      responsePqrd.value?.asignacionPqrdEntity
    ) {
      infoAprobador = responsePqrd.value?.asignacionPqrdEntity?.aprobador
        ? `${getFormattedName(
            responsePqrd.value.asignacionPqrdEntity.aprobador
          )} - ${
            responsePqrd.value.asignacionPqrdEntity.aprobador
              ?.usuarioRelaciones?.[0]?.oficina?.dependencia?.nombre || ""
          }`
        : "";
    }

    const infoRevisor = responsePqrd.value?.asignacionPqrdEntity?.revisor
      ? `${getFormattedName(
          responsePqrd.value.asignacionPqrdEntity.revisor
        )} - ${
          responsePqrd.value.asignacionPqrdEntity.revisor
            ?.usuarioRelaciones?.[0]?.oficina?.dependencia?.nombre || ""
        }`
      : "";

    const usuarioElaboro = responsePqrd.value?.asignacionPqrdEntity?.gestionador
      ? `${getFormattedName(
          responsePqrd.value?.asignacionPqrdEntity?.gestionador
        )} - ${
          responsePqrd.value.asignacionPqrdEntity.gestionador
            ?.usuarioRelaciones?.[0]?.oficina?.nombre || ""
        }`
      : "";

    dataFooter = {
      // firmaAprobador: infoAprobador || "",
      Anexo: responseDatosSalida.value.anexos || "",
      asunto: responseDatosSalida.value.asunto || "",
      Copia: arrayCopyInterna.value.length > 0 ? arrayCopyInterna.value : "",
      DatosGestionador: usuarioElaboro || "", // elaboro
      DatosAprobador: infoAprobador || "",
      DatosRevisor: infoRevisor || "",
      FormadeEnvio: formaEnvioNombre || "",
      // cargoAprobador: "",
      // dependenciaAprobador: "",
    };

    await getDimanicDatos();

    if (auth.userInfo.role == "Asignador Responsable") {
      removeButton("Documento de salida");
      removeButton("Asignar ");
      removeButton("Escalar");
      removeButton("Rechazos de clonación");
      removeButton("Metadatos");
      removeButton("Trazabilidad de Documento");
    }

    if (
      auth.userInfo.role == "Asignador Responsable" &&
      responsePqrd.value.estado.id === 1
    ) {
      addButton("Asignar", "move_up");
      addButton("Reasignar", "move_up");
    }
    if (
      auth.userInfo.role == "Asignador Responsable" &&
      responsePqrd.value.estado.id !== 1
    ) {
      removeButton("Solicitud reclasificación");
      removeButton("Asignar");
    }

    if (
      auth.userInfo.role == "Gestionador Escalador" &&
      responsePqrd.value.estado.id === 4
    ) {
      removeButton("Reasignar");
      removeButton("Reinicio de gestión");
    }

    if (
      [
        "Gestionador",
        "Gestionador Consolidador",
        "Gestionador Escalador",
        "Administrador",
        "Revisor",
        "Aprobador",
      ].includes(auth.userInfo.role)
    ) {
      removeButton("Reclasificar Trámite");
      removeButton("Asignar");
      removeButton("Solicitud reclasificación");

      if (parseInt(data.value.diasPorVencer.split(" ")[0]) <= 2) {
        removeButton("Escalar");
      }
    }

    if (auth.userInfo.role == "Aprobador") {
      removeButton("Datos de salida");
      removeButton("Metadatos");
      removeButton("Reasignar");
      addButton("Trazabilidad de Documento", "description");
    }

    if (
      responsePqrd.value.estado.id !== 4 &&
      responsePqrd.value.estado.id !== 9 &&
      responsePqrd.value.estado.id !== 13
    ) {
      removeButton("Documento de salida");
      removeButton("Incluir Expediente");
      removeButton("Escalar");
      removeButton("Solicitud escalamiento");
      removeButton("Gestion de escalamiento");
      removeButton("Respuesta escalamiento");
      removeButton("Datos de salida");
      removeButton("Enviar a revisión");
      removeButton("Enviar a aprobación");
      removeButton("Rechazos de clonación");
      removeButton("Segundo radicado de salida");
      removeButton("Metadatos");
      removeButton("Trazabilidad de Documento");
    }

    if (responsePqrd.value.asignacionPqrdEntity?.estado.id == 8) {
      addButton("Trazabilidad de Documento", "description");
    }

    if (responsePqrd.value.asignacionPqrdEntity?.estado.id == 8) {
      addButton("Trazabilidad de Documento", "description");
    }

    if (clonadoPqrd.value) {
      removeButton("Asignar ");
      removeButton("Escalar");
    }

    if (!clonadoPqrd.value) {
      removeButton("Rechazos de clonación");
    }

    if (clonadoPqrd.value && !isConsolidador.value) {
      removeButton("Asignar ");
      removeButton("Datos de salida");
      removeButton("Enviar a revisión");
      removeButton("Enviar a aprobación");
      removeButton("Escalar");
      removeButton("Incluir Expediente");
      removeButton("Metadatos");
      removeButton("Rechazos de clonación");
    }

    if (isEscalado.value && !isEscalador.value) {
      removeButton("Gestion de escalamiento");
    }

    if (isEscalado.value && isEscalador.value) {
      removeButton("Solicitud escalamiento");
      removeButton("Respuesta escalamiento");
    }

    if (!isEscalado.value) {
      removeButton("Solicitud escalamiento");
      removeButton("Gestion de escalamiento");
      removeButton("Respuesta escalamiento");
    }

    if (
      responsePqrd.value.asignacionPqrdEntity?.estado.id == 5 ||
      responsePqrd.value.asignacionPqrdEntity?.estado.id == 8
    ) {
      removeButton("Metadatos");
      removeButton("Asignar ");
      addButton("Documento de salida", "drive_file_move");
      if (isMetadatos.value) {
        addButton("Metadatos ", "folder_open");
      }
    }

    if (responsePqrd.value.asignacionPqrdEntity?.estado.id == 5) {
      addButton("Datos de salida", "send");
    }

    if (responsePqrd.value.asignacionPqrdEntity?.estado.id == 11) {
      removeButton("Metadatos");
      removeButton("Asignar ");
      removeButton("Reasignar");
    }

    if (
      data.value.canalRadicacion?.id == 5 &&
      auth.$state.userInfo.role == "Defensor"
    ) {
      removeButton("Metadatos");
      removeButton("Asignar ");
      removeButton("Reclasificar Trámite");
      removeButton("Asignar");
      addButton("Documento de salida", "drive_file_move");
    }

    if (isRevisor.value) {
      removeButton("Enviar a revisión");
      removeButton("Enviar a aprobación");
      removeButton("Reclasificar Trámite");
      removeButton("Asignar");
      removeButton("Datos de salida");
    }
    if (auth.userInfo.role == "Revisor") {
      addButton("Trazabilidad de Documento", "description");
    }
    if (data.value.canalRadicacion.id == 5) {
      removeButton("Enviar a aprobación");
    }

    if (responsePqrd.value.estado.id == 4) {
      addButton("Escalar", "move_down");
    }

    if (responsePqrd.value.estado.id == 12) {
      removeButton("Metadatos");
      addButton("Solicitud reclasificación", "shuffle");
    }

    if (responsePqrd.value.estado.id == 1) {
      removeButton("Solicitud reclasificación");
    }

    if (responsePqrd.value.estado.id == 12) {
      removeButton("Metadatos");
      addButton("Solicitud reclasificación", "shuffle");
    }
    if (
      auth.userInfo.role == "Gestionador" &&
      responsePqrd.value.estado.id === 4
    ) {
      addButton("Reinicio de gestión", "move_up");
    }

    // if (state.value == 'Para gestión') {
    //   removeButton("Metadatos")
    // } else {
    //   addButton('Metadatos', "folder_open")
    // }
    if (defensorApro.value) {
      addButton("Metadatos", "folder_open");
    }
    if (
      ["Gestionador", "Revisor", "Aprobador"].includes(auth.userInfo.role) &&
      responsePqrd.value.numeroAprobaciones > 0
    ) {
      removeButton("Documento de salida");
    }

    if (["Gestionador", "Revisor", "Aprobador"].includes(auth.userInfo.role)) {
      if (responsePqrd.value.numeroAprobaciones > 0) {
        addButton("Segundo radicado de salida", "description");
      } else {
        removeButton("Segundo radicado de salida");
      }
    }

    isClonado.value = responseMetadatos.value?.pqrd?.isClonado;

    if (isClonado.value === true) {
      removeButton("Asignar");
      // removeButton("Reasignar");
      removeButton("Reclasificar Trámite");
    }

    if (auth.userInfo.role == "Gestionador") {
      addButton("Escalar", "move_down");
      addButton("Reinicio de gestión", "move_up");
      if (responsePqrd.value?.escalado) {
        addButton("Gestion de escalamiento", "move_up");
      }
    }
  } catch (error) {
    toast.error("Ocurrió un error al obtener los datos del caso.");
    await router.push("/bandeja");
  }
  // try {
  //   // const id = route.params.id;
  //   // const solicitudReclasificacion = await sgdeaAxios.get(`pqrd/reclasificacionPqrd/${id}`);
  //   // data.value.solicitudReclasificacion = solicitudReclasificacion.data;
  //   // if (data.value?.solicitudReclasificacion?.reclasificarTramite && !data.value?.solicitudReclasificacion?.estado == 'RECHAZADO') {
  //   //   removeButton("Reclasificar Trámite");
  //   // } else if (data.value?.solicitudReclasificacion?.reclasificarTramite && (data.value?.solicitudReclasificacion?.estado == 'RECHAZADO' || !data.value?.solicitudReclasificacion?.estadoProceso)) {
  //   //   removeButton("Reclasificar Trámite")
  //   // } else {
  //   //   removeButton("Solicitud reclasificación");
  //   // }
  // } catch (error) {
  //   removeButton("Solicitud reclasificación");
  // }
  try {
    if (isEscalado.value) {
      const id = route.params.id;
      if (!data.value.asignacionPqrdEntity) {
        state.value = "Escalamiento";
        const { data: escalamiento } = await sgdeaAxios.get(
          `/pqrd/escalamientos/asignado/${getUserInfo().userid}?pqrdId=${id}`
        );
        addButton("Solicitud escalamiento", "description");
        removeButton("Asignar ");
        removeButton("Metadatos");
        escalamientoId.value = escalamiento.find((e) => e.pqrd.id == id);
        if (escalamientoId.value?.aprobado) {
          addButton("Respuesta escalamiento", "description");
        }
      } else {
        const { data: escalamiento } = await sgdeaAxios.get(
          `/pqrd/escalamientos/escalador/%7BescaladorId%7D?escaladorId=${data.value.asignacionPqrdEntity.gestionador.id}&pqrdID=${id}`
        );
        escalamientoId.value = escalamiento;
      }
    }
  } catch (error) {
    toast.error("Ocurrió un error al obtener los datos de escalamiento");
  }
};
const fetchDatosSalida = async () => {
  const id = route.params.id;
  const { data } = await sgdeaAxios.get(`/pqrd/obtener-datos-salida/${id}`);
  responseDatosSalida.value = data;
  datosSalida.value = data;
};

const getFormattedName = (user) => {
  try {
    if (user && user?.firstname) {
      return `${user.firstname.trim().charAt(0).toUpperCase()}. ${
        user.lastname && user.lastname.trim().length > 0
          ? user.lastname.charAt(0).toUpperCase() +
            user.lastname.substring(1).toLowerCase()
          : ""
      }`;
    }
    return "";
  } catch (error) {
    console.error(error);
    return "";
  }
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

const getPlantillaSinPrefijo = async () => {
  const nodeid = process.env.NODE_SIN_PREFIJO;

  const response = await sgdeaAxios.get<any>(
    `/radicados/consultar_documento/${nodeid}`,
    { showLoader: false }
  );

  return response.data;
};

const getDocSalida = async () => {
  const docResponse = await sgdeaAxios.get(
    `/pqrd/documentosSalidaAsociadosAunPqrd?idPqrd=${route.params.id}`
  );
  responseDocSalida.value = docResponse.data;
  htmlContent.value;
};

const dataClonado = ref();
const getClonado = async () => {
  try {
    const response = await sgdeaAxios.get(
      `/pqrd/documentosSalidaAsociadosAunPqrdClonado?idPqrd=${route.params.id}`,
      { showLoader: false }
    );
    dataClonado.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

const getDocFromClonado = async () => {
  const header = `
        <span id="header" style="text-align: left; font-size: 14px; font-family: Arial, sans-serif;" >
          <p style="margin: 0;">Señor(a):</p>
          <p style="margin: 0;">${referentKey.NombredeDestinatario ?? ""}</p>
          ${
            referentKey.DireccionDeDestinatario
              ? `<p style="margin: 0;">Dirección: ${
                  referentKey.DireccionDeDestinatario ?? ""
                }</p>`
              : ""
          }
          ${
            referentKey.TelefonoDeDestinatario
              ? `<p style="margin: 0;">Telefono: ${
                  referentKey.TelefonoDeDestinatario ?? ""
                }</p>`
              : ""
          }
          ${
            referentKey.CorrreoDestinatario
              ? `<p style="margin: 0;">Correo: ${
                  referentKey.CorrreoDestinatario ?? ""
                }</p>`
              : ""
          }
  <p style="margin: 0;">${
    referentKey.DepartamentoYMunicipioDestinatario ?? ""
  }</p>
  <br />
  <p style="margin: 0;">
     <strong>Asunto: ${referentKey.asunto ?? ""}</strong>
  </p>
  <br />
</span>
`;
  // Validar si hay texto guardado y que sea solo del usuario clonado actual
  const htmlFromCloned = dataClonado.value
    ? dataClonado.value.filter(
        (clone) => clone.usuarioCreadorId === auth.userInfo.userid
      )
    : [];
  htmlContent.value =
    htmlFromCloned.length > 0 ? header + htmlFromCloned[0].htmlContent : "";
  dinamicSentence.value =
    htmlFromCloned.length > 0 ? htmlFromCloned[0].htmlContent : "";
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
    showModalFinal.value = true;
  }
};

async function getDimanicDatos() {
  const user = auth?.$state?.userInfo;
  const rolUserId = user.relations.find((it) => it.rol === user.role);

  const { data: getDimanicDatos } = await sgdeaAxios.get(
    `/parametrizacion-formulario/ListadoParametrizacion?id_flujo=5&id_rol=${
      rolUserId.idRol
    }&id_oficina=${user.oficina ? user.oficina : ""}&id_estado_proceso=${
      responsePqrd.value.estado.id
    }`,{ showLoader: false }
  );

  if (getDimanicDatos.content.length > 0) {
    metadatos.value = getDimanicDatos.content;
    isMetadatos.value = true;
  } else {
    isMetadatos.value = false;
  }
}

const getBlobToIframe = async (id, list) => {
  visibleDoscRead.value = true;
  const { data } = await sgdeaAxios.get<DocumentoRadicado>(
    `/radicados/consultar_documento/${id}`,
    { showLoader: false }
  );

  if (id) {
    tabsFiles.value = data.name;
  }

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
    listForVizualiser.value = list.filter(
      (it) => it.formato.toLowerCase() === "application/pdf"
    );
  }
  visibleDoscRead.value = false;
};

const callDisableRechazarButtonAtFourThirtyPM = () => {
  // Calculate the time for the next 4:30 PM
  const now = new Date();
  const targetTime = new Date();
  targetTime.setHours(16, 30, 0, 0); // Set target time to 4:30 PM (hours, minutes, seconds, milliseconds)

  // Calculate the time difference until 4:30 PM
  let timeDifference = targetTime.getTime() - now.getTime();

  // If target time has already passed today, calculate the difference for tomorrow
  if (timeDifference < 0) {
    timeDifference += 1000 * 60 * 60 * 24; // Add one day in milliseconds
  }

  // Set the interval to trigger only once at the calculated time
  intervalId.value = setTimeout(() => {
    disableButtonRechazarAfterThreeDaysSinceRadication();
  }, timeDifference);
};
const trazaDocument = ref();
const gettrazabilidadDocumento = async () => {
  if (documentSalidaData.value) {
    try {
      const response = await sgdeaAxios.get(
        `/api/documentos/PQRD/${documentSalidaData.value.id}/historial`
      );
      trazaDocument.value = response.data;
    } catch {
      toast.error("Ha ocurrido un error al obtener la información");
    }
  }
};

const handleUpdate = () => {
  incrementaKey.value++;
};

onBeforeUnmount(() => {
  clearInterval(intervalId.value);
});
const documentSalidaData = ref();
const getDoc = async () => {
  const docResponse = await sgdeaAxios.get(
    `/pqrd/documentosSalidaAsociadosAunPqrd?idPqrd=${route.params.id}`
  );
  htmlContent.value = docResponse.data[0]?.htmlContent;
  documentSalidaData.value = docResponse.data[0];
  await gettrazabilidadDocumento();
};

onMounted(async () => {
  await initData();
  if (route.params.id) {
    await getAllRegisters();
    await fetchDatosSalida();
    await getData();

    if (isEscalado.value) {
      await loadEscalamientoData();
    }
  }

  callDisableRechazarButtonAtFourThirtyPM();
  await getDocList();
  readOnlyGestionador.value =
    auth.userInfo.role == "Gestionador" && state.value == "Por aprobar"
      ? true
      : false;
  if (readOnlyGestionador.value || isAsignador.value) {
    removeButton("Metadatos");
    removeButton("Reasignar");
  }
});

const getDocList = async () => {
  try {
    const response = await sgdeaAxios.get(
      `/pqrd/listar-parrafos-documento-salida/${data.value.id}`
    );

    if (response.status === 200) {
      dataClonado.value = response.data.map((paragraph) => ({
        id: paragraph?.id,
        htmlContent: paragraph?.parrafo,
        usuarioCreadorId: paragraph?.gestionador_id,
        nombreUsuarioCreador: `${paragraph?.nombre_gestionador?.trim() || ""} ${
          paragraph?.apellido_gestionador?.trim() || ""
        }`.trim(),
        isProcesadoPorClonado: paragraph?.aceptado || paragraph?.rechazado,
        procesoClonacionTerminado: true,
        moduloActual: "PQRD",
      }));
    } else {
      dataClonado.value = [];
    }
  } catch (error) {
    if (error.response?.status === 404) {
      console.warn("Documento no encontrado.");
    } else {
      toast.error("Ocurrió un error al obtener los documentos de salida");
    }
  }
};

function removeButton(label) {
  const index = items.value.findIndex((item) => item.label === label);

  if (index !== -1) {
    items.value.splice(index, 1);
  }
}

function addButton(label, icon) {
  const isButtonExists = items.value.some(
    (item) => item.label === label && item.icon === icon
  );

  if (!isButtonExists) {
    items.value.push({
      label: label,
      icon: icon,
    });
  }
}

function addButtonWithPosition(label, icon, index) {
  if (index > items.value.length) index = items.value.length;
  const isButtonExists = items.value.some(
    (item) => item.label === label && item.icon === icon
  );

  if (!isButtonExists) {
    items.value.splice(index, 0, { label, icon });
  }
}

function rejectedTypes(fileEntries) {
  if (!fileEntries.length) return;
  if (fileEntries[0]?.file.size >= 50 * 1024 * 1024) {
    toast.error("El peso máximo permitido es de 50MB");
  } else {
    const allowedFileTypes = [
      "pdf",
      "png",
      "jpg",
      "jpeg",
      "webp",
      "bmp",
      "txt",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "mp3",
      "mp4",
      "avi",
      "csv",
      "zip",
      "rar",
      "ppt",
      "pptx",
      "eml",
      "msg",
    ];
    const fileTypes = fileEntries.map((entry) =>
      entry.file.name.split(".").pop()
    );
    const invalidFileTypes = fileTypes.filter(
      (type) => !allowedFileTypes.includes(type)
    );

    if (invalidFileTypes.length > 0) {
      toast.error(
        "El formato que está intentando cargar no se encuentra permitido, solo se manejan formatos de tipo pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
      );
    }
  }
}

function rejectedTypesRepDef(fileEntries) {
  if (!fileEntries.length) {
    return;
  }

  if (fileEntries[0]?.file.size >= 50 * 1024 * 1024) {
    toast.error("El peso máximo permitido es de 50MB");
  } else {
    const fileTypes = fileEntries.map((entry) =>
      entry.file.name.split(".").pop()
    );
    const invalidFileTypes = fileTypes.filter((type) => type !== "Pdf");

    if (invalidFileTypes.length > 0) {
      toast.error("Error, el documento adjunto no es extensión PDF");
    }
  }
}

const SaveNewDoc = () => {
  refSalida.value.finalDocument();
};

const escalado = ref(false);

async function initData() {
  try {
    if (
      ["Asignador Responsable", "Radicador", "Administrador"].includes(
        auth.userInfo.role
      )
    ) {
      maxFiles.value = 10;
      messageDocuments.value = `Puede adjuntar  ${maxFiles.value} Archivo cada uno con un tamaño permitido <br/> de 50MB en cualquiera de las siguientes extenciones <br/>(pdf, png, jpg, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, <br/> jpeg, bmp, zip, rar, ppt, pptx)`;
    } else if (
      [
        "Gestionador",
        "Gestionador Consolidador",
        "Gestionador Escalador",
        "Consolidador",
      ].includes(auth.userInfo.role)
    ) {
      maxFiles.value = 30;
      messageDocuments.value = `Puede adjuntar  ${maxFiles.value} Archivo cada uno con un tamaño permitido <br/> de 50MB en cualquiera de las siguientes extenciones <br/>(pdf, png, jpg, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, <br/> jpeg, bmp, zip, rar, ppt, pptx)`;
    }
    const id = route.params.id;
    const response = await sgdeaAxios.get(
      "pqrd/getMetadatosByPqrdId?pqrdId=" + id
    );
    if (response.status == 200) {
      responseMetadatos.value = response.data;

      escalado.value = response.data.pqrd.isEscalado || false;
    } else {
      removeButton("Asignar");
      // removeButton("Reasignar");
    }

    const responseDef = await sgdeaAxios.get(
      "pqrd/getMetadatosDefensorByPqrdId?pqrdId=" + route.params.id
    );
    if (responseDef.status == 200) {
      responseMetadatos.value = {
        ...responseMetadatos.value,
        ...responseDef.data,
      };
    }

    if (
      response.data.compromisosProximos &&
      auth.userInfo.role.includes("Gestionador")
    ) {
      // addButton("Primer radicado de salida", "description");
      addButton("Segundo radicado de salida", "description");
    } else {
      // removeButton("Primer radicado de salida");
      removeButton("Segundo radicado de salida");
    }
  } catch (error) {
    removeButton("Asignar");
    removeButton("Reasignar");
    // removeButton("Primer radicado de salida");
    removeButton("Segundo radicado de salida");
  }
}

const showComponents = (name: string) => {
  if (
    name == "Nuevo Documento de Salida" &&
    data.value.estado?.estado == "Devolucion"
  ) {
    newDocModal.value = true;
    labelComponet.value = "Documento de salida";
  } else {
    labelComponet.value = name;
  }
};

const updateModal = async (value) => {
  form.value.motivoRechazo = value.value;
  showModalConfrim.value = true;
};

const updateModalDefensor = async (value) => {
  form.value.motivoRechazoDefensor = value.value;
  showModalConfrimRechazoDefensor.value = true;
};

const updateModalRevision = async (value) => {
  motivoRechazoRevision.value = value.value;
  showModalConfirmRevision.value = true;
};

const updateModalAprobador = async (value) => {
  motivoRechazoAprobador.value = value.value;
  showModalConfirmAprobador.value = true;
};

const updateModalApruebaRevision = async (value) => {
  showModalConfirmAprobacionRevision.value = true;
};

const updateModalRespDefensor = async () => {
  if (!(await respDefForm.value.validate())) {
    toast.error(
      "Debe diligenciar los campos obligatorios para continuar con el proceso"
    );
    return;
  }
  if (respDefensor.value.length < 2) {
    toast.error('Error, falta un documento adjunto "Obligatorio 2 documentos"');
    return;
  }

  try {
    const formdata = new FormData();
    for (let i = 0; i < respDefensor.value.length; i++) {
      formdata.append("files", respDefensor.value[i]);
    }
    const response = await sgdeaAxios.post(
      `/pqrd/adjuntarSoportesDefensor/${data.value.id}?user=${auth.userInfo.userid}&tipoDocumento=DEFENSOR`,
      formdata
    );

    if (response.status === 200) {
      toast.success("Entrega exitosa");
      await router.push("/bandeja");
    }
  } catch (error) {
    toast.error("Ha ocurrido un error");
  }
};

const hideModal = (value) => {
  showModal.value = value;
};

const hideModalRechazoDefensor = (value) => {
  showModalRechazarDefensor.value = value;
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

const handleChangeDocType = async () => {
  // TODO: agregar integración para cambiar tipo de documentos
  try {
    const data = loadedDocsToChangeType.value
      .filter((a) => a.tipo !== "De Entrada")
      .map((it) => ({
        id: dbDocs.value.find((itFile) => itFile.nodeId === it?.id)?.id ?? null,
        nodeId: it.id,
        tipo: esSalida.value ? "De salida" : "De gestión",
        pqrdId: route.params.id,
      }));

    const response = await sgdeaAxios.put("/pqrd/cambiarTipoDocumento", data);
    if (response.status == 200) {
      toast.success("Tipo de documento cambiado correctamente.");
      await crearTrazabilidad({
        proceso: "PQRD" + responsePqrd.value.id,
        secuencia: responsePqrd.value.idRadicado,
        estado: responsePqrd.value.estado.estado,
        descripcion: `Usuario:${auth.$state.userInfo.name} Descripción: Cambio el tipo de documento para ${loadedDocsToChangeType.value.length} archivos a ${data[0].tipo}`,
        comentario: `Adjunto`,
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} cambio el tipo de documento para ${loadedDocsToChangeType.value.length} archivos a ${data[0].tipo}`,
        tramite:
          responsePqrd.value.informacionSolicitud.tipologiaEntity.id == 7
            ? "PQRD Express"
            : "PQRD",
      });
      loadedDocsToChangeType.value = [];
      finished.value = true;
      modalChangeDocType.value = false;
      showChangeDocType.value = false;
    }
  } catch (error) {
    toast.error("Ocurrió un error al cambiar el tipo de documento");
  }
};

async function getAllRegisters() {
  try {
    const { data: files }: { data: DocsBD[] } = await sgdeaAxios.get(
      `/pqrd/obtenerDocs?idPqrd=${route.params.id}`,
      {showLoader: false}
    );
    dbDocs.value = files;

    listDocs.value = files
      ?.map((it) => ({
        formato: it.nombre.substring(it.nombre.lastIndexOf('.') + 1),
        nombre: it.nombre,
        fecha: fourthFormatDate(it.fechaCargue),
        cargado_por: it.usuario,
        tipo: it.tipo,
        id: it.nodeId,
      }))
      .filter((it) => !it.tipo.includes("Respuesta"));
    loadingDocs.value = false;
  } catch (error) {
    toast.error("Ocurrió un error al obtener los documentos.");
    loadingDocs.value = false;
  }
}

async function handleUploadFile() {
  const files: File[] | File = newFileInput.value;

  if ((Array.isArray(files) && files.length === 0) || files === null) {
    toast.error("Debe seleccionar un archivo y/o seleccionar una opción.");
    return;
  }

  let isEntrada =
    auth.$state.userInfo.role == "Administrador" ||
    auth.$state.userInfo.role == "Asignador Responsable" ||
    auth.$state.userInfo.role.includes("Radicador");

  const formData = new FormData();
  let fileNames = "";
  for (const file of Array.isArray(files) ? files : [files]) {
    fileNames += file.name + ", ";
    formData.append("anexos", file);
  }
  fileNames = fileNames.slice(0, -2);

  formData.append("idRadicado", responsePqrd.value.nodeID);
  formData.append(
    "descripcionRadicado",
    isEntrada ? "De Entrada" : esSalida.value ? "De salida" : "De gestión"
  );
  formData.append("usuarioId", auth.$state.userInfo.userid);
  try {
    const { data } = await sgdeaAxios.post(
      "/api/v1/integracion/alfresco/agregarAnexos",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          pqrd: route.params.id,
        },
      }
    );

    if (data) {
      toast.success("Se realizó el cargue correctamente");
      await crearTrazabilidad({
        proceso: "PQRD" + responsePqrd.value.id,
        secuencia: responsePqrd.value.idRadicado,
        estado: responsePqrd.value.estado.estado,
        descripcion: `Usuario: ${
          auth.$state.userInfo.name
        } Documentos: ${fileNames} Tipo: ${
          esSalida.value ? "De salida" : "De gestión"
        }`,
        comentario: "Adjunto",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} añadió documento(s) a la PQRD`,
        tramite:
          responsePqrd.value.informacionSolicitud.tipologiaEntity.id == 7
            ? "PQRD Express"
            : "PQRD",
      });
      modalDocuments.value = false;
      getData();
      newFileInput.value = [];
    }
  } catch (error) {
    toast.error("Está intentando cargar el mismo archivo más de una vez");
  }
  getAllRegisters();
}

const openModalDocument = () => {
  modalDocuments.value = true;
  if (auth.userInfo.role == "Asignador Responsable") {
    isAsignador.value = true;
  }
};

const enableEditGestion = async () => {
  try {
    if (clonadoPqrd.value) {
      await sgdeaAxios.put(
        `/pqrd/iniciar-gestion-consolidacion/${responsePqrd.value.id}/${data.value.asignacionPqrdEntity.idAsignacion}`
      );
    } else {
      await sgdeaAxios.put(`/pqrd/editarEstadoPqrd/${responsePqrd.value.id}/4`);
    }

    const response = await sgdeaAxios.patch(
      `/pqrd/gestionar-asignacion/${data.value.asignacionPqrdEntity.idAsignacion}`
    );
    if (response.status == 200) {
      await getData();
      await crearTrazabilidad({
        proceso: "PQRD" + responsePqrd.value.id,
        secuencia: responsePqrd.value.idRadicado,
        estado: responsePqrd.value.estado.estado,
        descripcion: `Usuario: ${auth.$state.userInfo.name} Descripción: Se ha iniciado la gestion del radicado `,
        comentario: "Adjunto",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} inició la gestión del radicado ${responsePqrd.value.idRadicado}`,
        tramite:
          responsePqrd.value.informacionSolicitud.tipologiaEntity.id == 7
            ? "PQRD Express"
            : "PQRD",
      });
      if (clonadoPqrd.value && !isConsolidador.value) {
        addButton("Documento de salida", "send");
      } else if (clonadoPqrd.value && isConsolidador.value) {
        addButton("Documento de salida", "drive_file_move");
        //addButton("Segundo radicado de salida", "description");
        addButton("Datos de salida", "send");
        addButton("Incluir Expediente", "description");
        addButton("Metadatos", "folder_open");
        addButton("Rechazos de clonación", "assignment");
        addButton("Enviar a revisión", "rate_review");
        if (data.value.canalRadicacion.id !== 5) {
          addButton("Enviar a aprobación", "task_alt");
        }
        addButton("Trazabilidad de Documento", "description");
      } else {
        addButton("Escalar", "move_down");
        addButton("Documento de salida", "drive_file_move");
        //addButton("Segundo radicado de salida", "description");
        addButton("Datos de salida", "send");
        addButton("Incluir Expediente", "description");
        addButton("Metadatos", "folder_open");
        addButton("Enviar a revisión", "rate_review");
        if (data.value.canalRadicacion.id !== 5) {
          addButton("Enviar a aprobación", "task_alt");
        }
        addButton("Trazabilidad de Documento", "description");
      }
    }
  } catch (error) {
    toast.error("Hubo un error al habilitar la edición de gestión.");
  }
};

const confirmModal = async () => {
  const userInfo = await getUserInfo();
  const userId = userInfo.userid;

  const url = isConsolidador.value
    ? "pqrd/rechazar-asignacion"
    : "pqrd/solicitar-rechazo-asignacion";
  const descripcion = isConsolidador.value
    ? "ha rechazado la clonación de la PQRD"
    : "ha enviado una solicitud de rechazo de clonación";

  try {
    const response = await sgdeaAxios.post(`/${url}/${data.value?.id}`, {
      id_gestionador: userId,
      motivo_rechazo: form.value.motivoRechazo,
    });
    toast.success("El caso fue rechazado correctamente.");
    const dataTrazabilidad = {
      proceso: `PQRD${data.value.id}`,
      secuencia: data.value.idRadicado,
      estado: data.value.estado.estado,
      descripcion: `Usuario: ${auth.$state.userInfo.name} Motivo: ${form.value.motivoRechazo} `,
      comentario: "Rechazado",
      nombre: auth.$state.userInfo.name,
      accion: `${auth.$state.userInfo.name} ${isClonado.value ? descripcion : 'ha rechazado la gestión'}`,
      tramite: "PQRD",
    };
    const crearTrazabilidad = await sgdeaAxios.post(
      "/trazabilidad/crear",
      dataTrazabilidad
    );
    await router.push("/bandeja");
  } catch (error) {
    if (!error.response?.data?.status) {
      toast.error("No se encontró la asignación o ya fue rechazada");
      await router.push("/bandeja");
    }
  }

  showModalConfrim.value = false;
  showModal.value = false;
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

const onFinal = async () => {
  try {
    const response = await sgdeaAxios.post(
      "/pqrd/crear-parrafo-documento-salida",
      {
        parrafo: dinamicSentence.value,
        id_asignacion: data.value.asignacionPqrdEntity.idAsignacion,
      }
    );

    if (response.status == 200 || response.status == 201) {
      const dataTrazabilidad = {
        proceso: `PQRD${data.value.id}`,
        secuencia: data.value.idRadicado,
        estado: data.value.estado.estado,
        descripcion: "Se ha enviado el parrafo dinamico de salida de la PQRD",
        comentario: "Radicado",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} envió su parrafo dinamico para la PQRD`,
        tramite: "PQRD",
      };
      const crearTrazabilidad = await sgdeaAxios.post(
        "/trazabilidad/crear",
        dataTrazabilidad
      );

      finalModal.value = true;
    }
  } catch (error) {
    toast.error("Ocurrió un problema al enviar el parrafo dinámico.");
  }
};

const aprobarEscalamiento = async () => {
  try {
    const response = await sgdeaAxios.patch(
      `/pqrd/escalamiento/aprobar/${escalamientoData.value[0].id}`
    );
    if (response.status == 200) {
      toast.success("El escalamiento se ha aceptado para gestión con éxito");
      await crearTrazabilidad({
        proceso: "PQRD" + responsePqrd.value.id,
        secuencia: responsePqrd.value.idRadicado,
        estado: responsePqrd.value.estado.estado,
        descripcion: `Usuario: ${auth.$state.userInfo.name} Descripción: Se ha aceptado una solicitud de escalamiento`,
        comentario: "Solicitud de escalamiento aceptada",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} ha aceptado la solicitud de escalamiento de la PQRD ${responsePqrd.value.idRadicado}`,
        tramite:
          responsePqrd.value.informacionSolicitud.tipologiaEntity.id == 7
            ? "PQRD Express"
            : "PQRD",
      });
      await getData();
    }
  } catch (error) {
    toast.error("Hubo un error al aceptar el escalamiento.");
  } finally {
    gestionarEscala.value = false;
  }
};

const rechazarEscalamiento = async () => {
  try {
    if (motivoRechazoEscala.value) {
      const response = await sgdeaAxios.patch(
        `/pqrd/escalamiento/rechazar/${escalamientoId.value[0].id}`,
        {
          motivoRechazo: motivoRechazoEscala.value,
        }
      );
      if (response.status == 200) {
        await crearTrazabilidad({
          proceso: "PQRD" + responsePqrd.value.id,
          secuencia: responsePqrd.value.idRadicado,
          estado: responsePqrd.value.estado.estado,
          descripcion:
            `Usuario: ${auth.$state.userInfo.name} \n ` +
            `Motivo:${motivoRechazoEscala.value} \n `,
          comentario: "Solicitud de escalamiento rechazada",
          nombre: auth.$state.userInfo.name,
          accion: `${auth.$state.userInfo.name} ha rechazado la solicitud de escalamiento de la PQRD ${responsePqrd.value.idRadicado}`,
          tramite:
            responsePqrd.value.informacionSolicitud.tipologiaEntity.id == 7
              ? "PQRD Express"
              : "PQRD",
        });
        toast.success("El escalamiento fue rechazado correctamente.");
        rechazarEscala.value = false;
        await router.push("/bandeja");
      }
    } else {
      toast.error("Debe diligenciar el campo de observaciones");
    }
  } catch (error) {
    toast.error("Hubo un error al rechazar el escalamiento.");
  }
};

const aprobarRevision = async () => {
  try {
    const response = await sgdeaAxios.post(
      `/pqrd/RevisionPqrdParaAprobar`,
      null,
      {
        params: {
          idAsignacion: data.value.asignacionPqrdEntity.idAsignacion,
          idPqrd: data.value.id,
        },
      }
    );
    if (response.status == 200) {
      //const response = await sgdeaAxios.put(`pqrd/editarEstadoAsignacionPqrd/${data.value.asignacionPqrdEntity.idAsignacion}/8`)
      toast.success("La respuesta proyectada tiene su visto bueno");

      if (changeRevisor.value == true) {
        await crearTrazabilidadDocumento(
          {
            htmlContent: responseDocSalida?.value[0]?.htmlContent || "",
            usuario: auth.userInfo.name,
            rol: auth.userInfo.role,
          },
          responseDocSalida.value[0].id,
          "PQRD"
        );
      }

      const dataTrazabilidad = {
        proceso: `PQRD${data.value.id}`,
        secuencia: data.value.idRadicado,
        estado: data.value.estado.estado,
        descripcion: `Usuario:${auth.$state.userInfo.name} Aprobador:${
          data.value.asignacionPqrdEntity?.aprobador.firstname +
          " " +
          data.value.asignacionPqrdEntity?.aprobador.lastname
        } Descripción: Se ha dado visto bueno a la respuesta proyectada`,
        comentario: "Aprobada",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} dió visto bueno a la respuesta proyectada para la PQRD`,
        tramite: "PQRD",
      };
      const crearTrazabilidad = await sgdeaAxios.post(
        "/trazabilidad/crear",
        dataTrazabilidad
      );
      await router.push("/bandeja");
    }
  } catch (error) {
    toast.error("Hubo un error al aprobar la respuesta proyectada.");
  } finally {
    gestionarEscala.value = false;
  }
};

const rechazarRevision = async () => {
  try {
    const response = await sgdeaAxios.post(`/pqrd/RevisionPqrdParaRechazar`, {
      idPqrd: data.value.id,
      observacionRechazo: motivoRechazoRevision.value,
      idEstado: 4,
    });
    if (response.status == 200) {
      await sgdeaAxios.put(
        `/pqrd/editarEstadoPqrd/${responsePqrd.value.id}/13`
      );
      await sgdeaAxios.put(
        `/pqrd/editarEstadoAsignacionPqrd/${data.value.asignacionPqrdEntity.idAsignacion}/13`
      );
      toast.success("La respuesta proyectada fue rechazada.");
      if (changeRevisor.value === true) {
        await crearTrazabilidadDocumento(
          {
            htmlContent: responseDocSalida.value[0].htmlContent,
            usuario: auth.userInfo.name,
            rol: auth.userInfo.role,
          },
          responseDocSalida.value[0].id,
          "PQRD"
        );
      }
      const dataTrazabilidad = {
        proceso: `PQRD${data.value.id}`,
        secuencia: data.value.idRadicado,
        estado: data.value.estado.estado,
        descripcion: `Revisor:${auth.$state.userInfo.name} Motivo: ${motivoRechazoRevision.value}`,
        comentario: "Rechazado",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} rechazó la respuesta proyectada para la PQRD`,
        tramite: "PQRD",
      };
      const crearTrazabilidad = await sgdeaAxios.post(
        "/trazabilidad/crear",
        dataTrazabilidad
      );
      await router.push("/bandeja");
    }
  } catch (error) {
    toast.error("Hubo un error al rechazar la respuesta proyectada.");
  } finally {
    rechazarEscala.value = false;
  }
};

const aprobarCasoAprobador = async (data) => {
  aprobado.value = true;
  saveAprobacion(data);
};
function beforeAprobacion() {
  loadingEnvios.value = true;
  aprobadoDocSal.value = true;
}

const nodeIdAprobado = ref<Blob | null>(null);

const saveAprobacion = async (dataFile) => {
  try {
    // const response = await sgdeaAxios.patch(`/pqrd/aprobarCasoAprobador`, {
    //   idAsignacion: data.value.asignacionPqrdEntity.idAsignacion,
    //   medioRepuesta:
    //     data.value?.informacionContacto?.medioRespuestaEntity?.id ?? null,
    //   aprobadorId: auth.userInfo.userid,
    // });

    // Radicar el documento salida
    const formData = new FormData();

    // const radicadoSalida = await sgdeaAxios.get("/generar/secuencia/SAL");

    // Append file to the form
    formData.append("files", dataFile);
    formData.append(
      "idAsignacion",
      data.value.asignacionPqrdEntity.idAsignacion
    );
    formData.append("aprobadorId", auth.userInfo.userid);

    const response = await sgdeaAxios.post("/pqrd/radicarCasoAprobar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    idRadicacion.value = response.data?.secuenciaSalida;
    nodeIdAprobado.value = response.data?.nodeId;

    if (response.status == 200) {
      //const response = await sgdeaAxios.put(`pqrd/editarEstadoAsignacionPqrd/${data.value.asignacionPqrdEntity.idAsignacion}/8`)
      toast.success("Se realizó la aprobación  del radicado de manera exitosa");

      const dataTrazabilidad = {
        proceso: `PQRD${data.value.id}`,
        secuencia: data.value.idRadicado,
        estado: data.value.estado.estado,
        descripcion: "Se ha aprobado",
        comentario: "Aprobada",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} dió visto bueno a la respuesta proyectada para la PQRD`,
        tramite: "PQRD",
      };
      await sgdeaAxios.post(
        "/trazabilidad/crear",
        dataTrazabilidad
      );
      showModalExitoApro.value = true;
      // await router.push("/bandeja");
    }
  } catch (error) {
    toast.error("Hubo un error al aprobar el radicado.");
  } finally {
    gestionarEscala.value = false;
  }
};

const rechazarAprobacion = async () => {
  try {
    const response = await sgdeaAxios.patch(`/pqrd/rechazarCasoAprobador`, {
      idAsignacion: data.value.asignacionPqrdEntity?.idAsignacion,
      observacion: motivoRechazoAprobador.value,
    });
    if (response.status == 200) {
      toast.success("Se realizó el rechazo del radicado de manera exitosa");
      if (changeAprobador.value == true) {
        await crearTrazabilidadDocumento(
          {
            htmlContent: responseDocSalida.value[0].htmlContent,
            usuario: auth.userInfo.name,
            rol: auth.userInfo.role,
          },
          responseDocSalida.value[0].id,
          "PQRD"
        );
      }
      const dataTrazabilidad = {
        proceso: `PQRD${data.value.id}`,
        secuencia: data.value.idRadicado,
        estado: data.value.estado.estado,
        descripcion: `Aprobador: ${auth.$state.userInfo.name} Motivo:${motivoRechazoAprobador.value}`,
        comentario: "Rechazado",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} rechazó la aprobación de la PQRD`,
        tramite: "PQRD",
      };
      const crearTrazabilidad = await sgdeaAxios.post(
        "/trazabilidad/crear",
        dataTrazabilidad
      );
      await router.push("/bandeja");
    }
  } catch (error) {
    toast.error("Hubo un error al rechazar el radicado.");
  } finally {
    rechazarEscala.value = false;
  }
};

const AprobarRevisionDefensor = async () => {
  try {
    const response = await sgdeaAxios.post(
      `/pqrd/RevisionPqrdParaAprobar`,
      null,
      {
        params: {
          idAsignacion: data.value.asignacionPqrdEntity.idAsignacion,
          idPqrd: data.value.id,
        },
      }
    );
    if (response.status == 200) {
      toast.success("La respuesta proyectada tiene su visto bueno");
      const dataTrazabilidad = {
        proceso: `PQRD${data.value.id}`,
        secuencia: data.value.idRadicado,
        estado: data.value.estado.estado,
        descripcion: "Se ha dado visto bueno a la respuesta proyectada",
        comentario: "Aprobada",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} dió visto bueno a la respuesta proyectada para la PQRD`,
        tramite: "PQRD",
      };
      await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad);
      await router.push("/bandeja");
    }
  } catch (error) {
    toast.error("Hubo un error al aprobar la respuesta proyectada.");
  }
};

const rechazarRevisionDefensor = async () => {
  try {
    const response = await sgdeaAxios.post(
      `/pqrd/rechazarSolicitudDefensorDelConsumidor/${data.value.id}`,
      {
        id_gestionador: data.value.asignacionPqrdEntity.gestionador.id,
        motivo_rechazo: form.value.motivoRechazoDefensor,
      }
    );
    if (response.status == 200) {
      await sgdeaAxios.put(`pqrd/editarEstadoPqrd/${data.value.id}/13`);
      toast.success("La respuesta proyectada fue rechazada.");
      const dataTrazabilidad = {
        proceso: `PQRD${data.value.id}`,
        secuencia: data.value.idRadicado,
        estado: data.value.estado.estado,
        descripcion: "La respuesta proyectada fue rechazada",
        comentario: "Rechazado",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} rechazó la respuesta proyectada para la PQRD`,
        tramite: "PQRD",
      };
      await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad);
      await router.push("/bandeja");
    }
  } catch (error) {
    toast.error("Hubo un error al rechazar la respuesta proyectada.");
  }
};

const submitFiles = async () => {
  if (await formFile.value.validate()) {
    const formdataApro = new FormData();
    for (let i = 0; i < filesApro.value.length; i++) {
      formdataApro.append("anexos", filesApro.value[i]);
    }

    formdataApro.append("idRadicado", responsePqrd.value.nodeID);
    formdataApro.append("descripcionRadicado", "De Entrada");
    formdataApro.append("usuarioId", auth.$state.userInfo.userid);

    try {
      const response = await sgdeaAxios.post(
        "/api/v1/integracion/alfresco/agregarAnexos",
        formdataApro,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: {
            pqrd: route.params.id,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Los documentos fueron adjuntados correctamente");
        filesApro.value = [];
        // await trazabilidad('AGREGAR_DOCS');
        await sendStepFinal();
        modalAprobar.value = false;
      }
    } catch (error) {
      toast.error("Ha ocurrido un error");
    }
  }
};

const sendStepFinal = async () => {
  try {
    const response = await sgdeaAxios.patch(`pqrd/pqrdEntregada`, null, {
      params: {
        id: data.value.id,
      },
    });
    if (response.status == 200) {
      // await sgdeaAxios.put(`/pqrd/editarEstadoPqrd/${responsePqrd.value.id}/14`)
      await sgdeaAxios.put(
        `pqrd/editarEstadoAsignacionPqrd/${data.value.asignacionPqrdEntity.idAsignacion}/14`
      );
      toast.success("Entrega exitosa.");
      const dataTrazabilidad = {
        proceso: `PQRD${data.value.id}`,
        secuencia: data.value.idRadicado,
        estado: data.value.estado.estado,
        descripcion: "La respuesta proyectada fue enviada al usuario",
        comentario: "Enviada al Usuario",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} envió la respuesta proyectada para la PQRD`,
        tramite: "PQRD",
      };
      await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad);
      await router.push("/bandeja");
    }
  } catch (error) {
    toast.error("Hubo un error al enviar la respuesta proyectada.");
  }
};

const addButtons = () => {
  addButtonWithPosition("Asignar", "move_up", 1);
  addButtonWithPosition("Reasignar", "move_up", 2);
};

const saveReasignacion = async (event) => {
  try {
    const payload: any = {
      idFlujo: 5,
      idCaso: data.value.id,
    };

    if (event.origen === "oficina") {
      payload.idOficina = [event.oficinaId];
    } else if (event.origen === "dependencia") {
      payload.idDependencia = [event.oficinaId];
    }

    const response = await sgdeaAxios.put(`/oficinas/reasignar`, payload);
    if (response.status == 200 || response.status == 201) {
      await crearTrazabilidad({
        proceso: `PQRD${data.value.id}`,
        secuencia: data.value.idRadicado,
        estado: data.value.estado.estado,
        descripcion: `Usuario: ${auth.$state.userInfo.name} Oficina anterior: ${
          auth.$state.userInfo.relations[0].oficina
            ? auth.$state.userInfo.relations[0].oficina
            : auth.$state.userInfo.relations[0].dependencia
        }
        Oficina nueva: ${event.oficinaAsignada} Motivo: ${
          event.motivoAsignacion
        }`,
        comentario: event.motivoAsignacion,
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} ha reasignado la oficina del radicado ${data.value.idRadicado}`,
        tramite: "PQRD",
      });
      toast.success("El caso se reasigno con éxito");
      await router.push("/bandeja");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

const rejectedFiles = (error: any[]) => {
  if (
    error.some(
      (it: { failedPropValidation: string }) =>
        it.failedPropValidation === "max-file-size"
    )
  ) {
    toast.error("El peso permitido es hasta 30MB.");
  }
  if (
    error.some(
      (it: { failedPropValidation: string }) =>
        it.failedPropValidation === "max-files"
    )
  ) {
    toast.error(`Solo se pueden adjuntar ${MAX_FILE} archivos.`);
  }
  if (
    error.some(
      (it: { failedPropValidation: string }) =>
        it.failedPropValidation === "accept"
    )
  ) {
    toast.error("Formato inválido, el formato permitido es pdf.");
  }
  if (
    error.some(
      (it: { failedPropValidation: string }) =>
        it.failedPropValidation === "duplicate"
    )
  ) {
    toast.error("Archivo duplicado.");
  }
};

const nuevoDocumento = async () => {
  try {
    const response = await sgdeaAxios.patch(`/pqrd/reiniciarGestion`, {
      asignacionId: route.query?.idAsignacion,
      motivo: "",
    });
    if (response.status == 200 || response.status == 201) {
      toast.success("Se reinició la gestión del radicado");
      window.location.reload();
    }
  } catch (error) {
    toast.error("Hubo un error al reiniciar la gestión del radicado");
  }
};

const descargaPdf = async (idRadicacion, node) => {
  try {
    const { data } = await sgdeaAxios.get(
      `/radicados/consultar_documento/${node}`
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
    link.download = String(idRadicacion);

    link.click();

    URL.revokeObjectURL(blobUrl);

    router.back();
  } catch (error) {
    toast.error("Ocurrió un error inesperado.");
  }
};

const exitoAprobacionApro = async () => {
  router.push("/bandeja");
};
</script>
