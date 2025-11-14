<template>
  <div class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
    <div class="tw-pt-4">
        <router-link to="/metadata/configuracion">
            <q-btn flat color="primary" label="Volver" icon="chevron_left" />
        </router-link>
    </div>

    <div class="tw-flex tw-justify-between tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold">Configuración de reglas de metadatos</h1>
    </div>

    <q-form greedy ref="myForm0">
      <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
        <div class="row q-col-gutter-md q-pb-md q-px-md">
          <p class="tw-text-2xl tw-font-bold tw-pb-4 tw-w-full ">
            Datos del metadato
          </p>


          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <span class="tw-w-full">
              <label  class="tw-text-label">Nombre del metadato *</label>
                <q-select :rules="[inputRequired]" v-model="formGeneralData.nombre" label="Seleccione" dense outlined use-input
                 clearable @filter="filterNameMetadato" :options="listNameMetadata" class="tw-rounded-lg">
              </q-select>
            </span>
          </div>

          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <span class="tw-w-full">
              <label class="tw-text-label">Tipo de trámite *</label>
              <q-select  :rules="[inputRequired]" v-model="formGeneralData.tipoTramite" label="Seleccione" map-options emit-value dense outlined
                :options="listaTramite" class="tw-rounded-lg">
              </q-select>
            </span>
          </div>

          <div class="tw-w-full">
            <span class="tw-w-full ">
              <label for="description" class="tw-text-label">Descripción *</label>
              <q-input readonly v-model.trim="formGeneralData.descripcion" label="Inserte" outlined class="mb-3"
                :rules="[inputRequired ,(val) => maxLengthInput(1000, val), alphanumericWithSpace]" type="textarea"
                id="description" dense />
            </span>
          </div>

          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <span class="tw-w-full">
              <label class="tw-text-label">Tipo de dato *</label>
              <q-select readonly :rules="[inputRequired]" v-model="formGeneralData.tipoDato" label="Seleccione" map-options emit-value dense outlined
                :options="listaDesplegable" class="tw-rounded-lg">
              </q-select>
            </span>
          </div>

          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <div v-for="(itemLista, indexLista) in listadoRelacional" class="tw-flex tw-w-full">
              <div class="tw-flex tw-flex-row  tw-justify-between tw-gap-2 tw-w-full">
                <div class="tw-w-full">
                  <span class="tw-w-full">
                    <label class="tw-text-label">{{`Opción(${indexLista + 1})`}}</label>
                    <q-input readonly v-model="itemLista.elementoListaRelMD.nombreRelacional" dense outlined label="Inserte" class="tw-rounded-lg"
                      :rules="[inputRequired, val => maxLengthInput(100, val)]" />
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </q-card>

    </q-form>

    <div class="col row justify-center q-gutter-x-md q-my-md">
      <q-btn color="accent" textColor="secondary" label="Cancelar" style="width: 130px;height: 40px;border-radius: 8px;font-size: 16px;" no-caps @click="showModal=true" />
      <q-btn color="primary" label="Guardar" style="width: 130px;height: 40px;border-radius: 8px;font-size: 16px;" @click="handleSubmit" />
    </div>



    <Modal v-model:model-value="showModal" title="Confirmación" persistent
        :text="`Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?`"
        :is-success="false" :cancelButton="true" @handle-accept="handleCancel" textButtonCancel="No"
        text-button="Si"  />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { alphanumeric, homePhoneNumber, inputRequired, maxLengthInput, onlyNumbers, validationEmail,alphanumericWithSpace } from "src/helpers/validations";
import { toast } from '../../../helpers/toast';
import { sgdeaAxios } from '../../../services/index';
import {  objResponse,  listaDesplegableBoolean  } from '../const';
import { ContentItemEdit,ResponseDataListadoTipoTramite,listaDesplegableEdit } from '../interface';
import { useRoute, useRouter } from 'vue-router';
import Modal from 'src/components/Modal/Modal.vue'
import { useListTipoListMetadato } from 'src/stores/metadata';
import ReglaConfiguracionModal from "src/components/Modal/CrearCorrespondenciaModal.vue";

const {getlistaDesplegableStore}=useListTipoListMetadato()
const router = useRouter();
const route = useRoute();
const myForm0 = ref<any>(null);
const showModal = ref(false);
const listNameMetadata = ref([]);
const listNameMetadataStatic = ref([]);
const listadoRelacional=ref<listaDesplegableEdit[]>([]);
const idMetadata=ref('');
const listaDesplegable=ref([])
const listaTramite=ref([])


