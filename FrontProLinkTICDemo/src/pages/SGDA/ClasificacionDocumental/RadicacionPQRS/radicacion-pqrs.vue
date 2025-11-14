<template>
  <q-card class="tw-rounded-lg tw-p-7 tw-h-full" flat>
    <div v-if="step == 1" class="tw-p-[50px]">
      <BreadCrumbs :crumbs="routes" />

      <div class="tw-mb-8">
        <p class="pl-4 tw-font-bold tw-text-3xl tw-mt-5 tw-mb-3 text-bold">
          Radicar PQRD
        </p>
        <p class="tw-text-label tw-text-[16px]">
          Positiva recibirá y responderá en los tiempos definidos por la ley a
          los medios de contacto suministrados
        </p>
      </div>

      <q-form ref="form" @submit.prevent="submit">
        <q-expansion-item
          label="Datos del remitente"
          header-class="tw-text-lg tw-font-bold"
          class="tw-mt-5"
        >
          <section>
            <div class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pl-6">
              <div class="tw-col-span-2">
                <p class="tw-text-label">Código Radicado *</p>
                <p class="tw-mt-2 tw-mb-3">{{ formData.idRadicado }}</p>
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label">Tipo de Remitente *</p>
                <q-select
                  :options="tipoRemitente"
                  map-options
                  emit-value
                  outlined
                  v-model="formData.tipoRemitente"
                  label="Inserte"
                  dense
                  :rules="[inputRequired]"
                />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label">Tipo de Documento</p>
                <q-select
                  :options="tipoDocumento"
                  map-options
                  emit-value
                  outlined
                  v-model="formData.tipoDocumentoRemitente"
                  label="Inserte"
                  dense
                />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label">Numero del Documento</p>
                <q-input
                  type="number"
                  outlined
                  v-model="formData.numeroDocumentoRemitente"
                  label="Inserte"
                  dense
                  :rules="[(v) => lengthInput(15, v), Number(formData.tipoDocumentoRemitente) == 11 ? alphanumeric : (v: string) => onlyNumbers(v)]"
                />
              </div>
              <div class="tw-col-span-4">
                <p class="tw-text-label">Nombres del Remitente *</p>
                <q-input
                  outlined
                  v-model="formData.nombresRemitente"
                  label="Inserte"
                  dense
                  :rules="[(v) => lengthInput(200, v), inputRequired, alphabeticalWithSpecialCharacters]"
                />
              </div>
              <div class="tw-col-span-4">
                <q-checkbox
                  v-model="formData.remitenteAfectado"
                  class='tw-text-slate-600 tw-font-semibold tw-border tw-border-slate-300 tw-pl-3 tw-pr-6 tw-rounded-md'
                  label="Los datos del remitente son los mismos del afectado"
                  size="md"
                  dense
                />
              </div>
            </div>
          </section>
        </q-expansion-item>

        <q-expansion-item
          label="Datos del afectado"
          header-class="tw-text-xl tw-font-bold"
          class="tw-mt-5"
        >
          <section>
            <div class="tw-grid tw-grid-cols-6 tw-gap-4 tw-pl-6">
              <div class="tw-col-span-3">
                <p class="tw-text-label">Tipo de Documento *</p>
                <q-select
                  :options="tipoDocumento"
                  map-options
                  emit-value
                  :rules="[inputRequired]"
                  outlined
                  v-model="formData.tipoDocumentoAfectado"
                  label="Inserte"
                  dense
                />
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label">Numero de Documento *</p>
                <q-input
                  type="number"
                  outlined
                  v-model="formData.numeroDocumentoAfectado"
                  label="Inserte"
                  dense
                  :rules="[
                    (v) => lengthInput(15, v),
                    Number(formData.tipoDocumentoAfectado) == 11 ? alphanumeric : (v: string) => onlyNumbers(v),
                    inputRequired,
                  ]"
                />
              </div>
              <div class="tw-col-span-6">
                <p class="tw-text-label">Nombres del afectado *</p>
                <q-input
                  outlined
                  v-model="formData.nombresAfectado"
                  label="Inserte"
                  dense
                  :rules="[(v) => lengthInput(100, v), inputRequired]"
                />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label">¿Pertenece a la Comunidad LGTBTQ? *</p>
                <q-select
                  :options="[
                    { label: 'Si', value: true },
                    { label: 'No', value: false },
                  ]"
                  map-options
                  emit-value
                  outlined
                  v-model="formData.lgtbtq"
                  label="Inserte"
                  dense
                  :rules="[inputRequired]"
                />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label">Sexo *</p>
                <q-select
                  :options="genOptions"
                  map-options
                  emit-value
                  outlined
                  v-model="formData.sexo"
                  label="Inserte"
                  dense
                  :rules="[inputRequired]"
                />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label">Condición Especial *</p>
                <q-select
                  :options="condicionEspecialOptions"
                  map-options
                  emit-value
                  outlined
                  v-model="formData.condicionEspecial"
                  :rules="[inputRequired]"
                  label="Inserte"
                  dense
                />
              </div>
            </div>
          </section>
        </q-expansion-item>

        <q-expansion-item
          label="Medios de contacto y envio de respuesta (afectado)"
          header-class="tw-text-xl tw-font-bold"
          class="tw-mt-5"
        >
          <section>
            <div class="tw-grid tw-grid-cols-6 tw-gap-4 tw-pl-6">
              <div class="tw-col-span-2">
                <p class="tw-text-label">
                  Correo Electrónico
                  {{ formData.medioRespuestaContacto == "1" ? "*" : "" }}
                </p>
                <q-input
                  outlined
                  v-model="formData.correoAfectado"
                  label="Inserte"
                  dense
                  :rules="
                    formData.medioRespuestaContacto == '1'
                      ? [inputRequired, (v) => validationEmail(v)]
                      : [(v) => validationEmail(v)]
                  "
                />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label">Teléfono celular</p>
                <q-input
                  outlined
                  v-model="formData.tlfCelularAfectado"
                  label="Inserte"
                  dense
                  :rules="[(v) => lengthInput(11, v), mobilePhonNumber]"
                />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label">Teléfono fijo</p>
                <q-input
                  outlined
                  v-model="formData.tlfFijoAfectado"
                  label="Inserte"
                  dense
                  :rules="[
                    (v) => onlyNumbers(v),
                    (v) => maxLengthInput(10, v),
                    (v) => minLengthInput(7, v),
                  ]"
                />
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label">País de contacto *</p>
                <q-select
                  :options="paiseOptions"
                  map-options
                  emit-value
                  :rules="[inputRequired]"
                  outlined
                  v-model="formData.paisContacto"
                  label="Inserte"
                  dense
                />
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label">Departamento de contacto *</p>
                <q-select
                  :options="departamentoOptions"
                  map-options
                  emit-value
                  :rules="[inputRequired]"
                  outlined
                  v-model="formData.departamentoContacto"
                  label="Inserte"
                  dense
                />
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label">Municipio de contacto *</p>
                <q-select
                  :options="municipioOptions"
                  map-options
                  emit-value
                  :rules="[inputRequired]"
                  outlined
                  v-model="formData.ciudadContacto"
                  label="Inserte"
                  dense
                />
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label">
                  Dirección de contacto
                  {{ formData.medioRespuestaContacto == "2" ? "*" : "" }}
                </p>
                <q-input
                  outlined
                  v-model="formData.direccionContacto"
                  label="Inserte"
                  dense
                  :rules="
                    formData.medioRespuestaContacto == '2'
                      ? [(v) => lengthInput(20, v), inputRequired]
                      : [(v) => lengthInput(20, v)]
                  "
                />
              </div>
              <div class="tw-col-span-6">
                <p class="tw-text-label">
                  Medio por el que desea recibir respuesta *
                </p>
                <q-select
                  :options="medioOptions"
                  map-options
                  emit-value
                  :rules="[
                    inputRequired,
                    (v) =>
                      v.value === 1 && formData.correoAfectado === ''
                        ? 'Por favor diligencie correo electrónico del remitente para autorizar envío de respuesta por medio electrónico'
                        : true,
                    (v) =>
                      v.value === 2 && formData.direccionContacto === ''
                        ? 'Por favor diligencie dirección de remitente para autorizar envío de respuesta por este medio físico'
                        : true,
                  ]"
                  outlined
                  v-model="formData.medioRespuestaContacto"
                  label="Inserte"
                  dense
                />
              </div>
            </div>
          </section>
        </q-expansion-item>

        <q-expansion-item
          label="Solicitud"
          header-class="tw-text-xl tw-font-bold"
          class="tw-mt-5"
        >
          <section>
            <div class="tw-grid tw-grid-cols-6 tw-gap-4 tw-pl-6">
              <div class="tw-col-span-3">
                <p class="tw-text-label">Tipología de la PQRD *</p>
                <q-select
                  :options="tipoPqrdOptions"
                  map-options
                  emit-value
                  :rules="[inputRequired]"
                  outlined
                  v-model="formData.tipologiaPQRD"
                  label="Inserte"
                  dense
                />
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label">Tipo de solicitud *</p>
                <q-select
                  :options="tipoSolicitudOptions"
                  :rules="[inputRequired]"
                  outlined
                  map-options
                  emit-value
                  v-model="formData.tipoSolicitud"
                  label="Inserte"
                  dense
                />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label">Producto *</p>
                <q-select
                  :options="tipoProductoOptions.filter((v) => v.value !== null)"
                  map-options
                  emit-value
                  :rules="[inputRequired]"
                  outlined
                  v-model="formData.producto"
                  label="Inserte"
                  dense
                />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label">Acceso a Información Pública *</p>
                <q-select
                  :options="[
                    { label: 'Sí', value: true },
                    { label: 'No', value: false },
                  ]"
                  map-options
                  emit-value
                  outlined
                  v-model="formData.accesopPublico"
                  label="Inserte"
                  dense
                />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label">Descripción - Acceso a Información</p>
                <q-select
                  :options="[
                    { label: 'Reservada', value: 1 },
                    { label: 'Clasificada', value: 2 },
                  ]"
                  map-options
                  emit-value
                  :disable="!formData.accesopPublico"
                  :rules="[inputRequired]"
                  outlined
                  v-model="formData.descripcionAccesoInfo"
                  label="Inserte"
                  dense
                />
              </div>
              <div class="tw-col-span-6">
                <p class="tw-text-label">Observaciones *</p>
                <q-input
                  type="textarea"
                  :rules="[inputRequired, (v) => lengthInput(1500, v)]"
                  outlined
                  dense
                  v-model:model-value="formData.observaciones"
                />
              </div>
              <div class="tw-col-span-6">
                <p class="tw-text-label">Adjuntar documentos de soporte *</p>
                <FileLoader
                  :max-file-size="5 * 1024 * 1024"
                  max-file-size-label="5MB"
                  v-model:model-value="formData.documentos"
                  :rules="[inputRequired]"
                  accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
                >
                </FileLoader>
              </div>
            </div>
          </section>
        </q-expansion-item>
      </q-form>
    </div>

    <div
      v-if="step == 2"
      class="tw-flex tw-justify-center tw-items-center tw-flex-col tw-h-screen"
    >
      <otp
        :email="formData.direccionContacto"
        :digitCount="8"
        @submit="step++"
        :step="step"
      ></otp>
    </div>

    <div v-if="step == 3">
      <successPage :ent="entCode"></successPage>
    </div>
    <div
      class="col col-12 row justify-center tw-w-full tw-m-[10px] tw-mt-10 tw-flex tw-gap-4"
      v-if="step !== 3"
    >
      <q-btn
        label="Cancelar"
        style="width: 240px"
        color="accent"
        textColor="black"
        class="tw-rounded-xl tw-p-3"
      />
      <q-btn
        type="submit"
        label="Radicar"
        style="width: 240px"
        @click="submit"
        color="secondary"
        textColor="white"
        class="tw-rounded-xl tw-p-3"
      />
    </div>
    <div
      class="col col-12 row justify-center tw-w-full tw-m-[10px] tw-mt-10 tw-flex tw-gap-4"
      v-else
    >
      <button class="btn btn-primary" @click="clear">Atrás</button>
    </div>
  </q-card>
