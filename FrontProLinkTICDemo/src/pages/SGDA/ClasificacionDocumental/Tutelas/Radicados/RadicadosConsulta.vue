<template>
    <div class="row">
        <div class="col-12">
            <q-card>
                <div class="tw-mx-5 tw-py-5">
                    <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Seleccione una Etapa Procesal</h3>
                    <div
                        class='tw-flex tw-w-full tw-justify-center text-weight-bold tw-text-center tw-mx-5 tw-flex-wrap'>

                        <template v-for="item in items" :key="item.id">
                            <q-btn @click="active(item)" v-if="item.valid" flat
                                class="tw-flex tw-flex-col tw-items-center" style="width:200px">
                                <q-icon name="trip_origin" :color="botonActivado === item.id ? 'orange' : 'gray'"
                                    size="4.4em" />
                                <q-item-label class="tw-w-full"
                                    :class="{ 'tw-text-slate-400': botonActivado !== item.id }">{{
                            item.label
                        }}</q-item-label>
                            </q-btn>

                            <q-btn disable v-else-if="!item.valid && item.own" flat
                                class="tw-flex tw-flex-col tw-items-center" style="width:200px">
                                <q-tooltip>
                                    <span class="tw-text-base">Ya existe un proceso en esta etapa</span>

                                </q-tooltip>
                                <q-icon name="trip_origin" color="grey-4" size="4.4em" />
                                <q-item-label class="tw-w-full tw-text-slate-400">{{
                            item.label
                        }}</q-item-label>
                            </q-btn>

                            <q-btn v-else flat disable class="tw-flex tw-flex-col tw-items-center" style="width:200px">
                                <q-tooltip>
                                    <span class="tw-text-base">No existen procesos creados con esta etapa</span>

                                </q-tooltip>
                                <q-icon name="trip_origin" color="grey-4" size="4.4em" />
                                <q-item-label class="tw-w-full tw-text-slate-400">{{
                                item.label
                            }}</q-item-label>
                            </q-btn>
                        </template>
                    </div>
                </div>
            </q-card>
        </div>
        <div v-if="activeEtapa" class="col-md-6 col-12 tw-mt-4 tw-p-1">
            <q-card class="tw-p-4">
                <div class="tw-mx-2">
                    <h3 class="text-bold tw-text-2xl tw-flex-1 q-py-md">
                        Radicados Asociados a la Etapa Procesal
                    </h3>

                </div>

                <q-expansion-item v-if="visible" dense expand-separator class="tw-bg-white q-mt-md"
                    style="border-radius: 5px">
                    <template v-slot:header>
                        <div class="tw-flex tw-justify-between tw-items-center tw-w-full">
                            <q-inner-loading :showing="visible" />
                        </div>
                    </template>
                </q-expansion-item>

                <q-expansion-item v-model="expanded"  dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
                    <template v-slot:header>
                        <div class="tw-flex tw-justify-between tw-items-center tw-w-full">
                            <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
                                Radicado {{ etapaSelect.idRadicado }} <br>
                                <p class="tw-text-base tw-font-light text-grey-6">Dependencias
                                    {{ etapaSelect.informacionProceso.dependencias.split(',').length }} • {{
                            etapaSelect.etapaProcesal?.nombre
                        }} • {{ calcularFecha(etapaSelect.informacionProceso.fechaRespuesta) }}</p>
                            </h3>

                        </div>


                    </template>
                    <q-card class="tw-grid tw-grid-cols-2 tw-gap-4 tw-p-4" style="box-shadow: none">
                        <div class="tw-col-span-2">
                            <b>Proceso Seleccionado</b>
                        </div>
                        <div>
                            <p class="tw-font-bold tw-text-gray-dark">Proceso</p>
                            <p class="tw-text-base tw-font-light text-grey-6">{{ etapaSelect.etapaProcesal?.nombre }}</p>
                        </div>
                        <div class="tw-col-span-2">
                            <b>Datos del Proceso</b>
                        </div>
                        <div>
                            <p class="tw-font-bold tw-text-gray-dark">Radicado Etapa Procesal</p>
                            <p class="tw-text-base tw-font-light text-grey-6">{{ etapaSelect.idRadicado }}</p>
                        </div>
                        <div>
                            <p class="tw-font-bold tw-text-gray-dark">Número de Proceso</p>
                            <p class="tw-text-base tw-font-light text-grey-6">{{
                            etapaSelect.codigoProceso }}</p>
                        </div>
                        <div>
                            <p class="tw-font-bold tw-text-gray-dark">Número de Siniestro</p>
                            <p class="tw-text-base tw-font-light text-grey-6">{{
                            etapaSelect.informacionProceso.numerosiniestro }}</p>
                        </div>
                        <div>
                            <p class="tw-font-bold tw-text-gray-dark">Dependencia</p>
                            <p class="tw-text-base tw-font-light text-grey-6">{{
                            etapaSelect.informacionProceso.dependencias }}</p>
                        </div>
                        <div>
                            <p class="tw-font-bold tw-text-gray-dark">Causal</p>
                            <p class="tw-text-base tw-font-light text-grey-6">{{ etapaSelect.informacionProceso.causales
                                }}</p>
                        </div>
                        <div>
                            <p class="tw-font-bold tw-text-gray-dark">Fecha de Vencimiento</p>
                            <p class="tw-text-base tw-font-light text-grey-6">{{
                                formatDateTimeStandTwo(
                                etapaSelect.informacionProceso.fechaRespuesta) }}</p>
                        </div>
                        <div>
                            <p class="tw-font-bold tw-text-gray-dark">Estado de la Etapa </p>
                            <p class="tw-text-base tw-font-light text-grey-6">{{ etapaSelect.estadoEtapaProcesal ?
                            etapaSelect.estadoEtapaProcesal?.nombre : 'N/A' }}</p>
                        </div>

                        <div class="tw-col-span-2">
                            <p class="tw-font-bold tw-text-gray-dark">Observaciones</p>
                            <p class="tw-text-base tw-font-light text-grey-6">{{
                            etapaSelect.informacionProceso.observaciones }}
                            </p>
                        </div>

                        <div class="tw-col-span-2">
                            <b>Datos del Accionante</b>
                        </div>
                        <div>
                            <p class="tw-font-bold tw-text-gray-dark">Tipo de Documento</p>
                            <p class="tw-text-base tw-font-light text-grey-6">{{
                            etapaSelect.informacionProceso.tipoDocumentoAccionante }}
                            </p>
                        </div>
                        <div>
                            <p class="tw-font-bold tw-text-gray-dark">Número de Documento</p>
                            <p class="tw-text-base tw-font-light text-grey-6">{{
                            etapaSelect.informacionProceso.numeroDocumentoAccionante
                        }}</p>
                        </div>

                        <template
                            v-if="etapaSelect.informacionProceso.tipoDocumentoAccionante === 'Número de Identificación Tributaria (NIT)' || etapaSelect.informacionProceso.tipoDocumentoAccionante === 'Sociedad Extranjera sin NIT en Colombia'">
                            <div>
                                <p class="tw-font-bold tw-text-gray-dark">Nombre Comercial</p>
                                <p class="tw-text-base tw-font-light text-grey-6">{{
                            etapaSelect.informacionProceso.primerNombreAccionante }}
                                </p>
                            </div>
                            <div>
                                <p class="tw-font-bold tw-text-gray-dark">Razón Social</p>
                                <p class="tw-text-base tw-font-light text-grey-6">{{
                            etapaSelect.informacionProceso.primerApellidoAccionante }}
                                </p>
                            </div>
                        </template>

                        <template v-else>
                            <div>
                                <p class="tw-font-bold tw-text-gray-dark">Nombres</p>
                                <p class="tw-text-base tw-font-light text-grey-6">{{
                            etapaSelect.informacionProceso.primerNombreAccionante }} {{
                                etapaSelect.informacionProceso.segundoNombreAccionante }}
                                </p>
                            </div>
                            <div>
                                <p class="tw-font-bold tw-text-gray-dark">Primer Apellido</p>
                                <p class="tw-text-base tw-font-light text-grey-6">{{
                            etapaSelect.informacionProceso.primerApellidoAccionante }}
                                </p>
                            </div>
                            <div>
                                <p class="tw-font-bold tw-text-gray-dark">Segundo Apellido</p>
                                <p class="tw-text-base tw-font-light text-grey-6">{{
                            etapaSelect.informacionProceso.segundoApellidoAccionante
                        }}</p>
                            </div>
                        </template>

                        <div class="tw-col-span-2">
                            <b>Datos del Afectado</b>
                        </div>

                        <div>
                            <p class="tw-font-bold tw-text-gray-dark">Tipo de Documento</p>
                            <p class="tw-text-base tw-font-light text-grey-6">{{
                                etapaSelect.informacionProceso.tipoDocumentoAfectado }}
                            </p>
                        </div>
                        <div>
                            <p class="tw-font-bold tw-text-gray-dark">Número de Documento</p>
                            <p class="tw-text-base tw-font-light text-grey-6">{{
                            etapaSelect.informacionProceso.numeroDocumentoAfectado }}
                            </p>
                        </div>

                        <template
                            v-if="etapaSelect.informacionProceso.tipoDocumentoAfectado === 'Número de Identificación Tributaria (NIT)' || etapaSelect.informacionProceso.tipoDocumentoAfectado === 'Sociedad Extranjera sin NIT en Colombia'">
                            <div>
                                <p class="tw-font-bold tw-text-gray-dark">Nombre Comercial</p>
                                <p class="tw-text-base tw-font-light text-grey-6">{{
                                    etapaSelect.informacionProceso.primerNombreAfectado }}
                                </p>
                            </div>
                            <div>
                                <p class="tw-font-bold tw-text-gray-dark">Razón Social</p>
                                <p class="tw-text-base tw-font-light text-grey-6">{{
                                    etapaSelect.informacionProceso.primerApellidoAfectado }}
                                </p>
                            </div>
                        </template>

                        <template v-else>
                            <div>
                                <p class="tw-font-bold tw-text-gray-dark">Primer Nombre</p>
                                <p class="tw-text-base tw-font-light text-grey-6">{{
                                    etapaSelect.informacionProceso.primerNombreAfectado }}</p>
                            </div>
                            <div>
                                <p class="tw-font-bold tw-text-gray-dark">Segundo Nombre</p>
                                <p class="tw-text-base tw-font-light text-grey-6">{{
                                    etapaSelect.informacionProceso.segundoNombreAfectado }}
                                </p>
                            </div>
                            <div>
                                <p class="tw-font-bold tw-text-gray-dark">Primer Apellido</p>
                                <p class="tw-text-base tw-font-light text-grey-6">{{
                                    etapaSelect.informacionProceso.primerApellidoAfectado }}
                                </p>
                            </div>
                            <div>
                                <p class="tw-font-bold tw-text-gray-dark">Segundo Apellido</p>
                                <p class="tw-text-base tw-font-light text-grey-6">{{
                                    etapaSelect.informacionProceso.segundoApellidoAfectado }}
                                </p>
                            </div>
                        </template>

                    </q-card>
                </q-expansion-item>
            </q-card>

        </div>
        <div v-if="activeEtapa" class="col-md-6 col-12 tw-mt-4 tw-p-1">
            <q-card>
                <q-card class="tw-h-full tw-w-full">
                    <q-card-section>
                        <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                            <div>
                                <iframe class="tw-h-[80vh] tw-w-full" :src="iframePdfUrl" frameborder="0"></iframe>

                                <template v-if="listDocsEntrada.length > 0">
                                    <p class="text-weight-bold tw-mt-2">Documentos de Entrada</p>
                                    <q-tabs v-model="tabsFiles" dense align="justify" narrow-indicator>
                                        <q-tab v-for="item in listDocsEntrada" :name="item.nombre">
                                            <q-card class="tw-h-[10vh] tw-w-[150px] tw-p-3"
                                                @click="getBlobToIframe(item.nodeId, null)">
                                                <q-img v-lazy :data-url="docImg" style="width: 30px" />
                                                <p class="tw-text-gray-dark textFile tw-mt-2">{{ item.nombre }}</p>
                                                <q-tooltip class="text-body2" anchor="top middle" self="bottom middle" :offset="[10, 10]">
                                                    {{ item.nombre }}
                                                </q-tooltip>
                                            </q-card>
                                        </q-tab>
                                    </q-tabs>
                                </template>
                                <template v-if="listDocsGestion.length > 0">
                                    <p class="text-weight-bold tw-pt-5">Documentos de Gestión</p>
                                    <q-tabs v-model="tabsFiles" dense align="justify" narrow-indicator>
                                        <q-tab v-for="item in listDocsGestion" :name="item.nombre">
                                            <q-card class="tw-h-[10vh] tw-w-[150px] tw-p-3"
                                                @click="getBlobToIframe(item.nodeId, null)">
                                                <q-img v-lazy :data-url="docImg" style="width: 30px" />
                                                <p class="tw-text-gray-dark textFile tw-mt-2">{{ item.nombre }}</p>
                                                <q-tooltip class="text-body2" anchor="top middle" self="bottom middle" :offset="[10, 10]">
                                                    {{ item.nombre }}
                                                </q-tooltip>
                                            </q-card>
                                        </q-tab>
                                    </q-tabs>
                                </template>
                                <template v-if="listDocsSalida.length > 0">
                                    <p class="text-weight-bold tw-pt-5">Documentos de Salida</p>
                                    <q-tabs v-model="tabsFiles" dense align="justify" narrow-indicator>
                                        <q-tab v-for="item in listDocsSalida" :name="item.nombre">
                                            <q-card class="tw-h-[10vh] tw-w-[150px] tw-p-3"
                                                @click="getBlobToIframe(item.nodeId, null)">
                                                <q-img v-lazy :data-url="docImg" style="width: 30px" />
                                                <p class="tw-text-gray-dark textFile tw-mt-2">{{ item.nombre }}</p>
                                                <q-tooltip class="text-body2" anchor="top middle" self="bottom middle" :offset="[10, 10]">
                                                    {{ item.nombre }}
                                                </q-tooltip>
                                            </q-card>
                                        </q-tab>
                                    </q-tabs>
                                </template>
                            </div>

                        </transition>
                    </q-card-section>

                    <q-inner-loading :showing="visibleDoscRead" label-class="text-teal"
                        label-style="font-size: 1.1em" />
                </q-card>
            </q-card>
        </div>
    </div>

