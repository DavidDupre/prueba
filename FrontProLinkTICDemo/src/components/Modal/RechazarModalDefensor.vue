<template>
  <q-dialog v-bind:model-value="showModal">
    <q-card class="q-py-md q-px-md md:tw-w-[80%]">
      <div class="tw-p-2 tw-px-4 tw-mt-2">
        <p class="tw-text-xl text-weight-bold tw-text-[#173141]">{{ props.title }}</p>
      </div>

      <q-card-section v-if="props.showGestionador">
        <p class="tw-text-md text-weight-bold tw-text-[#717171]">Gestionador</p>
        <p class="tw-text-md q-mt-sm tw-text-[#666666]">{{ props.gestionadorFirst + ' ' + props.gestionadorLast }}</p>
      </q-card-section>

      <q-form class="tw-p-2 tw-px-4" ref="form">
        <label class="tw-text-label tw-font-bold">Observaciones</label>
        <q-input v-bind="$attrs" type="textarea" label="Inserte" outlined dense
          :rules="[isSuccess, (val) => maxLengthInput(1000, val)]" v-model="observations"
          @keypress="onlyAlphaNumeric" />
        <q-card-actions align="center" class="q-mt-sm">
          <q-btn type="button" flat label="Cancelar" class="tw-h-12 text-weight-bold tw-text-md" style="width: 40%"
            color="secondary" @click="emitHideModal" />
          <q-btn type="button" flat label="Rechazar" class="tw-h-12 bg-secondary text-weight-bold tw-text-md"
            style="width: 40%" color="white" @click="onSubmit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { maxLengthInput } from "src/helpers/validations";
import { toast } from "src/helpers/toast";
const props = withDefaults(
  defineProps<{
    showModal: boolean;
    title?: string;
    showGestionador?: boolean;
    gestionadorFirst?: string;
    gestionadorLast?: string;
  }>(),
  {
    title: 'Rechazar'
  })
const emit = defineEmits(["updateModal", "hideModal"]);
const observations = ref("");
const form = ref()
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

const onSubmit = async () => {
  if (await form.value.validate()) {
    emitModalConfirm();
  } else {
    toast.error("Por favor registre el motivo de rechazo para continuar")
  }
};

watch(
  () => props.showModal,
  (_) => {
    observations.value = "";
  }
);

function onlyAlphaNumeric(event: { which: any; keyCode: any; preventDefault: () => void; }) {
  let charCode = (event.which) ? event.which : event.keyCode;
  let charTyped = String.fromCharCode(charCode);
  let regex = /^[a-zA-Z0-9 áéíóúÁÉÍÓÚÑñ]*$/;
  if (regex.test(charTyped)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}
</script>
