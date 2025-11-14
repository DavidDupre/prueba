<template>
  <div class="tw-flex tw-justify-center tw-items-center tw-flex-col tw-mt-4 tw-px-6 tw-bg-[#f8f8f8]">
    <div class="tw-w-full tw-flex tw-flex-row tw-items-center tw-justify-between">
      <p class="pl-4 tw-font-bold tw-text-3xl tw-mt-5 tw-mb-3 text-bold">
        Reportes
      </p>
    </div>

    <q-card class="q-mt-lg tw-rounded-xl q-pa-lg tw-w-[100%] tw-mb-5" flat>
      <q-expansion-item default-opened>
        <template v-slot:header>
          <div class="col row">
            <b class="tw-text-lg">Filtrar por</b>
          </div>
        </template>
        <div class="row q-col-gutter-md q-pb-md q-px-md">
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-3">
            <label class="tw-w-full">
              <span class="tw-text-label">Tipo de reporte</span>
              <q-select v-model="filtro.tipoReporte" label="Seleccione" dense outlined class="tw-rounded-lg"
                :options="['Reporte de entrada', 'Reporte de salida']">
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-3">
            <p class="tw-text-label">Fecha inicial</p>
            <Datepicker label="dd/mm/aaaa" mask="DD/MM/YYYY" v-model:input-data-prop="filtro.fechaInicial"
              :options="optionsDateFunc" :disable="filtro.tipoReporte == ''" />
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-3">
            <p class="tw-text-label">Fecha final</p>
            <Datepicker label="dd/mm/aaaa" mask="DD/MM/YYYY" v-model:input-data-prop="filtro.fechaFinal"
              :options="optionsDateFunc" :disable="filtro.tipoReporte == ''" />
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-3">
            <label class="tw-text-label">Número de radicado
              <q-select dense outlined map-options :options="filteredRadicados" v-model="filtro.numeroRadicado"
                label="Búsqueda" maxlength="20" :disable="filtro.tipoReporte == ''" use-input fill-input hide-selected
                @filter="filterRadicados">
                <template v-slot:append>
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
            </label>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-3">
            <label class="tw-w-full">
              <span class="tw-text-label">Estado</span>
              <q-select v-model="filtro.estado" label="Seleccione" dense outlined class="tw-rounded-lg"
                :options="estadoOptions" :disable="filtro.tipoReporte == ''">
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-3">
            <label class="tw-text-label">Siniestros
              <SearchInput map-options :options="optionsSiniestros" v-model:input-data-prop="filtro.siniestros"
                label="Búsqueda" maxlength="20" :disable="filtro.tipoReporte == ''" />
            </label>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-3">
            <label class="tw-text-label">Número identificación del afectado
              <SearchInput map-options :options="optionsDocRemitentes"
                v-model:input-data-prop="filtro.numeroIdentificación" label="Búsqueda" maxlength="20"
                :disable="filtro.tipoReporte == ''" />
            </label>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-3">
            <label class="tw-text-label">Prefijo
              <SearchInput :options="optionsPrefijos" v-model:input-data-prop="filtro.prefijo" label="Búsqueda"
                maxlength="20" :disable="filtro.tipoReporte == ''" />
            </label>
          </div>
        </div>
        <div class="tw-w-full tw-flex tw-justify-center">
          <q-btn text-color="black" class="tw-text-lg tw-w-44 tw-h-[40px] tw-border" outline @click="clear">Limpiar
            filtros</q-btn>
          <q-btn color="primary" class="tw-text-lg tw-w-44 tw-h-[40px] tw-ml-4 tw-border tw-border-[#fd9c4a]"
            @click="clickData()" :disable="filtro.tipoReporte == ''">Buscar</q-btn>
        </div>
      </q-expansion-item>
    </q-card>

    <div v-if="showTable"
      class="tw-w-[100%] tw-bg-white tw-rounded-md tw-px-8 tw-pb-8 tw-flex tw-flex-col tw-gap-x-4 tw-justify-center">
      <q-card class="tw-rounded-xl q-mt-lg tw-px-5 tw-pt-5 tw-pb-3" flat bordered>

        <div class="flex items-center justify-between q-px-md q-mb-sm row col-12">
          <span class="text-weight-bold text-h6" style="color: #2c3948">Listado de Radicados de {{ reportType }}</span>

          <div class="tw-flex tw-items-center tw-gap-10">
            <q-input v-model="search" placeholder="Buscar" @update:model-value="generalFilter">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>

            <div class="tw-flex tw-items-center tw-gap-2.5">
              <q-btn-dropdown color="accent" textColor="secondary" label="Exportar"
                style="width: 116px; height: 30px; border-radius: 8px" no-caps dropdown-icon="expand_more">
                <q-list separator dense>
                  <q-item clickable v-close-popup @click="exportExcel(2)">
                    <q-item-section avatar>
                      <q-avatar square>
                        <q-img v-lazy :data-url="csv" alt="csv" width="24px" height="24px" />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section>Exportar CSV</q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="exportExcel(1)">
                    <q-item-section avatar>
                      <q-avatar square>
                        <q-img v-lazy :data-url="excel" alt="excel" width="24px" height="24px" />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section>Exportar XLSX</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>

              <q-btn color="orange-7" label="Enviar correo" style="width: 150px; height: 30px; border-radius: 8px"
                no-caps icon="send" @click="sendReportModal = true;" />
            </div>
          </div>
        </div>
        <tableML :buscar="buscar" class="full-width" key-id="idRadicado" :TABLE_TOTAL_ROWS="dataTableTotalRows"
          :TABLE_HEADER="columns" :TABLE_BODY="tableDataMl" select="multiple" v-model:item-selected="selection"
          @update:itemSelected="selectRows" @handlePageChange="handlePageChange"
          @handleRowsPerPageChange="handleRowsPerPageChange" :pagination-message="customMessageTableResults" />
      </q-card>
    </div>
  </div>

  <template v-if="reportModal">
    <LoadingModal @load-complete="sendReportModal = true" />
  </template>

  <template>
    <q-dialog v-model="sendReportModal" persistent transition-show="scale" transition-hide="scale"
      transition-duration="300">
      <q-card class="tw-p-10">
        <q-card-section class="tw-bg-white">
          <div class="full-width row tw-justify-center tw-items-center">
            <img v-lazy :data-url="mail" alt="email" />
          </div>
        </q-card-section>
        <q-card-section>
          <p class="tw-font-bold tw-text-2xl tw-text-center"> Enviar Reporte al Correo</p>
          <p class="tw-font-bold tw-mt-3 tw-mb-1">Formato *</p>
          <q-form ref="selectModal">
            <q-select v-model="inputFormat" :rules="[inputRequired]" outlined map-options emit-value label="Seleccione"
              :options="[
                { value: 'xlsx', label: 'Excel' },
                { value: 'csv', label: 'CSV' }
              ]" :disable="loadingSendEnvios" />
          </q-form>

          <q-expansion-item label="Correo Electrónico *" header-class="tw-font-bold tw-mt-3 tw-mb-1">
            <q-card>
              <q-list bordered>
                <q-item>
                  <q-item-section>
                    <q-form ref="emailForm">
                      <q-select :disable="emailList.length < 3 ? false : true" :rules="[inputRequired]" v-model="correo"
                        use-input hide-selected fill-input input-debounce="0" :options="optionsCorreos"
                        @filter="filterFnCorreos">
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
                          <q-btn icon="add_circle" color="primary" flat v-on:click="addEmail()"
                            :disable="loadingSendEnvios" />
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
                    <q-btn icon="close" flat v-on:click="deleteEmail(email)" :disable="loadingSendEnvios" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </q-expansion-item>
        </q-card-section>

        <div class="row justify-center q-mt-md">
          <q-btn v-if="!loadingSendEnvios" color="secondary" flat label="No"
            v-on:click="confirmCancelarModalEnvioCorreo = true" class=" col-5 q-ma-none q-py-md"
            style="width: 200px; height: 60px;" />

          <q-btn v-if="!loadingSendEnvios" color="secondary" label="Si" v-on:click="reportSuccess"
            class="col-5 tw-bg-primary q-ma-none q-py-md" style="width: 200px; height: 60px;" />

          <q-btn v-if="loadingSendEnvios" type="button" flat class="tw-h-12 text-weight-bold tw-text-2xl"
            style="width: 50%" color="orange" :loading="loadingSendEnvios" />
        </div>
      </q-card>
    </q-dialog>

    <Modal v-model="confirmCancelarModalEnvioCorreo" title="Confirmación"
      text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
      :is-success="false" cancel-button text-button-cancel="No" text-button="Si" @handleAccept="cancelarEnviarModal" />
  </template>

  <!-- ! Loader -->
  <template>
    <q-dialog v-model="isLoading">
      <q-card class="tw-w-full tw-h-1/2 tw-flex tw-justify-center tw-items-center">
        <q-card-section>
          <div class="text-center">
            <q-circular-progress show-value :value="valueProgress" indeterminate class="tw-font-bold w-full" size="80px"
              color="primary">
              {{ valueProgress }}%
            </q-circular-progress>
            <section class="tw-mt-10">
              <div class="tw-text-2xl tw-font-bold">Consultando información</div>
              <div class="text-subtitle1 tw-mt-2">Espere un momento por favor</div>
            </section>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </template>

