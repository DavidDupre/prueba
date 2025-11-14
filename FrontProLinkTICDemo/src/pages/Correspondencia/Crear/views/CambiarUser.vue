<template>
  <FormAprobacion v-if="isAprobador" :data-initial="formRevision" @update:item-selected="val => userSeletecdByAsignar=val" :user="user" editar />

  <FormRevision v-else :data-initial="formRevision" @update:item-selected="val => userSeletecdByRevision=val" :user="user" editar />

    <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
      <q-btn class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]" no-caps
        style="border: 1px solid #2c3948" @click="">Cancelar</q-btn>
      <q-btn class="tw-w-1/4 tw-h-11 bg-primary text-white" @click="reasignar">Guardar</q-btn>
    </div>
</template>
<script setup lang="ts">
import FormAprobacion from 'src/components/comunicacion/FormAsigancion.vue';
import FormRevision from 'src/components/comunicacion/FormRevision.vue';
import { toast } from 'src/helpers/toast';
import { sgdeaAxios } from 'src/services';
import { useAuthStore } from 'src/stores/auth.store';
import { onMounted, ref } from 'vue';
import { objResponse } from '../CrearComunicaciones/const';

const props = withDefaults(defineProps<{
  id: number,
  isAprobador: boolean
}>(), {
})
const userSeletecdByRevision=ref(null)
const userSeletecdByAsignar=ref(null)
const formRevision = ref({
  observacionesRevision:'',
  numeroAnexos:'',
  observaciones:'',
});
const user = ref()
const auth = useAuthStore();
const emit = defineEmits(['changeStatus'])

onMounted(async() => {
  const endpoint = props.isAprobador ? 'obtenerAprobador' : 'obtenerRevisor';
  const response = await sgdeaAxios.get(`/correspondencia/${endpoint}/${props.id}`);
  user.value = response.data?.usuario?.id;
})

const reasignar = async() => {
  if (user.value) {
    await cambiarUser()
  } else {
    await enviarUser()
  }
}

const cambiarUser = async() => {
  try {
    let response;
    const isAprobador = props.isAprobador
    if (isAprobador) { 
  
      if(!userSeletecdByAsignar.value){
        toast.error('Debe seleccionar un usuario para completar la acción')
        return
      }

      response = await sgdeaAxios.post(`/correspondencia/comunicacion/remplazarAprobadorXIdCom/${props.id}`, {
        usuario: { id: userSeletecdByAsignar.value },
        asignador: { id: auth.$state.userInfo.userid },
        observaciones: formRevision.value.observacionesRevision
      })
    } else {
      if(!userSeletecdByRevision.value){
        toast.error('Debe seleccionar un usuario para completar la acción')
        return
      }
      response = await sgdeaAxios.post(`/correspondencia/comunicacion/remplazarRevisorXIdCom/${props.id}`, {
        usuario: { id: userSeletecdByRevision.value },
        asignador: { id: auth.$state.userInfo.userid },
        observaciones: formRevision.value.observacionesRevision
      })
    }
    if (response.status == 201) {
      toast.success(props.isAprobador ? objResponse.revision_success : objResponse.asignacion_success)
    }
  } catch (error) {
    toast.error('Ha ocurrido un error inesperado')
  }
}

const enviarUser = async() => {
  try {
    let response;
    if (props.isAprobador) {

      if(!userSeletecdByAsignar.value){
        toast.error('Debe seleccionar un usuario para completar la acción')
        return
      }

      response = await sgdeaAxios.post(`correspondencia/comunicacion/asignarAprobacion/${props.id}`,{
        observaciones:formRevision.value.observacionesRevision,
        usuario: userSeletecdByAsignar.value,
        asignador:auth.$state.userInfo.userid
      })
    } else {

      if(!userSeletecdByRevision.value){
        toast.error('Debe seleccionar un usuario para completar la acción')
        return
      }

      response = await sgdeaAxios.post(`correspondencia/comunicacion/asignar/${props.id}`,{
        observaciones:formRevision.value.observacionesRevision,
        usuario: userSeletecdByRevision.value,
        asignador:auth.$state.userInfo.userid
      })
    }
    if (response.status == 200) {
      toast.success(props.isAprobador ? objResponse.revision_success : objResponse.asignacion_success)
      emit('changeStatus')
    }

  } catch (error) {
    toast.error('Ha ocurrido un error inesperado')
  }
}

</script>
<style>
    
</style>