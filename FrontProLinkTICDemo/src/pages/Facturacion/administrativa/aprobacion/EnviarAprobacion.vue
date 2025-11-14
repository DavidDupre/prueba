<template>
  <section>
    <q-form ref="form">

      <div class="tw-bg-white q-mt-lg tw-rounded-md">
        <h3 class="text-bold tw-text-xl q-py-md tw-flex-1 q-px-md">
          Asignación de Aprobador
        </h3>
        <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex tw-flex-row">
          <div class="width-container tw-w-1/2 q-px-sm tw-rounded-xl" style="border: 1px solid #E3E4E5;">
            <TableAsignar :TABLE_BODY="listUsers" :TABLE_HEADER="columnsAsignar" @update:item-selected="handleAssign"
              row-key="id" :is-selection="false" title="Seleccionar el usuario que desea asignar al radicado"
              type-selection="single" />
          </div>
          <div class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl" style="border: 1px solid #e3e4e5">
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
                  <q-icon class="tw-cursor-pointer" size="24px" name="close" @click="removeCardAsignar(index)" />
                </div>
              </div>
              <div v-if="cardsAsignar.length === 0" class="tw-text-red-500 text-weight-bold">
                Debe seleccionar al menos un usuario
              </div>
            </div>
          </div>
        </div>
      </div>
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
                  <label class="q-px-md tw-text-label">Observaciones *
                    <q-input type="textarea" outlined label="Inserte" dense emit-value v-model="observaciones"
                      :rules="[inputRequired, v => maxLengthInput(1000, v), v => minLengthInput(10, v)]" />
                  </label>
                </div>
              </div>
              <div
                class="q-pt-lg q-pb-xl justify-center tw-gap-x-5 tw-w-full tw-flex tw-justify-center tw-gap-x-4 tw-items-center">
                <q-btn class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]" no-caps
                  style="border: 1px solid #2c3948" label="Cancelar" @click="handleCancel" />
                <q-btn class="tw-w-1/4 tw-h-11 bg-primary text-white" label="Asignar aprobador" @click="handleForm" />
              </div>
            </div>
          </div>
        </q-expansion-item>
      </q-card>
    </q-form>
    <Modal v-model="showModalAsignacion" title="Confirmación" persistent
      :text="`¿Está seguro de asignar el radicado ${detailsFac.sec} al aprobador ${cardsAsignar[0]?.name}?`"
      :cancelButton="true" @closeModal="showModalAsignacion = false" textButtonCancel="No" text-button="Si"
      @handleAccept="assignTutela" />
    <Modal v-model="showModal" title="Error" persistent
      text="El trámite se encuentre retenido por ajuste de NC o ND, por lo tanto no se puede envíar a aprobación"
      @closeModal="showModal = false" text-button="OK" @handleAccept="showModal = false" />
  </section>
</template>

<script lang="ts" setup>
import { QForm } from "quasar";

import { Ref, onMounted, ref, onBeforeMount } from "vue";

import TableAsignar from "components/Tables/TableAsignar.vue";
import Modal from 'components/Modal/Modal.vue';

import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { useRouter } from "vue-router";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { useAuthStore } from "stores/auth.store";
import { inputRequired, maxLengthInput, minLengthInput } from "src/helpers/validations";

const props = withDefaults(defineProps<{
  detailsFac: any
}>(), {
})

const cardsAsignar = ref([]);
const observaciones = ref(null)
const listUsers = ref([])
const showModalAsignacion = ref(false);
const showModal = ref(false);
const status = ref("");
const form: Ref<QForm | null> = ref(null);
const router = useRouter();
const auth = useAuthStore();

const emit = defineEmits(['handleCancel'])

const headers = {
  "Access-Control-Allow-Origin": "*",
  accept: "application/json",
  "Content-Type": "application/json",
};

onBeforeMount(async () => await getAllRegisters());

const removeCardAsignar = (index) => {
  cardsAsignar.value.splice(index, 1);
};

async function getAllRegisters() {
  const { data } = await sgdeaAxios.get(
    `/roles/usuarios?rol=Aprobador`
  );

  listUsers.value = data.map((item) => ({
    colaborador: item.firstname + ' ' + item.lastname,
    cargo: item.cargo,
    id: item.id,
    user: item.userName,
    grupo: item.usuarioRelaciones[0].seccionSubSeccion.nombre
  }))
}

const handleCancel = () => {
  emit('handleCancel', 'docSalida')
}

const handleAssign = (array: any[]) => {
  cardsAsignar.value = array.map((item) => ({
    name: item.colaborador,
    oficina: item?.oficina || '-',
    visible: true,
    user: item.user
  }));
};

const handleForm = async () => {
  if (await form.value.validate()) {
    if (!cardsAsignar.value.length) {
      toast.error('Debe seleccionar un usuario para continuar con la asignación')
    } else {
      showModalAsignacion.value = true
    }
  } else {
    toast.error('Debe completar los campos obligatorios')
  }
}

const assignTutela = async () => {
  if (props.detailsFac.estado === 'Retenido') {
    showModal.value = true
    return
  }
  const idParams = router.currentRoute.value.params?.id as string;

  if (!idParams) return;

  const id = parseInt(idParams)
  try {
    const response = await sgdeaAxios.put(`/facturacion/updateFacAdminCto/${id}`, {
      "aprobadorUsuario": cardsAsignar.value[0]?.name,
      "gestionObs": observaciones.value,
      "gestionValorAjuste": 0,
      "tipo": "FACTURA",
      "state": "APROBAR"
    });

    await crearTrazabilidad({
      proceso: "FAC" + props.detailsFac.idFactura,
      secuencia: props.detailsFac.sec,
      estado: "Gestionado",
      descripcion: "Se ha enviado para aprobación",
      comentario: "Gestionado",
      nombre: auth.$state.userInfo.name
    })

    toast.success('La radicación ha sido enviada a aprobación con éxito.');
    router.push('/facturacion/radicados')
  } catch (error) {
    showModalAsignacion.value = false
    toast.error('Ha ocurrido un error al momento de hacer la asignación')
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
    label: "Grupo",
    field: "grupo",
    sortable: true,
    align: "center",
  }
];

</script>
