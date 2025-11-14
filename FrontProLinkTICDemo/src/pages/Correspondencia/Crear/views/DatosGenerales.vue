<template>
  <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
    <div class="row q-col-gutter-md q-pb-md q-px-md">
      <p class="tw-text-2xl tw-font-bold tw-pb-4 ">
        Datos generales
      </p>

      <div class="col-12">
        <span class="tw-w-full">
          <label class="tw-text-label">Asunto *</label>
          <q-input v-model="formGeneralData.asunto" dense outlined label="Inserte" class="tw-rounded-lg" disable readonly />
        </span>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label">Tipo de documento del afectado *</label>
          <q-select v-model="formGeneralData.tipoDocumento" label="Seleccione" map-options emit-value dense outlined
           class="tw-rounded-lg" disabled readonly >
          </q-select>
        </span>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label">Número de documento del afectado *</label>
          <q-input v-model="formGeneralData.numeroDocumento" dense outlined label="Inserte" class="tw-rounded-lg" disable readonly />
        </span>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label">Nombre del afectado *</label>
          <q-input v-model="formGeneralData.nombreAfectado" dense outlined label="Inserte" class="tw-rounded-lg" disable readonly />
        </span>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label">Radicado asociado</label>
          <q-select multiple v-model="formGeneralData.radNumero" use-chips use-input map-options emit-value dense outlined label="Inserte" class="tw-rounded-lg" disable readonly >

            <template v-slot:prepend>
              <q-icon name="search" />
            </template>

            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </span>
      </div>
      <div class="col-12">
        <span class="tw-w-full">
          <label class="tw-text-label">Numero de anexos *</label>
          <q-input v-model.number="formGeneralData.numeroAnexos" dense outlined label="Inserte" class="tw-rounded-lg" disable readonly />
        </span>
      </div>

      <div class="col-12">
        <label class="q-px-md tw-text-label">Observacion
          <q-input type="textarea" outlined label="Inserte" dense emit-value v-model="formGeneralData.observaciones" disable readonly />
        </label>
      </div>
    </div>
  </q-card>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = withDefaults(defineProps<{
  detallesComunicaciones: any
}>(), {

})

const formGeneralData = ref({
  asunto: "",
  tipoDocumento: "",
  nombreAfectado: "",
  numeroDocumento: "",
  radNumero: [],

  numeroAnexos: '',
  observaciones: ''
});

onMounted(() => {
  const datos = props.detallesComunicaciones?.datosGenerales
  const radicadoAsociado = props.detallesComunicaciones?.datosGenerales?.radicadoasociado.split('/') || []

  formGeneralData.value = {
    asunto: datos.asunto,
    tipoDocumento: datos.tipoDocumentoAfectado.nombre,
    nombreAfectado: datos.nombreAfectado,
    numeroDocumento: datos.numeroDocumentoAfectado,
    radNumero: radicadoAsociado,

    numeroAnexos: datos.numeroAnexos,
    observaciones: datos.observaciones
  }
})

</script>
<style>
    
</style>