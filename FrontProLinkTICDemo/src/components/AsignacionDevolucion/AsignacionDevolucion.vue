<template>
  <section>
    <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
      <h3 class="text-bold tw-text-xl q-py-md tw-flex-1 q-px-md">
        Asignación
      </h3>
      <div class="tw-bg-white q-mt-lg tw-rounded-md">
        <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex tw-flex-row">
          <div class="width-container tw-w-1/2 q-px-sm tw-rounded-xl overflow-hidden"
            style="border: 1px solid #E3E4E5;">
            <q-table flat :rows="listUsersOriginal" @update:selected="handleAssign" :columns="columnsAsignar"
              row-key="id" table-header-class="text-black text-h6 " class="sizes q-mr-md tableclass"
              style="margin: 0 auto; border-radius: 15px; min-height: auto; max-height: 400px; overflow: hidden;"
              :filter="filterValue" rows-per-page-label="Páginas" selection="multiple" v-model:selected="selection"
              virtual-scroll :rows-per-page-options="[8]" color="primary" @row-dblclick="dblclickGestores">
              <template v-slot:body-cell-colaborador="props" :draggable="true" auto-width>
                <td class="tw-text-center" :draggable="true" @dragstart="dragGestor(props.row)">
                  {{ props.row.colaborador }}
                </td>
              </template>
              <template v-slot:top-left>
                <span class="full-width tw-text-sm tw-text-[#2C3948] tw-font-bold">
                  Seleccione los usuarios que desea asignar al radicado
                </span>
                <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
                  Funcionarios de la oficina
                </span>
                <q-select v-model="searchUsuariosList.gestionador" outlined dense use-input hide-selected fill-input
                  label="Buscar" :options="searchHelpDataFiltered" @filter="selectOptionsFilterFn" class="tw-w-full"
                  @input-value="v => addValue(v, 'gestionador')">
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Sin resultados
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </template>
            </q-table>
          </div>
          <div class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl" style="border: 1px solid #e3e4e5"
            @dragover.prevent @drop="dropGestor()">
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
                    @click="removeCardAsignar(index, asign.id)" />
                </div>
              </div>
              <div v-if="cardsAsignar.length === 0 && cardsAsignar2.length === 0"
                class="tw-text-red-500 text-weight-bold">
                Debe seleccionar al menos un usuario
              </div>
            </div>
          </div>
        </div>
        <!-- Table 2 -->
        <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex tw-flex-row">
          <div class="width-container tw-w-1/2 q-px-sm tw-rounded-xl overflow-hidden"
            style="border: 1px solid #E3E4E5;">
            <q-table flat :rows="listUsersOriginal2" @update:selected="handleAssign2" :columns="columnsAsignar2"
              row-key="id" table-header-class="text-black text-h6 " class="sizes q-mr-md tableclass"
              style="margin: 0 auto; border-radius: 15px; min-height: auto; max-height: 400px; overflow: hidden;"
              :filter="filterValue2" rows-per-page-label="Páginas" selection="single" v-model:selected="selection2"
              virtual-scroll :rows-per-page-options="[8]" color="primary" clearSelection
              @row-dblclick="dblclickAsignadores">
              <template v-slot:body-cell-colaborador="props" :draggable="true" auto-width>
                <td class="tw-text-center" :draggable="true" @dragstart="dragAsignar(props.row)">
                  {{ props.row.colaborador }}
                </td>
              </template>
              <template v-slot:top>
                <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
                  Funcionarios de otras oficinas
                </span>
                <div class="row tw-justify-center tw-w-full">
                  <span class="tw-text-base tw-font-bold tw-mt-3 tw-w-full">Filtrar por Usuario</span>
                  <q-select v-model="selectOficina" outlined dense fill-input :options="oficinas"
                    class="tw-w-1/2 tw-overflow-hidden tw-text-nowrap tw-text-ellipsis" label="Seleccione"
                    style="padding: 0px;" />
                  <q-select :options="searchHelpDataFiltered2" fill-input hide-selected use-input
                    v-model="searchUsuariosList.asignador" @filter="selectOptionsFilterFn2" class="tw-w-1/2 " outlined
                    dense placeholder="Buscar" @input-value="v => addValue(v, 'asignador')">
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
          <div class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl" style="border: 1px solid #e3e4e5"
            @dragover.prevent @drop="dropAsignar()">
            <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
              Estos son los usuarios que ha seleccionado
            </span>
            <div class="flex wrap tw-gap-3 q-pt-sm">
              <div v-for="(asign, index) in cardsAsignar2" :key="index">
                <div v-if="asign.visible"
                  class="q-px-sm tw-text-base q-py-sm tw-gap-2 flex justify-between tw-text-[#2C3948] tw-rounded-3xl"
                  style="border: 1px solid #e3e4e5">
                  <q-icon size="24px" name="person_outline" />
                  {{ asign.name }}
                  <q-icon class="tw-cursor-pointer" size="24px" name="close" @click="removeCardAsignar2(index)" />
                </div>
              </div>
              <div v-if="cardsAsignar2.length === 0 && cardsAsignar.length === 0"
                class="tw-text-red-500 text-weight-bold">
                Debe seleccionar al menos un usuario
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-form ref="formRef" greedy>
      <div v-show="selection.length > 1" class="tw-bg-white q-mt-lg" style="border-radius: 5px">
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md q-px-sm">
          Seleccione usuario consolidador *
        </h3>
        <div class="row full-width wrap tw-justify-start justify-around">
          <div class="row full-width">
            <q-select outlined label="Inserte" @filter="filterCon" use-input dense emit-value map-options
              v-model="consolidador" :options="searchHelpDataFiltered3"
              :rules="selection.length > 1 ? [inputRequired] : []" class="col-12">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
      </div>
      <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md q-px-sm">
          Motivo de asignación
        </h3>
        <div class="row full-width wrap tw-justify-start justify-around">
          <div class="row full-width">

            <div class="col-12">
              <label class="q-px-md tw-text-label">Observaciones *
                <q-input type="textarea" outlined label="Inserte" dense emit-value v-model="form.observaciones"
                  :rules="[inputRequired, v => maxLengthInput(1000, v)]" />
              </label>
            </div>
          </div>
        </div>
        <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
          <q-btn class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]" no-caps
            style="border: 1px solid #2c3948" @click="cancelModal = true">Cancelar</q-btn>
          <q-btn class="tw-w-1/4 tw-h-11 bg-primary text-white" @click="confirmAsignar()">Asignar</q-btn>
        </div>
      </div>
    </q-form>
    <Modal v-model="confirmModal" title="Confirmación" persistent
      :text="`¿Está seguro de asignar el radicado ${textAlert}?`" :is-success="true" :cancelButton="true"
      @closeModal="confirmModal = false" textButtonCancel="No" text-button="Si" @handleAccept="confirmAsignar" />
    <Modal v-model="cancelModal" title="¡Espera un momento!" :is-success="false"
      @handleAccept="router.push('/correspondencia/')" cancel-button textButtonCancel="No" textButton="Si"
      text="Al cancelar la acción perderá los datos para la asignación ¿Desea realizar la acción?"
      @close-modal="cancelModal = false" type="button" />
    <Modal v-model="selectConsolidador" title="Seleccionar Consolidador" :is-success="false" @handleAccept=""
      textButtonCancel="No" textButton="Aceptar" text="Debe seleccionar un responsable de consolidar el documento"
      type="button" />
  </section>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch, defineAsyncComponent  } from "vue";
