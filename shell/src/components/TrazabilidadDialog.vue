<template>
  <!-- Dialog reducido tipo popup centrado -->
  <div>
    <q-card-section class="row items-center q-pa-sm q-gutter-sm">
      <div class="col-auto flex column">
        <div class="text-h6 text-weight-bold">Trazabilidad</div>
        <div v-if="props.row" class="text-caption text-grey-7">
          Radicado: {{ props.row.radicadoSgdDa }}
        </div>
      </div>
      <q-space />
      <q-input
        dense
        outlined
        v-model="search"
        placeholder="Buscar canal, usuario, acción, trámite, estado..."
        clearable
        style="max-width: 280px"
        :debounce="300"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-table
        :rows="filteredRows"
        :columns="columnsWithSelection"
        row-key="id"
        flat
        class="q-mt-md trazabilidad-table"
        hide-bottom
      >
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-badge color="orange" text-color="white" :label="props.value" />
          </q-td>
        </template>

        <template v-slot:body-cell-detalle="props">
          <div class="q-gutter-xs">
            <q-btn flat @click="handleDetalleClick(props.row)">
              <div style="display: flex; flex-direction: column; align-items: center">
                <span style="margin-bottom: 4px">{{ props.value }}</span>
                <q-icon name="visibility" color="orange" />
              </div>
            </q-btn>
          </div>
        </template>
      </q-table>
    </q-card-section>
  </div>
  <MultiPurposeDialog
    v-if="showConfirmationDialog && detalleInfo && detalleInfo.estado === 'Por asignar'"
    v-model="showConfirmationDialog"
    type="success"
    :title="'Detalle de Trazabilidad'"
    :subtitle="'Ha radicado el Ministerio del Trabajo <br> <strong>ENT20250000870334</strong>'"
    accept-label="Cerrar"
    cancel-label=""
    :action="onCloseConfirmationDialog"
    :cancel-action="onCloseConfirmationDialog"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import MultiPurposeDialog from './MultiPurposeDialog.vue';

const props = defineProps<{
  modelValue: boolean;
  row?: any; // fila origen para mostrar contexto
}>();

const emit = defineEmits(['update:modelValue', 'selection-change']);

const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const closeDialog = () => {
  showDialog.value = false;
};

interface TraceRow {
  id: number;
  canal: string;
  usuarioResponsable: string;
  detalleUsuario: string;
  accion: string;
  tramite: string;
  fecha: string;
  estado: string;
  detalle: string;
}

interface ColumnDef {
  name: string;
  label: string;
  field: string | ((row: TraceRow) => any);
  required?: boolean;
  align?: 'center' | 'right';
  sortable?: boolean;
  style?: string;
}

const baseColumns = ref<ColumnDef[]>([
  {
    name: 'canal',
    label: 'Canal',
    align: 'center',
    field: 'canal',
    sortable: true,
  },
  {
    name: 'usuarioResponsable',
    label: 'Usuario Responsable',
    align: 'center',
    field: 'usuarioResponsable',
    sortable: true,
  },
  {
    name: 'detalleUsuario',
    label: 'Detalle Usuario',
    align: 'center',
    field: 'detalleUsuario',
    style: 'white-space: normal;',
  },
  {
    name: 'accion',
    label: 'Acción',
    align: 'center',
    field: 'accion',
    style: 'white-space: normal;',
  },
  { name: 'tramite', label: 'Trámite', align: 'center', field: 'tramite', sortable: true },
  { name: 'fecha', label: 'Fecha', align: 'center', field: 'fecha', sortable: true },
  { name: 'estado', label: 'Estado', align: 'center', field: 'estado' },
  { name: 'detalle', label: 'Detalle', align: 'center', field: 'detalle' },
]);
const columnsWithSelection = computed(() => baseColumns.value);
// id column object is available in slot props; no separate computed needed

