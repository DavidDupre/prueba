<template>
  <section>
    <q-form ref="form">

    <div class="tw-bg-white q-mt-lg tw-rounded-md">
        <h3 class="text-bold tw-text-xl q-py-md tw-flex-1 q-px-md">
          Asignación de Aprobador
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
              title="Seleccione el usuario que desea asignar para aprobación"
              update:dragEvent="dragGestor"
              @update:handleDblClickEvent="handleDoubleClickEvent"

            />
          </div>
          <div class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl" style="border: 1px solid #e3e4e5"  @dragover.prevent @drop="dropGestor()">
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
            </div>
          </div>
        </div>
      </div>

    <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">

      <div class="row full-width wrap tw-justify-start justify-around">

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
            class="tw-w-1/4 tw-h-11 bg-primary text-white"
            label="Asignar aprobador"
            :disabled="cardsAsignar.length === 0 || disableEnvioAprobacion"
            @click="handleForm"
          />
        </div>
      </div>
    </q-form>

    <Modal v-model="showModalAsignacion" title="Confirmación" persistent
      :text="`¿Está seguro de asignar para aprobación el documento de salida del radicado ${detailsTutela.idRadicado} al abogado ${cardsAsignar[0]?.name}, de la Oficina ${cardsAsignar[0]?.grupo}?`"
      :cancelButton="true" @closeModal="showModalAsignacion = false" textButtonCancel="No"
      text-button="Si" @handleAccept="assignTutela" />
  </section>
</template>

<script lang="ts" setup>
import { QForm } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { Ref, onMounted, ref, watch, onBeforeMount } from "vue";
import { crearTrazabilidad } from 'src/helpers/trazabilidad';
import TableAsignar from "components/Tables/TableAsignar.vue";
import Modal from 'components/Modal/Modal.vue';
import { useAuthStore } from "src/stores/auth.store";
import { useStateStore } from "src/stores/status.store";
import { columnsAsignar } from "..";

import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";

const props = withDefaults(defineProps<{
  detailsTutela: any
}>(), {
})

const router = useRouter();
const route = useRoute();
const cardsAsignar = ref([]);
const observaciones = ref(null)
const listUsers = ref([])
const showModalAsignacion = ref(false);
const status = ref("");
const form: Ref<QForm | null> = ref(null);
const auth = useAuthStore()
const emit = defineEmits(['handleCancel'])
const opOfi = ref()
const disableEnvioAprobacion = ref(false)
const opOficinas = ref()
const filterValue = ref()

const headers = {
  "Access-Control-Allow-Origin": "*",
  accept: "application/json",
  "Content-Type": "application/json",
};

onBeforeMount(async () => await getAllRegisters('GRUPO TUTELAS'));

onMounted(async () => {
  if(props.detailsTutela.usuarioEscalados?.length && props.detailsTutela.usuarioEscalados.some((item) => item.estado == 'Escalamiento Rechazado')){
    toast.error('No puede envíar a aprobación ya que el radicado se encuentra escalado y al menos uno de los escalamientos se encuentra con estado: “Escalamiento rechazado')
    disableEnvioAprobacion.value = true
  }
  const  dataOfi  = (await sgdeaAxios.get("/oficinas/all"));
    opOficinas.value = dataOfi.data?.map((item: any) => ({
        label: item.nombre,
        value: item.id,
        dependencia: item.dependencia
    }));
    opOfi.value = opOficinas.value
});
const rowGestor = ref()
// onBeforeMount(async () => await );
const dragGestor = (row: any) => {
  rowGestor.value = row
}

const dropGestor = () => {
  const user = listUsers.value.find(element => element.id === rowGestor.value.id);
  const isCardsAsignarEmpty = !cardsAsignar.value.find(element => element.user === user.id)
  if (user && isCardsAsignarEmpty) {
    cardsAsignar.value.push({
      user: user.id,
      name: user.colaborador,
      visible: true,
    })
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

const removeCardAsignar = (index) => {
  cardsAsignar.value.splice(index, 1);
};

async function getAllRegisters(grupo?) {
  // const { data } = await sgdeaAxios.get(
  //   `/roles/usuarios?rol=Aprobador`
  // );
  const { data } = await sgdeaAxios.get(`/api/usuarios/rolYoficinaNombre?rolName=Aprobador&oficinaName=${grupo}`);

  listUsers.value = data.map((item) => ({
    colaborador: item.firstname + ' ' + item.lastname,
    cargo: 'Aprobador',
    id: item.id,
    user: item.userName,
    grupo: 'GRUPO TUTELAS'
  }))
}

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

const handleForm = async () => {
  if(await form.value.validate()) {
    if(!cardsAsignar.value.length) {
      toast.error('Debe seleccionar un usuario para continuar con la asignación')
    } else {
      showModalAsignacion.value = true
    }
  }
}

const assignTutela = async () => {
  try {
    const { data: docSalida } = await sgdeaAxios.get(`/tutela/${props.detailsTutela.idTutela}/documento_salida`)

    if (!props.detailsTutela?.radicadoSalida || docSalida == '') {
      toast.error('Ingrese los datos y documento de salida para envíar a aprobación')
      return;
    }

    const { data: expediente } = await sgdeaAxios.get("/expediente/children", {
      params: { nodeId: props.detailsTutela.nodeId },
    });

    if (!expediente) {
      toast.error('Debe incluir el radicado a un expediente')
      return;
    }

    const id = props?.detailsTutela.idTutela
    const response = await sgdeaAxios.post(`/tutela/${id}/task/asignarUsuario`, {
      usuario: cardsAsignar.value[0]?.user,
      motivo: "Motivo"
    })

    if (response.status === 200) {
      const id = route.params.id
      const { data } = await sgdeaAxios.get(`/tutela/info/${id}`)
      await crearTrazabilidad({
        proceso: `TUT${data.idTutela}`,
        secuencia: data.idRadicado,
        estado: data.estado,
        descripcion: `Usuario: ${auth.$state.userInfo.name} \n` +
              `Descripción: Se asignó el documento de salida para aprobación`,
        comentario: 'Asignado',
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} asignó el documento de salida para aprobación`,
        tramite: 'Tutela',
      })
      cardsAsignar.value = []
      toast.success('El caso ha sido asignado para aprobar con éxito')
      showModalAsignacion.value = false
      router.push('/bandeja');
    }
  } catch (error) {
    toast.error('Ha ocurrido un error al momento de hacer la asignación')
    showModalAsignacion.value = false
    console.error(error);
  }
}

watch(() => filterValue.value, (newOffice) => {
  // @ts-ignore
  getAllRegisters(newOffice.label);
});

// const assignTutela = async () => {
//   try {
//     const id = props?.detailsTutela.idTutela
//     const response = await sgdeaAxios.post(`/tutela/${id}/task/asignarUsuario`, {
//       usuario: cardsAsignar.value[0]?.name,
//       motivo: observaciones.value
//     })
//     if (response.status === 200) {
//       showModalAsignacion.value = false
//       toast.success('El caso ha sido asignado para aprobar con éxito')
//     }
//   } catch (error) {
//     showModalAsignacion.value = false
//     toast.error('Ha ocurrido un error al momento de hacer la asignación')
//   }
// }
</script>
