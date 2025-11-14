<template>
  <q-card class="tw-px-0 tw-py-3 tw-pb-6 tw-rounded-xl tw-mx-4" flat>
    <q-expansion-item default-opened>
      <template v-slot:header>
        <div class="col">
          <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
            Crear Expediente
          </h3>
        </div>
      </template>
      <q-form ref="form" @submit.prevent="submit" greedy>
        <section class="tw-px-8 tw-pt-3">
          <div class="tw-grid tw-grid-cols-4 tw-gap-x-4">
            <div class="tw-col-span-2">
              <p class="tw-text-label tw-font-semibold">Dependencia</p>
              <q-select :options="filteredDependencias" map-options outlined v-model="formData.dependencia"
                label="Inserte" dense @filter="filterDependencias" use-input fill-input hide-selected />
            </div>

            <div class="tw-col-span-2">
              <p class="tw-text-label tw-font-semibold">Series *</p>
              <q-select :options="filteredSeries" map-options emit-value outlined v-model="formData.series"
                label="Inserte" dense :rules="[inputRequired]" @filter="filterSeries" use-input fill-input
                @update:model-value="handleSeriesChange" hide-selected>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div class="tw-col-span-2 tw-mt-4">
              <p class="tw-text-label tw-font-semibold">Subseries <span v-if="subseriesRequired">*</span></p>
              <q-select :options="filteredSubSeries" map-options emit-value outlined v-model="formData.subSeries"
                label="Inserte" dense :rules="subseriesRequired ? [inputRequired] : []" @filter="filterSubSeries" 
                use-input fill-input hide-selected :disable="!subseriesRequired">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div class="tw-col-span-2 tw-mt-4">
              <p class="tw-text-label tw-font-semibold">Tipo Documental *</p>
              <q-select :options="filteredTiposDocumentales" map-options emit-value outlined
                v-model="formData.tipoDocumental" label="Inserte" dense :rules="[inputRequired]"
                @filter="filterTiposDocumental" use-input fill-input hide-selected>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div class="tw-col-span-2 tw-mt-4">
              <p class="tw-text-label tw-font-semibold">Código de Proceso *</p>
              <q-input type="text" v-model="formData.numeroIdentificacion" label="Inserte" dense outlined
                :rules="[inputRequired, onlyNumbers, v => maxLengthInput(10, v)]" readonly />
            </div>

            <div class="tw-col-span-2 tw-mt-4">
              <p class="tw-text-label tw-font-semibold">Número de Identificación *</p>
              <q-input type="text" v-model="formData.numeroDocumento" label="Inserte" dense outlined
                :rules="[inputRequired, onlyNumbers, v => maxLengthInput(30, v)]" readonly />
            </div>

            <div class="tw-col-span-2 tw-mt-4">
              <p class="tw-text-label tw-font-semibold">Expediente *</p>
              <q-input v-model="formData.expedientes" label="Inserte" dense filled
                :rules="[inputRequired, (v: string) => lengthValidation(150, v)]" disable
                hint="Estructura del Gestor: EXP-{Código de Proceso}-{Número de Documento Afectado}" />
            </div>

            <div class="tw-col-span-2 tw-mt-4">
              <p class="tw-text-label tw-font-semibold">Responsable del expediente</p>
              <q-input v-model="formData.responsableExpediente" label="Inserte" dense disable filled />
            </div>

            <div class="tw-col-span-4 tw-mt-4">
              <CommentTextArea v-model="formData.observacion" :is-required="true" :max-length="1000"
                label="Observaciones" />
            </div>
          </div>
        </section>
      </q-form>
    </q-expansion-item>
  </q-card>

  <div class="justify-center tw-w-full tw-pb-6 tw-mt-4 tw-flex tw-gap-4">
    <q-btn label="Cancelar" type="reset" style="width: 240px; height: 40px" text-color="black" color="accent"
      class="tw-rounded-xl" @click="() => (showCancelModal = true)" />
    <q-btn label="Guardar" text-color="white" @click="submit" style="width: 240px; height: 40px" color="primary"
      class="tw-rounded-xl tw-btn tw-p-2" />
  </div>

  <Modal v-model:model-value="showCancelModal" title="¡Espera un momento!" text="Al cancelar el proceso perderá los datos
    ingresados en el formulario, ¿desea realizar la acción?" :is-success="false" textButtonCancel="No" cancel-button
    @handleAccept="emit('redirect')" text-button="Si" @close-modal="() => (showCancelModal = false)" />
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref, watch } from "vue";
import { sgdeaAxios } from "src/services";
import { inputRequired, maxLengthInput, onlyNumbers } from "src/helpers/validations";
import Modal from "src/components/Modal/Modal.vue";
import { toast } from "src/helpers/toast";
import { useAuthStore } from "src/stores/auth.store";
import { defineExpose } from 'vue';
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";
import { ExpedienteGlobal as Expediente } from "src/interfaces/Expediente";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { useRouter } from 'vue-router'

