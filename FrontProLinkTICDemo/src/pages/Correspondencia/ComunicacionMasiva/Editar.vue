<template>
  <main class="q-py-md">
    <div class="tw-flex tw-flex-row tw-gap-2">
      <a class="text-primary q-mb-md block tw-cursor-pointer" style="text-decoration: none" @click="goBack">
        <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
        <b> Volver</b>
      </a>
    </div>
    <div v-if="status === 'Por aprobar' && auth.$state.userInfo.role.toLowerCase() == 'aprobador'" class="tw-flex tw-min-h-[36px] tw-pr-2 tw-gap-2 tw-justify-end">
      <q-btn label="Rechazar" color="secondary" icon="close" @click="showRechazoModal = true" class="tw-w-40" />
      <q-btn label="Aprobar" color="primary" icon="check" @click="showModalAprobarApro = true"
        class="!tw-px-8 tw-w-40" />
    </div>
    <div class="tw-flex tw-justify-between tw-pt-4 tw-mb-3">
      <h1 class="tw-text-3xl tw-font-bold">
        Comunicación # {{ detalleRadicado.id }}
      </h1>
    </div>
    <span
      class="tw-bg-orange-100 q-my-sm tw-mb-3 tw-border-orange-400 tw-border tw-rounded-full tw-w-auto q-px-md q-py-xs">
      {{ status }}
    </span>

    <q-tabs inline-label no-caps outside-arrows align="left"
      class="tw-my-4 tw-rounded-lg tw-bg-white custom-tabs tw-flex rowsTab-alingCenter" indicator-color="transparent"
      active-color="primary">
      <q-tab v-for="tab in getTabs()" :key="tab.label" :name="tab.label" :ripple="false" @click="changeTab(tab.name)"
        :icon="tab.icon" :label="tab.label" class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]" />

    </q-tabs>

    <div v-if="currentTab === allNameTabs.plantillas">
      <Editor :data="dataFooter" :referentKey="referentKey" :restric="false" :base64="documentoFile"
        :isEditorEmpty="true" :document="htmlContent" @datos-response="autoSaveDocument"
        @aprobado="aprobarCasoAprobador" :aprobado="aprobar" :agregarCampos="true" :isMasivo="true" />
    </div>

    <div v-if="currentTab === allNameTabs.cargaMasiva">
      <cargaMasivaModal :showModal="currentTab === allNameTabs.cargaMasiva" :detalleRadicado="detalleRadicado"
        @is-uploaded="uploadedMassive" @update:modelValue="currentTab = allNameTabs.soporteSalida" />
    </div>

    <Reasignar v-if="currentTab === allNameTabs.reasignar" @back-view="backView" :detailsRadicado="detalleRadicado"
      :idComunicacion="detalleRadicado.id" />

    <AjuntarDocumento v-if="currentTab === allNameTabs.soporteSalida" :detailsRadicado="detalleRadicado"
      @back-view="backView" type="Soporte" />
    <Trazabilidad v-if="currentTab === allNameTabs.trazabilidad" :doneItems="trazabilidadData" />

    <IncluirExpediente ref="crearComp" v-if="currentTab === allNameTabs.expediente" :tutelasData="hardcoreData"
      :is-masivo="true" />

    <EnviarAprobacion v-if="currentTab === allNameTabs.enviarAprobacion" :idComunicacion="detalleRadicado.id"
      :expedienteData="detalleRadicado" />

    <ConfirmModal text-cancel-modal="No" text-confirm-modal="Si"
      text-show-modal="¿Está seguro de dar el visto bueno a la respuesta proyectada?"
      @update:show-modal="showModalAprobarApro = false" @confirm-modal="beforeAprobacion()"
      :show-modal="showModalAprobarApro" :loading="loadingEnvios" />
    <div v-if="currentTab === allNameTabs.eliminarComunicacion">
      <ConfirmModal text-cancel-modal="No" text-confirm-modal="Si"
        text-show-modal="¿Está seguro que desea eliminar la comunicación?"
        @update:show-modal="currentTab = 'endesarrollo'" @confirm-modal="eliminarComunicacion"
        :show-modal="openConfirmationAprobador" />
    </div>
    <InputModal v-model="showRechazoModal" title="Rechazar Comunicación" label="Motivo del rechazo"
      textSaveButton="Rechazar" @handleAccept="rechazarComunicacion" @closeModal="showRechazoModal = false" />

    <div v-if="currentTab === allNameTabs.descargarArchivo">
      <DescargarArchivosTable class="tw-w-full" :tipoComunicacion="tipoComunicacion" />
    </div>
  </main>
