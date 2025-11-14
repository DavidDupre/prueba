<template>
  <div>
    <a v-if="!isCorrespondencia" href="/home" class="text-primary q-mb-md block" style="text-decoration: none">
      <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
      <b> Volver</b>
    </a>

    <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold">
      Radicar Tutela
    </div>
    <q-card class="tw-rounded-lg tw-px-7 tw-pt-7 tw-mb-[80px]" flat>

      <p class="tw-text-xl tw-font-bold">Juzgado Remitente</p>

      <q-form ref="radicado" class="tw-mt-6 tw-h-full tw-font-bold">

        <div class="tw-flex tw-full q-col-gutter-md">
          <div class="tw-w-1/2">
            <p class="tw-text-label">Trámite *</p>
            <q-select outlined v-model="form.tramite" :options="['TUTELAS', 'Ventanilla']" label="Seleccione"
              :rules="[inputRequired]" required dense disable />
          </div>
          <div class="tw-w-1/2">
            <p class="tw-text-label">Canal de Recepción *</p>
            <q-select outlined v-model="form.canal" :options="optionsCanales" label="Seleccione"
              :rules="[inputRequired]" required dense disable :disabled="props.isCorrespondencia ? true : false" />
          </div>
        </div>
        <div class="tw-flex tw-full q-col-gutter-md">
          <div class="tw-w-1/3 tw-mt-3">
            <label for="code" class="tw-text-label">País * </label>
            <q-select v-model="form.pais" disable outlined dense use-input hide-selected fill-input input-debounce="0"
              label="Seleccione" :options="optionsCountries" :rules="[inputRequired]" @filter="filterPais">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="tw-w-1/3 tw-mt-3">
            <label for="code" class="tw-text-label">Departamento * </label>
            <q-select v-model="form.departamento" :disable="opsDep?.length > 0 ? false : true" name="departamento"
              outlined dense use-input hide-selected fill-input input-debounce="0" label="Seleccione"
              :options="departmentsList" :rules="[inputRequired]" @filter="filterDep">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="tw-w-1/3 tw-mt-3">
            <label for="code" class="tw-text-label">Municipio * </label>
            <q-select v-model="form.municipio" :disable="municipiosListFiltered?.length > 0 ? false : true"
              name="departamento" outlined dense use-input hide-selected fill-input input-debounce="0"
              label="Seleccione" :options="municipiosListFiltered" :rules="[inputRequired]" @filter="filterMuni">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>

        <div class="tw-w-full tw-mb-1">
          <p class="tw-text-label">Nombre del Juzgado *</p>
          <SearchInput :options="optionsJuzgados" v-model:input-data-prop="form.nombre_juzgado" label="Búsqueda"
            :limit-number="200" :rules="[v => maxLengthInput(200, v), inputRequired]" @update="currentInfoJuzgado" />
        </div>
        <div class="tw-w-full tw-mb-1">
          <p class="tw-text-label">Código del Juzgado</p>
          <q-select outlined dense v-model="form.codigo_juzgado" @filter="filterFn" use-input :options="optionsCode"
            map-options label="Búsqueda" :rules="[v => maxLengthInput(12, v), inputRequired]"
            @update:model-value="currentInfoJuzgado" clearable
                    option-label="codigo">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No se encontró
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>


        <div class="tw-w-full">
          <p class="tw-text-label">Dirección del Juzgado ({{ form.direccion?.length }}/200)</p>
          <q-input outlined v-model="form.direccion" label="Inserte" dense :rules="[v => maxLengthInput(200, v)]">
          </q-input>
        </div>
        <div class="tw-flex tw-full q-col-gutter-md">
          <div class="tw-w-1/2">
            <label for="code" class="tw-text-label">Teléfono </label>
            <q-input outlined v-model="form.telefono" label="Inserte" dense
              :rules="[alphanumericWithPoint, v => maxLengthInput(20, v)]" />
          </div>
          <div class="tw-w-1/2">
            <label for="code" class="tw-text-label">Celular </label>
            <q-input outlined v-model="form.celular" label="Inserte" dense
              :rules="[alphanumeric, v => mobilePhonNumberCel(v)]" />
          </div>

        </div>
        <div class="tw-w-full">
          <label for="code" class="tw-text-label">Correo Electrónico del Remitente * ({{ form.correo?.length }}/100)</label>

          <q-input outlined v-model="form.correo" label="Inserte" dense
            :rules="[v => validationEmail(v), (val) => maxLengthInput(200, val), inputRequired]" />
        </div>
        <div class="tw-flex tw-full q-col-gutter-md tw-mt-0.5">
          <div class="tw-w-1/2">
            <p class="tw-text-label">Código del Proceso *</p>
            <q-input outlined v-model="form.codigo" @blur="consultarCodigoProceso" label="Inserte" dense
              :rules="[val => maxLengthInput(23, val), inputRequired, alphanumeric2, v => /^[-\w\d]{7,}$/.test(v) || 'Mínimo deben ser 7 caracteres para poder continuar']">
            </q-input>
          </div>
          <div class="tw-w-1/2">
            <p class="tw-text-label">Fecha de Ingreso del Correo *</p>
            <Datepicker mask="DD/MM/YYYY" label="dd / mm / aaaa" :options="optionsDateFunc"
              v-model:input-data-prop="form.fecha" @valida-fecha="emitValidation" :rules="[inputRequired]"
              :error-message="'Debe seleccionar una fecha válida'" />
          </div>
          <div class="tw-w-1/2">
            <p class="tw-text-label">Hora de Ingreso del Correo *</p>
            <TimePicker mask="HH:MM" label="HH:MM" v-model:input-data-prop="form.hora" @valida-hora="emitValidation"
              :rules="[inputRequired]" :error-message="'Debe seleccionar una hora válida'" />
          </div>
        </div>

        <p class="tw-text-xl tw-font-bold tw-my-5">Información Adicional</p>

        <p class="tw-text-label">Descripción * ({{ form.descripcion?.length }}/10000)</p>
        <q-input outlined v-model="form.descripcion" label="Inserte" class="" type="textarea" dense :rules="[v => maxLengthInput(10000, v),
          inputRequired, (v) => minLengthInput(10, v)]" />

        <div>
          <p class="tw-text-label">Adjuntar Archivos*</p>
          <FileLoader class="tw-w-full" v-model:model-value="form.archivos"
            accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
            sub-title="Puede adjuntar (30) Archivo(s) cada uno con un tamaño permitido de 50MB en cualquiera de las siguientes extensiones <hr>(pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)"
            :max-file-size="50 * 1024 * 1024" max-file-size-label="50" :max-files="30" :multiple="true"
            @rejected="rejectedFiles" :required="true" />
        </div>

        <div v-if="!isCorrespondencia" class="tw-flex tw-justify-center tw-p-10 q-gutter-x-md">
          <q-btn label="Cancelar" style="width: 240px;height: 40px;" text-color="black" color="accent"
            class="tw-rounded-xl" @click="cancelModal = true" />
          <q-btn label="Radicar" :loading="loadingRadicar" @click="createRadicado" text-color="white"
            style="width: 240px;height: 40px;" color="primary" class="tw-rounded-xl tw-btn tw-p-2" />
        </div>

      </q-form>
    </q-card>


    <Modal v-model="cancelModal" title="¡Espera un momento!" :is-success="false" text-button="Si"
      text-button-cancel="No" @handleAccept="clear" cancel-button
      text="Al cancelar la acción perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
      @close-modal="cancelModal = false" type="button" />

    <Modal v-if="isCorrespondencia" v-model="showModal" text-button-cancel2="Imprimir Sticker"
      @handle-cancel="imprimirSticker" cancel-button2 title="Radicación exitosa" :text="text" is-success
      text-button="Finalizar" @handleAccept="clear" cancel-button text-button-cancel="Descargar"
      @close-modal="handleModal" />


    <Modal v-else v-model="showModal" title="Radicación exitosa" :text="text" is-success text-button="Finalizar"
      @handleAccept="clear" cancel-button text-button-cancel="Descargar" @close-modal="handleModal" />


    <!-- <Modal v-model="showModal" title="Creación exitosa" :text="text" is-success text-button="Finalizar"
      @handleAccept="handleModal" persistent /> -->
    <Modal v-model="errorModal" title="Error" text="¡Ha ocurrido un error!" :is-success="false" text-button="Aceptar"
      @handleAccept="handleModal" />
  </div>
