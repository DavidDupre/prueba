<template>
  <q-dialog v-model="open" :persistent="persistent">
    <q-card class="tw-px-3 tw-h-[370px] tw-w-[700px]">
      <q-card-section>
        <p class="tw-text-[24px] tw-font-bold q-mt-lg">
          {{ props.mode }} radicado {{ props.detailsAsignaciones.radicacion.idRadicado }}
        </p>

        <q-form ref="formValidate" class="tw-mt-2">
          <div class="[&>*]:tw-mb-4 column">
            <label>¿Desea {{ props.mode.toLocaleLowerCase()  }} {{ isReiniciar ? 'la gestión' :'el radicado' }} {{ props.detailsAsignaciones.radicacion.idRadicado }}?</label>
            <label>Observaciones *
              <q-input type="textarea" outlined label="Inserte" dense emit-value v-model="observaciones"
                :rules="isReiniciar ? [inputRequired,  v => maxLengthInput(1000, v), v => minLengthInput(10, v) ] : [inputRequired,  v => maxLengthInput(1000, v)]" />
            </label>
          </div>

          <div class="tw-flex tw-justify-center tw-items-center">
            <q-btn label="No" color="accent" text-color="black" class="tw-p-3" style="width: 200px; height: 35px;" flat
              @click="cancelar" />
            <q-btn label="Si" style="width: 200px; height: 35px" text-color="white" color="primary" class="tw-rounded-xl tw-p-3 "
              @click="confirm" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, ref } from 'vue';

import { sgdeaAxios } from "src/services";

import { inputRequired, maxLengthInput, minLengthInput } from "src/helpers/validations";
import { toast } from 'src/helpers/toast';
import { crearTrazabilidad } from 'src/helpers/trazabilidad';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps<{
  persistent?: boolean,
  // detailsRadicado: any,
  detailsAsignaciones: any,
  mode: string,
  user: string
}>();

const route = useRoute();
const router = useRouter();
const observaciones: Ref<string> = ref('')
const formValidate = ref()


const emit = defineEmits(['update:modelValue'])

const open = ref(true)

const isReiniciar = computed(() => props?.mode === 'Reiniciar')

const confirm = async() => {
  try {
    if (!(await formValidate.value.validate())) {
      toast.error(isReiniciar.value ? 'Para poder reiniciar la gestión es obligatorio ingresar la observación' : 'Por favor llene el campo Observaciones')
      return;
    }

    const { data: isExpediente } = await sgdeaAxios.post(`/correspondencia/${route.params.id}/expediente`)

    if (!isExpediente && !isReiniciar.value) {
      toast.error(isReiniciar.value ? 'Debe incluir el radicado a un expediente' : 'Por favor incluya a un expediente antes de cerrar')
      return;
    }

    if (!isReiniciar.value && props.detailsAsignaciones.radicacion.estadoProceso.estado === 'Por Aprobar') {
      toast.error('El radicado ya fue envíado para aprobación. No se puede reiniciar la gestión')
      return;
    }

    const response = await sgdeaAxios.put(`/correspondencia/asignacion/${isReiniciar.value ? 'reinicarGestion' : 'cancelarGestion'}/${props.detailsAsignaciones.id}`, {
      observaciones: observaciones.value
    })

    if (response.status == 200) {
      const radicacion = props.detailsAsignaciones.radicacion
      await crearTrazabilidad({
        proceso: `COR${radicacion.id}`,
        secuencia: radicacion.idRadicado,
        estado: radicacion.estadoProceso.estado,
        descripcion: `Usuario:${props.user} `+`Motivo:${observaciones.value}`+`Detalle:Se ha ${props.mode == 'Cerrar' ? 'cerrado' : props.mode} el radicado`,
        comentario: props.mode,
        nombre: props.user,
        tramite: radicacion.tipoTramite.nombre,
        accion: `Ha sido ${props.mode == 'Cerrar' ? 'cerrado' : props.mode} el trámite`
      })
      toast.success(isReiniciar.value ? 'Se realizó el reinicio de la gestión exitosamente' : 'Radicado cerrado exitosamente')
      open.value = false
      if (isReiniciar.value) {
  setTimeout(() => {
    window.location.reload()
  }, 1500)
}
      emit('update:modelValue')
      if (props.mode == 'Cerrar') {
        router.push('/correspondencia')
      }
    }
  } catch (error) {
    toast.error('Ha ocurrido un error inesperado')
  }
}

const cancelar = () => {
  open.value = false
  emit('update:modelValue')
}


onMounted(() => open.value = true)


</script>
