<template>
  <section class="tw-px-5 tw-flex tw-flex-row tw-bg-bg">
    <main class="tw-w-full tw-p-7 tw-pt-0">
      <div class="tw-flex tw-justify-between tw-items-center">
        <span class="tw-font-bold tw-text-3xl tw-my-5">Cuentas de Cobro</span>
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
                    :options="optionsDependencias" dense outlined class="tw-rounded-lg">
                  </q-select>
                </span>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <span class="tw-w-full">
                  <label class="tw-text-label">Remitente</label>
                  <q-select v-model="filtro.remitente" :options="filteredOptionsRemitentes" emit-value
                    label="Seleccione" dense outlined class="tw-rounded-lg" @filter="selectOptionsFilterFn" use-input
                    :rules="[alphanumeric, (v) => maxLengthInput(15, v)]">
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay resultados
                        </q-item-section>
                      </q-item>
                    </template> </q-select>
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
              <q-btn label="Limpiar Filtros" color="accent" textColor="black" class="tw-rounded-lg col-2"
                @click="resetForm" />
              <q-btn label="Buscar" color="primary" class="tw-rounded-lg col-2" @click="searchItems" />
            </div>
          </q-card>
        </q-expansion-item>
      </q-card>

      <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat bordered>
        <div class="flex items-center justify-between q-px-md q-mb-sm row col-12">
          <span class="text-weight-bold text-h5" style="color: #2c3948">Listado de Cuentas de Cobro Radicadas</span>
        </div>
        <TableCuentasCobro class="full-width" :FACTURA_HEADER="FACTURA_RADICADA_HEADER"
          :TABLE_TOTAL_ROWS="dataTableTotalRows" :isLoading="loadingTable" :FACTURA_BODY="dataTable"
          @handlePageChange="handlePageChange" @handleRowsPerPageChange="handleRowsPerPageChange" @handle-edit="(props: any) => {
            const estado = props.estado.toLowerCase();

            if (estado === 'radicado' || estado == 'por asignar') {
              router.push('/facturacion/cuentas-cobro/radicadas/detalle/' + props.id);
            } else {
              router.push('/facturacion/cuentas-cobro/asignadas/detalle/' + props.id);
            }
          }" />
      </q-card>
    </main>
  </section>
</template>

