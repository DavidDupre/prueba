<template>
  <div v-if="incluirExp">
    <q-card flat class="flex tw-bg-transparent tw-w-full tw-justify-end tw-pt-3 tw-pb-5 tw-pr-6" v-if="!expedienteInit">
      <q-btn label="Crear expediente" text-color="white" @click="
        crearExp = true;
      incluirExp = false;
      " style="width: 160px; height: 40px" color="primary" class="tw-rounded-xl tw-btn tw-p-2" />
    </q-card>
    <q-card class="tw-px-0 tw-py-3 tw-pb-6 tw-rounded-xl tw-mx-4" flat>
      <q-expansion-item default-opened>
        <template v-slot:header>
          <div class="col">
            <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
              {{ expedienteInit ? "Expediente incluido" : "Incluir expediente" }}
            </h3>
          </div>
        </template>
        <q-form ref="form" @submit.prevent="submit" greedy>
          <section class="tw-px-8 tw-pt-3">
            <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Dependencia</p>
                <q-select :options="filteredDependencias" map-options outlined v-model="formData.dependencia"
                  label="Inserte" dense :filter="filterDependencias" :disable="expedienteInit" use-input fill-input hide-selected />
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Series *</p>
                <q-select :options="filteredSeries" map-options emit-value outlined v-model="formData.series"
                  label="Inserte" dense :rules="[inputRequired]" @filter="filterSeries" use-input fill-input
                  @update:model-value="handleSeriesChange" hide-selected :readonly="expedienteInit"
                  :disable="isPorAprobarPorRevisar || expedienteInit">
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
                  use-input fill-input hide-selected :readonly="expedienteInit" 
                  :disable="isPorAprobarPorRevisar || expedienteInit || !subseriesRequired">
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
                  @filter="filterTiposDocumental" use-input fill-input hide-selected :readonly="expedienteInit"
                  :disable="isPorAprobarPorRevisar || expedienteInit">
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
               <p class="tw-text-label tw-font-semibold">Expedientes *</p>
                <q-select :options="filteredExpedientes" map-options emit-value outlined v-model="formData.expedientes"
                  label="Inserte" dense :rules="[inputRequired]" @filter="filterExpedientes" use-input fill-input
                  hide-selected :readonly="expedienteInit" :disable="isPorAprobarPorRevisar || expedienteInit">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Sin resultados
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>
          </section>
        </q-form>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-px-0 tw-py-3 tw-pb-6 tw-mt-5 tw-rounded-xl tw-mx-4" flat v-if="expedienteState">
      <q-expansion-item default-opened>
        <template v-slot:header>
          <div class="col">
            <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md" v-if="!expedienteInit">
              Expediente a Asociar
            </h3>
            <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md" v-else>
              Expediente Asociado
            </h3>
          </div>
        </template>
        <q-form ref="form" @submit.prevent="submit" greedy>
          <section class="tw-px-8 tw-pt-3">
            <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
              <div class="tw-col-span-3 tw-text-label tw-mt-5 tw-ml-2">
                <p class="tw-font-bold">Número de identificacion</p>
                <p>{{ filterExpedientesAll.codIdentificacion }}</p>
              </div>
              <div class="tw-col-span-3 tw-text-label tw-mt-5 tw-ml-2">
                <p class="tw-font-bold">Responsable del expediente</p>
                <p>{{ filterExpedientesAll.responsable }}</p>
              </div>
              <div class="tw-col-span-6 tw-text-label tw-mt-4 tw-ml-2">
                <p class="tw-font-bold">Nivel de acceso</p>
                <p>{{ filterExpedientesAll.nivelSeguridad }}</p>
              </div>
              <div class="tw-col-span-6 tw-text-label tw-mt-4 tw-ml-2">
                <p class="tw-font-bold">Observaciones</p>
                <p>{{ filterExpedientesAll.observaciones }}</p>
              </div>
            </div>
          </section>
        </q-form>
      </q-expansion-item>
    </q-card>

    <div class="justify-center tw-w-full tw-pb-6 tw-mt-4 tw-flex tw-gap-4" v-if="!expedienteInit">
      <q-btn label="Cancelar" type="reset" style="width: 240px; height: 40px" text-color="black" color="accent"
        class="tw-rounded-xl" @click="() => (showModal = true)" />
      <q-btn label="Guardar" text-color="white" @click="submit" style="width: 240px; height: 40px" color="primary"
        class="tw-rounded-xl tw-btn tw-p-2" />
    </div>
  </div>

  <crearExpediente ref="crearComp" v-if="crearExp" :informacionGeneral="props.informacionGeneral" @crearExpediente="emit('success', $event), getData($event);" />

  <Modal v-model:model-value="showModal" title="¡Espera un momento!"
    text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
    :is-success="false" textButtonCancel="No" cancel-button @handleAccept="resetForm" text-button="Si"
    @close-modal="() => (showModal = false)" />
