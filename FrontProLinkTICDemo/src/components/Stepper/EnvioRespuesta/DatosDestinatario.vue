<template>
    <q-card class="tw-rounded-xl tw-p-4" flat bordered>
        <q-expansion-item default-opened>
            <template v-slot:header>
                <div class="col row">
                    <b class="tw-text-lg">Destinatario</b>
                </div>
            </template>

            <div class="row q-col-gutter-md q-pb-md q-px-md">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <span class="text-weight-bold tw-text-gray-dark">Forma de Envío *</span>
                    <q-select :rules="[inputRequired]" name="formaEnvio" outlined v-model="form.formaEnvio"
                        label="Seleccione" dense map-options emit-value :options="opcionesFormaEnvio"
                        :disable="isPorAprobar" />
                </div>

                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <span class="text-weight-bold tw-text-gray-dark">Tipo de Documento del Destinatario </span>
                    <q-select :rules="[]" name="tipoDocumento" outlined
                        v-model="form.tipoDocumento" label="Seleccione" dense map-options emit-value
                        :options="tipoDocumentoTutelasOptions2.sort((a,b) => a.label.localeCompare(b.label))" :disable="isPorAprobar" />
                </div>

                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <span class="text-weight-bold tw-text-gray-dark">Número de Documento del Destinatario </span>
                    <q-input :rules="[alphanumericAbsolute, v => maxLengthInput(15, v)]"
                        name="numeroDocumentoDestinatario" map-options outlined v-model="form.numeroDocumentoDestinatario"
                        label="Inserte" dense :disable="form.tipoDocumento === 'Ninguno' || isPorAprobar" />
                </div>

                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <span class="text-weight-bold tw-text-gray-dark">Nombre del Destinatario *</span>
                    <q-input :rules="[inputRequired, alphanumeric, v => maxLengthInput(200, v)]"
                        name="nombreDestinatario" outlined v-model="form.nombreDestinatario" label="Inserte"
                        dense :disable="isPorAprobar" />
                </div>

                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <span class="text-weight-bold tw-text-gray-dark">Dirección del Destinatario <span v-if="['Courier', 'Mensajero'].includes(form.formaEnvio)">*</span></span>
                    <q-input :rules="['Courier', 'Mensajero'].includes(form.formaEnvio) ? [inputRequired, v => maxLengthInput(200, v)] : [v => maxLengthInput(200, v)]"
                        name="direccionDestinatario" outlined v-model="form.direccionDestinatario"
                        label="Inserte" dense :disable="isPorAprobar" />
                </div>

                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                    <span class="text-weight-bold tw-text-gray-dark">País <span v-if="['Courier', 'Mensajero'].includes(form.formaEnvio)">*</span></span>
                    <q-select v-model="form.paisDestinatario" :rules="[['Courier', 'Mensajero'].includes(form.formaEnvio) ? inputRequired : null]"
                      outlined map-options dense use-input hide-selected
                      fill-input input-debounce="0" label="Seleccione" :options="paises" @filter="filterPais" :disable="isPorAprobar" >
                      <template v-slot:no-option>
                          <q-item>
                          <q-item-section class="text-grey">
                              Sin resultados
                          </q-item-section>
                          </q-item>
                      </template>
                    </q-select>
                </div>

                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                    <span class="text-weight-bold tw-text-gray-dark">Departamento <span v-if="['Courier', 'Mensajero'].includes(form.formaEnvio)">*</span></span>
                    <q-select v-model="form.departamentoDestinatario" :rules="[['Courier', 'Mensajero'].includes(form.formaEnvio) ? inputRequired : null]" name="departamentoDestinatario"
                      outlined map-options dense use-input hide-selected :disable="isntColombia || isPorAprobar"
                      fill-input input-debounce="0" label="Seleccione" :options="departments" @filter="filterDep" >
                      <template v-slot:no-option>
                          <q-item>
                          <q-item-section class="text-grey">
                              Sin resultados
                          </q-item-section>
                          </q-item>
                      </template>
                    </q-select>
                </div>

                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                    <span class="text-weight-bold tw-text-gray-dark">Municipio <span v-if="['Courier', 'Mensajero'].includes(form.formaEnvio)">*</span></span>
                    <q-select v-model="form.municipioDestinatario" :rules="[['Courier', 'Mensajero'].includes(form.formaEnvio) ? inputRequired : null]" name="municipioDestinatario"
                      outlined map-options dense use-input hide-selected :disable="isntColombia || isPorAprobar"
                      fill-input input-debounce="0" label="Seleccione" :options="municipalities" @filter="filterMuni" >
                      <template v-slot:no-option>
                          <q-item>
                          <q-item-section class="text-grey">
                              Sin resultados
                          </q-item-section>
                          </q-item>
                      </template>
                    </q-select>
                </div>

                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <span class="text-weight-bold tw-text-gray-dark">Teléfono del Destinatario <span v-if="['Courier'].includes(form.formaEnvio)">*</span> </span>
                    <q-input :rules="[['Courier'].includes(form.formaEnvio) ? inputRequired : null ,alphanumericWithPoint]" name="telefonoDestinatario"
                        outlined v-model="form.telefonoDestinatario" label="Inserte" dense :disable="isPorAprobar" />
                </div>

                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <span class="text-weight-bold tw-text-gray-dark">Correo Electrónico del Destinatario <span v-if="['Correo electrónico', 'Correo electrónico certificado', 'Courier'].includes(form.formaEnvio)">*</span> </span>
                    <q-input :rules="['Correo electrónico', 'Correo electrónico certificado', 'Courier'].includes(form.formaEnvio) ? [inputRequired, v => validationEmail(v)] : [v => validationEmail(v)]" name="correoElectronico"
                        outlined v-model="form.correoElectronico" label="Inserte" dense :disable="isPorAprobar" />
                </div>
            </div>
        </q-expansion-item>
    </q-card>
