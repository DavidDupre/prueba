<template>
  <main class="tw-px-5 q-py-md tw-bg-white tw-rounded-lg">
    <div class="tw-flex tw-justify-between tw-pt-4 tw-mb-4">
      <h1 class="tw-text-3xl tw-font-bold">Escalar</h1>
    </div>

    <q-form>
      <section>
        <div class="tw-flex tw-gap-3">

          <div class="tw-w-1/2 tw-p-5 tw-rounded-xl" style="border: 1px solid #E3E4E5;">
            <TableEscalar :TABLE_BODY="listUsers" :TABLE_HEADER="columnsAsignar" :listadoOficinas="listadoOficinas"
              @update:item-selected="handleAssign" row-key="colaborador" :is-selection="false"
              :mySelection="tableSelection" type-selection="multiple" :filtered="filteredOficinas"
              @update:officeSelected="loadUsers" @update:dragEvent="dragGestor" @update:handleDblClickEvent="handleDoubleClickEvent" />
          </div>
          <div class="tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl" style="border: 1px solid #E3E4E5;"  @dragover.prevent @drop="dropGestor()">
            <div class="tw-flex tw-flex-col wrap tw-gap-3 q-pt-sm">
              <div class="">
                <p class="tw-text-lg tw-font-semibold"> Estos son los usuarios que ha seleccionado</p>
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
              <div v-if="cardsAsignar.length === 0" class="tw-text-red-500 text-weight-bold">
                Debe seleccionar al menos un usuario
              </div>
            </div>
          </div>
        </div>


        <section>
          <h2 class="tw-font-bold tw-text-lg tw-mb-2">Motivo del escalamiento</h2>
          <q-form ref="form" greedy>
            <div class="tw-grid tw-grid-cols-4 tw-gap-x-4">
              <div class="tw-col-span-4">
                <label class="tw-text-label tw-font-bold">Motivo de escalamiento *
                  <q-input type="textarea" outlined label="Inserte" dense emit-value
                    v-model="formulario.motivoEscalamiento" :rules="[
                      (v) => inputRequired(v),
                      (v) => maxLengthInput(5000, v),
                      (v) => minLengthInput(10, v),
                    ]" />
                </label>
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Días de gestión de escalamiento *</p>
                <q-select :options="crearArrayDiasRestantes()" map-options emit-value outlined
                  v-model='formulario.diasEscalamiento' label="Seleccione" dense :readonly="limitDias":rules="[inputRequired]" />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Hora de escalamiento </p>
                <Time
                  v-model:input-data-prop="formulario.horaEscalamiento"
                  label="HH:MM"
                  :maxTime="crearArrayDiasRestantes().length === 1 ? '17:30' : undefined"
                  @validaHora="handleValidacionHora"
                    mensajeError="Se puede enviar a escalamiento hasta"
                  dense
                />
              </div>
            </div>
            <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
              <q-btn outline class="tw-w-1/4 tw-h-10" style="border: 1px solid #2C3948;"
                @click="() => showModal = true">Cancelar</q-btn>
              <q-btn class="bg-primary text-white tw-w-1/4" @click="(validations)">Escalar</q-btn>
            </div>
          </q-form>

        </section>

      </section>
    </q-form>
  </main>
  <Modal v-model:model-value="showModal" title="Confirmación"
    text="Al cancelar el proceso perderá los datos ingresados en el formulario ¿Desea realizar la acción?"
    :is-success="false" textButtonCancel="No" cancel-button @handleAccept="showModal = false;
    emit('volver')" text-button="Si" @close-modal="() => (showModal = false)" />
  <Modal v-model:model-value="showModalConfirm" title="Confirmación" text="¿Está seguro de escalar el trámite?"
    :is-success="false" textButtonCancel="No" cancel-button @handleAccept="submit();
    " text-button="Si" @close-modal="() => (showModal = false)" />
  <!-- router.push('/bandeja') -->
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive, watch, Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TableEscalar from "./TableEscalar.vue";
import Modal from 'components/Modal/Modal.vue';
import Time from "components/FormFields/timePickerComponent.vue";

import { inputRequired, maxLengthInput, minLengthInput } from "src/helpers/validations";

import { ASIGNACION_HEADER } from "./"
import { sgdeaAxios } from 'src/services';
import { useAuthStore } from "src/stores/auth.store";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { toast } from 'src/helpers/toast';

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()


const tableSelection = ref([])
const showRoute = ref(route.params.id)
let vistaActual = ref('vistaEscalar');
let showModal = ref(false)
let showModalConfirm = ref(false)
const limitDias = ref(false);
const listadoOficinas = ref([])
const item = ref([]);
const form = ref()
const props = withDefaults(defineProps<{
  pqrData: any,
}>(), {
})

const listUsers = ref([]);
const cardsAsignar = ref([]);
const totalUsers = ref([]);
const filteredOficinas = ref()
const asignarUsuarioBody = ref([{
  usuarioAsignado: '',
  idUser: "",
  motivoAsignacion: '',
  usuarioConsolidador: ''
}])


onMounted(async () => {
  await loadOficina()
  await loadUsers(undefined, true)
})

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

const emit = defineEmits(['escalado', 'volver'])

const removeCardAsignar = (user) => {
  const indexSelection = tableSelection.value.findIndex((item) => item.id == user);
  if (indexSelection !== -1) {
    tableSelection.value.splice(indexSelection, 1);
  }
  const index = cardsAsignar.value.findIndex((card) => card.user === user);
  if (index !== -1) {
    cardsAsignar.value.splice(index, 1);
  }
};

