<template>
  <section class="tw-py-8 tw-bg-bg">
    <router-link to="/home">
      <span
        class="tw-text-primary"
        style="text-decoration: none; cursor: pointer"
      >
        <q-icon size="1.5em" name="chevron_left" color="primary" />
        <b> Volver </b>
      </span>
    </router-link>
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
      <div class="tw-flex tw-justify-between tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold">Radicar Cuenta de Cobro</h1>
      </div>
      <q-form greedy ref="formValidate">
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <q-expansion-item
            expand-separator
            id="Datos generales"
            default-opened
          >
            <template v-slot:header>
              <div class="col row">
                <h2 class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">
                  Información Básica Radicación
                </h2>
              </div>
            </template>

            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Dependencia *</label>
                  <q-select
                    v-model="form.dependencia"
                    input-debounce="0"
                    map-options
                    :options="filteredOptionsDependencias"
                    label="Seleccione"
                    dense
                    outlined
                    class="tw-rounded-lg"
                    :rules="[inputRequired]"
                    @filter="selectOptionsFilterFn"
                    use-input
                    fill-input
                    hide-selected
                  >
                  </q-select>
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label"
                    >Responsable del Proceso (Asignador)</label
                  >
                  <q-select
                    v-model="form.responsable"
                    label="Seleccione"
                    input-debounce="0"
                    map-options
                    emit-value
                    :options="optionsResponsable"
                    dense
                    outlined
                    class="tw-rounded-lg"
                  >
                  </q-select>
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Tipo de Trámite *</label>
                  <q-select
                    v-model="form.tipoTramite"
                    input-debounce="0"
                    label="Seleccione"
                    :options="tipoTramite"
                    dense
                    outlined
                    class="tw-rounded-lg"
                    :rules="[inputRequired]"
                    disable
                  >
                  </q-select>
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Canal de Recepción *</label>
                  <q-select
                    v-model="form.canal"
                    input-debounce="0"
                    label="Seleccione"
                    :options="[
                      {
                        value: 'Correo electrónico',
                        label: 'Correo electrónico',
                      },
                    ]"
                    :rules="[inputRequired]"
                    dense
                    outlined
                    class="tw-rounded-lg"
                  >
                  </q-select>
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Tipo de Documento *</label>
                  <q-select
                    v-model="form.tipoDocumento"
                    label="Seleccione"
                    input-debounce="0"
                    :options="tipoDocumento"
                    @update:model-value="() => (form.numeroDocumento = '')"
                    dense
                    outlined
                    class="tw-rounded-lg"
                    :rules="[inputRequired, (val) => maxLengthInput(15, val)]"
                  >
                  </q-select>
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label"
                    >Número de Identificación *</label
                  >
                  <q-input
                    v-model="form.numeroDocumento"
                    label="Inserte"
                    input-debounce="0"
                    :rules="[
                      inputRequired,
                      form.tipoDocumento?.value === 'Pasaporte' ? alphanumeric : (v: string) => onlyNumbers(v),
                      (val) => maxLengthInput(15, val),
                    ]"
                    dense
                    outlined
                    class="tw-rounded-lg"
                    @blur="blurSearchUser"
                  >
                  </q-input>
                </span>
              </div>
              <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" v-if="!isNit">
                <span class="tw-w-full">
                  <label class="tw-text-label">Primer Apellido *</label>
                  <q-input
                    v-model="form.primerApellido"
                    label="Inserte"
                    dense
                    filled
                    class="tw-rounded-lg"
                    :rules="[inputRequired]"
                    readonly
                  />
                </span>
              </div>
              <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" v-if="!isNit">
                <span class="tw-w-full">
                  <label class="tw-text-label">Segundo Apellido *</label>
                  <q-input
                    v-model="form.segundoApellido"
                    label="Inserte"
                    dense
                    filled
                    :rules="[inputRequired]"
                    class="tw-rounded-lg"
                    readonly
                  />
                </span>
              </div>
              <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" v-if="!isNit">
                <span class="tw-w-full">
                  <label class="tw-text-label">Primer Nombre *</label>
                  <q-input
                    v-model="form.primerNombre"
                    label="Inserte"
                    dense
                    filled
                    class="tw-rounded-lg"
                    :rules="[inputRequired]"
                    readonly
                  />
                </span>
              </div>
              <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" v-if="!isNit">
                <span class="tw-w-full">
                  <label class="tw-text-label">Otros Nombres </label>
                  <q-input
                    v-model="form.otrosNombres"
                    label="Inserte"
                    :rules="[]"
                    dense
                    filled
                    class="tw-rounded-lg"
                    readonly
                  />
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" v-if="isNit">
                <span class="tw-w-full">
                  <label class="tw-text-label">Razón Social </label>
                  <q-input
                    v-model="form.razonSocial"
                    label="Inserte"
                    :rules="[]"
                    dense
                    filled
                    class="tw-rounded-lg"
                    readonly
                  />
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" v-if="isNit">
                <span class="tw-w-full">
                  <label class="tw-text-label">Nombre Comercial </label>
                  <q-input
                    v-model="form.nombreComercial"
                    label="Inserte"
                    :rules="[]"
                    dense
                    filled
                    class="tw-rounded-lg"
                    readonly
                  />
                </span>
              </div>
            </div>
          </q-expansion-item>
        </q-card>
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <q-expansion-item
            expand-separator
            id="Datos generales"
            default-opened
          >
            <template v-slot:header>
              <div class="col row">
                <h2 class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">
                  Información Documento Soporte Equivalente
                </h2>
              </div>
            </template>

            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-12">
                <span class="tw-w-full">
                  <label class="tw-text-label">Tipo de Bien o Servicio *</label>
                  <q-select
                    v-model="form.tipoBienServicio"
                    label="Seleccione"
                    input-debounce="0"
                    map-options
                    emit-value
                    :options="tipoBienServicioOptions"
                    dense
                    outlined
                    class="tw-rounded-lg"
                    :rules="[inputRequired]"
                  >
                  </q-select>
                </span>
              </div>
              <div class="col-12">
                <CommentTextArea v-model="form.observacion" :is-required="true" :max-length="10000" label="Observación"/>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Valor *</label>
                  <q-input
                    label="Inserte"
                    v-model="form.valor"
                    prefix="$"
                    :rules="[
                      inputRequired,
                      onlyNumbers,
                      (v) => maxLengthInput(19, v),
                      (v) => greaterThan(0, v),
                    ]"
                    outlined
                    class="tw-rounded-lg"
                    dense
                    mask="#.###.###.###.###"
                    unmasked-value
                    reverse-fill-mask
                    maxlength="19"
