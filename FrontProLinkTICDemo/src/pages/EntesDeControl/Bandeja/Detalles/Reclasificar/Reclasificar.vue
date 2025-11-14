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
                    label="Seleccione" dense outlined class="tw-rounded-lg" map-options fill-input @update:model-value="handleTramiteChange"/>
                </div>
                <div class="col-sm tw-px-2 tw-pt-2">
                  <p class="tw-text-label tw-font-semibold">Oficina*</p>
                  <q-select v-model="formData.oficina" :options="filteredOficinas" emit-value label="Seleccione" dense
                    outlined class="tw-rounded-lg" use-input map-options @filter="selectOptionsFilterFn" fill-input
                    :rules="[inputRequired]" hide-selected input-debounce="0" @update:model-value="getCausasRaiz" :disable="isOficinaSelectorDisabled">

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
                <div class="col-sm-12 tw-p-2" v-if="!showPqrdForm">
                    <CommentTextArea v-model="reclasificacionData.observaciones" :is-required="true" :max-length="10000" :min-length="10"
                    label="Observaciones" />
                </div>
              </div>
            </div>
          </q-expansion-item>

          <div v-if="showPqrdForm">
            <div>
              <div class='tw-mb-6 tw-mx-6'>

                <p class="pl-4 tw-font-bold tw-text-xl tw-mt-5 tw-mb-3 text-bold"> Radicar PQRD</p>
                <p class="tw-text-label tw-text-[16px]">Positiva recibirá y responderá en los tiempos definidos por la
                  ley a los
                  medios de contacto suministrados</p>
              </div>

              <q-form ref="form" class="[&>*]:tw-mb-4" greedy>
                <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
                  <q-expansion-item label="Datos del Remitente" default-opened header-class="tw-text-lg tw-font-bold">
                    <div class="tw-grid tw-grid-cols-4 tw-gap-x-4">

                      <div class="tw-col-span-4">
                        <p class="tw-text-label tw-font-semibold">Tipo de Remitente *</p>
                        <q-select :options="listadoTipoRemitente" map-options emit-value outlined
                          v-model='formDataPqrd.tipoRemitente' label="Seleccione" dense :rules="[rulesValidation]" />
                      </div>
                      <div class="tw-col-span-2">
                        <p class="tw-text-label tw-font-semibold">Tipo de Documento del Remitente</p>
                        <q-select :options="tipoDoc" map-options emit-value outlined
                          v-model='formDataPqrd.tipoDocumentoRemitente' label="Seleccione" dense />
                      </div>
                      <div class="tw-col-span-2">
                        <p class="tw-text-label tw-font-semibold">Número de Documento del Remitente</p>
                        <q-input type="text" min="0" outlined v-model='formDataPqrd.numeroDocumentoRemitente'
                          label="Inserte" dense :rules="[(v: string) => lengthValidation(15, v), alphanumeric]"
                          @keypress="Number(formDataPqrd.tipoDocumentoRemitente) == 11 ? onlyAlphaNumeric : onlyNumber" />
                      </div>
                      <div class="tw-col-span-4">
                        <p class="tw-text-label tw-font-semibold">Nombre del Remitente *</p>
                        <q-input outlined v-model='formDataPqrd.nombresRemitente' label="Inserte" dense
                          :rules="[(v: string) => lengthValidation(200, v), rulesValidation, alphabeticalWithSpecialCharacters]"
                          @keypress="alphabeticalWithSpecialCharacters" />
                      </div>
                      <div class="tw-col-span-4">
                        <q-checkbox v-model='formDataPqrd.remitenteAfectado'
                          class='tw-text-slate-600 tw-font-semibold tw-border tw-border-slate-300 tw-pl-3 tw-pr-6 tw-rounded-md'
                          label="Los datos del remitente son los mismos del afectado" size="md" />
                      </div>
                    </div>
                  </q-expansion-item>
                </q-card>

                <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
                  <q-expansion-item label="Datos del Afectado" default-opened header-class="tw-text-lg tw-font-bold">
                    <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
                      <p class="tw-col-span-6 tw-text-black tw-font-semibold tw-pb-2"
                        v-if="Number(formDataPqrd.canalEntrada) === 2">
                        Recuerde que los
                        datos del afectado son los relacionados a
                        los de quien se solicita el requerimiento ante Positiva *</p>
                      <div class="tw-col-span-3">
                        <p class="tw-text-label tw-font-semibold">Tipo Documento Afectado *</p>
                        <q-select :options="tipoDoc" map-options emit-value :rules="[rulesValidation]" outlined
                          v-model='formDataPqrd.tipoDocumentoAfectado' label="Seleccione" dense />
                      </div>
                      <div class="tw-col-span-3">
                        <p class="tw-text-label tw-font-semibold">Número de Documento Afectado *</p>
                        <q-input type="text" min="0" outlined v-model='formDataPqrd.numeroDocumentoAfectado'
                          label="Inserte" dense
                          :rules="[(v: string) => lengthValidation(15, v), rulesValidation, alphanumeric]"
                          @keypress="Number(formDataPqrd.tipoDocumentoAfectado) == 11 ? onlyAlphaNumeric : onlyNumbers" />
                      </div>
                      <div class="tw-col-span-6">
                        <p class="tw-text-label tw-font-semibold">Nombre del Afectado *</p>
                        <q-input outlined v-model='formDataPqrd.nombresAfectado' label="Inserte" dense
                          :rules="[(v: string) => lengthValidation(200, v), inputRequired, alphabeticalWithSpecialCharacters]"
                          @keypress="alphabeticalWithSpecialCharacters" />
                      </div>
                      <div class="tw-col-span-2">
                        <p class="tw-text-label tw-font-semibold">¿Pertenece a la Comunidad LGBTIQ+? *</p>
                        <q-select :disable="[8, 9, 10, 13].includes(formDataPqrd.tipoDocumentoAfectado)"
                          :options="[{ label: 'No', value: false }, { label: 'Si', value: true }]" map-options
                          emit-value outlined v-model='formDataPqrd.lgtbtq' label="Seleccione" dense
                          :rules="[rulesValidation, (v: null) => v === null ? 'Este campo es requerido' : true]" />
                      </div>
                      <div class="tw-col-span-2">
                        <p class="tw-text-label tw-font-semibold">Sexo *</p>
                        <q-select :disable="[8, 9, 10, 13].includes(formDataPqrd.tipoDocumentoAfectado)"
                          :options="generoOptions" map-options emit-value outlined v-model='formDataPqrd.sexo'
                          label="Seleccione" dense :rules="[rulesValidation]" />
                      </div>
                      <div class="tw-col-span-2">
                        <p class="tw-text-label tw-font-semibold">Condición Especial *</p>
                        <q-select :disable="[8, 9, 10, 13].includes(formDataPqrd.tipoDocumentoAfectado)"
                          :options="listadoCondiciones" outlined v-model='formDataPqrd.listadoCondiciones'
                          :rules="[rulesValidation]" label="Seleccione" dense input-debounce="0" class="tw-rounded-lg">
                        </q-select>
                      </div>

                      <div v-if="sexoSelecionado === 6" class="tw-col-span-6">
                        <p class="tw-text-label tw-font-semibold">Cual *</p>
                        <q-input outlined v-model='formDataPqrd.sexoCual' label="Inserte" dense
                          :rules="[(v: string) => lengthValidation(100, v), inputRequired, alphabeticalWithSpecialCharacters]"
                          @keypress="alphabeticalWithSpecialCharacters" />
                      </div>
                    </div>
                  </q-expansion-item>
                </q-card>
                <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
                  <q-expansion-item label="Medios de Contacto y Envio de Respuesta (afectado)" default-opened
                    header-class="tw-text-lg tw-font-bold">
                    <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
                      <div class="tw-col-span-3">
                        <p class="tw-text-label tw-font-semibold">Canal de Entrada *</p>
                        <q-select :options="listadoCanalesRadicacion" map-options emit-value :rules="[rulesValidation]"
                          outlined v-model='formDataPqrd.canalEntrada' disable label="Seleccione" dense />
                      </div>
                      <div class="tw-col-span-3">
                        <p class="tw-text-label tw-font-semibold">Correo Electrónico Afectado *</p>
                        <q-input outlined v-model='formDataPqrd.correoAfectado' label="Inserte" dense :rules="[rulesValidation, (v: string) => validationEmail(v), (v: string) => lengthValidation(200, v)
                        ]" />
                      </div>
                      <div class="tw-col-span-3">
                        <p class="tw-text-label tw-font-semibold">Teléfono Celular</p>
                        <q-input outlined min="0" v-model='formDataPqrd.tlfCelularAfectado' label="Inserte" dense
                          :rules="[mobilePhonNumber, onlyNumbers]" type="text" @keypress="onlyNumber" />
                      </div>
                      <div class="tw-col-span-3">
                        <p class="tw-text-label tw-font-semibold">Teléfono Fijo</p>
                        <q-input outlined min="0" v-model='formDataPqrd.tlfFijoAfectado' label="Inserte" dense
                          :rules="[v => maxLengthInput(10, v), v => minLengthInput(7, v), onlyNumbers]" type="text"
                          @keypress="onlyNumber" />
                      </div>
                      <div class="tw-col-span-3">
                        <p class="tw-text-label tw-font-semibold">País *</p>
                        <q-select :options='paiseOptions' map-options :rules="[rulesValidation]" outlined
                          v-model='formDataPqrd.paisContacto' label="Seleccione" dense />
                      </div>
                      <div class="tw-col-span-3">
                        <p class="tw-text-label tw-font-semibold">Departamento *</p>
                        <q-select :options='departamentoOptions' map-options :rules="[rulesValidation]" outlined
                          v-model='formDataPqrd.departamentoContacto' label="Seleccione" dense
                          :disable="isntColombia" />
                      </div>
                      <div class="tw-col-span-3">
                        <p class="tw-text-label tw-font-semibold">Municipio *</p>
                        <q-select :options='municipioOptions' map-options :rules="[rulesValidation]" outlined
                          v-model='formDataPqrd.ciudadContacto' label="Seleccione" dense :disable="isntColombia" />
                      </div>
                      <div class="tw-col-span-3">
                        <p class="tw-text-label tw-font-semibold">Dirección del Afectado </p>
                        <!-- @vue-expect-error -->
                        <q-input ref="direccionContactoInput" outlined
                          v-model='formDataPqrd.direccionContacto' label="Inserte" dense :rules="(formDataPqrd.medioRespuestaContacto == 2 || formDataPqrd.direccionContacto || !formDataPqrd.correoAfectado)
                            ? [inputRequired, (v: string) => lengthValidation(200, v)]
                            : [true]" @keypress="onlyAlphaNumeric" />
                      </div>
                      <div class="tw-col-span-6">
                        <p class="tw-text-label tw-font-semibold">Medio que Autoriza para Envío de Respuesta *</p>
                        <q-select ref="medioRespuestaContactoSelect" :options="listadoMediosRespuestaOptions"
                          map-options emit-value :rules="[
                            (v: number) => v === 1 && formDataPqrd.correoAfectado === '' ?
                              'Por favor diligencie correo electrónico del remitente para autorizar envío de respuesta por medio electrónico' : true,
                            (v: number) => v === 2 && formDataPqrd.direccionContacto === '' ?
                              'Por favor diligencie dirección de remitente para autorizar envío de respuesta por este medio físico' : true,
                            inputRequired,
                          ]" outlined v-model='formDataPqrd.medioRespuestaContacto' label="Seleccione" dense />
                      </div>
                    </div>
                  </q-expansion-item>
                </q-card>
                <q-card class="tw-px-4 tw-pt-2 tw-pb-4 tw-rounded-xl" flat>
                  <q-expansion-item label="Solicitud" default-opened header-class="tw-text-lg tw-font-bold">
                    <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2"></h2>
                    <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
                      <div class="tw-col-span-3">
                        <p class="tw-text-label tw-font-semibold">Tipo de Solicitud *</p>
                        <q-select :options="filteredSolicitudes" :rules="[rulesValidation]" outlined map-options
                          emit-value v-model='formDataPqrd.tipoSolicitud' label="Seleccione" dense
                          @filter="solicitudOptionsFilterFn" use-input fill-input hide-selected
                          @update:model-value="updateAporteMedicina" />
                      </div>
                      <div class="tw-col-span-3">
                        <p class="tw-text-label tw-font-semibold">Tipología de la PQRD *</p>
                        <q-select
                          :options="Number(formDataPqrd.canalEntrada) === 2 ? listadoTipologiaOptions2 : Number(formDataPqrd.canalEntrada) === 3 ? listadoTipologiaOptions3 : listadoTipologiaOptions4"
                          map-options emit-value :rules="[rulesValidation]" outlined
                          v-model='formDataPqrd.tipologiaPQRD' :disable="isAporteMedicina" label="Seleccione" dense />
                      </div>
                      <div class="tw-col-span-2">
                        <p class="tw-text-label tw-font-semibold">Producto *</p>
                        <q-select :options="filteredProductos" map-options emit-value :rules="[rulesValidation]"
                          outlined v-model='formDataPqrd.producto' label="Seleccione" dense
                          @filter="productoOptionsFilterFn" use-input fill-input hide-selected />
                      </div>
                      <div class="tw-col-span-2">
                        <p class="tw-text-label tw-font-semibold">Acceso a Información Pública</p>
                        <q-select :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]" map-options
                          emit-value outlined v-model='formDataPqrd.accesopPublico' label="Seleccione" dense />
                      </div>
                      <div class="tw-col-span-2">
                        <p class="tw-text-label tw-font-semibold">Descripción - Acceso a Información</p>
                        <q-select :options="descripcionAcessInfoOptions" map-options emit-value
                          :disable="!formDataPqrd.accesopPublico" :rules="[rulesValidation]" outlined
                          v-model='formDataPqrd.descripcionAccesoInfo' label="Seleccione" dense />
                      </div>
                      <div class="tw-col-span-6"
                        v-if="Number(formDataPqrd.tipoSolicitud) === 14 && formDataPqrd.canalEntrada == 2">
                        <span class="tw-w-full">
                          <label class="tw-text-label tw-font-semibold">Asignar Oficina *</label>
                          <q-select v-model="formDataPqrd.oficinas" map-options :options="filteredOficinas"
                            label="Seleccione" dense outlined class="tw-rounded-lg" :rules="[rulesValidation]"
                            @filter="selectOptionsFilterFn" use-input fill-input hide-selected>
                          </q-select>
                        </span>
                      </div>
                      <div class="tw-col-span-6" v-if="Number(formDataPqrd.tipoSolicitud) === 14">
                        <CommentTextArea v-model="formDataPqrd.solicitudDetalle" :is-required="true" :max-length="500"
                          label="Detalle" />
                      </div>
                      <div class="tw-col-span-6 tw-mb-5">
                        <CommentTextArea v-model="formDataPqrd.observaciones" :is-required="true" :max-length="10000"
                          label="Observaciones" description="Su requerimiento debe ser claro y conciso. Por ejemplo:
                  “Solicito respuesta al radicado ENT202101000254789”,
                  “Requiero asignación de asesor para SGSST”,
                  “Solicitar actualización de datos de afiliación riesgos laborales”" />
                      </div>
                    </div>
                  </q-expansion-item>
                </q-card>
              </q-form>
            </div>

            <Modal v-model="cancelModal" title="¡Espera un momento!" :is-success="false" @handleAccept="onReset"
              cancel-button textButtonCancel="No" textButton="Si"
              text="Al cancelar la acción perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
              @close-modal="cancelModal = false" type="button" />

            <q-dialog v-model="radicadoModal" persistent>
              <q-card class="tw-px-3 tw-h-[auto] tw-w-[450px]">
                <div class="tw-flex tw-justify-center tw-mt-3">
                  <span class="tw-rounded-[50px] tw-flex tw-justify-center"
                    style="background-color: rgba(0, 219, 0, 0.05); width: 130px; height: 82px">
                    <img v-lazy :data-url="Check" alt="check" width="40">
                  </span>
                </div>
                <q-card-section q-card-section class="flex column justify-center items-center">
                  <p class="tw-text-[24px] text-center tw-font-bold q-mt-xs">
                    Radicación exitosa
                  </p>
                  <div class="tw-text-[18px] text-center tw-mt-3 tw-w-[370px]">
                    <p class="tw-font-bold">Su solicitud se ha radicado con el código {{ responseId || 'ENT1251252141'
                      }}</p>
                    <p>La respuesta será enviada en plazos definidos por la ley al medio que nos indicó en su solicitud.
                    </p>
                    <p>Se envió a su correo una copia de su solicitud, pero también puede descargarla aquí.</p>
                  </div>
                  <div class="tw-flex tw-mt-8">
                    <q-btn label="Descargar" color="accent" text-color="black" class="tw-p-3"
                      style="width: 200px; height: 50px;" flat @click="handleDownloadRadicacionDocument"
                      v-close-popup />
                    <q-btn label="Finalizar" style="width: 200px; height: 50px;" text-color="white" color="secondary"
                      v-close-popup class="tw-rounded-xl tw-p-3" @click="handleCloseDownloadModal" />
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>
          </div>

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
    :is-success="false" textButtonCancel="No" cancel-button @handleAccept="
      showModal = false; resetForm();" text-button="Si" text-button-cancel="No"
    @close-modal="() => (showModal = false)" />

  <Modal v-model="showModalSave" title="Reclasificación exitosa"
    text="El trámite fue enviado para solicitud de reclasificación con éxito." is-success text-button="¡Ok!"
    @handleAccept="router.push('/bandeja')" />
