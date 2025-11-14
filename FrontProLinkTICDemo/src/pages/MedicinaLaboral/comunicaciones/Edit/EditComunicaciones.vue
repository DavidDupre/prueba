<template>
  <q-page class="tw-pt-1">
    <div>
      <router-link to="/medicina/bandeja-comunicaciones">
        <q-btn
          flat
          color="primary"
          label="Volver"
          icon="chevron_left"
          class="-tw-ml-2"
        />
      </router-link>
    </div>

    <div class="tw-flex tw-items-center">
      <div class="tw-flex tw-w-full tw-justify-between">
        <div>
          <ComponentTitle
            class="tw-mt-1"
            :title="`Comunicaciones oficiales`"
            classTitle="tw-font-bold tw-text-4xl"
          />

          <div
            :class="`tw-inline-block tw-p-1.5 tw-px-4 tw-rounded-lg tw-border ${ESTADOS[state]}`"
          >
            <span class="tw-font-semibold">{{ state }}</span>
          </div>
        </div>

        <div
          class="tw-flex tw-min-h-[36px] tw-pr-2 tw-gap-2 tw-mt-20"
          v-if="auth.userInfo.role === 'Revisor'"
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
              tab = 'documento-salida';
              showModalAprobarRevision = true;
            "
            class="!tw-px-8 tw-w-40"
          />
        </div>

        <div
          class="tw-flex tw-min-h-[36px] tw-pr-2 tw-gap-2 tw-mt-20"
          v-if="auth.userInfo.role === 'Aprobador' && state === 'Por aprobar'"
        >
          <q-btn
            label="Rechazar"
            color="secondary"
            icon="close"
            @click="showModalRechazarAprobacion = true"
            class="tw-w-40"
          />
          <q-btn
            label="Aprobar"
            color="primary"
            icon="check"
            @click="
              tab = 'documento-salida';
              showModalAprobarAprobacion = true;
            "
            class="!tw-px-8 tw-w-40"
          />
        </div>
      </div>
    </div>

    <q-card class="tw-mt-8" flat>
      <q-tabs
        v-model="tab"
        no-caps
        inline-label
        indicator-color="transparent"
        active-color="primary"
        align="left"
        outside-arrows
        class="tw-rounded-lg tw-bg-white custom-tabs tw-flex"
      >
        <div v-for="tab in filteredTabs">
          <q-tab
            :icon="tab.icon"
            :key="tab.key"
            :name="tab.key"
            square
            :ripple="false"
            class="tw-rounded-lg q-pa-sm tw-text-sm tw-px-3 tw-text-[#6B737C]"
            :label="tab.name"
          />
        </div>
      </q-tabs>
    </q-card>

    <q-tab-panels v-model="tab" animated class="tw-bg-transparent">
      <q-tab-panel name="documento-salida" class="q-pa-none">
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <Editor
            :data="dataFooter"
            :referentKey="referentKey"
            :restric="restric"
            :base64="documentoFile"
            :isEditorEmpty="true"
            @datos-response="autoSaveDocument"
            :document="htmlContent"
            @revisado="aprobarRevision"
            @aprobado="aprobarCaso"
            :aprobado="aprobado"
            :revisado="revisado"
            :img-base64="imgBase64"
          />
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="informacion-general" class="q-pa-none">
        <InforGeneral :data="allInfo" />
      </q-tab-panel>

      <q-tab-panel name="documentos-relacionados" class="q-pa-none">
        <DocumentosRelacionados
          :visualize="getBlobToIframe"
          v-model:detalleML="allInfo"
          :show-modal="modalDocuments"
          @changeDocType="changeDocType"
          v-model:finished="finished"
          @updated="getAllData()"
        />
      </q-tab-panel>

      <q-tab-panel name="metadatos" class="q-pa-none">
        <q-form greedy ref="myForm0">
          <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
            <p class="tw-text-2xl tw-font-bold tw-pb-4">Metadatos</p>
            <MetadatosForm
              ref="validationMetadatos"
              :form="formGeneralData"
              :key="meta"
              :is-disabled="isDisabled"
              @get-person="resetMetaForm"
            />
          </q-card>
        </q-form>
      </q-tab-panel>

      <q-tab-panel name="datos-salida" class="q-pa-none">
        <q-form ref="myForm10" greedy>
          <q-card
            v-if="stepDataSend === 0"
            class="q-mt-lg tw-rounded-xl q-pa-lg"
            flat
          >
            <p class="tw-text-2xl tw-font-bold tw-pb-4">Destinatarios</p>
            <FormFormDatosSalida
              :disable-options="false"
              :data-initial="formExitData"
              :only-read="isDisabled"
              @get-person="myForm10.reset()"
            />
          </q-card>

          <q-card
            v-if="stepDataSend === 1"
            class="q-mt-md tw-rounded-xl q-pa-lg"
            flat
          >
            <p class="tw-text-2xl tw-font-bold tw-pb-4">Copia</p>
            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label tw-font-semibold"
                    >¿Con copia?*</label
                  >
                  <q-select
                    map-options
                    emit-value
                    dense
                    outlined
                    class="tw-rounded-lg"
                    v-model="formExitData.copyType"
                    :options="copiesTypesOptions"
                    label="Seleccione"
                    :rules="[inputRequired]"
                  />
                </span>
              </div>
            </div>
          </q-card>

          <div
            v-if="
              [1, 4].includes(Number(formExitData.copyType)) &&
              stepDataSend === 1
            "
          >
            <q-card class="q-mt-md tw-rounded-xl q-pa-lg" flat>
              <p class="tw-text-2xl tw-font-bold tw-pb-4">Copia Interna</p>
              <FormCopyInterna
                :is-fisr-render="isFisrRenderInterno"
                :id-comunicacion="Number(idComunicacion)"
                :key="isFormResetInterno"
                @update:item-added="
                  (form) => handleClickAddNewDestinaryInterno(form)
                "
              />
            </q-card>

            <q-card class="q-mt-md tw-rounded-xl q-pa-lg" flat>
              <TableDestinatarios
                key="bodyCopyInterna"
                :title="`Listado copias externa`"
                class="full-width"
                :JUZGADOS_HEADER="DESTINARIOS_HEADER_COPY_INTERNA"
                :JUZGADOS_BODY="sortOptionsVal(bodyCopyInterna)"
                @update:item-deleted="(value) => (bodyCopyInterna = value)"
              />
            </q-card>
          </div>

          <div
            v-if="
              [2, 4].includes(Number(formExitData.copyType)) &&
              stepDataSend === 1
            "
          >
            <q-card class="q-mt-md tw-rounded-xl q-pa-lg" flat>
              <p class="tw-text-2xl tw-font-bold tw-pb-4">Copia Externa</p>
              <FormCopyExterna
                :is-fisr-render="isFisrRender"
                :id-comunicacion="Number(idComunicacion)"
                :is-medicina-laboral="true"
                :key="isFormResetExterno"
                @update:item-added="
                  (form) => handleClickAddNewDestinaryExterno(form)
                "
              />
            </q-card>

            <q-card class="q-mt-md tw-rounded-xl q-pa-lg" flat>
              <TableDestinatarios
                key="bodyCopyExterna"
                class="full-width"
                title="Usuarios externos con copia"
                :JUZGADOS_HEADER="DESTINARIOS_HEADER_COPY_EXTERNA"
                :JUZGADOS_BODY="bodyCopyExterna"
                @update:item-deleted="(value) => (bodyCopyExterna = value)"
              />
            </q-card>
          </div>

          <FormEditor v-if="stepDataSend === 2" :data-initial="formExitData" />
        </q-form>
      </q-tab-panel>

      <q-tab-panel name="adjuntar-documento" class="q-pa-none">
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <p class="tw-text-2xl tw-font-bold tw-pb-4">
            Adjuntar documentos de Salida
          </p>
          <div class="col-12">
            <span class="tw-w-full">
              <p class="tw-mb-1 tw-pl-3">Adjuntar archivos</p>
              <FileLoader
                v-model="formDatosAdjuntos.files"
                class="tw-w-full"
                :multiple="true"
                accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
                sub-title="Puede adjuntar (30) Archivo(s) cada uno con un tamaño permitido de 50MB en cualquiera de las siguientes extenciones <hr>(pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)"
                :max-file-size="50 * 1024 * 1024"
                :max-files="30"
                max-file-size-label="50"
                @rejected="rejectedFiles"
              />
            </span>
          </div>
        </q-card>

        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <TableDocuments
            :is-change-doc-type="false"
            :key="fileDataTable"
            class="full-width"
            :JUZGADOS_HEADER="DOCUMENTOS_HEADER"
            :JUZGADOS_BODY="fileDataTable"
            @update:item-deleted="(value) => handleDelteFileTable(value)"
          />
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="incluir-exp">
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <IncluirExpediente
            :com-data="allInfo"
            :is-disabled="isDisabled"
            @update:is-expediente="getExpediente"
            @redirect="tab = 'metadatos'"
          />
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="trazabilidad">
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <Trazabilidad :id-comunicacion="idComunicacion" />
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="comentarios">
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <Comentarios
            :estado="state"
            :secuencia="secuencia"
            :id-comunicacion="idComunicacion"
            text-default="Ha comentado sobre la comunicación"
            :show-modal="noteModal"
            @closeModal="noteModal = false"
          />
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="enviar-revision">
        <q-form ref="myForm20" greedy>
          <FormRevision
            :data-initial="formRevision"
            @update:item-selected="(val) => (userSeletecdByRevision = val)"
          />
          <TableOnlyShow
            v-if="isComunicacionAutomatica"
            :TABLE_HEADER="columnsAsignar2"
            :TABLE_BODY="aprobadorSelected"
          />
          <FormAprobacion
            v-else
            :data-initial="formAprobacion"
            @update:item-selected="(val) => (userSeletecdByAprobacion = val)"
          />
        </q-form>
      </q-tab-panel>
      <q-tab-panel name="trazabilidad-documento">
        <TrazabilidadDocumento :ml-data="trazaDocument" />
      </q-tab-panel>
    </q-tab-panels>

    <div
      v-if="
        ![
          'documento-salida',
          'incluir-exp',
          'informacion-general',
          'documentos-relacionados',
          'trazabilidad',
          'comentarios',
          'trazabilidad-documento',
        ].includes(tab)
      "
      class="tw-flex tw-justify-center tw-items-center tw-my-6 tw-gap-6"
    >
      <q-btn
        v-if="tab === 'datos-salida' && stepDataSend"
        @click="handleComeBack()"
        label="Regresar"
        text-color="white"
        style="width: 240px"
        color="primary"
        class="tw-rounded-xl tw-h-12 tw-p-2"
        :disable="isDisabled"
      />

      <q-btn
        @click="showCancelModal = true"
        :label="'Cancelar'"
        type="reset"
        style="width: 240px"
        text-color="black"
        color="accent"
        class="tw-rounded-xl tw-h-12"
        :disable="isDisabled"
      />

      <q-btn
        @click="next()"
        :label="
          tab === 'datos-salida'
            ? labelBtnDatosSalida
            : tab === 'enviar-revision'
            ? 'Enviar a revisión'
            : 'Guardar'
        "
        text-color="white"
        style="width: 240px"
        color="primary"
        class="tw-rounded-xl tw-h-12 tw-p-2"
        :disable="isDisabled"
      />

      <!-- <q-btn
        v-if="tab === 'datos-salida' && stepDataSend === 1 && activeButtonCopy"
        @click="next()"
        :label="tab === 'datos-salida' ? labelBtnDatosSalida : 'Guardar'"
        text-color="white"
        style="width: 240px"
        color="primary"
        class="tw-rounded-xl tw-h-12 tw-p-2"
        :disable="isDisabled"
      /> -->
    </div>

    <Modal
      v-model:model-value="showCancelModal"
      title="Confirmación"
      persistent
      :text="'Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?'"
      :is-success="false"
      :cancelButton="true"
      @handle-accept="handleAcceptModal"
      textButtonCancel="No"
      text-button="Si"
    />

    <ExitoModal
      text-cancel-modal="Descargar"
      text-confirm-modal="Finalizar"
      :text-show-modal="`La respuesta proyectada tiene su visto bueno. Radicado de salida generado SAL - 2024 - ${idRadicacion}`"
      @update:show-modal="descargaPdf(idRadicacion, nodeId)"
      @confirm-modal="exitoAprobacion"
      @close-modal="descargaPdf(idRadicacion, nodeId)"
      :show-modal="showModalExito"
    />

    <ExitoModal
      text-cancel-modal="Descargar"
      text-confirm-modal="Finalizar"
      :text-show-modal="`La respuesta proyectada tiene su visto bueno. Radicado de salida generado ${dataAprobadoexito}`"
      @update:show-modal="descargaPdf(radicadoSalidaAprobado, nodeId)"
      @confirm-modal="exitoAprobacionApro"
      @close-modal="descargaPdf(radicadoSalidaAprobado, nodeId)"
      :show-modal="showModalExitoApro"
    />

    <!-- <div v-if="visualizadorPDF" class="tw-h-full tw-w-full"> -->
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
    <!-- </div> -->

    <!-- ! Cargue Documentos -->
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
        <q-card-section class="row tw-p-4">
          <p class="tw-text-label tw-font-semibold">Adjunte los documentos</p>
          <FileLoader
            class="tw-w-full"
            @rejected="rejectedTypes"
            v-model="newFileInput"
            accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
            sub-title="Puede adjuntar (30) Archivo(s) cada uno con un tamaño permitido de 50MB en cualquiera de las siguientes extenciones <hr>(pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)"
            multiple
            :max-files="30"
            :maxFileSize="50000000"
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

    <!-- ! Compromisos Proximos -->
    <q-dialog
      v-model="showModalCompromisos"
      backdrop-color="rgba(0, 0, 0, 0.5)"
      persistent
    >
      <q-card class="tw-w-full mx-auto tw-rounded-md">
        <q-form ref="formModalSalida" greedy>
          <q-card-section class="tw-px-8">
            <div
              class="tw-text-xl tw-font-bold tw-text-[#0a1b48] tw-mb-4 tw-mt-4"
            >
              Compromisos próximos
            </div>
            <label class="tw-block tw-text-sm tw-font-bold tw-text-[#777e87]"
              >Compromisos próximos *</label
            >
            <q-select
              :options="[
                { label: 'Si', value: true },
                { label: 'No', value: false },
              ]"
              outlined
              label="Inserte"
              dense
              map-options
              v-model="formModal.compromisos"
              :rules="[inputRequired]"
            />
            <label class="tw-text-sm tw-font-bold tw-text-[#777e87]"
              >Observaciones</label
            >
            <span
              v-if="formModal.compromisos?.label == 'Si'"
              class="tw-text-sm tw-font-bold tw-text-[#777e87]"
            >
              *</span
            >
            <q-input
              type="textarea"
              outlined
              label="Seleccione"
              dense
              v-model="formModal.observaciones"
              :rules="[
                (v) => maxLengthInput(10000, v),
                formModal.compromisos?.label ? inputRequired : null,
              ]"
              :disable="formModal.compromisos?.label == 'No'"
            />
          </q-card-section>
          <div
            class="tw-flex tw-justify-center tw-items-center tw-pb-6 tw-gap-3"
          >
            <q-btn
              flat
              label="Cancelar"
              color="secondary"
              class="tw-w-[40%] tw-h-10"
              @click="showModalCompromisos = false"
            />
            <q-btn
              label="Guardar"
              color="secondary"
              class="tw-w-[40%] tw-h-10"
              @click="handleSubmitCompromisos"
            />
          </div>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- ! Modales Revisor -->

    <RechazarModalMedicina
      @hide-modal="hideModal"
      :show-modal="showModalRechazarRevision"
      @update-modal="updateModal"
    />

    <ConfirmModal
      text-cancel-modal="No"
      text-confirm-modal="Si"
      text-show-modal="¿Está seguro de dar el visto bueno a la respuesta proyectada?"
      @update:show-modal="
        () => (
          (showModalAprobarRevision = false), (tab = 'informacion-general')
        )
      "
      @confirm-modal="beforeRevision"
      :show-modal="showModalAprobarRevision"
      :loading="loadingEnvios"
    />

    <ConfirmModal
      text-cancel-modal="No"
      text-confirm-modal="Si"
      text-show-modal="¿Está seguro de rechazar el caso?"
      @update:show-modal="() => (showModalConfrim = false)"
      @confirm-modal="rechazarRevision"
      :show-modal="showModalConfrim"
    />

    <!-- ! Modales Aprobador -->

    <RechazarModalMedicina
      @hide-modal="hideModalAprob"
      :show-modal="showModalRechazarAprobacion"
      @update-modal="updateModalAprob"
    />

    <ConfirmModal
      text-cancel-modal="Cancelar"
      text-confirm-modal="Aceptar"
      text-show-modal="¿Está seguro de dar el visto bueno a la respuesta proyectada?"
      @update:show-modal="() => (showModalAprobarAprobacion = false)"
      @confirm-modal="beforeAprobacion()"
      :show-modal="showModalAprobarAprobacion"
      :loading="loadingEnvios"
    />

    <ConfirmModal
      text-cancel-modal="Cancelar"
      text-confirm-modal="Aceptar"
      text-show-modal="¿Está seguro de rechazar el caso?"
      @update:show-modal="() => (showModalConfrimAprob = false)"
      @confirm-modal="rechazarCaso"
      :show-modal="showModalConfrimAprob"
    />

    <q-dialog v-model="adjuntarFirmaAprobador">
      <q-card :class="['tw-px-3', 'tw-p-9 tw-w-[980px]']">
        <q-form greedy ref="firmaForm">
          <q-card-section
            class="text-h6 tw-max-w-sm text-center text-weight-bold"
          >
            Cargar firma
          </q-card-section>
          <q-card-section class="tw-max-w-sm">
            Adjuntar firma *
            <FileLoader
              :max-file-size="2 * 1024 * 1024"
              max-file-size-label="2"
              v-model:model-value="firmaRevisor"
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
              @click="adjuntarFirmaAprobador = false"
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
  </q-page>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, watch } from "vue";
