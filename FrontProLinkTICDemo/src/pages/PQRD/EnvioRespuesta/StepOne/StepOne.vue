<template>
  <section>
    <q-form ref="step1form" greedy>
      <q-card class="tw-rounded-xl tw-bg-white tw-py-6 tw-px-8" flat>
        <h2 class="tw-font-bold tw-text-lg tw-mb-4">Datos del Destinatario</h2>
        <div class="tw-grid tw-grid-cols-4 tw-gap-4">
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-semibold">Forma de Envío *</p>
            <q-select map-options :options="filteredForma" emit-value outlined
              v-model="datosSalida.destinatario.forma_envio_id" :rules="[inputRequired]" label="Inserte" dense use-input
              fill-input hide-selected @filter="selectOptionsForma" :disable="isCanalDefensor"
              :readonly="isCanalDefensor" />
          </div>
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-semibold">Tipo de Documento *</p>
            <q-select map-options :options="filteredDoc" emit-value outlined v-model="datosSalida.destinatario.tipo_documento_id"
              use-input fill-input hide-selected :rules="[inputRequired]" label="Inserte" dense
              @filter="selectOptionsTipo" :disable="isCanalDefensor" :readonly="isCanalDefensor" />
          </div>
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-semibold">Número de Documento Destinatario * ({{ datosSalida.destinatario.numero_documento ? datosSalida.destinatario.numero_documento.length : 0}}/15)</p>
            <q-input type="text" min="0" v-model="datosSalida.destinatario.numero_documento"
              :rules="[(v: string) => lengthValidation(15, v), inputRequired, Number(datosSalida.destinatario.tipo_documento_id) == 11 ? alphanumeric : (v: string) => onlyNumbers(v)]"
              outlined label="Inserte" dense :disable="isCanalDefensor" :readonly="isCanalDefensor" />
          </div>
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-semibold">Nombre del Destinatario * ({{ datosSalida.destinatario.nombre ? datosSalida.destinatario.nombre.length : 0}}/150)</p>
            <q-input outlined v-model="datosSalida.destinatario.nombre"
              :rules="[(v: string) => lengthValidation(150, v), inputRequired]" label="Inserte" dense
              :disable="isCanalDefensor" :readonly="isCanalDefensor" />
          </div>
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-semibold">Dirección Destinatario ({{ datosSalida.destinatario.direccion ? datosSalida.destinatario.direccion.length : 0}}/100)</p>
            <q-input outlined label="Inserte" v-model="datosSalida.destinatario.direccion" dense
              :rules="[(v: string) => lengthValidation(100, v), isFisicoOrCorreo() == 1 ? inputRequired : null]"
              :disable="isCanalDefensor" :readonly="isCanalDefensor" />
          </div>
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-semibold">País Destinatario</p>
            <q-select map-options :options="filteredPais" outlined v-model="datosSalida.destinatario.pais_id"
              label="Inserte" dense use-input fill-input hide-selected @filter="selectOptionsPais"
              :rules="[isFisicoOrCorreo() == 1 ? inputRequired : null]" :disable="isCanalDefensor"
              :readonly="isCanalDefensor" />
          </div>
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-semibold">Departamento Destinatario</p>
            <q-select map-options :options="filteredDep" outlined v-model="datosSalida.destinatario.departamento_id"
              use-input fill-input hide-selected label="Inserte" dense
              :rules="[isFisicoOrCorreo() == 1 ? inputRequired : null]" @filter="selectOptionsDep"
              :disable="isntColombia || isCanalDefensor" :readonly="isCanalDefensor" />
          </div>
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-semibold">Municipio Destinatario</p>
            <q-select map-options :options="filteredCity" outlined v-model="datosSalida.destinatario.municipio_id"
              label="Inserte" dense use-input fill-input hide-selected
              :rules="[isFisicoOrCorreo() == 1 ? inputRequired : null]" @filter="selectOptionsCity"
              :disable="isntColombia || isCanalDefensor" :readonly="isCanalDefensor" />
          </div>
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-semibold">Teléfono Destinatario ({{ datosSalida.destinatario.numero_celular ? datosSalida.destinatario.numero_celular.length : 0}}/10)</p>
            <q-input outlined label="Inserte" v-model="datosSalida.destinatario.numero_celular"
              :rules="[mobilePhonNumber]" dense @keypress="onlyNumber" :disable="isCanalDefensor"
              :readonly="isCanalDefensor" />
          </div>
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-semibold">Correo Electrónico ({{ datosSalida.destinatario.correo ? datosSalida.destinatario.correo.length : 0}}/100)</p>
            <q-input outlined label="Inserte" v-model="datosSalida.destinatario.correo" dense
              :rules="[(v: string) => lengthValidation(200, v), isFisicoOrCorreo() == 2 ? inputRequired : null]" :disable="isCanalDefensor" :readonly="isCanalDefensor" />
          </div>
        </div>
      </q-card>
      <div class="tw-flex tw-justify-center tw-gap-5 tw-mt-5">
        <q-btn label="Cancelar" :disable="isAprobador" color="accent" textColor="black" class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-60"
          @click="emit('cancel')" />
        <q-btn type="button" :label="'Siguiente'" color="primary" class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-60"
          @click="validateForms()" />
      </div>
    </q-form>
  </section>
