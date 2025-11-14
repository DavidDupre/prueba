<template>
  <div class="[&>*]:tw-mb-4">
    <section>
      <q-form ref="asignarRef" greedy>
        <div class="tw-bg-white tw-p-10" style="border-radius: 5px">
          <h2 class="tw-font-bold tw-text-lg tw-mb-4">Metadatos</h2>
          <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
            <div class="tw-col-span-3">
              <p class="tw-text-label tw-font-semibold">Tipología de PQRD*</p>
              <!-- <q-input
                v-if="
                  isDefensor ||
                  (rolUser && formData.tipoPQRD === 'PQRD Express') ||
                  formData.tipoPQRD === 7 ||
                  formData.tipoPQRD === 'Queja' ||
                  formData.tipoPQRD === 'Reclamo'
                "
                outlined
                :disable="isDefensor"
                v-model="formData.tipoPQRD"
              /> -->
              <q-select
                v-model="formData.tipoPQRD"
                :options="tiposPQRD"
                :rules="[inputRequired]"
                emit-value
                label="Seleccione"
                dense
                outlined
                class="tw-rounded-lg"
                map-options
                :disable="
                  isDisabled ||
                  formData.tipoPQRD === 'PQRD Express' ||
                  formData.tipoPQRD === 7 ||
                  formData.tipoPQRD === 'Queja' ||
                  formData.tipoPQRD === 'Reclamo'
                "
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="tw-col-span-3">
              <p class="tw-text-label tw-font-semibold">Procesos</p>
              <q-input
                v-if="isDefensor"
                outlined
                :disable="isDefensor"
                v-model="formData.categoria"
              />
              <q-select
                v-else
                :disable="isDefensor"
                v-model="formData.categoria"
                :options="categorias"
                emit-value
                label="Seleccione"
                dense
                outlined
                class="tw-rounded-lg"
                map-options
                :rules="[rolUser && validarCategorias ? inputRequired : null]"
                @update:model-value="getCausasRaiz"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
          <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
            <div class="tw-col-span-3">
              <p class="tw-text-label tw-font-semibold">Causa Raíz</p>
              <q-input
                v-if="isDefensor"
                outlined
                :disable="isDefensor"
                v-model="formData.causaRaiz"
              />
              <q-select
                v-else
                v-model="formData.causaRaiz"
                :options="causasRaiz"
                :rules="[rolUser && validarCategorias ? inputRequired : null]"
                emit-value
                label="Seleccione"
                dense
                outlined
                class="tw-rounded-lg"
                map-options
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="tw-col-span-3" v-if="rolUser || isDefensor">
              <p class="tw-text-label tw-font-semibold">Favorabilidad*</p>
              <q-select
                v-model="formData.favorabilidad"
                :options="favorabilidad"
                :rules="[inputRequired]"
                emit-value
                label="Seleccione"
                dense
                outlined
                class="tw-rounded-lg"
                map-options
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
          <div
            class="tw-col-span-3"
            v-if="rolUser"
          >
            <p class="tw-text-label tw-font-semibold">Compromisos Próximos*</p>
            <q-select
              v-model="formData.compromisos"
              :options="[
                { label: 'Si', value: true },
                { label: 'No', value: false },
              ]"
              :rules="[inputRequired]"
              emit-value
              label="Seleccione"
              dense
              outlined
              class="tw-rounded-lg"
              map-options
              :disable="isDisabled01"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
            <div class="tw-col-span-3" v-if="rolUser && !isDefensor">
              <p class="tw-text-label tw-font-semibold">Lengua Nativa*</p>
              <q-select
                v-model="formData.lengua"
                :options="[
                  { label: 'Si', value: true },
                  { label: 'No', value: false },
                ]"
                :rules="[inputRequired]"
                emit-value
                label="Seleccione"
                dense
                outlined
                class="tw-rounded-lg"
                map-options
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="tw-col-span-3" v-if="rolUser && !isDefensor">
              <p class="tw-text-label tw-font-semibold">
                Empresa del afectado*
              </p>
              <q-select
                v-model="formData.empresa"
                :options="empresa"
                :rules="[inputRequired]"
                emit-value
                label="Seleccione"
                dense
                outlined
                class="tw-rounded-lg"
                map-options
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
          <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
            <div
              class="tw-col-span-3"
              v-if="rolUser && isVpTecnica && !isDefensor"
            >
              <p class="tw-text-label tw-font-semibold">Contactabilidad</p>
              <q-select
                v-model="formData.contactabilidad"
                :options="contactabilidad"
                :rules="[]"
                emit-value
                label="Seleccione"
                dense
                outlined
                class="tw-rounded-lg"
                map-options
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div v-if="rolUser && isVpTecnica" class="tw-col-span-3">
              <p class="tw-text-label tw-font-semibold">Proveedor*</p>
              <q-select
                v-model="formData.proveedor"
                :options="[]"
                :rules="[]"
                emit-value
                label="Seleccione"
                dense
                outlined
                class="tw-rounded-lg"
                map-options
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
          <!-- <div class="tw-col-span-3 " v-if="rolUser && !isDefensor">
                  <p class="tw-text-label tw-font-semibold">Producto*</p>
                  <q-select v-model="formData.producto" :options="producto" :rules="[inputRequired]" emit-value
                    label="Seleccione" dense outlined class="tw-rounded-lg" map-options>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div> -->

          <div class="col-sm-6 tw-p-2" v-if="isAdminOrDefensor">
            <p class="tw-text-label tw-font-semibold">Rectificación *</p>
            <q-select
              v-model="formData.rectificacion"
              :options="rectificacion"
              :rules="[inputRequired]"
              emit-value
              label="Seleccione"
              dense
              outlined
              class="tw-rounded-lg"
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-sm-6 tw-p-2" v-if="isAdminOrDefensor">
            <p class="tw-text-label tw-font-semibold">Prórroga *</p>
            <q-select
              v-model="formData.prorroga"
              :options="
                isDefensor && props.pqrdData.estado.estado == 'Aprobado'
                  ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                  : prorroga
              "
              :rules="[inputRequired]"
              emit-value
              label="Seleccione"
              dense
              outlined
              class="tw-rounded-lg"
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-sm-6 tw-p-2" v-if="isAdminOrDefensor">
            <p class="tw-text-label tw-font-semibold">Marcación *</p>
            <q-select
              v-model="formData.marcacion"
              :options="marcacion"
              :rules="[inputRequired]"
              emit-value
              label="Seleccione"
              dense
              outlined
              class="tw-rounded-lg"
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Hu 124 COR -->
          <div v-if="!isAsignador">
            <DynamicFields
              :listFields="listFields"
              :alfanumFields="alfanumFields"
              :booleanFields="booleanFields"
              @updateValue="handleUpdateValue"
            />
          </div>
        </div>
        <div v-if="auth.userInfo.role === 'Gestionador'" class="tw-bg-white tw-mt-4 tw-p-10" style="border-radius: 5px">
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
                  v-model="formData.motivoFraude"
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
                  v-model="formData.modalidadFraude"
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
              <div class="tw-col-span-6" v-if="formData.modalidadFraude == '90'">
                <p class="tw-text-label tw-font-semibold">Otras</p>
                <q-input
                type="textarea"
                  v-model="formData.tipoFraudeOtras"
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
          v-if="!isAsignador"
          class="justify-center tw-w-full tw-m-[10px] tw-mt-10 tw-mb-6 tw-flex tw-gap-4"
        >
          <q-btn
            label="Cancelar"
            type="reset"
            style="width: 240px; height: 40px"
            text-color="black"
            color="accent"
            class="tw-rounded-xl"
            @click="() => (showModal = true)"
          />
          <q-btn
            label="Guardar"
            text-color="white"
            @click="save"
            style="width: 240px; height: 40px"
            color="primary"
            class="tw-rounded-xl tw-btn"
          />
        </div>
      </q-form>
    </section>
  </div>

  <Modal
    v-model:model-value="showModal"
    title="¡Espera un momento!"
    text="Al cancelar el proceso perderá los datos
  ingresados en el formulario, ¿desea realizar la acción?"
    :is-success="false"
    textButtonCancel="No"
    cancel-button
    @handleAccept="
      showModal = false;
      resetForm();
    "
    text-button="Si"
    @close-modal="() => (showModal = false)"
  />
