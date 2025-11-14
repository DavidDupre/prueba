<template>
  <q-card class="tw-rounded-xl tw-mt-4" flat bordered v-if="isMetadatos">
    <q-card class="tw-rounded-xl tw-mt-4 tw-p-5" flat bordered>
      <div class="col row q-px-md">
        <b class="tw-text-lg">Reasignación</b>
      </div>

      <div class="tw-flex tw-flex-col tw-py-2 tw-px-2 tw-gap-2.5">
        <div class="tw-w-full tw-flex tw-gap-7">
          <q-card class="tw-rounded-xl tw-w-1/2" flat bordered>
            <q-card-section class="tw-flex tw-flex-col tw-items-start tw-justify-between tw-gap-2.5 -tw-mb-4">
              <span class="tw-font-bold tw-text-lg">
                Seleccionar los usuarios que desea asignar al radicado
              </span>

              <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
                <div class="tw-flex tw-flex-col tw-gap-0.5 tw-w-[50%]">
                  <span class="text-weight-bold">Filtrar por Oficina</span>
                  <q-select outlined dense map-options emit-value use-input fill-input :options="oficinas.data"
                    name="oficinas" label="Seleccione" v-model="oficinas.selection" class="tw-w-full"
                    option-label="nombre" hide-selected @filter="oficinas.filter">
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                  </q-select>
                </div>
                <div class="tw-flex tw-flex-col tw-gap-0.5 tw-w-[50%]">
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
                :pagination="pagination" rows-per-page-label="Páginas" selection="single"
                v-model:selected="users.selection" @update:selected="users.verifyErrorsInTime"
                @selection="users.clearFieldsOfTime">

                <template v-slot:body-cell-tiempo-tramite="scope">
                  <q-td :props="scope">
                    <div class="tw-flex" v-if="scope.row.cargo.toLowerCase().includes('gestionador')">
                      <q-select outlined dense v-model="scope.row.unidadTiempo" :options="tipoTiempoTramites"
                        label="Tipo" name="type-time" :disable="!scope.selected" class="tw-w-[110px]"
                        :ref="(val) => (scope.row.unidadTiempoRefs = val)" :rules="[inputRequiredWithoutValue]"
                        @update:model-value="(val) => updateInputUnidadTiempo(val, scope)" />

                      <q-input outlined dense type="text" v-model="scope.row.valorTiempo" label="Valor"
                        class="tw-w-[85px]" :disable="!scope.selected || !scope.row.unidadTiempo" :maxlength="2"
                        :ref="(val) => (scope.row.valorTiempoRefs = val)" :rules="[inputRequiredWithoutValue]"
                        @update:model-value="(val) => updateInputValorTiempo(String(val), scope)" />
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
              <q-chip v-if="users.selection.length" removable @remove="users.removeSelection()" icon="person" outline
                color="secondary" :style="[users.isErrors ? 'display:none' : '']">
                {{ `${users.selection[0].firstname} ${users.selection[0].lastname}` }}
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
            <CommentTextArea v-model="motivoAsignacion.val.value" :is-required="true" :max-length="10000"
                    label="Observaciones" />
        </div>
      </div>
    </q-card>
  </q-card>

  <div v-if="isMetadatos" class="col row justify-center q-gutter-x-md q-mt-lg">
    <q-btn color="accent" label="Cancelar" class="tw-rounded-xl" style="width: 240px; height: 40px;" text-color="black"
      no-caps @click="modals.cancel.toggle()" />

    <q-btn color="primary" text-color="white" label="Reasignar" style="width: 240px; height: 40px;"
      class="tw-rounded-xl tw-btn tw-p-2" no-caps @click="reasignarRadicado()" />
  </div>
  <Modal v-model="modals.cancel.status" title="¡Espera un momento!" :is-success="false"
    @handleAccept="emit('change-view')" cancel-button textButtonCancel="No" textButton="Si"
    text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
    type="button" />
</template>

<script lang="ts" setup>
import { UserByRolAndIdOfficinaI, OficinaI, InfoGeneral } from "src/pages/EntesDeControl/Bandeja/Detalles/types";
import { columms, tipoTiempoTramites } from "src/pages/EntesDeControl/Bandeja/Detalles/Reasignar/data";
import { inputRequiredWithoutValue, inputRequired, maxLengthInput } from "src/helpers/validations";
import { validateInputTiempoTramite } from "src/pages/EntesDeControl/Bandeja/Detalles/utils";
import { crearTrazabilidad } from 'src/helpers/trazabilidad';
import { onMounted, reactive, ref, watchEffect } from "vue";
import { useAuthStore } from "src/stores/auth.store";
import { useRoute, useRouter } from "vue-router";
import Modal from "components/Modal/Modal.vue";
import { toast } from "src/helpers/toast";
import { sgdeaAxios } from "src/services";
import CommentTextArea from  "src/shared/components/TextArea/Comments.vue";

/*-----------------------ACTIVACIONES-------------------------
------------------------------------------------------------*/
const props = defineProps<{ informacionGeneral: InfoGeneral, rol: string }>();
const emit = defineEmits(['error-metada', 'change-view']);
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

