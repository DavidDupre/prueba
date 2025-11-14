<script setup lang="ts">
import {
  inputRequired,
  maxLengthInput,
  alphanumeric,
} from "src/helpers/validations";

import {
  faseOptions,
  statusOptions,
  useInformacionExpediente,
} from "./InformacionExpediente";

import FileLoader from "src/components/FormFields/FileLoader.vue";
import ConfirmModal from "src/components/Modal/ConfirmModal.vue";
import { FormDataExpediente } from "src/interfaces/Expediente";
import { ref, watch } from "vue";
import { toast } from "src/helpers/toast";
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";
import Title from "src/shared/components/PrimeComponents/Fuentes/Title/Title.vue";
import Button from "src/shared/components/PrimeComponents/Button/Button.vue";
import Label from "src/shared/components/PrimeComponents/Label/Label.vue";
const props = defineProps<{
  process?: string;
  expediente?: FormDataExpediente;
}>();
const emit = defineEmits(["onChangeForm"]);
const {
  dependenciesFiltered,
  seriesFiltered,
  subSeriesFiltered,
  formData,
  user,
  creating,
  files,
  router,
  showModalSend,
  openSubmitModal,
  closeRecord,
  prevStatus,
  // dependency,
  // serie,
  // subserie,
  onFilterDependencies,
  onFilterSeries,
  onFilterSubSeries,
  onSetSeries,
  onSetSubSeries,
  onSubmit,
  onSendFile,
  onChangeForm,
  rejectedFiles,
  validateFile,
  validateForm,
  cancelar,
  onCloseRecord,
  clear,
  onSetSubserieValue,
  metadataInputs,
  handleTransfer,
  showApprovalModal,
  cancelApproval,
  formReclasificar,
  reclasificarExpediente,
  formReclasificacion,
  filteredTiposDocumentales,
  filterTiposDocumental,
} = useInformacionExpediente(emit, props.process, props.expediente);

// watch(
//   () => formData.value.status,
//   (newStatus) => {
//     if (!newStatus) {
//     } else {
//       formData.value.closeDate = null;
//     }
//   }
// );

const validateDateFuture = (val) => {
  const today = new Date();
  const selectedDate = new Date(val);
  if (selectedDate > today) {
    return false;
  }
  return true;
};
</script>

