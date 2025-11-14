<template>
  <section>
    <div class="tw-bg-white q-mt-lg tw-rounded-md">
      <h3 class="text-bold tw-text-xl q-py-md tw-flex-1 q-px-md">
        Enviar a Revisión
      </h3>
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
                  Seleccionar el Usuario {{ props.type === 'Aprobación' ? 'Aprobador' : 'Revisor' }}
                </span>
              <div class="row tw-justify-center tw-w-full">
                <span class="tw-text-base tw-font-bold tw-mt-3 tw-w-full">Filtrar por Usuario</span>
                <q-select :options="searchHelpDataFiltered" fill-input hide-selected
                          use-input v-model="searchUsuariosList" @filter="selectOptionsFilterFn" class="tw-w-full " outlined dense
                          placeholder="Buscar"  @input-value="addValue" >
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
              Este es el usuario revisor que ha seleccionado
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
    <div class="tw-bg-white q-mt-lg tw-rounded-md">
      <h3 class="text-bold tw-text-xl q-py-md tw-flex-1 q-px-md">
        Enviar a Aprobación
      </h3>
      <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex tw-flex-row">
        <div class="width-container tw-w-1/2 q-px-sm tw-rounded-xl overflow-hidden" style="border: 1px solid #E3E4E5;">
          <q-table flat :rows="listUsersAprobador" @update:selected="handleAssignAprobador" :columns="columnsAsignar2" row-key="id"
                   table-header-class="text-black text-h6 " class="sizes q-mr-md tableclass"
                   style="margin: 0 auto; border-radius: 15px; min-height: auto; max-height: 400px; overflow: hidden;" :filter="filterValue"
                   rows-per-page-label="Páginas" selection="single" v-model:selected="selectionAprobador" virtual-scroll
                   :rows-per-page-options="[8]" color="primary" clearSelection @row-dblclick="dblclickReasignarAprobador" >
            <template v-slot:body-cell-colaborador="props" :draggable="true" auto-width >
              <td  class="tw-text-center" :draggable="true" @dragstart="dragAsignarAprobador(props.row)">
                {{ props.row.colaborador }}
              </td>
            </template>
            <template v-slot:top>
                <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
                  Seleccionar el Usuario Aprobador
                </span>
              <div class="row tw-justify-center tw-w-full">
                <span class="tw-text-base tw-font-bold tw-mt-3 tw-w-full">Filtrar por Usuario</span>
                <q-select :options="searchHelpDataFilteredAprobador" fill-input hide-selected
                          use-input v-model="searchUsuariosListAprobador" @filter="selectOptionsFilterFnAprobadores" class="tw-w-full " outlined dense
                          placeholder="Buscar"  @input-value="addValueAprobador" >
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
        <div class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl" style="border: 1px solid #e3e4e5" @dragover.prevent @drop="dropAsignarAprobador()">
            <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
              Este es el usuario aprobador que ha seleccionado
            </span>
          <div class="flex wrap tw-gap-3 q-pt-sm">
            <div v-for="(asign, index) in cardsAsignarAprobador" :key="index">
              <div v-if="asign.visible"
                   class="q-px-sm tw-text-base q-py-sm tw-gap-2 flex justify-between tw-text-[#2C3948] tw-rounded-3xl"
                   style="border: 1px solid #e3e4e5">
                <q-icon size="24px" name="person_outline" />
                {{ asign.name }}
                <q-icon class="tw-cursor-pointer" size="24px" name="close" @click="removeCardAsignarAprobador(index)" />
              </div>
            </div>
            <div v-if="cardsAsignarAprobador.length === 0" class="tw-text-red-500 text-weight-bold">
              Debe seleccionar al menos un usuario
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="tw-bg-white q-mt-lg" style="border-radius: 5px" >
      <q-form ref="formRef" >
        <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
          <q-btn class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]" no-caps
            style="border: 1px solid #2c3948" @click="cancelModal = true" label="Cancelar" />
          <q-btn class="tw-w-1/4 tw-h-11 bg-primary text-white" @click="confirmAsignar" label="Enviar" />
        </div>
      </q-form>
    </div>
    <!-- <Modal v-model="confirmModal" title="Confirmación" persistent
      :text="`¿Está seguro de asignar el radicado ${detailsAsignaciones?.radicacion?.idRadicado || props.detailsAsignaciones?.idRadicado} al usuario ${cardsAsignar[0]?.name}?`"
      :is-success="true" :cancelButton="true" @closeModal="confirmModal = false" textButtonCancel="No" text-button="Si"
      @handleAccept="confirmAsignar" /> -->
    <Modal v-model="cancelModal" title="Confirmación" :is-success="false"
      @handleAccept="$emit('backView')" cancel-button textButtonCancel="No" textButton="Si"
      text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
      @close-modal="cancelModal = false" type="button" />
    <LoadingModal v-if="loadingModal" :total="100" @load-complete="loadingModal = false"
      title="Realizando proceso" subtitle="Espere un momento por favor"/>
  </section>
