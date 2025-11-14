<template>
  <div>
    <section>
      <q-form ref="asignarRef">
        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
          <h3 class="tw-mt-4 tw-ml-2 text-bold tw-text-xl d tw-flex-1 q-px-md">
            Enviar a Revisión
          </h3>
          <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
            <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex">
              <div
                class="width-container tw-w-1/2 q-px-sm tw-rounded-xl"
                style="border: 1px solid #e3e4e5"
              >
                <TableAsignar
                  :TABLE_BODY="listUsers"
                  :TABLE_HEADER="columnsAsignar"
                  :listadoOficinas="filteredOficinas"
                  @update:item-selected="handleAssign"
                  row-key="colaborador"
                  :is-selection="false"
                  :mySelection="tableSelection"
                  type-selection="single"
                  :filtered="filteredOficinas"
                  @update:officeSelected="filterUser"
                  @update:dragEvent="dragRevisor"
                />
              </div>
              <div
                class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl"
                style="border: 1px solid #e3e4e5"
                @dragover.prevent
                @drop="dropTable(cardsAsignarAprob, tableSelectionAprob)"
              >
                <span
                  class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold"
                >
                  Este es el usuario revisor que ha seleccionado
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
          <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
            <h3
              class="tw-mt-4 tw-ml-2 text-bold tw-text-xl d tw-flex-1 q-px-md tw-mb-6"
            >
              Enviar a Aprobación
            </h3>
            <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex">
              <div
                class="width-container tw-w-1/2 q-px-sm tw-rounded-xl"
                style="border: 1px solid #e3e4e5"
              >
                <TableAsignar
                  :TABLE_BODY="listUsersAprob"
                  :TABLE_HEADER="columnsAsignar"
                  :listadoOficinas="filteredUsersAprob"
                  @update:item-selected="handleAssignAprob"
                  row-key="colaborador"
                  :is-selection="false"
                  :mySelection="tableSelectionAprob"
                  type-selection="single"
                  :filtered="filteredUsersAprob"
                  @update:officeSelected="filterUserAprob"
                  @update:dragEvent="dragAprobador"
                  title="Seleccione un usuario, el cual va a aprobar el radicado"
                />
              </div>
              <div
                class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl"
                style="border: 1px solid #e3e4e5"
                @dragover.prevent
                @drop="dropTable(cardsAsignarAprob, tableSelectionAprob)"
              >
                <span
                  class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold"
                >
                  Este es el usuario aprobador que ha seleccionado
                </span>
                <div class="flex wrap tw-gap-3 q-pt-sm">
                  <div v-for="(asign, index) in cardsAsignarAprob" :key="index">
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
                        @click="removeCardAsignarAprob(asign.user)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card>
      </q-form>
    </section>
    <div
      class="justify-center tw-w-full tw-m-[10px] tw-mt-10 tw-mb-6 tw-flex tw-gap-4"
    >
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
        label="Enviar"
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
      router.go();
    "
    text-button="Si"
    @close-modal="() => (showModal = false)"
  />

  <Modal
    v-model:model-value="showConfirmationModal"
    title="Confirmación"
    :text="`¿Está seguro que desea enviar el trámite para revisión?`"
    :is-success="false"
    textButtonCancel="Cancelar"
    cancel-button
    @handleAccept="handleAcceptModal"
    text-button="Aceptar"
    @close-modal="() => (showConfirmationModal = false)"
  />
</template>

<script lang="ts" setup>
import TableAsignar from "./TableAsignar.vue";
import { sgdeaAxios } from "src/services";
import { onMounted, ref } from "vue";
import { toast } from "src/helpers/toast";
import { useRouter } from "vue-router";
import Modal from "src/components/Modal/Modal.vue";
import { useAuthStore } from "src/stores/auth.store";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { crearTrazabilidadDocumento } from "src/helpers/trazabilidadDocumento";

const tableSelection = ref([]);
const tableSelectionAprob = ref([]);
const router = useRouter();
const showModal = ref(false);
const asignarRef = ref();
const showConfirmationModal = ref(false);
const listadoOficinas = ref([]);
const auth = useAuthStore();
const props = withDefaults(
  defineProps<{
    pqrData: any[];
    pqrdMetadata: any[];
    pqrdDocsalida: any[];
    pqrdDatossalida: any[];
    isChangeDoc: boolean;
  }>(),
  {}
);

