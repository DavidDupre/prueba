<template>
  <div class="[&>*]:tw-mb-4">
    <q-form ref="datosSalidaRef" @validation-error="errorForm()" @submit.prevent="saveForm">
      <!-- Datos destinatario -->
      <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
        <q-expansion-item default-opened>
          <template v-slot:header>
            <div class="col row">
              <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
                Datos del Destinatario
              </h3>
            </div>
          </template>
          <div class="tw-bg-white tw-p-4" style="border-radius: 5px">
            <div class="row tw-p-2">
              <div class="col-sm tw-p-2">
                <p class="tw-text-label tw-font-semibold">Forma de Envío*</p>
                <q-select v-model="datoSalida.destinatario.forma_envio_id" :options="formaEnvioOptions"
                  label="Seleccione" map-options emit-value dense outlined
                  :rules="[val => val && !val?.forma_envio_id || 'Campo requerido']"
                  @update:model-value="changeFormaEnvio" :disable="isPorAprobarPorRevisar" />
              </div>

              <div class="col-sm tw-p-2">
                <p class="tw-text-label tw-font-semibold">Tipo de Documento del Destinatario*</p>
                <q-select v-model="datoSalida.destinatario.tipo_documento_id"
                  @update:model-value="setDocumentTypeHandler" :options="tipoDocumentoOpt" label="Seleccione"
                  map-options emit-value dense outlined
                  :rules="[val => val && !val?.tipo_documento_id || 'Campo requerido']"
                  :disable="isPorAprobarPorRevisar" />
              </div>

              <div class="col-sm tw-p-2">
                <p class="tw-text-label tw-font-semibold">Número de Documento del Destinatario</p>
                <q-input v-model="datoSalida.destinatario.numero_documento"
                  :disable="isNroDocumentoDisabled || isPorAprobarPorRevisar"
                  label="Ingrese el número de documento del destinatario" dense outlined
                  :rules="[(val) => maxLengthInput(15, val), alphanumericbyEntes]" />
              </div>
            </div>

            <div class="row tw-p-2">
              <div class="col-sm tw-p-2">
                <p class="tw-text-label tw-font-semibold">Nombre del Destinatario*</p>
                <q-input v-model="datoSalida.destinatario.nombre" label="Ingrese el nombre del destinatario" dense
                  outlined :rules="[
                    alphanumericbyEntes,
                    (val) => maxLengthInput(200, val),
                    isRequired,
                  ]" :disable="isPorAprobarPorRevisar" />
              </div>

              <div class="col-sm tw-p-2">
                <p class="tw-text-label tw-font-semibold">Dirección del Destinatario <span
                    v-if="isDireccionRequired">*</span></p>
                <q-input v-model="datoSalida.destinatario.direccion" label="Ingrese la dirección del destinatario" dense
                  outlined reactive-rules
                  :rules="[(v: string) => maxLengthInput(200, v), (val) => !isDireccionRequired || isRequired(val)]"
                  :disable="isPorAprobarPorRevisar" />
              </div>
            </div>

            <div class="row tw-p-2">
              <div class="col-sm tw-p-2">
                <p class="tw-text-label tw-font-semibold">Pais <span v-if="isDireccionRequired">*</span></p>
                <q-select v-model="datoSalida.destinatario.pais_id" :options="filteredPais" label="Seleccione"
                  map-options emit-value dense outlined
                  :rules="isDireccionRequired ? [val => val && !val?.pais_id || 'Campo requerido'] : []"
                  :disable="isPorAprobarPorRevisar" />
              </div>

              <div class="col-sm tw-p-2">
                <p class="tw-text-label tw-font-semibold">Departamento <span v-if="isDireccionRequired">*</span></p>
                <q-select v-model="datoSalida.destinatario.departamento_id" :options="filteredDep" label="Seleccione"
                  map-options emit-value dense outlined
                  :rules="isDireccionRequired ? [val => val && !val?.departamento_id || 'Campo requerido'] : []"
                  :disable="isPorAprobarPorRevisar" />
              </div>

              <div class="col-sm tw-p-2">
                <p class="tw-text-label tw-font-semibold">Municipio <span v-if="isDireccionRequired">*</span></p>
                <q-select v-model="datoSalida.destinatario.municipio_id" :options="filteredCity" label="Seleccione"
                  map-options emit-value dense outlined
                  :rules="isDireccionRequired ? [val => val && !val?.municipio_id || 'Campo requerido'] : []"
                  :disable="isPorAprobarPorRevisar" />
              </div>
            </div>

            <div class="row tw-p-2">
              <div class="col-sm tw-p-2">
                <p class="tw-text-label tw-font-semibold">Teléfono del Destinatario</p>
                <q-input v-model="datoSalida.destinatario.numero_celular" label="Ingrese el teléfono del destinatario"
                  @update:model-value="(val: string) => validateInputPhone(val, datosSalidaRef, 'telefonoFijoDestinatario')"
                  dense outlined name="telefonoFijoDestinatario" @keypress="onlyNumber"
                  :rules="[(val) => validarTelefonoRemitente(val)]" :disable="isPorAprobarPorRevisar" />
              </div>

              <div class="col-sm tw-p-2">
                <span class="tw-text-label tw-font-semibold">Correo Electrónico del Destinatario</span><span
                  class="tw-text-label tw-font-semibold" v-if="!isCorreoRequired">*</span>
                <q-input v-model="datoSalida.destinatario.correo" label="Ingrese el correo del destinatario" dense
                  outlined reactive-rules
                  :rules="[(val) => validationEmail(val), (val) => maxLengthInput(200, val), (val) => !isCorreoRequired || isRequired(val)]"
                  :disable="isPorAprobarPorRevisar" />
              </div>
            </div>

          </div>
        </q-expansion-item>
      </q-card>

      <!-- Datos de salida -->
      <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
        <q-expansion-item default-opened>
          <template v-slot:header>
            <div class="col row">
              <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
                Datos de Salida
              </h3>
            </div>
          </template>

          <div class="tw-bg-white tw-p-4" style="border-radius: 5px">
            <div class="row tw-p-2">
              <div class="col-sm tw-p-2">
                <p class="tw-text-label tw-font-semibold">Anexos (Cantidad de Folios)*</p>
                <q-input v-model="datoSalida.anexos" label="Ingrese la cantidad de folios" dense outlined
                  @keypress="onlyNumber"
                  :rules="[val => !!val || 'Campo requerido', val => /^[a-zA-Z0-9]+$/.test(val) || 'No se permiten caracteres especiales', val => val?.toString().length <= 5 || 'El número no debe ser mayor a 5 dígitos']"
                  :disable="isPorAprobarPorRevisar" />
              </div>
              <div class="col-sm tw-p-2">
                <p class="tw-text-label tw-font-semibold">Asunto*</p>
                <q-input v-model="datoSalida.asunto" label="Ingrese el asunto" dense outlined
                  :rules="[val => val && !val?.asunto || 'Campo requerido', val => val?.length <= 100 || 'El máximo de caracteres es de 100']"
                  :disable="isDireccionRequired || isPorAprobarPorRevisar" />
              </div>
            </div>
            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <span class="tw-text-label tw-font-semibold">Tipo de Documento del Afectado*</span>
                <q-select v-model="datoSalida.tipoDocumentoAfectado" :options="tipoDocumentoOpt"
                  name="tipoDocumentoAfectado" :rules="[selectRequired]" label="Seleccione" map-options emit-value
                  outlined dense :disable="isDireccionRequired || isPorAprobarPorRevisar" />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <span class="tw-text-label tw-font-semibold">
                  Número de Documento del Afectado*
                </span>
                <q-input v-model="datoSalida.numeroDocumentoAfectado"
                  label="Ingrese el numero de documento del Afectado" :rules="nroDocumentoRules"
                  name="numeroDocumentoAfectado" outlined dense :disable="isDireccionRequired || isPorAprobarPorRevisar"  />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <span class="tw-text-label tw-font-semibold">Nombre del Afectado*</span>
                <q-input :rules="[
                      alphanumericbyEntes,
                      (val) => maxLengthInput(200, val),
                      isRequired,
                    ]" v-model="datoSalida.nombreAfectado" name="nombreAfectado" label="Ingrese el nombre del Afectado"
                  outlined dense :disable="isDireccionRequired || isPorAprobarPorRevisar" />
              </div>
            </div>
            <div class="col-sm tw-p-2">
              <p class="tw-text-label tw-font-semibold">Cuerpo del Correo*</p>
              <q-input type="textarea" v-model="datoSalida.observacion" label="Ingrese el cuerpo del correo" dense
                outlined
                :rules="[val => val && !val?.observacion || 'Campo requerido', val => val?.length <= 3000 || 'El máximo de caracteres es de 3000']"
                :disable="isDireccionRequired || isPorAprobarPorRevisar" />
            </div>
          </div>
        </q-expansion-item>
      </q-card>

      <div class="justify-center tw-w-full tw-m-[10px] tw-mt-10 tw-mb-6 tw-flex tw-gap-4">
        <q-btn label="Cancelar" color="accent" textColor="black" class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-60"
          @click="emit('cancel')" v-if="!isPorAprobarPorRevisar" />
        <q-btn type="submit" label="Siguiente >" text-color="white" style="width: 240px; height: 40px" color="primary"
          class="tw-rounded-xl tw-btn tw-p-2" />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watchEffect } from 'vue'