</template>

<script setup lang="ts">
import Datepicker from "components/FormFields/datePickerComponent.vue";
import SearchInput from "src/components/SearchInput/SearchInput.vue";
import { Ref, ref, onMounted } from 'vue';
import moment from "moment";
import tableML from './TableML.vue';
import { inputRequired } from 'src/helpers/validations';
import { toast } from "src/helpers/toast";
import Modal from "src/components/Modal/Modal.vue";
import csv from "../../../assets/csv.svg";
import excel from "../../../assets/excel.svg";
import mail from "src/assets/mail.svg";
import LoadingModal from "src/components/Modal/LoadingModal.vue";
import { sgdeaAxios } from 'src/services';
import { REPORTES_HEADER, REPORTES_HEADER_DOCSAL } from ".";

const confirmCancelarModalEnvioCorreo = ref(false)
const isLoading = ref(false)
const showTable = ref(false)
const valueProgress = ref(0)
const search = ref()
const dataTableTotalRows = ref()
const selectedRows = ref()
const mlData = ref([]);
const tableData = ref([]);
const tableDataMl = ref()
const correo = ref()
const docRemitentesMl = ref([])
const optionsDocRemitentes: Ref<{ label: string; value: number }[]> = ref([]);
const estadoMl = ref([])
const estadoOptions: Ref<{ label: string; value: number }[]> = ref([]);
const radicadosMl = ref([])
const optionsRadicados: Ref<{ label: string; value: number }[]> = ref([]);
const siniestrosMl = ref([])
const optionsSiniestros: Ref<{ label: string; value: number }[]> = ref([]);
const prefijosMl = ref([])
const optionsPrefijos: Ref<{ label: string; value: number }[]> = ref([]);
const correosPositiva = ref([])
const optionsCorreos = ref([])
const emailList = ref([])
const emailForm = ref()
const selectModal = ref()
const tipoReporte = ref();
const filtroFechaInicial = ref();
const filtroFechaFinal = ref();
const inputFormat = ref('')
const sendReportModal = ref(false);
const reportModal = ref(false);
const columns = ref();
const selection = ref([]);
const filteredRadicados = ref()
let buscar = ref("");
const infoFiltros = ref()
const reportType = ref('')
const loadingSendEnvios = ref()
const customMessageTableResults = ref("")

