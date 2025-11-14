<template>
  <div class="[&>*]:tw-mb-4">
    <section>
      <q-form greedy ref="reclasificarRef">
        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
                  Reclasificar Trámite
                </h3>

              </div>

            </template>
            <div class="tw-bg-white tw-p-4" style="border-radius: 5px">
              <p class="tw-font-semibold tw-px-2">* Esta solicitud de reclasificación inicialmente
                se enviará al Grupo de Atención Integral para
                su aprobación
              </p>

              <div class="row tw-p-2">

                <div class="col-sm tw-p-2">
                  <p class="tw-text-label tw-font-semibold">Reclasificar trámite*</p>
                  <q-select v-model="formData.tipoPQRD" :options="tiposPQRD" :rules="[inputRequired]" emit-value
                    label="Seleccione" dense outlined class="tw-rounded-lg" use-input map-options fill-input
                    hide-selected input-debounce="0">
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <div class="col-sm tw-px-2 tw-pt-2">
                  <p class="tw-text-label tw-font-semibold">Oficina</p>
                  <q-select v-model="formData.oficina" :options="filteredOficinas" emit-value label="Seleccione" dense
                    outlined class="tw-rounded-lg" use-input map-options @filter="selectOptionsFilterFn" fill-input
                    hide-selected input-debounce="0" :disable="formData.tipoPQRD == 12">
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                </div>
              </div>
              <div class="row tw-p-2">
                <div class="col-sm-12 tw-p-2">
                  <CommentTextArea v-model="formData.descripcion" :is-required="true" :max-length="5000"
                    :min-length="10" label="Observaciones" />
                </div>
                <div class="col-sm-12 tw-p-2" v-if="props.pqrdData.solicitudReclasificacion">
                  <p class="tw-text-label tw-font-semibold">Motivo de Rechazo</p>
                  <p>{{ props.pqrdData.solicitudReclasificacion?.motivoRechazo }}</p>
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-card>
        <div class="justify-center tw-w-full tw-m-[10px] tw-mt-10 tw-mb-6 tw-flex tw-gap-4">
          <q-btn label="Cancelar" type="reset" style="width: 240px; height: 40px" text-color="black" color="accent"
            class="tw-rounded-xl" @click="() => (showModal = true)" />
          <q-btn label="Guardar" text-color="white" @click="save" style="width: 240px; height: 40px" color="primary"
            class="tw-rounded-xl tw-btn tw-p-2" />
        </div>
      </q-form>

    </section>
  </div>

  <Modal v-model:model-value="showModal" title="¡Espera un momento!"
    text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
    :is-success="false" textButtonCancel="No" cancel-button @handleAccept="showModal = false; resetForm();"
    text-button="Si" @close-modal="() => (showModal = false)" />
  <Modal v-model="showModalSave" title="Reclasificación exitosa"
    text="El trámite fue enviado para solicitud de reclasificación con éxito." is-success text-button="¡Ok!"
    @handleAccept="
      router.push('/bandeja');" />
</template>

<script lang="ts" setup>
import {
  inputRequired,
  // maxLengthInput,
  // minLengthInput,
  // minLengthInputCustom
} from "src/helpers/validations";
import { Ref, onMounted, ref, watch } from "vue";
import { sgdeaAxios } from "src/services";
import { toast } from 'src/helpers/toast';
import Modal from "src/components/Modal/Modal.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth.store";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";

const props = withDefaults(defineProps<{
  pqrdData: any
}>(), {})

const tiposPQRD = ref([]);
const oficinas = ref([]);
const filteredOficinas = ref([])
const router = useRouter()
const formData: Ref<any> = ref({
  id: undefined,
  tipoPQRD: '',
  oficina: '',
  descripcion: ''
});

