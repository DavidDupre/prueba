<template>
  <div>
    <BreadCrumbs :crumbs="crumbs" />
    <div class="tw-flex tw-justify-between tw-items-center tw-pt-4 tw-mb-8">
      <h2 class="tw-font-bold tw-text-4xl tw-py-4">Reubicación de expedientes</h2>
    </div>

    <div class="tw-gap-4">
      <q-card flat>
        <q-form flat class="flex tw-flex-col tw-gap-4 tw-p-8 tw-rounded-lg flex-wrap">
          <h3 class="tw-text-2xl tw-text-left tw-font-bold tw-pl-6">Filtros</h3>

          <div class="row q-col-gutter-md q-pb-md q-px-md">
            <span class="tw-w-1/4">
              <label class="tw-text-label">Número de expediente</label>
              <InputSearch v-model:input-data-prop="form.numeroExpediente" maxlength="5000" :options="[]" multiple class="tw-rounded-lg"
                label="Inserte" />
            </span>
            <span class="tw-w-1/4">
              <label class="tw-text-label">Número radicado</label>
              <InputSearch :options="radicadoOptions" v-model:input-data-prop="form.numeroRadicado" class="tw-rounded-lg"
                label="Inserte" maxlength="50" />
            </span>
            <span class="tw-w-1/4">
              <label class="tw-text-label">Fecha inicial expediente</label>
              <DatePicker v-model:input-data-prop="form.fechaInicial" mask="YYYY/MM/DD" label="aaaa / mm / dd" />
            </span>
            <span class="tw-w-1/4">
              <label class="tw-text-label">Fecha Final expediente</label>
              <DatePicker :options="(date: string) => date >= form.fechaInicial" v-model:input-data-prop="form.fechaFinal"
                mask="YYYY/MM/DD" label="aaaa / mm / dd" />
            </span>
            <span class="tw-w-1/4">
              <label class="tw-text-label">Sucursal</label>
              <InputSearch :options="sucursalOptions" v-model:input-data-prop="form.sucursal" />
            </span>
            <span class="tw-w-1/4">
              <label class="tw-text-label">Dependencia</label>
              <InputSearch :options="dependenciaOptions" v-model:input-data-prop="form.dependencia" />
            </span>
            <span class="tw-w-1/4">
              <label class="tw-text-label">Depósito</label>
              <InputSearch :options="[]" v-model:input-data-prop="form.deposito" />
            </span>
            <span class="tw-w-1/4">
              <label class="text-[--subtitle-color] tw-text-label">Pasillo</label>
              <q-select :options="[]" placeholder="Seleccione" label="Seleccione" outlined v-model="form.pasillo" dense />
            </span>
            <span class="tw-w-1/4">
              <label class="text-[--subtitle-color] tw-text-label">Tipo estante</label>
              <q-select :options="[]" placeholder="Seleccione" label="Seleccione" outlined v-model="form.tipoEstante"
                dense />
            </span>
            <span class="tw-w-1/4">
              <label class="text-[--subtitle-color] tw-text-label">Estante</label>
              <q-select :options="[]" placeholder="Seleccione" label="Seleccione" outlined v-model="form.estante" dense />
            </span>
            <span class="tw-w-1/4">
              <label class="text-[--subtitle-color] tw-text-label">Entrepaño</label>
              <q-select :options="[]" placeholder="Seleccione" label="Seleccione" outlined v-model="form.entrepano"
                dense />
            </span>
            <span class="tw-w-1/4">
              <label class="text-[--subtitle-color] tw-text-label">Contenedor</label>
              <q-select :options="[]" placeholder="Seleccione" label="Seleccione" outlined v-model="form.contenedor"
                dense />
            </span>
            <span class="tw-w-1/4">
              <label class="text-[--subtitle-color] tw-text-label">Tipo expediente</label>
              <q-select :options="[]" placeholder="Seleccione" label="Seleccione" outlined v-model="form.tipoExpediente"
                dense />
            </span>
            <span class="tw-w-1/4">
              <label class="text-[--subtitle-color] tw-text-label">Estado expediente</label>
              <q-select :options="stateOptions" placeholder="Seleccione" label="Seleccione" outlined v-model="form.estado"
                dense />
            </span>
          </div>

          <span class="w-full flex justify-center tw-gap-4">
            <q-btn label="Limpiar Filtros" color="accent" textColor="black" class="tw-rounded-lg tw-p-2 tw-w-[200px]"
              @click="resetForm"></q-btn>
            <q-btn label="Buscar" color="secondary" class="tw-rounded-lg tw-p-2 tw-w-[200px] text-bold"
              type="submit"></q-btn>
          </span>
        </q-form>
      </q-card>
      <q-card class="q-mt-lg tw-p-7 tw-rounded-lg" flat>
        <div class="col row tw-flex tw-justify-between tw-items-center tw-pb-4">
          <p class="q-pa-md tw-font-bold tw-text-2xl">Listado de ubicación de expedientes</p>
          <q-btn
            class="tw-bg-secondary tw-rounded-xl"
            text-color="white"
            @click="$router.push('/inventarioFisico/ubicacion/reubicar')"
            v-if="rowsSelected.length"
          >
            Reubicar
          </q-btn>
        </div>

        <Table
          :TABLE_HEADER="EXPEDIENTE_HEADER"
          :TABLE_BODY="dataTable"
          :selection="undefined"
          msg-no-data="No se encontraron datos con los criterios ingresados. Por favor verifique e intente nuevamente."
          key-id="id"
          icon="visibility"
          v-model:item-selected="rowsSelected"
        />
      </q-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Table from "src/components/Table.vue";
