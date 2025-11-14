<template>
  <div>
    <section>
      <q-form ref="asignarRef">
        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
                  Reasignación
                </h3>
              </div>
            </template>
            <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
              <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex">
                <div class="width-container tw-w-1/2 q-px-sm tw-rounded-xl" style="border: 1px solid #e3e4e5">
                  <TableAsignar :TABLE_BODY="listUsers" :TABLE_HEADER="columnsAsignar" :rowGestor="rowGestor" @update:dragEvent="dragGestor" @update:handleDblClickEvent="handleDoubleClickEvent"
                    :listadoOficinas="listadoOficinas" @update:item-selected="handleAssign" row-key="colaborador"
                    :is-selection="false" :mySelection="tableSelection" type-selection="single" :filtered="filteredOficinas"
                    @update:officeSelected="loadUsers" :estado="props.estado" :reasignar="true" />
                </div>
                <div class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl"
                  style="border: 1px solid #e3e4e5" @dragover.prevent @drop="dropGestor()">
                  <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
                    Estos son los usuarios que ha seleccionado
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
              <div class="tw-w-full tw-px-4 tw-pb-4" v-if="lengthUsers">
                <div class="col row">
                  <h3 class="text-bold tw-text-xl tw-pb-2 tw-flex-1 q-px-md">Consolidador</h3>
                </div>
                <p class="q-px-md tw-text-label">Seleccione usuario consolidador *</p>
                <q-select :disable="disableSelectConsolidador" :options="filteredTotalUsers" v-model="asignarUsuarioBody.usuarioConsolidador" map-options
                  emit-value class="tw-w-full" outlined dense use-input fill-input hide-selected label="Seleccione"
                  :rules="[(v) => inputRequired(v)]" @filter="selectOptionsFilterFn">

                  <template v-slot:prepend>
                    <q-icon name="search" />
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

        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
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
                    <!-- <label class="q-px-md tw-text-label">Observaciones *
                      <q-input type="textarea" outlined label="Inserte" dense emit-value
                        v-model="asignarUsuarioBody.motivoAsignacion" :rules="[
                    (v) => inputRequired(v),
                    (v) => maxLengthInput(10000, v),
                    (v) => minLengthInput(10, v),
                  ]" /> -->
                  <CommentTextArea v-model="asignarUsuarioBody.motivoAsignacion" :is-required="true" :max-length="1000" :min-length="10" label="Observaciones"/>

                  </div>
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-card>
      </q-form>
    </section>
    <div class="justify-center tw-w-full tw-m-[10px] tw-mt-10 tw-mb-6 tw-flex tw-gap-4">
      <q-btn label="Cancelar" type="reset" style="width: 240px; height: 40px" text-color="black" color="accent"
        class="tw-rounded-xl" @click="() => (showModal = true)" />
      <q-btn label="Asignar" text-color="white" @click="showModalAsigna" style="width: 240px; height: 40px"
        color="primary" class="tw-rounded-xl tw-btn tw-p-2" />
    </div>
  </div>

  <Modal v-model:model-value="showModal" title="¡Espera un momento!"
    text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
    :is-success="false" textButtonCancel="No" cancel-button @handleAccept="
                    showModal = false;
                  router.push('/bandeja');
                  " text-button="Si" @close-modal="() => (showModal = false)" />

  <Modal v-model:model-value="showConfirmationModal" title="Confirmación" v-if="lengthUsers"
    :text="`¿Está seguro que desea clonar la PQRD?`" :is-success="false" textButtonCancel="No" cancel-button
    @handleAccept="handleAcceptModal" text-button="Si" @close-modal="() => (showConfirmationModal = false)" />

  <Modal v-model:model-value="showConfirmationModal" title="Confirmación" v-if="!lengthUsers"
    :text="`¿Está seguro de reasignar el radicado #${props.pqrData.idRadicado} al encargado ${asignarUsuarioBody.usuarioAsignado}?`"
    :is-success="false" textButtonCancel="No" cancel-button @handleAccept="handleAcceptModal" text-button="Si"
    @close-modal="() => (showConfirmationModal = false)" />
</template>

<script lang="ts" setup>
import Modal from "src/components/Modal/Modal.vue";
import { toast } from "src/helpers/toast";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { inputRequired } from "src/helpers/validations";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import TableAsignar from "src/pages/PQRD/Asignacion/TableAsignar.vue";
import CommentTextArea from  "src/shared/components/TextArea/Comments.vue";


const tableSelection = ref([])
const router = useRouter();
const route = useRoute();
const showModal = ref(false);
const asignarRef = ref();
const showConfirmationModal = ref(false);
const listadoOficinas = ref([])
const auth = useAuthStore()
const props = withDefaults(defineProps<{
  pqrData: any[],
  estado: number,
}>(), {
})

const listUsers = ref([]);
const cardsAsignar = ref([]);
const lengthUsers = ref(false);
const totalUsers = ref([]);
const filteredTotalUsers = ref([]);
const filteredOficinas = ref()
const asignarUsuarioBody = ref({
  usuarioAsignado: '',
  idUser: "",
  motivoAsignacion: '',
  usuarioConsolidador: ''
})
const disableSelectConsolidador = ref()
const consolidadorBase = ref("--")

onMounted(async () => {
  await loadOficina()
  await loadUsers(auth.userInfo.oficina)
  await loadConsolidadorBase()
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
  }
}

const loadOficina = async () => {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoOficinas")
    if (response.status == 200 || response.status == 201) {
      listadoOficinas.value = response.data.map((e: { nombre: any; id: any; }) => {
        return {
          label: e.nombre,
          value: e.id
        }
      })
      listadoOficinas.value = listadoOficinas.value.filter((e) => { return e.value !== 26 })
      filteredOficinas.value = listadoOficinas.value
    }
  } catch (error) {
    console.error(error);
  }
}

