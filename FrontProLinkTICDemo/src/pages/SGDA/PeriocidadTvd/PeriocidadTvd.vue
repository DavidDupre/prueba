<template>
  <div>
    <BreadCrumbs :crumbs="routes" />
    <div class="tw-flex tw-justify-between tw-items-center tw-pt-4 tw-mb-8">
      <h2 class="tw-font-bold tw-text-4xl tw-py-4">Periodicidad TVD</h2>
      <a href="/SGDA/periocidad-tvd/crear">
        <q-btn label="Crear periocidad" color="secondary" icon="add" class="tw-h-10 tw-rounded-lg" />
      </a>
    </div>

    <div>
      <q-card class="tw-flex tw-flex-col tw-p-8 tw-rounded-xl" flat>

        <p class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">Filtros</p>

        <div class="flex row q-col-gutter-md q-pb-md " :key="tableKey">
          <span class="tw-w-1/4">
            <label for="" class="tw-text-label">Código periodicidad</label>
            <q-input v-model="form.codigo_periodicidad" outlined dense class="tw-rounded-lg" label="Inserte"
              :rules="[val => lengthValidation(5, val), numberValidation]"></q-input>
          </span>
          <span class="tw-w-1/4">
            <label for="" class="tw-text-label">Nombre periodicidad</label>
            <q-input v-model="form.nombre_periodicidad" outlined dense class="tw-rounded-lg" label="Inserte"
              :rules="[(val) => lengthInput(val, 50)]"></q-input>
          </span>
          <span class="tw-w-1/4">
            <label for="" class="tw-text-label">Fecha inicio periodo</label>
            <DatePicker label="aaaa/mm/dd" v-model:input-data-prop="form.fecha_inicio_periodo"  mask="YYYY-MM-DD" />
          </span>

          <span class="tw-w-1/4">
            <label for="" class="tw-text-label">Fecha fin periodo</label>
             <DatePicker label="aaaa/mm/dd" v-model:input-data-prop="form.fecha_fin_periodo" mask="YYYY-MM-DD" />
          </span>
        </div>

        <div class="flex row q-col-gutter-md q-pb-md">
          <span class="tw-w-1/4">
            <label for="" class="tw-text-label">Fecha periodicidad</label>
            <DatePicker label="aaaa/mm/dd"  v-model:input-data-prop="form.fecha_periodicidad" mask="YYYY-MM-DD" />
          </span>
          <span class="tw-w-1/4">
            <label for="" class="tw-text-label">Estado</label>
            <q-select v-model="form.estado" outlined dense class="tw-rounded-lg" label="Seleccione"
              :options="stateOptions" />
          </span>
        </div>

        <span class="w-full flex justify-center tw-gap-4">

          <q-btn label="Limpiar Filtros" color="accent" textColor="black" class="tw-rounded-lg tw-p-3 tw-w-[200px]"
            @click="resetForm"></q-btn>
          <q-btn label="Buscar" color="secondary" class="tw-rounded-lg tw-p-3 tw-w-[200px] text-bold"
            @click="filterData"></q-btn>
        </span>
      </q-card>

      <q-card class="tw-mt-6 tw-rounded-xl tw-p-7" flat>
        <div class="flex flex-center justify-between">
          <p class="tw-text-2xl tw-pl-6 tw-font-bold">Periodicidad TVD</p>
        </div>

        <Table
          :TABLE_HEADER="PERIOCIDAD_HEADER"
          :TABLE_BODY="documental"
          :selection="undefined"
          key-id="id"
          :msg-no-data="dataNotFound"
        />
      </q-card>
    </div>
  </div>
</template>

<script setup lang='ts'>
import Table from 'src/components/Table.vue';

import { computed, onMounted, ref, watch } from "vue";

import { stateOptions } from "../../../constantes/state";
import DatePicker from 'src/components/FormFields/datePickerComponent.vue';
import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';
import ExportFile from 'components/FormFields/exportFiles.vue'
import Modal from 'src/components/Modal/Modal.vue'

import exportService from "src/services/ExportService";

import { PERIOCIDAD_HEADER, routes } from "."
import { thirdFormatDate } from "../../../helpers/formtDate";
import { lengthInput } from 'src/helpers/validations';
import { sgdeaAxios } from 'src/services';

const dataTable = ref([]);
const dataNotFound = ref('No se encontraron datos con los criterios ingresados. Por favor verifique e intente nuevamente.')

const form = ref({
  codigo_periodicidad: "",
  estado: "",
  fecha_fin_periodo: "",
  fecha_inicio_periodo: "",
  fecha_periodicidad: "",
  nombre_periodicidad: ""
});
const tableKey = ref();
const documental = ref([])

onMounted(async () => {
  await filterData()
})


const numberValidation = (string:string) => {
  if(/^[0-9]+$/.test(string) || string.length == 0) {
    return true
  } else {
    return 'Solo carácteres numéricos'
  }
}


const resetForm = async () => {
  form.value = ({
    codigo_periodicidad: "",
    estado: "",
    fecha_fin_periodo: "",
    fecha_inicio_periodo: "",
    fecha_periodicidad: "",
    nombre_periodicidad: ""
  })

  await filterData()
}

const validateData = (item) => item == "" ? null : (item ? item : null);

async function filterData() {
  const items = await sgdeaAxios.post("/periodicidadtvd/filter", {
    codigo: validateData(form.value.codigo_periodicidad),
    nombre: validateData(form.value.nombre_periodicidad),
    fechaPeriodicidad: validateData(form.value.fecha_periodicidad),
    fechaInicio: validateData(form.value.fecha_inicio_periodo),
    fechaFin: validateData(form.value.fecha_fin_periodo),
    estado: (form.value.estado == "" || !form.value.estado) ? null : form.value.estado.value
  });

  if (items.data) {
    documental.value = items.data?.map((item) => ({
      ...item,
      estados: item.estado,
      fecha_fin_periodo: item.fecha_fin_periodo !== null ? thirdFormatDate(item.fecha_fin_periodo) : '',
      fecha_inicio_periodo: item.fecha_inicio_periodo !== null ? thirdFormatDate(item.fecha_inicio_periodo): '',
      fecha_periodicidad: item.fecha_periodicidad !== null ? thirdFormatDate(item.fecha_periodicidad) : ''
    }))
  } else {
    documental.value = []
    dataNotFound.value = 'No se encontraron datos con los criterios ingresados. Por favor verifique e intente nuevamente.'
  }
}

</script>




<style scoped>
h2,
h3 {
  color: #222222;
}
</style>
