<template>
  <div class="q-my-md">
    <div class="tw-flex tw-justify-between tw-items-center">
      <span class="tw-font-bold tw-text-3xl tw-my-5"> Seguimiento Envíos - Mensajería y Courier </span>
    </div>
    <q-card class="tw-rounded-xl tw-p-4" flat bordered>
      <q-expansion-item default-opened>
        <div class="row q-col-gutter-md q-pb-md q-px-md">

          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Fecha Desde</span>
            <q-input :rules="[]" name="fechaDesde" outlined label="dd/mm/yyyy" v-model="filtro.fechaDesde" dense mask="##/##/####">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="filtro.fechaDesde" :options="opForInicial" mask="DD/MM/YYYY">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Fecha Hasta</span>
            <q-input :rules="[]" name="fechaHasta" outlined label="dd/mm/yyyy" v-model="filtro.fechaHasta" dense mask="##/##/####">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="filtro.fechaHasta" mask="DD/MM/YYYY" :options="fechaPermitida">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Punto de Radicación</span>
            <q-select :rules="[]" name="tipoDoc" outlined v-model="filtro.puntoRadicacionId" label="Seleccione" dense
              map-options emit-value :options="puntosRadicacionOp" @update:model-value="filterUsers" />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Usuario</span>
            <q-select :rules="[]" name="tipoDoc" outlined v-model="filtro.usuarioId" label="Seleccione" dense
              map-options emit-value :options="usuariosOptions" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Tipo de Envío</span>
            <q-select :rules="[]" name="tipoEnvio" outlined v-model="filtro.tipoEnvio" label="Seleccione" dense
              map-options emit-value
              :options="[ { value: 'Courier', label: 'Courier' }, { value: 'Mensajería', label: 'Mensajería' }]" />
          </div>
        </div>

        <div class="tw-flex tw-justify-center tw-items-center tw-my-5 tw-gap-6">
          <q-btn label="Limpiar" type="reset" style="width: 240px" text-color="black" color="accent"
            @click="cleanFilters" class="tw-rounded-xl tw-h-12" />

          <q-btn type="submit" label="Buscar" text-color="white" style="width: 240px" color="primary" @click="getData"
            class="tw-rounded-xl tw-h-12 tw-p-2" />
        </div>
      </q-expansion-item>
    </q-card>

    <q-card v-if="showDataBandeja" class="tw-rounded-xl q-mt-lg tw-p-5" flat bordered>
      <div class="flex items-center justify-between q-px-md q-mb-sm row col-12">
        <span class="text-weight-bold text-h6" style="color: #2c3948">Seguimiento de Envíos</span>

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
            <q-btn :disable="selectedRows?.length > 0 ? false : true"  color="orange-7" label="Seguimiento"
              style="width: 150px; height: 30px; border-radius: 8px" no-caps icon="send" @click="determineModal" />
          </div>
        </div>
      </div>
      <TableBandeja :buscar="buscar" class="full-width" key-id="id" :TABLE_TOTAL_ROWS="dataTableTotalRows"
        :TABLE_TOTAL_PAGES="dataTableTotalPages" :TABLE_HEADER="columns" :TABLE_BODY="filteredDataTable" select="single"
        @update:itemSelected="selectRows"
        msg-no-data="No se encontraron resultados con los filtros aplicados, valide y consulte nuevamente"
        @update:filas="getPageFilas" @update:pages="getPageFilas" @handlePageChange="handlePageChange"
        @handleRowsPerPageChange="handleRowsPerPageChange" @handleEditData="showModalDocs" />
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
                        <q-select :disable="emailList?.length < 3 ? false : true" :rules="[inputRequired]"
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

      <q-dialog v-model="showModalSeguimientoCourier" persistent>
        <q-card class="tw-w-[3000px]">
          <q-card-section class="tw-text-center tw-p-10">
            <h2 class="tw-text-bold tw-mb-10 tw-text-secondary tw-font-bold tw-text-lg">¿Desea hacer seguimiento manual
              al
              envío por Courier?</h2>
              <q-select
        v-model="seguimientoCourierSelection"
        :options="[
          { value: 'Devuelto', label: 'Devuelto' },
          { value: 'Entrega Exitosa', label: 'Entrega Exitosa' }
        ]"
        outlined
        dense
        emit-value
        map-options
        label="Seleccione"
        :rules="[inputRequired]"
      />
            <div class="tw-flex tw-justify-between tw-mt-5">
              <q-btn label="Cancelar" type="reset" style="width: 200px" text-color="white" color="secondary"
                @click="cancelarSeguimientoCourier" class="tw-rounded-xl tw-h-12" />
              <q-btn label="Aceptar" type="reset" style="width: 200px" text-color="white" color="primary"
                @click="determineModalCourier" class="tw-rounded-xl tw-h-12" :disable="!seguimientoCourierSelection" />
            </div>
          </q-card-section>


        </q-card>
      </q-dialog>

      <q-dialog full-width v-model="modalDocs">
        <q-card class="q-pa-xl tw-w-[3000px]">
          <a @click="modalDocs = false" class="tw-text-primary" style="text-decoration: none;">
            <q-icon size="1.5em" name="chevron_left" color="primary" />
            <b>
              Volver
            </b>
          </a>
          <Table :TABLE_BODY="listDocs" :TABLE_HEADER="fileColumns" icon="download" isSecondIcon isThirdIcon
            secondIcon="delete" thirdIcon="print" :loading="loading" is-selection="none" @handleEditData="download"
            @handleThirdIcon="print" :key-id="'id'" />
        </q-card>
      </q-dialog>


      <q-dialog v-model="showModalSeguimientoCourierDevuelto" persistent>
        <q-card class="tw-w-[3000px]">
          <q-card-section class="tw-p-10">
            <q-form ref="courierDevueltoForm" greedy>
              <h2 class="tw-text-bold tw-mb-2 tw-text-secondary tw-font-bold tw-text-lg">Devuelto</h2>
              <p class="tw-text-black">Seleccione la causal de devolución del envío</p>
              <q-select
          name="tipo"
          outlined
          v-model.value="showModalSeguimientoCourierDevueltoSelected"
          label="Seleccione"
          dense
          map-options
          emit-value
          :rules="[inputRequired]"
          :options="listadoDevoluciones"
        />
              <div class="tw-flex tw-justify-between tw-mt-5">
                <q-btn label="Cancelar" type="reset" style="width: 200px" text-color="white" color="secondary"
                  @click="cancelarSeguimientoCourierDevuelto" class="tw-rounded-xl tw-h-12" />
                <q-btn label="Aceptar" type="reset" style="width: 200px" text-color="white" color="primary"
                  @click="devueltoCourier" class="tw-rounded-xl tw-h-12" />
              </div>
            </q-form>
          </q-card-section>

        </q-card>
      </q-dialog>

      <q-dialog v-model="showModalSeguimientoCourierEntregado" persistent>
        <q-card class="tw-w-[3000px]">
          <q-card-section class="tw-p-10">
            <q-form ref="courierEntregadoForm">
              <h2 class="tw-text-bold tw-mb-2 tw-text-secondary tw-font-bold tw-text-lg">Entrega exitosa</h2>
              <p class="tw-text-black">Adjuntar archivos</p>
              <FileLoader v-model="showModalSeguimientoCourierEntregadoFiles" class="tw-w-full" :multiple="false" accept-file="pdf" :max-file-size="30 * 1024 * 1024" :max-files="1"
                max-file-size-label="30" @rejected="rejectedFiles" />
              <h3>Recuerda cargar el documento de soporte de entrega</h3>
              <div class="tw-flex tw-justify-between tw-mt-5">
                <q-btn label="Cancelar" type="reset" style="width: 200px" text-color="white" color="secondary"
                  @click="cancelarModalCon" class="tw-rounded-xl tw-h-12" />
                <q-btn label="Aceptar" type="reset" style="width: 200px" text-color="white" color="primary"
                  @click="entregadoCourier" class="tw-rounded-xl tw-h-12" />
              </div>
            </q-form>
          </q-card-section>

        </q-card>
      </q-dialog>

      <q-dialog full-width persistent v-model="showModalSeguimientoMensajeria">
        <q-card class="tw-w-[3000px]">
          <q-card-section class=" tw-p-10">
            <q-form greedy ref="mensajeriaSeguimientoForm">
              <h2 class="tw-text-center tw-text-bold tw-mb-10 tw-text-secondary tw-font-bold tw-text-lg">
                Adjuntar soportes
              </h2>
              <label class=" tw-mt-2 tw-text-label">Fecha Recibido/Devuelto *
                <DatePickerComponent mask="DD/MM/YYYY" label="dd / mm / aaaa" :options="optionsDateFunc"
                  v-model:input-data-prop="filtro.fechaHasta" @valida-fecha="emitValidation" :rules="[inputRequired]"
                  :error-message="'Debe seleccionar una fecha válida'" />
              </label>
              <label class=" tw-mt-2 tw-text-label">Estado recibido *
                <q-select :rules="[inputRequired]" name="tipo" outlined v-model="mensajeriaSeguimiento.estadoRecibido"
                  label="Seleccione" dense map-options emit-value
                  :options="[{ value: 'Devuelto', label: 'Devuelto' }, { value: 'Entrega Exitosa', label: 'Entrega Exitosa' }]" />
              </label>
              <label class=" tw-mt-2 tw-text-label">Causal de devolución *
                <q-select name="tipo" outlined v-model="mensajeriaSeguimiento.causal" label="Seleccione" dense
                  map-options emit-value :rules="[inputRequired]" :options="listadoDevolucionesMensajeria" />
              </label>
              <label class=" tw-mt-2 tw-text-label">Observación *
                <q-input type="textarea" outlined label="Observación" dense emit-value
                  v-model="mensajeriaSeguimiento.observacion"
                  :rules="[inputRequired, v => maxLengthInput(1000, v), v => minLengthInput(10, v)]" />
              </label>

              <p class="tw-text-black">Adjuntar archivos</p>
              <FileLoader v-model="mensajeriaSeguimiento.archivos" class="tw-w-full" :multiple="true"
                :rules="[]" accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
                :max-file-size="50 * 1024 * 1024" :max-files="30" max-file-size-label="50" @rejected="rejectedFilesTwo" />
              <div class="tw-flex tw-justify-center tw-gap-5 tw-mt-5">
                <q-btn label="Cancelar"  style="width: 200px" text-color="white" color="secondary"
                  @click="cancelarSeguimientoMensajeria" class="tw-rounded-xl tw-h-12" />
                <q-btn label="Aceptar" style="width: 200px" text-color="white" color="primary"
                  @click="determinarSeguimientoMensajeria" class="tw-rounded-xl tw-h-12" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>


    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { exportFile } from "quasar";
