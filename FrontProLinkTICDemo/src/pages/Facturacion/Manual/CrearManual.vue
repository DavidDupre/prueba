<template>
  <section class="tw-flex tw-flex-row tw-bg-bg">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
      <div class="tw-pt-4">
        <router-link to="/facturacion/manual">
          <q-btn flat color="primary" label="Volver" icon="chevron_left" />
        </router-link>
      </div>

      <div class="tw-flex tw-justify-between tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold">Crear Adquiriente</h1>
      </div>

      <q-form ref="formValidate" greedy>
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <q-expansion-item expand-separator id="facturacion-manual-crear-adquiriente" default-opened>
            <template v-slot:header>
              <div class="col row">
                <p class="tw-text-2xl tw-font-bold">Información Adquiriente</p>
              </div>
            </template>

            <div class="tw-mt-2">
              <div class="row q-col-gutter-md q-pb-md q-px-md">
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Tipo de persona *</label>
                    <q-select v-model="formInfo.tipoPersona" input-debounce="0" map-options label="Seleccione"
                      :options="opTipoPersona" dense outlined class="tw-rounded-lg" :rules="[inputRequired]">
                    </q-select>
                  </span>
                </div>

                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Tipo de régimen *</label>
                    <q-select v-model="formInfo.tipoRegimen" :options="opTipoRegimen" :rules="[inputRequired]"
                      input-debounce="0" map-options label="Seleccione" dense outlined class="tw-rounded-lg">
                    </q-select>
                  </span>
                </div>

                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Tipo de documento *</label>
                    <q-select v-model="formInfo.tipoDocumento" input-debounce="0" :options="opTipoDoc"
                      label="Seleccione" dense outlined class="tw-rounded-lg" :rules="[inputRequired]">
                    </q-select>
                  </span>
                </div>

                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Número documento Sin Dígito Verificación *</label>
                    <q-input v-model="formInfo.numeroDocumento" input-debounce="0" :rules="[inputRequired]" dense
                      label="Inserte" outlined class="tw-rounded-lg">
                    </q-input>
                  </span>
                </div>

                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" v-if="formInfo.tipoPersona.value == 1">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Razón social *</label>
                    <q-input v-model="formInfo.razonSocial"
                      :rules="[(v) => minLengthInput(7, v), alphanumeric, inputRequired]" input-debounce="0" dense
                      label="Inserte" outlined class="tw-rounded-lg">
                    </q-input>
                  </span>
                </div>

                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" v-if="formInfo.tipoPersona.value == 1">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Nombre comercial *</label>
                    <q-input v-model="formInfo.nombreComercial" input-debounce="0"
                      :rules="[(v) => maxLengthInput(80, v), inputRequired, alphanumeric]" dense label="Inserte"
                      outlined class="tw-rounded-lg">
                    </q-input>
                  </span>
                </div>

                <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" v-if="formInfo.tipoPersona.value == 2">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Primer apellido *</label>
                    <q-input v-model="formInfo.primerApellido" input-debounce="0"
                      :rules="[(v) => minLengthInput(2, v), alphanumeric, inputRequired]" dense label="Inserte" outlined
                      class="tw-rounded-lg">
                    </q-input>
                  </span>
                </div>
                <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" v-if="formInfo.tipoPersona.value == 2">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Segundo apellido</label>
                    <q-input v-model="formInfo.segundoApellido" input-debounce="0"
                      :rules="[(v) => minLengthInput(2, v), alphanumeric]" dense label="Inserte" outlined
                      class="tw-rounded-lg">
                    </q-input>
                  </span>
                </div>
                <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" v-if="formInfo.tipoPersona.value == 2">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Primer nombre *</label>
                    <q-input v-model="formInfo.primerNombre" input-debounce="0"
                      :rules="[(v) => minLengthInput(2, v), alphanumeric, inputRequired]" dense label="Inserte" outlined
                      class="tw-rounded-lg">
                    </q-input>
                  </span>
                </div>
                <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" v-if="formInfo.tipoPersona.value == 2">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Otros nombres</label>
                    <q-input v-model="formInfo.otrosNombres" input-debounce="0"
                      :rules="[(v) => minLengthInput(2, v), alphanumeric]" dense label="Inserte" outlined
                      class="tw-rounded-lg">
                    </q-input>
                  </span>
                </div>

                <!-- País, departamento, minicipio selects -->
                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <span class="tw-w-full">
                    <label class="tw-text-label">País *</label>
                    <q-select v-model="formInfo.pais" :options="optionsCountries" input-debounce="0" label="Seleccione"
                      dense outlined class="tw-rounded-lg" :rules="[inputRequired]">
                    </q-select>
                  </span>
                </div>
                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Departamento *</label>
                    <q-select v-model="formInfo.departamento" :disable="formInfo.pais.value != 425 ? true : false"
                      :options="departamentoOptions" input-debounce="0" label="Seleccione" dense outlined
                      class="tw-rounded-lg" :rules="[inputRequired]">
                    </q-select>
                  </span>
                </div>
                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Municipio *</label>
                    <q-select v-model="formInfo.municipio" :disable="formInfo.pais.value != 425 ? true : false"
                      :options="municipioOptions" input-debounce="0" label="Seleccione" dense outlined
                      class="tw-rounded-lg" :rules="[inputRequired]">
                    </q-select>
                  </span>
                </div>

                <!-- Dirección, localidad -->
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Dirección *</label>
                    <q-input v-model="formInfo.direccion" input-debounce="0"
                      :rules="[inputRequired, (v) => maxLengthInput(100, v)]" dense label="Inserte" outlined
                      class="tw-rounded-lg">
                    </q-input>
                  </span>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Localidad</label>
                    <q-input v-model="formInfo.localidad" input-debounce="0"
                      :rules="[alphanumeric, (v) => maxLengthInput(100, v)]" dense label="Inserte" outlined
                      class="tw-rounded-lg">
                    </q-input>
                  </span>
                </div>

                <!-- teléfono, correo principal, correo para notificaciones -->
                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Teléfono *</label>
                    <q-input v-model="formInfo.telefono" input-debounce="0"
                      :rules="[mobilePhoneNumberTenToTwelve, inputRequired]" dense label="Inserte" outlined
                      class="tw-rounded-lg">
                    </q-input>
                  </span>
                </div>
                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Correo Principal *</label>
                    <q-input v-model="formInfo.correoPrincipal" input-debounce="0"
                      :rules="[validationEmail, inputRequired, (v) => maxLengthInput(100, v)]" dense label="Inserte"
                      outlined class="tw-rounded-lg">
                    </q-input>
                  </span>
                </div>
                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Correo electrónico para Notificaciones *</label>
                    <q-input v-model="formInfo.correoNotificacion"
                      :rules="[validationEmail, (v) => maxLengthInput(200, v), inputRequired]" input-debounce="0" dense
                      label="Inserte" outlined class="tw-rounded-lg">
                    </q-input>
                  </span>
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-card>

        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <q-expansion-item expand-separator id="facturacion-manual-crear-adquiriente-datos-adicionales" default-opened>
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
                      :hint="'Cantidad seleccionada:' + formInfo.responsabilidadesFiscales.length" multiple
                      :options="opResponsabilidadFiscales" input-debounce="0" map-options label="Seleccione" dense
                      outlined class="tw-rounded-lg" :rules="[inputRequired]">
                    </q-select>
                  </span>
                </div>

                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Tributos *</label>
                    <q-select v-model="formInfo.tributos" :hint="'Cantidad seleccionada:' + formInfo.tributos.length"
                      multiple input-debounce="0" :options="opTributos" map-options label="Seleccione" dense outlined
                      class="tw-rounded-lg" :rules="[inputRequired]">
                    </q-select>
                  </span>
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-card>
        <div class="col row justify-center q-gutter-x-md q-my-md">
          <q-btn color="accent" textColor="secondary" label="Cancelar" style="
          width: 130px;
          height: 40px;
          border-radius: 8px;
          font-size: 16px;
          " type="reset" no-caps @click="cancelModal = true" />

          <q-btn color="primary" label="Guardar" style="
              width: 130px;
              height: 40px;
              border-radius: 8px;
              font-size: 16px;
              " @click="handleSubmit" :loading="handleSubmitIsLoading" />
        </div>
      </q-form>
      <Modal v-model="cancelModal" title="¡Espera un momento!" :is-success="false" text-button="Si"
        @handleAccept="resetForm(true)" cancel-button text-button-cancel="No"
        text="¿Está seguro de cancelar la creación del adquiriente?" @close-modal="cancelModal = false" type="button" />

      <Modal v-model="successModal" title="El adquiriente ha sido guardado con éxito" :is-success="true"
        text-button="Ok" @handleAccept="resetForm(true)" @close-modal="successModal = false" type="button" />
    </main>
  </section>
