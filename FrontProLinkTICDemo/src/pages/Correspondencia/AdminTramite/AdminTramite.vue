<template>
  <main>
    <div class="q-pb-md q-px-md tw-mt-5">
      <div class="col row">
        <h3 class="pl-4 tw-font-bold tw-text-3xl tw-mt-5 tw-mb-3 text-bold">
          Administración del trámite
        </h3>
      </div>
      <q-card class="tw-px-4 tw-pt-2 tw-pb-4 tw-rounded-xl" flat>
        <div class="col-6">
          <label class="q-px-md tw-text-label">
            Campo de búsqueda *
            <q-select
              dense
              v-model="formData.campoDeBusqueda"
              :options="campoDeBusquedaOptions"
              label="Seleccione"
              emit-value
              map-options
              outlined
              @update:model-value="handlSearchChange"
              :rules="[inputRequired]"
              :error="formErrors.campoDeBusqueda"
              :error-message="'Debe ser seleccionada una opción'"
            />
          </label>
        </div>
        <div v-if="validateForm">
          <div class="row" v-if="formData.campoDeBusqueda === '1'">
            <div class="col-4 q-px-md">
              <label class="q-px-md tw-text-label">
                Perfil *
                <q-select
                  dense
                  v-model="formData.perfil"
                  :options="perfilOptions"
                  label="Seleccione"
                  emit-value
                  map-options
                  outlined
                  :rules="[inputRequired]"
                  :error="formErrors.perfil"
                  :error-message="'Debe ser seleccionada una opción'"
                  @update:model-value="handleRolChange"
                />
              </label>
            </div>
            <div class="col-4 q-px-md">
              <label class="q-px-md tw-text-label">
                Estado *
                <q-select
                  dense
                  v-model="formData.estado"
                  :options="estadoOptions"
                  label="Seleccione"
                  emit-value
                  map-options
                  outlined
                  :rules="[inputRequired]"
                  @update:model-value="handleEstadoChange"
                  :error="formErrors.estado"
                  :error-message="'Debe ser seleccionada una opción'"
                />
              </label>
            </div>
            <div class="col-4 q-px-md">
              <label class="q-px-md tw-text-label">
                Funcionario *
                <q-select
                  :options="filteredFuncionario"
                  fill-input
                  hide-selected
                  :rules="[inputRequired]"
                  use-input
                  v-model="formData.funcionario"
                  @filter="funcionarioonsFilterFn"
                  class="tw-w-full"
                  outlined
                  dense
                  @update:model-value="handleFuncionarioChange"
                  placeholder="Buscar"
                  :error="formErrors.funcionario"
                  :error-message="'Debe ser seleccionada una opción'"
                >
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
              </label>
            </div>
          </div>
          <div class="col-6" v-if="formData.campoDeBusqueda === '2'">
            <label class="q-px-md tw-text-label">
              Número de Radicado *
              <q-input
                dense
                label="inserta"
                emit-value
                map-options
                outlined
                :rules="[ val => !!val || 'El campo es obligatorio', val => val.length <= 30 || 'El número de radicado no puede tener más de 30 caracteres']"
                @update:model-value="handlRadicadoChange"
                v-model="formData.radicado"
              />
            </label>
          </div>
          <div class="col-6" v-if="formData.campoDeBusqueda === '3'">
            <label class="q-px-md tw-text-label">
              Oficina *
              <q-select
                dense
                v-model="formData.oficina"
                :options="filteredOficinas"
                label="Seleccione"
                emit-value
                map-options
                outlined
                @update:model-value="handlOficcinaChange"
                :rules="[inputRequired]"
                :error="formErrors.oficina"
                :error-message="'Debe ser seleccionada una opción'"
              />
            </label>
          </div>
        </div>
      </q-card>
      <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
        <q-btn
          class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]"
          no-caps
          style="border: 1px solid #2c3948"
          label="Limpiar"
          @click="resetForm"
        />
        <q-btn
          class="tw-w-1/4 tw-h-11 bg-primary text-white"
          type="submit"
          label="Buscar"
          @click="handleSearch"
        />
      </div>

      <main>
        <q-card
          flat
          class="tw-p-4 tw-rounded-xl"
          v-if="filteredTable.length > 0 || (search && search.trim() !== '')"
        >
          <div class="tw-flex tw-justify-between tw-items-center tw-mb-4">
            <h2 class="tw-font-bold tw-text-lg tw-pt-2">
              Resultados de la búsqueda
            </h2>
            <div class="tw-flex tw-items-center">
              <q-btn
                label="Reemplazo masivo"
                class="tw-mr-2 tw-bg-blue-500 tw-text-primary tw-rounded-full"
                flat
                dense
                @click="navigateToReemplazoMasivo"
                :disable="!selecReemplazo"
              />
              <q-btn
                :label="`Todos (${filteredTable.length} de ${filteredTable.length})`"
                class="tw-mr-4 bg-primary tw-text-white tw-rounded-full"
                flat
                dense
                @click="handlButtonSelectMultiple"
              />
              <q-input
                borderless
                dense
                debounce="300"
                v-model="search"
                placeholder="Busque por código o nombre"
                class="tw-w-56 tw-border tw-border-x-gray-400 tw-rounded-full"
                @update:model-value="generalFilter"
              >
                >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="show-table-icons">
            <TableManual
              class="q-pa-md"
              :TABLE_HEADER="renderColumns()"
              :TABLE_BODY="filteredTable"
              key-id="numeroRadicado"
              :button-select="selectButtoAll"
              select="multiple"
              v-model:selected="selectedRows"
              :msg-no-data="
                noDataMessage
                  ? 'No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente'
                  : ''
              "
              @update:filas="getPageFilas"
              @update:pages="getPageFilas"
              :campo-de-busqueda="formData.campoDeBusqueda"
              :perfil="formData.perfil"
              :total-pages="totalPages"
              @update:item-selected="handleSelectRowTable"
              @edictar-asignador="edictarAsignador"
              @adjuntar-doc="adjuntarDocumento"
              @anular-tramite="handleAnularTramite"
              @ver-datos="handleVerDatos"
              @excluir="handleExcluir"
              @incluir="handleIncluir"
              @refech-selectbutton-all="selectButtoAll = false"
            />
          </div>
        </q-card>
      </main>

      <q-dialog v-model="showModalIncluir">
        <q-card style="min-width: 1300px">
          <q-card-section>
            <Incluir
              :details-radicado="detailRadicado"
              @backView="handleBackViewIncluir"
            />
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="showModalEdict">
        <q-card style="min-width: 1300px">
          <q-card-section>
            <EdictarAsignador
              :details-radicado="detailRadicado"
              :perfil-label="selectedPerfilLabel"
              @backView="handleBackView"
            />
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="showModalExcluir">
        <q-card style="min-width: 1300px">
          <q-card-section>
            <Excluir
              :details-radicado="detailRadicado"
              @backView="handleBackViewExcluir"
            />
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog full-width v-model="showModalAdjuntar">
        <q-card class="tw-w-[3500px]">
          <q-card-section>
            <AdjuntarDocumento2
              @back-view="handleBackViewDoc"
              @succes-view="handleSuccesview"
              :details-radicado="detailRadicado"
              type="Documento"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </main>
