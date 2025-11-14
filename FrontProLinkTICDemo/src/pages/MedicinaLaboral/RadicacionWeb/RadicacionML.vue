<template>
  <div class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-8 tw-bg-background">
    <div class="tw-flex tw-justify-between tw-pt-4">
      <h1 class="tw-text-3xl tw-font-bold">Radicación de entrada ML</h1>
    </div>
    <div class="container tw-mt-4">
      <div class="row">
        <div class="col-12">
          <q-linear-progress size="8px" :value="((stepProgress * (step + 1) - 0.125))" />
        </div>
        <div class="col-3 tw-mt-2">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5"
            :class="step >= 0 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Remitentes</b> <br>
            <span class="tw-text-label" :class="step >= 0 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Datos del
              remitente</span>
          </h4>
        </div>
        <div class="col-3 tw-mt-2">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5 "
            :class="step >= 1 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Afectado</b> <br>
            <span class="tw-text-label" :class="step >= 1 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Datos del
              afectado</span>
          </h4>
        </div>
        <div class="col-3 tw-mt-2">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5"
            :class="step >= 2 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Solicitud</b> <br>
            <span class="tw-text-label" :class="step >= 2 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Información
              adicional</span>
          </h4>
        </div>
        <div class="col-3 tw-mt-2">
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
        <StepOneML :op-medios-autoriza="listadoMediosRespuestaOptions" :listado-tipo-remitente="listadoTipoRemitente"
          :listado-canal-radicacion="listadoCanalRadicacion" :tipo-doc="tipoDoc" @cancel="modalPreguntaCancelar = true"
          @next-step="takeFirstForm" />
      </q-tab-panel>

      <q-tab-panel class="tw-bg-white" :name="1">
        <StepTwoML :first-form="dataFirstForm" :tipo-doc="tipoDoc" @prev-step="step--"
          @cancel="modalPreguntaCancelar = true" @next-step="takeTwoForm" />
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

    <Modal v-model="showSuccessModal" :title="'Radicación exitosa'"
      :text="`Trámite de Medicina Laboral generado correctamente, número de radicado ${responseRadicacion.idRadicado}.`"
      is-success text-button="Finalizar" @handleAccept="showSuccessModal = false" @closeModal="showSuccessModal = false"
      cancel-button text-button-cancel="Descargar" @close-modal="handleDownloadRadicacionDocument"
      @handle-accept="router.go(0)" />

    <Modal v-model="modalPreguntaCancelar" title="¡Espera un momento!" :is-success="false" @handleAccept="router.go(0)"
      cancel-button textButtonCancel="No" textButton="Si"
      text="Al cancelar la acción perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
      @close-modal="modalPreguntaCancelar = false" type="button" />
    <Modal v-model="inactivModal" title="" :is-success="false" @handleAccept="router.go(-1)" textButton="Aceptar"
      text="Gracias por usar nuestros servicios" @close-modal="
        inactivModal = false;
      " type="button" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import StepOneML from "./StepOneML.vue";
import StepTwoML from "./StepTwoML.vue";
import StepThreeMl from './StepThreeML.vue'
import StepFourML from "./StepFourML.vue";
import { sgdeaAxios } from "src/services";
import Modal from "src/components/Modal/Modal.vue";
import { useRouter } from "vue-router";
import { DocumentoRadicado } from "src/interfaces";
import { toast } from "src/helpers/toast";
import { getAcronimobyId } from "src/helpers/prefijoTipoDoc";

const showSuccessModal = ref<boolean>(false);
const modalPreguntaCancelar = ref<boolean>(false);
const router = useRouter()
const step = ref(0)
const stepProgress = ref(0.25)
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
const responseRadicacion = ref({
  idRadicado: '',
  node: ''
})
const loading = ref(false)
const inactivModal = ref(false);
let inactivityTimer;

const resetInactivityTimer = () => {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    inactivModal.value = true;
  }, 900000); // 15 minutos de inactividad
};

const handleUserActivity = () => {
  resetInactivityTimer();
};
onMounted(async () => {
  await getData()
})
onMounted(() => {
  document.addEventListener("mousemove", handleUserActivity);
  document.addEventListener("keydown", handleUserActivity);
  resetInactivityTimer();
});

