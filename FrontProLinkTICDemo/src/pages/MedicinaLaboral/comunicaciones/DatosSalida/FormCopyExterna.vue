<template>
  <q-form ref="myForm" greedy>
    <div class="row q-col-gutter-md q-pb-md q-px-md">
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label tw-font-semibold">Forma de envío *</label>
          <q-select map-options emit-value dense outlined class="tw-rounded-lg"
            v-model="formExitData.shippingMethodCopyExterna" :options="shippingMethodsOptions" label="Seleccione"
            :rules="[inputRequired]" />
        </span>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label tw-font-semibold">Tipo de documento destinatario *</label>
          <q-select map-options emit-value dense outlined class="tw-rounded-lg"
            v-model="formExitData.recipientDocumentTypeCopyExterna" :options="tipoDocumentoOptions" label="Seleccione"
            :rules="[inputRequired]"/>
        </span>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label tw-font-semibold">Documento destinatario *</label>
          <q-input v-model="formExitData.recipientDocumentCopyExterna" dense outlined label="Inserte"
            class="tw-rounded-lg" @change="getPerson" @blur="getPerson"
            :rules="[inputRequired, Number(formExitData.shippingMethodCopyExterna) == 2 || Number(formExitData.shippingMethodCopyExterna) == 1 ? inputRequired : null, Number(formExitData.recipientDocumentTypeCopyExterna) == 11 ? onlyAlphaNumeric : (v: string) => onlyNumbers(v), (v) => lengthInput(15, v)]"
            @keypress="Number(formExitData.recipientDocumentTypeCopyExterna) == 11 ? onlyAlphaNumeric : onlyNumbers"/>
        </span>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label tw-font-semibold">Nombre del destinatario *</label>
          <q-input v-model="formExitData.recipientNameCopyExterna" dense outlined label="Inserte" class="tw-rounded-lg"
            :rules="[inputRequired, val => maxLengthInput(200, val)]" />
        </span>
      </div>


      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label tw-font-semibold">
            {{ isMedicinaLaboral ? 'Dirección del destinatario *' : isRequired ? 'Dirección del destinatario * '
              : 'Dirección del destinatario' }} </label>
          <q-input v-model.number="formExitData.addressRecipientCopyExterna" dense outlined label="Inserte"
            class="tw-rounded-lg"
            :rules="isMedicinaLaboral
              ? [ Number(formExitData.shippingMethodCopyExterna) == 3 || Number(formExitData.shippingMethodCopyExterna) == 4 || Number(formExitData.shippingMethodCopyExterna) == 5 || Number(formExitData.shippingMethodCopyExterna) == 6 ? inputRequired : null, val => maxLengthInput(200, val), alphanumeric2]
              : isRequired ? [inputRequired, val => maxLengthInput(200, val), alphanumeric2] : [val => maxLengthInput(200, val), alphanumeric2, ]" />
        </span>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <label class="tw-w-full tw-font-semibold">
          <span class="tw-text-label">País destinatario *</span>
          <q-select v-model="formExitData.countryRecipientCopyExterna" :options="optionsCountries" label="Seleccione"
            dense outlined map-options emit-value class="tw-rounded-lg" :rules="[inputRequired]">
          </q-select>
        </label>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <label class="tw-w-full">
          <span class="tw-text-label tw-font-semibold">
            {{ isMedicinaLaboral ? 'Departamento destinatario *' : isRequired ? 'Departamento destinatario * '
              : 'Departamento destinatario' }}
          </span>
          <q-select v-model="formExitData.departmentRecipientCopyExterna" label="Seleccione" dense outlined map-options
            emit-value :readonly="isDisable" clearable class="tw-rounded-lg" :options="departmentsOptions" :rules="isMedicinaLaboral
              ? [Number(formExitData.shippingMethodCopyExterna) == 3 || Number(formExitData.shippingMethodCopyExterna) == 4 || Number(formExitData.shippingMethodCopyExterna) == 5 || Number(formExitData.shippingMethodCopyExterna) == 6 ? inputRequired : null]
              : [isRequired ? inputRequired : null]">
          </q-select>
        </label>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <label class="tw-w-full">
          <span class="tw-text-label tw-font-semibold">
            {{ isMedicinaLaboral ? 'Municipio destinatario *' : isRequired ? 'Municipio destinatario * '
              : 'Municipio destinatario' }}
          </span>
          <q-select :readonly="isDisable" v-model="formExitData.municipalityRecipientCopyExterna" label="Seleccione"
            dense outlined map-options emit-value clearable class="tw-rounded-lg" :options="municipioOptions" :rules="isMedicinaLaboral
              ? [Number(formExitData.shippingMethodCopyExterna) == 3 || Number(formExitData.shippingMethodCopyExterna) == 4 || Number(formExitData.shippingMethodCopyExterna) == 5 || Number(formExitData.shippingMethodCopyExterna) == 6 ? inputRequired : null]
              : [isRequired ? inputRequired : null]">
          </q-select>
        </label>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label tw-font-semibold">Teléfono destinatario</label>
          <q-input v-model="formExitData.telephoneRecipientCopyExterna" dense outlined label="Inserte"
            class="tw-rounded-lg" :rules="[(v) => maxLengthInput(10, v),(v) => minLengthInput(7, v), onlyNumbers]" />
        </span>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label tw-font-semibold">Correo electrónico {{ isMedicinaLaboral ? '*' : isRequiredEmail
            ? '*' : ''
            }}</label>
          <q-input v-model="formExitData.emailRecipientCopyExterna" dense outlined label="Inserte" class="tw-rounded-lg"
            :rules="isMedicinaLaboral
              ? [Number(formExitData.shippingMethodCopyExterna) == 1 || Number(formExitData.shippingMethodCopyExterna) == 2 ? inputRequired : null, validationEmail, val => maxLengthInput(200, val)]
              : isRequiredEmail ? [inputRequired, validationEmail, val => maxLengthInput(200, val)] : [validationEmail, val => maxLengthInput(200, val)]" />
        </span>
      </div>
    </div>
  </q-form>

  <div class="tw-flex tw-justify-center tw-items-center tw-mb-2 tw-mt-3 tw-gap-6">
    <q-btn class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-44" label="Limpiar" color="white" text-color="secondary"
      @click="limpiarExterno" />
    <q-btn icon="add" @click="addNewDestinary" label="Agregar" text-color="white" color="primary"
      class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-44" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import {
  inputRequired,
  maxLengthInput,
  validationEmail,
  alphanumeric2,
  onlyNumbers,
  lengthInput,
  homePhoneNumberMinAndMaxLength,
  minLengthInput,
  onlyAlphaNumeric
} from "src/helpers/validations";
import { useCountries, useDepartments, useMunicipalities } from "src/composables/useVersion";
import { useCrearComunicacionesLogic } from "src/pages/Correspondencia/Crear/CrearComunicaciones/CrearComunicaciones.Logic";
import { getAcronimobyId } from "src/helpers/prefijoTipoDoc";
import { adminAxios, sgdeaAxios } from "src/services";

