<template>
    <cargaMasivaModal :showModal="showModal" :id="id" :detalleRadicado="detalleRadicado"  @update:modelValue="emitClose()"/>
</template>


<script lang="ts" setup>
import { ref } from 'vue';
import cargaMasivaModal from './cargaMasivaModal.vue';

const emit = defineEmits(['closeModal'])

const props = withDefaults(
  defineProps<{
    detalleRadicado: any;
  }>(),
  {})

const showModal = ref(true);

const emitClose = () => {
    emit("closeModal")
}

</script>