</template>

<script lang="ts" setup>
import { Ref, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { sgdeaAxios } from "src/services";
import { IRadicadoDetalles } from "../";
import AjuntarDocumento from "./AdjuntarDocumento.vue";
import IncluirExpediente from "src/components/comunicacion/expediente/IncluirExpediente.vue";
import Reasignar from "./Reasignar.vue";
import ConfirmModal from "src/components/Modal/ConfirmModal.vue";
import DescargarArchivosTable from "./DescargarArchivosTable.vue";
import EnviarAprobacion from "./EnviarAprobacion.vue";
import cargaMasivaModal from "./CargaMasiva/cargaMasivaModal.vue";
import { TipoComunicacion } from "./types";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { toast } from "src/helpers/toast";
import { useAuthStore } from "src/stores/auth.store";
import Editor from "src/components/Editor/editor.vue";
import { useDocumentStore } from "src/stores/documentStore";
import Trazabilidad from "src/pages/Expedientes/Trazabilidad/Trazabilidad.vue";
import InputModal from "src/components/Modal/InputModal.vue";


const route = useRoute();
const router = useRouter();
const paramID = ref(route.params.id);
const currentTab = ref("soporteSalida");
const status = ref("");
const detalleRadicado: Ref<Partial<IRadicadoDetalles>> = ref({});
const SAL = ref();
const openConfirmationAprobador = ref(true);
let tipoComunicacion: Ref<TipoComunicacion> = ref();
const auth = useAuthStore();
const showModalAprobarApro = ref(false);
const loadingEnvios = ref(false);
const aprobar = ref(false);
const showRechazoModal = ref(false);
const hardcoreData = ref({
  codigoProceso: "",
  idRadicado: "",
  nodeId: "",
  informacionProceso: {
    numeroDocumentoAfectado: "",
  },
  id: ""
});
const documentoFile = ref("");
const changeTab = (tab) => {
  currentTab.value = tab;
};
const allNameTabs = {
  plantillas: "plantillas",
  endesarrollo: "endesarrollo",
  reasignar: "reasignar",
  DocumentoEntrada: "DocumentoEntrada",
  expediente: "expediente",
  datosSalida: "datosSalida",
  soporteSalida: "soporteSalida",
  enviarRevision: "enviarRevision",
  enviarAprobacion: "enviarAprobacion",
  aprobDoc: "aprobDoc",
  eliminarComunicacion: "eliminarComunicacion",
  descargarArchivo: "descargarArchivo",
  cargaMasiva: "cargaMasiva",
  trazabilidad: "trazabilidad"
};
const trazabilidadData = ref<any[]>([]);
const referentKey = ref({});
const dataFooter = ref({});
const htmlContent = ref("");
const selectedSignature = ref();

const getTabs = () => {
  let tabs = [];
  if (status.value === "En edición" || status.value === "Aprobación rechazada") {
    tabs = [
      {
        label: "Documento",
        name: allNameTabs.plantillas,
        icon: "folder",
      },
      {
        label: "Descargar Formato Masivo",
        name: allNameTabs.descargarArchivo,
        icon: "info",
      },
      {
        label: "Cargar Masivo",
        name: allNameTabs.cargaMasiva,
        icon: "folder_open",
      },
      {
        label: "Adjuntar Documento",
        name: allNameTabs.soporteSalida,
        icon: "post_add",
      },
      {
        label: "Incluir a Expediente",
        name: allNameTabs.expediente,
        icon: "adf_scanner",
      },
      {
        label: "Envíar a Aprobación",
        name: allNameTabs.enviarAprobacion,
        icon: "check_circled",
      },
      {
        label: "Reasignar Gestión",
        name: allNameTabs.reasignar,
        icon: "move_up",
      },
      {
        label: "Eliminar Comunicación",
        name: allNameTabs.eliminarComunicacion,
        icon: "delete_outline",
      },
      {
        label: "Trazabilidad",
        name: allNameTabs.trazabilidad,
        icon: "history",
      },

    ];
  }
  if (status.value === "Por aprobar") {
    tabs = [
      {
        label: "Documento",
        name: allNameTabs.plantillas,
        icon: "folder",
      },

      {
        label: "Eliminar Comunicación",
        name: allNameTabs.eliminarComunicacion,
        icon: "delete_outline",
      },
      {
        label: "Adjuntar Documento",
        name: allNameTabs.soporteSalida,
        icon: "post_add",
      },
      {
        label: "Trazabilidad",
        name: allNameTabs.trazabilidad,
        icon: "history",
      },
    ];
  }
  return tabs;
};

const dataMasivo = ref();
const alldatamasivo = ref();

const getDataMasivo = async () => {
  try {
    const response = await sgdeaAxios.get(
      `/correspondencia/comunicacion/masiva/${route.params.id}/destinatarios`
    );
    if (response.status === 200) {
      const { data } = response;
      dataMasivo.value = data[0];
      alldatamasivo.value = data;
    }
  } catch (error) {
    console.error(error);
  }
};

function goBack() {
  router.push({ path: '/correspondencia/crear-comunicaciones-masiva', query: { volver: 'true' } });
}
const getPlantillas = async () => {
  const nodeidInterno = "da312c2b-b4d2-410f-bc37-7ad814877fbc";
  const nodeidExterno = "4e2c6774-248b-4cb5-8cfc-4b2b7b0bb279";

  const response = await sgdeaAxios.get(
    `/radicados/consultar_documento/${dataComunicacion.value.tipoComunicacion.id === 1
      ? nodeidInterno
      : nodeidExterno
    }`
  );
  return response.data;
};
const dataComunicacion = ref();
const getData = async () => {
  try {
    const response = await sgdeaAxios.get(
      `/correspondencia/comunicacionMasiva/detalle?comunicacionMasivaId=${route.params.id}`
    );
    dataComunicacion.value = response.data;

    if (response.status === 200) {
      const { data } = response;

      if (data) {
        const { data: codigo } = await sgdeaAxios.get(
          `/correspondencia/buscarCaseIDComunicacionXRadicado/${data.secuenciaRadicacion}`
        );
        htmlContent.value = response.data.contenido;
        tipoComunicacion = data?.tipoComunicacion;
        status.value = data?.estado.estado;

        if (data) {
          tipoComunicacion = data?.tipoComunicacion;
          status.value = data?.estado.estado;

          detalleRadicado.value = {
            nodeId: data?.nodeId,
            idRadicado: data?.secuenciaRadicacion,
            id: data?.id,
            estadoProceso: data?.estado.estado,
            tipoTramite: data?.tipoComunicacion?.nombre,
            user: data?.usuario,
            contenido: data?.contenido,
            camposDinamicos: data?.camposDinamicos,
            aprobado: data?.aprobado,
            activado: data?.activado,
          };
          hardcoreData.value = {
            id: data?.id,
            codigoProceso: data.prefijoComunicacion.usuario.bonitaId,
            idRadicado: data.secuenciaRadicacion,
            nodeId: data.nodeId,
            informacionProceso: {
              numeroDocumentoAfectado: "NA", // el enpoint no trae datos del afectado
            },
          };
        }
        hardcoreData.value = {
          codigoProceso: codigo.casoBonitaId,
          idRadicado: data.secuenciaRadicacion,
          nodeId: data.nodeId,
          informacionProceso: {
            numeroDocumentoAfectado: "NA", // el enpoint no trae datos del afectado
          },
          id: data?.id,
        };
      }
    }
  } catch (error) {
    console.error(error);
  }
};
const getTrazabilidad = async () => {
  const response = await sgdeaAxios.get(
    "/trazabilidad/obtenerPorCodProceso/" + "CORMAS" + dataComunicacion.value.id
  );

  trazabilidadData.value = response.data.map((item) => ({
    ...item,
    canal: "Comunicación",
    accion: getHumanizeAction(item, dataComunicacion.value.id),
    tramite: "Comunicación Masiva",
  }));
};

const getHumanizeAction = (item, id) => {
  const { accion, secuencia } = item;
  const accionModificada = secuencia
    ? accion.replace(secuencia, id.toString())
    : accion;
  return accionModificada;
};

const documentStore = useDocumentStore();
const initializeData = async () => {
  await getData();

  await getDataMasivo();

  const getPlantilla = await getPlantillas();
  // Once dataComunicacion and dataMasivo are fetched, map to referentKey
  await mapDataToEditor(dataComunicacion.value, dataMasivo.value, getPlantilla);

};
watch(currentTab, (newTab) => {
  if (newTab === allNameTabs.trazabilidad) {
    getTrazabilidad();
  }
});
async function mapDataToEditor(allData, datosSalida, getPlantilla) {
  documentStore.clearDocumentContent();
  documentoFile.value = getPlantilla.base64x;

  const aprobador = allData?.asignadorDelAprobador;

  if (aprobador) {
    await getFirma(aprobador.id, aprobador.firmaPredeterminadaId);
  }

  if (alldatamasivo.value.length > 0) {
    referentKey.value = {
      asunto: datosSalida.asunto,
      NombredeDestinatario: datosSalida.nombre,
      NumeroDocDestinatario: datosSalida.cedula,
      DireccionDeDestinatario: datosSalida.direccionDependenciaDestino,
      TelefonoDeDestinatario: "",
      DepartamentoYMunicipioDestinatario: `${datosSalida.codigoDepartamentoDestinatario}-${datosSalida.codigoMunicipioDestinatario}`,
      CorrreoDestinatario: `${datosSalida.correoDestinatario} `,
      NombreAfectado: "",
      TIpoDeDocumentoAfectado: "",
      NumerodedocumentoAfectado: "",
      Firma: selectedSignature?.value
        ? selectedSignature?.value?.tipoFirmaUsuario?.nombre === 'Grafo'
          ? selectedSignature?.value?.fileData : selectedSignature?.value?.fileName
        : "",
      NombreAprobador: aprobador
        ? aprobador?.fullname?.toUpperCase().trim()
        : "",
      CargoAprobador: aprobador
        ? aprobador?.cargo?.nombre
        : "",
      DependenciaAprobador: aprobador
        ? aprobador?.usuarioRelaciones?.[0]?.oficina?.dependencia?.nombre
        : "",
    };
  } else {
    referentKey.value = {
      asunto: "",
      NombredeDestinatario: "",
      NumeroDocDestinatario: "",
      DireccionDeDestinatario: "",
      TelefonoDeDestinatario: "",
      DepartamentoYMunicipioDestinatario: "",
      NombreAfectado: "",
      TIpoDeDocumentoAfectado: "",
      NumerodedocumentoAfectado: "",
      Firma: "",
      NombreAprobador: "Nombre Aprobador",
      CargoAprobador: "Cargo",
      DependenciaAprobador: "Dependencia",
    };
  }

  // if (allData?.copiaExterna?.length > 0 || allData?.copiaInterna?.length > 0) {
  //   arrayCopyExterna.value = allData?.copiaExterna.map((item) =>
  //     formatCopyExterna(item)
  //   );
  //   arrayCopyInterna.value = allData?.copiaInterna.map((item) =>
  //     formatCopyInterna(item)
  //   );
  //   arrayAllCopys.value = arrayCopyInterna.value.concat(arrayCopyExterna.value);
  // } else {
  //   arrayCopyExterna.value = [];
  //   arrayCopyInterna.value = [];
  //   arrayAllCopys.value = 0;
  // }
  // const infoRevisor = ` ${
  //   allData?.revisor?.nombreCompleto?.charAt(0).toUpperCase() +
  //   allData?.revisor?.nombreCompleto?.slice(1)
  // } - ${allData?.revisor?.cargo?.toUpperCase()} - ${allData?.revisor?.dependencia?.toUpperCase()}`;
  const dataCreador = `${allData.usuario
    ? allData.usuario.fullname.toUpperCase() +
    " - " +
    allData.usuario.cargo.nombre +
    " - " +
    allData.usuario.usuarioRelaciones[0].oficina.dependencia.nombre
    : ""
    }`;
  const dataAprobador = `${aprobador
    ? aprobador.fullname.toUpperCase() +
    " - " +
    aprobador.cargo.nombre +
    " - " +
    aprobador.usuarioRelaciones[0].oficina.dependencia.nombre
    : ""
    }`;

  dataFooter.value = {
    Anexo: "",
    Copia:(() => {
          if (!datosSalida || !datosSalida.copiaNombre) return [];
          if (datosSalida.copiaCorreo && datosSalida.copiaFormaEnvio !== "Courier") {
            return [`${datosSalida.copiaNombre} / ${datosSalida.copiaCorreo}`];
          }
            return [
              `${datosSalida.copiaNombre} / ${datosSalida.copiaTipoDoc} ${datosSalida.copiaNumDoc} / ${datosSalida.copiaDireccion} / COLOMBIA-${datosSalida.copiaDepartamento}-${datosSalida.copiaMunicipio} / ${datosSalida.copiaCorreo || ''}`
            ];
        })(),
    DatosGestionador: dataCreador,
    DatosRevisor: "",
    DatosAprobador: dataAprobador,
    FormadeEnvio: datosSalida?.codigoFormaEnvio,
  };
}

const getFirma = async (idAprobador, idFirma) => {
  try {
    const response = await sgdeaAxios.get(
      `/usuarios/obtener-firma/${idAprobador || 0}`
    );
    const { data } = response;
    if (data && data.length > 0 && idFirma) {
      selectedSignature.value = data.find(
        (firma) => firma.id === idFirma
      );
    }
  } catch (error) {
    toast.error("Hubo un error al cargar la firma del aprobador")
  }
};

const backView = () => {
  currentTab.value = "vistaInformacionGeneral";
};

async function autoSaveDocument({ paragraf, pdf }) {
  try {
    const htmlContentPara = paragraf;
    const blob = new Blob([htmlContentPara], {
      type: "text/html;charset=UTF-8",
    });
    let response;

    response = await sgdeaAxios.patch(
      "/correspondencia/comunicacionMasiva/guardarContenido",
      {
        idComunicacionMasiva: dataComunicacion.value.id,
        contenido: htmlContentPara,
      }
    );
    toast.success("Documento guardado con exito");
    await crearTrazabilidad({
      proceso: `CORMAS${dataComunicacion.value.id}`,
      secuencia: dataComunicacion.value.secuenciaRadicacion,
      estado: dataComunicacion.value.estado.estado,
      descripcion:
        `Usuario: ${auth.$state.userInfo.name}` +
        `Rol: ${auth.$state.userInfo.role} ` +
        `Comentario: Se han hecho modificaciones al documento`,
      comentario: "El documento ha sido editado.",
      nombre: auth.$state.userInfo.name,
      tramite: dataComunicacion.value.tipoComunicacion?.nombre,
      accion: `Se han hecho modificaciones al documento `,
    });
    await getData();
  } catch (error) {
    toast.error("Hubo un error al guardar el documento.");
  }
}
const eliminarComunicacion = async () => {
  const response = await sgdeaAxios.patch(
    `/correspondencia/comunicacionMasiva/eliminar?comunicacionMasivaId=${paramID.value}`
  );
  if (response.status === 200) {
    await trazabilidad();
    toast.success("El documento fué eliminado correctamente");
    router.push({ path: '/correspondencia/crear-comunicaciones-masiva', query: { volver: 'true' } });
  }
};

function beforeAprobacion() {
  currentTab.value = allNameTabs.plantillas
  loadingEnvios.value = true;
  // showModalAprobarApro.value = true;
  aprobar.value = true;
}

const rechazarComunicacion = async (motivoRechazo: string) => {
  try {
    loadingEnvios.value = true;

    const response = await sgdeaAxios.post(
      `/correspondencia/comunicacionMasiva/rechazar/${dataComunicacion.value.id}`,
      {
        usuarioRechazoId: auth.$state.userInfo.userid,
        motivoRechazo: motivoRechazo
      }
    );

    if (response.status === 200) {
      toast.success("La comunicación ha sido rechazada correctamente");

      await crearTrazabilidad({
        proceso: `CORMAS${dataComunicacion.value.id}`,
        secuencia: dataComunicacion.value.secuenciaRadicacion,
        estado: "Aprobación rechazada",
        descripcion:
          `Usuario: ${auth.$state.userInfo.name}` +
          `Rol: ${auth.$state.userInfo.role} ` +
          `Comentario: Se ha rechazado la comunicación. Motivo: ${motivoRechazo}`,
        comentario: "Se ha rechazado la comunicación.",
        nombre: auth.$state.userInfo.name,
        tramite: "Comunicación Masiva",
        accion: `${auth.$state.userInfo.name} ha rechazado la comunicación ${dataComunicacion.value.secuenciaRadicacion}`,
      });

      goBack();
    }
  } catch (error) {
    toast.error("Ocurrió un error al rechazar la comunicación");
  } finally {
    loadingEnvios.value = false;
    showRechazoModal.value = false;
  }
};
const uploadedMassive = async (isUploaded) => {
  if (isUploaded) {
    await initializeData();
  }
}

const aprobarCasoAprobador = async (data, html) => {
  const formData = new FormData();

  const body = {
    html: html,
  };

  formData.append("htmlRequest", new Blob([JSON.stringify(body)], { type: "text/plain" }), "htmlRequest.txt");

  try {
    const response = await sgdeaAxios.patch(
      `/correspondencia/comunicacion-masiva/aprobarMasivaFromHtml/${dataComunicacion.value.id}`,
      formData,
    );

    if (response.status === 200) {
      SAL.value =
        (response.data as { radicadoSalidaAprobar?: string })?.radicadoSalidaAprobar ?? "";
      toast.success(`Trámite aprobado correctamente. Se generó el radicado de salida ${SAL.value}`);

      await crearTrazabilidad({
        proceso: `CORMAS${dataComunicacion.value.id}`,
        secuencia: dataComunicacion.value.secuenciaRadicacion,
        estado: dataComunicacion.value.estado.estado,
        descripcion:
          `Usuario: ${auth.$state.userInfo.name} ` +
          `Rol: ${auth.$state.userInfo.role} ` +
          `Comentario: El proceso de aprobación ha concluido exitosamente, y el radicado ha sido oficialmente aprobado.`,
        comentario: "El radicado ha sido aprobado.",
        nombre: auth.$state.userInfo.name,
        tramite: dataComunicacion.value.tipoComunicacion?.nombre,
        accion: `Se devolvió el trámite al administrador`,
      });
    }
    goBack();
  } catch (error) {
    toast.error("Ocurrió un error al aprobar el caso:")
  } finally {
    loadingEnvios.value = false;
  }
};


const trazabilidad = async () => {
  try {
    await crearTrazabilidad({
      proceso: `CORMAS${detalleRadicado.value.id}`,
      secuencia: detalleRadicado.value.idRadicado,
      estado: detalleRadicado.value.estadoProceso,
      descripcion: "Se eliminó el radicado",
      comentario: "Se eliminó el radicado",
      nombre: auth.$state.userInfo.name,
      tramite: detalleRadicado.value.tipoTramite,
      accion: "Se eliminó el radicado",
    });
  } catch (error) {
    console.error(error);
  }
};
onMounted(async () => {
  await initializeData();

});
</script>
