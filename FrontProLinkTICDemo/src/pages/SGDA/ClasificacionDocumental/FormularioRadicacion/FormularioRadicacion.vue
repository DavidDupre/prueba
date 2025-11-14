<template>
  <div>
    <BreadCrumbs :crumbs="routes" />

    <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold">
      Formulario de radicación
    </div>

    <q-card class="tw-rounded-lg tw-p-7 tw-h-full" flat>
      <q-list class="rounded-borders">
        <q-form ref="form" class="tw-mt-3 tw-h-full" @submit.prevent="sendDataToAlFresco">
          <q-expansion-item label="Información general" header-class="tw-text-xl tw-font-bold">
            <div class="tw-flex tw-full q-col-gutter-md">
              <div class="tw-w-1/2">
                <p class="tw-text-label">Código Radicado *</p>
                <p class="tw-mt-2 tw-mb-3">{{ formData.idRadicado }}</p>
              </div>
              <div class="tw-w-1/2">

                <p class="tw-text-label">Tipo de documento *</p>
                <q-select outlined v-model="formData.tipo_documento" :options="tipo_documento_op" label="Seleccione" dense
                  :rules="[inputRequired]" />
              </div>
              <div class="tw-w-1/2">
                <p class="tw-text-label">Documento *</p>
                <q-input outlined v-model="formData.documento" label="Inserte" dense type="number"
                :rules="[inputRequired, v => maxLengthInput(15, v), Number(formData.tipo_documento) == 11 ? alphanumeric : (v: string) => onlyNumbers(v)]" />
              </div>
            </div>

            <div class="tw-flex tw-full q-col-gutter-md">
              <div class="tw-w-1/2">

                <p class="tw-text-label">Nombre y apellido *</p>
                <q-input outlined v-model="formData.nombreCompleto" label="Inserte" dense :rules="[inputRequired]" />
              </div>
              <div class="tw-w-1/2">
                <p class="tw-text-label">Tipo de persona *</p>
                <q-select outlined v-model="formData.tipo_persona" :options="tipo_persona_op" required label="Seleccione"
                  dense :rules="[inputRequired]" />
              </div>
            </div>

            <div class="tw-flex tw-full q-col-gutter-md">
              <div class="tw-w-1/2">

                <p class="tw-text-label">Tipo de radicado *</p>
                <q-select outlined v-model="formData.tipo_radicado" :options="tipo_radicado_op" required
                  label="Seleccione" dense :rules="[inputRequired]" />
              </div>
              <div class="tw-w-1/2">
                <p class="tw-text-label">Archivo *</p>
                <q-input outlined v-model="formData.file" :rules="[inputRequired]" dense type="file" />
              </div>
            </div>
            <div class="tw-flex tw-full q-col-gutter-md">
              <div class="tw-w-1/2">
                <p class="tw-text-label">Fecha del Archivo *</p>
                <DatePicker outlined v-model:input-data-prop="formData.fechaDocumento" label="aaaa - mm - dd"
                  :rules="[inputRequired, validateDate]" dense mask="YYYY-MM-DD" />
              </div>
            </div>

          </q-expansion-item>

          <q-expansion-item label="Información de contacto" header-class="tw-text-xl tw-font-bold" class="tw-mt-5">
            <div class="tw-flex tw-full q-col-gutter-md tw-mt-0">
              <div class="tw-w-1/2">
                <p class="tw-text-label">Teléfono</p>
                <q-input outlined v-model="formData.telefono" label="Inserte" dense
                  :rules="[inputRequired, onlyNumbers, mobilePhonNumber]" />
              </div>
              <div class="tw-w-1/2">
                <p class="tw-text-label">Correo electrónico</p>
                <q-input outlined v-model="formData.email" label="Inserte" dense :rules="[inputRequired, validationEmail]"
                  type="email" />
              </div>
            </div>

            <div class="tw-flex tw-full q-col-gutter-md tw-mt-0">
              <div class="tw-w-1/4">
                <p class="tw-text-label">Continente</p>
                <q-select outlined v-model="formData.continente" :options="continente_op" label="Seleccione" dense
                  :rules="[inputRequired]" @update:model-value="loadPais" />
              </div>
              <div class="tw-w-1/4">
                <p class="tw-text-label">País</p>
                <q-select outlined v-model="formData.pais" :options="pais_op" label="Seleccione" dense
                  :rules="[inputRequired]" @update:model-value="loadDepartamento" />
              </div>
              <div class="tw-w-1/4">
                <p class="tw-text-label">Departamento</p>
                <q-select outlined v-model="formData.departamento" :options="departamento_op" label="Seleccione" dense
                  :rules="[inputRequired]" @update:model-value="loadMunicipio" />
              </div>
              <div class="tw-w-1/4">
                <p class="tw-text-label">Municipio</p>
                <q-select outlined v-model="formData.municipio" :options="municipio_op" label="Seleccione" dense
                  :rules="[inputRequired]" />
              </div>
            </div>

            <div class="tw-w-full tw-mt-3">
              <p class="tw-text-label">Dirección</p>
              <q-input outlined v-model="formData.direccion" label="Inserte" dense :rules="[inputRequired]" />
            </div>
          </q-expansion-item>

          <q-expansion-item label="Información adicional" header-class="tw-text-xl tw-font-bold" class="tw-mt-5">
            <div class="tw-flex tw-full q-col-gutter-md tw-mt-0">

              <div class="tw-w-1/2">
                <p class="tw-text-label">Medio de recepción</p>
                <q-select outlined v-model="formData.medio_recepcion" :options="medio_recepcion_op" label="Seleccione"
                  dense :rules="[inputRequired]" />
              </div>
              <div class="tw-w-1/2 tw-mt-0">
                <p class="tw-text-label">Asunto</p>
                <q-input outlined v-model="formData.asunto" label="Inserte" dense :rules="[inputRequired]" />

              </div>
            </div>


            <div>
              <div class="tw-flex tw-full q-col-gutter-md tw-mt-0 tw-mb-4">
                <div class="tw-w-1/3 tw-mt-0">
                  <p class="tw-text-label">Descripción</p>
                  <q-input outlined v-model="formDatauUpload.observacion" label="Inserte" dense />

                </div>
                <div class="tw-w-1/3">
                  <p class="tw-text-label">Tipo documental</p>
                  <q-select outlined v-model="formDatauUpload.tipoDocumental" :options="tipo_documental_op"
                    label="Seleccione" dense />

                </div>
                <div class="tw-w-1/3">
                  <p class="tw-text-label">Anexos</p>
                  <FileLoader multiple outlined accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
                    v-model:model-value="formDatauUpload.anexo_adjunto" label="Inserte" class="!tw-h-1" dense
                    :max-file-size="5 * 1024 * 1024" max-file-size-label="5" />
                </div>
              </div>


              <div class="col col-12 row justify-center  tw-w-full tw-m-[10px]">
                <q-btn label="Agregar" style="width: 240px; color: #003352" class="tw-rounded-xl tw-p-3 -lighter"
                  @click="addFile" />
              </div>


              <q-table :rows="documentosList" :columns="columnasList" row-key="id"></q-table>
            </div>


            <div class="col col-12 row justify-center q-gutter-x-md q-mt-xl q-pb-xl">
              <q-btn label="Crear" type="submit" color="secondary" text-color="white" style="width: 240px;"
                class="tw-rounded-xl tw-p-3" />
            </div>
          </q-expansion-item>
        </q-form>

      </q-list>
    </q-card>

    <Modal v-model="confirmCreation" title="Radicación exitosa" :text="`El radicado ${radicadoText} fue creado con exito`"
      is-success text-button="¡Ok!" @handle-accept="clear" />
    <Modal v-model="errorModal" title="Error" text="Ha ocurrido un error." text-button="¡Ok!"
      @handle-accept="errorModal = false" />
    <Modal v-model="uploadFileMessage" title="Error" text="Debe subir un archivo." text-button="¡Ok!"
      @handle-accept="uploadFileMessage = false" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, } from 'vue';

