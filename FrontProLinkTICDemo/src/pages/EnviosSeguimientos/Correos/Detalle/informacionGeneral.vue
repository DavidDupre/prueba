<template>
  <div class="[&>*]:tw-mb-4">
    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl tw-w-full" flat>
      <q-expansion-item label="Información General del caso" header-class="tw-text-lg tw-font-bold  tw-pl-0"
        default-opened class="tw-bg-white tw-px-4 tw-py-5">
        <template v-slot:header>
          <div class="row justify-between tw-w-full">
            <b class="tw-text-lg">Información General del Caso</b>
          </div>
        </template>
        <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Número de radicado
            </p>
            <p>{{ $props.data?.idRadicado }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Canal de radicación
            </p>
            <p>{{ $props.data?.remitente.canalRadicacion.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Tipo de solicitud</p>
            <p>{{ $props.data?.solicitud?.tipoSolicitud?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Fecha de vencimiento</p>
            <p>{{ props.data?.asignacion?.fechaVencimiento ? moment(props.data?.asignacion?.fechaVencimiento).format("DD-MM-YYYY HH:MM") : '' }}</p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl tw-w-full" flat v-if="auth.userInfo.role !== 'Asignador Responsable'">
      <q-expansion-item label="Metadatos de la asignación" header-class="tw-text-lg tw-font-bold  tw-pl-0"
        default-opened class="tw-bg-white tw-px-4 tw-py-5">
        <div class="tw-grid tw-grid-cols-6 tw-gap-4 tw-pl-3">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Proceso</p>
            <p>{{ $props.metadatosInfo?.process.proceso }}</p>
          </div>
          <div class="tw-col-span-2 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Subproceso</p>
            <p>{{ $props.metadatosInfo?.subProceso.subProceso }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Formato de tiempo</p>
            <p>{{ $props.metadatosInfo?.formatoFecha }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Tiempo</p>
            <p>{{ $props.metadatosInfo?.tiempo }}</p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
      <q-expansion-item label="Remitente" header-class="tw-text-lg tw-font-bold tw-text-red tw-pl-0" default-opened
        class="tw-bg-white tw-px-4 tw-py-5">
        <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de remitente
            </p>
            <p>{{ $props.data?.remitente?.tipoRemitente?.nombre ?? 'N/A' }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de documento del remitente
            </p>
            <p>
              {{ $props.data?.remitente?.tipoDocumento?.nombre }}
            </p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Número de documento del remitente
            </p>
            <p>
              {{ $props.data?.remitente?.numeroDocumento ?? 'N/A' }}
            </p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Nombre del remitente
            </p>
            <p>{{ $props.data?.remitente?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              País del remitente
            </p>
            <p>{{ $props.data?.remitente?.pais?.nombre ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Departamento del remitente
            </p>
            <p>{{ $props.data?.remitente?.departamento?.nombre ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Municipio del remitente
            </p>
            <p>{{ $props.data?.remitente?.municipio?.nombre ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Dirección del remitente
            </p>
            <p>{{ $props.data?.remitente?.direccion ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Teléfono del remitente
            </p>
            <p>{{ $props.data?.remitente?.telefono ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Correo electrónico del remitente
            </p>
            <p>{{ $props.data?.remitente?.email ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Medio que autoriza para envío de respuesta
            </p>
            <p>
              {{ $props.data?.remitente?.medioRespuesta.nombre }}
            </p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat v-if="auth.$state.userInfo.role === 'Gestionador'">
      <q-expansion-item label="Afectado" header-class="tw-text-lg tw-font-bold tw-text-red tw-pl-0" default-opened
        class="tw-bg-white tw-px-4 tw-py-5">
        <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de documento del afectado
            </p>
            <p>{{ $props.data?.afectado?.tipoDocumento?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Número de documento del afectado
            </p>
            <p>
              {{ $props.data?.afectado?.numeroDocumento ?? 'N/A' }}
            </p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Nombre del Afectado
            </p>
            <p>{{ $props.data?.afectado?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Correo del afectado
            </p>
            <p>
              {{ $props.data?.afectado.correoElectronico }}
            </p>
          </div>

          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              País del afectado
            </p>
            <p>{{ $props.data?.afectado?.pais?.nombre ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Departamento del afectado
            </p>
            <p>{{ $props.data?.afectado?.departamento?.nombre ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Municipio del afectado
            </p>
            <p>{{ $props.data?.afectado?.municipio?.nombre ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Dirección del afectado
            </p>
            <p>{{ $props.data?.afectado?.direccion ?? "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Teléfono del afectado
            </p>
            <p>{{ $props.data?.afectado?.telefono ?? "N/A" }}</p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
      <q-expansion-item label="Solicitud" header-class="tw-text-lg tw-font-bold tw-text-red tw-pl-0" default-opened
        class="tw-bg-white tw-px-4 tw-py-5">
        <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Número de radicado relacionado
            </p>
            <p>{{ $props.data?.solicitud?.radicadoRelacionado ?? " " }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de trámite
            </p>
            <p>{{ $props.data?.solicitud?.tipoTramite }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de evento
            </p>
            <p>{{ $props.data?.solicitud?.tipoEvento?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Número de Siniestro
            </p>
            <p>{{ $props.data?.solicitud?.siniestro.siniestro }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Tipo de solicitud
            </p>
            <p>{{ $props.data?.solicitud?.tipoSolicitud?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Constancia de ejecutoriedad
            </p>
            <p>{{ $props.data?.solicitud?.constancia ? "Sí" : "No" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Fecha de dictamen de la Junta Regional de Calificación</p>
            <p>{{ $props.data?.solicitud?.constancia ? $props.data?.solicitud?.fechaDictamen : "N/A" }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Oficina
            </p>
            <p>
              {{ $props.data?.solicitud?.oficina?.nombre }}
            </p>
          </div>
          <div class="tw-col-span-3">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Descripción
            </p>
            <p>{{ $props.data?.solicitud?.descripcion }}</p>
          </div>
          <div class="tw-col-span-5 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-2">
              Documentos de soporte
            </p>
            <div class="flex row wrap tw-gap-3 q-pb-md">
              <q-card class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-sm" flat bordered :key="doc.id"
                v-for="doc in props?.docs?.soporte">
                <img style="width: 26px" v-lazy :data-url="tipoIcon(doc.formato)" @click="props.visualize" />
                <p class="tw-text-sm tw-font-semibold">{{ doc.nombre }}</p>
                <button @click="visualize(doc.id)">
                  <q-icon size="20px" class="tw-text-[#6B737C]" name="error_outline" />
                </button>
                <button @click="() => handleOpenDocFile(doc.id, doc.nombre)">
                  <q-icon size="20px" class="tw-text-[#6B737C]" name="file_download" />
                </button>
              </q-card>
            </div>
          </div>
          <div class="tw-col-span-5 tw-flex tw-flex-col tw-justify-between" v-if="props?.docs?.adjunto?.length">
            <p class="tw-text-label tw-font-semibold tw-pb-2">
              Documentos adjuntos
            </p>
            <div class="flex row wrap tw-gap-3 q-pb-md">
              <q-card class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-sm" flat bordered :key="doc.id"
                v-for="doc in props?.docs?.adjunto">
                <img style="width: 26px" v-lazy :data-url="tipoIcon(doc.formato)" @click="props.visualize" />
                <p class="tw-text-sm tw-font-semibold">{{ doc.nombre }}</p>
                <button @click="visualize(doc.id)">
                  <q-icon size="20px" class="tw-text-[#6B737C]" name="error_outline" />
                </button>
                <button @click="() => handleOpenDocFile(doc.id, doc.nombre)">
                  <q-icon size="20px" class="tw-text-[#6B737C]" name="file_download" />
                </button>
              </q-card>
            </div>
          </div>
        </div>
      </q-expansion-item>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import moment from "moment";
// @ts-ignore
import PDFIcon from "src/assets/pdf.svg";
// @ts-ignore
import excelIcon from "src/assets/excel.svg";
// @ts-ignore
import docxIcon from "src/assets/word.svg";
import { Medicina, Metadatos } from "src/interfaces";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";

interface InfoGeneralProps {
  data: Medicina;
  docs: any;
  metadatosInfo: Metadatos
  visualize?: () => {}
}

const props = defineProps<InfoGeneralProps>();
const auth = useAuthStore()

const tipoIcon = (tipo) => {
  if (tipo === 'application/pdf') return PDFIcon
  if (tipo === 'application/vnd.ms-excel' || tipo === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return excelIcon
  if (tipo === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || tipo === 'application/msword') return docxIcon
}

const handleOpenDocFile = async (id: string, name: string) => {
  try {
    const response = await sgdeaAxios.get('/radicados/consultar_documento/' + id);

    const byteCharacters = atob(response.data.base64x);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });

    const enlaceDescarga = document.createElement('a');
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
