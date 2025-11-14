<template>
  <div>
    <div>
      <div class='tw-mb-6'>
        <p class="pl-4 tw-font-bold tw-text-3xl tw-mb-3 text-bold">Editar Notificación</p>
      </div>
      <q-form ref="form" @submit.prevent="" class="[&>*]:tw-mb-4" greedy>
        <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
          <q-expansion-item label="Datos Personales" default-opened header-class="tw-text-lg tw-font-bold">
            <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Modulo *</p>
                <q-select :options="listadoModulos" map-options emit-value :rules="[rulesValidation]" outlined
                  v-model='formData.modulo' label="Seleccione" dense />
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Correo electrónico de notificación *</p>
                <q-select :options="filteredCorreos" map-options emit-value :rules="[rulesValidation]" outlined
                  v-model='formData.correo' label="Seleccione" dense @filter="selectOptionsFilterCorreos" use-input
                  fill-input hide-selected :disable="Number(formData.modulo) == 1 ? true : false" />
              </div>
              <div class="tw-col-span-6">
                <p class="tw-text-label tw-font-semibold">Nombre de la alerta *</p>
                <q-input outlined v-model='formData.nombre' label="Inserte" dense
                  :rules="[(v: string) => lengthValidation(100, v), rulesValidation]" />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Tipo de notificación *</p>
                <q-select :options="listadoTipoNoti" outlined v-model='formData.tipo' map-options emit-value
                  :rules="[rulesValidation]" label="Seleccione" dense input-debounce="0" class="tw-rounded-lg">
                </q-select>
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Cantidad de días del proceso *</p>
                <q-input type="text" min="0" outlined v-model='formData.cantidadDias' label="Inserte" dense
                  :rules="[(v: string) => lengthValidation(2, v), (v: string) => onlyNumbers(v), rulesValidation, (v: string) => v == '00' ? 'Debes ingresar un valor válido' : true]"
                  @keypress="onlyNumber" />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Perfil para notificar *</p>
                <q-select :options="listadoPerfiles" outlined v-model='formData.perfil' :rules="[rulesValidation]"
                  label="Seleccione" dense input-debounce="0" class="tw-rounded-lg" map-options emit-value>
                </q-select>
              </div>
              <div class="tw-col-span-6" v-if="Number(formData.modulo) == 1">
                <p class="tw-text-label tw-font-semibold">Tipología PQRD *</p>
                <q-select :options="listadoTipologiaOptions" map-options emit-value outlined
                  v-model='formData.tipologia' :rules="[rulesValidation]" label="Seleccione" dense input-debounce="0"
                  class="tw-rounded-lg">
                </q-select>
              </div>
              <div class="tw-col-span-6">
                <p class="tw-text-label tw-font-semibold">Asunto *</p>
                <q-input outlined v-model='formData.asunto' label="Inserte" dense
                  :rules="[(v: string) => lengthValidation(200, v), rulesValidation]" />
              </div>
              <div class="tw-col-span-6">
                <p class="tw-text-label tw-font-semibold">Mensajes *</p>
                <q-input type="textarea" :rules="[rulesValidation, (v: string) => lengthValidation(5000, v)]" outlined
                  dense v-model:model-value="formData.mensajes" />
              </div>
              <div class="tw-col-span-6">
                <p class="tw-text-label tw-font-semibold">Adjuntar documentos de soporte</p>
                <FileLoader :max-file-size="30 * 1024 * 1024" max-file-size-label="30"
                  v-model:model-value="formData.files" :rules="[]" :max-files="30"
                  accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg" multiple
                  @rejected="rejectedFiles" />
              </div>
            </div>
          </q-expansion-item>
        </q-card>
      </q-form>

      <Table ref="tableDoc" :TABLE_BODY="listDocs" :TABLE_HEADER="HEADER_DOCUMENTS"
            icon="download" isSecondIcon secondIcon="print" :loading="false"
            is-selection="multiple" @handleEditData="download" @handleSecondIcon="print" key-id="id" />
    </div>

    <div class="col col-12 row justify-center  tw-w-full tw-m-[10px] tw-mt-10 tw-flex tw-gap-4">
      <q-btn label="Cancelar" textColor="black" class=" tw-rounded-xl tw-p-3 tw-w-[200px]" outline
        @click="cancelModal = true" />
      <q-btn type="submit" label="Editar Notificación" @click="validations" color="primary" textColor="white"
        class="tw-rounded-xl tw-w-[200px] tw-h-10" :loading="handleSubmitIsLoading" />
    </div>

    <Modal v-model="cancelModal" title="¡Espera un momento!" :is-success="false" @handleAccept="onReset" cancel-button
      textButtonCancel="No" textButton="Si"
      text="Al cancelar la acción perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
      @close-modal="cancelModal = false" type="button" />

    <Modal v-model="sendModal" title="¡Espera un momento!" :is-success="false" @handleAccept="submit" cancel-button
      textButtonCancel="No" textButton="Si" text="¿Está seguro que desea modificar la notificación?"
      @close-modal="sendModal = false" type="button" />
  </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from "vue-router";