const formGeneralData = ref({
  nombre: "" as any,
  tipoDato:"",
  descripcion: "",
  size: "",
  state:false,
  tipoTramite:""
});

const mapData=(data:ContentItemEdit)=>{

  formGeneralData.value.tipoDato=data.metadato.tipoDato.id as any
  formGeneralData.value.descripcion=data.metadato.descripcion
  formGeneralData.value.size=data.metadato.tamanio as any
  formGeneralData.value.state=data.metadato.estado
  //@ts-ignore
  formGeneralData.value.tipoTramite= data.metadato.tipoTramiteCorrespondencia ?data.metadato.tipoTramiteCorrespondencia.id : ''
}


const mapDataNameMetadata=(data:ContentItemEdit[])=>{
  listNameMetadataStatic.value=data
    .filter((item) =>item.metadato.estado)
    .sort((a, b) => a.metadato.nombre.localeCompare(b.metadato.nombre))
    .map((item)=>{
      return {
        value:item.metadato.id,
        label:item.metadato.nombre
      }
  })
}

const getData=async()=>{
  //@ts-ignore
  const [listaDesplegableResponse, dataResponse, listaTramiteResponse]=await Promise.allSettled([
    getlistaDesplegableStore(),
    sgdeaAxios.get<ContentItemEdit[]>(`/metadato/listadoSinRelacionales`),
    sgdeaAxios.get<ResponseDataListadoTipoTramite[]>(`/metadato/listadotipoTramiteMD`)
  ])

  listaDesplegable.value = listaDesplegableResponse.value;
  const { data } = dataResponse.value;
  const { data: listaTipoTramite } = listaTramiteResponse.value;

  listaTramite.value = listaTipoTramite
    .filter((item) => item.nombre !== "Mortales")
    .filter((item) => item.nombre !== "Retiro de empresa")
    .sort((a, b) => a.nombre.localeCompare(b.nombre)).map((item) => {
    return {
      value: item.id,
      label: item.nombre
    };
  });
  mapDataNameMetadata(data);
}

onMounted(() => getData());

const buildBody = () => {
  return ({
    "metadato": {
      "nombre": formGeneralData.value.nombre.label,
      "tipoDato": {
        "id": formGeneralData.value.tipoDato
      },
      "descripcion": formGeneralData.value.descripcion,
      "tamanio": +formGeneralData.value.tipoDato === 1 ? formGeneralData.value.size :'',
      "estado": formGeneralData.value.state,
      "tipoTramiteCorrespondencia": {
        "id": formGeneralData.value.tipoTramite
      }
    },
    "listadoRelacionalesMD": listadoRelacional.value
  })
};

const saveMetadato = async () => {
  const body = buildBody();
  try {
    await sgdeaAxios.put(`/metadato/editar/${idMetadata.value}`, body);
    const moduleName=getLabel(+formGeneralData.value.tipoTramite)
    toast.success(`Se creo correctamente el metadato ${formGeneralData.value.nombre.label} para el trámite ${moduleName}`);
    handleCancel();
  } catch (error) {
    toast.error(objResponse.errorConfig);
  }
};

const handleCancel = () => router.push('/metadata/configuracion');

const handleSubmit = async() => {
  const isValidate=await myForm0.value.validate()

  if (!isValidate) {
    toast.error(objResponse.campos_obligtorios);
    return;
  }
  saveMetadato();
};

watch(()=>formGeneralData.value.nombre, async(value: any)=>{

  if(value.value){
    try {
      const {data}=await sgdeaAxios.get<ContentItemEdit>(`/metadato/obtener/${value.value}`);
      idMetadata.value=value.value
      listadoRelacional.value=data.listadoRelacionalesMD
      mapData(data)
    } catch (error) {
      toast.error(objResponse.errorGet);
    }
  }
})

const getLabel=(value:number)=>{
  return listaTramite.value.find((item)=>item.value===value).label
}



const filterNameMetadato=(val, update,abort )=> {

    if (val == '') {
      update(() => {
        listNameMetadata.value = listNameMetadataStatic.value
      })
      return
    }

    if (val.length < 3) {
      abort()
      return
    }

    update(() => {
      listNameMetadata.value= listNameMetadataStatic.value.filter((option) => {
        return option.label.toLowerCase().includes(val.toLowerCase());
      });

    })
  }

</script>

<style></style>
