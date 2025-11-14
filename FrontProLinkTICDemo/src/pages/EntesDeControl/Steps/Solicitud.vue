<template>
  <q-form ref="solicitudForm" autofocus greedy class="q-gutter-y-lg q-mt-lg">
    <q-card class="tw-rounded-xl tw-pt-4 tw-pb-2" flat bordered>
      <div class="tw-flex tw-justify-between tw-items-center tw-py-4">
        <span class="tw-font-bold tw-text-3xl tw-my-2 tw-pl-4">
          Solicitud
        </span>
      </div>
      <div class="row q-col-gutter-md q-pb-md q-px-md">
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <span class="text-weight-bold">Canal de Recepción *</span>
          <q-select
            v-model="enteControl.canalRecepcion"
            :options="canales"
            :rules="[selectRequired]"
            label="Seleccione"
            map-options
            emit-value
            outlined
            disable
            dense
          />
          <!-- <q-input
            v-model="recepcionValue"
            name="canalDeRecepcion"
            :rules="[isRequired]"
            :disable="true"
            label="Inserte"
            outlined
            dense
          /> -->
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <span class="text-weight-bold"
            >Número de Radicado de la Entidad Remitente</span
          >
          <q-input
            :rules="[(val) => maxLengthInput(50, val)]"
            v-model="enteControl.nroRadicadoEntidadRemitente"
            name="nroRadicadoEntidad"
            label="Inserte"
            outlined
            dense
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <span class="text-weight-bold">Tipo de Solicitud *</span>
          <q-select
            v-model="enteControl.tipoSolicitud"
            :options="listadoTipoSolicitud"
            :rules="[selectRequired]"
            name="tipoSolicitud"
            label="Seleccione"
            map-options
            emit-value
            outlined
            dense
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <span class="text-weight-bold">Detalle * ({{ enteControl.detalle.length }}/500)</span>
          <q-input
            :rules="[isRequired, (val) => maxLengthInput(500, val)]"
            v-model="enteControl.detalle"
            type="textarea"
            label="Inserte"
            name="Detalle"
            outlined
            dense
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <span class="text-weight-bold">Producto *</span>
          <q-select
            v-model="enteControl.tipoProducto"
            :rules="[selectRequired]"
            :options="productos"
            label="Seleccione"
            name="producto"
            map-options
            emit-value
            outlined
            dense
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <span class="text-weight-bold">Observación * ({{ enteControl.observaciones.length }}/10000)</span>
          <q-input
            :rules="[isRequired, (val) => maxLengthInput(10000, val)]"
            v-model="enteControl.observaciones"
            name="observacion"
            label="Inserte"
            type="textarea"
            outlined
            dense
          />
        </div>
      </div>
    </q-card>
  </q-form>
</template>

<script lang="ts" setup>
import { maxLengthInput } from "src/helpers/validations";
import { computed, onMounted, ref } from "vue";
import { sgdeaAxios } from "src/services";
import { IEnteControl } from "../types";

const props = withDefaults(
  defineProps<{
    solicitudData: any;
    isReset?: boolean;
    isCorrespondencia: boolean;
  }>(),
  {
    isCorrespondencia: false
  }
);
const isRequired = (val: string) => !!val || "El campo es obligatorio";
const selectRequired = (val: string) => !!val || "Debe seleccionar una opción";
const solicitudForm = ref();
let canales = ref([]);
let productos = ref([]);
let listadoTipoSolicitud = ref([]);

let enteControl = ref<Partial<IEnteControl>>({
  canalRecepcion: props.isCorrespondencia ? 2 :1,
  nroRadicadoEntidadRemitente: "",
  tipoSolicitud: "",
  detalle: "",
  tipoProducto: "",
  observaciones: "",
});

// const recepcionValue = computed({
//   get() {
//     if (props.isCorrespondencia) {
//       return 'Ventanilla Única de Correspondencia'
//     }else{
//       return enteControl.value.canalRecepcion === 1 ? "Mail" : "";
//     }

//   },
//   set(value) {
//     if (props.isCorrespondencia) {
//       enteControl.value.canalRecepcion = value === "Ventanilla Única de Correspondencia" ? 2 : null;
//     }else{
//       enteControl.value.canalRecepcion = value === "Mail" ? 1 : null;
//     }

//   },
// });

onMounted(() => {
  getCanalesRecepcion();
  getProductos();
  getTipoSolicitud();
  verifyData();
});

/**
 * VerifyData se implementa para inyectar los datos del componente padre cuando se ejecuta el evento regresar
 * Se necesita validar que si un campo obligatorio tiene datos, ejecute el proceso.
 * Las props vienen con objetos implicitos por lo que es necesario validar por lo menos con un campo obligatorio.
 * Si no se hace así, limpia el form cuando no lo tiene que hacer.
 */

const verifyData = () => {
  if (props.solicitudData && props.solicitudData.tipoSolicitud) {
    enteControl.value = props.solicitudData;
  }
};

const validateForm = async () => {
  const isValid = await solicitudForm.value.validate();
  return isValid;
};

const clearForm = () => {
  enteControl.value = {};
};

const getCanalesRecepcion = async () => {
  const response = await sgdeaAxios.get("/api/entes/canal-recepcion");
  if (response.status === 200) {
    const { data } = response;
    canales.value = data.map((canal) => {
      return {
        value: canal.id,
        label: canal.nombre,
      };
    });
  }
};

const getProductos = async () => {
  const response = await sgdeaAxios.get("/pqrd/listadoProductosPQRD");
  if (response.status === 200) {
    const { data } = response;
    productos.value = data.map((producto) => {
      return {
        value: producto.id,
        label: producto.nombre,
      };
    }).sort((a, b) => b.value - a.value)
  }
};

const getTipoSolicitud = async () => {
  const response = await sgdeaAxios.get("/api/entes/tipos-solicitud");
  if (response.status === 200) {
    const { data } = response;
    listadoTipoSolicitud.value = data.map((producto) => {
      return {
        value: producto.id,
        label: producto.nombre,
      };
    });
  }
};

defineExpose({ validateForm, clearForm, enteControl });
</script>
