<template>
  <div class="tw-flex tw-p-3">
    <div class="tw-w-full tw-pr-3 tw-mt-2 tw-relative">
      <div class="tw-flex tw-justify-between tw-items-center ">
        <div class="tw-flex tw-gap-2">
          <h2 class="tw-font-bold tw-text-xl tw-py-4 tw-capitalize">{{ route.params.tipo }} | {{ radicado?.nombreRadicado
            ?? "Data dict" }}</h2>
        </div>
        <!-- <div class="tw-flex tw-gap-2">
          <q-btn label="Asociar expedientes" @click="showModal = true" color="secondary" icon="add_circle"
            class="tw-rounded-lg" />
        </div> -->
        <div class="tw-flex tw-gap-2">
          <q-btn label="Asignar estado" @click="$router.push('/tutelas/detalle/' + $route.params.id)" color="secondary"
            icon="add_circle" class="tw-rounded-lg" />
        </div>
      </div>
      <div class="tw-flex tw-items-center tw-justify-between">
        <div>
          <q-tabs v-model="tab" class="tw-font-semibold" inline-label align="left">
            <q-tab name="document" label=""
              :class="['tw-capitalize', tab === 'document' ? 'tw-text-secondary' : 'tw-text-gray-dark']">
              <span class="tw-font-semibold">Documentos</span>
            </q-tab>
          </q-tabs>
        </div>

      </div>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="document" class="grid">
          <Document v-for="(item, index) in documentos" :key="index" :name="item.nombreAnexo"
            :content-type="item.contentType" :node-id="item.docAnexo"
            class="col-span-1 q-px-md !tw-w-full tw-max-w-[250px]" />
        </q-tab-panel>

      </q-tab-panels>


    </div>
  </div>
  <SearchModal title="Asignar Expediente" body="Asignar expediente al radicado seleccionado"
    v-model:model-value="showModal" v-model:selected-value="input" :select-options="expedientesOptions"
    @handle-accept="handleSubmit" @close-modal="showModal = false" @cancel="showModal = false" />
  <Modal v-model:model-value="errorModal" title="¡Error!" :text="errorTxt" :is-success="false" text-button="¡OK!"
    @handleAccept="errorModal = false" />
  <Modal v-model:model-value="showModalSuccess" title="Acción exitosa"
    text="Se ha asignado el radicado al expediente seleccionado" is-success text-button="¡Ok!"
    @handleAccept="showModalSuccess = false" />
</template>

<script lang="ts" setup>
import { Ref, onBeforeMount, ref } from "vue"

import Document from "./ViewDocument/ViewDocument.vue";
import { useRoute, useRouter } from 'vue-router';
import { intescoAxios, sgdeaAxios } from "src/services";
import { Expediente, Anexo, DocsRadicados, SelectInput } from "src/interfaces";
import SearchModal from "src/components/Modal/SearchModal.vue";
import Modal from "src/components/Modal/Modal.vue";
const tab = ref('document')
const errorModal = ref(false)
const showModal = ref(false)
const showModalSuccess = ref(false)
const router = useRouter();
const route = useRoute();
const errorTxt = ref("");
const input = ref("");
const radicado = ref({
  id: 0,
  nombreRadicado: "",
  radicadoNodeId: "",
  cantidadAnexos: 0,
  checked: false,
});

const documentos: Ref<Anexo[]> = ref();
const expedientesOptions: Ref<SelectInput[]> = ref([]);
const nivel: Ref<string | null> = ref(null);
async function getAllRegisters() {

  const { data } = await intescoAxios.get<DocsRadicados>(`/bandeja/consultarDocsRadicados?filtro=${route.params.tipo}`);

  //@ts-ignore
  data.result.radicado.forEach((item, index) => {
    //@ts-ignore
    if (item.node.entry.name.includes(route.params.id)) {
      documentos.value = item.anexos;

      radicado.value = {
        id: index + 1,
        nombreRadicado: item.node.entry.name,
        radicadoNodeId: item.node.entry.id,
        cantidadAnexos: item.anexos.length,
        checked: false,
      }
    }
  })

  const { data: exps } = await sgdeaAxios.get<Expediente[]>('/expediente/obtenerTodo')
  expedientesOptions.value = exps.filter(it => it.nodeid !== null && it.estado !== 3).map(it => ({
    label: it.nombreexpediente,
    value: it.nodeid,
  }));

}


onBeforeMount(async () => await getAllRegisters())

const handleSubmit = async () => {

  if (!input.value.toString().length) {
    errorTxt.value = 'Por favor llene el campo'
    errorModal.value = true;
    return;
  }

  const formData = new FormData();
  formData.append('nodeIdExpediente', String(input.value))
  formData.append('nodeIdRadicado', radicado.value.radicadoNodeId);

  try {

    const response = await intescoAxios.post<boolean>('/bandeja/asignarExpediente', formData)
    if (!response.data) {
      errorTxt.value = 'Ha ocurrido un error'
      errorModal.value = true;
      return;
    }

    if ([200, 201].includes(response.status)) {
      showModal.value = false;
      showModalSuccess.value = true;
    }

  } catch (error) {
    if ([405, 401, 404, 400, 403, 500].includes(error.response?.status)) {
      errorTxt.value = 'Ha ocurrido un error'
      errorModal.value = true;
      return;
    }
  }
}
</script>


<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
</style>