const originalListUser = ref([]);
const listUsers = ref([]);
const originalListUsersAprob = ref([]);
const listUsersAprob = ref([]);
const cardsAsignar = ref([]);
const cardsAsignarAprob = ref([]);
const totalUsers = ref([]);
const totalUsersAprob = ref([]);
const filteredOficinas = ref();
const filteredUsersAprob = ref();
const asignarUsuarioBody = ref({
  usuarioAsignado: "",
  idUser: "",
  motivoAsignacion: "",
  usuarioConsolidador: "",
});
const idOficina = ref();

onMounted(async () => {
  await loadOficina();
  // Si no tiene oficina, se toma id de la dependencia
  if (auth.userInfo.oficina) {
    idOficina.value = auth.userInfo.oficina;
  } else {
    idOficina.value = auth.userInfo.relations.find(
      (relation) => relation.rol === auth.userInfo.role
    ).idDependencia;
  }

  await loadUsers(idOficina.value, "Revisor");
  filteredOficinas.value = listUsers.value.map(
    (e: { firstname: any; lastname: any; id: any }) => {
      return {
        label: e.colaborador,
        value: e.id,
      };
    }
  );
  originalListUser.value = listUsers.value;
  await loadUsers(idOficina.value, "Aprobador");
  filteredUsersAprob.value = listUsersAprob.value.map(
    (e: { firstname: any; lastname: any; id: any }) => {
      return {
        label: e.colaborador,
        value: e.id,
      };
    }
  );
  originalListUsersAprob.value = listUsersAprob.value;
});

const loadOficina = async () => {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoOficinas");
    if (response.status == 200 || response.status == 201) {
      listadoOficinas.value = response.data.map(
        (e: { nombre: any; id: any }) => {
          return {
            label: e.nombre,
            value: e.id,
          };
        }
      );
      listadoOficinas.value = listadoOficinas.value.filter((e) => {
        return e.value !== 26;
      });
      //filteredOficinas.value = listadoOficinas.value
    }
  } catch (error) {
    console.error(error);
  }
};

function filterUser(filterby) {
  listUsers.value = originalListUser.value.filter((e) => e.id == filterby);
}

