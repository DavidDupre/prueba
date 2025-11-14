<template>
  <q-page class="q-pa-md">
    <div class="tw-pt-4">
      <router-link to="/">
        <q-btn flat color="primary" label="Volver" icon="chevron_left" />
      </router-link>
    </div>

    <div class="tw-flex tw-items-center tw-justify-between">
      <div class="tw-flex tw-flex-col">
        <ComponentTitle
          class="q-mt-lg"
          :title="`Crear Comunicaciones`"
          classTitle="tw-font-bold tw-text-4xl"
        />

        <q-chip
          class="tw-text-center"
          square
          :ripple="false"
          style="
            border: 0.5px solid #0049ff;
            background: #e5edff;
            color: #2c3948;
            border-radius: 8px;
            width: 100px;
            padding: 8px 10px;
          "
        >
          {{ state }}
        </q-chip>
      </div>
    </div>

    <q-card :key="uiTabsKey" class="tw-rounded-xl tw-mt-8" flat bordered>
      <q-tabs
        v-model="tab"
        inline-label
        no-caps
        outside-arrows
        align="left"
        class="tw-rounded-lg tw-bg-white custom-tabs tw-flex rowsTab-alingCenter"
        indicator-color="transparent"
        active-color="primary"
        @update:model-value="checkSalidaData"
      >
        <q-tab
          :key="tab.key"
          :name="tab.key"
          :ripple="false"
          class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]"
          v-for="tab in filteredTabs"
          ripple="false"
          :icon="tab.icon"
          :label="tab.name"
        >
        </q-tab>
      </q-tabs>
    </q-card>

    <q-tab-panels v-model="tab" animated class="tw-bg-transparent">
      <q-tab-panel name="datos-generales" class="q-pa-none">
        <q-form greedy ref="myForm0">
          <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <p class="tw-text-2xl tw-font-bold tw-pb-4">Datos Generales</p>

              <div class="col-12">
                <span class="tw-w-full">
                  <label class="tw-text-label">Asunto *</label>
                  <q-input
                    v-model="formGeneralData.asunto"
                    dense
                    outlined
                    label="Inserte"
                    class="tw-rounded-lg"
                    :rules="[inputRequired, (val) => maxLengthInput(100, val)]"
                  />
                </span>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label"
                    >Tipo de documento del afectado
                  </label>
                  <q-select v-model="formGeneralData.tipoDocumento" label="Seleccione" map-options emit-value dense
                    outlined :options="tipoDocumentoOptions" class="tw-rounded-lg">
                  </q-select>
                </span>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Número de documento del afectado
                  </label>
                  <q-input v-model="formGeneralData.numeroDocumento" dense outlined label="Inserte"
                    class="tw-rounded-lg" :rules="[
                      Number(formGeneralData.tipoDocumento) == 11
                        ? alphanumeric2
                        : (v) => onlyNumbers(v),
                      (val) => maxLengthInput(15, val),
                    ]" />
                </span>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Nombre del afectado</label>
                  <q-input v-model="formGeneralData.nombreAfectado" dense outlined label="Inserte" class="tw-rounded-lg"
                    :rules="[(val) => maxLengthInput(200, val)]" />
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Radicado asociado</label>
                  <q-select multiple v-model="formGeneralData.radNumero" use-chips use-input map-options emit-value
                    dense outlined label="Inserte" class="tw-rounded-lg" @filter="filterRadicadosAsociados"
                    :options="asociadosOptions">
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>

                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </span>
              </div>
            </div>
          </q-card>
        </q-form>
      </q-tab-panel>

      <q-tab-panel name="documento-salida" class="q-pa-none">
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <Editor :data="dataFooter" :referentKey="datosSalida['destinatario']" :restric="restric" :internal-com="internalCom" :auto-save-on-mount="true"
            :base64="documentoFile" :isEditorEmpty="true" @datos-response="autoSaveDocument" :document="htmlContent" />
        </q-card>
      </q-tab-panel>
      <q-tab-panel name="trazabilidad">
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <Trazabilidad :doneItems="trazabilidadData" />
        </q-card>
      </q-tab-panel>
      <q-tab-panel name="datos-salida" class="q-pa-none">
        <q-form ref="myForm10" v-if="stepDataSend === 0" greedy>
          <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
            <p class="tw-text-2xl tw-font-bold tw-pb-4">Datos de salida</p>
            <FormFormDatosSalida :data-initial="formExitData" :tipo-comunicacion="communicationInfo.tipoComunicacion" />
          </q-card>
        </q-form>

        <q-form ref="myForm20" v-if="stepDataSend === 1" greedy>
          <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
            <p class="tw-text-2xl tw-font-bold tw-pb-4">Copia</p>
            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">¿Con copia?*</label>
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

          <!-- Display for Copia Interna -->
          <div v-if="formExitData.copyType === 1 || formExitData.copyType === 4">
            <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
              <p class="tw-text-2xl tw-font-bold tw-pb-4">Copia Interna</p>
              <FormCopyInterna :key="isFormResetInterno" @update:item-added="(form) => handleClickAddNewDestinaryInterno(form)
                " />
            </q-card>

            <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
              <TableDestinatarios :key="bodyCopyInterna" class="full-width"
                :JUZGADOS_HEADER="DESTINARIOS_HEADER_COPY_INTERNA" :JUZGADOS_BODY="bodyCopyInterna"
                @update:item-deleted="(value) => (bodyCopyInterna = value)" />
            </q-card>
          </div>

          <!-- Display for Copia Externa -->
          <div v-if="formExitData.copyType === 2 || formExitData.copyType === 4">
            <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
              <p class="tw-text-2xl tw-font-bold tw-pb-4">Copia Externa</p>
              <FormCopyExterna :key="isFormResetExterno" @update:item-added="(form) => handleClickAddNewDestinaryExterno(form)
                " />
            </q-card>

            <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
              <TableDestinatarios :key="bodyCopyExterna" class="full-width"
                :JUZGADOS_HEADER="DESTINARIOS_HEADER_COPY_EXTERNA" :JUZGADOS_BODY="bodyCopyExterna"
                @update:item-deleted="(value) => (bodyCopyExterna = value)" />
            </q-card>
          </div>
        </q-form>
      </q-tab-panel>

      <q-tab-panel name="adjuntar-documento">
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <p class="tw-text-2xl tw-font-bold tw-pb-4">Adjuntar Documentos</p>
          <div class="col-12">
            <span class="tw-w-full">
              <p class="tw-mb-1 tw-pl-3">Adjuntar archivos</p>
              <FileLoader
                v-model="formDatosAdjuntos.files"
                class="tw-w-full"
                :multiple="true"
                sub-title="Puede adjuntar (30) Archivo(s) cada uno con un tamaño permitido de 50MB en cualquiera de las siguientes extensiones <hr>(pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)"
                accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
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
            :key="fileDataTable"
            class="full-width"
            :JUZGADOS_HEADER="DOCUMENTOS_HEADER"
            :JUZGADOS_BODY="fileDataTable"
            @update:show-printer="(value) => printerDocument(value)"
            @update:item-deleted="(value) => handleDelteFileTable(value)"
            @update:item-type-changed="(value) => onChangeDocType(value)"
          />
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="eliminar-comunicacion">
        <ConfirmModal
          @update:show-modal="handleRejectModal"
          @confirm-modal="handleSubmitEliminarRadicacion"
          :show-modal="showConfirmModal"
          text-show-modal="¿Esta seguro de eliminar esta comunicación?"
          text-confirm-modal="Si"
          text-cancel-modal="No"
        />
      </q-tab-panel>

      <q-tab-panel name="incluir-exp" :disable="!hasData">
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <IncluirExpediente
            :tutelasData="hardcoreData"
            :isExpediente="isExpe"
            @update:is-Expediente="isExpe = true"
          />
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="enviar-revision">
        <q-form v-if="!saveDatosGeneralesRevision" greedy ref="myForm40">
          <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <p class="tw-text-2xl tw-font-bold tw-pb-4">Datos generales</p>

              <div class="col-12">
                <span class="tw-w-full">
                  <label class="tw-text-label">Asunto *</label>
                  <q-input
                    v-model="formGeneralData.asunto"
                    dense
                    outlined
                    label="Inserte"
                    class="tw-rounded-lg"
                    :rules="[
                      inputRequired,
                      (val) => maxLengthInput(100, val),
                    ]"
                  />
                </span>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label"
                    >Tipo de documento del afectado *</label
                  >
                  <q-select
                    v-model="formGeneralData.tipoDocumento"
                    label="Seleccione"
                    map-options
                    emit-value
                    dense
                    outlined
                    :options="tipoDocumentoOptions"
                    class="tw-rounded-lg"
                    :rules="[inputRequired]"
                  >
                  </q-select>
                </span>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Número de documento del afectado {{ !isNinguno ? '*' : '' }} </label>
                  <q-input v-model.number="formGeneralData.numeroDocumento" dense outlined label="Inserte"
                    class="tw-rounded-lg" :rules="[
                      Number(formGeneralData.tipoDocumento) == 11
                        ? alphanumeric2
                        : (v) => onlyNumbers(v),
                      (val) => maxLengthInput(15, val),
                      !isNinguno ? inputRequired : null,
                    ]" :disable="isDisabled" />
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Nombre del afectado *</label>
                  <q-input
                    v-model="formGeneralData.nombreAfectado"
                    dense
                    outlined
                    label="Inserte"
                    class="tw-rounded-lg"
                    :rules="[
                      (val) => maxLengthInput(200, val),
                      inputRequired,
                    ]"
                  />
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Radicado asociado</label>
                  <q-select
                    multiple
                    v-model="formGeneralData.radNumero"
                    use-chips
                    use-input
                    map-options
                    emit-value
                    dense
                    outlined
                    label="Inserte"
                    class="tw-rounded-lg"
                    @filter="filterRadicadosAsociados"
                    :options="asociadosOptions"
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>

                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </span>
              </div>

              <div class="col-12">
                <span class="tw-w-full">
                  <label class="tw-text-label">Número de anexos *</label>
                  <q-input
                    v-model.number="formRevision.numeroAnexos"
                    dense
                    outlined
                    label="Inserte"
                    class="tw-rounded-lg"
                    :rules="[
                      inputRequired,
                      alphanumeric,
                      onlyNumbers,
                      (val) => maxLengthInput(5, val),
                    ]"
                  />
                </span>
              </div>

              <div class="col-12">
                <label class="q-px-md tw-text-label"
                  >Observación
                  <q-input
                    type="textarea"
                    outlined
                    label="Inserte"
                    dense
                    emit-value
                    v-model="formRevision.observaciones"
                    :rules="[
                      (val) => maxLengthInput(255, val),
                      (v) => minLengthInputCustomAsignacion(10, v),
                    ]"
                  />
                </label>
              </div>
            </div>
          </q-card>
        </q-form>

        <q-form v-else greedy ref="myForm40">
          <FormRevision
            :data-initial="formRevision"
            @update:item-selected="(val) => (userSeletecdByRevision = val)"
          />
        </q-form>
      </q-tab-panel>

      <q-tab-panel name="enviar-aprobacion">
        <q-form v-if="!hasSendRevision" greedy ref="myForm40">
          <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <p class="tw-text-2xl tw-font-bold tw-pb-4">Datos generales</p>

              <div class="col-12">
                <span class="tw-w-full">
                  <label class="tw-text-label">Asunto *</label>
                  <q-input
                    v-model="formGeneralData.asunto"
                    dense
                    outlined
                    label="Inserte"
                    class="tw-rounded-lg"
                    :rules="[
                      inputRequired,
                      alphanumericWithSpaceAndHashtag,
                      (val) => maxLengthInput(100, val),
                    ]"
                  />
                </span>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label"
                    >Tipo de documento del afectado *</label
                  >
                  <q-select
                    v-model="formGeneralData.tipoDocumento"
                    label="Seleccione"
                    map-options
                    emit-value
                    dense
                    outlined
                    :options="tipoDocumentoOptions"
                    class="tw-rounded-lg"
                    :rules="[inputRequired]"
                  >
                  </q-select>
                </span>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Número de documento del afectado {{ !isNinguno ? '*' : '' }} </label>
                  <q-input v-model.number="formGeneralData.numeroDocumento" dense outlined label="Inserte"
                    class="tw-rounded-lg" :rules="[
                      Number(formGeneralData.tipoDocumento) == 11
                        ? alphanumeric2
                        : (v) => onlyNumbers(v),
                      (val) => maxLengthInput(15, val),
                      !isNinguno ? inputRequired : null
                    ]" :disable="isDisabled" />
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Nombre del afectado *</label>
                  <q-input
                    v-model="formGeneralData.nombreAfectado"
                    dense
                    outlined
                    label="Inserte"
                    class="tw-rounded-lg"
                    :rules="[
                      (val) => maxLengthInput(200, val),
                      inputRequired,
                    ]"
                  />
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Radicado asociado</label>
                  <q-select
                    multiple
                    v-model="formGeneralData.radNumero"
                    use-chips
                    use-input
                    map-options
                    emit-value
                    dense
                    outlined
                    label="Inserte"
                    class="tw-rounded-lg"
                    @filter="filterRadicadosAsociados"
                    :options="asociadosOptions"
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>

                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </span>
              </div>

              <div class="col-12">
                <span class="tw-w-full">
                  <label class="tw-text-label">Número de anexos *</label>
                  <q-input
                    v-model.number="formRevision.numeroAnexos"
                    dense
                    outlined
                    label="Inserte"
                    class="tw-rounded-lg"
                    :rules="[
                      inputRequired,
                      alphanumeric,
                      onlyNumbers,
                      (val) => maxLengthInput(5, val),
                    ]"
                  />
                </span>
              </div>

              <div class="col-12">
                <label class="q-px-md tw-text-label"
                  >Observación
                  <q-input
                    type="textarea"
                    outlined
                    label="Inserte"
                    dense
                    emit-value
                    v-model="formRevision.observaciones"
                    :rules="[
                      (val) => maxLengthInput(255, val),
                      (v) => minLengthInputCustomAsignacion(10, v),
                    ]"
                  />
                </label>
              </div>
            </div>
          </q-card>
        </q-form>

        <q-form v-else greedy ref="myForm40">
          <FormAprobacion
            :data-initial="formRevision"
            @update:item-selected="(val) => (userSeletecdByAprobacion = val)"
          />
        </q-form>
      </q-tab-panel>
    </q-tab-panels>

    <CrearCorrespondenciaModal
      @update:showModal="(val) => (showFormModalComunication = val)"
      :showModal="showFormModalComunication"
      @create-new-communication="handleNewCommunicationInfo"
    />

    <div
      v-if="tab !== 'datos-salida' && tab !== 'incluir-exp'&& tab !== 'documento-salida'"
      class="tw-flex tw-justify-center tw-items-center tw-my-10 tw-gap-6"
    >
      <q-btn
        v-if="tab === 'enviar-aprobacion' && hasSendRevision"
        @click="showCancelModal = true"
        label="Regresar"
        type="reset"
        style="width: 240px"
        text-color="black"
        color="accent"
        class="tw-rounded-xl tw-h-12"
      />

      <q-btn
        @click="showCancelModal = true"
        label="Cancelar"
        type="reset"
        style="width: 240px"
        text-color="black"
        color="accent"
        class="tw-rounded-xl tw-h-12"
      />

      <q-btn
        v-if="tab === 'documento-salida'"
        @click="handleClickSaveChangesDoc()"
        label="Guardar cambios"
        style="width: 240px"
        text-color="white"
        color="primary"
        class="tw-rounded-xl tw-h-12"
      />
      <q-btn
        v-if="tab === 'enviar-revision' && saveDatosGeneralesRevision"
        @click="handleSendRevision()"
        label="Enviar a revisión"
        text-color="white"
        style="width: 240px"
        color="primary"
        class="tw-rounded-xl tw-h-12 tw-p-2"
        :disable="disableEnviarRevision"
      />
      <q-btn
        v-else-if="tab === 'enviar-aprobacion' && hasSendRevision"
        @click="handleSendAprobacion()"
        label="Enviar a aprobación"
        text-color="white"
        style="width: 240px"
        color="primary"
        class="tw-rounded-xl tw-h-12 tw-p-2"
        :disable="disableEnviarAprobacion"
      />
      <q-btn
        v-else-if="
          ![
            'adjuntar-documento',
            'enviar-revision',
            'enviar-aprobacion',
            'documento-salida',
          ].includes(tab)
      " @click="next()" label="Continuar" text-color="white" icon-right="navigate_next" style="width: 240px"
        color="primary" class="tw-rounded-xl tw-h-12 tw-p-2" />
      <q-btn v-else @click="next()" label="Guardar" text-color="white" style="width: 240px" color="primary"
        class="tw-rounded-xl tw-h-12 tw-p-2" />
    </div>

    <div
      v-else-if="tab !== 'incluir-exp' && tab !== 'documento-salida'"
      class="tw-flex tw-justify-center tw-items-center tw-my-10 tw-gap-6"
    >
      <q-btn
        v-if="tab == 'datos-salida' && stepDataSend > 0"
        @click="handleAcceptModal()"
        :label="tab === 'datos-salida' ? 'Regresar' : 'Cancelar'"
        type="reset"
        style="width: 240px"
        text-color="black"
        color="accent"
        class="tw-rounded-xl tw-h-12"
      />

      <q-btn
        v-if="tab == 'datos-salida' && stepDataSend >= 0"
        @click="showCancelModal = true"
        label="Cancelar"
        type="reset"
        style="width: 240px"
        text-color="black"
        color="accent"
        class="tw-rounded-xl tw-h-12"
      />

      <q-btn
        @click="next()"
        :label="stepDataSend !== 2 ? 'Siguiente' : 'Guardar'"
        text-color="white"
        icon-right="navigate_next"
        style="width: 240px"
        color="primary"
        class="tw-rounded-xl tw-h-12 tw-p-2"
      />
    </div>

    <Modal
      v-model:model-value="showCancelModal"
      title="Confirmación"
      persistent
      :text="textModal[tab] || 'Al cancelar la acción perderá los datos ingresados en el formulario, ¿desea realizar la acción?'"
      :is-success="false"
      :cancelButton="true"
      @handle-accept="handleAcceptModal"
      textButtonCancel="No"
      text-button="Si"
    />

    <Modal
      v-model:model-value="showModalWarning"
      :text="`Recuerde asegurarse de cargar los anexos requeridos para la comunicación`"
      :is-success="true"
      @handle-accept="showModalWarning = false"
      text-button="Aceptar"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch ,computed} from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCrearComunicacionesLogic } from "src/pages/Correspondencia/Crear/CrearComunicaciones/CrearComunicaciones.Logic";
