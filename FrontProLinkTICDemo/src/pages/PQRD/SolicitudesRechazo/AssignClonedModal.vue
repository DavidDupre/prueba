<template>
  <q-dialog persistent v-bind:model-value="showModal" full-width>
    <q-card class="q-py-lg q-px-lg">
      <q-card-section class="row items-center q-pb-none justify-center">
        <q-form ref="asignarRef">
          <q-card-section default-opened>
            <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
              Asignación de usuarios clonados
            </h3>
            <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
              <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex">
                <div class="width-container tw-w-1/2 q-px-sm tw-rounded-xl" style="border: 1px solid #e3e4e5">
                  <TableAsignarPQRD :TABLE_BODY="listUsers" :TABLE_HEADER="columnsAsignar" :rowGestor="rowGestor"
                    @update:dragEvent="dragGestor" @update:handleDblClickEvent="handleDoubleClickEvent"
                    :listadoOficinas="listadoOficinas" :listadoDependencias="listadoDependencias"
                    :listadoUsuarios="listadoUsuarios" @update:item-selected="handleAssign"
                    @dependencia-selected="userDependencia" row-key="colaborador" :is-selection="false"
                    :mySelection="tableSelection" type-selection="multiple" :filtered="filteredOficinas"
                    @update:officeSelected="loadUsers" @update:userSelected="filterUsers"
                    :usuario-oficina="oficinaUser" />
                </div>
                <div class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl"
                  style="border: 1px solid #e3e4e5" @dragover.prevent @drop="dropGestor()">
                  <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
                    Este es el usuario que ha seleccionado
                  </span>
                  <div class="flex wrap tw-gap-3 q-pt-sm">
                    <div v-for="(asign, index) in cardsAsignar" :key="index">
                      <div v-if="asign.visible"
                        class="q-px-sm tw-text-base q-py-sm tw-gap-2 flex justify-between tw-text-[#2C3948] tw-rounded-3xl"
                        style="border: 1px solid #e3e4e5">
                        <q-icon size="24px" name="person_outline" />
                        {{ asign.name }}
                        <q-icon class="tw-cursor-pointer" size="24px" name="close"
                          @click="removeCardAsignar(asign.user)" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
              Motivo de Asignación
            </h3>
            <div class="row full-width wrap tw-justify-start justify-around">
              <div class="col-12 q-pt-md q-px-lg">
                <CommentTextArea v-model="asignarUsuarioBody.motivoAsignacion" :is-required="true" :max-length="1000"
                  :min-length="10" label="Observaciones" />
              </div>
            </div>
          </q-card-section>
        </q-form>
      </q-card-section>
      <q-card-actions align="center" class="q-mt-sm">
        <div class="justify-center tw-w-full tw-m-[10px] tw-mt-10 tw-mb-6 tw-flex tw-gap-4">
          <q-btn label="Cancelar" type="reset" style="width: 240px; height: 40px" text-color="black" color="accent"
            class="tw-rounded-xl" @click="$emit('update:showModal', false)" v-close-popup />
          <q-btn label="Aceptar" text-color="white" @click="handleAcceptModal" style="width: 240px; height: 40px"
            color="primary" class="tw-rounded-xl tw-btn tw-p-2" />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>

import TableAsignar from "src/pages/PQRD/Asignacion/TableAsignar.vue";
import { onMounted, ref } from "vue";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "stores/auth.store";
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";
import { useRouter } from "vue-router";
import TableAsignarPQRD from "./TableAsignarPQRD.vue";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { toast } from "src/helpers/toast";

const props = withDefaults(defineProps<{
  showModal: boolean;
  persistent: boolean;
  loading?: boolean
  dataClonados: any[];
  pqrdData: any[];
  reemplazar: boolean;
  seleccionReemplazo: any;
}>(), {
  persistent: false,
});
const emit = defineEmits(["confirmModal", "update:showModal"]);