const formData: Ref<Expediente> = ref({
  dependencia: '',
  series: '',
  subSeries: '',
  tipoDocumental: '',
  expedientes: '',
  numeroIdentificacion: '',
  responsableExpediente: '',
  nivelAcceso: '',
  observacion: '',
  numeroDocumento: '',
  codigoProceso: ''
});

const subseriesRequired = ref(true);
const selectedSeriesInfo: Ref<any> = ref(null);

const props = withDefaults(defineProps<{
  mlData: any
}>(), {})

const emit = defineEmits(['isExp', 'redirect'])
const auth = useAuthStore()
const showCancelModal = ref(false);
const form = ref();
const listadoSeries = ref()
const filteredSeries = ref()
const listadoSubSeries = ref()
const filteredSubSeries = ref()
const listadoTiposDocumentales = ref()
const filteredTiposDocumentales = ref()
const listadoDependencias = ref()
const filteredDependencias = ref()
const success = ref(false)
const router = useRouter()

onMounted(async () => {
  formData.value.numeroIdentificacion = props.mlData?.caseId;
  formData.value.responsableExpediente = auth.userInfo.name;
  formData.value.numeroDocumento = props.mlData?.metadatos?.numeroDocumento;
  formData.value.expedientes = `EXP-${props.mlData?.caseId}-${formData.value.numeroDocumento == 'N/A' ? 'NA' : formData.value.numeroDocumento}`
  await getData()
});

defineExpose({
  success
});

const getData = async () => {
  await loadDependencias()
}

const loadDependencias = async () => {
  try {
    const response = await sgdeaAxios.get(`/seccionSubSeccion`)
    listadoDependencias.value = response.data.map((e) => {
      return {
        label: e.nombre,
        value: e.idSeccionSubSeccion
      }
    })

    formData.value.dependencia = listadoDependencias.value.find((e) => e.label === 'GERENCIA MÉDICA')
  } catch (error) {
    toast.error("Ha ocurrido un error al cargar las dependencias")
  }
}

const loadSeries = async (idSeccionSubseccion) => {
  try {
    const responseSeries = await sgdeaAxios.get(`serie/buscarSerie`, {
      params: {
        idSeriesubserie: null, descripcion: null, estado: true, codigo: null, seccionSubSeccion: idSeccionSubseccion, padre: null
      }
    })

    listadoSeries.value = responseSeries.data.map((item) => {
      return {
        label: item.descripcion,
        value: item.idSeriesubserie,
        fullData: item
      }
    })
  } catch (error) {
    toast.error("Ha ocurrido un error al cargar las series")
  }
}

const loadSubseries = async (id) => {
  try {
    const responseSubSeries = await sgdeaAxios.get(`serie/buscarSub`, {
      params: {
        idSeriesubserie: null, descripcion: null, estado: true, codigo: null, seccionSubSeccion: null, padre: id
      }
    })

    listadoSubSeries.value = responseSubSeries.data.map((item) => {
      return {
        label: item.descripcion,
        value: item.idSeriesubserie
      }
    })
  } catch (error) {
    console.error(error)
  }
}

