<template>
  <section class="tw-py-8 tw-bg-bg">
    <a href="/facturacion" class="tw-text-primary" style="text-decoration: none">
      <q-icon size="1.5em" name="chevron_left" color="primary" />
      <b> Volver </b>
    </a>
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
      <div class="tw-flex tw-justify-between tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold">Radicar cuenta de cobro</h1>
      </div>
      <q-form ref="formValidate">
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <q-expansion-item expand-separator id="Datos generales" default-opened>
            <template v-slot:header>
              <div class="col row">
                <h2 class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">
                  Información básica radicación
                </h2>
              </div>
            </template>

            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Dependencia *</label>
                  <q-select v-model="form.dependencia" input-debounce="0" map-options emit-value
                    :options="optionsDependencias" dense outlined class="tw-rounded-lg" :rules="[isRequired]">
                  </q-select>
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Responsable del proceso </label>
                  <q-select v-model="form.responsable" input-debounce="0" map-options emit-value :options="options" dense
                    outlined class="tw-rounded-lg">
                  </q-select>
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Tipo de trámite *</label>
                  <q-select v-model="form.tipoTramite" input-debounce="0" :options="tipoTramite" dense outlined
                    class="tw-rounded-lg" :rules="[isRequired]">
                  </q-select>
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Canal de Recepción *</label>
                  <q-select v-model="form.canalRecepcion" input-debounce="0" :options="[
                    { value: 'correo', label: 'Correo electrónico\n' },
                    { value: 'telefono', label: 'Teléfono' },
                  ]" :rules="[isRequired]" dense outlined class="tw-rounded-lg">
                  </q-select>
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Tipo de Documento *</label>
                  <q-select v-model="form.tipoDocumento" input-debounce="0" :options="tipoDocumento" dense outlined
                    class="tw-rounded-lg" :rules="[isRequired]">
                  </q-select>
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Numero de Identificacion *</label>
                  <q-input v-model="form.numeroIdentificacion" input-debounce="0"
                    :rules="[isRequired, (v) => maxLengthInput(15, v), Number(form.tipoDocumento) == 11 ? alphanumeric : (v: string) => onlyNumbers(v)]" dense outlined class="tw-rounded-lg">
                  </q-input>
                </span>
              </div>
              <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                <span class="tw-w-full">
                  <label class="tw-text-label">Primer Apellido *</label>
                  <q-input v-model="form.primerApellido" dense filled class="tw-rounded-lg" :rules="[isRequired]" />
                </span>
              </div>
              <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                <span class="tw-w-full">
                  <label class="tw-text-label">Segundo Apellido *</label>
                  <q-input v-model="form.segundoApellido" dense filled :rules="[isRequired]" class="tw-rounded-lg" />
                </span>
              </div>
              <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                <span class="tw-w-full">
                  <label class="tw-text-label">Primer Nombre *</label>
                  <q-input v-model="form.primerNombre" dense filled class="tw-rounded-lg" :rules="[isRequired]" />
                </span>
              </div>
              <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                <span class="tw-w-full">
                  <label class="tw-text-label">Otros Nombres *</label>
                  <q-input v-model="form.otrosNombres" :rules="[isRequired]" dense filled class="tw-rounded-lg" />
                </span>
              </div>
            </div>
          </q-expansion-item>
        </q-card>
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <q-expansion-item expand-separator id="Datos generales" default-opened>
            <template v-slot:header>
              <div class="col row">
                <h2 class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">
                  Información documento soporte equivalente
                </h2>
              </div>
            </template>

            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-12">
                <span class="tw-w-full">
                  <label class="tw-text-label">Tipo de bien o servicio *</label>
                  <q-select v-model="form.tipoServicio" label="Seleccione" input-debounce="0" map-options emit-value
                    :options="tipoBienServicioOptions" dense outlined class="tw-rounded-lg" :rules="[isRequired]">
                  </q-select>
                </span>
              </div>
              <div class="col-12">
                <span class="tw-w-full">
                  <label class="tw-text-label">Observación * {{ form.observacion.length }}</label>
                  <q-input v-model="form.observacion" input-debounce="0" dense outlined class="tw-rounded-lg"
                    :rules="[isRequired, (v) => maxLengthInput(2000, v)]" type="textarea" />
                </span>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Valor *</label>
                  <q-input v-model="form.valor" prefix="$" :rules="[isRequired, (v) => maxLengthInput(8, v)]"
                    input-debounce="0" outlined class="tw-rounded-lg" @keypress="formattedValue" dense />
                </span>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Valor en letras *</label>
                  <q-input v-model="form.valorLetras" input-debounce="0" :rules="[isRequired]" dense outlined
                    class="tw-rounded-lg" />
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Aprobador *</label>
                  <q-select v-model="form.aprobador" input-debounce="0" :options="options" dense outlined
                    class="tw-rounded-lg" :rules="[isRequired]">
                  </q-select>
                </span>
              </div>
            </div>
          </q-expansion-item>
        </q-card>
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <q-expansion-item expand-separator id="Datos generales" default-opened>
            <template v-slot:header>
              <div class="col row">
                <h2 class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">
                  Campos automáticos al radicar
                </h2>
              </div>
            </template>

            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">
                     FECHA / sistema al radicar *
                  </label>

                  <DatePicker mask="YYYY/MM/DD" label="aaaa / mm / dd" v-model:input-data-prop="form.fechaRadicar"
                    :rules="[isRequired]" />
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Hora de inicio</label>
                  <TimePicker class="custom-field" required v-model:input-data-prop="form.horaInicio" />
                </span>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Estado del tramite *</label>
                  <q-select label="Seleccione" v-model="form.estadoTramite" input-debounce="0" :options="estados"
                    :rules="[isRequired]" dense outlined class="tw-rounded-lg">
                  </q-select>
                </span>
              </div>
            </div>
          </q-expansion-item>
        </q-card>
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <q-expansion-item expand-separator id="Datos generales" default-opened>
            <template v-slot:header>
              <div class="col row">
                <h2 class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">
                  Cargue de documentos
                </h2>
              </div>
            </template>

            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-12">
                <span class="custom-label text-weight-bold">Cuenta de cobro *</span>
                <q-file name="croquisAccidente" v-model="form.cuentaCobro" flat label="" dense outlined clearable
                  clear-icon="close" class="mb-3" input-style="opacity: 0" accept=".pdf" :filter="allowedTypes"
                  @rejected="rejectedTypes" :rules="[isRequired]">
                  <template v-slot:prepend>
                    <q-icon name="check_circle" color="grey-5" />
                  </template>
                  <template v-slot:file="{ file }">
                    <q-chip outline square color="secondary" class="q-my-sm" style="
                        border-radius: 5px;
                        border: 1px solid #e3e4e5;
                        background: #fff;
                      ">
                      <q-avatar size="24px" square>
                        <img v-lazy :data-url="pdfIcon" alt="pdfIcon" />
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
                    <q-icon name="attach_file" color="grey-6" />
                  </template>
                </q-file>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-12">
                <span class="custom-label text-weight-bold">Pagos de seguridad social *</span>
                <q-file name="croquisAccidente" v-model="form.pagoSeguridadSocial" flat label="" dense outlined clearable
                  clear-icon="close" class="mb-3" input-style="opacity: 0" accept=".pdf" :filter="allowedTypes"
                  @rejected="rejectedTypes" :rules="[isRequired]">
                  <template v-slot:prepend>
                    <q-icon name="check_circle" color="grey-5" />
                  </template>
                  <template v-slot:file="{ file }">
                    <q-chip outline square color="secondary" class="q-my-sm" style="
                        border-radius: 5px;
                        border: 1px solid #e3e4e5;
                        background: #fff;
                      ">
                      <q-avatar size="24px" square>
                        <img v-lazy :data-url="pdfIcon" alt="pdfIcon" />
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
                    <q-icon name="attach_file" color="grey-6" />
                  </template>
                </q-file>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-12">
                <span class="custom-label text-weight-bold">Excel control entrega soportes</span>
                <q-file name="croquisAccidente" v-model="form.entregaSoportes" flat label="" dense outlined clearable
                  clear-icon="close" class="mb-3" input-style="opacity: 0" accept=".xlsx, .xls, .csv" :filter="allowedTypes"
                  @rejected="rejectedTypes">
                  <template v-slot:prepend>
                    <q-icon name="check_circle" color="grey-5" />
                  </template>
                  <template v-slot:file="{ file }">
                    <q-chip outline square color="secondary" class="q-my-sm" style="
                        border-radius: 5px;
                        border: 1px solid #e3e4e5;
                        background: #fff;
                      ">
                      <q-avatar size="24px" square>
                        <img v-lazy :data-url="excelIcon" alt="excelIcon" />
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
                    <q-icon name="attach_file" color="grey-6" />
                  </template>
                </q-file>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-12">
                <span class="custom-label text-weight-bold">Otros tipos documentales
                </span>
                <q-file name="croquisAccidente" v-model="form.otrosTiposDocumentales" flat label="" dense outlined
                  clearable clear-icon="close" class="mb-3" input-style="opacity: 0" accept="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg" :filter="allowedTypes"
                  @rejected="rejectedTypes" :rules="[]">
                  <template v-slot:prepend>
                    <q-icon name="check_circle" color="grey-5" />
                  </template>
                  <template v-slot:file="{ file }">
                    <q-chip outline square color="secondary" class="q-my-sm" style="
                        border-radius: 5px;
                        border: 1px solid #e3e4e5;
                        background: #fff;
                      ">
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
                    <q-icon name="attach_file" color="grey-6" />
                  </template>
                </q-file>
              </div>
            </div>
          </q-expansion-item>
        </q-card>
      </q-form>
      <div class="col row justify-center q-gutter-x-md q-my-md">
        <q-btn color="accent" textColor="secondary" label="Cancelar" style="
            width: 130px;
            height: 40px;
            border-radius: 8px;
            font-size: 16px;
          " type="reset" no-caps @click="resetForm" />

        <q-btn color="primary" label="Radicar" style="
            width: 130px;
            height: 40px;
            border-radius: 8px;
            font-size: 16px;
          " @click="radicarModal = true" />
      </div>
    </main>
    <Modal v-model="successModal" title="Radicacion Exitosa"
      text="Trámite de radicación de documento de cuenta de cobro generado correctamente, número de radicado ENT XXXX-XXXX. El documento pasará a la bandeja del asignador para continuar el proceso"
      is-success text-button="Ok" @handleAccept="() => { }" />
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
import { type Ref, ref, onMounted, watch } from "vue";
import {
  currentHour,
  secondFormatDate,
} from "src/helpers/formtDate";
import { numberToHumanText } from "src/helpers/number";
import { maxLengthInput, onlyNumbers, alphanumeric } from "src/helpers/validations";
import DatePicker from "src/components/FormFields/datePickerComponent.vue";
import TimePicker from "src/components/FormFields/timePickerComponent.vue";

