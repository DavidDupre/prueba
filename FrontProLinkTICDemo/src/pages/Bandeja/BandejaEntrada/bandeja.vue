<template>
  <div class="tw-p-8">

    <div class="tw-flex tw-justify-between tw-items-center tw-py-4">
      <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold">
        Mi Bandeja de Tareas
      </div>

    </div>
  </div>
</template>
<script lang="ts" setup>
import { Ref, ref, onMounted } from 'vue';
import BreadCrumbs from 'components/BreadCrumbs/BreadCrumbs.vue';
import Table from './table.vue';
import { SUBSERIES_HEADER } from ".";
import { intescoAxios, sgdeaAxios } from 'src/services';
import { DocsRadicados, SelectInput, Expediente } from 'src/interfaces'
import SearchModal from 'src/components/Modal/SearchModal.vue';
import Modal from 'src/components/Modal/Modal.vue';
import { useLoadingStore } from 'src/stores/loading.store';

const refTable = ref(0)
const input: Ref<SelectInput | string> = ref('')

//datatable
const dataTable = ref([]);
const radicado = ref('');
const expedientes: Ref<SelectInput[]> = ref([])
const showModal = ref(false)
const showModalSuccess = ref(false)
const errorModal = ref(false)
const errorTxt = ref('')
const select = ref('')

const getData = async () => {
  const { data } = await intescoAxios.get<DocsRadicados>(`/bandeja/consultarDocsRadicados?${select.value !== '' ? '?filtro='+select.value : ''}`);

  dataTable.value = data.result.radicado.map((item, index) => ({
    id: index + 1,
    nombreRadicado: item.node.entry.name,
    radicadoNodeId: item.node.entry.id,
    cantidadAnexos: item.anexos.length
  }))

  const { data: exps } = await sgdeaAxios.get<Expediente[]>('/expediente/obtenerTodo')
  expedientes.value = exps.filter(it => it.nodeid !== null).map(it => ({
    label: it.nombreexpediente,
    value: it.nodeid,
  }));
}

const selectExp = (id: number) => {
  showModal.value = true;
  const rad = dataTable.value.find(item => item.id == id).radicadoNodeId;
  radicado.value = rad;
}

const handleSubmit = async () => {

  if (!input.value.toString().length) {
    errorTxt.value = 'Por favor llene el campo'
    errorModal.value = true;
    return;
  }

  const formData = new FormData();
  formData.append('nodeIdExpediente', String(input.value))
  formData.append('nodeIdRadicado', radicado.value);

  try {

    const response = await intescoAxios.post('/bandeja/asignarExpediente', formData)

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

onMounted(async () => await getData())

const resetForm = () => { select.value = ''; getData()}

const routes = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'Módulo Bandeja de Tareas',
  },
  {
    name: 'Mi Bandeja de Tareas',
  },
]

</script>
