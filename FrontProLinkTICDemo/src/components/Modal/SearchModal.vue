<template>
  <q-dialog v-model="open" persistent>
    <q-card :class="['tw-px-3', 'tw-p-4 tw-w-[480px]']">
      <q-card-section>
        <p class="tw-text-xl tw-font-bold">{{ title }}</p>
        <p class="tw-mt-3">{{ body }}</p>
        <SearchInput map-options emit-value :options="selectOptions" v-model:input-data-prop="selectedOption"
          :label="label ?? 'Búsqueda'" maxlength="5" :limit-number="0" />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn label="Guardar" style="width: 200px" text-color="white" color="secondary" class="tw-rounded-xl tw-p-3 "
          @click="handleButton" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Ref } from 'vue';
import SearchInput from '../SearchInput/SearchInput.vue';
import { SelectInput } from 'src/interfaces';

const props = defineProps<{
  title: string,
  body: string,
  label?: string,
  selectOptions: SelectInput[],
  modelValue: boolean,
  selectedValue: string,
}>()

const emit = defineEmits(['update:modelValue', 'update:selectedValue', 'save', 'cancel', 'closeModal', 'handleAccept'])

const selectedOption = computed({
  get: () => props.selectedValue,
  set: (value) => emit('update:selectedValue', value)
})

function handleCancel() {
  emit('cancel')
}

const open = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }

})
function hideModal() {
  emit('closeModal')
}

function handleButton() {
  emit('handleAccept')
}
</script>
