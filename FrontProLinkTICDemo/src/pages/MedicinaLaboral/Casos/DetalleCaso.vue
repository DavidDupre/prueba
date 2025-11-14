<template>
  <div>
    <div class="tw-w-full tw-flex tw-flex-col tw-gap-4 px-4">
      <div class="tw-flex tw-justify-between tw-items-start tw-w-full">
        <div>
          <div
            class="tw-mt-2"
            v-if="auth.userInfo.role === 'Asignador Responsable'"
          >
            <q-btn
              icon="chevron_left"
              label="Volver"
              flat
              class="tw-text-[#ff7500]"
              @click="outModal = true"
            />
          </div>
          <div
            class="tw-mt-2"
            v-else-if="data?.estado?.estado === 'Devolucion Pendiente'"
          >
            <q-btn
              icon="chevron_left"
              label="Volver"
              flat
              class="tw-text-[#ff7500]"
              @click="router.push('/envios-seguimientos/correos')"
            />
          </div>
          <div class="tw-mt-2" v-else>
            <q-btn
              icon="chevron_left"
              label="Volver"
              flat
              class="tw-text-[#ff7500]"
              @click="router.push('/bandeja')"
            />
          </div>

          <p class="tw-font-bold tw-text-3xl tw-mt-2">
            Radicado
            {{
              data?.estado?.estado !== "Devolucion Pendiente"
                ? auth.userInfo.role === "Publicador"
                  ? data?.asignacion?.datosSalida?.documentoSalida
                      ?.radicadoSalida
                  : data?.idRadicado
                : data?.asignacion?.datosSalida?.documentoSalida?.radicadoSalida
            }}
          </p>
        </div>

        <div
          v-if="data?.estado?.estado === 'Devolucion Pendiente'"
          class="tw-mt-2"
        >
          <q-btn
            label="Devolver"
            color="orange-7"
            icon="send"
            style="width: 150px; height: 36px; border-radius: 8px"
            no-caps
            @click="toggleReturnConfirmation"
          />
        </div>
      </div>

      <div class="tw-flex tw-justify-between tw-items-center tw-w-full">
        <div
          :class="`tw-inline-block tw-p-1.5 tw-px-4 tw-rounded-lg tw-border ${ESTADOS[state]}`"
        >
          <span class="tw-font-semibold">{{ state }}</span>
        </div>
      </div>

      <div
        class="tw-flex tw-gap-2 tw-min-h-[36px]"
        v-if="labelComponet === 'Documentos relacionados'"
      >
        <q-btn
          label="Cambiar tipo de documento"
          color="secondary"
          class="!tw-px-4"
          v-if="showChangeDocType"
          @click="modalChangeDocType = true"
        />

        <q-btn
          v-if="
            auth.userInfo.role !== 'Aprobador' &&
            !isDisabled &&
            isShowButtonUpload
          "
          label="Subir un documento"
          color="primary"
          icon="add"
          @click="openModalDocument"
          class="!tw-px-4"
        />
      </div>

      <div
        class="tw-flex tw-min-h-[36px] tw-pr-2 tw-mt-20"
        v-if="
          state &&
          state !== 'Devolucion' &&
          labelComponet === 'Información General' &&
          auth.userInfo.role === 'Gestionador' &&
          !isDisabled &&
          !responseML.asignacion.gestionIniciada
        "
      >
        <q-btn
          label="Rechazar"
          color="primary"
          @click="showModalRechazar = true"
          class="!tw-px-8 tw-w-40"
          :disable="disabledTabs"
        />
      </div>

      <div
        class="tw-flex tw-min-h-[36px] tw-pr-2 tw-gap-2 tw-mt-20"
        v-if="auth.userInfo.role === 'Revisor' && data?.estado?.estado == 'Por revisar'"
      >
        <q-btn
          label="Rechazar"
          color="secondary"
          icon="close"
          @click="showModalRechazarRevision = true"
          class="tw-w-40"
        />
        <q-btn
          label="Aprobar"
          color="primary"
          icon="check"
          @click="
            labelComponet = 'Documento de salida';
            showModalAprobarRevision = true;
          "
          class="!tw-px-8 tw-w-40"
        />
      </div>

      <div
        class="tw-flex tw-min-h-[36px] tw-pr-2 tw-gap-2 tw-mt-20"
        v-if="auth.userInfo.role === 'Aprobador' && data?.estado?.estado == 'Por aprobar'"
      >
        <q-btn
          label="Rechazar"
          color="secondary"
          icon="close"
          @click="showModalRechazarApro = true"
          class="tw-w-40"
        />
        <q-btn
          label="Aprobar"
          color="primary"
          icon="check"
          @click="
            labelComponet = 'Documento de salida';
            showModalAprobarApro = true;
          "
          class="!tw-px-8 tw-w-40"
        />
      </div>
    </div>

    <q-card class="tw-mt-8 tw-mb-4" flat>
      <template
        v-if="
          !['Devolucion', 'Devolucion Pendiente'].includes(data?.estado?.estado)
        "
      >
        <q-tabs
          v-model="tabOne"
          no-caps
          inline-label
          indicator-color="transparent"
          active-color="primary"
          align="left"
          outside-arrows
          class="tw-rounded-lg tw-my-4 tw-bg-white custom-tabs tw-flex"
          :disable="disabledTabs"
        >
          <div v-for="tab in tabs">
            <q-tab
              :disable="Disabled || disabledTabs"
              :icon="tab.icon"
              :key="tab.label"
              :name="tab.label"
              square
              :ripple="false"
              @click="showComponents(tab.label)"
              class="tw-rounded-lg q-pa-sm tw-text-sm tw-px-3 tw-text-[#6B737C]"
              :label="tab.label"
            />
          </div>
        </q-tabs>
      </template>
      <template v-else-if="data?.estado?.estado === 'Devolucion Pendiente'">
        <q-tabs
          v-model="tabOne"
          no-caps
          inline-label
          indicator-color="transparent"
          active-color="primary"
          align="left"
          outside-arrows
          class="tw-rounded-lg tw-my-4 tw-bg-white custom-tabs tw-flex"
          :disable="disabledTabs"
        >
          <q-tab
            :disable="disabledTabs"
            :icon="tab.icon"
            :key="tab.label"
            :name="tab.label"
            :ripple="false"
            square
            @click="showComponents(tab.label)"
            v-for="tab in tabsPendinReturn"
            class="tw-rounded-lg q-pa-sm tw-text-sm tw-px-3 tw-text-[#6B737C]"
            :label="tab.label"
          >
          </q-tab>
        </q-tabs>
      </template>
      <template v-else>
        <q-tabs
          v-model="tabOne"
          no-caps
          inline-label
          indicator-color="transparent"
          active-color="primary"
          align="left"
          outside-arrows
          class="tw-rounded-lg tw-my-4 tw-bg-white custom-tabs tw-flex"
          :disable="disabledTabs"
        >
          <q-tab
            :disable="disabledTabs"
            :icon="tab.icon"
            :key="tab.label"
            :name="tab.label"
            :ripple="false"
            square
            @click="showComponents(tab.label)"
            v-for="tab in tabsDevolucion"
            class="tw-rounded-lg q-pa-sm tw-text-sm tw-px-3 tw-text-[#6B737C]"
            :label="tab.label"
          >
          </q-tab>
        </q-tabs>
      </template>
    </q-card>

    <!-- ! Componentes -->
    <!-- ? Asignador -->
    <InformacionGeneral
      v-if="labelComponet == 'Información General' && !edit"
      v-model:data="responseML"
      :docs="allDocs"
      class="tw-w-[100%]"
      :visualize="getBlobToIframe"
      :metadatos-info="metadatosInfo"
      :allTypesDocs="listDocs2"
      @successSave="getData()"
      @disabled-tabs="disabledTabs = true"
      @active-tabs="disabledTabs = false"
      :hide-edit-button="state === 'Devolucion'"
    />

    <Publicar
      @back-view="backView"
      v-if="labelComponet === 'Publicar'"
      :type="'correspondencia'"
      :detalles-registro="responseML"
    />

    <RechazarPublicacion
      @back-view="backView"
      @back-page="router.push('/bandeja')"
      :detalles-registro="responseML"
      :type="'Medicina'"
      v-if="labelComponet === 'Rechazar Publicación'"
    />

    <Asignar
      v-if="labelComponet === 'Asignar'"
      :ml-data="data"
      :metadatos-info="metadatosInfo"
      @redirect="showComponents('Información General')"
    />
    <Metadatos
      :medicinaData="data"
      :metadatos-info="metadatosInfo"
      :metadatos="metadatos"
      v-if="
        labelComponet === 'Metadatos' && !responseML.asignacion.gestionIniciada
      "
      @successSave="
        auth.userInfo.role === 'Asignador Responsable' ? giveMeta() : ''
      "
      @redirect="showComponents('Información General')"
    />
    <ReasignarOficina
      v-if="labelComponet === 'Reasignar oficina'"
      :data="data"
      @redirect="showComponents('Información General')"
      @handleAcceptModal="saveReasignacion"
      module="Medicina Laboral"
    />
    <Trazabilidad v-if="labelComponet === 'Trazabilidad'" :ml-data="data" />

    <TrazabilidadDocumento
      v-if="labelComponet === 'Trazabilidad de Documento'"
      :ml-data="trazaDocument"
    />

    <Comentarios
      :details-radicado="data"
      text-default="Ha comentado sobre la radicación"
      v-if="labelComponet === 'Comentarios'"
      :show-modal="noteModal"
      @closeModal="noteModal = false"
    />
    <Reclasificar
      v-if="labelComponet === 'Reclasificar Trámite'"
      :ml-data="data"
      @redirect="showComponents('Información General')"
    />

    <!-- ? Gestionador -->
    <MetadatosGestionador
      :medicinaData="data"
      :data="responseML"
      :metadatos="metadatos"
      :is-disabled="isDisabled"
      v-if="
        labelComponet === 'Metadatos' && auth.userInfo.role === 'Gestionador'
      "
      @successSave="getData()"
      @redirect="showComponents('Información General')"
    />
    <DocumentosRelacionados
      :visualize="getBlobToIframe"
      v-model:detalleML="responseML"
      v-show="labelComponet === 'Documentos relacionados'"
      :show-modal="modalDocuments"
      @changeDocType="changeDocType"
      v-model:finished="finished"
      @updated="getData()"
      @show-upload="showUploadFiles"
    />
    <ReasignarGestionador
      v-if="labelComponet === 'Reasignar'"
      :ml-data="data"
      @redirect="showComponents('Información General')"
    />
    <DatosSalida
      :ml-data="data"
      v-if="labelComponet === 'Datos de salida'"
      :docs="listDocs2"
      @successSave="getData()"
      @success="
        getData();
        showComponents('Información General');
      "
      :is-disabled="isDisabled"
    />
    <IncluirExpediente
      v-if="labelComponet === 'Incluir Expediente'"
      :ml-data="data"
      :is-disabled="isDisabled"
      @success="successIncluirExpediente"
      @redirect="showComponents('Información General')"
    />

    <Editor
      :data="dataFooter"
      :referentKey="referentKey"
      :restric="restric"
      :base64="documentoFile"
      :document="htmlContent"
      @datos-response="autoSaveDocument"
      @revisado="aprobarRevision"
      @aprobado="aprobacionApro"
      :aprobado="aprobado"
      :revisado="revisado"
      :img-base64="imgBase64"
      :aling="true"
      v-if="labelComponet === 'Documento de salida' && viewEditor == true"
      :isDisable="isDisabled"
    />

    <EnviarRevision
      v-if="labelComponet === 'Enviar a Revision'"
      :ml-data="data"
      :is-expediente="isExpedientes"
      @redirect="showComponents('Información General')"
      :documento="docChange"
      :user-name="auth.userInfo.name"
      :user-rol="auth.userInfo.role"
      :is-change-doc="gestionadorCambio"
    />
    <EnviarPorCorrespondencia
      v-if="labelComponet === 'Enviar por Correspondencia'"
      :radicado-salida="radicadoSalida"
      :detalle-radicado="responseML"
      :datos-remitente="responseML.remitente"
      @back-view="router.push('/bandeja')"
      endpoint=""
    />
    <EnviarPorCorreo
      v-if="labelComponet === 'Enviar por Correo'"
      :detalle-radicado="responseML"
      :datos-remitente="responseML.remitente"
      :list-docs="listDocs"
      type-view="Medicina Laboral"
    />

    <EnviarPublicacion
      v-if="labelComponet === 'Enviar a Publicación'"
      @back-view="closeModal"
      typeFlujoSgda="Medicina Laboral"
      :idCaso="responseML.id"
      :detalle-radicado="responseML"
      pathBandeja="/bandeja"
    />

    <AdjuntarDocsComunicaciones
      v-if="labelComponet === 'Medicina Laboral'"
      :id="responseML.id"
    />

    <!-- <CerrarDevolucion v-if="labelComponet === 'Cerrar Devolución'"
      :detalles-radicado="responseML" typeFlujoSgda="Medicina Laboral"
      pathBandeja="/bandeja" @back-view="closeModal"
    /> -->

    <!-- Metadatos Hu 124 COR -->
    <MetadatosDinamic
      :metadatos="metadatos"
      v-if="
        labelComponet === 'Metadatos' &&
        isMetadatos &&
        !['Asignador Responsable', 'Gestionador'].includes(auth.userInfo.role)
      "
    />

    <!-- ! Modales -->
    <RechazarModalMedicina
      @hide-modal="hideModal"
      :show-modal="showModalRechazarRevision"
      @update-modal="updateModal"
    />

    <RechazarModalMedicina
      @hide-modal="hideModal"
      :show-modal="showModalRechazarApro"
      @update-modal="updateModalAprob"
    />

    <ConfirmModal
      text-cancel-modal="Cancelar"
      text-confirm-modal="Aceptar"
      text-show-modal="¿Está seguro de rechazar el caso?"
      @update:show-modal="() => (showModalConfrim = false)"
      @confirm-modal="rechazarRevision"
      :show-modal="showModalConfrim"
    />

    <ConfirmModal
      text-cancel-modal="Cancelar"
      text-confirm-modal="Aceptar"
      text-show-modal="¿Está seguro de rechazar el caso?"
      @update:show-modal="() => (showModalConfrimAprob = false)"
      @confirm-modal="rechazarApro"
      :show-modal="showModalConfrimAprob"
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
            multiple
            :max-files="20"
            :maxFileSize="50 * 1024 * 1024"
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

    <!-- ! Soportes de Salida -->
    <q-dialog v-model="soporteSalidaModal" persistent>
      <q-card class="tw-py-5 tw-px-2">
        <q-card-section class="row tw-p-4">
          <h2 class="tw-text-slate-500 text-center tw-text-2xl">
            Cargar documento
          </h2>
        </q-card-section>
        <q-card-section class="row tw-p-4">
          <p class="tw-text-label tw-font-semibold">Adjunte los documentos</p>
          <FileLoader
            class="tw-w-full"
            @rejected="rejectedTypes"
            v-model="newFileInputSoporte"
            accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
            sub-title="Puede adjuntar (30) Archivo(s) cada uno con un tamaño permitido de 50MB en cualquiera de las siguientes extenciones <hr>(pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)"
            multiple
            :max-files="maxFiles"
            :max-file-size="50 * 1024 * 1024"
            max-file-size-label="200"
          />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-if="!loadingChargeDocs"
            label="Cancelar"
            @click="confirmModalByFilesCancel = true"
            class="!tw-px-6 !tw-py-2 tw-w-[190px]"
          />

          <q-btn
            v-if="!loadingChargeDocs"
            label="Guardar"
            color="primary"
            @click="confirmModalByFiles = true"
            class="!tw-px-6 !tw-py-2 tw-w-[190px]"
          />

          <q-btn
            v-if="loadingChargeDocs"
            type="button"
            flat
            class="tw-h-12 text-weight-bold tw-text-2xl"
            style="width: 50%"
            color="orange"
            :loading="loadingChargeDocs"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <Modal
      v-model="confirmModalByFilesCancel"
      title="¡Espera un momento!"
      :is-success="false"
      @handleAccept="
        showComponents('Información General');
        soporteSalidaModal = false;
      "
      cancel-button
      textButtonCancel="No"
      textButton="Si"
      text="Al cancelar la acción perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
      @close-modal="confirmModalByFilesCancel = false"
      type="button"
    />

    <Modal
      v-model="confirmModalByFiles"
      title="¡Espera un momento!"
      :is-success="false"
      @handleAccept="handleUploadFilebySalidaSupport"
      cancel-button
      textButtonCancel="No"
      textButton="Si"
      text="¿Está seguro de adjuntar un soporte para el documento de salida?"
      @close-modal="confirmModalByFiles = false"
      type="button"
    />

    <!-- ! End soporte salida -->

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
                    v-model="nameDocument"
                    dense
                    align="justify"
                    narrow-indicator
                  >
                    <q-tab
                      v-for="item in listForVizualiser.filter(
                        (it) => it.tipo === 'De entrada'
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

                  <p class="text-weight-bold tw-pt-5">Documentos de Soporte</p>
                  <q-tabs
                    v-model="nameDocument"
                    dense
                    align="justify"
                    narrow-indicator
                  >
                    <q-tab
                      v-for="item in listForVizualiser.filter(
                        (it) => it.tipo === 'De soporte'
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
                    v-model="nameDocument"
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

    <!-- ! Modal Salir sin Asignar -->
    <Modal
      v-model="outModal"
      title="¡Espera un momento!"
      :is-success="false"
      @handleAccept="outToBandeja"
      cancel-button
      textButtonCancel="No"
      textButton="Si"
      text="¿Está seguro de abandonar el radicado sin asignar?"
      @close-modal="outModal = false"
      type="button"
    />
    <!-- ! End modal -->

    <!-- ! Modal Doc Salida -->
    <q-dialog
      v-model="showModalDocSalida"
      backdrop-color="rgba(0, 0, 0, 0.5)"
      persistent
    >
      <q-card class="tw-w-[35%] mx-auto tw-rounded-md">
        <q-form ref="formModalSalida" greedy>
          <q-card-section class="tw-px-8">
            <div
              class="tw-text-xl tw-font-bold tw-text-[#0a1b48] tw-mb-4 tw-mt-4"
            >
              Crear documento de salida
            </div>
            <div>
              <label class="tw-block tw-text-sm tw-font-bold tw-text-[#777e87]"
                >Nombre de comunicación *</label
              >
              <q-select
                :options="nombreComunicacion"
                outlined
                label="Seleccione"
                dense
                map-options
                v-model="formDoc.nombreComunicacion"
                :rules="[inputRequired]"
                use-input
                fill-input
                hide-selected
                @filter="filterNombreComunicacion"
              />
            </div>
            <div>
              <label class="tw-block tw-text-sm tw-font-bold tw-text-[#777e87]"
                >Prefijo de comunicación *</label
              >
              <q-select
                :options="filteredPrefijos"
                outlined
                label="Seleccione"
                dense
                map-options
                v-model="formDoc.prefijo"
                :rules="[inputRequired]"
                use-input
                fill-input
                hide-selected
                @filter="filterPrefijos"
              />
            </div>
          </q-card-section>
          <div
            class="tw-flex tw-justify-center tw-items-center tw-pb-6 tw-pt-3 tw-gap-3"
          >
            <q-btn
              flat
              label="Cancelar"
              color="secondary"
              class="tw-w-[35%] tw-h-10"
              @click="
                showComponents('Información General');
                showModalDocSalida = false;
              "
            />
            <q-btn
              label="Continuar"
              color="secondary"
              class="tw-w-[35%] tw-h-10"
              @click="getModalSalida"
            />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
    <!-- ! END Modal Doc Salida -->

    <!-- ! Reiniciar Gestion -->
    <q-dialog
      v-model="showModalReiniciar"
      backdrop-color="rgba(0, 0, 0, 0.5)"
      persistent
    >
      <q-card class="tw-w-[45%] mx-auto tw-rounded-md">
        <div class="tw-flex tw-justify-center tw-mt-3">
          <span
            class="tw-rounded-[100px] tw-flex tw-justify-center"
            style="background-color: #f6f6f9; width: 82px; height: 82px"
          >
            <img v-lazy :data-url="InterrogationModal" alt="check" />
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
              v-model="observacionesReinicio"
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
              label="No"
              color="secondary"
              class="tw-w-[35%] tw-h-10"
              @click="
                showComponents('Información General');
                showModalReiniciar = false;
                observacionesReinicio = '';
              "
            />
            <q-btn
              label="Si"
              color="secondary"
              class="tw-w-[35%] tw-h-10"
              @click="getModalReinicio"
            />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
    <!-- ! END Reiniciar Gestion -->

    <!-- ! Rechazar Caso Gestionador -->
    <q-dialog
      v-model="showModalRechazar"
      backdrop-color="rgba(0, 0, 0, 0.5)"
      persistent
    >
      <q-card class="tw-w-[45%] mx-auto tw-rounded-md">
        <div class="tw-flex tw-justify-center tw-mt-3">
          <span
            class="tw-rounded-[100px] tw-flex tw-justify-center"
            style="background-color: #f6f6f9; width: 82px; height: 82px"
          >
            <img v-lazy :data-url="InterrogationModal" alt="check" />
          </span>
        </div>
        <q-form ref="formRechazo" greedy>
          <q-card-section class="tw-px-8">
            <div
              class="tw-text-xl tw-font-bold tw-text-[#0a1b48] tw-mb-4 tw-mt-2 flex tw-justify-center"
            >
              Confirmación
            </div>
            <div
              class="tw-text-sm tw-font-bold tw-text-[#0a1b48] tw-mb-4 tw-mt-4 flex tw-justify-center"
            >
              ¿Está seguro de rechazar la asignación para gestión del radicado
              {{ responseML.idRadicado }}? Recuerde que una vez rechace la
              asignación no podrá volver a visualizar el trámite
            </div>
            <CommentTextArea
              v-model="observacionesRechazo"
              :is-required="true"
              :max-length="1000"
              label="Motivo De Rechazo"
            />
          </q-card-section>
          <div
            class="tw-flex tw-justify-center tw-items-center tw-pb-6 tw-pt-3 tw-gap-3"
          >
            <q-btn
              flat
              label="Cancelar"
              color="secondary"
              class="tw-w-[35%] tw-h-10"
              @click="
                showComponents('Información General');
                showModalRechazar = false;
                observacionesRechazo = '';
              "
            />
            <q-btn
              label="Rechazar"
              color="secondary"
              class="tw-w-[35%] tw-h-10"
              @click="rechazarCasoGestion"
            />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
    <!-- ! END Rechazar Caso Gestionador -->

    <ConfirmModal
      text-cancel-modal="No"
      text-confirm-modal="Sí"
      text-show-modal="¿Está seguro que desea rechazar la respuesta proyectada?"
      @update:show-modal="() => (showModalConfirmRevision = false)"
      @confirm-modal="rechazarRevision"
      :show-modal="showModalConfirmRevision"
    />

    <ConfirmModal
      text-cancel-modal="No"
      text-confirm-modal="Si"
      text-show-modal="¿Está seguro de dar el visto bueno a la respuesta proyectada?"
      @update:show-modal="showComponents('Información General')"
      @confirm-modal="beforeRevision"
      :show-modal="showModalAprobarRevision"
      :loading="loadingEnvios"
    />

    <ConfirmModal
      text-cancel-modal="No"
      text-confirm-modal="Si"
      text-show-modal="¿Está seguro de dar el visto bueno a la respuesta proyectada?"
      @update:show-modal="() => showComponents('Información General')"
      @confirm-modal="beforeAprobacion"
      :show-modal="showModalAprobarApro"
      :loading="loadingEnvios"
    />

    <ConfirmFirma
      text-cancel-modal="No"
      text-confirm-modal="Aceptar"
      text-show-modal="¿SEÑOR APROBADOR CÓMO DESEA FIRMAR EL DOCUMENTO DE SALIDA?"
      @update:show-modal="() => showComponents('Información General')"
      @confirm-modal="getFirma"
      :show-modal="showModalTypeFirma"
    />

    <ExitoModal
      text-cancel-modal="Descargar"
      text-confirm-modal="Finalizar"
      :text-show-modal="`La respuesta proyectada tiene su visto bueno. Radicado de salida generado ${idRadicacion}`"
      @update:show-modal="descargaPdf(idRadicacion, nodeId)"
      @confirm-modal="exitoAprobacion"
      :show-modal="showModalExito"
    />

    <ExitoModal
      text-cancel-modal="Descargar"
      text-confirm-modal="Finalizar"
      :text-show-modal="`La respuesta proyectada tiene su visto bueno. Radicado de salida generado ${idRadicacion}`"
      @update:show-modal="descargaPdf(idRadicacion, nodeId)"
      @confirm-modal="exitoAprobacionApro"
      :show-modal="showModalExitoApro"
    />

    <RechazarModal
      :motivo-limit="1000"
      title="Rechazar caso"
      @hide-modal="rechazarAprobacionModal = false"
      :show-modal="rechazarAprobacionModal"
      @update-modal="updateModalAprobador"
    />

    <ConfirmModal
      text-cancel-modal="No"
      text-confirm-modal="Sí"
      text-show-modal="¿Está seguro que desea rechazar la aprobación del caso?"
      @update:show-modal="() => (showModalConfirmAprobador = false)"
      @confirm-modal="rechazarApro"
      :show-modal="showModalConfirmAprobador"
    />

    <div v-if="labelComponet === 'Nuevo Documento de Salida'">
      <Modal
        v-model="modalNuevoDoc"
        title="Confirmación"
        cancelButton
        @handleAccept="nuevoDocumento"
        @closeModal="closeModal"
        textButtonCancel="Cancelar"
        text-button="Aceptar"
        text="¿Desea crear un nuevo documento de salida?"
        type="button"
      />
    </div>
    <q-dialog v-model="aprobarCasoModal">
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
              @click="aprobarCasoModal = false"
            />
            <q-btn
              :label="`Aprobar`"
              style="
                width: 250px;
                height: 45px;
                border-radius: 8px;
                font-size: 18px;
              "
              text-color="white"
              color="secondary"
              class="tw-rounded-xl tw-p-3"
              @click="beforeAprobacion"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <Modal
      v-model="modalSegundaDevolucion"
      :is-success="false"
      @handleAccept="closeModal"
      textButton="Aceptar"
      text="El documento ha cumplido dos devoluciones, gestionar publicación en Página WEB"
      type="button"
      :title="undefined"
    />
  </div>
  <template>
    <q-dialog v-model="showReturnConfirmation" persistent>
      <q-card class="tw-w-[3000px]">
        <q-card-section class="tw-text-center tw-p-10">
          <h2
            class="tw-text-bold tw-mb-10 tw-text-secondary tw-font-bold tw-text-lg"
          >
            ¿Desea hacer la devolución del siguiente caso?
          </h2>
          <div class="tw-mb-6">
            <div class="tw-font-semibold tw-mb-2">
              Número de Radicado de Salida
            </div>
            <div class="tw-text-base tw-text-gray-700">
              •
              {{
                data?.asignacion?.datosSalida?.documentoSalida?.radicadoSalida
              }}
            </div>
          </div>
          <div class="tw-flex tw-justify-between tw-mt-5">
            <q-btn
              label="Cancelar"
              type="reset"
              style="width: 200px"
              text-color="white"
              color="secondary"
              @click="toggleReturnConfirmation"
              class="tw-rounded-xl tw-h-12"
            />
            <q-btn
              label="Aceptar"
              type="reset"
              style="width: 200px"
              text-color="white"
              color="primary"
              @click="updateSelectedCases"
              class="tw-rounded-xl tw-h-12"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </template>
