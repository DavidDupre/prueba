<template>
  <div
    class="tw-flex tw-justify-center tw-items-center tw-flex-col tw-mt-4 tw-px-6 tw-bg-[#f8f8f8]"
  >
    <div
      class="tw-w-full tw-flex tw-flex-row tw-items-center tw-justify-between"
    >
      <p class="pl-4 tw-font-bold tw-text-3xl tw-mt-5 tw-mb-3 text-bold">
        Reporte PQRD
      </p>
      <div class="tw-flex tw-justify-between tw-gap-4">
        <q-btn
          text-color="primary"
          class="tw-text-lg tw-border tw-border-[#fd9c4a]"
          outline
          @click="showPqrds"
          >PQRD</q-btn
        >
        <q-btn
          color="primary"
          class="tw-text-lg tw-border tw-border-[#fd9c4a]"
          @click="showSuperIntendencia"
          >Superintendencia</q-btn
        >
      </div>
    </div>

    <!-- Inicio -->
    <div v-if="showInicio" class="tw-flex tw-gap-x-4 tw-mt-4 tw-mb-4">
      <div class="card tw-gap-y-4">
        <img v-lazy :data-url="Estado" alt="pqrd" />
        <p
          class="tw-text-md tw-mb-3 tw-text-gray-dark tw-leading-4 tw-text-center"
        >
          Si desea descargar algún reporte por favor selecciones alguna de las
          opciones que se encuentran en esta ventana
        </p>
        <div class="tw-w-[92%] tw-flex tw-justify-between">
          <q-btn
            text-color="primary"
            class="tw-text-lg tw-w-[28%] tw-h-[40px] tw-border tw-border-[#fd9c4a]"
            outline
            @click="showPqrds"
            >PQRD</q-btn
          >
          <q-btn
            color="primary"
            class="tw-text-lg tw-border tw-border-[#fd9c4a]"
            @click="showSuperIntendencia"
            >Superintendencia</q-btn
          >
        </div>
      </div>
    </div>

    <!-- PQRDS -->
    <div
      v-if="pqrds"
      class="tw-w-[95%] tw-bg-white tw-rounded-md tw-p-10 tw-flex tw-flex-col tw-gap-x-4 tw-mt-12 tw-mb-4 tw-justify-center"
    >
      <q-card class="tw-rounded-xl tw-p-4" flat bordered>
        <div class="tw-gap-y-4 tw-w-full tw-flex tw-justify-center">
          <div class="tw-flex tw-justify-evenly tw-gap-4">
            <q-btn
              text-color="primary"
              class="tw-text-lg tw-px-4 tw-border tw-border-[#fd9c4a]"
              outline
              @click="showPqrds"
              >Sabana de reportes PQRD</q-btn
            >
            <q-btn
              color="primary"
              class="tw-text-lg tw-border tw-border-[#fd9c4a]"
              @click="showPqrdRechazado"
              >Reporte rechazo PQRD</q-btn
            >
          </div>
        </div>

        <div
          class="tw-w-[90%] tw-h-[1px] tw-mb-5 tw-bg-slate-400 tw-border tw-mt-5 tw-mx-auto"
        ></div>

        <div class="tw-gap-y-4 tw-w-full tw-flex tw-flex-col tw-justify-center">
          <div class="tw-flex">
            <div class="tw-w-full tw-mr-4">
              <p class="tw-text-label">Fecha inicial</p>
              <DatepickerWithValidation
                label="dd/mm/yyyy"
                mask="DD/MM/YYYY"
                v-model:input-data-prop="filter.startDate"
                :no-future-dates="true"
                :reference-date-limit="filter.endDate"
                :minimum-months="3"
                :minimum-year="2024"
                :minimum-month="1"
                @validaFecha="(val) => onValidateDate('start', val)"
              />
              <p v-if="errors.startDate" class="tw-text-error">{{ errors.startDate }}</p>
            </div>

            <div class="tw-w-full">
              <p class="tw-text-label">Fecha final</p>
              <DatepickerWithValidation
                label="dd/mm/yyyy"
                mask="DD/MM/YYYY"
                v-model:input-data-prop="filter.endDate"
                :no-future-dates="true"
                :minimum-year="2024"
                :minimum-month="1"
                @validaFecha="(val) => onValidateDate('end', val)"
              />
              <p v-if="errors.endDate" class="tw-text-error">{{ errors.endDate }}</p>
            </div>
          </div>
          <div class="tw-flex tw-justify-center">
            <q-btn
              text-color="black"
              class="tw-text-lg tw-border"
              outline
              @click="clear"
              >Limpiar filtros</q-btn
            >
            <q-btn
              color="primary"
              class="tw-text-lg tw-ml-4 tw-border tw-border-[#fd9c4a]"
              @click="getData()"
              >Buscar</q-btn
            >
          </div>
        </div>
      </q-card>
    </div>

    <!-- ! -->
    <div
      v-if="pqrds"
      class="tw-w-[95%] tw-bg-white tw-rounded-md tw-p-10 tw-flex tw-flex-col tw-gap-x-4 tw-mb-4 tw-justify-center"
    >
      <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat bordered>
        <div
          class="flex items-center justify-between q-px-md q-mb-sm row col-12"
        >
          <span class="text-weight-bold text-h6" style="color: #2c3948"
            >Listado de PQRD</span
          >

          <div class="tw-flex tw-items-center tw-gap-10">
            <q-input
              v-model="search"
              placeholder="Buscar"
              @update:model-value="generalFilter"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>

            <div class="tw-flex tw-items-center tw-gap-2.5">
              <q-btn-dropdown
                color="accent"
                textColor="secondary"
                label="Exportar"
                style="width: 116px; height: 30px; border-radius: 8px"
                no-caps
                dropdown-icon="expand_more"
              >
                <q-list separator dense>
                  <q-item clickable v-close-popup @click="downloadPqrdExcelReport(filter.startDate, filter.endDate, 'csv')">
                    <q-item-section avatar>
                      <q-avatar square>
                        <q-img v-lazy :data-url="csv" alt="csv" width="24px" height="24px" />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section>Exportar CSV</q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="downloadPqrdExcelReport(filter.startDate, filter.endDate, 'xlsx')">
                    <q-item-section avatar>
                      <q-avatar square>
                        <q-img v-lazy
                          :data-url="excel"
                          alt="excel"
                          width="24px"
                          height="24px"
                        />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section>Exportar XLSX</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>

              <q-btn
                color="orange-7"
                label="Enviar correo"
                style="width: 150px; height: 30px; border-radius: 8px"
                no-caps
                icon="send"
                @click="sendEmail"
              />
            </div>
          </div>
        </div>
        <TablePqrd
          :buscar="buscar"
          class="full-width"
          :pagination-message="customMessageTableResults"
          key-id="id"
          :TABLE_TOTAL_ROWS="dataTableTotalRows"
          :TABLE_HEADER="columns"
          :TABLE_BODY="tableDataPqrds"
          select="multiple"
          v-model:item-selected="selection"
          @update:itemSelected="selectRows"
          @handlePageChange="handlePageChange"
          :isLoading="loading"
          @handleRowsPerPageChange="handleRowsPerPageChange"
        />
      </q-card>
    </div>
    <!-- ! -->

    <div
      v-if="pqrdRe"
      class="tw-w-[95%] tw-bg-white tw-rounded-md tw-p-10 tw-flex tw-flex-col tw-gap-x-4 tw-mt-12 tw-mb-4 tw-justify-center"
    >
      <q-card class="tw-rounded-xl tw-p-4" flat bordered>
        <div class="tw-gap-y-4 tw-w-full tw-flex tw-justify-center">
          <div class="tw-flex tw-justify-evenly tw-gap-4">
            <q-btn
              text-color="primary"
              class="tw-text-lg tw-px-4 tw-border tw-border-[#fd9c4a]"
              outline
              @click="showPqrds"
              >Sabana de reportes PQRD</q-btn
            >
            <q-btn
              color="primary"
              class="tw-text-lg tw-border tw-border-[#fd9c4a]"
              @click="showPqrdRechazado"
              >Reporte rechazo PQRD</q-btn
            >
          </div>
        </div>

        <div
          class="tw-w-[90%] tw-h-[1px] tw-mb-5 tw-bg-slate-400 tw-border tw-mt-5 tw-mx-auto"
        ></div>

        <div class="tw-gap-y-4 tw-w-full tw-flex tw-flex-col tw-justify-center">
          <div class="tw-flex">
            <div class="tw-w-full tw-mr-4">
              <p class="tw-text-label">Fecha inicial</p>
              <DatepickerWithValidation
                label="dd/mm/yyyy"
                mask="DD/MM/YYYY"
                v-model:input-data-prop="filter.startDate"
                :no-future-dates="true"
                :reference-date-limit="filter.endDate"
                :minimum-months="3"
                :minimum-year="2024"
                :minimum-month="1"
                @validaFecha="(val) => onValidateDate('start', val)"
              />
              <p v-if="errors.startDate" class="tw-text-error">{{ errors.startDate }}</p>
            </div>

            <div class="tw-w-full">
              <p class="tw-text-label">Fecha final</p>
              <DatepickerWithValidation
                label="dd/mm/yyyy"
                mask="DD/MM/YYYY"
                v-model:input-data-prop="filter.endDate"
                :no-future-dates="true"
                :minimum-year="2024"
                :minimum-month="1"
                @validaFecha="(val) => onValidateDate('end', val)"
              />
              <p v-if="errors.endDate" class="tw-text-error">{{ errors.endDate }}</p>
            </div>
          </div>
          <div class="tw-flex tw-full tw-justify-center">
            <q-btn
              text-color="black"
              class="tw-text-lg tw-border"
              outline
              @click="clear"
              >Limpiar filtros</q-btn
            >
            <q-btn
              color="primary"
              class="tw-text-lg tw-ml-4 tw-border tw-border-[#fd9c4a]"
              @click="getData()"
              >Buscar</q-btn
            >
          </div>
        </div>
      </q-card>
    </div>

    <!-- pqrd rechazada -->
    <div
      v-if="pqrdRe"
      class="tw-w-[95%] tw-bg-white tw-rounded-md tw-p-10 tw-flex tw-flex-col tw-gap-x-4 tw-mb-4 tw-justify-center"
    >
      <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat bordered>
        <div
          class="flex items-center justify-between q-px-md q-mb-sm row col-12"
        >
          <span class="text-weight-bold text-h6" style="color: #2c3948"
            >Listado de PQRD</span
          >

          <div class="tw-flex tw-items-center tw-gap-10">
            <q-input
              v-model="search"
              placeholder="Buscar"
              @update:model-value="generalFilterRe"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>

            <div class="tw-flex tw-items-center tw-gap-2.5">
              <q-btn-dropdown
                color="accent"
                textColor="secondary"
                label="Exportar"
                style="width: 116px; height: 30px; border-radius: 8px"
                no-caps
                dropdown-icon="expand_more"
              >
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
                        <q-img v-lazy
                          :data-url="excel"
                          alt="excel"
                          width="24px"
                          height="24px"
                        />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section>Exportar XLSX</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>

              <q-btn
                color="orange-7"
                label="Enviar correo"
                style="width: 150px; height: 30px; border-radius: 8px"
                no-caps
                icon="send"
                @click="sendEmail"
              />
            </div>
          </div>
        </div>
        <TablePqrdsRechazada
          :buscar="buscar"
          class="full-width"
          key-id="id"
          :TABLE_TOTAL_ROWS="dataTableTotalRows"
          :pagination-message="customMessageTableResults"
          :TABLE_HEADER="columns"
          :TABLE_BODY="tableDataPqrdRe"
          select="multiple"
          v-model:item-selected="selection"
          @update:itemSelected="selectRows"
          @handlePageChange="handlePageChange"
          :isLoading="loading"
          @handleRowsPerPageChange="handleRowsPerPageChange"
        />
      </q-card>
    </div>

    <!-- Superintendencia -->
    <div
      v-if="superIntendencia"
      class="tw-w-[95%] tw-bg-white tw-rounded-md tw-p-10 tw-flex tw-flex-col tw-gap-x-4 tw-mt-12 tw-mb-4 tw-justify-center"
    >
      <div class="tw-gap-y-4 tw-w-full tw-flex tw-justify-center">
        <div class="tw-flex tw-justify-center">
          <q-btn
            color="primary"
            class="tw-text-lg tw-border tw-border-[#fd9c4a]"
            @click="columns = SUPERINT_HEADER_M1"
            >Reporte M1</q-btn
          >
          <q-btn
            class="tw-text-lg tw-mx-4 tw-border tw-border-[#fd9c4a]"
            outline
            @click="columns = SUPERINT_HEADER_M2"
            >Reporte M2</q-btn
          >
          <q-btn
            color="primary"
            class="tw-text-lg tw-border tw-border-[#fd9c4a]"
            @click="columns = SUPERINT_HEADER_M3"
            >Reporte M3</q-btn
          >
        </div>
      </div>

      <div
        class="tw-w-[90%] tw-h-[1px] tw-mb-5 tw-bg-slate-400 tw-border tw-mt-5 tw-mx-auto"
      ></div>

      <div class="tw-gap-y-4 tw-w-full tw-flex tw-flex-col tw-justify-center">
          <div class="tw-flex">
            <div class="tw-w-full tw-mr-4">
              <p class="tw-text-label">Fecha inicial</p>
              <DatepickerWithValidation
                label="dd/mm/yyyy"
                mask="DD/MM/YYYY"
                v-model:input-data-prop="filter.startDate"
                :no-future-dates="true"
                :reference-date-limit="filter.endDate"
                :minimum-months="3"
                :minimum-year="2024"
                :minimum-month="1"
                @validaFecha="(val) => onValidateDate('start', val)"
              />
              <p v-if="errors.startDate" class="tw-text-error">{{ errors.startDate }}</p>
            </div>

            <div class="tw-w-full">
              <p class="tw-text-label">Fecha final</p>
              <DatepickerWithValidation
                label="dd/mm/yyyy"
                mask="DD/MM/YYYY"
                v-model:input-data-prop="filter.endDate"
                :no-future-dates="true"
                :minimum-year="2024"
                :minimum-month="1"
                @validaFecha="(val) => onValidateDate('end', val)"
              />
              <p v-if="errors.endDate" class="tw-text-error">{{ errors.endDate }}</p>
            </div>
          </div>
        <div class="tw-flex tw-justify-center tw-items-centers">
          <q-btn
            text-color="black"
            class="tw-text-lg tw-border"
            outline
            @click="clear"
            >Limpiar filtros</q-btn
          >
          <q-btn
            color="primary"
            class="tw-text-lg tw-ml-4 tw-border tw-border-[#fd9c4a]"
            @click="clickData"
            >Buscar</q-btn
          >
        </div>
      </div>
      <TableSuperInt
        :buscar="buscar"
        class="full-width"
        key-id="idPqrd"
        :TABLE_TOTAL_ROWS="dataTableTotalRows"
        :TABLE_HEADER="columns"
        :TABLE_BODY="tableDataPqrds"
        select="multiple"
      />
    </div>
  </div>

  <template v-if="reportModal">
    <LoadingModal @load-complete="sendReportModal = true" />
  </template>
  <template>
    <q-dialog
      v-model="sendReportModal"
      persistent
      transition-show="scale"
      transition-hide="scale"
      transition-duration="300"
    >
      <q-card class="tw-p-10">
        <q-card-section class="tw-bg-white">
          <div class="full-width row tw-justify-center tw-items-center">
            <img v-lazy :data-url="mail" alt="email" />
          </div>
        </q-card-section>
        <q-card-section>
          <p class="tw-font-bold tw-text-2xl tw-text-center">
            Enviar Reporte al Correo
          </p>
          <p class="tw-font-bold tw-mt-3 tw-ms-4 tw-mb-1">Formato *</p>
          <q-form ref="selectModal">
            <q-select
              v-model="inputFormat"
              :rules="[inputRequired]"
              outlined
              map-options
              emit-value
              label="Seleccione"
              :options="[
                { value: 'xlsx', label: 'Excel' },
                { value: 'csv', label: 'CSV' },
              ]"
            />
          </q-form>

          <q-expansion-item
            label="Correo Electrónico *"
            header-class="tw-font-bold tw-mt-3 tw-mb-1"
          >
            <q-card>
              <q-list bordered>
                <q-item>
                  <q-item-section>
                    <q-form ref="emailForm">
                      <q-select
                        :disable="emailList.length < 3 ? false : true"
                        :rules="[inputRequired]"
                        v-model="correo"
                        use-input
                        hide-selected
                        fill-input
                        input-debounce="0"
                        :options="optionsCorreos"
                        @filter="filterFnCorreos"
                      >
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
                          <q-btn
                            icon="add_circle"
                            color="primary"
                            flat
                            v-on:click="addEmail()"
                          />
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
          <q-btn
            color="secondary"
            flat
            label="No"
            v-on:click="confirmCancelarModalEnvioCorreo = true"
            class="col-5 q-ma-none q-py-md"
            style="width: 200px; height: 60px"
          />

          <q-btn
            color="secondary"
            label="Si"
            v-on:click="reportSuccess"
            class="col-5 tw-bg-primary q-ma-none q-py-md"
            style="width: 200px; height: 60px"
          />
        </div>
      </q-card>
    </q-dialog>
    <Modal
      v-model="confirmCancelarModalEnvioCorreo"
      title="Confirmación"
      text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
      :is-success="false"
      cancel-button
      text-button-cancel="No"
      text-button="Si"
      @handleAccept="cancelarEnviarModal"
    />
  </template>
  <template>
    <q-dialog v-model="isLoading">
      <q-card
        class="tw-w-full tw-h-1/2 tw-flex tw-justify-center tw-items-center"
      >
        <q-card-section>
          <div class="text-center">
            <q-circular-progress
              show-value
              :value="valueProgress"
              indeterminate
              class="tw-font-bold w-full"
              size="80px"
              color="primary"
            >
              {{ valueProgress }}%
            </q-circular-progress>
            <section class="tw-mt-10">
              <div class="tw-text-2xl tw-font-bold">
                Consultando información
              </div>
              <div class="text-subtitle1 tw-mt-2">
                Espere un momento por favor
              </div>
            </section>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </template>
