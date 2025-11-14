<template>
  <div class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
    <div class="tw-pt-4">
      <router-link to="/">
        <q-btn flat color="primary" label="Volver" icon="chevron_left" />
      </router-link>
    </div>

    <ComponentTitle
      class="q-mt-lg"
      title="Radicación Manual"
      classTitle="tw-font-bold tw-text-4xl"
    />

    <div class="tw-container tw-mx-auto tw-mt-8">
      <!-- ((stepProgress * (step + 1) - 0.5)) -->
      <q-linear-progress size="8px" :value="0.333333333 * (step + 1)" />

      <div class="tw-grid tw-grid-cols-3 tw-gap-0">
        <div class="tw-mt-2">
          <h4
            class="tw-text-2xs tw-text-center tw-leading-5"
            :class="step >= 0 ? 'tw-text-slate-600' : 'tw-text-slate-400'"
          >
            <b>Tipo de Comunicación</b>
          </h4>
        </div>

        <div class="tw-mt-2">
          <h4
            class="tw-text-2xs tw-text-center tw-leading-5"
            :class="step >= 1 ? 'tw-text-slate-600' : 'tw-text-slate-400'"
          >
            <b>Datos Generales</b>
          </h4>
        </div>
        <div class="tw-mt-2">
          <h4
            class="tw-text-2xs tw-text-center tw-leading-5"
            :class="step >= 2 ? 'tw-text-slate-600' : 'tw-text-slate-400'"
          >
            <b>Aprobar</b>
          </h4>
        </div>
      </div>
    </div>

    <div v-if="step === 0">
      <q-form ref="myForm0" v-if="step == 0" greedy>
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <div class="col row">
            <p class="tw-text-2xl tw-font-bold">Tipo de Comunicación</p>
          </div>

          <div class="tw-mt-2">
            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Nombre de comunicación * ({{ form0.comNombre.length }}/150)</label>
                  <q-input
                    v-model="form0.comNombre"
                    dense
                    outlined
                    label="Inserte"
                    class="tw-rounded-lg"
                    :rules="[inputRequired, (val) => maxLengthInput(150, val)]"
                    :disable="validStep"
                  />
                </span>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Tipo de comunicación *</label>
                  <q-select
                    v-model="form0.comTipoComunicacionId"
                    label="Seleccione"
                    map-options
                    emit-value
                    dense
                    outlined
                    :options="tipoComunicacionOptions"
                    :rules="[inputRequired]"
                    class="tw-rounded-lg"
                    :disable="validStep"
                  >
                  </q-select>
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Tipo de Gestión *</label>
                  <q-select
                    v-model="form0.comTipoGestion"
                    label="Seleccione"
                    map-options
                    emit-value
                    dense
                    outlined
                    :options="tipoGestionList"
                    :rules="[inputRequired]"
                    class="tw-rounded-lg"
                    :disable="validStep"
                  >
                  </q-select>
                </span>
              </div>
            </div>
          </div>
        </q-card>

        <q-card
          v-if="form0.comTipoComunicacionId == 1"
          class="q-mt-lg tw-rounded-xl q-pa-lg"
          flat
        >
          <p class="tw-text-2xl tw-font-bold tw-pb-4">
            Sección destinatarios internos
          </p>
          <FormCopyInternaManualDestinatarios :data-initial="form0" />
        </q-card>
        <q-card
          v-if="form0.comTipoComunicacionId == 2"
          class="q-mt-lg tw-rounded-xl q-pa-lg"
          flat
        >
          <p class="tw-text-2xl tw-font-bold tw-pb-4">Sección destinatarios</p>
          <FormCopyExternaManualDestinatarios :data-initial="form0" />
        </q-card>
      </q-form>
    </div>

    <div v-if="step === 1">
      <q-form ref="myForm1" greedy>
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <p class="tw-text-2xl tw-font-bold tw-pb-4">
            Sección Datos de salida
          </p>

          <div class="tw-mt-2">
            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label"
                    >Anexos (Cantidad de folios) *</label
                  >
                  <q-input
                    v-model.number="form1.datosSalidaAnexos"
                    dense
                    outlined
                    label="Inserte"
                    class="tw-rounded-lg"
                    :rules="[
                      inputRequired,
                      onlyNumbers,
                      (val) => maxLengthInput(4, val),
                    ]"
                    @keypress="onlyNumeric"
                  />
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Asunto ({{ form1.asunto.length }}/200)</label>
                  <q-input
                    v-model="form1.asunto"
                    dense
                    outlined
                    label="Inserte"
                    class="tw-rounded-lg"
                    autogrow
                    :rules="[(val) => maxLengthInput(200, val)]"
                  />
                </span>
              </div>
            </div>
          </div>
        </q-card>

        <FormDatosAfectado :data-initial="form1" />

        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <p class="tw-text-2xl tw-font-bold">Sección ¿Con copia?</p>

          <div v-if="[1].includes(form0.comTipoComunicacionId)">
            <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
              <p class="tw-text-2xl tw-font-bold tw-pb-4">
                Destinatarios internos
              </p>
              <FormCopyInterna
                :key="isFormResetInterno"
                @update:item-added="
                  (form) => handleClickAddNewDestinaryInterno(form)
                "
              />

              <TableDestinatarios
                :title="`Listado copias interna`"
                :key="bodyCopyInterna"
                class="full-width"
                :JUZGADOS_HEADER="DESTINARIOS_HEADER_COPY_INTERNA_MANUAL"
                :JUZGADOS_BODY="bodyCopyInterna"
                @update:item-deleted="(value) => (bodyCopyInterna = value)"
              />
            </q-card>
          </div>

          <div v-if="[2].includes(form0.comTipoComunicacionId)">
            <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
              <p class="tw-text-2xl tw-font-bold tw-pb-4">
                Destinatarios internos
              </p>
              <FormCopyInterna
                :key="isFormResetInterno"
                @update:item-added="
                  (form) => handleClickAddNewDestinaryInterno(form)
                "
              />

              <TableDestinatarios
                :title="`Listado copias interna`"
                :key="bodyCopyInterna"
                class="full-width"
                :JUZGADOS_HEADER="DESTINARIOS_HEADER_COPY_INTERNA_MANUAL"
                :JUZGADOS_BODY="bodyCopyInterna"
                @update:item-deleted="(value) => (bodyCopyInterna = value)"
              />
            </q-card>

            <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
              <p class="tw-text-2xl tw-font-bold tw-pb-4">
                Destinatarios externos
              </p>
              <FormCopyExterna
                :key="isFormResetExterno"
                @update:item-added="
                  (form) => handleClickAddNewDestinaryExterno(form)
                "
              />
            </q-card>

            <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
              <TableDestinatarios
                :title="`Listado copias externa`"
                :key="bodyCopyExterna"
                class="full-width"
                :JUZGADOS_HEADER="DESTINARIOS_HEADER_COPY_EXTERNA_MANUAL"
                :JUZGADOS_BODY="bodyCopyExterna"
                @update:item-deleted="(value) => (bodyCopyExterna = value)"
              />
            </q-card>
          </div>
          <!-- <FormDatosGenerales :data-initial="form1" /> -->
        </q-card>
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <p class="tw-text-2xl tw-font-bold tw-pb-4">
            Adjuntar documentos
          </p>
          <label class="tw-w-full">
            <FileLoader
              v-model:model-value="files"
              class="tw-w-full"
              accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
              :max-file-size="50 * 1024 * 1024" :max-files="30" max-file-size-label="50"
              @rejected="rejectedFiles" multiple
            />
          </label>
        </q-card>
      </q-form>
    </div>

    <div v-if="step === 2">
      <q-form ref="myForm2" greedy>
        <FormAprobacionManual
          @update:item-selected="(val) => handleItemSeleted(val)"
        />
      </q-form>
    </div>

    <div class="tw-flex tw-justify-between tw-items-center tw-my-10 tw-gap-6">
      <q-btn
        v-if="step === 1"
        label="Anterior"
        text-color="white"
        style="width: 240px"
        color="primary"
        class="tw-rounded-xl tw-h-12 tw-p-2"
        @click="step--"
      />

      <q-btn
        :label="step === 0 ? 'Siguiente' : step === 1 ? 'Finalizar' : 'Asignar'"
        text-color="white"
        style="width: 240px"
        color="primary"
        class="tw-rounded-xl tw-h-12 tw-p-2 tw-ml-auto"
        @click="nextStep(step)"
      />
    </div>

    <q-dialog v-model="showSuccessModal" persistent>
      <q-card class="q-py-xl q-px-xl">
        <div class="tw-rounded-lg tw-flex tw-justify-center">
          <span
            class="tw-rounded-[100px] tw-flex tw-justify-center"
            style="background-color: #f6f6f9; width: 82px; height: 82px"
          >
            <img v-lazy :data-url="InterrogationModal" alt="check" />
          </span>
        </div>
        <p class="tw-text-[24px] text-center tw-font-bold q-mt-lg">
          {{ isMemorando ? 'Memorando interno confirmado correctamente' : 'Datos de salida confirmados correctamente' }}
        </p>
        <p class="tw-text-[18px] text-center tw-mt-'">
          {{
            `Proceso exitoso, seleccione un aprobador. Para realizar la radicación en ventanilla, por favor indicar el siguiente número de pre radicado ${idRadicacion}`
          }}
        </p>
        <div class="tw-flex tw-mt-8 tw-justify-center">
          <q-btn
            label="Cerrar"
            class="tw-h-12 tw-ms-4 tw-w-52"
            color="secondary"
            @click="showSuccessModal = false"
          />
        </div>
      </q-card>
    </q-dialog>
    <!-- modal asiganar -->
    <Modal
      text-button-cancel="No"
      text-button="Sí"
      :is-success="false"
      @close-modal="modalSendAprobar = false"
      v-model="modalSendAprobar"
      :title="`Confirmación`"
      cancel-button
      text="¿Aprobador seleccionado correctamente?"
      @handle-accept="handleSubmitAsignarAprobador"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Modal from "components/Modal/Modal.vue";