</template>

<script lang="ts" setup>
import FileLoader from "../FileLoader.vue";
import FileLoader2 from "src/components/FormFields/FileLoader.vue";
import ConfirmFirma from "src/components/Modal/ConfirmFirma.vue";
import ConfirmModal from "src/components/Modal/ConfirmModal.vue";
import CustomModal from "src/components/Modal/CustomModal.vue";
import ExitoModal from "src/components/Modal/ExitoModal.vue";
import Modal from "src/components/Modal/Modal.vue";
import RechazarModal from "src/components/Modal/RechazarModal.vue";
import RechazarModalMedicina from "../RechazarModal.vue";
import { toast } from "src/helpers/toast";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { inputRequired } from "src/helpers/validations";
import { DocsBD, Medicina, Metadatos as Meta } from "src/interfaces";
import { sgdeaAxios } from "src/services";
import { fourthFormatDate } from "src/helpers/formtDate";
import { useAuthStore } from "src/stores/auth.store";
import {
  Ref,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  computed,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { ESTADOS } from "src/assets/estados/estados";
// @ts-ignore
import InterrogationModal from "src/assets/interrogation-modal.svg";
// @ts-ignore
import docImg from "src/assets/icon-lines.svg";
import InformacionGeneral from "../InformacionGeneral/informacionGeneral.vue";
import Asignar from "../Asignacion/asignacion.vue";
import Metadatos from "../Metadatos/metadatos.vue";
import MetadatosGestionador from "../Metadatos/metadatosGestionador.vue";
import MetadatosDinamic from "src/components/metadtos/DynamicFields/Metadatos.vue";
import ReasignarGestionador from "../ReasignarGestionador/reasignacion.vue";
import Trazabilidad from "../Trazabilidad/trazabilidad.vue";
import Comentarios from "../Comentarios/comentarios.vue";
import Reclasificar from "../Reclasificacion/Form/reclasificar.vue";
import DocumentosRelacionados from "../DocumentosRelacionados/DocumentosRelacionados.vue";
import DatosSalida from "../DatosSalida/DatosSalida.vue";
import IncluirExpediente from "../IncluirExpediente/incluirExpediente.vue";
import EnviarRevision from "../EnviarRevision/EnviarRevision.vue";
import ReasignarOficina from "src/shared/components/ReasignarOficina/reasignacion.vue";
import EnviarPorCorrespondencia from "src/components/Devolucion/EnviarCorrespondencia.vue";
import EnviarPorCorreo from "src/components/Devolucion/EnviarCorreo.vue";
import Editor from "src/components/Editor/editor.vue";
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";
import { isNullOrUndefined } from "src/shared/utils/Input/validationInput";
import TrazabilidadDocumento from "../TrazabilidadDocumento/TrazabilidadDocumento.vue";
import { crearTrazabilidadDocumento } from "src/helpers/trazabilidadDocumento";
import { assignmentWebSocket } from "src/services/assignmentWebSocket";
import moment from "moment/moment";
import EnviarPublicacion from "components/Devolucion/EnviarPublicacion.vue";
import AdjuntarDocsComunicaciones from "pages/Correspondencia/Crear/views/AdjuntarDocs.vue";
import Publicar from "src/components/Devolucion/Publicar.vue";
import RechazarPublicacion from "src/components/Devolucion/RechazarPublicacion.vue";

const route = useRoute();
const router = useRouter();
const activeEdit = ref();
const state = ref();
const visualizadorPDF = ref(false);
const iframePdfUrl = ref();
const labelComponet = ref("Información General");
const edit = ref(false);
const form = ref({
  motivoRechazo: "",
  motivoRechazoDefensor: "",
});
const maxFiles = ref(30);
const esSalida = ref(false);
const newFileInput = ref<any>([]);
const data: Ref<Medicina | null> = ref(null);
const firmaForm = ref();
const noteModal = ref(false);
const modalDocuments = ref(false);
const firmaAprobador = ref(null);
const aprobado = ref(false);
const revisado = ref(false);
const outModal = ref<boolean>(false);
const showModalConfrim = ref<boolean>(false);
const datosSalida = ref();
const responseML: Ref<Medicina | null> = ref(null);
const idRadicado = ref("");
const metadatosInfo: Ref<Meta | null> = ref(null);
const listDocs = ref([]);
const loadingDocs = ref(true);
const showModalConfirmRevision = ref(false);
const showModalAprobarRevision = ref(false);
const showModalConfirmAprobador = ref(false);
const nameDocument = ref();
const finalModal = ref(false);
const showModalDocSalida = ref(false);
const rechazarAprobacionModal = ref(false);
const aprobarCasoModal = ref(false);
const loadedDocsToChangeType = ref([]);
const showChangeDocType = ref<boolean>(false);
const modalChangeDocType = ref<boolean>(false);
const tabOne = ref("Información General");
const dbDocs: Ref<DocsBD[]> = ref([]);
const finished = ref(false);
const isAsignador = ref(false);
const isThirdDayAtFourThirtyPMAfterRadicationDate = ref(false);
const motivoRechazoAprobador = ref("");
const radicationDate = ref("");
const intervalId = ref(null);
const auth = useAuthStore();
const emit = defineEmits(["image-loaded"]);
const allDocs = ref();
const listDocs2 = ref();
const soporteSalidaModal = ref(false);
const confirmModalByFilesCancel = ref(false);
const confirmModalByFiles = ref(false);
const newFileInputSoporte = ref();
const tabs = ref([]);
const listPrefijos = ref([]);
const listNombreComunicacion = ref([]);
const filteredPrefijos = ref();
const nombreComunicacion = ref();
const formModalSalida = ref();
const nodeId = ref("");
const formDoc = ref({
  nombreComunicacion: "",
  prefijo: "",
});
const showModalReiniciar = ref(false);
const showModalRechazar = ref(false);
const showModalRechazarApro = ref(false);
const showModalAprobarApro = ref(false);
const showModalRechazarRevision = ref(false);
const showModalExito = ref(false);
const showModalExitoApro = ref(false);
const observacionesReinicio = ref();
const observacionesRechazo = ref();
const formReinicioGestion = ref();
const formRechazo = ref();
const isDocSalida = ref(false);
const isDisabled = ref(false);
const viewEditor = ref(false);
const showModalConfrimAprob = ref(false);
const idRadicacion = ref();
const metadatos = ref([]);
const isMetadatos = ref(false);
const isExpedientes = ref(false);
const loadingEnvios = ref(false);
const loadingChargeDocs = ref(false);
const listForVizualiser = ref([]);
const visibleDoscRead = ref(false);
const isShowButtonUpload = ref(false);
const documentoFile = ref("");
const htmlContent = ref("");
const disabledTabs = ref(false);
const showModalTypeFirma = ref(false);
const imgBase64 = ref();
const pdfBlob = ref<Blob>();
const modalNuevoDoc = ref(true);
const modalSegundaDevolucion = ref(false);
const tabsDevolucion = ref();
const tabsPendinReturn = ref();
const showReturnConfirmation = ref(false);

const allNameTabs = {
  vistaInformacionGeneral: "vistaInformacionGeneral",
  asignar: "asignar",
  metadatos: "metadatos",
  metadatosGestionador: "metadatosGestionador",
  metadatosDinamic: "metadatosDinamic",
  trazabilidad: "trazabilidad",
  comentarios: "comentarios",
  reasignarOficina: "reasignarOficina",
  reasignarGestionador: "reasignarGestionador",
  reclasificar: "reclasificar",
  iniciarGestion: "iniciarGestion",
  docRelacionados: "DocumentosRelacionados",
  datosSalida: "datosSalida",
  incluirExpediente: "incluirExpediente",
  docSalida: "DocumentoSalida",
  soporteSalida: "soporteSalida",
  enviarRevision: "enviarRevision",
  reiniciarGestion: "reiniciarGestion",
  trazabilidadDocumento: "trazabilidadDocumento",
  publicar: "Publicar",
  rechazarPublicacion: "RechazarPublicacion",
};

const backView = () => {
  labelComponet.value = "Información General";
};
const getTabs = () => {
  if (auth.$state.userInfo.role === "Asignador Responsable") {
    tabs.value = [
      {
        label: "Información General",
        name: allNameTabs.vistaInformacionGeneral,
        icon: "info",
      },
      {
        label: "Metadatos",
        name: allNameTabs.metadatos,
        icon: "folder_open",
      },
      {
        label: "Asignar",
        name: allNameTabs.asignar,
        icon: "move_up",
      },
      {
        label: "Reasignar oficina",
        name: allNameTabs.reasignarOficina,
        icon: "move_up",
      },
      {
        label: "Trazabilidad",
        name: allNameTabs.trazabilidad,
        icon: "history",
      },
      {
        label: "Comentarios",
        name: allNameTabs.comentarios,
        icon: "forum",
      },
      {
        label: "Reclasificar Trámite",
        name: allNameTabs.reclasificar,
        icon: "shuffle",
      },
    ];

    return tabs.value;
  }

  if (auth.$state.userInfo.role === "Publicador") {
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
    ];
    return tabs.value;
  }

  if (auth.$state.userInfo.role === "Gestionador") {
    tabs.value = [
      {
        label: "Información General",
        name: allNameTabs.vistaInformacionGeneral,
        icon: "info",
      },
      {
        label: "Metadatos",
        name: allNameTabs.metadatosGestionador,
        icon: "folder_open",
      },
      {
        label: "Datos de salida",
        name: allNameTabs.datosSalida,
        icon: "info",
      },
      {
        label: "Documento de salida",
        name: allNameTabs.docSalida,
        icon: "drive_file_move",
      },
      {
        label: "Soportes de salida",
        name: allNameTabs.soporteSalida,
        icon: "post_add",
      },
      {
        label: "Incluir Expediente",
        name: allNameTabs.incluirExpediente,
        icon: "description",
      },
      {
        label: "Enviar a Revision",
        name: allNameTabs.enviarRevision,
        icon: "rate_review",
      },
      {
        label: "Reasignar",
        name: allNameTabs.reasignarGestionador,
        icon: "move_up",
      },
      {
        label: "Reinicio de la gestión",
        name: allNameTabs.reiniciarGestion,
        icon: "info",
      },
      {
        label: "Iniciar Gestión",
        name: allNameTabs.iniciarGestion,
        icon: "play_arrow",
      },
      {
        label: "Documentos relacionados",
        name: allNameTabs.docRelacionados,
        icon: "folder_open",
      },
      {
        label: "Trazabilidad",
        name: allNameTabs.trazabilidad,
        icon: "history",
      },
      {
        label: "Comentarios",
        name: allNameTabs.comentarios,
        icon: "forum",
      },
      {
        label: "Trazabilidad de Documento",
        name: allNameTabs.trazabilidadDocumento,
        icon: "description",
      },
    ];

    if (responseML.value?.asignacion?.gestionIniciada) {
      removeButton(allNameTabs.iniciarGestion);
    } else {
      removeButton(allNameTabs.metadatosGestionador);
      removeButton(allNameTabs.docRelacionados);
      removeButton(allNameTabs.docSalida);
      removeButton(allNameTabs.datosSalida);
      removeButton(allNameTabs.incluirExpediente);
      removeButton(allNameTabs.soporteSalida);
      removeButton(allNameTabs.enviarRevision);
      removeButton(allNameTabs.reiniciarGestion);
    }

    if (isDisabled.value) {
      removeButton(allNameTabs.soporteSalida);
      removeButton(allNameTabs.reiniciarGestion);
      removeButton(allNameTabs.enviarRevision);
      removeButton(allNameTabs.reasignarGestionador);
      removeButton(allNameTabs.comentarios);
    }

    return tabs.value;
  }

  if (
    auth.$state.userInfo.role === "Revisor" ||
    auth.$state.userInfo.role === "Aprobador"
  ) {
    tabs.value = [
      {
        label: "Información General",
        name: allNameTabs.vistaInformacionGeneral,
        icon: "info",
      },
      {
        label: "Documentos relacionados",
        name: allNameTabs.docRelacionados,
        icon: "folder_open",
      },
      {
        label: "Trazabilidad",
        name: allNameTabs.trazabilidad,
        icon: "history",
      },
      {
        label: "Comentarios",
        name: allNameTabs.comentarios,
        icon: "forum",
      },
      {
        label: "Documento de salida",
        name: allNameTabs.docSalida,
        icon: "drive_file_move",
      },
      {
        label: "Trazabilidad de Documento",
        name: allNameTabs.trazabilidadDocumento,
        icon: "description",
      },
    ];
    return tabs.value;
  }
};

