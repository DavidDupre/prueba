<template>
  <div class="tw-flex tw-px-3">
    <div class="tw-w-10/12 tw-border-r-2 tw-border-gray-texts tw-pr-3 tw-mt-2 tw-relative">
      <div class="tw-flex tw-justify-between tw-items-center ">
        <div class="tw-flex tw-gap-2">
          <img v-lazy :data-url="image" alt="folder">
          <h2 class="tw-font-bold tw-text-xl tw-py-4">{{ expediente?.codigoexpediente ?? 23293 }} - {{
            expediente?.nombreexpediente ?? "Data dict" }}</h2>
        </div>

        <div class="tw-flex tw-gap-2">
          <q-btn label="Generar Índice" @click="indiceModal = true" text-color="secondary" outline
            :disable="expediente?.estado !== 3" />
          <q-btn label="Asociar Expediente" @click="asociarModal = true" text-color="secondary" outline
            :disable="expediente?.estado === 3" />
        </div>
      </div>
      <div class="tw-flex tw-items-center tw-justify-between">
        <div>
          <q-tabs v-model="tab" class="tw-font-semibold" inline-label align="left">
            <q-tab name="document" label=""
              :class="['tw-capitalize', tab === 'document' ? 'tw-text-secondary' : 'tw-text-gray-dark']">
              <span class="tw-font-semibold">Documentos</span>
            </q-tab>
            <q-tab name="trazabilidad"
              :class="['tw-capitalize', tab === 'trazabilidad' ? 'tw-text-secondary' : 'tw-text-gray-dark']">
              <span class="tw-font-semibold">Trazabilidad</span>
            </q-tab>
          </q-tabs>
        </div>

        <div :class="['tw-flex tw-px-3 tw-items-center tw-gap-1 tw-rounded-lg', state === 'Borrador'
          ? 'tw-bg-yellow-100' : state === 'Abierto' ? 'tw-bg-green-light' : 'tw-bg-gray-3']">
          <img v-if="state === 'Borrador'" v-lazy :data-url="Borrador" alt="">
          <div v-else :class="['state-circle',
            state === 'Abierto' ?
              'tw-bg-secondary'
              : state === 'Cerrado' ?
                'tw-border-2 !tw-border-secondary'
                : 'tw-hidden']" />
          <span :class="['tw-font-semibold', state === 'abierto' ?? 'tw-text-secondary']">{{ state }}</span>
        </div>
      </div>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="document" class="grid">
          <Document v-for="(item, index) in documentos" :key="index" :name="item.nombreDocumento"
            :content-type="item.tipoDocumento" :node-id="item.nodeIdDocumento"
            class="col q-px-md tw-w-full tw-max-w-[250px]" />
        </q-tab-panel>

        <q-tab-panel name="trazabilidad">
          <Trazabilidad />
        </q-tab-panel>

      </q-tab-panels>


    </div>
    <div class="tw-pl-4">
      <div class="tw-flex tw-gap-2">
        <img v-lazy :data-url="image" alt="folder">
        <h2 class="tw-font-bold tw-text-xl tw-py-4">{{ expediente?.codigoexpediente ?? 23293 }} - {{
          expediente?.nombreexpediente ?? "Data dict" }}</h2>
      </div>

      <p class="tw-font-semibold tw-text-gray-dark tw-mt-2">Versión</p>
      <p class="tw-min-w-[100px] tw-w-[250px] tw-border-b-2 tw-border-gray-200 tw-pb-2">
        {{ expediente?.serieSubSerie?.seccionSubSeccion?.idversiontrd?.nombreVersion ?? 'data' }}</p>
      <p class="tw-font-semibold tw-text-gray-dark tw-mt-2">Dependencia</p>
      <p class="tw-min-w-[100px] tw-w-[250px] tw-border-b-2 tw-border-gray-200 tw-pb-2">
        {{ expediente?.serieSubSerie.seccionSubSeccion.nombre ?? "Dependencia" }}</p>

      <p class="tw-font-semibold tw-text-gray-dark tw-mt-2">Serie</p>
      <p class="tw-min-w-[100px] tw-w-[250px] tw-border-b-2 tw-border-gray-200 tw-pb-2">
        {{ expediente?.serieSubSerie?.padre?.descripcion ?? expediente?.serieSubSerie?.descripcion ?? "Serie" }}</p>

      <p class="tw-font-semibold tw-text-gray-dark tw-mt-2">Área</p>
      <p class="tw-min-w-[100px] tw-w-[250px] tw-border-b-2 tw-border-gray-200 tw-pb-2">
        {{ expediente?.area ?? 'data' }}</p>
      <p class="tw-font-semibold tw-text-gray-dark tw-mt-2">Grupo</p>
      <p class="tw-min-w-[100px] tw-w-[250px] tw-border-b-2 tw-border-gray-200 tw-pb-2">
        {{ expediente?.grupo ?? 'data' }}</p>
      <p class="tw-font-semibold tw-text-gray-dark tw-mt-2">Fecha Inicial</p>
      <p class="tw-min-w-[100px] tw-w-[250px] tw-border-b-2 tw-border-gray-200 tw-pb-2">
        {{ expediente?.fechavigenciainicial ?? 'data' }}</p>
      <p class="tw-font-semibold tw-text-gray-dark tw-mt-2">Fecha Final</p>
      <p class="tw-min-w-[100px] tw-w-[250px] tw-border-b-2 tw-border-gray-200 tw-pb-2">
        {{ expediente?.fechavigenciafinal ?? 'data' }}</p>
      <p class="tw-font-semibold tw-text-gray-dark tw-mt-2">Nivel de seguridad</p>
      <p class="tw-min-w-[100px] tw-w-[250px] tw-border-b-2 tw-border-gray-200 tw-pb-2">
        {{ nivel ?? 'data' }}</p>
      <p class="tw-font-semibold tw-text-gray-dark tw-mt-2">Expediente asociado</p>
      <a :href="`/expediente/detalle/${expedienteAsociado}`" v-if="expedienteAsociado !== 'No tiene'">Ver expediente
        asociado</a>
      <p class="tw-min-w-[100px] tw-w-[250px] tw-border-b-2 tw-border-gray-200 tw-pb-2" v-else>
        {{ expedienteAsociado }}</p>
    </div>
    <div>
    </div>
  </div>
  <Modal v-model="indiceModal" title="¡Confirmar Indice expediente!"
    text="¿Está seguro de generar el índice de este expediente?" text-cancel-button="NO" text-button="SI"
    @handleAccept="handleSendIndexExpedient" cancel-button @closeModal="() => (indiceModal = false)"
    text-button-cancel="NO" />
  <SearchModal title="Asociar Expediente" :body="`Asociar expediente al expediente ${expediente?.nombreexpediente}`"
    v-model:model-value="asociarModal" v-model:selected-value="expValue" :select-options="expedientesOpt"
    @handle-accept="handleAsociarExp" @close-modal="hideModal" />
  <Modal v-model="errorModal" title="¡Error!" :text="msgText" :is-success="false" text-button="Aceptar"
    @handleAccept="handleModal" />
  <Modal v-model:model-value="showModal" :title="actionTitle" :text="actionMessage" is-success text-button="¡Ok!"
    @handleAccept="handleModal" />
