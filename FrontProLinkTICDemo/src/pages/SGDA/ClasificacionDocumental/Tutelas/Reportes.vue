<template>
  <div class="q-my-md">
    <div class="tw-flex tw-justify-between tw-items-center">
      <span class="tw-font-bold tw-text-3xl tw-my-5"> Reportes de Tutelas </span>
    </div>
    <q-card class="tw-rounded-xl tw-p-4" flat bordered>
      <q-expansion-item default-opened>
        <template v-slot:header>
          <div class="col row">
            <b class="tw-text-lg">Filtrar por</b>
          </div>
        </template>

        <div class="row q-col-gutter-md q-pb-md q-px-md">
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Tipo</span>
            <q-select :rules="[]" name="tipoTramite" outlined v-model="filtro.tipoTramite" label="Seleccione" dense
              map-options emit-value
              :options="[{ value: 'Tutelas', label: 'Tutelas Radicadas' }, { value: 'Juzgados', label: 'Juzgados' }]" />
          </div>

          <div v-if="filtro.tipoTramite == 'Tutelas' || !filtro.tipoTramite"
            class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Fecha Inicial</span>
            <q-input :rules="[]" name="fechaInicial" outlined label="dd/mm/yyyy" v-model="filtro.fechaInicial" dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="filtro.fechaInicial" :options="(date) => date <= moment().format('YYYY/MM/DD')"
                      mask="DD/MM/YYYY">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div v-if="filtro.tipoTramite == 'Tutelas' || !filtro.tipoTramite"
            class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Fecha Final</span>
            <q-input :rules="[]" name="fechaFinal" outlined label="dd/mm/yyyy" :disable="!filtro.fechaInicial"
              v-model="filtro.fechaFinal" dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="filtro.fechaFinal" mask="DD/MM/YYYY" :options="opForFinal">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div v-if="filtro.tipoTramite == 'Tutelas' || !filtro.tipoTramite"
            class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Número de Identificación</span>
            <q-input :rules="[v => maxLengthInput(20, v), alphanumeric]" name="identificacion" outlined
              v-model="filtro.identificacion" label="Inserte" dense />
          </div>

          <div v-if="filtro.tipoTramite == 'Tutelas' || !filtro.tipoTramite"
            class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Etapa Procesal</span>
            <q-select :rules="[]" name="tipoDoc" outlined v-model="filtro.etapa" label="Seleccione" dense map-options
              emit-value :options="etapaOptions" />
          </div>

          <div v-if="filtro.tipoTramite == 'Juzgados'" class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Departamento</span>
            <q-select :rules="[]" name="tipoDoc" outlined v-model="filtro.departamento" label="Seleccione" dense
              map-options emit-label :options="departamentoOptions" />
          </div>

          <div v-if="filtro.tipoTramite == 'Juzgados'" class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Municipio</span>
            <q-select :rules="[]" :disable="filtro.departamento != '' ? false : true" name="tipoDoc" outlined
              v-model="filtro.municipio" label="Seleccione" dense map-options emit-label :options="municipioOptions" />
          </div>

          <div v-if="filtro.tipoTramite == 'Juzgados'" class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Código del Juzgado</span>
            <q-select outlined dense hide-selected fill-input v-model="filtro.codigo" @filter="filterFn" use-input
              :options="optionsCode" :rules="[v => maxLengthInput(20, v), onlyNumbers]" emit-value map-options
              label="Búsqueda">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No se encontró
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div v-if="filtro.tipoTramite == 'Tutelas' || !filtro.tipoTramite"
            class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Juzgado</span>
            <q-select :rules="[]" name="tipoDoc" outlined v-model="filtro.juzgado" label="Seleccione" dense map-options
              emit-value :options="juzgadoOptions" />
          </div>
          <div v-if="filtro.tipoTramite == 'Tutelas' || !filtro.tipoTramite"
            class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Siniestro</span>
            <q-input :rules="[v => maxLengthInput(50, v), onlyNumbers]" name="identificacion" outlined
              v-model="filtro.siniestro" label="Inserte" dense />
          </div>
          <div v-if="filtro.tipoTramite == 'Tutelas' || !filtro.tipoTramite"
            class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Gestionador</span>
            <q-select :rules="[]" name="tipoDoc" outlined v-model="filtro.usuario" label="Seleccione" dense map-options
              emit-value :options="usuariosOptions" />
          </div>
        </div>

        <div class="tw-flex tw-justify-center tw-items-center tw-my-5 tw-gap-6">
          <q-btn label="Limpiar Filtros" type="reset" style="width: 240px" text-color="black" color="accent"
            @click="cleanFilters" class="tw-rounded-xl tw-h-12" />

          <q-btn type="submit" label="Buscar" text-color="white" style="width: 240px" color="primary" @click="getData"
            class="tw-rounded-xl tw-h-12 tw-p-2" />
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat bordered>
      <div class="flex items-center justify-between q-px-md q-mb-sm row col-12">
        <span class="text-weight-bold text-h6" style="color: #2c3948">Listado de {{ filtro.tipoTramite ||
              'Tutelas' }} {{ filtro.tipoTramite.toLowerCase() == 'tutelas' || filtro.tipoTramite.toLowerCase() == '' ?
              'Radicadas' : '' }}</span>

        <div class="tw-flex tw-items-center tw-gap-10">
          <div class="tw-flex tw-items-center tw-gap-2.5">
            <q-btn-dropdown color="accent" textColor="secondary" label="Exportar"
              style="width: 116px; height: 30px; border-radius: 8px" no-caps dropdown-icon="expand_more">
              <q-list separator dense>
                <q-item clickable v-close-popup @click="exportCSV">
                  <q-item-section avatar>
                    <q-avatar square>
                      <q-img v-lazy :data-url="csv" alt="csv" width="24px" height="24px" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>Exportar CSV</q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="exportXLSX">
                  <q-item-section avatar>
                    <q-avatar square>
                      <q-img v-lazy :data-url="excel" alt="excel" width="24px" height="24px" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>Exportar XLSX</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>

            <q-btn color="orange-7" label="Enviar Correo" style="width: 150px; height: 30px; border-radius: 8px" no-caps
              icon="send" @click="sendEmail" />
            <q-input outlined dense rounded v-model="search" label="Buscador" class="tw-w-[300px]"
                     @update:model-value="generalFilter">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
      </div>
      <TableReporte :buscar="buscar" class="full-width"
        :key-id="filtro.tipoTramite.toLowerCase() == 'tutelas' || filtro.tipoTramite.toLowerCase() == '' ? 'idTutela' : 'idJuzgado'"
        :TABLE_TOTAL_ROWS="dataTableTotalRows" :TABLE_TOTAL_PAGES="dataTableTotalPages" :TABLE_HEADER="columns"
        :TABLE_BODY="filteredDataTable" select="multiple" @update:itemSelected="selectRows"
        msg-no-data="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
        @update:filas="getPageFilas" @update:pages="getPageFilas" @handlePageChange="handlePageChange"
        @handleRowsPerPageChange="handleRowsPerPageChange" :pagination-message="customMessageTableResults" />
    </q-card>
    <template v-if="reportModal">
      <LoadingModal @load-complete="sendReportModal = true" />
    </template>
    <template>
      <q-dialog v-model="sendReportModal" persistent transition-show="scale" transition-hide="scale"
        transition-duration="300">
        <q-card class="tw-p-10">
          <q-card-section class="tw-bg-white">
            <div class="full-width row  tw-justify-center tw-items-center">
              <img v-lazy :data-url="mail" alt="email" />
            </div>
          </q-card-section>
          <q-card-section>
            <p class="tw-font-bold tw-text-2xl tw-text-center"> Enviar Reporte al Correo</p>
            <p class="tw-font-bold tw-mt-3 tw-ms-4 tw-mb-1">Formato *</p>
            <q-form ref="selectModal">
              <q-select v-model="inputFormat" :rules="[inputRequired]" outlined map-options emit-value
                label="Seleccione" :options="[
              { value: 'xlsx', label: 'Excel' },
              { value: 'csv', label: 'CSV' }
            ]" />
            </q-form>

            <q-expansion-item label="Correo Electrónico *" header-class="tw-font-bold tw-mt-3 tw-mb-1">
              <q-card>
                <q-list bordered>
                  <q-item>
                    <q-item-section>
                      <q-form ref="emailForm">
                        <q-select :disable="emailList.length < 3 ? false : true" :rules="[inputRequired]"
                          v-model="correo" use-input hide-selected fill-input input-debounce="0"
                          :options="optionsCorreos" @filter="filterFnCorreos">
                          <template v-slot:no-option>
                            <q-item>
                              <q-item-section class="text-grey">
                                Sin resultados
                              </q-item-section>
                            </q-item>
                          </template>
                          <template v-slot:prepend>
                            <q-icon name="check_circle" />
                          </template>
                          <template v-slot:append>
                            <q-btn icon="add_circle" color="primary" flat v-on:click="addEmail()" />
                          </template>
                        </q-select>
                      </q-form>
                    </q-item-section>
                  </q-item>
                  <q-item v-for="email in emailList">
                    <q-item-section side>
                      <q-icon color="gray" name="check_circle" />
                    </q-item-section>
                    <q-item-section>
                      {{ email }}
                    </q-item-section>
                    <q-item-section side>
                      <q-btn icon="close" flat v-on:click="deleteEmail(email)" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </q-expansion-item>
          </q-card-section>

          <div class="row justify-center q-mt-md">
            <q-btn color="secondary" flat label="No" v-on:click="confirmCancelarModalEnvioCorreo = true"
              class=" col-5 q-ma-none q-py-md" style="width: 200px; height: 60px;" />

            <q-btn color="secondary" label="Si" v-on:click="reportSuccess" class="col-5 tw-bg-primary q-ma-none q-py-md"
              style="width: 200px; height: 60px;" />
          </div>
        </q-card>
      </q-dialog>
      <Modal v-model="confirmCancelarModalEnvioCorreo" title="Confirmación"
        text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
        :is-success="false" cancel-button text-button-cancel="No" text-button="Si"
        @handleAccept="cancelarEnviarModal" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { exportFile, useQuasar } from "quasar";
