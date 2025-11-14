<template>
  <q-input
    outlined
    v-model="dateTime"
    mask="time"
    :rules="inputValidate()"
    dense
  >
    <template v-slot:append>
      <q-icon size="16px" name="access_time" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-time v-model="dateTime" :format24h="format" text-color="black">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Cerrar" color="primary" flat />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { computed } from "vue"; // Solo importar computed

const props = defineProps<{
  modelValue?: string | null; // Cambiar any por string | null
  disabled?: boolean;
  required?: boolean;
  format?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | null): void;
}>();

function inputValidate(): Array<(val: string | null) => boolean | string> {
  const rules: Array<(val: string | null) => boolean | string> = [];

  if (!props.required) {
    rules.push(() => true);
    return rules;
  }

  rules.push((val: string | null) => {
    if (!val || val.length === 0) {
      return "Este campo es requerido";
    }
    return true;
  });

  return rules;
}

const dateTime = computed({
  get() {
    return props.modelValue || "";
  },
  set(value: string) {
    emit("update:modelValue", value);
  },
});
</script>
