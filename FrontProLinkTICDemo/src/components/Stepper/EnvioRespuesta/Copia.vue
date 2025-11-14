<template>
  <q-card class="tw-rounded-xl tw" flat bordered>
    <q-expansion-item default-opened>
      <template v-slot:header>
        <div class="col row">
          <b class="tw-text-lg">Usuarios en Copia</b>
        </div>
      </template>

      <div class="row q-col-gutter-md q-pb-md q-px-md">
        <div class="col-12">
          <span class="tw-text-label">¿Con Copia? *</span>
          <q-select :rules="[inputRequired]" name="copia" outlined v-model="form.copia" label="Seleccione" dense :disable="isPorAprobar"
            map-options emit-value :options="[
            { value: 'INT', label: 'Interna' },
            { value: 'COU', label: 'Externa' },
            { value: 'NIN', label: 'Ninguna' }
          ]" />
        </div>
      </div>
    </q-expansion-item>
  </q-card>
  <q-form ref="formRef" greedy class="tw-w-full">
    <template v-if="form.copia == 'INT'">
      <q-card class="tw-rounded-xl tw-p-4 tw-my-5" flat bordered>
        <q-expansion-item default-opened>
          <template v-slot:header>
            <div class="col row">
              <b class="tw-text-lg">Copia Interna</b>
            </div>
          </template>
        </q-expansion-item>
        <q-form ref="internoForm" greedy>
          <div class="row q-col-gutter-md q-pb-md q-px-md">
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <span class="tw-text-label text-weight-bold">Dependencia *</span>
              <q-select v-model="form.dependencia" name="dependencia" outlined dense use-input hide-selected map-options emit-value
                fill-input input-debounce="0" label="Seleccione" :options="opsDependencias"
                :rules="[inputRequired]" @filter="filterDependencia" >
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
              <span class="tw-text-label text-weight-bold">Nombre Funcionario *</span>
              <q-select v-model="form.nombreFuncionario" name="nombreFuncionario" outlined dense use-input hide-selected map-options emit-value
                fill-input input-debounce="0" label="Seleccione" :options="funcionarioOp"
                :rules="[inputRequired]" @filter="filterNombre" >
                <template v-slot:no-option>
                    <q-item>
                    <q-item-section class="text-grey">
                        Sin resultados
                    </q-item-section>
                    </q-item>
                </template>
              </q-select>
            </div>
          </div>
        </q-form>

        <div class="row tw-flex tw-justify-center tw-items-center tw-mb-3">
          <q-btn icon="add" color="primary" label="Agregar" class="tw-h-10 tw-w-40" @click="addExterna" />
        </div>
      </q-card>
    </template>
    <template v-if="form.copia == 'COU'">
      <q-card class="tw-rounded-xl tw-p-4 tw-my-5">
        <q-expansion-item default-opened>
          <template v-slot:header>
            <div class="col row">
              <b class="tw-text-lg">Copia Externa</b>
            </div>
          </template>
        </q-expansion-item>
        <div class="row q-col-gutter-md q-pb-md q-px-md">
          <div class="col-12">
            <span class="tw-text-label text-weight-bold">Forma de Envío *</span>
            <q-select :rules="[inputRequired]" name="tipoEnvio" v-model="form.formaEnvio" outlined label="Seleccione"
              dense map-options emit-value :options="[
              'Correo electrónico',
              'Correo electrónico certificado',
              'Guía (Courier)',
              'Personal',
            ]" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <span class="tw-text-label text-weight-bold">Tipo de Documento Destinatario *</span>
            <q-select :rules="[inputRequired]" name="tipoDocumento" v-model="form.tipoDocumento" outlined
              label="Seleccione" dense map-options emit-value :options="tipoDocOp" @blur="getPerson" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <span class="tw-text-label text-weight-bold">Número de Documento del Destinatario </span>
            <q-input :disable="form.tipoDocumento === 'Ninguno'" :rules="[alphanumericAbsolute , v => maxLengthInput(15, v),inputRequired]"
              name="documento" v-model="form.documento" outlined label="Inserte" dense @blur="getPerson" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <span class="tw-text-label text-weight-bold">Nombre del Destinatario *</span>
            <q-input :rules="[inputRequired, alphanumericAbsolute, v => maxLengthInput(80, v)]" name="nombre"
              v-model="form.nombre" outlined label="Inserte" dense />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <span class="tw-text-label text-weight-bold">Dirección del Destinatario <span v-if="form.formaEnvio === 'Guía (Courier)'">*</span> </span>
            <q-input :rules="[form.formaEnvio === 'Guía (Courier)' ? inputRequired : null, alphanumeric, v => maxLengthInput(30, v)]" name="direccion"
              v-model="form.direccion" outlined label="Inserte" dense />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="tw-text-label text-weight-bold">{{ form.formaEnvio === 'Guía (Courier)' ? 'País Destinatario *' : 'País Destinatario'}} </span>
            <q-select v-model="form.pais" name="pais" outlined dense use-input hide-selected map-options
              fill-input input-debounce="0" label="Seleccione" :options="optionsCountries"
              :rules="[form.formaEnvio === 'Guía (Courier)' ? inputRequired : null, inputValidation]" @filter="filterPais" >
              <template v-slot:no-option>
                  <q-item>
                  <q-item-section class="text-grey">
                      Sin resultados
                  </q-item-section>
                  </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <span class="tw-text-label text-weight-bold">{{ form.formaEnvio === 'Guía (Courier)' ? 'Departamento Destinatario *' :
              'Departamento Destinatario '}}</span>
            <q-select v-model="form.departamento" name="departamento" outlined dense use-input hide-selected map-options
              fill-input input-debounce="0" label="Seleccione" :options="departments" :disable="isntColombia"
              :rules="[form.formaEnvio === 'Guía (Courier)' ? inputRequired : null, inputValidation]"  >
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
            <span class="tw-text-label text-weight-bold">{{ form.formaEnvio === 'Guía (Courier)' ? 'Municipio Destinatario *' : 'Municipio Destinatario '}}</span>
            <q-select v-model="form.municipio" name="municipio" outlined dense use-input hide-selected map-options
              fill-input input-debounce="0" label="Seleccione" :options="municipalities" :disable="isntColombia"
              :rules="[form.formaEnvio === 'Guía (Courier)' ? inputRequired : null, inputValidation]"  >
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
            <span class="tw-text-label text-weight-bold">Teléfono Destinatario </span>
            <q-input :rules="[onlyNumbers, mobilePhoneNumberTenToTwelve]" name="telefono" v-model="form.telefono" outlined
              label="Inserte" dense />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <span class="tw-text-label text-weight-bold">Correo Electrónico <span v-if="['Correo electrónico', 'Correo electrónico certificado'].includes(form.formaEnvio)">*</span></span>
            <q-input :rules="[['Correo electrónico', 'Correo electrónico certificado'].includes(form.formaEnvio) ? inputRequired : null, validationEmail, (v) => maxLengthInput(50, v)]" name="correo"
              v-model="form.correo" outlined label="Inserte" dense />
          </div>
        </div>
        <div class="row tw-flex tw-justify-center tw-items-center tw-mb-3">
          <q-btn icon="add" color="primary" label="Agregar" class="tw-h-10 tw-w-40" @click="addExterna" />
        </div>
      </q-card>
    </template>
    <template v-if="(form.copia === 'INT' || form.copia === 'COU')">
      <div class="tw-mt-10">
        <p class="tw-text-lg text-weight-bold q-mx-lg">
          Listado de Destinatarios Agregados
        </p>
        <Table class="full-width" :COPIA_HEADER="COPIA_HEADER" :COPIA_BODY="COPIA_BODY"
          :delete-fila="deleteFila"  />
      </div>
    </template>
  </q-form>