/>
                </span>
                </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Aprobador *</label>
                  <q-select
                    label="Seleccione"
                    v-model="form.aprobador"
                    input-debounce="0"
                    :options="options"
                    dense
                    outlined
                    class="tw-rounded-lg"
                    :rules="[inputRequired]"
                  >
                  </q-select>
                </span>
              </div>
            </div>

            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-mx-md">
              <span class="tw-w-full">
                <label class="tw-text-label">Valor en Letras *</label>
                <q-input
                  label="Inserte"
                  v-model="form.valorLetras"
                  input-debounce="0"
                  :rules="[inputRequired]"
                  dense
                  outlined
                  class="tw-rounded-lg"
                  disable
                />
              </span>
            </div>
          </q-expansion-item>
        </q-card>
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <q-expansion-item
            expand-separator
            id="Datos generales"
            default-opened
          >
            <template v-slot:header>
              <div class="col row">
                <h2 class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">
                  Información de la radicación
                </h2>
              </div>
            </template>

            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">
                    FECHA / Sistema al Radicar *
                  </label>
                  <DatePicker
                    mask="DD/MM/YYYY"
                    label="dd / mm / aaaa"
                    v-model:input-data-prop="form.fechaRadicar"
                    :rules="[inputRequired]"
                    disable
                  />
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label"
                    >HORA / Sistema al Radicar *</label
                  >
                  <q-input
                    class="custom-field"
                    required
                    v-model="formattedTime"
                    disable
                    dense
                    outlined
                  />
                </span>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Estado del Trámite *</label>
                  <q-select
                    label="Seleccione"
                    v-model="form.estado"
                    map-options
                    emit-value
                    input-debounce="0"
                    :options="estados"
                    :rules="[inputRequired]"
                    dense
                    outlined
                    class="tw-rounded-lg"
                    disable
                  >
                  </q-select>
                </span>
              </div>
            </div>
          </q-expansion-item>
        </q-card>
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <q-expansion-item
            expand-separator
            id="Datos generales"
            default-opened
          >
            <template v-slot:header>
              <div class="col row">
                <h2 class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">
                  Cargue de Documentos
                </h2>
              </div>
            </template>

            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-12">
                <span class="custom-label text-weight-bold"
                  >Cuenta de Cobro *</span
                >
                <q-file
                  name="croquisAccidente"
                  ref="myFile"
                  v-model="form.cuentaCobro"
                  flat
                  label=""
                  dense
                  outlined
                  clearable
                  clear-icon="close"
                  class="mb-3"
                  :max-file-size="50000000"
                  input-style="opacity: 0"
                  accept=".pdf"
                  :filter="allowedTypes"
                  @rejected="rejectedTypes"
                  :rules="[inputRequired]"
                >
                  <template v-slot:prepend>
                    <q-icon name="check_circle" color="grey-5" />
                  </template>
                  <template v-slot:file="{ file }">
                    <q-chip
                      outline
                      square
                      color="secondary"
                      class="q-my-sm"
                      style="
                        border-radius: 5px;
                        border: 1px solid #e3e4e5;
                        background: #fff;
                      "
                    >
                      <q-avatar size="24px" square>
                        <img v-lazy :data-url="tipoIcon(file.type)" alt="docIcon" />
                      </q-avatar>

                      <div class="fileName relative-position">
                        {{ file.name }}
                      </div>
                      <q-tooltip anchor="top middle" self="bottom middle">
                        {{ file.name }}
                      </q-tooltip>
                    </q-chip>
                  </template>
                  <template v-slot:append>
                    <q-icon
                      name="attach_file"
                      color="grey-6"
                      @click="openFile"
                      class="tw-cursor-pointer"
                    />
                  </template>
                </q-file>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-12">
                <span class="custom-label text-weight-bold"
                  >Pagos de Seguridad Social *</span
                >
                <q-file
                  name="croquisAccidente"
                  ref="myFile2"
                  v-model="form.pagoSeguridadSocial"
                  flat
                  label=""
                  dense
                  outlined
                  clearable
                  clear-icon="close"
                  class="mb-3"
                  input-style="opacity: 0"
                  max-file-size="50000000"
                  accept=".pdf"
                  :filter="allowedTypes"
                  @rejected="rejectedTypes"
                  :rules="[inputRequired]"
                >
                  <template v-slot:prepend>
                    <q-icon name="check_circle" color="grey-5" />
                  </template>
                  <template v-slot:file="{ file }">
                    <q-chip
                      outline
                      square
                      color="secondary"
                      class="q-my-sm"
                      style="
                        border-radius: 5px;
                        border: 1px solid #e3e4e5;
                        background: #fff;
                      "
                    >
                      <q-avatar size="24px" square>
                        <img v-lazy :data-url="tipoIcon(file.type)" alt="docIcon" />
                      </q-avatar>

                      <div class="fileName relative-position">
                        {{ file.name }}
                      </div>
                      <q-tooltip anchor="top middle" self="bottom middle">
                        {{ file.name }}
                      </q-tooltip>
                    </q-chip>
                  </template>
                  <template v-slot:append>
                    <q-icon
                      name="attach_file"
                      color="grey-6"
                      @click="openFile2"
                      class="tw-cursor-pointer"
                    />
                  </template>
                </q-file>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-12">
                <span class="custom-label text-weight-bold tw-capitalize"
                  >Excel control entrega soportes</span
                >
                <q-file
                  name="croquisAccidente"
                  ref="myFile3"
                  v-model="form.entregaSoportes"
                  flat
                  label=""
                  dense
                  outlined
                  clearable
                  clear-icon="close"
                  class="mb-3"
                  input-style="opacity: 0"
                  max-file-size="50000000"
                  accept=".xlsx, .xls"
                  :filter="allowedTypes"
                  @rejected="rejectedTypes"
                >
                  <template v-slot:prepend>
                    <q-icon name="check_circle" color="grey-5" />
                  </template>
                  <template v-slot:file="{ file }">
                    <q-chip
                      outline
                      square
                      color="secondary"
                      class="q-my-sm"
                      style="
                        border-radius: 5px;
                        border: 1px solid #e3e4e5;
                        background: #fff;
                      "
                    >
                      <q-avatar size="24px" square>
                        <img v-lazy :data-url="tipoIcon(file.type)" alt="docIcon" />
                      </q-avatar>

                      <div class="fileName relative-position">
                        {{ file.name }}
                      </div>
                      <q-tooltip anchor="top middle" self="bottom middle">
                        {{ file.name }}
                      </q-tooltip>
                    </q-chip>
                  </template>
                  <template v-slot:append>
                    <q-icon
                      name="attach_file"
                      color="grey-6"
                      @click="openFile3"
                      class="tw-cursor-pointer"
                    />
                  </template>
                </q-file>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-12">
                <span class="custom-label text-weight-bold tw-capitalize"
                  >Otros tipos documentales
                </span>
                <q-file
                  name="croquisAccidente"
                  ref="otrosTiposInput"
                  multiple
                  append
                  v-model="form.otrosTiposDocumentales"
                  flat
                  label=""
                  dense
                  outlined
                  clearable
                  clear-icon="close"
                  max-file-size="50000000"
                  class="mb-3"
                  input-style="opacity: 0"
                  accept="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
                  max-files="10"
                  :filter="allowedTypes"
                  @rejected="rejectedTypesOtros"
                >
                  <template v-slot:prepend>
                    <q-icon name="check_circle" color="grey-5" />
                  </template>
                  <template v-slot:file="{ file }">
                    <q-chip
                      outline
                      square
                      color="secondary"
                      class="q-my-sm"
                      style="
                        border-radius: 5px;
                        border: 1px solid #e3e4e5;
                        background: #fff;
                      "
                    >
                      <q-avatar size="24px" square>
                        <img v-lazy :data-url="tipoIcon(file.type)" alt="docIcon" />
                      </q-avatar>

                      <div class="fileName relative-position">
                        {{ file.name }}
                      </div>
                      <q-tooltip anchor="top middle" self="bottom middle">
                        {{ file.name }}
                      </q-tooltip>
                    </q-chip>
                  </template>
                  <template v-slot:append>
                    <q-icon
                      name="attach_file"
                      color="grey-6"
                      @click="openFile4"
                      class="tw-cursor-pointer"
                    />
                  </template>
                </q-file>
              </div>
            </div>
          </q-expansion-item>
        </q-card>
        <div class="col row justify-center q-gutter-x-md q-my-md">
          <q-btn
            color="accent"
            textColor="secondary"
            label="Cancelar"
            style="
              width: 130px;
              height: 40px;
              border-radius: 8px;
              font-size: 16px;
            "
            type="reset"
            no-caps
            :disable="alreadyRadicated"
            @click="cancelModal = true"
          />

          <q-btn
            color="primary"
            label="Radicar"
            style="
              width: 130px;
              height: 40px;
              border-radius: 8px;
              font-size: 16px;
            "
            @click="radicarModal = true"
            :loading="handleSubmitIsLoading"
          />
        </div>
      </q-form>
    </main>
    <Modal
      v-model="cancelModal"
      title="¡Espera un momento!"
      :is-success="false"
      text-button="Si"
      @handleAccept="resetForm"
      cancel-button
      text="Al cancelar la acción perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
      @close-modal="cancelModal = false"
      text-button-cancel="No"
      type="button"
    />
    <Modal
      v-model="successModal"
      title="Radicación exitosa"
      :text="`Trámite de radicación de documento de Cuenta de cobro generado correctamente, número de radicado ${downloadSec}. El documento pasará a la bandeja del asignador para continuar el proceso`"
      is-success
      text-button="Finalizar"
      @handleAccept="router.push('/home')"
      cancel-button
      text-button-cancel="Descargar"
      @close-modal="handleDownloadRadicacionDocument"
    />
    <Modal
      v-model="radicarModal"
      title="¡Espera un momento!"
      :is-success="false"
      @handleAccept="handleSubmit"
      cancel-button
      textButtonCancel="No"
      textButton="Si"
      text=" ¿Estas seguro de radicar la información ingresada?"
      @close-modal="radicarModal = false"
      type="button"
    />
  </section>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { type Ref, ref, onMounted, watch } from "vue";
