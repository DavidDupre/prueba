<template>
  <div class="[&>*]:tw-mb-4">
    <a
      @click.prevent="goBack"
      class="text-primary q-mb-md block cursor-pointer"
      style="text-decoration: none"
    >
      <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
      <b> Volver</b>
    </a>
    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl tw-w-full" flat>
      <q-expansion-item
        label="Información General del caso"
        header-class="tw-text-lg tw-font-bold  tw-pl-0"
        default-opened
        class="tw-bg-white tw-px-4 tw-py-5"
      >
        <template v-slot:header>
          <div class="row justify-between tw-w-full">
            <b class="tw-text-lg">Información General del Caso</b>
          </div>
        </template>
        <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Número de radicado
            </p>
            <p>{{ responseML?.idRadicado }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Canal de radicación
            </p>
            <p>{{ responseML?.remitente.canalRadicacion.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de solicitud
            </p>
            <p>{{ responseML?.solicitud?.tipoSolicitud?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Fecha de vencimiento
            </p>
            <p>
              {{
                responseML?.asignacion?.fechaVencimiento
                  ? moment(responseML?.asignacion?.fechaVencimiento).format(
                      "DD-MM-YYYY HH:mm"
                    )
                  : ""
              }}
            </p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl tw-w-full" flat>
      <q-expansion-item
        label="Metadatos de la asignación"
        header-class="tw-text-lg tw-font-bold  tw-pl-0"
        default-opened
        class="tw-bg-white tw-px-4 tw-py-5"
      >
        <div class="tw-grid tw-grid-cols-6 tw-gap-4 tw-pl-3">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Proceso Medicina Laboral
            </p>
            <p>{{ metadatosInfo?.process.proceso }}</p>
          </div>
          <div class="tw-col-span-2 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Subproceso</p>
            <p>{{ metadatosInfo?.subProceso.subProceso }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Formato de tiempo
            </p>
            <p>{{ metadatosInfo?.formatoFecha }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Tiempo</p>
            <p>{{ metadatosInfo?.tiempo }}</p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
      <q-expansion-item
        label="Remitente"
        header-class="tw-text-lg tw-font-bold tw-text-red tw-pl-0"
        default-opened
        class="tw-bg-white tw-px-4 tw-py-5"
      >
        <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de remitente
            </p>
            <p>{{ responseML?.remitente?.tipoRemitente?.nombre ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de documento del remitente
            </p>
            <p>
              {{ responseML?.remitente?.tipoDocumento?.nombre }}
            </p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Número de documento del remitente
            </p>
            <p>
              {{ responseML?.remitente?.numeroDocumento ?? "N/A" }}
            </p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Nombre del remitente
            </p>
            <p>{{ responseML?.remitente?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              País del remitente
            </p>
            <p>{{ responseML?.remitente?.pais?.nombre ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Departamento del remitente
            </p>
            <p>{{ responseML?.remitente?.departamento?.nombre ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Municipio del remitente
            </p>
            <p>{{ responseML?.remitente?.municipio?.nombre ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Dirección del remitente
            </p>
            <p>{{ responseML?.remitente?.direccion ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Teléfono del remitente
            </p>
            <p>{{ responseML?.remitente?.telefono ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Correo electrónico del remitente
            </p>
            <p>{{ responseML?.remitente?.email ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Medio que autoriza para envío de respuesta
            </p>
            <p>
              {{ responseML?.remitente?.medioRespuesta.nombre }}
            </p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
      <q-expansion-item
        label="Afectado"
        header-class="tw-text-lg tw-font-bold tw-text-red tw-pl-0"
        default-opened
        class="tw-bg-white tw-px-4 tw-py-5"
      >
        <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de documento del afectado
            </p>
            <p>{{ responseML?.afectado?.tipoDocumento?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Número de documento del afectado
            </p>
            <p>
              {{ responseML?.afectado?.numeroDocumento ?? "N/A" }}
            </p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Nombre del Afectado
            </p>
            <p>{{ responseML?.afectado?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Correo del afectado
            </p>
            <p>
              {{ responseML?.afectado.correoElectronico }}
            </p>
          </div>

          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              País del afectado
            </p>
            <p>{{ responseML?.afectado?.pais?.nombre ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Departamento del afectado
            </p>
            <p>{{ responseML?.afectado?.departamento?.nombre ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Municipio del afectado
            </p>
            <p>{{ responseML?.afectado?.municipio?.nombre ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Dirección del afectado
            </p>
            <p>{{ responseML?.afectado?.direccion ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Teléfono del afectado
            </p>
            <p>{{ responseML?.afectado?.telefono ?? "N/A" }}</p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
      <q-expansion-item
        label="Solicitud"
        header-class="tw-text-lg tw-font-bold tw-text-red tw-pl-0"
        default-opened
        class="tw-bg-white tw-px-4 tw-py-5"
      >
        <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Número de radicado relacionado
            </p>
            <p>{{ responseML?.solicitud?.radicadoRelacionado ?? " " }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de trámite
            </p>
            <p>{{ responseML?.solicitud?.tipoTramite }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Tipo de evento</p>
            <p>{{ responseML?.solicitud?.tipoEvento?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Número de Siniestro
            </p>
            <p>{{ responseML?.solicitud?.siniestro?.siniestro }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de solicitud
            </p>
            <p>{{ responseML?.solicitud?.tipoSolicitud?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Constancia de ejecutoriedad
            </p>
            <p>{{ responseML?.solicitud?.constancia ? "Sí" : "No" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Fecha de dictamen de la Junta Regional de Calificación
            </p>
            <p>
              {{
                responseML?.solicitud?.constancia
                  ? responseML?.solicitud?.fechaDictamen
                  : ""
              }}
            </p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Oficina</p>
            <p>
              {{ responseML?.solicitud?.oficina?.nombre }}
            </p>
          </div>
          <div class="tw-col-span-3">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Descripción</p>
            <p>{{ responseML?.solicitud?.descripcion }}</p>
          </div>
        </div>

        <div
          class="flex column flex-column-fixed q-mt-md tw-pl-3"
          v-if="allDocs?.soporte?.length"
        >
          <p class="tw-text-label tw-font-semibold">Documentos de soporte</p>
          <div class="flex q-mt-xs row q-gutter-sm">
            <q-card
              class="flex row items-center tw-gap-x-2 q-px-md"
              flat
              bordered
              :key="doc.id"
              v-for="doc in listDocs2?.filter(
                (it) => it.nombre === data?.idRadicado + '.pdf'
              )"
            >
              <img
                v-if="
                  extensiones.includes(
                    obtenerExtension(doc.nombre).toLowerCase()
                  )
                "
                style="width: 26px"
                v-lazy :data-url="tipoIcon(obtenerExtension(doc.nombre))"
                alt="Icono de documento"
              />
              <q-icon v-else name="description" size="xs" />
              <p class="tw-text-xs tw-font-semibold">{{ doc.nombre }}</p>
              <div class="tw-flex tw-gap-1">
                <q-icon
                  size="16px"
                  class="tw-cursor-pointer"
                  name="download"
                  @click="() => handleOpenDocFile(doc.id, doc.nombre)"
                />
                <q-icon
                  size="16px"
                  class="tw-cursor-pointer"
                  name="info"
                  v-if="obtenerExtension(doc.nombre).toLowerCase() == 'pdf'"
                  @click="getBlobToIframe(doc.id)"
                />
              </div>
            </q-card>
          </div>
        </div>

        <div
          class="flex column flex-column-fixed q-mt-md tw-pl-3"
          v-if="allDocs?.adjunto?.length"
        >
          <p class="tw-text-label tw-font-semibold">Documentos adjuntos</p>
          <template
            v-for="doc in listDocs2?.filter(
              (it) =>
                it.nombre !== data?.idRadicado + '.pdf' &&
                it.tipo === 'De entrada'
            )"
            :key="doc.id"
          >
            <q-card
              class="flex row tw-items-center q-px-md tw-mt-4 tw-w-1/3"
              flat
              bordered
            >
              <img
                v-if="
                  extensiones.includes(
                    obtenerExtension(doc.nombre).toLowerCase()
                  )
                "
                style="width: 26px"
                v-lazy :data-url="tipoIcon(obtenerExtension(doc.nombre))"
                alt="Icono de documento"
              />
              <q-icon v-else name="description" size="xs" />
              <p
                class="tw-text-xs tw-font-semibold overflow-hidden tw-ml-2 col"
              >
                {{ doc.nombre }}
              </p>
              <div class="tw-flex tw-gap-1">
                <q-icon
                  size="16px"
                  class="tw-cursor-pointer"
                  name="download"
                  @click="() => handleOpenDocFile(doc.id, doc.nombre)"
                />
                <q-icon
                  size="16px"
                  class="tw-cursor-pointer"
                  name="info"
                  v-if="obtenerExtension(doc.nombre).toLowerCase() == 'pdf'"
                  @click="getBlobToIframe(doc.id)"
                />
              </div>
            </q-card>
          </template>
        </div>
      </q-expansion-item>
    </q-card>
    <div v-if="visualizadorPDF" class="tw-h-full tw-w-full">
      <q-dialog v-model="visualizadorPDF" seamless position="right" class="">
        <q-card class="tw-h-full tw-w-[2100px] tw-z-[1000] tw-overflow-hidden">
          <q-btn
            @click="visualizadorPDF = false"
            class="tw-absolute tw-ml-5 tw-mt-20 tw-z-[2000] tw-text-white tw-bg-red-500"
            >Cerrar</q-btn
          >
          <iframe
            class="tw-h-full tw-w-full"
            :src="iframePdfUrl"
            frameborder="0"
          ></iframe>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import moment from "moment";
// @ts-ignore
import PDFIcon from "src/assets/pdf.svg";
// @ts-ignore
import excelIcon from "src/assets/excel.svg";
// @ts-ignore
import docxIcon from "src/assets/word.svg";
import { DocsBD, Medicina, Metadatos } from "src/interfaces";
import { sgdeaAxios } from "src/services";
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
import { ref, Ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "src/helpers/toast";
import { fourthFormatDate } from "src/helpers/formtDate";

interface InfoGeneralProps {
  data: Medicina;
  docs: any;
  allTypesDocs: any;
  metadatosInfo: Metadatos;
  visualize: (nodeId, list, action) => {};
}

const props = defineProps<InfoGeneralProps>();
const router = useRouter();
const route = useRoute();

const nameDocument = ref("");
const iframePdfUrl = ref("");
const visualizadorPDF = ref(false);
const allDocs = ref();
const listDocs2 = ref([]);
const listDocs = ref([]);
const loadingDocs = ref(true);
const dbDocs: Ref<DocsBD[]> = ref([]);
const metadatosInfo: Ref<Metadatos | null> = ref(null);

const responseML: Ref<Medicina | null> = ref(null);
const extensiones = ref([
  "pdf",
  "png",
  "jpg",
  "jpeg",
  "webp",
  "bmp",
  "txt",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "mp3",
  "mp4",
  "avi",
  "csv",
  "zip",
  "rar",
  "ppt",
  "pptx",
  "eml",
  "msg",
]);

function goBack() {
  router.go(-1);
}

const getBlobToIframe = async (id: string) => {
  const { data } = await sgdeaAxios.get(`/radicados/consultar_documento/${id}`);

  if (id) {
    nameDocument.value = listDocs2.value.find((it) => it.id === id)?.nombre;
  }

  const byteCharacters = atob(data.base64x);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });

  iframePdfUrl.value = URL.createObjectURL(blob);

  visualizadorPDF.value = true;
};

const tipoIcon = (tipo) => {
  if (['pdf', 'application/pdf'].includes(tipo.toLowerCase())) return PDFIcon;
  if (
    [
      'xls',
      'xlsx',
      'csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ].includes(tipo.toLowerCase())
  ) return excelIcon;
  if (
    [
      'docx',
      'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ].includes(tipo.toLowerCase())
  ) return docxIcon;
  if (
    ['jpeg', 'jpg', 'png', 'webp'].includes(tipo.toLowerCase())
  ) return img;
  if (['mp3'].includes(tipo.toLowerCase())) return music;
  if (['avi', 'mp4'].includes(tipo.toLowerCase())) return video;
  if (['txt', 'bmp'].includes(tipo.toLowerCase())) return txt;
  if (['xml'].includes(tipo.toLowerCase())) return xml;
  if (['zip', 'rar'].includes(tipo.toLowerCase())) return zip;
  if (['ppt', 'pptx'].includes(tipo.toLowerCase())) return ppt;
  if (['msg', 'eml'].includes(tipo.toLowerCase())) return msg;
  return interrogation;
};

const obtenerExtension = (nombreArchivo) => {
  const punto = nombreArchivo.lastIndexOf(".");
  if (punto === -1) return "";
  return nombreArchivo.slice(punto + 1);
};

const getMetadatos = async () => {
  try {
    const response = await sgdeaAxios.get(
      `/medicina/get-Ml-Metadatos/${responseML.value.id}`
    );
    if (response.status === 200) {
      metadatosInfo.value = response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const getData = async () => {
  try {
    const id = route.params.id;
    const { data } = await sgdeaAxios.get<Medicina>(`/medicina/casos/${id}`);
    responseML.value = data;
  } catch (error) {
    toast.error("Ocurrió un problema al obtener el caso.");
  }
};

async function getDocs() {
  const { data: files }: { data } = await sgdeaAxios.get(
    `/medicina/documentos/${responseML.value.id}`
  );
  dbDocs.value = files;



  listDocs.value = files
    .map((it) => ({
      formato: it?.formato,
      nombre: it?.nombre,
      fecha: fourthFormatDate(it.fechaCargue),
      cargado_por: it.usuario.firstname + " " + it.usuario.lastname,
      tipo: `De ${it.tipoDocumento.toLowerCase()}`,
      id: it?.nodeId,
    }))
    .filter((it) => !it.tipo.includes("Respuesta"));

  listDocs2.value = files
    .map((it) => ({
      formato: it?.formato,
      nombre: it?.nombre,
      fecha: fourthFormatDate(it.fechaCargue),
      cargado_por: it.usuario.firstname + " " + it.usuario.lastname,
      tipo: `De ${it.tipoDocumento.toLowerCase()}`,
      id: it?.nodeId,
      tipoDocumento: it.tipoDocumento,
    }))
    .filter((it) => !it.tipo.includes("Respuesta"));

  const archivoRadicado = [];
  const otrosArchivos = [];
  listDocs.value.forEach((archivo) => {
    if (archivo.nombre.includes(responseML.value.idRadicado)) {
      archivoRadicado.push(archivo);
    } else {
      otrosArchivos.push(archivo);
    }
  });

  allDocs.value = { soporte: archivoRadicado, adjunto: otrosArchivos };
  loadingDocs.value = false;
}

const handleOpenDocFile = async (id: string, name: string) => {
  try {
    const response = await sgdeaAxios.get(
      "/radicados/consultar_documento/" + id
    );

    const byteCharacters = atob(response.data.base64x);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/octet-stream" });

    const enlaceDescarga = document.createElement("a");
    enlaceDescarga.href = URL.createObjectURL(blob);
    enlaceDescarga.download = name;

    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
    document.body.removeChild(enlaceDescarga);
  } catch (error) {
    console.error(error);
  }
};
onMounted(async () => {
  await getData();
  await getDocs();
  await getMetadatos();
});
</script>
