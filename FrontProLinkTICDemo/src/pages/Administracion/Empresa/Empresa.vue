<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
      <BreadCrumbs :crumbs="routes" />
      <div class="tw-flex tw-justify-between tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold">Administración Empresas</h1>
        <!-- <q-btn
          label="Crear empresa"
          color="secondary"
          icon="add"
          class="tw-rounded-lg tw-flex-col gap-4 tw-h-[45px]"
          @click="router.push('/administracion/empresas/crear')"
        ></q-btn> -->
      </div>

<!---- Se Comenta los filtros de empresa por socializado desde la versión 1.0 por indicación funcional solo debe existir una sola empresa ---->

<!--      <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>-->
<!--        <p class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">Filtros</p>-->
<!--        <q-form @submit.prevent="searchItems">-->
<!--          <div class="row q-col-gutter-md q-pb-md q-px-md">-->
<!--            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">-->
<!--              <span class="tw-w-full">-->
<!--                <label class="tw-text-label">Código Empresa</label>-->
<!--                <q-select-->
<!--                  v-model="form.idEmpresa"-->
<!--                  use-input-->
<!--                  input-debounce="0"-->
<!--                  :options="idEmpresas"-->
<!--                  @filter="filterFn"-->
<!--                  dense-->
<!--                  outlined-->
<!--                  class="tw-rounded-lg"-->
<!--                >-->
<!--                  <template v-slot:no-option>-->
<!--                    <q-item>-->
<!--                      <q-item-section class="text-grey">-->
<!--                        Sin resultados-->
<!--                      </q-item-section>-->
<!--                    </q-item>-->
<!--                  </template>-->
<!--                </q-select>-->
<!--              </span>-->
<!--            </div>-->
<!--            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">-->
<!--              <span class="tw-w-full">-->
<!--                <label class="tw-text-label">Nombre Empresa</label>-->
<!--                <q-select-->
<!--                  v-model="form.nombre"-->
<!--                  use-input-->
<!--                  input-debounce="0"-->
<!--                  :options="nombreEmpresas"-->
<!--                  @filter="filterFn"-->
<!--                  dense-->
<!--                  outlined-->
<!--                  class="tw-rounded-lg"-->
<!--                >-->
<!--                  <template v-slot:no-option>-->
<!--                    <q-item>-->
<!--                      <q-item-section class="text-grey">-->
<!--                        Sin resultados-->
<!--                      </q-item-section>-->
<!--                    </q-item>-->
<!--                  </template>-->
<!--                </q-select>-->
<!--              </span>-->
<!--            </div>-->

<!--            &lt;!&ndash; <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">-->
<!--              <span class="tw-w-full">-->
<!--                <label class="tw-text-label">Estado</label>-->
<!--                <q-select-->
<!--                  v-model="form.estado"-->
<!--                  :options="stateOptions"-->
<!--                  dense-->
<!--                  emit-value-->
<!--                  placeholder="Seleccione"-->
<!--                  map-options-->
<!--                  outlined-->
<!--                >-->
<!--                </q-select>-->
<!--              </span>-->
<!--            </div> &ndash;&gt;-->
<!--          </div>-->

<!--          <div class="row tw-flex tw-justify-center tw-gap-6 [&>*]:tw-p-2">-->
<!--            <q-btn-->
<!--              label="Limpiar filtros"-->
<!--              color="accent"-->
<!--              textColor="black"-->
<!--              class="tw-rounded-lg col-2"-->
<!--              @click="resetForm"-->
<!--            />-->
<!--            <q-btn-->
<!--              label="Buscar"-->
<!--              color="secondary"-->
<!--              class="tw-rounded-lg col-2"-->
<!--              @click="searchItems"-->
<!--            />-->
<!--          </div>-->
<!--        </q-form>-->
<!--      </q-card>-->

      <q-card class="q-mt-lg tw-p-7 tw-rounded-xl" flat>
        <p class="tw-text-2xl tw-pl-6">Empresas</p>
        <Table
          :TABLE_HEADER="Empresa_HEADER"
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

import { Empresa_HEADER, IDataEmpresa, routes } from ".";

import { formatDate } from "src/helpers/formtDate";

import BreadCrumbs from "src/components/BreadCrumbs/BreadCrumbs.vue";
import DatePicker from "src/components/FormFields/datePickerComponent.vue";
import Table from "src/components/Table.vue";
import {adminAxios} from 'src/services';
import { Empresa } from '../../../interfaces/Empresa';

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

const dataTable: Ref<Empresa[]> = ref([]);

onMounted(async () => {
  await getItems();
});

const idEmpresas: Ref<any[]> = ref([]);
const nombreEmpresas: Ref<any[]> = ref([]);

const getItems = async () => {
  const {data: {content: response}} = await adminAxios.get<{content: Empresa[]}>("/empresas/listado");
  dataTable.value = response.map((item: IDataEmpresa) => ({...item, id: item.idEmpresa, estados: item.estado}));

  idEmpresas.value = dataTable.value.map((data) => data.idEmpresa);
  nombreEmpresas.value = dataTable.value.map((data) => data.nombre);
};

const searchItems = async () => {
  const {data: response} = await adminAxios.get(
    `/empresas/?${
      form.value.idEmpresa !== null
        ? "codigoEmpresa=" + form.value.idEmpresa
        : ""
    }${form.value.estado !== null ? "&estado=" + form.value.estado : ""}${
      form.value.nombre !== null ? "&nombreEmpresa=" + form.value.nombre : ""
    }`);

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
    estado: null
  };
  getItems();
};
</script>