import BreadCrumbs from 'components/BreadCrumbs/BreadCrumbs.vue';
import Modal from 'components/Modal/Modal.vue';
import FileLoader from 'components/FormFields/FileLoader.vue';
import service from "src/services/Api";
import { inputRequired, maxLengthInput, validateDate, onlyNumbers, alphanumeric, validationEmail, mobilePhonNumber } from 'src/helpers/validations';
import DatePicker from 'src/components/FormFields/datePickerComponent.vue';
import { useLoadingStore } from 'src/stores/loading.store';
import { sgdeaAxios } from 'src/services';

const continente_op = ref([]);
const pais_op = ref([]);
const departamento_op = ref([]);
const municipio_op = ref([]);
const tipo_documento_op = ref([]);
const tipo_persona_op = ref([]);
const tipo_radicado_op = ref([]);
const tipo_documental_op = ref([]);
const medio_recepcion_op = ref([]);
const errorModal = ref(false);
const form = ref()
const idFile = ref(0);
const formDatauUpload = ref({
  observacion: '',
  tipoDocumental: '',
  anexo_adjunto: '',

})
const columnasList = ref([
  { name: 'id', required: true, label: 'Id', align: 'center', field: 'id', sortable: true },
  { name: 'observacion', align: 'center', label: 'Observación', field: 'observacion', sortable: true },
  { name: 'file', align: 'center', label: 'Archivo', field: 'file', sortable: true },
  { name: 'tipoDocumental', align: 'center', label: 'Tipología Documental', field: 'tipoDocumental', sortable: true },
])

