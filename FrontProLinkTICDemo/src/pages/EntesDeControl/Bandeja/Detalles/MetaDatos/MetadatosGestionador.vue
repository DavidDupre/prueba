<template>
  <div class="[&>*]:tw-mb-4">
    <section>
      <q-form
        ref="metadataRef"
        @validation-error="errorForm()"
        @submit.prevent="saveForm"
      >
        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
                  Metadatos
                </h3>
              </div>
            </template>

            <div class="tw-bg-white tw-p-4" style="border-radius: 5px">
              <div class="row tw-p-2">
                <div class="col-sm tw-p-2">
                  <p class="tw-text-label tw-font-semibold">
                    Tipo de Documento Afectado*
                  </p>
                  <q-select
                    v-model="formData.idTipoDocumento"
                    :options="tipoDocumentoOpt"
                    label="Seleccione"
                    map-options
                    emit-value
                    dense
                    outlined
                    :rules="[inputRequired]"
                    :disable="isPorAprobarPorRevisar"
                  />
                </div>

                <div class="col-sm tw-p-2">
                  <p class="tw-text-label tw-font-semibold">
                    Número de Documento del Afectado*
                  </p>
                  <q-input
                    v-model="formData.nroDocumento"
                    label="Ingrese el número de documento"
                    dense
                    outlined
                    :rules="[
                      inputRequired,
                      (v) => maxLengthInput(15, v),
                      alphanumericbyEntes,
                    ]"
                    :disable="isPorAprobarPorRevisar"
                  />
                </div>

                <div class="col-sm tw-p-2">
                  <p class="tw-text-label tw-font-semibold">
                    Nombre del Afectado*
                  </p>
                  <q-input
                    v-model="formData.nombreAfectado"
                    label="Ingrese el nombre del afectado"
                    dense
                    outlined
                    :rules="[
                      inputRequired,
                      (v) => maxLengthInput(200, v),
                      alphanumericbyEntes,
                    ]"
                    :disable="isPorAprobarPorRevisar"
                  />
                </div>
              </div>
            </div>
            <div class="tw-bg-white tw-p-4" style="border-radius: 5px">
              <div class="row tw-p-2">
                <div
                  class="col-sm tw-p-2"
                  v-if="formData.idTipoDocumento !== 11"
                >
                  <p class="tw-text-label tw-font-semibold">Sexo*</p>
                  <q-select
                    v-model="formData.idSexo"
                    :options="genOptions"
                    label="Seleccione"
                    dense
                    outlined
                    map-options
                    emit-value
                    :rules="[
                      (val) => (val && !val?.idSexo) || 'Campo requerido',
                    ]"
                    :disable="isPorAprobarPorRevisar"
                  />
                </div>

                <div class="col-sm tw-p-2">
                  <p class="tw-text-label tw-font-semibold">
                    Tipo de Solicitud*
                  </p>
                  <q-select
                    v-model="formData.idTipoSolicitud"
                    :options="tipo_solicitudOpt"
                    label="Seleccione"
                    dense
                    outlined
                    map-options
                    emit-value
                    :rules="[
                      (val) =>
                        (val && !val.idTipoSolicitud) || 'Campo requerido',
                    ]"
                    :disable="isPorAprobarPorRevisar"
                  />
                </div>

                <div class="col-sm tw-p-2">
                  <p class="tw-text-label tw-font-semibold">Producto*</p>
                  <q-select
                    use-input
                    hide-selected
                    @filter="filterProducto"
                    fill-input
                    v-model="formData.idTipoProducto"
                    :options="filteredProducto"
                    label="Seleccione"
                    dense
                    outlined
                    map-options
                    emit-value
                    :rules="[
                      (val) =>
                        (val && !val?.idTipoProducto) || 'Campo requerido',
                    ]"
                    :disable="isPorAprobarPorRevisar"
                  />
                </div>
              </div>
            </div>
            <div class="tw-bg-white tw-p-4" style="border-radius: 5px">
              <div class="row tw-p-2">
                <div class="col-sm-4 tw-p-2">
                  <p class="tw-text-label tw-font-semibold">Favorabilidad*</p>
                  <q-select
                    v-model="formData.idFavorabilidad"
                    :options="favorabilidadOpt"
                    label="Seleccione"
                    dense
                    outlined
                    map-options
                    emit-value
                    :rules="[inputRequired]"
                    :disable="isPorAprobarPorRevisar"
                  />
                </div>

                <div class="col-sm tw-p-2">
                  <p class="tw-text-label tw-font-semibold">Tutela*</p>
                  <q-select
                    v-model="formData.tutela"
                    :options="tutelaOpt"
                    label="Seleccione"
                    dense
                    outlined
                    map-options
                    emit-value
                    :rules="[inputRequired]"
                    :disable="isPorAprobarPorRevisar"
                  />
                </div>

                <div class="col-sm-4 tw-p-2">
                  <p class="tw-text-label tw-font-semibold">Marcación*</p>
                  <q-select
                    use-input
                    hide-selected
                    @filter="filterMarcacion"
                    fill-input
                    v-model="formData.idMarcacion"
                    :options="filteredMarcacion"
                    label="Seleccione"
                    dense
                    outlined
                    map-options
                    emit-value
                    :rules="[inputRequired]"
                    :disable="isPorAprobarPorRevisar"
                    option-slot
                  >
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section>
                          <q-tooltip v-if="scope.opt.label.length > 50">
                            {{ scope.opt.label }}
                          </q-tooltip>
                          <div class="truncate-ellipsis">
                            {{ scope.opt.label }}
                          </div>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
              </div>
            </div>

            <!-- Metadatos Hu 124 -->
            <DynamicFields
              :listFields="listFields"
              :alfanumFields="alfanumFields"
              :booleanFields="booleanFields"
              @updateValue="handleUpdateValue"
            />
          </q-expansion-item>
        </q-card>
        <div class="tw-bg-white tw-mt-4 tw-p-10" style="border-radius: 5px">
          <h2 class="tw-font-bold tw-text-lg tw-mb-4">Fraude</h2>
          <div class="tw-grid tw-grid-cols-6 tw-gap-4">
              <div class="tw-col-span-6">
                <p class="tw-text-label tw-font-semibold">Fraude*</p>
                <q-toggle
                  v-model="formData.fraude"
                  :rules="[inputRequired]"
                  dense
                  outlined
                  class="tw-rounded-lg"
                />
              </div>
              <div class="tw-col-span-2" v-if="formData.fraude">
                <p class="tw-text-label tw-font-semibold">Motivo de Fraude</p>
                <q-select
                  v-model="formData.id_motivoFraude"
                  :options="motivosFraude"
                  emit-value
                  map-options
                  label="Seleccione"
                  dense
                  outlined
                  hide-selected
                  fill-input
                  use-input
                  class="tw-rounded-lg"
                  @filter="filterMotivos"
                />
              </div>
              <div class="tw-col-span-2" v-if="formData.fraude">
                <p class="tw-text-label tw-font-semibold">Tipo de Fraude</p>
                <q-select
                  v-model="formData.tipoFraude"
                  :options="fraudes"
                  label="Seleccione"
                  dense
                  outlined
                  class="tw-rounded-lg"
                  map-options
                />
              </div>
              <div class="tw-col-span-2" v-if="formData.fraude">
                <p class="tw-text-label tw-font-semibold">Modalidad de Fraude</p>
                <q-select
                  v-model="formData.id_modalidadFraude"
                  :options="modalidadFraude"
                  emit-value
                  map-options
                  label="Seleccione"
                  dense
                  outlined
                  hide-selected
                  fill-input
                  use-input
                  class="tw-rounded-lg"
                  @filter="filterModalidad"
                />
              </div>
              <div class="tw-col-span-6" v-if="formData.id_modalidadFraude == '90'">
                <p class="tw-text-label tw-font-semibold">Otras</p>
                <q-input
                type="textarea"
                  v-model="formData.otras"
                  rows="3"
                  dense
                  outlined
                  class="tw-rounded-lg"
                />
              </div>
              <div class="tw-col-span-3" v-if="formData.fraude">
                <p class="tw-text-label tw-font-semibold">Monto Reclamado</p>
                <q-input
                  v-model="formData.montoReclamado"
                  dense
                  outlined
                  :rules="[onlyNumbers]"
                  class="tw-rounded-lg"
                />
              </div>
              <div class="tw-col-span-3" v-if="formData.fraude">
                <p class="tw-text-label tw-font-semibold">Monto Reconocido</p>
                <q-input
                  v-model="formData.montoReconocido"
                  dense
                  outlined
                  :rules="[onlyNumbers]"
                  class="tw-rounded-lg"
                />
              </div>
          </div>
        </div>

        <div
          class="justify-center tw-w-full tw-m-[10px] tw-mt-10 tw-mb-6 tw-flex tw-gap-4"
          v-if="!isPorAprobarPorRevisar"
        >
          <q-btn
            label="Cancelar"
            type="reset"
            style="width: 240px; height: 40px"
            text-color="black"
            color="accent"
            class="tw-rounded-xl"
            @click="() => (showCancelModal = true)"
          />
          <q-btn
            type="submit"
            label="Guardar"
            text-color="white"
            style="width: 240px; height: 40px"
            color="primary"
            class="tw-rounded-xl tw-btn tw-p-2"
          />
        </div>
        <Modal
          v-model:model-value="showCancelModal"
          title="¡Espera un momento!"
          text="Al cancelar el proceso perderá los datos
          ingresados en el formulario, ¿desea realizar la acción?"
          :is-success="false"
          textButtonCancel="No"
          cancel-button
          @handleAccept="resetForm"
          text-button="Si"
          @close-modal="() => (showCancelModal = false)"
        />
      </q-form>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { condicionEspecialOptions, genOptions } from "src/constantes/options";
