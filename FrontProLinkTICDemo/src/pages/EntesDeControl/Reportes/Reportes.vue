<template>
  <section class="tw-px-5 tw-flex tw-flex-row tw-bg-bg">
    <main class="tw-w-full tw-p-7 tw-pt-0">
      <div class="tw-flex tw-justify-between tw-items-center">
        <span class="tw-font-bold tw-text-3xl tw-my-5">Reportes Entes de control</span>
      </div>
      <q-card flat bordered class="tw-p-5">
        <q-form>
          <div class="row q-col-gutter-md q-pb-md q-px-md">
            <span class="tw-text-base tw-font-bold tw-w-full tw-text-l">Filtrar por</span>
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <label class="tw-text-label">Fecha Inicial</label>
              <DatePicker mask="DD/MM/YYYY" label="dd / mm / yyyy" v-model:input-data-prop="filterForm.fechaInicial.val"
                :options="(date: string) => date <= moment().format('YYYY/MM/DD')"
                :ref="(val) => filterForm.fechaInicial.ref = val" :error-message="validateDatePicker('fechaInicial')"
                :error="validatefechaInicialBoolean" />
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <label class="tw-text-label">Fecha Final</label>
              <DatePicker mask="DD/MM/YYYY" label="dd / mm / yyyy" v-model:input-data-prop="filterForm.fechaFinal.val"
                :options="(date: string) => date <= moment().format('YYYY/MM/DD')"
                :ref="(val) => filterForm.fechaFinal.ref = val" :error-message="validateDatePicker('fechaFinal')"
                :error="validatefechaFinalBoolean" />
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <label class="tw-text-label">Número de Identificación del afectado</label>
              <q-select v-model="filterForm.numIdentificacion.val" :input-debounce="900" label="Buscar" outlined dense
                @filter="numIdentificacionOptionsFilterFn" :options="numIdentificacionOptions"
                :ref="(val) => filterForm.numIdentificacion.ref = val"
                :rules="[noCaracteresEspecialesSelect, alphanumericSelect]" use-input hide-selected fill-input>
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-select>
            </div>

            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <label class="tw-text-label">Gestionador</label>
              <q-select :options="filteredGestionador" fill-input hide-selected use-input :input-debounce="900"
                v-model="filterForm.gestionador.val" @filter="gestionadorOptionsFilterFn" class="tw-w-full" outlined
                :ref="(val) => filterForm.gestionador.ref = val" dense placeholder="Buscar">
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
          <br />
          <div class="row tw-flex tw-justify-center tw-gap-6 [&>*]:tw-p-2 pb-15">
            <q-btn label="Limpiar Filtros" color="accent" textColor="black" class="tw-rounded-lg col-2"
              @click="resetForm" />
            <q-btn :disabled="validateErrorsForm" label="Buscar" color="primary" class="tw-rounded-lg col-2"
              @click="getReportes" />
          </div>
        </q-form>
      </q-card>
      <TableReportes :rows="dataTable" :loading="loading" @changeLoading="(val) => loading = val"
        :pagination="pagination" :total-pages="totalPage" @handlePageChange="handlePageChange"
        @handleRowsPerPageChange="handleRowsPerPageChange" :pagination-message="customMessageTableResults"
        :TABLE_TOTAL_ROWS="dataTableTotalRows" :filterForm="filterForm"/>
    </main>
  </section>
</template>

<script setup lang="ts">
import { alphanumericSelect, noCaracteresEspecialesSelect } from "src/helpers/validations";
import TableReportes from "src/pages/EntesDeControl/Reportes/TableReportes.vue";
import DatePicker from "src/pages/MedicinaLaboral/datePicker.vue";
import { ref, reactive, computed } from "vue";
import { toast } from "src/helpers/toast";
import { sgdeaAxios } from "src/services";
import { RowI } from "./interfaces";
import { onMounted } from "vue";
import moment from "moment";

const dataTable: any = ref([]);
const loading = ref(false);

const numIdentificacionOptions = ref([]);
const optNumIdentificacion = ref([]);

const filteredGestionador = ref();
const optGestionador = ref([]);
const customMessageTableResults = ref("")
const dataTableTotalRows = ref()

const totalPage = ref(0)

let pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 0,
  rowsPerPage: 20,
  rowsNumber: 0,
  total: 0,
});


const filterForm = reactive({
  numIdentificacion: {
    val: null,
    ref: null
  },
  fechaFinal: {
    val: null,
    ref: null
  },
  fechaInicial: {
    val: null,
    ref: null
  },
  gestionador: {
    val: null,
    ref: null
  },
});

const numIdentificacionOptionsFilterFn = (val: string, update: any) => {
  if (val.length >= 1) {
    update(() => {
      const needle = val.toLowerCase();
      numIdentificacionOptions.value = optNumIdentificacion.value.filter(
        (v) => v.label.toLowerCase().indexOf(needle) > -1,
      ).slice(0, 1);
    });
  }
};

