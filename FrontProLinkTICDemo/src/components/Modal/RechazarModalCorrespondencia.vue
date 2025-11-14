<template>
  <q-dialog v-bind:model-value="showModal" persistent class="modal-custom-dialog">
    <q-card class="tw-p-[40px]   tw-w-[800px] tw-max-w-[800px] ">
      <q-card-section class="text-h6 tw-max-w-sm tw-px-0 tw-pt-0">
        <p class=" tw-text-xl tw-text-modal-blue-main-title text-weight-bold tw-ml-2">{{ props.title }}</p>
        <p class="tw-text-[16px] tw-mt-1 tw-text-modal-grey-subtitle tw-font-bold tw-ml-2">Escriba aquí la razón
          o motivo de rechazo.</p>
      </q-card-section>

      <q-card-section v-if="props.showGestionador || props.isRevisor" class="tw-px-0 tw-pt-0">
        <p class="tw-text-[16px] tw-text-modal-grey-subtitle tw-font-bold tw-ml-2">Gestionador</p>
        <p class="tw-text-md q-mt-sm tw-text-modal-grey-subtitle tw-ml-2">{{ props.gestionador }}</p>
      </q-card-section>

      <q-form @submit.prevent="onSubmit"
        @validation-error="toast.error('Debe diligenciar los campos obligatorios para continuar con el proceso')">
        <label class="tw-text-[16px] tw-text-label tw-text-modal-grey-subtitle tw-font-bold tw-ml-2">
          Observaciones * {{observations ? observations.length : '0'}}/{{props.motivoLimit}}</label>
        <q-input v-bind="$attrs" type="textarea" label="Inserte"
          class="font-normal tw-text-[16px] tw-w-full modal-custom-input tw-rounded-[28px] " outlined dense
          :rules="[isSuccess, (val) => maxLengthInput(props.motivoLimit, val), alphanumeric]" v-model="observations" />

        <q-card-actions align="center" class="q-mt-sm tw-gap-[20px]">
          <q-btn type="button" flat label="Cancelar" class="tw-h-12 text-weight-bold tw-text-md" style="width: 40%"
            color="secondary" @click="cancelModal = true" />
          <q-btn type="submit" flat label="Rechazar"
            class="tw-h-12 bg-secondary text-weight-bold tw-text-md !tw-bg-modal-black-button" style="width: 40%"
            color="white" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
  <Modal v-model="cancelModal" title="Confirmación" :is-success="false" @handleAccept="emitHideModal" cancel-button
    textButtonCancel="No" textButton="Si"
    text="Al cancelar el proceso perderá los datos ingresados en el motivo de rechazo, ¿desea realizar la acción?"
    @close-modal="cancelModal = false" type="button" />
</template>

<script lang="ts" setup>
import { maxLengthInput, alphanumeric } from "src/helpers/validations";
import { ref, watch } from "vue";
import { toast } from "src/helpers/toast";
import Modal from 'components/Modal/Modal.vue';



const props = withDefaults(
  defineProps<{
    showModal: boolean;
    title?: string;
    showGestionador?: boolean;
    gestionador?: string;
    motivoLimit?: number;
    isRevisor?: boolean;
  }>(),
  {
    motivoLimit: 1000,
    title: 'Rechazar caso'
  })
const emit = defineEmits(["updateModal", "hideModal"]);
const observations = ref("");
const cancelModal = ref(false);

const isSuccess = (val: string) => {
  val = val?.trim();

  if (val && val.length > 10) {
    return true;
  } else {
    return "El campo debe contener al menos 10  caracteres";
  }
};

const emitHideModal = () => {
  emit("hideModal", false);
};

const emitModalConfirm = () => {
  emit("updateModal", observations);
};

const onSubmit = () => {
  emitModalConfirm();
  //showModalCancel.value = true;
};

watch(
  () => props.showModal,
  (_) => {
    observations.value = "";
  }
);
</script>

<style scoped lang="scss">
.modal-custom-input {
  &::v-deep {
    .q-field__control.relative-position.row.no-wrap {
      height: 116px;
    }

    .q-field__inner.relative-position.col.self-stretch {
      margin-top: 3px;
    }

    textarea {
      color: theme('colors.modal-input');
      resize: none !important;
    }

    .q-field__control.relative-position.row.no-wrap {
      border-radius: 8px;
    }

  }
}
</style>
<style>
body {
  overflow-y: auto !important;
  overflow-x: auto !important;
}
</style>
