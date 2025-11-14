<template>
  <div class="[&>*]:tw-mb-4">
    <section>
      <q-form ref="formMetadatos" greedy>
        <q-card bordered class="tw-rounded-xl tw-mt-4" flat>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
                  Metadatos
                </h3>
              </div>
            </template>
            <div class="tw-bg-white tw-p-4" style="border-radius: 5px">
              <div class="row tw-p-2">
                <div class="col-sm tw-p-2">
                  <p class="tw-text-label tw-font-bold">Tipo de documento del afectado *</p>
                  <q-select v-model="formData.tipoDoc" :disable="props.isDisabled" :options="tipoDoc" :rules="[inputRequired]"
                            class="tw-rounded-lg" dense label="Seleccione" map-options outlined
                            @blur="handleChanges">
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
                  <p class="tw-text-label tw-font-bold">Documento del afectado *</p>
                  <q-input v-model="formData.numeroDoc"
                           :disable="props.isDisabled"
                           :rules="[inputRequired, (v) => maxLengthInput(15, v), Number(formData.tipoDoc.value) === 11 ? alphanumeric2 : (v: string) => onlyNumbers(v)]" class="tw-rounded-lg" dense label="Seleccione"
                           outlined
                           @change="handleChanges" @keypress="Number(formData.tipoDoc) == 11 ? alphanumeric2 : onlyNumbers"/>
                </div>
                <div class="col-sm-12 tw-p-2 tw-text-label tw-font-bold">
                  <p>Nombre del afectado *</p>
                  <q-input v-model="formData.nombre"
                           :disable="props.isDisabled"
                           :rules="[inputRequired, v => maxLengthInput(200, v), alphabeticalWithSpecialCharacters]"
                           class="tw-rounded-lg" dense label="Inserte" outlined
                           @keypress="onlyAlphaNumeric"/>
                </div>
                <div class="col-sm-6 tw-p-2">
                  <p class="tw-text-label tw-font-bold">Siniestro *</p>
                  <q-select ref="refSiniestro" v-model="formData.siniestro" :disable="props.isDisabled"
                            :options="filteredSiniestros" :rules="[inputRequired]" class="tw-rounded-lg" dense fill-input hide-selected
                            label="Seleccione" map-options outlined use-input @filter="filterSiniestro">
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <div class="col-sm-6 tw-p-2">
                  <label class="tw-text-label">Fecha del siniestro {{ requiredSinisterDate ? '*' : '' }}</label>
                  <q-input v-model="formData.fechaSiniestro" :disable="!requiredSinisterDate || props.isDisabled" :rules="requiredSinisterDate ? [inputRequired] : null" class="tw-rounded-lg" dense
                           label="dd/mm/aaaa" outlined
                           readonly>
                    <template v-slot:prepend>
                      <q-icon class="cursor-pointer" name="event">
                        <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                          <q-date v-model="formData.fechaSiniestro" :options="optionsDateSiniestro" mask="DD/MM/YYYY">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup color="primary" flat label="Cerrar"/>
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-sm-6 tw-p-2">
                  <p class="tw-text-label tw-font-bold">Radicado Asociado</p>
                  <q-select v-model="formData.radicado" :disable="props.isDisabled" :options="loadRadicados" class="tw-rounded-lg" dense
                            emit-value label="Seleccione" map-options multiple outlined use-chips>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <div class="col-sm-6 tw-p-2">
                  <p class="tw-text-label tw-font-bold">Empresa del afectado *</p>
                  <q-input v-model="formData.empresa" :disable="props.isDisabled"
                           :rules="[inputRequired, (v) => maxLengthInput(200, v)]" class="tw-rounded-lg" dense label="Seleccione" outlined/>
                </div>
                <div class="col-sm-12 tw-p-2">
                  <p class="tw-text-label tw-font-bold">Compromisos próximos *</p>
                  <q-select v-model="formData.compromisosProximos" :disable="props.isDisabled"
                            :options="opCompromisosProximos" :rules="[inputRequired]" class="tw-rounded-lg" dense label="Seleccione" map-options
                            outlined/>
                </div>
              </div>
              <div class="col-sm-12 tw-px-4 tw-text-label tw-font-bold">
                <p>Observación</p>
                <q-input v-model="formData.observacion" :disable="formData?.compromisosProximos !== 'Si' && formData?.compromisosProximos?.label !== 'Si' || props.isDisabled"
                         :rules="[inputRequired, (v) => minLengthInput(10, v), (v) => maxLengthInput(10000, v)]" class="tw-rounded-lg"
                         dense
                         outlined placeholder="Inserte"
                         type="textarea"/>
              </div>

              <div class="row tw-p-2">
                <DynamicFields :alfanumFields="alfanumFields" :booleanFields="booleanFields" :listFields="listFields"
                               @updateValue="handleUpdateValue"/>
              </div>
            </div>
          </q-expansion-item>
        </q-card>
        <div class="justify-center tw-w-full tw-mt-4 tw-pb-6 tw-flex tw-gap-4">
          <q-btn :disable="props.isDisabled" class="tw-rounded-xl" color="accent" label="Cancelar"
                 style="width: 160px; height: 40px" text-color="black" @click="() => (showModal = true)"/>
          <q-btn :disable="props.isDisabled" class="tw-rounded-xl tw-btn tw-p-2" color="primary" label="Guardar" style="width: 160px; height: 40px"
                 text-color="white" @click="save"/>
        </div>
      </q-form>
    </section>
  </div>

  <Modal v-model:model-value="showModal" :is-success="false" cancel-button text="Al cancelar el proceso perderá los datos
    ingresados en el formulario, ¿desea realizar la acción?" text-button="Si" textButtonCancel="No"
         title="¡Espera un momento!" @handleAccept="emit('redirect')" @close-modal="() => (showModal = false)"/>
