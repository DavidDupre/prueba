<template>
  <a
    @click.prevent="goBack"
    class="text-primary q-mb-md block cursor-pointer"
    style="text-decoration: none"
  >
    <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
    <b> Volver</b>
  </a>
  <div class="col tw-pt-4 q-mx-md">
    <h1 class="tw-text-3xl tw-font-bold">Información General del Proceso</h1>
    <p class="q-mt-xs">
      Aquí podrá visualizar los datos de la tutela que seleccionó
    </p>
  </div>
  <q-expansion-item
    default-opened
    dense
    expand-separator
    class="tw-bg-white q-mt-md"
    style="border-radius: 5px"
  >
    <template v-slot:header>
      <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Juzgado Remitente</h3>
    </template>
    <q-card
      class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 q-mx-md"
      style="box-shadow: none"
    >
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Trámite</p>
        <p>Tutela</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">País</p>
        <p>
          {{
            detalleTutela && detalleTutela.juzgado && detalleTutela.juzgado.pais
              ? detalleTutela.juzgado.pais
              : ""
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Departamento</p>
        <p>
          {{
            detalleTutela &&
            detalleTutela.juzgado &&
            detalleTutela.juzgado.departamento
              ? detalleTutela.juzgado.departamento
              : ""
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Municipio</p>
        <p>
          {{
            detalleTutela &&
            detalleTutela.juzgado &&
            detalleTutela.juzgado.municipio
              ? detalleTutela.juzgado.municipio
              : ""
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Nombre del Juzgado</p>
        <p>
          {{
            detalleTutela &&
            detalleTutela.juzgado &&
            detalleTutela.juzgado.nombre
              ? detalleTutela.juzgado.nombre
              : ""
          }}
        </p>
      </div>

      <div>
        <p class="tw-font-bold tw-text-gray-dark">Dirección de Juzgado</p>
        <p>
          {{
            detalleTutela &&
            detalleTutela.juzgado &&
            detalleTutela.juzgado.direccion
              ? detalleTutela.juzgado.direccion
              : ""
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Teléfono</p>
        <p>
          {{
            detalleTutela &&
            detalleTutela.juzgado &&
            detalleTutela.juzgado.telefono
              ? detalleTutela.juzgado.telefono
              : ""
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Celular</p>
        <p>
          {{
            detalleTutela &&
            detalleTutela.juzgado &&
            detalleTutela.juzgado.celular
              ? detalleTutela.juzgado.celular
              : ""
          }}
        </p>
      </div>

      <div>
        <p class="tw-font-bold tw-text-gray-dark">
          Correo Electrónico del Remitente
        </p>
        <p class="tw-break-all">
          {{
            detalleTutela &&
            detalleTutela.juzgado &&
            detalleTutela.juzgado.correo
              ? detalleTutela.juzgado.correo
              : ""
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Código del Proceso</p>
        <p>{{ detalleTutela.codigoProceso }}</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">
          Fecha de Ingreso del Correo
        </p>
        <p>{{ fourthFormatDate(detalleTutela.fecha) }}</p>
      </div>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    default-opened
    dense
    expand-separator
    class="tw-bg-white q-mt-md"
    style="border-radius: 5px"
  >
    <template v-slot:header>
      <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
        Información Adicional
      </h3>
    </template>
    <q-card
      class="q-pb-lg q-px-md col tw-justify-start tw-gap-y-5 tw-gap-x-8 justify-around"
      style="box-shadow: none"
    >
      <div class="flex column flex-column-fixed">
        <p class="text-weight-bold">Observaciones</p>
        <p>{{ detalleTutela.descripcion }}</p>
      </div>

      <div class="flex column flex-column-fixed q-mt-md">
        <p class="text-weight-bold">Documento de Soporte</p>

        <div class="flex q-mt-xs row q-gutter-sm">
          <q-card
            v-for="({ nombre, formato, id, nodeId }, index) in listDocs.filter(
              (it) => it.nombre == detalleTutela.idRadicado + '.pdf'
            )"
            :key="index"
            class="flex row items-center tw-gap-x-2 q-px-md"
            flat
            bordered
          >
            <img
              v-if="
                extensiones.includes(obtenerExtension(nombre).toLowerCase())
              "
              style="width: 26px"
              v-lazy :data-url="tipoIcon(obtenerExtension(nombre))"
              alt="Icono de documento"
            />
            <q-icon v-else name="description" size="xs" />
            <p class="tw-text-xs tw-font-semibold">
              {{ nombre }}
            </p>
            <div class="tw-flex tw-gap-1">
              <q-icon
                size="16px"
                class="tw-cursor-pointer"
                name="download"
                @click="download(nodeId)"
              />
              <q-icon
                size="16px"
                class="tw-cursor-pointer"
                name="info"
                v-if="obtenerExtension(nombre).toLowerCase() == 'pdf'"
                @click="
                  getBlobToIframe(
                    nodeId,
                    listDocs.filter(
                      (it) =>
                        obtenerExtension(it.nombre).toLowerCase() === 'pdf'
                    )
                  )
                "
              />
            </div>
          </q-card>
        </div>
      </div>

      <div class="flex column flex-column-fixed q-mt-md">
        <p class="text-weight-bold">Documentos Adjuntos</p>

        <template
          v-for="{ nombre, formato, id, nodeId, tipo } in listDocs.filter(
            (it) => it.nombre !== detalleTutela.idRadicado + '.pdf'
          )"
          :key="index"
        >
          <q-card
            class="flex row tw-items-center q-px-md tw-mt-4 tw-w-1/3"
            v-if="tipo == 'De entrada'"
            flat
            bordered
          >
            <q-img
              v-if="
                extensiones.includes(obtenerExtension(nombre).toLowerCase())
              "
              style="width: 26px"
              v-lazy :data-url="tipoIcon(obtenerExtension(nombre))"
              alt="Icono de documento"
            />
            <q-icon v-else name="description" size="xs" />
            <p class="tw-text-xs tw-font-semibold overflow-hidden tw-ml-2 col">
              {{ nombre }}
            </p>
            <div class="tw-flex tw-gap-1 co tw-items-end">
              <q-icon
                size="16px"
                class="tw-cursor-pointer"
                name="download"
                @click="download(nodeId)"
              />
              <q-icon
                size="16px"
                class="tw-cursor-pointer"
                name="info"
                v-if="obtenerExtension(nombre).toLowerCase() == 'pdf'"
                @click="
                  getBlobToIframe(
                    nodeId,
                    listDocs.filter(
                      (it) =>
                        obtenerExtension(it.nombre).toLowerCase() === 'pdf'
                    )
                  )
                "
              />
            </div>
          </q-card>
        </template>
      </div>
    </q-card>

    <div v-if="visualizadorPDF" class="tw-h-full tw-w-full">
      <q-dialog v-model="visualizadorPDF" seamless position="right" class="">
        <q-card class="tw-h-full tw-w-[2000px] tw-z-[1000] tw-overflow-hidden">
          <q-card-section>
            <transition
              appear
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
              <div>
                <q-btn
                  v-if="!visibleDoscRead"
                  @click="visualizadorPDF = false"
                  class="tw-absolute tw-ml-5 tw-mt-20 tw-z-[2000] tw-text-white tw-bg-red-500"
                  >Cerrar</q-btn
                >
                <iframe
                  class="tw-h-[80vh] tw-w-full"
                  :src="iframePdfUrl"
                  frameborder="0"
                ></iframe>

                <q-tabs
                  v-model="tabsFiles"
                  dense
                  align="justify"
                  narrow-indicator
                >
                  <q-tab v-for="item in listForVizualiser" :name="item.nombre">
                    <q-card
                      class="tw-h-[10vh] tw-w-[150px] tw-p-3"
                      @click="getBlobToIframe(item.nodeId, null)"
                    >
                      <q-img v-lazy :data-url="docImg" style="width: 30px"> </q-img>
                      <p class="tw-text-gray-dark textFile tw-mt-2">
                        {{ item.nombre }}
                      </p>
                    </q-card>
                  </q-tab>
                </q-tabs>
              </div>
            </transition>
          </q-card-section>
          <q-inner-loading
            :showing="visibleDoscRead"
            label-class="text-teal"
            label-style="font-size: 1.1em"
          />
        </q-card>
      </q-dialog>
    </div>
  </q-expansion-item>
</template>

<script lang="ts" setup>
import { ref, Ref, onMounted } from "vue";
// @ts-ignore
import PDFIcon from "src/assets/pdf.svg";
// @ts-ignore
import excelIcon from "src/assets/excel.svg";
// @ts-ignore
import docImg from "src/assets/icon-lines.svg";
// @ts-ignore
import docxIcon from "src/assets/word.svg";
import {
  currentHourWithoutSec,
  formatDateTimeStandTwo,
  fourthFormatDate,
} from "src/helpers/formtDate";
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
import { ITutelaDetalles } from "src/pages/SGDA/ClasificacionDocumental/Tutelas";
import { sgdeaAxios } from "src/services";
import { useRoute, useRouter } from "vue-router";
import { toast } from "src/helpers/toast";
import { DocumentoRadicado } from "src/interfaces";

const emit = defineEmits(["valid"]);

const router = useRouter();
const route = useRoute();
const detalleTutela: Ref<Partial<ITutelaDetalles>> = ref({});
const listDocs = ref([]);
const loadingDocs = ref(true);

const nameDocument = ref("");
const iframePdfUrl = ref("");
const visualizadorPDF = ref(false);
const visibleDoscRead = ref(false);
const tabsFiles = ref();
const listForVizualiser = ref();

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
  "msg"
]);

const props = withDefaults(
  defineProps<{
    listDocs: any[];
    download: (nodeId) => {};
    visualize: (nodeId, list) => {};
    detalleTutela: any;
    allValid: any;
  }>(),
  {}
);

const getBlobToIframe = async (id, list) => {
  visibleDoscRead.value = true;
  const { data } = await sgdeaAxios.get<DocumentoRadicado>(
    `/radicados/consultar_documento/${id}`
  );

  if (id) {
    // nameDocument.value = listDocs.value.find((it) => it.id === id)?.nombre
    tabsFiles.value = data.name;
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
  if (list) {
    listForVizualiser.value = list;
  }
  visibleDoscRead.value = false;
};
function goBack() {
  router.go(-1);
}

const getData = async () => {
  try {
    const id = route.params.id;
    const { data } = await sgdeaAxios.get(`/tutela/info/${id}`);
    detalleTutela.value = data;
  } catch (error) {
    toast.error("Ocurrió un problema al obtener el caso.");
  }
};

const getDoc = async (id) => {
  const { data } = await sgdeaAxios.get<DocumentoRadicado>(
    `/radicados/consultar_documento/${id}`
  );

  if (id) {
    nameDocument.value = data.name;
  }

  const byteCharacters = atob(data.base64x);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });

  return URL.createObjectURL(blob);
};

const download = async (id, path = "") => {
  try {

    const blobUrl = await getDoc(id);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = nameDocument.value;

    link.click();

    URL.revokeObjectURL(blobUrl);

    if (path != "") {
      router.push(path);
    }
  } catch (error) {
    console.error(error);
  }
};

async function getAllRegisters() {
  const { data } = await sgdeaAxios.get<any>(
    `/tutela/${detalleTutela.value.idTutela}/archivos`
  );


  listDocs.value = data.map((it) => ({
    formato: /[^.]+$/.exec(it.nombre)[0],
    nombre: it.nombre,
    tipo: it.tipo,
    fecha:
      formatDateTimeStandTwo(it.fechaCreacion) +
      " " +
      currentHourWithoutSec(it.fechaCreacion),
    cargado_por: it.usuario,
    id: it.id,
    username: it.username,
    nodeId: it.nodeId,
    extension: it.extension,
  }));

  loadingDocs.value = false;

}

const obtenerExtension = (nombreArchivo) => {
  const punto = nombreArchivo.lastIndexOf(".");
  if (punto === -1) return "";
  return nombreArchivo.slice(punto + 1);
};

onMounted(async () => {
  await getData();
  await getAllRegisters();
});
</script>
