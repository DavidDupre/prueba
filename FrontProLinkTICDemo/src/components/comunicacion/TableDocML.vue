<template>
  <div>
    <div class="tw-flex tw-justify-between tw-items-center tw-mb-10 tw-gap-6">
      <p class="tw-text-lg text-weight-bold q-mx-lg">
       {{title}}
      </p>
    </div>

    <q-table flat :rows="body" :columns="JUZGADOS_HEADER" row-key="id"
      table-header-class="text-black text-h6 " class="q-mr-md full-width"
      no-data-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
      v-model:pagination="pagination" hide-pagination v-model:selected="selected" >

      <template v-slot:body-cell-formato="props">
        <q-td  v-if="props.row.formato.toLowerCase() == 'pdf' || props.row.formato == 'application/pdf'" class="tw-mx-auto tw-cursor-pointer">
          <center>
            <img v-lazy :data-url="pdf" alt="pdf" />
          </center>
        </q-td>
        <q-td v-else-if="['docx', 'doc', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(props.row.formato.toLowerCase())" class="tw-mx-auto">
          <center>
            <img v-lazy :data-url="word" alt="word" />
          </center>
        </q-td>
        <q-td v-else-if="['xls', 'xml', 'xlsx', 'csv', 'application/vnd.ms-excel', 'application/xml', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(props.row.formato.toLowerCase())" class="tw-mx-auto">
          <center>
            <img v-lazy :data-url="excel" alt="excel" />
          </center>
        </q-td>
        <q-td v-else class="tw-mx-auto">
          <q-icon name="sym_o_unknown_document" size="xs" />
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td class="tw-mx-auto">
            <q-btn @click="deleteSelected(props.row.id)" size="sm" color="primary" icon="delete" flat />
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
import { ref, computed } from "vue";
import excel from "assets/excel.svg";
import pdf from "assets/pdf.svg";
import word from "assets/word.svg";

const props = withDefaults(defineProps<{
  JUZGADOS_HEADER: any[],
  JUZGADOS_BODY: any[],
  title?: string,
  isChangeDocType?: boolean,
}>(), {
  title:'Listado de documentos cargados',
  isChangeDocType: true,
})

const emit = defineEmits([
    "update:itemDeleted",
    "update:showPrinter",
    "update:itemTypeChanged",

]);

const body= ref(props.JUZGADOS_BODY)
const selected = ref([])
const pagination = ref({
  page: 1,
  rowsPerPage: 5,
})

const deleteSelected = async (idSelected) => {
  emit("update:itemDeleted", idSelected)
}

const pagesNumber = computed(() => Math.ceil(props.JUZGADOS_BODY.length / pagination.value.rowsPerPage));

</script>