</template>
<script lang="ts" setup>
import { Ref, onMounted, ref, watch } from 'vue';
import service from "src/services/Api";
import FileLoader from 'src/components/FormFields/FileLoader.vue'
import Modal from 'components/Modal/Modal.vue';
import Datepicker from 'components/FormFields/datePickerComponent.vue';
import TimePicker from 'components/FormFields/timePickerComponent.vue';
import {
  alphanumeric,
  mobilePhonNumberCel,
  validationEmail,
  maxLengthInput,
  inputRequired,
  minLengthInput,
  alphanumeric2,
  alphanumericWithPoint
} from 'src/helpers/validations';
import SearchInput from 'components/SearchInput/SearchInput.vue';
import {
  useCountries,
  useDepartments,
  useMunicipalities
} from "src/composables/useVersion";
import moment from "moment/moment"
import { DocumentoRadicado, ITutelaRadicado } from 'src/interfaces'
import { sgdeaAxios } from 'src/services';
import { crearTrazabilidad } from 'src/helpers/trazabilidad';
import { useAuthStore } from "src/stores/auth.store";
import { toast } from "src/helpers/toast";

const MAX_FILE = 30

const auth = useAuthStore()

const radicado = ref()
const responseTutela = ref()

function optionsDateFunc(date) {
  return date <= moment().format('YYYY/MM/DD')
}

