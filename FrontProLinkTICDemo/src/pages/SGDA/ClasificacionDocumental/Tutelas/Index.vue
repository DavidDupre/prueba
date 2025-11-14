<template>
  <main v-if="consultaView" class="q-py-md">
    <!-- <a href="/home" class="text-primary q-mb-md block" style="text-decoration: none;">
        <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
        <b>
          Volver
        </b>
      </a> -->


    <BreadCrumbs :crumbs="routes"></BreadCrumbs>
    <q-form>
      <div class="tw-flex tw-justify-between tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold">Consulta de Tutelas</h1>
        <!--  <q-btn class="tw-w-42 tw-h-12 flex" @click="router.push('/tutelas/radicar')"><q-icon name="add" class="q-mr-xs"
            size="20px" />Radicar
          tutela</q-btn> -->
      </div>
      <q-card flat>
        <q-expansion-item expand-separator default-opened class="q-bg-white q-mt-lg">
          <template v-slot:header>
            <div class="col row">
              <b class="tw-text-lg">Consultas</b>
            </div>
          </template>
          <div class="row q-px-md">


            <!-- <div v-if="visible" class="col-4"> -->
            <!-- <label class="q-px-md tw-text-label">Número del proceso -->
            <!-- <q-input outlined label="Inserte" dense emit-value v-model="formulario.proceso" /> -->
            <!-- </label> -->
            <!-- </div> -->


            <!--                        <div v-if="visible" class="col-4">-->
            <!--                            <label class="q-px-md tw-text-label">Etapa procesal-->
            <!--                                <q-select outlined label="Seleccione" dense emit-value v-model="formulario.etapa" />-->
            <!--                            </label>-->
            <!--                        </div>-->

            <div class="col-6">
              <label class="q-px-md tw-text-label">Fecha Inicial
                <q-input dense outlined label="Seleccione" v-model="formulario.fechaInicio">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="formulario.fechaInicio" mask="DD/MM/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <!-- <DatePickerComponent mask="DD/MM/YYYY" outlined label="Seleccione" dense emit-value
                  v-model:input-data-prop="formulario.fechaInicio"  future /> -->
              </label>
            </div>
            <div class="col-6">
              <label class="q-px-md tw-text-label">Fecha Final
                <q-input dense outlined :disable="!formulario.fechaInicio" label="Seleccione"
                  v-model="formulario.fechaFinal">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="formulario.fechaFinal" :options="optionsDateFinal" mask="DD/MM/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <!-- <DatePickerComponent mask="DD/MM/YYYY" outlined label="Seleccione" dense emit-value
                  v-model:input-data-prop="formulario.fechaFinal" :options="optionsDateFinal" :disabled="!formulario.fechaInicio" future :error="esMenorDate" /> -->
              </label>
            </div>

            <div class="col-6">
              <label class="q-px-md tw-text-label">Campos
                <q-select outlined label="Seleccione" dense emit-value v-model="formulario.campo"
                  :options="optionCampos" />
              </label>
            </div>
            <q-form class="col-6" ref="formValores">
              <div >
                <!-- {{ formulario.campo }} -->
                <label class="q-px-md tw-text-label">Valor
                  <q-input outlined label="Inserte" dense emit-value v-model="formulario.valor"
                    v-if="typeof formulario.campo === 'object' && formulario.campo.type === 'text'" type="text"

                    :rules="[alphanumeric, inputRequired]" />

                  <q-input outlined label="Inserte" dense emit-value v-model="formulario.valor" type="text"
                    :rules="[formulario.campo.field == 'numeroDocumentoAccionante' && isPassportAcc || formulario.campo.field == 'numeroDocumentoAfectado' && isPassportAfec ? alphanumeric : onlyNumbers, (v) => minLengthInput(6, v), inputRequired]"
                    v-else-if="typeof formulario.campo === 'object' && formulario.campo.type === 'number'" />

                  <!-- <q-select outlined label="Seleccione" dense  v-model="formulario.valor" :options="customOptions"
                  map-options v-else-if="typeof formulario.campo === 'object' && formulario.campo.type === 'select'" /> -->

                  <q-select v-model="formulario.valor" outlined dense use-input hide-selected fill-input map-options
                    label="Búsqueda" :options="customOptions" @filter="filterFn"
                    v-else-if="typeof formulario.campo === 'object' && formulario.campo.type === 'select'">
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Sin resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                  <q-input outlined label="Inserte" dense emit-value v-model="formulario.valor" type="text"
                    v-else-if="typeof formulario.campo === 'object' && formulario.campo.type === 'alpha'"
                    :rules="[formulario.campo.field === 'idRadicado' ? onlyNumbersForRad : null, formulario.campo.field === 'idRadicado' ? (v: string) => minLengthInput(6, v) : null, formulario.campo.field === 'codigoProceso' ? val => maxLengthInput(23, val) : null, formulario.campo.field === 'codigoProceso' ? alphanumeric : null, formulario.campo.field === 'nombreJuzgado' ? inputRequired : null, formulario.campo.field === 'nombreJuzgado' ? alphanumericAbsolute : null, inputRequired]" />

                  <q-input :disable="formulario.campo == ''" outlined label="Inserte" dense emit-value v-model="formulario.valor" v-else />
                </label>
              </div>
            </q-form>


            <!-- <div v-if="visible"  class="col-4"> -->
            <!-- <label class="q-px-md tw-text-label">Registros asignados -->
            <!-- <q-input outlined label="Inserte" dense emit-value v-model="formulario.registros" /> -->
            <!-- </label> -->
            <!-- </div> -->

            <!-- Button agregar filtros -->
          </div>
          <div class="col-4 tw-flex tw-items-center tw-justify-end">
            <q-btn @click="addFilters" class="tw-h-10 tw-w-20 tw-mr-5 tw-mb-5" color="primary" text-color="white">
              <q-icon name="add" class="q-mr-xs" size="20px" />
            </q-btn>
          </div>
        </q-expansion-item>
      </q-card>

      <q-card flat>
        <q-expansion-item expand-separator default-opened class="q-bg-white q-mt-lg">
          <template v-slot:header>
            <div class="col row">
              <b class="tw-text-lg">Filtros</b>
            </div>
          </template>
          <!-- Filtros -->
          <div class="row q-px-md">
            <q-chip removable class="cursor-pointer z-10	" v-for="(filtro, i) in filtros" :key="i"
              @remove="removerFiltro(i, filtro.field)"> {{ filtro.label }}
            </q-chip>
          </div>
          <!-- Button Search -->
          <div class="col-4 tw-flex tw-mt-4 tw-items-center tw-justify-end">
            <q-btn @click="servicesFil({ isRemove: false })" class="tw-h-10 tw-w-32 tw-mr-5 tw-mb-5" color="primary"
              text-color="white" label="Buscar" />
          </div>

          <div class="q-mt-xl">

            <div v-if="filtros.length > 0">
              <div class="flex justify-between w-full items-center">
              <p class="tw-text-lg text-weight-bold q-mx-lg">
                Listado de Tutelas Radicadas
              </p>
              <!-- <q-input outlined dense rounded v-model="search" label="Buscador" class="tw-w-[300px]"
                @update:model-value="generalFilter">
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input> -->
            </div>
            <Table select="multiple" :pagination="pagination" class="q-pa-md" :TABLE_HEADER="columns" :TABLE_BODY="tutelasFiltradas"
              key-id="idRadicado" @handle-edit-data="changeView"
              msg-no-data="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente" isConsultas />
          </div>
        </div>
        </q-expansion-item>
      </q-card>
    </q-form>
    <LoadingModal v-if="showModal" :total="100" @load-complete="showModal = false" />

  </main>
  <DetalleComp :id-detalle="idSelect" @close-comp="consultaView = true, servicesFil({ isRemove: false })" v-else/>
