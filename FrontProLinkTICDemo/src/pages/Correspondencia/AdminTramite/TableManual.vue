<template>
  <div>
    <q-table
      flat
      :rows="rows"
      :columns="TABLE_HEADER"
      :row-key="keyId"
      table-header-class="text-black text-h6"
      :selection="select"
      class="q-mr-md full-width"
      hide-pagination
      v-model:pagination="pagination"
      v-model:selected="selection"
    >
      <template v-slot:body-cell-estados="props">
        <q-td class="tw-w-[125px]">
          <p
            :class="[
              'tw-border tw-h-[20px] tw-rounded-xl col-8',
              props.row.estados
                ? ' tw-border-green-700 tw-bg-green-100'
                : ' tw-border-gray-400 tw-bg-gray-200 tw-text-secondary',
            ]"
          >
            {{ props.row.estados ? "Activo" : "-" }}
          </p>
        </q-td>
      </template>

      <template v-slot:body-cell-estado="props">
        <q-td class="text-center">
          <div
            :class="[
              'tw-border tw-rounded-full q-my-sm tw-max-w-max q-px-md q-py-xs',
              !props.row?.tiempoXVencer ||
              props.row?.tiempoXVencer !== 'Vencido'
                ? 'tw-bg-orange-100 tw-border-orange-400'
                : 'tw-bg-red-100 tw-border-red-400 tw-text-red-500',
            ]"
          >
            {{ props.row?.estado || "-" }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-acciones="props">
        <q-td
          :class="`tw-flex tw-justify-center`"
          style="height: 100% !important"
        >
          <q-btn
            class="tw-w-auto tw-h-9 flex tw-bg-[#f2f4f5]"
            @click="editData(props.row.id)"
          >
            <span class="tw-px-2">{{ "Prueba" }}</span>
          </q-btn>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td class="text-center">
          <q-btn
            v-if="campoDeBusqueda !== '1'"
            size="sm"
            color="primary"
            icon="edit"
            flat
            @click="emit('edictarAsignador', [props.row, true])"
          >
            <q-tooltip> Editar Asignador </q-tooltip>
          </q-btn>

          <q-btn
            v-if="props.row.estado === 'Por aprobar'"
            size="sm"
            color="primary"
            icon="move_up"
            flat
            @click="emit('edictarAsignador', [props.row, false])"
          >
            <q-tooltip> Reemplazar Aprobador </q-tooltip>
          </q-btn>

          <q-btn
            v-if="props.row.estado === 'Por revisar'"
            size="sm"
            color="primary"
            icon="move_up"
            flat
            @click="emit('edictarAsignador', [props.row, false])"
          >
            <q-tooltip> Reemplazar revision </q-tooltip>
          </q-btn>
          <!--Button icons de Officiona-->
          <q-btn
            v-if="props.row.estado !== 'Por aprobar' &&  props.row.estado !== 'Por revisar'"
            size="sm"
            color="primary"
            icon="move_up'"
            flat
            @click="emit('edictarAsignador', [props.row, false])"
          >
            <q-tooltip> Reemplazar Consolidador/Gestionador. </q-tooltip>
          </q-btn>
          <q-btn
            v-if="tipoDeCaso === '3'"
            size="sm"
            color="primary"
            icon="move_up'"
            flat
            @click="emit('edictarAsignador', [props.row, false])"
          >
            <q-tooltip> Reclasificar trámite </q-tooltip>
          </q-btn>

          <q-btn
            v-if="tipoDeCaso === '2'"
            size="sm"
            color="primary"
            icon="move_up'"
            flat
            @click="emit('edictarAsignador', [props.row, false])"
          >
            <q-tooltip> Reemplazar Aprobador </q-tooltip>
          </q-btn>

          <q-btn
             v-if="(campoDeBusqueda === '3' || campoDeBusqueda === '2' || campoDeBusqueda === '1') || perfil === '6', props.row.clonado == true"
            size="sm"
            color="primary"
            icon="move_up"
            flat
            @click="emit('incluir', props.row)"
          >
            <q-tooltip>Incluir</q-tooltip>
          </q-btn>

          <q-btn
            v-if="(campoDeBusqueda === '3' || campoDeBusqueda === '2' || campoDeBusqueda === '1') || perfil === '6', props.row.clonado == true"
            size="sm"
            color="primary"
            icon="move_up"
            flat
            @click="emit('excluir', props.row)"
          >
            <q-tooltip>Excluir</q-tooltip>
          </q-btn>
          <!--<q-btn size="sm" color="primary" icon="delete" flat @click="emit('deleteCom', props.row.id)" />-->
          <q-btn

            size="sm"
            color="primary"
            icon="summarize"
            flat
            @click="emit('adjuntarDoc', props.row)"
          >
            <q-tooltip>Adjuntar documentos</q-tooltip>
          </q-btn>

          <q-btn
            v-if="((campoDeBusqueda === '2') || perfil == '6') && auth.$state.userInfo.role !== 'Asignador Responsable'"
            size="sm"
            color="primary"
            icon="cancel_presentation"
            flat
            @click="emit('anularTramite', props.row)"
          >
            <q-tooltip>Anular Trámite</q-tooltip>
          </q-btn>

          <q-btn

            size="sm"
            color="primary"
            icon="error_outline"
            flat
            @click="emit('verDatos', props.row)"
          >
            <q-tooltip>Ver Datos</q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template v-slot:no-data="{ icon, message }">
        <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
          <img v-lazy :data-url="NoData" alt="" width="120" />
          <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
            {{ msgNoData ? msgNoData : "No existe data por el momento" }}
          </span>
        </div>
      </template>

      <template v-slot:body-cell-procedimiento="props">
        <div class="tw-border-b-[1px] tw-w-96 tw-px-2">
          <p class="tw-text-center tw-border-0">
            {{ collapseContent(props.row.procedimiento) }}
          </p>
          <div
            class="tw-flex tw-justify-end"
            v-if="props.row.procedimiento?.length >= 200"
          >
            <q-btn
              flat
              color="secondary"
              @click="showingFullText = !showingFullText"
            >
              {{ showingFullText ? "Ver menos" : "Ver más" }}
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
          <q-btn
            flat
            color="primary"
            @click="getTrazabilidad(props.row)"
            icon="history"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-verDetalle="props">
        <q-td>
          <q-btn
            flat
            label="Ver Detalle"
            lor="primary"
            @click="emit('update:detailRadicado', props.row)"
          />
        </q-td>
      </template>
    </q-table>
    <div class="row justify-between q-mt-md" v-if="TABLE_BODY?.length > 0">
      <div class="tw-flex tw-gap-x-3 tw-items-center">
        <span>Filas</span>
        <q-select
          :options="[5, 20, 25, 50, 100]"
          v-model:model-value="rowsPerPage"
          dense
          outlined
          @update:model-value="handleFilas"
        />
      </div>
      <q-pagination
        v-model="numPage"
        color="primary"
        :max="totalPages"
        size="md"
        direction-links
        boundary-links
        boundary-numbers
        @update:model-value="handlePage"
      />
      <q-btn icon="refresh" type="button" flat class="invisible" />
    </div>
  </div>
  <q-dialog full-width v-model="trazaModal">
    <q-card class="q-pa-xl tw-w-[3000px]">
      <a
        @click="trazaModal = false"
        class="tw-text-primary tw-cursor-pointer"
        style="text-decoration: none"
      >
        <q-icon size="1.5em" name="chevron_left" color="primary" />
        <b> Cerrar </b>
      </a>
      <p class="tw-font-bold">Trazabilidad</p>
      <q-table
        flat
        :rows="trazabilidadData"
        :columns="trazabilidadColumns"
        :row-key="keyId"
        table-header-class="text-black text-h6"
        class="q-mr-md full-width tw-h-full"
        hide-pagination
        v-model:pagination="paginationTut"
      >
      </q-table>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useAuthStore } from "stores/auth.store";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
