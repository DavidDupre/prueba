<script lang="ts" setup>
import {
  alphanumeric,
  inputRequired,
  maxLengthInput,
} from "src/helpers/validations";

import Label from "src/shared/components/PrimeComponents/Label/Label.vue";
import { useFormLogic } from "./GestionarDocumental";
import Button from "src/shared/components/PrimeComponents/Button/Button.vue";
import Table from "src/shared/components/PrimeComponents/Table/Table.vue";
import Chip from "primevue/chip";
import ConfirmModal from "src/components/Modal/ConfirmModal.vue";
import { ref, computed } from "vue";
import { toast } from "src/helpers/toast";
const {
  columns,
  url,
  // filters,
  optionsEstados,
  router,
  onFilterTable,
  actionFilter,
  resetForm,
  isFilterVisible,
  documentTypeCodeFilter,
  documentTypeNameFilter,
  statusFilter,
  tableKey,
  selectedTipology,
  selectedSeriesSubseries,
  showAsignarModal,
  selectTipo,
  seriesFiltered,
  onFilterSeries,
  asignarTipoDocumental,
  openSubmitModal,
  filterDependenciasByName,
  filterDependencias,
  dependencia,
  serie,
  onFilterSubseries,
  subseriesFiltered
  // onFilterSubSeries,
} = useFormLogic();

import { useRoute } from "vue-router";
const route = useRoute();

const remove = (seriesSubserie) => {
  selectedSeriesSubseries.value = selectedSeriesSubseries.value.filter(
    (p) => p.value !== seriesSubserie.value
  );
};
const isSearchDisabled = computed(() => {
  return !documentTypeNameFilter.value && statusFilter.value === "";
});
</script>

<template>
  <div>
    <q-card class="tw-rounded-lg tw-p-8" flat>
      <section class="tw-flex tw-flex-col tw-gap-8 tw-mb-8">
        <div class="tw-flex tw-justify-between tw-gap-4">
          <div class="tw-flex-1">
            <Title label="Gestionar Tipo Documental" />
          </div>
          <div>
            <Button
              label="Agregar nuevo tipo documental"
              type="primary"
              color="primary"
              icon-right="circle-arrow-right"
              @click="
                router.push(`/clasificacion-documental/tipo-documental/crear?versionTrd=${route.params.id}`)
              "
            />
          </div>
        </div>
        <q-form
          ref="formRef"
          greedy
          @submit="onFilterTable"
          class="tw-grid tw-grid-cols-2 tw-gap-6"
        >
          <div>
            <Label label="Nombre del tipo documental" />
            <q-input
              outlined
              v-model="documentTypeNameFilter"
              dense
              :rules="[alphanumeric, (val) => maxLengthInput(255, val)]"
            />
          </div>
          <div>
            <Label label="Estado" />
            <q-select
              outlined
              dense
              map-options
              emit-value
              :options="[
                { value: true, label: 'ACTIVO' },
                { value: false, label: 'INACTIVO' },
              ]"
              name="Status"
              v-model="statusFilter"
            />
          </div>
          <div class="tw-col-span-2 tw-flex tw-justify-center tw-gap-4">
            <Button
              label="Limpiar"
              type="tertiary"
              color="black"
              type-button="button"
              @click="resetForm"
              icon-left="circle-xmark"
            />
            <Button
              label="Buscar"
              type="primary"
              color="primary"
              type-button="submit"
              icon-right="search"
              :disabled="isSearchDisabled"
              class="button-disabled-white"
            />
          </div>
        </q-form>
      </section>

      <div
        v-if="selectedTipology ? selectedTipology.length > 0 : false"
        class="tw-mb-4 tw-flex tw-justify-end"
      >
        <Button
          label="Asociar a Serie/Subserie"
          color="secondary"
          @click="showAsignarModal = true"
          type="primary"
        />
      </div>

      <Table
        :columns="columns"
        :isSeleccion="true"
        :url="url"
        :key="tableKey"
        :show-search="false"
        @update:selected="selectTipo"
      />
    </q-card>
  </div>
  <q-form greedy>
    <q-dialog v-model="showAsignarModal" persistent>
      <q-card class="q-py-xl q-px-xl tw-max-w-2xl tw-w-full">
        <q-card-section>
          <div>
            <Label label="Dependencia" />
            <q-select
              v-model="dependencia"
              dense
              outlined
              option-value="value"
              option-label="label"
              map-options
              fill-input
              emit-value
              :options="filterDependencias"
              @filter="filterDependenciasByName"
              :rules="[inputRequired]"
              class="tw-mt-2 tw-rounded-lg"
            ></q-select>
          </div>
          <div>
            <Label label="Serie" />
            <q-select
              v-model="serie"
              dense
              outlined
              option-value="value"
              option-label="label"
              map-options
              fill-input
              :options="seriesFiltered"
              @filter="onFilterSeries"
              :rules="[inputRequired]"
              class="tw-mt-2 tw-rounded-lg"
            ></q-select>
          </div>
          <div>
            <Label label="Subserie" />
            <q-select
              v-model="selectedSeriesSubseries"
              dense
              outlined
              multiple
              option-value="value"
              option-label="label"
              map-options
              use-input
              fill-input
              :options="subseriesFiltered"
              @filter="onFilterSubseries"
              :rules="[inputRequired]"
              class="tw-mt-2 tw-rounded-lg"
            ></q-select>
          </div>
          <div class="card flex flex-wrap gap-2 tw-gap-4">
            <Chip
              v-for="seriesSubserie in selectedSeriesSubseries"
              :key="seriesSubserie.value"
              :label="seriesSubserie.label"
              removable
              @remove="remove(seriesSubserie)"
              class="!tw-bg-primary !tw-text-white !tw-border-none !tw-rounded-lg !tw-p-2"
            />
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-mt-sm tw-gap-4">
          <Button
            label="Cancelar"
            color="black"
            type-button="button"
            type="tertiary"
            @click="(showAsignarModal = false), (selectedSeriesSubseries = [])"
            icon-left="circle-xmark"
          />
          <Button label="Aceptar" color="primary" type="primary" @click="openSubmitModal = true" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-form>
  <ConfirmModal
    :show-modal="openSubmitModal"
    text-show-modal="¿Está seguro de la acción a realizar?"
    text-confirm-modal="Si"
    text-cancel-modal="No"
    @confirm-modal="asignarTipoDocumental"
    @update:show-modal="
      [
        (openSubmitModal = false),
        toast.success('Cancelación Exitosa'),
      ]
    "
  />
</template>

<style lang="scss">
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.button-disabled-white {
  &:disabled,
  &[disabled] {
    color: white !important;
  }
}
</style>
