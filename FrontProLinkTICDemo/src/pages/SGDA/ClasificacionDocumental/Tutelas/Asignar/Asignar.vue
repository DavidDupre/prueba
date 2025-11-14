<template>
  <section>
    <div dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <h3 class="text-bold tw-text-xl q-pb-md q-mx-md">
        Abogado Responsable del Proceso
      </h3>
      <div class="col full-width tw-justify-start justify-around q-mb-md">
        <div class="col full-width">
          <div class="flex q-mx-md column flex-column-fixed">
            <p class="tw-font-bold">Abogado responsable</p>
            <p class="tw-ml-2 tw-mt-2">{{ abogadoAsignado }}</p>
          </div>

          <!-- <div class="q-mt-md q-mx-md tw-flex tw-flex-col">
            <label class="titles block">¿Desea asignar al abogado responsable? *
              <div class="flex items-center tw-gap-32 q-mt-xs">
                <q-radio v-model="valueRadio" val="YES" label="Sí" />
                <q-radio v-model="valueRadio" val="NO" label="No" />
              </div>
            </label>
          </div> -->
        </div>
      </div>
    </div>

    <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
      <h3 class="text-bold tw-text-xl q-py-md tw-flex-1 q-px-md">
        Asignación
      </h3>
      <div class="tw-bg-white q-mt-lg tw-rounded-md">
        <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex tw-flex-row">
          <div class="width-container tw-w-1/2 q-px-sm tw-rounded-xl overflow-hidden" style="border: 1px solid #E3E4E5;">
            <!-- <TableAsignar
                :TABLE_BODY="listUsers"
                :TABLE_HEADER="columnsAsignar"
                @update:item-selected="handleAssign"
                row-key="id"
                :is-selection="varSelect"
                type-selection="single"
                placeholder="Inserte"
                :abogado="abogadoindex"
                :valueRadio="valueRadio"
              /> -->
            <!-- <q-table flat :rows="listUsers" @update:selected="handleAssign" :columns="columnsAsignar" row-key="id"
              table-header-class="text-black text-h6 " class="sizes q-mr-md tableclass"
              style="margin: 0 auto; border-radius: 15px; min-height: auto; max-height: 400px; overflow: hidden;"
              rows-per-page-label="Páginas" selection="single" v-model:selected="selection" virtual-scroll
              :rows-per-page-options="[8]" color="primary" >

              <template v-slot:top-left>
                <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
                  Seleccione los usuarios que desea asignar al radicado
                </span>
                <!== <span class="tw-text-base tw-font-bold tw-mt-3">Oficina</span>
                <q-select :options="opOfi" fill-input hide-selected input-debounce="0"
                  use-input v-model="filterValue" @filter="filterOfi" class="tw-w-full" rounded outlined dense placeholder="Inserte">
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
                </q-select> ==>
              </template>
            </q-table> -->
            <TableAsignar :TABLE_BODY="listUsers" :TABLE_HEADER="columnsAsignar" :rowGestor="rowGestor"
            @update:dragEvent="dragGestor" @update:handleDblClickEvent="handleDoubleClickEvent"
                    :listadoOficinas="listadoOficinas" @update:item-selected="handleAssign" row-key="id"
                    :is-selection="true" v-model:mySelection="selection" :type-selection="disableAll ? 'none' : 'single'"
                    :filtered="filteredOficinas" @update:officeSelected="loadUsers" />
          </div>

          <div class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl" style="border: 1px solid #e3e4e5"  @dragover.prevent @drop="dropGestor()">
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
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
      <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
        Motivo de Asignación
      </h3>
      <q-form ref="form">
        <div class="row full-width wrap tw-justify-start justify-around">
          <div class="row full-width">

            <div class="col-12">
              <label class="q-px-md tw-text-label tw-font-bold">Observaciones *  ({{ observaciones.length }}/1000)
                <q-input type="textarea" :disable="disableAll" outlined label="Inserte" dense emit-value v-model="observaciones"
                  :rules="[inputRequired, v => minLengthInput(10, v), v => maxLengthInput(10000, v)]" />
              </label>
            </div>
          </div>
        </div>
        <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
          <q-btn class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]" no-caps
            style="border: 1px solid #2c3948" @click="cancelModal = true">Cancelar</q-btn>
          <q-btn :disable="disableAll" class="tw-w-1/4 tw-h-11 bg-primary text-white" @click="handleSubmit()">Asignar</q-btn>
        </div>
      </q-form>
    </div>
    <Modal v-model="confirmModal" title="Confirmación" persistent
      :text="`¿Está seguro de asignar el radicado ${detailsTutela.idRadicado} al abogado ${cardsAsignar[0]?.name} del proceso ${detailsTutela.codigoProceso}?`"
      :is-success="false" :cancelButton="true" @closeModal="confirmModal = false" textButtonCancel="No" text-button="Si"
      @handleAccept="confirmAsignar" />
    <Modal v-model="cancelModal" title="¡Espera un momento!" :is-success="false"
      @handleAccept="router.push('/bandeja')" cancel-button textButtonCancel="No" textButton="Si"
      text="Al cancelar la acción perderá los datos ingresados en el formulario, ¿Desea realizar la acción?"
      @close-modal="cancelModal = false" type="button" />
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";

