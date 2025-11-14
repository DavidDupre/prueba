<template>
  <section class="tw-flex tw-flex-row tw-bg-bg">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
      <div class="tw-pt-4">
        <router-link to="/juntas-eps-arl">
          <q-btn flat color="primary" label="Volver" icon="chevron_left" />
        </router-link>
      </div>

      <div class="tw-flex tw-justify-between tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold">Crear Juntas Eps y Arl</h1>
      </div>

      <q-form ref="formValidate" greedy>
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>

          <div class="col row">
            <p class="tw-text-2xl tw-font-bold">
              Remitente
            </p>
          </div>
          <div class="tw-mt-2">
            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <label class="tw-w-full">
                  <span class="tw-text-label">Tipo de documento del remitente *</span>
                  <q-select :options="tipoDoc" v-model="form.tipoDocumentoRemitente"
                    label="Seleccione" dense outlined class="tw-rounded-lg" :rules="[inputRequired]">
                  </q-select>
                </label>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <label class="tw-w-full">
                  <span class="tw-text-label">Número de documento del remitente *</span>
                  <q-input v-model="form.numeroDocumentoRemitente" dense label="Inserte" outlined class="tw-rounded-lg"
                    :rules="[inputRequired, onlyNumbers, v => maxLengthInput(15, v)]">
                  </q-input>
                </label>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <label class="tw-w-full">
                  <span class="tw-text-label">Nombres del remitente *</span>
                  <q-input v-model="form.nombreRemitente" dense label="Inserte" outlined class="tw-rounded-lg"
                    :rules="[inputRequired, alphabeticalWithSpecialCharacters, v => maxLengthInput(200, v)]"
                    @keypress="alphabeticalWithSpecialCharacters">
                  </q-input>
                </label>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <span class="tw-w-full">
                  <label class="tw-text-label">País *</label>
                  <q-select :rules="[v => inputRequired(v.label)]" v-model="form.pais" name="pais" label="Seleccione"
                    dense outlined map-options emit-value class="tw-rounded-lg" :options="optionsPaises" disable />
                </span>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <span class="tw-w-full">
                  <label class="tw-text-label">Departamento *</label>
                  <q-select v-model="form.departamento" name="departamento" label="Seleccione" dense outlined
                    class="tw-rounded-lg" :rules="[v => inputRequired(v.label)]" :options="optionsDepartamentos"
                    :disable="isntColombia">
                  </q-select>
                </span>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <span class="tw-w-full">
                  <label class="tw-text-label">Municipio *</label>
                  <q-select v-model="form.municipio" label="Seleccione" dense outlined class="tw-rounded-lg"
                    :rules="[v => inputRequired(v.label)]" :options="optionsMunicipios" :disable="isntColombia">
                  </q-select>
                </span>
              </div>

              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <span class="tw-w-full">
                  <label class="tw-text-label">Dirección del Remitente</label>
                  <q-input v-model="form.direccionRemitente" dense outlined label="Ingrese" class="tw-rounded-lg"
                    :rules="[(v) => maxLengthInput(200, v)]" />
                </span>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <label class="tw-w-full">
                  <span class="tw-text-label">Teléfono</span>
                  <q-input v-model="form.telefono"
                    :rules="[onlyNumbers, v => maxLengthInput(10, v), v => minLengthInput(7, v)]" dense label="Inserte"
                    outlined class="tw-rounded-lg">
                  </q-input>
                </label>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <label class="tw-w-full">
                  <span class="tw-text-label">Correo electrónico del remitente *</span>
                  <q-input v-model="form.correoRemitente"
                    :rules="[validationEmail, v => maxLengthInput(200, v), inputRequired]" dense label="Inserte" outlined
                    class="tw-rounded-lg">
                  </q-input>
                </label>
              </div>

              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <span class="tw-w-full">
                  <label class="tw-text-label">Estado</label>
                  <q-toggle v-model="form.estado" color="primary" />
                </span>
              </div>
            </div>
          </div>
        </q-card>

        <div class="col row justify-center q-gutter-x-md q-my-md">
          <q-btn color="accent" textColor="secondary" label="Cancelar"
            style="width: 130px;height: 40px;border-radius: 8px;font-size: 16px;" no-caps
            @click="router.push('/juntas-eps-arl')" />

          <q-btn color="primary" label="Crear" style="width: 130px;height: 40px;border-radius: 8px;font-size: 16px;"
            @click="handleSubmit" />
        </div>
      </q-form>
    </main>
  </section>
</template>
<script lang="ts" setup>
import { inputRequired, maxLengthInput, homePhoneNumber, mobilePhonNumber, onlyNumbers, phoneFormat, validationEmail, alphabeticalWithSpecialCharacters, minLengthInput } from 'src/helpers/validations';
import { useDepartments, useMunicipalities } from "src/composables/useVersion";
import { adminAxios, sgdeaAxios } from 'src/services';
import { SelectInput } from 'src/interfaces';
import { ref, onMounted, watch } from 'vue';
import { toast } from 'src/helpers/toast';
import { useRouter } from 'vue-router';

