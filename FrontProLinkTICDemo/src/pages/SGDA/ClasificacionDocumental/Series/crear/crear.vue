<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0  ">
      <BreadCrumbs :crumbs="routes" />
      <div class="tw-flex tw-justify-between tw-items-center tw-pt-4 ">

        <h1 class="tw-text-3xl tw-font-bold tw-my-4">Crear Serie Documental</h1>

      </div>
      <q-card class="tw-mt-[20px] tw-rounded-xl q-pa-lg" flat>
        <h3 class="tw-text-2xl tw-font-bold tw-pl-2 tw-pb-6">Serie Documental</h3>
        <q-form ref="createForm" @submit.prevent="createSerie">
          <div
            class="tw-grid tw-grid-cols-2 tw-gap-5 tw-mb-12 tw-border-b tw-border-b-gray-[#969EAF] [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2">
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
              <span class="tw-text-label">Fondo *</span>
              <q-select outlined v-model="form.fondo" :options="fondoptions" label="Seleccione" @update:model-value="(val) => onChangeFondo(val)" :rules="[inputRequired]"
                dense />

            </div>

            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
              <span class="tw-text-label">Versión *</span>
              <q-select dense outlined v-model="form.version" :options="versiones" label="Seleccione" @update:model-value="(val) => onChangeVersion(val)" :rules="[inputRequired]"/>

            </div>
            <span class="">
              <label for="code" class="tw-text-label">Dependencia * </label>

              <SearchInput v-model:input-data-prop="form.dependencia" label="Seleccione" :options="optionsDependencias" dense :rules="[inputRequired]" outlined class="tw-rounded-lg" maxlength="50"/>

            </span>
            <span class="">
              <label for="code" class="tw-text-label">Código Serie documental *</label>
              <q-input v-model="form.codigo" label="Inserte" outlined class="mb-3"
                :rules="[inputRequired, val => lengthInput(250, val)]"
               dense />

            </span>
            <span class="">
              <label for="description" class="tw-text-label">Nombre Serie Documental *</label>
              <q-input v-model="form.descripcion" label="Inserte" outlined class="mb-3 "
                :rules="[inputRequired, val => lengthInput(250, val), alphanumeric]" id="description" dense />

            </span>

            <span class="">
              <label for="description" class="tw-text-label">¿La serie documental, tiene subserie documental?</label>
              <div class="tw-grid tw-grid-cols-2">
                <q-radio v-model="tieneSubserie" val="S" label="Si" />
                <q-radio v-model="tieneSubserie" val="N" label="No" />
              </div>
            </span>

            <template v-if="tieneSubserie == 'N'">
              <!--              <span class="tw-col-span-2">-->
              <!--                <label for="code" class="tw-text-label">Código Subserie documental *</label>-->
              <!--                <q-input v-model="form.codigoSubserie" label="Inserte" filled readonly class="mb-3" type="number" dense-->
              <!--                  :rules="[inputRequiredSerie, val => lengthInput(3, val)]" />-->

              <!--              </span>-->
              <span class="">
                <label for="code" class="tw-text-label">Tiempo archivo de gestión *</label>
                <q-input v-model="form.tiempoArchivoGestion" label="Inserte" outlined class="mb-3" type="text" dense
                  :rules="[inputRequired, onlyNumbers, val => lengthInput(5, val)]" />
              </span>
              <span class="">
                <label for="code" class="tw-text-label">Tiempo archivo central *</label>
                <q-input v-model="form.tiempoArchivoCentral" label="Inserte" outlined class="mb-3" type="text" dense
                  :rules="[inputRequired, onlyNumbers, val => lengthInput(5, val)]" />
              </span>
              <span class="">
                <label for="code" class="tw-text-label">Soporte *</label>

                <q-select v-model="form.soporte" label="Seleccione"
                  :options="[{ label: 'Fisico', value: 1 }, { label: 'Electronico', value: 2 }]" dense map-options
                  emit-value outlined class="tw-rounded-lg" maxlength="50">

                </q-select>
              </span>
              <span class="">
                <label for="code" class="tw-text-label">Disposición Final *</label>

                <q-select v-model="form.disposicion" label="Seleccione" :options="[
                  { label: 'CT - Conservación total', value: '1' },
                  { label: 'E -  Eliminación', value: '2' },
                  { label: 'MT - Medio Técnico', value: '3' },
                  { label: 'S - Selección', value: '4' }]"
                  dense outlined class="tw-rounded-lg"
                          map-options emit-value
                  >

                </q-select>
              </span>

              <span class="tw-col-span-2">
                <label for="code" class="tw-text-label">Procedimiento *</label>

                <q-input v-model="form.procedimiento" label="Inserte" outlined class="mb-3" dense
                  :rules="[inputRequired, val => lengthInput(2000, val)]" type="textarea" />

              </span>
            </template>


          </div>

          <div class="row tw-flex tw-justify-center tw-gap-2 [&>*]:tw-p-2">
            <q-btn label="Cancelar" color="accent" textColor="secondary" class="tw-rounded-lg col-2"
              @click="() => backModal = true" />
            <q-btn label="Crear" type="submit" color="secondary" class="tw-rounded-lg col-2"></q-btn>
          </div>
        </q-form>
      </q-card>
      <Modal v-model="showModal" title="Creación exitosa"
        :text="`Se ha creado con éxito ${form.codigo} ${form.descripcion}. \n \n
