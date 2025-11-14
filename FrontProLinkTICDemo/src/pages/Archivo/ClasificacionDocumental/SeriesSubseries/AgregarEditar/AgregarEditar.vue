<template>
  <section class="tw-flex tw-flex-row">
    <q-form
      @submit.prevent="isEditing ? editarSerieSubserie() : crearSerieSubserie()"
      class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0"
    >
      <a
        @click.prevent="router.back"
        class="text-primary q-mb-md block cursor-pointer"
        style="text-decoration: none"
      >
        <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
        <b> Regresar</b>
      </a>
      <q-card class="tw-p-8 tw-rounded-lg" flat>
        <div class="">
          <Title
            :label="
              isEditing
                ? 'Actualizar Serie / Subserie Documental'
                : 'Crear Serie / Subserie Documental'
            "
          />
        </div>
        <q-form
          greedy
          @submit.prevent="
            isEditing ? (editConfirmModal = true) : crearSerieSubserie()
          "
          @validation-error="validateStep()"
        >
          <div class="tw-container tw-mx-auto tw-mt-4">
            <div class="tw-grid tw-grid-cols-4 tw-gap-6">
              <div class="tw-col-span-4" v-if="!isEditing">
                <Label label="Series existentes" />
                <q-select
                  v-model="selectedExistingSeries"
                  dense
                  outlined
                  :options="existingSeriesOptions"
                  option-label="description"
                  option-value="code"
                  label="Seleccione una serie existente"
                  class="tw-rounded-lg"
                  clearable
                  @update:model-value="handleExistingSeriesSelection"
                  :rules="[]"
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label
                          >{{ scope.opt.code }} -
                          {{ scope.opt.description }}</q-item-label
                        >
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <!-- Campos originales (ahora condicionales) -->
              <div class="tw-col-span-2" v-if="!isSubserieMode">
                <Label label="Código Serie" :is-requiered="true" />
                <q-input
                  v-model="formData.codigoSerie"
                  dense
                  label="Inserte código serie"
                  outlined
                  class="tw-rounded-lg"
                  :rules="[inputRequired]"
                  maxlength="12"
                  :debounce="500"
                  :disable="isCodigoSerieDisabled"
                  @focus="isEditing && showFieldEditAlert('Código Serie')"
                />
              </div>
              <div class="tw-col-span-2" v-if="!isSubserieMode">
                <Label label="Nombre de la Serie" :is-requiered="true" />
                <q-input
                  v-model="formData.nombreSerie"
                  dense
                  label="Inserte nombre serie"
                  outlined
                  class="tw-rounded-lg"
                  :rules="[inputRequired]"
                  maxlength="255"
                  :debounce="500"
                  :disable="codeSerieExists || (isEditing && addSubserie)"
                />
              </div>

              <div class="tw-col-span-4 tw-self-center">
                <q-checkbox
                  label="¿Contiene subserie?"
                  class="tw-text-black"
                  :disable="isSubserieCheckboxDisabled"
                  v-model="addSubserie"
                  @update:model-value="checkAddSubSerie"
                />
              </div>

              <div class="tw-col-span-2" v-if="addSubserie">
                <Label label="Código Subserie" :is-requiered="true" />
                <q-input
                  v-model="formData.codigoSubserie"
                  dense
                  label="Inserte código subserie"
                  outlined
                  class="tw-rounded-lg"
                  :rules="[inputRequired]"
                  maxlength="12"
                  :debounce="500"
                  :disable="isCodigoSerieDisabled"
                  @focus="isEditing && showFieldEditAlert('Código Subserie')"
                />
              </div>
              <div class="tw-col-span-2" v-if="addSubserie">
                <Label label="Nombre de la Subserie" :is-requiered="true" />
                <q-input
                  v-model="formData.nombreSubserie"
                  dense
                  label="Inserte nombre subserie"
                  outlined
                  class="tw-rounded-lg"
                  :disable="codeSerieExists"
                  :rules="[inputRequired]"
                  maxlength="255"
                  :debounce="500"
                />
              </div>

              <template v-if="editarDisposicion">
                <div class="tw-col-span-2">
                  <Label
                    label="Tiempo de Conservación Archivo de gestión"
                    :is-requiered="true"
                  />
                  <q-input
                    v-model="formData.archivoGestion"
                    dense
                    label="Inserte"
                    outlined
                    class="tw-rounded-lg no-arrows"
                    :rules="addSubserie ? [inputRequired] : []"
                    maxlength="2"
                    mask="##"
                  />
                </div>
                <div class="tw-col-span-2">
                  <Label
                    label="Tiempo de conservación archivo central"
                    :is-requiered="true"
                  />
                  <q-input
                    v-model="formData.archivoCentral"
                    dense
                    label="Inserte"
                    outlined
                    class="tw-rounded-lg"
                    :rules="addSubserie ? [inputRequired] : []"
                    maxlength="2"
                    mask="##"
                  />
                </div>

                <div class="tw-col-span-3">
                  <h4
                    class="tw-font-semibold tw-text-lg tw-text-<18px>/<22px> tw-mb-2"
                  >
                    Disposición Final
                  </h4>
                  <div class="tw-flex tw-gap-4 tw-flex-row">
                    <q-radio
                      v-model="formData.disposicionFinal"
                      val="conservacionTotal"
                      :rules="addSubserie ? [inputRequired] : []"
                      label="Conservación Total"
                      class="tw-text-label"
                    />
                    <q-radio
                      v-model="formData.disposicionFinal"
                      val="seleccion"
                      label="Selección"
                      class="tw-text-label"
                      :rules="addSubserie ? [inputRequired] : []"
                    />
                    <q-radio
                      v-model="formData.disposicionFinal"
                      val="eliminacion"
                      label="Eliminación"
                      class="tw-text-label"
                      :rules="addSubserie ? [inputRequired] : []"
                    />
                  </div>
                  <!-- Mensaje de error -->
                  <p
                    v-if="
                      showDisposicionFinalError && !formData.disposicionFinal
                    "
                    class="tw-text-[var(--q-negative)] tw-text-xs"
                  >
                    Este campo es requerido
                  </p>
                </div>
                <div class="tw-col-span-2 tw-flex tw-gap-4">
                  <q-checkbox
                    label="Reproducción técnica"
                    class="tw-text-label"
                    v-model="formData.reproduccionTecnica"
                  />
                </div>
                <div class="tw-col-span-2">
                  <Label label="Estado" :is-requiered="true" />
                  <q-select
                    v-model="formData.estado"
                    dense
                    outlined
                    :options="estadosOptions"
                    class="tw-rounded-lg"
                    :rules="addSubserie ? [inputRequired] : []"
                  />
                </div>
                <div class="tw-col-span-2">
                  <Label label="Clasificación de Seguridad" />
                  <q-select
                    v-model="formData.nivelSeguridad"
                    :options="securityLevels"
                    outlined
                    dense
                    class="tw-rounded-lg"
                    :rules="addSubserie ? [inputRequired] : []"
                    ref="clasificacionInput"
                  />
                </div>
                <div class="tw-col-span-4">
                  <CommentTextArea
                    v-model="formData.procedimientos"
                    :is-required="addSubserie ? true : false"
                    :max-length="1500"
                    label="Procedimientos"
                  />
                </div>
              </template>
            </div>

            <div v-if="isEditing" class="tw-flex tw-mt-4 justify-end w-full">
              <div class="tw-flex tw-gap-4">
                <Button
                  v-if="mostrarBotonEliminar"
                  label="Eliminar"
                  type="tertiary"
                  color="black"
                  @click="showModal = true"
                  type-button="button"
                  icon-left="circle-xmark"
                />
                <Button
                  label="Actualizar"
                  type="primary"
                  color="primary"
                  type-button="submit"
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
                  :disabled="
                    isCreateDisabled ||
                    nameSubserieExists ||
                    codeSubserieExists ||
                    ((nameSerieExists || codeSerieExists) && !addSubserie)
                  "
                />
              </div>
            </div>
          </div>
        </q-form>
      </q-card>

      <ConfirmModal
        :show-modal="showModal"
        text-show-modal="¿Está seguro que desea eliminar la serie o subserie documental? Recuerde que solamente se podrán eliminar series o subseries que no tengan expedientes asociados."
        text-confirm-modal="Aceptar"
        text-cancel-modal="Cancelar"
        @confirm-modal="onDelete()"
        @update:show-modal="showModal = false"
      />
      <ConfirmModal
        :show-modal="editConfirmModal"
        text-show-modal="¿Está seguro de la acción a realizar?"
        text-confirm-modal="Aceptar"
        text-cancel-modal="Cancelar"
        @confirm-modal="editarSerieSubserie()"
        @update:show-modal="editConfirmModal = false"
      />
    </q-form>
  </section>
