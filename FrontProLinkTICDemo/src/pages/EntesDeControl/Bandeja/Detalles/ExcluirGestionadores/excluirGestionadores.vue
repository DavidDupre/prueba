<template>
  <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
    <q-card class="tw-rounded-xl tw-mt-4 tw-p-5" flat bordered>
      <div class="col row q-px-md">
        <b class="tw-text-lg">Exclusión
        </b>
      </div>

      <div class="tw-flex tw-flex-col tw-py-2 tw-px-2 tw-gap-2.5">
        <div class="tw-w-full tw-flex tw-gap-7">
          <q-card class="tw-rounded-xl tw-w-1/2" flat bordered>
            <q-card-section class="tw-flex tw-flex-col tw-items-start tw-justify-between tw-gap-2.5 -tw-mb-4">
              <span class="tw-font-bold tw-text-lg">
                Seleccionar los usuarios que desea excluir del caso
              </span>

              <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
                <div class="tw-flex tw-flex-col tw-gap-0.5 tw-w-[100%]">
                  <span class="text-weight-bold">Filtrar por Usuario</span>
                  <q-select outlined dense map-options emit-value use-input fill-input :options="users.dataSearch"
                    name="usuario" label="Seleccione" v-model="users.search" class="tw-w-full" option-label="label"
                    hide-selected @filter="users.filter" @update:model-value="users.clearFilter" option-value="label"
                    clearable>
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                  </q-select>
                </div>
              </div>
            </q-card-section>

            <q-card-section>
              <q-table flat :rows="users.data" :columns="columms" table-header-class="text-black text-h6"
                class="full-width !tw-h-[410px] my-sticky-header-table" row-key="id" virtual-scroll
                :pagination="pagination" rows-per-page-label="Páginas" selection="multiple"
                v-model:selected="users.selection">
              </q-table>
            </q-card-section>
          </q-card>
          <q-card class="tw-rounded-xl tw-w-1/2" flat bordered>
            <q-card-section class="tw-flex tw-items-center">
              <span class="tw-font-bold tw-text-lg">
                Estos son los usuarios que ha seleccionado
              </span>
            </q-card-section>

            <q-card-section>
              <q-chip v-for="user in users.selection" :key="user.id" removable @remove="users.removeSelection()"
                icon="person" outline color="secondary">
                {{ `${user.firstname} ${user.lastname}` }}
              </q-chip>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-card>

    <q-card class="tw-rounded-xl tw-mt-4 tw-p-5" flat bordered>
      <div class="col row">
        <b class="tw-text-lg">Motivo de Exclusión</b>
      </div>

      <div class="row q-col-gutter-md q-pb-md q-mt-sm">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <CommentTextArea v-model="motivoExclusion.val.value" :is-required="true" :max-length="10000"
            label="Observaciones" />
        </div>
      </div>
    </q-card>
  </q-card>

  <div class="col row justify-center q-gutter-x-md q-mt-lg">
    <q-btn color="accent" label="Cancelar" class="tw-rounded-xl" style="width: 240px; height: 40px;" text-color="black"
      no-caps @click="modals.cancel.toggle()" />

    <q-btn color="primary" text-color="white" label="Excluir" style="width: 240px; height: 40px;"
      class="tw-rounded-xl tw-btn tw-p-2" no-caps @click="excluirGestionador()" />
  </div>
  <Modal v-model="modals.cancel.status" title="¡Espera un momento!" :is-success="false"
    @handleAccept="emit('change-view')" cancel-button textButtonCancel="No" textButton="Si"
    text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
    type="button" />
</template>

<script lang="ts" setup>
import { UserByRolAndIdOfficinaI, OficinaI, InfoGeneral } from "src/pages/EntesDeControl/Bandeja/Detalles/types";
import { columms } from "./data";
import { inputRequired, maxLengthInput } from "src/helpers/validations";
import { onMounted, reactive, ref, watchEffect, computed } from "vue";
import { crearTrazabilidad } from 'src/helpers/trazabilidad';
import { useAuthStore } from "src/stores/auth.store";
import { useRoute, useRouter } from "vue-router";
import Modal from "components/Modal/Modal.vue";
import { toast } from "src/helpers/toast";
import { sgdeaAxios } from "src/services";
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";


/*-----------------------ACTIVACIONES-------------------------
------------------------------------------------------------*/
const props = defineProps<{ informacionGeneral: InfoGeneral }>();
const emit = defineEmits(['change-view']);
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

/*-----------------------VARIABLES---------------------------
------------------------------------------------------------*/
const ente_id = route.params.id;
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 8
  // rowsNumber: xx if getting data from a server
});
const motivoExclusion = {
  val: ref(""),
  refs: ref<any>(null),
  rules: [inputRequired, (v) => maxLengthInput(1000, v)],
};

const modals = reactive({
  cancel: {
    status: false,
    toggle: () => (modals.cancel.status = !modals.cancel.status),
  },
});

const oficinas = reactive({
  data: <OficinaI[]>[],
  clone: <OficinaI[]>[],
  selection: <number | null>null,
  filter: (val: string, update: (arg: Function) => void) => {
    if (val === '') return update(() => {
      oficinas.data = oficinas.clone;
    });

    return update(() => {
      oficinas.data = oficinas.clone.filter((oficina: { label: string } & OficinaI) => {
        return oficina.label.toLowerCase().indexOf(val.toLowerCase()) > -1
      });
    });
  },
});

