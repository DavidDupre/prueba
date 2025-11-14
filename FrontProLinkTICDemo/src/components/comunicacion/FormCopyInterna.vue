<template>
  <q-form ref="myForm" greedy>
    <div class="row q-col-gutter-md q-pb-md q-px-md">
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label">Dependencia *</label>
          <q-select clearable v-model="formExitData.dependencieType" emit-value map-options :options="dependenciesTypesOptions"
            :rules="[inputRequired]" label="Seleccione" dense outlined class="tw-rounded-lg" @filter="selectOptionsFilterFnDependencias" use-input fill-input hide-selected>
          </q-select>
        </span>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <span class="tw-w-full">
          <label class="tw-text-label">Nombre funcionario *</label>
          <q-select clearable v-model="formExitData.official" emit-value map-options :options="officialOptions"
            :rules="[inputRequired]" label="Seleccione" dense outlined class="tw-rounded-lg" @filter="selectOptionsFilterFnFuncionarioName" use-input fill-input hide-selected>
          </q-select>
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
  } from "src/helpers/validations";

  const props =defineProps({
    idComunicacion:{type:Number, required:false, default:null},
    isFisrRender:{type:Boolean, required:false, default:true}
  })

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

  const mapListUserInternoById=async()=>{
    if(props.idComunicacion){
      const { getAllDataByID,getListOfficialOptions2} = useCrearComunicacionesLogic();
      const allData= await getAllDataByID(props.idComunicacion);
      const dataArray=allData.listInterna;

      const mapOfobjetoBuilder = await Promise.all(dataArray.map(async (data) => {
        const nombre_label = await getListOfficialOptions2(data.dependencia).then(res => res.filter(option => option.value === data.nombre)[0].label);
        return {
          nombre_label,
          official: data.nombre,
          dependencieType: data.dependencia,
          dependencia_label: dependenciesTypesOptionsStatic.value.filter(option => option.value === data.dependencia)[0].label
        };
      }));

      emit("update:itemAdded", mapOfobjetoBuilder);
    }
  }

  watch(()=>props.dependency,(value)=>{
    formExitData.value.dependencieType=value
    setTimeout(() => {
      // formExitData.value.official=props.official

    }, 2000);
  })

  onMounted(async () => {
      const {  getDependenciesTypesOptions2, getListOfficialOptions } = useCrearComunicacionesLogic();
      dependenciesTypesOptionsStatic.value = await getDependenciesTypesOptions2();
      officialOptionsStatic.value = await getListOfficialOptions();
      props.isFisrRender && mapListUserInternoById()
  });

  const successAdd = async () => {
    emit("update:itemAdded", {...formExitData.value,nombre_label:getLabel(formExitData.value.official,officialOptions.value) ,
      dependencia_label: getLabel(formExitData.value.dependencieType,dependenciesTypesOptions.value )});
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
    () => formExitData.value.dependencieType,
    async (value) => {

      formExitData.value.official = '';
      const { getListOfficialOptions2 } = useCrearComunicacionesLogic();
      officialOptionsStatic.value= await getListOfficialOptions2(value);
    }
  );
</script>