import { computed, ref, onMounted, defineProps, withDefaults, Ref } from "vue";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import {
  inputRequired,
  onlyNumbers,
  maxLengthInput,
  alphanumericbyEntes,
} from "src/helpers/validations";
import { useAuthStore } from "src/stores/auth.store";
import Modal from "src/components/Modal/Modal.vue";
import { SelectInput } from "src/interfaces";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { InfoGeneral } from "../types";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";

const props = defineProps<{
  informacionGeneral: InfoGeneral;
  metadatos: any;
}>();
const emit = defineEmits(["getInformacionGeneral"]);

const route = useRoute();
const ente_id = route.params.id;

const q = useQuasar();
const metadataRef = ref(null);
const metadataId = ref(null);
const tipoDocumentoOpt = ref([]);
const tipo_solicitudOpt = ref([]);
const favorabilidadOpt = ref([]);
const showCancelModal = ref(false);
const modalidadFraude = ref([]);
const allModalidadFraude = ref([]);
const motivosFraude = ref([]);
const allMotivosFraude = ref([]);
const marcacionOpt = ref([]);
const tipoProductoOptions = ref([]);
const filteredMarcacion: Ref<SelectInput[]> = ref([]);
const filteredProducto: Ref<SelectInput[]> = ref([]);

const formData = ref({
  id: null,
  idTipoDocumento: null,
  nroDocumento: null,
  nombreAfectado: null,
  idSexo: null,
  idTipoSolicitud: null,
  idTipoProducto: null,
  idFavorabilidad: null,
  tutela: null,
  idMarcacion: null,
  fraude: false,
  id_motivoFraude: null,
  tipoFraude: null,
  id_modalidadFraude: null,
  otras: null,
  montoReclamado: null,
  montoReconocido: null,
});