// @ts-ignore
import {
  inputRequired,
  maxLengthInput,
  onlyNumbers,
} from "src/helpers/validations";
import { useCrearComunicacionesLogic } from "src/pages/Correspondencia/Crear/CrearComunicaciones/CrearComunicaciones.Logic";
import { mapFormDataToDestinataires } from "./Crear/CrearComunicaciones/utils/index";
import {
  DESTINARIOS_HEADER_COPY_EXTERNA_MANUAL,
  DESTINARIOS_HEADER_COPY_INTERNA_MANUAL,
  dictionaryTypeCopy,
  mapFormData,
  objResponse,
  dataObjectSend,
} from "./Crear/CrearComunicaciones/const";
import FormCopyInterna from "src/components/comunicacion/radicacion/FormCopyInternaManual.vue";
import FormCopyExterna from "src/components/comunicacion/radicacion/FormCopyExternalManual.vue";
import FormAprobacionManual from "src/components/comunicacion/radicacion/FormAprobacionManual.vue";
import FormDatosAfectado from "src/components/comunicacion/radicacion/FormDatosAfectado.vue";
import FormCopyExternaManualDestinatarios from "src/components/comunicacion/radicacion/FormCopyExternaManualDestinatarios.vue";
import TableDestinatarios from "src/components/comunicacion/Table.vue";
import { toast } from "src/helpers/toast";
import { useAuthStore } from "src/stores/auth.store";
import { sgdeaAxios } from "../../services/index";
import { useRouter } from "vue-router";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import InterrogationModal from "src/assets/interrogation-modal.svg";
import FormCopyInternaManualDestinatarios from "src/components/comunicacion/radicacion/FormCopyInternaManualDestinatarios.vue";
import ComponentTitle from "src/components/ComponentTitle/ComponentTitle.vue";
import FileLoader from "src/components/FormFields/FileLoader.vue";

