
<template>
  <q-card class="tw-rounded-xl tw-mt-4" flat bordered v-if="isMetadatos">
    <q-card class="tw-rounded-xl tw-mt-4 tw-p-5" flat bordered>
      <div class="col row q-px-md">
        <b class="tw-text-lg">{{ isAprobacion ? 'Enviar a Aprobación' : 'Asignar para Enviar a Revisión' }}
        </b>
      </div>

      <div class="tw-flex tw-flex-col tw-py-2 tw-px-2 tw-gap-2.5">
        <div class="tw-w-full tw-flex tw-gap-7">
          <q-card class="tw-rounded-xl tw-w-1/2" flat bordered>
            <q-card-section class="tw-flex tw-flex-col tw-items-start tw-justify-between tw-gap-2.5 -tw-mb-4">
              <span class="tw-font-bold tw-text-lg">
                Seleccionar los usuarios que desea asignar
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
                :pagination="pagination" rows-per-page-label="Páginas" selection="single"
                v-model:selected="users.selection">
                <template v-slot:body-cell="props">
                  <q-td :props="props" :draggable="props.row.id != rowEnvApro.id" @dragstart="dragEnvApro(props.row)">
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

            <q-card-section @drop="dropEnvApro" @dragover.prevent class="tw-w-full tw-h-full">
              <q-chip v-if="users.selection.length" removable @remove="users.removeSelection()" icon="person" outline
                color="secondary">
                {{ `${users.selection[0].firstname} ${users.selection[0].lastname}` }}
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
            <CommentTextArea v-model="motivoAsignacion.val.value" :is-required="true" :max-length="10000" :min-length="10"
                    label="Observaciones" />
        </div>
      </div>
    </q-card>
  </q-card>

  <div v-if="isMetadatos" class="col row justify-center q-gutter-x-md q-mt-lg">
    <q-btn color="accent" label="Cancelar" class="tw-rounded-xl" style="width: 240px; height: 40px;" text-color="black"
      no-caps @click="modals.cancel.toggle()" />

    <q-btn color="primary" text-color="white" label="Asignar" style="width: 240px; height: 40px;"
      class="tw-rounded-xl tw-btn tw-p-2" no-caps @click="enviarAprobacion()" />
  </div>
  <Modal v-model="modals.cancel.status" title="¡Espera un momento!" :is-success="false"
    @handleAccept="emit('change-view')" cancel-button textButtonCancel="No" textButton="Si"
    text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
    type="button" />
</template>

<script lang="ts" setup>
import { UserByRolAndIdOfficinaI, OficinaI, InfoGeneral } from "src/pages/EntesDeControl/Bandeja/Detalles/types";
import { columms } from "src/pages/EntesDeControl/Bandeja/Detalles/EnviarAprobacion/data";
import { inputRequired, maxLengthInput, minLengthInputCustom } from "src/helpers/validations";
import { crearTrazabilidad } from 'src/helpers/trazabilidad';
import { onMounted, reactive, ref, watchEffect } from "vue";
import { useAuthStore } from "src/stores/auth.store";
import { useRoute, useRouter } from "vue-router";
import Modal from "components/Modal/Modal.vue";
import { toast } from "src/helpers/toast";
import { sgdeaAxios } from "src/services";
import CommentTextArea from  "src/shared/components/TextArea/Comments.vue";
import { crearTrazabilidadDocumento } from "src/helpers/trazabilidadDocumento";

/*-----------------------ACTIVACIONES-------------------------
------------------------------------------------------------*/
const props = defineProps<{ informacionGeneral: InfoGeneral, isAprobacion: boolean, documento: any, documentoEntes: any }>();
const emit = defineEmits(['error-metada', 'change-view', 'error-datos-salida', 'error-expediente']);
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

/*-----------------------VARIABLES---------------------------
------------------------------------------------------------*/
const hastDocumentoDatosSalida = ref(false);
const idOficinaGerenciaJuridica = ref<number>();
const ente_id = route.params.id;
const rowEnvApro = ref<any>({ id: 0 });
const hasExpediente = ref(false);
const isMetadatos = ref(false);
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 8
  // rowsNumber: xx if getting data from a server
});

idOficinaGerenciaJuridica.value = authStore.userInfo.oficina

const dragEnvApro = (row) => {
  rowEnvApro.value = row;
}

const dropEnvApro = () => {
  users.selection = [rowEnvApro.value];
}

