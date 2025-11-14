<template>
  <div class="tw-mt-4">
    <q-card flat class="tw-p-4 tw-rounded-xl">
      <router-link
        to="/archivo/solicitar-prestamo"
        class="text-primary q-mb-md block"
      >
        <q-icon size="1.5em" name="chevron_left" color="primary" />
        <b> Volver</b>
      </router-link>
      <q-form ref="formRef" greedy @submit="submitForm">
        <div class="tw-flex-1 tw-mb-4">
          <h1 class="tw-flex-1 tw-text-3xl tw-font-bold tw-my-4">
          {{ isDetalle ? 'Consultar Solicitud de Préstamo' : 'Crear Préstamo' }}
        </h1>
        </div>
        <div class="tw-grid tw-grid-cols-4 tw-gap-x-4">
          <div class="tw-col-span-2">
            <Label label="Fecha de Solicitud" :is-requiered="true" />
            <q-input
              outlined
              dense
              v-model="fechaSolicitud"
              type="date"
              class="tw-flex-1"
              disable
            />
          </div>
          <div class="tw-col-span-2">
            <Label label="Dependencia solicitante" :is-requiered="true" />
            <q-select
              v-model="dependencia"
              outlined
              dense
              class="tw-w-full"
              :disable="isDetalle || !validacionDependencia"
              :rules="[rulesValidation]"
              :options="optionsDependencias"
              emit-value
              map-options
            />
          </div>
          <!-- <div class="tw-col-span-2">
            <Label label="Serie / Subserie" :is-requiered="true" />
            <q-select
              v-model="serieSubserie"
              outlined
              dense
              class="tw-w-full"
              :disable="isDetalle || !validacionDependencia"
              :rules="[rulesValidation]"
              :options="optionsSerieSubserie"
              :option-label="(option) => option.description"
              :option-value="(option) => option.series_subseries_id"
              map-options
              emit-value
            />
          </div> -->
          <div class="tw-col-span-2">
              <Label label="Cara" />
              <q-input
                outlined
                dense
                v-model="cara"
                class="tw-flex-1"
                :rules="[(v) => maxLengthInput(100, v)]"
                :disable="isDetalle"
              />
            </div>
          <div class="tw-col-span-2">
            <Label label="Soporte" :is-requiered="true" />
            <q-select
              v-model="soporte"
              outlined
              dense
              class="tw-w-full"
              :disable="isDetalle || !validacionDependencia"
              :rules="[rulesValidation]"
              :options="optionsSoporte"
              emit-value
              map-options
            />
          </div>
          <div class="tw-col-span-4">
            <div class="tw-grid tw-grid-cols-4 tw-gap-x-4">
              <div class="tw-col-span-2">
                <div>
                  <Label label="Depósito" />
                  <q-input
                    outlined
                    dense
                    v-model="deposito"
                    :rules="[(v) => maxLengthInput(100, v)]"
                    :disable="isDetalle"
                  />
                </div>

                <div>
                  <Label label="Cuerpo" />
                  <q-input
                    outlined
                    dense
                    v-model="cuerpo"
                    class="tw-flex-1"
                    :rules="[(v) => maxLengthInput(100, v)]"
                    :disable="isDetalle"
                  />
                </div>
                <div>
                  <Label label="Estante" />
                  <q-input
                    outlined
                    dense
                    v-model="estante"
                    class="tw-flex-1"
                    :rules="[(v) => maxLengthInput(100, v)]"
                    :disable="isDetalle"
                  />
                </div>
              </div>
              <div class="tw-col-span-2">
                <div class="tw-col-span-2">
                  <Label label="No. de Folios" />
                  <q-input
                    outlined
                    dense
                    v-model="noFolios"
                    :rules="[rulesValidation, (v) => maxLengthInput(4, v)]"
                    :disable="isDetalle"
                  />
                </div>
                <div>
                  <Label label="Bandeja" />
                  <q-input
                    outlined
                    dense
                    v-model="bandeja"
                    class="tw-flex-1"
                    :rules="[(v) => maxLengthInput(100, v)]"
                    :disable="isDetalle"
                  />
                </div>
                <div>
                  <Label label="Codigo Unidad de Almacenamiento" />
                  <q-input
                    outlined
                    dense
                    v-model="codigoUnidadAlmacenamiento"
                    class="tw-flex-1"
                    :rules="[(v) => maxLengthInput(100, v)]"
                    :disable="isDetalle"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="tw-col-span-2">
            <Label label="No. SAP o Radicado" />
            <q-input
              outlined
              dense
              v-model="noSap"
              :rules="[ (v) => maxLengthInput(12, v)]"
              :disable="isDetalle"
            />
          </div>

          <div class="tw-col-span-2">
            <Label label="Nombre Solicitante" />
            <q-input
              outlined
              dense
              v-model="nombreSolicitante"
              :rules="[rulesValidation, (v) => maxLengthInput(100, v)]"
              :disable="true"
            />
          </div>
          <div class="tw-col-span-2">
            <Label label="Fecha Inicial" />
            <q-input
              outlined
              dense
              v-model="fechaInicial"
              type="date"
              disable
            />
          </div>
          <div class="tw-col-span-2">
            <Label label="Fecha Final" />
            <q-input outlined dense v-model="fechaFinal" type="date" disable />
          </div>
          <div class="tw-col-span-2">
            <Label label="Ubicación Topográfica" />
            <q-input
              outlined
              dense
              v-model="ubicacionTopografica"
              :rules="[rulesValidation]"
              :disable="isDetalle"
            />
          </div>
          <div class="tw-col-span-4 tw-mt-4">
            <CommentTextArea
              v-model="motivoSolicitud"
              :is-required="true"
              :max-length="500"
              label="Motivo de solicitud"
              :rules="[rulesValidation]"
              :disabled="isDetalle"
            />
          </div>

          <div
            v-if="!prorrogaFecha && isDetalle && estado == 'APROBADO'"
            class="tw-col-span-4 tw-mt-4"
          >
            <Label label="Fecha de prórroga" />
            <q-input
              outlined
              dense
              v-model="fechaProrroga"
              type="date"
              :error="errors.fechaProrroga"
              :error-message="
                errors.fechaProrroga ? 'Este campo es requerido' : ''
              "
              :disabled="fechaProrroga"
            />
          </div>

          <div v-if="prorrogaFecha && isDetalle" class="tw-col-span-4 tw-mt-4">
            <Label label="Fecha de prórroga" />
            <q-input
              outlined
              dense
              v-model="prorrogaFecha"
              type="date"
              disable
            />
          </div>

          <div v-if="isDetalle" class="tw-col-span-4 tw-mt-4">
            <CommentTextArea
              v-model="justificacionProrroga"
              :max-length="500"
              label="Justificación"
              :error="errors.justificacionProrroga"
              :error-message="
                errors.justificacionProrroga ? 'Este campo es requerido' : ''
              "
              outlined
              dense
              :is-required="true"
              :disabled="prorrogaFecha && isDetalle"
            />
          </div>

          <div class="tw-col-span-2" v-if="isDetalle">
            <Label label="Serie" />
            <q-input outlined dense v-model="serie" disable />
          </div>
          <div class="tw-col-span-2" v-if="isDetalle">
            <Label label="Subserie" />
            <q-input outlined dense v-model="subserie" disable />
          </div>
          <div class="tw-col-span-2" v-if="isDetalle">
            <Label label="Tipo documental" />
            <q-input outlined dense v-model="tipoDocumental" disable />
          </div>
        </div>
        <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
          <Button
            v-if="!isDetalle"
            label="Cancelar"
            type="tertiary"
            color="blue"
            type-button="button"
            @click="resetForm"
          />
          <Button
            v-if="!isDetalle"
            label="Solicitar préstamo"
            type="primary"
            color="secondary"
            type-button="submit"
          />
          <!-- <Button v-if="isDetalle && status !== 'APROBADO'" label="Aprobar Préstamo" type="primary" color="blue"
            type-button="button" @click="showDialog = true; -->
            <Button v-if="isDetalle && status !== 'APROBADO'" label="Aprobar Préstamo" type="primary" color="blue"
            type-button="button" @click="mostrarDialogoAprobar" />
          <Button
            v-if="isDetalle && status !== 'APROBADO'"
            label="Rechazar Préstamo"
            type="primary"
            color="secondary"
            type-button="button"
            @click="
              showDialog = true;
              aprobar = false;
            "
          />

          <Button
            v-if="isDetalle && status === 'APROBADO' && prorrogaFecha === null"
            label="Cancelar"
            type="tertiary"
            color="blue"
            type-button="button"
            @click="resetFormProrroga"
          />

          <Button
            label="Guardar"
            type="primary"
            color="secondary"
            type-button="button"
            v-if="isDetalle && status === 'APROBADO' && prorrogaFecha === null"
            @click="guardarProrroga"
          />

          <!--<Button label="Devolver prórroga" type="primary" color="blue" type-button="button"
            v-if="isDetalle && status === 'APROBADO'" @click="showModalDevolucion = true" />-->

          <Button
            label="Devolver prórroga"
            type="primary"
            color="blue"
            type-button="button"
            v-if="isDetalle && status === 'APROBADO' && prorrogaFecha"
            @click="activarRechazarProrroga"
          />

          <Button
            label="Aprobar prórroga"
            type="primary"
            color="secondary"
            type-button="button"
            v-if="isDetalle && status === 'APROBADO' && prorrogaFecha"
            @click="prorrogarPrestamo"
          />
        </div>
      </q-form>
    </q-card>
  </div>

  <q-dialog
    v-model="showModalProrroga"
    persistent
    transition-show="scale"
    transition-hide="scale"
    transition-duration="300"
  >
    <q-card class="tw-p-4 tw-px-3" style="width: 1200px; max-width: 80vw">
      <q-form
        @submit.prevent="showModalProrrogaComfirmal = true"
        @validation-error=""
        greedy
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 tw-text-black">Aprobar prórroga</div>
          <q-space />
          <q-btn
            class="tw-text-black"
            icon="close"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>
        <q-card-section class="tw-grid tw-grid-cols-2 tw-gap-x-4">
          <div class="tw-col-span-2">
            <CommentTextArea
              v-model="observacion"
              :is-required="true"
              :max-length="500"
              label="Observaciones/Justificación"
            />
          </div>
        </q-card-section>
        <q-card-actions class="tw-gap-6" align="right">
          <Button
            label="Cancelar"
            color="blue"
            type="secondary"
            type-button="button"
            @click.prevent="
              showModalProrroga = false;
              observacion = '';
            "
          />
          <Button label="Aceptar" color="blue" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!--devolver Prorroga-->

  <q-dialog
    v-model="showModalRechazarProrroga"
    persistent
    transition-show="scale"
    transition-hide="scale"
    transition-duration="300"
  >
    <q-card class="tw-p-4 tw-px-3" style="width: 1200px; max-width: 80vw">
      <q-form
        @submit.prevent="showModalRechazarProrrogaComfirmal = true"
        @validation-error=""
        greedy
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 tw-text-black">Rechazar prórroga</div>
          <q-space />
          <q-btn
            class="tw-text-black"
            icon="close"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>
        <q-card-section class="tw-grid tw-grid-cols-2 tw-gap-x-4">
          <div class="tw-col-span-2">
            <CommentTextArea
              v-model="observacion"
              :is-required="true"
              :max-length="500"
              label="Observaciones/Justificación"
            />
          </div>
        </q-card-section>
        <q-card-actions class="tw-gap-6" align="right">
          <Button
            label="Cancelar"
            color="blue"
            type="secondary"
            type-button="button"
            @click.prevent="
              showModalRechazarProrroga = false;
              observacion = '';
            "
          />
          <Button label="Aceptar" color="blue" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showDialog"
    persistent
    transition-show="scale"
    transition-hide="scale"
    transition-duration="300"
  >
    <q-card class="tw-p-4 tw-px-3" style="width: 1200px; max-width: 80vw">
      <q-form
        @submit.prevent="
          aprobar ? (showModalAprobar = true) : (showModalRechazar = true)
        "
        @validation-error=""
        greedy
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 tw-text-black">
            {{ aprobar ? "Aprobar Préstamo" : "Rechazar Préstamo" }}
          </div>
          <q-space />
          <q-btn
            class="tw-text-black"
            icon="close"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>
        <q-card-section class="tw-grid tw-grid-cols-2 tw-gap-x-4">
          <div class="tw-col-span-2">
            <CommentTextArea
              v-model="observacion"
              :is-required="true"
              :max-length="500"
              label="Observaciones/Justificación"
            />
          </div>
        </q-card-section>
        <q-card-actions class="tw-gap-6" align="right">
          <Button
            label="Cancelar"
            color="blue"
            type="secondary"
            type-button="button"
            @click.prevent="
              showDialog = false;
              observacion = '';
            "
          />
          <Button label="Aceptar" color="blue" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <ConfirmModal
    :show-modal="showModalAprobar"
    text-show-modal="¿Está seguro de la acción a realizar?"
    text-cancel-modal="No"
    text-confirm-modal="Si"
    @confirm-modal="aprobarPrestamo"
    @cancel-modal="cancelarModal"
    @update:show-modal="showModalAprobar = false"
  />
  <ConfirmModal
    :show-modal="showModalRechazar"
    text-show-modal="¿Está seguro de la acción a realizar?"
    text-cancel-modal="No"
    text-confirm-modal="Si"
    @confirm-modal="rechazarPrestamo"
    @cancel-modal="cancelarModal"
    @update:show-modal="showModalRechazar = false"
  />

  <ConfirmModal
    :show-modal="showModalDevolucion"
    text-show-modal="¿Está seguro de la acción a realizar?"
    text-cancel-modal="No"
    text-confirm-modal="Si"
    @confirm-modal="devolverPrestamo"
    @cancel-modal="cancelarModal"
    @update:show-modal="showModalDevolucion = false"
  />

  <ConfirmModal
    :show-modal="showModalProrrogaComfirmal"
    text-show-modal="¿Está seguro de la acción a realizar?"
    text-cancel-modal="No"
    text-confirm-modal="Si"
    @confirm-modal="confirmarProrroga"
    @cancel-modal="cancelarModal"
    @update:show-modal="showModalProrrogaComfirmal = false"
  />

  <ConfirmModal
    :show-modal="showModalRechazarProrrogaComfirmal"
    text-show-modal="¿Está seguro de la acción a realizar?"
    text-cancel-modal="No"
    text-confirm-modal="Si"
    @confirm-modal="devolverPrestamo"
    @cancel-modal="cancelarModal"
    @update:show-modal="showModalRechazarProrrogaComfirmal = false"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, reactive } from "vue";
