<template>
  <main class="tw-px-5 q-py-md">
    <div class="tw-pt-4">
      <router-link
        class="text-primary q-mb-md block"
        to="/bandeja"
      >
        <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
        <b> Volver </b>
      </router-link>
    </div>
    <!-- <BreadCrumbs :crumbs="routes"></BreadCrumbs> -->

    <div class="tw-flex tw-justify-between tw-pt-4">
      <h1 class="tw-text-3xl tw-font-bold">
        Cuenta de cobro # {{ initialData.sec }}
      </h1>
    </div>

    <q-chip
      square
      :ripple="false"
      class="tw-border-[0.5px] tw-border-solid tw-border-[#0049ff] tw-bg-[#e5edff] tw-text-[#2c3948] tw-rounded-lg tw-mr-auto"
    >
      {{ initialData.estado }}
    </q-chip>
    <q-tabs
      inline-label
      no-caps
      outside-arrows
      align="left"
      class="tw-rounded-lg tw-my-4 tw-bg-white custom-tabs tw-flex rowsTab-alingCenter"
      indicator-color="transparent"
      active-color="primary"
      v-model="tab"
    >
      <q-tab
        @click="openVista('vistaInformacionGeneral')"
        class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]"
        name="vistaInformacionGeneral"
        label="Información
          General"
        icon="info"
      ></q-tab>
      <q-tab
        @click="openVista('vistaDocs')"
        class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]"
        name="documentosRelacionados"
        label="Documentos
          Relacionados"
        icon="folder"
      >
      </q-tab>
      <q-tab
        @click="openVista('vistaAsignar')"
        no-caps
        class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]"
        name="asignar"
        label="Asignar"
        icon="assignment_ind"
      >
      </q-tab>
      <q-tab
        v-if="isMetadatos"
        @click="openVista('metadatosDinamic')"
        class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]"
        name="metadatos"
        label="Metadatos"
        icon="older_open"
      >
      </q-tab>
    </q-tabs>
    <template v-if="vistaActual === 'vistaInformacionGeneral'">
      <InfoGeneral
        @update:data="handleUpdate"
        v-model:data="initialData"
        v-if="
          initialData &&
          Object.keys(initialData) &&
          Object.keys(initialData).length
        "
      />
    </template>
    <template v-if="vistaActual === 'vistaDocs'">
      <q-card class="tw-flex tw-p-2 tw-gap-10">
        <q-btn
          :color="typeDoc === 'De Entrada' ? 'primary' : 'grey-7'"
          outline
          icon="info"
          label="De entrada"
          @click="changeDocs('De Entrada')"
        />
        <q-btn
          :color="typeDoc === 'De Salida' ? 'primary' : 'grey-7'"
          outline
          icon="info"
          label="De salida"
          @click="changeDocs('De Salida')"
        />
      </q-card>

      <q-card class="tw-rounded-xl tw-mt-4 q-pa-md tw-max-w-full" flat bordered>
        <div class="col">
          <div class="tw-flex tw-justify-between">
            <p class="tw-text-lg text-weight-bold q-mx-lg">
              Listado de documentos cargados
            </p>
            <q-btn
              label="Subir un documento"
              color="primary"
              icon="add"
              @click="modalDocuments = true"
            />
          </div>

          <div
            class="tw-flex tw-justify-end tw-items-center w-full tw-gap-x-2 tw-py-3"
            v-if="selectedDocs.length !== 0"
          >
            <p class="tw-text-sm tw-font-semilight q-mx-lg">
              Cantidad seleccionada: {{ selectedDocs.length }}
            </p>
            <q-btn
              label="Eliminar"
              color="negative"
              icon="delete"
              @click="deleteDocs"
            />
          </div>

          <div
            class="flex row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md tw-max-w-full"
          >
            <TableDocs
              :DOCUMENTOS_BODY="filteredDocs"
              class="tw-w-full"
              v-model:selected-items="selectedDocs"
              :visualize="getBlobToIframe"
            />
          </div>
        </div>
      </q-card>
    </template>

    <q-form ref="asignarRef">
      <section v-if="vistaActual === 'vistaAsignar'">
        <q-card
          class="row full-width wrap q-px-md tw-justify-start justify-around q-mb-md"
        >
          <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Área Encargada</h3>

          <div class="row full-width">
            <div class="col-6">
              <label class="q-px-md tw-text-label"
                >Dependencia del proceso
              </label>
              <p class="q-px-md">{{ dep.value }}</p>
            </div>

            <div class="col-6 q-pb-lg">
              <label class="q-px-md tw-text-label"
                >Responsable del proceso *
              </label>
              <p class="q-px-md">{{ responsable.label }}</p>
            </div>

            <div class="q-mb-md q-mx-sm tw-flex tw-flex-col col-6">
              <label class="q-px-md tw-text-label"
                >¿Desea asignar al responsable?
                <div class="flex items-center tw-gap-16 q-mt-xs">
                  <label id="asignar1" class="flex items-center tw-gap-x-2">
                    <q-radio
                      v-model="asignaResponsable"
                      checked
                      name="responsable"
                      val="si"
                      label="Sí"
                      class="tw-w-5 tw-h-5"
                    />
                  </label>

                  <label id="asignar2" class="flex items-center tw-gap-x-2">
                    <q-radio
                      v-model="asignaResponsable"
                      name="responsable"
                      val="no"
                      label="No"
                      class="tw-w-5 tw-h-5"
                    />
                  </label>
                </div>
              </label>
            </div>
          </div>
        </q-card>

        <q-expansion-item
          v-if="asignaResponsable == 'no'"
          dense
          expand-separator
          class="tw-bg-white q-mt-lg"
          style="border-radius: 5px"
          v-model="isAsignacion"
        >
          <template v-slot:header>
            <h3 class="text-bold tw-text-xl q-py-md tw-flex-1">Asignación</h3>
          </template>
          <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3">
            <div
              class="width-container tw-w-1/2 q-px-sm tw-rounded-xl"
              style="border: 1px solid #e3e4e5"
            >
              <TableAsignar
                type-selection="single"
                :is-selection="false"
                :TABLE_BODY="listUsers"
                row-key="colaborador"
                :TABLE_HEADER="columnsAsignar"
                @update:item-selected="handleAssign"
                text="radicado"
              />
            </div>
            <div
              class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl"
              style="border: 1px solid #e3e4e5"
            >
              <span
                class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold"
              >
                Estos son los usuarios que ha seleccionado
              </span>
              <div class="flex wrap tw-gap-3 q-pt-sm">
                <div v-for="(asign, index) in cardsAsignar" :key="index">
                  <div
                    v-if="asign.visible"
                    class="q-px-sm tw-text-base q-py-sm tw-gap-2 flex justify-between tw-text-[#2C3948] tw-rounded-3xl"
                    style="border: 1px solid #e3e4e5"
                  >
                    <q-icon size="24px" name="person_outline" />
                    {{ asign.name }}
                    <q-icon
                      class="tw-cursor-pointer"
                      size="24px"
                      name="close"
                      @click="removeCardAsignar(index)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-expansion-item>

        <q-expansion-item
          dense
          expand-separator
          class="tw-bg-white q-mt-lg"
          style="border-radius: 5px"
          v-model="isMotivoAsignacion"
        >
          <template v-slot:header>
            <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
              Motivo de Asignación
            </h3>
          </template>
          <q-card class="row full-width wrap tw-justify-start justify-around">
            <div class="row full-width">
              <div class="col-12 q-px-md tw-mb-2">
                <CommentTextArea
                  v-model="asignarCuentaUsuarioBody.motivoAsignacion"
                  :is-required="true"
                  :max-length="1000"
                  :min-length="10"
                  label="Observaciones"
                />
              </div>
            </div>
          </q-card>
        </q-expansion-item>

        <div class="tw-flex tw-justify-center tw-p-10 tw-w-full tw-gap-5">
          <q-btn
            label="Cancelar"
            type="reset"
            style="width: 240px; height: 40px"
            text-color="black"
            color="accent"
            class="tw-rounded-xl"
            @click="() => (showModal = true)"
          />
          <q-btn
            label="Asignar"
            text-color="white"
            @click="showModalAsigna"
            style="width: 240px; height: 40px"
            color="primary"
            class="tw-rounded-xl tw-btn tw-p-2"
          />
        </div>

        <!--triggers para manejar exito y error-->

        <!-- <alertSucess text="" /> -->
        <!-- <alertError text="" /> -->
      </section>
    </q-form>

    <template v-if="vistaActual === 'metadatosDinamic'">
      <q-card class="full-width tw-mt-5">
        <Metadatos :metadatos="metadatos" />
      </q-card>
    </template>
  </main>
  <q-dialog v-model="modalDocuments" persistent>
    <q-card class="tw-p-5">
      <q-card-section class="row tw-p-4">
        <span class="tw-text-slate-500 text-center tw-text-2xl">
          Cargue un nuevo documento para la cuenta de cobro
        </span>
      </q-card-section>
      <q-card-section class="row tw-p-4">
        <FileLoader
          class="tw-w-full"
          v-model="newFileInput"
          multiple
          accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
          max-file-size-label="20"
          :maxFileSize="50000000"
          :maxFiles="20"
          @rejected="rejected"
        />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          label="Cancelar"
          color="secondary"
          @click="modalDocuments = false"
        />
        <q-btn label="Subir" color="primary" @click="handleUploadFile" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <Modal
    v-model:model-value="showModal"
    title="¡Espera un momento!"
    text="¿Estás seguro de cancelar la asignación de la cuenta de cobro?"
    :is-success="false"
    textButtonCancel="No"
    cancel-button
    @handleAccept="
      handleLiberar();
      vistaActual = 'vistaInformacionGeneral';
    "
    text-button="Si"
    @close-modal="() => (showModal = false)"
  />

  <Modal
    v-model:model-value="showConfirmationModal"
    title="Confirmación"
    :text="`¿Está seguro de asignar el radicado ${initialData.sec} al gestionador ${asignarCuentaUsuarioBody.usuarioAsignado}?`"
    :is-success="false"
    textButtonCancel="No"
    cancel-button
    @handleAccept="handleAcceptModal"
    text-button="Si"
    @close-modal="() => (showConfirmationModal = false)"
  />
  <div v-if="visualizadorPDF" class="tw-h-full tw-w-full">
    <q-dialog v-model="visualizadorPDF" seamless position="right" class="">
      <q-card class="tw-h-full tw-w-[2000px] tw-z-[1000] tw-overflow-hidden">
        <q-btn
          @click="visualizadorPDF = false"
          class="tw-absolute tw-ml-12 tw-mt-3 tw-z-[2000] tw-text-white tw-bg-red-500"
          >Cerrar</q-btn
        >
        <iframe
          class="tw-h-full tw-w-full"
          :src="iframePdfUrl"
          frameborder="0"
        ></iframe>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
