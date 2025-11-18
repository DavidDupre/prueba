<template>
  <div class="q-pa-xl">
    <div class="q-mb-lg">
      <h5 class="text-h5 q-ma-none q-mb-md" style="font-weight: 600">
        Remitente
      </h5>
    </div>

    <FormComponentModel v-model="formData" :form="finalForm" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import FormJs from "../boot/form.json";
import FormComponentModel from "@shell/components/Forms/FormComponentModel.vue";
import { fieldConfigParser } from "@shell/components/Forms/formParser";

const props = defineProps<{
  cotizacionId?: string | number;
  isEdit?: boolean;
  isCotFromCore: boolean;
  ramo: number;
}>();

// estado reactivo para los valores del formulario (v-model)
const formData = reactive<Record<string, unknown>>({});

// helper que soporta tanto JSON-objeto como función exportada
const resolveFormSource = (src: unknown, ramo: number | string) => {
  if (typeof src === "function") {
    return src(ramo);
  }
  const key = String(ramo);
  return src && typeof src === "object" && key in src
    ? (src as Record<string, unknown>)[key]
    : src;
};

const formFieldsDatosGenerales = computed(() => {
  const resolved = resolveFormSource(FormJs, props.ramo);
  return resolved;
});

const finalForm = computed(() =>
  fieldConfigParser(formFieldsDatosGenerales.value),
);

const emit = defineEmits<{
  cancel: [];
  continue: [data: Record<string, unknown>];
}>();

function onCancel() {
  emit("cancel");
}

function onContinue() {
  emit("continue", formData);
}
</script>
