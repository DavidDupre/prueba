<template>
  <div class="row q-col-gutter-md q-pb-md q-px-md">
    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Forma de envío *</label>
        <q-select map-options emit-value dense outlined class="tw-rounded-lg" v-model="formExitData.shippingMethodCopyInterna"
          :options="shippingMethodsOptions" label="Seleccione" :rules="[inputRequired]"
        />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Oficina destino *</label>
        <q-select v-model="formExitData.officeType" emit-value map-options outlined dense use-input hide-selected class="tw-rounded-lg"
            fill-input label="Seleccione" :options="opsOffices" @filter="filterOficina"
            :rules="[inputRequired]">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Nombre del destinatario *</label>
        <q-select v-model="formExitData.nameDestinatary" emit-value map-options outlined dense use-input hide-selected class="tw-rounded-lg"
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

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Cargo del funcionario *</label>
        <q-input v-model="formExitData.cargo.nombre" type="text" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="[inputRequired, val => maxLengthInput(50, val)]"
        />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">{{isRequired ? 'Dirección del destinatario *' :'Dirección del destinatario'}} ({{ formExitData.addressRecipientCopyInterna.length }}/1000) </label>
        <q-input autogrow v-model.number="formExitData.addressRecipientCopyInterna" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="isRequired ? [inputRequired, val => maxLengthInput(1000, val)]:[ val => maxLengthInput(1000, val)]" />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <label class="tw-w-full">
          <span class="tw-text-label">{{ isRequired ? 'País destinatario *' : 'País destinatario' }}</span>
          <q-select v-model="formExitData.countryRecipientCopyInterna" emit-value map-options outlined dense use-input hide-selected class="tw-rounded-lg"
            fill-input label="Seleccione" :options="opsContry" @filter="filterCountry"
            :rules="[inputRequired]">
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
           <q-select v-model="namecopyInterna"  option-label="label" emit-value map-options outlined dense use-input hide-selected class="tw-rounded-lg"
            fill-input label="Seleccione" :options="departmentsOptions" @filter="selectOptionsFilterFnDepartment" :disable="isDisable" clearable
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
          <q-select v-model="formExitData.municipalityRecipientCopyInterna" emit-value map-options outlined dense use-input hide-selected class="tw-rounded-lg"
            fill-input label="Seleccione" :options="municipioOptions" @filter="selectOptionsFilterFnMunicipality" :disable="isDisable" clearable
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
        <label class="tw-text-label">Teléfono destinatario</label>
        <q-input v-model="formExitData.telephoneRecipientCopyInterna" dense outlined label="Inserte" class="tw-rounded-lg"
          :rules="[ phoneFormat]" />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Correo destinatario {{ isRequiredEmail ? '*' : '' }} ({{ formExitData.emailRecipientCopyInterna.length }}/50)</label>
        <q-input v-model="formExitData.emailRecipientCopyInterna" dense outlined label="Inserte" class="tw-rounded-lg"
        :rules="isRequiredEmail?[inputRequired, validationEmail, val => maxLengthInput(50, val)]:[validationEmail,val => maxLengthInput(50, val)]" />
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch } from "vue";
  import {
    inputRequired,
    maxLengthInput,
    validationEmail,
    phoneFormat
  } from "src/helpers/validations";
  import { useCountries, useDepartments, useMunicipalities } from "src/composables/useVersion";
  import { useCrearComunicacionesLogic } from "src/pages/Correspondencia/Crear/CrearComunicaciones/CrearComunicaciones.Logic";
  import { sgdeaAxios } from '../../../services/index';

  const props = defineProps({
    dataInitial: Object,
  });

  const { optionsCountries } = useCountries();
  const departmentsOptions = ref([]);
  const departmentsOptionsStatic = ref([]);
  const municipioOptions = ref([]);
  const municipioOptionsStatic = ref([]);
  const shippingMethodsOptions = ref([]);
  const formExitData = ref(props.dataInitial);
  const isRequired = ref(false);
  const isRequiredEmail = ref(false);
  const officesAll = ref([]);
  const opsOffices = ref([]);
  const opUsuarios = ref([]);
  const isDisable = ref(false);
  const opsContry = ref([]);

  onMounted(async () => {
    const { getShippingWayOptions } = useCrearComunicacionesLogic();
    const promises = [getShippingWayOptions(), getOffices()];
    const [shippingMethodsResponse, officesAllResponse] = await Promise.allSettled(promises);

    shippingMethodsOptions.value = shippingMethodsResponse?.value.filter(method => method.label !== 'Mensajero' && method.label !== 'Correo electrónico certificado');
    officesAll.value = officesAllResponse?.value.sort((a, b) => a.label.localeCompare(b.label));

    const { optionsDepartments } = await useDepartments(props.dataInitial.countryRecipientCopyInterna.value);
    departmentsOptionsStatic.value = optionsDepartments.value.sort((a, b) => a.label.localeCompare(b.label));
    opUsuarios.value = await getUserByOffice();

  });

  watch(
    () => formExitData.value.departmentRecipientCopyInterna,
    async (value) => {
      formExitData.value.municipalityRecipientCopyInterna = '';
      const { optionsMunicipalities } = await useMunicipalities(value);
      municipioOptionsStatic.value = optionsMunicipalities.value.sort((a, b) => a.label.localeCompare(b.label));
    }

  );

  const namecopyInterna = ref();

  watch(
    () => formExitData.value.nameDestinatary,
    async (newUserId) => {

      if (newUserId) {
        const users = opUsuarios.value;
        const selectedUser = users.find(user => user.value === newUserId);
        namecopyInterna.value = selectedUser.departamento.nombre
        if (selectedUser) {
          formExitData.value.cargo = selectedUser.cargo || '';
          formExitData.value.emailRecipientCopyInterna = selectedUser.email || ''
          formExitData.value.addressRecipientCopyInterna= selectedUser.oficina || ''
          formExitData.value.municipalityRecipientCopyInterna = selectedUser.municipio.nombre  || ''
          formExitData.value.departmentRecipientCopyInterna = selectedUser.departamento.idDepartamento
      }
    }
  }
  );

  const filterCountry = (val, update) => {
    if (val === '') {
      update(() => {
        opsContry.value = optionsCountries.value;
      });
      return;
    }

    update(() => {
      const needle = val.toLowerCase();
      opsContry.value = optionsCountries.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });
  };

  const selectOptionsFilterFnDepartment = (val, update) => {
    if (val === '') {
      update(() => {
        departmentsOptions.value = departmentsOptionsStatic.value;
      });
      return;
    }
    update(() => {
      departmentsOptions.value = departmentsOptionsStatic.value.filter((option) => {
        return option.label.toLowerCase().includes(val.toLowerCase());
      });
    });
  };

  const selectOptionsFilterFnMunicipality = (val, update) => {
    if (val === '') {
      update(() => {
        municipioOptions.value = municipioOptionsStatic.value;
      });
      return;
    }
    update(() => {
      municipioOptions.value = municipioOptionsStatic.value.filter((option) => {
        return option.label.toLowerCase().includes(val.toLowerCase());
      });
    });
  };

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

  const getOffices = async () => {
    const { data } = await sgdeaAxios.get('/seccionSubSeccion');
    return data.map(office => ({
      value: office.idSeccionSubSeccion,
      label: office.nombre
    }));
  };

  const getUserByOffice = async (selectedOfficeId?) => {
    try {
      const { data } = await sgdeaAxios.get('/usuarios/all');
      return data
        .filter(userInfo => userInfo.usuarioRelaciones && userInfo.usuarioRelaciones.some(relacion => relacion.oficina && relacion.oficina.id === selectedOfficeId))
        .map(user => ({
          value: user.id,
          label: `${user.firstname} ${user.lastname}`,
          cargo: user.cargo,
          email: user.email,
          oficina:user.usuarioRelaciones[0].oficina.nombre,
          municipio: user.municipio,
          departamento: user.departamento
        }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const getLabel = (value, options) => {
    let option = options.find(option => option.value === value);
    if (!option && value && typeof value === 'string') {
      option = { label: value };
    }
    return option ? option.label : '';
  };

  watch(() => formExitData.value.countryRecipientCopyInterna, (value) => {
    isDisable.value = false;
    formExitData.value.departmentRecipientCopyInterna = '';
    if (value !== 425) {
      formExitData.value.departmentRecipientCopyInterna = getLabel(value, optionsCountries.value);
      isDisable.value = true;
    }
  });

  watch(
    () => formExitData.value.departmentRecipientCopyInterna,
    async (value) => {
      if (!value) {
        formExitData.value.municipalityRecipientCopyInterna = '';
        return;
      }
      if (typeof value === 'string') {
        const municipalityLabel = formExitData.value.departmentRecipientCopyInterna;
        formExitData.value.municipalityRecipientCopyInterna = municipalityLabel;
        return;
      }
      formExitData.value.municipalityRecipientCopyInterna = '';
      const { optionsMunicipalities } = await useMunicipalities(value);
      municipioOptions.value = optionsMunicipalities.value;
    }
  );


watch(
  () => namecopyInterna.value,
 async (newValue) => {
  if (!newValue) {
        formExitData.value.municipalityRecipientCopyInterna = '';
        return;
      }
      if (typeof newValue === 'string') {
        const municipalityLabel = formExitData.value.departmentRecipientCopyInterna;
        formExitData.value.municipalityRecipientCopyInterna = municipalityLabel;
        return;
      }

    formExitData.value.municipalityRecipientCopyInterna = '';
      const { optionsMunicipalities } = await useMunicipalities(newValue);
      municipioOptionsStatic.value = optionsMunicipalities.value.sort((a, b) => a.label.localeCompare(b.label));
  }
);


  watch(
    () => formExitData.value.shippingMethodCopyInterna,
    (value) => {
      isRequired.value = false;
      isRequiredEmail.value = false;

      if (value === 3 || value === 4) {
        isRequired.value = true;
        return;
      }

      if (value === 1 || value === 2) {
        isRequiredEmail.value = true;
        return;
      }
    }
  );

  watch(
    () => formExitData.value.officeType,
    async (newOfficeId) => {
      if (newOfficeId) {
        const users = await getUserByOffice(newOfficeId);
        opUsuarios.value = users;
      }
    }
  );
</script>

