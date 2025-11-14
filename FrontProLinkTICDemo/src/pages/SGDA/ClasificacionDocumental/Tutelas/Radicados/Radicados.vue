<template>
    <div class="tw-mx-2">
        <h3 class="text-bold tw-text-2xl tw-flex-1 q-py-md">
            Radicados Asociados a la Etapa Procesal
        </h3>

    </div>
    <q-expansion-item v-if="visible" dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
        <template v-slot:header>
            <div class="tw-flex tw-justify-between tw-items-center tw-w-full">
                <q-inner-loading :showing="visible" />
            </div>
        </template>
    </q-expansion-item>

    <q-expansion-item dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px"
        v-for="radicado in dataRadicados" :key="radicado.id">
        <template v-slot:header>
            <div class="tw-flex tw-justify-between tw-items-center tw-w-full">
                <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
                    Radicado {{ radicado.idRadicado }} <br>
                    <p class="tw-text-base tw-font-light text-grey-6">Dependencias
                        {{ radicado.informacionProceso.dependencias.split(',').length }} • {{
                    radicado.etapaProcesal?.nombre
                }} • {{ calcularFecha(radicado.informacionProceso.fechaRespuesta) }}</p>
                </h3>
            </div>
        </template>
        <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-p-4" style="box-shadow: none">
            <div class="tw- tw-col-span-4">
                <b>Proceso Seleccionado</b>
            </div>
            <div>
                <p class="tw-font-bold tw-text-gray-dark">Proceso</p>
                <p class="tw-text-base tw-font-light text-grey-6">{{ radicado.etapaProcesal?.nombre }}</p>
            </div>
            <div class="tw- tw-col-span-4">
                <b>Datos del Proceso</b>
            </div>
            <div>
                <p class="tw-font-bold tw-text-gray-dark">Radicado Asignado</p>
                <p class="tw-text-base tw-font-light text-grey-6">{{ radicado.idRadicado }}</p>
            </div>
            <div>
                <p class="tw-font-bold tw-text-gray-dark">Dependencia</p>
                <p class="tw-text-base tw-font-light text-grey-6">{{ radicado.informacionProceso.dependencias }}</p>
            </div>
            <div>
                <p class="tw-font-bold tw-text-gray-dark">Causal</p>
                <p class="tw-text-base tw-font-light text-grey-6">{{ radicado.informacionProceso.causales
                    }}</p>
            </div>
            <div>
                <p class="tw-font-bold tw-text-gray-dark">Tiempo de Respuesta</p>
                <p class="tw-text-base tw-font-light text-grey-6">{{ calcularFechaTotal(radicado.fechaRadicacion, radicado.informacionProceso.fechaRespuesta)}}</p>
            </div>
            <div>
                <p class="tw-font-bold tw-text-gray-dark">Definición de Tiempo</p>
                <p class="tw-text-base tw-font-light text-grey-6">{{defTiempo}}</p>
            </div>
            <div>
                <p class="tw-font-bold tw-text-gray-dark">Estado de Etapa </p>
                <p class="tw-text-base tw-font-light text-grey-6">{{ radicado.estadoEtapaProcesal ?
                    radicado.estadoEtapaProcesal?.nombre : 'N/A' }}</p>
            </div>

            <div>
                <p class="tw-font-bold tw-text-gray-dark">Abogado Responsable</p>
                <p class="tw-text-base tw-font-light text-grey-6">{{ radicado.asignaciones?.sort((a, b) => new Date(b.fecha)
                    - new Date(a.fecha))[0]?.usuarioAsignado ?? 'N/A' }}</p>
            </div>

            <div class="tw- tw-col-span-4">
                <p class="tw-font-bold tw-text-gray-dark">Observaciones</p>
                <p class="tw-text-base tw-font-light text-grey-6">{{ radicado.informacionProceso.observaciones }}</p>
            </div>

            <div class="tw- tw-col-span-4">
                <b>Datos del Accionante</b>
            </div>
            <div>
                <p class="tw-font-bold tw-text-gray-dark">Tipo de Documento</p>
                <p class="tw-text-base tw-font-light text-grey-6">{{ radicado.informacionProceso.tipoDocumentoAccionante }}
                </p>
            </div>
            <div>
                <p class="tw-font-bold tw-text-gray-dark">Número de Documento</p>
                <p class="tw-text-base tw-font-light text-grey-6">{{ radicado.informacionProceso.numeroDocumentoAccionante
                }}</p>
            </div>

            <template v-if="radicado.informacionProceso.tipoDocumentoAccionante === 'Número de Identificación Tributaria (NIT)' || radicado.informacionProceso.tipoDocumentoAccionante === 'Sociedad Extranjera sin NIT en Colombia'">
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Nombre Comercial</p>
                    <p class="tw-text-base tw-font-light text-grey-6">{{ radicado.informacionProceso.primerNombreAccionante }}
                    </p>
                </div>
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Razón Social</p>
                    <p class="tw-text-base tw-font-light text-grey-6">{{ radicado.informacionProceso.primerApellidoAccionante }}
                    </p>
                </div>
            </template>

            <template v-else>
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Primer Nombre</p>
                    <p class="tw-text-base tw-font-light text-grey-6">{{ radicado.informacionProceso.primerNombreAccionante }}
                    </p>
                </div>
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Segundo Nombre</p>
                    <p class="tw-text-base tw-font-light text-grey-6">{{ radicado.informacionProceso.segundoNombreAccionante }}
                    </p>
                </div>
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Primer Apellido</p>
                    <p class="tw-text-base tw-font-light text-grey-6">{{ radicado.informacionProceso.primerApellidoAccionante }}
                    </p>
                </div>
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Segundo Apellido</p>
                    <p class="tw-text-base tw-font-light text-grey-6">{{ radicado.informacionProceso.segundoApellidoAccionante
                    }}</p>
                </div>
            </template>

            <div class="tw- tw-col-span-4">
                <b>Datos del Afectado</b>
            </div>

            <div>
                <p class="tw-font-bold tw-text-gray-dark">Tipo de Documento</p>
                <p class="tw-text-base tw-font-light text-grey-6">{{ radicado.informacionProceso.tipoDocumentoAfectado }}
                </p>
            </div>
            <div>
                <p class="tw-font-bold tw-text-gray-dark">Número de Documento</p>
                <p class="tw-text-base tw-font-light text-grey-6">{{ radicado.informacionProceso.numeroDocumentoAfectado }}
                </p>
            </div>

            <template v-if="radicado.informacionProceso.tipoDocumentoAfectado === 'Número de Identificación Tributaria (NIT)' || radicado.informacionProceso.tipoDocumentoAfectado === 'Sociedad Extranjera sin NIT en Colombia'">
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Nombre Comercial</p>
                    <p class="tw-text-base tw-font-light text-grey-6">{{ radicado.informacionProceso.primerNombreAfectado }}
                    </p>
                </div>
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Razón Social</p>
                    <p class="tw-text-base tw-font-light text-grey-6">{{ radicado.informacionProceso.primerApellidoAfectado }}
                    </p>
                </div>
            </template>

            <template v-else>
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Primer Nombre</p>
                    <p class="tw-text-base tw-font-light text-grey-6">{{ radicado.informacionProceso.primerNombreAfectado }}</p>
                </div>
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Segundo Nombre</p>
                    <p class="tw-text-base tw-font-light text-grey-6">{{ radicado.informacionProceso.segundoNombreAfectado }}
                    </p>
                </div>
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Primer Apellido</p>
                    <p class="tw-text-base tw-font-light text-grey-6">{{ radicado.informacionProceso.primerApellidoAfectado }}
                    </p>
                </div>
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Segundo Apellido</p>
                    <p class="tw-text-base tw-font-light text-grey-6">{{ radicado.informacionProceso.segundoApellidoAfectado }}
                    </p>
                </div>
            </template>

        </q-card>
        <div class="flex column flex-column-fixed q-mt-md q-mx-md">
            <b>Documentos Adjuntos</b>
            <div class="q-mt-xs tw-inline-block overflow-hidden">
                <template flat bordered :key="doc.id" v-for="doc in listDocs">
                    <q-card class="tw-flex items-center q-px-md tw-mt-4 tw-min-h-8" flat bordered>
                        <div v-if="tipoIcon(doc.formato) != 'nothing'">
                            <img style="width: 26px" v-lazy :data-url="tipoIcon(doc.formato)">
                        </div>
                        <q-icon v-else name="sym_o_unknown_document" size="xs" />
                        <p class="tw-text-xs tw-font-semibold overflow-hidden tw-w-full">{{ doc.nombre }}</p>
                        <button @click="download(doc.id)">
                            <q-icon size="20px" class="tw-text-[#6B737C]" name="file_download" />
                        </button>
                    </q-card>
                </template>
            </div>
        </div>
    </q-expansion-item>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import {
    useDependencies,
    useCauses
} from "src/composables/useVersion";
import { fourthFormatDate } from "src/helpers/formtDate";
import {  sgdeaAxios } from "src/services";
import excel from "assets/excel.svg";
import pdf from "assets/pdf.svg";
import word from "assets/word.svg";
import { DocumentoRadicado } from "src/interfaces";