const filtro = ref({
  tipoReporte: "",
  fechaInicial: "",
  fechaFinal: "",
  numeroRadicado: { label: '', value: '' },
  estado: '',
  siniestros: "",
  numeroIdentificación: { label: '', value: '' },
  prefijo: { label: '', value: '' }
});

onMounted(async () => {
  try {
    await getData(0, 20)
    const dataCorreos = await sgdeaAxios.get("/usuarios/all/nombre_email")
    correosPositiva.value = dataCorreos.data.map((item) => ({
      label: item.usuarioEmail,
      value: item.usuarioEmail
    }))
    optionsCorreos.value = correosPositiva.value

    const responsePref = await sgdeaAxios.get('/medicina/prefijos')
    prefijosMl.value = responsePref.data.map((item) => ({
      label: item.nombre,
      value: item.id
    }))
    optionsPrefijos.value = prefijosMl.value

    const responseRadicados = await sgdeaAxios.get('/medicina/radicados', {
      params: { palabra: '', page: 0, size: 5 }
    })
    radicadosMl.value = responseRadicados.data.content.map((item) => ({
      label: item,
      value: item
    }))
    optionsRadicados.value = radicadosMl.value

    const responseEstado = await sgdeaAxios.get('/estadosProceso/all')
    estadoMl.value = responseEstado.data.map((item) => ({
      label: item.estado,
      value: item.etapa
    }))
    estadoOptions.value = estadoMl.value.filter((item) => item.value !== null && item.value !== "");

    const responseSiniestro = await sgdeaAxios.get('/medicina/getSiniestrosUnico')
    siniestrosMl.value = responseSiniestro.data.map((item) => ({
      label: item.siniestro,
      value: item.siniestro
    }))
    optionsSiniestros.value = siniestrosMl.value.filter((item) => item.value !== null && item.value !== "" && item.value !== undefined);

    const responseDocRemitentes = await sgdeaAxios.get('/medicina/docRemitentes')
    docRemitentesMl.value = responseDocRemitentes.data.map((item) => ({
      label: item,
      value: item
    }))
    optionsDocRemitentes.value = docRemitentesMl.value.filter((item, index, self) => self.findIndex((i) => i.label === item.label) === index && item.value !== "");
  } catch (error) {
    console.error(error)
  }
})

