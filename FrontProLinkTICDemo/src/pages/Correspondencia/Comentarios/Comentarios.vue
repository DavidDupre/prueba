<template>
  <div class="row justify-end">
    <q-btn color="secondary" v-if="!['Aprobado', 'Por publicar', 'Devolucion', 'Publicado', 'Por enviar', 'Enviado'].includes(detailsRadicado.estadoProceso.estado)" label="Agregar Comentario" dense no-caps @click="showCommentModal" />
  </div>
  <div v-if="comments.length">
    <div v-for="comment in comments">
      <q-card class="tw-rounded-xl tw-mt-4 tw-p-4" flat bordered>
        <div class="tw-flex tw-items-center tw-gap-4">
          <q-avatar color="primary" text-color="white">{{ comment.autor.nombre[0] }}</q-avatar>
          <div class="tw-w-full">
            <div class="tw-flex tw-justify-between tw-p-4">
              <div>
                <q-item-label class="tw-font-bold tw-text-xl">{{ comment.autor.nombre }} {{
                  comment.autor.role }}</q-item-label>
                <q-item-label class="tw-text-lg">{{ textDefault }}</q-item-label>
                <q-item-label class="tw-text-lg" caption>Etapa original: {{ comment.etapa
                  }}</q-item-label>
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
          <div class="tw-font-semibold tw-text-2xl tw-text-secondary" style="word-break: break-word;">
            Agregar Comentario
          </div>
          <br />
          <div class="bold tw-text-lg tw-text-secondary" style="word-break: break-word;">
            Escribe aquí notas con sugerencias o descripciones para que los demás colaboradores visualicen
          </div>
          <br />
          <span class="tw-w-full">
            <label class="tw-text-label">Escriba aquí sus comentarios ({{ comment.length }}/1000)</label>
            <q-input v-model="comment" input-debounce="0" color="secondary" outlined class="tw-rounded-lg"
              :rules="[v => maxLengthInput(1000, v)]"
              type="textarea" dense />
          </span>
          <div class="tw-flex tw-justify-center tw-gap-2 tw-mt-4">

            <q-btn color="accent" textColor="secondary" label="Cancelar"
              style="width: 250px; height: 45px; border-radius: 8px; font-size: 18px;" no-caps
              @click="closeCommentModal" />

            <q-btn color="secondary" label="Agregar"
              style="width: 250px; height: 45px; border-radius: 8px; font-size: 18px;" no-caps @click="addComment" />
          </div>
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
import { maxLengthInput } from "src/helpers/validations";

const props = defineProps<{
  textDefault: string,
  detailsRadicado: any
}>()

const emit = defineEmits(['update'])
const auth = useAuthStore()
const newComment = ref(false)
const showCommentModal = () => {
  comment.value = ''
  newComment.value = true;
}
const closeCommentModal = () => newComment.value = false;
let comments = ref([]);
let comment = ref('');

async function loadData() {
  try {
    const response = await sgdeaAxios.get('/trazabilidad/obtenerPorCodProceso/' + 'COR' + props.detailsRadicado.id)
    comments.value = response.data.filter(x => x.accion.includes('comentario')).map((item, index) => ({
      autor: {
        nombre: item.nombre,
        role: item?.tipoUser || ''
      },
      etapa: item.estado,
      comentario: item.comentario,
      fecha: moment(item.fechaHora).format('DD/MM/YYYY hh:mm A'),
      timesToAgo: moment(item.fechaHora).locale('es').fromNow(),
      id: item.id
    })).sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
  } catch (error) {
    console.error(error)
  }
}

async function addComment() {
  try {
    await crearTrazabilidad({
      proceso: `COR${props.detailsRadicado.id}`,
      secuencia: props.detailsRadicado.idRadicado,
      estado: props.detailsRadicado.estadoProceso.estado,
      descripcion: `Usuario: ${auth.$state.userInfo.name}` + `Comentario:${comment.value}`,
      comentario: comment.value,
      nombre: auth.$state.userInfo.name,
      accion: `${auth.$state.userInfo.name} ha hecho un comentario en el radicado`,
      tramite: props.detailsRadicado.tipoTramite.nombre,
    })
    comment.value = '';
    newComment.value = false;
    emit('update')
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  await loadData()
})

</script>
