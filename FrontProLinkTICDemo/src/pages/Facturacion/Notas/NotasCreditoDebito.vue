<template>
  <section class="tw-flex tw-flex-row tw-bg-bg">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
      <div class="tw-pt-4">
        <router-link :to="routeLink">
          <q-btn flat color="primary" label="Volver" icon="chevron_left" />
        </router-link>
      </div>

      <div class="tw-flex tw-justify-between tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold">
          Radicación Nota Crédito o Débito
        </h1>
      </div>

      <q-form ref="formValidate" greedy>
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <template v-slot:header>
            <div class="col row">
              <p class="tw-text-2xl tw-font-bold">
                Información básica radicación
              </p>
            </div>
          </template>

          <div class="tw-mt-2">
            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <!-- Dependencia y Responsable del proceso -->
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Número de Radicado Anterior *</label>
                  <q-select :options="searchHelpDataFiltered" fill-input hide-selected map-options input-debounce="0"
                    emit-value use-input v-model="filterValue" @filter="selectOptionsFilterFn" class="tw-w-full" rounded
                    outlined dense :placeholder="'Ingrese'" :rules="[
                      (l) =>
                        maxLengthInputCustom(
                          50,
                          l,
                          'número de radicado anterior'
                        ),
                      inputRequired,
                    ]">
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Número de Factura *</label>
                  <q-input v-model="form.numeroFactura" :rules="[inputRequired]" :disable="true" dense label="Ingrese"
                    outlined class="tw-rounded-lg" no-validate>
                  </q-input>
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">CUFE (Código Único de Facturación Electrónica) *</label>
                  <q-input v-model="form.cufe" :rules="[inputRequired]" :disable="true" dense label="Ingrese" outlined
                    class="tw-rounded-lg" no-validate>
                  </q-input>
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Tipificación *</label>
                  <q-select v-model="form.tipificacion" disable :rules="[inputRequired]" :options="tipificacionOptions"
                    emit-value map-options dense label="Ingrese" outlined class="tw-rounded-lg">
                  </q-select>
                </span>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">
                    <span v-if="form.tipificacion == 'NC'">Número de Nota de Crédito</span>
                    <span v-else>Número de Nota de Débito</span>
                  </label>
                  <q-input v-model="form.numeroNota" :rules="[inputRequired, (v) => maxLengthInput(10, v)]" dense
                    label="Ingrese" outlined class="tw-rounded-lg">
                  </q-input>
                </span>
              </div>

              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <span class="tw-w-full">
                  <label class="tw-text-label"> Valor Ajuste </label>
                  <q-input v-model="form.valorAjuste" :rules="[inputRequired]" :disable="true" dense label="Ingrese"
                    outlined class="tw-rounded-lg">
                  </q-input>
                </span>
              </div>

              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <span class="tw-w-full">
                  <label class="tw-text-label"> Dependencia </label>
                  <q-input v-model="form.dependecia" :rules="[inputRequired]" :disable="true" dense label="Ingrese"
                    outlined class="tw-rounded-lg">
                  </q-input>
                </span>
              </div>

              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <span class="tw-w-full">
                  <label class="tw-text-label"> Proveedor </label>
                  <q-input v-model="form.proveedor" :rules="[inputRequired]" :disable="true" dense label="Ingrese"
                    outlined class="tw-rounded-lg">
                  </q-input>
                </span>
              </div>

              <div class="col-12">

                <CommentTextArea v-model="form.descripcion" :is-required="true" :max-length="10000"
                  label="Descripción (Detalle)" />

              </div>
              <div class="col-12">
                <span class="w-full">
                  <label class="tw-text-label">Adjuntar Documentos - Soportes *</label>
                  <FileLoader v-model="form.docs" class="tw-w-full" :multiple="false"
                    accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
                    sub-title="Puede adjuntar (10) Archivo(s) cada uno con un tamaño permitido de 50MB en cualquiera de las siguientes extenciones <hr>(pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)"
                    :max-file-size="50 * 1024 * 1024" max-file-size-label="50" :max-files="10" @rejected="rejectedFiles"
                    :rules="[inputRequired]" />
                </span>
              </div>
            </div>
          </div>
        </q-card>
      </q-form>

      <div class="col row justify-center q-gutter-x-md q-my-md">
        <q-btn color="accent" textColor="secondary" label="Cancelar" style="
            width: 130px;
            height: 40px;
            border-radius: 8px;
            font-size: 16px;
          " type="reset" no-caps @click="cancelModal = true" />

        <q-btn color="primary" label="Guardar" style="
            width: 130px;
            height: 40px;
            border-radius: 8px;
            font-size: 16px;
          " @click="radicarModal = true" :loading="handleSubmitIsLoading" />
      </div>
    </main>
    <Modal v-model="cancelModal" title="Confirmación" :is-success="false" @handleAccept="resetForm" cancel-button
      textButtonCancel="No" textButton="Si"
      text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
      @close-modal="cancelModal = false" type="button" />

    <q-dialog v-model="errorModal" persistent>
      <q-card :class="['tw-px-3 tw-h-[396px] tw-w-[450px]']">
        <div class="tw-flex tw-justify-center tw-mt-10">
          <span class="tw-rounded-[50px] tw-flex tw-justify-center" style="
              background-color: rgba(0, 219, 0, 0.05);
              width: 130px;
              height: 82px;
            ">
            <img v-lazy :data-url="error" alt="check" width="40" />
          </span>
        </div>
        <q-card-section class="flex column justify-center items-center">
          <p :class="['tw-text-[18px] text-center tw-mt-3']">
            El radicado #0000000, no se encuentra retenido por ajuste de NC o
            ND. Por lo tanto no puede cargar los documentos correspondientes
          </p>

          <div class="tw-flex tw-mt-8">
            <q-btn label="Ok" style="width: 200px; height: 50px" text-color="white" color="primary" v-close-popup
              class="tw-rounded-xl tw-p-3" @click="errorModal = false" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <Modal v-model:model-value="successModal" title="Confirmación" persistent
      :text="`Radicación de ${form.tipificacion} de manera exitosa`" :is-success="true" text-button="Finalizar"
      @handleAccept="successModal = false" />
    <Modal v-model="radicarModal" title="¡Espera un momento!" :is-success="false" @handleAccept="handleSubmit"
      cancel-button textButtonCancel="No" textButton="Si" text=" ¿Estas seguro de radicar la información ingresada?"
      @close-modal="radicarModal = false" type="button" />
  </section>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { type Ref, ref, onMounted, watch } from "vue";
