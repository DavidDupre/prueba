<template>
    <main v-if="consultaView" class="q-py-md">
        <q-form>
            <div class="tw-flex tw-justify-between tw-pt-4">
                <h1 class="tw-text-3xl tw-font-bold">Consulta General</h1>
            </div>
            <q-card flat>
                <q-expansion-item expand-separator default-opened class="q-bg-white q-mt-lg">
                    <template v-slot:header>
                        <div class="col row">
                            <b class="tw-text-lg">Consultas</b>
                        </div>
                    </template>
                    <div class="row q-px-md">
                        <div class="col-6">
                            <label class="q-px-md tw-text-label">Fecha Inicial
                                <q-input dense outlined label="Seleccione" v-model="formulario.fechaInicio">
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="formulario.fechaInicio" mask="DD/MM/YYYY"
                                                    :options="disableFutureDates">
                                                    <div class="row items-center justify-end">
                                                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                                                    </div>
                                                </q-date>
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </label>
                        </div>
                        <div class="col-6">
                            <label class="q-px-md tw-text-label">Fecha Final
                                <q-input dense outlined :disable="!formulario.fechaInicio" label="Seleccione"
                                    v-model="formulario.fechaFinal">
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="formulario.fechaFinal" :options="optionsDateFinal"
                                                    mask="DD/MM/YYYY">
                                                    <div class="row items-center justify-end">
                                                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                                                    </div>
                                                </q-date>
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </label>
                        </div>

                        <div class="col-6">
                            <label class="q-px-md tw-text-label">Campos
                                <q-select outlined label="Seleccione" dense emit-value v-model="formulario.campo"
                                    :options="optionCampos" />
                            </label>
                        </div>
                        <q-form class="col-6" ref="formValores">
                            <div>
                                <label class="q-px-md tw-text-label">Valor
                                    <!-- Contenedor flexible -->
                                    <div class="row items-center q-gutter-sm"
                                        style="display: flex; align-items: center; gap: 10px;">
                                        <!-- Toggle a la izquierda -->
                                        <q-toggle v-if="isOficinaSelected" v-model="mostrarInactivas"
                                            :label="mostrarInactivas ? 'Activas ' : 'Inactivas'" color="primary"
                                            style="margin-bottom: 0;" />
                                        <!-- Input/Select a la derecha -->
                                        <div style="flex: 1;">
                                            <q-input outlined label="Inserte" dense emit-value
                                                v-model="formulario.valor"
                                                v-if="typeof formulario.campo === 'object' && formulario.campo.type === 'text'"
                                                type="text" :rules="[alphanumeric, inputRequired]" />

                                            <q-input outlined label="Inserte" dense emit-value
                                                v-model="formulario.valor" type="text"
                                                :rules="[formulario.campo.field == 'numeroDocumentoAccionante' && isPassportAcc || formulario.campo.field == 'numeroDocumentoAfectado' && isPassportAfec ? alphanumeric : onlyNumbers, (v) => minLengthInput(6, v), inputRequired]"
                                                v-else-if="typeof formulario.campo === 'object' && formulario.campo.type === 'number'" />

                                            <q-select v-model="formulario.valor" outlined dense use-input hide-selected
                                                fill-input map-options label="Búsqueda" :options="customOptions"
                                                @filter="filterFn"
                                                v-else-if="typeof formulario.campo === 'object' && formulario.campo.type === 'select'">
                                                <template v-slot:no-option>
                                                    <q-item>
                                                        <q-item-section class="text-grey">
                                                            Sin resultados
                                                        </q-item-section>
                                                    </q-item>
                                                </template>
                                            </q-select>

                                            <q-input outlined label="Inserte" dense emit-value
                                                v-model="formulario.valor" type="text"
                                                v-else-if="typeof formulario.campo === 'object' && formulario.campo.type === 'alpha'"
                                                :rules="[formulario.campo.field === 'idRadicado' ? onlyNumbersForRad : null, formulario.campo.field === 'idRadicado' ? (v: string) => minLengthInput(6, v) : null, formulario.campo.field === 'codigoProceso' ? val => maxLengthInput(23, val) : null, formulario.campo.field === 'codigoProceso' ? alphanumeric : null, formulario.campo.field === 'nombreJuzgado' ? inputRequired : null, formulario.campo.field === 'nombreJuzgado' ? alphanumericAbsolute : null, inputRequired]" />

                                            <q-input outlined label="Inserte" dense emit-value
                                                v-model="formulario.valor" v-else :rules=[inputRequired] />
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </q-form>
                    </div>
                    <div class="col-4 tw-flex tw-items-center tw-justify-end">
                        <q-btn @click="addFilters" class="tw-h-10 tw-w-20 tw-mr-5 tw-mb-5" color="primary"
                            text-color="white">
                            <q-icon name="add" class="q-mr-xs" size="20px" />
                        </q-btn>
                    </div>
                </q-expansion-item>
            </q-card>

            <q-card flat>
                <q-expansion-item expand-separator default-opened class="q-bg-white q-mt-lg">
                    <template v-slot:header>
                        <div class="col row">
                            <b class="tw-text-lg">Filtros</b>
                        </div>
                    </template>
                    <!-- Filtros -->
                    <div class="row q-px-md">
                        <q-chip removable class="cursor-pointer z-10" v-for="(filtro, i) in filtros" :key="i"
                            @remove="removerFiltro(i, filtro.field)"> {{ filtro.label }}
                        </q-chip>
                    </div>
                    <!-- Button Search -->
                    <div class="col-4 tw-flex tw-mt-4 tw-items-center tw-justify-end">
                        <q-btn @click="servicesFil({ isRemove: false })" class="tw-h-10 tw-w-32 tw-mr-5 tw-mb-5"
                            color="primary" text-color="white" label="Buscar" />
                    </div>

                    <div class="q-mt-xl">

                        <div v-if="filtros.length > 0">
                            <div class="flex justify-between w-full items-center">
                                <p class="tw-text-lg text-weight-bold q-mx-lg">
                                    Listado de Consulta General
                                </p>
                            </div>
                            <TableConsulta class="q-pa-md" :TABLE_HEADER="columns" :TABLE_BODY="consultaGeneral"
                                key-id="idRadicado"
                                @handle-edit-data="changeView" :formulario="filtrosCopia" :filtros-lista="filtros"
                                select="multiple"
                                isConsultas
                                msg-no-data="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
                                @update:filas="getPageFilas" @update:pages="getPageFilas" :total-pages="totalPage" :paginationMessage="customMessageTableResults" />
                        </div>
                    </div>
                </q-expansion-item>
            </q-card>
        </q-form>
    </main>
    <Detalle :id-detalle="idSelect" @close-comp="consultaView = true, servicesFil({ isRemove: false })" v-else />