</template>

<script lang="ts" setup>
import {
  inputRequired,
  maxLengthInput,
  minLengthInput,
  validationEmail,
  onlyNumbers,
  alphanumeric,
  alphabeticalWithSpecialCharacters
} from "src/helpers/validations";
import { Ref, onMounted, ref, watch } from "vue";
import { adminAxios, sgdeaAxios } from "src/services";
import { toast } from 'src/helpers/toast';
import Modal from "src/components/Modal/Modal.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth.store";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { InfoGeneral } from "../types";
import { useRoute } from "vue-router";
// @ts-ignore
import Check from 'src/assets/check.svg';
import { useDepartments, useMunicipalities } from 'src/composables/useVersion';
import { DocumentoRadicado, SelectInput } from "src/interfaces";
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";

const props = withDefaults(
  defineProps<{
    informacionGeneral: InfoGeneral
  }>(),
  {}
);

const tiposPQRD = ref([]);
const oficinas = ref([]);
const filteredOficinas = ref([])
const router = useRouter();
const formData: Ref<any> = ref({
  id: undefined,
  tipoPQRD: '',
  oficina: '',
  descripcion: ''
});
const isOficinaSelectorDisabled: Ref<boolean> = ref(false);
const normalizeString = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

const selectOptionsFilterFn = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredOficinas.value = oficinas.value
    })
    return
  }
  const needle = normalizeString(val);
  update(() => {
    filteredOficinas.value = oficinas.value.filter(v => {
      return normalizeString(v.label).indexOf(needle) > -1;
    });
  })
};