import BreadCrumbs from "src/components/BreadCrumbs/BreadCrumbs.vue";
import FileLoader from "src/components/FormFields/FileLoader.vue";
import { computed, onMounted, Ref, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import TableAsignar from "components/Tables/TableAsignar.vue";
import Modal from "src/components/Modal/Modal.vue";
import InfoGeneral from "./components/InfoGeneral.vue";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import {
  asignarUsuario,
  IAsignarFacturaUsuario,
} from "../administrativa/aprobacion/Asignar/asignar";
import { DocumentoRadicado } from "src/interfaces";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { useAuthStore } from "src/stores/auth.store";
import TableDocs from "pages/Facturacion/cobro/components/TableDocs.vue";
import moment from "moment";
import Metadatos from "src/components/metadtos/DynamicFields/Metadatos.vue";
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";

const route = useRoute();
const auth = useAuthStore();

const handleUpdate = async (props: any) => {
  const response = await sgdeaAxios.put("/facturacion/actualizarCto", props);
  if (response.data.mensaje) {
    initialData.value = response.data.cto;
    await crearTrazabilidad({
      proceso: "CTO" + initialData.value.idCto,
      secuencia: initialData.value.sec,
      estado: initialData.value.estado,
      descripcion: "Se ha editado la información de la cuenta de cobro",
      comentario: "Adjunto",
      nombre: auth.$state.userInfo.name,
    });
  } else {
    toast.error("Error al editar el radicado");
  }
};

const asignarCuentaUsuarioBody: Ref<IAsignarFacturaUsuario> = ref({
  type: "CUENTA",
  short_type: "CTO",
  id: 0,
  usuarioAsignado: 0,
  motivoAsignacion: "",
  oficinaAsignada: 0,
});

const router = useRouter();
const showRoute = ref(route.params.id);

const responsableOptions = ref([
  {
    value: "Ruben Morales",
    label: "Ruben Morales",
  },
]);
const loadedDocs = ref<any[]>([]);
const selectedDocs = ref<any[]>([]);
const modalDocuments = ref(false);
const newFileInput = ref<any>([]);
const asignarRef = ref();
const isAsignacion = ref(true);
const isMotivoAsignacion = ref(true);
const vistaActual = ref("vistaInformacionGeneral");
const showModal = ref<boolean>(false);
const showConfirmationModal = ref<boolean>(false);
const dep = ref({
  label: "",
  value: "",
});
const responsable = ref({
  label: "",
  value: "",
});
const asignaResponsable = ref("si");
const metadatos = ref([]);
const isMetadatos = ref(false);
const copyListDcos = ref([]);
const initialData: Ref<any> = ref({});
const typeDoc= ref('De Entrada')

const cuentaCobroNotFound = (id?: number | string) => {
  let message = "Cuenta de cobro no existe";

  if (Boolean(id)) {
    message = "Cuenta de cobro con id " + id + " no existe.";
  }

  router.replace("/facturacion/cuentas-cobro/");
};

const getData = async () => {
  const { data }: { data: any } = await sgdeaAxios.get(
    "/facturacion/geCto/" + route.params.id
  );

  if (data.mensaje) {
    initialData.value = data.cto;
    dep.value = {
      label: data.cto?.dependencia,
      value: data.cto?.dependencia,
    };

    responsableOptions.value = [
      {
        value: data.cto?.responsable,
        label: data.cto?.responsableId,
      },
    ];

    responsable.value = {
      label: data.cto?.responsable,
      value: data.cto?.responsableId,
    };

    asignarCuentaUsuarioBody.value.usuarioAsignado = data.cto?.responsableId;

    asignarCuentaUsuarioBody.value.id = data.cto?.idCto;

    await getDimanicDatos();
  } else {
    toast.error("Error al consultar la cuenta de cobro");
    cuentaCobroNotFound();
  }

  try {
    const response = await sgdeaAxios.get(
      "/radicados/obtenerHijosPorNodo/" + initialData.value.nodeId
    );
    if (response.status !== 200 && response.status !== 201) {
      return;
    }

    const docs = response.data.list.entries.map((doc) => {
      return {
        nombreDocumento: doc?.entry.name,
        tipoDocumento: doc?.entry.name.startsWith("ENT")
          ? "De Salida"
          : "De Entrada",
        fechaCargue: moment(
          doc?.entry?.createdAt,
          "YYYY-MM-DDTHH:mm:ss.SSSZ"
        ).format("DD/MM/YYYY"),
        cargadoPor: doc?.entry.createdByUser?.displayName,
        nodeId: doc?.entry.id,
        id: doc?.entry.id,
        formato: doc?.entry?.content?.mimeType,
      };
    });

    loadedDocs.value = docs;
    copyListDcos.value = loadedDocs.value;
  } catch (error) {
    console.error(error);
  }

};

async function getDimanicDatos() {
  const user = auth?.$state?.userInfo;

  const rolUserId = user.relations.find((it) => it.rol === user.role);

  const getEstados = (await sgdeaAxios.get("/estadosProceso/all")).data;

  const estadoProceso = getEstados.find(
    (it) => it.estado === initialData.value.estado
  );

  const { data: getDimanicDatos } = await sgdeaAxios.get(
    `/parametrizacion-formulario/ListadoParametrizacion?id_flujo=10&id_rol=${
      rolUserId.idRol
    }&id_oficina=${user.oficina ? user.oficina : ""}&id_estado_proceso=${
      estadoProceso.id
    }`
  );

  if (getDimanicDatos.content.length > 0) {
    isMetadatos.value = true;
    metadatos.value = await getDimanicDatos.content;
  } else {
    isMetadatos.value = false;
  }
}

const deleteDocs = async () => {
  try {
    for (const selectedDoc of selectedDocs.value) {
      const response = await sgdeaAxios.delete(
        "/alfresco/deleteFile/" + selectedDoc.nodeId
      );
      if (response.status === 200) {
        toast.success("Documento eliminado con éxito");
        getData();
      }
    }
    selectedDocs.value = [];
  } catch (error) {
    toast.error("Ocurrió un problema al eliminar el documento");
  }
};

onMounted(async () => {
  await getData();
  getAllRegisters();
});

const openVista = (vista: string) => {
  vistaActual.value = vista;
};

const handleAcceptModal = () => {
  showConfirmationModal.value = false;
  asignarUsuario(asignarCuentaUsuarioBody.value, () => {
    router.push("/facturacion/cuentas-cobro/radicadas");
  });
};

async function handleUploadFile() {
  const files: File[] | File = newFileInput.value;

  if ((Array.isArray(files) && files.length === 0) || files === null) {
    toast.error("Debe seleccionar un archivo");
    return;
  }

  const formData = new FormData();
  for (const file of Array.isArray(files) ? files : [files]) {
    formData.append("anexos", file);
  }


  formData.append("idRadicado", initialData.value.nodeId);
  formData.append("descripcionRadicado", "CUENTA");
  formData.append("es_devolucion", false);

  try {
    const { data } = await sgdeaAxios.post(
      "/api/v1/integracion/alfresco/agregarAnexos",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (data) {
      toast.success("Archivo cargado correctamente");
      await crearTrazabilidad({
        proceso: "CTO" + initialData.value.idCto,
        secuencia: initialData.value.sec,
        estado: initialData.value.estado,
        descripcion: "Se ha adjuntado un documento a la cuenta de cobro",
        comentario: "Adjunto",
        nombre: auth.$state.userInfo.name,
      });
      modalDocuments.value = false;
      getData();
    }
  } catch (error) {
    toast.error("Error al cargar el archivo");
  }
}

async function handleLiberar() {
  const responde = await sgdeaAxios.put(
    `/facturacion/liberar?type=CUENTA&id=${route.params.id}`
  );

  showModal.value = false;
  router.push("/facturacion/cuentas-cobro/radicadas");
}

const showModalAsigna = async () => {
  if (await asignarRef.value.validate()) {
    if (
      asignaResponsable.value === "si" &&
      asignarCuentaUsuarioBody.value.usuarioAsignado
    ) {
      showConfirmationModal.value = true;
    } else if (
      asignaResponsable.value === "no" &&
      cardsAsignar.value.length !== 0
    ) {
      showConfirmationModal.value = true;
    } else {
      toast.error(
        "Debe seleccionar un usuario para completar la asignación"
      );
    }
  } else {
    toast.error(
      "Para continuar, asegúrese de que todos los campos requeridos estén completos."
    );
  }
};

const nameDocument = ref("");
const iframePdfUrl = ref("");
const visualizadorPDF = ref(false);

const getBlobToIframe = async (id: string) => {
  const { data } = await sgdeaAxios.get<DocumentoRadicado>(
    `/radicados/consultar_documento/${id}`
  );

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

watch(
  () => asignaResponsable.value,
  (newValue) => {
    if (newValue === "si") {
      asignarCuentaUsuarioBody.value.usuarioAsignado = responsable.value.value;
      cardsAsignar.value = [];
      asignarCuentaUsuarioBody.value.motivoAsignacion = "";
    } else if (newValue === "no") {
      asignarCuentaUsuarioBody.value.usuarioAsignado = "";
      cardsAsignar.value = [];
      asignarCuentaUsuarioBody.value.motivoAsignacion = "";
    }
  }
);

//cards asignar
const cardsAsignar = ref([]);

const removeCardAsignar = (index) => {
  cardsAsignar.value.splice(index, 1);
};

//TABLA ASIGNAR
const columnsAsignar = [
  {
    name: "colaborador",
    label: "Colaborador",
    field: "colaborador",
    sortable: true,
    align: "center",
  },
  {
    name: "cargo",
    label: "Cargo",
    field: "cargo",
    sortable: true,
    align: "center",
  },
  {
    name: "grupo",
    label: "Grupo",
    field: "grupo",
    sortable: true,
    align: "center",
  },
];

const listUsers = ref([]);

const rejected = (file: any[]) => {
  if (file[0].failedPropValidation === "accept") {
    toast.error("El archivo no cumple con alguno de los formatos permitidos")
  } else if (file[0].failedPropValidation === "max-file-size") {
    toast.error("El archivo excede el tamaño permitido (50MB)");
  }
};

async function getAllRegisters() {
  try {
    const dependencia = await sgdeaAxios.put(
      `/seccionSubSeccion/filter/${initialData.value.dependencia}`
    );
    var role = "Aprobador";
    if (initialData.value.estado.toLowerCase() == "por asignar") {
      role = "Gestionador";
    } else if (
      auth.relations.some((obj) => obj.rol === "Asignador Responsable")
    ) {
      role = "Gestionador";
    }
    //const { data } = await sgdeaAxios.get(`/api/usuarios/rolYSeccionSubseccion/${dependencia.data[0]?.idSeccionSubSeccion}?rolName=${role}`);
    const { data } = await sgdeaAxios.get(`/roles/usuarios?rol=${role}`);

    listUsers.value = data
      .filter((responsable: any) => responsable.enabled)
      .map((item) => ({
        colaborador: item.firstname + " " + item.lastname,
        cargo: item.cargo,
        id: item.id,
        user: item.userName,
        grupo: item.usuarioRelaciones[0].seccionSubSeccion.nombre,
        oficina: item.usuarioRelaciones[0]?.oficina?.id,
      }));

  } catch (error) {
    console.error(error);
  }
}

//END ASIGNAR

const routes = [
  {
    name: "Inicio",
    to: "/home",
  },
  {
    name: "Cuentas de cobro",
    to: "/facturacion/cuentas-cobro/radicadas",
  },
  {
    name: "Asignación del caso # " + showRoute.value,
  },
];

const handleAssign = (array: any[]) => {
  (cardsAsignar.value = array.map((item) => ({
    name: item.colaborador,
    visible: true,
  }))),
    array.map(
      (item) =>
        (asignarCuentaUsuarioBody.value.usuarioAsignado = item.id,
          asignarCuentaUsuarioBody.value.oficinaAsignada = item.oficina
        )
    );
};


// Propiedad computada para filtrar los documentos
const filteredDocs = computed(() => {
  return loadedDocs.value.filter(doc => doc.tipoDocumento === typeDoc.value);
});

const changeDocs=(type)=> {
      typeDoc.value = type;
    }
</script>

<style>
label {
  padding: 0px 10px;
}

.titles {
  color: #6b737c;
  font-weight: bold;
  margin-top: 10px;
}

.alineation {
  display: flex;
  flex-direction: wrap;
}

@media (max-width: 768px) {
  .alineation {
    flex-direction: column;
  }

  .width-container {
    width: 100%;
  }
}
</style>
