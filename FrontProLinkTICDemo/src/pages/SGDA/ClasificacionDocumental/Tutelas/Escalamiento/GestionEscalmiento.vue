<template>
  <q-form>
    <section v-if="activeView">
      <div class="q-mt-sm">
        <a @click="activeView = false" class="text-primary q-mb-md block"
          style="text-decoration: none; cursor: pointer">
          <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
          <b> Atras</b>
        </a>
        <p class="tw-text-lg text-weight-bold q-mx-lg">
          Listado de Respuesta de Escalamiento
        </p>
        <p class="tw-font-bold tw-text-gray-dark tw-mt-5 tw-ms-5">Comentarios</p>
        <p v-if="dataEscalamiento.motivo" class="tw-text-base tw-font-light text-grey-6 tw-mt-1 tw-ms-5"
          v-html="dataEscalamiento.motivo"></p>
        <p v-else class="tw-text-base tw-font-light text-grey-6 tw-mt-1 tw-ms-5">
          {{ detailsTutela.escalamientoTutelas.motivoEscalamiento }}</p>
        <DocumentosRelacionados @adjuntarDocSoporte="openSoporteModal" :detalle-tutela="detailsTutela"
          :active-gest-escalamiento="true" :is-gestion="true" :user-gestion="dataEscalamiento.usuario" />
      </div>
    </section>

    <section v-else>
      <div class="q-mt-sm">
        <p class="tw-text-lg text-weight-bold q-mx-lg">
          Listado de Respuesta de Escalamiento
        </p>
        <Table isSelection="multiple" @update:itemSelected="selectRows" :TABLE_BODY="listEscalamiento"
          :TABLE_HEADER="HEADER_DOCUMENTS" @verEscalamiento="verEscalamiento" icon="download" key-id="id"
          @aprobar="confirmAprobarRechazo" @rechazar="rechazarRechazo" />
      </div>
    </section>
    <Modal v-model="aprobarAjuntar" title="Confirmación" :is-success="false" @handleAccept="adjuntarDocSoporte"
      cancel-button textButtonCancel="No" textButton="Si"
      text="¿Está seguro de anexar este documento al Documento de salida?" @close-modal="aprobarAjuntar = false"
      type="button" />
    <Modal v-model="confirmAprobarRechazoModal" title="Confirmación" :is-success="false" @handleAccept="aprobarRechazo"
      cancel-button text="¿Está seguro de aprobar el rechazo del escalamiento?"
      @close-modal="confirmAprobarRechazoModal = false" textButtonCancel="No" text-button="Si" type="button" />
  </q-form>

</template>

<script lang="ts" setup>
import Table from "src/components/Table.vue";
import { Ref, onMounted, ref, watch, onBeforeMount } from "vue";
import { formatDateAndTimeTwo, formatDateAndTime } from "src/helpers/formtDate";
import { sgdeaAxios, intescoAxios } from "src/services";
import DocumentosRelacionados from "../DocumentosRelacionados/DocumentosRelacionados.vue";
import { toast } from "src/helpers/toast";
import Modal from "components/Modal/Modal.vue";
import { useAuthStore } from "src/stores/auth.store";
import { useRoute } from "vue-router";
import { crearTrazabilidad } from "src/helpers/trazabilidad";

const props = withDefaults(defineProps<{
  detailsTutela: any[],
}>(), {
})

const selectedEscalamientos = ref()
const confirmAprobarRechazoModal = ref(false)
const emit = defineEmits(['escalamientoRechazado', 'update:itemSelected'])

const HEADER_DOCUMENTS = [
  {
    name: "nombre",
    label: "Nombre del Gestionador Escalado",
    field: "nombre",
    sortable: true,
    align: "center",
  },
  {
    name: "oficina",
    label: "Oficina",
    field: "oficina",
    sortable: true,
    align: "center",
  },
  {
    name: "fecha_respuesta",
    label: "Fecha y Hora de Respuesta",
    field: "fecha_respuesta",
    sortable: true,
    align: "center",
  },
  {
    name: "estado",
    label: "Estado",
    field: 'estado',
    sortable: true,
    align: "center",
  },
  {
    name: "motivo",
    label: "Motivo de Rechazo",
    field: 'motivo',
    sortable: true,
    align: "center",
  },
  {
    name: "actionsGE",
    label: "Acciones",
    field: "actions",
    sortable: true,
    align: "center",
  },
];

const activeView = ref(false)
const listEscalamiento = ref([])
const dataEscalamiento = ref()
const aprobarAjuntar = ref()
const dataSoporte = ref()
const currEscalamiento = ref()
const route = useRoute();
const auth = useAuthStore()

const verEscalamiento = (data) => {
  activeView.value = true
  dataEscalamiento.value = data
}

