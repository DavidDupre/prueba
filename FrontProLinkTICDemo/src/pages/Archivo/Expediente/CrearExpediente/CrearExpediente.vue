<template>
  <a
    @click.prevent="router.back()"
    class="tw-text-primary q-mb-md block cursor-pointer"
    style="text-decoration: none"
  >
    <q-icon size="1.5em" name="chevron_left"></q-icon>
    <b>Regresar</b>
  </a>
  <q-card class="tw-px-0 tw-py-3 tw-pb-6 tw-rounded-xl tw-mx-4" flat>
    <q-expansion-item default-opened>
      <template v-slot:header>
        <div class="col">
          <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
            Crear expediente
          </h3>
        </div>
      </template>
      <q-form ref="form" @submit.prevent="submit" greedy>
        <section class="tw-px-8 tw-pt-3">
          <div class="tw-grid tw-grid-cols-4 tw-gap-x-4">
            <div class="tw-col-span-2">
              <Label label="Dependencia" :is-requiered="true" />
              <q-select
                :options="filteredDependencias"
                map-options
                outlined
                v-model="formData.dependencia"
                label="Inserte"
                dense
                @filter="filterDependencias"
                use-input
                fill-input
                hide-selected
                :loading="loadingDependencias"
                :disable="loadingDependencias"
                class="tw-mt-2 tw-rounded-lg"
              />
            </div>
            <div class="tw-col-span-2">
              <Label label="Serie" :is-requiered="true" />
              <q-select
                :options="filteredSeries"
                map-options
                emit-value
                outlined
                v-model="formData.series"
                label="Inserte"
                dense
                :rules="[inputRequired]"
                @filter="filterSeries"
                use-input
                fill-input
                hide-selected
                :loading="loadingSeries"
                :disable="loadingSeries"
                class="tw-mt-2 tw-rounded-lg"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="tw-col-span-2 tw-mt-4">
              <Label label="Subserie" :is-requiered="requiredSubserie" />
              <q-select
                :options="filteredSubSeries"
                map-options
                emit-value
                outlined
                v-model="formData.subSeries"
                label="Inserte"
                dense
                :rules="requiredSubserie ? [inputRequired] : undefined"
                @filter="filterSubSeries"
                use-input
                fill-input
                hide-selected
                :loading="loadingSubseries"
                :disable="loadingSubseries"
                class="tw-mt-2 tw-rounded-lg"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="tw-col-span-2 tw-mt-4">
              <Label label="Tipo Documental" :is-requiered="true" />
              <q-select
                :options="filteredTiposDocumentales"
                map-options
                emit-value
                outlined
                v-model="formData.tipoDocumental"
                label="Inserte"
                dense
                :rules="[inputRequired]"
                @filter="filterTiposDocumental"
                use-input
                fill-input
                hide-selected
                :loading="loadingTiposDoc"
                :disable="loadingTiposDoc"
                class="tw-mt-2 tw-rounded-lg"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <!-- <div class="tw-col-span-2 tw-mt-4">
              <p class="tw-text-label tw-font-semibold">
                Código de Proceso *
              </p>
              <q-input type="text" v-model="formData.numeroIdentificacion" label="Inserte" dense outlined
                :rules="[inputRequired, onlyNumbers, v => maxLengthInput(10, v)]" @keypress="onlyAlphaNumeric"
                 />
            </div> -->
            <!-- <div class="tw-col-span-2 tw-mt-4">
              <p class="tw-text-label tw-font-semibold">
                Número de Identificación *
              </p>
              <q-input type="text" v-model="formData.numeroDocumento" label="Inserte" dense outlined
                :rules="[inputRequired, onlyNumbers, v => maxLengthInput(30, v)]" @keypress="onlyAlphaNumeric"
                 />
            </div> -->
            <div class="tw-col-span-2 tw-mt-4">
              <Label label="Código de Identificación" :is-requiered="true" />
              <q-input
                type="text"
                v-model="formData.numeroIdentificacion"
                label="Inserte"
                dense
                outlined
                :rules="[inputRequired]"
                class="tw-mt-2 tw-rounded-lg"
              />
            </div>
            <div class="tw-col-span-2 tw-mt-4">
              <Label label="Estado" :is-requiered="true" />
              <q-select
                :options="statusOptions"
                map-options
                emit-value
                outlined
                v-model="formData.estado"
                label="Inserte"
                dense
                :rules="[inputRequired]"
                use-input
                fill-input
                hide-selected
                class="tw-mt-2 tw-rounded-lg"
              >
              </q-select>
            </div>
            <div class="tw-col-span-2 tw-mt-4">
              <Label label="Fase de Archivo" :is-requiered="true" />
              <q-select
                v-model="formData.faseArchivo"
                emit-value
                map-options
                dense
                outlined
                :options="faseOptions"
                :rules="[inputRequired]"
                class="tw-mt-2 tw-rounded-lg"
              ></q-select>
            </div>
            <div class="tw-col-span-2 tw-mt-4">
              <Label label="Responsable del Expediente" :is-requiered="true" />
              <q-input
                v-model="formData.responsableExpediente"
                label="Inserte"
                dense
                disable
                filled
                class="tw-mt-2 tw-rounded-lg"
              />
            </div>
            <div class="tw-col-span-2 tw-mt-4">
              <Label label="Expediente" :is-requiered="true" />
              <q-input
                v-model="formData.expedientes"
                label="Inserte"
                dense
                filled
                class="tw-mt-2 tw-rounded-lg"
                :rules="[inputRequired, (v: string) => lengthValidation(150, v)]"
                disable
                hint="Estructura del Gestor: EXP-{Código de Proceso}-{Número de Documento Afectado}"
              />
            </div>
            <!-- <div class="tw-col-span-4 tw-mt-4">
              <CommentTextArea v-model="formData.observacion" :is-required="true" :max-length="1000"
                label="Observaciones" />
            </div> -->
          </div>
          <fieldset
            class="tw-grid tw-grid-cols-2 tw-col-span-2 tw-gap-4 tw-bg-slate-50 tw-p-4 tw-rounded-lg tw-mt-4"
          >
            <span class="tw-col-span-2 tw-h-5 tw-text-label">
              Fechas Extremas
            </span>
            <div>
              <Label label="Fecha Inicial" :is-requiered="true" />
              <q-input
                v-model="formData.fechaInicial"
                type="date"
                dense
                outlined
                class="tw-mt-2 tw-rounded-lg"
                :rules="[inputRequired]"
                :min="new Date().toISOString().slice(0, 10)"
                :max="formData.fechaFinal"
              ></q-input>
              <!-- <DatePickerInput v-model="date" /> -->
            </div>
            <div>
              <Label label="Fecha Final" :is-requiered="true" />
              <q-input
                v-model="formData.fechaFinal"
                type="date"
                dense
                outlined
                class="tw-mt-2 tw-rounded-lg"
                :rules="[inputRequired]"
                :min="formData.fechaInicial"
              ></q-input>
              <!-- <DatePickerInput v-model="date" /> -->
            </div>
          </fieldset>
        </section>
      </q-form>
    </q-expansion-item>
  </q-card>

  <div class="justify-center tw-w-full tw-pb-6 tw-mt-4 tw-flex tw-gap-4">
    <q-btn
      label="Cancelar"
      type="reset"
      style="width: 240px; height: 40px"
      text-color="black"
      color="accent"
      class="tw-rounded-xl"
      @click="() => (showCancelModal = true)"
    />
    <q-btn
      label="Guardar"
      text-color="white"
      @click="submit"
      style="width: 240px; height: 40px"
      color="primary"
      class="tw-rounded-xl tw-btn tw-p-2"
    />
  </div>
  <Modal
    v-model:model-value="showCancelModal"
    title="¡Espera un momento!"
    text="Al cancelar el proceso perderá los datos
    ingresados en el formulario, ¿desea realizar la acción?"
    :is-success="false"
    textButtonCancel="No"
    cancel-button
    @handleAccept="emit('redirect')"
    text-button="Si"
    @close-modal="() => (showCancelModal = false)"
  />
  <ModalExito
    v-if="success"
    v-model="creacionModal"
    title="Creación exitosa"
    :text="`Se ha creado con éxito el expediente ${responseExpediente.titulo}.`"
    is-success
    text-button="¡Ok!"
    @handleAccept="handleModal"
  />
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref, watch } from "vue";
import { sgdeaArchivoAxios, sgdeaAxios } from "src/services";
import {
  inputRequired,
  maxLengthInput,
  onlyNumbers,
} from "src/helpers/validations";
import Modal from "src/components/Modal/Modal.vue";
import { toast } from "src/helpers/toast";
import { useAuthStore } from "src/stores/auth.store";
import { defineExpose } from "vue";
import ModalExito from "components/Modal/Modal.vue";
// import { Medicina } from "src/interfaces";
// import { onlyAlphaNumeric } from "src/helpers/validations";
// import CommentTextArea from "src/shared/components/TextArea/Comments.vue";
// import { ExpedienteGlobal as Expediente } from "src/interfaces/Expediente";
// import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { useRouter } from "vue-router";
import Label from "src/shared/components/PrimeComponents/Label/Label.vue";

