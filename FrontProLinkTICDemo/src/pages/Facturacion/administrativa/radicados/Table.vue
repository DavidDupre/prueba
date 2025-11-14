<template>
    <div>
        <q-table flat :rows="RADICADO_BODY" :columns="RADICADO_HEADER" row-key="numeroDocumento" table-header-class="text-black text-h6 "
        class="q-mr-md full-width" selection="multiple" v-model:selected="selection"
        no-data-label="No se encontraron resultados coincidentes con la búsqueda." no-results-label="No se encontraron resultados coincidentes con la búsqueda." v-model:pagination="pagination" hide-pagination>

            <template v-slot:bottom>
                <div class="row q-mt-md" style="width: 100%;">
                    <div class="col">
                        <label for="" class="flex items-center q-gutter-x-md">
                            <span style="font-size: 14px; font-weight: 500;">
                                Filas por página
                            </span>
                            <q-select style="width: 120px; height: 40px;" outlined dense mapOptions emitValue :options="[
                                { label: '7', value: '7' },
                                { label: '14', value: '14' }
                            ]" v-model:model-value="pagination.rowsPerPage"/>
                        </label>
                    </div>
                    
                    <q-pagination v-model="pagination.page" color="black" active-color="primary" direction-links
                    gutter="20px" :max="pagesNumber" :max-pages="6" class="col-8 q-pl-xl"/>
                </div>
            </template>

            <template v-slot:no-data="{message}">
                <div class="flex items-center justify-center full-width">
                    <div class="flex items-center justify-center q-mt-lg" style="padding: 15px; border: 1px solid #E3E4E5; border-radius: 5px; gap: 9px;">
                        <q-icon size="20px" name="cancel" color="negative"/>
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

import { RADICADO_HEADER, RADICADO_BODY } from ".";

const props = withDefaults(defineProps<{
  RADICADO_HEADER: any[],
  RADICADO_BODY: any[],
  action?: string,
  target?: string
}>(), {
  target: ""
})

const selection = ref([])

const pagination = ref({
  page: 1,
  rowsPerPage: 7,
})

const pagesNumber = computed(() => Math.ceil(props.RADICADO_BODY.length / pagination.value.rowsPerPage))
</script>