</template>

<script setup lang="ts">
import {ref, onMounted, Ref} from "vue";
import { inputRequired } from "src/helpers/validations";
import { computed } from "vue";
import TableManual from "./TableManual.vue";
import { toast } from "src/helpers/toast";
import { watch } from "vue";
import { sgdeaAxios } from "src/services";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth.store";
import { formatDateTimeStandTwo } from "src/helpers/formtDate";
import EdictarAsignador from "./EdictarAsignador.vue";
import AdjuntarDocumento2 from "./AdjuntarDocumento2.vue";
import Excluir from "./Excluir.vue";
import Incluir from "./incluir.vue";

const router = useRouter();
const auth = useAuthStore();
const selectedRows = ref([]);
const filteredOficinas = ref([])
const listadoOficinas: Ref<any[]> = ref([])
const isLoadingOffices = ref(false);

const selecReemplazo = ref(false);

const selectButtoAll = ref(false);
const search = ref("");

const formData = ref({
  campoDeBusqueda: "",
  perfil: "",
  funcionario: "",
  estado: "",
  radicado: "",
  oficina: "",
});

const formErrors = ref({
  campoDeBusqueda: false,
  perfil: false,
  funcionario: false,
  estado: false,
  radicado: false,
  oficina: false,
});


const validateForm = computed(() => formData.value.campoDeBusqueda !== "");
let loadingTable = ref(true);

