<template>
  <q-form ref="myForm0" greedy>
    <q-card class="tw-rounded-xl q-pa-lg" flat>
      <div class="col row">
        <p class="tw-text-2xl tw-font-bold">Datos del Remitente</p>
      </div>
      <div class="tw-mt-2">
        <div class="row q-col-gutter-md q-pb-md q-px-md">
          <div class="col-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Canal de radicación *</span>
              <q-select v-model="form0.canal"
                        :disable="isSelectedChannel || isCorrespondencia" :options="listadoCanalRadicacion"
                        :rules="[inputRequired]" class="tw-rounded-lg"
                        dense emit-value label="Seleccione" map-options outlined>
              </q-select>
            </label>
          </div>
          <div class="col-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Tipo de remitente</span>
              <span v-if="!disabledTipoRemitente" class="tw-text-label">*</span>
              <q-select ref="tipoRemitente" v-model="form0.tipoRemitente" :options="listadoTipoRemitente"
                        :rules="!disabledTipoRemitente ? [inputRequired] : []"
                        class="tw-rounded-lg" dense emit-value label="Seleccione" map-options
                        outlined>
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Tipo de documento del remitente *</span>
              <q-select v-model="form0.tipoDocumentoRemitente" :options="tipoDoc" :rules="[inputRequired]"
                        class="tw-rounded-lg"
                        dense emit-value label="Seleccione" map-options outlined
                        >
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Número de documento del remitente </span>
              <span v-if="!disabledNumeroDoc" class="tw-text-label">*</span>
              <q-input v-model="form0.numeroDocumentoRemitente"
                       :disable="disabledNumeroDoc ? true : false"
                       :rules="!disabledNumeroDoc ? [inputRequired, v => maxLengthInput(15, v), Number(form0.tipoDocumentoRemitente) == 11 ? alphanumeric : (v: string) => onlyNumbers(v)] : []"
                       class="tw-rounded-lg" dense
                       label="Inserte"
                       outlined
                       @keypress="Number(form0.tipoDocumentoRemitente) == 11 ? onlyAlphaNumeric : onlyNumbers"
                       @change="fillInfoRemitente">
              </q-input>
            </label>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <label class="tw-w-full">
              <span class="tw-text-label">Nombre del remitente * ({{ form0.nombreRemitente?.length }}/200)</span>
              <q-input v-model="form0.nombreRemitente"
                       :rules="[inputRequired, alphabeticalWithSpecialCharacters, v => maxLengthInput(200, v)]"
                       class="tw-rounded-lg" dense label="Inserte"
                       outlined
                       @keypress="alphabeticalWithSpecialCharacters">
              </q-input>
            </label>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <label class="tw-w-full">
              <span class="tw-text-label">País</span>
              <span v-if="Number(form0.medioAutorizadorParaRespuesta) === 2" class="tw-text-label"> *</span>
              <q-select v-model="form0.pais" :options="filteredPais" :rules="[inputRequired]" class="tw-rounded-lg"
                        dense
                        fill-input hide-selected input-debounce="0" label="Seleccione" map-options outlined use-input
                        @filter="filterPais">
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <label class="tw-w-full">
              <span class="tw-text-label">Departamento</span>
              <span v-if="Number(form0.medioAutorizadorParaRespuesta) === 2" class="tw-text-label"> *</span>
              <q-select ref="selectDep" v-model="form0.departamento" :options="departmentsOptions" :readonly="isDisable"
                        :rules="Number(form0.medioAutorizadorParaRespuesta) === 2 ? [inputRequired] : []"
                        class="tw-rounded-lg" dense fill-input hide-selected input-debounce="0" label="Seleccione"
                        map-options
                        outlined
                        use-input
                        @filter="filterDep"
              >
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <label class="tw-w-full">
              <span class="tw-text-label">Municipio</span>
              <span v-if="Number(form0.medioAutorizadorParaRespuesta) === 2" class="tw-text-label"> *</span>
              <q-select ref="selectMun" v-model="form0.municipio" :options="filteredMun"
                        :rules="Number(form0.medioAutorizadorParaRespuesta) === 2 ? [inputRequired] : []"
                        class="tw-rounded-lg" dense fill-input hide-selected input-debounce="0" label="Seleccione"
                        map-options
                        outlined
                        use-input
                        @filter="filterMun"
              >
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <label class="tw-w-full">
              <span class="tw-text-label">Dirección del remitente ({{ form0.direccionRemitente?.length }}/200)</span>
              <span v-if="!form0.correoRemitente || Number(form0.medioAutorizadorParaRespuesta) === 2"
                    class="tw-text-label"> *</span>
              <q-input ref="direccionRef" v-model="form0.direccionRemitente"
                       :rules="!form0.correoRemitente || Number(form0.medioAutorizadorParaRespuesta) === 2 ? [inputRequired, v => maxLengthInput(200, v)] : [v => maxLengthInput(200, v)]"
                       class="tw-rounded-lg" dense
                       label="Inserte"
                       outlined>
              </q-input>
            </label>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Teléfono</span>
              <q-input v-model="form0.telefono"
                       :rules="[onlyNumbers, v => maxLengthInput(10, v), v => minLengthInput(7, v)]"
                       class="tw-rounded-lg"
                       dense
                       label="Inserte" outlined>
              </q-input>
            </label>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Correo electrónico del remitente * ({{
                  (form0.correoRemitente?.length || 0)
                }}/100)</span>
              <q-input v-model="form0.correoRemitente"
                       :rules="[validationEmail, v => maxLengthInput(200, v), inputRequired]" class="tw-rounded-lg"
                       dense
                       label="Inserte"
                       outlined>
              </q-input>
            </label>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Medio que autoriza para envio de respuesta *</span>
              <q-select ref="medioSelect" v-model="form0.medioAutorizadorParaRespuesta" :options="opMediosAutoriza"
                        :rules="[inputRequired]" class="tw-rounded-lg" dense emit-value
                        input-debounce="0" label="Seleccione"
                        map-options outlined>
              </q-select>
            </label>
          </div>
        </div>
      </div>
    </q-card>
    <div class="tw-flex tw-justify-center tw-items-center tw-my-10 tw-gap-6">
      <q-btn v-if="isCorrespondencia" class="tw-rounded-xl tw-h-12 tw-p-2" color="primary" icon="chevron_left"
             label="Regresar"
             style="width: 240px" text-color="white" @click="prev()"/>
      <q-btn class="tw-rounded-xl tw-h-12" color="accent" label="Cancelar" style="width: 220px" text-color="black"
             type="reset" @click="emit('cancel')"/>
      <q-btn class="tw-rounded-xl tw-h-12 tw-p-2" color="primary" icon-right="navigate_next" label="Continuar"
             style="width: 220px"
             text-color="white" @click="validateForms"/>
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue';
import {
  alphabeticalWithSpecialCharacters,
  alphanumeric,
  inputRequired,
  maxLengthInput,
  minLengthInput,
  onlyAlphaNumeric,
  onlyNumbers,
  validationEmail
} from 'src/helpers/validations';
import {useCountries, useMunicipalities} from "src/composables/useVersion";
import {adminAxios, sgdeaAxios} from 'src/services';
import {toast} from 'src/helpers/toast';
import {sortOptions} from 'src/helpers/sortOptions';
import {getAcronimobyId} from 'src/helpers/prefijoTipoDoc';
import {useAuthStore} from "stores/auth.store";

