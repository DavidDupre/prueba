<template>
  <MainContainer title="Solicitudes Ministerio del Trabajo">
    <div
      style="border-radius: 12px; background-color: #ffff; margin-bottom: 20px"
    >
      <div class="flex justify-center mt-5" style="padding: 1rem">
        <div class="chart-container">
          <Chart ref="chartRef" :config="chartConfig" @click="onChartClick" />
        </div>
        <div class="chart-container" v-if="selectedFilter">
          <Chart
            ref="chartRef2"
            :config="chartConfig2"
            @click="onChart2Click"
          />
        </div>
      </div>
    </div>
    <!-- Filtros -->
    <div
      class="container_background"
      style="padding: 1rem"
      v-if="showDetailSections"
    >
      <span class="text-weight-bold text-h5">Filtrar por</span>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <span class="text-weight-medium">Coordinadora *</span>
          <q-select
            outlined
            label="Seleccione..."
            dense
            emit-value
            map-options
            :options="[
              { value: '1', label: 'COORDINADORA ATLÁNTICO' },
              { value: '2', label: 'COORDINADORA ANTIOQUIA' },
              { value: '3', label: 'COORDINADORA SANTANDER' },
              { value: '4', label: 'COORDINADORA BOGOTÁ' },
              { value: '4', label: 'COORDINADORA VALLE' },
            ]"
          />
        </div>
        <div class="col-12 col-md-4">
          <span class="text-we ight-medium">Departamento *</span>
          <q-select
            outlined
            label="Seleccione..."
            dense
            emit-value
            map-options
            :options="[
              {
                value: 'bogota',
                label: 'Bogotá D.C.',
              },
            ]"
          />
        </div>
        <div class="col-12 col-md-4">
          <span class="text-weight-medium">Municipio</span>
          <q-select
            outlined
            label="Seleccione..."
            dense
            emit-value
            map-options
            :options="[
              {
                value: 'bogota',
                label: 'Bogotá D.C.',
              },
            ]"
          />
        </div>
      </div>
      <div class="row q-mt-md justify-center q-gutter-md">
        <q-btn
          @click="cleanFilters"
          color="secondary"
          outline
          style="
            padding: 18px 60px;
            border-radius: 8px;
            width: 229px;
            height: 48px;
          "
          label="Limpiar Filtros"
        />
        <q-btn
          @click="applyFilters"
          color="primary"
          style="
            padding: 18px 60px;
            border-radius: 8px;
            width: 229px;
            height: 48px;
          "
          label="Buscar"
        />
      </div>
    </div>
    <!-- Bandeja de Asignaciones - Tabla Principal ajustada a 14 columnas solicitadas -->

    <TableComponent
      v-if="showDetailSections"
      :BODY="rowsAsignaciones"
      :HEADER="headersAsignaciones"
      :loading="false"
      :enableSelection="false"
      :selection="selectedAsignaciones"
      :totalPages="paginationAsignacionesTotal"
      :pagination="paginationAsignaciones"
      :sortable="true"
      use-asignaciones-layout
      :accionesConfig="{
        primaryLabel: (row) => getAccionLabel(row.estado),
        showSecondaryButton: true,
        secondaryIcon: 'description',
      }"
      @pagination="onPaginationAsignaciones"
      @pagination-change="onPageChangeAsignaciones"
      @trazabilidad="openTrazabilidad"
      @accion-principal="onAsignarTramite"
      @accion-secundaria="onVerDocumento"
    />

    <q-dialog v-model="showTrazabilidad">
      <q-card
        style="
          padding: 25px 40px;
          border-radius: 20px;
          max-width: 100%;
          position: relative;
        "
      >
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          style="position: absolute; top: 10px; right: 10px"
        />
        <TrazabilidadDialog
          class="full-width"
          v-if="showTrazabilidad"
          :row="rowTrazabilidad"
          @selection-change="onTrazabilidadSelection"
        />
      </q-card>
    </q-dialog>
  </MainContainer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { ChartConfiguration } from "@shell/components/Charts/chart_donuts.vue";
import MainContainer from "../components/MainContainer.vue";
import Chart from "@shell/components/Charts/chart_donuts.vue";
import TableComponent from "@shell/components/Table.vue";
import { ColoresEstado } from "@shell/assets/estados/estados";
import TrazabilidadDialog from "@shell/components/TrazabilidadDialog.vue";
import { h } from "vue";

