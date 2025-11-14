<template>
  <q-form ref="myForm2">
    <q-card class="tw-rounded-xl q-pa-lg" flat greedy>
      <div class="col row">
        <p class="tw-text-2xl tw-font-bold">Solicitud</p>
      </div>
      <div class="tw-mt-2">
        <div class="row q-col-gutter-md q-pb-md q-px-md">
          <div class="flex tw-items-center col-xs-12 col-sm-12 col-md-12 col-lg-12 tw-text-label">
            <q-checkbox v-model="checkDatosRemitente" />
            <p class="tw-mt-1">¿La presente solicitud se relaciona con una comunicación o solicitud que realizó Positiva
              previamente?</p>
          </div>
          <div v-if="checkDatosRemitente" class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Número de radicado relacionado *</span>
              <q-select :options="filteredRadicados" v-model="form2.numeroRadicadoRelacionado" dense label="Inserte"
                outlined class="tw-rounded-lg" :rules="[inputRequired, v => maxLengthInput(100, v)]" use-input
                map-options fill-input hide-selected @filter="filterRadicados">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section>
                      El radicado no existe
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </label>
          </div>

          <div :class="checkDatosRemitente ? 'col-xs-6 col-6' : 'col-xs-12 col-6'">
            <label class="tw-w-full">
              <span class="tw-text-label">Tipo de Trámite *</span>
              <q-select v-model="form2.tipoTramite" label="Seleccione" dense outlined class="tw-rounded-lg" map-options
                emit-value :rules="[inputRequired]" disable>
              </q-select>
            </label>
          </div>
          <div v-if="props.firstForm.canal === 2 && props.firstForm.tipoRemitente === 1"
            class="col-12 tw-text-label tw-mt-[-20px]">
            <div class="flex items-center">
              <q-checkbox v-model="form2.constanciaEstado" @update:model-value="onCheckboxChange" />
              <p class="tw-ml-2">Tratamiento de datos personales</p>
            </div>
            <span v-if="!form2.constanciaEstado" class="tw-text-[#c10015] tw-text-xs tw-pl-2">
              Este campo es requerido
            </span>
          </div>
          <div v-else class="flex tw-items-center col-xs-12 col-sm-12 col-md-12 col-lg-12 tw-text-label tw-mt-[-20px]">
            <q-checkbox v-model="form2.constanciaEstado" />
            <p>Tratamiento de datos personales</p>
          </div>

          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Tipo de evento *</span> <br>
              <q-radio v-model="form2.tipoEvento" val="1" label="Accidente" :disable="disabledInputs" />
              <q-radio v-model="form2.tipoEvento" val="2" label="Enfermedad" :disable="disabledInputs" />
            </label>
            <br>
            <span v-if="!form2.tipoEvento" class="tw-text-[#c10015] tw-text-xs tw-pl-3">Este campo es requerido</span>
          </div>

          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Número de siniestro *</span>
              <q-select :options="listadoSiniestros" v-model="form2.numeroSiniestro" map-options emit-value
                label="Seleccione" dense outlined class="tw-rounded-lg" :rules="[inputRequired]">
              </q-select>
            </label>
          </div>

          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Tipo de solicitud *</span>
              <q-select :options="listadoSolicitud" v-model="form2.tipoSolicitud" map-options emit-value
                label="Seleccione" dense outlined class="tw-rounded-lg" :rules="[inputRequired]"
                :disable="disabledInputs">
              </q-select>
            </label>
          </div>

          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Constancia de ejecutoriedad *</span>
              <q-select v-model="form2.constanciaEjecutoriedad" label="Seleccione" dense outlined class="tw-rounded-lg"
                map-options emit-value :options="optionsContancia" :rules="[inputRequired]"
                :disable="Number(props.firstForm.canal) !== 1 || Number(form2.tipoSolicitud) !== 5 || disabledInputs">
              </q-select>
            </label>
          </div>

          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Fecha de dictamen de la Junta Regional de Calificación *</span>
              <Datepicker mask="DD/MM/YYYY" label="dd / mm / aaaa"
                :disable="Number(props.firstForm.canal) !== 1 || Number(form2.tipoSolicitud) !== 5 || disabledInputs || !form2.constanciaEjecutoriedad"
                v-model:input-data-prop="form2.fechaDictamenJuntaRegional" :rules="[inputRequired, validationDate]" />
            </label>
          </div>

          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Oficina *</span>
              <q-select ref="refOfi" :options="listadoOficinas" v-model="form2.oficina" label="Seleccione" dense
                outlined map-options emit-value class="tw-rounded-lg" :rules="[inputRequired]"
                :disable="disabledInputs || Number(props.firstForm.canal) !== 1 || disabledOfi">
              </q-select>
            </label>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <label class="tw-w-full">
              <span class="tw-text-label">Descripción * ({{ form2.descripcion?.length }}/10000)
              </span>
              <q-input v-model="form2.descripcion" type="textarea" dense label="Inserte" outlined class="tw-rounded-lg"
                :rules="[inputRequired, v => maxLengthInput(10000, v)]" :disable="disabledInputs">
              </q-input>
            </label>
          </div>
        </div>
      </div>
    </q-card>
    <div class="tw-flex tw-justify-center tw-items-center tw-my-10 tw-gap-6">
      <q-btn label="Regresar" text-color="white" icon="chevron_left" style="width: 220px" color="primary"
        class="tw-rounded-xl tw-h-12 tw-p-2" @click="emit('prev-step')">
      </q-btn>
      <q-btn label="Cancelar" type="reset" style="width: 220px" text-color="black" color="accent"
        class="tw-rounded-xl tw-h-12" @click="emit('cancel')" />
      <q-btn label="Continuar" text-color="white" icon-right="navigate_next" style="width: 220px" color="primary"
        class="tw-rounded-xl tw-h-12 tw-p-2" @click="validateForms" />
    </div>
  </q-form>
  <ConfirmModal :show-modal="modalProcessingPersonal" :text-show-modal="dataModalProcessingPersonal.textShow"
    :text-confirm-modal="dataModalProcessingPersonal.textConfirm"
    :text-cancel-modal="dataModalProcessingPersonal.textCancel" :text-links="dataModalProcessingPersonal.textLinks"
    @on-action-click="handleOnActionClick" @update:show-modal="openSubmitModal = false" />
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { inputRequired, maxLengthInput, onlyNumbers } from 'src/helpers/validations';
import Datepicker from 'components/FormFields/datePickerComponent.vue';
import { toast } from 'src/helpers/toast';
import moment from 'moment';
import { sgdeaAxios } from 'src/services';
import ConfirmModal from "components/Modal/ConfirmModal.vue";
import { getAcronimobyId } from 'src/helpers/prefijoTipoDoc';

