<template>
  <q-form ref="afectadoForm" greedy class="q-gutter-y-lg q-mt-lg">
    <q-card class="tw-rounded-xl tw-pt-2 tw-pb-2" flat bordered>
      <div class="tw-flex tw-justify-between tw-items-center tw-py-4">
        <span class="tw-font-bold tw-text-3xl tw-my-2 tw-pl-4"> Afectado</span>
      </div>
      <div class="row q-col-gutter-md q-pb-md q-px-md">
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <span class="text-weight-bold">Tipo de Documento del Afectado *</span>{{ enteControl.tipoDocumentoAfectado }}
          <q-select
            @update:model-value="setDocumentTypeHandler"
            v-model="enteControl.tipoDocumentoAfectado"
            :options="tipoIdentificacion"
            name="tipoDocumentoAfectado"
            :rules="[selectRequired]"
            label="Seleccione"
            map-options
            emit-value
            outlined
            dense
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <span class="text-weight-bold">
            Número de Documento del Afectado
            <span v-if="!isNroDocumentoDisabled">*</span>
          </span>
          <q-input
            v-model="enteControl.numeroDocumentoAfectado"
            :disable="isNroDocumentoDisabled"
            :label="inserteNroDocumentoLabel"
            :rules="nroDocumentoRules"
            name="numeroDocumentoAfectado"
            @blur="getAfectadoByNroDoc"
            outlined
            dense
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <span class="text-weight-bold">Nombre del Afectado * ({{ typeof enteControl.nombreAfectado === 'string' ? enteControl.nombreAfectado?.length : 0 }}/200)</span>
          <q-input
            :rules="[
              alphanumeric2,
              (val) => maxLengthInput(200, val),
              isRequired,
            ]"
            v-model="enteControl.nombreAfectado"
            name="nombreAfectado"
            label="Inserte"
            outlined
            dense
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <span class="text-weight-bold">
            ¿Pertenece a la Comunidad LGBTIQ+?
            <span v-if="!isNitDisabled">*</span>
          </span>
          <q-select
            v-model="enteControl.lgbti"
            :disable="isNitDisabled"
            :options="lgbtiOptions"
            :rules="isNitRules"
            :label="nitLabel"
            map-options
            name="lgbt"
            emit-value
            outlined
            dense
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <span class="text-weight-bold">
            Sexo
            <span v-if="!isNitDisabled">*</span>
          </span>
          <q-select
            v-model="enteControl.sexoAfectado"
            :disable="isNitDisabled"
            :options="listadoGenero"
            :rules="isNitRules"
            name="sexoAfectado"
            :label="nitLabel"
            map-options
            emit-value
            outlined
            dense
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <span class="text-weight-bold">
            Condición Especial
            <span v-if="!isNitDisabled">*</span>
          </span>
          <q-select
            v-model="enteControl.condicionEspecial"
            :options="condicionEspecial"
            :disable="isNitDisabled"
            name="condicionEspecial"
            :rules="isNitRules"
            :label="nitLabel"
            map-options
            emit-value
            outlined
            dense
          />
        </div>
      </div>
    </q-card>

    <q-card class="tw-rounded-xl tw-pt-2 tw-pb-2" flat bordered>
      <div class="tw-flex tw-justify-between tw-items-center tw-py-4">
        <span class="tw-font-bold tw-text-3xl tw-my-2 tw-pl-4">
          Medios de Contacto
        </span>
      </div>
      <div class="row q-col-gutter-md q-pb-md q-px-md">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <span class="text-weight-bold">
            Correo Electrónico del Afectado
            <span v-if="isEmailDisabled">*</span> ({{ (enteControl.emailAfectado)?.length }}/200)
          </span>
          <q-input
            v-model="enteControl.emailAfectado"
            name="correoAfectado"
            :rules="emailRules"
            label="Inserte"
            outlined
            dense
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <span class="text-weight-bold">Teléfono Celular del Afectado</span>
          <q-input
            @update:model-value="(val) => validateInputPhone(val, enteControl, 'telefonoCelularAfectado')"
            v-model="enteControl.telefonoCelularAfectado"
            :rules="[mobilePhoneNumberTenToTwelve]"
            name="telefonoAfectado"
            :maxlength="10"
            label="Inserte"
            outlined
            dense
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <span class="text-weight-bold">Teléfono Fijo del Afectado</span>
          <q-input
            @update:model-value="(val) => validateInputPhone(val, enteControl, 'telefonoFijoAfectado')"
            v-model="enteControl.telefonoFijoAfectado"
            :rules="[onlyNumbers, v => maxLengthInput(10, v), v => minLengthInput(7, v)]"
            name="telefonoFijoAfectado"
            :maxlength="10"
            label="Inserte"
            :minlength="7"
            outlined
            dense
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <span class="text-weight-bold">
            País del Afectado
            <span v-if="isAddressDisabled && isAddressDisabled!=null">*</span>
          </span>
          <q-select
            :rules="[isAddressDisabled && isAddressDisabled!=null ? (val) => selectRequired(val) : null]"
            v-model="enteControl.paisAfectado"
            name="paisAfectado"
            label="Seleccione"
            :options="paises"
            map-options
            emit-value
            outlined
            dense
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <span class="text-weight-bold">
            Departamento del Afectado
            <span v-if="isAddressDisabled && isAddressDisabled!=null">*</span>
          </span>
          <q-select
            :rules="[isAddressDisabled && isAddressDisabled!=null ? (val) => selectRequired(val) : null]"
            v-model="enteControl.departamentoAfectado"
            :loading="loadingDepartamento"
            name="departamentoAfectado"
            :options="departamentos"
            label="Seleccione"
            :clearable="true"
            map-options
            emit-value
            outlined
            dense
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <span class="text-weight-bold">
            Municipio del Afectado
            <span v-if="isAddressDisabled && isAddressDisabled!=null">*</span>
          </span>
          <q-select
            :rules="[isAddressDisabled && isAddressDisabled!=null ? (val) => selectRequired(val) : null]"
            v-model="enteControl.municipioAfectado"
            :loading="loadingMunicipio"
            name="municipioAfectado"
            :options="municipios"
            label="Seleccione"
            :clearable="true"
            map-options
            emit-value
            outlined
            dense
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <span class="text-weight-bold">
            Dirección del Afectado
            <span v-if="isAddressDisabled && isAddressDisabled!=null">*</span> ({{ (enteControl.direccionAfectado)?.length }}/200)
          </span>
          <q-input
            :rules="[
              isAddressDisabled && isAddressDisabled!=null ? (val) => isRequired(val) : null,
              (val) => maxLengthInput(200, val),
            ]"
            v-model="enteControl.direccionAfectado"
            name="direccionContacto"
            label="Inserte"
            outlined
            dense
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <span class="text-weight-bold"
            >Medio que Autoriza para Envío de Respuesta *</span
          >
          <q-select
            @update:model-value="setMedioHandler"
            v-model="enteControl.medioRespuesta"
            :rules="[selectRequired]"
            :options="listadoMedios"
            name="medioRespuesta"
            label="Seleccione"
            map-options
            emit-value
            outlined
            dense
          />
        </div>
      </div>
    </q-card>
  </q-form>
