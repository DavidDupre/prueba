<template>
  <div>
    <BreadCrumbs :crumbs="routes" />

    <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold">
      Crear Dependencia
    </div>

    <q-card class="tw-rounded-lg tw-p-7" flat>
      <q-form ref="CotizacionesForm" class="tw-mt-6 tw-h-full" @submit="crearHandler">
        <div class="tw-flex tw-full q-col-gutter-md">

          <!-- <div class="tw-w-1/3">
            <span class="tw-text-label">Fondo *</span>
            <q-select outlined v-model="filtersSearch.fondo" :options="fondoptions" :rules="[inputRequired]"
                      @update:model-value="(val) => onChangeFondo(val)" label="Seleccione" dense />

          </div> -->

          <div class="tw-w-full">
            <span class="tw-text-label">Versión *</span>
            <q-select dense outlined :options="versionesBackup" v-model="filtersSearch.version" :rules="[inputRequired]"
              map-options emit-value label="Seleccione" @update:model-value="(val) => onChangeVersion(val)" />

          </div>

        </div>

        <div class="tw-w-full ">
          <p class="tw-text-label">Código dependencia</p>
          <q-input required outlined v-model="filtersSearch.codigoSerie" dense label="Dependencia"
            :rules="[val => inputRequired(val), (val) => maxLengthInput(255, val)]" />

        </div>

        <div class="tw-w-full tw-mt-3">
          <p class="tw-text-label">Nombre dependencia</p>
          <q-input required outlined v-model="filtersSearch.nombreSerie" label="Nombre dependencia" maxlength="50" dense
            :rules="[
              alphanumeric,
              val => inputRequired(val),
            ]" />
        </div>

        <div class="tw-w-full tw-mt-3">
          <p class="tw-text-label">Observaciones</p>
          <q-input outlined v-model="filtersSearch.observacion" type="textarea" label="Observaciones" maxlength="200"
            dense />
        </div>

        <div class="tw-mt-4">
          <p class="tw-text-label">¿Tiene una dependencia padre?</p>
          <q-radio v-model="isDependencia" val="S" label="Si" />
          <q-radio v-model="isDependencia" val="N" label="No" />
        </div>
        <div class="tw-mt-4 tw-w-full" v-if="isDependencia === 'S'">
          <p class="tw-text-label">Dependencia</p>
          <!-- <select-dependencias @handleSelect="selectedSerie" /> -->
          <q-select dense outlined :options="optionsDependencias" v-model="filtersSearch.padre" map-options emit-value
            label="Seleccione" />
        </div>

        <div class="container-buttons  q-gutter-x-md">
          <q-btn label="Cancelar" style="width: 240px; " class="tw-rounded-xl" color="accent" text-color="black"
            @click="showModalCancel = true" />
          <q-btn label="Crear" text-color="white" style="width: 240px;" class="tw-rounded-xl tw-p-2 " color="secondary"
            type="submit" />
        </div>
      </q-form>
    </q-card>

    <Modal v-model="showModal" title="Creación exitosa" @handleAccept="handleModal"
      :text="'La dependencia ' + filtersSearch.codigoSerie + ' ' + filtersSearch.nombreSerie + ' fue creada correctamente.'"
      is-success text-button="¡Ok!" />
    <Modal v-model="errorModal" title="Error" @handleAccept="handleModal" :text="txtErrorModal" text-button="¡Ok!" />

    <Modal v-model="showModalCancel" title="¡Espera un momento!" @handleAccept="cancelar" cancelButton
      @closeModal="showModalCancel = false" :text="'¿Está seguro de abandonar la creación de la dependencia en curso?'"
      text-button="SI" text-button-cancel="NO" />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, Ref, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { alphanumeric, onlyNumbers, inputRequired, maxLengthInput } from 'src/helpers/validations'

import BreadCrumbs from 'components/BreadCrumbs/BreadCrumbs.vue';
import Modal from 'components/Modal/Modal.vue';
import SelectDependencias from "components/SelectDependencias/SelectDependencias.vue";
import { useLoadingStore } from 'src/stores/loading.store';
import { sgdeaAxios } from 'src/services';