const loadUsers = async (idOficina:number) => {
  try {
    const response = await sgdeaAxios.get(`/api/usuarios/rolYoficina?rolName=Gestionador&oficinaId=${idOficina}`);
    if (response.status == 200) {
      const oficinaUser = filteredOficinas.value.find((e) => { return e.value == idOficina })
      const users = response.data
      .filter(user => user.id !== auth.$state.userInfo.userid);
      const res = users.map((item) => ({
        colaborador: item.firstname + ' ' + item.lastname,
        enabled: item.enabled,
        id: item.id,
        user: item.userName,
        cargo: item.cargo,
        grupo: oficinaUser.label,
        oficinaData: {
          vicePresidencia: item.usuarioRelaciones[0]?.oficina?.dependencia,
          oficina: item.usuarioRelaciones[0]?.oficina?.id
        }
      })).sort((a, b) => a.colaborador.localeCompare(b.colaborador))
      listUsers.value = res
    }
  } catch (error) {
    console.error(error)
  }
}

const loadConsolidadorBase = async () => {
  const response = await sgdeaAxios.get("/consolidador/base")
  consolidadorBase.value = {
    label: response.data.nombre,
    value: response.data.id
  }
}

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

  totalUsers.value = newCardsAsignar.map((e) => { return { label: e.name, value: e.user } })
};

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
      user: item.id,
      oficinaData: item.oficinaData
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
    if (lengthUsers.value) {
      // Asignacion Masiva

      // const assignments = cardsAsignar.value.map(card => ({
      //   idAsignador: auth.userInfo.userid,
      //   idGestionador: card.user,
      //   motivoAsignacion: asignarUsuarioBody.value.motivoAsignacion
      // }));


      // const response = await sgdeaAxios.post(`/pqrd/asignarMasivamente/${route.params.id}?idConsolidador=${asignarUsuarioBody.value.usuarioConsolidador}`, assignments)

      // if (response.status == 200 || response.status == 201) {
      //   showConfirmationModal.value = false;
      //   toast.success('La clonación fue exitosa. Fue enviado un correo de confirmación');
      //   await crearTrazabilidad({
      //     proceso: `PQRD${props.pqrData.id}`,
      //     secuencia: props.pqrData.idRadicado,
      //     estado: props.pqrData.estado.estado,
      //     descripcion: "Se ha clonado el radicado",
      //     comentario: 'Clonado',
      //     nombre: auth.$state.userInfo.name,
      //     accion: `${auth.$state.userInfo.name} ha clonado el radicado ${props.pqrData.idRadicado}`,
      //     tramite: props.pqrData.informacionSolicitud.tipologiaEntity.id == 7 ? 'PQRD Express' : 'PQRD',
      //   })
      //   await router.push('/bandeja');
      // }

    } else {
      // Asignacion un Solo usuario
      const response = await sgdeaAxios.post(`/pqrd/reasignarMasivamente/${props.pqrData.asignacionPqrdEntity.idAsignacion}`, [
        {
          idAsignador: auth.userInfo.userid,
          idGestionador: cardsAsignar.value[0].user,
          motivoAsignacion: asignarUsuarioBody.value.motivoAsignacion
        }
      ])

      if (response.status == 200 || response.status == 201) {
        showConfirmationModal.value = false;
        toast.success('El radicado ha sido asignado con éxito');
        let dataTraza = {
          proceso: `PQRD${props.pqrData.id}`,
          secuencia: props.pqrData.idRadicado,
          estado: props.pqrData.estado.estado,
          descripcion: `Usuario:${auth.userInfo.name} \n `+
          `Gestionador nuevo:${cardsAsignar.value[0].name } \n `+
          `Comentario: ${asignarUsuarioBody.value.motivoAsignacion}`,
          comentario: 'Asignado',
          nombre: auth.$state.userInfo.name,
          accion: `${auth.$state.userInfo.name} ha asignado el radicado ${props.pqrData.idRadicado}`,
          tramite: props.pqrData.informacionSolicitud.tipologiaEntity.id == 7 ? 'PQRD Express' : 'PQRD',
        }
        await crearTrazabilidad(dataTraza)
        await router.push('/bandeja');
      }
    }
  } catch (error) {
    console.error(error);
  }
}

watch(cardsAsignar, (newValue) => {
  if (newValue.length <= 1){
    lengthUsers.value = false
    asignarUsuarioBody.value.usuarioConsolidador = ''
  } if (newValue.length >= 2){
    lengthUsers.value = true
    var validator = {
      vices: [],
      oficinas: [],
      consolidador: '',
      qty: 0
    }
    const vicesUnicos = new Set();
    const ofUnicos = new Set();
    newValue.forEach(objeto => {
      vicesUnicos.add(objeto.oficinaData?.vicePresidencia?.codigo)
      ofUnicos.add(objeto.oficinaData?.oficina)
      validator.consolidador = {
        label: objeto.oficinaData?.vicePresidencia?.consolidadorAsignado?.nombre || '-',
        value: objeto.oficinaData?.vicePresidencia?.consolidadorAsignado?.id || '-'
      }
    });
    validator.vices = [...vicesUnicos]
    validator.oficinas = [...ofUnicos]
    validator.qty = newValue.length
    if (validator.oficinas.includes(15) || validator.vices.length > 1) {
      disableSelectConsolidador.value = true
      asignarUsuarioBody.value.usuarioConsolidador = consolidadorBase.value
    }else if (validator.vices.length == 1  && validator.oficinas.length > 1) {
      disableSelectConsolidador.value = true
      asignarUsuarioBody.value.usuarioConsolidador = validator.consolidador
    }else {

    }
  }
})

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
