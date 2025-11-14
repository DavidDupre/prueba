<script setup lang="ts">
import { ProcessType, useFilterExpediente } from "./FilterExpediente";
import { FormDataExpediente } from "src/interfaces/Expediente";
import { Dialog } from "primevue";
import { nextTick, ref } from "vue";
import { onMounted } from "vue";
import { watch } from "vue";
import { toast } from "src/helpers/toast";
import { faseOptions, statusOptions } from "./InformacionExpediente/InformacionExpediente";
import Button from "src/shared/components/PrimeComponents/Button/Button.vue";
import Label from "src/shared/components/PrimeComponents/Label/Label.vue";
import Table from "src/shared/components/PrimeComponents/Table/Table.vue";
import Title from "src/shared/components/PrimeComponents/Fuentes/Title/Title.vue";
import { sgdeaArchivoAxios, sgdeaAxios } from "src/services";
const emit = defineEmits(["onChangeForm", "onSelectExpediente"]);
const props = defineProps<{
  process: ProcessType;
  expediente: FormDataExpediente;
}>();

// Agrega esta ref para almacenar los metadatos
const metadataInputs = ref<Array<{ id: number, label: string, value: string, tipo: string }>>([]);

const isModalVisible = ref(true); // Modal visible por defecto

const getInputType = (tipo: any) => {
  switch (tipo) {
    case 'Numérico':
      return 'number'
    case 'Fecha':
      return 'date'
    case 'Alfanumérico':
      return 'text'
    case 'Texto':
      return 'text'
    case 'Hora':
      return 'date'

    case 'Si/No':
      return 'text'

    default:
      return 'text'
  }
}

// Función para cargar metadatos
const loadMetadata = async (serieId: number, subSerieId?: number) => {
  const request = subSerieId
    ? `/record/metadatos?serieId=${serieId}&subserieId=${subSerieId}`
    : `/record/metadatos?serieId=${serieId}`;
  try {
    const response = await sgdeaArchivoAxios.get(request);
    metadataInputs.value = response.data.map(item => ({
      id: item.metadatoId,
      label: item.nombre,
      value: '',
      tipo: item.tipo
    }));
  } catch (error) {
    console.error(error);
    metadataInputs.value = [];
  }
}

// Mostrar el modal al cargar la pantalla
onMounted(() => {
  isModalVisible.value = true;
});

// Cerrar el modal
const closeModal = () => {
  isModalVisible.value = false;
  resetForm()
};

const triedToSubmit = ref(false);
const formRef = ref();

const allFieldsEmpty = () => {

  const filterValues = Object.values(formDataFilter.value);
  const allFilterEmpty = filterValues.every(val => {
    return val === null || val === undefined || val === '' || (Array.isArray(val) && val.length === 0);
  });


  const allMetadataEmpty = metadataInputs.value.every(input => {
    return input.value === null || input.value === undefined || input.value === '';
  });

  return allFilterEmpty && allMetadataEmpty;
};


const requiredIfTried = (val: any) => {
  if (!triedToSubmit.value) return true;

  if (allFieldsEmpty()) {
    if (val === null || val === undefined || val === '' || (Array.isArray(val) && val.length === 0)) {
      return "El campo es requerido";
    }
  }

  return true;
};



// Enviar el formulario
/*
const onSubmit = () => {
  onFilter();
  closeModal();
};*/


const onSubmit = async () => {
  triedToSubmit.value = true;
  const isValid = await formRef.value?.validate();

  if (!isValid) return;

  // continúa con la lógica si es válido
  onFilter();
  closeModal();
};


const {
  columns,
  url,
  formDataFilter,
  router,
  usersFiltered,
  onFilter,
  onFilterUsers,
  mensajeTabla
} = useFilterExpediente(emit, props.process, props.expediente);

// Observar cambios en subserieId para cargar metadatos
watch(() => formDataFilter.value.serieId, (newVal) => {
  if (newVal) {
    loadMetadata(newVal);
  } else {
    metadataInputs.value = [];
  }
});
watch(() => formDataFilter.value.subserieId, (newVal) => {
  if (newVal) {
    loadMetadata(formDataFilter.value.serieId, newVal);
  } else {
    metadataInputs.value = [];
  }
});


watch(
  () => ({ ...formDataFilter.value }),
  () => {

    if (triedToSubmit.value) {
      nextTick(() => formRef.value?.validate());
    }
  },
  { deep: true }
);

