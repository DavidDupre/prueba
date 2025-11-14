<template>
  <div>
    <div class="tw-float-right"
      v-if="auth.$state.userInfo.role.toLowerCase() === 'asignador responsable' && selection && selection.length > 1">
      <button @click="() => asignarMasivo = true"
        class="tw-bg-[#ff7500] tw-p-3 tw-text-white tw-font-bold tw-rounded-lg hover:tw-bg-[#dc7347]">Asignación
        Masiva</button>
    </div>
    <div class='tw-mb-6'>
      <p class="pl-4 tw-font-bold tw-text-3xl tw-mt-5 tw-mb-3 text-bold">PQRD</p>
    </div>
    <q-card flat class="tw-p-4 tw-mb-6 tw-rounded-xl">
      <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2">Filtrar por</h2>
      <div class="tw-grid tw-grid-cols-3 tw-gap-4">
        <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
          <label class="tw-w-full">
            <p class="tw-text-label tw-font-semibold">Estado</p>
            <q-select v-model="formData.estado" :options="optionsEstados" emit-value label="Seleccione" dense outlined
              class="tw-rounded-lg" use-input map-options fill-input hide-selected input-debounce="0"
              @filter="filterEstado">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template> </q-select>
          </label>
        </div>
        <div class="tw-col-span-1">
          <p class="tw-text-label tw-font-semibold">Número de Radicado</p>
          <q-select v-model="formData.numero" emit-value map-options outlined dense use-input hide-selected fill-input
            input-debounce="0" label="Inserte" :options="radicadoOptions" @filter="filterRa"
            :rules="[v => maxLengthInput(50, v), alphanumeric]" @input-value="v => formData.numero = v">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="tw-col-span-1">
          <div class="tw-w-full">
            <p class="tw-text-label tw-font-semibold">Fecha de Vencimiento</p>
            <Datepicker mask="DD-MM-YYYY" label="dd / mm / aaaa" :options="optionsDateFunc"
              v-model:input-data-prop="formData.vencimiento" @valida-fecha="true" future :required-valitation="false" />
          </div>
        </div>
      </div>
      <br />
      <div class="row tw-flex tw-justify-center tw-gap-6 [&>*]:tw-p-2">
        <q-btn label="Limpiar filtros" color="accent" textColor="black" class="tw-rounded-lg col-2"
          @click="resetForm" />
        <q-btn label="Buscar" color="primary" class="tw-rounded-lg col-2" @click="search" />
      </div>
    </q-card>
    <q-card flat class="tw-p-4 tw-rounded-xl">
      <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2">Listado de Casos</h2>
      <div :key="key" class="my-custom-table">
        <TablePQRD :key="tableKey" :TABLE_HEADER="TABLE_HEADER" :TABLE_BODY="dataTable"
          :TABLE_TOTAL_ROWS="dataTableTotalRows" :selection="undefined" :isLoading="loadingTable"
          :pagination.sync="pagination" v-model:item-selected="selection" @handle-edit-data="handleCaso"
          @handleRowdblclick="handleCaso" @handlePageChange="handlePageChange"
          @handleRowsPerPageChange="handleRowsPerPageChange" :label-data="filterNotLength" />
      </div>
    </q-card>
  </div>
  <q-dialog persistent full-width v-model="asignarMasivo">
    <q-card class="q-pa-xl tw-w-[3000px]">
      <AsignacionMasiva @close-modal="() => { asignarMasivo = false; selection = []; tableKey++ }" @assigned="getData"
        :pqr-data="selection" />
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import Datepicker from 'components/FormFields/datePickerComponent.vue';
import moment from 'moment';
import { useQuasar } from 'quasar';
import TablePQRD from 'src/components/Tables/TablePQRD.vue';
import { toast } from 'src/helpers/toast';
import { SelectInput } from 'src/interfaces';
import { sgdeaAxios } from 'src/services';
import { useAuthStore } from 'src/stores/auth.store';
import { Ref, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from "vue-router";
import { ASIGNACION_HEADER } from "./";
import AsignacionMasiva from './asignacionMasiva.vue';
import { alphanumeric, maxLengthInput } from 'src/helpers/validations';

interface PQRD {
  estado: string;
  numero: string;
  tipoTramite: string;
  ciudad: string;
  pageNo: number;
  pageSize: number;
  vencimiento: string
}

const auth = useAuthStore()

const TABLE_HEADER = ref([]);
let loadingTable = ref(false);
const router = useRouter();
const key = ref(0);
const asignarMasivo = ref(false)
const selection = ref([]);
const dataTable = ref([]);
const dataTableTotalRows = ref(0);
const tableKey = ref(0)
const radicadoOptions = ref([])
const opForRadicados = ref([])
let pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0
});

