<template>
  <div class="q-py-lg">
    <a
      @click.prevent="goBack"
      class="text-primary q-mb-md block cursor-pointer"
      style="text-decoration: none"
    >
      <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
      <b> Volver</b>
    </a>
    <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
      <q-expansion-item default-opened>
        <template v-slot:header>
          <div class="row justify-between tw-w-full">
            <b class="tw-text-lg">Información Básica Radicación</b>
          </div>
        </template>
        <div class="q-pb-lg q-px-md tw-flex tw-justify-between tw-gap-8">
          <div class="tw-flex tw-flex-col tw-leading-6 tw-w-1/2">
            <p class="titles">Dependencia</p>
            <p>{{ initialData.dependencia }}</p>
            <p class="titles">Tipo de trámite</p>
            <p>{{ initialData.tipoTramite }}</p>
            <p class="titles">Tipo de documento</p>
            <!-- <p>
                    {{
                      tipoDocumento.find(
                        (item) => item.value === initialData.tipoDocumento
                      )?.label
                    }}
                  </p> -->
            <p v-if="!isNit" class="titles">Primer apellido</p>
            <p v-if="!isNit">{{ initialData.primerApellido }}</p>
            <p v-if="!isNit" class="titles">Primer nombre</p>
            <p v-if="!isNit">{{ initialData.primerNombre }}</p>
            <p v-if="isNit" class="titles">Razón Social</p>
            <p v-if="isNit">{{ initialData.razonSocial }}</p>
          </div>

          <div class="tw-flex tw-flex-col tw-leading-6 tw-w-1/2">
            <p class="titles">Responsable del proceso</p>
            <p>{{ initialData.responsable }}</p>
            <p class="titles">Canal de recepción</p>
            <p>{{ initialData.canal }}</p>
            <p class="titles">Número de identificación</p>
            <p>{{ initialData.numeroDocumento }}</p>
            <p v-if="!isNit" class="titles">Segundo apellido</p>
            <p v-if="!isNit">{{ initialData.segundoApellido }}</p>
            <p v-if="!isNit" class="titles">Otros nombres</p>
            <p v-if="!isNit">{{ initialData.otrosNombres }}</p>
            <p v-if="isNit" class="titles">Nombre Comercial</p>
            <p v-if="isNit">{{ initialData.nombreComercial }}</p>
          </div>
          <div class="tw-flex tw-flex-col tw-leading-6 tw-w-1/2">
            <p class="titles">Dirección</p>
            <p>{{ initialData.direccion }}</p>
            <p class="titles">Teléfono</p>
            <p>{{ initialData.telefono }}</p>
            <p class="titles">Celular</p>
            <p>{{ initialData.celular }}</p>
            <p class="titles">País</p>
            <p>{{ initialData.pais }}</p>
            <p class="titles">Departamento</p>
            <p>{{ initialData.departamento }}</p>
          </div>
          <div class="tw-flex tw-flex-col tw-leading-6 tw-w-1/2">
            <p class="titles">Municipio</p>
            <p>{{ initialData.municipio }}</p>
            <p class="titles">Correo Electrónico</p>
            <p>{{ initialData.email }}</p>
            <p class="titles">Tipo de Remitente</p>
            <p>{{ initialData.tipoRemitente }}</p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
      <q-expansion-item default-opened>
        <template v-slot:header>
          <div class="col row">
            <b class="tw-text-lg">Información de Factura Administrativa</b>
          </div>
        </template>
        <div
          class="q-pb-lg q-px-md tw-flex tw-flex-wrap tw-justify-start tw-gap-x-8 tw-leading-6"
        >
          <div class="tw-flex tw-flex-col tw-w-full">
            <p class="titles">Número de Factura</p>
            <p>{{ initialData.numeroFactura }}</p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-full">
            <p class="titles">Fecha de Factura</p>
            <p>{{ initialData.fechaFac }}</p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-full">
            <p class="titles">Número de radicado de la entidad remitente</p>
            <p>{{ initialData.numeroRadicado }}</p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-full">
            <p class="titles">Medio que autoriza para envío de respuesta</p>
            <p>
              {{ initialData.medio === undefined ? initialData.medio : "" }}
            </p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-full">
            <p class="titles">Descripción (Detalle)</p>
            <p class="tw-overflow-hidden tw-w-[1000px] tw-break-words">
              {{ initialData.descripcion }}
            </p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-[48%]">
            <p class="titles">Valor</p>
            <p>$ {{ initialData.valor?.toLocaleString("es-ES") }}</p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-[48%]">
            <p class="titles">Valor en letras</p>
            <p>{{ initialData.valorLetra }}</p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
      <q-expansion-item default-opened>
        <template v-slot:header>
          <div class="col row">
            <b class="tw-text-lg">Campos Automáticos al Radicar</b>
          </div>
        </template>
        <div
          class="q-pb-lg q-px-md tw-flex tw-flex-wrap tw-justify-start tw-gap-x-8 tw-leading-6"
        >
          <div class="tw-flex tw-flex-col tw-w-[48%]">
            <p class="titles">FECHA / sistema a radicar</p>
            <p>
              {{
                moment(
                  formInfo.fechaFormateada,
                  "DD/MM/YYYY hh:mm:ss a"
                ).format("DD/MM/YYYY")
              }}
            </p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-[48%]">
            <p class="titles">HORA / sistema al radicar</p>
            <p>
              {{
                moment(
                  formInfo.fechaFormateada,
                  "DD/MM/YYYY hh:mm:ss a"
                ).format("HH:mm")
              }}
            </p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-[48%]">
            <p class="titles">Estado de trámite</p>
            <p>{{ checkStatus(initialData.estado) }}</p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-rounded-xl tw-mt-4" flat bordered v-if="dataNDNC">
      <q-expansion-item default-opened>
        <template v-slot:header>
          <div class="col row">
            <b class="tw-text-lg">Información ND/NC</b>
          </div>
        </template>
        <div
          class="q-pb-lg q-px-md tw-flex tw-flex-wrap tw-justify-start tw-gap-x-8 tw-leading-6"
        >
          <div class="tw-flex tw-flex-col tw-w-[48%]">
            <p class="titles">Número de radicado anterior</p>
            <p>{{ dataNDNC.numeroRadicadoAnterior }}</p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-[48%]">
            <p class="titles">Número de Factura</p>
            <p>{{ dataNDNC.numeroFactura }}</p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-[48%]">
            <p class="titles">Tipificacion</p>
            <p>{{ dataNDNC.tipificacion }}</p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-[48%]">
            <p class="titles">Número de la Nota</p>
            <p>{{ dataNDNC.numeroNota }}</p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-[48%]">
            <p class="titles">Valor del Ajuste</p>
            <p>{{ dataNDNC.valorAjuste }}</p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-[48%]">
            <p class="titles">Dependecia</p>
            <p>{{ dataNDNC.dependecia }}</p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-[48%]">
            <p class="titles">Proveedor</p>
            <p>{{ dataNDNC.proveedor }}</p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-[48%]">
            <p class="titles">Descripción</p>
            <p>{{ dataNDNC.descripcion }}</p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
      <q-expansion-item default-opened>
        <template v-slot:header>
          <div class="col row">
            <b class="tw-text-lg">Documentos Cargados</b>
          </div>
        </template>

        <p class="titles q-px-md q-mb-md q-mt-lg">Documento de soporte</p>

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
              v-if="doc.formato.includes('pdf')"
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
    <div v-if="visualizadorPDF" class="tw-h-full tw-w-full">
          <q-dialog v-model="visualizadorPDF" seamless position="right" class="">
            <q-card class="tw-h-full tw-w-[2000px] tw-z-[1000] tw-overflow-hidden">
              <q-btn @click="visualizadorPDF = false"
                class="tw-absolute tw-ml-12 tw-mt-3 tw-z-[2000] tw-text-white tw-bg-red-500">Cerrar</q-btn>
              <iframe class="tw-h-full tw-w-full" :src="iframePdfUrl" frameborder="0"></iframe>
            </q-card>
          </q-dialog>
        </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, onBeforeMount, ref, watch } from "vue";
