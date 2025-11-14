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
              <q-select :options="listadoCanalRadicacion" v-model="form0.canal" map-options emit-value
                label="Seleccione" dense outlined class="tw-rounded-lg" :rules="[inputRequired]" readonly filled>
              </q-select>
            </label>
          </div>
          <div class="col-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Tipo de remitente</span>
              <span v-if="!disabledTipoRemitente" class="tw-text-label">*</span>
              <q-select ref="tipoRemitente" :options="listadoTipoRemitente" v-model="form0.tipoRemitente" map-options
                emit-value label="Seleccione" dense outlined class="tw-rounded-lg"
                :rules="!disabledTipoRemitente ? [inputRequired] : []">
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Tipo de documento del remitente *</span>
              <q-select :options="tipoDoc" v-model="form0.tipoDocumentoRemitente" map-options emit-value
                label="Seleccione" dense outlined class="tw-rounded-lg" :rules="[inputRequired]" @blur="getPerson">
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Número de documento del remitente </span>
              <span v-if="!disabledNumeroDoc" class="tw-text-label">*</span>
              <q-input v-model="form0.numeroDocumentoRemitente" :disable="disabledNumeroDoc ? true : false" dense
                label="Inserte" outlined class="tw-rounded-lg"
                :rules="!disabledNumeroDoc ? [inputRequired, Number(form0.tipoDocumentoRemitente) == 11 ? alphanumeric : (v: string) => onlyNumbers(v), v => maxLengthInput(15, v)] : []"
                @keypress="Number(form0.tipoDocumentoRemitente) == 11 ? onlyAlphaNumeric : onlyNumbers"
                @change="getPerson">
              </q-input>
            </label>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <label class="tw-w-full">
              <span class="tw-text-label">Nombre del remitente *</span>
              <q-input v-model="form0.nombreRemitente" dense label="Inserte" outlined class="tw-rounded-lg"
                :rules="[inputRequired, alphabeticalWithSpecialCharacters, v => maxLengthInput(200, v)]"
                @keypress="alphabeticalWithSpecialCharacters">
              </q-input>
            </label>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <label class="tw-w-full">
              <span class="tw-text-label">País</span>
              <span class="tw-text-label" v-if="Number(form0.medioAutorizadorParaRespuesta) === 2"> *</span>
              <q-select map-options :options="filteredPais" v-model="form0.pais" input-debounce="0" label="Seleccione"
                dense outlined class="tw-rounded-lg" @filter="filterPais" use-input hide-selected fill-input
                :rules="[inputRequired]">
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <label class="tw-w-full">
              <span class="tw-text-label">Departamento</span>
              <span class="tw-text-label" v-if="Number(form0.medioAutorizadorParaRespuesta) === 2"> *</span>
              <q-select ref="selectDep" :options="filteredDep" v-model="form0.departamento" input-debounce="0"
                label="Seleccione" dense outlined class="tw-rounded-lg" map-options use-input hide-selected fill-input
                @filter="filterDep" :rules="Number(form0.medioAutorizadorParaRespuesta) === 2 ? [inputRequired] : []"
                :disable="isntColombia">
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <label class="tw-w-full">
              <span class="tw-text-label">Municipio</span>
              <span class="tw-text-label" v-if="Number(form0.medioAutorizadorParaRespuesta) === 2"> *</span>
              <q-select ref="selectMun" :options="filteredMun" v-model="form0.municipio" input-debounce="0"
                label="Seleccione" dense outlined class="tw-rounded-lg" map-options use-input hide-selected fill-input
                @filter="filterMun" :rules="Number(form0.medioAutorizadorParaRespuesta) === 2 ? [inputRequired] : []"
                :disable="isntColombia">
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <label class="tw-w-full">
              <span class="tw-text-label">Dirección del remitente</span>
              <span class="tw-text-label"
                v-if="!form0.correoRemitente || Number(form0.medioAutorizadorParaRespuesta) === 2"> *</span>
              <q-input ref="direccionRef" v-model="form0.direccionRemitente" dense label="Inserte" outlined
                class="tw-rounded-lg"
                :rules="!form0.correoRemitente || Number(form0.medioAutorizadorParaRespuesta) === 2 ? [inputRequired, v => maxLengthInput(200, v)] : [v => maxLengthInput(200, v)]">
              </q-input>
            </label>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Teléfono</span>
              <q-input v-model="form0.telefono"
                :rules="[onlyNumbers, v => maxLengthInput(10, v), v => minLengthInput(7, v)]" dense label="Inserte"
                outlined class="tw-rounded-lg">
              </q-input>
            </label>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Correo electrónico del remitente *</span>
              <q-input v-model="form0.correoRemitente"
                :rules="[validationEmail, v => maxLengthInput(200, v), inputRequired]" dense label="Inserte" outlined
                class="tw-rounded-lg">
              </q-input>
            </label>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Medio que autoriza para envio de respuesta</span>
              <span v-if="Number(form0.canal) !== 2" class="tw-text-label"> *</span>
              <q-select ref="medioSelect" v-model="form0.medioAutorizadorParaRespuesta" input-debounce="0"
                label="Seleccione" dense map-options emit-value outlined :options="opMediosAutoriza"
                class="tw-rounded-lg" :rules="Number(form0.canal) !== 2 ? [inputRequired] : []">
              </q-select>
            </label>
          </div>
        </div>
      </div>
    </q-card>
    <div class="tw-flex tw-justify-center tw-items-center tw-my-10 tw-gap-6">
      <q-btn label="Cancelar" type="reset" style="width: 220px" text-color="black" color="accent"
        class="tw-rounded-xl tw-h-12" @click="emit('cancel')" />
      <q-btn label="Continuar" text-color="white" icon-right="navigate_next" style="width: 220px" color="primary"
        class="tw-rounded-xl tw-h-12 tw-p-2" @click="validateForms" />
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { maxLengthInput, minLengthInput, inputRequired, validationEmail, onlyNumbers, alphanumeric, alphabeticalWithSpecialCharacters } from 'src/helpers/validations';
import { useDepartments, useMunicipalities } from "src/composables/useVersion";
import { adminAxios, sgdeaAxios } from 'src/services';
import { toast } from 'src/helpers/toast';
import { sortOptions } from 'src/helpers/sortOptions';
import { onlyAlphaNumeric } from 'src/helpers/validations';
import { getAcronimobyId } from 'src/helpers/prefijoTipoDoc';