import Modal from "src/components/Modal/Modal.vue";
import mail from "src/assets/mail.svg";
import TableReporte from "./TableReporte.vue";
import { alphanumeric, inputRequired, maxLengthInput, onlyNumbers } from 'src/helpers/validations';
import { formatDateTimeStand, fourthFormatDate } from "src/helpers/formtDate";
import excel from "../../../../assets/excel.svg";
import csv from "../../../../assets/csv.svg";
import LoadingModal from "src/components/Modal/LoadingModal.vue";
import { sgdeaAxios } from "src/services";
import moment from "moment";
import {
  useDependencies
} from "src/composables/useVersion";
import { useDepartments, useMunicipalities } from "src/composables/useVersion";
import * as XLSX from 'xlsx';
import { toast } from "src/helpers/toast";

const confirmCancelarModalEnvioCorreo = ref(false)
const rows = ref([]);
const currPage = ref(0)
const pageSize = ref(100000)
const etapaOptions = ref([])
const usuariosOptions = ref([])
const departamentoOptions = ref([])
const juzgadoOptions = ref([])
const municipioOptions = ref([])
const dataTableTotalRows = ref()
const dataTableTotalPages = ref()
const tableKey = ref(0)
const search = ref()
const optionsCode = ref()
const selectedRows = ref([])
const inputFormat = ref('')
const correo = ref()
const emailList = ref([])
const emailForm = ref()
const selectModal = ref()
const { optionsDependencies } = useDependencies()
const correosPositiva = ref([])
const optionsCorreos = ref([])
const listaCausales = ref([])
const customMessageTableResults = ref("")

