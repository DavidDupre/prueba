<template>
    <div class="row justify-end">
      <q-btn color="secondary" v-if="!['Aprobado', 'Por publicar', 'Devolucion', 'Publicado', 'Por enviar', 'Enviado'].includes(detailsRadicado.estado)" label="Agregar Comentario" dense no-caps @click="modals.comment.toggle()" />
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
                  <!-- <q-item-label class="tw-text-lg">Agregar Comentario</q-item-label> -->
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
    <q-dialog v-model="modals.comment.status" persistent transition-show="scale" transition-hide="scale" transition-duration="300">
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
              <CommentTextArea v-model="form.comment.val":max-length="1000"
                    label="Escriba aquí sus comentarios" />
          </span>
          <div class="tw-flex tw-justify-center tw-gap-2 tw-mt-4">

            <q-btn color="accent" textColor="secondary" label="Cancelar"
              style="width: 250px; height: 45px; border-radius: 8px; font-size: 18px;" no-caps
              @click="cancelComment" />

            <q-btn color="secondary" label="Agregar"
              style="width: 250px; height: 45px; border-radius: 8px; font-size: 18px;" no-caps @click="addComment"/>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

  </template>

  <script lang="ts" setup>
  import { crearTrazabilidad } from 'src/helpers/trazabilidad';
  import { useAuthStore } from 'src/stores/auth.store';
  import { ref, reactive, onMounted } from 'vue';
  import { sgdeaAxios } from 'src/services';
  import { toast } from "src/helpers/toast";
  import moment from 'moment';
  import CommentTextArea from  "src/shared/components/TextArea/Comments.vue";


  const props = defineProps<{
    detailsRadicado: any
  }>()

  const emit = defineEmits(['update'])
  const auth = useAuthStore()
  let comments = ref([]);

  const modals = reactive({
    comment: {
      status: false,
      toggle: () => modals.comment.status = !modals.comment.status
    }
  });

  let form = reactive({
    comment: {
      val: '',
      ref: null,
    }
  })

  const getComments = () => {
      const url = `/trazabilidad/obtenerPorCodProceso/ENTC${props.detailsRadicado.id}`
      sgdeaAxios.get(url)
      .then((response)=>{
        comments.value = response.data
        .filter(x => x.accion == 'Se insertó comentario al trámite')
        .map((item, index) => ({
          autor: {
            nombre: item.nombre,
            role: item?.tipoUser || ''
          },
          etapa: item.estado,
          comentario: item.comentario,
          fecha: moment(item.fechaHora).format('DD/MM/YYYY HH:mm'),
          timesToAgo: moment(item.fechaHora).add(1, 'day').locale('es').fromNow(),
          id: item.id
        }))
        .sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
      })
  }

  const addTrazabilidad = () => {
    return crearTrazabilidad({
        proceso: `ENTC${props.detailsRadicado.id}`,
        secuencia: props.detailsRadicado.nroRadicado,
        estado: props.detailsRadicado.estado.estado,
        descripcion: `Usuario: ${auth.$state.userInfo.name}` + `Comentario: ${form.comment.val}`,
        comentario: form.comment.val,
        nombre: auth.$state.userInfo.name,
        accion: "Se insertó comentario al trámite",
        tramite: "Entes de Control",
    });
  }

  const cancelComment = () => {
    modals.comment.toggle();
    form.comment.val = '';
  }

  const addComment = () => {
    form.comment.ref?.validate();
    if(form.comment.ref?.hasError) {
      return toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos.");
    }

    addTrazabilidad().then(() => {
      toast.success("Nota ingresada correctamente al trámite");
      modals.comment.toggle();
      form.comment.val = '';
      getComments();
    })
  }

  onMounted(() => getComments())
  </script>
