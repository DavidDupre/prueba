<template>
  <div>
    <div>
      <div class='tw-mb-6'>
        <p class="pl-4 tw-font-bold tw-text-3xl tw-mt-5 tw-mb-3 text-bold"> Radicar PQRD</p>
        <p class="tw-text-label tw-text-[16px]">Positiva recibirá y responderá en los tiempos definidos por la
          ley a los
          medios de contacto suministrados</p>
      </div>

      <q-form ref="form" @submit.prevent="submit" class="[&>*]:tw-mb-4" greedy>
        <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
          <q-expansion-item label="Datos del Remitente" default-opened header-class="tw-text-lg tw-font-bold">
            <div class="tw-grid tw-grid-cols-4 tw-gap-x-4">

              <div class="tw-col-span-4">
                <p class="tw-text-label tw-font-semibold">Tipo de Remitente *</p>
                <q-select :options="listadoTipoRemitente" map-options emit-value outlined disable
                  v-model='formData.tipoRemitente' label="Seleccione" dense :rules="[rulesValidation]" />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Nombres del Remitente *</p>
                <q-input outlined v-model='formData.nombresRemitente' label="Inserte" dense disable
                  :rules="[(v: string) => lengthValidation(200, v), rulesValidation, alphabeticalWithSpecialCharacters]"
                  @keypress="alphabeticalWithSpecialCharacters" />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Correo Electrónico *</p>
                <q-input outlined v-model='formData.correoRemitente' disable label="Inserte" dense
                  :rules="[rulesValidation, (v: string) => validationEmail(v), (v: string) => lengthValidation(200, v)]" />
              </div>
            </div>
          </q-expansion-item>
        </q-card>

        <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
          <q-expansion-item label="Datos del Afectado" default-opened header-class="tw-text-lg tw-font-bold">
            <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
              <p class="tw-col-span-6 tw-text-black tw-font-semibold tw-pb-2">
                Recuerde que los
                datos del afectado son los relacionados a
                los de quien se solicita el requerimiento ante Positiva *</p>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Tipo Documento Afectado *</p>
                <q-select :options="tipoDoc" map-options emit-value :rules="[rulesValidation]" outlined
                  v-model='formData.tipoDocumentoAfectado' label="Seleccione" dense
                  @update:model-value="updateTipoDoc" />
              </div>

              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Número de Documento Afectado *</p>
                <q-input type="text" min="0" outlined v-model='formData.numeroDocumentoAfectado' label="Inserte" dense
                  :rules="[(v: string) => lengthValidation(15, v), rulesValidation]" @blur="getPersonData" />
              </div>
              <div class="tw-col-span-6">
                <p class="tw-text-label tw-font-semibold">Nombre del Afectado *</p>
                <q-input outlined v-model='formData.nombresAfectado' label="Inserte" dense
                  :rules="[(v: string) => lengthValidation(200, v), rulesValidation, alphabeticalWithSpecialCharacters]"
                  @keypress="onlyAlphaNumeric2" />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">¿Pertenece a la comunidad LGBTIQ+? *</p>
                <q-select :disable="[8, 9, 10, 13].includes(Number(formData.tipoDocumentoAfectado))"
                  :options="[{ label: 'No', value: false }, { label: 'Si', value: true }]" map-options emit-value
                  outlined v-model='formData.lgtbtq' label="Seleccione" dense
                  :rules="[rulesValidation, (v: null) => v === null ? 'Este campo es requerido' : true]" />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Sexo *</p>
                <q-select :disable="[8, 9, 10, 13].includes(Number(formData.tipoDocumentoAfectado))"
                  :options="generoOptions" map-options emit-value outlined v-model='formData.sexo' label="Seleccione"
                  dense :rules="[rulesValidation]" />
              </div>
              <div v-if="sexoSelecionado === 6" class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Otro ¿Cuál? *</p>
                <q-input outlined v-model='formData.sexoCual' label="Inserte" dense
                  :rules="[(v: string) => lengthValidation(50, v), inputRequired, alphabeticalWithSpecialCharacters]"
                  @keypress="alphabeticalWithSpecialCharacters" />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Condición Especial *</p>
                <q-select :disable="[8, 9, 10, 13].includes(Number(formData.tipoDocumentoAfectado))"
                  :options="listadoCondiciones" outlined v-model='formData.listadoCondiciones'
                  :rules="[rulesValidation]" label="Seleccione" dense input-debounce="0" class="tw-rounded-lg">
                </q-select>
              </div>


            </div>
          </q-expansion-item>
        </q-card>
        <q-card class="tw-px-4 tw-pt-2 tw-pb-4 tw-rounded-xl" flat>
          <q-expansion-item label="Solicitud" default-opened header-class="tw-text-lg tw-font-bold">
            <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2"></h2>
            <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Tipología de la PQRD *</p>
                <q-select map-options emit-value :rules="[rulesValidation]" outlined v-model='formData.tipologiaPQRD'
                  label="Seleccione" dense disabled />
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Tipo de Solicitud *</p>
                <q-select :options="filteredSolicitudes" :rules="[rulesValidation]" outlined map-options emit-value
                  v-model='formData.tipoSolicitud' label="Seleccione" dense @filter="solicitudOptionsFilterFn" use-input
                  fill-input hide-selected />
              </div>
              <div class="tw-col-span-6" v-if="Number(formData.tipoSolicitud) === 14">
                <span class="tw-w-full">
                  <label class="tw-text-label tw-font-semibold">Asignar Oficina *</label>
                  <q-select v-model="formData.oficina" map-options :options="filteredOficinas" label="Seleccione" dense
                    emit-value outlined class="tw-rounded-lg" :rules="[rulesValidation]" @filter="selectOptionsFilterFn"
                    use-input fill-input hide-selected />
                </span>
              </div>
              <div class="tw-col-span-6" v-if="Number(formData.tipoSolicitud) === 14">
                <p class="tw-text-label tw-font-semibold">Detalle *</p>
                <q-input type="textarea" :rules="[rulesValidation, (v: string) => lengthValidation(150, v)]" outlined
                  dense v-model:model-value="formData.solicitudDetalle" />
              </div>
              <div class="tw-col-span-6 tw-mb-5">
                <CommentTextArea v-model="formData.observaciones" :is-required="true" :max-length="10000"
                  label="Observaciones"/>
              </div>
              <div class="tw-col-span-6">
                <p class="tw-text-label tw-font-semibold">Adjuntar documentos de soporte</p>
                <FileLoader :max-file-size="30 * 1024 * 1024" max-file-size-label="30"
                  v-model:model-value="formData.files" :rules="[]" :max-files="10"
                  accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
                            sub-title="Puede adjuntar (10) Archivo(s) cada uno con un tamaño permitido de 30MB en cualquiera de las siguientes extensiones <hr>(pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)"
                  multiple @rejected="rejectedFiles" />
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

    <Modal v-model="cancelModal" title="¡Espera un momento!" :is-success="false" @handleAccept="onReset" cancel-button
      textButtonCancel="No" textButton="Si"
      text="Al cancelar la acción perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
      @close-modal="cancelModal = false" type="button" />

    <Modal v-model="showModalVerification" :title="'Radicación Exitosa'"
      :text="`Trámite de radicación de PQRD Defensor del Consumidor generado correctamente, número de radicado ${responseId}`"
      is-success text-button="Finalizar" @handleAccept="showModalVerification = false"
      @closeModal="showModalVerification = false" cancel-button text-button-cancel="Descargar solicitud"
      @close-modal="handleDownloadRadicacionDocument" @handle-accept="handleCloseDownloadModal" />

  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { onMounted, Ref, ref, watch } from 'vue';