const openSoporteModal = (data) => {
  aprobarAjuntar.value = true
  dataSoporte.value = data
}

const adjuntarDocSoporte = async (data) => {
  const cambiarTipoDocumento = await sgdeaAxios.put(`/tutela/archivos/${props.detailsTutela.idTutela}`, {
    id: dataSoporte.value.id,
    nombre: dataSoporte.value.nombre,
    extension: dataSoporte.value.extension,
    tipo: 'De salida ',
    usuario: dataSoporte.value.usuario,
    username: dataSoporte.value.username,
    tutelaId: props.detailsTutela.idTutela,
    nodeId: dataSoporte.value.nodeId,
    fechaCreacion: dataSoporte.value.fechaCreacion
  });

  toast.success('El documento se ha anexado al documento de salida con éxito')
}

function confirmAprobarRechazo(id) {
  confirmAprobarRechazoModal.value = true
  currEscalamiento.value = id
}

async function aprobarRechazo() {
  const response = await sgdeaAxios.put(`/tutela/actualizarEstadoRechazoEscalado/${1}/${currEscalamiento.value}`)
  getData()
  await crearTrazabilidad({
        proceso: `TUT${props.detailsTutela.idTutela}`,
        secuencia: props.detailsTutela.idRadicado,
        estado: props.detailsTutela.estado,
        descripcion: "Se ha aprobado la solicitud de rechazo del escalamiento del usuario " + listEscalamiento.value.find((item) => item.id == currEscalamiento.value).usuario,
        comentario: 'Escalamiento',
        nombre: auth.$state.userInfo.name,
        tramite: 'Tutela',
        accion: `${auth.$state.userInfo.name} aprobó la solicitud de rechazo del escalamiento`,
      })
}

async function rechazarRechazo(id) {
  const response = await sgdeaAxios.put(`/tutela/actualizarEstadoRechazoEscalado/${2}/${id}`)
  getData()
  emit('escalamientoRechazado')
  await crearTrazabilidad({
        proceso: `TUT${props.detailsTutela.idTutela}`,
        secuencia: props.detailsTutela.idRadicado,
        estado: props.detailsTutela.estado,
        descripcion: "Se ha rechazado la solicitud de rechazo del escalamiento del usuario " + listEscalamiento.value.find((item) => item.id == currEscalamiento.value).usuario,
        comentario: 'Escalamiento',
        nombre: auth.$state.userInfo.name,
        tramite: 'Tutela',
        accion: `${auth.$state.userInfo.name} rechazó la solicitud de rechazo del escalamiento`,
      })
}

const findRoles = (role) => {
  var nomenclatura = [
    'Administrador', //0
    'Asignador Responsable', //1
    'aprobador_sgdea', //2
    'Gestionador', //3
    'Radicador - Web', //4
    'Aprobador', //5
    'Asignador Líder' //6
  ]
  var valid = false
  role.forEach(element => {
    if (useAuthStore().$state.userInfo.role?.includes(nomenclatura[element])) {
      valid = true
    }
  });
  return valid
}

onMounted(async () => {

  getData()

})

async function getData() {
  const response = await sgdeaAxios.get(`/tutela/info/${route.params.id}`)

  if (findRoles([6])) {
    listEscalamiento.value = response.data.usuarioEscalados.filter((item) => item.estado == 'Rechazo no aprobado' || item.estado == 'Rechazo aprobado' || item.estado == 'Escalamiento Rechazado').map((item) => ({
      nombre: item.usuarioInfo.firstname + " " + item.usuarioInfo.lastname,
      oficina: item.usuarioInfo.usuarioRelaciones[0].oficina.nombre,
      fecha_respuesta: formatDateAndTime(item.fechaCreacion),
      estado: item.estado,
      motivo: item.motivo,
      fechaActualizacion: item.fechaActualizacion,
      id: item.id,
      userId: item.usuarioId,
      usuario: item.usuario
    }))
  } else {
    listEscalamiento.value = response.data.usuarioEscalados.map((item) => ({
      nombre: item.usuarioInfo.firstname + " " + item.usuarioInfo.lastname,
      oficina: item.usuarioInfo.usuarioRelaciones[0].oficina.nombre,
      fecha_respuesta: formatDateAndTime(item.fechaCreacion),
      estado: item.estado,
      motivo: item.motivo,
      fechaActualizacion: item.fechaActualizacion,
      id: item.id,
      userId: item.usuarioId,
      usuario: item.usuario
    }))
  }
}

const selectRows = (data) => {
  selectedEscalamientos.value = data
}

defineExpose({getData})

watch(selectedEscalamientos, (newValue)=>{
  emit('update:itemSelected', newValue)
}, {deep: true})

</script>
