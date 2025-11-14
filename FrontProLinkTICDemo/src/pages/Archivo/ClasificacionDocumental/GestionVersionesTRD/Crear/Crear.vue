<template>
  <a
    v-if="!isEditing"
    @click.prevent="goBack"
    class="tw-text-primary q-mb-md block cursor-pointer"
    style="text-decoration: none"
  >
    <q-icon size="1.5em" name="chevron_left"></q-icon>
    <b>Regresar</b>
  </a>

  <q-card flat class="tw-p-8 tw-rounded-lg">
    <div class="tw-mb-6">
      <Title label="Gestionar Tablas de Retención Documental" />
    </div>
    <q-form
      ref="formTRD"
      @submit.prevent="openSubmitModal = true"
      greedy
      class="tw-grid tw-grid-cols-2 tw-gap-6"
    >
      <div>
        <Label label="Nombre/Versión de la TRD" :is-requiered="true" />
        <q-input
          v-model="formData.versionName"
          outlined
          dense
          label="Digite"
          :rules="[inputRequired, (v) => maxLengthInput(50, v)]"
          :disable="prevStatus == 'INACTIVA'"
        />
      </div>

      <div>
        <Label label="Tipo de Instrumento" :is-requiered="true" />
        <q-select
          v-model="formData.instrumentType"
          :options="tipoInstrumentoOptions"
          outlined
          dense
          :rules="[inputRequired]"
          label="Seleccione"
          :disable="prevStatus == 'INACTIVA'"
        />
      </div>

      <div>
        <Label label="Fecha Inicio de Aplicación" :is-requiered="true" />
        <q-input
          v-model="formData.startDate"
          type="date"
          outlined
          dense
          :rules="[inputRequired]"
          :max="formData.endDate"
          :disable="prevStatus == 'INACTIVA'"
        />
      </div>

      <div>
        <Label label="Fecha Final de Aplicación" />
        <q-input
          v-model="formData.endDate"
          type="date"
          outlined
          :rules="
            formData.status.toLowerCase() === 'inactiva' ? [inputRequired] : []
          "
          dense
          :min="formData.adoptionDate"
          :disable="!isEditing || prevStatus == 'INACTIVA'"
        />
      </div>

      <div>
        <Label label="Fecha de Aprobación" :is-requiered="isFieldsEnabled" />
        <q-input
          v-model="formData.approvalDate"
          :rules="isFieldsEnabled ? [inputRequired] : []"
          type="date"
          outlined
          dense
          @input="handleFieldChange"
          :min="formData.startDate"
          :max="fechaMaximaAprobacion"
          :disable="!isEditing || prevStatus == 'INACTIVA'"
        />
      </div>

      <div>
        <Label
          label="Acto Administrativo de Aprobación"
          :is-requiered="isFieldsEnabled"
        />
        <q-input
          v-model="formData.approvalAct"
          outlined
          dense
          :rules="[
            (v) => maxLengthInput(255, v),
            ...(isFieldsEnabled ? [inputRequired] : []),
          ]"
          label="Digite"
          @input="handleFieldChange"
          :disable="!isEditing || prevStatus == 'INACTIVA'"
        />
      </div>

      <div>
        <Label label="Fecha de Adopción" :is-requiered="isFieldsEnabled" />
        <q-input
          v-model="formData.adoptionDate"
          :rules="isFieldsEnabled ? [inputRequired] : []"
          type="date"
          outlined
          dense
          @input="handleFieldChange"
          :min="fechaMinimaAdopcion"
          :max="formData.endDate"
          :disable="!isEditing || prevStatus == 'INACTIVA'"
        />
      </div>

      <div>
        <Label
          label="Acto Administrativo de Adopción"
          :is-requiered="isFieldsEnabled"
        />
        <q-input
          v-model="formData.adoptionAct"
          outlined
          dense
          :rules="[
            (v) => maxLengthInput(255, v),
            ...(isFieldsEnabled ? [inputRequired] : []),
          ]"
          label="Digite"
          @input="handleFieldChange"
          :disable="!isEditing || prevStatus == 'INACTIVA'"
        />
      </div>

      <div>
        <Label label="Estado" :is-requiered="true" />
        <q-select
          v-model="formData.status"
          :options="estadoOptions"
          emit-value
          outlined
          dense
          @update:model-value="activarTRD"
          :rules="[inputRequired]"
          label="Seleccione"
          :disable="!isEditing || numberTRD == 0 || prevStatus == 'INACTIVA'"
        />
      </div>

      <div class="tw-flex tw-justify-center tw-gap-6 tw-col-span-2">
        <Button
          v-if="!isEditing || prevStatus === 'BORRADOR'"
          :label="isEditing ? 'Eliminar' : 'Cancelar'"
          type="tertiary"
          icon-left="circle-xmark"
          color="black"
          type-button="button"
          @click="isEditing ? (openModalEliminar = true) : router.back()"
        />
        <Button
          v-if="prevStatus != 'INACTIVA'"
          :label="isEditing ? 'Actualizar' : 'Guardar'"
          type="primary"
          color="primary"
          type-button="submit"
          icon-right="circle-arrow-right"
        />
      </div>
    </q-form>
  </q-card>

  <ConfirmModal
    :show-modal="openModalActivar"
    :text-show-modal="
      formData.status == 'INACTIVA' ? textInactivar : textActivar
    "
    text-confirm-modal="Aceptar"
    text-cancel-modal="Cancelar"
    @confirm-modal="openModalActivar = false"
    @update:show-modal="openModalActivar = false"
  />

  <ConfirmModal
    :show-modal="openModalEliminar"
    text-show-modal="¿Está seguro que desea eliminar la Tabla de Retención Documental? Recuerde que solamente se podrán eliminar tablas de Retención Documental que no tengan expedientes asociados."
    text-confirm-modal="Aceptar"
    text-cancel-modal="Cancelar"
    @confirm-modal="[eliminarVersion(), (openModalEliminar = false)]"
    @update:show-modal="openModalEliminar = false"
  />

  <ConfirmModal
    :show-modal="openSubmitModal"
    text-show-modal="¿Está seguro de la acción a realizar?"
    text-confirm-modal="Si"
    text-cancel-modal="No"
    @confirm-modal="
      [isEditing ? onUpdate() : submitForm(), (openSubmitModal = false)]
    "
    @update:show-modal="openSubmitModal = false"
  />
