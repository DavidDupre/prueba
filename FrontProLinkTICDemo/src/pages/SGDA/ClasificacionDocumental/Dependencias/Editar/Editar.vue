<template>
  <div>
    <BreadCrumbs :crumbs="routes" />

    <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold">
      Editar Dependencia
    </div>
    <q-card class="tw-rounded-lg tw-p-7" bordered flat>
      <!--      <p class="tw-text-2xl tw-font-bold">Subserie documental</p>-->


      <q-form ref="CotizacionesForm" class="tw-mt-6 tw-h-full" @submit="updateHandler">
        <div class="tw-w-full">
          <p class="tw-text-label tw-font-bold">Código dependencia</p>
          <q-input required outlined v-model="filtersSearch.codigoDependencia" label="Dependencia" dense
                   :rules="[inputRequired, (val) => maxLengthInput(255, val)]"/>
        </div>

        <div class="tw-w-full tw-mt-3">
          <p class="tw-text-label tw-font-bold">Nombre dependencia</p>
          <q-input required outlined v-model="filtersSearch.nombreDependencia" label="Nombre dependencia" dense maxlength="50" :rules="[
            alphanumeric,
            val => inputRequired(val)
          ]" />
        </div>

        <div class="tw-flex tw-full q-col-gutter-md tw-mt-0">

          <div class="tw-w-1/2">
            <p class="tw-text-label">Versión</p>
            <q-select outlined v-model="filtersSearch.idVersionTrd" :options="versiones"
                      map-options emit-value label="Seleccione" dense />
          </div>

          <div class="tw-w-1/2">
            <p class="tw-text-label tw-font-bold">Dependencia padre</p>
            <q-select label="Sección" outlined dense :options="newOptiontsDependencias" map-options emit-value
              v-model="filtersSearch.padre" />
          </div>
          <div class="tw-w-1/2">
            <p class="tw-text-label tw-font-bold">Estado</p>
            <div class="tw-flex tw-items-center tw-justify-between q-gutter-x-xl">
              <p>{{ filtersSearch.estado === true ? "Activo" : "Inactivo" }}</p>
              <q-toggle required v-model="filtersSearch.estado" color="primary" />
            </div>
          </div>
          <!-- <div class="tw-w-1/2">
            <p class="tw-text-label">Fondo</p>
            <q-select outlined v-model="filtersSearch.fondo" :options="fondoptions" @update:model-value="(val) => onChangeFondo(val)" label="Seleccione"
                dense />
          </div> -->

        </div>

        <div class="tw-w-full tw-mt-3">
          <p class="tw-text-label tw-font-bold">Observación</p>
          <q-input outlined v-model="filtersSearch.observacion" label="Observación" dense maxlength="200" type="textarea" />


        </div>

        <div class="container-buttons q-gutter-x-md">
          <q-btn @click="showModalCancel = true" label="Cancelar" style="width: 240px;" color="accent" text-color="black"
            class="tw-rounded-xl" />
          <q-btn type="submit" label="Guardar Cambios" text-color="white" style="width: 240px"
            class="tw-rounded-xl tw-p-2 " color="secondary" />
        </div>
      </q-form>
    </q-card>

    <Modal v-model="showModal" title="Edición exitosa" @handleAccept="handleModal"
      :text="`La dependencia ${filtersSearch.codigoDependencia} ${filtersSearch.nombreDependencia} fue modificada correctamente.`"
      is-success text-button="¡Ok!" />
    <Modal v-model="errorModal" title="Error" @handleAccept="handleModal" :text="txtErrorModal" text-button="¡Ok!" />
    <Modal v-model="showModalCancel" title="¡Espera un momento!" @handleAccept="cancelar" cancelButton
      @closeModal="showModalCancel = false"
      :text="`¿Está seguro de abandonar la edición de la dependencia ${filtersSearch.codigoDependencia} ${filtersSearch.nombreDependencia}?`"
      text-button="SI" text-button-cancel="NO" />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, Ref, ref, watch } from "vue";
import { useRouter } from "vue-router";
import {
  alphanumeric,
  maxLengthInput,
  inputRequired
} from 'src/helpers/validations'

import BreadCrumbs from "components/BreadCrumbs/BreadCrumbs.vue";
import Modal from "components/Modal/Modal.vue";
import { useLoadingStore } from "src/stores/loading.store";
import { sgdeaAxios } from '../../../../../services/index';