const fraudes = [
  "Interno",
  "Externo",
]

const tutelaOpt = ref([
  {
    label: "Si",
    value: true,
  },
  {
    label: "No",
    value: false,
  },
]);

const listFields = ref([]);
const alfanumFields = ref([]);
const booleanFields = ref([]);

const isPorAprobarPorRevisar = computed(() =>
  ["por aprobar", "por revisar", "aprobado"].includes(
    props.informacionGeneral.estado.estado.toLowerCase()
  )
);

async function getModalidadFraude(){
  try {
    const { data } = await sgdeaAxios.get("/smart-controller/modalidad-fraude");
    const formattedData = data
      .sort((a, b) => a.descripcion.localeCompare(b.descripcion))
      .map(({ descripcion, codigo }) => {
        return {
          label: descripcion,
          value: codigo,
        };
      });
    allModalidadFraude.value = formattedData;
    modalidadFraude.value = formattedData;
  } catch (error) {
    console.error(error);
  }
}

async function getMotivoFraude() {
  try {
    const { data } = await sgdeaAxios.get("/smart-controller/motivo-fraude");
    const formattedData = data
      .sort((a, b) => a.descripcion.localeCompare(b.descripcion))
      .map(({ descripcion, codigo }) => ({
        label: descripcion,
        value: codigo,
      }));

    motivosFraude.value = formattedData;
    allMotivosFraude.value = formattedData;
  } catch (error) {
    console.error(error);
  }
}