</template>

<script lang="ts" setup>

import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import Modal from 'components/Modal/Modal.vue';
import LoadingModal from 'src/components/Modal/LoadingModal.vue';
import { columnsAsignar2 } from "..";

import { inputRequired, maxLengthInput, minLengthInput } from "src/helpers/validations";
import { toast } from "src/helpers/toast";
import { crearTrazabilidad } from 'src/helpers/trazabilidad';
import { useAuthStore } from "src/stores/auth.store";
import { sgdeaAxios } from 'src/services';
import { crearTrazabilidadDocumento } from "src/helpers/trazabilidadDocumento";

const props = withDefaults(defineProps<{
  isMetadatos: boolean,
  detailsAsignaciones: any,
  // detailsRadicado: any
  changeDocument: boolean
  documento: any,
  userName: string,
  userRol: string,
}>(), {
})

const route = useRoute();
const router = useRouter();
const loadingModal = ref(false);
const cardsAsignar = ref([]);
const cardsAsignarAprobador = ref([]);
const listUsersOriginal = ref([])
const listUsersAprobador = ref([])
const listUsersCopi = ref([])
const listUsersCopiAprobador = ref([])
const { getUserInfo } = useAuthStore();
const userInfo = ref();
const formRef = ref()
const cancelModal = ref(false)
const confirmModal = ref(false)
const filterValue = ref('')
const filteredRows = ref(listUsersOriginal.value)
const filteredRowsAprobador = ref(listUsersAprobador.value)
const searchHelpDataFiltered = ref([])
const searchHelpDataFilteredAprobador = ref([])
const opForConsolidador = ref()
const opForConsolidadorAprobador = ref()
const selection = ref([])
const selectionAprobador = ref([])
const selectOficina = ref('')
const oficinas = ref([])
const form = ref({
  observaciones: '',
  usuarios: [],
})
const searchUsuariosList = ref()
const searchUsuariosListAprobador = ref()

const emit = defineEmits(['backView'])

onMounted(async () => {
  getAllRegisters()
});

const removeCardAsignar = (index) => {
  cardsAsignar.value.splice(index, 1);
  selection.value.splice(index, 1);
};

const removeCardAsignarAprobador = (index) => {
  cardsAsignarAprobador.value.splice(index, 1);
  selectionAprobador.value.splice(index, 1);
};

watch(filterValue, (newValue) => {
  if (newValue) {
    filteredRows.value = listUsersOriginal.value.filter(row =>
      row.colaborador.toLowerCase().includes(newValue.toLowerCase())
    );
    filteredRowsAprobador.value = listUsersAprobador.value.filter(row =>
      row.colaborador.toLowerCase().includes(newValue.toLowerCase())
    );
  } else {
    filteredRows.value = listUsersOriginal.value;
    filteredRowsAprobador.value = listUsersAprobador.value;
  }
});

watch(
    () => searchUsuariosList.value,
    (value) => {
      // @ts-ignore
      if (value && value.value) {
        // @ts-ignore
        const user = listUsersOriginal.value.find(it => it.id === value.value)
        const userAprobador = listUsersAprobador.value.find(it => it.id === value.value)
        if (user) {
          listUsersOriginal.value = listUsersOriginal.value.filter(it => it.id === user.id)
        }
        if (userAprobador) {
          listUsersAprobador.value = listUsersAprobador.value.filter(it => it.id === userAprobador.id)
        }
      } else {
        listUsersOriginal.value = listUsersCopi.value
        listUsersAprobador.value = listUsersCopiAprobador.value
      }
    }
);

watch(
    () => searchUsuariosListAprobador.value,
    (value) => {
      // @ts-ignore
      if (value && value.value) {
        // @ts-ignore
        const userAprobador = listUsersAprobador.value.find(it => it.id === value.value)
        if (userAprobador) {
          listUsersAprobador.value = listUsersAprobador.value.filter(it => it.id === userAprobador.id)
        }
      } else {
        listUsersAprobador.value = listUsersCopiAprobador.value
      }
    }
);

watch(
    () => selection.value,
    (value) => {
      // @ts-ignore
      // if (value.some(it => it.colaborador === searchUsuariosList.value?.label)) {
        searchUsuariosList.value = ''
      // }
    }
);

