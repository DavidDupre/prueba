<template>
  <q-card class="tw-rounded-xl tw-mt-4" flat bordered v-if="isMetadatos">
    <q-card class="tw-rounded-xl tw-mt-4 tw-p-5" flat bordered>
      <div class="col row">
        <b class="tw-text-lg">Asignación</b>
      </div>
      <div class="tw-flex tw-justify-between tw-w-1/2 tw-gap-12 tw-h-[80px] 2xl:tw-h-[60px]">
        <q-checkbox v-model="tiempoGestionador.check.value" label="Tiempo por gestionador"
          @update:model-value="tiempoGestionador.clearCheck" />

        <div class="tw-grid 2xl:tw-flex tw-content-cente tw-items-center 2xl:tw-gap-2.5"
          v-show="tiempoGestionador.check.value">
          <label>Tiempo de Trámite *</label>
          <div class="tw-flex tw-gap-2.5 2xl:tw-mt-[5px] tw-items-center">
            <q-select :ref="(val) => (tiempoGestionador.unidadTiempo.ref.value = val)"
              v-model="tiempoGestionador.unidadTiempo.val.value"
              @update:model-value="() => tiempoGestionador.changeCheck(tiempoGestionador.valorTiempo.val.value, tiempoGestionador)"
              :rules="[inputRequiredWithoutValue]" label="Unidad de Tiempo" :options="tipoTiempoTramites"
              class="tw-w-[190px] !tw-p-0" map-options outlined dense />

            <q-input :disable="!tiempoGestionador.unidadTiempo.val.value"
              :ref="(val) => (tiempoGestionador.valorTiempo.ref.value = val)"
              @update:model-value="(val) => tiempoGestionador.changeCheck(val, tiempoGestionador)"
              v-model="tiempoGestionador.valorTiempo.val.value" :rules="[inputRequiredWithoutValue]" label="Cantidad"
              class="tw-w-[170px] !tw-p-0" :maxlength="2" type="text" outlined dense />
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
                    name="dias" label="Seleccione" v-model="oficinas.selection" class="tw-w-full" option-label="nombre"
                    hide-selected @update:model-value="(val) => getUserBYOfficinas(Number(val))"
                    @filter="oficinas.filter">
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
                selection="multiple" v-model:selected="users.multiSelection" @update:selected="users.verifyErrorsInTime"
                @selection="users.clearFieldsOfTime" rows-per-page-label="Páginas">
                <template v-slot:body-cell-tiempo-tramite="scope">
                  <q-td :props="scope">
                    <div class="tw-flex tw-h-[40px] tw-gap-2"
                      v-if="scope.row.cargo.toLowerCase().includes('gestionador')"
                      v-show="!tiempoGestionador.check.value">
                      <q-select outlined dense map-options v-model="scope.row.unidadTiempo"
                        :options="tipoTiempoTramites" label="Unidad de Tiempo" name="type-time"
                        :disable="!scope.selected" class="tw-w-[190px]"
                        :ref="(val) => (scope.row.unidadTiempoRefs = val)" :rules="[inputRequiredWithoutValue]"
                        @update:model-value="(val) => updateInputUnidadTiempo(val, scope)
                          " />

                      <q-input outlined dense type="text" v-model="scope.row.valorTiempo" class="tw-w-[170px]"
                        label="Cantidad" :disable="!scope.selected || !scope.row.unidadTiempo" :maxlength="2"
                        :ref="(val) => (scope.row.valorTiempoRefs = val)" :rules="[inputRequiredWithoutValue]"
                        @update:model-value="(val) => updateInputValorTiempo(String(val), scope)
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
                @remove="users.removeMultiSelection(index, user.id)" icon="person" outline color="secondary">
                {{ `${user.firstname} ${user.lastname}` }}
              </q-chip>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-card>

    <q-card class="tw-rounded-xl tw-mt-4 tw-p-5" flat bordered>
      <div class="col row"
        v-if="(users.multiSelection.filter((user) => user.cargo.toLocaleLowerCase().includes('gestionador'))).length > 1">
        <b class="tw-text-lg">Consolidador *</b>
      </div>

      <div class="row q-col-gutter-md q-pb-md q-mt-sm"
        v-if="(users.multiSelection.filter((user) => user.cargo.toLocaleLowerCase().includes('gestionador'))).length > 1">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <span class="text-weight-bold">Seleccione un usuario consolidador *</span>
          <q-select :ref="(val) => (consolidador.refs.value = val)" :options="consolidador.data.value"
            v-model="consolidador.val.value" @filter="consolidador.filter" :rules="consolidador.rules"
            name="consolidador" label="Seleccione" class="tw-w-full" hide-selected map-options emit-value fill-input
            use-input clearable outlined dense>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="tw-text-red-600">El usuario que busca no se encuentra dentro de los usuario
                  asignados. Por favor verifique
                </q-item-section>
              </q-item>
            </template>
          </q-select>
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
  </q-card>

  <div v-if="isMetadatos" class="col row justify-center q-gutter-x-md q-mt-lg">
    <q-btn color="accent" label="Cancelar" class="tw-rounded-xl" style="width: 240px; height: 40px" text-color="black"
      no-caps :disable="isLoadingAsignar" @click="modals.cancel.toggle()" />

    <q-btn color="primary" text-color="white" label="Asignar" style="width: 240px; height: 40px"
      class="tw-rounded-xl tw-btn tw-p-2" no-caps :disable="isLoadingAsignar"
      @click="validation(() => { (users.multiSelection.filter((user) => user.cargo.toLocaleLowerCase().includes('gestionador'))).length > 1 ? modals.accept.toggle() : asignarRadicado() })" />
  </div>

  <Modal v-model="modals.cancel.status" title="¡Espera un momento!" :is-success="false"
    @handleAccept="emit('change-view')" cancel-button textButtonCancel="No" textButton="Si"
    text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
    type="button" />
  <Modal v-model="modals.accept.status" title="¡Espera un momento!" :is-success="false"
    @handleAccept="asignarRadicado()" cancel-button textButtonCancel="No" textButton="Si"
    text="¿Está seguro que desea Asignar para gestionar el radicado de forma clonada?" type="button" />
