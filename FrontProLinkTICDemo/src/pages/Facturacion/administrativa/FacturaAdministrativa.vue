<template>
  <div class="q-my-md">
    <div class="tw-flex tw-justify-between tw-items-center">
      <span class="tw-font-bold tw-text-3xl tw-my-5">Facturas Administrativas</span>
    </div>

    <q-card class="tw-rounded-xl tw-p-4" flat bordered>
      <q-expansion-item default-opened>
        <template v-slot:header>
          <div class="col row">
            <b class="tw-text-lg">Filtrar por</b>
          </div>
        </template>

        <q-card>
          <div class="row q-col-gutter-md q-pb-md q-px-md">
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <span class="tw-w-full">
                <label class="tw-text-label">Número de Radicado</label>
                <q-input v-model="filtro.sec" label="Inserte" dense outlined class="tw-rounded-lg"
                  :rules="[alphanumeric, (v) => maxLengthInput(18, v)]" />
              </span>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <span class="tw-w-full">
                <label class="tw-text-label">Dependencia</label>
                <q-select v-model="filtro.dependencia" input-debounce="0" label="Seleccione"
                  :options="dependenciaOptions" dense outlined class="tw-rounded-lg">
                </q-select>
              </span>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <span class="tw-w-full">
                <label class="tw-text-label">Remitente</label>
                <q-select v-model="filtro.remitente" :options="filteredOptionsRemitentes" emit-value label="Seleccione"
                  dense outlined class="tw-rounded-lg" @filter="selectOptionsFilterFn" use-input>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No hay resultados
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </span>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <span class="tw-w-full">
                <label class="tw-text-label"> Fecha de Radicado </label>

                <DatePicker mask="DD/MM/YYYY" label="dd / mm / yyyy" v-model:input-data-prop="filtro.fecha"
                  :options="(date) => date <= moment().format('YYYY/MM/DD')" />
              </span>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <span class="tw-w-full">
                <label class="tw-text-label">Estado</label>
                <q-select v-model="filtro.estado" input-debounce="0" label="Seleccione" :options="stateOptions" dense
                  outlined class="tw-rounded-lg">
                </q-select>
              </span>
            </div>
          </div>

          <div class="row tw-flex tw-justify-center tw-gap-6 [&>*]:tw-p-2">
            <q-btn label="Limpiar filtros" color="accent" textColor="black" class="tw-rounded-lg col-2"
              @click="resetForm" />
            <q-btn label="Buscar" color="primary" class="tw-rounded-lg col-2" @click="search" />
          </div>
        </q-card>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat bordered>
      <div class="flex items-center justify-between q-px-md row col-12">
        <span class="text-weight-bold text-h6" style="color: #2c3948">Listado de Facturas Radicadas</span>
      </div>
      <TableFacturasAdministrativas class="full-width" :FACTURA_HEADER="FACTURA_HEADER" :FACTURA_BODY="filteredDataTable"
        :TABLE_TOTAL_ROWS="dataTableTotalRows" @handlePageChange="handlePageChange"
        @handleRowsPerPageChange="handleRowsPerPageChange" />
    </q-card>
  </div>
</template>

<script setup lang="ts">
import DatePicker from "src/components/FormFields/datePickerComponent.vue";
import { alphanumeric, maxLengthInput } from "src/helpers/validations";
import { Facturacion, SelectInput } from "src/interfaces";
import TableFacturasAdministrativas from "./Table.vue";
import { tipoDocumento } from "src/constantes/options";
import { useAuthStore } from "src/stores/auth.store";
import { FACTURA_HEADER, Filtro } from ".";
import { onMounted, Ref, ref } from "vue";
import { sgdeaAxios } from "src/services";
import moment from "moment";
import { toast } from "src/helpers/toast";

const auth = useAuthStore();
const optionsRemitentes = ref<SelectInput[]>([]);
const filteredOptionsRemitentes = ref<SelectInput[]>([]);
const userDependenciaName = ref<string[]>([]);
const dataTable: Ref<Facturacion[]> = ref([]);
const filteredDataTable: Ref<Facturacion[]> = ref([]);
const dataTableTotalRows = ref(0);
const loadingTable = ref(false);

const dependenciaOptions = ref<SelectInput[]>([
  { label: "GERENCIA JURÍDICA", value: "GERENCIA JURÍDICA" },
  {
    label: "OFICINA DE CONTROL DISCIPLINARIO",
    value: "OFICINA DE CONTROL DISCIPLINARIO",
  },
  { label: "OFICINA DE CONTROL INTERNO", value: "OFICINA DE CONTROL INTERNO" },
  {
    label: "OFICINA DE ESTRATEGIA Y DESARROLLO",
    value: "OFICINA DE ESTRATEGIA Y DESARROLLO",
  },
  {
    label: "OFICINA DE GESTIÓN INTEGRAL DE RIESGOS",
    value: "OFICINA DE GESTIÓN INTEGRAL DE RIESGOS",
  },
  {
    label: "OFICINA DE TECNOLOGÍAS DE LA INFORMACIÓN",
    value: "OFICINA DE TECNOLOGÍAS DE LA INFORMACIÓN",
  },
  { label: "PRESIDENCIA", value: "PRESIDENCIA" },
  {
    label: "SECRETARÍA GENERAL Y JURÍDICA",
    value: "SECRETARÍA GENERAL Y JURÍDICA",
  },
]);

const stateOptions = ref<SelectInput[]>([
  {
    value: "por asignar",
    label: "Por asignar",
  },
  {
    value: "para gestión",
    label: "Para gestión",
  },
  {
    value: "gestión rechazada",
    label: "Gestión rechazada",
  },
  {
    value: "por aprobar",
    label: "Por aprobar",
  },
  {
    value: "rechazado",
    label: "Aprobación rechazada",
  },
  {
    value: "aprobado",
    label: "Aprobado",
  },
]);

