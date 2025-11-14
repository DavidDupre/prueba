<template class="tw-w-full tw-h-full" style="height: 100vh">
  <div class="tw-w-full tw-h-full tw-flex tw-flex-col tw-items-center tw-justify-center">
    <span class="tw-font-bold tw-text-3xl tw-mt-5 tw-mb-3 tw-text-left">Consulta tu PQRD</span>
    <div class="tw-p-8 tw-w-[90%]">
      <div class="tw-bg-white tw-p-6 tw-mb-5 tw-rounded-md">
        <p class="pl-4 tw-font-bold tw-text-xl tw-mt-5 tw-mb-3 text-bold">Ingresa el número de radicado</p>
        <div class="tw-w-full tw-mb-4">
          <p class="tw-text-label tw-font-semibold">Número de radicado</p>
          <q-input v-model="idRadicado" outlined label="Seleccione" dense :rules="[val => val.length >= 15 && val.length <= 18 || 'El número de radicado debe tener entre 15 y 18 caracteres']" maxlength="18" />
        </div>
        <div style="display: flex;justify-content: center;padding: 2%;">
          <component
            :is="VueCaptchaSwitcher"
            v-if="VueCaptchaSwitcher"
            :captchaName="captchaName"
            :publicKey="publicKey"
            v-model="captchaResponse"
            @verify="onVerify"
            @expire="onExpire"
            @fail="onFail"
          />
        </div>
        <div class="row tw-flex tw-justify-center tw-gap-2 tw-mt-6 tw-mb-8">
          <q-btn label="Consultar" color="primary" textColor="white" class="tw-rounded-lg tw-w-60 tw-h-10"
                 :disabled="!captchaVerified"
            @click="getPqrd"></q-btn>
        </div>
      </div>
      <div v-if="isSearch" class="tw-bg-white tw-p-8 tw-mb-5 tw-rounded-md">
        <p class="pl-4 tw-font-bold tw-text-xl tw-mt-5 tw-mb-3 text-bold">Resultados de la búsqueda</p>

        <!-- v-if="isSearch" -->
        <div class="tw-flex tw-justify-between">
          <span>
            <p>Radicado</p>
            <p class="tw-font-bold">{{ infoPqrd.idRadicado }}</p>
          </span>

          <span>
            <p>Avance</p>
            <span class="tw-flex tw-items-center tw-justify-center tw-gap-2">
              <p class="tw-font-bold tw-text-sm">{{ porcentajePqrd }}%</p>
              <q-linear-progress :value="progress" class="tw-w-[100px]" size="6px" rounded color="#003352" />
            </span>

          </span>

          <span>
            <p>Fecha estimada de cierre</p>
            <p class="tw-font-bold">{{ datePqrd }}</p>
          </span>
        </div>

        <div class="tw-w-full tw-flex tw-justify-center tw-my-5 tw-flex-col">
          <img v-lazy :data-url="estado" class="tw-h-24">
          <p class="tw-m-auto tw-text-lg tw-font-medium tw-text-slate-500">Estado</p>
          <p class="tw-m-auto tw-text-lg tw-font-semibold tw-text-black">{{ estadoProceso }}</p>
          <span v-if="estadoProceso == 'Finalizada'" class="tw-text-center tw-font-semibold tw-text-slate-500 tw-mt-20">
            Su respuesta fue enviada por {{ infoPqrd.afectado.medioRespuesta.nombre }}, con el número de salida {{ infoPqrd.idRadicado }}.
          </span>
        </div>
      </div>

      <div v-if="notFound" class="tw-bg-white tw-p-8 tw-mb-5 tw-rounded-md">
        <div class="tw-w-full tw-flex tw-justify-center tw-my-5 tw-flex-col">
          <img v-lazy :data-url="notFoundImg" class="tw-h-24">
          <span class="tw-text-center tw-text-slate-500 tw-mt-3">
            Su radicado no fue encontrado. Por favor digite un número de radicado correcto. <br>
            Ejemplo: ENT202301002123456 o ENT 2023 01 002 123456
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { sgdeaAxios } from "src/services";
import { computed, ref, onMounted } from "vue";
//@ts-ignore
import estado from "src/assets/estado.svg"
//@ts-ignore
import notFoundImg from "src/assets/notFound.svg"
import moment from "moment";


const progress = ref(0)
const porcentajePqrd = ref(0)
const step = ref(1)

const idRadicado = ref('ENT')
const isSearch = ref(false)
const infoPqrd = ref()
const datePqrd = ref()
const captchaVerified = ref(false)
const VueCaptchaSwitcher = ref();
const ultimoTiempoExpiracion = ref(null);
const isLocalhost = window.location.hostname === 'localhost';
const captchaName = ref("turnstile");
const publicKey = "0x4AAAAAABm_meOCvQHc-VU8";
const captchaResponse = ref("");
const onVerify = (token: string) => {
  captchaVerified.value = true;
};

const onExpire = () => {
  captchaVerified.value = false;
};

const onFail = () => {
  captchaVerified.value = false;
};
const notFound = ref(false)
const estados = ['Entrega exitosa', 'Publicado', 'Publicación cerrada']

infoPqrd.value = ""

const getPqrd = async () => {
  try {
    const { data } = await sgdeaAxios.get(`/pqrd/getPqrdNumeroRadicado?numRadicado=${idRadicado.value}`);

    if (data) {
      infoPqrd.value = data
      datePqrd.value = moment(infoPqrd.value.fechaRespuesta).format('DD/MM/YYYY')
      isSearch.value = true
      notFound.value = false

      switch (infoPqrd.value.estado.estado) {
        case "Por asignar":
          progress.value = 0.1;
          break;
        case "En edición":
          progress.value = 0.25;
          break;
        case "Para gestión":
          progress.value = 0.25;
          break;
        case "Por revisar":
          progress.value = 0.45;
          break;
        case "Revisado":
          progress.value = 0.6;
          break;
        case "Revisión rechazada":
          progress.value = 0.25;
          break;
        case "Por aprobar":
          progress.value = 0.8;
          break;
        case "Aprobación rechazada":
          progress.value = 0.25;
          break;
          case "Aprobado":
          progress.value = 1;
          break;
        default:
          progress.value = 0;
      }
      porcentajePqrd.value = Math.round(progress.value * 100);
    }
  } catch (error) {
    console.error(error);
    notFound.value = true;
    isSearch.value = false;
  }
};
const estadoProceso = computed(() => estados.includes(infoPqrd.value.estado.estado) ? 'Finalizada' : 'Su solicitud está en trámite')

onMounted(async () =>{
  if (!isLocalhost) {
    VueCaptchaSwitcher.value = (await import('vue-captcha-switcher')).default;
  }
});
</script>
