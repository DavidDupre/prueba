<template>
  <section class="tw-px-5 tw-flex tw-flex-row tw-bg-bg">
    <main class="tw-w-full tw-p-7 tw-pt-0">
      <div class="tw-flex tw-justify-between tw-items-center">
        <span class="tw-font-bold tw-text-3xl tw-my-5">Juzgados</span>

        <router-link to="/juzgados/crear">
          <q-btn label="Crear Juzgado" color="primary" icon="add" class="tw-h-10 tw-rounded-lg" />
        </router-link>
      </div>

      <q-card class="tw-rounded-xl tw-p-4" flat bordered>
        <q-expansion-item default-opened>
          <template v-slot:header>
            <div class="col row">
              <b class="tw-text-lg">Filtrar por</b>
            </div>
          </template>

          <q-card>
            <div class="row q-col-gutter-md q-pb-lg q-px-md">
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">Departamento</span>

                  <q-select v-model="filtro.departamento" input-debounce="0" label="Seleccione"
                    :options="optionsDepartamentos" dense outlined class="tw-rounded-lg">
                  </q-select>
                </label>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">Municipio</span>

                  <q-select v-model="filtro.municipio" input-debounce="0" label="Seleccione" :options="optionsMunicipios"
                    dense outlined class="tw-rounded-lg">
                  </q-select>
                </label>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <span class="tw-w-full">
                  <label class="tw-text-label">Nombre del Juzgado</label>
                  <q-input type="search" v-model="filtro.nombre" label="Inserte" dense outlined class="tw-rounded-lg" :rules="[v => maxLengthInput(200, v)]">
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </span>
              </div>
            </div>

            <div class="row tw-flex tw-justify-center tw-gap-6 [&>*]:tw-p-2">
              <q-btn label="Limpiar Filtros" color="accent" textColor="black" class="tw-h-10 tw-w-40" @click="handleResetFilters" />
              <q-btn label="Buscar" color="primary" class="tw-h-10 tw-w-40" @click="handleSearch" />
            </div>
          </q-card>
        </q-expansion-item>
      </q-card>

      <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat bordered>
        <div class="flex items-center justify-between q-px-md q-mb-sm row col-12">
          <span class="text-weight-bold text-h5" style="color: #2c3948">Listado de Juzgados</span>
        </div>
        <TableJuzgados class="full-width" :JUZGADOS_HEADER="JUZGADOS_HEADER" :JUZGADOS_BODY="filteredDataTable"
        @handle-edit-data="(id: any) => router.push(`/juzgados/editar/${id}`)" />
      </q-card>
    </main>
  </section>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { JUZGADOS_HEADER, Filtro } from './index'
import TableJuzgados from './Table.vue';
import { adminAxios, sgdeaAxios } from 'src/services';
import { BonitaAPI, SelectInput } from 'src/interfaces';
import { useMunicipalities } from 'src/composables/useVersion';
import { useRouter } from 'vue-router';
import { maxLengthInput } from 'src/helpers/validations';
import { toast } from 'src/helpers/toast';

const router = useRouter();

interface JuzgadosResponse {
  idJuzgado: number;
  nombre: string;
  direccion: string;
  pais: string;
  departamento: string;
  municipio: string;
  codigo: string;
  telefono: string;
  celular: string;
  correo: string;
  estado: boolean
}

interface DataTable {
  id: number;
  nombre: string;
  departamento: string;
  municipio: string;
  estado: boolean;
}

const filtro = ref<Filtro>({
  departamento: '',
  municipio: '',
  nombre: '',
});

const optionsDepartamentos = ref<SelectInput[]>([]);
const optionsMunicipios = ref<[]>([]);
const dataTable = ref<DataTable[]>([]);
const filteredDataTable = ref<DataTable[]>([]);

const sortOptions = (vals) => {
  return vals.sort((leftItem, rightItem) => {
    const nombreA = leftItem.label.toLowerCase().trim();
    const nombreB = rightItem.label.toLowerCase().trim();

    if (nombreA < nombreB) {
      return -1;
    }

    if (nombreA > nombreB) {
      return 1;
    }

    return 0;
  });
}

const getData = async () => {
  const response = await sgdeaAxios.get<JuzgadosResponse[]>('/juzgados/');
  dataTable.value = response.data.sort((a, b) => a.nombre.localeCompare(b.nombre)).map(({idJuzgado,nombre,departamento, municipio, estado, codigo}) => ({
    id: idJuzgado,
    nombre,
    departamento,
    municipio,
    estado,
    codigo
  }));
  filteredDataTable.value = [...dataTable.value];

  const {
    data: dptos,
  }: {
    data: BonitaAPI & { idDepartamento: number; nombre: string }[];
  } = await adminAxios.get("/departamentos/list/425");

  optionsDepartamentos.value = sortOptions(dptos.map((item) => {
    return ({
      label: item.nombre,
      value: item.idDepartamento,
    })
  }));
}

const handleResetFilters = async () => {
  filtro.value = {
    departamento: '',
    municipio: '',
    nombre: '',
  };
  optionsMunicipios.value = []
  getData();
}

const handleSearch = async () => {
  if (Object.values(filtro.value).every(val => !val)) {
    toast.error('Por favor, seleccione al menos un filtro.');
    return;
  }

  let filteration = dataTable.value;

  const entries = Object.entries(filtro.value);
  entries.forEach(([key, val]) => {
    if (val) {
      if (key == 'departamento' || key == 'municipio') {
        filteration = filteration.filter((x) => x[key].toLowerCase() === val.label.toLowerCase());
      } else {
        filteration = filteration.filter((x) =>
          x[key].toLowerCase().includes(val.toLowerCase())
        );
      }
    }
  });
  filteredDataTable.value = filteration;
}

onMounted(getData);

watch(
  () => filtro.value.departamento,
  async (value) => {
    if (value) {
      // @ts-ignore
      const { optionsMunicipalities } = await useMunicipalities(value.value);
      optionsMunicipios.value = sortOptions(optionsMunicipalities.value);
    }
  }
);

</script>
