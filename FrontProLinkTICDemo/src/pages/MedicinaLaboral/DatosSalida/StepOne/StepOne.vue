<template>
  <section>
    <q-form ref="step1form" greedy class="flex tw-flex-col tw-gap-6">
      <q-card class="tw-rounded-xl tw-py-6 tw-px-8" flat>
        <h2 class="tw-font-bold tw-text-lg tw-mb-4">Información General</h2>
        <div class="tw-grid tw-grid-cols-6 tw-gap-4">
          <div class="tw-col-span-3">
            <p class="tw-text-label tw-font-bold">Forma de envío *</p>
            <q-select map-options :options="formaEnvioOptions" emit-value outlined v-model="datosSalida.forma_envio"
              :rules="[inputRequired]" label="Inserte" dense :disable="props.isDisabled" />
          </div>
          <div class="tw-col-span-3">
            <p class="tw-text-label tw-font-bold">Anexos *</p>
            <q-input v-model="datosSalida.anexos" dense outlined readonly filled :disable="props.isDisabled"/>
          </div>
          <div class="tw-col-span-6 tw-pb-4">
            <label class="tw-w-full">
              <span class="tw-text-label tw-font-bold">Asunto (Documento de Salida)</span>
              <span v-if="disabledAsunto" class="tw-text-label"> *</span>
              <q-input type="text" v-model="datosSalida.asunto" dense outlined readonly filled :disable="props.isDisabled"/>
            </label>
          </div>
        </div>
      </q-card>
      <q-card class="tw-rounded-xl tw-py-6 tw-px-8" flat>
        <h2 class="tw-font-bold tw-text-lg tw-mb-4">Datos del destinatario</h2>
        <div class="tw-grid tw-grid-cols-6 tw-gap-4">
          <div class="tw-col-span-3">
            <p class="tw-text-label tw-font-bold">Tipo de documento del destinatario *</p>
            <q-select map-options :options="filteredDocRemitente" outlined
              v-model="datosSalida.destinatario.tipo_documento" :rules="[inputRequired]" label="Inserte" dense
              :disable="props.isDisabled" />
          </div>
          <div class="tw-col-span-3">
            <label class="tw-w-full">
              <span class="tw-text-label tw-font-bold">Documento del destinatario</span>
              <span v-if="!disabledNumeroDoc" class="tw-text-label"> *</span>
              <q-input type="text" v-model="datosSalida.destinatario.numero_documento"
                :rules="[(v: string) => maxLengthInput(15, v), Number(datosSalida.destinatario.tipo_documento?.value) == 11 ? alphanumeric : (v: string) => onlyNumbers(v), !disabledNumeroDoc ? inputRequired : '']"
                outlined label="Inserte" dense @keypress="onlyAlphaNumeric" @blur="getPerson()"
                :disable="disabledNumeroDoc || isDisabled" />
            </label>
          </div>
          <div class="tw-col-span-3">
            <p class="tw-text-label tw-font-bold">Nombre del destinatario *</p>
            <q-input outlined v-model="datosSalida.destinatario.nombre"
              :rules="[(v: string) => lengthValidation(200, v), inputRequired]" label="Inserte" dense
              :disable="props.isDisabled" />
          </div>
          <div class="tw-col-span-3">
            <label class="tw-w-full">
              <span class="tw-text-label tw-font-bold">Dirección del destinatario</span>
              <span v-if="!disabledAsunto" class="tw-text-label"> *</span>
              <q-input outlined label="Inserte" v-model="datosSalida.destinatario.direccion" dense
                :rules="[(v: string) => maxLengthInput(200, v), !disabledAsunto ? inputRequired : true]"
                :disable="props.isDisabled" />
            </label>
          </div>
          <div class="tw-col-span-2 tw-pb-4">
            <label class="tw-w-full">
              <span class="tw-text-label tw-font-bold">País</span>
              <span v-if="!disabledAsunto" class="tw-text-label"> *</span>
              <q-select map-options :options="filteredPais" outlined v-model="datosSalida.destinatario.pais"
                label="Inserte" dense use-input fill-input hide-selected @filter="selectOptionsPais"
                :rules="!disabledAsunto ? inputRequired : []" :disable="props.isDisabled" />
            </label>
          </div>
          <div class="tw-col-span-2 tw-pb-4">
            <label class="tw-w-full">
              <span class="tw-text-label tw-font-bold">Departamento</span>
              <span v-if="!disabledAsunto" class="tw-text-label"> *</span>
              <q-select map-options :options="filteredDep" outlined v-model="datosSalida.destinatario.departamento"
                use-input fill-input hide-selected label="Inserte" dense :disable="isntColombia || props.isDisabled"
                :rules="!disabledAsunto ? inputRequired : []" @filter="selectOptionsDep" />
            </label>
          </div>
          <div class="tw-col-span-2 tw-pb-4">
            <label class="tw-w-full">
              <span class="tw-text-label tw-font-bold">Municipio</span>
              <span v-if="!disabledAsunto" class="tw-text-label"> *</span>
              <q-select map-options :options="filteredCity" outlined v-model="datosSalida.destinatario.municipio"
                label="Inserte" dense :disable="isntColombia || props.isDisabled" use-input fill-input hide-selected
                :rules="!disabledAsunto ? inputRequired : []" @filter="selectOptionsCity" />
            </label>
          </div>
          <div class="tw-col-span-3">
            <p class="tw-text-label tw-font-bold">Teléfono destinatario</p>
            <q-input outlined label="Inserte" v-model="datosSalida.destinatario.numero_celular"
              :rules="[v => maxLengthInput(10, v), v => minLengthInput(7, v)]" dense @keypress="onlyNumber"
              :disable="props.isDisabled" />
          </div>
          <div class="tw-col-span-3">
            <label class="tw-w-full">
              <span class="tw-text-label tw-font-bold">Correo electrónico destinatario</span>
              <span v-if="disabledEmail" class="tw-text-label"> *</span>
              <q-input outlined label="Inserte" v-model="datosSalida.destinatario.correo" dense
                :rules="[validationEmail, (v: string) => maxLengthInput(200, v), disabledEmail ? inputRequired : true]"
                :disable="props.isDisabled" />
            </label>
          </div>
        </div>
      </q-card>
      <q-card class="tw-rounded-xl tw-py-6 tw-px-8" flat>
        <h2 class="tw-font-bold tw-text-lg tw-mb-4">Datos del afectado</h2>
        <div class="tw-grid tw-grid-cols-4 tw-gap-4">
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-bold">Tipo de documento del afectado *</p>
            <q-select map-options :options="filteredDocRemitente" outlined
              v-model="datosSalida.afectado.tipo_documento" :rules="[inputRequired]" label="Inserte" dense
              :disable="props.isDisabled" />
          </div>
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-bold">Número de documento del afectado *</p>
            <q-input type="text" min="0" v-model="datosSalida.afectado.numero_documento"
              :rules="[Number(datosSalida.afectado.tipo_documento?.value) === 11 ? alphanumericAbsolute : v => onlyNumbers(v), inputRequired, v => maxLengthInput(15, v)]" outlined label="Inserte" dense
              @keypress="onlyAlphaNumeric" :disable="props.isDisabled" />
          </div>
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-bold">Nombre del afectado *</p>
            <q-input outlined v-model="datosSalida.afectado.nombre"
              :rules="[inputRequired, v => maxLengthInput(200, v), alphabeticalWithSpecialCharacters]" label="Inserte" dense
              @keypress="onlyAlphaNumeric" :disable="props.isDisabled" />
          </div>
        </div>
      </q-card>
      <div class="tw-flex tw-justify-center tw-gap-5">
        <q-btn label="Cancelar" color="accent" textColor="black" class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-60"
          @click="emit('cancel')" :disable="props.isDisabled" />
        <q-btn type="button" :label="'Siguiente'" color="primary" class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-60"
          @click="validateForms()" :disable="props.isDisabled" />
      </div>
    </q-form>
  </section>