import Modal from "src/components/Modal/Modal.vue";
import mail from "src/assets/mail.svg";
import TableBandeja from "./Table.vue";
import { inputRequired, maxLengthInput, minLengthInput } from 'src/helpers/validations';
import { fourthFormatDate, reverseFormatDate } from "src/helpers/formtDate";
import excel from "src/assets/excel.svg";
import csv from "src/assets/csv.svg";
import LoadingModal from "src/components/Modal/LoadingModal.vue";
import Table from "./AdjuntarDocumentosTable.vue";
import { sgdeaAxios } from "src/services";
import FileLoader from 'src/components/FormFields/FileLoader.vue';
import moment from "moment";
import * as XLSX from 'xlsx';
import { toast } from "src/helpers/toast";
import { useAuthStore } from "src/stores/auth.store";
import DatePickerComponent from "src/components/FormFields/datePickerComponent.vue";
const auth = useAuthStore();
const { getUserInfo } = useAuthStore();


const userInfo = ref()
const confirmCancelarModalEnvioCorreo = ref(false)
const rows = ref([]);

const modalDocs = ref(false)
const listDocs = ref();
const showDataBandeja = ref(false)
const currPage = ref(0)
const pageSize = ref(20) //FIXME:
const usuariosOptions = ref([])
const originalUsers = ref([])
const dataTableTotalRows = ref()
const dataTableTotalPages = ref()
const search = ref()
const listadoDevoluciones = ref([])
const listadoDevolucionesMensajeria = ref([])
const selectedRows = ref([])
const inputFormat = ref('')
const correo = ref()
const emailList = ref([])
const emailForm = ref()
const selectModal = ref()
const correosPositiva = ref([])
const optionsCorreos = ref([])
const puntosRadicacionOp = ref()
const listadoEstadoEnviosOp = ref()
const loading = ref(false)

