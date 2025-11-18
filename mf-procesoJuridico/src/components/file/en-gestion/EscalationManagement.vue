<template>
  <div class="q-pa-xl">
    <div class="text-h6 text-bold q-mb-lg">Listado de respuestas de escalamiento</div>
    <div v-if="!mostrarComentarios">
      <Table
        :BODY="respuestasEscalamiento"
        :HEADER="columnasEscalamiento"
        :loading="false"
        :enableSelection="true"
        :selection="selectedAsignaciones"
        :totalPages="paginationAsignacionesTotal"
        :pagination="paginationAsignaciones"
        :showAcciones="true"
        :accionesConfig="{
          primaryLabel: 'Ver escalamiento',
          primaryIcon: 'visibility',
          showSecondaryButton: false,
          showDownloadButton: false,
          showTrashButton: false,
        }"
        @accion-principal="onVerEscalamiento"
      />
    </div>
    <div v-else>
      <div class="col-12 q-mb-md">
        <span class="custom-label text-weight-bold">Comentarios</span>
        <q-input
          type="textarea"
          v-model="comentarios"
          class="mb-3"
          label="0/10000"
          outlined
          dense
        />
      </div>
      <q-table
        flat
        :rows="documentosAdjuntos"
        :columns="columnasDocumentos"
        hide-pagination
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-acciones="props">
          <div class="row q-gutter-x-sm justify-center">
            <q-btn flat @click="abrirDialogoSoporte(props.row)">
              <div class="" style="font-size: 12px">
                <span>Adjuntar como <br />soportes al Doc. Salida</span>
              </div>
            </q-btn>
          </div>
        </template>
      </q-table>
    </div>
  </div>
  <MultiPurposeDialog
    v-if="dialogoSoporteVisible"
    type="question"
    title="Confirme antes de continuar"
    description="¿Está seguro de adjuntar soportes al Documento de Salida?"
    accept-label="Si"
    cancel-label="No"
    :action="guardarSoporte"
    :cancel-action="cancelarSoporte"
  />
</template>

<script setup lang="ts">
import MultiPurposeDialog from '@shell/components/MultiPurposeDialog.vue';
import Table from '@shell/components/Table.vue';
import { ref } from 'vue';

function descargarDocumento(row: any) {
  // Aquí va la lógica para descargar el documento
  // Por ejemplo, si row.formato es la URL o nombre del archivo:
  // window.open(`/ruta/a/descargas/${row.formato}`, '_blank');
  // Puedes ajustar la ruta según tu backend o almacenamiento
  console.log('Descargar documento:', row.formato);
}

const selectedAsignaciones = ref<any[]>([]);
const paginationAsignaciones = ref({ page: 1, rowsPerPage: 5 });
const paginationAsignacionesTotal = ref(1);
const mostrarComentarios = ref(false);
const comentarios = ref('');
const dialogoSoporteVisible = ref(false);
let soporteSeleccionado = null;

const columnasEscalamiento = [
  { name: 'nombre', label: 'Nombre del gestionador escalado', field: 'nombre', align: 'center' },
  { name: 'oficina', label: 'Oficina', field: 'oficina', align: 'center' },
  {
    name: 'fecha_respuesta',
    label: 'Fecha y hora de respuesta',
    field: 'fecha_respuesta',
    align: 'center',
  },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  { name: 'motivo_rechazo', label: 'Motivo de rechazo', field: 'motivo_rechazo', align: 'center' },
  { name: 'radicado', label: 'No. Radicado', field: 'radicado', align: 'center' },
  { name: 'remitente', label: 'Remitente', field: 'remitente', align: 'center' },
  { name: 'departamento', label: 'Departamento', field: 'departamento', align: 'center' },
  { name: 'ciudad', label: 'Ciudad', field: 'ciudad', align: 'center' },
  { name: 'documento', label: 'Documento', field: 'documento', align: 'center' },
  {
    name: 'nombre_afectado',
    label: 'Nombre del afectado',
    field: 'nombre_afectado',
    align: 'center',
  },
  { name: 'carpeta', label: 'Carpeta', field: 'carpeta', align: 'center' },
  { name: 'estado_proceso', label: 'Estado proceso', field: 'estado_proceso', align: 'center' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
];

const respuestasEscalamiento = [
  {
    nombre: 'Juan Pérez',
    oficina: 'Oficina Central',
    fecha_respuesta: '09/11/2025 10:30',
    estado: 'Aprobado',
    motivo_rechazo: '',
    radicado: '2025-000123',
    remitente: 'Ana Gómez',
    departamento: 'Cundinamarca',
    ciudad: 'Bogotá',
    documento: 'ENT202050528002352.pdf',
    nombre_afectado: 'Carlos Ruiz',
    carpeta: 'Procesos 2025',
    estado_proceso: 'En gestión',
    accionLabel: 'Ver escalamiento',
  },
  {
    nombre: 'Laura Torres',
    oficina: 'Oficina Norte',
    fecha_respuesta: '08/11/2025 15:20',
    estado: 'Rechazado',
    motivo_rechazo: 'Falta de información',
    radicado: '2025-000124',
    remitente: 'Pedro Díaz',
    departamento: 'Antioquia',
    ciudad: 'Medellín',
    documento: 'ENT202050528002353.pdf',
    nombre_afectado: 'María López',
    carpeta: 'Procesos 2025',
    estado_proceso: 'Finalizado',
    accionLabel: 'Ver escalamiento',
  },
];

// Datos de documentos adjuntos
const documentosAdjuntos = [
  {
    formato: 'ENT202050528002352.pdf',
    nombre: 'De entrada',
    tipo: 'Documento principal',
    fecha: '20/10/2025 09:42',
    usuario: 'default_radicador',
  },
  {
    formato: 'ENT202050528002352.jpg',
    nombre: 'De entrada',
    tipo: 'Imagen anexa',
    fecha: '20/10/2025 09:42',
    usuario: 'default_radicador',
  },
];

const columnasDocumentos = [
  { name: 'formato', label: 'Formato', field: 'formato', align: 'center' },
  { name: 'nombre', label: 'Nombre del documento', field: 'nombre', align: 'center' },
  { name: 'tipo', label: 'Tipo de documento', field: 'tipo', align: 'center' },
  { name: 'fecha', label: 'Fecha de cargue', field: 'fecha', align: 'center' },
  { name: 'usuario', label: 'Cargada por', field: 'usuario', align: 'center' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
];

function onVerEscalamiento(row: any) {
  mostrarComentarios.value = true;
}

function abrirDialogoSoporte(row: any) {
  soporteSeleccionado = row;
  dialogoSoporteVisible.value = true;
}

function guardarSoporte() {
  // Aquí va la lógica para guardar el soporte seleccionado
  console.log('Soporte adjuntado:', soporteSeleccionado);
  dialogoSoporteVisible.value = false;
}

function cancelarSoporte() {
  dialogoSoporteVisible.value = false;
}
</script>
