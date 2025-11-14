<template>
  <section class="tw-flex tw-flex-row tw-bg-bg">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
      <div class="tw-pt-4">
        <router-link to="/administracion/puntos-radicacion">
          <q-btn flat color="primary" label="Volver" icon="chevron_left" />
        </router-link>
      </div>

      <div class="tw-flex tw-justify-between tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold">Editar punto de radicación</h1>
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
                    <label class="tw-text-label">Dependencia</label>
                    <q-select :rules="[v => inputRequired(v.label)]" v-model="form.idDependencia"  label="Seleccione" dense outlined map-options emit-value
                      use-input fill-input hide-selected class="tw-rounded-lg" :options="dependenciasOptions" @filter="selectOptionsFilterFnDependencias">

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
                      use-input fill-input hide-selected class="tw-rounded-lg" :options="sucursalesOptions" @filter="selectOptionsFilterFnSucursales">

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


                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <label class="tw-w-full">
                    <span class="tw-text-label">Municipio *</span>
                    <q-select v-model="form.municipio" input-debounce="0" label="Seleccione" :options="optionsMunicipios"
                      dense outlined class="tw-rounded-lg" use-input fill-input hide-selected map-options :rules="[v => inputRequired(v.label)]" @filter="selectOptionsFilterFnMunicipality">
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
                    <label  class="tw-text-label">Nombre del punto *</label>
                    <q-input readonly v-model="form.nombre" dense outlined label="Ingrese" class="tw-rounded-lg" :rules="[(v) => maxLengthInput(100, v), inputRequired]" />
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
          <q-btn color="primary" label="Guardar cambios" :disabled="isFormUnchanged" style="height: 40px;border-radius: 8px;font-size: 16px;" @click="handleSubmit" />
        </div>
      </q-form>

      <Modal v-model:model-value="showModal" title="Confirmación" persistent
        :text="`¿Está seguro de cancelar la edición del punto de radicado '${namePoint}'?`"
        :is-success="false" :cancelButton="true" @handle-accept="handleCancel" textButtonCancel="No"
        text-button="Si"  />
    </main>
  </section>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { inputRequired, maxLengthInput,onlyNumbers } from 'src/helpers/validations';
import { BonitaAPI, SelectInput } from 'src/interfaces';
import { adminAxios, sgdeaAxios } from 'src/services';
import { useDepartments, useMunicipalities } from "src/composables/useVersion";
import { toast } from 'src/helpers/toast';
import Modal from 'src/components/Modal/Modal.vue'
import { PuntoRadicacion, objResponse } from './index';
import { mapDependencias, mapSucursales } from './utils';

interface FormInterface {
    departamento: {
        label: string;
        value: string | number | any;
    };
    municipio: {
        label: string;
        value: string | number | any;
    };
    pais: string;
    codigo: string;
    nombre: string;
    estado: boolean;
    isPoint: {
        label: string;
        value: string | boolean;
    }| any;
    sucursal: string | number;
    idDependencia: string | number;
}