import ExitoModal from "src/components/Modal/ExitoModal.vue";
import { useAuthStore } from "src/stores/auth.store";
import ComponentTitle from "src/components/ComponentTitle/ComponentTitle.vue";
import FormFormDatosSalida from "../DatosSalida/FormDatosSalida.vue";
import { useCrearComunicacionesLogic } from "src/pages/Correspondencia/Crear/CrearComunicaciones/CrearComunicaciones.Logic";
import FormCopyExterna from "../DatosSalida/FormCopyExterna.vue";
import FormCopyInterna from "../DatosSalida/FormCopyInterna.vue";
import TableDestinatarios from "../DatosSalida/TableDestinatarios.vue";
import IncluirExpediente from "../Expediente/IncluirExpediente.vue";
import FormEditor from "src/components/comunicacion/FormEditorML.vue";
import {
  DOCUMENTOS_HEADER,
  DESTINARIOS_HEADER_COPY_INTERNA,
  dictionaryTypeCopy,
  DESTINARIOS_HEADER_COPY_EXTERNA,
  objResponse,
} from "src/pages/Correspondencia/Crear/CrearComunicaciones/const";
import MetadatosForm from "src/components/medicina_laboral/MetadatosForm.vue";
import { inputRequired, maxLengthInput } from "src/helpers/validations";
import { toast } from "src/helpers/toast";
import moment from "moment";
import Modal from "src/components/Modal/Modal.vue";
import ConfirmModal from "src/components/Modal/ConfirmModal.vue";
import RechazarModalMedicina from "../../RechazarModal.vue";
import { sgdeaAxios } from "src/services";
import FileLoader from "src/components/FormFields/FileLoader.vue";
import TableDocuments from "src/components/comunicacion/TableDocML.vue";
import FormAprobacion from "src/components/comunicacion/FormAsigancionML.vue";
import TableOnlyShow from "src/components/Tables/TableOnlyShow.vue";
import { columnsAsignar2 } from "src/pages/Facturacion/cobro";
import FormRevision from "src/components/comunicacion/FormRevisionML.vue";
import Trazabilidad from "src/pages/MedicinaLaboral/comunicaciones/Trazabilidad.vue";
import Comentarios from "src/pages/MedicinaLaboral/comunicaciones/Comentarios.vue";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import {
  useDepartments,
  useMunicipalities,
  useCountries,
} from "src/composables/useVersion";
import InforGeneral from "./InfoGeneral.vue";
import DocumentosRelacionados from "./DocumentosRelacionados/DocumentosRelacionados.vue";
import { ESTADOS } from "src/assets/estados/estados";
// @ts-ignore
import docImg from "src/assets/icon-lines.svg";
import { getAcronimobyDoc } from "src/helpers/prefijoTipoDoc";
import Editor from "src/components/Editor/editor.vue";
import { useDocumentStore } from "src/stores/documentStore";
import { crearTrazabilidadDocumento } from "src/helpers/trazabilidadDocumento";
import TrazabilidadDocumento from "../../TrazabilidadDocumento/TrazabilidadDocumento.vue";
import {
  HistorialDocSalida,
  shouldCreateTrazabilidad,
} from "src/interfaces/DocSalidaHistorial";

