<template>
  <div>
    <section>
      <q-form ref="asignarRef">
        <q-card bordered class="tw-rounded-xl tw-mt-4" flat>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
                  Asignación
                </h3>
              </div>
            </template>
            <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
              <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex">
                <div class="width-container tw-w-1/2 q-px-sm tw-rounded-xl" style="border: 1px solid #e3e4e5">
                  <TableAsignar :TABLE_BODY="listUsers" :TABLE_HEADER="columnsAsignar" :filtered="filteredOficinas"
                                :is-selection="false" :listadoDependencias="listadoDependencias"
                                :listadoOficinas="listadoOficinas" :listadoUsuarios="listadoUsuarios"
                                :mySelection="tableSelection" :rowGestor="rowGestor"
                                :usuario-oficina="oficinaUser" row-key="colaborador" type-selection="multiple"
                                @update:dragEvent="dragGestor" @update:handleDblClickEvent="handleDoubleClickEvent"
                                @update:item-selected="handleAssign"
                                @dependencia-selected="userDependencia" @update:officeSelected="loadUsers"
                                @update:userSelected="filterUsers"/>
                </div>
                <div class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl"
                     style="border: 1px solid #e3e4e5" @drop="dropGestor()" @dragover.prevent>
                  <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
                    Estos son los usuarios que ha seleccionado
                  </span>
                  <div class="flex wrap tw-gap-3 q-pt-sm">
                    <div v-for="(asign, index) in cardsAsignar" :key="index">
                      <div v-if="asign.visible"
                           class="q-px-sm tw-text-base q-py-sm tw-gap-2 flex justify-between tw-text-[#2C3948] tw-rounded-3xl"
                           style="border: 1px solid #e3e4e5">
                        <q-icon name="person_outline" size="24px"/>
                        {{ asign.name }}
                        <q-icon class="tw-cursor-pointer" name="close" size="24px"
                                @click="removeCardAsignar(asign.user)"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="lengthUsers && !cardsAsignar.find(card => card.oficinaData === null)"
                   class="tw-w-full tw-px-4 tw-pb-4">
                <div class="col row">
                  <h3 class="text-bold tw-text-xl tw-pb-2 tw-flex-1 q-px-md">Consolidador</h3>
                </div>
                <p class="q-px-md tw-text-label">Seleccione usuario consolidador *</p>
                <q-select v-model="asignarUsuarioBody.usuarioConsolidador" :options="filteredTotalUsers"
                          :rules="[(v) => inputRequired(v)]"
                          class="tw-w-full" dense emit-value fill-input hide-selected label="Seleccione" map-options
                          outlined
                          use-input @filter="selectOptionsFilterFn">

                  <template v-slot:prepend>
                    <q-icon name="search"/>
                  </template>

                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No hay resultados
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>
          </q-expansion-item>
        </q-card>

        <q-card bordered class="tw-rounded-xl tw-mt-4" flat>
          <q-expansion-item default-opened>

            <template v-slot:header>
              <div class="col row">
                <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
                  Motivo de Asignación
                </h3>
              </div>
            </template>
            <div class="tw-bg-white q-mt-lg tw-p-4" style="border-radius: 5px">
              <div class="row full-width wrap tw-justify-start justify-around">
                <div class="row full-width">
                  <div class="col-12">
                    <CommentTextArea v-model="asignarUsuarioBody.motivoAsignacion" :is-required="true"
                                     :max-length="1000" :min-length="10" label="Observaciones"/>

                  </div>
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-card>
      </q-form>
    </section>
    <div class="justify-center tw-w-full tw-m-[10px] tw-mt-10 tw-mb-6 tw-flex tw-gap-4">
      <q-btn class="tw-rounded-xl" color="accent" label="Cancelar" style="width: 240px; height: 40px" text-color="black"
             type="reset" @click="() => (showModal = true)"/>
      <q-btn class="tw-rounded-xl tw-btn tw-p-2" color="primary" label="Asignar" style="width: 240px; height: 40px"
             text-color="white" @click="showModalAsigna"/>
    </div>
  </div>

  <Modal v-model:model-value="showModal" :is-success="false"
         cancel-button
         text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
         text-button="Si" textButtonCancel="No" title="¡Espera un momento!" @handleAccept="
      showModal = false;
    router.push('/bandeja');
    " @close-modal="() => (showModal = false)"/>

  <Modal v-if="lengthUsers" v-model:model-value="showConfirmationModal" :is-success="false"
         :text="`¿Está seguro que desea clonar la PQRD?`" cancel-button text-button="Si" textButtonCancel="No"
         title="Confirmación" @handleAccept="handleAcceptModal" @close-modal="() => (showConfirmationModal = false)"/>

  <Modal v-if="!lengthUsers" v-model:model-value="showConfirmationModal" :is-success="false"
         :text="`¿Está seguro de asignar el radicado #${props.pqrData.idRadicado} al encargado ${asignarUsuarioBody.usuarioAsignado}?`"
         cancel-button text-button="Si" textButtonCancel="No" title="Confirmación" @handleAccept="handleAcceptModal"
         @close-modal="() => (showConfirmationModal = false)"/>
