<template>
  <q-form ref="formOne" greedy>
  <q-card class="tw-rounded-xl tw-p-4 tw-mt-4" flat bordered>
    <q-expansion-item default-opened>
      <template v-slot:header>
        <div class="col row">
          <b class="tw-text-xl">Juzgado Destinatario</b>
        </div>
      </template>
        <div class="row q-col-gutter-md q-pb-md q-px-md">

          <!-- Tramite -->
          <div class="col-12">
            <span class="tw-text-label text-weight-bold">Trámite *</span>
            <q-select :rules="[inputRequired, v => maxLengthInput(7, v)]" name="tramite" outlined
              v-model="form.tramite" label="Seleccione" disable dense map-options emit-value :options="['Tutelas']" />
          </div>

          <!-- Pais -->
          <div class="col-2">
            <span class="tw-text-label text-weight-bold">País *</span>
            <q-select :rules="[inputRequired]" name="pais" disable outlined v-model="form.pais" label="Seleccione"
              dense map-options emit-value :options="[]" />
          </div>

          <!-- Departamento -->
          <div class="col-5">
            <span class="tw-text-label text-weight-bold">Departamento *</span>
            <q-select :rules="[inputRequired]" name="departamento" outlined v-model="form.departamento"
              label="Seleccione" dense use-input hide-selected fill-input map-options emit-value :options="departmentsList" @filter="filterDep" />
          </div>

          <!-- Municipio -->
          <div class="col-5">
            <span class="tw-text-label text-weight-bold">Municipio *</span>
            <q-select :rules="[inputRequired]" name="municipio" outlined v-model="form.municipio"
              label="Seleccione" dense map-options emit-value :options="municipiosListFiltered" @filter="filterMuni" />
          </div>

          <!-- Nombre del juzgado para registro de tutelas -->
          <div class="col-12">
            <span class="tw-text-label text-weight-bold">Nombre del Juzgado *</span>
            <SearchInput :options="optionsJuzgados" v-model:input-data-prop="form.nombreJuzgado" label="Búsqueda"
            :limit-number="200" :rules="[v => maxLengthInput(200, v), inputRequired]" @update="currentInfoJuzgado" />
          </div>

          <!-- Direccion de juzgado -->
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <span class="tw-text-label text-weight-bold">Dirección del Juzgado *</span>
            <q-input :rules="[inputRequired, v => maxLengthInput(200, v)]" v-model="form.direccion" outlined dense label="Inserte" />
          </div>

          <!-- Teléfono destinatario -->
          <div class="col-6">
            <span class="tw-text-label text-weight-bold">Teléfono del Destinatario</span>
            <q-input :rules="[]" v-model="form.telefono" outlined dense label="Inserte" />
          </div>

          <!-- Celular -->
          <div class="col-6">
            <span class="tw-text-label text-weight-bold">Celular</span>
            <q-input :rules="[v => maxLengthInput(10, v)]" v-model="form.celular" outlined dense
              label="Inserte" />
          </div>

          <!-- Correo electrónico destinatario  -->
          <div class="col-6">
            <span class="tw-text-label text-weight-bold">Correo Electrónico del Destinatario</span>
            <q-input :rules="[inputRequired, v => maxLengthInput(200, v), validationEmail]" v-model="form.correo"
              outlined dense label="Inserte" />
          </div>

          <!-- Código del proceso -->
          <div class="col-6">
            <span class="tw-text-label text-weight-bold">Código del Proceso *</span>
            <q-input :rules="[inputRequired]" v-model="form.codigo" outlined dense
              label="Inserte" />
          </div>

          <div class="col-6">
            <span class="tw-text-label text-weight-bold">Fecha de Ingreso del Correo *</span>
            <DatePickerComponent :rules="[inputRequired]" :disabled="true" mask="DD/MM/YYYY" label="dd / mm / aaaa"
              v-model:input-data-prop="form.fecha" />
          </div>
        </div>

      </q-expansion-item>
    </q-card>
    <q-card class="tw-rounded-xl tw-p-4 tw-mt-10" flat bordered>
      <q-expansion-item default-opened>
        <template v-slot:header>
          <div class="col row">
            <b class="tw-text-lg">Información Adicional</b>
          </div>
        </template>
      </q-expansion-item>
      <div class="row q-col-gutter-md q-pb-md q-px-md">

        <!-- Descripción -->
        <div class="col-12">
          <span class="tw-text-label text-weight-bold">Descripción * {{form.observacion.length}}/10000</span>
          <q-input type="textarea" :rules="[inputRequired, v => maxLengthInput(10000, v), v => minLengthInput(10, v)]" name="observacion"
          outlined v-model="form.observacion" label="Inserte" dense />
        </div>

        <!-- Adjunte los documentos -->
        <div class="col-12">
          <div class="flex column flex-column-fixed q-mt-md">
          <p class="tw-text-label text-weight-bold">Documentos Adjuntos</p>
          <div class="tw-flex tw-flex-wrap overflow-hidden">
            <q-card v-for="({ nombre, formato, id, nodeId }) in listDocsFilter" :key="id"
            class="tw-flex items-center q-px-md tw-my-2 tw-min-h-8 tw-ms-1" flat bordered>
            <img v-if="extensiones.includes(obtenerExtension(nombre).toLowerCase())" style="width: 26px"
            v-lazy :data-url="tipoIcon(obtenerExtension(nombre))" alt="Icono de documento">
            <q-icon v-else name="description" size="xs" />
            <p class="tw-text-xs tw-font-semibold overflow-hidden tw-w-full"> {{ nombre }} </p>
            <div class="tw-flex tw-gap-1">
              <q-icon size="16px" class="tw-cursor-pointer" name="download" @click="download(nodeId)" />
              <q-icon size="16px" class="tw-cursor-pointer" name="info" v-if="obtenerExtension(nombre).toLowerCase() == 'pdf'" @click="visualize(nodeId, listDocsFilter.filter((it) => obtenerExtension(it.nombre).toLowerCase() == 'pdf'))" />
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</q-card>
</q-form>
<q-dialog full-height v-model="sendModal">
    <q-card class="tw-p-2" style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <div class="tw-font-bold q-mt-xs tw-text-[18px]">Enviar Respuesta de Tutela</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form ref="formTwo" greedy>
          <div class="row q-col-gutter-md q-pb-md q-px-sm">
            <div class="col-12">
              <span class="text-weight-bold">Para</span>
              <q-input :rules="[inputRequired, v => maxLengthInput(100, v), validationEmail]" v-model="form.correo"
                outlined dense label="Inserte" />
            </div>

            <div class="col-12">
              <span class="text-weight-bold">De</span>
              <q-input :rules="[inputRequired, v => maxLengthInput(100, v), validationEmailOnlyOne]" v-model="formModal.de"
                outlined dense label="Inserte" />
            </div>

            <div class="col-12">
              <span class="text-weight-bold">CC</span>
              <q-input readonly :rules="[ v => maxLengthInput(1000, v)]" v-model="formModal.cc"
                outlined dense label="Inserte" />
            </div>

            <div class="col-12">
              <span class="text-weight-bold">Asunto *</span>
              <q-input :rules="[inputRequired, v => maxLengthInput(100, v)]" v-model="formModal.asunto"
                outlined dense label="Inserte" />
            </div>

            <div class="col-12">
              <span class="text-weight-bold">Cuerpo del Correo *</span>
              <q-field ref="fieldRef" v-model="formModal.cuerpo" label-slot borderless
                :rules="[inputRequired, v => maxLengthInputForRich(3000, v)]">
                <template #control>
                  <q-editor @paste="pasteCapture" v-model="formModal.cuerpo" :toolbar="[]"
                    class="full-width" id="editorRich" ref="editorResp" style="cursor: auto" placeholder="Inserte"
                    :style="fieldRef && fieldRef.hasError ? 'border-color: var(--q-negative)' : ''" />
                </template>
              </q-field>

            </div>

            <div class="col-12">
              <div class="flex column flex-column-fixed q-mt-md">
                <p class="text-weight-bold">Documentos Adjuntos</p>
                <div class="tw-flex tw-flex-wrap overflow-hidden">
                  <q-card v-for="({ nombre, formato, id, nodeId }) in listDocsFilter" :key="id"
                    class="tw-flex items-center q-px-md tw-my-2 tw-min-h-8 tw-ms-1" flat bordered>
                    <img v-if="extensiones.includes(obtenerExtension(nombre).toLowerCase())" style="width: 26px"
                      v-lazy :data-url="tipoIcon(obtenerExtension(nombre))" alt="Icono de documento">
                    <q-icon v-else name="description" size="xs" />
                    <p class="tw-text-xs tw-font-semibold overflow-hidden tw-w-full"> {{ nombre }} </p>
                    <div class="tw-flex tw-gap-1">
                      <q-icon size="16px" class="tw-cursor-pointer" name="download" @click="download(nodeId)" />
                    </div>
                  </q-card>
                </div>
              </div>
              <span class="tw-text-label">Adjunte los Documentos</span>
              <FileLoader class="tw-w-full" v-model:model-value="form.archivos"
                accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg" :max-file-size="50 * 1024 * 1024" :multiple="true" :max-files="30"
                max-file-size-label="50" @rejected="rejectedFiles" />
            </div>
          </div>
        </q-form>

      </q-card-section>

      <q-card-actions align="center">
        <div class="tw-flex tw-mt-8">
          <q-btn :label="'Cancelar'" color="accent" text-color="black" class="tw-p-3"
            style="width: 200px; height: 50px;" flat @click="confirmModalCancelTwo = true" />
          <q-btn label="Enviar" style="width: 200px; height: 50px;" text-color="white" color="secondary"
            class="tw-rounded-xl tw-p-3 " @click="validateFormTwo" />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <Modal v-model="confirmModal" title="Confirmación" :is-success="false" @handleAccept="sendModal = true" cancel-button
    textButtonCancel="No" textButton="Si"
    text="¿Está seguro de confirmar la información del juzgado destinatario?" @close-modal="confirmModal = false"
    type="button" />

  <Modal v-model="confirmModalSend" title="Confirmación" :is-success="false" @handleAccept="enviarRepuestaModal"
    cancel-button textButtonCancel="No" textButton="Si" text="¿Está seguro de enviar la respuesta de la tutela?"
    @close-modal="confirmModalSend = false" type="button" />

  <Modal v-model="confirmModalCancel" title="Confirmación" :is-success="false" @handleAccept="cancelForm" cancel-button textButtonCancel="No" textButton="Si" text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿Desea realizar la acción?" @close-modal="confirmModalCancel = false" type="button"/>

  <Modal v-model="confirmModalCancelTwo" title="Confirmación" :is-success="false" @handleAccept="cancelFormTwo" cancel-button textButtonCancel="No" textButton="Si" text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿Desea realizar la acción?" @close-modal="confirmModalCancelTwo = false" type="button"/>

  <div class="tw-flex tw-justify-center tw-p-10 q-gutter-x-md">
    <q-btn label="Cancelar" type="reset" @click="confirmModalCancel = true" style="width: 240px;height: 40px;" text-color="black" color="accent"
      class="tw-rounded-xl" />
    <q-btn label="Confirmar" text-color="white" @click="validateFormOne" style="width: 240px;height: 40px;"
      color="primary" class="tw-rounded-xl tw-btn tw-p-2" />
  </div>
