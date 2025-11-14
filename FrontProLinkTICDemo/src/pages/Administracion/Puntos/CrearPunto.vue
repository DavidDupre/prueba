<template>
  <section class="tw-flex tw-flex-row tw-bg-bg">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
      <div class="tw-pt-4">
        <router-link to="/administracion/puntos-radicacion">
          <q-btn flat color="primary" label="Volver" icon="chevron_left" />
        </router-link>
      </div>

      <div class="tw-flex tw-justify-between tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold">Crear punto de radicación</h1>
      </div>

      <q-form ref="formValidate" greedy >
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <q-expansion-item expand-separator default-opened>
            <template v-slot:header>
              <div class="col row">
                <p class="tw-text-2xl tw-font-bold">
                  Datos punto de radicación
                </p>
              </div>
            </template>

            <div class="tw-mt-2">
              <div class="row q-col-gutter-md q-pb-md q-px-md">

                <div class="col-12">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Dependencia </label>
                    <q-select :rules="[v => inputRequired(v)]" v-model="form.idDependencia" label="Seleccione" dense outlined map-options emit-value
                      use-input fill-input hide-selected @filter="selectOptionsFilterFnDependencias" class="tw-rounded-lg" :options="dependenciasOptions">

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

                <div class="col-12">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Sucursal o Gerencia </label>
                    <q-select :rules="[]" v-model="form.sucursal"  label="Seleccione" dense outlined map-options emit-value
                      use-input fill-input hide-selected @filter="selectOptionsFilterFnSucursales" class="tw-rounded-lg" :options="sucursalesOptions">

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

                <!-- País, Departamento y Municipio -->
                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <span class="tw-w-full">
                    <label class="tw-text-label">País *</label>
                    <q-select :rules="[v => inputRequired(v.label)]" v-model="form.pais" name="pais" label="Seleccione" dense outlined map-options emit-value
                      class="tw-rounded-lg" :options="optionsPaises" disable/>
                  </span>
                </div>
                <!-- <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Departamento *</label>
                    <q-select v-model="form.departamento" name="departamento" label="Seleccione" dense outlined class="tw-rounded-lg"
                      :rules="[v => inputRequired(v.label)]" :options="optionsDepartamentos" :disable="isntColombia">
                    </q-select>
                  </span>
                </div> -->
                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <label class="tw-w-full">
                    <span class="tw-text-label">Departamento *</span>
                    <q-select use-input fill-input hide-selected v-model="form.departamento" input-debounce="0" label="Seleccione"
                      :rules="[v => inputRequired(v.label)]" :options="optionsDepartamentos" dense outlined class="tw-rounded-lg" @filter="selectOptionsFilterFnDepartment" :disable="isntColombia">
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

                <!-- <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Municipio *</label>
                    <q-select v-model="form.municipio" label="Seleccione" dense outlined class="tw-rounded-lg"
                      :rules="[v => inputRequired(v.label)]" :options="optionsMunicipios" :disable="isntColombia">
                    </q-select>
                  </span>
                </div> -->

                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <label class="tw-w-full">
                    <span class="tw-text-label">Municipio *</span>
                    <q-select v-model="form.municipio" input-debounce="0" label="Seleccione" :options="optionsMunicipios"
                      dense outlined class="tw-rounded-lg" use-input fill-input :rules="[v => inputRequired(v.label)]" hide-selected @filter="selectOptionsFilterFnMunicipality">
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

                <!-- Nombre del punto y Seleccion de es un punto -->
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">¿Es un punto de radicación? *</label>
                    <q-select :rules="[v => inputRequired(v.label)]" v-model="form.isPoint"  label="Seleccione" dense outlined map-options emit-value
                      class="tw-rounded-lg" :options="optionsIsPoint"/>
                  </span>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Nombre del punto *</label>
                    <q-input v-model="form.nombre" dense outlined label="Ingrese" class="tw-rounded-lg" :rules="[(v) => maxLengthInput(100, v), inputRequired]" />
                  </span>
                </div>

                <!-- Estado y Codigo -->
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Estado *</label>
                    <div>
                      <q-toggle v-model="form.estado" color="primary" />
                    </div>
                  </span>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Código centro de costo *</label>
                    <q-input v-model="form.codigo" dense outlined label="Ingrese" class="tw-rounded-lg" :rules="[(v) => maxLengthInput(10, v), onlyNumbers, inputRequired]" />
                  </span>
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-card>

        <div class="col row justify-center q-gutter-x-md q-my-md">
          <q-btn color="accent" textColor="secondary" label="Cancelar" style="width: 130px;height: 40px;border-radius: 8px;font-size: 16px;" no-caps @click="showModal= true" />
          <q-btn color="primary" label="Crear" style="width: 130px;height: 40px;border-radius: 8px;font-size: 16px;" @click="handleSubmit" />
        </div>
      </q-form>

      <Modal v-model:model-value="showModal" title="Confirmación" persistent
        :text="`¿Está seguro de cancelar la creación del punto de radicación en curso?`"
        :is-success="false" :cancelButton="true" @handle-accept="handleCancel" textButtonCancel="No"
        text-button="Si"  />
    </main>
  </section>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import {  useRouter } from 'vue-router';