const documentosList = ref([]);
const formData = ref({
  asunto: '',
  direccion: '',
  documento: '',
  email: '',
  continente: "",
  pais: "",
  departamento: "",
  municipio: "",
  medio_recepcion: '',
  tipo_documental: '',
  tipo_documento: '',
  nombreCompleto: '',
  file: '',
  telefono: '',
  tipo_radicado: '',
  tipo_persona: '',
  fechaDocumento: "",
  idRadicado: ''
})
const uploadFileMessage = ref(false);
const confirmCreation = ref(false);
const radicadoText = ref('');

function clear() {
  confirmCreation.value = false;
  formData.value = {
    idRadicado: '',
    asunto: '',
    direccion: '',
    documento: '',
    email: '',
    continente: "",
    pais: "",
    departamento: "",
    municipio: "",
    medio_recepcion: '',
    tipo_documental: '',
    tipo_documento: '',
    nombreCompleto: '',
    file: '',
    telefono: '',
    tipo_radicado: '',
    tipo_persona: '',
    fechaDocumento: ""
  }
}

function getContinente() {
  service.listContinente()
    .then(response => {

      response.map(function (value, key) {
        continente_op.value = [...continente_op.value, {
          label: value.nombre,
          value: value.idContinente,
        }]
      });
      return continente_op;
    })
    .catch(error => {
      console.error(error);
    });
};

function getPersona() {

  service.listEntidad(2)
    .then(response => {
      response.map(function (value, key) {
        tipo_persona_op.value = [...tipo_persona_op.value, {
          label: value.entidad,
          value: value.idEntidad,
        }]
      });
      return continente_op;

    })
    .catch(error => {
      console.error(error);
    });
};

function getTipoDocumento() {

  service.listEntidad(1)
    .then(response => {

      response.map(function (value, key) {

        tipo_documento_op.value = [...tipo_documento_op.value, {
          label: value.entidad,
          value: value.idEntidad,
        }]
      });
      return continente_op;

    })
    .catch(error => {
      console.error(error);
    });
};

function addFile() {
  idFile.value++;

  const nuevoElemento = {
    id: idFile.value,
    observacion: formDatauUpload.value.observacion,
    //@ts-ignore
    file: formDatauUpload.value.anexo_adjunto.name,
    archivo: formDatauUpload.value.anexo_adjunto,
    //@ts-ignore
    tipoDocumental: formDatauUpload.value.tipoDocumental.value,
  };

  documentosList.value.push(nuevoElemento);

  formDatauUpload.value.observacion = null;
  formDatauUpload.value.anexo_adjunto = null;
  formDatauUpload.value.tipoDocumental = "";

}

