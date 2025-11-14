<template>
    <section class="tw-py-8 tw-bg-bg">
        <a href="/facturacion" class="tw-text-primary" style="text-decoration: none;">
            <q-icon size="1.5em" name="chevron_left" color="primary" />
            <b>
                Volver
            </b>
        </a>
        <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0 ">
            <div class="tw-flex tw-justify-between tw-pt-4">
                <h1 class="tw-text-3xl tw-font-bold">Radicar cuenta de cobro</h1>
            </div>
            <q-form ref="formValidate">
                <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
                    <q-expansion-item expand-separator id="Datos generales" default-opened>
                        <template v-slot:header>
                            <div class="col row">
                                <h2 class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">Información básica radicación</h2>
                            </div>
                        </template>


                        <div class="row q-col-gutter-md q-pb-md q-px-md">
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <span class="tw-w-full">
                                    <label class="tw-text-label">Dependencia *</label>
                                    <q-select v-model="form.dependencia" input-debounce="0" map-options emit-value
                                              :options="[{ value: 'dependencia', label: 'Dependencia' }
                                    ]"
                                    dense outlined class="tw-rounded-lg" :rules="[isRequired]">

                                    </q-select>
                                </span>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <span class="tw-w-full">
                                    <label class="tw-text-label">Responsable del proceso </label>
                                    <q-select v-model="form.responsable" input-debounce="0" map-options emit-value
                                        :options="options" dense
                                        outlined class="tw-rounded-lg">

                                    </q-select>
                                </span>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <span class="tw-w-full">
                                    <label class="tw-text-label">Tipo de tramite *</label>
                                    <q-select v-model="form.tipoTramite" input-debounce="0"
                                              :options="radicadoListTramite" dense emit-value map-options
                                        outlined class="tw-rounded-lg" :rules="[isRequired]">

                                    </q-select>
                                </span>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <span class="tw-w-full">
                                    <label class="tw-text-label">Canal de Recepcion *</label>
                                    <q-select v-model="form.canalRecepcion" input-debounce="0" :options="[
                                        { value: 'correo', label: 'Correo electrónico' }
                                    ]" emit-value map-options
                                        :rules="[isRequired]" dense outlined class="tw-rounded-lg">

                                    </q-select>
                                </span>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <span class="tw-w-full">
                                    <label class="tw-text-label">Tipo de Documento *</label>
                                    <q-select v-model="form.tipoDocumento" input-debounce="0" :options="[
                                        { value: 'cedula', label: 'Cédula de Ciudadanía' }
                                    ]" dense emit-value map-options
                                        outlined class="tw-rounded-lg" :rules="[isRequired]">

                                    </q-select>
                                </span>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <span class="tw-w-full">
                                    <label class="tw-text-label">Numero de Identificacion *</label>
                                    <q-input v-model="form.numeroIdentificacion" input-debounce="0"
                                        :rules="[isRequired, v => maxLengthInput(15, v), Number(form.tipoDocumento) == 11 ? alphanumeric : (v: string) => onlyNumbers(v)]"
                                        dense outlined class="tw-rounded-lg">
                                    </q-input>
                                </span>
                            </div>
                            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">

                                <span class="tw-w-full">
                                    <label class="tw-text-label">Primer Apellido *</label>
                                    <q-input v-model="form.primerApellido" dense filled class="tw-rounded-lg"
                                        :rules="[isRequired]" />

                                </span>
                            </div>
                            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">

                                <span class="tw-w-full">
                                    <label class="tw-text-label">Segundo Apellido *</label>
                                    <q-input v-model="form.segundoApellido" dense filled :rules="[isRequired]"
                                        class="tw-rounded-lg" />

                                </span>
                            </div>
                            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">

                                <span class="tw-w-full">
                                    <label class="tw-text-label">Primer Nombre *</label>
                                    <q-input v-model="form.primerNombre" dense filled class="tw-rounded-lg"
                                        :rules="[isRequired]" />

                                </span>
                            </div>
                            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">

                                <span class="tw-w-full">
                                    <label class="tw-text-label">Otros Nombres *</label>
                                    <q-input v-model="form.otrosNombres" :rules="[isRequired]" dense filled
                                        class="tw-rounded-lg" />

                                </span>
                            </div>
                        </div>


                    </q-expansion-item>
                </q-card>
                <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
                    <q-expansion-item expand-separator id="Datos generales" default-opened>
                        <template v-slot:header>
                            <div class="col row">
                                <h2 class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">Información documento soporte
                                    equivalente</h2>
                            </div>
                        </template>


                        <div class="row q-col-gutter-md q-pb-md q-px-md">
                            <div class="col-12 ">
                                <span class="tw-w-full">
                                    <label class="tw-text-label">Tipo de bien o servicio *</label>
                                    <q-select v-model="form.tipoServicio" label="Seleccione"
                                              input-debounce="0" map-options emit-value
                                              :options="bienOrService" dense outlined class="tw-rounded-lg"
                                              :rules="[isRequired]"
                                    >

                                    </q-select>
                                </span>
                            </div>
                            <div class="col-12">
                                <span class="tw-w-full">
                                    <label class="tw-text-label">Observacion * </label>
                                    <q-input v-model="form.observacion" input-debounce="0" dense
                                        outlined class="tw-rounded-lg" :rules="[isRequired, v => maxLengthInput(2000, v)]" type="textarea" />

                                </span>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <span class="tw-w-full">
                                    <label class="tw-text-label">Valor *</label>
                                    <q-input v-model.number="form.valor" type="text" prefix="$"
                                        :rules="[isRequired, v => maxLengthInput(8, v)]" input-debounce="0" dense outlined class="tw-rounded-lg"
                                     @keypress="formattedValue" />
                                </span>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <span class="tw-w-full">
                                    <label class="tw-text-label">Valor en letras *</label>
                                    <q-input v-model="form.valorLetras" input-debounce="0"
                                        :rules="[isRequired]" dense outlined class="tw-rounded-lg" />
                                </span>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <span class="tw-w-full">
                                    <label class="tw-text-label">Aprobador *</label>
                                    <q-select v-model="form.aprobador" input-debounce="0" :options="options" dense
                                        outlined class="tw-rounded-lg" :rules="[isRequired]">

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
                                <h2 class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">Campos automáticos al radicar</h2>
                            </div>
                        </template>


                        <div class="row q-col-gutter-md q-pb-md q-px-md">
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <span class="tw-w-full">
                                    <label class="tw-text-label">
                                         FECHA / sistema al radicar *
                                    </label>

                                    <DatePicker mask="YYYY/MM/DD" label="aaaa / mm / dd"
                                        v-model:input-data-prop="form.fechaRadicar" :rules="[isRequired]" />


                                </span>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <span class="tw-w-full">
                                    <label class="tw-text-label">Hora de inicio</label>
                                    <TimePicker class="custom-field" required
                                        v-model:input-data-prop="form.horaInicio" />
                                </span>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <span class="tw-w-full">
                                    <label class="tw-text-label">Estado del tramite *</label>
                                    <q-select v-model="form.estadoTramite" input-debounce="0" :options="estados"
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
                                <h2 class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">Cargue de documentos</h2>
                            </div>
                        </template>


                        <div class="row q-col-gutter-md q-pb-md q-px-md">
                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-12">
                            <span class="custom-label text-weight-bold">Cuenta de cobro *</span>
                            <q-file name="croquisAccidente" v-model="form.cuentaCobro" flat
                                label=""
                                dense outlined clearable clear-icon="close" class="mb-3" input-style="opacity: 0"
                                accept=".pdf" :filter="allowedTypes" @rejected="rejectedTypes" :rules="[isRequired]" >
                                <template v-slot:prepend>
                                    <q-icon name="check_circle" color="grey-5" />
                                </template>
                                <template v-slot:file="{ file }">
                                    <q-chip outline square color="secondary" class="q-my-sm"
                                        style="border-radius: 5px; border: 1px solid #E3E4E5; background: #FFF;">

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
                            <q-file name="croquisAccidente" v-model="form.pagoSeguridadSocial" flat
                                label=""
                                dense outlined clearable clear-icon="close" class="mb-3" input-style="opacity: 0"
                                accept=".pdf" :filter="allowedTypes" @rejected="rejectedTypes" :rules="[isRequired]" >
                                <template v-slot:prepend>
                                    <q-icon name="check_circle" color="grey-5" />
                                </template>
                                <template v-slot:file="{ file }">
                                    <q-chip outline square color="secondary" class="q-my-sm"
                                        style="border-radius: 5px; border: 1px solid #E3E4E5; background: #FFF;">

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
                            <q-file name="croquisAccidente" v-model="form.entregaSoportes" flat
                                label=""
                                dense outlined clearable clear-icon="close" class="mb-3" input-style="opacity: 0"
                                accept=".xlsx, .xls, .csv" :filter="allowedTypes" @rejected="rejectedTypes" >
                                <template v-slot:prepend>
                                    <q-icon name="check_circle" color="grey-5" />
                                </template>
                                <template v-slot:file="{ file }">
                                    <q-chip outline square color="secondary" class="q-my-sm"
                                        style="border-radius: 5px; border: 1px solid #E3E4E5; background: #FFF;">

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
                            <span class="custom-label text-weight-bold">Otros tipos documentales </span>
                            <q-file name="croquisAccidente" v-model="form.otrosTiposDocumentales" flat
                                label=""
                                dense outlined clearable clear-icon="close" class="mb-3" input-style="opacity: 0"
                                accept="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg" :filter="allowedTypes" @rejected="rejectedTypes" :rules="[]" >
                                <template v-slot:prepend>
                                    <q-icon name="check_circle" color="grey-5" />
                                </template>
                                <template v-slot:file="{ file }">
                                    <q-chip outline square color="secondary" class="q-my-sm"
                                        style="border-radius: 5px; border: 1px solid #E3E4E5; background: #FFF;">

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
            <q-btn color="accent" textColor="secondary" label="Cancelar"
                   style="width: 130px; height: 40px; border-radius: 8px; font-size: 16px;" type="reset"
                   no-caps @click="resetForm"/>

            <q-btn color="primary" label="Radicar"
                   style="width: 130px; height: 40px; border-radius: 8px; font-size: 16px;"
                   @click="handleSubmit"/>
          </div>
        </main>
        <Modal
            v-model="successModal"
            title="Radicacion Exitosa"
            text="Trámite de radicación de documento de cuenta de cobro generado correctamente, número de radicado ENT XXXX-XXXX. El documento pasará a la bandeja del asignador para continuar el proceso"
            is-success
            text-button="Ok"
            @handleAccept="() => {}"
        />
    </section>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { Ref, ref, onMounted } from "vue";

