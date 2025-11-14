
<template>
  <q-dialog v-model="open" persistent class="tw-w-full tw-h-full">
    <div
      class="tw-absolute tw-top-[15%] tw-left-[30%] tw-bg-white tw-flex tw-justify-center tw-items-center tw-flex-col tw-text-center tw-h-[80%] tw-p-12 tw-gap-8">
      <div>
        <q-icon name="check" class="tw-rounded-full tw-text-[40px] tw-w-[60px] tw-h-[60px]" color="blue"
          style="border: 5px solid var(--primary)"></q-icon>
      </div>

      <div>
        <h4 class="tw-text-black tw-text-xl text-bold tw-p-4 tw-mb-4">Su solicitud se ha radicado <br>
          con el codigo {{ ENT }} </h4>

        <p class="tw-text-[16px] tw-text-label tw-font-medium tw-text-[#2C3948] tw-leading-[30px]">
          La respuesta sera enviada en plazos definidos por la ley al medio que nos indico en la solicitud. <br>
          Se envio a su correo una copia de su solicitud, pero tambien puede descargarla por aqui
        </p>
      </div>
      <q-card-actions>
      <q-btn class="my-button" flat @click="open = false" >Descargar solicitud</q-btn>
      <q-btn label="Finalizar"  text-color="white" color="primary" class="tw-rounded-xl tw-p-3  tw-border-1 tw-border-black tw-h-11 tw-w-40"
        @click="router.push('/pqrd/home')"
       />
    </q-card-actions>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">

import { useRoute, useRouter } from 'vue-router';
import { computed, ref } from 'vue';

const emit = defineEmits(['closeModal', 'handleAccept', 'update:modelValue', 'handleDownloadFile'])

const props = defineProps<{
  ENT: string,
  modelValue: boolean,
  persistent?: boolean
}>()

const open = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const router = useRouter();

</script>

<style scoped>
.q-btn.my-button {
  border: 1px solid black;
  padding: 3px;
  height: 44px;
  width: 160px;
}
</style>