const optionsEstados = ref<SelectInput[]>([]);
const opsEstados = ref(<SelectInput[]>[]);
const optionsTipoTramite = ref<SelectInput[]>([]);
const optionsCiudades = ref<SelectInput[]>();
const filterNotLength = ref(false)
const formData: Ref<PQRD> = ref({
  estado: '',
  numero: '',
  tipoTramite: '',
  ciudad: '',
  pageNo: 0,
  pageSize: 20,
  rowsPerPage: 20,
  vencimiento: ''
});
onUnmounted(() => {
  q.iconSet.table.arrowUp = 'arrow_upward'
})
onMounted(async () => {
  q.iconSet.table.arrowUp = 'import_export'
  // @ts-expect-error
  await Promise.allSettled([
    getEstados(),
    getCiudades(),
    getTiposSolicitud(),
    getData(0, 20),
  ])
});

async function getEstados() {
  const { data } = await sgdeaAxios.get('/estadosProceso/all')
  const estadosValues = auth.$state.userInfo.role == "Defensor del Consumidor"
    ? [5, 11]
    : [1, 3, 4, 5, 7, 8, 9, 11, 13];
  opsEstados.value = data.filter((e) => estadosValues.includes(e.id)).sort((a, b) => a.estado.localeCompare(b.estado)).map((estado: any) => ({
    label: estado.estado,
    value: estado.id
  }));
}

async function getTiposSolicitud() {
  const { data } = await sgdeaAxios.get('/pqrd/listadoTiposSolicitud')
  optionsTipoTramite.value = data.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((tipo: any) => ({
    label: tipo.nombre,
    value: tipo.id
  }));
}

async function getCiudades() {
  const { data } = await sgdeaAxios.get('pqrd/listadoMunicipios?departamentoID=0');
  optionsCiudades.value = data.sort((a, b) => a.nombre.localeCompare(b.nombre)).map(({ nombre, idMunicipio }) => {
    return {
      label: nombre,
      value: idMunicipio
    };
  });
}

