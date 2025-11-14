<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0  ">
      <BreadCrumbs :crumbs="routes" />
      <div class="tw-flex tw-justify-between tw-items-center tw-pt-4 ">

        <h1 class="tw-text-3xl tw-font-bold tw-my-4">Editar Serie Documental</h1>

      </div>
      <q-card class="tw-mt-[20px] tw-rounded-xl q-pa-lg" flat>
        <h3 class="tw-text-2xl tw-font-bold tw-pl-2 tw-pb-6">Serie Documental</h3>
        <q-form ref="formEditar" @submit.prevent="editSerie">
          <div
            class="tw-grid tw-grid-cols-2 tw-gap-5 tw-mb-12 tw-border-b tw-border-b-gray-[#969EAF] [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2">
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
              <span class="tw-text-label">Fondo *</span>
              <q-select outlined v-model="form.fondo" :options="fondoptions" :rules="[inputRequired]" label="Seleccione"
                @update:model-value="(val) => onChangeFondo(val)" dense />

            </div>

            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
              <span class="tw-text-label">Versión *</span>
              <q-select dense outlined v-model="form.version" :options="versiones" :rules="[inputRequired]"
                label="Seleccione" @update:model-value="(val) => onChangeVersion(val)" />

            </div>
            <span class="">
              <label for="code" class="tw-text-label">Dependencia * </label>

              <SearchInput v-model:input-data-prop="form.dependencia" map-options emit-value label="Seleccione"
                :options="optionsDependencias" dense :rules="[inputRequired]" outlined class="tw-rounded-lg"
                maxlength="50" />
            </span>
            <!--            <span class="">-->
            <!--              <label for="code" class="tw-text-label">Serie documental *</label>-->
            <!--              <q-input v-model="form.codigo" label="Inserte" outlined class="mb-3"-->
            <!--                :rules="[inputRequired, val => lengthInput(250, val),]"-->
            <!--                type="number" dense />-->

            <!--            </span>-->
            <span class="">
              <label for="description" class="tw-text-label">Nombre Serie Documental *</label>
              <q-input v-model="form.descripcion" label="Inserte" outlined class="mb-3 "
                :rules="[inputRequired, val => lengthInput(250, val), alphanumeric]" id="description" dense />

            </span>
            <span class="tw-flex">
              <label class="tw-text-label" for="state">Estado</label>
              <div class="tw-flex items-center tw-justify-between">
                <p>{{ form.estados === true ? 'Activo' : 'Inactivo' }}</p>
                <q-toggle v-model="form.estados" :rules="[inputRequired]" color="secondary"></q-toggle>
              </div>

            </span>
            <!--            <span class="">-->
            <!--              <label for="description" class="tw-text-label">¿La serie documental, tiene subserie documental?</label>-->
            <!--              <div class="tw-grid tw-grid-cols-2">-->
            <!--                <q-radio v-model="tieneSubserie" val="S" label="Si" />-->
            <!--                <q-radio v-model="tieneSubserie" val="N" label="No" />-->
            <!--              </div>-->
            <!--            </span>-->
            <template v-if="tieneSubserie == 'N'">
              <!--              <span class="tw-col-span-2">-->
              <!--                <label for="code" class="tw-text-label">Código Subserie documental *</label>-->
              <!--                <q-input v-model="form.codigoSubserie" label="Inserte" filled readonly class="mb-3" type="number" dense-->
              <!--                  :rules="[inputRequired, val => lengthInput(3, val)]" />-->

              <!--              </span>-->
              <span></span>
              <p>Los campos bloqueados se deben modificar en la subserie</p>
              <span></span>
              <span class="">
                <label for="code" class="tw-text-label">Tiempo archivo de gestión *</label>
                <q-input v-model="form.tiempoArchivoGestion" label="Inserte" outlined class="mb-3" type="text" dense
                  :rules="[inputRequired, onlyNumbers, val => lengthInput(5, val)]"
                  :disable="form.tiempoArchivoGestion === 0" />
              </span>
              <span class="">
                <label for="code" class="tw-text-label">Tiempo archivo central *</label>
                <q-input v-model="form.tiempoArchivoCentral" label="Inserte" outlined class="mb-3" type="text" dense
                  :rules="[inputRequired, onlyNumbers, val => lengthInput(5, val)]"
                  :disable="form.tiempoArchivoCentral === 0" />
              </span>
              <span class="">
                <label for="code" class="tw-text-label">Soporte *</label>

                <q-select v-model="form.tipo_de_soporte"
                  :options="[{ label: 'Físico', value: 1 }, { label: 'Electrónico', value: 2 }]" dense outlined
                  class="tw-rounded-lg" maxlength="50" map-options emit-value :disable="form.tipo_de_soporte === 0">

                </q-select>
              </span>
              <span class="">
                <label for="code" class="tw-text-label">Disposición Final *</label>
                <q-select v-model="finalOptions" :options="disposicionOptions" dense outlined class="tw-rounded-lg"
                  maxlength="50" :disable="!finalOptions.length">

                </q-select>

              </span>
              <span class="tw-col-span-2">
                <label for="code" class="tw-text-label">Procedimiento *</label>

                <q-input v-model="form.procedimiento" label="Inserte" outlined class="mb-3" dense
                  :rules="[inputRequired, val => lengthInput(2000, val)]" type="textarea"
                  :disable="form.procedimiento === ''" />

              </span>
            </template>

          </div>

          <div class="row tw-flex tw-justify-center tw-gap-2 [&>*]:tw-p-2">
            <q-btn label="Cancelar" color="accent" textColor="secondary" class="tw-rounded-lg col-2"
              @click="() => backModal = true" />
            <q-btn label="Guardar cambios" type="submit" color="secondary" class="tw-rounded-lg col-2"></q-btn>
          </div>
        </q-form>
      </q-card>
      <Modal v-model="showModal" title="Edición exitosa"
        :text="`La serie documental ${form.codigo} ${form.descripcion}. fue modificada correctamente.`" is-success
        text-button="¡Ok!" @handleAccept="handleModal" />
      <Modal v-model="errorModal" title="Error" text="¡Ha ocurrido un error!" :is-success="false" text-button="Aceptar"
        @handleAccept="handleModal" />
      <Modal v-model="backModal" title="¡Espera un momento!" text="¿Está seguro de abandonar la creación de
