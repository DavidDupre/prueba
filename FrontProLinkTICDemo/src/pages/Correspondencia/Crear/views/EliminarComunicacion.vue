<template>
  <ConfirmModal
    @update:show-modal="handleRejectModal"
    @confirm-modal="handleSubmitEliminarRadicacion"
    :show-modal="showConfirmModal"
    text-show-modal="¿Esta seguro de eliminar esta comunicación?"
    text-confirm-modal="Si"
    text-cancel-modal="No"
  />
</template>
<script lang="ts" setup>
import { toast } from 'src/helpers/toast';
import { sgdeaAxios } from 'src/services';
import { objResponse } from '../CrearComunicaciones/const';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import ConfirmModal from "src/components/Modal/ConfirmModal.vue";

const router = useRouter()
const props = withDefaults(defineProps<{
  id: number
}>(), {

})
const emit = defineEmits(['back'])

const showCancelModal = ref(false)
const showConfirmModal = ref(true)

const handleRejectModal=()=>{
  showCancelModal.value = false;
  emit('back', 'datosGeneralesComunicaciones')
}

const handleSubmitEliminarRadicacion=async()=>{
  if(props.id === null){
    toast.error(objResponse.no_data)
    return
  }
  try {
    await sgdeaAxios.put(`correspondencia/comunicacion/actualizarEstado/${props.id}?idNuevoEstado=2`)
    toast.success(objResponse.eliminated);
    router.push('/')
  } catch (error) {
    toast.error(objResponse.default_error)
    return
  }
}
</script>
<style>
    
</style>