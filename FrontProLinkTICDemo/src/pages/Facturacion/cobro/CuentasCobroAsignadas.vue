<template>
  <section class="tw-px-5 tw-flex tw-flex-row tw-bg-bg">
    <main class="tw-w-full tw-p-7 tw-pt-0">
      <div class="tw-flex tw-justify-between tw-items-center">
        <span class="tw-font-bold tw-text-3xl tw-my-5">Cuentas de cobro</span>
      </div>

      <q-card class="tw-rounded-xl tw-p-4" flat bordered>
        <q-expansion-item default-opened>
          <template v-slot:header>
            <div class="col row">
              <b class="tw-text-lg">Filtrar por</b>
            </div>
          </template>

          <q-card>
            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <span class="tw-w-full">
                  <label class="tw-text-label">Numero de radicado</label>
                  <q-input v-model="form.dependencia" type="number" label="Inserte" dense outlined
                    class="tw-rounded-lg" />
                </span>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <span class="tw-w-full">
                  <label class="tw-text-label">Oficina</label>
                  <q-select v-model="form.oficina" input-debounce="0" label="Seleccione" :options="oficinasOptions" dense
                    outlined class="tw-rounded-lg">
                  </q-select>
                </span>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <span class="tw-w-full">
                  <label class="tw-text-label">Remitente</label>
                  <q-input v-model="form.remitente" label="Inserte" type="text" dense outlined class="tw-rounded-lg" />
                </span>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <span class="tw-w-full">
                  <label class="tw-text-label"> Fecha de Vencimiento </label>

                  <DatePicker mask="YYYY/MM/DD" label="aaaa / mm / dd" v-model:input-data-prop="form.fechaRadicado" />
                </span>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <span class="tw-w-full">
                  <label class="tw-text-label">Estado</label>
                  <q-select v-model="form.estado" input-debounce="0" label="Seleccione" :options="stateOptions" dense
                    outlined class="tw-rounded-lg">
                  </q-select>
                </span>
              </div>
            </div>

            <div class="row tw-flex tw-justify-center tw-gap-6 [&>*]:tw-p-2">
              <q-btn label="Limpiar filtros" color="accent" textColor="black" class="tw-rounded-lg col-2"
                @click="resetForm" />
              <q-btn label="Buscar" color="primary" class="tw-rounded-lg col-2" @click="searchItems" />
            </div>
          </q-card>
        </q-expansion-item>
      </q-card>

      <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat bordered>
        <div class="flex items-center justify-between q-px-md q-mb-sm row col-12">
          <span class="text-weight-bold text-h5" style="color: #2c3948">Listado de Cuentas de cobro</span>
        </div>
        <TableCuentasCobro class="full-width" :FACTURA_HEADER="FACTURA_RADICADA_HEADER" :FACTURA_BODY="dataTable"
          label="Gestionar"
          @handle-edit="(id: number) => router.push('/facturacion/cuentas-cobro/asignadas/detalle/' + id)" />
      </q-card>
    </main>
  </section>
</template>

<script lang="ts" setup>
import { Ref, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { sgdeaAxios } from "src/services";
import { CuentaCobroResponse, FACTURA_RADICADA_HEADER } from ".";

import DatePicker from "src/components/FormFields/datePickerComponent.vue";
import { formatDateAndTime } from "src/helpers/formtDate";
import { SelectInput } from "src/interfaces";
import TableCuentasCobro from "./Table.vue";

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
  numeroRadicado: '',
  oficina: '',
  remitente: '',
  fechaRadicado: '',
  estado: '',
});

interface CuentaCobroDataTable {
  dependencia: string;
  responsable: string;
  tramite: string;
  recepcion: string;
  tipoDocumento: string;
  nroId: number;
  remitente: string;
  fechaHora: string;
  estado: string;
}

const dataTable: Ref<CuentaCobroDataTable[]> = ref([]);
const oficinasOptions = ref<SelectInput[]>([])

const getItems = async () => {
  const {
    data,
  } = await sgdeaAxios.get<CuentaCobroResponse[]>("/facturacion/getAllCto");

  dataTable.value = data.map((item) => {
    return {
      ...item,
      dependencia: item.idCto,
      tramite: "Cuentas de Cobro",
      recepcion: item.canal,
      tipoDocumento: item.tipoDocumento,
      nroId: item.idCto,
      numeroDocumento: item.numeroDocumento,
      remitente: item.aprobador,
      fechaHora: formatDateAndTime(item.fecha_hora),
      estado: item.estado,
    }
  });
};

onMounted(getItems);

const searchItems = async () => {

  dataTable.value = []
};

const resetForm = () => {
  form.value = {
    estado: '',
    fechaRadicado: '',
    numeroRadicado: '',
    oficina: '',
    remitente: ''
  };
  getItems();
};
</script>
