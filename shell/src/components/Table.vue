<template>
  <div>
    <q-table
      flat
      :rows="displayRows"
      :columns="HEADER"
      :row-key="resolvedRowKey"
      table-header-class="text-black text-h6"
      class="q-mr-md full-width"
      style="border-radius: 0.75rem; overflow: hidden; padding: 1rem"
      no-data-label="Sin datos disponibles."
      no-results-label="No se encontraron resultados coincidentes con la búsqueda."
      :loading="loading"
      :key="componentKey"
      v-model:pagination="pagination"
      :selection="enableSelection ? 'multiple' : 'none'"
      v-model:selected="selection"
    >
      <template v-if="enableSelection" v-slot:header-cell-selection>
        <q-checkbox
          v-model="allSelected"
          color="primary"
          :aria-label="allSelected ? 'Deseleccionar todos' : 'Seleccionar todos'"
        />
      </template>
      <template v-if="enableSelection" v-slot:body-cell-selection="{ row }">
        <q-checkbox
          :model-value="isRowSelected(row)"
          @update:model-value="(val) => toggleRow(row, val)"
          color="primary"
          :aria-label="isRowSelected(row) ? 'Deseleccionar fila' : 'Seleccionar fila'"
        />
      </template>

      <!-- Slot para trazabilidad -->
      <template
        v-if="showTrazabilidad && hasColumn('trazabilidad')"
        v-slot:body-cell-trazabilidad="props"
      >
        <q-td class="text-center">
          <q-btn color="primary" flat icon="history" @click="emit('trazabilidad', props.row)" />
          <!-- <q-btn flat color="orange" @click="emit('trazabilidad', props.row)">
            <q-icon name="restart_alt" color="orange" />
          </q-btn> -->
        </q-td>
      </template>

      <!-- Slot para estado -->
      <template v-if="showEstado && hasColumn('estado')" v-slot:body-cell-estado="props">
        <q-td class="text-center flex justify-center items-center">
          <div style="display: flex; align-items: center; justify-content: center; width: 170px; height: 32px;">
            <q-badge
              v-if="props.row.estado"
              :label="props.row.estado"
              :style="getEstadoStyle(props.row.estado)"
            />
          </div>
        </q-td>
      </template>

      <!-- Slot para acciones -->
      <template v-if="showAcciones && hasColumn('acciones')" v-slot:body-cell-acciones="props">
        <q-td class="text-center">
          <div class="q-gutter-xs">
            <q-btn
              v-if="props.row.accionLabel"
              unelevated
              :label="props.row.accionLabel"
              :icon="accionesConfig.primaryIcon"
              @click="emit('accion-principal', props.row)"
            />
            <q-btn
              v-if="accionesConfig.showSecondaryButton"
              @click="emit('accion-secundaria', props.row)"
              aria-label="Acción secundaria"
            >
              <q-icon :name="accionesConfig.secondaryIcon || 'description'" size="18px" />
            </q-btn>
            <!-- Botón de eliminar (trash) -->
            <q-btn
              v-if="accionesConfig.showTrashButton"
              flat
              round
              color="primary"
              icon="delete_outlined"
              aria-label="Eliminar"
              @click="emit('accion-trash', props.row)"
            />
            <!-- Botón de descarga -->
            <q-btn
              v-if="accionesConfig.showDownloadButton"
              flat
              color="primary"
              icon="download"
              aria-label="Descargar"
              @click="emit('descargar-documento', props.row)"
            />
          </div>
        </q-td>
      </template>

      <template v-slot:bottom>
        <div class="row items-center q-mt-md full-width">
          <div class="col-auto flex items-center q-gutter-x-md">
            <span style="font-size: 14px; font-weight: 500">Filas por pagina</span>
            <q-select
              style="width: auto; height: 40px"
              outlined
              dense
              :options="['5', '10']"
              v-model="pagination.rowsPerPage"
            />
          </div>
          <div class="col flex justify-center">
            <q-pagination
              v-model="pagination.page"
              color="primary"
              active-color="primary"
              :max="totalPages"
              direction-links
              gutter="20px"
              :key="pagiKey"
              :max-pages="8"
              @update:modelValue="onPageChange"
            />
          </div>
        </div>
      </template>

      <template v-slot:no-data="{ message }">
        <div class="flex items-center justify-center full-width">
          <div
            class="flex items-center justify-center q-mt-lg"
            style="padding: 15px; border: 1px solid #e3e4e5; border-radius: 5px; gap: 9px"
          >
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
import { computed, ref, defineEmits, watch } from 'vue';
import { QTable, QSelect, QPagination, QIcon, QCheckbox, QChip, QTd, QBadge, QBtn } from 'quasar';
import { ColoresEstado } from '@shell/assets/estados/estados';