const props = withDefaults(
  defineProps<{
    isCorrespondencia: boolean;
    onPrev?: () => void;
  }>(),
  {
    isCorrespondencia: false,
    onPrev: undefined,
  }
);

const showModal = ref(false);
const errorModal = ref(false);
const cancelModal = ref(false)
const text = ref('')
const loadingRadicar = ref(false)
const radicadoId = ref()

const form: Ref<ITutelaRadicado | any> = ref({
  tramite: props.isCorrespondencia ? 'Ventanilla' : 'TUTELAS',
  canal: props.isCorrespondencia ? 'Ventanilla' : 'Mail',
  pais: { label: 'Colombia', value: 425 },
  departamento: '',
  municipio: '',
  nombre_juzgado: '',
  direccion: '',
  telefono: '',
  celular: '',
  correo: '',
  codigo: '',
  fecha: '',
  hora: '',
  descripcion: '',
  documento: '',
  idRadicado: '',
  archivos: [],
  codigo_juzgado: '',
  idJuzgado: ''
});

// const { optionsJuzgados } = useNewJuzgados()
const optionsJuzgados = ref([]);
const opCodeJuz = ref([])
const optionsCode = ref()
onMounted(async () => {
  const { data } = (await sgdeaAxios.get("/juzgados/activos"));
  optionsJuzgados.value = data?.map((item: any) => ({
    label: item.nombre,
    value: item.idJuzgado,
    codigo: item.codigo,
    nombre: item.nombre,
    //id: item.idJuzgado,
    departamento: item.departamento,
    municipio: item.municipio,
    direccion: item.direccion,
    telefono: item.telefono,
    celular: item.celular,
    correo: item.correo
  }));
  opCodeJuz.value = data?.map((item) => ({
    label: item.codigo.toString(),
    //id: item.idJuzgado,
    codigo: item.codigo,
    nombre: item.nombre,
    departamento: item.departamento,
    municipio: item.municipio,
    direccion: item.direccion,
    telefono: item.telefono,
    celular: item.celular,
    correo: item.correo,
    estado: item.estado,
    pais: item.pais,
    value: item.idJuzgado
  }))
  optionsCode.value = opCodeJuz.value
  opsCountry.value = optionsCountries.value
})



