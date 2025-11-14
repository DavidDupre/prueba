<template>
  <q-form ref="myForm" greedy>
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
          <label class="tw-text-label">Tipo de documento destinatario *</label>
          <q-select map-options emit-value dense outlined class="tw-rounded-lg" v-model="formExitData.recipientDocumentTypeCopyExterna"
            :options="tipoDocumentoOptions" label="Seleccione" :rules="[inputRequired]"
          />
        </span>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label">Documento del destinatario *</label>
          <q-input v-model="formExitData.numeroDocumentoCopyExterna" dense outlined label="Inserte" class="tw-rounded-lg"
            :rules="[Number(formExitData.recipientDocumentTypeCopyExterna) == 11 ? alphanumericAbsolute : v => onlyNumbers(v), inputRequired, v => maxLengthInput(80, v)]" />
        </span>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label">Nombre del destinatario *</label>
          <q-input v-model="formExitData.recipientNameCopyExterna" dense outlined label="Inserte" class="tw-rounded-lg"
            :rules="[inputRequired, val => maxLengthInput(80, val),alphanumeric2]" />
        </span>
      </div>


      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label">{{isMedicinaLaboral ?'Dirección del destinatario *' :isRequired ? 'Dirección del destinatario *' :'Dirección del destinatario'}} </label>
          <q-input v-model.number="formExitData.addressRecipientCopyExterna" dense outlined label="Inserte" class="tw-rounded-lg"
            :rules="isMedicinaLaboral
              ? [inputRequired, val => maxLengthInput(30, val),alphanumeric2]
              : isRequired ? [inputRequired, val => maxLengthInput(30, val),alphanumeric2]:[ val => maxLengthInput(30, val),alphanumeric2]"
          />
        </span>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <label class="tw-w-full">
            <span class="tw-text-label">País destinatario *</span>
            <q-select  v-model="formExitData.countryRecipientCopyExterna" :options="optionsCountries" label="Seleccione" dense
                outlined map-options emit-value class="tw-rounded-lg" :rules="[inputRequired]">
            </q-select>
        </label>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <label class="tw-w-full">
            <span class="tw-text-label">{{isMedicinaLaboral ?'Departamento destinatario *' :isRequired ? 'Departamento destinatario *' :'Departamento destinatario'}}</span>
            <q-select v-model="formExitData.departmentRecipientCopyExterna" label="Seleccione" dense outlined map-options emit-value
              :readonly="isDisable" clearable class="tw-rounded-lg" :options="departmentsOptions"
              :rules="isMedicinaLaboral
                ?[inputRequired]
                :[isRequired ? inputRequired : null]">
            </q-select>
        </label>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <label class="tw-w-full">
            <span class="tw-text-label">{{isMedicinaLaboral ?'Municipio destinatario *' :isRequired ? 'Municipio destinatario *' :'Municipio destinatario'}}</span>
            <q-select :readonly="isDisable" v-model="formExitData.municipalityRecipientCopyExterna" label="Seleccione" dense outlined map-options emit-value
              clearable class="tw-rounded-lg" :options="municipioOptions"
              :rules="isMedicinaLaboral
                ?[inputRequired]
                :[isRequired ? inputRequired : null]">
            </q-select>
        </label>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label">Teléfono destinatario</label>
          <q-input v-model="formExitData.telephoneRecipientCopyExterna" dense outlined label="Inserte" class="tw-rounded-lg"
            :rules="[phoneFormat]" />
        </span>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label">Correo electrónico *</label>
          <q-input v-model="formExitData.emailRecipientCopyExterna" dense outlined label="Inserte" class="tw-rounded-lg"
            :rules="isMedicinaLaboral
              ?[inputRequired, validationEmail, val => maxLengthInput(200, val)]
              :isRequiredEmail?[inputRequired, validationEmail, val => maxLengthInput(200, val)]:[inputRequired,validationEmail,val => maxLengthInput(200, val)]"
          />
        </span>
      </div>
    </div>
  </q-form>

  <div class="tw-flex tw-justify-center tw-items-center tw-mb-10 tw-gap-6">
    <q-btn icon="add"  @click="addNewDestinary" label="Agregar" text-color="white" style="width: 240px" color="primary"
      class="tw-rounded-xl tw-h-12 tw-p-2" />
  </div>
</template>

