<template>
  <q-form ref="myForm" greedy>
    <div class="row q-col-gutter-md q-pb-md q-px-md">
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label">Forma de envío *</label>
          <q-select map-options emit-value dense outlined class="tw-rounded-lg" v-model="formExitData.manualExternoFormaEnvioId"
            :options="shippingMethodsOptions" label="Seleccione" :rules="[inputRequired]"
          />
        </span>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label">Tipo de documento *</label>
          <q-select map-options emit-value dense outlined class="tw-rounded-lg" v-model="formExitData.manualExternoTipoDocumentoDestinatarioId"
            :options="tipoDocumentoOptions" label="Seleccione" :rules="[inputRequired]"
          />
        </span>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label">Número de documento {{ !isNinguno ? '*':'' }}</label>
          <q-input v-model.number="formExitData.manualExternoNumeroDocumentoDestinatario" dense outlined label="Inserte" class="tw-rounded-lg"
                   :rules="!isNinguno?[inputRequired, Number(formExitData.manualExternoTipoDocumentoDestinatarioId) == 11 ? alphanumeric : v => onlyNumbers(v), val => maxLengthInput(80, val)]:[Number(formExitData.manualExternoTipoDocumentoDestinatarioId) == 11 ? alphanumeric : v => onlyNumbers(v), val => maxLengthInput(15, val)]" :disable="isNinguno" />
        </span>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label">Nombre del destinatario *</label>
          <q-input v-model.number="formExitData.manualExternoNombreDestinatario" dense outlined label="Inserte" class="tw-rounded-lg"
            :rules="[inputRequired, val => maxLengthInput(80, val)]" />
        </span>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label">Dirección del destinatario {{isRequired?'*':''}}</label>
          <q-input v-model.number="formExitData.manualExternoDireccion" dense outlined label="Inserte" class="tw-rounded-lg"
            :rules="isRequired?[inputRequired, val => maxLengthInput(1000, val)]:[val => maxLengthInput(1000, val)]" />
        </span>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <label class="tw-w-full">
            <span class="tw-text-label">País destinatario {{isRequired?'*':''}}</span>
            <q-select v-model="formExitData.manualExternoPaisId" emit-value map-options outlined dense use-input hide-selected class="tw-rounded-lg"
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
            <span class="tw-text-label">Departamento destinatario {{isRequired?'*':''}}</span>
            <q-select v-model="formExitData.manualExternoDeptoId" emit-value map-options outlined dense use-input hide-selected class="tw-rounded-lg"
            fill-input label="Seleccione" :options="departmentsOptions" @filter="selectOptionsFilterFnDepartment" clearable :disable="isDisable"
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
            <span class="tw-text-label">Municipio destinatario {{isRequired?'*':''}}</span>
            <q-select v-model="formExitData.manualExternoMunicipioId" emit-value map-options outlined dense use-input hide-selected class="tw-rounded-lg"
            fill-input label="Seleccione" :options="municipioOptions" @filter="selectOptionsFilterFnMunicipality" clearable :disable="isDisable"
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
          <q-input v-model.number="formExitData.manualExternoTelefono" dense outlined label="Inserte" class="tw-rounded-lg"
            :rules="[ homePhoneNumberMinAndMaxLength]" />
        </span>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label">Correo electrónico destinatario{{isEmailRequired ? '*': ''}}</label>
          <q-input v-model.number="formExitData.manualExternoCorreo" dense outlined label="Inserte" class="tw-rounded-lg"
            :rules="isEmailRequired ?[inputRequired, validationEmail]:[validationEmail]" />
        </span>
      </div>
    </div>
  </q-form>

  <div class="tw-flex tw-justify-center tw-items-center tw-mb-10 tw-gap-6">
    <q-btn icon="add"  @click="addNewDestinary" label="Agregar" text-color="white" style="width: 240px" color="primary"
      class="tw-rounded-xl tw-h-12 tw-p-2" />
  </div>
</template>