<script lang="ts" setup>
import { Ref, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import moment from 'moment'
import { sgdeaAxios } from "src/services";
import { FACTURA_RADICADA_HEADER } from ".";
import { maxLengthInput, alphanumeric } from "src/helpers/validations";
import DatePicker from "src/components/FormFields/datePickerComponent.vue";
import { SelectInput } from "src/interfaces";
import TableCuentasCobro from "./Table.vue";
import { useAuthStore } from "src/stores/auth.store";
import { toast } from "src/helpers/toast";
import { formatDateWithTimeAndMeridiem } from "src/helpers/formtDate";

const auth = useAuthStore()
const router = useRouter();

const stateOptions = ref<SelectInput[]>([
  {
    value: "por asignar",
    label: "Por asignar",
  },
  {
    value: "en asignación",
    label: "En asignación",
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

const filtro = ref({
  sec: '',
  dependencia: '',
  remitente: '',
  fecha: '',
  estado: 'por aprobar',
  numeroDocumento: '',
});

const optionsDependencias = ref<SelectInput[]>([
  { label: 'GERENCIA JURÍDICA', value: 'GERENCIA JURÍDICA' },
  { label: 'OFICINA DE CONTROL DISCIPLINARIO', value: 'OFICINA DE CONTROL DISCIPLINARIO' },
  { label: 'OFICINA DE CONTROL INTERNO', value: 'OFICINA DE CONTROL INTERNO' },
  { label: 'OFICINA DE ESTRATEGIA Y DESARROLLO', value: 'OFICINA DE ESTRATEGIA Y DESARROLLO' },
  { label: 'OFICINA DE GESTIÓN INTEGRAL DE RIESGOS', value: 'OFICINA DE GESTIÓN INTEGRAL DE RIESGOS' },
  { label: 'OFICINA DE TECNOLOGÍAS DE LA INFORMACIÓN', value: 'OFICINA DE TECNOLOGÍAS DE LA INFORMACIÓN' },
  { label: 'PRESIDENCIA', value: 'PRESIDENCIA' },
  { label: 'SECRETARÍA GENERAL Y JURÍDICA', value: 'SECRETARÍA GENERAL Y JURÍDICA' },
]);

interface CuentaCobroDataTable {
  dependencia: string;
  responsable: string;
  tramite: string;
  recepcion: string;
  tipoDocumento: string;
  nroId: number;
  remitente: string;
  fechaHora: string;
  estado: string;
}

const optionsRemitentes = ref<SelectInput[]>([]);
const filteredOptionsRemitentes = ref<SelectInput[]>([]);
const dataTable: Ref<CuentaCobroDataTable[]> = ref([]);
const userDependenciasName = ref<string[]>([]);
const loadingTable = ref(false);
const dataTableTotalRows = ref(0);

onMounted(async () => {
  // @ts-expect-error
  await Promise.allSettled([
    getItems(0, 20),
    getDependencies(),
    getRemitente()
  ])
});

const getItems = async (page: number, size: number) => {
  try {
    loadingTable.value = true;
    const { data } = await sgdeaAxios.get<any>("/facturacion/getAllCto", {
      params: { page: page, size: size, sort: "asc" }
    });

    let mappedAndSorted = filterByRole(data.content).map((item) => {
      return {
        ...item,
        id: item.idCto,
        dependencia: item.dependencia,
        tramite: "Cuentas de Cobro",
        recepcion: item.canal,
        tipoDocumento: item.tipoDocumento,
        numeroDocumento: item.numeroDocumento,
        remitente: item.aprobador,
        fecha_hora : formatDateWithTimeAndMeridiem(item.fecha),
        estado: item.estado,
      }
    }).sort((a, b) => {
      const firstDate = new Date(a.fecha);
      const secondDate = new Date(b.fecha);
      const currentDate = new Date();

      if (a.estado.toLowerCase() === 'por asignar') {
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
    if (auth.$state.userInfo.role === "Administrador Master" || auth.$state.userInfo.role === "Aprobador" || auth.$state.userInfo.role === "Asignador Responsable") {
      dataTable.value = mappedAndSorted
    }
    else {
      dataTable.value = mappedAndSorted.filter((item) => {
        return userDependenciasName.value.includes(item.dependencia)
      })
    }

    dataTableTotalRows.value = data.totalPages
    loadingTable.value = false;
  } catch (error) {
    toast.error("Ha ocurrido un error al momento de traer datos de los casos")
    loadingTable.value = false;
  }
};

async function getRemitente() {
  try {
    const remitentes = await sgdeaAxios.get<any[]>("/facturacion/getListVendeCto?start=0&end=200");

    optionsRemitentes.value = remitentes.data.map((item) => {
      return {
        label: item.cedula,
        value: item.cedula,
      };
    });
  } catch (error) {
    console.error(error)
  }
}

async function getDependencies() {
  try {
    const { data } = await sgdeaAxios.get('/seccionSubSeccion')
    optionsDependencias.value = data.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((dependencia: any) => ({
      label: dependencia.nombre,
      value: dependencia.nombre
    }))
    const dependenciasIds = auth.$state.userInfo.relations.map(relation => relation.dependencia);

    userDependenciasName.value = dependenciasIds;
  } catch (error) {
    toast.error("Ha ocurrido un error al cargar las dependencias")
  }
}

const searchItems = async () => {
  if (Object.values(filtro.value).every(val => !val)) {
    toast.error('Por favor, seleccione al menos un filtro.')
    return;
  }

  // const entries = Object.entries(filtro.value);

  // let filteration = filterByRole(originalData.value).map((item) => {
  //   return {
  //     ...item,
  //     id: item.idCto,
  //     dependencia: item.dependencia,
  //     tramite: "Cuentas de Cobro",
  //     recepcion: item.canal,
  //     tipoDocumento: item.tipoDocumento,
  //     numeroDocumento: item.numeroDocumento,
  //     remitente: item.aprobador,
  //     fecha_hora: item.fechaFormateada,
  //     estado: item.estado,
  //   }
  // });

  // entries.forEach(([key, val]) => {
  //   if (val) {
  //     if (key == 'estado') {
  //       filteration = filteration.filter((x) => x[key].toLowerCase() == val);
  //     } else if (key == 'dependencia') {
  //       filteration = filteration.filter((x) => x[key].toLowerCase() === val.toLowerCase());
  //     } else if (key == 'remitente') {
  //       filteration = filteration.filter((x) => {
  //         return x.numeroDocumento == val
  //       });

  //     } else if (key == 'fecha') {
  //       filteration = filteration.filter((x) =>
  //         x.fecha_hora.includes(val)
  //       ).map((item) => ({
  //         ...item, fecha_hora: item.fechaFormateada
  //       }));;
  //     } else if (key == 'numeroDocumento') {
  //       filteration = filteration.filter((x) =>
  //         x[key] == val
  //       );
  //     } else {
  //       filteration = filteration.filter((x) =>
  //         x[key].toLowerCase().includes(val.toLowerCase())
  //       );
  //     }
  //   }
  // });
  // dataTable.value = filteration;
};

function filterByRole(data: any[]) {
  switch (auth.$state.userInfo.role.toLowerCase()) {
    case 'admin':
      return data;
    case 'gestionador':
      return data.filter((item) => item.estado.toLowerCase() == 'para gestión');
    case 'aprobador':
      filtro.value.estado = stateOptions.value[4] as any
      return data.filter((item) => item.estado.toLowerCase() == 'por aprobar');
    case 'asignador responsable':
      filtro.value.estado = stateOptions.value[0] as any;
      return data = data.filter((item) => item.estado.toLowerCase() == 'por asignar' || item.estado.toLowerCase() == 'en asignación');
    default:
      return data;
  }
}

const resetForm = () => {
  filtro.value = {
    estado: '',
    fecha: '',
    sec: '',
    dependencia: '',
    remitente: '',
    numeroDocumento: '',
  };
  getItems(0, 20);
};

const handlePageChange = async (event) => {
  await getItems(event.page - 1, event.rowsPerPage);
}

const handleRowsPerPageChange = async (event: any) => {
  await getItems(event.page, event.rowsPerPage);
}

const selectOptionsFilterFn = (val: string, update: any) => {
  update(() => {
    if (val === '') {
      filteredOptionsRemitentes.value = optionsRemitentes.value;
    } else {
      const needle = val.toLowerCase();
      filteredOptionsRemitentes.value = optionsRemitentes.value.filter((i) => {
        // Convertir tanto el valor de búsqueda como la etiqueta a string para la comparación
        return i.label.toString().toLowerCase().includes(needle);
      });
    }
  });
}

</script>