</template>

<script lang="ts" setup>
import { onUpdated, onMounted, Ref, ref, watch } from "vue";
import BreadCrumbs from "components/BreadCrumbs/BreadCrumbs.vue";
import FileLoader from "components/FormFields/FileLoader.vue";
import otp from "./confirmacion.vue";
import successPage from "./exitoso.vue";
import { adminAxios, sgdeaAxios } from "src/services";
import { useDepartments, useMunicipalities } from "src/composables/useVersion";
import {
  tipoRemitente,
  tipoDocumento,
  condicionEspecialOptions,
  genOptions,
  medioOptions,
  tipoSolicitudOptions,
  tipoProductoOptions,
  tipoPqrdOptions,
} from "src/constantes/options";
import {
  homePhoneNumber,
  inputRequired,
  lengthInput,
  mobilePhonNumber,
  validationEmail,
  minLengthInput,
  maxLengthInput,
  alphanumeric,
  onlyNumbers,
  alphabeticalWithSpecialCharacters
} from "src/helpers/validations";
import { PQRD, SelectInput } from "src/interfaces";
import { useLoadingStore } from "src/stores/loading.store";

interface PQRDResponse {
  entry: {
    modifiedAt: string;
    nodeType: string;
    parentId: string;
    createdAt: string;
    name: string;
    id: string;
    file: boolean;
    folder: boolean;
  };
}

