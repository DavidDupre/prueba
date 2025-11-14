<template>
  <div class="[&>*]:tw-mb-4">
    <section>
      <q-form ref="datosSalidaRef" @validation-error="errorForm()" @submit.prevent="saveForm">
        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
                  Correo respuesta de salida
                </h3>
              </div>
            </template>

            <div class="tw-bg-white tw-p-4" style="border-radius: 5px">
              <div class="row tw-p-2">
                <div class="col-sm tw-p-2">
                  <p class="tw-text-label tw-font-semibold">Anexos (vantidad de folios)*</p>
                  <q-input v-model="datosSalida.anexos" label="Ingrese la cantidad de folios" dense outlined :rules="[val => val && !val?.anexos || 'Campo requerido', ]" />
                </div>
                <div class="col-sm tw-p-2">
                  <p class="tw-text-label tw-font-semibold">Asunto*</p>
                  <q-input v-model="datosSalida.asunto" label="Ingrese el asunto" dense outlined :rules="[val => val && !val?.asunto || 'Campo requerido', val => val?.length <= 100 || 'El máximo de caracteres es de 100']" />
                </div>

              </div>
                <div class="col-sm tw-p-2">
                    <CommentTextArea v-model="datosSalida.observacion" :is-required="true" :max-length="80"
                    label="Cuerpo del correo" />
                </div>
            </div>
          </q-expansion-item>
        </q-card>
      </q-form>
    </section>
  </div>

  <div class="tw-flex tw-justify-center tw-gap-5 tw-mt-5">
    <q-btn label="Regresar" color="primary" class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-52" @click="() => emit('previous-step')" />
    <q-btn label="Cancelar" color="accent" textColor="black" class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-52" @click="emit('cancel')" />
    <q-btn type="button" :label="'Guardar'" color="primary"
      class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-52" @click="validateForms()" />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, withDefaults, defineEmits } from 'vue'
import { useQuasar } from "quasar";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import CommentTextArea from  "src/shared/components/TextArea/Comments.vue";


const q = useQuasar()

const emit = defineEmits(['save', 'previous-step', 'cancel']);

const step3form = ref()

const props = withDefaults(defineProps<{
  datosSalida: any
}>(), {})


async function validateForms() {
  // if (await step2form.value.validate()) {
    emit('save')
  // }
}

const errorForm = () => {
  toast.error("Para continuar, asegrese de que todos los campos requeridos estén completos.")
  //TODO: elminar el emiter cuando termine el form
    emit('save')
}


const cancelForm = () => {

};


async function saveForm() {
  if (await step3form.value.validate()) {
    emit('save')
  }
}
</script>
