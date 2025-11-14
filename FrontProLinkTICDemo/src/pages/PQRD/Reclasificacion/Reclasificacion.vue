<script lang="ts" setup>
import { sgdeaAxios } from 'src/services';
import { onMounted, ref } from 'vue';
import { RECLASIFICACION_HEADER } from './index'
import TableReclasificacion from './Table.vue';
import Datepicker from 'components/FormFields/datePickerComponent.vue';
import { useAuthStore } from 'src/stores/auth.store';
import { useRouter } from 'vue-router';
import moment from 'moment';
import { encode } from "js-base64";
import { toast } from 'src/helpers/toast';

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

const auth = useAuthStore();

const tiposPQRD = ref([]);
const filteredTiposPQRD = ref([])
const oficinas = ref([]);
const filteredOficinas = ref([])

let loadingTable = ref(false);
const dataTableTotalRows = ref(0);
const filteredDataTable = ref<any[]>([]);
const customMessageTableResults = ref("")

const router = useRouter();

onMounted(async () => {
    await initData();
  });

  async function initData() {
    try {
         await getTiposPQRD();
         await getOficinas();
         await getData();
    } catch (error) {
      console.error(error);
    }
  }

async function getTiposPQRD() {
    try {
      const { data } = await sgdeaAxios.get(`/reclasificacion/listadoTiposTramite`);
      tiposPQRD.value = data.sort((a, b) => a.nombreTramite.localeCompare(b.nombreTramite)).map(({ nombreTramite, id }) => {
        return {
          label: nombreTramite,
          value: id
        };
      });
      filteredTiposPQRD.value = tiposPQRD.value
    } catch (error) {
      console.error(error);
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
      filteredOficinas.value = oficinas.value
    } catch (error) {
      console.error(error);
    }
  }

const getData = async () => {
  try {
    loadingTable.value = true;
    
    const isAdmin = auth.$state.userInfo.role.toLowerCase() === 'administrador' || 
                   auth.$state.userInfo.role.includes('gestionador');
    
    const baseParams = {
      page: filtro.value.page,
      size: filtro.value.size
    };

    if (isAdmin) {
      baseParams.gestionadorId = auth.$state.userInfo.userid;
    }

    if (filtro.value.idOficina) {
      baseParams.idOficina = filtro.value.idOficina;
    }
    if (filtro.value.tiempoPorVencer) {
      baseParams.tiempoPorVencer = filtro.value.tiempoPorVencer;
    }
    if (filtro.value.idTipoTramite) {
      baseParams.idTipoTramite = filtro.value.idTipoTramite;
    }

    const paramsOrigen = { ...baseParams};
    const paramsDestino = { ...baseParams, moduloDestinoId: 8 };

    const [responseOrigen, responseDestino] = await Promise.all([
      sgdeaAxios.get('/solicitud-reclasificacion', { params: paramsOrigen }),
      sgdeaAxios.get('/solicitud-reclasificacion', { params: paramsDestino })
    ]);

    // Combinar el contenido
    const combinedContent = [
      ...responseOrigen.data.content,
      ...responseDestino.data.content
    ];

    dataTableTotalRows.value = Math.max(
      responseOrigen.data.totalElements, 
      responseDestino.data.totalElements
    );

    // Mapear los datos para la tabla
    filteredDataTable.value = combinedContent?.map((item) => ({
      radicado: item.idCasoOrigen,
      numeroRadicado: item.numeroRadicado || 'Sin número',
      oficina: filteredOficinas.value.find(oficina => oficina.value === item.oficinaId)?.label || 'NO ASIGNADO',
      tramite: tiposPQRD.value.find(tipo => tipo.value === item.moduloOrigenTramiteId)?.label || 'Sin trámite',
      reclasificacion: tiposPQRD.value.find(tipo => tipo.value === item.moduloDestinoTramiteId)?.label || 'Sin trámite',
      estado: item.estado || 'Por asignar',
      observaciones: item.observaciones,
      fechaVencimiento: item.fechaVencimiento ? moment(item.fechaVencimiento).format('DD/MM/YYYY') : 'Sin fecha',
      tiempoPorVencer: item.tiempoxVencer === 0
        ? 'Vencido'
        : item.tiempoxVencer === 1
          ? '1 día'
          : (item.tiempoxVencer !== undefined ? `${item.tiempoxVencer} días` : '-'),
      moduloOrigen: item.moduloOrigenTramiteId,
      acciones: "Reclasificación"
    }));

    // Actualizar el estado de paginación
    pagination.value.rowsNumber = dataTableTotalRows.value;
    pagination.value.page = filtro.value.page + 1;
    pagination.value.rowsPerPage = filtro.value.size;
    customMessageTableResults.value =  filtro.value.paginationMessage

  } catch (error) {
    console.error('Error al cargar datos:', error);
    toast.error('Error al cargar los datos. Por favor, inténtelo de nuevo más tarde.');
  } finally {
    loadingTable.value = false;
  }
};