</template>

<script setup lang="ts">
import { PropType, Ref, onMounted, ref, watch, watchEffect } from 'vue';

import { tipoDocumentoTutelasOptions2 } from 'src/constantes/options';
import { alphanumeric, homePhoneNumberAndMaxLength, inputRequired, maxLengthInput, minLengthInput, onlyNumbers, validationEmail, alphanumericAbsolute, alphanumericWithPoint } from "src/helpers/validations";
import { BonitaAPI, SelectInput } from "src/interfaces";
import { adminAxios, sgdeaAxios } from 'src/services';
import { useDepartments, useMunicipalities } from "src/composables/useVersion";
import { useAuthStore } from 'src/stores/auth.store';

const paises: Ref<SelectInput[]> = ref([]);
const opsCountry: Ref<SelectInput[]> = ref([])
const departments: Ref<SelectInput[]> = ref([]);
const opsDep: Ref<SelectInput[]> = ref([])
const municipalities: Ref<SelectInput[]> = ref([]);
const opsMuni: Ref<SelectInput[]> = ref([])
const isntColombia = ref<boolean>(false);
const opcionesFormaEnvio = ref<SelectInput[]>([])
const auth = useAuthStore();

const props = defineProps({
    form: {
        type: Object as PropType<Destinatario>,
        default: () => ({
            formaEnvio: '',
            tipoDocumento: '',
            numeroDocumentoDestinatario: '',
            nombreDestinatario: '',
            direccionDestinatario: '',
            paisDestinatario: { label: 'COLOMBIA', value: 425 },
            departamentoDestinatario: { label: '', value: '' },
            municipioDestinatario: { label: '', value: '' },
            telefonoDestinatario: '',
            correoElectronico: ''
        })
    },
    isPorAprobar: {
        type: Boolean,
        required: true
    }
})

onMounted(async () => {
  getData()
  listadoFormaEnvio();
})