const showModalSeguimientoCourier = ref(false)
const showModalSeguimientoCourierDevuelto = ref(false)
const seguimientoCourierSelection = ref()
const showModalSeguimientoCourierDevueltoSelected = ref(null)
const showModalSeguimientoCourierEntregado = ref(false)
const showModalSeguimientoCourierEntregadoFiles = ref(null)
const mensajeriaSeguimientoForm = ref(null)

const showModalSeguimientoMensajeria = ref(false)
const mensajeriaSeguimiento = ref({
  estadoRecibido:'',
  fechaSeguimiento: '',
  causal: '',
  observacion: '',
  archivos: ''
})

const courierDevueltoForm = ref()
const courierEntregadoForm = ref()


const validate = ref({
  fecha: false,
  hora: false,
});

const cancelarSeguimientoMensajeria = () => {
  currPage.value = 0;
  search.value = '';
  selectedRows.value.length = 0;
  showModalSeguimientoMensajeria.value = false;

  // Limpiar todos los campos del objeto mensajeriaSeguimiento
  mensajeriaSeguimiento.value = {
    estadoRecibido: null,
    fechaSeguimiento: null,
    causal: null,
    observacion: null,
    archivos: null
  };

  // Si estás usando v-model para los campos de fecha, también deberías limpiar filtro.fechaHasta
  filtro.value.fechaHasta = '';
};

