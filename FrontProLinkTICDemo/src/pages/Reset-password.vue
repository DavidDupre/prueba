<template>
  <q-form
    class="tw-min-h-screen tw-h-full tw-flex tw-flex-col md:tw-flex-row"
    greedy
  >
    <div
      class="tw-flex tw-flex-col tw-mx-auto tw-bg-white tw-z-50 tw-justify-center tw-px-6"
      style="width: 60%"
    >
      <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-relative">
        <div class="tw-w-full md:tw-w-10/12 lg:tw-w-3/5 tw-mx-auto">
          <h1 class="tw-text-4xl tw-text-center tw-font-bold tw-mt-4">
            Recuperar <span class="text-primary">Contraseña</span>
          </h1>

          <div class="tw-py-8">
            <!-- STEP 1 -->
            <div v-if="step === 1" class="tw-space-y-4">
              <label class="tw-block tw-text-gray-inputs tw-text-md tw-font-bold">
                Correo electrónico
              </label>
              <div class="tw-relative">
                <q-input
                  type="email"
                  v-model="email"
                  required
                  placeholder="Ingrese su correo"
                  class="tw-rounded-xl tw-py-1 tw-w-full tw-shadow-sm tw-border-gray-inputs"
                  outlined
                  dense
                  :rules="[ val => !!val || 'El correo es obligatorio', val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Correo no válido']">
                  <template v-slot:prepend>
                    <q-icon name="o_mail" />
                  </template>
                </q-input>
              </div>

              <div class="tw-flex tw-justify-center tw-gap-4 tw-mt-4">
                <q-btn
                  outline
                  label="Cancelar"
                  color="grey-7"
                  class="tw-w-40 tw-rounded-lg tw-font-semibold"
                  @click="router.push('/')"
                />
                <q-btn
                  label="Validar"
                  color="primary"
                  :loading="loading"
                  class="tw-w-40 tw-rounded-lg tw-font-semibold"
                  @click="validateEmail"
                />
              </div>
            </div>

            <!-- STEP 2 -->
            <div v-else-if="step === 2" class="tw-space-y-4">
              <label class="tw-block tw-text-gray-inputs tw-text-md tw-font-bold">
                Introduce el código de seguridad
              </label>
              <div class="tw-relative">
                <q-input
                  v-model="otp"
                  placeholder="Ingrese el código"
                  class="tw-rounded-xl tw-py-1 tw-w-full tw-shadow-sm"
                  outlined
                  dense
                >
                  <template v-slot:prepend>
                    <q-icon name="password" />
                  </template>
                </q-input>
              </div>

              <div class="tw-flex tw-justify-center tw-gap-4 tw-mt-4">
                <q-btn
                  outline
                  label="Cancelar"
                  color="grey-7"
                  class="tw-w-40 tw-rounded-lg tw-font-semibold"
                  @click="router.push('/')"
                />
                <q-btn
                  label="Aceptar"
                  color="primary"
                  :loading="loading"
                  class="tw-w-40 tw-rounded-lg tw-font-semibold"
                  @click="changePassword"
                />
              </div>
            </div>

            <!-- STEP 3 -->
          </div>
        </div>
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import {toast} from "src/helpers/toast";
import {sgdeaAxios} from "src/services";

const router = useRouter()
const $q = useQuasar()

const step = ref(1)
const loading = ref(false)

const email = ref('')
const otp = ref('')
const oldPassword = ref('')
const newPassword = ref('')
const repeatPassword = ref('')

 const validateEmail = async () => {
   if (!email.value) {
     toast.error("Debe completar el correo para continuar");
     return;
   }
   loading.value = true;
   try {
     const response = await sgdeaAxios.post('/usuarios/generate-otp', {
       email: email.value
     });
     if (response?.data?.mensaje === 'OTP GENERADO EXITOSAMENTE') {
       toast.success('Correo validado exitosamente. Por favor, revise su bandeja de entrada.');
      step.value = 2;
     } else {
       toast.error('Error al generar el OTP');
     }
   } catch (error) {
     toast.error("El correo ingresado no es válido");
   } finally {
     loading.value = false;
  }
 }

const validateOtp = async () => {
  if (!otp.value) {
    toast.error("Debe ingresar el codigo OTP para continuar.");
    return
  }

  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success('Otp validado correctamente.');

    step.value = 3
  } catch {
    toast.error("Otp invalido.");
  } finally {
    loading.value = false
  }
}


const changePassword = async () => {
  if (!email.value || !otp.value) {
    toast.error("Debe completar el correo y el código OTP.");
    return;
  }

  loading.value = true;
  try {
    const response = await sgdeaAxios.post('/usuarios/forgot-password', {
      email: email.value,
      otp: otp.value
    });

    if (response?.data?.message) {
      toast.success('Contraseña enviada al correo exitosamente.');
      router.push('/');
    } else {
      toast.error('No se pudo generar la nueva contraseña.');
    }

  } catch (error) {
    toast.error("Error al cambiar la contraseña.");
    router.push('/');
  } finally {
    loading.value = false;
  }
};

</script>

<style scoped>
</style>