</template>

<script lang="ts" setup>
import { useDepartments, useMunicipalities } from 'src/composables/useVersion';
import { toast } from 'src/helpers/toast';
import {
  inputRequired,
  maxLengthInput,
  validationEmail,
  minLengthInput,
  onlyAlphaNumeric,
  onlyNumber,
  onlyNumbers,
  alphanumeric,
  alphabeticalWithSpecialCharacters,
  alphanumericAbsolute
} from 'src/helpers/validations';
import { SelectInput } from 'src/interfaces';
import { adminAxios, sgdeaAxios } from 'src/services';
import { Ref, onMounted, ref, watch } from 'vue';
import { sortOptions } from 'src/helpers/sortOptions';
import { useAuthStore } from "src/stores/auth.store";
import { getAcronimobyId } from 'src/helpers/prefijoTipoDoc';

const optionsDepartamentos: Ref<SelectInput[]> = ref([]);
const optionsPaises = ref<SelectInput[]>([])
const optionsMunicipios: Ref<SelectInput[]> = ref([]);
const formaEnvioOptions: Ref<SelectInput[]> = ref([]);
const tipoDocOptions: Ref<SelectInput[]> = ref([]);
const step1form = ref()
const filteredDocRemitente = ref()
const filteredDoc = ref()
const filteredPais = ref()
const filteredDep = ref()
const filteredCity = ref()
const isntColombia = ref(false);
const disabledAsunto = ref(true)
const disabledNumeroDoc = ref(false)
const disabledEmail = ref(false)
const emit = defineEmits(['next-step', 'cancel'])
const isCertificado = ref();
const auth = useAuthStore();

