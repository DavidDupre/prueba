<template>
  <div>
    <q-form ref="asignarRef" greedy>
      <section v-if="hasRevisor && !['Aprobación rechazada', 'Revisión rechazada'].includes(props.mlData.estado?.estado)">
        <q-card class="tw-mt-3 tw-bg-transparent" flat>
          <div class="col row">
            <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md tw-mt-3">
              Revisor
            </h3>
          </div>
          <div class="tw-w-[50%] tw-mt-4 tw-pl-2">
            <q-table flat :rows="userRevisor" :columns="ASIGNACION_HEADER" :row-key="'numeroTable'"
              table-header-class="text-black text-h6 " class="sizes q-mr-md"
              style="margin: 0 auto; border-radius: 15px; min-height: auto; max-height: 400px " :selection="'none'"
              :rows-per-page-options="[0]" :hide-bottom="true">
            </q-table>
          </div>
        </q-card>
      </section>
      <section v-else>
        <q-card class="tw-rounded-xl tw-mt-4" flat>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md tw-mt-3">
                  Enviar a Revisión
                </h3>
              </div>
            </template>
            <div class="tw-bg-white" style="border-radius: 5px">
              <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex tw-mt-2">
                <div class="width-container tw-w-1/2 q-px-sm tw-rounded-xl" style="border: 1px solid #e3e4e5">
                  <Table :TABLE_BODY="listUsers" :TABLE_HEADER="ASIGNACION_HEADER" :rowGestor="rowGestor"
                    @update:dragEvent="dragGestor" @update:handleDblClickEvent="handleDoubleClickEvent"
                    :listadoOficinas="filteredUsers" @update:item-selected="handleAssign" row-key="uniqueKey"
                    :is-selection="false" :mySelection="tableSelection" type-selection="single"
                    :filtered="filteredUsers" @update:officeSelected="filterUser" placeholder="" title="" />
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
            </div>
          </q-expansion-item>
        </q-card>

        <!-- <q-card class="tw-rounded-xl tw-mt-4 tw-pb-3" flat>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md tw-mt-3">
                  Motivo de Asignación
                </h3>
              </div>
            </template>
            <div class="tw-bg-white q-px-md tw-mt-1" style="border-radius: 5px">
              <div class="row full-width wrap tw-justify-start justify-around">
                <div class="row full-width">
                  <div class="col-12 q-px-md">
                      <CommentTextArea v-model="asignarUsuarioBody.motivoAsignacion" :is-required="true" :max-length="1000" :min-length="10"
                      label="Observaciones" />
                  </div>
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-card> -->
      </section>

      <section v-if="(isAprobMasiva && hasAprob) && !['Aprobación rechazada', 'Revisión rechazada'].includes(props.mlData.estado?.estado)">
        <q-card class="tw-mt-3 tw-bg-transparent" flat>
          <div class="col row">
            <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md tw-mt-3">
              Aprobador
            </h3>
          </div>
          <div class="tw-w-[50%] tw-mt-4 tw-pl-2">
            <q-table v-if="isAprobMasiva" flat :rows="userAprob" :columns="ASIGNACION_HEADER" :row-key="'numeroTable'"
              table-header-class="text-black text-h6 " class="sizes q-mr-md"
              style="margin: 0 auto; border-radius: 15px; min-height: auto; max-height: 400px " :selection="'none'"
              :rows-per-page-options="[0]" :hide-bottom="true">
            </q-table>
            <q-table v-else flat :rows="userAprobador" :columns="ASIGNACION_HEADER" :row-key="'numeroTable'"
              table-header-class="text-black text-h6 " class="sizes q-mr-md"
              style="margin: 0 auto; border-radius: 15px; min-height: auto; max-height: 400px " :selection="'none'"
              :rows-per-page-options="[0]" :hide-bottom="true">
            </q-table>
          </div>
        </q-card>
      </section>

      <section v-else>
        <q-card class="tw-rounded-xl tw-mt-8" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md tw-mt-3">
                  Enviar a Aprobación
                </h3>
              </div>
            </template>
            <div class="tw-bg-white" style="border-radius: 5px">
              <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex tw-mt-2">
                <div class="width-container tw-w-1/2 q-px-sm tw-rounded-xl" style="border: 1px solid #e3e4e5">
                  <Table :TABLE_BODY="listUsersAprob" :TABLE_HEADER="ASIGNACION_HEADER" :rowGestor="rowGestorAprob"
                    @update:dragEvent="dragGestorAprob" @update:handleDblClickEvent="handleDoubleClickEventAprob"
                    :listadoOficinas="filteredUsersAprob" @update:item-selected="handleAssignAprob"
                    row-key="uniqueKey" :is-selection="false" :mySelection="tableSelectionAprob"
                    type-selection="single" :filtered="filteredUsersAprob" @update:officeSelected="filterUserAprob" placeholder="" title="" />
                </div>
                <div class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl"
                  style="border: 1px solid #e3e4e5" @dragover.prevent @drop="dropGestorAprob()">
                  <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
                    Estos son los usuarios que ha seleccionado
                  </span>
                  <div class="flex wrap tw-gap-3 q-pt-sm">
                    <div v-for="(asign, index) in cardsAsignarAprob" :key="index">
                      <div v-if="asign.visible"
                        class="q-px-sm tw-text-base q-py-sm tw-gap-2 flex justify-between tw-text-[#2C3948] tw-rounded-3xl"
                        style="border: 1px solid #e3e4e5">
                        <q-icon size="24px" name="person_outline" />
                        {{ asign.name }}
                        <q-icon class="tw-cursor-pointer" size="24px" name="close"
                          @click="removeCardAsignarAprob(asign.user)" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-card>

        <!-- <q-card class="tw-rounded-xl tw-mt-4 tw-pb-3" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md tw-mt-3">
                  Motivo de Asignación
                </h3>
              </div>
            </template>
            <div class="tw-bg-white q-px-md tw-mt-1" style="border-radius: 5px">
              <div class="row full-width wrap tw-justify-start justify-around">
                <div class="row full-width">
                  <div class="col-12 q-px-md">
                      <CommentTextArea v-model="asignarUsuarioBodyAprob.motivoAsignacion" :is-required="true" :max-length="1000"
                      :min-length="10" label="Observaciones" />
                  </div>
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-card> -->
      </section>

      <div class="justify-center tw-w-full tw-mt-6 tw-pb-8 tw-flex tw-gap-4">
        <q-btn label="Cancelar" type="reset" style="width: 240px; height: 40px" text-color="black" color="accent"
          class="tw-rounded-xl" @click="() => (showModal = true)" />
        <q-btn label="Enviar a revisión" text-color="white" @click="showModalAsigna" style="width: 240px; height: 40px"
          color="primary" class="tw-rounded-xl tw-btn tw-p-2" :loading="loading" />
      </div>
    </q-form>
  </div>

  <Modal v-model:model-value="showModal" title="¡Espera un momento!"
    text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
    :is-success="false" textButtonCancel="No" cancel-button @handleAccept="showModal = false; $emit('redirect')
      " text-button="Si" @close-modal="() => (showModal = false)" />

  <q-dialog v-model="showModalCompromisos" backdrop-color="rgba(0, 0, 0, 0.5)" persistent>
    <q-card class="tw-w-[35%] mx-auto tw-rounded-md">
      <q-form ref="formModalSalida" greedy>
        <q-card-section class="tw-px-8">
          <div class="tw-text-xl tw-font-bold tw-text-[#0a1b48] tw-mb-4 tw-mt-4">Compromisos próximos</div>
          <label class="tw-block tw-text-sm tw-font-bold tw-text-[#777e87]">Compromisos próximos *</label>
          <q-select :options="[{ label: 'Si', value: true }, { label: 'No', value: false }]" outlined label="Inserte"
            dense map-options v-model="formModal.compromisos" :rules="[inputRequired]" />
          <label class="tw-block tw-text-sm tw-font-bold tw-text-[#777e87] tw-mt-4">Observaciones</label>
          <q-input outlined label="Seleccione" dense v-model="formModal.observaciones"
            :rules="[(v) => maxLengthInput(1000, v), inputRequired]"
            :disable="formModal.compromisos == 'No' || formModal.compromisos?.label == 'No'" />
        </q-card-section>
        <div class="tw-flex tw-justify-center tw-items-center tw-pb-6 tw-pt-3 tw-gap-3">
          <q-btn flat label="Cancelar" color="secondary" class="tw-w-[35%] tw-h-10" @click="$emit('redirect')" />
          <q-btn label="Guardar" color="secondary" class="tw-w-[35%] tw-h-10" @click="handleAcceptModal" />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { useQuasar } from "quasar";
