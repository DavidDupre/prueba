<template>
  <div>
    <div class='tw-mb-6 tw-flex tw-items-center tw-justify-between'>

      <p class="pl-4 tw-font-bold tw-text-3xl tw-mt-5 tw-mb-3 text-bold">Casos</p>
      <q-btn
        label="Asignación Masiva"
        color="secondary"
        @click="router.push('/pqrd/rechazo')"
      />
    </div>

    <section>
      <div class="tw-grid tw-grid-cols-4 tw-gap-x-4">

        <div class="tw-col-span-1">
          <p class="tw-text-label tw-font-semibold">Estado</p>
          <q-select :options="[{ label: 'Activo', value: 1 }, { label: 'Inactivo', value: 2 }]"
                    map-options   outlined v-model='formData.estado' emit-value
                    label="Inserte" dense @update:model-value="handleFilters"/>
        </div>
        <div class="tw-col-span-1">
          <p class="tw-text-label tw-font-semibold">Número de radicado</p>
          <q-input type="number" outlined v-model='formData.numero' label="Inserte" dense
                   :rules="[v => lengthValidation(15, v), v => onlyNumbers(v)]"
                   @update:model-value="handleInputUpdate"
          />
        </div>
        <div class="tw-col-span-1">
          <p class="tw-text-label tw-font-semibold">Fecha de vencimiento</p>
          <DatePicker v-model:input-data-prop='formData.fecha' label="Seleccione" dense
                      @handleUpdate="handleFilters" mask="DD/MM/YYYY"
          />
        </div>
      </div>
    </section>
    <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2">Listados de Casos</h2>
    <Table
      :TABLE_HEADER="ASIGNACION_HEADER "
      :TABLE_BODY="dataTable"
      :selection="undefined"
      @handleCaso="handleCaso"
      row-id="codigo"
    />

  </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref, watch } from 'vue';

import { adminAxios } from 'src/services';
import { useDepartments, useMunicipalities } from 'src/composables/useVersion';
import { tipoRemitente } from "src/constantes/options";
import DatePicker from "components/FormFields/datePickerComponent.vue";

import Table from "components/Table.vue";
import { ASIGNACION_HEADER } from "./";
import {useRouter} from "vue-router";

interface PQRD {
  estado: string,
  numero: string,
  fecha: string
}
const step = ref(1)
const formData: Ref<PQRD> = ref({
  estado: '',
  numero: '',
  fecha: ''
});

const key = ref(0)
const router = useRouter()
const dataTable = ref([
  {
    numero: '35145',
    solicitud: 'Solicitud',
    afectado: 'Afectado',
    colaborador: 'Colaborador',
    estado: '1',
    caso: 'Asignar caso',
    fecha: '19/11/2023'
  },
  {
    numero: '1222',
    solicitud: 'Solicitud',
    afectado: 'Afectado',
    colaborador: 'Colaborador',
    estado: 'Inactivo',
    caso: 'Tercero',
    fecha: '11/11/11'
  },
  {
    numero: '541012',
    solicitud: 'Solicitud',
    afectado: 'Afectado',
    colaborador: 'Colaborador',
    estado: 'Trabajador',
    caso: 'Trabajador',
    fecha: '11/11/11'
  }
])

const handleInputUpdate = (newValue: string) => {
  if (newValue === '' || newValue === null) {
    return key.value++;
  } else {
    handleFilters();
  }
}

const handleFilters = () => {
  const entries = Object.entries(formData.value)

  let filteration = dataTable.value;

  entries.forEach(([key, value]) => {
    if (value) {
      if (key === 'estado') {
        filteration = filteration.filter((x) => x[key] === value);
      } else {
        filteration = filteration.filter((x) =>
          x[key].toLowerCase().includes(value.toLowerCase())
        );
      }
    }
  });
  dataTable.value = filteration;
}

const handleCaso = (id: number) => {
  router.push(`/SGDA/pqrd/consolidar-informacion/${id}`)
}

const onlyNumbers = (string: string) => {
  const regex = /^[0-9]+$/;

  if (regex.test(string)) {
    return true;
  } else {
    return "Solo numeros";
  }
};

const lengthValidation = (n, val: string) => val.length < n || 'Maximo ' + (n - 1) + ' Caracteres'


</script>

<style lang="scss">

</style>