const props = withDefaults(
  defineProps<{
    listadoCanalRadicacion: [],
    listadoTipoRemitente: [],
    tipoDoc: [],
    opMediosAutoriza: []
  }>(), {})

const form0 = ref({
  canal: '',
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
})

const emit = defineEmits(['cancel', 'next-step'])
const myForm0 = ref(null)
const disabledNumeroDoc = ref(false)
const disabledTipoRemitente = ref(false)
const paiseOptions = ref();
const departamentoOptions = ref();
const municipioOptions = ref();
const isntColombia = ref(false)
const tipoRemitente = ref(null)
const direccionRef = ref()
const medioSelect = ref()
const selectDep = ref()
const selectMun = ref()
const filteredPais = ref()
const filteredDep = ref()
const filteredMun = ref()
const notChangePais = ref(true)
const notChangeDep = ref(true)

onMounted(async () => {
  await loadPaises()
  await loadDepartamentos()
  await loadMunicipios()
  // @ts-ignore
  form0.value.canal = props.listadoCanalRadicacion.find((e) => { return e.value === 4 })
})

async function loadPaises() {
  const { data } = await adminAxios.get("/paises/list");
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

async function loadDepartamentos() {
  const { data: formData } = await adminAxios.get("/departamentos/list");
  departamentoOptions.value = formData.map((val: any) => {
    return {
      label: val.nombre,
      value: val.idDepartamento,
    };
  });
}

async function loadMunicipios() {
  const { data: formData } = await adminAxios.get("/municipios/list");
  municipioOptions.value = formData.sort((a: { nombre: string; }, b: { nombre: string; }) => {
    const labelA = a.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim();
    const labelB = b.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim();
    return labelA.localeCompare(labelB, 'es-ES', { sensitivity: 'base' });
  }).map((val) => {
    return {
      label: val.nombre,
      value: val.idMunicipio,
    };
  })
}

async function getPerson() {
  await myForm0.value.reset()
  const tipoDoc = getAcronimobyId(Number(form0.value.tipoDocumentoRemitente))
  const number = Number(form0.value.numeroDocumentoRemitente) ? Number(form0.value.numeroDocumentoRemitente) : ''

  let response;

  try {
    if (tipoDoc != 'NI') {
      response = await sgdeaAxios.get("/personas", {
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
      form0.value.pais = { label: response.data.pais.nombre, value: response.data.pais.idPais }
      // @ts-expect-error
      form0.value.departamento = { label: response.data.departamento.nombre, value: response.data.departamento.idDepartamento }
      // @ts-expect-error
      form0.value.municipio = { label: response.data.municipio.nombre, value: response.data.municipio.idMunicipio }
      notChangePais.value = false
      notChangeDep.value = false
    } else {
      await resetForm()
      if (Number(form0.value.tipoRemitente) === 1 && form0.value.tipoDocumentoRemitente !== '' && number !== '') {
        toast.error('Al seleccionar tipo de remitente "Afectado", debe tener alguna relación como afiliado a Positiva S.A.')
      }
    }
    } else {
      response = await sgdeaAxios.get(`/medicina/juntas-eps-arl/numero-identificacion/${number}`)
      if (response.status == 200 || response.status == 201){
        form0.value.nombreRemitente = response.data.nombreRemitente
        form0.value.direccionRemitente = response.data.direccionRemitente
        form0.value.telefono = response.data.telefono
        form0.value.correoRemitente = response.data.correo
        form0.value.pais = paiseOptions.value.find(val => val.label === response.data.nombrePais.toUpperCase())
        setTimeout(() => {
          form0.value.departamento = departamentoOptions.value.find(val => val.label === response.data.nombreDepartamento)
        }, 100);
        setTimeout(() => {
          form0.value.municipio = municipioOptions.value.find(val => val.label === response.data.nombreMunicipio)
        }, 200);
        notChangePais.value = false
        notChangeDep.value = false
      }
    }
  } catch (error) {
    await resetForm()
    if (Number(form0.value.tipoRemitente) === 1 && form0.value.tipoDocumentoRemitente !== '' && number !== '') {
      toast.error('Al seleccionar tipo de remitente "Afectado", debe tener alguna relación como afiliado a Positiva S.A.')
    }
  }
}

const resetForm = async () => {
  form0.value.nombreRemitente = ''
  form0.value.direccionRemitente = ''
  form0.value.telefono = ''
  form0.value.correoRemitente = ''
  // @ts-expect-error
  form0.value.pais = { label: 'Colombia', value: 425 }
  form0.value.departamento = ''
  form0.value.municipio = ''
  await myForm0.value.reset()
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
    // @ts-expect-error
    let val = value.label as unknown as string
    form0.value.departamento = ''
    form0.value.municipio = ''
    if (val.toLowerCase() == 'colombia') {
      isntColombia.value = false
      //@ts-ignore
      const { optionsDepartments } = await useDepartments(value.value);
      departamentoOptions.value = sortOptions(optionsDepartments.value);
    } else {
      form0.value.departamento = value
      form0.value.municipio = value
      isntColombia.value = true
    }
  }
  notChangePais.value = true
})

watch(() => form0.value.departamento, async (value) => {
  if (notChangeDep.value) {
    if (!isntColombia.value) {
      form0.value.municipio = ''
    }
  }
  // @ts-expect-error
  const { optionsMunicipalities } = await useMunicipalities(value.value);
  municipioOptions.value = sortOptions(optionsMunicipalities.value)

  notChangeDep.value = true
});

watch(() => form0.value.pais, async (value) => {
  //@ts-ignore
  const { optionsDepartments } = await useDepartments(value.value);
  departamentoOptions.value = optionsDepartments.value;
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

watch(() => form0.value.correoRemitente, () => {
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

</script>