import { EXPEDIENTE_HEADER, routes } from "./index";
import { Ref, ref, onMounted } from "vue";
import BreadCrumbs from "src/components/BreadCrumbs/BreadCrumbs.vue";

import InputSearch from "components/SearchInput/SearchInput.vue";
import DatePicker from "components/FormFields/datePickerComponent.vue";
import { stateOptions } from "src/constantes/state";
import { radicadoOptions } from "src/constantes/tipoRadicado";
import { sgdeaAxios } from "src/services";

const crumbs = [
  ...routes,
]

const modalKey = ref("");
const form = ref({
  numeroExpediente: [],
  numeroRadicado: "",
  sucursal: "",
  dependencia: "",
  deposito: "",
  pasillo: "",
  tipoEstante: "",
  estante: "",
  entrepano: "",
  contenedor: "",
  tipoExpediente: "",
  fechaInicial: "",
  fechaFinal: "",
  estado: "",
});

const confirmModal = ref(false);
const rowsSelected = ref([]);
const dependenciaOptions: Ref<any[]> = ref([]);
const sucursalOptions: Ref<any[]> = ref([]);
const dataTable = ref([
  {
    numeroExpediente: 0,
    numeroRadicado: 0,
    id: 2,
  },
  {
    numeroExpediente: 0,
    numeroRadicado: 0,
    id: 1,
  },
  {
    numeroExpediente: 0,
    numeroRadicado: 0,
    id: 3,
  },
  {
    numeroExpediente: 0,
    numeroRadicado: 0,
    id: 4,
  },
  {
    numeroExpediente: 0,
    numeroRadicado: 0,
    id: 5,
  },
  {
    numeroExpediente: 0,
    numeroRadicado: 0,
    id: 6,
  },
  {
    numeroExpediente: 0,
    numeroRadicado: 0,
    id: 7,
  },
  {
    numeroExpediente: 0,
    numeroRadicado: 0,
    id: 8,
  },
  {
    numeroExpediente: 0,
    numeroRadicado: 0,
    id: 9,
  },
]);

const lengthValidation = (n: number, val: string) =>
  val.length <= n || "Máximo " + n + " cáracteres";


onMounted(async () => {
  const { data } = (await sgdeaAxios.get("/seccionSubSeccion"));

  dependenciaOptions.value = [...data?.filter((val: any) => val.estado == true).map((val: any) => ({
        label: `${val.codigo} ${val.nombre}`,
        value: val.codigo
      }))]


  const { content: sucursales } = (await sgdeaAxios.get('/sucursales')).data;

  sucursalOptions.value = sucursales.map((val: any) => {
    return{label : `${val.id} ${val.nombre}`, value:`${val.id}`}
  })
})

const resetForm = () => {
  form.value = {
    numeroExpediente: "",
  numeroRadicado: "",
  sucursal: "",
  dependencia: "",
  deposito: "",
  pasillo: "",
  tipoEstante: "",
  estante: "",
  entrepano: "",
  contenedor: "",
  tipoExpediente: "",
  fechaInicial: "",
  fechaFinal: "",
  estado: "",
  };
};
</script>
