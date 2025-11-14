<template>
    <div>
        <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId"
            table-header-class="text-black text-h6" :selection="select" class="q-mr-md full-width" hide-pagination
            v-model:pagination="pagination" v-model:selected="selection" color="primary">

            <template v-slot:no-data="{ icon, message }">
                <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
                    <img v-lazy :data-url="NoData" alt="" width="120">
                    <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
                        {{ msgNoData ? msgNoData : 'No existe data por el momento' }}
                    </span>
                </div>
            </template>

        </q-table>
        <div class="row items-center q-mt-md" v-if="TABLE_BODY?.length > 0">
            <!-- Filas -->
            <div class="col-auto tw-flex tw-gap-x-3 tw-items-center">
                <span>Filas</span>
                <q-select :options="[5, 20, 25, 50, 100]" v-model:model-value="rowsPerPage" dense outlined />
            </div>

            <!-- Paginación centrada -->
            <div class="col tw-flex tw-justify-center">
                <q-pagination v-model="pagination.page" color="primary" :max="pagesNumber" :max-pages="6" size="md"
                    direction-links boundary-links boundary-numbers />
            </div>

            <!-- Texto a la derecha -->
            <div class="col-auto tw-flex tw-items-center tw-gap-x-2 tw-text-right">
                {{ paginationMessage }}
                <q-btn icon="refresh" type="button" flat class="invisible" />
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

//@ts-ignore
import NoData from "assets/filterImage.svg"

const props = withDefaults(defineProps<{
    TABLE_BODY: any[],
    TABLE_HEADER: any[],
    icon?: string,
    keyId?: any,
    msgNoData?: string,
    rowId?: string,
    isSecondIcon?: boolean,
    secondIcon?: string,
    select: "none" | "single" | "multiple",
    TABLE_TOTAL_PAGES: number,
    isConsultas: boolean
    paginationMessage?: string;
}>(), {
    select: "none",
    keyId: "codigo",
    secondIcon: "eye",
    isConsultas: false
})

const userInfo = ref()
const sortFor = ref()
const pagination = ref({
    page: 1,
    rowsPerPage: 20,
    sortBy: sortFor.value,
    descending: false,
})
const rowsPerPage = ref(20)
const selection = ref([])

const findRoles = (role) => {
    var nomenclatura = [
        'Administrador', //0
        'Asignador Responsable', //1
        'aprobador_sgdea', //2
        'Gestionador', //3
        'Radicador - Web', //4
        'Aprobador' //5
    ]
    var valid = false
    role.forEach(element => {
        if (userInfo.value?.role?.includes(nomenclatura[element])) {

            valid = true
        }
    });
    return valid
}


let pagesNumber = computed(() => Math.ceil(props.TABLE_BODY.length / rowsPerPage.value))

const emit = defineEmits(['update:itemSelected', 'handleEditData', 'handleSecondIcon', 'update:filas', 'update:pages'])

watch(rowsPerPage, (value) => {
    pagination.value.rowsPerPage = value;
})

watch(selection, (newdateData) => {
    selection.value = newdateData
    emit('update:itemSelected', selection.value)
});

onMounted(async () => {
    if (findRoles([1])) {
        pagination.value.sortBy = 'fechaRadicacion'
    }
    if (findRoles([3, 0])) {
        pagination.value.sortBy = null
    }
    if (findRoles([5])) {
        pagination.value.sortBy = 'fechaRadicacion'
    }
});

</script>