const search = ref('');
// Datos simulados; podrían filtrarse por props.row en un futuro
const traceabilityData = ref<TraceRow[]>([
  {
    id: 1,
    canal: 'Mail',
    usuarioResponsable: 'Diana Mabel Aristizabal',
    detalleUsuario: 'Radicador Ventanilla SGDEA Oficina Positiva - CAOE -Bogotá',
    accion: 'Registro de Trámite en SGDEA',
    tramite: 'Ministerio del Trabajo',
    fecha: '04/06/2025 08:11 a.m.',
    estado: 'Por asignar',
    detalle: 'Se ha iniciado la radicación...',
  },
  {
    id: 2,
    canal: 'Mail',
    usuarioResponsable: 'Daniela Andrea Rodriguez',
    detalleUsuario: 'Oficina Jurídica - Bogota Positiva Compañía de Seguros',
    accion: 'Modificación del Trámite con Radicado: ENT2020S0528002352',
    tramite: 'Ministerio del Trabajo',
    fecha: '05/06/2025 10:21 a.m.',
    estado: 'Por asignar',
    detalle: 'Se ha iniciado la radicación...',
  },
  {
    id: 3,
    canal: 'Mail',
    usuarioResponsable: 'Daniela Andrea Rodriguez',
    detalleUsuario: 'Oficina Jurídica - Bogota Positiva Compañía de Seguros',
    accion: 'Asignación del Trámite con Radicado: ENT2020S0528002352',
    tramite: 'Ministerio del Trabajo',
    fecha: '05/06/2025 9:41 a.m.',
    estado: 'Por asignar',
    detalle: 'Se ha iniciado la radicación...',
  },
]);
// Selection state map: id -> boolean
const selectedMap = ref<Record<number, boolean>>({});

// Estado y función para el modal de detalles
const showConfirmationDialog = ref(false);
const detalleInfo = ref<TraceRow | null>(null);

function handleDetalleClick(row: TraceRow) {
  if (row.estado === 'Por asignar') {
    detalleInfo.value = row;
    showConfirmationDialog.value = true;
  }
}

function onCloseConfirmationDialog() {
  showConfirmationDialog.value = false;
  detalleInfo.value = null;
}

// Computed getter/setter for select-all
const allSelected = computed({
  get: () =>
    filteredRows.value.length > 0 && filteredRows.value.every((r) => selectedMap.value[r.id]),
  set: (val: boolean) => {
    for (const r of filteredRows.value) {
      selectedMap.value[r.id] = val;
    }
    emit('selection-change', selectedRows.value);
  },
});

const selectedRows = computed(() => traceabilityData.value.filter((r) => selectedMap.value[r.id]));
const filteredRows = computed(() => {
  if (!search.value) return traceabilityData.value;
  const term = search.value.toLowerCase();
  return traceabilityData.value.filter(
    (r) =>
      r.canal.toLowerCase().includes(term) ||
      r.usuarioResponsable.toLowerCase().includes(term) ||
      r.detalleUsuario.toLowerCase().includes(term) ||
      r.accion.toLowerCase().includes(term) ||
      r.tramite.toLowerCase().includes(term) ||
      r.fecha.toLowerCase().includes(term) ||
      r.estado.toLowerCase().includes(term) ||
      r.detalle.toLowerCase().includes(term),
  );
});

// Keep selections consistent when filtering changes
watch(filteredRows, () => {
  const visibleIds = new Set(filteredRows.value.map((r) => r.id));
  for (const key of Object.keys(selectedMap.value)) {
    const id = Number(key);
    if (!visibleIds.has(id)) delete selectedMap.value[id];
  }
});

// Emit changes whenever selection map mutates (rows added/removed)
watch(selectedRows, (val) => {
  emit('selection-change', val);
});

// Initialize selection map (all false)
onMounted(() => {
  for (const r of traceabilityData.value) {
    selectedMap.value[r.id] = false;
  }
});
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 90vw;
}

/* Centrar todos los encabezados */
:deep(.trazabilidad-table thead th) {
  text-align: center !important;
}

/* Mantener el borde del header y quitar bordes del body */
:deep(.trazabilidad-table tbody td) {
  border-bottom: none !important;
}
</style>
