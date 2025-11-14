<template>
  <div class="q-pb-md q-px-md tw-mt-5">
    <a @click="emit('backView', true)" class="tw-text-primary tw-cursor-pointer" style="text-decoration: none">
      <q-icon size="1.5em" name="chevron_left" color="primary" />
      <b> Volver </b>
    </a>
    <div class="col row">
      <h3 class="pl-4 tw-font-bold tw-text-3xl tw-mt-5 tw-mb-3 text-bold">
        {{
          props.detailsRadicado.estado === "Por revisar" &&
            props.detailsRadicado.asignador === false
            ? "Editar Revisor"
            : props.detailsRadicado.estado === "Por aprobar" &&
              props.detailsRadicado.asignador === false
              ? "Editar Aprobador"
              : props.detailsRadicado.asignador != null &&
                props.detailsRadicado.asignador === true
                ? "Editar Asignador"
                : "Editar Gestionador "
        }}
      </h3>
    </div>
    <q-card class="tw-px-4 tw-pt-2 tw-pb-4 tw-rounded-xl" flat>
      <div class="col row">
        <h5 class="pl-4 tw-font-bold tw-text-2xl tw-mt-5 tw-mb-3 text-bold">
          {{
            props.detailsRadicado.estado === "Por revisar" &&
              props.detailsRadicado.asignador === false
              ? "Revisor Actual "
              : props.detailsRadicado.estado === "Por aprobar" &&
                props.detailsRadicado.asignador === false
                ? "Aprobador Actual"
                : props.detailsRadicado.asignador != null &&
                  props.detailsRadicado.asignador === true
                  ? "Asignador Actual "
                  : "Gestionador Actual"
          }}
        </h5>
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-6">
          <label class="q-px-md tw-text-label">
            <div class="tw-text-lg tw-font-semibold">Nombre</div>
            <div class="tw-text-lg tw-font-semibold tw-mt-2">
              {{
                (props.detailsRadicado.estado ===
                  props.detailsRadicado.asignador) !=
                  null && props.detailsRadicado.asignador === true
                  ? props.detailsRadicado.nombreAsignadorResponsable
                  : props.detailsRadicado.nombreUsuario
              }}
            </div>
          </label>
        </div>
        <div class="col-6">
          <label class="q-px-md tw-text-label">
            <div class="tw-text-lg tw-font-semibold">Oficina</div>
            <div class="tw-text-lg tw-font-semibold tw-mt-2">
              {{
                (props.detailsRadicado.estado ===
                  props.detailsRadicado.asignador) !=
                  null && props.detailsRadicado.asignador === true
                  ? props.detailsRadicado.nombreOficinaResponsable
                  : props.detailsRadicado.nombreOficina
              }}
            </div>
          </label>
        </div>
      </div>
    </q-card>

    <section>
      <div class="tw-bg-white q-mt-lg tw-rounded-md">
        <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex tw-flex-row">
          <div class="width-container tw-w-1/2 q-px-sm tw-rounded-xl overflow-hidden" style="border: 1px solid #e3e4e5">
            <TableAsignar :TABLE_BODY="listUsers" :TABLE_HEADER="columnsAsignarOfficina"
              @update:dragEvent="dragAsignar" @update:handleDblClickEvent="handleDoubleClickEvent" :is-admin-tramite="false" :detailsRadicado="props.detailsRadicado"
              :listado-offices="filteredOffice" @update:item-selected="handleAssign" row-key="id" :is-selection="false" :listadoUsuarios="listadoUsuarios"
              type-selection="single" @update:office-selected="filterItem" @update:userSelected="filterUsers"/>
          </div>
          <div class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl" style="border: 1px solid #e3e4e5"
            @dragover.prevent @drop="dropGestor()">
            <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
              Esta es la oficina que ha seleccionado
            </span>
            <div class="flex wrap tw-gap-3 q-pt-sm">
              <div v-for="(asign, index) in cardsAsignar" :key="index">
                <div v-if="asign.visible"
                  class="q-px-sm tw-text-base q-py-sm tw-gap-2 flex justify-between tw-text-[#2C3948] tw-rounded-3xl"
                  style="border: 1px solid #e3e4e5">
                  <q-icon size="24px" name="person_outline" />
                  {{ asign.name }}
                  <q-icon class="tw-cursor-pointer" size="24px" name="close" @click="removeCardAsignar(index)" />
                </div>
              </div>
              <div v-if="cardsAsignar.length === 0" class="tw-text-red-500 text-weight-bold">
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
                <label class="q-px-md tw-text-label">Observaciones *
                  <q-input type="textarea" outlined label="Inserte" dense emit-value v-model="form.observaciones"
                    :rules="[
                      inputRequired,
                      alphanumeric,
                      (v) => maxLengthInput(1000, v),
                    ]" />
                </label>
              </div>
            </div>
          </div>
          <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
            <q-btn class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]" no-caps
              style="border: 1px solid #2c3948" @click="emit('backView', true)" label="Cancelar" />
            <q-btn class="tw-w-1/4 tw-h-11 bg-primary text-white" @click="confirmAsignar" label="Asignar" />
          </div>
        </q-form>
      </div>
      <Modal v-model="confirmModal" title="Confirmación" persistent :text="'Está seguro de asignar el radicad'"
        :is-success="true" :cancelButton="true" @closeModal="confirmModal = false" textButtonCancel="No"
        text-button="Si" @handleAccept="" />
      <Modal v-model="cancelModal" title="Confirmación" :is-success="false" @handleAccept="$emit('backView')"
        cancel-button textButtonCancel="No" textButton="Si"
        text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
        @close-modal="cancelModal = false" type="button" />
    </section>
  </div>
