<template>
  <div class="q-pb-md q-px-md tw-mt-5">
    <a
      @click="emit('backView', true)"
      class="tw-text-primary tw-cursor-pointer"
      style="text-decoration: none"
    >
      <q-icon size="1.5em" name="chevron_left" color="primary" />
      <b> Volver </b>
    </a>
    <section>
      <div class="tw-bg-white q-mt-lg tw-rounded-md">
        <div
          class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex tw-flex-row"
        >
          <div
            class="width-container tw-w-1/2 q-px-sm tw-rounded-xl overflow-hidden"
            style="border: 1px solid #e3e4e5"
          >
            <q-table
              flat
              :rows="filteredUsers"
              @update:selected="handleAssign"
              :columns="columnsAsignar2"
              row-key="id"
              table-header-class="text-black text-h6 "
              class="sizes q-mr-md tableclass"
              style="
                margin: 0 auto;
                border-radius: 15px;
                min-height: auto;
                max-height: 400px;
                overflow: hidden;
              "
              :filter="filterValue"
              rows-per-page-label="Páginas"
              selection="multiple"
              v-model:selected="selection"
              virtual-scroll
              :rows-per-page-options="[8]"
              color="primary"
              clearSelection
              @row-dblclick="dblclickReasignar"
            >
              <template
                v-slot:body-cell-colaborador="props"
                :draggable="true"
                auto-width
              >
                <td
                  class="tw-text-center"
                  :draggable="true"
                  @dragstart="dragAsignar(props.row)"
                >
                  {{ props.row.colaborador }}
                </td>
              </template>
              <template v-slot:top>
                <span
                  class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold"
                >
                  Seleccione los usuarios que desea Incluir al caso
                </span>
                <div class="row tw-justify-center tw-w-full">
                  <span class="tw-text-base tw-font-bold tw-mt-3 tw-w-full"
                    >Filtrar por Usuario</span
                  >
                  <q-select
                    v-model="selectOficina"
                    outlined
                    dense
                    fill-input
                    :options="oficinas"
                    class="tw-w-1/2 tw-overflow-hidden tw-text-nowrap tw-text-ellipsis"
                    label="Seleccione"
                    style="padding: 0px"
                    @update:model-value="handleTramiteChange"
                  />
                  <q-select
                    :options="searchHelpDataFiltered"
                    fill-input
                    hide-selected
                    use-input
                    v-model="searchUsuariosList"
                    @filter="selectOptionsFilterFn"
                    class="tw-w-1/2"
                    outlined
                    dense
                    placeholder="Buscar"
                    @input-value="(v) => (searchUsuariosList = v)"
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
                </div>
              </template>
            </q-table>
          </div>
          <div
            class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl"
            style="border: 1px solid #e3e4e5"
            @dragover.prevent
            @drop="dropAsignar()"
          >
            <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
              Este es el usuario que ha seleccionado
            </span>
            <div class="flex wrap tw-gap-3 q-pt-sm">
              <div v-for="(asign, index) in cardsAsignar" :key="index">
                <div
                  v-if="asign.visible"
                  class="q-px-sm tw-text-base q-py-sm tw-gap-2 flex justify-between tw-text-[#2C3948] tw-rounded-3xl"
                  style="border: 1px solid #e3e4e5"
                >
                  <q-icon size="24px" name="person_outline" />
                  {{ asign.name }}
                  <q-icon
                    class="tw-cursor-pointer"
                    size="24px"
                    name="close"
                    @click="removeCardAsignar(index)"
                  />
                </div>
              </div>
              <div
                v-if="cardsAsignar.length === 0"
                class="tw-text-red-500 text-weight-bold"
              >
                Debe seleccionar al menos un usuario
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md q-px-sm">
          Motivo de Asignación
        </h3>
        <q-form ref="formRef">
          <div class="row full-width wrap tw-justify-start justify-around">
            <div class="row full-width">
              <div class="col-12">
                <label class="q-px-md tw-text-label"
                  >Observaciones *
                  <q-input
                    type="textarea"
                    outlined
                    label="Inserte"
                    dense
                    emit-value
                    v-model="form.observaciones"
                    :rules="[
                      inputRequired,
                      alphanumeric,
                      (v) => maxLengthInput(1000, v),
                    ]"
                  />
                </label>
              </div>
            </div>
          </div>
          <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
            <q-btn
              class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]"
              no-caps
              style="border: 1px solid #2c3948"
              @click="emit('backView', true)"
              label="Cancelar"
            />
            <q-btn
              class="tw-w-1/4 tw-h-11 bg-primary text-white"
              @click="confirmExclusion"
              label="Incluir"
            />
          </div>
        </q-form>
      </div>
      <Modal
        v-model="confirmModal"
        title="Confirmación"
        persistent
        :text="'Está seguro de asignar el radicad'"
        :is-success="true"
        :cancelButton="true"
        @closeModal="confirmModal = false"
        textButtonCancel="No"
        text-button="Si"
        @handleAccept=""
      />
      <Modal
        v-model="cancelModal"
        title="Confirmación"
        :is-success="false"
        @handleAccept="$emit('backView')"
        cancel-button
        textButtonCancel="No"
        textButton="Si"
        text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
        @close-modal="cancelModal = false"
        type="button"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import Modal from "src/components/Modal/Modal.vue";