const emit = defineEmits(['successSave'])

const showModal = ref(false);
const showPqrdForm = ref(false);
const reclasificarRef = ref()
const auth = useAuthStore();
const showModalSave = ref(false);
const idTramite = ref();

const route = useRoute()
const ente_id = route.params.id

let reclasificacionData = ref<any>({
  oficina: "",
  observaciones: "",
  tipoSolicitud: ""
});

onMounted(async () => {
  await initData();

  formDataPqrd.value.canalEntrada = auth.$state.userInfo.role == 'Radicador - Contact Center' ? 3 : 2
  await loadPaises()
  await loadDepartamentos()
  await loadMunicipios()
  await loadTipoDoc()
  await loadGenero()
  await loadDescripcionAcessInfo()
  await loadListadosMediosRepuesta()
  await loadListadoTipologia()
  await loadListadoTipoRemitente()
  await loadListadoCanalesRadicacion()
  await loadListadoOficinas()
  await loadListadoCondiciones()
  await loadListadoProductosPQRD()
  await loadListadoTiposSolicitud()
});

async function initData() {
  try {
    await getTiposPQRD();
    await getOficinas();
  } catch (error) {
    await getTiposPQRD();
    await getOficinas();

    console.error(error);
  }

  formDataPqrd.value = {
    tipoRemitente: '',
    tipoDocumentoRemitente: null,
    numeroDocumentoRemitente: '',
    nombresRemitente: '',
    tipoDocumentoAfectado: null,
    numeroDocumentoAfectado: '',
    nombresAfectado: '',
    lgtbtq: null,
    sexo: null,
    sexoCual: '',
    condicionEspecial: [],
    correoAfectado: '',
    tlfCelularAfectado: '',
    tlfFijoAfectado: '',
    paisContacto: '',
    departamentoContacto: '',
    ciudadContacto: '',
    remitenteAfectado: false,
    direccionContacto: '',
    medioRespuestaContacto: '',
    tipologiaPQRD: '',
    tipoSolicitud: '',
    producto: '',
    accesopPublico: false,
    descripcionAccesoInfo: '',
    observaciones: '',
    solicitudDetalle: '',
    listadoCondiciones: [],
    files: [],
    canalEntrada: '',
    oficinas: ''
  }

}

