<template>
  <section>
    <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
      <h3 class="text-bold tw-text-xl q-py-md tw-flex-1 q-px-md">
        Reasignación
      </h3>
      <div class="tw-bg-white q-mt-lg tw-rounded-md">
        <div
          class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex tw-flex-row"
        >
          <div
            class="width-container tw-w-1/2 q-px-sm tw-rounded-xl"
            style="border: 1px solid #e3e4e5"
          >
            <q-table
              flat
              :rows="listUsersOriginal"
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
              selection="single"
              v-model:selected="selection"
              virtual-scroll
              :rows-per-page-options="[8]"
              color="primary"
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
                  Usuarios que desea reasignar al trámite
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
                    @input-value="addValue"
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
                v-if="cardsAsignar.length === 0 && cardsAsignar.length === 0"
                class="tw-text-red-500 text-weight-bold"
              >
                Debe seleccionar al menos un usuario
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <q-form ref="formReasignar" greedy >
      <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
        <p class="tw-text-2xl tw-font-bold tw-pb-4">Motivo de reasignación</p>

        <div class="col-12">
          <label>Observaciones *</label>
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
              (v) => minLengthInput(10, v),
              (v) => maxLengthInput(1000, v),
            ]"
          />
        </div>
      </q-card>

      <div
        class="justify-center tw-w-full tw-m-[10px] tw-mt-10 tw-mb-6 tw-flex tw-gap-4"
      >
        <q-btn
          class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]"
          no-caps
          style="border: 1px solid #2c3948"
          @click="cancelModal = true"
          >Cancelar</q-btn
        >
        <q-btn
          class="tw-w-1/4 tw-h-11 bg-primary text-white"
          @click="confirmAsignarModal"
          >Reasignar</q-btn
        >
      </div>
    </q-form>

    <Modal
      v-model="confirmModal"
      title="Confirmación"
      persistent
      :text="`¿Está seguro de reasignar el radicado #${detailsRadicado.id} al usuario ${cardsAsignar[0]?.name}?`"
      :is-success="true"
      :cancelButton="true"
      @closeModal="confirmModal = false"
      textButtonCancel="No"
      text-button="Si"
      @handleAccept="confirmAsignar"
    />
    <Modal
      v-model="cancelModal"
      title="¡Espera un momento!"
      :is-success="false"
      @handleAccept="removerAsignador"
      cancel-button
      textButtonCancel="No"
      textButton="Si"
      text="Al cancelar la acción perderá los datos para la reasignación ¿Desea realizar la acción?"
      @close-modal="cancelModal = false"
      type="button"
    />
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import Modal from "components/Modal/Modal.vue";
import { columnsAsignar2 } from "..";
import {
  alphanumeric,
  inputRequired,
  maxLengthInput,
  minLengthInput,
} from "src/helpers/validations";
import { toast } from "src/helpers/toast";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { useAuthStore } from "src/stores/auth.store";
import { sgdeaAxios } from "src/services";

const props = withDefaults(
  defineProps<{
    detailsRadicado: any;
    idComunicacion: number;
  }>(),
  {}
);
const router = useRouter();
const auth = useAuthStore();
const cardsAsignar = ref([]);
const listUsersOriginal = ref([]);
const listUsersCopi = ref([]);
const { getUserInfo } = useAuthStore();
const userInfo = ref();
const cancelModal = ref(false);
const confirmModal = ref(false);
const filterValue = ref("");
const filteredRows = ref(listUsersOriginal.value);
const searchHelpDataFiltered = ref([]);
const opForConsolidador = ref();
const selection = ref([]);
const selectOficina = ref("");
const oficinas = ref([]);
const form = ref({
  observaciones: "",
  usuarios: [],
});
const searchUsuariosList = ref();
const formReasignar = ref();

onMounted(async () => {
  getAllRegisters();

});

const removeCardAsignar = (index) => {
  cardsAsignar.value.splice(index, 1);
  selection.value.splice(index, 1);
};

const removerAsignador = () => {
  cardsAsignar.value = [];
  selection.value = [];
  form.value.observaciones = "";
};

const isSelected = (id) => {
  return selection.value.some((item) => item.id === id);
};

watch(filterValue, (newValue) => {
  if (newValue) {
    filteredRows.value = listUsersOriginal.value.filter((row) =>
      row.colaborador.toLowerCase().includes(newValue.toLowerCase())
    );
  } else {
    filteredRows.value = listUsersOriginal.value;
  }
});

