<template>
  <div class="tw-fixed tw-top-1/2 tw-right-4 tw-translate-y-1/2 tw-flex tw-flex-col tw-gap-2 tw-z-[9999]">
    <q-btn dense icon="contrast" @click="toggleContrast"/>
    <q-btn dense label="A+" @click="increaseFont" />
    <q-btn dense label="A-" @click="decreaseFont" />
  </div>

  <router-view />

  <Loading v-if="loadingStore.isLoading" />
</template>

<script setup lang="ts">
import { useLoadingStore } from "src/stores/LoadingStore";
import { useAuthStore } from "src/stores/auth.store";
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue';
import { toast } from "./helpers/toast";

const Loading = defineAsyncComponent(() => import('src/shared/components/Loading/Loading.vue'));

const loadingStore = useLoadingStore();
const auth = useAuthStore();

// ================== ♿ Accesibilidad ==================
const contrastMode = ref(false)
function toggleContrast() {
  contrastMode.value = !contrastMode.value
  document.body.classList.toggle('contrast-high', contrastMode.value)
}

const fontSize = ref(80);
const increaseFont = () => {
  if (fontSize.value < 150) fontSize.value += 10;
  document.documentElement.style.fontSize = `${fontSize.value}%`;
};
const decreaseFont = () => {
  if (fontSize.value > 70) fontSize.value -= 10;
  document.documentElement.style.fontSize = `${fontSize.value}%`;
};

// ================== 🌐 Detectar conexión ==================
function updateOnlineStatus() {
  if (!navigator.onLine) {
    toast.error("conexión inestable.");
  } else {
    toast.success("Conexión restablecida.");
  }
}

// ================== ⏰ Logout por inactividad ==================
let lastActivityTime = Date.now();
const MAX_INACTIVITY_TIME = 15 * 60 * 1000;
let inactivityInterval: ReturnType<typeof setInterval> | null = null;

function updateActivity() {
  lastActivityTime = Date.now();
}

function startInactivityCheck() {
  // Registrar eventos de actividad
  ["mousemove", "keydown", "click", "scroll"].forEach(evt => {
    window.addEventListener(evt, updateActivity);
  });

  // Revisar cada 10 segundos si ya pasó el límite
  inactivityInterval = setInterval(() => {
    const now = Date.now();
    if (now - lastActivityTime >= MAX_INACTIVITY_TIME) {
      // Sesión expirada por inactividad
      localStorage.clear();
      auth.logOut();
      toast.error("Sesión cerrada por inactividad.");
      window.location.reload();
    }
  }, 10000); // 10s
}

function stopInactivityCheck() {
  ["mousemove", "keydown", "click", "scroll"].forEach(evt => {
    window.removeEventListener(evt, updateActivity);
  });
  if (inactivityInterval) clearInterval(inactivityInterval);
}

// ================== Lifecycle ==================
onMounted(async () => {
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);

  if (!navigator.onLine) {
    toast.error("❌ Estás sin conexión a internet.");
  }

  const momentModule = await import('moment-timezone')
  const moment = momentModule.default || momentModule
  moment.tz.setDefault('America/Bogota')

  const currentVersion = process.env.APP_VERSION;
  const savedVersion = localStorage.getItem('app_version');
  if (savedVersion && savedVersion !== currentVersion) {
    localStorage.setItem('app_version', currentVersion);
    window.location.reload();
  } else {
    localStorage.setItem('app_version', currentVersion);
  }

  // Validación de token
  if (auth.token && auth.refreshToken && auth.expire) {
    const now = Math.floor(Date.now() / 1000);
    if (auth.expire > now) {
      auth.scheduleTokenRefresh();
    } else {
      localStorage.clear();
      auth.logOut();
      window.location.reload();
    }
  }

  // Activar control de inactividad
  startInactivityCheck();
});

onUnmounted(() => {
  window.removeEventListener("online", updateOnlineStatus);
  window.removeEventListener("offline", updateOnlineStatus);
  stopInactivityCheck();
});
</script>
