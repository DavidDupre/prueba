<template>
    <main class="tw-flex">
        <div class="tw-flex-col">
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

                            <q-btn disable v-else-if="!item.valid && item.own && !item.block" flat
                                class="tw-flex tw-flex-col tw-items-center" style="width:200px">
                                <q-tooltip>
                                    <span class="tw-text-base">Ya existe un proceso en esta etapa</span>

                                </q-tooltip>
                                <q-icon name="trip_origin" color="grey-4" size="4.4em" />
                                <q-item-label class="tw-w-full tw-text-slate-400">{{
                            item.label
                        }}</q-item-label>
                            </q-btn>

                            <q-btn disable v-else-if="item.block" flat
                                class="tw-flex tw-flex-col tw-items-center" style="width:200px">
                                <q-tooltip>
                                    <span class="tw-text-base">No es posible crear una nueva etapa procesal asociada a este proceso ya que la etapa anterior fue {{ datosGestion.etapaProcesal.nombre }} en  Decretó Nulidad</span>

                                </q-tooltip>
                                <q-icon name="trip_origin" color="grey-4" size="4.4em" />
                                <q-item-label class="tw-w-full tw-text-slate-400">{{
                            item.label
                        }}</q-item-label>
                            </q-btn>

                            <q-btn v-else flat disable class="tw-flex tw-flex-col tw-items-center" style="width:200px">
                                <q-tooltip>
                                    <span class="tw-text-base">Requiere de un proceso anterior para crearse</span>

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
            <q-form ref="form" greedy>
                <q-card>
                    <EtapaProcesal :value-etapa:="etapaTutela" :step-name="stepName" :etapa="botonActivado" :is-por-aprobar="isPorAprobar"
                        :list-etapas="listEtapas" :handle-steps="handleSteps" @change-radicado="changeRadicado"
                        @resetForm="resetForm()"
                        :valid-form="validForm" :radicados-etapa="radicadosEtapa" :datos-gestion="datosGestion"
                        :form="formProceso" />
                </q-card>
                <q-card>
                    <FormAccionante :valid-form="validForm" :datos-gestion="datosGestion" :form="formAccionante" :is-por-aprobar="isPorAprobar" />
                </q-card>
                <q-card>
                    <FormAfectado :valid-form="validForm" :form="formAfectado" :datos-gestion="datosGestion" :is-por-aprobar="isPorAprobar" />
                </q-card>
                <q-card v-if="auth.$state.userInfo.role !== 'Asignador Responsable'">
                    <q-expansion-item dense expand-separator default-opened class="tw-bg-white q-mt-md"
                        style="border-radius: 5px">
                        <template v-slot:header>
                            <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Adjuntar Archivos</h3>
                        </template>
                        <q-card class="tw-p-4 tw-flex tw-flex-col" style="box-shadow: none">
                            <p class="tw-text-label">Adjunte los Documentos</p>
                            <FileLoader v-model="files" class="tw-w-full" multiple
                                accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
                                :max-file-size="50 * 1024 * 1024" :disable="fileDisable || isPorAprobar" :loading="fileLoading"
                                max-file-size-label="50" :max-files="30" @rejected="rejectedFiles" />
                        </q-card>
                    </q-expansion-item>
                </q-card>

                <div class="row tw-flex tw-justify-center tw-gap-3 tw-my-10 tw-h-10" v-if="!isPorAprobar" >
                    <q-btn @click="calcelarGestion" label="Cancelar" class="tw-rounded-lg col-4" />
                    <q-btn :label="validForm && etapaSelect.id == etapaOriginal ? 'Actualizar' : 'Insertar'"
                        :disable="(validForm && etapaSelect.id == etapaOriginal ? validEditEtapa : false)"
                        @click="seeModal" color="primary" class="tw-rounded-lg col-4" />
                </div>

                <q-card>
                    <q-expansion-item dense default-opened expand-separator class="tw-bg-white q-mt-md"
                        style="border-radius: 5px">
                        <template v-slot:header>
                            <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Documentos Cargados</h3>
                        </template>
                        <q-card class="tw-p-6 q-mt-md">
                            <div class="q-mt-sm">
                                <div class="row tw-justify-between">
                                    <p class="tw-text-lg text-weight-bold q-mx-lg">
                                        Listado de documentos cargados
                                    </p>
                                    <div v-if="activeDelete && auth.$state.userInfo.role == 'Administrador'"
                                        class="row tw-gap-10 tw-items-center">
                                        <p class="tw-text-label tw-text-sm">Documento seleccionado: <b>{{
                            selected.nombre }}</b>
                                        </p>
                                        <q-btn label="Eliminar" icon="delete" color="red" @click="deleteDocModal = true"
                                            class="tw-w-32 tw-h-10" />
                                    </div>
                                </div>
                                <Table ref="tableDoc" :TABLE_BODY="listDocs" :TABLE_HEADER="fileColumns"
                                    @update:item-selected="itemSelected" icon="download" second-icon="info"
                                    @handle-second-icon="visualize" :loading="loading"
                                    :is-selection="findRoles([0]) ? 'multiple' : 'none'" @handleEditData="download"
                                    :key-id="'id'" />
                            </div>
                            <!-- <DocumentosRelacionados :list-docs="listDocs" :download="download" /> -->
                        </q-card>
                    </q-expansion-item>
                </q-card>
            </q-form>
            <q-dialog v-model="insertModal" persistent>
                <q-card :class="['tw-px-3 tw-h-[auto] tw-w-[450px]']">
                    <div class="tw-flex tw-justify-center tw-mt-3">
                        <span class="tw-rounded-[100px] tw-flex tw-justify-center"
                            style="background-color: #F6F6F9; width: 82px; height: 82px">
                            <img v-lazy :data-url="InterrogationModal" alt="check" />
                        </span>

                    </div>
                    <q-card-section class="flex column justify-center items-center">
                        <p class="tw-text-[24px] text-center tw-font-bold q-mt-xs">
                            Confirmación
                        </p>
                        <p v-if="validForm" :class="['tw-text-[18px] text-center tw-mt-3']">¿Está seguro que desea
                            iniciar un
                            proceso con: Radicado de entrada <b>{{ detalleTutela.idRadicado }}</b>, Radicado de etapa
                            <b>{{ datosGestion.idRadicado }}</b> y Etapa procesal <b>{{ etapaSelect.label }}
                                {{ formProceso.estadoEtapa ? '(' + formProceso.estadoEtapa.label + ')' : '' }}?</b>
                        </p>
                        <p v-else :class="['tw-text-[18px] text-center tw-mt-3']">¿Está seguro que desea incluir el
                            radicado a este
                            proceso?</p>

                        <div class="tw-flex tw-mt-8">
                            <q-btn label="No" color="accent" text-color="black" class="tw-p-3"
                                style="width: 200px; height: 50px;" flat @click="insertModal = false" v-close-popup />
                            <q-btn label="Si" style="width: 200px; height: 50px;" text-color="white" color="secondary"
                                v-close-popup class="tw-rounded-xl tw-p-3 " @click="handleSubmit" />

                        </div>

                    </q-card-section>
                </q-card>
            </q-dialog>
        </div>
        <div v-if="visualizadorPDF" class="tw-h-full tw-w-full">
            <q-dialog v-model="visualizadorPDF" seamless position="right" class="">
                <q-card class="tw-h-full tw-w-[2000px] tw-z-[1000] tw-overflow-hidden">
                    <q-btn @click="visualizadorPDF = false"
                        class="tw-absolute tw-ml-12 tw-mt-3 tw-z-[2000] tw-text-white tw-bg-red-500">Cerrar</q-btn>
                    <iframe class="tw-h-full tw-w-full" :src="iframePdfUrl" frameborder="0"></iframe>
                </q-card>
            </q-dialog>
        </div>
    </main>
    <Modal v-model="updateModal" title="Confirmación" :text="textSubmit" :is-success="false" cancel-button
        text-button-cancel="No" text-button="Si" @handleAccept="handleSubmit" />
    <Modal v-model="deleteDocModal" title="Confirmación" text="¿Está seguro de que desea eliminar el documento?"
        :is-success="false" cancel-button text-button-cancel="No" text-button="Si" @handleAccept="eliminarDoc" />
    <Modal v-model="successModal" title="Operación exitosa" :text="textModal" is-success text-button="¡Ok!"
        @handleAccept="closeModal" />
    <Modal v-model="errorModal" title="Ha ocurrido un error" :text="textModal" :is-success="false" text-button="Aceptar"
        text-button-cancel="Cancelar" cancel-button @handleAccept="errorModal = false" />