const REPORTES_HEADER = [
  {
    name: "numeroRadicadoSalida",
    label: "Número de Radicado de Salida",
    field: "radicadoSalida",
    sortable: true,
    align: 'center'
  },
  {
    name: "destinatario",
    label: "Destinatario",
    field: 'destinatario',
    sortable: true,
    align: 'center'
  },
  {
    name: "fechaRadicadoSalida",
    label: "Fecha de Radicado de Salida",
    field: (row) => fourthFormatDate(row.fechaRadicadoSalida),
    sortable: true,
    align: 'center'
  },
  {
    name: "oficina",
    label: "Oficina",
    field: (row) => row.puntoRadicacion?.oficinaId.dependencia.nombre ?? '-',
    sortable: true,
    align: 'center'
  },
  {
    name: "usuario",
    label: "Usuario",
    field: (row) => row.usuario.firstname + " " + row.usuario.lastname,
    sortable: true,
    align: 'center'
  },
  {
    name: "tipoEnvio",
    label: "Tipo de Envió",
    field: 'tipoEnvio',
    sortable: true,
    align: 'center'
  },
  {
    name: "estado",
    label: "Estado",
    field: (row) => row.estadoEnvios?.nombre,
    sortable: true,
    align: 'center'
  },
  {
    name: "puntosRadicacion",
    label: "Puntos de Radicación",
    field: (row) => row.puntoRadicacion?.nombrePunto,
    sortable: true,
    align: 'center'
  },
  {
    name: "acciones",
    label: "Acciones",
    field: 'acciones',
    sortable: true,
    align: 'center'
  },
  {
    name: "trazabilidad",
    label: "Trazabilidad",
    field: 'trazabilidad',
    sortable: true,
    align: 'center'
  },

];



const rejectedFiles = (error) => {
  if (error.some((it) => it.failedPropValidation === 'max-file-size')) {
    toast.error('El peso permitido es hasta 30MB.')
  }
  if (error.some((it) => it.failedPropValidation === 'max-files')) {
    toast.error('Solo se pueden adjuntar 1 archivo.')
  }
  if (error.some((it) => it.failedPropValidation === 'accept')) {
    toast.error('Formato inválido, el formato permitido es (pdf).')
  }
}

const fechaPermitida = (date: string) => {
  const hoy = new Date()
  const seleccionada = new Date(
    Number(date.slice(0, 4)),
    Number(date.slice(5, 7)) - 1,
    Number(date.slice(8, 10))
  )
  return seleccionada <= hoy
}

const rejectedFilesTwo = (error) => {
  if (error.some((it) => it.failedPropValidation === 'max-file-size')) {
    toast.error('El peso permitido es hasta 50MB.')
  }
  if (error.some((it) => it.failedPropValidation === 'max-files')) {
    toast.error('Solo se pueden adjuntar 30 archivos.')
  }
  if (error.some((it) => it.failedPropValidation === 'accept')) {
    toast.error('Formato inválido, los formatos permitidos son (pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg).')
  }
}

const showModalDocs = async (nodeid) => {
  const response = await sgdeaAxios.get<any>(
    `/api/v1/integracion/alfresco/general/1/${nodeid}/archivos`
  );

  if (response.status === 200) {
    const { data } = response;

    listDocs.value = data?.map((it) => ({
      flujo: it.flujo,
      nombre: it.nombreArchvio,
      id: it.id,
      identificador: it.identificador,
      nodeId: it.nodeidFile,
      fecha: moment(it.fechaCreacion).format("DD/MM/YYYY")
    }));
  }
  //Funcion buscar documentos con nodeid
  modalDocs.value = true
}

const columns = ref(REPORTES_HEADER)

