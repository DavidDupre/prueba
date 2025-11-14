<template>
  <q-card class="tw-p-8 tw-rounded-lg" flat>
    <section class="tw-flex tw-justify-between tw-items-center tw-mb-8">
      <div class="tw-flex-1">
        <Title label="Migración de Tabla de Retención Documental" />
      </div>

      <div>
        <Button
          label="Cargar TRD"
          type="primary"
          color="secondary"
          type-button="submit"
          icon-right="upload"
          @click="onOpenFilePicker"
        />
        <q-file
          ref="filePicker"
          v-model="file"
          style="display: none"
          accept=".xlsx"
        />
      </div>
    </section>

    <Table title="Resultados" :url="url" :columns="columns" :key="count" />
  </q-card>

  <ConfirmModal
    :show-modal="showConfirmModal"
    text-show-modal="¿Desea continuar con el proceso de migración?"
    text-confirm-modal="Aceptar"
    text-cancel-modal="Cancelar"
    @confirm-modal="[onSendFile(file), (showConfirmModal = false)]"
    @update:show-modal="showConfirmModal = false"
  />

  <ErrorModalTable v-model:visible="showErrorsModal" :batch="currentBatch" />
</template>

<script lang="ts" setup>
import Title from "src/shared/components/PrimeComponents/Fuentes/Title/Title.vue";
import Button from "src/shared/components/PrimeComponents/Button/Button.vue";
import { useMigrarTRD } from "./MigrarTRD";
import Table from "src/shared/components/PrimeComponents/Table/Table.vue";
import ConfirmModal from "src/components/Modal/ConfirmModal.vue";
import ErrorModalTable from "src/shared/components/PrimeComponents/Modal/ErrorModalTable.vue";

const emit = defineEmits(["update:trd"]);

const {
  url,
  columns,
  filePicker,
  file,
  showConfirmModal,
  showErrorsModal,
  count,
  currentBatch,
  onOpenFilePicker,
  onSendFile,
} = useMigrarTRD(emit);
</script>