// @ts-ignore
import pdfIcon from "src/assets/pdf.svg";
// @ts-ignore
import excelIcon from "src/assets/excel.svg";
import docxIcon from "src/assets/word.svg";
// @ts-ignore
import imgIcon from "src/assets/img.svg";
import xml from "src/assets/xml.svg";
import txt from "src/assets/txt.svg";
import zip from "assets/folder2.svg";
import msg from "assets/mail.svg";
import ppt from "assets/powerPoint.svg";
import interrogation from "assets/interrogation.svg";
// @ts-ignore
import music from "src/assets/music.svg";
// @ts-ignore
import video from "src/assets/video.svg";

import { IRadicado } from ".";
import { sgdeaAxios } from "src/services";
import { Dependencia, SelectInput } from "src/interfaces";
import { tipoDocumento } from "src/constantes/options";
import { useEntidades } from "src/composables/useEntidades";
import { toast } from "src/helpers/toast";

const successModal = ref(false);
const formValidate = ref();
const radicarModal= ref(false);

const optionsDependencias: Ref<SelectInput[]> = ref([])

const form = ref<Partial<IRadicado>>({
  dependencia: "",
  responsable: "",
  tipoTramite: "",
  canalRecepcion: "",
  tipoDocumento: "",
  primerApellido: "",
  segundoApellido: "",
  primerNombre: "",
  otrosNombres: "",

  tipoServicio: "",
  observacion: "",
  valor: 0,
  valorLetra: "",
  aprobador: "",

  fechaRadicar: secondFormatDate(new Date()),
  horaInicio: currentHour(new Date()),
  estadoTramite: "",

  cuentaCobro: null,
  pagoSeguridadSocial: null,
  entregaSoportes: null,
  otrosTiposDocumentales: null,

  numeroIdentificacion: "",
});