function filterMotivos(val, update) {
  if (val === '') {
    update(() => motivosFraude.value = [...allMotivosFraude.value]);
    return;
  }

  const needle = val.toLowerCase();

  update(() => {
    const filteredOptions = allMotivosFraude.value.filter(
      item => item.label.toLowerCase().includes(needle)
    );
    motivosFraude.value = filteredOptions;
  });
}

function filterModalidad(val, update) {
  if (val === '') {
    update(() => modalidadFraude.value = [...allModalidadFraude.value]);
    return;
  }

  const needle = val.toLowerCase();

  update(() => {
    const filteredOptions = allModalidadFraude.value.filter(
      item => item.label.toLowerCase().includes(needle)
    );
    modalidadFraude.value = filteredOptions;
  });
}

async function filterListsMetadatos() {
  listFields.value = await props.metadatos.filter(
    (it) => it.metadatoConOpciones?.metadato?.tipoDato?.id === 2
  );
  alfanumFields.value = await props.metadatos.filter(
    (it) => it.metadatoConOpciones?.metadato?.tipoDato?.id === 1
  );
  booleanFields.value = await props.metadatos.filter(
    (it) => it.metadatoConOpciones?.metadato?.tipoDato?.id === 3
  );
}

const getMetadataByEnteControlId = () => {
  sgdeaAxios
    .get(`api/entes/getMetadatosByEnteControlId/${ente_id}`)
    .then((res) => {
      metadataRef.value.reset();
      metadataId.value = res.data.id;
      setMetadata(res.data);
    })
    .catch((error) => {
      setMetadataFromGeneral();
    });
};

const getTipoDocumento = () => {
  sgdeaAxios
    .get(`/api/entes/listadoTipoIdentificacion`)
    .then((response) => {
      tipoDocumentoOpt.value = response.data
        .filter((tipo) => tipo.nombre !== "Ninguno")
        .map(({ nombre, id }) => ({ label: nombre, value: id }));
    })
    .catch((error) => {
      console.error("errorEntes", error);
    });
};

const getTipoSolicitud = () => {
  sgdeaAxios
    .get(`api/entes/tipos-solicitud`)
    .then((res) => {
      tipo_solicitudOpt.value = res.data.map(({ id, nombre }) => ({
        label: nombre,
        value: id,
      }));
    })
    .catch((error) => {
      console.error("errorTipoSolicitud", error);
    });
};

const getProducto = () => {
  sgdeaAxios
    .get(`pqrd/listadoProductosPQRD`)
    .then((res) => {
      tipoProductoOptions.value = res.data.map(({ id, nombre }) => ({
        label: nombre,
        value: id,
      }));
      filteredProducto.value = [...tipoProductoOptions.value];
    })
    .catch((error) => {
      console.error("errorProductos", error);
    });
};

const getFavorabilidad = () => {
  sgdeaAxios
    .get(`api/entes/listadoFavorabilidad`)
    .then((res) => {
      favorabilidadOpt.value = res.data
        .map(({ id, nombre }) => ({ label: nombre, value: id }))
        .sort((a, b) => a.label.localeCompare(b.label));
    })
    .catch((error) => {
      console.error("errorFavorabilidad", error);
    });
};

const getMarcacion = () => {
  sgdeaAxios
    .get(`api/entes/listadoMarcacion`)
    .then((res) => {
      marcacionOpt.value = res.data.map(({ id, nombre }) => ({
        label: nombre,
        value: id,
      }));
      filteredMarcacion.value = [...marcacionOpt.value];
    })
    .catch((error) => {
      console.error("errorMarcacion", error);
    });
};

const setMetadata = (data: any) => {
  metadataId.value = data.id;
  formData.value = {
    idFavorabilidad:
      favorabilidadOpt.value.find(
        (option) => option.label == data.favorabilidad
      )?.value || null,
    idMarcacion:
      marcacionOpt.value.find((option) => option.label == data.marcacion)
        ?.value || null,
    tutela: data.favorabilidad && data.marcacion ? data.tutelas : null,
    idTipoSolicitud: data.tipoSolicitud.id,
    idTipoDocumento: tipoDocumentoOpt.value.find((option) => {
      return (
        option.label.toLowerCase() ==
        data.enteControl.tipoDocumentoAfectado.toLowerCase()
      );
    })?.value,
    idTipoProducto: data.tipoProducto.id,
    nroDocumento: data.enteControl.nroDocumentoAfectado,
    nombreAfectado: data.enteControl.nombreAfectado,
    idSexo: data.genero.id,
    id: metadataId.value,
    fraude: data.fraude || false,
    id_motivoFraude: data.id_motivoFraude || "",
    tipoFraude: data.tipoFraude || "",
    id_modalidadFraude: data.id_modalidadFraude || "",
    otras: data.otras || "",
    montoReclamado: data.montoReclamado || "",
    montoReconocido: data.montoReconocido || "",
  };
};

