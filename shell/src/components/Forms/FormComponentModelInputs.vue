<template>
  <div class="row q-col-gutter-md q-pb-md q-px-md">
    <template v-for="input in form.inputs" :key="input.label || input.nombre">
      <div
        :class="getColumnClass(input)"
        v-if="!(input.hide && input.hide(currentValueFor(input)))"
      >
        <!-- Separator / Heading -->
        <div
          v-if="isSeparator(input)"
          class="text-center q-py-md text-weight-bold"
          style="font-size: 1rem; white-space: pre-line"
        >
          {{ input.nombre || input.text }}
        </div>

        <template v-else>
          <div class="q-mb-xs text-weight-medium" style="font-size: 0.875rem">
            {{ input.nombre }}
          </div>

          <!-- Usar métodos para obtener valores tipados -->
          <q-input
            v-if="isText(input)"
            :model-value="getTextValue(input)"
            @update:model-value="setFieldValue(input, $event)"
            :placeholder="getPlaceholder(input)"
            :type="
              input.type === 'textarea'
                ? 'textarea'
                : input.type === 'number'
                ? 'number'
                : 'text'
            "
            :rows="input.type === 'textarea' ? 5 : undefined"
            dense
            outlined
            :rules="input.rules || []"
            :disable="input.disabled"
            :bg-color="input.disabled ? 'grey-3' : 'white'"
          />

          <q-select
            v-else-if="isSelect(input)"
            :model-value="getSelectValue(input)"
            @update:model-value="setFieldValue(input, $event)"
            :label="getPlaceholder(input)"
            dense
            outlined
            :options="input.options || []"
            emit-value
            map-options
            :rules="input.rules || []"
            :disable="input.disabled"
            :bg-color="input.disabled ? 'grey-3' : 'white'"
          />

          <q-checkbox
            v-else-if="isCheckbox(input)"
            :model-value="getCheckboxValue(input)"
            @update:model-value="setFieldValue(input, $event)"
            :label="input.nombre || input.label"
            dense
            :disable="input.disabled"
          />

          <FileLoader
            v-else-if="isFile(input)"
            :model-value="getFileValue(input)"
            @update:model-value="setFieldValue(input, $event)"
            :hint="input.hint || ''"
            :multiple="input.multiple !== false"
            :accept="input.accept || '*/*'"
          />

          <q-input
            v-else-if="isDate(input)"
            :model-value="getTextValue(input)"
            @update:model-value="setFieldValue(input, $event)"
            :placeholder="getPlaceholder(input)"
            dense
            outlined
            :disable="input.disabled"
            :bg-color="input.disabled ? 'grey-3' : 'white'"
            mask="date"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    :model-value="getTextValue(input)"
                    @update:model-value="setFieldValue(input, $event)"
                    mask="YYYY-MM-DD"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Cerrar"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            v-else-if="isTime(input)"
            :model-value="getTextValue(input)"
            @update:model-value="setFieldValue(input, $event)"
            :placeholder="getPlaceholder(input)"
            dense
            outlined
            :disable="input.disabled"
            :bg-color="input.disabled ? 'grey-3' : 'white'"
            mask="time"
          >
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time
                    :model-value="getTextValueAsString(input)"
                    @update:model-value="setFieldValue(input, $event)"
                    format24h
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Cerrar"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <div v-else>
            <q-input
              :model-value="getTextValue(input)"
              @update:model-value="setFieldValue(input, $event)"
              :placeholder="getPlaceholder(input)"
              dense
              outlined
              :disable="input.disabled"
              :bg-color="input.disabled ? 'grey-3' : 'white'"
            />
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import type { FormStructure, Input } from "./index";
import FileLoader from "./fileLoader.vue";

const props = defineProps<{
  form: FormStructure;
  modelValue: Record<string, unknown> | undefined;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: Record<string, unknown>): void;
}>();

// current object fallback
const current = computed(() => props.modelValue ?? {});

// helper key
const keyFor = (input: Input) =>
  input.label || input.nombre || input.key || input.name || "";

// reactive container de valores
const fieldValues = reactive<Record<string, unknown>>({});

// Métodos para obtener valores tipados sin type assertions en template
const getTextValue = (input: Input): string | number | null => {
  const key = keyFor(input);
  const value = fieldValues[key];
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }
  return null;
};

const getTextValueAsString = (input: Input): string | null => {
  const key = keyFor(input);
  const value = fieldValues[key];
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return String(value);
  }
  return null;
};

const getSelectValue = (input: Input): string | number | null => {
  const key = keyFor(input);
  const value = fieldValues[key];
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }
  return null;
};

const getCheckboxValue = (input: Input): boolean => {
  const key = keyFor(input);
  const value = fieldValues[key];
  return !!value;
};

const getFileValue = (input: Input): File | File[] | null => {
  const key = keyFor(input);
  const value = fieldValues[key];

  console.log("getFileValue:", { key, value, multiple: input.multiple });

  // Si el input es múltiple, siempre retornar array
  if (input.multiple) {
    if (Array.isArray(value) && value.every((item) => item instanceof File)) {
      return value;
    }
    if (value instanceof File) {
      // Convertir File único a array
      return [value];
    }
    return null;
  }

  // Si no es múltiple, retornar File único
  if (value instanceof File) {
    return value;
  }
  if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
    // Si por alguna razón hay un array pero no es múltiple, retornar el primero
    return value[0];
  }

  return null;
};

