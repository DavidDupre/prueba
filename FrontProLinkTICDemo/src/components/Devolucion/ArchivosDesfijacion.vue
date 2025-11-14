<template>
    <div>

        <q-card class="tw-rounded-lg tw-px-7 tw-mb-[80px]" flat>

            <q-form ref="createForm" class="tw-h-full">
                <div class="pl-4 tw-font-bold tw-text-xl tw-my-5 text-bold">
                    Adjuntar Documento
                </div>
                <div>
                    <p class="tw-text-label">Adjuntar archivo Acta de Desfijación</p>
                    <FileLoader class="tw-w-full" v-model:model-value="form.archivos" accept-file="pdf"
                        :rules="[inputRequired]" :max-file-size="100 * 1024 * 1024" max-file-size-label="10"
                        :max-files="3" :multiple="true" @rejected="rejectedFiles" />
                </div>

                <div class="tw-flex tw-full q-col-gutter-md">
                    <div class="tw-w-1/2">
                        <label for="code" class="tw-text-label">Número de Acta </label>
                        <q-input outlined v-model="form.numeroActa" label="Inserte" dense
                            :rules="[alphanumeric, v => maxLengthInput(10, v), inputRequired]" />
                    </div>
                    <div class="tw-w-1/2">
                        <p class="tw-text-label">Fecha de Acta *</p>
                        <Datepicker mask="DD/MM/YYYY" label="dd / mm / aaaa" :options="optionsDateFunc"
                            v-model:input-data-prop="form.fecha" @valida-fecha="emitValidation" :rules="[inputRequired]"
                            :error-message="'Debe seleccionar una fecha válida'" />
                    </div>
                </div>

                <p class="tw-text-label">Observación * {{ form.observacion.length }}/10000</p>
                <q-input outlined v-model="form.observacion" label="Inserte" class="" type="textarea" dense :rules="[v => maxLengthInput(10000, v),
                        inputRequired, (v) => minLengthInput(10, v)]" />

                <div class="tw-flex tw-justify-center tw-p-10 q-gutter-x-md">
                    <q-btn label="Cancelar" style="width: 240px;height: 40px;" text-color="black" color="accent"
                        class="tw-rounded-xl" @click="cancelModal = true" />
                    <q-btn label="Aceptar" :loading="loadingRadicar" @click="uploadFiles" text-color="white"
                        style="width: 240px;height: 40px;" color="primary" class="tw-rounded-xl tw-btn tw-p-2" />
                </div>

            </q-form>
        </q-card>


        <Modal v-model="cancelModal" title="¡Espera un momento!" :is-success="false" text-button="Si"
            text-button-cancel="No" @handleAccept="clear" cancel-button
            text="Al cancelar la acción perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
            @close-modal="cancelModal = false" type="button" />
        <Modal v-model="showModal" title="Radicación exitosa" :text="text" is-success text-button="Finalizar"
            @handleAccept="clear" cancel-button text-button-cancel="Descargar" @close-modal="handleModal" />
        <Modal v-model="errorModal" title="Error" text="¡Ha ocurrido un error!" :is-success="false"
            text-button="Aceptar" @handleAccept="handleModal" />
    </div>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FileLoader from 'src/components/FormFields/FileLoader.vue'
import Modal from 'components/Modal/Modal.vue';
import Datepicker from 'components/FormFields/datePickerComponent.vue';
import {
    alphanumeric,
    maxLengthInput,
    inputRequired,
    minLengthInput,
} from 'src/helpers/validations';
import moment from "moment/moment";
import { sgdeaAxios } from 'src/services';
import { crearTrazabilidad } from 'src/helpers/trazabilidad';
import { useAuthStore } from "src/stores/auth.store";
import { toast } from "src/helpers/toast";

const MAX_FILE = 3

const auth = useAuthStore()
const q = useQuasar();
const route = useRoute()
const router = useRouter()

function optionsDateFunc(date) {
    return date <= moment().format('YYYY/MM/DD')
}

const props = withDefaults(defineProps<{
    detallesRegistro: any,
    type: any
}>(), {})

const showModal = ref(false);
const errorModal = ref(false);
const createForm = ref();
const confirmModal = ref(false)
const cancelModal = ref(false)
const text = ref('')
const loadingRadicar = ref(false)

const form = ref({
    numeroActa: '',
    fecha: moment().format('DD/MM/YYYY'),
    archivos: [],
    observacion: ''
});

// const { optionsJuzgados } = useNewJuzgados()
const optionsJuzgados = ref([]);
const opCodeJuz = ref([])
const optionsCode = ref()
onMounted(async () => {
})

