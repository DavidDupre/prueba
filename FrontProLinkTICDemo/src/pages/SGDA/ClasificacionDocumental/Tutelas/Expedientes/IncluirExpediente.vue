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
                  label="Inserte" dense :filter="filterDependencias" use-input fill-input hide-selected
                  :disable="isPorAprobar" />
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Series *</p>
                <q-select :options="filteredSeries" map-options emit-value outlined v-model="formData.series"
                  label="Inserte" dense :rules="[inputRequired]" @filter="filterSeries" use-input fill-input
                  @update:model-value="() => (expedienteInit = false)" hide-selected :readonly="expedienteInit"
                  :disable="isPorAprobar">
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
                  <p class="tw-text-label tw-font-semibold">Subseries<span v-if="hasSubseries"> *</span></p>
                <q-select :options="filteredSubSeries" map-options emit-value outlined v-model="formData.subSeries"
                  label="Inserte" dense @filter="filterSubSeries" use-input fill-input hide-selected
                  :readonly="expedienteInit" :disable="isPorAprobar" :rules="[dynamicRequired('subSeries')]">
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
                <p class="tw-text-label tw-font-semibold">Tipo documental<span v-if="hasSubseries"> *</span></p>
                <q-select :options="filteredTiposDocumentales" map-options emit-value outlined
                  v-model="formData.tipoDocumental" label="Inserte" dense :rules="[dynamicRequired('tipoDocumental')]"
                  @filter="filterTiposDocumental" use-input fill-input hide-selected :readonly="expedienteInit"
                  :disable="isPorAprobar">
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
                  hide-selected :readonly="expedienteInit" :disable="isPorAprobar">
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
              Expediente a asociar
            </h3>
            <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md" v-else>
              Expediente a asociar
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

  <crearExpediente ref="crearComp" v-if="crearExp" :tutelas-data="props.tutelasData"
    @success="emit('success'), loadExpediente($event)" />

  <Modal v-model:model-value="showModal" title="¡Espera un momento!" text="Al cancelar el proceso perderá los datos
  ingresados en el formulario, ¿desea realizar la acción?" :is-success="false" textButtonCancel="No" cancel-button
    @handleAccept="resetForm" text-button="Si" @close-modal="() => (showModal = false)" />
</template>

<script lang="ts" setup>
import { computed, onMounted, Ref, ref, watch } from "vue";
import { sgdeaAxios } from "src/services";
import { inputRequired } from "src/helpers/validations";
import Modal from "src/components/Modal/Modal.vue";
import { toast } from "src/helpers/toast";
import crearExpediente from "./crearExpediente.vue";
import { useAuthStore } from "src/stores/auth.store";
import { useLoadingStore } from "src/stores/loading.store";
import { SelectInput } from "src/interfaces";
import { crearTrazabilidad } from 'src/helpers/trazabilidad';
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

const props = withDefaults(
  defineProps<{
    tutelasData: any;
  }>(),
  {}
);

const isPorAprobar = computed(() => ['por aprobar'].includes(props.tutelasData.estado.toLowerCase()));
const showModal = ref(false);
const form = ref();
const listadoSeries: Ref<SelectInput[]> = ref([]);
const filteredSeries: Ref<SelectInput[]> = ref([]);
const listadoSubSeries: Ref<SelectInput[]> = ref([]);
const filteredSubSeries: Ref<SelectInput[]> = ref([]);
const listadoTiposDocumentales: Ref<SelectInput[]> = ref([]);
const filteredTiposDocumentales: Ref<SelectInput[]> = ref([]);
const listadoExpedientesAll: Ref<any> = ref([]);
const filterExpedientesAll: Ref<any> = ref({});
const listadoExpedientes: Ref<SelectInput[]> = ref([]);
const filteredExpedientes: Ref<SelectInput[]> = ref([]);
const listadoDependencias = ref()
const filteredDependencias = ref()
const expedienteState = ref(false);
const expedienteInit = ref(false);
const crearExp = ref(false);
const crearComp: Ref<any> = ref();
const incluirExp = ref(true);
const auth = useAuthStore();
const newNodeId = ref();

const emit = defineEmits(['validExp', 'success'])

onMounted(async () => {
  await getData();
});

const getData = async () => {
  try {
    await loadDependencias()
    await loadExpediente(newNodeId.value);
  } catch (error) {
    console.error(error);
  }

};


