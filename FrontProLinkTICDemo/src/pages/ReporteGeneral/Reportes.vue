<template>
  <section class="tw-px-5 tw-flex tw-flex-row tw-bg-bg">
    <main class="tw-w-full tw-p-7 tw-pt-0">
      <div class="tw-flex tw-justify-between tw-items-center">
        <span class="tw-font-bold tw-text-3xl tw-my-5">Reportes</span>
      </div>
      <q-card flat bordered class="tw-p-5">
        <q-form>
          <div class="row q-col-gutter-md q-pb-md q-px-md tw-w-full">

            <div class="row q-col-gutter-md tw-w-full">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <label class="text-weight-bold">Seleccione el Reporte</label>
                <q-select v-model="filterForm.selectReporte.val" :input-debounce="900" label="Seleccione" outlined dense
                  :options="tablesReport.selectOptionReportes" :ref="(val) => filterForm.selectReporte.ref = val"
                  fill-input :rules="[inputSelectRequired]" @update:model-value="changeSelectTipoReporte01">
                </q-select>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" v-if="filterForm.selectReporte.val?.id == 1">
                <label class="text-weight-bold">Seleccione el Tipo de Reporte *</label>
                <q-select v-model="filterForm.selectTipoReporte.val" :input-debounce="900" label="Seleccione" outlined
                  dense :options="tablesReport.selectOptionTipoReportes"
                  :ref="(val) => filterForm.selectTipoReporte.ref = val"
                  @update:model-value="changeSelectTipoReporte"
                  :rules="[inputSelectRequired]">
                </q-select>
              </div>
            </div>

            <div class="row q-col-gutter-md q-pb-md q-px-md row q-col-gutter-md tw-w-full " v-if="filterForm.selectReporte.val?.id == 10">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <label class="text-weight-bold">Fecha Inicial *</label>
                <DatePicker mask="DD/MM/YYYY" label="dd / mm / yyyy"
                  v-model:input-data-prop="filterForm.fechaInicial.val" :options="validateDatePickerUnMesAtras"
                  :ref="(val) => filterForm.fechaInicial.ref = val" :error-message="validateDatePicker('fechaInicial')"
                  :error="validateFechas && validatefechaInicialBoolean" :default-year-month="getDefaultYearMonth()" />
              </div>

          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <label class="text-weight-bold">Fecha Final *</label>
                <DatePicker mask="DD/MM/YYYY" label="dd / mm / yyyy" v-model:input-data-prop="filterForm.fechaFinal.val"
                  :options="validateDatePickerUnMesDelante" :ref="(val) => filterForm.fechaFinal.ref = val"
                  :error-message="validateDatePicker('fechaFinal')"
                  :error="validateFechas && validatefechaFinalBoolean" />
              </div>

          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <span class="text-weight-bold">Estado *</span>
            <q-select
              :rules="[]"
              name="estado"
              outlined
               v-model="filterForm.selectEstado.val"
              label="Seleccione"
              dense
              map-options
              emit-value
              :options="[
                { value: 'true', label: 'Activo' },
                { value: 'false', label: 'Inactivo' },
              ]"
            />
          </div>

          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <span class="text-weight-bold">Oficina</span>
            <q-select outlined dense map-options use-input fill-input :options="oficinas.data" name="dias"
                  label="Seleccione" v-model="filterForm.selectOficina.val" option-label="nombre" hide-selected
                  @filter="oficinas.filter" :ref="(val) => filterForm.selectOficina.ref = val"
                  :rules="[(val) => showOrHiddenTipoReporte([2]) ? inputSelectRequired(val) : null]">
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-select>
          </div>
        </div>
            <span class="tw-text-base tw-font-bold tw-w-full tw-text-l">{{ filterForm.selectTipoReporte.val?.label
              }}</span>

            <div class="row q-col-gutter-md tw-w-full">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" v-if="showOrHiddenTipoReporte([5])">
                <span class="text-weight-bold">Radicado</span>
                <q-input outlined v-model="filterForm.radicado.val" :ref="(val) => (filterForm.radicado.ref = val)"
                  :maxlength="80" label="Inserte" dense :rules="[alphanumeric, (val) => maxLengthInput(80, val)]" />
              </div>
            </div>

            <div class="row q-col-gutter-md tw-w-full">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" v-if="showOrHiddenTipoReporte([1, 2, 3, 4, 5, 6, 7])">
                <label class="text-weight-bold">Fecha Inicial *</label>
                <DatePicker mask="DD/MM/YYYY" label="dd / mm / yyyy"
                  v-model:input-data-prop="filterForm.fechaInicial.val" :options="validateDatePickerUnMesDelante"
                  :ref="(val) => filterForm.fechaInicial.ref = val" :error-message="validateDatePicker('fechaInicial')"
                  :error="validateFechas && validatefechaInicialBoolean" :default-year-month="getDefaultYearMonth()" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" v-if="showOrHiddenTipoReporte([1, 2, 3, 4, 5, 6, 7])">
                <label class="text-weight-bold">Fecha Final *</label>
                <DatePicker mask="DD/MM/YYYY" label="dd / mm / yyyy" v-model:input-data-prop="filterForm.fechaFinal.val"
                  :options="validateDatePickerUnMesDelante" :ref="(val) => filterForm.fechaFinal.ref = val"
                  :error-message="validateDatePicker('fechaFinal')"
                  :error="validateFechas && validatefechaFinalBoolean" />
              </div>

            </div>

            <div class="row q-col-gutter-md tw-w-full">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" v-if="showOrHiddenTipoReporte([1, 2])">
                <span class="text-weight-bold">{{ showOrHiddenTipoReporte([2]) ? 'Oficinas *' : 'Dependencia'
                  }}</span>
                <q-select outlined dense map-options use-input fill-input :options="oficinas.data" name="dias"
                  label="Seleccione" v-model="filterForm.selectOficina.val" option-label="nombre" hide-selected
                  @filter="oficinas.filter" :ref="(val) => filterForm.selectOficina.ref = val"
                  :rules="[(val) => showOrHiddenTipoReporte([2]) ? inputSelectRequired(val) : null]">
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-select>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" v-if="showOrHiddenTipoReporte([3])">
                <span class="text-weight-bold">Oficina Origen</span>
                <q-select outlined dense map-options emit-value use-input fill-input :options="oficinas.data"
                  name="dias" label="Seleccione" v-model="filterForm.selectOficinaOrigen.val" option-label="nombre"
                  hide-selected @filter="oficinas.filter" :ref="(val) => filterForm.selectOficinaOrigen.ref = val">
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-select>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" v-if="showOrHiddenTipoReporte([3])">
                <span class="text-weight-bold">Oficina Destino</span>
                <q-select outlined dense map-options emit-value use-input fill-input :options="oficinas.data"
                  name="dias" label="Seleccione" v-model="filterForm.selectOficinaDestino.val" option-label="nombre"
                  hide-selected @filter="oficinas.filter" :ref="(val) => filterForm.selectOficinaDestino.ref = val">
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-select>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" v-if="showOrHiddenTipoReporte()">
                <span class="text-weight-bold">Destinatario</span>
                <q-input outlined v-model="filterForm.destinatario.val"
                  :ref="(val) => (filterForm.destinatario.ref = val)" :maxlength="80" label="Inserte" dense
                  :rules="[alphanumeric, (val) => maxLengthInput(80, val)]" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 tw-w-full" v-if="showOrHiddenTipoReporte([2])">
                <label class="text-weight-bold">Canal de Radicación *</label>
                <q-select v-model="filterForm.selectCanalRadicacion.val" :input-debounce="900" label="Seleccione"
                  outlined dense :options="canalRadicacion" :ref="(val) => filterForm.selectCanalRadicacion.ref = val"
                  :rules="[inputSelectRequired]">
                </q-select>
              </div>
            </div>

            <div class="row q-col-gutter-md tw-w-full">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 tw-w-full" v-if="showOrHiddenTipoReporte()">
                <label class="text-weight-bold">Canal de Envio</label>
                <q-select v-model="filterForm.selectCanalEnvio.val" :input-debounce="900" label="Seleccione" outlined
                  dense :options="canalesEnvio" :ref="(val) => filterForm.selectCanalEnvio.ref = val">
                </q-select>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" v-if="showOrHiddenTipoReporte([2])">
                <span class="text-weight-bold">Radicado</span>
                <q-input outlined v-model="filterForm.radicado.val" :ref="(val) => (filterForm.radicado.ref = val)"
                  :maxlength="80" label="Inserte" dense :rules="[alphanumeric, (val) => maxLengthInput(80, val)]" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 tw-w-full" v-if="showOrHiddenTipoReporte([2])">
                <label class="text-weight-bold">Estado *</label>
                <q-select v-model="filterForm.selectEstado.val" :input-debounce="900" label="Seleccione" outlined dense
                  :options="tablesReport.selectOptionEstado" :ref="(val) => filterForm.selectEstado.ref = val"
                  :rules="[inputSelectRequired]">
                </q-select>
              </div>
            </div>

            <div class="row q-col-gutter-md tw-w-full">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" v-if="showOrHiddenTipoReporte([2])">
                <label class="text-weight-bold">Tipo de Trámite *</label>
                <q-select v-model="filterForm.selectTipoTramite.val" :input-debounce="900" label="Seleccione" outlined
                  dense :options="tablesReport.selectOptionTipoTrimite"
                  :ref="(val) => filterForm.selectTipoTramite.ref = val" :rules="[inputSelectRequired]">
                </q-select>
              </div>
            </div>
          </div>
          <div class="tw-flex tw-justify-end tw-gap-3">
            <q-btn label="Limpiar Filtros" color="accent" textColor="black" class="tw-rounded-lg !tw-px-3 !tw-py-1"
              outline @click="resetForm" />
            <q-btn label="Consultar" color="primary" class="tw-rounded-lg !tw-px-3 !tw-py-1" @click="getReportes()"
              unelevated />
          </div>
        </q-form>
      </q-card>

      <TableReportes :rows="dataTable" :columns="columnsTable" :loading="loading"
        @changeLoading="(val) => loading = val" :pagination="pagination" @onRequest="getReportes"
        :tipoReporte="getSelectTipoReporte" :filterForm="filterForm" @pagination="(val) => pagination = val" />
    </main>
  </section>
