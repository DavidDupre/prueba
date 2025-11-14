<template>
  <q-form ref="remitenteForm" autofocus greedy class="q-gutter-y-lg q-mt-lg">
    <q-card class="tw-rounded-xl tw-pt-4 tw-pb-2" flat bordered>
      <div class="tw-flex tw-justify-between tw-items-center tw-py-4">
        <span class="tw-font-bold tw-text-3xl tw-my-2 tw-pl-4">
          Remitente
        </span>
      </div>
      <div class="row q-col-gutter-md q-pb-md q-px-md">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <span class="text-weight-bold">Tipo de Remitente *</span>
          <q-input :rules="[isRequired]" name="tipoRemitente" outlined v-model="enteControl.tipoRemitente"
            label="Inserte" dense :disable="true" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <span class="text-weight-bold">Tipo de Documento del Remitente *</span>
          <q-select :rules="[selectRequired]" name="tipoDocumentoRemitente" outlined
            v-model="enteControl.tipoDocumentoRemitente" label="Seleccione" dense map-options emit-value
            :options="tipoIdentificacion" @update:model-value="setDocumentTypeHandler()" />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <span class="text-weight-bold">
            Número de Documento del Remitente
            <span v-if="!isNroDocumentoDisabled">*</span>
          </span>
          <q-input v-model="enteControl.numeroDocumentoRemitente" :label="inserteNroDocumentoLabel"
            :disable="isNroDocumentoDisabled" name="numeroDocumentoRemitente" @blur="getPerson"
            :rules=" [isRequired, v => maxLengthInput(15, v), Number(enteControl.tipoDocumentoRemitente) == 6 ? alphanumeric : (v: string) => onlyNumbers(v)]" outlined dense />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <span class="text-weight-bold">Nombre del Remitente * ({{ enteControl.nombreRemitente?.length }}/200)</span>
          <q-input :rules="[
            (val) => maxLengthInput(200, val),
            isRequired,
            alphabeticalWithSpecialCharacters
          ]" name="nombreRemitente" outlined v-model="enteControl.nombreRemitente" label="Inserte" dense />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <span class="text-weight-bold">País *</span>
          <q-select :rules="[selectRequired]" name="pais" outlined v-model="enteControl.paisRemitente"
            label="Seleccione" dense emit-value map-options :options="optionsCountries" :disabled="true" readonly/>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <span class="text-weight-bold">Departamento *</span>
          <q-select :rules="[selectRequired]" name="departamento" outlined v-model="enteControl.departamentoRemitente"
            label="Seleccione" dense emit-value map-options :options="departamentos" :readonly="isDisable"/>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <span class="text-weight-bold">Municipio *</span>
          <q-select :rules="[selectRequired]" name="municipio" outlined v-model="enteControl.municipioRemitente"
            label="Seleccione" dense emit-value map-options :options="municipios" :readonly="isDisable" />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <span class="text-weight-bold">Dirección del Remitente ({{ enteControl.direccionRemitente?.length
          }}/200)</span>
          <q-input :rules="[
            (val) => maxLengthInput(200, val),
          ]" name="direccionRemitente" outlined v-model="enteControl.direccionRemitente" label="Inserte" dense />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <span class="text-weight-bold">Teléfono</span>
          <q-input @update:model-value="(val) => validateInputPhone(val, enteControl, 'telefono')"
            :rules="[(val) => validarTelefonoRemitente(val)]" v-model="enteControl.telefonoRemitente" :maxlength="10"
            name="telefono" label="Inserte" outlined dense />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <span class="text-weight-bold">Correo Electrónico del Remitente * ({{ enteControl.emailRemitente?.length
          }}/200)</span>
          <q-input :rules="[
            validationEmail,
            (val) => maxLengthInput(200, val),
            isRequired,
          ]" v-model="enteControl.emailRemitente" name="emailRemitente" label="Inserte" outlined dense />
        </div>
      </div>
    </q-card>
  </q-form>
</template>