async function devueltoCourier() {
  if (await courierDevueltoForm.value.validate()) {
    const response = await sgdeaAxios.post(`/envios/${selectedRows.value[0].id}/courier/devolucion/${showModalSeguimientoCourierDevueltoSelected.value}`)
    if (response.status == 200) {
      showModalSeguimientoCourier.value = false
      showModalSeguimientoCourierDevuelto.value = false
      toast.success('Su caso ha sido devuelto exitosamente')

      await getData()

      // Determinar el prefijo basado en flujoSgd.id
      let prefijo;
      let tramite;
      switch (response.data?.flujoSgda.id) {
        case 1:
        case 2:
        case 3:
        case 4:
          prefijo = 'COR';
          tramite = 'Informativos';
          break;
        case 5:
          prefijo = 'PQRD';
          tramite = 'PQRD';
          break;
        case 6:
          prefijo = 'TUT';
          tramite = 'Tutelas';
          break;
        case 7:
          prefijo = 'ENTC';
          tramite = 'Entes de Control';
          break;
        case 8:
          prefijo = 'ML';
          tramite = 'Medicina laboral';
          break;
        default:
          prefijo = 'UNKNOWN';
          tramite = 'Desconocido';
      }
const caso = await sgdeaAxios.get(`envios/obtenerCaso/${response.data?.id}`)
      const dataTrazabilidad = {
      proceso: `${prefijo}${caso.data.idCaso}`,
      secuencia: response.data?.radicadoSalida,
      estado: response.data?.estadoEnvios?.nombre,
      descripcion: `Usuario: ${auth.userInfo.name} Motivo:${response.data.tipoDevolucion.valor}`,
      comentario: 'Devuelto',
      nombre: auth.$state.userInfo.name,
      accion: `${auth.$state.userInfo.name} ha devuelto el envío ${response.data?.radicadoSalida}`,
      tramite: tramite,
    }
    await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad)
    }
  } else {
    toast.error('Debe diligenciar los campos obligatorios para continuar con el proceso')
  }
}

const cancelarSeguimientoCourierDevuelto = () => {
  showModalSeguimientoCourierDevuelto.value = false;
  showModalSeguimientoCourierDevueltoSelected.value = null;
};

const cancelarModalCon = () => {
  showModalSeguimientoCourierEntregado.value = false;
  showModalSeguimientoCourierDevueltoSelected.value = null;
}

async function entregadoCourier() {
  const formData = new FormData();

  formData.append("file", showModalSeguimientoCourierEntregadoFiles.value);

  if (await courierEntregadoForm.value.validate()) {
    const response = await sgdeaAxios.post(`/envios/${selectedRows.value[0].id}/courier/entrega_exitosa?user=${auth.$state.userInfo.userid}`, formData);

      let prefijo;
      let tramite;
      switch (response.data?.flujoSgda.id) {
        case 1:
        case 2:
        case 3:
        case 4:
          prefijo = 'COR';
          tramite = 'Informativos';
          break;
        case 5:
          prefijo = 'PQRD';
          tramite = 'PQRD';
          break;
        case 6:
          prefijo = 'TUT';
          tramite = 'Tutelas';
          break;
        case 7:
          prefijo = 'ENTC';
          tramite = 'Entes de Control';
          break;
        case 8:
          prefijo = 'ML';
          tramite = 'Medicina laboral';
          break;
        default:
          prefijo = 'UNKNOWN';
          tramite = 'Desconocido';
      }

      const caso = await sgdeaAxios.get(`envios/obtenerCaso/${response.data?.id}`)

    if (response.status === 200 || response.status === 201) {
      showModalSeguimientoCourier.value = false;
      showModalSeguimientoCourierEntregado.value = false;

      const dataTrazabilidad = {
        proceso: `${prefijo}${caso.data.idCaso}`,
        secuencia: response.data?.radicadoSalida,
        estado: response.data?.estadoEnvios?.nombre,
        descripcion: `El radicado ${response.data?.radicadoSalida} ha sido entregado exitosamente`,
        comentario: 'Entrega exitosa',
        nombre: auth.$state.userInfo.name,
        accion: `El radicado ${response.data?.radicadoSalida} ha sido entregado exitosamente`,
        tramite: tramite,
      }

      await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad)

      toast.success('Guardado exitoso');
      await getData();
    }
  } else {
    if (!showModalSeguimientoCourierEntregadoFiles.value || showModalSeguimientoCourierEntregadoFiles?.value?.length === 0) {
      toast.error('Recuerda cargar el documento de soporte de entrega');
      return;
    }
  }
}

