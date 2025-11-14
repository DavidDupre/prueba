<template>
  <q-card>
    <q-expansion-item default-opened class="tw-mt-10">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Respuesta Escalamiento</h3>
      </template>
      <q-form ref="respuestaForm">
        <div class="row q-pb-md q-mx-md">

          <div class="col-12 tw-w-full">
            <span class="tw-text-label tw-ms-7">Respuesta de Escalamiento * </span>
            <q-field ref="fieldRef" v-model="form.respuesta" label-slot borderless
              :rules="[inputRequired, v => maxLengthInputForRich(9000, v)]">
              <template #control>
                <span class="tw-text-label text-weight-bold">Respuesta de Escalamiento * {{ form.respuesta.length }}/9000</span>
                <q-editor @paste="pasteCapture" ref="editorResp" v-model="form.respuesta" :toolbar="[]"
                  class="full-width" id="editorRich" style="cursor: auto" placeholder="Inserte"
                  :style="fieldRef && fieldRef.hasError ? 'border-color: var(--q-negative)' : ''" />
              </template>
            </q-field>
          </div>

          <div class="cols-12 tw-w-full">
            <span class="tw-text-label text-weight-bold">Adjuntar Soporte al Escalamiento</span>
            <FileLoader class="tw-p-0" :multiple="true" v-model:model-value="form.archivos"
              accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg" :max-file-size="50 * 1024 * 1024"
              :loading="fileLoading" :disable="fileDisable" max-file-size-label="50" :max-files="30"
              @rejected="rejectedFiles" />
          </div>
        </div>
      </q-form>
    </q-expansion-item>
  </q-card>
  <q-card>
    <section>
      <DocumentosRelacionados ref="docsRelacionados" :is-response="true" :activeAbsolute="true" :visualize="getBlobToIframe"
        @find-docs="getDocs" :detalle-tutela="detalleTutela" />
    </section>
  </q-card>
  <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
    <q-btn class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]" @click="cancelRespuesta" no-caps
      style="border: 1px solid #2c3948" label="Cancelar" />
    <q-btn class="tw-w-1/4 tw-h-11 bg-primary text-white" @click="submitRespuesta(1)" type="submit" label="Guardar" />
    <q-btn class="tw-w-1/4 tw-h-11 bg-secondary text-white" @click="validForm" type="submit" label="Enviar respuesta" />
  </div>
  <Modal v-model="confirmModal" title="Confirmación" :is-success="false" @handleAccept="submitRespuesta(2)"
    cancel-button text="¿Está seguro que desea enviar la respuesta del escalamiento?"
    @close-modal="confirmModal = false" textButtonCancel="No" text-button="Si" type="button" />
</template>

<script lang="ts" setup>
import Table from "src/components/Table.vue";
import FileLoader from 'src/components/FormFields/FileLoader.vue';
import { toast } from 'src/helpers/toast';
import { inputRequired, maxLengthInput, maxLengthInputForRich } from 'src/helpers/validations';
import { ref, onMounted, watch } from 'vue';
import DocumentosRelacionados from "../DocumentosRelacionados/DocumentosRelacionados.vue";
import { HEADER_DOCUMENTS } from '..';
import Modal from 'components/Modal/Modal.vue';
import { useAuthStore } from 'src/stores/auth.store';
import { intescoAxios, sgdeaAxios } from "src/services";
import service from "src/services/Api";
import { useRoute, useRouter } from "vue-router";
import { crearTrazabilidad } from 'src/helpers/trazabilidad';

const props = withDefaults(defineProps<{
  detalleTutela: any,
  listDocs: any
}>(), {
})

const router = useRouter();
const route = useRoute();
const confirmModal = ref()
const fileLoading = ref(false)
const fileDisable = ref(false)
const docsRelacionados = ref()
const respuestaForm = ref()
const countImgs = ref(0)
const editor = ref()
const fieldRef = ref()
const auth = useAuthStore()
const editorResp = ref()
const form = ref({
  respuesta: '',
  archivos: []
})

const pasteCapture = (paste) => {
  if (paste.clipboardData.getData('Text') == '') {
    if (countImgs.value == 6) {
      paste.preventDefault()
      paste.stopPropagation()
      toast.error('Máximo 6 recortes')
    }
  }else{
    if (paste.target.nodeName === 'INPUT') return
        let text, onPasteStripFormattingIEPaste
        paste.preventDefault()
        paste.stopPropagation()
        if (paste.originalEvent && paste.originalEvent.clipboardData.getData) {
          text = paste.originalEvent.clipboardData.getData('text/plain')
          editorResp.value.runCmd('insertText', text)
        }
        else if (paste.clipboardData && paste.clipboardData.getData) {
          text = paste.clipboardData.getData('text/plain')
          editorResp.value.runCmd('insertText', text)
        }
        else if (window.clipboardData && window.clipboardData.getData) {
          if (!onPasteStripFormattingIEPaste) {
            onPasteStripFormattingIEPaste = true
            editorResp.value.runCmd('ms-pasteTextOnly', text)
          }
          onPasteStripFormattingIEPaste = false
        }
  }
};

