<template>
  <q-form ref="formRef" greedy class="tw-w-full">
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
            <q-select :rules="[inputRequired]" name="copia" outlined v-model="form.copia" label="Seleccione" dense
              map-options emit-value :options="opCopia" />
          </div>
        </div>
      </q-expansion-item>
    </q-card>
    <template v-if="form.copia == '1'">
      <q-card class="tw-rounded-xl tw-p-4 tw-my-5" flat bordered>
        <q-expansion-item default-opened>
          <template v-slot:header>
            <div class="col row">
              <b class="tw-text-lg">Copia Interna</b>
            </div>
          </template>
        </q-expansion-item>
        <div class="row q-col-gutter-md q-pb-md q-px-md">
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <span class="tw-text-label">Dependencia *</span>
            <q-select v-model="form.dependencia" map-options outlined dense use-input hide-selected
              fill-input input-debounce="0" label="Inserte" :options="opDependencias" @filter="filterDepe"
              :rules="[inputRequired]" @input-value="v => addValue(v, 'dependencia')" >
              <template v-slot:prepend>
                  <q-icon name="search" />
              </template>
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
            <span class="tw-text-label">Nombre funcionario *</span>
            <q-select v-model="form.nombreFuncionario" emit-value map-options outlined dense use-input hide-selected
              fill-input input-debounce="0" label="Inserte" :options="funcionarioOp" @filter="filterFun"
              :rules="[inputRequired]" @input-value="v => addValue(v, 'nombreFuncionario')" >
              <template v-slot:prepend>
                  <q-icon name="search" />
              </template>
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

        <div class="row tw-flex tw-justify-center tw-items-center tw-mb-3 tw-gap-x-5">
          <q-btn label="Limpiar" class="tw-h-10 tw-w-40" @click="clear" />
          <q-btn color="primary" label="Agregar" class="tw-h-10 tw-w-40" @click="addInterna" />
        </div>
      </q-card>
    </template>
    <template v-if="form.copia == '2'">
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
            <span class="tw-text-label">Forma de Envio *</span>
            <q-select :rules="[inputRequired]" name="tipoEnvio" v-model="form.formaEnvio" outlined label="Seleccione"
              dense map-options emit-value :options="[
              'Correo electrónico',
              'Correo electrónico certificado',
              'Guía (Courier)',
              'Personal',
            ]" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <span class="tw-text-label">Tipo de Documento Destinatario *</span>
            <q-select :rules="[inputRequired]" name="tipoDocumento" v-model="form.tipoDocumento" outlined
              label="Seleccione" dense map-options :options="tipoDocOp" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <span class="tw-text-label">Número de Documento del Destinatario </span>
            <q-input :disable="form.tipoDocumento === 'Ninguno'" :rules="[Number(form.tipoDocumento) == 11 ? alphanumeric : v => onlyNumbers(v), v => maxLengthInput(15, v)]"
              name="documento" v-model="form.documento" outlined label="Inserte" dense />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <span class="tw-text-label">Nombre del Destinatario *</span>
            <q-input :rules="[inputRequired, alphanumericAbsolute, v => maxLengthInput(80, v)]" name="nombre"
              v-model="form.nombre" outlined label="Inserte" dense />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <span class="tw-text-label">Dirección del Destinatario <span v-if="form.formaEnvio === 'Guía (Courier)'">*</span> </span>
            <q-input :rules="[form.formaEnvio === 'Guía (Courier)' ? inputRequired : null, alphanumeric, v => maxLengthInput(30, v)]" name="direccion"
              v-model="form.direccion" outlined label="Inserte" dense />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="tw-text-label">{{ form.formaEnvio === 'Guía (Courier)' ? 'País Destinatario *' : 'País Destinatario'}} </span>
            <q-select :rules="[form.formaEnvio === 'Guía (Courier)' ? inputRequired : null, inputValidation]" name="pais" v-model="form.pais" outlined label="Seleccione" map-options
              dense :options="paises" />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <span class="tw-text-label">{{ form.formaEnvio === 'Guía (Courier)' ? 'Departamento Destinatario *' :
              'Departamento Destinatario '}}</span>
            <q-select :rules="[form.formaEnvio === 'Guía (Courier)' ? inputRequired : null, inputValidation]" name="departamento" v-model="form.departamento" outlined
              label="Seleccione" dense map-options :options="departments" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="tw-text-label">{{ form.formaEnvio === 'Guía (Courier)' ? 'Municipio Destinatario *' : 'Municipio Destinatario '}}</span>
            <q-select :rules="[form.formaEnvio === 'Guía (Courier)' ? inputRequired : null, inputValidation]" name="municipio" v-model="form.municipio" outlined label="Seleccione"
              dense map-options :options="municipalities" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <span class="tw-text-label">Teléfono Destinatario </span>
            <q-input :rules="[onlyNumbers, homePhoneNumber]" name="telefono" v-model="form.telefono" outlined
              label="Inserte" dense />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <span class="tw-text-label">Correo Electrónico <span v-if="['Correo electrónico', 'Correo electrónico certificado'].includes(form.formaEnvio)">*</span></span>
            <q-input :rules="[['Correo electrónico', 'Correo electrónico certificado'].includes(form.formaEnvio) ? inputRequired : null, validationEmail, (v) => maxLengthInput(200, v)]" name="correo"
              v-model="form.correo" outlined label="Inserte" dense />
          </div>
        </div>
        <div class="row tw-flex tw-justify-center tw-items-center tw-mb-3 tw-gap-x-5">
          <q-btn label="Limpiar" class="tw-h-10 tw-w-40" @click="clear" />
          <q-btn color="primary" label="Agregar" class="tw-h-10 tw-w-40" @click="addExterna" />
        </div>
      </q-card>
    </template>
    <template v-if="(form.copia == '1' || form.copia == '2')">
      <div class="tw-mt-10">
        <p class="tw-text-lg text-weight-bold q-mx-lg">
          Listado de Destinatarios Agregados
        </p>
        <Table class="full-width" :COPIA_HEADER="form.copia == '1' ? COPIA_HEADER2 : COPIA_HEADER" :COPIA_BODY="COPIA_BODY"
          :delete-fila="deleteFila" />
      </div>
    </template>
  </q-form>
