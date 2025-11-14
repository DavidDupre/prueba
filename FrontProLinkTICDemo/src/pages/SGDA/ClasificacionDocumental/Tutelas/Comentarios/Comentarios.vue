<template>
    <template>
        <q-dialog v-model="open" persistent transition-show="scale" transition-hide="scale" transition-duration="300">
            <q-card class="dialog tw-p-4">
                <q-card-section class="tw-bg-white">
                    <q-form ref="comentariosRef" class="[&>*]:tw-mb-4">
                        <div class="tw-font-semibold tw-text-2xl tw-text-secondary" style="word-break: break-word;">
                            Agregar Comentario
                        </div>
                        <br />
                        <div class="bold tw-text-lg tw-text-secondary" style="word-break: break-word;">
                            Escriba aquí notas con sugerencias o descripciones para que los demás colaboradores
                            visualicen
                        </div>
                        <br />
                        <span class="tw-w-full">
                            <label class="tw-text-label">Escriba aquí sus comentarios {{ comment.length }}/1000</label>
                            <q-input v-model="comment" input-debounce="0" color="secondary" outlined
                                class="tw-rounded-lg" type="textarea" dense
                                :rules="[v => maxLengthInput(1000, v), inputRequired]" />
                        </span>
                        <div class="tw-flex tw-justify-center tw-gap-2 tw-mt-4">

                            <q-btn color="accent" textColor="secondary" label="Cancelar"
                                style="width: 250px; height: 45px; border-radius: 8px; font-size: 18px;" no-caps
                                @click="closeCommentModal2" />

                            <q-btn color="secondary" label="Agregar"
                                style="width: 250px; height: 45px; border-radius: 8px; font-size: 18px;" no-caps
                                @click="addComment" />
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>
    </template>
    <div class="row justify-end">
        <q-btn color="secondary"
            v-if="!['Aprobado', 'Por publicar', 'Devolucion', 'Publicado', 'Por enviar', 'Enviado'].includes(dataTutela.estado)"
            label="Agregar Comentario" dense no-caps @click="showCommentModal2" />
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
                                <q-item-label class="tw-text-lg" caption>Estado: {{ comment.etapa }}</q-item-label>
                            </div>
                            <p class="tw-text-xl tw-font-bold tw-text-gray-dark">{{ comment.fecha }}</p>
                        </div>
                        <p class="tw-text-gray-dark tw-text-xl tw-px-4">"{{ comment.comentario }}"</p>
                    </div>
                </div>
            </q-card>
        </div>
    </div>
    <!-- <template v-if="newComment">
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
                    <span class="tw-w-full">
                        <label class="tw-text-label">Escriba aquí sus comentarios</label>
                        <q-input :rules="[inputRequired, v => maxLengthInput(5000, v)]" v-model="comment" input-debounce="0" color="secondary" outlined class="tw-rounded-lg"
                            type="textarea" dense />
                    </span>
                    <div class="tw-flex tw-justify-center tw-gap-2 tw-mt-4">

                        <q-btn color="accent" textColor="secondary" label="Cancelar"
                            style="width: 250px; height: 45px; border-radius: 8px; font-size: 18px;" no-caps
                            @click="closeCommentModal" />

                        <q-btn color="secondary" label="Agregar"
                            style="width: 250px; height: 45px; border-radius: 8px; font-size: 18px;" no-caps
                            @click="addComment" />

                    </div>
                  </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>
    </template> -->
</template>

<script lang="ts" setup>
import moment from 'moment';
import { crearTrazabilidad } from 'src/helpers/trazabilidad';
import { sgdeaAxios } from 'src/services';
import { useAuthStore } from 'src/stores/auth.store';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { alphanumeric, inputRequired, maxLengthInput, nonRequiredAlphanumeric, onlyNumbers, alphanumericAbsolute } from "src/helpers/validations";
import { toast } from 'src/helpers/toast';
const comentarioForm = ref()

const props = defineProps<{
    textDefault: string,
    idDetalle: any
}>()

const emit = defineEmits(['update'])
const route = useRoute()
const auth = useAuthStore()
const newComment = ref(false)

const showCommentModal = () => newComment.value = true;
const closeCommentModal = () => newComment.value = false;
const closeCommentModal2 = () => {
    comment.value = ''
    open.value = false;
}
const dataTutela = ref<any>({})
const open = ref(false)
const showCommentModal2 = () => open.value = true;
const comentariosRef = ref()

// let autor = {
//     nombre: 'Carolina Durán',
//     role: 'Gestor'
// }

let comments = ref([
    // {
    //     autor,
    //     etapa: 'En proceso',
    //     comentario: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus, doloribus esse! Corporis consequuntur nobis cumque eligendi minus laudantium ut nemo at! Nam eos adipisci dolores corporis tenetur blanditiis deserunt excepturi!"

    // }
]);

let comment = ref('');

async function addComment() {
    if (await comentariosRef.value.validate()) {
        try {
            await crearTrazabilidad({
                proceso: `TUT${dataTutela.value.idTutela}`,
                secuencia: dataTutela.value.idRadicado,
                estado: dataTutela.value.estado,
                nombre: auth.$state.userInfo.name,
                comentario: comment.value,
                descripcion: "Insertó comentario al trámite",
                accion: `${auth.$state.userInfo.name} ha comentado sobre el radicado`,
                tramite: "Tutela"

            })
            comment.value = '';
            open.value = false;
            toast.success('Nota ingresada correctamente al trámite')
            const { data } = await sgdeaAxios.get(`/tutela/info/${props.idDetalle}`)
            dataTutela.value = { ...data }
            const response = await sgdeaAxios.get('/trazabilidad/obtenerPorCodProceso/' + 'TUT' + data.idTutela);

            comments.value = response.data.filter(x => x.descripcion == 'Insertó comentario al trámite').map((item, index) => ({
                autor: {
                    nombre: item.nombre,
                    role: item?.tipoUser || ''
                },
                etapa: item.estado,
                comentario: item.comentario,
                fecha: moment(item.fechaHora).format('DD/MM/YYYY HH:mm'),
                timesToAgo: moment(item.fechaHora).add(1, 'day').locale('es').fromNow(),
                id: item.id
            })).sort((a, b) => b.id - a.id);
            emit('update')
        } catch (error) {
            console.error(error);
        }
    }
}

onMounted(async () => {
    const { data } = await sgdeaAxios.get(`/tutela/info/${props.idDetalle}`)
    dataTutela.value = { ...data }
    const response = await sgdeaAxios.get('/trazabilidad/obtenerPorCodProceso/' + 'TUT' + data.idTutela);

    comments.value = response.data.filter(x => x.descripcion == 'Insertó comentario al trámite').map((item, index) => ({
        autor: {
            nombre: item.nombre,
            role: item?.tipoUser || ''
        },
        etapa: item.estado,
        comentario: item.comentario,
        fecha: moment(item.fechaHora).format('DD/MM/YYYY HH:mm'),
        timesToAgo: moment(item.fechaHora).add(1, 'day').locale('es').fromNow(),
        id: item.id
    })).sort((a, b) => b.id - a.id);
})


</script>
