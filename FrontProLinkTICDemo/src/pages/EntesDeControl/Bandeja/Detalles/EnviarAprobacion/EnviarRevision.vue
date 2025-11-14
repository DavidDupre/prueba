<template>
  <!-- Enviar revisión  -->
  <q-card class="tw-rounded-xl tw-mt-4" flat bordered v-if="isMetadatos">
    <q-card class="tw-rounded-xl tw-mt-4 tw-p-5" flat bordered>
      <div class="col row q-px-md">
        <b class="tw-text-lg"
          >{{ isAprobacion ? "Enviar a Aprobación" : "Enviar a Revisión" }}
        </b>
      </div>

      <div class="tw-flex tw-flex-col tw-py-2 tw-px-2 tw-gap-2.5">
        <div class="tw-w-full tw-flex tw-gap-7">
          <q-card class="tw-rounded-xl tw-w-1/2" flat bordered>
            <q-card-section
              class="tw-flex tw-flex-col tw-items-start tw-justify-between tw-gap-2.5 -tw-mb-4"
            >
              <span class="tw-font-bold tw-text-lg">
                Seleccionar los usuarios que desea asignar
              </span>

              <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
                <div class="tw-flex tw-flex-col tw-gap-0.5 tw-w-[100%]">
                  <span class="text-weight-bold">Filtrar por Usuario</span>
                  <q-select
                    outlined
                    dense
                    map-options
                    emit-value
                    use-input
                    fill-input
                    :options="usersRevision.dataSearch"
                    name="usuario"
                    label="Seleccione"
                    v-model="usersRevision.search"
                    class="tw-w-full"
                    option-label="label"
                    hide-selected
                    @filter="usersRevision.filter"
                    @update:model-value="usersRevision.clearFilter"
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
                :rows="usersRevision.data"
                :columns="columms"
                table-header-class="text-black text-h6"
                class="full-width !tw-h-[410px] my-sticky-header-table"
                row-key="id"
                virtual-scroll
                :pagination="pagination"
                rows-per-page-label="Páginas"
                selection="single"
                v-model:selected="usersRevision.selection"
              >
                <template v-slot:body-cell="props">
                  <q-td
                    :props="props"
                    :draggable="props.row.id != rowEnvRev.id"
                    @dragstart="dragEnvRev(props.row)"
                  >
                    {{ props.value }}
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
          <q-card class="tw-rounded-xl tw-w-1/2" flat bordered>
            <q-card-section class="tw-flex tw-items-center">
              <span class="tw-font-bold tw-text-lg">
                Estos son los usuarios que ha seleccionado
              </span>
            </q-card-section>

            <q-card-section
              @drop="dropEnvRev"
              @dragover.prevent
              class="tw-w-full tw-h-full"
            >
              <q-chip
                v-if="usersRevision.selection.length"
                removable
                @remove="usersRevision.removeSelection()"
                icon="person"
                outline
                color="secondary"
              >
                {{
                  `${usersRevision.selection[0].firstname} ${usersRevision.selection[0].lastname}`
                }}
              </q-chip>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-card>

    <q-card class="tw-rounded-xl tw-mt-4 tw-p-5" flat bordered>
      <div class="col row">
        <b class="tw-text-lg">Motivo de Asignación</b>
      </div>

      <div class="row q-col-gutter-md q-pb-md q-mt-sm">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <CommentTextArea
            v-model="motivoAsignacionRevision.val.value"
            :is-required="true"
            :max-length="10000"
            :min-length="10"
            label="Observaciones"
          />
        </div>
      </div>
    </q-card>
  </q-card>

  <!-- Enviar aprobacion  -->
  <div>
    <q-card class="tw-rounded-xl tw-mt-4" flat bordered v-if="isMetadatos">
      <q-card class="tw-rounded-xl tw-mt-4 tw-p-5" flat bordered>
        <div class="col row q-px-md">
          <b class="tw-text-lg"> Enviar a Aprobación </b>
        </div>

        <div class="tw-flex tw-flex-col tw-py-2 tw-px-2 tw-gap-2.5">
          <div class="tw-w-full tw-flex tw-gap-7">
            <q-card class="tw-rounded-xl tw-w-1/2" flat bordered>
              <q-card-section
                class="tw-flex tw-flex-col tw-items-start tw-justify-between tw-gap-2.5 -tw-mb-4"
              >
                <span class="tw-font-bold tw-text-lg">
                  Seleccionar los usuarios que desea asignar
                </span>

                <div
                  class="tw-flex tw-items-center tw-justify-between tw-w-full"
                >
                  <div class="tw-flex tw-flex-col tw-gap-0.5 tw-w-[100%]">
                    <span class="text-weight-bold">Filtrar por Usuario</span>
                    <q-select
                      outlined
                      dense
                      map-options
                      emit-value
                      use-input
                      fill-input
                      :options="usersAprobacion.dataSearch"
                      name="usuario"
                      label="Seleccione"
                      v-model="usersAprobacion.search"
                      class="tw-w-full"
                      option-label="label"
                      hide-selected
                      @filter="usersAprobacion.filter"
                      @update:model-value="usersAprobacion.clearFilter"
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
                  :rows="usersAprobacion.data"
                  :columns="columms"
                  table-header-class="text-black text-h6"
                  class="full-width !tw-h-[410px] my-sticky-header-table"
                  row-key="id"
                  virtual-scroll
                  :pagination="pagination"
                  rows-per-page-label="Páginas"
                  selection="single"
                  v-model:selected="usersAprobacion.selection"
                >
                  <template v-slot:body-cell="props">
                    <q-td
                      :props="props"
                      :draggable="props.row.id != rowEnvApro.id"
                      @dragstart="dragEnvApro(props.row)"
                    >
                      {{ props.value }}
                    </q-td>
                  </template>
                </q-table>
              </q-card-section>
            </q-card>
            <q-card class="tw-rounded-xl tw-w-1/2" flat bordered>
              <q-card-section class="tw-flex tw-items-center">
                <span class="tw-font-bold tw-text-lg">
                  Estos son los usuarios que ha seleccionado
                </span>
              </q-card-section>

              <q-card-section
                @drop="dropEnvApro"
                @dragover.prevent
                class="tw-w-full tw-h-full"
              >
                <q-chip
                  v-if="usersAprobacion.selection.length"
                  removable
                  @remove="usersAprobacion.removeSelection()"
                  icon="person"
                  outline
                  color="secondary"
                >
                  {{
                    `${usersAprobacion.selection[0].firstname} ${usersAprobacion.selection[0].lastname}`
                  }}
                </q-chip>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card>

      <q-card class="tw-rounded-xl tw-mt-4 tw-p-5" flat bordered>
        <div class="col row">
          <b class="tw-text-lg">Motivo de Asignación</b>
        </div>

        <div class="row q-col-gutter-md q-pb-md q-mt-sm">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <CommentTextArea
              v-model="motivoAsignacionAprobacion.val.value"
              :is-required="true"
              :max-length="1000"
              :min-length="10"
              label="Observaciones"
            />
          </div>
        </div>
      </q-card>
    </q-card>
  </div>

  <div v-if="isMetadatos" class="col row justify-center q-gutter-x-md q-mt-lg">
    <q-btn
      color="accent"
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
      label="Asignar"
      style="width: 240px; height: 40px"
      class="tw-rounded-xl tw-btn tw-p-2"
      no-caps
      @click="enviarRevision()"
    />
  </div>
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
import { columms } from "src/pages/EntesDeControl/Bandeja/Detalles/EnviarAprobacion/data";
import {
  inputRequired,
  maxLengthInput,
  minLengthInputCustom,
} from "src/helpers/validations";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { onMounted, reactive, ref, watchEffect } from "vue";
import { useAuthStore } from "src/stores/auth.store";
import { useRoute, useRouter } from "vue-router";
import Modal from "components/Modal/Modal.vue";
import { toast } from "src/helpers/toast";
import { sgdeaAxios } from "src/services";
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";
import { crearTrazabilidadDocumento } from "src/helpers/trazabilidadDocumento";