import {  inputRequired, maxLengthInput,onlyNumbers,} from 'src/helpers/validations';
import { BonitaAPI, SelectInput } from 'src/interfaces';
import { adminAxios, sgdeaAxios } from 'src/services';
import { useDepartments, useMunicipalities } from "src/composables/useVersion";
import { toast } from 'src/helpers/toast';
import Modal from 'src/components/Modal/Modal.vue'
import { PuntoRadicacion, objResponse } from './index';
import { getURLFilter, mapDependencias, mapSucursales } from './utils/index';

const showModal = ref(false);
const router = useRouter();
const formValidate = ref();
const form = ref({
  departamento: { label: '', value: ''},
  municipio: { label: '', value: ''},
  pais: "Colombia",
  codigo: '',
  nombre: '',
  estado: false,
  isPoint: {label: '', value: ''},
  sucursal: {label: 'N/A', value: 26},
  idDependencia: ''
});
const optionsPaises = ref<SelectInput[]>([]);
const optionsDepartamentos = ref<SelectInput[]>([]);
const departmentsOptionsStatic = ref<SelectInput[]>([]);
const optionsMunicipios = ref<SelectInput[]>([]);
const municipalitiesStatic = ref<SelectInput[]>([]);
const isntColombia = ref<boolean>(false);
const optionsIsPoint=ref<SelectInput[]>([
  { label: 'No', value: false },
  { label: 'Si', value:  true }
]);

const sucursalesOptions = ref<SelectInput[]>([]);
const dependenciasOptions = ref<SelectInput[]>([]);
const sucursalesOptionsStatic = ref<SelectInput[]>([]);
const dependenciasOptionsStatic = ref<SelectInput[]>([]);
const sucursalesRaw = ref()

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
  const {
    data: dptos,
  }: {
    data: BonitaAPI & { idDepartamento: number; nombre: string }[];
  } = await adminAxios.get("/departamentos/list/425");

  const {data:sucursales}= await sgdeaAxios.get('/oficinas/all');
  sucursalesRaw.value = sucursales
  sucursalesOptionsStatic.value= mapSucursales(sucursales);

  const { data: dependencias } = await sgdeaAxios.get('/seccionSubSeccion');
  dependenciasOptionsStatic.value = mapDependencias(dependencias);

  const { data: formData } = await adminAxios.get<{
    idMunicipio: number,
    nombre: string,
    codigoDivipola: string
  }[]>("/municipios/list");

  const { data: paisesData } = await adminAxios.get<{ idPais: number; nombre: string }[]>("/paises/list");

  departmentsOptionsStatic.value = sortOptions(dptos.map((item) => {
    return ({
      label: item.nombre,
      value: item.idDepartamento,
    })
  }));

  const sortedMunicipios = formData.sort((leftMunicipio, rightMunicipio) => {
    const nombreA = leftMunicipio.nombre.toLowerCase().trim();
    const nombreB = rightMunicipio.nombre.toLowerCase().trim();

    if (nombreA < nombreB) {
      return -1;
    }

    if (nombreA > nombreB) {
      return 1;
    }

    return 0;
  });

  municipalitiesStatic.value = sortedMunicipios.map(({ nombre }) => {
    return {
      label: nombre,
      value: nombre
    };
  });

  const sortedPaises = paisesData.sort((leftMunicipio, rightMunicipio) => {
    const nombreA = leftMunicipio.nombre.toLowerCase().trim();
    const nombreB = rightMunicipio.nombre.toLowerCase().trim();

    if (nombreA < nombreB) {
      return -1;
    }

    if (nombreA > nombreB) {
      return 1;
    }

    return 0;
  });

  optionsPaises.value = sortedPaises.map(({ nombre }) => {
    return {
      label: nombre,
      value: nombre
    }
  });
};
const handleSubmit = async () => {
    if (!(await formValidate.value.validate())) {
      toast.error(objResponse.campos_obligatorios);
      return;
    }

    const path=getURLFilter({departamento: form.value.departamento.label, municipio: form.value.municipio.label})
    const {data}=await sgdeaAxios.get<PuntoRadicacion[]>(path)

    let puntosFiltrados: PuntoRadicacion[] = [];
    if(data.length>0){
      puntosFiltrados=data.filter((punto)=>{
        if(punto.oficinaId.id === (form.value.sucursal as any)){
          return punto;
        }
      })
    }
    if(puntosFiltrados.length>0){
      toast.error(puntosFiltrados[0].activo ? objResponse.punto_existente_activo : objResponse.punto_existente_inactivo);
      return;
    }

    const dataCrear = {
      nombrePunto: form.value.nombre,
      departamento: form.value.departamento.label,
      municipio: form.value.municipio.label,
      activo: form.value.estado,
      codCentroCosto: +form.value.codigo,
      puntoRadicacion: form.value.isPoint,
      oficinaId: form.value.sucursal.value ? form.value.sucursal.value : form.value.sucursal,
      idDependencia: form.value.idDependencia
    };

    try {
      await sgdeaAxios.post('/correspondencia/puntoRadicacion/crear', dataCrear)
      toast.success(objResponse.creacion_exitosa);
      await router.push('/administracion/puntos-radicacion');
    } catch (error) {
      toast.error( error.response.status === 400 || error.response.status === 409 ? `${error.response.data.message.includes('duplicate key value violates unique constraint') ? 'El punto de radicación que está intentando crear ya existe y se encuentra activo' : error.response.data.message}` : objResponse.default)
    }
};
onMounted(getData);