import FileLoader from "components/FormFields/FileLoader.vue";
import CrearCorrespondenciaModal from "src/components/Modal/CrearCorrespondenciaModal.vue";
import ComponentTitle from "src/components/ComponentTitle/ComponentTitle.vue";
import {
  alphanumeric2,
  inputRequired,
  maxLengthInput,
  onlyNumbers,
  alphanumeric,
  alphanumericWithSpaceAndHashtag,
  minLengthInputCustomAsignacion,
} from "src/helpers/validations";
import { toast } from "src/helpers/toast";
import Modal from "src/components/Modal/Modal.vue";
import { useAuthStore } from "src/stores/auth.store";
import {
  textModal,
  objResponse,
  DESTINARIOS_HEADER_COPY_EXTERNA,
  DESTINARIOS_HEADER_COPY_INTERNA,
  DOCUMENTOS_HEADER,
  dictionaryTypeCopy,
  filteredTabs,
  mapFormData,
} from "./const/index";
import TableDestinatarios from "src/components/comunicacion/Table.vue";
import FormCopyExterna from "src/components/comunicacion/FormCopyExterna.vue";
import FormCopyInterna from "src/components/comunicacion/FormCopyInterna.vue";
import FormRevision from "src/components/comunicacion/FormRevision.vue";
import FormAprobacion from "src/components/comunicacion/FormAsigancion.vue";
import FormFormDatosSalida from "src/components/comunicacion/FormDatosSalida.vue";
import { validateCustom, validateCustomFormData } from "./utils/index";
import { sgdeaAxios } from "../../../../services/index";
import ConfirmModal from "src/components/Modal/ConfirmModal.vue";
import {
  useDepartments,
  useMunicipalities,
  useCountries,
} from "src/composables/useVersion";
import TableDocuments from "src/components/comunicacion/TableDoc.vue";
import IncluirExpediente from "src/components/comunicacion/expediente/IncluirExpediente.vue";
import moment from "moment";
import Editor from "src/components/Editor/editor.vue";
import { useDocumentStore } from "src/stores/documentStore";
import { getAcronimobyDoc } from "src/helpers/prefijoTipoDoc";
import Trazabilidad from "src/pages/Expedientes/Trazabilidad/Trazabilidad.vue";
import { crearTrazabilidad } from "src/helpers/trazabilidad";