import { currentHour } from "src/helpers/formtDate";
import { numberToHumanText } from "src/helpers/number";
import {
  maxLengthInput,
  alphanumeric,
  onlyNumbers,
  greaterThan,
  inputRequired,
} from "src/helpers/validations";
import DatePicker from "src/components/FormFields/datePickerComponent.vue";

// @ts-ignore
import pdfIcon from "src/assets/pdf.svg";
// @ts-ignore
import excelIcon from "src/assets/excel.svg";
// @ts-ignore
import docxIcon from "src/assets/word.svg";
// @ts-ignore
import imgIcon from "src/assets/img.svg";
import xml from "src/assets/xml.svg";

import { sgdeaAxios } from "src/services";
import { DocumentoRadicado, SelectInput } from "src/interfaces";
import { tipoDocumento } from "src/constantes/options";
import moment from "moment";
import Modal from "components/Modal/Modal.vue";
import { toast } from "src/helpers/toast";
import { useAuthStore } from "src/stores/auth.store";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import CommentTextArea from  "src/shared/components/TextArea/Comments.vue";

const router = useRouter();
const successModal = ref<boolean>(false);
const formValidate = ref();
const generatedDocId = ref<string | null>(null);
const downloadSec = ref<string | null>(null);
const handleSubmitIsLoading = ref<boolean>(false);
const cancelModal = ref(false);
const otrosTiposInput = ref();
const formattedTime = ref<string>(moment().format("hh:mm a"));
const alreadyRadicated = ref<boolean>(false);
const radicarModal = ref(false);
const myFile = ref();
const myFile2 = ref();
const myFile3 = ref();