<template>
  <!-- <a
    v-if="creating && !process"
    @click.prevent="router.back()"
    class="text-primary block tw-cursor-pointer tw-pointer tw-mb-5"
    style="text-decoration: none"
  >
    <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
    <b>Regresar</b>
  </a> -->

  <q-card flat class="tw-rounded-lg tw-p-8">
    <!-- <div v-if="creating" class="tw-mb-8">
      <Title v-if="!process" label="Crear Expediente" />
    </div> -->
    <q-form
      @submit.prevent="openSubmitModal = true"
      @validation-error="validateForm()"
      class="tw-grid tw-grid-cols-2 tw-gap-6 tw-mb-2"
      greedy
    >
      <div>
        <Label label="Dependencia" :is-requiered="true" />
        <q-select
          v-model="formData.dependency"
          emit-value
          map-options
          outlined
          dense
          use-input
          hide-selected
          fill-input
          clearable
          :options="dependenciesFiltered"
          @filter="onFilterDependencies"
          @update:model-value="onSetSeries"
          @clear="clear(['dependency', 'series', 'subseries'])"
          :rules="[inputRequired]"
          class="tw-mt-2 tw-rounded-lg"
        ></q-select>
        <!-- <q-input
          v-if="!creating"
          v-model="formData.dependency.name"
          disable
          outlined
          dense
          class="tw-mt-2 tw-rounded-lg"
        ></q-input> -->
      </div>
      <div>
        <Label label="Serie" :is-requiered="true" />
        <q-select
          v-model="formData.series"
          emit-value
          map-options
          outlined
          dense
          use-input
          hide-selected
          fill-input
          clearable
          :options="seriesFiltered"
          @filter="onFilterSeries"
          @update:model-value="onSetSubSeries"
          @clear="clear(['series', 'subseries'])"
          :rules="[inputRequired]"
          class="tw-mt-2 tw-rounded-lg"
        ></q-select>
        <!-- <q-input
          v-if="!creating"
          v-model="formData.series.description"
          disable
          outlined
          dense
          class="tw-mt-2 tw-rounded-lg"
        ></q-input> -->
      </div>
      <div>
        <Label label="Subserie" :is-requiered="true" />
        <q-select
          v-model="formData.subseries"
          emit-value
          map-options
          outlined
          dense
          use-input
          hide-selected
          fill-input
          clearable
          :rules="[inputRequired]"
          :options="subSeriesFiltered"
          @filter="onFilterSubSeries"
          @update:model-value="onSetSubserieValue"
          @clear="formData.subseries = null"
          class="tw-mt-2 tw-rounded-lg"
        ></q-select>
        <!-- <q-input
          v-if="!creating"
          v-model="formData.subseries.description"
          disable
          outlined
          dense
          class="tw-mt-2 tw-rounded-lg"
        ></q-input> -->
      </div>
      <div>
        <Label label="Tipo Documental" :is-requiered="true" />
        <q-select
          :options="filteredTiposDocumentales"
          map-options
          outlined
          dense
          use-input
          hide-selected
          fill-input
          clearable
          v-model="formData.tipoDocumental"
          label="Inserte"
          :rules="[inputRequired]"
          @filter="filterTiposDocumental"
          class="tw-mt-2 tw-rounded-lg"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Sin resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div>
        <Label label="Código del Expediente" :is-requiered="true" />
        <q-input
          v-model="formData.identificationCode"
          type="text"
          outlined
          dense
          :disable="!creating"
          class="tw-mt-2 tw-rounded-lg"
        ></q-input>
      </div>
      <div>
        <Label label="Nombre del Expediente" :is-requiered="true"></Label>
        <q-input
          v-model="formData.title"
          type="text"
          outlined
          dense
          :disable="!creating"
          class="tw-mt-2 tw-rounded-lg"
          :rules="[inputRequired]"
        ></q-input>
      </div>
      <div>
        <Label label="Estado" :is-requiered="false" />
        <q-select
          v-model="formData.status"
          emit-value
          map-options
          dense
          outlined
          :options="statusOptions"
          class="tw-mt-2 tw-rounded-lg"
        />
      </div>
      <!-- <div>
        <Label label="Tomo" :is-requiered="true"></Label>
        <q-input
          v-model="formData.tomo"
          type="text"
          outlined
          dense
          class="tw-mt-2 tw-rounded-lg"
          :rules="[
            inputRequired,
            alphanumeric,
            (val) => maxLengthInput(10, val),
          ]"
        ></q-input>
      </div> -->
      <div>
        <Label label="Fase de Archivo" :is-requiered="true" />
        <q-select
          v-model="formData.phaseFile"
          emit-value
          map-options
          dense
          outlined
          :options="faseOptions"
          :rules="[inputRequired]"
          class="tw-mt-2 tw-rounded-lg"
        ></q-select>
      </div>
      <div>
        <Label label="Usuario Creador" :is-requiered="false" />
        <q-input
          v-model="user"
          emit-value
          map-options
          outlined
          dense
          use-input
          hide-selected
          fill-input
          disable
          class="tw-mt-2 tw-rounded-lg"
        ></q-input>
      </div>
      <div>
        <Label label="Fecha de Creación del Expediente" :is-requiered="true" />
        <q-input
          v-model="formData.createDate"
          type="date"
          dense
          outlined
          disable
          class="tw-mt-2 tw-rounded-lg"
          :rules="[inputRequired]"
        ></q-input>
        <!-- <DatePickerInput v-model="date" /> -->
      </div>
      <div>
        <Label label="Fecha de Cierre" :is-requiered="false" />
        <q-input
          v-model="formData.closeDate"
          type="date"
          dense
          outlined
          :min="formData.createDate"
          disable
          :rules="
            formData.status
              ? [inputRequired, validateDateFuture]
              : []
          "
          class="tw-mt-2 tw-rounded-lg"
        ></q-input>
        <!-- <DatePickerInput v-model="date" /> -->
      </div>

      <fieldset
        class="tw-grid tw-grid-cols-2 tw-col-span-2 tw-gap-4 tw-bg-slate-50 tw-p-4 tw-rounded-lg"
      >
        <span class="tw-col-span-2 tw-h-5 tw-text-label">
          Fechas Extremas
        </span>
        <div>
          <Label label="Fecha Inicial" :is-requiered="true" />
          <q-input
            v-model="formData.startDate"
            type="date"
            dense
            outlined
            :disable="prevStatus == 'INACTIVO'"
            class="tw-mt-2 tw-rounded-lg"
            :rules="[inputRequired]"
            :min="formData.createDate"
            :max="formData.endDate"
          ></q-input>
          <!-- <DatePickerInput v-model="date" /> -->
        </div>
        <div>
          <Label label="Fecha Final" :is-requiered="true" />
          <q-input
            v-model="formData.endDate"
            type="date"
            dense
            outlined
            class="tw-mt-2 tw-rounded-lg"
            :disable="prevStatus == 'INACTIVO'"
            :rules="[inputRequired]"
            :min="formData.startDate"
          ></q-input>
          <!-- <DatePickerInput v-model="date" /> -->
        </div>
      </fieldset>

      <!-- <fieldset
        class="tw-grid tw-grid-cols-2 tw-col-span-2 tw-gap-4 tw-bg-slate-50 tw-p-4 tw-rounded-lg"
      >
        <span class="tw-col-span-2 tw-h-5 tw-text-label">
          Metadatos Específicos de Serie/SubSerie
        </span>
        <div
          v-for="input in metadataInputs"
          :key="input.id"
          class="tw-col-span-1"
        >
          <Label :label="input.label" />
          <q-input
            v-model="formData.metadata[input.id]"
            type="text"
            dense
            outlined
            :disable="prevStatus == 'INACTIVO'"
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
      </fieldset> -->

      <div
        v-if="prevStatus != 'INACTIVO'"
        class="tw-col-span-2 tw-flex tw-gap-6 tw-justify-center"
      >
        <Button
          label="Reclasificar Expediente"
          type="tertiary"
          color="informacion"
          type-button="button"
          icon-left="folder-open"
          @click="handleTransfer"
        />
        <!-- <Button
          v-if="
            user.role == 'GRP_SGDEA_GestorArchivo_Central' ||
            user.role == 'GRP_SGDEA_GestorArchivo_Gestion'
          "
          label="Prestar Expediente"
          type="tertiary"
          color="segundary"
          type-button="button"
          icon-left="handshake"
        /> -->
        <Button
          @click="
            [(openSubmitModal = true), (closeRecord = true)]
          "
          :label="process ? 'Cancelar' : 'Cerrar Expediente'"
          type="tertiary"
          color="segundary"
          type-button="button"
          icon-left="circle-xmark"
        />
        <Button
          label="Guardar"
          color="primary"
          type="primary"
          type-button="submit"
          icon-right="circle-arrow-right"
        />
      </div>
    </q-form>
  </q-card>
  <q-form greedy ref="formReclasificacion">
    <q-dialog v-model="showApprovalModal" persistent>
      <q-card class="q-py-xl q-px-xl tw-max-w-2xl tw-w-full">
        <q-card-section>
          <div>
            <Label label="Serie" :is-requiered="true" />
            <q-select
              v-model="formReclasificar.serieReclasificar"
              emit-value
              map-options
              outlined
              dense
              use-input
              hide-selected
              fill-input
              clearable
              :options="seriesFiltered"
              :disable="!prevStatus"
              @filter="onFilterSeries"
              @update:model-value="onSetSubSeries"
              :rules="[inputRequired]"
              class="tw-mt-2 tw-rounded-lg"
            ></q-select>
          </div>
          <div>
            <Label label="Subserie" :is-requiered="true" />
            <q-select
              v-model="formReclasificar.subserieReclasificar"
              emit-value
              map-options
              outlined
              dense
              use-input
              hide-selected
              fill-input
              clearable
              :rules="[inputRequired]"
              :options="subSeriesFiltered"
              @filter="onFilterSubSeries"
              @update:model-value="onSetSubserieValue"
              class="tw-mt-2 tw-rounded-lg"
            ></q-select>
          </div>
        </q-card-section>
        <q-card-section>
          <CommentTextArea
            v-model="formReclasificar.observacionReclasificar"
            outlined
            dense
            :is-required="true"
            :max-length="100"
            :rules="[inputRequired, (val) => maxLengthInput(100, val)]"
            required
            label="Usted está modificando los niveles de seguridad del expediente, por favor especifique el motivo"
            class="tw-w-full"
          />
        </q-card-section>

        <q-card-actions align="center" class="q-mt-sm tw-gap-4">
          <Button
            label="Cancelar"
            color="black"
            type-button="button"
            type="tertiary"
            @click="cancelApproval"
            icon-left="circle-xmark"
          />
          <Button
            label="Aceptar"
            color="primary"
            type="primary"
            @click="reclasificarExpediente"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-form>

  <ConfirmModal
    :show-modal="openSubmitModal"
    text-show-modal="¿Está seguro de la acción a realizar?"
    text-confirm-modal="Si"
    text-cancel-modal="No"
    @confirm-modal="closeRecord ? onCloseRecord() : onSubmit()"
    @update:show-modal="
      [
        (openSubmitModal = false),
        (closeRecord = false),
        toast.success('Cancelación Exitosa'),
      ]
    "
  />
</template>
