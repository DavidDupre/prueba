<template>
  <div>
    <div>
      <q-form ref="form" @submit.prevent="submit" class="[&>*]:tw-mb-4" greedy>
        <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
          <q-expansion-item label="Datos del Remitente" default-opened header-class="tw-text-lg tw-font-bold">
            <div class="tw-grid tw-grid-cols-4 tw-gap-x-4">

              <div class="tw-col-span-4">
                <p class="tw-text-label tw-font-semibold">Tipo de Remitente *</p>
                <q-select :options="listadoTipoRemitente" map-options emit-value outlined
                  v-model='formData.tipoRemitente' label="Seleccione" dense :rules="[rulesValidation]" />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Tipo de documento del remitente</p>
                <q-select :options="tipoDoc" map-options emit-value outlined v-model='formData.tipoDocumentoRemitente'
                  label="Seleccione" dense />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Número de documento del remitente</p>
                <q-input type="text" min="0" outlined v-model='formData.numeroDocumentoRemitente' label="Inserte" dense
                  :rules="[(v: string) => lengthValidation(15, v), Number(formData.tipoDocumentoRemitente) == 11 ? alphanumeric : (v: string) => onlyNumbers(v)]"
                  @keypress="Number(formData.tipoDocumentoRemitente) == 11 ? onlyAlphaNumeric : onlyNumbers"/>
              </div>
              <div class="tw-col-span-4">
                <p class="tw-text-label tw-font-semibold">Nombres del Remitente *</p>
                <q-input outlined v-model='formData.nombresRemitente' label="Inserte" dense
                  :rules="[(v: string) => lengthValidation(200, v), rulesValidation, alphabeticalWithSpecialCharacters]" @keypress="alphabeticalWithSpecialCharacters" />
              </div>
              <div class="tw-col-span-4">
                <q-checkbox v-model='formData.remitenteAfectado' class='tw-text-slate-600 tw-font-semibold tw-border tw-border-slate-300 tw-pl-3 tw-pr-6 tw-rounded-md'
                  label="Los datos del remitente son los mismos del afectado" dense size="md" />
              </div>
            </div>
          </q-expansion-item>
        </q-card>

        <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
          <q-expansion-item label="Datos del Afectado" default-opened header-class="tw-text-lg tw-font-bold">
            <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
              <p class="tw-col-span-6 tw-text-black tw-font-semibold tw-pb-2"
                v-if="Number(formData.canalEntrada) === 2">
                Recuerde que los
                datos del afectado son los relacionados a
                los de quien se solicita el requerimiento ante Positiva *</p>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Tipo Documento Afectado *</p>
                <q-select :options="tipoDoc" map-options emit-value :rules="[rulesValidation]" outlined
                  v-model='formData.tipoDocumentoAfectado' label="Seleccione" dense />
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Número de Documento Afectado *</p>
                <q-input type="text" min="0" outlined v-model='formData.numeroDocumentoAfectado' label="Inserte" dense
                  :rules="[(v: string) => lengthValidation(15, v), (v: string) => onlyNumbers(v), rulesValidation]"
                  @keypress="onlyNumber" />
              </div>
              <div class="tw-col-span-6">
                <p class="tw-text-label tw-font-semibold">Nombre del Afectado *</p>
                <q-input outlined v-model='formData.nombresAfectado' label="Inserte" dense
                  :rules="[(v: string) => lengthValidation(200, v), rulesValidation, alphabeticalWithSpecialCharacters]" @keypress="alphabeticalWithSpecialCharacters" />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">¿Pertenece a la comunidad LGBTIQ+? *</p>
                <q-select :options="[{ label: 'Si', value: true }, { label: 'No', value: false }]" map-options
                  emit-value outlined v-model='formData.lgtbtq' label="Seleccione" dense
                  :rules="[rulesValidation, (v: null) => v === null ? 'Este campo es requerido' : true]" />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Sexo *</p>
                <q-select :options="generoOptions" map-options emit-value outlined v-model='formData.sexo'
                  label="Seleccione" dense :rules="[rulesValidation]" />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Condición Especial *</p>
                <q-select :options="listadoCondiciones" outlined v-model='formData.listadoCondiciones'
                  :rules="[rulesValidation]" label="Seleccione" dense input-debounce="0" class="tw-rounded-lg">
                </q-select>
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
                <q-select :options="listadoCanalesRadicacion" map-options emit-value :rules="[rulesValidation]" outlined
                  v-model='formData.canalEntrada' label="Seleccione" dense />
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Correo Electrónico Afectado *</p>
                <q-input outlined v-model='formData.correoAfectado' label="Inserte" dense :rules="[rulesValidation, (v: string) => validationEmail(v), (v: string) => lengthValidation(200, v)
      ]" />
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Teléfono Celular</p>
                <q-input outlined min="0" v-model='formData.tlfCelularAfectado' label="Inserte" dense
                  :rules="[mobilePhonNumber, onlyNumbers]" type="text" @keypress="onlyNumber" />
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Teléfono Fijo</p>
                <q-input outlined min="0" v-model='formData.tlfFijoAfectado' label="Inserte" dense
                  :rules="[v => maxLengthInput(10, v), v => minLengthInput(7, v), onlyNumbers]" type="text" @keypress="onlyNumber" />
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">País *</p>
                <q-select :options='paiseOptions' map-options :rules="[rulesValidation]" outlined
                  v-model='formData.paisContacto' label="Seleccione" dense />
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Departamento *</p>
                <q-select :options='departamentoOptions' map-options :rules="[rulesValidation]" outlined
                  v-model='formData.departamentoContacto' label="Seleccione" dense :disable="isntColombia" />
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Municipio *</p>
                <q-select :options='municipioOptions' map-options :rules="[rulesValidation]" outlined
                  v-model='formData.ciudadContacto' label="Seleccione" dense :disable="isntColombia" />
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Dirección del Afectado </p>
                <!-- @vue-expect-error -->
                <q-input ref="direccionContactoInput" outlined v-model='formData.direccionContacto' label="Inserte"
                  dense :rules="(formData.medioRespuestaContacto == 2 || formData.direccionContacto || !formData.correoAfectado)
        ? [inputRequired, (v: string) => lengthValidation(100, v)]
        : [true]" @keypress="onlyAlphaNumeric" />
              </div>
              <div class="tw-col-span-6">
                <p class="tw-text-label tw-font-semibold">Medio que autoriza para envío de respuesta *</p>
                <q-select ref="medioRespuestaContactoSelect" :options="listadoMediosRespuestaOptions" map-options
                  emit-value
                  :rules="[rulesValidation, (v: number) => v === 1 && formData.correoAfectado === '' ?
        'Por favor diligencie correo electrónico del remitente para autorizar envío de respuesta por medio electrónico' : true,
        (v: number) => v === 2 && formData.direccionContacto === '' ?
          'Por favor diligencie dirección de remitente para autorizar envío de respuesta por este medio físico' : true]"
                  outlined v-model='formData.medioRespuestaContacto' label="Seleccione" dense />
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
                <q-select :options="filteredSolicitudes" :rules="[rulesValidation]" outlined map-options emit-value
                  v-model='formData.tipoSolicitud' label="Seleccione" dense @filter="solicitudOptionsFilterFn" use-input
                  fill-input hide-selected />
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Tipología de la PQRD *</p>
                <q-select
                  :options="Number(formData.canalEntrada) === 2 ? listadoTipologiaOptions2 : Number(formData.canalEntrada) === 3 ? listadoTipologiaOptions3 : listadoTipologiaOptions4"
                  map-options emit-value :rules="[rulesValidation]" outlined v-model='formData.tipologiaPQRD'
                  label="Seleccione" dense />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Producto *</p>
                <q-select :options="filteredProductos" map-options emit-value :rules="[rulesValidation]" outlined
                  v-model='formData.producto' label="Seleccione" dense @filter="productoOptionsFilterFn" use-input
                  fill-input hide-selected />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Acceso a Información Pública</p>
                <q-select :options="[{ label: 'Sí', value: true }, { label: 'No', value: false }]" map-options
                  emit-value outlined v-model='formData.accesopPublico' label="Seleccione" dense />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Descripción - Acceso a Información</p>
                <q-select :options="descripcionAcessInfoOptions" map-options emit-value
                  :disable="!formData.accesopPublico" :rules="[rulesValidation]" outlined
                  v-model='formData.descripcionAccesoInfo' label="Seleccione" dense />
              </div>
              <div class="tw-col-span-6" v-if="Number(formData.tipoSolicitud) === 14">
                <span class="tw-w-full">
                  <label class="tw-text-label tw-font-semibold">Asignar Oficina *</label>
                  <q-select v-model="formData.oficinas" map-options :options="filteredOficinas" label="Seleccione" dense
                    outlined class="tw-rounded-lg" :rules="[rulesValidation]" @filter="selectOptionsFilterFn" use-input
                    fill-input hide-selected>
                  </q-select>
                </span>
              </div>
              <div class="tw-col-span-6" v-if="Number(formData.tipoSolicitud) === 14">
                <p class="tw-text-label tw-font-semibold">Detalle *</p>
                <q-input type="textarea" :rules="[rulesValidation, (v: string) => lengthValidation(150, v)]" outlined
                  dense v-model:model-value="formData.solicitudDetalle" @keypress="onlyAlphaNumeric" />
              </div>
              <div class="tw-col-span-6 tw-mb-5">
                <p class="tw-text-label tw-font-semibold">Observaciones *</p>
                <q-input type="textarea" :rules="[rulesValidation, (v: string) => lengthValidation(1500, v)]" outlined
                  dense v-model:model-value="formData.observaciones" @keypress="onlyAlphaNumeric" />
              </div>

            </div>
          </q-expansion-item>
        </q-card>
      </q-form>
    </div>

    <div class="col col-12 row justify-center  tw-w-full tw-m-[10px] tw-mt-10 tw-flex tw-gap-4">
      <q-btn label="Cancelar" textColor="black" class=" tw-rounded-xl tw-p-3 tw-w-[200px]" outline
        @click="cancelModal = true" />
      <q-btn type="submit" label="Radicar" @click="submit" color="primary" textColor="white"
        class="tw-rounded-xl tw-w-[200px]" :loading="handleSubmitIsLoading" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import Exitoso from "../exitoso.vue";
