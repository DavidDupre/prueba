
<template>
    <div>
        <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId" table-header-class="text-black text-h6"
            :selection="select" class="q-mr-md full-width" hide-pagination v-model:pagination="pagination" v-model:selected="selection">
            <template v-slot:body-cell-usuarios="props">
              <q-td class="" :props="props">
                  <q-avatar>
                    <q-icon name="account_circle" color="primary" />
                  </q-avatar>
                  {{ props.row.usuarios }}
                  <br />
                  {{ props.row.tiposUsuarios }}
              </q-td>
            </template>
            <template v-slot:no-data="{ icon, message, filter }">
                <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
                    <img v-lazy :data-url="NoData" alt="" width="120" />
                    <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
                    {{ msgNoData ? msgNoData : "No existe data por el momento" }}
                    </span>
                </div>
            </template>
        </q-table>
        <div class="row justify-between q-mt-md" v-if="TABLE_BODY?.length > 0">
            <div class="tw-flex tw-gap-x-3 tw-items-center">
                <span>Filas</span>
                <q-select :options="[5, 25, 50, 100]" v-model:model-value="rowsPerPage" dense outlined />
            </div>
            <q-pagination v-model="pagination.page" color="primary" :max="pagesNumber" size="md" direction-links
                boundary-links boundary-numbers />
            <q-btn icon="refresh" type="button" flat class="invisible" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import NoData from "assets/filterImage.svg"
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
}>(), {
    select: "none",
    keyId: "codigo",
    secondIcon: "eye",
})
const pagination = ref({
    sortBy: 'fecha',
    descending: true,
    page: 1,
    rowsPerPage: 5
})

const rowsPerPage = ref(5)
const selection = ref([])
const showingFullText = ref(false)

let pagesNumber = computed(() => Math.ceil(props.TABLE_BODY.length / rowsPerPage.value))

const emit = defineEmits(['update:itemSelected', 'handleEditData', 'handleSecondIcon'])

watch(rowsPerPage, (value) => {
    pagination.value.rowsPerPage = value;
})

watch(selection, (newdateData) => {
    selection.value = newdateData
    emit('update:itemSelected', selection.value)
});
</script>

<style lang="scss" scoped></style>