async function getData(page: number, size: number) {
  const fechaActual = new Date().toISOString();
  filtroFechaInicial.value = formatFecha(filtro.value.fechaInicial)
  filtroFechaFinal.value = formatFecha(filtro.value.fechaFinal)

  const payload = {
    tipoReporte: tipoReporte.value == undefined ? 1 : tipoReporte.value,
    fechaInicial: filtro.value.fechaInicial == '' ? "2024-01-01T00:00:00.000Z" : filtroFechaInicial.value,
    fechaFinal: filtro.value.fechaFinal == '' ? fechaActual : filtroFechaFinal.value,
    numeroRadicado: filtro.value.numeroRadicado.value == '' ? null : filtro.value.numeroRadicado.value,
    // @ts-expect-error
    formato: filtro.value.formato == '' ? null : filtro.value.formato,
    estado: filtro.value.estado === '' || undefined ? null : filtro.value.estado.value,
    siniestro: filtro.value.siniestros == '' ? null : filtro.value.siniestros,
    numeroIdentificacionAfectado: filtro.value.numeroIdentificación.value == '' ? null : filtro.value.numeroIdentificación.value,
    prefijo: filtro.value.prefijo.value == '' ? null : filtro.value.prefijo.value,
    page: page,
    size: size
  }

  infoFiltros.value = { ...payload }
  reportType.value = tipoReporte.value === 1 ? 'Entrada' : 'Salida'

  try {
    const response = await sgdeaAxios.post('/medicina/reportes', payload);
    if (tipoReporte.value == 1) {
      tableData.value = await Promise.all(response.data.content.map(async (item) => {

        return {
          idRadicado: item.numeroRadicado || "NO REPORTA",
          fechaR: item.fechaRadicacion ? moment(item.fechaRadicacion).format('DD/MM/YYYY h:mm:ss a') : "NO REPORTA",
          fechaM: item.fechaVencimiento ? moment(item.fechaVencimiento).format('DD/MM/YYYY h:mm:ss a') : "NO REPORTA",
          fechaC: item.fechaCreacionDocumento ? moment(item.fechaCreacionDocumento).format('DD/MM/YYYY h:mm:ss a') : "NO REPORTA",
          fechaE: item.fechaEnvioAprobacion ? moment(item.fechaEnvioAprobacion).format('DD/MM/YYYY h:mm:ss a') : "NO REPORTA",
          tiempoV: `${item.tiempo < 0 ? 'FUERA DE TERMINO' : `${item.tiempo ? "EN TERMINO" : "NO REPORTA"}`}`,
          canal: item.canalRadicacion || "NO REPORTA",
          detalleTramite: item.detalleTramite || "NO REPORTA",
          estado: item.estado || "NO REPORTA",
          radicador: `${item.usuarioCreadorFirstName} ${item.usuarioCreadorLastName}` || "NO REPORTA",
          oficinaRespuesta: item.oficinaResponsableRespuesta || "NO REPORTA",
          tiempoAsignacion: item.fechaRadicacion && item.fechaAsignacionGestionador ? `${calcularDiasEntreFechas(item.fechaRadicacion, item.fechaAsignacionGestionador)} Día(s)` : 'NO REPORTA',
          asignador: `${item.asignadorFirstName ? item.asignadorFirstName + ' ' + item.asignadorLastName : 'NO REPORTA'}`,
          proceso: item.proceso || "NO REPORTA",
          subproceso: item.subProceso || "NO REPORTA",
          formatoTiempo: item.formatoTiempo || "NO REPORTA",
          tiempoDefinido: item.tiempoSubproceso || "NO REPORTA",
          fechaAsignacionOficina: item.fechaAsignacionGestionador ? moment(item.fechaAsignacionGestionador).format('DD/MM/YYYY h:mm:ss a') : "NO REPORTA",
          fechaAsignacionGestionador: item.fechaAsignacionGestionador ? moment(item.fechaAsignacionGestionador).format('DD/MM/YYYY h:mm:ss a') : "NO REPORTA",
          diasAsignacionGestionador: `${item.tiempo || 0} Día(s)`,
          gestionador: item.gestionadorFirstName ? `${item.gestionadorFirstName} ${item.gestionadorLastName}` : "-",
          fechaIniciarGestion: item.fechaAsignacionGestionador ? moment(item.fechaAsignacionGestionador).format('DD/MM/YYYY h:mm:ss a') : "NO REPORTA",
          tipoSolicitud: item.tipoSolicitud ? item.tipoSolicitud : 'NO REPORTA',
          tipoTramite: item.tipoTramite || "NO REPORTA",
          numeroSiniestro: item.numeroSiniestro || "NO REPORTA",
          fechaEnvioAprobacion: item.fechaEnvioAprobacion ? moment(item.fechaEnvioAprobacion).format('DD/MM/YYYY h:mm:ss a') : "NO REPORTA",
          fechaAprobacion: item.fechaAprobacion ? moment(item.fechaAprobacion).format('DD/MM/YYYY h:mm:ss a') : "NO REPORTA",
          diasGestionAprobacion: item.fechaEnvioAprobacion && item.fechaAprobacion ? `${calcularDiasEntreFechas(item.fechaEnvioAprobacion, item.fechaAprobacion)} Día(s)` : 'NO REPORTA',
          aprobador: item.aprobadorFirstName ? `${item.aprobadorFirstName} ${item.aprobadorLastName}` : "NO REPORTA",
          compromisosProximos: item.compromisosProximos || "no",
          nombreRemitente: item.nombreRemitente || "NO REPORTA",
          departamentoRemitente: item.departamentoRemitente || "NO REPORTA",
          municipioRemitente: item.municipioRemitente || "NO REPORTA",
          direccionRemitente: item.direccionRemitente || "NO REPORTA",
          correoRemitente: item.correoRemitente || "NO REPORTA",
          tipoDocumentoAfectado: item.tipoDocumentoAfectado || "NO REPORTA",
          documentoAfectado: item.documentoAfectado || "NO REPORTA",
          nombreAfectado: item.nombreAfectado || "NO REPORTA",
          generoAfectado: item.generoAfectado == null ? "NO REPORTA" : item.generoAfectado,
          empresaAfectado: item.empresaAfectado == null ? "NO REPORTA" : item.empresaAfectado,
          direccionAfectado: item.direccionAfectado || "NO REPORTA",
          correoAfectado: item.correoAfectado || "NO REPORTA",
          telefonoAfectado: item.telefonoAfectado || "NO REPORTA",
          tiempoEnGestion: item.tiempoGestion || "0",
          prefijo: item.prefijo || "NO REPORTA",
          radicadoSalida: item.numeroRadicadoSalida || "NO REPORTA",
          fechaRadicacionSalida: item.fechaRadicadoSalida ? moment(item.fechaRadicadoSalida).format('DD/MM/YYYY h:mm:ss a') : "NO REPORTA",
          medioEnvio: item.formaEnvio || "NO REPORTA",
          numeroGuia: item.numeroGuia || "NO REPORTA",
          estadoSalida: "NO REPORTA",
          tipoDocumentoDestinatario: item.tipoDocumentoDestinatario || "NO REPORTA",
          numeroDocumentoDestinatario: item.numeroDocumentoDestinatario || "NO REPORTA",
          nombreDestinatario: item.nombreDestinatario || "NO REPORTA",
          departamentoDestinatario: item.departamentoDestinatario || "NO REPORTA",
          municipioDestinatario: item.municipioRemitente || 'NO REPORTA',
          direccionDestinatario: item.direccionDestinatario || "NO REPORTA",
          telefonoDestinatario: item.telefonoDestinatario || "NO REPORTA",
          correoDestinatario: item.correoDestinatario || "NO REPORTA",
          conCopia: item.conCopia || 'NO REPORTA',
          fechaCierre: 'NO REPORTA',
          revisor: item.revisorFirstName ? `${item.revisorFirstName}${item.revisorLastName} ` : 'NO REPORTA',
          enviadoCopia: item.enviadoElConCopia || 'NO REPORTA',
          formaCopia: item.formaEnvioElConCopia || 'NO REPORTA',
          formaDestinatarioCopia: item.formaEnvioDestinatarioCopia || 'NO REPORTA',
          proveedor: 'NO REPORTA',
          fechaEnvioRevisio: item.fechaEnvioRevision ? item.fechaEnvioRevision : 'NO REPORTA',
          fechaRevision: item.fechaRevision ? item.fechaRevision : 'NO REPORTA',
          diasEnGestionDeRevision: 'NO REPORTA',
        }
      },))
    } else {
      tableData.value = await Promise.all(response.data.content.map(async (item) => {
        return {
          idRadicado: item.numeroRadicadoSalida || 'NO REPORTA',
          copia: item.copia,
          fechaRadicacionSalida: item.fechaAprobacion ? moment(item.fechaAprobacion).format('DD/MM/YYYY h:mm:ss a') : "-",
          mes: item.mes == null ? '-' : item.mes,
          destinatario: item.nombreDestinatario || 'NO REPORTA',
          tipoDocumento: item.tipoDocumentoDestinatario || 'NO REPORTA',
          numeroDocumento: item.numeroDocumentoDestinatario || 'NO REPORTA',
          departamento: item.departamentoDestinatario || 'NO REPORTA',
          municipio: item.municipioDestinatario || 'NO REPORTA',
          radicadoEntrada: item.numeroRadicado || 'NO REPORTA',
          fechaRadicacionEntrada: item.fechaRadicacion ? moment(item.fechaRadicacion).format('DD/MM/YYYY h:mm:ss a') : 'NO REPORTA',
          remitente: item.nombreRemitente || 'NO REPORTA',
          correoRemitente: item.correoRemitente || 'NO REPORTA',
          fechaMaximaRespuesta: item.fechaVencimiento ? moment(item.fechaVencimiento).format('DD/MM/YYYY h:mm:ss a') : 'NO REPORTA',
          radicadoAnterior:
            item.radicadosAsociados === null ||
              item.radicadosAsociados === '' ||
              item.radicadosAsociados === undefined ||
              (Array.isArray(item.radicadosAsociados) && item.radicadosAsociados.length === 0)
              ? 'NO REPORTA'
              : item.radicadosAsociados,
          consecutivoCreacion: item.consecutivoCreacion || 'NO REPORTA',
          fechaCreacion: item.fechaCreacionDocumento ? moment(item.fechaCreacionDocumento).format('DD/MM/YYYY h:mm:ss a') : 'NO REPORTA',
          tramite: item.tipoTramite,
          gestionador: item.gestionadorFirstName ? `${item.gestionadorFirstName} ${item.gestionadorLastName}` : "NO REPORTA",
          oficina: item.oficina || 'NO REPORTA',
          radicador: `${item.radicadorFirstName} ${item.radicadorLastName}`,
          cantidadFolios: item.folios,
          empresa: item.empresaAfectado || 'NO REPORTA',
          proveedor: 'NO REPORTA',
          anexos: item.anexos,
          prefijo: item.prefijo || 'NO REPORTA',
          asunto: item.asunto || 'NO REPORTA',
          estadoSalida: item.estadoSalida || 'NO REPORTA',
          afectado: item.nombreAfectado || 'NO REPORTA',
          tipoDocumentoAfectado: item.tipoDocumentoAfectado || 'NO REPORTA',
          numeroDocumentoAfectado: item.documentoAfectado || 'NO REPORTA',
          empresaAfectado: item.empresaAfectado == null ? "NO REPORTA" : item.empresaAfectado,
          siniestro: item.numeroSiniestro || 'NO REPORTA',
          proceso: item.proceso || 'NO REPORTA',
          subproceso: item.subProceso || 'NO REPORTA',
          formatoTiempo: item.formatoTiempo || 'NO REPORTA',
          tiempoDefinido: item.tiempo || 'NO REPORTA',
          compromisosProximos: item.compromisosProximos || 'NO REPORTA',
          descripcionCompromisosProximos: item.descripcionCompromisosProximos || 'NO REPORTA',
          tipoEvento: item.evento || 'NO REPORTA',
          estadoSiniestro: /* item. || */ 'NO REPORTA',
          revisionMasiva: item.revisionMasiva == true ? 'si' : 'no',
          revisor: item.revisorFirstName ? `${item.revisorFirstName} ${item.revisorLastName}` : "NO REPORTA",
          fechaEnvioRevision: item.fechaEnvioRevision ? moment(item.fechaEnvioRevision).format('DD/MM/YYYY h:mm:ss a') : "NO REPORTA",
          fechaRevision: item.fechaRevision ? moment(item.fechaRevision).format(' h:mm:ss a') : "NO REPORTA",
          diasEnRevision: item.diasRevision || 0,
          fechaRechazoRevision: item.fechaAprobacion == null ? 'NO REPORTA' : moment(item.fechaAprobacion).format('DD/MM/YYYY h:mm:ss a'),
          motivoRechazoRevision: item.motivoRechazoRevision || 'NO REPORTA',
          aprobacionMasiva: item.aprobacionMasiva == true ? 'si' : 'no',
          aprobador: item.aprobadorFirstName ? `${item.aprobadorFirstName} ${item.aprobadorLastName}` : "NO REPORTA",
          fechaEnvioAprobacion: item.fechaEnvioAprobacion ? moment(item.fechaEnvioAprobacion).format('DD/MM/YYYY h:mm:ss a') : "NO REPORTA",
          fechaAprobacion: item.fechaAprobacion ? moment(item.fechaAprobacion).format('DD/MM/YYYY h:mm:ss a') : "NO REPORTA",
          diasEnAprobacion: item.diasAprobacion,
          fechaRechazoAprobacion: /* item. || */ 'NO REPORTA',
          motivoRechazoAprobacion: 'NO REPORTA',
          numeroRechazosAprobacion: item.numeroRechazosAprobacion || 0,
          formaEnvio: item.formaEnvio || 'NO REPORTA',
          estadoGuia: item.estadoGuia == null ? 'NO REPORTA' : item.estadoGuia,
          fechaRecibidoCorrespondencia: /* item. || */ 'NO REPORTA',
          numeroGuiaEnvio: item.numeroGuia == null ? 'NO REPORTA' : item.numeroGuia,
          correoDestinatario: item.correoDestinatario || 'NO REPORTA',
          idEnvioCorreoElectronicoCertificado: /* item. || */ 'NO REPORTA',
          eventoCorreoElectronicoCertificado: /* item. || */ 'NO REPORTA',
          cuentaEnviarCorreo: /* item. || */ 'NO REPORTA',
          accionDevolucion: /* item. || */ 'NO REPORTA',
          numeroGuiaEnvioDevolucion: /* item. || */ 'NO REPORTA',
          correoDestinatarioDevolucion: /* item. || */ 'NO REPORTA',
          numeroDevolucion: /* item. || */ 'NO REPORTA',
          publicado: /* item. || */ 'NO REPORTA',
          fechaPublicacion: /* item. || */ 'NO REPORTA',
          numeroActaDesfijacion: /* item. || */ 'NO REPORTA',
          fechaActaDesfijacion: /* item. || */ 'NO REPORTA',
          responsableRechazoAprobacion: 'NO REPORTA',
          responsableRechazoRevision: 'NO REPORTA',
          numeroRechazosRevision: item.numeroRechazosRevision || 0
        }
      }))
    }

    tableDataMl.value = tableData.value.reverse()
    mlData.value = tableData.value
    dataTableTotalRows.value = response.data.totalPages
    customMessageTableResults.value = response?.data?.paginationMessage;

    if (tableDataMl.value) {
      isLoading.value = false
    }

  } catch (error) {
    console.error(error)
  }
}