//@ts-ignore
import NoData from "assets/filterImage.svg";
import moment from "moment";
import { sgdeaAxios } from "src/services";

const props = withDefaults(
  defineProps<{
    TABLE_BODY: any[];
    TABLE_HEADER: any[];
    icon?: string;
    keyId?: string;
    msgNoData?: string;
    rowId?: string;
    isSecondIcon?: boolean;
    secondIcon?: string;
    select: "none" | "single" | "multiple";
    totalPages: number;
    buttonSelect: boolean;
    tipoDeCaso: string;
    campoDeBusqueda: string;
    perfil: string
    // buscar: string,
    // action: string,
    // target?: string,
  }>(),
  {
    select: "none",
    keyId: "codigo",
    secondIcon: "eye",
    campoDeBusqueda: '',
    perfil: ''
    // target: ""
  }
);
const rows = computed(() => props.TABLE_BODY);
const { getUserInfo } = useAuthStore();
const vuerouter = useRouter();
const route = useRoute();
const numPage = ref(1);
const pagination = ref({
  sortBy: "fechaCreacion",
  descending: false,
  page: 1,
  rowsPerPage: 20,
});
const paginationTut = ref({
  sortBy: "fecha",
  descending: true,
  page: 1,
  rowsPerPage: 20,
});