const REPORTES_HEADER_JUZ = [
  {
    name: "nombre",
    label: "Nombre del Juzgado",
    field: "nombre",
    sortable: true,
    align: 'center'
  },
  {
    name: "codigoJuzgado",
    label: "Código del Juzgado",
    field: "codigo",
    sortable: true,
    align: 'center'
  },
  {
    name: "departamento",
    label: "Departamento",
    field: "departamento",
    sortable: true,
    align: 'center'
  },
  {
    name: "municipio",
    label: "Municipio",
    field: "municipio",
    sortable: true,
    align: 'center'
  },
  {
    name: "correo",
    label: "Correo Electrónico",
    field: "correo",
    sortable: true,
    align: 'center'
  }
];


const REPORTES_HEADER = [
  {
    name: "idRadicado",
    label: "Radicado",
    field: "idRadicado",
    sortable: true,
    align: 'center'
  },
  {
    name: "fecha",
    label: "Fecha de Radicación",
    field: (row) => fourthFormatDate(row.fechaRadicacion),
    sortable: true,
    align: 'center'
  },
  {
    name: "estado",
    label: "Estado",
    field: "estado",
    sortable: true,
    align: 'center'
  },
  {
    name: "documentoAccionante",
    label: "Documento de Accionante",
    field: (row) =>  row.informacionProceso?.numeroDocumentoAccionante,
    sortable: true,
    align: 'center'
  },
  {
    name: "nombreAccionante",
    label: "Nombre del Accionante",
    field: (row) => row.informacionProceso.primerNombreAccionante + ' ' + row.informacionProceso.primerApellidoAccionante + ' ' + row.informacionProceso.segundoNombreAccionante + ' ' + row.informacionProceso.segundoApellidoAccionante,
    sortable: true,
    align: 'center'
  },
  {
    name: "documentoAfectado",
    label: "Documento del Afectado",
    field: (row) => row.informacionProceso.numeroDocumentoAfectado,
    sortable: true,
    align: 'center'
  },
  {
    name: "nombreAfectado",
    label: "Nombre del Afectado",
    field: (row) => row.informacionProceso.primerNombreAfectado + ' ' + row.informacionProceso.primerApellidoAfectado + ' ' + row.informacionProceso.segundoNombreAfectado + ' ' + row.informacionProceso.segundoApellidoAfectado,
    sortable: true,
    align: 'center'
  },
  {
    name: "departamentoRemitente",
    label: "Departamento",
    field: 'departamento',
    sortable: true,
    align: 'center'
  },
  {
    name: "municipioRemitente",
    label: "Municipio",
    field: 'municipio',
    sortable: true,
    align: 'center'
  },
  {
    name: "juzgado",
    label: "Nombre del Juzgado",
    field: (row) => row.juzgado.nombre || 'N/A',
    sortable: true,
    align: 'center'
  },
  {
    name: "numeroProceso",
    label: "Número del Proceso",
    field: 'codigoProceso',
    sortable: true,
    align: 'center'
  },
  {
    name: "fechaInclusionProceso",
    label: "Fecha de Inclusión al Proceso",
    field: (row) => fourthFormatDate(row.fecha),
    sortable: true,
    align: 'center'
  },
  {
    name: "etapaProcesal",
    label: "Etapa Procesal",
    field: (row) => row.etapaProcesal?.nombre || '-',
    sortable: true,
    align: 'center'
  },
  {
    name: "causal",
    label: "Causal",
    field: (row) => buscarNombresCausales(row.informacionProceso.causales, row.informacionProceso.dependencias) || 'N/A',
    sortable: true,
    align: 'center'
  },
  {
    name: "dependencia",
    label: "Dependencia",
    field: (row) => buscarNombres(row.informacionProceso.dependencias) || 'N/A',
    sortable: true,
    align: 'center'
  },
  {
    name: "tiempoResponder",
    label: "Tiempo para Responder",
    field: row => calcularFechaVencimiento(row.informacionProceso.fechaRespuesta),
    sortable: true,
    align: 'center'
  },
  {
    name: "estadoFallo",
    label: "Estado de Etapa",
    field: (row) => row.estadoEtapaProcesal?.nombre ?? 'N/A',
    sortable: true,
    align: 'center'
  },
  {
    name: "gestionador",
    label: "Gestionador",
    field: (row) => row.userId ? row.userId?.firstname + ' ' + row.userId?.lastname : 'N/A',
    sortable: true,
    align: 'center'
  },
  {
    name: "fechaRadicacionSalida",
    label: "Fecha Radicación Salida",
    field: (row) => row.fechaAprobacion != null ? fourthFormatDate(row.fechaAprobacion) : '-',
    sortable: true,
    align: 'center'
  },
  {
    name: "cerrado",
    label: "Cerrado",
    field: (row) => {
      if (row.fechaEnvio) {
        const fechaEnvio = moment(row.fechaEnvio, "YYYY-MM-DD HH:mm:ss");
        const fechaRespuesta = moment(row.informacionProceso.fechaRespuesta, "YYYY-MM-DDTHH:mm:ss.SSSZ");

        if (fechaRespuesta.isAfter(fechaEnvio)) {
          return 'En termino';
        } else {
          return 'Fuera de termino';
        }
      } else {
        return 'En trámite';
      }
    },
    sortable: true,
    align: 'center'
  },
];