const uploadFiles = async () => {
    if (await createForm.value.validate()) {
        if (props.type == 'tutelas') {
            const files = form.value.archivos
            const formdata = new FormData()
            try {
                for (const file of files) {
                    formdata.append('files', file)
                }
                const response = await sgdeaAxios.post(`/tutela/${props.detallesRegistro.idTutela}/${auth.$state.userInfo.userid}/De salida/archivos/subir?es_devolucion=false`, formdata,
                    {
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "accept": "*",
                            "Content-Type": "multipart/form-data",
                            "Content-Transfer-Encoding": "BINARY"
                        }
                    })
                if (response.status === 200) {
                    const nodesId = response.data.map(item => item.nodeId).join(", ");
                    const adjuntarActa = await sgdeaAxios.post(`publicacion/actas/tutelas`, {
                        nodeId: nodesId,
                        numeroActa: form.value.numeroActa,
                        fechaActa: moment(form.value.fecha, 'DD/MM/YYYY').format('YYYY-MM-DD') + "T00:00:00",
                        observacion: form.value.observacion,
                        procesoId: props.detallesRegistro.idTutela
                    });
                    if (adjuntarActa.status == 200) {
                        toast.success('Acta adjuntada con éxito')
                    }
                }
            } catch (error) {
                toast.error('Ha ocurrido un error')
            }
        }

        if (props.type == 'pqrd') {
            const files = form.value.archivos

            const formData = new FormData();
            for (const file of Array.isArray(files) ? files : [files]) {
                formData.append("anexos", file);
            }

            formData.append("idRadicado", props.detallesRegistro.nodeID);
            formData.append("descripcionRadicado", 'De salida');
            formData.append("usuarioId", auth.$state.userInfo.userid)
            try {
                const { data } = await sgdeaAxios.post("/api/v1/integracion/alfresco/agregarAnexos?es_devolucion=true", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    params: {
                        pqrd: route.params.id,
                    }
                });


                if (data) {
                    const adjuntarActa = await sgdeaAxios.post(`publicacion/actas/pqrd`, {
                        id: auth.$state.userInfo.userid,
                        nodeId: data.nodo,
                        numeroActa: form.value.numeroActa,
                        fechaActa: moment(form.value.fecha, 'DD/MM/YYYY').format('YYYY-MM-DD') + "T00:00:00",
                        observacion: form.value.observacion,
                        procesoId: props.detallesRegistro.id
                    });
                    if (adjuntarActa.status == 200) {
                        toast.success('Acta adjuntada con éxito')
                    }
                    // await crearTrazabilidad({
                    //     proceso: "PQRD" + props.detallePqrd.id,
                    //     secuencia: props.detallePqrd.idRadicado,
                    //     estado: props.detallePqrd.estado.estado,
                    //     descripcion: "Se ha adjuntado un documento a la PQRD",
                    //     comentario: 'Adjunto',
                    //     nombre: auth.$state.userInfo.name,
                    //     accion: `${auth.$state.userInfo.name} añadió un documento a la PQRD`,
                    //     tramite: props.detallePqrd.informacionSolicitud.tipologiaEntity.id == 7 ? 'PQRD Express' : 'PQRD',
                    // })
                }
            } catch (error) {
                // toast.error("Está intentando cargar el mismo archivo más de una vez")
            }
        }

        if (props.type == 'correspondencia') {
            const id = props.detallesRegistro.id
            const files = form.value.archivos
            const formdata = new FormData();
            for (let i = 0; i < files.length; i++) {
                formdata.append("files", files[i]);
            }

            try {
                const { data } = await sgdeaAxios.post(`correspondencia/documentos/${id}?user=${auth.$state.userInfo.userid}&tipoDocumento=SALIDA`, formdata)
                const duplicateFiles = data.filter(it => it.message?.includes('already exists'))

                for (let i = 0; i < duplicateFiles.length; i++) {
                    toast.error(`el archivo "${duplicateFiles[i].name}" se encuentra duplicado`)
                }

                if (data) {
                    const adjuntarActa = await sgdeaAxios.post(`publicacion/actas/correspondencia`, {
                        id: auth.$state.userInfo.userid,
                        nodeId: data[data.length - 1].id,
                        numeroActa: form.value.numeroActa,
                        fechaActa: moment(form.value.fecha, 'DD/MM/YYYY').format('YYYY-MM-DD') + "T00:00:00",
                        observacion: form.value.observacion,
                        procesoId: props.detallesRegistro.id
                    });

                    if (adjuntarActa.status == 200) {
                        toast.success('Acta adjuntada con éxito')
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }

    } else {

    }
}




const rejectedFiles = (error) => {
    if (error.some((it) => it.failedPropValidation === 'max-file-size')) {
        toast.error('El peso permitido es hasta 10MB.')
    }
    if (error.some((it) => it.failedPropValidation === 'max-files')) {
        toast.error(`Solo se pueden adjuntar ${MAX_FILE} archivos.`)
    }
    if (error.some((it) => it.failedPropValidation === 'accept')) {
        toast.error('Formato inválido, los formatos permitidos son (pdf).')
    }
}



</script>

<style lang="scss"></style>
