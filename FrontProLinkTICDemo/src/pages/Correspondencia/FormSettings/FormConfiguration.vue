<template>
  <main class="q-py-md">
    <div class="mx-auto px-4">
      <div class="tw-flex tw-justify-between">
        <h1 class="tw-text-3xl tw-font-bold">Configuración de Formularios</h1>
      </div>
      <q-card flat class="tw-mb-6">
        <q-expansion-item expand-separator default-opened class="q-bg-white q-mt-lg">
          <template v-slot:header>
            <div class="col row">
              <b class="tw-text-lg">Datos del Metadato</b>
            </div>
          </template>
          <q-form ref="formRef" greedy class="row q-px-md">
            <div class="col-6 q-px-md">
              <label class="q-px-md tw-text-label">
                Trámite *
                <q-select dense v-model="formData.tramite" :options="tramiteOptions" label="Seleccione" emit-value
                  map-options outlined :rules="[inputRequired]" @update:model-value="handleTramiteChange" />
                <div v-if="errors.tramite" class="q-field-error">
                  {{ errors.tramite }}
                </div>
              </label>
            </div>
            <div class="col-6 q-px-md">
              <label class="q-px-md tw-text-label">
                Rol *
                <q-select dense v-model="formData.rol" :options="rolOptions" label="Seleccione" emit-value map-options
                  outlined :rules="[inputRequired]" @update:model-value="handleRolChange" />
                <div v-if="errors.rol" class="q-field-error">
                  {{ errors.rol }}
                </div>
              </label>
            </div>
            <div class="col-6 q-px-md">
              <label class="q-px-md tw-text-label">
                Oficina *
                <q-select :options="filteredOficinas" fill-input hide-selected :rules="[inputRequired]" use-input
                  v-model="formData.oficina" @filter="oficinasOptionsFilterFn" class="tw-w-full " outlined dense
                  @update:model-value="handleOficinaChange" placeholder="Buscar">
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
                <div v-if="errors.oficina" class="q-field-error">
                  {{ errors.oficina }}
                </div>
              </label>
            </div>
            <div class="col-6 q-px-md">
              <label class="q-px-md tw-text-label">
                Estado
                <q-select dense v-model="formData.estado" :options="estadoOptions" label="Seleccione" emit-value
                  map-options outlined :rules="[]" @update:model-value="handleEstadoChange" />
                <div v-if="errors.estado" class="q-field-error">
                  {{ errors.estado }}
                </div>
              </label>
            </div>
          </q-form>
        </q-expansion-item>
      </q-card>
      <section v-if="validateForm">
        <q-form ref="asignarRef">
          <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
            <q-expansion-item default-opened>
              <template v-slot:header>
                <div class="col row">
                  <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
                    Parametrización Formulario Metadatos
                  </h3>
                </div>
              </template>
              <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
                <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex">
                  <div class="width-container tw-w-2/4 q-px-sm tw-rounded-xl tw-h-full"
                    style="border: 1px solid #e3e4e5">
                    <q-table flat :rows="originalRowsTable" @update:selected="handleAssign" row-key="id"
                      table-header-class="text-black text-h6 " class="sizes q-mr-md tableclass tw-h-full"
                      :columns="columnsMetada" style="
                        margin: 0 auto;
                        border-radius: 15px;
                        min-height: auto;
                        max-height: 400px;
                        overflow: hidden;
                      " rows-per-page-label="Páginas" selection="multiple" v-model:selected="selection" virtual-scroll
                      :rows-per-page-options="[8]" hide-header color="primary">
                      <template v-slot:top-left>
                        <span class="tw-text-lg tw-font-semibold tw-mb-4">
                          Metadatos Creados
                        </span>
                        <span class="full-width tw-text-sm">
                          Filtrar por Nombre del Metadato
                        </span>
                        <q-select :options="filterOpsMetadatos" fill-input hide-selected use-input
                          v-model="searchMetadatoList" @filter="metadatosOptionsFilterFn" class="tw-w-full " outlined
                          dense placeholder="Buscar" @input-value="addValue">
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
                      </template>
                    </q-table>
                  </div>
                  <div class="tw-w-full q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl" style="border: 1px solid #e3e4e5">
                    <div>
                      <h2 class="tw-text-lg tw-font-semibold tw-mb-6">
                        Metadatos Incluidos al Formulario
                      </h2>
                      <q-table :rows="rowsTableMetaIncluded" row-key="name" flat :dense="true" class="tw-w-full"
                        hide-bottom>
                        <template v-slot:header="props">
                          <q-tr :props="props">
                            <q-th auto-width class="tw-text-left tw-py-2 tw-px-4">Trámite</q-th>
                            <q-th auto-width class="tw-text-right tw-py-2 tw-px-4">Campo Obligatorio</q-th>
                            <q-th auto-width class="tw-text-right tw-py-2 tw-px-4">Activo/Inactivo</q-th>
                            <q-th auto-width class="tw-text-right tw-py-2 tw-px-4">Eliminar</q-th>
                          </q-tr>
                        </template>

                        <template v-slot:body="props">
                          <q-tr :props="props" class="tw-border-t tw-border-collapse">
                            <q-td :props="props" key="name" class="tw-py-2">
                              <div class="tw-flex tw-items-center">
                                <q-icon
                                  v-if="props.row.additionalInfo && props.row.additionalInfo.length > 0 && props.row.isDesplegable"
                                  color="primary" name="keyboard_arrow_down" @click="toggleOptionsList(props.row)"
                                  class="tw-cursor-pointer" size="24px" />
                                <span>{{ props.row.name }}</span>
                              </div>
                              <div v-if="props.row.showAdditionalInfo && props.row.isDesplegable === true" class="tw-w-full">
                                <q-list dense v-for="info in props.row.additionalInfo" :key="info.id">
                                  <q-item class="tw-text-left">
                                    <q-item-section avatar>
                                      <q-icon color="primary"
                                        :name="iconOpcion(info.isDesplegableOp, info.opciones.length)"
                                        class="tw-cursor-pointer" size="15px" @click="toggleOptions(info)" />
                                    </q-item-section>
                                    <q-item-section>{{ info.nombreRelacional }}</q-item-section>
                                  </q-item>
                                  <q-list dense v-for="opcion in info.opciones" :key="opcion.id">
                                    <q-item v-if="info.isDesplegableOp">
                                      <q-item-section>{{ opcion.opcion }}</q-item-section>
                                    </q-item>
                                  </q-list>
                                </q-list>
                              </div>
                            </q-td>

                            <q-td :props="props" key="estado" class="tw-py-2 tw-px-4 tw-text-right">
                              <div class="tw-w-full">
                                <q-item class="tw-flex tw-justify-end col">
                                  <q-toggle size="xs" v-model="props.row.estado"
                                    @update:model-value="updateAccept(props.row)" color="orange" />
                                </q-item>
                                <template v-if="props.row.showAdditionalInfo && props.row.isDesplegable === true" class="tw-w-full col">
                                  <q-list dense v-for="info in props.row.additionalInfo" :key="info.id">
                                    <q-item class="tw-flex tw-justify-end">
                                      <q-toggle size="xs" v-model="info.estado"
                                        @update:model-value="updateAcceptLists(info.id)" color="orange" />
                                    </q-item>
                                    <q-list dense v-for="opcion in info.opciones" :key="opcion.id">
                                      <q-item class="tw-flex tw-justify-end" v-if="info.isDesplegableOp">
                                        <q-toggle size="xs" v-model="opcion.visible"
                                          @update:model-value="updateAcceptOptions(opcion.id)" color="orange" />
                                      </q-item>
                                    </q-list>
                                  </q-list>
                                </template>
                              </div>
                            </q-td>

                            <q-td :props="props" key="isDesplegable" class="tw-py-2 tw-px-4 tw-text-right">
                              <div class="tw-w-full">
                                <q-item class="tw-flex tw-justify-end col">
                                  <q-toggle size="xs" v-model="props.row.isDesplegable"
                                    @update:model-value="updateActiveStatus(props.row)" color="orange" />
                                </q-item>
                                <!-- <template v-if="props.row.showAdditionalInfo && props.row.isDesplegable === true" class="tw-w-full col">
                                  <q-list dense v-for="info in props.row.additionalInfo" :key="info.id">
                                    <q-item class="tw-flex tw-justify-end" v-if="props.row.isDesplegable === true">
                                      <q-toggle size="xs" v-model="info.isDesplegable"
                                        @update:model-value="updateActiveStatus(info.id)" color="orange" />
                                    </q-item>
                                    <q-list dense v-for="opcion in info.opciones" :key="opcion.id">
                                      <q-item class="tw-flex tw-justify-end" v-if="info.isDesplegableOp">
                                        <q-toggle size="xs" v-model="opcion.visible"
                                          @update:model-value="updateActiveStatus(opcion.id)" color="orange" />
                                      </q-item>
                                    </q-list>
                                  </q-list>
                                </template> -->
                              </div>
                            </q-td>
                            <q-td :props="props" key="id" class="tw-py-2 tw-px-4">
                              <div class="tw-flex tw-justify-end">
                                <q-btn color="orange" flat round icon="delete" @click="handleDelete(props.row)" />
                              </div>
                            </q-td>
                          </q-tr>
                        </template>

                        <template v-slot:no-data>
                          <!-- Deja este slot vacío para eliminar el mensaje "Sin datos disponibles" -->
                        </template>
                      </q-table>
                    </div>
                  </div>
                </div>
              </div>
            </q-expansion-item>
          </q-card>
        </q-form>
      </section>

      <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
        <q-btn class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]" no-caps
          style="border: 1px solid #2c3948" label="Cancelar" @click="cancelModal = true" />
        <q-btn class="tw-w-1/4 tw-h-11 bg-primary text-white" type="submit" label="Guardar" @click="handleBtnGuardar" />
      </div>
    </div>
    <Modal v-model="cancelModal" title="Confirmación" persistent
      text="Al cancelar la acción perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
      :is-success="false" :cancelButton="true" @closeModal="cancelModal = false" textButtonCancel="No" text-button="Si"
      @handleAccept="router.push('/correspondencia')" />
    <Modal v-model="confirmModal" title="Confirmación" persistent text="¿Está seguro que desea asignar estos metadatos?"
      :is-success="false" :cancelButton="true" @closeModal="confirmModal = false" textButtonCancel="Cancelar"
      text-button="Aceptar" @handleAccept="handleSubmit" />
  </main>
