<template>
  <q-form @submit.prevent="reasignarRadicado()" @validation-error="validation">
    <q-card class="tw-rounded-xl tw-mt-4" flat bordered v-if="isMetadatos">
      <q-card class="tw-rounded-xl tw-mt-4 tw-p-5" flat bordered>
        <div class="col row q-px-md">
          <b class="tw-text-lg">Reasignación</b>
        </div>

        <div class="tw-flex tw-flex-col tw-py-2 tw-px-2 tw-gap-2.5">
          <div class="tw-w-full tw-flex tw-gap-7">
            <q-card class="tw-rounded-xl tw-w-1/2" flat bordered>
              <q-card-section
                class="tw-flex tw-flex-col tw-items-start tw-justify-between tw-gap-2.5 -tw-mb-4"
              >
                <span class="tw-font-bold tw-text-lg">
                  Seleccionar los usuarios que desea asignar al radicado
                </span>

                <div
                  class="tw-flex tw-items-center tw-justify-between tw-w-full"
                  v-if="props?.rol?.toLowerCase().includes('gestionador')"
                >
                  <div class="tw-flex tw-flex-col tw-gap-0.5 tw-w-[80%]">
                    <span class="text-weight-bold">Filtrar por Usuario</span>
                    <q-select
                      outlined
                      dense
                      map-options
                      emit-value
                      use-input
                      fill-input
                      :options="users.dataSearch"
                      name="usuario"
                      label="Seleccione"
                      v-model="users.search"
                      class="tw-w-full"
                      option-label="label"
                      hide-selected
                      @filter="users.filter"
                      @update:model-value="users.clearFilter"
                      option-value="label"
                      clearable
                    >
                      <template v-slot:prepend>
                        <q-icon name="search" />
                      </template>
                    </q-select>
                  </div>
                </div>
              </q-card-section>

              <q-card-section>
                <q-table
                  flat
                  :rows="users.data"
                  :columns="columms"
                  table-header-class="text-black text-h6"
                  class="full-width !tw-h-[410px] my-sticky-header-table"
                  row-key="id"
                  virtual-scroll
                  :pagination="pagination"
                  rows-per-page-label="Páginas"
                  selection="single"
                  v-model:selected="users.selection"
                  @selection="users.clearFieldsOfTime"
                  @update:dragEvent="dragGestor"
                >
                  <template
                    v-slot:body-cell-colaborador="props"
                    :draggable="true"
                    auto-width
                    class="tw-bg-blue"
                  >
                    <td
                      class="tw-text-center tw-bg-orange -cursor-pointer"
                      :draggable="true"
                      @dragstart="dragGestor(props.row)"
                    >
                      {{ props.row.label }}
                    </td>
                  </template>
                </q-table>
              </q-card-section>
            </q-card>
            <q-card
              class="tw-rounded-xl tw-w-1/2"
              flat
              bordered
              @dragover.prevent
              @drop="dropGestor()"
            >
              <q-card-section class="tw-flex tw-items-center">
                <span class="tw-font-bold tw-text-lg">
                  Estos son los usuarios que ha seleccionado
                </span>
              </q-card-section>

              <q-card-section>
                <q-chip
                  v-if="users.selection.length"
                  removable
                  @remove="users.removeSelection()"
                  icon="person"
                  outline
                  color="secondary"
                  :style="[users.isErrors ? 'display:none' : '']"
                >
                  {{
                    `${users.selection[0].firstname} ${users.selection[0].lastname}`
                  }}
                </q-chip>
              </q-card-section>
            </q-card>
          </div>

          <div class="text-negative" role="alert" v-if="users.isErrors">
            Debe ingresar los datos “Tiempo trámite por gestionador
          </div>
        </div>
      </q-card>

      <q-card class="tw-rounded-xl tw-mt-4 tw-p-5" flat bordered>
        <div class="col row">
          <b class="tw-text-lg">Motivo de Reasignación</b>
        </div>

        <div class="row q-col-gutter-md q-pb-md q-mt-sm">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <CommentTextArea
              v-model="motivoAsignacion.val.value"
              :is-required="true"
              :max-length="10000"
              :min-length="10"
              label="Observaciones"
            />
          </div>
        </div>
      </q-card>
    </q-card>

    <div
      v-if="isMetadatos"
      class="col row justify-center q-gutter-x-md q-mt-lg"
    >
      <q-btn
        color="accent"
        type="button"
        label="Cancelar"
        class="tw-rounded-xl"
        style="width: 240px; height: 40px"
        text-color="black"
        no-caps
        @click="modals.cancel.toggle()"
      />

      <q-btn
        color="primary"
        text-color="white"
        type="submit"
        label="Reasignar"
        style="width: 240px; height: 40px"
        class="tw-rounded-xl tw-btn tw-p-2"
        no-caps
      />
    </div>
  </q-form>
  <Modal
    v-model="modals.cancel.status"
    title="¡Espera un momento!"
    :is-success="false"
    @handleAccept="emit('change-view')"
    cancel-button
    textButtonCancel="No"
    textButton="Si"
    text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
    type="button"
  />
