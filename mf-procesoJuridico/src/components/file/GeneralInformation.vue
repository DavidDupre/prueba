<template>
  <div class="q-pa-md container_background">
    <!-- Datos del Remitente -->
    <q-expansion-item expand-separator default-opened>
      <template v-slot:header>
        <div class="text-weight-bold text-h5 col row">
          <p>Datos del Remitente</p>
        </div>
      </template>
      <div v-if="processStatus === 'por-asignar'" class="flex justify-end">
        <component-button
          outline
          :class="'q-mb-md'"
          text="Editar"
          icon="edit"
          @click="enableEdit"
          style="width: 120px; height: 42px"
        />
      </div>
      <q-card>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4" v-for="item in senderData" :key="item.label">
              <q-input
                v-if="isEditing"
                v-model="item.value"
                :label="item.label"
                outlined
                dense
                :disable="['Nombre del Remitente', 'País', 'Canal de Radicación'].includes(item.label)"
              />
              <div v-else>
                <div class="text-caption text-grey-7">{{ item.label }}</div>
                <div class="text-body1 text-weight-medium">{{ item.value }}</div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <!-- Datos del Afectado -->
    <q-expansion-item expand-separator default-opened>
      <template v-slot:header>
        <div class="text-weight-bold text-h5 col row">Datos del Afectado</div>
      </template>
      <q-card>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4" v-for="item in affectedData" :key="item.label">
              <q-input v-if="isEditing" v-model="item.value" :label="item.label" outlined dense />
              <div v-else>
                <div class="text-caption text-grey-7">{{ item.label }}</div>
                <div class="text-body1 text-weight-medium">{{ item.value }}</div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <!-- Detalle de la Solicitud -->
    <q-expansion-item expand-separator default-opened>
      <template v-slot:header>
        <div class="text-weight-bold text-h5 col row">Detalle de la Solicitud</div>
      </template>
      <q-card>
        <q-card-section>
          <q-input
            v-if="isEditing"
            v-model="requestDetailData.description"
            label="Descripción"
            type="textarea"
            outlined
            rows="5"
          />
          <div v-else>
            <!-- <div class="text-caption text-grey-7">Descripción</div> -->
            <div class="text-body1">{{ requestDetailData.description }}</div>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <!-- Documentos Asociados -->
    <q-expansion-item expand-separator default-opened>
      <template v-slot:header>
        <div class="text-weight-bold text-h5 col row">Documentos Asociados</div>
      </template>
      <q-card>
        <q-card-section>
          <p class="titles q-px-md q-mb-md q-mt-lg">Documento de soporte</p>

          <div class="flex row q-px-md wrap q-mr-auto q-gutter-md q-pb-md">
            <q-card
              class="flex row items-center q-gutter-x-sm q-px-md q-py-sm"
              style="max-width: 400px; margin-right: auto"
              flat
              bordered
              v-for="doc in documents.filter((d) => d.type === 'PDF')"
              :key="doc.id"
            >
              <q-icon :name="getDocIcon(doc.type)" :color="getDocColor(doc.type)" size="26px" />
              <p class="text-sm text-weight-bold">{{ doc.name }}</p>
              <q-icon size="20px" class="text-grey-7" name="info_outline">
                <q-tooltip>{{ doc.type }} - {{ doc.size }} - {{ doc.date }}</q-tooltip>
              </q-icon>

              <q-btn flat dense round @click="downloadDocument(doc)">
                <q-icon size="20px" class="text-grey-7" name="file_download" />
              </q-btn>
            </q-card>
          </div>

          <p class="titles q-px-md q-mb-md q-mt-lg">Documentos adjuntos</p>

          <div class="flex row q-px-md wrap q-mr-auto q-gutter-md q-pb-md">
            <q-card
              class="flex row items-center q-gutter-x-sm q-px-md q-py-sm"
              style="max-width: 400px; margin-right: auto"
              flat
              bordered
              v-for="doc in documents"
              :key="doc.id"
            >
              <q-icon :name="getDocIcon(doc.type)" :color="getDocColor(doc.type)" size="26px" />
              <p class="text-sm text-weight-bold">{{ doc.name }}</p>
              <q-icon size="20px" class="text-grey-7" name="info_outline">
                <q-tooltip>{{ doc.type }} - {{ doc.size }} - {{ doc.date }}</q-tooltip>
              </q-icon>
              <q-btn flat dense round @click="viewDocument(doc)">
                <q-icon size="20px" class="text-grey-7" name="visibility" />
              </q-btn>
              <q-btn flat dense round @click="downloadDocument(doc)">
                <q-icon size="20px" class="text-grey-7" name="file_download" />
              </q-btn>
            </q-card>
          </div>
          <p class="titles q-px-md q-mb-md q-mt-lg">Documento de salida</p>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </div>
  <!-- Botones de Acción al final -->
  <div v-if="isEditing" class="row justify-center q-mt-md q-gutter-sm">
    <component-button
      flat
      :colorButton="'secondary'"
      :colorText="'secondary'"
      :class="'q-mb-md'"
      text="Cancelar"
      @click="cancelEdit"
      style="width: 120px; height: 42px"
    />
    <component-button
      :colorButton="'primary'"
      :colorText="'white'"
      :class="'q-mb-md'"
      text="Guardar"
      @click="modalVisibleTotal = true"
      style="width: 120px; height: 42px"
    />
  </div>
  <!-- Modal de Confirmación -->
  <template v-if="modalVisibleTotal">
    <MultiPurposeDialog
      v-if="modalVisibleTotal"
      type="question"
      title="Confirmación"
      description="¿Desea guardar la información ingresada para editar los datos del radicado?"
      accept-label="Guardar"
      cancel-label="Cancelar"
      :action="saveChanges"
      :cancel-action="
        () => {
          modalVisibleTotal = false;
          return false;
        }
      "
    />
  </template>