const selectOptionsFilterFn = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredOficinas.value = oficinas.value
    })
    return
  }
  update(() => {
    filteredOficinas.value = oficinas.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const emit = defineEmits(['successSave'])

const showModal = ref(false);
const reclasificarRef = ref()
const showModalSave = ref(false);

const auth = useAuthStore();

onMounted(async () => {
  if (props.pqrdData.solicitudReclasificacion?.estado) {
    formData.value = {
      id: props.pqrdData.solicitudReclasificacion?.id,
      tipoPQRD: props.pqrdData.solicitudReclasificacion?.reclasificarTramite?.id,
      oficina: props.pqrdData.solicitudReclasificacion?.oficina?.id,
      descripcion: props.pqrdData.solicitudReclasificacion?.observaciones
    }
  }
  await initData();
});

async function initData() {
  try {
    await getTiposPQRD();
    await getOficinas();
    formData.value.tipoPQRD = tiposPQRD.value.find(x => x.label.toLowerCase() == props.pqrdData.informacionSolicitud.tipologia.toLowerCase()).value;
  } catch (error) {
    await getTiposPQRD();
    await getOficinas();

    console.error(error);
  }
}

// const isDisabled = computed(() => {
//   return props.pqrdData.informacionSolicitud.tipologia === "Queja" || props.pqrdData.informacionSolicitud.tipologia === "Reclamo";
// });



async function getTiposPQRD() {
  const tiposExcluir = ['contratos', 'mortales', 'retiro de empresa'];
  try {
    const { data } = await sgdeaAxios.get(`reclasificacion/listadoTiposTramite`);

    const idsParaOcultar = [6, 8, 9, 13];

    tiposPQRD.value = data
      .filter(tramite => !idsParaOcultar.includes(tramite.id))
      .filter(tramite => !tiposExcluir.includes(tramite.nombreTramite.toLowerCase()))
      .sort((a, b) => a.nombreTramite.localeCompare(b.nombreTramite))
      .map(({ nombreTramite, id }) => {
        return {
          label: nombreTramite,
          value: id
        };
      });

  } catch (error) {
    console.error(error);
  }
}


async function getOficinas() {
  try {
    const { data } = await sgdeaAxios.get('/pqrd/listadoOficinas?tipo=0');
    const idsAExcluir = [4];

    oficinas.value = data
      .filter(oficina => !idsAExcluir.includes(oficina.id)) // Filtra las oficinas con los IDs que deseas ocultar
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
      .map(({ nombre, id }) => {
        return {
          label: nombre,
          value: id
        };
      });
  } catch (error) {
    console.error(error);
  }
}


async function resetForm() {
  await initData();
  router.go(0)
}

async function save() {
  if (!(await reclasificarRef.value.validate())) {
    toast.error('Debe diligenciar los campos obligatorios para continuar con el proceso');
    return;
  }

  let dataPqrd;
  const newPqrd2 = new FormData();
  dataPqrd = {
    solicitud: {
        moduloOrigenId: 8,
        moduloDestinoId: formData.value.tipoPQRD,
        idCasoOrigen: props.pqrdData.id,
        usuarioSolicitanteId: auth.$state.userInfo.userid,
        observaciones: formData.value.descripcion,
        oficinaId: formData.value.oficina.value ? formData.value.oficina.value : formData.value.oficina || null,
    },
  }

  newPqrd2.append("solicitud", JSON.stringify(dataPqrd));

  if (props.pqrdData.solicitudReclasificacion?.estado) {

    try {
      const response = await sgdeaAxios.post(`solicitud-reclasificacion`,
        newPqrd2
      );

      if (response.status === 200) {
        await sgdeaAxios.put(`pqrd/editarEstadoPqrd/${props.pqrdData.id}/12`)
        await crearTrazabilidad({
          proceso: "PQRD" + props.pqrdData.id,
          secuencia: props.pqrdData.idRadicado,
          estado: props.pqrdData.estado.estado,
          descripcion: "Se ha hecho una solicitud de reclasificación de la PQRD",
          comentario: 'Reclasificar',
          nombre: auth.$state.userInfo.name,
          accion: `${auth.$state.userInfo.name} solicitó una reclasificación de la PQRD`,
          tramite: props.pqrdData.informacionSolicitud.tipologiaEntity.id == 7 ? 'PQRD Express' : 'PQRD',
        })
        showModalSave.value = true;
        emit('successSave')
      }
    } catch (error) {
      toast.error(error.response?.data?.message ?? 'Ha ocurrido un error.');
      console.error(error);
    }

  } else {
    try {
      const response = await sgdeaAxios.post('/solicitud-reclasificacion',
        newPqrd2
      );
      if (response.status === 200) {
        // let nuevoTramite = tiposPQRD.value.filter(x => x.value == formData.value.tipoPQRD)[0].label;
        // let oficina = filteredOficinas.value.filter(x => x.value == formData.value.oficina)[0].label;
        let trazaInfo = {
          proceso: "PQRD" + props.pqrdData.id,
          secuencia: props.pqrdData.idRadicado,
          estado: props.pqrdData.estado.estado,
          descripcion: `Trámite anterior: PQRD Motivo: ${formData.value.descripcion}`,
          comentario: 'Reclasificar',
          nombre: auth.$state.userInfo.name,
          accion: `${auth.$state.userInfo.name} solicitó una reclasificación de la PQRD`,
          tramite: props.pqrdData.informacionSolicitud.tipologiaEntity.id == 7 ? 'PQRD Express' : 'PQRD',
        }
        await crearTrazabilidad(trazaInfo)
        showModalSave.value = true;
        emit('successSave')
      }
    } catch (error) {
      toast.error(error.response?.data?.message ?? 'Ha ocurrido un error.');
      console.error(error);
    }
  }
}

watch(() => formData.value.tipoPQRD, (val) => {
  if (val == 12) {
    formData.value.oficina = { label: "Mesa Black Medicina Laboral", value: 13 }
  }
})
</script>
