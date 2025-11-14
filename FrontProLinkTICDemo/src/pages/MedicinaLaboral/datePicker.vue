<template>
  <q-input outlined v-model="dateData" :mask="mask ? mask.replace(/\w/g, '#') : 'date'" class="col-6" :label="label"
    :disable="disabled" :dense="true" @update:model-value="validarFecha" :error="(!isChecked || error)" ref="inputRef">
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-model="dateData" @update:model-value="validarFecha" :options="options" :mask="mask"
            :default-year-month="defaultYearMonth">
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
import { computed, defineEmits, ref } from 'vue';
import moment from "moment/moment";

const props = withDefaults(defineProps<{
  inputDataProp?: string | Date | undefined,
  disabled?: boolean,
  required?: boolean,
  options?: any,
  label?: string,
  mask?: string
  defaultYearMonth?: string;
  future?: boolean,
  error?: boolean,
  requiredValitation?: boolean
}>(), {
  mask: "",
  future: false,
  error: false,
  requiredValitation: true
});

const emit = defineEmits(['update:inputDataProp', 'validaFecha']);
let isChecked = ref(true);
let inputRef = ref(null);

const validarFecha = (value) => {
  if(value){
    if (!props.requiredValitation) return;
  
    let isValidDate = esFechaValida(value);
    let isFutureDate = false;
  
    if (props.future) {
      isFutureDate = moment(value, props.mask, true).isSameOrAfter(moment().startOf('day'), 'day');
    }
  
    isChecked.value = isValidDate && (props.future ? isFutureDate : true);
  
    if (!isValidDate || (props.future && !isFutureDate)) {
      emit('validaFecha', { type: 'fecha', data: false });
    } else {
      emit('validaFecha', { type: 'fecha', data: true });
    }
  }
};

defineExpose({ 
  hasError: () => setTimeout(() => inputRef.value?.hasError && inputRef.value?.hasError(), 200),
  validarFecha,
  resetValidation: () => {
    inputRef.value?.resetValidation && inputRef.value?.resetValidation();
    isChecked.value = true;
  },
});

const esFechaValida = (fecha) => {
  if(fecha) {
    const parsedDate = moment(fecha, props.mask, true);
    return parsedDate.isValid();
  }
};

const dateData = computed({
  get() {
    return String(props.inputDataProp)
  },
  set(value) {
    emit('update:inputDataProp', value)
  }
});
</script>