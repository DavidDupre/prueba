<template>
  <div class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
    <div class="tw-flex tw-justify-between tw-pt-4">
      <h1 class="tw-text-3xl tw-font-bold">Bandeja de comunicaciones Oficiales</h1>
      <q-btn type="button" label="Crear comunicación" icon="add" text-color="white" style="width: 200px" color="primary"
        class="tw-rounded-xl tw-h-11" @click="$router.push('comunicaciones')" />
    </div>
    <q-form>
      <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
        <q-expansion-item default-opened>
          <template v-slot:header>
            <div class="col row">
              <b class="tw-text-lg">Filtrar por</b>
            </div>
          </template>
          <div class="row q-col-gutter-md q-pb-md q-px-md">
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <label class="tw-text-label">Número de comunicación
                <SearchInput map-options :options="numRadicado" v-model:input-data-prop="filterSearch.numeroRadicado"
                  label="Búsqueda" maxlength="20" />
              </label>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <label class="tw-text-label">Siniestros
                <q-select :options="opcionesSiniestros" type="text" outlined label="Seleccione" dense emit-value
                  v-model="filterSearch.siniestro" />
              </label>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <label class="tw-text-label">Fecha de comunicación
                <Datepicker mask="DD/MM/YYYY" label="dd / mm / aaaa" :options="optionsDateFunc"
                  v-model:input-data-prop="filterSearch.fechaRadicacion" @valida-fecha="true" />
              </label>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <label class="tw-w-full">
                <span class="tw-text-label">Estado</span>
                <q-select v-model="filterSearch.estado" label="Seleccione" dense outlined class="tw-rounded-lg"
                  :options="['En edición', 'Revisión rechazada', 'Aprobación rechazada']">
                </q-select>
              </label>
            </div>
          </div>
          <div class="tw-flex tw-justify-center tw-items-center tw-py-5 tw-gap-6">
            <q-btn label="Limpiar filtros" style="width: 240px" text-color="black" color="accent" @click="clearFilters"
              class="tw-rounded-xl tw-h-12" />
            <q-btn type="button" label="Buscar" text-color="white" style="width: 240px" color="primary"
              class="tw-rounded-xl tw-h-12 tw-p-2" @click="sendFilters(0, 20)" />
          </div>
        </q-expansion-item>
      </q-card>
    </q-form>
    <q-card class="q-pa-md tw-mt-4 tw-rounded-xl" flat>
      <div class="col row">
        <p class="tw-text-2xl tw-pl-6">Listado de Comunicaciones</p>
      </div>
      <Table :TABLE_HEADER="Comunicaciones_HEADER" :TABLE_BODY="dataTable" key-id="numeroComunicacion"
        @handleEditData="(id) => $router.push(`/medicina/comunicaciones/${id}`)" :isLoading="loadingTable"
        :TABLE_TOTAL_ROWS="dataTableTotalRows" @handlePageChange="handlePageChange"
        @handleRowsPerPageChange="handleRowsPerPageChange"
        @updateTable="sendFilters(0, 20)"
        @send-to-docs="(id, tab) => $router.push(`/medicina/comunicaciones/${id}/?tab=${tab}`)" />
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref } from "vue";
import Table from "./Table.vue";
import { Comunicaciones_HEADER, ISearchCasosData } from '../comunicaciones/index'
import SearchInput from "src/components/SearchInput/SearchInput.vue";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import Datepicker from '../datePicker.vue';
import moment from "moment";

const DEFAULT_FILTER_SEARCH: ISearchCasosData = {
  numeroRadicado: { label: '', value: '' },
  siniestro: "",
  estado: "",
  fechaRadicacion: "",
  fechaVencimiento: "",
  size: 20,
  page: 0
};

let loadingTable = ref(false);
const auth = useAuthStore();
const filterSearch = ref<ISearchCasosData>(DEFAULT_FILTER_SEARCH);
const dataTable = ref<any[]>([]);
const selected = ref([]);
const opcionesSiniestros = ref([]);
const listadoRadicados = ref([])
const numRadicado: Ref<{ label: string; value: any }[]> = ref([]);
const dataTableTotalRows = ref(0);

onMounted(() => {
  sendFilters(0, 20);
});

const sendFilters = async (page: number, size: number) => {
  const siniestros = await sgdeaAxios.get('/medicina/getSiniestrosUnico')
  opcionesSiniestros.value = siniestros.data.map(item => item.siniestro)
  opcionesSiniestros.value = opcionesSiniestros.value.filter(siniestro => siniestro !== 'No aplica')

  try {
    loadingTable.value = true;
    const response = await sgdeaAxios.put(`/medicina/getAllUsers/${auth.userInfo.userid}`, {
      numeroComunicacion: filterSearch.value.numeroRadicado.value ? filterSearch.value.numeroRadicado.value : null,
      siniesto: filterSearch.value.siniestro ? filterSearch.value.siniestro : null,
      estado: filterSearch.value.estado ? filterSearch.value.estado : null,
      fecha: filterSearch.value.fechaRadicacion ? filterSearch.value.fechaRadicacion : null,
      rol: auth.userInfo.role,
       page: page,
        size: size,
    }, {
      params: {
        sort: [null]
      }
    },)

    if (response.status === 200) {
      numRadicado.value = response.data.content?.map((item) => ({
        value: item.idRadicado,
        label: item.idRadicado,
      }));

      dataTable.value = response.data.content.map(item => ({
        ...item,
        numeroComunicacion: item?.idRadicado || "-",
        tipoComunicacion: item?.tipoComunicacion?.nombre || "-",
        fechaComunicacion: item?.fechaRadicacion ? moment(item?.fechaRadicacion).format('DD/MM/YYYY HH:mm') : "-",
        siniestro: item?.metadatos?.listSiniestro || "-",
        prefijo: item?.prefijo?.prefijo?.nombre || "-",
        afectado: item?.metadatos?.numeroDocumento ? item?.metadatos?.numeroDocumento + ' - ' + item?.metadatos?.afectado : "-",
        tipoTramite: "Medicina Laboral",
        fechaCreacionDocumento: item?.fechaDoc ? moment(item?.fechaDoc).format('DD/MM/YYYY HH:mm') : "-",
        tipoEvento: item?.metadatos?.tipoEvento?.nombre || "-",
        origenEvento: item?.metadatos?.origenEvento?.evento || "-",
        trazabilidad: "-",
        estado: item?.estado || "-",
        actions: "-"
      }))

      dataTableTotalRows.value = response.data.totalPages
    }

    loadingTable.value = false
    await getRadicados()
  } catch (error) {
    loadingTable.value = false;
    console.error(error)
  }
}

const getRadicados = async () => {
  try {
    listadoRadicados.value = dataTable.value.map((e) => {
      return {
        label: e.numero,
        value: e.id
      }
    })
  } catch (error) {
    console.error(error)
  }
}

const clearFilters = async () => {
  filterSearch.value = {
    numeroRadicado: { label: '', value: '' },
    siniestro: "",
    estado: "",
    fechaRadicacion: "",
    fechaVencimiento: "",
    size: 20,
    page: 0
  };

  await sendFilters(0, 20)
}

function optionsDateFunc(date) {
  return true
}

const handlePageChange = async (event) => {
  await sendFilters(event.page - 1, event.rowsPerPage);
}

const handleRowsPerPageChange = async (event: any) => {
  await sendFilters(event.page, event.rowsPerPage);
}

</script>
