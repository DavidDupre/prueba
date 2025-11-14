<template>
  <section>
    <div dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <h3 class="text-bold tw-text-xl q-pb-md q-mx-md">
        Abogado Responsable del Proceso
      </h3>
      <div class="col full-width tw-justify-start justify-around q-mb-md">
        <div class="col full-width">
          <div class="flex q-mx-md column flex-column-fixed">
            <p class="tw-ml-2 tw-mt-2">{{ abogadoAsignado }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
      <h3 class="text-bold tw-text-xl q-py-md tw-flex-1 q-px-md">
        Reasignación
      </h3>
      <div class="tw-bg-white q-mt-lg tw-rounded-md">
        <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex tw-flex-row">
          <div class="width-container tw-w-1/2 q-px-sm tw-rounded-xl" style="border: 1px solid #E3E4E5;">
            <q-table flat :rows="listUsers" @update:selected="handleAssign" :columns="columnsAsignar" row-key="id"
              table-header-class="text-black text-h6 " class="sizes q-mr-md tableclass"
              style="margin: 0 auto; border-radius: 15px; min-height: auto; max-height: 400px "
              rows-per-page-label="Páginas" selection="single" v-model:selected="selection" virtual-scroll
              :rows-per-page-options="[8]" color="primary" @update:dragEvent="dragGestor">
              <template v-slot:body-cell-colaborador="props" :draggable="true" auto-width class="tw-bg-blue">
        <td class="tw-text-center tw-bg-orage -cursor-pointer" :draggable="true" @dragstart="dragGestor(props.row)">
          {{ props.row.colaborador }}
        </td>
      </template>
              <template v-slot:top-left>
                <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
                  Seleccione los usuarios que desea reasignar al radicado
                </span>
                <span class="tw-mt-2 tw-font-bold tw-text-label tw-w-full tw-mb-0.5">
                    Filtrar por Usuario
                  </span>
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
                </q-select>

              </template>

            </q-table>
          </div>
          <div class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl" style="border: 1px solid #e3e4e5" @dragover.prevent @drop="dropGestor()">
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
        Motivo de Reasignación
      </h3>
      <q-form ref="form">
        <div class="row full-width wrap tw-justify-start justify-around">
          <div class="row full-width">

            <div class="col-12">
              <label class="q-px-md tw-text-label tw-font-bold tw-p-0">Observaciones * {{ observaciones.length }}/10000
                <q-input type="textarea" outlined label="Inserte" dense emit-value v-model="observaciones"
                  :rules="[inputRequired, v => minLengthInput(10, v), v => maxLengthInput(10000, v)]" />
              </label>
            </div>
          </div>
        </div>
        <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
          <q-btn class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]" no-caps
            style="border: 1px solid #2c3948" @click="cancelModal = true">Cancelar</q-btn>
          <q-btn class="tw-w-1/4 tw-h-11 bg-primary text-white" @click="handleSubmit()" :disable="detailsTutela.estado === 'Por Aprobar'" >Reasignar</q-btn>
        </div>
      </q-form>
    </div>
    <Modal v-model="confirmModal" title="Confirmación" persistent
      :text="`¿Está seguro de reasignar el radicado ${detailsTutela.idRadicado} del proceso ${detailsTutela.codigoProceso} al abogado ${cardsAsignar[0]?.name}?`"
      :is-success="false" :cancelButton="true" @closeModal="confirmModal = false" textButtonCancel="No" text-button="Si"
      @handleAccept="confirmAsignar" />
    <Modal v-model="cancelModal" title="Confirmación" :is-success="false"
      @handleAccept="router.push('/bandeja')" cancel-button textButtonCancel="No" textButton="Si"
      text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿Desea realizar la acción?"
      @close-modal="cancelModal = false" type="button" />
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";

import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Modal from 'components/Modal/Modal.vue';
import { useStateStore } from "src/stores/status.store";
import { columnsAsignar } from "..";
import { inputRequired, maxLengthInput, minLengthInput } from "src/helpers/validations";
import { toast } from "src/helpers/toast";
import { crearTrazabilidad } from 'src/helpers/trazabilidad';
import { useAuthStore } from "src/stores/auth.store";
import { sgdeaAxios } from 'src/services';
const emit = defineEmits([
  "update:itemSelected",
  "update:officeSelected",
  "update:mySelection",
  'update:dragEvent', 'update:handleDblClickEvent'
]);
const props = withDefaults(defineProps<{
  detailsTutela: any
}>(), {
})
const route = useRoute();
const router = useRouter();
const cardsAsignar = ref([]);
const observaciones = ref('')
const abogadoAsignado = ref()
const listUsers = ref([])
const form = ref()
const cancelModal = ref(false)
const confirmModal = ref(false)
const auth = useAuthStore()
const filterValue = ref({ label: 'GRUPO TUTELAS', value: 18 })
const searchHelpData = listUsers.value.map((row) => { return { label: row.colaborador, value: row.colaborador } })

