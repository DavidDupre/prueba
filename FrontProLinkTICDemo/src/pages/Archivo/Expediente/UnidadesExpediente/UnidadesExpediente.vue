<template>
  <main class="tw-flex tw-flex-row">
    <section class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
      <q-card class="tw-rounded-xl tw-p-5" flat>
        <Table :columns="columnsRoles" :url="url"></Table>
      </q-card>
    </section>
    <Dialog
      v-model:visible="isModalVisible"
      header="Información de Unidad"
      :style="{ width: '70vw' }"
      :modal="true"
      :closable="true"
      dismissableMask
      closeOnEscape
      class="white-modal"
    >
      <div class="tw-grid tw-grid-cols-2 tw-gap-2 tw-my-4">
        <div>
          <Label label="Fecha de Creación" />
          <q-input
            v-model="unitModalData.createdAt"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
        <div>
          <Label label="Creado Por" />
          <q-input
            v-model="unitModalData.createdBy"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
      </div>
      <div class="tw-grid tw-grid-cols-2 tw-gap-2 tw-my-4">
        <div>
          <Label label="Fecha de Última Modificación" />
          <q-input
            v-model="unitModalData.lastModifiedDate"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
        <div>
          <Label label="Última Modificación Por" />
          <q-input
            v-model="unitModalData.lastModifiedBy"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
      </div>
      <div class="tw-grid tw-grid-cols-2 tw-gap-2 tw-my-4">
        <div>
          <Label label="Edificio" />
          <q-input
            v-model="unitModalData.building"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
        <div>
          <Label label="Departamento" />
          <q-input
            v-model="unitModalData.department"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
      </div>
      <div class="tw-grid tw-grid-cols-2 tw-gap-2 tw-my-4">
        <div>
          <Label label="Ciudad" />
          <q-input
            v-model="unitModalData.municipality"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
        <div>
          <Label label="Area de Archivo" />
          <q-input
            v-model="unitModalData.archiveArea"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
      </div>
      <div class="tw-grid tw-grid-cols-2 tw-gap-2 tw-my-4">
        <div>
          <Label label="Piso" />
          <q-input
            v-model="unitModalData.floor"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
        <div>
          <Label label="Pasillo" />
          <q-input
            v-model="unitModalData.hallway"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
      </div>
      <div class="tw-grid tw-grid-cols-2 tw-gap-2 tw-my-4">
        <div>
          <Label label="Módulo" />
          <q-input
            v-model="unitModalData.module"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
        <div>
          <Label label="Estante" />
          <q-input
            v-model="unitModalData.shelf"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
      </div>
      <div class="tw-grid tw-grid-cols-2 tw-gap-2 tw-my-4">
        <div>
          <Label label="Capacidad" />
          <q-input
            v-model="unitModalData.capacity"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
        <div>
          <Label label="Unidad de Almacenamiento" />
          <q-input
            v-model="unitModalData.storageUnit"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
      </div>
      <div class="tw-grid tw-grid-cols-2 tw-gap-2 tw-my-4">
        <div>
          <Label label="Unidad de Conservación" />
          <q-input
            v-model="unitModalData.conservationUnit"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
        <div>
          <Label label="Soporte (Tipo de Unidad de Conservación)" />
          <q-input
            v-model="unitModalData.conservationUnitType"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
      </div>
      <div class="tw-grid tw-grid-cols-2 tw-gap-2 tw-my-4">
        <div>
          <Label label="Volumen" />
          <q-input
            v-model="unitModalData.volume"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
        <div>
          <Label label="Frecuencia" />
          <q-input
            v-model="unitModalData.frequency"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
      </div>
      <div class="tw-grid tw-grid-cols-2 tw-gap-2 tw-my-4">
        <div>
          <Label label="Notas" />
          <q-input
            v-model="unitModalData.notes"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
        <div>
          <Label label="Codigo de Archivo" />
          <q-input
            v-model="unitModalData.fileCode"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
      </div>
      <div class="tw-grid tw-grid-cols-2 tw-gap-2 tw-my-4">
        <div>
          <Label label="Bodega" />
          <q-input
            v-model="unitModalData.storage"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
        <div>
          <Label label="Fila" />
          <q-input
            v-model="unitModalData.row"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
      </div>
      <div class="tw-grid tw-grid-cols-2 tw-gap-2 tw-my-4">
        <div>
          <Label label="Bandeja" />
          <q-input
            v-model="unitModalData.tray"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
        <div>
          <Label label="Código de Unidad de Conservación" />
          <q-input
            v-model="unitModalData.conservationUnitCode"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
      </div>
      <div class="tw-grid tw-grid-cols-2 tw-gap-2 tw-my-4">
        <div>
          <Label label="Número de Documentos" />
          <q-input
            v-model="unitModalData.numeroDocumentos"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
        <div>
          <Label label="Número de Folios" />
          <q-input
            v-model="unitModalData.numeroFolios"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
      </div>
      <div class="tw-grid tw-grid-cols-2 tw-gap-2 tw-my-4">
        <div>
          <Label label="Tipo de Unidad de Bodega" />
          <q-input
            v-model="unitModalData.storageUnitType"
            type="text"
            dense
            disable
            outlined
            class="tw-mt-2 tw-rounded-lg"
          />
        </div>
      </div>

      <div class="tw-col-span-2 tw-flex tw-justify-end tw-gap-6">
        <Button
          label="Cerrar"
          type="primary"
          color="primary"
          type-button="button"
          icon-right="circle-xmark"
          @click="closeModal"
        />
      </div>
    </Dialog>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Table from "src/shared/components/PrimeComponents/Table/Table.vue";