</template>

<script setup lang="ts">
import Table from './Table.vue'

import { COPIA_HEADER, COPIA_HEADER2 } from './index'
import { alphanumeric, homePhoneNumber, inputRequired, maxLengthInput, onlyNumbers, validationEmail, alphanumericAbsolute } from "src/helpers/validations";
import { SelectInput } from "src/interfaces";
import { adminAxios, sgdeaAxios } from "src/services";
import { useDepartments, useMunicipalities } from "src/composables/useVersion";
import { PropType, Ref, computed, onMounted, ref, watch } from "vue";
import { toast } from 'src/helpers/toast';
import { QForm } from 'quasar';
import { useDependencias } from "src/composables/useEntidades";

const props = defineProps({
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
      copiaBody: []
    })
  }
})

const { optionsDependencias: opForDependencias } = useDependencias()
const opDependencias = ref([])
const funcionarioOp = ref([])
const opForfuncionario = ref([])
const tipoDocOp = ref([])
const paises: Ref<SelectInput[]> = ref([]);
const departments: Ref<SelectInput[]> = ref([]);
const municipalities: Ref<SelectInput[]> = ref([]);
const formRef: Ref<QForm | null> = ref(null);
const opCopia = ref([])
const COPIA_BODY = ref([...props.form.copiaBody])

const inputValidation = computed(() => props.form.formaEnvio === 'Guía (Courier)' ? v => inputRequired(v.label) : null)

const emit = defineEmits(['update:formCopia', 'update:itemTable'])

const addInterna = async() => {
  try {
    // @ts-ignore
    const nombre = props.form.nombreFuncionario.firstname + ' ' + props.form.nombreFuncionario.lastname
    if (!COPIA_BODY.value.find(it => it.nombre === nombre)) {
      COPIA_BODY.value.push({
        dependencia: props.form.dependencia.label,
        nombre
      })
      emit('update:itemTable', COPIA_BODY.value)
      await clear()
    } else {
      toast.error('El usuario ya esta agregado.')
    }
  } catch (error) {
    toast.error('Ha ocurrido un error.')
  }
}

