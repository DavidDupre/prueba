<template>
  <div class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
    <div v-if="!isCorrespondencia" class="tw-pt-4">
      <router-link to="/home">
        <q-btn flat color="primary" label="Volver" icon="chevron_left" />
      </router-link>
    </div>

    <div v-if="!isCorrespondencia" class="tw-flex tw-justify-between tw-pt-4">
      <h1 class="tw-text-3xl tw-font-bold">Radicación de entrada ML</h1>
    </div>
    <div v-if="!isCorrespondencia" class="container tw-mt-4">
      <div class="row">
        <div class="col-12">
          <q-linear-progress size="8px"
            :value="stepOne?.form0?.canal != 3 ? ((stepProgress * (step + 1) - 0.125)) : ((0.3333 * (step + 1) - 0.16666))" />
        </div>
      </div>
      <div class="tw-grid tw-gap-0" :class="stepOne?.form0?.canal != 3 ? 'tw-grid-cols-4' : 'tw-grid-cols-3'">
        <div class="">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5"
            :class="step >= 0 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Remitentes</b> <br>
            <span class="tw-text-label" :class="step >= 0 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Datos del
              remitente</span>
          </h4>
        </div>
        <div class="">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5 "
            :class="step >= 1 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Afectado</b> <br>
            <span class="tw-text-label" :class="step >= 1 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Datos del
              afectado</span>
          </h4>
        </div>
        <div class="">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5"
            :class="step >= 2 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Solicitud</b> <br>
            <span class="tw-text-label" :class="step >= 2 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Información
              adicional</span>
          </h4>
        </div>
        <div v-if="stepOne?.form0?.canal != 3" class="">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5"
            :class="step >= 3 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Documento</b> <br>
            <span class="tw-text-label" :class="step >= 3 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Adjuntar
              documentos de entrada</span>
          </h4>
        </div>

      </div>

    </div>

    <q-tab-panels keep-alive v-model="step" animated>
      <q-tab-panel class="tw-bg-white" :name="0">
        <StepOneML ref="stepOne" :is-correspondencia="isCorrespondencia" @prev="prev"
          :op-medios-autoriza="listadoMediosRespuestaOptions" :listado-tipo-remitente="listadoTipoRemitente"
          :listado-canal-radicacion="listadoCanalRadicacion" :tipo-doc="tipoDoc" @cancel="modalPreguntaCancelar = true"
          @next-step="takeFirstForm" />
      </q-tab-panel>

      <q-tab-panel class="tw-bg-white" :name="1">
        <StepTwoML :first-form="dataFirstForm" :tipo-doc="tipoDoc" @prev-step="step--"
          @cancel="modalPreguntaCancelar = true" @next-step="takeTwoForm"
          :is-correspondencia="props.isCorrespondencia" />
      </q-tab-panel>

      <q-tab-panel class="tw-bg-white" :name="2">
        <StepThreeMl :first-form="dataFirstForm" :second-form="dataTwoForm" :listado-solicitud="listadoTiposSolicitud"
          :listado-oficinas="listadoOficinas" :listado-radicados="listadoRadicados" @prev-step="step--"
          @cancel="modalPreguntaCancelar = true" @next-step="takeThreeForm" />
      </q-tab-panel>

      <q-tab-panel class="tw-bg-white" :name="3">
        <StepFourML @prev-step="step--" @cancel="modalPreguntaCancelar = true" @next-step="takeLastForm"
          :is-loading="loading" />
      </q-tab-panel>
    </q-tab-panels>

    <ScannerModal v-model="showScanModal" @files-ready="handleFilesFromScanner" />

    <Modal v-model="showSuccessModal" :title="'Radicación exitosa'"
      :text="`Trámite de Medicina Laboral generado correctamente, número de radicado ${responseRadicacion.idRadicado}.`"
      is-success text-button="Finalizar" @handleAccept="showSuccessModal = false" @closeModal="showSuccessModal = false"
      @handle-cancel="imprimirSticker" cancel-button :cancel-button2="isCorrespondencia"
      text-button-cancel2="Imprimir Sticker" text-button-cancel="Descargar"
      @close-modal="handleDownloadRadicacionDocument" @handle-accept="router.go(0)" />

    <Modal v-model="modalPreguntaCancelar" title="¡Espera un momento!" :is-success="false"
      @handleAccept="router.push('/home')" cancel-button textButtonCancel="No" textButton="Si"
      text="Al cancelar la acción perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
      @close-modal="modalPreguntaCancelar = false" type="button" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import StepOneML from "./StepOneML.vue";
