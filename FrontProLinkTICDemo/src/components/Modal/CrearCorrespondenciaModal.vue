<template>
  <q-dialog persistent v-model="isModalOpen" class="modal-mask">
    <q-card class="modal-wrapper">
      <q-card-section class="modal-header">
        <h2>Crear Comunicación</h2>
        <!-- <q-badge class="span tw-p-2" text-color="white">Comunicación Masiva</q-badge> -->
      </q-card-section>

      <q-card-section class="modal-body">

        <q-form greedy ref="myForm" class="q-gutter-md form-group">
          <div class="col-12">
            <span class="tw-w-full">
              <label class="tw-text-label">Nombre de comunicación * ({{ form.nombreComunicacion.length }}/150)</label>
              <q-input
                v-model="form.nombreComunicacion"
                dense
                outlined
                label="Inserte"
                class="tw-rounded-lg"
                :rules="[alphanumeric2, inputRequired, val => maxLengthInput(150, val)]"
                @input="updateCharacterCount"
              />
            </span>
          </div>

          <div class="col-12">
            <span class="tw-w-full">
              <label class="tw-text-label">Tipo de comunicación *</label>
              <q-select v-model="form.tipoComunicacion" label="Seleccione" map-options emit-value dense outlined
                :options="tipoComunicacionOptions" :rules="[inputRequired]" class="tw-rounded-lg">
              </q-select>
            </span>
          </div>

          <div class="col-12">
            <span class="tw-w-full">
              <label class="tw-text-label">Prefijo de comunicación *</label>
              <q-select v-model="form.prefijoComunicacion" label="Seleccione" map-options emit-value dense outlined
                :options="prefijoComunicacionOptions" :disable="desabiltSelect" :rules="[inputRequired]" class="tw-rounded-lg">
              </q-select>
            </span>
          </div>

          <div class="col-12">
            <span class="tw-w-full">
              <label class="tw-text-label">Tipo de plantilla</label>
              <q-select :disable="form.prefijoComunicacion !== 1 || desabiltSelect " v-model="form.tipoPlantilla" label="Seleccione"
                map-options emit-value dense outlined :options="tipoPlantillaOptions" class="tw-rounded-lg">
              </q-select>
            </span>
          </div>
        </q-form>


        <!-- <q-form @submit.prevent="submitForm" class="q-gutter-md form-group">
          <q-input class="input" filled v-model="form.nombreComunicacion" label="Nombre de comunicación *" required />
          <q-select class="select" filled v-model="form.tipoComunicacion" :options="tipoComunicacionOptions"
            label="Tipo de comunicación *" required />
          <q-select class="select" filled v-model="form.prefijoComunicacion" :options="prefijoComunicacionOptions"
            label="Prefijo de comunicación *" required />
          <q-select class="select" filled v-model="form.tipoPlantilla" :options="tipoPlantillaOptions"
            label="Tipo de plantilla *" required />
        </q-form> -->
      </q-card-section>

      <div class="tw-flex tw-justify-center tw-items-center tw-mb-10 tw-gap-6 tw-px-4">
        <q-btn @click="closeModal()" label="Cancelar" type="reset" style="width: 240px" text-color="black"
          color="accent" class="tw-rounded-xl tw-h-12" />

        <q-btn @click="submitForm()" label="Continuar" text-color="white" style="width: 240px" color="primary"
          class="tw-rounded-xl tw-h-12 tw-p-2" />
      </div>

      <!-- <q-card-actions class="modal-footer" align="center">

        <q-btn class="" flat label="Cancelar" @click="closeModal" />
        <q-btn class="modal-submit-button modal-default-button" flat label="Continuar" @click="submitForm" />
      </q-card-actions> -->
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue';
import { useCrearComunicacionesLogic } from 'src/pages/Correspondencia/Crear/CrearComunicaciones/CrearComunicaciones.Logic';
import { useRouter } from "vue-router";
import {
  alphanumeric2,
  inputRequired,
  maxLengthInput,
} from "src/helpers/validations";
import { useAuthStore } from 'src/stores/auth.store';
import { sgdeaAxios } from 'src/services';

