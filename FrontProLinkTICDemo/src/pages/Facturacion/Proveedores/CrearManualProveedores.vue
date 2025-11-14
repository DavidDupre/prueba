
<template>
  <section class="tw-flex tw-flex-row tw-bg-bg">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
      <div class="tw-pt-4">
        <router-link to="/facturacion/manual-proveedores">
          <q-btn flat color="primary" label="Volver" icon="chevron_left" />
        </router-link>
      </div>

      <div class="tw-flex tw-justify-between tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold">Crear Proveedor</h1>
      </div>

      <q-form ref="formValidate" greedy>
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <q-expansion-item expand-separator id="facturacion-manual-crear-adquiriente" default-opened>
            <template v-slot:header>
              <div class="col row">
                <p class="tw-text-2xl tw-font-bold">Información Proveedor</p>
              </div>
            </template>

            <div class="tw-mt-2">
              <div class="row q-col-gutter-md q-pb-md q-px-md">
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Tipo de persona *</label>
                    <q-select v-model="formInfo.tipoPersona" input-debounce="0" map-options label="Seleccione"
                      :options="opTipoPersona" dense outlined class="tw-rounded-lg"
                      :rules="[inputRequired]">
                    </q-select>
                  </span>
                </div>

                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Tipo de régimen *</label>
                    <q-select v-model="formInfo.tipoRegimen"
                      :options="opTipoRegimen" :rules="[inputRequired]"
                      input-debounce="0" map-options label="Seleccione" dense outlined class="tw-rounded-lg">
                    </q-select>
                  </span>
                </div>

                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Tipo de documento *</label>
                    <q-select v-model="formInfo.tipoDocumento" input-debounce="0" :options="['NIT']" label="Seleccione"
                      dense outlined class="tw-rounded-lg" :rules="[inputRequired]">
                    </q-select>
                  </span>
                </div>

                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Numero de documento *</label>
                    <q-input v-model="formInfo.numeroDocumento" input-debounce="0" :rules="[inputRequired]" dense
                      label="Inserte" outlined class="tw-rounded-lg">
                    </q-input>
                  </span>
                </div>

                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" v-if="formInfo.tipoPersona.value == 1">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Razón social</label>
                    <q-input v-model="formInfo.razonSocial" :rules="[(v) => minLengthInput(7, v), alphanumeric]"
                      input-debounce="0" dense label="Inserte" outlined class="tw-rounded-lg">
                    </q-input>
                  </span>
                </div>

                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" v-if="formInfo.tipoPersona.value == 1">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Nombre comercial *</label>
                    <q-input v-model="formInfo.nombreComercial" input-debounce="0" :rules="[inputRequired, alphanumeric]"
                      dense label="Inserte" outlined class="tw-rounded-lg">
                    </q-input>
                  </span>
                </div>

                <!-- Nombres y Apellidos - 4 cols desktop - 1 col mobile -->
                <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" v-if="formInfo.tipoPersona.value == 2">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Primer apellido *</label>
                    <q-input v-model="formInfo.primerApellido" input-debounce="0"
                      :rules="[(v) => minLengthInput(2, v), alphanumeric]" dense label="Inserte" outlined
                      class="tw-rounded-lg">
                    </q-input>
                  </span>
                </div>
                <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" v-if="formInfo.tipoPersona.value == 2">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Segundo apellido *</label>
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
                      :rules="[(v) => minLengthInput(2, v), alphanumeric]" dense label="Inserte" outlined
                      class="tw-rounded-lg">
                    </q-input>
                  </span>
                </div>
                <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" v-if="formInfo.tipoPersona.value == 2">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Otros nombres *</label>
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
                      :rules="[inputRequired, alphanumeric, (v) => maxLengthInput(100, v)]" dense label="Inserte" outlined
                      class="tw-rounded-lg">
                    </q-input>
                  </span>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Localidad *</label>
                    <q-input v-model="formInfo.localidad" input-debounce="0"
                      :rules="[inputRequired, alphanumeric, (v) => maxLengthInput(100, v)]" dense label="Inserte" outlined
                      class="tw-rounded-lg">
                    </q-input>
                  </span>
                </div>

                <!-- teléfono, correo principal, correo para notificaciones -->
                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Teléfono</label>
                    <q-input v-model="formInfo.telefono" input-debounce="0" :rules="[mobilePhoneNumberTenToTwelve]" dense
                      label="Inserte" outlined class="tw-rounded-lg">
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
                    <label class="tw-text-label">Correo electrónico para Notificaciones</label>
                    <q-input v-model="formInfo.correoNotificacion"
                      :rules="[validationEmail, (v) => maxLengthInput(200, v)]" input-debounce="0" dense label="Inserte"
                      outlined class="tw-rounded-lg">
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
                      :options="opResponsabilidadFiscales" input-debounce="0" map-options label="Seleccione"
                      dense outlined class="tw-rounded-lg" :rules="[inputRequired]">
                    </q-select>
                  </span>
                </div>

                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Tributos *</label>
                    <q-select v-model="formInfo.tributos"
                      :hint="'Cantidad seleccionada:' + formInfo.tributos.length" multiple input-debounce="0"
                      :options="opTributos" map-options label="Seleccione" dense outlined
                      class="tw-rounded-lg">
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
              " @click="handleSubmit" :loading="handleSubmitIsLoading"  />
        </div>
      </q-form>
      <Modal v-model="cancelModal" title="¡Espera un momento!" :is-success="false" text-button="Si"
        @handleAccept="resetForm" cancel-button text-button-cancel="No"
        text="¿Está seguro de cancelar la creación del proveedor?" @close-modal="cancelModal = false" type="button" />

      <Modal v-model="successModal" title="El proveedor ha sido guardado con éxito" :is-success="true" text-button="Ok"
        @handleAccept="resetForm" @close-modal="successModal = false" type="button" />
    </main>
  </section>