const props = withDefaults(
  defineProps<{
    listadoCanalRadicacion: [],
    listadoTipoRemitente: [],
    tipoDoc: [],
    opMediosAutoriza: [],
    isCorrespondencia: boolean
  }>(), {})

const form0 = ref({
  canal: props.isCorrespondencia ? 2 : '',
  tipoRemitente: '',
  tipoDocumentoRemitente: '',
  numeroDocumentoRemitente: '',
  nombreRemitente: '',
  pais: '',
  departamento: '',
  municipio: '',
  direccionRemitente: '',
  telefono: '',
  correoRemitente: '',
  medioAutorizadorParaRespuesta: '',
  idSexo: 0
})

const emit = defineEmits(['cancel', 'next-step', 'prev']);
const myForm0 = ref(null);
const disabledNumeroDoc = ref(false);
const disabledTipoRemitente = ref(false);
const { optionsCountries } = useCountries();
const paiseOptions = ref();
const departamentoOptions = ref();
const municipioOptions = ref();
const isntColombia = ref(false);
const tipoRemitente = ref(null);
const direccionRef = ref();
const medioSelect = ref();
const selectDep = ref();
const selectMun = ref();
const filteredPais = ref();
const filteredDep = ref();
const filteredMun = ref();
const notChangePais = ref(true)
const notChangeDep = ref(true)
const auth = useAuthStore();
const isSelectedChannel = ref(false);
const departmentsOptions = ref([]);
const isDisable = ref(false)

onMounted(async () => {
  await loadPaises();
  await getDepartamentos(425);
  autoSelectChannel();
  //await loadDepartamentos();
  //await loadMunicipios();
})

defineExpose({
  form0
})