const formData = ref({
  dependencia: "",
  series: "",
  subSeries: "",
  nombreExpediente: "",
  tipoDocumental: "",
  expedientes: "",
  numeroIdentificacion: "",
  responsableExpediente: "",
  nivelAcceso: "",
  observacion: "",
  numeroDocumento: "",
  estado: true,
  faseArchivo: "",
  fechaInicial: "",
  fechaFinal: "",
});

const emit = defineEmits(["finally", "redirect"]);
const auth = useAuthStore();
const showCancelModal = ref(false);
const form = ref();
const listadoDependencias = ref();
const filteredDependencias = ref();
const listadoSeries = ref();
const filteredSeries = ref();
const listadoSubSeries = ref();
const filteredSubSeries = ref();
const listadoTiposDocumentales = ref();
const filteredTiposDocumentales = ref();
const success = ref(false);
const requiredSubserie = ref(true);
const loadingDependencias = ref(false);
const loadingSeries = ref(false);
const loadingSubseries = ref(false);
const loadingTiposDoc = ref(false);
const router = useRouter();
const creacionModal = ref(false);

onMounted(async () => {
  formData.value.responsableExpediente = auth.userInfo.name;
  //   formData.value.numeroDocumento = props.mlData.afectado.numeroDocumento;
  //   formData.value.numeroIdentificacion = props.mlData.caseId;
  formData.value.expedientes = `EXP-2025-${
    formData.value.numeroIdentificacion == "N/A"
      ? "NA"
      : formData.value.numeroIdentificacion
  }`;
  await getData();
});