import { useRouter } from "vue-router";
import { inputRequired, maxLengthInput } from "src/helpers/validations";
import { toast } from "src/helpers/toast";
import { sgdeaAxios } from 'src/services';
import { useAuthStore } from "src/stores/auth.store";

const Modal = defineAsyncComponent(() => import('components/Modal/Modal.vue'));

const props = withDefaults(defineProps<{
  idCaso: any,
  idFlujo: any
}>(), {
})
const router = useRouter();
const { getUserInfo } = useAuthStore();
const userInfo = ref();
const cardsAsignar = ref([]);
const cardsAsignar2 = ref([]);
const form = ref({
  observaciones: '',
  usuarios: []
})
const listUsersOriginal = ref([])
const listUsersCopi = ref([])
const listUsersOriginal2 = ref([])
const listUsersCopi2 = ref([])
const formRef = ref()
const cancelModal = ref(false)
const confirmModal = ref(false)
const filterValue = ref('')
const filterValue2 = ref('')
const filteredRows = ref(listUsersOriginal.value)
const filteredRows2 = ref(listUsersOriginal2.value)
const opForUsers = ref()
const opForUsers2 = ref()
const searchHelpDataFiltered = ref([])
const searchHelpDataFiltered2 = ref([])
const searchHelpDataFiltered3 = ref([])
const selection = ref([])
const selection2 = ref([])
const selectOficina = ref('')
const selectConsolidador = ref(false)
const oficinas = ref([])
const opsConsolidador = ref([])
const consolidador = ref()
const opsCon = computed(() => cardsAsignar.value.map(it => { return { label: it.name, value: it.id } }))
const searchUsuariosList = ref({
  gestionador: '',
  asignador: ''
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
    label: "Grupo",
    field: "grupo",
    sortable: true,
    align: "center",
  }
];