</template>


<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Table from "./Table.vue";
import service from "src/services/Api";
import EtapaProcesal from './Gestionar/EtapaProcesal.vue';
import FormAccionante from './Gestionar/FormAccionante.vue';
import FormAfectado from './Gestionar/FormAfectado.vue';
import FileLoader from 'src/components/FormFields/FileLoader.vue';
import { formatDateTimeStandTwo, currentHourWithoutSec, formatDateAndTime } from "src/helpers/formtDate";
// @ts-ignore
import { DocumentoRadicado } from "src/interfaces";
import { submitEtapaProcesal, editEtapaProcesal } from '.';
import Modal from "src/components/Modal/Modal.vue";
import { sgdeaAxios } from "src/services";
import { crearTrazabilidad } from 'src/helpers/trazabilidad';
import { useAuthStore } from 'src/stores/auth.store';
import { toast } from "src/helpers/toast";
import InterrogationModal from "src/assets/interrogation-modal.svg";


const props = withDefaults(defineProps<{
    departmentsList: any[],
    municipiosList: any[],
    listEtapas: any[],
    stepName: string;
    handleSteps: () => {},
    idEtapaProcesal: string;
    tiposDocumentos: string;
    detalleTutela: any,
    radicadosEtapa: any,
    datosGestion: any,
    validForm: any,
    validGestEtapa: boolean,
    validOwn: boolean,
    validCreacionEtapasProcesales: any,
    visualize?: () => {}
}>(), {
})