const trazabilidadData = ref();
const rowsPerPage = ref(20);
const selection = ref([]);
const showingFullText = ref(false);
const trazaModal = ref(false);
const auth = useAuthStore()

const trazabilidadColumns = ref([
  {
    name: "user",
    label: "Usuario",
    field: "nombre",
    align: "center",
    sortable: true,
  },
  {
    name: "action",
    label: "Acción",
    field: "descripcion",
    align: "center",
    sortable: true,
  },
  {
    name: "date",
    label: "Fecha",
    field: "fechaHora",
    align: "center",
    sortable: true,
  },
  {
    name: "status",
    label: "Estado",
    field: "estado",
    align: "center",
    sortable: true,
  },
  {
    name: "description",
    label: "Detalle",
    field: "descripcion",
    align: "center",
    sortable: true,
  },
]);

async function getTrazabilidad(details) {

  var proceso = "";
  var id = details.entidadId;



switch (details.idFlujo) {
  case "PQRD":
    proceso = "PQRD";

    break;
  case "ENTES_CONTROL":
    proceso = "ENTC";

    break
  case "TUTELAS":
    proceso = "TUT";

    break;
  case "MEDICINA_LABORAL":
    proceso = "ML";

    break;
  case "CORRESPONDENCIA_COMUNICACION":
    proceso = "COR";

    break;
  case "CORRESPONDENCIA_RADICACION":
    proceso = "COR";

    break;
  case "CORRESPONDENCIA_MANUAL":
    proceso = "COR";

    break;
  case "FACTURACION_ADMINISTRATIVA":
    proceso = "FAC";
    id = details.subEntidadId
    break;
  case "CUENTA_COBRO":
    proceso = "CTO";
    id = details.subEntidadId
    break;

  default:
    break;
}
  const response = await sgdeaAxios.get(
    "/trazabilidad/obtenerPorCodProceso/" + proceso + id
  );
  if (!response?.data || response.data.length === 0) {
    trazabilidadData.value = [];
    return;
  }

  trazabilidadData.value = response.data
    .sort((a, b) => a.id - b.id)
    .map((item, index) => ({
      ...item,
      fechaHora: moment(item.fechaHora).format("DD/MM/YYYY"),
    }));
  trazaModal.value = true;
}

const isRolGestionador = ref(false);

const emit = defineEmits([
  "refechSelectbuttonAll",
  "update:itemSelected",
  "handleEditData",
  "handleSecondIcon",
  "update:filas",
  "update:pages",
  "update:detailRadicado",
  "deleteCom",
  "incluirExp",
  "reclasificarTramite",
  "edictarAsignador",
  "adjuntarDoc",
  "anularTramite",
  "reemplazarAprobador",
  "reemplazarRevicion",
  "reemplazarConsolidador",
  "verDatos",
  "incluir",
  "excluir"
]);

const editData = (id: number) => {
  emit("handleEditData", id);
};

watch(
  () => props.buttonSelect,
  (value, olValue) => {
    if (value && value != olValue) {
      selection.value = props.TABLE_BODY;
    }
  }
);

watch(rowsPerPage, (value) => {
  pagination.value.rowsPerPage = rowsPerPage.value;
});

watch(selection, (newdateData) => {
  selection.value = newdateData;
  emit("update:itemSelected", selection.value);
  emit("refechSelectbuttonAll", false);
});

onMounted(async () => {
  isRolGestionador.value = (await getUserInfo()).role.includes("Gestionador");
});

function editRow(id: number) {
  vuerouter.push(route.path + "/editar/" + id);
}

function viewDetails(id: number) {
  vuerouter.push(route.path + "/visualizacion/" + id);
}

const collapseContent = (text = "") => {
  if (showingFullText.value) {
    return text;
  }
  return `${text?.slice(0, 200).trim()}`;
};

const handleFilas = () => {
  emit("update:filas", rowsPerPage.value);
};

const handlePage = () => {
  emit("update:pages", rowsPerPage.value, numPage.value - 1);
};
</script>