</template>

<script setup lang="ts">
import DatepickerWithValidation from "components/FormFields/dateInputWithValidationComponent.vue";
import { exportFile } from "quasar";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import moment from "moment";
import {
  default as TablePqrd,
  default as TableSuperInt,
  default as TablePqrdsRechazada,
} from "./TablePqrds.vue";
import { inputRequired } from "src/helpers/validations";
import { toast } from "src/helpers/toast";
import Modal from "src/components/Modal/Modal.vue";
import * as XLSX from "xlsx";
import csv from "../../../assets/csv.svg";
import excel from "../../../assets/excel.svg";
import Estado from "assets/estado.svg";
import mail from "src/assets/mail.svg";
import LoadingModal from "src/components/Modal/LoadingModal.vue";
import { sgdeaAxios } from "src/services";

const confirmCancelarModalEnvioCorreo = ref(false);
const route = useRoute();
const redirectTo = ref("");
const isLoading = ref(false);
const valueProgress = ref(0);
const rows = ref([]);
const currPage = ref(0);
const pageSize = ref(10);
const search = ref();
const showInicio = ref(true);
const pqrds = ref(false);
const pqrdRe = ref(false);
const superIntendencia = ref(false);
const dataTableTotalRows = ref();
const selectedRows = ref();
const PqrdData = ref([]);
const tableData = ref([]);
const tableDataPqrds = ref([]);
const tableDataRe = ref([]);
const tableDataPqrdRe = ref([]);
const correo = ref();
const correosPositiva = ref([]);
const optionsCorreos = ref([]);
const emailList = ref([]);
const emailForm = ref();
const selectModal = ref();
const inputFormat = ref("");
const sendReportModal = ref(false);
const reportModal = ref(false);
const loading = ref(false);
const header = ref();
const selection = ref([]);

const customMessageTableResults = ref("")
let buscar = ref("");

const errors = ref({
  startDate: '',
  endDate: ''
});
const filter = ref({
  startDate: '',
  endDate: ''
})

