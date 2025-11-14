<template>

  <div class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">

    <div class="tw-pt-4">
        <router-link to="/">
            <q-btn flat color="primary" label="Volver" icon="chevron_left" />
        </router-link>
    </div>

    <div class="tw-flex tw-justify-between tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold">Creación de metadatos</h1>
    </div>

    <q-form greedy ref="myForm0">
      <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
        <div class="row q-col-gutter-md q-pb-md q-px-md">
          <p class="tw-text-2xl tw-font-bold tw-pb-4 tw-w-full ">
            Datos del metadato
          </p>

          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <span class="tw-w-full">
              <label class="tw-text-label">Nombre del metadato *</label>
              <q-input v-model="formGeneralData.nombre" dense outlined label="Inserte" class="tw-rounded-lg"
                debounce="1000" :error="isUniqueName" :error-message="isUniqueName && 'El nombre del metadato ya existe'" :rules="[inputRequired, val => maxLengthInput(100, val)]" />
            </span>
          </div>


          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <span class="tw-w-full">
              <label class="tw-text-label">Tipo de dato *</label>
              <q-select :rules="[inputRequired]" v-model="formGeneralData.tipoDato" label="Seleccione" map-options emit-value dense outlined
                :options="listaDesplegable" class="tw-rounded-lg">
              </q-select>
            </span>
          </div>

          <div class="tw-w-full">
            <span class="tw-w-full ">
              <label for="description" class="tw-text-label">Descripción *</label>
              <q-input v-model.trim="formGeneralData.descripcion" label="Inserte" outlined class="mb-3"
                :rules="[inputRequired ,(val) => maxLengthInput(1000, val), alphanumericWithSpace]" type="textarea"
                id="description" dense />
            </span>
          </div>

          <div v-if="isAlphanumeric"  class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <span class="tw-w-full">
              <label class="tw-text-label">Tamaño del dato *</label>
              <q-input v-model.number="formGeneralData.size" dense outlined label="Inserte" class="tw-rounded-lg"
                :rules=" [inputRequired,onlyNumbers, val => maxLengthInput(5, val)]" />
            </span>
          </div>

          <div v-if="isBoolean"  class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <span class="tw-w-full">
              <label class="tw-text-label">Datos lista desplegable</label>
              <q-select :disable="true" :rules="[inputRequired]" v-model="formGeneralData.booleanListSi" map-options emit-value dense outlined
                :options="listaDesplegableBoolean" class="tw-rounded-lg">
              </q-select>
            </span>
          </div>
          <div v-if="isBoolean"  class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <span class="tw-w-full">
              <label class="tw-text-label">Datos lista desplegable</label>
              <q-select :disable="true" :rules="[inputRequired]" v-model="formGeneralData.booleanListNo"  map-options emit-value dense outlined
                :options="listaDesplegableBoolean" class="tw-rounded-lg">
              </q-select>
            </span>
          </div>

          <div  class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <span class="tw-w-full">
              <label class="tw-text-label">Estado *</label>
              <div>
                <q-toggle :rules="[inputRequired]" v-model="formGeneralData.state" color="primary" />
              </div>
            </span>
          </div>
        </div>
      </q-card>

      <q-card v-if="+formGeneralData.tipoDato === 2" class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
        <div v-for="(itemLista, indexLista) in formGeneralData.inputsListaDesplegable" class="tw-flex tw-w-full">
          <div class="tw-flex tw-flex-row tw-w-1/2 tw-justify-between tw-gap-2">
            <div class="tw-w-8/12 ">
              <span class="tw-w-full">
                <label class="tw-text-label">Datos lista desplegable *</label>
                <q-btn v-if="indexLista === 0" size="" class="tw-ml-2 tw-mb-2" flat rounded @click="addNewInputListaDesplegable" icon="add"></q-btn>
                <q-btn v-if="indexLista !== 0" class="tw-ml-2 tw-mb-2" flat rounded @click="removeInputListaDesplegable(indexLista)" icon="remove"></q-btn>
                <q-input v-model="itemLista.nameList" dense outlined label="Inserte" class="tw-rounded-lg"
                  :rules="[inputRequired, val => maxLengthInput(200, val)]" />
              </span>
            </div>

            <div  class="tw-w-4/12 tw-max-w-[160px] ">
              <span class="tw-w-full tw-flex tw-flex-col tw-h-full tw-items-center tw-justify-start tw-mt-6">
                <q-checkbox  class="tw-text-label" v-model="itemLista.isRelacional" label="Lista desplegable relacional *" />
              </span>
            </div>

          </div>

          <div class="tw-flex tw-w-1/2 tw-pl-4 tw-flex-col tw-justify-center">
            <div v-for="(itemRelacional, indexRelacional) in formGeneralData.inputsListaRelacional[`listaRelacional${indexLista}`] " :class= "itemLista.isRelacional?'tw-flex tw-w-full tw-justify-between':'tw-flex tw-w-full tw-justify-end'">

              <div v-if="itemLista.isRelacional" class="tw-w-8/12">
                <span class="tw-w-full">
                  <label v-if="indexRelacional === 0" class="tw-text-label">Datos lista desplegable relacional *</label>
                  <q-btn v-if="indexRelacional === 0" class="tw-ml-2 tw-mb-2" flat rounded @click="addNewInputListaDesplegableRelacional(indexLista)" icon="add"></q-btn>
                  <q-btn v-if="indexRelacional !== 0" class="tw-ml-2 tw-mb-2" flat rounded @click="removeInputListaDesplegableRelacional(indexRelacional, indexLista)" icon="remove"></q-btn>
                  <q-input v-model="itemRelacional['nameListRelacional']" dense outlined label="Inserte" class="tw-rounded-lg"
                    :rules="[inputRequired, val => maxLengthInput(100, val)]" />
                </span>
              </div>

              <div v-if="indexRelacional===0"  class="col-xs-12 col-sm-2 col-md-2 col-lg-2">
                <span class="tw-w-full tw-flex tw-h-full tw-items-center tw-justify-end">
                  <label class="tw-text-label">Estado *</label>
                  <div>
                    <q-toggle v-model="itemRelacional['state']" color="primary" />
                  </div>
                </span>
              </div>
            </div>

          </div>
        </div>
      </q-card>
    </q-form>

    <div class="col row justify-center q-gutter-x-md q-my-md">
      <q-btn color="accent" textColor="secondary" label="Cancelar" style="width: 130px;height: 40px;border-radius: 8px;font-size: 16px;" no-caps @click="router.push('/')" />
      <q-btn color="primary" label="Guardar" style="width: 130px;height: 40px;border-radius: 8px;font-size: 16px;" @click="handleSubmit" />
    </div>

    <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat >
      <div class="flex items-center justify-between q-px-md q-mb-sm row col-12">
        <span class="text-weight-bold text-h5" style="color: #2c3948">Listado de metadatos</span>
      </div>
      <Table  :JUZGADOS_HEADER="META_HEADER" :JUZGADOS_BODY="dataTableMetadatos" />
    </q-card>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { alphanumeric, homePhoneNumber, inputRequired, maxLengthInput, onlyNumbers, validationEmail,alphanumericWithSpace } from "src/helpers/validations";
