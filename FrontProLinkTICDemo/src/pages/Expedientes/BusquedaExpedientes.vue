<template>
  <div>
    <BreadCrumbs :crumbs="routes" />
    <div class="tw-flex tw-justify-between tw-items-center tw-pt-4 tw-mb-8">
      <h2 class="tw-font-bold tw-text-4xl tw-py-4">Expedientes</h2>
      <a href="/expediente/crear">
        <q-btn label="Crear Expediente" color="secondary" icon="add" class="tw-rounded-lg tw-p-2 tw-w-[200px]"
          @click="clean"></q-btn></a>
    </div>

    <div class=" tw-gap-4">

      <q-card flat>
        <q-form flat class="flex tw-flex-col tw-gap-4 tw-p-8 tw-rounded-lg flex-wrap " autofocus
          @submit.prevent="handleSearch">

          <h3 class=" tw-text-2xl tw-text-left tw-font-bold tw-pl-6">Filtros</h3>

          <div class="row q-col-gutter-md q-pb-md q-px-md">
            <span class="tw-w-1/4">
              <label class="tw-text-label">Descripción</label>
              <q-input v-model="form.descripcion" outlined dense class="tw-rounded-lg" label="Inserte" :rules="[]"
                maxlength="20"></q-input>
            </span>
            <span class="tw-w-1/4">
              <label class="tw-text-label">Fecha Inicio</label>
              <DatePicker label="aaaa - mm - dd" v-model:input-data-prop="form.fechaVigenciaInicial" mask="YYYY-MM-DD" />

            </span>

            <span class="tw-w-1/4">
              <label class="tw-text-label">Fecha Final</label>
              <DatePicker label="aaaa - mm - dd" v-model:input-data-prop="form.fechaVigenciaFinal" mask="YYYY-MM-DD" />
            </span>
            <span class="tw-w-1/4">
              <label class="tw-text-label">Dependencia</label>
              <q-select outlined label="Seleccione" class="tw-w-full" dense v-model="form.dependencia"
                :options="dependenciaOptions" emit-value map-options />
            </span>

          </div>


          <span class="w-full flex justify-center tw-gap-4">

            <q-btn label="Limpiar Filtros" color="accent" textColor="black" class="tw-rounded-lg tw-p-2 tw-w-[200px]"
              @click="clean"></q-btn>
            <q-btn label="Buscar" color="secondary" class="tw-rounded-lg tw-p-2 tw-w-[200px] text-bold"
              type="submit"></q-btn>
          </span>
        </q-form>
      </q-card>
      <q-card class="q-mt-lg tw-p-7 tw-rounded-lg " flat>
        <div class="col row tw-flex tw-justify-between tw-items-center tw-pb-4">
          <p class="q-pa-md tw-font-bold tw-text-2xl">Listado de expedientes</p>

          <div class="tw-flex tw-gap-4">
          </div>
        </div>

        <Table :TABLE_HEADER="EXPEDIENTES_HEADER" :TABLE_BODY="expedientes" :selection="undefined" icon="visibility"
          :key="docTable" :msg-no-data="msgFilter" v-model:item-selected="expedientesFiltrado" @anular="anular"
          @eliminar="eliminar" @asociar-exp="asociarExp" @asociar-rad="asociarRad" />
      </q-card>

    </div>

    <Modal v-model="errorModal" title="¡Error!" :text="msgText" :is-success="false" text-button="Aceptar"
      @handleAccept="handleModal" />

    <Modal v-model="anularModal" title="Anular expediente" :text="`¿Deseas anular el expediente '${expAnular.nombre}'?`"
      :is-success="false" text-button="Sí" @handleAccept="handleAction('anular')" text-button-cancel="No" cancel-button
      @close-modal="anularModal = false" />

    <Modal v-model="eliminarModal" title="Eliminar expediente"
      :text="`¿Deseas eliminar el expediente '${expAnular.nombre}'?`" :is-success="false" text-button="Sí"
      @handleAccept="handleAction('eliminar')" text-button-cancel="No" cancel-button
      @close-modal="eliminarModal = false" />

    <SearchModal title="Asociar Expediente" :body="`Asociar expediente al expediente ${expAnular.nombre}`"
      v-model:model-value="expModal" v-model:selected-value="expValue" :select-options="expOptions"
      @handle-accept="handleAsociarExp" @close-modal="hideModal" />

    <SearchModal title="Asociar Radicado" :body="`Asociar radicado al expediente ${expAnular.nombre}`"
      v-model:model-value="radModal" v-model:selected-value="radValue" :select-options="radicadoOptions"
      @handle-accept="handleAsociarRad" @close-modal="hideModal" />

    <Modal v-model:model-value="showModal" :title="actionTitle" :text="actionMessage" is-success text-button="¡Ok!"
      @handleAccept="handleModal" />

    <Modal v-model="confirmModal" title="¡Espera un momento!" :text="messageModal" :is-success="false"
      text-button="Aceptar" @handleAccept="submitFile(file)" />

    <Modal v-model="succesFile" title="Importación exitosa" :text="successMessageModal" is-success text-button="¡Ok!"
      @handleAccept="handleModal" />

  </div>
