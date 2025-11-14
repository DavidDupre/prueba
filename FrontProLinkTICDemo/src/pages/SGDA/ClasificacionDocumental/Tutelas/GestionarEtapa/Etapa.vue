<template>
    <q-form @submit="handleSubmit">
        <q-expansion-item dense expand-separator class="tw-bg-white q-mt-md tw-mb-8" style="border-radius: 5px"
            default-opened>
            <template v-slot:header>
                <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
                    Radicado Entrada
                </h3>
            </template>
            <q-card class="tw-flex tw-flex-col q-pa-md tw-gap-4" style="box-shadow: none">
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Número Radicado de Entrada</p>
                    <p>{{ detallesEtapa.numeroRadicado }}</p>
                </div>
                <div>
                    <p class="tw-font-bold tw-text-gray-dark">Fecha Radicación de Entrada</p>
                    <p>{{ detallesEtapa.fechaRadicado.replace(/-/g, "/") }}</p>
                </div>
            </q-card>
        </q-expansion-item>

        <q-expansion-item dense expand-separator class="tw-bg-white q-mt-md tw-mb-8" style="border-radius: 5px"
            default-opened>
            <template v-slot:header>
                <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
                    Información del Proceso
                </h3>
            </template>
            <q-card class="tw-flex-col" style="box-shadow: none">


                <div class='tw-flex tw-flex-col tw-w-full tw-p-4'>
                    <span class="tw-font-bold">
                        <label for="description" class="tw-text-gray-dark">Departamento *</label>
                        <q-select placeholder="Seleccione" :disable="true" outlined
                            :options="departmentsList" dense v-model="detallesEtapa.juzgado.departamento"
                            :rules="[inputRequired]" map-options emit-value />
                    </span>
                </div>
                <div class='tw-flex tw-flex-col tw-w-full tw-p-4'>
                    <span class="tw-font-bold">
                        <label for="description" class="tw-text-gray-dark">Municipio *</label>
                        <q-select emit-value placeholder="Seleccione" :disable="true" outlined
                            :options="municipiosList" dense v-model="detallesEtapa.juzgado.municipio" :rules="[inputRequired]"
                            map-options />
                    </span>
                </div>
                <div class='tw-flex tw-flex-col tw-w-full tw-p-4'>
                    <span class="tw-font-bold">
                        <label for="description" class="tw-text-gray-dark">Juzgado *</label>
                        <q-select emit-value placeholder="Seleccione" outlined :disable="true"
                            :options="['Juzgado 1']" dense v-model="detallesEtapa.juzgado.nombre" :rules="[inputRequired]"
                            map-options />
                    </span>
                </div>
                <div class='tw-flex tw-flex-col tw-w-full tw-p-4'>
                    <span class="tw-font-bold">
                        <label for="description" class="tw-text-gray-dark">Código del Proceso *</label>

                        <q-input :disable="true" outlined
                            v-model="detallesEtapa.codigoProceso"
                            :rules="[v => maxLengthInput(200, v), inputRequired]" @update="handleCodigo" />
                    </span>
                </div>
            </q-card>
        </q-expansion-item>
        <q-card class=" q-pa-md" bordered flat>
            <header class="tw-flex justify-between">
                <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
                    Listado de Radicados
                </h3>
            </header>
            <q-table ref="myTable" :rows="detallesEtapa.listadoRadicados" :columns="columnsEtapaRadicados" :row-key="row => row.idTutela"
                selection="multiple" v-model:selected="selection" v-model:pagination="pagination" color="primary">

                <template v-slot:body-cell-accion="props">
                    <q-td class="text-center">
                        <q-btn class="tw-w-auto text-black tw-h-9 flex" color="grey-3" @click="rowSelected = props.row, findRoles([3]) ? edit(props.row) : confirmModal = true">

                            <span class="tw-px-2">Seleccionar registro</span>
                        </q-btn>
                    </q-td>
                </template>
                <template v-slot:no-data>
                    <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
                        <img v-lazy :data-url="NoData" alt="" width="120">
                        <span class="tw-text-lg tw-mt-4 tw-w-[480px] tw-text-center">
                            El código del proceso no tiene registros asociados, verifique el número ingresado o cree un
                            nuevo proceso
                        </span>
                        <q-btn v-if="findRoles([0,1])" :disable="validButtonCrear" flat color="primary" @click="addProcess">
                            <q-icon size="1.1em" name="add" class="q-mr-sm" color="primary"></q-icon>
                            Crear nuevo proceso
                        </q-btn>
                    </div>
                </template>
            </q-table>
        </q-card>
        <Modal v-model="confirmModal" title="Confirmación" text="¿Está seguro que desea incluir el radicado en este proceso?" :is-success="false" cancel-button
        text-button-cancel="No" text-button="Si" @handleAccept="edit(rowSelected)" />
    </q-form>