</template>

<script lang="ts" setup>
import { crearTrazabilidad } from 'src/helpers/trazabilidad';
import { computed, onMounted, Ref, ref, watch } from "vue";
import { useLoadingStore } from "src/stores/loading.store";
import { inputRequired } from "src/helpers/validations";
import { useAuthStore } from "src/stores/auth.store";
import crearExpediente from "./crearExpediente.vue";
import Modal from "src/components/Modal/Modal.vue";
import { SelectInput } from "src/interfaces";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { ExpedienteGlobal as Expediente } from "src/interfaces/Expediente";

const formData: Ref<Expediente> = ref({
  dependencia: "",
  series: "",
  subSeries: "",
  tipoDocumental: "",
  expedientes: "",
  numeroIdentificacion: "",
  responsableExpediente: "",
  nivelAcceso: "",
  observacion: "",
  buscarExp: "",
});

// Nueva variable para controlar si las subseries son requeridas
const subseriesRequired = ref(true);
const selectedSeriesInfo: Ref<any> = ref(null);

const props = defineProps<{ informacionGeneral: any; }>()
const emit = defineEmits(["success"]);

const auth = useAuthStore();
const filteredTiposDocumentales: Ref<SelectInput[]> = ref([]);
const listadoTiposDocumentales: Ref<SelectInput[]> = ref([]);
const listadoDependencias = ref()
const filteredDependencias = ref()
const filteredExpedientes: Ref<SelectInput[]> = ref([]);
const listadoExpedientes: Ref<SelectInput[]> = ref([]);
const filteredSubSeries: Ref<SelectInput[]> = ref([]);
const listadoSubSeries: Ref<SelectInput[]> = ref([]);
const filteredSeries: Ref<SelectInput[]> = ref([]);
const listadoSeries: Ref<SelectInput[]> = ref([]);
const listadoExpedientesAll: Ref<any> = ref([]);
const filterExpedientesAll: Ref<any> = ref({});
const showModal = ref(false);
const form = ref();
const expedienteState = ref(false);
const expedienteInit = ref(false);
const crearExp = ref(false);
const crearComp: Ref<any> = ref();
const incluirExp = ref(true);
const isPorAprobarPorRevisar = computed(() => ['por aprobar', 'por revisar'].includes(props.informacionGeneral.estado.estado.toLowerCase()));

onMounted(async () => {
  await getData();
});

const getData = async (nodeId?: string) => {
  try {
    await loadDependencias()
    await loadExpediente(nodeId)
  } catch (error) {
    console.error(error);
  }
};

const loadExpediente = async (nodeId?: string) => {
  const { data: expediente } = await sgdeaAxios.get("/expediente/children", {
    // @ts-ignore
    params: { nodeId: nodeId || props.informacionGeneral.nodeID },
  })

  if (expediente.id != null) {
    // @ts-ignore
    formData.value.dependencia = {
      label: expediente.dependencia,
      value: expediente.idDependencia
    };

    // @ts-ignore
    formData.value.series = {
      value: expediente.idSerie,
      label: expediente.serie,
    };
    // @ts-ignore
    formData.value.subSeries = {
      value: expediente.idSubserie,
      label: expediente.subserie,
    };
    // @ts-ignore
    formData.value.tipoDocumental = {
      value: expediente.idTipoDocumental,
      label: expediente.tipoDocumental,
    };
    formData.value.expedientes = expediente.titulo;
    formData.value.buscarExp = expediente.titulo;
    filterExpedientesAll.value = expediente;
    expedienteInit.value = true;
  }
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
    filteredDependencias.value = [...listadoDependencias.value]

    formData.value.dependencia = listadoDependencias.value.find((e) => e.value === auth.userInfo.dependencia)
  } catch (error) {
    toast.error("Ha ocurrido un error al cargar las dependencias")
  }
}

