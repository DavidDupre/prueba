<template>
  <div class="container mx-auto p-4">
    <div v-if="!props.isCorrespondencia" class="tw-flex tw-justify-between tw-items-center tw-py-4">
      <span class="tw-font-bold tw-text-3xl tw-my-5">
        Radicar Entes de Control
      </span>
    </div>

    <div v-if="!props.isCorrespondencia" class="tw-container tw-mx-auto">
      <q-linear-progress size="8px" :value="0.25 * (step + 1)" />

      <div class="tw-grid tw-grid-cols-4 tw-gap-0">
        <div class="tw-mt-2" v-for="(title, index) in stepTitles" :key="index">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5"
            :class="step >= index ? 'tw-text-slate-600' : 'tw-text-slate-400'">
            <div>
              <p class="tw-font-bold">{{ title.name }}</p>
              <p>{{ title.description }}</p>
            </div>
          </h4>
        </div>
      </div>
    </div>

    <div v-if="step === Steps.FORM1">
      <Remitente ref="remitenteForm" :remitenteData="remitenteData" />
      <ActionButtons nextLabel="Siguiente" primaryColor="primary" @next="validateAndNextStep(Steps.FORM2)"
        @cancel="showCancelModal = true" @back="prev()" :showBackButton="props.isCorrespondencia" />
    </div>
    <div v-if="step === Steps.FORM2">
      <Afectado ref="afectadoForm" :afectadoData="afectadoData" />
      <ActionButtons nextLabel="Siguiente" primaryColor="primary" @next="validateAndNextStep(Steps.FORM3)"
        @cancel="showCancelModal = true" @back="backStep(Steps.FORM1)" :showBackButton="true" />
    </div>
    <div v-if="step === Steps.FORM3">
      <Solicitud ref="solicitudForm" :solicitudData="solicitudData" :is-correspondencia="isCorrespondencia" />
      <ActionButtons nextLabel="Siguiente" primaryColor="primary" @next="validateAndNextStep(Steps.FORM4)"
        @cancel="showCancelModal = true" @back="backStep(Steps.FORM2)" :showBackButton="true" />
    </div>
    <div v-if="step === Steps.FORM4">
      <div class="tw-items-center tw-pt-8">
        <div>
          <span class="tw-font-bold tw-text-2xl tw-my-2">
            Documentos
          </span>
        </div>
        <div class="tw-pt-4">
          <span class="tw-text-1xl">Adjuntar los Documentos</span>
        </div>
      </div>
      <FileLoader class="tw-w-full" multiple v-model:model-value="documentos"
        sub-title="Puede adjuntar (30) Archivo(s) cada uno con un tamaño permitido de 50MB en cualquiera de las siguientes extenciones <hr>(pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)"
        accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
        :max-file-size="50 * 1024 * 1024" :max-files="30" max-file-size-label="50" @rejected="rejectedFiles"
        ref="documentosForm" />
      <ActionButtons nextLabel="Radicar" primaryColor="primary" @next="saveForm()" @cancel="showCancelModal = true"
        @back="backStep(Steps.FORM3)" :showBackButton="true" :isBtnDisabled="isBtnDisabled" />
    </div>

    <Modal v-model="showCancelModal" title="Confirmación" persistent
      text="Al cancelar la acción perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
      :is-success="false" :cancelButton="true" @closeModal="showCancelModal = false" textButtonCancel="No"
      text-button="Si" @handleAccept="clearFormHandler()" />

    <Modal v-model="showSucessModal" :title="'Entes de Control se ha radicado con éxito'"
      :text="`Trámite de Entes de Control generado correctamente, número de radicado ${nroRadicado}`" is-success
      @handle-cancel="imprimirSticker" :cancel-button2="isCorrespondencia" text-button-cancel2="Imprimir Sticker"
      text-button="Finalizar" @handleAccept="finalizarHandler()" @closeModal="showSucessModal = false" cancel-button
      text-button-cancel="Descargar" @close-modal="downloadDocumentHandler" @handle-accept="showSucessModal = false" />
  </div>
</template>

