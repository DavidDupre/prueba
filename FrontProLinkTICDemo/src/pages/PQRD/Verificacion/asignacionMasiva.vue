<template>
  <div>
    <div class="tw-mb-4">
      <p class="pl-4 tw-font-bold tw-text-3xl tw-mt-5 tw-mb-3 text-bold">
        Asignación Masiva
      </p>
    </div>
    <section>
      <q-form ref="asignarRef">
        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
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
                  <TableAsignar :TABLE_BODY="listUsers" :TABLE_HEADER="columnsAsignar"
                    :listadoOficinas="listadoOficinas" @update:item-selected="handleAssign" row-key="colaborador"
                    :is-selection="false" :mySelection="tableSelection" type-selection="single" :filtered="filteredOficinas"
                    @update:officeSelected="loadUsers" />
                </div>
                <div class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl"
                  style="border: 1px solid #e3e4e5">
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
                <q-select :options="filteredTotalUsers" v-model="asignarUsuarioBody.usuarioConsolidador" map-options
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
                    <label class="q-px-md tw-text-label">Observaciones *
                      <q-input type="textarea" outlined label="Inserte" dense emit-value
                        v-model="asignarUsuarioBody.motivoAsignacion" :rules="[
                    (v) => inputRequired(v),
                    (v) => maxLengthInput(10000, v),
                    (v) => minLengthInput(10, v),
                  ]" />
                    </label>
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
                  emit('close-modal')
                  " text-button="Si" @close-modal="() => (showModal = false)" />

  <Modal v-model:model-value="showConfirmationModal" title="Confirmación" v-if="lengthUsers"
    :text="`¿Está seguro que desea clonar la PQRD?`" :is-success="false" textButtonCancel="Cancelar" cancel-button
    @handleAccept="handleAcceptModal" text-button="Clonar" @close-modal="() => (showConfirmationModal = false)" />

  <Modal v-model:model-value="showConfirmationModal" title="Confirmación" v-if="!lengthUsers"
    :text="`¿Está seguro de asignar los radicados al encargado ${asignarUsuarioBody.usuarioAsignado}?`"
    :is-success="false" textButtonCancel="No" cancel-button @handleAccept="handleAcceptModal" text-button="Si"
    @close-modal="() => (showConfirmationModal = false)" />
</template>

<script lang="ts" setup>
import TableAsignar from "./TableAsignar.vue";
import { inputRequired, maxLengthInput, minLengthInput } from "src/helpers/validations";
import { sgdeaAxios } from "src/services";
import { onMounted, ref, watch } from "vue";
import { toast } from "src/helpers/toast";
import { useRoute, useRouter } from "vue-router";
import Modal from "src/components/Modal/Modal.vue";
import { useAuthStore } from "src/stores/auth.store";
import { crearTrazabilidad } from "src/helpers/trazabilidad";


const tableSelection = ref([])
const router = useRouter();
const route = useRoute();
const showModal = ref(false);
const asignarRef = ref();
const showConfirmationModal = ref(false);
const asignaResponsable = ref('si');
const listadoOficinas = ref([])
const auth = useAuthStore()
const props = withDefaults(defineProps<{
  pqrData: any[],
}>(), {
})

const emit = defineEmits(['close-modal', 'assigned'])

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

onMounted(async () => {
  await loadUsers()
  await loadOficina()
})

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
const loadUsers = async (selectedOffice?) => {
  try {
    const response = await sgdeaAxios.get(`/pqrd/listadoUsuariosGestionadores?pageNo=0&pageSize=20&oficina=${selectedOffice ?? auth.$state.userInfo.oficina}`)
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
      listUsers.value = res
    }
  } catch (error) {
    console.error(error);
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
    }
  }
  totalUsers.value = cardsAsignar.value.map((e) => { return { label: e.name, value: e.user } })
};

const handleAcceptModal = async () => {
  try {
      // Asignacion un Solo usuario
      const response = await sgdeaAxios.post(`/pqrd/asignarMasivamentePqrdToUsers/${cardsAsignar.value[0].user}`,
        props.pqrData.map((a) => a.id)
      )

      if (response.status == 200 || response.status == 201) {
        showConfirmationModal.value = false;
        toast.success('Los radicados han sido asignados con éxito');
        // await crearTrazabilidad({
        //   proceso: `PQRD${props.pqrData.id}`,
        //   secuencia: props.pqrData.idRadicado,
        //   estado: props.pqrData.estado,
        //   descripcion: "Se ha asignado el radicado",
        //   comentario: 'Asignado',
        //   nombre: auth.$state.userInfo.name
        // })
        emit('assigned')
        emit('close-modal')
      }
  } catch (error) {
    console.error(error);
  }
}

watch(cardsAsignar, (newValue) => {
  if (newValue.length >= 2){
    lengthUsers.value = true
  } else {
    lengthUsers.value = false
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

// async function asignarUsuario(onSuccess?: () => void | Promise<void>) {

//   if (await asignarRef.value.validate()) {
//     try {
//       const response = await sgdeaAxios.post(`/pqrd/asignar/${route.params.id}`, asignarUsuarioBody.value);
//       toast.success('El radicado ha sido asignado con éxito');
//       if (onSuccess) {
//         onSuccess();
//       }
//       return response.data;

//     } catch (error) {
//       console.error('GG', error);
//       toast.error('No se pudo realizar la asignacion. Intentelo de nuevo más tarde')
//     }
//   }
//   if (!item.value.length) {
//     q.notify({
//       message: "Debe seleccionar un usuario para completar la asignación.",
//       position: "top",
//       color: "red-2",
//       icon: "cancel",
//       iconColor: "black",
//       textColor: "black",
//     });
//   }
// }

const showModalAsigna = async () => {
  if (await asignarRef.value.validate()) {
      if (cardsAsignar.value.length !== 0) {
      showConfirmationModal.value = true;
    } else {
      toast.error("Debe seleccionar un usuario para completar la asignación");
    }
  } else {
    toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos.");
  }
}
</script>
