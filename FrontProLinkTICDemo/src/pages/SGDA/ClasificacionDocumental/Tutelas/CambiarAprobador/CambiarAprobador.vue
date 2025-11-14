<template>
  <q-form ref="form">

    <div class="tw-bg-white q-mt-lg tw-rounded-md">
        <h3 class="text-bold tw-text-xl q-py-md tw-flex-1 q-px-md">
          Cambiar aprobador
        </h3>
        <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex tw-flex-row">
          <div class="width-container tw-w-1/2 q-px-sm tw-rounded-xl" style="border: 1px solid #E3E4E5;">
            <TableAsignar
              :TABLE_BODY="listUsers"
              :TABLE_HEADER="columnsAsignar"
              @update:item-selected="handleAssign"
              row-key="id"
              :is-selection="false"
              type-selection="single"
            />
          </div>
          <div class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl" style="border: 1px solid #e3e4e5">
            <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
              Estos son los usuarios que ha seleccionado
            </span>
            <div class="flex wrap tw-gap-3 q-pt-sm">
              <div v-for="(asign, index) in cardsAsignar" :key="index">
                <div v-if="asign.visible" class="q-px-sm tw-text-base q-py-sm tw-gap-2 flex justify-between tw-text-[#2C3948] tw-rounded-3xl" style="border: 1px solid #e3e4e5">
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


    <div class="tw-bg-white q-mt-lg tw-rounded-md">
      <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md q-px-sm">
        Motivo de asignación
      </h3>
      <div class="row full-width wrap tw-justify-start justify-around">
        <div class="row full-width">
          <div class="col-12">
            <label class="q-px-md tw-text-label">Observaciones * </label>
            <q-input
              type="textarea"
              outlined
              label="Inserte"
              dense
              emit-value
              v-model="observaciones"
              :rules="[inputRequired, v => minLengthInput(10, v), v => maxLengthInput(1000, v)]"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
      <q-btn
      class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]"
      no-caps
      style="border: 1px solid #2c3948"
      label="Cancelar"
      @click="handleCancel"
      />
      <q-btn
        class="tw-w-1/4 tw-h-11 text-white"
        color="primary"
        label="Asignar aprobador"
        :disabled="cardsAsignar.length === 0"
        @click="handleForm"
      />
    </div>

  </q-form>
  <!--este modal pa cuando toques el envío-->
  <Modal v-model="showModal" title="Confirmación" persistent
    :text="`¿Está seguro de asignar para aprobación el documento de salida del radicado ${detailsTutela.idRadicado} al abogado ${cardsAsignar[0]?.name}, de la Oficina ${cardsAsignar[0]?.grupo}?`"
    :cancelButton="true" @closeModal="showModal = false" textButtonCancel="No"
    text-button="Si" @handleAccept="assignTutela" />
</template>


<script lang="ts" setup>
import { Ref, onMounted, ref, watch, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import TableAsignar from "components/Tables/TableAsignar.vue";
import Modal from 'components/Modal/Modal.vue';

import { useStateStore } from "src/stores/status.store";
import { columnsAsignar, routes } from "../";
import { inputRequired, maxLengthInput, minLengthInput } from "src/helpers/validations";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { QForm } from "quasar";

const props = withDefaults(defineProps<{
  detailsTutela: any
}>(), {
})

const emit = defineEmits(['handleCancel'])

let showModal = ref(false);
const router = useRouter();
const storeStatus = useStateStore();
const state = storeToRefs(storeStatus);

const documents = ref([]);

const headers = {
  "Access-Control-Allow-Origin": "*",
  accept: "application/json",
  "Content-Type": "application/json",
};

const observaciones = ref(null)
//cards asignar
const cardsAsignar = ref([]);

const form: Ref<QForm | null> = ref(null);
const listUsers = ref([]);

const removeCardAsignar = (index) => {
  cardsAsignar.value.splice(index, 1);
};

const handleCancel = () => {
  emit('handleCancel', 'docSalida')
}

const handleAssign = (array: any[]) => {
  cardsAsignar.value = array.map((item) => ({
    name: item.colaborador,
    oficina: item?.oficina || '-',
    grupo: item.grupo,
    visible: true,
    user: item.user
  }));
};

onBeforeMount(async () => await getAllRegisters('GRUPO TUTELAS'));

async function getAllRegisters(grupo?) {
  const { data } = await sgdeaAxios.get(`/api/usuarios/rolYoficinaNombre?rolName=Aprobador&oficinaName=${grupo}`);

  listUsers.value = data.map((item) => ({
    colaborador: item.firstname + ' ' + item.lastname,
    cargo: item.roles[0].nombre,
    id: item.id,
    user: item.userName,
    grupo: 'GRUPO TUTELAS'
  }))
}

const handleForm = async () => {
  if(await form.value.validate()) {
    if(!cardsAsignar.value.length) {
      toast.error('Debe seleccionar un usuario para continuar con la asignación')
    } else {
      showModal.value = true
    }
  } else {
    toast.error('Debe diligenciar los campos obligatorios para continuar con el proceso')
  }
}

const assignTutela = async () => {
  try {
    const id = props?.detailsTutela.idTutela
    const response = await sgdeaAxios.post(`/tutela/${id}/task/asignarUsuario`, {
      usuario: cardsAsignar.value[0]?.user,
      motivo: observaciones.value
    })
    if (response.status === 200) {

      showModal.value = false
      toast.success('El caso ha sido asignado para aprobar con éxito')
      await router.push('/bandeja');
    }
  } catch (error) {
    showModal.value = false
    toast.error('Ha ocurrido un error al momento de hacer la asignación')
  }
}

</script>
