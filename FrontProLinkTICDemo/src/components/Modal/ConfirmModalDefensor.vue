<template>
  <q-dialog v-bind:model-value="showModal">
    <q-card class="q-py-md q-px-md tw-w-full tw-p-6">
      <div class="tw-p-2 tw-px-4">
        <p class="tw-text-2xl text-weight-bold tw-text-[#173141]">Respuesta</p>
      </div>

      <q-card-section v-if="props.showGestionador">
        <p class="tw-text-md text-weight-bold tw-text-[#717171]">Gestionador</p>
        <p class="tw-text-md q-mt-sm tw-text-[#666666]">{{ props.gestionadorFirst + ' ' + props.gestionadorLast }}</p>
      </q-card-section>

      <q-card-section v-if="props.showAprobador">
        <p class="tw-text-md text-weight-bold tw-text-[#717171]">Aprobador</p>
        <p class="tw-text-md q-mt-sm tw-text-[#666666]">{{ props.aprobadorFirst + ' ' + props.aprobadorLast }}</p>
      </q-card-section>

      <q-card-actions align="center" class="q-mt-sm">
        <q-btn type="button" flat :label="textCancelModal" class="tw-h-12 text-weight-bold tw-text-md"
          style="width: 40%" color="secondary" @click="$emit('update:showModal', false)" v-close-popup />
        <q-btn type="button" flat :label="textConfirmModal" class="tw-h-12 bg-secondary text-weight-bold tw-text-md"
          style="width: 40%" color="white" @click="emitConfirmModal" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
const props = defineProps<{
  showModal: boolean;
  textShowModal: string;
  textCancelModal: string;
  textConfirmModal: string;
  showGestionador?: boolean;
  gestionadorFirst?: string;
  gestionadorLast?: string;
  aprobadorFirst?: string;
  aprobadorLast?: string;
  showAprobador?: string;
}>();
const emit = defineEmits(["confirmModal", "update:showModal"]);

const emitConfirmModal = () => {
  emit("confirmModal");
};
</script>