</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import {
    useDependencies,
    useCauses
} from "src/composables/useVersion";
import { formatDateTimeStandTwo, currentHourWithoutSec } from "src/helpers/formtDate";
import { sgdeaAxios } from "src/services";
import { DocumentoRadicado } from "src/interfaces";
import docImg from "src/assets/icon-lines.svg";

const { optionsDependencies } = useDependencies()
const listDocs = ref()
const nameDocument = ref(null)
const defTiempo = ref('')
const iframePdfUrl = ref()
const listForVizualiser = ref([])
const tabsFiles = ref()
const visibleDoscRead = ref(false)
const expanded = ref(true)

const props = withDefaults(defineProps<{
    codigo: any,
    radicados: any
}>(), {
})

const dataRadicados = ref()
const visible = ref(true)
const items = ref()
const etapaSelect = ref()
const botonActivado = ref()
const listDocsSalida = ref()
const listDocsGestion = ref()
const listDocsEntrada = ref([])
const activeEtapa = ref(false)

onMounted(async () => {

    const radicados = await sgdeaAxios.get(
        `/tutela/listadoEtapaProcesalXTutela/${props.codigo}`
    );

    dataRadicados.value = [...radicados.data]

    const etapasActivas = dataRadicados.value.map((item) => item.etapaProcesal?.id)

    const listadoEtapas = (await sgdeaAxios.get("/tutela/listadoEtapaProcesal"));

    items.value = listadoEtapas.data?.map((item: any) => ({
        label: capitalizarPalabrasExceptoDe(item.nombre),
        id: item.id,
        descripcion: item.descripcion,
        valid: etapasActivas.includes(item.id)
    }));

    visible.value = false




    for (const dep of radicados.data) {
        var options = []
        if (dep.informacionProceso.dependencias !== '') {
            for (const element of dep.informacionProceso.dependencias?.split(',')) {
                const regexNumeros = /[0-9]/;
                if (regexNumeros.test(element)) {
                    const { optionsCauses } = await useCauses(element);
                    options = options.concat(optionsCauses.value)
                }
            }
        }
        var nameJoin = []
        var nameJoinDep = []
        if (dep.informacionProceso.causales) {
            dep.informacionProceso.causales.split(',').forEach(element => {
                const listNames = options.filter(item => item.value == element)
                nameJoin = nameJoin.concat(listNames)
            });
            const nombres = nameJoin.map(item => item.label);
            const nombresUnidos = nombres.join(", ");
            dep.informacionProceso.causales = nombresUnidos
        }
        if (dep.informacionProceso.dependencias) {
            dep.informacionProceso.dependencias?.split(',').forEach(element => {
                const listNamesDep = optionsDependencies.value.filter(item => item.value == element)
                nameJoinDep = nameJoinDep.concat(listNamesDep)
            });
            const nombresDep = nameJoinDep.map(item => item.label);
            const nombresUnidosDep = nombresDep.join(", ");
            dep.informacionProceso.dependencias = nombresUnidosDep
        }


    }

})