const columns = ref(REPORTES_HEADER)

const filtro = ref<IFiltros>({
  tipoTramite: "",
  fechaInicial: "",
  fechaFinal: "",
  identificacion: "",
  tipoDoc: "",
  etapa: "",
  juzgado: "",
  usuario: "",
  siniestro: "",
  municipio: "",
  departamento: "",
  codigo: ""
});

const selectRows = (data) => {
  selectedRows.value = data
}

const facData = ref([]);

const cleanFilters = () => {
  for (let key in filtro.value) {
    filtro.value[key] = "";
  }
  currPage.value = 0
  search.value = ''
  getData()
};

const addEmail = async () => {
  if (await emailForm.value.validate()) {
    if (emailList.value.includes(correo.value.label)) {
      toast.error("El correo ingresado ya se encuentra en la lista")
    } else {
      emailList.value.push(correo.value.label)
      correo.value = ''
      emailForm.value.reset()
    }
  }
}

const deleteEmail = (email) => {
  emailList.value = emailList.value.filter((item) => item != email)
}

let buscar = ref("");
const opCodeJuz = ref([])
onMounted(async () => {
  getFilterData()
  getData();
  const { data } = (await sgdeaAxios.get("/juzgados/activos"));
  opCodeJuz.value = data?.map((item) => ({
    label: item.codigo,
    value: item.codigo
  }))
  optionsCode.value = opCodeJuz.value
  var dataCorreos = await sgdeaAxios.get("/usuarios/all/nombre_email")
  correosPositiva.value = dataCorreos.data.map((item) => ({
    label: item.usuarioEmail,
    value: item.usuarioEmail
  }))
  var causales = await sgdeaAxios.get("/tutela/causales")
  listaCausales.value = causales.data
  optionsCorreos.value = correosPositiva.value
});