const estados = [
  { key: "por-asignar", label: "Por asignar", accion: "Asignar" },
  { key: "por-gestionar", label: "Por gestionar", accion: "Gestionar" },
  { key: "por-revisar", label: "Por revisar", accion: "Revisar" },
  { key: "por-aprobar", label: "Por aprobar", accion: "Aprobar" },
  { key: "en-gestionar", label: "En edición", accion: "Editar" },
];

const chartRef = ref();
const chartRef2 = ref();
const selectedFilter = ref<{ label: string; value: number } | null>(null);
const selectedFilter2 = ref<{ label: string; value: number } | null>(null);
const router = useRouter();

const chartConfig: ChartConfiguration<"doughnut"> = {
  type: "doughnut",
  data: {
    labels: [],
    datasets: [
      {
        label: "Estado de Procesos",
        data: [45, 30, 15, 10, 45],
        hoverOffset: 20,
        borderColor: "#fff",
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

// Filas con datos proporcionados + nuevas columnas de tiempos
// Se aplican los valores solicitados para los primeros 5 registros.
const rowTrazabilidad = ref<any | null>(null);
const allRowsAsignaciones = [
  {
    canalRadicacion: "Mail",
    puntoRadicacion: "Mail Sucursal Cundinamarca",
    radicadoSgdDa: "ENT0225624103542",
    fechaRadicacion: "05/11/2025 4:22:24 p.m.",
    entidadRemitente: "Ministerio del Trabajo",
    radicadoRemitente: "MT2410602300981",
    tiempoAsignado: "6 días",
    tiempoPorVencer: "",
    fechaVencimiento: "",
    departamento: "Vichada",
    municipio: "Puerto Carreño",
    nombreAfectado: "Daylin Dayana Heredia Rosas",
    tipoDocumento: "PEP",
    numeroDocumento: "1029854752",
    trazabilidad: h(
      "span",
      { class: "material-icons text-orange text-h4" },
      "history",
    ),
    estado: estados[0].label,
    accionLabel: estados[0].accion,
  },
  {
    canalRadicacion: "Mail",
    puntoRadicacion: "Mail Sucursal Cundinamarca",
    radicadoSgdDa: "ENT0225624103542",
    fechaRadicacion: "05/11/2025 4:22:24 p.m.",
    entidadRemitente: "Ministerio del Trabajo",
    radicadoRemitente: "MT2410602300981",
    tiempoAsignado: "10 días",
    tiempoPorVencer: "",
    fechaVencimiento: "",
    departamento: "Vaupés",
    municipio: "Mitú",
    nombreAfectado: "Daylin Dayana Heredia Rosas",
    tipoDocumento: "PEP",
    numeroDocumento: "1029854752",
    trazabilidad: h(
      "span",
      { class: "material-icons text-orange text-h4" },
      "history",
    ),
    estado: estados[1].label,
    accionLabel: estados[1].accion,
  },
  {
    canalRadicacion: "Mail",
    puntoRadicacion: "Mail Sucursal Cundinamarca",
    radicadoSgdDa: "ENT0225624103542",
    fechaRadicacion: "05/11/2025 4:22:24 p.m.",
    entidadRemitente: "Ministerio del Trabajo",
    radicadoRemitente: "MT2410602300981",
    tiempoAsignado: "10 días",
    tiempoPorVencer: "",
    fechaVencimiento: "",
    departamento: "Bogotá D.C.",
    municipio: "Bogotá D.C.",
    nombreAfectado: "Daylin Dayana Heredia Rosas",
    tipoDocumento: "PEP",
    numeroDocumento: "1029854752",
    trazabilidad: h(
      "span",
      { class: "material-icons text-orange text-h4" },
      "history",
    ),
    estado: estados[2].label,
    accionLabel: estados[2].accion,
  },
  {
    canalRadicacion: "Mail",
    puntoRadicacion: "Oficina Positiva - Mitú",
    radicadoSgdDa: "ENT0225624129345",
    fechaRadicacion: "05/11/2025 4:22:24 p.m.",
    entidadRemitente: "Ministerio del Trabajo",
    radicadoRemitente: "MT2410602328865",
    tiempoAsignado: "10 días",
    tiempoPorVencer: "",
    fechaVencimiento: "",
    departamento: "Meta",
    municipio: "Puerto de Oro",
    nombreAfectado: "Daylin Dayana Heredia Rosas",
    tipoDocumento: "PEP",
    numeroDocumento: "1029854752",
    trazabilidad: h(
      "span",
      { class: "material-icons text-orange text-h4" },
      "history",
    ),
    estado: estados[3].label,
    accionLabel: estados[3].accion,
  },
  {
    canalRadicacion: "Mail",
    puntoRadicacion: "Mail Sucursal Bogotá",
    radicadoSgdDa: "ENT0225624239100",
    fechaRadicacion: "05/11/2025 4:22:24 p.m.",
    entidadRemitente: "Ministerio del Trabajo",
    radicadoRemitente: "MT2410602307852",
    tiempoAsignado: "10 días",
    tiempoPorVencer: "",
    fechaVencimiento: "",
    departamento: "Cundinamarca",
    municipio: "Madrid",
    nombreAfectado: "Daylin Dayana Heredia Rosas",
    tipoDocumento: "PEP",
    numeroDocumento: "1029854752",
    trazabilidad: h(
      "span",
      { class: "material-icons text-orange text-h4" },
      "history",
    ),
    estado: estados[4].label,
    accionLabel: estados[4].accion,
  },
];

// Dona 2: Estados de la tabla
const estadoLabels = estados.map((e) => e.label);
const estadoCounts = computed(() => {
  // Cuenta cuántas filas hay por cada estado
  const counts: Record<string, number> = {};
  estadoLabels.forEach((label) => {
    counts[label] = 0;
  });
  allRowsAsignaciones.forEach((row) => {
    if (counts[row.estado] !== undefined) counts[row.estado]++;
  });
  return estadoLabels.map((label) => counts[label]);
});

const chartConfig2: ChartConfiguration<"doughnut"> = {
  type: "doughnut",
  data: {
    datasets: [
      {
        label: "Estados Detalle",
        data: estadoCounts.value,
        hoverOffset: 20,
        spacing: 2,
        borderWidth: 1,
        borderColor: "#fff",
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

// Mostrar secciones detalladas (filtros y tabla) cuando hay selección en la primera o segunda dona
const showDetailSections = computed(
  () => !!selectedFilter.value || !!selectedFilter2.value,
);

function onChartClick(event: Event) {
  if (
    chartRef.value &&
    typeof chartRef.value.getChartDataAtEvent === "function"
  ) {
    const data = chartRef.value.getChartDataAtEvent(event);
    if (data) {
      selectedFilter.value = data;
    }
  }
}

function onChart2Click(event: Event) {
  if (
    chartRef2.value &&
    typeof chartRef2.value.getChartDataAtEvent === "function"
  ) {
    const data = chartRef2.value.getChartDataAtEvent(event);
    if (data) {
      selectedFilter2.value = data;
    }
  }
}

// Columnas ajustadas según solicitud (14+ columnas) con nuevas columnas de tiempos
// Nota: Se insertan las columnas Tiempo asignado, Tiempo por vencer, Fecha de vencimiento y Departamento
// antes de Municipio (el usuario indicó "entre Notificación positiva y Municipio"; asumimos punto de inserción previo a Municipio).
const headersAsignaciones = ref([
  {
    name: "canalRadicacion",
    label: "Canal de Radicación",
    field: "canalRadicacion",
    align: "left",
    sortable: true,
  },
  {
    name: "puntoRadicacion",
    label: "Punto de Radicación",
    field: "puntoRadicacion",
    align: "left",
    sortable: true,
  },
  {
    name: "radicadoSgdDa",
    label: "No. Radicado SGDDA",
    field: "radicadoSgdDa",
    align: "left",
    sortable: true,
  },
  {
    name: "fechaRadicacion",
    label: "Fecha Radicación",
    field: "fechaRadicacion",
    align: "left",
    sortable: true,
  },
  {
    name: "entidadRemitente",
    label: "Entidad Remitente",
    field: "entidadRemitente",
    align: "left",
    sortable: true,
  },
  {
    name: "radicadoRemitente",
    label: "No. Radicado Remitente",
    field: "radicadoRemitente",
    align: "left",
    sortable: true,
  },
  // Nuevas columnas de tiempos
  {
    name: "tiempoAsignado",
    label: "Tiempo asignado",
    field: "tiempoAsignado",
    align: "center",
    sortable: true,
  },
  {
    name: "tiempoPorVencer",
    label: "Tiempo por vencer",
    field: "tiempoPorVencer",
    align: "center",
    sortable: true,
  },
  {
    name: "fechaVencimiento",
    label: "Fecha de vencimiento",
    field: "fechaVencimiento",
    align: "center",
    sortable: true,
  },
  {
    name: "departamento",
    label: "Departamento",
    field: "departamento",
    align: "left",
    sortable: true,
  },
  {
    name: "municipio",
    label: "Municipio",
    field: "municipio",
    align: "left",
    sortable: true,
  },
  {
    name: "nombreAfectado",
    label: "Nombre del afectado",
    field: "nombreAfectado",
    align: "left",
    sortable: true,
  },
  {
    name: "tipoDocumento",
    label: "Tipo de documento",
    field: "tipoDocumento",
    align: "left",
    sortable: true,
  },
  {
    name: "numeroDocumento",
    label: "Número de documento",
    field: "numeroDocumento",
    align: "left",
    sortable: true,
  },
  {
    name: "trazabilidad",
    label: "Trazabilidad",
    field: "trazabilidad",
    align: "center",
    sortable: false,
  },
  {
    name: "estado",
    label: "Estado",
    field: "estado",
    align: "center",
    sortable: true,
    render: (row: any) => {
      // Mapea el estado local al formato esperado por ColoresEstado
      const estadoMap: Record<string, string> = {
        "Por asignar": "Por asignar",
        "Por gestionar": "Por gestionar",
        "Por revisar": "Por revisar",
        "Por aprobar": "Por aprobar",
        "En edición": "En edición",
      };
      const estado = estadoMap[row.estado] ?? row.estado;
      const { bg, text, border } = ColoresEstado(estado);
      return h(
        "span",
        {
          style: {
            backgroundColor: bg,
            color: text,
            border: border ? `1.5px solid ${border}` : undefined,
            padding: "0 12px",
            fontWeight: "bold",
            borderRadius: "12px",
            display: "inline-block",
            minWidth: "100px",
            textAlign: "center",
          },
        },
        row.estado,
      );
    },
  },
  {
    name: "acciones",
    label: "Acciones",
    field: "acciones",
    align: "right",
    sortable: false,
  },
]);

function getAccionLabel(estado: string) {
  const found = estados.find((e) => e.label === estado);
  return found ? found.accion : "Acción";
}
// Filas con datos proporcionados + nuevas columnas de tiempos
const rowsAsignaciones = computed(() => {
  if (selectedFilter2.value) {
    return allRowsAsignaciones.filter(
      (row) => row.estado === selectedFilter2.value?.label,
    );
  }
  return allRowsAsignaciones;
});

// Actualiza la dona 2 cuando cambian los datos
watch(rowsAsignaciones, () => {
  chartConfig2.data.datasets[0].data = estadoCounts.value;
});

// Utilidades para cálculo de días hábiles y vencimientos
function parseFechaRadicacion(str: string): Date {
  // Formato esperado: dd/MM/yyyy HH:mm:ss a.m./p.m.
  const [fecha] = str.split(" "); // tomamos sólo la parte de la fecha
  const [d, m, y] = fecha.split("/").map(Number);
  // new Date(year, monthIndex, day)
  return new Date(y, m - 1, d);
}

function addBusinessDays(start: Date, days: number): Date {
  const result = new Date(start.getTime());
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) {
      // excluir domingo(0) y sábado(6)
      added++;
    }
  }
  return result;
}

function businessDaysBetween(start: Date, end: Date): number {
  // si end < start retornamos 0
  if (end < start) return 0;
  let count = 0;
  const cursor = new Date(start.getTime());
  while (cursor <= end) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) count++;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count - 1; // excluye el día inicial si se quiere tiempo transcurrido completo
}

function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function colorIndicator(remaining: number): string {
  if (remaining <= 3) return "🔴";
  if (remaining <= 7) return "🟡";
  return "🟢";
}

// Asunción: El campo tiempoAsignado inicial representa el PLAZO asignado (en días hábiles) para el trámite.
// Se recalcula: tiempoAsignado -> días hábiles transcurridos desde la radicación.
// fechaVencimiento -> fechaRadicacion + plazo (días hábiles).
// tiempoPorVencer -> días hábiles restantes hasta el vencimiento con indicador.
function recomputeTiming() {
  const hoy = new Date();
  allRowsAsignaciones.forEach((row) => {
    const rad = parseFechaRadicacion(row.fechaRadicacion);
    const plazoMatch = String(row.tiempoAsignado).match(/(\d+)/);
    const plazoDias = plazoMatch ? parseInt(plazoMatch[1], 10) : 0;
    const fechaVenc = addBusinessDays(rad, plazoDias);
    row.fechaVencimiento = formatDate(fechaVenc);
    const transcurridos = businessDaysBetween(rad, hoy);
    row.tiempoAsignado = `${transcurridos} días`; // días hábiles transcurridos
    const restantes = businessDaysBetween(hoy, fechaVenc);
    row.tiempoPorVencer = `${colorIndicator(restantes)} ${restantes} días`;
  });
}

recomputeTiming();

// Paginación para la nueva tabla
const paginationAsignaciones = ref({ page: 1, rowsPerPage: 5 });
const paginationAsignacionesTotal = computed(() =>
  Math.ceil(
    rowsAsignaciones.value.length / paginationAsignaciones.value.rowsPerPage,
  ),
);
const onPaginationAsignaciones = (val: any) => {
  paginationAsignaciones.value = val;
  const total = Math.ceil(
    rowsAsignaciones.value.length / paginationAsignaciones.value.rowsPerPage,
  );
};
const onPageChangeAsignaciones = (page: number) => {
  paginationAsignaciones.value.page = page;
};

// Selección de filas
const selectedAsignaciones = ref<any[]>([]);
const onSelectionAsignaciones = (sel: any[]) => {
  selectedAsignaciones.value = sel;
  console.log(
    "Seleccion actual asignaciones:",
    sel.map((r) => r.radicadoSgdDa),
  );
};

function openTrazabilidad(row: any) {
  rowTrazabilidad.value = row;
  console.log("Abrir trazabilidad de", row);
  showTrazabilidad.value = true;
}
function onAsignarTramite(row: any) {
  const estadoKey = estados.find((e) => e.label === row.estado)?.key;
  if (estadoKey) {
    router.push(`/form-Ministerio/file/${estadoKey}`);
  } else {
    router.push("/form-Ministerio/file/por-asignar"); // Fallback
  }
}
function onVerDocumento(row: any) {
  console.log("Ver documento de", row);
}

// Mapeo de estado a ícono y color (Material Icons usados por Quasar)
function estadoIcon(estado: string): string {
  const e = estado?.toLowerCase();
  switch (e) {
    case "por asignar":
      return "hourglass_empty";
    case "asignado":
      return "task_alt";
    case "en trámite":
    case "en tramite":
      return "pending_actions";
    case "finalizado":
      return "check_circle";
    case "rechazado":
      return "cancel";
    default:
      return "help_outline";
  }
}

// Estado del diálogo de trazabilidad
const showTrazabilidad = ref(false);
function onTrazabilidadSelection(rows: any[]) {
  console.log("Filas seleccionadas trazabilidad:", rows);
}

// Funciones para filtros
function cleanFilters() {
  console.log("Limpiar filtros");
  // Aquí puedes limpiar los valores de los selectores de filtro
  // Por ejemplo: coordinadoraFilter.value = null; departamentoFilter.value = null; etc.
}

function applyFilters() {
  console.log("Aplicar filtros");
  // Aquí puedes aplicar la lógica de filtrado basándote en los valores seleccionados
  // Por ejemplo: filtrar rowsAsignaciones según los criterios seleccionados
}

const verDetalles = (row: any) => {
  console.log("Ver detalles:", row);
  // Aquí puedes abrir un diálogo o navegar a una página de detalles
};

const editarProceso = (row: any) => {
  console.log("Editar proceso:", row);
  // Aquí puedes abrir un diálogo de edición
};

const eliminarProceso = (row: any) => {
  console.log("Eliminar proceso:", row);
  // Aquí puedes mostrar una confirmación antes de eliminar
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
/* Badge removido: ahora estado se representa solo con ícono */
.trazabilidad-cell {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #ffecdc;
  border: 1px solid #ff7500;
  padding-top: 10px;
  padding-bottom: 10px;
}

.trazabilidad-cell:hover {
  background: rgba(255, 152, 0, 0.1);
  border-radius: 4px;
}

.container_background {
  background-color: #ffffff;
  border-radius: 12px;
  margin-bottom: 20px;
}
</style>
