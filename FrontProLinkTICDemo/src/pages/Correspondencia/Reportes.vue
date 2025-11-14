<template>
  <div class="q-my-md">
    <div class="tw-flex tw-justify-between tw-items-center">
      <span class="tw-font-bold tw-text-3xl tw-my-5">
        Reportes Usuarios
      </span>
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
            <span class="text-weight-bold">Fecha Inicial</span>
            <q-input
              :rules="[]"
              name="fechaInicial"
              outlined
              label="dd/mm/yyyy"
              v-model="filtro.fechaInicial"
              dense
              mask="##/##/####"
            >
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

          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Fecha Final </span>
            <q-input
              :rules="[]"
              name="fechaFinal"
              outlined
              label="dd/mm/yyyy"
              v-model="filtro.fechaFinal"
              dense
              mask="##/##/####"
            >
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

          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Estado</span>
            <q-select
              :rules="[]"
              name="estado"
              outlined
              v-model="filtro.estado"
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

          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="text-weight-bold">Oficina</span>
            <q-select
              :rules="[]"
              name="oficina"
              outlined
              label="Seleccione"
              dense
              map-options
              v-model="filtro.oficina"
              emit-value
              :options="optionsOficinas"
            />
          </div>
        </div>

        <div class="tw-flex tw-justify-center tw-items-center tw-my-5 tw-gap-6">
          <q-btn
            label="Limpiar Filtros"
            type="reset"
            style="width: 240px"
            text-color="black"
            color="accent"
            @click="cleanFilters"
            class="tw-rounded-xl tw-h-12"
          />

          <q-btn
            type="submit"
            label="Buscar"
            text-color="white"
            style="width: 240px"
            color="primary"
            @click="getData"
            class="tw-rounded-xl tw-h-12 tw-p-2"
          />
        </div>
      </q-expansion-item>
    </q-card>

    <q-card
      v-if="filteredDataTable.length > 0 || (search && search.trim() !== '')"
      class="tw-rounded-xl q-mt-lg tw-p-5"
      flat
      bordered
    >
      <div class="flex items-center justify-between q-px-md q-mb-sm row col-12">
        <span class="text-weight-bold text-h6" style="color: #2c3948"
          >Listado de registros</span
        >

        <div class="tw-flex tw-items-center tw-gap-10">
          <q-input
            outlined
            dense
            rounded
            v-model="search"
            label="Buscador"
            class="tw-w-[300px]"
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
                      <q-img
                        v-lazy
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
              label="Enviar Correo"
              style="width: 150px; height: 30px; border-radius: 8px"
              no-caps
              icon="send"
              @click="sendEmail"
            />
          </div>
        </div>
      </div>
      <TableReporte
        key-id="codigoUsuario"
        :buscar="buscar"
        class="full-width"
        :TABLE_TOTAL_ROWS="dataTableTotalRows"
        :TABLE_TOTAL_PAGES="dataTableTotalPages"
        :TABLE_HEADER="columns"
        :TABLE_BODY="filteredDataTable"
        select="multiple"
        @update:itemSelected="selectRows"
        :msg-no-data="noDataMessage ? 'No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente' : ''"
        @update:filas="getPageFilas"
        @update:pages="getPageFilas"
        @handlePageChange="handlePageChange"
        @handleRowsPerPageChange="handleRowsPerPageChange"
        :pagination-message="customMessageTableResults"
      />
    </q-card>
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
              Enviar reporte al correo
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
                  { value: 'xlsx', label: 'XLS / Excel' },
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
                          @input-value="v => correo = v"
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
                      <q-btn
                        icon="close"
                        flat
                        v-on:click="deleteEmail(email)"
                      />
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
  </div>
</template>

<script setup lang="ts">
import { inputRequired } from "src/helpers/validations";
import TableReporte from "../SGDA/ClasificacionDocumental/Tutelas/TableReporte.vue";
import { ref } from "vue";
import excel from "../../assets/excel.svg";
import csv from "../../assets/csv.svg";
import mail from "../../assets/mail.svg";
import Modal from "src/components/Modal/Modal.vue";
import { toast } from "src/helpers/toast";
import { sgdeaAxios } from "src/services";
import { onMounted } from "vue";
import { formatDateTimeStand } from "src/helpers/formtDate";
import { exportFile } from "quasar";
import * as XLSX from "xlsx";
import LoadingModal from "src/components/Modal/LoadingModal.vue";
import moment from "moment";
import { useAuthStore } from "src/stores/auth.store";
import { watch } from "vue";