</template>

<script lang="ts" setup>
import { alphanumeric, alphanumericAbsolute, inputRequired, maxLengthInput, minLengthInput, onlyNumbers, onlyNumbersForRad } from 'src/helpers/validations';
import { ref } from 'vue';
import { Ref } from 'vue';
import { computed } from 'vue';
import moment from "moment";
import { SelectInput } from 'src/interfaces';
import { toast } from 'src/helpers/toast';
import { sgdeaAxios } from 'src/services';
import { watch } from 'vue';
import TableConsulta from './TableConsulta.vue';
import Detalle from './Detalle.vue';


const formulario: Ref<{
    fechaInicio: string,
    fechaFinal: string,
    campo: string | { label: string, field: string, type: "text" | "select" | "number" | "alpha" },
    valor: string | number
}> = ref({
    fechaInicio: moment().subtract(1, 'month').format('DD/MM/YYYY'), // Un mes antes de la actual
    fechaFinal: moment().format('DD/MM/YYYY'), // Fecha actual
    campo: '',
    valor: ''
});


// Método para deshabilitar fechas futuras
const disableFutureDates = (date) => {
    const selectedDate = moment(date, 'YYYY/MM/DD');
    const today = moment().startOf('day');
    return selectedDate.isSameOrBefore(today);
};

function optionsDateFinal(date) {
    const fechaSeleccionada = moment(date, 'YYYY/MM/DD');
    const fechaHoy = moment().startOf('day');

    // Si no hay fecha inicial seleccionada, solo validar que no sea futura
    if (!formulario.value.fechaInicio) {
        return fechaSeleccionada.isSameOrBefore(fechaHoy);
    }

    const fechaInicio = moment(formulario.value.fechaInicio, 'DD/MM/YYYY').startOf('day');
    return fechaSeleccionada.isSameOrBefore(fechaHoy) &&
        fechaSeleccionada.isSameOrAfter(fechaInicio);
}

