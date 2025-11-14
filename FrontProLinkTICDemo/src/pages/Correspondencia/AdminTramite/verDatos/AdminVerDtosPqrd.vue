<template>
  <a
    @click.prevent="goBack"
    class="text-primary q-mb-md block cursor-pointer"
    style="text-decoration: none"
  >
    <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
    <b> Volver</b>
  </a>

  <div class="[&>*]:tw-mb-4">
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
            <q-btn
              v-if="auth.$state.userInfo.role == 'Asignador Responsable'"
              icon="edit"
              color="secondary"
              label="Editar"
              dense
              class="q-py-xs"
              @click="isEdit = true"
            ></q-btn>
          </div>
        </template>
        <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Número de Radicado
            </p>
            <p>{{ formData?.idRadicado }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de Solicitud
            </p>
            <p>{{ formData?.informacionSolicitud.tipoSolicitud }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Afectado</p>
            <p>{{ formData?.informacionAfectada.nombresAfectado }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Colaborador</p>
            <p>{{ formData?.informacionGeneral.colaborador }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Fecha de Vencimiento
            </p>
            <p>
              {{
                moment(formData?.informacionGeneral.fechaVencimiento).format(
                  "DD/MM/YYYY"
                )
              }}
            </p>
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
        <template v-slot:header>
          <div class="row justify-between tw-w-full">
            <b class="text-bold tw-text-xl tw-flex-1 q-py-md">Remitente</b>
          </div>
        </template>
        <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de Remitente
            </p>
            <p>{{ formData?.informacionRemitente.tipoRemitente }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de Documento del Remitente
            </p>
            <p>
              {{ formData?.informacionRemitente.tipoDocumentoRemitente }}
            </p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Número de Documento del Remitente
            </p>
            <p>
              {{ formData?.informacionRemitente.numeroDocumentoremitente }}
            </p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Nombre del Remitente
            </p>
            <p>{{ formData?.informacionRemitente.nombreRemitente }}</p>
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
            <p>
              {{ formData?.informacionAfectada.tipoDocumentoAfectado }}
            </p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Número de Documento del Afectado
            </p>
            <p>
              {{ formData?.informacionAfectada.numeroDocumentoAfectado }}
            </p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Nombre del Afectado
            </p>
            <p>{{ formData?.informacionAfectada.nombresAfectado }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              ¿Pertenece a la Comunidad LGBTIQ+?
            </p>
            <p>
              {{ formData?.informacionAfectada.perteneceLGBT ? "Si" : "No" }}
            </p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Sexo</p>
            <p>{{ formData?.informacionAfectada.sexo }}</p>
          </div>
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Condición Especial
            </p>
            <p>
              {{
                formData?.informacionAfectada?.condicionesEspeciales[0]
                  ?.condicion_especial_id?.nombre
              }}
            </p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>
    <q-card
      class="tw-px-4 tw-py-2 tw-rounded-xl"
      flat
      v-if="props.data?.canalRadicacion?.id !== 5"
    >
      <q-expansion-item
        label="Medios de Contacto y Envio de Respuesta (afectado)"
        header-class="tw-text-lg tw-font-bold tw-text-red tw-pl-0"
        class="tw-bg-white tw-px-4 tw-py-5"
        default-opened
      >
        <template v-slot:header>
          <div class="row justify-between tw-w-full">
            <b class="text-bold tw-text-xl tw-flex-1 q-py-md"
              >Medios de Contacto y Envio de Respuesta (afectado)</b
            >
          </div>
        </template>
        <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3 tw-gap-y-4">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Correo Electrónico
            </p>
            <p>{{ formData?.informacionContacto.email }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Teléfono Celular
            </p>
            <p>{{ formData?.informacionContacto.telefonoCelular }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Teléfono Fijo</p>
            <p>{{ formData?.informacionContacto.telefonoFijo }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              País de Contacto
            </p>
            <p>{{ formData?.informacionContacto.paisContacto }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Departamento de Contacto
            </p>
            <p>
              {{
                formData?.informacionContacto.paisContacto.toLowerCase() ==
                "colombia"
                  ? formData?.informacionContacto.departamentoContacto
                  : "N/A"
              }}
            </p>
          </div>

          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Ciudad de Contacto
            </p>
            <p>
              {{
                formData?.informacionContacto.paisContacto.toLowerCase() ==
                "colombia"
                  ? formData?.informacionContacto.ciudadContacto
                  : "N/A"
              }}
            </p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Dirección de Contacto
            </p>
            <p>{{ formData?.informacionContacto.direccionContacto }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Medio por el que Desea Recibir Respuesta
            </p>
            <p>{{ formData?.informacionContacto.medioRepuesta }}</p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl tw-w-full" flat>
      <q-expansion-item
        label="Solicitud"
        header-class="tw-text-lg tw-font-bold tw-text-red tw-pl-0"
        default-opened
        class="tw-bg-white tw-px-4 tw-py-5"
      >
        <template v-slot:header>
          <div class="row justify-between tw-w-full">
            <b class="text-bold tw-text-xl tw-flex-1 q-py-md">Solicitud</b>
          </div>
        </template>
        <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3 tw-gap-y-4 tw-mb-5">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipología de la PQRS
            </p>
            <p>{{ formData?.informacionSolicitud?.tipologia }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de Solicitud
            </p>
            <p>{{ formData?.informacionSolicitud.tipoSolicitud }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Producto</p>
            <p>{{ formData?.informacionSolicitud.producto }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Información Pública
            </p>
            <p>
              {{ formData?.informacionSolicitud.accesoInfo ? "Si" : "No" }}
            </p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Acceso a Información Pública
            </p>
            <p>{{ formData?.informacionSolicitud.detalle }}</p>
          </div>
          <div class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Detalle</p>
            <p>{{ formData?.informacionSolicitud.observaciones }}</p>
          </div>
          <div class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
            <q-separator spaced />

            <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
              Información Adicional
            </h3>

            <div class="tw-col-span-12">
              <p class="tw-text-label tw-font-semibold tw-pb-1">Observación</p>
              <p>{{ formData?.informacionSolicitud.observaciones }}</p>
            </div>

            <p class="tw-text-label tw-font-semibold tw-pb-2 tw-mt-5">
              Documento de Soporte
            </p>

            <div class="flex column q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
              <q-card
                v-for="(
                  { nombre, formato, id, nodeId }, index
                ) in loadedDocs.filter(
                  (it) => it.nombre == formData.idRadicado + '.pdf'
                )"
                :key="index"
                class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-sm"
                flat
                bordered
              >
                <img style="width: 26px" v-lazy :data-url="tipoIcon(formato)" />
                <p class="tw-text-xs tw-font-semibold">
                  {{ nombre }}
                </p>
                <div class="tw-flex tw-gap-1">
                  <q-icon
                    size="16px"
                    class="tw-cursor-pointer"
                    name="download"
                    @click="() => handleOpenDocFile(id, nombre)"
                  />
                  <q-icon
                    size="16px"
                    class="tw-cursor-pointer"
                    name="info"
                    v-if="formato == 'application/pdf'"

                     @click="getBlobToIframe(id)"
                  />
                </div>
              </q-card>
            </div>

            <p class="tw-text-label tw-font-semibold tw-pb-2 tw-mt-5">
              Documentos Adjuntos
            </p>

            <div class="flex column q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
              <q-card
                class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-sm"
                flat
                bordered
                :key="doc.id"
                v-for="doc in loadedDocs.filter(
                  (it) => it.nombre !== formData.idRadicado + '.pdf'
                )"
              >
                <img style="width: 26px" v-lazy :data-url="tipoIcon(doc.formato)" />
                <p class="tw-text-sm tw-font-semibold">{{ doc.nombre }}</p>
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
                    v-if="doc.formato == 'application/pdf'"
                    @click="getBlobToIframe(doc.id)"
                  />
                </div>
              </q-card>
            </div>
          </div>
        </div>
      </q-expansion-item>
    </q-card>
    <div v-if="visualizadorPDF" class="tw-h-full tw-w-full">
      <q-dialog v-model="visualizadorPDF" seamless position="right" class="">
        <q-card class="tw-h-full tw-w-[2100px] tw-z-[1000] tw-overflow-hidden">
          <q-btn @click="visualizadorPDF = false"
            class="tw-absolute tw-ml-5 tw-mt-20 tw-z-[2000] tw-text-white tw-bg-red-500">Cerrar</q-btn>
          <iframe class="tw-h-full tw-w-full" :src="iframePdfUrl" frameborder="0"></iframe>
        </q-card>

      </q-dialog>
    </div>
  </div>

  <Modal
    v-model="cancelModal"
    title="¡Espera un momento!"
    :is-success="false"
    text-button="Aceptar"
    cancel-button
    text="¿Estás seguro de cancelar el proceso?"
    @close-modal="cancelModal = false"
    @handleAccept="isEdit = false"
    type="button"
  />
</template>

<script lang="ts" setup>
// @ts-ignore
import PDFIcon from "src/assets/pdf.svg";
// @ts-ignore
import excelIcon from "src/assets/excel.svg";
// @ts-ignore
import docxIcon from "src/assets/word.svg";
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
import { Ref, onMounted, ref } from "vue";
import moment from "moment";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { useRoute, useRouter } from "vue-router";
import Modal from "src/components/Modal/Modal.vue";
import { useAuthStore } from "src/stores/auth.store";
import { DocsBD, DocumentoRadicado } from "src/interfaces";
import { fourthFormatDate } from "src/helpers/formtDate";

const visualizadorPDF = ref(false)
const nameDocument = ref('')
const iframePdfUrl = ref()

const getBlobToIframe = async (id) => {
  const { data } = await sgdeaAxios.get<DocumentoRadicado>(
    '/radicados/consultar_documento/' + id
  );

  if (id) {
    nameDocument.value = data.name
  }

  const byteCharacters = atob(data.base64x);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });

  iframePdfUrl.value = URL.createObjectURL(blob);

  visualizadorPDF.value = true
}

interface PQRD {
  id: number;
  informacionRemitente: {
    tipoRemitente: string;
    tipoDocumentoRemitente: string;
    numeroDocumentoremitente: string;
    nombreRemitente: string;
    tipoRemitenteEntity: { id: number; nombre: string };
    tipoDocumentoEntity: { id: number; nombre: string };
  };
  informacionGeneral: {
    numeroRadicado: string;
    tipoSolicitud: string;
    afectado: string;
    colaborador: string;
    fechaVencimiento: number;
  };
  informacionAfectada: {
    tipoDocumentoAfectado: string;
    numeroDocumentoAfectado: string;
    nombresAfectado: string;
    perteneceLGBT: boolean;
    sexo: string;
    condicionEspecial: boolean;
    oficinaAfectado: string;
    tipoDocumentoAfectadoEntity: { id: number; nombre: string };
    generoEntity: { id: number; nombre: string };
    condicionesEspeciales: {
      id: number;
      afectado: {
        id: number;
        tipoDocumento: { id: number; nombre: string };
        numeroDocumento: string;
        nombre: string;
        lgtbtq: boolean;
        genero: { id: number; nombre: string };
        correoElectronico: string;
        telefonoCelular: string | null;
        telefonoFijo: string | null;
        pais: { idPais: number; nombre: string; idContinente: number };
        departamento: {
          idDepartamento: number;
          nombre: string;
          idPais: number;
          codigoDivipola: string;
        };
        municipio: {
          idMunicipio: number;
          nombre: string;
          idDepartamento: number;
          codigoDivipola: string;
        };
        direccion: string;
        medioRespuesta: { id: number; nombre: string };
        oficina: string;
        detalle: string;
        descripcionPqrd: string | null;
        anexoFolios: string | null;
        numeroFolios: string | null;
        mediosMagneticos: string | null;
        isCondicionEspecial: string | null;
        condicionCorrespondencia: string | null;
        barrio: string | null;
      };
      condicion_especial_id: { id: number; nombre: string };
    }[];
  };
  informacionContacto: {
    email: string;
    telefonoCelular: string;
    telefonoFijo: string;
    paisContacto: string;
    departamentoContacto: string;
    ciudadContacto: string;
    direccionContacto: string;
    medioRepuesta: string;
    paisEntity: { idPais: number; nombre: string; idContinente: number };
    medioRespuestaEntity: { id: number; nombre: string };
    departamentoEntity: {
      idDepartamento: number;
      nombre: string;
      idPais: number;
      codigoDivipola: string;
    };
    municipioEntity: {
      idMunicipio: number;
      nombre: string;
      idDepartamento: number;
      codigoDivipola: string;
    };
  };
  informacionSolicitud: {
    producto: string;
    accesoInfo: boolean;
    observaciones: string;
    detalle: string;
    tipologia: string;
    tipoSolicitud: string;
    productoEntity: { id: number; nombre: string };
    tipologiaEntity: { id: number; nombre: string };
    tiposolicitudEntity: { id: number; nombre: string };
  };
  nodeID: string;
  idRadicado: string;
  clonado: boolean;
  idConsolidador: number;
  estado: { id: number; etapa: string; estado: string };
  canalRadicacion: { id: number; nombre: string };
  detalleSolicitud: string;
  oficinaDatosGenerales: null;
}

const formData: Ref<PQRD> = ref({
  id: 0,
  informacionRemitente: {
    tipoRemitente: "",
    tipoDocumentoRemitente: "",
    numeroDocumentoremitente: "",
    nombreRemitente: "",
    tipoRemitenteEntity: { id: 0, nombre: "" },
    tipoDocumentoEntity: { id: 0, nombre: "" },
  },
  informacionGeneral: {
    numeroRadicado: "",
    tipoSolicitud: "",
    afectado: "",
    colaborador: "",
    fechaVencimiento: 0,
  },
  informacionAfectada: {
    tipoDocumentoAfectado: "",
    numeroDocumentoAfectado: "",
    nombresAfectado: "",
    perteneceLGBT: false,
    sexo: "",
    condicionEspecial: false,
    oficinaAfectado: "",
    tipoDocumentoAfectadoEntity: { id: 0, nombre: "" },
    generoEntity: { id: 0, nombre: "" },
    condicionesEspeciales: [],
  },
  informacionContacto: {
    email: "",
    telefonoCelular: "",
    telefonoFijo: "",
    paisContacto: "",
    departamentoContacto: "",
    ciudadContacto: "",
    direccionContacto: "",
    medioRepuesta: "",
    paisEntity: { idPais: 0, nombre: "", idContinente: 0 },
    medioRespuestaEntity: { id: 0, nombre: "" },
    departamentoEntity: {
      idDepartamento: 0,
      nombre: "",
      idPais: 0,
      codigoDivipola: "",
    },
    municipioEntity: {
      idMunicipio: 0,
      nombre: "",
      idDepartamento: 0,
      codigoDivipola: "",
    },
  },
  informacionSolicitud: {
    producto: "",
    accesoInfo: false,
    observaciones: "",
    detalle: "",
    tipologia: "",
    tipoSolicitud: "",
    productoEntity: { id: 0, nombre: "" },
    tipologiaEntity: { id: 0, nombre: "" },
    tiposolicitudEntity: { id: 0, nombre: "" },
  },
  nodeID: "",
  idRadicado: "",
  clonado: false,
  idConsolidador: 0,
  estado: { id: 0, etapa: "", estado: "" },
  canalRadicacion: { id: 0, nombre: "" },
  detalleSolicitud: "",
  oficinaDatosGenerales: null,
});

const isEdit = ref(false);
const cancelModal = ref(false);
const auth = useAuthStore();

interface InfoGeneralProps {
  data: any;
  visualize: (nodeId: string) => {};
}

const props = defineProps<InfoGeneralProps>();
const loadedDocs = ref<any[]>([]);
const route = useRoute();
const router = useRouter();

function goBack() {
  router.go(-1);
}

async function getAllRegisters() {
  const { data } = await sgdeaAxios.get<any>(
    `/radicados/obtenerHijosPorNodo/${formData.value?.nodeID}`
  );

  const { data: files }: { data: DocsBD[] } = await sgdeaAxios.get(`/pqrd/obtenerDocs?idPqrd=${route.params.id}`);

  loadedDocs.value = data.list?.entries?.map((it) => ({
    formato: it.entry?.content?.mimeType ?? 'No disponible',
    nombre: it.entry?.name,
    fecha: fourthFormatDate(it.entry?.createdAt),
    cargado_por: it.entry?.createdByUser?.displayName,
    tipo: files.find((itFile) => itFile.nodeId === it.entry.id)?.tipo ?? 'De Gestión',
    id: it.entry.id
  })).filter(it => !it.tipo.includes("Respuesta"));
}

const getDatas = async () => {
  try {
    const id = route.params.id;
    const response = await sgdeaAxios.get(`/pqrd/buscarCaso?idCaso=${id}&userId=${auth.$state.userInfo.userid}`);

    if (response.status === 200) {
      const { data } = response;
      formData.value = data;

    }
  } catch (error) {
    toast.error("Ocurrió un problema al obtener el caso.");
  }
};

onMounted(async () => {
  await getDatas();
  await getAllRegisters()
});

const tipoIcon = (tipo) => {
  const t = tipo.toLowerCase();
  if (['pdf', 'application/pdf'].includes(t)) return PDFIcon;
  if (
    [
      'xls',
      'xlsx',
      'csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ].includes(t)
  ) return excelIcon;
  if (
    [
      'docx',
      'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ].includes(t)
  ) return docxIcon;
  if (
    [
      'jpeg',
      'jpg',
      'png',
      'webp'
    ].includes(t)
  ) return img;
  if (['mp3'].includes(t)) return music;
  if (
    [
      'avi',
      'mp4'
    ].includes(t)
  ) return video;
  if (
    [
      'txt',
      'bmp'
    ].includes(t)
  ) return txt;
  if (['xml'].includes(t)) return xml;
  if (
    [
      'zip',
      'rar'
    ].includes(t)
  ) return zip;
  if (
    [
      'ppt',
      'pptx'
    ].includes(t)
  ) return ppt;
  if (
    [
      'msg',
      'eml'
    ].includes(t)
  ) return msg;
  return interrogation;
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
</script>