const cancelarEnviarModal = () => {
  emailList.value = []
  correo.value = ''
  inputFormat.value = ''
  sendReportModal.value = false
}

const calcularFechaVencimiento = (date) => {
  const fecha = new Date(date);
  const fechaActual = new Date();
  const diferencia = fecha.getTime() - fechaActual.getTime();
  const diasFaltantes = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  return diasFaltantes > 0 ? diasFaltantes > 1 ? diasFaltantes + ' Dias' : diasFaltantes + ' Dia' : 'Vencido'
}

const capitalizarPalabrasExceptoDe = (texto) => {
  const palabras = texto.split(' ');
  for (let i = 0; i < palabras.length; i++) {
    if (palabras[i] !== "de") {
      palabras[i] = palabras[i].charAt(0).toUpperCase() + palabras[i].substring(1);
    }
  }
  return palabras.join(' ');
}

async function getFilterData() {
  try {
    const responseJuzgados = await sgdeaAxios.get('/juzgados/activos')
    const responseGestionadores = await sgdeaAxios.get('/roles/usuarios?rol=Gestionador')
    const responseEtapas = await sgdeaAxios.get('/tutela/listadoEtapaProcesal')

    departamentoOptions.value = await (await useDepartments(425)).optionsDepartments.value
    juzgadoOptions.value = responseJuzgados.data.map((a) => { return { label: a.nombre, value: a.idJuzgado } })
    usuariosOptions.value = responseGestionadores.data.map((a) => { return { label: a.firstname + " " + a.lastname, value: a.userName } })
    etapaOptions.value = responseEtapas.data.map((a) => { return { label: capitalizarPalabrasExceptoDe(a.nombre), value: a.id } })
    // etapaOptions.value.push({label: 'Todas', value: 'Todas'})
  } catch (error) {
    console.error(error);
  }
}


