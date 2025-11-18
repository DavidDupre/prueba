<template>
  <q-dialog
    v-model="isOpen"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card>
      <q-bar class="bg-primary text-white">
        <q-icon name="edit" />
        <div class="text-h6 q-ml-sm">Editar Información General</div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip>Cerrar</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="scroll" style="max-height: calc(100vh - 100px)">
        <q-form @submit="onSubmit" class="q-gutter-md">
          <!-- Datos del Remitente -->
          <div class="text-h6 text-primary q-mt-md q-mb-md">
            <q-icon name="person" class="q-mr-sm" />
            Datos del Remitente
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="formData.senderName"
                label="Nombre del Remitente"
                outlined
                dense
                :rules="[(val) => !!val || 'Campo requerido']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="formData.country"
                :options="countries"
                label="País"
                outlined
                dense
                :rules="[(val) => !!val || 'Campo requerido']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="formData.department"
                :options="departments"
                label="Departamento"
                outlined
                dense
                :rules="[(val) => !!val || 'Campo requerido']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="formData.municipality"
                :options="municipalities"
                label="Municipio"
                outlined
                dense
                :rules="[(val) => !!val || 'Campo requerido']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formData.address"
                label="Dirección"
                outlined
                dense
                :rules="[(val) => !!val || 'Campo requerido']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formData.phone"
                label="Teléfono"
                outlined
                dense
                mask="##########"
                :rules="[(val) => !!val || 'Campo requerido']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formData.mobile"
                label="Celular"
                outlined
                dense
                mask="##########"
                :rules="[(val) => !!val || 'Campo requerido']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formData.email"
                label="E-Mail Remitente"
                type="email"
                outlined
                dense
                :rules="[
                  (val) => !!val || 'Campo requerido',
                  (val) => /.+@.+\..+/.test(val) || 'Email inválido',
                ]"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formData.physicalStickerCode"
                label="Código Sticker Físico"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formData.ministryCode"
                label="Código Ministerio del Trabajo"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="formData.filingChannel"
                :options="filingChannels"
                label="Canal de Radicación"
                outlined
                dense
                :rules="[(val) => !!val || 'Campo requerido']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formData.requestDate"
                label="Fecha Ingreso del Requerimiento"
                outlined
                dense
                readonly
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="formData.requestDate" mask="DD/MM/YYYY">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Cerrar" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>

          <q-separator class="q-my-lg" />

          <!-- Datos del Afectado -->
          <div class="text-h6 text-primary q-mb-md">
            <q-icon name="badge" class="q-mr-sm" />
            Datos del Afectado
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-select
                v-model="formData.documentType"
                :options="documentTypes"
                label="Tipo de Documento"
                outlined
                dense
                :rules="[(val) => !!val || 'Campo requerido']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formData.documentNumber"
                label="Número de Documento"
                outlined
                dense
                :rules="[(val) => !!val || 'Campo requerido']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formData.affectedName"
                label="Nombre del Afectado"
                outlined
                dense
                :rules="[(val) => !!val || 'Campo requerido']"
              />
            </div>
          </div>

          <q-separator class="q-my-lg" />

          <!-- Detalle de la Solicitud -->
          <div class="text-h6 text-primary q-mb-md">
            <q-icon name="description" class="q-mr-sm" />
            Detalle de la Solicitud
          </div>
          <div class="row">
            <div class="col-12">
              <q-input
                v-model="formData.description"
                label="Descripción"
                type="textarea"
                outlined
                rows="5"
                :rules="[(val) => !!val || 'Campo requerido']"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Cancelar" color="negative" v-close-popup />
        <q-btn unelevated label="Guardar Cambios" color="primary" icon="save" @click="onSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';

interface Props {
  modelValue: boolean;
  initialData?: FormData;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', data: FormData): void;
}

interface FormData {
  senderName: string;
  country: string;
  department: string;
  municipality: string;
  address: string;
  phone: string;
  mobile: string;
  email: string;
  physicalStickerCode: string;
  ministryCode: string;
  filingChannel: string;
  requestDate: string;
  documentType: string;
  documentNumber: string;
  affectedName: string;
  description: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
});

const emit = defineEmits<Emits>();

const $q = useQuasar();
const isOpen = ref(props.modelValue);

// Opciones para los selects
const countries = ['Colombia', 'Venezuela', 'Ecuador', 'Perú', 'Brasil'];
const departments = ['Antioquia', 'Cundinamarca', 'Valle del Cauca', 'Santander', 'Atlántico'];
const municipalities = ['Bello', 'Medellín', 'Envigado', 'Itagüí', 'Sabaneta'];
const filingChannels = ['Ventanilla', 'Correo Electrónico', 'Portal Web', 'Teléfono'];
const documentTypes = [
  'CC - Cédula de Ciudadanía',
  'CE - Cédula de Extranjería',
  'TI - Tarjeta de Identidad',
  'PP - Pasaporte',
  'NIT - Número de Identificación Tributaria',
];

// Datos del formulario
const formData = ref({
  senderName: 'Ministerio del Trabajo',
  country: 'Colombia',
  department: 'Antioquia',
  municipality: 'Bello',
  address: 'Calle 4 No. 3.44, Piso 1',
  phone: '6085446598',
  mobile: '3115672345',
  email: 'regional.bello@mintrabajo.gov.co',
  physicalStickerCode: 'ENF021120250521001',
  ministryCode: 'MTR04202505997S',
  filingChannel: 'Ventanilla',
  requestDate: '21/05/2025',
  documentType: 'CC - Cédula de Ciudadanía',
  documentNumber: '67023455',
  affectedName: 'Citali Chivundoy Pisba',
  description:
    'Solicitud de revisión de contrato laboral y condiciones de trabajo. El afectado reporta irregularidades en el pago de horas extras y compensaciones no reconocidas según lo estipulado en el contrato. Se requiere intervención del Ministerio del Trabajo para verificar el cumplimiento de la normativa laboral vigente.',
});

// Sincronizar con v-model
watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal;
  },
);

watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal);
});

// Cargar datos iniciales si se proporcionan
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.value = { ...formData.value, ...newData };
    }
  },
  { immediate: true },
);

const onSubmit = () => {
  $q.notify({
    type: 'positive',
    message: 'Información actualizada correctamente',
    position: 'top-right',
  });

  emit('save', formData.value);
  isOpen.value = false;
};
</script>

<style scoped>
.q-card {
  max-width: 1400px;
  margin: auto;
}
</style>