Nota: Si la “serie documental” cuenta con una subserie dar clic en el botón “Ir a módulo subserie” para realizar la configuración correspondiente.`" is-success
        text-button="¡Ok!" @handleAccept="handleModal"
        :textButtonCancel="tieneSubserie !== 'N' &&'Ir a módulo subserie'" :cancel-button="tieneSubserie !== 'N'" @closeModal="() => router.push('/SGDA/subseries')"/>
      <Modal v-model="errorModal" title="Error" text="¡Ha ocurrido un error!" :is-success="false" text-button="Aceptar"
        @handleAccept="handleModal" />

        <Modal v-model="backModal" title="¡Espera un momento!" text="¿Está seguro de abandonar la creación de la serie documental en curso?" :is-success="false" textButtonCancel="No" cancel-button
        @handleAccept="() => router.push('/SGDA/series')" text-button="Si" @close-modal="() => backModal = false" />
        <Modal v-model="errorModal" title="Error" text="¡Ha ocurrido un error!" :is-success="false" text-button="Aceptar"
        @handleAccept="handleModal" />
    </main>
  </section>
</template>


<script  lang="ts" setup>
import { onMounted, ref, Ref } from "vue";
import { sgdeaAxios } from 'src/services';

import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';
import { routes } from "./index"
import { useRoute, useRouter } from "vue-router";
import Modal from 'components/Modal/Modal.vue';
import moment from "moment";
import { useDependencias } from "src/composables/useEntidades";
import { alphanumeric, inputRequired, onlyNumbers, lengthInput } from "src/helpers/validations";
import SearchInput from "src/components/SearchInput/SearchInput.vue";
import { Dependencia, Fondo, SelectInput, VersionTRD } from "src/interfaces";
import { useLoadingStore } from "src/stores/loading.store";

const route = useRoute()
const router = useRouter()
const showModal = ref(false)
const errorModal = ref(false)
const backModal = ref(false)
const fondoptions: Ref<SelectInput[]> = ref([])
const tieneSubserie = ref('')
const versiones: Ref<SelectInput[]> = ref([])
const versionesBack: Ref<SelectInput[]> = ref([])
const optionsDependenciasBack: Ref<SelectInput[]> = ref([])

const form = ref({
  descripcion: "",
  fecha_vigencia_inicial: moment(new Date()).format("YYYY-MM-DD"),
  fecha_vigencia_final: moment(new Date()).format("YYYY-MM-DD"),
  dependencia: '',
  tiempoArchivoCentral: null,
  tiempoArchivoGestion: null,
  disposicion: null,
  soporte: '',
  codigo: '',
  procedimiento: '',
  codigoSubserie: '',
  observacion: null,
  version: "",
  fondo: "",
});
const createForm = ref()
const optionsDependencias = ref([])

const getData = async () => {
  const { data: dependencias } = await sgdeaAxios.get<Dependencia[]>('/seccionSubSeccion');
  const { data: fondos } = await sgdeaAxios.get<Fondo[]>('/fondo/FondosActivos');
  const { data: versiones } = await sgdeaAxios.get<VersionTRD[]>('/versiontrd/list');

  assignData(dependencias, fondos, versiones)
}

const assignData = (dependencias: Dependencia[], fondos: Fondo[], versiones: VersionTRD[]) => {
  optionsDependenciasBack.value = dependencias.map(dependencia => ({ label: dependencia.nombre, value: dependencia.idSeccionSubSeccion, version: dependencia.idversiontrd?.id ?? 0 }));

  fondoptions.value = fondos.map(fondo => ({
    label: fondo.nombre,
    value: fondo.idFondo
  }))

  versionesBack.value = versiones.map(version => ({label: version.nombreVersion, value: version.id, fondo: version.id_fondo}))
}

onMounted(async () => await getData())

const createSerie = async () => {
  if (await createForm.value.validate()) {

    const response = await sgdeaAxios.post<boolean>("/serie/serie", {
      codigo: String(form.value.codigo),
      descripcion: form.value.descripcion,
      estado: true,
      fechaVigenciaInicial: moment(form.value.fecha_vigencia_inicial).format("YYYY-MM-DD"),
      fechaVigenciaFinal: moment(form.value.fecha_vigencia_final).format("YYYY-MM-DD"),
      idseccionSubSeccion: Number(form.value.dependencia.value),
      idpadre: 0,
      tipoSoporte: form.value.soporte === "" ? 0 : form.value.soporte,
      procedimiento: form.value.procedimiento,
      tiempo_central: Number(form.value.tiempoArchivoCentral),
      tiempo_gestion: Number(form.value.tiempoArchivoGestion),
      observacion: form.value.observacion,
      ct: form.value.disposicion ? form.value.disposicion.includes('1') : false,
      e: form.value.disposicion ?form.value.disposicion?.includes('2') : false,
      md: form.value.disposicion ?form.value.disposicion?.includes('3') : false,
      s: form.value.disposicion ? form.value.disposicion?.includes('4') : false,
      idseriesubserie: 0,
    })

    if ([204,405, 401, 404, 400, 403, 500].includes(response?.status)) {
      errorModal.value = true
    } else if ([200, 201].includes(response.status)) {
      showModal.value = true
    }
  }
}


const handleModal = () => {
  if (showModal.value) {
    showModal.value = false
    router.push('/SGDA/series')
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
  optionsDependencias.value = optionsDependenciasBack.value.filter(it => it.version === e.value)

};

</script>
