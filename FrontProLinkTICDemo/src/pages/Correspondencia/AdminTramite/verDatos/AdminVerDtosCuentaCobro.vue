<template>
  <a
    @click.prevent="goBack"
    class="text-primary q-mb-md block cursor-pointer"
    style="text-decoration: none"
  >
    <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
    <b> Volver</b>
  </a>
  <section>
    <q-expansion-item
      dense
      expand-separator
      default-opened
      class="tw-bg-white"
      style="border-radius: 5px"
    >
      <template v-slot:header>
        <div class="row justify-between tw-w-full items-center">
          <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
            Información Básica de Radicación
          </h3>
        </div>
      </template>
      <q-card
        class="q-pb-lg q-px-md tw-flex tw-justify-between tw-gap-8"
        style="box-shadow: none"
      >
        <div class="tw-flex tw-flex-col tw-leading-6 tw-w-1/2">
          <p class="titles">Dependencia</p>
          <p>{{ initialData?.dependencia }}</p>
          <p class="titles">Tipo de Trámite</p>
          <p>{{ initialData?.tipoTramite }}</p>
          <p class="titles">Tipo de Documento</p>
          <p>
              {{
                tipoDocumento.find(
                  (item) => item.value === initialData.tipoDocumento
                )?.label ?? initialData.tipoDocumento
              }}
            </p>
          <p class="titles">Primer Apellido</p>
          <p>{{ initialData?.primerApellido }}</p>
          <p class="titles">Primer Nombre</p>
          <p>{{ initialData?.primerNombre }}</p>
        </div>
        <div class="tw-flex tw-flex-col tw-leading-6 tw-w-1/2">
          <p class="titles">Responsable del Proceso</p>
          <p>{{ initialData?.responsable }}</p>
          <p class="titles">Canal de Recepción</p>
          <p>{{ initialData?.canal }}</p>
          <p class="titles">Número de Identificación</p>
          <p>{{ initialData?.numeroDocumento }}</p>
          <p class="titles">Segundo Apellido</p>
          <p>{{ initialData?.segundoApellido }}</p>
          <p class="titles">Otros Nombres</p>
          <p>{{ initialData?.otrosNombres }}</p>
        </div>
      </q-card>
    </q-expansion-item>

    <q-expansion-item
      dense
      expand-separator
      default-opened
      class="tw-bg-white q-mt-md"
      style="border-radius: 5px"
    >
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
          Información Documento Soporte Equivalente
        </h3>
      </template>
      <q-card
        class="q-pb-lg q-px-md tw-flex tw-flex-wrap tw-justify-start tw-gap-x-8 tw-leading-6"
      >
        <div class="tw-flex tw-flex-col tw-w-full">
          <p class="titles">Tipo de Bien o Servicio</p>
          <p>{{ initialData?.tipoBienServicio }}</p>
        </div>
        <div class="tw-flex tw-flex-col tw-w-full">
          <p class="titles">Observación</p>
          <p class="tw-overflow-hidden tw-w-[1000px] tw-break-words">
            {{ initialData?.observacion }}
          </p>
        </div>
        <div class="tw-flex tw-flex-col tw-w-[48%]">
          <p class="titles">Valor</p>
          <p>$ {{ initialData?.valor?.toLocaleString("es-ES") }}</p>
        </div>
        <div class="tw-flex tw-flex-col tw-w-[48%]">
          <p class="titles">Aprobador</p>
          <p>{{ initialData?.aprobador }}</p>
        </div>
        <div class="tw-flex tw-flex-col tw-w-full">
          <p class="titles">Valor en Letras</p>
          <p>{{ initialData?.valor_letra }}</p>
        </div>
      </q-card>
    </q-expansion-item>

    <q-expansion-item
      dense
      expand-separator
      default-opened
      class="tw-bg-white q-mt-md"
      style="border-radius: 5px"
    >
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
          Campos Automáticos al Radicar
        </h3>
      </template>
      <q-card
        class="q-pb-lg q-px-md tw-flex tw-flex-wrap tw-justify-start tw-gap-x-8 tw-leading-6"
      >
        <div class="tw-flex tw-flex-col tw-w-[48%]">
          <p class="titles">FECHA / Sistema al Radicar</p>
          <p>
            {{
              moment(
                initialData?.fechaFormateada,
                "DD/MM/YYYY HH:mm:ss"
              ).format("DD/MM/YYYY")
            }}
          </p>
        </div>
        <div class="tw-flex tw-flex-col tw-w-[48%]">
          <p class="titles">HORA / Sistema al Radicar</p>
          <p>
            {{
              moment(
                initialData?.fechaFormateada,
                "DD/MM/YYYY hh:mm:ss a"
              ).format("hh:mm a")
            }}
          </p>
        </div>
        <div class="tw-flex tw-flex-col tw-w-[48%]">
          <p class="titles">Estado de Trámite</p>
          <p>{{ initialData.estado }}</p>
        </div>
      </q-card>
    </q-expansion-item>

    <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
      <q-expansion-item default-opened>
        <template v-slot:header>
          <div class="col row">
            <b class="tw-text-lg">Documentos Cargados</b>
          </div>
        </template>
        <p class="titles q-px-md q-mb-md q-mt-lg">Documento de Soporte</p>
        <div
          class="tw-flex tw-flex-col row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md"
        >
          <q-card
            class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-sm tw-mr-auto"
            flat
            bordered
            :key="doc.id"
            v-for="doc in radicadoDoc"
          >
            <img style="width: 26px" v-lazy :data-url="tipoIcon(doc.content.mimeType)" />
            <p class="tw-text-sm tw-font-semibold">{{ doc.name }}</p>
            <q-icon
              size="20px"
              class="tw-text-[#6B737C] tw-cursor-pointer"
              name="error_outline"
              @click="getBlobToIframe(doc.id)"
            />
            <button @click="() => handleOpenDocFile(doc.id, doc.name)">
              <q-icon
                size="20px"
                class="tw-text-[#6B737C]"
                name="file_download"
              />
            </button>
          </q-card>
        </div>

        <p class="titles q-px-md q-mb-md q-mt-lg">Documentos adjuntos</p>
        <div
          class="tw-flex tw-flex-col row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md"
        >
          <q-card
            class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-sm tw-mr-auto"
            flat
            bordered
            :key="doc.id"
            v-for="doc in filteredDocs"
          >
            <img style="width: 26px" v-lazy :data-url="tipoIcon(doc.content.mimeType)" />
            <p class="tw-text-sm tw-font-semibold">{{ doc.name }}</p>
            <q-icon
              size="20px"
              class="tw-text-[#6B737C] tw-cursor-pointer"
              name="error_outline"
               @click="getBlobToIframe(doc.id)"
            />
            <button @click="() => handleOpenDocFile(doc.id, doc.name)">
              <q-icon
                size="20px"
                class="tw-text-[#6B737C]"
                name="file_download"
              />
            </button>
          </q-card>
        </div>
      </q-expansion-item>
    </q-card>
  </section>
  <div v-if="visualizadorPDF" class="tw-h-full tw-w-full">
      <q-dialog v-model="visualizadorPDF" seamless position="right" class="">
        <q-card class="tw-h-full tw-w-[2100px] tw-z-[1000] tw-overflow-hidden">
          <q-btn @click="visualizadorPDF = false"
            class="tw-absolute tw-ml-5 tw-mt-20 tw-z-[2000] tw-text-white tw-bg-red-500">Cerrar</q-btn>
          <iframe class="tw-h-full tw-w-full" :src="iframePdfUrl" frameborder="0"></iframe>
        </q-card>

      </q-dialog>
    </div>
  <Modal
    v-model="cancelModal"
    title="¡Espera un momento!"
    :is-success="false"
    text-button="Si"
    @handleAccept=""
    cancel-button
    text-button-cancel="No"
    text="¿Está seguro de que no quiere modificar los datos?"
    @close-modal="cancelModal = false"
    type="button"
  />
