<template>
  <main class="q-py-md">
    <div class="tw-flex tw-flex-row tw-gap-2">
      <a class="text-primary q-mb-md block tw-cursor-pointer" style="text-decoration: none" @click="goBack">
        <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
        <b> Volver</b>
      </a>
    </div>

    <div class="tw-flex tw-justify-between tw-pt-4 tw-mb-3">
      <h1 class="tw-text-3xl tw-font-bold">
        Comunicación # {{ detalleRadicado.id }}
      </h1>
    </div>

    <span class="tw-bg-orange-100 q-my-sm tw-mb-3 tw-border-orange-400 tw-border tw-rounded-full tw-w-auto q-px-md q-py-xs">
      {{ status }}
    </span>

    <q-tabs inline-label no-caps outside-arrows align="left"
      class="tw-my-4 tw-rounded-lg tw-bg-white custom-tabs tw-flex rowsTab-alingCenter" indicator-color="transparent"
      active-color="primary">
      <q-tab label="Documento" name="plantillas" ripple="false" @click="currentTab = 'plantillas'" icon="folder"
        class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]" />
      <!-- <q-tab label="Trazabilidad" name="trazabilidad" ripple="false" @click="currentTab = 'trazabilidad'" icon="history"
        class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]" /> -->
    </q-tabs>

    <div v-if="loadingState === 'loading'" class="tw-flex tw-justify-center tw-items-center tw-p-10">
      <q-spinner color="primary" size="3em" />
      <span class="q-ml-md">Cargando datos...</span>
    </div>

    <div v-else-if="loadingState === 'error'" class="tw-flex tw-justify-center tw-items-center tw-p-10">
      <q-icon name="error" color="negative" size="3em" />
      <span class="q-ml-md">Error al cargar los datos</span>
    </div>

    <div v-else>
      <Editor v-if="currentTab === 'plantillas'"
        :data="dataFooter"
        :referentKey="referentKey"
        :restric="false"
        :base64="documentoFile"
        :isEditorEmpty="false"
        :document="processedHtmlContent"
        @datos-response="autoSaveDocument"
        @aprobado="aprobarCasoAprobador"
        :aprobado="aprobar"
        :agregarCampos="true"
        :id="idComunicaciones"
        :isMasivo="true"
      />
<!--
      <Trazabilidad v-if="currentTab === 'trazabilidad'" :doneItems="trazabilidadData" /> -->
    </div>
  </main>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { useAuthStore } from "src/stores/auth.store";
import Editor from "src/components/Editor/editor.vue";
// import Trazabilidad from "src/pages/Expedientes/Trazabilidad/Trazabilidad.vue";
import { crearTrazabilidad } from "src/helpers/trazabilidad";

const route = useRoute();
const router = useRouter();
const currentTab = ref("plantillas");
const status = ref("");
const loadingState = ref<'loading' | 'success' | 'error'>('loading');
const detalleRadicado = ref({
  id: "",
  nodeId: "",
  idRadicado: "",
  estadoProceso: "",
  tipoTramite: "",
});
const documentoFile = ref("");
const trazabilidadData = ref<any[]>([]);
const referentKey = ref({});
const dataFooter = ref({});
const htmlContent = ref("");
const processedHtmlContent = ref("");
const aprobar = ref(false);
const auth = useAuthStore();
const idComunicaciones = ref();

const goBack = () => {
  router.go(-1);
};

const procesarContenidoCompleto = (htmlString: string) => {
  let processed = htmlString
    .replace(/<meta charset="utf-8">/g, '')
    .replace(/<br>\s*&nbsp;/g, '<br>');

  processed = processed.replace(/style="[^"]*"/g, match => {
    return match.replace(/font-family:[^;]*;?/g, '')
               .replace(/font-size:[^;]*;?/g, '')
               .replace(/margin:[^;]*;?/g, '')
               .replace(/padding:[^;]*;?/g, '');
  });

  processed = procesarImagenes(processed);

  processed = processed.replace(/<p>/g, '<p style="margin:0;padding:0;line-height:1.1;font-size:14px;font-family:Arial,sans-serif;">');
  processed = processed.replace(/<p style="[^"]*">/g, '<p style="margin:0;padding:0;line-height:1.1;font-size:14px;font-family:Arial,sans-serif;">');

  processed = processed.replace(/(<p[^>]*>)(\s*<strong>.*?Asunto:.*?<\/strong>)/g, '<p style="margin:25px 0 0 0;padding:0;line-height:1.1;font-size:14px;font-family:Arial,sans-serif;font-weight:bold;">$2');
  processed = processed.replace(/(<p[^>]*>)(\s*Asunto:)/g, '<p style="margin:25px 0 0 0;padding:0;line-height:1.1;font-size:11px;font-family:Arial,sans-serif;font-weight:bold;">$2');

  processed = processed.replace(/(Asunto:[^<]*<\/strong><\/p>)\s*(<p[^>]*>)/g, '$1<p style="margin:10px 0 0 0;padding:0;line-height:1.1;font-size:14px;font-family:Arial,sans-serif;">');
  processed = processed.replace(/(Asunto:[^<]*<\/p>)\s*(<p[^>]*>)/g, '$1<p style="margin:10px 0 0 0;padding:0;line-height:1.1;font-size:14px;font-family:Arial,sans-serif;">');

  if (!processed.includes('<body>')) {
    processed = `<div class="document-content">${processed}</div>`;
  }

  return processed;
};


