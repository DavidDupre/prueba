<template>
  <div class="q-pa-xl">
    <div class="text-weight-bold text-h5">
      <p>Usuarios en copia</p>
    </div>

    <!-- Sección: Usuarios en copia -->
    <FormComponentModel v-model="formData" :form="datosUsuariosCopia" />

    <!-- Mostrar Copia interna y externa solo si el tipo de respuesta es 'Interna y Externa' (valor '3') -->
    <template v-if="formData?.select_vq4r6s === '3'">
      <q-separator class="q-my-lg" />

      <!-- Título: Copia Interna -->
      <div class="text-weight-bold text-h5">
        <p>Copia Interna</p>
      </div>

      <!-- Sección: Copia Interna -->
      <FormComponentModel v-model="formData" :form="datosCopiaInterna" />

      <!-- Botones -->
      <div class="row justify-center q-mt-md q-gutter-sm">
        <q-btn
          label="Limpiar"
          text-color="black"
          style="border-radius: 8px; width: 200px; height: 48px; border: 1px solid #f2f4f5"
          no-caps
        />
        <q-btn
          label="Agregar"
          color="primary"
          style="border-radius: 8px; width: 200px; height: 48px"
          no-caps
        />
      </div>

      <q-separator class="q-my-lg" />

      <!-- Título: Usuarios internos en copia -->
      <div>
        <div class="text-weight-bold text-h5">
          <p>Usuarios internos en copia</p>
        </div>

        <TableComponent
          :BODY="usuariosInternos"
          :HEADER="usuariosInternosHeader"
          :accionesConfig="{
            showDownloadButton: false,
            showTrashButton: true,
          }"
          :pagination="paginationAsignaciones"
          @accion-principal="onGestionar"
          @accion-trash="onEliminarUsuario"
        />
      </div>

      <q-separator class="q-my-lg" />

      <!-- Título: Copia externa -->
      <div class="text-weight-bold text-h5">
        <p>Copia Externa</p>
      </div>

      <!-- Sección: Copia externa -->
      <FormComponentModel v-model="formData" :form="datosCopiaExterna" />

      <!-- Botones -->
      <div class="row justify-center q-mt-md q-gutter-sm">
        <q-btn
          label="Limpiar"
          text-color="black"
          style="border-radius: 8px; width: 200px; height: 48px; border: 1px solid #f2f4f5"
          no-caps
        />
        <q-btn
          label="Agregar"
          color="primary"
          style="border-radius: 8px; width: 200px; height: 48px"
          no-caps
        />
      </div>

      <q-separator class="q-my-lg" />
      <div>
        <div class="text-weight-bold text-h5">
          <p>Tabla de destinatarios externos</p>
        </div>
        <TableComponent
          :BODY="destinatariosExternos"
          :HEADER="destinatariosExternosHeader"
          :accionesConfig="{
            showDownloadButton: false,
            showTrashButton: true,
          }"
          :pagination="paginationAsignaciones"
          @accion-principal="onGestionarDestinatario"
          @accion-trash="onEliminarDestinatario"
        />
      </div>
    </template>
  </div>
  <!-- Botones -->
  <div class="row justify-center q-mt-md q-gutter-sm">
    <q-btn
      label="Cancelar"
      text-color="black"
      style="border-radius: 8px; width: 200px; height: 48px; border: 1px solid #f2f4f5"
      no-caps
    />
    <q-btn
      label="Siguiente"
      :icon-right="'chevron_right'"
      color="primary"
      style="border-radius: 8px; width: 200px; height: 48px"
      no-caps
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import FormJs from '../../../boot/formInt&Ext.json';
import FormComponentModel from '@shell/components/Forms/FormComponentModel.vue';
import { fieldConfigParser } from '@shell/components/Forms/formParser';
import TableComponent from '@shell/components/Table.vue';

const props = defineProps<{
  cotizacionId?: string | number;
  isEdit?: boolean;
  isCotFromCore: boolean;
  ramo: number;
}>();

// estado reactivo para los valores del formulario (v-model)
const formData = ref<Record<string, unknown>>({});
const paginationAsignaciones = ref({ page: 1, rowsPerPage: 5 });

const datosUsuariosCopia = computed(() => {
  return fieldConfigParser(FormJs);
});

const datosCopiaInterna = computed(() => {
  const interno = { components: FormJs.Interno.components };
  return fieldConfigParser(interno);
});

const datosCopiaExterna = computed(() => {
  const externo = { components: FormJs.Externa.components };
  return fieldConfigParser(externo);
});

const emit = defineEmits<{
  cancel: [];
  continue: [data: Record<string, unknown>];
}>();

function onCancel() {
  emit('cancel');
}

function onContinue() {
  emit('continue', formData);
}