const itemsDevolucion = ref([
  {
    label: "Información General",
    icon: "info",
  },
  {
    label: "Enviar por Correspondencia",
    icon: "send",
  },
  {
    label: "Enviar por Correo",
    icon: "send",
  },
  {
    label: "Nuevo Documento de Salida",
    icon: "post_add",
  },
  // {
  //   label: "Cerrar Devolución",
  //   icon: "cancel",
  // },
  {
    label: "Trazabilidad",
    icon: "history",
  },
  {
    label: "Documentos relacionados",
    icon: "folder_open",
  },
]);

const itemsPendingRreturn = ref([
  {
    label: "Información General",
    icon: "info",
  },
  {
    label: "Documentos relacionados",
    icon: "folder_open",
  },
  {
    label: "Trazabilidad",
    icon: "history",
  },
  {
    label: "Comentarios",
    name: allNameTabs.comentarios,
    icon: "forum",
  },
]);
const itemsSegundaDevolucion = ref([
  {
    label: "Información General",
    icon: "info",
  },
  {
    label: "Enviar a Publicación",
    icon: "send",
  },
  {
    label: "Adjuntar Documento",
    icon: "feed",
  },
  // {
  //   label: "Cerrar Devolución",
  //   icon: "cancel",
  // },
  {
    label: "Trazabilidad",
    icon: "history",
  },
  {
    label: "Documentos relacionados",
    icon: "folder_open",
  },
]);

