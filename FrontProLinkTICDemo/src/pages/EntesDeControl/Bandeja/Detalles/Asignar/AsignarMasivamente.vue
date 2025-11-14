<template>
  <q-dialog v-model="props.status" @update:model-value="[resetModal()]" full-width persistent>
    <q-card class="bg-white">
      <q-card-section class="tw-py-4">
        <b class="tw-text-xl">Asignación Masiva</b>
      </q-card-section>
      <q-separator />
      <q-card-section style="max-height: 70vh" class="tw-rounded-xl scroll">
        <q-card class="tw-rounded-xl tw-mt-4 tw-px-5" flat bordered>
          <div class="tw-flex tw-justify-between tw-w-1/2 tw-h-[60px]">
            <q-checkbox v-model="tiempoGestionador.check.value" label="Tiempo por gestionador"
              @update:model-value="tiempoGestionador.clearCheck" />

            <div class="tw-grid 2xl:tw-flex tw-content-cente tw-items-center 2xl:tw-gap-2.5"
              v-show="!tiempoGestionador.check.value">
              <label>Tiempo de Trámite *</label>
              <div class="tw-flex tw-gap-2.5 2xl:tw-mt-[5px] tw-items-center">
                <q-select :ref="(val) => (tiempoGestionador.unidadTiempo.ref.value = val)"
                  v-model="tiempoGestionador.unidadTiempo.val.value"
                  @update:model-value="()=> tiempoGestionador.changeCheck(tiempoGestionador.valorTiempo.val.value, tiempoGestionador)"
                  :rules="[inputRequiredWithoutValue]" label="Tipo de Tiempo Trámite" :options="tipoTiempoTramites"
                  class="tw-w-[100px] tw-pb-0" map-options outlined dense />

                <q-input :disable="!tiempoGestionador.unidadTiempo.val.value"
                  :ref="(val) => (tiempoGestionador.valorTiempo.ref.value = val)"
                  @update:model-value="(val) => tiempoGestionador.changeCheck(val, tiempoGestionador)"
                  v-model="tiempoGestionador.valorTiempo.val.value" :rules="[inputRequiredWithoutValue]"
                  label="Valor de Tiempo Trámite" class="tw-w-[75px] tw-pb-0" :maxlength="2" type="text" outlined
                  dense />
              </div>
            </div>
          </div>
          <div class="tw-flex tw-flex-col tw-py-2 tw-px-2 tw-gap-2.5">
            <div class="tw-w-full tw-flex tw-gap-7">
              <q-card class="tw-rounded-xl tw-w-1/2" flat bordered>
                <q-card-section class="tw-flex tw-flex-col tw-items-start tw-justify-between tw-gap-2.5 -tw-mb-4">
                  <span class="tw-font-bold tw-text-lg">
                    Seleccionar los usuarios que desea asignar al radicado
                  </span>

                  <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
                    <div class="tw-flex tw-flex-col tw-gap-0.5 tw-w-full">
                      <span class="text-weight-bold">Filtrar por Usuario</span>
                      <q-select outlined dense map-options emit-value use-input fill-input :options="oficinas.data"
                        name="dias" label="Seleccione" v-model="oficinas.selection" class="tw-w-full"
                        option-label="nombre" hide-selected @filter="oficinas.filter">
                        <template v-slot:prepend>
                          <q-icon name="search" />
                        </template>
                      </q-select>
                    </div>
                  </div>
                </q-card-section>

                <q-card-section>
                  <q-table flat :rows="users.data" :columns="columms" table-header-class="text-black text-h6"
                    virtual-scroll-slice-size="7" class="full-width !tw-h-[410px]my-sticky-header-table" row-key="id"
                    virtual-scroll :pagination="pagination" :rows-per-page-options="[8, 16, 32, 64, 128, 256]"
                    selection="multiple" v-model:selected="users.multiSelection"
                    @update:selected="users.verifyErrorsInTime" @selection="users.clearFieldsOfTime"
                    rows-per-page-label="Páginas">
                    <template v-slot:body-cell-tiempo-tramite="scope">
                      <q-td :props="scope">
                        <div class="tw-flex tw-h-[40px]" v-show="tiempoGestionador.check.value">
                          <q-select outlined dense map-options v-model="scope.row.unidadTiempo"
                            :options="tipoTiempoTramites" label="Tipo" name="type-time" :disable="!scope.selected"
                            class="tw-w-[110px]" :ref="(val) => (scope.row.unidadTiempoRefs = val)"
                            :rules="[inputRequiredWithoutValue]" @update:model-value="
                              (val) => updateInputUnidadTiempo(val, scope)
                            " />

                          <q-input outlined dense type="text" v-model="scope.row.valorTiempo" label="valor"
                            class="tw-w-[85px]" :disable="!scope.selected || !scope.row.unidadTiempo" :maxlength="2"
                            :ref="(val) => (scope.row.valorTiempoRefs = val)" :rules="[inputRequiredWithoutValue]"
                            @update:model-value="
                              (val) => updateInputValorTiempo(String(val), scope)
                            " />
                        </div>
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

                <q-card-section>
                  <q-chip v-for="(user, index) in users.multiSelection" :key="index" removable
                    @remove="users.removeMultiSelection(index, user.id)" icon="person" outline color="secondary" :style="[
                      user.valorTiempo == '' || user.unidadTiempo == ''
                        ? 'display:none'
                        : '',
                    ]">
                    {{`${user.firstname} ${user.lastname}`}}
                  </q-chip>
                </q-card-section>
              </q-card>
            </div>

            <div class="text-negative" role="alert" v-if="users.isErrors">
              Debe ingresar los datos Tiempo Trámite por gestionador
            </div>
          </div>
        </q-card>

        <q-card class="tw-rounded-xl tw-mt-4 tw-p-5" flat bordered>
          <div class="col row" v-if="users.multiSelection.length > 1">
            <b class="tw-text-lg">Consolidador *</b>
          </div>

          <div class="row q-col-gutter-md q-pb-md q-mt-sm" v-if="users.multiSelection.length > 1">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <span class="text-weight-bold">Seleccione el usuario consolidador *</span>
              <q-select :ref="(val) => (consolidador.refs.value = val)" :options="consolidador.data.value"
                v-model="consolidador.val.value" @filter="consolidador.filter" :rules="consolidador.rules"
                name="consolidador" label="Seleccione" class="tw-w-full" hide-selected map-options emit-value fill-input
                use-input clearable outlined dense />
            </div>
          </div>

          <div class="col row">
            <b class="tw-text-lg">Motivo de Asignación</b>
          </div>
          <div class="row q-col-gutter-md q-pb-md q-mt-sm">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <CommentTextArea v-model="motivoAsignacion.val.value" :is-required="true" :max-length="10000"
                    label="Observaciones" />
            </div>
          </div>
        </q-card>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="col row justify-center q-gutter-x-md q-my-sm">
        <q-btn color="accent" label="Cancelar" class="tw-rounded-xl" style="width: 240px; height: 40px"
          text-color="black" :disabled="loading" @click="modals.cancel.toggle()" no-caps />

        <q-btn color="primary" text-color="white" label="Asignar" style="width: 240px; height: 40px"
          class="tw-rounded-xl tw-btn tw-p-2" no-caps @click="asignarRadicado()" />
        <Modal v-model="modals.cancel.status" title="¡Espera un momento!" :is-success="false"
          @handleAccept="[emit('toggle', 'cancel'), resetModal()]" cancel-button textButtonCancel="No" textButton="Si"
          text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?" />
      </q-card-actions>
    </q-card>

  </q-dialog>
