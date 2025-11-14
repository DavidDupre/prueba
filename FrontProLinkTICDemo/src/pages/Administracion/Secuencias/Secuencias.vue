<template>
  <div>
    <BreadCrumbs :crumbs="routes" />

    <div class="tw-flex tw-justify-between tw-items-center tw-py-4">
      <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold">
        Administración de Secuencias
      </div>
      <q-btn label="Crear Secuencia" color="secondary" icon="add" class="tw-h-10 tw-rounded-lg"
        @click="router.push('/administracion/secuencias/crear')" />
    </div>


    <q-card class="tw-rounded-xl tw-p-7s" flat>

      <p class="tw-text-2xl tw-font-bold tw-pt-8 tw-pl-8">Filtros</p>
      <q-form @reset="resetForm">
        <div
          class="tw-grid tw-w-[98%] tw-mx-auto tw-grid-cols-8 tw-gap-4 tw-h-auto [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2"
          key="keyForm">

          <span class="tw-col-span-2">
            <label for="code" class="tw-text-label">Código Secuencia</label>
            <q-input v-model="filtersSearch.idSecuencia" label="Inserte" outlined class="mb-3" dense
              :rules="[(val => val.length <= 5 || 'Máximo 5 cáracteres'), (number => /^[0-9]+$/.test(number) || 'Solo se permiten números')]" />
          </span>
          <span class="tw-col-span-2">
            <label for="code" class="tw-text-label">Nombre Secuencia</label>
            <q-input v-model="filtersSearch.nombre" label="Inserte" outlined class="mb-3" dense
              :rules="[(val => val.length <= 50 || 'Máximo 50 cáracteres')]" />
          </span>
          <span class="tw-col-span-2">
            <label for="code" class="tw-text-label">Funcionalidad</label>
            <q-select outlined v-model="filtersSearch.idFuncionalidad" :options="optionsEntidades" label="Seleccione"
              dense />
          </span>
          <span class="tw-col-span-2">
            <label for="code" class="tw-text-label">Prefijo</label>
            <q-input v-model="filtersSearch.prefijo" label="Inserte" outlined class="mb-3" dense
              :rules="[(val => val.length <= 5 || 'Máximo 5 cáracteres')]" />
          </span>
          <span class="tw-col-span-2">
            <label for="code" class="tw-text-label">Sufijo</label>
            <q-input v-model="filtersSearch.sufijo" label="Inserte" outlined class="mb-3" dense
              :rules="[(val => val.length <= 5 || 'Máximo 5 cáracteres')]" />
          </span>
          <span class="tw-col-span-2">
            <label for="code" class="tw-text-label">Estado</label>
            <q-select outlined v-model="filtersSearch.activo" label="Inserte" dense :options="stateOptions" />
          </span>

        </div>
        <div class="row tw-flex tw-justify-center tw-gap-6 [&>*]:tw-p-2 tw-py-12">
          <q-btn label="Limpiar Filtros" color="accent" textColor="black" class="tw-rounded-lg col-2" type="reset">
          </q-btn>
          <q-btn label="Buscar" color="secondary" class="tw-rounded-lg col-2" @click="filterTable"></q-btn>
        </div>
      </q-form>
    </q-card>
    <div class="col row">

    </div>
    <q-card class="q-pa-md tw-mt-4 tw-rounded-xl" flat>
      <p class="tw-text-2xl tw-pl-6">Secuencias</p>
      <Table :TABLE_HEADER="SUBSERIES_HEADER" :TABLE_BODY="dataTable" :selection="undefined" key-id="idSecuencia"
        :msg-no-data="msgFilter" row-id="idSecuencia">
      </Table>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { Ref, ref, onMounted } from 'vue';
import { sgdeaAxios } from "src/services";
import { useRoute, useRouter } from "vue-router";

import BreadCrumbs from 'components/BreadCrumbs/BreadCrumbs.vue';
import Modal from 'components/Modal/Modal.vue';
import Table from 'src/components/Table.vue';

import { stateOptions } from "src/constantes/state";
import { lengthInput } from "src/helpers/validations";
import {
  SUBSERIES_HEADER,
  routes,
} from ".";
import { Secuencia, SelectInput, TipoSecuencia } from 'src/interfaces';
import { useLoadingStore } from 'src/stores/loading.store';


const route = useRoute()
const router = useRouter()

const showModal = ref(false)
const options = ref([])
const dataTable = ref([])
const keyForm = ref(0)
const filtersSearch = ref({
  activo: null,
  idFuncionalidad: null,
  idSecuencia: null,
  nombre: null,
  prefijo: null,
  sufijo: null,
});

const optionsEntidades: Ref<SelectInput[]> = ref([])
const msgFilter = ref('No se encontraron datos con los criterios ingresados, Por favor verifique e intente nuevamente')

onMounted(async () => {
  await getDataTable()
})

const getDataTable = async () => {
  const { data: content } = await sgdeaAxios.post<Secuencia[]>('/secuencias/filtro', filtersSearch.value);
  dataTable.value = content?.map(item => ({
    ...item,
    funcionalidad: item.tipoSecuencia.nombre,
    procedimiento: item.comentario,
    estados: item.activo,
    reinicioAnual: item.reinicioAnual ? 'SI' : 'NO'
  }))

  const { data } = await sgdeaAxios.get<TipoSecuencia[]>('/tipo_secuencia/all')
  optionsEntidades.value = data.map(item => ({
    label: item.nombre,
    value: item.id
  }))
}

const resetForm = async () => {

  filtersSearch.value = {
    activo: null,
    idFuncionalidad: null,
    idSecuencia: null,
    nombre: null,
    prefijo: null,
    sufijo: null,
  };
  keyForm.value++
  await getDataTable()

}

const filterTable = async () => {

  const response = await sgdeaAxios.post<Secuencia[]>('/secuencias/filtro', {
    ...filtersSearch.value,
    idFuncionalidad: filtersSearch.value.idFuncionalidad !== null ? filtersSearch.value.idFuncionalidad?.value : undefined,
    activo: filtersSearch.value.activo !== null ? filtersSearch.value.activo.value : undefined
  });


  if (response?.data) {
    msgFilter.value = 'No existen datos que coincidan con los filtros establecidos'
    dataTable.value = []
  } else {
    dataTable.value = response.data.map((item: any) => ({
      ...item,
      estados: item.activo,
      reinicioAnual: item.reinicioAnual ? 'SI' : 'NO'
    }))
  }
}
</script>
