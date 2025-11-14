<template>
  <div>
    <BreadCrumbs :crumbs="routes" />

    <div class="tw-flex tw-justify-between tw-items-center tw-py-4">
      <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold">
        Administración de Usuarios
      </div>

      <router-link to="/SGDA/Administracion/usuarios/crear">
        <q-btn label="Crear Usuario" color="primary" icon="add" class="tw-h-10 tw-rounded-lg" />
      </router-link>
    </div>

    <q-card class="tw-rounded-xl tw-p-7s" flat>
      <q-form ref="fondosForm" class="tw-mt-6" @submit="handleSearch">
        <p class="tw-text-2xl tw-pl-8 tw-pt-4 tw-font-bold">Filtros</p>

        <div class="tw-grid tw-grid-cols-3 tw-full tw-justify-center q-col-gutter-md tw-px-8 tw-py-4">
          <div class="tw-cols-1">
            <p class="tw-text-label">Nombre completo</p>
            <q-input outlined v-model="filtersSearch.nombre" label="Inserte" dense />
          </div>
          <!-- <div class="tw-cols-1">
            <p class="tw-text-label">Código fondo</p>
            <q-input outlined v-model="filtersSearch.codigo_fondo" label="Inserte" dense :rules="[nonRequiredOnlyNumbers]" />
          </div> -->
          <div class="tw-cols-1">
            <p class="tw-text-label">Usuario</p>
            <q-input outlined v-model="filtersSearch.userName" label="Inserte" dense />
          </div>
          <div class="tw-cols-1">
            <p class="tw-text-label">Rol</p>
            <q-select outlined v-model="filtersSearch.rol" emit-value map-options :options="roleOptions"
              label="Seleccione" dense />
          </div>
          <div class="tw-cols-1">
            <p class="tw-text-label">Dependencia</p>
            <q-select outlined v-model="filtersSearch.dependencia" emit-value map-options :options="dependenciasOptions"
              label="Seleccione" dense />
          </div>
          <div class="tw-cols-1">
            <p class="tw-text-label">Oficina</p>
            <q-select outlined v-model="filtersSearch.oficina" emit-value map-options :options="oficinasOptions"
              label="Seleccione" dense />
          </div>
        </div>
        <div class="row tw-flex tw-justify-center tw-gap-6 [&>*]:tw-p-2 tw-mt-6 tw-pb-6">
          <q-btn label="Limpiar Filtros" color="accent" textColor="secondary" class="tw-rounded-lg col-2"
            @click="resetForm"></q-btn>
          <q-btn label="Buscar" color="primary" class="tw-rounded-lg col-2" type="submit"></q-btn>
        </div>
      </q-form>
    </q-card>
    <q-card class="q-pa-md tw-mt-4 tw-rounded-xl" flat>
      <div class="col row">
        <p class="tw-text-2xl tw-pl-6">Listado de Usuarios</p>
      </div>
      <Table :TABLE_HEADER="Usuarios_HEADER" :TABLE_BODY="dataTable" :selection="undefined" key-id="id"
        :item-selected="selected" :is-toggle="true" />
    </q-card>
    <Modal v-model="showModal" title="Asignación exitosa"
      text="Se ha asignado con éxito los tipos documentales a la dependencia x." is-success text-button="¡Ok!" />
  </div>
</template>
<script lang="ts" setup>
import { Ref, ref, onMounted, watch } from "vue";
import { sgdeaAxios } from "src/services";
import { useRouter } from "vue-router";

import BreadCrumbs from "components/BreadCrumbs/BreadCrumbs.vue";
import Modal from "components/Modal/Modal.vue";
import Table from "src/components/Table.vue";
import { Usuarios_HEADER } from ".";
import { stateOptions } from "src/constantes/state";
import { useLoadingStore } from "src/stores/loading.store";
import { nonRequiredOnlyNumbers, onlyNumbers } from "src/helpers/validations";
import { QForm } from "quasar";
import { Oficina, Rol, Usuario } from "./interfaces/usuario";
import { Dependencia, SelectInput } from "src/interfaces";

const router = useRouter();
const showModal = ref(false);
const fondosForm: Ref<QForm | null> = ref(null);
const filtersSearch: Ref<Filters> = ref({});
const roleOptions: Ref<string[]> = ref([])
const dependenciasOptions: Ref<SelectInput[]> = ref([]);
const oficinasOptions: Ref<SelectInput[]> = ref([]);
const oficinas: Ref<Oficina[]> = ref([]);