import { toast } from '../../../helpers/toast';
import { sgdeaAxios } from '../../../services/index';
import { META_HEADER, objResponse, datoslistaDesplegable, state, objDatosListaDesplegable, listaDesplegableBoolean  } from '../const';
import {sleep} from 'src/pages/metadatos/utils/index'
import Table from 'src/components/metadtos/Table.vue';
import { ResponseDataListadoMetadatos, ResponseListadotipoDato } from '../interface';
import { useRoute, useRouter } from 'vue-router';
import { useListTipoListMetadato } from 'src/stores/metadata';

const router = useRouter();
const {getlistaDesplegableStore}=useListTipoListMetadato()
const myForm0 = ref<any>(null);

const isUniqueName=ref(false)
const listaDesplegable = ref([]);
const formGeneralData = ref({
  nombre: "",
  tipoDato:"",
  descripcion: "",
  size: "",
  state:false,
  booleanListSi:true,
  booleanListNo:false,
  inputsListaRelacional:{
    'listaRelacional0':[
      {
        state:false,
        nameListRelacional:'',
      },
    ],
  },

  inputsListaDesplegable:[
    {
      isRelacional:false,
      nameList:'',
    }
  ],
});

const isAlphanumeric=ref(false);
const isBoolean=ref(false);
const dataTableMetadatos = ref([]);

const getData=async()=>{

  listaDesplegable.value= await getlistaDesplegableStore()

  const {data:listado}= await sgdeaAxios.get<ResponseDataListadoMetadatos>('/metadato/listado')
  dataTableMetadatos.value = listado.content.map((item) => {
    return ({
      id: item.metadato.id,
      nombre: item.metadato.nombre,
      tipoDato: item.metadato.tipoDato.nombre,
      descripcion: item.metadato.descripcion,
      tamanio: item.metadato.tamanio,
      lista: item.listadoRelacionalesMD,
      estado: item.metadato.estado ? "Activo" : "Inactivo",
    });
  });
}

onMounted(() => {
  getData()
});

watch(()=>formGeneralData.value.nombre,(value)=>{
  isUniqueName.value=false
})