const { optionsCountries } = useCountries()
const opsCountry = ref([])
const departmentsList = ref([])
const opsDep = ref([])
const validDepW = ref(true)
const municipiosListFiltered = ref([])
const opsMuni = ref([])
const filesRadicar = ref()
const optionsCanales = ref([
  'Mail',
  'Página web',
  'Ventanilla'
])

onMounted(async () => {

  montarComponente();
  await obtenerPuntoRadicacion();
})

const montarComponente = async () => {
  const { data } = await sgdeaAxios.get<string>('/generar/secuencia/TTL')
  form.value.idRadicado = data;
  const { optionsDepartments } = await useDepartments(form.value.pais.value);
  departmentsList.value = optionsDepartments.value;
  opsDep.value = optionsDepartments.value

}

const selectedJuzgado = ref()

const currentInfoJuzgado = async (data: any) => {
  validDepW.value = false
  form.value = {
    ...form.value,
    departamento: data.departamento,
    municipio: data.municipio,
    direccion: data.direccion,
    telefono: data.telefono,
    celular: data.celular,
    correo: data.correo,
    codigo_juzgado: data.value,
    idJuzgado: data.id
  }
  selectedJuzgado.value = data
  form.value.nombre_juzgado = data.nombre
  var idDepart = departmentsList.value.filter((item) => item.label == data.departamento)
  municipiosListFiltered.value = []
  const { optionsMunicipalities } = await useMunicipalities(idDepart[0].value);
  municipiosListFiltered.value = optionsMunicipalities.value;
  setTimeout(() => {
    validDepW.value = true
  }, 1000);
}
function showNotif(title: string) {
  toast.error(title)
}

const radicadoNumber = ref(0)
const nodeId = ref('')

const validate = ref({
  fecha: false,
  hora: false,
});

const emitValidation = ({ type, data }) => {
  validate.value[type] = data
}

