<template>
  <q-dialog 
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent 
    maximized
    :backdrop-filter="'blur(4px) brightness(60%)'"
  >
    <q-card class="tw-flex tw-items-center tw-justify-center tw-min-h-screen tw-bg-transparent">
      <q-card class="tw-w-[30%] tw-min-w-[280px] tw-mx-4 tw-bg-white tw-rounded-xl tw-shadow-2xl">
        <q-card-section class="tw-text-center tw-py-8">
          <div class="tw-mb-6">
            <q-icon 
              name="lock_reset" 
              size="4rem" 
              class="tw-text-primary"
            />
          </div>
          <h3 class="tw-text-2xl tw-font-bold tw-text-gray-800 tw-mb-2">
            {{ title }}
          </h3>
          <p class="tw-text-gray-600 tw-mb-6">
            {{ description }}
          </p>
        </q-card-section>

        <q-card-section class="tw-px-8 tw-pb-8">
          <q-form @submit="handleSubmit" class="tw-space-y-4">
            <div>
              <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                Contraseña Actual *
              </label>
              <q-input
                v-model="passwordForm.oldPassword"
                :type="showOldPassword ? 'text' : 'password'"
                outlined
                dense
                placeholder="Ingresa tu contraseña actual"
                :rules="oldPasswordRules"
                class="tw-w-full"
              >
                <template v-slot:append>
                  <q-icon
                    :name="showOldPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showOldPassword = !showOldPassword"
                  />
                </template>
              </q-input>
            </div>

            <div>
              <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                Nueva Contraseña *
              </label>
              <q-input
                v-model="passwordForm.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                outlined
                dense
                placeholder="Ingresa tu nueva contraseña"
                :rules="passwordRules"
                class="tw-w-full"
              >
                <template v-slot:append>
                  <q-icon
                    :name="showNewPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showNewPassword = !showNewPassword"
                  />
                </template>
              </q-input>
            </div>

            <div>
              <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                Confirmar Contraseña *
              </label>
              <q-input
                v-model="passwordForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                outlined
                dense
                placeholder="Confirma tu nueva contraseña"
                :rules="confirmPasswordRules"
                class="tw-w-full"
              >
                <template v-slot:append>
                  <q-icon
                    :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showConfirmPassword = !showConfirmPassword"
                  />
                </template>
              </q-input>
            </div>
            
            <div class="tw-flex tw-gap-3 tw-pt-6">
              <q-btn
                v-if="showCancelButton"
                type="button"
                color="grey-7"
                outline
                class="tw-flex-1 tw-py-6 tw-px-8 tw-h-10 tw-rounded-lg"
                @click="handleCancel"
                :disable="loading"
              >
                <q-icon name="close" class="tw-mr-2" />
                {{ cancelButtonText }}
              </q-btn>
              
              <q-btn
                type="submit"
                color="primary"
                class="tw-flex-1 tw-py-6 tw-px-8 tw-h-10 tw-rounded-lg"
                :loading="loading"
                :disable="!isFormValid"
              >
                <q-icon name="save" class="tw-mr-2" />
                {{ submitButtonText }}
              </q-btn>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

// Props
interface Props {
  modelValue: boolean;
  title?: string;
  description?: string;
  submitButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  loading?: boolean;
  customValidation?: (password: string) => string | boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Cambio de Contraseña",
  description: "Por favor, ingresa tu contraseña actual y elige una nueva.",
  submitButtonText: "Cambiar Contraseña",
  cancelButtonText: "Cancelar",
  showCancelButton: false, // Por defecto, el botón de cancelar está oculto
  loading: false,
});

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'submit': [payload: { oldPassword: string, newPassword: string }];
  'cancel': [];
}>();

// State
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const passwordForm = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Validation rules (sin cambios)
const oldPasswordRules = [
  (val: string) => (val && val.length > 0) || "La contraseña actual es requerida",
];
const passwordRules = [
  (val: string) => (val && val.length > 0) || "La contraseña es requerida",
  (val: string) => (val && val.length >= 8) || "Mínimo 8 caracteres",
  (val: string) => /(?=.*[a-z])/.test(val) || "Debe contener al menos una minúscula",
  (val: string) => /(?=.*[A-Z])/.test(val) || "Debe contener al menos una mayúscula",
  (val: string) => /(?=.*\d)/.test(val) || "Debe contener al menos un número",
  (val: string) => /(?=.*[@$!%*?&])/.test(val) || "Debe contener al menos un carácter especial (@$!%*?&)",
  ...(props.customValidation ? [(val: string) => props.customValidation?.(val) || true] : []),
];
const confirmPasswordRules = [
  (val: string) => (val && val.length > 0) || "Confirma tu contraseña",
  (val: string) => val === passwordForm.value.newPassword || "Las contraseñas no coinciden",
];

// Computed (sin cambios)
const isFormValid = computed(() => {
  const isOldPasswordFilled = passwordForm.value.oldPassword.length > 0;
  const hasMinLength = passwordForm.value.newPassword.length >= 8;
  const passwordsMatch = passwordForm.value.confirmPassword === passwordForm.value.newPassword;
  const hasValidFormat = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(passwordForm.value.newPassword);
  let customValidationPassed = true;
  if (props.customValidation) {
    const result = props.customValidation(passwordForm.value.newPassword);
    customValidationPassed = result === true;
  }
  return isOldPasswordFilled && hasMinLength && passwordsMatch && hasValidFormat && customValidationPassed;
});

// Methods
const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', {
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword
    });
  }
};

const handleCancel = () => {
  emit('update:modelValue', false); 
  
  emit('cancel');
  resetForm();
};

const resetForm = () => {
  passwordForm.value = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  showOldPassword.value = false;
  showNewPassword.value = false;
  showConfirmPassword.value = false;
};

// Exponer métodos públicos
defineExpose({
  resetForm,
});
</script>