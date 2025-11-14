<template>
  <div>
    <BreadCrumbs :crumbs="routes" />
    <div class="tw-flex tw-justify-between tw-items-center tw-pt-4 tw-mb-8">
      <h2 class="tw-font-bold tw-text-4xl tw-py-4">Administración de CCD</h2>
    </div>

    <div>
      <q-card class="tw-flex tw-flex-col tw-p-8 tw-rounded-xl" flat>

        <p class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">Filtros</p>

        <div class="flex row q-col-gutter-md q-pb-md " :key="tableKey">
          <span class="tw-w-1/4">
            <label for="">Código de Serie</label>
            <q-input type="number" v-model="form.cod_serie" outlined dense class="tw-rounded-lg"
              label="Inserte"></q-input>
          </span>
          <span class="tw-w-1/4">
            <label for="">Código de Subserie</label>
            <q-input v-model="form.cod_subserie" type="number" outlined dense class="tw-rounded-lg"
              label="Inserte"></q-input>
          </span>
          <span class="tw-w-1/4">
            <label for="">Nombre serie</label>
            <q-input v-model="form.nombre_serie" outlined dense class="tw-rounded-lg" label="Inserte"></q-input>
          </span>

          <span class="tw-w-1/4">
            <label for="">Nombre subserie</label>
            <q-input v-model="form.nombre_subserie" outlined dense class="tw-rounded-lg" label="Inserte"></q-input>
          </span>

        </div>

        <div class="flex row q-col-gutter-md q-pb-md">
          <span class="tw-w-1/4">
            <label for="">Código de Dependencia</label>
            <q-input v-model="form.cod_dependencia" type="number" outlined dense class="tw-rounded-lg"
              label="Inserte"></q-input>
          </span>
          <span class="tw-w-1/4">
            <label for="">Nombre de Dependencia</label>
            <q-input v-model="form.nombre_dependencia" outlined dense class="tw-rounded-lg" label="Inserte"></q-input>
          </span>

        </div>

        <span class="w-full flex justify-center tw-gap-4">

          <q-btn label="Limpiar Filtros" color="accent" textColor="black" class="tw-rounded-lg tw-p-3 tw-w-[200px]"
            @click="resetForm"></q-btn>
          <q-btn label="Buscar" color="secondary" class="tw-rounded-lg tw-p-3 tw-w-[200px] text-bold"
            @click="submit"></q-btn>
        </span>
      </q-card>

      <q-card class="tw-mt-6 tw-rounded-xl tw-p-7" flat>
        <div class="flex flex-center justify-between">
          <p class="tw-text-2xl tw-pl-6">Listado CCD</p>

          <div class="flex flex-center tw-gap-5  tw-mb-4">
            <q-btn label='Importar' class="tw-h-[30px] tw-rounded-xl tw-border-2" @click="() => showFiles = true"
              color="white" text-color="black"></q-btn>
            <ExportFile @exportFiles="handleExportSelect" :disabled="!checkItem.length" />
          </div>
          <FileModal title="Importacion CDC" text-button="Importar" v-model:file="file" v-model="showFiles"
            @handle-accept="confirm" accept-file=".csv, .xlsx" :key="modalKey" @download-file="downloadTemplate" />
        </div>

        <Table :TABLE_HEADER="Documental_HEADER" :TABLE_BODY="documental" v-model:item-selected="checkItem"
          key-id="cod_serie" />
      </q-card>
    </div>

    <Modal v-model="errorModal" title="¡Error!" text="Ha ocurrido un error al intentar exportar el archivo"
      :is-success="false" text-button="Aceptar" @handleAccept="handleModal" />
    <Modal v-model="showModal" title="Exportación exitosa" :text="successMessageModal" is-success text-button="¡Ok!"
      @handleAccept="handleModal" />

    <Modal v-model="confirmModal" title="¡Espera un momento!" :text="messageModal" :is-success="false"
      text-button="Aceptar" @handleAccept="submitFile(file)" />

    <Modal v-model="errorFile" title="¡Error!" text="Ha ocurrido un error al intentar importar el archivo"
      :is-success="false" text-button="Aceptar" @handleAccept="handleModal" />
    <Modal v-model="succesFile" title="Exportación exitosa" :text="successMessageModal" is-success text-button="¡Ok!"
      @handleAccept="handleModal" />
  </div>
</template>

<script setup>
import Table from 'src/components/Table.vue';
import { Documental_HEADER, formatExcel } from "."
import { computed, onMounted, ref, watch } from "vue"
import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';
import FileModal from 'src/components/Modal/FileModal.vue'
import Modal from 'src/components/Modal/Modal.vue'
import ExportFile from 'components/FormFields/exportFiles.vue'
import exportService from "src/services/ExportService";
import { sgdeaAxios } from 'src/services';

