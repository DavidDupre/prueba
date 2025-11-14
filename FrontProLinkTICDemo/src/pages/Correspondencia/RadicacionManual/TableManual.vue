<template>
    <q-table flat :rows="filteredData" :columns="TABLE_HEADER" :row-key="props.keyId"
        table-header-class="text-black text-h6" :selection="props.select" class="q-mr-md full-width" hide-pagination
        v-model:pagination="pagination" v-model:selected="selection"
        no-data-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
        no-results-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente">
        <template v-slot:top-right>
            <div class="tw-flex tw-items-center tw-gap-x-3">
                <q-input outlined dense rounded v-model="search" label="Buscador" class="tw-w-[300px]"
                    @update:model-value="generalFilter">
                    <template v-slot:prepend>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </div>
        </template>

        <template v-slot:body-cell-estados="props">
            <q-td class="tw-w-[125px]">
                <p :class="[
                    'tw-border tw-h-[20px] tw-rounded-xl col-8',
                    props.row.estados ? ' tw-border-green-700 tw-bg-green-100' : ' tw-border-gray-400 tw-bg-gray-200 tw-text-secondary'
                ]">
                    {{ props.row.estados ? 'Activo' : '-' }}
                </p>
            </q-td>
        </template>

        <template v-slot:body-cell-estado="props">
            <q-td class="text-center">
                <div :class="[
                    'tw-border tw-rounded-full q-my-sm tw-max-w-max q-px-md q-py-xs',
                    (!(props.row?.tiempoXVencer) || (props.row?.tiempoXVencer !== 'Vencido')) ? 'tw-bg-orange-100 tw-border-orange-400' : 'tw-bg-red-100 tw-border-red-400 tw-text-red-500'
                ]">
                    {{ props.row?.estado || '-' }}
                </div>
            </q-td>
        </template>

        <template v-slot:body-cell-states="props">
            <q-td class="text-center">
                <div :class="[
                    'tw-inline-block tw-p-1.5 tw-px-4 tw-rounded-lg tw-border tw-w-40',
                    props.row.estado?.nombre ? ' tw-border-green-700 tw-bg-green-100' : ' tw-border-gray-400 tw-bg-gray-200 tw-text-secondary'
                ]">
                {{ props.row?.estado?.nombre || "-" }}
                </div>
            </q-td>
        </template>

        <template v-slot:body-cell-acciones="props">
            <q-td :class="`tw-flex tw-justify-center`" style="height: 100% !important;">
                <q-btn class="tw-w-auto tw-h-9 flex tw-bg-[#f2f4f5]" @click="editData(props.row.id)">
                    <span class="tw-px-2">{{ 'Prueba' }}</span>
                </q-btn>
            </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
            <q-td class="text-center">
                <q-btn v-if="isRolRadicadorVentanilla" size="sm" color="primary" icon="edit" flat
                    @click="emit('generarRadicado', props.row)" />
                <q-btn v-if="(isRolGestionador === true || isAdmMaster == true) && props.row.secuenciaRadicado"
                    size="sm" color="primary" icon="move_up'" flat @click="emit('incluirExp', props.row)" />
                <q-btn v-if="isRolGestionador === true && props.row.secuenciaRadicado == null" size="sm" color="primary" icon="delete" flat @click="emit('deleteCom', props.row.id)" />
                <q-btn v-if="!isRolGestionador" size="sm" color="primary" icon="delete" flat @click="emit('deleteCom', props.row.id)" />
                <q-btn v-if="!props.row.secuenciaRadicado && !isRolRadicadorVentanilla" size="sm" color="primary"
                    icon="upload" flat @click="emit('adjuntarDoc', props.row)" />
            </q-td>
        </template>

        <template v-slot:body-cell-procedimiento="props">
            <div class="tw-border-b-[1px] tw-w-96 tw-px-2">
                <p class="tw-text-center tw-border-0">
                    {{ collapseContent(props.row.procedimiento) }}
                </p>
                <div class="tw-flex tw-justify-end" v-if="props.row.procedimiento?.length >= 200">
                    <q-btn flat color="secondary" @click="showingFullText = !showingFullText">
                        {{ showingFullText ? 'Ver menos' : 'Ver más' }}
                    </q-btn>
                </div>
            </div>
        </template>

        <template v-slot:body-cell-toggle="props">
            <q-td>
                <q-toggle v-model="props.row.toggle" color="secondary"></q-toggle>
            </q-td>
        </template>

        <template v-slot:body-cell-trazabilidad="props">
            <q-td>
                <q-btn flat color="primary" @click="getTrazabilidad(props.row.id)" icon="history" />
            </q-td>
        </template>

        <template v-slot:body-cell-verDetalle="props">
            <q-td>
                <q-btn flat label="Ver Detalle" lor="primary" @click="emit('update:detailRadicado', props.row)" />
            </q-td>
        </template>

        <template v-slot:no-data="{ message }">
            <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
                <img v-lazy :data-url="require('src/assets/filterImage.svg')" alt="" width="120" />
                <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
                    {{ message }}
                </span>
            </div>
        </template>

        <template v-slot:bottom>
            <div class="row tw-justify-between q-mt-md tw-w-[100%]">
                <div class="tw-flex tw-gap-x-3 tw-items-center">
                    <span>Filas</span>
                    <q-select outlined dense emitValue :options="[5, 20, 25, 50, 100]" v-model:model-value="rowsPerPage"
                        @update:model-value="handleFilas" />
                </div>
                <q-pagination v-model="numPage" max-pages="10" ellipsis color="primary" :max="totalPages" size="md"
                    direction-links boundary-links boundary-numbers @update:model-value="handlePage" />
                <div class="invisible"></div>
            </div>
        </template>
    </q-table>
    <q-dialog full-width v-model="trazaModal">
        <q-card class="q-pa-xl tw-w-[3000px]">
            <a @click="trazaModal = false" class="tw-text-primary tw-cursor-pointer" style="text-decoration: none;">
                <q-icon size="1.5em" name="chevron_left" color="primary" />
                <b>
                    Cerrar
                </b>
            </a>
            <Trazabilidad
      :doneItems="trazabilidadData"
    />
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { useAuthStore } from "stores/auth.store";
import { onMounted, ref, watch } from "vue";
import Trazabilidad from "src/pages/Expedientes/Trazabilidad/Trazabilidad.vue";
import moment from "moment";
import { sgdeaAxios } from "src/services";

