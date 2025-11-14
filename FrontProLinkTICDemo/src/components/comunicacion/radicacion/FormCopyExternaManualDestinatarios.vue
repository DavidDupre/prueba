<template>
  <div class="row q-col-gutter-md q-pb-md q-px-md">
    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Forma de envío *</label>
        <q-select map-options emit-value dense outlined class="tw-rounded-lg" v-model="formExitData.shippingMethodCopyExterna"
          :options="shippingMethodsOptions" label="Seleccione" :rules="[inputRequired]"
        />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Tipo de documento destionatario *</label>
        <q-select map-options emit-value dense outlined class="tw-rounded-lg" v-model="formExitData.tipoDocDestinatario"
          :options="tipoDocumentoOptions" label="Seleccione" :rules="[inputRequired]"
        />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">{{ !isNinguno ? 'Número de documento destinatario *' : 'Número de documento destinatario'}}</label>
        <q-input v-model.number="formExitData.numDocDestinatario" dense outlined label="Inserte" class="tw-rounded-lg"
                 :rules="!isNinguno ? [inputRequired, val => maxLengthInput(80, val),
          Number(formExitData.tipoDocDestinatario) === 11 ? alphanumeric : v => onlyNumbers(v)] : [val => maxLengthInput(80, val),
           Number(formExitData.tipoDocDestinatario) === 11 ? alphanumeric : v => onlyNumbers(v)]" :disable="isNinguno"
            @change="handleChanges"
        />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Nombre del destinatario * ({{ formExitData.nombreDestinatarioExterna.length }}/80)</label>
        <q-input v-model="formExitData.nombreDestinatarioExterna" dense outlined label="Inserte" class="tw-rounded-lg" :rules="[inputRequired, v => maxLengthInput(80, v)]" />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">{{isRequired ? 'Dirección del destinatario *' :'Dirección del destinatario'}} ({{ formExitData.addressRecipientCopyExterna.length }}/1000)</label>
        <q-input autogrow v-model.number="formExitData.addressRecipientCopyExterna" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="isRequired ? [inputRequired, val => maxLengthInput(1000, val)]:[ val => maxLengthInput(1000, val)]" />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <label class="tw-w-full">
          <span class="tw-text-label">{{ isRequired ? 'País destinatario *' : 'País destinatario' }}</span>
          <q-select v-model="formExitData.countryRecipientCopyExterna" emit-value map-options outlined dense use-input hide-selected class="tw-rounded-lg"
            fill-input label="Seleccione" :options="opsContry" @filter="filterCountry"
            :rules="[isRequired ? inputRequired : null]">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
      </label>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <label class="tw-w-full">
          <span class="tw-text-label">{{isRequired ? 'Departamento destinatario *' :'Departamento destinatario'}}</span>
          <q-select v-model="formExitData.departmentRecipientCopyExterna" emit-value map-options outlined dense use-input hide-selected class="tw-rounded-lg"
            fill-input label="Seleccione" :options="departmentsOptions" @filter="selectOptionsFilterFnDepartment" :readonly="isDisable" clearable
            :rules="[isRequired ? inputRequired : null]">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
      </label>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <label class="tw-w-full">
          <span class="tw-text-label">{{isRequired ? 'Municipio destinatario *' :'Municipio destinatario'}}</span>
          <q-select v-model="formExitData.municipalityRecipientCopyExterna" emit-value map-options outlined dense use-input hide-selected class="tw-rounded-lg"
            fill-input label="Seleccione" :options="municipioOptions" @filter="selectOptionsFilterFnMunicipality" :readonly="isDisable" clearable
            :rules="[isRequired ? inputRequired : null]">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
      </label>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Teléfono destinatario </label>
        <q-input v-model="formExitData.telephoneRecipientCopyExterna" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="[phoneFormat]" />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Correo destinatario {{isRequiredEmail ? '*' :''}} ({{formExitData?.emailRecipientCopyExterna?.length || 0 }}/30)</label>
        <q-input v-model="formExitData.emailRecipientCopyExterna" dense outlined label="Inserte" class="tw-rounded-lg"
        :rules="isRequiredEmail?[inputRequired, validationEmail, val => maxLengthInput(30, val)]:[validationEmail,val => maxLengthInput(30, val)]" />
      </span>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {
  alphanumeric,
  inputRequired,
  maxLengthInput,
  onlyNumbers,
  phoneFormat,
  validationEmail
} from "src/helpers/validations";
import {useCountries, useDepartments, useMunicipalities} from "src/composables/useVersion";
import {
  useCrearComunicacionesLogic
} from "src/pages/Correspondencia/Crear/CrearComunicaciones/CrearComunicaciones.Logic";
import {sgdeaAxios} from '../../../services/index';
import {useAuthStore} from "src/stores/auth.store";
import {getAcronimobyId} from "src/helpers/prefijoTipoDoc";