const emitConfirmModal = () => {
  emit("confirmModal");
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
  }
];
const router = useRouter();
const tableSelection = ref([]);
const originalListUsers = ref([]);
const listUsers = ref([]);
const cardsAsignar = ref([]);
const totalUsers = ref([]);
const filteredOficinas = ref();
const listadoDependencias = ref([])
const rowSelected = ref();
const asignarUsuarioBody = ref({
  usuarioAsignado: '',
  idUser: "",
  motivoAsignacion: '',
  usuarioConsolidador: ''
});
const selectingMessage = ref("Seleccione el usuario que deseas asignar")
const rowGestor = ref();
const listadoOficinas = ref([]);
const auth = useAuthStore();
const listadoUsuarios = ref([])
const oficinaUser = ref();
const listUsersOriginal = ref([]);

onMounted(async () => {
  await loadOficina();
  await loadDependencias();
  await loadUsers(auth.userInfo.oficina || listadoOficinas.value[0]?.value)

});

const userDependencia = async (dependencia) => {
  if (!dependencia || !dependencia.value) return;
  const idDependencia = dependencia.value;
  try {
    const response = await sgdeaAxios.get(
      `/usuarios/listarusuariosdependencia?idDependencia=${idDependencia}`
    );
    const users = response.data.filter((user) => user.usuarioRelaciones.some(relacion =>
      relacion.rol && relacion.rol.nombre.toLowerCase() === "gestionador"));
    const res = users.map((item) => ({
      colaborador: item.firstname + ' ' + item.lastname,
      enabled: item.enabled,
      id: item.id,
      user: item.userName,
      cargo: item.cargo.nombre,
      oficinaData: {
        vicePresidencia: item.usuarioRelaciones[0]?.seccionSubSeccion,
        oficina: item.usuarioRelaciones[0]?.oficina?.id
      }
    })).sort((a, b) => a.colaborador.localeCompare(b.colaborador))

    listUsers.value = res.filter(user => !props.dataClonados.some(exclude => exclude.id === user.id));
  } catch (error) {
    console.error(error);
  }
};

const removeCardAsignar = (user) => {
  const indexSelection = tableSelection.value.findIndex(item => item.id == user)
  tableSelection.value.splice(indexSelection, 1)
  const index = cardsAsignar.value.findIndex(card => card.user === user);
  cardsAsignar.value.splice(index, 1);
};