const setMetadataFromGeneral = () => {
  const { informacionAfectado, informacionSolicitud } =
    props.informacionGeneral;

  const idTipoDocumento = tipoDocumentoOpt.value.find((option) => {
    return (
      option.label.toLowerCase() ==
      informacionAfectado.tipoDocumentoAfectado.toLowerCase()
    );
  });

  const idTipoSolicitud = tipo_solicitudOpt.value.find((option) => {
    return (
      option.label.toLowerCase() ==
      informacionSolicitud?.tipoSolicitud.toLowerCase()
    );
  });

  const idTipoProducto = tipoProductoOptions.value.find((option) => {
    return (
      option.label.toLowerCase() == informacionSolicitud?.producto.toLowerCase()
    );
  });

  const idSexo = genOptions.find((option) => {
    return (
      option.label.toLowerCase() == informacionAfectado?.sexo.toLowerCase()
    );
  });

  formData.value = {
    nroDocumento: informacionAfectado?.numeroDocumentoAfectado,
    nombreAfectado: informacionAfectado?.nombresAfectado,
    idTipoDocumento: idTipoDocumento?.value,
    idTipoSolicitud: idTipoSolicitud?.value,
    idTipoProducto: idTipoProducto?.value,
    idSexo: idSexo?.value,
    idFavorabilidad: null,
    id: metadataId.value,
    idMarcacion: null,
    tutela: null,
    fraude: false,
    id_motivoFraude: null,
    tipoFraude: null,
    id_modalidadFraude: null,
    otras: null,
    montoReclamado: null,
    montoReconocido: null,
  };
};

const errorForm = () => {
  toast.error(
    "Para continuar, asegúrese de que todos los campos requeridos estén completos."
  );
};

const saveForm = () => {
  if (formData.value.idTipoDocumento === 10) formData.value.idSexo = 1;
  let data = {
    ...formData.value,
    enteId: Number(ente_id),
    usuario: useAuthStore().$state.userInfo.name,
  };
  sgdeaAxios
    .post(`/api/entes/guardarMetadatosGestionar`, data)
    .then((res) => {
      newTrazabilidad();
      emit("getInformacionGeneral");
      toast.success("Metadatos ingresados correctamente.");
    })
    .catch((error) => {
      console.error("errorSaveMetadata", error);
    });
};

const resetForm = () => {
  location.reload();
  showCancelModal.value = false;
};

const newTrazabilidad = async () => {
  const status = formData.value?.id ? "actualizado" : "guardado";

  await crearTrazabilidad({
    proceso: `ENTC${props.informacionGeneral.id}`,
    secuencia: props.informacionGeneral.nroRadicado,
    estado: props.informacionGeneral.estado.estado,
    descripcion: `Usuario: ${useAuthStore().$state.userInfo.name}, Ha ${status} los metadatos del radicado`,
    comentario: "Metadatos",
    nombre: useAuthStore().$state.userInfo.name,
    accion: `Se han ${status} los metadatos del radicado`,
    tramite: "Entes de Control",
  });
};

const filterMarcacion = (
  val: string,
  update: (callback: () => void) => void
) => {
  update(() => {
    if (val == "") return (filteredMarcacion.value = marcacionOpt.value);
    filteredMarcacion.value = marcacionOpt.value.filter((option) =>
      option.label.toLowerCase().includes(val.toLowerCase())
    );
  });
};

const filterProducto = (
  val: string,
  update: (callback: () => void) => void
) => {
  update(() => {
    if (val == "") return (filteredProducto.value = tipoProductoOptions.value);
    filteredProducto.value = tipoProductoOptions.value.filter((option) =>
      option.label.toLowerCase().includes(val.toLowerCase())
    );
  });
};

onMounted(() => {
  getTipoDocumento();
  getTipoSolicitud();
  getFavorabilidad();
  getMarcacion();
  getProducto();
  filterListsMetadatos();
  getMotivoFraude();
  getModalidadFraude();

  setTimeout(() => {
    getMetadataByEnteControlId();
  }, 100);
});
</script>

<style scoped lang="scss">
.truncate-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 450px; /* Ajusta el ancho según lo necesites */
}
</style>