</template>

<script setup lang="ts">
import Modal from "src/components/Modal/Modal.vue";
import TableAsignar from "./TableReasignar.vue";
import { toast } from "src/helpers/toast";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import {
  alphanumeric,
  inputRequired,
  maxLengthInput,
} from "src/helpers/validations";
import { columnsAsignarOfficina } from "src/pages/Facturacion/cobro";

import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";

const props = withDefaults(
  defineProps<{
    type: string;
    detailsRadicado: any;
    perfilLabel: string;
  }>(),
  {
    perfilLabel: ''
  }
);

const cancelModal = ref(false);
const confirmModal = ref(false);
const { getUserInfo } = useAuthStore();
const userInfo = ref();

const selection = ref([]);
const listOffice = ref([]);
const filteredOffice = ref()
const originalListUser = ref()
const listUsersOriginal = ref([]);
const searchHelpDataFiltered = ref([]);
const cardsAsignar = ref([]);
const opForUsers = ref();
const selectOficina = ref("");
const oficinas = ref([]);
const filterValue = ref("");

const router = useRouter();
const searchUsuariosList = ref("");
const formRef = ref();
const listUsers = ref([]);
const listadoUsuarios = ref([])
const auth = useAuthStore()

const form = ref({
  observaciones: "",
  usuarios: [],
});




const emit = defineEmits(["findDocs", "backView", "uptadeTable"]);

function filterItem(filterby) {
  listOffice.value = originalListUser.value.filter((e) => e.id == filterby)
}