<script setup lang="ts" >
  import { ref, onMounted, watch } from "vue";
  import {
    inputRequired,
    maxLengthInput,
    validationEmail,
    alphanumeric2,
    homePhoneNumberMinAndMaxLength,
    onlyNumbers,
    phoneFormat, alphanumericAbsolute
  } from "src/helpers/validations";
  import { useCountries, useDepartments, useMunicipalities } from "src/composables/useVersion";
  import { useCrearComunicacionesLogic } from "src/pages/Correspondencia/Crear/CrearComunicaciones/CrearComunicaciones.Logic";
  import {sgdeaAxios} from "src/services";

  const props=defineProps({
    isMedicinaLaboral:{type:Boolean, required:false, default:false},
    idComunicacion:{type:Number, required:false, default:null},
    isFisrRender:{type:Boolean, required:false, default:true}
  })
  const isDisable=ref(false)
  const isRequiredEmail = ref(false);
  const isRequired = ref(false);
  const { optionsCountries } = useCountries()
  const departmentsOptions = ref([]);
  const municipioOptions = ref([]);
  const shippingMethodsOptions = ref([]);
  const tipoDocumentoOptions=ref([]);
  const formExitData = ref({
    shippingMethodCopyExterna: '',
    recipientDocumentTypeCopyExterna: '',
    recipientNameCopyExterna: '',
    addressRecipientCopyExterna: '',
    countryRecipientCopyExterna: { label: 'Colombia', value: 425 },
    departmentRecipientCopyExterna: '',
    municipalityRecipientCopyExterna: '',
    telephoneRecipientCopyExterna: '',
    emailRecipientCopyExterna: '',
    numeroDocumentoCopyExterna: ''
  });
  const myForm = ref(null);

  const emit = defineEmits([
    "update:itemAdded",
  ]);

  const mapListUserExternoById=async()=>{
    if(props.idComunicacion){
      const { getAllDataByID} = useCrearComunicacionesLogic();
      const allData= await getAllDataByID(props.idComunicacion);
      const dataArray=allData.listExterna;
      const mapOfobjetoBuilder= dataArray.map(data=>{
        return ({
          emailRecipientCopyExterna:data.correoDestinatario,
          shippingMethodCopyExterna: getIdFormaEnvio(data.formaEnvio, shippingMethodsOptions.value),
          recipientDocumentTypeCopyExterna: data.tipoDocumento,
          recipientNameCopyExterna: data.nombreDest,
          addressRecipientCopyExterna: data.direccionDestinatario,
          countryRecipientCopyExterna:{label:data.pais.nombre},
          departmentRecipientCopyExterna: data.pais.idPais !== 425 ? data.pais.nombre : data.municipio.idDepartamento,
          municipalityRecipientCopyExterna: data.pais.idPais !== 425 ? data.pais.nombre : data.municipio.idMunicipio,
          telephoneRecipientCopyExterna: data.telefonoDestinatario,
          municipio_label:(data.pais.idPais !== 425 ? data.pais.nombre : data.municipio.nombre),
          departamento_label:(data.pais.idPais !== 425 ? data.pais.nombre : data.departamento.nombre),
          forma_label: data.formaEnvio,
          tipo_label: data.tipoDocumento.nombre,
          numeroDocumentoCopyExterna: data.numerDeDocumento
        })
      })
      emit("update:itemAdded", mapOfobjetoBuilder);
    }
  }

  onMounted(async () => {
    const { getTipoDocumentoOptions, getShippingWayOptions } = useCrearComunicacionesLogic();
    tipoDocumentoOptions.value = await getTipoDocumentoOptions();
    tipoDocumentoOptions.value = [...tipoDocumentoOptions.value.filter(tipo => tipo.label !== 'Ninguno')];

    const shippingMethods = await getShippingWayOptions();
    //shippingMethodsOptions.value = shippingMethods.filter(shipping=>!['Mensajero', 'Mensajería'].includes(shipping.label));
    shippingMethodsOptions.value = shippingMethods.filter(shipping => (!['Personal', 'Mensajería'].includes(shipping.label)));
    const  optionsDepartments  = await getDepartamentos(425);
    departmentsOptions.value = optionsDepartments.value;


    props.isFisrRender && mapListUserExternoById()
  });

  const successAdd = async () => {
    const objetoBuilder={...formExitData.value,
      municipio_label:getLabel(formExitData.value.municipalityRecipientCopyExterna,municipioOptions.value),
      departamento_label:getLabel(formExitData.value.departmentRecipientCopyExterna,departmentsOptions.value),
      forma_label:getLabel(formExitData.value.shippingMethodCopyExterna,shippingMethodsOptions.value),
      tipo_label:getLabel(formExitData.value.recipientDocumentTypeCopyExterna,tipoDocumentoOptions.value),
      countryRecipientCopyExterna: typeof formExitData.value.countryRecipientCopyExterna === 'object' ? formExitData.value.countryRecipientCopyExterna : {label:getLabel(formExitData.value.countryRecipientCopyExterna, optionsCountries.value), value: formExitData.value.countryRecipientCopyExterna}
    }
    emit("update:itemAdded", objetoBuilder);
  }

  const addNewDestinary = async() => {
    const isValidate=await myForm.value.validate();
    isValidate && successAdd()
  }

  watch(()=>formExitData.value.countryRecipientCopyExterna,async(value)=>{
    isDisable.value = false;
    formExitData.value.departmentRecipientCopyExterna =''

    const  optionsDepartments  = await getDepartamentos(value);
    departmentsOptions.value = optionsDepartments.value;
  })

  watch(
    () => formExitData.value.departmentRecipientCopyExterna,
    async (value) => {

      if(typeof value === 'string' ){
        const municipalityLabel=formExitData.value.departmentRecipientCopyExterna
        formExitData.value.municipalityRecipientCopyExterna =municipalityLabel;
        return
      }

      if (formExitData.value.countryRecipientCopyExterna.value !== 425) {
        formExitData.value.municipalityRecipientCopyExterna = getLabel(value, departmentsOptions.value) ;
        return;
      }

      formExitData.value.municipalityRecipientCopyExterna = '';
      const { optionsMunicipalities } = await useMunicipalities(value);
      municipioOptions.value = optionsMunicipalities.value;
    }
  );

  const getLabel=(value, options)=> {
    let option = options.find(option => option.value === value);
    if(!option && value && typeof value === 'string'){
      option={label:value}
    }
    return option ? option.label : '';
  }

  const getIdFormaEnvio=(value, options)=>{
    let option =  options.find(option => option.label === value);
    return option ? option.value : '';
  }

  watch(
    () => formExitData.value.shippingMethodCopyExterna,
    (value) => {
      if(!props.isMedicinaLaboral){
        return
      }
      isRequired.value = false;
      isRequiredEmail.value = false;

      if(+value === 3 || +value === 6){
        isRequired.value = true;
        return
      }

      if(+value === 1 || +value === 2){
        isRequiredEmail.value = true;
        return
      }
    }
  );

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
