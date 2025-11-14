<template>
    <div>
        <q-table flat :rows="DOCUMENTOS_BODY" :columns="DOCUMENTOS_HEADER" row-key="nombreDocumento" table-header-class="text-black text-h6 "
        class="q-mr-md full-width" selection="multiple" v-model:selected="selection"
        no-data-label="No se encontraron resultados coincidentes con la búsqueda." no-results-label="No se encontraron resultados coincidentes con la búsqueda." v-model:pagination="pagination" hide-pagination>

            <template v-slot:body-cell-formato="props">
                <q-td>
                    <q-avatar size="24px" square>
                        <img v-lazy :data-url="pdf" />
                    </q-avatar>
                </q-td>
            </template>

            <template v-slot:body-cell-acciones="props">
                <q-td class="text-center">
                    <q-btn size="sm" color="primary" icon="download" flat padding="3px" :ripple="false">
                        <q-tooltip class="bg-white" anchor="top right" self="top middle"
                            style="color: #222222; border: 1px solid #A5B1BF; border-radius: 200px;">
                            Descargar
                        </q-tooltip>
                    </q-btn>
            
                    <q-btn size="sm" color="primary" icon="print" flat padding="3px" :ripple="false">
                        <q-tooltip class="bg-white" anchor="top right" self="top middle" style="color: #222222; border: 1px solid #A5B1BF; border-radius: 200px;">
                            Imprimir
                        </q-tooltip>
                    </q-btn>
                </q-td>
            </template>

            <template v-slot:bottom>
                <div class="row q-mt-md" style="width: 100%;">
                    <div class="col">
                        <label for="" class="flex items-center q-gutter-x-md">
                            <span style="font-size: 14px; font-weight: 500;">
                                Filas por página
                            </span>
                            <q-select style="width: 120px; height: 40px;" outlined dense mapOptions emitValue :options="[
                                { label: '5', value: '5' },
                                { label: '10', value: '10' }
                            ]" v-model:model-value="pagination.rowsPerPage"/>
                        </label>
                    </div>
                    
                    <q-pagination v-model="pagination.page" color="black" active-color="primary" direction-links
                    gutter="20px" :max="pagesNumber" class="col-8 q-pl-xl"/>
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

import { DOCUMENTOS_HEADER, DOCUMENTOS_BODY } from ".";

import pdf from "assets/pdf.svg";

const props = withDefaults(defineProps<{
  DOCUMENTOS_BODY: any[],
  DOCUMENTOS_HEADER: any[],
  action?: string,
  target?: string
}>(), {
  target: ""
})

const selection = ref([])

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
})

const pagesNumber = computed(() => Math.ceil(props.DOCUMENTOS_BODY.length / pagination.value.rowsPerPage))
</script>