const handleAssign = (array: any[]) => {
  cardsAsignar.value = array.map((item) => ({
    name: item.colaborador,
    visible: true,
    user: item.id
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

const loadOffice = async () => {
  try {
    const response = await sgdeaAxios.get(`/pqrd/listadoOficinas`)

    const officeList = response.data.map((e) => { return { label: e.nombre, value: e.id} }).filter((e: { value: number; }) => e.value !== 26)
    const res = response.data.map((e) => {
      return {
        oficinas: e.nombre,
        id: e.id
      }
    }).filter((e: { value: number; }) => e.value !== 26)
    listOffice.value = res
    filteredOffice.value = officeList
    originalListUser.value = listOffice.value
  } catch (error) {
    toast.error("Ha ocurrido un error al cargar las oficinas")
  }
}

const loadUsers = async (idOficina: number) => {
  try {

    let rolName: string;

    switch (props.perfilLabel) {
      case 'Revisor':
        rolName = 'Revisor';
        break;
      case 'Aprobador':
        rolName = 'Aprobador';
        break;
      default:
        rolName = 'Gestionador';
    }

    const response = await sgdeaAxios.get(`/api/usuarios/rolYoficina?rolName=${rolName}&oficinaId=${idOficina}`);
    if (response.status == 200) {
      const oficinaUser = filteredOffice.value.find((e) => { return e.value == idOficina })
      const users = response.data
      const res = users.map((item) => ({
        colaborador: item.firstname + ' ' + item.lastname,
        enabled: item.enabled,
        id: item.id,
        user: item.userName,
        cargo: item.cargo.nombre,
        grupo: oficinaUser.label,
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
    console.error(error)
  }
}

const filterUsers = (value) => {
  listUsers.value = listUsersOriginal.value;
  listUsers.value = listUsers.value.filter(user =>
    user.id == value.value
  );
}


const getUsers = (rows) => {
  listadoUsuarios.value = [];
  listadoUsuarios.value = rows.map(user => ({
    label: user.firstname + ' ' + user.lastname,
    value: user.id
  }));
};

const handleTramiteChange = async (newValue?) => {
  const rolName =
    props.detailsRadicado.estado === "Por revisar" &&
      props.detailsRadicado.asignador === false
      ? "Revisor"
      : props.detailsRadicado.estado === "Por aprobar" &&
        props.detailsRadicado.asignador === false
        ? "Aprobador"
        : props.detailsRadicado.asignador != null &&
          props.detailsRadicado.asignador === true
          ? "Asignador Responsable"
          : "Gestionador";

  const oficinaId = newValue?.value || props.detailsRadicado.idOficina;

  const { data } = await sgdeaAxios.get(
    `/api/usuarios/rolYoficina?rolName=${rolName}&oficinaId=${oficinaId}`
  );

  listUsersOriginal.value = data
    .filter((item) => item.id !== userInfo.value.userid && item.firstname + " " + item.lastname !== currentAssignee.value)
    .map((item) => ({
      colaborador: item.firstname + " " + item.lastname,
      enabled: item.enabled,
      id: item.id,
      user: item.userName,
      cargo: rolName,
      grupo: newValue?.label || props.detailsRadicado.nombreOficina,
    }))
    .sort((a, b) => a.colaborador.localeCompare(b.colaborador));

  opForUsers.value = listUsersOriginal.value.map((row) => {
    return { label: row.colaborador, value: row.id };
  });

  // Actualiza searchHelpDataFiltered
  searchHelpDataFiltered.value = opForUsers.value;
};


const dropGestor = () => {
  const user = listOffice.value.find(element => element.id === rowAsignar.value.id);
  const isCardsAsignarEmpty = !cardsAsignar.value.find(element => element.user === user.id)
  if (user && isCardsAsignarEmpty) {
    cardsAsignar.value.push({
      user: user.id,
      name: user.oficinas,
      visible: true,
    })
  }
}

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
const handleDoubleClickEvent = (row: any) => {
  const office = listOffice.value.find(element => element.id === row.id);

  const isCardsAsignarEmpty = !cardsAsignar.value.find(element => element.office === office.id)
  if (office && isCardsAsignarEmpty) {
    cardsAsignar.value.push({
      user: office.id,
      name: office.oficinas,
      visible: true,
    })
  }
}

const rowAsignar = ref();
const dragAsignar = (row) => {
  rowAsignar.value = row;
};

const removeCardAsignar = (index) => {
  cardsAsignar.value.splice(index, 1);
  selection.value.splice(index, 1);
};

const confirmAsignar = async () => {
  try {
    const valid = await formRef.value.validate();
    if (!valid) {
      toast.error('Debe diligenciar todos los campos obligatorios');
      return;
    }

    const rolName =
      props.detailsRadicado.estado === "Por revisar" &&
        props.detailsRadicado.asignador === false
        ? "REVISOR"
        : props.detailsRadicado.estado === "Por aprobar" &&
          props.detailsRadicado.asignador === false
          ? "APROBADOR"
          : props.detailsRadicado.asignador != null &&
            props.detailsRadicado.asignador === true
            ? "ASIGNADOR_RESPONSABLE"
            : "GESTIONADOR";
    if (cardsAsignar.value.length === 0) {
      toast.error("Debe seleccionar un usuario para completar la acción");
      return;
    }
    var proceso = "";
    var id = props.detailsRadicado.entidadId;

    switch (props.detailsRadicado.idFlujo) {
      case "PQRD":
        proceso = "PQRD";

        break;
      case "ENTES_CONTROL":
        proceso = "ENTC";

        break;
      case "TUTELAS":
        proceso = "TUT";

        break;
      case "MEDICINA_LABORAL":
        proceso = "ML";

        break;
      case "CORRESPONDENCIA_COMUNICACION":
        proceso = "COR";

        break;
      case "CORRESPONDENCIA_RADICACION":
        proceso = "COR";

        break;
      case "CORRESPONDENCIA_MANUAL":
        proceso = "COR";

        break;
      case "FACTURACION_ADMINISTRATIVA":
        proceso = "FAC";
        id = props.detailsRadicado.subEntidadId;
        break;
      case "CUENTA_COBRO":
        proceso = "CTO";
        id = props.detailsRadicado.subEntidadId;
        break;

      default:
        break;
    }

    const response = await sgdeaAxios.patch(
      `/administracion-tramite/actualizarUsuarioMasivamenteSegunPerfil`,
      {
        usuarioId: cardsAsignar.value[0]?.user,
        perfil: rolName,
        observacion: form.value.observaciones,
        flujo: props.detailsRadicado.idFlujo,
        listaMasivaIdFlujo: [id],
      }
    );

    if (response.status == 200) {
      const radicacion = props.detailsRadicado;
      await crearTrazabilidad({
        proceso: `${proceso}${radicacion.entidadId}`,
        secuencia: radicacion.numeroRadicado,
        estado: radicacion.estado,
        descripcion: "Se ha reasignado el radicado",
        comentario: "Asignado",
        nombre: userInfo.value.name,
        tramite: radicacion.tipoTramite,
        accion: "El trámite ha sido Asignado",
      });
      cardsAsignar.value = [];
      selection.value = [];
      toast.success("Asignado con éxito");
      emit("backView", true);
    }
  } catch (error) {
    toast.error("Ha ocurrido un error al momento de hacer la asignación");
  }
};
const goBack = () => {
  router.back(); // Navega de vuelta a la pantalla anterior
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
  await loadOffice();
  await loadUsers(auth.userInfo.oficina)

  // Carga los usuarios de la oficina actual
  //await handleTramiteChange(selectOficina.value);
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