watch(
  () => form.value.valor,
  (newNumber) => {
    form.value.valorLetras = numberToHumanText(newNumber);
  }
);

const formattedValue = () => {
  return form.value.valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const { optionsEntidades: tipoTramite } = useEntidades(20);

const getData = async () => {
  const { data }: { data: Dependencia[] } = await sgdeaAxios.get<Dependencia[]>("/seccionSubSeccion")

  optionsDependencias.value = data.map(item => ({ label: item.nombre, value: item.nombre }));
}

onMounted(getData);

const handleSubmit = async () => {
  if (await formValidate.value.validate()) {
    //showModalVerification.value = true
  } else {
    toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos.')
  }
};

const resetForm = () => {
  form.value = {};
};

const isRequired = (val) => !!val || "Campo Requerido";

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

const tipoIcon = (tipo) => {
  const formato = (tipo || '').toLowerCase();

  if (['pdf', 'application/pdf'].includes(formato)) return pdfIcon;
  if (
    [
      'xls',
      'xlsx',
      'csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ].includes(formato)
  ) return excelIcon;
  if (
    [
      'docx',
      'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ].includes(formato)
  ) return docxIcon;
  if (
    ['jpeg', 'jpg', 'png', 'webp'].includes(formato)
  ) return imgIcon;
  if (['mp3'].includes(formato)) return music;
  if (['avi', 'mp4'].includes(formato)) return video;
  if (['txt', 'bmp'].includes(formato)) return txt;
  if (['xml'].includes(formato)) return xml;
  if (['zip', 'rar'].includes(formato)) return zip;
  if (['ppt', 'pptx'].includes(formato)) return ppt;
  if (['msg', 'eml'].includes(formato)) return msg;

  return interrogation;
};

function rejectedTypes(fileEntries) {
  fileEntries.forEach((fileEntry) => {

  });

  toast.error(`(${fileEntries.length}) archivo/s no cumple con el formato requerido`);
}

const options = ref([
  {
    value: "Victor Rodriguez",
    label: "Victor Rodriguez",
  },
]);

const tipoBienServicioOptions = ref([
  {
    value: "adquisicion-bienes",
    label: "DSE 02: Adquisición de bienes",
  },
  {
    value: "prestacion-servicios",
    label: "DSE 03: Prestación de servicios",
  },
]);

const estados = ref([
  {
    value: "radicado",
    label: "Radicado",
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