</template>

<script setup lang="ts">
import { alphanumeric, inputSelectRequired, maxLengthInput } from "src/helpers/validations";
import { OficinaI } from "src/pages/EntesDeControl/Bandeja/Detalles/types";
import TableReportes from "src/pages/ReporteGeneral/TableReportes.vue";
import DatePicker from "src/pages/MedicinaLaboral/datePicker.vue";
import * as tablesReport from "src/pages/ReporteGeneral/data";
import { onMounted, reactive, computed, ref } from "vue";
import { toast } from "src/helpers/toast";
import { sgdeaAxios } from "src/services";
import moment from "moment";
import { watch } from "vue";

const validateFechas = ref(false);
const columnsTable: any = ref([]);
const dataTable: any = ref([]);
const loading = ref(false);

const getSelectTipoReporte = computed(() => filterForm.selectTipoReporte.val?.id);

const filterForm = reactive({
  selectEstado: {
    val: null,
    ref: null
  },
  destinatario: {
    val: null,
    ref: null
  },
  radicado: {
    val: null,
    ref: null
  },
  selectCanalRadicacion: {
    val: null,
    ref: null
  },
  selectCanalEnvio: {
    val: null,
    ref: null
  },
  selectReporte: {
    val: null,
    ref: null
  },
  selectTipoReporte: {
    val: null,
    ref: null
  },
  selectTipoTramite: {
    val: null,
    ref: null
  },
  fechaFinal: {
    val: moment().format('DD/MM/YYYY'),
    ref: null
  },
  selectOficina: {
    val: null,
    ref: null,
  },
  selectOficinaOrigen: {
    val: null,
    ref: null
  },
  selectOficinaDestino: {
    val: null,
    ref: null
  },
  fechaInicial: {
    val: moment().subtract(30, 'days').format('DD/MM/YYYY'),
    ref: null
  },
});

