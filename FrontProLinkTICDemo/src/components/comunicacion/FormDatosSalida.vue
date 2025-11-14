<template>
  <div class="row q-col-gutter-md q-pb-md q-px-md" v-if="props.tipoComunicacion !== 1">
    <div class="col-12">
      <span class="tw-w-full">
        <label class="tw-text-label">Forma de envío *</label>
        <q-select map-options emit-value dense outlined class="tw-rounded-lg" v-model="formExitData.datosSalidaFormaEnvioId"
          :options="shippingMethodsOptions" label="Seleccione" :disable="onlyRead" :readonly="onlyRead"
          :rules="[inputRequired]" />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Tipo de documento destinatario *</label>
        <q-select map-options emit-value dense outlined class="tw-rounded-lg" v-model="formExitData.datosSalidaTipoDocumentoDestinatarioId"
          :options="tipoDocumentoOptions" label="Seleccione" :rules="[inputRequired]" :disable="onlyRead" :readonly="onlyRead"
        />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span v-if="disableOptions" class="tw-w-full">
        <label  class="tw-text-label">Documento del destinatario {{ !isNinguno ? '*' : '' }}</label>
        <q-input v-model="formExitData.datosSalidaNumeroDocumentoDestinatario" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="!isNinguno ? [inputRequired, Number(formExitData.datosSalidaTipoDocumentoDestinatarioId) == 11 ? alphanumeric2 : (v: string) => onlyNumbers(v), val => maxLengthInput(80, val)] : [Number(formExitData.datosSalidaTipoDocumentoDestinatarioId) == 11 ? alphanumeric2 : (v: string) => onlyNumbers(v), val => maxLengthInput(15, val)]"
          :disable="(onlyRead || isDisabled)" :readonly="onlyRead" @blur="getPerson" />
      </span>

      <span v-else class="tw-w-full">
          <label class="tw-text-label"> {{disableOptions ? 'Documento del destinatario *':'Número de documento *'}}</label>
        <q-input v-model="formExitData.datosSalidaNumeroDocumentoDestinatario" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="disableOptions ? [alphanumeric2, val => maxLengthInput(80, val)]:[inputRequired,alphanumeric2, val => maxLengthInput(15, val)]" :disable="(onlyRead || isDisabled)" :readonly="onlyRead" @blur="getPerson" />
      </span>

    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Nombre del destinatario *</label>
        <q-input v-model="formExitData.datosSalidaNombreDestinatario" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="[inputRequired, alphanumeric2, val => maxLengthInput(300, val)]" :disable="onlyRead" :readonly="onlyRead" />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">{{isRequired ? 'Dirección del destinatario *' :'Dirección del destinatario'}}   </label>
        <q-input  v-model="formExitData.datosSalidaDireccion" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="isRequired?[inputRequired, val => maxLengthInput(100, val)] :[ val => maxLengthInput(100, val)]" :disable="onlyRead" :readonly="onlyRead" />
      </span>
    </div>

    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
      <label class="tw-w-full">
          <span class="tw-text-label">País destinatario *</span>
          <q-select  v-model="formExitData.datosSalidaPaisId" :options="optionsCountries" label="Seleccione" dense
              outlined map-options emit-value class="tw-rounded-lg" :rules="[inputRequired]" :disable="onlyRead" :readonly="onlyRead" >
          </q-select>
      </label>
    </div>

    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
      <label class="tw-w-full">
          <span class="tw-text-label">{{isRequired ? 'Departamento destinatario *' :'Departamento destinatario'}}</span>
          <q-select v-model="formExitData.datosSalidaDeptoId" label="Seleccione" dense outlined map-options emit-value clearable
              class="tw-rounded-lg" :options="departamentos" :rules="[isRequired ? inputRequired : null]" >
          </q-select>
      </label>
    </div>

    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
        <label class="tw-w-full">
            <span class="tw-text-label">{{isRequired ? 'Municipio destinatario *' :'Municipio destinatario'}}</span>
            <q-select v-model="formExitData.datosSalidaMunicipioId" label="Seleccione" dense outlined map-options emit-value clearable
                class="tw-rounded-lg" :options="municipioOptions" :rules="[isRequired ? inputRequired : null]" >
            </q-select>
        </label>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Teléfono destinatario </label>
        <q-input v-model="formExitData.datosSalidaTelefono" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="[phoneFormat]" :disable="onlyRead" :readonly="onlyRead" />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Correo electrónico destinatario {{isRequiredEmail ? '*' :''}}</label>
        <q-input v-model="formExitData.datosSalidaCorreo" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="isRequiredEmail?[inputRequired, validationEmail, val => maxLengthInput(200, val)]:[validationEmail,val => maxLengthInput(200, val)]" :disable="onlyRead" :readonly="onlyRead" />
      </span>
    </div>

    <div v-if="disableOptions" class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Anexos (Cantidad de folios) *</label>
        <q-input v-model.number="formExitData.datosSalidaAnexos" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="[inputRequired,alphanumeric2,onlyNumbers, val => maxLengthInput(5, val)]" :disable="onlyRead" :readonly="onlyRead" />
      </span>
    </div>

    <div v-if="props.tipoComunicacion === 1" class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Oficina destino *</label>
        <q-select map-options emit-value dense outlined class="tw-rounded-lg" v-model="formExitData.datosSalidaTipoOficionaDestinatarioId"
          :options="oficcinaOptions" label="Seleccione" :rules="[inputRequired]" :disable="onlyRead" :readonly="onlyRead"
        />
      </span>
    </div>

          <div v-if="props.tipoComunicacion === 1" class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <span class="tw-w-full">
              <label class="tw-text-label">Cargo del funcionario *</label>
              <q-input
                v-model="formExitData.datosSalidaCargoDelfuncionario"
                dense
                outlined
                label="Inserte"
                class="tw-rounded-lg"
                :rules="[inputRequired]"
              />
            </span>
          </div>

    <div v-if="disableOptions" class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Asunto *</label>
        <q-input v-model="formExitData.asunto" dense outlined label="Inserte" class="tw-rounded-lg"
        autogrow :rules="[inputRequired, val => maxLengthInput(100, val)]" :disable="onlyRead" :readonly="onlyRead" />
      </span>
    </div>
    <div v-if="disableOptions" class="col-12">
      <span class="tw-w-full">
        <label class="tw-text-label">Observación *</label>
        <q-input v-model.trim="formExitData.observacion" dense outlined label="Inserte" class="tw-rounded-lg"
        autogrow :rules="[inputRequired, val => maxLengthInput(1000, val)]" :disable="onlyRead" :readonly="onlyRead" />
      </span>
    </div>

    <!-- <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Tipo de documento del afectado *</label>
        <q-select v-model="formExitData.datosSalidaTipoDocumentoAfectadoId" label="Seleccione" map-options emit-value dense outlined
          :options="tipoDocumentAfectadoOptions" class="tw-rounded-lg" :rules="[inputRequired]">
        </q-select>
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Numero de documento del afectado *</label>
        <q-input  v-model.number="formExitData.datosSalidaNumeroDocumentoAfectado" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="[inputRequired, val => maxLengthInput(15, val), alphanumeric2]" />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Nombre del afectado *</label>
        <q-input v-model="formExitData.datosSalidaNombreAfectado" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="[inputRequired, alphanumeric2, val => maxLengthInput(80, val)]" />
      </span>
    </div> -->
  </div>
  <div class="row q-col-gutter-md q-pb-md q-px-md" v-else>
    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Forma de envío *</label>
        <q-select map-options emit-value dense outlined class="tw-rounded-lg" v-model="formExitData.datosSalidaFormaEnvioId"
          :options="shippingMethodsOptions" label="Seleccione" :disable="onlyRead" :readonly="onlyRead"
          :rules="[inputRequired]" />
      </span>
    </div>

    <div v-if="props.tipoComunicacion === 1" class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Oficina destino *</label>
        <q-select map-options emit-value dense outlined class="tw-rounded-lg" v-model="formExitData.datosSalidaTipoOficionaDestinatarioId"
          :options="oficcinaOptions" label="Seleccione" :rules="[inputRequired]" :disable="onlyRead" :readonly="onlyRead"
        />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Nombre del destinatario *</label>
        <q-select v-model="formExitData.datosSalidaNombreDestinatario" emit-value map-options outlined dense use-input hide-selected class="tw-rounded-lg"
            fill-input label="Seleccione" :options="opUsuarios" @filter="filterOficina"
            :rules="[inputRequired]">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        <!-- <q-input v-model="formExitData.nameDestinatary" dense outlined label="Inserte" class="tw-rounded-lg" :rules="[inputRequired, alphanumeric, v => maxLengthInput(80, v)]" @keypress="onlyAlphaNumeric"/> -->
      </span>
    </div>

    <div v-if="props.tipoComunicacion === 1" class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Cargo del funcionario *</label>
          <q-input
            v-model="formExitData.datosSalidaCargoDelfuncionario"
            dense
            outlined
            label="Inserte"
            class="tw-rounded-lg"
            :rules="[inputRequired]"
          />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">{{isRequired ? 'Dirección del destinatario *' :'Dirección del destinatario'}}   </label>
        <q-input  v-model="formExitData.datosSalidaDireccion" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="isRequired?[inputRequired, val => maxLengthInput(100, val)] :[ val => maxLengthInput(100, val)]" :disable="onlyRead" :readonly="onlyRead" />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Teléfono destinatario </label>
        <q-input v-model="formExitData.datosSalidaTelefono" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="[phoneFormat]" :disable="onlyRead" :readonly="onlyRead" />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Correo electrónico destinatario {{isRequiredEmail ? '*' :''}}</label>
        <q-input v-model="formExitData.datosSalidaCorreo" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="isRequiredEmail?[inputRequired, validationEmail, val => maxLengthInput(200, val)]:[validationEmail,val => maxLengthInput(200, val)]" :disable="onlyRead" :readonly="onlyRead" />
      </span>
    </div>

    <div v-if="disableOptions" class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Anexos (Cantidad de folios) *</label>
        <q-input v-model.number="formExitData.datosSalidaAnexos" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="[inputRequired,alphanumeric2,onlyNumbers, val => maxLengthInput(5, val)]" :disable="onlyRead" :readonly="onlyRead" />
      </span>
    </div>

    <div v-if="disableOptions" class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Asunto *</label>
        <q-input v-model="formExitData.asunto" dense outlined label="Inserte" class="tw-rounded-lg"
        autogrow :rules="[inputRequired, val => maxLengthInput(100, val)]" :disable="onlyRead" :readonly="onlyRead" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import {sgdeaAxios} from "src/services";