const openFile = () => {
  myFile.value.pickFiles();
};

const openFile2 = () => {
  myFile2.value.pickFiles();
};

const openFile3 = () => {
  myFile3.value.pickFiles();
};

const openFile4 = () => {
  otrosTiposInput.value.pickFiles();
};

const optionsResponsable = ref([]);

const tipoIcon = (tipo) => {
  if (tipo === "application/pdf") return pdfIcon;
  if (
    tipo === "application/vnd.ms-excel" ||
    tipo === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )
    return excelIcon;
  if (
    tipo ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    tipo === "application/msword"
  )
    return docxIcon;

  if (
    tipo ===
      "image/jpg" ||
    tipo === "image/png" || tipo === "image/jpeg"
  )
    return imgIcon;

  if (tipo === "text/xml") return xml;
};

const optionsDependencias = ref<SelectInput[]>([]);
const filteredOptionsDependencias = ref<SelectInput[]>([]);
optionsDependencias.value.sort((a, b) => a.label.localeCompare(b.label));

const isNit = ref(false);

const form = ref({
  dependencia: "",
  responsable: "",
  razonSocial: "",
  nombreComercial: "",
  tipoTramite: {
    label: "Cuenta de Cobro o Documento Equivalente Soporte (DSE)",
    value: "Cuenta de Cobro o Documento Equivalente Soporte (DSE)",
  },
  canal: "",
  tipoDocumento: "",
  primerApellido: "",
  segundoApellido: "",
  primerNombre: "",
  otrosNombres: "",

  tipoBienServicio: "",
  observacion: "",
  valor: 0,
  valorLetras: "",
  aprobador: "",

  fechaRadicar: moment().format("DD-MM-YYYY"),
  horaInicio: currentHour(new Date()),
  estado: {
    value: "Por asignar",
    label: "Por asignar",
  },

  sec: "",

  cuentaCobro: null,
  pagoSeguridadSocial: null,
  entregaSoportes: null,
  otrosTiposDocumentales: null,

  numeroDocumento: "",
});
watch(
  () => form.value.tipoDocumento,
  (newVal) => {
    isNit.value = newVal.label === "Número de Identificación Tributaria NIT";
  }
);
let filesUpload: Ref<any> = ref({});

