<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
      <BreadCrumbs :crumbs="routesData" />
      <div class="tw-flex tw-justify-between tw-items-center tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold tw-my-4">Radicar Documento</h1>
      </div>
      <!-- <q-card class="tw-mt-[20px] tw-rounded-xl q-pa-lg" flat> -->
        <q-form @submit.prevent="handleForm">
          <q-card v-for="(form, index) in forms" :key="index" class="acordion-style">
            <q-expansion-item v-bind="form.header" class="custom-header">

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

                  <q-select
                      v-if="field.type === 'selectSection'"
                      v-model="formData[field.nameField]"
                      :options="field.options"
                      use-input
                      :required="field.required"
                      :error-icon="field.required ? 'error' : ''"
                      :rules="field.disabled ? [] : field.rules"
                      @filter="filtrarOpciones"
                      :option-label="field.labelSelector"
                      :option-value="field.valueSelector"
                      :disabled="field.disabled"
                      class="custom-field"
                      outlined
                      dense
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No results
                          </q-item-section>
                        </q-item>
                      </template>
                  </q-select>

                  <q-input
                    v-if="field.type === 'file'"
                    outlined
                    :placeholder="field.placeholder"
                    type="file"
                    class="custom-field"
                    :required="field.required"
                    :error-icon="field.required ? 'error' : ''"
                    v-model="files[field.referencia]"
                    @update:model-value="val => handleFileChange(val, field.referencia)"
                    dense
                    >
                    <template v-slot:append>
                      <q-icon name="attach_file" />
                    </template>
                  </q-input>

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
            </q-expansion-item>
          </q-card>
          <div class="row justify-center q-mt-md">
            <q-btn label="Cancelar" color="accent" textColor="black" class="tw-rounded-lg tw-p-2 tw-w-[200px] custom-field" @click="cancelModal = true"></q-btn>
            <q-btn label="Radicar" :color="buttonEnabled? 'gray-5' : 'secondary'" :class="buttonEnabled? 'tw-rounded-lg tw-w-[200px] text-bold custom-field disabled-button' : 'tw-rounded-lg tw-p-2 tw-w-[200px] text-bold custom-field'" type="submit" :disable="buttonEnabled"></q-btn>
          </div>
        </q-form>
      <!-- </q-card> -->
      <Modal v-model="showModal" title="Creación exitosa"
        :text="`El radicado fue creado con exito`"
        :is-success="true" text-button="¡Ok!" @handleAccept="handleModal" />
      <Modal v-model="errorModal" title="Error" text="¡Ha ocurrido un error, los documentos adjuntos ya se encuentran radicados!" text-button="Aceptar"
        @handleAccept="handleModal" />
      <Modal v-model="cancelModal" title="¡Espera un momento!"
        text="¿Está seguro de abandonar la radicación en curso?" text-cancel-button="NO" text-button="SI"
        @handleAccept="router.push('/correspondencia')" cancel-button @closeModal="() => cancelModal = false"
        text-button-cancel="NO" />
      <LoadingScreen v-if="isLoading"/>
    </main>
  </section>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';
import DatePickerComponent from "../../../components/FormFields/datePickerComponent.vue";
import TimePickerComponent from "../../../components/FormFields/timePickerComponent.vue";
import Modal from "../../../components/Modal/Modal.vue";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen.vue"
import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';
import { useCrearCorrespondencia } from './CrearCorrespondencia.Logic';

const {forms, routesData, formData, handleForm, filtrarOpciones, buttonEnabled, files, handleFileChange, handleModal, showModal, errorModal, cancelModal, router, isLoading } = useCrearCorrespondencia();
</script>

<style src="./CrearCorrespondencia.css" scoped></style>