let formData;

const modalSendAprobar = ref(false);
const router = useRouter();
const auth = useAuthStore();
const idRadicacion = ref();
const nodeId = ref();
const idComManual = ref();
const myForm0 = ref(null);
const myForm1 = ref(null);
const myForm2 = ref(null);
const showSuccessModal = ref(false);
const aprobador = ref(null);
const isFormResetExterno = ref(0);
const isFormResetInterno = ref(0);
const bodyCopyExterna = ref([]);
const bodyCopyInterna = ref([]);
const step = ref(0);
const tipoComunicacionOptions = ref([]);
const copiesTypesOptions = ref([]);
const tipoDocumentoOptions = ref([]);
const tipoGestionList = ref([]);
const validStep = ref(false);
const files = ref([])
const isMemorando = ref(false);

const formRefs = {
  myForm0: myForm0,
  myForm1: myForm1,
  myForm2: myForm2,
};

const form0 = ref({
  comUsuarioCreadorId: auth.$state.userInfo.userid,
  comNombre: "",
  comTipoComunicacionId: "",
  comTipoGestion: null,
  shippingMethodCopyInterna: "",
  officeType: "",
  nameDestinatary: "",
  cargo: "",
  addressRecipientCopyInterna: "",
  countryRecipientCopyInterna: { label: "Colombia", value: 425 },
  departmentRecipientCopyInterna: "",
  municipalityRecipientCopyInterna: "",
  emailRecipientCopyInterna: "",
  telephoneRecipientCopyInterna: "",

  shippingMethodCopyExterna: "",
  nombreDestinatarioExterna: "",
  tipoDocDestinatario: "",
  numDocDestinatario: "",
  addressRecipientCopyExterna: "",
  countryRecipientCopyExterna: { label: "Colombia", value: 425 },
  departmentRecipientCopyExterna: "",
  municipalityRecipientCopyExterna: "",
  emailRecipientCopyExterna: "",
  telephoneRecipientCopyExterna: null,
});