const isPorAprobar = computed(() => ['por aprobar'].includes(props.detalleTutela.estado.toLowerCase()));

const auth = useAuthStore()
const { getUserInfo } = useAuthStore();
const route = useRoute();
const emit = defineEmits(['cancel', 'changeView', 'findDocs', 'changeOwn'])
const insertModal = ref(false)
const form = ref();
const etapaTutela = ref()
const visualizadorPDF = ref(false)
const textSubmit = ref('¿Está seguro que desea incluir el radicado a este proceso?')
const items = ref()
const updateModal = ref(false)
const nameDocument = ref(null)
const listDocs = ref([])
const fileDisable = ref(false)
const fileLoading = ref(false)
const selected = ref({})
const deleteDocModal = ref(false)
const loading = ref(true)
const activeDelete = ref(false)
const iframePdfUrl = ref()
const tableDoc = ref()
const userInfo = ref()

const formAccionante = ref({
    tipoDocumento: '',
    numeroDocumento: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: ''
});

const formProceso = ref({
    radicadoEntrada: props.detalleTutela.idRadicado,
    radicadoEtapa: '',
    numeroSiniestro: '',
    dependencia: [],
    causal: [],
    fechaVencimiento: '',
    unidadTiempo: '',
    cantidad: '',
    estadoEtapa: '',
    observacion: '',
})

const formAfectado = ref({
    tipoDocumento: '',
    numeroDocumento: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: ''
});

const fileColumns = [
    {
        name: "formato",
        label: "Formato",
        field: "formato",
        sortable: false,
        align: "center",
    },
    {
        name: "nombre",
        label: "Nombre del Documento",
        field: "nombre",
        sortable: true,
        align: "center",
    },
    {
        name: "fecha",
        label: "Fecha de Cargue",
        field: "fecha",
        sortable: true,
        align: "center",
    },
    {
        name: "cargado_por",
        label: "Cargado por",
        field: "cargado_por",
        sortable: true,
        align: "center",
    },
    {
        name: "actions",
        label: "Acciones",
        field: "actions",
        sortable: true,
        align: "center",
    },
];

