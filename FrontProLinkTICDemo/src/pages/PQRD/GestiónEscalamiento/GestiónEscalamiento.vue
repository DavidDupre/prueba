<template>
  <q-form>
    <section>
      <q-card class="tw-p-6 q-mt-md">
        <div class="q-mt-sm">
          <div class="row tw-justify-between">
            <p class="tw-text-lg text-weight-bold q-mx-lg">
              Listado de respuestas de escalamiento
            </p>
          </div>
          <Table v-if="showInfo == false" :TABLE_BODY="listGestion" @handleEditData="sendEscalamiento" :TABLE_HEADER="HEADER_GESTION_ESCALAMIENTO" icon="download" isSecondIcon
            secondIcon="print" :loading="loading" is-selection="none" :key-id="'id'" />
          <InfoGestion @anulado="emit('nowAnulado')" v-if="showInfo == true" :detallePqrd="props.pqrData" :infogestion="InfoGes" :TABLE_BODY="listGestion" @handleEditData="sendEscalamiento" @back="back" :TABLE_HEADER="HEADER_GESTION_ESCALAMIENTO" icon="download" isSecondIcon
            secondIcon="print" :loading="loading" is-selection="none" :key-id="'id'" @back-view="emit('backView')" />
        </div>
        <!-- <DocumentosRelacionados :list-docs="listDocs" :download="download" /> -->
      </q-card>
    </section>

    <Modal v-model="deleteDocModal" title="Confirmación" text="¿Está seguro de que desea eliminar el documento?"
      :is-success="false" cancel-button text-button-cancel="No" text-button="Si" @handleAccept="eliminarDoc" />
  </q-form>
</template>

<script lang="ts" setup>
//@ts-ignore
import { HEADER_GESTION_ESCALAMIENTO } from ".";
import { ref, onMounted } from 'vue'
import Table from "./Table.vue";
import Modal from "../../../components/Modal/Modal.vue";
import { sgdeaAxios } from "../../../services";
import { useAuthStore } from "../../../stores/auth.store";
import { useRouter } from "vue-router";
import InfoGestion from "./InfoGestion.vue";
import moment from "moment";


const auth = useAuthStore()

const deleteDocModal = ref(false)
const showInfo = ref(false)
const InfoGes = ref()
const listGestion = ref([])
const infoGestionSelected = ref()
const loading = ref(true)
const tableDoc = ref()
const props = withDefaults(defineProps<{
  pqrData: any,
}>(), {
})

const emit = defineEmits(['nowAnulado', 'backView'])
onMounted(async () => {
  getGestion()
})

const getGestion = async () => {
  loading.value = true
  listGestion.value = []
  if (props?.pqrData?.id) {
    try {
      const responde = await sgdeaAxios.get(`/pqrd/escalamientos/escalador/{escaladorId}?escaladorId=${auth.$state.userInfo.userid}&pqrdID=${props.pqrData.id}`);
      listGestion.value = responde.data.map((item) => {
        return {
          nombre: (item.usuario.firstname + " " + item.usuario.lastname).toUpperCase(),
          oficina: item.usuario.usuarioRelaciones[0].oficina?.nombre,
          fechaH: moment(item.fechaEscalamiento).format('DD/MM/YYYY HH:mm'),
          estado: getEscalamientoEstado(item),
          id: item.id,
          MotivoEscalamiento: item.motivoEscalamiento,
          allInfo: item
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  function getEscalamientoEstado(escalamiento){
    if(escalamiento.anulado) return 'Escalamiento Anulado'
    if(escalamiento.aprobado && !escalamiento.send) return 'Gestion de Escalamiento'
    if(escalamiento.rechazado) return 'Escalamiento rechazado '
    if(escalamiento.aprobado && escalamiento.send) return 'Respuesta Escalamiento'
    return 'Gestion de Escalamiento'
  }

  setTimeout(() => {
    loading.value = false
  }, 500);
  if(tableDoc.value){
    tableDoc.value.cleanSelect();
  }

}

const sendEscalamiento = async (data, showIn) => {
  InfoGes.value = data
  infoGestionSelected.value = data
  let url = `/pqrd/informacion/${props?.pqrData?.id}/${data.key}`
  showInfo.value = showIn.value
}

const back = async ( showIn) => {
  showInfo.value = false
}

</script>