import { onMounted, ref, watch, onBeforeMount, computed, ComputedRef } from "vue";
import { useRoute, useRouter } from "vue-router";
import TableAsignar from "./TableAsignar.vue";
import Modal from 'components/Modal/Modal.vue';

import { useStateStore } from "src/stores/status.store";
import { columnsAsignar } from "..";

import { alphanumeric, inputRequired, maxLengthInput, minLengthInput } from "src/helpers/validations";
import { toast } from "src/helpers/toast";
import { crearTrazabilidad } from 'src/helpers/trazabilidad';
import { useAuthStore } from "src/stores/auth.store";
import { sgdeaAxios } from 'src/services';

const props = withDefaults(defineProps<{
  detailsTutela: any,
  validEtapas: any
}>(), {
})
const route = useRoute();
const router = useRouter();
const cardsAsignar = ref([]);
const observaciones = ref('')
const abogadoAsignado = ref()
const listadoOficinas = ref([])
const abogadoindex = ref(null)
const listUsers = ref([])
const status = ref("");
const form = ref()
const cancelModal = ref(false)
const confirmModal = ref(false)
const auth = useAuthStore()
const disableAll = ref(false)
const store = useStateStore();
const valueRadio = ref('YES')
const filterValue = ref('')
const filteredRows = ref(listUsers.value)
const userInfo = ref()
const { getUserInfo } = useAuthStore();
// const searchHelpData = listUsers.value.map((row) => { return { label: row.colaborador, value: row.colaborador } })
// const searchHelpDataFiltered = ref(searchHelpData)
const selection = ref([])
const filteredOficinas = ref()
const opOficinas = ref()
const opOfi = ref()
const headers = {
  "Access-Control-Allow-Origin": "*",
  accept: "application/json",
  "Content-Type": "application/json",
};
const rowGestor = ref()
// onBeforeMount(async () => await );
const dragGestor = (row: any) => {
  rowGestor.value = row;

  // Selecciona el checkbox asociado con la fila arrastrada
  const index = listUsers.value.findIndex(user => user.id === row.id);
  if (index !== -1) {
    selection.value.push(listUsers.value[index]);
  }
}