const dataTable = ref([])

const form = ref({
  cod_dependencia: "",
  cod_serie: "",
  cod_subserie: "",
  nombre_dependencia: "",
  nombre_serie: "",
  nombre_subserie: ""
});
const tableKey = ref();
const documental = ref([])
const showModal = ref(false)
const errorModal = ref(false);
const showFiles = ref(false);
const checkItem = ref([]);
const loadData = ref(false);
const fileValue = ref({});
const succesFile = ref(false);
const confirmModal = ref(false);
const errorFile = ref(false);
const modalKey = ref('')

const file = ref()
const messageModal = ref('')
const successMessageModal = ref('')

messageModal.value = `Seguro que quieres enviar el archivo especifico?`

watch(file, (next, previ) => {
  messageModal.value = `¿Estás seguro de exportar los expedientes del archivo "${next[0].name}"?`
  successMessageModal.value = `Los expedientes que se encuentran en ${next[0].name} fueron importados exitosamente`
})

onMounted(async () => {
  await getItems()
})

const confirm = () => {
  if (file.value) {
    confirmModal.value = true;
  } else {
    errorModal.value = true;
  }
}

const getItems = async () => {
  dataTable.value = (await sgdeaAxios.get('/CCD/documentalsTodo?pagina=0&registros=10000')).data;
  documental.value = dataTable.value
  loadData.value = false
}


async function downloadTemplate() {
  // const trdSend = {
  //   formato: 'excel',
  //   trdList: [{
  //     codigoDependencia: 0,
  //     "coddependencia": "",
  //     "codserie": "",
  //     "codsubserie": "",
  //     "dependencia": "",
  //     "serie": "",
  //     "subserie": ""
  //   }]
  // };
  var trdExport = {
    archivo: formatExcel,
    nombre: 'formato.xlsx'
  }
  await exportService.Download('excel', trdExport);
}

const submitFile = async (file) => {
  const endpoint = file[0]?.type === 'text/csv' ? 'csv' : 'excel';
  file.value = file[0];

  let formdata;
  formdata = new FormData();
  formdata.append("archivo", file[0], "/path/to/file");

  axios.post(`${process.env.API}/CCD/importar-${endpoint}`, formdata, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
    .then(response => {
      confirmModal.value = false
      succesFile.value = true
    })
    .catch(error => {
      errorFile.value = true
    });
};

watch(file, async (newQuestion) => {
  file.value = newQuestion
})


const resetForm = async () => {
  form.value = ({
    cod_dependencia: "",
    cod_serie: "",
    cod_subserie: "",
    nombre_dependencia: "",
    nombre_serie: "",
    nombre_subserie: ""
  })
  documental.value = dataTable.value
  loadData.value = false
}

function submit() {

  const filters = Object.entries(form.value)

  if (filters.length > 0) {

    filters.forEach(z => {
      if (z[1]) {
        documental.value = dataTable.value.filter(x => x[z[0]] == z[1])
        loadData.value = true
      }
    }
    )
  } else {
    documental.value = dataTable.value
  }
  tableKey.value++
}


const handleExportSelect = async (item) => {
  const formatFile = item === 'Excel' ? 'xlsx' : item
  try {
    let response;
    response = await sgdeaAxios.post(
      `/CCD/json/base64${formatFile.toLowerCase()}`, {
      "coddependencia": checkItem.value[0].cod_dependencia,
      "codserie": checkItem.value[0].cod_serie,
      "codsubserie": checkItem.value[0].cod_subserie,
      "dependencia": checkItem.value[0].nombre_dependencia,
      "serie": checkItem.value[0].nombre_serie,
      "subserie": checkItem.value[0].nombre_subserie
    });

    await exportService.Download(item.toLowerCase(), response.data);

    if ([200, 201].includes(response.status)) {
      showModal.value = true
    }
  } catch (e) {
    errorModal.value = true
  }
}

const routes = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'Módulo SGDEA',
  },
  {
    name: 'Clasificación documental',
  },
  {
    name: 'Cuadros de Clasificacion Documental'
  }
];

const handleModal = () => {
  if (showModal.value || succesFile.value || confirmModal.value) {
    showModal.value = false
    succesFile.value = false
    confirmModal.value = false
    if (!succesFile.value) {
      showFiles.value = false
      modalKey.value++
    }
  } else {
    errorModal.value = false
    errorFile.value = false
  }
}

</script>




<style scoped>
h2,
h3 {
  color: #222222;
}
</style>