const emit = defineEmits([
  'pagination',
  'BODY',
  'pagination-change',
  'update:selection',
  'selection-change',
  'trazabilidad',
  'asignar',
  'ver-documento',
  'accion-principal',
  'accion-secundaria',
  'accion-secundaria',
  'accion-trash',
  'descargar-documento',
  // Interacción de slots personalizados
]);
const pagiKey = ref(1);
const componentKey = ref(0);

interface ActionButton {
  icon: string;
  color?: string;
  label?: string;
  tooltip?: string;
  flat?: boolean;
  onClick: (row: any) => void;
  show?: (row: any) => boolean;
}

const props = withDefaults(
  defineProps<{
    BODY: any[];
    HEADER: any[];
    loading: boolean;
    totalPages: number;
    selection?: any[];
    buscar?: string; // (sin uso externo ahora, se reemplaza por searchTerm interno)
    pagination: { page: number; rowsPerPage: number };
    enableSelection?: boolean;
    actions?: ActionButton[];
    rowKey?: string;
    // Personalización de columnas especiales
    showTrazabilidad?: boolean;
    showEstado?: boolean;
    showAcciones?: boolean;
    accionesConfig?: {
      primaryLabel?: string;
      primaryColor?: string;
      primaryIcon?: string;
      showSecondaryButton?: boolean;
      secondaryIcon?: string;
      showDownloadButton?: boolean;
      showTrashButton?: boolean;
    };
  }>(),
  {
    buscar: '',
    enableSelection: false,
    actions: () => [],
    rowKey: 'keyId',
    showTrazabilidad: true,
    showEstado: true,
    showAcciones: true,
    accionesConfig: () => ({
      primaryLabel: 'Asignar',
      primaryColor: 'orange',
      showSecondaryButton: true,
      secondaryIcon: 'description',
      showDownloadButton: true,
      showTrashButton: false,
    }),
  },
);

// Detectar clave primaria existente en filas (keyId, radicadoSgdDa, numeroDocumento, etc.)
const resolvedRowKey = computed(() => {
  if (!props.BODY || props.BODY.length === 0) return props.rowKey;
  const sample = props.BODY[0];
  if (props.rowKey in sample) return props.rowKey;
  if ('keyId' in sample) return 'keyId';
  if ('radicadoSgdDa' in sample) return 'radicadoSgdDa';
  if ('numeroDocumento' in sample) return 'numeroDocumento';
  return props.rowKey;
});

// Termino de búsqueda interno
const searchTerm = ref('');

// Normalizar texto para búsqueda (remove accents puede añadirse luego)
function normalize(v: any) {
  if (v == null) return '';
  return String(v).toLowerCase();
}

// Filtrado por cualquier columna de HEADER
const filteredRows = computed(() => {
  if (!searchTerm.value) return props.BODY;
  const term = searchTerm.value.toLowerCase();
  return props.BODY.filter((row: any) => {
    return props.HEADER.some((col: any) => {
      const val = row[col.field];
      return normalize(val).includes(term);
    });
  });
});

// Filas a mostrar (paginación manual sobre filtradas para cálculo de selección por página)
const paginatedRows = computed(() => filteredRows.value); // mantener nombre para compatibilidad con lógica existente
const displayRows = computed(() => paginatedRows.value); // alias directo usado en template

const onSearch = () => {
  // Reiniciar página cuando se cambia el término
  if (pagination.value.page !== 1) {
    pagination.value.page = 1;
    emit('pagination-change', 1);
  }
};

const pagination = computed({
  get() {
    return props.pagination;
  },
  set(val) {
    emit('pagination', val);
    pagiKey.value++;
  },
});