const setFieldValue = (input: Input, value: unknown) => {
  const key = keyFor(input);
  console.log("setFieldValue called:", { key, value, type: input.type });
  fieldValues[key] = value;

  const next = { ...(current.value || {}) };
  next[key] = value;
  emit("update:modelValue", next);
};

function buildFieldValues() {
  // limpiar claves innecesarias para evitar residuos
  for (const k of Object.keys(fieldValues)) {
    delete fieldValues[k];
  }

  const hasDefaultValues = (props.form?.inputs || []).some(
    (input: Input) => input.defaultValue !== undefined
  );

  (props.form?.inputs || []).forEach((input: Input) => {
    const k = keyFor(input);
    // inicializar valores desde el modelo actual o usar defaultValue
    fieldValues[k] = current.value[k] ?? input.defaultValue;
  });

  // Si hay valores por defecto, emitirlos al modelo padre
  if (hasDefaultValues) {
    const next = { ...(current.value || {}) };
    (props.form?.inputs || []).forEach((input: Input) => {
      const k = keyFor(input);
      if (input.defaultValue !== undefined && next[k] === undefined) {
        next[k] = input.defaultValue;
      }
    });
    emit("update:modelValue", next);
  }
}

// inicializar y reconstruir al cambiar la definición del formulario
buildFieldValues();
watch(
  () => props.form && props.form.inputs,
  () => buildFieldValues(),
  { deep: true }
);

const currentValueFor = (input: Input) => current.value[keyFor(input)];

const isSeparator = (input: Input) =>
  (input.type || "").toLowerCase() === "separator";
const isText = (input: Input) =>
  !input.type || ["text", "string", "textarea", "number"].includes(input.type);
const isSelect = (input: Input) =>
  (input.type || "").toLowerCase() === "select" || Array.isArray(input.options);
const isFile = (input: Input) => (input.type || "").toLowerCase() === "file";
const isCheckbox = (input: Input) =>
  (input.type || "").toLowerCase() === "checkbox";
const isDate = (input: Input) =>
  (input.type || "").toLowerCase() === "date" ||
  (input.type || "").toLowerCase() === "datetime";
const isTime = (input: Input) => (input.type || "").toLowerCase() === "time";

// Generar placeholder dinámico basado en el tipo de input
const getPlaceholder = (input: Input): string => {
  if (input.hint) return input.hint;
  if (isSelect(input)) return "Seleccione";

  // Para textarea, mostrar contador de caracteres
  if (input.type === "textarea") {
    const maxLength = getMaxLength(input);
    if (maxLength) {
      const currentLength = (getTextValue(input) || "").toString().length;
      return `${currentLength}/${maxLength}`;
    }
  }

  if (isText(input) || isDate(input) || isTime(input)) return "Inserte";
  return "";
};

// Obtener maxLength desde el config
const getMaxLength = (input: Input): number | undefined => {
  const config = input.config;
  if (
    config &&
    typeof config === "object" &&
    "validate" in config &&
    typeof (config as { validate?: { maxLength?: number } }).validate ===
      "object"
  ) {
    const validateObj = (config as { validate?: { maxLength?: number } })
      .validate;
    return typeof validateObj?.maxLength === "number"
      ? validateObj.maxLength
      : undefined;
  }
  return undefined;
};

// ...existing code...

// Agrupar inputs por row para calcular columnas automáticamente
const inputsByRow = computed(() => {
  const grouped = new Map<string, Input[]>();

  (props.form?.inputs || []).forEach((input: Input) => {
    const rowKey = input.layout?.row || "default";
    if (!grouped.has(rowKey)) {
      grouped.set(rowKey, []);
    }
    grouped.get(rowKey)!.push(input);
  });

  return grouped;
});

// Determina las clases de columna basadas en el layout y tipo de input
const getColumnClass = (input: Input) => {
  // Si el input tiene una clase personalizada, úsala
  if (input.class) {
    return input.class;
  }

  // Textarea y file ocupan ancho completo
  const type = (input.type || "").toLowerCase();
  if (type === "textarea" || type === "file") {
    return "col-12";
  }

  // Separator ocupa ancho completo solo si no tiene className
  // ...existing code...

  // Calcular columnas basadas en cuántos campos hay en la misma row
  const rowKey = input.layout?.row || "default";
  const fieldsInRow = inputsByRow.value.get(rowKey)?.length || 1;

  if (fieldsInRow === 2) {
    return "col-xs-12 col-sm-6 col-md-6";
  } else if (fieldsInRow === 3) {
    return "col-xs-12 col-sm-6 col-md-4";
  } else if (fieldsInRow >= 4) {
    return "col-xs-12 col-sm-6 col-md-3";
  }

  // Por defecto, ancho completo
  return "col-12";
};
</script>