const idDatosGenerales = ref();
const idComunicacion = ref();
const hardcoreData = ref({
  codigoProceso: "",
  idRadicado: "",
  nodeId: "",
  informacionProceso: {
    numeroDocumentoAfectado: "",
  },
  id: "",
  isMasivo: false,
});

let formData;
const isNinguno = computed(() => formGeneralData.value.tipoDocumento === 12)
const auth = useAuthStore();
const docSalidaComp = ref();
const firstname = auth.userInfo.name.split(" ")[0];
const lastname = auth.userInfo.name.split(" ")[1];
const { optionsCountries } = useCountries();
const destinatario = ref();
const data = ref({
  clonado: false,
  asignacionPqrdEntity: {
    gestionador: {
      firstname,
      lastname,
    },
  },
});

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

const updateHtmldoc = ref(null);
const dataSave = ref(null);
const state = ref("En creación");

const departmentsOptions = ref([]);
const municipioOptions = ref([]);
const shippingMethodsOptions = ref([]);
const asociadosOptionsStatic = ref([]);
const asociadosOptions = ref([]);
const radicadoId = ref();
const showModalWarning = ref(false);
const hasSendRevision = ref(false);
const userSeletecdByAprobacion = ref(null);
const userSeletecdByRevision = ref(null);
const saveDatosGeneralesRevision = ref(false);
const idRadicacion = ref(null);
const showConfirmModal = ref(true);
const isFormResetExterno = ref(0);
const isFormResetInterno = ref(0);
const oficinaDestino = ref({id: null, nombre: null});
const myForm0 = ref(null);
const myForm10 = ref(null);
const myForm20 = ref(null);
const myForm30 = ref(null);
const myForm40 = ref(null);
const step = ref(0);
const stepDataSend = ref(0);
const uiTabsKey = ref(0);
const router = useRouter();
const tipoDocumentoOptions = ref([]);
const communicationInfo = ref({});
const showFormModalComunication = ref(false);
const tab = ref("datos-generales");
const showCancelModal = ref(false);
const bodyCopyExterna = ref([]);
const bodyCopyInterna = ref([]);
const copiesTypesOptions = ref([]);
const fileDataTable = ref([]);
const isExpe = ref(false);
const internalCom = ref();
const dataFooter = ref({});
let referentKey = {};
const documentoFile = ref("");
const restric = ref(false);
const route = useRoute();
const htmlContent = ref("");
const isEditorDataReady = ref(false);
const documentStore = useDocumentStore();
const isComunicacionAutomatica = ref(false);
const aprobadorSelected = ref([]);
const tipoPlantillaSeleted = ref(1);
const isSendDestinatarios = ref(false);
const allInfo = ref();
const isDisabled = ref(false);
const isDocSalida = ref();
const updateTypeCopy = ref(null);
const secuencia = ref("");
const giveMetadatos = ref(false);
const giveDestinatario = ref(false);
const getCopy = ref(null);
const giveCorreo = ref(false);
const isSendContenidoDoc = ref(false);
const isFisrRenderInterno = ref(true);