const totalPage = ref(0)
const isPassportAcc = ref(false)
const isPassportAfec = ref(false)
const showModal = ref(false);
const consultaGeneral = ref([])
const consultaGeneralTotalData = ref([])
const customMessageTableResults = ref("")
const customOptions: Ref<SelectInput[]> = ref([]);
const opForCustom = ref([])
const formValores = ref()
const consultaView = ref(true)
const idSelect = ref()
const filtros = ref([])
const copyBodyFilters = ref({})

const mostrarInactivas = ref(true);
const pagination = ref({
    page: 1,
    rowsPerPage: 20,
});

const columns = [
    {
        name: "canalRad",
        label: "Canal Rad",
        field: "canalRad",
        align: "center",
        sortable: true
    },
    {
        name: "fechaRad",
        label: "Fecha y hora de rad.",
        field: "fechaRad",
        sortable: true,
        align: "center",
    },
    {
        name: "numRadicado",
        label: "Núm. Radicado",
        field: row => row.numRadicado ?? '-',
        sortable: true,
        align: "center",
    },
    {
        name: "nroRadicadoRemitente",
        label: "Núm. Radicado Remitente",
        field: row => row.nroRadicadoRemitente ?? '-',
        sortable: true,
        align: "center",
    },
    {
        name: "nomRemitente",
        label: "Nom. Remitente",
        field: row => row.nomRemitente || '-',
        sortable: true,
        align: "center",
    },
    {
        name: "numDocAfectado",
        label: "Núm. Doc. Afectado",
        field: row => row.numDocAfectado || '-',
        sortable: true,
        align: "center",
    },
    {
        name: "oficina",
        label: "Oficina",
        field: row => row.oficina || '-',
        sortable: true,
        align: "center",
    },
    {
        name: "tipoUsuario",
        label: "Tipo de usuario",
        field: row => row.tipoUsuario || '-',
        sortable: true,
        align: "center",
    },
    {
        name: "tipoTramite",
        label: "Tipo de tramite",
        field: row => row.tipoTramite || '-',
        sortable: true,
        align: "center",
    },
    {
        name: "estado",
        label: "Estado",
        // field: "estado",
        field: row => row.estado || '-',
        sortable: true,
        align: "center",
    },
    {
        name: "trazabilidad",
        label: "Trazabilidad",
        field: "trazabilidad",
        sortable: true,
        align: "center",

    },

    {
        name: "actions",
        label: "Acciones",
        field: "actions",
        align: "center",
    },
];

const optionCampos = ref([
    {
        label: "Nombre del remitente",
        field: "NOMBRE_REMITENTE",
        type: "alpha"
    },
    {
        label: "Número de factura",
        field: "NUMERO_FACTURA",
        type: "alpha"
    },
    {
        label: "Número de radicado",
        field: "NUMERO_RADICADO",
        type: "alpha"
    },
    {
        label: "Número de documento afectado",
        field: "NUMERO_DOCUMENTO_AFECTADO",
        type: "alpha"
    },
    {
        label: "Número de documento remitente",
        field: "NUMERO_DOCUMENTO_REMITENTE",
        type: "alpha"
    },
    {
        label: "Tipo de radicado",
        field: "TIPO_RADICADO",
        type: "select"
    },
    {
        label: "Tipo de trámite",
        field: "TIPO_TRAMITE",
        type: "select"
    },

    {
        label: "Gestionador",
        field: "GESTIONADOR",
        type: "select"
    },
    {
        label: "Aprobador",
        field: "APROBADOR",
        type: "select"
    },
    {
        label: "Revisor",
        field: "REVISOR",
        type: "select"
    },
    {
        label: "Oficina",
        field: "OFICINA",
        type: "select",
        options: ["Activas", "Inactivas"]
    }
]);


const changeView = (id, value, idTut) => {
    idSelect.value = id
    consultaView.value = false
}

const isOficinaSelected = computed(() => {
    return typeof formulario.value.campo === 'object' &&
        formulario.value.campo?.field === 'OFICINA' || formulario.value.campo?.field === 'GESTIONADOR' || formulario.value.campo?.field === 'APROBADOR' || formulario.value.campo?.field === 'REVISOR';
});

const getPageFilas = async(filas = 20, page = 0) => {
  pagination.value.rowsPerPage = filas;
pagination.value.page = page;
  const currentFilters = buildCurrentFilters();
  getConsultaGeneral(currentFilters);
}