</template>

<script lang="ts" setup>
import { useFormLogic, estadosOptions } from ".";
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";
import ConfirmModal from "components/Modal/ConfirmModal.vue";
import { inputRequired } from "src/helpers/validations";
import Button from "src/shared/components/PrimeComponents/Button/Button.vue";
import Label from "src/shared/components/PrimeComponents/Label/Label.vue";
import Title from "src/shared/components/PrimeComponents/Fuentes/Title/Title.vue";
import { ref, watch, computed, onMounted } from "vue";
import { toast } from "src/helpers/toast";
// import { sgdeaArchivoAxios } from "src/services";

const codeSerieExists = ref(false);
const nameSerieExists = ref(false);
const codeSubserieExists = ref(false);
const nameSubserieExists = ref(false);
const editConfirmModal = ref(false);
const dataSerieSubserie = ref(null);
const mostrarBotonEliminar = ref(false);
var serieNameFound = false;
var subserieNameFound = false;
var serieCodeFound = false;
var subserieCodeFound = false;

const securityLevels = ref(["PÚBLICO", "CONFIDENCIAL", "RESERVADO"]);

// Obtener todas las funciones y estados del useFormLogic
const {
  formData,
  showModal,
  router,
  isEditing,
  addSubserie,
  onDelete,
  route,
  editarSerieSubserie,
  crearSerieSubserie,
  showDisposicionFinalError,
  // Añadir las nuevas funciones y estados exportados
  existingSeriesOptions,
  selectedExistingSeries,
  handleExistingSeriesSelection,
  checkAddSubSerie,
  editarDisposicion,
} = useFormLogic();