<script lang="ts" setup>
import {
  mobilePhoneNumberTenToTwelve,
  maxLengthInput,
  validationEmail,
  alphanumeric2,
  homePhoneNumberMinAndMaxLength,
  onlyNumbers,
  alphabeticalWithSpecialCharacters,
  alphanumeric
} from "src/helpers/validations";
import { validateInputPhone } from "src/pages/EntesDeControl/Bandeja/Detalles/utils";
import { onMounted, ref, watch } from "vue";
import { sgdeaAxios, adminAxios } from "src/services";
import { IEnteControl } from "../types";
import { getAcronimobyId } from 'src/helpers/prefijoTipoDoc';
import { useDepartments, useMunicipalities, useCountries } from "src/composables/useVersion";



const isDisable = ref(false)
const { optionsCountries } = useCountries();
const props = defineProps<{ remitenteData: any }>();
const isRequired = (val: string) => !!val || "El campo es obligatorio";
const selectRequired = (val: string) => !!val || "Debe seleccionar una opción";
const remitenteForm = ref();
const remitentes = ref([]);
const tipoIdentificacion = ref([]);
let isNroDocumentoDisabled = ref(false);
let nroDocumentoRules = ref([
  alphanumeric2,
  (val) => maxLengthInput(15, val),
  isRequired,
]);
let inserteNroDocumentoLabel = ref("Inserte");
const departamentos = ref([]);
const municipios = ref([]);

let enteControl = ref<Partial<IEnteControl>>({
  tipoRemitente: "Tercero",
  tipoDocumentoRemitente: "",
  numeroDocumentoRemitente: "",
  nombreRemitente: "",
  paisRemitente: 425,
  departamentoRemitente: "",
  municipioRemitente: "",
  direccionRemitente: "",
  telefonoRemitente: "",
  emailRemitente: "",
});

onMounted(async () => {
  await getRemitentes();
  await getTipoIdentificacion();
  verifyData();
  await getDepartamentos(425);
});

const verifyData = () => {
  if (props.remitenteData && props.remitenteData.tipoRemitente) {
    enteControl.value = props.remitenteData;
    setDocumentTypeHandler();
  }
};

const validarTelefonoRemitente = (val) => {
  const regex = /^3\d*/
  return regex.test(val) ? mobilePhoneNumberTenToTwelve(val) : homePhoneNumberMinAndMaxLength(val)
}

const validateForm = async () => {

if (enteControl.value.paisRemitente != 425 ) {
  enteControl.value.municipioRemitente = enteControl.value.departamentoRemitente;
}
enteControl.value = { ...enteControl.value };

  const isValid = await remitenteForm.value.validate();

  return isValid;
};


const clearForm = () => {
  enteControl.value = {}
  remitenteForm.value.reset();
  enteControl.value.tipoRemitente = "Tercero";
  enteControl.value.paisRemitente = '';
};

const getRemitentes = async () => {
  const response = await sgdeaAxios.get("/pqrd/listadoTiposRemitente");
  if (response.status === 200) {
    const { data } = response;
    remitentes.value = data.map((remitente) => {
      return {
        value: remitente.nombre,
        label: remitente.nombre,
      };
    });
  }
};

const getTipoIdentificacion = async () => {
  const response = await sgdeaAxios.get(
    "/api/entes/listadoTipoIdentificacion"
  );
  if (response.status === 200) {
    const { data } = response;
    const unorderedList = data.map((identificacion) => {
      return {
        value: identificacion.id,
        label: identificacion.nombre,
      };
    });
    unorderedList.sort((a, b) => a.label.localeCompare(b.label));
    tipoIdentificacion.value = unorderedList;
  }
};

const setDocumentTypeHandler = () => {

  const ningunoID = 12;
  if (enteControl.value.tipoDocumentoRemitente !== ningunoID) {
    isNroDocumentoDisabled.value = false;
    nroDocumentoRules.value = [
      Number(enteControl.value.tipoDocumentoRemitente) == 11 ? alphanumeric2 : (v: string) => onlyNumbers(v),
      (val) => maxLengthInput(15, val),
      isRequired,
    ];
    inserteNroDocumentoLabel.value = "Inserte";
    return;
  }

  isNroDocumentoDisabled.value = true;
  nroDocumentoRules.value = [];
  inserteNroDocumentoLabel.value = "";
  enteControl.value.numeroDocumentoRemitente = "";
};