defineExpose({
  success,
});

const statusOptions = [
  { label: "Activo", value: true },
  { label: "Inactivo", value: false },
];

const faseOptions = [
  { label: "Gestión", value: "GESTION" },
  { label: "Central", value: "CENTRAL" },
  { label: "Histórico", value: "HISTORICO" },
];

const getData = async () => {
  await loadDependencias();
};

const loadDependencias = async () => {
  try {
    loadingDependencias.value = true;
    const response = await sgdeaAxios.get(`/seccionSubSeccion`);
    listadoDependencias.value = response.data.map((e) => {
      return {
        label: e.nombre,
        value: e.idSeccionSubSeccion,
      };
    });
  } catch (error) {
    toast.error("Ha ocurrido un error al cargar las dependencias");
  } finally {
    loadingDependencias.value = false;
  }
};

const loadSeries = async (idSeccionSubseccion) => {
  try {
    loadingSeries.value = true;
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
    toast.error("Ha ocurrido un error al cargar las series");
  } finally {
    loadingSeries.value = false;
  }
};

const loadSubseries = async (id) => {
  try {
    loadingSubseries.value = true;
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
    if (responseSubSeries.data.length > 0) {
      listadoSubSeries.value = responseSubSeries.data.map((item) => {
        return {
          label: item.descripcion,
          value: item.idSeriesubserie,
        };
      });
    } else {
      listadoSubSeries.value = undefined;
    }
  } catch (error) {
    toast.error("Ha ocurrido un error al cargar las subseries");
  } finally {
    loadingSubseries.value = false;
  }
};

const loadTipoDocumental = async (id) => {
  try {
    loadingTiposDoc.value = true;
    const response = await sgdeaAxios.get(
      `tiposdocumentales/asignacion/serie/tipos_documentales`,
      {
        params: { serie: id },
      }
    );

    listadoTiposDocumentales.value =
      response.data.tiposDocumentalesAsociados.map((e) => {
        let item = e.tipologiaDocumental;
        return {
          label: item.nombre,
          value: item.idTipologiaDocumental,
        };
      });
  } catch (error) {
    toast.error("Ha ocurrido un error al cargar los tipos documental");
  } finally {
    loadingTiposDoc.value = false;
  }
};

const responseExpediente = ref();