</template>

<script lang="ts" setup>
import { inputRequired, onlyNumbers } from "src/helpers/validations";
import { Ref, onMounted, ref, computed } from "vue";
import { sgdeaAxios } from "../../../services";
import { toast } from "src/helpers/toast";
import Modal from "../../../components/Modal/Modal.vue";
import DynamicFields from "src/components/metadtos/DynamicFields/DynamicFields.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth.store";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import moment from "moment";
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";

const props = withDefaults(
  defineProps<{
    pqrdData: any;
    metadatos: any;
    isAsignador: boolean;
  }>(),
  {
    isAsignador: true,
  }
);

const auth = useAuthStore();
const rolUser =
  auth.userInfo.role.toLowerCase().includes("gestionador") ||
  auth.userInfo.role.toLowerCase().includes("administrador") ||
  auth.userInfo.role.toLowerCase().includes("defensor") ||
  auth.userInfo.role.toLowerCase().includes("aprobador");
const isAdminOrDefensor =
  auth.userInfo.role.toLowerCase().includes("administrador") ||
  auth.userInfo.role.toLowerCase().includes("defensor");
const isDefensor = auth.userInfo.role.toLowerCase().includes("defensor");
const stateMeta = ref();
const pqrdDef = ref();
const showModal = ref(false);
const asignarRef = ref();
const tiposPQRD = ref([]);
const categorias = ref([]);
const causasRaiz = ref([]);
const favorabilidad = ref([]);
const rectificacion = ref([]);
const marcacion = ref([]);
const prorroga = ref([]);
const empresa = ref([]);
const listFields = ref([]);
const alfanumFields = ref([]);
const booleanFields = ref([]);
const contactabilidad = ref([]);
const proveedor = ref([]);
const producto = ref([]);
const router = useRouter();
const isVpTecnica = ref(false);
const modalidadFraude = ref([]);
const motivosFraude = ref([]);
const validarCategorias = ref(false);
const formData: Ref<any> = ref({
  id: undefined,
  tipoPQRD: "",
  categoria: "",
  causaRaiz: "",
  favorabilidad: "",
  compromisos: "",
  empresa: "",
  lengua: false,
  contactabilidad: "",
  proveedor: "",
  producto: "",
  rectificacion: "",
  prorroga: "",
  marcacion: "",
  fraude: false,
  motivoFraude: "",
  tipoFraude: "",
  modalidadFraude: "",
  tipoFraudeOtras: "",
  montoReclamado: "",
  montoReconocido: "",
});