import error from "src/assets/error.svg";
import FileLoader from "src/components/FormFields/FileLoader.vue";
import {
  inputRequired,
  maxLengthInput,
  maxLengthInputCustom,
} from "src/helpers/validations";
import { sgdeaAxios } from "src/services";
import Modal from "components/Modal/Modal.vue";
import { toast } from "src/helpers/toast";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { useAuthStore } from "src/stores/auth.store";
import CommentTextArea from  "src/shared/components/TextArea/Comments.vue";


const { getUserInfo } = useAuthStore();
const router = useRouter();
const auth = useAuthStore();
const formValidate = ref();
const routeLink = ref("");
const cancelModal = ref(false);
const successModal = ref<boolean>(false);
const errorModal = ref<boolean>(false);
const handleSubmitIsLoading = ref<boolean>(false);
const filterValue = ref("");
const searchHelpData = ref([]);
const retenidosData = ref([]);
const userInfo = ref(getUserInfo());
const searchHelpDataFiltered = ref(searchHelpData);
const form = ref({
  numeroRadicadoAnterior: "",
  numeroFactura: "",
  tipificacion: "",
  numeroNota: "",
  valorAjuste: "",
  dependecia: "",
  proveedor: "",
  descripcion: "",
  docs: null,
  cufe: "",
});
const radicarModal = ref(false);
const tipificacionOptions = [
  {
    label: "Nota de crédito",
    value: "NC",
  },
  {
    label: "Nota de débito",
    value: "ND",
  },
];

const selectOptionsFilterFn = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      searchHelpDataFiltered.value = searchHelpData.value;
    });
    return;
  }

  update(() => {
    searchHelpDataFiltered.value = searchHelpData.value.filter((option) => {
      return option.value.toLowerCase().includes(val.toLowerCase());
    });
  });
};

const getInitialData = async () => {
  if (
    userInfo.value.role == "Administrador Master" ||
    userInfo.value.role == "Administrador de Trámite"
  ) {
    routeLink.value = "/facturacion/radicados";
  } else {
    routeLink.value = "/home";
  }
  try {
    searchHelpData.value = [];
    retenidosData.value = (
      await sgdeaAxios.get("/facturacion/getByFilter")
    ).data;
    retenidosData.value.forEach((radicado) => {
      searchHelpData.value.push({
        label: radicado.sec,
        value: radicado.idFactura,
      });
    });
    // Busqueda de datos
  } catch (e) {
    toast.error("El numero de radicado es incorrecto");
  }
};

