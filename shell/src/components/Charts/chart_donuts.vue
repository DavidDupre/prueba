<template>
  <div class="flex justify-center full-width">
    <canvas :id="canvasId"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, onBeforeUnmount, defineProps, defineExpose } from 'vue';
import { Chart, registerables, type ChartConfiguration, type Plugin } from 'chart.js';

Chart.register(...registerables);

// Colores por defecto para los gráficos donut
const DEFAULT_DONUT_COLORS = [
  'rgb(255, 99, 132)', // Red
  'rgb(54, 162, 235)', // Blue
  'rgb(255, 205, 86)', // Yellow
  'rgb(75, 192, 192)', // Teal
  'rgb(153, 102, 255)', // Purple
  'rgb(255, 159, 64)', // Orange
  'rgb(201, 203, 207)', // Grey
  'rgb(255, 99, 71)', // Tomato
  'rgb(255, 140, 0)', // Dark Orange
  'rgb(0, 128, 0)', // Green
  'rgb(0, 0, 255)', // Blue
  'rgb(255, 20, 147)', // Deep Pink
  'rgb(255, 228, 196)', // Bisque
  'rgb(135, 206, 235)', // Sky Blue
  'rgb(240, 230, 140)', // Khaki
  'rgb(128, 0, 128)', // Purple
];

const props = defineProps<{
  config: ChartConfiguration;
}>();

const canvasId = `chart-canvas-${Math.random().toString(36).substr(2, 9)}`;
let chartInstance: Chart | null = null;

// Tipos para opciones de plugins de total
interface CenterTotalOpts {
  display?: boolean;
  font?: { size?: number; family?: string; weight?: string };
  color?: string;
  formatter?: (total: number) => string;
}
interface TotalTextOpts {
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
  formatter?: (total: number) => string;
}
interface PluginFlags {
  centerTotal?: CenterTotalOpts;
  totalText?: boolean | TotalTextOpts;
  totalTextPluginEstados?: boolean | TotalTextOpts;
}
interface IdentifiedPlugin extends Plugin {
  id: string;
}

function appendPlugin(config: ChartConfiguration, plugin: IdentifiedPlugin) {
  if (!config.plugins) config.plugins = [];
  const exists = config.plugins.some((p) => (p as IdentifiedPlugin).id === plugin.id);
  if (!exists) config.plugins.push(plugin);
}

function calcTotal(chart: Chart): number {
  const ds = chart.data.datasets[0];
  const raw = Array.isArray(ds?.data) ? ds!.data : [];
  return raw.reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0);
}

function addCenterTotalPlugin(config: ChartConfiguration) {
  const pluginsOpts = (config.options?.plugins ?? {}) as PluginFlags;
  const opts = pluginsOpts.centerTotal;
  if (!opts?.display) return;
  const plugin: IdentifiedPlugin = {
    id: 'centerTotal',
    beforeDraw(chart) {
      const total = calcTotal(chart);
      const { ctx, width, height } = chart;
      ctx.save();
      const fontSize = opts.font?.size ?? 32;
      const fontFamily = opts.font?.family ?? 'Arial';
      const fontWeight = opts.font?.weight ?? 'bold';
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = opts.color ?? '#333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const text = typeof opts.formatter === 'function' ? opts.formatter(total) : String(total);
      ctx.fillText(text, width / 2, height / 2);
      ctx.restore();
    },
  };
  appendPlugin(config, plugin);
}

function addLegacyTotalPlugins(config: ChartConfiguration) {
  const pluginsOpts = (config.options?.plugins ?? {}) as PluginFlags;
  const flags: Array<{
    key: 'totalText' | 'totalTextPluginEstados';
    opts: boolean | TotalTextOpts | undefined;
  }> = [
    { key: 'totalText', opts: pluginsOpts.totalText },
    { key: 'totalTextPluginEstados', opts: pluginsOpts.totalTextPluginEstados },
  ];

  flags.forEach(({ key, opts }) => {
    if (opts === undefined || opts === false) return;
    const conf: TotalTextOpts = opts === true ? {} : opts;
    const plugin: IdentifiedPlugin = {
      id: key,
      beforeDraw(chart) {
        const total = calcTotal(chart);
        const { ctx, width, height } = chart;
        ctx.save();
        const fontSize = conf.fontSize ?? 32;
        const fontFamily = conf.fontFamily ?? 'Arial';
        const fontWeight = conf.fontWeight ?? 'bold';
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = conf.color ?? '#333';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const text = typeof conf.formatter === 'function' ? conf.formatter(total) : String(total);
        ctx.fillText(text, width / 2, height / 2);
        ctx.restore();
      },
    };
    appendPlugin(config, plugin);
  });
}

function applyDefaultDonutColors(config: ChartConfiguration) {
  // Solo aplica si es tipo doughnut o donut
  if (
    config.type === 'doughnut' ||
    config.type === 'donut' ||
    (config.type && config.type.toString().toLowerCase().includes('doughnut'))
  ) {
    const ds = config.data?.datasets?.[0];
    if (ds) {
      if (!ds.backgroundColor) {
        ds.backgroundColor = DEFAULT_DONUT_COLORS;
      }
      if (!ds.borderColor) {
        ds.borderColor = DEFAULT_DONUT_COLORS;
      }
    }
  }
}

onMounted(() => {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (canvas) {
    const configCopy: ChartConfiguration =
      typeof structuredClone === 'function'
        ? structuredClone(props.config)
        : JSON.parse(JSON.stringify(props.config));
    applyDefaultDonutColors(configCopy);
    addCenterTotalPlugin(configCopy);
    addLegacyTotalPlugins(configCopy);
    chartInstance = new Chart(canvas, configCopy);
  }
});

// Observa cambios en la configuración del gráfico
watch(
  () => props.config,
  (newConfig) => {
    if (chartInstance) {
      chartInstance.destroy();
    }
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (canvas) {
      const configCopy: ChartConfiguration =
        typeof structuredClone === 'function'
          ? structuredClone(newConfig)
          : JSON.parse(JSON.stringify(newConfig));
      applyDefaultDonutColors(configCopy);
      addCenterTotalPlugin(configCopy);
      addLegacyTotalPlugins(configCopy);
      chartInstance = new Chart(canvas, configCopy);
    }
  },
);

// Limpiar el gráfico al desmontar
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});

const getChartDataAtEvent = (event: Event) => {
  if (!chartInstance) return null;
  const elements = chartInstance.getElementsAtEventForMode(
    event,
    'nearest',
    { intersect: true },
    false,
  );
  if (elements.length > 0 && elements[0]) {
    const elementIndex = elements[0].index; // Índice del elemento clicado
    const label =
      (props.config.data.labels && props.config.data.labels[elementIndex]) ||
      `Item ${elementIndex + 1}`; // Etiqueta fallback
    const value = (props.config.data.datasets?.[0]?.data || [])[elementIndex]; // Valor
    return { label, value } as { label: string; value: number };
  }
  return null;
};

// Exponer métodos al componente padre
defineExpose({
  getChartDataAtEvent,
});
</script>

<style scoped>
canvas {
  max-width: 100%;
}
</style>