const campoDeBusquedaData = ref([]);

const perfilOptions = ref([]);

const estadoOptions = ref([]);

const funcionarioOptions = ref([]);

const filteredFuncionario = ref();
const idFuncionario = ref(0);
const oficinaId = ref(auth.$state.userInfo.oficina);
const userInfo = ref(auth.$state.userInfo);

const oficinaOptions = ref([]);

const filteredTable = ref([]);
const noDataMessage = ref(false);

const totalPages = ref();
const totalElements = ref();
const detailRadicado = ref();

const showModalIncluir = ref(false);
const showModalEdict = ref(false);
const showModalAdjuntar = ref(false);
const showModalExcluir = ref(false)

// Estado para controlar la visibilidad del modal

const handleBackViewDoc = () => {
  showModalAdjuntar.value = false;
};

const handleSuccesview = () => {
  showModalAdjuntar.value = false;
};

const handleBackViewExcluir =() => {
  showModalExcluir.value = false
  handleSearch()
}

const handleBackView = () => {
  showModalEdict.value = false;
  handleSearch()
};

const handleBackViewIncluir = () => {
  showModalIncluir.value = false
  handleSearch()
}


async function loadListadoOficinas() {
  try {
    //const response = await sgdeaAxios.get("/pqrd/listadoOficinas") // Anteriormente usado
    const response = await sgdeaAxios.get("/oficinas/oficinasSeries")

    if (response.status == 200 || response.status == 201) {
      listadoOficinas.value = response.data.filter((e) => e.origen === "oficina").map((e: any) => {
        return {
          label: e.nombre,
          value: e.id_registro
        }
      })
    }
    // [7, 8, 9, 10, 11, 12, 14, 18, 26] // Anteriormente excluidos
    // Lista de IDs de oficinas que quieres excluir
    const idsAExcluir = [18, 22, 23, 24, 25, 26, 27, 28] // Agrega aquí los IDs que quieres excluir
    listadoOficinas.value = listadoOficinas.value.filter((e) => !idsAExcluir.includes(e.value))
    filteredOficinas.value = listadoOficinas.value.sort((a, b) => a.label.localeCompare(b.label));

  } catch (error) {
    console.error(error)
  } finally {
    isLoadingOffices.value = false;
  }
}


const originData = ref([]);

const generalFilter = () => {
  if (search.value.trim() === "") {
    filteredTable.value = originData.value;
  } else {
    const needle = search.value.toLowerCase().trim();
    filteredTable.value = originData.value.filter((item) => {
      return [
        item.nombreUsuario,
        item.numeroRadicado,
        item.canalRadicacion,
        item.sucursal,
        item.idFlujo,
        item.tipoTramite,
        item.estado
      ].some(field =>
        field && field.toString().toLowerCase().includes(needle)
      );
    });
  }

  noDataMessage.value = filteredTable.value.length === 0;
};

const handleAnularTramite = (details) => {
  localStorage.setItem("anularTramite", JSON.stringify(details));
  router.push("/administracion-tramite/anulacion-de-tramite");
};

function handleVerDatos(details){

  switch(details.idFlujo){
    case 'PQRD':
      router.push(`/administracion-tramite/ver-datos-pqrd/${details.entidadId}`)
      break;
    case 'CUENTA_COBRO':
      router.push(`/administracion-tramite/ver-datos-cuenta-cobro/${details.subEntidadId}`)
      break;
    case 'ENTES_CONTROL':
      router.push(`/administracion-tramite/ver-datos-entes/${details.entidadId}`)
      break;
    case 'MEDICINA_LABORAL':
      router.push(`/administracion-tramite/ver-datos-medicina-laboral/${details.numeroRadicado}`)
      break;
    case 'TUTELAS':
      router.push(`/administracion-tramite/ver-datos-tutela/${details.numeroRadicado}`)
      break;
    case 'CORRESPONDENCIA_COMUNICACION':
      router.push(`/administracion-tramite/ver-datos-correspondencia/${details.numeroRadicado}`)
      break;
    case 'CORRESPONDENCIA_RADICACION':
      router.push(`/administracion-tramite/ver-datos-correspondencia/${details.numeroRadicado}`)
      break;
    case 'CORRESPONDENCIA_MANUAL':
      router.push(`/administracion-tramite/ver-datos-correspondencia/${details.numeroRadicado}`)
      break;
    case 'FACTURACION_ADMINISTRATIVA':
      router.push(`/administracion-tramite/ver-datos-facturacion-administrativa/${details.subEntidadId}`)
  }
}


