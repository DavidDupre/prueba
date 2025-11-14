<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { defineAsyncComponent } from 'vue';
import { useLoginData } from "./useLogin.Logic";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth.store";

const Modal = defineAsyncComponent(() => import("src/components/Modal/Modal.vue"));

const router = useRouter();
const {
  logo,
  logoTres,
  version,
  loginForm,
  boyslogin,
  errorModal,
  loginHandler,
  handleModal,
  isPwd,
  userError,
  passError,
  loginIsBisible,
  onVerify,onExpire,onFail
} = useLoginData();

const captchaName = ref("turnstile");
const publicKey = "0x4AAAAAABm_meOCvQHc-VU8";
const captchaResponse = ref("");
const VueCaptchaSwitcher = ref();



if (useAuthStore().isLogged) router.push("/home");

</script>

<template>
  <q-form
    class="tw-min-h-screen tw-h-full tw-flex tw-flex-col md:tw-flex-row"
    greedy
    @submit.prevent="loginHandler"
  >
    <!--SECCION DERECHA INICIAR SESION-->
    <div
      class="tw-flex tw-flex-col tw-mx-auto tw-bg-white tw- tw-z-50 tw-justify-center"
      style="width: 100%"
    >
      <img
        v-lazy
        :data-url="logo"
        alt=""
        class="tw-ml-10 tw-mr-auto tw-mt-10 tw-top-0 tw-absolute"
      />

      <div
        class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-relative tw-z-20"
      >
        <div class="tw-mx-auto tw-w-full md:tw-w-10/12 lg:tw-w-3/5">
          <!-- <img :src="logoDocu" alt="" class="tw-mx-auto" /> -->
          <h1 class="tw-text-4xl tw-text-center tw-font-bold tw-mt-4">
            Bienvenido a
            <span class="text-primary">Docum</span>
          </h1>

          <div class="tw-py-8">
            <!-- AQUÍ DEBE IR EL TRIGGER ERROR  -->
            <!-- AQUÍ DEBE IR EL TRIGGER ERROR -->

            <div class="tw-py-4">
              <label
                for="user"
                class="tw-block tw-text-gray-inputs tw-text-md tw-font-bold"
                >Usuario</label
              >
              <div class="tw-relative">
                <q-input
                  type="text"
                  placeholder="Ingrese su email"
                  :rules="[
                    /*validarEmail*/
                  ]"
                  required
                  class="tw-rounded-xl tw-py-1 tw-w-full tw-shadow-sm tw-border-gray-inputs"
                  v-model="loginForm.user"
                  outlined
                  dense
                >
                  <template v-slot:prepend>
                    <q-icon name="o_mail" />
                  </template>
                </q-input>
                <small class="tw-text-red-600" v-if="userError"
                  >Formato de correo invalido</small
                >
              </div>
            </div>

            <div>
              <label
                for="username"
                class="tw-block tw-text-gray-inputs tw-text-md tw-font-bold"
                >Contraseña</label
              >
              <div class="tw-relative">
                <q-input
                  v-model="loginForm.password"
                  :type="isPwd ? 'password' : 'text'"
                  name="password"
                  required
                  placeholder="Ingrese su contraseña"
                  :rules="[
                    /*validaContrasena*/
                  ]"
                  class="tw-rounded-xl tw-py-1 tw-w-full tw-shadow-sm"
                  outlined
                  dense
                >
                  <template v-slot:prepend>
                    <q-icon name="o_lock" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
                <small class="tw-text-red-600" v-if="passError"
                  >La contraseña debe tener 8 caracteres minimo, una mayuscula,
                  una minuscula, un numero y un caracter especial.</small
                >
              </div>
            </div>

            <div class="tw-flex tw-flex-col">
              <a
                href="/reset-password"
                class="tw-text-blue-linktic tw-ml-auto tw-mt-2 tw-font-bold"
                >¿Olvidaste tu contraseña?</a
              >

              <!-- <div class="tw-flex tw-items-center tw-justify-center tw-mr-auto tw-pt-5">
                <label for="remember" class="tw-flex tw-items-center">
                  <input type="checkbox" id="remember" name="remember"
                    class="tw-h-6 tw-w-6 tw-border tw-border-gray-inputs tw-mr-2">
                  <span class="tw-text-gray-texts">Recordar mi clave</span>
                </label>
              </div> -->

              <q-btn
                color="primary"
                type="submit"
                class="tw-flex tw-justify-center tw-items-center tw-w-auto tw-text-white tw-py-2 tw-rounded-lg tw-font-semibold tw-mt-5"
              >
                Ingresar
              </q-btn>
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
              <!--              <a href="#" class="tw-font-bold tw-text-blue-intense tw-mx-auto tw-my-8">Registrarme</a>-->
            </div>
          </div>

          <!--END FORM-->
        </div>
      </div>
      <div
        class="tw-flex tw-font-sans tw-mt-10 tw tw-text-[#A5B1BF] tw-gap-5 tw-items-center tw-justify-center tw-bottom-0 tw-mx-auto tw-mb-5"
        style="width: 100%"
      >
        <p class="">Hecho por</p>
          <img v-lazy :data-url="logoTres" alt="" class="" />
        <!-- <p>Versionamiento 1.1.2</p> -->
        <p>Versionamiento {{ version.version }}</p>
        <a
          href="https://www.positiva.gov.co/en/web/guest/politicas-de-privacidad-y-condiciones-de-uso"
          class="tw-underline"
          >Terminos y condiciones</a
        >
      </div>
      <!--IMAGEN HOJAS-->
    </div>

    <!-- SECCION IZQUIERDA IMAGEN-->
    <div class="tw-w-full tw-flex">
      <div class="tw-relative tw-h-full tw-w-full -linktic">
          <img
          v-lazy
          :data-url="boyslogin"
          class="tw-w-full tw-h-full tw-object-cover tw-object-left"
          alt="woman"
        />
      </div>
    </div>
    <!--END BLOCK-->
  </q-form>

  <Modal
    v-model="errorModal"
    title="Algo salió mal"
    text="El usuario o contraseña es invalido"
    :is-success="false"
    text-button="Aceptar"
    @handleAccept="handleModal"
  />

  <!--END BLOCK-->
</template>