watch(
    () => selectionAprobador.value,
    (value) => {
        searchUsuariosListAprobador.value = ''
    }
);

// watch(
//     () => selectOficina.value,
//     async(newValue, oldValue) => {
//       if (newValue !== oldValue) {
//         searchUsuariosList.value = ''
//         listUsersOriginal.value = []
//         listUsersAprobador.value = []
//         // @ts-ignore
//         const { data: revisores } = await sgdeaAxios.get(`/api/usuarios/rolYoficina?rolName=Aprobador${ newValue.value ? '&oficinaId='+newValue.value : '' }`);
//         listUsersOriginal.value = revisores.map((item) => ({
//           colaborador: item.firstname + ' ' + item.lastname,
//           enabled: item.enabled,
//           id: item.id,
//           user: item.userName,
//           cargo: item.cargo,
//           grupo: newValue?.label
//         })).sort((a, b) => a.colaborador.localeCompare(b.colaborador))
//       }
//     }
// );

async function getAllRegisters() {
  try {
    userInfo.value = await getUserInfo();
    const { data: oficinasAll } = await sgdeaAxios.get('oficinas/all');
    let revisores
    let aprobadores
    const oficinaUser = oficinasAll.find(it => it.nombre === userInfo.value?.relations[0].oficina);

    if(oficinaUser){
      aprobadores = await sgdeaAxios.get(`/api/usuarios/rolYoficina?rolName=Aprobador${ oficinaUser?.id ? '&oficinaId='+oficinaUser?.id : '' }`);
      revisores  = await sgdeaAxios.get(`/api/usuarios/rolYoficina?rolName=Revisor${ oficinaUser?.id ? '&oficinaId='+oficinaUser?.id : '' }`);
    } else {
      const dependenciaUser = userInfo.value.dependencia
      aprobadores = await sgdeaAxios.get(`/api/usuarios/rolesYSeccionSubseccion/${dependenciaUser}?rolNames=Aprobador`);
      revisores  = await sgdeaAxios.get(`/api/usuarios/rolesYSeccionSubseccion/${dependenciaUser}?rolNames=Revisor`);
    }



    listUsersOriginal.value = revisores.data.map((item) => ({
      colaborador: item.firstname + ' ' + item.lastname,
      enabled: item.enabled,
      id: item.id,
      user: item.userName,
      cargo: 'Revisor',
      grupo: oficinaUser?.nombre || item.usuarioRelaciones[0]?.oficina?.nombre,
    })).sort((a, b) => a.colaborador.localeCompare(b.colaborador))

    listUsersAprobador.value = aprobadores.data.map((item) => ({
      colaborador: item.firstname + ' ' + item.lastname,
      enabled: item.enabled,
      id: item.id,
      user: item.userName,
      cargo: 'Aprobador',
      grupo: oficinaUser?.nombre || item.usuarioRelaciones[0]?.oficina?.nombre,
    })).sort((a, b) => a.colaborador.localeCompare(b.colaborador))

    opForConsolidador.value = listUsersOriginal.value.map((row) => { return { label: row.colaborador, value: row.id } }).sort((a, b) => a.label.localeCompare(b.label))
    opForConsolidadorAprobador.value = listUsersOriginal.value.map((row) => { return { label: row.colaborador, value: row.id } }).sort((a, b) => a.label.localeCompare(b.label))

    listUsersCopi.value = listUsersOriginal.value
    listUsersCopiAprobador.value = listUsersAprobador.value
  } catch (error) {
    console.error(error)
  }
}