</template>

<script lang="ts" setup>
import { useDepartments, useMunicipalities } from 'src/composables/useVersion';
import { inputRequired, alphanumeric, onlyNumbers } from 'src/helpers/validations';
import { SelectInput } from 'src/interfaces';
import { adminAxios, sgdeaAxios } from 'src/services';
import { useAuthStore } from 'src/stores/auth.store';
import { Ref, computed, onMounted, ref, watch } from 'vue';

const { getUserInfo } = useAuthStore()

const auth = useAuthStore();
const isAprobador = auth.userInfo.role.toLowerCase().includes('aprobador');
const optionsDepartamentos: Ref<SelectInput[]> = ref([]);
const optionsPaises = ref<SelectInput[]>([])
const optionsMunicipios: Ref<SelectInput[]> = ref([]);
const formaEnvioOptions: Ref<SelectInput[]> = ref([]);
const tipoDocOptions: Ref<SelectInput[]> = ref([]);
const step1form = ref()
const filteredForma = ref()
const filteredDoc = ref()
const filteredPais = ref()
const filteredDep = ref()
const filteredCity = ref()
const isntColombia = ref(false);

const props = withDefaults(defineProps<{
  datosSalida: any;
  estado: string;
  remitente: any;
  pqrdData: any;
}>(), {})

onMounted(async () => {
  getDatosOptions()
})

function isFisicoOrCorreo() {
  if (props.datosSalida.destinatario.forma_envio_id == 3 || props.datosSalida.destinatario.forma_envio_id == 4) {
    return 1
  } else {
    return 2
  }
}

const isCanalDefensor = computed(() => {
  return ["defensor"].some(keyword => props.pqrdData.canalRadicacion.nombre.toLowerCase().includes(keyword))
})

const emit = defineEmits(['next-step', 'cancel'])