</template>

<script setup lang="ts">
import FileLoader from "src/components/FormFields/FileLoader.vue";
import DatePickerComponent from "src/components/FormFields/datePickerComponent.vue";
import { inputRequired, maxLengthInput, validationEmail, maxLengthInputForRich, validationEmailOnlyOne, minLengthInput } from "src/helpers/validations";
import { fourthFormatDate } from "src/helpers/formtDate";
import { ref, defineProps, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { adminAxios, sgdeaAxios } from "src/services";
import Modal from "components/Modal/Modal.vue";
import {
  useDepartments,
  useMunicipalities
} from "src/composables/useVersion";
import { toast } from "src/helpers/toast";
import PDFIcon from "src/assets/pdf.svg";
import JPGIcon from 'src/assets/JPGIcon.svg';
// @ts-ignore
import excelIcon from "src/assets/excel.svg";
import docxIcon from 'src/assets/word.svg';
import { useAuthStore } from "src/stores/auth.store";
import { crearTrazabilidad } from 'src/helpers/trazabilidad';
import SearchInput from 'components/SearchInput/SearchInput.vue';

const route = useRoute()
const router = useRouter();
const formOne = ref()
const dataDatos = ref()
const confirmModal = ref(false)
const sendModal = ref(false)
const confirmModalSend = ref(false)
const countImgs = ref(0)
const fieldRef = ref()
const formTwo = ref()
const auth = useAuthStore()
const confirmModalCancel = ref(false)
const confirmModalCancelTwo = ref(false)
const listDocsFilter = ref()
const editorResp = ref()
const departmentsList = ref([])
const opsDep = ref([])
const municipiosListFiltered = ref([])
const opsMuni = ref([])
const optionsJuzgados = ref([]);
const validDepW = ref(true)

const emit = defineEmits(['cancel'])

const form = ref({
  tramite: 'Tutelas',
  pais: { label: 'COLOMBIA', value: 425},
  departamento: '',
  municipio: '',
  nombreJuzgado: '',
  direccion: '',
  telefono: '',
  celular: '',
  correo: '',
  codigo: '',
  fecha: '',
  observacion: '',
  archivos: []
})

const formModal = ref({
  para: '',
  de: '',
  cc: '',
  asunto: '',
  cuerpo: ''
})

const extensiones = ref([
  'pdf',
  'doc',
  'docs',
  'docx',
  'xls',
  'xml',
  'xlsx',
])

const contarImagenes = () => {
  // Expresión regular para encontrar imágenes
  const regexImagenes = /<img\s+[^>]*>/g;

  // Buscar todas las coincidencias en el texto
  const coincidencias = formModal.value.cuerpo.match(regexImagenes);

  // Si hay coincidencias, devolver la cantidad
  if (coincidencias) {
    countImgs.value = coincidencias.length
  }
}

const pasteCapture = (paste) => {
  if (paste.clipboardData.getData('Text') == '') {
    if (countImgs.value == 6) {
      paste.preventDefault()
      paste.stopPropagation()
      toast.error('Máximo 6 recortes')
    }
  }else{
    if (paste.target.nodeName === 'INPUT') return
        let text, onPasteStripFormattingIEPaste
        paste.preventDefault()
        paste.stopPropagation()
        if (paste.originalEvent && paste.originalEvent.clipboardData.getData) {
          text = paste.originalEvent.clipboardData.getData('text/plain')
          editorResp.value.runCmd('insertText', text)
        }
        else if (paste.clipboardData && paste.clipboardData.getData) {
          text = paste.clipboardData.getData('text/plain')
          editorResp.value.runCmd('insertText', text)
        }
        else if (window.clipboardData && window.clipboardData.getData) {
          if (!onPasteStripFormattingIEPaste) {
            onPasteStripFormattingIEPaste = true
            editorResp.value.runCmd('ms-pasteTextOnly', text)
          }
          onPasteStripFormattingIEPaste = false
        }
  }
};

const tipoIcon = (tipo) => {
  if (tipo.toLowerCase() === 'pdf') return PDFIcon
  if (tipo.toLowerCase() === 'jpg') return JPGIcon
  if (['xls', 'xml', 'xlsx'].includes(tipo.toLowerCase())) return excelIcon
  if (['docx', 'doc'].includes(tipo.toLowerCase())) return docxIcon
}

const obtenerExtension = (nombreArchivo) => {
  const punto = nombreArchivo.lastIndexOf('.');
  if (punto === -1) return '';
  return nombreArchivo.slice(punto + 1);
}

const props = withDefaults(defineProps<{
  detailsTutela: any,
  listDocs: any[],
  download: (nodeId) => {},
  visualize: (nodeId, list) => {},
}>(), {
})

const validateFormOne = async () => {
  if (await formOne.value.validate()) {
    confirmModal.value = true
  } else {
    toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos.')
  }
}

const validateFormTwo = async () => {
  if (await formTwo.value.validate()) {
    confirmModalSend.value = true
  } else {
    toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos.')
  }
}

const cancelForm = () => {
  emit('cancel')
}

const cancelFormTwo = () => {
  formModal.value.asunto = ''
  formModal.value.cuerpo = ''
  sendModal.value = false
}

const getData = async () => {
  const { data } = await sgdeaAxios.get(`/tutela/info/${route.params.id}`)
  dataDatos.value = data
  const responsePais = (await adminAxios.get('/paises/list')).data

  // Ensure responsePais is an array and use find directly
  const selectedCountry = responsePais.find((it) => it.nombre.toLowerCase() === data.juzgado.pais.toLowerCase());

  const { optionsDepartments } = await useDepartments(425);
    departmentsList.value = optionsDepartments.value;
    opsDep.value = optionsDepartments.value

  if (selectedCountry.nombre.toLowerCase() === 'colombia') {
    function normalize(str) {
      return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    }

    const department = selectedCountry.departamentos.find(
      (it) => normalize(it.nombre) === normalize(data.juzgado.departamento)
    );
    const municipio = department.municipios.find((it) => normalize(it.nombre) === normalize(data.juzgado.municipio));

    form.value.tramite = 'Tutelas'
    form.value.pais = { label: selectedCountry.nombre, value: selectedCountry.idPais }
    form.value.departamento = { label: department.nombre, value: department?.idDepartamento }

    setTimeout(() => {
    form.value.municipio = { label: municipio.nombre, value: municipio?.idMunicipio }
    },)

    form.value.nombreJuzgado = data.juzgado?.nombre
    form.value.direccion = data.juzgado?.direccion
    form.value.telefono = data.juzgado?.telefono
    form.value.celular = data.juzgado?.celular
    form.value.correo = data.juzgado.correo
    form.value.codigo = data.codigoProceso
    form.value.fecha = fourthFormatDate(data.fecha)
    form.value.observacion = ''
    form.value.archivos = []

  } else {
    form.value = {
      tramite: 'Tutelas',
      pais: { label: selectedCountry.nombre, value: selectedCountry.idPais },
      departamento: { label: department.nombre, value: department?.idDepartamento },
      municipio: { label: municipio.nombre, value: municipio?.idMunicipio },
      nombreJuzgado: data.juzgado?.nombre,
      direccion: data.juzgado?.direccion,
      telefono: data.juzgado?.telefono,
      celular: data.juzgado?.celular,
      correo: data.juzgado.correo,
      codigo: data.codigoProceso,
      fecha: fourthFormatDate(data.fecha),
      observacion: '',
      archivos: []
    }
  }

  const dataCC = await sgdeaAxios.get(`tutela/${dataDatos.value.idTutela}/usuario/externos`)
  formModal.value.cc = dataCC.data.map(i => i.correo).join(', ')
  formModal.value.de = auth.$state.userInfo.email
}

const normalizeString = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

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

watch(
  () => form.value.departamento,
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
    codigo: data.value,
  }
  selectedJuzgado.value = data
  form.value.nombreJuzgado = data.nombre
  var idDepart = departmentsList.value.filter((item) => item.label == data.departamento)
  municipiosListFiltered.value = []
  const { optionsMunicipalities } = await useMunicipalities(idDepart[0].value);
  municipiosListFiltered.value = optionsMunicipalities.value;
  setTimeout(() => {
    validDepW.value = true
  }, 1000);
}