const filtro = ref<Filtro>({
  sec: "",
  dependencia: "",
  remitente: "",
  fecha: "",
  estado: "",
  numeroDocumento: "",
});

onMounted(async () => {
  // @ts-expect-error
  await Promise.allSettled([
    getData(0, 20),
    getDependencies(),
    getRemitente(),
  ])
});

const getData = async (page: number, size: number) => {
  try {
    loadingTable.value = true;
    const resp = await sgdeaAxios.get("/facturacion/getall", {
      params: { page: page, size: size }
    });

    dataTable.value = filterByRole(resp.data?.content).map((item) => ({
      ...item,
      fecha_hora: moment(item.fechaFormateada, "DD/MM/YYYY hh:mm:ss a").format(
        "DD/MM/YYYY HH:mm:ss"
      ),
      tipoDocumento:
        tipoDocumento.find((doc) => doc.value == item.tipoDocumento)?.label ??
        item.tipoDocumento,
      nombreRemitente:
        item.tipoDocumento.includes("NIT") && item?.razonSocial !== null
          ? item.razonSocial
          : `${item?.primerNombre ?? ""} ${item.otrosNombres ?? ""} ${item?.primerApellido ?? ""
          } ${item?.segundoApellido ?? ""}`,
    })).sort((a, b) => {
      const firstDate = new Date(a.fecha);
      const secondDate = new Date(b.fecha);
      const currentDate = new Date();

      if (a.estado.toLowerCase() === "por asignar") {
        const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
        const timeDifference = currentDate.getTime() - firstDate.getTime();

        if (timeDifference > oneDay) {
          return -1;
        } else {
          return 1;
        }
      }

      return firstDate > secondDate ? 1 : -1;
    });

    if (auth.$state.userInfo.role === "Administrador Master" || auth.$state.userInfo.role === "Aprobador") {
      filteredDataTable.value = dataTable.value;
    }
    else {
      filteredDataTable.value = dataTable.value.filter((item) => {
        return userDependenciaName.value.includes(item.dependencia)
      })
    }

    dataTableTotalRows.value = resp.data.totalPages
  } catch (error) {
    toast.error("Ha ocurrido un error al cargar los registros de la tabla")
    loadingTable.value = false;
  }
};

async function getDependencies() {
  try {
    const { data } = await sgdeaAxios.get("/seccionSubSeccion");
    dependenciaOptions.value = data.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((dependencia: any) => ({
      label: dependencia.nombre,
      value: dependencia.nombre,
    }));

    const dependenciasIds = auth.$state.userInfo.relations.map(relation => relation.dependencia);
    userDependenciaName.value = dependenciasIds;
  } catch (error) {
    toast.error("Ocurrió un error al cargar las dependencias")
  }
}

async function getRemitente() {
  try {
    const remitentes = await sgdeaAxios.get<any[]>(
      "/facturacion/getListVende?start=0&size=100"
    );

    optionsRemitentes.value = remitentes.data.map((item) => {
      return {
        label: item.cedula,
        value: item.cedula,
      };
    });
  } catch (error) {
    toast.error("Ocurrió un error al cargar la lista de remitentes")
  }
}

const filterByRole = (data) => {
  const role = auth.$state.userInfo.role.toLowerCase();
  const roleFilters = {
    "administrador de trámite": () => data,
    "administrador master": () => data,
    "gestionador": () => data.filter(item => ["para gestión", "retenido"].includes(item.estado.toLowerCase())),
    "aprobador": () => data.filter(item => item.estado.toLowerCase() === "por aprobar"),
    "asignador responsable": () => data.filter(item => ["por asignar", "en asignación"].includes(item.estado.toLowerCase())),
  };

  return roleFilters[role] ? roleFilters[role]() : [];
};

const resetForm = () => {
  filtro.value = {
    sec: "",
    dependencia: "",
    remitente: "",
    fecha: "",
    estado: "",
    numeroDocumento: "",
  };
  getData(0, 20);
};

const search = async () => {
  if (Object.values(filtro.value).every((val) => !val)) {
    toast.error('Por favor, seleccione al menos un filtro.')
    return;
  }

  // const filteration = originalData.value.filter(item => applyFilters(item));
  // filteredDataTable.value = filteration;
  await getData(0, 20);
}

// const applyFilters = (item) => {
//   return Object.entries(filtro.value).every(([key, val]) => {
//     if (!val) return true;

//     if (key === "estado") {
//       return item[key].toLowerCase() === val.toLowerCase();
//     } else if (key === "dependencia") {
//       return item[key].toLowerCase() === val.toLowerCase();
//     } else if (key === "remitente") {
//       return item.numeroDocumento === val;
//     } else if (key === "numeroDocumento") {
//       return item[key] === val;
//     } else if (key === "fecha") {
//       return moment(item.fechaFormateada, "DD/MM/YYYY HH:mm").format("DD-MM-YYYY") === val;
//     } else {
//       return item[key].toLowerCase().includes(val.toLowerCase());
//     }
//   });
// };

const handlePageChange = async (event) => {
  await getData(event.page - 1, event.rowsPerPage);
}

const handleRowsPerPageChange = async (event: any) => {
  await getData(event.page, event.rowsPerPage);
}

const selectOptionsFilterFn = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      filteredOptionsRemitentes.value = optionsRemitentes.value;
    });
    return;
  }
  update(() => {
    filteredOptionsRemitentes.value = optionsRemitentes.value.filter(
      (option) => {
        return Number(option.value) == Number(val);
      }
    );
  });
};

</script>