watch(
  () => searchUsuariosList.value,
  (value) => {
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
      listUsersOriginal.value = listUsersCopi.value;
    }
  }
);

watch(
  () => selection.value,
  (value) => {
    if (value.length > 0) {
      // @ts-ignore
      if (
        value.some((it) => it.colaborador === searchUsuariosList.value?.label)
      ) {
        searchUsuariosList.value = "";
      }
    }
  }
);

watch(
  () => selectOficina.value,
  async (newValue: any, oldValue) => {
    if (newValue !== oldValue) {
      searchUsuariosList.value = "";
      listUsersOriginal.value = [];
      // @ts-ignore
      const { data: gestionadores } = await sgdeaAxios.get(
        `/api/usuarios/rolYoficina?rolName=Gestionador${
          newValue.value ? "&oficinaId=" + newValue.value : ""
        }`
      );
      // @ts-ignore
      const { data: asignadores } = await sgdeaAxios.get(
        `/api/usuarios/rolYoficina?rolName=Asignador Responsable${
          newValue.value ? "&oficinaId=" + newValue.value : ""
        }`
      );
      listUsersOriginal.value = asignadores.map((item) => ({
        colaborador: item.firstname + " " + item.lastname,
        enabled: item.enabled,
        id: item.id,
        user: item.userName,
        cargo: item.cargo,
        grupo: newValue?.label,
      }));
      listUsersOriginal.value = [
        ...listUsersOriginal.value,
        ...gestionadores.map((item) => ({
          colaborador: item.firstname + " " + item.lastname,
          enabled: item.enabled,
          id: item.id,
          user: item.userName,
          cargo: item.cargo,
          grupo: newValue?.label,
        })),
      ]
    }
  }
);

const usuarioConTiempoInvalido = ref();

const validarTime = () => {
  usuarioConTiempoInvalido.value = form.value.usuarios.find((it) => {
    if (it?.time === null) {
      return false;
    }
    if (it?.typeTime === "DIA" && (it.time > 31 || it.time <= 0)) {
      return true;
    }
    if (it?.typeTime === "HORA" && (it.time > 24 || it.time <= 0)) {
      return true;
    }

    return false;
  });
  if (usuarioConTiempoInvalido.value) {
    toast.error(
      `El tiempo debe estar entre 0 y ${
        usuarioConTiempoInvalido.value.typeTime === "DIA" ? 31 : 24
      } ${usuarioConTiempoInvalido.value.typeTime}`
    );
  }
};

const deletedTime = (id) => {
  const indexToDeleteCard = selection.value.findIndex((item) => item.id === id);
  const indexToDeleteUser = form.value.usuarios.findIndex(
    (item) => item?.usuario === id
  );
  selection.value.splice(indexToDeleteCard, 1);
  cardsAsignar.value.splice(indexToDeleteCard, 1);
  form.value.usuarios[indexToDeleteUser] = {
    usuario: null,
    typeTime: "",
    time: null,
  };
};