</template>

<script setup lang="ts">
import { maxLengthInput, inputRequired, minLengthInput, alphanumeric, validationEmail } from "src/helpers/validations";
import { ref, Ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useCountries, useDepartmentsbyOpen, useMunicipalities } from "src/composables/useVersion";
import Modal from "components/Modal/Modal.vue";
import { SelectInput } from "src/interfaces";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";

const cancelModal = ref(false)
const successModal = ref(false)
const router = useRouter();
const { optionsCountries } = useCountries()
const departamentoOptions: Ref<any[]> = ref([]);
const municipioOptions: Ref<any[]> = ref([]);
const handleSubmitIsLoading = ref<boolean>(false);
const opResponsabilidadFiscales = ref<SelectInput[]>([]);
const opTributos = ref<SelectInput[]>([]);
const opTipoPersona = ref<SelectInput[]>([]);
const opTipoRegimen = ref<SelectInput[]>([]);
const opTipoDoc = ref<SelectInput[]>([]);
const formValidate = ref();

type FormInfoType = {
  tipoPersona: string;
  tipoRegimen: string;
  tipoDocumento: string;
  numeroDocumento: string;
  razonSocial: string;
  nombreComercial: string;
  primerApellido: string;
  segundoApellido: string;
  primerNombre: string;
  otrosNombres: string;
  pais: any;
  departamento: any;
  municipio: any;
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
  tipoPersona: "",
  tipoRegimen: "",
  tipoDocumento: "",
  numeroDocumento: "",
  razonSocial: "",
  nombreComercial: "",
  primerApellido: "",
  segundoApellido: "",
  primerNombre: "",
  otrosNombres: "",
  pais: { label: 'Colombia', value: 425 },
  departamento: "",
  municipio: "",
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
  const { optionsDepartments } = await useDepartmentsbyOpen(formInfo.value.pais.value);
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
}

