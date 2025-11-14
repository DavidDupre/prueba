<template>
  <div>
    <q-card class="tw-rounded-xl tw-py-6 tw-px-8 tw-pb-6" flat>
      <q-form greedy class="flex tw-flex-col tw-gap-8">
        <section>
          <h2 class="tw-font-bold tw-text-lg tw-mb-2">Correo respuesta de salida</h2>
          <div class="tw-grid tw-grid-cols-4 tw-gap-4">
            <div class="tw-col-span-4">
              <p class="tw-text-label tw-font-bold">Asunto</p>
              <q-input outlined dense v-model="datosSalida.correoRespuestaAsunto" readonly filled />
            </div>
          </div>
        </section>
      </q-form>
    </q-card>

    <q-card class="tw-rounded-xl tw-mt-4 tw-pt-6 tw-px-8 tw-pb-8" flat>
      <section>
        <div class="tw-grid tw-grid-cols-4 tw-gap-4">
          <div class="tw-col-span-4">
            <p class="tw-text-label tw-font-bold tw-mb-4">Cuerpo del correo</p>
            <div v-html="content"></div>
          </div>
        </div>
      </section>
    </q-card>

    <div class="tw-flex tw-justify-center tw-gap-5 tw-mt-5">
      <q-btn label="Regresar" color="primary" class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-52"
        @click="() => emit('previous-step')" />
      <q-btn label="Cancelar" color="accent" textColor="black" class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-52"
        @click="emit('cancel')" />
      <q-btn type="button" :label="'Guardar'" color="primary" class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-52"
        @click="validateForms()" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    datosSalida: any;
  }>(),
  {}
);

const emit = defineEmits(["save", "previous-step", "cancel", "next-step"]);

async function validateForms() {
  emit('save')
}

const content =
  `<section style="text-align: center; font-family: 'Roboto';">
    <div style="display: flex; flex-direction: column; gap: 16px;">
        <p>
            Recuerde que los datos aquí contenidos podría tener <span style="font-weight: bold;">"Datos Sensibles";</span>
            POSITIVA hace transferencia de esta información hacia el interesado, la cual debe cumplir con los principios y disposiciones que
            están contemplados en la ley 1581 de 2012 y decreto 1377 de 2013; donde se debe hacer uso correcto de la información, cualquier
            vulnerabilidad que pueda causar discriminación al trabajador de esta información será asumida por el receptor del comunicado.
        </p>
        <p style="font-weight: bold;">En la parte inferior se encuentran los adjuntos, haga clic en cada uno para descargar el documento</p>
        <p>Por favor no responder a este correo electrónico, para dirigir sus inquietudes lo invitamos a consultar nuestros canales de atención en el portal web www.positiva.gov.co <span style="color: red; font-weight: bold;">(Canales de atención - PQRD)</span></p>
        <p style="font-weight: bold;">"Antes de imprimir piensa en tu compromiso con el medio ambiente, Responsabilidad Social"</p>
    </div>
    <div style="text-align: left; font-family: Arial, sans-serif; color: #6c6c6c; font-size: 12px; padding-top: 20px;">
      <p style="font-weight: bold; font-size: 14px; margin-bottom: 5px">AVISO LEGAL</p>
      <p style="line-height: 1.5;">
        Este mensaje es confidencial, privado y está protegido por las normas jurídicas que aplican. Usted no debe
        copiar el mensaje ni divulgar su contenido a ninguna persona y por ningún medio. Si lo ha recibido por error,
        por favor elimínelo de su sistema. Esta cuenta de correo es de uso exclusivo para envío, por favor absténgase de
        escribir o responder al mismo, puesto que rebotará y/o no obtendrá respuesta.
      </p>
    </div>
  </section>`

</script>