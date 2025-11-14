<template>
  <div class="row q-col-gutter-md q-pb-md q-px-md">
    <div class="col-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Forma de envío *</label>
        <q-select map-options emit-value dense outlined class="tw-rounded-lg"
          v-model="formExitData.datosSalidaFormaEnvioId" :options="shippingMethodsOptions" label="Seleccione"
          :disable="onlyRead" :rules="[inputRequired]" />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Anexos</label>
        <q-input v-model="formExitData.anexos" dense outlined label="Inserte" class="tw-rounded-lg" readonly filled />
      </span>
    </div>

    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 tw-mb-5">
      <span class="tw-w-full">
        <label class="tw-text-label">Asunto</label>
        <q-input v-model="formExitData.asunto" dense outlined label="Inserte" class="tw-rounded-lg" readonly filled />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Tipo de documento destinatario *</label>
        <q-select map-options emit-value dense outlined class="tw-rounded-lg"
          v-model="formExitData.datosSalidaTipoDocumentoDestinatarioId" :options="tipoDocumentoOptions"
          label="Seleccione" :rules="[inputRequired]" :disable="onlyRead" />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Número de documento *</label>
        <q-input v-model="formExitData.datosSalidaNumeroDocumentoDestinatario" dense outlined label="Inserte"
          class="tw-rounded-lg"
          :rules="!isNinguno ? [inputRequired, Number(formExitData.datosSalidaTipoDocumentoDestinatarioId) == 11 ? alphanumeric2 : (v: string) => onlyNumbers(v), val => maxLengthInput(15, val)] : [Number(formExitData.datosSalidaTipoDocumentoDestinatarioId) == 11 ? alphanumeric2 : (v: string) => onlyNumbers(v), val => maxLengthInput(15, val)]"
          :disable="(onlyRead || isDisabled)" @blur="getPerson" />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Nombre del destinatario *</label>
        <q-input v-model="formExitData.datosSalidaNombreDestinatario" dense outlined label="Inserte"
          class="tw-rounded-lg" :rules="[inputRequired, alphanumeric2, val => maxLengthInput(200, val)]"
          :disable="onlyRead" />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">{{ isRequired ? 'Dirección del destinatario *' : 'Dirección del destinatario' }}
        </label>
        <q-input v-model="formExitData.datosSalidaDireccion" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="isRequired ? [inputRequired, val => maxLengthInput(200, val)] : [val => maxLengthInput(200, val)]"
          :disable="onlyRead" />
      </span>
    </div>

    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
      <label class="tw-w-full">
        <span class="tw-text-label">{{ isRequired ? 'País destinatario *' : 'País destinatario' }}</span>
        <q-select v-model="formExitData.datosSalidaPaisId" :options="optionsCountries" label="Seleccione" dense outlined
          map-options emit-value class="tw-rounded-lg" :rules="[inputRequired]">
        </q-select>
      </label>
    </div>

    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
      <label class="tw-w-full">
        <span class="tw-text-label">{{ isRequired ? 'Departamento destinatario *' : 'Departamento destinatario'
          }}</span>
        <q-select v-model="formExitData.datosSalidaDeptoId" label="Seleccione" dense outlined map-options emit-value
          clearable class="tw-rounded-lg" :readonly="isDisable" :options="departmentsOptions" :rules="[isRequired ? inputRequired : null]"
          :disable="onlyRead">
        </q-select>
      </label>
    </div>

    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
      <label class="tw-w-full">
        <span class="tw-text-label">{{ isRequired ? 'Municipio destinatario *' : 'Municipio destinatario' }}</span>
        <q-select v-model="formExitData.datosSalidaMunicipio" label="Seleccione" dense outlined map-options emit-value
          clearable class="tw-rounded-lg" :options="municipioOptions" :rules="[isRequired ? inputRequired : null]"
          :disable="onlyRead" :readonly="isDisableCountry">
        </q-select>
      </label>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Teléfono destinatario</label>
        <q-input v-model="formExitData.datosSalidaTelefono" dense outlined label="Inserte" class="tw-rounded-lg"
          :disable="onlyRead" @keypress="onlyNumber" />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Correo electrónico destinatario {{ isRequiredEmail ? '*' : '' }}</label>
        <q-input v-model="formExitData.datosSalidaCorreo" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="isRequiredEmail ? [inputRequired, validationEmail, val => maxLengthInput(200, val)] : [validationEmail, val => maxLengthInput(200, val)]"
          :disable="onlyRead" />
      </span>
    </div>

    <div v-if="disableOptions" class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Anexos (Cantidad de folios) *</label>
        <q-input v-model.number="formExitData.datosSalidaAnexos" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="[inputRequired, alphanumeric2, onlyNumbers, val => maxLengthInput(5, val)]" :disable="onlyRead" />
      </span>
    </div>

    <div v-if="disableOptions" class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Asunto *</label>
        <q-input v-model="formExitData.asunto" dense outlined label="Inserte" class="tw-rounded-lg" autogrow
          :rules="[inputRequired, val => maxLengthInput(100, val)]" :disable="onlyRead" :readonly="onlyRead" />
      </span>
    </div>
    <div v-if="disableOptions" class="col-12">
      <span class="tw-w-full">
        <label class="tw-text-label">Observación *</label>
        <q-input v-model.trim="formExitData.observacion" dense outlined label="Inserte" class="tw-rounded-lg" autogrow
          :rules="[inputRequired, val => maxLengthInput(10000, val)]" :disable="onlyRead" :readonly="onlyRead" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useCrearComunicacionesLogic } from "src/pages/Correspondencia/Crear/CrearComunicaciones/CrearComunicaciones.Logic";
