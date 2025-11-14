<template>
  <div>
    <BreadCrumbs :crumbs="routes" />

    <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold">
      Cargar Documentos
    </div>

    <q-card class="tw-rounded-lg tw-p-7 tw-h-full" flat>
      <q-list class="rounded-borders">
        <q-form ref="form" class="tw-mt-3 tw-h-full">
          <q-expansion-item label="Información general" header-class="tw-text-xl tw-font-bold">
            <div class="tw-flex tw-full q-col-gutter-md">
              <div class="tw-w-full">

                <p class="tw-text-label tw-pl-2">Tipo de documento *</p>
                <q-select outlined :options="tipoDocumento" v-model:model-value="formData.document_type" label="Seleccione" dense class="tw-p-2" :rules="[inputRequired]"/>
              </div>
            </div>
          </q-expansion-item>

          <q-expansion-item label="Metadatos" header-class="tw-text-xl tw-font-bold" class="tw-mt-5">
            <div class="tw-flex tw-flex-wrap tw-full q-col-gutter-md tw-mt-0">
              <div class="tw-w-full">
                <p class="tw-text-label">Descripción *</p>
                <q-input outlined v-model='formData.description' label="Inserte" dense
                  :rules="[inputRequired, v => lengthValidation(200, v)]" />

              </div>
              <div class="tw-w-1/2">
                <p class="tw-text-label">Nombre autor *</p>
                <q-input outlined v-model='formData.author_name' label="Inserte" dense
                  :rules="[inputRequired, v => lengthValidation(50, v)]" />
              </div>
              <div class="tw-w-1/2">
                <p class="tw-text-label">Fecha Digitalizacion *</p>
                <DatePicker mask="YYYY/MM/DD" label="aaaa / mm / dd" v-model:input-data-prop="formData.datetime" :rules="[inputRequired, validateDateWithoutLimit]" />

              </div>
            </div>
          </q-expansion-item>

          <q-expansion-item label="Palabras clave" header-class="tw-text-xl tw-font-bold" class="tw-mt-5">
            <div class="tw-flex tw-flex-col tw-full q-col-gutter-md tw-mt-0">

              <q-form @submit="sendKeywords(field)" class="tw-flex tw-w-full tw-m-0 tw-p-0">
                <q-input v-model="field" outlined class="mb-3 tw-m-4 tw-w-full tw-flex tw-justify-end" dense>
                  <template v-slot:prepend>
                    <q-icon name="dialpad" color="gray" class="tw-mx-2" />
                  </template>
                </q-input>
                <q-btn color="accent" text-color="black" class=" tw-my-auto tw-h-full tw-min-w-[250px] text-center"
                  label="Agregar palabras clave" icon="add" type="submit"> </q-btn>
              </q-form>



              <ul class="tw-m-0 tw-p-0">
                <li v-for="(item, index) in keyWordsField"
                  class="tw-flex tw-flex-row tw-justify-between tw-w-full  tw-h-12">
                  <div class="tw-w-[10%] tw-flex tw-justify-center tw-items-center tw-gap-4 ">
                    <q-icon name="dialpad" class="tw-mx-2 tw-text-[20px] tw-text-gray-500" />
                  </div>
                  <p class="tw-my-auto tw-mx-auto tw-text-black"> {{ item }}</p>
                  <q-btn flat icon="close" size="sm" @click="keyWordsField.splice(index, 1)" />
                </li>
              </ul>
            </div>
          </q-expansion-item>

          <q-expansion-item label="Cargue el documento" header-class="tw-text-xl tw-font-bold" class="tw-mt-5">
            <div class="tw-flex tw-full q-col-gutter-md tw-mt-0">
              <div class='tw-w-full'>
                <div class="tw-w-full">
                  <p class="tw-text-label tw-p-2">Adjunte los documentos *</p>
                  <FileLoader v-model:model-value="formData.uploadedFile" :rules="[inputRequired]"/>
                </div>
                <div class="col col-12 row justify-center  tw-w-full tw-m-[10px]">
                  <q-btn label="Cancelar" style="width: 240px;" color="accent" textColor="black"
                    class=" tw-rounded-xl tw-p-3" />
                  <q-btn label="Agregar" style="width: 240px;" color="secondary" textColor="white"
                    class="tw-rounded-xl  tw-p-3" @click="enviar" />
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-form>


      </q-list>
    </q-card>



  </div>
  <Modal v-model:model-value="errorModal"  title="¡Error!" text="Ha ocurrido un error" :is-success="false" text-button="SI"
    text-button-cancel="NO" cancel-button @handleAccept="errorModal=false" @closeModal="errorModal = false" />
  <Modal v-model:model-value="showModal" title="Acción exitosa" text="Se han cargado los documentos exitosamente" is-success text-button="¡Ok!"
    @handleAccept="showModal = false"/>
</template>



<script lang="ts" setup>


import { onUpdated, onMounted, Ref, ref } from 'vue';

import BreadCrumbs from 'components/BreadCrumbs/BreadCrumbs.vue';
import Modal from 'components/Modal/Modal.vue';
import FileLoader from 'components/FormFields/FileLoader.vue';
import DatePicker from 'src/components/FormFields/datePickerComponent.vue';
import { tipoDocumento } from 'src/constantes/options';
import { inputRequired, validateDateWithoutLimit } from 'src/helpers/validations';
import { useLoadingStore } from 'src/stores/loading.store';
import { sgdeaAxios } from 'src/services';

const showModal = ref(false);
const errorModal = ref(false);

const enviar = async () => {
  let uploadData = []
  try {

    const form = new FormData()
    form.append('numeroRadicado', '2cd19d02-d2cc-495d-af17-aaf8b3e88242');
    formData.value.uploadedFile.forEach(item => {
      uploadData.push({
        "tipoDocumento": "Tipo 1",
        "metadatosDTO": {
          "nombreArchivo": item.name,
          "descripcion": formData.value.description,
          "nombreAutor": formData.value.author_name,
          "fechaDigitalizacion": formData.value.datetime
        },
        "palabrasClave": keyWordsField.value
      })
      form.append("files", item)
    })
    form.append('documentos', JSON.stringify(uploadData))

    const response = await sgdeaAxios.post('/docs/digitalizar', form, { headers: { 'Content-Type': 'multipart/form-data' } });

    if ([200, 201].includes(response.status)) {
      showModal.value = true
    }

  } catch (e) {

    console.error(e)
    errorModal.value = true;
  }

  clearField()
  keyWordsField.value = []
}

const sendKeywords = (msg: string) => {
  if(msg==="")return
  keyWordsField.value = [
    ...keyWordsField.value,
    ...msg.split(/[\s,]+/)
  ]

  field.value = ''
}

const field = ref('')
const keyWordsField = ref([])

const clearField = () => {
  formData.value = {
    document_type: '',
    description: '',
    author_name: '',
    datetime: '',
    uploadedFile: null,
    keyWords: '',
  }
}

const formData: Ref<{ document_type: string, description: string, author_name: string, datetime: string, uploadedFile: File[], keyWords: string }> = ref({
  document_type: '',
  description: '',
  author_name: '',
  datetime: '',
  uploadedFile: null,
  keyWords: '',
})

const routes = [
  {
    name: 'Inicio',
    to: '/home'
  },
  { name: 'SGDA', },
  { name: 'Digitalizacion de Documentos' }
]

const lengthValidation = (n, val: string) => val.length < n || 'Maximo ' + n + ' Caracteres'
</script>
<style lang="scss">
.container-buttons {
  display: flex;
  justify-content: center;
  margin-top: 180px;
}
</style>
