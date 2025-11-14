<template>
  <section>
    <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
      <h3 class="text-bold tw-text-xl q-py-md tw-flex-1 q-px-md">
        Enviar a Revisión
      </h3>
      <div class="tw-bg-white q-mt-lg tw-rounded-md">
        <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex tw-flex-row">
          <div class="width-container tw-w-1/2 q-px-sm tw-rounded-xl" style="border: 1px solid #E3E4E5;">
              <q-table flat :rows="listUsersOriginal" @update:selected="handleAssign" :columns="columnsAsignar2" row-key="id"
                table-header-class="text-black text-h6 " class="sizes q-mr-md tableclass"
                style="margin: 0 auto; border-radius: 15px; min-height: auto; max-height: 400px; overflow: hidden;" :filter="filterValue"
                rows-per-page-label="Páginas" selection="multiple" v-model:selected="selection" virtual-scroll
                :rows-per-page-options="[8]" color="primary" @row-dblclick="dblclickReasignar" >
                <template v-slot:body-cell-colaborador="props" :draggable="true" auto-width >
                  <td  class="tw-text-center" :draggable="true" @dragstart="dragAsignar(props.row)">
                    {{ props.row.colaborador }}
                  </td>
                </template>
                <template v-slot:top-left>
                  <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
                    Seleccione los usuarios que desea asignar al radicado
                  </span>
                  <div class="row tw-w-full">
                    <span class="tw-text-base tw-font-bold tw-mt-3 tw-w-full">Filtrar por Usuario</span>
                    <q-select :options="searchHelpDataFiltered" fill-input hide-selected
                      use-input v-model="searchUsuariosList" @filter="selectOptionsFilterFn" class="tw-w-full" outlined dense
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
                <template v-slot:body-cell-tiempo="props">
                <q-td class="text-center">
                  <div  v-if="cardsAsignar.length !== 0 && isSelected(props.row.id) && ensureUserObjectExists(props.rowIndex, props.key, props.row.cargo)"  class="row tw-items-center tw-justify-center tw-w-full">
                    <q-select emit-value map-options v-model="form.usuarios[props.rowIndex].typeTime" outlined dense :options="[{label: 'Días', value: 'DIA'}, {label: 'Horas', value: 'HORA'}]" class="tw-w-20 tw-p-0" @blur="validarTime" />
                    <q-input v-model="form.usuarios[props.rowIndex].time" outlined dense type="number" class="tw-w-14 tw-p-0 tw-text-center" @blur="validarTime" />
                    <q-icon class="tw-ml-2 tw-cursor-pointer" size="24px" color="red" name="cancel" @click="deletedTime(props.key)" />
                  </div>
                  <p v-else>No aplica</p>
                </q-td>
              </template>
              </q-table>
            </div>
            <div class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl" style="border: 1px solid #e3e4e5" @dragover.prevent @drop="dropAsignar()">
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
                <div v-if="cardsAsignar.length === 0 && cardsAsignar.length === 0" class="tw-text-red-500 text-weight-bold">
                  Debe seleccionar al menos un usuario
                </div>
          </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
      <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md q-px-sm">
        Motivo de la Asignación
      </h3>
      <q-form ref="formRef">
        <div class="row full-width wrap tw-justify-start justify-around">
          <div class="row full-width">

            <div class="col-12">
              <label class="q-px-md tw-text-label">Observaciones *
                <q-input type="textarea" outlined label="Inserte" dense emit-value v-model="form.observaciones"
                  :rules="[inputRequired, alphanumeric, v => minLengthInput(10, v), v => maxLengthInput(1000, v)]" />
              </label>
            </div>
          </div>
        </div>
        <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
          <q-btn class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]" no-caps
            style="border: 1px solid #2c3948" @click="cancelModal = true" label="Cancelar" />
          <q-btn class="tw-w-1/4 tw-h-11 bg-primary text-white" @click="confirmAsignar" label="Enviar" />
        </div>
      </q-form>
    </div>
    <Modal v-model="confirmModal" title="Confirmación" persistent
      :text="`¿Está seguro de asignar el radicado ${detailsRadicado.idRadicado} al usuario ${cardsAsignar[0]?.name}?`"
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
import { useRoute, useRouter } from "vue-router";

import Modal from 'components/Modal/Modal.vue';

import { columnsAsignar2 } from "..";

import { alphanumeric, inputRequired, maxLengthInput, minLengthInput } from "src/helpers/validations";
import { toast } from "src/helpers/toast";
import { crearTrazabilidad } from 'src/helpers/trazabilidad';
import { useAuthStore } from "src/stores/auth.store";
import { sgdeaAxios } from 'src/services';