async function checkRole() {
  if (
    auth.$state.userInfo.role.includes("Radicador") ||
    auth.$state.userInfo.role === "Administrador de Trámite" ||
    auth.$state.userInfo.role === "Administrador Master"
  ) {
    //
  } else {
    router.push("/home");
  }
}

watch(
  () => form.value,
  async (newVal) => {
    if (newVal.entregaSoportes instanceof File && newVal.entregaSoportes.name) {
      const key = "entregaSoportes";

      if (
        Object.values({
          ...filesUpload.value,
          entregaSoportes: undefined,
        }).some((x) => x == newVal[key].name)
      ) {
        toast.error("Ya existe un archivo con el mismo nombre");
        form.value[key] = null; // Clear the file input
      } else {
        filesUpload.value[key] = form.value[key].name;
      }
    } else {
      delete filesUpload.value.entregaSoportes;
    }

    if (newVal.cuentaCobro instanceof File && newVal.cuentaCobro.name) {
      const key = "cuentaCobro";

      if (
        Object.values({ ...filesUpload.value, cuentaCobro: undefined }).some(
          (x) => x == newVal[key].name
        )
      ) {
        toast.error("Ya existe un archivo con el mismo nombre");
        form.value[key] = null; // Clear the file input
      } else {
        filesUpload.value[key] = form.value[key].name;
      }
    } else {
      delete filesUpload.value.cuentaCobro;
    }

    if (
      newVal.pagoSeguridadSocial instanceof File &&
      newVal.pagoSeguridadSocial.name
    ) {
      const key = "pagoSeguridadSocial";
      if (
        Object.values({
          ...filesUpload.value,
          pagoSeguridadSocial: undefined,
        }).some((x) => x == newVal[key].name)
      ) {
        toast.error("Ya existe un archivo con el mismo nombre");
        form.value[key] = null; // Clear the file input
      } else {
        filesUpload.value[key] = form.value[key].name;
      }
    } else {
      delete filesUpload.value.pagoSeguridadSocial;
    }

    if (
      newVal.otrosTiposDocumentales instanceof Array &&
      newVal.otrosTiposDocumentales.length > 0
    ) {
      const key = "otrosTiposDocumentales";

      newVal.otrosTiposDocumentales.forEach((file) => {
        if (file instanceof File && file.name) {
          if (
            Object.values({ ...filesUpload.value, [key]: undefined }).some(
              (x) => x == file.name
            )
          ) {
            toast.error("Ya existe un archivo con el mismo nombre");
            const index = form.value[key].indexOf(file);
            form.value[key].splice(index, 1); // Remove the file from the array
          } else {
            filesUpload.value[key] = filesUpload.value[key] || [];
            filesUpload.value[key].push(file.name);
          }
        }
      });
    } else {
      delete filesUpload.value.otrosTiposDocumentales;
    }
  },
  { deep: true }
);