const props = defineProps({
  isMedicinaLaboral: { type: Boolean, required: false, default: false },
  idComunicacion: { type: Number, required: false, default: null },
  isFisrRender: { type: Boolean, required: false, default: true },
  isErrased: Boolean
})

const isDisable = ref(false)
const isRequiredEmail = ref(false);
const isRequired = ref(false);
const { optionsCountries } = useCountries()
const departmentsOptions = ref([]);
const municipioOptions = ref([]);
const shippingMethodsOptions = ref([]);
const tipoDocumentoOptions = ref([]);
const formExitData = ref({
  shippingMethodCopyExterna: '',
  recipientDocumentTypeCopyExterna: '',
  recipientDocumentCopyExterna: '',
  recipientNameCopyExterna: '',
  addressRecipientCopyExterna: '',
  countryRecipientCopyExterna: { label: 'Colombia', value: 425 },
  departmentRecipientCopyExterna: '',
  municipalityRecipientCopyExterna: '',
  telephoneRecipientCopyExterna: '',
  emailRecipientCopyExterna: '',
});
const myForm = ref(null);

if (props.isErrased) {
  formExitData.value = {
    shippingMethodCopyExterna: '',
    recipientDocumentTypeCopyExterna: '',
    recipientDocumentCopyExterna: '',
    recipientNameCopyExterna: '',
    addressRecipientCopyExterna: '',
    countryRecipientCopyExterna: { label: 'Colombia', value: 425 },
    departmentRecipientCopyExterna: '',
    municipalityRecipientCopyExterna: '',
    telephoneRecipientCopyExterna: '',
    emailRecipientCopyExterna: '',
  }
}