import Button from "src/shared/components/PrimeComponents/Button/Button.vue";
import { maxLengthInput } from "src/helpers/validations";
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";
import { toast } from "src/helpers/toast";
import { useRoute, useRouter } from "vue-router";
import Label from "src/shared/components/PrimeComponents/Label/Label.vue";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import ConfirmModal from "src/components/Modal/ConfirmModal.vue";

// const fechaSolicitud = ref(formatDate(today));
const fechaInicial = ref("");
const fechaFinal = ref("");
const dependencia = ref("");
const serieSubserie = ref("");
const soporte = ref("");
const codigoUnidadAlmacenamiento = ref("");
// const optionsSerieSubserie = ref([]);
const unidad = ref("");
const optionsSoporte = ref([
  { value: "FISICO", label: "Físico" },
  { value: "DIGITAL", label: "Digital" },
  { value: "HIBRIDO", label: "Hibrido" },
]);
const serieOptions = ref([]);
const ubicacionTopografica = ref("");
const noSap = ref("");
const noFolios = ref("");

const motivoSolicitud = ref("");
const router = useRouter();
const route = useRoute();
const isDetalle = ref(false);
const auth = useAuthStore();
const nombreSolicitante = ref(auth.$state.userInfo.name);
const deposito = ref("");
const cuerpo = ref("");
const estante = ref("");
const cara = ref("");
const bandeja = ref("");
const showModalAprobar = ref(false);
const showModalRechazar = ref(false);
const showModalDevolucion = ref(false);
const showModalProrrogaComfirmal = ref(false);
const showModalRechazarProrrogaComfirmal = ref(false);
const showDialog = ref(false);
const aprobar = ref(false);
const rechazar = ref(false);
const observacion = ref("");
const status = ref("");
const showModalProrroga = ref(false);
const showModalRechazarProrroga = ref(false);
const serie = ref("");
const subserie = ref("");
const tipoDocumental = ref("");
let prorrogaFecha = null;
const isActiveGuardar = ref(false);
const errors = reactive({
  fechaProrroga: false,
  justificacionProrroga: false,
});