const loadExpediente = async (nodeId?) => {
  const { data: expediente } = await sgdeaAxios.get("/expediente/children", {
    // @ts-ignore
    params: { nodeId: nodeId || props.tutelasData.nodeId },
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

    formData.value.dependencia = listadoDependencias.value.find((e) => e.value === auth.userInfo.dependencia)
  } catch (error) {
    toast.error("Ha ocurrido un error al cargar las dependencias")
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

    listadoSeries.value = responseSeries.data.map((item) => {
      return {
        label: item.descripcion,
        value: item.idSeriesubserie,
        rawData: item
      };
    });

    filteredSeries.value = [...listadoSeries.value];
  } catch (error) {
    console.error(error);
  }
}

const hasSubseries = ref(false);
const selectedSerie = ref(null);

const loadSubseries = async (id) => {
  try {
    if (expedienteInit.value) return;

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

    listadoSubSeries.value = responseSubSeries.data.map((item) => {
      return {
        label: item.descripcion,
        value: item.idSeriesubserie,
      };
    });

    hasSubseries.value = responseSubSeries.data.length > 0;

    if (!hasSubseries.value) {
      formData.value.subSeries = "";
      formData.value.tipoDocumental = "";
      formData.value.expedientes = "";
      listadoTiposDocumentales.value = [];
      listadoExpedientes.value = [];
      listadoExpedientesAll.value = [];
      filteredTiposDocumentales.value = [];
      filteredExpedientes.value = [];
      expedienteState.value = false;

      await loadExpedientesWithSeriePadre();
    }

  } catch (error) {
    console.error("Error en loadSubseries:", error);
  }
};

const dynamicRequired = (fieldName: string) => {
  return (val) => {
    if (!hasSubseries.value) return true;
    if (!val) return `El campo ${fieldName} es requerido`;

    return true;
  };
};

const loadTipoDocumental = async (id) => {
  if (expedienteInit.value) return;
  const response = await sgdeaAxios.get(
    `tiposdocumentales/asignacion/serie/tipos_documentales`,
    {
      params: { serie: id },
    }
  );

  listadoTiposDocumentales.value = response.data.tiposDocumentalesAsociados.map(
    (e) => {
      let item = e.tipologiaDocumental;
      return {
        label: item.nombre,
        value: item.idTipologiaDocumental,
      };
    }
  );
};

const loadExpedientes = async () => {
  try {
    if (expedienteInit.value) return;
    const response = await sgdeaAxios.get(`/expediente`, {
      params: { idSubserie: formData.value.subSeries, modulo: 3 },
    });
    listadoExpedientesAll.value = response.data;
    listadoExpedientes.value = response.data.map((e) => {
      return {
        label: e.titulo,
        value: e.titulo,
      };
    });

  } catch (error) {
    console.error(error);

  }
};

const loadExpedientesWithSeriePadre = async () => {
  try {
    if (expedienteInit.value || !selectedSerie.value) {
      return;
    }

    const response = await sgdeaAxios.get(`/expediente`, {
      params: {
        idSubserie: null,
        modulo: 3,
        seriePadre: selectedSerie.value.idSeriesubserie
      },
    });

    listadoExpedientesAll.value = response.data;
    listadoExpedientes.value = response.data.map((e) => {
      return {
        label: e.titulo,
        value: e.titulo,
      };
    });

  } catch (error) {
    console.error("Error al cargar expedientes con seriePadre:", error);
  }
};

function resetForm() {
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
      nivelSeguridad: filterExpedientesAll.value.nivelSeguridad,
      creacion: false,
      nodeIdRad: props.tutelasData.nodeId,
      modulo: 3,
      radicado: props.tutelasData.idRadicado,
    };

    const response = await sgdeaAxios.post(`expediente/newpdate`, sendData);

    if (response.status === 200) {
      toast.success("Datos guardados exitosamente");
      await crearTrazabilidad({
        proceso: `TUT${props.tutelasData.idTutela}`,
        secuencia: props.tutelasData.idRadicado,
        estado: props.tutelasData.estado,
        nombre: auth.$state.userInfo.name,
        comentario: 'Se ha incluido el radicado a un expediente',
        descripcion: `Usuario: ${auth.$state.userInfo.name} \n` +
          `Descripción: Se ha incluido el radiado al expediente ${formData.value.expedientes}`,
        accion: `${auth.$state.userInfo.name} ha incluido el radicado al expediente ${formData.value.expedientes}`,
        tramite: "Tutela"
      })
      newNodeId.value = response.data.nodeId;
      emit("validExp")
      emit("success");
      loadExpediente(newNodeId.value);
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
})

watch(() => formData.value.dependencia, (newValue) => {
  // @ts-expect-error
  loadSeries(newValue.value)
  if (!expedienteInit.value) {
    formData.value.series = "";
  }
})

watch(() => formData.value.series, (newValue) => {
  if (newValue) {
    // Guardamos la serie seleccionada completa
    selectedSerie.value = listadoSeries.value.find(s => s.value === newValue)?.rawData;
    loadSubseries(newValue);
  }

  if (!expedienteInit.value) {
    formData.value.subSeries = "";
  }
});

watch(() => formData.value.subSeries, (newValue) => {
  loadTipoDocumental(newValue);
  loadExpedientes();
  if (!expedienteInit.value) {
    formData.value.tipoDocumental = "";
    formData.value.expedientes = "";
    expedienteState.value = false;
  }
})

watch(() => formData.value.expedientes, (newValue) => {
  if (newValue == "") {
    return;
  }

  expedienteState.value = true;
  if (!expedienteInit.value)
    filterExpedientesAll.value =
      listadoExpedientesAll.value?.find((item) => {
        return item.titulo == newValue;
      }) ?? [];
})

watch(() => formData.value.buscarExp, (newValue) => {
  expedienteState.value = true;
  if (!expedienteInit.value)
    filterExpedientesAll.value =
      listadoExpedientesAll.value?.find((item) => {
        return item.titulo == newValue;
      }) ?? [];
})

watch(() => formData.value.series, (newValue, oldValue) => {
  // Limpiamos los campos dependientes cuando cambia la serie
  listadoSubSeries.value = [];
  listadoTiposDocumentales.value = [];
  listadoExpedientes.value = [];
  listadoExpedientesAll.value = [];
  filteredSubSeries.value = [];
  filteredTiposDocumentales.value = [];
  filteredExpedientes.value = [];
  expedienteState.value = false;

  if (newValue) {
    loadSubseries(newValue);
  }
});

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
  if (listadoTiposDocumentales.value == null) {
  }
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
