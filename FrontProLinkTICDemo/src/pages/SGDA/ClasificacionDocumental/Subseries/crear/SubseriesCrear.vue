<template>
  <div>
    <BreadCrumbs :crumbs="routes" />

    <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold">
      Crear Subserie Documental
    </div>

    <q-card class="tw-rounded-lg tw-p-7" flat style="height: 800px">

      <p class="tw-text-2xl tw-font-bold">Subserie Documental</p>

      <q-form ref="createForm" class="tw-mt-6 tw-h-full" @submit="createSubserie">

        <div class="tw-flex tw-full q-col-gutter-md tw-mb-4">
          <div class="tw-w-1/2">
            <span class="tw-text-label">Fondo *</span>
            <q-select outlined v-model="subserie.fondo" :rules="[inputRequired]" :options="fondoptions" label="Seleccione"
              @update:model-value="(val) => onChangeFondo(val)" dense />
          </div>
          <div class="tw-w-1/2">
            <span class="tw-text-label">Versión *</span>
            <q-select dense outlined v-model="subserie.version" :rules="[inputRequired]" :options="versiones"
              label="Seleccione" @update:model-value="(val) => onChangeVersion(val)" />
          </div>
        </div>
        <div class="tw-flex tw-full q-col-gutter-md">
          <div class="tw-w-1/2">
            <p class="tw-text-label">Dependencia*</p>
            <SearchInput v-model:input-data-prop="subserie.dependecia" label="Seleccione" :options="optionsDependencias"
              dense :rules="[rulesValidation]" outlined class="tw-rounded-lg" maxlength="50"
              @update:model-value="(val) => onChangeSerie(val)" />
          </div>
          <div class="tw-w-1/2">
            <p class="tw-text-label">Serie documental*</p>
            <SearchInput outlined v-model:input-data-prop="subserie.id_padre" :options="serieOptions" dense
              :rules="[rulesValidation]" label="Buscar" emit-value map-options />
          </div>
        </div>
        <div class="tw-flex tw-full q-col-gutter-md">
          <div class="tw-w-1/2 tw-mt-3">
            <p class="tw-text-label">Código Subserie documental*</p>
            <q-input outlined v-model="subserie.codigo" label="Inserte" dense required
              :rules="[v => lengthInput(250, v), rulesValidation]" />
          </div>
          <div class="tw-w-1/2 tw-mt-3">
            <p class="tw-text-label">Nombre Subserie documental*</p>
            <q-input outlined v-model="subserie.descripcion" label="Inserte" dense required
              :rules="[v => lengthInput(250, v), rulesValidation, alphanumeric]" />
          </div>
        </div>
        <div class="tw-flex tw-full q-col-gutter-md">
          <div class="tw-w-1/2">
            <p class="tw-text-label">Tiempo archivo de gestión*</p>
            <q-input outlined v-model="subserie.tiempoGestion" label="Inserte" dense type="number" :rules="[v => v > 0]">
            </q-input>
          </div>
          <div class="tw-w-1/2">
            <p class="tw-text-label">Tiempo archivo de central*</p>
            <q-input outlined v-model="subserie.tiempoCentral" label="Inserte" dense type="number" :rules="[v => v > 0]">
            </q-input>
          </div>
        </div>



        <div class="tw-flex tw-full q-col-gutter-md">
          <div class="tw-w-1/2">
            <p class="tw-text-label">Soporte*</p>
            <q-select outlined v-model="subserie.soporte"
              :options="[{ label: 'Físico', value: 1 }, { label: 'Electrónico', value: 2 }]" label="Seleccione" required
              dense map-options emit-value :rules="[rulesValidation]" />
          </div>
          <div class="tw-w-1/2">
            <p class="tw-text-label">Disposición final*</p>
            <q-select outlined v-model="subserie.disposicionFinal" :options="[
              { label: 'CT - Conservación total', value: '1' },
              { label: 'E -  Eliminación', value: '2' },
              { label: 'MT - Medio Técnico', value: '3' },
              { label: 'S - Selección', value: '4' }]" label="Seleccione" dense map-options emit-value
              :rules="[rulesValidation]" />
          </div>
        </div>

        <div class="tw-w-full tw-mt-5">
          <p class="tw-text-label">Procedimiento*</p>
          <q-input outlined v-model="subserie.procedimiento" :label="subserie.procedimiento ? '' : 'Inserte'"
            class="tw-h-[150px]" type="textarea" dense required :rules="[rulesValidation, v => lengthInput(2000, v)]" />
        </div>

        <div class="container-buttons  q-gutter-x-md">
          <q-btn label="Cancelar" type="reset" style="width: 240px;" class="tw-rounded-xl" color="accent"
            text-color="black" @click="resetForm" />
          <q-btn label="Crear" type="submit" text-color="white" style="width: 240px;" class="tw-rounded-xl tw-p-2"
            color="secondary" />
        </div>
      </q-form>
    </q-card>

    <Modal v-model="confirmModal" title="¡Espera un momento!" :is-success="false" text-button="Si" text-button-cancel="No"
      @handleAccept="() => $router.push('/SGDA/subseries')" cancel-button text="¿Está seguro de abandonar la creación