import FileLoader from 'components/FormFields/FileLoader.vue';
import { sgdeaAxios } from 'src/services';
import { toast } from "src/helpers/toast";
import { DocumentoRadicado, SelectInput } from "src/interfaces";
import { useAuthStore } from "src/stores/auth.store";
import Modal from "components/Modal/Modal.vue";
import {
  validationEmail,
  onlyNumbers,
  alphabeticalWithSpecialCharacters,
  inputRequired
} from "src/helpers/validations";
import { Notify } from "quasar";
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";
import { useCountries, useDepartments, useMunicipalities } from "src/composables/useVersion";

interface PQRD {
  tipoRemitente: { label: string, value: number };
  nombresRemitente: string;
  tipoDocumentoAfectado: string;
  numeroDocumentoAfectado: string;
  nombresAfectado: string;
  lgtbtq: boolean,
  sexo: string;
  sexoCual: any;
  condicionEspecial: any[];
  correoRemitente: string;
  tipologiaPQRD: string;
  tipoSolicitud: string;
  oficina: string;
  solicitudDetalle: string;
  listadoCondiciones: any[];
  observaciones: string;
  files: any[];
  paisId: number | null;
  departamentoId: number | null;
  municipioId: number | null;
  direccion: string | null;
}

const handleSubmitIsLoading = ref<boolean>(false)
const auth = useAuthStore()