watch(
  () => form.value.valor,
  (newNumber) => {
    if (String(newNumber).startsWith("0") && String(newNumber) !== "0") {
      let format = parseFloat(String(newNumber).substring(1));

      if (isNaN(format)) {
        format = 0;
      }

      form.value.valor = format;
    }

    form.value.valorLetras = numberToHumanText(newNumber);
  }
);

const getData = async () => {
  getAllRegisters();
};

const selectOptionsFilterFn = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      filteredOptionsDependencias.value = optionsDependencias.value;
    });
    return;
  }
  update(() => {
    filteredOptionsDependencias.value = optionsDependencias.value.filter(
      (option) => {
        return option.label.toLowerCase().includes(val.toLowerCase());
      }
    );
  });
};

onMounted(() => {
  checkRole();
  getDependencies();
  getData();
});

const blurSearchUser = async (val) => {
  try {
    const response = await sgdeaAxios.get(
      `/facturacion/getVendeCto/${form.value.numeroDocumento}`
    );
    form.value.nombreComercial = response.data.nombreComercial;
    form.value.razonSocial = response.data.razonSocial;

    if (response.data.mens.includes("Natural")) {
      form.value.primerApellido = response.data.papellido;
      form.value.segundoApellido = response.data.sapellido;
      form.value.primerNombre = response.data.pnombre;
      form.value.otrosNombres = response.data.onombre;

      form.value.razonSocial = "";
      form.value.nombreComercial = "";
      isNit.value = false;
    } else {
      form.value.razonSocial = response.data.razonSocial;
      form.value.nombreComercial = response.data.nombreComercial;

      form.value.primerApellido = "";
      form.value.segundoApellido = "";
      form.value.primerNombre = "";
      form.value.otrosNombres = "";
      isNit.value = true;
    }

    return "";
  } catch (e) {
    console.error(e);
    toast.error(
      "Documento de identificación no existe, por favor solicitar la creación del usuario que no se encuentra registrado"
    );
    form.value.primerApellido = "";
    form.value.segundoApellido = "";
    form.value.primerNombre = "";
    form.value.otrosNombres = "";
    form.value.razonSocial = "";
    form.value.nombreComercial = "";
  }
};