const successModal = ref(false);
const textModal = ref(null);
const errorModal = ref(false);
const etapaSelect = ref({ label: 'Avoco', id: 1, descripcion: "Es el primer aviso del juzgado de existencia de una tutela nueva en contra ", valid: true })
const botonActivado = ref(1)
const files = ref([])
const etapaOriginal = ref()
const validEditEtapa = ref(true)

const validSplit = (variable, separador) => {
    if (typeof variable === 'string' && variable.includes(separador)) {
        return true;
    } else {
        return false;
    }
}

const resetForm = async () => {
    await form.value.reset()
}

const handleSubmit = async () => {

    const fechaString = formProceso.value.fechaVencimiento;
    const partesFecha = fechaString.split(" ");
    const fechaPartes = partesFecha[0].split("/");

    const horaPartes = validSplit(partesFecha[1], ':') ? partesFecha[1].split(":") : ['0', '00'];

    const fecha = new Date(
        parseInt(fechaPartes[2]), // Año
        parseInt(fechaPartes[1]) - 1, // Mes
        parseInt(fechaPartes[0]), // Día
        parseInt(horaPartes[0]), // Horas
        parseInt(horaPartes[1]) // Minutos
    );
    var dateByMoment = fecha.getTime()
    if (await form.value.validate()) {
        var departamentString = formProceso.value.dependencia.map(obj => obj).join(',');
        var causasString = formProceso.value.causal.map(obj => obj).join(',');
        let form = {
            // tutela: { idTutela: props.detalleTutela.idTutela },
            numerosiniestro: formProceso.value.numeroSiniestro,
            dependencias: departamentString,
            causales: causasString,
            fechaRespuesta: dateByMoment,
            estadoEtapaProcesalId: formProceso.value.estadoEtapa ? formProceso.value.estadoEtapa.value : 0,
            etapaProcesalId: etapaSelect.value.id,
            observaciones: formProceso.value.observacion,
            tipoDocumentoAccionante: formAccionante.value.tipoDocumento,
            numeroDocumentoAccionante: formAccionante.value.numeroDocumento,
            primerNombreAccionante: formAccionante.value.primerNombre,
            segundoNombreAccionante: formAccionante.value.segundoNombre,
            primerApellidoAccionante: formAccionante.value.primerApellido,
            segundoApellidoAccionante: formAccionante.value.segundoApellido,
            tipoDocumentoAfectado: formAfectado.value.tipoDocumento,
            numeroDocumentoAfectado: formAfectado.value.numeroDocumento,
            primerNombreAfectado: formAfectado.value.primerNombre,
            segundoNombreAfectado: formAfectado.value.segundoNombre,
            primerApellidoAfectado: formAfectado.value.primerApellido,
            segundoApellidoAfectado: formAfectado.value.segundoApellido,
        };

        if (props.validForm && etapaSelect.value.id == etapaOriginal.value) {
            form.fechaRespuesta = new Date(dateByMoment).getTime()
            delete form.etapaProcesalId
            try {
                const response = await editEtapaProcesal(form, props.detalleTutela.idTutela);
                if (response.id) {
                    const id = route.params.id
                    const { data } = await sgdeaAxios.get(`/tutela/info/${id}`)
                    const docResponse = await submitFiles()
                    try {
                        await crearTrazabilidad({
                            proceso: `TUT${data.idTutela}`,
                            secuencia: data.idRadicado,
                            estado: data.estado,
                            descripcion: "Se ha actualizado el proceso del radicado",
                            comentario: 'Gestion',
                            nombre: auth.$state.userInfo.name,
                            tramite: 'Tutela',
                            accion: `${auth.$state.userInfo.name} ha actualizado el proceso del radicado ${data.idRadicado}`
                        })
                    } catch (error) {
                        console.error(error);
                    }

                    toast.success('Proceso actualizado exitosamente')
                    emit('changeOwn')
                    setTimeout(() => {
                        emit('changeView', false)
                    }, 500);
                    // successModal.value = true;
                    // textModal.value = 'Proceso actualizado exitosamente'
                }
            } catch (e) {
                errorModal.value = true
                textModal.value = 'Ha ocurrido un error, intente de nuevo'
            }

        } else {
            try {
                const response = await submitEtapaProcesal(form, props.detalleTutela.idTutela);

                if (response.idRadicado) {
                    const docResponse = await submitFiles()
                    try {
                        await crearTrazabilidad({
                            proceso: `TUT${response.idTutela}`,
                            secuencia: response.idRadicado,
                            estado: response.estado,
                            descripcion: "Se ha incluido el radicado al proceso",
                            comentario: 'Gestion',
                            nombre: auth.$state.userInfo.name,
                            tramite: 'Tutela',
                            accion: `${auth.$state.userInfo.name} ha empezado la gestión del radicado ${response.idRadicado}`,
                        })
                    } catch (error) {
                        console.error(error);
                    }

                    // successModal.value = true;
                    toast.success('Radicado incluido correctamente al proceso')
                    emit('changeOwn')
                    setTimeout(() => {
                        emit('changeView', false)
                    }, 500);

                    // textModal.value = 'Radicado incluido correctamente al proceso'
                }
            } catch (e) {
                errorModal.value = true
                textModal.value = 'Ha ocurrido un error, intente de nuevo'
            }
        }
    } else {
        toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos.')
    }

}