function filterUserAprob(filterby) {
  listUsersAprob.value = originalListUsersAprob.value.filter(
    (e) => e.id == filterby
  );
}
const loadUsers = async (idOficina: number, tipoUser: string) => {
  try {
    const response = await sgdeaAxios.get(
      `/api/usuarios/rolYoficina?rolName=${tipoUser}`
    ); // &oficinaId=${idOficina}
    if (response.status == 200) {
      // const oficinaUser = listadoOficinas.value.find((e) => { return e.value == idOficina })
      const users = response.data;
      const res = users
        .map((item) => ({
          colaborador: item.firstname + " " + item.lastname,
          enabled: item.enabled,
          id: item.id,
          user: item.userName,
          cargo: item.cargo ? item.cargo.nombre : "",
          grupo:
            item.usuarioRelaciones[0]?.oficina?.nombre ||
            item.usuarioRelaciones[0]?.seccionSubSeccion?.nombre, // oficinaUser.label
        }))
        .sort((a, b) => a.colaborador.localeCompare(b.colaborador));
      if (tipoUser === "Revisor") {
        listUsers.value = res;
        originalListUser.value = res;
      } else {
        listUsersAprob.value = res;
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const columnsAsignar = [
  {
    name: "colaborador",
    label: "Colaborador",
    field: "colaborador",
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
    name: "grupo",
    label: "Grupo",
    field: "grupo",
    sortable: true,
    align: "center",
  },
];

const removeCardAsignar = (user) => {
  const indexSelection = tableSelection.value.findIndex(
    (item) => item.id == user
  );
  tableSelection.value.splice(indexSelection, 1);
  const index = cardsAsignar.value.findIndex((card) => card.user === user);
  cardsAsignar.value.splice(index, 1);
};

const removeCardAsignarAprob = (user) => {
  const indexSelection = tableSelectionAprob.value.findIndex(
    (item) => item.id == user
  );
  tableSelectionAprob.value.splice(indexSelection, 1);
  const index = cardsAsignarAprob.value.findIndex((card) => card.user === user);
  cardsAsignarAprob.value.splice(index, 1);
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

const handleAssignAprob = (array: any[]) => {
  if (array.length === 0) {
    cardsAsignarAprob.value = [];
    tableSelectionAprob.value = [];
    asignarUsuarioBody.value.usuarioAsignado = "";
    asignarUsuarioBody.value.idUser = "";
  } else {
    cardsAsignarAprob.value = array.map((item) => ({
      name: item.colaborador,
      visible: true,
      user: item.id,
    }));
    tableSelectionAprob.value = array;

    if (array.length > 0) {
      tableSelectionAprob.value = array;
      const firstSelected = array[0];
      asignarUsuarioBody.value.usuarioAsignado = firstSelected.colaborador;
      asignarUsuarioBody.value.idUser = firstSelected.id;
    }
  }
  totalUsersAprob.value = cardsAsignarAprob.value.map((e) => {
    return { label: e.name, value: e.user };
  });
};

const handleAcceptModal = async () => {
  try {
    const response = await sgdeaAxios.post(
      `/pqrd/asignarPqrdUsuarioRevisor/?idRevisor=${cardsAsignar.value[0].user}&idAsignacion=${props.pqrData.asignacionPqrdEntity.idAsignacion}&idAprobador=${cardsAsignarAprob.value[0].user}`
    );

    if (response.status == 200 || response.status == 201) {
      if (props.isChangeDoc === true) {
        await crearTrazabilidadDocumento(
          {
            htmlContent: props.pqrdDocsalida[0].htmlContent,
            usuario: auth.userInfo.name,
            rol: auth.userInfo.role,
          },
          props.pqrdDocsalida[0].id,
          "PQRD"
        );
      }

      showConfirmationModal.value = false;
      auth.userInfo.userid;
      toast.success(
        "El radicado ha sido enviado para revisión y aprobación con éxito"
      );
      await crearTrazabilidad({
        proceso: `PQRD${props.pqrData.id}`,
        secuencia: props.pqrData.idRadicado,
        estado: props.pqrData.estado.estado,
        descripcion:
          `Asignador: ${auth.$state.userInfo.name} \n` +
          `Revisor: ${cardsAsignar.value[0]?.name || ""} \n` +
          `Motivo: Se ha enviado a revisión el radicado`,
        comentario: "Enviado a Revisión",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} ha asignado el radicado ${props.pqrData.idRadicado}`,
        tramite:
          props.pqrData.informacionSolicitud.tipologiaEntity.id == 7
            ? "PQRD Express"
            : "PQRD",
      });
      await router.push("/bandeja");
    }
  } catch (error) {
    console.error(error);
  }
};

const showModalAsigna = async () => {
  if (!(await asignarRef.value.validate())) {
    toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos.");
    return;
  }

  if (!props.pqrdMetadata?.favorabilidad) {
    toast.error("Se debe ingresar todos los campos obligatorios del formulario Metadatos para enviar a revisión");
    return;
  }

  if (!props.pqrdDocsalida?.length) {
    toast.error("Se debe crear un documento de salida como respuesta al trámite a un expediente para enviar a revisión");
    return;
  }

  if (!props.pqrdDatossalida?.asunto) {
    toast.error("Se debe ingresar todos los campos obligatorios del formulario Datos de salida para enviar a revisión");
    return;
  }

  if (cardsAsignar.value.length === 0 || cardsAsignarAprob.value.length === 0) {
    toast.error("Debe seleccionar un usuario para completar la acción");
    return;
  }

  showConfirmationModal.value = true;
};

const rowSelected = ref();

const dragRevisor = (evt) => {
  const item = evt;
  const isExist =
    cardsAsignar.value.findIndex((card) => card.user === item.id) === -1;

  if (isExist) {
    cardsAsignar.value = [];
    tableSelection.value = [];
    cardsAsignar.value.push({
      name: item.colaborador,
      visible: true,
      user: item.id,
    });
    tableSelection.value.push(item);
    totalUsers.value = cardsAsignar.value;
  } else {
    toast.error("El usuario ya fue agregado");
  }
};

const dragAprobador = (evt) => {
  const item = evt;
  const isExist =
    cardsAsignarAprob.value.findIndex((card) => card.user === item.id) === -1;

  if (isExist) {
    cardsAsignarAprob.value = [];
    tableSelectionAprob.value = [];
    cardsAsignarAprob.value.push({
      name: item.colaborador,
      visible: true,
      user: item.id,
    });
    tableSelectionAprob.value.push(item);
    totalUsers.value = cardsAsignarAprob.value;
  } else {
    toast.error("El usuario ya fue agregado");
  }
};

const dropTable = (cards, selection) => {
  if (rowSelected.value) {
    // Verifica si el elemento ya está en la lista
    const exists = cards.value.some(
      (card) => card.user === rowSelected.value.id
    );
    if (!exists) {
      // Añade el nuevo elemento a la lista
      cards.value.push({
        name: rowSelected.value.colaborador,
        visible: true,
        user: rowSelected.value.id,
      });
      selection.value.push(rowSelected.value);
    } else {
      toast.error("El usuario ya fue agregado");
    }
    rowSelected.value = null; // Limpia la referencia de `rowSelected` después de agregar
  }
};
</script>