la serie documental en curso?" :is-success="false" textButtonCancel="No" cancel-button
        @handleAccept="() => router.push('/SGDA/series')" text-button="Si" @close-modal="() => backModal = false" />
    </main>
  </section>
</template>


<script  lang="ts" setup>
import { onMounted, ref, Ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import moment from "moment";

import {  sgdeaAxios } from "src/services";

import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';
import Modal from 'components/Modal/Modal.vue';
import { IEditarSerie, routes } from "./index";
import { lengthInput, inputRequired, onlyNumbers, alphanumeric } from "src/helpers/validations";
import SearchInput from "src/components/SearchInput/SearchInput.vue";
import { Dependencia, Fondo, SelectInput, Serie, VersionTRD } from "src/interfaces";
import { useLoadingStore } from "src/stores/loading.store";
const route = useRoute()
const router = useRouter()

const formEditar = ref();
const idSerie: Ref<any> = ref({});
const showModal = ref(false)
const errorModal = ref(false)
const backModal = ref(false)
const initDate = ref();
const finishDate = ref()
const optionsDependencias: Ref<SelectInput[]> = ref([])
const optionsDependenciasBackup: Ref<SelectInput[]> = ref([])
const fondoptions: Ref<SelectInput[]> = ref([])
const versiones: Ref<SelectInput[]> = ref([]);
const versionesBack: Ref<SelectInput[]> = ref([]);
const disposicionOptions = ref([{ label: 'CT - Conservación total', value: '1' },
{ label: 'E -  Eliminación', value: '2' },
{ label: 'MT - Medio Técnico', value: '3' },
{ label: 'S - Selección', value: '4' }])
const finalOptions = ref([])

const form: Ref<Serie | any> = ref({
  descripcion: "",
  estados: false,
  fecha_vigencia_inicial: moment(new Date()).format("YYYY-MM-DD"),
  fecha_vigencia_final: moment(new Date()).format("YYYY-MM-DD"),
  dependencia: '',
  tiempoArchivoCentral: null,
  tiempoArchivoGestion: null,
  disposicion: null,
  tipo_de_soporte: null,
  codigo: '',
  procedimiento: "",
  codigoSubserie: '',
  idcc: null,
  observacion: null,
  fondo: "",
  version: "",
});
const tieneSubserie = ref('N')

const editSerie = async () => {

  if (await formEditar.value.validate()) {

    const dispositionOptions = finalOptions.value.map((it) => it.value)
    const response = await sgdeaAxios.put("/serie/serie", {
      codigo: String(form.value.codigo),
      descripcion: form.value.descripcion,
      estado: form.value.estados,
      fechaVigenciaInicial: moment(form.value.fecha_vigencia_inicial).format("YYYY-MM-DD"),
      fechaVigenciaFinal: moment(form.value.fecha_vigencia_final).format("YYYY-MM-DD"),
      idseccionSubSeccion: form.value.dependencia.value ? form.value.dependencia.value : Number(form.value.dependencia),
      idpadre: 0,
      //@ts-ignore
      idseriesubserie: parseInt(route.params.id),
      tipoSoporte: form.value.tipo_de_soporte,
      procedimiento: form.value.procedimiento,
      observacion: form.value.observacion,
      tiempo_central: Number(form.value.tiempoArchivoCentral),
      tiempo_gestion: Number(form.value.tiempoArchivoGestion),
      ct: dispositionOptions.includes('1'),
      e: dispositionOptions.includes('2'),
      md: dispositionOptions.includes('3'),
      s: dispositionOptions.includes('4')
    })

    if ([405, 401, 404, 400, 403, 500].includes(response?.status)) {
      errorModal.value = true
    } else if ([200, 201].includes(response.status)) {
      showModal.value = true
    }
  }
}

const getData = async () => {
  const { data: dependencias } = await sgdeaAxios.get<Dependencia[]>('/seccionSubSeccion');
  const { data: fondos } = await sgdeaAxios.get<Fondo[]>('/fondo/FondosActivos');
  const { data: versiones } = await sgdeaAxios.get<VersionTRD[]>('/versiontrd/list');

  const { data: serie } = await sgdeaAxios.get<Serie>(`/serie/serie/${route.params.id}`);

  assignData(dependencias, fondos, versiones, serie)
}

const assignData = (dependencias: Dependencia[], fondos: Fondo[], versiones: VersionTRD[], serie: Serie) => {
  optionsDependenciasBackup.value = dependencias.map(dependencia => ({ label: dependencia.nombre, value: dependencia.idSeccionSubSeccion, version: dependencia.idversiontrd?.id ?? 0 }));

  fondoptions.value = fondos.map(fondo => ({
    label: fondo.nombre,
    value: fondo.idFondo
  }))

  form.value = serie;

  versionesBack.value = versiones.map(version => ({ label: version.nombreVersion, value: version.id, fondo: version.id_fondo }))

  form.value = {
    ...form.value,
    disposicion: "1"
  }

  form.value.dependencia = optionsDependenciasBackup.value.find(it => it.value === form.value.seccionSubSeccion.idSeccionSubSeccion)
  form.value.fondo = fondoptions.value.find((it) => it.value === form.value.seccionSubSeccion.idversiontrd?.id_fondo)
  form.value.version = versionesBack.value.find(it => it.value === form.value.seccionSubSeccion.idversiontrd?.id)
  onChangeVersion(form.value.version)
}

onMounted(async () => await getData())

const handleModal = () => {
  if (showModal.value) {
    showModal.value = false;
    router.push('/SGDA/series')
  } else {
    errorModal.value = false
  }
}


watch([initDate, finishDate], (newValue) => {
  form.value.fecha_vigencia_inicial = moment(newValue[0]).format("YYYY-MM-DD")
  form.value.fecha_vigencia_final = moment(newValue[1]).format("YYYY-MM-DD")
})


const onChangeFondo = async (e: Object) => {
  //@ts-ignore
  versiones.value = versionesBack.value.filter((item) => item.value == e.value)
}

const onChangeVersion = async (e: object) => {
  //@ts-ignore
  optionsDependencias.value = optionsDependenciasBackup.value.filter((item: any) => item.version == e.value)
};

</script>