const pagination = ref({
  descending: false,
  rowsPerPage: 10,
  rowsNumber: 5,
  sortBy: 'id',
  page: 0,
  numberOfElements: 0,
  totalElements: 0,
  totalPages: 0,
})

const oficinas = reactive({
  clone: <OficinaI[]>[],
  data: <OficinaI[]>[],
  filter: (val: string, doneFn: (callbackFn: () => void) => void) => {
    if (val === "") {
      doneFn(() => {
        oficinas.data = oficinas.clone;
      });
      return;
    }

    doneFn(() => {
      oficinas.data = oficinas.clone.filter(
        (oficina: { label: string } & OficinaI) => {
          return oficina.label.toLowerCase().indexOf(val.toLowerCase()) > -1;
        }
      );
    });
  },
});

const canalesEnvio = ref([])
const canalRadicacion = ref([])

const showOrHiddenTipoReporte = (arr = [1]) => {
  return arr.includes(filterForm.selectTipoReporte.val?.id)
}

const getDefaultYearMonth = () => {
  return moment().subtract(30, 'days').format('YYYY/MM/DD');
}

const validateDatePickerUnMesAtras = (date: string) => {
  const startDate = moment().subtract(30, 'days').format('YYYY/MM/DD');
  return date >= startDate;
}