const referentKey = ref({
  asunto: "",
  NombredeDestinatario: "",
  TipoDeDocumentoDestinatario: "",
  DireccionDeDestinatario: "",
  TelefonoDeDestinatario: "",
  DepartamentoYMunicipioDestinatario: "",
  CorrreoDestinatario: "",
  NombreAfectado: "",
  TIpoDeDocumentoAfectado: "",
  NumerodocumentoAfectado: "",
  NoDoc: "",
  NumeroDeSiniestro: "",
  FechaDeSiniestro: "",
  Firma: "",
  NombreAprobador: "",
  CargoAprobador: "",
  DependenciaAprobador: "",
  prefijo: "",
  Subproceso: "",
});
// Cerca de la línea 300
let dataHeader = {};
const dataFooter = ref({}); // ¡Cámbialo de 'let' a 'const' y envuélvelo en ref({})!
const documentosDeSalida = ref([]);

onMounted(async () => {
  await getData();
  await getDimanicDatos();
  if (state.value === "Devolucion" || state.value === "Devolucion Pendiente") {
    validacionesDevolucion();
  } else {
    getTabs();
  }
  await getMetadatos();
  await getDocs();
  await gettrazabilidadDocumento();
  getNombreComunicacion();
  await getExpediente();
  if (auth.userInfo.role !== "Asignador Responsable") {
    await getPrefijos();
  }

  assignmentWebSocket.startAssignmentTimer(route.params.id);

  callDisableRechazarButtonAtFourThirtyPM();

  await gettrazabilidadDocumento();

    const documentosFiltrados = listDocs2.value.filter(
    (doc) => doc.tipoDocumento?.trim().toUpperCase() === 'SALIDA'
  );

  // 2. Guardamos el resultado en nuestra variable reactiva.
  documentosDeSalida.value = documentosFiltrados;
});