watch(
  () => formInfo.value.pais.value,
  async (value) => {
    if (value != 425) {
      formInfo.value.departamento = formInfo.value.pais.label
      formInfo.value.municipio = formInfo.value.pais.label
      departamentoOptions.value = []
      municipioOptions.value = []
    } else {
      formInfo.value.departamento = ''
      formInfo.value.municipio = ''
      const { optionsDepartments } = await useDepartmentsbyOpen(value);
      departamentoOptions.value = optionsDepartments.value;
    }
  }
);

watch(
  () => formInfo.value.departamento.value,
  async (value) => {
    if (formInfo.value.pais.value == 425) {
      formInfo.value.municipio = ''
    }
    const { optionsMunicipalities } = await useMunicipalities(value);
    municipioOptions.value = optionsMunicipalities.value;
  }
);

const resetForm = async (isRedirect: boolean) => {
  formInfo.value = {
    tipoPersona: "",
    tipoRegimen: "",
    tipoDocumento: "",
    numeroDocumento: "",
    razonSocial: "",
    nombreComercial: "",
    primerApellido: "",
    segundoApellido: "",
    primerNombre: "",
    otrosNombres: "",
    pais: { label: 'Colombia', value: 425 },
    departamento: "",
    municipio: "",
    direccion: "",
    localidad: "",
    telefono: "",
    correoPrincipal: "",
    correoNotificacion: "",
    responsabilidadesFiscales: [],
    tributos: [],
  };

  if (isRedirect) {
    router.push('/facturacion/manual')
  }
};

const handleSubmit = async () => {
  handleSubmitIsLoading.value = true;

  if (await formValidate.value.validate()) {
    let form: any = {};

    for (const key in formInfo.value) {
      if (key === 'tipoPersona') {
        form['tipoPersonaId'] = {
          id: formInfo.value[key].value,
          nombre: formInfo.value[key].label
        };

      } else if (key === 'tipoRegimen') {
        form['tipoRegimenId'] = {
          id: formInfo.value[key].value,
          nombre: formInfo.value[key].label
        };
      } else if (key === 'tipoDocumento') {
        form['tipoDocumentoId'] = {
          tdo_id: formInfo.value[key].value,
          tdo_codigo: formInfo.value[key].codigo,
          tdo_descripcion: formInfo.value[key].label
        };
      } else if (key === 'pais') {
        form['paisId'] = {
          idPais: formInfo.value[key].value,
          nombre: formInfo.value[key].label,
        };
      } else if (key === 'departamento') {
        form['departamentoId'] = {
          idDepartamento: formInfo.value[key].value,
          nombre: formInfo.value[key].label,
          codigoDivipola: formInfo.value[key].codigoDivipola
        };
      } else if (key === 'municipio') {
        form['municipioId'] = {
          idMunicipio: formInfo.value[key].value,
          nombre: formInfo.value[key].label,
          codigoDivipola: formInfo.value[key].codigoDivipola,
        };
      } else if (key === 'responsabilidadesFiscales') {
        form[key] = [...formInfo.value[key]].map(({ value, label, codigo }) => ({ ref_id: value, ref_codigo: codigo, ref_descripcion: label }));
      } else if (key === 'tributos') {
        form[key] = [...formInfo.value[key]].map(({ value, label, codigo }) => ({ tri_id: value, tri_codigo: codigo, tri_descripcion: label }));
      } else if (Array.isArray(formInfo.value[key])) {
        form[key] = [...formInfo.value[key]].map(({ value, label }) => ({ id: value, nombre: label }));
      } else {
        form[key] = formInfo.value[key];
      }
    }

    if (form.tipoPersonaId.id == 1) {
      form.primerNombre = 'N/A'
      form.primerApellido = 'N/A'
      form.segundoApellido = 'N/A'
      form.otrosNombres = 'N/A'
    } else if (form.tipoPersonaId.id == 2) {
      form.razonSocial = 'N/A'
      form.nombreComercial = 'N/A'
    }

    if (form.paisId.idPais !== 425) {
      form.departamentoId = null
      form.municipioId = null
    }

    try {
      const response = await sgdeaAxios.post('/facManual/crearAdquirienteFacManual', form);
      if (response.status === 200) {
        toast.success('El adquiriente ha sido guardado con éxito')
        router.push('/facturacion/manual');
      }
    } catch (error) {
      resetForm(false);
      toast.error(error.response.data.message)
      console.error(error);
    }
  } else {
    toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos.")
  }
  handleSubmitIsLoading.value = false;
}

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