const listadoFormaEnvio = async () => {
  try {
    const {data: response} = await sgdeaAxios.get('/correspondencia/comunicacion/listadoFormaEnvio');
    opcionesFormaEnvio.value = response
      .filter(item => {
      if (auth.$state.userInfo.isCertificado) {
        return ![4, 5].includes(item.id);
      } else {
        return ![2, 4, 5].includes(item.id);
      }
      })
      .map(item => ({
      label: item.nombre,
      value: item.nombre
      }));
  } catch (error) {
    console.error( error);
  }
}

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

const getData = async () => {
  try {
    const { data: paisesData } = await adminAxios.get("/paises/list");
    const { data: dptos } = await adminAxios.get("/departamentos/list/425");
    const { data: muni } = await adminAxios.get("/municipios/list");

    // Countries
    opsCountry.value = sortOptions(
      paisesData.map(({ nombre, idPais }) => ({
        label: nombre,
        value: idPais,
      }))
    );

    // Departments
    opsDep.value = sortOptions(
      dptos.map((item) => ({
        label: item.nombre,
        value: item.idDepartamento,
      }))
    );

    // // Municipalities
    // opsMuni.value = sortOptions(
    //   muni.map(({ nombre, idMunicipio }) => ({
    //     label: nombre,
    //     value: idMunicipio,
    //   }))
    // );

  } catch (error) {
    console.error(error);
  }
};

watch(
  () => props.form.paisDestinatario,
  async (value) => {
    let val = value as unknown as string

    props.form.departamentoDestinatario = { label: '', value: ''}
    props.form.municipioDestinatario = { label: '', value: ''}

    // @ts-ignore
    if (val.label.toLowerCase() == 'colombia') {
      isntColombia.value = false
      // @ts-ignore
      const { optionsDepartments } = await useDepartments(value.value);
      opsDep.value = sortOptions(optionsDepartments.value);
    } else {
      props.form.departamentoDestinatario = { label: value.label, value: value.value }
      props.form.municipioDestinatario = { label: value.label, value: value.value }
      isntColombia.value = true
    }
  }
);

watch(
  () => props.form.departamentoDestinatario,
  async (value, oldValue) => {

      // @ts-ignore
    const { optionsMunicipalities } = await useMunicipalities(value.value || value);
    opsMuni.value = sortOptions(optionsMunicipalities.value);
    if(value.label !== oldValue.label && oldValue.label !== '' && props.form.paisDestinatario.label.toLowerCase() == 'colombia') {
      props.form.municipioDestinatario = { label: '', value: '' }
    }
  }
);


interface Destinatario {
    formaEnvio: string;
    tipoDocumento: string;
    numeroDocumentoDestinatario: string;
    nombreDestinatario: string;
    direccionDestinatario: string;
    paisDestinatario: { label: string, value: string };
    municipioDestinatario: { label: string, value: string };
    departamentoDestinatario: { label: string, value: string };
    telefonoDestinatario: string;
    correoElectronico: string;
}

const normalizeString = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

const filterPais = (val, update) => {
  if (val === '') {
    update(() => {
      paises.value = opsCountry.value
    })
    return
  }

  const needle = normalizeString(val);
  update(() => {
    paises.value = opsCountry.value.filter(v => {
      return normalizeString(v.label).indexOf(needle) > -1;
    });
  });
}

const filterDep = (val, update) => {
  if (val === '') {
    update(() => {
      departments.value = opsDep.value
    })
    return
  }

  const needle = normalizeString(val);
  update(() => {
    departments.value = opsDep.value.filter(v => {
      return normalizeString(v.label).indexOf(needle) > -1;
    });
  });
}

const filterMuni = (val, update) => {
  if (val === '') {
    update(() => {
      municipalities.value = opsMuni.value
    })
    return
  }

  const needle = normalizeString(val);
  update(() => {
    municipalities.value = opsMuni.value.filter(v => {
      return normalizeString(v.label).indexOf(needle) > -1;
    });
  });
}

</script>