</template>

<script lang="ts" setup>
import { sgdeaAxios } from "src/services";
import { IEnteControl } from "../types";
import { onMounted, ref, watch } from "vue";
import {
  mobilePhoneNumberTenToTwelve,
  homePhoneNumberMinAndMaxLength,
  onlyNumbers,
  minLengthInput,
  maxLengthInput,
  validationEmail,
  alphanumeric2,
  alphabeticalWithSpecialCharacters
} from "src/helpers/validations";
import { getPaises, getDepartamentos, getMunicipios } from "../utils";
import { validateInputPhone } from "src/pages/EntesDeControl/Bandeja/Detalles/utils";
import { useDepartments, useMunicipalities, useCountries } from "src/composables/useVersion";

const isRequired = (val: string) => !!val || "El campo es obligatorio";
const selectRequired = (val: string) => (!!val) || "Debe seleccionar una opción";
const selectRequiredTwo = (val: string) => (!!val || val=="") || "Debe seleccionar una opción";
const emailRules = ref([validationEmail, (val) => maxLengthInput(200, val), isRequired]);
const props = defineProps<{ afectadoData: any; }>();
const inserteNroDocumentoLabel = ref("Inserte");
const isNroDocumentoDisabled = ref(false);
const isNitRules = ref([selectRequiredTwo]);
const tipoIdentificacion = ref([]);
const isAddressDisabled = ref(null);
const condicionEspecial = ref([]);
const isEmailDisabled = ref(false);
const loadingDepartamento = ref(false);
const loadingMunicipio = ref(false);
const nitLabel = ref("Seleccione");
const afectadoForm = ref(null);
const isNitDisabled = ref(false);
const listadoMedios = ref([]);
const nroDocumentoRules = ref([
  (val) => maxLengthInput(15, val),
  isRequired,
]);