const selection = computed({
  get() {
    return props.selection;
  },
  set(value) {
    emit('update:selection', value);
    emit('selection-change', value);
  },
});

const hasColumn = (field: string) => {
  return props.HEADER.some((col) => col.field === field);
};

// Filas visibles en la página actual (para seleccionar todos los de la página)
const currentPageRows = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.rowsPerPage;
  const end = start + pagination.value.rowsPerPage;
  return paginatedRows.value.slice(start, end);
});

const isRowSelected = (row: any) => {
  if (!selection.value) return false;
  const key = resolvedRowKey.value;
  return selection.value.some((r: any) => r[key] === row[key]);
};

const allSelected = computed({
  get() {
    if (!props.enableSelection) return false;
    const rows = currentPageRows.value;
    if (rows.length === 0) return false;
    return rows.every((r) => isRowSelected(r));
  },
  set(val: boolean) {
    const key = resolvedRowKey.value;
    let sel = selection.value ? [...selection.value] : [];
    const pageRows = currentPageRows.value;
    if (val) {
      for (const r of pageRows) {
        if (!sel.some((x: any) => x[key] === r[key])) sel.push(r);
      }
    } else {
      sel = sel.filter((x: any) => !pageRows.some((r) => r[key] === x[key]));
    }
    selection.value = sel;
  },
});

// Nota: Los slots personalizados para trazabilidad, estado y acciones se externalizaron.
// Cualquier personalización debe hacerse ahora desde el componente padre mediante slots.
const onPageChange = (page: number) => {
  pagination.value.page = page;
  emit('pagination-change', page);
};

const toggleRow = (row: any, val: boolean) => {
  const key = resolvedRowKey.value;
  let sel = selection.value ? [...selection.value] : [];
  if (val) {
    if (!sel.some((r: any) => r[key] === row[key])) sel.push(row);
  } else {
    sel = sel.filter((r: any) => r[key] !== row[key]);
  }
  selection.value = sel;
};

// Si cambia el paginado, mantener coherencia de selección (no se deseleccionan automáticamente)
watch(
  () => pagination.value.page,
  () => {
    // No hacemos nada, pero el watch fuerza actualización de allSelected
  },
);

// para llamar otros iconos y botones
// Devuelve el estilo para el badge de estado usando ColoresEstado
function getEstadoStyle(estado: string) {
  if (!estado) return {};
  let estadoKey = estado.trim();
  // Normalización básica
  switch (estadoKey.toLowerCase()) {
    case 'en edición':
      estadoKey = 'En edición';
      break;
    case 'por asignar':
      estadoKey = 'Por asignar';
      break;
    case 'por gestionar':
      estadoKey = 'Por gestionar';
      break;
    case 'por revisar':
      estadoKey = 'Por revisar';
      break;
    case 'por aprobar':
      estadoKey = 'Por aprobar';
      break;
  }
  const { bg, text, border } = ColoresEstado(estadoKey);
  return {
    background: bg,
    color: text,
    border: border ? `1.5px solid ${border}` : undefined,
    fontWeight: 'bold',
    borderRadius: '12px',
    width: '170px',
    height: '32px',
    display: 'flex',
    justifyContent: 'center',
  };
}
// <TableComponent
//   :accionesConfig="{
//     primaryLabel: 'Editar',
//     primaryColor: 'blue',
//     primaryIcon: 'edit',
//     showSecondaryButton: true,
//     secondaryIcon: 'delete'
//   }"
//   @accion-principal="onEditar"
//   @accion-secundaria="onEliminar"
// />

// Ejemplo de métodos para manejar acciones (definir en el componente padre)
// <TableComponent
//   :accionesConfig="{
//     primaryLabel: 'Gestionar',
//     primaryColor: 'primary',
//     showSecondaryButton: false
//   }"
//   @accion-principal="onGestionar"
// />
</script>

<style scoped>
.estado-badge {
  background-color: #bf360c; /* Darker orange for improved contrast */
  color: #fff;
  border: 1px solid #bf360c;
  border-radius: 12px;
  padding: 4px 10px;
  font-weight: 600;
  font-size: 12px;
  text-transform: none;
  letter-spacing: 0.3px;
}
</style>