const dragGestor = (evt) => {
  const item = evt;
  const isExist = cardsAsignar.value.findIndex((card) => card.user === item.id) === -1;

  if (isExist) {
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
}

const dropGestor = () => {
  if (rowGestor.value) {
    // Verifica si el elemento ya está en la lista
    const exists = cardsAsignar.value.some(card => card.user === rowGestor.value.id);
    if (!exists) {
      // Añade el nuevo elemento a la lista
      cardsAsignar.value.push({
        name: rowGestor.value.colaborador,
        visible: true,
        user: rowGestor.value.id
      });
      tableSelection.value.push(rowGestor.value);
    } else {
      toast.error("El usuario ya fue agregado");
    }
    rowGestor.value = null; // Limpia la referencia de `rowGestor` después de agregar
  }
};

// const filterUser = (filterby) => {
//   listUsers.value = originalListUsers.value.filter((e) => e.id == filterby)
// }

const handleAssign = (array: any[]) => {
  if (array.length === 0) {
    cardsAsignar.value = [];
    tableSelection.value = []
    asignarUsuarioBody.value.usuarioAsignado = '';
    asignarUsuarioBody.value.idUser = '';
  } else {
    cardsAsignar.value = array.map((item) => ({
      name: item.colaborador,
      visible: true,
      user: item.id
    }));
    tableSelection.value = array

    if (array.length > 0) {
      tableSelection.value = array
      const firstSelected = array[0];
      asignarUsuarioBody.value.usuarioAsignado = firstSelected.colaborador;
      asignarUsuarioBody.value.idUser = firstSelected.id;
    }
  }
  totalUsers.value = cardsAsignar.value.map((e) => { return { label: e.name, value: e.user } })
};

const handleAcceptModal = async () => {
  try {
    if (cardsAsignar.value.length === 0) {
      toast.error("Debes seleccionar al menos un usuario para asignar");
      return;
    }

    if (!asignarUsuarioBody.value.motivoAsignacion || asignarUsuarioBody.value.motivoAsignacion.trim().length < 10) {
      toast.error("Debes ingresar un motivo de asignación válido (mínimo 10 caracteres)");
      return;
    }

    const assignments = cardsAsignar.value.map(card => ({
      idAsignador: props.pqrdData.asignacionPqrdEntity?.asignador?.id,
      idGestionador: card.user,
      motivoAsignacion: asignarUsuarioBody.value.motivoAsignacion
    }));

    let assignmentsGesti = [];
    if (props.reemplazar) {
      assignmentsGesti = props.dataClonados
        .filter(clonados => clonados.id !== props.seleccionReemplazo)
        .map(clonados => ({
          idAsignador: props.pqrdData.asignacionPqrdEntity?.asignador?.id,
          idGestionador: clonados.id,
          motivoAsignacion: asignarUsuarioBody.value.motivoAsignacion
        }));
    }

    const allAssignments = [...assignments, ...assignmentsGesti];

    if (allAssignments.length === 0) {
      toast.error("No hay usuarios para asignar");
      return;
    }

    const response = await sgdeaAxios.post(
      `/pqrd/asignarClonador?idPqrd=${props.pqrdData.id}`,
      allAssignments
    );

    if (response.status == 200 || response.status == 201) {
      toast.success("Asignación clonada exitosa");

  await crearTrazabilidad({
    proceso: `PQRD-${props.pqrdData.id}`,
    secuencia: props.pqrdData.idRadicado,
    estado: `ASIGNADA${props.reemplazar ? '_CON_REEMPLAZO' : ''}`,
    descripcion:
      `Usuario: ${auth.$state.userInfo.name} | ` +
      `Rol: ${auth.$state.userInfo.role} | ` +
      `Acción: ${props.reemplazar ? 'Reemplazo en asignación clonada' : 'Asignación clonada'} | ` +
      `Usuarios asignados: ${cardsAsignar.value.map(u => u.name).join(', ')}` +
      `${props.reemplazar ? ' | Usuarios reemplazados: ' +
        props.dataClonados
          .filter(c => c.id !== props.seleccionReemplazo)
          .map(c => c.colaborador).join(', ') : ''}`,
    comentario: asignarUsuarioBody.value.motivoAsignacion,
    nombre: auth.$state.userInfo.name,
    tramite: "Gestión PQRD",
    accion: `${auth.$state.userInfo.name} realizó ${
      props.reemplazar ? 'reemplazo en ' : ''
    }asignación clonada ${
      props.reemplazar ? 'manteniendo ' +
      props.dataClonados.filter(c => c.id !== props.seleccionReemplazo).length +
      ' gestores' : 'para ' + cardsAsignar.value.length + ' nuevo(s) gestor(es)'
    }`
  });

  await router.push('/bandeja');
}

  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || 'Error desconocido');
  }
}

const loadDependencias = async () => {
  try {
    const response = await sgdeaAxios.get("/seccionSubSeccion")
    if (response.status == 200 || response.status == 201) {
      listadoDependencias.value = response.data.map((e: { nombre: any; idSeccionSubSeccion: any; codigo: any; }) => {
        return {
          label: e.nombre,
          value: e.idSeccionSubSeccion,
          codigo: e.codigo
        }
      }).sort((a, b) => a.label.localeCompare(b.label));
    }
  } catch (error) {
    console.error(error);
  }
}


const loadOficina = async () => {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoOficinas")
    if (response.status == 200 || response.status == 201) {
      listadoOficinas.value = response.data.map((e: { nombre: any; id: any; idDependencia: any; }) => {
        return {
          label: e.nombre,
          value: e.id,
          dependencia: e.idDependencia
        }
      }).sort((a, b) => a.label.localeCompare(b.label));
      listadoOficinas.value = listadoOficinas.value.filter((e) => { return e.value !== 26 })
      filteredOficinas.value = listadoOficinas.value
    }
  } catch (error) {
    console.error(error);
  }
}


