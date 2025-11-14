<template>
  <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
    <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md q-px-sm">
      Rechazar Publicación
    </h3>
    <q-form ref="form">
      <div class="row full-width wrap tw-justify-start justify-around">
        <div class="row full-width">

          <div class="col-12">
            <label class="q-px-md tw-text-label">Observaciones * {{ observaciones.length }}/10000
              <q-input type="textarea" outlined label="Inserte" dense emit-value v-model="observaciones"
                :rules="[inputRequired, v => minLengthInput(10, v), v => maxLengthInput(10000, v)]" />
            </label>
          </div>
        </div>
      </div>
      <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
        <q-btn class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]" no-caps
          style="border: 1px solid #2c3948" @click="back()">Cancelar</q-btn>
        <q-btn class="tw-w-1/4 tw-h-11 bg-primary text-white" @click="rechazarPublicacion()">Rechazar</q-btn>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { alphanumeric, inputRequired, maxLengthInput, minLengthInput } from "src/helpers/validations";
import { intescoAxios, sgdeaAxios } from 'src/services';
import { toast } from 'src/helpers/toast';
import { useAuthStore } from "src/stores/auth.store";
import { crearTrazabilidad } from 'src/helpers/trazabilidad';

const props = withDefaults(defineProps<{
  detallesRegistro: any,
  type: any
}>(), {})

const emit = defineEmits(['backView', 'backPage'])

const auth = useAuthStore()
const form = ref()
const showModal = ref(true)
const observaciones = ref("")
const back = () => {
  showModal.value = false
  emit('backView')
}


const rechazarPublicacion = async () => {
  if (await form.value.validate()) {
    if (props.type == "tutelas") {
      const rechazarPublicacion = await sgdeaAxios.post(`/tutelas/${props.detallesRegistro.idTutela}/publicacion/rechazar`, {
        idUsuario: auth.$state.userInfo.userid,
        motivo: observaciones.value
      });
      if (rechazarPublicacion.status == 200) {
        toast.success('Se ha rechazado la publicación')
        emit('backPage')
      }
    }
    if (props.type == 'pqrd') {
      const rechazarPublicacion = await sgdeaAxios.post(`/pqrds/${props.detallesRegistro.id}/publicacion/rechazar`, {
        idUsuario: auth.$state.userInfo.userid,
        motivo: observaciones.value
      });
      if (rechazarPublicacion.status == 200) {
        toast.success('Se ha rechazado la publicación')
        emit('backPage')
      }
    }

    if (props.type == 'correspondencia') {
      const rechazarPublicacion = await sgdeaAxios.post(`/correspondencia/${props.detallesRegistro.id}/publicacion/rechazar`, {
        idUsuario: auth.$state.userInfo.userid,
        motivo: observaciones.value
      });
      if (rechazarPublicacion.status == 200) {
        toast.success('Se ha rechazado la publicación')
        emit('backPage')
        await crearTrazabilidad({
            proceso: `COR${props.detallesRegistro.id}`,
            secuencia: props.detallesRegistro.idRadicado,
            estado:props.detallesRegistro.estadoProceso.estado,
            descripcion: `Usuario:${auth.$state.userInfo.name}  Detalle: Se ha rechazado la publicación Motivo:${observaciones.value}`,
            comentario: "Se ha rechazado la publicación",
            nombre: auth.$state.userInfo.name,
            tramite: props.detallesRegistro.tipoTramite.nombre,
            accion: `${auth.$state.userInfo.name}  ha rechazado la publicación del radicado ${props.detallesRegistro.idRadicado}`,
          });
      }
    }

    if (props.type == 'Medicina') {
      const rechazarPublicacion = await sgdeaAxios.put(`/medicina/rechazarMedicina/${props.detallesRegistro.id}`, {
        idUsuario: auth.$state.userInfo.userid,
        motivo: observaciones.value
      });
      if (rechazarPublicacion.status == 200) {
        toast.success('Se ha rechazado la publicación')
        emit('backPage')
        await crearTrazabilidad({
            proceso: `COR${props.detallesRegistro.id}`,
            secuencia: props.detallesRegistro.idRadicado,
            estado:props.detallesRegistro.estadoProceso.estado,
            descripcion: `Usuario:${auth.$state.userInfo.name}  Detalle: Se ha rechazado la publicación Motivo:${observaciones.value}`,
            comentario: "Se ha rechazado la publicación",
            nombre: auth.$state.userInfo.name,
            tramite: props.detallesRegistro.tipoTramite.nombre,
            accion: `${auth.$state.userInfo.name}  ha rechazado la publicación del radicado ${props.detallesRegistro.idRadicado}`,
          });
      }
    }


  } else {
    toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos')
  }
}

</script>

<style></style>