</template>

<script lang="ts" setup>
import { Ref, onBeforeMount, ref } from "vue"

import Document from "./ViewDocument/ViewDocument.vue";
import Trazabilidad from "./Trazabilidad/Trazabilidad.vue";

import folder from "assets/folder.svg";
import fisico from 'assets/fisico-expediente.svg';
import hibrido from 'assets/hibrido-expediente.svg';
import Borrador from "assets/borrador.svg";
import { useRoute } from 'vue-router';
import { sgdeaAxios } from "src/services";
import { Expediente, DocumentosExp, SelectInput } from "src/interfaces";
import { nivelesOptions } from './index';
import SearchModal from "src/components/Modal/SearchModal.vue";
import Modal from "src/components/Modal/Modal.vue";

const showModal = ref(false);

const tab = ref('document')
const asociarModal = ref(false)
const indiceModal = ref(false)
const state = ref('Abierto')
const errorModal = ref(false)
const route = useRoute();
const image = ref("");
const expValue = ref("");
const msgText = ref("");
const actionTitle = ref("");
const actionMessage = ref("");
const expedienteAsociado = ref("");
const expediente: Ref<Expediente> = ref();
const expedientes: Ref<Expediente[]> = ref();
const expedientesOpt: Ref<SelectInput[]> = ref();
const documentos: Ref<DocumentosExp[]> = ref([]);
const nivel: Ref<string | null> = ref(null);