</template>

<script lang="ts" setup>
import {useQuasar} from "quasar";
import Modal from "src/components/Modal/Modal.vue";
import {toast} from "src/helpers/toast";
import {crearTrazabilidad} from "src/helpers/trazabilidad";
import {inputRequired} from "src/helpers/validations";
import {sgdeaAxios} from "src/services";
import {useAuthStore} from "src/stores/auth.store";
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import TableAsignar from "./TableAsignar.vue";
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";
import moment from "moment";


const tableSelection = ref([])
const router = useRouter();
const route = useRoute();
const showModal = ref(false);
const asignarRef = ref();
const showConfirmationModal = ref(false);
const asignaResponsable = ref('si');
const listadoOficinas = ref([])
const listadoDependencias = ref([])
const listadoUsuarios = ref([])
const auth = useAuthStore()
const props = withDefaults(defineProps<{
  pqrData: any[],
}>(), {})

const listUsers = ref([]);
const listUsersOriginal = ref([]);
const listUsuarios = ref([]);
const cardsAsignar = ref([]);
const lengthUsers = ref(false);
const totalUsers = ref([]);
const filteredTotalUsers = ref([]);
const filteredOficinas = ref()
const asignarUsuarioBody = ref({
  usuarioAsignado: '',
  idUser: "",
  motivoAsignacion: '',
  usuarioConsolidador: '',
  nombreUsuarioConsolidador: '',
  nombreOficina: ''
})
const disableSelectConsolidador = ref()
const consolidadorBase = ref()
const consolidadorDependencia = ref()
const oficinaUser = ref();

onMounted(async () => {
  await loadDependencias()
  await loadOficina()
  await loadUsers(auth.userInfo.oficina)
  //await loadConsolidadoresBase()
})
const rowGestor = ref()
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