</template>
<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import { useTRDForm } from "./crear";
import Button from "src/shared/components/PrimeComponents/Button/Button.vue";
import Label from "src/shared/components/PrimeComponents/Label/Label.vue";
import { inputRequired, maxLengthInput } from "src/helpers/validations";
import ConfirmModal from "components/Modal/ConfirmModal.vue";
import Title from "src/shared/components/PrimeComponents/Fuentes/Title/Title.vue";
import { useRouter, useRoute } from "vue-router";

const props = defineProps<{ numberTRD: number }>();

const route = useRoute();
const {
  formData,
  tipoInstrumentoOptions,
  estadoOptions,
  prevStatus,
  isEditing,
  fechaMinimaAdopcion,
  fechaMaximaAprobacion,
  submitForm,
  formTRD,
  goBack,
  actualizarVersion,
  eliminarVersion,
  onUpdate,
} = useTRDForm();

const router = useRouter();

const openModalActivar = ref(false);
const openModalEliminar = ref(false);
const openSubmitModal = ref(false);
const openConfirmModal = ref(false);

const isEndDateEdited = ref(false);
const initialEndDate = ref(formData.value.endDate);

const isFieldsEnabled = ref(false);

const textActivar =
  "¡Recuerde que para aprobar una nueva versión de Tabla de Retención Documental usted debe registrar la siguiente información: Fecha de aprobación, acto administrativo de aprobación, Fecha de adopción, acto administrativo de adopción. Una vez realizada la activación no se podrán modificar las Oficinas Productoras, Series / Subseries o Tipologías documentales.";
const textInactivar =
  "¡Recuerde que para inactivar una nueva versión de Tabla de Retención Documental usted debe registrar la siguiente información: Fecha final de aplicación. ¿Desea continuar?";

const submit = () => {
  if (
    formData.value.endDate === ""
    // && isEditing.value === true
  ) {
    openModalActivar.value = true;
  } else {
    openConfirmModal.value = true;
  }
  // !isEditing ? (openModalActivar = true) : (openSubmitModal = true)
  // alert()
};

watch(
  () => formData.value.status,
  (newStatus) => {
    if (newStatus.toLowerCase() === "activa") {
      isFieldsEnabled.value = true;
    } else if (newStatus.toLowerCase() === "inactiva") {
      isFieldsEnabled.value = false;
    } else {
      isFieldsEnabled.value = false;
    }
  }
);

watch(
  () => formData.value.endDate,
  (newValue, oldValue) => {
    if (
      formData.value.status.toLowerCase() === "inactiva" &&
      newValue !== initialEndDate.value &&
      newValue !== oldValue
    ) {
      isEndDateEdited.value = true;
      // openConfirmModal.value = true;
    }
  },
  { flush: "sync" }
);

const handleFieldChange = () => {
  openConfirmModal.value = true;
};

watch(
  () => formData.value.adoptionDate,
  (newValue, oldValue) => {
    if (
      formData.value.status.toLowerCase() === "activa" &&
      newValue !== oldValue
    ) {
      // openConfirmModal.value = true;
    }
  }
);

watch(
  () => formData.value.approvalDate,
  (newValue, oldValue) => {
    if (
      formData.value.status.toLowerCase() === "activa" &&
      newValue !== oldValue
    ) {
      // openConfirmModal.value = true;
    }
  }
);

onMounted(() => {
  initialEndDate.value = formData.value.endDate;
});

const activarTRD = () => {
  if (
    (prevStatus.value.toLowerCase() == "borrador" &&
      formData.value.status.toLowerCase() == "activa") ||
    (prevStatus.value.toLowerCase() == "activa" &&
      formData.value.status.toLowerCase() == "inactiva")
  ) {
    openModalActivar.value = true;
  }
};

const handleConfirmAction = () => {
  openConfirmModal.value = false;
  isEndDateEdited.value = false;
};
</script>