/* campos para prorroga */
const fechaProrroga = ref("");
const justificacionProrroga = ref("");
/* campos para prorroga */
const estado = ref("");

const rulesValidation = (val: string) => !!val || "Este campo es requerido";

const formatDate = (date: Date) => date.toISOString().slice(0, 10);
const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0: Domingo, 6: Sábado
};

const fechaSolicitud = ref("");

const getNextBusinessDay = (date) => {
  const newDate = new Date(date);
  while (isWeekend(newDate)) {
    newDate.setDate(newDate.getDate() + 1);
  }
  return newDate;
};

const addBusinessDays = (startDate, businessDays) => {
  const result = new Date(startDate);
  let addedDays = 0;
  while (addedDays < businessDays) {
    result.setDate(result.getDate() + 1);
    if (!isWeekend(result)) {
      addedDays++;
    }
  }
  return result;
};

onMounted(() => {
  const today = new Date();
  const initialBusinessDate = getNextBusinessDay(today);
  fechaInicial.value = formatDate(initialBusinessDate);

  const finalBusinessDate = addBusinessDays(initialBusinessDate, 15);
  fechaFinal.value = formatDate(finalBusinessDate);

  isDetalle.value = route.path.includes("detalle");
  getDependencia();

  if (isDetalle.value) {
    cargarData();
  }

  fechaSolicitud.value = formatDate(today);
});