</template>

<script setup lang="ts">
import Table from './Table.vue'

import { COPIA_HEADER } from './index'
import { alphanumeric, homePhoneNumber, inputRequired, maxLengthInput, onlyNumbers, validationEmail, alphanumericAbsolute, mobilePhoneNumberTenToTwelve } from "src/helpers/validations";
import { SelectInput } from "src/interfaces";
import { adminAxios, sgdeaAxios } from "src/services";
import {useCountries, useDepartments, useMunicipalities} from "src/composables/useVersion";
import { PropType, Ref, computed, onMounted, ref, watch } from "vue";
import { toast } from 'src/helpers/toast';
import { QForm } from 'quasar';
import { useDependencias } from "src/composables/useEntidades";

const props = defineProps({
  detailsTutela: Object,
  isPorAprobar: {
    type: Boolean,
    required: true
  },
  form: {
    type: Object as PropType<copia>,
    default: () => ({
      copia: '',
      dependencia: '',
      nombreFuncionario: '',

      formaEnvio: '',
      tipoDocumento: '',
      documento: '',
      nombre: '',
      direccion: '',
      pais: { label: 'Colombia', value: 425 },
      departamento: { label: '', value: null },
      municipio: { label: '', value: null },
      telefono: '',
      correo: '',
    })
  }
})