// Nueva función para manejar el cambio de serie
const handleSeriesChange = (newValue) => {
  selectedSeriesInfo.value = listadoSeries.value.find(series => series.value === newValue)?.rawData || null;

  subseriesRequired.value = selectedSeriesInfo.value?.contieneSubserie || false;
  
  if (!subseriesRequired.value) {
    formData.value.subSeries = "";
  }
  
  loadSubseries(newValue);
  
  if (!subseriesRequired.value) {
    loadTipoDocumental(newValue);
    loadExpedientesWithSeriePadre();
  } else {
    loadExpedientes();
  }
  
  if (!expedienteInit.value) {
    formData.value.subSeries = "";
    formData.value.tipoDocumental = "";
    formData.value.expedientes = "";
    expedienteState.value = false;
  }
}

const loadSeries = async (idSeccionSubseccion) => {
  if (expedienteInit.value) return;
  try {
    const responseSeries = await sgdeaAxios.get(`serie/buscarSerie`, {
      params: {
        idSeriesubserie: null, descripcion: null, estado: true, 
        codigo: null, seccionSubSeccion: idSeccionSubseccion, padre: null
      }
    });

    listadoSeries.value = responseSeries.data.map((item) => ({
      label: item.descripcion,
      value: item.idSeriesubserie,
      rawData: item // Guardamos toda la información de la serie
    }));
  } catch (error) {
    console.error(error);
  }
}

const loadSubseries = async (id) => {
  if (expedienteInit.value) return;
  try {
    const responseSubSeries = await sgdeaAxios.get(`serie/buscarSub`, {
      params: {
        idSeriesubserie: null,
        descripcion: null,
        estado: true,
        codigo: null,
        seccionSubSeccion: null,
        padre: id,
      },
    });

    listadoSubSeries.value = responseSubSeries.data.map((item) => ({
      label: item.descripcion,
      value: item.idSeriesubserie,
    }));
  } catch (error) {
    console.error(error);
  }
};

const loadExpedientesWithSeriePadre = async () => {
  try {
    const response = await sgdeaAxios.get(`/expediente`, {
      params: { 
        idSubserie: null, 
        seriePadre: selectedSeriesInfo.value?.idSeriesubserie
      },
    });
    
    listadoExpedientesAll.value = response.data;
    listadoExpedientes.value = response.data.map((e) => ({
      label: e.titulo,
      value: e.titulo,
    }));
  } catch (error) {
    console.error(error);
  }
};

const loadTipoDocumental = async (id) => {
  if (expedienteInit.value) return;

  const response = await sgdeaAxios.get(
    `tiposdocumentales/asignacion/serie/tipos_documentales`,
    { params: { serie: id } }
  );
  try {
    listadoTiposDocumentales.value = response.data.tiposDocumentalesAsociados.map(
      (e) => {
        let item = e.tipologiaDocumental;
        return {
          label: item.nombre,
          value: item.idTipologiaDocumental,
        };
      }
    );
  } catch (error) {
    console.error(error)
  }
};

const loadExpedientes = async () => {
  if (expedienteInit.value) return;
  
  try {
    let params: any = { };
    
    if (formData.value.subSeries) {
      params.idSubserie = formData.value.subSeries;
    } 
    else if (selectedSeriesInfo.value && !subseriesRequired.value) {
      params.seriePadre = selectedSeriesInfo.value.idSeriesubserie;
    }
    else {
      return;
    }
    
    const response = await sgdeaAxios.get(`/expediente`, { params });
    
    listadoExpedientesAll.value = response.data;
    listadoExpedientes.value = response.data.map((e) => ({
      label: e.titulo,
      value: e.titulo,
    }));
  } catch (error) {
    console.error(error);
  }
};

const resetForm = () => {
  location.reload();
  showModal.value = false;
}