</template>

<script lang="ts" setup>
import {
  alphabeticalWithSpecialCharacters,
  inputRequired,
  maxLengthInput,
  minLengthInput,
  onlyAlphaNumeric,
  onlyNumbers,
  alphanumeric2
} from "src/helpers/validations";
import {onMounted, ref, watch} from "vue";
import {sgdeaAxios} from "../../../services";
import {toast} from 'src/helpers/toast';
import Modal from "../../../components/Modal/Modal.vue";
import {useAuthStore} from "src/stores/auth.store";
import {crearTrazabilidad} from "src/helpers/trazabilidad";
import {sortOptions} from "src/helpers/sortOptions";
import {Medicina} from "src/interfaces";
import DynamicFields from 'src/components/metadtos/DynamicFields/DynamicFields.vue'
import moment from "moment";
import { getAcronimobyId } from 'src/helpers/prefijoTipoDoc';

const props = withDefaults(defineProps<{
  data: Medicina,
  medicinaData: Medicina,
  isDisabled: boolean,
  metadatos: any
}>(), {})

const tipoDocEntity = {
  label: props.medicinaData.asignacion?.metaDatos?.tipoDocumentoAfectado?.nombre || props.medicinaData?.afectado?.tipoDocumento?.nombre,
  value: props.medicinaData.asignacion?.metaDatos?.tipoDocumentoAfectado?.id || props.medicinaData?.afectado?.tipoDocumento.id
}

const siniestroEntity = props.medicinaData?.solicitud?.siniestro?.siniestro;

const siniestroEntityFull = siniestroEntity

const siniestroEntityMetadatos = {
  label: props.medicinaData.asignacion.metaDatos?.siniestro?.siniestro,
  value: props.medicinaData.asignacion.metaDatos?.siniestro?.id
}

const emit = defineEmits(['successSave', 'redirect'])
const formMetadatos = ref()
const auth = useAuthStore()
const showModal = ref(false);
const listSiniestros = ref([])
const tipoDoc = ref()
const filteredSiniestros = ref()
const loadRadicados = ref()
const listFields = ref([]);
const alfanumFields = ref([])
const booleanFields = ref([])
const refSiniestro = ref()
const opCompromisosProximos = [
  {label: "Si", value: true},
  {label: "No", value: false},
]
const requiredSinisterDate = ref(false);
const formData = ref({
  tipoDoc: tipoDocEntity || '',
  numeroDoc: props.medicinaData.asignacion.metaDatos?.documentoAfectado || props.medicinaData?.afectado?.numeroDocumento,
  nombre: props.medicinaData.asignacion.metaDatos?.nombreAfectado || props.medicinaData?.afectado?.nombre,
  siniestro: siniestroEntityFull,
  // fechaSiniestro: moment(String(props.medicinaData.asignacion.metaDatos?.fechaSiniestro)).format('DD/MM/YYYY') || '',
  fechaSiniestro: props.medicinaData.asignacion.metaDatos?.fechaSiniestro
    ? moment(String(props.medicinaData.asignacion.metaDatos?.fechaSiniestro)).format('DD/MM/YYYY')
    : '',
  radicado: props.medicinaData.asignacion.metaDatos?.radicadoAsociado,
  empresa: props.medicinaData.asignacion.metaDatos?.empresaAfectado || '',
  compromisosProximos: props.medicinaData.asignacion.metaDatos?.compromisosProximos || '',
  observacion: props.medicinaData.asignacion.metaDatos?.observacion || '',
});