import { onMounted, Ref, ref, watch } from 'vue';
import FileLoader from 'components/FormFields/FileLoader.vue';
import { adminAxios, intescoAxios, sgdeaAxios } from 'src/services';
import { useDepartments, useMunicipalities } from 'src/composables/useVersion';
import { toast } from "src/helpers/toast";
import { DocumentoRadicado, SelectInput } from "src/interfaces";
import Modal from "components/Modal/Modal.vue";
import {
  validationEmail,
  onlyNumbers,
  alphanumeric,
  inputRequired,
  minLengthInput,
  maxLengthInput,
  alphabeticalWithSpecialCharacters
} from "src/helpers/validations";
import { Notify, useQuasar } from "quasar";

interface InfoGeneralProps {
    data: any
}
const props = defineProps<InfoGeneralProps>();

interface PQRD {
  tipoRemitente: string;
  tipoDocumentoRemitente: string;
  numeroDocumentoRemitente: string;
  nombresRemitente: string;
  tipoDocumentoAfectado: string;
  numeroDocumentoAfectado: string;
  nombresAfectado: string;
  lgtbtq: boolean,
  sexo: string;
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
  canalEntrada: string;
  oficinas: string;
}

const handleSubmitIsLoading = ref<boolean>(false)

const formData: Ref<PQRD> = ref({
  tipoRemitente: '',
  tipoDocumentoRemitente: '',
  numeroDocumentoRemitente: '',
  nombresRemitente: '',
  tipoDocumentoAfectado: '',
  numeroDocumentoAfectado: '',
  nombresAfectado: '',
  lgtbtq: null,
  sexo: '',
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

const router = useRouter()
const form = ref()
const showModalVerification = ref(false)
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
const filteredOficinas = ref<SelectInput[]>([]);
const filteredSolicitudes = ref<SelectInput[]>([]);
const filteredProductos = ref<SelectInput[]>([]);
const responseId = ref('')
const correoAfectado = ref('')
const isntColombia = ref(false)
const cancelModal = ref(false)
const q = useQuasar();
const generatedDocId = ref<string | null>(null);
const MAX_FILE = 10
const medioRespuestaContactoSelect = ref(null)
const isMultiple = ref(true)
const direccionContactoInput = ref(null)
const fieldsToWatch = [
  'tipoDocumentoRemitente',
  'nombresRemitente',
  'numeroDocumentoRemitente',
];

onMounted(async () => {
  form.value = props.data
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
})

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
    }),
  ];

  formData.value.paisContacto = paiseOptions.value.find(val => val.value === 425)
}

