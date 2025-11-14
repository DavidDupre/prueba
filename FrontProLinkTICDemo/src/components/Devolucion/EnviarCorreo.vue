<template>
  <q-form ref="formulario" greedy>
    <q-card class="tw-rounded-xl tw-p-4" flat>
      <q-expansion-item default-opened>
        <template v-slot:header>
          <div class="col row">
            <b class="tw-text-xl">Enviar por Correo</b>
          </div>
        </template>
        <div class="row q-col-gutter-md q-pb-md q-px-md">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <span class="text-weight-bold">Correo electrónico *</span>
            <q-input :rules="[inputRequired, validationEmail, v => maxLengthInput(50, v)]" map-options outlined
              v-model="form.correo" label="Inserte" dense autocomplete="off" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <span class="text-weight-bold">Forma de Envío *</span>
            <q-select :rules="[inputRequired]" outlined v-model="form.formaEnvio" label="Seleccione" dense emit-value
              map-options :options="opsEnvios" />
          </div>
        </div>
      </q-expansion-item>
    </q-card>
    <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
      <q-btn class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]" no-caps
        style="border: 1px solid #2c3948" @click="$emit('backView')" label="Cancelar" />
      <q-btn class="tw-w-1/4 tw-h-11 bg-primary text-white" @click="sendData"
        label="Actualizar" :loading="loadingSendEmail" />
    </div>
  </q-form>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { validationEmail, inputRequired, maxLengthInput } from "src/helpers/validations";
import { toast } from 'src/helpers/toast';
import { sgdeaAxios, intescoAxios } from 'src/services';
import { crearTrazabilidad } from 'src/helpers/trazabilidad';
import { useAuthStore } from "src/stores/auth.store";
const auth = useAuthStore();

const emit = defineEmits(['backView'])

const props = withDefaults(defineProps<{
  typeView: string,
  detalleRadicado: any
}>(), {
})

const router = useRouter();
const formulario = ref()
const opsEnvios = ref([])
const form = ref({
  correo: props.detalleRadicado?.remitente?.correo || '',
  formaEnvio: ''
})

const listDocs = ref([])
const loadingSendEmail = ref(false);

onMounted(async () => {
  const { data: envios } = await sgdeaAxios.get('/correspondencia/comunicacion/listadoFormaEnvio')
  opsEnvios.value = envios?.map((items) => ({
    label: items.nombre,
    value: items.id
  })).filter(({ label }) => label === 'Correo electrónico' || label === 'Correo electrónico certificado').sort((a, b) => a.label.localeCompare(b.label));
  getDocs()
})

const getDocs = async () => {
  if (props.typeView == 'Tutelas') {
    listDocs.value = []
    const { data } = await sgdeaAxios.get<any>(
      `/tutela/${props.detalleRadicado.idTutela}/archivos`
    );

    listDocs.value = data.map((it) => ({
      formato: /[^.]+$/.exec(it.nombre)[0],
      nombre: it.nombre,
      tipo: it.tipo,
      cargado_por: it.usuario,
      id: it.id,
      nodeId: it.nodeId,
      username: it.username,
      usuario: it.usuario,
      fechaCreacion: it.fechaCreacion,
      extension: it.extension,
      es_devolucion: it.es_devolucion
    }))

    listDocs.value = listDocs.value.filter((item) => item.es_devolucion)
  } else if (props.typeView == 'PQRD') {
    listDocs.value = []
    const { data } = await sgdeaAxios.get(`/radicados/obtenerHijosPorNodo/${props.detalleRadicado.nodeID}`);

    const { data: files }: { data: [] } = await sgdeaAxios.get(`/pqrd/obtenerDocs?idPqrd=${props.detalleRadicado.id}`)
    listDocs.value = data.list?.entries?.sort((a, b) => new Date(b.entry?.createdAt).getTime() - new Date(a.entry?.createdAt).getTime())
      .map((it) => {
        const foundFile = files.find((itFile) => itFile.nodeId === it.entry?.id);
        return {
          formato: it.entry?.content?.mimeType ?? 'No disponible',
          nombre: it.entry?.name,
          id: it.entry.id,
          nodeId: it.entry.id,
          es_devolucion: foundFile.es_devolucion
        };
      });

    listDocs.value = listDocs.value.filter((item) => item.es_devolucion)
  } else if (props.typeView == 'Correspondencia') {
    const { data } = await sgdeaAxios.get<any>(
      `/correspondencia/radicacion/documentos/SALIDA/${props.detalleRadicado.id}`
    );

    listDocs.value = data
      .map((it) => {
        return {
          formato: it.formato,
          nombre: it.nombre,
          id: it.id,
          nodeId: it.nodeId,
        };
      });
  } else if (props.typeView == 'Entes de Control') {
    const { data } = await sgdeaAxios.get<any>(
      `/api/entes/getDocumentosByEnteControlId/${props.detalleRadicado.id}`
    );
    listDocs.value = data
      .map((it) => {
        return {
          formato: it.formato,
          nombre: it.nombreArchivo,
          id: it.id,
          nodeId: it.nodeId,
        };
      });
  }
}