const step = ref(1);
const form = ref();
const entCode = ref("");
const formData = ref({
  idRadicado: "",
  tipoRemitente: "",
  tipoDocumentoRemitente: "",
  numeroDocumentoRemitente: "",
  nombresRemitente: "",
  tipoDocumentoAfectado: "",
  numeroDocumentoAfectado: "",
  nombresAfectado: "",
  lgtbtq: false,
  sexo: "",
  condicionEspecial: "",
  correoAfectado: "",
  tlfCelularAfectado: "",
  tlfFijoAfectado: "",
  paisContacto: "",
  departamentoContacto: "",
  ciudadContacto: "",
  remitenteAfectado: false,
  direccionContacto: "",
  medioRespuestaContacto: "",
  tipologiaPQRD: "",
  tipoSolicitud: "",
  producto: "",
  accesopPublico: false,
  descripcionAccesoInfo: 1,
  observaciones: "",
  documentos: "",
});
const paiseOptions: Ref<SelectInput[]> = ref([]);
const departamentoOptions: Ref<SelectInput[]> = ref([]);
const municipioOptions: Ref<SelectInput[]> = ref([]);

onMounted(async () => {
  await loadPaises();
  await loadDepartamentos();
  await loadMunicipios();

  const { data } = await sgdeaAxios.get<string>("/generar/secuencia/PQRD");
  formData.value.idRadicado = data;
});
async function loadPaises() {
  const { data } = await adminAxios.get("/paises/list");
  paiseOptions.value = [
    ...data.map((val: any) => {
      return {
        label: val.nombre,
        value: val.idPais,
      };
    }),
  ];

  //@ts-ignore
  formData.value.paisContacto = paiseOptions.value.find(
    (val) => val.value === 204
  );
}