const emit = defineEmits([
  "update:itemAdded",
]);

const mapListUserExternoById = async () => {
  if (props.idComunicacion) {
    const { getAllDataByID } = useCrearComunicacionesLogic();
    const allData = await getAllDataByID(props.idComunicacion);
    const dataArray = allData?.listCopia?.externa;

    const mapOfobjetoBuilder = dataArray.map(data => {
      return ({
        emailRecipientCopyExterna: data.correoDestinatario,
        shippingMethodCopyExterna: getIdFormaEnvio(data.formaEnvio, shippingMethodsOptions.value),
        recipientDocumentTypeCopyExterna: data.tipoDocumento,
        recipientDocumentCopyExterna: data.numeroDocumento,
        recipientNameCopyExterna: data.nombreDest,
        addressRecipientCopyExterna: data.direccionDestinatario,
        countryRecipientCopyExterna: { label: data.pais.nombre },
        departmentRecipientCopyExterna: data.pais.idPais !== 425 ? data.pais.nombre : data.municipio.idDepartamento,
        municipalityRecipientCopyExterna: data.pais.idPais !== 425 ? data.pais.nombre : data.municipio.idMunicipio,
        telephoneRecipientCopyExterna: data.telefonoDestinatario,
        municipio_label: (data.pais.idPais !== 425 ? data.pais.nombre : data.municipio.nombre),
        departamento_label: (data.pais.idPais !== 425 ? data.pais.nombre : data.departamento.nombre),
        forma_label: data.formaEnvio.forma,
        tipo_label: data.tipoDocumento.nombre,
      })
    })
    emit("update:itemAdded", mapOfobjetoBuilder);
  }
}

onMounted(async () => {
  const { getTipoDocumentoOptions, getShippingWayOptionsMedicina } = useCrearComunicacionesLogic();
  tipoDocumentoOptions.value = await getTipoDocumentoOptions();
  tipoDocumentoOptions.value = [...tipoDocumentoOptions.value.filter(tipo => tipo.label !== 'Ninguno')];
  const shippingMethods = await getShippingWayOptionsMedicina();
  shippingMethodsOptions.value = shippingMethods
  // @ts-expect-error
  const { optionsDepartments } = await useDepartments(425);
  departmentsOptions.value = optionsDepartments.value;

  props.isFisrRender && mapListUserExternoById()
});

const successAdd = async () => {
  const objetoBuilder = {
    ...formExitData.value,
    municipio_label: getLabel(formExitData.value.municipalityRecipientCopyExterna, municipioOptions.value),
    departamento_label: getLabel(formExitData.value.departmentRecipientCopyExterna, departmentsOptions.value),
    forma_label: getLabel(formExitData.value.shippingMethodCopyExterna, shippingMethodsOptions.value),
    tipo_label: getLabel(formExitData.value.recipientDocumentTypeCopyExterna, tipoDocumentoOptions.value),
    countryRecipientCopyExterna: typeof formExitData.value.countryRecipientCopyExterna === 'object' ? formExitData.value.countryRecipientCopyExterna : { label: getLabel(formExitData.value.countryRecipientCopyExterna, optionsCountries.value), value: formExitData.value.countryRecipientCopyExterna },
    numeroDeDocumeto: getLabel(formExitData.value.recipientDocumentCopyExterna, tipoDocumentoOptions.value)
  }

  emit("update:itemAdded", objetoBuilder);

}