const autoSelectChannel = () => {
  if (auth.userInfo?.role?.toLowerCase().includes("mail")) {
    form0.value.canal = props.listadoCanalRadicacion.find(
      val => val.label.toLowerCase() === "mail")?.value;
  } else if (auth.userInfo?.role?.toLowerCase().includes("ventanilla")) {
    form0.value.canal = props.listadoCanalRadicacion.find(
      val => val.label.toLowerCase() == "ventanilla")?.value;
  } else if (auth.userInfo?.role?.toLowerCase().includes("contact center")) {
    form0.value.canal = props.listadoCanalRadicacion.find(
      val => val.label.toLowerCase() == "contact center")?.value;
  }

  if (form0.value.canal) {
    isSelectedChannel.value = true;
  }
}

async function loadPaises() {
  const {data} = await adminAxios.get("/paises/list");
  paiseOptions.value = [
    ...data.map((val: any) => {
      return {
        label: val.nombre,
        value: val.idPais,
      };
    }),
  ]
  paiseOptions.value = sortOptions(paiseOptions.value)
  form0.value.pais = paiseOptions.value.find(val => val.value === 425)
}

// deprecated
async function loadDepartamentos() {
  const {data: formData} = await adminAxios.get("/departamentos/list");
  departamentoOptions.value = formData.map((val: any) => {
    return {
      label: val.nombre,
      value: val.idDepartamento,
    };
  });
}

const prev = () => {
  emit("prev")
}

// deprecated
async function loadMunicipios() {
  const {data: formData} = await adminAxios.get("/municipios/list");
  municipioOptions.value = formData.sort((a: { nombre: string; }, b: { nombre: string; }) => {
    const labelA = a.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim();
    const labelB = b.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim();
    return labelA.localeCompare(labelB, 'es-ES', {sensitivity: 'base'});
  }).map((val) => {
    return {
      label: val.nombre,
      value: val.idMunicipio,
    };
  })
}

const getLabel = (value, options) => {
  let option = options.find(option => option.value === value);
  if (!option && value && typeof value === 'string') {
    option = {label: value}
  }
  return option ? option.label : '';
}

async function getPerson() {
  await myForm0.value.reset()
  const tipoDoc = getAcronimobyId(Number(form0.value.tipoDocumentoRemitente))

  const number = Number(form0.value.numeroDocumentoRemitente) ? Number(form0.value.numeroDocumentoRemitente) : ''

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

      form0.value.nombreRemitente = fullName
      form0.value.direccionRemitente = response.data.direccion
      form0.value.telefono = response.data.telefono
      form0.value.correoRemitente = response.data.email
      // @ts-expect-error
      form0.value.pais = {label: response.data?.pais?.nombre, value: response.data?.pais?.idPais}
      // @ts-expect-error
      form0.value.departamento = {
        label: response.data?.departamento?.nombre,
        value: response.data?.departamento?.idDepartamento
      }
      // @ts-expect-error
      form0.value.municipio = {label: response.data?.municipio?.nombre, value: response.data?.municipio?.idMunicipio}
      form0.value.idSexo = response.data.genero;
      // @ts-expect-error
      if (form0.value.pais.label !== "Colombia") {
        // @ts-expect-error
        form0.value.departamento = {label: response.data?.pais?.nombre, value: response.data?.pais?.idPais}
        // @ts-expect-error
        form0.value.municipio = {label: response.data?.pais?.nombre, value: response.data?.pais?.idPais}
      }


      notChangePais.value = false
      notChangeDep.value = false
    } else {
      if (Number(form0.value.tipoRemitente) === 1 && form0.value.tipoDocumentoRemitente !== '' && number !== '') {
        toast.error('Al seleccionar tipo de remitente "Afectado", debe tener alguna relación como afiliado a Positiva S.A.')
        resetForm()
      }
    }
  } catch (error) {
    if (Number(form0.value.tipoRemitente) === 1 && form0.value.tipoDocumentoRemitente !== '' && number !== '') {
      toast.error('Al seleccionar tipo de remitente "Afectado", debe tener alguna relación como afiliado a Positiva S.A.')
      resetForm()
    }
  }
}

const resetForm = async () => {
  form0.value.nombreRemitente = ''
  form0.value.direccionRemitente = ''
  form0.value.telefono = ''
  form0.value.correoRemitente = ''
  // @ts-expect-error
  form0.value.pais = {label: 'Colombia', value: 425}
  form0.value.departamento = ''
  form0.value.municipio = ''
  await myForm0.value.reset()
}