const prorrogarPrestamo = () => {
  if (!route.params.id) {
    toast.error("No se encontró el ID de la solicitud");
    return;
  }
  observacion.value = "";
  showModalProrroga.value = true;
};

const activarRechazarProrroga = () => {
  if (!route.params.id) {
    toast.error("No se encontró el ID de la solicitud");
    return;
  }
  observacion.value = "";
  showModalRechazarProrroga.value = true;
};

const confirmarProrroga = async () => {
  try {
    const payload = {
      idSolicitud: Number(route.params.id),
      observacion: observacion.value,
    };

    // await sgdeaAcueducto.post("/archivo/prestamo/prorroga", payload);

    toast.success("Préstamo prorrogado correctamente");
    showModalProrrogaComfirmal.value = false;
    router.push("/expediente/solicitar-prestamo");
  } catch (error) {
    if (error.response?.status === 409) {
      toast.error(
        "No se puede prorrogar este préstamo. Ya tiene una prórroga activa o ha alcanzado el límite permitido."
      );
    } else {
      toast.error(
        "Error al procesar la solicitud de prórroga. Por favor intente nuevamente."
      );
    }
    showModalProrrogaComfirmal.value = false;
    showModalProrroga.value = false;
  }
};

const devolverPrestamo = async () => {
  try {
    if (!route.params.id) {
      toast.error("No se encontró el ID de la solicitud");
      return;
    }
    //  await sgdeaAcueducto.post(`/archivo/prestamo/devolver?idSolicitud=${route.params.id}&observacionRechazo=${observacion.value}`);
    // await sgdeaAcueducto.post("/archivo/prestamo/devolver", null, {
    //   params: {
    //     idSolicitud: route.params.id,
    //     observacionRechazo: observacion.value,
    //   },
    // });
    toast.success("Préstamo marcado como devuelto correctamente");
    router.push("/expediente/solicitar-prestamo");
  } catch (error) {
    toast.error("Error al marcar el préstamo como devuelto");
  }
};

