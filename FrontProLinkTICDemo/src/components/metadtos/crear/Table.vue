<template>
  <div>
    <q-table flat :rows="JUZGADOS_BODY" :columns="JUZGADOS_HEADER" row-key="id"
      :filter="filter"
      table-header-class="text-black text-h6 " class="q-mr-md full-width"
      no-data-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
      no-results-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
      v-model:pagination="pagination" hide-pagination>



      <template v-slot:top-right>
        <q-input rounded outlined dense debounce="300" v-model="filter" placeholder="Buscador">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-select rounded label="Exportar" v-model="exportOption" map-options emit-value dense outlined :options="objOptionsExport" class="tw-rounded-lg tw-w-52 tw-ml-4">
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section avatar>
                <q-icon>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M21.5858 3.3038H13.9882V1.51355L1.5 3.44105V20.3363L13.9882 22.4873V19.8338H21.5858C21.8158 19.8455 22.0412 19.7655 22.2125 19.6115C22.3839 19.4575 22.4872 19.2418 22.5 19.0118V4.12505C22.487 3.89515 22.3836 3.67972 22.2123 3.52585C22.041 3.37197 21.8157 3.29214 21.5858 3.3038ZM21.7057 19.1483H13.9628L13.95 17.7316H15.8153V16.0816H13.9357L13.9268 15.1066H15.8153V13.4566H13.9125L13.9035 12.4816H15.8153V10.8316H13.8975V9.85655H15.8153V8.20655H13.8975V7.23155H15.8153V5.58155H13.8975V4.08155H21.7057V19.1483Z" fill="#20744A"/>
                    <path d="M16.8652 5.57922H20.1075V7.22922H16.8652V5.57922ZM16.8652 8.20497H20.1075V9.85497H16.8652V8.20497ZM16.8652 10.8307H20.1075V12.4807H16.8652V10.8307ZM16.8652 13.4565H20.1075V15.1065H16.8652V13.4565ZM16.8652 16.0822H20.1075V17.7322H16.8652V16.0822Z" fill="#20744A"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.76025 8.00469L6.36975 7.91244L7.3815 10.6942L8.577 7.79769L10.1865 7.70544L8.232 11.6549L10.1865 15.6142L8.48475 15.4994L7.33575 12.4814L6.186 15.3847L4.62225 15.2467L6.43875 11.7494L4.76025 8.00469Z" fill="white"/>
                  </svg>
                </q-icon>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ scope.opt.label }}</q-item-label>
              </q-item-section>

            </q-item>
          </template>
        </q-select>

      </template>

      <template v-slot:body-cell-acciones="props">
        <q-td>
          <q-btn no-caps style="color: #FF7500;" unelevated icon="edit" @click="editMetadatoReglaMD(props.row.id)" />
        </q-td>
      </template>

      <template v-slot:bottom>
        <div class="row q-mt-md" style="width: 100%;">
          <div class="col">
            <label for="" class="flex items-center q-gutter-x-md">
              <span style="font-size: 14px; font-weight: 500;">
                Filas por página
              </span>
              <q-select style="width: 120px; height: 40px;" outlined dense mapOptions emitValue
                :options="[5, 25, 50, 100]" v-model:model-value="pagination.rowsPerPage" />
            </label>
          </div>

          <q-pagination v-model="pagination.page" color="black" active-color="primary" direction-links gutter="20px"
            :max="pagesNumber" :max-pages="6" class="col-8 q-pl-xl" />
        </div>
      </template>

      <template v-slot:no-data="{ message }">
        <div class="flex items-center justify-center full-width">
          <div class="flex items-center justify-center q-mt-lg"
            style="padding: 15px; border: 1px solid #E3E4E5; border-radius: 5px; gap: 9px;">
            <q-icon size="20px" name="cancel" color="negative" />
            <span class="text-weight-medium">
              {{ message }}
            </span>
          </div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import {objOptionsExport, objResponse} from 'src/pages/metadatos/const/index'
import moment from "moment";

const props = withDefaults(defineProps<{
  JUZGADOS_HEADER: any[],
  JUZGADOS_BODY: any[],
}>(), {
})

const emit = defineEmits([
  "update:itemSelected",
]);


const exportOption=ref('')
const filter = ref('')
const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  sortBy: 'nombre',
})

const pagesNumber = computed(() => Math.ceil(props.JUZGADOS_BODY.length / pagination.value.rowsPerPage));

const editMetadatoReglaMD=async(id:string)=>{
  emit('update:itemSelected',{
    id,
  })
}

watch(() => exportOption.value, async(value) => {
  try {
    const file= await sgdeaAxios.get(`/metadato/generarArchivo/${value}`,{
      responseType: 'blob'
    })

    const dateNow=moment().format('DD-MM-YYYY')

    const url = window.URL.createObjectURL(new Blob([file.data],{
      type: 'application/vnd.ms-excel'
    }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `metadatos-${dateNow}.${+value === 1 ? 'xlsx' : 'csv'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error) {
    toast.error(objResponse.errorFile)
  }
})

</script>