import { sgdeaAxios,adminAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { useQuasar } from "quasar";
import { maxLengthInput, alphanumeric2, validationEmail,mobilePhoneNumberTenToTwelve, homePhoneNumberMinAndMaxLength, onlyNumber, alphanumericbyEntes } from "src/helpers/validations";
import { InfoGeneral } from '../../types';
import { validateInputPhone } from "src/pages/EntesDeControl/Bandeja/Detalles/utils";
import { useAuthStore } from "src/stores/auth.store";

const q = useQuasar();
const emit = defineEmits(['next-step', 'cancel']);
const props = defineProps<{datosSalida: any, informacionGeneral: InfoGeneral}>()
const auth = useAuthStore();
const isRequired = (val: string) => !!val || "El campo es obligatorio";
const nroDocumentoRules = ref([
  alphanumericbyEntes,
  (val) => maxLengthInput(15, val),
  isRequired,
]);
const selectRequired = (val: string) => (!!val) || "Debe seleccionar una opción";
const optionsDepartamentos = ref([])
const optionsMunicipios = ref([])
const formaEnvioOptions = ref([])
const tipoDocumentoOpt = ref([])
const filteredForma = ref([])
const optionsPaises = ref([])
const datosSalidaRef = ref(null);
const filteredCity = ref()
const filteredPais = ref()
const filteredDep = ref()
const isNroDocumentoDisabled = ref(false)
const isCertificado = ref();
const datoSalida = ref(null);
const isDireccionRequired = ref(false);
const isCorreoRequired = ref(true);
datoSalida.value = props.datosSalida;
const destinatarioNumeroDocumento = datoSalida.value.destinatario.numero_documento?.replace(/\./g, '')

const isPorAprobarPorRevisar = computed(() => ['por aprobar', 'por revisar', 'aprobado'].includes(props.informacionGeneral.estado.estado.toLowerCase()));

const validarTelefonoRemitente = (val) => {
  const regex = /^3\d*/
  return regex.test(val) ? mobilePhoneNumberTenToTwelve(val) : homePhoneNumberMinAndMaxLength(val)
}

const userCertificado = async () => {
  const response = await sgdeaAxios.get(`/usuarios/${auth.$state.userInfo.userid}`);
  isCertificado.value = response.data.isCertificado;
}

const getDatosOptions = async () => {
  try {
    const formaEnvioResponse = await sgdeaAxios.get('/api/entes/listadoFormaEnvio');
    formaEnvioOptions.value = formaEnvioResponse.data.map((item) => ({ label: item.nombre, value: item.id }));
    if (!isCertificado.value) {
      formaEnvioOptions.value = formaEnvioOptions.value.filter((e) => e.label !== 'Correo electrónico certificado');
    }
    formaEnvioOptions.value = formaEnvioOptions.value.filter((e) => e.value !== 6);
    filteredForma.value = formaEnvioOptions.value;

    const municipiosResponse = await adminAxios.get('/municipios/list');
    optionsMunicipios.value = municipiosResponse.data.map((item) => ({ label: item.nombre, value: item.idMunicipio }));
    filteredCity.value = optionsMunicipios.value;

    const paisesResponse = await adminAxios.get('/paises/list');
    optionsPaises.value = paisesResponse.data.map((item) => ({ label: item.nombre, value: item.idPais }));
    filteredPais.value = optionsPaises.value;

    const departamentosResponse = await adminAxios.get('/departamentos/list');
    optionsDepartamentos.value = departamentosResponse.data.map((item) => ({ label: item.nombre, value: item.idDepartamento }));
    filteredDep.value = optionsDepartamentos.value;

    const tipoDocumentoResponse = await sgdeaAxios.get('/api/entes/listadoTipoIdentificacion');
    tipoDocumentoOpt.value = tipoDocumentoResponse.data.map((value) => ({ label: value.nombre, value: value.id }));
    tipoDocumentoOpt.value = tipoDocumentoOpt.value.map(({ label, value }) => ({ label, value })).sort((a, b) => a.label.localeCompare(b.label))
  } catch (error) {
    console.error('Error fetching options:', error);
  }
};

const errorForm = () => {
  toast.error("Para continuar, asegrese de que todos los campos requeridos estén completos.")
}

async function saveForm() {
  if (await datosSalidaRef.value.validate()) setValues()
}

const setDocumentTypeHandler = (val) => {
  const ningunoID = 12;
  if(val === ningunoID) {
    isNroDocumentoDisabled.value = true
    datoSalida.value.destinatario.numero_documento = null
  } else {
    if(destinatarioNumeroDocumento){
      datoSalida.value.destinatario.numero_documento = destinatarioNumeroDocumento?.replace(/\./g, '');
    }
    isNroDocumentoDisabled.value = false
  }
}

const setValues = () => {
  datoSalida.value.destinatario.forma_envio_id = formaEnvioOptions.value.find(e => e.label === datoSalida.value.destinatario.forma_envio_id)?.value || formaEnvioOptions.value.find(e => e.value === datoSalida.value.destinatario.forma_envio_id)?.value

  datoSalida.value.destinatario.tipo_documento_id = tipoDocumentoOpt.value.find(e => e.label == datoSalida.value.destinatario.tipo_documento_id)?.value || tipoDocumentoOpt.value.find(e => e.value === datoSalida.value.destinatario.tipo_documento_id)?.value
  datoSalida.value.destinatario.tipo_documento_nombre = tipoDocumentoOpt.value.find(e => e.value === datoSalida.value.destinatario.tipo_documento_id)?.label || tipoDocumentoOpt.value.find(e => e.value === datoSalida.value.destinatario.tipo_documento_id)?.label

  datoSalida.value.destinatario.pais_id = optionsPaises.value.find(e => e.label === datoSalida.value.destinatario.pais_id)?.value || optionsPaises.value.find(e => e.value === datoSalida.value.destinatario.pais_id)?.value
  datoSalida.value.destinatario.pais_nombre = optionsPaises.value.find(e => e.value === datoSalida.value.destinatario.pais_id)?.label || optionsPaises.value.find(e => e.value === datoSalida.value.destinatario.pais_id)?.label

  datoSalida.value.destinatario.departamento_id = optionsDepartamentos.value.find(e => e.label === datoSalida.value.destinatario.departamento_id)?.value || optionsDepartamentos.value.find(e => e.value === datoSalida.value.destinatario.departamento_id)?.value
  datoSalida.value.destinatario.departamento_nombre = optionsDepartamentos.value.find(e => e.value === datoSalida.value.destinatario.departamento_id)?.label || optionsDepartamentos.value.find(e => e.value === datoSalida.value.destinatario.departamento_id)?.label

  datoSalida.value.destinatario.municipio_id = optionsMunicipios.value.find(e => e.label === datoSalida.value.destinatario.municipio_id)?.value || optionsMunicipios.value.find(e => e.value === datoSalida.value.destinatario.municipio_id)?.value
  datoSalida.value.destinatario.municipio_nombre = optionsMunicipios.value.find(e => e.value === datoSalida.value.destinatario.municipio_id)?.label || optionsMunicipios.value.find(e => e.value === datoSalida.value.destinatario.municipio_id)?.label

  const tipoDocumentoAfectado = tipoDocumentoOpt.value.find(e => e.label ==  datoSalida.value.tipoDocumentoAfectado) || tipoDocumentoOpt.value.find(e => e.value ===  datoSalida.value.tipoDocumentoAfectado)
  datoSalida.value.tipoDocumentoAfectado = tipoDocumentoAfectado.value
  emit('next-step');
}

const changeFormaEnvio = (e) => {
  if( e == 4){
    isDireccionRequired.value = true
    isCorreoRequired.value = true
    datoSalida.value.observacion = ''
    datoSalida.value.asunto = ''
    return
  } else {
    isCorreoRequired.value = false
  }

  isCorreoRequired.value = false
  isDireccionRequired.value = false
}

watchEffect(()=> {
  if (props.datosSalida.destinatario){
    changeFormaEnvio(props.datosSalida?.destinatario.forma_envio_id);
    setDocumentTypeHandler(props.datosSalida?.destinatario.tipo_documento_id)
  }
});

onMounted(async () => {
  await userCertificado();
  await getDatosOptions();
});
</script>