const validateDatePickerUnMesDelante = (date: string) => {
  return date <= moment().format('YYYY/MM/DD');
}

const validateDatePicker = (field: string) => {
  if (!moment(filterForm[field].val, "DD/MM/YYYY").isValid())
    return "Formato de fecha inválida";

  const selectedDate = moment(filterForm[field].val, "DD/MM/YYYY");
  const currentDate = moment();

  if (selectedDate.isAfter(currentDate)) return "Formato de fecha incorrecto";
  if (!filterForm['fechaFinal'].val) return "Campo requerido.";
};

const validatefechaInicialBoolean = computed(() => {
  if (!moment(filterForm['fechaInicial'].val, "DD/MM/YYYY").isValid()) return true;

  const selectedDate = moment(filterForm['fechaInicial'].val, "DD/MM/YYYY");
  const currentDate = moment();

  if (selectedDate.isAfter(currentDate)) return true;
  if (!filterForm['fechaFinal'].val) return true
  return false
});

const validatefechaFinalBoolean = computed(() => {
  if (!moment(filterForm['fechaFinal'].val, "DD/MM/YYYY").isValid()) return true;

  const selectedDate = moment(filterForm['fechaFinal'].val, "DD/MM/YYYY");
  const currentDate = moment();
  if (selectedDate.isAfter(currentDate)) return true;
  if (!filterForm['fechaFinal'].val) return true
  return false;
});

const validateErrorsForm = computed(() => {
  const fechasValidacion = validatefechaInicialBoolean.value || validatefechaFinalBoolean.value;
  if (getSelectTipoReporte.value == 2) {
    return (
      !fechasValidacion ||
      (filterForm.selectOficina.ref?.validate && filterForm.selectOficina.ref?.validate()) ||
      (filterForm.selectCanalRadicacion.ref?.validate && filterForm.selectCanalRadicacion.ref?.validate()) ||
      (filterForm.selectEstado.ref?.validate && filterForm.selectEstado.ref?.validate()) ||
      (filterForm.selectTipoTramite.ref?.validate && filterForm.selectTipoTramite.ref?.validate())
    )
  } else return !fechasValidacion;
});

const resetForm = () => {
  filterForm.selectEstado.val = null;
  filterForm.destinatario.val = null;
  filterForm.radicado.val = null;
  filterForm.selectCanalRadicacion.val = null;
  filterForm.selectCanalEnvio.val = null;
  filterForm.selectTipoTramite.val = null;
  filterForm.fechaFinal.val = moment().format('DD/MM/YYYY');
  filterForm.selectOficina.val = null;
  filterForm.selectOficinaOrigen.val = null;
  filterForm.selectOficinaDestino.val = null;
  filterForm.fechaInicial.val = moment().subtract(30, 'days').format('DD/MM/YYYY');

  filterForm.selectEstado.ref?.resetValidation();
  filterForm.destinatario.ref?.resetValidation();
  filterForm.radicado.ref?.resetValidation();
  filterForm.selectCanalRadicacion.ref?.resetValidation();
  filterForm.selectCanalEnvio.ref?.resetValidation();
  filterForm.selectTipoTramite.ref?.resetValidation();
  filterForm.selectOficina.ref?.resetValidation();
  filterForm.selectOficinaOrigen.ref?.resetValidation();
  filterForm.selectOficinaDestino.ref?.resetValidation();
  validateFechas.value = false;
};

watch(() => filterForm.selectTipoReporte.val, () => {
  if (filterForm.selectTipoReporte.val.id == 2) {
    filterForm.selectOficina.val = { "label": "TODOS", "nombre": "TODOS", "value": 32 };
  }
})

