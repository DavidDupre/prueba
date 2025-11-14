<template>
  <q-form ref="myForm" greedy>
    <div class="row q-col-gutter-md q-pb-md q-px-md">

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label">Dependencia *</label>
          <q-select  v-model="formExitData.dependencieType" emit-value map-options :options="dependenciesTypesOptions"
            :rules="[inputRequired]" label="Seleccione" dense outlined class="tw-rounded-lg" @filter="selectOptionsFilterFnDependencias" use-input fill-input hide-selected>
          </q-select>
        </span>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label">Nombre funcionario *</label>
          <q-select  v-model="formExitData.official" :options="officialOptions"
            :rules="[inputRequired, v => maxLengthInput(80, v)]" label="Seleccione" dense outlined class="tw-rounded-lg" @filter="selectOptionsFilterFnFuncionarioName" use-input fill-input hide-selected
            @input-value="v => addValue(v, 'official')" />
        </span>
      </div>
    </div>

  </q-form>

  <div class="tw-flex tw-justify-center tw-items-center tw-mb-10 tw-gap-6">
    <q-btn icon="add"  @click="addNewDestinary" label="Agregar" text-color="white" style="width: 240px" color="primary"
      class="tw-rounded-xl tw-h-12 tw-p-2" />
  </div>
</template>

<script setup >
  import { ref, onMounted, watch } from "vue";
  import { useCrearComunicacionesLogic } from "src/pages/Correspondencia/Crear/CrearComunicaciones/CrearComunicaciones.Logic";
  import {
    inputRequired,
    maxLengthInput,
  } from "src/helpers/validations";

  const formExitData = ref({
    dependencieType: '',
    official: '',
  });
  const myForm = ref(null);
  const dependenciesTypesOptionsStatic = ref([]);
  const dependenciesTypesOptions = ref([]);
  const officialOptions = ref([]);
  const officialOptionsStatic = ref([]);
  const emit = defineEmits([
    "update:itemAdded",
  ]);

  onMounted(async () => {
      const {   getDependenciesTypesOptions2 } = useCrearComunicacionesLogic();
      dependenciesTypesOptionsStatic.value = await getDependenciesTypesOptions2();
      dependenciesTypesOptionsStatic.value = dependenciesTypesOptionsStatic.value.sort((a,b) => a.label.localeCompare(b.label))
      // officialOptionsStatic.value = await getListOfficialOptions();
  });

  const successAdd = async () => {
    emit("update:itemAdded", {...formExitData.value,nombre_label:getLabel(formExitData.value.official.value,officialOptions.value),
      dependencia_label: getLabel(formExitData.value?.dependencieType,dependenciesTypesOptions.value )});
  }

  const addNewDestinary = async() => {
    const isValidate=await myForm.value.validate();
    isValidate && successAdd()
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

  const getLabel=(value, options)=> {
    const option = options.find(option => option.value === value);
    return option ? option.label : '';
  }

  watch(
    () => formExitData.value?.dependencieType,
    async (value) => {

      formExitData.value.official = '';
      const { getListOfficialOptions2 } = useCrearComunicacionesLogic();
      officialOptionsStatic.value= await getListOfficialOptions2(value);
      officialOptionsStatic.value = officialOptionsStatic.value.sort((a,b) => a.label.localeCompare(b.label))
    }
  );


  const addValue = (value, type) => {
    formExitData.value[type] = value
  }
</script>