const dropGestor = () => {
  const user = listUsers.value.find(element => element.id === rowGestor.value.id);
  const isCardsAsignarEmpty = !cardsAsignar.value.find(element => element.user === user.id);
  if (user && isCardsAsignarEmpty) {
    cardsAsignar.value.push({
      user: user.id,
      name: user.colaborador,
      visible: true,
    });
    // Marca el checkbox como seleccionado
    const index = listUsers.value.findIndex(userItem => userItem.id === user.id);
    if (index !== -1) {
      selection.value.push(listUsers.value[index]);
    }
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
onMounted(async () => {
  //getAllRegisters()
  userInfo.value = await getUserInfo();
  await loadUsers()
  await loadOficina()

  if (!props.validEtapas) {
    toast.error(`No existen etapas procesales parametrizadas para este radicado. Por favor, ingréselas e intente asignar nuevamente.`)
    disableAll.value = true
  }

  var nameAsignado = props.detailsTutela.userId?.firstname + ' ' + props.detailsTutela.userId?.lastname

  abogadoAsignado.value = props.detailsTutela.userId?.firstname && props.detailsTutela.userId?.lastname ?  nameAsignado : 'N/A'
  // if (props.detailsTutela.userId?.firstname) {
  //   var itemUser = props.detailsTutela.userId
  //   cardsAsignar.value = [{
  //     id: itemUser.id,
  //     cargo: itemUser.cargo,
  //     name: nameAsignado,
  //     visible: true,
  //     user: itemUser.userName
  //   }];
  //   selection.value = [ { "colaborador": nameAsignado, "cargo": itemUser.cargo, "grupo": "GRUPO TUTELAS", "id": itemUser.id, "user": itemUser.userName } ]

  // }




  const  dataOfi  = (await sgdeaAxios.get("/oficinas/all"));
    opOficinas.value = dataOfi.data?.map((item: any) => ({
        label: item.nombre,
        value: item.id,
        dependencia: item.dependencia
    }));
    opOfi.value = opOficinas.value
});

const filterOfi = (val, update) => {
    if (val === '') {
        update(() => {
            opOfi.value = opOficinas.value
        })
        return
    }

    update(() => {
        const needle = val.toLowerCase()
        opOfi.value = opOficinas.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
    })
}

const removeCardAsignar = (index) => {
  cardsAsignar.value.splice(index, 1);
  selection.value.splice(index, 1);
};

// watch(filterValue, (newValue) => {
//   if (newValue) {
//     filteredRows.value = listUsers.value.filter(row =>
//       row.colaborador.toLowerCase().includes(newValue.toLowerCase())
//     );
//   } else {
//     filteredRows.value = listUsers.value;
//   }
// });


// const findIndexAbogado = computed(() => listUsers.value.findIndex((item) => item.colaborador.includes(abogadoAsignado.value)))

// const indexAbogado = () => {
//   if (abogadoAsignado.value !== 'N/A') {
//     const index = findIndexAbogado.value
//       if (index !== -1) {
//         abogadoindex.value = index
//       } else{
//         toast.error(`El radicado ${props.detailsTutela.idTutela} no se puede asignar al abogado responsable ya que no está disponible temporalmente. Asigne a otro profesional`)
//       }
//   }
// }

async function getAllRegisters() {
  try {
    const url = process.env.API || "";
    const { data } = await sgdeaAxios.get(`/roles/usuarios?rol=Gestionador`);

    listUsers.value = data.map((item) => ({
      colaborador: item.firstname + ' ' + item.lastname,
      enabled: item.enabled,
      grupo: 'GRUPO TUTELAS',
      id: item.id,
      user: item.userName,
      rol: item.rol,
    }))



    listUsers.value.sort((a, b) => a.colaborador.localeCompare(b.colaborador));
    var selected = listUsers.value.filter((item) => item.colaborador == abogadoAsignado.value)
    if (abogadoAsignado.value !== 'N/A') {
      if (selected.length > 0 && !selected[0].enabled || selected && selected.length == 0) {
        toast.error(`El radicado ${props.detailsTutela.idTutela} no se puede asignar al abogado responsable ya que no está disponible temporalmente. Asigne a otro profesional`)
      }
    }
    // indexAbogado()
  } catch (error) {
    console.error(error);
  }
}

const loadOficina = async () => {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoOficinas")
    if (response.status == 200 || response.status == 201) {
      listadoOficinas.value = response.data.map((e: { nombre: any; id: any; }) => {
        return {
          label: e.nombre,
          value: e.id,
          grupo: 'GRUPO TUTELAS',
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
    const usuariosAsig  = await sgdeaAxios.get(`/tutela/agentes/asignadores`);

    if (usuariosAsig) {
      listUsers.value = usuariosAsig.data
      const res = listUsers.value.map((e) => {
        return {
          colaborador: e.nombre,
          cargo: e.rol.split(',').filter((item) => ['Asignador Responsable', 'Gestionador', 'Asignador Líder'].includes(item)).join(','),
          grupo: e.oficina,
          id: e.id,
          user: e.usuario
        }
      })
      listUsers.value = res
      listUsers.value = listUsers.value.filter((item) => item.id != props.detailsTutela.userId?.id)

      if (props.detailsTutela.estado == 'Para gestión' || props.detailsTutela.estado == 'Para asignar') {

        listUsers.value = listUsers.value.filter((item) => item.cargo.includes('Gestionador'))
      }else{
        listUsers.value = listUsers.value.filter((item) => !(item.cargo.includes('Asignador Responsable') && !item.cargo.includes('Gestionador')))
      }
      listUsers.value = listUsers.value.sort((a, b) => a.colaborador.localeCompare(b.colaborador));
    }
  } catch (error) {
    console.error(error);
  }
}

const handleSubmit = async () => {
  if (await form.value.validate()) {
    try {
      if (cardsAsignar.value.length === 0) {
        toast.error('Debe seleccionar un usuario para completar la acción');
        return;
      }

      const url = process.env.API || "";
      const response = (await sgdeaAxios.get(`${url}/tutela/listadoEtapaProcesalXTutela/${props?.detailsTutela.codigoProceso}`)).data;

      if (response.length > 0) {
        confirmModal.value = true;
      } else {
        toast.error('No existen etapas procesales parametrizadas para este radicado. Por favor, ingréselas e intente asignar nuevamente');
      }
    } catch (error) {
      toast.error('Ha ocurrido un error al realizar la asignación');
    }
  } else {
    toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos.')
  }
}

const confirmAsignar = async () => {
  try {
    const id = props?.detailsTutela.idTutela
    const response = await sgdeaAxios.post(`/tutela/${id}/task/asignarUsuario`, {
      usuario: cardsAsignar.value[0]?.user,
      motivo: observaciones.value
    })

    if (response.status === 200) {
      const id = route.params.id
      const { data } = await sgdeaAxios.get(`/tutela/info/${id}`)
      await crearTrazabilidad({
        proceso: `TUT${data.idTutela}`,
        secuencia: data.idRadicado,
        estado: data.estado,
        descripcion: `Asignador: ${auth.$state.userInfo.name} \n` +
              `Asignado: ${cardsAsignar.value[0].name} \n` +
              `Motivo: ${observaciones.value}`,
        comentario: 'Asignado',
        tramite: 'Tutela',
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} ha asignado el radicado ${data.idRadicado}`,
      })
      abogadoAsignado.value = cardsAsignar.value[0]?.name
      observaciones.value = ''
      form.value.reset()
      cardsAsignar.value = []
      selection.value = []
      toast.success('El radicado ha sido asignado con éxito')
      confirmModal.value = false
      router.push('/bandeja');
    }
  } catch (error) {
    toast.error('Ha ocurrido un error al momento de hacer la asignación')
    confirmModal.value = false
  }
}

const handleAssign = (array: any[]) => {
  cardsAsignar.value = array.map((item) => ({
    id: item.id,
    cargo: item.cargo,
    name: item.colaborador,
    visible: true,
    user: item.user
  }));
};

</script>
<style scoped>
 .tableclass ::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

.tableclass ::-webkit-scrollbar-thumb {
  background-color: #ffa51e;
  width: 5px;
}

.tableclass ::-webkit-scrollbar-track {
  background-color: #ecf0f1;
}

</style>