</template>
<script lang="ts" setup>
import { defineEmits, ref, onMounted } from 'vue'
import { inputRequired, maxLengthInput } from "src/helpers/validations";
import NoData from "assets/filterImage.svg"
import Modal from "src/components/Modal/Modal.vue";
import { useAuthStore } from 'src/stores/auth.store';

const emit = defineEmits(['etapa', 'add', 'edit'])
const { getUserInfo } = useAuthStore();
const userInfo = ref()

const pagination = ref({
    sortBy: 'radicado',
    descending: false,
    page: 1,
    rowsPerPage: 20
})

const props = withDefaults(defineProps<{
    departmentsList: any[],
    municipiosList: any[],
    detallesEtapa: { numeroRadicado: any, fechaRadicado: any, departamento: any, municipio: any, juzgado: any, codigoProceso: any, listadoRadicados: any }
}>(), {
})


onMounted(async () => {
    userInfo.value = await getUserInfo();
})

const rowSelected = ref()
const selection = ref([])
const confirmModal = ref(false)
const listadoFiltrado = ref(props.detallesEtapa.listadoRadicados.filter((item) => item.informacionProceso != null))

const handleSubmit = () => {
    emit('etapa')
}

const addProcess = () => {
    emit('add', true)
}
const edit = (data) => {
    emit('edit', data)
}

const handleCodigo = () => { }

const validButtonCrear = () => {
    listadoFiltrado.value.forEach(element => {
        if (element.etapaProcesal.id == 2 || element.etapaProcesal.id == 3) {
            if (element.estadoEtapaProcesal.id == 24) {
                return true
            }else{
                return false
            }
        }else{
            return false
        }
    });
}


const columnsEtapaRadicados = [
    {
        name: "radicado",
        label: "Número Radicado",
        field: 'idRadicado',
        sortable: true,
        align: "center",
    },
    {
        name: "abogado",
        label: "Abogado Responsable",
        field: row => row.asignaciones?.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0]?.usuarioAsignado ?? 'N/A',
        sortable: true,
        align: "center",
    },
    {
        name: "departamento",
        label: "Departamento ",
        field: row => row.juzgado.departamento,
        sortable: true,
        align: "center",
    },
    {
        name: "municipio",
        label: "Municipio ",
        field: row => row.juzgado.municipio,
        sortable: true,
        align: "center",
    },
    {
        name: "juzgado",
        label: "Juzgado",
        field: row => row.juzgado.nombre,
        sortable: true,
        align: "center",
    },
    {
        name: "numeroDocumentoAfectado",
        label: "Número Documento Afectado",
        field: row => row.informacionProceso.numeroDocumentoAfectado,
        sortable: true,
        align: "center",
    },
    {
        name: "nombreAfectado",
        label: "Nombre Afectado",
        field: row => row.informacionProceso.primerNombreAfectado + ' ' + row.informacionProceso.segundoNombreAfectado + ' ' + row.informacionProceso.primerApellidoAfectado + ' ' + row.informacionProceso.segundoApellidoAfectado ,
        sortable: true,
        align: "center",
    },
    {
        name: "juzgado",
        label: "Etapa Procesal",
        field: row => row.etapaProcesal.nombre,
        sortable: true,
        align: "center",
    },
    {
        name: "accion",
        label: "Acciones",
        field: 'accion',
        sortable: true,
        align: "center",
    },
];

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
