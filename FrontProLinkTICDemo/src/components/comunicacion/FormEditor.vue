<template>
  <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
    <div class="row q-col-gutter-md q-pb-md q-px-md">
      <div class="col-12 tw-pl-0">
        <span class="tw-w-full">
          <label class="tw-text-label">Asunto {{isMedicinaLaboral ?'':'*'}}</label>
          <q-input v-model="formGeneralData.asuntoCorreo" :readonly="isMedicinaLaboral" dense outlined label="Inserte" class="tw-rounded-lg"
            :rules="isMedicinaLaboral ?[]:[inputRequired, val => maxLengthInput(100, val)]" />
        </span>
      </div>

      <div class="col-12 tw-mt-0 tw-pl-0 tw-pt-0">
        <div class="tw-w-full">
          <label class="tw-text-label">Cuerpo del correo *</label>
          <q-file rounded filled class="tw-rounded-none" label="Clic aquí para cargar sus archivos"  dense append use-chips multiple outlined v-model="files">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </div>
      </div>
      <q-field no-error-icon ref="fieldRef" class="tw-w-full tw-p-0" v-model.trim="formGeneralData.contenidoCorreo" label-slot borderless :rules="[inputRequired,val => maxLengthInput(3000, val)]">
        <template #control>
          <q-editor class="tw-w-full tw-pl-0 tw-pt-0" @paste.native="(evt:ClipboardEvent) => handlePaste(evt)"
          @drop.native="(evt:DragEvent) => handleDrop(evt)" v-model="formGeneralData.contenidoCorreo" min-height="10rem"
          :style="fieldRef && fieldRef.hasError ? 'border-color: rgb(193, 0, 21)' : ''" />
        </template>
      </q-field>
    </div>

  </q-card>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import {
  inputRequired,
  maxLengthInput,
  alphanumeric,
} from "src/helpers/validations";

const props = withDefaults(defineProps<{
  dataInitial: any,
  isMedicinaLaboral?: boolean,
}>(), {
  isMedicinaLaboral: false,
})

const formGeneralData = ref(props.dataInitial);
const files=ref([]);
const fieldRef=ref(null);


const  handlePaste=async(event:ClipboardEvent)=>{
  event.preventDefault();
  const itemsList = event.clipboardData.items;
  const items = Array.from(itemsList);

  for (const item of items) {
    if (item.type.indexOf('image') !== -1) {
      const blob = item.getAsFile();
      const imageUrl = URL.createObjectURL(blob);
      // Inserta la imagen en el contenido del editor
      formGeneralData.value.contenidoCorreo += `<img class='image-class' src="${imageUrl}" alt="Imagen" />`;
    }else if(item.type === 'text/plain'){
      // Inserta el texto en el contenido del editor
      item.getAsString((text)=>formGeneralData.value.contenidoCorreo += text);
    }
  }
  // Detener la propagación del evento en el contenedor padre
  event.stopPropagation()
}

const handleDrop=(evt:DragEvent)=>{
  evt.preventDefault();
  const files = evt.dataTransfer.files;

  formGeneralData.value.contenidoCorreo += `<img class='image-class' src="${URL.createObjectURL(files[0])}" alt="Imagen"  />`;
  // Detener la propagación del evento en el contenedor padre
  evt.stopPropagation()
}

</script>

<style  >

  .q-field--auto-height.q-field--labeled .q-field__control-container{
    padding-top: 0;
  }

</style>