const sendData = async () => {
  if (!(await formulario.value.validate())) {
    toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos')
    return;
  }
  loadingSendEmail.value = true;
  if (props.typeView == 'Tutelas') {
    const sendEmail = await sgdeaAxios.post(`/tutela/${props.detalleRadicado.idTutela}/devolucion/actualizar/correo`, {
      correoElectronico: form.value.correo,
      metodoEnvioDevolucion: form.value.formaEnvio
    })
    if (sendEmail.data) {
      const formData = new FormData();
      if (listDocs.value.length > 0) {
        formData.append('archivos', null);
      }
      for (const item of listDocs.value) {
        const { data } = await sgdeaAxios.get(`/radicados/consultar_documento/${item.nodeId}`);
        if (data) {
          var nombreDocumento = data.name
          const byteCharacters = atob(data.base64x);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const file = new File([blob], nombreDocumento, { type: 'application/pdf' });
          formData.append('archivos', file);
        }
      }
      const sendNotify = await sgdeaAxios.post(`/tutela/${props.detalleRadicado.idTutela}/devolucion/envio_correo`, formData, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          accept: "*",
          "Content-Type": "multipart/form-data",
          "Content-Transfer-Encoding": "BINARY"
        }
      })
      if (sendNotify) {
        toast.success('Correo electrónico actualizado correctamente')
      }
    }
  } else if (props.typeView == 'PQRD') {
    const sendEmail = await sgdeaAxios.post(`/pqrd/${props.detalleRadicado.id}/actualizar/correo`, {
      correoElectronico: form.value.correo,
      metodoEnvioDevolucion: form.value.formaEnvio
    })
    if (sendEmail.data) {
      const formData = new FormData();
      if (listDocs.value.length > 0) {
        formData.append('archivos', null);
      }
      try {
        for (const item of listDocs.value) {
          const { data } = await sgdeaAxios.get(`/radicados/consultar_documento/${item.nodeId}`);
          if (data) {
            var nombreDocumento = data.name
            const byteCharacters = atob(data.base64x);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const file = new File([blob], nombreDocumento, { type: 'application/pdf' });
            formData.append('archivos', file);
          }
        }
        await handleSendEmailAndRedirect(
          props.typeView,
          props.detalleRadicado.id,
          form.value.formaEnvio,
          formData
        );

      } catch (error) {
        toast.error("Hubo un error al realizar el envío");
      } finally {
        loadingSendEmail.value = false;
      }
    }
  } else if (props.typeView == 'Correspondencia') {
    const email = `Correo anterior: ${props.detalleRadicado.datosSalida.correoDestinatario}` + `Correo nuevo:${form.value.correo}`
    const formaEnvio = `Forma envío: ${form.value.formaEnvio == 1 ? "Correo electrónico" : "Correo electrónico certificado"}`
    const sendEmail = await sgdeaAxios.post(`/correspondencia/${props.detalleRadicado.idRadicado}/devolucion/actualizar/correo`, {
      correoElectronico: form.value.correo,
    })
    if (sendEmail.data) {
      const formData = new FormData();
      if (listDocs.value.length > 0) {
        formData.append('archivos', null);
      }
      try {
        for (const item of listDocs.value) {
          const { data } = await sgdeaAxios.get(`/radicados/consultar_documento/${item.nodeId}`);
          if (data) {
            var nombreDocumento = data.name
            const byteCharacters = atob(data.base64x);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const file = new File([blob], nombreDocumento, { type: 'application/pdf' });
            formData.append('archivos', file);
          }
        }
        const tipoEnvio = form.value.formaEnvio === '2' ? '1' : '0'
        const { data: sendNotify } = await sgdeaAxios.post(`/correspondencia/${props.detalleRadicado.id}/devolucion/envio_correo?tipoEnvio=${tipoEnvio}`, formData, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            accept: "*",
            "Content-Type": "multipart/form-data",
            "Content-Transfer-Encoding": "BINARY"
          }
        })
        if (sendNotify) {
          toast.success('Correo electrónico actualizado correctamente')
          await router.push('/bandeja')
        }
        await crearTrazabilidad({
          proceso: `COR${props.detalleRadicado.id}`,
          secuencia: props.detalleRadicado.idRadicado,
          estado: props.detalleRadicado.estadoProceso.estado,
          descripcion: `Usuario:${auth.$state.userInfo.name} ${email} ${formaEnvio}`,
          comentario: "Se ha enviado por correo",
          nombre: auth.$state.userInfo.name,
          tramite: props.detalleRadicado.tipoTramite.nombre,
          accion: `${auth.$state.userInfo.name} ha enviado por correo el radicado ${props.detalleRadicado.idRadicado}`,
        });
      } catch (error) {
        toast.error("Hubo un error al realizar el envío");
      } finally {
        loadingSendEmail.value = false;
      }
    }
  } else if (props.typeView == 'Medicina Laboral') {
    // TODO: Falta el endpoint de actualización de email para este flujo - sendEmail
    // const sendEmail = await sgdeaAxios.post(`/correspondencia/${props.detalleRadicado.idRadicado}/devolucion/actualizar/correo`, {
    //   correoElectronico: form.value.correo,
    //})

    const formData = new FormData();
    if (listDocs.value.length > 0) {
      formData.append('archivos', null);
    } else {
      formData.append('archivos', new Blob(), 'empty.pdf');
    }

    for (const item of listDocs.value) {
      const { data } = await sgdeaAxios.get(`/radicados/consultar_documento/${item.nodeId}`);
      if (data) {
        const nombreDocumento = data.name
        const byteCharacters = atob(data.base64x);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const file = new File([blob], nombreDocumento, { type: 'application/pdf' });
        formData.append('archivos', file);
      }
    }
    await handleSendEmailAndRedirect(
      props.typeView,
      props.detalleRadicado.id,
      form.value.formaEnvio,
      formData
    );


  } else if (props.typeView == 'Entes de Control') {
    // TODO: No hay endpoint para actualizar correo electrónico en este flujo
    const formData = new FormData();
    if (listDocs.value.length > 0) {
      formData.append('archivos', null);
    }
    for (const item of listDocs.value) {
      const { data } = await sgdeaAxios.get(`/radicados/consultar_documento/${item.nodeId}`);
      if (data) {
        var nombreDocumento = data.name
        const byteCharacters = atob(data.base64x);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const file = new File([blob], nombreDocumento, { type: 'application/pdf' });
        formData.append('archivos', file);
      }
    }
    try {
      // Se le resta 1 para coincidir con la lógica del backend
      const sendNotify = await sgdeaAxios.post(
        `/api/entes/${props.detalleRadicado.id}/devolucion/envio_correo?tipoEnvio=${form.value.formaEnvio - 1}`,
        formData, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            accept: "*",
            "Content-Type": "multipart/form-data",
            "Content-Transfer-Encoding": "BINARY"
          }
        });
      if (sendNotify) {
        toast.success('Correo electrónico envíado correctamente');
      }
    } catch (error) {
      toast.error("Hubo un error al realizar el envío");
    } finally {
      loadingSendEmail.value = false;
    }
  }
}
// Configuration map by view type with base path and redirection route
const typeViewConfig: Record<string, { basePath: string; route: string }> = {
  'PQRD': {
    basePath: 'pqrd',
    route: '/bandeja',
  },
  'Medicina Laboral': {
    basePath: 'medicina',
    route: '/bandeja',
  },
};