const navigateToReemplazoMasivo = () => {
  if (selecReemplazo.value) {
    const estado = selectedRows.value[0].estado;
    const idUser = selectedRows.value[0].idUsuario;

    // Verificar si todos los estados son iguales
    const estadosIguales = selectedRows.value.every((v) => v.estado === estado);
    // Verificar si todos los idUsuario son iguales
    const idsIguales = selectedRows.value.every((v) => v.idUsuario === idUser);

    if (!estadosIguales) {
      toast.error(
        "Los estados seleccionados deben coincidir para proceder con el reemplazo masivo."
      );
    } else if (!idsIguales) {
      toast.error(
        "Los usuarios seleccionados deben coincidir para proceder con el reemplazo masivo."
      );
    } else {
      // Si todos los estados e idUsuarios son iguales
      router.push("/administracion-tramite/reemplazo-masivo");
      // Guardar selectedRows.value en localStorage
      localStorage.setItem("selectedRows", JSON.stringify(selectedRows.value));
    }
  }
};

const handlSearchChange = (value: any) => {
  formData.value.campoDeBusqueda = value;
};

const handlButtonSelectMultiple = () => {
  selectButtoAll.value = true;
};

const handleSelectRowTable = (select = []) => {
  if (select.length === 0) {
    selecReemplazo.value = false;
  } else {
    selecReemplazo.value = true;
  }
  selectedRows.value = select;

};

const handleRolChange = (value: any) => {
  formData.value.estado = "";
  formData.value.perfil = value;
  formData.value.funcionario = "";

  fetchEstadosPorRol(value);

  fetchFuncionarioOptions();
};

const handleEstadoChange = (value: any) => {
  formData.value.estado = value;
};

const handleFuncionarioChange = (value: any) => {
  formData.value.funcionario = value;
};

function adjuntarDocumento(details) {
  detailRadicado.value = details;
  showModalAdjuntar.value = true;
}

//reemplazarAprobador

function handleExcluir (details) {
  detailRadicado.value = details;

  showModalExcluir.value = true
}

const selectedPerfilLabel = ref('');

function edictarAsignador([details, asignador]) {
  detailRadicado.value = details;
  detailRadicado.value.asignador = asignador;

    const selectedPerfil = perfilOptions.value.find(
    (option) => option.value === formData.value.perfil
  );
  selectedPerfilLabel.value = selectedPerfil?.label || '';

  showModalEdict.value = true;
}

async function handleIncluir(details) {
  detailRadicado.value = details;

  showModalIncluir.value = true;
}

