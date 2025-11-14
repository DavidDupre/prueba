<template>
  <q-form ref="myForm1" greedy>
    <q-card class="tw-rounded-xl q-pa-lg" flat>
      <div class="col row">
        <p class="tw-text-2xl tw-font-bold">Datos del afectado</p>
      </div>
      <div class="tw-mt-2">
        <div class="row q-col-gutter-md q-pb-md q-px-md">
          <div v-if="Number(props.firstForm.tipoRemitente) == 1"
            class="flex tw-items-center col-xs-12 col-sm-12 col-md-12 col-lg-12 tw-text-label">
            <q-checkbox v-model="checkDatosRemitente" />
            <p class="tw-mt-1">El afectado es el mismo remitente</p>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Tipo de documento del afectado *</span>
              <q-select v-model="form1.tipoDocumentoAfectado" label="Seleccione" map-options emit-value dense outlined
                class="tw-rounded-lg" :options="tipoDocumento" :rules="[inputRequired]" @blur="getPerson">
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Número de documento del afectado *</span>
              <q-input v-model="form1.numeroDocumentoAfectado" dense label="Inserte" outlined class="tw-rounded-lg"
                :rules="[inputRequired, v => maxLengthInput(15, v), Number(form1.tipoDocumentoAfectado) == 11 ? alphanumeric : (v: string) => onlyNumbers(v)]"
                @keypress="Number(form1.tipoDocumentoAfectado) == 11 ? onlyAlphaNumeric : onlyNumbers"
                @change="getPerson">
              </q-input>
            </label>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <label class="tw-w-full">
              <span class="tw-text-label">Nombre del afectado *</span>
              <q-input v-model="form1.nombreAfectado" dense label="Inserte" outlined class="tw-rounded-lg"
                :rules="[inputRequired, v => maxLengthInput(200, v), alphabeticalWithSpecialCharacters]"
                @keypress="alphabeticalWithSpecialCharacters">
              </q-input>
            </label>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <label class="tw-w-full">
              <span class="tw-text-label">País *</span>
              <q-select v-model="form1.paisAfectado" use-input hide-selected fill-input :options="filteredPais"
                label="Seleccione" dense outlined class="tw-rounded-lg" :rules="[inputRequired]" @filter="filterPais">
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <label class="tw-w-full">
              <span class="tw-text-label">Departamento *</span>
              <q-select :options="filteredDep" use-input hide-selected fill-input v-model="form1.departamentoAfectado"
                input-debounce="0" label="Seleccione" dense outlined class="tw-rounded-lg" map-options
                :rules="[inputRequired]" @filter="filterDep" :disable="isntColombia" @update:model-value="changeDep">
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <label class="tw-w-full">
              <span class="tw-text-label">Municipio *</span>
              <q-select v-model="form1.municipioAfectado" map-options use-input hide-selected fill-input
                :disable="isntColombia" label="Seleccione" dense outlined class="tw-rounded-lg" :options="filteredMun"
                :rules="[inputRequired]" @filter="filterMun">
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <label class="tw-w-full">
              <span class="tw-text-label">Dirección del Afectado *</span>
              <q-input v-model="form1.direccionAfectado" dense label="Inserte" outlined class="tw-rounded-lg"
                :rules="[inputRequired, v => maxLengthInput(200, v)]">
              </q-input>
            </label>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Teléfono</span>
              <q-input v-model="form1.telefonoAfectado" dense label="Inserte" outlined class="tw-rounded-lg"
                :rules="[onlyNumbers, v => maxLengthInput(10, v), v => minLengthInput(7, v)]">
              </q-input>
            </label>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Correo electrónico del Afectado *</span>
              <q-input v-model="form1.correoAfectado" dense label="Inserte" outlined class="tw-rounded-lg"
                :rules="[inputRequired, v => maxLengthInput(200, v), validationEmail]">
              </q-input>
            </label>
          </div>
        </div>
      </div>
    </q-card>
    <div class="tw-flex tw-justify-center tw-items-center tw-my-10 tw-gap-6">
      <q-btn label="Regresar" text-color="white" icon="chevron_left" style="width: 220px" color="primary"
        class="tw-rounded-xl tw-h-12 tw-p-2" @click="emit('prev-step')">
      </q-btn>
      <q-btn label="Cancelar" type="reset" style="width: 220px" text-color="black" color="accent"
        class="tw-rounded-xl tw-h-12" @click="emit('cancel')" />
      <q-btn label="Continuar" text-color="white" icon-right="navigate_next" style="width: 220px" color="primary"
        class="tw-rounded-xl tw-h-12 tw-p-2" @click="validateForms" />
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import {
  inputRequired,
  maxLengthInput,
  onlyNumbers,
  alphanumeric,
  minLengthInput,
  validationEmail,
  alphabeticalWithSpecialCharacters
} from "src/helpers/validations";
import { useDepartments, useMunicipalities } from "src/composables/useVersion";
import { adminAxios, sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { onlyAlphaNumeric } from "src/helpers/validations";
import { sortOptions } from "src/helpers/sortOptions";
import { getAcronimobyId } from "src/helpers/prefijoTipoDoc";

type FormDataType1 = {
  tipoDocumentoAfectado: string;
  numeroDocumentoAfectado: string;
  nombreAfectado: string;
  paisAfectado: any;
  departamentoAfectado: any;
  municipioAfectado: any;
  direccionAfectado: string;
  telefonoAfectado: string;
  correoAfectado: string;
};

const form1 = ref<FormDataType1>({
  tipoDocumentoAfectado: "",
  numeroDocumentoAfectado: "",
  nombreAfectado: "",
  direccionAfectado: "",
  telefonoAfectado: "",
  correoAfectado: "",
  paisAfectado: '',
  departamentoAfectado: '',
  municipioAfectado: '',
})

const props = withDefaults(
  defineProps<{
    firstForm: {
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
    },
    tipoDoc: []
  }>(), {}
)

const emit = defineEmits(['cancel', 'next-step', 'prev-step'])
const myForm1 = ref(null)
const checkDatosRemitente = ref(false)
const paiseOptions = ref();
const departamentoAfectadoOptions = ref();
const municipioAfectadoOptions = ref();
const isntColombia = ref(false)
const filteredPais = ref()
const filteredDep = ref()
const filteredMun = ref()
const tipoDocumento = props.tipoDoc.filter((e) => {
  // @ts-expect-error
  return e.value !== 12;
});
let isDepartmentModified = false;
const notChangePais = ref(true)
const notChangeDep = ref(true)

onMounted(async () => {
  await loadPaises();
  await loadDepartamentos();
  await loadMunicipios();
});

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
  form1.value.paisAfectado = paiseOptions.value.find(val => val.value === 425)
}

