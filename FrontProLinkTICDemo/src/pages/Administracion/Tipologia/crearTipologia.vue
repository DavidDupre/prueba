<template>
  <div class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
    <div class="tw-flex tw-justify-between tw-pt-4">
      <h1 class="tw-text-3xl tw-font-bold">Creación de Tipologías</h1>
    </div>

    <q-form greedy ref="myForm">
      <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
        <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
          <div class="tw-col-span-3">
            <p class="tw-text-label tw-font-semibold">Dependencia</p>
            <q-select :options="listadoDependencias" :rules="[inputRequired]" map-options outlined
              v-model="formData.dependencia" label="Inserte" dense use-input fill-input hide-selected />
          </div>
          <div class="tw-col-span-3">
            <p class="tw-text-label tw-font-semibold">Series *</p>
            <q-select :options="filteredSeries" map-options emit-value outlined v-model="formData.series"
              label="Inserte" :rules="[inputRequired]" dense @filter="filterSeries" use-input fill-input hide-selected>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="tw-col-span-3 tw-mt-4">
            <p class="tw-text-label tw-font-semibold">Subseries *</p>
            <q-select :options="filteredSubSeries" map-options emit-value outlined v-model="formData.subSeries"
              label="Inserte" :rules="[filteredSubSeries.length ? inputRequired : () => true]" :disable="!isSubSeries"
              dense @filter="filterSubSeries" use-input fill-input hide-selected>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="tw-col-span-3 tw-mt-4">
            <p class="tw-text-label tw-font-semibold">Tipo Documental *</p>
            <q-input v-model="formData.tipoDocumental" :rules="[inputRequired]" label="Inserte" dense outlined
              class="tw-rounded-lg" />
          </div>
          <div class="tw-col-span-3 tw-mt-4">
            <p class="tw-text-label tw-font-semibold">Cierre Automatico *</p>
            <q-select :options="booleanOptions" map-options emit-value outlined v-model="formData.cierreAutomatico"
              label="Inserte" :rules="[inputRequired]" :disable="!isSubSeries" dense use-input fill-input hide-selected>
            </q-select>
          </div>
        </div>
      </q-card>
    </q-form>

    <div class="col row justify-center q-gutter-x-md q-my-md">
      <q-btn color="accent" textColor="secondary" label="Cancelar"
        style="width: 130px;height: 40px;border-radius: 8px;font-size: 16px;" no-caps @click="router.push('/')" />
      <q-btn color="primary" label="Guardar" style="width: 130px;height: 40px;border-radius: 8px;font-size: 16px;"
        @click="handleSubmit" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref, watch } from "vue";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { SelectInput } from "src/interfaces";
import { inputRequired } from "src/helpers/validations";
import { useRouter } from 'vue-router';

const formData = ref({
  dependencia: "",
  series: "",
  subSeries: "",
  tipoDocumental: "",
  cierreAutomatico: null,
});

const router = useRouter();
const myForm = ref<any>(null);
const listadoDependencias = ref();
const listadoSeries: Ref<SelectInput[]> = ref([]);
const filteredSeries: Ref<SelectInput[]> = ref([]);
const listadoSubSeries: Ref<SelectInput[]> = ref([]);
const filteredSubSeries: Ref<SelectInput[]> = ref([]);
const isSubSeries = ref(false);
const booleanOptions = ref([
  { label: "Sí", value: true },
  { label: "No", value: false },
]);

onMounted(async () => {
  await loadDependencias();
});


const loadDependencias = async () => {
  try {
    const response = await sgdeaAxios.get(`/seccionSubSeccion`);
    listadoDependencias.value = response.data.map((e) => {
      return {
        label: e.nombre,
        value: e.idSeccionSubSeccion,
      };
    });
  } catch (error) {
    toast.error("Ha ocurrido un error al cargar las dependencias");
  }
};

const loadSeries = async (idSeccionSubseccion) => {
  try {
    const responseSeries = await sgdeaAxios.get(`serie/buscarSerie`, {
      params: {
        idSeriesubserie: null,
        descripcion: null,
        estado: true,
        codigo: null,
        seccionSubSeccion: idSeccionSubseccion,
        padre: null,
      },
    });

    listadoSeries.value = responseSeries.data.map((item) => {
      return {
        label: item.descripcion,
        value: item.idSeriesubserie,
      };
    });
  } catch (error) {
    console.error(error);
  }
};

const loadSubseries = async (id) => {
  const responseSubSeries = await sgdeaAxios.get(`serie/buscarSub`, {
    params: {
      idSeriesubserie: null,
      descripcion: null,
      estado: true,
      codigo: null,
      seccionSubSeccion: null,
      padre: id,
    },
  });

  listadoSubSeries.value = responseSubSeries.data.map((item) => {
    return {
      label: item.descripcion,
      value: item.idSeriesubserie,
    };
  });
};

watch(
  () => formData.value.dependencia,
  (newValue) => {
    // @ts-expect-error
    loadSeries(newValue.value);
  }
);

watch(
  () => formData.value.series,
  (newValue) => {
    loadSubseries(newValue);
  }
);

watch(
  () => listadoSubSeries.value,
  (newValue) => {
    if (newValue.length > 0) {
      isSubSeries.value = true;
    } else {
      isSubSeries.value = false;
    }
  }
);

const filterSeries = (val: string, update: any) => {
  const normalizeString = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (val === "") {
    update(() => {
      filteredSeries.value = listadoSeries.value;
    });
    return;
  }

  const normalizedVal = normalizeString(val.toLowerCase());

  update(() => {
    filteredSeries.value = listadoSeries.value.filter((option) => {
      return normalizeString(option.label.toLowerCase()).includes(
        normalizedVal
      );
    });
  });
};

const filterSubSeries = (val: string, update: any) => {
  const normalizeString = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (val === "") {
    update(() => {
      filteredSubSeries.value = listadoSubSeries.value;
    });
    return;
  }

  const normalizedVal = normalizeString(val.toLowerCase());

  update(() => {
    filteredSubSeries.value = listadoSubSeries.value.filter((option) => {
      return normalizeString(option.label.toLowerCase()).includes(
        normalizedVal
      );
    });
  });
};


const handleSubmit = async () => {
  const isValidate = await myForm.value.validate()

  if (!isValidate) {
    toast.error("Por favor complete los campos requeridos");
    return;
  }
  saveTipologia();
};

const saveTipologia = async () => {
  const idSerieSubserie = formData.value.subSeries ? formData.value.subSeries : formData.value.series;

  const data = {
    "estado": true,
    "nombre": formData.value.tipoDocumental,
    "codigoTipologiaDocumental": "0",
    "nombreCorto": "",
    "siglaIndice": "",
    "descripcionIndice": "",
    "descripcion": "",
    "esUnDocumentoIndexable": true,
    "esUnDocumentoGestion": true,
    "esUnDocumentoPlantilla": true,
    "labelIndice": true,
    "bloqueoIndice": true,
    "exigidoIndice": true,
    "unicoIndice": true,
    "visibleIndice": true,
    "indexableIndice": true,
    "editableIndice": true,
    "esUnDocumentoPlantillaTipoFormulario": true,
    "cierreAutomatico": formData.value.cierreAutomatico,
  };

  try {
    const response = await sgdeaAxios.post(`/tipologiasdocumentales/crearTipologiaAsignadoaSeriesubserie/${idSerieSubserie}`, data);

    if (response.status === 201 || response.status === 200) {
      toast.success("Tipología creada con éxito");
      router.push('/');
    }
  } catch (error) {
    toast.error("Ha ocurrido un error al crear la tipología");
  }
}

</script>

<style scoped></style>