watch(
  () => metadataInputs.value.map(input => input.value),
  () => {

    if (triedToSubmit.value) {
      nextTick(() => formRef.value?.validate());
    }
  },
  { deep: true }
);

const validateFormulario = () => {
  return toast.error(
    "Seleccione al menos un ítem de búsqueda."
  );
};


const resetForm = () => {
  formDataFilter.value = ({
    dependencia: null,
    serieId: null,
    subserieId: null,
    title: "",
    status: "",
    fase: "",
    responsibleId: "",
    startDate: "",
    endDate: "",
    contrato: "",
    proveedor: "",
    Objeto: "",
    vigencia: "",
    tipodecontrato: "",
  });

  // Limpiar campos dinámicos
  metadataInputs.value = metadataInputs.value.map(input => ({
    ...input,
    value: null
  }));

  // Limpiar validaciones visuales
  nextTick(() => {
    formRef.value?.resetValidation?.();
  });

  triedToSubmit.value = false;
};

const listadoDependencias = ref<any[]>([]);
const filteredDependencias = ref<any[]>([]);
const listadoSeries = ref<any[]>([]);
const filteredSeries = ref<any[]>([]);
const listadoSubSeries = ref<any[]>([]);
const filteredSubSeries = ref<any[]>([]);

// Cargar dependencias al montar el componente
onMounted(async () => {
  await loadDependencias();
});

const loadDependencias = async () => {
  try {
    const response = await sgdeaAxios.get(`/seccionSubSeccion`);
    listadoDependencias.value = response.data.map((e: any) => ({
      label: e.nombre,
      value: e.idSeccionSubSeccion
    }));
    filteredDependencias.value = [...listadoDependencias.value];
  } catch (error) {
    toast.error("Error al cargar dependencias");
  }
};

const loadSeries = async (idSeccionSubseccion: number) => {
  try {
    const response = await sgdeaAxios.get(`/serie/buscarSerie`, {
      params: {
        idSeriesubserie: null,
        descripcion: null,
        estado: true,
        codigo: null,
        seccionSubSeccion: idSeccionSubseccion,
        padre: null
      }
    });

    listadoSeries.value = response.data.map((item: any) => ({
      label: item.descripcion,
      value: item.idSeriesubserie
    }));
    filteredSeries.value = [...listadoSeries.value];
    formDataFilter.value.subserieId = null; // Resetear subserie al cambiar serie
  } catch (error) {
    toast.error("Error al cargar series");
  }
};

const loadSubseries = async (serieId: number) => {
  try {
    const response = await sgdeaAxios.get(`/serie/buscarSub`, {
      params: {
        idSeriesubserie: null,
        descripcion: null,
        estado: true,
        codigo: null,
        seccionSubSeccion: null,
        padre: serieId
      }
    });

    listadoSubSeries.value = response.data.map((item: any) => ({
      label: item.descripcion,
      value: item.idSeriesubserie
    }));
    filteredSubSeries.value = [...listadoSubSeries.value];
  } catch (error) {
    toast.error("Error al cargar subseries");
  }
};

// Filtros para los selects
const filterDependencias = (val: string, update: (cb: () => void) => void) => {
  update(() => {
    if (val === '') {
      filteredDependencias.value = listadoDependencias.value;
    } else {
      const needle = val.toLowerCase();
      filteredDependencias.value = listadoDependencias.value.filter(
        v => v.label.toLowerCase().indexOf(needle) > -1
      );
    }
  });
};

const filterSeries = (val: string, update: (cb: () => void) => void) => {
  update(() => {
    if (val === '') {
      filteredSeries.value = listadoSeries.value;
    } else {
      const needle = val.toLowerCase();
      filteredSeries.value = listadoSeries.value.filter(
        v => v.label.toLowerCase().indexOf(needle) > -1
      );
    }
  });
};

const filterSubSeries = (val: string, update: (cb: () => void) => void) => {
  update(() => {
    if (val === '') {
      filteredSubSeries.value = listadoSubSeries.value;
    } else {
      const needle = val.toLowerCase();
      filteredSubSeries.value = listadoSubSeries.value.filter(
        v => v.label.toLowerCase().indexOf(needle) > -1
      );
    }
  });
};

// Watchers para la carga jerárquica
watch(() => formDataFilter.value.dependencia, (newVal) => {
  if (newVal) {
    loadSeries(newVal);
  } else {
    listadoSeries.value = [];
    filteredSeries.value = [];
    formDataFilter.value.serieId = null;
  }
});