watch(() => formModal.value.cuerpo, (newOffice) => {
  // @ts-ignore
  contarImagenes();
});

const rejectedFiles = (error) => {
  if (error.some((it) => it.failedPropValidation === 'max-file-size')) {
    toast.error('El peso permitido es hasta 50MB.')
  }
  if (error.some((it) => it.failedPropValidation === 'max-files')) {
    toast.error('Solo se pueden adjuntar 30 archivos.')

  }

  if (error.some((it) => it.failedPropValidation === 'accept')) {
    toast.error('Formato inválido, los formatos permitidos son (pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg).')
  }
}

const enviarRepuestaModal = async () => {
  sendModal.value = false

  try {
    const requestBody = {
      para: form.value.correo,
      de: formModal.value.de,
      descripcion: form.value.observacion,
      cc: formModal.value.cc,
      asunto: formModal.value.asunto,
      contenido: formModal.value.cuerpo
    };
    const formData = new FormData();

    for (const item of listDocsFilter.value) {
      const { data } = await sgdeaAxios.get(`/radicados/consultar_documento/${item.nodeId}`);
      if (data) {
        var nombreDocumento = data.name
        const byteCharacters = atob(data.base64x);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const file = new File([blob], nombreDocumento, { type: 'application/pdf' });
        formData.append('archivos', file);
      }
    }

    for (let j = 0; j < form.value.archivos.length; j++) {
      formData.append('archivos', form.value.archivos[j]);
    }

    formData.append('body', JSON.stringify(requestBody));

    const response = await sgdeaAxios.post(`/tutela/${props.detailsTutela.idTutela}/enviar_respuesta`, formData, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        accept: "*",
        "Content-Type": "multipart/form-data",
        "Content-Transfer-Encoding": "BINARY"
      }
    });

    if (response.status == 200) {
      toast.success('Respuesta de tutela fue enviada')
      const id = route.params.id
      const { data } = await sgdeaAxios.get(`/tutela/info/${id}`)
      await crearTrazabilidad({
          proceso: `TUT${data.idTutela}`,
          secuencia: data.idRadicado,
          estado: data.estado,
          descripcion: `Usuario: ${auth.$state.userInfo.name} \n` +
              `Descripción: ${form.value.observacion}`,
          comentario: form.value.observacion,
          tramite: 'Tutela',
          nombre: auth.$state.userInfo.name,
          accion: `${auth.$state.userInfo.name} ha enviado la respuesta de la tutela`,
      })

      router.push('/bandeja');
    }
  } catch (error) {
    sendModal.value = true
    toast.error('Ha ocurrido un error inesperado')
  }
}

onMounted(async () => {
  getData()
  var filtro = props.listDocs.filter((item) => item.tipo.toLowerCase() == 'de salida')
  listDocsFilter.value = filtro
  const { data } = (await sgdeaAxios.get("/juzgados/activos"));
  optionsJuzgados.value = data?.map((item: any) => ({
    label: item.nombre,
    value: item.idJuzgado,
    codigo: item.codigo,
    nombre: item.nombre,
    id: item.idJuzgado,
    departamento: item.departamento,
    municipio: item.municipio,
    direccion: item.direccion,
    telefono: item.telefono,
    celular: item.celular,
    correo: item.correo
  }));
})

</script>