const getOfficinas = () => {
  const url = `/oficinas/all`;
  sgdeaAxios
    .get<OficinaI[]>(url)
    .then((res) => {
      oficinas.data = res.data
        .sort((a: any, b: any) => {
          const esNumeroA = /^\d/.test(a.nombre);
          const esNumeroB = /^\d/.test(b.nombre);

          if (esNumeroA && esNumeroB) return 0;
          if (esNumeroA) return 1;
          if (esNumeroB) return -1;

          let nombreA = a.nombre.toLowerCase();
          let nombreB = b.nombre.toLowerCase();
          if (nombreA > nombreB) return 1;
          else if (nombreA < nombreB) return -1;
          else return a.edad - b.edad;
        })
        .map((oficina) => ({
          label: oficina.nombre.toUpperCase(),
          nombre: oficina.nombre.toUpperCase(),
          value: oficina.id,
        })) as any;
      oficinas.clone = oficinas.data;
    })
    .catch((err) => {
      toast.error("Ha ocurrido un error al buscar las oficinas");
    });
};

const getCanalEnvio = async () => {
  const { data } = await sgdeaAxios.get('/reportes/listadoCanalesReporteDevoluciones')

  canalesEnvio.value = data.map(({ nombre, id }) => {
    return {
      label: nombre,
      value: id
    };
  });
}

const getCanalRadicacion = async () => {
  const { data } = await sgdeaAxios.get('/reportes/entradas/canales')

  canalRadicacion.value = data.map(({ nombre, id }) => {
    return {
      label: nombre,
      value: id
    };
  });
}

const validate = () => {
  filterForm.selectCanalRadicacion.ref?.validate();
  filterForm.selectTipoTramite.ref?.validate();
  filterForm.selectTipoReporte.ref?.validate();
  filterForm.selectReporte.ref?.validate();
  filterForm.selectEstado.ref?.validate();
  filterForm.selectOficina.ref?.validate();
  validateFechas.value = true;
}

const insertDataTable = (resp: any) => {
  pagination.value.page = resp?.data?.number;
  dataTable.value = resp?.data?.content || [];
  pagination.value.rowsPerPage = resp?.data?.size;
  pagination.value.rowsNumber = resp?.data?.totalElements;
  pagination.value.numberOfElements = resp?.data?.numberOfElements;
  pagination.value.totalElements = resp?.data?.totalElements;
  pagination.value.totalPages = resp?.data?.totalPages;
}