const capitalizarPalabrasExceptoDe = (texto) => {
    const palabras = texto.split(' ');
    for (let i = 0; i < palabras.length; i++) {
        if (palabras[i] !== "de") {
            palabras[i] = palabras[i].charAt(0).toUpperCase() + palabras[i].substring(1);
        }
    }
    return palabras.join(' ');
}

const active = async (data) => {
    etapaSelect.value = dataRadicados.value.filter(item => item.etapaProcesal?.id == data.id)[0]
    const docs = await sgdeaAxios.get<any>(
        `/tutela/${etapaSelect.value.idTutela}/archivos`
    );
    listDocs.value = docs.data.map((it) => ({
        formato: /[^.]+$/.exec(it.nombre)[0],
        nombre: it.nombre,
        fecha: formatDateTimeStandTwo(it.fechaCreacion) + ' ' + currentHourWithoutSec(it.fechaCreacion),
        cargado_por: it.usuario,
        id: it.id,
        tipo: it.tipo,
        nodeId: it.nodeId
    }))

    if (listDocs.value.length) {
        listDocsSalida.value = listDocs.value.filter(it => it.tipo === 'De salida')
        listDocsEntrada.value = listDocs.value.filter(it => it.tipo === 'De entrada')
        listDocsGestion.value = listDocs.value.filter(it => it.tipo === 'De gestión')
        getBlobToIframe(listDocs.value[0].nodeId, null)
    }
    activeEtapa.value = true
    botonActivado.value = data.id
}