import { toast } from "src/helpers/toast";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import {
  alphanumeric,
  inputRequired,
  maxLengthInput,
} from "src/helpers/validations";
import { columnsAsignar2 } from "src/pages/Facturacion/cobro";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";

const props = withDefaults(
  defineProps<{
    type: string;
    detailsRadicado: any;
  }>(),
  {}
);

const cancelModal = ref(false);
const confirmModal = ref(false);
const { getUserInfo } = useAuthStore();
const userInfo = ref();

const selection = ref([]);
const listUsersOriginal = ref([]);
const searchHelpDataFiltered = ref([]);
const cardsAsignar = ref([]);
const opForUsers = ref();
const selectOficina = ref("");
const oficinas = ref([]);
const filterValue = ref("");

const router = useRouter();
const searchUsuariosList = ref("");

const form = ref({
  observaciones: "",
  usuarios: [],
});


const emit = defineEmits(["findDocs", "backView", "uptadeTable"]);

const handleAssign = (array: any[]) => {
  cardsAsignar.value = array.map((item) => ({
    name: item.colaborador,
    id: item.id,
    visible: true,
    user: item.user,
  }));
};

const currentAssignee = computed(() => {
  return props.detailsRadicado.asignador === true
    ? props.detailsRadicado.nombreAsignadorResponsable
    : props.detailsRadicado.nombreUsuario;
});

const filteredUsers = computed(() => {
  return listUsersOriginal.value.filter(user => user.colaborador !== currentAssignee.value);
});

const handleTramiteChange = async (newValue?) => {
  try {
    const oficinaId = newValue?.value || props.detailsRadicado.idOficina;
    let apiEndpoint;

    // Determinar el endpoint según el tipo de flujo (PQRD o ENTE_CONTROL)
    switch (props.detailsRadicado.idFlujo) {
      case "PQRD":
        apiEndpoint = `/pqrd/listadoGestionadoresAIncluir/${props.detailsRadicado.entidadId}/oficina?oficinaId=${oficinaId}`;
        break;
      case "ENTES_CONTROL":
        apiEndpoint = `/api/entes/listadoGestionadoresAIncluir/${props.detailsRadicado.entidadId}/oficina?oficinaId=${oficinaId}`;
        break;
      default:
        toast.error("Flujo no reconocido");
        return;
    }

    // Realizar la solicitud a la API correspondiente
    const { data } = await sgdeaAxios.get(apiEndpoint);

    // Filtrar y mapear los datos
    listUsersOriginal.value = data
      .filter(
        (item) =>
          item.id !== userInfo.value.userid &&
          item.firstname + " " + item.lastname !== currentAssignee.value
      )
      .map((item) => ({
        colaborador: item.firstname + " " + item.lastname,
        enabled: item.enabled,
        id: item.id,
        user: item.userName,
        cargo: item.cargo,
        grupo: newValue?.label || props.detailsRadicado.nombreOficina,
      }))
      .sort((a, b) => a.colaborador.localeCompare(b.colaborador));

    // Crear opciones para el dropdown de usuarios
    opForUsers.value = listUsersOriginal.value.map((row) => {
      return { label: row.colaborador, value: row.id };
    });

    // Actualizar la búsqueda filtrada
    searchHelpDataFiltered.value = opForUsers.value;
  } catch (error) {
    toast.error("Ha ocurrido un error al obtener los usuarios");
  }
};