// Function to get the configuration based on the view type
const getTypeViewConfig = (typeView: string): { basePath: string; route: string } | null => {
  const config = typeViewConfig[typeView];
  if (!config) {
    toast.error(`No se encontró configuración para la vista: ${typeView}`);
    return null;
  }
  return config;
};

// Sends an email with an attachment using a dynamic URL
const sendEmailWithAttachment = async (
  basePath: string,
  id: number | string,
  sendType: string,
  formData: FormData
): Promise<boolean> => {
  try {
    const url = `/${basePath}/${id}/devolucion/envio_correo?tipoEnvio=${sendType}`;

    await sgdeaAxios.post(url, formData, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        accept: "*",
        "Content-Type": "multipart/form-data",
        "Content-Transfer-Encoding": "BINARY"
      }
    });

    toast.success("Correo electrónico enviado correctamente");
    return true;
  } catch (error) {
    toast.error("Ocurrió un error al enviar el correo");
    return false;
  }
};

// Logs the traceability of the email sent
const logEmailTraceability = async () => {
  if (!props.detalleRadicado || !auth?.$state?.userInfo) {
    toast.error("No hay datos suficientes para registrar la trazabilidad.");
    return;
  }

  const correoAnterior = props.detalleRadicado.datosSalida?.correoDestinatario || 'N/A';
  const correoNuevo = form.value.correo || 'N/A';
  const textoFormaEnvio =
    form.value.formaEnvio == 1
      ? "Correo electrónico"
      : "Correo electrónico certificado";

  try {
    await crearTrazabilidad({
      proceso: `COR${props.detalleRadicado.id}`,
      secuencia: props.detalleRadicado.idRadicado,
      estado: props.detalleRadicado.estadoProceso?.estado || props.detalleRadicado.estado?.estado,
      descripcion: `Usuario:${auth.$state.userInfo.name} ${email} ${formaEnvio}`,
      comentario: "Se ha enviado por correo",
      nombre: auth.$state.userInfo.name,
      tramite: props.detalleRadicado.tipoTramite?.nombre || props.detalleRadicado.solicitud?.tipoTramite,
      accion: `${auth.$state.userInfo.name} ha enviado por correo el radicado ${props.detalleRadicado.idRadicado}`,
    });

    toast.success("Trazabilidad registrada correctamente");
  } catch (error) {
    toast.error("Ocurrió un error al registrar la trazabilidad");
  }
};

// Main function to send the email and redirect if it was successful
const handleSendEmailAndRedirect = async (
  typeView: string,
  id: number | string,
  sendType: string,
  formData: FormData
) => {
  const config = getTypeViewConfig(typeView);
  if (!config) return;

  const success = await sendEmailWithAttachment(
    config.basePath,
    id,
    sendType,
    formData
  );

  if (success) {
    await logEmailTraceability();
    await router.push(config.route);
  }
};


</script>
<style></style>