async function getDatosOptions() {
  const formaEnvioResponse = await sgdeaAxios.get('/correspondencia/comunicacion/listadoFormaEnvio')
  const municipiosResponse = await adminAxios.get('/municipios/list')
  const paisesResponse = await adminAxios.get('/paises/list')
  const departamentoResponse = await adminAxios.get('/departamentos/list')
  const tipoDocResponse = await sgdeaAxios.get("/correspondencia/comunicacion/listadoTipoIdentificacion");

  tipoDocOptions.value = tipoDocResponse.data.map((item) => { return { label: item.nombre, value: item.id } })
  filteredDoc.value = tipoDocOptions.value
  optionsMunicipios.value = municipiosResponse.data.map((item) => { return { label: item.nombre, value: item.idMunicipio } })
  filteredCity.value = optionsMunicipios.value
  formaEnvioOptions.value = formaEnvioResponse.data.map((item) => { return { label: item.nombre, value: item.id } })
  formaEnvioOptions.value = formaEnvioOptions.value.filter((e) => { return e.value !== 6 })
  filteredForma.value = formaEnvioOptions.value
  optionsPaises.value = paisesResponse.data.map((item) => { return { label: item.nombre, value: item.idPais } })
  filteredPais.value = optionsPaises.value
  optionsDepartamentos.value = departamentoResponse.data.map((item) => { return { label: item.nombre, value: item.idDepartamento } })
  filteredDep.value = optionsDepartamentos.value
}

async function validateForms() {
  if (await step1form.value.validate()) {
    emit('next-step')
  }
}

watch(
  () => props.datosSalida.destinatario.pais_id,
  async (value) => {
    const cols = props.datosSalida.destinatario.pais_id == 425 ? { label: "Colombia", value: 425 } : props.datosSalida.destinatario.pais_id
    let val = cols.label as unknown as string;
    if (value !== 425) {
      props.datosSalida.destinatario.departamento_id = "";
      props.datosSalida.destinatario.municipio_id = "";
    }
    if (val.toLowerCase() == "colombia") {
      isntColombia.value = false;
      const { optionsDepartments } = await useDepartments(cols.value);
      optionsDepartamentos.value = sortOptions(optionsDepartments.value);
    } else {
      props.datosSalida.destinatario.departamento_id = cols;
      props.datosSalida.destinatario.municipio_id = cols;
      isntColombia.value = true;
    }
  }
);

watch(
  () => props.datosSalida.destinatario.departamento_id,
  async (value) => {
    const { optionsMunicipalities } = await useMunicipalities(value?.value);
    optionsMunicipios.value = sortOptions(optionsMunicipalities.value);
    if (!isntColombia.value) {
      props.datosSalida.destinatario.municipio_id = "";
    }
  }
);

watch(
  () => props.datosSalida.destinatario.pais_id,
  async (value) => {
    const cols = props.datosSalida.destinatario.pais_id == 425 ? { label: "Colombia", value: 425 } : props.datosSalida.destinatario.pais_id
    const { optionsDepartments } = await useDepartments(cols.value);
    optionsDepartamentos.value = optionsDepartments.value;
  }
);

const sortOptions = (vals: any[]) => {
  return vals.sort(
    (leftItem: { label: string }, rightItem: { label: string }) => {
      const nombreA = leftItem.label.toLowerCase().trim();
      const nombreB = rightItem.label.toLowerCase().trim();

      if (nombreA < nombreB) {
        return -1;
      }

      if (nombreA > nombreB) {
        return 1;
      }

      return 0;
    }
  )
}

const selectOptionsForma = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      filteredForma.value = formaEnvioOptions.value;
    });
    return;
  }
  update(() => {
    filteredForma.value = formaEnvioOptions.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  });
};

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

const mobilePhonNumber = (val: any) => {
  const expresionRegular = /^(30|31|32|35)[0-9]{8}$/;
  if (val) {
    if (val.length == 12 && !expresionRegular.test(val)) {
      return "Ingrese un número de teléfono válido, debe contener el indicativo al principio (30)";
    } else if (!expresionRegular.test(val)) {
      return "El número de teléfono celular debe contener máximo 10 dígitos";
    }
  }
};

function onlyNumber(event: { keyCode: any; which: any; preventDefault: () => void; }) {
  let keyCode = event.keyCode ? event.keyCode : event.which;
  if ((keyCode >= 48 && keyCode <= 57)) {
    return true;
  }
  event.preventDefault();
  return false;
}

setTimeout(() => {
if (isCanalDefensor.value) {
    props.datosSalida.destinatario.forma_envio_id = 1
  }
}, 800);
</script>
