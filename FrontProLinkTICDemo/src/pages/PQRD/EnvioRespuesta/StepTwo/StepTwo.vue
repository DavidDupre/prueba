<template>
  <section>
    <q-form greedy ref="step2form">
      <q-card class="tw-rounded-xl tw-bg-white tw-py-6 tw-px-8" flat>
        <h2 class="tw-font-bold tw-text-lg tw-mb-2">Datos de respuesta</h2>
        <div class="tw-grid tw-grid-cols-4 tw-gap-4">
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-semibold">Anexos (cantidad de folios) *</p>
            <q-input type="text" min="0" outlined label="Inserte" dense v-model="datosSalida.anexos"
              @keypress="onlyNumber" :disable="isAprobador"
              :rules="[inputRequired,
                 val => /^[0-9]{1,5}$/.test(val) || 'Solo se permiten 5 numeros', val => val >= 0 || 'Introduzca un número válido']" />
          </div>
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-semibold">Asunto * ({{ datosSalida.asunto ? datosSalida.asunto.length : 0 }}/100)</p>
            <q-input outlined label="Inserte" v-model="datosSalida.asunto" :disable="isAprobador" :rules="[
              val => !!val || 'Este campo es requerido', (v: string) => lengthValidation(100, v)
            ]" dense />
          </div>
          <!-- <div class="tw-col-span-4">
              <CommentTextArea
                  v-model="datosSalida.observacion"
                  :is-required="false"
                  :max-length="255"
                  label="Observación"

                />
          </div> -->
        </div>
      </q-card>
      <div class="tw-flex tw-justify-center tw-gap-5 tw-mt-5">
        <q-btn label="Regresar" color="primary" class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-56"
          @click="() => emit('previous-step')" />
        <q-btn label="Cancelar" color="accent" :disable="isAprobador" textColor="black" class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-56"
          @click="emit('cancel')" />
        <q-btn type="button" :label="'Siguiente'" color="primary" class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-56"
          @click="validateForms()" />
      </div>
    </q-form>
  </section>
</template>

<script lang="ts" setup>
import { inputRequired } from 'src/helpers/validations';
import { ref } from 'vue';
import { maxLengthInput } from 'src/helpers/validations';
import CommentTextArea from  "src/shared/components/TextArea/Comments.vue";
import { useAuthStore } from 'src/stores/auth.store';

const auth = useAuthStore();
const isAprobador = auth.userInfo.role.toLowerCase().includes('aprobador');
const step2form = ref()
const props = withDefaults(defineProps<{
  datosSalida: any
}>(), {})

const emit = defineEmits(['next-step', 'previous-step', 'cancel'])

async function validateForms() {
  if (await step2form.value.validate()) {
    emit('next-step')
  }
}

function onlyNumber(event: { keyCode: any; which: any; preventDefault: () => void; }) {
  let keyCode = event.keyCode ? event.keyCode : event.which;
  if ((keyCode >= 48 && keyCode <= 57)) {
    return true;
  }
  event.preventDefault();
  return false;
}

const lengthValidation = (n, val: string) => val.length <= n || "Máximo " + n + " caracteres"
</script>