watch(
  () => filtro.value.departamento,
  async (value) => {
    if (value.value) {
      filtro.value.municipio = ''
      const { optionsMunicipalities } = await useMunicipalities(value.value);
      municipioOptions.value = optionsMunicipalities.value;
    }
  }
);



async function getData() {
  let params = [];

  // Define the mapping between filtro.value properties and URL parameters
  const paramMapping = {
    fechaInicial: 'fechaInicial',
    fechaFinal: 'fechaFinal',
    identificacion: 'numeroIdentificacion',
    siniestro: 'numerosiniestro',
    usuario: 'nombreGestionador',
    juzgado: 'idJuzgado',
    etapa: 'idEtapaProcesal',
    codigo: 'codigoJuzgado',
    departamento: 'departamento',
    municipio: 'municipio'
  };

  // Loop over the mapping and generate parameters
  Object.keys(paramMapping).forEach(key => {
    if (filtro.value[key].value) {
      params.push(`${paramMapping[key]}=${filtro.value[key].label}`);
    } else if (filtro.value[key]) {
      params.push(`${paramMapping[key]}=${filtro.value[key]}`);
    }
  });


  let url = `/tutela/listadoReporteTutelas?pageSize=${pageSize.value}&pageNo=${currPage.value}`;

  if (filtro.value.tipoTramite == 'Juzgados') {
    url = `/tutela/listadoReporteJuzgado?pageSize=${pageSize.value}&pageNo=${currPage.value}`
  }

  if (params.length) {
    url += `&${params.join('&')}`;
  }

  const response = await sgdeaAxios.get(url);

  if (filtro.value.tipoTramite == 'Juzgados') {
    columns.value = REPORTES_HEADER_JUZ
    tableKey.value++
  } else {
    columns.value = REPORTES_HEADER
    tableKey.value++
  }

  facData.value = response.data.elementos || response.data.content;
  dataTableTotalRows.value = response.data.totalElements
  dataTableTotalPages.value = response.data.totalPages
  customMessageTableResults.value = response.data.paginationMessage
  var filter = facData.value.sort((a, b) => new Date(a.fechaRadicacion) - new Date(b.fechaRadicacion))
  filteredDataTable.value = filter

}

const filasGrilla = ref()
const numPageGrilla = ref()

const buscarNombres = (codigos) => {
  const nombres = [];
  for (const codigo of codigos.split(",")) {
    nombres.push(buscarNombrePorCodigo(codigo, optionsDependencies.value));
  }
  return nombres.join(", ");
}

const buscarNombresCausales = (codigos) => {
  const nombres = [];

  for (const codigo of codigos.split(",")) {
    nombres.push(buscarNombrePorCodigoC(codigo, listaCausales.value));
  }
  return nombres.join(", ");
}

const buscarNombrePorCodigo = (codigo, arrayCodigosNombres) => {
  for (const item of arrayCodigosNombres) {
    if (item.value == codigo) {
      return item.label;
    }
  }
  return "-";
}

const buscarNombrePorCodigoC = (codigo, arrayCodigosNombres) => {
  for (const item of arrayCodigosNombres) {
    if (item.id == codigo) {
      return item.nombre;
    }
  }
  return "-";
}

const getPageFilas = async (filas = 20, page = 0) => {
  filasGrilla.value = filas
  numPageGrilla.value = page
  let params = [];

  // Define the mapping between filtro.value properties and URL parameters
  const paramMapping = {
    fechaInicial: 'startDate',
    fechaFinal: 'endDate',
    identificacion: 'numeroIdentificacion',
    siniestro: 'numerosiniestro',
    usuario: 'nombreGestionador',
    juzgado: 'idJuzgado',
    etapa: 'idEtapaProcesal',
    codigo: 'codigoJuzgado',
    departamento: 'departamento',
    municipio: 'municipio'
  };

  // Loop over the mapping and generate parameters
  Object.keys(paramMapping).forEach(key => {
    if (filtro.value[key].value) {
      params.push(`${paramMapping[key]}=${filtro.value[key].label}`);
    } else if (filtro.value[key]) {
      params.push(`${paramMapping[key]}=${filtro.value[key]}`);
    }
  });

  let url = `/tutela/listadoReporteTutelas?pageSize=${filas}&pageNo=${page}`;

  if (filtro.value.tipoTramite == 'Juzgados') {
    url = `/tutela/listadoReporteJuzgado?pageSize=${pageSize.value}&pageNo=${currPage.value}`
  }

  if (params.length) {
    url += `&${params.join('&')}`;
  }

  const response = await sgdeaAxios.get(url);

  if (filtro.value.tipoTramite == 'Juzgados') {
    columns.value = REPORTES_HEADER_JUZ
    tableKey.value++
  } else {
    columns.value = REPORTES_HEADER
    tableKey.value++
  }

  facData.value = response.data.elementos || response.data.content;
  dataTableTotalRows.value = response.data.totalElements
  dataTableTotalPages.value = response.data.totalPages
  var filter = facData.value.sort((a, b) => new Date(a.fechaRadicacion) - new Date(b.fechaRadicacion))
  filteredDataTable.value = filter

}