de la subserie documental en curso?" @close-modal="() => confirmModal = false" />
    <Modal v-model="showModal" title="Creación exitosa"
      :text="`Se ha creado con éxito ${subserie.codigo} ${subserie.descripcion}.`" is-success text-button="¡Ok!"
      @handleAccept="handleModal" />
    <Modal v-model="errorModal" title="Error" text="¡Ha ocurrido un error!" :is-success="false" text-button="Aceptar"
      @handleAccept="handleModal" />
    <Modal v-model="errorModalExist" title="Error" text="Ya existe una SubSerie con esta información." :is-success="false"
      text-button="Aceptar" @handleAccept="handleModal" />
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { Ref, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { sgdeaAxios } from "src/services";
import moment from "moment";
import BreadCrumbs from 'components/BreadCrumbs/BreadCrumbs.vue';
import Modal from 'components/Modal/Modal.vue';
import { alphanumeric, inputRequired, lengthInput, validateNoDecimal, validateNumber } from "src/helpers/validations";
import SearchInput from 'src/components/SearchInput/SearchInput.vue';
import { useDependencias } from "src/composables/useEntidades";
import { Dependencia, Fondo, Serie, VersionTRD } from 'src/interfaces';
import { useLoadingStore } from 'src/stores/loading.store';

interface Subserie {
  codigo: string;
  id_seriesubserie: string;
  fecha_vigencia_inicial: Date | string;
  fecha_vigencia_final: Date | string;
  descripcion: string;
  tiempoGestion: number;
  tiempoCentral: number;
  soporte: string;
  disposicionFinal: string;
  estados: boolean | string;
  procedimiento: string;
  observacion: string;
  id_padre?: string;
  dependecia: number;
  fondo: string | number;
  version: string | number;
}

const router = useRouter()
const fondoptions: Ref<{ label: string; value: string | number | boolean }[]> = ref([])
const versiones: Ref<{ label: string; value: string | number | boolean }[]> = ref([])
const versionesBack: Ref<{ label: string; value: string | number | boolean }[]> = ref([])
const optionsDependencias: Ref<{ label: string; value: string | number | boolean }[]> = ref([])
const optionsDependenciasBack: Ref<{ label: string; value: string | number | boolean }[]> = ref([])
const showModal = ref(false);
const errorModal = ref(false);
const errorModalExist = ref(false);
const createForm = ref();
const confirmModal = ref(false)
const serieOptions = ref([]);
const series = ref([])
const codigosOptions = ref([])
const disposicionOptions = ref([{ label: 'CT - Conservación total', value: '1' },
{ label: 'E -  Eliminación', value: '2' },
{ label: 'MT - Medio Técnico', value: '3' },
{ label: 'S - Selección', value: '4' }])

const subserie: Ref<Subserie> = ref({
  codigo: '',
  id_seriesubserie: '',
  fecha_vigencia_inicial: moment(new Date()).format("YYYY-MM-DD"),
  fecha_vigencia_final: moment(new Date()).format("YYYY-MM-DD"),
  descripcion: '',
  tiempoGestion: '',
  tiempoCentral: '',
  soporte: '',
  disposicionFinal: null,
  estados: true,
  procedimiento: '',
  observacion: '',
  id_padre: '',
  dependecia: '',
  fondo: '',
  version: '',
});

const getData = async () => {
  const { data: dependencias } = await sgdeaAxios.get<Dependencia[]>('/seccionSubSeccion');
  const { data: fondos } = await sgdeaAxios.get<Fondo[]>('/fondo/FondosActivos');
  const { data: versiones } = await sgdeaAxios.get<VersionTRD[]>('/versiontrd/list');
  const { data: series } = await sgdeaAxios.get<Serie[]>('/serie/allSerie')

  assignData(dependencias, fondos, versiones, series)
}

const assignData = (dependencias: Dependencia[], fondos: Fondo[], versiones: VersionTRD[], series: Serie[]) => {
  optionsDependenciasBack.value = dependencias.map(dependencia => ({ label: dependencia.nombre, value: dependencia.idSeccionSubSeccion, version: dependencia.idversiontrd?.id ?? 0 }));

  fondoptions.value = fondos.map(fondo => ({
    label: fondo.nombre,
    value: fondo.idFondo
  }))

  versionesBack.value = versiones.map(version => ({ label: version.nombreVersion, value: version.id, fondo: version.id_fondo }))

  codigosOptions.value = series.map((item: any) => ({ label: `${item.idSeriesubserie} ${item.descripcion}`, value: item.idSeriesubserie }))
}

onMounted(async () => await getData())

const createSubserie = async () => {

  if (await createForm.value.validate()) {

    const response = await sgdeaAxios.post("/subSeries/serie", {
      codigo: String(subserie.value.codigo),
      descripcion: subserie.value.descripcion,
      estado: subserie.value.estados,
      fechaVigenciaInicial: moment(subserie.value.fecha_vigencia_inicial).format("YYYY-MM-DD"),
      fechaVigenciaFinal: moment(subserie.value.fecha_vigencia_final).format("YYYY-MM-DD"),
      observacion: subserie.value.observacion,
      procedimiento: subserie.value.procedimiento,
      //@ts-ignore
      tiempo_central: parseInt(subserie.value.tiempoCentral),
      //@ts-ignore
      tiempo_gestion: parseInt(subserie.value.tiempoGestion),
      tipoSoporte: subserie.value.soporte,
      //@ts-ignore
      idpadre: parseInt(subserie.value.id_padre),
      idseriesubserie: 0,
      //@ts-ignore
      idseccionSubSeccion: subserie.value.dependecia.value,
      ct: subserie.value.disposicionFinal.includes('1'),
      e: subserie.value.disposicionFinal.includes('2'),
      md: subserie.value.disposicionFinal.includes('3'),
      s: subserie.value.disposicionFinal.includes('4')
    })

    if ([405, 401, 404, 400, 403, 500].includes(response.status)) {
      errorModal.value = true
    } else if ([200, 201].includes(response.status)) {
      showModal.value = true
    } else if ([204].includes(response.status)) {
      errorModalExist.value = true
    }
  }
}


const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return 'Este campo es requerido'
  }
}