import { radicadoListTramite, bienOrService } from "src/constantes/options";
import  { maxLengthInput, alphanumeric, onlyNumbers } from "src/helpers/validations";
import {
  IDataEmpresa,
  IRadicado
} from ".";
import DatePicker from "src/components/FormFields/datePickerComponent.vue";
import TimePicker from "src/components/FormFields/timePickerComponent.vue";
// @ts-ignore
import pdfIcon from "src/assets/pdf.svg";
// @ts-ignore
import excelIcon from "src/assets/excel.svg";
// @ts-ignore
import docxIcon from "src/assets/word.svg";
// @ts-ignore
import imgIcon from "src/assets/img.svg";
import xml from "src/assets/xml.svg";
import { secondFormatDate, currentHour } from "src/helpers/formtDate";
import { toast } from "src/helpers/toast";

const router = useRouter();
const successModal = ref(false);
const formValidate = ref()

interface IRadicado {
  dependencia: string;
  responsable?: string;
  tipoTramite: string;
  canalRecepcion: string;
  tipoDocumento: string;
  primerApellido: string;
  segundoApellido: string;
  primerNombre: string;
  otrosNombres: string;

  tipoServicio: string;
  observacion: string;
  valor: number;
  valorLetras: string;
  aprobador: string;

  fechaRadicar: string;
  horaInicio: string;
  estadoTramite: string;

