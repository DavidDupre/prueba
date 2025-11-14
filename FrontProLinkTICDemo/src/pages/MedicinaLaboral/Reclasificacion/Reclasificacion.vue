<template>
  <div class="q-my-md">
    <div class="tw-flex tw-justify-between tw-items-center">
      <span class="tw-font-bold tw-text-3xl tw-my-5">Solicitudes de reclasificación</span>
    </div>

    <q-card class="tw-rounded-xl tw-p-4" flat bordered>
      <q-expansion-item default-opened>
        <template v-slot:header>
          <div class="col row">
            <b class="tw-text-lg">Filtrar por</b>
          </div>
        </template>
        <q-card>
          <div class="row q-col-gutter-md q-pb-md q-px-md">
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <label class="tw-w-full">
                <span class="tw-text-label">Fecha de Vencimiento</span>
                <Datepicker v-model:input-data-prop='filtro.tiempoPorVencer' label="Seleccione"
                  :required-valitation="false" dense mask="DD/MM/YYYY" />
              </label>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <label class="tw-w-full">
                <span class="tw-text-label">Tipo de trámite</span>
                <q-select v-model="filtro.idTipoTramite" :options="filteredTiposPQRD" emit-value label="Seleccione"
                  dense outlined class="tw-rounded-lg" @filter="selectOptionsFilterFnTramite" use-input map-options
                  fill-input hide-selected input-debounce="0">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No hay resultados
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </label>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <label class="tw-w-full">
                <span class="tw-text-label">Oficina</span>
                <q-select v-model="filtro.idOficina" :options="filteredOficinas" emit-value label="Seleccione" dense
                  outlined class="tw-rounded-lg" @filter="selectOptionsFilterFnOficinas" use-input map-options
                  fill-input hide-selected input-debounce="0">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No hay resultados
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </label>
            </div>
          </div>
          <div class="row tw-flex tw-justify-center tw-gap-6 [&>*]:tw-p-2">
            <q-btn label="Limpiar filtros" color="accent" textColor="black" class="tw-rounded-lg col-2"
              @click="resetForm" />
            <q-btn label="Buscar" color="primary" class="tw-rounded-lg col-2" @click="handleSearch" />
          </div>
        </q-card>
      </q-expansion-item>
    </q-card>
    <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat bordered>
      <div class="flex items-center justify-between q-px-md">
        <span class="text-weight-bold text-h6" style="color: #2c3948">Listado de casos pendientes por
          reclasificación</span>
      </div>
      <TableReclasificacion :TABLE_HEADER="RECLASIFICACION_HEADER" :TABLE_BODY="dataTable"
        :TABLE_TOTAL_ROWS="dataTableTotalRows" :selection="undefined" :isLoading="loadingTable"
        :pagination.sync="pagination" @handlePageChange="handlePageChange"
        @handleRowsPerPageChange="handleRowsPerPageChange" />
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import { sgdeaAxios } from 'src/services';
import { onMounted, ref } from 'vue';
import { RECLASIFICACION_HEADER } from './index'
import TableReclasificacion from './Table.vue';
import Datepicker from 'components/FormFields/datePickerComponent.vue';
import { useAuthStore } from 'src/stores/auth.store';
import { toast } from 'src/helpers/toast';

const auth = useAuthStore();
const tiposPQRD = ref([]);
const filteredTiposPQRD = ref([])
const oficinas = ref([]);
const filteredOficinas = ref([])
const dataTableTotalRows = ref(0);
let loadingTable = ref(false);
const filtro = ref<any>({
  idOficina: null,
  tiempoPorVencer: null,
  idTipoTramite: null,
  page: 0,
  size: 20
});
let pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 0,
  rowsPerPage: 20,
  rowsNumber: 0
});
const dataTable = ref<any[]>([]);

onMounted(async () => {
  await initData();
});

async function initData() {
  await getTiposPQRD();
  await getOficinas();
  await getData();
}

async function getTiposPQRD() {
  try {
    const { data } = await sgdeaAxios.get(`reclasificacion/listadoTiposTramite`);
    tiposPQRD.value = data.sort((a, b) => a.nombreTramite.localeCompare(b.nombreTramite)).map(({ nombreTramite, id }) => {
      return {
        label: nombreTramite,
        value: id
      };
    });
    filteredTiposPQRD.value = tiposPQRD.value
  } catch (error) {
    console.error(error)
  }
}

async function getOficinas() {
  try {
    const { data } = await sgdeaAxios.get('oficinas/all');
    oficinas.value = data.sort((a, b) => a.nombre.localeCompare(b.nombre)).map(({ nombre, id }) => {
      return {
        label: nombre,
        value: id
      };
    });
    oficinas.value = oficinas.value.filter(e => e.value !== 26)
    filteredOficinas.value = oficinas.value
  } catch (error) {
    console.error(error)
  }
}

const getData = async () => {
  try {
    loadingTable.value = true;
    const response = await sgdeaAxios.get('/medicina/getReclasificacion')
    dataTableTotalRows.value = response.data;
    dataTable.value = response.data.map((e) => {
      return {
        radicado: e.med,
        oficina: e.oficina.nombre,
        tramite: 'Medicina Laboral',
        reclasificacion: e.reclasificarTramite.nombreTramite,
        observaciones: e.observaciones,
        tiempoPorVencer: '',
        fechaVencimiento: '',
        estado: e.estado
      }
    })
    loadingTable.value = false;
  } catch (error) {
    console.error(error)
    loadingTable.value = false;
  }
}

const selectOptionsFilterFnOficinas = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredOficinas.value = oficinas.value
    })
    return
  }
  update(() => {
    filteredOficinas.value = oficinas.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};


const selectOptionsFilterFnTramite = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredTiposPQRD.value = tiposPQRD.value
    })
    return
  }
  update(() => {
    filteredTiposPQRD.value = tiposPQRD.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const handleSearch = async () => {
  const filter = {
    idOficina: filtro.value.idOficina,
    tiempoPorVencer: filtro.value.tiempoPorVencer,
    idTipoTramite: filtro.value.idTipoTramite,
  };

  if (Object.values(filter).every(val => !val)) {
    toast.error("Por favor, seleccione al menos un filtro.");
    return;
  }

  const response = await sgdeaAxios.post('/medicina/getByFilterReclasificar', null, {
    params: {
      idTipotramite: filter.idTipoTramite || null,
      idOficina: filter.idOficina || null
    }
  })
  if (response.status === 200) {
    dataTable.value = response.data.map((e) => {
      return {
        radicado: e.med,
        oficina: e.oficina.nombre,
        tramite: 'Medicina Laboral',
        reclasificacion: e.reclasificarTramite.nombreTramite,
        observaciones: e.observaciones,
        tiempoPorVencer: '',
        fechaVencimiento: '',
        estado: e.estado
      }
    })
  }
}

const handlePageChange = async (page: number) => {
  filtro.value.page = page <= 0 ? 0 : page - 1;
  await getData();
}

const handleRowsPerPageChange = async (rowsPerPage: any) => {
  filtro.value.size = rowsPerPage;
  await getData();
}

const resetForm = async () => {
  filtro.value = {
    idOficina: null,
    tiempoPorVencer: null,
    idTipoTramite: null,
    page: 0,
    size: 20
  }

  pagination.value = {
    sortBy: "desc",
    descending: false,
    page: 0,
    rowsPerPage: 20,
    rowsNumber: 0
  };

  getData();
};

</script>