const getAllData = async () => {
  restric.value = false;
  const { getCopiesTypesOptions, getAllDataByID, getShippingWayOptions } =
    useCrearComunicacionesLogic();

  const promises = route.query.id
    ? [getCopiesTypesOptions(), getAllDataByID(idComunicacion.value)]
    : [getCopiesTypesOptions()];

  // @ts-expect-error
  const [copias, allDataLoaded] = await Promise.allSettled(promises);

  allInfo.value = allDataLoaded?.value;
  isDisabled.value =
    (allDataLoaded?.value.estado === "Por revisar" ||
      allDataLoaded?.value.estado === "Por aprobar" ||
      allDataLoaded?.value.estado === "Revisado" ||
      allDataLoaded?.value.estado === "Aprobado") &&
    auth.userInfo.role === "Gestionador"
      ? true
      : false;

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

  documentStore.clearDocumentContent();

  htmlContent.value = allDataLoaded?.value.docSalida;
};

const objKeysCorreo = {
  asuntoCorreo: "",
  contenidoCorreo: "",
};

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

const getPlantillaSinPrefijo = async () => {
  const nodeidInterno = process.env.NODE_MEMORANDO_INTERNO;
  const nodeidExterno = process.env.NODE_SIN_PREFIJO;

  const response = await sgdeaAxios.get(
    `/radicados/consultar_documento/${
      dataCom.value.tipoComunicacion === 1 ? nodeidInterno : nodeidExterno
    }`
  );
  return response.data;
};
const idDocumento = ref();
async function getDocSalida() {
  try {
    const response = await sgdeaAxios.get(
      `/correspondencia/comunicacion/BuscarDocumentoSalida?comunicacionId=${dataComunicacion.value.data.id}`,
      { showLoader: false }
    );
    htmlContent.value = response.data?.html_content;
    idDocumento.value = response.data?.id;
  } catch (error) {
    console.error(error);
  }
}
async function autoSaveDocument({ paragraf, pdf }) {
  try {
    const htmlContentPara = paragraf;
    const blob = new Blob([htmlContentPara], {
      type: "text/html;charset=UTF-8",
    });
    let response;

    response = await sgdeaAxios.post(
      "/correspondencia/comunicacion/guardarDocumentoSalida",
      {
        idComunicacion: dataComunicacion.value.data.id,
        id_documentoSalida: idDocumento.value,
        contenido_html: htmlContentPara,
        usuarioCreadorId: auth.userInfo.userid,
      },{showLoader: false}
    );

    // if (response.status === 200 || response.status === 201) {
    //   toast.success("Se guardó el documento exitosamente");
    //   await crearTrazabilidad({
    //     proceso: `COR${detalleRadicado.value.id}`,
    //     secuencia: detalleRadicado.value.idRadicado,
    //     estado: detalleRadicado.value.estadoProceso.estado,
    //     descripcion: `Se ha modificado el documento de salida`,
    //     comentario: 'Modificación',
    //     nombre: userInfo.value.name,
    //     tramite: detalleRadicado.value.tipoTramite.nombre,
    //     accion: `${userInfo.value.name}  ha modificado el documento de salida del caso  ${hardcoreData.value.idRadicado}`
    //   })
    // }
    await getDocSalida();
  } catch (error) {
    toast.error("Hubo un error al guardar el documento.");
  }
}
const formRefs = ref({
  "datos-generales": [myForm0],
  "datos-salida": [
    { value: { validate: async () => validateCustom(formGeneralData) } },
    myForm10,
  ],
  "enviar-revision": [
    {
      value: {
        validate: async () =>
          validateCustomFormData(formData, "datosGeneralesRA"),
      },
    },
    myForm40,
  ],
  "enviar-aprobacion": [
    {
      value: {
        validate: async () =>
          validateCustomFormData(formData, "datosGeneralesRA"),
      },
    },
    myForm40,
  ],
});

watch(
  () => stepDataSend.value,
  (newValue) => {
    if (newValue === 0) {
      formRefs.value = {
        ...formRefs.value,
        "datos-salida": [
          { value: { validate: async () => validateCustom(formGeneralData) } },
          myForm10,
        ],
      };
    }

    if (newValue === 1) {
      formRefs.value = {
        ...formRefs.value,
        "datos-salida": [
          { value: { validate: async () => validateCustom(formGeneralData) } },
          myForm20,
        ],
      };
    }
    if (newValue === 2) {
      formRefs.value = {
        ...formRefs.value,
        "datos-salida": [
          { value: { validate: async () => validateCustom(formGeneralData) } },
          myForm30,
        ],
      };
    }
  }
);

const formGeneralData = ref({
  asunto: "",
  tipoDocumento: "",
  nombreAfectado: "",
  numeroDocumento: "",
  radNumero: [],
});

const formExitData = ref({
  datosSalidaFormaEnvioId: "",
  datosSalidaTipoDocumentoDestinatarioId: "",
  datosSalidaTipoOficionaDestinatarioId: "",
  datosSalidaNumeroDocumentoDestinatario: "",
  datosSalidaNombreDestinatario: "",
  datosSalidaDireccion: "",
  datosSalidaPaisId: { value: 425, label: "Colombia" },
  datosSalidaDeptoId: "",
  datosSalidaMunicipioId: "",
  datosSalidaCorreo: "",
  datosSalidaTelefono: "",
  datosSalidaCargoDelfuncionario: "",
  asunto: "",
  datosSalidaAnexos: "",
  observacion: "",
  datosSalidaTipoDocumentoAfectadoId: "",
  datosSalidaNumeroDocumentoAfectado: "",
  datosSalidaNombreAfectado: "",
  asuntoCorreo: "",
  contenidoCorreo: "",
  copyType: "",
});

watch(
  () => formGeneralData.value.asunto,
  (value) => {
    formExitData.value.asunto = value;
  }
);

watch(
  () => formExitData.value.asunto,
  (value) => {
    if (value !== formGeneralData.value.asunto) {
      formGeneralData.value.asunto = value;
    }
  }
);

