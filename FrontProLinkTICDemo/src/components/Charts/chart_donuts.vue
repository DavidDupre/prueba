<template>
  <div class="tw-flex tw-w-full tw-justify-center">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, defineProps } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// Definición de las props
const props = defineProps<{
  config: any;
}>();

const canvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

// Al montarse el componente, se crea el gráfico
onMounted(() => {
  chartInstance = new Chart(canvas.value as HTMLCanvasElement, props.config);
});

// Observa cambios en la configuración del gráfico
watch(() => props.config, (newConfig) => {
  if (chartInstance) {
    chartInstance.destroy(); // Destruir el gráfico anterior
  }
  chartInstance = new Chart(canvas.value as HTMLCanvasElement, newConfig); // Crear un nuevo gráfico
});

// Limpiar el gráfico al desmontar
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});

const getChartDataAtEvent = (event) => {
  if (!chartInstance) return null;
  const elements = chartInstance.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
  if (elements.length > 0) {
    const elementIndex = elements[0].index; // Obtén el índice del elemento clicado
    const label = props.config.data.labels[elementIndex]; // Obtén la etiqueta
    const value = props.config.data.datasets[0].data[elementIndex]; // Obtén el valor
    return { label, value };
  }
  return null;
};

// Ahora, podemos vincular la función a la instancia del componente
const chartMethods = {
  getChartDataAtEvent
};

// Para que el componente padre pueda acceder a las funciones, vincula `chartMethods` a la instancia del componente
defineExpose(chartMethods);

</script>

<style scoped>
canvas {
  max-width: 100%;
}
</style>
