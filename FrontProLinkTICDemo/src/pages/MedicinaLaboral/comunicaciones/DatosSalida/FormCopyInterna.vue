<template>
  <q-form ref="myForm" greedy>
    <div class="row q-col-gutter-md q-pb-md q-px-md">
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label tw-font-semibold">Dependencia *</label>
          <q-select clearable v-model="formExitData.dependencieType" emit-value map-options
            :options="dependenciesTypesOptions" :rules="[inputRequired]" label="Seleccione" dense outlined
            class="tw-rounded-lg" @filter="selectOptionsFilterFnDependencias" use-input fill-input hide-selected>
          </q-select>
        </span>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label tw-font-semibold">Funcionario *</label>
          <q-select clearable v-model="formExitData.official" emit-value map-options :options="officialOptions"
            :rules="[inputRequired]" label="Seleccione" dense outlined class="tw-rounded-lg"
            @filter="selectOptionsFilterFnFuncionarioName" use-input fill-input hide-selected>
          </q-select>
        </span>
      </div>
    </div>
  </q-form>

  <div class="tw-flex tw-justify-center tw-items-center tw-mb-2 tw-mt-3 tw-gap-6">
    <q-btn class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-44" label="Limpiar" color="white" text-color="secondary"
      @click="limpiarInterno" />
    <q-btn class="tw-rounded-xl tw-h-12 tw-p-2 tw-w-44" label="Agregar" icon="add" color="primary" text-color="white"
      @click="addNewDestinary" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useCrearComunicacionesLogic } from "src/pages/Correspondencia/Crear/CrearComunicaciones/CrearComunicaciones.Logic";
import {
  inputRequired,
} from "src/helpers/validations";
import { sgdeaAxios } from "src/services";

const props = defineProps({
  idComunicacion: { type: Number, required: false, default: null },
  isFisrRender: { type: Boolean, required: false, default: true },
  isErrased: Boolean
})

const formExitData = ref({
  dependencieType: '',
  official: '',
});

if (props.isErrased) {
  formExitData.value = {
    dependencieType: '',
    official: '',
  }
}

const myForm = ref(null);
const dependenciesTypesOptionsStatic = ref([]);
const dependenciesTypesOptions = ref([]);
const officialOptions = ref([]);
const officialOptionsStatic = ref([]);
const emit = defineEmits([
  "update:itemAdded",
]);

const getIdByDependency = async (name) => {
  const response = await sgdeaAxios.put(`/seccionSubSeccion/filter/${name}`)
  return response.data[0].idSeccionSubSeccion
}

const mapListUserInternoById = async () => {
  if (props.idComunicacion) {
    const { getAllDataByID } = useCrearComunicacionesLogic();
    const allData = await getAllDataByID(props.idComunicacion);
    const dataArray = allData?.listCopia?.interna;

    const mapOfobjetoBuilder = await Promise.all(dataArray.map(async (data) => {
      const getDependency = await getIdByDependency(data.dependencia)
      const fullName = data.usuario.firstname + ' ' + data.usuario.lastname

      return {
        nombre_label: fullName,
        official: data.usuario.id,
        dependencieType: getDependency,
        dependencia_label: data.dependencia
      };
    }));

    emit("update:itemAdded", mapOfobjetoBuilder);
  }
}

onMounted(async () => {
  const { getDependenciesTypesOptions2, getListOfficialOptions } = useCrearComunicacionesLogic();
  dependenciesTypesOptionsStatic.value = await getDependenciesTypesOptions2();
  officialOptionsStatic.value = await getListOfficialOptions();
  props.isFisrRender && mapListUserInternoById()
});

const successAdd = async () => {
  emit("update:itemAdded", {
    ...formExitData.value, nombre_label: getLabel(formExitData.value.official, officialOptions.value),
    dependencia_label: getLabel(formExitData.value.dependencieType, dependenciesTypesOptions.value)
  });
}

const addNewDestinary = async () => {
  const isValidate = await myForm.value.validate();
  isValidate && successAdd()
}

const limpiarInterno = async () => {
  formExitData.value = {
    dependencieType: '',
    official: '',
  }

  await myForm.value.reset()
}

const selectOptionsFilterFnDependencias = (val, update) => {
  if (val == '') {
    update(() => {
      dependenciesTypesOptions.value = dependenciesTypesOptionsStatic.value
    })
    return
  }
  update(() => {
    dependenciesTypesOptions.value = dependenciesTypesOptionsStatic.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const selectOptionsFilterFnFuncionarioName = (val, update) => {
  if (val == '') {
    update(() => {
      officialOptions.value = officialOptionsStatic.value
    })
    return
  }
  update(() => {
    officialOptions.value = officialOptionsStatic.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const getLabel = (value, options) => {
  const option = options.find(option => option.value === value);
  return option ? option.label : '';
}

watch(
  () => formExitData.value.dependencieType,
  async (value) => {
    formExitData.value.official = '';
    const { getListOfficialOptions2 } = useCrearComunicacionesLogic();
    officialOptionsStatic.value = await getListOfficialOptions2(value);
  }
);
</script>
