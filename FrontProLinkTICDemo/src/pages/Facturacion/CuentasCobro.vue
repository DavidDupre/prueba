<template>
  <section class="tw-px-5 tw-flex tw-flex-row tw-bg-bg">
    <main class="tw-w-full tw-p-7 tw-pt-0">
      <div class="tw-flex tw-justify-between tw-items-center">
        <span class="tw-font-bold tw-text-3xl tw-my-5"> Cuentas de cobro </span>
        <!-- <q-btn
            label="Crear empresa"
            color="secondary"
            icon="add"
            class="tw-rounded-lg tw-flex-col gap-4 tw-h-[45px]"
            @click="router.push('/administracion/empresas/crear')"
          ></q-btn> -->
      </div>

      <q-card class="tw-rounded-xl tw-p-4" flat bordered>
        <q-expansion-item default-opened>
          <template v-slot:header>
            <div class="col row">
              <b class="tw-text-lg">Filtrar por</b>
            </div>
          </template>

          <q-form @submit.prevent="searchItems">
            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <span class="tw-w-full">
                  <label class="tw-text-label">Numero de radicado</label>
                  <q-input
                    v-model="form.numero"
                    type="number"
                    dense
                    outlined
                    class="tw-rounded-lg"
                  />
                </span>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <span class="tw-w-full">
                  <label class="tw-text-label">Oficina</label>
                  <q-select
                    v-model="form.ciudad"
                    input-debounce="0"
                    :options="idEmpresas"
                    dense
                    outlined
                    class="tw-rounded-lg"
                  >
                  </q-select>
                </span>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <span class="tw-w-full">
                  <label class="tw-text-label">Remitente</label>
                  <q-input
                    v-model="form.tipoTramite"
                    type="text"
                    dense
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
                    v-model:input-data-prop="form.vencimiento"
                  />
                </span>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <span class="tw-w-full">
                  <label class="tw-text-label">Estado</label>
                  <q-select
                    v-model="form.estado"
                    input-debounce="0"
                    :options="stateOptions"
                    dense
                    outlined
                    class="tw-rounded-lg"
                  >
                  </q-select>
                </span>
              </div>
            </div>

            <div class="row tw-flex tw-justify-center tw-gap-6 [&>*]:tw-p-2">
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

      <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat bordered>
        <div
          class="flex items-center justify-between q-px-md q-mb-sm row col-12"
        >
          <span class="text-weight-bold text-h5" style="color: #2c3948"
            >Listado de Cuentas de cobro</span
          >
        </div>
        <Table
          :TABLE_HEADER="COBROS_HEADER"
          :TABLE_BODY="dataTable"
          :selection="'multiple'"
          row-key="id"
          row-id="id"
          key-id="id"
          @handle-edit-data="
            router.push('/facturacion/cuentas-cobro/detalle/1')
          "
        />
      </q-card>
    </main>
  </section>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { Ref, ref, onMounted } from "vue";

import httpClient, { adminAxios, client } from "src/services";
import { COBROS_HEADER, IDataEmpresa, routes } from ".";

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

const form = ref({
  idEmpresa: "",
  nombre: "",
  estado: null,
});

const dataTable: Ref<IDataEmpresa[]> = ref([
  {
    id: 1,
    dependencia: "Facturas",
    responsable: "Juan Pérez",
    tramite: "Lorem ipsum",
    recepcion: "Correo electrónico",
    tipoDocumento: "data",
    nroId: "8758374587348",
    remitente: "Lorem ipsum",
    fechaHora: "24/06/2023",
    estado: "Por asignar",
  },
]);

onMounted(async () => {
  await getItems();
});

const idEmpresas: Ref<any[]> = ref([]);
const nombreEmpresas: Ref<any[]> = ref([]);

const getItems = async () => {
  const {
    data: { content: response },
  } = await adminAxios.get("/empresas/listado");
  // dataTable.value = response.map((item: IDataEmpresa) => ({...item, id: item.idEmpresa, estados: item.estado}));

  idEmpresas.value = response.map((data) => data.idEmpresa);
  nombreEmpresas.value = response.map((data) => data.nombre);
};

const searchItems = async () => {
  const response = (
    await new httpClient(
      `/empresas/?${
        form.value.idEmpresa !== null
          ? "codigoEmpresa=" + form.value.idEmpresa
          : ""
      }${form.value.estado !== null ? "&estado=" + form.value.estado : ""}${
        form.value.nombre !== null ? "&nombreEmpresa=" + form.value.nombre : ""
      }`
    ).get()
  ).data;

  dataTable.value = response?.map((item: IDataEmpresa) => ({
    actoAdministrativoConstitucion: item.actoAdministrativoConstitucion,
    correoRepresentanteLegal: item.correoRepresentanteLegal,
    direccion: item.direccion,
    direccionRepresentanteLegal: item.direccionRepresentanteLegal,
    email: item.email,
    estados: item.estado,
    fechaContitucion: item.fechaContitucion,
    idEmpresa: item.idEmpresa,
    nacionalidadRepesentanteLegal: item.nacionalidadRepesentanteLegal,
    nit: item.nit,
    nombre: item.nombre,
    nombreRepresentanteLegal: item.nombreRepresentanteLegal,
    telefono: item.telefono,
    telefonoRepresentanteLegal: item.telefonoRepresentanteLegal,
    tipoSociedad: item.tipoSociedad,
  }));
};

const resetForm = () => {
  form.value = {
    idEmpresa: "",
    nombre: "",
    estado: null,
  };
  getItems();
};
</script>
