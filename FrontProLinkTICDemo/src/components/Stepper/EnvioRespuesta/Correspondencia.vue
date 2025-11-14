<template>
  <q-card class="tw-rounded-xl tw" flat bordered>
    <q-expansion-item default-opened>
      <template v-slot:header>
        <div class="col row">
          <b class="tw-text-lg">Comunicación</b>
        </div>
      </template>

      <div class="row q-col-gutter-md q-pb-md q-px-md">
        <div class="col-12">
          <span class="tw-text-label">Asunto *</span>
          <q-input :rules="[inputRequired, v => maxLengthInput(100, v)]"
            name="asunto" map-options outlined v-model="form.asunto" label="Inserte" dense autocomplete="off" />
        </div>

        <div class="col-12">
          <span class="tw-text-label">Cuerpo del correo *</span>
        <!-- <q-input v-model="form.cuerpo" type="textarea" outlined label="Inserte" dense emit-value :rules="[inputRequired, v => maxLengthInput(3000, v)]" /> -->
        <q-field ref="fieldRef" v-model="form.cuerpo" label-slot borderless
          :rules="[inputRequired, v => maxLengthInputForRich2(3000, v)]" >
            <template #control>
              <q-editor @paste.native="evt => pasteCapture(evt)" v-model="form.cuerpo" :toolbar="[]"
                class="full-width" id="editorRich" style="cursor: auto"
                :style="fieldRef && fieldRef.hasError ? 'border-color: var(--q-negative)' : ''" />
            </template>
          </q-field>
        </div>
      </div>
    </q-expansion-item>
  </q-card>
</template>
<script lang="ts" setup>
import { toast } from "src/helpers/toast";
import { inputRequired, maxLengthInput, maxLengthInputForRich2 } from "src/helpers/validations";
import { PropType, onMounted, ref, watch } from "vue";

const props = defineProps({
  form: {
    type: Object as PropType<Correspondencia>,
    default: () => ({
      asunto: '',
      cuerpo: ''
    })
  }
})

const countImgs = ref(0)
const fieldRef = ref()

const pasteCapture = async (paste) => {
  if (paste.clipboardData.getData('Text') == '') {
    if (countImgs.value == 6) {
      paste.preventDefault()
      paste.stopPropagation()
      toast.error('Máximo 6 recortes')
    }
  }
};

const contarImagenes =  () => {
  // Expresión regular para encontrar imágenes
  const regexImagenes = /<img\s+[^>]*>/g;

  // Buscar todas las coincidencias en el texto
  const coincidencias = props.form.cuerpo.match(regexImagenes);

  // Si hay coincidencias, devolver la cantidad
  if (coincidencias) {
    countImgs.value = coincidencias.length
  }
}

watch(() => props.form.cuerpo, (newOffice) => {
  // @ts-ignore
  contarImagenes();
});


onMounted(async() => {
  contarImagenes()
})

interface Correspondencia {
  asunto: string;
  cuerpo: any
}

</script>
<style>
    
</style>