// @ts-ignore
import { currentHour, secondFormatDate } from "src/helpers/formtDate";
import { numberToHumanText } from "src/helpers/number";
import { BonitaAPI, SelectInput } from "src/interfaces";
import { adminAxios, sgdeaAxios } from "src/services";
// @ts-ignore
import PDFIcon from "src/assets/pdf.svg";
// @ts-ignore
import excelIcon from "src/assets/excel.svg";
// @ts-ignore
import unknown from "src/assets/unknown_document.svg";
// @ts-ignore
import docxIcon from "src/assets/word.svg";
import moment from "moment";
import { checkStatus } from "src/helpers/checkStatus";
import { useRouter } from "vue-router";

const initialData: Ref<any> = ref({});
const router = useRouter();
const dataNDNC = ref({
  idFactura: "",
  numeroRadicadoAnterior: "",
  numeroFactura: "",
  tipificacion: "",
  numeroNota: "",
  valorAjuste: "",
  dependecia: "",
  proveedor: "",
  descripcion: "",
});
const isNit = ref(false);

function goBack() {
  router.go(-1);
}

const reloadData = async () => {
  const idParams = router.currentRoute.value.params?.id as string;
  try {
    const id = parseInt(idParams);
    const response = await sgdeaAxios.get("/facturacion/getFac/" + id);

    const responseND_NC = await sgdeaAxios.get(
      `/facturacion/obtenerNotaDebitoCredito?id=${id}`
    );

    if (responseND_NC.status == 200 || responseND_NC.status == 201) {
      dataNDNC.value = responseND_NC.data[0];
    }

    initialData.value = {
      ...response.data.facAdmin,
      fechaFac: moment(response.data.facAdmin.fechaFac).format("DD/MM/YYYY"),
    };
    formInfo.value = {
      ...response.data.facAdmin,
      fechaFac: moment(response.data.facAdmin.fechaFac).format("DD/MM/YYYY"),
    };

    responsableOptions.value = [
      {
        label: response.data.facAdmin.responsable,
        value: response.data.facAdmin.responsable,
      },
    ];

    responsable.value = {
      label: response.data.facAdmin.responsable,
      value: response.data.facAdmin.responsable,
    };
  } catch (error) {
    // facAdminNotFound(idParams)
    console.error(error);
  }
};

