<template>
  <div>
    <BreadCrumbs :crumbs="routes" />

    <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold">
      Editar Subserie Documental
    </div>

    <q-card class="tw-rounded-lg tw-p-7" flat style="height: 890px">

      <p class="tw-text-2xl tw-font-bold">Subserie Documental</p>

      <q-form ref="form" class="tw-mt-6 tw-h-full" @submit="editForm">

        <div class="tw-flex tw-full q-col-gutter-md tw-mb-4">
          <div class="tw-w-1/2">
            <span class="tw-text-label">Fondo *</span>
            <q-select outlined v-model="formEdit.fondo" :rules="[inputRequired]" :options="fondoptions" label="Seleccione"
              @update:model-value="(val) => onChangeFondo(val)" dense />
          </div>
          <div class="tw-w-1/2">
            <span class="tw-text-label">Versión *</span>
            <q-select dense outlined v-model="formEdit.version" :rules="[inputRequired]" :options="versiones"
              label="Seleccione" @update:model-value="(val) => onChangeVersion(val)" />
          </div>
        </div>
        <div class="tw-flex tw-full q-col-gutter-md">
          <div class="tw-w-1/2">
            <p class="tw-text-label tw-font-bold">Dependencia *</p>
            <SearchInput v-model:input-data-prop="formEdit.dependencia" label="Seleccione" :options="optionsDependencias"
              dense :rules="[inputRequired]" outlined class="tw-rounded-lg" maxlength="50"
              @update:model-value="(val) => onChangeSerie(val)" />
          </div>

          <div class="tw-w-1/2">
            <p class="tw-text-label tw-font-bold">Serie documental *</p>
            <SearchInput outlined v-model:input-data-prop="formEdit.codigoSerie" :options="serieOptions" dense
              :rules="[inputRequired]" label="Buscar" />
          </div>

        </div>
        <div class="tw-flex tw-full q-col-gutter-md">
          <div class="tw-w-1/2">
            <p class="tw-text-label tw-font-bold">Código subserie documental *</p>
            <q-input outlined v-model="formEdit.codigoSubserie" label="Inserte" dense
              :rules="[v => lengthInput(250, v), inputRequired]" />
          </div>
          <div class="tw-w-1/2">
            <p class="tw-text-label tw-font-bold">Nombre subserie documental *</p>
            <q-input outlined v-model="formEdit.descripcion" label="Inserte" dense
              :rules="[v => lengthInput(250, v), inputRequired]" />
          </div>
        </div>

        <div class="tw-flex tw-full q-col-gutter-md">
          <div class="tw-w-1/2">
            <p class="tw-text-label tw-font-bold">Tiempo archivo de gestión *</p>

            <q-input outlined v-model="formEdit.tiempoGestion" label="Inserte" type="text" dense
              :rules="[v => lengthInput(5, v), onlyNumbers, inputRequired]">
            </q-input>
          </div>
          <div class="tw-w-1/2">
            <p class="tw-text-label tw-font-bold">Tiempo archivo de central *</p>
            <q-input outlined v-model="formEdit.tiempoCentral" label="Inserte" dense
              :rules="[v => lengthInput(5, v), onlyNumbers, inputRequired]" type="text">
            </q-input>

          </div>
        </div>

        <div class="tw-flex tw-full q-col-gutter-md">
          <div class="tw-w-1/2">
            <p class="tw-text-label tw-font-bold">Soporte *</p>
            <q-select outlined v-model="formEdit.soporte"
              :options="[{ label: 'Fisico', value: 1 }, { label: 'Electronico', value: 2 }]" label="Seleccione" dense
              :rules="[inputRequired]" map-options emit-value />
          </div>
          <div class="tw-w-1/2">
            <p class="tw-text-label tw-font-bold">Disposición final *</p>
            <q-select outlined v-model="formEdit.disposicionFinal" :options="disposicionOptions" map-options emit-value label="Seleccione" dense
              :rules="[inputRequired]" />
          </div>
        </div>

        <div class="tw-w-1/2">
          <p class="tw-text-label tw-font-bold">Estado</p>
          <div class="tw-flex tw-items-center tw-justify-between q-gutter-x-xl">
            <p>{{ formEdit.estados ? 'Activo' : 'Inactivo' }}</p>
            <q-toggle v-model="formEdit.estados" color="primary" />
          </div>

        </div>

        <div class="tw-w-full tw-mt-5">
          <p class="tw-text-label tw-font-bold">Procedimiento*</p>
          <q-input outlined v-model="formEdit.procedimiento" label="Inserte" autogrow type="textarea"
            :rules="[v => lengthInput(200, v), inputRequired]" />
        </div>

        <div class="tw-w-full tw-mt-[10px]">
          <p class="tw-text-label tw-font-bold">Observaciones</p>
          <q-input outlined v-model="formEdit.observacion" label="Inserte" autogrow type="textarea"
            :rules="[v => lengthInput(200, v)]" />
        </div>

        <div class="container-buttons  q-gutter-x-md">
          <q-btn label="Cancelar" type="reset" textColor='secondary' color="accent" style="width: 240px;"
            class="tw-rounded-xl tw-p-3 " @click="() => confirmModal = true" />
          <q-btn label="Editar" text-color="white" color='secondary' type="submit" style="width: 240px;"
            class="tw-rounded-xl tw-p-3" />
        </div>
      </q-form>
    </q-card>
    <Modal v-model="confirmModal" title="¡Espera un momento!" :is-success="false" text-button="Si" text-button-cancel="No"
      @handleAccept="() => $router.push('/SGDA/subseries')" cancel-button
      :text="`¿Está seguro de abandonar la edición de la subserie documental “${formEdit.codigoSubserie} ${formEdit.descripcion}”?`"
      @close-modal="() => confirmModal = false" />
    <Modal v-model="showModal" title="Edición exitosa"
      :text="`Se ha editado con éxito la subserie ${formEdit.codigoSerie?.value ? formEdit.codigoSerie.value : formEdit.codigoSerie} ${formEdit.descripcion}.`"
      is-success text-button="¡Ok!" @handleAccept="handleModal" />
    <Modal v-model="errorModal" title="Error" text="¡Ha ocurrido un error!" :is-success="false" text-button="Aceptar"
      @handleAccept="handleModal" />
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { Ref, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import BreadCrumbs from 'components/BreadCrumbs/BreadCrumbs.vue';
import Modal from 'components/Modal/Modal.vue';
import { sgdeaAxios } from "src/services";
import { lengthInput, inputRequired, validateNumber, validateNoDecimal, onlyNumbers, maxLengthInput } from "src/helpers/validations";
import moment from "moment";
import SearchInput from 'src/components/SearchInput/SearchInput.vue';
import { useDependencias } from 'src/composables/useEntidades';
import { Dependencia, Fondo, SelectInput, Serie, SubserieSerie, VersionTRD } from 'src/interfaces';
import { useLoadingStore } from 'src/stores/loading.store';

const q = useQuasar();
const route = useRoute()
const router = useRouter()
const showModal = ref(false);
const errorModal = ref(false);
const form = ref()
const confirmModal = ref(false)
const { optionsDependencias } = useDependencias()
const serieOptions = ref([]);
const finalOptions = ref([])
const fondoptions: Ref<SelectInput[]> = ref([]);
const versiones: Ref<SelectInput[]> = ref([]);
const optionsDependenciasBack: Ref<SelectInput[]> = ref([])
const versionesBack: Ref<SelectInput[]> = ref([]);
interface FormEdit {
  codigoSerie: string;
  codigoSubserie: string;
  fecha_vigencia_inicial: string;
  fecha_vigencia_final: string;
  descripcion: string;
  tiempoGestion: string | number;
  tiempoCentral: string | number;
  soporte: string | number;
  disposicionFinal: string;
  estados: string | boolean;
  procedimiento: string;
  observacion: string;
  dependencia: string;
  fondo: string | number | SelectInput;
  version: string | number | SelectInput;
}

const id = ref(0);
const formEdit: Ref<FormEdit> = ref({
  codigoSerie: "",
  codigoSubserie: "",
  fecha_vigencia_inicial: "",
  fecha_vigencia_final: "",
  descripcion: "",
  tiempoGestion: "",
  tiempoCentral: "",
  soporte: "",
  disposicionFinal: "",
  estados: '',
  procedimiento: "",
  observacion: "",
  dependencia: "",
  fondo: '',
  version: '',
})
const disposicionOptions = ref([{ label: 'CT - Conservación total', value: '1' },
{ label: 'E -  Eliminación', value: '2' },
{ label: 'MT - Medio Técnico', value: '3' },
{ label: 'S - Selección', value: '4' }])

const getData = async () => {
  const { data: dependencias } = await sgdeaAxios.get<Dependencia[]>('/seccionSubSeccion');
  const { data: fondos } = await sgdeaAxios.get<Fondo[]>('/fondo/FondosActivos');
  const { data: versiones } = await sgdeaAxios.get<VersionTRD[]>('/versiontrd/list');
  const { data: series } = await sgdeaAxios.get<Serie[]>('/serie/allSerie');
  const { data: subserie } = await sgdeaAxios.get<SubserieSerie>(`/serie/serie/${route.params.id}`);

  assignData(dependencias, fondos, versiones, subserie, series)
}

const assignData = (dependencias: Dependencia[], fondos: Fondo[], versiones: VersionTRD[], subserie: SubserieSerie, series: Serie[]) => {
  let disposiciones = '';
  optionsDependenciasBack.value = dependencias.map(dependencia => ({ label: dependencia.nombre, value: dependencia.idSeccionSubSeccion, version: dependencia.idversiontrd?.id ?? 0 }));

  fondoptions.value = fondos.map(fondo => ({
    label: fondo.nombre,
    value: fondo.idFondo
  }))

  versionesBack.value = versiones.map(version => ({ label: version.nombreVersion, value: version.id, fondo: version.id_fondo }))

  id.value = subserie.idSeriesubserie;

  if(subserie.ct) disposiciones = '1';
  if(subserie.e) disposiciones = '2';
  if(subserie.md) disposiciones = '3';
  if(subserie.s) disposiciones = '4';

  formEdit.value = {
    codigoSubserie: subserie.codigo,
    descripcion: subserie.descripcion,
    tiempoGestion: subserie.tiempoArchivoGestion,
    tiempoCentral: subserie.tiempoArchivoCentral,
    soporte: subserie.tipo_de_soporte,
    estados: subserie.estados,
    dependencia: optionsDependencias.value.find((item) => item.value == subserie.seccionSubSeccion.idSeccionSubSeccion),
    fondo: fondoptions.value.find((it) => it.value === subserie.seccionSubSeccion.idversiontrd?.id_fondo),
    procedimiento: subserie.procedimiento,
    observacion: subserie.observacion,
    version: versionesBack.value.find(it => it.value === subserie.seccionSubSeccion.idversiontrd?.id),
    disposicionFinal: disposiciones
  }


  //@ts-ignore
  serieOptions.value = series.filter(item => item.seccionSubSeccion.idSeccionSubSeccion == formEdit.value.dependencia.value)
    .map((item: any) => (
      {
        label: `${item.descripcion}`,
        value: parseInt(item.idSeriesubserie)
      }))

  formEdit.value.codigoSerie = serieOptions.value.find((it) => it.value === subserie.padre.idSeriesubserie)
}

onMounted(async () => await getData());

const onChangeSerie = async (e: Object) => {
  const getSeries = await sgdeaAxios.get(`/serie/allSerie`);
  //@ts-ignore
  serieOptions.value = getSeries.filter((item: any) => item.seccionSubSeccion.idSeccionSubSeccion == e.value)
    .map((item: any) => (
      {
        label: `${item.idSeriesubserie} ${item.descripcion}`,
        value: parseInt(item.idSeriesubserie)
      }))
}

const editForm = async () => {

  if (form.value.validate()) {

    const dispositionOptions = finalOptions.value.map((it) => it.value)
    const response = await sgdeaAxios.put("/serie/serie", {
      //@ts-ignore
      codigo: formEdit.value.codigoSubserie?.value ? String(formEdit.value.codigoSubserie?.value) : String(formEdit.value.codigoSubserie),
      descripcion: formEdit.value.descripcion,
      estado: formEdit.value.estados,
      fechaVigenciaFinal: moment(formEdit.value.fecha_vigencia_final).format("YYYY-MM-DD") !== "Invalid date" ? moment(formEdit.value.fecha_vigencia_final).format("YYYY-MM-DD") : null,
      fechaVigenciaInicial: moment(formEdit.value.fecha_vigencia_inicial).format("YYYY-MM-DD") !== "Invalid date" ? moment(formEdit.value.fecha_vigencia_inicial).format("YYYY-MM-DD") : null,
      //@ts-ignore
      idpadre: formEdit.value.codigoSerie?.value ?
      //@ts-ignore
        formEdit.value.codigoSerie?.value : formEdit.value.codigoSerie,
      //@ts-ignore
      idseriesubserie: id.value,
      observacion: formEdit.value.observacion,
      procedimiento: formEdit.value.procedimiento,
      tipoSoporte: formEdit.value.soporte,
      tiempo_central: parseInt(formEdit.value.tiempoCentral as string),
      tiempo_gestion: parseInt(formEdit.value.tiempoGestion as string),
      //@ts-ignore
      idseccionSubSeccion: parseInt(formEdit.value.dependencia?.value),
      ct: dispositionOptions.includes('1'),
      e: dispositionOptions.includes('2'),
      md: dispositionOptions.includes('3'),
      s: dispositionOptions.includes('4')
    })


    if ([405, 401, 404, 400, 403, 500].includes(response.response?.status)) {
      errorModal.value = true
    } else if ([200, 201].includes(response.status)) {
      showModal.value = true
    }
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
    name: 'Subseries',
    to: '/SGDA/subseries'
  },
  {
    name: 'Editar subserie',
  }
]

const handleModal = () => {
  if (showModal.value) {
    showModal.value = false;
    router.push('/SGDA/subseries')
  } else {
    errorModal.value = false
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
  margin-top: 30px;
}
</style>