const confirmAsignar = async () => {
  try {
    if (!(await formRef.value.validate())) {
      toast.error('Debe diligenciar los campos obligatorios')
      return;
    }
    const radicado = props.detailsAsignaciones.radicacion || props.detailsAsignaciones

    //|| (props.type=='Revisión' && !cardsAsignarAprobador.value.length)
    if (cardsAsignar.value.length === 0 || cardsAsignarAprobador.value.length === 0) {
      toast.error('Debe seleccionar un usuario aprobador y revisor para completar la acción');
      return;
    }

    // valida docs Salida
    const { data: docSalida } = await sgdeaAxios.get(`/correspondencia/BuscarDocumentoSalida?correspondenciaId=${props.detailsAsignaciones.id}`)
    if (radicado.datosSalida === null || !docSalida.html_content) {
      toast.error(`Ingrese los datos y documento de salida para envíar`)
      return;
    }

    const { data: isExpediente } = await sgdeaAxios.post(`/correspondencia/${route.params.id}/expediente`)

    if (!isExpediente) {
      toast.error('Debe incluir el radicado a un expediente')
      return;
    }

    if (props.isMetadatos) {
      try {
        await sgdeaAxios.get(`/meta-datos/${props.detailsAsignaciones.idRadicado}`);
      } catch (error) {
        toast.error('No se han llenado los metadatos')
        return;
      }
    }

    const id = props?.detailsAsignaciones.radicacion?.id || props.detailsAsignaciones?.id
    const tipo = (props.detailsAsignaciones.radicacion?.idRadicado || props.detailsAsignaciones?.idRadicado).includes('INT') ? 'COMUNICACION' : 'CORRESPONDENCIA'

    // Activar modal loader
    loadingModal.value = true;

    const responseAprobador = await sgdeaAxios.post(`/correspondencia/asignarAprobacion/${id}`,{
      // observaciones: form.value.observaciones,
      usuario: cardsAsignarAprobador.value[0]?.id,
      asignador: userInfo.value.userid
    })

    const responseRevisor = await sgdeaAxios.post(`/correspondencia/crearRevision/${id}`,{
      tipo,
      revisor: cardsAsignar.value[0]?.id,
      observacionesRevision: form.value.observaciones
    })

    if (responseRevisor.status === 200 && responseAprobador.status === 200) {
      await crearTrazabilidad({
        proceso: `COR${id}`,
        secuencia: radicado.idRadicado,
        estado: "Por revisar",
        descripcion: `Usuario: ${userInfo.value.name} - Aprobador: ${cardsAsignarAprobador.value[0]?.name} ${userInfo.value.role} Revisor: ${cardsAsignar.value[0]?.name }`,
        comentario: 'Revision',
        nombre: userInfo.value.name,
        tramite: radicado.tipoTramite.nombre,
        accion: `El trámite se ha enviado a aprobar y revisar`
      });
      if (props.changeDocument) {
        await crearTrazabilidad({
            proceso: `COR${id}`,
            secuencia:  radicado.idRadicado,
            estado: radicado.estadoProceso.estado,
            descripcion: `Se ha modificado el documento de salida`,
            comentario: "Modificación",
            nombre: userInfo.value.name,
            tramite: radicado.tipoTramite.nombre,
            accion: `${userInfo.value.name}  ha modificado el documento de salida del caso  ${radicado.idRadicado}`,
          });
          await crearTrazabilidadDocumento({
            htmlContent: props.documento.html_content,
            usuario: props.userName,
            rol: props.userRol,
          }, props.documento.id, 'ENC')
      }

      form.value = {
        observaciones: '',
        usuarios: []
      }
      cardsAsignar.value = []
      cardsAsignarAprobador.value = []
      selectionAprobador.value = []
      selection.value = []
      confirmModal.value = false
      toast.success('El radicado ha sido enviado para revisión con éxito')
      router.push('/bandeja')
    }
  } catch (error) {
    toast.error('Ha ocurrido un error al momento de hacer la asignación')
    confirmModal.value = false
  } finally {
    // Desactivar modal loader
    loadingModal.value = false;
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

const selectOptionsFilterFnAprobadores = (val: string, update: any) => {
  update(() => {
        if (val === '') {
          searchHelpDataFilteredAprobador.value = listUsersAprobador.value.map(({ colaborador, id }) => ({ label: colaborador, value: id })).sort((a, b) => a.label.localeCompare(b.label));
        } else {
            const needle = val.toLowerCase();
            searchHelpDataFilteredAprobador.value = opForConsolidadorAprobador.value.filter(({ label }) => label.toLowerCase().includes(needle));
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

const handleAssignAprobador = (array: any[]) => {
  cardsAsignarAprobador.value = array.map((item) => ({
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

const dblclickReasignarAprobador = (_, row) => {
  if (row) {
    const user = listUsersAprobador.value.find(it => it.id === row.id);
    if (user) {
      selectionAprobador.value = [user];
    }
  }
}

const rowAsignar = ref()
const rowAsignarAprobador = ref()

const dragAsignar = (row) => {
  rowAsignar.value = row
}

const dragAsignarAprobador = (row) => {
  rowAsignarAprobador.value = row
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

const dropAsignarAprobador = () => {
  const user = listUsersAprobador.value.find(it => it.id === rowAsignarAprobador.value.id);
  if (user) {
    cardsAsignarAprobador.value = [{
        id: user.id,
        name: user.colaborador,
        visible: true,
        user: user.user
    }];
    selectionAprobador.value = [user];
  }
}

const addValue = (value) => {
  searchUsuariosList.value = value
}

const addValueAprobador = (value) => {
  searchUsuariosListAprobador.value = value
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