async function getData() {
  loading.value = true;
  let fechaActual = new Date().toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
let fechaInicio = filter.value.startDate
  ? moment(filter.value.startDate, "DD/MM/YYYY")
  : moment("2024-01-01", "YYYY-MM-DD");

let fechaFinal = filter.value.endDate
  ? moment(filter.value.endDate, "DD/MM/YYYY")
  : moment(); // hoy
 if (fechaInicio.isAfter(moment()) || fechaFinal.isAfter(moment())) {
  toast.error("La fecha no puede ser superior a la actual");
  loading.value = false;
  return;
} else {
    // Define the mapping between filtro.value properties and URL parameters

const response = await sgdeaAxios.get(
  `/pqrd/reportes/listadoreportepqrd?page=${currPage.value}&size=${pageSize.value}&fechaInicio=${fechaInicio.format("YYYY-MM-DD")}&fechaFinal=${fechaFinal.format("YYYY-MM-DD")}`
);
    const responseR = await sgdeaAxios.get(
      `/pqrd/reportes/listadoreporterechazadospqrd?page=${currPage.value}&size=${pageSize.value}&fechaInicio=${fechaInicio.format("YYYY-MM-DD")}&fechaFinal=${fechaFinal.format("YYYY-MM-DD")}`
    );
    try {
      const data = response.data.content;
      tableData.value = data.map((item: any, index: number) => {
        return {
          id: index + 1,
          idRadicado: item.reportePQRDEncabezadoDTO.idRadicado,
          fechaR: item.reportePQRDInformacionGeneralDTO.fechaRadicacion
            ? moment(
                item.reportePQRDInformacionGeneralDTO.fechaRadicacion
              ).format("DD-MM-YYYY  hh:mm")
            : "N/A",
          fechaM: item.reportePQRDInformacionGeneralDTO.fechaRespuesta
            ? moment(
                item.reportePQRDInformacionGeneralDTO.fechaRespuesta
              ).format("DD-MM-YYYY hh:mm")
            : "N/A",
          fechaC: item.reportePQRDInformacionGeneralDTO.fechaVencimiento
            ? moment(
                item.reportePQRDInformacionGeneralDTO.fechaVencimiento
              ).format("DD-MM-YYYY hh:mm")
            : "N/A",
          fechaE: item.reportePQRDInformacionGeneralDTO.fechaEnvio
            ? moment(item.reportePQRDInformacionGeneralDTO.fechaEnvio).format(
                "DD-MM-YYYY hh:mm"
              )
            : "N/A",
          tiempoV:
            item.reportePQRDInformacionGeneralDTO.tiempoxVencer === 0
              ? "Vencido"
              : item.reportePQRDInformacionGeneralDTO.tiempoxVencer === 1
              ? `${item.reportePQRDInformacionGeneralDTO.tiempoxVencer} día`
              : `${item.reportePQRDInformacionGeneralDTO.tiempoxVencer} días`,
          canal: item.reportePQRDInformacionGeneralDTO.canalRadicacion || "N/A",
          acceso:
            item.reportePQRDInformacionGeneralDTO.accesoInformacionPublica ==
            true
              ? "Si"
              : "No" || "N/A",
          tipologia: item.reportePQRDIDatosGeneralesDTO.tipologia || "N/A",
          detalle:
            item.reportePQRDInformacionGeneralDTO.detalleTramite || "N/A",
          estado: item.reportePQRDInformacionGeneralDTO.estadoPqrd || "N/A",
          Radicador:
            item.reportePQRDInformacionGeneralDTO.nombreRadicador &&
            item.reportePQRDInformacionGeneralDTO.nombreRadicador !== "null"
              ? item.reportePQRDInformacionGeneralDTO.nombreRadicador
              : "N/A",
          clonado:
            item.reportePQRDInformacionGeneralDTO.isClonado === true
              ? "Si"
              : "No" || "N/A",
          oficinaR:
            item.reportePQRDInformacionGeneralDTO.oficinaResponsable || "N/A",
          oficinaI:
            item.reportePQRDInformacionGeneralDTO
              .oficinasIntervienenRespuesta &&
            item.reportePQRDInformacionGeneralDTO.oficinasIntervienenRespuesta
              .length > 0
              ? item.reportePQRDInformacionGeneralDTO.oficinasIntervienenRespuesta
                  .map((o) => o.nombre)
                  .join(", ")
              : "N/A",
          tiempoOR:
            item.reportePQRDInformacionGeneralDTO
              .diasradicacionAoficinaResponsable ||
            item.reportePQRDInformacionGeneralDTO
              .diasradicacionAoficinaResponsable === 0
              ? item.reportePQRDInformacionGeneralDTO
                  .diasradicacionAoficinaResponsable === 1
                ? `${item.reportePQRDInformacionGeneralDTO.diasradicacionAoficinaResponsable} día`
                : `${item.reportePQRDInformacionGeneralDTO.diasradicacionAoficinaResponsable} días`
              : "N/A",
          asignador:
            item.reportePQRDInformacionGeneralDTO.asignadorResponsable || "N/A",
          fechaAO: item.reportePQRDInformacionGeneralDTO.fechaAsignacionOficina
            ? moment(
                item.reportePQRDInformacionGeneralDTO.fechaAsignacionOficina
              ).format("DD-MM-YYYY hh:mm")
            : "N/A",
          fechaAG: item.reportePQRDInformacionGeneralDTO
            .fechaAsignacionGestionador
            ? moment(
                item.reportePQRDInformacionGeneralDTO.fechaAsignacionGestionador
              ).format("DD-MM-YYYY hh:mm")
            : "N/A",
          dias:
            item.reportePQRDInformacionGeneralDTO.diasAsignarAlGestionador ||
            item.reportePQRDInformacionGeneralDTO.diasAsignarAlGestionador === 0
              ? item.reportePQRDInformacionGeneralDTO
                  .diasAsignarAlGestionador === 1
                ? `${item.reportePQRDInformacionGeneralDTO.diasAsignarAlGestionador} día`
                : `${item.reportePQRDInformacionGeneralDTO.diasAsignarAlGestionador} días`
              : "N/A",
          gestionador:
            item.reportePQRDInformacionGeneralDTO.gestionadorResponsable ||
            "N/A",

          gestionadorIR:
            Array.isArray(item.reportePQRDInformacionGeneralDTO.gestionadoresIntervienen) &&
            item.reportePQRDInformacionGeneralDTO.gestionadoresIntervienen.length > 0
              ? item.reportePQRDInformacionGeneralDTO.gestionadoresIntervienen.join(", ")
              : "N/A",
          fechaIG: item.reportePQRDInformacionGeneralDTO.fechaInicioGestion
            ? moment(
                item.reportePQRDInformacionGeneralDTO.fechaInicioGestion
              ).format("DD-MM-YYYY hh:mm")
            : "N/A",
          categoriaA: item.reportePQRDInformacionGeneralDTO.categoria || "N/A",
          categoriaG: item.reportePQRDInformacionGeneralDTO.categoria || "N/A",
          causaRaizGestionador:
            item.reportePQRDInformacionGeneralDTO.causaRaiz || "N/A",
          aFavorDeGestionador:
            item.reportePQRDInformacionGeneralDTO.favorabilidad || "N/A",
          nombreProveedorGestionador: "N/A", // TODO: Sin definir todavia
          categoriaAprobador:
            item.reportePQRDInformacionGeneralDTO.categoria || "N/A",
          causaRaizAprobador:
            item.reportePQRDInformacionGeneralDTO.causaRaiz || "N/A",
          aFavorDeAprobador:
            item.reportePQRDInformacionGeneralDTO.favorabilidad || "N/A",
          fechaEnvioEscalamiento: item.reportePQRDInformacionGeneralDTO
            .fechaEnvioEscalamiento
            ? moment(
                item.reportePQRDInformacionGeneralDTO.fechaEnvioEscalamiento
              ).format("DD-MM-YYYY hh:mm")
            : "N/A",
          fechaEscalamiento: item.reportePQRDInformacionGeneralDTO
            .fechaEscalamiento
            ? moment(
                item.reportePQRDInformacionGeneralDTO.fechaEscalamiento
              ).format("DD-MM-YYYY hh:mm")
            : "N/A",
          diasEscalamiento:
            item.reportePQRDInformacionGeneralDTO.diasEscalamiento ||
            item.reportePQRDInformacionGeneralDTO.diasEscalamiento === 0
              ? item.reportePQRDInformacionGeneralDTO.diasEscalamiento === 1
                ? `${item.reportePQRDInformacionGeneralDTO.diasEscalamiento} día`
                : `${item.reportePQRDInformacionGeneralDTO.diasEscalamiento} días`
              : "N/A",
          responsableEscalamiento:
            item.reportePQRDInformacionGeneralDTO.responsableEscalamiento ||
            "N/A",
          producto: item.reportePQRDInformacionGeneralDTO.producto || "N/A",
          fechaEnvioRevision: item.reportePQRDInformacionGeneralDTO
            .fechaRevision // TODO: Sin definir todavia - se usa el mismo fechaRevision
            ? moment(
                item.reportePQRDInformacionGeneralDTO.fechaRevision
              ).format("DD-MM-YYYY hh:mm")
            : "N/A",
          fechaRevision: item.reportePQRDInformacionGeneralDTO.fechaRevision
            ? moment(
                item.reportePQRDInformacionGeneralDTO.fechaRevision
              ).format("DD-MM-YYYY hh:mm")
            : "N/A",
          diasRevision:
            item.reportePQRDInformacionGeneralDTO.diasEscalamiento ||
            item.reportePQRDInformacionGeneralDTO.diasRevision === 0
              ? item.reportePQRDInformacionGeneralDTO.diasRevision === 1
                ? `${item.reportePQRDInformacionGeneralDTO.diasRevision} día`
                : `${item.reportePQRDInformacionGeneralDTO.diasRevision} días`
              : "N/A",
          responsableRevision:
            item.reportePQRDInformacionGeneralDTO.responsableRevison || "N/A",
          fechaEnvioAprobacion: item.reportePQRDInformacionGeneralDTO
            .fechaAprobacion
            ? moment(
                item.reportePQRDInformacionGeneralDTO.fechaAprobacion
              ).format("DD-MM-YYYY hh:mm")
            : "N/A",
          fechaAprobacion: item.reportePQRDInformacionGeneralDTO.fechaAprobacion
            ? moment(
                item.reportePQRDInformacionGeneralDTO.fechaAprobacion
              ).format("DD-MM-YYYY hh:mm")
            : "N/A",
          diasGestionAprobacion:
            item.reportePQRDInformacionGeneralDTO.diasGestionAprobacion ||
            item.reportePQRDInformacionGeneralDTO.diasGestionAprobacion === 0
              ? item.reportePQRDInformacionGeneralDTO.diasGestionAprobacion ===
                1
                ? `${item.reportePQRDInformacionGeneralDTO.diasGestionAprobacion} día`
                : `${item.reportePQRDInformacionGeneralDTO.diasGestionAprobacion} días`
              : "N/A",
          responsableAprobacion:
            item.reportePQRDInformacionGeneralDTO.responsableAprobacion ||
            "N/A",
          tipoFirma: "N/A", // TODO: Sin definir todavia
          perteneceLGBT: item.reportePQRDInformacionAfecDTO.perteneceLGBT
            ? item.reportePQRDInformacionAfecDTO.perteneceLGBT
            : "N/A",
          sexo: item.reportePQRDInformacionAfecDTO.sexo || "N/A",
          otroCual: item.reportePQRDInformacionAfecDTO.otroSexo || "N/A",
          nombreEmpresaAfectado: "N/A", // TODO: Sin definir todavia
          lenguaNativa:
            item.reportePQRDInformacionGeneralDTO.lenguaNativa === true
              ? "Si"
              : "No" || "N/A",
          condicionEspecial:
            item.reportePQRDInformacionGeneralDTO.condicionEspecial || "N/A",
          compromisosProximos:
            item.reportePQRDInformacionGeneralDTO.compromisoProximo === true
              ? "Si"
              : "No" || "N/A",
          contactabilidad:
            item.reportePQRDInformacionGeneralDTO.contactabilidad || "N/A",
          nombreRemitente:
            item.reportePQRDInformacionRemDTO.nombreRemitente || "N/A",
          departamentoRemitente:
            item.reportePQRDInformacionRemDTO.departamentoRemitente || "N/A",
          codigoDepartamentoRemitente:
            item.reportePQRDInformacionRemDTO.codigoDepartamentoRemitente ||
            "N/A",
          municipioRemitente:
            item.reportePQRDInformacionRemDTO.municipioRemitente || "N/A",
          codigoMunicipioRemitente:
            item.reportePQRDInformacionRemDTO.codigoMunicipioRemitente || "N/A",
          direccionRemitente:
            item.reportePQRDInformacionRemDTO.direccionRemitente || "N/A",
          correoElectronicoRemitente:
            item.reportePQRDInformacionRemDTO.correoRemitente || "N/A",
          nombreAfectado:
            item.reportePQRDInformacionAfecDTO.nombresAfectado || "N/A",
          documentoAfectado:
            item.reportePQRDInformacionAfecDTO.numeroDocumentoAfectado || "N/A",
          direccionAfectado:
            item.reportePQRDInformacionAfecDTO.direccion || "N/A",
          correoElectronicoAfectado:
            item.reportePQRDInformacionAfecDTO.correo || "N/A",
          telefonoAfectado:
            item.reportePQRDInformacionAfecDTO.telefono || "N/A",
          tiempoGestion:
            item.reportePQRDInformacionGeneralDTO.tiempoEnGestion ||
            item.reportePQRDInformacionGeneralDTO.tiempoEnGestion === 0
              ? item.reportePQRDInformacionGeneralDTO.tiempoEnGestion === 1
                ? `${item.reportePQRDInformacionGeneralDTO.tiempoEnGestion} día`
                : `${item.reportePQRDInformacionGeneralDTO.tiempoEnGestion} días`
              : "N/A",
          radicacionSalida:
            item.reportePQRDInformacionGeneralDTO.radicadoSalida || "N/A",
          fechaRadicacionSalida:
            item.reportePQRDInformacionGeneralDTO.fechaRadicadoSalida || "N/A",
          medioEnvio: item.reportePQRDInformacionGeneralDTO.medioEnvio || "N/A",
          nombreDestinatario:
            item.reportePQRDInformacionGeneralDTO.nombreDestinatario || "N/A",
          numeroDocumentoDestinatario:
            item.reportePQRDInformacionGeneralDTO.documentoDestinatario ||
            "N/A",
          direccionDestinatario:
            item.reportePQRDInformacionGeneralDTO.direccionDestinatario ||
            "N/A",
          departamentoDestinatario:
            item.reportePQRDInformacionGeneralDTO.departamentoDestinatario ||
            "N/A",
          codigoDepartamentoDestinatario:
            item.reportePQRDInformacionGeneralDTO
              .codigoDepartamentoDestinatario || "N/A",
          municipioDestinatario:
            item.reportePQRDInformacionGeneralDTO.municipioDestinatario ||
            "N/A",
          codigoMunicipioDestinatario:
            item.reportePQRDInformacionGeneralDTO.codigoMunicipioDestinatario ||
            "N/A",
          telefonoDestinatario:
            item.reportePQRDInformacionGeneralDTO.telefonoDestinatario || "N/A",
          correoElectronicoDestinatario:
            item.reportePQRDInformacionGeneralDTO.emailDestinatario || "N/A",
          conCopia: item.reportePQRDInformacionGeneralDTO.copia
            ? item.reportePQRDInformacionGeneralDTO.copia === "Ninguna"
              ? "No"
              : "Si"
            : "N/A",
          copia: item.reportePQRDInformacionGeneralDTO.copia
            ? item.reportePQRDInformacionGeneralDTO.copia
            : "N/A",
          enviadoElConCopia:
            item.reportePQRDInformacionGeneralDTO.enviadoElConCopia || "N/A",
          formaEnvioConCopia:
            item.reportePQRDInformacionGeneralDTO.formaEnvioCopia || "N/A",
          direccionEnvioDestinatarioCopia:
            item.reportePQRDInformacionGeneralDTO.direccionEnvioCopia || "N/A",
        };
      });

      tableDataRe.value = responseR.data.content.map(
        (item: any, index: number) => {
          return {
            id: index + 1,
            numeroRadicado: item.numeroRadicado || "N/A",
            fechaRadicacion: item.fechaRadicacion
              ? moment(item.fechaRadicacion).format("DD-MM-YYYY")
              : "N/A",
            oficinaResponsableRespuesta: item.oficinaResponsable || "N/A",
            gestionador: item.gestionador || "N/A",
            numeroVecesRechazoRevision:
              item.countRechazoRevision || item.countRechazoRevision === 0
                ? item.countRechazoRevision
                : "N/A",
            fechaEnvioRevision: item.fechaEnvioRevision
              ? moment(item.fechaEnvioRevision).format("DD-MM-YYYY")
              : "N/A",
            fechaRechazoRevision: item.fechaRechazoRevision
              ? moment(item.fechaRechazoRevision).format("DD-MM-YYYY")
              : "N/A",
            fechaAprobacionRevision: item.fechaAprobacionRevision
              ? moment(item.fechaAprobacionRevision).format("DD-MM-YYYY")
              : "N/A",
            nombreRevisorRechaza:
              item.nombreRevisorRechazo && item.nombreRevisorRechazo.length > 0
                ? item.nombreRevisorRechazo.join(", ")
                : "N/A",
            desacuerdoProveedorRevisor: "N/A", // TODO: No trae el dato
            numeroVecesRechazoAprobacion:
              item.countRechazoAprobador || item.countRechazoAprobador === 0
                ? item.countRechazoAprobador
                : "N/A",
            fechaEnvioAprobacion: item.fechaEnvioAprobacion
              ? moment(item.fechaEnvioAprobacion).format("DD-MM-YYYY")
              : "N/A",
            fechaRechazoAprobacion: item.fechaRechazoAprobacion
              ? moment(item.fechaRechazoAprobacion).format("DD-MM-YYYY")
              : "N/A",
            fechaAprobacion: item.fechaAprobacion
              ? moment(item.fechaAprobacion).format("DD-MM-YYYY")
              : "N/A",
            nombreAprobadorRechaza:
              item.nombreAprobadorRechazo &&
              item.nombreRevisorRechazo.length > 0
                ? item.nombreAprobadorRechazo.join(", ")
                : "N/A",
            diasGestionAprobacion:
              item.diasGestionAprobacion || item.diasGestionAprobacion === 0
                ? item.diasGestionAprobacion
                : "N/A",
            desacuerdoProveedorAprobador: "N/A", // TODO: No trae el dato
          };
        }
      );

      tableDataPqrds.value = tableData.value;
      tableDataPqrdRe.value = tableDataRe.value;

      PqrdData.value = tableData.value;
      dataTableTotalRows.value = response.data.totalElements;

      customMessageTableResults.value = response.data.paginationMessage

    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  }
}

function convertirFecha(fecha) {
  let partes = fecha.split("/");
  return new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
}

async function clickData() {
  let filtroFechaInicial = filter.value.startDate;
  let filtroFechaFinal = filter.value.endDate;

  try {
    if (filtroFechaInicial && !filtroFechaFinal) {
      filtroFechaFinal = new Date().toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
    if (filtroFechaFinal && !filtroFechaInicial) {
      filtroFechaInicial = "01/01/2024";
    }

    let fechaInicio = convertirFecha(filtroFechaInicial);
    let fechaFinal = convertirFecha(filtroFechaFinal);

    let datosFiltrados = tableData.value.filter((item) => {
      let fechaR = new Date(item.fechaR.split("-").reverse().join("-"));
      return fechaR >= fechaInicio && fechaR <= fechaFinal;
    });

    let datosFiltradosRe = tableDataRe.value.filter((item) => {
      let fechaR = new Date(
        item.fechaRadicacion.split("-").reverse().join("-")
      );
      return fechaR >= fechaInicio && fechaR <= fechaFinal;
    });

    tableDataPqrds.value = datosFiltrados;
    tableDataPqrdRe.value = datosFiltradosRe;

    if (!filter.value.startDate && !filter.value.endDate) {
      tableDataPqrds.value = PqrdData.value;
      tableDataPqrdRe.value = tableDataRe.value;
    }
  } catch (error) {
    console.error(error);
  }
}

async function clear() {
  filter.value.startDate = null;
  filter.value.endDate = null;
  getData();
}

const addEmail = async () => {
  if (await emailForm.value.validate()) {
    if (emailList.value.includes(correo.value.label)) {
      toast.error("El correo ingresado ya se encuentra en la lista");
    } else {
      emailList.value.push(correo.value.label);
      correo.value = "";
      emailForm.value.reset();
    }
  }
};

const deleteEmail = (email) => {
  emailList.value = emailList.value.filter((item) => item != email);
};

const handlePageChange = async (page: number) => {
  currPage.value = page <= 0 ? 0 : page - 1;
  await getData();
};

const handleRowsPerPageChange = async (rowsPerPage: any) => {
  pageSize.value = rowsPerPage;
  currPage.value = 0;
  await getData();
};

const REPORTES_HEADER = [
  {
    name: "idRadicado",
    label: "Número de radicado",
    field: "idRadicado",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaRadicacion",
    label: "Fecha de radicación",
    field: "fechaR",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaMaxima",
    label: "Fecha máxima de vencimiento",
    field: "fechaM",
    sortable: true,
    align: "center",
  },
  // {
  //   name: "fechaVencimiento",
  //   label: "Fecha de vencimiento",
  //   field: "fechaC",
  //   sortable: true,
  //   align: 'center'
  // },
  {
    name: "fechaEnvio",
    label: "Fecha de envío",
    field: "fechaE",
    sortable: true,
    align: "center",
  },
  {
    name: "tiempo",
    label: "Tiempo por vencer",
    field: "tiempoV",
    sortable: true,
    align: "center",
  },
  {
    name: "canal",
    label: "Canal de radicación",
    field: "canal",
    sortable: true,
    align: "center",
  },
  {
    name: "acceso",
    label: "Acceso Información Pública",
    field: "acceso",
    sortable: true,
  },
  {
    name: "tipologia",
    label: "Tipología de PQRD",
    field: "tipologia",
    sortable: true,
    align: "center",
  },
  {
    name: "detalle",
    label: "Detalle del trámite",
    field: "detalle",
    sortable: true,
    align: "center",
  },
  {
    name: "estado",
    label: "Estado",
    field: "estado",
    sortable: true,
  },
  {
    name: "Radicador",
    label: "Radicador",
    field: "Radicador",
    sortable: true,
  },
  {
    name: "clonado",
    label: "Clonado",
    field: "clonado",
    sortable: true,
  },
  {
    name: "oficinaRespuesta",
    label: "Oficina responsable de respuesta",
    field: "oficinaR",
    sortable: true,
    align: "center",
  },
  {
    name: "oficinaInterviene",
    label: "Oficinas que intervienen en la respuesta",
    field: "oficinaI",
    sortable: true,
  },
  {
    name: "tiempoAsignaciónAdicaciónOficinaResponsable",
    label: "Tiempo asignación de radicación a oficina responsable",
    field: "tiempoOR",
    sortable: true,
  },
  {
    name: "asignador",
    label: "Asignador de responsable",
    field: "asignador",
    sortable: true,
  },
  {
    name: "fechaAsignacionOficina",
    label: "Fecha de asignación a la oficina",
    field: "fechaAO",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaAsignacionOficina",
    label: "Fecha de asignación al gestionador",
    field: "fechaAG",
    sortable: true,
    align: "center",
  },
  {
    name: "dias",
    label: "Días de asignación al gestionador",
    field: "dias",
    sortable: true,
    align: "center",
  },
  {
    name: "gestionador",
    label: "Gestionador responsable",
    field: "gestionador",
    sortable: true,
    align: "center",
  },
  {
    name: "gestionadorIntervieneRespuesta",
    label: "Gestionadores que intervienen en la respuesta",
    field: "gestionadorIR",
    sortable: true,
    align: "center",
  },
  {
    name: "FechaIniciarGestion",
    label: "Fecha de iniciar gestión",
    field: "fechaIG",
    sortable: true,
    align: "center",
  },
  {
    name: "categoriaAsignador",
    label: "Categoría asignador de responsable",
    field: "categoriaA",
    sortable: true,
    align: "center",
  },
  {
    name: "categoriaGestionador",
    label: "Categoría (gestionador)",
    field: "categoriaG",
    sortable: true,
    align: "center",
  },
  {
    name: "causaRaizGestionador",
    label: "Causa-raiz (gestionador)",
    field: "causaRaizGestionador",
    sortable: true,
    align: "center",
  },
  {
    name: "aFavorDeGestionador",
    label: "A favor de (gestionador)",
    field: "aFavorDeGestionador",
    sortable: true,
    align: "center",
  },
  {
    name: "nombreProveedorGestionador",
    label: "Nombre del proveedor (gestionador)",
    field: "nombreProveedorGestionador",
    sortable: true,
    align: "center",
  },
  {
    name: "categoriaAprobador",
    label: "Categoría (aprobador)",
    field: "categoriaAprobador",
    sortable: true,
    align: "center",
  },
  {
    name: "causaRaizAprobador",
    label: "Causa-raiz (aprobador)",
    field: "causaRaizAprobador",
    sortable: true,
    align: "center",
  },
  {
    name: "aFavorDeAprobador",
    label: "A favor de (aprobador)",
    field: "aFavorDeAprobador",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaEnvioEscalamiento",
    label: "Fecha envío escalamiento",
    field: "fechaEscalamiento",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaEscalamiento",
    label: "Fecha escalamiento",
    field: "fechaEscalamiento",
    sortable: true,
    align: "center",
  },
  {
    name: "diasEscalamiento",
    label: "Días de escalamiento",
    field: "diasEscalamiento",
    sortable: true,
    align: "center",
  },
  {
    name: "responsablesEscalamiento",
    label: "Responsable(s) de escalamiento",
    field: "responsableEscalamiento",
    sortable: true,
    align: "center",
  },
  {
    name: "producto",
    label: "Producto",
    field: "producto",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaEnvioRevision",
    label: "Fecha envío revisión",
    field: "fechaEnvioRevision",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaRevision",
    label: "Fecha revisión",
    field: "fechaRevision",
    sortable: true,
    align: "center",
  },
  {
    name: "diasRevision",
    label: "Días en revisión",
    field: "diasRevision",
    sortable: true,
    align: "center",
  },
  {
    name: "responsableRevision",
    label: "Responsable revisión",
    field: "responsableRevision",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaEnvioAprobacion",
    label: "Fecha envío aprobación",
    field: "fechaEnvioAprobacion",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaAprobacion",
    label: "Fecha aprobación",
    field: "fechaAprobacion",
    sortable: true,
    align: "center",
  },
  {
    name: "diasGestionAprobacion",
    label: "Días en gestión de aprobación",
    field: "diasGestionAprobacion",
    sortable: true,
  },
  {
    name: "responsableAprobacion",
    label: "Responsable aprobación",
    field: "responsableAprobacion",
    sortable: true,
    align: "center",
  },
  {
    name: "tipoFirma",
    label: "Tipo de firma",
    field: "tipoFirma",
    sortable: true,
    align: "center",
  },
  {
    name: "perteneceLGBT",
    label: "¿Pertenece a la comunidad LGBTIQ+?",
    field: (row) => (row.perteneceLGBT === "SI" ? "Si" : "No"),
    sortable: true,
    align: "center",
  },
  {
    name: "sexo",
    label: "Sexo",
    field: "sexo",
    sortable: true,
    align: "center",
  },
  {
    name: "otroCual",
    label: "Otro ¿Cuál?",
    field: "otroCual",
    sortable: true,
    align: "center",
  },
  {
    name: "nombreEmpresaAfectado",
    label: "Nombre empresa del afectado",
    field: "nombreEmpresaAfectado",
    sortable: true,
    align: "center",
  },
  {
    name: "lenguaNativa",
    label: "Lengua Nativa",
    field: "lenguaNativa",
    sortable: true,
    align: "center",
  },
  {
    name: "condicionEspecial",
    label: "Condición especial",
    field: "condicionEspecial",
    sortable: true,
    align: "center",
  },
  {
    name: "compromisosProximos",
    label: "Compromisos próximos",
    field: "compromisosProximos",
    sortable: true,
    align: "center",
  },
  {
    name: "contactabilidad",
    label: "Contactabilidad",
    field: "contactabilidad",
    sortable: true,
    align: "center",
  },
  {
    name: "nombreRemitente",
    label: "Nombre del remitente",
    field: "nombreRemitente",
    sortable: true,
    align: "center",
  },
  {
    name: "departamentoRemitente",
    label: "Departamento del remitente",
    field: "departamentoRemitente",
    sortable: true,
    align: "center",
  },
  {
    name: "codigoDepartamentoRemitente",
    label: "Código departamento remitente",
    field: "codigoDepartamentoRemitente",
    sortable: true,
    align: "center",
  },
  {
    name: "municipioRemitente",
    label: "Municipio del remitente",
    field: "municipioRemitente",
    sortable: true,
    align: "center",
  },
  {
    name: "codigoMunicipioRemitente",
    label: "Código municipio remitente",
    field: "codigoMunicipioRemitente",
    sortable: true,
    align: "center",
  },
  {
    name: "direccionRemitente",
    label: "Dirección del remitente",
    field: "direccionRemitente",
    sortable: true,
    align: "center",
  },
  {
    name: "correoElectronicoRemitente",
    label: "Correo electrónico remitente",
    field: "correoElectronicoRemitente",
    sortable: true,
    align: "center",
  },
  {
    name: "nombreAfectado",
    label: "Nombre del afectado",
    field: "nombreAfectado",
    sortable: true,
    align: "center",
  },
  {
    name: "documentoAfectado",
    label: "Documento del afectado",
    field: "documentoAfectado",
    sortable: true,
    align: "center",
  },
  {
    name: "direccionAfectado",
    label: "Dirección del afectado",
    field: "direccionAfectado",
    sortable: true,
    align: "center",
  },
  {
    name: "correoElectronicoAfectado",
    label: "Correo electrónico del afectado",
    field: "correoElectronicoAfectado",
    sortable: true,
    align: "center",
  },
  {
    name: "telefonoAfectado",
    label: "Teléfono del afectado",
    field: "telefonoAfectado",
    sortable: true,
    align: "center",
  },
  {
    name: "tiempoGestion",
    label: "Tiempo en gestión",
    field: "tiempoGestion",
    sortable: true,
    align: "center",
  },
  {
    name: "radicacionSalida",
    label: "Radicación salida",
    field: "radicacionSalida",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaRadicacionSalida",
    label: "Fecha radicación salida",
    field: "fechaRadicacionSalida",
    sortable: true,
    align: "center",
  },
  {
    name: "medioEnvio",
    label: "Medio de envío",
    field: "medioEnvio",
    sortable: true,
    align: "center",
  },
  {
    name: "nombreDestinatario",
    label: "Nombre del destinatario",
    field: "nombreDestinatario",
    sortable: true,
    align: "center",
  },
  {
    name: "numeroDocumentoDestinatario",
    label: "Número de documento del destinatario",
    field: "numeroDocumentoDestinatario",
    sortable: true,
    align: "center",
  },
  {
    name: "direccionDestinatario",
    label: "Dirección del destinatario",
    field: "direccionDestinatario",
    sortable: true,
    align: "center",
  },
  {
    name: "departamentoDestinatario",
    label: "Departamento del destinatario",
    field: "departamentoDestinatario",
    sortable: true,
    align: "center",
  },
  {
    name: "codigoDepartamentoDestinatario",
    label: "Código departamento destinatario",
    field: "codigoDepartamentoDestinatario",
    sortable: true,
    align: "center",
  },
  {
    name: "municipioDestinatario",
    label: "Municipio del destinatario",
    field: "municipioDestinatario",
    sortable: true,
    align: "center",
  },
  {
    name: "codigoMunicipioDestinatario",
    label: "Código municipio destinatario",
    field: "codigoMunicipioDestinatario",
    sortable: true,
    align: "center",
  },
  {
    name: "telefonoDestinatario",
    label: "Teléfono del destinatario",
    field: "telefonoDestinatario",
    sortable: true,
    align: "center",
  },
  {
    name: "correoElectronicoDestinatario",
    label: "Correo electronico del destinatario",
    field: "correoElectronicoDestinatario",
    sortable: true,
    align: "center",
  },
  {
    name: "conCopia",
    label: "Con Copia",
    field: "conCopia",
    sortable: true,
    align: "center",
  },
  {
    name: "copia",
    label: "Copia",
    field: "copia",
    sortable: true,
    align: "center",
  },
  {
    name: "enviadoElConCopia",
    label: "Enviado el con copia",
    field: "enviadoElConCopia",
    sortable: true,
    align: "center",
  },
  {
    name: "formaEnvioConCopia",
    label: "Forma de envío de con copia",
    field: "formaEnvioConCopia",
    sortable: true,
    align: "center",
  },
  {
    name: "direccionEnvioDestinatarioCopia",
    label: "Dirección de envío del destinatario de la copia",
    field: "direccionEnvioDestinatarioCopia",
    sortable: true,
    align: "center",
  },
];

const REPORTES_HEADER_RECHAZADO = [
  {
    name: "numeroRadicado",
    label: "Número de radicado",
    field: "numeroRadicado",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaRadicacion",
    label: "Fecha de radicación",
    field: "fechaRadicacion",
    sortable: true,
    align: "center",
  },
  {
    name: "oficinaResponsableRespuesta",
    label: "Oficina responsable de respuesta",
    field: "oficinaResponsableRespuesta",
    sortable: true,
    align: "center",
  },
  {
    name: "gestionador",
    label: "Gestionador",
    field: "gestionador",
    sortable: true,
    align: "center",
  },
  {
    name: "numeroVecesRechazoRevision",
    label: "Número de veces rechazo de revisión",
    field: "numeroVecesRechazoRevision",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaEnvioRevision",
    label: "Fecha de envío a revisión",
    field: "fechaEnvioRevision",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaRechazoRevision",
    label: "Fecha de rechazo revisión",
    field: "fechaRechazoRevision",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaAprobacionRevision",
    label: "Fecha de aprobación revisión",
    field: "fechaAprobacionRevision",
    sortable: true,
    align: "center",
  },
  {
    name: "nombreRevisorRechaza",
    label: "Nombre del revisor que rechaza", //falta?
    field: "nombreRevisorRechaza",
    sortable: true,
    align: "center",
  },
  {
    name: "desacuerdoProveedorRevisor",
    label: "Desacuerdo proveedor al revisor", //falta?
    field: "desacuerdoProveedorRevisor",
    sortable: true,
    align: "center",
  },
  {
    name: "numeroVecesRechazoAprobacion",
    label: "Número de veces rechazo de aprobación",
    field: "numeroVecesRechazoAprobacion",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaEnvioAprobacion",
    label: "Fecha de envío a aprobación",
    field: "fechaEnvioAprobacion",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaRechazoAprobacion",
    label: "Fecha de rechazo aprobación",
    field: "fechaRechazoAprobacion",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaAprobacion",
    label: "Fecha de aprobación",
    field: "fechaAprobacion",
    sortable: true,
    align: "center",
  },
  {
    name: "nombreAprobadorRechaza",
    label: "Nombre del aprobador que rechaza",
    field: "nombreAprobadorRechaza",
    sortable: true,
    align: "center",
  },
  {
    name: "diasGestionAprobacion",
    label: "Días en gestión de aprobación",
    field: "diasGestionAprobacion",
    sortable: true,
    align: "center",
  },
  {
    name: "desacuerdoProveedorAprobador",
    label: "Desacuerdo proveedor al aprobador",
    field: "desacuerdoProveedorAprobador",
    sortable: true,
    align: "center",
  },
];

const SUPERINT_HEADER_M1 = [
  {
    name: "tipoEntidad",
    label: "Tipo de entidad",
    field: "tipoEntidad",
    sortable: true,
  },
  {
    name: "codigoEntidad",
    label: "Código de entidad",
    field: "codigoEntidad",
    sortable: true,
  },
  {
    name: "fechaHoraCreacion",
    label: "Fecha y hora de creación",
    field: "fechaHoraCreacion",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaRegistroM1",
    label: "Fecha de registro M1",
    field: "fechaRegistroM1",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaRadicacionGestor",
    label: "Fecha de radicación gestor",
    field: "fechaRadicacionGestor",
    sortable: true,
    align: "center",
  },
  { name: "estado", label: "Estado", field: "estado", sortable: true },
  {
    name: "codigoQuejaReclamo",
    label: "Código de la queja o reclamo",
    field: "codigoQuejaReclamo",
    sortable: true,
  },
  { name: "radicado", label: "Radicado", field: "radicado", sortable: true },
  { name: "pais", label: "País", field: "pais", sortable: true },
  {
    name: "nombrePais",
    label: "Nombre País",
    field: "nombrePais",
    sortable: true,
  },
  {
    name: "departamento",
    label: "Departamento",
    field: "departamento",
    sortable: true,
  },
  {
    name: "nombreDepartamento",
    label: "Nombre Departamento",
    field: "nombreDepartamento",
    sortable: true,
  },
  { name: "municipio", label: "Municipio", field: "municipio", sortable: true },
  {
    name: "nombreMunicipio",
    label: "Nombre Municipio",
    field: "nombreMunicipio",
    sortable: true,
  },
  {
    name: "nombreRazonSocialConsumidorFinanciero",
    label: "Nombre o razón social del consumidor financiero",
    field: "nombreRazonSocialConsumidorFinanciero",
    sortable: true,
  },
  {
    name: "tipoIdentificacionConsumidorFinanciero",
    label: "Tipo identificación del consumidor financiero",
    field: "tipoIdentificacionConsumidorFinanciero",
    sortable: true,
  },
  {
    name: "nombreTipoIdentificacionConsumidorFinanciero",
    label: "Nombre tipo identificación del consumidor financiero",
    field: "nombreTipoIdentificacionConsumidorFinanciero",
    sortable: true,
  },
  {
    name: "numeroIdentificacionConsumidorFinanciero",
    label: "Número de identificación del consumidor financiero",
    field: "numeroIdentificacionConsumidorFinanciero",
    sortable: true,
  },
  { name: "telefono", label: "Teléfono", field: "telefono", sortable: true },
  { name: "correo", label: "Correo", field: "correo", sortable: true },
  { name: "direccion", label: "Dirección", field: "direccion", sortable: true },
  {
    name: "tipoPersona",
    label: "Tipo de persona",
    field: "tipoPersona",
    sortable: true,
  },
  {
    name: "nombreTipoPersona",
    label: "Nombre tipo de persona",
    field: "nombreTipoPersona",
    sortable: true,
  },
  { name: "sexo", label: "Sexo", field: "sexo", sortable: true },
  { name: "sexo", label: "Nombre Sexo", field: "sexo", sortable: true },
  {
    name: "perteneceLGBT",
    label: "LGBTIQ+",
    field: "perteneceLGBT",
    sortable: true,
  },
  {
    name: "nombreLGBTIQ",
    label: "Nombre LGBTIQ",
    field: "nombreLGBTIQ",
    sortable: true,
  },
  { name: "canal", label: "Canal", field: "canal", sortable: true },
  {
    name: "canal",
    label: "Nombre Canal",
    field: "canal",
    sortable: true,
    align: "center",
  },
  {
    name: "condicionEspecial",
    label: "Condición Especial",
    field: "condicionEspecial",
    sortable: true,
  },
  {
    name: "condicionEspecial",
    label: "Nombre Condición Especial",
    field: "condicionEspecial",
    sortable: true,
  },
  {
    name: "producto",
    label: "Producto",
    field: "producto",
    sortable: true,
    align: "center",
  },
  {
    name: "nombreProducto",
    label: "Nombre producto",
    field: "nombreProducto",
    sortable: true,
  },
  {
    name: "descripcionProducto",
    label: "Descripción producto",
    field: "descripcionProducto",
    sortable: true,
  },
  {
    name: "macroMotivo",
    label: "Macro motivo",
    field: "macroMotivo",
    sortable: true,
  },
  {
    name: "nombreMacroMotivo",
    label: "Nombre macro motivo",
    field: "nombreMacroMotivo",
    sortable: true,
  },
  {
    name: "textoQueja",
    label: "Texto de la queja",
    field: "textoQueja",
    sortable: true,
  },
  {
    name: "anexosQuejaReclamo",
    label: "Anexos de la queja o reclamo",
    field: "anexosQuejaReclamo",
    sortable: true,
  },
  {
    name: "nombreAnexosQuejaReclamo",
    label: "Nombre anexos de la queja o reclamo",
    field: "nombreAnexosQuejaReclamo",
    sortable: true,
  },
  { name: "tutela", label: "Tutela", field: "tutela", sortable: true },
  {
    name: "nombreTutela",
    label: "Nombre tutela",
    field: "nombreTutela",
    sortable: true,
  },
  {
    name: "enteControl",
    label: "Ente de control",
    field: "enteControl",
    sortable: true,
  },
  {
    name: "nombreEnteControl",
    label: "Nombre Ente de control",
    field: "nombreEnteControl",
    sortable: true,
  },
  {
    name: "escalamiento",
    label: "Escalamiento",
    field: "escalamiento",
    sortable: true,
  },
  {
    name: "nombreEscalamiento",
    label: "Nombre escalamiento",
    field: "nombreEscalamiento",
    sortable: true,
  },
  { name: "REPLICA", label: "RÉPLICA", field: "REPLICA", sortable: true },
  {
    name: "nombreReplica",
    label: "Nombre replica",
    field: "nombreReplica",
    sortable: true,
  },
  {
    name: "argumentoReplica",
    label: "Argumento replica",
    field: "argumentoReplica",
    sortable: true,
  },
  {
    name: "desistimiento",
    label: "Desistimiento",
    field: "desistimiento",
    sortable: true,
  },
  {
    name: "nombreDesistimiento",
    label: "Nombre Desistimiento",
    field: "nombreDesistimiento",
    sortable: true,
  },
  {
    name: "quejaExpres",
    label: "Queja Exprés",
    field: "quejaExpres",
    sortable: true,
  },
  {
    name: "nombreQuejaExpres",
    label: "Nombre Queja Exprés",
    field: "nombreQuejaExpres",
    sortable: true,
  },
];

const SUPERINT_HEADER_M2 = [
  {
    name: "fechaAG",
    label: "Fecha de radicación gestor",
    field: "fechaAG",
    sortable: true,
    align: "center",
  },
  {
    name: "F",
    label: "Código de la queja o reclamo",
    field: "codigoQuejaReclamo",
    sortable: true,
  },
  {
    name: "fechaM",
    label: "Fecha de registro M2",
    field: "fechaM",
    sortable: true,
    align: "center",
  },
  {
    name: "casoTransmitidoSuperfinanciera",
    label: "Caso Trasmitido a la Superfinanciera",
    field: "casoTransmitidoSuperfinanciera",
    sortable: true,
  },
  {
    name: "fechaTransmision",
    label: "Fecha de transmisión",
    field: "fechaTransmision",
    sortable: true,
    align: "center",
  },
  {
    name: "tramiteRadicacion",
    label: "Trámite radicación",
    field: "tramiteRadicacion",
    sortable: true,
  },
  {
    name: "tramiteGestion",
    label: "Trámite gestión",
    field: "tramiteGestion",
    sortable: true,
  },
  { name: "pais", label: "País", field: "pais", sortable: true },
  {
    name: "nombrePais",
    label: "Nombre País",
    field: "nombrePais",
    sortable: true,
  },
  {
    name: "departamento",
    label: "Departamento",
    field: "departamento",
    sortable: true,
  },
  {
    name: "nombreDepartamento",
    label: "Nombre Departamento",
    field: "nombreDepartamento",
    sortable: true,
  },
  {
    name: "municipio",
    label: "Municipio",
    fiFeld: "municipio",
    sortable: true,
  },
  {
    name: "nombreMunicipio",
    label: "Nombre Municipio",
    field: "nombreMunicipio",
    sortable: true,
  },
  {
    name: "canal",
    label: "Canal",
    field: "canal",
    sortable: true,
    align: "center",
  },
  {
    name: "canal",
    label: "Nombre Canal",
    field: "canal",
    sortable: true,
    align: "center",
  },
  {
    name: "producto",
    label: "Producto",
    field: "producto",
    sortable: true,
    align: "center",
  },
  {
    name: "nombreProducto",
    label: "Nombre producto",
    field: "nombreProducto",
    sortable: true,
  },
  {
    name: "motivo",
    label: "Motivo",
    field: "tipologia",
    sortable: true,
    align: "center",
  },
  {
    name: "tipologia",
    label: "Nombre Motivo",
    field: "tipologia",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaHoraCreacion",
    label: "Fecha y hora de creación",
    field: "fechaHoraCreacion",
    sortable: true,
    align: "center",
  },
  {
    name: "nombreRazonSocialConsumidorFinanciero",
    label: "Nombre o razón social del consumidor financiero",
    field: "nombreRazonSocialConsumidorFinanciero",
    sortable: true,
  },
  {
    name: "tipoIdentificacionConsumidorFinanciero",
    label: "Tipo identificación del consumidor financiero",
    field: "tipoIdentificacionConsumidorFinanciero",
    sortable: true,
  },
  {
    name: "nombreTipoIdentificacionConsumidorFinanciero",
    label: "Nombre tipo identificación del consumidor financiero",
    field: "nombreTipoIdentificacionConsumidorFinanciero",
    sortable: true,
  },
  {
    name: "numeroIdentificacionConsumidorFinanciero",
    label: "Número de identificación del consumidor financiero",
    field: "numeroIdentificacionConsumidorFinanciero",
    sortable: true,
  },
  {
    name: "tipoPersona",
    label: "Tipo de persona",
    field: "tipoPersona",
    sortable: true,
  },
  {
    name: "nombreTipoPersona",
    label: "Nombre tipo de persona",
    field: "nombreTipoPersona",
    sortable: true,
  },
  {
    name: "instanciaRecepcion",
    label: "Instancia de recepción",
    field: "instanciaRecepcion",
    sortable: true,
  },
  {
    name: "nombreInstanciaRecepcion",
    label: "Nombre Instancia de recepción",
    field: "nombreInstanciaRecepcion",
    sortable: true,
  },
  {
    name: "puntoRecepcion",
    label: "Punto de recepción",
    field: "puntoRecepcion",
    sortable: true,
  },
  {
    name: "nombrePuntoRecepcion",
    label: "Nombre punto de recepción",
    field: "nombrePuntoRecepcion",
    sortable: true,
  },
  { name: "admision", label: "Admisión", field: "admision", sortable: true },
  {
    name: "nombreAdmision",
    label: "Nombre Admisión",
    field: "nombreAdmision",
    sortable: true,
  },
  {
    name: "textoQueja",
    label: "Texto de la queja",
    field: "textoQueja",
    sortable: true,
  },
  {
    name: "anexosQuejaReclamo",
    label: "Anexos de la queja o reclamo",
    field: "anexosQuejaReclamo",
    sortable: true,
  },
  {
    name: "nombreAnexosQuejaReclamo",
    label: "Nombre Anexos de la queja o reclamo",
    field: "nombreAnexosQuejaReclamo",
    sortable: true,
  },
  {
    name: "enteControl",
    label: "Ente de control",
    field: "enteControl",
    sortable: true,
  },
  {
    name: "nombreEnteControl",
    label: "Nombre Ente de control",
    field: "nombreEnteControl",
    sortable: true,
  },
  {
    name: "seguimientoError",
    label: "Seguimiento Error",
    field: "seguimientoError",
    sortable: true,
  },
];

const SUPERINT_HEADER_M3 = [
  {
    name: "fechaAG",
    label: "Fecha de radicación gestor",
    field: "fechaAG",
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
    name: "codigoQuejaReclamo",
    label: "Código de la queja o reclamo",
    field: "codigoQuejaReclamo",
    sortable: true,
  },
  {
    name: "fechaM",
    label: "Fecha de registro M3",
    field: "fechaM",
    sortable: true,
    align: "center",
  },
  { name: "momento", label: "Momento", field: "momento", sortable: true },
  {
    name: "casoTransmitidoSuperfinanciera",
    label: "Caso Trasmitido a la Superfinanciera",
    field: "casoTransmitidoSuperfinanciera",
    sortable: true,
  },
  {
    name: "fechaTransmision",
    label: "Fecha de transmisión",
    field: "fechaTransmision",
    sortable: true,
    align: "center",
  },
  {
    name: "tramiteRadicacion",
    label: "Trámite radicación",
    field: "tramiteRadicacion",
    sortable: true,
  },
  {
    name: "tramiteGestion",
    label: "Trámite gestión",
    field: "tramiteGestion",
    sortable: true,
  },
  {
    name: "sexo",
    label: "Sexo",
    field: "sexo",
    sortable: true,
    align: "center",
  },
  {
    name: "sexo",
    label: "Nombre Sexo",
    field: "sexo",
    sortable: true,
    align: "center",
  },
  {
    name: "LGBTIQ",
    label: "LGBTIQ+",
    field: "LGBTIQ",
    sortable: true,
    align: "center",
  },
  {
    name: "nombreLGBTIQ",
    label: "Nombre LGBTIQ",
    field: "nombreLGBTIQ",
    sortable: true,
    align: "center",
  },
  {
    name: "condicionEspecial",
    label: "Condición Especial",
    field: "condicionEspecial",
    sortable: true,
    align: "center",
  },
  {
    name: "condicionEspecial",
    label: "Nombre Condición Especial",
    field: "condicionEspecial",
    sortable: true,
    align: "center",
  },
  {
    name: "canal",
    label: "Canal",
    field: "canal",
    sortable: true,
    align: "center",
  },
  {
    name: "canal",
    label: "Nombre Canal",
    field: "canal",
    sortable: true,
    align: "center",
  },
  {
    name: "producto",
    label: "Producto",
    field: "producto",
    sortable: true,
    align: "center",
  },
  {
    name: "nombreProducto",
    label: "Nombre producto",
    field: "nombreProducto",
    sortable: true,
  },
  {
    name: "tipologia",
    label: "Motivo",
    field: "tipologia",
    sortable: true,
    align: "center",
  },
  {
    name: "tipologia",
    label: "Nombre Motivo",
    field: "tipologia",
    sortable: true,
    align: "center",
  },
  {
    name: "estado",
    label: "Estado de la queja o reclamo",
    field: "estado",
    sortable: true,
    align: "center",
  },
  {
    name: "estado",
    label: "Nombre Estado de la queja o reclamo",
    field: "estado",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaHoraActualizacion",
    label: "Fecha y hora de actualización",
    field: "fechaHoraActualizacion",
    sortable: true,
    align: "center",
  },
  {
    name: "productoDigital",
    label: "Producto digital",
    field: "productoDigital",
    sortable: true,
  },
  {
    name: "nombreProductoDigital",
    label: "Nombre Producto digital",
    field: "nombreProductoDigital",
    sortable: true,
    align: "center",
  },
  {
    name: "favorabilidad",
    label: "Favorabilidad",
    field: "favorabilidad",
    sortable: true,
  },
  {
    name: "nombreFavorabilidad",
    label: "Nombre Favorabilidad",
    field: "nombreFavorabilidad",
    sortable: true,
    align: "center",
  },
  {
    name: "aceptacion",
    label: "Aceptación",
    field: "aceptacion",
    sortable: true,
    align: "center",
  },
  {
    name: "nombreAceptacion",
    label: "Nombre Aceptación",
    field: "nombreAceptacion",
    sortable: true,
    align: "center",
  },
  {
    name: "rectificacion",
    label: "Rectificación",
    field: "rectificacion",
    sortable: true,
  },
  {
    name: "nombreRectificacion",
    label: "Nombre Rectificación",
    field: "nombreRectificacion",
    sortable: true,
  },
  {
    name: "desistimiento",
    label: "Desistimiento",
    field: "desistimiento",
    sortable: true,
  },
  {
    name: "nombreDesistimiento",
    label: "Nombre Desistimiento",
    field: "nombreDesistimiento",
    sortable: true,
  },
  { name: "prorroga", label: "Prórroga", field: "prorroga", sortable: true },
  {
    name: "nombreProrroga",
    label: "Nombre Prórroga",
    field: "nombreProrroga",
    sortable: true,
  },
  { name: "admision", label: "Admisión", field: "admision", sortable: true },
  {
    name: "nombreAdmision",
    label: "Nombre Admisión",
    field: "nombreAdmision",
    sortable: true,
  },
  {
    name: "documentacionRespuestaFinal",
    label: "Documentación de respuesta final",
    field: "documentacionRespuestaFinal",
    sortable: true,
  },
  {
    name: "nombreDocumentacionRespuestaFinal",
    label: "Nombre documentación de respuesta final",
    field: "nombreDocumentacionRespuestaFinal",
    sortable: true,
  },
  {
    name: "anexosRespuestaFinal",
    label: "Anexos a la respuesta final",
    field: "anexosRespuestaFinal",
    sortable: true,
  },
  {
    name: "nombreAnexosRespuestaFinal",
    label: "Nombre Anexos a la respuesta final",
    field: "nombreAnexosRespuestaFinal",
    sortable: true,
  },
  {
    name: "fechaEscalamiento",
    label: "Fecha de cierre",
    field: "fechaEscalamiento",
    sortable: true,
    align: "center",
  },
  { name: "tutela", label: "Tutela", field: "tutela", sortable: true },
  {
    name: "nombreTutela",
    label: "Nombre Tutela",
    field: "nombreTutela",
    sortable: true,
  },
  {
    name: "enteControl",
    label: "Ente de control",
    field: "enteControl",
    sortable: true,
  },
  {
    name: "nombreEnteControl",
    label: "Nombre Ente de control",
    field: "nombreEnteControl",
    sortable: true,
  },
  { name: "marcacion", label: "Marcación", field: "marcacion", sortable: true },
  {
    name: "nombreMarcacion",
    label: "Nombre Marcación",
    field: "nombreMarcacion",
    sortable: true,
  },
  {
    name: "quejaExpres",
    label: "Queja Exprés",
    field: "quejaExpres",
    sortable: true,
  },
  {
    name: "nombreQuejaExpres",
    label: "Nombre Queja Exprés",
    field: "nombreQuejaExpres",
    sortable: true,
  },
  {
    name: "seguimientoError",
    label: "Seguimiento Error",
    field: "seguimientoError",
    sortable: true,
  },
];

const showPqrds = async () => {
  pqrds.value = true;
  pqrdRe.value = false;
  showInicio.value = false;
  superIntendencia.value = false;

  header.value = REPORTES_HEADER;
};

const showPqrdRechazado = async () => {
  pqrdRe.value = true;
  superIntendencia.value = false;
  pqrds.value = false;
  showInicio.value = false;

  header.value = REPORTES_HEADER_RECHAZADO;
};

const showSuperIntendencia = async () => {
  superIntendencia.value = true;
  pqrds.value = false;
  showInicio.value = false;

  header.value = REPORTES_HEADER_RECHAZADO;
};

const columns = ref(header);

const selectRows = (data) => {
  selectedRows.value = data;
};

onMounted(async () => {
  redirectTo.value = route.path.includes("public")
    ? "/public/PQRD/politicas"
    : "/politicas";
  // await getData();
  var dataCorreos = await sgdeaAxios.get("/usuarios/all/nombre_email");
  correosPositiva.value = dataCorreos.data.map((item) => ({
    label: item.usuarioEmail,
    value: item.usuarioEmail,
  }));
  optionsCorreos.value = correosPositiva.value;
});

const cancelarEnviarModal = () => {
  emailList.value = [];
  correo.value = "";
  inputFormat.value = "";
  sendReportModal.value = false;
};

function generalFilter(value) {
  if (!value) {
    tableDataPqrds.value = tableData.value;
    return;
  }

  tableDataPqrds.value = tableData.value.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(value.toLowerCase())
    )
  );
}