import StepTwoML from "./StepTwoML.vue";
import StepThreeMl from './StepThreeML.vue'
import StepFourML from "./StepFourML.vue";
import { intescoAxios, sgdeaAxios } from "src/services";
import Modal from "src/components/Modal/Modal.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth.store";
import { DocumentoRadicado } from "src/interfaces";
import { useQuasar } from "quasar";
import { toast } from "src/helpers/toast";
import { getAcronimobyId } from "src/helpers/prefijoTipoDoc";
import ScannerModal from "src/components/Modal/ScannerModal.vue";
import moment from "moment";

const showSuccessModal = ref<boolean>(false);
const modalPreguntaCancelar = ref<boolean>(false);
const router = useRouter()
const step = ref(0)
const stepProgress = ref(0.25)
const q = useQuasar()
const listadoCanalRadicacion = ref()
const listadoTipoRemitente = ref()
const listadoTiposSolicitud = ref()
const listadoOficinas = ref()
const tipoDoc = ref()
const listadoMediosRespuestaOptions = ref()
const listadoRadicados = ref()
const dataFirstForm = ref()
const dataTwoForm = ref()
const dataThreeForm = ref()
const dataFourForm = ref()
const dataFormsAll = ref()
const auth = useAuthStore()
const responseRadicado = ref()
const responseRadicacion = ref({
  idRadicado: '',
  node: ''
})
const stepOne = ref()
const showScanModal = ref<boolean>(false);

const props = withDefaults(
  defineProps<{
    isCorrespondencia: boolean
  }>(),
  {
    isCorrespondencia: false
  }
);

const emit = defineEmits(['prev'])

const loading = ref(false)

onMounted(async () => {
  await getData()
  await obtenerPuntoRadicacion()
})

const getData = async () => {
  try {
    await loadListadosCanalRadicacion()
    await loadListadosTipoRemitente()
    await loadTipoDoc()
    await loadListadosMediosRepuesta()
    await loadTiposSolicitud()
    await loadRadicados()
  } catch (error) {
    console.error(error)
  }
}

const prev = () => {
  emit('prev')
}

async function loadListadosCanalRadicacion() {
  try {
    const response = await sgdeaAxios.get("/medicina/canal-radicacion")
    if (response.status == 200 || response.status == 201) {
      listadoCanalRadicacion.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        }
      })
    }
    listadoCanalRadicacion.value = listadoCanalRadicacion.value.filter((e) => { return e.value !== 4 })
  } catch (error) {
    console.error(error)
  }
}