watch(() => formDataFilter.value.serieId, (newVal) => {
  if (newVal) {
    loadSubseries(newVal);
    loadMetadata(newVal); // Si también quieres cargar metadatos
  } else {
    listadoSubSeries.value = [];
    filteredSubSeries.value = [];
    formDataFilter.value.subserieId = null;
  }
});

</script>

<style>
.white-modal {
  background: white !important;
  color: black !important;
}

.white-modal :deep(.p-dialog-header) {
  background: white !important;
  color: black !important;
  border-bottom: 1px solid #e5e7eb !important;
}

.white-modal :deep(.p-dialog-content) {
  background: white !important;
  color: black !important;
}

.white-modal :deep(.p-dialog-footer) {
  background: white !important;
  color: black !important;
  border-top: 1px solid #e5e7eb !important;
}

.white-datatable :deep(.p-datatable) {
  background: white !important;
  color: black !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 8px !important;
}

.white-datatable :deep(.p-datatable-header) {
  background: white !important;
  color: black !important;
  border-bottom: 1px solid #e5e7eb !important;
}

.white-datatable :deep(.p-datatable-thead) {
  background: white !important;
  color: black !important;
}

.white-datatable :deep(.p-datatable-tbody) {
  background: white !important;
  color: black !important;
}

.white-datatable :deep(.p-datatable-tbody > tr > td) {
  background: white !important;
  color: black !important;
  border-bottom: 1px solid #e5e7eb !important;
}

.white-datatable :deep(.p-datatable-column-header-content) {
  background: white !important;
  color: black !important;
}

.white-datatable :deep(.p-datatable-column-title) {
  background: white !important;
  color: black !important;
}

.white-datatable :deep(.p-datatable-sort-icon) {
  color: black !important;
}

.white-datatable :deep(.p-datatable-paginator) {
  background: white !important;
  color: black !important;
  border-top: 1px solid #e5e7eb !important;
}
</style>