import { useRouter } from "vue-router";
import { FormDataExpediente } from "src/interfaces/Expediente";
import { Dialog } from "primevue";
import Button from "src/shared/components/PrimeComponents/Button/Button.vue";
import Label from "src/shared/components/PrimeComponents/Label/Label.vue";


const props = defineProps<{
  expediente?: FormDataExpediente;
}>();

const unitModalData = ref({
  id: 0,
  createdAt: "",
  createdBy: "",
  lastModifiedDate: "",
  lastModifiedBy: "",
  building: "",
  department: "",
  municipality: "",
  archiveArea: "",
  floor: "",
  hallway: "",
  module: "",
  shelf: "",
  capacity: "",
  storageUnit: "",
  conservationUnit: "",
  conservationUnitType: "",
  volume: "",
  frequency: "",
  notes: "",
  fileCode: "",
  storage: "",
  row: "",
  tray: "",
  conservationUnitCode: "",
  storageUnitType: "",
  numeroDocumentos: "",
  numeroFolios: "",
});

const isModalVisible = ref(false);
const router = useRouter();
const url = `/record/unidad-almacenamiento/obtener-unidades-por-expediente/3`;

const feedUnitsModal = (unitData) => {
  isModalVisible.value = true;
  unitModalData.value.id = unitData.storageUnit.id;
  unitModalData.value.createdAt = new Date(
    unitData.storageUnit.createdDate
  ).toLocaleDateString("en-GB");
  unitModalData.value.createdBy = unitData.storageUnit.createdBy ?? "N/A";
  unitModalData.value.lastModifiedDate = new Date(
    unitData.storageUnit.lastModifiedDate
  ).toLocaleDateString("en-GB");
  unitModalData.value.lastModifiedBy =
    unitData.storageUnit.lastModifiedBy ?? "N/A";
  unitModalData.value.building = unitData.storageUnit.building ?? "N/A";
  unitModalData.value.department = unitData.storageUnit.department ?? "N/A";
  unitModalData.value.municipality = unitData.storageUnit.municipality ?? "N/A";
  unitModalData.value.archiveArea = unitData.storageUnit.archiveArea ?? "N/A";
  unitModalData.value.floor = unitData.storageUnit.floor ?? "N/A";
  unitModalData.value.hallway = unitData.storageUnit.hallway ?? "N/A";
  unitModalData.value.module = unitData.storageUnit.module ?? "N/A";
  unitModalData.value.shelf = unitData.storageUnit.shelf ?? "N/A";
  unitModalData.value.capacity = unitData.storageUnit.capacity ?? "N/A";
  unitModalData.value.storageUnit = unitData.storageUnit.storageUnit ?? "N/A";
  unitModalData.value.conservationUnit =
    unitData.storageUnit.conservationUnit ?? "N/A";
  unitModalData.value.conservationUnitType =
    unitData.storageUnit.conservationUnitType ?? "N/A";
  unitModalData.value.volume = unitData.storageUnit.volume ?? "N/A";
  unitModalData.value.frequency = unitData.storageUnit.frequency ?? "N/A";
  unitModalData.value.notes = unitData.storageUnit.notes ?? "N/A";
  unitModalData.value.fileCode = unitData.storageUnit.fileCode ?? "N/A";
  unitModalData.value.storage = unitData.storageUnit.storage ?? "N/A";
  unitModalData.value.row = unitData.storageUnit.row ?? "N/A";
  unitModalData.value.tray = unitData.storageUnit.tray ?? "N/A";
  unitModalData.value.conservationUnitCode =
    unitData.storageUnit.conservationUnitCode ?? "N/A";
  unitModalData.value.storageUnitType =
    unitData.storageUnit.storageUnitType ?? "N/A";
  unitModalData.value.numeroDocumentos = unitData.numeroDocumentos ?? "N/A";
  unitModalData.value.numeroFolios = unitData.numeroFolios ?? "N/A";
};