onUnmounted(() => {
  document.removeEventListener("mousemove", handleUserActivity);
  document.removeEventListener("keydown", handleUserActivity);
  clearTimeout(inactivityTimer);
});
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
    listadoCanalRadicacion.value = listadoCanalRadicacion.value.filter((e) => { return e.value === 4 })
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
  { label: '3 GRUPO CENTRO DE EXCELENCIA', value: 7 },
  { label: '4 GRUPO CENTRO DE EXCELENCIA', value: 8 },
  { label: '3 GRUPO JUNTAS DE CALIFICACIÓN', value: 10 },
  { label: '4 GRUPO JUNTAS DE CALIFICACIÓN', value: 11 },
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
  formData.append('canalRadicacion', dataFormsAll.value.canal.value)
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
  formData.append('municipioAfectado', dataFormsAll.value.municipioAfectado.value || dataFormsAll.value.municipioAfectado)
  formData.append('direccionAfectado', dataFormsAll.value.direccionAfectado)
  formData.append('tipoTramite', dataFormsAll.value.tipoTramite)
  formData.append('tipoSolicitud', dataFormsAll.value.tipoSolicitud)
  formData.append('tipoEvento', dataFormsAll.value.tipoEvento)
  formData.append('fechaDictamen', dataFormsAll.value.fechaDictamenJuntaRegional || 'null')
  formData.append('oficina', dataFormsAll.value.oficina.value ?? dataFormsAll.value.oficina)
  formData.append('descripcion', dataFormsAll.value.descripcion)
  formData.append('radicadoRelacionado', dataFormsAll.value.numeroRadicadoRelacionado.value ?? dataFormsAll.value.numeroRadicadoRelacionado)
  formData.append('constancia', dataFormsAll.value.constanciaEjecutoriedad || false)
  formData.append('autorizacionDatos', dataFormsAll.value.constanciaEstado || false)

  if (dataFormsAll.value.numeroSiniestro) {
    formData.append('numeroSiniestro', dataFormsAll.value.numeroSiniestro)
  }

  formData.append('usuarioCreador', 295)

  if (dataFormsAll.value.docs.length) {
    for (let i = 0; i < dataFormsAll.value.docs.length; i++) {
      formData.append('files', dataFormsAll.value.docs[i]);
    }
  }

  await createPerson(dataFormsAll.value.tipoDocumentoRemitente, dataFormsAll.value.numeroDocumentoRemitente,
    dataFormsAll.value.pais.value, dataFormsAll.value.departamento.value ?? 1,
    dataFormsAll.value.municipio.value ?? 1, dataFormsAll.value.nombreRemitente,
    dataFormsAll.value.telefono, dataFormsAll.value.direccionRemitente, dataFormsAll.value.correoRemitente
  )

  await createPerson(dataFormsAll.value.tipoDocumentoAfectado, dataFormsAll.value.numeroDocumentoAfectado,
    dataFormsAll.value.paisAfectado.value, dataFormsAll.value.departamentoAfectado.value,
    dataFormsAll.value.municipioAfectado.value, dataFormsAll.value.nombreAfectado,
    dataFormsAll.value.telefonoAfectado, dataFormsAll.value.direccionAfectado, dataFormsAll.value.correoAfectado
  )

  try {
    const response = await sgdeaAxios.post('/medicina/radicar-entrada', formData)
    if (response.status == 200) {
      const dataTrazabilidad = {
        proceso: `ML${response.data.id}`,
        secuencia: response.data.idRadicado,
        estado: "Radicación",
        descripcion: "Se ha radicado el caso",
        comentario: 'Radicado',
        nombre: 'Radicador Web',
        accion: `Radicador Web ha radicado el caso ${response.data.idRadicado}`,
        tramite: 'Medicina Laboral',
      }
      await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad)
      loading.value = false
      responseRadicacion.value = { idRadicado: response.data.idRadicado, node: response.data.nodeid }
      showSuccessModal.value = true
    }
  } catch (error) {
    toast.error("Ha ocurrido un error al crear la radicación")
    loading.value = false
  }
}

const createPerson = async (tipoDoc, numeroDoc, pais, departamento, municipio, nombre, telf, direccion, email) => {
  try {
    await sgdeaAxios.post('/personas', {
      tipoDocumento: getAcronimobyId(tipoDoc),
      numeroDocumento: numeroDoc,
      pais: pais,
      departamento: departamento,
      municipio: municipio,
      nombre1: nombre,
      nombre2: "",
      apellido1: "",
      apellido2: "",
      telefono: telf,
      direccion: direccion,
      email: email
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
