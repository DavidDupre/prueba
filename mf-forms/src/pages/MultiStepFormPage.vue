<template>
  <div class="q-pa-md q-pt-none">
    <div class="q-pt-md">
      <router-link
        to="/home"
        class="text-primary"
        style="text-decoration: none"
      >
        <q-btn flat color="primary" label="Volver" icon="chevron_left" />
      </router-link>
    </div>

    <div class="row justify-between items-center q-pt-md">
      <h1 class="text-h4 text-bold q-my-auto">
        Radicación Ministerio de Trabajo
      </h1>
    </div>
    <div class="q-mt-md">
      <q-linear-progress size="8px" :value="progressValue" color="primary" />
      <div class="row" :class="gridColsClass" style="padding: 20px">
        <div v-for="(s, i) in formStructure.steps" :key="i" class="col">
          <h4
            class="text-caption text-center"
            style="font-size: 15px"
            :class="step >= i ? 'text-grey-800' : 'text-grey-5'"
          >
            <b>{{ s.name }}</b> <br />
            <span
              class="text-caption"
              style="font-size: 14px"
              :class="step >= i ? 'text-grey-6' : 'text-grey-4'"
              >{{ s.description }}</span
            >
          </h4>
        </div>
      </div>
    </div>

    <q-card class="q-mt-md" flat bordered>
      <q-tab-panels keep-alive v-model="step" animated class="bg-transparent">
        <q-tab-panel
          v-for="(s, i) in formStructure.steps"
          :key="i"
          :name="i"
          class="q-pa-none"
        >
          <component
            v-if="stepComponents[i]"
            :is="stepComponents[i]"
            :model-value="formData"
            @update:model-value="updateFormData"
            @next-step="handleNextStep"
            @prev-step="prevStep"
            @cancel="cancelModal = true"
          />

          <div v-else class="q-pa-xl">
            <h5 class="text-h6">{{ s.name }}</h5>
            <p class="text-body1">{{ s.description }}</p>
            <q-input
              v-model="formData[`step${i + 1}_dato`]"
              :label="`Información para ${s.name}`"
              outlined
              class="q-mt-md"
            />
          </div>
        </q-tab-panel>
      </q-tab-panels>
      <div class="flex justify-center items-center q-gutter-x-md q-pb-xl">
        <q-btn
          v-if="step > 0"
          label="Regresar"
          icon="chevron_left"
          color="primary"
          @click="prevStep"
          style="
            padding: 18px 60px;
            border-radius: 8px;
            width: 240px;
            height: 48px;
          "
          no-caps
        />
        <q-btn
          outline
          color="secondary"
          label="Cancelar"
          @click="modalVisibleCancelar = true"
          style="
            padding: 18px 60px;
            border-radius: 8px;
            width: 240px;
            height: 48px;
          "
        />
        <q-btn
          ref="btnContinuar"
          color="primary"
          @click="handleNextStep"
          :label="isLastStep ? 'Radicar' : 'Siguiente'"
          :icon-right="'chevron_right'"
          style="
            padding: 18px 60px;
            border-radius: 8px;
            width: 240px;
            height: 48px;
          "
        />
      </div>
    </q-card>

    <MultiPurposeDialog
      v-if="modalVisibleGuardar"
      type="question"
      title="Se ha radicado con éxito Ministerio del Trabajo"
      description="Trámite de Ministerio del Trabajo se ha generado correctamente, con número de radicado <strong>ENT20250000875753</strong>"
      download-label="Descargar"
      accept-label="Finalizar"
      :action="saveChanges"
      :download-action="downloadDocument"
      :cancel-action="
        () => {
          modalVisibleGuardar = false;
          return false;
        }
      "
    />

    <MultiPurposeDialog
      v-if="modalVisibleCancelar"
      type="question"
      title="Cancelar"
      description="¿Está seguro de cancelar el proceso de radicación de la solicitud del Ministerio del Trabajo?"
      accept-label="Si"
      cancel-label="No"
      :action="cancelChanges"
      :cancel-action="
        () => {
          modalVisibleCancelar = false;
          return false;
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import FormStep1 from "../components/FormStep1.vue";
import FormStep2 from "../components/FormStep2.vue";
import FormStep3 from "../components/FormStep3.vue";
import FormStep4 from "../components/FormStep4.vue";
import MultiPurposeDialog from "@shell/components/MultiPurposeDialog.vue";

const step = ref(0);
const showSuccessModal = ref(false); // No se usa, se puede eliminar
const cancelModal = ref(false);
const modalVisibleGuardar = ref(false);
const modalVisibleCancelar = ref(false);
const router = useRouter();

const formStructure = ref({
  title: "Radicación Ministerio de Trabajo",
  steps: [
    { name: "Remitente", description: "Selección de usuarios remitentes" },
    {
      name: "Datos afectado",
      description: "Selección de datos del afectado",
    },
    {
      name: "Información de la solicitud",
      description: "Información de la solicitud",
    },
    {
      name: "Documentos adjuntos",
      description: "Adjuntar documentos",
    },
  ],
});

// Array de componentes para cada step
const stepComponents = [FormStep1, FormStep2, FormStep3, FormStep4];

const formData = reactive({});

const isLastStep = computed(
  () => step.value === formStructure.value.steps.length - 1
);
const progressValue = computed(
  () => (step.value + 1) / formStructure.value.steps.length
);
const gridColsClass = computed(
  () => `row-cols-${formStructure.value.steps.length}`
);

const prevStep = () => step.value--;

const updateFormData = (val: any) => {
  // Filtrar propiedades del evento (isTrusted, _vts, etc.) y propiedades no válidas
  Object.keys(val).forEach((key) => {
    if (
      !key.startsWith("_") &&
      key !== "isTrusted" &&
      key !== "type" &&
      key !== "target"
    ) {
      formData[key] = val[key];
    }
  });
};

const handleNextStep = (data: any) => {
  Object.assign(formData, data);
  if (isLastStep.value) {
    console.log("Formulario enviado:", formData); // Lógica de envío final
    modalVisibleGuardar.value = true;
  } else {
    step.value++;
  }
};

const saveChanges = () => {
  // Aquí va la lógica para guardar los datos
  console.log("Guardando cambios:", formData);
  modalVisibleGuardar.value = false;
  router.push("/home");
  return true;
};

const downloadDocument = () => {
  // Aquí va la lógica para descargar el documento
  console.log("Descargando documento con datos:", formData);

  // Ejemplo: crear y descargar un archivo JSON con los datos del formulario
  const dataStr = JSON.stringify(formData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `radicado_ENTAAAAXXXXXXX_${
    new Date().toISOString().split("T")[0]
  }.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
};

const cancelChanges = () => {
  // Lógica para cancelar el proceso
  console.log("Cancelando proceso de radicación");
  modalVisibleCancelar.value = false;
  step.value = 0;
  Object.keys(formData).forEach((key) => delete formData[key]);
  router.push("/home");
  return true;
};

const onCancel = () => {
  step.value = 0;
  Object.keys(formData).forEach((key) => delete formData[key]);
  router.push("/home");
};

const closeSuccess = () => {
  // No se usa, se puede eliminar
  showSuccessModal.value = false;
  onCancel();
};
</script>

<style scoped>
/* Sobrescribe los shadows del monolito con máxima prioridad */
:deep(.q-field--outlined .q-field__control:before),
:deep(.q-field--outlined .q-field__control:after),
:deep(.q-field__control:before),
:deep(.q-field__control:after) {
  box-shadow: none !important;
}

:deep(.q-checkbox__bg) {
  box-shadow: none !important;
}
</style>
