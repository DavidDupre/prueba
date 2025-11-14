<template>
  <div class="tw-border tw-flex tw-flex-col tw-tw-items-center tw-rounded-lg tw-w-full tw-relative" :title="props.name">
    <div class="tw-flex tw-items-center tw-truncate tw-py-2">
      <span>{{ props.name }}</span>
    </div>


    <div class="tw-px-6 tw-mt-2 tw-pb-4">
      <img v-lazy :data-url="image.src" class="tw-w-[250px] tw-h-[250px]" :alt="image.alt">
    </div>

    <q-btn icon="download" size="md" round class="tw-w-fit tw-absolute tw-bottom-3 tw-right-3" @click="download"/>
  </div>
</template>

<script lang="ts" setup>
import Word from "assets/word.svg"
import excel from 'assets/excel.svg';
import pdf from 'assets/pdf.svg';
import txt from "assets/txt.svg"
import { ref } from "vue";
import { sgdeaAxios } from 'src/services/index';
import { DocumentoRadicado } from 'src/interfaces';
import { b64toBlob } from 'src/helpers/converters';

const props = defineProps<{
  name: string,
  contentType: string,
  nodeId: string
}>()
const image = ref({
  src: '',
  alt: ''
})

const actions = {
  word: () => {
    image.value.src = Word;
    image.value.alt = 'Word'
  },
  sheet: () => {
    image.value.src = excel;
    image.value.alt = 'excel';
  },
  pdf: () => {
    image.value.src = pdf;
    image.value.alt = 'pdf';
  },
  text: () => {
    image.value.src = txt;
    image.value.alt = "txt";
  }
  // ...otros manejadores para diferentes palabras clave
};

// Ahora, itera sobre las claves del objeto de acciones
Object.keys(actions).forEach(key => {
  if (props.contentType.includes(key)) {
    actions[key](); // Ejecuta la función correspondiente si la clave está incluida
  }
});

const download = async () => {

  const {data} = await sgdeaAxios.get<DocumentoRadicado>(`/radicados/consultar_documento/${props.nodeId}`)
  const blob = await b64toBlob(data.documento, props.contentType)

  const a = document.createElement('a');
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = props.name;

  a.click();
}

</script>