const opForFinal = (date) => {
  const inicial = moment(filtro.value.fechaInicial, 'DD/MM/YYYY').format('YYYY/MM/DD')
  const conMes = moment(filtro.value.fechaInicial, 'DD/MM/YYYY').add(1, 'months').format('YYYY/MM/DD')

  return date >= inicial
}

watch(
  () => filtro.value.tipoTramite,
  async (value) => {
    getData()
  }
);

const generalFilter = () => {
  filteredDataTable.value = facData.value.filter(obj => {
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

const handlePageChange = async (page: number) => {
  currPage.value = page <= 0 ? 0 : page - 1;
  await getData();
}

const handleRowsPerPageChange = async (rowsPerPage: any) => {
  pageSize.value = rowsPerPage;
  await getData();
}

const filterFn = (val, update, abort) => {
  if (val === '') {
    update(() => {
      optionsCode.value = opCodeJuz.value
    })
    return
  }

  update(() => {
    const needle = val.toLocaleLowerCase()
    optionsCode.value = opCodeJuz.value.filter(v => v.label.toLocaleLowerCase().indexOf(needle) > -1)
  })
}

const filteredDataTable = ref([])

const exportXLSX = () => {
  var dataFinal = selectedRows.value.length > 0 ? selectedRows.value : facData.value
  let ws_data = [
    columns.value.map((col) => col.label),
    ...dataFinal.map((row) =>
      columns.value.map((col) => {
        let value = typeof col.field === "function"
          ? col.field(row)
          : row[col.field === void 0 ? col.name : col.field];
        // check if col.format is a function and apply it
        if (col.format && typeof col.format === "function") {
          value = col.format(value);
        }
        return value;
      })
    ),
  ];

  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

  try {
    XLSX.writeFile(wb, `Listado ${filtro.value.tipoTramite.toLowerCase() || 'tutelas'} ${filtro.value.tipoTramite.toLowerCase() == 'tutelas' || filtro.value.tipoTramite.toLowerCase() == '' ? 'radicadas' : ''} ${formatDateTimeStand(new Date())}.xlsx`);
    toast.success("Archivo descargado con exito!");
  } catch (error) {
    toast.error("El navegador rechazó la descarga del archivo");
  }
};

function csvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

const exportCSV = () => {
  var dataFinal = selectedRows.value.length > 0 ? selectedRows.value : facData.value
  const content = [
    columns.value.map((col) => csvValue(col.label, undefined, undefined)),
    ...dataFinal.map((row) =>
      columns.value.map((col) =>
        csvValue(
          typeof col.field === "function"
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format,
          row
        )
      )
    ),
  ].join("\r\n");

  const status = exportFile(`Listado ${filtro.value.tipoTramite.toLowerCase() || 'tutelas'} ${filtro.value.tipoTramite.toLowerCase() == 'tutelas' || filtro.value.tipoTramite.toLowerCase() == '' ? 'radicadas' : ''} ${formatDateTimeStand(new Date())}.csv`, content, "text/csv");

  if (status !== true) {
    toast.error("El navegador rechazó la descarga del archivo");
  } else {
    toast.success("Archivo descargado con exito!");
  }
};

const onItemClick = () => {

};

const filterFnCorreos = (val, update, abort) => {
  if (val.length < 1) {
    abort()
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    optionsCorreos.value = correosPositiva.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}
const reportModal = ref(false);
const sendReportModal = ref(false);

const sendEmail = () => {
  sendReportModal.value = true;
};

const reportSuccess = async () => {

  if (await selectModal.value.validate()) {
    if (emailList.value.length > 0) {
      if (inputFormat.value == 'xlsx') {
        //EXCEL
        var dataFinal = selectedRows.value.length > 0 ? selectedRows.value : facData.value;
        let ws_data = [
          columns.value.map((col) => col.label),
          ...dataFinal.map((row) =>
            columns.value.map((col) => {
              let value = typeof col.field === "function"
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field];
              // check if col.format is a function and apply it
              if (col.format && typeof col.format === "function") {
                value = col.format(value);
              }
              return value;
            })
          ),
        ];

        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

        try {
          let binaryData = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });
          let data = new Uint8Array(binaryData.length);
          for (let i = 0; i != binaryData.length; ++i) {
            data[i] = binaryData.charCodeAt(i) & 0xFF;
          }
          let blob = new Blob([data], { type: "application/octet-stream" });
          let file = new File([blob], `Listado ${filtro.value.tipoTramite.toLowerCase() || 'tutelas'} ${filtro.value.tipoTramite.toLowerCase() == 'tutelas' || filtro.value.tipoTramite.toLowerCase() == '' ? 'radicadas' : ''} ${formatDateTimeStand(new Date())}.xlsx`);
          const formdata = new FormData();
          formdata.append('email', emailList.value.join(','))
          formdata.append("archivo", file);
          const headers = {
            "Access-Control-Allow-Origin": "*",
            accept: "*",
            "Content-Type": "multipart/form-data",
            "Content-Transfer-Encoding": "BINARY"
          };
          var enviarCorreo = await sgdeaAxios.post("/tutela/envioCSV", formdata, { headers })
          if (enviarCorreo) {
            toast.success(`El reporte de ${filtro.value.tipoTramite == 'Juzgados' ? 'Juzgados' : 'Tutelas'} ha sido enviado con éxito a los correos  ingresados.`);
            sendReportModal.value = false;
          }

        } catch (error) {
          toast.error("Hubo un error al generar el archivo");
        }
      } else {
        ////CSV
        var dataFinal = selectedRows.value.length > 0 ? selectedRows.value : facData.value;
        const content = [
          columns.value.map((col) => csvValue(col.label, undefined, undefined)),
          ...dataFinal.map((row) =>
            columns.value.map((col) =>
              csvValue(
                typeof col.field === "function"
                  ? col.field(row)
                  : row[col.field === void 0 ? col.name : col.field],
                col.format,
                row
              )
            )
          ),
        ].join("\r\n");

        try {
          let blob = new Blob([content], { type: "text/csv" });
          let file = new File([blob], `Listado ${filtro.value.tipoTramite.toLowerCase() || 'tutelas'} ${filtro.value.tipoTramite.toLowerCase() == 'tutelas' || filtro.value.tipoTramite.toLowerCase() == '' ? 'radicadas' : ''} ${formatDateTimeStand(new Date())}.csv`);
          const formdata = new FormData();
          formdata.append('email', emailList.value[0])
          formdata.append("archivo", file);
          const headers = {
            "Access-Control-Allow-Origin": "*",
            accept: "*",
            "Content-Type": "multipart/form-data",
            "Content-Transfer-Encoding": "BINARY"
          };
          var enviarCorreo = await sgdeaAxios.post("/tutela/envioCSV", formdata, { headers })
          if (enviarCorreo) {
            toast.success(`El reporte de ${filtro.value.tipoTramite == 'Juzgados' ? 'Juzgados' : 'Tutelas'} ha sido enviado con éxito a los correos  ingresados.`)
            sendReportModal.value = false
          }

        } catch (error) {
          toast.error("Hubo un error al generar el archivo");
        }
      }

    } else {
      toast.error("Debe ingresar un correo electrónico válido para continuar")
    }
  } else {
    toast.error("Para poder continuar con el proceso debe seleccionar un formato")
  }

};
</script>