async function loadListadosTipoRemitente() {
  try {
    const response = await sgdeaAxios.get("/medicina/tipos-remitente")
    if (response.status == 200 || response.status == 201) {
      listadoTipoRemitente.value = response.data.map((e: any) => {
        return {
          label: e.nombre.includes("Apoderado") ? "Familiar" : e.nombre,
          value: e.id
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}

defineExpose({
  step
})

async function loadTipoDoc() {
  const { data } = await sgdeaAxios.get("/correspondencia/comunicacion/listadoTipoIdentificacion");
  tipoDoc.value = data.map((val: any) => {
    return {
      label: val.nombre,
      value: val.id,
    };
  }).filter((item) => item.label !== 'Ninguno')
  tipoDoc.value = sortOptions(tipoDoc.value).sort((a, b) => {
    if (a.value == 1) return -1; // "Cédula Ciudadanía" va primero
    if (b.value == 1) return 1;  // Si b es "Cédula Ciudadanía", va después

    if (a.value == 3) return -1; // "Carné Diplomático" va segundo
    if (b.value == 3) return 1;  // Si b es "Carné Diplomático", va después

    return 0;
  });
}

async function loadListadosMediosRepuesta() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoMediosRespuesta")
    if (response.status == 200 || response.status == 201) {
      listadoMediosRespuestaOptions.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}

async function loadTiposSolicitud() {
  try {
    const response = await sgdeaAxios.get("/medicina/tipos-solicitud")
    if (response.status == 200 || response.status == 201) {
      listadoTiposSolicitud.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        }
      })
      listadoTiposSolicitud.value = sortOptions(listadoTiposSolicitud.value)
    }
  } catch (error) {
    console.error(error)
  }
}

async function loadRadicados() {
  try {
    const response = await sgdeaAxios.get("/medicina/radicados", {
      params: { palabra: '', page: 0, size: 5 }
    })
    if (response.status == 200 || response.status == 201) {
      listadoRadicados.value = response.data.content.map((e: any) => {
        return {
          label: e,
          value: e
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}

listadoOficinas.value = [
  { label: '5 GRUPO CENTRO DE EXCELENCIA', value: 7 },
  { label: '6 GRUPO CENTRO DE EXCELENCIA', value: 8 },
  { label: '5 GRUPO JUNTAS DE CALIFICACIÓN', value: 10 },
  { label: '6 GRUPO JUNTAS DE CALIFICACIÓN', value: 11 },
  { label: 'GERENCIA MÉDICA EXCELENCIA', value: 9 },
  { label: 'GERENCIA MEDICA JUNTAS', value: 12 },
  { label: 'Mesa Back Medicina Laboral', value: 13 },
]

function takeFirstForm(form) {
  step.value++
  dataFirstForm.value = form
}

function takeTwoForm(form) {
  dataTwoForm.value = form
  step.value++
}

function takeThreeForm(form) {
  dataThreeForm.value = form
  step.value++
}

async function takeLastForm(form) {
  loading.value = true
  dataFourForm.value = form
  dataFormsAll.value = { ...dataFirstForm.value, ...dataTwoForm.value, ...dataThreeForm.value, ...dataFourForm.value }

  const formData = new FormData()

  formData.append('tipoRemitente', dataFormsAll.value.tipoRemitente)
  formData.append('tipoDocumentoRemitente', dataFormsAll.value.tipoDocumentoRemitente)
  formData.append('numeroDocumentoRemitente', dataFormsAll.value.numeroDocumentoRemitente || '')
  formData.append('nombreRemitente', dataFormsAll.value.nombreRemitente)
  formData.append('canalRadicacion', dataFormsAll.value.canal)
  formData.append('paisRemitente', dataFormsAll.value.pais.value)
  formData.append('departamentoRemitente', dataFormsAll.value.departamento.value ?? 1)
  formData.append('municipioRemitente', dataFormsAll.value.municipio.value ?? 1)
  formData.append('direccionRemitente', dataFormsAll.value.direccionRemitente)
  formData.append('emailRemitente', dataFormsAll.value.correoRemitente)
  formData.append('telefonoRemitente', dataFormsAll.value.telefono)
  formData.append('medioRespuesta', dataFormsAll.value.medioAutorizadorParaRespuesta)

  formData.append('nombreAfectado', dataFormsAll.value.nombreAfectado)
  formData.append('tipoDocumentoAfectado', dataFormsAll.value.tipoDocumentoAfectado)
  formData.append('numeroDocumentoAfectado', dataFormsAll.value.numeroDocumentoAfectado)
  formData.append('emailAfectado', dataFormsAll.value.correoAfectado)
  formData.append('telefonoAfectado', dataFormsAll.value.telefonoAfectado)
  formData.append('paisAfectado', dataFormsAll.value.paisAfectado.value)
  formData.append('departamentoAfectado', dataFormsAll.value.departamentoAfectado.value)
  formData.append('municipioAfectado', dataFormsAll.value.municipioAfectado.value)
  formData.append('direccionAfectado', dataFormsAll.value.direccionAfectado)

  formData.append('tipoTramite', dataFormsAll.value.tipoTramite)
  formData.append('tipoSolicitud', dataFormsAll.value.tipoSolicitud)
  formData.append('tipoEvento', dataFormsAll.value.tipoEvento)
  formData.append('fechaDictamen', dataFormsAll.value.fechaDictamenJuntaRegional || null)
  formData.append('oficina', dataFormsAll.value.oficina?.value ?? dataFormsAll.value.oficina)
  formData.append('descripcion', dataFormsAll.value.descripcion)
  formData.append('radicadoRelacionado', dataFormsAll.value.numeroRadicadoRelacionado?.value ?? dataFormsAll.value.numeroRadicadoRelacionado)
  formData.append('constancia', dataFormsAll.value.constanciaEjecutoriedad || false)
  formData.append('autorizacionDatos', dataFormsAll.value.constanciaEstado || false)
  // formData.append('lgbti', dataFormsAll.value.lgbti?.value);
  if (dataFormsAll.value.idSexo) {
    formData.append('generoId', dataFormsAll.value.idSexo?.value || dataFormsAll.value?.idSexo);
  }

  if (dataFormsAll.value.numeroSiniestro) {
    formData.append('numeroSiniestro', dataFormsAll.value.numeroSiniestro)
  }

  formData.append('usuarioCreador', auth.userInfo.userid)

  if (dataFormsAll.value.docs.length) {
    for (let i = 0; i < dataFormsAll.value.docs.length; i++) {
      formData.append('files', dataFormsAll.value.docs[i]);
    }
  }

  await createPerson(
    dataFormsAll.value.tipoDocumentoRemitente,
    dataFormsAll.value.numeroDocumentoRemitente,
    dataFormsAll.value.pais?.value ?? 1,
    dataFormsAll.value.departamento?.value ?? 1,
    dataFormsAll.value.municipio?.value ?? 1,
    dataFormsAll.value.nombreRemitente,
    dataFormsAll.value.telefono,
    dataFormsAll.value.direccionRemitente,
    dataFormsAll.value.correoRemitente,
    dataFormsAll.value.idSexo?.value ?? null
  )

  await createPerson(
    dataFormsAll.value.tipoDocumentoAfectado,
    dataFormsAll.value.numeroDocumentoAfectado,
    dataFormsAll.value.paisAfectado?.value ?? null,
    dataFormsAll.value.departamentoAfectado?.value ?? null,
    dataFormsAll.value.municipioAfectado?.value ?? null,
    dataFormsAll.value.nombreAfectado,
    dataFormsAll.value.telefonoAfectado,
    dataFormsAll.value.direccionAfectado,
    dataFormsAll.value.correoAfectado,
    dataFormsAll.value.idSexo?.value ?? null
  )

  try {
    const response = await sgdeaAxios.post('/medicina/radicar-entrada', formData)
    responseRadicado.value = response.data;

    if (response.status == 200) {
      const dataTrazabilidad = {
        proceso: `ML${response.data.id}`,
        secuencia: response.data.idRadicado,
        estado: "Por asignar",
        descripcion: `Usuario: ${auth.$state.userInfo.name} Ha radicado el caso ${response.data.idRadicado}`,
        comentario: dataFormsAll.value.descripcion,
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} ha radicado el caso ${response.data.idRadicado}`,
        tramite: 'Medicina Laboral',
      }
      await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad)
      loading.value = false
      responseRadicacion.value = {
        idRadicado: response.data.idRadicado,
        node: response.data.nodeid,
        id: response.data.id
      }
      showSuccessModal.value = true
    }
  } catch (error) {
    toast.error("Ha ocurrido un error al crear la radicación")
    loading.value = false
  }
}

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

const handleFilesFromScanner = async (files: File[]) => {
  if (!files || files.length === 0) {
    toast.error('No se seleccionó ningún archivo para adjuntar.');
    return;
  }

  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    // 2. Obtener los IDs dinámicos que necesitas
    const radicadoId = responseRadicado.value.id;
    const userId = auth.userInfo.userid;

    // 3. Construir la URL del endpoint dinámicamente
    const url = `/medicina/documentos/${radicadoId}?user=${userId}&tipoDocumento=ENTRADA`;

    const response = await sgdeaAxios.post(url, formData);

    // 5. Manejar la respuesta exitosa
    if (response.status === 200 || response.status === 201) {
      toast.success(`${files.length} archivo(s) adjuntado(s) correctamente al radicado ${responseRadicado.value.idRadicado}.`);
      cancelarFormulario();
    } else {
      toast.warning('El servicio respondió, pero con un estado inesperado.');
    }

  } catch (error) {
    console.error('Error al adjuntar documentos:', error);
    toast.error('Ocurrió un error al intentar adjuntar los documentos.');
  }
};

const cancelarFormulario = async () => {
  router.push('/home')
}

function convertirFechaAFormatoISO(fechaString) {
  const [fechaParte, horaParte] = fechaString.split(' ');

  const [dia, mes, anio] = fechaParte.split('/');
  const [hora, minuto, segundo] = horaParte.split(':');


  const fechaObjeto = new Date(anio, mes - 1, dia, hora, minuto, segundo);

  const anioISO = fechaObjeto.getFullYear();
  const mesISO = String(fechaObjeto.getMonth() + 1).padStart(2, '0');
  const diaISO = String(fechaObjeto.getDate()).padStart(2, '0');
  const horaISO = String(fechaObjeto.getHours()).padStart(2, '0');
  const minutoISO = String(fechaObjeto.getMinutes()).padStart(2, '0');
  const segundoISO = String(fechaObjeto.getSeconds()).padStart(2, '0');

  return `${anioISO}-${mesISO}-${diaISO}T${horaISO}:${minutoISO}:${segundoISO}`;
}

const imprimirSticker = async () => {

    const fechaDeaRadicado = responseRadicado.value.fechaRadicacion

    const fechaParaEnviar = convertirFechaAFormatoISO(fechaDeaRadicado);
  const body = {
    idRadicado: responseRadicado.value.idRadicado,
    telefono: responseRadicado.value.telefonoRemitente,
    numeroDocumento: responseRadicado.value.numeroDocumentoRemitente,
    oficina: puntoRadicacion.value ? puntoRadicacion.value : responseRadicado.value.oficina,
    departamento: puntoRadicacionDep.value,
    municipio: puntoRadicacionMun.value,
    tipoTramite: responseRadicado.value.tipoTramite,
    PuntoRadicacion: puntoRadicacion.value,
    fechaRadicacion: fechaParaEnviar,
    dependencia: '',
  };

  try {
    const response = await sgdeaAxios.post(`/sticker/generarSticker/pdf`, body, {
      responseType: 'blob'
    });

    if (response.status === 200) {

      const fileBlob = new Blob([response.data], { type: 'application/pdf' });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(fileBlob);
      link.download = `STICKER${responseRadicado.value.idRadicado}.pdf`; // Specify the file name

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

    }

  } catch (error) {
    console.error('Error while downloading the file:', error);
  }

  if (props.isCorrespondencia) {
      showSuccessModal.value = false;
      showScanModal.value = true;
    }else{
        showSuccessModal.value = true
  }
}

const createPerson = async (tipoDoc?, numeroDoc?, pais?, departamento?, municipio?, nombre?, telf?, direccion?, email?, genero?) => {
  const isSamePais = departamento === pais && municipio === pais
  const dep = isSamePais ? null : departamento
  const mun = isSamePais ? null : municipio

  try {
    await sgdeaAxios.post('/personas', {
      tipoDocumento: tipoDoc ?? null,
      numeroDocumento: numeroDoc ?? null,
      pais: pais ?? null,
      departamento: dep ?? null,
      municipio: mun ?? null,
      nombre1: nombre ?? null,
      nombre2: "",
      apellido1: "",
      apellido2: "",
      telefono: telf ?? null,
      direccion: direccion ?? null,
      email: email ?? null,
      genero: genero ?? null
    })
  } catch (error) {
    toast.error("Ha ocurrido un error al guardar la información")
  }
}

const handleDownloadRadicacionDocument = async () => {
  try {
    const { data: listDocs } = await sgdeaAxios.get<any>(
      `/radicados/obtenerHijosPorNodo/${responseRadicacion.value.node}`
    );

    const docRadicado = listDocs.list.entries?.find((it) => {
      const entryName = it.entry.name
      return entryName && entryName.startsWith(responseRadicacion.value.idRadicado)
    })

    const { data } = await sgdeaAxios.get<DocumentoRadicado>(
      `/radicados/consultar_documento/${docRadicado.entry.id}`
    );
    const byteCharacters = atob(data.base64x);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = String(responseRadicacion.value.idRadicado);

    link.click();

    URL.revokeObjectURL(blobUrl);

    location.reload()
  } catch (error) {
    toast.error("Ocurrió un error inesperado.");
  }
};

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

</script>