function generalFilterRe(value) {
  console.error(value);
  if (!value) {
    tableDataPqrdRe.value = tableDataRe.value;
    return;
  }

  tableDataPqrdRe.value = tableDataPqrdRe.value.filter((item) =>
    Object.values(item).some((val) =>
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

function csvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}
const lastErrorType = ref({ startDate: '', endDate: '' });

const onValidateDate = (
  type: 'start' | 'end',
  result: { type: string; data: boolean; reason?: string }
) => {
  const key = type === 'start' ? 'startDate' : 'endDate';

  if (result.data && checkValidDate(filter.value[key])) {
    errors.value[key] = '';
    lastErrorType.value[key] = '';
    return;
  }

  const reason = result.reason || 'invalid';
  const message =
    reason === 'invalid' || !checkValidDate(filter.value[key])
      ? 'El formato de la fecha no es válido o el año es menor a 2024.'
      : reason === 'after_today'
      ? 'La fecha no puede ser posterior a hoy.'
      : reason === 'before_minimum'
      ? 'La fecha inicial no puede ser más de 3 meses antes de la fecha final.'
      : 'Error de validación.';

  errors.value[key] = message;

  if (lastErrorType.value[key] !== message) {
    toast.error(message);
    lastErrorType.value[key] = message;
  }
};


watch(() => filter.value.startDate, (newVal) => {
  if (!checkValidDate(newVal)) {
    errors.value.startDate = 'Formato de fecha inválido.';
  } else {
    errors.value.startDate = '';
  }
});

watch(() => filter.value.endDate, (newVal) => {
  if (!checkValidDate(newVal)) {
    errors.value.endDate = 'Formato de fecha inválido.';
  } else {
    errors.value.endDate = '';
  }
});

const checkValidDate = (date: string) => {
  const parsed = moment(date, 'DD/MM/YYYY', true);
  return parsed.isValid() && parsed.year() >= 2024;
};

const downloadPqrdExcelReport = async (
  startDate: string,
  endDate: string,
  format: 'xlsx' | 'csv'
) => {
  // --- 1. Validaciones de fechas (esto no cambia) ---
  if (!startDate || !endDate) {
    toast.error('Debes seleccionar ambas fechas.');
    return;
  }

  const isStartValid = checkValidDate(startDate);
  const isEndValid = checkValidDate(endDate);

  if (!isStartValid || !isEndValid) {
    toast.error('Las fechas tienen un formato inválido.');
    if (!isStartValid) errors.value.startDate = 'Formato de fecha inválido.';
    if (!isEndValid) errors.value.endDate = 'Formato de fecha inválido.';
    return;
  }

  const parsedStart = moment(startDate, 'DD/MM/YYYY', true);
  const parsedEnd = moment(endDate, 'DD/MM/YYYY', true);
  const today = moment();

  if (parsedStart.isAfter(today) || parsedEnd.isAfter(today)) {
    toast.error('Las fechas no pueden ser posteriores a hoy.');
    return;
  }

  const minDate = parsedEnd.clone().subtract(3, 'months');
  if (parsedStart.isBefore(minDate)) {
    toast.error('La fecha inicial no puede ser más de 3 meses antes de la final.');
    return;
  }

  // --- 2. Preparación y llamada al nuevo API ---
  const formattedStart = parsedStart.format('YYYY-MM-DD');
  const formattedEnd = parsedEnd.format('YYYY-MM-DD');

  try {
    const url = `/reportes/gen/reporte-pqrd/${format}`;

    const response = await sgdeaAxios.get(
      url,
      {
        params: {
          fechaDesde: formattedStart,
          fechaHasta: formattedEnd,
        },
        responseType: 'blob'
      }
    );

    // --- 3. Lógica para descargar el archivo en el navegador ---
    const mimeType = format === 'csv'
      ? 'text/csv;charset=utf-8'
      : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    const extension = format === 'csv' ? 'csv' : 'xlsx';
    const blob = new Blob([response.data], { type: mimeType });

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = `reporte-pqrd-${formattedStart}_a_${formattedEnd}.${extension}`;

    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Error al descargar el archivo:', error);
    toast.error('Hubo un error al generar el archivo.');
  }
};


const exportCSV = () => {
  var dataFinal = tableData.value;
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

  const status = exportFile("reporte-tutelas.csv", content, "text/csv");

  if (status !== true) {
    toast.error("El navegador rechazó la descarga del archivo...");
  } else {
    toast.success("Archivo descargado con éxito!");
  }
};

const exportXLSX = () => {
  var dataFinal = tableData.value;
  let ws_data = [
    columns.value.map((col) => col.label),
    ...dataFinal.map((row) =>
      columns.value.map((col) => {
        let value =
          typeof col.field === "function"
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
    XLSX.writeFile(wb, "reporte-PQRD.xlsx");
    toast.success("Archivo descargado con éxito!");
  } catch (error) {
    toast.error("El navegador rechazó la descarga del archivo...");
  }
};

const filterFnCorreos = (val, update, abort) => {
  if (val.length < 1) {
    abort();
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    optionsCorreos.value = correosPositiva.value.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

const sendEmail = () => {
  sendReportModal.value = true;
};

const reportSuccess = async () => {
  if (await selectModal.value.validate()) {
    if (emailList.value.length > 0) {
      if (inputFormat.value == "xlsx") {
        //EXCEL
        var dataFinal =
          pqrdRe.value === true ? tableDataRe.value : tableData.value;
        let ws_data = [
          columns.value.map((col) => col.label),
          ...dataFinal.map((row) =>
            columns.value.map((col) => {
              let value =
                typeof col.field === "function"
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
          let binaryData = XLSX.write(wb, { type: "binary", bookType: "xlsx" });
          let data = new Uint8Array(binaryData.length);
          for (let i = 0; i != binaryData.length; ++i) {
            data[i] = binaryData.charCodeAt(i) & 0xff;
          }
          let blob = new Blob([data], { type: "application/octet-stream" });
          let file = new File([blob], `ListadoPQRD.xlsx`);
          const formdata = new FormData();
          formdata.append("email", emailList.value.join(","));
          formdata.append("archivo", file);
          const headers = {
            "Access-Control-Allow-Origin": "*",
            accept: "*",
            "Content-Type": "multipart/form-data",
            "Content-Transfer-Encoding": "BINARY",
          };
          var enviarCorreo = await sgdeaAxios.post("/pqrd/envioCSV", formdata, {
            headers,
          });
          if (enviarCorreo) {
            toast.success(
              `El reporte de PQRD ha sido enviado con éxito a los correos  ingresados.`
            );
            sendReportModal.value = false;
          }
        } catch (error) {
          toast.error(
            "Hubo un error al generar el archivo..."
          );
        }
      } else {
        ////CSV
        var dataFinal = tableData.value;
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
          let file = new File([blob], `ListadoPQRD.csv`);
          const formdata = new FormData();
          formdata.append("email", emailList.value[0]);
          formdata.append("archivo", file);
          const headers = {
            "Access-Control-Allow-Origin": "*",
            accept: "*",
            "Content-Type": "multipart/form-data",
            "Content-Transfer-Encoding": "BINARY",
          };
          var enviarCorreo = await sgdeaAxios.post("/pqrd/envioCSV", formdata, {
            headers,
          });
          if (enviarCorreo) {
            toast.success(
              `El reporte de PQRD ha sido enviado con éxito a los correos  ingresados.`
            );
            sendReportModal.value = false;
          }
        } catch (error) {
          toast.error(
            "Hubo un error al generar el archivo..."
          );
        }
      }
    } else {
      toast.error("Debe ingresar un correo electrónico válido para continuar");
    }
  } else {
    toast.error(
      "Para poder continuar con el proceso debe seleccionar un formato"
    );
  }
};
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
