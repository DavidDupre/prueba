
<template>
    <div>
        <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId" table-header-class="text-black text-h6"
            :selection="select" class="q-mr-md full-width" hide-pagination v-model:pagination="pagination" v-model:selected="selection" color="primary" >
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

            <template v-slot:body-cell-asignaciones="props">
                <q-td class="tw-w-[125px]">
                    <p :class="[
                        'tw-border tw-h-[20px] tw-rounded-xl col-8',
                        props.row.escalado ? ' tw-border-green-700 tw-bg-green-100' : ' tw-border-gray-400 tw-bg-gray-200 tw-text-secondary'
                    ]">
                    {{ props.row.asignaciones.etapa }}
                        {{  props.row.escalado ? 'Si' : 'No' }}
                    </p>
                </q-td>
            </template>

            <template v-slot:body-cell-estado="props">
                <q-td class="text-center">
                    <div v-if="props.row.estado != 'Por Aprobar' && props.row.estado != 'Aprobación rechazada'" :class="[
                        'tw-border tw-rounded-full q-my-sm tw-max-w-max q-px-md q-py-xs',
                        tiempoVencer(props.row.tiempoVencer) ? 'tw-bg-orange-100 tw-border-orange-400' : 'tw-bg-red-100 tw-border-red-400 tw-text-red-500'
                    ]">
                        {{ props.row.estadoEnvios?.nombre }}
                    </div>
                    <div v-else :class="[
                        'tw-border tw-rounded-full q-my-sm tw-max-w-max q-px-md q-py-xs tw-bg-sky-200 tw-border-slate-400 tw-text-slate-500'
                    ]">
                        {{ props.row.estadoEnvios?.nombre }}
                    </div>
                </q-td>
            </template>

            <template v-slot:body-cell-escaladores="props">
                <q-td class="text-center">
                    {{ props.row.escaladores?.join(' / ') || '-' }}
                </q-td>
            </template>

            <template v-slot:body-cell-acciones="props">
                <q-td class="text-center">
                    <q-btn flat color="primary" @click="editData(props.row.nodeId)" icon="inventory_2">
                    </q-btn>
                </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
                <q-td class="text-center">
                    <q-btn size="sm" color="primary" :icon="icon || 'visibility'" flat @click="editData(props.row.id, false)" />
                    <q-btn size="sm" color="secondary" :icon="secondIcon" flat v-if="isSecondIcon"
                        @click="handleSecondIcon(props.row[rowId])" />
                </q-td>
            </template>

            <template v-slot:no-data="{ icon, message }">
                <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
                    <img v-lazy :data-url="NoData" alt="" width="120">
                    <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
                        {{ msgNoData ? msgNoData : 'No existe data por el momento' }}
                    </span>
                </div>
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
                    <q-btn flat color="primary" @click="getTrazabilidad(props.row.flujoSgda,props.row.id)" icon="history">
                    </q-btn>
                </q-td>
            </template>


            <template v-slot:body-cell-docs="props">
                <q-td>
                    <q-btn flat color="secondary" @click="$router.push('/bandeja/carpeta/entrada/' + props.row.id)"
                        icon="folder">
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
            <Trazabilidad

      :doneItems="trazabilidadData"
    />

    </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import Trazabilidad from "src/pages/Expedientes/Trazabilidad/Trazabilidad.vue";
import { useAuthStore } from "stores/auth.store";

//@ts-ignore
import NoData from "assets/filterImage.svg"
import { sgdeaAxios } from "src/services";
import moment from "moment";
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
    TABLE_TOTAL_PAGES: number
    // buscar: string,
    // action: string,
    // target?: string,
}>(), {
    select: "none",
    keyId: "codigo",
    secondIcon: "eye",
    // target: ""
})
const { getUserInfo, getUserRoles, setUserRole } = useAuthStore();
const userInfo = ref()
const sortFor = ref()
const pagination = ref({
    page: 1,
    rowsPerPage: 20,
    sortBy: sortFor.value,
    descending: false,
})

const trazabilidadData = ref()
const rowsPerPage = ref(20)
const selection = ref([])
const showingFullText = ref(false)
const trazaModal = ref(false)
const isRolAprobador = ref(false)

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
const flujoPrefixes = {
  1: "COR",
  5: "PQRD",
  3: "FAC",
  4: "CTO",
  8: "ML",
  6: "TUT",
  7: "ENTC"
};

async function getTrazabilidad(flujo, id){
  const currentPrefix = flujoPrefixes[flujo.id] || "N/A";
const caso = await sgdeaAxios.get(`/envios/obtenerCaso/${id}`)
  const response = await sgdeaAxios.get('/trazabilidad/obtenerPorCodProceso/' + currentPrefix + caso.data.idCaso);
  if (!response?.data || response.data.length === 0) {
            trazabilidadData.value = [];
            return;
        }

  trazabilidadData.value = response.data.sort((a, b) => a.id - b.id).map((item, index) => ({
            ...item,
            fechaHora: moment(item.fechaHora).format('DD/MM/YYYY HH:mm'),
        }));
        trazaModal.value = true
}

let pagesNumber = computed(() => Math.ceil(props.TABLE_BODY.length / rowsPerPage.value))
const isRolGestionador = ref(false)

const tiempoVencer = (time) => time !== 'Vencido' && !time?.includes('horas');

const emit = defineEmits(['update:itemSelected', 'handleEditData', 'handleSecondIcon', 'update:filas', 'update:pages'])

const editData = (id: number) => {
    emit('handleEditData', id)
}

const handleSecondIcon = (id: number) => {
    emit('handleSecondIcon', id)
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
    pagination.value.sortBy = 'tiempoPorVencer'
  }
  if (findRoles([5])) {
    pagination.value.sortBy = 'fechaRadicacion'
  }
});

const collapseContent = (text = '') => {
    if (showingFullText.value) {
        return text;
    }
    return `${text?.slice(0, 200).trim()}`;
}

</script>