const extraerContenidoPrincipal = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  doc.querySelectorAll('[id="header"]').forEach(el => el.remove());

  const elementos = doc.querySelectorAll('p, figure, img');

  return Array.from(elementos)
    .filter(element => {
      if (element.tagName.toLowerCase() === 'p') {
        const texto = element.textContent?.trim() || '';
        return texto.length > 0 && !texto.includes('&nbsp;');
      }
      return true;
    })
    .map(element => {
      ['style', 'class', 'id'].forEach(attr => element.removeAttribute(attr));

      if (element.tagName.toLowerCase() === 'img') {
        const src = element.getAttribute('src') || '';
        const alt = element.getAttribute('alt') || '';
        return `<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto;">`;
      }
      return element.outerHTML;
    })
    .join('');
};
const procesarImagenes = (htmlString: string) => {
  let processed = htmlString.replace(/<img([^>]*)src="data:image[^"]*"([^>]*)>/g,
    (match, p1, p2) => `<img${p1} style="max-width: 100%; height: auto; display: block; margin: 10px auto;"${p2}>`
  );

  processed = processed.replace(/<figure([^>]*)>/g,
    '<figure$1 style="margin: 15px 0; text-align: center;">'
  );

  return processed;
};

const yaContieneContenidoPrincipal = (contenido: string, contenidoPrincipal: string) => {
  if (!contenidoPrincipal) return false;

  const parser = new DOMParser();
  const docContenido = parser.parseFromString(contenido, 'text/html');
  const docPrincipal = parser.parseFromString(contenidoPrincipal, 'text/html');

  const textoContenido = docContenido.body.textContent || "";
  const textoPrincipal = docPrincipal.body.textContent || "";

  const imgsContenido = Array.from(docContenido.querySelectorAll('img')).map(img => img.src);
  const imgsPrincipal = Array.from(docPrincipal.querySelectorAll('img')).map(img => img.src);

  const todasImagenesIncluidas = imgsPrincipal.every(imgSrc =>
    imgsContenido.includes(imgSrc)
  );

  return textoContenido.includes(textoPrincipal.trim()) && todasImagenesIncluidas;
};

const getData = async () => {
  loadingState.value = 'loading';
  try {
    const responseDestinatario = await sgdeaAxios.get(
      `/correspondencia/comunicacion/masiva/destinatarioExterno/${route.params.id}`
    );

    if (!responseDestinatario.data?.comunicaionMasivaId) {
      throw new Error("No se encontró el ID de comunicación masiva");
    }

    const comunicaionMasivaId = responseDestinatario.data.comunicaionMasivaId;
    const dataDestinatario = responseDestinatario.data;
    idComunicaciones.value = comunicaionMasivaId;

    let contenidoPrincipalExtraido = "";
    try {
      const responseComunicacionDetalle = await sgdeaAxios.get(
        `/correspondencia/comunicacionMasiva/detalle?comunicacionMasivaId=${comunicaionMasivaId}`
      );

      if (responseComunicacionDetalle.status === 200 && responseComunicacionDetalle.data.contenido) {
        const contenidoCompleto = responseComunicacionDetalle.data.contenido;
        contenidoPrincipalExtraido = extraerContenidoPrincipal(contenidoCompleto);
      }
    } catch (error) {
      console.error(error);
    }

    if (!dataDestinatario.contenido) {
      const encabezadoDestinatario = `
        <p style="margin:0;">Señor(a):</p>
        <p style="margin:0;">${dataDestinatario.destinatarioNombre || ''}</p>
        <p style="margin:0;">Dirección: ${dataDestinatario.destinatarioDireccion || ''}</p>
        <p style="margin:0;">Correo: ${dataDestinatario.destinatarioCorreo || ''}</p>
        <p style="margin:0;">${dataDestinatario.destinatarioDepartamento || ''}-${dataDestinatario.destinatarioMinicipio || ''}</p>
        <p><br></p>
        <p style="margin:0;"><strong>Asunto: ${dataDestinatario.asunto || ''}</strong></p>
      `;
      htmlContent.value = encabezadoDestinatario + contenidoPrincipalExtraido;
    } else {
      const contenidoExistente = dataDestinatario.contenido || "";

      if (contenidoPrincipalExtraido && !yaContieneContenidoPrincipal(contenidoExistente, contenidoPrincipalExtraido)) {
        htmlContent.value = contenidoExistente + contenidoPrincipalExtraido;
      } else {
        htmlContent.value = contenidoExistente;
      }
    }

    status.value = "Cargando...";

    detalleRadicado.value = {
      id: comunicaionMasivaId,
      nodeId: "",
      idRadicado: "",
      estadoProceso: "",
      tipoTramite: "",
    };

    if (currentTab.value === 'plantillas') {
      await loadDetailedData(comunicaionMasivaId, dataDestinatario);
    }

    processedHtmlContent.value = procesarContenidoCompleto(htmlContent.value);
    loadingState.value = 'success';
  } catch (error: any) {
    toast.error("Error al cargar los datos de la comunicación");
    loadingState.value = 'error';

    if (error.response?.data) {
      htmlContent.value = error.response.data.contenido || "";
      processedHtmlContent.value = procesarContenidoCompleto(htmlContent.value);
    }
  }
};

