<template>
  <q-select
    class="flex justify-start items-center"
    style="border: 1px solid #e3e4e5; border-radius: 10px"
    v-model="model"
    dropdown-icon="expand_more"
    borderless
    :options="filteredOptions"
    transition-show="fade"
    hide-selected
  >
    <template v-slot:prepend>
      <div class="tw-flex tw-justify-between tw-items-center tw-gap-2 tw-w-fit">
        
        <div class="tw-relative">
          <q-avatar class="tw-w-[50px] tw-h-[50px]">
            <img :src="image" alt="image" />
          </q-avatar>

          <span
            class="tw-absolute tw-block tw-w-3.5 tw-h-3.5 tw-bg-red-500 tw-rounded-full tw-border-2 tw-border-white cursor-pointer"
            style="top: -2px; left: -5px"
          >
            <q-tooltip
              class="tw-bg-gray-900 tw-text-white tw-text-xs tw-rounded"
              anchor="top middle"
              self="bottom middle"
              :offset="[10, 10]"
            >
              Nueva opción: Cambiar Contraseña
            </q-tooltip>
          </span>
          
        </div>

        <div class="column justify-center tw-w-full">
          <span
            class="text-black text-weight-bold tw-w-fit text-no-wrap tw-capitalize tw-text-base"
            style="letter-spacing: 0.5px"
            >{{ name }}
          </span>
          <span
            class="text-black q-mt-xs !tw-w-fit tw-capitalize tw-text-sm"
            style="width: 200px; white-space: break-spaces; line-height: 17px"
          >
            {{ role }}
          </span>
        </div>
      </div>
    </template>

    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps" @click="handleOptionClick(scope.opt.label)">
        <q-item-section>
          <q-item-label class="text-weight-bold">
            {{ scope.opt.label }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "stores/auth.store";
import { useRouter } from "vue-router";

const model = ref("");
const auth = useAuthStore();

// NUEVO: Definimos los eventos que este componente puede emitir
const emit = defineEmits(['open-change-password']);

const userRole = ref(auth.$state.userInfo.role);
const props = defineProps<{
  name: string;
  role: string;
  image: string;
}>();

const options = [
  {
    label: "Firmas"
  },
  // NUEVO: Agregamos la opción para cambiar la contraseña
  {
    label: "Cambiar Contraseña",
  },
  {
    label: "Cerrar Sesión",
  },
];

const filteredOptions = computed(() => {
  if (userRole.value === "Aprobador") {
    return options;
  } else {
    return options.filter(option => option.label !== "Firmas");
  }
});

const router = useRouter();
const { logOut } = useAuthStore();

// MODIFICADO: Renombramos la función para que sea más genérica y manejamos el nuevo caso
async function handleOptionClick(label: string): Promise<void> {
  if (label === "Firmas") {
    router.push("/firmas/");
  } else if (label === "Cambiar Contraseña") {
    // NUEVO: En lugar de navegar, emitimos un evento al componente padre
    emit('open-change-password');
  } else if (label === "Cerrar Sesión") {
    await logOut();
    router.push("/");
  }
}
</script>

<style lang="scss"></style>