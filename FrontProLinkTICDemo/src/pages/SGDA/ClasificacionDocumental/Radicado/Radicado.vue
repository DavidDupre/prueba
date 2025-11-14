<template>
  <div>
    <BreadCrumbs :crumbs="routes" />
    <div class="tw-flex tw-justify-between tw-items-center tw-pt-4 tw-mb-8">
      <h2 class="tw-font-bold tw-text-4xl tw-py-4">
        Administración de Tipos de Radicado
      </h2>
      <q-btn
        label="Crear tipo de Radicado"
        color="secondary"
        icon="add"
        @click="router.push('/administracion/radicado/crear')"
        class="tw-rounded-lg tw-flex-col gap-4 tw-h-[42px]"
      >
      </q-btn>
    </div>

    <q-form ref="form" class="tw-mt-3 tw-h-full" @submit.prevent="search">
      <div class="">
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <p class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">Filtros</p>

          <div class="row q-col-gutter-md q-pb-md q-px-md">
            <div class="tw-w-1/4">
              <p class="tw-text-label">Codigo tipo Radicado</p>
              <q-input
                v-model="formData.idTipoRadicado"
                outlined
                dense
                label="Inserte"
              ></q-input>
            </div>
            <span class="tw-w-1/4">
              <p class="tw-text-label">Nombre tipo de Radicado</p>
              <q-input
                v-model="formData.nombreTipoRadicado"
                outlined
                dense
                class="tw-rounded-lg"
                label="Inserte"
                :rules="[(val) => (!/[^a-zA-ZáéíóúñÁÉÍÓÚÑ ]/.test(val) || 'No simbolos ni Numeros ')]"
              ></q-input>
            </span>
            <span class="tw-w-1/4">
                <label class="tw-text-label">Fecha de Radicado</label>
               <Datepicker mask="YYYY/MM/DD" label="aaaa / mm / dd" v-model:input-data-prop="formData.fecha_creacion" />
            </span>

            <span class="tw-w-1/4">
              <label class="tw-text-label">Estado</label>
              <q-select
                :options="estado_op"
                dense
                emit-value
                placeholder="Seleccione"
                map-options
                outlined
                v-model="formData.status"
                label="Estado"
              />
            </span>
          </div>

          <div class="row tw-flex tw-justify-center tw-gap-6 [&>*]:tw-p-2">
            <q-btn
              label="Limpiar filtros"
              color="accent"
              textColor="black"
              class="tw-rounded-lg col-2"
              @click="clear"
            ></q-btn>
            <q-btn
              type="submit"
              label="Buscar"
              color="secondary"
              class="tw-rounded-lg col-2"
            ></q-btn>
          </div>
        </q-card>

        <q-card class="q-mt-lg tw-p-7 tw-rounded-xl" flat  key="key">
          <p class="tw-text-2xl tw-pl-6">Tipos de radicado</p>
          <Table
            :TABLE_HEADER="Documental_HEADER"
            :TABLE_BODY="tipo_radicado"
            :selection="undefined"
            row-key="id"
          row-id="id"
          key-id="id"
          />
        </q-card>
      </div>
    </q-form>
  </div>
</template>

<script lang="ts" setup>
import Table from "src/components/Table.vue";
import { Documental_HEADER } from ".";
import BreadCrumbs from "src/components/BreadCrumbs/BreadCrumbs.vue";
import { useRouter } from "vue-router";
import { reactive, ref, onMounted, type Ref } from "vue";
import { formatDate } from "src/helpers/formtDate";
import service from "src/services/Api";
import Datepicker from 'components/FormFields/datePickerComponent.vue';

const router = useRouter();
const tipo_radicado: Ref<
  {
    creationDate: string;
    idTipoRadicado: number;
    nombreTipoRadicado: string;
    status: boolean;
  }[]
> = ref([]);
const key = ref(0)
const tipoRadicadoBackUp: Ref<
  {
    creationDate: string;
    idTipoRadicado: number;
    nombreTipoRadicado: string;
    status: boolean;
  }[]
> = ref([]);

const formData = reactive({
  idTipoRadicado: "",
  nombreTipoRadicado: "",
  status: "",
  fecha_creacion: "",
});

let estado_op = [
  {
    label: "Activo",
    value: "true",
  },

  {
    label: "Inactivo",
    value: "false",
  },
];

function clear() {
  tipo_radicado.value = tipoRadicadoBackUp.value;
  formData.idTipoRadicado = "";
  formData.nombreTipoRadicado = "";
  formData.status = "";
  formData.fecha_creacion = "";
  search()
}

function search() {
  service
    .searchTipoRadicado(
      formData.idTipoRadicado,
      formData.nombreTipoRadicado,
      formData.status,
      formData.fecha_creacion
    )
    .then((response) => {
      tipo_radicado.value = [];
        response.map(function (value, key){
        tipo_radicado.value = [
          ...tipo_radicado.value,
          {
            id: value.idTipoRadicado,
            nombre: value.nombreTipoRadicado,
            estados: value.status,
            fecha: formatDate(value.creationDate),
          },
        ];
    });
    })
    .catch((error) => {
        console.error(error);
    });

}

onMounted(async () => {
  search();
});

const routes = [
  {
    name: "Inicio",
    to: "/home",
  },
  {
    name: "Administración",
    to: "/home",
  },
  {
    name: "Clasificación documental",
    to: "/home",
  },
  {
    name: "Administración de Tipos de Radicado",
  },
];

</script>

<style scoped>
h2,
h3 {
  color: #222222;
}
</style>