async function loadDepartamentos() {
  const { data: formData } = await adminAxios.get("/departamentos/list");
  departamentoAfectadoOptions.value = formData.map((val: any) => {
    return {
      label: val.nombre,
      value: val.idDepartamento,
    };
  });
}

async function loadMunicipios() {
  const { data: formData } = await adminAxios.get("/municipios/list");
  municipioAfectadoOptions.value = formData.sort((a: { nombre: string; }, b: { nombre: string; }) => {
    const labelA = a.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim();
    const labelB = b.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim();
    return labelA.localeCompare(labelB, 'es-ES', { sensitivity: 'base' });
  }).map((val) => {
    return {
      label: val.nombre,
      value: val.id,
    };
  })
}

async function getPerson() {
  await myForm1.value.reset()
  const tipoDoc = getAcronimobyId(Number(form1.value.tipoDocumentoAfectado))
  const number = Number(form1.value.numeroDocumentoAfectado) ? Number(form1.value.numeroDocumentoAfectado) : ''

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

      form1.value.nombreAfectado = fullName
      form1.value.direccionAfectado = response.data.direccion
      form1.value.telefonoAfectado = response.data.telefono
      form1.value.correoAfectado = response.data.email
      form1.value.paisAfectado = { label: response.data.pais.nombre, value: response.data.pais.idPais }
      form1.value.departamentoAfectado = { label: response.data.departamento.nombre, value: response.data.departamento.idDepartamento }
      form1.value.municipioAfectado = { label: response.data.municipio.nombre, value: response.data.municipio.idMunicipio }
      notChangePais.value = false
      notChangeDep.value = false
    } else {
      await resetForm()
      if (form1.value.tipoDocumentoAfectado !== '' && number !== '') {
        toast.error('Al seleccionar tipo de remitente "Afectado", debe tener alguna relación como afiliado a Positiva S.A.')
      }
    }
  } catch (error) {
    await resetForm()
    if (form1.value.tipoDocumentoAfectado !== '' && number !== '') {
      toast.error('Al seleccionar tipo de remitente "Afectado", debe tener alguna relación como afiliado a Positiva S.A.')
    }
  }
}