interface Filters {
  nombre?: string;
  userName?: string;
  dependencia?: string | number;
  oficina?: string | number;
  rol?: string;
  estado?: boolean;
}

interface DisplayUser extends Omit<Usuario, "enabled"> {
  enabled: string | boolean;
}

const dataResponse = ref<Usuario[]>([]);
const dataTable = ref<DisplayUser[]>([]);
const selected = ref([]);

// Llamada a la api
onMounted(async () => await getDataTable());

const getDataTable = async () => {
  const { data: res } = await sgdeaAxios.get<Usuario[]>(
    "/api/usuarios/"
  );
  dataResponse.value = res;

  const response = await sgdeaAxios.get<Rol[]>("/roles");
  roleOptions.value = response.data.map((role) => role.nombre);

  const { data } = await sgdeaAxios.get<Dependencia[]>("/seccionSubSeccion");
  dependenciasOptions.value = data.map((dependencia) => ({
    label: dependencia.nombre,
    value: dependencia.idSeccionSubSeccion,
  }));

  const { data: oficinasData } = await sgdeaAxios.get<Oficina[]>("/oficinas/all");
  oficinas.value = oficinasData;

  const displayUsers: DisplayUser[] = res.map(({ enabled, ...restOfUser }) => ({
    ...restOfUser,
    enabled: enabled,
  }));

  dataTable.value = displayUsers;

};

const resetForm = async () => {

  filtersSearch.value = {};
  await getDataTable();

};

const handleSearch = async () => {
  const isValidForm = await fondosForm.value.validate();

  if (isValidForm) {


    if(filtersSearch.value.dependencia && filtersSearch.value.rol) {
      const response = await sgdeaAxios.get<Usuario[]>("/api/usuarios/rolYSeccionSubseccion/" + filtersSearch.value.dependencia, {
        params: filtersSearch.value.rol ? { rolName: filtersSearch.value.rol } : {},
      });

      dataTable.value = response.data.map(({ enabled, ...restOfUser }) => ({
        ...restOfUser,
        enabled: enabled ? "Activo" : "Inactivo",
      }));
    } else if(filtersSearch.value.dependencia) {
      const response = await sgdeaAxios.get<Usuario[]>("/api/usuarios/seccionSubseccion/" + filtersSearch.value.dependencia);

      dataTable.value = response.data.map(({ enabled, ...restOfUser }) => ({
        ...restOfUser,
        enabled: enabled ? "Activo" : "Inactivo",
      }));
    } else if(filtersSearch.value.rol){

      dataTable.value = dataTable.value.filter((user) =>
        user.roles.some((rol) => rol.nombre === filtersSearch.value.rol)
      );
    } else {
      dataTable.value = dataResponse.value.map(({ enabled, ...restOfUser }) => ({
        ...restOfUser,
        enabled: enabled ? "Activo" : "Inactivo",
      }));

    }


    if (filtersSearch.value.nombre) {
      dataTable.value = dataTable.value.filter((user) =>
        user.firstname
          .toLowerCase()
          .includes(filtersSearch.value?.nombre?.toLowerCase() ?? '') || user.lastname.toLowerCase().includes(filtersSearch.value?.nombre?.toLowerCase() ?? '')
      );
    }

    if (filtersSearch.value.userName) {
      dataTable.value = dataTable.value.filter((user) =>
        user.userName.toLowerCase().includes(filtersSearch.value?.userName?.toLowerCase() ?? '')
      );
    }

    if (filtersSearch.value.oficina) {
      dataTable.value = dataTable.value.filter((user) =>
        user.usuarioRelaciones.some((us) => us?.oficina?.id === filtersSearch.value.oficina)
      );
    }


  }
};

watch(() => filtersSearch.value.dependencia, (newValue) => {

  oficinasOptions.value = [];
  filtersSearch.value.oficina = "";

  if (!newValue) return;

  const oficinasFiltered = oficinas.value.filter(
    (oficina) => oficina.dependencia?.idSeccionSubSeccion === newValue
  );
  oficinasOptions.value = oficinasFiltered.map((oficina) => ({
    label: oficina.nombre,
    value: oficina.id,
  }));

});


const routes = [
  {
    name: "Inicio",
    to: "/home",
  },
  {
    name: "Administración",
  },
  {
    name: "Usuarios",
    to: "/SGDA/administracion/usuarios",
  },
];
</script>