const documentStore = useDocumentStore();
const showModalCompromisos = ref(false);
const municipioOptions = ref([]);
const { optionsCountries } = useCountries();
const departmentsOptions = ref([]);
const noteModal = ref(false);
const isFisrRenderInterno = ref(true);
const isFisrRender = ref(true);
const route = useRoute();
const router = useRouter();
const aprobadorSelected = ref([]);
const isComunicacionAutomatica = ref(false);
const isSendDestinatarios = ref(false);
const isSendCopies = ref(false);
const isSendContenidoDoc = ref(false);
const isSendDatosSalida = ref(false);
const secuencia = ref("");
const fileDataTable = ref();
const userSeletecdByRevision = ref();
const userSeletecdByAprobacion = ref();
const labelBtnDatosSalida = ref("Siguiente");
const bodyCopyInterna = ref([]);
const bodyCopyExterna = ref([]);
const isFormResetInterno = ref(0);
const isFormResetExterno = ref(0);
const showCancelModal = ref(false);
const stepDataSend = ref(0);
const state = ref("En edición");
const auth = useAuthStore();
const firstname = auth.userInfo.name.split(" ")[0];
const lastname = auth.userInfo.name.split(" ")[1];
const idComunicacion = ref();
const tab = ref(
  auth.userInfo.role === "Revisor" || auth.userInfo.role === "Aprobador"
    ? "informacion-general"
    : "metadatos"
);
const tipoPlantillaSeleted = ref(1);
const updateHtmldoc = ref(null);
const shippingMethodsOptions = ref([]);
const copiesTypesOptions = ref([]);
const myForm0 = ref(null);
const myForm10 = ref(null);
const myForm20 = ref(null);
const formModalSalida = ref(null);
const updateTypeCopy = ref(null);
const giveMetadatos = ref(false);
const giveDestinatario = ref(false);
const giveCorreo = ref(false);
const meta = ref(0);
const allInfo = ref();
const isDisabled = ref(false);
const nameDocument = ref(null);
const visualizadorPDF = ref(false);
const iframePdfUrl = ref();
const modalDocuments = ref(false);
const newFileInput = ref<any>([]);
const loadedDocsToChangeType = ref([]);
const showChangeDocType = ref<boolean>(false);
const finished = ref(false);
const showModalRechazarRevision = ref(false);
const showModalAprobarRevision = ref(false);
const showModalConfrim = ref<boolean>(false);
const showModalRechazarAprobacion = ref(false);
const showModalAprobarAprobacion = ref(false);
const showModalConfrimAprob = ref<boolean>(false);
const firmaForm = ref();
const firmaRevisor = ref();
const adjuntarFirmaAprobador = ref(false);
const revisado = ref(false);
const aprobado = ref(false);
const nodeId = ref("");
const idRadicacion = ref();
const showModalExito = ref(false);
const showModalExitoApro = ref(false);
const dataAprobadoexito = ref();
const radicadoSalidaAprobado = ref();
const isErrased = ref(false);
const activeButtonCopy = ref(false);
const getCopy = ref(null);
const validationMetadatos = ref();
const isExpedientes = ref();
const loadingEnvios = ref(false);
const formModal = ref({
  compromisos: null,
  observaciones: "",
});
const listForVizualiser = ref([]);
const visibleDoscRead = ref(false);
const emit = defineEmits(["image-loaded"]);
const dataFooter = ref({});
let referentKey = {};
const htmlContent = ref("");
const documentoFile = ref("");
const isDocSalida = ref();
const formAprobacion = ref({
  observacionesAprobacion: "",
});
const copia = ref("");
const formRevision = ref({
  observacionesRevision: "",
});
const selectedSignature = ref();
const docHistorial = ref("");

