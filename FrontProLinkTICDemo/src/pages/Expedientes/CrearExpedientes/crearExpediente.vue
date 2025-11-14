<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
      <BreadCrumbs :crumbs="routes" />
      <div class="tw-flex tw-justify-between tw-items-center tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold tw-my-4">Crear expediente</h1>
      </div>
      <q-card class="tw-mt-[20px] tw-rounded-xl q-pa-lg" flat>
        <h1 class="tw-text-xl tw-font-bold tw-mb-5">Identificación</h1>
        <q-form ref="formCrear" @submit.prevent="handleForm">
          <div class="tw-flex tw-gap-5">
            <div class="tw-w-1/2">
              <label for="code" class="tw-text-label"
                >Descripción expediente *</label
              >
              <q-input
                v-model="form.nombreExpediente"
                outlined
                class="mb-3"
                dense
                :rules="[rulesValidation, (val: string) => val.length > 0 || 'El campo es requerido']"
                type="text"
                label="Inserte"
              />
            </div>
            <div class="tw-w-1/2">
              <label for="description" class="tw-text-label"
                >Código expediente *</label
              >
              <p class="tw-mb-3 tw-mt-2">{{ form.codigoExpediente }}</p>
            </div>
          </div>

          <div class="tw-flex tw-gap-5">
            <div class="tw-w-1/2">
              <label for="initialDate" class="tw-text-label"
                >Fecha inicial *</label
              >
              <DatePickerComponent
                v-model:input-data-prop="form.fechaInicial"
                label="aaaa/mm/dd"
                :rules="[(val: string) => val.length > 0 || 'El campo es requerido', validDate, validateDate]"
                mask="YYYY/MM/DD"
              />
            </div>
            <div class="tw-w-1/2">
              <label for="endingDate" class="tw-text-label">Fecha final</label>
              <DatePickerComponent
                v-model:input-data-prop="form.fechaFinal"
                mask="YYYY/MM/DD"
                :options="(date: any) => date >= form.fechaInicial"
                :rules="[validateEndDate, validDate, validateDate]"
                label="aaaa/mm/dd"
              />
            </div>
          </div>

          <div class="tw-flex tw-gap-5 tw-mt-3">
            <div class="tw-w-1/2">
              <label for="description" class="tw-text-label"
                >Dependencia *</label
              >
              <q-select
                outlined
                label="Seleccione"
                class="tw-w-full"
                dense
                v-model="form.dependencia"
                @update:model-value="(val) => onChangeSerie(val)"
                :options="dependenciaOptions"
                :rules="[(val: string) => !!val || 'Este campo es requerido']"
                emit-value
                map-options
              />
            </div>
            <div class="tw-w-1/2">
              <label for="initialDate" class="tw-text-label">Serie *</label>
              <q-select
                outlined
                class="tw-w-full"
                dense
                :options="series"
                v-model="form.serie"
                @update:model-value="(val) => onChangeSubserie(val)"
                label="Seleccione"
                :rules="[(val: string) => !!val || 'Este campo es requerido']"
                emit-value
                map-options
              />
            </div>
          </div>
          <div class="tw-flex tw-gap-5 tw-mt-3">
            <div class="tw-w-1/2">
              <label for="initialDate" class="tw-text-label">Subserie</label>
              <q-select
                outlined
                label="Seleccione"
                class="tw-w-full"
                dense
                v-model="form.subserie"
                :options="optionsSubseries"
                emit-value
                map-options
              />
            </div>
          </div>

          <div class="tw-mt-8">
            <label class="tw-text-label">Tipo de Expediente *</label>
            <div class="tw-flex tw-gap-6">
              <q-radio
                v-model="form.radio"
                val="1"
                :rules="[(val: any) => !!val || 'Campo requerido']"
                label="Expediente Electrónico"
                required
              />
              <q-radio
                v-model="form.radio"
                val="2"
                :rules="[(val: any) => !!val || 'Campo requerido']"
                label="Expediente Físico"
                required
              />
              <q-radio
                v-model="form.radio"
                val="3"
                :rules="[(val: any) => !!val || 'Campo requerido']"
                label="Expediente Híbrido"
                required
              />
            </div>
          </div>

          <div class="tw-mt-10">
            <h1 class="tw-text-xl tw-font-bold tw-mb-5">Contexto</h1>

            <div class="tw-flex tw-gap-5">
              <div class="tw-w-1/2">
                <label for="code" class="tw-text-label">Area</label>
                <q-input
                  v-model="form.area"
                  outlined
                  class="mb-3"
                  dense
                  :rules="[rulesValidation]"
                  type="text"
                  label="Inserte"
                />
              </div>
              <div class="tw-w-1/2">
                <label for="description" class="tw-text-label">Grupo</label>
                <q-input
                  v-model="form.grupo"
                  label="Inserte"
                  outlined
                  :rules="[rulesValidation]"
                  dense
                  type="text"
                />
              </div>
            </div>

            <div class="tw-w-full">
              <label for="description" class="tw-text-label"
                >Nivel de seguridad *</label
              >
              <q-select
                v-model="form.nivelSeguridad"
                label="Seleccione"
                outlined
                :rules="[(val) => !!val || 'Campo requerido']"
                dense
                :options="nivelesOptions"
              />
            </div>
          </div>

          <div class="tw-mt-2" v-if="form.radio === '3' || form.radio === '1'">
            <h1 class="tw-text-xl tw-font-bold tw-mb-5">Ubicación</h1>

            <div class="tw-flex tw-gap-5">
              <div class="tw-w-full">
                <label for="code" class="tw-text-label">Ubicación</label>
                <q-input outlined class="mb-3" dense v-model="form.ubicacion" />
              </div>
            </div>
          </div>

          <div class="tw-mt-10">
            <h1 class="tw-text-xl tw-font-bold tw-mb-5">Asociaciones</h1>
            <div class="tw-mt-8">
              <label class="tw-text-label">¿Tiene expedientes asociados?</label>
              <div class="tw-flex tw-gap-6">
                <q-radio
                  v-model="hasExps"
                  :val="1"
                  :rules="[(val: any) => !!val || 'Campo requerido']"
                  label="Sí"
                  required
                />
                <q-radio
                  v-model="hasExps"
                  checked
                  :val="0"
                  :rules="[(val: any) => !!val || 'Campo requerido']"
                  label="No"
                  required
                />
              </div>
              <div class="tw-w-full tw-flex tw-flex-col tw-my-3" v-if="hasExps">
                <label for="code" class="tw-text-label">Expediente</label>
                <q-select
                  :options="expedientes"
                  label="Seleccione"
                  flat
                  dense
                  v-model:model-value="form.expedienteAsociado"
                  outlined
                  @update:model-value="getDocs(form.expedienteAsociado.nodeId)"
                />
              </div>
              <label class="tw-text-label tw-my-4" v-if="hasExps"
                >¿Tiene documentos asociados?</label
              >
              <div class="tw-flex tw-gap-6" v-if="hasExps">
                <q-radio
                  v-model="hasDocs"
                  :val="1"
                  :rules="[(val: any) => !!val || 'Campo requerido']"
                  label="Sí"
                  required
                />
                <q-radio
                  v-model="hasDocs"
                  checked
                  :val="0"
                  :rules="[(val: any) => !!val || 'Campo requerido']"
                  label="No"
                  required
                />
              </div>
              <div
                class="tw-w-full tw-flex tw-flex-col tw-mt-4"
                v-if="hasDocs && hasExps"
              >
                <label for="code" class="tw-text-label">Documentos</label>
                <q-select
                  :options="fatherDocs"
                  label="Seleccione"
                  flat
                  dense
                  v-model:model-value="form.documentoAsociado"
                  outlined
                />
              </div>
            </div>
          </div>

          <div
            class="row tw-flex tw-justify-center tw-gap-2"
            :class="
              form.radio === 'hibrido' || form.radio === 'electronico'
                ? 'tw-pt-[20px]'
                : 'tw-pt-[50px]'
            "
          >
            <q-btn
              label="Cancelar"
              color="accent"
              textColor="black"
              class="tw-rounded-lg col-2"
              @click="cancelModal = true"
            />
            <q-btn
              label="Crear"
              type="submit"
              color="secondary"
              class="tw-rounded-lg col-2"
            ></q-btn>
          </div>
        </q-form>
      </q-card>
      <Modal
        v-model="showModal"
        title="Creación exitosa"
        :text="`El expediente ${form.codigoExpediente} ${form.nombreExpediente} fue creado correctamente.`"
        :is-success="true"
        text-button="¡Ok!"
        @handleAccept="handleModal"
      />
      <Modal
        v-model="errorModal"
        title="Error"
        :text="msgText"
        text-button="Aceptar"
        @handleAccept="handleModal"
      />
      <Modal
        v-model="cancelModal"
        title="¡Espera un momento!"
        text="¿Está seguro de abandonar la creación del expediente en curso?"
        text-cancel-button="NO"
        text-button="SI"
        @handleAccept="router.push('/expediente')"
        cancel-button
        @closeModal="() => (cancelModal = false)"
        text-button-cancel="NO"
      />
    </main>
  </section>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, watch } from "vue";