watch(
  () => formExitData.value.copyType,
  (value) => {
    if (value) {
      bodyCopyInterna.value = [];
      bodyCopyExterna.value = [];
    }
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

watch(
  () => bodyCopyInterna.value,
  (_) => {
    datosSalida.value.destinatario = {
      ...datosSalida.value.destinatario,
      copiesInterna: bodyCopyInterna.value.length ? bodyCopyInterna.value : "",
    };
  },
  { deep: true }
);

watch(
  () => bodyCopyExterna.value,
  (_) => {
    datosSalida.value.destinatario = {
      ...datosSalida.value.destinatario,
      copiesExterna: bodyCopyExterna.value.length ? bodyCopyExterna.value : "",
    };
  },
  { deep: true }
);

watch(
  () => formGeneralData.value.radNumero,
  (value) => {
    datosSalida.value.destinatario = {
      ...datosSalida.value.destinatario,
      radNumero: value.length
        ? `${value.map((label) => label).join(", ")}`
        : "",
    };
  }
);
const usercreate = ref();
const getUserInfo = async (userId) => {
  const response = await sgdeaAxios.get(`/usuarios/${userId}`);
  usercreate.value = response.data;
  return usercreate.value;
};

watch(
  () => formExitData.value,
  async (value) => {
    const isPaisColombia =
      typeof value.datosSalidaPaisId === "number"
        ? value.datosSalidaPaisId === 425
        : value.datosSalidaPaisId.value === 425;

    const departamento = isPaisColombia
      ? getLabel(value.datosSalidaDeptoId, departmentsOptions.value)
      : getLabel(value.datosSalidaPaisId, optionsCountries.value);

    datosSalida.value.destinatario = {
      ...datosSalida.value.destinatario,
      nombre: value.datosSalidaNombreDestinatario || "",
      direccion: value.datosSalidaDireccion || "",
      numero_celular: value.datosSalidaTelefono || "",
      asunto: value.asunto || "",
      anexos: value.datosSalidaAnexos || "",
      NombredeDestinatario: value.datosSalidaNombreDestinatario || "",
      NumeroDocDestinatario: value.datosSalidaNumeroDocumentoDestinatario || "",
      DireccionDeDestinatario: value.datosSalidaDireccion || "",
      CorrreoDestinatario: value.datosSalidaCorreo || "",
      NombreAfectado: value.datosSalidaNombreAfectado || "",
      TIpoDeDocumentoAfectado: value.datosSalidaTipoDocumentoAfectadoId || "",
      NumerodedocumentoAfectado: value.datosSalidaNumeroDocumentoAfectado || "",
      Firma: "",
      NombreAprobador: "",
      CargoAprobador: "",
      DependenciaAprobador: "",
      DepartamentoYMunicipioDestinatario:
        departamento && isPaisColombia
          ? `${departamento} - ${getLabel(
              value.datosSalidaMunicipioId,
              municipioOptions.value
            )}`
          : "",
      shippingMethod: getLabel(
        value.datosSalidaFormaEnvioId,
        shippingMethodsOptions.value
      ),
    };

    const elaboroUsuario = usercreate.value
      ? `${usercreate.value.fullname.toUpperCase() ?? ""} - ${
          usercreate.value.cargo?.nombre ?? ""
        } - ${
          usercreate.value.usuarioRelaciones[0]?.oficina?.dependencia.nombre ??
          ""
        } `
      : "";

    // Si es de tipo interno
    if (dataCom.value && dataCom.value.tipoComunicacion === 1) {
      if (!oficinaDestino.value.id || oficinaDestino.value.id !== formExitData.value.datosSalidaTipoOficionaDestinatarioId) {
        oficinaDestino.value.id = formExitData.value?.datosSalidaTipoOficionaDestinatarioId
        oficinaDestino.value.nombre = await getOfficeName(formExitData.value.datosSalidaTipoOficionaDestinatarioId)
      }
      internalCom.value = {
        nombreElaboro: usercreate.value.firstname
          ? usercreate.value.firstname?.toUpperCase().trim()
          + ` ${usercreate.value.lastname?.toUpperCase().trim() ?? ""}` : "",
        oficinaElaboro: usercreate.value.usuarioRelaciones
        && usercreate.value.usuarioRelaciones.length > 0
          ? usercreate.value?.usuarioRelaciones[0]?.oficina?.nombre ?? "" : "",
        nombreDestinatario: formExitData.value?.datosSalidaNombreDestinatario
          ? formExitData.value?.datosSalidaNombreDestinatario?.toUpperCase().trim() : "",
        oficinaDestinatario: oficinaDestino.value?.nombre ?? "",
        asunto: formExitData.value.asunto ?? "",
        radicado: radicadoId.value ?? "",
      }
    }

    dataFooter.value = {
      Anexo: value.datosSalidaAnexos || "",
      //asunto: value.asunto || "",
      Copia: arrayAllCopysComunication.value || "",
      DatosGestionador: elaboroUsuario,
      DatosAprobador: "",
      DatosRevisor: "",
      FormadeEnvio: datosSalida.value.destinatario.shippingMethod,
      // formaEnvio: allDataLoaded.value?.destinatarios.formEnvio
      //   ? allDataLoaded.value?.destinatarios.formEnvio.forma
      //   : "",
      //firmaAprobador: "",
      //cargoAprobador: "",
      //dependenciaAprobador: "",
    };
  },
  { deep: true }
);

const formDatosAdjuntos = ref({
  files: [],
});

const formRevision = ref({
  observacionesRevision: "",
  numeroAnexos: "",
  observaciones: "",
});

const dictionaryFormValue = {
  comunicacion: communicationInfo,
  "datos-generales": formGeneralData,
  "datos-salida": formExitData,
  "datos-salida-1": formExitData,
  "datos-salida-2": formExitData,
  "adjuntar-documento": formDatosAdjuntos,
  "enviar-revision": formRevision,
  "enviar-aprobacion": formRevision,
};

onMounted(async () => {
  idComunicacion.value = route.query.id;

  await getAllData();
  await getUserInfo(auth.userInfo.userid);

  showFormModalComunication.value = true;
  const {
    getCopiesTypesOptions,
    getTipoDocumentoOptions,
    getShippingWayOptions,
    getRadicadoAsociadoOptions,
  } = useCrearComunicacionesLogic();

  const [
    copias,
    documentos,
    optionsDepartments,
    shippingMethods,
    radicadoAsociadoOptions,
  ] = await Promise.allSettled([
    getCopiesTypesOptions(),
    getTipoDocumentoOptions(),
    useDepartments().then(({ optionsDepartments }) => optionsDepartments),
    getShippingWayOptions(),
    getRadicadoAsociadoOptions(),
  ]);

  asociadosOptionsStatic.value = radicadoAsociadoOptions.value;

  shippingMethodsOptions.value = shippingMethods.value;
  copiesTypesOptions.value = copias.value;
  // tipoDocumentoOptions.value = await getTipoDocumentoOptions();
  tipoDocumentoOptions.value = documentos.value
  departmentsOptions.value = optionsDepartments.value.value;
});

const buildFormDataListDestinatarios = (type) => {
  if (type === dictionaryTypeCopy[1]) {
    return bodyCopyInterna.value.map(({ dependencia, nombre }) => {
      return {
        correspondenciaDependencia: {
          id: dependencia,
        },
        correspondenciaFuncionario: {
          id: nombre,
        },
      };
    });
  }

  if (type === dictionaryTypeCopy[2]) {
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
        correoElectronico,
      }) => {
        return {
          formaEnvio: { id: forma },
          tipoDocumentoDestinatario: { id: tipo },
          nombreDestinatario: nombre,
          direccionDestinatario: direccion,
          paisDestinatario: { idPais: pais.value },
          departamentoDestinatario: {
            idDepartamento:
              typeof departamento === "string" ? null : departamento,
          },
          municipioDestinatario: {
            idMunicipio: typeof municipio === "string" ? null : municipio,
          },
          telefonoDestinatario: telefonoDestinatario.toString(),
          correoElectronico,
        };
      }
    );
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
      correoElectronico: formExitData.emailRecipientCopyExterna,
      municipio_label: formExitData.municipio_label,
      departamento_label: formExitData.departamento_label,
      pais_label: formExitData.countryRecipientCopyExterna.label,
      forma_label: formExitData.forma_label,
      tipo_label: formExitData.tipo_label,
      numeroDeDocumeto: formExitData.numeroDocumentoCopyExterna,
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
const dataCom = ref();
const handleNewCommunicationInfo = async (newCommunicationInfo) => {
  communicationInfo.value = {
    ...newCommunicationInfo,
    comUsuarioCreadorId: auth.$state.userInfo.userid,
    //tipoPlantilla: 2,
  };
  dataCom.value = newCommunicationInfo;

  buildFormData("comunicacion");
  const getPlantilla = await getPlantillaSinPrefijo();
  documentoFile.value = getPlantilla.base64x;
};

const trazabilidadData = ref();
const hasData = ref(false);
const getTrazabilidad = async () => {
  const response = await sgdeaAxios.get(
    "/trazabilidad/obtenerPorCodProceso/" +
      "COMIND" +
      dataComunicacion.value.data.id
  );

  if (!response?.data || response.data.length === 0) {
    trazabilidadData.value = [];
    return;
  } else {
    hasData.value = true;
  }

  trazabilidadData.value = response.data
    .sort((a, b) => a.id - b.id)
    .map((item, index) => ({
      ...item,
      detalle: item.descripcion,
    }));
};

const getOfficeName = async (id) => {
  if (id) {
    const response = await sgdeaAxios.get(`/oficinas/{id}?id=${id}`);
    if (response.status === 200) {
      return response.data.nombre;
    }
  }
  return null;
}

const submitFormData = async () => {
  formData.append("asuntoCorreo", formExitData.value.asuntoCorreo || "");
  formData.append("contenidoCorreo", formExitData.value.contenidoCorreo || "");
  formData.append("oficinaOrigenId", oficinaDestino.value.id || "");

  const response = await sgdeaAxios.post(
    "correspondencia/comunicacion/crear",
    formData
  );

  await crearTrazabilidad({
    proceso: `COMIND${response.data.id}`,
    secuencia: response.data.idRadicado,
    estado: response.data.estado.nombre,
    descripcion: `Usuario:${auth.$state.userInfo.name} Detalle: Se han creado los datos de salida de la comunicación`,
    comentario: "Se han creado los datos de salida ",
    nombre: auth.$state.userInfo.name,
    tramite: "Comunicación",
    accion: `${auth.$state.userInfo.name} ha creado los datos de salida  ${response.data.idRadicado}`,
  });
  return response;
};

const addFormDataFiles = async () => {
  let formDataFiles = new FormData();
  if (hardcoreData.value.nodeId) {
    const index = formDatosAdjuntos.value.files.length;

    if (index > 0) {
      for (let i = 0; i < index; i++) {
        formDataFiles.append("files", formDatosAdjuntos.value.files[i]);
      }

      const response = await sgdeaAxios.post(
        `/correspondencia/comunicacion/documentos/${idComunicacion.value}?user=${auth.$state.userInfo.userid}&tipoDocumento=SALIDA`,
        formDataFiles
      );

      if (response.status == 200) {
        formDatosAdjuntos.value.files = [];
        await getDocs();
      }
    }
  }
};

const getDocs = async () => {
  const { data } = await sgdeaAxios.get(
    `/correspondencia/comunicacion/documentos/SALIDA/${idComunicacion.value}`
  );
  fileDataTable.value = data?.map((it) => ({
    formato: it.formato,
    nombre: it.nombre,
    tipo: "SALIDA",
    fecha: moment(it.fechaCargue).format("DD/MM/YYYY"),
    cargado_por: it.usuario.firstname + " " + it.usuario.lastname,
    id: it.nodeId,
    username: it.usuario.userName,
    idDoc: it.id,
  }));
};

const buildFormData = (formName) => {
  if (!formData) {
    formData = new FormData();
  }

  if (stepDataSend.value === 1 && formName === "datos-salida") {
    if (formExitData.value.copyType === 4) {
      const keyInterna = "ListacopiaInterna";
      const keyExterna = "ListacopiaExterna";

      const valueInterna = buildFormDataListDestinatarios("interno");
      const valueExterna = buildFormDataListDestinatarios("externo");

      if (formData.has(keyInterna)) formData.delete(keyInterna);
      if (formData.has(keyExterna)) formData.delete(keyExterna);

      if (valueInterna)
        formData.append(keyInterna, JSON.stringify(valueInterna));
      if (valueExterna)
        formData.append(keyExterna, JSON.stringify(valueExterna));
    } else {
      const key =
        dictionaryTypeCopy[formExitData.value.copyType] === "interno"
          ? "ListacopiaInterna"
          : "ListacopiaExterna";
      const value = buildFormDataListDestinatarios(
        dictionaryTypeCopy[formExitData.value.copyType]
      );

      if (formData.has(key)) {
        formData.delete(key);
      }

      if (value && !formData.has(key)) {
        formData.append(key, JSON.stringify(value));
      }
    }
  }

  if (stepDataSend.value > 0 && formName === "datos-salida") {
    //datos-salida-1, datos-salida-2
    formName = `${formName}-${stepDataSend.value}`;
  }

  if (mapFormData[formName]) {
    // Se recorren todas las claves del objeto 'mapFormData' correspondiente al formulario
    Object.keys(mapFormData[formName]).forEach((key) => {
      // primero obtenemos el valor del nombre del formulario del diccionario 'dictionaryFormValue' que almacena los valores formulario del template
      const formKeyValue = dictionaryFormValue[formName];
      // Luego obtenemos el valor del formulario con la clave que se encuentra en el diccionario 'mapFormData'
      let value = formKeyValue.value[mapFormData[formName][key]];
      // Si el valor existe, se añade al objeto 'formData' con su respectiva clave
      if (formData.has(key)) {
        formData.delete(key);
      }

      if (value && key === "datosGeneralesRA") {
        value = value.join("/");

        formData.append(key, value);
        return;
      }

      if (value && key === "files" && !formData.has(key)) {
        // addFormDataFiles(value, key);
        return;
      }

      if (value && !formData.has(key)) {
        value = typeof value === "object" ? value.value : value;
        if (key === "datosGeneralesNumeroDocumento") {
          value = +value;
        }

        formData.append(key, value);
        if (key === "datosSalidaDeptoId" && typeof value === "string") {
          formData.delete(key);
        }
        if (key === "datosSalidaMunicipioId" && typeof value === "string") {
          formData.delete(key);
        }
      }
    });
  }
};

const findIndexTab = (tabName) => {
  step.value = filteredTabs.findIndex((tab) => tab.key === tabName);
};

watch(
  () => tab.value,
  (newValue) => {
    findIndexTab(newValue);
  }
);
watch(
  () => tab.value,
  (newValue) => {
    if (newValue === "incluir-exp" && !hasData.value) {
      toast.error("Debes llenar los datos de salida primero");
    }
  }
);

const comeBackMove = () => {
  if (tab.value === "enviar-revision" && saveDatosGeneralesRevision.value) {
    saveDatosGeneralesRevision.value = false;
    return;
  }
  if (
    tab.value === "enviar-aprobacion" &&
    !idRadicacion.value &&
    hasSendRevision.value
  ) {
    hasSendRevision.value = false;
    return;
  }

  if (tab.value === "datos-salida" && stepDataSend.value) {
    stepDataSend.value = stepDataSend.value - 1;
    return;
  }

  if (step.value === 0) {
    showFormModalComunication.value = true;
    return;
  }

  step.value = step.value - 1;
  tab.value = filteredTabs[step.value].key;
};

const onReset = () => {
  switch (tab.value) {
    case "datos-generales":
      formGeneralData.value = {
        asunto: "",
        tipoDocumento: "",
        nombreAfectado: "",
        numeroDocumento: "",
        radNumero: [],
      };
      break;

    case "datos-salida":
      if (
        stepDataSend.value === 1 &&
        dictionaryTypeCopy[formExitData.value.copyType] === "externo"
      ) {
        isFormResetExterno.value = isFormResetExterno.value + 1;
      }
      if (
        stepDataSend.value === 1 &&
        dictionaryTypeCopy[formExitData.value.copyType] === "interno"
      ) {
        isFormResetInterno.value = isFormResetInterno.value + 1;
      }
      if (stepDataSend.value === 0) {
        formExitData.value = {
          copyType: formExitData.value.copyType,
          datosSalidaFormaEnvioId: "",
          datosSalidaTipoDocumentoDestinatarioId: "",
          datosSalidaNumeroDocumentoDestinatario: "",
          datosSalidaNombreDestinatario: "",
          datosSalidaDireccion: "",
          datosSalidaPaisId: { value: 425, label: "Colombia" },
          datosSalidaDeptoId: "",
          datosSalidaMunicipioId: "",
          datosSalidaCargoDelfuncionario: "",
          datosSalidaCorreo: "",
          datosSalidaTelefono: "",
          asunto: "",
          datosSalidaAnexos: "",
          observacion: "",
          datosSalidaTipoDocumentoAfectadoId: "",
          datosSalidaNumeroDocumentoAfectado: "",
          datosSalidaNombreAfectado: "",
        };
        break;
      }

      if (stepDataSend.value === 2) {
        break;
      }

      formExitData.value = {
        ...formExitData.value,
        copyType: "",
      };
    case "adjuntar-documento":
      formDatosAdjuntos.value = {
        files: [],
      };
      break;
    case "enviar-revision":
      if (saveDatosGeneralesRevision.value) {
        formRevision.value = {
          ...formRevision.value,
          observacionesRevision: "",
        };
        break;
      }
      formRevision.value = {
        numeroAnexos: "",
        observacionesRevision: "",
        observaciones: "",
      };
      break;
    case "enviar-aprobacion":
      if (hasSendRevision.value) {
        formRevision.value = {
          ...formRevision.value,
          observacionesRevision: "",
        };
        break;
      }
      formRevision.value = {
        numeroAnexos: "",
        observacionesRevision: "",
        observaciones: "",
      };
      break;
    default:
      break;
  }
};

const handleAcceptModal = () => {
  onReset();
  comeBackMove();
  showCancelModal.value = false;
};

const validateListDestinatarios = (type) => {
  if (type === dictionaryTypeCopy[1]) {
    return bodyCopyInterna.value.length > 0;
  }

  if (type === dictionaryTypeCopy[2]) {
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
      dictionaryTypeCopy[formExitData.value.copyType]
    );

    if (!isEmptyListDestinatarios) {
      toast.error(objResponse.lista_vacia);
      return Promise.resolve(false);
    }
  }
  const myForms = formRefs.value[formName];
  // Crear un array de promesas para validar cada formulario
  const validations = myForms.map((form) => form.value.validate());
  // Utilizar Promise.allSettled para esperar a que todas las validaciones se completen
  return Promise.allSettled(validations).then((results) => {
    // Comprobar si todos los formularios son válidos
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

const prueba = async () => {
  await handleSubmitFormData();
  await addFormDataFiles();
};

const next = async () => {
  const formName = tab.value;
  const isValid = formRefs.value[formName]
    ? await verifyFormIsValid(formName)
    : true;

  if (!isValid) return;

  if (
    formData &&
    !formData.has("datosGeneralesAsunto") &&
    formName === "datos-salida"
  ) {
    buildFormData("datos-generales");
  }

  formName !== "documento-salida" && buildFormData(formName);

  if (formName === "datos-salida" && stepDataSend.value < 1) {
    stepDataSend.value = stepDataSend.value + 1;
    return;
  }

  if (formName === "datos-salida" && stepDataSend.value == 1) {
    buildFormData("datos-salida");
    await handleSubmitFormData();
  }

  if (tab.value === "enviar-revision" && !saveDatosGeneralesRevision.value) {
    buildFormData("datos-generales");
    saveDatosGeneralesRevision.value = true;
    return;
  }
  if (tab.value === "enviar-aprobacion" && !hasSendRevision.value) {
    buildFormData("datos-generales");
    hasSendRevision.value = true;
    showModalWarning.value = true;
    return;
  }

  if (tab.value === "documento-salida") {
    state.value = "En edición";
  }

  if (formName === "datos-generales") {
    step.value = filteredTabs.findIndex(tab => tab.key === "datos-salida");
    tab.value = "datos-salida";
    return;
  }

  if (["adjuntar-documento"].includes(tab.value)) {
    await addFormDataFiles();
  }

  if (["datos-salida", "adjuntar-documento"].includes(tab.value)) {
    step.value = filteredTabs.findIndex(tab => tab.key === "documento-salida");
    tab.value = "documento-salida";
    return;
  }

  if (["trazabilidad"].includes(tab.value)) {
    step.value = filteredTabs.findIndex(tab => tab.key === "trazabilidad");
    tab.value = "trazabilidad";
    return;
  }

  step.value = step.value + 1;
  tab.value = filteredTabs[step.value].key;
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
      "Formato inválido, los formatos permitidos son (pdf, png, jpg, txt, doc, docx, xls, xlsx, mp3, mp4, avi)."
    );
  }
};

const printerDocument = async (nodeid) => {
  // const fileWanted = formDatosAdjuntos.value.files.find((fileItem) => fileItem.name === file);
  // if (!fileWanted || fileWanted.type !== 'application/pdf') return;

  const { data } = await sgdeaAxios.get(
    `/radicados/consultar_documento/${nodeid}`
  );
  const byteCharacters = atob(data.base64x);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });

  // const blob = new Blob([fileWanted], { type: fileWanted.type });
  const blobUrl = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = blobUrl;

  document.body.appendChild(iframe);
  iframe.onload = function () {
    iframe.contentWindow.print();
  };
};
const idRadicado = ref("");
const handleRejectModal = () => {
  handleAcceptModal();
};

