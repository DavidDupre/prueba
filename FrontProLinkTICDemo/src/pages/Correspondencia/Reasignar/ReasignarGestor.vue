<template>
  <section>
    <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
      <h3 class="text-bold tw-text-xl q-py-md tw-flex-1 q-px-md">
        Reasignación
      </h3>
      <div class="tw-bg-white q-mt-lg tw-rounded-md">
        <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex tw-flex-row">
          <div class="width-container tw-w-1/2 q-px-sm tw-rounded-xl overflow-hidden" style="border: 1px solid #E3E4E5;">
            <q-table flat :rows="listUsersOriginal" @update:selected="handleAssign" :columns="columnsAsignar2" row-key="id"
              table-header-class="text-black text-h6 " class="sizes q-mr-md tableclass"
              style="margin: 0 auto; border-radius: 15px; min-height: auto; max-height: 400px; overflow: hidden;" :filter="filterValue"
              rows-per-page-label="Páginas" selection="single" v-model:selected="selection" virtual-scroll
              :rows-per-page-options="[8]" color="primary" clearSelection @row-dblclick="dblclickReasignar" >
              <template v-slot:body-cell-colaborador="props" :draggable="true" auto-width >
                <td  class="tw-text-center" :draggable="true" @dragstart="dragAsignar(props.row)">
                  {{ props.row.colaborador }}
                </td>
              </template>
              <template v-slot:top>
                <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
                  Seleccionar el usuario Gestionador
                </span>
                <div class="row tw-justify-center tw-w-full">
                  <span class="tw-text-base tw-font-bold tw-mt-3 tw-w-full">Filtrar por Usuario</span>
                  <q-select :options="searchHelpDataFiltered" fill-input hide-selected
                    use-input v-model="searchUsuariosList" @filter="selectOptionsFilterFn" class="tw-w-full " outlined dense
                    placeholder="Buscar" @input-value="addValue" >
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
              </template>
            </q-table>
          </div>
          <div class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl" style="border: 1px solid #e3e4e5" @dragover.prevent @drop="dropAsignar()">
            <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
              Este es el usuario que ha seleccionado
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
    </div>
    <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
      <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md q-px-sm">
        Motivo de Reasignación
      </h3>
      <q-form ref="formRef">
        <div class="row full-width wrap tw-justify-start justify-around">
          <div class="row full-width">

            <div class="col-12">
              <label class="q-px-md tw-text-label">Observaciones *
                <q-input type="textarea" outlined label="Inserte" dense emit-value v-model="form.observaciones"
                  :rules="[inputRequired, alphanumeric, v => maxLengthInput(1000, v)]" />
              </label>
            </div>
          </div>
        </div>
        <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
          <q-btn class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]" no-caps
            style="border: 1px solid #2c3948" @click="cancelModal = true" label="Cancelar" />
          <q-btn class="tw-w-1/4 tw-h-11 bg-primary text-white" @click="confirmAsignar" label="Reasignar" />
        </div>
      </q-form>
    </div>
    <Modal v-model="confirmModal" title="Confirmación" persistent
      :text="`¿Está seguro de asignar el radicado ${detailsAsignaciones.radicacion.idRadicado} al usuario ${cardsAsignar[0]?.name}?`"
      :is-success="true" :cancelButton="true" @closeModal="confirmModal = false" textButtonCancel="No" text-button="Si"
      @handleAccept="confirmAsignar" />
    <Modal v-model="cancelModal" title="Confirmación" :is-success="false"
      @handleAccept="$emit('backView')" cancel-button textButtonCancel="No" textButton="Si"
      text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
      @close-modal="cancelModal = false" type="button" />
  </section>
</template>

<script lang="ts" setup>

import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

import Modal from 'components/Modal/Modal.vue';

import { columnsAsignar2 } from "..";

import { alphanumeric, inputRequired, maxLengthInput, minLengthInput } from "src/helpers/validations";
import { toast } from "src/helpers/toast";
import { crearTrazabilidad } from 'src/helpers/trazabilidad';
import { useAuthStore } from "src/stores/auth.store";
import { sgdeaAxios } from 'src/services';

const props = withDefaults(defineProps<{
  detailsAsignaciones: any
}>(), {
})
const router = useRouter();
const cardsAsignar = ref([]);
const listUsersOriginal = ref([])
const listUsersCopi = ref([])
const { getUserInfo } = useAuthStore();
const userInfo = ref();
const formRef = ref()
const cancelModal = ref(false)
const confirmModal = ref(false)
const filterValue = ref('')
const filteredRows = ref(listUsersOriginal.value)
const searchHelpDataFiltered = ref([])
const opForUsers = ref()
const selection = ref([])
const selectOficina = ref('')
const form = ref({
  observaciones: '',
  usuarios: [],
})
const searchUsuariosList = ref()

const emit = defineEmits(['backView'])

onMounted(async () => {
  getAllRegisters()
});

const removeCardAsignar = (index) => {
  cardsAsignar.value.splice(index, 1);
  selection.value.splice(index, 1);
};

