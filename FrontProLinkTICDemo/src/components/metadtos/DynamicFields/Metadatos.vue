<template>
	<q-form ref="form" greedy >
		<div class="row tw-p-2">
			<DynamicFields :detalle-radicado="detalleRadicado" :listFields="listFields" :alfanumFields="alfanumFields" :booleanFields="booleanFields" @updateValue="handleUpdateValue" />
		</div>
		<div v-if="canSubmit"
    class="justify-center tw-w-full tw-m-[10px] tw-mt-10 tw-mb-6 tw-flex tw-gap-4">
			<q-btn label="Cancelar" type="reset" style="width: 240px; height: 40px" text-color="black" color="accent"
				class="tw-rounded-xl" @click="() => (showModal = true)" />
			<q-btn label="Guardar" text-color="white" @click="guardarMetadatos" style="width: 240px; height: 40px" color="primary"
				class="tw-rounded-xl tw-btn tw-p-2" />
		</div>
	</q-form>
	<Modal v-model:model-value="showModal" title="¡Espera un momento!" text="Al cancelar el proceso perderá los datos
  ingresados en el formulario, ¿desea realizar la acción?" :is-success="false" textButtonCancel="No" cancel-button
    @handleAccept=" showModal = false" text-button="Si" @close-modal="() => (showModal = false)" />
</template>
<script setup lang="ts">
import DynamicFields from 'src/components/metadtos/DynamicFields/DynamicFields.vue'
import Modal from "src/components/Modal/Modal.vue";
import { onMounted, ref } from 'vue';
import { sgdeaAxios } from "src/services";
import { toast } from 'src/helpers/toast';
import { computed } from 'vue';

const form = ref();
const showModal = ref(false);
const props = withDefaults(defineProps<{
	metadatos: any,
  detalleRadicado: any,
}>(), {})

const listFields = ref([]);
const alfanumFields = ref([])
const booleanFields = ref([])
const metadatosFields = ref();

const canSubmit = computed(() => {
  // Chequear si todos los campos requeridos tienen valor
  if (metadatosFields.value) {
    return Object.values(metadatosFields.value).every(fields =>
      fields.every(field => field.value !== '')
    );
  }
  return [];
});

const handleUpdateValue = ({ arr }) => {
  metadatosFields.value = arr;
}


onMounted(async() => {
	listFields.value = await props.metadatos.filter(it => it.metadatoConOpciones?.metadato?.tipoDato?.id === 2)
  alfanumFields.value = await props.metadatos.filter(it => it.metadatoConOpciones?.metadato?.tipoDato?.id === 1)
  booleanFields.value = await props.metadatos.filter(it => it.metadatoConOpciones?.metadato?.tipoDato?.id === 3)
})

async function guardarMetadatos() {

  if (!(await form.value.validate())) {
    toast.error('Complete los campos requeridos antes de guardar');
    return;
  }

  const metaDatos = {};

  for (const key in metadatosFields.value) {
    if (Object.hasOwnProperty.call(metadatosFields.value, key)) {
      const fieldArray = metadatosFields.value[key];

      fieldArray.forEach(item => {
        metaDatos[item.id] = String(item.value);
      });
    }
  }

  const body = {
    idRadicado: props.detalleRadicado.idRadicado,
    metaDatos: metaDatos
  };
  try {
    await sgdeaAxios.post('/meta-datos', body)
    toast.success('Metadatos guardados correctamente')

  } catch (error) {
    toast.error('Error al guardar los metadatos')
  }
}

</script>
<style>

</style>
