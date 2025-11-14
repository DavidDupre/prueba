<template>
  <div>
    <div>
      <div class='tw-mb-6'>
        <p class="pl-4 tw-font-bold tw-text-3xl tw-mb-3 text-bold">Creación de notificaciones</p>
      </div>
      <q-form ref="form" @submit.prevent="" class="[&>*]:tw-mb-4" greedy>
        <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
          <q-expansion-item label="" default-opened header-class="tw-text-lg tw-font-bold">
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
                  fill-input hide-selected :disable="Number(formData.modulo) == 5 ? true : false" />
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
                <p class="tw-text-label tw-font-semibold">Días inicial de notificación *</p>
                <q-input type="text" min="0" outlined v-model='formData.cantidadDias' label="Inserte" dense
                  :rules="[(v: string) => lengthValidation(2, v), (v: string) => onlyNumbers(v), rulesValidation, (v: string) => v == '00' ? 'Debes ingresar un valor válido' : true]"
                  @keypress="onlyNumber" />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Días maximo de notificación *</p>
                <q-input type="text" min="0" outlined v-model='formData.cantidadDiasMaximo' label="Inserte" dense
                  :rules="[(v: string) => lengthValidation(2, v), (v) => validateMaxDays(v), (v: string) => onlyNumbers(v), rulesValidation, (v: string) => v == '00' ? 'Debes ingresar un valor válido' : true]"
                  @keypress="onlyNumber" />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Perfil para notificar * {{ formData.perfil }}</p>
                <q-select :options="listadoPerfiles" outlined v-model='formData.perfil' :rules="[rulesValidation]"
                  label="Seleccione" dense input-debounce="0" class="tw-rounded-lg" map-options emit-value>
                </q-select>
              </div>
              <div class="tw-col-span-6" v-if="Number(formData.modulo) == 5">
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
                  accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
                  sub-title="Puede adjuntar (30) Archivo(s) cada uno con un tamaño permitido de 30MB en cualquiera de las siguientes extenciones <br/>(pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)"
                  multiple
                  @rejected="rejectedFiles" />
              </div>
            </div>
          </q-expansion-item>
        </q-card>
      </q-form>
    </div>

    <div class="col col-12 row justify-center  tw-w-full tw-m-[10px] tw-mt-10 tw-flex tw-gap-4">
      <q-btn label="Cancelar" textColor="black" class=" tw-rounded-xl tw-p-3 tw-w-[200px]" outline
        @click="cancelModal = true" />
      <q-btn type="submit" label="Crear Notificación" @click="validations" color="primary" textColor="white"
        class="tw-rounded-xl tw-w-[200px] tw-h-10" :loading="handleSubmitIsLoading" />
    </div>

    <Modal v-model="cancelModal" title="¡Espera un momento!" :is-success="false" @handleAccept="onReset" cancel-button
      textButtonCancel="No" textButton="Si"
      text="Al cancelar la acción perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
      @close-modal="cancelModal = false" type="button" />

    <Modal v-model="sendModal" title="¡Espera un momento!" :is-success="false" @handleAccept="submit" cancel-button
      textButtonCancel="No" textButton="Si" text="¿Está seguro que desea crear la notificación?"
      @close-modal="sendModal = false" type="button" />
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { onMounted, Ref, ref, watch } from 'vue';
import FileLoader from 'components/FormFields/FileLoader.vue';
import { sgdeaAxios } from 'src/services';
import { toast } from "src/helpers/toast";
import { SelectInput } from "src/interfaces";
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
  cantidadDiasMaximo: string;
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
  cantidadDiasMaximo: '',
  perfil: '',
  tipologia: null,
  asunto: '',
  mensajes: '',
  files: [],
});

const router = useRouter()
const form = ref()
const listadoTipologiaOptions: Ref<any[]> = ref([])
const listadoModulos: Ref<any[]> = ref([])
const listadoTipoNoti: Ref<SelectInput[]> = ref([]);
const listadoCorreos: Ref<SelectInput[]> = ref([]);
const listadoPerfiles: Ref<SelectInput[]> = ref([]);
const filteredCorreos = ref()
const cancelModal = ref(false)
const sendModal = ref(false)
const MAX_FILE = 10

onMounted(async () => {
  await loadListadoTipologia()
  await loadListadoModulos()
  await loadListadoTipo()
  await loadListadoCorreos()
  // await loadListadoPerfiles()
})


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
    const response = await sgdeaAxios.get("/flujos/conRoles");
    await sgdeaAxios.get("/notificaciones/modulos");

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
    const response = await sgdeaAxios.get("/notificaciones/tipo-notificacion");

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

async function loadListadoPerfiles(id) {
  try {
    const response = await sgdeaAxios.get(`/roles/flujo/${id}`)

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
      return option.label?.toLowerCase().includes(val.toLowerCase());
    });
  })
};

watch(() => formData.value.modulo, (newValue) => {
  loadListadoPerfiles(newValue);

  if (Number(newValue) == 5) {
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
  notificacionesSubmit.append('diaInicial', formData.value.cantidadDias);
  notificacionesSubmit.append('diaMaximo', formData.value.cantidadDiasMaximo);
  notificacionesSubmit.append('emailNotificacion', formData.value.correo);
  notificacionesSubmit.append('mensaje', formData.value.mensajes);
  notificacionesSubmit.append('rolId', formData.value.perfil);
  notificacionesSubmit.append('asunto', formData.value.asunto);
  if (Number(formData.value.modulo) == 5) {
    notificacionesSubmit.append('tipologiaId', formData.value.tipologia);
  }

  // @ts-expect-error
  notificacionesSubmit.append('activo', true);

  if (formData.value.files.length) {
    for (let i = 0; i < formData.value.files.length; i++) {
      notificacionesSubmit.append('files', formData.value.files[i]);
    }
  }

  try {
    await sgdeaAxios.post("/notificaciones/nueva", notificacionesSubmit)
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

const lengthValidation = (n, val: string) => val.length <= n || "Máximo " + n + " caracteres";

// Validación personalizada para el día máximo
const validateMaxDays = (maxValue) => {
  const minValue = parseInt(formData.value.cantidadDias);
  const maxIntValue = parseInt(maxValue);

  if (minValue && maxIntValue && maxIntValue <= minValue) {
    return `El dia máximo debe ser mayor que el dia inicial (${minValue}).`;
  }
  return true; // Si todo está bien, retorna `true`
};
</script>

<style lang="scss" scoped>
.input-code:focus {
  outline: none;
}
</style>
