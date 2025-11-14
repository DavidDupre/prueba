<template>
    <Modal v-model="showModal" title="Confirmación" cancelButton
    @handleAccept="enviarPublicacion" @closeModal="closeModal" textButtonCancel="Cancelar" text-button="Aceptar"
    text="¿Cerrar la devolución y enviar el documento al estado Publicar?" type="button" />
  </template>

  <script setup lang="ts">
  import { ref } from 'vue';
  import { intescoAxios, sgdeaAxios } from 'src/services';
  import Modal from 'components/Modal/Modal.vue';
  import { useAuthStore } from "src/stores/auth.store";
  import { toast } from 'src/helpers/toast';
  import { crearTrazabilidad } from 'src/helpers/trazabilidad';

  const props = withDefaults(defineProps<{
      detallesRegistro: any,
      type: any
  }>(), {})

  const emit = defineEmits(['backView'])
  const auth = useAuthStore()
  const showModal = ref(true)

  const closeModal = () => {
    showModal.value = false
    emit('backView')
  }


  const enviarPublicacion = async() => {
    if (props.type == "tutelas") {
      const publicar = await sgdeaAxios.post(`/tutelas/${props.detallesRegistro.idTutela}/publicacion/publicar`, {
        idUsuario: auth.$state.userInfo.userid,
        motivo: ""
      });
      if (publicar.status == 200) {
        toast.success('El documento ha cambiado a estado Publicado')
            await crearTrazabilidad({
            proceso: `TUT ${props.detallesRegistro.id}`,
            secuencia: props.detallesRegistro.idRadicado,
            estado:props.detallesRegistro.estadoProceso.estado,
            descripcion: `Usuario:${auth.$state.userInfo.name}  Detalle: Se ha realizado la publicación`,
            comentario: "Se ha realizado la publicación",
            nombre: auth.$state.userInfo.name,
            tramite: props.detallesRegistro.tipoTramite.nombre,
            accion: `${auth.$state.userInfo.name}  ha publicado el radicado ${props.detallesRegistro.idRadicado}`,
          });
        emit('backView')

      }
    }
    if (props.type == 'pqrd') {
      const publicar = await sgdeaAxios.post(`/pqrds/${props.detallesRegistro.id}/publicacion/publicar`, {
        idUsuario: auth.$state.userInfo.userid,
        motivo: ""
      });
        if (publicar.status == 200) {
        toast.success('El documento ha cambiado a estado Publicado')
         await crearTrazabilidad({
            proceso: `PQRD ${props.detallesRegistro.id}`,
            secuencia: props.detallesRegistro.idRadicado,
            estado:props.detallesRegistro.estadoProceso.estado,
            descripcion: `Usuario:${auth.$state.userInfo.name}  Detalle: Se ha realizado la publicación`,
            comentario: "Se ha realizado la publicación",
            nombre: auth.$state.userInfo.name,
            tramite: props.detallesRegistro.tipoTramite.nombre,
            accion: `${auth.$state.userInfo.name}  ha publicado el radicado ${props.detallesRegistro.idRadicado}`,
          });

        emit('backView')
      }

    }

    if (props.type == 'correspondencia') {
      const publicar = await sgdeaAxios.post(`/correspondencia/${props.detallesRegistro.id}/publicacion/publicar`, {
        idUsuario: auth.$state.userInfo.userid,
        motivo: ""
      });
      if (publicar.status == 200) {
        toast.success('El documento ha cambiado a estado Publicado')

        await crearTrazabilidad({
            proceso: `COR${props.detallesRegistro.id}`,
            secuencia: props.detallesRegistro.idRadicado,
            estado:props.detallesRegistro.estadoProceso.estado,
            descripcion: `Usuario:${auth.$state.userInfo.name}  Detalle: Se ha realizado la publicación`,
            comentario: "Se ha realizado la publicación",
            nombre: auth.$state.userInfo.name,
            tramite: props.detallesRegistro.tipoTramite.nombre,
            accion: `${auth.$state.userInfo.name}  ha publicado el radicado ${props.detallesRegistro.idRadicado}`,
          });

        emit('backView')
      }
    }


    emit('backView')
  }



</script>

  <style>

  </style>