const vicePresidenciaTecnica = [
  "Pago de Reembolso",
  "Solicitud de medicamentos",
  "Suscripción de Pólizas de Vida",
  "Traslado para prestación de servicio",
  "Aporte de Pruebas Medicina Laboral radicado SAL-XXXXX",
  "Pago de Incapacidad",
  "Autorización médica",
  "Controversia",
];

const dependenciasVpTecnica = [
  "GERENCIA DE INDEMNIZACIONES",
  "GERENCIA MÉDICA",
  "GERENCIA DE ACTUARIA",
  "GERENCIA TÉCNICA DE VIDA",
];

const fraudes = [
  "Interno",
  "Externo",
]

const emit = defineEmits(["successSave", "updateData", "success"]);

const isDisabled01 = computed(() => {
  return (
    props.pqrdData.numeroAprobaciones > 0 && formData.value.compromisos === true
  );
});

onMounted(async () => {
  await initData();

  if (!stateMeta.value) {
    formData.value.tipoPQRD = props.pqrdData.informacionSolicitud
      .tipologiaEntity
      ? props.pqrdData.informacionSolicitud.tipologiaEntity.id
      : null;
    formData.value.producto = props.pqrdData.informacionSolicitud.productoEntity
      ? producto.value.find(
          (x) =>
            x.value == props.pqrdData.informacionSolicitud.productoEntity.id
        )?.value
      : "";
  }

  const user = auth?.$state?.userInfo;
  isVpTecnica.value = user.relations?.some((it) =>
    dependenciasVpTecnica.includes(it.dependencia)
  );
});