watch(filterValue, (newValue) => {
  if (newValue) {
    filteredRows.value = listUsersOriginal.value.filter(row =>
      row.colaborador.toLowerCase().includes(newValue.toLowerCase())
    );
  } else {
    filteredRows.value = listUsersOriginal.value;
  }
});

watch(
    () => searchUsuariosList.value,
    (value) => {
      // @ts-ignore
      if (value && value.value) {
        // @ts-ignore
        const user = listUsersOriginal.value.find(it => it.id === value.value)

        if (user) {
          listUsersOriginal.value = listUsersOriginal.value.filter(it => it.id === user.id)
        }
      } else {
        listUsersOriginal.value = listUsersCopi.value
      }
    }
);

watch(
  () => selection.value,
  (value) => {
    if (value.length > 0) {
        searchUsuariosList.value = ''
    }
  }
);

async function getAllRegisters() {
  try {
    userInfo.value = await getUserInfo();
    const { data: oficinasAll } = await sgdeaAxios.get('oficinas/all');

    const oficinaUser = oficinasAll.find(it => it.nombre === userInfo.value?.relations[0]?.oficina);

    const { data: gestionadores } = await sgdeaAxios.get(`/api/usuarios/rolYoficina?rolName=Gestionador${ oficinaUser?.id ? '&oficinaId='+oficinaUser?.id : '' }`);
      listUsersOriginal.value = gestionadores
      .filter(user => user.id !== userInfo.value.userid)
      .map((item) => ({
        colaborador: item.firstname + ' ' + item.lastname,
        enabled: item.enabled,
        id: item.id,
        user: item.userName,
        cargo: 'Gestionador',
        grupo: oficinaUser?.nombre || item.usuarioRelaciones[0]?.oficina?.nombre,
      })).sort((a, b) => a.colaborador.localeCompare(b.colaborador))

    opForUsers.value = listUsersOriginal.value.map((row) => { return { label: row.colaborador, value: row.id } }).sort((a, b) => a.label.localeCompare(b.label))

    listUsersCopi.value = listUsersOriginal.value
  } catch (error) {
    console.error(error)
  }
}

const confirmAsignar = async() =>{
  try {
    if (!(await formRef.value.validate())) {
      toast.error('Debe diligenciar los campos obligatorios')
      return;
    }

    if (cardsAsignar.value.length === 0) {
      toast.error('Debe seleccionar un usuario para completar la acción');
      return;
    }

    const response = await sgdeaAxios.put(`/correspondencia/reAsignarGestionador/${props.detailsAsignaciones.id}/${userInfo.value.userid}`, {
      observaciones: form.value.observaciones,
      usuario: selection.value[0]?.id
    });

    if (response.status == 200) {
      const radicacion = props.detailsAsignaciones.radicacion
      await crearTrazabilidad({
        proceso: `COR${radicacion.id}`,
        secuencia: radicacion.idRadicado,
        estado: radicacion.estadoProceso.estado,
        descripcion: `Usuario:${userInfo.value.name}`+`Reasignado a:${cardsAsignar.value[0].name}`+`Motivo:${form.value.observaciones}`,
        comentario: 'Se ha reasignado el radicado',
        nombre: userInfo.value.name,
        tramite: radicacion.tipoTramite.nombre,
        accion: 'El trámite ha sido reasignado'
      })
      cardsAsignar.value = []
      selection.value = []
      toast.success('El radicado ha sido reasignado con éxito')
      router.push('/correspondencia')
    }
  } catch (error) {
    toast.error('Ha ocurrido un error al momento de hacer la reasignación')
  }
}

const selectOptionsFilterFn = (val: string, update: any) => {
  update(() => {
    if (val === '') {
      searchHelpDataFiltered.value = listUsersOriginal.value.map(({ colaborador, id }) => ({ label: colaborador, value: id })).sort((a, b) => a.label.localeCompare(b.label));
    } else {
      const needle = val.toLowerCase();
      searchHelpDataFiltered.value = opForUsers.value.filter(({ label }) => label?.toLowerCase().includes(needle));
    }
  });
}

const handleAssign = (array: any[]) => {
  cardsAsignar.value = array.map((item) => ({
    name: item.colaborador,
    id: item.id,
    visible: true,
    user: item.user
  }));
};

const dblclickReasignar = (_, row) => {
  if (row) {
    const user = listUsersOriginal.value.find(it => it.id === row.id);
    if (user) {
      selection.value = [user];
    }
  }
}

const rowAsignar = ref()
const dragAsignar = (row) => {
  rowAsignar.value = row
}
const dropAsignar = () => {
  const user = listUsersOriginal.value.find(it => it.id === rowAsignar.value.id);
  if (user) {
    cardsAsignar.value = [{
        id: user.id,
        name: user.colaborador,
        visible: true,
        user: user.user
    }];
    selection.value = [user];
  }
}

const addValue = (value) => {
  searchUsuariosList.value = value
}

</script>
<style scoped>
  .tableclass ::-webkit-scrollbar-thumb {
    background-color: #ffa51e;
  }

  .tableclass ::-webkit-scrollbar-track {
    background-color: #ecf0f1;
  }
</style>
