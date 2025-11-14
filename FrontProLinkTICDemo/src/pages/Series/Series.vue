<template>
  <section class="tw-p-4 tw-flex tw-flex-row tw-w-full">
    <main class="tw-min-h-screen tw-w-full tw-p-0">
      <div class="tw-flex tw-justify-between tw-py-4 ">

        <h1 class="tw-text-3xl tw-font-bold">Series</h1>
        <q-btn color="primary" icon="add" class="tw-w-[100px]"> Crear</q-btn>
      </div>
      <div class="tw-flex tw-justify-between tw-items-center tw-pb-4">

        <div class="tw-w-full tw-flex tw-items-center tw-justify-between">
          <div class="tw-flex tw-gap-2">
            <q-btn icon="tune" size="sm" color="primary" flat @click="resetForm" />
            <q-input
              label="Buscador"
              dense
              outlined
              prefix="search"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-select
              outlined v-model="select"
              :options="[{ label: 'Radicado Entrada', value: 'entrada' }, { label: 'PQRD', value: 'pqrd' }, { label: 'Tutelas', value: 'tutelas' }]"
              map-options
              emit-value
              label="Estado"
              dense
              @update:model-value="getData"
            />
            <q-select
              outlined v-model="select"
              :options="[{ label: 'Radicado Entrada', value: 'entrada' }, { label: 'PQRD', value: 'pqrd' }, { label: 'Tutelas', value: 'tutelas' }]"
              map-options
              emit-value
              label="Tipo expediente"
              dense
              @update:model-value="getData"
            />
          </div>

          <div class="tw-flex tw-gap-1 [&>*]:tw-cursor-pointer">
            <q-icon
              name="format_list_bulleted"
              size="xs"
              color="primary"
              @click="handleSortFolders('column')"
            />
            <q-icon
              name="auto_awesome_mosaic"
              size="xs"
              color="primary"
              @click="handleSortFolders('mosaic')"
            />
            <q-icon
              name="account_tree"
              size="xs"
              color="primary"
              @click="handleSortFolders('tree')"
            />
          </div>
        </div>
      </div>
      <section class="grid" v-if="orderFolders === 'mosaic'">
        <q-card v-for="(item, index) in documentos" :class="`tw-flex tw-justify-between tw-p-3 tw-border tw-w-[310px] tw-relative tw-rounded-xl ${item.checked ? 'bg-light-blue-1' : ''}`"
                :key="index" flat>
          <div>
            <q-checkbox v-model="item.checked" class="checkbox-position" size="xs" />
          </div>

          <a :href="`/bandeja/carpeta/${select}/${item.nombreRadicado}`">
            <img v-lazy :data-url="folder" alt="" class="tw-w-10 tw-h-12 tw-mx-auto">
            <q-card-section>
              <div class="tw-text-md tw-font-bold tw-text-center tw-leading-5">{{ item.nombreRadicado }}</div>
              <div class="w-text-sm  tw-text-center tw-leading-5">Cantidad de anexos: {{ item.cantidadAnexos }}</div>
            </q-card-section>
          </a>
          <div class="tw-relative">
            <img v-lazy :data-url="ThreePoints" alt="" class="tw-w-[7px]">
            <div class="tw-flex tw-gap-x-1 tw-absolute tw-top-[110px] -tw-left-5 tw-flex">
              <q-icon name="favorite" color="primary"></q-icon>
              <q-icon name="chat_bubble" color="primary"></q-icon>
            </div>
          </div>

        </q-card>
      </section>
      <section v-if="orderFolders === 'column'">
        <Table
          :TABLE_HEADER="SERIES_HEADER "
          :TABLE_BODY="documentos"
          :selection="undefined"
          @handleCaso="handleCaso"
        />
      </section>

      <section v-if="orderFolders === 'tree'" class="tw-flex tw-flex-col">
        <div v-for="(item, index) in documentos"
             :class="`tw-p-1 tw-relative tw-flex tw-flex-col`" :key="index">
          <div :class="`tw-flex tw-justify-between tw-py-1 ${item.checked ? 'tw-bg-gray-200/30' : 'hover:tw-bg-gray-200/30'}`" @click="item.checked = true; uncheck(index)">
            <div class="tw-flex tw-justify-start tw-items-center">
              <q-icon name="subdirectory_arrow_right" alt="" class="tw-w-3 tw-h-3 tw-mr-1 tw-justify-self-start" />
              <img v-lazy :data-url="folder" alt="" class="tw-w-5 tw-h-5 tw-mx-3 tw-justify-self-start">
              <p class="tw-text-xs tw-justify-self-start">{{ item.nombreRadicado }}</p>
            </div>
            <div class="tw-flex tw-items-center tw-gap-x-3">
              <q-btn icon="add_circle" flat rounded dense size="sm" v-if="item.checked"/>
              <q-btn icon="edit" flat rounded dense size="sm" v-if="item.checked"/>
              <q-btn icon="upload" flat rounded dense size="sm" v-if="item.checked"/>
              <q-btn icon="share" flat rounded dense size="sm" v-if="item.checked"/>
              <q-btn icon="file_copy" flat rounded dense size="sm" v-if="item.checked"/>
              <q-btn icon="download" flat rounded dense size="sm" v-if="item.checked"/>
              <q-btn icon="print" flat rounded dense size="sm" v-if="item.checked"/>
              <q-btn icon="drive_file_move" flat rounded dense size="sm" v-if="item.checked"/>
              <q-btn icon="cancel" flat rounded dense size="sm" v-if="item.checked"/>
              <div class="tw-border-[0.7px] tw-border-[#787E8C] tw-border-solid tw-h-1/2"/>
              <img v-lazy :data-url="item.image" alt="" class="tw-w-4 tw-h-4" />
              <q-badge text-color="black"
                       :class="`tw-flex !tw-rounded-xl tw-gap-x-1 ${item.estado == 1 ? 'bg-green-2' : 'bg-grey-2'}`">
                <q-icon :name="item.estado == 1 ? 'folder_open' : 'lock'" size="xs" />
                <span class="tw-text-xs">{{ item.estado == 1 ? "Abierto" : "Cerrado" }}</span>
              </q-badge>
            </div>
          </div>
          <div v-for="(doc, ind) in item.docs" :key="ind" class="tw-flex tw-justify-start tw-items-center tw-py-1 hover:tw-bg-gray-200/30">
            <img v-lazy :data-url="enterArrow" alt="" class="tw-w-3 tw-h-3 tw-mr-1 tw-ml-8 tw-my-2" />
            <img v-lazy :data-url="pdf" alt="" class="tw-w-6 tw-h-6 tw-mx-3">
            <p class="tw-text-xs">{{ doc }}</p>
          </div>
        </div>
      </section>
    </main>
  </section>
  <Modal v-model:model-value="successModal" :title="actionTitle" :text="actionMessage" is-success text-button="¡Ok!"
         @handleAccept="successModal = false" />
  <Modal v-model="errorModal" title="¡Error!" :text="msgText" :is-success="false" text-button="Aceptar"
         @handleAccept="handleModal" />
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { Ref, onMounted, ref, watchEffect } from 'vue';