const idSerie = computed(() => route.params.id);
const idSubserieNew = computed(() => route.query.subSerie);

const isSubserieMode = computed(() => !!selectedExistingSeries.value);

const isCreateDisabled = computed(() => {
  return selectedExistingSeries?.value?.containsSubseries === false;
});

const isSubserieCheckboxDisabled = computed(() => {
  if (isEditing.value) return true;

  if (!selectedExistingSeries.value) return false;

  const containsSubseries = selectedExistingSeries.value.containsSubseries;
  return containsSubseries === true || containsSubseries === null;
});

const isCodigoSerieDisabled = computed(() => {
  if (isEditing.value) return true;

  // En modo creación, deshabilitar si nameSerieExists es true
  return nameSerieExists.value;
});

const showFieldEditAlert = (fieldName: string) => {
  toast.warning(`
    No es posible modificar el ${fieldName} de una serie/subserie existente.`);
};

const validateStep = () => {
  if (!addSubserie.value && formData.value.disposicionFinal === "") {
    showDisposicionFinalError.value = true;
  }
  return toast.error(
    "Por favor completa todos los campos obligatorios antes de continuar."
  );
};

// const decideButtonDelete = async () => {
//   try {
//     let serieId = dataSerieSubserie.value.fatherId?.id ?? "";
//     let subSerieId =
//       idSubserieNew.value && idSerie.value.trim() ? idSubserieNew.value : "";
//     const { data } = await sgdeaArchivoAxios.get(
//       `/record/validar-serie-subserie?idSerie=${serieId}&idSubSerie=${subSerieId}`
//     );

//     if (data.asociado === true) {
//       toast.error(
//         "No se puede eliminar la serie o subserie documental porque tiene expedientes asociados."
//       );
//       mostrarBotonEliminar.value = false;
//     } else {
//       mostrarBotonEliminar.value = true;
//     }
//   } catch (error) {
//     mostrarBotonEliminar.value = false;
//   }
// };

onMounted(async () => {
  // await decideButtonDelete();
});

watch(
  () => formData.value.codigoSerie,
  (newVal) => {
    if (serieCodeFound) {
      formData.value.nombreSerie = "";
      serieCodeFound = false;
    }
  }
);

watch(
  () => formData.value.nombreSerie,
  (newVal) => {
    if (serieNameFound) {
      formData.value.codigoSerie = "";
      serieNameFound = false;
    }
  }
);

watch(
  () => formData.value.codigoSubserie,
  (newVal) => {
    if (subserieCodeFound) {
      formData.value.nombreSubserie = "";
      subserieCodeFound = false;
    }
  }
);

watch(
  () => formData.value.nombreSubserie,
  (newVal) => {
    if (subserieNameFound) {
      formData.value.codigoSubserie = "";
      subserieNameFound = false;
    }
  }
);
</script>
