<template>
  <section class="tw-px-5 tw-flex tw-flex-row tw-bg-bg">
    <main class="tw-w-full tw-p-7 tw-pt-0">
      <div class="tw-flex tw-justify-between tw-items-center">
        <span class="tw-font-bold tw-text-3xl tw-my-5">Puntos de radicación</span>

        <router-link to="/administracion/puntos-radicacion/crear">
          <q-btn label="Crear punto de radicación" color="primary" icon="add" class="tw-h-10 tw-rounded-lg" />
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
                <span class="tw-w-full">
                  <label class="tw-text-label">Nombre del punto</label>

                  <q-select emit-value use-input fill-input hide-selected v-model="filtro.nombre" label="Seleccione"
                    :options="optionsName" dense outlined class="tw-rounded-lg" @filter="selectOptionsFilterFn"
                    >
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>

                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No se encontraron resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                </span>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">Departamento</span>
                  <q-select use-input fill-input hide-selected  v-model="filtro.departamento" input-debounce="0" label="Seleccione"
                    :options="optionsDepartamentos" dense outlined class="tw-rounded-lg" @filter="selectOptionsFilterFnDepartment">
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No se encontraron resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </label>
              </div>

              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">Municipio</span>
                  <q-select v-model="filtro.municipio" input-debounce="0" label="Seleccione" :options="optionsMunicipios"
                    dense outlined class="tw-rounded-lg" use-input fill-input hide-selected @filter="selectOptionsFilterFnMunicipality">
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No se encontraron resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </label>
              </div>

            </div>

            <div class="row tw-flex tw-justify-center tw-gap-6 [&>*]:tw-p-2">
              <q-btn label="Limpiar filtros" color="accent" textColor="black" class="tw-h-10 tw-w-40" @click="handleResetFilters" />
              <q-btn label="Buscar" color="primary" class="tw-h-10 tw-w-40" @click="handleSearch" />
            </div>
          </q-card>
        </q-expansion-item>
      </q-card>

      <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat bordered>
        <div class="flex items-center justify-between q-px-md q-mb-sm row col-12">
          <span class="text-weight-bold text-h5" style="color: #2c3948">Listado puntos de radicación</span>
        </div>
        <TableJuzgados @updated-status="updatedStatus" class="full-width" :JUZGADOS_HEADER="PUNTOS_HEADER" :JUZGADOS_BODY="filteredDataTable" />
      </q-card>
    </main>
  </section>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { Filtro, PUNTOS_HEADER, PuntoRadicacion } from './index';
import TableJuzgados from './Table.vue';
import { adminAxios, sgdeaAxios } from 'src/services';
import { BonitaAPI, SelectInput } from 'src/interfaces';
import { useMunicipalities } from 'src/composables/useVersion';
import { useRouter } from 'vue-router';
import { maxLengthInput } from 'src/helpers/validations';
import { getURLFilter } from './utils';
import { toast } from 'src/helpers/toast';


const router = useRouter();

interface DataTable {
  id: number;
  sucursal: string;
  departamento: string;
  municipio: string;
  pais: string;
  is_point: string;
  point_name: string;
  point_code: number;
  estado: boolean;

}


function updatedStatus(status){
  filteredDataTable.value[status.index].estado = status.status
}

const filtro = ref<Filtro>({
  departamento: '',
  municipio: '',
  nombre: '',
});

const optionsName=ref<SelectInput[]>([]);
const optionsNameStatic = ref<SelectInput[]>([]);
const optionsDepartamentos = ref<SelectInput[]>([]);
const departmentsOptionsStatic = ref<SelectInput[]>([]);
const optionsMunicipios = ref<SelectInput[]>([]);
const municipalitiesStatic = ref<SelectInput[]>([]);
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

const mapPuntosRadicacion = (puntos: PuntoRadicacion[]):DataTable[] => {
  return puntos.map((punto) => {
    return {
      id: punto.id,
      id_dependencia: punto.id_dependencia,
      sucursal: punto.oficinaId.nombre,
      departamento: punto.departamento,
      municipio: punto.municipio,
      pais: punto.pais || 'Colombia',
      is_point: punto.puntoRadicacion ? 'Si' : 'No',
      point_name: punto.nombrePunto,
      point_code: punto.codCentroCosto,
      estado: punto.activo
    }
  })
}

const getData = async () => {

  const {data:puntos}=await sgdeaAxios.get<PuntoRadicacion[]>('/correspondencia/puntoRadicacion/listado');

  optionsNameStatic.value = sortOptions(puntos.map((item) => {
    return ({
      label: item.nombrePunto,
      value: item.nombrePunto,
    })
  }))

  dataTable.value = mapPuntosRadicacion(puntos);

  filteredDataTable.value = [...dataTable.value];

  const {
    data: dptos,
  }: {
    data: BonitaAPI & { idDepartamento: number; nombre: string }[];
  } = await adminAxios.get("/departamentos/list/425");

  departmentsOptionsStatic.value = sortOptions(dptos.map((item) => {
    return ({
      label: item.nombre,
      value: item.idDepartamento,
    })
  }))


}

const handleResetFilters = async () => {
  filtro.value = {
    departamento: '',
    municipio: '',
    nombre: '',
  };

  getData();
}

const handleSearch = async () => {

  if (Object.values(filtro.value).every(val => !val)) {
    toast.error('Por favor, seleccione al menos un filtro.');
    return;
  }

  let filteration = dataTable.value;

  const entries = Object.entries(filtro.value);
  const entriesFiltered = entries.filter(([_, val]) => val);

  const dataObjet=entriesFiltered.reduce((acc, [key, val]) => {
    if (key == 'departamento' || key == 'municipio') {
      //@ts-ignore
      return {...acc, [key]: val.label}
    }
    return {...acc, [key]: val}
  }, {})

  const path=getURLFilter({...dataObjet});
  const {data}=await sgdeaAxios.get<PuntoRadicacion[]>(path)
  filteration = mapPuntosRadicacion(data);
  // entries.forEach(([key, val]) => {
  //   if (val) {
  //     if (key == 'departamento' || key == 'municipio') {
  //       filteration = filteration.filter((x) => x[key].toLowerCase() === val.label.toLowerCase());
  //     } else {
  //       filteration = filteration.filter((x) =>
  //         x[key].toLowerCase().includes(val.toLowerCase())
  //       );
  //     }
  //   }
  // });
  filteredDataTable.value = filteration;
}

onMounted(getData);

watch(
  () => filtro.value.departamento,
  async (value) => {
    if (value) {
      // @ts-ignore
      const { optionsMunicipalities } = await useMunicipalities(value.value);
      municipalitiesStatic.value = sortOptions(optionsMunicipalities.value);
    }
  }
);

const selectOptionsFilterFn = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      optionsName.value = optionsNameStatic.value
    })
    return
  }

  if (val == '') {
    return
  }

  update(() => {
    optionsName.value = optionsNameStatic.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};


const selectOptionsFilterFnDepartment = (val, update) => {
  if (val == '') {
    update(() => {
      optionsDepartamentos.value = departmentsOptionsStatic.value
    })
    return
  }
  update(() => {
    optionsDepartamentos.value = departmentsOptionsStatic.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const selectOptionsFilterFnMunicipality = (val, update) => {
  if (val == '') {
    update(() => {
      optionsMunicipios.value = municipalitiesStatic.value
    })
    return
  }

  update(() => {
    optionsMunicipios.value = municipalitiesStatic.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};


</script>