const objKeysCorreo = {
  asuntoCorreo: "",
  contenidoCorreo: "",
};

const objKeysDestinatarios = {
  datosSalidaTipoDocumentoDestinatarioId: "tipoDocumentoDestinatario",
  datosSalidaNumeroDocumentoDestinatario: "numeroDocumento",
  datosSalidaNombreDestinatario: "nombreDestinatario",
  datosSalidaDireccion: "direccionDestinatario",
  datosSalidaPaisId: "pais",
  datosSalidaDeptoId: "departamento",
  datosSalidaMunicipioId: "municipio",
  datosSalidaTelefono: "telefonoDestinatario",
  datosSalidaCorreo: "correoDestinatario",
  datosSalidaFormaEnvioId: "formaEnvio",
};

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
const imgBase64 = ref();
const formDatosAdjuntos = ref({
  files: [],
});

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

const datosSalida = ref({
  destinatario: {
    nombre: "",
    direccion: "",
    numero_celular: "",
    asunto: "",
    anexos: "",
    departamento: "",
    municipio: "",
    copiesExterna: [],
    copiesInterna: [],
    radNumero: "",
    shippingMethod: "",
  },
});

const formRefs = ref({
  metadatos: [myForm0],
  "datos-salida": [myForm10],
  "enviar-revision": [myForm20],
});

const form = ref({
  motivoRechazo: "",
  motivoRechazoAprobacion: "",
});

const filteredTabs = ref([
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

const validationsTypeCopy = (copy) => {
  updateTypeCopy.value = copy;
  formExitData.value.copyType = updateTypeCopy.value;
};

onMounted(async () => {
  if (route?.query?.tab) {
    tab.value = String(route?.query?.tab);
  }
  idComunicacion.value = route.params.id;

  await getAllData();
  // await getFirma();
  departmentsOptions.value = (
    await useDepartments().then(({ optionsDepartments }) => optionsDepartments)
  ).value;
});

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
    `/radicados/consultar_documento/${nodeid}`
  );

  return response.data;
};
const arrayCopyInterna = ref();
const arrayCopyExterna = ref();
const arrayAllCopys = ref();

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
  }${data?.formaEnvio ? " / Forma de Envío: " + data?.formaEnvio?.forma : ""}`;
}

const restric = ref(false);
let trazabilidadRegistrada = false;
async function autoSaveDocument({ paragraf, pdf }) {
  const htmlContentPara = paragraf;
  const blob = new Blob([htmlContentPara], { type: "text/html;charset=UTF-8" });
  const docResponseSave = !isDocSalida.value
    ? await sgdeaAxios.post(
        `/medicina/crearComunicacionDocSalida/${allInfo.value.id}`,
        {
          docHtml: htmlContentPara,
        },
        {showLoader: false}
      )
    : await sgdeaAxios.put(
        `/medicina/putComunicacionDocSalida/${allInfo.value.id}`,
        {
          docHtml: htmlContentPara,
        }
      );

  if (docResponseSave.status == 200 || docResponseSave.status == 201) {
    toast.success("Se guardó el documento exitosamente");
    if (!trazabilidadRegistrada) {
      await crearTrazabilidad({
        proceso: "MLCOM" + allInfo.value.id,
        secuencia: allInfo.value.idRadicado,
        estado: allInfo.value.estado,
        descripcion: "Se ha modificado el documento de salida",
        comentario: "Modificación",
        nombre: useAuthStore().$state.userInfo.name,
        accion: `${
          useAuthStore().$state.userInfo.name
        } ha modificado el documento de salida del caso ${
          allInfo?.value?.idRadicado
        }`,
        tramite: "Medicina laboral comunicaciones",
      });
      trazabilidadRegistrada = true;
    }
    htmlContent.value = htmlContentPara;
  }
}
const formatNombre = (nombre: string | undefined) => {
  if (!nombre) return "";
  const [nombrePrimero, ...resto] = nombre.trim().split(" ");
  const apellido = resto.join(" ");
  return `${nombrePrimero.charAt(0)}.${apellido}`;
};

const getAllData = async () => {
  const { getCopiesTypesOptions, getAllDataByID, getShippingWayOptions } =
    useCrearComunicacionesLogic();

  const promises = route.params.id
    ? [getCopiesTypesOptions(), getAllDataByID(idComunicacion.value)]
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

  if (allDataLoaded?.value?.destinatarios) isSendDatosSalida.value = true;

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
        formatCopyInterna(item, formaEnvioId)
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
      ? `${
          allDataLoaded.value?.idRadicador?.fullname?.toUpperCase()
        } -
          ${allDataLoaded.value?.idRadicador?.cargo?.nombre} - ${allDataLoaded.value?.oficinaRadicador ? allDataLoaded.value?.oficinaRadicador.toUpperCase() : 'GERENCIA MÉDICA'}`
      : "",
    DatosAprobador: allDataLoaded.value?.idAprobador
      ? `${
          allDataLoaded.value?.idAprobador?.fullname?.toUpperCase()
        } -
    ${allDataLoaded.value?.idAprobador?.cargo?.nombre} - ${allDataLoaded.value?.oficinaAprobador ? allDataLoaded.value?.oficinaAprobador.toUpperCase() : 'GERENCIA MÉDICA'}`
      : "",
    DatosRevisor: allDataLoaded.value?.idRevisor
      ? `${
          allDataLoaded.value?.idRevisor?.fullname?.toUpperCase()
        } -
    ${allDataLoaded.value?.idRevisor?.cargo?.nombre} - ${allDataLoaded.value?.oficinaRevisor ? allDataLoaded.value?.oficinaRevisor.toUpperCase() : 'GERENCIA MÉDICA'}`
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

const getAllDocs = async () => {
  const response = await sgdeaAxios.get(
    `/medicina/getAnexosCargados/${idComunicacion.value}`
  );
  fileDataTable.value = mapDataToFileDataTable(response.data.listaAnexos);
};

const getExpediente = async () => {
  const { data: expediente } = await sgdeaAxios.get("/expediente/children", {
    params: { nodeId: allInfo.value?.nodeIdCarpeta },
  });

  if (Object.keys(expediente).length) isExpedientes.value = true;
  else isExpedientes.value = false;
};

const getBlobToIframe = async (id, list, action?) => {
  visibleDoscRead.value = true;
  const { data } = await sgdeaAxios.get(`/radicados/consultar_documento/${id}`);

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

async function handleUploadFile() {
  const files: File[] | File = newFileInput.value;

  if ((Array.isArray(files) && files.length === 0) || files === null) {
    toast.error("Debe seleccionar un archivo y/o seleccionar una opción.");
    return;
  }

  const formData = new FormData();
  for (const file of Array.isArray(files) ? files : [files]) {
    formData.append("anexos", file);
  }

  formData.append("idRadicado", allInfo.value.nodeId);
  formData.append("descripcionRadicado", "De salida");
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
        proceso: "MLCOM" + allInfo.value.id,
        secuencia: allInfo.value.idRadicado,
        estado: allInfo.value.estado.estado,
        descripcion: "Se ha adjuntado un documento al radicado",
        comentario: "Adjunto",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} añadió un documento al radicado`,
        tramite: "Medicina Laboral",
      });
      modalDocuments.value = false;
      getAllData();
      newFileInput.value = [];
    }
  } catch (error) {
    toast.error("Está intentando cargar el mismo archivo más de una vez");
  }
  getAllDocs();
}

