<template>
    <div>
        <BreadCrumbs :crumbs="routes" />
        <div class="tw-flex tw-justify-between tw-items-center tw-pt-4 tw-mb-8">
            <h2 class="tw-font-bold tw-text-4xl tw-py-4">Búsqueda de expedientes</h2>
        </div>

        <div class=" tw-gap-4">

            <q-form flat class="flex tw-flex-col tw-gap-4 tw-p-8 tw-rounded-lg flex-wrap " autofocus
                @submit.prevent="handleSearch">

                <h3 class=" tw-text-2xl tw-text-left tw-font-bold tw-pl-6">Filtros</h3>

                <div class="row q-col-gutter-md q-pb-md q-px-md">
                    <span class="tw-w-1/4">
                        <label class="tw-text-label">Expediente</label>
                        <q-input v-model="form.codigoExpediente" outlined dense class="tw-rounded-lg" label="Inserte"
                            :rules="[]"></q-input>
                    </span>
                    <span class="tw-w-1/4">
                        <label class="tw-text-label">Radicado</label>
                        <q-input v-model="form.numeroRadicado" outlined dense class="tw-rounded-lg"
                            label="Inserte"></q-input>
                    </span>
                    <span class="tw-w-1/4">
                        <label class="tw-text-label">Numero de Documento</label>
                        <q-input v-model="form.numDocumento" dense outlined class="tw-rounded-lg"></q-input>
                    </span>

                    <span class="tw-w-1/4">
                        <label class="tw-text-label">Mail</label>
                        <q-input v-model="form.mail" outlined dense class="tw-rounded-lg" label="Inserte"></q-input>
                    </span>

                </div>
                <div class="row q-col-gutter-md q-px-md">
                    <span class="tw-w-1/4">
                        <label class="tw-text-label">Tipo de radicado</label>
                        <q-select :options="radicadoOptions.map(x => x.label)" dense reactive-rules placeholder="Seleccione"
                            map-options outlined v-model="form.nombreTipoRadicado" label="Activo" />
                    </span>
                    <span class="tw-w-1/4">
                        <label class="tw-text-label">Tipo de documental</label>
                        <q-select :options="documentOptions" dense emit-value placeholder="Seleccione" map-options outlined
                            v-model="form.nombre2" label="Activo" />
                    </span>
                    <span class="tw-w-1/4">
                        <label class="tw-text-label">Fecha Inicio</label>
                        <q-input type="date" dense v-model="form.fechaVigenciaInicial" outlined
                            class="tw-rounded-lg"></q-input>
                    </span>

                    <span class="tw-w-1/4">
                        <label class="tw-text-label">Fecha Final</label>
                        <q-input type="date" dense v-model="form.fechaVigenciaFinal" outlined
                            class="tw-rounded-lg"></q-input>
                    </span>

                </div>
                <div class="q-pb-md q-px-md">
                    <span class="tw-w-full">
                        <label class="tw-text-label">Dependencia</label>
                        <q-select v-model="form.dependencia" use-input input-debounce="0" :options="options"
                            @filter="filterFn" dense outlined class="tw-rounded-lg">
                            <template v-slot:no-option>
                                <q-item>
                                    <q-item-section class="text-grey">
                                        Sin resultados
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-select>


                    </span>
                </div>


                <span class="w-full flex justify-center tw-gap-4">

                    <q-btn label="Limpiar Filtros" color="accent" textColor="black"
                        class="tw-rounded-lg tw-p-2 tw-w-[200px]" @click="clean"></q-btn>
                    <q-btn label="Buscar" color="secondary" class="tw-rounded-lg tw-p-2 tw-w-[200px] text-bold"
                        type="submit"></q-btn>
                </span>
            </q-form>
            <q-card class="q-mt-lg tw-p-7 tw-rounded-lg " flat>
                <div class="col row tw-flex tw-justify-between tw-items-center tw-pb-4">
                    <p class="q-pa-md tw-font-bold tw-text-2xl">Tablas de Valoracion Documental</p>

                    <div class="tw-flex tw-gap-4">
                                 <q-btn
                                label="Importar"
                                   style="width: 120px; height: 20px; color: #003352"
                                   class="tw-rounded-xl tw-border-2"
                        />



                        <ExportFile     @exportFiles="handleExportSelect" :disabled="expedientesFiltrado.length <= 0" />
                    </div>
                </div>

                <Table :TABLE_HEADER="Documental_HEADER" :TABLE_BODY="expedientesFiltrado" :selection="undefined"
                    icon="visibility" :key="docTable" />
            </q-card>

        </div>
        <Modal v-model="errorModal" title="¡Error!" text="Ha ocurrido un error al intentar exportar el archivo"
            :is-success="false" text-button="Aceptar" @handleAccept="handleModal" />
        <Modal v-model="showModal" title="Exportación exitosa" text="El archivo se ha exportado correctamente" is-success
            text-button="¡Ok!" @handleAccept="handleModal" />

            <FileModal title="Importacion CDC" text-button="Importar" v-model:file="file" v-model="showFiles"
                     @handle-accept="confirm" accept-file=".csv, .xlsx" :key="modalKey"/>


    </div>
</template>

