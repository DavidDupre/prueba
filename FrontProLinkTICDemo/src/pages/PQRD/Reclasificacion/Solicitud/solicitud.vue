
<template>
    <div class="[&>*]:tw-mb-4">
      <section>
        <q-form ref="reclasificarRef">
          <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
            <q-expansion-item default-opened>
              <template v-slot:header>
                <div class="col row">
                  <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
                    Información básica
                  </h3>
                </div>
              </template>
              <div class="tw-bg-white tw-p-4" style="border-radius: 5px">
                <div class="row tw-p-2">
                  <div class="col-sm tw-p-2">
                    <p class="tw-text-label tw-font-semibold">Número de radicado</p>
                    <q-label>{{ props.pqrdData?.solicitudReclasificacion?.pqrd?.idRadicado }}</q-label>
                  </div>
                  <div class="col-sm tw-px-2 tw-pt-2">
                  <p class="tw-text-label tw-font-semibold">Oficina*</p>
                  <q-select :disable="!!props.pqrdData?.solicitudReclasificacion?.estado" v-model="form.oficina" :options="filteredOficinas" label="Seleccione" dense
                    outlined class="tw-rounded-lg" use-input map-options @filter="selectOptionsFilterFn" fill-input
                    :rules="[inputRequired]" hide-selected input-debounce="0" @update:model-value="getCausasRaiz">

                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                </div>
                  <div class="col-sm tw-p-2">
                    <p class="tw-text-label tw-font-semibold">Tipo de trámite</p>
                    <q-label>PQRD</q-label>
                  </div>
                  <div class="col-sm tw-p-2">
                  <p class="tw-text-label tw-font-semibold">Reclasificar trámite*</p>
                  <q-select :disable="!!props.pqrdData?.solicitudReclasificacion?.estado" v-model="form.tramiteReclas" :options="tiposPQRD" :rules="[inputRequired]"
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
                </div>
                <div class="row tw-p-2">
                  <div class="col-sm tw-p-2">
                    <p class="tw-text-label tw-font-semibold">Tiempo por vencer</p>
                    <q-label>{{ props.pqrdData?.solicitudReclasificacion?.diasVencimiento }} Días</q-label>
                  </div>
                  <div class="col-sm tw-p-2">
                    <p class="tw-text-label tw-font-semibold">Fecha de vencimiento</p>
                    <q-label>{{  moment(props.pqrdData?.solicitudReclasificacion?.fechaVencimiento).format('DD/MM/YYYY') }}</q-label>
                  </div>
                  <div class="col-sm tw-p-2">
                    <p class="tw-text-label tw-font-semibold">Estado</p>
                    <q-label>{{ props.pqrdData?.solicitudReclasificacion?.reclasificarTramite?.nombreTramite }}</q-label>
                  </div>
                  <div class="col-sm tw-p-2">
                  </div>
                </div>
                <div class="row tw-p-2">
                  <div class="col-sm-12 tw-p-2">
                    <p class="tw-text-label tw-font-semibold">Observación</p>
                    <q-label>{{ props.pqrdData?.solicitudReclasificacion?.observaciones }}</q-label>
                  </div>
                  <div class="col-sm-12 tw-p-2" v-if="props.pqrdData?.solicitudReclasificacion?.estado == 'RECHAZADA'">
                    <p class="tw-text-label tw-font-semibold">Motivo de Rechazo</p>
                    <q-label>{{ props.pqrdData?.solicitudReclasificacion?.motivoRechazo }}</q-label>
                  </div>
                </div>
              </div>
            </q-expansion-item>
          </q-card>
          <div v-if="!props.pqrdData?.solicitudReclasificacion?.estado" class="justify-center tw-w-full tw-m-[10px] tw-mt-10 tw-mb-6 tw-flex tw-gap-4">
            <q-btn label="Rechazar" type="reset" style="width: 240px; height: 40px" text-color="black" color="accent"
              class="tw-rounded-xl" @click="showCommentModal" />
            <q-btn label="Aprobar" text-color="white" @click="() => (showModalSave = true)" style="width: 240px; height: 40px" color="primary"
              class="tw-rounded-xl tw-btn tw-p-2" />
          </div>
        </q-form>
      </section>
    </div>

   <Modal v-model="showModalSave" title="Confirmación " text="¿Está seguro de aprobar la solicitud de reclasificación?" :is-success="false" textButtonCancel="No"
      cancel-button text-button="Si" @handleAccept="gestionarSolicitud(undefined, false);" />

  <Modal v-model="showAprobado" title="La aprobación ha sido exitosa." text="La solicitud de reclasificación del radicado ha sido aprobada con éxito." is-success
      text-button="¡Ok!" @handleAccept="
                      showAprobado = false;
                    resetForm();" />


  <Modal v-model="showRechazo" title="Rechazo de solicitud." text="Se rechazó la reclasificación del radicado de manera correcta." is-success
      text-button="¡Ok!" @handleAccept="
                      showRechazo = false;
                    resetForm();" />


