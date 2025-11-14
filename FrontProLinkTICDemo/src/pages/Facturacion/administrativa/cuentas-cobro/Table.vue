<template>
  <div>
      <q-table flat :rows="FACTURA_BODY" :columns="COBROS_HEADER" row-key="id_factura_a" table-header-class="text-black text-h6 "
      class="q-mr-md full-width" no-data-label="No se encontraron resultados coincidentes con la búsqueda." no-results-label="No se encontraron resultados coincidentes con la búsqueda." v-model:pagination="pagination" hide-pagination>

          <template v-slot:body-cell-estado="props">
              <q-td>
                  <q-chip square :ripple="false" style="border: .5px solid #FF7500; background: rgba(255, 117, 0, .1); color: #2C3948; border-radius: 8px;">
                    {{ props.row.estado }}
                  </q-chip>
              </q-td>
          </template>

          <template v-slot:body-cell-acciones="props">
              <q-td>
                  <q-btn label="Gestionar" no-caps style="background: #F2F4F5;" unelevated @click="viewDetails(props.row.nroId)"/>
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
import { useRouter } from "vue-router";

import { COBROS_HEADER } from './index';

const router = useRouter()

const props = withDefaults(defineProps<{
  COBROS_HEADER: any[],
  FACTURA_BODY: any[],
  action?: string,
  target?: string
}>(), {
target: ""
})

const pagination = ref({
page: 1,
rowsPerPage: 7,
})

const pagesNumber = computed(() => Math.ceil(props.FACTURA_BODY.length / pagination.value.rowsPerPage))

function viewDetails(id: number) {
  router.push('/facturacion/cuentas-cobro/editar/' + id)
}
</script>
