<template>
  <section class="tw-px-5 tw-flex tw-flex-row tw-bg-bg">
    <main class="tw-w-full tw-p-7 tw-pt-0">
      <div class="tw-flex tw-justify-between tw-items-center">
        <span class="tw-font-bold tw-text-3xl tw-my-5">Bandeja de entrada</span>
      </div>
      <q-card>
        <q-form>
          <div class="row q-col-gutter-md q-pb-md q-px-md">
            <span class="tw-text-base tw-font-bold tw-w-full tw-text-l">Filtrar por
            </span>
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <label class="tw-text-label">Número de Radicado</label>
              <q-select @input-value="(v) => filterForm.numeroRadicado.val = v"
                :ref="(val) => filterForm.numeroRadicado.ref = val" hint="Escriba al menos 3 dígitos para buscar"
                v-model="filterForm.numeroRadicado.val" :options="opForRadicados" @filter="filterRa" input-debounce="0"
                label="Búsqueda" hide-selected map-options fill-input emit-value use-input outlined dense :rules="[
                  (v) => maxLengthInputSelect(20, v),
                  (v) => minLengthInput(3, v),
                  noCaracteresEspecialesSelect,
                  alphanumericSelect,
                ]">
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <span class="tw-w-full">
                <label class="tw-text-label"> Fecha de Radicado </label>

                <DatePicker mask="DD/MM/YYYY" label="dd / mm / yyyy"
                  v-model:input-data-prop="filterForm.fechaRadicacion.val"
                  :ref="(val) => filterForm.fechaRadicacion.ref = val"
                  :options="(date) => date <= moment().format('YYYY/MM/DD')"
                  :error-message="validateDatePicker('fechaRadicacion')" />
              </span>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <span class="tw-w-full">
                <label class="tw-text-label"> Fecha de Vencimiento </label>

                <DatePicker :options="(date) => date <= moment().format('YYYY/MM/DD')"
                  v-model:input-data-prop="filterForm.fechaVencimiento.val"
                  :ref="(val) => filterForm.fechaVencimiento.ref = val" label="dd / mm / yyyy" mask="DD/MM/YYYY"
                  :error-message="validateDatePicker('fechaVencimiento')" />
              </span>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <span class="tw-w-full">
                <label class="tw-text-label">Estado</label>
                <q-select :ref="(val) => filterForm.estado.ref = val" v-model="filterForm.estado.val"
                  :options="stateOptions" class="tw-rounded-lg" input-debounce="0" label="Seleccione" outlined dense>
                </q-select>
              </span>
            </div>
          </div>
          <br />
          <div class="row tw-flex tw-justify-center tw-gap-6 [&>*]:tw-p-2 pb-15">
            <q-btn label="Limpiar Filtros" color="accent" textColor="black" class="tw-rounded-lg col-2"
              @click="resetForm" />
            <q-btn :disabled="validateErrorsForm" label="Buscar" color="primary" class="tw-rounded-lg col-2"
              @click="getData()" />
          </div>
        </q-form>
      </q-card>
      <q-card flat class="tw-p-4 tw-rounded-xl tw-mt-6">
        <div class="show-table-icons">
          <EntesDeControlTable @massAssignment="activeAsignacionMasiva" :TABLE_HEADER="renderColumns()"
            :TABLE_BODY="filteredRadicadas" ref="entesTable" :loading="loading" :rol="rol" :pagination="pagination"
            :total-pages="totalPage" @handlePageChange="handlePageChange"
            @handleRowsPerPageChange="handleRowsPerPageChange" />
        </div>
      </q-card>
    </main>
  </section>

  <AsignarMasivamente :idsEntes="radicadosIds" :status="modals.asignar.status" @toggle="closeAsiganacionMasiva" />
</template>

<script setup lang="ts">
import { alphanumericSelect, noCaracteresEspecialesSelect, maxLengthInputSelect, minLengthInput } from 'src/helpers/validations'
import AsignarMasivamente from "src/pages/EntesDeControl/Bandeja/Detalles/Asignar/AsignarMasivamente.vue";
import DatePicker from "src/components/FormFields/datePickerComponent.vue";
import { useAuthStore } from "src/stores/auth.store";
import { ref, reactive, onMounted, computed } from "vue";
import EntesDeControlTable from "./table.vue";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
// import { useQuasar } from "quasar";
import moment from "moment";

const authStore = useAuthStore();
// const q = useQuasar();

const entesDeControl = ref([]);
const filteredRadicadas = ref([])
const opForRadicados = ref([]);
const radicadosIds = ref([]);
const entesTable = ref(null);
const stateOptions = ref();
const loading = ref(false);
const rol = ref(null);

const currPage = ref(0)
const totalPage = ref(0)

let pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 0,
  rowsPerPage: 20,
  rowsNumber: 0,
  total: 0,
});

const modals = reactive({
  asignar: {
    status: false,
    toggle: () => (modals.asignar.status = !modals.asignar.status),
  },
});

const activeAsignacionMasiva = (entes) => {
  radicadosIds.value = entes.map((ente) => ente.ente_control_id);
  reclamarMasivamente().then(() => {
    modals.asignar.toggle();
  })
}