const handleSearch = async () => {
  filtro.value.page = 0;
  await getData();
}

const handlePageChange = async (page: number) => {
  filtro.value.page = page <= 0 ? 0 : page - 1;
  await getData();
}

const handleRowsPerPageChange = async (rowsPerPage: any) => {
  filtro.value.size = rowsPerPage;
  await getData();
}

const handleCaso = (id: string, moduloOrigen: string, fechaVencimiento: string, tiempoPorVencer: string) => {
  const fechaEncoded = encode(fechaVencimiento);
  const tiempoEncoded = encode(tiempoPorVencer);

  router.push({
    path: `reclasificacion/${id}`,
    query: { moduloOrigen, fecha: fechaEncoded, tiempo: tiempoEncoded }
  });
};


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

  // getData();
};

</script>

<template>
  <div class="q-my-md">
    <div class="tw-flex tw-justify-between tw-items-center">
      <span class="tw-font-bold tw-text-3xl tw-my-5">Solicitudes de Reclasificación</span>
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
                <Datepicker v-model:input-data-prop='filtro.tiempoPorVencer' label="Seleccione" :required-valitation="false" dense mask="DD/MM/YYYY" />
              </label>
            </div>

            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <label class="tw-w-full">
                <span class="tw-text-label">Tipo de Trámite</span>
                <q-select v-model="filtro.idTipoTramite" :options="filteredTiposPQRD" emit-value label="Seleccione" dense
                      outlined class="tw-rounded-lg" @filter="selectOptionsFilterFnTramite" use-input map-options fill-input hide-selected input-debounce="0">
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
                      outlined class="tw-rounded-lg" @filter="selectOptionsFilterFnOficinas" use-input map-options fill-input hide-selected input-debounce="0">
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
            <q-btn label="Limpiar Filtros" color="accent" textColor="black" class="tw-rounded-lg col-2" @click="resetForm" />
            <q-btn label="Buscar" color="primary" class="tw-rounded-lg col-2" @click="handleSearch" />
          </div>
        </q-card>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat bordered>
      <div class="flex items-center justify-between q-px-md q-mb-sm row col-12">
        <span class="text-weight-bold text-h6" style="color: #2c3948">Listado de Casos Pendientes por Reclasificación</span>
      </div>
      <TableReclasificacion :TABLE_HEADER="RECLASIFICACION_HEADER" :TABLE_BODY="filteredDataTable" :TABLE_TOTAL_ROWS="dataTableTotalRows"
          :selection="undefined" :isLoading="loadingTable" :pagination.sync="pagination" :pagination-message="customMessageTableResults"
          @handlePageChange="handlePageChange" @handle-edit-data="handleCaso"  @handleRowsPerPageChange="handleRowsPerPageChange" />
    </q-card>
  </div>
</template>