</template>

<script setup lang="ts">
import { ref, inject, type Ref } from 'vue';
import { useQuasar } from 'quasar';
import MultiPurposeDialog from '@shell/components/MultiPurposeDialog.vue';
import ComponentButton from '@shell/components/ComponentButton.vue';

// Inyectar el estado del proceso desde el componente padre
const processStatus = inject<Ref<'por-asignar' | 'por-gestionar' | 'en-gestion'>>(
  'processStatus',
  ref('por-asignar'),
);

const modalVisibleTotal = ref(false);

interface DataItem {
  label: string;
  value: string;
}

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  date: string;
}

const $q = useQuasar();
const isEditing = ref(false);
let originalData: any = null;

const senderData = ref<DataItem[]>([
  { label: 'Nombre del Remitente', value: 'Ministerio del Trabajo' }, //deshabilitar
  { label: 'País', value: 'Colombia' }, //deshabilitar
  { label: 'Departamento', value: 'Bogotá D.C.' },
  { label: 'Municipio', value: 'Bogotá D.C.' },
  { label: 'Dirección', value: 'Calle 4 No. 3.44, Piso 1' },
  { label: 'Teléfono', value: '6085446598' },
  { label: 'Celular', value: '3115672345' },
  { label: 'E-Mail Remitente', value: 'regional.bello@mintrabajo.gov.co' },
  { label: 'Código Sticker Físico', value: 'ENF021120250521001' },
  { label: 'Código Ministerio del Trabajo', value: 'MTR04202505997S' },
  { label: 'Canal de Radicación', value: 'Mail' }, //deshabilitar
  { label: 'Fecha Ingreso del Requerimiento', value: '21/05/2025' },
]);

const affectedData = ref<DataItem[]>([
  { label: 'Tipo de Documento', value: 'CC - Cédula de Ciudadanía' },
  { label: 'Número de Documento', value: '67023455' },
  { label: 'Nombre del Afectado', value: 'Citali Chivundoy Pisba' },
]);

const requestDetailData = ref({
  description:
    'Solicitud de revisión de contrato laboral y condiciones de trabajo. El afectado reporta irregularidades en el pago de horas extras y compensaciones no reconocidas según lo estipulado en el contrato. Se requiere intervención del Ministerio del Trabajo para verificar el cumplimiento de la normativa laboral vigente.',
});

const documents = ref<Document[]>([
  {
    id: 1,
    name: 'Solicitud_Original.pdf',
    type: 'PDF',
    size: '2.3 MB',
    date: '21/05/2025',
  },
  {
    id: 2,
    name: 'Contrato_Laboral.pdf',
    type: 'PDF',
    size: '1.5 MB',
    date: '21/05/2025',
  },
  {
    id: 3,
    name: 'Cedula_Afectado.pdf',
    type: 'PDF',
    size: '500 KB',
    date: '21/05/2025',
  },
  {
    id: 4,
    name: 'Evidencias_Fotograficas.zip',
    type: 'ZIP',
    size: '8.2 MB',
    date: '21/05/2025',
  },
]);

const getDocIcon = (type: string) => {
  const icons: Record<string, string> = {
    PDF: 'picture_as_pdf',
    Word: 'description',
    Excel: 'table_chart',
    ZIP: 'folder_zip',
    Image: 'image',
  };
  return icons[type] || 'insert_drive_file';
};

const getDocColor = (type: string) => {
  const colors: Record<string, string> = {
    PDF: 'red',
    Word: 'blue',
    Excel: 'green',
    ZIP: 'orange',
    Image: 'purple',
  };
  return colors[type] || 'grey';
};

const viewDocument = (doc: Document) => {
  $q.notify({
    message: `Visualizando: ${doc.name}`,
    position: 'top-right',
  });
};

const downloadDocument = (doc: Document) => {
  $q.notify({
    type: 'positive',
    message: `Descargando: ${doc.name}`,
    position: 'top-right',
  });
};

const enableEdit = () => {
  originalData = {
    senderData: JSON.parse(JSON.stringify(senderData.value)),
    affectedData: JSON.parse(JSON.stringify(affectedData.value)),
    requestDetailData: JSON.parse(JSON.stringify(requestDetailData.value)),
  };
  isEditing.value = true;
};

const cancelEdit = () => {
  if (originalData) {
    senderData.value = originalData.senderData;
    affectedData.value = originalData.affectedData;
    requestDetailData.value = originalData.requestDetailData;
  }
  isEditing.value = false;
  $q.notify({
    type: 'info',
    message: 'Edición cancelada',
    position: 'top-right',
  });
};

const saveChanges = () => {
  modalVisibleTotal.value = false;
  isEditing.value = false;
  originalData = null;
  $q.notify({
    type: 'positive',
    message: 'Información actualizada exitosamente',
    position: 'top-right',
  });
};
</script>

<style scoped>
.text-caption {
  font-size: 0.75rem;
  line-height: 1.25rem;
}

.titles {
  color: #6b737c;
  font-weight: bold;
  margin-top: 10px;
}
</style>
