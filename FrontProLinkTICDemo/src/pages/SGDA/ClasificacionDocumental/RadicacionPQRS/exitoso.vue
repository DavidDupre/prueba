
<template>
  <div class="tw-flex tw-justify-center tw-items-center tw-flex-col tw-text-center tw-w-full tw-h-[600px] tw-gap-8">
    <div>
      <q-icon name="check" class="tw-rounded-full tw-text-[40px] tw-w-[60px] tw-h-[60px]" color="blue"
        style="border: 5px solid var(--primary)"></q-icon>
    </div>

    <div class="">
      <h4 class="tw-text-black tw-text-[24px] text-bold tw-p-4">Su solicitud se ha radicado <br>
        con el código {{props.ent ?? "ENT - XXXX"}}</h4>

      <p class="tw-text-2xl tw-text-label tw-font-normal tw-text-[#2C3948] tw-leading-[50px]">
        La respuesta será enviada en plazos definidos por la ley al medio que nos indicó en la solicitud. <!-- <br>
        Se envió a su correo una copia de su solicitud, pero también puede descargarla por aquí -->
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">

import { useRoute, useRouter } from 'vue-router';
const router = useRouter();

const props = defineProps<{
  ent: string
}>()

</script>