watch(()=>formGeneralData.value.tipoDato, (value) => {
  formGeneralData.value.size = "";
  isAlphanumeric.value= +value === 1
  isBoolean.value= +value === 3

  if(+value !== 2){
    formGeneralData.value.inputsListaDesplegable=[
      {
        isRelacional:false,
        nameList:'',
      }
    ]
    formGeneralData.value.inputsListaRelacional={
      'listaRelacional0':[
        {
          state:false,
          nameListRelacional:'',
        },
      ],
    }
  }
});

const buildBody = () => {

  let body={
    "metadato": {
      "nombre": formGeneralData.value.nombre,
      "tipoDato": {
        "id": formGeneralData.value.tipoDato
      },
      "descripcion": formGeneralData.value.descripcion,
      "tamanio": formGeneralData.value.size,
      "estado": formGeneralData.value.state,
    },
  }

  if(+formGeneralData.value.tipoDato === 2){
    let listadoRelacionalesMD=formGeneralData.value.inputsListaDesplegable.map((itemLista, indexLista) => {
      let state=false
      return {
        "elementoListaRelMD": {
          "listaRelacional": itemLista.isRelacional,
          "nombreRelacional": itemLista.nameList,
          "listadoOpciones": formGeneralData.value.inputsListaRelacional[`listaRelacional${indexLista}`].map((itemRelacional, indexRelacional) => {
            if(indexRelacional  === 0 ) state=itemRelacional.state

            if(!itemLista.isRelacional) return ''
            return {
              "opcion": itemRelacional.nameListRelacional,
              "predeterminado": false,
            }
          }),
          "estado": state,
        }
      }
    })

    listadoRelacionalesMD=listadoRelacionalesMD.map(item=>{
      if(item.elementoListaRelMD.listadoOpciones[0])
        return item
      else{
        delete item.elementoListaRelMD.listadoOpciones
        return item
      }

    })

    body ={
      ...body,
      listadoRelacionalesMD
    } as any
  }

  return body

};

const saveMetadato = async () => {
  const body = buildBody();

  try {
    await sgdeaAxios.post('/metadato/crear', body);
    toast.success(objResponse.success);
    resetForm()
    await myForm0.value.reset() // Reset validations form
    await sleep(1000)
    getData()
  } catch (error) {
    if(error.response.data === 'El nombre del metadato ya existe'){
      isUniqueName.value=true
    }
    toast.error(objResponse.error);
  }
};

const handleSubmit = async() => {
  const isValidate=await myForm0.value.validate()

  if (!isValidate) {
    toast.error(objResponse.campos_obligtorios);
    return;
  }
  saveMetadato();
};

const resetForm=()=>{
  formGeneralData.value={
    nombre: "",
    tipoDato:"",
    descripcion: "",
    size: "",
    state:false,
    booleanListSi:true,
    booleanListNo:false,
    inputsListaRelacional:{
      'listaRelacional0':[
        {
          state:false,
          nameListRelacional:'',
        },
      ],
    },
    inputsListaDesplegable:[
      {
        isRelacional:false,
        nameList:'',
      }
    ],
  }
}

const addNewInputListaDesplegable=()=>{
  formGeneralData.value.inputsListaDesplegable.push({
    isRelacional:false,
    nameList:'',
  })

  formGeneralData.value.inputsListaRelacional[`listaRelacional${formGeneralData.value.inputsListaDesplegable.length -1}`]=[
    {
      state:false,
      nameListRelacional:'',
    }
  ]
}

const removeInputListaDesplegable=(index:number)=>{
  formGeneralData.value.inputsListaDesplegable.splice(index,1)
}
const removeInputListaDesplegableRelacional=(indexRelacional:number, indexLista:number)=>{

  formGeneralData.value.inputsListaRelacional[`listaRelacional${indexLista}`]
    .splice(indexRelacional,1)
}

const addNewInputListaDesplegableRelacional=(indexLista:number)=>{

  Array.isArray(formGeneralData.value.inputsListaRelacional[`listaRelacional${indexLista}`])
    ? formGeneralData.value.inputsListaRelacional[`listaRelacional${indexLista}`].push({
      state:false,
      nameListRelacional:'',
    })
    : formGeneralData.value.inputsListaRelacional[`listaRelacional${indexLista}`] = [
      {
        state:false,
        nameListRelacional:'',
      }
    ]
}

// const nameUnique = async(val: string) => {
//   if (val === "") return true;
//   await sleep(1000)
//   const isUnique= dataTableMetadatos.value.find((item) => item.nombre === val);
//   return !!isUnique ? "El nombre del metadato ya existe" : true;
// };

</script>

<style></style>
