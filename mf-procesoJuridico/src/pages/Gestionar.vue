<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <MainContainer title="Procesos a gestionar">
    <div class="container_background my-5">
      <div class="flex justify-center mt-5" style="padding: 1rem">
        <div class="chart-container">
          <Chart ref="chartRef" :config="chartConfig" @click="onChartClick" />
        </div>
        <div class="chart-container" v-if="selectedFilter">
          <Chart ref="chartRef2" :config="chartConfig2" @click="onChart2Click" />
        </div>
      </div>
    </div>
    <div>
      <div class="container_background" style="padding: 1rem">
        <span class="text-weight-bold text-h5">Filtrar por</span>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <span class="text-weight-medium">Coordinadora</span>
            <q-select
              outlined
              v-model="filters.coordinadora"
              label="Seleccione..."
              dense
              emit-value
              map-options
              @update:model-value="applyFilters"
            />
          </div>
          <div class="col-12 col-md-4">
            <span class="text-weight-medium">Departamento</span>
            <q-select
              outlined
              v-model="filters.departamento"
              label="Seleccione..."
              dense
              emit-value
              map-options
              @update:model-value="applyFilters"
            />
          </div>
          <div class="col-12 col-md-4">
            <span class="text-weight-medium">Municipio</span>
            <q-select
              outlined
              v-model="filters.municipio"
              label="Seleccione..."
              dense
              emit-value
              map-options
              @update:model-value="applyFilters"
            />
          </div>
        </div>
        <div class="row q-mt-md justify-center q-gutter-md">
          <q-btn
            @click="cleanFilters"
            color="secondary"
            outline
            style="padding: 18px 60px; border-radius: 8px; width: 229px; height: 48px"
            label="Limpiar Filtros"
          />
          <q-btn
            @click="applyFilters"
            color="primary"
            style="padding: 18px 60px; border-radius: 8px; width: 229px; height: 48px"
            label="Buscar"
          />
        </div>
      </div>
    </div>
    <div class="container_background" style="padding: 1rem">
      <TableComponent
        :BODY="tableData"
        :HEADER="GESTIONAR_HEADER"
        :loading="false"
        :enableSelection="true"
        :totalPages="totalPages"
        :pagination="pagination"
        :selection="selectedRows"
        @pagination="handlePagination"
        @pagination-change="handlePageChange"
        @update:selection="selectedRows = $event"
      />
    </div>
  </MainContainer>
</template>

<script setup lang="ts">
import MainContainer from '../../../mf-ministry-consultation/src/components/MainContainer.vue';
import { ref } from 'vue';
import Chart from '@shell/components/Charts/chart_donuts.vue';
import TableComponent from '@shell/components/Table.vue';
import { GESTIONAR_HEADER, GESTIONAR_BODY } from './index';

const chartRef = ref();
const chartRef2 = ref();
const selectedFilter = ref<{ label: string; value: number } | null>(null);
const selectedFilter2 = ref<{ label: string; value: number } | null>(null);
const selectedRows = ref<typeof GESTIONAR_BODY>([]);

// Filtros
const filters = ref({
  coordinadora: '',
  departamento: '',
  municipio: '',
});

// Datos originales con keyId
const originalData = GESTIONAR_BODY.map((item) => ({
  ...item,
  keyId: item.noRadicadoSGDEA,
}));

// Datos filtrados
const tableData = ref([...originalData]);

// Función para limpiar filtros
const cleanFilters = () => {};

const chartConfig = {
  type: 'doughnut',
  data: {
    datasets: [
      {
        label: 'Estado de Procesos',
        data: [45, 30, 15, 10, 45],
        hoverOffset: 20,
        borderColor: '#fff',
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      totalText: true,
    },
  },
};

const chartConfig2 = {
  type: 'doughnut',
  data: {
    labels: ['Por asignar', 'Por gestionar', 'Por revisar', 'Por aprobar', 'En edición'],
    datasets: [
      {
        label: 'Estados Detalle',
        data: [12, 8, 20, 5],
        hoverOffset: 20,
        spacing: 2,
        borderWidth: 1,
        borderColor: '#fff',
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      totalText: true,
    },
  },
};

function onChartClick(event: Event) {
  if (chartRef.value && typeof chartRef.value.getChartDataAtEvent === 'function') {
    const data = chartRef.value.getChartDataAtEvent(event);
    if (data) {
      selectedFilter.value = data;
    }
  }
}

function onChart2Click(event: Event) {
  if (chartRef2.value && typeof chartRef2.value.getChartDataAtEvent === 'function') {
    const data = chartRef2.value.getChartDataAtEvent(event);
    if (data) {
      selectedFilter2.value = data;
    }
  }
}

interface PaginationData {
  page: number;
  rowsPerPage: number;
}

const pagination = ref<PaginationData>({
  page: 1,
  rowsPerPage: 5,
});

const totalPages = ref(Math.ceil(tableData.value.length / pagination.value.rowsPerPage));

const handlePagination = (val: PaginationData) => {
  pagination.value = val;
  totalPages.value = Math.ceil(tableData.value.length / pagination.value.rowsPerPage);
};

const handlePageChange = (page: number) => {
  pagination.value.page = page;
};
</script>
<style scoped>
.chart-container {
  position: relative;
  display: flex;
  justify-content: center;
  height: 30vh;
  width: 30vw;
}
</style>