const props = withDefaults(defineProps<{
  datosSalida: any,
  isDisabled: boolean
}>(), {})

onMounted(async () => {
  getDatosOptions()
  await userCertificado()
  await getEnvioOptions()
})

if (props.datosSalida.forma_envio === 1
  || props.datosSalida.forma_envio.value === 1
  || props.datosSalida.forma_envio === 2
  || props.datosSalida.forma_envio.value === 2) {
  disabledEmail.value = true
}

if (props.datosSalida.forma_envio === 3
  || props.datosSalida.forma_envio.value === 3
  || props.datosSalida.forma_envio === 6
  || props.datosSalida.forma_envio.value === 6) {
  disabledAsunto.value = false
}

async function getDatosOptions() {
  const municipiosResponse = await adminAxios.get('/municipios/list')
  const paisesResponse = await adminAxios.get('/paises/list')
  const departamentoResponse = await adminAxios.get('/departamentos/list')
  const tipoDocResponse = await sgdeaAxios.get("/correspondencia/comunicacion/listadoTipoIdentificacion");

  tipoDocOptions.value = tipoDocResponse.data.map((item) => { return { label: item.nombre, value: item.id } }).sort((a, b) => {
    if (a.value == 1) return -1; // "Cédula Ciudadanía" va primero
    if (b.value == 1) return 1;  // Si b es "Cédula Ciudadanía", va después

    if (a.value == 3) return -1; // "Carné Diplomático" va segundo
    if (b.value == 3) return 1;  // Si b es "Carné Diplomático", va después

    return 0;
  });
  filteredDocRemitente.value = tipoDocOptions.value
  filteredDocRemitente.value = tipoDocOptions.value.filter((e) => e.value !== 12);

  optionsMunicipios.value = municipiosResponse.data.map((item) => { return { label: item.nombre, value: item.idMunicipio } })
  filteredCity.value = optionsMunicipios.value

  optionsPaises.value = paisesResponse.data.map((item) => { return { label: item.nombre, value: item.idPais } })
  filteredPais.value = optionsPaises.value

  optionsDepartamentos.value = departamentoResponse.data.map((item) => { return { label: item.nombre, value: item.idDepartamento } })
  filteredDep.value = optionsDepartamentos.value
}

const getEnvioOptions = async () => {
  try {
    const formaEnvioResponse = await sgdeaAxios.get('/correspondencia/comunicacion/listadoFormaEnvio')
    formaEnvioOptions.value = formaEnvioResponse.data.map((item) => {
      return {
        label: item.nombre,
        value: item.id
      }
    })

    formaEnvioOptions.value = sortOptions(formaEnvioOptions.value.filter((e) => { return e.value !== 5 && e.value !== 4 }))
    if (!isCertificado.value) {
      formaEnvioOptions.value = sortOptions(formaEnvioOptions.value.filter((e) => { return e.value !== 2 }))
    }
  } catch (error) {
    console.error(error)
  }
}

