<template>
  <section class="tw-px-5 tw-flex tw-flex-row tw-bg-bg">
    <main class="tw-w-full tw-p-7 tw-pt-0">
      <div class="tw-flex tw-justify-between tw-items-center">
        <span class="tw-font-bold tw-text-3xl tw-my-5">Juntas Eps y Arl</span>

        <router-link to="/juntas-eps-arl/crear">
          <q-btn label="Crear" color="primary" icon="add" class="tw-rounded-lg !tw-pr-[15px] !tw-py-1" />
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

                  <q-select v-model="filtro.nombreDepartamento" input-debounce="0" label="Seleccione"
                    :options="optionsDepartamentos" dense outlined class="tw-rounded-lg">
                  </q-select>
                </label>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">Municipio</span>

                  <q-select v-model="filtro.nombreMunicipio" input-debounce="0" label="Seleccione"
                    :options="optionsMunicipios" dense outlined class="tw-rounded-lg">
                  </q-select>
                </label>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <span class="tw-w-full">
                  <label class="tw-text-label">Nombre del Remitente</label>
                  <q-input type="search" v-model="filtro.nombreRemitente" label="Inserte" dense outlined class="tw-rounded-lg"
                    :rules="[v => maxLengthInput(200, v)]" />
                </span>
              </div>
            </div>

            <div class="row tw-flex tw-justify-center tw-gap-6 [&>*]:tw-p-2">
              <q-btn label="Limpiar Filtros" color="accent" textColor="black" class="tw-h-10 tw-w-40"
                @click="handleResetFilters" />
              <q-btn label="Buscar" color="primary" class="tw-h-10 tw-w-40" @click="handleSearch" />
            </div>
          </q-card>
        </q-expansion-item>
      </q-card>

      <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat bordered>
        <div class="flex items-center justify-between q-px-md q-mb-sm row col-12">
          <span class="text-weight-bold text-h5" style="color: #2c3948">Listado de Juntas Eps y Arl</span>
        </div>
        <TableJuntas class="full-width" :TABLE_HEADER="TABLE_HEADER" :TABLE_BODY="filteredDataTable"
          :totalPages="totalPage" @handlePageChange="handlePageChange" @refresh="getData()"
          @handleRowsPerPageChange="handleRowsPerPageChange" :pagination="pagination" />
      </q-card>
    </main>
  </section>
</template>
<script lang="ts" setup>
import { TABLE_HEADER, Filtro } from 'src/pages/Juntas-eps-arl'
import { useMunicipalities } from 'src/composables/useVersion';
import TableJuntas from 'src/pages/Juntas-eps-arl/Table.vue';
import { maxLengthInput } from 'src/helpers/validations';
import { adminAxios, sgdeaAxios } from 'src/services';
import { SelectInput } from 'src/interfaces';
import { ref, onMounted, watch } from 'vue';
import { toast } from 'src/helpers/toast';

interface DataTable {
  departamento: string;
  municipio: string;
  estado: boolean;
  nombre: string;
  id: number;
}

const filtro = ref<Filtro>({
  nombreDepartamento: { label: '', value: 0 },
  nombreMunicipio: { label: '', value: 0 },
  nombreRemitente: '',
});

const currPage = ref(0)
const totalPage = ref(0)

let pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 0,
  rowsPerPage: 20,
  rowsNumber: 0
});

const optionsDepartamentos = ref<SelectInput[]>([]);
const filteredDataTable = ref<DataTable[]>([]);
const dataTable = ref<DataTable[]>([]);
const optionsMunicipios = ref<[]>([]);

const sortOptions = (vals) => {
  return vals.sort((leftItem, rightItem) => {
    const nombreA = leftItem.label.toLowerCase().trim();
    const nombreB = rightItem.label.toLowerCase().trim();
    if (nombreA < nombreB) return -1;
    if (nombreA > nombreB) return 1;
    return 0;
  });
}

const getData = async () => {
  const response = await sgdeaAxios.get('medicina/juntas-eps-arl/listado', {
    params: { 
      pageSize: pagination.value.rowsPerPage, 
      pageNumber: pagination.value.page, 
      nombreDepartamento: filtro.value.nombreDepartamento.label,
      nombreMunicipio: filtro.value.nombreMunicipio.label,
      nombreRemitente: filtro.value.nombreRemitente,
    }
  });
  dataTable.value = response.data.content.sort((a, b) => a.nombreRemitente.localeCompare(b.nombreRemitente));
  filteredDataTable.value = [...dataTable.value];
  pagination.value.rowsPerPage = response.data.size;
  pagination.value.page = response.data.number;
  totalPage.value = response.data.totalPages;
}

const getDepartamentoMunicipio = async () => {
  const { data: dptos, }: any = await adminAxios.get("/departamentos/list");

  optionsDepartamentos.value = sortOptions(dptos.map((item) => {
    return ({
      label: item.nombre,
      value: item.idDepartamento,
    })
  }));
}

const handleResetFilters = () => {
  filtro.value = {
    nombreDepartamento: { label: '', value: 0 },
    nombreMunicipio: { label: '', value: 0 },
    nombreRemitente: '',
  };

  getData();
}

const handlePageChange = (page: number) => {
  pagination.value.page = page
  currPage.value = page <= 0 ? 0 : page - 1;

  getData();
}

const handleRowsPerPageChange = (rowsPerPage: any) => {
  pagination.value.rowsPerPage = rowsPerPage;
  getData();
}

const handleSearch = async () => {
  if (!filtro.value.nombreDepartamento.label && !filtro.value.nombreMunicipio.label && !filtro.value.nombreRemitente) {
    toast.error('Por favor, seleccione al menos un filtro.');
    return;
  }

  getData()
}

watch(
  () => filtro.value.nombreDepartamento,
  async (value) => {
    if (value) {
      // @ts-ignore
      const { optionsMunicipalities } = await useMunicipalities(value.value);
      optionsMunicipios.value = sortOptions(optionsMunicipalities.value);
    }
  }
);
onMounted(async () => {
  getData();
  await getDepartamentoMunicipio();
})
</script>
