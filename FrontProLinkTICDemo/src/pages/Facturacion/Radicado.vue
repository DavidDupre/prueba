<template>
  <section class="tw-flex tw-flex-row tw-bg-bg">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
      <div class="tw-flex tw-justify-between tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold">Facturación</h1>
        <!-- <q-btn
            label="Crear empresa"
            color="secondary"
            icon="add"
            class="tw-rounded-lg tw-flex-col gap-4 tw-h-[45px]"
            @click="router.push('/administracion/empresas/crear')"
          ></q-btn> -->
      </div>
      <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
        <q-expansion-item expand-separator id="Datos generales" default-opened>
          <template v-slot:header>
            <div class="col row">
              <h2 class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">
                Filtrar por
              </h2>
            </div>
          </template>

          <q-form @submit.prevent="searchItems">
            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <span class="tw-w-full">
                  <label class="tw-text-label">Estado</label>
                  <q-select
                    v-model="form.estado"
                    label="Seleccione"
                    input-debounce="0"
                    :options="stateOptions"
                    dense
                    outlined
                    class="tw-rounded-lg"
                  >
                  </q-select>
                </span>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <span class="tw-w-full">
                  <label class="tw-text-label">Numero de radicado</label>
                  <q-input
                    v-model="form.numero"
                    type="number"
                    dense
                    label="Inserte"
                    outlined
                    class="tw-rounded-lg"
                  />
                </span>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <span class="tw-w-full">
                  <label class="tw-text-label"> Fecha de Vencimiento </label>
                  <DatePicker
                    mask="YYYY/MM/DD"
                    label="aaaa / mm / dd"
                    v-model:input-data-prop="form.fecha"
                  />
                </span>
              </div>

              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <span class="tw-w-full">
                  <label class="tw-text-label">Ciudad</label>
                  <q-select
                    v-model="form.ciudad"
                    input-debounce="0"
                    :options="[{ label: 'Seleccione', value: null }]"
                    dense
                    label="Seleccione"
                    outlined
                    class="tw-rounded-lg"
                  >
                  </q-select>
                </span>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <span class="tw-w-full">
                  <label class="tw-text-label">Tipo de Tramite</label>
                  <q-select
                    v-model="form.tipoTramite"
                    input-debounce="0"
                    :options="radicadoListTramite"
                    dense
                    label="Seleccione"
                    outlined
                    class="tw-rounded-lg"
                    map-options
                    emit-value
                  >
                  </q-select>
                </span>
              </div>
            </div>

            <div class="row tw-flex tw-justify-center tw-gap-6">
              <q-btn
                label="Limpiar filtros"
                color="accent"
                textColor="black"
                class="tw-rounded-lg col-2"
                @click="resetForm"
              />
              <q-btn
                label="Buscar"
                color="secondary"
                class="tw-rounded-lg col-2"
                @click="searchItems"
              />
            </div>
          </q-form>
        </q-expansion-item>
      </q-card>

      <q-card class="q-mt-lg tw-p-7 tw-rounded-xl" flat>
        <p class="tw-text-2xl tw-pl-6">Listado de facturas radicadas</p>
        <Table
          :TABLE_HEADER="RADICADOS_HEADER"
          :TABLE_BODY="dataTable"
          :selection="'multiple'"
          row-key="id"
          row-id="id"
          key-id="id"
        />
      </q-card>
    </main>
  </section>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { Ref, ref, onMounted } from "vue";

import { RADICADOS_HEADER } from ".";

import DatePicker from "src/components/FormFields/datePickerComponent.vue";
import Table from "src/components/Table.vue";

import { radicadoListTramite } from "src/constantes/options";

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

const form = ref({
  numero: "",
  estado: null,
  ciudad: "",
  fecha: "",
  tipoTramite: "",
});

const dataTable = ref([
  {
    id: 1,
    dependencia: "Facturas",
    responsable: "Juan Pérez",
    tipoTramite: "Lorem ipsum",
    recepion: "Correo electrónico",
    numeroDocumento: "8758374587348",
    numero: "Lorem ipsum",
    fecha: "2023/11/29",
    recepcion: "Canal",
  },
  {
    id: 12,
    dependencia: "Facturas 2",
    responsable: "Maria Pérez",
    tipoTramite: "Factura administrativa",
    recepion: "Correo electrónico",
    numero: "8758374587348",
    radicado: "Lorem ipsum",
    fecha: "2023/11/28",
    recepcion: "Canal",
  },
]);

const searchItems = async () => {
  const entries = Object.entries(form.value);

  let filteration = dataTable.value;

  entries.forEach(([key, value]) => {
    if (value) {
      filteration = filteration.filter((x) =>
        x[key].toLowerCase().includes(value?.toLowerCase())
      );
    }
  });
  dataTable.value = filteration;
};

const resetForm = () => {
  form.value = {
    numero: "",
    estado: null,
    ciudad: "",
    fecha: "",
    tipoTramite: "",
  };
  dataTable.value = [
    {
      id: 1,
      dependencia: "Facturas",
      responsable: "Juan Pérez",
      tipoTramite: "Lorem ipsum",
      recepion: "Correo electrónico",
      numeroDocumento: "8758374587348",
      numero: "Lorem ipsum",
      fecha: "2023/11/29",
      recepcion: "Canal",
    },
    {
      id: 12,
      dependencia: "Facturas 2",
      responsable: "Maria Pérez",
      tipoTramite: "Factura administrativa",
      recepion: "Correo electrónico",
      numero: "8758374587348",
      radicado: "Lorem ipsum",
      fecha: "2023/11/28",
      recepcion: "Canal",
    },
  ];
};
</script>