const submit = async () => {
  if (!(await form.value.validate())) {
    toast.error(
      "Debe diligenciar los campos obligatorios para continuar con el proceso"
    );
    return;
  }

  try {
    const sendData = {
      // @ts-ignore
      dependencia: formData.value.dependencia.value,
      serie: formData.value.series,
      subserie: requiredSubserie.value ? formData.value.subSeries : 0,
      tipoDocumental: formData.value.tipoDocumental,
      codIdentificacion: formData.value.numeroIdentificacion,
      responsable: auth.userInfo.userid,
      observaciones: formData.value.observacion,
      titulo: undefined,
      nivelSeguridad: "Pública",
      creacion: true,
      modulo: 11,
      phaseFile: formData.value.faseArchivo,
      fechaInicial: formData.value.fechaInicial,
      fechaFinal: formData.value.fechaFinal,
      estado: formData.value.estado,
      radicado: "",
      nodeIdExp: "",
    };

    const response = await sgdeaArchivoAxios.post(`/record/newpdate`, sendData);

    if (response.status === 200 || response.status === 201) {
      //   await crearTrazabilidad({
      //     proceso: "ML" + props.mlData.id,
      //     secuencia: props.mlData.idRadicado,
      //     estado: props.mlData.estado.estado,
      //     descripcion:
      //       `Usuario: ${auth.$state.userInfo.name}` +
      //       `Series: ${listadoSeries.value.find(s => s.value === (formData.value.series))?.label || formData.value.series}` +
      //       `Subseries: ${listadoSubSeries.value.find(s => s.value === formData.value.subSeries)?.label || formData.value.subSeries}` +
      //       `TipoDocumental: ${listadoTiposDocumentales.value.find(td => td.value === (formData.value.tipoDocumental))?.label || formData.value.tipoDocumental}` +
      //       `Expedientes: ${formData.value.expedientes}` +
      //       `Comentario: Se ha creado e incluido un expediente al trámite`,
      //     comentario: "Expediente creado e incluido",
      //     nombre: auth.$state.userInfo.name,
      //     accion: `${auth.$state.userInfo.name} creó e incluyó un expediente en el trámite ${props.mlData.idRadicado}`,
      //     tramite: "Medicina laboral ",
      //   });
      toast.success("Datos guardados exitosamente");
      success.value = true;
      responseExpediente.value = response.data;
      creacionModal.value = true;
    }
  } catch (error) {
    if (error?.response?.status === 409) {
      // Si ya estaba incluido el expediente previamente
      toast.error(error?.response?.data?.message);
    } else {
      // Mostrar mensaje de error por default
      toast.error("Ha ocurrido un error al guardar los datos");
    }
  }
};

const handleModal = () => {
  creacionModal.value = false;
  router.back();
};

watch(
  () => formData.value.dependencia,
  (newValue) => {
    // @ts-expect-error
    loadSeries(newValue.value);
    formData.value.series = "";
    listadoSubSeries.value = undefined;
    formData.value.subSeries = "";
    listadoTiposDocumentales.value = undefined;
    formData.value.tipoDocumental = "";
    form.value.reset();
  }
);

watch(
  () => formData.value.series,
  async (newValue) => {
    if (newValue) {
      await loadSubseries(newValue);
      if (!listadoSubSeries.value) {
        await loadTipoDocumental(newValue);
        requiredSubserie.value = false;
      } else {
        listadoTiposDocumentales.value = undefined;
        requiredSubserie.value = true;
      }
      formData.value.subSeries = "";
      formData.value.tipoDocumental = "";
      form.value.reset();
    }
  }
);

watch(
  () => formData.value.subSeries,
  async (newValue) => {
    if (newValue) {
      await loadTipoDocumental(newValue);
      formData.value.tipoDocumental = "";
      form.value.reset();
    }
  }
);

watch(
  () => formData.value.numeroIdentificacion,
  (newValue) => {
    if (newValue) {
      formData.value.expedientes = `EXP-2025-${
        formData.value.numeroIdentificacion == "N/A"
          ? "NA"
          : formData.value.numeroIdentificacion
      }`;
    }
  }
);

const filterDependencias = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      filteredDependencias.value = listadoDependencias.value;
    });
    return;
  }
  update(() => {
    filteredDependencias.value = listadoDependencias.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  });
};

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

const filterTiposDocumental = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      filteredTiposDocumentales.value = listadoTiposDocumentales.value;
    });
    return;
  }
  update(() => {
    filteredTiposDocumentales.value = listadoTiposDocumentales.value.filter(
      (option) => {
        return option.label.toLowerCase().includes(val.toLowerCase());
      }
    );
  });
};

const lengthValidation = (n, val: string) =>
  val.length <= n || "Máximo " + n + " caracteres";
</script>
