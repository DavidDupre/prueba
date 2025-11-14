<template>
  <div class="row q-col-gutter-md q-pb-md q-px-md">
    <div class="col-12">
      <span class="tw-w-full">
        <label class="tw-text-label">Asunto *</label>
        <q-input
          v-model="formGeneralData.asunto"
          dense
          outlined
          label="Inserte"
          class="tw-rounded-lg"
          :rules="[inputRequired, (val) => maxLengthInput(100, val)]"
          :disable="isDisabled"
        />
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Tipo de documento del afectado *</label>
        <q-select
          v-model="formGeneralData.tipoDocumento"
          label="Seleccione"
          map-options
          emit-value
          dense
          outlined
          :options="tipoDocumentoOptions"
          class="tw-rounded-lg"
          :rules="[inputRequired]"
          :disable="isDisabled"
        >
        </q-select>
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Número de documento del afectado *</label>
        <q-input
          ref="refNumero"
          v-model="formGeneralData.numeroDocumento"
          dense
          outlined
          label="Inserte"
          class="tw-rounded-lg"
          :rules="[
            alphanumeric2,
            (val) => maxLengthInput(15, val),
            inputRequired,
            (val) => !/\s/.test(val) || 'No se permiten espacios',
          ]"
          :disable="isDisabled"
          @change="handleChanges"
        />
      </span>
    </div>
    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Nombre del afectado *</label>
        <q-input
          v-model="formGeneralData.nombreAfectado"
          dense
          outlined
          label="Inserte"
          class="tw-rounded-lg"
          :rules="[
            alphanumeric2,
            (val) => maxLengthInput(200, val),
            inputRequired,
            alphabeticalWithSpecialCharacters,
          ]"
          :disable="isDisabled"
        />
      </span>
    </div>
    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Radicado asociado</label>
        <q-select
          multiple
          v-model="formGeneralData.radNumero"
          use-input
          fill-input
          map-options
          emit-value
          dense
          outlined
          label="Inserte"
          class="tw-rounded-lg"
          @filter="filterRadicadosAsociados"
          :options="asociadosOptions"
          :disable="isDisabled"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No hay resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Siniestro *</label>
        <q-select
          v-model="formGeneralData.numeroSiniestro"
          use-input
          hide-selected
          fill-input
          map-options
          dense
          outlined
          label="Inserte"
          class="tw-rounded-lg"
          :rules="[inputRequired]"
          @filter="filterSiniestros"
          :options="siniestrosOptions"
          :disable="isDisabled"
          @update:model-value="handleSiniestroChange"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No hay resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Fecha del siniestro *</label>
        <q-input
          readonly
          label="Seleccione"
          dense
          outlined
          class="tw-rounded-lg"
          v-model="formGeneralData.date"
          :disable="isDisabledDate || isDisabled"
          :rules="[inputRequired]"
        >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  :options="optionsFn"
                  v-model="formGeneralData.date"
                  mask="DD-MM-YYYY"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Tipo de evento *</label>
        <q-select
          v-model="formGeneralData.evento"
          label="Seleccione"
          map-options
          emit-value
          dense
          outlined
          :options="tipoEventoOptions"
          class="tw-rounded-lg"
          :rules="[inputRequired]"
          :disable="isDisabled"
        >
        </q-select>
      </span>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
      <span class="tw-w-full">
        <label class="tw-text-label">Origen del evento *</label>
        <q-select
          v-model="formGeneralData.origen"
          label="Seleccione"
          map-options
          emit-value
          dense
          outlined
          :options="origenOptions"
          class="tw-rounded-lg"
          :rules="[inputRequired]"
          :disable="isDisabled"
        >
        </q-select>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import {
  inputRequired,
  maxLengthInput,
  alphanumeric2,
  alphabeticalWithSpecialCharacters,
} from "src/helpers/validations";
import { useCrearComunicacionesLogic } from "src/pages/Correspondencia/Crear/CrearComunicaciones/CrearComunicaciones.Logic";
import moment from "moment";
import { defineProps } from "vue";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import { getAcronimobyId } from "src/helpers/prefijoTipoDoc";

const props = withDefaults(
  defineProps<{
    form: any;
    isDisabled?: boolean;
  }>(),
  {}
);

const emit = defineEmits(["getPerson"]);
const asociadosOptionsStatic = ref([]);
const asociadosOptions = ref([]);
const siniestrosOptions = ref([]);
const siniestrosOptionsStatic = ref([{ label: "No aplica", value: "No aplica" }]);
const tipoDocumentoOptions = ref([]);
const tipoEventoOptions = ref([]);
const origenOptions = ref([]);
const refNumero = ref();
const auth = useAuthStore();
const isOficina3Or4Excelencia = computed(
  () => auth.$state.userInfo.oficina === 7 || auth.$state.userInfo.oficina === 8
);

const formGeneralData = ref(props.form);

onMounted(async () => {
  await getData();
});

