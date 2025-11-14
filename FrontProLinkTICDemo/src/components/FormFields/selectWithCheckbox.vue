<template>
  <div :class="classSelect">
      <q-select
        outlined
        dense
        v-model="selectValue"
        :options="options"
        :label="label"
        emit-value
        map-options
      >
        <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
          <q-item v-bind="itemProps">
            <q-item-section side>
              <q-checkbox :model-value="selected" @update:model-value="toggleOption(opt)" color="secondary" />
            </q-item-section>
            <q-item-section>
              <q-item-label v-html="opt.label" />
            </q-item-section>
          </q-item>
        </template>
      </q-select>
  </div>
</template>

<script setup lang="ts">

import {ref, watch } from 'vue';

const props = defineProps<{
  inputDataProp?: string | Date | undefined,
  disabled?: boolean,
  required?: boolean,
  options?: any,
  label?: string,
  classSelect?: string
}>()

//Variables
const selectValue = ref()
const emit = defineEmits(['update:inputDataProp'])

//Metodos

watch(selectValue, (newValue: any) => {
  selectValue.value = newValue
  emit('update:inputDataProp', selectValue.value)
});

</script>