watch(
  () => form.value.pais,
  (value) => {
    let val = value as unknown as string
    form.value.departamento.label = ''
    form.value.municipio.label = ''
    if (val.toLowerCase() == 'colombia') {
      isntColombia.value = false
      // @ts-ignore
      const { optionsDepartments } = useDepartments(425);
      departmentsOptionsStatic.value = sortOptions(optionsDepartments.value);

    } else {
      // @ts-ignore
      form.value.departamento = { label: val, value: value }
      // @ts-ignore
      form.value.municipio = { label: val, value: value }
      isntColombia.value = true
    }

  }
);

watch(
  () => form.value.departamento,
  async (value) => {
    // @ts-ignore
    // if (!isntColombia.value) {
    //   form.value.municipio.label = ''
    // }
    form.value.municipio= { label: '', value: ''}

    // @ts-ignore
    const { optionsMunicipalities } = await useMunicipalities(value.value);
    municipalitiesStatic.value = sortOptions(optionsMunicipalities.value)
  }
);

const clear = () => {
  form.value = {
    departamento: { label: '', value: ''},
    municipio: { label: '', value: ''},
    pais: "Colombia",
    codigo: '',
    nombre: '',
    estado: false,
    isPoint: {label: '', value: ''},
    sucursal: {label: 'N/A', value: 26},
    dependencias: { label: '', value: ''}
  };
};

const handleCancel = () => {
  clear();
  router.push('/administracion/puntos-radicacion');
}

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
const selectOptionsFilterFnSucursales = (val, update) => {
  if (val == '') {
    update(() => {
      sucursalesOptions.value = sucursalesOptionsStatic.value
    })
    return
  }

  update(() => {
    sucursalesOptions.value = sucursalesOptionsStatic.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};
const selectOptionsFilterFnDependencias = (val, update) => {
  if (val == '') {
    update(() => {
      dependenciasOptions.value = dependenciasOptionsStatic.value
    })
    return
  }

  update(() => {
    dependenciasOptions.value = dependenciasOptionsStatic.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

watch(() => form.value.idDependencia, (newValue) => {
  sucursalesOptions.value = [];
  //filtersSearch.value.oficina = "";

  const oficinasFiltered = sucursalesRaw.value.filter((oficina) =>
  oficina.dependencia?.idSeccionSubSeccion == newValue
);
  sucursalesOptionsStatic.value = mapSucursales(oficinasFiltered)
  sucursalesOptions.value = mapSucursales(oficinasFiltered)
});

</script>