const loadTipoDocumental = async (id) => {
  const response = await sgdeaAxios.get(`tiposdocumentales/asignacion/serie/tipos_documentales`, {
    params: { serie: id }
  })

  listadoTiposDocumentales.value = response.data.tiposDocumentalesAsociados.map((e) => {
    let item = e.tipologiaDocumental
    return {
      label: item.nombre,
      value: item.idTipologiaDocumental,
    }
  })
}

const handleSeriesChange = (newValue) => {
  selectedSeriesInfo.value = listadoSeries.value.find(series => series.value === newValue)?.fullData || null;
  
  subseriesRequired.value = selectedSeriesInfo.value?.contieneSubserie || false;
  
  if (!subseriesRequired.value) {
    formData.value.subSeries = "";
  }
  
  loadSubseries(newValue);
  loadTipoDocumental(newValue);
  
  if (!subseriesRequired.value) {
    formData.value.tipoDocumental = '';
  }
}

const submit = async () => {
  if (!await form.value.validate()) {
    toast.error('Debe diligenciar los campos obligatorios para continuar con el proceso')
    return
  }

  try {
    const sendData = {
      // @ts-ignore
      dependencia: formData.value.dependencia.value,
      serie: formData.value.series,
      subserie: formData.value.subSeries,
      tipoDocumental: formData.value.tipoDocumental,
      codIdentificacion: formData.value.numeroIdentificacion,
      responsable: auth.userInfo.userid,
      observaciones: formData.value.observacion,
      titulo: formData.value.expedientes,
      nivelSeguridad: "Pública",
      creacion: true,
      nodeIdRad: props.mlData.nodeIdCarpeta,
      modulo: 9,
      radicado: props.mlData.idRadicado,
    }

    const response = await sgdeaAxios.post(`/expediente/newpdate`, sendData)
    if (response.status === 200 || response.status === 201) {
      toast.success("Datos guardados exitosamente")
      emit('isExp')
      success.value = true
      await crearTrazabilidad({
        proceso: "MLCOM" + props.mlData.id,
        secuencia: props.mlData.idRadicado,
        estado: props.mlData.estado,
        descripcion: `Usuario: ${useAuthStore().$state.userInfo.name}   Dependencia: ${formData.value.dependencia.label}
        Serie: ${ listadoSeries.value.find(item=> item.value =formData.value.series).label}
        Subserie: ${listadoSubSeries.value.find(item => item.value =formData.value.subSeries).label}
        Tipo documental: ${ listadoTiposDocumentales.value.find(item=> item.value =formData.value.tipoDocumental).label}
        Expediente: ${formData.value.expedientes}`,
        comentario: "Crear expediente",
        nombre: useAuthStore().$state.userInfo.name,
        accion: `${
          useAuthStore().$state.userInfo.name
        } ha creado un expediente a la comunicación`,
        tramite: "Medicina laboral comunicaciones",
      });
       router.go(0)
    }
  } catch (error) {
    toast.error("Ha ocurrido un error al guardar los datos")
  }
}

watch(() => formData.value.dependencia, (newValue) => {
  // @ts-expect-error
  loadSeries(newValue.value)
  formData.value.series = ''
})

watch(() => formData.value.subSeries, (newValue) => {
  loadTipoDocumental(newValue)
  formData.value.tipoDocumental = '';
})

const filterDependencias = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredDependencias.value = listadoDependencias.value
    })
    return
  }
  update(() => {
    filteredDependencias.value = listadoDependencias.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const filterSeries = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredSeries.value = listadoSeries.value
    })
    return
  }
  update(() => {
    filteredSeries.value = listadoSeries.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const filterSubSeries = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredSubSeries.value = listadoSubSeries.value
    })
    return
  }
  update(() => {
    filteredSubSeries.value = listadoSubSeries.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const filterTiposDocumental = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredTiposDocumentales.value = listadoTiposDocumentales.value
    })
    return
  }
  update(() => {
    filteredTiposDocumentales.value = listadoTiposDocumentales.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const lengthValidation = (n, val: string) => val.length <= n || "Máximo " + n + " caracteres"

</script>