import { useRouter } from "vue-router";
import {
  secondFormatDate,
} from "src/helpers/formtDate";

import { sgdeaAxios } from "src/services";

import BreadCrumbs from "src/components/BreadCrumbs/BreadCrumbs.vue";
import DatePickerComponent from "components/FormFields/datePickerComponent.vue";
import Modal from "components/Modal/Modal.vue";
import { validateDate as validDate } from "src/helpers/validations";
import { nivelesOptions } from "pages/Expedientes";
import { Serie } from "src/interfaces";
import { toast } from "src/helpers/toast";

const router = useRouter();

const showModal = ref(false);
const errorModal = ref(false);
const hasExps = ref(0);
const hasDocs = ref(0);
const formCrear = ref();
const optionsSubseries = ref([]);
const cancelModal = ref(false);
const msgText = ref("Ha ocurrido un error");
const dependenciaOptions = ref([]);
const dependencias = ref([]);
const series = ref([]);
const subseries = ref([]);

const selected = ref([]);
const expedientes = ref([]);
const fatherDocs = ref([]);
const emit = defineEmits(["update:value"]);

const form = ref({
  area: "",
  codigoExpediente: "",
  fechaFinal: "",
  fechaInicial: "",
  grupo: "",
  nivelSeguridad: "",
  nombreExpediente: "",
  serie: "",
  subserie: "",
  radio: "",
  ubicacion: "",
  expedienteAsociado: "",
  documentoAsociado: "",
  //documento: "",
  //nombreDocumento: "",
  //tipoDocumental: "",
  //fechaDocumento: "",
});