import Modal from "src/components/Modal/Modal.vue";
import { toast } from "src/helpers/toast";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { inputRequired, maxLengthInput, minLengthInput } from "src/helpers/validations";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import Table from "./Table.vue";
import { Medicina } from "src/interfaces";
import { ASIGNACION_HEADER } from ".";
import sortUsers from "src/helpers/sortUsers";
import CommentTextArea from  "src/shared/components/TextArea/Comments.vue";
import { crearTrazabilidadDocumento } from "src/helpers/trazabilidadDocumento";


const props = withDefaults(defineProps<{
  mlData: Medicina,
  isExpediente: boolean,
  documento: string,
  userName: string,
  userRol: string,
  isChangeDoc : boolean,
}>(), {
})
const userAprob = [{
  colaborador: props.mlData.asignacion?.datosSalida?.documentoSalida?.prefijo?.aprobador?.firstname + ' ' + props.mlData.asignacion?.datosSalida?.documentoSalida?.prefijo?.aprobador?.lastname,
  cargo: props.mlData.asignacion?.datosSalida?.documentoSalida?.prefijo?.aprobador?.cargo,
  grupo: props.mlData.asignacion?.datosSalida?.documentoSalida?.prefijo?.oficina?.nombre,
  id: props.mlData.asignacion?.datosSalida?.documentoSalida?.prefijo?.aprobador?.id,
  idOficina: props.mlData.asignacion?.datosSalida?.documentoSalida?.prefijo?.oficina?.id
}]
const userRevisor = [{
  colaborador: props.mlData.asignacion?.idRevisor?.firstname + ' ' + props.mlData.asignacion?.idRevisor?.lastname,
  cargo: props.mlData.asignacion?.idRevisor?.cargo,
  grupo: props.mlData.asignacion?.idRevisor?.usuarioRelaciones[0]?.oficina.nombre,
  id: props.mlData.asignacion?.idRevisor?.id,
  idOficina: props.mlData.asignacion?.idRevisor?.usuarioRelaciones[0]?.oficina.id
}]
const userAprobador = [{
  colaborador: props.mlData.asignacion?.idAprobador?.firstname + ' ' + props.mlData.asignacion?.idAprobador?.lastname,
  cargo: props.mlData.asignacion?.idAprobador?.cargo,
  grupo: props.mlData.asignacion?.idAprobador?.usuarioRelaciones[0]?.oficina.nombre,
  id: props.mlData.asignacion?.idAprobador?.id,
  idOficina: props.mlData.asignacion?.idAprobador?.usuarioRelaciones[0]?.oficina.id
}]

