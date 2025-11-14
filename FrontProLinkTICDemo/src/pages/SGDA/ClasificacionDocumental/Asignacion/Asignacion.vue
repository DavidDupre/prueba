<template>
  <div>
    <BreadCrumbs :crumbs="routes" />

    <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold">
      Asignación de Tipologías Documentales
    </div>

    <q-card class="tw-rounded-lg tw-p-7" flat>

      <q-form ref="CotizacionesForm" class="tw-mt-6">
        <div class="tw-flex tw-flex-wrap tw-full q-col-gutter-md">
          <div class="tw-w-1/4">
            <p class="tw-text-label">Fondo</p>
            <q-select dense outlined :options="optionsFondos" label="Seleccione"
              @update:model-value="(val) => onChangeFondo(val)" v-model="filtro.fondo" />

          </div>
          <div class="tw-w-1/4">
            <p class="tw-text-label">Versión</p>
            <q-select dense outlined :options="versiones" label="Seleccione" v-model="filtro.version"
              @update:model-value="(val) => onChangeVersion(val)" />

          </div>
          <div class="tw-w-1/4 tw-mb-4">
            <p class="tw-text-label">Dependencia</p>
            <q-select outlined dense :options="optionsDependenciasBackup" map-options v-model="filtro.dependencia"
              label="Seleccione" @update:model-value="(val) => onChangeDependencia(val)" />
          </div>
          <div class="tw-w-1/4">
            <p class="tw-text-label">Serie</p>
            <q-select outlined :options="seriesOptions" label="Serie" dense
              @update:model-value="(val) => onChangeSerie(val)" v-model="filtro.serie" />
          </div>
          <div class="tw-w-1/4 tw-mb-5">
            <p class="tw-text-label">Subserie</p>
            <q-select outlined v-model="filtro.subserie" :options="subseriesOptions" label="Subserie" dense map-options
              @update:model-value="(val) => onChangeSubserie(val)" emit-value />
          </div>
          <!--          <div class="tw-w-1/4">-->
          <!--            <p class="tw-text-label">Soporte</p>-->
          <!--            <q-select outlined @update:model-value='(filter: any) => filterSoporteHandler(filter)'-->
          <!--              v-model="filtro.soporte" :options="soporteOptions" label="Soporte" dense />-->
          <!--          </div>-->

        </div>

        <div class="tw-grid lg:tw-grid-cols-5 tw-grid-cols-2 tw-place-content-center tw-gap-3">
          <div class="lg:tw-col-span-3 tw-col-span-2 q-pt-none">
            <q-card class="tw-rounded-2xl tw-p-2 tw-w-full 2xl:tw-w-full" flat bordered>
              <p class="tw-text-lg q-pa-md">Seleccione las tipologías documentales que desea asignar</p>
              <q-input type="search" label="Buscar por nombre" dense outlined v-model:model-value="buscarTipologia"
                @update:model-value="() => findByName()" class="resize-width tw-mx-auto">
                <template v-if="buscarTipologia" v-slot:append>
                  <q-icon name="cancel" class="cursor-pointer"
                    @click.stop.prevent="buscarTipologia = ''; disponibles = disponiblesBackup" />
                </template>
              </q-input>
              <Table :TABLE_HEADER="DOCUMENTAL_HEADER" is-selection="multiple" :TABLE_BODY="disponibles" v-model:item-selected="item"
                msg-no-data="No existen tipologías documentales disponibles por el momento" :key="disponiblesTable"
                key-id="idTipologiaDocumental" />
            </q-card>
          </div>
          <div class="lg:tw-col-span-2 tw-col-span-3 tw-max-w-full q-pt-none">
            <q-card bordered flat class="q-pa-md tw-rounded-2xl " :key="selectedTable">
              <div class="">
                <p class="tw-text-lg">Estas son las tipologías documentales que has seleccionado</p>
                <q-chip removable color="dark" t outline v-model="item[n]" v-for="(i, n) in item">
                  {{ i.nombre }}
                </q-chip>

              </div>
            </q-card>
          </div>
        </div>
        <div class="col col-12 row justify-center q-gutter-x-md q-mt-lg q-pb-lg">
          <q-btn label="Limpiar" style="width: 240px;" class="tw-rounded-xl tw-p-2" color="accent" text-color="black"
            @click="onClean" />
          <q-btn label="Asignar" text-color="white" style="width: 240px;" class="tw-rounded-xl tw-p-2" color="secondary"
            @click="handleAssign" />
        </div>
      </q-form>
    </q-card>
    <q-card class="q-mt-lg tw-p-7 tw-rounded-xl" flat>
      <div class="col row">
        <p class="tw-text-2xl tw-pl-6">Listado de Tipologías Documentales Asignadas</p>
      </div>
      <div>
        <Table :TABLE_HEADER="ASSIGN_DOCUMENTS_HEADER" :TABLE_BODY="asignados" row-id="idTipoDoc" />
      </div>
    </q-card>
    <Modal v-model="showModal" title="Asignación exitosa"
      :text="'Se ha asignado con éxito las tipologías documentales a la serie ' + dependencias" is-success
      text-button="¡Ok!" @handleAccept="handleModal" />
    <Modal v-model="errorModal" title="Error" text="Ha ocurrido un error" :is-success="false" text-button="¡Ok!"
      @handleAccept="errorModal = false" />

  </div>