<script lang="ts" setup>
import ActionButtons from "./Components/ActionButtons.vue";
import { sgdeaAxios } from "src/services";
import FileLoader from "./Components/FileLoader.vue";
import { DocumentoRadicado } from "src/interfaces";
import { useAuthStore } from "stores/auth.store";
import Modal from "components/Modal/Modal.vue";
import Solicitud from "./Steps/Solicitud.vue";
import Remitente from "./Steps/Remitente.vue";
import Afectado from "./Steps/Afectado.vue";
import { saveInMemoryData } from "./utils";
import { toast } from "src/helpers/toast";
import { ref, onMounted } from "vue";
// import Documentos from "./Steps/Documentos.vue";
// import router from "src/router";

enum Steps {
  FORM1,
  FORM2,
  FORM3,
  FORM4,
}

const step = ref(0);
const remitenteForm = ref(null);
const afectadoForm = ref(null);
const solicitudForm = ref(null);
const documentosForm = ref(null);
let showCancelModal = ref(false);
let showSucessModal = ref(false);
const documentos = ref<any>([]);
const solicitudData = ref({});
const remitenteData = ref({});
const afectadoData = ref({});
const nroRadicado = ref("");
const nodeId = ref("");
const idTramite = ref()
const responseRadicado = ref()

const auth = useAuthStore();
let isBtnDisabled = ref(false);

const props = withDefaults(
  defineProps<{
    isCorrespondencia: boolean;
  }>(),
  {
    isCorrespondencia: false
  }
);

const emit = defineEmits(['prev'])

defineExpose({
  step
})

const prev = () => {
  emit("prev")
}

const NextStep = (nextStep) => {
  step.value = nextStep;
};

onMounted(async () => {
  await obtenerPuntoRadicacion()
})

const validateAndNextStep = async (nextStep) => {
  const formsMap = {
    [Steps.FORM1]: remitenteForm,
    [Steps.FORM2]: afectadoForm,
    [Steps.FORM3]: solicitudForm,
  };

  const currentForm = formsMap[step.value];

  if (currentForm) {
    const isValid = await currentForm.value?.validateForm();
    if (!isValid) {
      toast.error(
        "Para continuar, asegúrese de que todos los campos requeridos estén completos"
      );
      return;
    }

    saveInMemoryDataHandler();
    NextStep(nextStep);
  }
};

const saveInMemoryDataHandler = () => {
  const data = saveInMemoryData(
    remitenteForm,
    remitenteData,
    afectadoForm,
    afectadoData,
    solicitudForm,
    solicitudData
  );
  remitenteData.value = data.remitenteData.value;
  solicitudData.value = data.solicitudData.value;
  afectadoData.value = data.afectadoData.value;

  afectadoData.value.lgbti = afectadoData.value.lgbti != (null || "") ? afectadoData.value.lgbti : false;
};

const rejectedFiles = (error) => {
  if (error.some((it) => it.failedPropValidation === "max-file-size")) {
    toast.error("El peso permitido es hasta 50MB.");
  }
  if (error.some((it) => it.failedPropValidation === "max-files")) {
    toast.error("Solo se pueden adjuntar 30 archivos.");
  }
  if (error.some((it) => it.failedPropValidation === "accept")) {
    toast.error(
      "Formato inválido, los formatos permitidos son (pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)."
    );
  }
  if (error.some((it) => it.failedPropValidation === "duplicate")) {
    toast.error(
      "No se pueden subir archivos duplicados."
    );
  }
};

const backStep = (backStep) => {
  saveInMemoryDataHandler();
  step.value = backStep--;
};

const addContratFormatToFormData = (formData, data) => {
  Object.keys(data).forEach((key) => {
    formData.append(`${key}`, data[key]);
  });
};

const saveForm = async () => {
  isBtnDisabled.value = true;
  let formData = new FormData();
  addContratFormatToFormData(formData, remitenteData.value);
  addContratFormatToFormData(formData, afectadoData.value);
  addContratFormatToFormData(formData, solicitudData.value);
  if (documentos.value.length > 0) {
    documentos.value.forEach((file) => {
      formData.append(`files`, file, file.name);
    });
  }
  formData.append("usuarioCreador", auth.$state.userInfo.userid);

  try {
    const response = await sgdeaAxios.post("/api/entes/nuevo", formData, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        accept: "*",
        "Content-Type": "multipart/form-data",
        "Content-Transfer-Encoding": "BINARY",
      },
    });

    responseRadicado.value = response.data;

    if (response.status === 200) {
      const { data } = response;
      nroRadicado.value = data.nroRadicado;
      nodeId.value = data.nodeId;
      idTramite.value = data.id
      showSucessModal.value = true;
      remitenteData.value = {};
      afectadoData.value = {};
      solicitudData.value = {};
      documentos.value = [];
    }

    const dataTrazabilidad = {
      proceso: `ENTC${response.data.id}`,
      secuencia: response.data.nroRadicado,
      estado: response.data.estado,
      descripcion: `${auth.$state.userInfo.name}, Ha radicado el Ente de Control ${response.data.nroRadicado}`,
      comentario: 'Radicado',
      nombre: auth.$state.userInfo.name,
      accion: "Se ha radicado Entes de Control",
      tramite: 'Entes de Control'
    }
    await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad)

  } catch (error) {
    toast.error(
      `Ha ocurrido un error al intentar generar el radicado ${error?.message}`
    );
  }
};