interface Dependencia {
  idSeccionSubSeccion: number
  idVersionTrd: number
  nombre: string
  padre: number
  codigo: string
  estado: boolean
  observacion: string
  idNodeAlfresco: string
  idAlfresco: string
}

// idversiontrd, idfondo, idseccionsubseccion autogenerado, padre es seleccionable de otras dependencias NO OBLIGATORIO

interface Filters {
  codigoSerie: string,
  nombreSerie: string,
  estado: boolean,
  padre: string,
  seccion: number,
  version: string;
  observacion: string;
}

const router = useRouter()
const showModal = ref(false)
const showModalCancel = ref(false)
const errorModal = ref(false);
const txtErrorModal = ref("Ha ocurrido un error");
const optionsDependencias = ref([])
const isDependencia = ref('')

const filtersSearch: Ref<Filters> = ref({
  codigoSerie: "",
  nombreSerie: "",
  estado: false,
  padre: null,
  version: "",
  observacion: ""
});

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
    name: 'Dependencias',
    to: '/SGDA/dependecias'
  },
  {
    name: 'Crear dependencia',
  }
]
const opcionDependencia: Ref<string[]> = ref([])
const nombreDependencia: Ref<string[]> = ref([])
const optionsDependenciasBackup = ref([])
const versionesBackup: Ref<{ label: string, value: any, fondo: any }[]> = ref([])

onMounted(async () => {
  versionesBackup.value =
    (await sgdeaAxios('/versiontrd/list')).data.filter((item: any) => item.estado !== 56).map((item: any) =>
      ({ label: `${item.nombreVersion}`, value: item.id, fondo: item.id_fondo }));
  const resp = await sgdeaAxios.get(`/seccionSubSeccion`);

  if (resp.data !== '') {
    optionsDependenciasBackup.value = resp.data?.map((item: any) => ({
      label: item.nombre,
      value: item.idSeccionSubSeccion,
      version: item.idversiontrd?.id
    })).filter((it: any) => !!it.label && !!it.value);
  }
});

async function cancelar() {
  if (showModalCancel.value) {
    showModalCancel.value = false
    await router.push('/SGDA/dependecias')
  } else {
    errorModal.value = false
  }
}

async function crearHandler() {

  if (opcionDependencia.value.includes(filtersSearch.value.codigoSerie)) {
    txtErrorModal.value = `Ya se encuentra una dependencia creada con el código '${filtersSearch.value.codigoSerie}'`
    errorModal.value = true;
    return;
  }

  if (nombreDependencia.value.includes(filtersSearch.value.nombreSerie)) {
    txtErrorModal.value = `Ya se encuentra una dependencia creada con el nombre '${filtersSearch.value.nombreSerie}'`
    errorModal.value = true;
    return;
  }

  const response = await sgdeaAxios.post("/seccionSubSeccion/create", {
    idSeccionSubSeccion: 0,
    idVersionTrd: filtersSearch.value.version,
    nombre: filtersSearch.value.nombreSerie,
    padre: filtersSearch.value.padre,
    codigo: filtersSearch.value.codigoSerie,
    fondo: null,
    estado: true,
    observacion: filtersSearch.value.observacion,
    idNodeAlfresco: "string",
    idAlfresco: "string"

  });

  if ([405, 401, 404, 400, 403, 500].includes(response?.status)) {
    errorModal.value = true
  } else if ([200, 201].includes(response.status)) {
    showModal.value = true
  }
}

const handleModal = () => {
  if (showModal.value) {
    showModal.value = false
    router.push('/SGDA/dependecias')
  } else {
    errorModal.value = false
  }
}

const onChangeVersion = async (e: object) => {
  //@ts-ignore
  const options = optionsDependenciasBackup.value.filter((item: any) => item.version == e)
  optionsDependencias.value = [...options, { label: 'Sin Padre', value: null }]
};
</script>

<style lang="scss">
.container-buttons {
  display: flex;
  justify-content: center;
  margin-top: 60px;
}
</style>