</template>

<script lang="ts" setup>
import { tipoDocumento } from "src/constantes/options";
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";
import { sgdeaAxios } from "src/services";
import moment from "moment";
import Modal from "components/Modal/Modal.vue";
// @ts-ignore
import PDFIcon from "src/assets/pdf.svg";
// @ts-ignore
import excelIcon from "src/assets/excel.svg";
// @ts-ignore
import docxIcon from "src/assets/word.svg";

import { toast } from "src/helpers/toast";
import { numberToHumanText } from "src/helpers/number";
import { b64toBlob } from "src/helpers/converters";
import { DocumentoRadicado } from "src/interfaces";

const loadedDocs = ref<any[]>([]);
const entradaFiles = ref<any[]>([]);
const adjuntoFiles = ref<any[]>([]);

const cancelModal = ref(false);

const initialform = {
  dependencia: "",
  responsable: "",
  tipoTramite: "",
  canal: "",
  tipoDocumento: "",
  primerApellido: "",
  segundoApellido: "",
  primerNombre: "",
  otrosNombres: "",
  fechaRadicar: "",
  horaInicio: "",

  tipoBienServicio: "",
  observacion: "",
  valor: 0,
  valor_letra: "",
  aprobador: "",
  estado: {
    value: "radicado",
    label: "Radicado",
  },

  sec: "",
  numeroDocumento: "",
};

