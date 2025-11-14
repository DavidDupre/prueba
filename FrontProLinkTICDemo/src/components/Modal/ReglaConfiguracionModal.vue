<template>
  <q-dialog persistent v-model="isModalOpen" class="modal-mask">
    <q-card class="modal-wrapper">
      <q-card-section class="modal-header">
        <h2>Asignación de reglas de flujo</h2>
      </q-card-section>

      <q-card-section class="modal-body">
        <q-form greedy ref="myForm" class="q-gutter-md form-group">

          <div class="col-12">
            <span class="tw-w-full">
              <label class="tw-text-label">Formato de tiempo *</label>
              <q-select v-model="form.formatTime" label="Seleccione" dense outlined
                :options="formatosTiempo" :rules="[inputRequired]" class="tw-rounded-lg">
              </q-select>
            </span>
          </div>

          <div v-if="form.formatTime !== 'Sin tiempo'" class="col-12">
            <span class="tw-w-full">
              <label class="tw-text-label">Tipo de tiempo *</label>
              <q-select v-model="form.typeTime" label="Seleccione" map-options emit-value dense outlined
                :options="tipoTiempo" :rules="[inputRequired]" class="tw-rounded-lg">
              </q-select>
            </span>
          </div>

          <div v-if="form.formatTime !== 'Sin tiempo'" class="col-12">
            <span class="tw-w-full">
              <label class="tw-text-label">Tiempo de gestión *</label>
              <q-input v-model.number="form.manageTime" dense outlined label="Inserte" class="tw-rounded-lg"
                :rules="isFormatDays
                  ? [inputRequired, val => maxLengthInput(2, val),  onlyNumbers, val =>numbersInRange(val, 1, 24)]
                  : [inputRequired, val => maxLengthInput(3, val),  onlyNumbers, val =>numbersInRange(val, 1, 365)]"
                />
            </span>
          </div>
        </q-form>
      </q-card-section>

      <div class="tw-flex tw-justify-center tw-items-center tw-mb-10 tw-gap-6 tw-px-4">
        <q-btn @click="closeModal()"   label="Cancelar" type="reset" style="width: 240px" text-color="black" color="accent"
          class="tw-rounded-xl tw-h-12" />

        <q-btn @click="submitForm()" label="Guardar" text-color="white"  style="width: 240px" color="primary"
          class="tw-rounded-xl tw-h-12 tw-p-2" />
      </div>
    </q-card>
  </q-dialog>

  <Modal v-model:model-value="showModalSecond" title="Confirmación" persistent
    :text="`¿Está seguro de abandonar la Asignación de reglas al metadato?`"
    :is-success="false" :cancelButton="true" @handle-accept="handleCancel" textButtonCancel="No"
    text-button="Si"  />
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue';
import { useCrearComunicacionesLogic } from 'src/pages/Correspondencia/Crear/CrearComunicaciones/CrearComunicaciones.Logic';
import { useRouter } from "vue-router";
import Modal from 'src/components/Modal/Modal.vue'
import {
  inputRequired,
  maxLengthInput,
  onlyNumbers,
  numbersInRange
} from "src/helpers/validations";

import {listaFormatoTiempo, listaTipoTiempo, objResponse} from 'src/pages/metadatos/const/index'
import { sgdeaAxios } from 'src/services';
import { toast } from 'src/helpers/toast';

export default {
  name: 'ReglaConfiguracionModal',
  props: {
    showModal: Boolean,
    idMetadato: Number
  },

  emits: ['update:showModal'],
  components: { Modal},
  setup(props, { emit }) {
    const router = useRouter();
    const myForm = ref(null);
    const isModalOpen = ref(props.showModal);
    const showModalSecond = ref(false);
    const idRuleMetadato=ref('')

    const form = reactive({
      formatTime: '',
      typeTime: '',
      manageTime: '',
    });

    const formatosTiempo = ref([]);
    const tipoTiempo = ref([]);
    const isFormatDays=ref(false)
    const isHaveRule=ref(false)
    const isFirstLoad=ref(true)

    const getData=async()=>{
      isFirstLoad.value=true
      try {
        const {data}= await sgdeaAxios.get(`/metadato/reglaMetadatoXMetadato/${props.idMetadato}`)

        if(data){
          isHaveRule.value=true
          const {data}=await sgdeaAxios.get(`/metadato/reglaMetadatoXMetadato/${props.idMetadato}`)
          idRuleMetadato.value=data.id
          form.formatTime=data.formatoTiempo
          form.typeTime=data.tipoTiempo
          form.manageTime=data.tiempoGestion
        }
      } catch (error) {
        toast.error('Error al obtener la información del metadato')
      }
    }

    onMounted(async () => {
      formatosTiempo.value=listaFormatoTiempo
      tipoTiempo.value=listaTipoTiempo

      if(props.idMetadato) await getData()
    });

    watch(() => props.showModal, (newValue) => {
      isModalOpen.value = newValue;
    });

    watch(isModalOpen, (newValue) => {
      emit('update:showModal', newValue);
    });

    watch(()=>form.formatTime, (newValue) => {
      isFormatDays.value=false
      if(!isFirstLoad.value) form.manageTime=''
      if(newValue === 'Horas') isFormatDays.value=true
      if(newValue === 'Sin tiempo') form.typeTime=''

      isFirstLoad.value=false
    });

    const handleCancel = () => {
      onReset()
      isModalOpen.value = false;
    };

    const onReset = () => {
      form.formatTime = '';
      form.typeTime = '';
      form.manageTime = '';
    };

    const buildBody=async()=>{
      const { data } = await sgdeaAxios.get(`/metadato/obtener/${props.idMetadato}`);
      return ({
        "id":props.idMetadato,
        "metadato":data.metadato,
        "formatoTiempo": form.formatTime,
        "tipoTiempo": form.typeTime,
        "tiempoGestion": form.manageTime
      })
    }

    const createOrUpdateRule=async()=>{
      try {
        const body=await buildBody()
        const path=isHaveRule.value? `/metadato/reglaMetadato/${idRuleMetadato.value}`:'/metadato/reglaMetadato'

        await sgdeaAxios[isHaveRule.value ? 'put':'post'](path,body)
        toast.success('Se ha guardado la regla correctamente')
      } catch (error) {
        toast.error('Error al guardar la regla del metadato')
      }finally{
        isModalOpen.value = false;
        isHaveRule.value=false
        idRuleMetadato.value=''
        onReset()
      }
    }

    const submitForm = async () => {
      const isValidate=await myForm.value.validate()

      if (!isValidate) {
        toast.error(objResponse.campos_obligtorios);
        return;
      }

      createOrUpdateRule()
    };

    onMounted(() => {
      isModalOpen.value = props.showModal;
    });

    const closeModal = () => {
      showModalSecond.value = true;
      //isModalOpen.value = false;
    };

    watch(()=>isModalOpen.value, (newValue) => {
      isHaveRule.value=false
      if(newValue){
        getData()
      }
    });

    return {
      onlyNumbers,
      inputRequired,
      submitForm,
      closeModal,
      maxLengthInput,
      isModalOpen,
      form,
      myForm,
      showModalSecond,
      handleCancel,
      formatosTiempo,
      tipoTiempo,
      isFormatDays,
      numbersInRange,

      isFirstLoad,
      isHaveRule
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
