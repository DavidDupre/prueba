<template>
  <section class="tw-flex tw-flex-row tw-bg-bg">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
      <div class="tw-flex tw-justify-between tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold">Administración Adquirientes</h1>
      </div>

      <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
        <q-expansion-item expand-separator id="facturacion-manual" default-opened>
          <template v-slot:header>
            <div class="col row">
              <p class="tw-text-2xl tw-font-bold">
                Editar / Crear Adquirientes
              </p>
            </div>
          </template>

          <q-form @submit.prevent="searchAdquirientes" class="tw-mt-2">
            <label>
              <span class="tw-text-[#6B737C] tw-font-bold">NIT / Número de Documento</span>
              <q-input v-model="searchInput" type="search" mask="\N\I###############"
                :rules="[inputRequired, alphanumeric]" outlined placeholder="Inserte" class="tw-rounded-lg tw-mt-2">
                <template v-slot:prepend> <q-icon name="search" /> </template>
              </q-input>
            </label>

            <div class="tw-flex tw-justify-center tw-items-center">
              <q-btn color="secondary" label="Buscar"
                style="width: 130px; height: 40px; border-radius: 8px; font-size: 16px;" type="submit" />
            </div>
          </q-form>
        </q-expansion-item>
      </q-card>

      <template v-if="adquirienteStatus">
        <q-form ref="formValidate" greedy>
          <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
            <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
              <q-expansion-item expand-separator id="facturacion-manual-crear-adquiriente" default-opened>
                <template v-slot:header>
                  <div class="col row">
                    <p class="tw-text-2xl tw-font-bold">Información adquiriente</p>
                  </div>
                </template>

                <div class="tw-mt-2">
                  <div class="row q-col-gutter-md q-pb-md q-px-md">
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Tipo de persona *</label>
                        <q-select v-model="formInfo.tipoPersonaId" input-debounce="0" map-options label="Seleccione"
                          :options="opTipoPersona" dense outlined class="tw-rounded-lg" :rules="[inputRequired]"
                          :readonly="readOnly">
                        </q-select>
                      </span>
                    </div>

                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Tipo de régimen *</label>
                        <q-select v-model="formInfo.tipoRegimenId" :options="opTipoRegimen" :rules="[inputRequired]"
                          input-debounce="0" map-options label="Seleccione" dense outlined class="tw-rounded-lg"
                          :readonly="readOnly">
                        </q-select>
                      </span>
                    </div>

                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Tipo de documento *</label>
                        <q-select v-model="formInfo.tipoDocumentoId" input-debounce="0" :options="opTipoDoc"
                          label="Seleccione" map-options dense outlined class="tw-rounded-lg" :rules="[inputRequired]"
                          :readonly="readOnly">
                        </q-select>
                      </span>
                    </div>

                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Número documento Sin Dígito Verificación *</label>
                        <q-input v-model="formInfo.numeroDocumento" input-debounce="0" :rules="[inputRequired]" dense
                          label="Inserte" outlined class="tw-rounded-lg" :readonly="true" filled>
                        </q-input>
                      </span>
                    </div>

                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6"
                      v-if="formInfo.tipoPersonaId.id == 1 || formInfo.tipoPersonaId.value == 1">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Razón social *</label>
                        <q-input v-model="formInfo.razonSocial"
                          :rules="[(v) => minLengthInput(7, v), alphanumeric, inputRequired]" input-debounce="0" dense
                          label="Inserte" outlined class="tw-rounded-lg" :readonly="readOnly">
                        </q-input>
                      </span>
                    </div>

                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6"
                      v-if="formInfo.tipoPersonaId.id == 1 || formInfo.tipoPersonaId.value == 1">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Nombre comercial *</label>
                        <q-input v-model="formInfo.nombreComercial" input-debounce="0"
                          :rules="[(v) => maxLengthInput(80, v), inputRequired, alphanumeric]" dense label="Inserte"
                          outlined class="tw-rounded-lg" :readonly="readOnly">
                        </q-input>
                      </span>
                    </div>

                    <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3"
                      v-if="formInfo.tipoPersonaId.id == 2 || formInfo.tipoPersonaId.value == 2">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Primer apellido *</label>
                        <q-input v-model="formInfo.primerApellido" input-debounce="0"
                          :rules="[(v) => minLengthInput(2, v), alphanumeric, inputRequired]" dense label="Inserte"
                          outlined class="tw-rounded-lg" :readonly="readOnly">
                        </q-input>
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3"
                      v-if="formInfo.tipoPersonaId.id == 2 || formInfo.tipoPersonaId.value == 2">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Segundo apellido</label>
                        <q-input v-model="formInfo.segundoApellido" input-debounce="0"
                          :rules="[(v) => minLengthInput(2, v), alphanumeric]" dense label="Inserte" outlined
                          class="tw-rounded-lg" :readonly="readOnly">
                        </q-input>
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3"
                      v-if="formInfo.tipoPersonaId.id == 2 || formInfo.tipoPersonaId.value == 2">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Primer nombre *</label>
                        <q-input v-model="formInfo.primerNombre" input-debounce="0"
                          :rules="[(v) => minLengthInput(2, v), alphanumeric, inputRequired]" dense label="Inserte"
                          outlined class="tw-rounded-lg" :readonly="readOnly">
                        </q-input>
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3"
                      v-if="formInfo.tipoPersonaId.id == 2 || formInfo.tipoPersonaId.value == 2">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Otros nombres</label>
                        <q-input v-model="formInfo.otrosNombres" input-debounce="0"
                          :rules="[(v) => minLengthInput(2, v), alphanumeric]" dense label="Inserte" outlined
                          class="tw-rounded-lg" :readonly="readOnly">
                        </q-input>
                      </span>
                    </div>

                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                      <span class="tw-w-full">
                        <label class="tw-text-label">País *</label>
                        <q-select v-model="formInfo.paisId" :options="optionsCountries" input-debounce="0"
                          label="Seleccione" dense outlined class="tw-rounded-lg" :rules="[inputRequired]"
                          :readonly="readOnly">
                        </q-select>
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Departamento *</label>
                        <q-select v-model="formInfo.departamentoId"
                          :disable="formInfo.paisId.value != 425 ? true : false" :options="departamentoOptions"
                          input-debounce="0" label="Seleccione" dense outlined class="tw-rounded-lg"
                          :readonly="readOnly" :rules="[inputRequired]">
                        </q-select>
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Municipio *</label>
                        <q-select v-model="formInfo.municipioId" :disable="formInfo.paisId.value != 425 ? true : false"
                          :options="municipioOptions" map-options input-debounce="0" label="Seleccione" dense outlined
                          :readonly="readOnly" class="tw-rounded-lg" :rules="[inputRequired]">
                        </q-select>
                      </span>
                    </div>

                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Dirección *</label>
                        <q-input v-model="formInfo.direccion" input-debounce="0"
                          :rules="[inputRequired, (v) => maxLengthInput(100, v)]" dense label="Inserte" outlined
                          :readonly="readOnly" class="tw-rounded-lg">
                        </q-input>
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Localidad</label>
                        <q-input v-model="formInfo.localidad" input-debounce="0"
                          :rules="[alphanumeric, (v) => maxLengthInput(100, v)]" dense label="Inserte" outlined
                          :readonly="readOnly" class="tw-rounded-lg">
                        </q-input>
                      </span>
                    </div>

                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Teléfono *</label>
                        <q-input v-model="formInfo.telefono" input-debounce="0"
                          :rules="[mobilePhoneNumberTenToTwelve, inputRequired]" dense label="Inserte" outlined
                          :readonly="readOnly" class="tw-rounded-lg">
                        </q-input>
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Correo Principal *</label>
                        <q-input v-model="formInfo.correoPrincipal" input-debounce="0"
                          :rules="[validationEmail, inputRequired, (v) => maxLengthInput(100, v)]" dense label="Inserte"
                          :readonly="readOnly" outlined class="tw-rounded-lg">
                        </q-input>
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Correo electrónico para Notificaciones *</label>
                        <q-input v-model="formInfo.correoNotificacion"
                          :rules="[validationEmail, (v) => maxLengthInput(200, v), inputRequired]" input-debounce="0"
                          :readonly="readOnly" dense label="Inserte" outlined class="tw-rounded-lg">
                        </q-input>
                      </span>
                    </div>
                  </div>
                </div>
              </q-expansion-item>
            </q-card>

            <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
              <q-expansion-item expand-separator id="facturacion-manual-crear-adquiriente-datos-adicionales"
                default-opened>
                <template v-slot:header>
                  <div class="col row">
                    <p class="tw-text-2xl tw-font-bold">Datos adicionales</p>
                  </div>
                </template>

                <div class="tw-mt-2">
                  <div class="row q-col-gutter-md q-pb-md q-px-md">
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Responsabilidad fiscal *</label>
                        <q-select v-model="formInfo.responsabilidadesFiscales"
                          :hint="'Cantidad seleccionada:' + formInfo?.responsabilidadesFiscales?.length" multiple
                          :options="opResponsabilidadFiscales" input-debounce="0" map-options label="Seleccione" dense
                          outlined class="tw-rounded-lg" :rules="[inputRequired]" :readonly="readOnly">
                        </q-select>
                      </span>
                    </div>

                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Tributos *</label>
                        <q-select v-model="formInfo.tributos"
                          :hint="'Cantidad seleccionada:' + formInfo?.tributos?.length" multiple input-debounce="0"
                          :options="opTributos" map-options label="Seleccione" dense outlined class="tw-rounded-lg"
                          :rules="[inputRequired]" :readonly="readOnly">
                        </q-select>
                      </span>
                    </div>
                  </div>
                </div>
              </q-expansion-item>
            </q-card>
            <div class="col row justify-center q-gutter-x-md q-my-md">
              <q-btn v-if="!readOnly" color="accent" textColor="secondary" label="Cancelar" style="
                width: 130px;
                height: 40px;
                border-radius: 8px;
                font-size: 16px;
                " type="reset" no-caps @click="cancelModal = true" />

              <q-btn v-if="!readOnly" color="primary" label="Guardar" style="
                width: 130px;
                height: 40px;
                border-radius: 8px;
                font-size: 16px;
                " @click="ValidateAdquiriente" :loading="handleSubmitIsLoading" />

              <q-btn v-if="readOnly" color="primary" label="Editar" style="
                width: 130px;
                height: 40px;
                border-radius: 8px;
                font-size: 16px;
                " @click="readOnlyInfo" />
            </div>
          </q-card>
        </q-form>
      </template>
      <template v-else>
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <div class="tw-flex tw-items-center tw-justify-center tw-h-96 tw-my-10 tw-gap-4 tw-flex-col">
            <img v-lazy :data-url="AdquirienteNotFoundImage" alt="Adquirientes no encontrados" />
            <div class="tw-text-center">
              <h3 class="tw-font-bold tw-text-[#2C3948] tw-text-lg">
                Adquiriente no encontrado
              </h3>
              <p>Por favor diligencie los datos solicitados para crear uno</p>
            </div>

            <router-link to="/facturacion/manual/crear">
              <q-btn flat color="primary" label="Crear" icon="add" />
            </router-link>
          </div>
        </q-card>
      </template>
      <Modal v-model="cancelModal" title="¡Espera un momento!" :is-success="false" text-button="Si"
        @handleAccept="resetForm()" cancel-button text-button-cancel="No"
        text="¿Está seguro de cancelar la actualización del adquiriente?" @close-modal="cancelModal = false" type="button" />

      <Modal v-model="secureModal" title="¡Espera un momento!" :is-success="false" text-button="Si"
        @handleAccept="editarAdquiriente" cancel-button text-button-cancel="No"
        text="¿Está seguro de editar el adquiriente?" @close-modal="secureModal = false" type="button" />

      <Modal v-model="successModal" title="El adquiriente ha sido actualizado con éxito" :is-success="true"
        text-button="Ok" @handleAccept="resetForm" @close-modal="successModal = false" type="button" />
    </main>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref, watch } from "vue";