const props = withDefaults(defineProps<{
  detailsRadicado: any
}>(), {
})
const route = useRoute();
const router = useRouter();
const cardsAsignar = ref([]);
const listUsersOriginal = ref([])
const listUsersCopi = ref([])
const { getUserInfo } = useAuthStore();
const userInfo = ref();
const status = ref("");
const formRef = ref()
const cancelModal = ref(false)
const confirmModal = ref(false)
const filterValue = ref('')
const filteredRows = ref(listUsersOriginal.value)
const searchHelpDataFiltered = ref([])
const opForConsolidador = ref()
const selection = ref([])
const selectOficina = ref('')
const oficinas = ref([])
const form = ref({
  observaciones: '',
  usuarios: [],
})
const searchUsuariosList = ref()

const emit = defineEmits(['backView'])

onMounted(async () => {
  getAllRegisters()


});

function ensureUserObjectExists(index, id, type) {
  if (type === 'Asignador') {
    if (form.value.usuarios[index] === undefined) {
      form.value.usuarios[index] = { usuario: id };
    }
  } else if(type === 'Gestionador'){
    if (form.value.usuarios[index] === undefined) {
      form.value.usuarios[index] = { usuario: id, typeTime: '', time: null };
    }
    return true
  }
}

const removeCardAsignar = (index) => {
  cardsAsignar.value.splice(index, 1);
  selection.value.splice(index, 1);
};

const isSelected = (id) => {
  return selection.value.some(item => item.id === id)
}

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
    (value, oldValue) => {
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
      // @ts-ignore
      if (value.some(it => it.colaborador === searchUsuariosList.value?.label)) {
        searchUsuariosList.value = ''
      }
      const counterAsignadores = value.filter(it => it.cargo === 'Asignador')
      const gestionadorIndexes = selection.value.reduce((acc, item, index) => {
        if (item.cargo === 'Gestionador') {
            acc.push(index);
        }
        return acc;
      }, []);

      if (counterAsignadores.length > 0 && gestionadorIndexes.length > 0 ) {
        const ultimoItem = value[value.length - 1];
        const isNotAsignador = ultimoItem && ultimoItem.cargo !== 'Asignador';

        if (isNotAsignador) {
          const indexToDeleteCard = value.findIndex(item => item.id === counterAsignadores[0]?.id);
          selection.value.splice(indexToDeleteCard, 1);
          cardsAsignar.value.splice(indexToDeleteCard, 1);
        } else {
          gestionadorIndexes.reverse().forEach(index => {
            selection.value.splice(index, 1);
            cardsAsignar.value.splice(index, 1);
          });
          form.value.usuarios = []
        }
      }

      if (counterAsignadores.length > 1) {
        // const indexToDeleteUser = form.value.usuarios.findIndex(user => user.usuario === counterAsignadores[0]?.id);
        const indexToDeleteCard = value.findIndex(item => item.id === counterAsignadores[0]?.id);

        cardsAsignar.value.splice(indexToDeleteCard, 1);
        selection.value.splice(indexToDeleteCard, 1);
        // form.value.usuarios[indexToDeleteUser] = { usuario: null };
      }
    }
  }
);

watch(
    () => selectOficina.value,
    async(newValue, oldValue) => {
      if (newValue !== oldValue) {
        searchUsuariosList.value = ''
        listUsersOriginal.value = []
        // @ts-ignore
        const { data: aprobadores } = await sgdeaAxios.get(`/api/usuarios/rolYoficina?rolName=Aprobador${ newValue.value ? '&oficinaId='+newValue.value : '' }`);
        listUsersOriginal.value = aprobadores.map((item) => ({
          colaborador: item.firstname + ' ' + item.lastname,
          enabled: item.enabled,
          id: item.id,
          user: item.userName,
          cargo: item.cargo,
          grupo: newValue?.label
        })).sort((a, b) => a.colaborador.localeCompare(b.colaborador))
      }
    }
);

const usuarioConTiempoInvalido = ref()

const validarTime = () => {
  usuarioConTiempoInvalido.value = form.value.usuarios.find(it => {
    if (it?.time === null) {
      return false;
    }
    if (it?.typeTime === 'DIA' && (it.time > 31 || it.time <= 0)) {
      return true;
    }
    if (it?.typeTime === 'HORA' && (it.time > 24 || it.time <= 0)) {
      return true;
    }

    return false;
  });
  if (usuarioConTiempoInvalido.value) {
    toast.error(`El tiempo debe estar entre 0 y ${usuarioConTiempoInvalido.value.typeTime === 'DIA' ? 31 : 24} ${usuarioConTiempoInvalido.value.typeTime}`);
  }
}

const deletedTime = (id) => {
  const indexToDeleteCard = selection.value.findIndex(item => item.id === id);
  const indexToDeleteUser = form.value.usuarios.findIndex(item => item?.usuario === id);
  selection.value.splice(indexToDeleteCard, 1)
  cardsAsignar.value.splice(indexToDeleteCard, 1)
  form.value.usuarios[indexToDeleteUser] = { usuario: null, typeTime: '', time: null };
}