</template>

<script setup lang="ts">
import { maxLengthInput, inputRequired, minLengthInput, alphanumeric, mobilePhoneNumberTenToTwelve, validationEmail } from "src/helpers/validations";
import { ref, Ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useCountries, useDepartments, useMunicipalities } from "src/composables/useVersion";
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

const formInfo = ref<FormInfoType & FormAditionalDataType>({
  tipoPersona: "",
  tipoRegimen: "",
  tipoDocumento: "NIT",
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
const formValidate = ref();

const opResponsabilidadFiscales = ref<SelectInput[]>([]);
const opTributos = ref<SelectInput[]>([]);
const opTipoPersona = ref<SelectInput[]>([]);
const opTipoRegimen = ref<SelectInput[]>([]);

const getData = async () => {
  const { optionsDepartments } = await useDepartments(formInfo.value.pais.value);
  departamentoOptions.value = optionsDepartments.value;

  const tipoPersonaResponse = await sgdeaAxios.get('/facManual/listadoTipoPersona');
  opTipoPersona.value = tipoPersonaResponse.data.map(({id, nombre}) => ({value: id, label: nombre}));

  const tipoRegimenResponse = await sgdeaAxios.get('/facManual/listadoTipoRegimen');
  opTipoRegimen.value = tipoRegimenResponse.data.map(({id, nombre}) => ({value: id, label: nombre}));

  const responsabilidadesFiscalesResponse = await sgdeaAxios.get('/facManual/listadoResponsabilidadesFiscales');
  opResponsabilidadFiscales.value = responsabilidadesFiscalesResponse.data.map(({id, nombre}) => ({value: id, label: nombre}));

  const tributosResponse = await sgdeaAxios.get('/facManual/listadoTributos');
  opTributos.value = tributosResponse.data.map(({id, nombre}) => ({value: id, label: nombre}));
}

onMounted(getData);

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
      const { optionsDepartments } = await useDepartments(value);
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

const resetForm = async () => {
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

  router.push('/facturacion/manual-proveedores/crear')
};

const handleSubmit = async () => {
  handleSubmitIsLoading.value = true;

  if (await formValidate.value.validate()) {
    let form = {};

    for (const key in formInfo.value) {
      if (key === 'tipoPersona') {
        form['tipoPersonaId'] = {
          // @ts-ignore
          id: formInfo.value[key].value,
          // @ts-ignore
          nombre: formInfo.value[key].label
        };

      } else if (key === 'tipoRegimen') {
        form['tipoRegimenId'] = {
          // @ts-ignore
          id: formInfo.value[key].value,
          // @ts-ignore
          nombre: formInfo.value[key].label
        };
      } else if (key === 'pais') {
        form['paisId'] = {
          idPais: formInfo.value[key].value,
        };
      } else if (key === 'departamento') {
        form['departamentoId'] = {
          idDepartamento: formInfo.value[key].value,
        };
      } else if (key === 'municipio') {
        form['municipioId'] = {
          idMunicipio: formInfo.value[key].value,
        };
      } else if (Array.isArray(formInfo.value[key])) {
        form[key] = [...formInfo.value[key]].map(({value, label}) => ({id: value, nombre: label}));
      } else {
        form[key] = formInfo.value[key];
      }
    }

    if(form.tipoPersonaId.id == 1){
          form.primerNombre = 'N/A'
          form.primerApellido = 'N/A'
          form.segundoApellido = 'N/A'
          form.otrosNombres = 'N/A'
        } else if (form.tipoPersonaId.id == 2){
          form.razonSocial = 'N/A'
          form.nombreComercial = 'N/A'
        }

    try {
      await sgdeaAxios.post('/facManual/crearAdquirienteFacturaManual', form);
      toast.success('El proveedor ha sido guardado con éxito')
      router.push('/facturacion/manual-proveedores');
    } catch (error) {
      resetForm();
      console.error(error);
    }
  } else {
    toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos.");
  }

  handleSubmitIsLoading.value = false;
}

</script>