onMounted(async () => {
  await loadTipoDoc()
  await loadSiniestros(false)
  await allRadications(false)
  await filterListsMetadatos()
})

async function filterListsMetadatos() {
  listFields.value = await props.metadatos.filter(it => it.metadatoConOpciones?.metadato?.tipoDato?.id === 2)
  alfanumFields.value = await props.metadatos.filter(it => it.metadatoConOpciones?.metadato?.tipoDato?.id === 1)
  booleanFields.value = await props.metadatos.filter(it => it.metadatoConOpciones?.metadato?.tipoDato?.id === 3)
}

const handleUpdateValue = ({arr}) => {
}

const optionsDateSiniestro = (date) => {
  const fechaActual = moment().format('YYYY/MM/DD')
  return date <= fechaActual
}

async function loadTipoDoc() {
  try {
    const {data} = await sgdeaAxios.get("/correspondencia/comunicacion/listadoTipoIdentificacion");
    tipoDoc.value = data.map((val: any) => {
      return {
        label: val.nombre,
        value: val.id,
      };
    }).filter((e) => e.value !== 12)

    tipoDoc.value = sortOptions(tipoDoc.value).sort((a, b) => {
      if (a.value == 1) return -1; // "Cédula Ciudadanía" va primero
      if (b.value == 1) return 1;  // Si b es "Cédula Ciudadanía", va después

      if (a.value == 3) return -1; // "Carné Diplomático" va segundo
      if (b.value == 3) return 1;  // Si b es "Carné Diplomático", va después

      return 0;
    });
  } catch (error) {
    console.error(error)
  }
}

const dataSiniestro = ref();

async function loadSiniestros(clearData: boolean) {
  if (clearData) formData.value.siniestro = '';

  // @ts-expect-error
   const tipoDoc = getAcronimobyId(Number(formData.value.tipoDoc.value));

  try {
    const response = await sgdeaAxios.get(`/personas?tipoDocumento=${tipoDoc}&numeroDocumento=${formData.value.numeroDoc}`);

    // refSiniestro.value.resetValidation();

    if (response.status == 200 || response.status == 201) {
      dataSiniestro.value = response.data.siniestros || [];

      let selectedSiniestro = null;
      if (formData.value.siniestro) {
        selectedSiniestro =  dataSiniestro.value.find(s => s.idSiniestro == formData.value.siniestro);
        formData.value.fechaSiniestro = selectedSiniestro ? moment(selectedSiniestro.fechaAT).format('DD/MM/YYYY') : '';
        formData.value.empresa = selectedSiniestro ? selectedSiniestro.razonSocial : '';
      }

      listSiniestros.value = Array.isArray(response.data.siniestros)
        ? response.data.siniestros.map((siniestro: any) => siniestro.idSiniestro)
        : [];

      listSiniestros.value = [
        ...listSiniestros.value,
        'No aplica',
      ];
    }

  } catch (error) {
    console.error(error);
  }
}

const displayDate = ref('');

const updateDisplayDate = (val: string) => {
  if (val && moment(val, 'YYYY/MM/DD', true).isValid()) {
    displayDate.value = moment(val).format('DD/MM/YYYY');
  } else {
    displayDate.value = '';
  }
};

watch(() => formData.value.fechaSiniestro, (newVal) => {
  updateDisplayDate(newVal);
}, {immediate: true});