const dropAsignar = () => {
  const user = listUsersOriginal.value.find(
    (it) => it.id === rowAsignar.value.id
  );
  if (user) {
    cardsAsignar.value = [
      {
        id: user.id,
        name: user.colaborador,
        visible: true,
        user: user.user,
      },
    ];
    selection.value = [user];
  }
};

const dblclickReasignar = (_, row) => {
  if (row) {
    const user = listUsersOriginal.value.find((it) => it.id === row.id);
    if (user) {
      selection.value = [user];
    }
  }
};

const rowAsignar = ref();
const dragAsignar = (row) => {
  rowAsignar.value = row;
};

const selectOptionsFilterFn = (val: string, update: any) => {
  update(() => {
    if (val === "") {
      searchHelpDataFiltered.value = listUsersOriginal.value
        .map(({ colaborador, id }) => ({ label: colaborador, value: id }))
        .sort((a, b) => a.label.localeCompare(b.label));
    } else {
      const needle = val.toLowerCase();
      searchHelpDataFiltered.value = opForUsers.value.filter(({ label }) =>
        label?.toLowerCase().includes(needle)
      );
    }
  });
};

const removeCardAsignar = (index) => {
  cardsAsignar.value.splice(index, 1);
  selection.value.splice(index, 1);
};


const confirmExclusion = async () => {
  try {
    if (cardsAsignar.value.length === 0) {
      toast.error("Debe seleccionar un usuario para completar la acción");
      return;
    }

    const selectedUserIds = selection.value.map(user => user.id);

    let proceso = "";
    let response;

    switch (props.detailsRadicado.idFlujo) {
      case "PQRD":
        proceso = "PQRD";
        response = await sgdeaAxios.patch(
          `/pqrd/incluirGestionadores/${props.detailsRadicado.entidadId}`,
          {
            idGestionadores: selectedUserIds,
            motivoInclusion: form.value.observaciones,
          }
        );
        break;
      case "ENTES_CONTROL":
        proceso = "ENTC";
        response = await sgdeaAxios.patch(
          `/api/entes/clonacion/incluirGestionadores/${props.detailsRadicado.entidadId}`,
          {
            gestionadores: selectedUserIds,
            motivoInclusion: form.value.observaciones,
          }
        );
        break;
      default:
        toast.error("Flujo no reconocido");
        return;
    }
    if (response.status == 200) {
      const radicacion = props.detailsRadicado;
      await crearTrazabilidad({
        proceso: `${proceso}${radicacion.entidadId}`,
        secuencia: radicacion.numeroRadicado,
        estado: radicacion.estado,
        descripcion: "Se ha incluido el radicado",
        comentario: "incluir",
        nombre: userInfo.value.name,
        tramite: radicacion.tipoTramite,
        accion: "El trámite ha sido incluido",
      });
      cardsAsignar.value = [];
      selection.value = [];
      toast.success("incluir con éxito");
      emit("backView", true);
    }
  } catch (error) {
    toast.error("Ha ocurrido un error al momento de incluir");
  }
};

watch(
  () => searchUsuariosList.value,
  (value, oldValue) => {
    // @ts-ignore
    if (value && value.value) {
      // @ts-ignore
      const user = listUsersOriginal.value.find((it) => it.id === value.value);

      if (user) {
        listUsersOriginal.value = listUsersOriginal.value.filter(
          (it) => it.id === user.id
        );
      }
    } else {
      listUsersOriginal.value = opForUsers.value;
    }
  }
);

onMounted(async () => {
  userInfo.value = await getUserInfo();
  const { data: oficinasAll } = await sgdeaAxios.get("oficinas/all");

  oficinas.value = oficinasAll
    .map((item) => ({
      label: item.nombre,
      value: item.id,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  // Selecciona automáticamente la oficina actual
  selectOficina.value = {
    label: props.detailsRadicado.nombreOficina,
    value: props.detailsRadicado.idOficina,
  };

  // Carga los usuarios de la oficina actual
  await handleTramiteChange(selectOficina.value);
});
</script>

<style scoped>
.tableclass ::-webkit-scrollbar-thumb {
  background-color: #ffa51e;
}

.tableclass ::-webkit-scrollbar-track {
  background-color: #ecf0f1;
}
</style>
