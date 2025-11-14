<template>
  <!-- <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
    <template v-slot:header>
      <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
        Ver Datos
      </h3>
    </template>
    <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Tipo de identificación del remitente</p>
        <p>{{ detailsRadicado.remitente.tipoDocumento.nombre }}</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Número documento remitente</p>
        <p>{{ detailsRadicado.remitente.numeroDocumento }}</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Nombre del remitente</p>
        <p>{{ detailsRadicado.remitente.nombre }}</p>
        <p>{{ (detailsRadicado && detailsRadicado.consolidador && detailsRadicado.consolidador.firstname) ?
          detailsRadicado.consolidador.firstname + ' ' + detailsRadicado.consolidador?.lastname : '' }}</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Departamento de la seccional</p>
        <p>{{ detailsRadicado.remitente.departamento.nombre }}</p>
      </div>
    </q-card>
    <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Municipio de la seccional</p>
        <p>{{ detailsRadicado.remitente.municipio.nombre  }}</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Dirección remitente</p>
        <p>{{ detailsRadicado.remitente.direccion  }}</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Correo Electrónico remitente</p>
        <p>{{ detailsRadicado.remitente.correo !== '' ? detailsRadicado.remitente.correo : "N/A" }}</p>
         <p>{{ (detailsRadicado && detailsRadicado.consolidador && detailsRadicado.consolidador.firstname) ?
          detailsRadicado.consolidador.firstname + ' ' + detailsRadicado.consolidador?.lastname : '' }}</p>
      </div>
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Número teléfono remitente</p>
        <p>{{ detailsRadicado.remitente.telefono !== 0 ? detailsRadicado.remitente.telefono : "N/A" }}</p>
      </div>
    </q-card>
    <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
      <div>
        <p class="tw-font-bold tw-text-gray-dark">Número de radicado</p>
        <p>{{ detailsRadicado.remitente.numeroRadicadoEntidad }}</p>
      </div>
    </q-card>
  </q-expansion-item> -->
  <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
    <template v-slot:header>
      <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
        Observación
      </h3>
    </template>
    <q-card class="tw-grid tw-gap-3 tw-pb-5 tw-mx-4 tw-ml-6" style="box-shadow: none">
      <div class="tw-col-span-4">
        <b>Observación Ingresada al Asignar Responsables</b>
      </div>
      <div class="tw-col-span-12">
        <p class="tw-font-bold tw-text-gray-dark">{{ datos?.observaciones }}</p>
      </div>
    </q-card>
  </q-expansion-item>
  <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
    <template v-slot:header>
      <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
        Asignación de Responsables
      </h3>
    </template>
    <q-card class="" style="box-shadow: none">
      <div class="column q-col-gutter-md q-pb-md q-px-md">
        <div class="text-weight-bold">Responsable</div>
        <div class="row tw-ml-1">
          <div class="col-4">
            <p class="tw-font-bold tw-text-gray-dark">Nombre Completo de Responsable</p>
            <p class="tw-font-bold tw-text-gray-dark">{{ datos?.asignador.firstname }} {{ datos?.asignador.lastname }}</p>
          </div>
          <div class="col-4">
            <p class="tw-font-bold tw-text-gray-dark">Oficina a la que Pertenece</p>
            <p class="tw-font-bold tw-text-gray-dark">{{ datos?.usuario?.usuarioRelaciones[0]?.oficina?.nombre }}</p>
          </div>
        </div>
      </div>
      <div class="column q-col-gutter-md q-pb-md q-px-md">
        <div class="text-weight-bold">Tiempo para Asignación</div>
        <div class="row tw-ml-1">
          <div class="col-4">
            <p class="tw-font-bold tw-text-gray-dark">Estado</p>
            <p class="tw-font-bold tw-text-gray-dark">{{ estado }}</p>
          </div>
          <div class="col-4">
            <p class="tw-font-bold tw-text-gray-dark">Tiempo Asignado</p>
            <p class="tw-font-bold tw-text-gray-dark">{{ datos?.time }} {{ (datos) ? datos?.typeTime == 'DIA' ? ' días' : ' horas' : '' }} </p>
          </div>
        </div>
      </div>
      <div class="column q-col-gutter-md q-pb-md q-px-md">
        <div class="text-weight-bold">Vencimiento</div>
        <div class="row tw-ml-1">
          <div class="col-4">
            <p class="tw-font-bold tw-text-gray-dark">Fecha de Vencimiento</p>
            <p class="tw-font-bold tw-text-gray-dark">{{ formateDate() }}</p>
          </div>
          <div class="col-4">
            <p v-if="!isAprobador" class="tw-font-bold tw-text-gray-dark">Días para Gestión</p>
            <p class="tw-font-bold tw-text-gray-dark">{{ datos ? datos?.typeTime == 'DIA' ? (Math.abs(datos?.tiempoXVencer) + ' días') : (Math.abs(datos?.tiempoXVencer) + ' días') : '' }}</p>
          </div>
        </div>
      </div>
      <div v-if="!isAprobador && !isGestionador" class="column q-col-gutter-md q-pb-md q-px-md">
        <div class="text-weight-bold">En Bandeja</div>
      </div>
    </q-card>
  </q-expansion-item>
</template>
<script lang="ts" setup>
import { formatDateTimeStandTwo } from 'src/helpers/formtDate';
import { sgdeaAxios } from 'src/services';
import { onMounted, ref } from 'vue';

const props = withDefaults(defineProps<{
  detailsRadicado: any,
  isAprobador: boolean,
  isGestionador: boolean,
  estado: string,
}>(), {
})

const datos = ref()

const getData = async() => {
  const { data } = await sgdeaAxios.get(`correspondencia/radicacion/asignaciones/${props.detailsRadicado.idRadicado}`)
  datos.value = data[data.length - 1]
}

const formateDate = () => {
  if (datos.value?.fechaVencimiento) {
    return formatDateTimeStandTwo(datos.value?.fechaVencimiento);
  }
}

onMounted(async() => {
  await getData()
})
</script>
<style>

</style>