const router = useRouter();
const formValidate = ref();
const form = ref({
  tipoDocumentoRemitente: { label:'', value: ''},
  departamento: { label: '', value: '' },
  municipio: { label: '', value: '' },
  numeroDocumentoRemitente: '',
  direccionRemitente: '',
  nombreRemitente: '',
  correoRemitente:'',
  pais: "Colombia",
  estado: false,
  telefono:'',
});
const optionsPaises = ref<SelectInput[]>([]);
const optionsDepartamentos = ref<SelectInput[]>([]);
const optionsMunicipios = ref<SelectInput[]>([]);
const isntColombia = ref<boolean>(false);
const tipoDoc = ref([]);

const sortOptions = (vals) => {
  return vals.sort((leftItem, rightItem) => {
    const nombreA = leftItem.label.toLowerCase().trim();
    const nombreB = rightItem.label.toLowerCase().trim();

    if (nombreA < nombreB) return -1;
    if (nombreA > nombreB) return 1;
    return 0;
  });
}


const getData = async () => {
  const { data: dptos } = await adminAxios.get("/departamentos/list/425");
  const { data: formData } = await adminAxios.get("/municipios/list");
  const { data: paisesData } = await adminAxios.get("/paises/list");

  optionsDepartamentos.value = sortOptions(dptos.map((item) => {
    return ({
      label: item.nombre,
      value: item.idDepartamento,
    })
  }));

  const sortedMunicipios = formData.sort((leftMunicipio, rightMunicipio) => {
    const nombreA = leftMunicipio.nombre.toLowerCase().trim();
    const nombreB = rightMunicipio.nombre.toLowerCase().trim();

    if (nombreA < nombreB) {
      return -1;
    }

    if (nombreA > nombreB) {
      return 1;
    }

    return 0;
  });

  optionsMunicipios.value = sortedMunicipios.map(({ nombre }) => {
    return {
      label: nombre,
      value: nombre
    };
  });

  const sortedPaises = paisesData.sort((leftMunicipio, rightMunicipio) => {
    const nombreA = leftMunicipio.nombre.toLowerCase().trim();
    const nombreB = rightMunicipio.nombre.toLowerCase().trim();

    if (nombreA < nombreB) {
      return -1;
    }

    if (nombreA > nombreB) {
      return 1;
    }

    return 0;
  });

  optionsPaises.value = sortedPaises.map(({ nombre }) => {
    return {
      label: nombre,
      value: nombre
    }
  });
};

const handleSubmit = async () => {
  if (!(await formValidate.value.validate())) {
    toast.error('Diligencie los campos obligatorios.');
    return;
  }

  try {
    const response = await sgdeaAxios.post('/medicina/juntas-eps-arl', {
      tipoDocumentoRemitenteId: form.value.tipoDocumentoRemitente.value,
      tipoDocumentoRemitente: form.value.tipoDocumentoRemitente.label,
      numeroDocumento: form.value.numeroDocumentoRemitente,
      nombreRemitente: form.value.nombreRemitente,
      direccionRemitente: form.value.direccionRemitente,
      pais: 425,
      departamento: form.value.departamento.value,
      municipio: form.value.municipio.value,
      telefono: form.value.telefono,
      correo: form.value.correoRemitente,
      estado: form.value.estado,
    })

    if (response.status === 200) {
      toast.success('Junta Eps y Arl creada exitosamente.');
      router.push('/juntas-eps-arl');
    }
  } catch (error) {
    toast.error(error.response.status === 409 ? `${error.response.data.message}` : 'Ocurrió un problema con la operación.')
  }
};

function loadTipoDoc() {
  sgdeaAxios.get("/correspondencia/comunicacion/listadoTipoIdentificacion").then(({data})=>{
    tipoDoc.value = data.map((val: any) => {
      return {
        label: val.nombre,
        value: val.id,
      };
    }).filter((item) => item.label !== 'Ninguno')
    tipoDoc.value = sortOptions(tipoDoc.value).sort((a, b) => {
      if (a.value == 1) return -1; // "Cédula Ciudadanía" va primero
      if (b.value == 1) return 1;  // Si b es "Cédula Ciudadanía", va después

      if (a.value == 3) return -1; // "Carné Diplomático" va segundo
      if (b.value == 3) return 1;  // Si b es "Carné Diplomático", va después

      return 0;
    });
  })
}

onMounted(() => {
  getData();
  loadTipoDoc();
});

watch(
  () => form.value.pais,
  async (value) => {
    let val = value as unknown as string
    form.value.departamento.label = ''
    form.value.municipio.label = ''
    if (val.toLowerCase() == 'colombia') {
      isntColombia.value = false
      // @ts-ignore
      const { optionsDepartments } = await useDepartments(value.value);
      optionsDepartamentos.value = sortOptions(optionsDepartments.value);

    } else {
      // @ts-ignore
      form.value.departamento = { label: val, value: value }
      // @ts-ignore
      form.value.municipio = { label: val, value: value }
      isntColombia.value = true
    }

  }
);

watch(
  () => form.value.departamento,
  async (value) => {
    // @ts-ignore
    if (!isntColombia.value) {
      form.value.municipio.label = ''
    }

    // @ts-ignore
    const { optionsMunicipalities } = await useMunicipalities(value.value);
    optionsMunicipios.value = sortOptions(optionsMunicipalities.value)
  }
);
</script>
