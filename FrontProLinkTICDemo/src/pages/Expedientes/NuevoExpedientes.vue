<template>
  <section class="tw-px-4 tw-flex tw-flex-row tw-w-full">
    <main class="tw-min-h-screen tw-w-full tw-p-0">
      <BreadCrumbs :crumbs="routes" />
      <div class="tw-flex tw-justify-between tw-py-4 ">

        <h1 class="tw-text-3xl tw-font-bold">Expedientes</h1>
        <div class="tw-flex tw-gap-2">

          <q-btn label="Crear Expediente" @click="router.push('/expediente/crear')" color="secondary" icon="add_circle"
            class="tw-rounded-lg" />
        </div>
      </div>
      <div class="tw-flex tw-justify-between tw-items-center tw-pb-4">
        <div class="tw-w-1/2 tw-flex tw-gap-x-2 tw-items-center">
          <q-btn icon="tune" size="sm" round @click="clearFilters"/>
          <q-input class="tw-w-1/3" type="text" dense outlined rounded label="Buscador" v-model:model-value="name"
            @update:model-value="(val: string) => expedientes = expedientesBackup.filter(item => item.nombreExpediente.toLowerCase().includes(val.toLowerCase()))">
            <template v-slot:prepend>
              <q-icon name="search" color="secondary" />
            </template>
          </q-input>
          <q-select class="tw-w-1/3" label="Estado" :options="stateOptions" outlined rounded dense
            v-model:model-value="state" map-options emit-value @update:model-value="(val: number) => expedientes = expedientesBackup.filter(item => item.estado === val)" />
          <q-select class="tw-w-1/3" label="Tipo de expediente" :options="expedientesOptionsStr" outlined rounded dense
            v-model:model-value="tipo" map-options emit-value @update:model-value="(val: string) => expedientes = expedientesBackup.filter(item => item.tipoExpediente.includes(val))" />
        </div>
        <div class="tw-flex tw-gap-2 tw-justify-end tw-items-center">
          <q-btn :label="`Cerrar Expediente (${items.length})`" :disable="items.disable" @click="anularModal = true"
            color="transparent" text-color="secondary" class="tw-border-solid tw-border-2 tw-rounded-xl" icon="cancel"
            flat />
          <q-btn :label="`Eliminar Expediente (${items.length})`" :disable="items.disable" @click="eliminarModal = true"
            color="red-8" text-color="white" icon="delete" class="tw-rounded-xl" />
        </div>
      </div>
      <section class="grid">
        <q-card v-for="(item, index) in expedientes"
          :class="`tw-p-3 tw-relative ${item.checked ? 'bg-light-blue-1' : ''}`" :key="index">
          <q-checkbox v-model="item.checked" class="checkbox-position" />
          <q-badge text-color="black"
            :class="`status-position tw-flex !tw-rounded-xl tw-gap-x-1 ${item.estado == 1 ? 'bg-green-1' : 'bg-grey-2'}`">
            <q-icon :name="item.estado == 1 ? 'folder_open' : 'lock'" size="sm" />
            <span class="tw-text-base">{{ item.estado == 1 ? "Abierto" : "Cerrado" }}</span>
          </q-badge>
          <a :href="`/expediente/detalle/${item.idExpediente}`">
            <img v-lazy :data-url="folder" alt="" class="tw-w-14 tw-h-14 tw-mx-auto">
            <q-card-section>
              <div class="text-h6 tw-text-center tw-leading-5">{{ item.nombreExpediente }}</div>
              <div class="text-subtitle2 tw-text-center tw-leading-5">{{ item.codigoExpediente }}</div>
            </q-card-section>
          </a>
        </q-card>
      </section>
    </main>
  </section>
  <Modal v-model="anularModal" title="Cerrar expedientes"
    :text="`¿Deseas cerrar ${items.length > 1 ? 'los ' + items.length + ' expedientes seleccionados' : 'el expediente seleccionado'}?`"
    :is-success="false" text-button="Sí" @handleAccept="handleAction('cerrar')" text-button-cancel="No" cancel-button
    @close-modal="anularModal = false" />

  <Modal v-model="eliminarModal" title="Eliminar expedientes"
    :text="`¿Deseas eliminar ${items.length > 1 ? 'los ' + items.length + ' expedientes seleccionados' : 'el expediente seleccionado'}?`"
    :is-success="false" text-button="Sí" @handleAccept="handleAction('eliminar')" text-button-cancel="No" cancel-button
    @close-modal="eliminarModal = false" />
  <Modal v-model:model-value="successModal" :title="actionTitle" :text="actionMessage" is-success text-button="¡Ok!"
    @handleAccept="successModal = false" />
  <Modal v-model="errorModal" title="¡Error!" :text="msgText" :is-success="false" text-button="Aceptar"
    @handleAccept="handleModal" />
</template>

<script lang="ts" setup>
import { Ref, onMounted, ref, watchEffect } from 'vue';
import folder from "src/assets/folder2.svg"
import { Expediente } from 'src/interfaces';
import { sgdeaAxios } from 'src/services';
import { expedientesOptionsStr, expedientesOptions, nivelesOptions } from '.';
import Modal from 'src/components/Modal/Modal.vue';
import { useRouter } from 'vue-router';