const emit = defineEmits(['update:itemsTable'])
const { optionsDependencias } = useDependencias()
const { optionsCountries } = useCountries()
const opsDependencias = ref([])
const funcionarioOp = ref()
const opsFuncionario = ref()
const internoForm = ref()
const tipoDocOp = [
  { label: "Carné Diplomático", value: "Carné Diplomático" },
  { label: "Cédula de Ciudadanía", value: "Cédula de Ciudadanía" },
  { label: "Cédula de Extranjería", value: "Cédula de Extranjería" },
  { label: "Fideicomiso, fondos de inversión colectiva Fondo o patrimonio autónomo", value: "Fideicomiso, fondos de inversión colectiva Fondo o patrimonio autónomo" },
  { label: 'Ninguno', value: 'Ninguno' },
  { label: "Número de Identificación Tributaria NIT", value: "Número de Identificación Tributaria NIT" },
  { label: 'Número único de identificación personal (NUIP)', value: 'Número único de identificación personal (NUIP)' },
  { label: "Pasaporte", value: "Pasaporte" },
  { label: "Permiso especial de permanencia (PEP)", value: "Permiso especial de permanencia (PEP)" },
  { label: "Permiso por protección temporal (PPT)", value: "Permiso por protección temporal (PPT)" },
  { label: "Sociedad extranjera sin NIT en Colombia ", value: "Sociedad extranjera sin NIT en Colombia " },
  { label: "Tarjeta de Identidad", value: "Tarjeta de Identidad" },
]
const paises: Ref<SelectInput[]> = ref([]);
const opsCountry: Ref<SelectInput[]> = ref([]);
const departments: Ref<SelectInput[]> = ref([]);
const opsDep: Ref<SelectInput[]> = ref([]);
const municipalities: Ref<SelectInput[]> = ref([]);
const opsMuni: Ref<SelectInput[]> = ref([]);
const formRef: Ref<QForm | null> = ref(null);
const isntColombia = ref(false)

const COPIA_BODY = ref([])

const inputValidation = computed(() => props.form.formaEnvio === 'Guía (Courier)' ? v => inputRequired(v.label) : null)

const addInterna = async () => {
  try {

  } catch (error) {
    toast.error('Ha ocurrido un error.')
  }
}

const addExterna = async () => {

  try {
    var data = {}
    const id = props.detailsTutela?.idTutela
    if (props.form.copia == 'INT') {
      if (await internoForm.value.validate()) {
        const item = props.form.nombreFuncionario
        data = {
          formaEnvio: 'Correo electrónico',
          tipoDocumento: 'Ninguno',
          numeroDocumento: item.numeroDocumento,
          nombre: item.firstname + ' ' + item.lastname,
          direccion: '',
          pais: '',
          departamento: '',
          municipio: '',
          telefono: '',
          correo: item.email,
          idTutela: id
        }
      }else{
        toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos.')
        return
      }

      }
    if (props.form.copia == 'COU') {
      if (await formRef.value.validate()) {
          data = {
          formaEnvio: props.form.formaEnvio,
          tipoDocumento: props.form.tipoDocumento,
          numeroDocumento: props.form.documento == '' ? null : props.form.documento,
          nombre: props.form.nombre,
          direccion: props.form.direccion,
          pais: props.form.pais.label,
          departamento: props.form.departamento.label,
          municipio: props.form.municipio.label,
          telefono: props.form.telefono,
          correo: props.form.correo,
          idTutela: id
        }
      } else {
        toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos.')
        return
      }
    }

    const response = await sgdeaAxios.post(`tutela/${id}/usuario/externos`, data)
      if (response.status === 200) {
        getUsuariosExternos()
        if (props.form.copia == 'COU') {
          props.form.formaEnvio = ''
          props.form.tipoDocumento = ''
          props.form.documento = ''
          props.form.nombre = ''
          props.form.direccion = ''
          props.form.pais = { label: 'Colombia', value: 425 }
          props.form.departamento = { label: '', value: null }
          props.form.municipio = { label: '', value: null }
          props.form.telefono = ''
          props.form.correo = ''
          formRef.value.reset()
        }else{
          props.form.nombreFuncionario = ''
          opsFuncionario.value = ''
          props.form.dependencia = ''
          internoForm.value.reset()
        }
      }
  } catch (error) {
    toast.error('Ha ocurrido un error.')
  }
}

