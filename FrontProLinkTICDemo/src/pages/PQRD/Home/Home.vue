<template>
  <div
    class="tw-flex tw-justify-center tw-items-center tw-flex-col tw-mt-1 tw-bg-[#f8f8f8]"
  >
    <p class="tw-font-bold tw-text-3xl tw-mt-5 tw-mb-3 tw-text-center">
      Bienvenido a nuestro sistema de PQRD
    </p>
    <p
      class="tw-mb-2 tw-text-lg tw-leading-4 tw-text-center tw-text-gray-dark"
    >
      En nuestro sistema de PQRD podrás reportar peticiones, quejas, <br />
      reclamos, felicitaciones, sugerencias y derechos de petición.
    </p>

    <div class="tw-grid tw-gap-4 tw-mt-1 tw-mb-3 tw-grid-cols-1 sm:tw-grid-cols-2 xl:tw-grid-cols-4 tw-px-2 sm:tw-px-8">

      <div
        class="tw-bg-white tw-rounded-2xl tw-p-3 tw-flex tw-flex-col tw-justify-between tw-min-h-[250px] tw-max-w-[400px] tw-mx-auto tw-w-full"
      >
        <div>
          <img
            v-lazy :data-url="PqrdPositiva"
            alt="pqrd"
            class="tw-w-[139px] tw-h-[130px] tw-mx-auto"
          />
          <p class="tw-font-bold tw-text-2xl tw-text-center tw-mt-1">
            PQRD ante Positiva
          </p>
          <div class="tw-flex tw-justify-center tw-h-full tw-mt-1 tw-pt-2">
            <div>
              <p
                class="tw-text-md tw-text-gray-dark tw-leading-5 tw-text-center tw-mb-3"
              >
                Positiva recibirá y responderá en los tiempos definidos por la
                ley a los medios de contacto suministrados.
              </p>
              <p
                class="tw-text-md tw-text-gray-dark tw-leading-5 tw-text-center tw-mb-3"
              >
                Para iniciar, acepte nuestras políticas de seguridad de la
                información y haga clic en el botón
              </p>
              <div class="tw-flex tw-items-center tw-gap-2 tw-mt-1">
                <q-checkbox size="sm" v-model="check" />
                <p class="tw-text-sm">
                  Acepto las
                  <router-link :to="redirectTo">
                    <span class="tw-underline tw-font-bold tw-text-[#ff7500]">
                      Políticas de Seguridad de la Información
                    </span>
                  </router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <q-btn
          color="primary"
          class="tw-text-lg tw-w-full tw-mt-3"
          :disable="!check"
          @click="redirectPQRDPublic"
        >
          Seleccionar esta PQRD
        </q-btn>
      </div>

      <div
        class="tw-bg-white tw-rounded-2xl tw-p-3 tw-flex tw-flex-col tw-justify-between tw-min-h-[250px] tw-max-w-[400px] tw-mx-auto tw-w-full"
      >
        <div>
          <img
            v-lazy :data-url="PqrddAnonima"
            alt="pqrd"
            class="tw-w-[139px] tw-h-[130px] tw-mx-auto"
          />
          <p class="tw-font-bold tw-text-2xl tw-text-center tw-mt-1">
            PQRD anónima
          </p>
          <div class="tw-flex tw-justify-center tw-h-full tw-mt-1 tw-pt-2">
            <div>
              <p
                class="tw-text-md tw-text-gray-dark tw-leading-5 tw-text-center tw-mb-3"
              >
                Si usted registra la solicitud como anónimo, declara reserva
                sobre sus datos personales y de contacto...
              </p>
              <p
                class="tw-text-md tw-text-gray-dark tw-leading-5 tw-text-center tw-mb-3"
              >
                Su solicitud de identidad es reservada, por lo tanto deberá
                registrar su respectivo trámite ante la Procuraduría General de
                la Nación, haciendo clic en el siguiente botón:
              </p>
            </div>
          </div>
        </div>
        <q-btn
          class="tw-text-lg tw-w-full tw-mt-3"
          color="primary"
          label="Seleccionar esta PQRD"
          @click="redirectPQRD"
        />
      </div>

      <!-- <div
        class="tw-bg-white tw-rounded-2xl tw-p-3 tw-flex tw-flex-col tw-justify-between tw-min-h-[250px] tw-max-w-[400px] tw-mx-auto tw-w-full"
      >
        <div>
          <q-icon
            name="medical_services"
            size="139px"
            color="primary"
            class="tw-block tw-mx-auto"
          />
          <p class="tw-font-bold tw-text-2xl tw-text-center tw-mt-1">
            Medicina Laboral
          </p>

          <div class="tw-flex tw-justify-center tw-h-full tw-mt-1 tw-pt-2">
            <div>
              <p
                class="tw-text-md tw-text-gray-dark tw-leading-5 tw-text-center tw-mb-3"
              >
                En este módulo podrá radicar sus solicitudes de medicina laboral
                :
              </p>
              <p
                class="tw-text-md tw-text-gray-dark tw-leading-5 tw-text-left tw-mb-3 tw-px-6"
              >
                Adición de diagnósticos<br>
                Aporte de pruebas<br>
                Controversia - Pérdida de capacidad laboral u Origen<br>
                Copias expedientes<br>
                Juntas de calificación<br>
                Origen del evento<br>
                Pérdida de capacidad laboral
              </p>
            </div>
          </div>
        </div>
        <q-btn
          class="tw-text-lg tw-w-full tw-mt-3"
          color="primary"
          label="Seleccionar Medicina Laboral"
          @click="redirectPQRDMedica"
        />
      </div> -->
      <div
        class="tw-bg-white tw-rounded-2xl tw-p-3 tw-flex tw-flex-col tw-justify-between tw-min-h-[250px] tw-max-w-[400px] tw-mx-auto tw-w-full"
      >
        <div>
          <q-icon
            name="note_add"
            size="139px"
            color="primary"
            class="tw-block tw-mx-auto"
          />
          <p class="tw-font-bold tw-text-2xl tw-text-center tw-mt-1">
            ACCAI
          </p>
          <div class="tw-flex tw-justify-center tw-h-full tw-mt-1 tw-pt-2">
            <div>
              <p
                class="tw-text-md tw-text-gray-dark tw-leading-5 tw-text-center tw-mb-3"
              >
                Positiva recibirá y responderá en los tiempos definidos por la
                ley a los medios de contacto suministrados.
              </p>
              <p
                class="tw-text-md tw-text-gray-dark tw-leading-5 tw-text-center tw-mb-3"
              >
                Para iniciar, acepte nuestras políticas de seguridad de la
                información y haga clic en el botón
              </p>
              <div class="tw-flex tw-items-center tw-gap-2 tw-mt-1">
                <q-checkbox size="sm" v-model="checkAccai" />
                <p class="tw-text-sm">
                  Acepto las
                  <router-link :to="redirectTo">
                    <span class="tw-underline tw-font-bold tw-text-[#ff7500]">
                      Políticas de Seguridad de la Información
                    </span>
                  </router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <q-btn
          color="primary"
          class="tw-text-lg tw-w-full tw-mt-3"
          :disable="!checkAccai"
          @click="redirectPQRDPublic"
        >
          Seleccionar esta ACCAI
        </q-btn>
      </div>
      <div
        class="tw-bg-white tw-rounded-2xl tw-p-3 tw-flex tw-flex-col tw-justify-between tw-min-h-[250px] tw-max-w-[400px] tw-mx-auto tw-w-full"
      >
        <div>
          <q-icon
            name="search"
            size="139px"
            color="primary"
            class="tw-block tw-mx-auto"
          />
          <p class="tw-font-bold tw-text-2xl tw-text-center tw-mt-1">
            Consulta tu PQRD
          </p>
        </div>
        <q-btn
          color="primary"
          class="tw-text-lg tw-w-full tw-mt-3"
          @click="redirectConsulta"
        >
          Consultar
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import PqrdPositiva from "assets/pqrd-1.svg";
import PqrddAnonima from "assets/pqrd-2.svg";

const router = useRouter();
const route = useRoute();
const check = ref(false);
const checkAccai = ref(false);
const redirectTo = ref("");

const redirectPQRD = () => {
  window.location.replace(
    "https://www.procuraduria.gov.co/atencion-ciudadano/Pages/quejas-vulneracion-derechos-humanos.aspx"
  );
};

const redirectPQRDPublic = () => {
  const path = route.path.includes("public")
    ? "/public/PQRD/radicar-pqrd"
    : "/pqrd/radicar";
  router.push(path);
};

const redirectConsulta = () => {
  const path = route.path.includes("public")
    ? "/public/PQRD/consulta"
    : "/pqrd/consulta";
  router.push(path);
};

// const redirectPQRDMedica = () => {
//   const path = route.path.includes("public")
//     ? "/public/medicina-laboral/radicar"
//     : "/medicina/radicacion-ml";
//   router.push(path);
// };

onMounted(() => {
  redirectTo.value = route.path.includes("public")
    ? "/public/PQRD/politicas"
    : "/politicas";
});
</script>