const usuariosInternos = ref([
  { id: 1, dependencia: 'Dependencia A', nombre: 'Juan Pérez' },
  { id: 2, dependencia: 'Dependencia B', nombre: 'Ana Gómez' },
]);

const usuariosInternosHeader = [
  { name: 'dependencia', label: 'Dependencia', field: 'dependencia', align: 'center' },
  { name: 'nombre', label: 'Nombre funcionario', field: 'nombre', align: 'center' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
];

const destinatariosExternosHeader = [
  { name: 'tipoDocumento', label: 'Tipo de documento', field: 'tipoDocumento', align: 'center' },
  { name: 'deDestinatario', label: 'de destinatario', field: 'deDestinatario', align: 'center' },
  {
    name: 'numDocumentoDest',
    label: 'Número de documento de destinatario',
    field: 'numDocumentoDest',
    align: 'center',
  },
  { name: 'nombreDest', label: 'Nombre del destinatario', field: 'nombreDest', align: 'center' },
  {
    name: 'direccionDest',
    label: 'Dirección del destinatario',
    field: 'direccionDest',
    align: 'center',
  },
  { name: 'noRadicado', label: 'No. Radicado', field: 'noRadicado', align: 'center' },
  { name: 'remitente', label: 'Remitente', field: 'remitente', align: 'center' },
  { name: 'paisDest', label: 'País del destinatario', field: 'paisDest', align: 'center' },
  { name: 'departamento', label: 'Departamento', field: 'departamento', align: 'center' },
  { name: 'ciudad', label: 'Ciudad', field: 'ciudad', align: 'center' },
  {
    name: 'departamentoDest',
    label: 'Departamento del destinatario',
    field: 'departamentoDest',
    align: 'center',
  },
  {
    name: 'docNombreAfectado',
    label: 'Documento y Nombre del afectado',
    field: 'docNombreAfectado',
    align: 'center',
  },
  {
    name: 'municipioDest',
    label: 'Municipio del destinatario',
    field: 'municipioDest',
    align: 'center',
  },
  { name: 'carpeta', label: 'Carpeta', field: 'carpeta', align: 'center' },
  { name: 'estadoProceso', label: 'Estado proceso', field: 'estadoProceso', align: 'center' },
  { name: 'formaEnvio', label: 'Forma de envío', field: 'formaEnvio', align: 'center' },
  {
    name: 'telefonoDest',
    label: 'Teléfono del destinatario',
    field: 'telefonoDest',
    align: 'center',
  },
  {
    name: 'correoDest',
    label: 'Correo electrónico del destinatario',
    field: 'correoDest',
    align: 'center',
  },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
];

const destinatariosExternos = ref([
  {
    id: 1,
    tipoDocumento: 'Cédula',
    deDestinatario: 'Persona',
    numDocumentoDest: '123456789',
    nombreDest: 'Carlos Ramírez',
    direccionDest: 'Calle 123 #45-67',
    noRadicado: 'RAD-001',
    remitente: 'Empresa X',
    paisDest: 'Colombia',
    departamento: 'Antioquia',
    ciudad: 'Medellín',
    departamentoDest: 'Antioquia',
    docNombreAfectado: 'Cédula - Pedro Torres',
    municipioDest: 'Medellín',
    carpeta: 'Procesos 2025',
    estadoProceso: 'En trámite',
    formaEnvio: 'Correo',
    telefonoDest: '3001234567',
    correoDest: 'carlos.ramirez@email.com',
  },
  {
    id: 2,
    tipoDocumento: 'Pasaporte',
    deDestinatario: 'Empresa',
    numDocumentoDest: '987654321',
    nombreDest: 'María López',
    direccionDest: 'Av. Siempre Viva 742',
    noRadicado: 'RAD-002',
    remitente: 'Empresa Y',
    paisDest: 'Colombia',
    departamento: 'Cundinamarca',
    ciudad: 'Bogotá',
    departamentoDest: 'Cundinamarca',
    docNombreAfectado: 'Pasaporte - Juan Díaz',
    municipioDest: 'Bogotá',
    carpeta: 'Procesos 2025',
    estadoProceso: 'Finalizado',
    formaEnvio: 'Mensajería',
    telefonoDest: '3109876543',
    correoDest: 'maria.lopez@email.com',
  },
]);

function onEliminarDestinatario(row: any) {
  destinatariosExternos.value = destinatariosExternos.value.filter((u) => u.id !== row.id);
}

function onGestionarDestinatario(row: any) {
  // lógica de gestionar destinatario externo
  console.log('Gestionar destinatario:', row);
}

function onEliminarUsuario(row: any) {
  usuariosInternos.value = usuariosInternos.value.filter((u) => u.id !== row.id);
}

function onGestionar(row: any) {
  // lógica de gestionar usuario interno
  console.log('Gestionar usuario:', row);
}
</script>
