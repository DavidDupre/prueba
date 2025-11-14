<script setup lang="ts">
import Title from "src/shared/components/PrimeComponents/Fuentes/Title/Title.vue";
import Table from "src/shared/components/PrimeComponents/Table/Table.vue";
import { useDataMigracionesTRD } from "./DataMigracionesTRD";
import { ref, onMounted, watch } from "vue";
import Button from "src/shared/components/PrimeComponents/Button/Button.vue";

const {
  url,
  columns,
  isFilterVisible,
  actionFilter,
  allOfficesOptions,
  allOfices,
  serieOptions,
  seriesSubserie,
  typeDocuments,
  typeDocumentsOptions,
  codeInput,
  nameInput,
  statusInput,
  fetchData,
} = useDataMigracionesTRD();

watch(codeInput, (newOfficeId) => {
  if (newOfficeId) {
    seriesSubserie(newOfficeId);
  } else {
    serieOptions.value = [];
  }
});

const resetForm = () => {
  statusInput.value = "";
  codeInput.value = "";
  nameInput.value = "";
  isFilterVisible.value = false;
  fetchData();
};

onMounted(() => {
  allOfices();
  typeDocuments();
});
</script>

<template>
  <q-card class="tw-p-8 tw-rounded-lg" flat>
    <div class="tw-flex-1 tw-mb-8">
      <Title label="Migración de Tabla de Retención Documental" />
    </div>

    <!-- <div class="tw-w-full tw-flex tw-justify-end tw-mb-4">
      <Button type="primary" color="secondary" @click="actionFilter" :label="isFilterVisible ? 'Ocultar filtros' : 'Filtrar'" />
    </div> -->

    <q-form
      v-if="isFilterVisible"
      ref="formRef"
      greedy
      @submit.prevent="fetchData"
    >
      <div class="row items-center tw-gap-4">
        <div class="row tw-w-full tw-gap-4">
          <q-select
            dense
            outlined
            v-model="codeInput"
            :options="allOfficesOptions"
            :option-label="(option) => option.name"
            :option-value="(option) => option.id"
            map-options
            emit-value
            label="Oficina Productora"
            class="tw-w-1/2 tw-flex-1"
          />
          <q-select
            outlined
            dense
            type="text"
            v-model="nameInput"
            :options="serieOptions"
            :option-label="(option) => option.description"
            :option-value="(option) => option.series_subseries_id"
            map-options
            emit-value
            label="Serie / Suberie"
            class="tw-w-1/2 tw-flex-1"
          />
        </div>
        <div class="row tw-w-full tw-gap-4">
          <q-select
            outlined
            dense
            map-options
            emit-value
            name="Status"
            label="Tipo Documental"
            :options="typeDocumentsOptions"
            v-model="statusInput"
            class="tw-w-1/2"
          />
        </div>
      </div>
      <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
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
        />
      </div>
    </q-form>
    <Table
      :key="url"
      title="Registros Cargados"
      :columns="columns"
      :url="url"
      paramsPageSize="size"
      paramsPageNumber="page"
    />
  </q-card>
</template>