</template>

<script lang="ts" setup>
import {
  UserByRolAndIdOfficinaI,
  OficinaI,
  InfoGeneral,
} from "src/pages/EntesDeControl/Bandeja/Detalles/types";
import {
  inputRequired,
  maxLengthInput,
  minLengthInputCustom,
} from "src/helpers/validations";
import { validateInputTiempoTramite } from "src/pages/EntesDeControl/Bandeja/Detalles/utils";
import { columms } from "src/pages/EntesDeControl/Bandeja/Detalles/Reasignar/data";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { onMounted, reactive, ref, watchEffect } from "vue";
import { useAuthStore } from "src/stores/auth.store";
import { useRoute, useRouter } from "vue-router";
import Modal from "components/Modal/Modal.vue";
import { toast } from "src/helpers/toast";
import { sgdeaAxios } from "src/services";
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";

/*-----------------------ACTIVACIONES-------------------------
------------------------------------------------------------*/
const props = defineProps<{ informacionGeneral: InfoGeneral; rol: string }>();
const emit = defineEmits(["error-metada", "change-view", "update:dragEvent"]);
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

/*-----------------------VARIABLES---------------------------
------------------------------------------------------------*/
const idOficinaGerenciaJuridica = ref<number>();
const ente_id = route.params.id;
const isMetadatos = ref(false);
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 8,
  // rowsNumber: xx if getting data from a server
});

idOficinaGerenciaJuridica.value = authStore.userInfo.relations.find(
  (user: any) => {
    return user.oficina.toLowerCase().includes("jurídica");
  }
).idOficina;

const motivoAsignacion = {
  val: ref(""),
  refs: ref<any>(null),
  rules: [
    inputRequired,
    (val) => minLengthInputCustom(10, val, "campo"),
    (v) => maxLengthInput(1000, v),
  ],
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
    if (val === "")
      return update(() => {
        oficinas.data = oficinas.clone;
      });

    return update(() => {
      oficinas.data = oficinas.clone.filter(
        (oficina: { label: string } & OficinaI) => {
          return oficina.label.toLowerCase().indexOf(val.toLowerCase()) > -1;
        }
      );
    });
  },
});

const users = reactive({
  data: <UserByRolAndIdOfficinaI[]>[],
  dataSearch: <UserByRolAndIdOfficinaI[]>[],
  dataSearchClone: <UserByRolAndIdOfficinaI[]>[],
  selection: <UserByRolAndIdOfficinaI[]>[],
  search: <string>"",
  clearFilter: (val: string) => {
    if (val == null || val == "") users.data = users.dataSearchClone;
  },
  filter: (val: string, update: (arg: Function) => void) => {
    if (val == "" || val == null)
      return update(() => {
        users.dataSearch = users.dataSearchClone;
      });

    return update(() => {
      users.dataSearch = users.dataSearchClone.filter(
        (oficina: { label: string } & UserByRolAndIdOfficinaI) => {
          return oficina.label.toLowerCase().indexOf(val.toLowerCase()) > -1;
        }
      );
    });
  },
  removeSelection: () => {
    users.data = users.data.map((user: UserByRolAndIdOfficinaI) => {
      if (user.id == users.selection[0].id) {
        if (user.cargo.toLowerCase().includes("gestionador")) {
          user.unidadTiempo = "";
          user.valorTiempo = "";

          //Quitamos los errores
          user.unidadTiempoRefs?.resetValidation();
          user.valorTiempoRefs?.resetValidation();
        }
      }
      return user;
    });
    users.selection.splice(0, 1);
  },
  clearFieldsOfTime: (scope) => {
    users.data.forEach((user) => {
      if (user.unidadTiempo != undefined) {
        user.unidadTiempo = "";
        user.valorTiempo = "";

        user.unidadTiempoRefs?.resetValidation();
        user.valorTiempoRefs?.resetValidation();
      }
    });
  },
  changeProperty: (
    row: UserByRolAndIdOfficinaI,
    field: "unidadTiempo" | "valorTiempo"
  ) => {
    users.selection.map((user) => {
      if (user.id == row.id) {
        user[field] = row[field];
        return user;
      }
    });
  },
  isErrors: false,
});

/*-----------------------FUNCIONES---------------------------
------------------------------------------------------------*/