import { onMounted, Ref, ref, watch } from 'vue';
import Table from './TableArchivos.vue'
import FileLoader from 'components/FormFields/FileLoader.vue';
import { sgdeaAxios } from 'src/services';
import { toast } from "src/helpers/toast";
import { DocumentoRadicado, SelectInput } from "src/interfaces";
import Modal from "components/Modal/Modal.vue";
import {
  onlyNumbers,
} from "src/helpers/validations";
import { Notify } from "quasar";


interface PQRD {
  modulo: string;
  correo: string;
  nombre: string;
  tipo: string;
  cantidadDias: string;
  perfil: string;
  tipologia: string;
  asunto: string;
  mensajes: string;
  files: any[];
}

const handleSubmitIsLoading = ref<boolean>(false)
const formData: Ref<PQRD> = ref({
  modulo: '',
  correo: '',
  nombre: '',
  tipo: '',
  cantidadDias: '',
  perfil: '',
  tipologia: '',
  asunto: '',
  mensajes: '',
  files: [],
});

const print = async (id) => {
  try {
    const { data } = await sgdeaAxios.get<DocumentoRadicado>(
      `/radicados/consultar_documento/${id}`
    );

    if (id) {
      nameDocument.value = listDocs.value.find((it) => it.id === id)?.nombre;
    }

    const byteCharacters = atob(data.base64x);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const blobUrl = URL.createObjectURL(blob);

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = blobUrl;
    document.body.appendChild(iframe);

    // Función para manejar el evento afterprint
    function handleAfterPrint() {
      // Eliminar el iframe después de imprimir o cancelar
      document.body.removeChild(iframe);
      window.removeEventListener("afterprint", handleAfterPrint);
    }

    // Agregar evento afterprint para manejar la impresión
    window.addEventListener("afterprint", handleAfterPrint);

    // Esperar a que se cargue el contenido del iframe antes de imprimir
    iframe.onload = function () {
      // Imprimir el contenido del iframe
      iframe.contentWindow.print();
    };
  } catch (error) {
    toast.error("Ha ocurrido un error");
    console.error(error);
  } finally {
  }
};

const download = async (id) => {
  try {
    const { data } = await sgdeaAxios.get<DocumentoRadicado>(
      `/radicados/consultar_documento/${id}`
    );
    if (id) {
      nameDocument.value = listDocs.value.find((it) => it.id === id)?.nombre;
    }

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
    link.download = nameDocument.value;

    link.click();

    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    toast.error("Ha ocurrido un error");
    console.error(error);
  }
};

const HEADER_DOCUMENTS = [
  {
    name: "formato",
    label: "Formato",
    field: "formato",
    sortable: false,
    align: "center",
  },
  {
    name: "nombre",
    label: "Nombre del documento",
    field: "nombre",
    sortable: true,
    align: "center",
  },
  {
    name: "tipo",
    label: "Tipo de documento",
    field: "tipo",
    sortable: true,
    align: "center",
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    sortable: true,
    align: "center",
  },
];


const router = useRouter()
const route = useRoute()
const form = ref()
const listadoTipologiaOptions: Ref<any[]> = ref([])
const listadoModulos: Ref<any[]> = ref([])
const listadoTipoNoti: Ref<SelectInput[]> = ref([]);
const listadoCorreos: Ref<SelectInput[]> = ref([]);
const listadoPerfiles: Ref<SelectInput[]> = ref([]);
const nameDocument = ref()
const filteredCorreos = ref()
const cancelModal = ref(false)
const sendModal = ref(false)
const MAX_FILE = 10
const listDocs = ref([])

onMounted(async () => {
  await getData()
  await loadListadoTipologia()
  await loadListadoModulos()
  await loadListadoTipo()
  await loadListadoCorreos()
  await loadListadoPerfiles()
})

async function getData() {
  try {
    const response = await sgdeaAxios.get(`/notificaciones/{id}?id=${route.params.id}`)
    /*
    * {
    "id": 1,
    "nombreAlerta": "aaaaaa",
    "diasProceso": 23,
    "asunto": "aspspspsp",
    "mensaje": "111111111111111111111111111111111111111111111",
    "tipologiaPQRD": {
        "id": 2,
        "nombre": "Derecho de Petición"
    },
    "tipoNotificacion": {
        "id": 1,
        "nombre": "Informativa"
    },
    "modulo": {
        "id": 1,
        "nombre": "PQRD"
    },
    "rol": {
        "id": 5,
        "nombre": "Consulta Emisión Factura",
        "idBonita": 112,
        "idGrupoBonita": 112,
        "idKeycloak": "cedf15e2-5b1f-4a6a-8303-8a48311a9495"
    },
    "activo": true,
    "correo": null
}
    *
    *
    *
    * */
    formData.value = {
      asunto: response.data.asunto,
      mensajes: response.data.mensaje,
      cantidadDias: response.data.diasProceso,
      modulo: response.data.modulo.id,
      tipo: response.data.tipoNotificacion.id,
      perfil: response.data.rol.id,
      tipologia: response.data.tipologiaPQRD?.id,
      nombre: response.data.nombreAlerta,
      correo: response.data.emailNotificacion,
      files: null
    };

    listDocs.value = response.data.files.map((it) => {
      return {
        id: it.nodeId,
        formato: 'application/pdf',
        nombre: it.nombre,
        tipo: it.tipo
      }
    })
  } catch (error) {
    console.error(error)
  }
}