const submit = async () => {
  if (!await form.value.validate()) {
    toast.error("Debe diligenciar los campos obligatorios para continuar con el proceso");
    return
  }

  try {
    const sendData = {
      // @ts-ignore
      dependencia: formData.value.dependencia.value,
      serie: formData.value.series,
      subserie: formData.value.subSeries,
      tipoDocumental: formData.value.tipoDocumental,
      codIdentificacion: filterExpedientesAll.value.codIdentificacion,
      responsable: filterExpedientesAll.value.idResponsable,
      observaciones: filterExpedientesAll.value.observaciones,
      titulo: formData.value.expedientes,
      // @ts-ignore
      nivelSeguridad: filterExpedientesAll.value.nivelSeguridad,
      creacion: false,
      modulo: 8,
      nodeIdRad: props.informacionGeneral.nodeID,
      radicado: props.informacionGeneral.nroRadicado,
    };

    const response = await sgdeaAxios.post(`expediente/newpdate`, sendData);

    if (response.status === 200 || response.status === 201) {
      toast.success("Datos guardados exitosamente");
      await crearTrazabilidad({
        proceso: `ENTC${props.informacionGeneral.id}`,
        secuencia: props.informacionGeneral.nroRadicado,
        estado: props.informacionGeneral.estado.estado,
        descripcion:
          `Usuario: ${auth.$state.userInfo.name}` +
          `Series: ${listadoSeries.value.find(s => s.value === (formData.value.series))?.label || formData.value.series}` +
          `Subseries: ${listadoSubSeries.value.find(s => s.value === formData.value.subSeries)?.label || formData.value.subSeries}` +
          `TipoDocumental: ${listadoTiposDocumentales.value.find(td => td.value === (formData.value.tipoDocumental))?.label || formData.value.tipoDocumental}` +
          `Expedientes: ${formData.value.expedientes}` +
          `Comentario: Se ha incluido un expediente al trámite`,
        comentario: "Expediente",
        nombre: useAuthStore().$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} ha incluido un expediente al trámite ${props.informacionGeneral.nroRadicado}`,
        tramite: "Entes de Control",
      });
      emit("success", response.data.nodeId);
      getData(response.data.nodeId);
    }
  } catch (error) {
    toast.error("Ha ocurrido un error al guardar los datos");
  }
}

watch(() => crearComp.value?.success, (newValue) => {
  if (newValue) {
    incluirExp.value = true;
    crearExp.value = false;
    crearComp.value.success = crearComp.value?.success != null ? false : null;
    getData();
  }
});

watch(() => formData.value.dependencia, (newValue) => {
  // @ts-expect-error
  loadSeries(newValue.value)
  if (!expedienteInit.value) {
    formData.value.series = "";
  }
})

watch(() => formData.value.subSeries, (newValue) => {
  if (newValue) {
    loadTipoDocumental(newValue);
    loadExpedientes();
  }
  else if (formData.value.series && !subseriesRequired.value) {
    loadExpedientes();
  }  
  if (!expedienteInit.value) {
    formData.value.tipoDocumental = "";
    formData.value.expedientes = "";
    expedienteState.value = false;
  }
})

watch(() => formData.value.expedientes, (newValue) => {
  if (newValue == "") return;

  expedienteState.value = true;
  if (!expedienteInit.value)
    filterExpedientesAll.value =
      listadoExpedientesAll.value?.find((item) => {
        return item.titulo == newValue;
      }) ?? [];
})

watch(() => formData.value.buscarExp, (newValue) => {
  if (newValue) {
    expedienteState.value = true;
    if (!expedienteInit.value) {
      const val = listadoExpedientesAll.value?.find((item) => item.titulo == newValue);
      filterExpedientesAll.value = val || [];
    }
  }
})

const filterDependencias = (val: string, update: any) => {
  update(() => {
    if (val === '') {
      filteredDependencias.value = [...listadoDependencias.value]
    } else {
      const needle = val.toLowerCase()
      filteredDependencias.value = listadoDependencias.value.filter((dep) =>
        dep.label.toLowerCase().includes(needle)
      )
    }
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
  if (val == "") {
    update(() => {
      filteredTiposDocumentales.value = listadoTiposDocumentales.value;
    });
    return;
  }
  update(() => {
    filteredTiposDocumentales.value = listadoTiposDocumentales.value.filter(
      (option) => {
        return option.label.toLowerCase().includes(val.toLowerCase());
      }
    );
  });
};

const filterExpedientes = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      filteredExpedientes.value = listadoExpedientes.value;
    });
    return;
  }
  update(() => {
    filteredExpedientes.value = listadoExpedientes.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  });
};

</script>