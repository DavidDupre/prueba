<template>
  <q-card class="tw-rounded-xl tw-p-4" flat bordered>
    <q-expansion-item default-opened>
      <template v-slot:header>
        <div class="col row">
          <b class="tw-text-lg">Datos de Salida</b>
        </div>
      </template>

      <div class="row q-col-gutter-md q-pb-md q-px-md">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <span class="text-weight-bold">Forma de Envío *</span>
          <q-select :rules="[inputRequired]" name="formaEnvio" outlined v-model="form.formaEnvio" label="Seleccione"
            dense map-options :options="opsEnvio" :disable="props.isDisabled" />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <span class="text-weight-bold">Tipo de Documento del Destinatario </span>
          <q-select :rules="[]" name="tipoDocumento" outlined v-model="form.tipoDocumento" label="Seleccione" dense
            map-options emit-value :options="opsTipoDoc" :disable="props.isDisabled" />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <span class="text-weight-bold">Documento del Destinatario {{ !isNinguno ? '*' : '' }}</span>
          <q-input
            :rules="!isNinguno ? [inputRequired, Number(form.tipoDocumento) == 11 ? alphanumericAbsolute : v => onlyNumbers(v), v => maxLengthInput(15, v)] : [Number(form.tipoDocumento) == 11 ? alphanumericAbsolute : v => onlyNumbers(v), v => maxLengthInput(15, v)]"
            name="numeroDocumentoDestinatario" map-options outlined v-model="form.numeroDocumentoDestinatario"
            label="Inserte" dense :disable="isNinguno || props.isDisabled" autocomplete="off" />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <span class="text-weight-bold">Nombre del Destinatario *</span>
          <q-input :rules="[inputRequired, alphabeticalWithSpecialCharacters, v => maxLengthInput(200, v)]"
            name="nombreDestinatario" outlined v-model="form.nombreDestinatario" label="Inserte" dense
            autocomplete="off" :disable="props.isDisabled" />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <span class="text-weight-bold">Dirección del Destinatario <span v-if="isRequired">*</span></span>
          <q-input :rules="isRequired ? [inputRequired, v => maxLengthInput(200, v)] : [v => maxLengthInput(30, v)]"
            name="direccionDestinatario" outlined v-model="form.direccionDestinatario" label="Inserte" dense
            autocomplete="off" :disable="props.isDisabled" />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <span class="text-weight-bold">País <span v-if="isRequired">*</span></span>
          <q-select :rules="isRequired ? [inputRequired] : null" name="paisDestinatario" outlined
            v-model="form.paisDestinatario" label="Seleccione" dense map-options :options="optionsCountries"
            :disable="props.isDisabled" />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <span class="text-weight-bold">Departamento <span v-if="isRequired">*</span></span>
          <q-select :rules="isRequired ? [v => inputRequired(v.label)] : null" name="departamentoDestinatario" outlined
            v-model="form.departamentoDestinatario" label="Seleccione" dense map-options
            :disable="isntColombia || props.isDisabled" :options="departments" />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <span class="text-weight-bold">Municipio <span v-if="isRequired">*</span></span>
          <q-select :rules="isRequired ? [v => inputRequired(v.label)] : null" name="municipioDestinatario" outlined
            v-model="form.municipioDestinatario" label="Seleccione" dense map-options
            :disable="isntColombia || props.isDisabled" :options="municipalities" />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <span class="text-weight-bold">Teléfono Destinatario</span>
          <q-input :rules="[onlyNumbers, alphanumeric2, v => maxLengthInput(10, v), v => minLengthInput(7, v)]"
            name="telefonoDestinatario" outlined v-model="form.telefonoDestinatario" label="Inserte" dense
            autocomplete="off" :disable="props.isDisabled" />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <span class="text-weight-bold">Correo Electrónico Destinatario {{ isRequiredEmail ? '*' : '' }}</span>
          <q-input
            :rules="isRequiredEmail ? [inputRequired, v => validationEmail(v), v => maxLengthInput(200, v)] : [v => validationEmail(v), v => maxLengthInput(30, v)]"
            name="correoElectronico" outlined v-model="form.correoElectronico" label="Inserte" dense autocomplete="off"
            :disable="props.isDisabled" />
        </div>
      </div>
    </q-expansion-item>
  </q-card>
</template>

<script setup lang="ts">
import { PropType, Ref, computed, onMounted, ref, watch } from 'vue';

import {
  alphanumeric2,
  inputRequired,
  maxLengthInput,
  validationEmail,
  alphanumericAbsolute,
  onlyNumbers,
  minLengthInput,
  alphabeticalWithSpecialCharacters
} from "src/helpers/validations";
import { SelectInput } from "src/interfaces";
import { useCountries, useDepartments, useMunicipalities } from "src/composables/useVersion";
import { sgdeaAxios } from 'src/services';