</template>
<script lang="ts" setup>
import BreadCrumbs from 'components/BreadCrumbs/BreadCrumbs.vue';
import Modal from 'components/Modal/Modal.vue';
import Table from 'components/Table.vue';
import { sgdeaAxios } from 'src/services';
import { Ref, onMounted, ref } from 'vue';

import {
  ASSIGN_DOCUMENTS_HEADER,
  DOCUMENTAL_HEADER,
  routes
} from ".";
import { AsignacionTiplogia, Tipología } from 'src/interfaces';
import { useLoadingStore } from 'src/stores/loading.store';

const showModal = ref(false)
const buscarTipologia = ref('')
const item = ref([]);
const errorModal = ref(false)
const optionsFondos = ref([])
const optionsDependenciasBack = ref([])
const responses = ref({
  fondos: [],
  versiones: [],
  dependencias: [],
  series: [],
  subseries: []
})

const disponiblesTable = ref(0)
const selectedTable = ref(0)
const disponiblesBackup: Ref<Tipología[]> = ref([])
const disponibles: Ref<Tipología[]> = ref([])
const asignados: Ref<any[]> = ref([])

const filtro = ref({
  dependencia: "",
  serie: "",
  subserie: "",
  fondo: "",
  version: ""
})

const subseries = ref([])
const series = ref([])
const seriesOptions = ref([])
const subseriesOptions = ref([])
const versionesBack = ref([])
const versiones = ref([])
const dependencias = ref("")
const optionsDependenciasBackup = ref([])

const getAllData = async () => {
  const { data: fondos } = await sgdeaAxios.get("/fondo/FondosActivos")

  const { data: versiones } = await sgdeaAxios.get("/versiontrd/list")

  const { data: dependencias } = await sgdeaAxios.get("/seccionSubSeccion");

  const { data: series } = await sgdeaAxios.get("/serie/allSerie")

  const { data: subseries } = await sgdeaAxios.get("/serie/allSubSerie")

  responses.value = {
    fondos,
    versiones,
    dependencias,
    series,
    subseries,
  };
}