const REPORTES_HEADER = [
  {
    name: "codigoUsuario",
    label: "Código del Usuario",
    field: "codigoUsuario",
    sortable: true,
  },
  {
    name: "tipoUsuario",
    label: "Tipo Usuario",
    field: "tipoUsuario",
    sortable: true,
    align: "center",
  },
  {
    name: "tipoDocumento",
    label: "Tipo Documento",
    field: row => row.tipoDocumento || "-",
    sortable: true,
    align: "center",
  },
  {
    name: "numeroDocumento",
    label: "Número de Documento de Identificación",
    field: "numeroDocumento",
    sortable: true,
    align: "center",
  },
  {
    name: "nombreApellidos",
    label: "Nombre y Apellidos",
    field: "nombreApellidos",
    sortable: true,
    align: "center",
  },
  {
    name: "correoElectronico",
    label: "Correo Electrónico",
    field: "correoElectronico",
    sortable: true,
    align: "center",
  },

  {
    name: "cargo",
    label: "Cargo",
    field: "cargo",
    sortable: true,
    align: "center",
  },
  {
    name: "oficina",
    label: "Oficina",
    field: "oficina",
    sortable: true,
    align: "center",
  },
  {
    name: "oficinaEstado",
    label: "Oficina - Estado",
    field: row => row.oficinaEstado || "-",
    sortable: true,
    align: "center",
  },
  {
    name: "perfil",
    label: "Perfil",
    field: "perfil",
    sortable: true,
    align: "center",
  },
{
  name: "correoCertificadoGestionador",
  label: "Correo Certificado (Gestionador) Sí/No",
  field: row => row.correoCertificadoGestionador === true ? "Sí" : "No",
  sortable: true,
  align: "center",
},
  {
    name: "consolida",
    label: "Consolida",
    field: "consolida",
    sortable: true,
    align: "center",
  },
  {
    name: "punto",
    label: "Punto",
    field: row => row.punto || "-",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaCreacionUsuario",
    label: "Fecha Creacin Usuario",
    field: (row) => row.fechaCreacionUsuario,
    sortable: true,
    align: "center",
  },
  {
    name: "mesCreacionUsuario",
    label: "Mes Creación de Usuario",
    field: "mesCreacionUsuario",
    sortable: true,
    align: "center",
  },
  {
    name: "ultimaFechaAcceso",
    label: "Última Fecha Acceso",
    field: (row) => row.ultimaFechaAcceso || '-',
    sortable: true,
    align: "center",
  },
  {
    name: "estado",
    label: "Estado",
    field: "estado",
    sortable: true,
    align: "center",
  },
  {
    name: "causaUltimaInactivacion",
    label: "Causa de Última Inactivación",
    field: row => row.causaUltimaInactivacion || "-",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaUltimaInactivacion",
    label: "Fecha de Última  Inactivación",
    field: (row) => row.fechaUltimaInactivacion,
    sortable: true,
    align: "center",
  },
  {
    name: "ultimaModificacion",
    label: "Última Modificación",
    field: (row) => row.ultimaModificacion,
    sortable: true,
    align: "center",
  },
  {
    name: "fechaModificacion",
    label: "Fecha de la Modificación",
    field: (row) => row.fechaModificacion,
    sortable: true,
    align: "center",
  },
  {
    name: "usuarioModificacion",
    label: "Usuario Modificación",
    field: row => row.usuarioModificacion || "-",
    sortable: true,
    align: "center",
  },
];
const dataTableTotalPages = ref();
const dataTableTotalRows = ref();
const filteredDataTable = ref([]);
const columns = ref(REPORTES_HEADER);

const search = ref('');
const auth = useAuthStore();

const reportModal = ref(false);
const sendReportModal = ref(false);
const confirmCancelarModalEnvioCorreo = ref(false);

const inputFormat = ref("");
const emailList = ref([]);
const emailForm = ref();
const correo = ref(auth.$state.userInfo.email);
const correosPositiva = ref([]);
const oficinas = ref([]);
const selectModal = ref();
const customMessageTableResults = ref("")

const selectedRows = ref([]);
const optionsCorreos = ref([]);
const optionsOficinas = ref([])
const facData = ref([]);
const currPage = ref(0);
const pageSize = ref(100000);

const noDataMessage = ref(false);


let buscar = ref("");

const filtro = ref<IFiltros>({
  oficina: "",
  estado: "",
  fechaInicial: "",
  fechaFinal: "",
});

function csvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