const handleSubmit = async () => {
  if (
    (await formValidate.value.validate()) &&
    form.value.docs &&
    filterValue.value &&
    form.value.tipificacion &&
    form.value.numeroNota &&
    form.value.valorAjuste &&
    form.value.dependecia &&
    form.value.proveedor &&
    form.value.descripcion
  ) {
    await createNotaDebitoCredito();
  } else {
    toast.error(
      "Para continuar, asegúrese de que todos los campos requeridos estén completos"
    );
    return;
  }
};

async function createNotaDebitoCredito() {
  handleSubmitIsLoading.value = true;
  try {
    const requestData = {
      idFactura: filterValue.value,
      numeroRadicadoAnterior: retenidosData.value.find(
        (radicado) => radicado.idFactura == filterValue.value
      ).sec,
      numeroFactura: form.value.numeroFactura,
      tipificacion: form.value.tipificacion,
      numeroNota: form.value.numeroNota,
      valorAjuste: form.value.valorAjuste,
      dependecia: form.value.dependecia,
      proveedor: form.value.proveedor,
      descripcion: form.value.descripcion,
    };

    //const formData = JSON.stringify(requestData);

    const response = await sgdeaAxios.post(
      "/facturacion/crearNotaDebitoCredito",
      requestData
    );
    if (response.status === 201 || response.status === 200) {
      await handleUploadFile();
      await crearTrazabilidad({
        proceso: "FAC" + requestData.idFactura,
        secuencia: requestData.numeroRadicadoAnterior,
        estado: "Retenido",
        descripcion:
          `Se ha adjuntado radicado una nota de ${
            form.value.tipificacion == "ND" ? "Debito" : "Credito"
          }  con el número ` + form.value.numeroNota,
        comentario: "Adjunto",
        nombre: auth.$state.userInfo.name,
      });
      successModal.value = true;
      filterValue.value = "";
      form.value = {
        numeroRadicadoAnterior: "",
        numeroFactura: "",
        tipificacion: "",
        numeroNota: "",
        valorAjuste: "",
        dependecia: "",
        proveedor: "",
        descripcion: "",
        docs: null,
      };
      getInitialData();
    }
  } catch (e) {
    console.error(e);
    //errorModal.value = true;
  } finally {
    handleSubmitIsLoading.value = false;
  }
}

async function handleUploadFile() {
  const files: File = form.value.docs;

  if (!files) {
    toast.error("Debe seleccionar un archivo");
    return;
  }

  const formData = new FormData();
  formData.append("anexos", files);

  formData.append(
    "idRadicado",
    retenidosData.value.find(
      (radicado) => radicado.idFactura == filterValue.value
    ).nodeId
  );
  formData.append("descripcionRadicado", "FACTURA");

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
  } catch (error) {
    toast.error("Error al cargar el archivo");
  }
}

watch(filterValue, (newValue) => {
  const selectedOption = retenidosData.value.find(
    (radicado) => radicado.idFactura == newValue
  );
  if (selectedOption) {
    form.value.numeroFactura = selectedOption.numeroFactura;
    form.value.tipificacion = selectedOption.tipificacion;
    form.value.cufe = selectedOption.cufe;
    form.value.valorAjuste = selectedOption.valorn;
    form.value.dependecia = selectedOption.dependencia;
    form.value.proveedor =
      selectedOption.numeroDocumento +
      " - " +
      selectedOption.primerNombre +
      " " +
      selectedOption.otrosNombres +
      " " +
      selectedOption.primerApellido +
      " " +
      selectedOption.segundoApellido;
    // Set other form fields as needed
  }
});

onMounted(() => {
  getInitialData();
});

const resetForm = () => {
  form.value = {
    numeroRadicadoAnterior: "",
    numeroFactura: "",
    tipificacion: "Nota de crédito",
    numeroNota: "NC",
    valorAjuste: "",
    dependecia: "",
    proveedor: "",
    descripcion: "",
    docs: [],
  };
  router.push("/home");
};

const rejectedFiles = (error) => {
  if (error.some((it) => it.failedPropValidation === "max-file-size")) {
    toast.error("El peso permitido es hasta 50MB.");
  }
  if (error.some((it) => it.failedPropValidation === "max-files")) {
    toast.error("Solo se pueden adjuntar 30 archivos.");
  }
};
</script>

<style></style>