function getTipoDocumental() {

  service.listEntidad(3)
    .then(response => {

      response.map(function (value, key) {

        tipo_documental_op.value = [...tipo_documental_op.value, {
          label: value.entidad,
          value: value.idEntidad,
        }]
      });

      return tipo_documental_op;

    })
    .catch(error => {
      console.error(error);
    });
};

function getMedioRecepcion() {
  service.listEntidad(4)
    .then(response => {

      response.map(function (value, key) {

        medio_recepcion_op.value = [...medio_recepcion_op.value, {
          label: value.entidad,
          value: value.idEntidad,
        }]
      });
      return medio_recepcion_op;

    })
    .catch(error => {
      console.error(error);
    });
};

function getTipoRadicados() {
  service.listTipoRadicado()
    .then(response => {

      response.map(function (value, key) {
        tipo_radicado_op.value = [...tipo_radicado_op.value, {
          label: value.entidad,
          value: value.idEntidad,
        }]
      });
    })
    .catch(error => {
      console.error(error);
    });
};

onMounted(async () => {
  getContinente();
  getTipoDocumento();
  getPersona();
  getTipoDocumental();
  getMedioRecepcion();
  getTipoRadicados();


  const { data } = await sgdeaAxios.get<string>('/generar/secuencia/ENT')
  formData.value.idRadicado = data;

})

onMounted(() => {
  setTimeout(() => {

  }, 2000);
})

function loadPais() {
  //@ts-ignore
  service.listPais(formData.value.continente?.value)
    .then(response => {
      response.map(function (value, key) {
        pais_op.value = [...pais_op.value, {
          label: value.nombre,
          value: value.idPais,
        }]
      });
      return pais_op;
    })
    .catch(error => {
      console.error(error);
    });
}

function loadDepartamento() {
  //@ts-ignore
  service.listDepartamento(formData.value.pais?.value)
    .then(response => {
      response.map(function (value, key) {
        departamento_op.value = [...departamento_op.value, {
          label: value.nombre,
          value: value.idDepartamento,
        }]
      });
      return departamento_op;
    })
    .catch(error => {
      console.error(error);
    });
}

function loadMunicipio() {
  //@ts-ignore
  service.listMunicipio(formData.value.departamento?.value)
    .then(response => {
      response.map(function (value, key) {
        municipio_op.value = [...municipio_op.value, {
          label: value.nombre,
          value: value.idMunicipio,
        }]
      });
      return municipio_op;
    })
    .catch(error => {
      console.error(error);
    });
}

