
<template>
    <div>
        <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId" table-header-class="text-black text-h6"
            :selection="select" class="q-mr-md full-width" hide-pagination v-model:pagination="pagination" v-model:selected="selection" color="primary" >

            <template v-slot:no-data="{ icon, message }">
                <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
                    <img v-lazy :data-url="NoData" alt="" width="120">
                    <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
                        {{ msgNoData ? msgNoData : 'No existe data por el momento' }}
                    </span>
                </div>
            </template>

            <template v-slot:body-cell-acciones="props">
                <q-td class="text-center">
                    <q-btn class="tw-w-auto tw-h-9 " @click="editData(props.row)">
                        <span class="tw-px-2"> Seleccionar</span>
                    </q-btn>
                  </q-td>
            </template>

        </q-table>
        <div class="row justify-between q-mt-md" v-if="TABLE_BODY?.length > 0">
            <div class="tw-flex tw-gap-x-3 tw-items-center">
                <span>Filas</span>
                <q-select :options="[5, 20, 25, 50, 100]" v-model:model-value="rowsPerPage" dense outlined />
            </div>
            <q-pagination v-model="pagination.page" color="primary" :max="pagesNumber" :max-pages="6" size="md" direction-links
                boundary-links boundary-numbers />
            <q-btn icon="refresh" type="button" flat class="invisible" />
        </div>
    </div>
    <q-dialog full-width v-model="trazaModal">
      <q-card class="q-pa-xl tw-w-[3000px]">
        <a @click="trazaModal = false" class="tw-text-primary" style="text-decoration: none;">
            <q-icon size="1.5em" name="chevron_left" color="primary"/>
            <b>
                Volver
            </b>
        </a>
        <q-table flat :rows="trazabilidadData" :columns="trazabilidadColumns" :row-key="keyId" table-header-class="text-black text-h6"
            class="q-mr-md full-width tw-h-full" hide-pagination v-model:pagination="paginationTut"> </q-table>
    </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useAuthStore } from "stores/auth.store";

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
    // buscar: string,
    // action: string,
    // target?: string,
}>(), {
    select: "none",
    keyId: "codigo",
    secondIcon: "eye",
    isConsultas: false
    // target: ""
})
const { getUserInfo } = useAuthStore();
const userInfo = ref()
const sortFor = ref()
const pagination = ref({
    page: 1,
    rowsPerPage: 20,
    sortBy: sortFor.value,
    descending: false,
})
const paginationTut = ref({
    page: 1,
    rowsPerPage: 20
})

const trazabilidadData = ref()
const rowsPerPage = ref(20)
const selection = ref([])
const trazaModal = ref(false)
const isRolAprobador = ref(false)

const trazabilidadColumns = ref([
  {
    name: "user",
    label: "Usuario",
    field: "nombre",
    align: "center",
    sortable: true
  },
  {
    name: "action",
    label: "Acción",
    field: "descripcion",
    align: "center",
    sortable: true
  },
  {
    label: "Trámite",
    field: (row) => 'Tutela',
    align: "center",
    sortable: true,
    name: "tramite",
  },
//   {
//     label: "Oficina del usuario",
//     field: row => row.oficina ?? '-',
//     align: "center",
//     sortable: true,
//     name: "oficina"
//   },
  {
    name: "date",
    label: "Fecha",
    field: "fechaHora",
    align: "center",
    sortable: true
  },{
    name: "status",
    label: "Estado",
    field: "estado",
    align: "center",
    sortable: true
  },
  {
    name: "description",
    label: "Detalle",
    field: "detalle",
    align: "center",
    sortable: true
  },
])

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
const isRolGestionador = ref(false)

const emit = defineEmits(['update:itemSelected', 'handleEditData', 'handleSecondIcon', 'update:filas', 'update:pages'])

const editData = (proceso) => {
    emit('handleEditData', proceso)
}

watch(rowsPerPage, (value) => {
    pagination.value.rowsPerPage = value;
})

watch(selection, (newdateData) => {
    selection.value = newdateData
    emit('update:itemSelected', selection.value)
});

onMounted(async () => {
  userInfo.value = await getUserInfo();
  isRolGestionador.value = (await getUserInfo()).role.includes('Gestionador');
  isRolAprobador.value = (await getUserInfo()).role == 'Aprobador';

  if (findRoles([1])) {
    pagination.value.sortBy = 'fechaRadicacion'
  }
  if (findRoles([3,0])) {
    pagination.value.sortBy = null
  }
  if (findRoles([5])) {
    pagination.value.sortBy = 'fechaRadicacion'
  }
});

</script>