const validacionesDevolucion = () => {
  if (responseML.value?.numeroDevoluciones > 1) {
    tabsDevolucion.value = itemsSegundaDevolucion.value;
    modalSegundaDevolucion.value = true;
  } else if (state.value === "Devolucion Pendiente") {
    tabsPendinReturn.value = itemsPendingRreturn.value;
  } else {
    tabsDevolucion.value = itemsDevolucion.value;
  }
};

async function getDimanicDatos() {
  const user = auth.$state.userInfo;

  const rolUserId = user.relations.find((it) => it.rol === user.role);

  const { data: getDimanicDatos } = await sgdeaAxios.get(
    `/parametrizacion-formulario/ListadoParametrizacion?id_flujo=8&id_rol=${
      rolUserId.idRol
    }&id_oficina=${user.oficina ? user.oficina : ""}&id_estado_proceso=${
      data.value != undefined ? data.value.estado.id : 0
    }`
  );
  const { content } = getDimanicDatos;
  if (!isNullOrUndefined<string>(content)) {
    isMetadatos.value = true;
    metadatos.value = await getDimanicDatos.content;
  } else {
    isMetadatos.value = false;
  }
}

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
const arrayCopyInterna = ref();
const arrayCopyExterna = ref();
const arrayAllCopys = ref();

const restric = ref(false);
const hasDatosSalida = ref(false);
const radicadoSalida = ref();
const firmaGenericaAprobador = ref();
const firmaGrafoAprobador = ref();

const formatCopyInterna = (data) => {
  return `${data?.funcionario?.fullname?.toUpperCase().trim()}${
    data?.funcionario?.email ? " / " + data?.funcionario?.email.trim() : ""
  }`;
};

const formatCopyExterna = (data) => {
  if ([1, 2].includes(data?.formaEnvio?.id)) {
    return `${data?.nombreDestinatario?.toUpperCase().trim()}${
      data?.correoElectronico ? " / " + data?.correoElectronico.trim() : ""
    }`;
  }
  return `${data.nombreDestinatario.toUpperCase().trim()}${
    data?.direccionDestinatario
      ? " / Dirección: " + data?.direccionDestinatario.trim()
      : ""
  }${
    data?.departamentoDestinatario?.nombre
      ? " / Departamento: " + data?.departamentoDestinatario?.nombre.trim()
      : ""
  }${
    data?.municipioDestinatario?.nombre
      ? " / Municipio: " + data?.municipioDestinatario?.nombre.trim()
      : ""
  }${
    data.telefonoDestinatario
      ? " / Teléfono: " + data?.telefonoDestinatario.trim()
      : ""
  }`;
};

const getFirma = async (idAprobador) => {
  const response = await sgdeaAxios.get(
    `/usuarios/obtener-firma/${idAprobador || 0}`
  );
  const data = response?.data;
  const firmas = Array.isArray(data) ? data : data?.resultado || [];

  const firmaGrafo = firmas.find(
    (firma) => firma.tipoFirmaUsuario?.nombre === "Grafo"
  );
  firmaGrafoAprobador.value = firmaGrafo?.fileData || null;

  const firmaGenerica = firmas.find(
    (firma) => firma.tipoFirmaUsuario?.nombre === "Generica"
  );
  firmaGenericaAprobador.value = firmaGenerica?.fileName || null;
};

const getData = async () => {
  const id = route.params.id;
  try {
    const response = await sgdeaAxios.get(`/medicina/casos/${id}`, {
      showLoader: false,
    });

    const getPlantilla = await getPlantillaSinPrefijo();

    responseML.value = response.data;
    idRadicado.value = responseML.value.idRadicado;
    data.value = response.data;
    state.value = responseML.value.estado.estado;

    radicadoSalida.value =
      state.value === "Devolucion"
        ? response.data?.asignacion?.datosSalida?.documentoSalida
            ?.radicadoSalida
        : "";

    isDisabled.value =
      response.data.estado.estado === "Por revisar" &&
      auth.userInfo.role === "Gestionador"
        ? true
        : false;
    isDocSalida.value = response.data?.asignacion?.datosSalida?.documentoSalida
      ? true
      : false;
    // Si está aprobado se muestra la firma
    aprobado.value = response.data.estado.estado === "Aprobado";
    radicationDate.value = data.value.fechaRadicacion;
    const { data: responseMl } = response;

    const {
      asignacion: {
        datosSalida,
        metaDatos,
        idAprobador,
        idGestionador,
        idRevisor,
      },
      afectado,
    } = responseMl;

    // si existe aprobador, se toma la firma
    if (idAprobador) {
      await getFirma(idAprobador.id);
    }

    // idDocumento.value = datosSalida.id ?? "";
    hasDatosSalida.value = datosSalida === null ? false : true;
    if (datosSalida !== null && datosSalida.documentoSalida) {
      const {
        tipoDocumentoAfectado,
        departamento,
        municipio,
        tipoDocumentoDestinatario,
        documentoSalida,
        formaEnvio,
      } = datosSalida;

      if (responseMl?.prefijo?.prefijo.nombre === "Sin prefijo") {
        documentoFile.value = getPlantilla.base64x;
        restric.value = false;
      } else {
        //documentoFile.value = documentoSalida?.file ?? "";
        //Revertir el cambio con la condicional del restric = true
        //Revertir el cambio de la plantilla sin prefijo hasta que carguen plantillas en prod
        documentoFile.value = getPlantilla.base64x;
        restric.value = false;
      }
      let tipoFirma = response.data.prefijo?.tipoFirma.tipoFirma;
      const firmaAprobador =
        tipoFirma === "Grafo"
          ? firmaGrafoAprobador.value
          : firmaGenericaAprobador.value;

      htmlContent.value = documentoSalida?.htmlContent ?? "";
      referentKey.value.asunto = datosSalida.asunto ?? "";
      referentKey.value.NombredeDestinatario = datosSalida?.nombreDestinatario
        ? datosSalida.nombreDestinatario.trim()
        : "";

      referentKey.value.TipoDeDocumentoDestinatario = tipoDocumentoDestinatario
        ? tipoDocumentoDestinatario.nombre
        : "";
      referentKey.value.DireccionDeDestinatario =
        datosSalida.direccionDestinatario;
      // @ts-ignore
      referentKey.value.TelefonoDeDestinatario =
        datosSalida.telefonoDestinatario;
      referentKey.value.DepartamentoYMunicipioDestinatario =
        departamento && municipio
          ? `${departamento.nombre} - ${municipio.nombre}`
          : "";
      referentKey.value.CorrreoDestinatario = datosSalida.correoDestinatario;
      referentKey.value.NombreAfectado = datosSalida?.nombreAfectado
        ? datosSalida?.nombreAfectado.trim()
        : "";
      referentKey.value.TIpoDeDocumentoAfectado = tipoDocumentoAfectado
        ? tipoDocumentoAfectado.nombre
        : "";
      referentKey.value.NumerodocumentoAfectado =
        datosSalida.numeroDocumentoAfectado ?? "";
      referentKey.value.NoDoc = afectado.numeroDocumento ?? "";
      referentKey.value.NumeroDeSiniestro =
        metaDatos?.siniestro?.siniestro ?? "";
      referentKey.value.FechaDeSiniestro = metaDatos?.fechaSiniestro
        ? moment(metaDatos?.fechaSiniestro.toString()).format("DD/MM/YYYY")
        : "";
      referentKey.value.Firma = idAprobador
        ? tipoFirma === "Grafo"
          ? firmaAprobador
          : getFormattedName(idAprobador)
        : "";
      referentKey.value.NombreAprobador = idAprobador
        ? tipoFirma === "Grafo"
          ? getFormattedName(idAprobador)
          : ""
        : "";
      // @ts-ignore
      referentKey.value.CargoAprobador = idAprobador
        ? idAprobador?.cargo?.nombre
        : "";
      referentKey.value.DependenciaAprobador = idAprobador
        ? idAprobador?.usuarioRelaciones[0]?.oficina?.nombre // "GERENCIA MÉDICA"
        : "";
      referentKey.value.prefijo = datosSalida.documentoSalida
        ? datosSalida.documentoSalida?.prefijo?.prefijo?.nombre
        : "";
      referentKey.value.Subproceso = responseMl.subProceso?.subProceso ?? "";
      if (
        datosSalida?.copiasExternas?.length > 0 ||
        datosSalida?.copiasInternas?.length > 0
      ) {
        arrayCopyExterna.value = datosSalida?.copiasExternas.map((item) =>
          formatCopyExterna(item)
        );
        arrayCopyInterna.value = datosSalida?.copiasInternas.map((item) =>
          formatCopyInterna(item)
        );
        arrayAllCopys.value = [
          ...arrayCopyInterna.value,
          ...arrayCopyExterna.value,
        ];
      } else {
        arrayCopyExterna.value = [];
        arrayCopyInterna.value = [];
        arrayAllCopys.value = [];
      }
      dataHeader = {
        nombre: datosSalida.nombreAfectado,
        numeroDoc: datosSalida.numeroDocumentoDestinatario,
        direccion: datosSalida.direccionDestinatario,
        telefono: datosSalida.telefonoDestinatario,
        ciudad_dep:
          datosSalida.departamento?.nombre +
          " " +
          datosSalida.municipio?.nombre,
      };

        const usuarioElaboro = idGestionador
        ? `${idGestionador?.fullname} - ${
            responseMl?.asignacion?.idOficinaGestionador?.nombre ||
            ""
          }`
        : "";
      const usuarioRevisor = idRevisor
        ? `${idRevisor?.fullname} - ${
            responseMl?.asignacion?.idOficinaRevisor?.nombre ||
            ""
          }`
        : "";
      const usuarioAprobador = idAprobador
        ? `${idAprobador?.fullname } - ${
            responseMl?.asignacion?.idOficinaAprobador?.nombre ||
            ""
          }`
        : "";

      // Código CORREGIDO en getData()
dataFooter.value = {
  Anexo: documentosDeSalida.value.length, // Se establecerá en 0 inicialmente, lo cual está bien.
  Copia: arrayAllCopys.value.length > 0 ? arrayAllCopys.value : "0",
  DatosGestionador: usuarioElaboro,
  DatosRevisor: usuarioRevisor,
  DatosAprobador: usuarioAprobador,
  FormadeEnvio: formaEnvio ? formaEnvio.nombre : "",
};
    }
    disableButtonRechazarAfterThreeDaysSinceRadication();
  } catch (error) {
    toast.error("Ocurrió un problema al obtener el caso.");
    await router.push("/bandeja");
  }
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

const Disabled = computed(() => {
  return (
    responseML.value?.asignacion?.estado?.estado?.toLowerCase() === "anulado" &&
    responseML.value?.asignacion?.fechaAnulacion !== null &&
    responseML.value?.asignacion?.anulacionConReinicio === false
  );
});

const getPlantillaSinPrefijo = async () => {
  const nodeid = process.env.NODE_SIN_PREFIJO;

  const response = await sgdeaAxios.get<any>(
    `/radicados/consultar_documento/${nodeid}`,
    { showLoader: false }
  );

  return response.data;
};

const getMetadatos = async () => {
  try {
    const response = await sgdeaAxios.get(
      `/medicina/get-Ml-Metadatos/${responseML.value.id}`
    );

    if (response.status === 200) {
      metadatosInfo.value = response.data;
    }
  } catch (error) {
    removeButton(allNameTabs.asignar);
    removeButton(allNameTabs.reasignarOficina);
  }
};

// const getPrefijos = async () => {
//   if (data.value.prefijo !== null) {
//     listPrefijos.value = [
//       {
//         label: data.value.prefijo.prefijo.nombre,
//         value: data.value.prefijo.id,
//       },
//     ];

//     formDoc.value.prefijo = listPrefijos.value[0].label;
//   } else {
//     listPrefijos.value = [
//       { label: 'Sin prefijo', value: 1 },
//     ];
//     formDoc.value.prefijo = listPrefijos.value[0];
//   }
// };

const getPrefijos = async () => {
  try {
    // Obtener el ID
    const subprocesoId = data.value?.subProceso?.id;

    if (!subprocesoId) {
      listPrefijos.value = [{ label: "Sin prefijo", value: 1 }];
      formDoc.value.prefijo = listPrefijos.value[0];
      return;
    }

    const response = await sgdeaAxios.get("/medicina/prefijo-oficina", {
      params: { subproceso: subprocesoId },
    });

    if (response.status === 200) {
      if (response.data.length === 0) {
        listPrefijos.value = [{ label: "Sin prefijo", value: 1 }];
      } else {
        listPrefijos.value = response.data
          .map((e) => ({
            label: e.prefijo.nombre,
            value: e.id,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
      }
      if (data.value.prefijo) {
        formDoc.value.prefijo =
          listPrefijos.value.find(
            (item) => item.value === data.value.prefijo.id
          )?.label || listPrefijos.value[0].label;
      } else {
        formDoc.value.prefijo = listPrefijos.value[0].label;
      }
    }
  } catch (error) {
    console.error(error);
    listPrefijos.value = [{ label: "Sin prefijo", value: 1 }];
    formDoc.value.prefijo = listPrefijos.value[0].label;
  }
};

const getNombreComunicacion = () => {
  // const response = await sgdeaAxios.get('/medicina/prefijo-oficina')

  listNombreComunicacion.value = [
    { value: "1", label: data.value?.subProceso?.subProceso },
    // { value: "2", label: "x-002" },
    // { value: "3", label: "x-003" },
    // { value: "4", label: "x-004" },
  ];

  if (listNombreComunicacion.value.length > 0) {
    formDoc.value.nombreComunicacion = listNombreComunicacion.value[0].label;
  }
};

const filterPrefijos = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      filteredPrefijos.value = listPrefijos.value;
    });
    return;
  }
  update(() => {
    filteredPrefijos.value = listPrefijos.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  });
};