const isAprobMasiva = props.mlData.asignacion?.datosSalida?.documentoSalida?.prefijo?.aprobacionAutomatica ? true : false
const hasRevisor= props.mlData.asignacion?.idRevisor?.id
const hasAprob= props.mlData.asignacion?.idAprobador?.id
const showModalCompromisos = ref(false)
const tableSelection = ref([])
const tableSelectionAprob = ref([])
const q = useQuasar();
const router = useRouter();
const showModal = ref(false);
const asignarRef = ref();
const auth = useAuthStore()
const listUsers = ref([]);
const listUsersAprob = ref([]);
const cardsAsignar = ref([]);
const cardsAsignarAprob = ref([]);
const totalUsers = ref([]);
const filteredUsers = ref()
const filteredUsersAprob = ref()
const originalListUser = ref()
const originalListUserAprob = ref()
const asignarUsuarioBody = ref({
  usuarioAsignado: '',
  idUser: "",
  motivoAsignacion: '',
  usuarioConsolidador: '',
  idOficina: ''
})
const asignarUsuarioBodyAprob = ref({
  usuarioAsignado: '',
  idUser: "",
  motivoAsignacion: '',
  usuarioConsolidador: '',
  idOficina: ''
})
const formModalSalida = ref()
const formModal = ref({
  compromisos: props.mlData.asignacion?.metaDatos?.compromisosProximos,
  observaciones: props.mlData.asignacion?.metaDatos?.observacion
})