const buildCurrentFilters = () => {
    const currentFilters: any = {};

    filtros.value.forEach((filtro) => {

        if (['fechaInicio', 'fechaFin'].includes(filtro.field)) {
            currentFilters[filtro.field] = filtro.value;
        } else {
            currentFilters[filtro.field] = filtro.value?.value || filtro.value;
        }
    });

    return currentFilters;
};



interface FiltrosCopia {
    fechaInicio: string;
    fechaFinal: string;
    campo: string;
    valor: string | number | { value: string | number; label: string };
}
const filtrosCopia = ref<FiltrosCopia>({
    fechaInicio: '',
    fechaFinal: '',
    campo: '',
    valor: ''
});
const addFilters = async () => {
    let newFilters = [];

    // Validación inicial para las fechas
    if (!formulario.value.fechaInicio || !formulario.value.fechaFinal) {
        toast.error('Los campos "Fecha Inicio" y "Fecha Final" son obligatorios');
        return;
    }

    // Validación adicional para asegurarse de que "fechaInicio" no sea posterior a "fechaFinal"
    if (moment(formulario.value.fechaInicio, 'DD/MM/YYYY').isAfter(moment(formulario.value.fechaFinal, 'DD/MM/YYYY'))) {
        toast.error('La "Fecha Inicio" no puede ser posterior a la "Fecha Final"');
        return;
    }

    // Validación inicial
    if (formulario.value.campo == '' && formulario.value.valor != '') {
        toast.error('El campo "Campo" no debe estar vacío');
        return;
    }
    if (formulario.value.campo && formulario.value.valor) {
        const fieldName = typeof formulario.value.campo === 'object'
            ? formulario.value.campo.field
            : formulario.value.campo;

        const fieldLabel = typeof formulario.value.campo === 'object'
            ? formulario.value.campo.label
            : formulario.value.campo;

        filtrosCopia.value = {
            fechaInicio: formulario.value.fechaInicio,
            fechaFinal: formulario.value.fechaFinal,
            campo: fieldName,
            valor: formulario.value.valor
        };

        newFilters.push({
            label: `${fieldLabel}: ${formulario.value.valor.label || formulario.value.valor}`,
            field: fieldName,
            value: formulario.value.valor
        });
    } else if (!formulario.value.campo || !formulario.value.valor) {
        toast.error('Debe ingresar un campo y un valor');
        return;
    }

    newFilters.forEach(newFilter => {
        const filterExists = filtros.value.some(existingFilter =>
            existingFilter.field === newFilter.field
        );

        if (filterExists) {
            showNotify('No se puede ingresar el mismo filtro dos veces.')
            return;
        }

        if (!filterExists) {
            filtros.value.push(newFilter);
        }
    });

};

watch(() => filtros.value, (newFiltros) => {
    copyBodyFilters.value = newFiltros
}, { deep: true });

async function servicesFil({ isRemove = false }) {
    const entries = Object.entries(filtros.value);

    if (entries.length === 0 && !isRemove) {
        return showNotify('Debe agregar por lo menos un filtro de búsqueda.')
    }

    if (entries.length === 0 && isRemove) {
        return getConsultaGeneral()
    }

    let body = {};

    entries.forEach(([_key, value]) => {
        if (['fechaInicio', 'fechaFin'].includes(value.field)) {
            body[value.field] = value.value
        } else {
            body[value.field] = typeof value.value === 'object'
                ? value.value.value
                : value.value
        }
    });

    pagination.value.rowsPerPage = 20
    showModal.value = true
    clear()
    getConsultaGeneral(body)
}


const getConsultaGeneral = async (bodyFilters = {}) => {
    try {
        showModal.value = true;
        const queryParams = new URLSearchParams();
        copyBodyFilters.value = bodyFilters


        queryParams.append('page', pagination.value.page > 0 ? (pagination.value.page - 1).toString() : '0');
        queryParams.append('size', pagination.value.rowsPerPage.toString());

        // Handle date filters
        if (formulario.value.fechaInicio) {
            queryParams.append('fechaInicial', formulario.value.fechaInicio);
        }
        if (formulario.value.fechaFinal) {
            queryParams.append('fechaFinal', formulario.value.fechaFinal);
        }

        const { data } = await sgdeaAxios.post(`/consultaGeneral?${queryParams.toString()}`,
            {
                filtros: bodyFilters
            });

        consultaGeneral.value = data.content;
        consultaGeneralTotalData.value = data?.metadata?.totalData;
        customMessageTableResults.value = data?.metadata?.paginationMessage;
        totalPage.value = data.totalPages;

    } catch (error) {
        console.error(error);
        consultaGeneral.value = [];
    } finally {
        showModal.value = false;
    }
};