function formatFecha(fecha) {
  if (fecha) {
    const [day, month, year] = fecha.split('/');
    const fechaOrdenada = `${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')}`;

    const fechaObjeto = new Date(fechaOrdenada);

    return fechaObjeto.toISOString();
  } else {
    return ''
  }
}

function calcularDiasEntreFechas(fecha1: string, fecha2: string): number {
  const unDiaEnMilisegundos = 24 * 60 * 60 * 1000;

  const primeraFecha = new Date(fecha1);
  const segundaFecha = new Date(fecha2);

  const diferenciaEnMilisegundos = Math.abs(primeraFecha.getTime() - segundaFecha.getTime());
  const cantidadDias = Math.round(diferenciaEnMilisegundos / unDiaEnMilisegundos);

  return cantidadDias;
}

async function clickData() {
  isLoading.value = true
  filtro.value.tipoReporte ? showTable.value = true : showTable.value = false
  let fechaActual = new Date().toISOString();

  const [dayI, monthI, yearI] = filtro.value.fechaInicial.split('/');
  const [dayF, monthF, yearF] = filtro.value.fechaFinal.split('/');

  if (monthI === '01' || monthI === '03' || monthI === '05' || monthI === '07' || monthI === '08' || monthI === '10' || monthI === '12') {
    if (dayI > '31') {
      toast.error("Formato de fecha incorrecto")
      return;
    }
  } else if (monthI === '04' || monthI === '06' || monthI === '09' || monthI === '11') {
    if (dayI > '30') {
      toast.error("Formato de fecha incorrecto")
      return;
    }
  } else if (monthI === '02') {
    // Consider leap years (año bisiesto)
    const year = new Date().getFullYear();
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    if ((isLeapYear && dayI > '29') || (!isLeapYear && dayI > '28')) {
      toast.error("Formato de fecha incorrecto")
      return;
    } //
  }

  if (monthF === '01' || monthF === '03' || monthF === '05' || monthF === '07' || monthF === '08' || monthF === '10' || monthF === '12') {
    if (dayF > '31') {
      toast.error("Formato de fecha incorrecto")
      return;
    }
  } else if (monthF === '04' || monthF === '06' || monthF === '09' || monthF === '11') {
    if (dayI > '30') {
      toast.error("Formato de fecha incorrecto")
      return;
    }
  } else if (monthF === '02') {
    const year = new Date().getFullYear();
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    if ((isLeapYear && dayF > '29') || (!isLeapYear && dayI > '28')) {
      toast.error("Formato de fecha incorrecto")
      return;
    }
  } else if (monthI > '12' || monthF > '12') {
    toast.error("Formato de fecha incorrecto")
    return;
  }

  const fechaInicialISO = filtro.value.fechaInicial ? formatFecha(filtro.value.fechaInicial) : '';
  const fechaFinalISO = filtro.value.fechaFinal ? formatFecha(filtro.value.fechaFinal) : '';

  if ((fechaInicialISO && fechaInicialISO > fechaActual) || (fechaFinalISO && fechaFinalISO > fechaActual)) {
    toast.error("La fecha no puede ser superior a la actual")
    return;
  }

  if (filtro.value.tipoReporte == 'Reporte de entrada') {
    // ! Reporte Entrada
    tipoReporte.value = 1
    columns.value = REPORTES_HEADER
    await getData(0, 20)
  } else {
    // ! Reporte Salida
    tipoReporte.value = 2
    columns.value = REPORTES_HEADER_DOCSAL
    await getData(0, 20)
  }
}