const sendDocSalida = async () => {
  docSalidaComp.value.saveDoc2();
};

const actualizarDatosGenerales = async () => {
  const radicadosAsociados = formGeneralData.value.radNumero.join("/");

  await sgdeaAxios.put(
    `correspondencia/comunicacion/actualizarDatosGeneralesXID/${idDatosGenerales.value}`,
    {
      asunto: formGeneralData.value.asunto,
      tipoDocumentoAfectado: {
        id: formGeneralData.value.tipoDocumento,
      },
      numeroDocumentoAfectado: formGeneralData.value.numeroDocumento,
      nombreAfectado: formGeneralData.value.nombreAfectado,
      radicadoasociado: radicadosAsociados,
      numeroAnexos: formRevision.value.numeroAnexos,
      observaciones: formRevision.value.observaciones,
    }
  );
};

const disableEnviarAprobacion = ref(false);

const handleSendAprobacion = async () => {
  disableEnviarAprobacion.value = true;
  const formName = tab.value;
  const isValid = formRefs.value[formName]
    ? await verifyFormIsValid(formName)
    : true;

  if (!isValid) {
    disableEnviarAprobacion.value = false;
    return;
  }

  if (!userSeletecdByAprobacion.value) {
    toast.error(objResponse.aprobador_vacio);
    disableEnviarAprobacion.value = false;
    return;
  }

  const { data: isExpediente } = await sgdeaAxios
    .post(`/correspondencia/${hardcoreData.value.idRadicado}/expediente`)
    .catch(() => toast.error("Debe incluir el radicado a un expediente"));

  if (!isExpediente) {
    toast.error("Debe incluir el radicado a un expediente");
    disableEnviarAprobacion.value = false;
    return;
  }
  try {
    await actualizarDatosGenerales();
    // await handleSubmitFormData()

    await sgdeaAxios.post(
      `correspondencia/comunicacion/asignarAprobador/${idRadicacion.value}`,
      {
        observaciones: formRevision.value.observacionesRevision,
        usuario: userSeletecdByAprobacion.value?.id,
        asignador: auth.$state.userInfo.userid,
        oficinaDestinoId: userSeletecdByAprobacion.value?.oficinaId,
      }
    );
    //formRevision.value.observacionesRevision=''
    toast.success(objResponse.revision_success);

    await crearTrazabilidad({
      proceso: `COMIND${dataComunicacion.value.data.id}`,
      secuencia: dataComunicacion.value.data.idRadicado,
      estado: dataComunicacion.value.data.estado.nombre,
      descripcion: `Usuario:${auth.$state.userInfo.name} Aprobador:${userSeletecdByAprobacion.value?.colaborador} Detalle: Se ha enviado a aprobación la comunicación`,
      comentario: "Se ha enviado a aprobación ",
      nombre: auth.$state.userInfo.name,
      tramite: "Comunicación",
      accion: `${auth.$state.userInfo.name} ha enviado a aprobación la comunicación  ${dataComunicacion.value.data.idRadicado}`,
    });
    router.push("/");
  } catch (error) {
    toast.error(objResponse.default_error);
  }
};