async function getAllRegisters() {
  try {
    userInfo.value = await getUserInfo();
    const { data: oficinasAll } = await sgdeaAxios.get('oficinas/all');

    oficinas.value = oficinasAll.map((item) => ({
      label: item.nombre,
      value: item.id,
    })).sort((a, b) => a.label.localeCompare(b.label))

    const oficinaUser = oficinasAll.find(it => it.nombre === userInfo.value?.oficinas[0]);

    const { data: aprobadores } = await sgdeaAxios.get(`/api/usuarios/rolYoficina?rolName=Aprobador${ oficinaUser?.id ? '&oficinaId='+oficinaUser?.id : '' }`);

    listUsersOriginal.value = aprobadores.map((item) => ({
      colaborador: item.firstname + ' ' + item.lastname,
      enabled: item.enabled,
      id: item.id,
      user: item.userName,
      cargo: item.cargo,
      grupo: oficinaUser?.nombre || item.usuariosSeccions[0]?.oficina?.nombre,
    })).sort((a, b) => a.colaborador.localeCompare(b.colaborador))
    opForConsolidador.value = listUsersOriginal.value.map((row) => { return { label: row.colaborador, value: row.id } }).sort((a, b) => a.label.localeCompare(b.label))

    listUsersCopi.value = listUsersOriginal.value
  } catch (error) {
    console.error(error)
  }
}

// const handleSubmit = async () => {
//   if (await formRef.value.validate()) {
//     try {
//       if (cardsAsignar.value.length === 0) {
//         toast.error('Debe seleccionar un usuario para completar la acción');
//         return;
//       }

//       confirmModal.value = true;
//     } catch (error) {
//       toast.error('Ha ocurrido un error al realizar la asignación');
//     }
//   } else {
//     toast.error('Debe diligenciar los campos obligatorios para continuar con el proceso')
//   }
// }

const confirmAsignar = async () => {
  if (await formRef.value.validate()) {
    try {

      if (cardsAsignar.value.length === 0) {
        toast.error('Debe seleccionar un usuario para completar la acción');
        return;
      }

      const id = props?.detailsRadicado.id


      // if (response.status === 200) {
      //   await crearTrazabilidad({
      //     proceso: `COR${props.detailsRadicado.id}`,
      //     secuencia: props.detailsRadicado.idRadicado,
      //     estado: props.detailsRadicado.estadoProceso.estado,
      //     descripcion: "Se ha reasignado el radicado",
      //     comentario: 'Reasignado',
      //     nombre: userInfo.value.name,
      //     tramite: props.detailsRadicado.tipoTramite.nombre,
      //     accion: 'El trámite ha sido reasignado'
      //   })
      //   form.value = {
      //     observaciones: '',
      //     usuarios: []
      //   }
      //   cardsAsignar.value = []
      //   selection.value = []
      //   confirmModal.value = false
      //   toast.success('El caso ha sido reasignado con éxito')
      //   router.push('/correspondencia')
      // }
    } catch (error) {
      toast.error('Ha ocurrido un error al momento de hacer la asignación')
      confirmModal.value = false
      console.error(error)
    }
  } else {
    toast.error('Debe diligenciar los campos obligatorios')
  }
}

const selectOptionsFilterFn = (val: string, update: any) => {
  update(() => {
        if (val === '') {
            searchHelpDataFiltered.value = listUsersOriginal.value.map(({ colaborador, id }) => ({ label: colaborador, value: id })).sort((a, b) => a.label.localeCompare(b.label));
        } else {
            const needle = val.toLowerCase();
            searchHelpDataFiltered.value = opForConsolidador.value.filter(({ label }) => label.toLowerCase().includes(needle));
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

  // const itemDel = selection.value.filter(item => !array.some(it => it.id === item.id));

  // if (itemDel.length > 0 && itemDel[0]?.id) {
  //   const indexToDeleteUser = form.value.usuarios.findIndex(user => user.usuario === itemDel[0]?.id);

  //   if (indexToDeleteUser !== -1) {
  //     form.value.usuarios[indexToDeleteUser] = { usuario: null, typeTime: '', time: null };
  //   }
  // }
};

const dblclickReasignar = (_, row, index) => {
  if (row) {
    const user = listUsersOriginal.value.find(it => it.id === row.id)

    if (user && !cardsAsignar.value.find(it => it.id === user.id)) {
      cardsAsignar.value.push({
        id: user.id,
        name: user.colaborador,
        visible: true,
        user: user.user
      })
      selection.value = [...selection.value, user]
    }
  }
}

const rowAsignar = ref()
const dragAsignar = (row) => {
  rowAsignar.value = row
}
const dropAsignar = () => {
  const user = listUsersOriginal.value.find(it => it.id === rowAsignar.value.id);
  if (user && !cardsAsignar.value.find(it => it.id === user.id)) {
    cardsAsignar.value.push({
      id: user.id,
      name: user.colaborador,
      visible: true,
      user: user.user
    })
    selection.value = [...selection.value, user]
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
