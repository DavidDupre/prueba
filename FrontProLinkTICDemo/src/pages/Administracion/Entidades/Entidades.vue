<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
      <BreadCrumbs :crumbs="routes" />
      <div class="tw-flex tw-justify-between tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold">Administración de Entidades</h1>
        <q-btn label="Crear entidad" color="secondary" icon="add" class="tw-rounded-lg tw-flex-col gap-4 tw-h-[45px]"
          @click="router.push('/administracion/entidades/crear')" />
      </div>
      <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
        <p class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">Filtros</p>
        <q-form @submit.prevent="searchItems">
          <div class="row q-col-gutter-md q-pb-md q-px-md">
            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 tw-gap-4">
              <span class="tw-text-label">Código entidad </span>
              <SearchInput :options="idEntidades" v-model:input-data-prop="form.codigo" label="Búsqueda" maxlength="5" />
            </div>
            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 tw-gap-4">
              <span class="tw-text-label">Nombre entidad </span>
              <SearchInput :options="nombresEntidades" label="Búsqueda" v-model:input-data-prop="form.nombre"
                maxlength="50" />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
              <span class="tw-text-label">Tipo Entidad</span>
              <q-select :options="idTipoEntidades" label="Seleccione" outlined dense v-model="form.tipoEntidad" />
            </div>
            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">
              <span class="tw-text-label">Estado</span>
              <q-select :options="stateOptions" label="Seleccione" outlined dense v-model="form.estados" />
            </div>
          </div>

          <div class="row tw-flex tw-justify-center tw-gap-6 [&>*]:tw-p-2">
            <q-btn label="Limpiar filtros" color="accent" textColor="black" class="tw-rounded-lg col-2"
              @click="resetForm" />
            <q-btn label="Buscar" color="secondary" class="tw-rounded-lg col-2" type="submit" />
          </div>
        </q-form>
      </q-card>

      <q-card class="q-mt-lg tw-p-7 tw-rounded-xl" flat>
        <p class="tw-text-2xl tw-pl-6">Listado entidades</p>
        <Table :TABLE_HEADER="Documental_HEADER" :TABLE_BODY="dataTable" :selection="undefined" :msg-no-data="textSearch"
          row-key="id" row-id="id" key-id="id" />
      </q-card>
    </main>
  </section>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { Ref, ref, onMounted } from "vue";

import { Documental_HEADER, stateOptions, IDataEntidades, routes } from ".";

import BreadCrumbs from "src/components/BreadCrumbs/BreadCrumbs.vue";
import DatePicker from "src/components/FormFields/datePickerComponent.vue";
import Table from "src/components/Table.vue";
import SearchInput from "src/components/SearchInput/SearchInput.vue";
import { useDependencias } from "src/composables/useEntidades";
import { adminAxios } from '../../../services/index';

const router = useRouter();

const form: Ref<any> = ref({
  estados: "",
  nombre: "",
  tipoEntidad: "",
  codigo: "",
});
const textSearch = ref("");
const dataTable: Ref<IDataEntidades[]> = ref([]);
const idEntidades: Ref<{ label: string; value: any }[]> = ref([]);
const idTipoEntidades: Ref<{ label: string; value: any }[]> = ref([]);
const nombresEntidades: Ref<{ label: string; value: any }[]> = ref([]);
onMounted(async () => {
  getItems();
});

const getItems = async () => {
  const response: IDataEntidades[] =
    await adminAxios.get("/entidades/");
  dataTable.value = response?.map((item: any) => ({
    ...item,
    id: item.idEntidad
  }));

  idEntidades.value = response?.map((item: IDataEntidades) => ({
    value: item.idEntidad,
    label: item.idEntidad.toString(),
  }));

  let idTipoEntidadesArray = response?.map(
    (item: IDataEntidades) => item.idTipoEntidad
  );
  let uniqueIdTipoEntidadesArray = idTipoEntidadesArray.filter(
    (value, index, self) => self.indexOf(value) === index
  );

  idTipoEntidades.value = uniqueIdTipoEntidadesArray.map((idTipoEntidad) => ({
    label: idTipoEntidad.toString(),
    value: idTipoEntidad,
  }));

  nombresEntidades.value = response?.map((item: IDataEntidades) => ({
    value: item.entidad,
    label: item.entidad,
  }));
};

const searchItems = async () => {
  const { data } = await adminAxios.get(
    `/entidades/?entidad=${form.value.nombre.value ?? ""}&estado=${form.value.estado ?? ""
    }&idEntidad=${form.value.codigo.value ?? ""}&idTipoEntidad=${form.value.tipoEntidad.value ?? ""
    }`
  );

  if (data.length == 0) {
    textSearch.value =
      "No se encontraron datos con los criterios ingresados. Por favor verifique e intente nuevamente.";
    dataTable.value = [];
  } else {
    dataTable.value = data?.map((item: any) => ({ ...item }));
  }
};

const resetForm = () => {
  form.value = {
    estados: "",
    nombre: "",
    tipoEntidad: "",
    codigo: "",
  };
  getItems();
};
</script>
