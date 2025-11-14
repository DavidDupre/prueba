<template>
  <div>
    <div class="tw-float-right">
      <q-btn icon="add"
        class="tw-bg-[#ff7500] tw-h-10 tw-w-36 tw-text-white tw-font-bold tw-rounded-lg hover:tw-bg-[#dc7347]"
        @click="router.push('prefijos/crear')">Crear
        Prefijo</q-btn>
    </div>
    <h2 class="tw-font-bold tw-text-2xl tw-pb-6">Búsqueda de prefijos</h2>
    <q-card flat class="tw-p-4 tw-mb-6 tw-rounded-xl">
      <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2">Filtrar por</h2>
      <div class="tw-grid tw-grid-cols-4 tw-gap-4">
        <div class="tw-col-span-2">
          <p class="tw-text-label tw-font-semibold">Prefijo</p>
          <q-select :options="filteredPrefijos" outlined v-model='formData.prefijo' label="Inserte" dense
            @filter="filterPrefijos" use-input fill-input hide-selected hide-dropdown-icon :error="active"
            :error-message="'Máximo 6 caracteres'" />
        </div>
        <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 tw-col-span-2">
          <label class="tw-w-full">
            <p class="tw-text-label tw-font-semibold">Estado</p>
            <q-select :options="estadoOptions" v-model="formData.estado" emit-value label="Seleccione" dense outlined
              class="tw-rounded-lg" map-options input-debounce="0">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template> </q-select>
          </label>
        </div>
      </div>
      <br />
      <div class="row tw-flex tw-justify-center tw-gap-6 [&>*]:tw-p-2 tw-h-10">
        <q-btn label="Limpiar filtros" color="accent" textColor="black" class="tw-rounded-lg col-2"
          @click="resetForm" />
        <q-btn label="Buscar" color="primary" class="tw-rounded-lg col-2" @click="search" />
      </div>
    </q-card>
    <q-card flat class="tw-p-4 tw-rounded-xl">
      <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2">Listado de prefijos</h2>
      <div :key="key" class="my-custom-table">
        <TablePrefijos :key="tableKey" :TABLE_HEADER="ASIGNACION_HEADER" :TABLE_BODY="dataTable"
          :TABLE_TOTAL_ROWS="dataTableTotalRows" :selection="undefined" :isLoading="loadingTable"
          v-model:item-selected="selection" @handle-edit-data="handleCaso" @handlePageChange="handlePageChange"
          @handleRowsPerPageChange="handleRowsPerPageChange" icon="edit" />
      </div>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import TablePrefijos from './TablePrefijos.vue';
import { ASIGNACION_HEADER } from '.';
import { useRouter } from 'vue-router';
import { sgdeaAxios } from "src/services";
import { toast } from 'src/helpers/toast';
import { fourthFormatDate } from 'src/helpers/formtDate';

const router = useRouter()
const dataTable = ref([]);
const key = ref(0);
const tableKey = ref(0)
const dataTableTotalRows = ref(0);
const selection = ref([]);
const formData = ref({
  prefijo: '',
  estado: ''
})
const listadoPrefijos = ref()
const filteredPrefijos = ref()
const estadoOptions = ref([
  { label: 'Activo', value: true },
  { label: 'Inactivo', value: false }
])
let loadingTable = ref(false);
const active = ref(false)

onMounted(async () => {
  await getPrefijos(0, 20)
})

const getPrefijos = async (page: number, size: number) => {
  try {
    const response = await sgdeaAxios.get('/medicina/prefijos/paginate', {
      params: {
        page: page,
        size: size
      }
    });

    dataTable.value = response.data.content
    .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
    .map(prefijo => {
      return {
        ...prefijo,
        fecha_c: fourthFormatDate(prefijo.fechaCreacion) === 'Invalid date' ? '-' : fourthFormatDate(prefijo.fechaCreacion),
        usuario: prefijo.usuario ? `${prefijo?.usuario?.firstname} ${prefijo?.usuario?.lastname}` : '-'
      }
    }).filter(e => e.id !== 1)

    listadoPrefijos.value = response.data.content.map((e) => {
      return {
        label: e.nombre,
        value: e.id,
      }
    }).filter(e => e.value !== 1)


    dataTableTotalRows.value = response.data.totalPages
  } catch (error) {
    console.error(error);
  }
}

const handleCaso = (id) => {
  router.push(`prefijos/${id}`)
}

const handlePageChange = async (event) => {
  await getPrefijos(event.page - 1, event.rowsPerPage)
}

const handleRowsPerPageChange = async (event) => {
  await getPrefijos(event.page, event.rowsPerPage)
}

const resetForm = () => {
  formData.value = {
    estado: '',
    prefijo: '',
  }
  active.value = false
  getPrefijos(0, 20)
}

const search = async () => {
  try {
    const filter = {
      activo: formData.value?.estado,
      // @ts-ignore
      nombre: formData.value?.prefijo.label
    };

    if (active.value) {
      return
    }

    if (Object.values(filter).every(val => (val === '' || val === undefined))) {
      toast.error('Por favor, seleccione al menos un filtro.');
      return;
    }

    const filterKeys = Object.keys(filter);
    const filteredFilter = filterKeys.reduce((acc, key) => {
      if (filter[key] || filter[key] === false) {
        acc[key] = filter[key];
      }
      return acc;
    }, {});

    const { data: response } = await sgdeaAxios.post('medicina/buscarFlt', filteredFilter)
    dataTable.value = response.map(prefijo => {
      return {
        ...prefijo,
        fecha_c: fourthFormatDate(prefijo.fechaCreacion) === 'Invalid date' ? '-' : fourthFormatDate(prefijo.fechaCreacion),
        usuario: prefijo.usuario ? `${prefijo?.usuario?.firstname} ${prefijo?.usuario?.lastname}` : '-'

      }
    })
    listadoPrefijos.value = response.map((e) => {
      return {
        label: e.nombre,
        value: e.id,
      }
    })
  } catch (error) {
    toast.error(error.message)
  }
}

const filterPrefijos = (val: string, update: any) => {
  if (val.length > 6) {
    active.value = true
  } else {
    active.value = false
  }

  if (val == '') {
    update(() => {
      filteredPrefijos.value = listadoPrefijos.value
    })
    return
  }
  update(() => {
    filteredPrefijos.value = listadoPrefijos.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

</script>

<style scoped lang="scss">
.my-custom-table {
  &::v-deep {
    .q-table__sort-icon {
      opacity: 1;
    }

    th {
      text-align: center;
    }
  }
}
</style>
