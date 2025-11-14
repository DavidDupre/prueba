<template>
  <div>
    <BreadCrumbs :crumbs="routes" />
    <div class="tw-flex tw-justify-between tw-items-center tw-pt-4 tw-mb-8">
      <h2 class="tw-font-bold tw-text-4xl tw-py-4">Consulta Creación y Edición</h2>

    </div>

    <div class=" tw-gap-4">

      <q-card flat class="flex tw-flex-col tw-gap-4 tw-p-8 tw-rounded-lg flex-wrap ">

        <h3 class=" tw-text-2xl tw-text-left tw-font-bold tw-pl-6">Filtros</h3>

        <div class="row q-col-gutter-md q-pb-md q-px-md row flex">
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 ">
            <label class="tw-text-label">Tipo de sistemas</label>
            <q-select :options="tiposSistemas" dense emit-value placeholder="Seleccione" map-options outlined
              :rules="[(val: string) => val.length > 0 || 'Escoja una opcion']" required id:="description"
              v-model="form.id_tipo_sistemas" label="Seleccione" />
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 ">
            <label class="tw-text-label">Módulos</label>
            <q-select :options="modulos" dense emit-value placeholder="Seleccione" map-options outlined
              :rules="[(val: string) => val.length > 0 || 'Escoja una opcion']" required id:="description"
              v-model="form.id_modulo" label="Seleccione" />
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 ">
            <label class="tw-text-label">Funcionalidad</label>
            <q-select :options="functionalidades" dense emit-value placeholder="Seleccione" map-options outlined
              :rules="[(val: string) => val.length > 0 || 'Escoja una opcion']" required id:="description"
              v-model="form.id_funcionalidad" label="Seleccione" />
          </div>

          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 ">
            <label class="tw-text-label">Fecha Desde</label>
            <DatePicker mask="YYYY/MM/DD" label="aaaa / mm / dd" v-model:input-data-prop="form.fecha_inicio" />
          </div>

          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 ">
            <label class="tw-text-label">Fecha Hasta</label>
            <DatePicker mask="YYYY/MM/DD" label="aaaa / mm / dd" v-model:input-data-prop="form.fecha_final" />
          </div>

        </div>
        <span class="w-full flex justify-center tw-gap-4">

          <q-btn label="Limpiar Filtros" @click="clear" color="accent" textColor="black"
            class="tw-rounded-lg tw-p-2 tw-w-[200px]"></q-btn>
          <q-btn label="Buscar" color="secondary" @click="searchItems" class="tw-rounded-lg tw-p-2 tw-w-[200px] text-bold"></q-btn>
        </span>
      </q-card>
      <q-card class="q-mt-lg tw-p-7 tw-rounded-lg " flat>
        <div class="col row tw-flex tw-justify-between">
          <p class="q-pa-md tw-text-2xl">Listado de auditoría</p>

          <div class="tw-flex tw-gap-4">

            <q-select outlined :options="options" label="Exportar en" dense class="tw-w-40" />
          </div>
        </div>

        <Table :TABLE_HEADER="Documental_HEADER" :TABLE_BODY="data" :selection="undefined" icon="visibility" />
      </q-card>

    </div>
  </div>
</template>

<script lang="ts" setup>
import Table from './Table.vue';
import { Documental_HEADER, routes } from "."
import {onMounted, Ref, ref} from "vue"
import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';
import axios from "axios";
import DatePicker from "components/FormFields/datePickerComponent.vue";

const data = ref([]);
const dataNackup = ref([]);

const functionalidades: Ref<{value: any, label: string}[]> = ref([]);
const modulos: Ref<{value: any, label: string}[]> = ref([])
const tiposSistemas: Ref<{value: any, label: string}[]> = ref([])

const form = ref({
  fecha_final: "",
  fecha_inicio: "",
  id_funcionalidad: "",
  id_modulo: "",
  id_tipo_sistemas: ""
});

onMounted(async () => {
  const response = (await axios.get(`${process.env.API_LOGS}/logs/listar`)).data;


  data.value = response.map((item: any) => ({
    ...item,
    creacion: item.accion,
    fechaRegistro: item.fecha_creacion.split(" ")[0],
    horaRegistro: item.fecha_creacion.split(" ")[1],
    funcionalidad: item.funcionalidad.nombre,
    tipoSistemas: item.funcionalidad.componente.nombre,
    modulos: item.funcionalidad.componente.modulo.nombre
  }))

  dataNackup.value = data.value

  functionalidades.value = response.map((item: any) => ({value: item.funcionalidad.id, label: item.funcionalidad.nombre}))
  modulos.value = response.map((item: any) => ({value: item.funcionalidad.componente.modulo.id, label: item.funcionalidad.componente.modulo.nombre}))

  tiposSistemas.value = response.map((item: any) => ({value: item.funcionalidad.componente.id, label: item.funcionalidad.componente.nombre}))
});

const clear = () => {
  form.value = {
    fecha_final: "",
    fecha_inicio: "",
    id_funcionalidad: "",
    id_modulo: "",
    id_tipo_sistemas: ""
  }

  data.value = dataNackup.value
}

const searchItems = async () => {
  const response = (await axios.post(
    `${process.env.API_LOGS}/logs/filtrar`, {...form.value})).data

  data.value = response.map((item: any) => ({
    ...item,
    creacion: item.accion,
    fechaRegistro: item.fecha_creacion.split(" ")[0],
    horaRegistro: item.fecha_creacion.split(" ")[1],
    funcionalidad: item.funcionalidad.nombre,
    tipoSistemas: item.funcionalidad.componente.nombre,
    modulos: item.funcionalidad.componente.modulo.nombre
  }))

  functionalidades.value = response.map((item: any) => ({value: item.funcionalidad.id, label: item.funcionalidad.nombre}))
  modulos.value = response.map((item: any) => ({value: item.funcionalidad.componente.modulo.id, label: item.funcionalidad.componente.modulo.nombre}))

  tiposSistemas.value = response.map((item: any) => ({value: item.funcionalidad.componente.id, label: item.funcionalidad.componente.nombre}))
};

</script>


<style scoped></style>
