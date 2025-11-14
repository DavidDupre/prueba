<template>
    <div>
        <q-expansion-item default-opened dense expand-separator
            class="tw-bg-white q-mt-md" style="border-radius: 5px">
            <template v-slot:header>
                <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
                    Información general
                </h3>
            </template>
            <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Tipo de Solicitud</p>
                    <p>{{detailsRadicado?.tipoComunicacion?.nombre || ''}}</p>
                </div>

                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Nombre Afectado</p>
                    <p>{{detailsRadicado?.datosSalida?.nombreAfectado || ''}}</p>
                </div>
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Colaborador</p>
                    <p>{{ detailsRadicado?.usuarioCreador?.fullname || ''}}</p>
                </div>
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Fecha de Radicación</p>
                    <p>{{ formateFechaDEradicado }}</p>
                </div>
            </q-card>
        </q-expansion-item>

        <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
            <template v-slot:header>
                <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
                    Tipo de comunicación
                </h3>
            </template>
            <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Canal de recepción</p>
                    <p>Ventanilla</p>
                </div>
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Tipo de trámite</p>
                    <p>{{ (detailsRadicado && detailsRadicado?.tipoTramite && detailsRadicado.tipoTramite.nombre) ?
                        detailsRadicado?.tipoTramite.nombre : '' }}</p>
                </div>
            </q-card>
        </q-expansion-item>

        <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
            <template v-slot:header>
                <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
                    Remitente
                </h3>
            </template>
            <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Tipo de documento</p>
                    {{
                        detailsRadicado?.datosSalida?.tipoDocumentoDestinatario?.nombre || ''
                    }}
                </div>
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Número de documento</p>
                    <p>{{ detailsRadicado?.datosSalida?.numeroDocumentoDestinatario || ''}}</p>
                </div>
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Nombre</p>
                    <p>{{ detailsRadicado?.datosSalida?.nombreDestinatario || ''}}</p>
                </div>

            </q-card>
        </q-expansion-item>

        <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
            <template v-slot:header>
                <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
                    Afectado
                </h3>
            </template>
            <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Tipo de documento</p>
                    <p>{{ detailsRadicado?.datosSalida?.tipoDocumentoAfectado || '' }}</p>
                </div>
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Número de documento</p>
                    <p>{{ detailsRadicado?.datosSalida?.numeroDocumentoAfectado|| '' }}</p>
                </div>
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Nombre</p>
                    <p>{{detailsRadicado?.datosSalida?.nombreAfectado|| ''}}</p>
                </div>
            </q-card>
        </q-expansion-item>

        <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
            <template v-slot:header>
                <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
                    Medios de contacto y envío de respuesta
                </h3>
            </template>
            <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Correo electrónico</p>
                    <p class="break-all">{{detailsRadicado.datosSalida?.correoDestinatario || ''}}</p>
                </div>
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Teléfono fijo</p>
                    <p>{{ detailsRadicado.datosSalida?.telefonoDestinatario || ''}}</p>
                </div>
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">País</p>
                    <p>{{ detailsRadicado.datosSalida?.pais?.nombre || ''}}</p>
                </div>
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Departamento</p>
                    <p>{{ detailsRadicado.datosSalida?.departamento?.nombre || ''}}</p>
                </div>
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Municipio</p>
                    <p>{{ detailsRadicado.datosSalida?.municipio?.nombre || ''}}</p>
                </div>
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Dirección</p>
                    <p class="break-all">{{ detailsRadicado.datosSalida?.direccionDestinatario || ''}}</p>
                </div>
            </q-card>
        </q-expansion-item>


        <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px"
            v-if="true">
            <template v-slot:header>
                <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
                    Documentos
                </h3>
            </template>
            <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
                <div class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
                    <h5 class="text-bold tw-text-l tw-flex-1 q-py-md">
                        Documentos de Entrada
                    </h5>
                    <div class="column q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
                        <q-card class="row items-center tw-gap-x-2 q-px-md q-py-sm tw-w-fit" flat bordered :key="doc.id"
                            v-for="doc in listDocs2">
                            <img style="width: 26px" v-lazy :data-url="validateFormat(obtenerExtension(doc.nombre))" />
                            <p class="tw-text-sm tw-font-semibold">{{ doc.nombre }}</p>
                            <q-icon
                                v-if="doc.nombre.toLowerCase().substring(doc.nombre.length - 4, doc.nombre.length) === '.pdf'"
                                size="20px" class="tw-text-[#6B737C] tw-cursor-pointer" name="error_outline"
                                @click="visualize(doc.nodeId, listDocs2.filter(it => obtenerExtension(it.nombre).toLowerCase() === 'pdf'))" />
                            <q-icon size="20px" class="tw-text-[#6B737C] tw-cursor-pointer" name="file_download"
                                @click="() => handleOpenDocFile(doc.nodeId, doc.nombre)" />
                        </q-card>
                    </div>
                </div>
            </q-card>
        </q-expansion-item>
    </div>
</template>

<script lang="ts" setup>
import moment from "moment";
// @ts-ignore
import PDFIcon from "src/assets/pdf.svg";
// @ts-ignore
import excelIcon from "src/assets/excel.svg";
// @ts-ignore
import docxIcon from 'src/assets/word.svg';
import img from "src/assets/img.svg";
// @ts-ignore
import music from "src/assets/music.svg";
// @ts-ignore
import video from "src/assets/video.svg";
// @ts-ignore
import txt from "src/assets/txt.svg";
import zip from "assets/folder2.svg";
import msg from "assets/mail.svg";
import ppt from "assets/powerPoint.svg";
import xml from "assets/xml.svg";
import interrogation from "assets/interrogation.svg";
import { computed, onMounted, Ref, ref, watch } from "vue";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import { SelectInput } from "src/interfaces";
import { useCountries2, useDepartments, useMunicipalities } from "src/composables/useVersion";

