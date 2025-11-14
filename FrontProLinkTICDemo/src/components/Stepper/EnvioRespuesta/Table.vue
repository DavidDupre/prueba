<template>
  <div>
    <q-table flat :rows="COPIA_BODY" :columns="COPIA_HEADER" row-key="id"
      table-header-class="text-black text-h6 " class="q-mr-md full-width"
      v-model:pagination="pagination" hide-pagination>

      <template v-slot:body-cell-acciones="props">
        <q-td>
          <q-btn no-caps style="color: #FF7500;" unelevated icon="delete" @click="deleteFila(props.row.id, props.rowIndex)" />
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
import { toast } from "src/helpers/toast";
import { sgdeaAxios } from "src/services";
import { ref, computed } from "vue";

const props = withDefaults(defineProps<{
  COPIA_HEADER: any[],
  COPIA_BODY: any[],
  action?: string,
  deleteFila: () => {},
}>(), {
})

const emit = defineEmits(['update:itemDelete'])

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
})

const pagesNumber = computed(() => Math.ceil(props.COPIA_BODY.length / pagination.value.rowsPerPage));

</script>