const addExterna = async () => {
  try {
    if (!COPIA_BODY.value.find(it => it.nombre === props.form.nombre)) {
      COPIA_BODY.value.push({
        formaEnvio: props.form.formaEnvio,
        tipoDocumento: props.form.tipoDocumento.label,
        numeroDocumento: props.form.documento,
        nombre: props.form.nombre,
        direccion: props.form.direccion,
        pais: props.form.pais.label,
        departamento: props.form.departamento.label,
        municipio: props.form.municipio.label,
        telefono: props.form.telefono,
        correo: props.form.correo
      })
      emit('update:itemTable', COPIA_BODY.value)
      await clear()
    } else {
      toast.error('El usuario ya esta agregado.')
    }
  } catch (error) {
    toast.error('Ha ocurrido un error.')
  }
}

const deleteFila = async (_, id) => {
  COPIA_BODY.value.splice(id, 1)
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

const clear = async() => {
  emit('update:formCopia', props.form)
  await formRef.value.reset()
};

const getData = async () => {
  try {
    const { data: dptos } = await adminAxios.get("/departamentos/list");
    const { data: formData } = await adminAxios.get("/municipios/list");
    const { data: paisesData } = await adminAxios.get("/paises/list");
    const { data: opsCopia } = await sgdeaAxios.get('/correspondencia/comunicacion/listadoTipoCopia')
    const { data: opsTipoDoc } = await sgdeaAxios.get('/correspondencia/comunicacion/listadoTipoIdentificacion')

    tipoDocOp.value = opsTipoDoc?.map((item: any) => ({
      value: item.id,
      label: item.nombre,
    })).filter(it => it.label !== 'Ninguno').sort((a, b) => a.label.localeCompare(b.label))

    opCopia.value = opsCopia?.map((item: any) => ({
      value: item.id,
      label: item.nombre
    })).filter(({ label }) => label !== 'Interna y externa')

    // Departments
    departments.value = sortOptions(
      dptos.map((item) => ({
        label: item.nombre,
        value: item.idDepartamento,
      }))
    );

    // Municipalities
    municipalities.value = sortOptions(
      formData.map(({ nombre }) => ({
        label: nombre,
        value: nombre,
      }))
    );

    // Countries
    paises.value = sortOptions(
      paisesData.map(({ nombre }) => ({
        label: nombre,
        value: nombre,
      }))
    );
  } catch (error) {
    console.error(error);
  }
};

onMounted(async() =>
  await getData()
)

watch(
  () => props.form.pais,
  async (value) => {
    let val = value as unknown as string
    if (val.toLowerCase() == 'colombia') {
      const { optionsDepartments } = await useDepartments(Number(value.value));
      departments.value = sortOptions(optionsDepartments.value);
    }
  }
);

watch(
  () => props.form.departamento,
  async (value) => {
    const { optionsMunicipalities } = await useMunicipalities(value.value)
    municipalities.value = sortOptions(optionsMunicipalities.value)
  }
);

watch(
  () => props.form.dependencia.value,
  async (value) => {
    const { data } = await sgdeaAxios.get(`api/usuarios/seccionSubseccion/${value}`)
    opForfuncionario.value = data.map((item) => ({
      label: item.firstname + ' ' + item.lastname,
      value: item
    }))

  }
);

watch(
  () => props.form.tipoDocumento.label,
  async (value) => {
    if (value == 'Ninguno') {
      props.form.documento = ''
    }
  }
)

watch(
  () => props.form.copia,
  async (newValue, oldValue) => {
    if (newValue !== oldValue) {
      COPIA_BODY.value = []
    }
  }
)

interface copia {
  copia: any;
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
  copiaBody: any;
}

const addValue = (value, type) => {
  props.form[type] = value
}

const filterDepe = (val: string, update: any) => {
  update(() => {
    if (val === '') {
      opDependencias.value = opForDependencias.value
    } else {
      const needle = val.toLowerCase();
      opDependencias.value = opForDependencias.value.filter(({ label }) => label.toLowerCase().includes(needle));
    }
  });
}

const filterFun = (val: string, update: any) => {
  update(() => {
    if (val === '') {
      funcionarioOp.value = opForfuncionario.value
    } else {
      const needle = val.toLowerCase();
      funcionarioOp.value = opForfuncionario.value.filter(({ label }) => label.toLowerCase().includes(needle));
    }
  });
}
</script>