<script setup >
  import { ref, onMounted, watch, computed } from "vue";
  import {
    inputRequired,
    maxLengthInput,
    minLengthInput,
    onlyNumbers,
    homePhoneNumber,
    mobilePhonNumber,
    validationEmail,
    alphanumeric,
    alphanumericWithSpaceAndHashtag,
    homePhoneNumberMinAndMaxLength
  } from "src/helpers/validations";
  import { useCountries, useDepartments, useMunicipalities } from "src/composables/useVersion";
  import { useCrearComunicacionesLogic } from "src/pages/Correspondencia/Crear/CrearComunicaciones/CrearComunicaciones.Logic";

  const isEmailRequired=ref(false);
  const isRequired = ref(true);
  const isCourier = ref(false);
  const { optionsCountries } = useCountries()
  const departmentsOptions = ref([]);
  const departmentsOptionsStatic = ref([]);
  const municipioOptionsStatic = ref([]);
  const municipioOptions = ref([]);
  const shippingMethodsOptions = ref([]);
  const tipoDocumentoOptions=ref([]);
  const formExitData = ref({
    manualExternoFormaEnvioId: '',
    manualExternoTipoDocumentoDestinatarioId: '',
    manualExternoNumeroDocumentoDestinatario: '',
    manualExternoNombreDestinatario: '',
    manualExternoDireccion: '',
    manualExternoPaisId: {value: 425, label: 'Colombia'},
    manualExternoDeptoId: '',
    manualExternoMunicipioId: '',
    manualExternoTelefono: '',
    manualExternoCorreo: '',
  });
  const myForm = ref(null);
  const isNinguno = computed(() => formExitData.value.manualExternoTipoDocumentoDestinatarioId === 12)
  const opsContry = ref()
  const isDisable = ref(false)

  const emit = defineEmits([
    "update:itemAdded",
  ]);

  onMounted(async () => {
    const { getTipoDocumentoOptions, getShippingWayOptions } = useCrearComunicacionesLogic();
    tipoDocumentoOptions.value = await getTipoDocumentoOptions();
    const opsFormaEnvio = await getShippingWayOptions()
    shippingMethodsOptions.value = opsFormaEnvio.filter(it => it.label != 'Mensajero');
    const { optionsDepartments } = await useDepartments();
    departmentsOptionsStatic.value = optionsDepartments.value;
  });



  const successAdd = async () => {
    emit("update:itemAdded", {...formExitData.value,
      municipio_label:getLabel(formExitData.value.manualExternoMunicipioId,municipioOptions.value),
      departamento_label:getLabel(formExitData.value.manualExternoDeptoId,departmentsOptions.value),
      forma_label:getLabel(formExitData.value.manualExternoFormaEnvioId,shippingMethodsOptions.value),
      tipo_label:getLabel(formExitData.value.manualExternoTipoDocumentoDestinatarioId,tipoDocumentoOptions.value)
    });
  }

  const addNewDestinary = async() => {
    const isValidate=await myForm.value.validate();
    isValidate && successAdd()
  }

  watch(
    () => formExitData.value.manualExternoDeptoId,
    async (value) => {
    if(!value ){
      formExitData.value.manualExternoMunicipioId = '';
      return
    }
    if(typeof value === 'string' ){
      const municipalityLabel=formExitData.value.manualExternoDeptoId
      formExitData.value.manualExternoMunicipioId =municipalityLabel;
      return
    }
    formExitData.value.manualExternoMunicipioId = '';
    const { optionsMunicipalities } = await useMunicipalities(value);
    municipioOptionsStatic.value = optionsMunicipalities.value;
    municipioOptions = municipioOptionsStatic.value
    }
  );

  const getLabel=(value, options)=> {
    const option = options.find(option => option.value === value);
    return option ? option.label : '';
  }

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

  watch(
  () => formExitData.value.manualExternoFormaEnvioId,
  (value) => {

    isRequired.value = false;
    isEmailRequired.value = false;

    if(value === 3 || value === 4){
      isRequired.value = true;
      return
    }

    if(value === 1 || value === 2){
      isEmailRequired.value = true;
      return
    }
  }
);

watch(
  () => formExitData.value.manualExternoTipoDocumentoDestinatarioId,
  (value) => {
    if (value == 12) {
      formExitData.value.manualExternoNumeroDocumentoDestinatario = ''
    }
  }
);

watch(()=>formExitData.value.manualExternoPaisId,(value)=>{
  isDisable.value = false;
  formExitData.value.manualExternoDeptoId =''
  if(value !== 425){
    formExitData.value.manualExternoDeptoId = getLabel(value, optionsCountries.value);
    isDisable.value = true;
  }
})

</script>