const cargarData = async () => {
  try {
    // const response = await sgdeaAcueducto.get(
    //   `/archivo/prestamo/obtener/${route.params.id}`
    // );
    // dependencia.value = response.data.nombreDependencia;
    // soporte.value = response.data.soporte;
    // serieSubserie.value = response.data.serieSubserie;
    // codigoUnidadAlmacenamiento.value = response.data.codigoUnidadAlmacenamiento;
    // ubicacionTopografica.value = response.data.ubicacionTopografica;
    // const ubicacionParts = response.data.ubicacionTopografica.split("-");
    // deposito.value = ubicacionParts[0] || "";
    // cuerpo.value = ubicacionParts[1] || "";
    // estante.value = ubicacionParts[2] || "";
    // cara.value = ubicacionParts[3] || "";
    // bandeja.value = ubicacionParts[4] || "";
    // noSap.value = response.data.numeroRadicado;
    // noFolios.value = response.data.numeroFolios;
    // nombreSolicitante.value = response.data.nombreSolicitante;
    // motivoSolicitud.value = response.data.motivoSolicitud;
    // fechaInicial.value = formatDate(new Date(response.data.fechaInicial));
    // fechaFinal.value = formatDate(new Date(response.data.fechaFinal));
    // status.value = response.data.estado;
    // serie.value = response.data.nombreSerieExpediente || "";
    // tipoDocumental.value = response.data.nombreTipoDocumentalExpediente || "";
    // subserie.value =
    //   response.data.serieExpediente && response.data.serieExpediente.subseries
    //     ? response.data.serieExpediente.subseries
    //         .map((subserie) => subserie.description)
    //         .join(", ")
    //     : "";
    // estado.value = response.data.estado;
    // fechaProrroga.value = response.data.fechaProrroga || "";
    // justificacionProrroga.value = response.data.motivoProrroga || "";
    // prorrogaFecha = response.data.fechaProrroga || null;
  } catch (error) {
    toast.error("Error al cargar los datos");
    router.push("/expediente/solicitar-prestamo");
  }
};