const createRadicado = async () => {
  loadingRadicar.value = true
  if (await radicado.value.validate() && validate.value.fecha && validate.value.hora) {

    let hour;
    let minute;

    const getDate = new Date()
    hour = getDate.getHours()
    minute = getDate.getMinutes()

    if (hour >= 1 && hour <= 9) {
      if (hour < 10) {
        hour = "0" + hour;
      }
    }

    if (minute < 10) {
      minute = "0" + minute;
    }
    var dataBody = {
      tramite: form.value.tramite,
      canal: form.value.canal,
      juzgado: {
        idJuzgado: form.value.idJuzgado,
        nombre: form.value.nombre_juzgado,
        direccion: form.value.direccion,
        pais: form.value.pais.label ? form.value.pais.label : form.value.pais,
        departamento: selectedJuzgado?.value?.departamento,
        municipio: selectedJuzgado?.value?.municipio,
        codigo: form.value.codigo_juzgado,
        telefono: form.value.telefono,
        celular: form.value.celular,
        correo: form.value.correo,
        estado: true
      },
      codigoProceso: form.value.codigo,
      fecha: moment(form.value.fecha, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      hora: form.value.hora,
      descripcion: form.value.descripcion,
      idRadicado: form.value.idRadicado,
      nodeId: null,
      pais: form.value.pais.label ? form.value.pais.label : form.value.pais,
      departamento: form.value.departamento.label ? form.value.departamento.label : form.value.departamento,
      municipio: form.value.municipio.label ? form.value.municipio.label : form.value.municipio,
      usuario: auth.$state.userInfo.name
    }
    service.radicarTutela({
      body: dataBody,
      file: form.value.archivos,
    })
      .then((resp) => {
        radicadoNumber.value = resp.data.radicado

        return sgdeaAxios.get(`/tutela/info/${resp.data.radicado}`)
      }).then((resp) => {
        responseTutela.value = resp.data
        radicadoId.value = resp.data.idTutela
        nodeId.value = resp.data.nodeId
        crearTrazabilidad({
          proceso: `TUT${resp.data.idTutela}`,
          secuencia: resp.data.idRadicado,
          estado: resp.data.estado,
          descripcion: `Usuario: ${auth.$state.userInfo.name} Rol: ${auth.$state.userInfo.role} Descripción: Se ha radicado una Tutela`,
          comentario: 'Radicado',
          nombre: auth.$state.userInfo.name,
          tramite: 'Tutela',
          accion: `${auth.$state.userInfo.name} ha creado el trámite ${resp.data.idRadicado}`,
        })
      }).then(() => {
        showModal.value = true;
        text.value = `Trámite de tutelas generado correctamente, número de radicado ${radicadoNumber.value}. El documento pasará a la bandeja de asignación para continuar el proceso`
        //router.push('/tutelas')
        loadingRadicar.value = false
      })
      .catch((e) => {
        console.error(e);
        errorModal.value = true;
        loadingRadicar.value = false
      });


  } else {

    toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos.')
    loadingRadicar.value = false
  }
}

defineExpose({
  createRadicado
})

const puntoRadicacion = ref();
const puntoRadicacionDep = ref();
const puntoRadicacionMun = ref();

const obtenerPuntoRadicacion = async () => {
  const idPuntoRadicacion = auth.$state.userInfo.puntoRadicacion;
  if (idPuntoRadicacion) {
    const response = await sgdeaAxios.get(`/correspondencia/puntoRadicacion/${idPuntoRadicacion}`);
    puntoRadicacion.value = response.data.nombrePunto;
    puntoRadicacionDep.value = response.data.departamento;
    puntoRadicacionMun.value = response.data.municipio;
  }
}

const handleModal = async () => {
  if (showModal.value) {
        const { data: listDocs } = await sgdeaAxios.get<any>(
      `/radicados/obtenerHijosPorNodo/${nodeId.value}`
    );


      const docRadicado = listDocs.list.entries?.find(
      (it) => {
        const entryName = it.entry.name;
        return entryName && entryName.startsWith(radicadoNumber.value);
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
    link.download = String(radicadoNumber.value);

    link.click();

    URL.revokeObjectURL(blobUrl);

    clear()
  } else {
    errorModal.value = false
  }
}

const filterFn = (val, update, abort) => {
  if (val === '') {
    update(() => {
      optionsCode.value = opCodeJuz.value
    })
    return
  }

  update(() => {
    const needle = val.toLocaleLowerCase()
    optionsCode.value = opCodeJuz.value.filter(v => v.label.toLocaleLowerCase().indexOf(needle) > -1)
  })
}

const imprimirSticker = async () => {

  const body = {
    idRadicado: responseTutela.value.idRadicado,
    telefono: responseTutela.value.juzgado.celular,
    numeroDocumento: responseTutela.value.juzgado.codigo,
    oficina: puntoRadicacion.value ? puntoRadicacion.value : responseTutela.value.oficina.nombre,
    departamento: puntoRadicacionDep.value,
    municipio: puntoRadicacionMun.value,
    tipoTramite: "Tutela",
    PuntoRadicacion: puntoRadicacion.value,
    dependencia: responseTutela.value.oficina.dependencia.idSeccionSubSeccion.toString(),
  };

  try {
    const response = await sgdeaAxios.post(`/sticker/generarSticker/pdf`, body, {
      responseType: 'blob' // Set the response type to 'blob'
    });

    if (response.status === 200) {
      // Create a Blob object from the response data
      const fileBlob = new Blob([response.data], { type: 'application/pdf' });

      // Create a link element
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(fileBlob);
      link.download = `STICKER${responseTutela.value.idRadicado}.pdf`; // Specify the file name

      // Append the link to the body
      document.body.appendChild(link);

      // Programmatically trigger a click on the link to download the file
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);

    }

      if (props.onPrev) {
    props.onPrev();
  }
  } catch (error) {
    console.error('Error while downloading the file:', error);
  }
}


const rejectedFiles = async (error) => {
  if (error.some((it) => it.failedPropValidation === 'max-file-size')) {
    showNotif('El peso permitido es hasta 50MB.')
  }
  if (error.some((it) => it.failedPropValidation === 'max-files')) {
    showNotif(`Solo se pueden adjuntar ${MAX_FILE} archivos.`)
  }
  if (error.some((it) => it.failedPropValidation === 'accept')) {
    showNotif('Formato inválido, los formatos permitidos son (pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg).')
  }
  if (error.some((it) => it.failedPropValidation === "duplicate")) {
    showNotif('Está intentando cargar el mismo archivo más de una vez')
  }
}

const consultarCodigoProceso = async () => {
  try {
    const getJuzgado = (await sgdeaAxios.get(`/juzgados/obtenerJuzgadoXCodigo/${form.value.codigo}`));
    if (getJuzgado) {
      form.value = {
        ...form.value,
        departamento: getJuzgado.data.departamento,
        municipio: getJuzgado.data.municipio,
        direccion: getJuzgado.data.direccion,
        telefono: getJuzgado.data.telefono,
        celular: getJuzgado.data.celular,
        correo: getJuzgado.data.correo,
        codigo_juzgado: getJuzgado.data.codigo,
        idJuzgado: getJuzgado.data.id,
        nombre_juzgado: getJuzgado.data.nombre
      }
      selectedJuzgado.value = getJuzgado.data
    }
  } catch (error) {
    console.error(error);
  }
}

const clear = async () => {
  montarComponente();
  form.value = {
    tramite: 'TUTELAS',
    canal: 'Mail',
    pais: { label: 'Colombia', value: 425 },
    departamento: '',
    municipio: '',
    nombre_juzgado: '',
    direccion: '',
    telefono: '',
    celular: '',
    correo: '',
    codigo: '',
    fecha: '',
    hora: '',
    descripcion: '',
    documento: '',
    archivos: [],
  };
  showModal.value = false;
  cancelModal.value = false;
  await radicado.value.reset();

  if (props.onPrev) {
    props.onPrev();
  }
};


watch(
  () => form.value.pais.value,
  async (value) => {
    form.value.departamento = ''
    form.value.municipio = ''
    const { optionsDepartments } = await useDepartments(value);
    departmentsList.value = optionsDepartments.value;
    opsDep.value = departmentsList.value
    if (departmentsList.value.length == 0) {
      form.value.departamento = form.value.pais.label
      form.value.municipio = form.value.pais.label
    }
  }
);

watch(
  () => form.value.departamento.value,
  async (value) => {
    if (validDepW.value) {
      municipiosListFiltered.value = []
      form.value.municipio = ''
      const { optionsMunicipalities } = await useMunicipalities(value);
      municipiosListFiltered.value = optionsMunicipalities.value;
      opsMuni.value = municipiosListFiltered.value
      if (municipiosListFiltered.value.length == 0) {
        form.value.municipio = form.value.pais.label
      }
    }

  }
);

const normalizeString = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

const filterPais = (val, update) => {
  if (val === '') {
    update(() => {
      optionsCountries.value = opsCountry.value
    })
    return
  }

  const needle = normalizeString(val);
  update(() => {
    optionsCountries.value = opsCountry.value.filter(v => {
      return normalizeString(v.label).indexOf(needle) > -1;
    });
  });
}

const filterDep = (val, update) => {
  if (val === '') {
    update(() => {
      departmentsList.value = opsDep.value
    })
    return
  }

  const needle = normalizeString(val);
  update(() => {
    departmentsList.value = opsDep.value.filter(v => {
      return normalizeString(v.label).indexOf(needle) > -1;
    });
  });
}

const filterMuni = (val, update) => {
  if (val === '') {
    update(() => {
      municipiosListFiltered.value = opsMuni.value
    })
    return
  }

  const needle = normalizeString(val);
  update(() => {
    municipiosListFiltered.value = opsMuni.value.filter(v => {
      return normalizeString(v.label).indexOf(needle) > -1;
    });
  });
}

</script>

<style lang="scss">
.alert-error {
  background-color: #ffdbdb;
  border: 1px solid red;
}

.container-buttons {
  display: flex;
  justify-content: center;
  margin-top: 180px;
}
</style>
