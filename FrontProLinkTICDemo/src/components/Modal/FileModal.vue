<template>
  <template>
    <q-dialog v-model="open">
      <q-card class="tw-px-3" style="width: 850px; height: 550px; border-radius: 20px;">

        <q-card-section class="flex  tw-gap-4 !tw-text-left">
          <p class="tw-text-2xl tw-text-left tw-font-bold q-mt-lg">
            {{ title }}
          </p>
          <p class="tw-text-base tw-text-left tw-mt-2 tw-text-gray-500">{{ text }}</p>
          <div  v-if="isInput">
            <p class="tw-text-gray-500 tw-font-semibold tw-px-1">{{ titleInput }}</p>
            <q-input
              outlined
              dense
              class="tw-w-[500px]"
              label="Inserte"
              v-model="valueInput"
            />
          </div>

          <div class="tw-w-full tw-p-4 tw-rounded-lg tw-flex tw-justify-between"
            style="border: 1px solid rgba(107, 114, 128, 0.4)" v-else>
            <span class="flex tw-gap-2">
              <figure>
                <img v-lazy :data-url="Excel">
              </figure>
              <p>{{ nameFile }}</p>
            </span>
            <span class="text-[32px] tw-cursor-pointer" @click="handleDowloadFile">
              <q-icon class="" color="rgba(107, 114, 128, 0.4)" name="download"></q-icon>
            </span>
          </div>


          <div class="q-my-md tw-w-full">
            <span class="tw-text-gray-500 tw-font-semibold tw-px-2 ">Adjunte los documentos </span>

            <FileLoader class="tw-w-full" v-model="file2" :accept-file="acceptFile" />

            <div class="tw-mt-7" v-if="file2.length && !isInput">
              <p class="tw-text-gray-texts">{{ destinoTitle ? destinoTitle : 'Seleccione versión destino importación' }}</p>
              <q-form ref="form">
                <q-select
                  outlined
                  dense
                  v-model="valorSeleccionado"
                  :options="optionsSelect"
                />
              </q-form>
            </div>

          </div>

          <div class="tw-flex flex-center tw-w-full">
            <q-btn label="Cancelar" color="accent" text-color="black" class="tw-p-3" style="width: 210px;" flat @click="hideModal" />
            <q-btn :label="textButton" style="width: 210px" text-color="white"
              class="tw-rounded-xl tw-p-3" color="secondary" @click="handleButton" />
          </div>

        </q-card-section>
      </q-card>
    </q-dialog>
  </template>
</template>

<script setup lang="ts">
import FileLoader from '../FormFields/FileLoader.vue'
import {computed, ref, watch} from 'vue';
import Excel from '../../assets/microsoft-excel.svg';

const props = defineProps<{
  title: string,
  text: string,
  textButton: string,
  acceptFile: string,
  modelValue: boolean,
  file: any,
  nameFile: string,
  destinoTitle: string,
  optionsSelect: any,
  inputDataProp: any,
  isSelect: boolean,
  isInput: false,
  labelInput: string,
  titleInput: string,
  inputValue: string
}>()

const emit = defineEmits([
  'closeModal',
  'handleAccept',
  'update:modelValue',
  'update:file',
  'downloadFile',
  'update:inputDataProp',
  'update:inputValue'
])
const valorSeleccionado = ref<string | null>(null);
const valueInput = ref<string | null>(null);
const form = ref(null)

function hideModal() {
  emit('update:modelValue', false)
}

function handleButton() {
  emit('handleAccept', file2.value)
}

function handleDowloadFile() {
  emit('downloadFile')
}

const open = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const file2 = ref([])

watch(file2, (newchoosenFile) => {
  emit('update:file', newchoosenFile)
})

watch(valorSeleccionado, (nuevoValor) => {
  emit("update:inputDataProp", nuevoValor)
});

watch(valueInput, (nuevoValor) => {
  emit("update:inputValue", nuevoValor)
});
</script>