import { maxLengthInput, inputRequired, minLengthInput, alphanumeric, validationEmail } from "src/helpers/validations";
// @ts-ignore
import AdquirienteNotFoundImage from "src/assets/asquiriente-not-found.svg";
import { useCountries, useDepartmentsbyOpen, useMunicipalities } from "src/composables/useVersion";
import Modal from "components/Modal/Modal.vue";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { SelectInput } from "src/interfaces";

const searchInput = ref<string>("");
const adquirienteStatus = ref<boolean>(false);
const secureModal = ref<boolean>(false)
const successModal = ref<boolean>(false)
const { optionsCountries } = useCountries()
const departamentoOptions: Ref<any[]> = ref([]);
const municipioOptions: Ref<any[]> = ref([]);
const opResponsabilidadFiscales = ref<SelectInput[]>([]);
const opTributos = ref<SelectInput[]>([]);
const opTipoPersona = ref<SelectInput[]>([]);
const opTipoRegimen = ref<SelectInput[]>([]);
const opTipoDoc = ref<SelectInput[]>([]);
const formValidate = ref();
const readOnly = ref<boolean>(true)
const handleSubmitIsLoading = ref<boolean>(false);
const cancelModal = ref(false)

type FormInfoType = {
  id?: number;
  tipoPersonaId: string;
  tipoRegimenId: string;
  tipoDocumentoId: string;
  numeroDocumento: string;
  razonSocial: string;
  nombreComercial: string;
  primerApellido: string;
  segundoApellido: string;
  primerNombre: string;
  otrosNombres: string;
  paisId: any;
  departamentoId: string;
  municipioId: string;
  direccion: string;
  localidad: string;
  telefono: string;
  correoPrincipal: string;
  correoNotificacion: string;
};

