<template>
  <q-input
    outlined
    v-model="dateData"
    :mask="mask ? mask.replace(/\w/g, '#') : 'date'"
    class="col-6"
    :label="label"
    ref="refInput"
    :disable="disabled"
    :dense="true"
    @update:model-value="validarFecha"
    :error="(!isChecked || error)"
  >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date
            v-model="dateData"
            @update:model-value="validarFecha"
            :options="computedOptions"
            :mask="mask"
          >
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Cerrar" color="secondary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { computed, defineEmits, ref, watch } from 'vue';
import moment from 'moment/moment';

const emit = defineEmits(['update:inputDataProp', 'validaFecha']);

const isChecked = ref(true);
const refInput = ref(null);

const props = withDefaults(defineProps<{
  inputDataProp?: string | Date | undefined,
  disabled?: boolean,
  required?: boolean,
  options?: any,
  label?: string,
  mask?: string,
  future?: boolean,
  error?: boolean,
  requiredValitation?: boolean,
  noFutureDates?: boolean,
  referenceDateLimit?: string,
  minimumMonths?: number,
  minimumYear?: number,
  minimumMonth?: number
}>(), {
  mask: "",
  future: false,
  error: false,
  requiredValitation: true,
  noFutureDates: false,
  minimumYear: 2023,
  minimumMonth: 1
});


const dateData = computed<string>({
  get() {
    if (props.inputDataProp instanceof Date) {
      return moment(props.inputDataProp).format(props.mask || 'DD/MM/YYYY');
    }
    return props.inputDataProp || '';
  },
  set(value) {
    emit('update:inputDataProp', value);
  }
});


const computedOptions = computed(() => {
  return (dateStr: string) => {
    const parsed = moment(dateStr, 'YYYY/MM/DD', true);
    if (!parsed.isValid()) return false;

    const today = moment();

    if (props.noFutureDates && parsed.isAfter(today, 'day')) return false;

    if (props.minimumYear && props.minimumMonth) {
    const minDate = moment()
        .year(props.minimumYear)
        .month(props.minimumMonth - 1)
        .startOf('month');

    if (parsed.isBefore(minDate, 'day')) {
        isChecked.value = false;
        emit('validaFecha', {
        type: 'fecha',
        data: false,
        reason: 'before_min_year'
        });
        return;
    }
    }


    if (props.referenceDateLimit) {
      const ref = moment(props.referenceDateLimit, props.mask, true);
      const safeMonths = Number.isFinite(props.minimumMonths) && Number(props.minimumMonths) > 0
        ? Number(props.minimumMonths)
        : 3;
      const minDate = ref.subtract(safeMonths, 'months');
      if (parsed.isBefore(minDate, 'day')) return false;
    }

    return true;
  };
});


const validarFecha = (value: string) => {
  if (!props.requiredValitation) return;

  if (value !== '') {
    const isValidDate = esFechaValida(value);
    const future = props.future;
    const parsed = moment(value, props.mask, true);

    let isBeforeOrEqualToday = true;
    if (props.noFutureDates) {
      isBeforeOrEqualToday = parsed.isSameOrBefore(moment(), 'day');
    }

    let isAfterOrEqualMinReference = true;
    if (props.referenceDateLimit) {
      const minDate = moment(props.referenceDateLimit, props.mask, true).subtract(props.minimumMonths, 'months');
      isAfterOrEqualMinReference = parsed.isSameOrAfter(minDate, 'day');
    }

    const isFutureDate = future
      ? parsed.isSameOrAfter(moment().startOf('day'), 'day')
      : parsed.isAfter(moment());

    isChecked.value =
      isValidDate &&
      (future ? isFutureDate : !isFutureDate) &&
      isBeforeOrEqualToday &&
      isAfterOrEqualMinReference;

    if (!isChecked.value) {
      emit('validaFecha', {
        type: 'fecha',
        data: false,
        reason: !isValidDate
          ? 'invalid'
          : !isBeforeOrEqualToday
            ? 'after_today'
            : !isAfterOrEqualMinReference
              ? 'before_minimum'
              : 'invalid_logic'
      });
    } else {
      emit('validaFecha', { type: 'fecha', data: true });
    }
  } else {
    isChecked.value = true;
  }
};

const esFechaValida = (fecha: string) => {
  const parsedDate = moment(fecha, props.mask, true);
  return parsedDate.isValid();
};

watch(
  () => [props.referenceDateLimit, props.minimumMonths, dateData.value],
  ([refLimit, months, currentDate]) => {
    if (!refLimit || !currentDate) return;

    const parsedCurrent = moment(currentDate, props.mask, true);
    const parsedLimit = moment(refLimit, props.mask, true);
    const safeMonths = Number.isFinite(months) && Number(months) > 0 ? Number(months) : 3;
    const minDate = parsedLimit.subtract(safeMonths, 'months');

    if (parsedCurrent.isBefore(minDate, 'day')) {
      const corrected = minDate.format(props.mask);
      emit('update:inputDataProp', corrected);
      validarFecha(corrected);
    }
  },
  { immediate: true }
);

defineExpose({
  validarFecha,
  resetValidation: () => {
    isChecked.value = true;
    setTimeout(() => {
      refInput.value?.resetValidation();
    }, 60);
  },
  hasError: () => refInput.value?.hasError,
});
</script>