const form1 = ref({
  datosSalidaAnexos: "",
  asunto: "",
  comTipoComunicacionIdAfectado: "",
  comNumeroAfectado: "",
  comNombreAfectado: "",
});

const dictionaryFormValue = {
  myForm0: form0,
  myForm2: form1,
};

const nextStep = async (sp) => {
  const formName = `myForm${sp}`;
  const isValidForm = await formRefs[formName]?.value.validate();

  if (formName === "myForm1") {
    const tipoComunicacion = form0.value.comTipoComunicacionId === 1 ? 1 : 2;
    isMemorando.value = tipoComunicacion === 1 ? true : false;
  }

  if (isValidForm) {
    buildFormData(formName);
    validStep.value = true;
    if (sp === 1) {
      try {
        const { data } = await submitFormData();
        toast.success(objResponse.formulario_valido);

        idRadicacion.value = data.preRadicado;
        nodeId.value = data.nodeId;
        idComManual.value = data.id;
        await crearTrazabilidad({
          proceso: `PRE${idComManual.value}`,
          secuencia: idRadicacion.value,
          estado: "CREADA",
          descripcion: `Usuario:${useAuthStore().$state.userInfo.name} Rol:${useAuthStore().$state.userInfo.role} Descripción: Se ha Creado la comunicación manual`,
          comentario: "Radicación",
          nombre: useAuthStore().$state.userInfo.name,
          tramite: "Comunicación Manual",
          accion: `${useAuthStore().$state.userInfo.name} genero la comunicación manual ${idRadicacion.value}`,
        });
        showSuccessModal.value = true;
      } catch (error) {
        toast.error(objResponse.default_error);
        return;
      }
    }
    if (sp === 2) {
      if (!aprobador.value) {
        toast.error(objResponse.aprobador_vacio);
        return;
      }

      modalSendAprobar.value = true;
      return;
    }
    step.value++;
  } else {
    toast.error(objResponse.campos_obligatorios);
  }
};

const handleSubmitAsignarAprobador = async () => {
  try {

    await submitAsignarAprobador();
    const aprobadores = await Promise.all(
      aprobadoresList.value.map(item =>
       sgdeaAxios.get(`/usuarios/${item}`)
      )
    );

    const nombresAprobadores = aprobadores.map(user => user.data.fullname).join(", ");

    toast.success("El aprobador ha sido asignado");
    await crearTrazabilidad({
      proceso: `PRE${idComManual.value}`,
      secuencia: idRadicacion.value,
      estado: "ASIGNADA",
      descripcion: `Usuario: ${useAuthStore().$state.userInfo.name} Aprobadores: ${nombresAprobadores } Detalle: Se ha asignado el aprobador de la comunicación`,
      comentario: "Asignación",
      nombre: useAuthStore().$state.userInfo.name,
      tramite: "Comunicación Manual",
      accion: `${useAuthStore().$state.userInfo.name} ha asignado el aprobador de la comunicación manual ${idRadicacion.value}`,
    });
    router.push("/correspondencia/bandeja-manual");
  } catch (error) {
    toast.error(objResponse.default_error);
    return;
  }
};

