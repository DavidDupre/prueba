<template>
  <div class="[&>*]:tw-mb-4">
    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl tw-w-full" flat>
      <q-expansion-item label="Información General del caso" header-class="tw-text-lg tw-font-bold  tw-pl-0"
        default-opened class="tw-bg-white tw-px-4 tw-py-5">
        <template v-slot:header>
          <div class="row justify-between tw-w-full">
            <b class="tw-text-lg">Información General del Caso</b>
          </div>
        </template>
        <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Número de Radicado
            </p>
            <p>{{ $props.dataReclasificacion?.informacionCaso?.idRadicado ||
              $props.dataReclasificacion?.informacionCaso?.nroRadicado }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de Solicitud
            </p>
            <p>{{ tipoSolicitud }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Nombre Afectado</p>
            <p>{{ $props.dataReclasificacion?.datosReclasificacion?.nombreAfectado ||
              $props.dataReclasificacion?.informacionCaso?.afectado?.nombre }}</p>
          </div>
<!--          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">-->
<!--            <p class="tw-text-label tw-font-semibold tw-pb-1">Colaborador</p>-->
<!--            <p>{{ $props.dataReclasificacion?.datosReclasificacion?.nombreRemitente ||-->
<!--              $props.dataReclasificacion?.informacionCaso?.remitente?.nombre }}</p>-->
<!--          </div>-->
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-start">
            <p class="tw-text-label tw-font-semibold tw-pb-0 tw-mb-1">
              Fecha de Radicación
            </p>
            <p>{{ fechaRadicacionFormateada }}</p>
          </div>

          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Tiempo por Vencer</p>
            <p>{{ tiempoPorVencer }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Fecha de Vencimiento
            </p>
            <p>{{ fechaVencimiento }}</p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>
    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
      <q-expansion-item label="Afectado" header-class="tw-text-lg tw-font-bold tw-text-red tw-pl-0" default-opened
        class="tw-bg-white tw-px-4 tw-py-5">
        <template v-slot:header>
          <div class="row justify-between tw-w-full">
            <b class="text-bold tw-text-xl tw-flex-1 q-py-md">Afectado</b>
          </div>
        </template>
        <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de Documento del Afectado
            </p>
            <p>{{ tipoDoc }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Número de Documento del Afectado
            </p>
            <p>{{ $props.dataReclasificacion?.datosReclasificacion?.numeroDocumentoAfectado ||
              $props.dataReclasificacion?.informacionCaso?.afectado?.numeroDocumento }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Nombre del Afectado
            </p>
            <p>{{ $props.dataReclasificacion?.datosReclasificacion?.nombreAfectado ||
              $props.dataReclasificacion?.informacionCaso?.afectado?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              ¿Pertenece a la Comunidad LGBTIQ+?
            </p>
            <p>{{ $props.dataReclasificacion?.datosReclasificacion?.lgtbtq ||
              $props.dataReclasificacion?.informacionCaso?.lgtbtq ? 'Si' : 'No' }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Sexo</p>
            <p>{{ sexo }}</p>
          </div>
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Condición Especial
            </p>
            <p>{{ tipoCondicion || $props.dataReclasificacion?.informacionCaso?.afectado?.numeroDocumento }}</p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>
    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
      <q-expansion-item label="Medios de Contacto y Envio de Respuesta (afectado)"
        header-class="tw-text-lg tw-font-bold tw-text-red tw-pl-0" class="tw-bg-white tw-px-4 tw-py-5" default-opened>
        <template v-slot:header>
          <div class="row justify-between tw-w-full">
            <b class="text-bold tw-text-xl tw-flex-1 q-py-md">Medios de Contacto y Envio de Respuesta (afectado)</b>
          </div>
        </template>
        <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3 tw-gap-y-4">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Correo Electrónico
            </p>
            <p>{{ $props.dataReclasificacion?.datosReclasificacion?.correoElectronico ||
              $props.dataReclasificacion?.informacionCaso?.afectado?.correoElectronico }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Teléfono Celular
            </p>
            <p>{{ $props.dataReclasificacion?.datosReclasificacion?.telefonoCelular ||
              $props.dataReclasificacion?.informacionCaso?.afectado?.telefonoCelular }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              País de Contacto
            </p>
            <p>{{ paisContacto }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Departamento de Contacto
            </p>
            <p>{{ props.dataReclasificacion?.datosReclasificacion?.paisId ||
              props.dataReclasificacion?.informacionCaso?.afectado?.pais?.idPais === 425 ?
              departamentoContacto : 'N/A' }}</p>
          </div>

          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Ciudad de Contacto
            </p>
            <p>{{ props.dataReclasificacion?.datosReclasificacion?.paisId ||
              props.dataReclasificacion?.informacionCaso?.afectado?.pais?.idPais === 425 ?
              municipioContacto : 'N/A' }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Dirección de Contacto
            </p>
            <p>{{ $props.dataReclasificacion?.datosReclasificacion?.direccion ||
              props.dataReclasificacion?.informacionCaso?.afectado?.direccion }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Medio por el que Desea Recibir Respuesta
            </p>
            <p>{{ $props.dataReclasificacion?.datosReclasificacion?.medioRespuestaId === 1 ?
              'Correo electrónico' : 'Físico' }}</p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>
    <!-- <q-card class="tw-px-4 tw-py-2 tw-rounded-xl tw-w-full" flat>
      <q-expansion-item label="Solicitud" header-class="tw-text-lg tw-font-bold tw-text-red tw-pl-0" default-opened
        class="tw-bg-white tw-px-4 tw-py-5">
        <template v-slot:header>
          <div class="row justify-between tw-w-full">
            <b class="text-bold tw-text-xl tw-flex-1 q-py-md">Solicitud</b>
          </div>
        </template>
        <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3 tw-gap-y-4 tw-mb-5">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold">Tipologísa de la PQRD</p>
            <p>{{ tipoTipologia || 'N/A' }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de Solicitud
            </p>
            <p>{{ tipoSolicitud }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Detalle</p>
            <p>{{ $props.dataReclasificacion?.datosReclasificacion?.observaciones ||
              props.dataReclasificacion?.informacionCaso?.solicitud?.observaciones }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Producto</p>
            <p>{{ producto || props.dataReclasificacion?.informacionCaso?.solicitud?.tipoproducto?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Información Públicax
            </p>
            <p>{{ $props.dataReclasificacion?.datosReclasificacion?.accesoInformacionPublica ||
              props.dataReclasificacion?.informacionCaso?.solicitud?.accesoInformacionPublica ? 'Si' : 'No' }}</p>
          </div>
        </div>
      </q-expansion-item>
    </q-card> -->

    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl tw-w-full" flat>
      <q-expansion-item label="Solicitud" header-class="tw-text-lg tw-font-bold tw-text-red tw-pl-0" default-opened
        class="tw-bg-white tw-px-4 tw-py-5">
        <template v-slot:header>
          <div class="row justify-between tw-w-full">
            <b class="text-bold tw-text-xl tw-flex-1 q-py-md">Solicitud</b>
          </div>
        </template>

        <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3 tw-gap-y-4 tw-mb-5">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold">Tipología de la PQRD</p>
            <p>{{ tipoTipologia || 'N/A' }}</p>
          </div>

          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Tipo de Solicitud</p>
            <p>{{ tipoSolicitud }}</p>
          </div>

          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Producto</p>
            <p>{{ producto || props.dataReclasificacion?.informacionCaso?.solicitud?.tipoproducto?.nombre }}</p>
          </div>

          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Información Públicas</p>
            <p>{{ $props.dataReclasificacion?.datosReclasificacion?.accesoInformacionPublica ||
              props.dataReclasificacion?.informacionCaso?.solicitud?.accesoInformacionPublica ? 'Si' : 'No' }}</p>
          </div>

          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Proceso</p>
            <p>N/A</p>
          </div>

          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Causa Raíz</p>
            <p>{{ causaRaiz || props.dataReclasificacion?.informacionCaso?.solicitud?.causaRaiz?.nombre || 'N/A' }}
            </p>
          </div>

          <div class="tw-col-span-5 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Detalle</p>
            <p>{{ $props.dataReclasificacion?.datosReclasificacion?.observaciones ||
              props.dataReclasificacion?.informacionCaso?.solicitud?.observaciones }}</p>
          </div>
        </div>

        <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3 tw-gap-y-4 tw-mb-5">
          <div class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
            <q-separator spaced />
            <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Información Adicional</h3>

            <div class="tw-col-span-12">
              <p class="tw-text-label tw-font-semibold tw-pb-1">Observación</p>
              <p>{{ $props.dataReclasificacion?.datosReclasificacion?.observaciones ||
                props.dataReclasificacion?.informacionCaso?.solicitud?.observaciones }}</p>
            </div>


            <p class="tw-text-label tw-font-semibold tw-pb-2 tw-mt-5">Documento de Entrada</p>

            <div class="flex column q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
              <q-card class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-sm" flat bordered :key="doc.id"
                v-for="doc in loadedInputDocs">
                <img style="width: 26px" v-lazy :data-url="tipoIcon(doc.formato)">
                <p class="tw-text-sm tw-font-semibold">{{ doc.nombre }}</p>
                <div class="tw-flex tw-gap-1">
                  <q-icon size="16px" class="tw-cursor-pointer" name="download"
                    @click="() => handleOpenDocFile(doc.id, doc.nombre)" />
                  <q-icon size="16px" class="tw-cursor-pointer" name="info" v-if="doc.formato == 'application/pdf'"
                    @click="visualize(doc.id)" />
                </div>
              </q-card>
            </div>


            <p class="tw-text-label tw-font-semibold tw-pb-2 tw-mt-5">Documentos Adjuntos De salida</p>

            <div class="flex column q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
              <q-card class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-sm" flat bordered :key="doc.id"
                v-for="doc in loadedDocs.filter((it) => it.nombre !== dataReclasificacion.idRadicado + '.pdf')">
                <img style="width: 26px" v-lazy :data-url="tipoIcon(doc.formato)">
                <p class="tw-text-sm tw-font-semibold">{{ doc.nombre }}</p>
                <div class="tw-flex tw-gap-1">
                  <q-icon size="16px" class="tw-cursor-pointer" name="download"
                    @click="() => handleOpenDocFile(doc.id, doc.nombre)" />
                  <q-icon size="16px" class="tw-cursor-pointer" name="info" v-if="doc.formato == 'application/pdf'"
                    @click="visualize(doc.id)" />
                </div>
              </q-card>
            </div>
          </div>
        </div>
      </q-expansion-item>
    </q-card>

  </div>
</template>

<script setup lang="ts">
import PDFIcon from "src/assets/pdf.svg";
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
import { sgdeaAxios, adminAxios } from "src/services";
import { Ref, onMounted, ref } from "vue";
import { useDepartments, useMunicipalities } from 'src/composables/useVersion';
import { computed } from "vue";
import { decode } from "js-base64";
import { useRoute } from 'vue-router';
import { fourthFormatDate } from "src/helpers/formtDate";


const route = useRoute();
const fechaVencimiento = ref(route.query.fecha ? decode(route.query.fecha as string) : "Sin fecha");
const tiempoPorVencer = ref(route.query.tiempo ? decode(route.query.tiempo as string) : "-");

const props = withDefaults(
  defineProps<{
    dataReclasificacion: any,
  }>(),
  {
    dataReclasificacion: null,
  }
)

onMounted(async () => {
  await loadListadoTiposSolicitud();
  await loadTipoDoc();
  await loadGenero();
  await loadListadoCondiciones();
  await loadPaises();
  await loadDepartamentos();
  await loadListadoTipologia();
  await loadListadoProductosPQRD();
  await getAllRegisters();
})

const listadoTiposSolicitud: Ref<any[]> = ref([])
const moduloOrigen = route.query.moduloOrigen;
const listadoTipoDoc: Ref<any[]> = ref([]);
const generoOptions: Ref<any[]> = ref([]);
const listadoCondiciones: Ref<any[]> = ref([]);
const paiseOptions: Ref<any[]> = ref([]);
const departamentoOptions: Ref<any[]> = ref([]);
const municipioOptions: Ref<any[]> = ref([]);
const listadoTipologiaOptions: Ref<any[]> = ref([])
const listadoProductosPQRD: Ref<any[]> = ref([])
const tipoSolicitud = ref();
const tipoDoc = ref();
const sexo = ref();
const tipoCondicion = ref();
const paisContacto = ref();
const departamentoContacto = ref();
const municipioContacto = ref();
const tipoTipologia = ref();
const producto = ref();
const loadedDocs = ref<any[]>([]);

const tipoIcon = (tipo) => {
  if (tipo.toLowerCase() === 'application/pdf') return PDFIcon
  if (['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(tipo.toLowerCase())) return excelIcon
  if (['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(tipo.toLowerCase())) return docxIcon
  if (['image/jpg', 'image/png', 'image/jpeg'].includes(tipo.toLowerCase())) return img
  if (['audio/mpeg'].includes(tipo.toLowerCase())) return music
  if (['video/x-msvideo', 'video/mp4'].includes(tipo.toLowerCase())) return video
  if (['text/plain'].includes(tipo.toLowerCase())) return txt
};

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
    console.error(error);
  }
};

const getMimeTypeFromExtension = (filename) => {
  if (!filename) return "text/plain";

  const extension = filename.split('.').pop().toLowerCase();

  const mimeTypes = {
    pdf: "application/pdf",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    mp3: "audio/mpeg",
    mp4: "video/mp4",
    avi: "video/x-msvideo",
    txt: "text/plain",
    zip: "application/zip",
    rar: "application/vnd.rar"
  };

  return mimeTypes[extension] || "text/plain";
};

async function getAllRegisters() {
  try {
    if (moduloOrigen !== '8') return; // Si no es el módulo 8, salir

    const { data: files } = await sgdeaAxios.get(
      `/pqrd/obtenerDocs?idPqrd=${route.params.id || props.dataReclasificacion.id}`
    );

    const documentos = Array.isArray(files) ? files : [];

    loadedDocs.value = documentos.map(it => ({
      formato: it.formato ? it.formato.toLowerCase() : getMimeTypeFromExtension(it.nombre),
      nombre: it.nombre,
      fecha: fourthFormatDate(it.fechaCargue),
      cargado_por: it.usuario ? `${it.usuario.firstname} ${it.usuario.lastname}` : "Administrador",
      tipo: it.tipo || "De Gestión",
      id: it.id,
      es_devolucion: it.es_devolucion || false
    }));
  } catch (error) {
    console.error(error);
  }
}


const fechaRadicacionFormateada = computed(() => {
  const fechaString = props.dataReclasificacion?.informacionCaso?.fechaRadicacion;
  if (!fechaString) return "N/A";
  let fecha: Date;
  try {
    if (fechaString.includes("/") && fechaString.includes(" ")) {

      const [fechaPart, horaPart] = fechaString.split(" ");
      const [dia, mes, anio] = fechaPart.split("/");
      const [hora, minuto, segundo] = horaPart.split(":");
      fecha = new Date(Number(anio), Number(mes) - 1, Number(dia), Number(hora), Number(minuto), Number(segundo));
    } else {

      fecha = new Date(fechaString);
    }
    if (isNaN(fecha.getTime())) return "Fecha inválida";
    return `${fecha.getFullYear()}/${String(fecha.getMonth() + 1).padStart(2, "0")}/${String(fecha.getDate()).padStart(2, "0")} ${String(fecha.getHours()).padStart(2, "0")}:${String(fecha.getMinutes()).padStart(2, "0")}`;
  } catch (error) {
    return "Fecha inválida";
  }
});

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

      tipoSolicitud.value = listadoTiposSolicitud.value.find(
        (solicitud) => solicitud.value === (props.dataReclasificacion?.datosReclasificacion?.tipoSolicitudId || props.dataReclasificacion?.informacionCaso?.solicitud?.tipoSolicitud.id))?.label;

    }
  } catch (error) {
    console.error(error);
  }
}

async function loadTipoDoc() {
  const { data } = await sgdeaAxios.get("/correspondencia/comunicacion/listadoTipoIdentificacion");
  listadoTipoDoc.value = data.map((val: any) => {
    return {
      label: val.nombre,
      value: val.id,
    };
  }),
    tipoDoc.value = listadoTipoDoc.value.find(
      (doc) => doc.value === (props.dataReclasificacion?.datosReclasificacion?.tipoDocumentoAfectadoId || props.dataReclasificacion?.informacionCaso?.afectado?.tipoDocumento.id))?.label;
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
      sexo.value = generoOptions.value.find(
        (genero) => genero.value === (props.dataReclasificacion?.datosReclasificacion?.generoId || props.dataReclasificacion?.informacionCaso?.afectado?.genero?.id))?.label;
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
      const condicionesIds = JSON.parse(props.dataReclasificacion?.datosReclasificacion?.listadoCondiciones || "[]");
      tipoCondicion.value = listadoCondiciones.value
        .filter((condicion) => condicionesIds.includes(condicion.value))
        .map((condicion) => condicion.label)
        .join(", ");
    }
    //listadoCondiciones.value = sortOptions(listadoCondiciones.value)
  } catch (error) {
    console.error(error);
  }
}

async function loadPaises() {
  const { data } = await adminAxios.get("/paises/list");
  paiseOptions.value = data.map((val: any) => {
    return {
      label: val.nombre,
      value: val.idPais,
    };
  })
  paisContacto.value = paiseOptions.value.find(
    (pais) => pais.value === (props.dataReclasificacion?.datosReclasificacion?.paisId || props.dataReclasificacion?.informacionCaso?.afectado?.pais?.idPais))?.label;
}

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

async function loadDepartamentos() {
  if (props.dataReclasificacion?.datosReclasificacion?.paisId || props.dataReclasificacion?.informacionCaso?.afectado?.pais?.idPais === 425) {
    const { optionsDepartments } = await useDepartments(425);
    departamentoOptions.value = sortOptions(optionsDepartments.value);
    const { optionsMunicipalities } = await useMunicipalities((props.dataReclasificacion?.datosReclasificacion?.departamentoId || props.dataReclasificacion?.informacionCaso?.afectado?.departamento?.idDepartamento));
    municipioOptions.value = sortOptions(optionsMunicipalities.value)

    departamentoContacto.value = departamentoOptions.value.find(
      (departamento) => departamento.value === (props.dataReclasificacion?.datosReclasificacion?.departamentoId || props.dataReclasificacion?.informacionCaso?.afectado?.departamento?.idDepartamento))?.label;

    municipioContacto.value = municipioOptions.value.find(
      (municipio) => municipio.value === (props.dataReclasificacion?.datosReclasificacion?.municipioId || props.dataReclasificacion?.informacionCaso?.afectado?.municipio?.idMunicipio))?.label;
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
      tipoTipologia.value = listadoTipologiaOptions.value.find(
        (tipologia) => tipologia.value === (props.dataReclasificacion?.datosReclasificacion?.tipoPqrdId || props.dataReclasificacion?.informacionCaso?.solicitud?.tipoPqrd?.id))?.label;
    }
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
      producto.value = listadoProductosPQRD.value.find(
        (producto) => producto.value === props.dataReclasificacion?.datosReclasificacion.tipoProductoId)?.label;
    }
    //filteredProductos.value = listadoProductosPQRD.value
  } catch (error) {
    console.error(error);
  }
}

</script>

<style>
/* Add your styles here */
</style>