async function loadDepartamentos() {
  const { data: formData } = await adminAxios.get("/departamentos/list");
  departamentoOptions.value = formData.map((val: any) => {
    return {
      label: val.nombre,
      value: val.idDepartamento,
    };
  });
}

async function loadMunicipios() {
  const { data: formData } = await adminAxios.get("/municipios/list");
  municipioOptions.value = formData.sort((a: { nombre: string; }, b: { nombre: string; }) => {
    const labelA = a.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim();
    const labelB = b.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim();

    return labelA.localeCompare(labelB, 'es-ES', { sensitivity: 'base' });
  }).map((val) => {
    return {
      label: val.nombre,
      value: val.id,
    };
  })
  // municipioOptions.value = formData.map((val: any) => {
  //   return {
  //     label: val.nombre,
  //     value: val.idDepartamento,
  //   };
  // });
}

async function loadGenero() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoGenero")

    if (response.status == 200 || response.status == 201) {
      generoOptions.value = response.data.sort((a: { nombre: string; id: number; }, b: { nombre: string; id: number; }) => {
        const labelA = a.nombre.toUpperCase();
        const labelB = b.nombre.toUpperCase();
        if (labelA < labelB) {
          return -1;
        }
        if (labelA > labelB) {
          return 1;
        }
        return 0;
      }).map((e: { nombre: string; id: number; }) => {
        return {
          label: e.nombre,
          value: e.id
        };
      });
    }

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
      })
    }

    formData.value.descripcionAccesoInfo = descripcionAcessInfoOptions.value[0].value;

  } catch (error) {
    console.error(error);
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
    console.error(error);
  }
}