const filterUsers = (value) => {
  listUsers.value = listUsersOriginal.value;
  listUsers.value = listUsers.value.filter(user =>
    user.id == value.value
  );
}

const loadUsers = async (idOficina: number) => {
  try {
    const response = await sgdeaAxios.get(`/api/usuarios/rolYoficina?rolName=Gestionador&oficinaId=${idOficina}`);
    if (response.status == 200) {
      oficinaUser.value = filteredOficinas.value.find((e) => { return e.value == idOficina });
      const users = response.data
      const res = users.map((item) => ({
        colaborador: item.firstname + ' ' + item.lastname,
        enabled: item.enabled,
        id: item.id,
        user: item.userName,
        cargo: item.cargo.nombre,
        grupo: oficinaUser.value.label,
        oficinaData: {
          vicePresidencia: item.usuarioRelaciones[0]?.oficina?.dependencia,
          oficina: item.usuarioRelaciones[0]?.oficina?.id
        }
      })).sort((a, b) => a.colaborador.localeCompare(b.colaborador))
      listUsers.value = res;
      listUsersOriginal.value = res;
      getUsers(users)
    }
  } catch (error) {
    console.error(error);
  }
}

const getUsers = (rows) => {
  listadoUsuarios.value = [];
  listadoUsuarios.value = rows.map(user => ({
    label: user.firstname + ' ' + user.lastname,
    value: user.id
  }));
};

const handleDoubleClickEvent = (row: any) => {
  const user = listUsers.value.find(element => element.id === row.id);
  if (user) {
    const isCardsAsignarEmpty = !cardsAsignar.value.find(element => element.user === user.id)
    if (isCardsAsignarEmpty) {
      cardsAsignar.value.push({
        user: user.id,
        name: user.colaborador,
        visible: true,
      })
    }
  }
}

const showModalAsigna = async () => {
  // if (await asignarRef.value.validate()) {
  //   // @ts-expect-error
  //   if (props.pqrdMetadata.favorabilidad) {
  //     if (props.pqrdDocsalida.length) {
  //       // @ts-expect-error
  //       if (props.pqrdDatossalida.asunto) {
  //         if (cardsAsignar.value.length !== 0) {
  //           showConfirmationModal.value = true;
  //         } else {
  //           q.notify({
  //             message: "Debe seleccionar un usuario para completar la acción",
  //             position: "top",
  //             color: "red-2",
  //             icon: "cancel",
  //             iconColor: "black",
  //             textColor: "black",
  //           });
  //         }
  //       } else {
  //         q.notify({
  //           message: "Se debe ingresar todos los campos obligatorios del formulario Datos de salida para enviar a revisión",
  //           position: "top",
  //           color: "red-2",
  //           icon: "cancel",
  //           iconColor: "black",
  //           textColor: "black",
  //         });
  //       }
  //     } else {
  //       q.notify({
  //         message: "Se debe crear un documento de salida como respuesta al trámite a un expediente para enviar a revisión",
  //         position: "top",
  //         color: "red-2",
  //         icon: "cancel",
  //         iconColor: "black",
  //         textColor: "black",
  //       });
  //     }
  //   } else {
  //     q.notify({
  //       message: "Se debe ingresar todos los campos obligatorios del formulario Metadatos para enviar a revisión",
  //       position: "top",
  //       color: "red-2",
  //       icon: "cancel",
  //       iconColor: "black",
  //       textColor: "black",
  //     });
  //   }
  // } else {
  //   q.notify({
  //     message: "Para continuar, asegúrese de que todos los campos requeridos estén completos.",
  //     position: "top",
  //     color: "red-2",
  //     icon: "cancel",
  //     iconColor: "black",
  //     textColor: "black",
  //   });
  // }
}

</script>