const formData: Ref<PQRD> = ref({
  tipoRemitente: { label: "Tercero", value: 2 },
  nombresRemitente: auth.userInfo.name,
  correoRemitente: auth.userInfo.email,
  tipoDocumentoAfectado: '',
  numeroDocumentoAfectado: '',
  nombresAfectado: '',
  lgtbtq: null,
  sexo: '',
  sexoCual: '',
  condicionEspecial: [],
  tipoSolicitud: '',
  tipologiaPQRD: '',
  solicitudDetalle: '',
  listadoCondiciones: [],
  observaciones: '',
  files: [],
  oficina: '',
  paisAfectado:  '',
  departamentoAfectado: null,
  municipioAfectado: null,
  direccionAfectado: ''
});

const router = useRouter()
const form = ref()
const showModalVerification = ref(false)
const generoOptions: Ref<any[]> = ref([])
const listadoTipologiaOptions: Ref<any[]> = ref([])
const listadoCondiciones: Ref<any[]> = ref([])
const listadoTipoRemitente: Ref<any[]> = ref([])
const listadoTiposSolicitud: Ref<any[]> = ref([])
const tipoDoc: Ref<SelectInput[]> = ref([]);
const filteredSolicitudes = ref<SelectInput[]>([]);
const responseId = ref('')
const correoRemitente = ref('')
const cancelModal = ref(false)
const generatedDocId = ref<string | null>(null);
const MAX_FILE = 10
const filteredOficinas = ref<SelectInput[]>([]);
const listadoOficinas = ref<SelectInput[]>([]);
const sexoSelecionado = ref<number | null>(null)

const getAcronimobyId = (id: number) => {
  const tipo = tipoDoc.value.find(t => t.value === id);
  if (!tipo) return '';
  const acronimos: Record<number, string> = {
    1: 'CC', // Cédula de ciudadanía
    2: 'CE', // Cédula de extranjería
    3: 'TI', // Tarjeta de identidad
    4: 'RC', // Registro civil
    5: 'PA', // Pasaporte
    6: 'MS', // Menor sin identificación
    7: 'AS', // Adulto sin identificación
    8: 'CD', // Carné diplomático
    9: 'SC', // Salvoconducto
    10: 'PE', // Permiso especial de permanencia
    11: 'NI', // NIT
    13: 'NU', // Número único de identificación
  };

  return acronimos[id] || '';
};

