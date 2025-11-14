<template>
    <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md q-px-sm">
          Cierre de Publicación
        </h3>
        <q-form ref="form">
          <div class="row full-width wrap tw-justify-start justify-around">
            <div class="row full-width">
    
              <div class="col-12">
                <label class="q-px-md tw-text-label">Observaciones *
                  <q-input type="textarea" outlined label="Inserte" dense emit-value v-model="observaciones"
                    :rules="[inputRequired, v => minLengthInput(10, v), v => maxLengthInput(10000, v)]" />
                </label>
              </div>
            </div>
          </div>
          <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
            <q-btn class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]" no-caps
              style="border: 1px solid #2c3948" @click="back()">Cancelar</q-btn>
            <q-btn class="tw-w-1/4 tw-h-11 bg-primary text-white" @click="validForm">Aceptar</q-btn>
          </div>
        </q-form>
        <Modal v-model="showModal" title="Confirmación" cancelButton
        @handleAccept="cerrarPublicacion()" textButtonCancel="Cancelar" text-button="Aceptar"
        text="¿Está seguro de cerrar la publicación?" type="button" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { alphanumeric, inputRequired, maxLengthInput, minLengthInput } from "src/helpers/validations";
  import { intescoAxios, sgdeaAxios } from 'src/services';
  import { toast } from 'src/helpers/toast';
  import Modal from 'components/Modal/Modal.vue';
  import { useAuthStore } from "src/stores/auth.store";

  const props = withDefaults(defineProps<{
      detallesRegistro: any,
      type: any
  }>(), {})
  
  const emit = defineEmits(['backView', "reload"])
  const auth = useAuthStore()
  const form = ref()
  const showModal = ref(false)
  const observaciones = ref("")
  const back = () => {
    showModal.value = false
    emit('backView')
  }
  
  
  const cerrarPublicacion = async() => {
    if (props.type == "tutelas") {
      const cierrePublicacion = await sgdeaAxios.post(`/tutelas/${props.detallesRegistro.idTutela}/publicacion/cerrar`, {
        idUsuario: auth.$state.userInfo.userid,
        motivo: observaciones.value
      });
      if (cierrePublicacion.status == 200) {
        toast.success('La publicación ha sido cerrada satisfactoriamente')
        emit('reload')
        emit('backView')
      }
    }

    if (props.type == 'pqrd') {
      const cierrePublicacion = await sgdeaAxios.post(`/pqrds/${props.detallesRegistro.id}/publicacion/cerrar`, {
        idUsuario: auth.$state.userInfo.userid,
        motivo: observaciones.value
      });
      if (cierrePublicacion.status == 200) {
        toast.success('La publicación ha sido cerrada satisfactoriamente')
        emit('reload')
        emit('backView')
      }
    }

    if (props.type == 'correspondencia') {
      const cierrePublicacion = await sgdeaAxios.post(`/correspondencia/${props.detallesRegistro.id}/publicacion/cerrar`, {
        idUsuario: auth.$state.userInfo.userid,
        motivo: observaciones.value
      });
      if (cierrePublicacion.status == 200) {
        toast.success('La publicación ha sido cerrada satisfactoriamente')
        emit('reload')
        emit('backView')
      }
    }
    
  }

  const validForm = async() => {
    if (await form.value.validate()) {
        showModal.value = true
    }else{
        toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos')
    }
  }
  
  </script>
  
  <style>
    
  </style>