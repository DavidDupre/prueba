<template>
    <section class="tw-flex tw-flex-row">
      <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
        <BreadCrumbs :crumbs="crumbs" />
        <div class="tw-flex tw-justify-between tw-items-center tw-pt-4">
          <h1 class="tw-text-3xl tw-font-bold tw-my-4">{{ titlePage }}</h1>
        </div>


            <q-form @submit.prevent="submit">
              <q-card v-for="(form, index) in forms" :key="index" class="acordion-style">
                  <div v-for="(row, rIndex) in form.rows" :key="rIndex" class="q-mt-md row custom-row">
                    <div v-for="(field, fIndex) in row" :key="fIndex" :class="`col-${field.col}`">
                      <label v-if="field.type !== 'checkbox'" for="description" class="tw-text-label custom-label">{{ field.label }}</label>
                      <q-input
                        v-if="field.type === 'text'"
                        outlined :placeholder="field.placeholder"
                        class="custom-field"
                        :required="field.required"
                        :error-icon="field.required ? 'error' : ''"
                        v-model="formData[field.nameField]"
                        :rules="field.rules"
                        :readonly="field.disabled"
                        dense
                        ></q-input>

                      <q-input
                        v-if="field.type === 'number'"
                        outlined
                        :placeholder="field.placeholder"
                        type="number"
                        class="custom-field"
                        :required="field.required"
                        :error-icon="field.required ? 'error' : ''"
                        v-model="formData[field.nameField]"
                        :dense="true"
                        :rules="field.rules"
                        ></q-input>

                      <q-input
                        v-if="field.type === 'textMultiLine'"
                        outlined
                        type="textarea"
                        class="custom-field"
                        :required="field.required"
                        v-model="formData[field.nameField]"
                        :rules="field.rules"
                        dense
                        ></q-input>

                      <q-select
                        v-if="field.type === 'select'"
                        outlined
                        :placeholder="field.placeholder"
                        :options="field.options"
                        class="custom-field"
                        :required="field.required"
                        :error-icon="field.required ? 'error' : ''"
                        v-model="formData[field.nameField]"
                        :rules="field.disabled ? [] : field.rules"
                        :option-label="field.labelSelector"
                        :option-value="field.valueSelector"
                        :readonly="field.disabled"
                        dense
                        ></q-select>
                      <q-toggle
                        v-if="field.type === 'toggle'"
                        v-model="formData[field.nameField]"
                        required="field.required"
                        :rules="field.rules"
                        color="secondary"
                      ></q-toggle>

                      <q-option-group
                        v-if="field.type === 'radioGroup'"
                        :required="field.required"
                        class="custom-field"
                        v-model="formData[field.nameField]"
                        :options="field.options"
                        type="radio"
                        inline
                        inline-label
                      />

                      <q-checkbox
                        v-if="field.type === 'checkbox'"
                        :label="field.label"
                        :required="field.required"
                        v-model="formData[field.nameField]"
                        :rules="field.rules"
                        ></q-checkbox>

                      <DatePickerComponent
                        v-if="field.type === 'date'"
                        mask="YYYY/MM/DD"
                        class="custom-field"
                        :required="field.required"
                        :error-icon="field.required ? 'error' : ''"
                        v-model:input-data-prop="formData[field.nameField]"
                        :rules="field.rules"
                      />

                      <TimePickerComponent
                        v-if="field.type === 'time'"
                        class="custom-field"
                        :required="field.required"
                        :error-icon="field.required ? 'error' : ''"
                        v-model:input-data-prop="formData[field.nameField]"
                        :rules="field.rules"
                      />
                      <!-- Add more field types as needed -->
                    </div>
                  </div>
              </q-card>
              <div class="row justify-center q-mt-md">
                <q-btn label="Cancelar" color="accent" textColor="secondary" class="tw-rounded-lg tw-p-2 tw-w-[200px] custom-field" @click="cancelModal = true"></q-btn>
                <q-btn :label="buttonLabel" :color="buttonEnabled? 'gray-5' : 'secondary'" :class="buttonEnabled? 'tw-rounded-lg tw-w-[200px] text-bold custom-field disabled-button' : 'tw-rounded-lg tw-p-2 tw-w-[200px] text-bold custom-field'" type="submit" :disable="buttonEnabled"></q-btn>
              </div>
            </q-form>
            <Modal v-model="showModal" title="Creación exitosa"
              :text="`El tramite ha sido creado con éxito`"
              :is-success="true" text-button="¡Ok!" @handleAccept="handleSuccess" />
            <Modal v-model="errorModal" title="Error" text="¡Ha ocurrido un error, los documentos adjuntos ya se encuentran radicados!" text-button="Aceptar"
              @handleAccept="handleCancel" />
            <Modal v-model="cancelModal" title="¡Espera un momento!"
              :text="`¿Está seguro de abandonar la ${titlePage.includes('Crear') ? 'creación' : 'edición'} en curso?`" text-cancel-button="NO" text-button="SI"
              @handleAccept="handleSuccess" cancel-button @closeModal="() => cancelModal = false"
              text-button-cancel="NO" />
            <LoadingScreen v-if="isLoading"/>
      </main>
    </section>
</template>

<script lang="ts" setup>
  import { useDocumentalTypesData } from "./DocumentalTypesForm.Logic";
  import BreadCrumbs from "src/components/BreadCrumbs/BreadCrumbs.vue";
  import Modal from "src/components/Modal/Modal.vue";
  import LoadingScreen from "src/components/LoadingScreen/LoadingScreen.vue";

  const {forms, crumbs, formData, isLoading, showModal, errorModal, buttonLabel, cancelModal, buttonEnabled, titlePage, handleCancel, handleSuccess, submit } = useDocumentalTypesData();
</script>

<style scoped src="./DocumeltaTypes.css"></style>