  cuentaCobro: any;
  pagoSeguridadSocial: any;
  entregaSoportes: any;
  otrosTiposDocumentales?: any;

  numeroIdentificacion: string;
}

const form: Ref<Partial<IRadicado>> = ref({
  dependencia: 'dependencia',
  responsable: 'Victor Rodriguez',
  tipoTramite: 44,
  canalRecepcion: 'correo',
  tipoDocumento: 'cedula',
  primerApellido: 'Morales',
  segundoApellido: 'Diaz',
  primerNombre: 'Mario',
  otrosNombres: 'Jose',

  tipoServicio: 44,
  observacion: 'Observacion',
  valor: '',
  valorLetras: '',
  aprobador: 'Victor Rodriguez',

  fechaRadicar: secondFormatDate(new Date()),
  horaInicio: currentHour(new Date()),
  estadoTramite: 'rechazado',

  cuentaCobro: '',
  pagoSeguridadSocial: '',
  entregaSoportes: '',
  otrosTiposDocumentales: '',

  numeroIdentificacion: '1254521',
});

const formattedValue = () => {
  return form.value.valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

onMounted(async () => {

});

const handleSubmit =  async () => {
  if (await formValidate.value.validate()) {
    //showModalVerification.value = true
  } else {
    toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos.");
  }
};

const isRequired = val => !!val || 'Campo Requerido'

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

function rejectedTypes(fileEntries) {

    fileEntries.forEach(fileEntry => {

    })
    toast.error(`(${fileEntries.length}) archivo/s no cumple con el formato requerido`);

}

const options = ref([
    {
        value: 'Victor Rodriguez',
        label: 'Victor Rodriguez'
    }
])

const estados = ref([
    {
        value: 'radicado',
        label: 'Radicado'
    },
    {
        value: 'rechazado',
        label: 'Rechazado'
    },
    {
        value: 'rechazado-operador',
        label: 'Rechazado-Operador'
    },
    {
      value: 'aprobado',
      label: 'Aprobado'
    },
])
</script>

<style>
.fileName {
    text-overflow: ellipsis !important;
}
</style>