const resetForm = async () => {
  form1.value.nombreAfectado = ''
  form1.value.direccionAfectado = ''
  form1.value.telefonoAfectado = ''
  form1.value.correoAfectado = ''
  form1.value.paisAfectado = { label: 'Colombia', value: 425 }
  form1.value.departamentoAfectado = ''
  form1.value.municipioAfectado = ''
  await myForm1.value.reset();
};

setTimeout(() => {
  checkDatosRemitente.value = Number(props.firstForm.tipoRemitente) == 1 ? true : false;
}, 800);

watch(() => props.firstForm.tipoRemitente, (val) => {
  checkDatosRemitente.value = false
  if (Number(val) === 1) {
    checkDatosRemitente.value = true
  }
})

watch(() => checkDatosRemitente.value, (val) => {
  if (!val) {
    isDepartmentModified = false
  }
  if (val) {
    form1.value = {
      tipoDocumentoAfectado: props.firstForm.tipoDocumentoRemitente,
      numeroDocumentoAfectado: props.firstForm.numeroDocumentoRemitente,
      nombreAfectado: props.firstForm.nombreRemitente,
      direccionAfectado: props.firstForm.direccionRemitente,
      telefonoAfectado: props.firstForm.telefono,
      correoAfectado: props.firstForm.correoRemitente,
      paisAfectado: props.firstForm.pais,
      departamentoAfectado: props.firstForm.departamento,
      municipioAfectado: props.firstForm.municipio,
    }
  } else {
    form1.value = {
      tipoDocumentoAfectado: "",
      numeroDocumentoAfectado: "",
      nombreAfectado: "",
      direccionAfectado: "",
      telefonoAfectado: "",
      correoAfectado: "",
      paisAfectado: { label: "Colombia", value: 425 },
      departamentoAfectado: '',
      municipioAfectado: '',
    };
  }
});

const validateForms = async () => {
  if (await myForm1.value.validate()) {
    emit("next-step", form1.value);
  } else {
    toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos')
  }
};

watch(() => form1.value.paisAfectado, async (value) => {
  let val = value.label as unknown as string
  if (notChangePais.value) {
    if (!isntColombia.value && !checkDatosRemitente.value) {
      form1.value.departamentoAfectado = ''
      form1.value.municipioAfectado = ''
    } else if (isntColombia.value) {
      form1.value.departamentoAfectado = ''
      form1.value.municipioAfectado = ''
    }
    if (val.toLowerCase() == 'colombia') {
      isntColombia.value = false
      //@ts-ignore
      const { optionsDepartments } = await useDepartments(value.value);
      departamentoAfectadoOptions.value = sortOptions(optionsDepartments.value);
    } else {
      form1.value.departamentoAfectado = value
      form1.value.municipioAfectado = value
      isntColombia.value = true
    }
  }
  notChangePais.value = true
});

const changeDep = async (value) => {
  isDepartmentModified = true
  if (isDepartmentModified && !checkDatosRemitente.value) {
    form1.value.municipioAfectado = ''
  }

  if (checkDatosRemitente.value) {
    if (notChangeDep.value) {
      if (isDepartmentModified && !isntColombia.value) {
        form1.value.municipioAfectado = ''
      }
      isDepartmentModified = true;
    }
  }

  const { optionsMunicipalities } = await useMunicipalities(value.value);
  municipioAfectadoOptions.value = sortOptions(optionsMunicipalities.value)

  notChangeDep.value = true
}

watch(() => form1.value.paisAfectado, async (value) => {
  //@ts-ignore
  const { optionsDepartments } = await useDepartments(value.value);
  departamentoAfectadoOptions.value = optionsDepartments.value;
}
);

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
      filteredDep.value = departamentoAfectadoOptions.value
    })
    return
  }
  update(() => {
    filteredDep.value = departamentoAfectadoOptions.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const filterMun = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredMun.value = municipioAfectadoOptions.value
    })
    return
  }
  update(() => {
    filteredMun.value = municipioAfectadoOptions.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};
</script>