// Función para consultar datos del afectado
async function getPersonData() {
  const tipoDocAcronimo = getAcronimobyId(Number(formData.value.tipoDocumentoAfectado));
  const numeroDoc = formData.value.numeroDocumentoAfectado;

  if (!tipoDocAcronimo || !numeroDoc) return;

  try {
    const response = await sgdeaAxios.get("/personas", {
      params: {
        tipoDocumento: tipoDocAcronimo,
        numeroDocumento: numeroDoc
      }
    });

    if (response.status === 200) {
      // Construir nombre completo
      const nombreCompleto = [
        response.data.nombre1,
        response.data.nombre2,
        response.data.apellido1,
        response.data.apellido2
      ].filter(Boolean).join(' ');

      // Actualizar campos del formulario
      formData.value.nombresAfectado = nombreCompleto;
      formData.value.sexo = response.data.genero;
      formData.value.sexoCual = response.data.otroGenero || '';
      formData.value.lgtbtq = response.data.lgtbtq || false;

      // Actualizar condición especial si existe
      if (response.data.isCondicionEspecial) {
        const condicion = listadoCondiciones.value.find(
          c => c.value === response.data.isCondicionEspecial
        );
        if (condicion) {
          formData.value.listadoCondiciones = condicion;
        }
      }
    }
  } catch (error) {
    console.error("Error al consultar datos de la persona:", error);
    // Limpiar campos si hay error
    formData.value.nombresAfectado = '';
    formData.value.sexo = '';
    formData.value.sexoCual = '';
    formData.value.lgtbtq = null;
    formData.value.listadoCondiciones = [];
  }
}

async function getUserLocationData() {
  try {
    const response = await sgdeaAxios.get("/usuarios/133");

    if (response.status === 200) {
      const userData = response.data;

      // Extraer datos de ubicación
      const paisId = userData.departamento?.idPais || null;
      const departamentoId = userData.departamento?.idDepartamento || null;
      const municipioId = userData.municipio?.idMunicipio || null;
      const direccion = userData.direccion || null;

      // Actualizar formData con los datos obtenidos
      formData.value.paisId = paisId;
      formData.value.departamentoId = departamentoId;
      formData.value.municipioId = municipioId;
      formData.value.direccion = direccion;

      return {
        paisId,
        departamentoId,
        municipioId,
        direccion
      };
    }
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    toast.error("Error al consultar los datos de ubicación del usuario");
    return null;
  }
}

onMounted(async () => {


  await loadTipoDoc()
  await loadGenero()
  await loadListadoTipologia()
  await loadListadoCondiciones()
  await loadListadoTiposSolicitud()
  await loadListadoOficinas()
  await getUserLocationData();

  formData.value.tipologiaPQRD = listadoTipologiaOptions.value.find((e) => { return e.value == 7 })
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
    console.error(error)
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

    sortOptions(listadoTipologiaOptions.value)

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

    listadoTiposSolicitud.value = listadoTiposSolicitud.value.filter((e) => { return e.value !== 24 })
    filteredSolicitudes.value = listadoTiposSolicitud.value

  } catch (error) {
    console.error(error);
  }
}

async function loadListadoOficinas() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoOficinas")

    if (response.status == 200 || response.status == 201) {
      listadoOficinas.value = response.data.filter(it => it.id !== 13).map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        }
      }).sort((a, b) => a.label.localeCompare(b.label))
    }

    listadoOficinas.value = listadoOficinas.value.filter((e) => { return e.value !== 26 })
    filteredOficinas.value = listadoOficinas.value
  } catch (error) {
    console.error(error);
  }
}


const normalizeString = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
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

const selectOptionsFilterFn = (val: string, update: any) => {
  if (val === '') {
    update(() => {
      filteredOficinas.value = listadoOficinas.value
    })
    return
  }

  const needle = normalizeString(val);
  update(() => {
    filteredOficinas.value = listadoOficinas.value.filter(v => {
      return normalizeString(v.label).indexOf(needle) > -1;
    });
  });
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
    tipoRemitente: { label: "Tercero", value: 2 },
    nombresRemitente: '',
    tipoDocumentoAfectado: '',
    numeroDocumentoAfectado: '',
    nombresAfectado: '',
    lgtbtq: false,
    sexo: '',
    sexoCual: '',
    condicionEspecial: [],
    correoRemitente: '',
    tipologiaPQRD: '',
    tipoSolicitud: '',
    solicitudDetalle: '',
    listadoCondiciones: [],
    observaciones: '',
    files: [],
    oficina: '',
  }

  // @ts-ignore
  router.go()
};

