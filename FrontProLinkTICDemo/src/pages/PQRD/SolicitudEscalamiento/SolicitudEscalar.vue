<template>
   <main class="tw-px-5 q-py-md tw-bg-white tw-rounded-lg">
    <div class="tw-flex tw-justify-between tw-pt-4 tw-mb-4">
      <h1 class="tw-text-3xl tw-font-bold">Solicitud de Escalamiento</h1>
    </div>

    <q-form>
      <section>
        <q-form ref="form" @submit.prevent="submit">
          <div v-for="(escalamiento, index) in formularios" :key="index" class="tw-mb-8 tw-border-b tw-pb-4">
            <div class="tw-grid tw-grid-cols-4 tw-gap-x-4">
              <div class="tw-col-span-4">
                <p class="tw-text-label tw-font-semibold">Motivo de escalamiento *</p>
                <q-input type="textarea" outlined v-model='escalamiento.motivoEscalamiento' label="Inserte" dense
                  :rules="[v => lengthInput(5000, v), inputRequired]" disable />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Días de gestión de escalamiento *</p>
                <q-select :options="diasOptions" map-options emit-value outlined
                  v-model='escalamiento.diasEscalamiento' label="Seleccione" dense :rules="[inputRequired]" disable />
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Hora de escalamiento</p>
                <Time v-model:input-data-prop="escalamiento.horaEscalamiento" label="HH:MM" dense disable />
              </div>
            </div>
          </div>
        </q-form>
      </section>
    </q-form>
  </main>
  <Modal v-model:model-value="showModal" title="Confirmación"
    text="Al cancelar el proceso perderá los datos ingresados en el formulario ¿Desea realizar la acción?"
    :is-success="false" textButtonCancel="No" cancel-button @handleAccept="showModal = false;
            router.push('/bandeja')" text-button="Si" @close-modal="() => (showModal = false)" />
  <Modal v-model:model-value="showModalConfirm" title="Confirmación" text="¿Está seguro de escalar el trámite?"
    :is-success="false" textButtonCancel="No" cancel-button @handleAccept="showModal = false;
            router.push('/bandeja')" text-button="Si" @close-modal="() => (showModal = false)" />
</template>

<script lang="ts" setup>
import { onMounted ,ref, reactive, watch, Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Modal from '../../../components/Modal/Modal.vue';
import Time from "../../../components/FormFields/timePickerComponent.vue";

import { lengthInput, inputRequired } from "../../../../src/helpers/validations"

import { sgdeaAxios } from '../../../../src/services';
import { useAuthStore } from "../../../../src/stores/auth.store";
import { toast } from 'src/helpers/toast';

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()


const props = defineProps<{
  escalamientoData: any[],
  escalamientoInfo?: any[]
}>()

const diasOptions = ['1', '2', '3', '4', '5', '6', '7', '8'];
const formularios = ref<any[]>([])

watch(() => props.escalamientoInfo, (newVal) => {
  if (newVal && newVal.length) {
    formularios.value = newVal.map(item => ({
      motivoEscalamiento: item.motivoEscalamiento || '',
      diasEscalamiento: item.diasEscalamiento?.toString() || '',
      horaEscalamiento: item.horaEscalamiento || ''
    }))
  }
}, { immediate: true })

watch(() => props.escalamientoData, (newVal) => {
  if (newVal && !formularios.value.length) {
    formularios.value = [{
      motivoEscalamiento: newVal.motivoEscalamiento || '',
      diasEscalamiento: newVal.diasEscalamiento?.toString() || '',
      horaEscalamiento: newVal.horaEscalamiento || ''
    }]
  }
}, { immediate: true })



const tableSelection = ref([])
const showRoute = ref(route.params.id)
let vistaActual = ref('vistaEscalar');
let showModal = ref(false)
let showModalConfirm = ref(false)
const listadoOficinas = ref([])
const item = ref([]);
const form = ref()

const listUsers = ref([]);
const cardsAsignar = ref([]);
const totalUsers = ref([]);
const filteredOficinas = ref()
const asignarUsuarioBody = ref({
  usuarioAsignado: '',
  idUser: "",
  motivoAsignacion: '',
  usuarioConsolidador: ''
})

onMounted(async () => {
  await loadOficina()
  formulario.value = props.escalamientoData
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

const removeCardAsignar = (user) => {
  const indexSelection = tableSelection.value.findIndex(item => item.id == user)
  tableSelection.value.splice(indexSelection, 1)
  const index = cardsAsignar.value.findIndex(card => card.user === user);
  cardsAsignar.value.splice(index, 1);
};

const handleAssign = (array: any[]) => {
  if (array.length === 0) {
    cardsAsignar.value = [];
    tableSelection.value = []
    asignarUsuarioBody.value.usuarioAsignado = '';
    asignarUsuarioBody.value.idUser = '';
  } else {
  }
};

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

const dataTable = ref([
  {
    colaborador: 'Maria Jose',
    cargo: 'Coordinadora',
    grupo: 1
  },
  {
    colaborador: 'Maria Jose',
    cargo: 'Coordinadora',
    grupo: 2
  },
  {
    colaborador: 'Maria Jose',
    cargo: 'Coordinadora',
    grupo: 3
  },
  {
    colaborador: 'Maria Jose',
    cargo: 'Coordinadora',
    grupo: 8
  },
  {
    colaborador: 'Maria Jose',
    cargo: 'Coordinadora',
    grupo: 5
  },
  {
    colaborador: 'Maria Jose',
    cargo: 'Coordinadora',
    grupo: 9
  }
])
const formulario = ref({
  dias: "",
  hora: "",
  observaciones: "",
})

const submit = async () => {
  if (await form.value.validate()) {
    //showModalVerification.value = true
  }
  if (!item.value.length) {
    toast.error("Debe seleccionar al menos un usuario");
  }
}
</script>


<style></style>