const closeModal = () => {
  isModalVisible.value = false;
};

const columnsRoles = [
  {
    name: "id",
    header: "#",
    field: "storageUnit",
    type: "string",
    replaceValue: (value) => value?.id,
  },
  {
    header: "Ubicacion",
    field: "storageUnit",
    type: "string",
    replaceValue: (value) => value.municipality ?? value.municipality,
  },
    {
    header:"Unidad de Almacenamiento",
    field: "storageUnit",
    type: "string",
    replaceValue: (value) =>
      `${value.storageUnit ?? "N/A"}`,
  },
  {
    header:"Unidad de Conservación",
    field: "storageUnit",
    type: "string",
    replaceValue: (value) =>
      `${value.conservationUnit ?? "N/A"}`,
  },
  {
  header: "Número de Documentos",
  field: "numeroDocumentos",
  type: "string",
  replaceValue: (value) => `${value ?? "N/A"}`,
  },
  {
  header: "Número de Folios",
  field: "numeroFolios",
  type: "string",
  replaceValue: (value) => `${value ?? "N/A"}`,
  },
  {
  header: "Edificion",
  field: "storageUnit",
  type: "string",
  replaceValue: (value) => `${value.building ?? "N/A"}`,
  },
  {
  header: "Area de Archivo",
  field: "storageUnit",
  type: "string",
  replaceValue: (value) => `${value.archiveArea ?? "N/A"}`,
  },

  {
  header: "Tomo",
  field: "storageUnit",
  type: "string",
  replaceValue: (value) => `${value.tomo ?? "N/A"}`,
  },
    {
  header: "Soporte",
  field: "storageUnit",
  type: "string",
  replaceValue: (value) => `${value.tomo ?? "N/A"}`,
  },
  {
  header: "Notas",
  field: "storageUnit",
  type: "string",
  replaceValue: (value) => `${value.notes ?? "N/A"}`,
  },
  {
    header: "Fecha de Creación",
    field: "storageUnit",
    type: "string",
    replaceValue: (value) =>
      value.createdDate
        ? new Date(value.createdDate).toLocaleDateString("en-GB")
        : "N/A",
  },
  {
    field: "action",
    header: "Acciones",
    type: "string",
    format: "uppercase",
    classCss: "text-right",
    width: "50px",
    name: "actions",
    actions: [
      {
        icon: "eye",
        eventbtn: (rowData: any) => {
          feedUnitsModal(rowData);
        },
        name: "view",
        color: "primary",
      },
    ],
  },
];
</script>

<style></style>