async function loadListadoTipologia() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoTipologia")

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
      return e.value !== 7
    })

    listadoTipologiaOptions4.value = listadoTipologiaOptions.value.filter((e) => {
      return e.value !== 7 && e.value !== 8
    })

    sortOptions(listadoTipologiaOptions.value)
    sortOptions(listadoTipologiaOptions2.value)
    sortOptions(listadoTipologiaOptions3.value)
    sortOptions(listadoTipologiaOptions4.value)

  } catch (error) {
    console.error(error);
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
    console.error(error);
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

    listadoCondiciones.value = sortOptions(listadoCondiciones.value)

  } catch (error) {
    console.error(error);
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
      })
    }

    filteredProductos.value = listadoProductosPQRD.value

  } catch (error) {
    console.error(error);
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

    filteredSolicitudes.value = listadoTiposSolicitud.value

  } catch (error) {
    console.error(error);
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
      })
    }

    listadoCanalesRadicacion.value = listadoCanalesRadicacion.value.filter((e) => { return e.value !== 1 && e.value !== 4 })

  } catch (error) {
    console.error(error);
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

    listadoOficinas.value = listadoOficinas.value.filter((e) => { return e.value !== 26 })
    filteredOficinas.value = listadoOficinas.value

  } catch (error) {
    console.error(error);
  }
}

