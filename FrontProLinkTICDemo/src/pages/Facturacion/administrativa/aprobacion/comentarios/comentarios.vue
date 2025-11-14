<template>
  <div class="row justify-end">
    <q-btn
      color="secondary"
      label="Registar comentario"
      dense
      no-caps
      @click="showCommentModal"
    />
  </div>
  <div v-if="comments.length">
    <div v-for="comment in comments">
      <q-card class="tw-rounded-xl tw-mt-4 tw-p-4" flat bordered>
        <div class="tw-flex tw-items-center tw-gap-4">
          <q-avatar color="primary" text-color="white">{{
            comment.autor.nombre[0]
          }}</q-avatar>
          <div class="tw-w-full">
            <div class="tw-flex tw-justify-between tw-p-4">
              <div>
                <q-item-label class="tw-font-bold tw-text-xl"
                  >{{ comment.autor.nombre }}
                  {{ comment.autor.role }}</q-item-label
                >
                <q-item-label class="tw-text-lg">{{
                  textDefault
                }}</q-item-label>
                <q-item-label class="tw-text-lg" caption
                  >Etapa original: {{ comment.etapa }}</q-item-label
                >
              </div>
              <p class="tw-text-xl tw-font-bold tw-text-gray-dark">
                {{ comment.fecha }}
              </p>
            </div>
            <p class="tw-text-gray-dark tw-text-xl tw-px-4">
              "{{ comment.comentario }}"
            </p>
          </div>
        </div>
      </q-card>
    </div>
  </div>
  <template v-if="newComment">
    <q-dialog
      v-model="newComment"
      persistent
      transition-show="scale"
      transition-hide="scale"
      transition-duration="300"
    >
      <q-card class="dialog tw-p-4">
        <q-card-section class="tw-bg-white">
          <div
            class="tw-font-semibold tw-text-2xl tw-text-secondary"
            style="word-break: break-word"
          >
            Registar comentario
          </div>
          <br />
          <div
            class="bold tw-text-lg tw-text-secondary"
            style="word-break: break-word"
          >
            Escribe aquí notas con sugerencias o descripciones para que los
            demás colaboradores visualicen
          </div>
          <br />
          <span class="tw-w-full">
            <CommentTextArea v-model="comment" :is-required="false" :max-length="1000" label="Escriba aquí sus comentarios"/>
          </span>
          <div class="tw-flex tw-justify-center tw-gap-2 tw-mt-4">
            <q-btn
              color="accent"
              textColor="secondary"
              label="Cancelar"
              style="
                width: 250px;
                height: 45px;
                border-radius: 8px;
                font-size: 18px;
              "
              no-caps
              @click="closeCommentModal"
            />
            <q-btn
              color="secondary"
              label="Agregar"
              style="
                width: 250px;
                height: 45px;
                border-radius: 8px;
                font-size: 18px;
              "
              no-caps
              @click="addComment"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </template>
</template>

<script lang="ts" setup>
import moment from "moment";
import { toast } from "src/helpers/toast";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import { ref, onMounted } from "vue";
import { maxLengthInput } from "src/helpers/validations";
import CommentTextArea from  "src/shared/components/TextArea/Comments.vue";


const props = defineProps<{
  textDefault: string;
  facData: any;
}>();

const emit = defineEmits(["update"]);
const auth = useAuthStore();
const newComment = ref(false);
const showCommentModal = () => (newComment.value = true);
const closeCommentModal = () => (newComment.value = false);
let comments = ref([]);
let comment = ref("");

onMounted(async () => {
  await loadData();
});

async function loadData() {
  try {
    const response = await sgdeaAxios.get(
      "/trazabilidad/obtenerPorCodProceso/" + "FAC" + props.facData.idFactura
    );
    comments.value = response.data
      .filter((x) => x.descripcion == "Inserto comentario al trámite")
      .map((item, index) => ({
        autor: {
          nombre: item.nombre,
          role: item?.tipoUser || "",
        },
        etapa: item.estado,
        comentario: item.comentario,
        fecha: moment(item.fechaHora)
          .subtract(5, "hours")
          .format("DD/MM/YYYY HH:mm"),
        timesToAgo: moment(item.fechaHora).add(1, "day").locale("es").fromNow(),
      }))
      .sort((a: { id: number }, b: { id: number }) => b.id - a.id);
  } catch (error) {
    console.error(error);
  }
}

async function addComment() {
  try {
    await crearTrazabilidad({
      proceso: "FAC" + props.facData.idFactura,
      secuencia: props.facData.sec,
      estado: props.facData.estado.toLowerCase(),
      descripcion: "Inserto comentario al trámite",
      comentario: comment.value,
      nombre: auth.$state.userInfo.name,
      tramite: props.facData.sec,
      accion: "Se registró un nuevo comentario",
    });

    comment.value = "";
    newComment.value = false;
    toast.success("Nota ingresada correctamente al trámite");
    loadData();
    emit("update");
  } catch (error) {
    console.error(error);
  }
}
</script>