const updateDelete = async (deleteItem) => {
  if (deleteItem) {
    getUsuariosExternos()
  }
}

const deleteFila = async(id, _) => {
  try {
    const response = await sgdeaAxios.delete(`/tutela/usuario/externos/${id}`)
    if (response.status === 200) {
      toast.success('El destinatario fue eliminado de manera exitosa')
      getUsuariosExternos()
    }
  } catch (error) {
    toast.error('Ha ocurrido un error')
  }
}

const getUsuariosExternos = async () => {
  const { data } = await sgdeaAxios.get(`tutela/${props.detailsTutela?.idTutela}/usuario/externos`)
  COPIA_BODY.value = data.map(it => ({
    ...it,
  }))
  emit('update:itemsTable', COPIA_BODY.value)
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

watch(
  () => props.form.pais,
  async (value) => {
    let val = value as any;
    props.form.departamento = { label: '', value: null };
    props.form.municipio = { label: '', value: null };

    if (val?.label === 'Colombia') {
      isntColombia.value = false;
      const { optionsDepartments } = await useDepartments(val.value);
      departments.value = sortOptions(optionsDepartments.value);
    } else if (val?.label) {
      isntColombia.value = true;
      props.form.departamento = { label: val.label, value: null };
      props.form.municipio = { label: val.label, value: null };
    }
  },
  { immediate: true }
);

watch(
  () => props.form.departamento,
  async (value) => {
    if (value.value) {
      props.form.municipio = { label: '', value: null }
      const { optionsMunicipalities } = await useMunicipalities(value.value)
      municipalities.value = sortOptions(optionsMunicipalities.value)
    }
  }
);


watch(
  () => props.form.dependencia,
  async (value) => {

    const { data } = await sgdeaAxios.get(`api/usuarios/seccionSubseccion/${value}`)
    opsFuncionario.value = data.map((item) => ({
      label: item.firstname + ' ' + item.lastname,
      value: item
    }))
  }
);

watch(
  () => props.form.tipoDocumento,
  async (value) => {
    if (value == 'Ninguno') {
      props.form.documento = ''
    }
  }
)

watch(
  () => props.form.copia,
  async (value) => {
    if (value === 'NIN') return;
    getUsuariosExternos()
  }
);
interface copia {
  copia: string;
  dependencia: string;
  nombreFuncionario: string;
  formaEnvio: string;
  tipoDocumento: string;
  documento: string;
  nombre: string;
  direccion: string;
  pais: { label: string, value: number };
  departamento: { label: string, value: number };
  municipio: { label: string, value: number };
  telefono: string;
  correo: string;
}

async function getPerson() {
  const tipoDoc = props.form.tipoDocumento === 'Cédula de Ciudadanía' ? 'cc' : ''
  const number = props.form.documento ? props.form.documento : ''

  if (tipoDoc !== '' && number !== '') {
    const { data } = await sgdeaAxios.get("/personas", {
      params: {
        tipoDocumento: tipoDoc,
        numeroDocumento: number
      }
    })
    if (data) {
      props.form.nombre = [
          data?.nombre1,
          data?.nombre2,
          data?.apellido1,
          data?.apellido2
      ].filter(Boolean).join(' ');
      props.form.direccion = data.direccion
      props.form.telefono = data.telefono
      props.form.correo = data.email
    } else {
      props.form.nombre = ''
      props.form.direccion = ''
      props.form.telefono = ''
      props.form.correo = ''
    }
  }
}

const normalizeString = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

const filterDependencia = (val, update) => {
  if (val === '') {
    update(() => {
      opsDependencias.value = optionsDependencias.value
    })
    return
  }

  const needle = normalizeString(val);
  update(() => {
    opsDependencias.value = optionsDependencias.value.filter(v => {
      return normalizeString(v.label).indexOf(needle) > -1;
    });
  });
}

const filterNombre = (val, update) => {
  if (val === '') {
    update(() => {
      funcionarioOp.value = opsFuncionario.value
    })
    return
  }

  const needle = normalizeString(val);
  update(() => {
    funcionarioOp.value = opsFuncionario.value.filter(v => {
      return normalizeString(v.label).indexOf(needle) > -1;
    });
  });
}

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