const getData = async (page: number, size: number) => {
  if (auth.$state.userInfo.role == 'Aprobador' || auth.$state.userInfo.role == 'Gestionador') {
    TABLE_HEADER.value = ASIGNACION_HEADER
  } else {
    TABLE_HEADER.value = ASIGNACION_HEADER.filter(item => item.name !== 'tiempoAprobador');
  }

  try {
    loadingTable.value = true;
    let otherParams = {}

    switch (auth.$state.userInfo.role.toLowerCase()) {
      case 'asignador responsable':
        otherParams = { idUsuario: auth.userInfo.userid, tipoUsuario: 'ASIGNADOR', idEstado: 1 };
        break
      case 'gestionador consolidador':
        otherParams = { idUsuario: auth.$state.userInfo.userid, tipoUsuario: 'GESTIONADOR_CONSOLIDADOR' };
        break
      case 'gestionador' || 'gestionador escalador':
        otherParams = { idUsuario: auth.$state.userInfo.userid, tipoUsuario: 'GESTIONADOR' };
        break
      case 'aprobador':
        otherParams = { idUsuario: auth.$state.userInfo.userid, tipoUsuario: 'APROBADOR' };
        break
      case 'revisor':
        otherParams = { idUsuario: auth.$state.userInfo.userid, tipoUsuario: 'REVISOR' };
        break
      case 'defensor del consumidor':
        otherParams = { idUsuario: auth.$state.userInfo.userid, tipoUsuario: 'DEFENSOR_CONSUMIDOR' };
        break
      case 'administrador master':
        otherParams = { tipoUsuario: 'ADMINISTRADOR' };
        break
      default:
        otherParams = { tipoUsuario: 'ADMINISTRADOR' };
        break
    }

    let filterParams = {}
    const role = auth.$state.userInfo.role.toLowerCase();

    if (formData.value?.numero) {
      filterParams.numeroRadicado = formData.value?.numero.trim()
    }

    if (formData.value.vencimiento) {
      filterParams.fechaVencimiento = formData.value.vencimiento
    }

    if (formData.value?.estado) {
      filterParams.idEstado = formData.value?.estado
    }

    const requestParams = {
          ...otherParams,
          ...filterParams,
          pageNo: page,
          pageSize: size,
          isCounter: false,
          buscador: '',
          ...(role === "asignador responsable" && { oficinaId: auth.$state.userInfo.oficina }),
          dependenciaId: role === "asignador responsable" ? auth.$state.userInfo.dependencia : 0,
        };

    const { data } = await sgdeaAxios.get('/pqrd/obtenerListadoCasos', { params: { ...requestParams } })
    filterNotLength.value = false
    if (!data && auth.$state.userInfo.role == "Defensor del Consumidor" && Object.keys(filterParams).length !== 0) {
      toast.error("No se encontraron datos con los criterios ingresados, Por favor verifique e intente nuevamente")
      filterNotLength.value = true
    }
    dataTableTotalRows.value = data.totalPage;
    if (data.elementos) {
      dataTable.value = data.elementos.map((item: any) => ({
        anulacionConReinicio: item.anulacionConReinicio,
        fechaAnulacion: item.fechaAnulacion,
        canal_radication: item.canalRadicacion ?? "",
        numero: item.idRadicado ?? "",
        fecha_radicacion: moment(item.fechaRadicacion, 'DD/MM/YYYY hh:mm a').format('DD/MM/YYYY HH:mm'),
        tiempo: item.tiempoAsignado,
        diasPorVencer: item.diasPorVencer,
        fechaDeVencimiento: moment(item.fechaDeVencimiento).add(9, 'hour').format('DD/MM/YYYY'),
        nombre_afectado: item.nombreAfectado ?? "",
        remitente: item.remitente ?? "",
        city: item.ciudad ?? "",
        department: item.departamento ?? "",
        tramite_type: item.tipologia == 'PQRD Express' ? 'PQRD Express' : 'PQRD',
        trazabilidad: "",
        estado: item.isEscalamiento ? 'Escalado' : item.estado ? (item.estado.charAt(0).toUpperCase() + item.estado.slice(1).toLowerCase()) : 'N/A',
        acciones: item.isEscalamiento == true ? 'Gestionar escalado' : (item.isClonado && Boolean(item.idConsolidador) && auth.$state.userInfo.userid === item.idConsolidador) ? 'Por consolidar' : 'Gestionar',
        id: item.id,
        idAsignacion: item.idAsignacion,
        clonado: item.isClonado,
        isConsolidador: item.isClonado && Boolean(item.idConsolidador) && auth.$state.userInfo.userid === item.idConsolidador,
        isEscalamiento: item.isEscalamiento,
        fechaRevisor: item.fechaRevisor,
        fechaAprobador: item.tiempoAsignadoAprobador ?? 'N/A',
        identificacionAfectado: item.identificacionAfectado,
        identificacionRemitente: item.identificacionRemitente,
        solicitudRechazo: item.solicitudRechazo,
        reclasificacionRechazada: item.reclasificacionRechazada
      }));
    }

    if (auth.$state.userInfo.role == 'Defensor del Consumidor') {
      dataTable.value = dataTable.value.filter(item => item.canal_radication === 'Defensor del consumidor');

      dataTable.value.sort((a, b) => {
        if (a.fechaRevisor && b.fechaRevisor) {
          const parseDate = (fecha) => new Date(fecha.replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$2-$1'));
          // @ts-expect-error
          return parseDate(a.fecha_radicacion) - parseDate(b.fecha_radicacion);
        }
      })
    }

    if (auth.$state.userInfo.role.includes('Gestionador')) {
      dataTable.value.sort((a, b) => {
        if (a.estado == 'Escalado' && b.estado != 'Escalado') {
          return -1;
        }
        if (a.fechaRevisor && b.fechaRevisor) {
          // @ts-expect-error
          return new Date(a.fechaRevisor) - new Date(b.fechaRevisor);
        }
        if (a.fechaRevisor && !b.fechaRevisor) {
          return -1;
        }
        if (!a.fechaRevisor && b.fechaRevisor) {
          return 1;
        }
      })
    }

    opForRadicados.value = dataTable.value.map(({ numero }) => ({ label: numero, value: numero }));
    loadingTable.value = false;

  } catch (error) {
    dataTable.value = [];
    loadingTable.value = false;
    console.error(error);
  }
}

const handleCaso = ({ id, idAsignacion }) => {
  let url = `/pqrd/informacion/${id}`
  if (idAsignacion) {
    url = url + `?idAsignacion=${idAsignacion}`
  }
  router.push(url)
}

const resetForm = () => {
  formData.value = {
    estado: '',
    numero: '',
    tipoTramite: '',
    ciudad: '',
    pageNo: 1,
    pageSize: 20,
    vencimiento: ''
  }
  pagination.value = {
    sortBy: "desc",
    descending: false,
    page: 1,
    rowsPerPage: 20,
    rowsNumber: 0
  };
  getData(0, 20);
};

const q = useQuasar();

const search = async () => {
  const filter = {
    estado: formData.value?.estado,
    numero: formData.value?.numero,
    fechaVencimiento: formData.value?.vencimiento,
    ciudad: formData.value?.ciudad,
  };

  if (Object.values(filter).every(val => !val)) {
    toast.error("Por favor, seleccione al menos un filtro.");
    return;
  }

  await getData(0, 20);
}

const handlePageChange = async (event) => {
  await getData(event.page - 1, event.rowsPerPage);
}

const handleRowsPerPageChange = async (event) => {
  await getData(event.page, event.rowsPerPage);
}

function optionsDateFunc(date) {
  return true
}

const validate = ref({
  fecha: false,
  hora: false,
});

const normalizeString = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

const filterRa = (val, update) => {
  if (val === '') {
    update(() => {
      radicadoOptions.value = opForRadicados.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    radicadoOptions.value = opForRadicados.value.filter(v => v.value.toLowerCase().indexOf(needle) > -1)
  })
}

const filterEstado = (val, update) => {
  if (val === '') {
    update(() => {
      optionsEstados.value = opsEstados.value
    })
    return
  }

  const needle = normalizeString(val);
  update(() => {
    optionsEstados.value = opsEstados.value.filter(v => {
      return normalizeString(v.label).indexOf(needle) > -1;
    });
  });
}

</script>

<style scoped lang="scss">
.my-custom-table {
  &::v-deep {
    .q-table__sort-icon {
      opacity: 1;
    }

    th {
      text-align: center;
    }
  }
}
</style>