const assignAllData = async () => {
  optionsFondos.value = responses.value.fondos.map(it => ({ label: `${it.idFondo} ${it.nombre}`, value: it.idFondo }))

  versionesBack.value = responses.value.versiones
    .map((item: any) => ({ label: `${item.nombreVersion}`, value: item.id, fondo: item.id_fondo }));

  optionsDependenciasBackup.value = responses.value.dependencias?.map((item: any) => ({
    label: item.nombre,
    value: item.idSeccionSubSeccion,
    version: item.idversiontrd?.id ?? null
  }))

  series.value = responses.value.series?.filter((item: any) => item.idDependencia !== null)
    .map((item: any) => ({
      cod_dependencia: item.seccionSubSeccion.idSeccionSubSeccion,
      cod_serie: item.idSeriesubserie,
      nombre_serie: item.descripcion
    }))

  subseries.value = responses.value.subseries?.map((item: any) => ({
    cod_serie: item?.padre?.idSeriesubserie ?? null,
    cod_subserie: item.idSeriesubserie,
    nombre_subserie: item.descripcion
  }))
}

const getTipologia = async (id: number) => {

  const { data } = await sgdeaAxios.get<AsignacionTiplogia>(`/tiposdocumentales/asignacion/serie/tipos_documentales?serie=${id}`)
  disponiblesBackup.value = data.tiposDocumentalesDisponibles.flat()
  asignados.value = data.tiposDocumentalesAsociados.map((x) => ({
    estados: x.tipologiaDocumental.estado,
    nombre: x.tipologiaDocumental.nombre,
    idTipologiaDocumental: x.tipologiaDocumental.idTipologiaDocumental,
  })).flat();

  disponibles.value = disponiblesBackup.value;

}

onMounted(async () => {
  await getAllData();
  await assignAllData();
})

const onChangeDependencia = async (e: any) => {
  //@ts-ignore
  seriesOptions.value = series.value.filter((item: any) => item.cod_dependencia == e.value)
    .filter((item: any) => !isNaN(parseInt(item.cod_serie)))
    .map((item: any) => ({ label: `${item.cod_serie} ${item.nombre_serie}`, value: parseInt(item.cod_serie) }))
}

const onChangeSerie = async (e: any) => {
  //@ts-ignore
  subseriesOptions.value = subseries.value
    .filter((item: any) => item.cod_serie == e.value)
    .map((item: any) => ({ label: `${item.cod_subserie} ${item.nombre_subserie}`, value: parseInt(item.cod_subserie) }))

  await getTipologia(e.value);
};


const onChangeSubserie = async (val: any) => {
  await getTipologia(val);
}

const onChangeFondo = async (e: Object) => {
  //@ts-ignore
  versiones.value = versionesBack.value.filter((item) => item.fondo == e.value)
}

const onChangeVersion = async (e: any) => {
  optionsDependenciasBack.value = optionsDependenciasBackup.value.filter((item: any) => item.version == e.value)
};

const findByName = () => {
  disponibles.value = disponiblesBackup.value.filter(item => item.nombre.toLowerCase().includes(buscarTipologia.value))
}

const handleModal = () => {
  item.value = []
  showModal.value = false
}

const onClean = async () => {
  filtro.value = {
    dependencia: "",
    serie: "",
    subserie: "",
    fondo: "",
    version: ""
  }

  disponiblesTable.value++
  asignados.value = []
  disponibles.value = []

  seriesOptions.value = []
  subseriesOptions.value = []
  versiones.value = []
  optionsDependenciasBack.value = []
}

const handleAssign = async () => {

  for (let index = 0; index < item?.value?.length; index++) {
    const formData = new FormData();
    //@ts-ignore
    formData.append("serieSubserie", filtro.value.serie.value);
    formData.append("tipoDocumentalId", item.value[index].idTipologiaDocumental);

    const resp = await sgdeaAxios.post("/tiposdocumentales/asignacion/asignar", formData)

    //@ts-ignore
    dependencias.value = filtro.value.subserie?.value ?? filtro.value.serie.value

    if ([405, 401, 404, 400, 403, 500].includes(resp?.status)) {
      errorModal.value = true;
      return;
    }
  }
  //@ts-ignore
  getTipologia(filtro.value.serie.value)

  showModal.value = true;
}

</script>
<style lang="scss">
.step_circle {
  width: 70px;
  height: 70px;
  border-radius: 100%;
  padding: 10px;
}

.resize-width {
  width: min(300px, 75%);
}
</style>