export default {
  name: 'CorrespondenciaModal',
  props: {
    showModal: Boolean
  },


  emits: ['update:showModal'],
  setup(props, { emit }) {
    const router = useRouter();
    const myForm = ref(null);
    const isModalOpen = ref(props.showModal);
    const auth = useAuthStore()

    const form = reactive({
      nombreComunicacion: '',
      tipoComunicacion: '',
      prefijoComunicacion: '',
      tipoPlantilla: ''
    });

    const tipoComunicacionOptions = ref([]);
    const prefijoComunicacionOptions = ref([]);
    const tipoPlantillaOptions = ref([]);
    const opsPlantilla = ref([]);



    const desabiltSelect =  ref(false);
    onMounted(async () => {
      const { getTypesCommunicationOptions, getTypesTemplates } = useCrearComunicacionesLogic();

      tipoComunicacionOptions.value = await getTypesCommunicationOptions();
      opsPlantilla.value = await getTypesTemplates();

      const response = await sgdeaAxios.get(`/medicina/prefijo-oficina`);
      prefijoComunicacionOptions.value = response.data
        .filter(e => {
          if (auth.userInfo.oficina) {
        return e.oficina.idDependencia === auth.userInfo.dependencia && e.oficina.id === auth.userInfo.oficina;
          } else {
        return e.oficina.idDependencia === auth.userInfo.dependencia;
          }
        })
        .map(e => {
          return {
        label: e.prefijo.nombre,
        value: e.prefijo.id,
          };
        });
    });

    watch(() => form.tipoComunicacion, (newValue) => {
      prefijoComunicacionOptions.value = [
        { label: 'Sin prefijo', value: 1 },
      ];
      desabiltSelect.value = newValue === 1;
      if (newValue === 1) {
      form.tipoPlantilla = [];
      form.prefijoComunicacion = prefijoComunicacionOptions.value.filter(it => it.label === 'Sin prefijo')[0].value;
      tipoPlantillaOptions.value = opsPlantilla.value.filter(it => it.label === 'Memorando interno');
      } else if (newValue === 2) {
      form.tipoPlantilla = [];
      // Cambia el prefijo de comunicación a "Sin prefijo" si el tipo de comunicación es "Externa"
      prefijoComunicacionOptions.value = [
        { label: 'Sin prefijo', value: 1 },
      ];
      tipoPlantillaOptions.value = opsPlantilla.value.filter(it => it.label === 'Comunicaciones de salida');
      } else {
      tipoPlantillaOptions.value = [];
      }

      if (form.prefijoComunicacion === 1) {
      if (newValue === 1) {
        form.tipoPlantilla = opsPlantilla.value.filter(it => it.label === 'Memorando interno')[0].value;
      } else if (newValue === 2) {
        form.tipoPlantilla = opsPlantilla.value.filter(it => it.label === 'Comunicaciones de salida')[0].value;
      }
      }
    });

    watch(() => form.prefijoComunicacion, (newValue) => {
      if (newValue === 1) {
      if (form.tipoComunicacion == 1) {
        form.tipoPlantilla = opsPlantilla.value.filter(it => it.label === 'Memorando interno')[0].value;
      } else if (form.tipoComunicacion == 2) {
        form.tipoPlantilla = opsPlantilla.value.filter(it => it.label === 'Comunicaciones de salida')[0].value;
      }
      }else {
        form.tipoPlantilla = [];
      }
    });

    watch(() => props.showModal, (newValue) => {
      isModalOpen.value = newValue;
    });

    watch(isModalOpen, (newValue) => {
      emit('update:showModal', newValue);
    });

    const submitForm = async () => {
      const isValidate = await myForm.value.validate()
      if (!isValidate) {
        return;
      }

      emit('create-new-communication', form);
     
      isModalOpen.value = false

    };

    onMounted(() => {
      isModalOpen.value = props.showModal;
    });

    const closeModal = () => {
      isModalOpen.value = false;
      router.push("/home")
    };
    return {
      alphanumeric2,
      inputRequired,
      submitForm,
      closeModal,
      maxLengthInput,
      tipoComunicacionOptions,
      prefijoComunicacionOptions,
      tipoPlantillaOptions,
      isModalOpen,
      form,
      desabiltSelect,
      myForm
    };
  }
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-wrapper {
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  cursor: default;
  width: 555px;
  height: 520px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.modal-container {
  flex-grow: 1;
  display: flex;
  /* Usa Flexbox para el contenedor interno */
  flex-direction: column;
  /* Orienta los hijos del contenedor verticalmente */
  justify-content: space-between;
  /* Distribuye el espacio entre los elementos del contenedor */
}

.form-group {
  margin-bottom: 1em;
  font-size: 16px;
  color: #6B737C;
  font-weight: 700;
}

.form-group .input {
  border: 1px solid #D1D5DB;
  border-radius: 5px;
  font-size: 16px;
  color: #000;
  font-weight: 400;
  border-color: #6B737C;
}

.form-group .select {
  border: 1px solid #D1D5DB;
  border-radius: 5px;
  font-size: 16px;
  color: #000;
  font-weight: 400;
  border-color: #6B737C;
}

.modal-header {
  display: flex;
  text-align: center;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin-top: 0;
  font-weight: 700;
  font-size: 24px;
}

.modal-header .span {
  font-weight: 400;
  font-size: 16px;
  color: #fff;
  background-color: #FF7500;
  padding: 0.8rem;
  border-radius: 8px;
}

.modal-footer {
  text-align: center;
}

.modal-default-button {
  margin: 0 0.5em;
}

.modal-submit-button {
  background-color: #2C3948;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.modal-enter-active,
.modal-leave-active {
  opacity: 1;
  transition: opacity .5s ease;
}

.modal-enter,
.modal-leave-to

/* .modal-leave-active below version 2.1.8 */
  {
  opacity: 0;
}
</style>