type FormAditionalDataType = {
  responsabilidadesFiscales: any;
  tributos: any;
};

const formInfo: any = ref<FormInfoType & FormAditionalDataType>({
  id: 0,
  tipoPersonaId: "",
  tipoRegimenId: "",
  tipoDocumentoId: "",
  numeroDocumento: "",
  razonSocial: "",
  nombreComercial: "",
  primerApellido: "",
  segundoApellido: "",
  primerNombre: "",
  otrosNombres: "",
  paisId: { label: 'Colombia', value: 425 },
  departamentoId: "",
  municipioId: "",
  direccion: "",
  localidad: "",
  telefono: "",
  correoPrincipal: "",
  correoNotificacion: "",
  responsabilidadesFiscales: [],
  tributos: [],
});

onMounted(async () => {
  await getData()
});

const getData = async () => {
  const { optionsDepartments } = await useDepartmentsbyOpen(formInfo.value.paisId.value);
  departamentoOptions.value = optionsDepartments.value;

  const tipoPersonaResponse = await sgdeaAxios.get('/facManual/listadoTipoPersona');
  opTipoPersona.value = tipoPersonaResponse.data.map(({ id, nombre }) => ({ value: id, label: nombre }));

  const tipoRegimenResponse = await sgdeaAxios.get('/facManual/listadoTipoRegimen');
  opTipoRegimen.value = tipoRegimenResponse.data.map(({ id, nombre }) => ({ value: id, label: nombre }));

  const tipoDoc = await sgdeaAxios.get('/facManual/listadoTiposDocumentoOpen')
  opTipoDoc.value = tipoDoc.data.map(({ tdo_id, tdo_descripcion, tdo_codigo }) => ({ value: tdo_id, label: tdo_descripcion, codigo: tdo_codigo }))

  const responsabilidadesFiscalesResponse = await sgdeaAxios.get('/facManual/listadoResponsabilidadesFiscalesOpen');
  opResponsabilidadFiscales.value = responsabilidadesFiscalesResponse.data.map(({ ref_id, ref_descripcion, ref_codigo }) => ({ value: ref_id, label: ref_descripcion, codigo: ref_codigo }));

  const tributosResponse = await sgdeaAxios.get('/facManual/listadoTributosOpen');
  opTributos.value = tributosResponse.data.map(({ tri_id, tri_descripcion, tri_codigo }) => ({ value: tri_id, label: tri_descripcion, codigo: tri_codigo }));
};