/*-----------------------VARIABLES---------------------------
------------------------------------------------------------*/
const ente_id = route.params.id;
const isMetadatos = ref(false);
const idOficinaGerenciaJuridica = ref<number>();
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 8
  // rowsNumber: xx if getting data from a server
});

idOficinaGerenciaJuridica.value = authStore.userInfo.relations.find((user: any) => {
  return user.oficina.toLowerCase().includes('jurídica')
}).idOficina;

const motivoAsignacion = {
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
    users.data = users.data.map((user: UserByRolAndIdOfficinaI) => {
      if (user.id == users.selection[0].id) {
        if (user.cargo.toLowerCase().includes('gestionador')) {
          user.unidadTiempo = "";
          user.valorTiempo = "";

          //Quitamos los errores
          user.unidadTiempoRefs?.resetValidation();
          user.valorTiempoRefs?.resetValidation();
        }
      }
      return user;
    })
    users.selection.splice(0, 1);
  },
  clearFieldsOfTime: (scope) => {
    users.data.forEach((user) => {
      if (user.unidadTiempo != undefined) {
        user.unidadTiempo = "";
        user.valorTiempo = "";

        user.unidadTiempoRefs?.resetValidation()
        user.valorTiempoRefs?.resetValidation()
      }
    })
  },
  verifyErrorsInTime: () => {
    users.isErrors = users.selection.some((user) => {
      return user?.valorTiempo == "" || user?.unidadTiempo == "";
    });
  },
  changeProperty: (row: UserByRolAndIdOfficinaI, field: 'unidadTiempo' | 'valorTiempo') => {
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

const validation = (action: Function) => {
  motivoAsignacion.refs.value?.validate();

  const validate = !motivoAsignacion.refs.value?.hasError &&
    !users.isErrors;

  if (validate) {
    if (users.selection.length) action();
    else toast.error("Debe seleccionar un usuario para completar la acción");
  } else {
    toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos.");
  }
};

const updateInputUnidadTiempo = (val: string, scope) => {
  validateInputTiempoTramite(val, scope.row);
  users.changeProperty(scope.row, 'unidadTiempo');
  users.verifyErrorsInTime();
}

const updateInputValorTiempo = (val: string, scope) => {
  validateInputTiempoTramite(val, scope.row);
  users.changeProperty(scope.row, 'valorTiempo');
  users.verifyErrorsInTime();
}

const getOneUserGestionadorByRol = (users: any) => {
  const user = users.find((user) =>
    user.rol.nombre.toLowerCase().includes("gestionador") ||
    user.rol.nombre.toLowerCase().includes("asignador responsable")
  );
  return user.rol.nombre;
};


/*-----------------------SERVICIOS----------------------------
------------------------------------------------------------*/
const newTrazabilidad = async (isGesti = false) => {
  const comentario = isGesti ? 'Reasignado' : 'Asignado';
  const accion = isGesti ? `Se ha reasignado el radicado` : `Se ha asignado el radicado`;
  const descripcion = isGesti ? `ha reasignado al radicado` : `ha asignado el radicado`;

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

const reasignarRadicado = () => {
  validation(() => {
    const urlOne = `/api/entes/asignar/${ente_id}`;
    const urlTwo = `/api/entes/reasignar`;
    const user = users.selection[0];

    if (user.cargo.toLowerCase().includes('gestionador')) {
      sgdeaAxios
        .patch(urlOne, {
          motivoAsignacion: motivoAsignacion.val.value,
          idGestionador: user.id,
          unidadTiempo: user.unidadTiempo,
          valorTiempo: Number(user.valorTiempo),
        })
        .then(async (res) => {
          await newTrazabilidad(true);
          toast.success("El radicado ha sido asignado con éxito");
          setTimeout(() => router.push("/bandeja"), 400);
        }).catch((err) => {
          toast.error("Ha ocurrido un error al asignar el radicado");
        });
    }
    else {
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
        }).catch(async (err) => {
          toast.error("Ha ocurrido un error al reasignar el radicado");
        });
    }
  });
};

const getOfficinas = () => {
  const url = `/oficinas/all`;
  sgdeaAxios.get<OficinaI[]>(url)
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

const getUserBYOfficinas = (oficinaId: number, rol = "Gestionador,Asignador Responsable") => {
  const url = `/api/usuarios/rolYoficina?oficinaId=${oficinaId}&rolNames=${rol}`;
  let gestionadores = [];
  let otros = [];

  sgdeaAxios.get<UserByRolAndIdOfficinaI[]>(url)
    .then((res) => {
      res.data.map((user) => {
        user.cargo = getOneUserGestionadorByRol(user.usuarioRelaciones);
        user.label = `${user.firstname} ${user.lastname}`;

        if (user.cargo.toLowerCase().includes('gestionador')) {
          user.unidadTiempo = "";
          user.valorTiempo = "";
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
    users.data = users.dataSearchClone.filter((user: UserByRolAndIdOfficinaI) => {
      return user.label.toLowerCase().indexOf(users.search?.toLowerCase()) > -1
    });
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
      emit('error-metada');
      isMetadatos.value = false;
      toast.error("Debe ingresar los metadatos para poder completar la acción");
    });
});
</script>
