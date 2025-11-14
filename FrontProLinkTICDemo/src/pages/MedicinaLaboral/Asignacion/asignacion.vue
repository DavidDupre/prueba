<template>
  <div>
    <section>
      <q-form ref="asignarRef">
        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
                  Asignar responsable
                </h3>
              </div>
            </template>
            <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
              <div
                class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex"
              >
                <div
                  class="width-container tw-w-1/2 q-px-sm tw-rounded-xl"
                  style="border: 1px solid #e3e4e5"
                >
                  <TableAsignar
                    :TABLE_BODY="listUsers"
                    :TABLE_HEADER="columnsAsignar"
                    :rowGestor="rowGestor"
                    @update:dragEvent="dragGestor"
                    @update:handleDblClickEvent="handleDoubleClickEvent"
                    :listadoOficinas="filteredUsers"
                    @update:item-selected="handleAssign"
                    row-key="colaborador"
                    :is-selection="false"
                    :mySelection="tableSelection"
                    type-selection="single"
                    :filtered="filteredUsers"
                    @update:officeSelected="filterUser"
                  />
                </div>
                <div
                  class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl"
                  style="border: 1px solid #e3e4e5"
                  @dragover.prevent
                  @drop="dropGestor()"
                >
                  <span
                    class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold"
                  >
                    Estos son los usuarios que ha seleccionado
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
                          @click="removeCardAsignar(asign.user)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-card>

        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
                  Motivo de Asignación
                </h3>
              </div>
            </template>
            <div class="tw-bg-white q-mt-lg tw-px-4" style="border-radius: 5px">
              <div class="row full-width wrap tw-justify-start justify-around">
                <div class="row full-width">
                  <div class="col-12">
                    <CommentTextArea
                      v-model="asignarUsuarioBody.motivoAsignacion"
                      :is-required="true"
                      :max-length="10000"
                      :min-length="10"
                      label="Observaciones"
                    />
                  </div>
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-card>
      </q-form>
    </section>
    <div class="justify-center tw-w-full tw-mt-6 tw-mb-6 tw-flex tw-gap-4">
      <q-btn
        label="Cancelar"
        type="reset"
        style="width: 240px; height: 40px"
        text-color="black"
        color="accent"
        class="tw-rounded-xl"
        @click="() => (showModal = true)"
      />
      <q-btn
        label="Asignar"
        text-color="white"
        @click="showModalAsigna"
        style="width: 240px; height: 40px"
        color="primary"
        class="tw-rounded-xl tw-btn tw-p-2"
      />
    </div>
  </div>

  <Modal
    v-model:model-value="showModal"
    title="¡Espera un momento!"
    text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
    :is-success="false"
    textButtonCancel="No"
    cancel-button
    @handleAccept="
      showModal = false;
      $emit('redirect');
    "
    text-button="Si"
    @close-modal="() => (showModal = false)"
  />
</template>

<script lang="ts" setup>
import Modal from "src/components/Modal/Modal.vue";
import { toast } from "src/helpers/toast";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import {
  inputRequired,
  maxLengthInput,
  minLengthInput,
} from "src/helpers/validations";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import TableAsignar from "./TableAsignar.vue";
import { Medicina } from "src/interfaces";
import { columnsAsignar } from ".";
import sortUsers from "src/helpers/sortUsers";
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";

const props = withDefaults(
  defineProps<{
    mlData: Medicina;
    metadatosInfo: any;
  }>(),
  {}
);

const tableSelection = ref([]);
const router = useRouter();
const showModal = ref(false);
const asignarRef = ref();
const auth = useAuthStore();
const listUsers = ref([]);
const cardsAsignar = ref([]);
const totalUsers = ref([]);
const filteredUsers = ref();
const originalListUser = ref();
const asignarUsuarioBody = ref({
  usuarioAsignado: "",
  idUser: "",
  motivoAsignacion: "",
  usuarioConsolidador: "",
});
const rowGestor = ref();
const listadoOficinas = ref();
listadoOficinas.value = [
  { label: "3 GRUPO CENTRO DE EXCELENCIA", value: 7 },
  { label: "4 GRUPO CENTRO DE EXCELENCIA", value: 8 },
  { label: "3 GRUPO JUNTAS DE CALIFICACIÓN", value: 10 },
  { label: "4 GRUPO JUNTAS DE CALIFICACIÓN", value: 11 },
  { label: "GERENCIA MÉDICA EXCELENCIA", value: 9 },
  { label: "GERENCIA MEDICA JUNTAS", value: 12 },
  { label: "Mesa Back Medicina Laboral", value: 13 },
];

onMounted(async () => {
  await loadUsers(true);
  filteredUsers.value = listUsers.value.map((e) => {
    return {
      label: e.colaborador,
      value: e.id,
    };
  });
  originalListUser.value = listUsers.value;
});