const fillInfoRemitente = (val) => {
  getPerson();

  if (Number(form0.value.tipoDocumentoRemitente) == 10) {
    sgdeaAxios.get(`medicina/juntas-eps-arl/numero-identificacion/${form0.value.numeroDocumentoRemitente}`)
      .then(({data}) => {
        form0.value.correoRemitente = data.correo;
        form0.value.direccionRemitente = data.direccionRemitente;
        form0.value.nombreRemitente = data.nombreRemitente;
        form0.value.telefono = data.telefono;
        form0.value.tipoDocumentoRemitente = data.tipoDocumentoRemitenteId;

        form0.value.pais = paiseOptions.value.find((pais) => pais.value == data.pais);

        setTimeout(() => {
          // @ts-ignore
          form0.value.departamento = { label: data.nombreDepartamento, value: data.departamento };
        }, 100);

        setTimeout(() => {
          // @ts-ignore
          form0.value.municipio = { label: data.nombreMunicipio, value: data.municipio };
        }, 200);
      });
  }
}

const validateForms = async () => {
  if (await myForm0.value.validate()) {
    emit("next-step", form0.value)
    if (Number(form0.value.tipoRemitente) === 1) toast.success('Los datos del remitente serán tomados como los mismos datos del afectado')
  } else {
    toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos')
  }
}

watch(() => form0.value.pais, async (value) => {
  if (notChangePais.value) {
    form0.value.departamento = ''
    form0.value.municipio = ''
    //@ts-ignore
    await getDepartamentos(value.value);

  }
  notChangePais.value = true
});

watch(() => form0.value.departamento, async (value) => {

  //@ts-ignore
  if (form0.value.pais.value !== 425) {
    //@ts-ignore
    const {optionsMunicipalities} = await getMunicipios(value.value, form0.value.pais.value);
    municipioOptions.value = sortOptions(optionsMunicipalities.value);
    notChangeDep.value = true
  }else{
      // @ts-expect-error
      const {optionsMunicipalities} = await useMunicipalities(value.value);
      municipioOptions.value = sortOptions(optionsMunicipalities.value)
      notChangeDep.value = true
  }
});

watch(() => form0.value.pais, async (value) => {
    //@ts-ignore
    await getDepartamentos(value.value);
  }
);

watch(() => form0.value.tipoDocumentoRemitente, (newValue) => {
  disabledNumeroDoc.value = Number(newValue) === 12 ? true : false
})

watch(() => form0.value.canal, (newValue) => {
  disabledTipoRemitente.value = Number(newValue) === 2 ? true : false
  if (disabledTipoRemitente.value) {
    tipoRemitente.value.resetValidation()
  }
})

watch(() => form0.value.correoRemitente, (newValue) => {
  direccionRef.value.resetValidation()
})

watch(() => form0.value.canal, (newValue) => {
  if (Number(newValue) === 2) {
    medioSelect.value.resetValidation()
  }
})

watch(() => form0.value.medioAutorizadorParaRespuesta, (newValue) => {
  if (Number(newValue) === 1) {
    selectDep.value.resetValidation()
    selectMun.value.resetValidation()
    direccionRef.value.resetValidation()
  }
})

watch(() => form0.value.tipoRemitente, (val) => {
  if (Number(val) === 1) {
    toast.warning('Al seleccionar tipo de remitente "Afectado", debe tener alguna relación como afiliado a Positiva S.A.')
  }
})

const filterPais = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredPais.value = paiseOptions.value
    })
    return
  }
  update(() => {
    filteredPais.value = paiseOptions.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const filterDep = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredDep.value = departamentoOptions.value
    })
    return
  }
  update(() => {
    filteredDep.value = departamentoOptions.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const filterMun = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredMun.value = municipioOptions.value
    })
    return
  }
  update(() => {
    filteredMun.value = municipioOptions.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const getDepartamentos = async (paisId) => {

  if (paisId == 425) {
    const response = await sgdeaAxios.get(`/geodivision/pais/${paisId}`);
    if (response.status === 200) {
      const { data } = response;
      departmentsOptions.value = data.map((departamento) => {
        return {
          value: departamento.idDepartamento,
          label: departamento.nombre,
        };
      });
    }
  }else {
    const paisEncontrado = optionsCountries.value.find(p => p.value === paisId);
    const idPositiva = paisEncontrado.idPositiva;
    const response = await sgdeaAxios.get(`/geodivision/departamento/${idPositiva}`);
    if (response.status === 200) {
      const { data } = response;
      departmentsOptions.value = data.map((departamento) => {
        return {
          value: departamento.idDepartamento,
          label: departamento.nombre,
        };
      });
    }
  }
};


const getMunicipios = async (departamentoId, paisId) => {
  const paisEncontrado = optionsCountries.value.find(p => p.value === paisId);
  const idPositiva = paisEncontrado.idPositiva;
  const response = await sgdeaAxios.get(`/geodivision/municipios/${idPositiva}?idDepartamento=${departamentoId}`);
  if (response.status === 200) {
    const { data } = response;
    municipioOptions.value = data.map((municipio) => {
      return {
        value: municipio.idMunicipio,
        label: municipio.nombre,
      };
    });
  }
};

</script>
