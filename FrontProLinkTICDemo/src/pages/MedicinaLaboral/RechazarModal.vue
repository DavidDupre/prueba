<template>
  <q-dialog v-bind:model-value="showModal" persistent class="modal-custom-dialog">
    <q-card class="tw-px-10 tw-pt-5 tw-w-[700px] tw-pb-4">
      <q-card-section class="text-h6 tw-max-w-sm tw-px-0 tw-pt-0">
        <p class=" tw-text-xl tw-text-modal-blue-main-title text-weight-bold">{{ props.title }}</p>
      </q-card-section>
      <q-form @submit.prevent="onSubmit"
        @validation-error="toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos')">
        <label class="tw-text-[16px] tw-text-label tw-text-modal-grey-subtitle tw-font-bold">Escriba
          aquí su motivo de rechazo * {{ observations.length }} / {{props.motivoLimit }}</label>
        <q-input v-bind="$attrs" type="textarea" label="Inserte"
          class="font-normal tw-text-[14px] tw-w-full modal-custom-input tw-rounded-[28px]" outlined dense
          :rules="[isSuccess, (val) => maxLengthInput(props.motivoLimit, val)]" v-model="observations" />
        <q-card-actions align="center" class="q-mt-sm tw-gap-[20px]">
          <q-btn type="button" flat label="Cancelar" class="tw-h-12 text-weight-bold tw-text-md" style="width: 40%"
            color="secondary" @click="emitHideModal" />
          <q-btn type="submit" flat label="Rechazar"
            class="tw-h-12 bg-secondary text-weight-bold tw-text-md !tw-bg-modal-black-button" style="width: 40%"
            color="white" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { maxLengthInput } from "src/helpers/validations";
import { ref, watch } from "vue";
import { toast } from "src/helpers/toast";
import Modal from 'components/Modal/Modal.vue';

const props = withDefaults(
  defineProps<{
    showModal: boolean;
    title?: string;
    showGestionador?: boolean;
    gestionador?: string;
    motivoLimit?: number
  }>(),
  {
    motivoLimit: 1000,
    title: 'Motivo de Rechazo'
  })
const emit = defineEmits(["updateModal", "hideModal"]);
const observations = ref("");
const cancelModal = ref(false)

const isSuccess = (val: string) => {
  val = val?.trim();

  if (val && val.length > 10) {
    return true;
  } else {
    return "* El campo debe contener al menos 10 caracteres";
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