interface DataExp {
  idExpediente: string
  codigoExpediente: string
  nombreExpediente: string
  numeroRadicado: string
  numDocumento: string
  fechaVigenciaInicial: string
  fechaVigenciaFinal: string
  dependencia: string
  tipoExpediente: string
  nivelSeguridad: string
  nodeId: string;
  estado: number
  checked?: boolean
}

const router = useRouter();

const showModal = ref(false);
const eliminarModal = ref(false);
const anularModal = ref(false);
const errorModal = ref(false);
const successModal = ref(false);
const items = ref({
  length: 0,
  selected: [] as DataExp[],
  disable: true,
})

const name = ref('');
const state = ref('');
const tipo = ref('');
const stateOptions = ref([
  { label: 'Activo', value: 1 },
  { label: 'Inactivo', value: 2 },
  { label: 'Cerrado', value: 3 }
])

const actionMessage = ref('');
const actionTitle = ref('');
const msgText = ref('');

const expedientes: Ref<DataExp[]> = ref([{
  idExpediente: '20',
  codigoExpediente: 'EXP-0002',
  nombreExpediente: 'Dummy data',
  numeroRadicado: '',
  numDocumento: '',
  fechaVigenciaInicial: '2023/11/10',
  fechaVigenciaFinal: '2023/11/13',
  dependencia: `Gerencia administrativa`,
  tipoExpediente: expedientesOptions[1].label,
  nivelSeguridad: nivelesOptions[1].label,
  nodeId: 'aaaa-iiiii-ssss',
  estado: 1,
  checked: false,
}]);
const expedientesBackup: Ref<DataExp[]> = ref([]);

async function getAllRegisters() {
  const { data } = await sgdeaAxios.get<Expediente[]>("/expediente/obtenerTodo");

  if (data && data.length > 0) {
    //@ts-ignore
    expedientes.value = data.map((item) => {
      return {
        idExpediente: item.idexpediente,
        codigoExpediente: item.codigoexpediente,
        nombreExpediente: item.nombreexpediente,
        numeroRadicado: item.numeroradicado,
        numDocumento: item.nombredocumento,
        fechaVigenciaInicial: item.fechavigenciainicial,
        fechaVigenciaFinal: item.fechavigenciafinal,
        dependencia: `${item.serieSubSerie?.seccionSubSeccion?.codigo} ${item.serieSubSerie?.seccionSubSeccion?.nombre}`,
        tipoExpediente: expedientesOptions.find((it) => it.value === item.tipoexpediente)?.label,
        nivelSeguridad: nivelesOptions.find((it) => it.value === item.nivelseguridad)?.label,
        nodeId: item.nodeid,
        estado: item.estado,
        checked: false,
      }
    })
    expedientesBackup.value = expedientes.value
  }
}

onMounted(async () => await getAllRegisters())

watchEffect(() => {
  const checkedExpedientes = expedientes.value.filter(item => item.checked);

  items.value = {
    length: checkedExpedientes.length,
    selected: checkedExpedientes,
    disable: checkedExpedientes.length < 1
  };
});

const handleAction = async (action: "cerrar" | "eliminar",) => {
  let response: any = ""

  try {
    for (const exp of items.value.selected) {
      if (action === "cerrar") {
        response = await sgdeaAxios.put(`/expediente/anular/${exp.idExpediente}`)
        actionMessage.value = items.value.length > 0 ? "Los expedientes se han cerrado correctamente" : "El expediente se ha cerrado correctamente"
        actionTitle.value = "Cierre Exitoso"
      } else if (action === "eliminar") {
        response = await sgdeaAxios.delete(`/expediente/eliminar/${exp.idExpediente}`)
        actionTitle.value = "Eliminación Exitosa"
        actionMessage.value = items.value.length > 0 ? "Los expedientes se han eliminado correctamente" : "El expediente se ha eliminado correctamente"
      }

      if ([405, 401, 404, 400, 403, 500].includes(response.status)) {
        msgText.value = `Hubo un error al ${action} el expediente, intente nuevamente.`
        errorModal.value = true;


        return;
      }

      if ([203].includes(response.status)) {
        msgText.value = "El ID del expediente proporcionado no existe.";
        errorModal.value = true;


        return;
      }
      if ([204].includes(response.status)) {
        msgText.value = `El expediente no se puede ${action}, tiene contenido.`;
        errorModal.value = true;


        return;
      }
    }

    anularModal.value = false;
    eliminarModal.value = false;

    if ([200, 201].includes(response.status)) {
      successModal.value = true;
      getAllRegisters();
    }
  } catch (e) {
    errorModal.value = true;
  }
}

const handleModal = () => {
  if (showModal.value) {
    showModal.value = false;
  } else {
    errorModal.value = false
  }
}

const clearFilters = () => {
  name.value = '';
  tipo.value = '';
  state.value = '';
  expedientes.value = expedientesBackup.value;
}
</script>

<style>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.checkbox-position {
  position: absolute;
  top: 10px;
  left: 10px;
}

.status-position {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