async function determinarSeguimientoMensajeria() {
  // Primero, valida el formulario
  const isValid = await mensajeriaSeguimientoForm.value.validate();

  if (isValid) {
    if (mensajeriaSeguimiento.value.estadoRecibido == "Devuelto") {
      const response = await sgdeaAxios.post(`/envios/${selectedRows.value[0].id}/courier/devolucion/${mensajeriaSeguimiento.value.causal}`);
      if (response.status == 200 || response.status == 201) {
        showModalSeguimientoMensajeria.value = false;
        toast.success('Estado actualizado');
        await getData();
      }
    } else {
      const response = await sgdeaAxios.post(`/envios/${selectedRows.value[0].id}/courier/entrega_exitosa`);
      if (response.status == 200 || response.status == 201) {
        showModalSeguimientoMensajeria.value = false;
        toast.success('El caso se finalizó con éxito');
        await getData();
      }
    }
  } else {
    // Si la validación falla, no hagas nada. Los campos inválidos se marcarán automáticamente.
    toast.error('Por favor, complete todos los campos obligatorios');
  }
}


const filtro = ref<IFiltros>({
  fechaDesde: "",
  fechaHasta: "",
  puntoRadicacionId: "",
  usuarioId: "",
  radicadoSalida: "",
  tipoEnvio: "",
  estadoEnviosId: "",
});

const selectRows = (data) => {
  selectedRows.value = data
}

const facData = ref([]);