const props=defineProps({
  dataInitial: Object,
})

const { optionsCountries } = useCountries()
const departmentsOptions = ref([]);
const departmentsOptionsStatic = ref([]);
const municipioOptions = ref([]);
const municipioOptionsStatic = ref([]);
const shippingMethodsOptions = ref([]);
const tipoDocumentoOptions=ref([]);
const formExitData = ref(props.dataInitial);
const isRequired = ref(false);
const isRequiredEmail = ref(false);
const isDisable=ref(false)
const isNinguno = computed(() => formExitData.value.tipoDocDestinatario === 12)
const opsContry = ref();
const isCertificado = ref();
const auth = useAuthStore()

onMounted(async () => {
  await userCertificado();
  const {getShippingWayOptions }=useCrearComunicacionesLogic()

  const promises= [getShippingWayOptions(), getTypeDocs()]
  const [ shippingMethodsResponse, getTypeDocsResponse]=await Promise.allSettled(promises)

  shippingMethodsOptions.value = shippingMethodsResponse?.value.filter(method=>method.label !== 'Mensajero');
  if (!isCertificado.value) {
      shippingMethodsOptions.value = shippingMethodsOptions.value.filter(shipping => shipping.label !== 'Correo electrónico certificado');
  }
  tipoDocumentoOptions.value = getTypeDocsResponse?.value;

  const { optionsDepartments } = await useDepartments(props.dataInitial?.countryRecipientCopyExterna.value);
  departmentsOptionsStatic.value = optionsDepartments.value;

});

watch(
  () => formExitData.value.departmentRecipientCopyExterna,
  async (value) => {
    formExitData.value.municipalityRecipientCopyExterna = '';
    if (typeof value === 'number') {
      const { optionsMunicipalities } = await useMunicipalities(value);
      municipioOptionsStatic.value = optionsMunicipalities.value;
    }
  }
);