<script  lang="ts" setup>
import Table from './Table.vue';
import { Documental_HEADER, routes } from "."
import { Ref, onBeforeMount, ref, watch } from "vue"
import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';
import httpClient, { client } from 'src/services';
import { radicadoOptions } from 'src/constantes/tipoRadicado';
import ExportFile from 'components/FormFields/exportFiles.vue'
import Modal from 'components/Modal/Modal.vue';
import exportService from "src/services/ExportService";

const file = ref()
const showFiles = ref(true);
const confirmModal = ref(false);

const modalKey = ref('')


const confirm = () => {
  if(file.value) {
    confirmModal.value = true;
  } else {
    errorModal.value = true;
  }
}


const expedientes = ref([])

const expedientesFiltrado = ref([])

const dependenciaOptions: Ref<any[]> = ref([])

const options: Ref<any[]> = ref([])

const showModal = ref(false)
const errorModal = ref(false);



const handleModal = () => {
    if (showModal.value) {
        showModal.value = false
    } else {
        errorModal.value = false
    }
}

//   <!-- Expediente, Radicado, Numero de Documento, Mail, Tipo de Radicado, FechaInicio, FechaFin, Dependencia -->



interface IForm {
    codigoExpediente?: string,
    fechaVigenciaFinal?: string,
    fechaVigenciaInicial?: string,
    mail?: string,
    nombre?: string,
    nombre2?: string,
    nombreTipoRadicado?: string,
    numDocumento?: number,
    numeroRadicado?: string,
    pagina: number | null,
    registros: number | null,
    dependencia?: string
}

const exportOptions = [
    {
        label: 'Exportar XML',
        value: 'XML',
        description: 'Search engine',
        icon: 'code'
    },
    {
        label: ' Exportar PDF',
        value: 'PDF',
        description: 'Social media',
        icon: 'picture_as_pdf'
    },
    {
        label: 'Exportar CSV',
        value: 'CSV',
        description: 'Quick updates',
        icon: 'fa-regular fa-file-csv"'
    },
    {
        label: 'Exportar EXCEL',
        value: 'EXCEL',
        description: 'Quick updates',
        icon: 'fa-regular fa-file-excel'
    },

]

let rOptions = []
const documentOptions = ref([])

onBeforeMount(async () => {
    expedientes.value = (await client.get("/expediente/pageTodo?pagina=0&registros=5")).data

    expedientesFiltrado.value = expedientes.value

    dependenciaOptions.value = (await client.get("/expediente/dependencia")).data.map((x: any) => ({ value: x.idSeccionSubSeccion, label: x.nombre }))

    rOptions = radicadoOptions.map(x => x.label)




})



const docTable = ref(0)


const form: Ref<IForm> = ref({
    numDocumento: 0,
    pagina: null,
    registros: null
});



watch(() => form.value.nombreTipoRadicado, async (newValue) => {
    let opts
    opts = (await client.get("expediente/tipoDocumento?id=" + radicadoOptions.filter(x => form.value.nombreTipoRadicado == x.label)[0].value))
    documentOptions.value = opts.data.map((x: any) => ({ "value": x.idTipoDoc, "label": x.nombre }))

})

function filterFn(val: any, update: any, abort: any) {

    update(() => {
        const needle = val.toLowerCase()
        options.value = dependenciaOptions.value.filter((v: any) => v.label.toLowerCase().indexOf(needle) > -1)
    })
}


const clean = () => {
    expedientesFiltrado.value = expedientes.value

    form.value = {
        numDocumento: 0,
        pagina: null,
        registros: null
    }

    docTable.value++
}

const queryBuilder = (n: string[]) => {
    let str = n.join("&").replace(/ /g, '%20') //.normalize('NFC').replace(/ /g, '+').toLowerCase().replace(/[\u0300-\u036f]/g, "")

    return str
}


const handleSearch = async () => {
    form.value.pagina = form.value.pagina || 0
    form.value.registros = form.value.registros || 6
    const queries = Object.entries(form.value).map((x: string[]) => {
        if (typeof x[1] == 'string') {

            return (x[0] + '=' + x[1].replace(/ /g, '%20').toLowerCase())
        } else {
            return x.join('=')
        }
    })

    expedientesFiltrado.value = (await client.get(`/expediente/page?${queryBuilder(queries)}`)).data

    docTable.value++
}


const handleExportSelect = async (item: string) => {

    const tvdList = {
        tvdList: JSON.parse(JSON.stringify(expedientesFiltrado.value))
    }


    try {
        const headers = {
            "Accept": "*/*",
            "Content-Type": "application/json"
        }
        let response: any;
        if (item.toLowerCase() == 'excel') {
            response = await client.post(
                `/operacionesradicados/export/${item.toLowerCase()}?tipoArchivo=xls`,
                {
                    tvdList: tvdList.tvdList
                });
        }
        else {
            response = await client.post(
                `/operacionesradicados/export/${item.toLowerCase()}`,
                {
                    tvdList: tvdList.tvdList
                });
        }

        await exportService.Download(item.toLowerCase(), response.data);

        if ([200, 201].includes(response.status)) {
            showModal.value = true
        }
    } catch (e) {
        errorModal.value = true
    }
}

</script>


<style scoped></style>