const contarImagenes =  () => {
  // Expresión regular para encontrar imágenes
  const regexImagenes = /<img\s+[^>]*>/g;

  // Buscar todas las coincidencias en el texto
  const coincidencias = form.value.respuesta.match(regexImagenes);

  // Si hay coincidencias, devolver la cantidad
  if (coincidencias) {
    countImgs.value = coincidencias.length
  }
}



const { getUserInfo } = useAuthStore();
const userInfo = ref()
const emit = defineEmits(['findDocs', 'sendVisual', 'cancelResp', 'resetTutela'])

onMounted(async () => {
  userInfo.value = await getUserInfo();
  validRespuestaGuardada()
  contarImagenes()
})

const getDocs = () => {
  emit('findDocs')
}

const getBlobToIframe = async (id) => {
  emit('sendVisual', id)
}

const validRespuestaGuardada = () => {
  var item = props.detalleTutela.usuarioEscalados.filter((it) => it.estado == 'Gestión escalamiento' && it.motivo != '')[0]
  if (item) {
    form.value.respuesta = item.motivo != null ? item.motivo : ''
  }

}

const validForm = async () => {
  if (await respuestaForm.value.validate()) {
    confirmModal.value = true
  }
}

const submitRespuesta = async (type) => {
  fileLoading.value = true
  fileDisable.value = true
  if (await respuestaForm.value.validate()) {
    const rechazarEscalamiento = await sgdeaAxios.post(`/tutela/${props.detalleTutela.idTutela}/tarea/escalamiento/respuesta`, {
      usuario: userInfo.value.username ? userInfo.value.username : 'indefinido',
      motivo: form.value.respuesta,
      guardar: type == 1 ? true : false
    });
    if (rechazarEscalamiento.status == 200) {
      submitFiles()
      if (type == 1) {
        toast.success('La respuesta se ha guardado con éxito')
      } else {
        const id = route.params.id
        const { data } = await sgdeaAxios.get(`/tutela/info/${id}`)
        await crearTrazabilidad({
            proceso: `TUT${data.idTutela}`,
            secuencia: data.idRadicado,
            estado: data.estado,
            descripcion: `Usuario: ${auth.$state.userInfo.name} \n` +
              `Motivo: ${form.value.respuesta}`,
            comentario: "Respuesta de escalamiento enviada",
            tramite: 'Tutela',
            nombre: auth.$state.userInfo.name,
            accion: `${auth.$state.userInfo.name} envió la respuesta de escalamiento`,
        })
        toast.success('El escalamiento se ha respondido con éxito')
      }

      confirmModal.value = false
      emit('resetTutela')
      if (type == 2) {
        router.push('/bandeja');
      }

    } else {
      fileLoading.value = false
      fileDisable.value = false
      toast.error('Ha ocurrido un error')
    }
  } else {
    fileLoading.value = false
    fileDisable.value = false
  }

}

const cancelRespuesta = () => {
  emit("cancelResp")
}

const submitFiles = () => {
  if (form.value.archivos.length > 0) {
    var data = {
      files: form.value.archivos,
      userId: userInfo.value.userid,
      tutelaId: props.detalleTutela.idTutela,
      tipo: 'De gestión '
    }
    service.subirArchivos(data)
      .then((resp) => {
        form.value.archivos = []
        fileLoading.value = false
        fileDisable.value = false
        if (resp.status == 200) {
          docsRelacionados.value.getDocuments()
        } else {
          fileLoading.value = false
          fileDisable.value = false
          toast.error('Hubo un error intente de nuevo')
        }
      })
  } else {
    fileLoading.value = false
    fileDisable.value = false
  }

}

watch(() => form.value.respuesta, (newOffice) => {
  // @ts-ignore
  contarImagenes();
});

const rejectedFiles = (error) => {
  if (error.some((it) => it.failedPropValidation === 'max-file-size')) {
    toast.error('El peso permitido es hasta 50MB.')
  }
  if (error.some((it) => it.failedPropValidation === 'max-files')) {
    toast.error('Solo se pueden adjuntar 30 archivos.')

  }

  if (error.some((it) => it.failedPropValidation === 'accept')) {
    toast.error('Formato inválido, los formatos permitidos son (pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg).')
  }
}


</script>