async function getAllRegisters() {
  try {
    userInfo.value = await getUserInfo();

    const { data: oficinasAll } = await sgdeaAxios.get("oficinas/all");

    oficinas.value = oficinasAll
      .map((item) => ({
        label: item.nombre,
        value: item.id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const oficinaUser = oficinasAll.find(
      (it) => it.nombre === userInfo.value?.relations[0]?.oficina
    );

    const { data: gestionadores } = await sgdeaAxios.get(
      `/api/usuarios/rolYoficina?rolName=Gestionador${
        oficinaUser?.id ? "&oficinaId=" + oficinaUser?.id : ""
      }`
    );
    const { data: asignadores } = await sgdeaAxios.get(
      `/api/usuarios/rolYoficina?rolName=Asignador Responsable${
        oficinaUser?.id ? "&oficinaId=" + oficinaUser?.id : ""
      }`
    );

    listUsersOriginal.value = asignadores.map((item) => ({
      colaborador: item.firstname + " " + item.lastname,
      enabled: item.enabled,
      id: item.id,
      user: item.userName,
      cargo: item.cargo,
      grupo: oficinaUser?.nombre || item.usuarioRelaciones[0]?.oficina?.nombre,
    }));
    listUsersOriginal.value = asignadores
      .concat(gestionadores)
      .map((item) => ({
        colaborador: item.firstname + " " + item.lastname,
        enabled: item.enabled,
        id: item.id,
        user: item.userName,
        cargo: item.cargo,
        grupo:
          oficinaUser?.nombre || item.usuarioRelaciones[0]?.oficina?.nombre,
      }))

    opForConsolidador.value = listUsersOriginal.value
      .map((row) => {
        return { label: row.colaborador, value: row.id };
      })
      .sort((a, b) => a.label.localeCompare(b.label));

    listUsersCopi.value = listUsersOriginal.value;
  } catch (error) {
    console.error(error);
  }
}

const confirmAsignar = async () => {
  try {
    const response = await sgdeaAxios.post(
      `/correspondencia/comunicacionMasiva/reasignarAprobacion/${props.idComunicacion}`,
      {
        observaciones: form.value.observaciones,
        usuario: auth.userInfo.userid,
        asignador: selection.value[0]?.id,
      }
    );

    if (response.status === 200) {
      await crearTrazabilidad({
          proceso: `CORMAS${props.detailsRadicado.id}`,
          secuencia: props.detailsRadicado.idRadicado,
          estado: "En edicion",
          descripcion:
            `Usuario: ${auth.$state.userInfo.name} ` +
            `Rol: ${auth.$state.userInfo.role} ` +
            `Reasignado a:${selection.value[0]?.colaborador} Motivo: ${form.value.observaciones}`
            ,
          comentario: "Se ha reasignado la comunicación.",
          nombre: auth.$state.userInfo.name,
          tramite: "Comunicación Masiva",
          accion: `${auth.$state.userInfo.name} ha reasignado la comunicación ${props.detailsRadicado.idRadicado}`,
        });
      toast.success("Asignación realizada correctamente");
      await trazabilidad();
      router.push('/Correspondencia/crear-comunicaciones-masiva');
    }
  } catch (error) {
    const { message } = error.response.data;
    if (message) {
      toast.error(error.response.data.message);
    }
  }
};

const trazabilidad = async () => {
  try {
    await crearTrazabilidad({
      proceso: `COR${props.detailsRadicado.id}`,
      secuencia: props.detailsRadicado.idRadicado,
      estado: props.detailsRadicado.estadoProceso,
      descripcion: "Se reasignó el radicado",
      comentario: "Se reasignó el radicado",
      nombre: auth.$state.userInfo.name,
      tramite: props.detailsRadicado.tipoTramite,
      accion: "Se reasignó el radicado",
    });
  } catch (error) {
    console.error(error);
  }
};

const confirmAsignarModal = async() => {
  if (!props.detailsRadicado.nodeId && !props.detailsRadicado.idRadicado) {
    toast.error(
      "Debe incluir las comunicaciones a un expediente antes de reasignar"
    );
    return;
  }

  if (!(await formReasignar.value.validate())) {
    toast.error('Debe diligenciar los campos obligatorios para continuar con el proceso')
    return;
  }

  if (cardsAsignar.value.length === 0) {
      toast.error('Debe seleccionar un usuario para completar la acción');
      return;
    }

  confirmModal.value = true;
};

const selectOptionsFilterFn = (val: string, update: any) => {
  update(() => {
    if (val === "") {
      searchHelpDataFiltered.value = listUsersOriginal.value
        .map(({ colaborador, id }) => ({ label: colaborador, value: id }))
        .sort((a, b) => a.label.localeCompare(b.label));
    } else {
      const needle = val.toLowerCase();
      searchHelpDataFiltered.value = opForConsolidador.value.filter(
        ({ label }) => label.toLowerCase().includes(needle)
      );
    }
  });
};

const handleAssign = (array: any[]) => {
  cardsAsignar.value = array.map((item) => ({
    name: item.colaborador,
    id: item.id,
    visible: true,
    user: item.user,
  }));
};

const dblclickReasignar = (_, row) => {
  if (row) {
    const user = listUsersOriginal.value.find((it) => it.id === row.id);
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
  }
};

const rowAsignar = ref();
const dragAsignar = (row) => {
  rowAsignar.value = row;
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

const addValue = (value) => {
  searchUsuariosList.value = value;
};
</script>
<style scoped>
.tableclass ::-webkit-scrollbar-thumb {
  background-color: #ffa51e;
}

.tableclass ::-webkit-scrollbar-track {
  background-color: #ecf0f1;
}
</style>