</template>

<script lang="ts" setup>
import { UserByRolAndIdOfficinaI, OficinaI, InfoGeneral } from "src/pages/EntesDeControl/Bandeja/Detalles/types";
import { validateInputTiempoTramite, validateInputTiempoTramiteTwo, maxValorTiempo } from "src/pages/EntesDeControl/Bandeja/Detalles/utils";
import { columms, tipoTiempoTramites } from "src/pages/EntesDeControl/Bandeja/Detalles/Asignar/data";
import { inputRequiredWithoutValue, inputRequired, maxLengthInput } from "src/helpers/validations";
import { onMounted, reactive, ref, watchEffect, toRaw, computed } from "vue";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { useAuthStore } from "src/stores/auth.store";
import { useRoute, useRouter } from "vue-router";
import Modal from "components/Modal/Modal.vue";
import { keyBy } from "src/helpers/general";
import { toast } from "src/helpers/toast";
import { sgdeaAxios } from "src/services";
import { useQuasar } from 'quasar';
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";


/*-----------------------ACTIVACIONES-------------------------
------------------------------------------------------------*/
const props = defineProps<{ informacionGeneral: InfoGeneral }>();
const emit = defineEmits(["error-metada", "change-view"]);
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const $q = useQuasar()
const auth = useAuthStore()
/*-----------------------VARIABLES---------------------------
------------------------------------------------------------*/
const ente_id = route.params.id;
const isMetadatos = ref(false);
const idOficinaGerenciaJuridica = ref<number>();
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 8,
  // rowsNumber: xx if getting data from a server
});
const isLoadingAsignar = ref(false)
const motivoAsignacion = {
  val: ref(""),
  refs: ref<any>(null),
  rules: [inputRequired, (v) => maxLengthInput(1000, v)],
};

idOficinaGerenciaJuridica.value = authStore.userInfo.oficina;