async function ValidateAdquiriente() {
  if (await formValidate.value.validate()) {
    secureModal.value = true
  } else {
    toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos.")
  }
}

async function editarAdquiriente() {
  handleSubmitIsLoading.value = true;
  const formEnviar: any = {}

  for (const key in formInfo.value) {
    if (key === 'tipoPersonaId') {
      formEnviar['tipoPersonaId'] = {
        id: formInfo.value[key].value,
        nombre: formInfo.value[key].label
      };
    } else if (key === 'tipoRegimenId') {
      formEnviar['tipoRegimenId'] = {
        id: formInfo.value[key].value,
        nombre: formInfo.value[key].label
      };
    } else if (key === 'tipoDocumentoId') {
      formEnviar['tipoDocumentoId'] = {
        tdo_id: formInfo.value[key].value,
        tdo_codigo: formInfo.value[key].codigo,
        tdo_descripcion: formInfo.value[key].label
      };
    } else if (key === 'paisId') {
      formEnviar['paisId'] = {
        idPais: formInfo.value[key].value,
        nombre: formInfo.value[key].label
      };
    } else if (key === 'departamentoId') {
      formEnviar['departamentoId'] = {
        idDepartamento: formInfo.value[key].value,
        nombre: formInfo.value[key].label,
        codigoDivipola: formInfo.value[key].codigoDivipola
      };
    } else if (key === 'municipioId') {
      formEnviar['municipioId'] = {
        idMunicipio: formInfo.value[key].value,
        nombre: formInfo.value[key].label,
        codigoDivipola: formInfo.value[key].codigoDivipola
      };
    } else if (key === 'responsabilidadesFiscales') {
      formEnviar[key] = [...formInfo.value[key]].map(({ value, label, codigo }) => ({ ref_id: value, ref_codigo: codigo, ref_descripcion: label }));
    } else if (key === 'tributos') {
      formEnviar[key] = [...formInfo.value[key]].map(({ value, label, codigo }) => ({ tri_id: value, tri_codigo: codigo, tri_descripcion: label }));
    } else if (Array.isArray(formInfo.value[key])) {
      formEnviar[key] = [...formInfo.value[key]].map(({ value, label }) => ({ id: value, nombre: label }));
    } else {
      formEnviar[key] = formInfo.value[key];
    }
  }

  if (formEnviar.tipoPersonaId.id == 1) {
    formEnviar.primerNombre = 'N/A'
    formEnviar.primerApellido = 'N/A'
    formEnviar.segundoApellido = 'N/A'
    formEnviar.otrosNombres = 'N/A'
  } else if (formEnviar.tipoPersonaId.id == 2) {
    formEnviar.razonSocial = 'N/A'
    formEnviar.nombreComercial = 'N/A'
  }

  if (formEnviar.paisId.idPais !== 425) {
    formEnviar.departamentoId = null
    formEnviar.municipioId = null
  }

  try {
    const response = await sgdeaAxios.put(`/facManual/actualizarAdquirienteFacManual`, formEnviar);
    if (response.status === 200) {
      successModal.value = true;
      handleSubmitIsLoading.value = false;
    }
  } catch (error) {
    toast.error(error.response.data.message);
    console.error(error);
    handleSubmitIsLoading.value = false;
  }
}