const filterNombreComunicacion = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      nombreComunicacion.value = listNombreComunicacion.value;
    });
    return;
  }
  update(() => {
    nombreComunicacion.value = listNombreComunicacion.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  });
};

const giveMeta = async () => {
  await getMetadatos();
  await getTabs();
};

const getBlobToIframe = async (id, list, action?) => {
  visibleDoscRead.value = true;
  const { data } = await sgdeaAxios.get(
    `/radicados/consultar_documento/${id}`,
    { showLoader: false }
  );

  if (id) {
    nameDocument.value = data.name;
  }

  const byteCharacters = atob(data.base64x);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });

  iframePdfUrl.value = URL.createObjectURL(blob);

  if (action) visualizadorPDF.value = true;

  if (list) {
    listForVizualiser.value = list;
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

onBeforeUnmount(() => {
  clearInterval(intervalId.value);
});

function removeButton(name) {
  const filteredTabs = tabs.value.filter((item) => item.name !== name);
  tabs.value = filteredTabs;
}

function rejectedTypes(fileEntries) {
  if (!fileEntries.length) {
    return;
  }

  if (
    fileEntries.some(
      (it: { failedPropValidation: string }) =>
        it.failedPropValidation === "max-files"
    )
  ) {
    toast.error(`Solo se pueden adjuntar ${maxFiles.value} archivos.`);
  }

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

function rejectedTypesAprob(fileEntries) {
  if (!fileEntries.length) {
    return;
  }

  if (fileEntries[0]?.file.size >= 50 * 1024 * 1024) {
    toast.error(`El peso máximo permitido es de 50MB`);
  } else {
    const allowedFileTypes = [
      "png",
      "jpg",
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
        "El formato que está intentando cargar no se encuentra permitido, solo se manejan formatos de tipo png, jpg, jpeg, webp"
      );
    }
  }
}

const closeModal = () => {
  //manual.value = false;
  labelComponet.value = "Información General";
  tabOne.value = "Información General";
};

const nuevoDocumento = async () => {
  await reiniciarGestionNuevoDoc();
  await getData();
  await getDimanicDatos();
  getTabs();
  await getMetadatos();
  await getDocs();
  await gettrazabilidadDocumento();
  getNombreComunicacion();
  await getExpediente();
};

const reiniciarGestionNuevoDoc = async () => {
  try {
    const response = await sgdeaAxios.patch(
      `/medicina/reiniciarGestion/${responseML.value.id}`
    );

    if (response.status === 200 || response.status === 201) {
      toast.success("Se ha reiniciado la gestión correctamente");
    }
  } catch (error) {
    toast.error("Hubo un error al reiniciar la gestión");
  } finally {
    labelComponet.value = "Información General";
    tabOne.value = "Información General";
  }
};

const showComponents = async (name: string) => {
  labelComponet.value = name;
  tabOne.value = labelComponet.value;
};

const editChangeDocSalida = (data) => {
  activeEdit.value = data;
};

const updateModal = async (value) => {
  form.value.motivoRechazo = value.value;
  showModalConfrim.value = true;
};

const updateModalAprob = async (value) => {
  form.value.motivoRechazo = value.value;
  showModalConfrimAprob.value = true;
};

const aprobarCasoAprobador = async () => {
  aprobado.value = true;
  emit("image-loaded", firmaAprobador.value);
};

const updateModalAprobador = async (value) => {
  motivoRechazoAprobador.value = value.value;
  showModalConfirmAprobador.value = true;
};

const hideModal = (value) => {
  showModalRechazarRevision.value = value;
  showModalRechazarApro.value = value;
  showComponents("Información General");
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

const showUploadFiles = (type) => {
  isShowButtonUpload.value = type;
};

const handleChangeDocType = async () => {
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
        proceso: "PQRD" + responseML.value.id,
        secuencia: responseML.value.idRadicado,
        estado: responseML.value.estado.estado,
        descripcion: `${auth.$state.userInfo.name} cambio el tipo de documento para ${loadedDocsToChangeType.value.length} archivos a ${data[0].tipo}`,
        comentario: `Adjunto`,
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} cambio el tipo de documento para ${loadedDocsToChangeType.value.length} archivos a ${data[0].tipo}`,
        tramite: "Medicina Laboral",
      });
      loadedDocsToChangeType.value = [];
      finished.value = true;
      modalChangeDocType.value = false;
      showChangeDocType.value = false;
    }
  } catch (error) {
    toast.error("Ocurrió un problema al cambiar el tipo de documento.");
  }
};

async function getDocs() {
  const { data: files }: { data } = await sgdeaAxios.get(
    `/medicina/documentos/${responseML.value?.id}`,
    { showLoader: false }
  );
  dbDocs.value = files;

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

  const documentosFiltrados = listDocs2.value.filter(
    (doc) => doc.tipoDocumento?.trim().toUpperCase() === 'SALIDA'
  );
  documentosDeSalida.value = documentosFiltrados;

  if (dataFooter.value) {
    dataFooter.value.Anexo = documentosDeSalida.value.length;
  }
}

async function handleUploadFile() {
  const files: File[] | File = newFileInput.value;

  if ((Array.isArray(files) && files.length === 0) || files === null) {
    toast.error("Debe seleccionar un archivo y/o seleccionar una opción.");
    return;
  }

  const formData = new FormData();
  const filesToUpload = Array.isArray(files) ? files : [files];

  // Obtener lista de documentos existentes
  const { data: existingDocs } = await sgdeaAxios.get(
    `/medicina/documentos/${responseML.value?.id}`,
    { showLoader: false }
  );

  for (const file of filesToUpload) {
    let finalFileName = file.name;
    let version = 1;

    const fileExists = existingDocs.some((doc) => {
      const existingName = doc.nombre.toLowerCase();
      const newName = file.name.toLowerCase();

      const baseExisting = existingName.replace(/(_v\d+)?(\.[^.]+)$/, "");
      const baseNew = newName.replace(/(_v\d+)?(\.[^.]+)$/, "");

      return baseExisting === baseNew;
    });

    if (fileExists) {
      const baseName = file.name.replace(/\.[^.]+$/, "");
      const extension = file.name.split(".").pop();

      const versions = existingDocs
        .filter((doc) => doc.nombre.startsWith(baseName))
        .map((doc) => {
          const match = doc.nombre.match(/_v(\d+)\./);
          return match ? parseInt(match[1]) : 0;
        });

      version = Math.max(...versions, 0) + 1;
      finalFileName = `${baseName}_v${version}.${extension}`;
    }

    const modifiedFile = new File([file], finalFileName, { type: file.type });
    formData.append("files", modifiedFile);
  }

  let isEntrada =
    auth.$state.userInfo.role == "Administrador" ||
    auth.$state.userInfo.role == "Asignador Responsable" ||
    auth.$state.userInfo.role.includes("Radicador");

  try {
    const { data } = await sgdeaAxios.post(
      `/medicina/documentos/${responseML.value.id}`,
      formData,
      {
        params: {
          user: auth.$state.userInfo.userid,
          tipoDocumento: isEntrada
            ? "ENTRADA"
            : esSalida.value
            ? "SALIDA"
            : "SOPORTE",
        },
        showLoader: false,
      }
    );

    if (data) {
      toast.success("Se realizó el cargue correctamente");
      await crearTrazabilidad({
        proceso: "ML" + responseML.value.id,
        secuencia: responseML.value.idRadicado,
        estado: responseML.value.estado.estado,
        descripcion: "Se ha adjuntado un documento al radicado",
        comentario: "Adjunto",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} añadió un documento al radicado`,
        tramite: "Medicina Laboral",
      });
      modalDocuments.value = false;
      getData();
      newFileInput.value = [];
    }
  } catch (error) {
    toast.error("Ha sucedido un error al intentar cargar el archivo");
  }
  getDocs();
}

