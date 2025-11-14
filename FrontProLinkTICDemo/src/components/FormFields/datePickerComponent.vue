<template>
  <q-input outlined v-model="dateData" :mask="mask ? mask.replace(/\w/g, '#') : 'date'" class="col-6" :label="label" ref="refInput"
    :disable="disabled" :dense="true" @update:model-value="validarFecha" :error="(!isChecked || error)">
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-model="dateData" @update:model-value="validarFecha" :options="options" :mask="mask">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Cerrar" color="secondary" flat></q-btn>
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { computed, defineEmits, ref, watch } from 'vue';
import moment from "moment/moment";

const emit = defineEmits(['update:inputDataProp', 'validaFecha'])

let isChecked = ref(true)
let refInput = ref(null);

const validarFecha = (value) => {
  if (!props.requiredValitation) return;

  if (value !== '') {
    // Check if date is valid and not in the future
    const isValidDate = esFechaValida(value);
    const future = props.future;
    const isFutureDate = future ? moment(value, props.mask, true).isSameOrAfter(moment().startOf('day'), 'day') : moment(value, props.mask, true).isAfter(moment())
    isChecked.value = isValidDate && (future ? isFutureDate : !isFutureDate);

    // Handle future date error (optional)
    if (!isValidDate || (future ? !isFutureDate : isFutureDate)) {
      // Show error message, reset input, etc.
      // ...
      emit('validaFecha', { type: 'fecha' , data: false})
    } else {
      emit('validaFecha', { type: 'fecha' , data: true})
    }
  } else {
    // Empty input is considered valid (adjust if needed)
    isChecked.value = true;
  }
};

const esFechaValida = (fecha) => {
  const parsedDate = moment(fecha, props.mask, true); // Parse the date using moment

  return parsedDate.isValid(); // Check if the parsed date is valid
};

function inputValidate(): Array<any> {
  const rules: any[] = [];
  if (!props.required) {
    rules.push((val: any) => {
      return true;
    });
    return rules;
  }
  rules.push((val: any) => {
    if (!(val && val.length > 0)) {
      return 'Este campo es requerido'
    }
  });

  return rules;
}
const props = withDefaults(defineProps<{
  inputDataProp?: string | Date | undefined,
  disabled?: boolean,
  required?: boolean,
  options?: any,
  label?: string,
  mask?: string
  future?: boolean,
  error?: boolean,
  requiredValitation?: boolean
}>(), {
  mask: "",
  future: false,
  error: false,
  requiredValitation: true
})

const dateData = computed({
  get() {
    return props.inputDataProp
  },
  set(value) {
    emit('update:inputDataProp', value)
  }
})

defineExpose({
  validarFecha,
  resetValidation: () => {
    isChecked.value = true
    setTimeout(() => {
      refInput.value?.resetValidation();
    }, 60)
  },
  hasError: () => refInput.value?.hasError,
});
</script>
