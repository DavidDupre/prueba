<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
      <a
        @click.prevent="goBack"
        class="text-primary q-mb-md block cursor-pointer"
        style="text-decoration: none"
      >
        <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
        <b> Regresar</b>
      </a>
      <Title :label="`${isEditing ? 'Gestionar' : 'Crear'} Tipo Documental`" />
      <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
        <q-form ref="formRef" greedy>
          <div class="tw-grid tw-grid-cols-4 tw-gap-6">
            <div class="tw-col-span-2">
              <Label label="Nombre del Tipo Documental" :is-requiered="true" />
              <q-input
                v-model="formData.nombreTipoDocumental"
                dense
                label="Inserte"
                outlined
                class="tw-rounded-lg"
                :rules="[
                  (v) => maxLengthInput(255, v),
                  inputRequired,
                  alphanumeric,
                ]"
              />
            </div>
            <div class="tw-col-span-2">
              <Label label="Código de plantilla de calidad" />
              <q-input
                v-model="formData.codigoDocumentoCalidad"
                dense
                label="Inserte"
                outlined
                class="tw-rounded-lg"
                :rules="[
                  (v) => maxLengthInput(100, v),
                  alphanumeric,
                ]"
                type="text"
                maxlength="255"
              />
            </div>
            <div class="tw-col-span-2">
              <Label label="Nombre Corto" :is-requiered="true" />
              <q-input
                v-model="formData.nombreCorto"
                dense
                label="Inserte"
                outlined
                class="tw-rounded-lg"
                :rules="[
                  (v) => maxLengthInput(255, v),
                  alphanumeric,
                  inputRequired,
                ]"
                type="text"
                maxlength="255"
              />
            </div>
            <div class="tw-col-span-2">
              <Label label="Estado" :is-requiered="true" />
              <q-select
                v-model="formData.estado"
                dense
                label="Seleccione"
                outlined
                :options="estadoOptions"
                class="tw-rounded-lg"
                :rules="[inputRequired]"
              />
            </div>
            <div class="tw-col-span-2">
              <Label label="Tipo de Soporte" :is-requiered="true" />
              <q-select
                v-model="formData.tipoSoporte"
                dense
                label="Seleccione"
                outlined
                :options="tipoSoporteOptions"
                class="tw-rounded-lg"
                :rules="[inputRequired]"
              />
            </div>
          </div>
        </q-form>
        <div v-if="isEditing" class="tw-flex justify-end">
          <div class="tw-flex tw-gap-4">
            <!-- <Button
              label="Eliminar"
              type="tertiary"
              color="black"
              type-button="button"
              @click="handleShowModal"
              icon-left="circle-xmark"
            /> -->

            <Button
              label="Actualizar"
              type="primary"
              @click="onSubmit"
              color="primary"
              type-button="button"
              icon-right="circle-arrow-right"
            />
          </div>
        </div>
        <div v-else class="tw-flex justify-end">
          <div class="tw-flex tw-gap-4">
            <Button
              label="Crear"
              type="primary"
              color="primary"
              icon-right="circle-arrow-right"
              type-button="button"
              @click="onSubmit"
            />
          </div>
        </div>
      </q-card>
    </main>
  </section>
  <ConfirmModal
    :show-modal="showModal"
    text-show-modal="¿Está seguro que desea eliminar tipo documental, recuerda que solamente se podrán tipo documental que no tengan expedientes asociados?"
    text-confirm-modal="Aceptar"
    text-cancel-modal="Cancelar"
    @confirm-modal="onDelete"
    @update:show-modal="showModal = false"
  />
</template>

<script lang="ts" setup>
import { useFormLogic } from "./crear";

import {
  alphanumeric,
  inputRequired,
  maxLengthInput,
  preciseLengthInput,
} from "src/helpers/validations";
import ConfirmModal from "components/Modal/ConfirmModal.vue";
import Button from "src/shared/components/PrimeComponents/Button/Button.vue";
import Label from "src/shared/components/PrimeComponents/Label/Label.vue";
import Title from "src/shared/components/PrimeComponents/Fuentes/Title/Title.vue";
import { tipoSoporteOptions } from "./crear";

const {
  step,
  formRef,
  isEditing,
  showModal,
  editDocType,
  formData,
  selectedDependencia,
  selectedUsuario,
  selectedMetadato,
  dependenciasDisponibles,
  usuariosDisponibles,
  metadatosDisponibles,
  clasificacionSeguridadOptions,
  estadoOptions,
  prevStep,
  nextStep,
  goBack,
  validateForm,
  addDependencia,
  removeDependencia,
  addUsuario,
  removeUsuario,
  addMetadato,
  removeMetadato,
  onSubmit,
  onDelete,
  handleShowModal,
} = useFormLogic();
</script>