const tipoIcon = (tipo) => {
  if (tipo === "application/pdf") return PDFIcon;
  if (
    tipo === "application/vnd.ms-excel" ||
    tipo === "text/xml" ||
    tipo ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    tipo.includes("xls")
  )
    return excelIcon;
  if (
    tipo ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    tipo === "application/msword" ||
    tipo.includes("docx")
  )
    return docxIcon;
  return unknown;
};

const optionsDepartamentos: Ref<SelectInput[]> = ref([]);
const optionsPaises = ref<SelectInput[]>([]);
const optionsMunicipios: Ref<SelectInput[]> = ref([]);
const municipios: Ref<SelectInput[]> = ref([]);
const formInfo: Ref<any> = ref({
  dependencia: "",
  responsable: "",
  tipoTramite: {
    label: "Facturas Administrativas",
    value: "Facturas Administrativas",
  },
  canal: "CRM",
  tipoDocumento: "",
  primerApellido: "",
  segundoApellido: "",
  primerNombre: "",
  segundoNombre: "",
  otrosNombres: "",
  direccion: "",

  valor: 0,
  valorLetra: "",

  fechaRadicar: secondFormatDate(new Date()),
  fechaFormateada: "",
  horaInicio: currentHour(new Date()),
  estado: "radicado",

  cuentaCobro: null as any,
  pagoSeguridadSocial: null as any,
  entregaSoportes: null as any,
  numeroDocumento: "",

  otrosTiposDocumentales: null as any,
  celular: "",
  email: "",
  departamento: null,
  descripcion: "",
  medio: "",
  municipio: null,
  numeroFactura: "",
  numeroRadicado: "",
  pais: {
    label: "Colombia",
    value: "Colombia",
  },
  telefono: "",
  tipoRemitente: "",
  sec: "FACA",
  fechafac: "",
  razonSocial: "",
  nombreComercial: "",
});

const nameDocument = ref("");
const iframePdfUrl = ref("");
const visualizadorPDF = ref(false);