const isTiempoSeleccionado = computed(() => {
  tiempoGestionador.updateUsers();
  return tiempoGestionador.unidadTiempo.val.value !== '' && tiempoGestionador.valorTiempo.val.value !== '';
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
  updateUsers: (resetValidation = false) => {
    if (tiempoGestionador.check.value) {
      users.multiSelection.map((user) => {
        if (user.cargo.toLowerCase().includes('gestionador')) {
          user.unidadTiempo = tiempoGestionador.unidadTiempo.val.value;
          user.valorTiempo = tiempoGestionador.valorTiempo.val.value;
        }
        return user;
      });
    } else {
      users.multiSelection.map((user) => {
        if (user.cargo.toLowerCase().includes('gestionador')) {
          user.unidadTiempo = '';
          user.valorTiempo = '';
        }
        return user;
      });
    }

    setTimeout(() => {
      users.data.map((user) => {
        if (user.cargo.toLowerCase().includes('gestionador')) {
          if (resetValidation) setTimeout(() => {
            user.unidadTiempoRefs?.resetValidation();
            user.valorTiempoRefs?.resetValidation();
          }, 10);
        }
        return user;
      });

      if (!resetValidation) users.verifyErrorsInTime();
    }, 100);
  },
  clearCheck: (val) => {
    if (tiempoGestionador.check.value) {

      tiempoGestionador.unidadTiempo.val.value = '';
      tiempoGestionador.valorTiempo.val.value = '';
      tiempoGestionador.unidadTiempo.ref.value?.resetValidation();
      tiempoGestionador.valorTiempo.ref.value?.resetValidation();
    } else {
      tiempoGestionador.unidadTiempo.val.value = users.multiSelection[0]?.unidadTiempo || '';
      tiempoGestionador.valorTiempo.val.value = users.multiSelection[0]?.valorTiempo || '';
    }

    tiempoGestionador.updateUsers();
  },
};

const consolidador = {
  val: ref(""),
  refs: ref<any>(null),
  rules: [inputRequired],
  data: ref<{ label: string; value: number, cargo: string }[]>([]),
  filter: (val: string, update: (arg: Function) => void) => {
    if (val === "") {
      return update(() => {
        consolidador.data.value = users.multiSelection.map((user) => ({
          label: `${user.firstname} ${user.lastname}`,
          value: user.id,
          cargo: user.cargo,
        })).filter((user) => user.cargo.toLowerCase().includes('gestionador'))
      });
    }

    return update(() => {
      consolidador.data.value = consolidador.data.value.filter((v) => {
        return v.label.toLowerCase().indexOf(val.toLowerCase()) > -1;
      }).filter((user) => user.cargo.toLowerCase().includes('gestionador'))
    });
  },
};

const modals = reactive({
  cancel: {
    status: false,
    toggle: () => (modals.cancel.status = !modals.cancel.status),
  },
  accept: {
    status: false,
    toggle: () => (modals.accept.status = !modals.accept.status),
  },
});

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
  removeMultiSelection: (index: number, id: number) => {
    users.multiSelection.splice(index, 1);
    users.data.forEach((user) => {
      if (user.id == id) {
        if (user.cargo.toLowerCase().includes('gestionador')) {
          user.unidadTiempo = "";
          user.valorTiempo = "";

          user.unidadTiempoRefs?.resetValidation();
          user.valorTiempoRefs?.resetValidation();

          if (!tiempoGestionador.check.value) {
            user.unidadTiempo = tiempoGestionador.unidadTiempo.val.value;
            user.valorTiempo = tiempoGestionador.valorTiempo.val.value;
          }
        }
      }
    })
  },
  clearFieldsOfTime: (scope) => {
    if (scope.rows[0].cargo.toLowerCase().includes('gestionador')) {
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
    }
  },
  verifyErrorsInTime: () => {
    if (tiempoGestionador.check.value) {
      users.isErrors = users.multiSelection.some((user) => {
        if (user.cargo.toLowerCase().includes('gestionador')) {
          return isTiempoSeleccionado.value && (user.valorTiempo == "" || user.unidadTiempo == "");
        }
        return false;
      });
    } else {
      users.isErrors = false;
    }
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

    if (maxDias.usuarios[0]?.valorTiempo == 1 && maxHoras.usuarios[0]?.valorTiempo == '24')
      return [...maxDias.usuarios, ...maxHoras.usuarios];

    if (maxDias.usuarios.length) return maxDias.usuarios;
    else return maxHoras.usuarios;
  };

  const result = findUsersWithMaxTime().filter((user: any) => {
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
      "Para continuar, asegúrese de que todos los campos requeridos estén completos"
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
    user.rol.nombre.toLowerCase().includes("gestionador") ||
    user.rol.nombre.toLowerCase().includes("asignador responsable")
  );
  return user.rol.nombre;
};

/*-----------------------SERVICIOS----------------------------
------------------------------------------------------------*/
const newTrazabilidad = async (user: any, isOne = false) => {
  const comentario = `${motivoAsignacion.val.value} - ${isOne ? "Asignado" : "Clonado"}`;
  const consolidadorSeleccionado = consolidador.data.value.find(
    c => c.value === Number(consolidador.val.value)
  );
  const gestionadores = users.multiSelection
    .map((g, i) => `Gestionador ${i + 1}: ${g.label}`)
    .join(', \n');
  const accion = isOne
    ? `Se ha asignado el radicado`
    : `Se ha clonado el radicado`;
  const descripcion = isOne
    ? `Usuario:${auth.$state.userInfo.name}, Ha asignado a ${user.label} al radicado`
    : `Usuario:${auth.$state.userInfo.name} ha clonado el radicado,\n` +
    `Consolidador : ${consolidadorSeleccionado?.label || 'No asignado'}, \n` +
    `${gestionadores}, \n`;

  await crearTrazabilidad({
    proceso: `ENTC${props.informacionGeneral.id}`,
    secuencia: props.informacionGeneral.nroRadicado,
    estado: isOne ? props.informacionGeneral.estado.estado : 'Gestión Clonada',
    nombre: authStore.userInfo.name,
    tramite: "Entes de Control",
    descripcion,
    comentario,
    accion,
  });
};

const asignarRadicado = () => {
  validation(() => {
    const queryMeny = `?id=${ente_id}&consolidador=${consolidador.val.value}`;
    const urlMeny = `/api/entes/clonacion${queryMeny}`;
    const urlOne = `/api/entes/asignar/${ente_id}`;
    const urlThree = `/api/entes/reasignar`;
    // $q.loading.show();

    const userAsignadores = toRaw(users.multiSelection).filter((user) => user.cargo.toLowerCase().includes('asignador'));
    const userGestionadores = toRaw(users.multiSelection).filter((user) => user.cargo.toLowerCase().includes('gestionador'));
    // isLoadingAsignar.value = true;

    if (userAsignadores.length == 1) {
      sgdeaAxios
        .patch(urlThree, {
          motivoReasignacion: motivoAsignacion.val.value,
          idAsignador: userAsignadores[0].id,
          enteId: Number(ente_id),
        })
        .then(async (res) => {
          // await newTrazabilidad(true);
          toast.success("El radicado ha sido reasignado con éxito");
          // setTimeout(() => router.push("/bandeja"), 400);
        }).catch(async (err) => {
          toast.error("Ha ocurrido un error al reasignar el radicado");
        }).finally(() => {
          isLoadingAsignar.value = false
        })
    }

    if (userGestionadores.length > 1) {
      if (validateMaxConsolidador()) {
        const usersRequest = userGestionadores.map((user: any) => {
          const rawUser = toRaw(user);
          return {
            motivoAsignacion: motivoAsignacion.val.value,
            unidadTiempo: rawUser.unidadTiempo,
            valorTiempo: rawUser.valorTiempo,
            idGestionador: rawUser.id,
          };
        });

        sgdeaAxios
          .patch(urlMeny, usersRequest)
          .then(async () => {
            await newTrazabilidad(userGestionadores[0]);
            toast.success("La asignación para gestión de forma clonada fue exitosa");
            setTimeout(() => router.push("/bandeja"), 400);
          })
          .catch((err) => {
            toast.error("Ha ocurrido un error al asignar los radicados");
          })
          .finally(() => {
            isLoadingAsignar.value = false;
            $q.loading.hide()
          });
      } else {
        isLoadingAsignar.value = false;
        toast.error("Debe seleccionar un tiempo de trámite para el usuario consolidador, mayor o igual al trámite de los demás gestionadores")
      };
    }
    else if (userGestionadores.length == 1) {
      if (Number(!userGestionadores[0].valorTiempo) || Number(!userGestionadores[0].valorTiempo) && (!isTiempoSeleccionado.value)) {
        toast.error("Debe ingresar los datos “Tiempo trámite por gestionador“")
        return
      }

      if (!motivoAsignacion.val.value) {
        toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos");

      }

      sgdeaAxios
        .patch(urlOne, {
          motivoAsignacion: motivoAsignacion.val.value,
          idGestionador: userGestionadores[0].id,
          unidadTiempo: userGestionadores[0].unidadTiempo || null,
          valorTiempo: Number(userGestionadores[0].valorTiempo) || null,
          idAsignador : authStore.userInfo.userid,
        })
        .then(async (res) => {
          await newTrazabilidad(userGestionadores[0], true);
          toast.success("El radicado ha sido asignado con éxito");
          setTimeout(() => router.push("/bandeja"), 400);
        })
        .catch(async (err) => {
          toast.error("Ha ocurrido un error al asignar el radicado");
        })
        .finally(() => {
          isLoadingAsignar.value = false;
          $q.loading.hide()
        })
    }
  });
};

const getOfficinas = () => {
  const url = `/oficinas/all`;
  sgdeaAxios
    .get<OficinaI[]>(url)
    .then((res) => {
      oficinas.data = res.data
        .sort((a: any, b: any) => {
          const esNumeroA = /^\d/.test(a.nombre);
          const esNumeroB = /^\d/.test(b.nombre);

          if (esNumeroA && esNumeroB) return 0;
          if (esNumeroA) return 1;
          if (esNumeroB) return -1;

          let nombreA = a.nombre.toLowerCase();
          let nombreB = b.nombre.toLowerCase();
          if (nombreA > nombreB) return 1;
          else if (nombreA < nombreB) return -1;
          else return a.edad - b.edad;
        })
        .map((oficina) => ({
          label: oficina.nombre.toUpperCase(),
          nombre: oficina.nombre.toUpperCase(),
          value: oficina.id,
        })) as any;
      oficinas.clone = oficinas.data;
    })
    .catch((err) => {
      toast.error("Ha ocurrido un error al buscar las oficinas");
    });
};

function removeDuplicates(data) {
  return Array.from(
    data.reduce((map, item) => {
      const key = JSON.stringify({
        id: item.id,
        seccionSubSeccion: item.seccionSubSeccion,
        oficina: item.oficina,
        puntoRadicacion: item.puntoRadicacion,
        rol: item.rol
      });
      map.set(key, item);
      return map;
    }, new Map())
      .values()
  );
}

const duplicateMultiRole = (users) => {
  const result = [];

  users.forEach(item => {
    const seenRoles = new Set(); // Para rastrear los roles ya agregados
    item.usuarioRelaciones.forEach((relation) => {
      const name = relation.rol.nombre.toLowerCase();

      // Verificamos si el rol es uno de los deseados y no ha sido visto antes
      if ((name === 'gestionador' || name === 'asignador responsable') && !seenRoles.has(name)) {
        const newUser = {
          ...item,
          cargo: relation.rol.nombre,
          duplicate: true,
        };

        result.push(newUser);
        seenRoles.add(name); // Agregamos el rol al conjunto de roles vistos
      }
    });
  });

  return result;
};

const getUserBYOfficinas = (oficinaId: number, rol = "Gestionador,Asignador Resposable") => {
  const url = `/api/usuarios/rolYoficina?oficinaId=${oficinaId}&rolNames=${rol}`;
  const multiSelectionById = keyBy(users.multiSelection.map((user) => {
    if (!tiempoGestionador.check.value) {
      user.unidadTiempo = tiempoGestionador.unidadTiempo.val.value;
      user.valorTiempo = tiempoGestionador.valorTiempo.val.value;
    }
    return user
  }), "id");
  let gestionadores = [];
  let otros = [];

  sgdeaAxios
    .get<UserByRolAndIdOfficinaI[]>(url)
    .then((res) => {
      duplicateMultiRole(res.data).map((user: any) => {
        // user.cargo = getOneUserGestionadorByRol(user.usuarioRelaciones);
        user.label = `${user.firstname} ${user.lastname}`;
        user.value = user.id;

        if (user.cargo.toLowerCase().includes('gestionador')) {
          user.unidadTiempo = multiSelectionById[user.id]?.unidadTiempo || "";
          user.valorTiempo = multiSelectionById[user.id]?.valorTiempo || "";
        }
        return user;
      })
        .filter((user) => user.id != authStore.userInfo.userid)
        .forEach((user) => {
          if (user.cargo.toLowerCase().includes('gestionador')) {
            gestionadores.push(user);
          } else otros.push(user);
        });

      gestionadores.sort((a, b) => a.label.localeCompare(b.label));
      otros.sort((a, b) => a.label.localeCompare(b.label));

      users.data = [...gestionadores, ...otros];
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
  const newUsers = users.multiSelection.filter((user) => user.cargo.toUpperCase().includes('gestionador'))
  if (newUsers.length > 1) {
    consolidador.data.value = newUsers.filter((user) => user.cargo.toUpperCase().includes('gestionador')) as any
    const existLabel = newUsers.find((user) => user.label == consolidador.val.value);
    if (!existLabel) consolidador.val.value = "";
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