onMounted(async () => {
  const {
    getTypesCommunicationOptions,
    getCopiesTypesOptions,
    getTipoDocumentoOptions,
    getListadoGestionOptions,
  } = useCrearComunicacionesLogic();

  const promises = [
    getTypesCommunicationOptions(),
    getCopiesTypesOptions(),
    getTipoDocumentoOptions(),
    getListadoGestionOptions(),
  ];
  const [
    tipoComunicacionResponse,
    copiesTypesResponse,
    tipoDocumentoResponse,
    tipoGestionResponse,
  ] = await Promise.allSettled(promises);

  tipoComunicacionOptions.value = tipoComunicacionResponse?.value;
  copiesTypesOptions.value = copiesTypesResponse?.value;
  tipoDocumentoOptions.value = tipoDocumentoResponse?.value;
  tipoGestionList.value = tipoGestionResponse?.value.filter(
    (item) => item.value
  );
});

const validateIfFormHasUser = (form) => {
  const hasUser = bodyCopyInterna.value.find(
    (user) =>
      user.nombre_label === form.nombre_label &&
      user.dependencia_label === form.dependencia_label
  );

  return !!hasUser;
};
const validateIfFormHasUserExterno = (form) => {

  const hasUser = bodyCopyExterna.value.find(
    (user) => user.nombre === form.manualExternoNombreDestinatario
  );

  return !!hasUser;
};

const handleClickAddNewDestinaryExterno = (formExitDataCopyExterno) => {
  const mapTypeCopyValue = "externo";
  if (validateIfFormHasUserExterno(formExitDataCopyExterno)) {
    toast.error(objResponse.usuario_repetido);
    return;
  }
  bodyCopyExterna.value = [
    ...bodyCopyExterna.value,
    mapFormDataToDestinataires(formExitDataCopyExterno, mapTypeCopyValue),
  ];
  isFormResetExterno.value = isFormResetExterno.value + 1;
};

const handleClickAddNewDestinaryInterno = (formExitDataCopyInterno) => {
  const mapTypeCopyValue = "interno";
  if (validateIfFormHasUser(formExitDataCopyInterno)) {
    toast.error(objResponse.usuario_repetido);
    return;
  }
  bodyCopyInterna.value = [
    ...bodyCopyInterna.value,
    mapFormDataToDestinataires(formExitDataCopyInterno, mapTypeCopyValue),
  ];
  isFormResetInterno.value = isFormResetInterno.value + 1;
};

const buildFormDataListDestinatarios = (type) => {


  if (type === dictionaryTypeCopy[1]) {
    const internalData = bodyCopyInterna.value.map(
      ({ dependencia, nombre }) => {
        return {
          id: isFormResetInterno.value,
          dependenciaId: {
            idSeccionSubSeccion: dependencia,
          },
          nombreFuncionarioId: {
            id: nombre.value,
          },
        };
      }
    );
    return { internalData };
  }

  if (type === dictionaryTypeCopy[2]) {
    const internalData = bodyCopyInterna.value.map(
      ({ dependencia, nombre }) => {
        return {
          id: isFormResetInterno.value,
          dependenciaId: {
            idSeccionSubSeccion: dependencia,
          },
          nombreFuncionarioId: {
            id: nombre.value,
          },
        };
      }
    );

    const externalData = bodyCopyExterna.value.map(
      ({
        forma,
        tipo,
        nombre,
        direccion,
        pais,
        departamento,
        municipio,
        telefonoDestinatario,
        correoElectronico,
        numero,
      }) => {
        const result = {
          id: isFormResetExterno.value,
          formaEnvioId: { id: forma },
          tipoDocumentoDestinatarioId: { id: tipo },
          nombreDestinatario: nombre,
          direccionDestinatario: direccion,
          paisDestinatarioId: { idPais: pais.value },
          telefonoDestinatario: telefonoDestinatario.toString(),
          correoElectronico,
          numeroDocumentoDestinatario: numero.toString(),
        };

        if (departamento !== "") {
          result.departamentoDestinatarioId = {
            idDepartamento: pais.value == 425 ? departamento : null,
          };
        }

        if (municipio !== "") {
          result.municipioDestinatarioId = {
            idMunicipio: pais.value == 425 ? municipio : null,
          };
        }

        return result;
      }
    );

    return { internalData, externalData };
  }
};