async function getAllData() {
  const { data }: { data: any[] } = await sgdeaAxios.get("/seccionSubSeccion");
  dependencias.value = data;

  const { data: sub } = await sgdeaAxios.get("/serie/allSubSerie");
  subseries.value = sub;

  const { data: exp } = await sgdeaAxios.get("/expediente/obtenerTodo");
  expedientes.value = exp;

  const { data: sec } = await sgdeaAxios.get<string>("/generar/secuencia/EXP");
  form.value.codigoExpediente = sec;
}

async function assignData() {
  dependencias.value = dependencias.value
    ?.filter((dep: any) => dep.idversiontrd.estado === 54)
    ?.map((item: any) => ({
      label: item.nombre,
      value: item.idSeccionSubSeccion,
      padre: item?.padre?.idSeccionSubSeccion ?? "no tiene",
    }));


  for (let i = 0; i < dependencias.value.length; i++) {
    if (dependencias.value[i]?.padre !== "no tiene") {
      const padre = dependencias.value[i]?.padre;
      dependencias.value = dependencias.value.filter(
        (dep) => dep.value !== padre
      );
    }
  }

  dependenciaOptions.value = dependencias.value;

  expedientes.value = expedientes.value.map((item) => ({
    label: item.nombreexpediente,
    value: item.idexpediente,
    nodeId: item.nodeid,
  }));
}

onBeforeMount(async () => {
  await getAllData();
  await assignData();
});

const validateEndDate = () => {
  if (form.value.fechaInicial.length > 0 && form.value.fechaFinal.length > 0) {
    return (
      Date.parse(form.value.fechaInicial) <=
        Date.parse(form.value.fechaFinal) ||
      "Debe ingresar un fecha superior a la fecha inicial"
    );
  }

  return true;
};

const getDocs = async (e: string) => {
  const { data } = await sgdeaAxios.get(`/expediente/buscarListDoc/${e}`);

  fatherDocs.value = data.map((doc) => ({
    label: doc.split("nodeId")[0].trim(),
    value: doc.split("nodeId")[1].trim().replace(":", ""),
  }));

};