function testNumber(string: string) {
  let regex = /^\d+$/;
  if (!regex.test(string) || !string) {
    return 'Ingrese los datos correctos. Solo numeros'
  }
}


const resetForm = () => {
  subserie.value = ({
    codigo: '',
    id_seriesubserie: '',
    fecha_vigencia_inicial: '',
    fecha_vigencia_final: '',
    descripcion: '',
    tiempoGestion: 0,
    tiempoCentral: 0,
    soporte: '',
    disposicionFinal: '',
    estados: '',
    procedimiento: '',
    observacion: '',
  });

  confirmModal.value = true
}

const onChangeSerie = async (e: Object) => {
  const {data: getSeries} = await sgdeaAxios.get(`/serie/allSerie`);
  //@ts-ignore
  serieOptions.value = getSeries.filter((item: any) => item.seccionSubSeccion.idSeccionSubSeccion == e.value)
    .map((item: any) => (
      {
        label: `${item.descripcion}`,
        value: parseInt(item.idSeriesubserie)
      }))
}

const routes = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'Módulo SGDEA',
    to: '/'
  },
  {
    name: 'Clasificación documental',
    to: '/'
  },
  {
    name: 'Subseries',
    to: '/SGDA/subseries'
  },
  {
    name: 'Crear subserie',
  }
]

const handleModal = () => {
  if (showModal.value) {
    showModal.value = false
    errorModalExist.value = false
    router.push('/SGDA/subseries')
  } else {
    errorModal.value = false
    errorModalExist.value = false
  }
}

const onChangeFondo = async (e: Object) => {
  //@ts-ignore
  versiones.value = versionesBack.value.filter((item) => item.fondo == e.value)
}

const onChangeVersion = async (e: object) => {
  //@ts-ignore

  optionsDependencias.value = optionsDependenciasBack.value.filter((item: any) => item.version == e.value)
};

</script>

<style lang="scss">
.container-buttons {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
</style>