async function getTiposPQRD() {
  try {
    const { data } = await sgdeaAxios.get(`reclasificacion/listadoTiposTramite`);

    const idsParaOcultar = [2, 13];

    tiposPQRD.value = data
      .filter(tramite => !idsParaOcultar.includes(tramite.id))
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
    const { data } = await sgdeaAxios.get('oficinas/all');
    const idsAExcluir = [4, 7, 8, 9, 10, 11, 12, 13, 14, 26]; // Se excluyen también las de medicina laboral y N/A

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

const selectedTramite = ref('');
function handleTramiteChange (tramiteId: number){
  idTramite.value = tramiteId;
  if (tramiteId !== 8) {
    showPqrdForm.value = false;
  }
  const tramiteSeleccionado = tiposPQRD.value.find(tramite => tramite.value === tramiteId)

  if (tramiteSeleccionado) {
    selectedTramite.value = tramiteSeleccionado.label; // Guardar el nombre del trámite
  }

  if (tramiteId === 8) { // ID for "Medicina laboral" or "PQRD"
    isOficinaSelectorDisabled.value = true;

    let oficinaLabel = '';
    if (tramiteId === 8) {
      showPqrdForm.value = true;
      oficinaLabel = "GRUPO DE ATENCIÓN INTEGRAL Y DE SERVICIO AL CIUDADANO";
    }

    const oficina = oficinas.value.find(oficina => oficina.label === oficinaLabel);
    if (oficina) {
      formData.value.oficina = oficina.value;
    }
  } else {
    formData.value.oficina = null;
    isOficinaSelectorDisabled.value = false;
  }
}

async function save() {
  if (!(await reclasificarRef.value.validate())) {
    toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos.');
    return;
  }

  const newPqrd2 = new FormData();
  let data;
  let dataPqrd;
  const tramiteId = formData.value.tipoPQRD;

  if (showPqrdForm.value) {
    handleSubmitIsLoading.value = true;

    //@ts-ignore
    let idCondiciones = [formDataPqrd.value.listadoCondiciones.value];

    dataPqrd = {
      solicitud: {
        moduloOrigenId: 11,
        moduloDestinoId: tramiteId,
        idCasoOrigen: props.informacionGeneral.id,
        usuarioSolicitanteId: auth.$state.userInfo.userid,
        observaciones: reclasificacionData.value.observaciones || formDataPqrd.value.observaciones,
        oficinaId: formData.value.oficina || null,
        datosModulo: {
          tipoModulo: 'PQRD',
          datosRemitenteTipoRemitenteId: formDataPqrd.value.tipoRemitente,
          datosRemitenteTipoDocumentoId: formDataPqrd.value.tipoDocumentoRemitente || 12,
          datosRemitenteNumeroDocumento: formDataPqrd.value.numeroDocumentoRemitente,
          datosRemitenteNombre: formDataPqrd.value.nombresRemitente,
          datosAfectadoTipoDocumentoId: formDataPqrd.value.tipoDocumentoAfectado,
          datosAfectadoNumeroDocumento: formDataPqrd.value.numeroDocumentoAfectado,
          datosAfectadoNombre: formDataPqrd.value.nombresAfectado,
          // @ts-ignore
          datosAfectadoLgtbtq: formDataPqrd.value.lgtbtq.value ? formDataPqrd.value.lgtbtq.value : formDataPqrd.value.lgtbtq,
          datosAfectadoGeneroId: formDataPqrd.value.sexo,
          datosAfectadoGeneroOtro: formDataPqrd.value.sexoCual ? formDataPqrd.value.sexoCual : '',
          datosAfectadoCorreoElectronico: formDataPqrd.value.correoAfectado,
          datosAfectadoTelefonoCelular: formDataPqrd.value.tlfCelularAfectado,
          datosAfectadoTelefonoFijo: formDataPqrd.value.tlfFijoAfectado,
          // @ts-ignore
          datosAfectadoPaisIdPais: formDataPqrd.value.paisContacto.value,
          // @ts-ignore
          datosAfectadoDepartamentoIdDepartamento: formDataPqrd.value.departamentoContacto.value,
          // @ts-ignore
          datosAfectadoMunicipioIdMunicipio: formDataPqrd.value.ciudadContacto.value,
          datosAfectadoDireccion: formDataPqrd.value.direccionContacto,
          datosAfectadoMedioRespuestaId: formDataPqrd.value.medioRespuestaContacto,
          solicitudTipoPqrdId: formDataPqrd.value.tipologiaPQRD,
          solicitudTipoSolicitudId: formDataPqrd.value.tipoSolicitud,
          solicitudTipoproductoId: formDataPqrd.value.producto,
          solicitudAccesoInformacionPublica: formDataPqrd.value.accesopPublico,
          solicitudDescripcionAccesoInformacionId: formDataPqrd.value.descripcionAccesoInfo,
          solicitudObservaciones: formDataPqrd.value.observaciones,
          solicitudDetalle: formDataPqrd.value.solicitudDetalle,
          usuarioCreador: auth.$state.userInfo.name,
          canalRadicacion: formDataPqrd.value.canalEntrada,
          // @ts-ignore
          oficina: Number(formDataPqrd.value.oficinas.value) === 14 ? 15 : formDataPqrd.value.oficinas.value || 26,
          detalleAfectado: '',
          listadoCondiciones: `[${idCondiciones}]`,
        }
      }
    }

    newPqrd2.append("solicitud", JSON.stringify(dataPqrd));
    correoAfectado.value = formDataPqrd.value.correoAfectado
  }

  data = {
    reclasificarTramiteId: tramiteId,
    oficinaId: formData.value.oficina || null,
    tutelaId: props.informacionGeneral.id,
    observaciones: reclasificacionData.value.observaciones || formDataPqrd.value.observaciones,
    usuarioId: auth.$state.userInfo.userid,
  }

  try {
    let response;
    if (showPqrdForm.value) {
      response = await sgdeaAxios.post('/solicitud-reclasificacion', newPqrd2);
    } else {
      response = await sgdeaAxios.post('/api/entes/reclasificar', data);
    }
    if (response.status === 200) {
      handleSubmitIsLoading.value = false;
      await crearTrazabilidad({
        proceso: "Entes" + props.informacionGeneral.id,
        secuencia: props.informacionGeneral.nroRadicado,
        estado: props.informacionGeneral.estado.estado,
        descripcion: "Se ha hecho una solicitud de reclasificación de Entes de Control",
        comentario: 'Reclasificar',
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} solicitó una reclasificación de la Entes`,
        tramite: props.informacionGeneral.informacionSolicitud?.tipoSolicitud || 'Reclasificar',
      })
      showModalSave.value = true;
      emit('successSave')
    }
  } catch (error) {
    toast.error(error.response?.data?.message ?? 'Ha ocurrido un error.');
  }

}

interface PQRD {
  tipoRemitente: string;
  tipoDocumentoRemitente: number;
  numeroDocumentoRemitente: string;
  nombresRemitente: string;
  tipoDocumentoAfectado: number;
  numeroDocumentoAfectado: string;
  nombresAfectado: string;
  lgtbtq: boolean,
  sexo: Number;
  sexoCual: string;
  condicionEspecial: any[];
  correoAfectado: string;
  tlfCelularAfectado: string;
  tlfFijoAfectado: string;
  paisContacto: string;
  departamentoContacto: string;
  ciudadContacto: string;
  remitenteAfectado: boolean,
  direccionContacto: string;
  medioRespuestaContacto: string;
  tipologiaPQRD: string;
  tipoSolicitud: string;
  producto: string;
  accesopPublico: boolean;
  descripcionAccesoInfo: string;
  observaciones: string;
  solicitudDetalle: string;
  listadoCondiciones: any[];
  files: any[];
  canalEntrada: number;
  oficinas: string;
}

const handleSubmitIsLoading = ref<boolean>(false)

const formDataPqrd: Ref<PQRD> = ref({
  tipoRemitente: '',
  tipoDocumentoRemitente: null,
  numeroDocumentoRemitente: '',
  nombresRemitente: '',
  tipoDocumentoAfectado: '',
  numeroDocumentoAfectado: '',
  nombresAfectado: '',
  lgtbtq: null,
  sexo: '',
  sexoCual: '',
  condicionEspecial: [],
  correoAfectado: '',
  tlfCelularAfectado: '',
  tlfFijoAfectado: '',
  paisContacto: '',
  departamentoContacto: '',
  ciudadContacto: '',
  remitenteAfectado: false,
  direccionContacto: '',
  medioRespuestaContacto: '',
  tipologiaPQRD: '',
  tipoSolicitud: '',
  producto: '',
  accesopPublico: false,
  descripcionAccesoInfo: '',
  observaciones: '',
  solicitudDetalle: '',
  listadoCondiciones: [],
  files: [],
  canalEntrada: '',
  oficinas: ''
});

const form = ref()
const showModalVerification = ref(true)
const radicadoModal = ref(false)
const paiseOptions: Ref<any[]> = ref([]);
const departamentoOptions: Ref<any[]> = ref([]);
const municipioOptions: Ref<any[]> = ref([]);
const generoOptions: Ref<any[]> = ref([])
const descripcionAcessInfoOptions: Ref<any[]> = ref([])
const listadoMediosRespuestaOptions: Ref<any[]> = ref([])
const listadoTipologiaOptions: Ref<any[]> = ref([])
const listadoTipologiaOptions2: Ref<any[]> = ref([])
const listadoTipologiaOptions3: Ref<any[]> = ref([])
const listadoTipologiaOptions4: Ref<any[]> = ref([])
const listadoCondiciones: Ref<any[]> = ref([])
const listadoTipoRemitente: Ref<any[]> = ref([])
const listadoProductosPQRD: Ref<any[]> = ref([])
const listadoTiposSolicitud: Ref<any[]> = ref([])
const listadoCanalesRadicacion: Ref<any[]> = ref([])
const listadoOficinas: Ref<any[]> = ref([])
const tipoDoc: Ref<SelectInput[]> = ref([]);
const filteredSolicitudes = ref<SelectInput[]>([]);
const filteredProductos = ref<SelectInput[]>([]);
const responseId = ref('')
const correoAfectado = ref('')
const isntColombia = ref(false)
const cancelModal = ref(false)
const generatedDocId = ref<string | null>(null);
const MAX_FILE = 10
const medioRespuestaContactoSelect = ref(null)
const direccionContactoInput = ref(null)
const sexoSelecionado = ref<number | null>(null)
const fieldsToWatch = [
  'tipoDocumentoRemitente',
  'nombresRemitente',
  'numeroDocumentoRemitente',
];
const isAporteMedicina = ref(false)
const text = `
  <p>Su solicitud se ha radicado con el código ${responseId.value}</p>
  <p>La respuesta será enviada en plazos definidos por la ley al medio que nos indicó en su solicitud.</p>
  <p>Se envió a su correo una copia de su solicitud, pero también puede descargarla aquí.</p>
`;

async function loadTipoDoc() {
  const { data } = await sgdeaAxios.get("/correspondencia/comunicacion/listadoTipoIdentificacion");
  tipoDoc.value = [
    ...data.map((val: any) => {
      return {
        label: val.nombre,
        value: val.id,
      };
    }),
  ];

  tipoDoc.value = tipoDoc.value.filter((e) => { return e.value !== 12 })
}

async function loadPaises() {
  const { data } = await adminAxios.get("/paises/list");
  paiseOptions.value = [
    ...data.map((val: any) => {
      return {
        label: val.nombre,
        value: val.idPais,
      };
    }).sort((a, b) => a.label.localeCompare(b.label)),
  ];

  formDataPqrd.value.paisContacto = paiseOptions.value.find(val => val.value === 425)
}

async function loadDepartamentos() {
  const { data: formDataPqrd } = await adminAxios.get("/departamentos/list");
  departamentoOptions.value = formDataPqrd.map((val: any) => {
    return {
      label: val.nombre,
      value: val.idDepartamento,
    };
  });
}

async function loadMunicipios() {
  const { data: formDataPqrd } = await adminAxios.get("/municipios/list");
  municipioOptions.value = formDataPqrd.sort((a: { nombre: string; }, b: { nombre: string; }) => {
    const labelA = a.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim();
    const labelB = b.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim();

    return labelA.localeCompare(labelB, 'es-ES', { sensitivity: 'base' });
  }).map((val) => {
    return {
      label: val.nombre,
      value: val.id,
    };
  })
}

async function loadGenero() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoGenero");

    if (response.status == 200 || response.status == 201) {
      generoOptions.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        };
      }).sort((a, b) => a.label.localeCompare(b.label));
    }

    // Asignar el primer valor al formulario

  } catch (error) {
    console.error(error);
  }
}

async function loadDescripcionAcessInfo() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoDescripcionAccesoInfo")

    if (response.status == 200 || response.status == 201) {
      descripcionAcessInfoOptions.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        }
      }).sort((a, b) => a.label.localeCompare(b.label))
    }
    formDataPqrd.value.descripcionAccesoInfo = descripcionAcessInfoOptions.value[0].value;

  } catch (error) {
    console.error(error)
  }
}

async function loadListadosMediosRepuesta() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoMediosRespuesta")

    if (response.status == 200 || response.status == 201) {
      listadoMediosRespuestaOptions.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        }
      })
    }

  } catch (error) {
    console.error(error)
  }
}

async function loadListadoTipologia() {
  try {
    const response = await sgdeaAxios.get(`/pqrd/listadoTipologia?filterType=0&pqrdId=0&canalEntrada=${formDataPqrd.value.canalEntrada}`)

    if (response.status == 200 || response.status == 201) {
      listadoTipologiaOptions.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        }
      })
    }

    listadoTipologiaOptions2.value = listadoTipologiaOptions.value.filter((e) => {
      return e.value !== 8
    })

    listadoTipologiaOptions3.value = listadoTipologiaOptions.value.filter((e) => {
      return e.value !== 7 && e.value !== 2
    })

    listadoTipologiaOptions4.value = listadoTipologiaOptions.value.filter((e) => {
      return e.value !== 7 && e.value !== 8
    })

    sortOptions(listadoTipologiaOptions.value)
    sortOptions(listadoTipologiaOptions2.value)
    sortOptions(listadoTipologiaOptions3.value)
    sortOptions(listadoTipologiaOptions4.value)

  } catch (error) {
    console.error(error)
  }
}

async function loadListadoTipoRemitente() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoTiposRemitente")

    if (response.status == 200 || response.status == 201) {
      listadoTipoRemitente.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        }
      })
    }

  } catch (error) {
    console.error(error)
  }
}

async function loadListadoCondiciones() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoCondiciones")

    if (response.status == 200 || response.status == 201) {
      listadoCondiciones.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        }
      })
    }

  } catch (error) {
    console.error(error)
  }
}

async function loadListadoProductosPQRD() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoProductosPQRD")

    if (response.status == 200 || response.status == 201) {
      listadoProductosPQRD.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        }
      }).sort((a, b) => a.label.localeCompare(b.label))
    }

    filteredProductos.value = listadoProductosPQRD.value

  } catch (error) {
    console.error(error)
  }
}

async function loadListadoTiposSolicitud() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoTiposSolicitud")

    if (response.status == 200 || response.status == 201) {
      listadoTiposSolicitud.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        }
      })
    }

    listadoTiposSolicitud.value = listadoTiposSolicitud.value.filter(e => e.value !== 24)

  } catch (error) {
    console.error(error)
  }
}

async function loadListadoCanalesRadicacion() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoCanalesRadicacion")

    if (response.status == 200 || response.status == 201) {
      listadoCanalesRadicacion.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        }
      }).sort((a, b) => a.label.localeCompare(b.label))
    }

    listadoCanalesRadicacion.value = listadoCanalesRadicacion.value.filter((e) => { return e.value !== 1 && e.value !== 4 && e.value !== 5 })

  } catch (error) {
    console.error(error)
  }
}

async function loadListadoOficinas() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoOficinas")

    if (response.status == 200 || response.status == 201) {
      listadoOficinas.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        }
      })
    }

    // Lista de IDs de oficinas que quieres excluir
    const idsAExcluir = [7, 8, 9, 10, 11] // Agrega aquí los IDs que quieres excluir

    listadoOficinas.value = listadoOficinas.value.filter((e) => !idsAExcluir.includes(e.value))
    filteredOficinas.value = listadoOficinas.value
  } catch (error) {
    console.error(error)
  }
}

const solicitudOptionsFilterFn = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredSolicitudes.value = listadoTiposSolicitud.value
    })
    return
  }
  update(() => {
    filteredSolicitudes.value = listadoTiposSolicitud.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const productoOptionsFilterFn = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredProductos.value = listadoProductosPQRD.value
    })
    return
  }
  update(() => {
    filteredProductos.value = listadoProductosPQRD.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const sortOptions = (vals: any[]) => {
  return vals.sort((leftItem: { label: string; }, rightItem: { label: string; }) => {
    const nombreA = leftItem.label.toLowerCase().trim();
    const nombreB = rightItem.label.toLowerCase().trim();

    if (nombreA < nombreB) {
      return -1;
    }

    if (nombreA > nombreB) {
      return 1;
    }

    return 0;
  });
}

function onReset() {
  formDataPqrd.value = {
    tipoRemitente: null,
    tipoDocumentoRemitente: null,
    numeroDocumentoRemitente: '',
    nombresRemitente: '',
    tipoDocumentoAfectado: null,
    numeroDocumentoAfectado: '',
    nombresAfectado: '',
    lgtbtq: false,
    sexo: null,
    sexoCual: '',
    condicionEspecial: [],
    correoAfectado: '',
    tlfCelularAfectado: '',
    tlfFijoAfectado: '',
    paisContacto: '',
    departamentoContacto: '',
    ciudadContacto: '',
    remitenteAfectado: false,
    direccionContacto: '',
    medioRespuestaContacto: '',
    tipologiaPQRD: '',
    tipoSolicitud: '',
    producto: '',
    accesopPublico: false,
    descripcionAccesoInfo: '',
    observaciones: '',
    solicitudDetalle: '',
    listadoCondiciones: [],
    files: [],
    canalEntrada: null,
    oficinas: ''
  }

  // @ts-ignore
  router.go()
};

const handleDownloadRadicacionDocument = async () => {
  try {
    const { data: listDocs } = await sgdeaAxios.get<any>(
      `/radicados/obtenerHijosPorNodo/${generatedDocId.value}`
    );

    const docRadicado = listDocs.list.entries?.find((it) => {
      const entryName = it.entry.name
      return entryName && entryName.startsWith(responseId.value)
    })

    const { data } = await sgdeaAxios.get<DocumentoRadicado>(
      `/radicados/consultar_documento/${docRadicado.entry.id}`
    );
    const byteCharacters = atob(data.base64x);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = String(responseId.value);

    link.click();

    URL.revokeObjectURL(blobUrl);

    location.reload()
  } catch (error) {
    toast.error('Ocurrió un error inesperado.')
  }
};

const handleCloseDownloadModal = () => {
  location.reload()
}

watch(
  () => formDataPqrd.value.paisContacto,
  async (value) => {
    //@ts-ignore
    let val = value.label as unknown as string
    formDataPqrd.value.departamentoContacto = ''
    formDataPqrd.value.ciudadContacto = ''
    if (val.toLowerCase() == 'colombia') {
      isntColombia.value = false
      //@ts-ignore
      const { optionsDepartments } = await useDepartments(value.value);
      departamentoOptions.value = sortOptions(optionsDepartments.value);

    } else {
      // @ts-ignore
      formDataPqrd.value.departamentoContacto = value
      // @ts-ignore
      formDataPqrd.value.ciudadContacto = value
      isntColombia.value = true
    }

  }
);

watch(() => formDataPqrd.value.sexo, (newValue, oldValue) => {
  const selectedOption = generoOptions.value.find(option => option.value === newValue);
  if (selectedOption) {
    sexoSelecionado.value = selectedOption.value
  }
});

watch(
  () => formDataPqrd.value.departamentoContacto,
  async (value) => {
    //@ts-ignore
    if (!isntColombia.value) {
      formDataPqrd.value.ciudadContacto = ''
    }

    //@ts-ignore
    const { optionsMunicipalities } = await useMunicipalities(value.value);
    municipioOptions.value = sortOptions(optionsMunicipalities.value)
  }
);

watch(
  () => formDataPqrd.value.paisContacto,
  async (value) => {
    //@ts-ignore
    const { optionsDepartments } = await useDepartments(value.value);
    departamentoOptions.value = optionsDepartments.value;
  }
);

watch(
  () => fieldsToWatch.map(field => formDataPqrd.value[field]),
  (newValues) => {
    if (formDataPqrd.value.remitenteAfectado) {
      formDataPqrd.value.tipoDocumentoAfectado = newValues[0];
      formDataPqrd.value.nombresAfectado = newValues[1];
      formDataPqrd.value.numeroDocumentoAfectado = newValues[2];
    }
  }
);

watch(() => formDataPqrd.value.remitenteAfectado, async (value) => {
  if (value) {
    formDataPqrd.value = {
      ...formDataPqrd.value,
      tipoDocumentoAfectado: formDataPqrd.value.tipoDocumentoRemitente,
      nombresAfectado: formDataPqrd.value.nombresRemitente,
      numeroDocumentoAfectado: formDataPqrd.value.numeroDocumentoRemitente
    }
  } else {
    formDataPqrd.value = {
      ...formDataPqrd.value,
      tipoDocumentoAfectado: '',
      nombresAfectado: '',
      numeroDocumentoAfectado: ''
    }
  }
})

watch(() => formDataPqrd.value.tipoSolicitud, async (v) => {
  if (Number(formDataPqrd.value.tipoSolicitud) == 14) {
    formDataPqrd.value.oficinas = 15

  }
})

watch(() => formDataPqrd.value.tipoDocumentoAfectado, () => {
  if ([8, 9, 10, 13].includes(formDataPqrd.value.tipoDocumentoAfectado)) {
    formDataPqrd.value.lgtbtq = false
    formDataPqrd.value.sexo = 1
    formDataPqrd.value.listadoCondiciones = { label: "No aplica", value: 1 }
  } else {
    formDataPqrd.value.lgtbtq = ''
    formDataPqrd.value.sexo = null
    formDataPqrd.value.listadoCondiciones = []
  }
})

const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return 'Este campo es requerido'
  }
  return true
}

function onlyAlphaNumeric(event: { which: any; keyCode: any; preventDefault: () => void; }) {
  let charCode = (event.which) ? event.which : event.keyCode;

  // Convert the charCode to a String
  let charTyped = String.fromCharCode(charCode);

  // Define a regex for alphanumeric characters and Spanish special characters
  let regex = /^[a-zA-Z0-9 áéíóúÁÉÍÓÚÑñ#-]*$/;

  // Check if the character matches the regex
  if (regex.test(charTyped)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

function onlyNumber(event: { keyCode: any; which: any; preventDefault: () => void; }) {
  let keyCode = event.keyCode ? event.keyCode : event.which;
  if ((keyCode >= 48 && keyCode <= 57)) {
    return true;
  }
  event.preventDefault();
  return false;
}

const mobilePhonNumber = (val: any) => {
  const expresionRegular = /^(30|31|32|35)[0-9]{8}$/;
  if (val) {
    if (val[0] != '3') {
      return "El número de teléfono celular debe iniciar por el número (3)"
    }
    else if (val.length == 12 && !expresionRegular.test(val)) {
      return "Ingrese un número de teléfono válido, debe contener el indicativo al principio (30)";
    } else if (!expresionRegular.test(val)) {
      return "El número de teléfono celular debe contener 10 dígitos";
    }
  }
};

const lengthValidation = (n, val: string) => val.length <= n || "Máximo " + n + " caracteres"
const updateAporteMedicina = (v) => {
  if (v == 2 || v == 7) {
    isAporteMedicina.value = true
    formDataPqrd.value.tipologiaPQRD = ''
  } else {
    isAporteMedicina.value = false
  }
}
</script>
