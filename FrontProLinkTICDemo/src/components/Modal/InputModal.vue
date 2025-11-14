<template>
  <q-dialog v-model="open">
    <q-card :class="['tw-px-3', 'tw-p-4 tw-w-[480px]']">
      <q-card-section>
        <p class="tw-text-xl tw-font-bold">{{ title }}</p>
        <q-input
          v-model="inputValue"
          outlined
          :label="label"
          :rules="[(val) => !!val || 'Este campo es obligatorio']"
          lazy-rules
        />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          :label="textCancelButton ?? 'Cancelar'"
          color="accent"
          text-color="black"
          class="tw-p-3"
          style="width: 210px;"
          flat
          @click="hideModal"
        />
        <q-btn
          :label="textSaveButton ?? 'Guardar'"
          style="width: 200px"
          text-color="white"
          color="secondary"
          class="tw-rounded-xl tw-p-3"
          @click="handleSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  title?: string,
  modelValue: boolean,
  input?: string,
  label: string,
  textSaveButton?: string,
  textCancelButton?: string
}>();

const emit = defineEmits(['update:modelValue', 'update:input', 'handleAccept', 'closeModal']);

const inputValue = ref(props.input || '');

const open = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});

function hideModal() {
  emit('closeModal');
}

function handleSubmit() {
  if (!inputValue.value) return;
  emit('handleAccept', inputValue.value);
  hideModal();
}
</script>
