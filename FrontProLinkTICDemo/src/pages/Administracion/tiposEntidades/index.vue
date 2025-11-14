<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
      <BreadCrumbs :crumbs="routes" />
      <div class="tw-flex tw-justify-between tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold">Administración Tipos Entidades</h1>
        <q-btn label="Crear Tipo entidad" color="secondary" icon="add" class="tw-rounded-lg tw-flex-col gap-4 tw-h-[45px]"
          @click="router.push('/administracion/tiposEntidades/crear')"></q-btn>
      </div>
      <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
        <p class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">Filtros</p>
        <q-form @submit.prevent="searchItems">
          <div class="row q-col-gutter-md q-pb-md q-px-md">
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <span class="tw-w-full">
                <label class="tw-text-label">Codigo Tipo Entidad</label>
                <q-select v-model="filters.codigo" use-input map-options emit-value input-debounce="0" :options="idEmpresas" @filter="filterFn"
                  dense outlined class="tw-rounded-lg" maxlength="5">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Sin resultados
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </span>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <span class="tw-w-full">
                <label class="tw-text-label">Tipo entidad</label>
                <q-select v-model="filters.tipoEntidad" use-input input-debounce="0" :options="idEmpresas"
                  @filter="filterFn" dense outlined class="tw-rounded-lg" maxlength="50">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Sin resultados
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </span>
            </div>

            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <span class="tw-w-full">
                <label class="tw-text-label">Estado</label>
                <q-select v-model="filters.estado" :options="stateOptions" dense emit-value placeholder="Seleccione"
                  map-options outlined>
                </q-select>
              </span>
            </div>
          </div>

          <div class="row tw-flex tw-justify-center tw-gap-6 [&>*]:tw-p-2">
            <q-btn label="Limpiar filtros" color="accent" textColor="black" class="tw-rounded-lg col-2"
              @click="resetForm" />
            <q-btn label="Buscar" color="secondary" class="tw-rounded-lg col-2" @click="searchItems" />
          </div>
        </q-form>
      </q-card>

      <q-card class="q-mt-lg tw-p-7 tw-rounded-xl" flat>
        <p class="tw-text-2xl tw-pl-6">Listado tipos entidades</p>
        <Table :TABLE_HEADER="Empresa_HEADER" :TABLE_BODY="dataTable" :selection="'multiple'" row-key="id"
          row-id="id"
          key-id="id" />
      </q-card>
    </main>
  </section>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { Ref, ref, onMounted } from "vue";

import  { sgdeaAxios } from "src/services";
import { Empresa_HEADER, IDataEmpresa, routes, Ifilters } from ".";

import { formatDate } from "src/helpers/formtDate";

import BreadCrumbs from "src/components/BreadCrumbs/BreadCrumbs.vue";
import DatePicker from "src/components/FormFields/datePickerComponent.vue";
import Table from "src/components/Table.vue";

const router = useRouter();

const stateOptions = [
  {
    label: "Activo",
    value: true,
  },
  {
    label: "Inactivo",
    value: false,
  },
];

const filters: Ref<Ifilters> = ref({

});

const dataTable: Ref<IDataEmpresa[]> = ref([]);

onMounted(async () => {
  await getItems();
});

const idEmpresas: Ref<any[]> = ref([]);
const nombreEmpresas: Ref<any[]> = ref([]);

const getItems = async () => {
  const {data: response} = await sgdeaAxios.get('/tipoentidades/');
  dataTable.value = response.map((item: IDataEmpresa) => ({ ...item, id: item.idTipoEntidad, estados: item.estado }));

  idEmpresas.value = dataTable.value.map((data) => ({value: data.idTipoEntidad, label: `${data.idTipoEntidad} ${data.tipoEntidad}`}));
  nombreEmpresas.value = dataTable.value.map((data) => data.tipoEntidad);
};

const filterItems = async () => {
  const {data:response} = await sgdeaAxios.get('/tipoentidades/');

  dataTable.value = response.map((item: IDataEmpresa) => ({ ...item, id: item.idTipoEntidad, estados: item.estado }));
}


const resetForm = () => {
  filters.value = {

  };
  getItems();
};



function filterFn(val, update) {
  if (val === '') {
    update(() => {
      //options.value = stringOptions

      // here you have access to "ref" which
      // is the Vue reference of the QSelect
    })
    return
  }

  // update(() => {
  //   const needle = val.toLowerCase()
  //   options.value = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
  // })
}
</script>
