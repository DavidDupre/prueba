import { ref, watch, Ref, onBeforeMount } from 'vue';
import { useRouter } from "vue-router";

import { useAuthStore } from "src/stores/auth.store"
import { FormLogin, FormBase } from './interfaces';
// @ts-ignore
import logo from 'src/assets/logo-positiva.svg'
// @ts-ignore
import logoDocu from 'src/assets/docu_logo.svg'
// @ts-ignore
import logoTres from 'src/assets/trest_logo.svg'
// @ts-ignore
import boyslogin from 'src/assets/boyslogin.webp'
// @ts-ignore
import version from "./../../package.json";


export const useLoginData = () => {

  const router = useRouter()
  const errorModal = ref(false)
  const loginForm: Ref<FormBase> = ref(new FormLogin());
  const isPwd: Ref<boolean> = ref(true);
  const userError: Ref<boolean> = ref(false);
  const passError: Ref<boolean> = ref(false);
  const { login, cleanInfo } = useAuthStore();
  const store = useAuthStore();
  const recaptchaIsVisible :Ref<boolean> = ref(false);

  watch(() => store.isLogged, (newValue) => {
    if (newValue) {
      router.push('/home')
    }
  });

  watch(() => store.errorLogin, (newValue) => {
    errorModal.value = newValue
  })

  const validarEmail = (val: string) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val !== undefined) {
      if (regexEmail.test(val)) {
        return true;
      } else {
        return 'Debe ingresar un email valido';
      }
    }

    return true;

  }

  const validaContrasena = (val: string): any => {
    if (val !== undefined) {
      if (val.length < 8) return 'La contraseña debe tener minimo 8 caracteres';

      const tieneMayuscula = /[A-Z]/.test(val);
      const tieneMinuscula = /[a-z]/.test(val);
      const tieneNumero = /[0-9]/.test(val);
      const tieneCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(val);

      if (tieneMayuscula && tieneMinuscula && tieneNumero && tieneCaracterEspecial) {
        return true;
      }
      else {
        return 'La contraseña debe tener minimo una mayuscula, una minuscula, un numero y un caracter especial.'
      }
    }
    else {
      return true;
    }

  };


  const loginHandler = async () => {
    await login(loginForm.value.user, loginForm.value.password);
    if (!store.isLogged) { errorModal.value = true;}
  }

  const handleModal = async () => {
    loginForm.value = new FormLogin();
    errorModal.value = false;
    cleanInfo();
  }

  const storedState = localStorage.getItem('auth');
  if (storedState) {
    store.$state = JSON.parse(storedState);
  }

  const loginIsBisible = (isLocalhost):boolean=>{
    const { user,password } = loginForm.value;
    const isLogin =  !(user && password);

    return isLocalhost ? isLogin : !(recaptchaIsVisible.value === true) && isLogin;
  }


  const onVerify = (response) => {
    recaptchaIsVisible.value = true;
  };

  const onExpire = () => {
    recaptchaIsVisible.value = false;
  };

  const onFail = () => {
    recaptchaIsVisible.value=false;
  };

  return {
    onVerify,
    onExpire,
    onFail,
    loginIsBisible,
    logo,
    logoTres,
    version,
    logoDocu,
    loginForm,
    boyslogin,
    errorModal,
    loginHandler,
    handleModal,
    validarEmail,
    validaContrasena,
    isPwd,
    userError,
    passError,
    store
  }
}