</template>

<script setup lang="ts">
import {
  inputRequired,
} from "src/helpers/validations";
import { ref, onMounted, computed, watch } from "vue";
import Modal from "src/components/Modal/Modal.vue";
import { useRouter } from "vue-router";
import { sgdeaAxios } from "src/services";
import { useMetadatosStore } from "src/stores/useMetadatosStore";
import { toast } from "src/helpers/toast";

const store = useMetadatosStore();

const router = useRouter();
const confirmModal = ref(false);
const cancelModal = ref(false);
const selection = ref([]);
const searchMetadatoList = ref("");
const validateForm = computed(() => {
  return formData.value.tramite !== '' &&
    formData.value.rol !== '' &&
    formData.value.oficina !== '' &&
    formData.value.estado !== '';
});

const columnsMetada = [
  {
    label: "Nombre",
    field: "name",
    align: "left",
    sortable: true,
    width: "20%",
  },
];

const tramiteOptions = ref([]);
const rolOptions = ref([]);
const oficinaOptions = ref([]);
const estadoOptions = ref([]);
const filteredOficinas = ref();

// Datos de la tabla de MetadataCreated
const originalRowsTable = ref([]);
const filterOriginalRowsTable = ref([])
const listRowsCopi = ref([])
const filterOpsMetadatos = ref([]);
// Datos de la tabla de MetadataIncluded
const rowsTableMetaIncluded = ref([]);
const copyRowsTableMetaIncluded = ref([]);