<template v-if="newComment">
    <q-dialog v-model="newComment" persistent transition-show="scale" transition-hide="scale" transition-duration="300">
        <q-card class="dialog tw-p-4">
          <q-form ref="motivoRechazoForm">
            <q-card-section class="tw-bg-white">
                <div class="tw-font-semibold tw-text-2xl tw-text-secondary" style="word-break: break-word;">
                    Rechazo reclasificación
                </div>
                <br />
                <div class="bold tw-text-lg tw-text-secondary" style="word-break: break-word;">
                    Escriba aquí su motivo de rechazo
                </div>
                <br />
                <span class="tw-w-full">
                    <q-input v-model="comment" input-debounce="0" color="secondary" outlined class="tw-rounded-lg"
                        type="textarea" dense :rules="[(v) => maxLengthInput(1000, v), inputRequired, (v) => minLengthInputCustom(10, v, 'campo')]"/>
                </span>
                <div class="tw-flex tw-justify-center tw-gap-2 tw-mt-4">

                    <q-btn color="accent" textColor="secondary" label="Cancelar"
                        style="width: 250px; height: 45px; border-radius: 8px; font-size: 18px;" no-caps
                        @click="closeCommentModal" />

                    <q-btn color="secondary" label="Rechazar"
                        style="width: 250px; height: 45px; border-radius: 8px; font-size: 18px;" no-caps
                        @click="rechazar" />

                </div>
            </q-card-section>
          </q-form>
        </q-card>
    </q-dialog>
</template>
  </template>

  <script lang="ts" setup>
  import { onMounted, ref } from "vue";
  import Modal from "../../../../components/Modal/Modal.vue";
  import { useRouter } from "vue-router";
import moment from 'moment';
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { useAuthStore } from "src/stores/auth.store";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { inputRequired, maxLengthInput, minLengthInputCustom } from "src/helpers/validations";

const newComment = ref(false)

const showCommentModal = () => newComment.value = true;
const closeCommentModal = () => newComment.value = false;
const auth = useAuthStore()

  const props = withDefaults(defineProps<{
    pqrdData: any
  }>(), {})

  const router = useRouter();

  const emit = defineEmits(['successSave']);
  const showModalSave = ref(false);
  const showAprobado = ref(false);
  const showRechazo = ref(false);
  const oficinas = ref([]);
  const tiposPQRD = ref([]);
  const form = ref({
    oficina: {label: '', value: ''},
    tramiteReclas: {label: '', value: ''}
  })
const filteredOficinas = ref([])
  let comment = ref('');
  const motivoRechazoForm = ref()
async function rechazar() {
  try {
    gestionarSolicitud(comment.value, true);
  } catch (error) {
    console.error(error);
  }
}

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

async function getTiposPQRD() {
  try {
    const { data } = await sgdeaAxios.get(`reclasificacion/listadoTiposTramite`);
    tiposPQRD.value = data.sort((a, b) => a.nombreTramite.localeCompare(b.nombreTramite)).map(({ nombreTramite, id }) => {
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
    const { data } = await sgdeaAxios.get('oficinas/all');
    oficinas.value = data.sort((a, b) => a.nombre.localeCompare(b.nombre)).map(({ nombre, id }) => {
      return {
        label: nombre,
        value: id
      };
    });
  } catch (error) {
    console.error(error);
  }
}

async function gestionarSolicitud(comment: string, rechazar: boolean) {
   let estadoReclasificacion = "APROBADA";
   if(rechazar) {
    if(await motivoRechazoForm.value.validate()){
      estadoReclasificacion = "RECHAZADA";
    } else {
      toast.error('Debe diligenciar los campos obligatorios para continuar con el proceso')
      return
    }

   }

    try {
      const response = await sgdeaAxios.put('/pqrd/reclasificar/aprobarRechar/' + props.pqrdData?.solicitudReclasificacion?.id, {
        "estadoReclasificacion": estadoReclasificacion,
        "motivoRechazo": comment,
        "oficinaId": form.value.oficina.value,
        "reclasificar_tramite_id": form.value.tramiteReclas.value
      });
      if (response.status === 200) {
        if(rechazar) {
          showRechazo.value = true;
          await crearTrazabilidad({
        proceso: "PQRD" + props.pqrdData.id,
        secuencia: props.pqrdData.idRadicado,
        estado: props.pqrdData.estado.estado,
        descripcion: "Se ha rechazado la solicitud de reclasificación de la PQRD",
        comentario: comment,
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} rechazo la reclasificación de la PQRD`,
        tramite: props.pqrdData.informacionSolicitud.tipologiaEntity.id == 7 ? 'PQRD Express' : 'PQRD',
      })
        } else {
          await sgdeaAxios.put(`/pqrd/editarEstadoPqrd/${props.pqrdData.id}/15`)
          await crearTrazabilidad({
        proceso: "PQRD" + props.pqrdData.id,
        secuencia: props.pqrdData.idRadicado,
        estado: props.pqrdData.estado.estado,
        descripcion: "Se ha aprobado la solicitud de reclasificación de la PQRD",
        comentario: 'Reclasificar',
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} aprobo la reclasificación de la PQRD`,
        tramite: props.pqrdData.informacionSolicitud.tipologiaEntity.id == 7 ? 'PQRD Express' : 'PQRD',
      })
          showAprobado.value = true;
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message ?? 'Ha ocurrido un error.');
      console.error(error);
    }
}

  onMounted(async () => {
    await getOficinas();
    await getTiposPQRD();
    await initData();
  });

  async function initData() {
    form.value.oficina = {label: props.pqrdData.solicitudReclasificacion?.oficina.nombre, value:  props.pqrdData.solicitudReclasificacion?.oficina.id}}
    form.value.tramiteReclas = {label:props.pqrdData.solicitudReclasificacion?.reclasificarTramite?.nombreTramite, value:  props.pqrdData.solicitudReclasificacion?.reclasificarTramite?.id }

  async function resetForm() {
    router.push('/pqrd/reclasificacion')
  }

  async function save() {
  }
  </script>