const clear = () => {
    formulario.value.campo = '';
    formulario.value.valor = '';

}

const removerFiltro = (filtro, field) => {
    filtros.value = filtros.value.filter((x, i) => i != filtro)
    pagination.value.page = 1
    clear()
    getConsultaGeneral(copyBodyFilters.value)
}

watch(() => formulario.value.campo, (_newValue) => {
    formulario.value.valor = '';
})

watch(() => formulario.value.fechaInicio, (newValue) => {
    const nuevaFechaInicio = moment(newValue, 'DD/MM/YYYY');
    if (!nuevaFechaInicio.isValid()) {
        return;
    }

    if (!formulario.value.fechaFinal || moment(formulario.value.fechaFinal, 'DD/MM/YYYY').isBefore(nuevaFechaInicio)) {
        formulario.value.fechaFinal = nuevaFechaInicio.add(30, 'days').format('DD/MM/YYYY');
    }
});

const esMenorDate = ref(false)
watch(() => formulario.value.fechaFinal, (_newValue) => {
    const momentFechaIncial = moment(formulario.value.fechaInicio, 'DD/MM/YYYY', true);
    const momentFechaFinal = moment(formulario.value.fechaFinal, 'DD/MM/YYYY', true);
    const diferenciaEnMeses = momentFechaFinal.diff(momentFechaIncial, 'months');
    if (!momentFechaIncial.isSameOrBefore(momentFechaFinal) || diferenciaEnMeses > 1) {
        esMenorDate.value = true
    } else {
        esMenorDate.value = false
    }
})

// Watch para el toggle
watch(mostrarInactivas, async (newValue) => {
    if (formulario.value.campo?.field === 'OFICINA') {
        try {
            const responseOfic = await sgdeaAxios.get('/oficinas/all');
            const oficinas = responseOfic.data;

            customOptions.value = oficinas
                .filter((it) => {
                    return it.estado === newValue;
                })
                .map((it) => ({
                    value: it.id,
                    label: it.nombre,
                    estado: it.estado
                }))
                .sort((a, b) => a.label.localeCompare(b.label));

            opForCustom.value = customOptions.value;
        } catch (error) {
            console.error(error);
        }
    }

    if (formulario.value.campo?.field === 'GESTIONADOR') {
        try {
            const responseGestionador = await sgdeaAxios.get('/roles/usuarios?rol=Gestionador');
            const gestionadores = responseGestionador.data;

            customOptions.value = gestionadores
                .filter((it) => it.enabled === newValue)
                .map((it) => ({
                    value: it.id,
                    label: `${it.firstname}  ${it.lastname}  ${it.usuarioRelaciones[0]?.oficina?.nombre || ''} `,
                    estado: it.enabled
                }))
                .sort((a, b) => a.label.localeCompare(b.label));

            opForCustom.value = customOptions.value;


        } catch (error) {
            console.error(error);
        }
    }

    if (formulario.value.campo?.field === 'APROBADOR') {
        try {
            const responseAprobador = await sgdeaAxios.get('/roles/usuarios?rol=Aprobador');
            const aprobadores = responseAprobador.data;

            customOptions.value = aprobadores
                .filter((it) => it.enabled === newValue)
                .map((it) => ({
                    value: it.id,
                    label: `${it.firstname} ${it.lastname} ${it.usuarioRelaciones[0]?.oficina?.nombre ? ` ${it.usuarioRelaciones[0].oficina.nombre} (E)` : ''}`,
                    estado: it.enabled
                }))
                .sort((a, b) => a.label.localeCompare(b.label));

            opForCustom.value = customOptions.value;
        } catch (error) {
            console.error(error);
        }
    }

    if (formulario.value.campo?.field === 'REVISOR') {
        try {
            const responseRevisor = await sgdeaAxios.get('/roles/usuarios?rol=Revisor');
            const revisores = responseRevisor.data;

            customOptions.value = revisores
                .filter((it) => it.enabled === newValue)
                .map((it) => ({
                    value: it.id,
                    label: `${it.firstname}  ${it.lastname}  ${it.usuarioRelaciones[0]?.oficina?.nombre || ''} `,
                    estado: it.enabled
                }))
                .sort((a, b) => a.label.localeCompare(b.label));

            opForCustom.value = customOptions.value;
        } catch (error) {
            console.error(error);
        }
    }
});