const handleAssign = (array: any[]) => {
  cardsAsignar.value = array.map((item) => ({
    name: item.colaborador,
    visible: true,
    user: item.id,
  }));
  tableSelection.value = array;

  const usuarios = array.map((item) => ({ usuario: item.id }));
  asignarUsuarioBody.value.idUser = usuarios;

  totalUsers.value = cardsAsignar.value;
};

const loadOficina = async () => {
  try {
    const response = await sgdeaAxios.get("/oficinas/oficinasSeries")
    if (response.status == 200 || response.status == 201) {
      listadoOficinas.value = response.data.map((e: { nombre: any; id: any; }) => {
        return {
          label: e.nombre,
          value: e.id_dependencia
        }
      })
      listadoOficinas.value = listadoOficinas.value.filter((e) => { return e.value !== 26 })
      filteredOficinas.value = listadoOficinas.value
    }
  } catch (error) {
    console.error(error);
  }
}


const loadUsers = async (selectedOffice?: any, initial: boolean = false) => {
  const { relations } = auth.userInfo;
  try {
    if (initial) {
  const firstValid = relations.find(of => of !== "N/A");
  const selectedOffice = listadoOficinas.value.find((e) => e.label === firstValid?.oficina)?.value;

  if (selectedOffice) {
    const response = await sgdeaAxios.get(`/pqrd/listadoUsuarioAsignacionPQRD?pageNo=0&pageSize=20&oficinaUsuario=${selectedOffice}`);
    if (response.status === 200) {
      const users = response.data.elementos;
      const res = users.map((e) => ({
        colaborador: e.fullName,
        cargo: e.cargo,
        grupo: e.oficina,
        id: e.usuarioId,
      }));
      listUsers.value = res;
    }
  }
  return;
}
    const response = await sgdeaAxios.get(`/pqrd/listadoUsuarioAsignacionPQRD?pageNo=0&pageSize=20&oficinaUsuario=${selectedOffice ?? ''}`)
     if (response.status == 200) {
       listUsers.value = response.data.elementos
       const res = listUsers.value.map((e) => {
         return {
           colaborador: e.fullName,
           cargo: e.cargo,
           grupo: e.oficina,
           id: e.usuarioId
         }
       })
       res.sort((a, b) => a.colaborador.localeCompare(b.colaborador));
       listUsers.value = res
     }
  } catch (error) {
    console.error(error)
  }
}

const formulario = ref({
  motivoEscalamiento: "",
  diasEscalamiento: "",
  horaEscalamiento: "",
  pqrdId: 0,
  escaladorId: auth.$state.userInfo.userid,
  usuarios: []
})

// {
//   "motivoEscalamiento": "string",
//   "diasEscalamiento": 8,
//   "horaEscalamiento": "3:58",
//   "pqrdId": 0,
//   "escaladorId": 0,
//   "usuarios": [
//     {
//       "usuario": 0
//     }
//   ]
// }

const horaValida = ref(true);

const handleValidacionHora = ({ type, data }: { type: string; data: boolean }) => {
  if (type === 'hora') {
    horaValida.value = data;
  }
};

const validations = async () => {
  if (!(await form.value.validate())) {
    toast.error("Debe diligenciar los campos obligatorios para continuar con el proceso.");
    return;
  }

  if (!horaValida.value) {
    toast.error("La hora de escalamiento no es válida");
    return;
  }

  formulario.value.usuarios = asignarUsuarioBody.value.idUser;

  if (!formulario.value.usuarios) {
    showModalConfirm.value = false
    toast.error("Debe seleccionar al menos un usuario");
  } else if (!formulario.value.diasEscalamiento || formulario.value.motivoEscalamiento.length < 10) {
    showModalConfirm.value = false
    toast.error("Debe diligenciar los campos obligatorios");
  } else {
    showModalConfirm.value = true
  }
}

const crearArrayDiasRestantes = () => {
  const totalDias = parseInt(props.pqrData.diasPorVencer.split(' ')[0]) - 2;

  const arrayDias = [];
  for(let i = 1; i <= totalDias; i++) {
    arrayDias.push(i);
  }

  return arrayDias;
}

onMounted(() => {
  const dias = crearArrayDiasRestantes();
  if (dias.length === 1) {
    formulario.value.diasEscalamiento = dias[0];
    limitDias.value = true;
  }
});

const submit = async () => {

  formulario.value.usuarios = asignarUsuarioBody.value.idUser;
  formulario.value.pqrdId = route.params.id;


  if(!formulario.value.horaEscalamiento){
    delete formulario.value.horaEscalamiento
  }

  const response = await sgdeaAxios.post("/pqrd/escalar", formulario.value)
  if (response.status == 200 || response.status == 201) {
    const escaladores = cardsAsignar.value.map((item) => item.name);
    const escaladoresString = escaladores
  .map((name, index) => ` ${name}`)
  .join(", ");
    await crearTrazabilidad({
        proceso: "PQRD" + route.params.id,
        secuencia: props.pqrData.idRadicado,
        estado: props.pqrData.estado.estado,
        descripcion: `Usuario: ${auth.$state.userInfo.name} \n ` +
        `Escaladores: ${escaladoresString} ` +
        `Dias de escalamiento: ${formulario.value.diasEscalamiento} \n ` +
        `Hora de escalamiento: ${formulario.value.horaEscalamiento} \n ` +
        `Motivo: ${formulario.value.motivoEscalamiento}`,
        comentario: 'Escalado',
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} ha escalado la PQRD ${props.pqrData.idRadicado}`,
        tramite: props.pqrData.informacionSolicitud.tipologiaEntity.id == 7 ? 'PQRD Express' : 'PQRD',
      })

      toast.success("El escalamiento se ha realizado de manera correcta");
    emit('escalado')
  } else {
    toast.error("Ha ocurrido un error al escalar el trámite");
  }

  showModal.value = false
}
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


</script>


<style></style>