async function sendDataToAlFresco() {

  if (form.value.validate()) {

    const formDataToSend = new FormData();
    // const baseDataAlFresco = {
    //   //@ts-ignore
    //   tipoRadicado: formData.value?.tipo_radicado?.value ?? null,
    //   radicadoOrigen: 'Sede Prueba' ?? null,
    //   idRadicado: formData.value.idRadicado,
    //   fechaDocumento: formData.value?.fechaDocumento ?? null,
    //   //@ts-ignore
    //   medioRecepcion: formData.value?.medio_recepcion?.value ?? null,
    //   prioridad: 'Alta' ?? null,
    //   asuntoRadicacion: formData.value?.asunto ?? null,
    //   identificadorSistema: 0,
    //   idTramite: "0",
    //   detinatarioDependencia: 0,
    //   destinatarioUbicacionSede: 'Positiva',
    //   destinatarioNombresApellidos: formData.value?.nombreCompleto ?? null,
    //   tipoDocumentoRemitente: "0",
    //   numeroDocumentoRemitente: "0",
    //   //@ts-ignore
    //   remitenteTipoPersona: formData.value?.tipo_persona?.value ?? null,
    //   nombreRemitente: "henrry",
    //   //@ts-ignore
    //   remitenteDireccion: formData.value?.direccion ?? null,
    //   //@ts-ignore
    //   remitentePais: formData.value?.pais?.label ?? null,
    //   //@ts-ignore
    //   remitenteDepartamento: formData.value?.departamento?.label ?? null,
    //   //@ts-ignore
    //   remitenteMunicipio: formData.value?.municipio?.label ?? null,
    //   remitenteCorreoElectronico: formData.value?.email ?? null,
    //   //@ts-ignore
    //   remitenteTelefono: formData.value.tipo_persona.label ?? null,
    //   fondoRadicacion: "0",
    //   serieRadicacion: "0",
    //   subserieRadicacion: "0",
    //   //@ts-ignore
    //   tipoDocumentalRadicacion: "",
    //   descripcionAnexo: JSON.stringify(documentosList.value.length > 0 ? documentosList.value.map(obj => ({ observacion: obj.observacion, tipoDocumental: obj.tipoDocumental })) : null).replace(`\\`, '')
    // };

    if (formData.value.file.length === 0) {
      uploadFileMessage.value = true;
      return;
    }


    //@ts-ignore
    formDataToSend.append("tipoRadicado", formData.value?.tipo_radicado?.value ?? null)
    formDataToSend.append("radicadoOrigen", 'Sede Prueba' ?? null)
    formDataToSend.append("idRadicado", formData.value.idRadicado)
    formDataToSend.append("fechaDocumento", formData.value?.fechaDocumento ?? null)
    //@ts-ignore
    formDataToSend.append("medioRecepcion", formData.value?.medio_recepcion?.value ?? null)
    formDataToSend.append("prioridad", 'Alta' ?? null)
    formDataToSend.append("asuntoRadicacion", formData.value?.asunto ?? null)
    formDataToSend.append("identificadorSistema", 0)
    formDataToSend.append("idTramite", "0")
    formDataToSend.append("detinatarioDependencia", 0)
    formDataToSend.append("destinatarioUbicacionSede", 'Positiva')
    formDataToSend.append("destinatarioNombresApellidos", formData.value?.nombreCompleto ?? null)
    formDataToSend.append("tipoDocumentoRemitente", "0")
    formDataToSend.append("numeroDocumentoRemitente", "0")
    //@ts-ignore
    formDataToSend.append("remitenteTipoPersona", formData.value?.tipo_persona?.value ?? null)
    formDataToSend.append("nombreRemitente", "henrry")
    //@ts-ignore
    formDataToSend.append("remitenteDireccion", formData.value?.direccion ?? null)
    //@ts-ignore
    formDataToSend.append("remitentePais", formData.value?.pais?.value ?? null)
    //@ts-ignore
    formDataToSend.append("remitenteDepartamento", formData.value?.departamento?.value ?? null)
    //@ts-ignore
    formDataToSend.append("remitenteMunicipio", formData.value?.municipio?.value ?? null)
    formDataToSend.append("remitenteCorreoElectronico", formData.value?.email ?? null)
    //@ts-ignore
    formDataToSend.append("remitenteTelefono", formData.value.tipo_persona.label ?? null)
    formDataToSend.append("fondoRadicacion", "0")
    formDataToSend.append("serieRadicacion", "0")
    formDataToSend.append("subserieRadicacion", "0")
    //@ts-ignore
    tipoDocumentalRadicacion: "",
      formDataToSend.append("descripcionAnexo", JSON.stringify(documentosList.value.length > 0 ? documentosList.value.map(obj => ({ observacion: obj.observacion, tipoDocumental: obj.tipoDocumental })) : null).replace(`\\`, ''))
    formDataToSend.append("file", formData.value.file[0])
    documentosList.value.forEach(doc => {
      formDataToSend.append("anexos", doc.archivo)
    });
    //@ts-ignore
    // formDataToSend.append("radicadoEntradaDTO", baseDataAlFresco)

    service.createRadication(formDataToSend).then(result => {


      radicadoText.value = result?.idRadicado ?? '';
      confirmCreation.value = true;
    })
      .catch(error => {

        errorModal.value = true;
        console.error(error)
      });
  }
}

const routes = [
  {
    name: 'Inicio',
    to: '/'
  },

  {
    name: 'Formulario de radicación ',
  }
]

</script>

<style lang="scss">
.container-buttons {
  display: flex;
  justify-content: center;
  margin-top: 180px;
}</style>