const addNewDestinary = async () => {
  const isValidate = await myForm.value.validate();
  isValidate && successAdd()
}

const limpiarExterno = async () => {
  formExitData.value.recipientNameCopyExterna = '';
  formExitData.value.addressRecipientCopyExterna = '';
  formExitData.value.departmentRecipientCopyExterna = '';
  formExitData.value.municipalityRecipientCopyExterna = '';
  formExitData.value.telephoneRecipientCopyExterna = '';
  formExitData.value.emailRecipientCopyExterna = '';

  await myForm.value.reset()
}


async function getPerson() {
  const tipoDoc = getAcronimobyId(Number(formExitData.value.recipientDocumentTypeCopyExterna))
  const number = Number(formExitData.value.recipientDocumentCopyExterna) ? Number(formExitData.value.recipientDocumentCopyExterna) : ''


  try {
    const response = await sgdeaAxios.get("/personas", {
      params: {
        tipoDocumento: tipoDoc,
        numeroDocumento: number
      }
    })

    if (response.status === 200) {
      const nameObject = {
        nombre1: response.data.nombre1,
        nombre2: response.data.nombre2,
        apellido1: response.data.apellido1,
        apellido2: response.data.apellido2,
      }

      const fullName = Object.values(nameObject).join(' ')

      formExitData.value.recipientNameCopyExterna = fullName
      formExitData.value.addressRecipientCopyExterna = response.data.direccion
      formExitData.value.telephoneRecipientCopyExterna = response.data.telefono
      formExitData.value.emailRecipientCopyExterna = response.data.email
      formExitData.value.countryRecipientCopyExterna = { label: response.data.pais.nombre, value: response.data.pais.idPais }
      setTimeout(() => {
      formExitData.value.departmentRecipientCopyExterna = response.data.departamento.idDepartamento
      })
      setTimeout(() => {
      formExitData.value.municipalityRecipientCopyExterna = response.data.municipio.idMunicipio
      })

    } else {
      await limpiarExterno()
    }
  } catch (error) {
    await limpiarExterno()
  }
}

watch(() => formExitData.value.countryRecipientCopyExterna.value, (value) => {
  isDisable.value = false;
  formExitData.value.departmentRecipientCopyExterna = '';
  //@ts-ignore
  if (value !== 425) {
    formExitData.value.departmentRecipientCopyExterna = getLabel(formExitData.value.countryRecipientCopyExterna, optionsCountries.value);
    isDisable.value = true;
  }
})

watch(
  () => formExitData.value.departmentRecipientCopyExterna,
  async (value) => {

    if (!value) {
      formExitData.value.municipalityRecipientCopyExterna = '';
      return
    }
    if (typeof value === 'string') {
      const municipalityLabel = formExitData.value.departmentRecipientCopyExterna
      formExitData.value.municipalityRecipientCopyExterna = municipalityLabel;
      return
    }
    formExitData.value.municipalityRecipientCopyExterna = '';
    const { optionsMunicipalities } = await useMunicipalities(value);
    municipioOptions.value = optionsMunicipalities.value;
  }
);

const getLabel = (value, options) => {
  let option = options.find(option => option.value === value);
  if (!option && value && typeof value === 'string') {
    option = { label: value }
  }
  return option ? option.label : '';
}

const getIdFormaEnvio = (value, options) => {
  let option = options.find(option => option.label === value);
  return option ? option.value : '';
}

watch(
  () => formExitData.value.shippingMethodCopyExterna,
  (value) => {
    if (!props.isMedicinaLaboral) {
      return
    }
    isRequired.value = false;
    isRequiredEmail.value = false;

    if (+value === 3 || +value === 6) {
      isRequired.value = true;
      return
    }

    if (+value === 1 || +value === 2) {
      isRequiredEmail.value = true;
      return
    }
  }
);
</script>