async function getAllRegisters() {

  const { data } = await sgdeaAxios.get<Expediente[]>("/expediente/obtenerTodo");

  if (data && data.length > 0) {
    expedientes.value = data;
    //@ts-ignore
    //@ts-ignore
    expediente.value = data.find((item) => {
      //@ts-ignore
      if (item.idexpediente == route.params.id) {
        state.value = item.estado !== 3 ? 'Abierto' : 'Cerrado'
        return {
          ...item,
        }
      }
    })
    expedientesOpt.value = data.filter(e => e.nodeid !== '' && e.estado !== 3).map((e) => ({ value: e.nodeid, label: `${e?.nombreexpediente}` })).filter(e => e.value !== expediente.value.nodeid);

    nivel.value = nivelesOptions.find(it => it.value == expediente.value.nivelseguridad).label
    switch (expediente.value.tipoexpediente) {
      case 1:
        image.value = folder;
        break;
      case 2:
        image.value = fisico;
        break;
      case 3:
        image.value = hibrido;
        break;
    }

    try {
      const { data } = await sgdeaAxios.get(`/expediente/buscarAsocia/${expediente.value.idexpediente}`)
      expedienteAsociado.value = data?.idPadre ?? 'No tiene';
    } catch (e) {
      expedienteAsociado.value = 'No tiene';
    }

  }

  const { data: docs } = await sgdeaAxios.get<DocumentosExp[]>(`/expediente/buscarContenido/${route.params.id}`)
  documentos.value = docs;

}

onBeforeMount(async () => await getAllRegisters())

const handleAsociarExp = async () => {
  const payload = {
    idExpediente: expediente.value.idexpediente,
    nodeIdPadre: expValue.value,
    idPadre: expedientes.value.find(item => item.nodeid === expValue.value).idexpediente,
    idHijo: expediente.value.idexpediente,
    nodeIdHijo: expediente.value.idexpediente,
    idAsociacion: 0
  }

  const response = await sgdeaAxios.post<boolean>(`/expediente/updateAsociacionDocumentoExpediente?idExpediente=${payload.idExpediente}&idAsociacion=0&nodeIdPadre=${payload.nodeIdPadre}&idPadre=${payload.idPadre}&idHijo=${payload.idHijo}&nodeIdHijo=${payload.nodeIdHijo}`, null)

  if ([405, 401, 404, 400, 403, 500].includes(response.status) || response.data === false) {
    msgText.value = `Hubo un error al asociar un expediente, intente nuevamente.`
    errorModal.value = true;
    return;
  }

  if ([200, 201].includes(response.status)) {
    asociarModal.value = false;
    actionTitle.value = "Asociación exitosa"
    actionMessage.value = "El expediente seleccionado se asoció correctamente"
    showModal.value = true;
    getAllRegisters();
  }
}

const handleModal = () => {
  if (showModal.value) {
    showModal.value = false;
  } else {
    errorModal.value = false
  }
}

const handleSendIndexExpedient = async () => {
  const response = await sgdeaAxios.post(`/expediente/generarIndex/${expediente.value.nodeid}`)
  if (response.status === 200) {
    indiceModal.value = false;
  }
}

const hideModal = () => {
  asociarModal.value = false;
}
</script>


<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
</style>