const motivoAsignacion = {
  val: ref(""),
  refs: ref<any>(null),
  rules: [inputRequired, (val) => minLengthInputCustom(10, val, 'campo'), (v) => maxLengthInput(1000, v)],
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
  motivoAsignacion.refs.value?.validate();

  const validate = !motivoAsignacion.refs.value?.hasError;

  if (validate) {
    if (users.selection.length) action();
    else toast.error("Debe seleccionar un usuario para completar la acción");
  } else {
    toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos.");
  }
};

const getOneUserAprobadorByRol = (users: any) => {
  const user = users.find((user) =>
    user.rol.nombre.toLowerCase().includes("aprobador")
  );
  return user.rol.nombre;
};
/*-----------------------SERVICIOS----------------------------
------------------------------------------------------------*/
const newTrazabilidad = async () => {
  const comentario = 'Enviado a aprobación';
  const accion = 'Se ha enviado a aprobación el radicado';
  const descripcion = `Usuario: ${authStore.userInfo.name}, Ha enviado a aprobación el radicado`;

  await crearTrazabilidad({
    proceso: `ENTC${props.informacionGeneral.id}`,
    secuencia: props.informacionGeneral.nroRadicado,
    estado: "Por Aprobar",
    nombre: authStore.userInfo.name,
    tramite: "Entes de Control",
    descripcion,
    comentario,
    accion,
  });
};

const enviarAprobacion = () => {
  validation(() => {
    const url = `/api/entes/enviar/${props.isAprobacion ? 'aprobacion' : 'revision'}`;
    const user = users.selection[0];
      sgdeaAxios
        .patch(url, {
          idUsuario: user.id,
          motivoAsignacion: motivoAsignacion.val.value,
          enteId: Number(ente_id),
        })
        .then(async () => {
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
          toast.success("El radicado ha sido enviado para aprobación con éxito");
          setTimeout(() => router.push("/bandeja"), 400);
        }).catch((err) => {
          toast.error("Ha ocurrido un error al asignar el radicado");
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

const getUserBYOfficinas = (oficinaId: number, rol = "Aprobador") => {
  const url = `/api/usuarios/rolYoficina?rolName=${rol}`;
  sgdeaAxios.get<UserByRolAndIdOfficinaI[]>(url)
    .then((res) => {
      users.data = res.data
        .map((user) => ({
          ...user,
          cargo: getOneUserAprobadorByRol(user.usuarioRelaciones),
          unidadTiempo: "",
          valorTiempo: "",
          label: `${user.firstname} ${user.lastname}`,
          value: user.id,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

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

const getDatosSalida = () => {
  return sgdeaAxios.get(`api/entes/obtener-datos-salida/${ente_id}`)
}

const getDocumentoSalida = () => {
  return sgdeaAxios.get(`/api/entes/listadoDocsSalida/${ente_id}`,{ showLoader: false });
}

const getExpediente = () => {
  return sgdeaAxios.get("/expediente/children", {
    params: { nodeId: props.informacionGeneral.nodeID },
  });
}

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
watchEffect(() => {
  if (props.isAprobacion !== undefined) {
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
  }
});

onMounted(async () => {
  await getMetadata()
    .then((response) => {
      if (!response.data?.marcacion || !response.data?.favorabilidad) isMetadatos.value = false;
      else isMetadatos.value = true;
    })
    .catch(() => {
      isMetadatos.value = false;
    });

  if (!isMetadatos.value) {
    emit("error-metada");
    return toast.error("Debe ingresar los metadatos para poder completar la acciòn");
  }

  try {
    const datosSalida = await getDatosSalida()
    if (datosSalida.data.id) {
      const Documento = await getDocumentoSalida()
      if (!Documento?.data) hastDocumentoDatosSalida.value = false;
      else hastDocumentoDatosSalida.value = true;
    }
  } catch (error) {
    hastDocumentoDatosSalida.value = false
  }

  if (!hastDocumentoDatosSalida.value) {
    emit("error-datos-salida");
    toast.error("Debe diligenciar los datos y el documento de salida para poder completar la acción");
  }

  try {
    const expediente = await getExpediente()
    if (!expediente?.data) hasExpediente.value = false
    else hasExpediente.value = true;
  } catch (error) {
    hasExpediente.value = false
  }

  if (!hasExpediente.value) {
    emit("error-expediente");
    toast.error("Documento pendiente de inclusión en expediente");
  }

  if (isMetadatos.value && hastDocumentoDatosSalida.value && hasExpediente.value){
    getOfficinas();
    getUserBYOfficinas(idOficinaGerenciaJuridica.value);
  }
});
</script>