const validation = () => {

  const validate = motivoAsignacion.val.value == "";

  if (!users.selection.length) {
    toast.error("Debe seleccionar un usuario para completar la acción");
  }

  if (validate && users.selection.length) {
    toast.error(
      "Para continuar, asegúrese de que todos los campos requeridos estén completos."
    );
  }
};

const getOneUserGestionadorByRol = (users: any) => {
  const user = users.find((user) =>
    user.rol.nombre.toLowerCase().includes("gestionador")
  );
  return user.rol.nombre;
};
/*-----------------------SERVICIOS----------------------------
------------------------------------------------------------*/
const newTrazabilidad = async (isGesti = false) => {
  const comentario = `${motivoAsignacion.val.value} - ${
    isGesti ? "Reasignado" : "Asignado"
  }`;
  const accion = isGesti
    ? `Se ha reasignado el radicado`
    : `Se ha asignado el radicado`;
  const descripcion = isGesti
    ? `ha reasignado al radicado`
    : `ha asignado el radicado`;

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

const rowGestor = ref();
// onBeforeMount(async () => await );
const dragGestor = (row: any) => {
  rowGestor.value = row;
  users.selection = [];
  const newRow = { ...row, selected: true };
  users.selection.push(newRow);
  emit("update:dragEvent", row);
};

const dropGestor = () => {
  const user = users.data.find((element) => element.id === rowGestor.value.id);

  if (user) {
    const exists = users.selection.some((element) => element.id === user.id);
    if (!exists) {
      users.selection.push(user);
    }
  }
};

const reasignarRadicado = () => {
  const urlTwo = `/api/entes/reasignar-gestionador`;
  const user = users.selection[0];
  sgdeaAxios
    .patch(urlTwo, {
      motivoReasignacion: motivoAsignacion.val.value,
      idAsignador: user.id,
      enteId: Number(ente_id),
    })
    .then(async (res) => {
      await newTrazabilidad(true);
      toast.success("El radicado ha sido reasignado con éxito");
      setTimeout(() => router.push("/bandeja"), 400);
    })
    .catch(async (err) => {
      toast.error("Ha ocurrido un error al reasignar el radicado");
    });
};

const getOfficinas = () => {
  const url = `/oficinas/all`;
  sgdeaAxios
    .get<OficinaI[]>(url)
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

const getUserBYOfficinas = (oficinaId: number, rol = "Gestionador") => {
  const url = `/api/usuarios/rolYoficina?oficinaId=${oficinaId}&rolName=${rol}`;
  let gestionadores = [];
  let otros = [];

  sgdeaAxios
    .get<UserByRolAndIdOfficinaI[]>(url)
    .then((res) => {
      res.data
        .map((user) => {
          user.cargo = getOneUserGestionadorByRol(user.usuarioRelaciones);
          user.label = `${user.firstname} ${user.lastname}`;

          if (user.cargo.toLowerCase().includes("gestionador")) {
            user.unidadTiempo = "";
            user.valorTiempo = "";
          }
          return user;
        })
        .filter((user) => user.id != authStore.userInfo.userid)
        .forEach((user) => {
          if (user.cargo.toLowerCase().includes("gestionador")) {
            gestionadores.push(user);
          } else otros.push(user);
        });

      gestionadores.sort((a, b) => a.label.localeCompare(b.label));
      otros.sort((a, b) => a.label.localeCompare(b.label));

      users.data = [...gestionadores, ...otros];
      users.dataSearch = users.data;
      users.dataSearchClone = users.data;
    })
    .catch((err) => {
      toast.error("Ha ocurrido un error al buscar los usuarios");
    });
};

const getMetadata = () => {
  const url = `api/entes/getMetadatosByEnteControlId/${ente_id}`;
  return sgdeaAxios.get(url);
};

/*-----------------------WATCHS-------------------------------
------------------------------------------------------------*/
watchEffect(() => {
  if (oficinas.selection) {
    getUserBYOfficinas(oficinas.selection);
  }
  if (users.search) {
    users.data = users.dataSearchClone.filter(
      (user: UserByRolAndIdOfficinaI) => {
        return (
          user.label.toLowerCase().indexOf(users.search?.toLowerCase()) > -1
        );
      }
    );
  }
});

/*-----------------------INICIALIZACION-----------------------
------------------------------------------------------------*/
onMounted(() => {
  getMetadata()
    .then(() => {
      isMetadatos.value = true;
      getOfficinas();
      getUserBYOfficinas(idOficinaGerenciaJuridica.value);
    })
    .catch(() => {
      emit("error-metada");
      isMetadatos.value = false;
      toast.error("Debe ingresar los metadatos para poder completar la acción");
    });
});
</script>