const dragGestor = (row: any) => {
  rowGestor.value = row;
};

const dropGestor = () => {
  const user = listUsers.value.find(
    (element) => element.id === rowGestor.value.id
  );
  const isCardsAsignarEmpty = !cardsAsignar.value.find(
    (element) => element.user === user.id
  );
  if (user && isCardsAsignarEmpty) {
    cardsAsignar.value.push({
      user: user.id,
      name: user.colaborador,
      visible: true,
    });
  }
};

const handleDoubleClickEvent = (row: any) => {
  const user = listUsers.value.find((element) => element.id === row.id);
  const isCardsAsignarEmpty = !cardsAsignar.value.find(
    (element) => element.user === user.id
  );
  if (user && isCardsAsignarEmpty) {
    cardsAsignar.value.push({
      user: user.id,
      name: user.colaborador,
      visible: true,
    });
  }
};

const loadUsers = async (initial: boolean = false) => {
  try {
    if (initial) {
      const officeName = listadoOficinas.value.find(
        (e) => e.value === auth.$state.userInfo.oficina
      )?.label;
      const response = await sgdeaAxios.get(`/api/usuarios/rolYoficina`, {
        params: {
          oficinaId: auth.$state.userInfo.oficina,
          rolName: "Gestionador",
        },
      });

      if (response.status == 200) {
        const users = sortUsers(response.data);
        const res = users.map((e) => {
          return {
            colaborador: e.firstname + " " + e.lastname,
            cargo: e.cargo,
            grupo: e.usuarioRelaciones
              ? e.usuarioRelaciones[0].oficina?.nombre
              : "",
            id: e.id,
          };
        });
        listUsers.value = res;

      }
    }
  } catch (error) {
    console.error(error);
  }
};

const removeCardAsignar = (user) => {
  const indexSelection = tableSelection.value.findIndex(
    (item) => item.id == user
  );
  tableSelection.value.splice(indexSelection, 1);
  const newCardsAsignar = cardsAsignar.value.filter(
    (card) => card.user !== user
  );
  cardsAsignar.value = newCardsAsignar;
  totalUsers.value = newCardsAsignar.map((e) => {
    return { label: e.name, value: e.user };
  });
};

const handleAssign = (array: any[]) => {
  if (array.length === 0) {
    cardsAsignar.value = [];
    tableSelection.value = [];
    asignarUsuarioBody.value.usuarioAsignado = "";
    asignarUsuarioBody.value.idUser = "";
  } else {
    cardsAsignar.value = array.map((item) => ({
      name: item.colaborador,
      visible: true,
      user: item.id,
    }));
    tableSelection.value = array;

    if (array.length > 0) {
      tableSelection.value = array;
      const firstSelected = array[0];
      asignarUsuarioBody.value.usuarioAsignado = firstSelected.colaborador;
      asignarUsuarioBody.value.idUser = firstSelected.id;
    }
  }
  totalUsers.value = cardsAsignar.value.map((e) => {
    return { label: e.name, value: e.user };
  });
};

const handleAcceptModal = async () => {
  try {
    const response = await sgdeaAxios.post(
      `/medicina/asignar/${props.mlData.id}`,
      {
        idGestionador: cardsAsignar.value[0].user,
        motivoAsignacion: asignarUsuarioBody.value.motivoAsignacion,
        idOficinaGestionador: auth.$state.userInfo.oficina
      }
    );

    if (response.status == 200 || response.status == 201) {
      toast.success("El radicado ha sido asignado con éxito");
      await crearTrazabilidad({
        proceso: `ML${props.mlData.id}`,
        secuencia: props.mlData.idRadicado,
        estado: "Para gestión",
        descripcion:
          `Asignador: ${auth.$state.userInfo.name}\n\n` +
          `Asignado: ${cardsAsignar.value[0].name}\n\n` +
          `Motivo: ${asignarUsuarioBody.value.motivoAsignacion}`,
        comentario: asignarUsuarioBody.value.motivoAsignacion,
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} ha asignado el radicado ${props.mlData.idRadicado}`,
        tramite: "Medicina Laboral",
      });
      router.push("/bandeja");
    }
  } catch (error) {
    const message =
      "No se ha ingresado metadatos para continuar con la asignación";
    toast.error(message);
  }
};

function filterUser(filterby) {
  listUsers.value = originalListUser.value.filter((e) => e.id == filterby);
}

const showModalAsigna = async () => {
  if (await asignarRef.value.validate()) {
    if (cardsAsignar.value.length !== 0) {
      await handleAcceptModal();
    } else {
      toast.error(
        "Debe seleccionar un usuario para completar la acción."
      );
    }
  } else {
    toast.error(
      "Debe diligenciar los campos obligatorios para continuar con el proceso."
    );
  }
};
</script>