const selectOptionsFilterFn = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredOficinas.value = listadoOficinas.value
    })
    return
  }
  update(() => {
    filteredOficinas.value = listadoOficinas.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

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
  formData.value = {
    tipoRemitente: null,
    tipoDocumentoRemitente: '',
    numeroDocumentoRemitente: '',
    nombresRemitente: '',
    tipoDocumentoAfectado: '',
    numeroDocumentoAfectado: '',
    nombresAfectado: '',
    lgtbtq: false,
    sexo: '',
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

  // @ts-ignore
  router.go()
};


watch(
  () => formData.value.paisContacto,
  async (value) => {
    //@ts-ignore
    let val = value.label as unknown as string
    formData.value.departamentoContacto = ''
    formData.value.ciudadContacto = ''
    if (val.toLowerCase() == 'colombia') {
      isntColombia.value = false
      //@ts-ignore
      const { optionsDepartments } = await useDepartments(value.value);
      departamentoOptions.value = sortOptions(optionsDepartments.value);

    } else {
      // @ts-ignore
      formData.value.departamentoContacto = value
      // @ts-ignore
      formData.value.ciudadContacto = value
      isntColombia.value = true
    }

  }
);

watch(
  () => formData.value.departamentoContacto,
  async (value) => {
    //@ts-ignore
    if (!isntColombia.value) {
      formData.value.ciudadContacto = ''
    }

    //@ts-ignore
    const { optionsMunicipalities } = await useMunicipalities(value.value);
    municipioOptions.value = sortOptions(optionsMunicipalities.value)
  }
);

watch(
  () => formData.value.paisContacto,
  async (value) => {
    //@ts-ignore
    const { optionsDepartments } = await useDepartments(value.value);
    departamentoOptions.value = optionsDepartments.value;
  }
);

watch(
  () => fieldsToWatch.map(field => formData.value[field]),
  (newValues) => {
    if (formData.value.remitenteAfectado) {
      formData.value.tipoDocumentoAfectado = newValues[0];
      formData.value.nombresAfectado = newValues[1];
      formData.value.numeroDocumentoAfectado = newValues[2];
    }
  }
);

watch(() => formData.value.remitenteAfectado, async (value) => {
  if (value) {
    formData.value = {
      ...formData.value,
      tipoDocumentoAfectado: formData.value.tipoDocumentoRemitente,
      nombresAfectado: formData.value.nombresRemitente,
      numeroDocumentoAfectado: formData.value.numeroDocumentoRemitente
    }
  } else {
    formData.value = {
      ...formData.value,
      tipoDocumentoAfectado: '',
      nombresAfectado: '',
      numeroDocumentoAfectado: ''
    }
  }
})

watch(() => formData.value.correoAfectado, () => {
  if (formData.value.correoAfectado) {
    medioRespuestaContactoSelect.value.resetValidation();
    direccionContactoInput.value.resetValidation();
  }
});

watch(() => formData.value.direccionContacto, () => {
  if (formData.value.direccionContacto) {
    medioRespuestaContactoSelect.value.resetValidation();
  }
});


const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return 'Este campo es requerido'
  }
  return true
}

function onlyAlphaNumeric(event: { which: any; keyCode: any; preventDefault: () => void; }) {
  let charCode = (event.which) ? event.which : event.keyCode;
  if ((charCode > 47 && charCode < 58) ||  // Numbers
    (charCode > 64 && charCode < 91) ||  // Uppercase letters
    (charCode > 96 && charCode < 123) ||  // Lowercase letters
    charCode === 32) {                   // Space
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
    if (val.length == 12 && !expresionRegular.test(val)) {
      return "Ingrese un número de teléfono válido, debe contener el indicativo al principio (30)";
    } else if (!expresionRegular.test(val)) {
      return "El número de teléfono celular debe contener máximo 10 dígitos";
    }
  }
};

const homePhoneNumber = (val: any) => {
  const expresionRegular = /^(601|602|603|604|605|606|607|608|609)[0-9]{7}$/;
  if (val) {
    if (val.length == 12 && !expresionRegular.test(val)) {
      return "Ingrese un número de teléfono válido, debe contener el indicativo al principio (60)";
    } else {
      return (
        expresionRegular.test(val) ||
        "El número de teléfono fijo debe contener máximo 10 dígitos"
      )
    }
  }
};

const lengthValidation = (n, val: string) => val.length <= n || "Máximo " + n + " caracteres"
</script>

<style lang="scss" scoped>
.input-code:focus {
  outline: none;
}
</style>