type FormDataType2 = {
  numeroRadicadoRelacionado: string;
  tipoTramite: any;
  tipoEvento: any;
  numeroSiniestro: string;
  constanciaEjecutoriedad: string;
  constanciaEstado: boolean;
  fechaDictamenJuntaRegional: string;
  tipoSolicitud: string;
  oficina: string;
  descripcion: string
};

const form2 = ref<FormDataType2>({
  numeroRadicadoRelacionado: "",
  tipoTramite: "Medicina laboral",
  tipoEvento: "",
  numeroSiniestro: "",
  constanciaEjecutoriedad: '',
  constanciaEstado: false,
  fechaDictamenJuntaRegional: "",
  tipoSolicitud: "",
  oficina: "",
  descripcion: "",
});

const props = withDefaults(
  defineProps<{
    listadoSolicitud: [],
    listadoOficinas: [],
    listadoRadicados: [],
    firstForm: {
      canal: '',
      tipoRemitente: '',
      tipoDocumentoRemitente: '',
      numeroDocumentoRemitente: '',
      nombreRemitente: '',
      pais: '',
      departamento: '',
      municipio: '',
      direccionRemitente: '',
      telefono: '',
      correoRemitente: '',
      medioAutorizadorParaRespuesta: '',
      constanciaEstado: false,
    },
    secondForm: any;
  }>(), {}
)

const refOfi = ref()
const optionsContancia = ref([
  { label: "Si", value: true },
  { label: "No", value: false },
])

const emit = defineEmits(['cancel', 'next-step', 'prev-step'])
const myForm2 = ref<HTMLFormElement>(null);
const checkDatosRemitente = ref(false)
const filteredRadicados = ref()
const disabledInputs = ref(false)
const disabledOfi = ref(false)