import {
  useCrearComunicacionesLogic
} from "src/pages/Correspondencia/Crear/CrearComunicaciones/CrearComunicaciones.Logic";
import {
  alphanumeric2,
  inputRequired,
  maxLengthInput,
  onlyNumbers,
  phoneFormat,
  validationEmail
} from "src/helpers/validations";
import {useCountries, useDepartments, useMunicipalities} from "src/composables/useVersion";
import {withDefaults} from "src/helpers/withDefaults";
import {useAuthStore} from "src/stores/auth.store";
import { getAcronimobyId } from 'src/helpers/prefijoTipoDoc';

const props = withDefaults(defineProps<{
    dataInitial: object,
    onlyRead: boolean,
    disableOptions: boolean,
    tipoComunicacion: number
  }>(), {
    onlyRead: false,
    disableOptions: true
  });

  const auth = useAuthStore();

const departamentos = ref([]);
const isDisable = ref(false)
  const { optionsCountries } = useCountries()
  const isCertificado = ref();
  const formExitData=ref(props.dataInitial)
  const shippingMethodsOptions = ref([]);
  const tipoDocumentoOptions=ref([]);
  const oficcinaOptions=ref([]);
  // const tipoDocumentAfectadoOptions=ref([]);
  const isDisabled = ref(false);
  const isRequired = ref(false);
  const isRequiredEmail = ref(false);
  const departmentsOptions = ref([]);
  const municipioOptions = ref([]);
  const opsOffices = ref([]);
  const officesAll = ref([]);
  const isDisableCountry=ref(false)
  const isNinguno = computed(() => formExitData.value.datosSalidaTipoDocumentoDestinatarioId === 12)
  const opUsuarios = ref([]);
  const allUsers = ref([]);


  const filterOficina = (val, update) => {
    if (val === '') {
      update(() => {
        opsOffices.value = officesAll.value;
      });
      return;
    }
    update(() => {
      opsOffices.value = officesAll.value.filter((option) => {
        return option.label.toLowerCase().includes(val.toLowerCase());
      });
    });
  };

  onMounted(async () => {
    await getAllUsers();
    await userCertificado();
    const { getShippingWayOptions, getTipoDocumentoOptions } = useCrearComunicacionesLogic();

    if (formExitData.value.datosSalidaTipoOficionaDestinatarioId) {
      opUsuarios.value = await getUserByOffice(formExitData.value.datosSalidaTipoOficionaDestinatarioId);
    }

    const shipping = await getShippingWayOptions();

    const isPaisColombia = typeof formExitData.value.datosSalidaPaisId === 'number'
      ? formExitData.value.datosSalidaPaisId !== 425
      : formExitData.value.datosSalidaPaisId.value !== 425;

    isDisableCountry.value = isPaisColombia;

    shippingMethodsOptions.value = shipping.filter(shipping => (!['Personal', 'Mensajería'].includes(shipping.label)));

    if (!isCertificado.value || props.tipoComunicacion === 1) {
      shippingMethodsOptions.value = shippingMethodsOptions.value.filter(shipping => shipping.label !== 'Correo electrónico certificado');
    }
    const tipoDocuments = await getTipoDocumentoOptions();

    tipoDocumentoOptions.value = [...tipoDocuments];

    const dataOfi = (await sgdeaAxios.get("/oficinas/oficinasSeries"));
    oficcinaOptions.value = dataOfi.data
      ?.filter((item: any) => item.origen === 'oficina')
      .map((item: any) => ({
      label: item.nombre,
      value: item.id_original,
      }));

    // oficcinaOptions.value = [...allOficina]
    // tipoDocumentAfectadoOptions.value = [...tipoDocuments.filter(tipo => tipo.label !== 'Ninguno')];

    const { optionsDepartments } = await useDepartments(formExitData.value.datosSalidaPaisId.value || formExitData.value.datosSalidaPaisId);
    departamentos.value = optionsDepartments.value;

    if (formExitData.value.datosSalidaDeptoId && typeof formExitData.value.datosSalidaDeptoId === 'number') {
      const { optionsMunicipalities } = await useMunicipalities(formExitData.value.datosSalidaDeptoId);
      municipioOptions.value = optionsMunicipalities.value;
    }

    const initial = props.dataInitial;
    const hasData = Object.keys(initial).some(key => {
      if (key === 'datosSalidaPaisId' || key === 'asuntoCorreo') return false;
      if (initial[key] === null || initial[key] === undefined) return false;
      if (typeof initial[key] === 'object' && Object.keys(initial[key] || {}).length === 0) return false;
      if (typeof initial[key] === 'string' && initial[key].trim() === '') return false;
      return true;
    });
    if (hasData) {
      cargarData();
    }
  });

  const cargarData = () => {
    formExitData.value.datosSalidaFormaEnvioId = props.dataInitial.datosSalidaFormaEnvioId || null;
    formExitData.value.datosSalidaTipoDocumentoDestinatarioId = props.dataInitial.datosSalidaTipoDocumentoDestinatarioId?.id || props.dataInitial.datosSalidaTipoDocumentoDestinatarioId || null;
    formExitData.value.datosSalidaTipoOficionaDestinatarioId = props.dataInitial.datosSalidaTipoOficionaDestinatarioId || null;
    formExitData.value.datosSalidaNumeroDocumentoDestinatario = props.dataInitial.datosSalidaNumeroDocumentoDestinatario || null;
    formExitData.value.datosSalidaNombreDestinatario = props.dataInitial.datosSalidaNombreDestinatario || null;
    formExitData.value.datosSalidaDireccion = props.dataInitial.datosSalidaDireccion || null;
    formExitData.value.datosSalidaPaisId = { value: props.dataInitial.datosSalidaPaisId.value || 425, label: props.dataInitial.datosSalidaPaisId.label || "Colombia" };
    formExitData.value.datosSalidaDeptoId = props.dataInitial.datosSalidaDeptoId?.idDepartamento || props.dataInitial.datosSalidaDeptoId || null;
    formExitData.value.datosSalidaMunicipioId = props.dataInitial.datosSalidaMunicipioId?.idMunicipio || null;
    formExitData.value.datosSalidaCorreo = props.dataInitial.datosSalidaCorreo || null;
    formExitData.value.datosSalidaTelefono = props.dataInitial.datosSalidaTelefono || null;
    formExitData.value.datosSalidaCargoDelfuncionario = props.dataInitial.datosSalidaCargoDelfuncionario || null;
    formExitData.value.asunto = props.dataInitial.asunto || null;
    formExitData.value.datosSalidaAnexos = props.dataInitial.datosSalidaAnexos || null;
    formExitData.value.observacion = props.dataInitial.observacion || null;
    formExitData.value.datosSalidaTipoDocumentoAfectadoId = props.dataInitial.datosSalidaTipoDocumentoAfectadoId || null;
    formExitData.value.datosSalidaNumeroDocumentoAfectado = props.dataInitial.datosSalidaNumeroDocumentoAfectado || null;
    formExitData.value.datosSalidaNombreAfectado = props.dataInitial.datosSalidaNombreAfectado || null;
    formExitData.value.asuntoCorreo = props.dataInitial.asuntoCorreo || null;
    formExitData.value.contenidoCorreo = props.dataInitial.contenidoCorreo || null;
    formExitData.value.copyType = props.dataInitial.copyType || null;
  }

  const getUserByOffice = async (selectedOfficeId, origen?) => {
    try {
      return allUsers.value
        .filter(userInfo => {
          if (!origen || origen === 'oficina') {
            return userInfo.usuarioRelaciones && userInfo.usuarioRelaciones.some(relacion => relacion.oficina && relacion.oficina.id === selectedOfficeId);
          } else if (origen === 'dependencia') {
            return userInfo.usuarioRelaciones && userInfo.usuarioRelaciones.some(relacion => relacion.oficina && relacion.oficina.dependencia && relacion.oficina.dependencia.idSeccionSubSeccion === selectedOfficeId);
          }
          return false;
        })
        .map(user => ({
          value: user.id,
          label: `${user.firstname} ${user.lastname}`,
          cargo: user.cargo,
          direccion: user?.direccion,
          telefono: user?.celular,
          email: user.email,
          oficina: user.usuarioRelaciones[0]?.oficina?.nombre || null,
          municipio: user.municipio,
          departamento: user.departamento
        }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const getAllUsers = async () => {
    try {
      const { data } = await sgdeaAxios.get('/usuarios/all');
      allUsers.value = data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const cleaExitDataForm = (isOfficeChanged: boolean) => {
    if (isOfficeChanged) {
      formExitData.value.datosSalidaNombreDestinatario = "";
    }
    formExitData.value.datosSalidaCargoDelfuncionario = "";
    formExitData.value.datosSalidaDireccion = "";
    formExitData.value.datosSalidaTelefono = "";
    formExitData.value.datosSalidaCorreo = "";
  }

  watch(
    () => formExitData.value.datosSalidaTipoOficionaDestinatarioId,
    async (newOfficeId) => {
      if (newOfficeId || newOfficeId === 0) {
        // Limpiar campos específicos del formulario
        formExitData.value.datosSalidaNombreDestinatario = "";
        formExitData.value.datosSalidaCargoDelfuncionario = "";
        formExitData.value.datosSalidaDireccion = "";
        formExitData.value.datosSalidaTelefono = "";
        formExitData.value.datosSalidaCorreo = "";

        const origen = oficcinaOptions.value.find(oficina => oficina.value === newOfficeId)?.dependencia;

        if (newOfficeId == 0) {
          opUsuarios.value = allUsers.value.map(user => ({
          value: user.id,
          label: `${user.firstname} ${user.lastname}`,
          cargo: user.cargo,
          direccion: user?.direccion,
          telefono: user?.celular,
          email: user.email,
          oficina: user.usuarioRelaciones[0]?.oficina?.nombre || null,
          municipio: user.municipio,
          departamento: user.departamento
        }));
        } else {
          opUsuarios.value = await getUserByOffice(newOfficeId, origen);
        }
      }
    },
  );

  // watch(()=>formExitData.value.datosSalidaPaisId,(value)=>{
  //   isDisableCountry.value = false;
  //   formExitData.value.datosSalidaDeptoId =''
  //   if(value !== 425){
  //     formExitData.value.datosSalidaDeptoId = getLabel(value, optionsCountries.value);
  //     isDisableCountry.value = true;
  //   }
  // })


  watch(
    () => formExitData.value.datosSalidaTipoDocumentoDestinatarioId,
    async (value) => {
      if(value === 12){
        formExitData.value.datosSalidaNumeroDocumentoDestinatario = '';
        isDisabled.value = true;
        return
      }
      isDisabled.value = false;
    }
  );

  watch(
    () => formExitData.value.datosSalidaFormaEnvioId,
    async (value) => {
      isRequired.value = false;
      isRequiredEmail.value = false;

      if(value === 3 || value === 6){
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
    () => formExitData.value.datosSalidaDeptoId,
    async(value) => {

      if(typeof value === 'string' ){
        const municipalityLabel=formExitData.value.datosSalidaDeptoId
        formExitData.value.datosSalidaMunicipioId =municipalityLabel;
        return
      }

      if (formExitData.value.datosSalidaPaisId.value !== 425 && formExitData.value.datosSalidaPaisId !== 425) {
        formExitData.value.datosSalidaMunicipioId = getLabel(value.value || value, departamentos.value);
        return;
      }


      // formExitData.value.datosSalidaMunicipioId = '';
      if (!value) return;
      const inputValue = typeof value === 'object' && 'value' in value ? value.value : value;
      const { optionsMunicipalities } = await useMunicipalities(inputValue);
      municipioOptions.value = optionsMunicipalities.value;
    }
  );

  watch(
    () => formExitData.value.datosSalidaNombreDestinatario,
    async (newUserId) => {
      if (newUserId) {
        const users = opUsuarios.value;
        const selectedUser = users.find(user => user.value === newUserId);

        if (selectedUser) {
          formExitData.value.datosSalidaNombreDestinatario = selectedUser.label || ''
          formExitData.value.datosSalidaCargoDelfuncionario = selectedUser.cargo.nombre || '';
          formExitData.value.datosSalidaCorreo = selectedUser.email || ''
          formExitData.value.datosSalidaDireccion = selectedUser.direccion || '';
          formExitData.value.datosSalidaTelefono = selectedUser.telefono || '';
          // formExitData.value.datosSalidaDireccion= selectedUser.oficina || ''
          // formExitData.value.municipalityRecipientCopyInterna = selectedUser.municipio.nombre  || ''
          // formExitData.value.departmentRecipientCopyInterna = selectedUser.departamento.idDepartamento
        }
      }
    },
  );

  const userCertificado = async () => {
  const response = await sgdeaAxios.get(`/usuarios/${auth.$state.userInfo.userid}`);
  isCertificado.value = response.data.isCertificado;
}

  const getLabel=(value, options)=> {
    let option = options.find(option => option.value === value);
    if(!option && value && typeof value === 'string'){
      option={label:value}
    }
    return option ? option.label : '';
  }


watch(() => formExitData.value.datosSalidaPaisId, async (value) => {
  isDisable.value = false;
  // formExitData.value.datosSalidaDeptoId = '';
  // formExitData.value.datosSalidaMunicipioId = '';

  const depa = await getDepartamentos(value.value || value);
  departamentos.value = depa.value;

  if (departamentos.value.length === 0) {
    isDisable.value = true;
    formExitData.value.datosSalidaDeptoId = getLabel(formExitData.value.datosSalidaPaisId, optionsCountries.value);
    formExitData.value.datosSalidaMunicipioId = getLabel(formExitData.value.datosSalidaPaisId, optionsCountries.value);
  }

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

async function getPerson() {
  const tipoDoc = getAcronimobyId(Number(formExitData.value.datosSalidaTipoDocumentoDestinatarioId))
  const number = formExitData.value.datosSalidaNumeroDocumentoDestinatario ? Number(formExitData.value.datosSalidaNumeroDocumentoDestinatario) : ''
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
      formExitData.value.datosSalidaPaisId = { label: response.data.pais.nombre, value: response.data.pais.idPais }
      setTimeout(() => {
        formExitData.value.datosSalidaDeptoId = response.data.departamento.idDepartamento
      });
      setTimeout(() => {
        formExitData.value.datosSalidaMunicipioId = { label: response.data.municipio.nombre, value: response.data.municipio.idMunicipio }
      });
    }
  } catch (error) {
    limpiarFormulario()
    console.error(error)
  }
}

const limpiarFormulario = () => {
  formExitData.value.datosSalidaNombreDestinatario = '';
  formExitData.value.datosSalidaCorreo = '';
  formExitData.value.datosSalidaDireccion = '';
  formExitData.value.datosSalidaTelefono = '';
  formExitData.value.datosSalidaDeptoId = '';
  formExitData.value.datosSalidaMunicipioId = '';
};

</script>
