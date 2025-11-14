<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0  ">
      <BreadCrumbs :crumbs="routes" />
      <div class="tw-flex tw-justify-between tw-pt-4 ">

        <h1 class="tw-text-3xl tw-font-bold">Administración de ubicaciones</h1>
        <q-btn label="Crear ubicación" color="secondary" icon="add" class="tw-rounded-lg tw-flex-col gap-4 tw-h-[45px]"
          @click="router.push('/administracion/ubicacion/crear')"></q-btn>
      </div>
      <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
        <p class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">Filtros</p>
        <q-form @submit.prevent="searchItems">
          <div class="row q-col-gutter-md q-pb-md q-px-md">
            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 tw-gap-4">
              <span class="tw-text-label">Código ubicación </span>

              <q-input v-model="form.codigo" label="Inserte" outlined class="mb-3" dense type="number"
                :rules="[v => lengthValidation(5, v)]" />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
              <span class="tw-text-label">Nombre ubicación </span>
              <q-input v-model="form.descripcion" label="Inserte" outlined class="mb-3" dense
                :rules="[v => lengthValidation(20, v)]" />

            </div>

            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 ">
              <span class="tw-text-label">Sede </span>
              <q-input v-model="form.descripcion" label="Buscar" outlined class="mb-3" dense>
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 ">
              <span class="tw-text-label">Dependecia </span>
              <SelectDependecias v-model:input-data-prop="form.descripcion" />
            </div>
            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 ">
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
        <p class="tw-text-2xl tw-pl-6">Ubicaciones</p>
        <Table :TABLE_HEADER="UBICACION_HEADER" :TABLE_BODY="dataTable" :selection="undefined" is-second-icon
          second-icon="visibility" row-id="codigo" />
      </q-card>

    </main>
  </section>
</template>

<script  lang="ts" setup>

import { useRouter } from "vue-router";
import { Ref, ref, onMounted } from "vue";


import { UBICACION_HEADER, ISearchData, stateOptions, IDataSerie, routes } from ".";

import { formatDate } from "src/helpers/formtDate";

import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';
import DatePicker from 'src/components/FormFields/datePickerComponent.vue';
import Table from 'src/components/Table.vue';
import SelectDependecias from "components/SelectDependencias/SearchSelectDependecias.vue"
import { sgdeaAxios } from '../../../services/index';



const router = useRouter()

const form: Ref<any> = ref({
  descripcion: "",
  estados: '',
  fecha_vigencia_inicial: '',
  fecha_vigencia_final: '',
  id_seriesubserie: 0,
  codigo: ''
});

const dataTable: Ref<IDataSerie[]> = ref([
  {
    id_seriesubserie: 0,
    descripcion: " ",
    estados: false,
    tipo_de_soporte: 0,
    id_padre: 0,
    fecha_vigencia_inicial: "",
    fecha_vigencia_final: "",
    observacion: ""
  }
])


// onMounted(async () => {
//   await getItems()

// });


onMounted(async () => {
  const {data: response} = await sgdeaAxios.get(`/serie/serie`);

  let series = response.filter((item: any) => {
    return item.padre === null
  })

  dataTable.value = series;
})

const lengthValidation = (n: number, val: string) => val.length < n || 'Máximo ' + n + ' carácteres'

const getItems = async () => {
  const { data: response } = await sgdeaAxios.get(`/serie/serie`);
  dataTable.value = response?.map((item: any) => ({
    ...item,
    fecha_vigencia_final: formatDate(item.fecha_vigencia_final),
    fecha_vigencia_inicial: formatDate(item.fecha_vigencia_inicial)
  }))
}

const searchItems = async () => {

  // const { data } = (await client.post("/operacionesradicados/radicadosBusqueda?nombreTabla=serie&pagina=1&cantidadRegistros=100", {
  //   ...form.value,
  //   estados: form.value.estados ? form.value.estados : "",
  //   id_seriesubserie: "",
  //   codigo: String(form.value.codigo)
  // }))
  //
  // dataTable.value = data?.map((item: any) => ({
  //   codigo: item[8],
  //   descripcion: item[1],
  //   estados: item[2],
  //   fecha_vigencia_inicial: item[5],
  //   fecha_vigencia_final: item[6],
  // }))

}

const resetForm = () => {
  form.value = ({
    descripcion: "",
    estados: '',
    fechaVigenciaInicial: new Date(),
    fechaVigenciaFinal: new Date(),
    id_padre: ""
  })
  getItems()
}
</script>