onMounted(() => {
  if (Number(props.firstForm.canal) !== 1) {
    // @ts-expect-error
    form2.value.oficina = props.listadoOficinas.find((e) => { return e.value === 13 })
    form2.value.constanciaEjecutoriedad = null
    form2.value.fechaDictamenJuntaRegional = null
    myForm2.value.reset()
  }
  loadSiniestros();
})
const modalProcessingPersonal = ref(false)
const dataModalProcessingPersonal = {
  textConfirm: "Sí",
  textCancel: "No",
  textShow: "¿Autoriza usted el tratamiento de sus datos personales y sensibles?",
  textLinks: [
    {
      description: 'Recuerde que puede ver la política de datos personales en la: ',
      text: 'Página Web Positiva',
      url: 'https://www.positiva.gov.co/'
    },
    {
      description: 'Declaro que Positiva Compañía de Seguros S.A. (la “Compañía”) me ha informado que el Aviso de Privacidad y el manual de tratamiento de Datos Personales se encuentra publicado en ',
      text: 'Este enlace (click aquí)',
      url: 'https://www.positiva.gov.co/documents/2978451/3178155/EST_2_1_MA03+Manual+pol%C3%ADticas+y+procedimientos+para+la+proteccion+de+datos+personales.pdf/19528617-713b-a560-630a-e9f001844ad1?t=1698976876163'
    }
  ]
};
const validateForms = async () => {
  const isFormValid = await myForm2.value?.validate?.();
  const hasEventType = !!form2.value?.tipoEvento;

  const requiresProof =
    props.firstForm.canal === 2 && props.firstForm.tipoRemitente === 1;
const hasProofOfStatus = !requiresProof || form2.value?.constanciaEstado === true;
  if (isFormValid && hasEventType && hasProofOfStatus) {
    emit("next-step", form2.value);
  } else {
    toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos')
  }
};

const filterRadicados = async (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredRadicados.value = props.listadoRadicados
    })
    return
  }

  const response = await sgdeaAxios.get("/medicina/radicados", {
    params: { palabra: val, page: 0, size: 5 }
  })

  const listadoRad = response.data.content.map((e: any) => {
    return {
      label: e,
      value: e
    }
  })

  update(() => {
    filteredRadicados.value = listadoRad.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};
const toggleProcessingPersonalModal = () => {
  modalProcessingPersonal.value = !modalProcessingPersonal.value;
};
const onCheckboxChange = (newVal) => {
  if (newVal === true) {
    toggleProcessingPersonalModal()
  }
  form2.value.constanciaEstado = newVal;
};
const handleOnActionClick = (typeOnActionClick: string) => {
  if (typeOnActionClick === 'confirm') {
    toggleProcessingPersonalModal();
  } else if (typeOnActionClick === 'cancel') {
    form2.value.constanciaEstado = false;
    toggleProcessingPersonalModal();
  } else {
    toggleProcessingPersonalModal()
  }
};
watch(() => checkDatosRemitente.value, (newValue) => {
  if (newValue) {
    disabledInputs.value = true
  } else {
    form2.value.numeroRadicadoRelacionado = ''
    disabledInputs.value = false
  }
})

watch(() => form2.value.numeroRadicadoRelacionado, () => {
  disabledInputs.value = false
})

watch(() => props.firstForm.canal, (value) => {
  if (Number(value) !== 1) {
    // @ts-expect-error
    form2.value.oficina = props.listadoOficinas.find((e) => { return e.value === 13 })
  } else {
    form2.value.oficina = ''
  }
})

watch(() => form2.value.tipoSolicitud, (value) => {
  if (Number(value) !== 5) {
    form2.value.constanciaEjecutoriedad = null
    form2.value.fechaDictamenJuntaRegional = null
  }
})

watch(() => form2.value.constanciaEjecutoriedad, (val) => {
  if (val && Number(props.firstForm.canal) == 1) {
    // @ts-expect-error
    form2.value.oficina = { label: 'Grupo JRC Automática', value: 14 }
    disabledOfi.value = true
  } else if (!val && Number(props.firstForm.canal) == 1) {
    disabledOfi.value = false
    form2.value.oficina = ''
    myForm2.value.reset()
  }
})

const validationDate = (val) => {
  if (moment(val, 'DD/MM/YYYY').isAfter(moment(), 'day')) {
    return "No se aceptan fechas superiores a la fecha actual";
  }
  return true;
};

const listadoSiniestros = ref();

const loadSiniestros = async () => {
  const tipoDoc = getAcronimobyId(Number(props.secondForm.tipoDocumentoAfectado));
  try {
    const response = await sgdeaAxios.get(`/personas?tipoDocumento=${tipoDoc}&numeroDocumento=${props.secondForm.numeroDocumentoAfectado}`);

    listadoSiniestros.value = Array.isArray(response.data.siniestros) && response.data.siniestros !== null
      ? response.data.siniestros.map((siniestro: any) => siniestro.idSiniestro)
      : [];
    listadoSiniestros.value = [
      ...listadoSiniestros.value,
      'No aplica',
    ]
  } catch (error) {
    console.error("Error loading siniestros:", error);
     listadoSiniestros.value = ['No aplica']
  }
};

</script>