let lgbtiOptions = ref([
  { value: true, label: "Si" },
  { value: false, label: "No" },
]);

const paises = ref([]);
const departamentos = ref([]);
const municipios = ref([]);
const listadoGenero = ref([]);
let enteControl = ref<Partial<IEnteControl>>({
  numeroDocumentoAfectado: null,
  tipoDocumentoAfectado: null,
  telefonoCelularAfectado: "",
  departamentoAfectado: null,
  telefonoFijoAfectado: "",
  direccionAfectado: null,
  condicionEspecial: null,
  municipioAfectado: null,
  nombreAfectado: null,
  medioRespuesta: null,
  emailAfectado: "",
  sexoAfectado: null,
  lgbti: null,
  paisAfectado: null,
});

onMounted(async () => {
  await getTipoIdentificacion();
  await getCondicionEspecial();
  await getListadoMedios();
  await getListadoGenero();
  await getPaisesHandler();
  verifyData();
});


const verifyData = () => {
  if (props.afectadoData && (props.afectadoData.tipoDocumentoAfectado || props.afectadoData.medioRespuesta)) {
    enteControl.value = props.afectadoData;
    setMedioHandler(enteControl.value.medioRespuesta);
    setDocumentTypeHandler();
  }
};

const validateForm = async () => {

  // if(enteControl.value.paisAfectado !== 425){
  //   enteControl.value.municipioAfectado = enteControl.value.departamentoAfectado;
  // }

  const isValid = await afectadoForm.value?.validate();

  return isValid;
};

const clearForm = () => {
  enteControl.value = {};
  enteControl.value.paisAfectado = 425;
};

const getTipoIdentificacion = async () => {
  const response = await sgdeaAxios.get(
    "/api/entes/listadoTipoIdentificacion"
  );
  if (response.status === 200) {
    const { data } = response;
    tipoIdentificacion.value = data.map((identificacion) => {
      return {
        value: identificacion.id,
        label: identificacion.nombre,
      };
    }).filter((identificacion) => identificacion.value !== 12);
  }
};

const getCondicionEspecial = async () => {
  const response = await sgdeaAxios.get("/pqrd/listadoCondiciones");
  if (response.status === 200) {
    const { data } = response;
    const unorderedList = data.map((condicion) => {
      return {
        value: condicion.id,
        label: condicion.nombre,
      };
    });

    condicionEspecial.value = unorderedList;
  }
};

const getListadoMedios = async () => {
  const response = await sgdeaAxios.get("/pqrd/listadoMediosRespuesta");
  if (response.status === 200) {
    const { data } = response;
    listadoMedios.value = data.map((medios) => {
      return {
        value: medios.id,
        label: medios.nombre,
      };
    });
  }
};

const getListadoGenero = async () => {
  const response = await sgdeaAxios.get("/pqrd/listadoGenero");
  if (response.status === 200) {
    const { data } = response;
    const unorderedList = data.map((genero) => {
      return {
        value: genero.id,
        label: genero.nombre,
      };
    });

    unorderedList.sort((a, b) => a.label.localeCompare(b.label));
    listadoGenero.value = unorderedList;
  }
};

const getPaisesHandler = async () => {
  paises.value = await getPaises();
  // Seleccionar Colombia por default
  enteControl.value.paisAfectado = enteControl.value.paisAfectado ?  enteControl.value.paisAfectado : 425;
};

const clearValidations = () => {
  const data = enteControl.value;
  enteControl.value = {};
  afectadoForm.value?.reset();
  enteControl.value = data;
}