const formRef = ref(null)
const formData = ref({
  tramite: "",
  rol: null,
  oficina: "",
  filterOficina: "",
  estado: "",
  metadatos: [],
});
const errors = ref({
  tramite: null,
  rol: null,
  oficina: null,
  estado: null,
});

const handleAssign = async (array) => {
  rowsTableMetaIncluded.value = array.map((item) => ({
    id: item.id,
    name: item.name,
    estado: item.estado,
    isDesplegable: item.isDesplegable,
    showAdditionalInfo: item.showAdditionalInfo,
    additionalInfo: item.additionalInfo,
  }));
};

const oficinasOptionsFilterFn = (val: string, update: any) => {
  if (val === '') {
    update(() => {
      filteredOficinas.value = oficinaOptions.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    filteredOficinas.value = oficinaOptions.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
};

const metadatosOptionsFilterFn = (val: string, update: any) => {
  if (val === '') {
    update(() => {
      filterOpsMetadatos.value = filterOriginalRowsTable.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    filterOpsMetadatos.value = filterOriginalRowsTable.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
};

watch(
  () => searchMetadatoList.value,
  (value) => {
    if (value) {
      const metadato = originalRowsTable.value.find(it => {
        // @ts-ignore
        return it.name.includes(value.label || value);
      });

      if (metadato) {
        originalRowsTable.value = originalRowsTable.value.filter(it => it.id === metadato.id)
      }
    } else {
      originalRowsTable.value = listRowsCopi.value
    }
  }
);

const handleBtnGuardar = async () => {
  if (!(await formRef.value.validate())) {
    toast.error('Debe diligenciar los campos obligatorios para continuar con el proceso')
    return;
  }
  confirmModal.value = true
}

// Manejar cambio de rol y filtrar las opciones de estado
const handleTramiteChange = (value: any) => {
  formData.value.tramite = value;
  fetchDynamicData();
};

const handleRolChange = (value: any) => {
  formData.value.estado = ''
  formData.value.rol = value;
  fetchDynamicData();
  fetchEstadosPorRol(value);
};

const handleOficinaChange = (value: any) => {
  formData.value.oficina = value;
  fetchDynamicData();
};

const handleEstadoChange = (value: any) => {
  formData.value.estado = value;
  fetchDynamicData();
};

function toggleOptionsList(row: any) {
  row.showAdditionalInfo = !row.showAdditionalInfo;
}

function toggleOptions(row: any) {
  row.isDesplegableOp = !row.isDesplegableOp;
}

const iconOpcion = (isDesplegableOp: boolean, n: number) => {
  return isDesplegableOp ? 'keyboard_arrow_up' : n > 0 ? 'keyboard_arrow_down' : 'keyboard_arrow_up';
}

// Crear Metada y asignarla a la tabla rowsTableMetadataIncluded
const handleSubmit = async () => {
  try {
    if (!(await formRef.value.validate())) {
      toast.error('Debe diligenciar los campos obligatorios para continuar con el proceso')
      return;
    }

    const metadatos = [];

    let idsMetadatos = originalRowsTable.value.filter(includedItem =>
      rowsTableMetaIncluded.value.some(createdItem => createdItem.name === includedItem.name)
    );

    idsMetadatos = idsMetadatos.filter(includedItem => !copyRowsTableMetaIncluded.value.some(it => it.name === includedItem.name))

    for (let i = 0; i < idsMetadatos.length; i++) {
      metadatos.push({
        id_flujo: formData.value.tramite,
        id_rol: formData.value.rol,
        id_oficina: formData.value.oficina.value,
        id_estado_proceso: formData.value.estado,
        id_metadato: idsMetadatos[i].id,
        obligatorio: rowsTableMetaIncluded.value[i].estado
      })
    }
    await store.saveMetadato(metadatos);
    toast.success('Configuración ingresada correctamente')
    await fetchDynamicData()
  } catch (error) {
    console.error("Error al guardar metadato:", error);
    // Aquí puedes manejar el error mostrando un mensaje al usuario, por ejemplo
  }
};

// Manejar cambio de Actualizar de cambpo obligatorio
const updateAccept = async (row: any) => {
  try {
    await store.updateAccept(row);
  } catch (error) {
    console.error("Error al actualizar", error);
  }
};

const updateAcceptLists = async (id: number) => {
  try {
    const response = sgdeaAxios.put(`/metadato/elementoListaRelMD/alternarEstado/${id}`)
  } catch (error) {
    console.error("Error al actualizar", error);
  }
};

const updateAcceptOptions = async (id: number) => {
  try {
    const response = sgdeaAxios.put(`/metadato/metadatoOpcionLista/alternarVisible/${id}`)
  } catch (error) {
    console.error("Error al actualizar", error);
  }
};

const updateActiveStatus = (row) => {
  // Aquí puedes manejar la lógica que necesites cuando se cambie el estado
};

// Función para manejar la eliminación de la fila
const handleDelete = async (row: any) => {
  try {
    const { name, id } = row;

    const rowToDeleteIndex = rowsTableMetaIncluded.value.findIndex(it => it.name === name);
    const selectionIndex = selection.value.findIndex(item => item.name === name);

    if (copyRowsTableMetaIncluded.value.some(it => it.name === name)) {
      await store.deleteRow(id);
    }

    if (rowToDeleteIndex !== -1) rowsTableMetaIncluded.value.splice(rowToDeleteIndex, 1);
    if (selectionIndex !== -1) selection.value.splice(selectionIndex, 1);

  } catch (error) {
    console.error("Error al eliminar", error);
  }
};

const fetchDynamicData = async () => {
  try {
    const { tramite, rol, oficina, estado } = formData.value;

    if (!tramite || !rol || !oficina || !estado) {
      console.error("Todos los campos deben estar seleccionados.");
      return;
    }

const dynamicDataResponse = await sgdeaAxios.get(
  `/parametrizacion-formulario/ListadoParametrizacion?id_flujo=${tramite}&id_rol=${rol}&id_oficina=${oficina.value}&id_estado_proceso=${estado}`
);


    const mappedData = dynamicDataResponse.data.content.map((metadata) => {
      const isDesplegable =
        metadata.metadatoConOpciones.metadato.tipoDato.id === 2;
      const additionalInfo =
        metadata.metadatoConOpciones.listadoRelacionalesMD.map((item) => ({
          id: item.elemento.id,
          nombreRelacional: item.elemento.nombreRelacional,
          estado: item.elemento.estado,
          isDesplegableOp: true,
          opciones: item.opciones,
        }));

      const showAdditionalInfo = additionalInfo.length > 0;

      return {
        name: metadata.metadatoConOpciones.metadato.nombre,
        estado: metadata.obligatorio,
        id: metadata.id,
        isDesplegable: isDesplegable,
        additionalInfo: additionalInfo,
        showAdditionalInfo: showAdditionalInfo,
      };
    });

    rowsTableMetaIncluded.value = mappedData;
    copyRowsTableMetaIncluded.value = mappedData
    const rowSelection = originalRowsTable.value.filter(it =>
      rowsTableMetaIncluded.value.some(meta => meta.name === it.name)
    );
    selection.value = rowSelection
  } catch (error) {
    console.error("Error al cargar datos dinámicos:", error);
  }
};

const fetchEstadosPorRol = async (rolId: number) => {
  try {
    const estadosResponse = await sgdeaAxios.get(
      `/parametrizacion-formulario/listadoEstadosPorIdRol?id=${rolId}`
    );

    const mappedDate = estadosResponse.data.map((state: any) => ({
      label: state.nombre,
      value: state.id.toString(),
    })).sort((a, b) => a.label.localeCompare(b.label));

    estadoOptions.value = mappedDate;
  } catch (error) {
    console.error("Error al cargar estados por rol:", error);
    return [];
  }
};

onMounted(async () => {
  fetchDynamicData();

  try {
    const [
      tramitesResponse,
      rolesResponse,
      oficinasResponse,
      metadataCreatedResponse,
    ] = await Promise.all([
      sgdeaAxios.get("/parametrizacion-formulario/listadoFlujosAll"),
      sgdeaAxios.get("/roles"),
      sgdeaAxios.get("/oficinas/oficinasSeries"),
      sgdeaAxios.get("/metadato/listadoConOpciones"),
    ]);


    // Ids que deseas excluir
    const idsToExclude = [1, 2, 3, 4];
    const excludeRoleIds = [
      4, 5, 8, 9, 11, 13, 14, 15, 16, 18, 19, 12, 7, 2, 20, 22, 23, 3, 21,
    ];
    // Filtrar los datos excluyendo los ids específicos
    const filteredTramites = tramitesResponse.data.filter(
      (tramite: any) => !idsToExclude.includes(tramite.id)
    );

    // Filtrar los roles excluyendo los IDs específicos
    const filteredRoles = rolesResponse.data.filter(
      (role: any) => !excludeRoleIds.includes(role.id)
    );

    // Asignamos los datos de las respuestas a nuestras variables
    tramiteOptions.value = filteredTramites
      .filter((tramite: any) => tramite.nombre !== "Mortales")
      .filter((tramite: any) => tramite.nombre !== "Retiro de empresa")
      .map((tramite: any) => ({
      label: tramite.nombre,
      value: tramite.id.toString(),
    })).sort((a, b) => a.label.localeCompare(b.label));

    rolOptions.value = filteredRoles.map((role: any) => ({
      label: role.nombre,
      value: role.id.toString(),
    })).sort((a, b) => a.label.localeCompare(b.label));
    oficinaOptions.value = oficinasResponse.data.map((oficina: any) => ({
      label: oficina.nombre,
      value: oficina.oficina_id,
    })).sort((a, b) => a.label.localeCompare(b.label));
    filteredOficinas.value = oficinaOptions.value

    originalRowsTable.value = metadataCreatedResponse.data.map((it) => {
      const isDesplegable = it.metadato.tipoDato.id === 2;
      const additionalInfo =
        it.listadoRelacionalesMD.map((item) => ({
          id: item.elemento.id,
          nombreRelacional: item.elemento.nombreRelacional,
          estado: item.elemento.estado,
          opciones: item.opciones,
        }));

      const showAdditionalInfo = additionalInfo.length > 0;

      return {
        name: it.metadato.nombre,
        estado: it.metadato.estado,
        id: it.metadato.id,
        isDesplegable: isDesplegable,
        additionalInfo: additionalInfo,
        showAdditionalInfo: showAdditionalInfo,
      };
    });

    filterOriginalRowsTable.value = originalRowsTable.value.map(({ name, id }) => ({ label: name, value: id })).sort((a, b) => a.label.localeCompare(b.label))
    listRowsCopi.value = originalRowsTable.value
  } catch (error) {
    console.error("Error al cargar opciones:", error);
  }
});

const addValue = (value) => {
  searchMetadatoList.value = value
}

</script>

<style scoped>
.tw-text-label {
  font-size: 14px;
  font-weight: 600;
  color: #2c3948;
}
</style>