const buildArrayDestinatarios = (type) => {
  if (type === dictionaryTypeCopy[1]) {
    return ["copiasInternaList"];
  }

  if (type === dictionaryTypeCopy[2]) {
    return ["copiasExternaList", "copiasInternaList"];
  }
};

const buildObjectDestinatarios = () => {
  if (form0.value.comTipoComunicacionId === 1) {
    return (() => {
      const result = {
        dependencias: {
          idSeccionSubSeccion: form0.value?.officeType,
        },
        nombreFuncionario: form0.value?.nameDestinatary,
        correoDestinatario: form0.value.emailRecipientCopyInterna,
        cargo: form0.value.cargo.id,
        formaEnvio: {
          id: form0.value.shippingMethodCopyInterna,
        },
        pais: {
          idPais: form0.value.countryRecipientCopyInterna.value,
        },
        telefonoDestinatario: form0.value.telephoneRecipientCopyInterna,
      };
      if (form0.value.departmentRecipientCopyInterna) {
        result.departamento = {
          idDepartamento:
            form0.value.countryRecipientCopyInterna.value == 425
              ? form0.value.departmentRecipientCopyInterna
              : null,
        };
      }
      if (form0.value.municipalityRecipientCopyInterna) {
        result.municipio = {
          idMunicipio:
            form0.value.countryRecipientCopyInterna.value == 425
              ? form0.value.municipalityRecipientCopyInterna
              : null,
        };
      }

      return result;
    })();
  }

  return (() => {
    const result = {
      formaEnvio: {
        id: form0.value.shippingMethodCopyExterna,
      },
      tipoDocumentoDestinatario: {
        id: form0.value.tipoDocDestinatario,
      },
      numeroDocumentoDestinatario: form0.value.numDocDestinatario,
      nombreDestinatario: form0.value.nombreDestinatarioExterna,
      direccionDestinatario: form0.value.addressRecipientCopyExterna,
      pais: {
        idPais: form0.value.countryRecipientCopyExterna.value,
      },
      telefonoDestinatario: form0.value.telephoneRecipientCopyExterna,
      correoDestinatario: form0.value.emailRecipientCopyExterna,
    };
    if (form0.value.departmentRecipientCopyExterna !== "") {
      result.departamento = {
        idDepartamento:
          form0.value.countryRecipientCopyExterna.value == 425
            ? form0.value.departmentRecipientCopyExterna
            : null,
      };
    }

    if (form0.value.municipalityRecipientCopyExterna !== "") {
      result.municipio = {
        idMunicipio:
          form0.value.countryRecipientCopyExterna.value == 425
            ? form0.value.municipalityRecipientCopyExterna
            : null,
      };
    }
    return result;
  })();
};

const buildComunicacionManual = () => {
  return {
    anexos: form1.value.datosSalidaAnexos,
    asunto: form1.value.asunto,
    tipoDocumentoAfectadoId: {
      id: form1.value.comTipoComunicacionIdAfectado,
    },
    numeroDocumentoAfectado: form1.value.comNumeroAfectado,
    nombreAfectado: form1.value.comNombreAfectado,
  };
};

