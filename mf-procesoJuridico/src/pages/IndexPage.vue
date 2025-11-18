<template>
  <MainContainer title="Solicitudes Ministerio del Trabajo">
    <div>
      <div class="q-mt-md">
        <q-linear-progress size="8px" :value="progressValue" color="primary" />
        <div class="row" :class="gridColsClass">
          <div v-for="(s, i) in formStructure.steps" :key="i" class="col">
            <h4 class="text-caption text-center" :class="step >= i ? 'text-grey-8' : 'text-grey-5'">
              <b>{{ s.name }}</b> <br />
              <span class="text-caption" :class="step >= i ? 'text-grey-6' : 'text-grey-4'">{{
                s.description
              }}</span>
            </h4>
          </div>
        </div>
      </div>

      <q-card class="q-mt-md" flat bordered>
        <q-tab-panels keep-alive v-model="step" animated class="bg-transparent">
          <q-tab-panel v-for="(s, i) in formStructure.steps" :key="i" :name="i" class="q-pa-none">
            <component
              v-if="stepComponents[i]"
              :is="stepComponents[i]"
              v-model="formData"
              @next-step="handleNextStep"
              @prev-step="prevStep"
              @cancel="cancelModal = true"
            />

            <div v-else class="q-pa-xl">
              <h5 class="text-h6">{{ s.name }}</h5>
              <p class="text-body1">{{ s.description }}</p>
              <q-input
                v-model="formData[`step${i + 1}_dato`]"
                :label="`Información para ${s.name}`"
                outlined
                class="q-mt-md"
              />
            </div>
          </q-tab-panel>
        </q-tab-panels>
        <div class="flex justify-center items-center q-gutter-x-md q-pb-xl">
          <q-btn
            v-if="step > 0"
            label="Regresar"
            icon="chevron_left"
            outline
            color="primary"
            @click="prevStep"
            style="padding: 18px 60px; border-radius: 8px; width: 240px; height: 48px"
            no-caps
          />
          <q-btn
            outline
            color="secondary"
            label="Cancelar"
            @click="() => $router.push('/home')"
            style="padding: 18px 60px; border-radius: 8px; width: 240px; height: 48px"
          />
          <q-btn
            ref="btnContinuar"
            color="primary"
            @click="handleNextStep"
            v-if="step < 3"
            :label="step < 3 ? 'Continuar' : 'Guardar'"
            icon-right="chevron_right"
            style="padding: 18px 60px; border-radius: 8px; width: 240px; height: 48px"
          />
        </div>
      </q-card>
    </div>
  </MainContainer>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import MainContainer from '../../../mf-ministry-consultation/src/components/MainContainer.vue';
import FormStep1 from '../components/FormStep1.vue';
import FormStep2 from '../components/FormStep2.vue';
import FormStep3 from '../components/FormStep3.vue';

const step = ref(0);
const showSuccessModal = ref(false);
const cancelModal = ref(false);
const router = useRouter();

const formStructure = ref({
  title: 'Radicación Ministerio de Trabajo',
  steps: [
    { name: 'Remitente', description: 'Datos del remitente' },
    {
      name: 'Datos demandante',
      description: 'Datos del demandante',
    },
    {
      name: 'Hechos de la demanda',
      description: 'Hechos de la demanda',
    },
  ],
});

const stepComponents = [FormStep1, FormStep2, FormStep3];

const formData = reactive<Record<string, unknown>>({});

const isLastStep = computed(() => step.value === formStructure.value.steps.length - 1);
const progressValue = computed(() => (step.value + 1) / formStructure.value.steps.length);
const gridColsClass = computed(() => `row-cols-${formStructure.value.steps.length}`);

const prevStep = () => step.value--;

const handleNextStep = (data?: Record<string, unknown>) => {
  if (data) {
    Object.assign(formData, data);
  }
  if (isLastStep.value) {
    console.log('Formulario enviado:', formData);
    showSuccessModal.value = true;
  } else {
    step.value++;
  }
};

const onCancel = () => {
  step.value = 0;
  Object.keys(formData).forEach((key) => delete formData[key]);
  router.push('/home');
};

const closeSuccess = () => {
  showSuccessModal.value = false;
  onCancel();
};
</script>

<style scoped>
/* Sobrescribe los shadows del monolito con máximass   a prioridad */
:deep(.q-field--outlined .q-field__control:before),
:deep(.q-field--outlined .q-field__control:after),
:deep(.q-field__control:before),
:deep(.q-field__control:after) {
  box-shadow: none !important;
}

:deep(.q-checkbox__bg) {
  box-shadow: none !important;
}
</style>