async function loadDepartamentos() {
  const { data: formData } = await adminAxios.get("/departamentos/list");
  departamentoOptions.value = formData.map((val: any) => {
    return {
      label: val.nombre,
      value: val.idDepartamento,
    };
  });
}

async function loadMunicipios() {
  const { data: formData } = await adminAxios.get("/municipios/list");
  municipioOptions.value = formData.map((val: any) => {
    return {
      label: val.nombre,
      value: val.idDepartamento,
    };
  });
}

async function increment() {
  step.value === 3 ? (step.value = 1) : step.value++;
}
watch(
  () => formData.value.paisContacto,
  async (value) => {
    //@ts-ignore
    const { optionsDepartments } = await useDepartments(value.value);
    departamentoOptions.value = optionsDepartments.value;
  }
);

watch(
  () => formData.value.departamentoContacto,
  async (value) => {
    //@ts-ignore
    const { optionsMunicipalities } = await useMunicipalities(value);
    municipioOptions.value = optionsMunicipalities.value;
  }
);

watch(
  () => formData.value.remitenteAfectado,
  async (value) => {
    if (value) {
      formData.value = {
        ...formData.value,
        tipoDocumentoAfectado: formData.value.tipoDocumentoRemitente,
        nombresAfectado: formData.value.nombresRemitente,
        numeroDocumentoAfectado: formData.value.numeroDocumentoRemitente,
      };
    }
  }
);

const routes = [
  {
    name: "Inicio",
    to: "/",
  },

  {
    name: "Módulo SGDEA",
  },

  {
    name: "RadicaciÓn de PQRD",
  },
];