const columnsAsignar2 = [
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
  },
];

onMounted(async () => {
  getAllRegisters()
});

const textAlert = computed(() => {
  return selection.value.length > 0 ? ' a ' + selection.value.length + ' gestionadores' : 'el asignador ' + selection2.value[0]?.colaborador;
});

const removeCardAsignar = (index, id) => {
  cardsAsignar.value.splice(index, 1);

  if (!form.value.usuarios) return;

  const indexToDeleteUser = form.value.usuarios.findIndex(item => item?.usuario === id);

  if (indexToDeleteUser !== -1) {
    const indexSelection = selection.value.findIndex(item => item.id == id);
    selection.value.splice(indexSelection, 1);
  }

  if (consolidador.value) {
    const findConsolidador = cardsAsignar.value.find(it => it.id) !== consolidador.value
    if (findConsolidador) {
      consolidador.value = null
    }
  }
};

const removeCardAsignar2 = (index) => {
  cardsAsignar2.value.splice(index, 1);
  selection2.value.splice(index, 1);
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

watch(filterValue2, (newValue) => {
  if (newValue) {
    filteredRows2.value = listUsersOriginal2.value.filter(row =>
      row.colaborador.toLowerCase().includes(newValue.toLowerCase())
    );
  } else {
    filteredRows2.value = listUsersOriginal2.value;
  }
});

watch(
  () => selection2.value,
  (value) => {
    if (value.length > 0) {
      if (selection.value.length > 0) {
        selection.value = []
        cardsAsignar.value = []
      }
      // @ts-ignore
      if (value.some(it => it.colaborador === searchUsuariosList.value.asignador?.label)) {
        searchUsuariosList.value.asignador = ''
      }
    }
  }
);

watch(
  () => searchUsuariosList.value.gestionador,
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
  () => searchUsuariosList.value.asignador,
  (newValue) => {
    // @ts-ignore
    if (newValue && newValue.value) {
      // @ts-ignore
      const user = listUsersOriginal2.value.find(it => it.id === newValue.value);
      if (user) {
        listUsersOriginal2.value = listUsersOriginal2.value.filter(it => it.id === user.id)
      }
    }
    else {
      listUsersOriginal2.value = listUsersCopi2.value
    }
  }
);

watch(
  () => selection.value,
  (value) => {
    if (value.length > 0) {
      if (selection2.value.length > 0) {
        form.value.usuarios = []
        selection2.value = []
        cardsAsignar2.value = []
      }
      // @ts-ignore
      if (value.some(it => it.colaborador === searchUsuariosList.value.gestionador?.label)) {
        searchUsuariosList.value.gestionador = ''
      }

      if (value.length > 1 && consolidador.value == null) {
        selectConsolidador.value = true
      }

      if (consolidador.value) {
        const findConsolidador = value.find(it => it.id) !== consolidador.value
        if (findConsolidador) {
          consolidador.value = null
        }
      }
    }
  }
);


watch(
  () => selectOficina.value,
  async (newValue, oldValue) => {
    if (newValue !== oldValue) {
      searchUsuariosList.value.asignador = ''
      listUsersOriginal2.value = []
      const { data } = await sgdeaAxios.get(`/api/usuarios/rolYoficina?rolName=Asignador Responsable${newValue.value ? '&oficinaId=' + newValue.value : ''}`);

      listUsersOriginal2.value = data.filter((item) => item.id !== userInfo.value.userid).map((item) => ({
        colaborador: item.firstname + ' ' + item.lastname,
        enabled: item.enabled,
        id: item.id,
        user: item.userName,
        cargo: item.cargo,
        grupo: newValue.label
      })).sort((a, b) => a.colaborador.localeCompare(b.colaborador))
    }
  }
);

async function getAllRegisters() {
  try {
    userInfo.value = await getUserInfo();
    const { data: oficinasAll } = await sgdeaAxios.get('oficinas/all');

    oficinas.value = oficinasAll.map((item) => ({
      label: item.nombre,
      value: item.id,
    })).sort((a, b) => a.label.localeCompare(b.label))

    const oficinaUser = await oficinasAll.find(it => it.nombre === userInfo.value.relations[0].oficina);
    let gestionadores
    let asignadores

    if (oficinaUser) {

      gestionadores = await sgdeaAxios.get(`/api/usuarios/rolYoficina?rolName=Gestionador${oficinaUser?.id ? '&oficinaId=' + oficinaUser?.id : ''}`);

      asignadores = await sgdeaAxios.get(`/api/usuarios/rolYoficina?rolName=Asignador Responsable${userInfo.value?.relations[0].oficinaId ? '&oficinaId=' + userInfo.value?.relations[0].oficinaId : ''}`);
    } else {
      const dependenciaUser = userInfo.value.dependencia

      gestionadores = await sgdeaAxios.get(`/api/usuarios/rolesYSeccionSubseccion/${dependenciaUser}?rolNames=Gestionador`);

      asignadores = await sgdeaAxios.get(`/api/usuarios/rolesYSeccionSubseccion/${dependenciaUser}?rolNames=Asignador Responsable`);

    }


    listUsersOriginal.value = gestionadores.data.map((item) => ({
      colaborador: item.firstname + ' ' + item.lastname,
      enabled: item.enabled,
      id: item.id,
      user: item.userName,
      cargo: 'Gestionador',
      grupo: oficinaUser?.nombre || item.usuarioRelaciones[0]?.oficina?.nombre
    })).sort((a, b) => a.colaborador.localeCompare(b.colaborador))
    listUsersCopi.value = listUsersOriginal.value
    opForUsers.value = listUsersOriginal.value.map((row) => { return { label: row.colaborador, value: row.id } })

    listUsersOriginal2.value = asignadores.data.filter((item) => item.id !== userInfo.value.userid).map((item) => ({
      colaborador: item.firstname + ' ' + item.lastname,
      enabled: item.enabled,
      id: item.id,
      user: item.userName,
      cargo: 'Asignador',
      grupo: item.usuarioRelaciones[0]?.oficina?.nombre
    })).sort((a, b) => a.colaborador.localeCompare(b.colaborador))
    listUsersCopi2.value = listUsersOriginal2.value
    opForUsers2.value = listUsersOriginal2.value.map((row) => { return { label: row.colaborador, value: row.id } })
  } catch (error) {
    console.error(error);
  }
}

const confirmAsignar = async () => {
  if (await formRef.value.validate()) {
    try {
      if (cardsAsignar.value.length === 0 && cardsAsignar2.value.length === 0) {
        toast.error('Debe seleccionar un usuario para completar la acción');
        return;
      }

      //const id = props?.detailsRadicado.id
      let response;
      if (selection.value.length > 0) {
        const users = form.value.usuarios.filter(user => selection.value.some(it => it.id === user.usuario))
        opsConsolidador.value = users

        response = await sgdeaAxios.post(`/asignarDev/asignarUsuarioDevolucion`, {
          "usuarioAsignado": selection.value[0].user,
          "usuarioSesion": userInfo.value.username,
          "motivo": form.value.observaciones,
          "idCaso": props.idCaso,
          "idFlujo": props.idFlujo
        })
      } else if (selection2.value.length > 0) {
        response = await sgdeaAxios.post(`/asignarDev/asignarUsuarioDevolucion`, {
          "usuarioAsignado": selection2.value[0].user,
          "usuarioSesion": userInfo.value.username,
          "motivo": form.value.observaciones,
          "idCaso": props.idCaso,
          "idFlujo": props.idFlujo
        })
      }

      if (response.status === 200) {
        toast.success('El gestionador ha sido asignado con éxito')
        form.value.observaciones = ''
        form.value.usuarios = []
        cardsAsignar.value = []
        cardsAsignar2.value = []
        selection.value = []
        selection2.value = []
        confirmModal.value = false
        router.push('/envios-seguimientos/correos')
      }
    } catch (error) {
      toast.error('Ha ocurrido un error al realizar la asignación');
      confirmModal.value = false
    }
  } else {
    toast.error('Debe diligenciar los campos obligatorios para continuar con el proceso')
  }
}

const selectOptionsFilterFn = (val: string, update: any) => {
  update(() => {
    if (val === '') {
      searchHelpDataFiltered.value = listUsersOriginal.value.map(({ colaborador, id }) => ({ label: colaborador, value: id })).sort((a, b) => a.label.localeCompare(b.label));
    } else {
      const needle = val.toLowerCase();
      searchHelpDataFiltered.value = opForUsers.value.filter(({ label }) => label.toLowerCase().includes(needle));
    }
  });
}

const selectOptionsFilterFn2 = (val: string, update: any) => {
  update(() => {
    if (val === '') {
      searchHelpDataFiltered2.value = listUsersOriginal2.value.map(({ colaborador, id }) => ({ label: colaborador, value: id })).sort((a, b) => a.label.localeCompare(b.label));
    } else {
      const needle = val.toLowerCase();
      searchHelpDataFiltered2.value = opForUsers2.value.filter(({ label }) => label.toLowerCase().includes(needle));
    }
  });
}

const filterCon = (val, update) => {
  update(() => {
    if (val === '') {
      searchHelpDataFiltered3.value = cardsAsignar.value.map(({ name, id }) => { return { label: name, value: id } }).sort((a, b) => a.label.localeCompare(b.label));
    } else {
      const needle = val.toLowerCase()

      searchHelpDataFiltered3.value = opsCon.value.filter(({ label }) => label.toLowerCase().includes(needle));
    }
  })
}


const handleAssign = (array: any[]) => {
  cardsAsignar.value = array.map((item) => ({
    name: item.colaborador,
    id: item.id,
    visible: true,
    user: item.user
  }));
  const optionExists = cardsAsignar.value.some(it => it.id === consolidador.value);

  if (!optionExists) {
    consolidador.value = null;
  }
};

const handleAssign2 = (array: any[]) => {
  cardsAsignar2.value = array.map((item) => ({
    name: item.colaborador,
    id: item.id,
    visible: true,
    user: item.user
  }));
};

const dblclickGestores = (_, row) => {
  if (row) {
    const user = listUsersOriginal.value.find(it => it.id === row.id);
    if (user && !cardsAsignar.value.find(it => it.id === user.id)) {
      cardsAsignar.value[0] = ({
        id: user.id,
        name: user.colaborador,
        visible: true,
        user: user.user
      })
      selection.value = [user]
    }
  }
}

const dblclickAsignadores = (_, row) => {
  if (row) {
    const user = listUsersOriginal2.value.find(it => it.id === row.id);
    if (user) {
      cardsAsignar2.value = [{
        id: user.id,
        name: user.colaborador,
        visible: true,
        user: user.user
      }];
      selection2.value = [user];
    }
  }
}

const rowGestor = ref()
const dragGestor = (row) => {
  rowGestor.value = row
}

const dropGestor = () => {
  const user = listUsersOriginal.value.find(it => it.id === rowGestor.value.id);
  if (user && !cardsAsignar.value.find(it => it.id === user.id)) {
    cardsAsignar.value[0] = ({
      id: user.id,
      name: user.colaborador,
      visible: true,
      user: user.user
    })
    selection.value = [user]
  }
}

const rowAsignar = ref()
const dragAsignar = (row) => {
  rowAsignar.value = row
}
const dropAsignar = () => {
  const user = listUsersOriginal2.value.find(it => it.id === rowAsignar.value.id);
  if (user) {
    cardsAsignar2.value = [{
      id: user.id,
      name: user.colaborador,
      visible: true,
      user: user.user
    }];
    selection2.value = [user];
  }
}

const addValue = (value, type) => {
  searchUsuariosList.value[type] = value
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