<template>

  <Dialog v-model:visible="isModalVisible" header="Búsqueda de Expedientes" :style="{ width: '70vw' }" :modal="true"
    :closable="false" class="white-modal">
    <q-form ref="formRef" @validation-error="validateFormulario" @submit="onSubmit" greedy
      class="tw-grid tw-grid-cols-2 tw-gap-6 tw-mb-2 tw-mt-8">

      <!-- Dependencia -->
      <!-- Dependencia -->
      <div>
        <Label label="Dependencia" />
        <q-select :options="filteredDependencias" option-value="value" option-label="label" emit-value map-options
          outlined class="tw-mt-2 tw-rounded-lg" v-model="formDataFilter.dependencia" dense @filter="filterDependencias"
          use-input fill-input hide-selected :rules="[requiredIfTried]" />
      </div>

      <!-- Serie -->
      <div>
        <Label label="Serie" :is-requiered="false" />
        <q-select v-model="formDataFilter.serieId" emit-value map-options outlined dense use-input hide-selected
          fill-input clearable :options="filteredSeries" @filter="filterSeries" class="tw-mt-2 tw-rounded-lg"
          :rules="[requiredIfTried]" :disable="!formDataFilter.dependencia" />
      </div>

      <!-- Subserie -->
      <div>
        <Label label="Subserie" />
        <q-select v-model="formDataFilter.subserieId" emit-value map-options outlined dense use-input hide-selected
          fill-input clearable :options="filteredSubSeries" @filter="filterSubSeries" class="tw-mt-2 tw-rounded-lg"
          :rules="[requiredIfTried]" :disable="!formDataFilter.serieId" />
      </div>

      <!-- Nombre del Expediente -->
      <div>
        <Label label="Nombre del Expediente" />
        <q-input v-model="formDataFilter.title" type="text" dense outlined class="tw-mt-2 tw-rounded-lg"
          :rules="[requiredIfTried]" />
      </div>


      <!-- Estado -->
      <div>
        <Label label="Estado" />
        <q-select v-model="formDataFilter.status" emit-value map-options dense outlined clearable
          :options="statusOptions" class="tw-mt-2 tw-rounded-lg" :rules="[requiredIfTried]" />
      </div>

      <!-- Fase de Archivo -->
      <div>
        <Label label="Fase de Archivo" />
        <q-select v-model="formDataFilter.fase" emit-value map-options dense outlined clearable :options="faseOptions"
          class="tw-mt-2 tw-rounded-lg" :rules="[requiredIfTried]" />
      </div>

      <!-- Usuario Creador -->
      <div>
        <Label label="Usuario Creador" />
        <q-select v-model="formDataFilter.responsibleId" emit-value map-options outlined dense use-input hide-selected
          fill-input clearable :options="usersFiltered" @filter="onFilterUsers" class="tw-mt-2 tw-rounded-lg"
          :rules="[requiredIfTried]" />
      </div>

      <!-- Rango de Fechas -->
      <fieldset class="tw-grid tw-grid-cols-2 tw-col-span-2 tw-gap-6 tw-bg-slate-50 tw-p-6 tw-rounded-lg">
        <span class="tw-col-span-2 tw-h-5 tw-text-label">
          Rango de Fechas
        </span>
        <div>
          <Label label="Fecha Inicial" />
          <q-input type="date" v-model="formDataFilter.startDate" dense outlined class="tw-mt-2 tw-rounded-lg"
            :max="formDataFilter.endDate" />
        </div>
        <div>
          <Label label="Fecha Final" />
          <q-input type="date" v-model="formDataFilter.endDate" dense outlined class="tw-mt-2 tw-rounded-lg"
            :min="formDataFilter.startDate" />
        </div>
      </fieldset>

      <!--<div v-for="input in metadataInputs" :key="input.id" class="tw-col-span-1">
    <Label :label="input.label" />
    <q-input
      v-model="input.value"
      :type="getInputType(input.tipo)"
      dense
      outlined
      class="tw-mt-2 tw-rounded-lg"
    />
  </div>-->

      <div v-for="input in metadataInputs" :key="input.id" class="tw-col-span-1">
        <Label :label="input.label" />

        <!-- Si/No -->
        <q-select v-if="input.tipo === 'Si/No'" v-model="input.value" :options="['Sí', 'No']" dense outlined emit-value
          map-options class="tw-mt-2 tw-rounded-lg" />

        <!-- Hora -->
        <q-time v-else-if="input.tipo === 'Hora'" v-model="input.value" format24h with-seconds emit-seconds dense
          outlined class="tw-mt-2 tw-rounded-lg" />

        <!-- Otros tipos -->
        <q-input v-else v-model="input.value" :type="getInputType(input.tipo)" dense outlined
          class="tw-mt-2 tw-rounded-lg" />
      </div>


      <div class="tw-col-span-2 tw-flex tw-justify-end tw-gap-6">
        <Button label="Cerrar" type="tertiary" color="black" type-button="button" icon-right="circle-xmark"
          @click="closeModal" />
        <Button label="Buscar" color="primary" type="primary" icon-right="circle-arrow-right" />
      </div>
    </q-form>
  </Dialog>

  <q-card flat :class="process ? 'tw-p-4' : 'tw-rounded-lg tw-p-8'">
    <section class="tw-flex tw-justify-between tw-items-center">
      <span>
        <Title v-if="process != 'radicado'" label="Consultar Expedientes" />
      </span>

      <div class="tw-flex tw-gap-6">
        <Button label="Buscar" type="primary" color="primary" icon-right="search" @click="isModalVisible = true" />
        <Button v-if="true" label="Crear Expediente" type="primary" color="primary" icon-right="circle-arrow-right"
          @click="router.push('/archivo/crear-expediente')" />
      </div>
    </section>
  </q-card>

  <q-card :class="process
      ? 'tw-p-6 tw-rounded-lg tw-bg-slate-50 tw-mx-4'
      : 'tw-rounded-lg tw-p-8'
    " flat>
    <Table :columns="columns" :url="url" :no-data-message="mensajeTabla" :key="url"></Table>
  </q-card>

  <q-card flat class="tw-grid tw-grid-cols-2 tw-gap-6 tw-p-6 tw-mx-4 tw-mt-6 tw-rounded-lg tw-bg-slate-50"
    v-if="expediente">
    <span class="tw-col-span-2 tw-h-5 tw-text-label">
      Expediente seleccionado
    </span>
    <div>
      <Label label="Código del Expediente" />
      <q-input v-model="expediente.identificationCode" type="text" dense outlined disable
        class="tw-mt-2 tw-rounded-lg"></q-input>
    </div>
    <div>
      <Label label="Nombre del Expediente" />
      <q-input v-model="expediente.title" type="text" dense outlined disable class="tw-mt-2 tw-rounded-lg"></q-input>
    </div>
  </q-card>
</template>
