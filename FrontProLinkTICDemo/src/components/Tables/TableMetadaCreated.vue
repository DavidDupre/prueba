<template>
  <div class="q-pa-md">
    <q-card class="my-card tw-p-5" flat bordered>
      <q-card-section>
        <h1 class="tw-text-lg tw-font-bold">Metadatos creados</h1>
      </q-card-section>
      <div class="table-container">
        <q-markup-table>
          <thead>
            <tr>
              <label class="q-px-md tw-text-label">
                Filtrar por Usuario

                <q-select
                  class="tw-w-64"
                  dense
                  v-model="selectedOficina"
                  :options="oficinaOptions"
                  label="Seleccione"
                  emit-value
                  map-options
                  outlined
                  @update:model-value="handlOfiFilterChange"
                />
              </label>
            </tr>
          </thead>
          <tbody>
            <template v-for="(row, index) in rows" :key="index">
              <q-item tag="label" v-ripple>
                <q-item-section avatar>
                  <q-checkbox
                    v-model="row.accept"
                    :val="row.value"
                    color="orange"
                    @update:model-value="handleCheckboxChange(row.value)"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ row.name }}</q-item-label>
                </q-item-section>
              </q-item>
              <!-- Línea de separación -->
              <q-separator />
            </template>
          </tbody>
        </q-markup-table>
      </div>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { PropType } from "vue";

const selecAccept = ref(false);

const props = defineProps({
  formData: {
    type: Object as PropType<{ filterOficina: string }>,
    required: true,
  },
  oficinaOptions: {
    type: Array as PropType<{ value: string; label: string }[]>,
    required: true,
  },
  rows: {
    type: Array as PropType<{value:number; name: string; accept: boolean }[]>,
    required: true,
  },
});
const handlOfiFilterChange = (value: any) => {

  // Aquí puedes realizar cualquier otra acción que necesites con el nombre seleccionado
};

const handleCheckboxChange = (value: any) => {

  // Aquí puedes realizar cualquier otra acción que necesites con el nombre seleccionado
};
const selectedOficina = ref(props.formData.filterOficina);

watch(selectedOficina, (newVal) => {
  props.formData.filterOficina = newVal;
});

function toggleAccept(index: number) {
  props.rows[index].accept = !props.rows[index].accept;
}
</script>

<style scoped>
.table-container {
  max-height: 300px;
  overflow-y: auto;
}

/* Personaliza la barra de desplazamiento */
.table-container::-webkit-scrollbar {
  width: 12px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.table-container::-webkit-scrollbar-thumb {
  background-color: #ff7500;
  border-radius: 6px;
  border: 3px solid #f1f1f1;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background-color: #e66300;
}
</style>