const rowGestor = ref()
const rowGestorAprob = ref()
const loading = ref(false)

onMounted(async () => {
  await loadUsers(true)
  filteredUsers.value = listUsers.value.map((e: {
    colaborador: any; firstname: any; lastname: any; id: any;
  }) => {
    return {
      label: e.colaborador,
      value: e.id
    }
  })
  originalListUser.value = listUsers.value
  filteredUsersAprob.value = listUsersAprob.value.map((e: {
    colaborador: any; firstname: any; lastname: any; id: any;
  }) => {
    return {
      label: e.colaborador,
      value: e.id
    }
  })
  originalListUserAprob.value = listUsersAprob.value
})

const dragGestor = (row: any) => {
  rowGestor.value = row
}

const dragGestorAprob = (row: any) => {
  rowGestorAprob.value = row
}

const dropGestor = () => {
  const user = listUsers.value.find(element => element.id === rowGestor.value.id);
  const isCardsAsignarEmpty = !cardsAsignar.value.find(element => element.user === user.id)
  if (user && isCardsAsignarEmpty) {
    cardsAsignar.value.push({
      user: user.id,
      name: user.colaborador,
      visible: true,
    })
  }
}

const dropGestorAprob = () => {
  const user = listUsersAprob.value.find(element => element.id === rowGestorAprob.value.id);
  const isCardsAsignarEmpty = !cardsAsignarAprob.value.find(element => element.user === user.id)
  if (user && isCardsAsignarEmpty) {
    cardsAsignarAprob.value.push({
      user: user.id,
      name: user.colaborador,
      visible: true,
    })
  }
}

const handleDoubleClickEvent = (row: any) => {
  const user = listUsers.value.find(element => element.id === row.id);
  const isCardsAsignarEmpty = !cardsAsignar.value.find(element => element.user === user.id)
  if (user && isCardsAsignarEmpty) {
    cardsAsignar.value.push({
      user: user.id,
      name: user.colaborador,
      visible: true,
    })
  }
}

const handleDoubleClickEventAprob = (row: any) => {
  const user = listUsersAprob.value.find(element => element.id === row.id);
  const isCardsAsignarEmpty = !cardsAsignarAprob.value.find(element => element.user === user.id)
  if (user && isCardsAsignarEmpty) {
    cardsAsignarAprob.value.push({
      user: user.id,
      name: user.colaborador,
      visible: true,
    })
  }
}

const loadUsers = async (initial: boolean = false) => {
  try {
    if (initial) {
      const responseOfi = await sgdeaAxios.get("/oficinas/all")
      const response = await sgdeaAxios.get(`/api/usuarios/rolYoficina`, { params: { rolName: "Revisor" } })
      const responseAprob = await sgdeaAxios.get(`/api/usuarios/rolYoficina`, { params: { rolName: "Aprobador" } })
      if (response.status == 200) {
        const users = response.data;
        const usersAprob = responseAprob.data;
        const res = sortUsers(users).flatMap((e) => {
          return e.usuarioRelaciones
            .filter(rel => rel.rol?.nombre === "Revisor")
            .map(rel => ({
              colaborador: e.firstname + ' ' + e.lastname,
              cargo: e.cargo?.nombre,
              grupo: rel.oficina?.nombre,
              id: e.id,
              uniqueKey: `${e.id}-${rel.oficina?.nombre}`,
              idOficina: rel.oficina?.id
            }));
        })
        listUsers.value = res
        const resAprob = sortUsers(usersAprob).flatMap((e) => {
          return e.usuarioRelaciones
            .filter(rel => rel.rol?.nombre === "Aprobador")
            .map(rel => ({
              colaborador: e.firstname + ' ' + e.lastname,
              cargo: e.cargo?.nombre,
              grupo: rel.oficina?.nombre,
              id: e.id,
              uniqueKey: `${e.id}-${rel.oficina?.nombre}`,
              idOficina: rel.oficina?.id
            }));
        })
        listUsersAprob.value = resAprob
      }
      return;
    }
  } catch (error) {
    console.error(error)
  }
}