const cleanFilters = () => {
  for (let key in filtro.value) {
    filtro.value[key] = "";
  }
  setTimeout(() => {
    filtro.value.fechaActual = ""
  }, 200);

  currPage.value = 0
  search.value = ''
  filteredDataTable.value = []
  selectedRows.value.length = 0
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
onMounted(async () => {
  userInfo.value = await getUserInfo();
  getFilterData()
  //getData();
  getTipoDevoluciones();
  filtro.value.puntoRadicacionId = userInfo.value.puntoRadicacion
  filtro.value.usuarioId = useAuthStore().$state.userInfo.userid
});

const cancelarEnviarModal = () => {
  emailList.value = []
  correo.value = ''
  inputFormat.value = ''
  sendReportModal.value = false
}

async function getFilterData() {
  try {

    const listadoEstadoEnvios = await sgdeaAxios.get('/envios/listadoEstadoEnvios')

    listadoEstadoEnviosOp.value = listadoEstadoEnvios.data.map((item) => ({
      label: item.nombre,
      value: item.id
    }))

    const listadoPuntosRadicacion = await sgdeaAxios.get('/correspondencia/puntoRadicacion/listadoActive')

    puntosRadicacionOp.value = listadoPuntosRadicacion.data.map((item) => ({
      label: item.nombrePunto,
      value: item.id
    })).sort((a,b) => a.label.localeCompare(b.label))
    puntosRadicacionOp.value.unshift({label: "Todos", value: 0})

    const listadoUsuarios = await sgdeaAxios.get('/usuarios/all')
    originalUsers.value = listadoUsuarios.data
    usuariosOptions.value = listadoUsuarios.data
      .filter(user => user.usuarioRelaciones.some(rel =>
        rel.rol.id === 10 && rel.puntoRadicacion?.id === userInfo.value?.puntoRadicacion) ||
        user.id === userInfo.value.userid)
      .map(user => ({
        label: `${user.firstname} ${user.lastname}`,
        value: user.id
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    filtro.value.fechaHasta = moment().format('DD/MM/YYYY')
  } catch (error) {
    console.error(error)
  }
}

const filterUsers = async () => {
  const { puntoRadicacionId } = filtro.value;
  const { userid } = userInfo.value;

  if (filtro.value.usuarioId !== userid) {
    filtro.value.usuarioId = ''
  }

  usuariosOptions.value = originalUsers.value
    .filter(user =>
      user.usuarioRelaciones.some(rel =>
        rel.rol.id === 10 && (puntoRadicacionId === 0 || rel.puntoRadicacion?.id === puntoRadicacionId)) ||
      user.id === userid
    )
    .map(user => ({
      label: `${user.firstname} ${user.lastname}`,
      value: user.id
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

const fileColumns = [
  {
    name: "formato",
    label: "Formato",
    field: "formato",
    sortable: false,
    align: "center",
  },
  {
    name: "nombre",
    label: "Nombre del documento",
    field: "nombre",
    sortable: true,
    align: "center",
  },
  // {
  //   name: "cargado_por",
  //   label: "Cargado por",
  //   field: "cargado_por",
  //   sortable: true,
  //   align: "center",
  // },
  {
    name: "fecha",
    label: "Fecha de cargue",
    field: "fecha",
    sortable: true,
    align: "center",
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    sortable: true,
    align: "center",
  },
];



async function getData() {
  let params = [];

  // Define the mapping between filtro.value properties and URL parameters
  const paramMapping = {
    fechaDesde: 'fechaDesde',
    fechaHasta: 'fechaHasta',
    puntoRadicacionId: 'puntoRadicacionId',
    usuarioId: 'usuarioId',
    radicadoSalida: 'radicadoSalida',
    tipoEnvio: 'tipoEnvio',
  };

  // Loop over the mapping and generate parameters
  Object.keys(paramMapping).forEach(key => {
    if (filtro.value[key]?.value) {
      params.push(`${paramMapping[key]}=${filtro.value[key].label}`);
    } else if (filtro.value[key]) {
      if (key == "fechaDesde" || key == "fechaHasta") {
        params.push(`${paramMapping[key]}=${reverseFormatDate(filtro.value[key])}${key == "fechaFinal" ? "T23:59:59" : "T00:00:00"}`);
      } else {
        const dataFil = typeof filtro.value[key] == "string" ? quitarTildes(filtro.value[key]) : filtro.value[key]
        params.push(`${paramMapping[key]}=${dataFil}`);
      }

    }
  });

  params.push('bandeja=False');
  let url = `/envios/obtenerGestionEnviosListado?size=${pageSize.value}&page=${currPage.value}`;


  if (params?.length) {
    url += `&${params.join('&')}`;
  }

  const response = await sgdeaAxios.get(url);

  if(response.data.content?.length === 0) {
    return toast.warning("No se encontraron resultados con los filtros aplicados, valide y consulte nuevamente");
  }

  showDataBandeja.value = true;
  facData.value = response.data.elementos || response.data.content;
  dataTableTotalRows.value = response.data.totalElements
  dataTableTotalPages.value = response.data.totalPages
  var filter = facData.value.sort((a, b) => new Date(a.fechaRadicacion) - new Date(b.fechaRadicacion))
//var filter = facData.value.filter((item) => [6, 7].includes(item.estadoEnvios.id)).sort((a, b) => new Date(a.fechaRadicacion) - new Date(b.fechaRadicacion))
  filteredDataTable.value = filter
  selectedRows.value.length = 0
}

const quitarTildes = (texto) => {
  if (texto === 'Mensajería') {
    return texto;
  }
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const filasGrilla = ref()
const numPageGrilla = ref()

const getPageFilas = async (filas = 20, page = 0) => {
  filasGrilla.value = filas
  numPageGrilla.value = page
  let params = [];

  // Define the mapping between filtro.value properties and URL parameters
  const paramMapping = {
    fechaDesde: 'fechaDesde',
    fechaHasta: 'fechaHasta',
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

  if (params?.length) {
    url += `&${params.join('&')}`;
  }

  const response = await sgdeaAxios.get(url);

  facData.value = response.data.elementos || response.data.content;
  dataTableTotalRows.value = response.data.totalElements
  dataTableTotalPages.value = response.data.totalPages
  var filter = facData.value.sort((a, b) => new Date(a.fechaRadicacion) - new Date(b.fechaRadicacion))
  filteredDataTable.value = filter
}

const opForInicial = (date) => {
  if (filtro.value.fechaHasta != '') {
    const final = moment(filtro.value.fechaHasta, 'DD/MM/YYYY').format('YYYY/MM/DD')

    return date <= final && date <= moment().format('YYYY/MM/DD')
  } else {
    return date <= moment().format('YYYY/MM/DD')
  }
}

watch(
  () => filtro.value.fechaHasta,
  async (value) => {
    if (filtro.value.fechaDesde == '' && filtro.value.fechaHasta != '') {
      const fechaMoment = moment(value, "DD/MM/YYYY");
      const fechaAnteriorMoment = fechaMoment.subtract(1, 'months');
      const fechaAnterior = fechaAnteriorMoment.format("DD/MM/YYYY");
      filtro.value.fechaDesde = fechaAnterior
    }
  }
);

watch(
  () => mensajeriaSeguimiento.value.estadoRecibido,
  async (value) => {
    if (value == 'Devuelto') {
      listadoDevolucionesMensajeria.value = listadoDevoluciones.value.filter((item) => [4, 5, 13, 14].includes(item.value))
    } else if (value == 'Entrega Exitosa') {
      listadoDevolucionesMensajeria.value = [{ label: 'EFECTIVA', value: 'EFECTIVA' }]
    }

    // Resetear el valor de causal cuando cambia el estado recibido
    mensajeriaSeguimiento.value.causal = null
  }
);

const handlePageChange = async (page: number) => {
  currPage.value = page <= 0 ? 0 : page - 1;
  await getData();
}

const handleRowsPerPageChange = async (rowsPerPage: any) => {
  pageSize.value = rowsPerPage;
  await getData();
}

const filteredDataTable = ref([
])

const exportXLSX = () => {
  var dataFinal = selectedRows.value?.length > 0 ? selectedRows.value : facData.value
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
    XLSX.writeFile(wb, `Listado Envios`);
    toast.success('Archivo descargado con éxito!');
  } catch (error) {
    toast.error("El navegador rechazó la descarga del archivo...");
  }
};


function determineModal() {
  if (selectedRows.value[0].tipoEnvio == 'Mensajeria'||selectedRows.value[0].tipoEnvio == 'Mensajería') {
    showModalSeguimientoMensajeria.value = true
  } else {
    showModalSeguimientoCourier.value = true
  }
}


async function getTipoDevoluciones() {
  const response = await sgdeaAxios.get('/envios/tipo_devoluciones')

  // Lista de IDs que quieres excluir
  const idsToExclude = [14]; // Puedes añadir más IDs aquí si necesitas excluir más elementos

  listadoDevoluciones.value = response.data
    .filter(item => !idsToExclude.includes(item.id)) // Filtra los elementos que no quieres mostrar
    .map((item) => {
      return { label: item.valor, value: item.id }
    }).sort((a,b) => a.label.localeCompare(b.label));

  listadoDevolucionesMensajeria.value = listadoDevoluciones.value.filter((item) => [4, 5, 13].includes(item.value))
}

function determineModalCourier() {
  if (seguimientoCourierSelection.value == "Devuelto") {
    showModalSeguimientoCourierDevuelto.value = true
  } else {
    showModalSeguimientoCourierEntregado.value = true
  }
}

const cancelarSeguimientoCourier = () => {
  showModalSeguimientoCourier.value = false;
  seguimientoCourierSelection.value = null; // Esto limpia la selección
};



function csvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

const exportCSV = () => {
  var dataFinal = selectedRows.value?.length > 0 ? selectedRows.value : facData.value
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

  const status = exportFile(`Listado Envios.csv`, content, "text/csv");

  if (status !== true) {
    toast.error("El navegador rechazó la descarga del archivo...");
  } else {
    toast.success("Archivo descargado con éxito!");
  }
};

const filterFnCorreos = (val, update, abort) => {
  if (val?.length < 1) {
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


const reportSuccess = async () => {

  if (await selectModal.value.validate()) {
    if (emailList?.value?.length > 0) {
      if (inputFormat.value == 'xlsx') {
        //EXCEL
        var dataFinal = selectedRows.value?.length > 0 ? selectedRows.value : facData.value;
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
          let data = new Uint8Array(binaryData?.length);
          for (let i = 0; i != binaryData?.length; ++i) {
            data[i] = binaryData.charCodeAt(i) & 0xFF;
          }
          let blob = new Blob([data], { type: "application/octet-stream" });
          let file = new File([blob], `Listado Envios.xlsx`);
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
            toast.success(`El reporte de Envios ha sido enviado con éxito a los correos  ingresados.`)
            sendReportModal.value = false
          }

        } catch (error) {
          toast.error("Hubo un error al generar el archivo...");
        }
      } else {
        ////CSV
        var dataFinal = selectedRows.value?.length > 0 ? selectedRows.value : facData.value;
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
          let file = new File([blob], `Listado Envios.csv`);
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
            toast.success(`El reporte de Envios ha sido enviado con éxito a los correos  ingresados.`)
            sendReportModal.value = false
          }

        } catch (error) {
          toast.error("Hubo un error al generar el archivo...");
        }
      }

    } else {
      toast.error("Debe ingresar un correo electrónico válido para continuar")
    }
  } else {
    toast.error("Para poder continuar con el proceso debe seleccionar un formato")
  }

};

function optionsDateFunc(date) {
  return date <= moment().format('YYYY/MM/DD')
}

const emitValidation = ({ type, data }) => {
  validate.value[type] = data
}

</script>