const getData = async () => {
  const {
    getTipoDocumentoOptions,
    getTipoEventoOptions,
    getTipoOriginOptions,
  } = useCrearComunicacionesLogic();
  const promises = [
    getTipoDocumentoOptions(),
    getTipoEventoOptions(),
    getTipoOriginOptions(),
  ];
  // @ts-expect-error
  const [documentos, tiposEvento, tipoOrigen] = await Promise.allSettled(
    promises
  );

  tipoDocumentoOptions.value = documentos?.value.filter(
    (documento) => documento.label !== "Ninguno"
  );
  tipoEventoOptions.value = tiposEvento?.value;
  origenOptions.value = tipoOrigen?.value;

  if (
    formGeneralData.value.tipoDocumento &&
    formGeneralData.value.numeroDocumento
  ) {
    // @ts-expect-error
    await Promise.allSettled([allRadications(false)]);
  }
};

const handleChanges = async () => {
  // @ts-expect-error
  await Promise.allSettled([getPerson(), allRadications(true)]);
};

const responseSiniestro = ref();

async function getPerson() {
  const tipoDoc = getAcronimobyId(Number(formGeneralData.value.tipoDocumento));
  const number = Number(formGeneralData.value.numeroDocumento)
    ? Number(formGeneralData.value.numeroDocumento)
    : "";

  try {
    const { data } = await sgdeaAxios.get("/personas", {
      params: {
        tipoDocumento: tipoDoc,
        numeroDocumento: number,
      },
    });

    if (data) {
      const nameObject = {
        nombre1: data.nombre1,
        nombre2: data.nombre2,
        apellido1: data.apellido1,
        apellido2: data.apellido2,
      };

      const fullName = Object.values(nameObject).join(" ");
      formGeneralData.value.nombreAfectado = fullName;
    } else {
      formGeneralData.value.nombreAfectado = "";
    }

    responseSiniestro.value = data.siniestros;

    if (responseSiniestro.value && responseSiniestro.value.length > 0) {
      siniestrosOptionsStatic.value = [
        ...responseSiniestro.value.map((val) => ({
          label: val.idSiniestro,
          value: val.idSiniestro,
        })),
      ];
    }

    if (!siniestrosOptionsStatic.value.some(opt => opt.value === "No aplica")) {
      siniestrosOptionsStatic.value.push({
      label: "No aplica",
      value: "No aplica",
      });
    }

    emit("getPerson");
  } catch (error) {
    formGeneralData.value.nombreAfectado = "";
    console.error(error);
  }
}

watch(
  () => formGeneralData.value.tipoDocumento,
  (newValue) => {
    if (newValue) {
      formGeneralData.value.numeroDocumento = "";
      formGeneralData.value.nombreAfectado = "";
      formGeneralData.value.radNumero = [];
      formGeneralData.value.numeroSiniestro = "";
      formGeneralData.value.date = "";
    }
  }
);

watch(
  () => formGeneralData.value.numeroDocumento,
  (newValue) => {
    if (newValue) {
      formGeneralData.value.numeroSiniestro = "";
      formGeneralData.value.date = "";
    }
  }
);

watch(
  () => formGeneralData.value.numeroSiniestro,
  (newValue) => {
    if (newValue) {
      if (newValue.label !== "No aplica") {
        formGeneralData.value.date = ""; // Limpia la fecha si se selecciona un siniestro
        const fecha =
          responseSiniestro.value.find(
            (option) => option.idSiniestro == newValue.value
          )?.fechaAT || "";
        formGeneralData.value.date = fecha
          ? moment(fecha, "YYYY/MM/DD HH:mm:ss").format("DD-MM-YYYY")
          : "";
        return;
      }
    }
    formGeneralData.value.date = ""; // Limpia la fecha si se selecciona "No aplica"}
  }
);

async function allRadications(clearData: boolean) {
  if (clearData) formGeneralData.value.radNumero = [];

  try {
    const response = await sgdeaAxios.get("/medicina/getAllRadicacion", {
      params: {
        tipoDocumento: formGeneralData.value.tipoDocumento,
        numeroDocumento: formGeneralData.value.numeroDocumento,
      },
    });

    asociadosOptionsStatic.value = response.data.map((radicado: string) => {
      return {
        label: radicado,
        value: radicado,
      };
    });
  } catch (error) {
    console.error(error);
  }
}

async function resetValInput() {
  await refNumero.value.validate();
}

const optionsFn = (date) => {
  const fechaActual = moment().format("YYYY/MM/DD");
  return date <= fechaActual;
};

const filterRadicadosAsociados = (val, update) => {
  if (val == "") {
    update(() => {
      asociadosOptions.value = asociadosOptionsStatic.value;
    });
    return;
  }
  update(() => {
    asociadosOptions.value = asociadosOptionsStatic.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  });
};

const filterSiniestros = (val, update) => {
  update(() => {
    if (!val) {
      siniestrosOptions.value = siniestrosOptionsStatic.value;
      return;
    }

    const searchTerm = val.toLowerCase();
    siniestrosOptions.value = [
      // Filtra opciones que coincidan con la búsqueda
      ...siniestrosOptionsStatic.value.filter(option =>
        option.value !== "No aplica" &&
        option.label.toLowerCase().includes(searchTerm)
      ),
      // Mantiene "No aplica" siempre disponible
      { label: "No aplica", value: "No aplica" }
    ];
  });
};

defineExpose({
  resetValInput,
});
const handleSiniestroChange = (newValue: string) => {
  if (newValue === "No aplica") {
    formGeneralData.value.date = ""; // Limpia la fecha si se selecciona "No aplica"
  }
};

// Estado reactivo para manejar la desactivación de la fecha
const isDisabledDate = ref(false);
</script>