const auth = useAuthStore()
const emit = defineEmits(['valid'])
const props = withDefaults(defineProps<{
    listDocs: any[],
    listDocs2: any[],
    listDocs3: any[],
    download: (id: any) => Promise<void>,
    visualize: (nodeId, listDoc) => {},
    detailsRadicado: any,
    detailsAsignaciones: any,
    tiempoVencer: string,
    isAprobador: boolean,
    isRevisor: boolean,
    isDevolucion: boolean,
    status: string,
    colaborador: any[]
}>(), {
    status: ""
})

const isntColombia = ref<boolean>(false)
const opsCoutry: Ref<SelectInput[]> = ref([])
const opsDep: Ref<SelectInput[]> = ref([])
const opsMuni: Ref<SelectInput[]> = ref([])

const form = ref({
    tipoRemitente: '',
    canal: '',
    tipoTramite: '',
    tipoDocumentoRemi: '',
    numRemi: '',
    nameRemi: '',
    tipoDocumentoAfec: '',
    numAfectado: '',
    nameAfectado: '',
    emailAfectado: '',
    telefono: '',
    pais: { label: '', value: null },
    dep: { label: '', value: null },
    muni: { label: '', value: null },
    direccionAfectado: ''
})

const formateFechaDEradicado = computed(() => moment(props.detailsRadicado?.fechaRadicacion).format('DD/MM/YYYY HH:mm'))

const validateFormat = (formato) => {
    if (['pdf', 'application/pdf'].includes(formato.toLowerCase())) return PDFIcon
    if (['xls', 'xlsx', 'csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(formato.toLowerCase())) return excelIcon
    if (['docx', 'doc', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(formato.toLowerCase())) return docxIcon
    if (['jpeg', 'jpg', 'png', 'webp'].includes(formato.toLowerCase())) return img
    if (['mp3'].includes(formato.toLowerCase())) return music
    if (['avi', 'mp4'].includes(formato.toLowerCase())) return video
    if (['txt', 'bmp'].includes(formato.toLowerCase())) return txt
    if (['xml'].includes(formato.toLowerCase())) return xml
    if (['zip', 'rar'].includes(formato.toLowerCase())) return zip
    if (['ppt', 'pptx'].includes(formato.toLowerCase())) return ppt
    if (['msg', 'eml'].includes(formato.toLowerCase())) return msg
    return interrogation;
}

const obtenerExtension = (nombreArchivo) => {
    const punto = nombreArchivo.lastIndexOf('.');
    if (punto === -1) return '';
    return nombreArchivo.slice(punto + 1);
}

const handleOpenDocFile = async (id: string, name: string) => {
    try {
        const response = await sgdeaAxios.get('/radicados/consultar_documento/' + id);

        const byteCharacters = atob(response.data.base64x);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/octet-stream' });

        const enlaceDescarga = document.createElement('a');
        enlaceDescarga.href = URL.createObjectURL(blob);
        enlaceDescarga.download = name;

        document.body.appendChild(enlaceDescarga);
        enlaceDescarga.click();
        document.body.removeChild(enlaceDescarga);
    } catch (error) {
        console.error(error);
    }
};

onMounted(async () => {
    const { optionsCountries } = await useCountries2();
    opsCoutry.value = optionsCountries.value
})

watch(
    () => props.detailsRadicado,
    (value) => {

        form.value = {
            tipoRemitente: '',
            canal: 'Ventanilla',
            tipoTramite: props.detailsRadicado?.tipoTramite?.nombre,
            tipoDocumentoRemi: '',
            numRemi: '',
            nameRemi: '',
            tipoDocumentoAfec: '',
            numAfectado: '',
            nameAfectado: '',
            emailAfectado: '',
            telefono: '',
            pais: { label: props.detailsRadicado?.remitente?.pais?.nombre, value: props.detailsRadicado?.remitente?.pais?.idPais },
            dep: { label: props.detailsRadicado.remitente?.departamento?.nombre, value: props.detailsRadicado.remitente?.departamento?.idDepartamento },
            muni: { label: props.detailsRadicado.remitente?.municipio?.nombre, value: props.detailsRadicado.remitente?.municipio?.idMunicipio },
            direccionAfectado: ''
        }
    }
);

watch(
    () => form.value.pais,
    async (value, oldValue) => {
        //@ts-ignore
        let val = value.label as unknown as string

        if (val == 'Colombia') {
            isntColombia.value = false
            const { optionsDepartments } = await useDepartments(value.value);
            opsDep.value = optionsDepartments.value;
        } else {
            // @ts-ignore
            form.value.dep = { label: val, value: null }
            // @ts-ignore
            form.value.muni = { label: val, value: null }
            isntColombia.value = true
        }
    }
);

watch(
    () => form.value.dep,
    async (value) => {
        if (!isntColombia.value && props.detailsRadicado.remitente?.departamento?.nombre !== value.label) {
            form.value.muni = { label: '', value: null }
        }

        if (value.value) {
            const { optionsMunicipalities } = await useMunicipalities(value.value);
            opsMuni.value = optionsMunicipalities.value;
        }
    }
);


</script>

<style scoped>
.break-all {
  word-break: break-all;
  overflow-wrap: break-word;
}
</style>