const { optionsCountries } = useCountries()
const departments: Ref<SelectInput[]> = ref([]);
const municipalities: Ref<SelectInput[]> = ref([]);
const isntColombia = ref<boolean>(false);
const isRequired = ref(false);
const isRequiredEmail = ref(false)
const isNinguno = computed(() => props.form.tipoDocumento == '12' || props.form.tipoDocumento.label === 'Ninguno')


const props = defineProps({
  opsEnvio: [],
  opsTipoDoc: [],
  isDisabled: Boolean,
  form: {
    type: Object as PropType<Destinatario>,
    default: () => ({
      formaEnvio: { label: '', value: '' },
      tipoDocumento: { label: '', value: '' },
      numeroDocumentoDestinatario: '',
      nombreDestinatario: '',
      direccionDestinatario: '',
      paisDestinatario: { label: 'COLOMBIA', value: 425 },
      departamentoDestinatario: { label: '', value: '' },
      municipioDestinatario: { label: '', value: '' },
      telefonoDestinatario: '',
      correoElectronico: ''
    })
  }
})

const countryOriginal = ref()

onMounted(async () => {
  countryOriginal.value = props.form.paisDestinatario
})

const sortOptions = (vals) => {
  return vals.sort((leftItem, rightItem) => {
    const nombreA = leftItem.label.toLowerCase().trim();
    const nombreB = rightItem.label.toLowerCase().trim();

    if (nombreA < nombreB) {
      return -1;
    }

    if (nombreA > nombreB) {
      return 1;
    }

    return 0;
  });
}

watch(
  () => props.form.tipoDocumento,
  async (value) => {
    //@ts-ignore
    if (value === 12) {
      props.form.numeroDocumentoDestinatario = ''
    }
  }
);

const wasChanged = ref(false)

watch(
  () => props.form.paisDestinatario,
  async (value, oldValue) => {

    if (oldValue && oldValue.value !== value.value) {
      props.form.departamentoDestinatario = { label: '', value: '' };
      props.form.municipioDestinatario = { label: '', value: '' };
      municipalities.value = [];
    }
    if (!value || !value.label) {
      return;
    }

    let val = value as unknown as { label: string, value: any };

    // @ts-ignore
    if (val.label.toUpperCase() === 'COLOMBIA') {
      isntColombia.value = false
      // @ts-ignore
      const { optionsDepartments } = await useDepartments(value.value);
      departments.value = sortOptions(optionsDepartments.value);
    } else {
      //@ts-ignore
      await getDepartamentos(value.value);
    }
  },
  { immediate: true }
);

watch(
  () => props.form.departamentoDestinatario,
  async (value, oldValue) => {
    // @ts-check
    if (props.form.paisDestinatario.value != '425') {
      const result = await getMunicipios(value.value, props.form.paisDestinatario.value);
      municipalities.value = sortOptions(result);
    }
    else{
      // @ts-ignore
      const { optionsMunicipalities } = await useMunicipalities(value.value);
      municipalities.value = sortOptions(optionsMunicipalities.value);
      if (value.label !== oldValue.label && oldValue.label !== '') {
        props.form.municipioDestinatario = { label: '', value: '' }
      }
    }
  }
);

watch(
  () => props.form?.formaEnvio?.value,
  (value) => {


    isRequired.value = false;
    isRequiredEmail.value = false;

    if (value === 3 || value === 4) {
      isRequired.value = true;
      return
    }

    if (value === 1 || value === 2) {
      isRequiredEmail.value = true;
      return
    }
  }
);

interface Destinatario {
  formaEnvio: { label: string, value: number };
  tipoDocumento: { label: string, value: string };
  numeroDocumentoDestinatario: string;
  nombreDestinatario: string;
  direccionDestinatario: string;
  paisDestinatario: { label: string, value: string };
  municipioDestinatario: { label: string, value: string };
  departamentoDestinatario: { label: string, value: string };
  telefonoDestinatario: string;
  correoElectronico: string;
}

const getDepartamentos = async (paisId) => {

    const paisEncontrado = optionsCountries.value.find(p => p.value === paisId);
    const idPositiva = paisEncontrado.idPositiva;
    const response = await sgdeaAxios.get(`/geodivision/departamento/${idPositiva}`);
    if (response.status === 200) {
      const { data } = response;
      departments.value = data.map((departamento) => {
        return {
          value: departamento.idDepartamento,
          label: departamento.nombre,
        };
      });
    }
};

const getMunicipios = async (departamentoId, paisId) => {
  const paisEncontrado = optionsCountries.value.find(p => p.value === paisId);
  const idPositiva = paisEncontrado.idPositiva;
  const response = await sgdeaAxios.get(`/geodivision/municipios/${idPositiva}?idDepartamento=${departamentoId}`);
  if (response.status === 200) {
    const { data } = response;
    return data.map((municipio) => {
      return {
        value: municipio.idMunicipio,
        label: municipio.nombre,
      };
    });
  }
  return [];
};
</script>