const onChangeSerie = async (e: Object) => {
  const { data: getSeries } = await sgdeaAxios.get<Serie[]>(`/serie/allSerie`);

  series.value = getSeries
    .filter((item: any) => item.seccionSubSeccion.idSeccionSubSeccion == e)
    .map((item: any) => ({
      label: `${item.descripcion}`,
      value: parseInt(item.idSeriesubserie),
    }));
};

const onChangeSubserie = async (e: object) => {
  //@ts-ignore
  optionsSubseries.value = subseries.value
    .filter((item: any) => item.padre?.idSeriesubserie == e)
    .map((item: any) => ({
      label: `${item.descripcion}`,
      value: parseInt(item.idSeriesubserie),
    }));
};

const rulesValidation = (val: any) => {
  return val?.length < 50 || "Solo se permiten 50 caracteres";
};

const validateDate = (val: any) => {
  const inputDate = new Date(val);

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Ignorar la hora actual para comparar solo las fechas.

  if (inputDate >= currentDate) {
    return "La fecha debe ser anterior a la fecha actual";
  }

  return true;
};

const handleForm = async () => {

  if (form.value.radio == "") {
    showNotif("Debe seleccionar un tipo de expediente");
    return;
  }

  const formData = new FormData();

  if (form.value.subserie) {
    formData.append("idseriesubserie", form.value.subserie);
  } else {
    formData.append("idseriesubserie", form.value.serie);
  }

  formData.append("nombreexpediente", form.value.nombreExpediente);
  //@ts-ignore
  formData.append("idccd", 0);
  //@ts-ignore
  formData.append("tieneanexos", false);
  formData.append("nombredocumento", "");
  formData.append("estado", "1");
  formData.append("tipodocumental", "");
  formData.append("codigoexpediente", form.value.codigoExpediente);
  formData.append(
    "fechavigenciainicial",
    secondFormatDate(form.value.fechaInicial)
  );
  formData.append(
    "fechavigenciafinal",
    form.value.fechaFinal === ""
      ? secondFormatDate(form.value.fechaInicial)
      : secondFormatDate(form.value.fechaFinal)
  );

  formData.append("area", form.value.area);
  //@ts-ignore
  formData.append("idradicado", 0);

  //@ts-ignore
  formData.append("tipoexpediente", Number(form.value.radio));
  formData.append("grupo", form.value.grupo);
  //@ts-ignore
  formData.append("nivelseguridad", form.value.nivelSeguridad.value);
  formData.append("ubicacion", form.value.ubicacion);
  if (form.value.expedienteAsociado !== "" && hasExps.value === 1) {
    //@ts-ignore
    formData.append("idPadre", form.value.expedienteAsociado.value);
    //@ts-ignore
    formData.append("nodeIdPadre", form.value.expedienteAsociado.nodeId);
  }

  if (
    form.value.documentoAsociado !== "" &&
    form.value.expedienteAsociado !== ""
  ) {
    //@ts-ignore
    formData.append("nodeIdHijo", form.value.expedienteAsociado.value);
  }


  let response = await sgdeaAxios.post("/expediente/crear", formData);

  let nombreExpediente: string;

  if ([405, 401, 404, 400, 403, 500].includes(response?.status)) {
    if (response.data.message.includes("[409] during [POST]")) {
      msgText.value =
        "El nombre del expediente ya fue utilizado, utilice otro.";
    } else {
      msgText.value = "Ha ocurrido un error.";
    }
    errorModal.value = true;
    cancelModal.value = false;
    return;
  }
  if ([200, 201].includes(response.status)) {
    showModal.value = true;
  }
};

const handleModal = () => {
  if (showModal.value) {
    showModal.value = false;
    router.push("/expediente");
  } else {
    errorModal.value = false;
  }
};

const routes = [
  {
    name: "Inicio",
    to: "/home",
  },
  {
    name: "Módulo SGDEA",
  },
  {
    name: "Expedientes",
    to: "/expediente",
  },
  {
    name: "Crear expediente",
  },
];

// funcionalidad documentos y anexos

watch(selected, (selectedData) => {
  selected.value = selectedData;
  emit("update:value", selected.value);
});

function showNotif(title: string) {
  toast.error(title);
}
</script>