function rejectedTypes(fileEntries) {
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

const handleDelteFileTable = async (filesId) => {
  try {
    const response = await sgdeaAxios.delete(
      `/medicina/eliminarAnexosComunicaciones?nodeIdAnexo=${filesId}`
    );

    fileDataTable.value = [
      ...fileDataTable.value.filter((file) => filesId !== file.id),
    ];

    if (response.status == 200) {
      await crearTrazabilidad({
        proceso: "MLCOM" + allInfo.value.id,
        secuencia: allInfo.value.idRadicado,
        estado: allInfo.value.estado,
        descripcion: "Se ha eliminado un documento del radicado",
        comentario: "Eliminación",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} ha eliminado un documento del radicado`,
        tramite: "Medicina laboral comunicaciones",
      });
    }

    toast.success("Archivo eliminado correctamente");
  } catch (error) {
    toast.error(error.response?.data?.message || objResponse.default_error);
  }
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

const clearFormGeneralData = () => {
  formGeneralData.value.asunto = "";
  formGeneralData.value.tipoDocumento = "";
  formGeneralData.value.nombreAfectado = "";
  formGeneralData.value.numeroDocumento = "";
  formGeneralData.value.radNumero = [];
  formGeneralData.value.date = "";
  formGeneralData.value.origen = "";
  formGeneralData.value.evento = "";
  formGeneralData.value.numeroSiniestro = [];
  formGeneralData.value.eventoLabel = "";
};

const handleAcceptModal = async () => {
  if (["metadatos"].includes(tab.value)) {
    clearFormGeneralData();
    await getAllData();
  }

  if (
    ["documento-salida", "adjuntar-documento", "enviar-revision"].includes(
      tab.value
    )
  ) {
    tab.value = "metadatos";
  }

  if (["datos-salida"].includes(tab.value)) {
    tab.value = "metadatos";

    if (!giveDestinatario.value) {
      formExitData.value = { ...originalFormExitData };
      await getAllData();
    } else {
      await getAllData();
    }

    if (!getCopy.value) {
      formExitData.value.copyType = "";
      bodyCopyInterna.value = [];
      bodyCopyExterna.value = [];
    } else {
      bodyCopyInterna.value = [];
      bodyCopyExterna.value = [];
      await getAllData();
    }

    if (!giveCorreo.value) {
      isErrased.value = true;
    } else {
      await getAllData();
    }

    stepDataSend.value = 0;
  }

  showCancelModal.value = false;
};

const submitDestinatarios = async () => {
  const objToSend = {
    asunto: formExitData.value.asunto,
    formaEnvio: formExitData.value.datosSalidaFormaEnvioId,
    tipoDocumento: formExitData.value.datosSalidaTipoDocumentoDestinatarioId,
    numeroDocumento: formExitData.value.datosSalidaNumeroDocumentoDestinatario,
    nombreDestinatario: formExitData.value.datosSalidaNombreDestinatario,
    direccionDestinatario: formExitData.value.datosSalidaDireccion,
    paisDestinatario:
      typeof formExitData.value.datosSalidaPaisId === "object"
        ? formExitData.value.datosSalidaPaisId.value
        : formExitData.value.datosSalidaPaisId,
    departamentoDestinatario:
      typeof formExitData.value.datosSalidaDeptoId === "string"
        ? null
        : formExitData.value.datosSalidaDeptoId,
    municipioDestinatario: formExitData.value?.datosSalidaMunicipio,
    telefonoDestinatario: +formExitData.value.datosSalidaTelefono || null,
    correoDestinatario: formExitData.value?.datosSalidaCorreo || null,
  };

  try {
    const response = !giveDestinatario.value
      ? await sgdeaAxios.post(
          `/medicina/crearComunicacionesDestinatarios/${idComunicacion.value}`,
          objToSend
        )
      : await sgdeaAxios.put(
          `/medicina/putComunicacionesDestinatarios/${idComunicacion.value}`,
          objToSend
        );

    if (response.status === 200 || response.status === 201) {
      await crearTrazabilidad({
        proceso: `MLCOM${idComunicacion.value}`,
        secuencia: secuencia.value,
        estado: state.value,
        descripcion: `
        Número de documento: ${
          formExitData.value.datosSalidaNumeroDocumentoDestinatario
        }
        Destinatario: ${formExitData.value.datosSalidaNombreDestinatario}
        Dirección destinatario: ${formExitData.value.datosSalidaDireccion}
        Teléfono: ${formExitData.value.datosSalidaTelefono || null},
        Correo: ${formExitData.value?.datosSalidaCorreo || null}`,
        comentario: "Agregar destinatarios",
        nombre: `${firstname} ${lastname}`,
        tramite: "Medicina laboral comunicaciones",
        accion: `${auth.userInfo.name} ha agregado destinatarios a la comunicación`,
      });

      await getAllData();
      stepDataSend.value += 1;
      labelBtnDatosSalida.value = [3, 6, 4].includes(
        Number(formExitData.value.datosSalidaFormaEnvioId)
      )
        ? "Guardar"
        : "Siguiente";
    }
  } catch (error) {
    toast.error(objResponse.default_error);
  }
};

const buildArrayDestinatarios = (type) => {
  if (type === dictionaryTypeCopy[1]) {
    return ["ListacopiaInterna"];
  }

  if (type === dictionaryTypeCopy[2]) {
    return ["ListacopiaExterna"];
  }

  if (type === dictionaryTypeCopy[4]) {
    return ["ListacopiaInterna", "ListacopiaExterna"];
  }
};

const buildFormDataListDestinatarios = (type) => {
  if (type === "ListacopiaInterna") {
    return bodyCopyInterna.value.map(({ dependencia, nombre }) => {
      return {
        dependencia: dependencia,
        idUser: nombre,
      };
    });
  }

  if (type === "ListacopiaExterna") {
    return bodyCopyExterna.value.map(
      ({
        forma,
        tipo,
        nombre,
        direccion,
        pais,
        departamento,
        municipio,
        telefonoDestinatario,
        correoDestinatario,
      }) => {
        return {
          formaEnvio: forma,
          tipoDocumento: tipo.id || tipo,
          nombreDestinatario: nombre,
          direccionDestinatario: direccion,
          paisDestinatario: pais.value,
          departamentoDestinatario:
            typeof departamento === "string" ? 1 : departamento,
          municipioDestinatario: typeof municipio === "string" ? 1 : municipio,
          telefonoDestinatario: telefonoDestinatario
            ? +telefonoDestinatario
            : null,
          correoDestinatario,
        };
      }
    );
  }
};

const submitDatosSalidaCopia = async () => {
  const keys = buildArrayDestinatarios(
    dictionaryTypeCopy[formExitData.value.copyType]
  );

  let objToSend = {
    listUser: [],
    externos: [],
    tipoCopia: formExitData.value.copyType,
  };

  if (keys) {
    for (const key of keys) {
      if (key === "ListacopiaInterna") {
        objToSend["listUser"] = buildFormDataListDestinatarios(key);
      }
      if (key === "ListacopiaExterna") {
        objToSend["externos"] = buildFormDataListDestinatarios(key);
      }
    }
  }

  if (!objToSend.listUser.length) bodyCopyInterna.value = [];
  if (!objToSend.externos.length) bodyCopyExterna.value = [];

  try {
    const response = !getCopy.value
      ? await sgdeaAxios.post(
          `/medicina/crearComunInterExter/${idComunicacion.value}`,
          objToSend
        )
      : await sgdeaAxios.put(
          `/medicina/putComunInterExter/${idComunicacion.value}`,
          objToSend
        );

    const copiaLabel = copia.value.value
      .map((item, index) => ({ ...item, index }))
      .find((item) => item.index + 1 === formExitData.value.copyType)?.label;

    if (response.status === 200 || response.status === 201) {
      await crearTrazabilidad({
        proceso: `MLCOM${idComunicacion.value}`,
        secuencia: secuencia.value,
        estado: state.value,
        descripcion: `Usuario:${auth.userInfo.name} Tipo de copia:${copiaLabel}`,
        comentario: "Agregar copias",
        nombre: `${firstname} ${lastname}`,
        tramite: "Medicina laboral comunicaciones",
        accion: `${auth.userInfo.name} ha agregado copias a la comunicación`,
      });

      if (labelBtnDatosSalida.value === "Guardar") {
        toast.success(objResponse.success_medicina);
        getAllData();
        return;
      }

      getAllData();
      stepDataSend.value += 1;
    }
  } catch (error) {
    toast.error(objResponse.default_error);
  }
};

const submitAsuntosCorreo = async () => {
  try {
    const response = !giveCorreo.value
      ? await sgdeaAxios.post(
          `/medicina/crearComunRespSalida/${idComunicacion.value}`,
          {
            asunto: formExitData.value.asuntoCorreo,
            cuerpoCorreo: "",
          }
        )
      : await sgdeaAxios.put(
          `/medicina/putComunRespSalida/${idComunicacion.value}`,
          {
            asunto: formExitData.value.asuntoCorreo,
            cuerpoCorreo: "",
          }
        );

    if (response.status === 200 || response.status === 201) {
      isSendCopies.value = true;

      crearTrazabilidad({
        proceso: `MLCOM${idComunicacion.value}`,
        secuencia: secuencia.value,
        estado: state.value,
        descripcion: `Usuario: ${auth.userInfo.name} Asunto:${formExitData.value.asuntoCorreo}`,
        comentario: "Agregar asunto y cuerpo del correo",
        nombre: `${firstname} ${lastname}`,
        tramite: "Medicina laboral comunicaciones",
        accion: `${auth.userInfo.name} ha agregado asunto y cuerpo del correo a la comunicación`,
      });

      toast.success(objResponse.success_medicina);
      await getAllData();
    }
  } catch (error) {
    toast.error(objResponse.default_error);
  }
};

const handleComeBack = () => {
  if (stepDataSend.value === 2) {
    labelBtnDatosSalida.value = "Siguiente";
  }
  stepDataSend.value -= 1;
};

const handleSubmitDatosSalida = () => {
  if (stepDataSend.value === 0) {
    submitDestinatarios();
    return;
  }

  if (stepDataSend.value === 1) {
    submitDatosSalidaCopia();
    return;
  }

  if (stepDataSend.value === 2) {
    submitAsuntosCorreo();
    return;
  }
};

const handleSubmitMetadato = async () => {
  const objToSend = {
    asunto: formGeneralData.value.asunto,
    tipoDocumento: formGeneralData.value.tipoDocumento,
    numeroDocumento: formGeneralData.value.numeroDocumento,
    nombreAfectado: formGeneralData.value.nombreAfectado,
    listMl: formGeneralData.value.radNumero.join(","),
    siniestro:
      // @ts-expect-error
      formGeneralData.value.numeroSiniestro?.label ||
      formGeneralData.value.numeroSiniestro,
    fechaSiniestro: moment(formGeneralData.value.date, "DD-MM-YYYY").format(
      "DD/MM/YYYY"
    ),
    evento: formGeneralData.value.evento,
    origenEvento: formGeneralData.value.origen,
  };
  try {
    const { status } = !giveMetadatos.value
      ? await sgdeaAxios.post(
          `/medicina/crearComunicacionMetadatos/${idComunicacion.value}`,
          objToSend
        )
      : await sgdeaAxios.put(
          `/medicina/putComunicacionMetadatos/${idComunicacion.value}`,
          objToSend
        );

    if (status === 200 || status === 201) {
      await getAllData();
      await crearTrazabilidad({
        proceso: `MLCOM${idComunicacion.value}`,
        secuencia: secuencia.value,
        estado: state.value,
        descripcion: ` Usuario: ${auth.userInfo.name} Asunto: ${
          formGeneralData.value.asunto
        }
        Número de documento: ${
          formGeneralData.value.numeroDocumento ?? "No registra"
        }
        Nombre del afectado: ${
          formGeneralData.value.nombreAfectado ?? "No registra"
        }
        Radicado asociado: ${
          formGeneralData.value.radNumero[0] ?? "No registra"
        }
        Siniestro: ${formGeneralData.value.numeroSiniestro ?? "No registra"}
        Fecha siniestro: ${
          moment(formGeneralData.value.date, "DD-MM-YYYY").format(
            "DD/MM/YYYY"
          ) ?? "No registra"
        }`,
        comentario: "Agregar metadatos",
        nombre: `${firstname} ${lastname}`,
        tramite: "Medicina laboral comunicaciones",
        accion: `${auth.userInfo.name} ha agregado metadatos a la comunicación`,
      });
      toast.success(objResponse.success_medicina);
    }
  } catch (error) {
    toast.error(objResponse.default_error);
  }
};

const next = async () => {
  if (tab.value === "documento-salida") {
    return;
  }

  const formName = tab.value;
  const isValid =
    formRefs.value[formName] && formName !== "enviar-revision"
      ? await verifyFormIsValid(formName)
      : true;

  if (!isValid) return;

  if (tab.value === "metadatos") {
    handleSubmitMetadato();
    return;
  }

  if (tab.value === "datos-salida") {
    handleSubmitDatosSalida();
    return;
  }

  if (tab.value === "adjuntar-documento") {
    handleSubmitDocs("files", formDatosAdjuntos.value.files);
    return;
  }

  if (tab.value === "enviar-revision") {
    handleSubmitRevisionAprobacion();
    return;
  }
};
const documentosData = ref();
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

const handleSubmitDocs = async (key, files) => {
  const formDataFiles = new FormData();
  for (var i = 0; i < files.length; i++) {
    formDataFiles.append(key, files[i]);
  }

  try {
    const response =
      fileDataTable?.value?.length > 0
        ? await sgdeaAxios.put(
            `/medicina/updateAnexosComunicaciones/${
              idComunicacion.value
            }?cargadoPor=${firstname} ${lastname} &fecha=${moment().format(
              "DD/MM/YYYY"
            )}`,
            formDataFiles
          )
        : await sgdeaAxios.post(
            `/medicina/comuEnviarDocs/${
              idComunicacion.value
            }?cargadoPor=${firstname} ${lastname} &fecha=${moment().format(
              "DD/MM/YYYY"
            )}`,
            formDataFiles
          );

    formDatosAdjuntos.value.files = [];
    if (response.status === 200 || response.status === 201) {
      toast.success(objResponse.doc_saved);
      await crearTrazabilidad({
        proceso: `MLCOM${idComunicacion.value}`,
        secuencia: secuencia.value,
        estado: state.value,
        descripcion: `
        Usuario: ${auth.userInfo.name}
        ${documentosData.value
          .map(
            (doc, index) => `

      Documento:${index + 1}
      Formato: ${doc.nombreAnexo.split(".").pop()}
      Nombre documento: ${doc.nombreAnexo.split(".").shift()}
      Tipo de documento: De salida
      Fecha: ${doc.fecha}
  `
          )
          .join("\n")} `,
        comentario: "Agregar documentos",
        nombre: `${firstname} ${lastname}`,
        tramite: "Medicina laboral comunicaciones",
        accion: ` ${auth.userInfo.name} ha agregado documentos a la comunicación`,
      });
      await getAllData();
    }
  } catch (error) {
    toast.error(objResponse.default_error);
  }
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
    const unique = [];
    const seen = new Set();
    for (const item of bodyCopyExterna.value) {
      const key = JSON.stringify(item);
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    }
    const resultado = unique;
    bodyCopyExterna.value = resultado;
    return;
  }

  bodyCopyExterna.value = [
    ...bodyCopyExterna.value,
    mapFormDataToDestinataires(formExitDataCopyExterno, mapTypeCopyValue),
  ];
  isFormResetExterno.value = isFormResetExterno.value + 1;
};

const validateListDestinatarios = (type) => {
  if (["interno", "interno y externo"].includes(type)) {
    return bodyCopyInterna.value.length > 0;
  }

  if (["externo", "interno y externo"].includes(type)) {
    return bodyCopyExterna.value.length > 0;
  }
  return true;
};

const verifyFormIsValid = async (formName) => {
  if (formName === "documento-salida") {
    return Promise.resolve(true);
  }

  if (formName === "datos-salida" && stepDataSend.value === 1) {
    const isEmptyListDestinatarios = validateListDestinatarios(
      dictionaryTypeCopy[formExitData.value?.copyType]
    );

    if (!isEmptyListDestinatarios) {
      toast.error(objResponse.lista_vacia);
      return Promise.resolve(false);
    }
  }

  const myForms = formRefs.value[formName];
  const validations = myForms.map((form) => form.value.validate());
  // @ts-expect-error
  return Promise.allSettled(validations).then((results) => {
    const allValid = results.every(
      (result) => result.status === "fulfilled" && result.value
    );
    if (!allValid) {
      if (results[0].status === "rejected" && results[0].reason) {
        toast.error(results[0].reason.message);
        return false;
      }
      toast.error(objResponse.campos_obligatorios);
      return false;
    }
    return true;
  });
};

const rejectedFiles = (error) => {
  if (error.some((it) => it.failedPropValidation === "max-file-size")) {
    toast.error("El peso permitido es hasta 50MB.");
  }
  if (error.some((it) => it.failedPropValidation === "max-files")) {
    toast.error("Solo se pueden adjuntar 30 archivos.");
  }
  if (error.some((it) => it.failedPropValidation === "accept")) {
    toast.error(
      "Formato inválido, los formatos permitidos son (pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)."
    );
  }
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

function beforeRevision() {
  revisado.value = true;
  loadingEnvios.value = true;
}
const firmaAprobador = ref(null);

function beforeAprobacion() {
  emit("image-loaded", firmaAprobador.value);
  adjuntarFirmaAprobador.value = false;
  aprobado.value = true;
  loadingEnvios.value = true;
}

const handleSubmitRevisionAprobacion = async () => {
  await getAllData();
  // Revisa si ya se incluyo en expediente
  if (!isExpedientes.value) {
    toast.error("Documento pendiente de inclusión en expediente");
    return;
  }

  if (isSendContenidoDoc.value === false || isSendDatosSalida.value === false) {
    toast.error(
      "Debe diligenciar los datos y el documento de salida para poder completar la acción"
    );
    return;
  }

  // Valida si seleccionó un usuario revisor
  if (!userSeletecdByRevision.value?.user) {
    toast.error(objResponse.select_user);
    return;
  }

  // Valida si seleccionó un usuario aprobador
  if (!isComunicacionAutomatica.value) {
    if (!userSeletecdByAprobacion.value) {
      toast.error(objResponse.select_user);
      return;
    }
  }

  // Valida campos obligatorios
  if (!(await verifyFormIsValid("enviar-revision"))) return;

  toast.warning(
    "Recuerde asegurarse de cargar los anexos requeridos para la comunicación"
  );
  showModalCompromisos.value = true;
};

const handleSubmitCompromisos = async () => {
  const isValidateCompromisos = await formModalSalida.value.validate();

  if (!isValidateCompromisos) {
    return;
  }

  try {
    await sgdeaAxios.put(`medicina/enviarComRevision/${idComunicacion.value}`, {
      idUserResvisor: userSeletecdByRevision.value?.user,
      motivoRevisor: formRevision.value.observacionesRevision,
      idFormaEnvio: allInfo.value?.destinatarios?.formaEnvio?.id,
      oficinaRevisor: userSeletecdByRevision.value?.oficina,
    });

    await sgdeaAxios.put(
      `medicina/enviarComAprobador/${idComunicacion.value}`,
      {
        idUserAprobador: isComunicacionAutomatica.value
          ? aprobadorSelected.value[0].id
          : userSeletecdByAprobacion.value?.user,
        motivoAprobador: formAprobacion.value.observacionesAprobacion,
        oficinaDestinoId: userSeletecdByAprobacion.value?.oficinaId,
        idFormaEnvio: allInfo.value?.destinatarios?.formaEnvio?.id,
        oficinaAprobador: userSeletecdByAprobacion.value?.oficina,
      }
    );

    await sgdeaAxios.put(
      `medicina/compromisosProximosCom/${idComunicacion.value}?comp=${
        formModal.value.compromisos?.label ? "Si" : "No"
      }&observa=${formModal.value.observaciones}`
    );
    crearTrazabilidad({
      proceso: `MLCOM${idComunicacion.value}`,
      secuencia: secuencia.value,
      estado: state.value,
      descripcion: `Usuario: ${auth.userInfo.name} Revisor: ${
        userSeletecdByRevision.value?.name
      } Aprobador: ${
        isComunicacionAutomatica.value
          ? aprobadorSelected.value[0].colaborador
          : userSeletecdByAprobacion.value?.name
      }`,
      comentario: "Enviar a revisión y aprobación",
      nombre: `${firstname} ${lastname}`,
      tramite: "Medicina laboral comunicaciones",
      accion: `${auth.userInfo.name} ha enviado a revisión y aprobación la comunicación`,
    });

    crearTrazabilidadDocumento(
      {
        htmlContent: htmlContent.value,
        usuario: auth.userInfo.name,
        rol: auth.userInfo.role,
      },
      allInfo?.value?.id,
      "ML"
    );

    state.value = "Por revisar";
    toast.success(objResponse.succes_radicado);
    router.push("/medicina/bandeja-comunicaciones");
  } catch (error) {
    toast.error(error.response.data.message || objResponse.default_error);
  }
};

const hideModal = (value) => {
  showModalRechazarRevision.value = value;
  tab.value = "informacion-general";
};

const hideModalAprob = (value) => {
  showModalRechazarAprobacion.value = value;
  tab.value = "informacion-general";
};

const updateModal = async (value) => {
  form.value.motivoRechazo = value.value;
  showModalConfrim.value = true;
};

const updateModalAprob = async (value) => {
  form.value.motivoRechazoAprobacion = value.value;
  showModalConfrimAprob.value = true;
};

const aprobarRevision = async (data) => {
  tab.value = "documento-salida";
  const formData = new FormData();
  formData.append("file", data, `[object Object].pdf`);

  const isAprobAuto = allInfo.value?.prefijo?.aprobacionAutomatica;
  try {
    const response = await sgdeaAxios.put(
      `/medicina/aprobarComunicacion/${allInfo.value.id}`,
      formData
    );
    nodeId.value = response.data.nodeIdSalida;
    idRadicacion.value = response.data.idRadicado;
    if (response.status == 200) {
      toast.success("La respuesta proyectada tiene su visto bueno");
      const dataTrazabilidad = {
        proceso: `MLCOM${allInfo.value.id}`,
        secuencia: allInfo.value.idRadicado,
        estado: allInfo.value.estado,
        descripcion: "Se ha dado visto bueno a la respuesta proyectada",
        comentario: "Aprobada",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} dió visto bueno a la respuesta proyectada para el caso`,
        tramite: "Medicina laboral comunicaciones",
      };
      await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad, {
        showLoader: false,
      });

      if (shouldCreateTrazabilidad(trazaDocument.value, htmlContent.value)) {
        await crearTrazabilidadDocumento(
          {
            htmlContent: htmlContent.value,
            usuario: auth.userInfo.name,
            rol: auth.userInfo.role,
          },
          allInfo?.value?.id,
          "ML"
        );
      }

      loadingEnvios.value = false;
    }
    showModalAprobarRevision.value = false;
    if (isAprobAuto) {
      showModalExito.value = true;
    } else {
      router.push("/medicina/bandeja-comunicaciones");
    }
  } catch (error) {
    loadingEnvios.value = false;
    toast.error("Ha ocurrido un error al ejecutar la petición");
  }
};

