<template>
  <a @click.prevent="goBack" class="text-primary q-mb-md block cursor-pointer" style="text-decoration: none">
      <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
      <b> Volver</b>
    </a>
  <q-expansion-item
    default-opened
    dense
    expand-separator
    class="tw-bg-white q-mt-md"
    style="border-radius: 5px"
  >
    <template v-slot:header>
      <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
        Información General
      </h3>
    </template>
    <q-card
      class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4"
      style="box-shadow: none"
    >
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Número de Radicado</p>
        <p>{{ informacionGeneral?.nroRadicado }}</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Tipo de Solicitud</p>
        <p>{{ informacionGeneral?.informacionSolicitud?.tipoSolicitud }}</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Afectado</p>
        <p>{{ informacionGeneral?.informacionAfectado?.nombresAfectado }}</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Colaborador</p>
        <p>{{ informacionGeneral?.informacionGeneral?.colaborador }}</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Fecha de Vencimiento</p>
        <p>{{ informacionGeneral?.informacionGeneral?.fechaVencimiento }}</p>
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
      <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Remitente</h3>
    </template>
    <q-card
      class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4"
      style="box-shadow: none"
    >
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Tipo de Remitente</p>
        <p>{{ informacionGeneral?.informacionRemitente?.tipoRemitente }}</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">
          Tipo de Documento del Remitente
        </p>
        <p>
          {{ informacionGeneral?.informacionRemitente?.tipoDocumentoRemitente }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">
          Número de Documento del Remitente
        </p>
        <p>
          {{
            informacionGeneral?.informacionRemitente?.numeroDocumentoremitente
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Nombre del Remitente</p>
        <p>{{ informacionGeneral?.informacionRemitente?.nombreRemitente }}</p>
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
      <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Afectado</h3>
    </template>
    <q-card
      class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4"
      style="box-shadow: none"
    >
      <div>
        <p class="tw-font-bold tw-text-gray-dark">
          Tipo de Documento del Afectado
        </p>
        <p>
          {{ informacionGeneral?.informacionAfectado?.tipoDocumentoAfectado }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">
          Número de Documento del Afectado
        </p>
        <p>
          {{ informacionGeneral?.informacionAfectado?.numeroDocumentoAfectado }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Nombre del Afectado</p>
        <p>{{ informacionGeneral?.informacionAfectado?.nombresAfectado }}</p>
      </div>
      <div v-if="!isNitDocumentoAfectado">
        <p class="tw-font-bold tw-text-gray-dark">
          ¿Pertenece a la Comunidad LGBTIQ+?
        </p>
        <p>{{ informacionGeneral?.informacionAfectado?.perteneceLGBT }}</p>
      </div>
      <div v-if="!isNitDocumentoAfectado">
        <p class="tw-font-bold tw-text-gray-dark">Sexo</p>
        <p>{{ informacionGeneral?.informacionAfectado?.sexo }}</p>
      </div>
      <div v-if="!isNitDocumentoAfectado">
        <p class="tw-font-bold tw-text-gray-dark">Condición Especial</p>
        <p>{{ informacionGeneral?.informacionAfectado?.condicionEspecial }}</p>
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
        Medios de Contacto y Respuesta
      </h3>
    </template>
    <q-card
      class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4"
      style="box-shadow: none"
    >
      <div class="tw-max-w-full tw-break-words">
        <p class="tw-font-bold tw-text-gray-dark">Correo Electrónico</p>
        <p>{{ informacionGeneral?.informacionContacto?.email }}</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Teléfono Celular</p>
        <p>{{ informacionGeneral?.informacionContacto?.telefonoCelular }}</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Teléfono Fijo</p>
        <p>{{ informacionGeneral?.informacionContacto?.telefonoFijo }}</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">País de Contacto</p>
        <p>{{ informacionGeneral?.informacionContacto?.paisContacto }}</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Departamento de Contacto</p>
        <p>
          {{ informacionGeneral?.informacionContacto?.departamentoContacto }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Ciudad de Contacto</p>
        <p>{{ informacionGeneral?.informacionContacto?.municipioContacto }}</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Dirección de Contacto</p>
        <p>{{ informacionGeneral?.informacionContacto?.direccionContacto }}</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">
          Medio por el que desea Recibir Respuesta
        </p>
        <p>{{ informacionGeneral?.informacionContacto?.medioRepuesta }}</p>
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
      <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Solicitud</h3>
    </template>
    <q-card
      class="tw-grid tw-grid-cols-1 tw-gap-4 tw-pb-5 tw-mx-4"
      style="box-shadow: none"
    >
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Tipo de Solicitud</p>
        <p>{{ informacionGeneral?.informacionSolicitud?.tipoSolicitud }}</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Detalle</p>
        <p>{{ informacionGeneral?.informacionSolicitud?.detalle }}</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Producto</p>
        <p>{{ informacionGeneral?.informacionSolicitud?.producto }}</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Observación</p>
        <p>{{ informacionGeneral?.informacionSolicitud?.observaciones }}</p>
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
    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
      <div class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
        <h5 class="text-bold tw-text-l tw-flex-1 q-py-md">
          Documento de Soporte
        </h5>
        <div class="flex row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
          <q-list separator>
            <q-item
              v-for="doc in entradaFiles"
              :key="doc.id"
              class="tw-py-0 tw-px-[15px] tw-border tw-rounded-md"
            >
              <q-item-section avatar>
                <q-avatar>
                  <img
                    style="width: 26px"
                    v-lazy :data-url="validateFormat(doc.nombreArchivo)"
                  />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="tw-text-sm tw-font-semibold">{{
                  doc.nombreArchivo
                }}</q-item-label>
              </q-item-section>

              <q-item-section top side>
                <div
                  class="tw-flex tw-gap-2 tw-justify-center tw-items-center tw-w-full tw-h-full"
                >
                  <button
                    @click="() => visualizeFile(doc.nodeId)"
                    class="tw-inline"
                  >
                    <q-icon
                      size="20px"
                      class="tw-text-[#6B737C]"
                      name="error_outline"
                    />
                  </button>
                  <button
                    @click="
                      () => handleOpenDocFile(doc.nodeId, doc.nombreArchivo)
                    "
                    class="tw-online"
                  >
                    <q-icon
                      size="20px"
                      class="tw-text-[#6B737C]"
                      name="file_download"
                    />
                  </button>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
          <h5 class="text-bold tw-text-l tw-flex-1 q-py-md">
            Documentos Adjuntos
          </h5>
          <div class="flex row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
            <q-list separator>
              <q-item
                v-for="doc in adjuntoFiles"
                :key="doc.id"
                class="tw-py-0 tw-px-[15px] tw-border tw-rounded-md"
              >
                <q-item-section avatar>
                  <q-avatar>
                    <img
                      style="width: 26px"
                      v-lazy :data-url="validateFormat(doc.nombreArchivo)"
                    />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="tw-text-sm tw-font-semibold">{{
                    doc.nombreArchivo
                  }}</q-item-label>
                </q-item-section>

                <q-item-section top side>
                  <div
                    class="tw-flex tw-gap-2 tw-justify-center tw-items-center tw-w-full tw-h-full"
                  >
                    <button
                      @click="() => visualizeFile(doc.nodeId)"
                      class="tw-inline"
                      v-if="doc.nombreArchivo.toLowerCase().includes('.pdf')"
                    >
                      <q-icon
                        size="20px"
                        class="tw-text-[#6B737C]"
                        name="error_outline"
                      />
                    </button>
                    <button
                      @click="
                        () => handleOpenDocFile(doc.nodeId, doc.nombreArchivo)
                      "
                      class="tw-online"
                    >
                      <q-icon
                        size="20px"
                        class="tw-text-[#6B737C]"
                        name="file_download"
                      />
                    </button>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </div>
    </q-card>
  </q-expansion-item>

  <q-dialog
    v-model="visualizadorPDF"
    seamless
    position="right"
    class="tw-h-full tw-w-full"
  >
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <q-card class="tw-h-full tw-w-[2000px] tw-z-[1000] tw-overflow-hidden">
        <q-card-section>
          <q-btn
            @click="visualizadorPDF = false"
            class="tw-absolute tw-ml-4 tw-mt-[65px] tw-z-[2000] tw-text-white tw-bg-red-500"
            >Cerrar</q-btn
          >
          <iframe
            class="tw-h-[85vh] tw-w-full"
            :src="iframePdfUrl"
            frameborder="0"
          ></iframe>
        </q-card-section>

        <q-inner-loading
          :showing="spinnerFile"
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </q-card>
    </transition>
  </q-dialog>
</template>

<script lang="ts" setup>
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import { computed, onMounted, ref } from "vue";
import {
  dataMapping,
  informacionGeneralEmptyDefault,
} from "src/pages/EntesDeControl/Bandeja/Detalles/utils";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const auth = useAuthStore();
const emit = defineEmits(["valid"]);
const props = withDefaults(
  defineProps<{
    listDocs: any[];
    listDocs2: any[];
    listDocs3: any[];
    download: () => {};
    visualize: () => {};
    detailsRadicado: any;
    tiempoVencer: string;
    isAprobador: boolean;
    isRevisor: boolean;
    isDevolucion: boolean;
    colaborador: any[];
  }>(),
  {}
);

const visualizadorPDF = ref(false);
const iframePdfUrl = ref();
const spinnerFile = ref(false);
const entradaFiles = ref([]);
const adjuntoFiles = ref([]);

const route = useRoute();

const isNitDocumentoAfectado = computed(
  () =>
    informacionGeneral?.informacionAfectado?.tipoDocumentoAfectado ===
    "Número de identificación tributaria (NIT)"
);

function goBack() {
  router.go(-1);
}

const validateFormat = (nombreArchivo: string) => {
  const formato = obtenerExtension(nombreArchivo);

  const formatoLower = formato.toLowerCase();

  if (['pdf', 'application/pdf'].includes(formatoLower)) return require("src/assets/pdf.svg");
  if (['xls', 'xlsx', 'csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(formatoLower)) return require("src/assets/excel.svg");
  if (['docx', 'doc', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(formatoLower)) return require("src/assets/word.svg");
  if (['jpeg', 'jpg', 'png', 'webp'].includes(formatoLower)) return require("src/assets/img.svg");
  if (['mp3'].includes(formatoLower)) return require("src/assets/music.svg");
  if (['avi', 'mp4'].includes(formatoLower)) return require("src/assets/video.svg");
  if (['txt', 'bmp'].includes(formatoLower)) return require("src/assets/txt.svg");
  if (['xml'].includes(formatoLower)) return require("src/assets/xml.svg");
  if (['zip', 'rar'].includes(formatoLower)) return require("src/assets/folder2.svg");
  if (['ppt', 'pptx'].includes(formatoLower)) return require("src/assets/powerPoint.svg");
  if (['msg', 'eml'].includes(formatoLower)) return require("src/assets/mail.svg");

  return require("src/assets/interrogation.svg");
};

const visualizeFile = async (nodeID: string) => {
  spinnerFile.value = true;
  visualizadorPDF.value = true;

  const url = `/radicados/consultar_documento/${nodeID}`;
  const { data } = await sgdeaAxios.get<any>(url);

  const byteCharacters = atob(data.base64x);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });

  iframePdfUrl.value = URL.createObjectURL(blob);
  spinnerFile.value = false;
};

const informacionGeneral = ref<any>(informacionGeneralEmptyDefault);
const nroRadicado = ref("");
const status = ref("");

const getInformacionGeneral = async () => {
  try {
    const response = await sgdeaAxios.get(`/api/entes/obtenerEnteControl/`  + route.params.id);


    if (response.status === 200) {
      const { data } = response;
      informacionGeneral.value = dataMapping(data);

      const asignacion = informacionGeneral.value.asignaciones.find(
        (asignacion) => asignacion.idGestionador === auth.userInfo.userid
      );
      nroRadicado.value = informacionGeneral.value?.nroRadicado;
      status.value =
        informacionGeneral.value.clonado && auth.userInfo.role === "Gestionador"
          ? asignacion.estado
          : informacionGeneral.value.estado.estado;
    }
  } catch (error) {
    console.error(error);
  }
};


const getFiles = () => {
  const url = `/api/entes/getDocumentosByEnteControlId/432`;
  const numeroRadicado = informacionGeneral?.nroRadicado;

  sgdeaAxios.get(url).then((response) => {
    const files = response.data.reduce(
      (acc, item) => {
        const isFileType = item.tipoArchivo === "ENTRADA_R";
        const isReplaceFileName = item.nombreArchivo.replace(".pdf", "");

        if (isFileType && isReplaceFileName == numeroRadicado)
          acc.entradaFilesData = [...acc.entradaFilesData, item];
        if (isFileType && isReplaceFileName != numeroRadicado)
          acc.adjuntoFilesData = [...acc.adjuntoFilesData, item];
        return acc;
      },
      { entradaFilesData: [], adjuntoFilesData: [] }
    );

    entradaFiles.value = files.entradaFilesData;
    adjuntoFiles.value = files.adjuntoFilesData;
  });
};

const obtenerExtension = (nombreArchivo) => {
  const punto = nombreArchivo.lastIndexOf(".");
  if (punto === -1) return "";
  return nombreArchivo.slice(punto + 1);
};

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
  await getInformacionGeneral();

  //debemos esperar un tiempo para que cargue correctamente la data y el prop
  setTimeout(() => getFiles(), 600);
});
</script>