const submit = async () => {
  if (form.value.validate()) {

    const data = new FormData();

    /* FILLING DATAFORM */
    data.append(
      "remitenteNumeroDocumento",
      formData.value.numeroDocumentoRemitente.toString()
    );
    data.append("remitenteNombre", formData.value.nombresRemitente);
    data.append(
      "remitenteTipoRemitente",
      formData.value.tipoRemitente.toString()
    );
    data.append(
      "remitenteTipoDocumento",
      formData.value.tipoDocumentoRemitente.toString()
    );

    data.append("afectadoNombre", formData.value.nombresAfectado);
    data.append(
      "afectadoNumeroDocumento",
      formData.value.numeroDocumentoAfectado.toString()
    );
    data.append(
      "afectadoTipoDocumento",
      formData.value.tipoDocumentoAfectado.toString()
    );
    data.append("afectadoGenero", formData.value.sexo.toString());
    data.append(
      "afectadoCondicionEspecial",
      formData.value.condicionEspecial.toString()
    );
    //@ts-ignore
    data.append("afectadoLgtbtq", formData.value.lgtbtq);
    data.append(
      "afectado.tipoRemitente",
      formData.value.tipoRemitente.toString()
    );

    data.append(
      "medioContactoRespuesta",
      formData.value.medioRespuestaContacto.toString()
    );
    data.append(
      "medioContactoDepartamento",
      formData.value.departamentoContacto.toString()
    );
    data.append(
      "medioContactoTelefonoFijo",
      formData.value.tlfFijoAfectado.toString()
    );
    data.append(
      "medioContactoCiudad",
      formData.value.ciudadContacto.toString()
    );
    data.append(
      "medioContactoCorreoElectronico",
      formData.value.correoAfectado
    );
    data.append("medioContactoDireccion", formData.value.direccionContacto);
    //@ts-ignore
    data.append(
      "medioContactoPais",
      formData.value.paisContacto.value.toString()
    );
    data.append(
      "medioContactoTelefonoCelular",
      formData.value.tlfCelularAfectado.toString()
    );

    data.append("solicitudTipoPqrd", formData.value.tipologiaPQRD.toString());
    data.append("solicitudObservaciones", formData.value.observaciones);
    data.append("solicitudTipoproducto", formData.value.producto.toString());
    data.append(
      "solicitudTipoSolicitud",
      formData.value.tipoSolicitud.toString()
    );
    data.append(
      "solicitudAccesoInformacionPublica",
      String(formData.value.accesopPublico)
    );
    data.append("idRadicado", String(formData.value.idRadicado));
    data.append(
      "solicitudDescripcionAccesoInformacion",
      formData.value.descripcionAccesoInfo
    );

    data.append("canal", "2");
    data.append("producto", "2");
    data.append("documentoSoporteId", "2");

    let uscr = "admin";
    let tipoTramite = 12;
    //@ts-ignore
    formData.value.documentos.forEach((element) => {
      data.append("anexos", element);
    });
    data.append("usuarioCreador", uscr);
    data.append("tipoTramite", tipoTramite.toString());

    const response = await sgdeaAxios.post<PQRDResponse>(
      "/pqrd/radicar-pqrd",
      data
    );

    if ([200, 201].includes(response.status)) {
      entCode.value = response.data.entry.name;
      increment();
      increment();
    }
  }
};

const clear = () => {
  step.value = 1;

  formData.value = {
    idRadicado: "",
    tipoRemitente: "",
    tipoDocumentoRemitente: "",
    numeroDocumentoRemitente: "",
    nombresRemitente: "",
    tipoDocumentoAfectado: "",
    numeroDocumentoAfectado: "",
    nombresAfectado: "",
    lgtbtq: false,
    sexo: "",
    condicionEspecial: "",
    correoAfectado: "",
    tlfCelularAfectado: "",
    tlfFijoAfectado: "",
    paisContacto: "",
    departamentoContacto: "",
    ciudadContacto: "",
    remitenteAfectado: false,
    direccionContacto: "",
    medioRespuestaContacto: "",
    tipologiaPQRD: "",
    tipoSolicitud: "",
    producto: "",
    accesopPublico: false,
    descripcionAccesoInfo: 1,
    observaciones: "",
    documentos: "",
  };
};

</script>

<style lang="scss">
.container-buttons {
  display: flex;
  justify-content: center;
  margin-top: 180px;
}
</style>