const props = withDefaults(defineProps<{
    TABLE_BODY: any[],
    TABLE_HEADER: any[],
    icon?: string,
    keyId?: string,
    msgNoData?: string,
    rowId?: string,
    isSecondIcon?: boolean,
    secondIcon?: string,
    select: "none" | "single" | "multiple",
    totalPages: number
}>(), {
    select: "none",
    keyId: "codigo",
    secondIcon: "eye",
    // target: ""
})

const search = ref("");
const filteredData = ref([]);
const originData = ref([]);

const { getUserInfo } = useAuthStore();
const numPage = ref(1)
const pagination = ref({
    sortBy: 'fechaCreacion',
    descending: false,
    page: 1,
    rowsPerPage: 20
})

const trazabilidadData = ref()
const rowsPerPage = ref(20)
const selection = ref([])
const showingFullText = ref(false)
const trazaModal = ref(false)

const generalFilter = () => {
    filteredData.value = originData.value.filter((data) => {
        const fieldValues = Object.values(data).map(String);
        return fieldValues.some((value) =>
            value?.toLowerCase().includes(search.value?.toLowerCase())
        );
    });
};


async function getTrazabilidad(id) {
    const response = await sgdeaAxios.get('/trazabilidad/obtenerPorCodProceso/' + 'PRE' + id);
    if (!response?.data || response.data.length === 0) {
        trazabilidadData.value = [];
        return;
    }

    trazabilidadData.value = response.data.sort((a, b) => a.id - b.id).map((item, index) => ({
        ...item,
        fechaHora: moment(item.fechaHora).format('DD/MM/YYYY'),
    }));
    trazaModal.value = true
}

const isRolGestionador = ref(false)
const isAdmMaster = ref(false)
const isRolRadicadorVentanilla = ref(false)

const emit = defineEmits(['update:itemSelected', 'handleEditData', 'handleSecondIcon', 'update:filas', 'update:pages', 'update:detailRadicado', 'deleteCom', 'incluirExp', 'generarRadicado', 'adjuntarDoc'])

const editData = (id: number) => {
    emit('handleEditData', id)
}

watch(rowsPerPage, (value) => {
    pagination.value.rowsPerPage = rowsPerPage.value;
})

watch(selection, (newdateData) => {
    selection.value = newdateData
    emit('update:itemSelected', selection.value)
});

onMounted(async () => {
    isRolGestionador.value = (await getUserInfo()).role.includes('Gestionador');
    isAdmMaster.value = (await getUserInfo()).role.includes('Administrador Master');
    isRolRadicadorVentanilla.value = (await getUserInfo()).role.includes('Radicador - Ventanilla');
});

const collapseContent = (text = '') => {
    if (showingFullText.value) {
        return text;
    }
    return `${text?.slice(0, 200).trim()}`;
}

const handleFilas = () => {
    emit('update:filas', rowsPerPage.value)
}

const handlePage = () => {
    emit('update:pages', rowsPerPage.value, (numPage.value - 1))
}

watch(
    () => props.TABLE_BODY,
    (newValue, oldValue) => {
        originData.value = newValue;
        filteredData.value = newValue;
    }
);
</script>
