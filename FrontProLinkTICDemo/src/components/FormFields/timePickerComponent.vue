<template>
  <q-input outlined v-model="dateTime" @update:model-value="validarHora" :mask="mask ? mask.replace(/\w/g, '#') : 'time'"
  :rules="inputValidate()" :error="isChecked ? false : true" :error-message="errorMessage"  dense>
    <template v-slot:append>
      <q-icon name="access_time" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-time v-model="dateTime" @update:model-value="validarHora">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Cerrar" color="secondary" flat />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">

import moment from "moment";
import { computed, ref, watch } from "vue";

const props = defineProps<{
  inputDataProp?: any,
  disabled?: boolean,
  required?: boolean,
  mask?: string,
  maxTime?: string
  mensajeError?: string
}>();

const emit = defineEmits(['update:inputDataProp', 'validaHora'])

let isChecked = ref(true)
let errorMessage = ref<string | null>(null);

const validarHora = (value: string) => {
  if (value !== '') {
    const isValidDate = esHoraValida(value);
    isChecked.value = isValidDate;

    if (!isValidDate) {
      if (props.maxTime && moment(value, 'HH:mm').isAfter(moment(props.maxTime, 'HH:mm'))) {
        errorMessage.value = `${props.mensajeError} ${props.maxTime}`;
      } else {
        errorMessage.value = 'Hora inválida';
      }
      emit('validaHora', { type: 'hora', data: false });
    } else {
      errorMessage.value = null;
      emit('validaHora', { type: 'hora', data: true });
    }
  } else {
    isChecked.value = true;
    errorMessage.value = null;
  }
};

const esHoraValida = (hora) => {
  const parsedHora = moment(hora, 'HH:mm', true);

  if (!parsedHora.isValid()) {
    return false;
  }

  if (props.maxTime) {
    const parsedMaxTime = moment(props.maxTime, 'HH:mm', true);
    if (parsedHora.isAfter(parsedMaxTime)) {
      return false;
    }
  }

  return true;
};

function inputValidate(): Array<any> {
  const rules: any[] = [];

  // Allow empty value if not required
  if (!props.required) {
    rules.push((val) => true);
    return rules;
  }

  // Required field validations
  rules.push((val) => {
    if (!(val && val.length > 0)) {
      return 'Este campo es requerido';
    }
  });

  // Add hour validation rule
  rules.push((val) => {
    const hour = parseInt(val.split(':')[0]);
    if (isNaN(hour) || hour < 0 || hour > 24) {
      return 'La hora debe ser un número entre 0 y 24';
    }
  });

  return rules;
}
const dateTime = computed({
  get() {
    return props.inputDataProp
  },
  set(value) {
    emit('update:inputDataProp', value)
  }
})
</script>