async function handleUploadFilebySalidaSupport() {
  confirmModalByFiles.value = false;
  loadingChargeDocs.value = true;
  const files: File[] | File = newFileInputSoporte.value;

  if (!files) {
    toast.error("Debe seleccionar minimo un archivo.");
    return;
  }

  const formData = new FormData();
  for (const file of Array.isArray(files) ? files : [files]) {
    formData.append("files", file);
  }

  try {
    const response = await sgdeaAxios.post(
      `/medicina/documentos/${responseML.value.id}`,
      formData,
      {
        params: {
          user: auth.$state.userInfo.userid,
          tipoDocumento: "SALIDA",
        },
        showLoader: false,
      }
    );

    if (response.data) {
      toast.success("Proceso de carga finalizado correctamente");
      await crearTrazabilidad({
        proceso: "ML" + responseML.value.id,
        secuencia: responseML.value.idRadicado,
        estado: responseML.value.estado.estado,
        descripcion: `Usuario: ${auth.$state.userInfo.name} añadió un documento de soporte`,
        comentario: "Adjunto",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} añadió un documento de soporte`,
        tramite: "Medicina Laboral",
      });
      soporteSalidaModal.value = false;
      newFileInputSoporte.value = [];
      loadingChargeDocs.value = false;
      getData();
      showComponents("Información General");
    }
  } catch (error) {
    loadingChargeDocs.value = false;
  }
  getDocs();
}

const openModalDocument = () => {
  modalDocuments.value = true;
  if (auth.userInfo.role == "Asignador Responsable") {
    isAsignador.value = true;
  }
};

const descargaPdf = async (idRadicacion, node) => {
  try {
    const { data } = await sgdeaAxios.get(
      `/radicados/consultar_documento/${node}`,
      { showLoader: false }
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

    router.push("/bandeja");
  } catch (error) {
    toast.error("Ocurrió un error inesperado.");
  }
};

async function beforeRevision() {
  revisado.value = true;
  loadingEnvios.value = true;
}

function beforeAprobacion() {
  emit("image-loaded", firmaAprobador.value);
  aprobarCasoModal.value = false;
  loadingEnvios.value = true;
  aprobado.value = true;
}

const aprobarRevision = async (data) => {
  const isAprobAuto =
    responseML.value?.asignacion?.datosSalida?.documentoSalida?.prefijo
      ?.aprobacionAutomatica;
  try {
    const formData = new FormData();

    // Verifica si 'data' es un archivo o blob válido
    if (data instanceof File || data instanceof Blob) {
      formData.append("file", data, "archivo.pdf");
    } else {
      // Si no es un archivo, lo convertimos en un Blob
      const blob = new Blob([data], { type: "application/pdf" });
      formData.append("file", blob, "archivo.pdf");
    }

    const response = await sgdeaAxios.patch(
      `/medicina/aprobarRevision`,
      formData,
      {
        params: {
          idMedicina: responseML.value.id,
        },
      }
    );

    nodeId.value =
      response.data?.asignacion?.datosSalida?.documentoSalida?.nodeIdRadicadoSalida;
    idRadicacion.value =
      response.data?.asignacion?.datosSalida?.documentoSalida?.radicadoSalida;
    if (response.status == 200) {
      const { documentoSalida } =
        responseML.value.asignacion?.datosSalida || null;

      if (revisorCambio.value == true) {
        await crearTrazabilidadDocumento(
          {
            htmlContent: docChange.value,
            usuario: auth.userInfo.name,
            rol: auth.userInfo.role,
          },
          documentoSalida.id,
          "ML"
        );
      }
      toast.success("La respuesta proyectada tiene su visto bueno");
      const dataTrazabilidad = {
        proceso: `ML${responseML.value.id}`,
        secuencia: responseML.value.idRadicado,
        estado: "Por aprobar",
        descripcion: `Usuario: ${auth.$state.userInfo.name} ha dado visto bueno a la respuesta proyectada`,
        comentario: "Revisada",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} dió visto bueno a la respuesta proyectada para el caso`,
        tramite: "Medicina Laboral",
      };

      await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad, {
        showLoader: false,
      });
      loadingEnvios.value = false;

      if (isAprobAuto) {
        showModalExito.value = true;
      } else {
        router.push("/bandeja");
      }
    }
  } catch (error) {
    loadingEnvios.value = false;
    toast.error("Ha ocurrido un error al ejecutar la petición");
  }
};

const aprobacionApro = async (data) => {
  const formData = new FormData();

  const body = {
    radicados: [
      {
        id: responseML.value.id,
        file: `[object Object].pdf`,
        aprobadorId: auth.userInfo.userid,
      },
    ],
  };

  const bodyJson = JSON.stringify(body);
  formData.append("body", bodyJson);
  formData.append("files", data, `[object Object].pdf`);

  try {
    const response = await sgdeaAxios.patch(
      `/medicina/aprobarAprobacion`,
      formData
    );
    nodeId.value =
      response.data[0].asignacion?.datosSalida?.documentoSalida?.nodeIdRadicadoSalida;
    idRadicacion.value =
      response.data[0].asignacion?.datosSalida?.documentoSalida?.radicadoSalida;
    if (response.status == 200) {
      toast.success("La respuesta proyectada tiene su visto bueno");
      const dataTrazabilidad = {
        proceso: `ML${responseML.value.id}`,
        secuencia: responseML.value.idRadicado,
        estado: "Aprobado",
        descripcion: `Usuario:${auth.$state.userInfo.name} ha dado visto bueno a la respuesta proyectada`,
        comentario: "Aprobada",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} dió visto bueno a la respuesta proyectada para el caso`,
        tramite: "Medicina Laboral",
      };
      await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad, {
        showLoader: false,
      });
      loadingEnvios.value = false;
      showModalExitoApro.value = true;
    }
  } catch (error) {
    loadingEnvios.value = false;
    toast.error("Ha ocurrido un error al ejecutar la petición");
  }
};

const exitoAprobacion = async () => {
  router.push("/bandeja");
};

const exitoAprobacionApro = async () => {
  router.push("/bandeja");
};

const rechazarRevision = async () => {
  try {
    const response = await sgdeaAxios.patch(`/medicina/rechazarRevision`, {
      radicados: [
        {
          id: responseML.value.id,
          observaciones: form.value.motivoRechazo,
        },
      ],
    });

    if (response.status == 200) {
      toast.success("Se realizó el rechazo del radicado de manera exitosa.");
      const dataTrazabilidad = {
        proceso: `ML${data.value.id}`,
        secuencia: data.value.idRadicado,
        estado: "Revisión rechazada",
        descripcion: `Usuario: ${auth.$state.userInfo.name} ha rechazado la revisión, Motivo:${form.value.motivoRechazo}`,
        comentario: form.value.motivoRechazo,
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} rechazó la revision del radicado`,
        tramite: "Medicina Laboral",
      };
      const { documentoSalida } =
        responseML.value.asignacion?.datosSalida || null;
      await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad, {
        showLoader: false,
      });
      if (revisorCambio.value === true) {
        await crearTrazabilidadDocumento(
          {
            htmlContent: docChange.value,
            usuario: auth.userInfo.name,
            rol: auth.userInfo.role,
          },
          documentoSalida.id,
          "ML"
        );
      }
    }
  } catch (error) {
    toast.error("Ha ocurrido un error inesperado.");
  } finally {
    router.push("/bandeja");
  }
};