const buildFormData = (formName) => {
  let value;

  if (!formData) {
    formData = new FormData();
  }

  if (formName === "myForm0") {
    const key =
      form0.value.comTipoComunicacionId == 1
        ? "destinatarioINT"
        : "destinatarioEXT";
    value = buildObjectDestinatarios();

    if (formData.has(key)) {
      formData.delete(key);
    }
    if (value && !formData.has(key)) {

      formData.append(key, JSON.stringify(value));
    }
  }

  if (formName === "myForm1") {
    const tipoComunicacion = form0.value.comTipoComunicacionId === 1 ? 1 : 2;
    const keys = buildArrayDestinatarios(dictionaryTypeCopy[tipoComunicacion]);

    keys.map((key) => {

      const { internalData, externalData } = buildFormDataListDestinatarios(
        dictionaryTypeCopy[tipoComunicacion]
      );

      let value = null;
      if (key === "copiasInternaList") {
        value = internalData;
      } else if (key === "copiasExternaList") {
        value = externalData;
      } else {
      }
      if (formData.has(key)) {
        formData.delete(key);
      }
      if (value && !formData.has(key)) {
        formData.append(key, JSON.stringify(value));
      }
    });

    const key = "comunicacionManualDG";
    value = buildComunicacionManual();
    if (formData.has(key)) {
      formData.delete(key);
    }
    if (value && !formData.has(key)) {

      formData.append(key, JSON.stringify(value));
    }
  }

  if (mapFormData[formName]) {
    // Se recorren todas las claves del objeto 'mapFormData' correspondiente al formulario
    Object.keys(mapFormData[formName]).forEach((key) => {
      // primero obtenemos el valor del nombre del formulario del diccionario 'dictionaryFormValue' que almacena los valores formulario del template
      const formKeyValue = dictionaryFormValue[formName];
      // Luego obtenemos el valor del formulario con la clave que se encuentra en el diccionario 'mapFormData'
      value = formKeyValue.value[mapFormData[formName][key]];
      if (dataObjectSend.includes(key)) {
        value = { id: value };
      }
      // Si el usuario edita vamos a borrar el valor en el formData para evitar duplicados
      if (formData.has(key)) {
        formData.delete(key);
      }
      if (value && !formData.has(key)) {

        formData.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : value
        );
      }
    });
  }
};

function onlyNumeric(event: {
  which: any;
  keyCode: any;
  preventDefault: () => void;
}) {
  let charCode = event.which ? event.which : event.keyCode;
  let charTyped = String.fromCharCode(charCode);
  let regex = /^[0-9]*$/;
  if (regex.test(charTyped)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}


async function uploadFile(id) {
  const formdata = new FormData();

  for (let i = 0; i < files.value.length; i++) {
    formdata.append("files", files.value[i]);

  }

const tipoDocumento= "PRE_RADICADO"
  try {

    const response = await sgdeaAxios.post(
      `correspondencia/comunicacionManual/documentos/${id}?user=${auth.$state.userInfo.userid}&tipoDocumento=${tipoDocumento}`,
      formdata
    );
  } catch (error) {
    let errorMessage = error.response?.data?.message || 'Ha ocurrido un error';

  }
}

const submitFormData = async () => {
  let objectToSend = {};

  formData.forEach((value, key) => {
    try {
      objectToSend[key] = JSON.parse(value);

    } catch (error) {
      objectToSend[key] = value;
    }
  });
  const payload = await sgdeaAxios.post(
    "correspondencia/comunicacionManual/crear",
    objectToSend
  );

  const idRad=payload.data.id

await  uploadFile(idRad)
return payload;
};

const submitAsignarAprobador = async () => {
  return await sgdeaAxios.put(
    `correspondencia/comunicacionManual/aprobar/${idComManual.value}?aprobadorId=${aprobador.value}`
  );
};
const aprobadoresList = ref([])
const handleItemSeleted = (val) => {
  aprobador.value = val[0];
  aprobadoresList.value =val
};

const rejectedFiles = (error) => {
  if (error.some((it) => it.failedPropValidation === "max-file-size")) {
    toast.error("El peso permitido es hasta 8MB.");
  }
  if (error.some((it) => it.failedPropValidation === "max-files")) {
    toast.error("Solo se pueden adjuntar 30 archivos.");
  }
  if (error.some((it) => it.failedPropValidation === 'accept')) {
    toast.error('Formato inválido, los formatos permitidos son (pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg).')
  }
};
</script>