watch(() => formData.value.siniestro, (newVal) => {
  if (!formData.value.siniestro) {
    formData.value.siniestro = "No aplica";
  }

  if (newVal.value !== 1) {
    requiredSinisterDate.value = true;
  } else {
    formData.value.fechaSiniestro = null;
    requiredSinisterDate.value = false;
  }
}, {immediate: true});

async function allRadications(clearData: boolean) {
  if (props.data) {
    loadRadicados.value = [{label: props.data.solicitud.radicadoRelacionado, value: props.data.solicitud.radicadoRelacionado}]
  } else {
    // @ts-expect-error
    if (clearData) formData.value.radicado = []

    try {
      const response = await sgdeaAxios.get('/medicina/getAllRadicacion', {
        params: {
          // @ts-expect-error
          tipoDocumento: formData.value.tipoDoc.value,
          numeroDocumento: formData.value.numeroDoc
        }
      })

      loadRadicados.value = response.data.map((radicado: string) => {
        return {
          label: radicado,
          value: radicado
        }
      })

    } catch (error) {
      console.error(error)
    }
  }
}

const handleChanges = async () => {
  // @ts-expect-error
  await Promise.allSettled([
    loadSiniestros(true),
    allRadications(true)
  ])
}

watch(() => formData.value.compromisosProximos, (newVal) => {
  // @ts-expect-error
  if (newVal.label !== "Si" || newVal !== "Si") {
    formData.value.observacion = ''
  }
})

async function getApi(endpoint, params, action) {
  try {
    let method;
    switch (action.toLowerCase()) {
      case 'put':
        method = 'put';
        break;
    }
    const response = await sgdeaAxios[method](endpoint, params)
    return response
  } catch (error) {
    toast.error("Ha ocurrido un error")
  }
}

async function registerTraza(action) {
  await crearTrazabilidad({
    proceso: "ML" + props.medicinaData.id,
    secuencia: props.medicinaData.idRadicado,
    estado: props.medicinaData.estado.estado,
    descripcion: `Se han ${action} los metadatos de la radicación`,
    comentario: 'Adjunto',
    nombre: auth.$state.userInfo.name,
    accion: `${auth.$state.userInfo.name} ha ${action} los metadatos del radicado ${props.medicinaData.idRadicado}`,
    tramite: 'Medicina Laboral',
  })
}

async function save() {
  if (!(await formMetadatos.value.validate())) {
    toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos.")
    return;
  }

  let fechaSiniestro;
  if (formData.value.fechaSiniestro) {
    const arrayDate = formData.value.fechaSiniestro.split('/')
    fechaSiniestro = new Date(`${arrayDate[2]}/${arrayDate[1]}/${arrayDate[0]}`)
  } else {
    fechaSiniestro = null;
  }

  const response = await sgdeaAxios.put(`/medicina/crearMetadatosAsignacion/${props.medicinaData.id}`,
    {
      // @ts-expect-error
      tipoDocumentoAfectado: formData.value.tipoDoc.value,
      documentoAfectado: formData.value.numeroDoc,
      nombreAfectado: formData.value.nombre,
      // @ts-expect-error
      siniestro: formData.value.siniestro.value || formData.value.siniestro,
      radicadoAsociado: formData.value.radicado,
      empresaAfectado: formData.value.empresa,
      // @ts-expect-error
      compromisosProximos: formData.value.compromisosProximos?.label || formData.value.compromisosProximos,
      observacion: formData.value.observacion,
      fechaSiniestro,
      usuario: auth.$state.userInfo.name,
    }
  )

  if (response?.status === 200) {
    const action = 'actualizado'
    const message = 'actualizados'

    emit('successSave')
    toast.success(`Metadatos ${message} correctamente`)
  }
}

const filterSiniestro = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredSiniestros.value = listSiniestros.value
    })
    return
  }
  update(() => {
    filteredSiniestros.value = listSiniestros.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

watch(() => formData.value.siniestro, (newVal) => {
  if (newVal) {
    let selectedSiniestro = null;
    if (dataSiniestro.value && newVal) {
      selectedSiniestro =  dataSiniestro.value.find(s => s.idSiniestro == newVal);
      formData.value.fechaSiniestro = selectedSiniestro ? moment(selectedSiniestro.fechaAT).format('DD/MM/YYYY') : '';
      formData.value.empresa = selectedSiniestro ? selectedSiniestro.razonSocial : '';
    }
  }
}, {immediate: true})


</script>