watch(
  () => formInfo.value.paisId.value,
  async (value) => {
    if (value != 425) {
      formInfo.value.departamentoId = formInfo.value.paisId.label
      formInfo.value.municipioId = formInfo.value.paisId.label
      departamentoOptions.value = []
      municipioOptions.value = []
    } else {
      formInfo.value.departamentoId = ''
      formInfo.value.municipioId = ''
      const { optionsDepartments } = await useDepartmentsbyOpen(value);
      departamentoOptions.value = optionsDepartments.value;
    }
  }
);

watch(
  () => formInfo.value.departamentoId?.value,
  async (value) => {
    if (formInfo.value.paisId.value !== 425) {
      formInfo.value.municipioId = ''
    }
    const { optionsMunicipalities } = await useMunicipalities(value);
    municipioOptions.value = optionsMunicipalities.value;
  }
);

const resetForm = async () => {
  readOnly.value = true
  await searchAdquirientes()
};

const readOnlyInfo = () => {
  readOnly.value = false
}

const searchAdquirientes = async () => {
  try {
    const response = await sgdeaAxios.get(`/facManual/listadoAdquirienteFacturaManualXDocumento/${searchInput.value.replace("NI", "")}`);

    if (Array.isArray(response.data) && response.data.length === 0) {
      adquirienteStatus.value = false;
    } else {
      adquirienteStatus.value = true;
      const adquiriente = response.data[0];
      for (const key in adquiriente) {
        if (Object.prototype.hasOwnProperty.call(adquiriente, key)) {
          const element = adquiriente[key];

          if (key === 'tipoPersonaId') {
            formInfo.value.tipoPersonaId = {
              value: element.id,
              label: element.nombre,
              id: element.id
            };

          } else if (key === 'tipoRegimenId') {
            formInfo.value.tipoRegimenId = {
              value: element.id,
              id: element.id,
              label: element.nombre
            };

          } else if (key === 'tipoDocumentoId') {
            formInfo.value.tipoDocumentoId = {
              label: element.tdo_descripcion,
              value: element.tdo_id,
              codigo: element.tdo_codigo
            };

          } else if (key === 'paisId') {
            formInfo.value.paisId = {
              value: element.idPais,
              label: element.nombre
            };

          } else if (key === 'departamentoId') {
            formInfo.value.departamentoId = {
              value: element.idDepartamento,
              label: element.nombre,
              codigoDivipola: element?.codigoDivipola
            };

          } else if (key === 'municipioId') {
            formInfo.value.municipioId = {
              value: element.idMunicipio,
              label: element.nombre,
              codigoDivipola: element?.codigoDivipola
            };

          } else if (key === 'responsabilidadesFiscales') {
            formInfo.value[key] = element?.map(({ ref_id, ref_descripcion, ref_codigo }) => ({ value: ref_id, codigo: ref_codigo, label: ref_descripcion })) ?? [];

          } else if (key === 'tributos') {
            formInfo.value[key] = element?.map(({ tri_id, tri_descripcion, tri_codigo }) => ({ value: tri_id, codigo: tri_codigo, label: tri_descripcion })) ?? [];

          } else if (Array.isArray(formInfo.value[key])) {
            formInfo.value[key] = element?.map(({ value, label }) => ({ id: value, nombre: label }));

          } else {
            formInfo.value[key] = element;
          }
        }
      }
    }
  } catch (error) {
    adquirienteStatus.value = false;
    console.error(error);
  }
};

const mobilePhoneNumberTenToTwelve = (val: string) => {
  const expresionRegular = /^(30|31|32|35)[0-9]{8,10}$/;
  if (val) {
    if (!expresionRegular.test(val)) {
      if (val.length < 7) {
        return "El número de teléfono debe contener al menos 7 dígitos";
      } else if (val.length > 12) {
        return "El número de teléfono no puede contener mas de 12 dígitos";
      }
    }
  }
};

</script>