watch(
  () => form.value.dependencia,
  async (newVal) => {
    const response = await sgdeaAxios.get(
      `/api/usuarios/rolYSeccionSubseccion/${newVal.value}?rolName=Asignador Responsable`
    );
    optionsResponsable.value = response.data
      .filter((responsable: any) => responsable.enabled)
      .map((responsable: any) => ({
        label: responsable.firstname + " " + responsable.lastname,
        value: responsable.id,
      }));
    form.value.responsable = "";
  }
);

const tipoTramite = ref<SelectInput[]>([
  {
    label: "Crear Adquirente",
    value: "Crear Adquirente",
  },
  {
    label: "Cuenta de Cobro o Documento Equivalente Soporte (DSE)",
    value: "Cuenta de Cobro o Documento Equivalente Soporte (DSE)",
  },
  {
    label: "Factura Emisión Manual",
    value: "Factura Emisión Manual",
  },
  {
    label: "Facturas Administrativas",
    value: "Facturas Administrativas",
  },
  {
    label: "Nota Crédito / Nota Débito",
    value: "Nota Crédito / Nota Débito",
  },
]);

const handleDownloadRadicacionDocument = async () => {
  try {
    const { data: listDocs } = await sgdeaAxios.get<any>(
      `/radicados/obtenerHijosPorNodo/${generatedDocId.value}`
    );

    const docRadicado = listDocs.list.entries?.find((it) => {
      const entryName = it.entry.name;
      return entryName && entryName.startsWith(downloadSec.value);
    });

    const { data } = await sgdeaAxios.get<DocumentoRadicado>(
      `/radicados/consultar_documento/${docRadicado.entry.id}`
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
    link.download = String(downloadSec.value);

    link.click();

    URL.revokeObjectURL(blobUrl);

    router.push("/home");
  } catch (error) {
    toast.error("Ocurrió un error inesperado.")
  }
};
const auth = useAuthStore();

async function getDependencies() {
  const { data } = await sgdeaAxios.get("/seccionSubSeccion");
  optionsDependencias.value = data
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .map((dependencia: any) => ({
      label: dependencia.nombre,
      value: dependencia.idSeccionSubSeccion,
    }));
  filteredOptionsDependencias.value = optionsDependencias.value;
}

const handleSubmit = async () => {
  handleSubmitIsLoading.value = true;

  if (await formValidate.value.validate()) {
    alreadyRadicated.value = true;
    let newFiles = Object.values(filesUpload.value);
    if (newFiles.some((val, i) => newFiles.indexOf(val) !== i)) {
      toast.error("Tiene archivos duplicados");
      handleSubmitIsLoading.value = false;
      return;
    }
    if (form.value.pagoSeguridadSocial.name !== form.value.cuentaCobro.name) {
      const formData = new FormData();
      for (const key in form.value) {
        if (form.value[key] instanceof File) {
          formData.append("files", form.value[key]);
        } else if (
          form.value[key] instanceof Array &&
          form.value[key].length > 0
        ) {
          form.value[key].forEach((file) => {
            if (file instanceof File) {
              formData.append("files", file);
            }
          });
        } else if (key === "fechaRadicar" || key === "horaInicio") {
          formData.append("fecha_hora", moment().format("MM/DD/YYYY HH:mm"));
        } else if (key == "dependencia") {
          formData.append(key, form.value[key].label);
        } else if (key === "tipoBienServicio") {
          formData.append(key, form.value[key]);
        } else if (
          key === "aprobador" ||
          key === "canal" ||
          key === "estado" ||
          key === "tipoDocumento" ||
          key === "tipoTramite"
        ) {
          // @ts-ignore
          formData.append(key, form.value[key].value);
        } else {
          formData.append(key, String(form.value[key]));
        }
      }

      formData.append("radicadorId", auth.$state.userInfo.userid);
      formData.append("oficinaIdAprobador", form.value.aprobador.oficina);

      try {
        const response = await sgdeaAxios.post(
          "/facturacion/crearCuentaCobro",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if ([200].includes(response.status)) {
          successModal.value = true;
        } else {
          toast.error(
            "Ocurrió un error inesperado."
          );
        }

        downloadSec.value = response.data?.cto?.sec as string;
        generatedDocId.value = response.data?.cto?.nodeId as string;

        await crearTrazabilidad({
          proceso: "CTO" + response.data?.cto?.idCto,
          secuencia: response.data?.cto?.sec,
          estado: "Por asignar",
          descripcion: "Se ha radicado la cuenta de cobro",
          comentario: "Radicado",
          nombre: auth.$state.userInfo.name,
          accion: `Usuario Radicador ha radicado la Cuenta de cobro  ${response.data?.cto?.sec}`,
          tramite: "cuenta de cobro",
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      toast.error(
        "Por favor, cargue documentos distintos."
      );
    }
  } else {
    toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos.")
  }

  handleSubmitIsLoading.value = false;
};

const resetForm = async () => {
  window.location.reload();
};

function allowedTypes(files) {
  return files.filter(
    (file) =>
      file.type === "application/pdf" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "text/csv" ||
      file.type === "application/vnd.ms-excel" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword" ||
      file.type === "text/xml" ||
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg"
  );
}

function rejectedTypes(fileEntries) {
  if (fileEntries.filter((file) => file.type === "application/pdf")) {
    toast.error(`(${fileEntries.length}) archivo/s no cumple/n con el formato requerido `)
  } else {
    toast.error(`(${fileEntries.length}) archivo/s tiene/n un peso mayor a 50 MB`);
  }
}

function rejectedTypesOtros(fileEntries) {
  const existingFiles =
    otrosTiposInput.value?.modelValue?.map((file) => file.name) ?? [];
  const duplicateFiles = fileEntries.filter((fileEntry) =>
    existingFiles.includes(fileEntry.file.name)
  );
  if (duplicateFiles.length > 0) {
    toast.error(`Los siguientes archivos ya existen: ${duplicateFiles
        .map((file) => file.file.name)
        .join(", ")}`)
  } else if (
    otrosTiposInput.value?.modelValue?.length === 10 ||
    fileEntries.length > 10
  ) {
    toast.error(`El límite de archivos permitidos es de 10`);
  } else {
    toast.error(`(${fileEntries.length}) archivo/s no cumple/n con el formato requerido o tiene/n un peso mayor a 50 MB`);
  }
}

async function getAllRegisters() {
  try {
    const { data } = await sgdeaAxios.get(`/roles/usuarios?rol=Aprobador`);

    options.value = data.map((item) => ({
      label: item.firstname + " " + item.lastname,
      value: item.id,
      oficina: item.usuarioRelaciones.find((relacion) => relacion.rol.nombre === "Aprobador").oficina.id
    }));
  } catch (error) {
    console.error(error);
  }
}

const options = ref([]);

const tipoBienServicioOptions = ref<SelectInput[]>([
  {
    value: "DSE 01: Pago de Comisiones",
    label: "DSE 01: Pago de Comisiones",
  },
  {
    value: "DSE 02: Adquisición de bienes",
    label: "DSE 02: Adquisición de bienes",
  },
  {
    value: "DSE 03: Prestación de servicios",
    label: "DSE 03: Prestación de servicios",
  },
]);

const estados = ref([
  {
    value: "Radicado",
    label: "Por asignar",
  },
  {
    value: "rechazado",
    label: "Rechazado",
  },
  {
    value: "rechazado-operador",
    label: "Rechazado-Operador",
  },
  {
    value: "aprobado",
    label: "Aprobado",
  },
]);

</script>

<style>
.fileName {
  text-overflow: ellipsis !important;
}
</style>