const optionsDependencias = ref([]);
const validacionDependencia = ref(false);

const getDependencia = async () => {
  try {
    const response = await sgdeaAxios.get("/seccionSubSeccion");
    optionsDependencias.value = response.data
      .map((dependencia: any) => ({
        value: dependencia.idSeccionSubSeccion,
        label: dependencia.nombre,
      }));
    validacionDependencia.value = response.data.length > 1;
    if (!validacionDependencia.value) {
      dependencia.value = response.data[0].id;
    }
  } catch (error) {
    toast.error("Error al obtener la dependencia");
  }
};

// const seriesSubserie = async (officeId) => {
//   try {
//     const response = await sgdeaAcueducto.get(
//       `/archivo/trd/subseries/${officeId}`
//     );
//     optionsSerieSubserie.value = response.data.map((item) => ({
//       series_subseries_id: item.series_subseries_id,
//       description: item.description,
//     }));
//   } catch (error) {
//     optionsSerieSubserie.value = [];
//     toast.error("Error al obtener las series y subseries");
//   }
// };

// watch(dependencia, (newDependencia) => {
//   if (newDependencia && !isDetalle.value) {
//     seriesSubserie(newDependencia);
//   } else {
//     optionsSerieSubserie.value = [];
//   }
// });

const submitForm = async () => {
  if (
    fechaInicial.value &&
    fechaFinal.value &&
    fechaInicial.value > fechaFinal.value
  ) {
    toast.error("La fecha inicial no puede ser mayor que la fecha final");
    return;
  }

  try {
    const data = Object.fromEntries(
      Object.entries({
        dependenciaId: dependencia.value,
        ubicacionTopografica: `${deposito.value}-${cuerpo.value}-${estante.value}-${cara.value}-${bandeja.value}`,
        numeroRadicado: noSap.value,
        numeroFolios: noFolios.value ? parseInt(noFolios.value) : null,
        nombreSolicitante: nombreSolicitante.value,
        motivoSolicitud: motivoSolicitud.value,
        soporte: soporte.value,
        serieId: serieSubserie.value,
        codigoUnidadAlmacenamiento: codigoUnidadAlmacenamiento.value,
        usuarioCreador: auth.$state.userInfo.name,
      }).filter(([_, v]) => v != null && v !== "")
    );

    // await sgdeaAcueducto.post("/archivo/prestamo/crear", data);
    toast.success("Solicitud de préstamo creada correctamente");
    router.push("/archivo/solicitar-prestamo");
  } catch (error) {
    toast.error(`Error al enviar al crear prestamo`);
  }
};

// const aprobarPrestamo = async () => {
//   try {
//     const data = {
//       aprobado: true,
//       usuarioAprobador: auth.$state.userInfo.name,
//       observacion: observacion.value,
//     };

//     await sgdeaAcueducto.put(
//       `/archivo/prestamo/${route.params.id}/aprobar`,
//       data
//     );
//     toast.success("Solicitud de préstamo aprobada correctamente");
//     router.push("/expediente/solicitar-prestamo");
//   } catch (error) {
//     toast.error("Error al aprobar el préstamo");
//   }
// };