const exportCSV = () => {
  const dataFinal =
    selectedRows.value.length > 0 ? selectedRows.value : facData.value;
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

  const fileName = `Listado_usuarios_${formatDateTimeStand(new Date())}.csv`;
  const status = exportFile(fileName, content, "text/csv");

  if (status !== true) {
    toast.error("El navegador rechazó la descarga del archivo.");
  } else {
    toast.success("Archivo descargado con éxito!");
  }
};

const exportXLSX = () => {
  const dataFinal =
    selectedRows.value.length > 0
      ? selectedRows.value
      : filteredDataTable.value;

  let ws_data = [
    columns.value.map((col) => col.label),
    ...dataFinal.map((row) =>
      columns.value.map((col) => {
        let value =
          typeof col.field === "function"
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field];

        if (col.format && typeof col.format === "function") {
          value = col.format(value);
        }
        return value;
      })
    ),
  ];

  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Usuarios");

  try {
    XLSX.writeFile(
      wb,
      `Listado_usuarios_${formatDateTimeStand(new Date())}.xlsx`
    );
    toast.success("Archivo descargado con éxito!");
  } catch (error) {
    toast.error(
      "El navegador rechazó la descarga del archivo. Por favor, intente nuevamente."
    );
  }
};

const sendEmail = () => {
  sendReportModal.value = true;
};

const handleRowsPerPageChange = async (rowsPerPage: any) => {
  pageSize.value = rowsPerPage;
  await getData();
};

const handlePageChange = async (page: number) => {
  currPage.value = page <= 0 ? 0 : page - 1;
  await getData();
};

const opForFinal = (date) => {
  if (!filtro.value.fechaInicial) {
    // Si no hay fecha inicial seleccionada, deshabilitar todas las fechas
    return false;
  }

  const inicial = moment(filtro.value.fechaInicial, 'DD/MM/YYYY').format('YYYY/MM/DD');
  const today = moment().format('YYYY/MM/DD');

  // Habilitar fechas desde la fecha inicial hasta hoy
  return date >= inicial && date <= today;
}

const selectRows = (data) => {
  selectedRows.value = data;

};

const getPageFilas = async (filas = 20, page = 0) => {

};

const generalFilter = () => {

  if (!search.value || search.value.trim() === '') {
    filteredDataTable.value = facData.value;
    noDataMessage.value = false;
  } else {
    const filteredData = facData.value.filter((obj) => {
      // Obtener todos los valores del objeto
      const valores = Object.values(obj);
      let concatArray = [];

      // Concatenar valores de objetos anidados
      valores.forEach((element) => {
        if (typeof element === 'object' && element !== null) {
          concatArray = [...concatArray, ...Object.values(element)];
        }
      });

      // Crear un array con todos los valores, incluyendo los anidados
      const allValues = [...valores, ...concatArray];

      // Verificar si alguno de los valores contiene el término de búsqueda
      return allValues.some((valor) => {
        if (valor !== null) {
          const cleanedValue = valor
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s\s+/g, ' '); // Reemplaza espacios dobles por un solo espacio
          return cleanedValue.includes(search.value.toLowerCase());
        }
        return false;
      });
    });

    if (filteredData.length > 0) {
      filteredDataTable.value = filteredData; // Mostrar los datos filtrados
      noDataMessage.value = false; // No mostrar mensaje de error
    } else {
      filteredDataTable.value = []; // Limpiar la tabla si no hay datos
      noDataMessage.value = true; // Mostrar mensaje de error
    }
  }
};

const cancelarEnviarModal = () => {
  emailList.value = [];
  correo.value = "";
  inputFormat.value = "";
  sendReportModal.value = false;
};

const deleteEmail = (email) => {
  emailList.value = emailList.value.filter((item) => item != email);
};

const addEmail = async () => {
  if (await emailForm.value.validate()) {
    if (emailList.value.includes(correo.value.label || correo.value)) {
      toast.error("El correo ingresado ya se encuentra en la lista");
    } else {
      emailList.value.push(correo.value.label || correo.value);
      correo.value = "";
      emailForm.value.reset();
    }
  }
};