async function clear() {
  filtro.value.tipoReporte = ''
  filtro.value.fechaInicial = ''
  filtro.value.fechaFinal = ''
  filtro.value.numeroRadicado = { label: '', value: '' }
  filtro.value.estado = ''
  filtro.value.siniestros = ''
  filtro.value.numeroIdentificación = { label: '', value: '' }
  filtro.value.prefijo = { label: '', value: '' }
  search.value = ''
  showTable.value = false
  tableDataMl.value = mlData.value
}

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

const handlePageChange = async (event) => {
  await getData(event.page - 1, event.rowsPerPage);
}

const handleRowsPerPageChange = async (event: any) => {
  await getData(event.page, event.rowsPerPage);
}

const selectRows = (data) => {
  selectedRows.value = data
}

const cancelarEnviarModal = () => {
  emailList.value = []
  correo.value = ''
  inputFormat.value = ''
  sendReportModal.value = false
}

function generalFilter(value) {
  if (!value) {
    tableDataMl.value = tableData.value;
    return;
  }

  tableDataMl.value = tableData.value.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(value.toLowerCase())
    )
  );
}

const interval = setInterval(() => {
  valueProgress.value += 10;
  if (valueProgress.value >= 100) {
    clearInterval(interval);
    isLoading.value = false;
  }
}, 200);