</template>

<script  lang="ts" setup>
import Table from './Table.vue';
import {
  EXPEDIENTES_HEADER,
  routes,
  nivelesOptions,
  expedientesOptions
} from "."
import { Ref, onBeforeMount, ref } from "vue"
import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';
import Modal from 'components/Modal/Modal.vue';
import DatePicker from 'src/components/FormFields/datePickerComponent.vue';
import { useRouter } from 'vue-router';
import SearchModal from 'src/components/Modal/SearchModal.vue';
import { Dependencia, DocsRadicados, Expediente, SelectInput } from 'src/interfaces';
import { intescoAxios, sgdeaAxios } from 'src/services';

const msgText = ref('')
const expValue = ref('')
const radValue = ref('')
const confirmModal = ref(false);
const file = ref()
const expAnular: Ref<any> = ref({});
const expedientes: Ref<any[]> = ref([])
const expOptions: Ref<SelectInput[]> = ref([])
const radicadoOptions: Ref<SelectInput[]> = ref([])
const expOptionsBackup: Ref<SelectInput[]> = ref([])
const expedientesBackup: Ref<any[]> = ref([])
const actionMessage = ref("")
const actionTitle = ref("")
const expedientesFiltrado: Ref<any[]> = ref([])
const router = useRouter();
const showModal = ref(false)
const errorModal = ref(false);
const succesFile = ref(false);
const anularModal = ref(false);
const expModal = ref(false);
const radModal = ref(false);
const eliminarModal = ref(false);
const docTable = ref(0)
const form = ref({
  dependencia: "",
  fechaVigenciaInicial: "",
  fechaVigenciaFinal: "",
  descripcion: ""
})

const dependenciaOptions = ref([])

const messageModal = ref('')
const successMessageModal = ref('')
const msgFilter = ref('No se encontraron datos. Por favor verifique e intente nuevamente')
messageModal.value = `Seguro que quieres enviar el archivo especifico?`

onBeforeMount(async () => {
  await getAllRegisters();
  const { data: dependencias } = await sgdeaAxios.get<Dependencia[]>("/seccionSubSeccion");

  dependenciaOptions.value = dependencias?.map((item: any) => ({
    label: item.nombre,
    value: item.idSeccionSubSeccion,
  })).filter((it: any) => !!it.label && !!it.value);

  const { data: exps } = await sgdeaAxios.get<Expediente[]>('/expediente/obtenerTodo')
  expOptionsBackup.value = exps.filter(it => it.nodeid !== null).map(it => ({
    label: it.nombreexpediente,
    value: it.nodeid,
  }));

  const { data } = await intescoAxios.get<DocsRadicados>('/bandeja/consultarDocsRadicados');
  radicadoOptions.value = data.result.radicado.map(item => ({
    label: `${item.node.entry.name}`,
    value: item.node.entry.id
  }))
})