const reportSuccess = async () => {
  if (await selectModal.value.validate()) {
    if (emailList.value.length > 0) {
      let dataFinal =
        selectedRows.value.length > 0 ? selectedRows.value : facData.value;
      let tipoReporte = inputFormat.value === "xlsx" ? 2 : 1; // 1 para CSV, 2 para XLSX

      if (inputFormat.value === "xlsx" || inputFormat.value === "csv") {
        try {
          let file, contentType, filename, content;

          if (inputFormat.value === "xlsx") {
            // Generar archivo Excel
            let ws_data = [
              columns.value.map((col) => col.label),
              ...dataFinal.map((row) =>
                columns.value.map((col) => {
                  let value =
                    typeof col.field === "function"
                      ? col.field(row)
                      : row[col.field === void 0 ? col.name : col.field];
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
            let binaryData = XLSX.write(wb, {
              type: "binary",
              bookType: "xlsx",
            });
            let data = new Uint8Array(binaryData.length);
            for (let i = 0; i < binaryData.length; ++i) {
              data[i] = binaryData.charCodeAt(i) & 0xff;
            }
            let blob = new Blob([data], { type: "application/octet-stream" });
            file = new File(
              [blob],
              `Listado Reporte ${new Date().toLocaleString()}.xlsx`
            );
            contentType = "application/octet-stream";
            filename = `Listado Reporte ${new Date().toLocaleString()}.xlsx`;
          } else if (inputFormat.value === "csv") {
            // Generar archivo CSV
            content = [
              columns.value.map((col) =>
                csvValue(col.label, undefined, undefined)
              ),
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

            let blob = new Blob([content], { type: "text/csv" });
            file = new File(
              [blob],
              `Listado Reporte ${new Date().toLocaleString()}.csv`
            );
            contentType = "text/csv";
            filename = `Listado Reporte ${new Date().toLocaleString()}.csv`;
          }



          const response = await sgdeaAxios.post(
            `/usuarios/enviar-reporte`,
            {
  fechaInicial: filtro.value.fechaInicial,
  fechaFinal:filtro.value.fechaFinal,
  estado: filtro.value.estado,
  tipo: tipoReporte,
  correos:emailList.value,

  oficinaId: filtro.value.oficina
}
          );
          if (response) {
            toast.success(
              `El reporte ha sido enviado con éxito a los correos ingresados.`
            );
            sendReportModal.value = false;
          }
        } catch (error) {
          toast.error('Hubo un error al generar el archivo...')
        }
      } else {
        toast.error(
          "Debe seleccionar un formato válido (xlsx o csv) para continuar"
        );
      }
    } else {
      toast.error(
        "Debe ingresar al menos un correo electrónico válido para continuar"
      );
    }
  } else {
    toast.error(
      "Por favor complete todos los campos obligatorios antes de continuar"
    );
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

const cleanFilters = async () => {
  for (let key in filtro.value) {
    filtro.value[key] = "";
  }
  selectedRows.value.length = 0;
  search.value = "";
};

const getData = async () => {
  try {
    // Define el mapeo entre las propiedades de filtro.value y los parámetros de la URL
    const paramMapping = {
      fechaInicial: "fechaInicial",
      fechaFinal: "fechaFinal",
      estado: "estado",
      oficina: "oficinaId",
    };

    // Construir los parámetros dinámicamente
    let params = [];
    Object.keys(paramMapping).forEach((key) => {
      // Verifica que el valor existe y no está vacío
      if (filtro.value[key].value) {
        params.push(`${paramMapping[key]}=${encodeURIComponent(filtro.value[key].label)}`);
      }else if (filtro.value[key]){
        params.push(`${paramMapping[key]}=${encodeURIComponent(filtro.value[key])}`);
      }
    });

    // Construir la URL con los parámetros
    let url = `/usuarios/reporte?size=${pageSize.value}&page=${currPage.value}`;

    if (params.length) {
      url += `&${params.join('&')}`;
    }



    // Realizar la solicitud GET
    const response = await sgdeaAxios.get(url);

    // Actualizar los valores de la tabla con la respuesta
    facData.value = response.data.elementos || response.data.content;
    dataTableTotalRows.value = response.data.totalElements;
    customMessageTableResults.value =  response?.data?.paginationMessage;
    dataTableTotalPages.value = response.data.totalPages;

    // Ordenar los datos
    var filter = facData.value.sort(
      (a, b) =>
        new Date(a.fechaInicial) - new Date(b.fechaFinal)
    );


    filteredDataTable.value = filter;
  } catch (error) {
    toast.error("Error al buscar datos. Por favor, intente nuevamente.");
  }
};

watch(search, () => {
  generalFilter();
});

onMounted(async () => {
  var dataCorreos = await sgdeaAxios.get("/usuarios/all/nombre_email");
  const response = await sgdeaAxios.get("/oficinas/all");

  oficinas.value = response.data.map((oficina: any) => ({
    value: oficina.id,
    label: oficina.nombre,
  }));

  correosPositiva.value = dataCorreos.data.map((item) => ({
    label: item.usuarioEmail,
    value: item.usuarioEmail,
  }));

  optionsCorreos.value = correosPositiva.value;
  optionsOficinas.value = oficinas.value
});
</script>