const getRemitenteByNroDoc = async () => {
  if (enteControl.value.numeroDocumentoRemitente) {
    const response = await sgdeaAxios.get(
      `/api/entes/obtenerRemitente`,
      { params: { nroDocumento: enteControl.value.numeroDocumentoRemitente, tipoDocumento: enteControl.value.tipoDocumentoRemitente } }
    );
    if (response.status === 200) {
      const { data } = response;
      if (data) {
        enteControl.value = {
          ...enteControl.value,
          nombreRemitente: data.nombre,
          departamentoRemitente: data.departamento.idDepartamento,
          municipioRemitente: data.municipio.idMunicipio,
          direccionRemitente: data.direccion,
          telefonoRemitente: data.telefono,
          emailRemitente: data.email,
        }
      }

    }
  }
};

defineExpose({ validateForm, clearForm, enteControl });

const getDepartamentos = async (paisId) => {
  let optionsDepartments = [];
  const response = await sgdeaAxios.get(`/geodivision/pais/${paisId}`);

  if (response.status === 200) {
    const { data } = response;
    optionsDepartments = data.map((departamento) => {
      return {
        value: departamento.idDepartamento,
        label: departamento.nombre,
      };
    });
  }
  departamentos.value = optionsDepartments
};

const personData = ref(false);

async function getPerson() {
  const tipoDoc = getAcronimobyId(Number(enteControl.value.tipoDocumentoRemitente));
  const number = Number(enteControl.value.numeroDocumentoRemitente) ? Number(enteControl.value.numeroDocumentoRemitente) : '';

  try {
    const response = await sgdeaAxios.get("/personas", {
      params: { tipoDocumento: tipoDoc, numeroDocumento: number }
    });

    if (response.status === 200) {
      const data = response.data;

      await getDepartamentos(data.pais.idPais);

      enteControl.value.nombreRemitente = data.nombre1 + " " + data.nombre2 + " " + data.apellido1 + " " + data.apellido2;
      enteControl.value.direccionRemitente = data.direccion;
      enteControl.value.telefonoRemitente = data.telefono;
      enteControl.value.emailRemitente = data.email;
      enteControl.value.paisRemitente =  data.pais.idPais;

      if (data.departamento) {
        enteControl.value.departamentoRemitente = data.departamento.idDepartamento;
      }

      if (data.municipio) {
        enteControl.value.municipioRemitente = data.municipio.idMunicipio;
      }

      personData.value = true;

    } else {
      await limpiarExterno();
    }
  } catch (error) {
    console.error("Error al obtener la persona:", error);
    await limpiarExterno();
  }
}

const limpiarExterno = async () => {
  enteControl.value.nombreRemitente = ''
  enteControl.value.direccionRemitente = ''
  enteControl.value.telefonoRemitente = ''
  enteControl.value.emailRemitente = ''
  enteControl.value.departamentoRemitente = ''
  enteControl.value.municipioRemitente = ''
  await limpiarExterno()
}

watch(() => enteControl.value.paisRemitente, async (value) => {
  isDisable.value = false;
  enteControl.value.departamentoRemitente = '';
  enteControl.value.municipioRemitente = '';

  if (departamentos.value.length === 0) {
    isDisable.value = true;
    enteControl.value.departamentoRemitente = getLabel(enteControl.value.paisRemitente, optionsCountries.value);
    enteControl.value.municipioRemitente = getLabel(enteControl.value.paisRemitente, optionsCountries.value);
  }
});

watch(
  () => enteControl.value.departamentoRemitente,
  async (value) => {

    const municipioSeleccionado = municipios.value.length > 0 ? municipios.value.find(
      (m) => m.value === enteControl.value.municipioRemitente
    ) : null;

    if (!personData.value && municipioSeleccionado) {
      enteControl.value.municipioRemitente = '';
    }

    if (typeof value === 'string') {
      enteControl.value.municipioRemitente = value;
      return;
    }

    const { optionsMunicipalities } = await useMunicipalities(value);
    municipios.value = optionsMunicipalities.value;
    personData.value = false;
  }
);

const getLabel = (value, options) => {
  let option = options.find(option => option.value === value);
  if (!option && value && typeof value === 'string') {
    option = { label: value }
  }
  return option ? option.label : '';
}

</script>