const removeCardAsignar = (user) => {
  const indexSelection = tableSelection.value.findIndex(item => item.id == user)
  tableSelection.value.splice(indexSelection, 1)
  const newCardsAsignar = cardsAsignar.value.filter(card => card.user !== user);
  cardsAsignar.value = newCardsAsignar;
  totalUsers.value = newCardsAsignar.map((e) => { return { label: e.name, value: e.user } })
};

const removeCardAsignarAprob = (user) => {
  const indexSelection = tableSelectionAprob.value.findIndex(item => item.id == user)
  tableSelectionAprob.value.splice(indexSelection, 1)
  const newCardsAsignar = cardsAsignarAprob.value.filter(card => card.user !== user);
  cardsAsignarAprob.value = newCardsAsignar;
  totalUsers.value = newCardsAsignar.map((e) => { return { label: e.name, value: e.user } })
};

const handleAssign = (array: any[]) => {
  if (array.length === 0) {
    cardsAsignar.value = [];
    tableSelection.value = []
    asignarUsuarioBody.value.usuarioAsignado = '';
    asignarUsuarioBody.value.idUser = '';
    asignarUsuarioBody.value.idOficina = '';
  } else {
    cardsAsignar.value = array.map((item) => ({
      name: item.colaborador,
      visible: true,
      user: item.id
    }));
    tableSelection.value = array

    if (array.length > 0) {
      tableSelection.value = array
      const firstSelected = array[0];
      asignarUsuarioBody.value.usuarioAsignado = firstSelected.colaborador;
      asignarUsuarioBody.value.idUser = firstSelected.id;
      asignarUsuarioBody.value.idOficina = firstSelected.idOficina;
    }
  }
  totalUsers.value = cardsAsignar.value.map((e) => { return { label: e.name, value: e.user } })
};

const handleAssignAprob = (array: any[]) => {
  if (array.length === 0) {
    cardsAsignarAprob.value = [];
    tableSelectionAprob.value = []
    asignarUsuarioBodyAprob.value.usuarioAsignado = '';
    asignarUsuarioBodyAprob.value.idUser = '';
    asignarUsuarioBodyAprob.value.idOficina = '';
  } else {
    cardsAsignarAprob.value = array.map((item) => ({
      name: item.colaborador,
      visible: true,
      user: item.id
    }));
    tableSelectionAprob.value = array

    if (array.length > 0) {
      tableSelectionAprob.value = array
      const firstSelected = array[0];
      asignarUsuarioBodyAprob.value.usuarioAsignado = firstSelected.colaborador;
      asignarUsuarioBodyAprob.value.idUser = firstSelected.id;
      asignarUsuarioBodyAprob.value.idOficina = firstSelected.idOficina;
    }
  }
  totalUsers.value = cardsAsignarAprob.value.map((e) => { return { label: e.name, value: e.user } })
};