const getBlobToIframe = async (id: string) => {
  const { data } = await sgdeaAxios.get(`/radicados/consultar_documento/${id}`);

  if (id) {
    nameDocument.value = loadedDocs.value.find((it) => it.id === id)?.nombre;
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
};

const loadedDocs = ref<any[]>([]);
const responsable = ref();
const responsableOptions = ref([]);

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

const getData = async () => {
  try {
    const response = await sgdeaAxios.get(
      "/radicados/obtenerHijosPorNodo/" + initialData.value.nodeId
    );
    if (response.status !== 200 && response.status !== 201) {

      return;
    }

    const docs = response.data.list.entries.map((doc) => {
      return {
        nodeId: doc.entry.id,
        nombreDocumento: doc.entry.name,
        tipoDocumento: doc.entry.name.startsWith("ENT")
          ? "De salida"
          : "De entrada",
        fechaCargue: moment(
          doc.entry.createdAt,
          "YYYY-MM-DDTHH:mm:ss.SSSZ"
        ).format("DD/MM/YYYY"),
        cargadoPor: doc.entry.createdByUser.displayName,
        formato: doc.entry.content?.mimeType,
      };
    });

    loadedDocs.value = docs;
  } catch (error) {
    console.error(error);
  }

  const {
    data: dptos,
  }: {
    data: BonitaAPI[];
  } = await adminAxios.get("/departamentos/list");

  const {
    data: mnpios,
  }: {
    data: BonitaAPI[];
  } = await adminAxios.get("/municipios/list");

  const { data: formData } = await adminAxios.get<
    {
      idMunicipio: number;
      nombre: string;
      codigoDivipola: string;
    }[]
  >("/municipios/list");

  const { data: paisesData } = await adminAxios.get<
    { idPais: number; nombre: string }[]
  >("/paises/list");

  optionsDepartamentos.value = sortOptions(
    dptos.map((item) => ({
      label: item.nombre,
      value: item.idDepartamento,
    }))
  );

  municipios.value = mnpios.map((item) => ({
    label: item.nombre,
    value: item.idDepartamento,
  }));

  const sortedMunicipios = formData.sort((leftMunicipio, rightMunicipio) => {
    const nombreA = leftMunicipio.nombre.toLowerCase().trim();
    const nombreB = rightMunicipio.nombre.toLowerCase().trim();

    if (nombreA < nombreB) {
      return -1;
    }

    if (nombreA > nombreB) {
      return 1;
    }

    return 0;
  });

  optionsMunicipios.value = sortedMunicipios.map(({ nombre }) => {
    return {
      label: nombre,
      value: nombre,
    };
  });

  const sortedPaises = paisesData.sort((leftMunicipio, rightMunicipio) => {
    const nombreA = leftMunicipio.nombre.toLowerCase().trim();
    const nombreB = rightMunicipio.nombre.toLowerCase().trim();

    if (nombreA < nombreB) {
      return -1;
    }

    if (nombreA > nombreB) {
      return 1;
    }

    return 0;
  });

  optionsPaises.value = sortedPaises.map(({ nombre }) => {
    return {
      label: nombre,
      value: nombre,
    };
  });

  isNit.value =
    initialData.value.tipoDocumento ===
    "Número de Identificación Tributaria NIT";
};

watch(
  () => formInfo.value.valor,
  (newNumber) => {
    if (String(newNumber).startsWith("0") && String(newNumber) !== "0") {
      let format = parseFloat(String(newNumber).substring(1));

      if (isNaN(format)) {
        format = 0;
      }

      formInfo.value.valor = format;
    }

    formInfo.value.valorLetra = numberToHumanText(newNumber);
  }
);

onBeforeMount(async () => {
  await reloadData();
  await getData();
});

const sortOptions = (vals) => {
  return vals.sort((leftItem, rightItem) => {
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
};

const radicadoDoc = computed(() => {
  return loadedDocs.value.filter(
    (it) => it.name === `${initialData.value.sec}.pdf`
  );
});
const filteredDocs = computed(() => {
  return loadedDocs.value.filter(
    (it) => it.name !== `${initialData.value.sec}.pdf`
  );
});
</script>

<style>
.titles {
  color: #6b737c;
  font-weight: bold;
  margin-top: 10px;
}
</style>