const namePoint = ref('');
const comparationData = ref()
const municipalityLabel = ref('');
const showModal = ref(false);
const router = useRouter();
const route = useRoute();
const formValidate = ref();
const sucursalesRaw = ref()
const form = ref<FormInterface>({
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

const mapOfDataPuntoRadicacion= async (puntoRadicacionData:PuntoRadicacion)=>{


  namePoint.value = puntoRadicacionData.nombrePunto;

  const valueDepartment=  departmentsOptionsStatic.value.find((item) => {
    return item.label === puntoRadicacionData.departamento;
  });
  municipalityLabel.value = puntoRadicacionData.municipio;

  const { optionsMunicipalities } = await useMunicipalities(valueDepartment.value);
    municipalitiesStatic.value = sortOptions(optionsMunicipalities.value)

    const valueMunicipality=  municipalitiesStatic.value.find((item) => {
      return item.label === municipalityLabel.value;
    });

    if (valueMunicipality){

      form.value.municipio={label: municipalityLabel.value, value: valueMunicipality?.value || 1};

    }

  form.value = {
    ...form.value,
    departamento:{label: puntoRadicacionData.departamento, value: valueDepartment?.value || 1},
    pais: puntoRadicacionData.pais || 'Colombia',
    codigo: String(puntoRadicacionData.codCentroCosto),
    nombre: puntoRadicacionData.nombrePunto,
    estado: puntoRadicacionData.activo,
    isPoint:puntoRadicacionData.puntoRadicacion?true:false,
    sucursal: puntoRadicacionData.oficinaId.id,
    idDependencia: puntoRadicacionData.id_dependencia?.idSeccionSubSeccion
  };
  comparationData.value = JSON.parse(JSON.stringify(form.value));
}

const getData = async () => {
  //TODO: change the endpoint

  const {data:sucursales}= await sgdeaAxios.get('/oficinas/all');
  const {data:dependencias}= await sgdeaAxios.get('/seccionSubSeccion');
  sucursalesRaw.value = sucursales
  dependenciasOptions.value = mapDependencias(dependencias);
  sucursalesOptions.value= mapSucursales(sucursales);
  sucursalesOptionsStatic.value=[...sucursalesOptions.value]
  dependenciasOptionsStatic.value=[...dependenciasOptions.value]
  const {
    data: dptos,
  }: {
    data: BonitaAPI & { idDepartamento: number; nombre: string }[];
  } = await adminAxios.get("/departamentos/list");

  const { data: formData } = await adminAxios.get<{
    idMunicipio: number,
    nombre: string,
    // codigoDivipola: string
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

  const { data:puntoRadicacionData } = await sgdeaAxios.get<PuntoRadicacion>(`/correspondencia/puntoRadicacion/${route.params.id}`);
  mapOfDataPuntoRadicacion(puntoRadicacionData);

};
const handleSubmit = async () => {
    if (!(await formValidate.value.validate())) {
      toast.error(objResponse.campos_obligatorios);
      return;
    }

    const dataCrear = {
      nombrePunto: form.value.nombre,
      departamento: form.value.departamento.label,
      municipio: form.value.municipio.label,
      activo: form.value.estado,
      codCentroCosto: +form.value.codigo,
      puntoRadicacion: form.value.isPoint,
      oficinaId: form.value.sucursal,
      idDependencia: form.value.idDependencia
    };

    try {
      await sgdeaAxios.put(`/correspondencia/puntoRadicacion/actualizar/${route.params.id}`, dataCrear)
      toast.success(objResponse.edicion_exitosa);
      router.push('/administracion/puntos-radicacion');

    } catch (error) {
      toast.error( [400, 506].includes(error.response.status) ? `${error.response.data.message.includes('duplicate key value violates unique constraint') ? 'El punto de radicación que está intentando crear ya existe y se encuentra activo' : error.response.data.message}` : objResponse.default)
    }
};
onMounted(() => {
  getData()
  comparationData.value = JSON.parse(JSON.stringify(form.value));
});

const removeProperties = (obj, properties) => {
  const newObj = { ...obj };
  properties.forEach(prop => delete newObj[prop]);
  return newObj;
};

const isFormUnchanged = computed(() => {
  const cleanFormData = {
    ...form.value,
    municipio: removeProperties(form.value.municipio, ['codigoDivipola'])
  };

  return JSON.stringify(comparationData.value) === JSON.stringify(cleanFormData);
});

watch(
  () => form.value.pais,
  async (value) => {
    let val = value as unknown as string
    form.value.departamento.label = ''
    form.value.municipio.label = ''
    if (val.toLowerCase() == 'colombia') {
      isntColombia.value = false
      // @ts-ignore
      const { optionsDepartments } = await useDepartments(value.value);
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
    if (!isntColombia.value) {
      form.value.municipio.label = ''
    }

    form.value.municipio= { label: '', value: ''}

    // @ts-ignore
    const { optionsMunicipalities } = await useMunicipalities(value.value);
    municipalitiesStatic.value = sortOptions(optionsMunicipalities.value)

    const valueMunicipality=  municipalitiesStatic.value.find((item) => {
      return item.label === municipalityLabel.value;
    });

    if (valueMunicipality){

      form.value.municipio={label: municipalityLabel.value, value: valueMunicipality?.value || 1};

    }

  }
);

const handleCancel = () => {
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

const selectOptionsFilterFnSucursales = (val, update) => {

  update(() => {
    sucursalesOptions.value = sucursalesOptionsStatic.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const selectOptionsFilterFnDependencias = (val, update) => {

update(() => {
  dependenciasOptions.value = dependenciasOptionsStatic.value.filter((option) => {
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