const closeModal = async () => {

    emit('changeView', false)
    successModal.value = false

}

const calcelarGestion = async () => {
    emit('cancel')
}
const validTypeForm = async () => {
    await getDocuments()
    if (props.validForm) {


        var ownTut = props.detalleTutela.informacionProceso ? true : false
        botonActivado.value = props.datosGestion.etapaProcesal.id
        etapaOriginal.value = props.datosGestion.etapaProcesal.id
        etapaSelect.value = { label: props.datosGestion.etapaProcesal.nombre, id: props.datosGestion.etapaProcesal.id, descripcion: props.datosGestion.etapaProcesal.descripcion, valid: true }
        setTimeout(() => {
            var fecha = formatDateAndTime(props.datosGestion.informacionProceso.fechaRespuesta)
            formProceso.value = {
                radicadoEntrada: props.detalleTutela.idRadicado,
                radicadoEtapa: props.datosGestion.idRadicado, // CAmbiar cuando este el valor
                numeroSiniestro: props.datosGestion.informacionProceso.numerosiniestro,
                dependencia: props.datosGestion.informacionProceso.dependencias == null || props.datosGestion.informacionProceso.dependencias.length == 0 ? [] : props.datosGestion.informacionProceso.dependencias.split(',').map(Number),
                causal: props.datosGestion.informacionProceso.causales == null || props.datosGestion.informacionProceso.dependencias.length == 0 ? [] : props.datosGestion.informacionProceso.causales.split(',').map(Number),
                fechaVencimiento: fecha,
                estadoEtapa: props.datosGestion.estadoEtapaProcesal ? { label: props.datosGestion.estadoEtapaProcesal.nombre, value: props.datosGestion.estadoEtapaProcesal.id } : null,
                observacion: props.datosGestion.informacionProceso.observaciones
            };
        }, 500);

        formAccionante.value = {
            tipoDocumento: props.datosGestion.informacionProceso.tipoDocumentoAccionante,
            numeroDocumento: props.datosGestion.informacionProceso.numeroDocumentoAccionante,
            primerNombre: props.datosGestion.informacionProceso.primerNombreAccionante,
            segundoNombre: props.datosGestion.informacionProceso.segundoNombreAccionante,
            primerApellido: props.datosGestion.informacionProceso.primerApellidoAccionante,
            segundoApellido: props.datosGestion.informacionProceso.segundoApellidoAccionante
        };

        formAfectado.value = {
            tipoDocumento: props.datosGestion.informacionProceso.tipoDocumentoAfectado,
            numeroDocumento: props.datosGestion.informacionProceso.numeroDocumentoAfectado,
            primerNombre: props.datosGestion.informacionProceso.primerNombreAfectado,
            segundoNombre: props.datosGestion.informacionProceso.segundoNombreAfectado,
            primerApellido: props.datosGestion.informacionProceso.primerApellidoAfectado,
            segundoApellido: props.datosGestion.informacionProceso.segundoApellidoAfectado
        };
        const ids = props.radicadosEtapa.listadoRadicados.map(objeto => objeto.etapaProcesal.id);
        const idEtProc = props.datosGestion.etapaProcesal.id
        ids.sort((a, b) => a - b);

        // Filtramos los ids que no queremos
        var idsFiltrados = ids.filter(id => id !== 6 && id !== 7);

        // Obtenemos el último id
        let ultimoId = idsFiltrados[idsFiltrados.length - 1];

        items.value.forEach(element => {
            const existeId = ids.some(item => item === element.id);
            if (ownTut) {
                if (existeId && element.id != idEtProc || element.id != idEtProc) {
                    element.valid = false
                    if (existeId) {
                        element.own = true
                    }
                }
            } else {
                if (existeId && element.id != idEtProc) {
                    element.valid = false
                    element.own = true
                }
                validEditEtapa.value = true
            }
        });
        if (props.validCreacionEtapasProcesales) {
            items.value.forEach(element => {
                if (element.id != props.datosGestion.etapaProcesal.id) {
                    element.valid = false
                    element.block = true
                }
            });
            toast.error(`No es posible crear una nueva etapa procesal asociada a este proceso ya que la etapa anterior fue ${props.datosGestion.etapaProcesal.nombre}  en Decretó Nulidad`)
        }

        if (props.detalleTutela.etapaProcesal?.nombre == props.datosGestion.etapaProcesal?.nombre) {
            validEditEtapa.value = false
        } else {
            validEditEtapa.value = true
        }

    } else {

        textSubmit.value = '¿Está seguro que desea incluir el radicado a este proceso?'
    }
}