const funcionarioonsFilterFn = (val: string, update: any) => {
  if (val === "") {
    update(() => {
      filteredFuncionario.value = funcionarioOptions.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    filteredFuncionario.value = funcionarioOptions.value.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

const handlRadicadoChange = (value: any) => {
  formData.value.radicado = value;
};

const handlOficcinaChange = (value: any) => {
  formData.value.oficina = value;
};

const resetForm = () => {
  formData.value = {
    campoDeBusqueda: "",
    perfil: "",
    funcionario: "",
    estado: "",
    radicado: "",
    oficina: "",
  };

  filteredTable.value = [];
  clearErrors();
};

const handleSearch = () => {
  clearErrors();
  // Verificar si los campos obligatorios están completos
  if (!formData.value.campoDeBusqueda) {
    formErrors.value.campoDeBusqueda = true;
    toast.error("Debe ingresar los datos obligatorios");
  } else {
    formErrors.value.campoDeBusqueda = false;
    fetchTableData();
  }

  // Verificar los campos basados en la selección de campo de búsqueda
  if (formData.value.campoDeBusqueda === "1") {
    if (!formData.value.perfil) {
      formErrors.value.perfil = true;
      toast.error("Debe ingresar los datos obligatorios");
    } else {
      formErrors.value.perfil = false;
    }
    if (!formData.value.estado) {
      formErrors.value.estado = true;
      toast.error("Debe ingresar los datos obligatorios");
    } else {
      formErrors.value.estado = false;
    }
    if (!formData.value.funcionario) {
      formErrors.value.funcionario = true;
      toast.error("Debe ingresar los datos obligatorios");
    } else {
      formErrors.value.funcionario = false;
    }
  } else if (formData.value.campoDeBusqueda === "2") {
    if (!formData.value.radicado) {
      formErrors.value.radicado = true;
      toast.error(
        "Debe ingresar el número de radicado para realizar la búsqueda"
      );
    } else {
      formErrors.value.radicado = false;
      fetchDataByRadicado();
    }
  } else if (formData.value.campoDeBusqueda === "3") {
    if (formData.value.oficina === "") {
      formErrors.value.oficina = true;
      toast.error("Debe ingresar los datos obligatorios");
    } else {
      formErrors.value.oficina = false;
      fetchDataByOficina();
    }
  }
};

const clearErrors = () => {
  formErrors.value = {
    campoDeBusqueda: false,
    perfil: false,
    funcionario: false,
    estado: false,
    radicado: false,
    oficina: false,
  };
};

const renderColumns = () => {
  const columns = [
    {
      name: "canalRadicacion",
      label: "Canal de Radicación",
      field: "canalRadicacion",
      align: "center",
      sortable: true,
    },
    {
      name: "numeroRadicado",
      label: "Número de radicado",
      field: "numeroRadicado",
      align: "center",
      sortable: true,
    },
    {
      name: "sucursal",
      label: "Sucursal",
      field: "sucursal",
      align: "center",
      sortable: true,
    },
    // {
    //   name: "idFlujo",
    //   label: "Flujo",
    //   field: "idFlujo",
    //   align: "center",
    //   sortable: true,
    // },
    {
      name: "fechaRadicacion",
      label: "Fecha de radicación",
      align: "center",
      field: "fechaRadicacion",
      format: (value) => (value != "" ? formatDateTimeStandTwo(value) : "-"),
      sortable: true,
    },
    {
      name: "tipoTramite",
      label: "Tipo de tramite",
      field: "tipoTramite",
      align: "center",
      sortable: true,
    },
    {
      name: "estado",
      label: "Estado",
      align: "center",
      field: "estado",
      sortable: true,
    },
    {
      name: "actions",
      label: "Acciones",
      field: "acciones",
      sortable: false,
      align: "center",
    },
    {
      name: "trazabilidad",
      label: "Trazabilidad",
      field: "trazabilidad",
      sortable: false,
      align: "center",
    },
  ];

  return columns;
};

const getPageFilas = async (filas = 20, page = 0) => {
  // Asegúrate de que `formData.value` tenga los datos necesarios
  if (formData.value.campoDeBusqueda === "3") {
    await fetchDataByOficina(filas, page);
  } else if (formData.value.campoDeBusqueda === "1") {
    await fetchTableData(filas, page);
  }
};

watch(
  () => formData.value.campoDeBusqueda,
  (newValue) => {
    if (newValue) {
      formErrors.value.campoDeBusqueda = false;
    }
  }
);

watch(
  () => formData.value.perfil,
  (newValue) => {
    if (newValue) {
      formErrors.value.perfil = false;
    }
  }
);

watch(
  () => formData.value.funcionario,
  (newValue) => {
    if (newValue) {
      formErrors.value.funcionario = false;
    }
  }
);

watch(
  () => formData.value.estado,
  (newValue) => {
    if (newValue) {
      formErrors.value.estado = false;
    }
  }
);

const fetchDataByOficina = async (filas = 20, page = 0) => {
  if (formData.value.campoDeBusqueda === "3") {
    try {
      loadingTable.value = true; // Activar el indicador de carga

      // Realizamos la petición GET
      const response = await sgdeaAxios.get(
        `/administracion-tramite/buscarPorOficinaId`,
        {
          params: {
            oficinaId: formData.value.oficina, // Usamos el ID de la oficina seleccionada
            pageSize: filas,
            pageNumber: page,
          },
        }
      );

      // Actualizamos la tabla con la data obtenida

      filteredTable.value = response.data.content;

      originData.value = filteredTable.value;
      totalPages.value = response.data.totalPages;
      totalElements.value = response.data.totalElements;




      if (filteredTable.value.length === 0) {
        toast.warning("No se encontraron datos para la oficina seleccionada");
      }
    } catch (error) {
      toast.error("Ocurrió un error al realizar la búsqueda");
    } finally {
      loadingTable.value = false; // Desactivar el indicador de carga
    }
  }
};

const fetchDataByRadicado = async () => {
  if (formData.value.campoDeBusqueda === "2") {
    try {
      // Verificamos si el radicado está presente

      // Realizamos la petición GET
      const response = await sgdeaAxios.get(
        `/administracion-tramite/buscarPorRadicadoId`,
        {
          params: {
            radicadoId: formData.value.radicado, // Usamos el radicado ingresado
            pageSize: 10,
            pageNumber: 1,
          },
        }
      );

      // Actualizamos la tabla con la data obtenida
      filteredTable.value = response.data;

      originData.value = filteredTable.value;
      totalPages.value = response.data.totalPages;
      totalElements.value = response.data.totalElements;

      if (filteredTable.value.length === 0) {
        toast.warning("No se encontraron datos para el radicado ingresado");
      }
    } catch (error) {
      toast.error("Ocurrió un error al realizar la búsqueda");
    }
  }
};

const fetchEstadosPorRol = async (rolId: string) => {
  try {
    const estadosResponse = await sgdeaAxios.get(
      `/administracion-tramite/listadoEstadosPorIdRol?id=${rolId}`
    );

    const allowedStateIdsForRole6 = [3, 4, 5, 8, 9, 13, 18];
    // Ids de los estados que deseas excluir
    const estadosToExclude = [63,1,]; // Reemplaza estos números con los IDs de los estados que quieres ocultar

    // Filtrar los estados excluyendo los ids específicos
    const filteredEstados = estadosResponse.data
      .filter((state: any) => !estadosToExclude.includes(Number(state.id)))
      .filter((state: any) => {
        return rolId !== '6' || allowedStateIdsForRole6.includes(Number(state.id));
      });

    const mappedDate = filteredEstados
      .map((state: any) => ({
        label: state.estado,
        value: state.id.toString(),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    // Agregar "Todos" al principio de la lista
    estadoOptions.value = [{ label: "Todos", value: "Todos" }, ...mappedDate];
  } catch (error) {
    console.error(error);
    return [];
  }
};

async function fetchTableData(pageSize = 20, pageNumber = 0) {
  if (formData.value.campoDeBusqueda === "1") {
    try {
      // Encontrar el nombre del perfil a partir del ID seleccionado
      const selectedPerfil = perfilOptions.value.find(
        (option) => option.value === formData.value.perfil
      );
      const perfilLabel = selectedPerfil?.label || "";

      // Encontrar el nombre del perfil a partir del ID seleccionado
      const selectedStado = estadoOptions.value.find(
        (option) => option.value === formData.value.estado
      );
      const estadoLabel = selectedStado?.label || "";

      // Usar el ID del funcionario directamente desde formData.value.funcionario
      const funcionarioId = formData.value.funcionario?.value || "";

      const bodyParam = {
        perfil: perfilLabel.toLowerCase(),
        funcionario: funcionarioId,
        pageSize: pageSize,
        pageNumber: pageNumber,
      };

      if (estadoLabel != "Todos") {
        bodyParam.estado = estadoLabel;
      }

      const response = await sgdeaAxios.get(
        `/administracion-tramite/buscarCasosPorUsuario`,
        {
          params: bodyParam,
        }
      );




      filteredTable.value = response.data.content;

      originData.value = filteredTable.value;

      totalPages.value = response.data.totalPages;
      totalElements.value = response.data.totalElements;

      if (filteredTable.value.length === 0) {
        toast.warning("No se encontraron datos para el usuario ingresado");
      }
    } catch (error) {
      console.error(error);
      filteredTable.value = [];
      totalPages.value = 0;
      totalElements.value = 0;
    }
  }
}

// Función para obtener los datos de funcionarios
async function fetchFuncionarioOptions() {
  if (formData.value.perfil) {
    // Encontrar el nombre del perfil a partir del ID seleccionado
    const selectedPerfil = perfilOptions.value.find(
      (option) => option.value === formData.value.perfil
    );
    const rolName = selectedPerfil?.label || "";
    try {
      var response = null;

      const resultado = userInfo.value?.relations.find((relacion) =>
        relacion.rol.includes("Administrador Master")
      );
      if (resultado) {
        response = await sgdeaAxios.get(
          `/roles/usuarios?rol=${rolName}`
      );
      } else if (oficinaId.value != null) {
        response = await sgdeaAxios.get(
          `api/usuarios/rolYoficina?oficinaId=${oficinaId.value}&rolName=${rolName}`
      );
      } else {
        const resultado = userInfo.value?.relations.find((relacion) =>
          relacion.rol.includes("Administrador")
        );
        if (resultado) {
          const nombreRol = resultado.rol;
          const idSeccionSubSeccion = resultado.idDependencia;
          response = await sgdeaAxios.get(
            `api/usuarios/rolYSeccionSubseccion/${idSeccionSubSeccion}?rolName=${nombreRol}`
          );
        }
      }

      const funcionarios = response.data;

      // Mapear los datos para crear las opciones de funcionarios
      funcionarioOptions.value = funcionarios.map((funcionario: any) => {
        const enabledText = funcionario.enabled ? " " : "[Inactivo] ";
        const label = `${enabledText}${funcionario.userName} ${
          funcionario.firstname
        } ${funcionario.lastname} ${
          funcionario.usuarioRelaciones[0]?.oficina?.nombre || ""
        }`;

        return {
          label: label.trim(), // Etiqueta formateada
          value: funcionario.id.toString(), // ID como valor
        };
      });
    } catch (error) {
      console.error(error);
    }
  }
}

const campoDeBusquedaOptions = computed(() => {
  // Obtenemos el rol del usuario
  const userRole = userInfo.value.role;

  // Filtramos las opciones basadas en el rol
  return campoDeBusquedaData.value.filter(option => {
    // Si el usuario es "Asignador Responsable", excluimos la opción "Oficina"
    if (userRole === "Asignador Responsable" && option.name === "Oficina") {
      return false;
    }
    return true;
  }).map(campo => ({
    label: campo.name,
    value: campo.id.toString()
  })).sort((a, b) => a.label.localeCompare(b.label));
});

onMounted(async () => {
  await fetchTableData();
  await fetchDataByRadicado();
  await fetchDataByOficina();
  await loadListadoOficinas();
  try {
    const [rolesResponse, campoDeBusquedaResponse, oficinasResponse] =
      await Promise.all([
        sgdeaAxios.get("/roles"),
        sgdeaAxios.get("/administracion-tramite/campo-busqueda"),
        sgdeaAxios.get("/oficinas/all"),
      ]);

    // Ids que deseas excluir
    const idsToExclude = [
      4, 5, 8, 9, 11, 13, 14, 15, 16, 18, 12, 7, 2, 20, 22, 19, 3, 21, 10, 23,
    ];

    // Filtrar los datos excluyendo los ids específicos de rol(PERFIL)
    const filteredRol = rolesResponse.data.filter(
      (perfil: any) => !idsToExclude.includes(perfil.id)
    );

    perfilOptions.value = filteredRol
      .map((perfil: any) => ({
        label: perfil.nombre,
        value: perfil.id.toString(),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    // Almacenamos los datos originales en campoDeBusquedaData
    campoDeBusquedaData.value = campoDeBusquedaResponse.data;

    oficinaOptions.value = oficinasResponse.data
      .map((oficiona: any) => ({
        label: oficiona.nombre,
        value: oficiona.id.toString(),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  } catch (error) {
    console.error(error);
  }
});
</script>