const handleDownloadRadicacionDocument = async () => {
  try {

    const { data: listDocs } = await sgdeaAxios.get<any>(
      `/radicados/obtenerHijosPorNodo/${generatedDocId.value}`
    );

    const docRadicado = listDocs.list.entries?.find(
      (it) => {
        const entryName = it.entry.name;
        return entryName && entryName.startsWith(responseId.value);
      }
    );


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

    router.push('/home')
  } catch (error) {
    console.error("Error:", error.message);
    toast.error("Ocurrió un error inesperado.");
  }
};

const rejectedFiles = (error: any[]) => {
  if (error.some((it: { failedPropValidation: string; }) => it.failedPropValidation === 'max-file-size')) {
    Notify.create({ type: "error", message: "El peso permitido es hasta 30MB." })
  }
  if (error.some((it: { failedPropValidation: string; }) => it.failedPropValidation === 'max-files')) {
    Notify.create({ type: "error", message: `Solo se pueden adjuntar ${MAX_FILE} archivos.` })
  }
  if (error.some((it: { failedPropValidation: string; }) => it.failedPropValidation === 'accept')) {
    Notify.create({
      type: 'error',
      message: 'Formato inválido, los formatos permitidos son (pdf, png, jpg, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, jpeg, bmp, zip, rar, ppt, pptx).',
    })
  }
}

const handleCloseDownloadModal = () => {
  router.push("/home");
}

const submit = async () => {
  if (await form.value.validate()) {
    handleSubmitIsLoading.value = true;

    const pqrdSubmit = new FormData();

    // @ts-ignore
    pqrdSubmit.append('datosRemitenteTipoRemitenteId', formData.value.tipoRemitente.value);
    pqrdSubmit.append('datosRemitenteNombre', formData.value.nombresRemitente);
    pqrdSubmit.append('datosAfectadoCorreoElectronico', formData.value.correoRemitente);

    pqrdSubmit.append('datosAfectadoTipoDocumentoId', formData.value.tipoDocumentoAfectado);
    pqrdSubmit.append('datosAfectadoNumeroDocumento', formData.value.numeroDocumentoAfectado);
    pqrdSubmit.append('datosAfectadoNombre', formData.value.nombresAfectado);
    // @ts-ignore
    pqrdSubmit.append('datosAfectadoLgtbtq', formData.value.lgtbtq);
    pqrdSubmit.append('datosAfectadoGeneroId', formData.value.sexo);

    // @ts-ignore
    pqrdSubmit.append('solicitudTipoPqrdId', formData.value.tipologiaPQRD.value || formData.value.tipologiaPQRD);
    pqrdSubmit.append('solicitudTipoSolicitudId', formData.value.tipoSolicitud);
    pqrdSubmit.append('oficina', formData.value.oficina);
    pqrdSubmit.append('solicitudDetalle', formData.value.solicitudDetalle);
    pqrdSubmit.append('usuarioCreador', auth.$state.userInfo.name);
    pqrdSubmit.append('solicitudObservaciones', formData.value.observaciones);
    // @ts-ignore
    let idCondiciones = [formData.value.listadoCondiciones.value];
    pqrdSubmit.append('listadoCondiciones', `[${idCondiciones}]`);

    if (formData.value.files.length) {
      for (let i = 0; i < formData.value.files.length; i++) {
        pqrdSubmit.append('files', formData.value.files[i]);
      }
    }

    if (formData.value.sexoCual) {
      pqrdSubmit.append('datosAfectadoGeneroOtro', formData.value.sexoCual);
    }

     if (formData.value.paisId) {
      pqrdSubmit.append('datosAfectadoPaisIdPais', formData.value.paisId.toString());
    }
    if (formData.value.departamentoId) {
      pqrdSubmit.append('datosAfectadoDepartamentoIdDepartamento', formData.value.departamentoId.toString());
    }
    if (formData.value.municipioId) {
      pqrdSubmit.append('datosAfectadoMunicipioIdMunicipio', formData.value.municipioId.toString());
    }
    if (formData.value.direccion) {
      pqrdSubmit.append('datosAfectadoDireccion', formData.value.direccion);
    }

    correoRemitente.value = formData.value.correoRemitente

    try {
      const response = await sgdeaAxios.post("/pqrd/radicar-pqrd-defensorConsumidor", pqrdSubmit)
      if (response.data) {
        responseId.value = response.data.idRadicado
        generatedDocId.value = response.data.nodeId
        showModalVerification.value = true
        handleSubmitIsLoading.value = false

        const dataTrazabilidad = {
          proceso: `PQRD${response.data.id}`,
          secuencia: response.data.idRadicado,
          estado: response.data.estado.estado,
          // @ts-expect-error
          descripcion: `Se ha radicado la PQRD ${formData.value.tipologiaPQRD.value == 7 || formData.value.tipologiaPQRD == 7 ? 'Express' : ''}`,
          comentario: formData.value.solicitudDetalle ? formData.value.solicitudDetalle : 'Radicado',
          nombre: auth.$state.userInfo.name,
          accion: `${auth.$state.userInfo.name} ha radicado la PQRD ${response.data.idRadicado}`,
          tramite: response.data.solicitud.tipoPqrd.id == 7 ? 'PQRD Express' : 'PQRD',
        }
        await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad)
      }
    } catch (error) {
      toast.error("Ha ocurrido un error")
      console.error(error);
      handleSubmitIsLoading.value = false;
    }
  } else {
    return toast.error("Para continuar, Asegúrese de que todos los campos obligatorios estén completos")
  }
}