import {
  inputRequired,
  maxLengthInput,
  onlyNumbers,
  validationEmail,
  alphanumeric2,
  onlyNumber,
} from "src/helpers/validations";
import { useCountries, useDepartments, useMunicipalities } from "src/composables/useVersion";
import { sgdeaAxios } from 'src/services';
import { getAcronimobyId } from 'src/helpers/prefijoTipoDoc';
import { useAuthStore } from "src/stores/auth.store";

const props = withDefaults(defineProps<{
  dataInitial: object,
  onlyRead: boolean,
  disableOptions: boolean
}>(), {
  onlyRead: false,
  disableOptions: true
});

const emit = defineEmits(['getPerson'])
const { optionsCountries } = useCountries()
const formExitData: any = ref(props.dataInitial)
const shippingMethodsOptions = ref([]);
const tipoDocumentoOptions = ref([]);
const isDisabled = ref(false);
const isRequired = ref(false);
const isRequiredEmail = ref(false);
const departmentsOptions = ref([]);
const municipioOptions = ref([]);
const isDisableCountry = ref(false)
const isNinguno = computed(() => formExitData.value.datosSalidaTipoDocumentoDestinatarioId === 12)
const notChangePais = ref(true)
const notChangeDep = ref(true)
const auth = useAuthStore()
const isCertificado = ref();
const isDisable=ref(false)

onMounted(async () => {
  await userCertificado();
  const { getShippingWayOptions, getTipoDocumentoOptions } = useCrearComunicacionesLogic();
  const shipping = await getShippingWayOptions();

  // const isPaisColombia = typeof formExitData.value?.datosSalidaPaisId === 'number'
  //   ? formExitData.value?.datosSalidaPaisId !== 425
  //   : formExitData.value?.datosSalidaPaisId?.value !== 425;

  //sDisableCountry.value = isPaisColombia;

  shippingMethodsOptions.value = shipping.filter(shipping => (!['Personal', 'Mensajero'].includes(shipping.label)));

  if (!isCertificado.value) {
    shippingMethodsOptions.value = shippingMethodsOptions.value.filter(shipping => shipping.label !== 'Correo electrónico certificado');
  }
  const tipoDocuments = await getTipoDocumentoOptions();
  tipoDocumentoOptions.value = tipoDocuments.filter(documento => documento.label !== 'Ninguno');
  // @ts-expect-error
  const  optionsDepartments  = await getDepartamentos(425);
  departmentsOptions.value = optionsDepartments.value;

  if (formExitData.value?.datosSalidaDeptoId && typeof formExitData.value?.datosSalidaDeptoId === 'number') {
    const { optionsMunicipalities } = await useMunicipalities(formExitData.value?.datosSalidaDeptoId);
    municipioOptions.value = optionsMunicipalities.value;
  }
});

const userCertificado = async () => {
  const response = await sgdeaAxios.get(`/usuarios/${auth.$state.userInfo.userid}`);
  isCertificado.value = response.data.isCertificado;
}

