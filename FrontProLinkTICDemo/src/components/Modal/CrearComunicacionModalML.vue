<template>
  <q-dialog persistent v-model="isModalOpen" class="modal-mask" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
    <q-card class="modal-wrapper" role="document">
      <div class="modal-header tw-px-4">
        <h2 id="dialog-title" class="tw-text-[#003352]">Crear comunicación</h2>
      </div>

      <q-form greedy ref="myForm" class="form-group" @submit.prevent>
        <div class="col-12">
          <span class="tw-w-full">
            <label for="proceso-select" class="tw-text-label">Proceso *</label>
            <q-select
              id="proceso-select"
              v-model="form.proceso"
              :options="listProcesos"
              :rules="[inputRequired]"
              label="Seleccione"
              dense
              outlined
              class="tw-rounded-lg"
              map-options
              aria-required="true"
              aria-label="Proceso"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </span>
        </div>

        <div class="col-12">
          <span class="tw-w-full">
            <label for="subproceso-select" class="tw-text-label">Subproceso *</label>
            <q-select
              id="subproceso-select"
              v-model="form.subProceso"
              :options="listSubProcesos"
              :rules="[inputRequired]"
              label="Seleccione"
              dense
              outlined
              class="tw-rounded-lg"
              map-options
              aria-required="true"
              aria-label="Subproceso"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </span>
        </div>

        <div class="col-12">
          <span class="tw-w-full">
            <label for="prefijo-select" class="tw-text-label">Prefijo de comunicación *</label>
            <q-select
              id="prefijo-select"
              v-model="form.prefijoComunicacion"
              :options="listPrefijo"
              :rules="[inputRequired]"
              label="Seleccione"
              dense
              outlined
              class="tw-rounded-lg"
              map-options
              aria-required="true"
              aria-label="Prefijo de comunicación"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </span>
        </div>

        <div class="col-12 tw-mb-4">
          <span class="tw-w-full ">
            <label for="nombreComunicacion" class="tw-text-label">Nombre de comunicación *</label>
            <q-input
              id="nombreComunicacion"
              v-model="form.nombreComunicacion"
              dense
              outlined
              label="Inserte"
              class="tw-rounded-lg"
              disable
              aria-label="Nombre de comunicación"
              aria-disabled="true"
            />
          </span>
        </div>

        <div class="col-12">
          <span class="tw-w-full">
            <label for="tipoComunicacion-select" class="tw-text-label">Tipo de comunicación *</label>
            <q-select
              id="tipoComunicacion-select"
              v-model="form.tipoComunicacion"
              label="Seleccione"
              map-options
              emit-value
              dense
              outlined
              :options="tipoComunicacionOptions"
              :rules="[inputRequired]"
              class="tw-rounded-lg"
              aria-label="Tipo de comunicación"
              aria-required="true"
            />
          </span>
        </div>

        <div class="col-12">
          <span class="tw-w-full">
            <label for="tipoPlantilla-select" class="tw-text-label">Tipo de plantilla {{ isRequired ? '*' : '' }}</label>
            <q-select
              id="tipoPlantilla-select"
              v-model="form.tipoPlantilla"
              label="Seleccione"
              map-options
              emit-value
              dense
              outlined
              :options="tipoPlantillaOptions"
              :rules="isRequired ? [inputRequired] : []"
              class="tw-rounded-lg"
              aria-label="Tipo de plantilla"
              :aria-required="isRequired"
              aria-disabled="true"
              disable
            />
          </span>
        </div>
      </q-form>

      <div class="tw-flex tw-justify-center tw-items-center tw-mb-2 tw-gap-6 tw-px-4">
        <q-btn
          @click="redirect"
          label="Comunicación masiva"
          text-color="white"
          color="primary"
          class="tw-rounded-xl tw-h-14 tw-px-8 tw-text-[13px]"
          style="width: 260px"
          aria-label="Redirigir a comunicación masiva"
        />
        <q-btn
          @click="closeModal"
          label="Cancelar"
          type="reset"
          text-color="black"
          color="accent"
          class="tw-rounded-xl tw-h-14 tw-text-[13px]"
          style="width: 240px"
          aria-label="Cancelar creación de comunicación"
        />
        <q-btn
          @click="submitForm"
          label="Continuar"
          text-color="white"
          color="primary"
          class="tw-rounded-xl tw-h-14 tw-p-2 tw-text-[13px]"
          style="width: 240px"
          aria-label="Continuar con la creación de comunicación"
        />
      </div>
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
import { sgdeaAxios } from "src/services";
import { useAuthStore } from 'src/stores/auth.store';
import { sortOptions } from "src/helpers/sortOptions";

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
      proceso: '',
      subProceso: '',
      nombreComunicacion: '',
      tipoComunicacion: '',
      prefijoComunicacion: '',
      tipoPlantilla: ''
    });

    const tipoComunicacionOptions = ref([]);
    const listNombreComunicacion = ref([]);
    const nombreComunicacion = ref([]);
    const prefijoComunicacionOptions = ref([]);
    const prefijoComunicacionOptionsStatic = ref([]);
    const tipoPlantillaOptions = ref([]);
    const isRequired = ref(false)
    const listProcesos = ref([]);
    const listPrefijo = ref([])
    const listSubProcesos = ref([]);

    const getProcesos = async () => {
      try {
        const response = await sgdeaAxios.get('/medicina/listProceso')

        if (response.status === 200) {
          listProcesos.value = sortOptions(response.data.map((e) => {
            return {
              label: e.proceso,
              value: e.id,
            }
          }))
        }
      } catch (error) {
        console.error(error);
      }
    }

    const getSubProcesos = async (id) => {
      try {
        const response = await sgdeaAxios.get('/medicina/listSubProceso/', { params: { id: id } })
        if (response.status === 200) {
          listSubProcesos.value = sortOptions(response.data.map((e) => {
            return {
              label: e.subProceso,
              value: e.id,
            }
          }))
        }
      } catch (error) {
        console.error(error);
      }
    }

    const getPrefijo = async (subprocesoId) => {
      try {
        const response = await sgdeaAxios.get('/medicina/prefijo-oficina', {
          params: { subproceso: subprocesoId },
        })
        if (response.status === 200) {
          listPrefijo.value = sortOptions(response.data.map((e) => {
            return {
            label: e.prefijo.nombre,
            value: e.id,
            }
          }))
          listPrefijo.value.unshift({ label: "Sin prefijo", value: 1 });
        }
      } catch (error) {
        console.error(error);
        listPrefijo.value = [{ label: "Sin prefijo", value: 1 }]
      }
    }

    onMounted(async () => {
      await getProcesos()
      const { getTypesCommunicationOptions, getTypePlantillaLoaded2 } = useCrearComunicacionesLogic();

      tipoComunicacionOptions.value = await getTypesCommunicationOptions();

      const response = await sgdeaAxios.get('/medicina/prefijo-oficina');

      const uniqueNames = new Set();

      prefijoComunicacionOptionsStatic.value = response.data.filter((e) => {
        const isRelevant = e.oficina?.id === auth.userInfo.oficina || e.prefijo.nombre === "Sin prefijo";
        if (isRelevant && !uniqueNames.has(e.prefijo.nombre)) {
          uniqueNames.add(e.prefijo.nombre);
          return true;
        }
        return false;
      }).map((e) => {
        return {
          label: e.prefijo.nombre,
          value: e.id,
          plantilla: e.plantilla,
        }
      })

      tipoPlantillaOptions.value = [...await getTypePlantillaLoaded2(), { label: 'Sin plantilla', value: 0 }];
      prefijoComunicacionOptionsStatic.value.unshift({ label: 'Sin prefijo',value: 1, plantilla: tipoPlantillaOptions.value[1]?.value });
      prefijoComunicacionOptionsStatic.value.unshift({ label: 'Sin prefijo',value: 2, plantilla: tipoPlantillaOptions.value[0]?.value });
      tipoComunicacionOptions.value = tipoComunicacionOptions.value.filter((e) => e.value !== 1);
    });

    watch(() => form.proceso, async (newValue) => {
      await getSubProcesos(Number(newValue.value))
    })

    watch(() => form.subProceso, async (value) => {
      await getPrefijo(value.value)
      form.nombreComunicacion = value.label;
    })

    watch(() => props.showModal, (newValue) => {
      isModalOpen.value = newValue;
    });

    watch(isModalOpen, (newValue) => {
      emit('update:showModal', newValue);
    });

    const redirect = () => {
      router.push('/correspondencia/crear-comunicaciones-masiva')
    }
    const closeModal = () => {
      isModalOpen.value = false;
      router.push("/medicina/bandeja-comunicaciones")
    };

    watch(() => form.prefijoComunicacion, async (newValue) => {
      prefijoComunicacionOptionsStatic.value.filter(item => item.value === newValue?.value).map(item => {
        form.tipoPlantilla = newValue?.value !== 1 ? item.plantilla : '';
      })

    })

    watch(() => form.tipoComunicacion, async (newValue) => {

      if(form.prefijoComunicacion.value === 1) {

        prefijoComunicacionOptionsStatic.value.filter(item => item.value === newValue).map(item => {
          form.tipoPlantilla = item.plantilla
        })
      }
    })

    const filterPrefij = (val, updateOptions) => {
      if (!val) {
        updateOptions(() => prefijoComunicacionOptions.value = prefijoComunicacionOptionsStatic.value);
        return;
      }
      const needle = val.toLowerCase();
      updateOptions(() => prefijoComunicacionOptions.value = prefijoComunicacionOptionsStatic.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1));
    };

    const submitForm = async () => {
      const isValidate = await myForm.value.validate()
      if (!isValidate) {
        return;
      }

      emit('create-new-communication', form);
    };

    const filterNombreComunicacion = (val, update) => {
      if (val == "") {
        update(() => {
          nombreComunicacion.value = listNombreComunicacion.value;
        });
        return;
      }
      update(() => {
        nombreComunicacion.value = listNombreComunicacion.value.filter((option) => {
          return option.label.toLowerCase().includes(val.toLowerCase());
        });
      });
    };

    return {
      filterNombreComunicacion,
      nombreComunicacion,
      alphanumeric2,
      inputRequired,
      submitForm,
      redirect,
      closeModal,
      maxLengthInput,
      tipoComunicacionOptions,
      prefijoComunicacionOptions,
      tipoPlantillaOptions,
      isModalOpen,
      form,
      myForm,
      isRequired,
      filterPrefij,
      listProcesos,
      listPrefijo,
      listSubProcesos,
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
  display: flex;
  flex-direction: column;
}

.modal-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 4px 22px 15px 14px;
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
.modal-leave-to {
  opacity: 0;
}
</style>