const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return 'Este campo es requerido'
  }
  return true
}

function onlyAlphaNumeric2(event: { which: any; keyCode: any; preventDefault: () => void; }) {
  let charCode = (event.which) ? event.which : event.keyCode;

  // Convert the charCode to a String
  let charTyped = String.fromCharCode(charCode);

  // Define a regex for alphanumeric characters and Spanish special characters
  let regex = /^[a-zA-Z0-9 áéíóúÁÉÍÓÚÑñ]*$/;

  // Check if the character matches the regex
  if (regex.test(charTyped)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

watch(() => formData.value.sexo, async (newValue, oldValue) => {
  await loadGenero()
  const selectedOption = generoOptions.value.find(option => option.value === newValue);
  if (selectedOption) {
    sexoSelecionado.value = selectedOption.value
  }
});


watch(() => formData.value.tipoDocumentoAfectado, (newVal) => {
  if ([8, 9, 10, 13].includes(Number(newVal))) {
    // Deshabilitar campos para tipos de documento especiales
    formData.value.lgtbtq = false;
    formData.value.sexo = 1;
    formData.value.listadoCondiciones = { label: "No aplica", value: 1 };
  }
});

function onlyNumber(event: { keyCode: any; which: any; preventDefault: () => void; }) {
  let keyCode = event.keyCode ? event.keyCode : event.which;
  if ((keyCode >= 48 && keyCode <= 57)) {
    return true;
  }
  event.preventDefault();
  return false;
}

const lengthValidation = (n, val: string) => val.length <= n || "Máximo " + n + " caracteres"


const updateTipoDoc = (idTipo: number) => {
  if ([8, 9, 10, 13].includes(idTipo)) {
    formData.value.lgtbtq = false;
    formData.value.sexo = 1;
    formData.value.listadoCondiciones = { label: "No aplica", value: 1 };
    formData.value.sexoCual = '';
  } else {
    formData.value.lgtbtq = null;
    formData.value.sexo = '';
    formData.value.sexoCual = '';
    formData.value.listadoCondiciones = [];

    if (formData.value.numeroDocumentoAfectado) {
      getPersonData();
    }
  }
};
</script>

<style lang="scss" scoped>
.input-code:focus {
  outline: none;
}
</style>