const userCertificado = async () => {
  const response = await sgdeaAxios.get(`/usuarios/${auth.$state.userInfo.userid}`);
  isCertificado.value = response.data.isCertificado;
}

async function validateForms() {
  if (await step1form.value.validate()) {
    emit('next-step', props.datosSalida)
  } else {
    toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos")
  }
}

async function getPerson() {
  const tipoDoc = getAcronimobyId(Number(props.datosSalida.destinatario.tipo_documento.value || props.datosSalida.destinatario.tipo_documento))
  const number = props.datosSalida.destinatario.numero_documento ? Number(props.datosSalida.destinatario.numero_documento) : ''
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

      props.datosSalida.destinatario.nombre = fullName
      props.datosSalida.destinatario.direccion = response.data.direccion
      props.datosSalida.destinatario.numero_celular = response.data.telefono
      props.datosSalida.destinatario.correo = response.data.email
      props.datosSalida.destinatario.pais = { label: response.data.pais.nombre, value: response.data.pais.idPais }
      setTimeout(() => {
        props.datosSalida.destinatario.departamento = response.data.departamento.idDepartamento
      });
      setTimeout(() => {
        props.datosSalida.destinatario.municipio = { label: response.data.municipio.nombre, value: response.data.municipio.idMunicipio }
      });
    }
  } catch (error) {
    console.error(error)
  }
}

watch(
  () => props.datosSalida.destinatario.pais,
  async (value) => {
    const cols = props.datosSalida.destinatario.pais == 425 ? { label: "Colombia", value: 425 } : props.datosSalida.destinatario.pais
    let val = cols.label as unknown as string;
    if (value !== 425) {
      props.datosSalida.destinatario.departamento = "";
      props.datosSalida.destinatario.municipio = "";
    }
    if (val.toLowerCase() == "colombia") {
      isntColombia.value = false;
      const { optionsDepartments } = await useDepartments(cols.value);
      optionsDepartamentos.value = sortOptions(optionsDepartments.value);
    } else {
      props.datosSalida.destinatario.departamento = cols;
      props.datosSalida.destinatario.municipio = cols;
      isntColombia.value = true;
    }
  }
);

watch(
  () => props.datosSalida.destinatario.departamento,
  async (value) => {
    const { optionsMunicipalities } = await useMunicipalities(value?.value);
    optionsMunicipios.value = sortOptions(optionsMunicipalities.value);
    if (!isntColombia.value) {
      props.datosSalida.destinatario.municipio = "";
    }
  }
);

watch(
  () => props.datosSalida.destinatario.pais,
  async (value) => {
    const cols = props.datosSalida.destinatario.pais == 425 ? { label: "Colombia", value: 425 } : props.datosSalida.destinatario.pais
    const { optionsDepartments } = await useDepartments(cols.value);
    optionsDepartamentos.value = optionsDepartments.value;
  }
);

watch(() => props.datosSalida.forma_envio, (value) => {
  disabledAsunto.value = value === 3 || value === 6 || value.value === 3 || value.value === 6 ? false : true
  disabledEmail.value = value === 1 || value === 2 || value.value === 1 || value.value === 2 ? true : false
})

watch(() => props.datosSalida.destinatario.tipo_documento, (value) => {
  disabledNumeroDoc.value = value === 12 || value.value === 12 ? true : false
  if (value === 12) {
    props.datosSalida.destinatario.numero_documento = null
  }
})

const selectOptionsTipo = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      filteredDoc.value = tipoDocOptions.value;
    });
    return;
  }
  update(() => {
    filteredDoc.value = tipoDocOptions.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  });
};

const selectOptionsPais = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      filteredPais.value = optionsPaises.value;
    });
    return;
  }
  update(() => {
    filteredPais.value = optionsPaises.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  });
};

const selectOptionsDep = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      filteredDep.value = optionsDepartamentos.value;
    });
    return;
  }
  update(() => {
    filteredDep.value = optionsDepartamentos.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  });
};

const selectOptionsCity = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      filteredCity.value = optionsMunicipios.value;
    });
    return;
  }
  update(() => {
    filteredCity.value = optionsMunicipios.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  });
};

const lengthValidation = (n, val: string) => val.length <= n || "Máximo " + n + " caracteres"

</script>