const puntoRadicacion = ref();
const puntoRadicacionDep = ref();
const puntoRadicacionMun = ref();

const obtenerPuntoRadicacion = async () => {
  const idPuntoRadicacion = auth.$state.userInfo.puntoRadicacion;
  if (idPuntoRadicacion) {
    const response = await sgdeaAxios.get(`/correspondencia/puntoRadicacion/${idPuntoRadicacion}`);
    puntoRadicacion.value = response.data.nombrePunto;
    puntoRadicacionDep.value = response.data.departamento;
    puntoRadicacionMun.value = response.data.municipio;
  }
}

const imprimirSticker = async () => {

  const body = {
    idRadicado: responseRadicado.value.nroRadicado,
    telefono: responseRadicado.value.telefonoRemitente,
    numeroDocumento: responseRadicado.value.nroDocumentoRemitente,
    oficina: puntoRadicacion.value,
    departamento: puntoRadicacionDep.value,
    municipio: puntoRadicacionMun.value,
    tipoTramite: "Entes de Control",
    PuntoRadicacion: puntoRadicacion.value,
    dependencia: '',
  };

  try {
    const response = await sgdeaAxios.post(`/sticker/generarSticker/pdf`, body, {
      responseType: 'blob' // Set the response type to 'blob'
    });

    if (response.status === 200) {
      // Create a Blob object from the response data
      const fileBlob = new Blob([response.data], { type: 'application/pdf' });

      // Create a link element
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(fileBlob);
      link.download = `STICKER${responseRadicado.value.nroRadicado}.pdf`; // Specify the file name

      // Append the link to the body
      document.body.appendChild(link);

      // Programmatically trigger a click on the link to download the file
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);

    }

  } catch (error) {
    console.error('Error while downloading the file:', error);
  }
}

const clearFormHandler = () => {
  if (step.value === Steps.FORM1) {
    remitenteForm.value?.clearForm();
  }
  if (step.value === Steps.FORM2) {
    afectadoData.value = {};
    afectadoForm.value?.clearForm();
  }
  if (step.value === Steps.FORM3) {
    solicitudData.value = {};
    solicitudForm.value?.clearForm();
  }
  if (step.value === Steps.FORM4) {
    documentos.value = [];
  }

  step.value = 0;
};

const downloadDocumentHandler = async () => {
  try {
    const { data: listDocs } = await sgdeaAxios.get<any>(
      `/radicados/obtenerHijosPorNodo/${nodeId.value}`
    );

    const docRadicado = listDocs.list.entries?.find(
      (it) => {
        const entryName = it.entry.name;
        return entryName && entryName.startsWith(nroRadicado.value);
      }
    );

    const { data } = await sgdeaAxios.get<DocumentoRadicado>(
      `/radicados/consultar_documento/${docRadicado.entry.id}`
    );
    const byteCharacters = atob(data.base64x);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = String(nroRadicado.value);

    link.click();

    URL.revokeObjectURL(blobUrl);

    location.reload();
  } catch (error) {
    toast.error("Ocurrió un error inesperado.");
  }
};

const finalizarHandler = () => {
  showSucessModal.value = false;
  isBtnDisabled.value = false;
  step.value = 0;
};

const stepTitles = [
  { name: "Remitente", description: "Datos del Remitente" },
  { name: "Afectado", description: "Datos del Afectado" },
  { name: "Solicitud", description: "Información sobre la Solicitud" },
  { name: "Documentos", description: "Documentos Adicionales" },
];
</script>