</template>

<script lang="ts" setup>
import {UserByRolAndIdOfficinaI, OficinaI } from "src/pages/EntesDeControl/Bandeja/Detalles/types";
import { validateInputTiempoTramite, validateInputTiempoTramiteTwo, maxValorTiempo } from "src/pages/EntesDeControl/Bandeja/Detalles/utils";
import {columms, tipoTiempoTramites } from "src/pages/EntesDeControl/Bandeja/Detalles/Asignar/data";
import {inputRequiredWithoutValue, inputRequired, maxLengthInput } from "src/helpers/validations";
import { onMounted, reactive, ref, watchEffect, toRaw } from "vue";
// import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { useAuthStore } from "src/stores/auth.store";
// import { useRoute, useRouter } from "vue-router";
import Modal from "components/Modal/Modal.vue";
import { keyBy } from "src/helpers/general";
import { toast } from "src/helpers/toast";
import { sgdeaAxios } from "src/services";
import CommentTextArea from  "src/shared/components/TextArea/Comments.vue";


/*-----------------------ACTIVACIONES-------------------------
------------------------------------------------------------*/
const props = defineProps<{ /*informacionGeneral: InfoGeneral*/ status: boolean, idsEntes:number[] }>();
const emit = defineEmits(["toggle"]);
const authStore = useAuthStore();
// const router = useRouter();
// const route = useRoute();