import { Radicado, SelectInput, Expediente } from 'src/interfaces';
import { sgdeaAxios, intescoAxios } from 'src/services';
import { SERIES_HEADER } from "./";
import Modal from 'src/components/Modal/Modal.vue';
import Table from "src/components/Table.vue"

import { DocsRadicados } from '../../../interfaces/BandejaDocs';

import folder from "src/assets/folder2.svg";
import ThreePoints from "src/assets/three-points-gray.svg";

interface Folders {
  id: number,
  nombreRadicado: string,
  radicadoNodeId: string,
  cantidadAnexos: string,
  checked: boolean
}
const vueroute = useRoute()
const router = useRouter();

const showModal = ref(false);
const errorModal = ref(false);
const successModal = ref(false);
const items = ref({
  length: 0,
  selected: [] as Radicado[],
  disable: true,
})

const actionMessage = ref('');
const actionTitle = ref('');
const msgText = ref('');
const documentos: Ref<Folders[]> = ref([]);
const documentosBackup: Ref<Folders[]> = ref([]);
const input: Ref<SelectInput | string> = ref('')
const orderFolders = ref('column')
const radicado = ref('');
const expedientesOptions: Ref<SelectInput[]> = ref([]);
const select = ref('entrada');

const getData = async () => {
  const { data } = await intescoAxios.get<DocsRadicados>(`/bandeja/consultarDocsRadicados${select.value !== '' ? '?filtro=' + select.value : ''}`);

  //@ts-ignore
  if (data.code !== "204") {
    documentosBackup.value = data.result.radicado.map((item, index) => ({
      id: index + 1,
      nombreRadicado: item.node.entry.name,
      radicadoNodeId: item.node.entry.id,
      cantidadAnexos: item.anexos.length,
      checked: false,
    }))
    documentos.value = documentosBackup.value;
  } else {
    documentos.value = [];
  }


  const { data: exps } = await sgdeaAxios.get<Expediente[]>('/expediente/obtenerTodo')
  expedientesOptions.value = exps.filter(it => it.nodeid !== null).map(it => ({
    label: it.nombreexpediente,
    value: it.nodeid,
  }));
}

onMounted(

  async () => {
    if (vueroute.params.proceso)
      select.value = vueroute.params.proceso as string
    await getData()

  })

const resetForm = () => { select.value = 'entrada'; getData() }

watchEffect(() => {
  const checkedExpedientes = documentos.value.filter(item => item.checked);

  items.value = {
    length: checkedExpedientes.length,
    selected: checkedExpedientes,
    disable: checkedExpedientes.length < 1
  };
});

const handleModal = () => {
  if (showModal.value) {
    showModal.value = false;
  } else {
    errorModal.value = false
  }
}

const clearFilters = () => {
  select.value = '';
  documentos.value = documentosBackup.value;
}

const handleSortFolders = (item: string) => orderFolders.value = item

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