const closeAsiganacionMasiva = (status) => {
  if (status == 'cancel') {
    liberarMasivamente().then(() => {
      entesTable.value?.clearSelects();
      modals.asignar.toggle()
    })
  }
  else if (status == 'success') {
    modals.asignar.toggle();
    entesTable.value?.clearSelects();
    getData(false);
  }
  else modals.asignar.toggle()
}

const validateErrorsForm = computed(() => {
  return filterForm.fechaVencimiento.ref?.hasError() ||
    filterForm.fechaRadicacion.ref?.hasError() ||
    filterForm.numeroRadicado.ref?.hasError ||
    filterForm.estado.ref?.hasError;
});

const validateNullForm = computed(() => {
  return filterForm.estado.val == null &&
    filterForm.fechaRadicacion.val == null &&
    filterForm.fechaVencimiento.val == null &&
    filterForm.numeroRadicado.val == null;
});

const filterForm = reactive({
  numeroRadicado: {
    val: null,
    ref: null,
  },
  fechaVencimiento: {
    val: null,
    ref: null
  },
  fechaRadicacion: {
    val: null,
    ref: null
  },
  estado: {
    val: null,
    ref: null
  },
});

const getStateOptions = () => {
  sgdeaAxios.get("/estadosProceso/all").then((response) => {
    stateOptions.value = response.data
      .sort((a, b) => a.estado.localeCompare(b.estado))
      .map((estado: any) => ({
        label: estado.estado,
        value: estado.id,
      }));
    if (rol?.value?.toLocaleLowerCase().includes("asignador")) {
      stateOptions.value = stateOptions.value.filter(
        (estado) => estado.value == 1 || estado.value == 17
      );
    }
    if (rol?.value?.toLocaleLowerCase().includes("aprobador")) {
      stateOptions.value = stateOptions.value.filter((estado) =>
        [8].includes(estado.value)
      );
    }
    if (rol?.value?.toLocaleLowerCase().includes("gestionador")) {
      stateOptions.value = stateOptions.value.filter((estado) =>
        [3, 4, 8, 5, 13, 7, 11].includes(estado.value)
      );
    }
    if (rol?.value?.toLocaleLowerCase().includes("revisor")) {
      stateOptions.value = stateOptions.value.filter(
        (estado) => estado.value === 5
      );
    }
  })
};

const reclamarMasivamente = () => {
  return sgdeaAxios.patch(`/api/entes/reclamar-masivamente-asignador`, {
    idsEntes: radicadosIds.value, usuarioId: authStore.userInfo.userid
  })
    .then(() => toast.success("Casos reclamados con éxito"))
    .catch(() => toast.error("Algun caso ya ha sido reclamado"));
}

const liberarMasivamente = () => {
  return sgdeaAxios.patch(`/api/entes/liberar-masivamente-asignador`, {
    idsEntes: radicadosIds.value, usuarioId: authStore.userInfo.userid
  })
    .then(() => {
      toast.success("Casos liberados con éxito");
      entesTable.value?.clearSelects();
    })
    .catch(() => toast.error("Algun caso ya ha sido liberado"));
}

const getData = async (verify = true) => {
  if (validateErrorsForm.value) return;

  if (verify && validateNullForm.value) {
    return toast.error("Por favor, seleccione al menos un filtro.");
  }
  loading.value = true;

  const preLink = "api/entes/";
  switch (rol.value) {
    case "Asignador Responsable": {
      const response = await sgdeaAxios.get(preLink + "obtenerListadoCasosAsignadores", validateParams({ asignador_id: authStore.userInfo.userid }))
        .finally(() => loading.value = false);
      entesDeControl.value = response.data.content;
      filteredRadicadas.value = entesDeControl.value;
      totalPage.value = response.data.totalPages;
      pagination.value.page = response.data.number;
      pagination.value.rowsPerPage = response.data.size;
      pagination.value.total = response.data.totalElements;
      break;
    }
    case "Aprobador": {
      const params = validateParams({ aprobador_id: authStore.userInfo.userid })
      sgdeaAxios.get(preLink + "obtenerListadoCasosAprobadores", params)
        .then((response) => {
          entesDeControl.value = response.data.content || [];
          filteredRadicadas.value = entesDeControl.value
          totalPage.value = response.data.totalPages;
          pagination.value.page = response.data.number;
          pagination.value.rowsPerPage = response.data.size;
          pagination.value.total = response.data.totalElements;
        })
        .finally(() => loading.value = false);

      break;
    }
    case "Gestionador": {
      const params = validateParams({ gestionador_id: authStore.userInfo.userid });
      sgdeaAxios.get(preLink + "listadoCasosGestionadores", params)
        .then((response) => {
          entesDeControl.value = response.data.content || [];
          filteredRadicadas.value = entesDeControl.value
          totalPage.value = response.data.totalPages;
          pagination.value.page = response.data.number;
          pagination.value.rowsPerPage = response.data.size;
          pagination.value.total = response.data.totalElements;
        })
        .finally(() => loading.value = false);
      break;
    }
    case "Revisor": {
      const params = validateParams({ revisor_id: authStore.userInfo.userid });
      sgdeaAxios.get(preLink + "obtenerListadoCasosRevisores", params)
        .then((response) => {
          entesDeControl.value = response.data.content || [];
          filteredRadicadas.value = entesDeControl.value
          totalPage.value = response.data.totalPages;
          pagination.value.page = response.data.number;
          pagination.value.rowsPerPage = response.data.size;
          pagination.value.total = response.data.totalElements;
        })
        .finally(() => loading.value = false);
      break;
    }

    default: break;
  }
};