/*-----------------------ACTIVACIONES-------------------------
------------------------------------------------------------*/
const props = defineProps<{
  informacionGeneral: InfoGeneral;
  isAprobacion: boolean;
  documento: any;
  documentoEntes: any;
}>();
const emit = defineEmits([
  "error-metada",
  "error-expediente",
  "error-datos-salida",
  "change-view",
]);
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

/*-----------------------VARIABLES---------------------------
------------------------------------------------------------*/
const ente_id = route.params.id;
const hastDocumentoDatosSalida = ref(false);
const idOficinaGerenciaJuridica = ref<number>();
const hasExpediente = ref(false);
const isMetadatos = ref(false);
const rowEnvApro = ref<any>({ id: 0 });
const rowEnvRev = ref<any>({ id: 0 });
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 8,
  // rowsNumber: xx if getting data from a server
});
const rowGestor = ref();

const motivoAsignacionRevision = {
  val: ref(""),
  refs: ref<any>(null),
  rules: [
    inputRequired,
    (val) => minLengthInputCustom(10, val, "campo"),
    (v) => maxLengthInput(1000, v),
  ],
};

const motivoAsignacionAprobacion = {
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

// const dragGestor = (row: any) => {
//   rowGestor.value = row
// }

// const dropGestor = () => {
//   const user = usersRevision.selection.find(element => element.id === rowGestor.value.id);
//   const isCardsAsignarEmpty = !cardsAsignar.value.find(element => element.user === user.id)
//   if (user && isCardsAsignarEmpty) {
//     cardsAsignar.value.push({
//       user: user.id,
//       name: user.colaborador,
//       visible: true,
//     })
//   }
// }

const dragEnvRev = (row) => {
  rowEnvRev.value = row;
};
const dropEnvRev = () => {
  usersRevision.selection = [rowEnvRev.value];
};

const dragEnvApro = (row) => {
  rowEnvApro.value = row;
};
const dropEnvApro = () => {
  usersAprobacion.selection = [rowEnvApro.value];
};

idOficinaGerenciaJuridica.value = authStore.userInfo.oficina

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

const usersRevision = reactive({
  data: <UserByRolAndIdOfficinaI[]>[],
  dataSearch: <UserByRolAndIdOfficinaI[]>[],
  dataSearchClone: <UserByRolAndIdOfficinaI[]>[],
  selection: <UserByRolAndIdOfficinaI[]>[],
  search: <string>"",
  clearFilter: (val: string) => {
    if (val == null || val == "")
      usersRevision.data = usersRevision.dataSearchClone;
  },
  filter: (val: string, update: (arg: Function) => void) => {
    if (val == "" || val == null)
      return update(() => {
        usersRevision.dataSearch = usersRevision.dataSearchClone;
      });

    return update(() => {
      usersRevision.dataSearch = usersRevision.dataSearchClone.filter(
        (oficina: { label: string } & UserByRolAndIdOfficinaI) => {
          return oficina.label.toLowerCase().indexOf(val.toLowerCase()) > -1;
        }
      );
    });
  },
  removeSelection: () => {
    usersRevision.selection.splice(0, 1);
  },
});

const usersAprobacion = reactive({
  data: <UserByRolAndIdOfficinaI[]>[],
  dataSearch: <UserByRolAndIdOfficinaI[]>[],
  dataSearchClone: <UserByRolAndIdOfficinaI[]>[],
  selection: <UserByRolAndIdOfficinaI[]>[],
  search: <string>"",
  clearFilter: (val: string) => {
    if (val == null || val == "")
      usersAprobacion.data = usersAprobacion.dataSearchClone;
  },
  filter: (val: string, update: (arg: Function) => void) => {
    if (val == "" || val == null)
      return update(() => {
        usersAprobacion.dataSearch = usersAprobacion.dataSearchClone;
      });

    return update(() => {
      usersAprobacion.dataSearch = usersAprobacion.dataSearchClone.filter(
        (oficina: { label: string } & UserByRolAndIdOfficinaI) => {
          return oficina.label.toLowerCase().indexOf(val.toLowerCase()) > -1;
        }
      );
    });
  },
  removeSelection: () => {
    usersAprobacion.selection.splice(0, 1);
  },
});

/*-----------------------FUNCIONES---------------------------
------------------------------------------------------------*/

const validation = (action: Function) => {
  motivoAsignacionRevision.refs.value?.validate();
  motivoAsignacionAprobacion.refs.value?.validate();

  const validate =
    !motivoAsignacionRevision.refs.value?.hasError &&
    !motivoAsignacionAprobacion.refs.value?.hasError;

  if (validate) {
    if (usersRevision.selection.length && usersAprobacion.selection.length)
      action();
    else toast.error("Debe seleccionar un usuario para completar la acción");
  } else {
    toast.error(
      "Para continuar, asegúrese de que todos los campos requeridos estén completos."
    );
  }
};

const getOneUserRevisorByRol = (users: any) => {
  const user = users.find((user) =>
    user.rol.nombre.toLowerCase().includes("revisor")
  );
  return user.rol.nombre;
};
/*-----------------------SERVICIOS----------------------------
------------------------------------------------------------*/
const newTrazabilidad = async () => {
  const comentario = "Enviado a aprobación";
  const accion = "Se ha enviado a aprobación el radicado";
  const descripcion = `Usuario: ${authStore.userInfo.name}, Ha enviado a aprobación el radicado`;

  await crearTrazabilidad({
    proceso: `ENTC${props.informacionGeneral.id}`,
    secuencia: props.informacionGeneral.nroRadicado,
    estado: "Por Revisar",
    nombre: authStore.userInfo.name,
    tramite: "Entes de Control",
    descripcion,
    comentario,
    accion,
  });
};

const enviarRevision = () => {
  validation(() => {
    const accion = {
      aprobacion: "aprobacion",
      revision: "revision",
    };
    //TODO: cambiar a la nueva url para enviar revision y aprobacion
    const url = `/api/entes/enviar/${
      props.isAprobacion ? accion.aprobacion : accion.revision
    }`;
    const userRevision = usersRevision.selection[0];
    const userAprobacion = usersAprobacion.selection[0];
    sgdeaAxios
      .patch(url, {
        idUsuario: userRevision.id,
        idAprobador: userAprobacion.id,
        motivoAsignacion: motivoAsignacionRevision.val.value,
        enteId: Number(ente_id),
      })
      .then(async (res) => {
        await newTrazabilidad();
        crearTrazabilidadDocumento(
          {
            htmlContent: props.documento,
            usuario: authStore.userInfo.name,
            rol: authStore.userInfo.role,
          },
          props.documentoEntes,
          "ML"
        );
        toast.success("El radicado ha sido enviado para revisión con éxito");
        setTimeout(() => router.push("/bandeja"), 400);
      })
      .catch((err) => {
        toast.error("Ha ocurrido un error al asignar el radicado");
      });
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

const getUserBYOfficinas = async (rol = "Revisor") => {
  const url = rol !== "Aprobador" ? `/api/usuarios/rolYoficina?oficinaId=${idOficinaGerenciaJuridica.value}&rolName=${rol}` : `/api/usuarios/rolYoficina?rolName=${rol}`;
  return sgdeaAxios
    .get<UserByRolAndIdOfficinaI[]>(url)
    .then((response) => {
      if (rol === "Revisor") {
        usersRevision.data = response.data

          .map((user) => ({
            ...user,
            cargo: getOneUserRevisorByRol(user.usuarioRelaciones),
            unidadTiempo: "",
            valorTiempo: "",
            label: `${user.firstname} ${user.lastname}`,
            value: user.id,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        usersRevision.dataSearch = usersRevision.data;
        usersRevision.dataSearchClone = usersRevision.data;
      }
      if (rol === "Aprobador") {
        usersAprobacion.data = response.data
          .map((user) => ({
            ...user,
            cargo: getOneUserAprobadorByRol(user.usuarioRelaciones),
            unidadTiempo: "",
            valorTiempo: "",
            label: `${user.firstname} ${user.lastname}`,
            value: user.id,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        usersAprobacion.dataSearch = usersAprobacion.data;
        usersAprobacion.dataSearchClone = usersAprobacion.data;
      }
    })
    .catch((err) => {
      toast.error("Ha ocurrido un error al buscar los usuarios");
    });
};

const getOneUserAprobadorByRol = (users: any) => {
  const user = users.find((user) =>
    user.rol.nombre.toLowerCase().includes("aprobador")
  );
  return user.rol.nombre;
};

const getMetadata = () => {
  const url = `api/entes/getMetadatosByEnteControlId/${ente_id}`;
  return sgdeaAxios.get(url);
};

const getDatosSalida = () => {
  return sgdeaAxios.get(`api/entes/obtener-datos-salida/${ente_id}`);
};

const getDocumentoSalida = () => {
  return sgdeaAxios.get(`/api/entes/listadoDocsSalida/${ente_id}`, {
    showLoader: false,
  });
};

const getExpediente = () => {
  return sgdeaAxios.get("/expediente/children", {
    params: { nodeId: props.informacionGeneral.nodeID },
  });
};
/*-----------------------WATCHS-------------------------------
------------------------------------------------------------*/
watchEffect(() => {
  if (oficinas.selection) {
    getUserBYOfficinas();
  }

  if (usersRevision.search) {
    usersRevision.data = usersRevision.dataSearchClone.filter(
      (user: UserByRolAndIdOfficinaI) => {
        return (
          user.label
            .toLowerCase()
            .indexOf(usersRevision.search?.toLowerCase()) > -1
        );
      }
    );
  }

  if (usersAprobacion.search) {
    usersAprobacion.data = usersAprobacion.dataSearchClone.filter(
      (user: UserByRolAndIdOfficinaI) => {
        return (
          user.label
            .toLowerCase()
            .indexOf(usersAprobacion.search?.toLowerCase()) > -1
        );
      }
    );
  }

  if (props.isAprobacion !== undefined) {
    getMetadata()
      .then(() => {
        isMetadatos.value = true;
        getOfficinas();
        getUserBYOfficinas();
      })
      .catch(() => {
        emit("error-metada");
        isMetadatos.value = false;
        toast.error(
          "Debe ingresar los metadatos para poder completar la acción"
        );
      });
  }
});

/*-----------------------INICIALIZACION-----------------------
------------------------------------------------------------*/
onMounted(async () => {
  await getMetadata()
    .then((response) => {
      if (!response.data?.marcacion || !response.data?.favorabilidad)
        isMetadatos.value = false;
      else isMetadatos.value = true;
    })
    .catch(() => {
      isMetadatos.value = false;
    });

  if (!isMetadatos.value) {
    emit("error-metada");
    return toast.error(
      "Debe ingresar los metadatos para poder completar la acciòn"
    );
  }

  try {
    const datosSalida = await getDatosSalida();
    if (datosSalida.data.id) {
      const Documento = await getDocumentoSalida();
      if (!Documento?.data) hastDocumentoDatosSalida.value = false;
      else hastDocumentoDatosSalida.value = true;
    }
  } catch (error) {
    hastDocumentoDatosSalida.value = false;
  }
  if (!hastDocumentoDatosSalida.value) {
    emit("error-datos-salida");
    return toast.error(
      "Debe diligenciar los datos y el documento de salida para poder completar la acción"
    );
  }

  try {
    const expediente = await getExpediente();
    if (!expediente?.data) hasExpediente.value = false;
    else hasExpediente.value = true;
  } catch (error) {
    hasExpediente.value = false;
  }
  if (!hasExpediente.value) {
    emit("error-expediente");
    return toast.error("Documento pendiente de inclusión en expediente");
  }

  if (
    isMetadatos.value &&
    hastDocumentoDatosSalida.value &&
    hasExpediente.value
  ) {
    getOfficinas();
    getUserBYOfficinas();
    getUserBYOfficinas("Aprobador");
  }
});
</script>