const loadDetailedData = async (comunicaionMasivaId: string, dataDestinatario: any) => {
  try {
    const responseComunicacion = await sgdeaAxios.get(
      `/correspondencia/comunicacionMasiva/detalle?comunicacionMasivaId=${comunicaionMasivaId}`
    );

    if (responseComunicacion.status === 200) {
      const dataComunicacion = responseComunicacion.data;

      if (dataDestinatario.destinatarioCorreo) {
        const correoRegex = /Correo:\s*[\w.-]+@[\w.-]+\.\w+/i;
        htmlContent.value = htmlContent.value.replace(
          correoRegex,
          `Correo: ${dataDestinatario.destinatarioCorreo}`
        );
        processedHtmlContent.value = procesarContenidoCompleto(htmlContent.value);
      }

      status.value = dataComunicacion?.estado.estado || "Desconocido";

      detalleRadicado.value = {
        ...detalleRadicado.value,
        nodeId: dataComunicacion?.nodeId || "",
        idRadicado: dataComunicacion?.secuenciaRadicacion || "",
        estadoProceso: dataComunicacion?.estado.estado || "",
        tipoTramite: dataComunicacion?.tipoComunicacion?.nombre || "",
      };

      const aprobador = dataComunicacion?.asignadorDelAprobador;
      referentKey.value = {
        asunto: dataDestinatario.asunto || "",
        NombredeDestinatario: dataDestinatario.destinatarioNombre || "",
        NumeroDocDestinatario: dataDestinatario.estinatarioNumDoc || "",
        DireccionDeDestinatario: dataDestinatario.destinatarioDireccion || "",
        TelefonoDeDestinatario: dataDestinatario.destinatarioTelefono || "",
        DepartamentoYMunicipioDestinatario: `${dataDestinatario.destinatarioDepartamento || ""} - ${dataDestinatario.destinatarioMinicipio || ""}`,
        NombreAfectado: dataDestinatario.afectadoNombre || "",
        TIpoDeDocumentoAfectado: dataDestinatario.afectadoTipoDoc || "",
        NumerodedocumentoAfectado: dataDestinatario.afectadoNumDoc || "",
        Firma: "",
        NombreAprobador: aprobador?.fullname?.toUpperCase().trim() || "",
        CargoAprobador: aprobador?.cargo?.nombre || "",
        DependenciaAprobador: aprobador?.usuarioRelaciones?.[0]?.oficina?.dependencia?.nombre || "",
        CorreoDestinatario: dataDestinatario.destinatarioCorreo || "",
        FormaEnvio: dataDestinatario.codigoFormaEnvio || "",
      };

      dataFooter.value = {
        Anexo: dataDestinatario.cantidadAnexosFolios?.toString() || "0",
        Copia: (() => {
          if (!dataDestinatario || !dataDestinatario.copiaNombre) return [];
          if (dataDestinatario.copiaCorreo && dataDestinatario.copiaFormaEnvio !== "Courier") {
            return [`${dataDestinatario.copiaNombre} / ${dataDestinatario.copiaCorreo}`];
          }
            return [
              `${dataDestinatario.copiaNombre} / ${dataDestinatario.copiaTipoDoc} ${dataDestinatario.copiaNumDoc} / ${dataDestinatario.copiaDireccion} / COLOMBIA-${dataDestinatario.copiaDepartamento}-${dataDestinatario.copiaMunicipio} / ${dataDestinatario.copiaCorreo || ''}`
            ];
        })(),
        DatosGestionador: dataComunicacion.usuario
          ? `${dataComunicacion.usuario.fullname.toUpperCase()} - ${dataComunicacion.usuario.cargo.nombre} - ${dataComunicacion.usuario.usuarioRelaciones[0].oficina.dependencia.nombre}`
          : "",
        DatosRevisor: "",
        DatosAprobador: aprobador
          ? `${aprobador.fullname.toUpperCase()} - ${aprobador.cargo.nombre} - ${aprobador.usuarioRelaciones[0].oficina.dependencia.nombre}`
          : "",
        FormadeEnvio: dataDestinatario.codigoFormaEnvio || "",
      };

      if (aprobador?.firmaPredeterminadaId) {
        await getFirma(aprobador.id, aprobador.firmaPredeterminadaId);
      }
    }
  } catch (error) {
    toast.error("Error al cargar los datos detallados");
  }
};

