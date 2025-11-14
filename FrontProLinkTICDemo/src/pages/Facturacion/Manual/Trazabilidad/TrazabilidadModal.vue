<template>
  <q-dialog persistent full-width v-model="localTrazaModal">
    <q-card class="tw-flex tw-flex-row tw-w-[60%]">
      <q-card class="tw-w-[20%] tw-bg-primary tw-rounded-none tw-flex tw-flex-col tw-justify-center tw-items-center">
        <h1 class="tw-text-white tw-font-bold">Trazabilidad factura No.</h1>
        <h1 class="tw-text-white tw-font-bold">{{ factNum }}</h1>
      </q-card>
      <q-card class="tw-rounded-none tw-bg-white tw-w-[80%]">
        <div class="tw-text-end tw-w-[100%] tw-p-4">
          <a @click="localTrazaModal = false" class="tw-text-primary tw-cursor-pointer" style="text-decoration: none">
            <q-icon size="1.5em" name="close" color="primary" />
          </a>
        </div>
        <q-banner rounded class="tw-bg-gray-texts tw-m-4 tw-rounded-xl">
          <p class="tw-text-modal-grey-subtitle tw-size-1.5 tw-mb-5 tw-w-full">Estado documento:</p>
          <p class="tw-text-modal-subtitle-description tw-size-3 tw-mb-2 tw-w-full">
            {{ data.estado }}
          </p>
        </q-banner>
        <div class="tw-flex tw-flex-row tw-justify-center tw-gap-x-14">
          <!-- Trazabilidad steps -->
          <div v-for="(state, index) in states" :key="index" class="tw-flex tw-flex-col tw-items-center">
            <p>{{ state.label }}</p>
            <q-avatar :color="getAvatarColor(state.value)" size="md" />
          </div>
        </div>
        <div class="q-pa-xl tw-rounded-l-none">
          <q-table
            flat
            :rows="tableData"
            :columns="tableColumns"
            row-key="index"
            hide-pagination
            class="q-mr-md full-width tw-h-full"
          />
        </div>
      </q-card>

    </q-card>


  </q-dialog>
</template>

<script setup lang="ts">
import moment from "moment";
import { ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    data: {
      mensajeInicial: string;
      mensajeCompleto: string;
      fechaInicio: string;
      estado: string;
      reglas: string[];
    }[];
    trazaModal: boolean;
    factNum: string;
  }>(),
  {
    trazaModal: false,
    factNum: "",
    data: [],
  }
);

const localTrazaModal = ref(props.trazaModal);

// Actualizar el estado del diálogo
watch(
  () => props.trazaModal,
  (newVal) => {
    localTrazaModal.value = newVal;
  }
);

const emit = defineEmits(["update:trazaModal"]);
watch(localTrazaModal, (value) => {
  emit("update:trazaModal", value);
});

const states = ref([
  { label: "Emitida", value: "EMITIDA" },
  { label: "Inconsistente", value: "INCONSISTENTE" },
  { label: "En validación", value: "EN_VALIDACION" },
  { label: "Rechazada", value: "RECHAZADA" },
  { label: "Por emitir", value: "POR_EMITIR" },
]);

// Función para obtener el color del avatar
function getAvatarColor(state: string) {
  if (
    state === (props.data.length > 0 ? props.data[0].estado : "") &&
    (state === "INCONSISTENTE" ||
      state === "RECHAZADA" ||
      state === "EN_VALIDACION")
  ) {
    return "yellow";
  } else {
    return "green";
  }
}

const tableColumns = [
  {
    name: "fecha",
    required: true,
    label: "Fecha",
    align: "center",
    field: "fecha",
  },
  {
    name: "proceso",
    required: true,
    label: "Proceso",
    align: "center",
    field: "proceso",
  },
  {
    name: "descripcion",
    required: true,
    label: "Descripción",
    align: "center",
    field: "descripcion",
  },
];

const tableData = ref([]);

watch(
  () => props.data,
  (newData) => {
    if (Array.isArray(newData)) {
      tableData.value = newData
        .map((item) => {
          const formattedFechaInicio = moment(item.fechaInicio).format(
            "DD/MM/YYYY HH:mm"
          );
          return item.reglas.map((regla) => ({
            fecha: formattedFechaInicio,
            proceso: item.estado,
            descripcion: regla,
          }));
        })
        .flat(); // Usa `flat` para aplanar el array de arrays
    } else {
      tableData.value = [];
    }
  },
  { immediate: true }
);
</script>