const filterCountry = (val, update) => {
  if (val === '') {
    update(() => {
      opsContry.value = optionsCountries.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    opsContry.value = optionsCountries.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}

const selectOptionsFilterFnDepartment = (val, update) => {

  if (val == '') {
    update(() => {
      departmentsOptions.value = departmentsOptionsStatic.value
    })
    return
  }
  update(() => {
    departmentsOptions.value = departmentsOptionsStatic.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const selectOptionsFilterFnMunicipality = (val, update) => {

  if (val == '') {
    update(() => {
      municipioOptions.value = municipioOptionsStatic.value
    })
    return
  }
  update(() => {
    municipioOptions.value = municipioOptionsStatic.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const getTypeDocs=async()=>{
const { data } = (await sgdeaAxios.get("/correspondencia/comunicacion/listadoTipoIdentificacion"));
  return data.map((item) => ({
      value: item.id,
      label: item.nombre
  })).sort((a,b) => a.label.localeCompare(b.label));
}

const getLabel=(value, options)=> {
  let option = options.find(option => option.value === value);
  if(!option && value && typeof value === 'string'){
    option={label:value}
  }
  return option ? option.label : '';
}


watch(() => formExitData.value.countryRecipientCopyExterna,(value)=>{
  isDisable.value = false;
  formExitData.value.departmentRecipientCopyExterna =''
  if(value !== 425){
    formExitData.value.departmentRecipientCopyExterna = getLabel(value, optionsCountries.value);
    isDisable.value = true;
  }
})

watch(
  () => formExitData.value.departmentRecipientCopyExterna,
  async (value) => {

    if(!value ){
      formExitData.value.municipalityRecipientCopyExterna = '';
      return
    }
    if(typeof value === 'string'){
      const municipalityLabel=formExitData.value.departmentRecipientCopyExterna
      formExitData.value.municipalityRecipientCopyExterna =municipalityLabel;
      return
    }
    formExitData.value.municipalityRecipientCopyExterna = '';
    if (typeof value === 'number'){
      const { optionsMunicipalities } = await useMunicipalities(value);
      municipioOptions.value = optionsMunicipalities.value;
    }
  }
);

watch(
  () => formExitData.value.shippingMethodCopyExterna,
  (value) => {

    isRequired.value = false;
    isRequiredEmail.value = false;

    if(value === 3 || value === 4){
      isRequired.value = true;
      return
    }

    if(value === 1 || value === 2){
      isRequiredEmail.value = true;
      return
    }
  }
);

watch(
  () => formExitData.value.tipoDocDestinatario,
  (value) => {
    if (value == 12) {
      formExitData.value.numDocDestinatario = ''
    }
  }
);

const userCertificado = async () => {
  const response = await sgdeaAxios.get(`/usuarios/${auth.$state.userInfo.userid}`);
  isCertificado.value = response.data.isCertificado;}

const handleChanges = async () => {
  await Promise.allSettled([
    getPerson(),
  ])
}

async function getPerson() {
  try {
    const tipoDoc = getAcronimobyId(Number(formExitData.value?.tipoDocDestinatario));
    const number = Number(formExitData.value?.numDocDestinatario) ? Number(formExitData.value?.numDocDestinatario) : '';
    const { data } = await sgdeaAxios.get("/personas", {
      params: {
        tipoDocumento: tipoDoc,
        numeroDocumento: number
      }
    })

    if (data) {
      if(data.pais && data.pais.idPais !== 425){
        formExitData.value.departmentRecipientCopyExterna = getLabel(data.pais.idPais, optionsCountries.value);
        isDisable.value = true;
      } else {
        if (data.departamento) {
          departmentsOptions.value = departmentsOptionsStatic.value;
          formExitData.value.departmentRecipientCopyExterna = departmentsOptions.value.find(
            department => department.value === data.departamento.idDepartamento
          )?.value || ""
        }
        if (data.departamento?.idDepartamento) {
          const { optionsMunicipalities } = await useMunicipalities(data.departamento?.idDepartamento);
          municipioOptions.value = optionsMunicipalities.value;
          formExitData.value.municipalityRecipientCopyExterna = municipioOptions.value.find(
            municipal => municipal.value === data.municipio.idMunicipio
          )?.value || ""
        }
      }

      const nameObject = {
        nombre1: data.nombre1,
        nombre2: data.nombre2,
        apellido1: data.apellido1,
        apellido2: data.apellido2,
      }

      formExitData.value.nombreDestinatarioExterna = Object.values(nameObject).join(' ')
      formExitData.value.addressRecipientCopyExterna = data?.direccion;
      formExitData.value.telephoneRecipientCopyExterna = data?.telefono;
      formExitData.value.emailRecipientCopyExterna = data?.email;
    } else {
      formExitData.value.nombreDestinatarioExterna = "";
      formExitData.value.addressRecipientCopyExterna = "";
      formExitData.value.telephoneRecipientCopyExterna = "";
      formExitData.value.emailRecipientCopyExterna = "";
      formExitData.value.departmentRecipientCopyExterna = "";
    }
  } catch (error) {
    console.error(error);
    formExitData.value.nombreDestinatarioExterna = "";
    formExitData.value.addressRecipientCopyExterna = "";
    formExitData.value.telephoneRecipientCopyExterna = "";
    formExitData.value.emailRecipientCopyExterna = "";
    formExitData.value.departmentRecipientCopyExterna = "";
  }
}
</script>