const rechazarRevision = async () => {
  try {
    const response = await sgdeaAxios.put(`/medicina/rechazarComunicacion/`, {
      idComunicacion: allInfo.value.id,
      motivoRechazo: form.value.motivoRechazo,
    });

    if (response.status == 200) {
      toast.success("Se realizó el rechazo del radicado de manera exitosa.");
      const dataTrazabilidad = {
        proceso: `MLCOM${allInfo.value.id}`,
        secuencia: allInfo.value.idRadicado,
        estado: allInfo.value.estado,
        descripcion: `Usuario:${auth.$state.userInfo.name} Motivo: ${form.value.motivoRechazo} `,
        comentario: form.value.motivoRechazo,
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} rechazó la revision del radicado`,
        tramite: "Comunicacion Medicina laboral",
      };
      await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad, {
        showLoader: false,
      });
    }
  } catch (error) {
    toast.error("Ha ocurrido un error al ejecutar la petición");
  } finally {
    router.push("/medicina/bandeja-comunicaciones");
  }
};

const trazaDocument = ref<HistorialDocSalida[]>([]);
const gettrazabilidadDocumento = async () => {
  if (allInfo.value && allInfo.value?.id) {
    try {
      const response = await sgdeaAxios.get<HistorialDocSalida[]>(
        `/api/documentos-salida/${route.params.id}/historial`
      );
      trazaDocument.value = response.data;
    } catch {
      toast.error("Ha ocurrido un error al obtener la información");
    }
  }
};

const aprobarCaso = async (data) => {
  tab.value = "documento-salida";

  const formData = new FormData();
  formData.append("file", data, `[object Object].pdf`);
  try {
    const response = await sgdeaAxios.put(
      `/medicina/aprobarComunicacion/${allInfo.value.id}`,
      formData
    );
    nodeId.value = response.data.nodeIdSalida;
    idRadicacion.value = response.data.idRadicado;
    if (response.status == 200) {
      toast.success("La respuesta proyectada tiene su visto bueno");
      const dataTrazabilidad = {
        proceso: `MLCOM${allInfo.value.id}`,
        secuencia: allInfo.value.idRadicado,
        estado: allInfo.value.estado,
        descripcion: "Se ha dado visto bueno a la respuesta proyectada",
        comentario: "Aprobada",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} dió visto bueno a la respuesta proyectada para el caso`,
        tramite: "Medicina laboral comunicaciones",
      };
      await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad);
      loadingEnvios.value = false;
      showModalAprobarAprobacion.value = false;
      showModalExitoApro.value = true;
      dataAprobadoexito.value = response.data.secSal;
      radicadoSalidaAprobado.value = response.data.secSal;
      if (shouldCreateTrazabilidad(trazaDocument.value, htmlContent.value)) {
        await crearTrazabilidadDocumento(
          {
            htmlContent: htmlContent.value,
            usuario: auth.userInfo.name,
            rol: auth.userInfo.role,
          },
          allInfo?.value?.id,
          "ML"
        );
      }
    }
  } catch (error) {
    loadingEnvios.value = false;
    toast.error("Ha ocurrido un error al ejecutar la petición");
  }
};