const getDepartamentosAfectado = async (paisId) => {
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

const isDisable = ref(false);

watch(() => enteControl.value.paisAfectado, async (value) => {
  isDisable.value = false;

  const departamentoSeleccionado = departamentos.value.length > 0 ? departamentos.value.find(
      (d) => d.value === enteControl.value.departamentoAfectado
    ) : null;

  if (!enteControl.value.departamentoAfectado || !enteControl.value.municipioAfectado && value == 425) {
    enteControl.value.departamentoAfectado = '';
    enteControl.value.municipioAfectado = '';
  }

  if (departamentoSeleccionado) {
    enteControl.value.departamentoAfectado = '';
  }

  const depa = await getDepartamentosAfectado(value);
  departamentos.value = depa.value;

  if (departamentos.value?.length === 0) {
    isDisable.value = true;
    enteControl.value.departamentoAfectado = getLabel(enteControl.value.paisRemitente, paises.value);
    enteControl.value.municipioAfectado = getLabel(enteControl.value.paisRemitente, paises.value);
  }

});

watch(
  () => enteControl.value.departamentoAfectado,
  async (value) => {

    const municipioSeleccionado = municipios.value.length > 0 ? municipios.value.find(
      (m) => m.value === enteControl.value.municipioAfectado
    ) : null;

    if (!personData.value && municipioSeleccionado) {
      enteControl.value.municipioAfectado = '';
    }

    if (typeof value === 'string') {
      enteControl.value.municipioAfectado = value;
      return;
    }

    const { optionsMunicipalities } = await useMunicipalities(value);
    municipios.value = optionsMunicipalities.value;
    personData.value = false;
  }
);

const setDocumentTypeHandler = (value?: string) => {
  const ningunoID = 12;
  const nitID = 11;
  const tipoDocumentoAfectado = value || enteControl.value.tipoDocumentoAfectado

  clearValidations();

  if (tipoDocumentoAfectado === ningunoID) {
    isNroDocumentoDisabled.value = true;
    nroDocumentoRules.value = [];
    inserteNroDocumentoLabel.value = null;
    enteControl.value.numeroDocumentoAfectado = null;
  } else {
    isNroDocumentoDisabled.value = false;
    nroDocumentoRules.value = [
    Number(enteControl.value.tipoDocumentoAfectado) == 11 ? alphanumeric2 : (v: string) => onlyNumbers(v),
      (val) => maxLengthInput(15, val),
      isRequired,
    ];
    inserteNroDocumentoLabel.value = "Inserte";
  }

  if ( [8, 10, 11].includes(tipoDocumentoAfectado)) {
    isNitDisabled.value = true;
    isNitRules.value = [];
    nitLabel.value = null;
    enteControl.value.sexoAfectado = 1;
    enteControl.value.condicionEspecial = 1;
    enteControl.value.lgbti = false;
  } else {
    isNitDisabled.value = false;
    isNitRules.value = [selectRequiredTwo];
    nitLabel.value = "Seleccione";
  }
};

const setMedioHandler = (val:string) => {
  const emailID = 1;

  clearValidations();

  if (val == emailID) {
    emailRules.value = [
      validationEmail,
      (val) => maxLengthInput(200, val),
      isRequired,
    ];
    isEmailDisabled.value = true;
    isAddressDisabled.value = false;
  }
  else  {
    emailRules.value = [
      validationEmail,
      (val) => maxLengthInput(200, val),
    ];
    isEmailDisabled.value = false;
    isAddressDisabled.value = true;
  }
};

 const personData = ref(false);

const getAfectadoByNroDoc = () => {
  if (enteControl.value.numeroDocumentoAfectado) {
    sgdeaAxios.get(
      `/api/entes/obtenerAfectado`,
      { params: {
          nroDocumento: enteControl.value.numeroDocumentoAfectado,
          tipoDocumento: enteControl.value.tipoDocumentoAfectado
        }
      }
    ).then(async ({data})=> {
      enteControl.value = {
        ...enteControl.value,
        nombreAfectado: data.nombre,
        condicionEspecial: data.condicionEspecial?.id ?? null,
        paisAfectado: data.pais?.idPais ?? null,
        direccionAfectado: data.direccion ?? null,
        emailAfectado: data.email ?? null,
        telefonoCelularAfectado: ["null", null, "undefined", undefined].includes(data.telCelular) ? "" : data.telCelular,
        telefonoFijoAfectado: ["null", null, "undefined", undefined].includes(data.telFijo) ? "" : data.telFijo,
        lgbti: data.lgbti ?? null,
        sexoAfectado: data.genero?.id ?? null,
        medioRespuesta: data.medioRespuesta?.id,
      };

      if (data.departamento) {
        enteControl.value.departamentoAfectado = data.departamento.idDepartamento;
      }

      if (data.municipio) {
        enteControl.value.municipioAfectado = data.municipio.idMunicipio;
      }

      personData.value = true;

      setDocumentTypeHandler();

      setTimeout(()=> setMedioHandler(enteControl.value.medioRespuesta), 100);
    })
  }
};

const getLabel = (value, options) => {
  let option = options.find(option => option.value === value);
  if (!option && value && typeof value === 'string') {
    option = { label: value }
  }
  return option ? option.label : '';
}

defineExpose({ validateForm, clearForm, enteControl });
</script>