const handleAcceptModal = async () => {
  loading.value = true
   const revisorId = cardsAsignar.value[0]?.user || userRevisor[0]?.id;
   const idOficinaRevisor = cardsAsignar.value[0] ? asignarUsuarioBody.value.idOficina : userRevisor[0]?.idOficina;

   let idOficinaAprobador;
   if (isAprobMasiva && !['Aprobación rechazada', 'Revisión rechazada'].includes(props.mlData.estado?.estado)) {
     idOficinaAprobador = userAprob[0]?.idOficina;
   } else if (hasAprob && !['Aprobación rechazada', 'Revisión rechazada'].includes(props.mlData.estado?.estado)) {
     idOficinaAprobador = userAprobador[0]?.idOficina;
   } else {
     idOficinaAprobador = asignarUsuarioBodyAprob.value.idOficina;
   }

  try {
    const headers = {
      "Content-Type": "application/json"
    }
    const response = await sgdeaAxios.put(`/medicina/enviarRevision/${props.mlData.id}`, {
      idRevisor: revisorId,
      motivoAsignacion: asignarUsuarioBody.value.motivoAsignacion,
      idOficinaRevisor: idOficinaRevisor
    },{
      headers: headers
    })

    const responseAprob = await sgdeaAxios.put(`/medicina/enviarAprobacion/${props.mlData.id}`, {
      idAprobador: isAprobMasiva && !['Aprobación rechazada', 'Revisión rechazada'].includes(props.mlData.estado?.estado) ? userAprob[0]?.id : hasAprob && !['Aprobación rechazada', 'Revisión rechazada'].includes(props.mlData.estado?.estado) ? userAprobador[0]?.id : cardsAsignarAprob.value[0]?.user,
      motivoAsignacion: asignarUsuarioBodyAprob.value.motivoAsignacion,
      idOficinaAprobador: idOficinaAprobador
    })

    if (response.status == 200 || response.status == 201 && responseAprob.status == 200 || responseAprob.status == 201) {
      await getModalInfo()
    }
    loading.value = false
  } catch (error) {
    loading.value = false
    console.error(error)
    toast.error("Ha ocurrido un error al enviar a revisión")
  }
}

function filterUser(filterby) {
  listUsers.value = originalListUser.value.filter((e) => e.id == filterby)
}

function filterUserAprob(filterby) {
  listUsersAprob.value = originalListUserAprob.value.filter((e) => e.id == filterby)
}

const showModalAsigna = async () => {
  if (props.mlData.asignacion.metaDatos) {
    if (props.isExpediente) {
      if (props.mlData.asignacion?.datosSalida?.documentoSalida && props.mlData.asignacion?.datosSalida) {
        if (await asignarRef.value.validate()) {
          if ((cardsAsignar.value.length !== 0 || hasRevisor) && (cardsAsignarAprob.value.length !== 0 || isAprobMasiva || hasAprob) ) {
            toast.warning('Recuerde asegurarse de cargar los anexos requeridos para la comunicación');
            showModalCompromisos.value = true
          } else {
            toast.error("Debe seleccionar un usuario para completar la acción")
          }
        } else {
          toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos.")
        }
      } else {
        toast.error("Debe diligenciar los datos y el documento de salida para poder completar la acción")
      }
    } else {
      toast.error("Documento pendiente de inclusión en expediente")
    }
  } else {
    toast.error("Debe ingresar los metadatos para poder completar la acción")
  }
}

const getModalInfo = async () => {
  if (await formModalSalida.value.validate()) {
    await crearTrazabilidad({
      proceso: `ML${props.mlData.id}`,
      secuencia: props.mlData.idRadicado,
      estado: 'Por revisar',
      descripcion: `Gestionó:${auth.$state.userInfo.name}`+`Revisor: ${ hasRevisor? userRevisor[0]?.colaborador : cardsAsignar.value[0].name}` +
      `Motivo asignacion revisor:${asignarUsuarioBody.value.motivoAsignacion}`+ `Aprobador: ${isAprobMasiva ? userAprob[0]?.colaborador : hasAprob? userAprobador[0]?.colaborador :cardsAsignarAprob?.value[0]?.name}`+
      `Motivo asignacion aprobador:${asignarUsuarioBodyAprob.value.motivoAsignacion}`,
      comentario: 'Se ha enviado a revisión el radicado"',
      nombre: auth.$state.userInfo.name,
      accion: `${auth.$state.userInfo.name} ha enviado a revisión el radicado ${props.mlData.idRadicado}`,
      tramite: "Medicina Laboral",
    })
    if(props.isChangeDoc === true){
      await crearTrazabilidadDocumento({
      htmlContent: props.documento,
      usuario: props.userName,
      rol: props.userRol,
    },props.mlData.asignacion?.datosSalida.documentoSalida.id, 'ML')}


    toast.success('El radicado ha sido enviado para revisión con éxito')
    router.push('/bandeja')

    const {documentoSalida}=props.mlData.asignacion?.datosSalida


  } else {
    toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos")
  }
}

watch(() => formModal.value.compromisos, (newVal) => {
  // @ts-expect-error
  if (newVal.label !== "Si" || newVal !== "Si") {
    formModal.value.observaciones = ''
  }
})

</script>