async function getAllRegisters() {
  const { data } = await sgdeaAxios.get<Expediente[]>("/expediente/obtenerTodo");
  expedientes.value = new Array<Expediente>();

  if (data && data.length > 0) {
    expedientes.value = data.map((item) => {
      return {
        "idExpediente": item.idexpediente,
        "codigoExpediente": item.codigoexpediente,
        "nombreExpediente": item.nombreexpediente,
        "numeroRadicado": item.numeroradicado,
        "numDocumento": item.nombredocumento,
        // "nombreTipoRadicado": item.tipoRadicado,
        // "nombre": item.tipoDocumental,
        "fechaVigenciaInicial": item.fechavigenciainicial,
        "fechaVigenciaFinal": item.fechavigenciafinal,
        "dependencia": `${item.serieSubSerie?.seccionSubSeccion?.idSeccionSubSeccion} ${item.serieSubSerie?.seccionSubSeccion?.nombre}`,
        "tipoExpediente": expedientesOptions.find((it) => it.value === item.tipoexpediente)?.label,
        "nivelSeguridad": nivelesOptions.find((it) => it.value === item.nivelseguridad)?.label,
        "nodeId": item.nodeid,
      }
    })
    expedientesBackup.value = expedientes.value
  }
}

const handleModal = () => {
  if (showModal.value || succesFile.value) {
    showModal.value = false;
    succesFile.value = false;
  } else {
    errorModal.value = false
  }
}

const handleAction = async (action: "anular" | "eliminar") => {
  let response: any = ""

  try {
    if (action === "anular") {
      response = await sgdeaAxios.put(`/expediente/anular/${expAnular.value.id}`)
      actionMessage.value = "El expediente se ha anulado correctamente"
      actionTitle.value = "Anulación Exitosa"
    } else if (action === "eliminar") {
      response = await sgdeaAxios.delete(`/expediente/eliminar/${expAnular.value.id}`)
      actionTitle.value = "Eliminación Exitosa"
      actionMessage.value = "El expediente se ha eliminado correctamente"
      expAnular.value = {}
    }

    anularModal.value = false;
    eliminarModal.value = false;
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

    if ([200, 201].includes(response.status)) {
      showModal.value = true;
      getAllRegisters();
    }
  } catch (e) {
    errorModal.value = true;
  }
}

const hideModal = () => {
  expModal.value = false;
  radModal.value = false;
}

const anular = (id: number) => {
  expAnular.value = { id: id, codigo: expedientes.value.find(exp => exp.idExpediente == id).codigoExpediente, nombre: expedientes.value.find(exp => exp.idExpediente == id).nombreExpediente };

  anularModal.value = true;
}

const eliminar = (id: number) => {
  expAnular.value = { id: id, codigo: expedientes.value.find(exp => exp.idExpediente == id).codigoExpediente, nombre: expedientes.value.find(exp => exp.idExpediente == id).nombreExpediente };

  eliminarModal.value = true;
}

const asociarExp = (id: number) => {
  expAnular.value = { id: id, codigo: expedientes.value.find(exp => exp.idExpediente == id).codigoExpediente, nombre: expedientes.value.find(exp => exp.idExpediente == id).nombreExpediente };

  expOptions.value = expOptionsBackup.value.filter(item => expAnular.value.nombre !== item.label)
  expModal.value = true;
}

const asociarRad = (id: number) => {
  expAnular.value = { id: id, codigo: expedientes.value.find(exp => exp.idExpediente == id).codigoExpediente, nombre: expedientes.value.find(exp => exp.idExpediente == id).nombreExpediente };

  radModal.value = true;
}