const rechazarCaso = async () => {
  try {
    const response = await sgdeaAxios.put(`/medicina/rechazarComunicacion/`, {
      idComunicacion: allInfo.value.id,
      motivoRechazo: form.value.motivoRechazoAprobacion,
    });

    if (response.status == 200) {
      toast.success("Se realizó el rechazo del radicado de manera exitosa.");
      const dataTrazabilidad = {
        proceso: `MLCOM${allInfo.value.id}`,
        secuencia: allInfo.value.idRadicado,
        estado: allInfo.value.estado,
        descripcion: `Usuario:${auth.$state.userInfo.name} Motivo: ${form.value.motivoRechazoAprobacion} `,
        comentario: form.value.motivoRechazoAprobacion,
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} rechazó la revision del radicado`,
        tramite: "Comunicacion",
      };
      await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad, {
        showLoader: false,
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    router.push("/medicina/bandeja-comunicaciones");
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

    router.push("/medicina/bandeja-comunicaciones");
  } catch (error) {
    toast.error("Ocurrió un error inesperado.");
  }
};

const exitoAprobacion = async () => {
  router.push("/medicina/bandeja-comunicaciones");
};

const exitoAprobacionApro = async () => {
  router.push("/medicina/bandeja-comunicaciones");
};

function rejectedTypesAprob(fileEntries) {
  if (!fileEntries.length) {
    return;
  }

  if (fileEntries[0]?.file.size >= 50 * 1024 * 1024) {
    toast.error("El peso máximo permitido es de 50MB");
  } else {
    const allowedFileTypes = [
      "png",
      "jpg",
      "jpeg",
      "webp",
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

const getLabel = (value, options) => {
  const option = options.find((option) => option.value === value);
  return option ? option.label : "";
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

const resetMetaForm = async () => {
  await myForm0.value.reset();
  await validationMetadatos.value.resetValInput();
};

const sortOptionsVal = (vals: any[]) => {
  return vals.sort(
    (
      leftItem: { dependencia_label: string },
      rightItem: { dependencia_label: string }
    ) => {
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

watch(
  () => allInfo.value?.estado,
  (newEstado) => {
    if (newEstado === "devolucion") {
      removeButton("datos-salida");
      removeButton("documento-salida");
      removeButton("incluir-exp");
      removeButton("adjuntar-documento");
      removeButton("metadatos");
      removeButton("trazabilidad-documento");
      removeButton("enviar-revision");
      removeButton("documentos-relacionados");
    }
  },
  { immediate: true }
);

watch(
  () => tab.value,
  (newValue) => {
    if (newValue !== "enviar-revision") {
      userSeletecdByAprobacion.value = null;
      userSeletecdByRevision.value = null;
    }
  }
);

watch(
  () => formExitData.value,
  (value) => {
    const isPaisColombia =
      typeof formExitData.value?.datosSalidaPaisId === "number"
        ? formExitData.value?.datosSalidaPaisId === 425
        : formExitData.value?.datosSalidaPaisId?.value === 425;

    datosSalida.value.destinatario = {
      ...datosSalida.value?.destinatario,
      nombre: value?.datosSalidaNombreDestinatario,
      direccion: value?.datosSalidaDireccion,
      numero_celular: value?.datosSalidaTelefono,
      departamento: isPaisColombia
        ? getLabel(
            formExitData.value?.datosSalidaDeptoId,
            departmentsOptions.value
          )
        : getLabel(
            formExitData.value?.datosSalidaPaisId,
            optionsCountries.value
          ),
      municipio: isPaisColombia
        ? getLabel(
            formExitData.value?.datosSalidaMunicipioId,
            municipioOptions.value
          )
        : getLabel(
            formExitData.value?.datosSalidaPaisId,
            optionsCountries.value
          ),
      shippingMethod: getLabel(
        formExitData.value?.datosSalidaFormaEnvioId,
        shippingMethodsOptions.value
      ),
    };
  },
  { deep: true }
);

watch(
  () => bodyCopyExterna.value,
  (_) => {
    datosSalida.value.destinatario = {
      ...datosSalida.value.destinatario,
      // @ts-expect-error
      copiesExterna: bodyCopyExterna.value.length ? bodyCopyExterna.value : "",
    };
  },
  { deep: true }
);

watch(
  () => bodyCopyInterna.value,
  (_) => {
    datosSalida.value.destinatario = {
      ...datosSalida.value.destinatario,
      // @ts-expect-error
      copiesInterna: bodyCopyInterna.value.length ? bodyCopyInterna.value : "",
    };
  },
  { deep: true }
);

watch(
  () => formGeneralData.value.asunto,
  (value) => {
    datosSalida.value.destinatario = {
      ...datosSalida.value.destinatario,
      asunto: value,
    };
  },
  { deep: true }
);

watch(
  () => stepDataSend.value,
  (newValue) => {
    if (newValue === 0) labelBtnDatosSalida.value = "Siguiente";
    if (newValue === 2) labelBtnDatosSalida.value = "Guardar";
  }
);

watch(
  () => formExitData.value.copyType,
  (value) => {
    if (value) activeButtonCopy.value = true;
    else if (!updateTypeCopy.value && !value) activeButtonCopy.value = false;
  }
);

watch(
  () => formExitData.value.datosSalidaDeptoId,
  async (value) => {
    if (value && typeof value === "number") {
      const { optionsMunicipalities } = await useMunicipalities(value);
      municipioOptions.value = optionsMunicipalities.value;
    }
  }
);
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