const { optionsDependencies } = useDependencies()
const listDocs = ref()
const nameDocument = ref(null)
const defTiempo = ref('')

const props = withDefaults(defineProps<{
    codigo: any,
    radicados: any
}>(), {
})

const dataRadicados = ref()
const visible = ref(true)

onMounted(async () => {

    const { data } = await sgdeaAxios.get<any>(
    `/radicados/obtenerHijosPorNodo/${props.radicados.nodeId}`
    );

    const radicados = await sgdeaAxios.get(
        `/tutela/listadoEtapaProcesalXTutela/${props.codigo}`
    );

    dataRadicados.value = [...radicados.data]
    visible.value = false
    listDocs.value = data.list.entries?.map((it) => ({
        formato: it.entry.content.mimeType,
        nombre: it.entry.name,
        fecha: fourthFormatDate(it.entry.createdAt),
        cargado_por: it.entry.createdByUser.displayName,
        id: it.entry.id
    }))
    for (const dep of radicados.data) {
        var options = []
        if (dep.informacionProceso.dependencias !== '') {
            for (const element of dep.informacionProceso.dependencias.split(',')) {
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
            dep.informacionProceso.dependencias.split(',').forEach(element => {
                const listNamesDep = optionsDependencies.value.filter(item => item.value == element)
                nameJoinDep = nameJoinDep.concat(listNamesDep)
            });
            const nombresDep = nameJoinDep.map(item => item.label);
            const nombresUnidosDep = nombresDep.join(", ");
            dep.informacionProceso.dependencias = nombresUnidosDep
        }


    }

})

const tipoIcon = (tipo) => {
    if (tipo === 'application/pdf') return pdf
    else if (tipo === 'application/vnd.ms-excel' || tipo === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return excel
    else if (tipo === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || tipo === 'application/msword') return word
    else return 'nothing'
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

const calcularFechaTotal = (created, date) => {
    const diferencia = date - created;
    var diasFaltantes = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    var unidad = 0
    if (diasFaltantes < 1) {
        unidad = 0
        defTiempo.value = 'Días'
    }
    else if (diasFaltantes < 7) {
        defTiempo.value = diasFaltantes == 1 ? 'Día' : 'Días'
        unidad = diasFaltantes
    } else if (diasFaltantes < 30) {
        unidad = Math.round(diasFaltantes / 7)
        defTiempo.value = unidad == 1 ? 'Semana' : 'Semanas'
    } else {
        unidad = Math.round(diasFaltantes / 30)
        defTiempo.value = unidad == 1 ? 'Mes' : 'Meses'
    }
    var text = unidad + ' ' + defTiempo.value
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
</style>
