<template>
  <div class="q-pa-xl">
    <div v-if="!mostrarCrearExpediente">
      <div class="text-weight-bold text-h5 justify-between flex">
        <p>Incluir expediente</p>

        <component-button
          :colorButton="'primary'"
          :colorText="'white'"
          text="Crear expediente"
          @click="mostrarCrearExpediente = true"
          style="width: 130px; height: 42px"
        />
      </div>

      <!-- Sección: Incluir Expediente -->
      <FormComponentModel v-model="formData" :form="datosIncluir" />

      <div class="flex justify-center">
        <component-button
          :colorButton="'primary'"
          :colorText="'white'"
          text="Guardar"
          style="width: 130px; height: 42px"
        />
      </div>
    </div>

    <template v-if="mostrarCrearExpediente">
      <!-- Título: crear expediente-->
      <div class="text-weight-bold text-h5">
        <p>Crear expediente</p>
      </div>

      <!-- Sección: Crear expediente -->
      <FormComponentModel v-if="!camposCrearVisibles" v-model="formData" :form="datosCrear" />

      <!-- Mostrar solo el formulario sin botones cuando camposCrearVisibles es true -->
      <div v-if="camposCrearVisibles" class="q-mt-xl">
        <FormComponentModel v-model="formData" :form="datosCrearFiltrados" />
        <div class="text-weight-bold text-h6 q-mt-lg q-mb-md">Expediente a asociar</div>
        <div class="row q-col-gutter-md q-mt-lg q-mb-md">
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 q-pr-xl">
            <p class="text-semibold text-grey-9">Número de identificación</p>
            <p>{{ formData.numeroIdentificacion || '123456789' }}</p>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 q-pr-xl">
            <p class="text-semibold text-grey-9">Responsable de expediente</p>
            <p>{{ formData.responsableExpediente || 'Juan Pérez' }}</p>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 q-pr-xl">
            <p class="text-semibold text-grey-9">Nivel de acceso</p>
            <p>{{ formData.nivelAcceso || 'Total' }}</p>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 q-pr-xl">
            <p class="text-semibold text-grey-9">Observaciones</p>
            <p>{{ formData.observaciones || 'Expediente asociado correctamente.' }}</p>
          </div>
        </div>
      </div>
      <div v-else class="row justify-center q-mt-md q-gutter-sm">
        <q-btn
          label="Cancelar"
          text-color="black"
          style="border-radius: 8px; width: 200px; height: 48px; border: 1px solid #f2f4f5"
          no-caps
        />
        <q-btn
          label="Guardar"
          color="primary"
          style="border-radius: 8px; width: 200px; height: 48px"
          @click="modalVisibleTotal = true"
          no-caps
        />
      </div>
    </template>
  </div>
  <!-- Modal de Confirmación -->
  <template v-if="modalVisibleTotal">
    <MultiPurposeDialog
      v-if="modalVisibleTotal"
      type="question"
      title="¡Acción completada con éxito!"
      description="Su solicitud ha sido enviada exitosamente."
      accept-label="Aceptar"
      cancel-label=""
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
import { computed, ref } from 'vue';
import FormJs from '../../../boot/formIncluirExp.json';
import FormComponentModel from '@shell/components/Forms/FormComponentModel.vue';
import { fieldConfigParser } from '@shell/components/Forms/formParser';
import MultiPurposeDialog from '@shell/components/MultiPurposeDialog.vue';
import ComponentButton from '@shell/components/ComponentButton.vue';
import { useQuasar } from 'quasar';

const props = defineProps<{
  cotizacionId?: string | number;
  isEdit?: boolean;
  isCotFromCore: boolean;
  ramo: number;
}>();
const modalVisibleTotal = ref(false);
const camposCrearVisibles = ref(false);

// estado reactivo para los valores del formulario (v-model)
const formData = ref<Record<string, unknown>>({});
const mostrarCrearExpediente = ref(false);
const $q = useQuasar();
const isEditing = ref(false);
let originalData: any = null;

const datosIncluir = computed(() => {
  return fieldConfigParser(FormJs);
});

const datosCrear = computed(() => {
  const interno = { components: FormJs.Interno.components };
  return fieldConfigParser(interno);
});

// Filtrar solo los campos requeridos para la vista final
const datosCrearFiltrados = computed(() => {
  // keys de los campos requeridos
  const requiredKeys = [
    'select_kse95', // dependencia
    'select_uoaxdr', // series
    'select_zduke', // subseries
    'select_jefs6f', // tipodocumental
    'select_q1yuf5', // expedientes
  ];
  // filtrar los componentes
  const interno = {
    components: FormJs.Interno.components.filter((c) => requiredKeys.includes(c.key)),
  };
  // habilitar solo el campo expedientes y asignar col-6
  interno.components.forEach((c) => {
    if (c.key === 'select_q1yuf5') {
      c.disabled = false;
    }
  });
  return fieldConfigParser(interno);
});

const emit = defineEmits<{
  cancel: [];
  continue: [data: Record<string, unknown>];
}>();

const saveChanges = () => {
  modalVisibleTotal.value = false;
  isEditing.value = false;
  originalData = null;
  camposCrearVisibles.value = true;
  $q.notify({
    type: 'positive',
    message: 'Información actualizada exitosamente',
    position: 'top-right',
  });
};
</script>