const gestionadorOptionsFilterFn = (val: string, update: any) => {
  if (val.length >= 1) {
    update(() => {
      const needle = val.toLowerCase();
      filteredGestionador.value = optGestionador.value.filter(
        (v) => v.label.toLowerCase().indexOf(needle) > -1,
      ).slice(0, 1);
    });
  }
};

const validateErrorsForm = computed(() => {
  return (
    validatefechaInicialBoolean.value ||
    validatefechaFinalBoolean.value ||
    filterForm.numIdentificacion.ref?.hasError && filterForm.numIdentificacion.ref?.hasError() ||
    filterForm.gestionador.ref?.hasError && filterForm.gestionador.ref?.hasError()
  );
});

const validateNullForm = computed(() => {
  return filterForm.fechaInicial.val == null &&
    filterForm.fechaFinal.val == null &&
    filterForm.numIdentificacion.val == null &&
    filterForm.gestionador.val == null
});

const validateDatePicker = (field: string) => {
  if (filterForm[field].val) {
    if (!moment(filterForm[field].val, "DD/MM/YYYY").isValid())
      return "Formato de fecha inválida";

    const selectedDate = moment(filterForm[field].val, "DD/MM/YYYY");
    const currentDate = moment();

    if (selectedDate.isAfter(currentDate))
      return "Formato de fecha incorrecto";
  }
};

const validatefechaInicialBoolean = computed(() => {
  if (filterForm['fechaInicial'].val) {
    if (!moment(filterForm['fechaInicial'].val, "DD/MM/YYYY").isValid()) return true;

    const selectedDate = moment(filterForm['fechaInicial'].val, "DD/MM/YYYY");
    const currentDate = moment();

    if (selectedDate.isAfter(currentDate)) return true;
  }
  else return false
});

const validatefechaFinalBoolean = computed(() => {
  if (filterForm['fechaFinal'].val) {
    if (!moment(filterForm['fechaFinal'].val, "DD/MM/YYYY").isValid()) return true;

    const selectedDate = moment(filterForm['fechaFinal'].val, "DD/MM/YYYY");
    const currentDate = moment();

    if (selectedDate.isAfter(currentDate)) return true;
  }
  else return false
});

const resetForm = () => {
  filterForm.fechaFinal.val = null;
  filterForm.fechaInicial.val = null;
  filterForm.numIdentificacion.val = null;
  filterForm.gestionador.val = null;

  filterForm.fechaInicial.ref?.resetValidation();
  filterForm.fechaFinal.ref?.resetValidation();
  filterForm.numIdentificacion.ref?.resetValidation();
  filterForm.gestionador.ref?.resetValidation();

  getReportes(false);
};

const getGestionador = () => {
  sgdeaAxios
    .get("/roles/usuarios?rol=Gestionador")
    .then((response) => {
      optGestionador.value = response.data.map((state: any) => ({
        label: `${state.firstname} ${state.lastname}`,
        value: state.id.toString(),
      }));
      filteredGestionador.value = response.data.map((state: any) => ({
        label: `${state.firstname} ${state.lastname}`,
        value: state.id.toString(),
      }));
    })
    .catch((error) =>
      console.error("Error al cargar estados por rol:", error),
    );
};

const getReportes = (verify = true) => {
  if (validateErrorsForm.value) return;

  if (verify && validateNullForm.value) {
    return toast.error("Por favor, seleccione al menos un filtro.");
  }

  const url = `/api/entes/reporte`;
  loading.value = true;

  const params = {
    fechaInicial: filterForm.fechaInicial.val,
    fechaFinal: filterForm.fechaFinal.val,
    nroDocumento: filterForm.numIdentificacion.val,
    idGestionador: filterForm.gestionador.val?.value,
    page: pagination.value.page,
    size: pagination.value.rowsPerPage,
  };
  sgdeaAxios
    .get(url, { params })
    .then((response) => {
      totalPage.value = response.data.totalPages;
      pagination.value.page = response.data.number;
      pagination.value.rowsPerPage = response.data.size;
      pagination.value.total = response.data.totalElements;

      if (response.data.content.length >= 1) {
        dataTable.value = response.data.content;
        const identicaciones = response.data.content.map((val: RowI) => ({
          label: val.documentoAfectado,
          value: val.documentoAfectado,
        }));
        optNumIdentificacion.value = identicaciones;
        numIdentificacionOptions.value = identicaciones;
        customMessageTableResults.value =  response?.data?.paginationMessage;
        dataTableTotalRows.value = response?.data?.totalElements;

      }
      else toast.success("No se encontraron datos con los criterios ingresados, Por favor verifique e intente nuevamente");
    })
    .catch((error) => {
      toast.error("Ha ocurrido un error, Por favor verifique e intente nuevamente");
      console.error("Error al realizar la búsqueda:", error);
    })
    .finally(() => setTimeout(() => loading.value = false, 200));
};

const handlePageChange = async (page: number) => {
  pagination.value.page = page

  getReportes(false);
}

const handleRowsPerPageChange = async (rowsPerPage: any) => {
  pagination.value.rowsPerPage = rowsPerPage;

  getReportes(false);
}

onMounted(() => {
  getGestionador();
  getReportes(false);
});
</script>


<style>
th {
  text-align: center;
}
</style>