const changeRadicado = (value) => {
    setTimeout(() => {
        var fecha = formatDateAndTime(value.informacionProceso.fechaRespuesta)
        formProceso.value.numeroSiniestro = value.informacionProceso.numerosiniestro
        formProceso.value.dependencia = value.informacionProceso.dependencias == null ? [] : value.informacionProceso.dependencias.split(',').map(Number)
        formProceso.value.causal = value.informacionProceso.causales == null ? [] : value.informacionProceso.causales.split(',').map(Number)
        formProceso.value.fechaVencimiento = fecha
        formProceso.value.observacion = value.informacionProceso.observaciones
    }, 200);

    formAccionante.value = {
        tipoDocumento: value.informacionProceso.tipoDocumentoAccionante,
        numeroDocumento: value.informacionProceso.numeroDocumentoAccionante,
        primerNombre: value.informacionProceso.primerNombreAccionante,
        segundoNombre: value.informacionProceso.segundoNombreAccionante,
        primerApellido: value.informacionProceso.primerApellidoAccionante,
        segundoApellido: value.informacionProceso.segundoApellidoAccionante
    };

    formAfectado.value = {
        tipoDocumento: value.informacionProceso.tipoDocumentoAfectado,
        numeroDocumento: value.informacionProceso.numeroDocumentoAfectado,
        primerNombre: value.informacionProceso.primerNombreAfectado,
        segundoNombre: value.informacionProceso.segundoNombreAfectado,
        primerApellido: value.informacionProceso.primerApellidoAfectado,
        segundoApellido: value.informacionProceso.segundoApellidoAfectado
    };
}

const capitalizarPalabrasExceptoDe = (texto) => {
    const palabras = texto.split(' ');
    for (let i = 0; i < palabras.length; i++) {
        if (palabras[i] !== "de") {
            palabras[i] = palabras[i].charAt(0).toUpperCase() + palabras[i].substring(1);
        }
    }
    return palabras.join(' ');
}