const getUsers = (rows) => {
  listadoUsuarios.value = [];
  listadoUsuarios.value = rows.map(user => ({
    label: user.firstname + ' ' + user.lastname,
    value: user.id
  }));
};


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
  } else {
    cardsAsignar.value.push({
      name: row.label,
      visible: true,
      user: row.value,
    })
    // const isCardsAsignarEmpty = !cardsAsignar.value.find(dependency => dependency.dependencia === row.dependencia)
    // if (isCardsAsignarEmpty) {
    //
    // }
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
    console.error(error)
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
      listadoOficinas.value = listadoOficinas.value.filter((e) => {
        return e.value !== 26
      })
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
      oficinaUser.value = filteredOficinas.value.find((e) => {
        return e.value == idOficina
      });
      const users = response.data

      const res = users.map((item) => ({
        colaborador: item.firstname + ' ' + item.lastname,
        enabled: item.enabled,
        id: item.id,
        user: item.userName,
        cargo: item?.cargo?.nombre || item.fullname,
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

const loadConsolidadoresBase = async () => {
  try {
    const response = await sgdeaAxios.get("/consolidador/base");
    if (response.data.length > 0) {
      totalUsers.value = response.data.map(user => ({
        label: user.nombre,
        value: user.id,
        oficina: user.oficina
      }));
      asignarUsuarioBody.value.usuarioConsolidador = totalUsers.value[0].value;
      asignarUsuarioBody.value.nombreUsuarioConsolidador = totalUsers.value[0].label;
      asignarUsuarioBody.value.nombreOficina = totalUsers.value[0].oficina
    } else {
      totalUsers.value = [];
      toast.error("No se ha encontrado al menos un consolidador base registrado");
    }
  } catch (error) {
    toast.error("Hubo un error al consultar el consolidador base");
    console.error(error);
    totalUsers.value = [];
  } finally {
    filteredTotalUsers.value = totalUsers.value;
  }
}

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
    listUsers.value = res;
  } catch (error) {
    toast.error('Error al cargar usuarios.');
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
    label: "Oficina",
    field: "grupo",
    sortable: true,
    align: "center",
  }
];

const removeCardAsignar = (user) => {
  const indexSelection = tableSelection.value.findIndex(item => item.id == user)
  tableSelection.value.splice(indexSelection, 1)

  const newCardsAsignar = cardsAsignar.value.filter(card => card.user !== user);
  cardsAsignar.value = newCardsAsignar;

  totalUsers.value = newCardsAsignar.map((e) => {
    return {label: e.name, value: e.user}
  })
};

const handleAssign = (array: any[]) => {
  if (array.length === 0) {
    cardsAsignar.value = [];
    tableSelection.value = []
    asignarUsuarioBody.value.usuarioAsignado = '';
    asignarUsuarioBody.value.idUser = '';
  } else {
    cardsAsignar.value = array.map((item) => ({
      name: item.colaborador || item.label,
      visible: true,
      user: item.id || item.value,
      oficinaData: item.oficinaData || null
    }));
    tableSelection.value = array

    if (array.length > 0) {
      tableSelection.value = array
      const firstSelected = array[0];
      asignarUsuarioBody.value.usuarioAsignado = firstSelected.colaborador;
      asignarUsuarioBody.value.idUser = firstSelected.id;
    }
  }
  totalUsers.value = cardsAsignar.value.map((e) => {
    return {label: e.name, value: e.user}
  })
};

const handleAcceptModal = async () => {
  try {
    if (lengthUsers.value) {
      // Asignacion Masiva
      const assignments = cardsAsignar.value
        .filter(card => card.oficinaData !== null)
        .map(card => ({
          idAsignador: auth.userInfo.userid,
          idGestionador: card.user,
          motivoAsignacion: asignarUsuarioBody.value.motivoAsignacion
        }));
      // seleccionar las oficinas a reasignar
      const offices = cardsAsignar.value
        .filter(card => card.oficinaData === null);

      const assignmentsflad = [
        ...assignments,
        {
          idAsignador: auth.userInfo.userid,
          idGestionador: asignarUsuarioBody.value.usuarioConsolidador?.value || asignarUsuarioBody.value.usuarioConsolidador,
          motivoAsignacion: asignarUsuarioBody.value.motivoAsignacion
        }
      ];

      const uniqueAssignmentsflad = assignmentsflad.filter((assignment, index, self) =>
          index === self.findIndex((t) => (
            t.idGestionador === assignment.idGestionador
          ))
      );

      const response = await sgdeaAxios.post(
        `/pqrd/asignarMasivamente/${route.params.id}?idConsolidador=${asignarUsuarioBody.value.usuarioConsolidador?.value || asignarUsuarioBody.value.usuarioConsolidador}`,
        uniqueAssignmentsflad
      );
      if (response.status == 200 || response.status == 201) {
      showConfirmationModal.value = false;
      // Reasignar en oficinas seleccionadas
      if (offices && offices.length > 0) {
        await sgdeaAxios.put(`/oficinas/reasignar`, {
          idFlujo: 5,
          idCaso: props?.pqrData?.id,
          idOficina: offices.map(office => office.user),
        });
      }
      toast.success('La clonación fue exitosa. Fue enviado un correo de confirmación');
      const gestionadores = cardsAsignar.value
        .map((g, i) => `Gestionador: ${i + 1}. ${g.name}, Pertenece: ${g?.oficinaData == null ? g.name : getPertenece(g.oficinaData)} `)
        .join(', \n');
      let consolidadorName = asignarUsuarioBody.value.nombreUsuarioConsolidador != "" ? asignarUsuarioBody.value.nombreUsuarioConsolidador : asignarUsuarioBody.value.usuarioAsignado
      await crearTrazabilidad(
        {
          proceso: `PQRD${props.pqrData.id}`,
          secuencia: props.pqrData.idRadicado,
          estado: props.pqrData.estado.estado,
          descripcion: `Usuario: ${auth.$state.userInfo.name} ha clonado el radicado, pertenece : ${oficinaUser.value?.label} \n` +
            `Consolidador: ${consolidadorName}, pertenece:  ${asignarUsuarioBody.value.nombreOficina != null && asignarUsuarioBody.value.nombreOficina != ""
              ? asignarUsuarioBody.value.nombreOficina : getConsolidadorOficinaName(consolidadorName)}  \n` +
            `${gestionadores} \n`,
          comentario: 'Clonado',
          nombre: auth.$state.userInfo.name,
          accion: `${auth.$state.userInfo.name} ha clonado el radicado ${props.pqrData.idRadicado}`,
          tramite: props.pqrData.informacionSolicitud.tipologiaEntity.id == 7 ? 'PQRD Express' : 'PQRD',
        }
      )
      await router.push('/bandeja');
      }

    } else {
      // if (allowAsignar(props.pqrData)) {
        let response;
        let actionText = '';
        // Si es usuario se asigna al radicado
        if (cardsAsignar.value[0].oficinaData) {
          actionText = 'asignado';
          response = await sgdeaAxios.post(`/pqrd/asignar/${route.params.id}`, {
            idAsignador: auth.userInfo.userid,
            idGestionador: cardsAsignar.value[0].user,
            motivoAsignacion: asignarUsuarioBody.value.motivoAsignacion
          });
          // caso contrario es oficina, por lo que se reasigna
        } else {
          actionText = 'reasignado';
          const oficinaFinal = [];
          oficinaFinal.push(cardsAsignar.value[0].user);
          response = await sgdeaAxios.put(`/oficinas/reasignar`, {
            idFlujo: 5,
            idCaso: props?.pqrData?.id,
            idOficina: oficinaFinal,
          });
        }

        if (response.status == 200 || response.status == 201) {
          showConfirmationModal.value = false;
          toast.success(`El radicado ha sido ${actionText} con éxito`);
          await crearTrazabilidad({
            proceso: `PQRD${props.pqrData.id}`,
            secuencia: props.pqrData.idRadicado,
            estado: props.pqrData.estado.estado,
            descripcion: `Asignador: ${auth.$state.userInfo.name} \n` +
              `Asignado: ${cardsAsignar.value[0].name} \n` +
              `Motivo: ${asignarUsuarioBody.value.motivoAsignacion}`,
            comentario: 'Asignado',
            nombre: auth.$state.userInfo.name,
            accion: `${auth.$state.userInfo.name} ha ${actionText} el radicado ${props.pqrData.idRadicado}`,
            tramite: props.pqrData.informacionSolicitud.tipologiaEntity.id == 7 ? 'PQRD Express' : 'PQRD',
          })
          await router.push('/bandeja')
        }
      // } else {
      //   toast.error('La fecha actual excede los 3 días hábiles posteriores a la fecha de radicación.');
      // }
    }
  } catch (error) {
    console.error(error);
  }
}

const getPertenece = (oficinaData) => {
  return getOficinaName(oficinaData?.oficina)
};

const getConsolidadorOficinaName = (name) => {
  return getOficinaName(cardsAsignar.value.filter(card => card.name == name)[0].oficinaData.oficina)
}

const getOficinaName = (id) => {
  return listadoOficinas.value.find(oficina => oficina.value == id)?.label || ""
}


watch(cardsAsignar, async (newValue) => {
  asignarUsuarioBody.value.usuarioConsolidador = '';
  asignarRef.value.reset();
  if (newValue.length <= 1) {
    lengthUsers.value = false
  }
  if (newValue.length >= 2) {
    lengthUsers.value = true
    var validator = {
      vices: [],
      oficinas: [],
      consolidador: {},
      qty: 0
    }
    const vicesUnicos = new Set();
    const ofUnicos = new Set();

    newValue.forEach(objeto => {
      // Validar si es usuario, de lo contrario es oficina
      if (objeto.oficinaData) {
        // Se cambia como termina el código para el caso de oficinas de la misma vicepresidencia
        vicesUnicos.add(objeto.oficinaData?.vicePresidencia?.codigo);
        ofUnicos.add(objeto.oficinaData?.oficina);
      } else {
        ofUnicos.add(objeto.user);
        // Se consulta la dependencia y su código
        const getOffice = listadoOficinas.value.find(oficina => oficina.value == objeto.user);
        const getDependency = listadoDependencias.value.find(dependencia => dependencia.value == getOffice.dependencia);
        // Se cambia como termina el código para el caso de oficinas de la misma vicepresidencia


        vicesUnicos.add(getDependency.codigo);
      }
      // validator.consolidador = {
      //   label: objeto.oficinaData?.vicePresidencia?.consolidadorAsignado?.nombre || '-',
      //   value: objeto.oficinaData?.vicePresidencia?.consolidadorAsignado?.id || '-'
      // };
    });

    validator.vices = [...vicesUnicos];
    validator.oficinas = [...ofUnicos];
    validator.qty = newValue.length;
    // Cuando se han elegido de diferentes vicepresidencias
    if (validator.oficinas.includes(15) || validator.vices.length > 1) {
      await loadConsolidadoresBase();
      // Cuando se eligen de diferentes oficinas desde la misma vicepresidencia
    } else if (validator.vices.length == 1 && validator.oficinas.length > 1) {
      const idDependencia = listadoDependencias.value.find(dep => dep.codigo === validator.vices[0]).value;
      await loadConsolidadoresVice(idDependencia);
    }
  }
})

const loadConsolidadoresVice = async (idDependencia: number) => {
  try {
    const response = await sgdeaAxios.get(
      `/usuarios/consolidador-dependencia?idDependencia=${idDependencia}`
    );

    if (response.data && response.data.length > 0) {
      totalUsers.value = response.data.map(user => ({
        label: user.fullname,
        value: user.id,
        oficina: user.usuarioRelaciones[0].seccionSubSeccion.nombre || "",
      }));
      asignarUsuarioBody.value.usuarioConsolidador = totalUsers.value[0].value;
      asignarUsuarioBody.value.nombreUsuarioConsolidador = totalUsers.value[0].label;
      asignarUsuarioBody.value.nombreOficina = totalUsers.value[0].oficina;

    } else {
      toast.error("No se ha encontrado al menos un consolidador para esta vicepresidencia");
      totalUsers.value = [];
    }
  } catch (error) {
    toast.error("Hubo un error al cargar los consolidadores de la vicepresidencia")
    console.error(error);
    totalUsers.value = [];
  } finally {
    filteredTotalUsers.value = totalUsers.value;
  }
}

const selectOptionsFilterFn = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredTotalUsers.value = totalUsers.value
    })
    return
  }
  update(() => {
    filteredTotalUsers.value = totalUsers.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const showModalAsigna = async () => {
  if (await asignarRef.value.validate()) {
    if (cardsAsignar.value.length !== 0) {
      showConfirmationModal.value = true;
    } else {
      toast.error("Debe seleccionar al menos un usuario para completar la asignación");
    }
  } else {
    toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos.");
  }
}

</script>
