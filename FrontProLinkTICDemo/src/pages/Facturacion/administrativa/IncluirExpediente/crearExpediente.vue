<template>
  <q-card class="tw-px-0 tw-py-3 tw-pb-6 tw-rounded-xl tw-mx-4" flat>
    <q-expansion-item default-opened>
      <template v-slot:header>
        <div class="col">
          <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
            Crear expediente
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
                hide-selected>
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
              <p class="tw-text-label tw-font-semibold">Subseries *</p>
              <q-select :options="filteredSubSeries" map-options emit-value outlined v-model="formData.subSeries"
                label="Inserte" dense :rules="[inputRequired]" @filter="filterSubSeries" use-input fill-input
                hide-selected>
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
                :rules="[onlyNumbers, v => maxLengthInput(10, v)]" @keypress="onlyAlphaNumeric"
                 />
            </div>
            <div class="tw-col-span-2 tw-mt-4">
              <p class="tw-text-label tw-font-semibold">Número de Identificación *</p>
              <q-input type="text" v-model="formData.numeroDocumento" label="Inserte" dense outlined
                :rules="[inputRequired, v => maxLengthInput(30, v)]" @keypress="onlyAlphaNumeric" readonly />
            </div>
            <div class="tw-col-span-2 tw-mt-4">
              <p class="tw-text-label tw-font-semibold">Expediente *</p>
              <q-input v-model="formData.expedientes" label="Inserte" dense filled
                :rules="[inputRequired, (v: string) => lengthValidation(150, v)]" disable
                hint="Estructura del Gestor: EXP-{Código de Proceso}-{Número de Documento Afectado}" />
            </div>
            <div class="tw-col-span-2 tw-mt-4">
              <p class="tw-text-label tw-font-semibold">
                Responsable del Expediente
              </p>
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
    @handleAccept="resetForm" text-button="Si" @close-modal="() => (showCancelModal = false)" />
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref, watch } from "vue";
import { sgdeaAxios } from "src/services";
import { inputRequired, maxLengthInput, onlyNumbers } from "src/helpers/validations";
import Modal from "src/components/Modal/Modal.vue";
import { toast } from "src/helpers/toast";
import { useAuthStore } from "src/stores/auth.store";
import { defineExpose } from 'vue';
import { onlyAlphaNumeric } from "src/helpers/validations";
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";
import { ExpedienteGlobal as Expediente } from "src/interfaces/Expediente";
import { crearTrazabilidad } from "src/helpers/trazabilidad";

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
  numeroDocumento: ''
});

const props = withDefaults(defineProps<{
    cobroData: any
}>(), {})
const showCancelModal = ref(false);
const form = ref();
const listadoSeries = ref()
const filteredSeries = ref()
const listadoSubSeries = ref([])
const filteredSubSeries = ref()
const listadoTiposDocumentales = ref()
const filteredTiposDocumentales = ref()
const listadoDependencias = ref()
const filteredDependencias = ref()
const success = ref(false)
const auth = useAuthStore()

onMounted(async () => {
  formData.value.responsableExpediente = auth.userInfo.name;
  formData.value.numeroDocumento = props.cobroData.numeroDocumento;

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
    const response = await sgdeaAxios.get(`/seccionSubSeccion`);

    listadoDependencias.value = response.data
      .map((e) => ({
        label: e.nombre,
        value: e.idSeccionSubSeccion,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    filteredDependencias.value = [...listadoDependencias.value];

  } catch (error) {
    console.error(error);
    toast.error("Ha ocurrido un error al cargar las dependencias");
  }
};

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
        value: item.idSeriesubserie
      }
    })
  } catch (error) {
    console.error(error);
    toast.error("Ha ocurrido un error al cargar las series")
  }
}

const loadSubseries = async (id) => {
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
  }).sort((a, b) => a.label.localeCompare(b.label))

}

function resetForm() {
  location.reload()
  showCancelModal.value = false
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
      // @ts-ignore
      nivelSeguridad: 'Pública',
      creacion: true,
      nodeIdRad: props.cobroData.nodeId,
      modulo: 1,
      radicado: props.cobroData.numeroRadicado || props.cobroData.sec,
    }

const subserie = listadoSubSeries.value.map(i=>i.value === formData.value.subSeries ).label
  const serie = listadoSeries.value.find(i=>i.value === formData.value.series ).label
  const tipo = listadoTiposDocumentales.value.find(i=>i.value === formData.value.tipoDocumental ).label
    const { status } = await sgdeaAxios.post(`/expediente/newpdate`, sendData)
    if (status === 200) {
      toast.success("Datos guardados exitosamente")
      await crearTrazabilidad({
        proceso: "Fac" + props.cobroData.idFactura,
        secuencia: props.cobroData.numeroRadicado || props.cobroData.sec,
        estado: 'Para gestión',
        descripcion:
          `Usuario:${auth.$state.userInfo.name}` +
          `Series:${serie}` +
          `Subseries:${subserie}` +
          `TipoDocumental:${tipo}` +
          `Expedientes:${formData.value.expedientes}` +
          `Cod proceso: ${formData.value.numeroIdentificacion}`+
          `Comentario: ${formData.value.observacion}` ,
        comentario: "Expediente incluido",
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} creo un expediente en el tramite ${ props.cobroData.numeroRadicado || props.cobroData.sec}`,
        tramite: "Facturacion Administrativa",
      });
    }

  } catch (error) {
    console.error(error);
    toast.error("Ha ocurrido un error al guardar los datos")
  }
  success.value = true
};

watch(() => formData.value.dependencia, (newValue) => {
  // @ts-expect-error
  loadSeries(newValue.value)
  formData.value.series = ''
})

watch(() => formData.value.series, (newValue) => {
  loadSubseries(newValue)
  formData.value.subSeries = ''
})

watch(() => formData.value.subSeries, (newValue) => {
  loadTipoDocumental(newValue)
  formData.value.tipoDocumental = '';
})

watch(() => formData.value.numeroIdentificacion, (newValue) => {
  if (typeof onlyNumbers(newValue) != "string" && newValue.length > 0) {
    formData.value.expedientes = `EXP-${newValue}-${formData.value.numeroDocumento}`
  } else {
    formData.value.expedientes = ''
  }
})

const filterDependencias = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredDependencias.value = filteredDependencias.value
    })
    return
  }
  update(() => {
    filteredDependencias.value = filteredDependencias.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const filterSeries = (val: string, update: any) => {
  const normalizeString = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (val === "") {
    update(() => {
      filteredSeries.value = listadoSeries.value;
    });
    return;
  }

  const normalizedVal = normalizeString(val.toLowerCase());

  update(() => {
    filteredSeries.value = listadoSeries.value.filter((option) => {
      return normalizeString(option.label.toLowerCase()).includes(normalizedVal);
    });
  });
};

const filterSubSeries = (val: string, update: any) => {
  const normalizeString = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (val === "") {
    update(() => {
      filteredSubSeries.value = listadoSubSeries.value;
    });
    return;
  }

  const normalizedVal = normalizeString(val.toLowerCase());

  update(() => {
    filteredSubSeries.value = listadoSubSeries.value.filter((option) => {
      return normalizeString(option.label.toLowerCase()).includes(normalizedVal);
    });
  });
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