const getLabel = (value, options) => {
  let option = options.find(option => option.value === value);
  if (!option && value && typeof value === 'string') {
    option = { label: value }
  }
  return option ? option.label : '';
}

async function getPerson() {
  const tipoDoc = getAcronimobyId(Number(formExitData.value.datosSalidaTipoDocumentoDestinatarioId))
  const number = Number(formExitData.value.datosSalidaNumeroDocumentoDestinatario) ? Number(formExitData.value.datosSalidaNumeroDocumentoDestinatario) : ''

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

      formExitData.value.datosSalidaNombreDestinatario = fullName
      formExitData.value.datosSalidaDireccion = response.data.direccion
      formExitData.value.datosSalidaTelefono = response.data.telefono
      formExitData.value.datosSalidaCorreo = response.data.email
      formExitData.value.datosSalidaPaisId = response.data.pais.idPais
      setTimeout(() => {
      formExitData.value.datosSalidaDeptoId =  response.data.departamento.idDepartamento
      })
      setTimeout(() => {
      formExitData.value.datosSalidaMunicipioId = response.data.municipio.idMunicipio
      formExitData.value.datosSalidaMunicipio = response.data.municipio.idMunicipio
      })
      notChangePais.value = false
      notChangeDep.value = false
    } else {
      resetForm()
    }
    emit('getPerson')
  } catch (error) {
    resetForm()
    emit('getPerson')
  }
}

const resetForm = () => {
  formExitData.value.datosSalidaNombreDestinatario = ''
  formExitData.value.datosSalidaDireccion = ''
  formExitData.value.datosSalidaTelefono = ''
  formExitData.value.datosSalidaCorreo = ''
  formExitData.value.datosSalidaPaisId = ''
  formExitData.value.datosSalidaDeptoId = ''
  formExitData.value.datosSalidaMunicipioId = ''
}

watch(() => formExitData.value?.datosSalidaPaisId, async(value) => {
  isDisable.value = false;
  formExitData.value.datosSalidaDeptoId =''

  const  optionsDepartments  = await getDepartamentos(value);
  departmentsOptions.value = optionsDepartments.value;
  // if (notChangePais.value) {
  //   isDisableCountry.value = false;
  //   formExitData.value.datosSalidaDeptoId = ''
  //   if (value !== 425) {
  //     formExitData.value.datosSalidaDeptoId = getLabel(value, optionsCountries.value);
  //     isDisableCountry.value = true;
  //   }
  // }
  // notChangePais.value = true
})

watch(() => formExitData.value?.datosSalidaTipoDocumentoDestinatarioId, async (value) => {
  if (value === 12) {
    formExitData.value.datosSalidaNumeroDocumentoDestinatario = '';
    isDisabled.value = true;
    return
  }
  isDisabled.value = false;
}
);

watch(() => formExitData.value?.datosSalidaFormaEnvioId, async (value) => {
  isRequired.value = false;
  isRequiredEmail.value = false;

  if (value === 3 || value === 6) {
    isRequired.value = true;
    return
  }

  if (value === 1 || value === 2) {
    isRequiredEmail.value = true;
    return
  }
}
);

watch(() => formExitData.value.datosSalidaDeptoId, async (value) => {
  // if (!value) {
  //   formExitData.value.datosSalidaMunicipioId = '';
  //   return
  // }
  if (typeof value === 'string') {
    const municipalityLabel = formExitData.value.datosSalidaDeptoId
    formExitData.value.datosSalidaMunicipio = municipalityLabel;
    return
  }

  if (formExitData.value.datosSalidaPaisId.value !== 425 && formExitData.value.datosSalidaPaisId !== 425) {
    formExitData.value.datosSalidaMunicipio = getLabel(value, departmentsOptions.value) ;
    return;
  }

  formExitData.value.datosSalidaMunicipioId = '';
  const { optionsMunicipalities } = await useMunicipalities(value);
  municipioOptions.value = optionsMunicipalities.value;

});


const getDepartamentos = async (paisId) => {
  const response = await sgdeaAxios.get(`/geodivision/pais/${paisId}`);
  const optionsDepartments = ref([]);
  if (response.status === 200) {
    const { data } = response;
    optionsDepartments.value = data.map((departamento) => {
      return {
        value: departamento.idDepartamento,
        label: departamento.nombre,
      };
    });
  }
  return optionsDepartments;
};

</script>