const searchHelpDataFiltered = ref(searchHelpData)
const selection = ref([])

const opOficinas = ref()
const opOfi = ref()


const rowGestor = ref()

const dragGestor = (row: any) => {
  rowGestor.value = row
  selection.value = [];
  const newRow = { ...row, selected: true };
  selection.value.push(newRow);
  emit('update:dragEvent', row);
}

const dropGestor = () => {
  const user = listUsers.value.find(element => element.id === rowGestor.value.id);
  if (user) {
    const exists = cardsAsignar.value.some(element => element.id === user.id);
    if (!exists) {
      cardsAsignar.value = [{ id: user.id, name: user.colaborador, visible: true }];
    }
  }
}
onMounted(async () => {
  getAllRegisters("Grupo tutelas")

  var nameAsignado = props.detailsTutela.userId?.firstname + ' ' + props.detailsTutela.userId?.lastname

  abogadoAsignado.value = props.detailsTutela.userId?.firstname && props.detailsTutela.userId?.lastname ?  nameAsignado : 'N/A'

  const  dataOfi  = (await sgdeaAxios.get("/oficinas/all"));
    opOficinas.value = dataOfi.data?.map((item: any) => ({
        label: item.nombre,
        value: item.id,
        dependencia: item.dependencia
    }));
    opOfi.value = opOficinas.value
});

const removeCardAsignar = (index) => {
  cardsAsignar.value.splice(index, 1);
  selection.value = []
};

watch(() => filterValue.value, (newOffice) => {
  // @ts-ignore
  getAllRegisters(newOffice.label);
});

async function getAllRegisters(grupo?) {
  try {
    const { data } = await sgdeaAxios.get(`/api/usuarios/rolYoficinaNombre?rolName=Gestionador&oficinaName=${grupo}`);

    listUsers.value = data.map((item) => ({
      colaborador: item.firstname + ' ' + item.lastname,
      enabled: item.enabled,
      cargo: 'Gestionador',
      grupo: grupo,
      id: item.id,
      user: item.userName,
      rol: item.rol,
    }))

    var selected = listUsers.value.filter((item) => item.colaborador == abogadoAsignado.value)

    listUsers.value = listUsers.value.filter((item) => item.colaborador != abogadoAsignado.value)


    listUsers.value.sort((a, b) => a.colaborador.localeCompare(b.colaborador));
    if (abogadoAsignado.value !== 'N/A') {
      if (selected.length > 0 && !selected[0].enabled) {
        toast.error(`El radicado ${props.detailsTutela.idTutela} no se puede asignar al abogado responsable ya que no está disponible temporalmente. Asigne a otro profesional`)
      }
    }
    // indexAbogado()
  } catch (error) {
    console.error(error);
  }
}

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
        descripcion: `Reasignador: ${auth.$state.userInfo.name} \n` +
              `Asignado: ${cardsAsignar.value[0].name} \n` +
              `Motivo: ${observaciones.value}`,
        comentario: 'Reasignado',
        nombre: auth.$state.userInfo.name,
        tramite: 'Tutela',
        accion: `${auth.$state.userInfo.name} ha reasignado el radicado ${data.idRadicado}`,
      })
      abogadoAsignado.value = cardsAsignar.value[0]?.name
      observaciones.value = ''
      form.value.reset()
      cardsAsignar.value = []
      selection.value = []
      toast.success('El radicado ha sido reasignado con éxito')
      confirmModal.value = false
      router.push('/bandeja');
    }
  } catch (error) {
    toast.error('Ha ocurrido un error al momento de hacer la asignación')
    confirmModal.value = false
    console.error(error);
  }
}

const selectOptionsFilterFn = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      searchHelpDataFiltered.value = searchHelpData
    })
    return
  }

  update(() => {
    searchHelpDataFiltered.value = searchHelpData.filter((option) => {
      return option.value.toLowerCase().includes(val.toLowerCase());
    });
  })
}

const handleAssign = (array: any[]) => {
  cardsAsignar.value = array.map((item) => ({
    name: item.colaborador,
    visible: true,
    user: item.user
  }));
};

</script>

<style lang="scss" scoped>
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