const getReportes = () => {
  loading.value = true;
  validate();

  if (!validateErrorsForm.value) {
    return loading.value = false;
  }

  const paginate = computed(() => ({
    size: pagination.value.rowsPerPage,
    page: pagination.value.page,
  }));

  if (getSelectTipoReporte.value == 1) {
    sgdeaAxios.get('/reportes/devoluciones/listado', {
      params: {
        destinatarioFiltro: filterForm.destinatario.val?.toLowerCase(),
        canalEnvio: filterForm.selectCanalEnvio.val,
        oficinaFiltro: filterForm.selectOficina.val,
        fechaInicial: filterForm.fechaInicial.val,
        fechaFinal: filterForm.fechaFinal.val,
        ...paginate.value
      }
    }).then((resp) => insertDataTable(resp))
      .finally(() => loading.value = false);

  } else if (getSelectTipoReporte.value == 2) {
    sgdeaAxios.post('/reportes/entradas/listado', {
      radicado: filterForm.radicado.val,
      canalRadicacion: String(filterForm.selectCanalRadicacion.val?.value),
      estado: filterForm.selectEstado.val?.label !== 'Todos' ? filterForm.selectEstado.val?.label?.toLowerCase() : null,
      tipoTramite: String(filterForm.selectTipoTramite.val?.id),
      oficina: String(filterForm.selectOficina.val?.label),
      fechaInicial: filterForm.fechaInicial.val,
      fechaFinal: filterForm.fechaFinal.val,
      ...paginate.value,
    }).then((resp) => insertDataTable(resp))
      .finally(() => loading.value = false);

  } else if (getSelectTipoReporte.value == 3) {
    sgdeaAxios.get('/reportes/internos/listado', {
      params: {
        oficinaOrigenId: filterForm.selectOficinaOrigen.val,
        oficinaDestinoId: filterForm.selectOficinaDestino.val,
        fechaInicial: filterForm.fechaInicial.val,
        fechaFinal: filterForm.fechaFinal.val,
        ...paginate.value
      }
    }).then((resp) => insertDataTable(resp))
      .finally(() => loading.value = false);

  } else if (getSelectTipoReporte.value == 4) {
    sgdeaAxios.get('/reportes/reasignaciones/listado', {
      params: {
        fechaInicial: filterForm.fechaInicial.val,
        fechaFinal: filterForm.fechaFinal.val,
        ...paginate.value
      }
    }).then((resp) => insertDataTable(resp))
      .finally(() => loading.value = false);

  } else if (getSelectTipoReporte.value == 5) {
    sgdeaAxios.get('/reportes/observaciones/listado', {
      params: {
        fechaInicial: filterForm.fechaInicial.val,
        fechaFinal: filterForm.fechaFinal.val,
        idRadicado: filterForm.radicado.val,
        ...paginate.value
      }
    }).then((resp) => insertDataTable(resp))
      .finally(() => loading.value = false);

  } else if (getSelectTipoReporte.value == 6) {
    sgdeaAxios.post('/reportes/salidas/listado', {
      fechaInicial: filterForm.fechaInicial.val,
      fechaFinal: filterForm.fechaFinal.val,
      ...paginate.value
    }).then((resp) => insertDataTable(resp))
      .finally(() => loading.value = false);

  } else if (getSelectTipoReporte.value == 7) {
    sgdeaAxios.get('/reportes/seguimiento-comunicacion-salida/listado', {
      params: {
        fechaInicial: filterForm.fechaInicial.val,
        fechaFinal: filterForm.fechaFinal.val,
        estado: filterForm.selectEstado.val,
        ...paginate.value
      }
    }).then((resp) => insertDataTable(resp))
      .finally(() => loading.value = false);

  }else if (filterForm.selectReporte.val?.id == 10) {
    sgdeaAxios.get('/usuarios/reporte', { params: {
      fechaInicial: filterForm.fechaInicial.val,
      fechaFinal: filterForm.fechaFinal.val,
      estado: filterForm.selectEstado.val,
      oficinaId: filterForm.selectOficinaOrigen.val
    } })
    .then((resp) => insertDataTable(resp))
      .finally(() => loading.value = false);
  } else {
    dataTable.value = [];
    loading.value = false
  };
}

const changeSelectTipoReporte01 = ({ id }) => {

  // if(id === 7){
  //   columnsTable.value = tablesReport.columnsComunicacionSalida;
  // }else{
  //   columnsTable.value = tablesReport.columnsDevoluciones;
  // }
}

const changeSelectTipoReporte = ({ id }) => {
  switch (filterForm.selectTipoReporte.val?.id) {
    case 1:
      columnsTable.value = tablesReport.columnsDevoluciones;
      break;
    case 2:
      columnsTable.value = tablesReport.columnsEntradas;
      break;
    case 3:
      columnsTable.value = tablesReport.columnsInternos;
      break;
    case 4:
      columnsTable.value = tablesReport.columnsReasignaciones;
      break;
    case 5:
      columnsTable.value = tablesReport.columnsReposteObservaciones;
      break;
    case 6:
      columnsTable.value = tablesReport.columnsSalida;
      break;
    case 7:
      columnsTable.value = tablesReport.columnsComunicacionSalida;
      break;
    case 10:
      columnsTable.value = tablesReport.columnsReportesUsers;

      // Manejar el caso por defecto si es necesario
      break;
  }

  resetForm();
  pagination.value = {
    descending: false,
    rowsPerPage: 10,
    rowsNumber: 5,
    sortBy: 'id',
    page: 0,
    numberOfElements: 0,
    totalElements: 0,
    totalPages: 0,
  };

  dataTable.value = [];
};

const setInitialDates = () => {
  filterForm.fechaFinal.val = moment().format('DD/MM/YYYY');
  filterForm.fechaInicial.val = moment().subtract(30, 'days').format('DD/MM/YYYY');
}

onMounted(() => {
  setInitialDates();
  getOfficinas();
  getCanalEnvio();
  getCanalRadicacion()
});
</script>