interface InfoGeneralProps {
  data: any;
}
const props = defineProps<InfoGeneralProps>();
const router = useRouter();
const route = useRoute();
const emit = defineEmits(["update:data"]);

const validateEdite = ref(false);

const initialData = ref({
  idCto: null,
  dependencia: "",
  responsable: "",
  canal: "",
  tipoTramite: "",
  caseId: null,
  tipoDocumento: "",
  numeroDocumento: null,
  primerApellido: "",
  segundoApellido: "",
  primerNombre: "",
  otrosNombres: "",
  tipoBienServicio: "",
  observacion: "",
  valor: null,
  valor_letra: "",
  aprobador: "",
  fecha: "",
  estado: "",
  sec: "",
  nodeId: "",
  docSoporteNodeId: "",
  estadoUpdate: null,
  motivo: null,
  iduser: null,
  oficina: null,
  fechaFormateada: "",
});

const visualizadorPDF = ref(false)
const nameDocument = ref('')
const iframePdfUrl = ref()

function goBack() {
  router.go(-1);
}

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

const getData = async () => {
  try {
    const { data } = await sgdeaAxios.get(
      "/facturacion/geCto/" + route.params.id
    );

    if (data.mensaje) {
      initialData.value = data.cto;

    } else {
      toast.error("Error al consultar la cuenta de cobro");
    }
  } catch (error) {
    toast.error("Error al consultar la cuenta de cobro");
  }
};

const form = ref({ ...initialform });
// variable para calcular el tamaño de observacion

watch(
  () => form.value.dependencia,
  async (newVal) => {
    if (!newVal.value) return;
    const response = await sgdeaAxios.get(
      `/api/usuarios/rolYSeccionSubseccion/${newVal.value}?rolName=Administrador de Trámite`
    );
    options.value = response.data
      .filter((responsable: any) => responsable.enabled)
      .map((responsable: any) => ({
        label: responsable.firstname + " " + responsable.lastname,
        value: responsable.firstname + " " + responsable.lastname,
      }));
    form.value.responsable = "";
  }
);

const tipoIcon = (tipo) => {
  if (tipo === "application/pdf") return PDFIcon;
  if (
    tipo === "application/vnd.ms-excel" ||
    tipo === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )
    return excelIcon;
  if (
    tipo ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    tipo === "application/msword"
  )
    return docxIcon;
};

onMounted(async () => {
  await getData();

  try {
    const response = await sgdeaAxios.get(
      "/radicados/obtenerHijosPorNodo/" + initialData.value.nodeId
    );
    if (response.status !== 200 && response.status !== 201) {

      return;
    }

    const docs = response.data.list.entries.map((item) => {
      return {
        ...item.entry,
      };
    });

    loadedDocs.value = docs;

    //iteramos sobre los docs y validamos si el nombre es igual al de initialData.value.sec, si es asi seagrega al array de entrada, de lo contraio se agrega al array de adjunto

    docs.forEach((doc) => {
      if (doc.name.toLowerCase().includes(initialData.value.sec.toLowerCase())) {
        entradaFiles.value.push(doc);
      } else {
        adjuntoFiles.value.push(doc);
      }
    });
  } catch (error) {
    console.error(error);
  }
});

const handleOpenDocFile = async (id: string, name: string) => {
  try {
    const response = await sgdeaAxios.get(
      "/radicados/consultar_documento/" + id
    );

    const blob = await b64toBlob(
      response.data.base64x,
      response.data.minetype.split("/")[0]
    );

    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = name;
    a.click();
  } catch (error) {
    console.error(error);
  }
};

watch(
  () => form.value.valor,
  (newNumber) => {
    if (String(newNumber).startsWith("0") && String(newNumber) !== "0") {
      let format = parseFloat(String(newNumber).substring(1));

      if (isNaN(format)) {
        format = 0;
      }

      form.value.valor = format;
    }

    form.value.valor_letra = numberToHumanText(newNumber);
  }
);

watch(
  () => form.value,
  (newValue, oldValue) => {
    validateEdite.value = JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
  { deep: true }
);


const options = ref([]);

const radicadoDoc = computed(() => {
  return loadedDocs.value.filter((it) => it.name === `${initialData.value.sec}.pdf`);
});
const filteredDocs = computed(() => {
  return loadedDocs.value.filter((it) => it.name !== `${initialData.value.sec}.pdf`);
});
</script>
