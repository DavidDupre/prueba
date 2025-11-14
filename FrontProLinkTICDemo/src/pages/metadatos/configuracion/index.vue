<template>

  <div class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
    <div class="tw-flex tw-justify-between tw-items-center tw-pt-4">
        <span class="tw-font-bold tw-text-3xl tw-my-5">Configurar reglas de metadatos</span>
        <router-link  to="/metadata/configuracion/crear">
          <q-btn  label="Crear configuración de reglas de metadatos" color="primary" icon="add" class="tw-h-10 tw-rounded-lg !tw-px-3" />
        </router-link>
    </div>

    <ReglaConfiguracionModal @update:showModal="val=>showFormModalComunicationEdit=val" :idMetadato="idMetadato"  :showModal="showFormModalComunicationEdit" />

      <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat >
      <div class="flex items-center justify-between q-px-md q-mb-sm row col-12">
        <span class="text-weight-bold text-h5" style="color: #2c3948">Listado de metadatos</span>
      </div>
      <Table @update:itemSelected="(value)=>handleItemSelected(value)" :JUZGADOS_HEADER="META_HEADER" :JUZGADOS_BODY="dataTableMetadatos" />
    </q-card>

  </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue';
import { toast } from '../../../helpers/toast';
import { sgdeaAxios } from '../../../services/index';
import { META_HEADER } from '../const';
import {sleep} from 'src/pages/metadatos/utils/index'
import Table from 'src/components/metadtos/crear/Table.vue';
import { ResponseDataListadoMetadatos, ResponseListadotipoDato } from '../interface';
import ReglaConfiguracionModal from "src/components/Modal/ReglaConfiguracionModal.vue";

const dataTableMetadatos = ref([]);
const showFormModalComunicationEdit=ref(false)
const idMetadato=ref('')

const handleItemSelected = (value: any) => {
  idMetadato.value=value.id
  showFormModalComunicationEdit.value=true
};

const getData=async()=>{
  const {data:listado}= await sgdeaAxios.get<ResponseDataListadoMetadatos>('/metadato/listado')
  dataTableMetadatos.value = listado.content.filter((item) => item.metadato.estado).map((item) => {
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
</script>

<style></style>