const getFirma = async (userId: string, firmaId: string) => {
  try {
    const response = await sgdeaAxios.get(`/usuarios/obtener-firma/${userId}`);
    if (response.data?.length) {
      const firma = response.data.find((f: any) => f.id === firmaId);
      if (firma) {
        referentKey.value.Firma = firma.tipoFirmaUsuario?.nombre === 'Grafo'
          ? firma.fileData
          : firma.fileName;
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const getTrazabilidadData = async () => {
  try {
    const response = await sgdeaAxios.get(
      `/trazabilidad/obtenerPorCodProceso/CORMAS${route.params.id}`
    );
    trazabilidadData.value = response.data || [];
  } catch (error) {
    console.error(error);
  }
};

async function autoSaveDocument({ paragraf }: { paragraf: string }) {
  try {
    const response = await sgdeaAxios.patch(
      "/correspondencia/comunicacionMasiva/guardarContenidoIndividual",
      {
        idComunicacionMasiva: route.params.id,
        contenido: paragraf,
      }
    );

    toast.success("Documento guardado con éxito");

    await crearTrazabilidad({
      proceso: `CORMAS${route.params.id}`,
      secuencia: detalleRadicado.value.idRadicado,
      estado: status.value,
      descripcion: `Usuario: ${auth.$state.userInfo.name} editó el documento`,
      comentario: "El documento ha sido editado.",
      nombre: auth.$state.userInfo.name,
      tramite: detalleRadicado.value.tipoTramite,
      accion: "Edición de documento",
    });

  } catch (error) {
    toast.error("Hubo un error al guardar el documento.");
  }
}

const aprobarCasoAprobador = async (data: any) => {
  const formData = new FormData();
  formData.append("file", data?.file ?? data, data?.file?.name ?? "documento.pdf");

  try {
    const response = await sgdeaAxios.patch(
      `/correspondencia/comunicacion-masiva/aprobar/${route.params.id}`,
      formData
    );

    if (response.status === 200) {
      toast.success("Documento aprobado correctamente");

      await crearTrazabilidad({
        proceso: `CORMAS${route.params.id}`,
        secuencia: detalleRadicado.value.idRadicado,
        estado: status.value,
        descripcion: `Usuario: ${auth.$state.userInfo.name} aprobó el documento`,
        comentario: "El documento ha sido aprobado",
        nombre: auth.$state.userInfo.name,
        tramite: detalleRadicado.value.tipoTramite,
        accion: "Aprobación de documento",
      });
    }
  } catch (error) {
    toast.error("Error al aprobar el documento");
  }
};

watch(() => route.params.id, (id) => {
  if (id) {
    getData();
    getTrazabilidadData();
  }
}, { immediate: true });

watch(() => currentTab.value, (newTab) => {
  if (newTab === 'plantillas') {
    getData();
  }
});

onMounted(async () => {
  await getData();
  await getTrazabilidadData();
});
</script>

<style>
.document-content {
  font-family: Arial, sans-serif;
  font-size: 14px;
  line-height: 1.2;
}

.document-content p {
  margin: 0 !important;
  padding: 0 !important;
  line-height: 1.15 !important;
  margin-bottom: 2px !important;
}

.document-content p strong {
  font-weight: bold;
  font-size: 14px;
}

.document-content p:has(strong) {
  margin-top: 8px !important;
}
</style>