// --- Función auxiliar para descargar el archivo ---
// La ponemos afuera para no repetir el mismo código en el if y en el else.
const downloadFileFromBlob = (blob, extension, filename?) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename ? filename : `reporte-MedicinaLaboral.${extension}`; // Usamos la extensión que nos pasen
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};


const exportExcel = async (type) => {
  let radicados = [];
  if (selectedRows.value?.length > 0) {
    radicados = selectedRows.value.map(e => e.idRadicado);
  }

  // Definimos la extensión una sola vez
  const extension = type === 1 ? 'xlsx' : 'csv';

  try {
    let response;
    let filename;

    // --- Lógica condicional para llamar al servicio correcto ---
    if (infoFiltros.value.tipoReporte == 1) {
      // ✅ CASO 1: Petición POST
      response = await sgdeaAxios.post('/medicina/descargar-reportes', {
        // ... (todos tus filtros aquí)
        tipoReporte: infoFiltros.value.tipoReporte,
        fechaInicial: infoFiltros.value.fechaInicial,
        fechaFinal: infoFiltros.value.fechaFinal,
        numeroRadicado: infoFiltros.value.numeroRadicado,
        estado: infoFiltros.value.estado,
        siniestro: infoFiltros.value.siniestro,
        numeroIdentificacionAfectado: infoFiltros.value.numeroIdentificacionAfectado,
        prefijo: infoFiltros.value.prefijo,
        listaRadicados: radicados,
        formato: extension // Usamos la variable extensión
      }, {
        responseType: 'blob' // Correcto para la petición POST
      });

    } else {
      // ✅ CASO 2: Petición GET
      const formatDateForUrl = (isoDate) => {
        if (!isoDate) return '';
        const d = new Date(isoDate);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      };

      const BASE_URL = `/reportes/uat/reporte-combinado/${extension}?fechaDesde=${formatDateForUrl(infoFiltros.value.fechaInicial)}&fechaHasta=${formatDateForUrl(infoFiltros.value.fechaFinal)}`;

      response = await sgdeaAxios.get(BASE_URL, {
        responseType: 'blob' // Añadido aquí también, muy importante!
      });
    }


    const contentDisposition = response.headers['x-filename'];

if (contentDisposition) {
  filename = contentDisposition;
}

    // --- Lógica de descarga (común para ambos casos) ---
    if (response.status === 200) {
      // response.data ya es el blob, no hay que crearlo de nuevo
      downloadFileFromBlob(response.data, extension, filename);
      toast.success("Archivo descargado con éxito!");
    }

  } catch (error) {
    toast.error('Ha ocurrido un error al exportar los datos');
  }
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

const filterRadicados = async (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredRadicados.value = optionsRadicados.value
    })
    return
  }

  const response = await sgdeaAxios.get("/medicina/radicados", {
    params: { palabra: val, page: 0, size: 5 }
  })

  const listadoRad = response.data.content.map((e: any) => {
    return {
      label: e,
      value: e
    }
  })

  update(() => {
    filteredRadicados.value = listadoRad.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

function optionsDateFunc(date) {
  return date <= moment().format('YYYY/MM/DD')
}

const reportSuccess = async () => {
  if (!inputFormat.value) {
    toast.error("Para poder continuar con el proceso debe seleccionar un formato")
    return
  }

  if (emailList.value.length < 1) {
    toast.error("Debe ingresar un correo electrónico válido para continuar")
    return
  }

  loadingSendEnvios.value = true

  try {
    const response = await sgdeaAxios.post(`/medicina/enviar-reportes-por-correo?email=${emailList.value}`, {
      tipoReporte: infoFiltros.value.tipoReporte,
      fechaInicial: infoFiltros.value.fechaInicial,
      fechaFinal: infoFiltros.value.fechaFinal,
      numeroRadicado: infoFiltros.value.numeroRadicado,
      estado: infoFiltros.value.estado,
      siniestro: infoFiltros.value.siniestro,
      numeroIdentificacionAfectado: infoFiltros.value.numeroIdentificacionAfectado,
      prefijo: infoFiltros.value.prefijo,
      size: infoFiltros.value.size,
      page: infoFiltros.value.page,
      listaRadicados: [],
      formato: inputFormat.value
    })

    if (response.status === 200) {
      toast.success(`El reporte de Medicina Laboral ha sido enviado con éxito a los correos ingresados.`)
      sendReportModal.value = false
      loadingSendEnvios.value = false
    }

  } catch (error) {
    loadingSendEnvios.value = false
    toast.error('Ha ocurrido un error al exportar los datos')
  }
}

</script>

<style lang="scss">
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 510px;
  border-radius: 10px 50px 10px 30px;
  padding: 40px 60px 40px 60px;
  height: 550px;
  background-color: white;
}
</style>