const getBlobToIframe = async (id, list) => {
    visibleDoscRead.value = true
    const { data } = await sgdeaAxios.get<DocumentoRadicado>(
        `/radicados/consultar_documento/${id}`
    );

    if (id) {
        tabsFiles.value = data.name
    }

    const byteCharacters = atob(data.base64x);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    iframePdfUrl.value = URL.createObjectURL(blob);

    if (list) {
        listForVizualiser.value = list
    }
    visibleDoscRead.value = false
}

const calcularFecha = (date) => {
    const fechaActual = new Date();
    const stampDate = new Date(date)

    const diferencia = stampDate.getTime() - fechaActual.getTime();
    var diasFaltantes = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    var medicion = ''
    var unidad = 0

    if (diasFaltantes < 1) {
        unidad = 0
        medicion = 'Días'
    }
    else if (diasFaltantes < 7) {
        medicion = diasFaltantes == 1 ? 'día' : 'días'
        unidad = diasFaltantes
    } else if (diasFaltantes < 30) {
        unidad = Math.round(diasFaltantes / 7)
        medicion = unidad == 1 ? 'semana' : 'semanas'
    } else {
        unidad = Math.round(diasFaltantes / 30)
        medicion = unidad == 1 ? 'mes' : 'meses'
    }
    var text = unidad + ' ' + medicion + ' para respuesta'
    return text
}

const download = async (id) => {

    const { data } = await sgdeaAxios.get<DocumentoRadicado>(
        `/radicados/consultar_documento/${id}`
    );

    if (id) {
        nameDocument.value = listDocs.value.find((it) => it.id === id)?.nombre
    }

    const byteCharacters = atob(data.base64x);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = nameDocument.value;

    link.click();

    URL.revokeObjectURL(blobUrl);

};

</script>
<style>
.material-symbols-outlined {
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24
}
.textFile {
    width: 136px;
    /* Ancho del contenedor */
    overflow: hidden;
    /* Ocultar texto excedente */
    text-overflow: ellipsis;
    font-size: 0.75em
}
</style>
