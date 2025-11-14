<template>
    <div class="col tw-pt-4 q-mx-md">
      <h1 class="tw-text-3xl tw-font-bold">Información General del Proceso</h1>
      <p class="q-mt-xs">
        Aquí podrá visualizar los datos de la consulta que seleccionó
      </p>
    </div>

    <div class="row tw-ml-3 tw-pt-4 tw-flex tw-items-center tw-gap-4">
      <p class="tw-font-bold">Código del Proceso</p>
      <q-input dense outlined class="tw-w-60 tw-inline" :readonly="!allValid" v-model="detalleTutela.codigoProceso" />
      <q-btn @click="valid" v-if="allValid" class="tw-w-32 tw-h-10" color="primary">Validar</q-btn>
    </div>

    <template v-if="!isEdit">
      <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
        <template v-slot:header>
          <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
            Información General del Caso
          </h3>
          <!-- <div class="flex tw-items-center tw-mr-5">
            <q-btn v-if="auth.$state.userInfo.role == 'Asignador Responsable'" icon="edit" color="secondary" label="Editar" dense @click="isEdit = true" />
          </div> -->
        </template>
        <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 q-mx-md" style="box-shadow: none">
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Numero de Radicado</p>
            <p>{{detalleTutela.idRadicado}}</p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Tipo de Solicitud</p>
            <p>Tutela</p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Nombre Afectado</p>
            <p>{{ detalleTutela.informacionProceso?.nombreCompletoAfectado }}</p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Abogado Responsable</p>
            <p>{{ detalleTutela.userId? detalleTutela.userId.fullname :'N/A' }}</p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Fecha de Radicación</p>
            <p>{{ fourthFormatDate(detalleTutela.fechaRadicacion)}}</p>
          </div>

          <div>
            <p class="tw-font-bold tw-text-gray-dark">Tiempo por Vencer</p>
            <p>{{ detalleTutela.diasPorVencer }}</p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Fecha de Vencimiento</p>
            <p>{{ fourthFormatDate(detalleTutela.informacionProceso?.fechaRespuesta)}}</p>
          </div>
        </q-card>
      </q-expansion-item>

      <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
        <template v-slot:header>
          <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
            Juzgado Remitente
          </h3>
        </template>
        <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 q-mx-md" style="box-shadow: none">
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Trámite</p>
            <p>Tutela</p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">País</p>
            <p>{{ detalleTutela?.pais || '-'
              }}
            </p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Departamento</p>
            <p>{{ detalleTutela?.departamento || '-' }}</p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Municipio</p>
            <p>{{ detalleTutela?.municipio || '-' }}</p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Nombre del Juzgado</p>
            <p>{{ (detalleTutela && detalleTutela.juzgado && detalleTutela.juzgado.nombre) ? detalleTutela.juzgado.nombre :
          ''
              }}</p>
          </div>

          <div>
            <p class="tw-font-bold tw-text-gray-dark">Dirección de Juzgado</p>
            <p>{{ (detalleTutela && detalleTutela.juzgado && detalleTutela.juzgado.direccion) ?
          detalleTutela.juzgado.direccion
          : '' }}</p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Teléfono</p>
            <p>{{ (detalleTutela && detalleTutela.juzgado && detalleTutela.juzgado.telefono) ?
          detalleTutela.juzgado.telefono :
          '' }}</p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Celular</p>
            <p>{{ (detalleTutela && detalleTutela.juzgado && detalleTutela.juzgado.celular) ? detalleTutela.juzgado.celular
          : ''
              }}</p>
          </div>

          <div>
            <p class="tw-font-bold tw-text-gray-dark">Correo Electrónico del Remitente</p>
            <p class="tw-break-all">{{ (detalleTutela && detalleTutela.juzgado && detalleTutela.juzgado.correo) ? detalleTutela.juzgado.correo : '' }} </p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Código del Proceso</p>
            <p>{{ detalleTutela.codigoProceso }}</p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Fecha de Ingreso del Correo</p>
            <p>{{ fourthFormatDate(detalleTutela.fecha) }}</p>
          </div>
        </q-card>
      </q-expansion-item>

      <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
        <template v-slot:header>
          <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
            Información Adicional
          </h3>
        </template>
        <q-card class="q-pb-lg q-px-md col tw-justify-start tw-gap-y-5 tw-gap-x-8 justify-around" style="box-shadow: none">
          <div class="flex column flex-column-fixed">
            <p class="text-weight-bold">Observaciones</p>
            <p>{{ detalleTutela.descripcion }}</p>
          </div>

          <div class="flex column flex-column-fixed q-mt-md">
            <p class="text-weight-bold">Documento de Soporte</p>

            <div class="flex q-mt-xs row q-gutter-sm">
              <q-card
                v-for="({ nombre, formato, id, nodeId }, index) in listDocs.filter((it) => it.nombre == detalleTutela.idRadicado + '.pdf')"
                :key="index" class="flex row items-center tw-gap-x-2 q-px-md" flat bordered>
                <img v-if="extensiones.includes(obtenerExtension(nombre).toLowerCase())" style="width: 26px" v-lazy :data-url="tipoIcon(obtenerExtension(nombre))" alt="Icono de documento">
                  <q-icon v-else name="description" size="xs" />
                <p class="tw-text-xs tw-font-semibold">
                  {{ nombre }}
                </p>
                <div class="tw-flex tw-gap-1">
                  <q-icon size="16px" class="tw-cursor-pointer" name="download" @click="download(nodeId)" />
                  <q-icon size="16px" class="tw-cursor-pointer" name="info" v-if="obtenerExtension(nombre).toLowerCase() == 'pdf'"
                    @click="visualize(nodeId, listDocs.filter((it) => obtenerExtension(it.nombre).toLowerCase() == 'pdf'))" />
                </div>
              </q-card>
            </div>
          </div>

          <div class="flex column flex-column-fixed q-mt-md">
            <p class="text-weight-bold">Documentos Adjuntos</p>

            <template v-for="({ nombre, formato, id, nodeId, tipo }) in listDocs.filter((it) => it.nombre !== detalleTutela.idRadicado + '.pdf')"  :key="index" >
              <q-card class="flex row tw-items-center q-px-md tw-mt-4 tw-w-1/3" v-if="tipo == 'De entrada'" flat bordered>
                <q-img v-if="extensiones.includes(obtenerExtension(nombre).toLowerCase())" style="width: 26px" v-lazy :data-url="tipoIcon(obtenerExtension(nombre))" alt="Icono de documento" />
                <q-icon v-else name="description" size="xs" />
                <p class="tw-text-xs tw-font-semibold overflow-hidden tw-ml-2 col"> {{ nombre }} </p>
                <div class="tw-flex tw-gap-1 co tw-items-end">
                  <q-icon size="16px" class="tw-cursor-pointer" name="download" @click="download(nodeId)" />
                  <q-icon size="16px" class="tw-cursor-pointer" name="info" v-if="obtenerExtension(nombre).toLowerCase() == 'pdf'" @click="visualize(nodeId, listDocs.filter((it) => obtenerExtension(it.nombre).toLowerCase() == 'pdf'))" />
                </div>
              </q-card>
            </template>
          </div>
        </q-card>
      </q-expansion-item>
    </template>

    <!-- Editar Data -->
    <template v-else>
      <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
        <template v-slot:header>
          <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
            Información General del Caso
          </h3>
        </template>
        <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 q-mx-md" style="box-shadow: none">
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Numero de Radicado</p>
            <p>{{detalleTutela.idRadicado}}</p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Tipo de Solicitud</p>
            <p>Tutela</p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Nombre Afectado</p>
            <p>{{ detalleTutela.informacionProceso?.nombreCompletoAfectado }}</p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Colaborador</p>
            <p>{{ detalleTutela.usuarioRadicado }}</p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Fecha de Radicación</p>
            <p>{{ fourthFormatDate(detalleTutela.fechaRadicacion)}}</p>
          </div>

          <div>
            <p class="tw-font-bold tw-text-gray-dark">Tiempo por Vencer</p>
            <p>{{ detalleTutela.diasPorVencer }}</p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Fecha de Vencimiento</p>
            <p>{{ fourthFormatDate(detalleTutela.informacionProceso?.fechaRespuesta)}}</p>
          </div>
        </q-card>
      </q-expansion-item>

      <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
        <template v-slot:header>
          <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
            Juzgado Remitente
          </h3>
        </template>
        <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 q-mx-md" style="box-shadow: none">
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Trámite</p>
            <p>Tutela</p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">País</p>
            <p>{{ detalleTutela?.pais || '-' }}
            </p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Departamento</p>
            <p>{{ detalleTutela?.departamento || '-' }}</p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Municipio</p>
            <p>{{ detalleTutela?.municipio || '-' }}</p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Nombre del Juzgado</p>
            <p>{{ (detalleTutela && detalleTutela.juzgado && detalleTutela.juzgado.nombre) ? detalleTutela.juzgado.nombre :
          ''
              }}</p>
          </div>

          <div>
            <p class="tw-font-bold tw-text-gray-dark">Dirección de Juzgado</p>
            <p>{{ (detalleTutela && detalleTutela.juzgado && detalleTutela.juzgado.direccion) ?
          detalleTutela.juzgado.direccion
          : '' }}</p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Teléfono</p>
            <p>{{ (detalleTutela && detalleTutela.juzgado && detalleTutela.juzgado.telefono) ?
          detalleTutela.juzgado.telefono :
          '' }}</p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Celular</p>
            <p>{{ (detalleTutela && detalleTutela.juzgado && detalleTutela.juzgado.celular) ? detalleTutela.juzgado.celular
          : ''
              }}</p>
          </div>

          <div>
            <p class="tw-font-bold tw-text-gray-dark">Correo Electrónico del Remitente</p>
            <p class="tw-break-all">{{ (detalleTutela && detalleTutela.juzgado && detalleTutela.juzgado.correo) ? detalleTutela.juzgado.correo : '' }} </p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Código del Proceso</p>
            <p>{{ detalleTutela.codigoProceso }}</p>
          </div>
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Fecha de Ingreso del Correo</p>
            <p>{{ fourthFormatDate(detalleTutela.fecha) }}</p>
          </div>
        </q-card>
      </q-expansion-item>

      <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
        <template v-slot:header>
          <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
            Información Adicional
          </h3>
        </template>
        <q-card class="q-pb-lg q-px-md col tw-justify-start tw-gap-y-5 tw-gap-x-8 justify-around" style="box-shadow: none">
          <div class="flex column flex-column-fixed">
            <p class="text-weight-bold">Observaciones</p>
            <q-input type="textarea" outlined label="Inserte" dense emit-value v-model="form.observacion" :rules="[inputRequired, v => maxLengthInput(1000, v)]" />
          </div>

          <div class="flex column flex-column-fixed q-mt-md">
            <p class="text-weight-bold">Documento de Soporte</p>

            <div class="flex q-mt-xs row q-gutter-sm">
              <q-card
                v-for="({ nombre, formato, id, nodeId }, index) in listDocs.filter((it) => it.nombre == detalleTutela.idRadicado + '.pdf')"
                :key="index" class="flex row items-center tw-gap-x-2 q-px-md" flat bordered>
                <img v-if="extensiones.includes(obtenerExtension(nombre).toLowerCase())" style="width: 26px" v-lazy :data-url="tipoIcon(obtenerExtension(nombre))" alt="Icono de documento">
                  <q-icon v-else name="description" size="xs" />
                <p class="tw-text-xs tw-font-semibold">
                  {{ nombre }}
                </p>
                <div class="tw-flex tw-gap-1">
                  <q-icon size="16px" class="tw-cursor-pointer" name="download" @click="download(nodeId)" />
                  <q-icon size="16px" class="tw-cursor-pointer" name="info" v-if="obtenerExtension(nombre).toLowerCase() == 'pdf'"
                    @click="visualize(nodeId, listDocs.filter((it) => obtenerExtension(it.nombre).toLowerCase() == 'pdf'))" />
                </div>
              </q-card>
            </div>
          </div>

          <div class="flex column flex-column-fixed q-mt-md">
            <p class="text-weight-bold">Documentos Adjuntos</p>

            <template v-for="({ nombre, formato, id, nodeId, tipo }) in listDocs.filter((it) => it.nombre !== detalleTutela.idRadicado + '.pdf')"  :key="index" >
              <q-card class="flex row tw-items-center q-px-md tw-mt-4 tw-w-1/3" v-if="tipo == 'De entrada'" flat bordered>
                <q-img v-if="extensiones.includes(obtenerExtension(nombre).toLowerCase())" style="width: 26px" v-lazy :data-url="tipoIcon(obtenerExtension(nombre))" alt="Icono de documento" />
                <q-icon v-else name="description" size="xs" />
                <p class="tw-text-xs tw-font-semibold overflow-hidden tw-ml-2 col"> {{ nombre }} </p>
                <div class="tw-flex tw-gap-1 co tw-items-end">
                  <q-icon size="16px" class="tw-cursor-pointer" name="download" @click="download(nodeId)" />
                  <q-icon size="16px" class="tw-cursor-pointer" name="info" v-if="obtenerExtension(nombre).toLowerCase() == 'pdf'" @click="visualize(nodeId, listDocs.filter((it) => obtenerExtension(it.nombre).toLowerCase() == 'pdf'))" />
                </div>
              </q-card>
            </template>
          </div>
        </q-card>
      </q-expansion-item>
    </template>

    <div v-if="isEdit" class="col row justify-center q-gutter-x-md q-my-md">
      <q-btn color="accent" textColor="secondary" label="Cancelar" style="
          width: 130px;
          height: 40px;
          border-radius: 8px;
          font-size: 16px;
        " no-caps @click="cancelModal = true" />

      <q-btn color="primary" label="Guardar" style="
          width: 130px;
          height: 40px;
          border-radius: 8px;
          font-size: 16px;
        " @click="submit" :loading="handleSubmitIsLoading" />
    </div>

    <Modal v-model="cancelModal" title="¡Espera un momento!" :is-success="false" text-button="Aceptar" cancel-button
      text="¿Estás seguro de cancelar el proceso?" @close-modal="cancelModal = false" @handleAccept="isEdit = false"
      type="button" />
  </template>

  <script lang="ts" setup>
  import { ref } from "vue";
  // @ts-ignore
  import PDFIcon from "src/assets/pdf.svg";
  // @ts-ignore
  import zip from "assets/folder2.svg";
  // @ts-ignore
  import excelIcon from "src/assets/excel.svg";
  // @ts-ignore
  import docxIcon from 'src/assets/word.svg';
  // @ts-ignore
  import img from "src/assets/img.svg";
  // @ts-ignore
  import music from "src/assets/music.svg";
  // @ts-ignore
  import video from "src/assets/video.svg";
  // @ts-ignore
  import txt from "src/assets/txt.svg";
  import msg from "assets/mail.svg";
  import ppt from "assets/powerPoint.svg";
  import xml from "assets/xml.svg";
  import interrogation from "assets/interrogation.svg";
  import Modal from "src/components/Modal/Modal.vue";

  import { fourthFormatDate } from "src/helpers/formtDate";
  import { onMounted } from "vue";
  import { useAuthStore } from "src/stores/auth.store";
  import { inputRequired, maxLengthInput } from "src/helpers/validations";


  const auth = useAuthStore()
  const emit = defineEmits(['valid'])
  const isEdit = ref<boolean>(false)
  const cancelModal = ref<boolean>(false)
  const handleSubmitIsLoading = ref<boolean>(false)

  const tipoIcon = (tipo) => {
    if (['pdf', 'application/pdf',].includes(tipo.toLowerCase())) return PDFIcon
    if (['xls', 'xlsx', 'csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(tipo.toLowerCase())) return excelIcon
    if (['docx', 'doc', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(tipo.toLowerCase())) return docxIcon
    if (['jpeg', 'jpg', 'png', 'webp'].includes(tipo.toLowerCase())) return img
    if (['mp3'].includes(tipo.toLowerCase())) return music
    if (['avi', 'mp4'].includes(tipo.toLowerCase())) return video
    if (['txt', 'bmp'].includes(tipo.toLowerCase())) return txt
    if (['xml'].includes(tipo.toLowerCase())) return xml
    if (['zip', 'rar'].includes(tipo.toLowerCase())) return zip
    if (['msg', 'eml'].includes(tipo.toLowerCase())) return msg
    if (['ppt', 'pptx'].includes(tipo.toLowerCase())) return ppt
    return interrogation;
  }

  const extensiones = ref([
    'pdf',
    'doc',
    'docs',
    'docx',
    'xls',
    'xml',
    'xlsx',
    'csv',
    'jpg',
    'png',
    'jpeg',
    'mp3',
    'avi',
    'mp4',
    'txt',
    'bmp',
    'zip',
    'rar',
    'msg',
    'ppt',
    'pptx',
  ])


  const props = withDefaults(defineProps<{
    listDocs: any[],
    download: (nodeId) => {},
    visualize: (nodeId, list) => {},
    detalleTutela: any,
    allValid: any
  }>(), {
  })

  const form = ref({
    observacion: ''
  })

  onMounted(async () => {

    props.listDocs = props.listDocs.filter((item) => item.tipo == 'De entrada')
  })

  const obtenerExtension = (nombreArchivo) => {
    const punto = nombreArchivo.lastIndexOf('.');
    if (punto === -1) return '';
    return nombreArchivo.slice(punto + 1);
  }

  const valid = () => {
    emit('valid')
  }

  const submit = async() => {
    handleSubmitIsLoading.value = true

    isEdit.value = false
    handleSubmitIsLoading.value = false
  }
  </script>