const handleAsociarExp = async () => {
  const payload = {
    idExpediente: expAnular.value.id,
    nodeIdPadre: expValue.value,
    idPadre: expedientes.value.find(item => item.nodeId === expValue.value).idExpediente,
    idHijo: expedientes.value.find(item => expAnular.value.id === item.idExpediente).idExpediente,
    nodeIdHijo: expedientes.value.find(item => expAnular.value.id === item.idExpediente).idExpediente,
    idAsociacion: 0
  }

  const response = await sgdeaAxios.post<boolean>('/expediente/updateAsociacionDocumentoExpediente', payload)

  if ([405, 401, 404, 400, 403, 500].includes(response.status) || response.data === false) {
    msgText.value = `Hubo un error al asociar un expediente, intente nuevamente.`
    errorModal.value = true;
    return;
  }

  if ([200, 201].includes(response.status)) {
    expModal.value = false;
    actionTitle.value = "Asociación exitosa"
    actionMessage.value = "El expediente seleccionado se asoció correctamente"
    showModal.value = true;
    getAllRegisters();
  }
}

const handleAsociarRad = async () => {
  const formData = new FormData();
  formData.append('nodeIdExpediente', String(expedientes.value.find(item => expAnular.value.id === item.idExpediente).nodeId))
  formData.append('nodeIdRadicado', radValue.value);

  const response = await intescoAxios.post('/bandeja/asignarExpediente', formData)

  if ([405, 401, 404, 400, 403, 500].includes(response.status) || response.data === false) {
    msgText.value = `Hubo un error al asociar un radicado, intente nuevamente.`
    errorModal.value = true;
    return;
  }

  if ([200, 201].includes(response.status)) {
    radModal.value = false;
    showModal.value = true;
    actionTitle.value = "Asociación exitosa"
    actionMessage.value = "El radicado se asoció correctamente al expediente"
    getAllRegisters();
  }
}


const clean = () => {
  expedientes.value = expedientesBackup.value

  form.value = {
    numDocumento: null,
    pagina: null,
    registros: null
  }

  docTable.value++
  expedientes.value = expedientesBackup.value

}


const handleSearch = async () => {
  const { data: { content: response } } = await sgdeaAxios.get(`/expediente/filtro?pagina=0&tamaño=50${form.value.fechaVigenciaInicial ? "&fechaInicio=" + form.value.fechaVigenciaInicial : ""}${form.value.fechaVigenciaFinal ? "&fechaFin=" + form.value.fechaVigenciaFinal : ""}${form.value.descripcion ? "&nombre=" + form.value.descripcion : ""}${form.value.dependencia ? '&idDependencia=' + form.value.dependencia : ""}`)

  expedientes.value = new Array();

  if (response && response.length > 0) {
    expedientes.value = response.map((item) => {
      return {
        "idExpediente": item.idExpediente,
        "codigoExpediente": item.codigoexpediente,
        "nombreExpediente": item.nombreexpediente,
        "numeroRadicado": item.numeroradicado,
        "numDocumento": item.nombredocumento,
        "nombreTipoRadicado": item.tipoRadicado,
        "nombre": item.tipoDocumental,
        "fechaVigenciaInicial": item.fechavigenciainicial,
        "fechaVigenciaFinal": item.fechavigenciafinal,
        "dependencia": `${item.serieSubSerie?.seccionSubSeccion?.idSeccionSubSeccion} ${item.serieSubSerie?.seccionSubSeccion?.nombre}`,
        "tipoExpediente": expedientesOptions.find((it) => it.value === item.tipoexpediente)?.label,
        "nivelSeguridad": nivelesOptions.find((it) => it.value === item.nivelseguridad)?.label,
      }
    })
  } else {
    msgFilter.value = "No se encontraron datos con los criterios ingresados, Por favor verifique e intente nuevamente"
  }
}

</script>


<style scoped></style>