// Watch para cambios en el formulario
watch(formulario.value, async ({ campo }) => {
    if (typeof campo === 'object' && campo.type === 'select') {
        customOptions.value = [];
        opForCustom.value = [];
        switch (campo.field) {
            case 'OFICINA':
                try {
                    const responseOfic = await sgdeaAxios.get('/oficinas/all');
                    const oficinas = responseOfic.data;

                    customOptions.value = oficinas
                        .filter((it) => it.estado === mostrarInactivas.value)
                        .map((it) => ({
                            value: it.id,
                            label: it.nombre,
                            estado: it.estado
                        }))
                        .sort((a, b) => a.label.localeCompare(b.label));

                    opForCustom.value = customOptions.value;
                } catch (error) {
                    console.error(error);
                }
                break;

            case 'TIPO_RADICADO':
                const tipoRadicadoData = [
                    { value: 'ENTRADA', label: 'Entrada' },
                    { value: 'SALIDA', label: 'Salida' },
                    { value: 'INTERNO', label: 'Interna' },
                    { value: 'PRERADICADOS', label: 'Pre Radicado*' }
                ];

                customOptions.value = tipoRadicadoData.sort((a, b) => a.label.localeCompare(b.label));
                opForCustom.value = customOptions.value;
                break;

            case 'TIPO_TRAMITE':
                const responseTramite = (await sgdeaAxios.get('/correspondencia/comunicacion/listadoTipoTramite')).data;
                customOptions.value = responseTramite
                    .filter(it => it.id !== 5 && it.id !== 3)
                    .map((it) => ({ value: it.id, label: it.nombre }))
                    .sort((a, b) => a.label.localeCompare(b.label));

                opForCustom.value = customOptions.value;
                break;

            case 'APROBADOR':
                try {
                    const responseAprobador = await sgdeaAxios.get('/roles/usuarios?rol=Aprobador');
                    const aprobadores = responseAprobador.data;

                    customOptions.value = aprobadores
                        .filter((it) => it.enabled === mostrarInactivas.value)
                        .map((it) => ({
                            value: it.id,
                            label: `${it.firstname} ${it.lastname} ${it.usuarioRelaciones[0]?.oficina?.nombre ? ` ${it.usuarioRelaciones[0].oficina.nombre} (E)` : ''}`,
                            estado: it.enabled
                        }))
                        .sort((a, b) => a.label.localeCompare(b.label));

                    opForCustom.value = customOptions.value;
                } catch (error) {
                    console.error(error);
                }
                break;

            case 'GESTIONADOR':
                try {
                    const responseGestionador = await sgdeaAxios.get('/roles/usuarios?rol=Gestionador');
                    const gestionadores = responseGestionador.data;

                    customOptions.value = gestionadores
                        .filter((it) => it.enabled === mostrarInactivas.value)
                        .map((it) => ({
                            value: it.id,
                            label: `${it.firstname}  ${it.lastname}  ${it.usuarioRelaciones[0]?.oficina?.nombre || ''} `,
                            estado: it.enabled
                        }))
                        .sort((a, b) => a.label.localeCompare(b.label));

                    opForCustom.value = customOptions.value;
                } catch (error) {
                    console.error(error);
                }
                break;

            case 'REVISOR':
                try {
                    const responseRevisor = await sgdeaAxios.get('/roles/usuarios?rol=Revisor');
                    const revisores = responseRevisor.data;

                    customOptions.value = revisores
                        .filter((it) => it.enabled === mostrarInactivas.value)
                        .map((it) => ({
                            value: it.id,
                            label: `${it.firstname}  ${it.lastname}  ${it.usuarioRelaciones[0]?.oficina?.nombre || ''} `,
                            estado: it.enabled
                        }))
                        .sort((a, b) => a.label.localeCompare(b.label));

                    opForCustom.value = customOptions.value;
                } catch (error) {
                    console.error(error);
                }
                break;

            default:
                customOptions.value = [];
                opForCustom.value = [];
                break;
        }
    }
});


const showNotify = (message: string) => {
    toast.error(message);
}

const filterFn = (val, update, abort) => {
    update(() => {
        const needle = val.toLowerCase()
        customOptions.value = opForCustom.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
    })
}
</script>

<style>
label {
    padding: 0px 10px;
}
</style>