const disableEnviarRevision = ref(false);

const handleSendRevision = async () => {
  disableEnviarRevision.value = true;
  const formName = tab.value;
  const isValid = formRefs.value[formName]
    ? await verifyFormIsValid(formName)
    : true;

  if (!isValid) {
    disableEnviarRevision.value = false;
    return;
  }

  if (!userSeletecdByRevision.value) {
    toast.error(objResponse.aprobador_asigandor_vacio);
    disableEnviarRevision.value = false;
    return;
  }

  const { data: isExpediente } = await sgdeaAxios.post(
    `/correspondencia/${hardcoreData.value.idRadicado}/expediente`
  );

  if (!isExpediente) {
    toast.error("Debe incluir el radicado a un expediente");
    disableEnviarRevision.value = false;
    return;
  }
  try {
    await actualizarDatosGenerales();
    // await handleSubmitFormData()

    await sgdeaAxios.post(
      `correspondencia/comunicacion/asignar/${idRadicacion.value}`,
      {
        observaciones: formRevision.value.observacionesRevision,
        usuario: userSeletecdByRevision.value,
        asignador: auth.$state.userInfo.userid,
      }
    );
    formRevision.value.observacionesRevision = "";
    toast.success(objResponse.asignacion_success);
    hasSendRevision.value = true;
    state.value = "Por revisar";
    step.value = step.value + 1;
    tab.value = filteredTabs[step.value].key;
    const asignado = (
      await sgdeaAxios.get(`/usuarios/${userSeletecdByRevision.value}`)
    ).data;

    await crearTrazabilidad({
      proceso: `COMIND${dataComunicacion.value.data.id}`,
      secuencia: dataComunicacion.value.data.idRadicado,
      estado: dataComunicacion.value.data.estado.nombre,
      descripcion: `Usuario:${auth.$state.userInfo.name} Revisor:${asignado.fullname} Detalle: Se ha enviado a revisión la comunicación`,
      comentario: "Se ha enviado a revisión ",
      nombre: auth.$state.userInfo.name,
      tramite: "Comunicación",
      accion: `${auth.$state.userInfo.name} ha enviado a revisión la comunicacion  ${dataComunicacion.value.data.idRadicado}`,
    });

    tab.value = filteredTabs[step.value].key;
    toast.warning("Recuerda enviarlo a aprobación para cerrar el proceso")
  } catch (error) {
    toast.error(objResponse.default_error);
  }
};