const router = useRouter();
const showModal = ref(false);
const errorModal = ref(false);
const showModalCancel = ref(false);
const txtErrorModal = ref("Ha ocurrido un error");
const filtersSearch: Ref<any> = ref({
  idSeccionSubSeccion: "",
  idVersionTrd: "",
  nombreDependencia: "",
  padre: "",
  codigoDependencia: "",
  fondo: null,
  estado: false,
  observacion: "",
  idNodeAlfresco: "string",
  idAlfresco: "string"
});
// @ts-ignore
const newOptiontsDependencias = ref([])

const id = ref("");

let dataIn: any = {};
const opcionDependencia: Ref<string[]> = ref([]);
const nombreDependencia: Ref<string[]> = ref([]);
const versiones: Ref<any[]> = ref([]);
let arrayData = ref();

onMounted(async () => {
  id.value = router.currentRoute.value.params.id;
  await loadData();
});

async function loadData() {
  versiones.value = (await sgdeaAxios.get('/versiontrd/list')).data.filter((item: any) => item.estado === 55)
    .map((item: any) => ({ label: `${item.nombreVersion}`, value: item.id }));

  let response = await sgdeaAxios.get(
    "/seccionSubSeccion/selectById?id=" + id.value
  );

  dataIn = response.data;
  dataIn.padre ? dataIn.padre = ({
    ...dataIn.padre.value,
    label: `${dataIn.padre.codigo} ${dataIn.padre.nombre}`, value: dataIn.padre.codigo,
  }) : null;

  arrayData = response.data

  const { data } = await sgdeaAxios.get("/seccionSubSeccion");

  opcionDependencia.value = await [...data?.map((val: any) =>
    ({ label: `${val.nombre}`, value: val.idSeccionSubSeccion, })),
  ];

  filtersSearch.value = ({
      nombreDependencia: dataIn?.nombre,
      codigoDependencia: dataIn?.codigo,
      idSeccionSubSeccion: dataIn?.idSeccionSubSeccion,
      idVersionTrd: dataIn?.idversiontrd?.id,
      padre: dataIn?.padre,
      observacion: dataIn?.observacion,
      estado: dataIn.estado
  })

  if(filtersSearch.value.nombreDependencia) {
    newOptiontsDependencias.value = opcionDependencia.value.filter((it) => it.label !== filtersSearch.value.nombreDependencia)

  }
}


async function updateHandler() {

  if (opcionDependencia.value.includes(filtersSearch.value.codigoSerie) && dataIn.codigo != filtersSearch.value.codigoSerie) {
    txtErrorModal.value = `Ya se encuentra una dependencia creada con el código '${filtersSearch.value.codigoSerie}'`
    errorModal.value = true;
    return;
  }

  if (nombreDependencia.value.includes(filtersSearch.value.nombreSerie) && dataIn.nombre != filtersSearch.value.nombreSerie) {
    txtErrorModal.value = `Ya se encuentra una dependencia creada con el nombre '${filtersSearch.value.nombreSerie}'`
    errorModal.value = true;
    return;
  }
  const response = await sgdeaAxios.put("/seccionSubSeccion/update", {

  idSeccionSubSeccion: Number(id.value),
  idVersionTrd: filtersSearch.value.idVersionTrd,
  nombre: filtersSearch.value.nombreDependencia,
  padre: filtersSearch.value.padre === null ?  filtersSearch.value.padre : Number(filtersSearch.value.padre),
  fondo: null,
  codigo: filtersSearch.value.codigoDependencia,
  estado: filtersSearch.value.estado,
  observacion: filtersSearch.value.observacion,
  idNodeAlfresco: dataIn.idNodeAlfresco,
  idAlfresco: dataIn.idAlfresco,
  });

  if ([405, 401, 404, 400, 403, 500].includes(response?.status)) {
    errorModal.value = true;
  } else if ([200, 201].includes(response.status)) {
    showModal.value = true;
  }
}

watch(filtersSearch.value, (newValue) => {
  if (newValue.seccion) {
    if (newValue.seccion.value === null) {
      clearSelection();
    }
  }
});

function clearSelection() {
  filtersSearch.value.seccion = "";
}

async function cancelar() {
  if (showModalCancel.value) {
    showModalCancel.value = false;
    router.push("/SGDA/dependecias");
  } else {
    errorModal.value = false;
  }
}

const handleModal = () => {
  if (showModal.value) {
    showModal.value = false;
    router.push("/SGDA/dependecias");
  } else {
    errorModal.value = false;
  }
};

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
    name: 'Editar dependencia',
  }
]

</script>

<style lang="scss">
.container-buttons {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
</style>
