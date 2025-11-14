<template>
  <q-dialog persistent v-bind:model-value="showModal">
    <q-card class="q-py-lg q-px-xl">
      <img class="q-mx-auto" style="width: 100px" v-lazy :data-url="InterrogationModal" />
      <q-card-section class="text-h6 tw-max-w-sm text-center text-weight-bold">
        Confirmación
      </q-card-section>

      <p class="tw-max-w-sm text-center tw-text-lg">
        {{ textShowModal }}
      </p>

      <section class="tw-flex tw-justify-between tw-mt-2">
        <article class="tw-flex tw-flex-col tw-items-center">
          <p class="tw-mt-1">Firma completa</p>
          <q-checkbox v-model="checkFirma" @blur="selectFirma(1)" />
        </article>
        <article class="tw-flex tw-flex-col tw-items-center">
          <p class="tw-mt-1">Firma génerica con las iniciales</p>
          <q-checkbox v-model="checkFirma1" @blur="selectFirma(2)" />
        </article>
      </section>
      <q-card-actions align="center" class="q-mt-lg">
        <q-btn v-if="!loading" type="button" flat :label="textConfirmModal"
          class="tw-h-12 bg-secondary text-weight-bold tw-text-lg" style="width: 50%" color="white"
          @click="emitConfirmModal" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import InterrogationModal from "src/assets/interrogation-modal.svg";
import { toast } from 'src/helpers/toast';

const props = withDefaults(defineProps<{
  showModal: boolean;
  textShowModal: string;
  textCancelModal: string;
  textConfirmModal: string;
  persistent: boolean;
  loading?: boolean
}>(), {
  persistent: false,
});

const checkFirma = ref(false);
const checkFirma1 = ref(false);
const selectedFirma = ref()

const emit = defineEmits(["confirmModal", "update:showModal"]);

const emitConfirmModal = () => {
  if (!selectedFirma.value) {
    toast.error("Debes seleccionar una opción")
    return
  }

  emit("confirmModal", selectedFirma.value);
};

const selectFirma = (selected) => {
  if (selected === 1) {
    checkFirma.value = true;
    checkFirma1.value = false;
    selectedFirma.value = 1;
  }
  else if (selected === 2) {
    checkFirma.value = false;
    checkFirma1.value = true;
    selectedFirma.value = 2;
  }
  else {
    checkFirma.value = false;
    checkFirma1.value = false;
    selectedFirma.value = undefined;
  }

  selectedFirma.value = selected
};

watch([checkFirma, checkFirma1], ([firma, firma1]) => {
  if (!firma && !firma1) {
    selectedFirma.value = 0;
  }
});
</script>