const handleSubmitEliminarRadicacion = async () => {
  if (idRadicacion.value === null) {
    toast.error("No se puede eliminar la comunicación, aun no ha sido creada");
    return;
  }
  try {
    await sgdeaAxios.put(
      `correspondencia/comunicacion/actualizarEstado/${idRadicacion.value}?idNuevoEstado=2`
    );
    toast.success(objResponse.eliminated);
    router.push("/");
  } catch (error) {
    toast.error(objResponse.default_error);
    return;
  }
};

const handleCancelBtn = () => {
  if (tab.value == "datos-salida" && stepDataSend.value > 0) {
    handleAcceptModal();
    return;
  }
  if (
    ["datos-generales", "enviar-aprobacion", "datos-salida"].includes(tab.value)
  ) {
    showCancelModal.value = true;
    return;
  }
  handleAcceptModal();
};

const confirmCancel = () => {
  showCancelModal.value = true;
};

const handleClickRegresar = () => {
  step.value = 2;
  tab.value = filteredTabs[step.value].key;
};

const handleDelteFileTable = async (filesId) => {
  // formDatosAdjuntos.value.files= formDatosAdjuntos.value.files.filter(file=>filesId.includes(file.name))
  try {
    const response = await sgdeaAxios.delete(
      "/correspondencia/comunicacion/eliminarDocumentos",
      {
        headers: {
          "Content-Type": "application/json",
        },
        data: filesId,
      }
    );
    if (response.status == 200) {
      await getDocs();
    }
  } catch (error) {
    toast.error("Ha ocurrido un error");
  }
};
const dataComunicacion = ref();
const internalCopyComunication = ref();
const externalCopyComunication = ref();
const arrayCopyInternaComunication = ref();
const arrayCopyExternaComunication = ref();
const arrayAllCopysComunication = ref();

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

const getData = async () => {
  dataComunicacion.value = await sgdeaAxios.get(
    `/correspondencia/obtenerCorrespondenciaComunicacion/${idRadicado.value}`
  );
  try {
    internalCopyComunication.value = (
      await sgdeaAxios.get(
        `/correspondencia/comunicacion/copiaInterna/${dataComunicacion.value.data.datosSalida?.id}`
      )
    ).data;
  } catch (error) {
    console.error(error);
  }
  try {
    externalCopyComunication.value = (
      await sgdeaAxios.get(
        `/correspondencia/comunicacion/copiaExterna/${dataComunicacion.value.data.datosSalida?.id}`
      )
    ).data;
  } catch (error) {
    console.error(error);
  }

  if (
    internalCopyComunication.value.length > 0 ||
    externalCopyComunication.value.length > 0
  ) {
    arrayCopyInternaComunication.value = internalCopyComunication.value.map(
      (item) => formatCopyInterna(item)
    );
    arrayCopyExternaComunication.value = externalCopyComunication.value.map(
      (item) => formatCopyExterna(item)
    );
    arrayAllCopysComunication.value = [...arrayCopyInternaComunication.value, ...arrayCopyExternaComunication.value];
    dataFooter.value.Copia = arrayAllCopysComunication.value;
  } else {
    arrayCopyExternaComunication.value = [];
    arrayCopyInternaComunication.value = [];
    arrayAllCopysComunication.value = 0;
  }

  if (dataCom.value && dataCom.value.tipoComunicacion === 1) {
    internalCom.value.radicado = radicadoId.value ?? "";
  }

  await getDocSalida();
  await getTrazabilidad();
};
watch(
  () => tab.value,
  async (newValue) => {
    if (newValue === "trazabilidad" && hasData.value) {
      await getTrazabilidad();
    }
  }
);

const handleSubmitFormData = async () => {
  if (idRadicacion.value) return;
  try {
    const { data } = await submitFormData();
    idRadicacion.value = data.id;
    radicadoId.value = data.idRadicado;
    toast.success(`El radicado ${data.idRadicado} ha sido creado exitosamente`)
    //toast.success(`Datos guardados exitosamente`);
    setTimeout(() => {
      sendDocSalida();
    }, 2000);

    idDatosGenerales.value = data.datosGenerales.id;
    const { data: codigo } = await sgdeaAxios.get(
      `/correspondencia/buscarCaseIDComunicacionXRadicado/${data.idRadicado}`
    );
    idComunicacion.value = data.id;

    idRadicado.value = data.idRadicado;
    await addFormDataFiles();
    await getData();
    hardcoreData.value = {
      codigoProceso: codigo.casoBonitaId,
      idRadicado: data.idRadicado,
      nodeId: data.nodeId,
      informacionProceso: {
        numeroDocumentoAfectado: data.datosGenerales.numeroDocumentoAfectado,
      },
      id: dataComunicacion.value.data.id,
      isMasivo: dataComunicacion.value.data.isMasivo,
    };
    return true;
  } catch (error) {
    throw new Error(objResponse.campos_obligatorios);
  }
};

// watch(()=>formDatosAdjuntos.value.files, (files) => {
//   if(files.length === 0){
//     fileDataTable.value=[]
//     return
//   }
//   fileDataTable.value=files.map(file=>({
//     id:file.name,
//     nombre:file.name,
//     tipo:'De gestión',
//     fecha: `${formatDateTimeStandTwo(new Date())} ${currentHourWithoutSec(new Date())}`,
//     cargado_por:`${firstname} ${lastname}`,
//     formato:file.name.split('.')[1]
//   }))
// });

const onChangeDocType = (value) => {
  const { idsSelected, esSalida } = value;

  fileDataTable.value = fileDataTable.value.map((item) => {
    if (idsSelected.includes(item.id)) {
      return {
        ...item,
        tipo: esSalida ? "De salida" : "De gestión",
      };
    }
    return item;
  });
};

//utils
const getLabel = (value, options) => {
  const option = options.find((option) => option.value === value);
  return option ? option.label : "";
};

const filterRadicadosAsociados = (val, update) => {
  if (val == "") {
    update(() => {
      asociadosOptions.value = asociadosOptionsStatic.value;
    });
    return;
  }
  update(() => {
    asociadosOptions.value = asociadosOptionsStatic.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  });
};

const handleClickSaveChangesDoc = async () => {
  const pattern = /<p[^>]*>([\s\S]*?)<\/p>/i;
  //const matches = updateHtmldoc.value[0].match(pattern);
  if (hardcoreData.value.idRadicado) {
    await sendDocSalida();
  }

  dataSave.value = updateHtmldoc.value[0];
  // }
  toast.success("Guardado exitoso");
};

watch(
  () => formGeneralData.value.tipoDocumento,
  async (value) => {
    if (value === 12) {
      formGeneralData.value.numeroDocumento = '';
      isDisabled.value = true;
      return
    }
    isDisabled.value = false;
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
