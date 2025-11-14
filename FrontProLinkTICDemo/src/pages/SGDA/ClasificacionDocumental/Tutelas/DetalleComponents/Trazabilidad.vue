<template>
    <div>
        <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2">Trazabilidad</h2>
        <Table :TABLE_HEADER="TRAZABILIDAD_HEADER" :TABLE_BODY="dataTable" :selection="undefined" icon="visibility"
            is-second-icon second-icon="download" is-thrid-icon thrid-icon="print" row-id="id" key-id="id"
            :is-selection="false" />
    </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref, watch } from 'vue';

import { adminAxios } from 'src/services';
import { useDepartments, useMunicipalities } from 'src/composables/useVersion';
import { tipoRemitente } from "src/constantes/options";
import DatePicker from "components/FormFields/datePickerComponent.vue";
import Table from "components/Table.vue";
import { TRAZABILIDAD_HEADER } from "./";

interface PQRD {
    tipoRemitente: string;
    tipoDocumentoRemitente: string;
    numeroDocumentoRemitente: string;
    nombresRemitente: string;
    tipoDocumentoAfectado: string;
    numeroDocumentoAfectado: string;
    nombresAfectado: string;
    lgtbtq: boolean,
    sexo: string;
    condicionEspecial: string;
    correoAfectado: string;
    tlfCelularAfectado: string;
    tlfFijoAfectado: string;
    paisContacto: string;
    departamentoContacto: string;
    ciudadContacto: string;
    remitenteAfectado: boolean,
    direccionContacto: string;
    medioRespuestaContacto: string;
    tipologiaPQRD: string;
    tipoSolicitud: string;
    producto: string;
    accesopPublico: boolean;
    descripcionAccesoInfo: string;
    observaciones: string;
    documentos: string | FileList;
}


const state = ref('Pendiente')
const step = ref(1)
const form = ref()
const dataTable = ref([
    {
        codigo: 'Mario Andres',
        dependencia: 'Documentacion',
        idSeriesubserie: 'De salida',
        descripcion: 'Oficina',
        cargado: 'Mario Andres',
        fecha: '10/12/2023',
        estado: 'Gola',
        asignar: 'hola',
        id: 1,
    },
    {
        codigo: 'Mario Andres',
        dependencia: 'Documentacion',
        idSeriesubserie: 'De salida',
        descripcion: 'Oficina',
        cargado: 'Mario Andres',
        fecha: '10/12/2023',
        estado: 'Gola',
        asignar: 'hola',
        id: 1,
    },
    {
        codigo: 'Mario Andres',
        dependencia: 'Documentacion',
        idSeriesubserie: 'De salida',
        descripcion: 'Oficina',
        cargado: 'Mario Andres',
        fecha: '10/12/2023',
        estado: 'Gola',
        asignar: 'hola',
        id: 1,
    },
    {
        codigo: 'Mario Andres',
        dependencia: 'Documentacion',
        idSeriesubserie: 'De salida',
        descripcion: 'Oficina',
        cargado: 'Mario Andres',
        fecha: '10/12/2023',
        estado: 'Gola',
        asignar: 'hola',
        id: 1,
    },
    {
        codigo: 'Mario Andres',
        dependencia: 'Documentacion',
        idSeriesubserie: 'De salida',
        descripcion: 'Oficina',
        cargado: 'Mario Andres',
        fecha: '10/12/2023',
        estado: 'Gola',
        asignar: 'hola',
        id: 1,
    },
    {
        codigo: 'Mario Andres',
        dependencia: 'Documentacion',
        idSeriesubserie: 'De salida',
        descripcion: 'Oficina',
        cargado: 'Mario Andres',
        fecha: '10/12/2023',
        estado: 'Gola',
        asignar: 'hola',
        id: 1,
    },
    {
        codigo: 'Mario Andres',
        dependencia: 'Documentacion',
        idSeriesubserie: 'De salida',
        descripcion: 'Oficina',
        cargado: 'Mario Andres',
        fecha: '10/12/2023',
        estado: 'Gola',
        asignar: 'hola',
        id: 1,
    },
    {
        codigo: 'Mario Andres',
        dependencia: 'Documentacion',
        idSeriesubserie: 'De salida',
        descripcion: 'Oficina',
        cargado: 'Mario Andres',
        fecha: '10/12/2023',
        estado: 'Gola',
        asignar: 'hola',
        id: 1,
    },
    {
        codigo: 'Mario Andres',
        dependencia: 'Documentacion',
        idSeriesubserie: 'De salida',
        descripcion: 'Oficina',
        cargado: 'Mario Andres',
        fecha: '10/12/2023',
        estado: 'Gola',
        asignar: 'hola',
        id: 1,
    },
    {
        codigo: 'Mario Andres',
        dependencia: 'Documentacion',
        idSeriesubserie: 'De salida',
        descripcion: 'Oficina',
        cargado: 'Mario Andres',
        fecha: '10/12/2023',
        estado: 'Gola',
        asignar: 'hola',
        id: 1,
    },
    {
        codigo: 'Mario Andres',
        dependencia: 'Documentacion',
        idSeriesubserie: 'De salida',
        descripcion: 'Oficina',
        cargado: 'Mario Andres',
        fecha: '10/12/2023',
        estado: 'Gola',
        asignar: 'hola',
        id: 1,
    },
])

const items = ref([
    {
        label: 'Información General',
        icon: 'info'
    },
    {
        label: 'Trazabilidad',
        icon: 'history'
    },
    {
        label: 'Documentos relacionados',
        icon: 'folder_open'
    },
    {
        label: 'Incluir expediente',
        icon: 'summarize'
    },
    {
        label: 'Comentarios',
        icon: 'forum'
    },
    {
        label: 'Asignar',
        icon: 'room_preferences'
    },
    {
        label: 'Metadatos',
        icon: 'feed'
    },
    {
        label: "Reasignar",
        icon: "move_up",
    },
])
const showModal = ref(false)
const currentURL = ref();
const formData: Ref<PQRD> = ref({
    tipoRemitente: '',
    tipoDocumentoRemitente: '',
    numeroDocumentoRemitente: '',
    nombresRemitente: '',
    tipoDocumentoAfectado: '',
    numeroDocumentoAfectado: '',
    nombresAfectado: '',
    lgtbtq: false,
    sexo: '',
    condicionEspecial: '',
    correoAfectado: '',
    tlfCelularAfectado: '',
    tlfFijoAfectado: '',
    paisContacto: '',
    departamentoContacto: '',
    ciudadContacto: '',
    remitenteAfectado: false,
    direccionContacto: '',
    medioRespuestaContacto: '',
    tipologiaPQRD: '',
    tipoSolicitud: '',
    producto: '',
    accesopPublico: false,
    descripcionAccesoInfo: 1,
    observaciones: '',
    documentos: '',
})

</script>

<style lang="scss"></style>