const validateParams = (addParams = {}) => {
  let newParams = {
    estado_id: null,
    numero_radicado: null,
    fecha_vencimiento: null,
    fecha_radicacion: null,
    page: pagination.value.page,
    size: pagination.value.rowsPerPage,
  };

  if (filterForm.estado.val)
    newParams.estado_id = filterForm.estado.val.value;

  if (filterForm.numeroRadicado.val)
    newParams.numero_radicado = filterForm.numeroRadicado.val;

  if (filterForm.fechaVencimiento.val)
    newParams.fecha_vencimiento = moment(
      filterForm.fechaVencimiento.val, "DD/MM/YYYY"
    ).format("YYYY-MM-DD");

  if (filterForm.fechaRadicacion.val)
    newParams.fecha_radicacion = moment(
      filterForm.fechaRadicacion.val, "DD/MM/YYYY"
    ).format("YYYY-MM-DD");

  return { params: { ...addParams, ...newParams } };
};

const renderColumns = () => {
  return [
    {
      name: "canal_radicacion",
      label: "Canal de Radicación",
      field: "canal_radicacion",
      sortable: true,
    },
    {
      name: "numero_radicado",
      label: "Número de Radicado",
      field: "numero_radicado",
      sortable: true,
    },
    {
      name: "fecha_radicacion",
      label: "Fecha de Radicación",
      field: "fecha_radicacion",
      sortable: true,
    },
    {
      name: "tiempo_asignado",
      label: "Tiempo Asignado",
      field: "tiempo_asignado",
      sortable: true,
    },
    {
      name: "tiempo_por_vencer",
      label: "Tiempo por Vencer",
      field: "tiempo_por_vencer",
      sortable: true,
    },
    {
      name: "fecha_vencimiento",
      label: "Fecha de Vencimiento",
      field: "fecha_vencimiento",
      sortable: true,
    },
    {
      name: "afectado",
      label: "Nombre - Identificación Afectado",
      field: "afectado",
      sortable: true,
    },
    {
      name: "remitente",
      label: "Nombre - Identificación Remitente",
      field: "remitente",
      sortable: true,
    },
    {
      name: "municipio",
      label: "Ciudad",
      field: "municipio",
      sortable: true,
    },
    {
      name: "departamento",
      label: "Departamento",
      field: "departamento",
      sortable: true,
    },
    {
      name: "tipo_tramite",
      label: "Tipo de Trámite",
      field: () => "Entes de control",
      sortable: true,
    },
    {
      name: "trazabilidad",
      label: "Trazabilidad",
      field: "trazabilidad",
    },
    {
      name: "estado",
      label: "Estado",
      field: "estado",
      sortable: true,
    },
    {
      name: "acciones",
      label: "Acciones",
      field: "acciones",
    },
  ];
};

// const selectOptionsFilterFn = (item, search) => {
//   return item?.value?.toLowerCase().includes(search?.toLowerCase());
// };

const validateDatePicker = (field: string) => {
  return filterForm[field].val &&
    !moment(filterForm[field].val, 'DD/MM/YYYY').isValid() ||
    'Formato de fecha inválida';
}

const resetForm = () => {
  filterForm.fechaVencimiento.val = null;
  filterForm.fechaRadicacion.val = null;
  filterForm.numeroRadicado.val = null;
  filterForm.estado.val = null;

  filterForm.fechaVencimiento.ref?.resetValidation();
  filterForm.fechaRadicacion.ref?.resetValidation();
  filterForm.numeroRadicado.ref?.resetValidation();
  filterForm.estado.ref?.resetValidation();
  getData(false);
};

const filterRa = (val, update, abort) => {
  if (val.length < 3) return abort();

  return update(() => {
    const needle = val?.toLowerCase();
    opForRadicados.value = entesDeControl.value
      .filter((v) => v.numero_radicado.toLowerCase().includes(needle))
      .map((data) => ({
        label: data.numero_radicado,
        value: data.numero_radicado,
      }));
  });
};

onMounted(() => {
  rol.value = authStore.userInfo.role;
  getStateOptions();
  getData(false);
});

const handlePageChange = async (page: number) => {
  pagination.value.page = page

  await getData(false);
  emit('pageChange', filteredRadicadas.value)
}

const handleRowsPerPageChange = async (rowsPerPage: any) => {
  pagination.value.rowsPerPage = rowsPerPage;

  await getData(false);
  emit('rowsChange', filteredRadicadas.value)
}

const emit = defineEmits(['pageChange', 'rowsChange'])
</script>

<style scoped>
.table {
  text-align: center !important;
}

.pb-15 {
  padding-bottom: 15px;
}
</style>