const aprobarPrestamo = async () => {
  try {
    // const solicitudInfo = await sgdeaAcueducto.get(
    //   `/archivo/prestamo/obtener/${route.params.id}`
    // );

    // if (!solicitudInfo.data.expedientesAsociados || solicitudInfo.data.expedientesAsociados.length === 0) {
    //   toast.error("Es necesario asociar un expediente a la solicitud para aprobar el préstamo documental.");
    //   showModalAprobar.value = false;
    //   observacion.value = "";
    //   return;
    // }
    const data = {
      aprobado: true,
      usuarioAprobador: auth.$state.userInfo.name,
      observacion: observacion.value,
    };

    // await sgdeaAcueducto.put(
    //   `/archivo/prestamo/${route.params.id}/aprobar`,
    //   data
    // );
    toast.success("Solicitud de préstamo aprobada correctamente");
    router.push("/expediente/solicitar-prestamo");
  } catch (error) {
    toast.error("Error al aprobar el préstamo");
  }
};


const mostrarDialogoAprobar = async () => {
  try {
    // const solicitudInfo = await sgdeaAcueducto.get(
    //   `/archivo/prestamo/obtener/${route.params.id}`
    // );


    // if (!solicitudInfo.data.idExpediente) {
    //   toast.error("Es necesario asociar un expediente a la solicitud para aprobar el préstamo documental.");
    //   return;
    // }

    showDialog.value = true;
    aprobar.value = true;
  } catch (error) {
    toast.error("Error al verificar información del préstamo");
  }
};



const cancelarModal = () => {
  toast.success("Cancelacion exitosa");
  showModalAprobar.value = false;
  showModalRechazar.value = false;
  observacion.value = "";
  window.location.href = "/expediente/solicitar-prestamo";
};

const rechazarPrestamo = async () => {
  try {
    const data = {
      aprobado: false,
      usuarioAprobador: auth.$state.userInfo.name,
      observacion: observacion.value,
    };

    // await sgdeaAcueducto.put(
    //   `/archivo/prestamo/${route.params.id}/aprobar`,
    //   data
    // );
    toast.success("Solicitud de préstamo rechazada correctamente");
    router.push("/expediente/solicitar-prestamo");
  } catch (error) {
    toast.error("Error al rechazar el préstamo");
  }
};

const resetForm = () => {
  const today = new Date();

  fechaSolicitud.value = formatDate(today);
  fechaInicial.value = formatDate(today);

  const futureDate = new Date(today);
  futureDate.setDate(futureDate.getDate() + 24);
  fechaFinal.value = formatDate(futureDate);

  dependencia.value = "";
  ubicacionTopografica.value = "";
  noSap.value = "";
  noFolios.value = "";
  nombreSolicitante.value = "";
  motivoSolicitud.value = "";
};

const resetFormProrroga = () => {
  fechaProrroga.value = "";
  justificacionProrroga.value = "";
};

const guardarProrroga = async () => {
  // Restablecer errores

  isActiveGuardar.value = true;
  errors.fechaProrroga = !fechaProrroga.value;
  errors.justificacionProrroga = !justificacionProrroga.value.trim();

  if (!errors.fechaProrroga && !errors.justificacionProrroga) {
    try {
      const data = Object.fromEntries(
        Object.entries({
          /*dependenciaId: dependencia.value,
        ubicacionTopografica: `${deposito.value}-${cuerpo.value}-${estante.value}-${cara.value}-${bandeja.value}`,
        numeroRadicado: noSap.value,
        numeroFolios: noFolios.value ? parseInt(noFolios.value) : null,
        nombreSolicitante: nombreSolicitante.value,
        motivoSolicitud: motivoSolicitud.value,
        soporte: soporte.value,
        serieId: serieSubserie.value,
        codigoUnidadAlmacenamiento: codigoUnidadAlmacenamiento.value,
        usuarioCreador: auth.$state.userInfo.name,*/
          motivoProrroga: justificacionProrroga.value,
          fechaProrroga: fechaProrroga.value,
        }).filter(([_, v]) => v != null && v !== "")
      );

      // await sgdeaAcueducto.put(
      //   `/archivo/prestamo/actualizar-prestamo/${route.params.id}`,
      //   data
      // );
      toast.success("Registro exitoso");
      router.push("/expediente/solicitar-prestamo");
    } catch (error) {
      toast.error(`Error al enviar al crear la prorroga`);
    }
  } else {
    toast.error("Debe llenar todos los campos");
  }
};
</script>

<style scoped>
::v-deep(.q-input) {
  text-align: left !important;
}
</style>