onMounted(async () => {
    userInfo.value = await getUserInfo();

    const { data } = (await sgdeaAxios.get("/tutela/listadoEtapaProcesal"));
    items.value = data?.map((item: any) => ({
        label: capitalizarPalabrasExceptoDe(item.nombre),
        id: item.id,
        descripcion: item.descripcion,
        valid: true
    }));
    validTypeForm()
})

function showNotif(title: string) {
toast.error(title)
}
const rejectedFiles = (error) => {
    if (error.some((it) => it.failedPropValidation === 'max-file-size')) {
        showNotif('El peso permitido es hasta 50MB.')
    }
    if (error.some((it) => it.failedPropValidation === 'max-files')) {
        showNotif('Solo se pueden adjuntar 20 archivos.')
    }
    if (error.some((it) => it.failedPropValidation === 'accept')) {
        showNotif('Formato inválido, los formatos permitidos son (pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg).')
    }
}

const seeModal = () => {
    if (props.validForm && etapaSelect.value.id == etapaOriginal.value) {
        textSubmit.value = '¿Está seguro que desea actualizar el proceso actual?'
        updateModal.value = true
    } else {
        insertModal.value = true
    }
}

const download = async (id) => {
    const { data } = await sgdeaAxios.get<DocumentoRadicado>(
        `/radicados/consultar_documento/${id}`
    );

    if (id) {
        nameDocument.value = data.name
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

const getDocuments = async () => {
    const { data } = await sgdeaAxios.get<any>(
        `/tutela/${props.detalleTutela.idTutela}/archivos`
    );

    listDocs.value = data.map((it) => ({
        formato: /[^.]+$/.exec(it.nombre)[0],
        nombre: it.nombre,
        tipo: it.tipo,
        fecha: formatDateTimeStandTwo(it.fechaCreacion) + ' ' + currentHourWithoutSec(it.fechaCreacion),
        cargado_por: it.usuario,
        id: it.id,
        nodeId: it.nodeId
    }))
    loading.value = false
    tableDoc.value.cleanSelect()
}

const active = (data) => {
    etapaSelect.value = data
    botonActivado.value = data.id
}

const submitFiles = () => {
    if (files.value.length > 0) {
        var data = {
            files: files.value,
            userId: userInfo.value.userid,
            tutelaId: props.detalleTutela.idTutela,
            tipo: 'De gestión'
        }
        service.subirArchivos(data)
            .then((resp) => {
                files.value = []
                fileLoading.value = false
                fileDisable.value = false
                if (resp.status == 200) {
                    // toast.success('Documento(s) subidos con éxito')
                    getDocuments()
                } else {
                    toast.error('Hubo un error intente de nuevo')
                }
            })
    }

}

const itemSelected = (item) => {
    if (item.length > 0) {
        activeDelete.value = true
    } else {
        activeDelete.value = false
    }
    selected.value = item[0]
}

const eliminarDoc = async () => {
    loading.value = true
    listDocs.value = []
    const data = await sgdeaAxios.delete<any>(
        `/tutela/archivos/${selected.value.id}`
    );
    if (data.data) {
        selected.value = {}
        activeDelete.value = false
        toast.success('Documento eliminado con éxito')
        getDocuments()
    } else {
        selected.value = {}
        activeDelete.value = false
        toast.error('Hubo un error intente de nuevo')
        getDocuments()
    }
    emit('findDocs')
}

const findRoles = (role) => {
    var nomenclatura = [
        'Administrador', //0
        'Asignador Responsable', //1
        'aprobador_sgdea', //2
        'Gestionador', //3
        'Radicador - Web' //4
    ]
    var valid = false
    role.forEach(element => {
        if (userInfo.value?.role?.includes(nomenclatura[element])) {
            valid = true
        }
    });
    return valid
}

</script>
<style>
.alert-error {
    background-color: #ffdbdb;
    border: 1px solid red;
}
</style>
