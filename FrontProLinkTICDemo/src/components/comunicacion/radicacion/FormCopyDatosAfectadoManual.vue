<template>
<q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
    <p class="tw-text-2xl tw-font-bold tw-pb-4 ">
      Sección datos del afectado
    </p>

    <div class="tw-mt-2">
      <div class="row q-col-gutter-md q-pb-md q-px-md">
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
          <span class="tw-w-full">
            <label class="tw-text-label">Tipo de documento del afectado *</label>
            <q-select v-model="props.dataInitial.comTipoComunicacionIdAfectado" label="Seleccione" map-options emit-value dense outlined
              :options="tipoDocumentoOptions" :rules="[inputRequired]" class="tw-rounded-lg">
            </q-select>
          </span>
        </div>

        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
          <span class="tw-w-full">
            <label class="tw-text-label">Número de documento del afectado {{!isNinguno ? '*' :''}}</label>
            <q-input v-model="props.dataInitial.comNumeroAfectado" dense outlined label="Inserte" class="tw-rounded-lg" @keypress="Number(props.dataInitial.comTipoComunicacionIdAfectado) == 11 ? onlyAlphaNumeric : onlyNumbers"
              :rules="!isNinguno ?  [inputRequired, val => maxLengthInput(80, val), Number(props.dataInitial.comTipoComunicacionIdAfectado) == 11 ? alphanumeric : (v: string) => onlyNumbers(v)] :[val => maxLengthInput(80, val), Number(props.dataInitial.comTipoComunicacionIdAfectado) == 11 ? alphanumeric : (v: string) => onlyNumbers(v)]" :disable="isNinguno" />
          </span>
        </div>

        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
          <span class="tw-w-full">
            <label class="tw-text-label">Nombre del afectado *</label>
            <q-input v-model="form0.comNombreAfectado" dense outlined label="Inserte" class="tw-rounded-lg" @keypress="alphabeticalWithSpecialCharacters"
              :rules="[ val => maxLengthInput(200, val), inputRequired, alphabeticalWithSpecialCharacters]" />
          </span>
        </div>
      </div>
    </div>
  </q-card>

</template>

<script lang="ts" setup>
import { ref, defineProps, onMounted, watch, computed } from 'vue';
import { inputRequired, maxLengthInput, alphanumeric, onlyNumbers, alphabeticalWithSpecialCharacters } from "src/helpers/validations";
import { useCrearComunicacionesLogic } from 'src/pages/Correspondencia/Crear/CrearComunicaciones/CrearComunicaciones.Logic';

const props=defineProps({
  dataInitial: Object,
});

const form0 = ref(props.dataInitial);
const tipoDocumentoOptions = ref([]);
const isNinguno = computed(() => form0.value.comTipoComunicacionIdAfectado === 12)
const officialOptions = ref([]);
const officialOptionsStatic = ref([]);

onMounted(async() => {

  const {getTipoDocumentoOptions, getListOfficialOptions2} = useCrearComunicacionesLogic();

  officialOptionsStatic.value= await getListOfficialOptions2(11);
  const tipoDocuments = await getTipoDocumentoOptions();
  tipoDocumentoOptions.value = [...tipoDocuments];
});

function onlyAlphaNumeric(event: { which: any; keyCode: any; preventDefault: () => void; }) {
  let charCode = (event.which) ? event.which : event.keyCode;
  if ((charCode > 47 && charCode < 58) ||  // Numbers
    (charCode > 64 && charCode < 91) ||  // Uppercase letters
    (charCode > 96 && charCode < 123) ||  // Lowercase letters
    charCode === 32) {                   // Space
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

watch(
  () => form0.value.comTipoComunicacionIdAfectado,
  (value) => {
    if (value == 12) {
      form0.value.comNumeroAfectado = ''
    }
  }
);

</script>