/*-----------------------VARIABLES---------------------------
------------------------------------------------------------*/
// const ente_id = route.params.id;
const loading = ref(false);
const entesIds = ref([]);
const idOficinaGerenciaJuridica = ref<number>();
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 8,
  // rowsNumber: xx if getting data from a server
});

idOficinaGerenciaJuridica.value = authStore.userInfo.relations.find((user: any) => {
  return user.oficina?.toLowerCase().includes('jurídica')
})?.idOficina || 18;

const motivoAsignacion = {
  val: ref(""),
  refs: ref(null),
  rules: [inputRequired, (v) => maxLengthInput(1000, v)],
};

const modals = reactive({
  cancel: {
    status: false,
    toggle: () => (modals.cancel.status = !modals.cancel.status),
  },
});

const tiempoGestionador = {
  check: ref(false),
  unidadTiempo: {
    val: ref(''),
    ref: ref(null),
  },
  valorTiempo: {
    val: ref(''),
    ref: ref(null),
  },
  changeCheck: (val, row) => {
    validateInputTiempoTramiteTwo(val, row);
    tiempoGestionador.updateUsers();
  },
  updateUsers: (resetValidation=false) => {
    users.multiSelection.map((user)=> {
       user.unidadTiempo = tiempoGestionador.unidadTiempo.val.value;
       user.valorTiempo = tiempoGestionador.valorTiempo.val.value;
       return user;
    });

    setTimeout(()=>{
      users.data.map((user) => {
        user.unidadTiempo = tiempoGestionador.unidadTiempo.val.value;
        user.valorTiempo = tiempoGestionador.valorTiempo.val.value;
        if(resetValidation) setTimeout(()=>{
          user.unidadTiempoRefs?.resetValidation();
          user.valorTiempoRefs?.resetValidation();
        }, 10)

        return user;
      });

      if(!resetValidation) users.verifyErrorsInTime();
    }, 100)

  },
  clearCheck: () => {
    tiempoGestionador.unidadTiempo.val.value = '';
    tiempoGestionador.valorTiempo.val.value = '';
    tiempoGestionador.unidadTiempo.ref.value?.resetValidation();
    tiempoGestionador.valorTiempo.ref.value?.resetValidation();

    tiempoGestionador.updateUsers();
  },
};