const users = reactive({
  data: <UserByRolAndIdOfficinaI[]>[],
  dataSearch: <UserByRolAndIdOfficinaI[]>[],
  dataSearchClone: <UserByRolAndIdOfficinaI[]>[],
  selection: <UserByRolAndIdOfficinaI[]>[],
  search: <string>'',
  clearFilter: (val: string) => {
    if (val == null || val == '') users.data = users.dataSearchClone;
  },
  filter: (val: string, update: (arg: Function) => void) => {
    if (val == '' || val == null) return update(() => {
      users.dataSearch = users.dataSearchClone;
    });

    return update(() => {
      users.dataSearch = users.dataSearchClone.filter((oficina: { label: string } & UserByRolAndIdOfficinaI) => {
        return oficina.label.toLowerCase().indexOf(val.toLowerCase()) > -1
      });
    })
  },
  removeSelection: () => {
    users.selection.splice(0, 1);
  },
});

/*-----------------------FUNCIONES---------------------------
------------------------------------------------------------*/

const validation = (action: Function) => {
  motivoExclusion.refs.value?.validate();

  const validate = !motivoExclusion.refs.value?.hasError;

  if (validate) {
    if (users.selection.length) action();
    else toast.error("Debe seleccionar un usuario para completar la acción");
  } else {
    toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos.");
  }
};

const getOneUserAprobadorByRol = (users: any) => {
  const user = users.find((user) =>
    user.rol.nombre.toLowerCase().includes("gestionador")
  );
  return user?.rol.nombre;
};
/*-----------------------SERVICIOS----------------------------
------------------------------------------------------------*/
const newTrazabilidad = async () => {
  const usersNames = users.selection.map(user => user.fullname).join(", ")

  const comentario = 'Gestionador excluido';
  const accion = 'Se han excluido usuarios de la gestión del radicado';
  const descripcion = 'Se excluyeron los siguientes usuarios de la gestión del radicado: ' + usersNames;

  await crearTrazabilidad({
    proceso: `ENTC${props.informacionGeneral.id}`,
    secuencia: props.informacionGeneral.nroRadicado,
    estado: props.informacionGeneral.estado.estado,
    nombre: authStore.userInfo.name,
    tramite: "Entes de Control",
    descripcion,
    comentario,
    accion,
  });
};

const excluirGestionador = () => {
  validation(() => {
    const url = `${process.env.API}/api/entes/consolidador/excluirClonacion/${ente_id}`;
    fetch(`${url}`, {
      method: "delete",
      body: JSON.stringify({
        gestionadores: users.selection.map(selection => selection.id),
        motivoExclusion: motivoExclusion.val.value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(async (res) => {
      await newTrazabilidad();
      toast.success("El usuario fue excluido de la clonación con éxito");
      emit('change-view')
      // setTimeout(() => router.push("/bandeja"), 400);
    }).catch((err) => {
      toast.error("Ha ocurrido un error al excluir el usuario");
    });
  })
};

const getOfficinas = () => {
  const url = `/oficinas/all`;
  sgdeaAxios.get<OficinaI[]>(url)
    .then((res) => {
      oficinas.data = res.data.map((oficina) => ({
        ...oficina,
        label: oficina.nombre,
        nombre: oficina.nombre,
        value: oficina.id,
      }));
      oficinas.clone = oficinas.data;
    })
    .catch((err) => {
      toast.error("Ha ocurrido un error al buscar las oficinas");
    });
};

const getUserBYOfficinas = (rol = "Gestionador") => {
  const url = `roles/usuarios?rol=${rol}`;
  sgdeaAxios.get<UserByRolAndIdOfficinaI[]>(url)
    .then((res) => {
      users.data = res.data
        .map((user) => {
          return {
            ...user,
            cargo: getOneUserAprobadorByRol(user.usuarioRelaciones),
            unidadTiempo: "",
            valorTiempo: "",
            label: `${user.firstname} ${user.lastname}`,
            value: user.id,
          }
        })
        .filter(user =>
          props.informacionGeneral.asignaciones.some(asignaciones =>
            !["Excluido"].includes(asignaciones.estado) &&
            asignaciones.idGestionador === user.id && authStore.userInfo.userid !== user.id))
        .sort((a, b) => a.label.localeCompare(b.label));

      users.dataSearch = users.data;
      users.dataSearchClone = users.data;
    })
    .catch((err) => {
      console.error(err)
      toast.error("Ha ocurrido un error al buscar los usuarios");
    });
};
/*-----------------------WATCHS-------------------------------
------------------------------------------------------------*/
watchEffect(() => {
  if (oficinas.selection) {
    getUserBYOfficinas();
  }
  if (users.search) {
    users.data = users.dataSearchClone.filter((user: UserByRolAndIdOfficinaI) => {
      return user.label.toLowerCase().indexOf(users.search?.toLowerCase()) > -1
    });
  }
});

/*-----------------------INICIALIZACION-----------------------
------------------------------------------------------------*/
onMounted(() => {
  getOfficinas();
  getUserBYOfficinas();
});
</script>