</template>

<script lang="ts" setup>
import BreadCrumbs from "src/components/BreadCrumbs/BreadCrumbs.vue";
import DatePickerComponent from "src/components/FormFields/datePickerComponent.vue";
import { SelectInput, Tutelas } from 'src/interfaces';
import { adminAxios, sgdeaAxios } from "src/services";
import { Ref, computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { reverseFormatDate } from '../../../../helpers/formtDate';
import Table from "./Table.vue";
import { tipoDocumentoTutelasOptions } from "src/constantes/options";
import { inputRequired, minLengthInput, notNumber, nonRequiredAlphabetical, onlyNumbers, alphanumeric, maxLengthInput, onlyNumbersForRad, alphanumericAbsolute } from "src/helpers/validations";
import { toast } from "src/helpers/toast";
import LoadingModal from "src/components/Modal/LoadingModal.vue";
import moment from "moment";
import DetalleComp from "src/pages/SGDA/ClasificacionDocumental/Tutelas/DetalleConsulta.vue";
import { formatDateWithTimeAndMeridiem } from "src/helpers/formtDate";

const router = useRouter();
const formulario: Ref<{
  fechaInicio: string,
  fechaFinal: string,
  campo: string | { label: string, field: string, type: "text" | "select" | "number" | "alpha" },
  valor: string | number
}> = ref({
  fechaInicio: '',
  fechaFinal: '',
  campo: '',
  valor: ''
});

function optionsDateFunc(date) {
  return date >= moment().format('YYYY/MM/DD')
}
const updateMoment = computed(() => moment(formulario.value.fechaInicio, 'DD/MM/YYYY', true))
function optionsDateFinal(date) {
  const fechaInicio = updateMoment.value;
  const fechaLimite = moment(fechaInicio).add(30, 'days').startOf('day');

  return date >= moment(fechaInicio).format('YYYY/MM/DD') && date <= fechaLimite.format('YYYY/MM/DD')
}

const isPassportAcc = ref(false)
const isPassportAfec = ref(false)
const showModal = ref(false);
const allTutelas: Ref<Tutelas[]> = ref([])
const tutelasFiltradas: Ref<Tutelas[]> = ref([])
const originTutelas = ref()
const search = ref('')
const customOptions: Ref<SelectInput[]> = ref([]);
const opForCustom = ref([])
const formValores = ref()
const consultaView = ref(true)
const idSelect = ref()
const pagination = ref({
  page: 1,
  rowsPerPage: 20,
});

const columns = [
  {
    name: "codigoProceso",
    label: "Código del Proceso",
    field: "codigoProceso",
    align: "center",
    sortable: true
  },
  {
    name: "canal",
    label: "Canal de Radicación",
    field: "canal",
    sortable: true,
    align: "center",
  },
  {
    name: "idRadicado",
    label: "Radicado",
    field: "idRadicado",
    sortable: true,
    align: "center",
  },
  {
    name: "fecha",
    label: "Fecha de Radicación",
    field: row => row.fechaRadicacion || '-',
    sortable: true,
    align: "center",
  },
  {
    name: "tiempoAsignado",
    label: "Tiempo Asignado",
    field: row => row.tiempoAsignado || '-',
    sortable: true,
    align: "center",
  },
  {
    name: "tiempoPorVencer",
    label: "Tiempo por Vencer",
    field: row => row.tiempoVencer || '-',
    sortable: true,
    align: "center",
  },
  {
    name: "fecha",
    label: "Fecha de Vencimiento",
    field: row => formatDateWithTimeAndMeridiem(row.fechaVencimiento) || '-',
    sortable: true,
    align: "center",
  },
  {
    name: "nombreAfectado",
    label: "Nombre - Identificación Afectado",
    field: (row) => row.nombresAfectado ? row.nombresAfectado + " - " + row.identificacionAfectado : '-',
    sortable: true,
  },
  {
    name: "nombreRemitente",
    label: "Nombre - Identificación Accionante",
    field: (row) => row.nombresRemitente ? row.nombresRemitente + " - " + row.identificacionRemitente : '-',
    sortable: true,
    align: "center",
  },
  // {
  //   name: "nombreJuzgado",
  //   label: "Remitente",
  //   field: "nombreJuzgado",
  //   sortable: true,
  // },
  {
    name: "municipio",
    label: "Ciudad / Departamento",
    field: row => row.ciudad + ' / ' + row.departamento,
    sortable: true,
    align: "center",
  },
  // {
  //     name: "tiempoPorVencer2",
  //     label: "Tiempo por vencer",
  //     field: "tiempoPorVencer2",
  //     sortable: true,
  // },
  {
    name: "etapaProcesal",
    label: "Tipo Trámite / Etapa Procesal",
    field: row => ((row.tipoTramite && row.etapaProcesal) ? ((row.tipoTramite || '-') + ' / ' + (row.etapaProcesal || '-')) : 'N/A'),
    align: "center",
    sortable: true,
  },
  {
    name: "abogadoTramitador",
    label: "Abogado Responsable",
    field: row => (row.abogado || '-'),
    align: "center",
    sortable: true,
  },
  // {
  //     name: "docs",
  //     label: "Gestión Documental",
  //     field: "docs",
  //     sortable: true,
  // },
  {
    name: "trazabilidad",
    label: "Trazabilidad",
    field: "trazabilidad",
    sortable: true,
  },
  {
    name: "estado",
    label: "Estado",
    field: "estado",
    sortable: true,
    align: "center",
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    align: "center",
  },
];

const optionCampos = ref([
  {
    label: "Código del Proceso",
    field: "codigoProceso",
    type: "alpha"
  },
  {
    label: "Departamento",
    field: "departamento",
    type: "select"
  },
  {
    label: "Municipio",
    field: "municipio",
    type: "select",
  },
  {
    label: "Nombre Juzgado",
    field: "nombreJuzgado",
    type: "alpha"
  },
  {
    label: "Nombre y Apellidos del Accionante",
    field: "nombreAccionante",
    type: "text"
  },
  {
    label: "Nombre y Apellidos del Afectado",
    field: "nombreAfectado",
    type: "text"
  },
  {
    label: "Número de Documento Accionante",
    field: "numeroDocumentoAccionante",
    type: "number",
    disable: true
  },
  {
    label: "Número de Documento Afectado",
    field: "numeroDocumentoAfectado",
    type: "number",
    disable: true
  },
  {
    label: "Número de Radicado",
    field: "idRadicado",
    type: "alpha"
  },
  {
    label: "Tipo de Documento Accionante",
    field: "tipoDocumentoAccionante",
    type: "select",
  },
  {
    label: "Tipo de Documento Afectado",
    field: "tipoDocumentoAfectado",
    type: "select"
  },
])

const filtros = ref([])

onMounted(async () => {
  // await getAllTutelas('/tutela/info')
  //await getTutelasFil()
})

const generalFilter = () => {
  tutelasFiltradas.value = originTutelas.value.filter(obj => {
    // Convertimos el objeto a un array de sus valores
    var valores = Object.values(obj);
    var concatArray = []
    valores.forEach(element => {
      if (typeof element == 'object' && element != null) {
        var newArr = Object.values(element)
        concatArray = [...concatArray, ...newArr]
      }
    });
    valores = [...valores, ...concatArray]
    // Buscamos si el string de búsqueda coincide con alguno de los valores
    return valores.some(valor => {
      if (valor != null) {
        if (typeof valor == 'object') {
          for (const propiedad in valor) {
            const regexEspacioDoble = /\s\s/;
            var dataFinal = valor[propiedad].toString().toLowerCase().trim().replace(regexEspacioDoble, " ");
            return dataFinal.includes(search.value.toLowerCase())
          }
        }
        if (typeof valor == 'string') {
          const regexEspacioDoble = /\s\s/;
          var dataFinal = valor.toString().toLowerCase().trim().replace(regexEspacioDoble, " ");
          return dataFinal.includes(search.value.toLowerCase())
        }

      }
      return false
    });
  });
}

const changeView = (id, value, idTut) => {
  idSelect.value = id
  consultaView.value = false
}

async function containsAny(subs: string) {
  tutelasFiltradas.value = allTutelas.value.filter((it) => {
    for (const key of Object.keys(it)) {
      if (it[key]?.toString().toLowerCase().includes(subs.toLowerCase())) {
        return it
      }
    }
  })
}

// async function getAllTutelas(path) {
//   try {
//     const { data } = await sgdeaAxios.get<Tutelas[]>(path)

//     allTutelas.value = data.map((it) => ({
//       ...it,
//       id: it.idRadicado,
//       fecha: fourthFormatDate(it.fecha),
//       fechaRadicacion: fourthFormatDate(it.fechaRadicacion),
//     }))
//     tutelasFiltradas.value = allTutelas.value
//   } catch (error) {
//     console.error('Error fetching tutelas:', error)
//     tutelasFiltradas.value = []
//   }
// }

const addFilters = async () => {
  let newFilters = [];

  if (formulario.value.campo == '' && formulario.value.valor != '') {
    toast.error('El campo “Campo” no debe estar vacío');
    return
  }

  if (formulario.value.fechaInicio) {
    newFilters.push({
      label: 'Fecha Inicial',
      field: 'fechaInicio',
      value: reverseFormatDate(formulario.value.fechaInicio)
    });
  }

  if (formulario.value.fechaFinal) {
    newFilters.push({
      label: 'Fecha final',
      field: 'fechaFin',
      value: reverseFormatDate(formulario.value.fechaFinal)
    });
  }

  if (formulario.value.campo && formulario.value.valor != '') {
    if (await formValores.value.validate()) {
      var fieldFilter = ''

      if (formulario.value.campo.field == "nombreAccionante") {
        fieldFilter = 'nombreCompletoAccionante'
      } else if (formulario.value.campo.field == "nombreAfectado") {
        fieldFilter = 'nombreCompletoAfectado'
      } else {
        fieldFilter = formulario.value.campo.field
      }
      newFilters.push({
        label: formulario.value.campo.label,
        field: fieldFilter,
        value: formulario.value.valor
      });
      if (formulario.value.campo.field == 'tipoDocumentoAccionante') {
        optionCampos.value[6].disable = false
        if (formulario.value.valor.value == 'Pasaporte') {
          isPassportAcc.value = true
        } else {
          isPassportAcc.value = false
        }
      }
      if (formulario.value.campo.field == 'tipoDocumentoAfectado') {
        optionCampos.value[7].disable = false
        if (formulario.value.valor.value == 'Pasaporte') {
          isPassportAfec.value = true
        } else {
          isPassportAfec.value = false
        }
      }
    }else{
      if (formulario.value.campo.field == 'numeroDocumentoAfectado' || formulario.value.campo.field == 'numeroDocumentoAccionante'){
        toast.error('El formato de documento no es correcto');
      }
      else{
        toast.error('El formato de texto no es correcto');
      }

    }

  } else {
    if (!formulario.value.fechaInicio && !formulario.value.fechaFinal) {
      toast.error('El campo “valor” no debe estar vacío');
    }

  }


  // Iterate over each new filter and add it to filtros.value if it doesn't exist already
  newFilters.forEach(newFilter => {
    const filterExists = filtros.value.some(existingFilter => {
      return existingFilter.field === newFilter.field
    });

    if (filterExists) {
      showNotify('No se puede ingresar el mismo filtro dos veces.')
      return;
    }

    if (!filterExists) {
      filtros.value.push(newFilter);
    }
  });
  clear()
};

const clear = () => {
  formulario.value = {
    fechaInicio: '',
    fechaFinal: '',
    campo: '',
    valor: ''
  }
}

async function servicesFil({ isRemove = false }) {
  const entries = Object.entries(filtros.value);

  if (entries.length === 0 && !isRemove) {
    return showNotify('Debe agregar por lo menos un filtro de búsqueda.')
  }
  if (entries.length === 0 && isRemove) {
    return getTutelasFil()
  }
  let body = {};
  entries.forEach(([_key, value]) => {
    if (['fechaInicio', 'fechaFin'].includes(value.field)) {
      body[value.field] = value.value
    } else {
      if (typeof value.value === 'object') {
        body['campos'] = {
          ...body['campos'],
          [value.field]: value.value.value
        }
      } else {
        body['campos'] = {
          ...body['campos'],
          [value.field]: value.value
        }
      }
    }
  });
  clear()

  showModal.value = true;
  getTutelasFil(body)
}

const getTutelasFil = async (body = {}) => {
  try {
    const { data } = await sgdeaAxios.post('/tutela/infoFil', body)
    tutelasFiltradas.value = data.map((it) => ({
      ...it,
      codigoProceso: it.codigo,
      id: it.idRadicado,
      idBd: it.id
    })).sort((a, b) => {
      const tiempoVencerA = a.tiempoVencer;
      const tiempoVencerB = b.tiempoVencer;

      if (tiempoVencerA == 'Vencido' || tiempoVencerB == 'Vencido') {
        return 0;
      }

      const [valorA, unidadA] = (tiempoVencerA || '').split(' ');
      const [valorB, unidadB] = (tiempoVencerB || '').split(' ');

      if (unidadA == 'dias' || unidadB == 'dias') {
        return 0;
      }

      const numValorA = parseInt(valorA);
      const numValorB = parseInt(valorB);

      return (numValorA < 24 && numValorB < 24) ? (numValorA - numValorB) : (numValorA < 24 ? -1 : (numValorB < 24 ? 1 : 0));
    });
    originTutelas.value = tutelasFiltradas.value
  } catch (error) {
    console.error(error);
    tutelasFiltradas.value = []
  } finally {
    showModal.value = false;
  }
}

const removerFiltro = (filtro, field) => {

  if (field == 'tipoDocumentoAccionante') {
    optionCampos.value[8].disable = true
    isPassportAcc.value = false
  }
  if (field == 'tipoDocumentoAfectado') {
    optionCampos.value[10].disable = true
    isPassportAfec.value = false
  }
  filtros.value = filtros.value.filter((x, i) => i != filtro)
  getTutelasFil()
}

watch(() => formulario.value.campo, (_newValue) => {
  formulario.value.valor = '';
})

const esMenorDate = ref(false)
watch(() => formulario.value.fechaFinal, (_newValue) => {
  const momentFechaIncial = moment(formulario.value.fechaInicio, 'DD/MM/YYYY', true);
  const momentFechaFinal = moment(formulario.value.fechaFinal, 'DD/MM/YYYY', true);
  const diferenciaEnMeses = momentFechaFinal.diff(momentFechaIncial, 'months');
  if (!momentFechaIncial.isSameOrBefore(momentFechaFinal) || diferenciaEnMeses > 1) {
    esMenorDate.value = true
  } else {
    esMenorDate.value = false
  }
})

watch(formulario.value, async ({ campo }) => {

  if (typeof campo === 'object' && campo.type === 'select') {
    customOptions.value = [];
    opForCustom.value = []
    switch (campo.field) {
      case 'departamento':
        const responseDep = (await adminAxios.get('/departamentos/list')).data

        customOptions.value = responseDep
          .map((it) => ({ value: it.idDepartamento, label: it.nombre }))
          .sort((a, b) => a.label.localeCompare(b.label));
        opForCustom.value = customOptions.value
        break;
      case 'municipio':
        const departamentoFilter = filtros.value.find((it) => it.field === 'departamento');
        if (departamentoFilter) {
          const departmentid = departamentoFilter.value.value;
          const responseMun = (await adminAxios.get(`/municipios/list/${departmentid}`)).data
          customOptions.value = responseMun
            .map((it) => ({ value: it.idMunicipio, label: it.nombre }))
            .sort((a, b) => a.label.localeCompare(b.label));
          opForCustom.value = customOptions.value
        } else {
          const responseMun = (await adminAxios.get(`/municipios/list`)).data
          customOptions.value = responseMun
            .map((it) => ({ value: it.idMunicipio, label: it.nombre }))
            .sort((a, b) => a.label.localeCompare(b.label));
          opForCustom.value = customOptions.value
        }

        break;
      case 'tipoDocumentoAccionante':
      case 'tipoDocumentoAfectado':
        customOptions.value = tipoDocumentoTutelasOptions;
        opForCustom.value = tipoDocumentoTutelasOptions;
        break;
    }
  }

})

const showNotify = (message: string) => {
  toast.error(message);
}

const filterFn = (val, update, abort) => {
  // if (val.length < 2) {
  //     abort()
  //     return
  // }

  update(() => {
    const needle = val.toLowerCase()
    customOptions.value = opForCustom.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}

const routes = [
  {
    name: "Inicio",
    to: "/home",
  },
  {
    name: "Tutelas",
  },
  {
    name: "Tutelas radicadas",
  },
];
</script>

<style>
label {
  padding: 0px 10px;
}
</style>