async function initData() {
  await getTiposPQRD();
  await getCategorias();
  await getFavorabilidad();
  await getRectificacion();
  await getProrroga();
  await getMarcacion();
  await getContactabilidad();
  await getProducto();
  await getEmpresas();
  await filterListsMetadatos();
  await getModalidadFraude();
  await getMotivoFraude();

  try {
    if (isDefensor) {
      await sgdeaAxios
        .get("pqrd/getMetadatosDefensorByPqrdId?pqrdId=" + props.pqrdData.id)
        .then(async (metadato) => {
          stateMeta.value = metadato.data;
          if (metadato.status == 200 || metadato.status == 201) {
            // formData.value.id = metadato.data.id;
            formData.value.tipoPQRD =
              metadato.data.tipologia.id == 7
                ? metadato.data.tipologia.nombre
                : metadato.data.tipologia.id;
            formData.value.categoria = metadato.data.categoria.nombre || "";
            formData.value.favorabilidad =
              metadato.data.favorabilidad?.id || "";
            formData.value.compromisos =
              metadato.data?.compromisosProximos || "";
            formData.value.rectificacion =
              metadato.data.rectificacion?.id || "";
            formData.value.marcacion = metadato.data.marcacion?.id || "";
            formData.value.causaRaiz = metadato.data.causaRaiz.nombre;
          }
        });
    } else {
      try {
        const { data: metadato, status } = await sgdeaAxios.get(
          "pqrd/getMetadatosByPqrdId?pqrdId=" + props.pqrdData.id
        );
        stateMeta.value = metadato;

        if (status == 200 || status == 201) {
          formData.value.id = metadato.id;
          formData.value.tipoPQRD = metadato.tipologiaPqrd.id;
          formData.value.categoria = metadato.categoria?.id || "";
          formData.value.favorabilidad = metadato.favorabilidad?.id || "";
          formData.value.compromisos = metadato?.compromisosProximos || "";
          formData.value.empresa = metadato.empresaDelAfectado?.idEmpresa || "";
          formData.value.lengua = metadato?.lenguaNativa || false;
          formData.value.contactabilidad = metadato.contactabilidad?.id || "";
          formData.value.producto = metadato.producto?.id || "";
          if (formData.value.categoria !== "") {
            await getCausasRaiz(formData.value.categoria);
            formData.value.causaRaiz = metadato.causaRaiz
              ? metadato.causaRaiz.id
              : "";
          }
          formData.value.fraude = metadato.fraude || false;
          formData.value.motivoFraude = metadato.motivoFraude?.codigo || "";
          formData.value.tipoFraude = metadato.tipoFraude || "";
          formData.value.modalidadFraude = metadato.modalidadFraude?.codigo || "";
          formData.value.tipoFraudeOtras = metadato.otras || "";
          formData.value.montoReclamado = metadato.montoReclamado || "";
          formData.value.montoReconocido = metadato.montoReconocido || "";
        }
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    await getTiposPQRD();
    await getCategorias();
    await getFavorabilidad();
    await getContactabilidad();
    await getProducto();
    await getEmpresas();
    await filterListsMetadatos();
    stateMeta.value = null;
  }
}

defineExpose({
  save,
  asignarRef,
});

async function filterListsMetadatos() {
  if (Array.isArray(props.metadatos)) {
    listFields.value = props.metadatos?.filter(
      (it) => it.metadatoConOpciones?.metadato?.tipoDato?.id === 2
    );
    alfanumFields.value = props.metadatos?.filter(
      (it) => it.metadatoConOpciones?.metadato?.tipoDato?.id === 1
    );
    booleanFields.value = props.metadatos?.filter(
      (it) => it.metadatoConOpciones?.metadato?.tipoDato?.id === 3
    );
  }
}

const handleUpdateValue = ({ arr }) => {

};

function isOver24Hr() {
  if (
    moment().diff(
      moment(props.pqrdData.fechaRadicacion, "DD/MM/YYYY hh:mm a"),
      "hours"
    ) > 24
  ) {
    return true;
  }
  return false;
}

const isDisabled = computed(() => {
  return (
    props.pqrdData.informacionSolicitud.tipologia === "Queja" ||
    props.pqrdData.informacionSolicitud.tipologia === "Reclamo"
  );
});

const allModalidadFraude = ref([]);

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

const allMotivosFraude = ref([]);


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

async function getTiposPQRD() {
  try {
    const { data } = await sgdeaAxios.get(`pqrd/listadoTipologia`);
    tiposPQRD.value = data
      .filter(
        (item) => item.nombre.toLowerCase() !== "derecho de petición verbal"
      )
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
      .map(({ nombre, id }) => {
        return {
          label: nombre,
          value: id,
        };
      });

    if (
      isOver24Hr() &&
      !(
        props.pqrdData.informacionSolicitud.tipologia === "Queja" ||
        props.pqrdData.informacionSolicitud.tipologia === "Reclamo"
      )
    ) {
      tiposPQRD.value = tiposPQRD.value.filter(
        (item) =>
          item.label !== "Queja" &&
          item.label !== "PQRD Express" &&
          item.label !== "PQRD Express" &&
          item.label !== "Reclamo"
      );
    }
  } catch (error) {
    console.error(error);
  }
}

async function getCategorias() {
  validarCategorias.value = auth?.$state?.userInfo?.oficina ? true : false;
  try {
    if (auth?.$state?.userInfo?.oficina) {
      const oficina = auth?.$state?.userInfo?.oficina;
      const { data } = await sgdeaAxios.get(
        `pqrd/listadoCategorias/${oficina}?idOficina=${oficina}`
      );
      categorias.value = data
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
        .map(({ nombre, id }) => {
          return {
            label: nombre,
            value: id,
          };
        });
      validarCategorias.value = categorias.value.length == 0 ? false : true;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
  }
}

async function getCausasRaiz(idCategoria: number) {
  try {
    formData.value.causaRaiz = "";
    const { data } = await sgdeaAxios.get(
      "pqrd/listadoCausaRaiz/" + idCategoria
    );
    causasRaiz.value = data
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
      .map(({ nombre, id }) => {
        return {
          label: nombre,
          value: id,
        };
      });
  } catch (error) {
    console.error(error);
  }
}

async function getFavorabilidad() {
  try {
    const { data } = await sgdeaAxios.get("/pqrd/listadoFavorabilidad");
    favorabilidad.value = data
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
      .map(({ nombre, id }) => {
        return {
          label: nombre,
          value: id,
        };
      });
  } catch (error) {
    console.error(error);
  }
}

async function getRectificacion() {
  try {
    const { data } = await sgdeaAxios.get("/pqrd/listadoRectificacion");
    rectificacion.value = data
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
      .map(({ nombre, id }) => {
        return {
          label: nombre,
          value: id,
        };
      });
  } catch (error) {
    console.error(error);
  }
}

async function getProrroga() {
  try {
    const { data } = await sgdeaAxios.get("/pqrd/listadoProrroga");
    prorroga.value = data
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
      .map(({ nombre, id }) => {
        return {
          label: nombre,
          value: id,
        };
      });
  } catch (error) {
    console.error(error);
  }
}

async function getMarcacion() {
  try {
    const { data } = await sgdeaAxios.get("/pqrd/listadoMarcacion");
    marcacion.value = data
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
      .map(({ nombre, id }) => {
        return {
          label: nombre,
          value: id,
        };
      });
  } catch (error) {
    console.error(error);
  }
}

async function getEmpresas() {
  try {
    const { data } = await sgdeaAxios.get(
      "/pqrd/listadoEmpresasPorEstado?estado=true"
    );
    empresa.value = data
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
      .map(({ nombre, idEmpresa }) => {
        return {
          label: nombre,
          value: idEmpresa,
        };
      });
  } catch (error) {
    console.error(error);
  }
}

async function getContactabilidad() {
  try {
    const { data } = await sgdeaAxios.get("/pqrd/listadoContactabilidad");
    contactabilidad.value = data
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
      .map(({ nombre, id }) => {
        return {
          label: nombre,
          value: id,
        };
      });
  } catch (error) {
    console.error(error);
  }
}

async function getProducto() {
  try {
    const { data } = await sgdeaAxios.get("/pqrd/listadoProductosPQRD");
    producto.value = data
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
      .map(({ nombre, id }) => {
        return {
          label: nombre,
          value: id,
        };
      });
  } catch (error) {
    console.error(error);
  }
}

async function resetForm() {
  await initData();
  location.reload();
}

function aceptarModal() {}

async function save() {
  if (!(await asignarRef.value.validate())) {
    toast.error("Debe diligenciar los campos obligatorios");
    return false;
  }

  try {
    const url = isDefensor
      ? "pqrd/guardarMetadatosDefensor"
      : stateMeta.value || rolUser
      ? "pqrd/guardarMetadatosReasignar"
      : "pqrd/guardarMetadatosAsignar";
    const commonData = {
      id: formData.value.id,
      id_tipologiapqrd: formData.value.tipoPQRD,
      id_categoria: formData.value.categoria,
      id_causaRaiz: formData.value.causaRaiz,
      id_rectificacion: formData.value.rectificacion || "",
      id_prorroga: formData.value.prorroga || "",
      id_marcacion: formData.value.marcacion || "",
      id_pqrd: props.pqrdData.id,
      usuario: auth.userInfo.username,
      fraude: formData.value.fraude,
      id_motivoFraude: formData.value.motivoFraude,
      tipoFraude: formData.value.tipoFraude,
      id_modalidadFraude: formData.value.modalidadFraude,
      otras: formData.value.tipoFraudeOtras,
      montoReclamado: formData.value.montoReclamado,
      montoReconocido: formData.value.montoReconocido,
    };
    const userData = rolUser
      ? {
          id_favorabilidad: formData.value.favorabilidad,
          compromisos_proximos: formData.value.compromisos,
          lenguaNativa: formData.value.lengua,
          id_empresadelAfectado: formData.value.empresa,
          id_contactabilidad: formData.value.contactabilidad,
          id_producto: formData.value.producto,
        }
      : {};
    if (isDefensor) {
      pqrdDef.value = {
        pqrdId: props.pqrdData.id,
        tipologiaId:
          formData.value.tipoPQRD == "PQRD Express"
            ? 7
            : formData.value.tipoPQRD,
        categoriaId: stateMeta.value.categoria.id,
        causaRaizId: stateMeta.value.causaRaiz.id,
        favorabilidadId: formData.value.favorabilidad,
        rectificacionId: formData.value.rectificacion || "",
        prorrogaId: formData.value.prorroga || "",
        marcacionId: formData.value.marcacion || "",
        compromisosProximos: formData.value.compromisos,
        usuario: auth.userInfo.username,
      };
    }
    const response = await sgdeaAxios.post(
      url,
      isDefensor ? pqrdDef.value : { ...commonData, ...userData }
    );

    if (
      response.status === 200 ||
      response.status === 201 ||
      response.status === 204
    ) {
      if (url == "pqrd/guardarMetadatosAsignar") {
        const causaRaiz = formData.value.causaRaiz
          ? causasRaiz.value.find((i) => i.value === formData.value.causaRaiz)
              .label
          : "";
        const { data } = await sgdeaAxios.get(`pqrd/listadoTipologia`);
        const tipologia = data.find(
          (i) => i.id === formData.value.tipoPQRD
        ).nombre;
        const categoria = formData.value.categoria
          ? categorias.value.find((i) => i.value === formData.value.categoria)
              .label
          : "";
        await crearTrazabilidad({
          proceso: "PQRD" + props.pqrdData.id,
          secuencia: props.pqrdData.idRadicado,
          estado: props.pqrdData.estado.estado,
          descripcion: `Usuario: ${auth.userInfo.name} Tipología: ${tipologia} Procesos: ${categoria ?? "No registra"}
          Causa Raiz: ${causaRaiz ?? "No registra"}
          Detalle: Se han creado los metadatos de la PQRD`,
          comentario: "Adjunto",
          nombre: auth.$state.userInfo.name,
          accion: `${auth.$state.userInfo.name} ha creado los metadatos de la PQRD ${props.pqrdData.idRadicado}`,
          tramite:
            props.pqrdData.informacionSolicitud.tipologiaEntity?.id == 7
              ? "PQRD Express"
              : "PQRD",
        });
      }
      toast.success("Metadatos ingresados correctamente");

      emit("successSave");
      emit("success");
      aceptarModal();
    }
  } catch (error) {
    toast.error("Ha ocurrido un error.");
  }
}
</script>
