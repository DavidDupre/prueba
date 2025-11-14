<template>
  <a
      @click.prevent="goBack"
      class="text-primary q-mb-md block cursor-pointer"
      style="text-decoration: none"
    >
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
        Información general
      </h3>
    </template>
    <q-card
      class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4"
      style="box-shadow: none"
    >
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Número de radicado</p>
        <p>
          {{
            isRadicadoSalida
              ? detailsRadicado.radicadoSalida
              : detailsRadicado?.idRadicado
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Afectado</p>
        <p>
          {{
            detailsRadicado &&
            detailsRadicado.afectado &&
            detailsRadicado.afectado.nombre
              ? detailsRadicado.afectado.nombre
              : ""
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Colaborador</p>
        <p>
          {{ detailconsolidador?.usuario?.firstname }}
          {{ detailconsolidador?.usuario?.lastname }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Fecha de vencimiento</p>
        <p>{{ formateFechaVencimiento }}</p>
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
        Tipo de comunicación
      </h3>
    </template>
    <q-card
      class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4"
      style="box-shadow: none"
    >
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Número de radicado</p>
        <p>{{ detailsRadicado?.idRadicado }}</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Canal de recepción</p>
        <p>Ventanilla</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Tipo de trámite</p>
        <p>
          {{
            detailsRadicado &&
            detailsRadicado.tipoTramite &&
            detailsRadicado.tipoTramite.nombre
              ? detailsRadicado.tipoTramite.nombre
              : ""
          }}
        </p>
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
        <p class="tw-font-bold tw-text-gray-dark">Tipo de remitente</p>
        <p>{{ "N/A" }}</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">
          Tipo de documento del remitente
        </p>
        <p>
          {{
            detailsRadicado &&
            detailsRadicado.remitente &&
            detailsRadicado.remitente.tipoDocumento
              ? detailsRadicado.remitente.tipoDocumento.nombre
              : ""
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">
          Número de documento del remitente
        </p>
        <p>
          {{
            detailsRadicado &&
            detailsRadicado.remitente &&
            detailsRadicado.remitente.numeroDocumento
              ? detailsRadicado.remitente.numeroDocumento
              : ""
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Nombre del remitente</p>
        <p>
          {{
            detailsRadicado &&
            detailsRadicado.remitente &&
            detailsRadicado.remitente.nombre
              ? detailsRadicado.remitente.nombre
              : ""
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">
          Número radicado de la entidad remitente
        </p>
        <p>
          {{
            detailsRadicado &&
            detailsRadicado.remitente &&
            detailsRadicado.remitente.numeroRadicadoEntidad
              ? detailsRadicado.remitente.numeroRadicadoEntidad
              : ""
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Número de factura</p>
        <p>
          {{
            detailsRadicado &&
            detailsRadicado.remitente &&
            detailsRadicado.remitente.nroFactura
              ? detailsRadicado.remitente.nroFactura
              : ""
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">País</p>
        <p>
          {{
            detailsRadicado &&
            detailsRadicado.remitente &&
            detailsRadicado.remitente.pais &&
            detailsRadicado.remitente.pais.nombre
              ? detailsRadicado.remitente.pais.nombre
              : ""
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Departamento</p>
        <p>
          {{
            detailsRadicado &&
            detailsRadicado.remitente &&
            detailsRadicado.remitente.departamento &&
            detailsRadicado.remitente.departamento.nombre
              ? detailsRadicado.remitente.departamento.nombre
              : ""
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Municipio</p>
        <p>
          {{
            detailsRadicado &&
            detailsRadicado.remitente &&
            detailsRadicado.remitente.municipio &&
            detailsRadicado.remitente.municipio.nombre
              ? detailsRadicado.remitente.municipio.nombre
              : ""
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Dirección del remitente</p>
        <p>
          {{
            detailsRadicado &&
            detailsRadicado.remitente &&
            detailsRadicado.remitente.direccion
              ? detailsRadicado.remitente.direccion
              : ""
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">
          Correo electrónico del remitente
        </p>
        <p>
          {{
            detailsRadicado &&
            detailsRadicado.remitente &&
            detailsRadicado.remitente.correo
              ? detailsRadicado.remitente.correo
              : ""
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Teléfono</p>
        <p>
          {{
            detailsRadicado &&
            detailsRadicado.remitente &&
            detailsRadicado.remitente.telefono
              ? detailsRadicado.remitente.telefono
              : ""
          }}
        </p>
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
          Tipo de documento del afectado
        </p>
        <p>
          {{
            detailsRadicado &&
            detailsRadicado.afectado &&
            detailsRadicado.afectado.tipoDocumento
              ? detailsRadicado.afectado.tipoDocumento.nombre
              : ""
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">
          Número de documento del afectado
        </p>
        <p>
          {{
            detailsRadicado &&
            detailsRadicado.afectado &&
            detailsRadicado.afectado.numeroDocumento
              ? detailsRadicado.afectado.numeroDocumento
              : ""
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Nombre del afectado</p>
        <p>
          {{
            detailsRadicado &&
            detailsRadicado.afectado &&
            detailsRadicado.afectado.nombre
              ? detailsRadicado.afectado.nombre
              : ""
          }}
        </p>
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
        Medios de contacto y envío de respuesta
      </h3>
    </template>
    <q-card
      class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4"
      style="box-shadow: none"
    >
      <div>
        <p class="tw-font-bold tw-text-gray-dark">
          Correo electrónico del afectado
        </p>
        <p>
          {{
            detailsRadicado &&
            detailsRadicado.remitente &&
            detailsRadicado.remitente.correo
              ? detailsRadicado.remitente.correo
              : ""
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Teléfono fijo</p>
        <p>
          {{
            detailsRadicado &&
            detailsRadicado.remitente &&
            detailsRadicado.remitente.telefono
              ? detailsRadicado.remitente.telefono
              : ""
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">País</p>
        <p>
          {{
            detailsRadicado &&
            detailsRadicado.remitente &&
            detailsRadicado.remitente.pais
              ? detailsRadicado.remitente.pais.nombre
              : ""
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Departamento</p>
        <p>
          {{
            detailsRadicado &&
            detailsRadicado.remitente &&
            detailsRadicado.remitente.departamento
              ? detailsRadicado.remitente.departamento.nombre
              : ""
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Municipio</p>
        <p>
          {{
            detailsRadicado &&
            detailsRadicado.remitente &&
            detailsRadicado.remitente.municipio
              ? detailsRadicado.remitente.municipio.nombre
              : ""
          }}
        </p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Dirección del afectado</p>
        <p>
          {{
            detailsRadicado &&
            detailsRadicado.remitente &&
            detailsRadicado.remitente.direccion
              ? detailsRadicado.remitente.direccion
              : ""
          }}
        </p>
      </div>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    default-opened
    dense
    expand-separator
    class="tw-bg-white q-mt-md"
    style="border-radius: 5px"
    v-if="true"
  >
    <template v-slot:header>
      <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Documentos</h3>
    </template>
    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
      <div class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
        <h5 class="text-bold tw-text-l tw-flex-1 q-py-md">
          Documentos de Salida
        </h5>
        <div class="flex row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
          <q-card
            class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-sm"
            flat
            bordered
            :key="doc.id"
            v-for="doc in listDocs"
          >
            <img style="width: 26px" v-lazy :data-url="validateFormat(doc.formato)" />
            <p class="tw-text-sm tw-font-semibold">{{ doc.nombre }}</p>
            <q-icon
              size="20px"
              class="tw-text-[#6B737C] tw-cursor-pointer"
              name="error_outline"
              @click="
                getBlobToIframe(
                  doc.nodeId,
                  listDocs3.filter((it) =>
                    ['pdf', 'application/pdf'].includes(
                      obtenerExtension(it.nombre).toLowerCase()
                    )
                  )
                )
              "
            />
            <q-icon
              size="20px"
              class="tw-text-[#6B737C] tw-cursor-pointer"
              name="file_download"
              @click="() => handleOpenDocFile(doc.nodeId, doc.nombre)"
            />
          </q-card>
        </div>
      </div>

      <div class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
        <h5 class="text-bold tw-text-l tw-flex-1 q-py-md">
          Documentos de Soporte
        </h5>
        <div class="flex row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
          <q-card
            class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-sm"
            flat
            bordered
            :key="doc.id"
            v-for="doc in listDocs3"
          >
            <img style="width: 26px" v-lazy :data-url="validateFormat(doc.formato)" />
            <p class="tw-text-sm tw-font-semibold">{{ doc.nombre }}</p>
            <q-icon
              size="20px"
              class="tw-text-[#6B737C] tw-cursor-pointer"
              name="error_outline"
              @click="
                getBlobToIframe(
                  doc.nodeId,
                  listDocs3.filter((it) =>
                    ['pdf', 'application/pdf'].includes(
                      obtenerExtension(it.nombre).toLowerCase()
                    )
                  )
                )
              "
            />
            <q-icon
              size="20px"
              class="tw-text-[#6B737C] tw-cursor-pointer"
              name="file_download"
              @click="() => handleOpenDocFile(doc.nodeId, doc.nombre)"
            />
          </q-card>
        </div>
      </div>
      <div class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
        <h5 class="text-bold tw-text-l tw-flex-1 q-py-md">
          Documentos Adjuntos
        </h5>
        <div class="flex row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
          <q-card
            class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-sm"
            flat
            bordered
            :key="doc.id"
            v-for="doc in listDocs2"
          >
            <img style="width: 26px" v-lazy :data-url="validateFormat(doc.formato)" />
            <p class="tw-text-sm tw-font-semibold">{{ doc.nombre }}</p>
            <q-icon
              size="20px"
              class="tw-text-[#6B737C] tw-cursor-pointer"
              name="error_outline"
              @click="
                getBlobToIframe(
                  doc.nodeId,
                  listDocs2.filter(
                    (it) => obtenerExtension(it.nombre).toLowerCase() === 'pdf'
                  )
                )
              "
            />
            <q-icon
              size="20px"
              class="tw-text-[#6B737C] tw-cursor-pointer"
              name="file_download"
              @click="() => handleOpenDocFile(doc.nodeId, doc.nombre)"
            />
          </q-card>
        </div>
        <div v-if="visualizadorPDF" class="tw-h-full tw-w-full">
          <q-dialog
            v-model="visualizadorPDF"
            seamless
            position="right"
            class=""
          >
            <q-card
              class="tw-h-full tw-w-[2000px] tw-z-[1000] tw-overflow-hidden"
            >
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
                      <q-tab
                        v-for="item in listForVizualiser"
                        :name="item.nombre"
                      >
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
      </div>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts" setup>
import moment from "moment";
// @ts-ignore
import PDFIcon from "src/assets/pdf.svg";
// @ts-ignore
import excelIcon from "src/assets/excel.svg";
// @ts-ignore
import docxIcon from "src/assets/word.svg";
// @ts-ignore
import docImg from "src/assets/icon-lines.svg";
import { sgdeaAxios } from "src/services";
import { useRoute, useRouter } from "vue-router";
import { computed, ref, Ref, onMounted } from "vue";
import { IAsignacionDetalles, IRadicadoDetalles } from "../..";
import { DocsBD, DocumentoRadicado } from "src/interfaces";

const formateFechaVencimiento = computed(() =>
  moment(detailconsolidador.value?.fechaVencimiento).format("DD/MM/YYYY")
);
const isRadicadoSalida = computed(() =>
  ["Devolucion", "Publicacion rechazada", "Por Publicar"].includes(
    detailsRadicado?.estadoProceso?.estado
  )
);
const detailsRadicado: Ref<Partial<IRadicadoDetalles>> = ref({});
const detailconsolidador: Ref<Partial<IAsignacionDetalles>> = ref({});
const route = useRoute();
const router = useRouter();

const listDocs = ref([]);
const listDocs2 = ref([]);
const listDocs3 = ref([]);
const dataSave = ref(null);
const visualizadorPDF = ref(false);
const visibleDoscRead = ref(false);
const iframePdfUrl = ref();
const tabsFiles = ref();
const listForVizualiser = ref();

function goBack() {
  router.go(-1);
}

const getDocs = async (path) => {
  try {
    const { data: getDocs } = await sgdeaAxios.get<any>(`${path}`);

    const nodeId = getDocs.length > 0 ? getDocs[0]?.nodeId : null;
    listDocs.value = getDocs;

    if (nodeId) {
      const { data: getDocAlf } = await sgdeaAxios.get<DocumentoRadicado>(
        `/radicados/consultar_documento/${nodeId}`
      );

      const decodedContent = await decodeBase64ToUTF8(getDocAlf.base64x);
      dataSave.value = decodedContent;
    }
  } catch (error) {
    console.error(error);
  }
};

const getDocs2 = async () => {
  try {
    const responseEntrada = await sgdeaAxios.get<DocsBD[]>(
      `correspondencia/radicacion/documentos/ENTRADA/${detailsRadicado.value.id}`
    );
    const responseSoporte = await sgdeaAxios.get<DocsBD[]>(
      `correspondencia/radicacion/documentos/SOPORTE/${detailsRadicado.value.id}`
    );
    const response = await sgdeaAxios.get(
      "/radicados/obtenerHijosPorNodo/" +
        detailsRadicado.value.nodeId
    );

    const documentoEntrada = response.data.list.entries.find(
      (item) =>
        item.entry.name == detailsRadicado.value.idRadicado + ".pdf"
    ).entry;

    const docsEntrada = responseEntrada.data;
    const docsSoporte = responseSoporte.data;
    listDocs3.value.push({
      id: null,
      nombre: documentoEntrada.name,
      nodeId: documentoEntrada.id,
      formato: "pdf",
      tipoDocumento: "ENTRADA",
      fechaCargue: documentoEntrada.createdAt,
    });
    if (docsEntrada.length > 0) {
      listDocs2.value = docsEntrada;
    }
    if (docsSoporte.length > 0) {
      listDocs3.value = docsSoporte;
    }
  } catch (error) {
    console.error(error);
  }
};

const decodeBase64ToUTF8 = async (base64Data) => {
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Uint8Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const decoder = new TextDecoder("utf-8");
  const decodedText = decoder.decode(byteNumbers);

  return decodedText;
};

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

const validateFormat = (formato) => {
  if (formato === "pdf") return PDFIcon;
  if (formato === "excel") return excelIcon;
  if (formato === "docx") return docxIcon;
  if (formato === "doc") return docxIcon;
};

const getDataInformacionRdicado = async () => {
  try {
    const { data } = await sgdeaAxios.get(
      `/correspondencia/radicacion/${route.params.id}`
    );

    detailsRadicado.value = data;

    await getDataInformacionColaborador();
    await getDocs(
      `/correspondencia/radicacion/documentos/SALIDA/${detailsRadicado.value.id}`
    );
    await getDocs2();
  } catch (error) {
    console.error(error);
  }
};

const getDataInformacionColaborador = async () => {
  try {
    const { data } = await sgdeaAxios.get(
      `/correspondencia/radicacion/asignaciones/${route.params.id}`
    );

    detailconsolidador.value = data[0];
  } catch (error) {
    console.error(error);
  }
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
  await getDataInformacionRdicado();
});
</script>
