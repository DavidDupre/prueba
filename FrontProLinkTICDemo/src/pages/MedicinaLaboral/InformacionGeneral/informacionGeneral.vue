<template>
  <div class="[&>*]:tw-mb-4" v-if="!isEdit">
    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl tw-w-full" flat>
      <q-expansion-item label="Información General del caso" header-class="tw-text-lg tw-font-bold tw-pt-0 tw-pl-0"
        default-opened class="tw-bg-white tw-px-4 tw-py-5">
        <template v-slot:header>
          <div class="row justify-between tw-w-full">
            <b class="tw-text-lg">Información General del Caso</b>
            <q-btn
              v-if="!props.hideEditButton && ['asignador responsable', 'administrador de trámite', 'gestionador'].includes(auth.userInfo.role?.toLowerCase())"
              icon="edit" color="secondary" label="Editar" dense class="tw-h-8"
              @click="isEdit = true; emit('disabledTabs')"></q-btn>
          </div>
        </template>
        <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Número de radicado
            </p>
            <p>{{ $props.data?.idRadicado }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Canal de radicación
            </p>
            <p>{{ $props.data?.remitente?.canalRadicacion?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Tipo de solicitud</p>
            <p>{{ $props.data?.solicitud?.tipoSolicitud?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Fecha de vencimiento</p>
            <p>{{ props.data?.asignacion?.fechaVencimiento ?
              moment(props.data?.asignacion?.fechaVencimiento).format("DD/MM/YYYY HH:mm") : '' }}</p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl tw-w-full" flat v-if="auth.userInfo.role !== 'Asignador Responsable'">
      <q-expansion-item label="Metadatos de la asignación" header-class="tw-text-lg tw-font-bold tw-pt-0 tw-pl-0"
        default-opened class="tw-bg-white tw-px-4 tw-py-5">
        <div class="tw-grid tw-grid-cols-6 tw-gap-4 tw-pl-3">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Proceso Medicina Laboral</p>
            <p>{{ $props.metadatosInfo?.process.proceso }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Subproceso</p>
            <p>{{ $props.metadatosInfo?.subProceso.subProceso }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Prefijo</p>
            <p>{{ $props.metadatosInfo?.prefijoOficina?.prefijo?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Formato de tiempo</p>
            <p>{{ $props.metadatosInfo?.formatoFecha }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Tiempo</p>
            <p>{{ $props.metadatosInfo?.tiempo }}</p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
      <q-expansion-item label="Remitente" header-class="tw-text-lg tw-font-bold tw-pt-0 tw-pl-0" default-opened
        class="tw-bg-white tw-px-4 tw-py-5">
        <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de remitente
            </p>
            <p>{{ $props.data?.remitente?.tipoRemitente?.nombre ?? 'N/A' }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de documento del remitente
            </p>
            <p>
              {{ $props.data?.remitente?.tipoDocumento?.nombre }}
            </p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Número de documento del remitente
            </p>
            <p>
              {{ $props.data?.remitente?.numeroDocumento ?? 'N/A' }}
            </p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Nombre del remitente
            </p>
            <p class="break-all">{{ $props.data?.remitente?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              País del remitente
            </p>
            <p>{{ $props.data?.remitente?.pais?.nombre ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Departamento del remitente
            </p>
            <p>{{ $props.data?.remitente?.departamento?.nombre ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Municipio del remitente
            </p>
            <p>{{ $props.data?.remitente?.municipio?.nombre ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Dirección del remitente
            </p>
            <p class="break-all">{{ $props.data?.remitente?.direccion ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Teléfono del remitente
            </p>
            <p>{{ $props.data?.remitente?.telefono ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Correo electrónico del remitente
            </p>
            <p class="tw-break-words tw-whitespace-normal">
              {{ $props.data?.remitente?.email ?? "N/A" }}
            </p>
          </div>

          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Medio que autoriza para envío de respuesta
            </p>
            <p>
              {{ $props.data?.remitente?.medioRespuesta.nombre }}
            </p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
      <q-expansion-item label="Afectado" header-class="tw-text-lg tw-font-bold tw-pt-0 tw-pl-0" default-opened
        class="tw-bg-white tw-px-4 tw-py-5">
        <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de documento del afectado
            </p>
            <p>{{ $props.data?.afectado?.tipoDocumento?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Número de documento del afectado
            </p>
            <p>
              {{ $props.data?.afectado?.numeroDocumento ?? 'N/A' }}
            </p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Nombre del Afectado
            </p>
            <p class="break-all">{{ $props.data?.afectado?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Correo del afectado
            </p>
            <p class="tw-break-words tw-whitespace-normal">
              {{ $props.data?.afectado?.correoElectronico }}
            </p>
          </div>

          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              País del afectado
            </p>
            <p>{{ $props.data?.afectado?.pais?.nombre ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Departamento del afectado
            </p>
            <p>{{ $props.data?.afectado?.departamento?.nombre ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Municipio del afectado
            </p>
            <p>{{ $props.data?.afectado?.municipio?.nombre ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Dirección del afectado
            </p>
            <p class="break-all">{{ $props.data?.afectado?.direccion ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Teléfono del afectado
            </p>
            <p>{{ $props.data?.afectado?.telefono ?? "N/A" }}</p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
      <q-expansion-item label="Solicitud" header-class="tw-text-lg tw-font-bold tw-pt-0 tw-pl-0" default-opened
        class="tw-bg-white tw-px-4 tw-py-5">
        <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Número de radicado relacionado
            </p>
            <p>{{ $props.data?.solicitud?.radicadoRelacionado ?? " " }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de trámite
            </p>
            <p>{{ $props.data?.solicitud?.tipoTramite }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de evento
            </p>
            <p>{{ $props.data?.solicitud?.tipoEvento?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Número de Siniestro
            </p>
            <p>{{ $props.data?.solicitud?.siniestro?.siniestro }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de solicitud
            </p>
            <p>{{ $props.data?.solicitud?.tipoSolicitud?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Constancia de ejecutoriedad
            </p>
            <p>{{ $props.data?.solicitud?.constancia ? "Sí" : "No" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Fecha de dictamen de la Junta Regional de Calificación</p>
            <p>{{ $props.data?.solicitud?.constancia ? $props.data?.solicitud?.fechaDictamen : "" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Oficina
            </p>
            <p>
              {{ $props.data?.solicitud?.oficina?.nombre }}
            </p>
          </div>
          <div class="tw-col-span-3">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Descripción
            </p>
            <p class="tw-break-words tw-whitespace-normal">
              {{ $props.data?.solicitud?.descripcion }}
            </p>
          </div>

        </div>

        <!-- Documentos De entrada -->
        <div class="flex column flex-column-fixed q-mt-md tw-pl-3"
          v-if="allTypesDocs?.filter(it => it.tipo === 'De entrada').length">
          <p class="tw-text-label tw-font-semibold q-mb-sm">Documentos De entrada</p>
          <div class="flex column items-start q-gap-y-md">
            <q-card class="flex row items-center tw-gap-x-2 q-px-md q-py-xs" flat bordered style="width: auto" v-for="doc in allTypesDocs
              ?.filter(it => it.tipo === 'De entrada')
              .sort((a, b) => {
                const aStartsWithENT = a.nombre.startsWith('ENT');
                const bStartsWithENT = b.nombre.startsWith('ENT');
                if (aStartsWithENT && !bStartsWithENT) return -1;
                if (!aStartsWithENT && bStartsWithENT) return 1;
                return 0;
              })" :key="doc.id">
              <img v-if="extensiones.includes(obtenerExtension(doc.nombre).toLowerCase())" style="width: 26px" v-lazy
                :data-url="tipoIcon(obtenerExtension(doc.nombre))" alt="Icono de documento">
              <q-icon v-else name="description" size="xs" />
              <p class="tw-text-xs tw-font-semibold q-mx-sm">{{ doc.nombre }}</p>
              <div class="tw-flex tw-gap-1">
                <q-icon size="16px" class="tw-cursor-pointer" name="download"
                  @click="() => handleOpenDocFile(doc.id, doc.nombre)" />
                <q-icon size="16px" class="tw-cursor-pointer" name="info"
                  v-if="obtenerExtension(doc.nombre).toLowerCase() == 'pdf'"
                  @click="() => visualize(doc.id, allTypesDocs?.filter((it) => obtenerExtension(it.nombre).toLowerCase() === 'pdf'), true)" />
              </div>
            </q-card>
          </div>
        </div>
        <!-- Documentos de soporte -->
        <div class="flex column flex-column-fixed q-mt-md tw-pl-3"
          v-if="allTypesDocs?.filter(it => it.tipo === 'De soporte').length">
          <p class="tw-text-label tw-font-semibold q-mb-sm">Documento Soporte o Gestion </p>
          <div class="flex column items-start q-gap-y-md">
            <q-card class="flex row items-center tw-gap-x-2 q-px-md q-py-xs" flat bordered style="width: auto"
              v-for="doc in allTypesDocs?.filter(it => it.tipo === 'De soporte')" :key="doc.id">
              <img v-if="extensiones.includes(obtenerExtension(doc.nombre).toLowerCase())" style="width: 26px" v-lazy
                :data-url="tipoIcon(obtenerExtension(doc.nombre))" alt="Icono de documento">
              <q-icon v-else name="description" size="xs" />
              <p class="tw-text-xs tw-font-semibold q-mx-sm">{{ doc.nombre }}</p>
              <div class="tw-flex tw-gap-1">
                <q-icon size="16px" class="tw-cursor-pointer" name="download"
                  @click="() => handleOpenDocFile(doc.id, doc.nombre)" />
                <q-icon size="16px" class="tw-cursor-pointer" name="info"
                  v-if="obtenerExtension(doc.nombre).toLowerCase() == 'pdf'"
                  @click="() => visualize(doc.id, allTypesDocs?.filter((it) => obtenerExtension(it.nombre).toLowerCase() === 'pdf'), true)" />
              </div>
            </q-card>
          </div>
        </div>

        <!-- Documentos de salida -->
        <div class="flex column flex-column-fixed q-mt-md tw-pl-3"
          v-if="allTypesDocs?.filter(it => it.tipo === 'De salida').length">
          <p class="tw-text-label tw-font-semibold q-mb-sm">Documentos de salida</p>
          <div class="flex column items-start q-gap-y-md">
            <q-card class="flex row items-center tw-gap-x-2 q-px-md q-py-xs" flat bordered style="width: auto" v-for="doc in allTypesDocs
              ?.filter(it => it.tipo === 'De salida')
              .sort((a, b) => {
                const aStartsWithSAL = a.nombre.toUpperCase().startsWith('SAL');
                const bStartsWithSAL = b.nombre.toUpperCase().startsWith('SAL');
                if (aStartsWithSAL && !bStartsWithSAL) return -1;
                if (!aStartsWithSAL && bStartsWithSAL) return 1;
                return 0;
              })" :key="doc.id">
              <img v-if="extensiones.includes(obtenerExtension(doc.nombre).toLowerCase())" style="width: 26px" v-lazy
                :data-url="tipoIcon(obtenerExtension(doc.nombre))" alt="Icono de documento">
              <q-icon v-else name="description" size="xs" />
              <p class="tw-text-xs tw-font-semibold q-mx-sm">{{ doc.nombre }}</p>
              <div class="tw-flex tw-gap-1">
                <q-icon size="16px" class="tw-cursor-pointer" name="download"
                  @click="() => handleOpenDocFile(doc.id, doc.nombre)" />
                <q-icon size="16px" class="tw-cursor-pointer" name="info"
                  v-if="obtenerExtension(doc.nombre).toLowerCase() == 'pdf'"
                  @click="() => visualize(doc.id, allTypesDocs?.filter((it) => obtenerExtension(it.nombre).toLowerCase() === 'pdf'), true)" />
              </div>
            </q-card>
          </div>
        </div>
      </q-expansion-item>
    </q-card>
  </div>

  <EditInfoGeneral v-if="isEdit" :data="props.data" :docs="props.docs" :all-types-docs="props.allTypesDocs"
    :visualize="props.visualize" :metadatos-info="props.metadatosInfo" @cancelEdit="cancel" @save-data="saveEditData" />

</template>

<script lang="ts" setup>
import { ref } from "vue";
import moment from "moment";
import EditInfoGeneral from "./EditInfoGeneral.vue";
import { scrollToTop } from "src/utils/scrollUtils";
// @ts-ignore
import PDFIcon from "src/assets/pdf.svg";
// @ts-ignore
import excelIcon from "src/assets/excel.svg";
// @ts-ignore
import docxIcon from "src/assets/word.svg";
import { Medicina, Metadatos } from "src/interfaces";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
// @ts-ignore
import img from "src/assets/img.svg";
// @ts-ignore
import music from "src/assets/music.svg";
// @ts-ignore
import video from "src/assets/video.svg";
// @ts-ignore
import txt from "src/assets/txt.svg";
import zip from "assets/folder2.svg";
import msg from "assets/mail.svg";
import ppt from "assets/powerPoint.svg";
import xml from "assets/xml.svg";
import interrogation from "assets/interrogation.svg";
import { toast } from "src/helpers/toast";

interface InfoGeneralProps {
  data: Medicina;
  docs: any;
  allTypesDocs: any
  metadatosInfo: Metadatos
  visualize: (nodeId, list, action) => {},
  hideEditButton?: boolean;
}

const props = defineProps<InfoGeneralProps>();
const emit = defineEmits(['successSave', 'disabledTabs', 'activeTabs'])
const auth = useAuthStore()
const isEdit = ref(false)

const extensiones = ref([
  'pdf',
  'png',
  'jpg',
  'jpeg',
  'webp',
  'bmp',
  'txt',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'mp3',
  'mp4',
  'avi',
  'csv',
  'zip',
  'rar',
  'ppt',
  'pptx',
  'eml',
  'msg',
])

const tipoIcon = (tipo) => {
  if (['pdf', 'application/pdf'].includes(tipo.toLowerCase())) return PDFIcon
  if (['xls', 'xlsx', 'csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(tipo.toLowerCase())) return excelIcon
  if (['docx', 'doc', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(tipo.toLowerCase())) return docxIcon
  if (['jpeg', 'jpg', 'png', 'webp'].includes(tipo.toLowerCase())) return img
  if (['mp3'].includes(tipo.toLowerCase())) return music
  if (['avi', 'mp4'].includes(tipo.toLowerCase())) return video
  if (['txt', 'bmp'].includes(tipo.toLowerCase())) return txt
  if (['xml'].includes(tipo.toLowerCase())) return xml
  if (['zip', 'rar'].includes(tipo.toLowerCase())) return zip
  if (['ppt', 'pptx'].includes(tipo.toLowerCase())) return ppt
  if (['msg', 'eml'].includes(tipo.toLowerCase())) return msg
  return interrogation;
}

const obtenerExtension = (nombreArchivo) => {
  const punto = nombreArchivo.lastIndexOf('.');
  if (punto === -1) return '';
  return nombreArchivo.slice(punto + 1);
}

const handleOpenDocFile = async (id: string, name: string) => {
  try {
    const response = await sgdeaAxios.get('/radicados/consultar_documento/' + id);

    const byteCharacters = atob(response.data.base64x);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });

    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.href = URL.createObjectURL(blob);
    enlaceDescarga.download = name;

    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
    document.body.removeChild(enlaceDescarga);
  } catch (error) {
    toast.error('Error al descargar el archivo');
  }
};

const saveEditData = async () => {
  emit('successSave')
  emit('activeTabs')
  isEdit.value = false
  scrollToTop()
}

const cancel = () => {
  emit('activeTabs')
  isEdit.value = false
  scrollToTop()
}
</script>

<style scoped>
.break-all {
  word-break: break-all;
  overflow-wrap: break-word;
}
</style>