const consolidador = {
  val: ref(""),
  refs: ref<any>(null),
  rules: [inputRequired],
  data: ref<{ label: string; value: number }[]>([]),
  filter: (val: string, update: (arg: Function) => void) => {
    if (val === "") {
      return update(() => {
        consolidador.data.value = users.multiSelection.map((user) => ({
          label: `${user.firstname} ${user.lastname}`,
          value: user.id,
        }));
      });
    }

    return update(() => {
      consolidador.data.value = consolidador.data.value.filter((v) => {
        return v.label.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    });
  },
};

const oficinas = reactive({
  data: <OficinaI[]>[],
  clone: <OficinaI[]>[],
  selection: <OficinaI | null>null,
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
  multiSelection: <UserByRolAndIdOfficinaI[]>[],
  removeMultiSelection: (index: number, id:number) => {
    users.multiSelection.splice(index, 1);
    users.data.forEach((user) => {
      if(user.id == id) {
        user.unidadTiempo = "";
        user.valorTiempo = "";

        user.unidadTiempoRefs?.resetValidation();
        user.valorTiempoRefs?.resetValidation();

        if (!tiempoGestionador.check.value) {
          user.unidadTiempo = tiempoGestionador.unidadTiempo.val.value;
          user.valorTiempo = tiempoGestionador.valorTiempo.val.value;
        }
      }
    })
  },
  clearFieldsOfTime: (scope) => {
    if (!scope.added) {
      scope.rows[0].unidadTiempo = "";
      scope.rows[0].valorTiempo = "";

      // Quitamos los errores
      scope.rows[0]?.unidadTiempoRefs?.resetValidation();
      scope.rows[0]?.valorTiempoRefs?.resetValidation();
    }

    if (!tiempoGestionador.check.value) {
      scope.rows[0].unidadTiempo = tiempoGestionador.unidadTiempo.val.value;
      scope.rows[0].valorTiempo = tiempoGestionador.valorTiempo.val.value;
    }
  },
  verifyErrorsInTime: () => {
    users.isErrors = users.multiSelection.some((user) => {
      return user.valorTiempo == "" || user.unidadTiempo == "";
    });
  },
  changeProperty: (
    row: UserByRolAndIdOfficinaI,
    field: "unidadTiempo" | "valorTiempo"
  ) => {
    users.multiSelection.map((user) => {
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
const validateMaxConsolidador = () => {
  const findUsersWithMaxTime = () => {
    const dias = users.multiSelection.filter(user => user.unidadTiempo.includes('D'));
    const horas = users.multiSelection.filter(user => user.unidadTiempo.includes('H'));

    const maxDias = maxValorTiempo(dias);
    const maxHoras = maxValorTiempo(horas);

    if (maxDias.usuarios.length) return maxDias.usuarios;
    else return maxHoras.usuarios;
  };

  const result = findUsersWithMaxTime().filter((user) => {
    return user.id == consolidador.val.value
  });

  return result.length;
}

const validation = (action: Function) => {
  motivoAsignacion.refs.value?.validate();
  consolidador.refs.value?.validate();

  users.data.forEach((user: any) => {
    if (!user?.selected) {
      user.unidadTiempoRefs?.validate();
      user.valorTiempoRefs?.validate();
    }
  });

  const validate =
    !motivoAsignacion.refs.value?.hasError &&
    !consolidador.refs.value?.hasError &&
    !users.isErrors;

  if (validate) {
    if (users.multiSelection.length != 0) action();
    else toast.error("Debe seleccionar un usuario para completar la acción");
  } else
    toast.error(
      "Para continuar, asegúrese de que todos los campos requeridos estén completos."
    );
};

const updateInputUnidadTiempo = (val: string, scope) => {
  validateInputTiempoTramite(val, scope.row);
  users.changeProperty(scope.row, "unidadTiempo");
  users.verifyErrorsInTime();
};

const updateInputValorTiempo = (val: string, scope) => {
  validateInputTiempoTramite(val, scope.row);
  users.changeProperty(scope.row, "valorTiempo");
  users.verifyErrorsInTime();
};

const getOneUserGestionadorByRol = (users: any) => {
  const user = users.find((user) =>
    user.rol.nombre.toLowerCase().includes("gestionador")
  );
  return user.rol.nombre;
};

const resetModal = () => {
  setTimeout(()=>{
    tiempoGestionador.check.value = false;
    motivoAsignacion.val.value = '';
    modals.cancel.status = false;

    tiempoGestionador.clearCheck();
    users.data.map((user) => ({...user, selection:false} ));
    users.multiSelection = [];
  }, 400);
}
/*-----------------------SERVICIOS----------------------------
------------------------------------------------------------*/
// const newTrazabilidad = async (user: any, isOne = false) => {
//   const comentario = isOne ? "Asignado" : "Clonado";
//   const accion = isOne
//     ? `Se ha asignado el radicado`
//     : `Se ha clonado el radicado`;
//   const descripcion = isOne
//     ? `Ha asignado a ${user.label} al radicado`
//     : `Ha clonado el radicado`;

//   await crearTrazabilidad({
//     proceso: `ENTC${props.informacionGeneral.id}`,
//     secuencia: props.informacionGeneral.nroRadicado,
//     estado: props.informacionGeneral.estado.estado,
//     nombre: authStore.userInfo.name,
//     tramite: "Ente de Control",
//     descripcion,
//     comentario,
//     accion,
//   });
// };

const asignarRadicado = () => {
  validation(() => {
    const queryMeny = `?consolidador=${consolidador.val.value}`;
    const urlMeny = `/api/entes/clonacionMasiva${queryMeny}`;
    loading.value = true;

    const urlOne = `/api/entes/asignacionMasiva`;
    const user = users.multiSelection[0];

    if (users.multiSelection.length > 1) {
      if(validateMaxConsolidador()) {
        const usersRequest = toRaw(users.multiSelection).map((user: any) => {
          const rawUser = toRaw(user);
          return {
            motivoAsignacion: motivoAsignacion.val.value,
            unidadTiempo: rawUser.unidadTiempo,
            valorTiempo: rawUser.valorTiempo,
            idGestionador: rawUser.id,
          };
        });

        sgdeaAxios
          .patch(urlMeny, { idsEntes: toRaw(entesIds.value), asignaciones: usersRequest })
          .then(async () => {
            // await newTrazabilidad(user);
            toast.success("Los radicados han sido asignados con éxito");
            setTimeout(() => emit('toggle', 'success'), 400);
          })
          .catch((err) => {
            toast.error("Ha ocurrido un error al asignar los radicados");
          })
          .finally(()=> loading.value = false);
        } else toast.error("No se puede seleccionar un gestionador con el minimo de tiempo.");
      }
    else {
      sgdeaAxios
        .patch(urlOne, {
          motivoAsignacion: motivoAsignacion.val.value,
          valorTiempo: Number(user.valorTiempo),
          unidadTiempo: user.unidadTiempo,
          idsEntes: toRaw(entesIds.value),
          idGestionador: user.id,
        })
        .then(async (res) => {
          // await newTrazabilidad(user, true);
          toast.success("Los radicados han sido asignados con éxito");
          setTimeout(() => emit('toggle', 'success'), 400);
        })
        .catch(async (err) => {
          toast.error("Ha ocurrido un error al asignar el radicado");
        })
        .finally(()=> loading.value = false)
    }
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
  const multiSelectionById = keyBy(users.multiSelection.map((user)=> {
    if(!tiempoGestionador.check.value) {
      user.unidadTiempo = tiempoGestionador.unidadTiempo.val.value;
      user.valorTiempo = tiempoGestionador.valorTiempo.val.value;
    }
    return user
  }), "id");

  sgdeaAxios
    .get<UserByRolAndIdOfficinaI[]>(url)
    .then((res) => {
      users.data = res.data
        .map((user) => ({
          ...user,
          cargo: getOneUserGestionadorByRol(user.usuarioRelaciones),
          unidadTiempo: multiSelectionById[user.id]?.unidadTiempo || "",
          valorTiempo: multiSelectionById[user.id]?.valorTiempo || "",
          label: `${user.firstname} ${user.lastname}`,
          value: user.id,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
    })
    .catch((err) => {
      toast.error("Ha ocurrido un error al buscar los usuarios");
    });
};

/*-----------------------WATCHS-------------------------------
------------------------------------------------------------*/
watchEffect(() => {
  if (oficinas.selection) {
    getUserBYOfficinas(Number(oficinas.selection));
  }

  if (users.multiSelection.length > 1) {
    consolidador.data.value = users.multiSelection as unknown as {
      label: string;
      value: number;
    }[];
  }

  if(props.idsEntes) entesIds.value = props.idsEntes;
});

/*-----------------------INICIALIZACION-----------------------
------------------------------------------------------------*/
onMounted(() => {
  getOfficinas();
  getUserBYOfficinas(idOficinaGerenciaJuridica.value);
});
</script>
