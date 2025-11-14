<template>
  <q-dialog v-model="props.showModal" persistent class="modal-mask">
    <q-card class="modal-wrapper tw-p-5">
      <q-card-section class="modal-header">
        <h2 class="tw-font-bold tw-text-xl tw-text-labels">Agregar Nuevo Campo</h2>
      </q-card-section>

      <q-card-section class="modal-body">
        <q-form greedy class="q-gutter-md form-group" @submit.prevent="onSubmit">
          <div class="col-12">
            <span class="tw-w-full">
              <label class="tw-text-label">Nombre del Campo * ({{ fieldData.nombreCampo?.length || 0 }}/150)</label>
              <q-input v-model="fieldData.nombreCampo" dense outlined placeholder="Ej: Nombre del cliente"
                class="tw-rounded-lg"
                :rules="[val => !!val || 'Campo obligatorio', (val) => maxLengthInput(150, val)]" />
            </span>
          </div>

          <div class="col-12">
            <span class="tw-w-full">
              <label class="tw-text-label">Tipo de Campo *</label>
              <q-select v-model="fieldData.tipoCampo" label="Seleccionar" dense outlined :options="fieldTypes"
                option-value="value" option-label="label" emit-value map-options
                :rules="[val => !!val || 'Campo obligatorio']" class="tw-rounded-lg" />
            </span>
          </div>

          <div class="col-12">
            <span class="tw-w-full">
              <label class="tw-text-label">Formato de Visualización *</label>
              <q-select v-model="fieldData.formatoVisualizacion" label="Seleccionar" dense outlined
                :options="formatOptions" option-value="value" option-label="label" emit-value map-options
                :rules="[val => !!val || 'Campo obligatorio']" class="tw-rounded-lg" />
            </span>
          </div>
        </q-form>
      </q-card-section>

      <div class="tw-flex tw-justify-center tw-items-center tw-mb-10 tw-gap-6 tw-px-4">
        <q-btn @click="onCancel" label="Cancelar" type="reset" style="width: 240px" text-color="black" color="accent"
          class="tw-rounded-xl tw-h-12" :disable="loading" />

        <q-btn @click="onSubmit" label="Crear" text-color="white" style="width: 240px" color="secondary"
          class="tw-rounded-xl tw-h-12 tw-p-2" :disable="!fieldData.nombreCampo || loading" :loading="loading" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { maxLengthInput } from 'src/helpers/validations';
import { sgdeaAxios } from 'src/services';
import { toast } from 'src/helpers/toast';
import { crearTrazabilidad } from 'src/helpers/trazabilidad';
import { useAuthStore } from 'src/stores/auth.store';
const auth = useAuthStore()

const props = defineProps({
  showModal: {
    type: Boolean,
    required: true
  },
  comunicacionMasivaId: {
    type: Number,
    required: true
  },
  fieldTypes: {
    type: Array,
    default: () => [
      { value: 'TEXTO_CORTO', label: 'Texto corto' },
      { value: 'TEXTO_LARGO', label: 'Texto largo' },
      { value: 'NUMERO', label: 'Número' },
      { value: 'FECHA', label: 'Fecha' },
      { value: 'EMAIL', label: 'Email' },
      { value: 'SELECTOR', label: 'Selector' }
    ]
  },
  formatOptions: {
    type: Array,
    default: () => [
      { value: 'FORMATO_TEXTO', label: 'Formato texto' },
      { value: 'FORMATO_NUMERO', label: 'Formato número' },
      { value: 'FORMATO_FECHA', label: 'Formato fecha' },
      { value: 'FORMATO_EMAIL', label: 'Formato email' },
      { value: 'FORMATO_SELECTOR', label: 'Formato selector' }
    ]
  }
});

const emit = defineEmits(['update:showModal', 'created']);

const loading = ref(false);
const fieldData = ref({
  comunicacionMasivaId: props.comunicacionMasivaId,
  nombreCampo: '',
  tipoCampo: '',
  formatoVisualizacion: ''
});

const onSubmit = async () => {
  if (!fieldData.value.nombreCampo || !fieldData.value.tipoCampo || !fieldData.value.formatoVisualizacion) {
    return;
  }

  loading.value = true;

  try {
    const response = await sgdeaAxios.post(
      '/correspondencia/comunicacionMasiva/crearCampo',
      fieldData.value
    );

    if (response.status === 200 || response.status === 201) {
      toast.success('Campo creado exitosamente');
      emit('created', response.data);
      await crearTrazabilidad({
        proceso: `CORMAS${props.comunicacionMasivaId}`,
        secuencia: props.comunicacionMasivaId.toString(),
        estado: "En edición",
        descripcion:
          `Usuario: ${auth.$state.userInfo.name} | ` +
          `Rol: ${auth.$state.userInfo.role} | ` +
          `Campo creado: ${fieldData.value.nombreCampo} | ` +
          `Tipo: ${fieldData.value.tipoCampo} | ` +
          `Formato: ${fieldData.value.formatoVisualizacion}`,
        comentario: "Se ha agregado un nuevo campo a la comunicación masiva",
        nombre: auth.$state.userInfo.name,
        tramite: "Comunicación Masiva",
        accion: `${auth.$state.userInfo.name} ha creado el campo ${fieldData.value.nombreCampo} en la comunicación ${props.comunicacionMasivaId}`
      });
      onCancel();
      resetForm();
    }
  } catch (error) {
    toast.error('Error al crear el campo');
  } finally {
    loading.value = false;
  }
};

const onCancel = () => {
  resetForm();
  emit('update:showModal', false);
};

const resetForm = () => {
  fieldData.value = {
    comunicacionMasivaId: props.comunicacionMasivaId,
    nombreCampo: '',
    tipoCampo: '',
    formatoVisualizacion: ''
  };
};
</script>

<style scoped></style>