const rechazarApro = async () => {
  try {
    const response = await sgdeaAxios.patch(`/medicina/rechazarAprobacion`, {
      radicados: [
        {
          id: responseML.value.id,
          observaciones: form.value.motivoRechazo,
        },
      ],
    });

    if (response.status == 200) {
      toast.success("Se realizó el rechazo del radicado de manera exitosa.");
      const dataTrazabilidad = {
        proceso: `ML${data.value.id}`,
        secuencia: data.value.idRadicado,
        estado: "Aprobación rechazada",
        descripcion: `Usuario: ${auth.$state.userInfo.name} ha rechazado la aprobación Motivo:${form.value.motivoRechazo}`,
        comentario: form.value.motivoRechazo,
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} rechazó la revision del radicado`,
        tramite: "Medicina Laboral",
      };
      const { documentoSalida } =
        responseML.value.asignacion?.datosSalida || null;
      await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad, {
        showLoader: false,
      });
      if (aprobadorCambio.value === true) {
        await crearTrazabilidadDocumento(
          {
            htmlContent: docChange.value,
            usuario: auth.userInfo.name,
            rol: auth.userInfo.role,
          },
          documentoSalida.id,
          "ML"
        );
      }
    }
  } catch (error) {
    toast.error("Ha ocurrido un error inesperado.");
  } finally {
    router.push("/bandeja");
  }
};

const outToBandeja = async () => {
  try {
    const response = await sgdeaAxios.put(
      `/medicina/desreclamo?id=${responseML.value.id}`
    );
    if (response.status === 200 || response.status === 201) {
      toast.success("Se ha desasignado el radicado");
      router.push("/bandeja");
    }
  } catch (error) {
    toast.error("Ha ocurrido un error al desasignar el radicado");
  }
};
const isCreateDocument = ref(false);
const getModalSalida = async () => {
  if (await formModalSalida.value.validate()) {
    const response = await sgdeaAxios.post(
      `/medicina/documentoSalida/${data.value.id}`,
      {
        nombreComunicacion: formDoc.value.nombreComunicacion?.label ?? formDoc.value.nombreComunicacion,
        prefijo: listPrefijos.value[0].value,
        // htmlContent: "",
      },
      { showLoader: false }
    );
    if (response.status === 200) {
      showModalDocSalida.value = false;
      location.reload()
      await getData();
      isCreateDocument.value = true;
      viewEditor.value = true;
    }
  } else {
    toast.error("Debe ingresar todos los campos obligatorios para continuar.");
  }
};

const rechazarCasoGestion = async () => {
  if (await formRechazo.value.validate()) {
    try {
      const response = await sgdeaAxios.patch(
        `/medicina/rechazarAsignacion/${responseML.value.id}`,
        {
          observaciones: observacionesRechazo.value,
        }
      );
      if (response.status == 200) {
        await crearTrazabilidad({
          proceso: "ML" + responseML.value.id,
          secuencia: responseML.value.idRadicado,
          estado: "Gestión rechazada",
          descripcion:
            `Usuario: ${auth.$state.userInfo.name}` +
            `Motivo:${observacionesRechazo.value}`,
          comentario: observacionesRechazo.value,
          nombre: auth.$state.userInfo.name,
          accion: `${auth.$state.userInfo.name} rechazó el caso`,
          tramite: "Medicina Laboral",
        });
        toast.success(
          "Se rechazó la asignación para gestión del trámite con éxito"
        );
        router.push("/bandeja");
      }
    } catch (error) {
      toast.error("Ha ocurrido un error al rechazar el caso.");
    }
  } else {
    toast.error(
      "Para continuar, asegúrese de que todos los campos requeridos estén completos."
    );
  }
};

const getModalReinicio = async () => {
  if (await formReinicioGestion.value.validate()) {
    try {
      const response = await sgdeaAxios.patch(
        `/medicina/reiniciarGestion/${responseML.value.id}`,
        {
          observaciones: observacionesReinicio.value,
        }
      );
      if (response.status == 200) {
        await crearTrazabilidad({
          proceso: "ML" + responseML.value.id,
          secuencia: responseML.value.idRadicado,
          estado: "Para gestión",
          descripcion:
            `Usuario:${auth.$state.userInfo.name}` +
            `Comentario: ${observacionesReinicio.value}`,
          comentario: observacionesReinicio.value,
          nombre: auth.$state.userInfo.name,
          accion: `${auth.$state.userInfo.name} reinicio la gestión del caso`,
          tramite: "Medicina Laboral",
        });
        toast.success("Se reinicio la gestión del trámite correctamente");
        router.push("/bandeja");
      }
    } catch (error) {
      toast.error("Ha ocurrido un error al reiniciar la gestión del trámite.");
    }
  } else {
    toast.error(
      "Para continuar, asegúrese de que todos los campos requeridos estén completos."
    );
  }
};

const getExpediente = async (nodeId?: string) => {
  const { data: expediente } = await sgdeaAxios.get("/expediente/children", {
    params: { nodeId: nodeId || responseML.value.nodeId },
  });

  if (Object.keys(expediente).length) isExpedientes.value = true;
  else isExpedientes.value = false;
};

const successIncluirExpediente = (nodeId) => {
  if (nodeId) {
    getData();
    getExpediente(nodeId);
  }
};

const saveReasignacion = async (event) => {
  try {
    const oficinaFinal = [];
    oficinaFinal.push(event.oficinaId);
    const response = await sgdeaAxios.put(`/oficinas/reasignar`, {
      idFlujo: 8,
      idCaso: responseML.value.id,
      idOficina: oficinaFinal,
    });
    if (response.status == 200 || response.status == 201) {
      toast.success("El caso se reasigno con éxito");
      await crearTrazabilidad({
        proceso: "ML" + responseML.value.id,
        secuencia: responseML.value.idRadicado,
        estado: "Por asignar",
        descripcion:
          `Usuario:${auth.$state.userInfo.name} ha reasignado la oficina del radicado \n` +
          `Oficina nueva: ${event.oficinaAsignada} \n` +
          `Motivo:${event.motivoAsignacion}`,
        comentario: event.motivoAsignacion,
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} ha reasignado la oficina del radicado ${responseML.value.idRadicado}`,
        tramite: "Medicina Laboral",
      });
      router.push("/bandeja");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
const gestionadorCambio = ref(false);
const revisorCambio = ref(false);
const aprobadorCambio = ref(false);
const docChange = ref("");
let trazabilidadRegistrada = false;
async function autoSaveDocument({ paragraf, pdf }) {
  try {
    pdfBlob.value = pdf;
    const docResponseSave = await sgdeaAxios.patch(
      `/medicina/documentoSalida/${responseML.value.id}`,
      {
        htmlContent: paragraf,
      },
      { showLoader: false }
    );

    if (docResponseSave.status === 200 || docResponseSave.status === 201) {
      toast.success("Se guardó el documento exitosamente");

      // Actualizar el estado del rol que hizo el cambio
      const userRole = auth.$state.userInfo.role; // Suponiendo que el rol está almacenado en userInfo.role
      if (userRole === "Gestionador") {
        gestionadorCambio.value = true;
      } else if (userRole === "Revisor") {
        revisorCambio.value = true;
      } else if (userRole === "Aprobador") {
        aprobadorCambio.value = true;
      }
      docChange.value = paragraf;
      // Crear trazabilidad

      if (!trazabilidadRegistrada) {
        await crearTrazabilidad({
          proceso: "ML" + responseML.value.id,
          secuencia: responseML.value.idRadicado,
          estado: responseML.value.estado.estado,
          descripcion: `Usuario: ${auth.$state.userInfo.name} ha modificado el documento de salida del caso`,
          comentario: "Modificación",
          nombre: auth.$state.userInfo.name,
          accion: `${auth.$state.userInfo.name} ha modificado el documento de salida del caso ${responseML.value.idRadicado}`,
          tramite: "Medicina Laboral",
        });
        trazabilidadRegistrada = true;
      }
      await getData();
    }
  } catch (error) {
    toast.error("Hubo un error al guardar el documento.");
  }
}

const onEventSenbRevision = async () => {
  const payload = {
    motivoAsignacion: `Envio a revision por usuario ${auth.$state.userInfo.name}`,
    idRevisor: auth.$state.userInfo.userid,
    idOficinaRevisor: auth.$state.userInfo.oficina
  };
  const response = await sgdeaAxios.put(
    `/medicina/enviarRevision/${responseML.value.id}`,
    payload
  );
  if (response.status === 200) {
    await crearTrazabilidad({
      proceso: `ML${responseML.value.id}`,
      secuencia: responseML.value.idRadicado,
      estado: responseML.value.estado.estado,
      descripcion: `se ha enviado a revision el radicado`,
      comentario: "Enviado a revision",
      nombre: auth.$state.userInfo.name,
      accion: `${auth.$state.userInfo.name} se ha enviado el radicado ha revision `,
      tramite: "Medicina Laboral",
    });
  }
};
const trazaDocument = ref();
const gettrazabilidadDocumento = async () => {
  if (
    responseML.value.asignacion &&
    responseML.value?.asignacion?.datosSalida
  ) {
    const { documentoSalida } =
      responseML.value?.asignacion?.datosSalida || null;
    if (documentoSalida) {
      try {
        const response = await sgdeaAxios.get(
          `/api/documentos-salida/${documentoSalida?.id}/historial`,
          { showLoader: false }
        );
        trazaDocument.value = response.data;
      } catch {
        toast.error("Ha ocurrido un error al obtener la información");
      }
    }
  }
};
const toggleReturnConfirmation = () => {
  showReturnConfirmation.value = !showReturnConfirmation.value;
};
const updateSelectedCases = async () => {
  try {
    const response = await sgdeaAxios.get(
      `/envios/mailing/devolucion/${data?.value.id}/${route.params.idFlujo}`
    );

    toast.success("Su caso ha sido devuelto exitosamente.");

    router.push("/envios-seguimientos/correos");
  } catch (error) {
    toast.error("Ha ocurrido un error");
  } finally {
    await getData();
    await getDimanicDatos();
    if (
      state.value === "Devolucion" ||
      state.value === "Devolucion Pendiente"
    ) {
      validacionesDevolucion();
    } else {
      getTabs();
    }
    await getMetadatos();
    await getDocs();
    await gettrazabilidadDocumento();
    getNombreComunicacion();
    await getExpediente();
    if (auth.userInfo.role !== "Asignador Responsable") {
      await getPrefijos();
    }

    assignmentWebSocket.startAssignmentTimer(route.params.id);

    callDisableRechazarButtonAtFourThirtyPM();

    if (auth.userInfo.role !== "Asignador Responsable") {
      await getPrefijos();
    }
    await gettrazabilidadDocumento();
  }
};
watch(labelComponet, async (val) => {
  if (val === "Iniciar Gestión") {
    try {
      const response = await sgdeaAxios.patch(
        `/medicina/iniciarGestion/${responseML.value.id}`
      );

      if (response.status === 200) {
        labelComponet.value = "Información General";
        await getData();
        getTabs();
        await crearTrazabilidad({
          proceso: `ML${responseML.value.id}`,
          secuencia: responseML.value.idRadicado,
          estado: responseML.value.estado.estado,
          descripcion: `Usuario: ${auth.$state.userInfo.name} ha iniciado la gestión al radicado`,
          comentario: "Iniciar Gestión",
          nombre: auth.$state.userInfo.name,
          accion: `${auth.$state.userInfo.name} ha iniciado la gestión en el trámite`,
          tramite: "Medicina Laboral",
        });
      }
    } catch (error) {
      toast.error("Ocurrió un problema al iniciar la gestión.");
    }
  }
});

watch(labelComponet, async (val) => {
  if (val === "Documento de salida" && !isDocSalida.value) {
    showModalDocSalida.value = true;
  }

  if (val === "Soportes de salida") {
    soporteSalidaModal.value = true;
  }

  if (val === "Reinicio de la gestión") {
    showModalReiniciar.value = true;
  }
});
watch(labelComponet, async (val) => {
  if (val === "Documento de salida" && !hasDatosSalida.value) {
    toast.warning(
      "Recuerde llenar los datos de salida antes de generar el nuevo documento"
    );
  }

  if (!hasDatosSalida.value && !isCreateDocument.value) {
    viewEditor.value = false;
  } else if (hasDatosSalida.value == true) {
    viewEditor.value = true;
  }
});
</script>

<style>
.textFile {
  width: 136px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.75em;
}
</style>