async function loadListadoTipologia() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoTipologia")

    if (response.status == 200 || response.status == 201) {
      listadoTipologiaOptions.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        }
      })
    }

    sortOptions(listadoTipologiaOptions.value)

  } catch (error) {
    console.error(error)
  }
}

async function loadListadoModulos() {
  try {
    const response = await sgdeaAxios.get("/notificaciones/modulos")

    if (response.status == 200 || response.status == 201) {
      listadoModulos.value = response.data.map((e: any) => {
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

async function loadListadoTipo() {
  try {
    const response = await sgdeaAxios.get("/notificaciones/tipo-notificacion")

    if (response.status == 200 || response.status == 201) {
      listadoTipoNoti.value = response.data.map((e: any) => {
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

async function loadListadoCorreos() {
  try {
    const response = await sgdeaAxios.get("/usuarios/emails")

    if (response.status == 200 || response.status == 201) {
      listadoCorreos.value = response.data.map((e: any) => {
        return {
          label: e.usuarioEmail,
          value: e.usuarioId
        }
      })
    }

  } catch (error) {
    console.error(error)
  }
}

async function loadListadoPerfiles() {
  try {
    const response = await sgdeaAxios.get("/roles")

    if (response.status == 200 || response.status == 201) {
      listadoPerfiles.value = response.data.map((e: any) => {
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

function onReset() {
  router.push('/notificaciones')
};

const rejectedFiles = (error: any[]) => {
  if (error.some((it: { failedPropValidation: string; }) => it.failedPropValidation === 'max-file-size')) {
    Notify.create({ type: "error", message: "El peso permitido es hasta 30MB." })
  }
  if (error.some((it: { failedPropValidation: string; }) => it.failedPropValidation === 'max-files')) {
    Notify.create({ type: "error", message: `Solo se pueden adjuntar ${MAX_FILE} archivos.` })
  }
  if (error.some((it: { failedPropValidation: string; }) => it.failedPropValidation === 'accept')) {
    Notify.create({
      type: 'error',
      message: 'Formato inválido, los formatos permitidos son (pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg).',
    })
  }
}

const selectOptionsFilterCorreos = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredCorreos.value = listadoCorreos.value
    })
    return
  }
  update(() => {
    filteredCorreos.value = listadoCorreos.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

watch(() => formData.value.modulo, (newValue) => {
  if (Number(newValue) == 1) {
    formData.value.correo = "alertastramitesengestion@positiva.gov.co"
  } else {
    formData.value.correo = null
  }
})

const validations = async () => {
  if (await form.value.validate()) {
    sendModal.value = true
  } else {
    toast.error("Debes llenar todos los campos obligarios")
  }
}

const submit = async () => {
  handleSubmitIsLoading.value = true;

  const notificacionesSubmit = new FormData();

  notificacionesSubmit.append('moduloId', formData.value.modulo);
  notificacionesSubmit.append('tipoNotificacionId', formData.value.tipo);
  notificacionesSubmit.append('nombreAlerta', formData.value.nombre);
  notificacionesSubmit.append('diasProceso', formData.value.cantidadDias);
  notificacionesSubmit.append('rolId', formData.value.perfil);
  notificacionesSubmit.append('asunto', formData.value.asunto);
  notificacionesSubmit.append('mensaje', formData.value.mensajes);

  if (form.value.tipologia && form.value.tipologia !== '') {
    notificacionesSubmit.append('tipologiaId', formData.value.tipologia);
  }
  // @ts-expect-error
  notificacionesSubmit.append('activo', true);

  if (formData.value.files && formData.value.files.length) {
    for (let i = 0; i < formData.value.files.length; i++) {
      notificacionesSubmit.append('files', formData.value.files[i]);
    }
  }

  try {
    const response = await sgdeaAxios.put(`/notificaciones/${route.params.id}`, notificacionesSubmit)
    toast.success('Se ha editado la notificación exitosamente')
    router.push('/notificaciones')
  } catch (error) {
    toast.error("Ha ocurrido un error")
    console.error(error)
    handleSubmitIsLoading.value = false;
  }
}

const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return 'Este campo es requerido'
  }
  return true
}

function onlyNumber(event: { keyCode: any; which: any; preventDefault: () => void; }) {
  let keyCode = event.keyCode ? event.keyCode : event.which;
  if ((keyCode >= 48 && keyCode <= 57)) {
    return true;
  }
  event.preventDefault();
  return false;
}

const lengthValidation = (n:number, val: string) => val?.length <= n || "Máximo " + n + " caracteres";
</script>

<style lang="scss" scoped>
.input-code:focus {
  outline: none;
}
</style>
