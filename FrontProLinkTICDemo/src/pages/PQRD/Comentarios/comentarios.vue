<template>
  <div v-if="!onlyReadUser" class="row justify-end">
    <q-btn color="secondary" label="Agregar comentario" dense no-caps @click="showCommentModal"
    v-if="!['Aprobado', 'Por publicar', 'Devolucion', 'Publicado', 'Por enviar', 'Enviado'].includes(pqrdData.estado)" />
  </div>
  <div v-if="comments.length">
    <div v-for="comment in comments">
      <q-card class="tw-rounded-xl tw-mt-4 tw-p-4" flat bordered>
        <div class="tw-flex tw-items-center tw-gap-4">
          <q-avatar color="primary" text-color="white">{{ comment.autor.nombre[0] }}</q-avatar>
          <div class="tw-w-full">
            <div class="tw-flex tw-justify-between tw-p-4">
              <div>
                <q-item-label class="tw-font-bold tw-text-xl">
                  {{ comment.autor.nombre }}
                  {{ comment.autor.role }}
                </q-item-label>
                <q-item-label class="tw-text-lg" caption>Etapa original: {{ comment.etapa }}</q-item-label>
              </div>
              <p class="tw-text-xl tw-font-bold tw-text-gray-dark">{{ comment.fecha }}</p>
            </div>
            <p class="tw-text-gray-dark tw-text-xl tw-px-4">"{{ comment.comentario }}"</p>
          </div>
        </div>
      </q-card>
    </div>
  </div>
  <template v-if="newComment">
    <q-dialog v-model="newComment" persistent transition-show="scale" transition-hide="scale" transition-duration="300">
      <q-card class="dialog tw-p-4">
        <q-card-section class="tw-bg-white">
          <q-form ref="comentarioForm">
            <div class="tw-font-semibold tw-text-2xl tw-text-secondary" style="word-break: break-word;">
              Agregar comentario
            </div>
            <br />
            <div class="bold tw-text-lg tw-text-secondary" style="word-break: break-word;">
              Escribe aquí notas con sugerencias o descripciones para que los demás colaboradores visualicen
            </div>
            <br />

            <CommentTextArea v-model="comment" :is-required="true" :max-length="1000" label="Escriba aquí sus comentarios"/>
            <div class="tw-flex tw-justify-center tw-gap-2 tw-mt-4">

              <q-btn color="accent" textColor="secondary" label="Cancelar"
                style="width: 250px; height: 45px; border-radius: 8px; font-size: 18px;" no-caps
                @click="closeCommentModal" />

              <q-btn color="secondary" label="Agregar"
                style="width: 250px; height: 45px; border-radius: 8px; font-size: 18px;" no-caps @click="addComment" />

            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </template>
</template>

<script lang="ts" setup>
import moment from 'moment';
import { crearTrazabilidad } from 'src/helpers/trazabilidad';
import { sgdeaAxios } from 'src/services';
import { useAuthStore } from 'src/stores/auth.store';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { inputRequired, maxLengthInput } from "src/helpers/validations";
import { toast } from 'src/helpers/toast';
import CommentTextArea from  "src/shared/components/TextArea/Comments.vue";

const props = withDefaults(defineProps<{
  pqrdData: any,
  onlyReadUser: boolean
}>(), {
  onlyReadUser: false
})

const emit = defineEmits(['update'])

let comment = ref('');
let comments = ref([]);
const route = useRoute()
const auth = useAuthStore()
const newComment = ref(false)
const showCommentModal = () => {
  comment.value = ''
  newComment.value = true;
}
const closeCommentModal = () => newComment.value = false;

const comentarioForm = ref()

async function loadData() {
  try {
    const response = await sgdeaAxios.get('/trazabilidad/obtenerPorCodProceso/' + 'PQRD' + props.pqrdData.id);
    comments.value = response.data.filter(x => x.accion.includes('comentario')).map((item, index) => ({
      autor: {
        nombre: item.nombre,
        role: item?.tipoUser || ''
      },
      etapa: item.estado,
      comentario: item.comentario,
      fecha: moment(item.fechaHora).format('DD/MM/YYYY HH:mm'),
      timesToAgo: moment(item.fechaHora).add(1, 'day').locale('es').fromNow(),
      id: item.id
    })).sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
  } catch (error) {
    console.error(error);
  }
}

async function addComment() {
  if (!(await comentarioForm.value.validate())) {
    return
  }
  try {
    await crearTrazabilidad({
      proceso: `PQRD${route.params.id}`,
      secuencia: props.pqrdData.idRadicado,
      estado: props.pqrdData.estado.estado,
      descripcion: `Usuario: ${auth.$state.userInfo.name}` + `Comentario:${comment.value}`,
      comentario: comment.value,
      nombre: auth.$state.userInfo.name,
      accion: `${auth.$state.userInfo.name} ha hecho un comentario en la PQRD`,
      tramite: props.pqrdData.informacionSolicitud?.tipologiaEntity?.id == 7 ? 'PQRD Express' : 'PQRD',
    })
    comment.value = '';
    newComment.value = false;
    emit('update')
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  await loadData()
})

</script>
