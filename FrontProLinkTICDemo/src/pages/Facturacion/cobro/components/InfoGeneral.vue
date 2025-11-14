<template>
  <section>
    <template v-if="isEdit">
      <q-form ref="formValidate">
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <q-expansion-item
            expand-separator
            id="Datos generales"
            default-opened
          >
            <template v-slot:header>
              <div class="col row">
                <h2 class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">
                  Información Básica de Radicación
                </h2>
              </div>
            </template>

            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Dependencia *</label>
                  <q-select
                    v-model="form.dependencia"
                    input-debounce="0"
                    map-options
                    :options="optionsDependencias"
                    label="Seleccione"
                    dense
                    outlined
                    class="tw-rounded-lg"
                    :rules="[inputRequired]"
                    @update:model-value="(v) => (edited = true)"
                  >
                  </q-select>
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label"
                    >Responsable del Proceso (Asignador)</label
                  >
                  <q-select
                    v-model="form.responsable"
                    label="Seleccione"
                    input-debounce="0"
                    map-options
                    emit-value
                    :options="options"
                    dense
                    outlined
                    class="tw-rounded-lg"
                    @update:model-value="(v) => (edited = true)"
                  >
                  </q-select>
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Tipo de Trámite *</label>
                  <q-select
                    v-model="form.tipoTramite"
                    input-debounce="0"
                    label="Seleccione"
                    :options="tipoTramite"
                    dense
                    outlined
                    class="tw-rounded-lg"
                    :rules="[inputRequired]"
                    disable
                    @update:model-value="(v) => (edited = true)"
                  >
                  </q-select>
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Canal de Recepción *</label>
                  <q-select
                    v-model="form.canal"
                    input-debounce="0"
                    label="Seleccione"
                    :options="[
                      {
                        value: 'Correo electrónico',
                        label: 'Correo electrónico',
                      },
                    ]"
                    @update:model-value="(v) => (edited = true)"
                    :rules="[inputRequired]"
                    dense
                    outlined
                    class="tw-rounded-lg"
                  >
                  </q-select>
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Tipo de Documento *</label>
                  <q-select
                    v-model="form.tipoDocumento"
                    label="Seleccione"
                    input-debounce="0"
                    :options="tipoDocumento"
                    emit-value
                    map-options
                    dense
                    outlined
                    @update:model-value="(v) => (edited = true)"
                    class="tw-rounded-lg"
                    :rules="[inputRequired]"
                  >
                  </q-select>
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label"
                    >Numero de Identificacion *</label
                  >
                  <q-input
                    v-model="form.numeroDocumento"
                    label="Inserte"
                    @update:model-value="(v) => (edited = true)"
                    input-debounce="0"
                    :rules="[
                      inputRequired,
                      Number(form.tipoDocumento) == 11 ? alphanumeric : (v: string) => onlyNumbers(v),
                      (v) => maxLengthInput(15, v),
                    ]"
                    dense
                    outlined
                    class="tw-rounded-lg"
                    @blur="blurSearchUser"
                  >
                  </q-input>
                </span>
              </div>
              <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                <span class="tw-w-full">
                  <label class="tw-text-label">Primer Apellido *</label>
                  <q-input
                    v-model="form.primerApellido"
                    label="Inserte"
                    dense
                    filled
                    class="tw-rounded-lg"
                    :rules="[inputRequired]"
                    disable
                  />
                </span>
              </div>
              <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                <span class="tw-w-full">
                  <label class="tw-text-label">Segundo Apellido *</label>
                  <q-input
                    v-model="form.segundoApellido"
                    label="Inserte"
                    dense
                    filled
                    :rules="[inputRequired]"
                    class="tw-rounded-lg"
                    disable
                  />
                </span>
              </div>
              <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                <span class="tw-w-full">
                  <label class="tw-text-label">Primer Nombre *</label>
                  <q-input
                    v-model="form.primerNombre"
                    label="Inserte"
                    dense
                    filled
                    class="tw-rounded-lg"
                    :rules="[inputRequired]"
                    disable
                  />
                </span>
              </div>
              <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                <span class="tw-w-full">
                  <label class="tw-text-label">Otros Nombres *</label>
                  <q-input
                    v-model="form.otrosNombres"
                    label="Inserte"
                    :rules="[inputRequired]"
                    dense
                    filled
                    class="tw-rounded-lg"
                    disable
                  />
                </span>
              </div>
            </div>
          </q-expansion-item>
        </q-card>
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <q-expansion-item
            expand-separator
            id="Datos generales"
            default-opened
          >
            <template v-slot:header>
              <div class="col row">
                <h2 class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">
                  Información Documento Soporte Equivalente
                </h2>
              </div>
            </template>

            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-12">
                <span class="tw-w-full">
                  <label class="tw-text-label">Tipo de Bien o Servicio *</label>
                  <q-select
                    v-model="form.tipoBienServicio"
                    label="Seleccione"
                    input-debounce="0"
                    map-options
                    emit-value
                    @update:model-value="(v) => (edited = true)"
                    :options="tipoBienServicioOptions"
                    dense
                    outlined
                    class="tw-rounded-lg"
                    :rules="[inputRequired]"
                  >
                  </q-select>
                </span>
              </div>
              <div class="col-12">
                  <CommentTextArea v-model="form.observacion" :is-required="true" :max-length="2000" label="Observación" @update:model-value="(v) => (edited = true)"/>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Valor *</label>
                  <q-input
                    label="Inserte"
                    v-model="form.valor"
                    prefix="$"
                    :rules="[
                      inputRequired,
                      onlyNumbers,
                      (v) => maxLengthInput(8, v),
                    ]"
                    @update:model-value="(v) => (edited = true)"
                    outlined
                    class="tw-rounded-lg"
                    dense
                    mask="#.###.###.###"
                    unmasked-value
                    reverse-fill-mask
                    maxlength="10"
                  ></q-input>
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Aprobador *</label>
                  <q-select
                    @update:model-value="(v) => (edited = true)"
                    label="Seleccione"
                    v-model="form.aprobador"
                    input-debounce="0"
                    :options="options"
                    emit-value
                    map-options
                    dense
                    outlined
                    class="tw-rounded-lg"
                    :rules="[inputRequired]"
                  >
                  </q-select>
                </span>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Valor en Letras *</label>
                  <q-input
                    label="Inserte"
                    v-model="form.valor_letra"
                    input-debounce="0"
                    :rules="[inputRequired]"
                    dense
                    outlined
                    class="tw-rounded-lg"
                    disable
                  />
                </span>
              </div>
            </div>
          </q-expansion-item>
        </q-card>
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <q-expansion-item
            expand-separator
            id="Datos generales"
            default-opened
          >
            <template v-slot:header>
              <div class="col row">
                <h2 class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">
                  Campos Automáticos al Radicar
                </h2>
              </div>
            </template>

            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">
                    FECHA / Sistema al Radicar *
                  </label>
                  <DatePicker
                    mask="DD/MM/YYYY"
                    label="dd / mm / aaaa"
                    v-model:input-data-prop="form.fechaRadicar"
                    :rules="[inputRequired]"
                    disable
                  />
                </span>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label"
                    >HORA / Sistema al Radicar *</label
                  >
                  <TimePicker
                    class="custom-field"
                    required
                    v-model:input-data-prop="form.horaInicio"
                    disable
                  />
                </span>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="tw-w-full">
                  <label class="tw-text-label">Estado del Trámite *</label>
                  <q-select
                    label="Seleccione"
                    v-model="form.estado"
                    map-options
                    emit-value
                    input-debounce="0"
                    :options="estados"
                    :rules="[inputRequired]"
                    dense
                    outlined
                    class="tw-rounded-lg"
                    disable
                  >
                  </q-select>
                </span>
              </div>
            </div>
          </q-expansion-item>
        </q-card>
        <div class="col row justify-center q-gutter-x-md q-my-md">
          <q-btn
            color="accent"
            textColor="secondary"
            label="Cancelar"
            style="
              width: 130px;
              height: 40px;
              border-radius: 8px;
              font-size: 16px;
            "
            type="reset"
            no-caps
            @click="cancelModal = true"
          />

          <q-btn
            color="primary"
            label="Guardar"
            style="
              width: 130px;
              height: 40px;
              border-radius: 8px;
              font-size: 16px;
            "
            @click="handleSubmit"
            :loading="handleSubmitIsLoading"
            :disable="!edited"
          />
        </div>
      </q-form>
    </template>
    <template v-else>
      <q-expansion-item
        dense
        expand-separator
        default-opened
        class="tw-bg-white"
        style="border-radius: 5px"
      >
        <template v-slot:header>
          <div class="row justify-between tw-w-full items-center">
            <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
              Información Básica de Radicación
            </h3>
            <q-btn
              icon="edit"
              color="secondary"
              label="Editar"
              dense
              class="q-py-xs tw-mr-3"
              @click="
                async (e) => {
                  e.preventDefault();
                  form = { ...initialform, ...$props.data };
                  form.horaInicio = moment(
                    props.data.fechaFormateada,
                    'DD/MM/YYYY hh:mm:ss a'
                  ).format('hh:mm');
                  form.fechaRadicar = moment(
                    props.data.fechaFormateada,
                    'DD/MM/YYYY hh:mm:ss a'
                  ).format('DD/MM/YYYY');
                  isEdit = true;
                  await formValidate.validate();
                }
              "
            ></q-btn>
          </div>
        </template>
        <q-card
          class="q-pb-lg q-px-md tw-flex tw-justify-between tw-gap-8"
          style="box-shadow: none"
        >
          <div class="tw-flex tw-flex-col tw-leading-6 tw-w-1/2">
            <p class="titles">Dependencia</p>
            <p>{{ $props?.data?.dependencia }}</p>
            <p class="titles">Tipo de Trámite</p>
            <p>{{ $props?.data?.tipoTramite }}</p>
            <p class="titles">Tipo de Documento</p>
            <p>
              {{
                tipoDocumento.find(
                  (item) => item.value === $props.data?.tipoDocumento
                )?.label ?? $props.data?.tipoDocumento
              }}
            </p>
            <p class="titles">Primer Apellido</p>
            <p>{{ $props.data?.primerApellido }}</p>
            <p class="titles">Primer Nombre</p>
            <p>{{ $props.data?.primerNombre }}</p>
          </div>
          <div class="tw-flex tw-flex-col tw-leading-6 tw-w-1/2">
            <p class="titles">Responsable del Proceso</p>
            <p>{{ $props.data?.responsable }}</p>
            <p class="titles">Canal de Recepción</p>
            <p>{{ $props.data?.canal }}</p>
            <p class="titles">Número de Identificación</p>
            <p>{{ $props.data?.numeroDocumento }}</p>
            <p class="titles">Segundo Apellido</p>
            <p>{{ $props.data?.segundoApellido }}</p>
            <p class="titles">Otros Nombres</p>
            <p>{{ $props.data?.otrosNombres }}</p>
          </div>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        dense
        expand-separator
        default-opened
        class="tw-bg-white q-mt-md"
        style="border-radius: 5px"
      >
        <template v-slot:header>
          <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
            Información Documento Soporte Equivalente
          </h3>
        </template>
        <q-card
          class="q-pb-lg q-px-md tw-flex tw-flex-wrap tw-justify-start tw-gap-x-8 tw-leading-6"
        >
          <div class="tw-flex tw-flex-col tw-w-full">
            <p class="titles">Tipo de Bien o Servicio</p>
            <p>{{ $props.data?.tipoBienServicio }}</p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-full">
            <p class="titles">Observación</p>
            <p class="tw-overflow-hidden tw-w-[1000px] tw-break-words">
              {{ $props.data?.observacion }}
            </p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-[48%]">
            <p class="titles">Valor</p>
            <p>$ {{ $props.data?.valor?.toLocaleString("es-ES") }}</p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-[48%]">
            <p class="titles">Aprobador</p>
            <p>{{ $props.data?.aprobador }}</p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-full">
            <p class="titles">Valor en Letras</p>
            <p>{{ $props.data?.valor_letra }}</p>
          </div>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        dense
        expand-separator
        default-opened
        class="tw-bg-white q-mt-md"
        style="border-radius: 5px"
      >
        <template v-slot:header>
          <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
            Campos Automáticos al Radicar
          </h3>
        </template>
        <q-card
          class="q-pb-lg q-px-md tw-flex tw-flex-wrap tw-justify-start tw-gap-x-8 tw-leading-6"
        >
          <div class="tw-flex tw-flex-col tw-w-[48%]">
            <p class="titles">FECHA / Sistema al Radicar</p>
            <p>
              {{
                moment(
                  $props.data?.fechaFormateada,
                  "DD/MM/YYYY HH:mm:ss"
                ).format("DD/MM/YYYY")
              }}
            </p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-[48%]">
            <p class="titles">HORA / Sistema al Radicar</p>
            <p>
              {{
                moment(
                  $props.data?.fechaFormateada,
                  "DD/MM/YYYY hh:mm:ss a"
                ).format("hh:mm a")
              }}
            </p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-[48%]">
            <p class="titles">Estado de Trámite</p>
            <p>{{ $props.data?.estado }}</p>
          </div>
        </q-card>
      </q-expansion-item>
    </template>

    <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
      <q-expansion-item default-opened>
        <template v-slot:header>
          <div class="col row">
            <b class="tw-text-lg">Documentos Cargados</b>
          </div>
        </template>
        <p class="titles q-px-md q-mb-md q-mt-lg">Documento de Soporte</p>
        <div
          class="tw-flex tw-flex-col row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md"
        >
          <q-card
            class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-sm tw-mr-auto"
            flat
            bordered
            :key="doc.id"
            v-for="doc in radicadoDoc"

          >
            <img style="width: 26px" v-lazy :data-url="tipoIcon(doc.content.mimeType)" />
            <p class="tw-text-sm tw-font-semibold">{{ doc.name }}</p>
            <q-icon
              size="20px"
              class="tw-text-[#6B737C]"
              name="error_outline"
            />
            <button @click="() => handleOpenDocFile(doc.id, doc.name)">
              <q-icon
                size="20px"
                class="tw-text-[#6B737C]"
                name="file_download"
              />
            </button>
          </q-card>
        </div>

        <p class="titles q-px-md q-mb-md q-mt-lg">Documentos adjuntos</p>
        <div
          class="tw-flex tw-flex-col row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md"
        >
          <q-card
            class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-sm tw-mr-auto"
            flat
            bordered
            :key="doc.id"
            v-for="doc in filteredDocs"
          >
            <img style="width: 26px" v-lazy :data-url="tipoIcon(doc.content.mimeType)" />
            <p class="tw-text-sm tw-font-semibold">{{ doc.name }}</p>
            <q-icon
              size="20px"
              class="tw-text-[#6B737C]"
              name="error_outline"
            />
            <button @click="() => handleOpenDocFile(doc.id, doc.name)">
              <q-icon
                size="20px"
                class="tw-text-[#6B737C]"
                name="file_download"
              />
            </button>
          </q-card>
        </div>
      </q-expansion-item>
    </q-card>
  </section>
  <Modal
    v-model="cancelModal"
    title="¡Espera un momento!"
    :is-success="false"
    text-button="Si"
    @handleAccept="clear"
    cancel-button
    text-button-cancel="No"
    text="¿Está seguro de que no quiere modificar los datos?"
    @close-modal="cancelModal = false"
    type="button"
  />
</template>

<script lang="ts" setup>
import { SelectInput } from "src/interfaces";
import { tipoDocumento } from "src/constantes/options";
import { Ref, computed, onMounted, ref, watch } from "vue";
import {
  maxLengthInput,
  onlyNumbers,
  inputRequired,
  alphanumeric
} from "src/helpers/validations";
import { sgdeaAxios } from "src/services";
import DatePicker from "src/components/FormFields/datePickerComponent.vue";
import TimePicker from "src/components/FormFields/timePickerComponent.vue";
import moment from "moment";
import Modal from "components/Modal/Modal.vue";
// @ts-ignore
import PDFIcon from "src/assets/pdf.svg";
// @ts-ignore
import excelIcon from "src/assets/excel.svg";
// @ts-ignore
import docxIcon from "src/assets/word.svg";
import { QForm } from "quasar";
import { ConsultarDocumentoResponse } from "../..";
import { toast } from "src/helpers/toast";
import { numberToHumanText } from "src/helpers/number";
import { b64toBlob } from "src/helpers/converters";
import CommentTextArea from  "src/shared/components/TextArea/Comments.vue";


const loadedDocs = ref<any[]>([]);
const entradaFiles = ref<any[]>([]);
const adjuntoFiles = ref<any[]>([]);
const isEdit = ref(false);
const handleSubmitIsLoading = ref(false);
const cancelModal = ref(false);
const edited = ref(false);
async function getDependencies() {
  const { data } = await sgdeaAxios.get("/seccionSubSeccion");
  optionsDependencias.value = data
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .map((dependencia: any) => ({
      label: dependencia.nombre,
      value: dependencia.idSeccionSubSeccion,
    }));
}

const initialform = {
  dependencia: "",
  responsable: "",
  tipoTramite: "",
  canal: "",
  tipoDocumento: "",
  primerApellido: "",
  segundoApellido: "",
  primerNombre: "",
  otrosNombres: "",
  fechaRadicar: "",
  horaInicio: "",

  tipoBienServicio: "",
  observacion: "",
  valor: 0,
  valor_letra: "",
  aprobador: "",
  estado: {
    value: "radicado",
    label: "Radicado",
  },

  sec: "",
  numeroDocumento: "",
};

const clear = () => {
  isEdit.value = false;
};

interface InfoGeneralProps {
  data: any;
}
const props = defineProps<InfoGeneralProps>();

const emit = defineEmits(["update:data"]);

const formValidate: Ref<QForm> = ref();
const validateEdite = ref(false);
const handleSubmit = async () => {
  if (await formValidate.value.validate()) {
    handleSubmitIsLoading.value = true;
    isEdit.value = false;
    delete form.value.fechaFormateada;
    delete form.value.fechaRadicar;
    delete form.value.horaInicio;

    emit("update:data", {
      ...form.value,
      dependencia: form.value.dependencia.label ?? form.value.dependencia,
    });
    setTimeout(() => (handleSubmitIsLoading.value = false), 1000);
    toast.success("El radicado fue editado exitosamente")
  }
};

const form = ref({ ...initialform });

watch(
  () => form.value.dependencia,
  async (newVal) => {
    if (!newVal.value) return;
    const response = await sgdeaAxios.get(
      `/api/usuarios/rolYSeccionSubseccion/${newVal.value}?rolName=Administrador de Trámite`
    );
    options.value = response.data
      .filter((responsable: any) => responsable.enabled)
      .map((responsable: any) => ({
        label: responsable.firstname + " " + responsable.lastname,
        value: responsable.firstname + " " + responsable.lastname,
      }));
    form.value.responsable = "";
  }
);

const tipoIcon = (tipo) => {
  if (tipo === "application/pdf") return PDFIcon;
  if (
    tipo === "application/vnd.ms-excel" ||
    tipo === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )
    return excelIcon;
  if (
    tipo ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    tipo === "application/msword"
  )
    return docxIcon;
};

onMounted(async () => {
  if (props.data) {
    try {
      await getDependencies();

      const response = await sgdeaAxios.get(
        "/radicados/obtenerHijosPorNodo/" + props.data.nodeId
      );

      if (response.status !== 200 && response.status !== 201) {
      return;
    }

      const docs = response.data.list.entries.map((doc) => {
        return {
          ...doc?.entry,
        };
      });

      loadedDocs.value = docs;
            //iteramos sobre los docs y validamos si el nombre es igual al de props.data.sec, si es asi seagrega al array de entrada, de lo contraio se agrega al array de adjunto
            docs.forEach(doc => {
                if (doc.name.toLowerCase().includes(props.data.sec.toLowerCase())) {
                    entradaFiles.value.push(doc);
                } else {
                    adjuntoFiles.value.push(doc);
                }
            });
        } catch (error) {
            console.error(error);
        }
    }
  }
);

const handleOpenDocFile = async (id: string, name: string) => {
  try {
    const response = await sgdeaAxios.get(
      "/radicados/consultar_documento/" + id
    );

    const blob = await b64toBlob(
      response.data.base64x,
      response.data.minetype.split("/")[0]
    );

    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = name;
    a.click();
  } catch (error) {
    console.error(error);
  }
};

const blurSearchUser = async (val) => {
  try {
    const response = await sgdeaAxios.get<ConsultarDocumentoResponse>(
      `/facturacion/getVende/${form.value.numeroDocumento}`
    );
    form.value.primerApellido = response.data["papellido"] ?? " ";
    form.value.segundoApellido = response.data["sapellido"] ?? " ";
    form.value.primerNombre = response.data["pnombre"] ?? " ";
    form.value.otrosNombres = response.data["onombre"] ?? " ";

    return response;
  } catch (e) {
    console.error(e);
    toast.error("El número de identificación es incorrecto");
  }
};

watch(
  () => form.value.valor,
  (newNumber) => {
    if (String(newNumber).startsWith("0") && String(newNumber) !== "0") {
      let format = parseFloat(String(newNumber).substring(1));

      if (isNaN(format)) {
        format = 0;
      }

      form.value.valor = format;
    }

    form.value.valor_letra = numberToHumanText(newNumber);
  }
);

watch(
  () => form.value,
  (newValue, oldValue) => {
    validateEdite.value = JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
  { deep: true }
);

const optionsDependencias = ref<SelectInput[]>([
  { label: "GERENCIA JURÍDICA", value: "GERENCIA JURÍDICA" },
  {
    label: "OFICINA DE CONTROL DISCIPLINARIO",
    value: "OFICINA DE CONTROL DISCIPLINARIO",
  },
  { label: "OFICINA DE CONTROL INTERNO", value: "OFICINA DE CONTROL INTERNO" },
  {
    label: "OFICINA DE ESTRATEGIA Y DESARROLLO",
    value: "OFICINA DE ESTRATEGIA Y DESARROLLO",
  },
  {
    label: "OFICINA DE GESTIÓN INTEGRAL DE RIESGOS",
    value: "OFICINA DE GESTIÓN INTEGRAL DE RIESGOS",
  },
  {
    label: "OFICINA DE TECNOLOGÍAS DE LA INFORMACIÓN",
    value: "OFICINA DE TECNOLOGÍAS DE LA INFORMACIÓN",
  },
  { label: "PRESIDENCIA", value: "PRESIDENCIA" },
  {
    label: "SECRETARÍA GENERAL Y JURÍDICA",
    value: "SECRETARÍA GENERAL Y JURÍDICA",
  },
]);

const tipoTramite = ref<SelectInput[]>([
  {
    label: "Facturas Administrativas",
    value: "Facturas Administrativas",
  },
  {
    label: "Cuenta de Cobro o Documento Equivalente Soporte (DSE)",
    value: "Cuenta de Cobro o Documento Equivalente Soporte (DSE)",
  },
  {
    label: "Factura Emisión Manual",
    value: "Factura Emisión Manual",
  },
  {
    label: "Nota Crédito / Nota Débito",
    value: "Nota Crédito / Nota Débito",
  },
  {
    label: "Crear Adquirente",
    value: "Crear Adquirente",
  },
]);

const estados = ref([
  {
    value: "radicado",
    label: "Radicado",
  },
  {
    value: "rechazado",
    label: "Rechazado",
  },
  {
    value: "rechazado-operador",
    label: "Rechazado-Operador",
  },
  {
    value: "aprobado",
    label: "Aprobado",
  },
]);

const options = ref([]);

const tipoBienServicioOptions = ref<SelectInput[]>([
  {
    value: "DSE 01: Pago de comisiones",
    label: "DSE 01: Pago de comisiones",
  },
  {
    value: "DSE 02: Adquisición de bienes",
    label: "DSE 02: Adquisición de bienes",
  },
  {
    value: "DSE 03: Prestación de servicios",
    label: "DSE 03: Prestación de servicios",
  },
]);
const radicadoDoc = computed(() => {
  return loadedDocs.value.filter(
                    (it) =>
                      it.name === `${props.data.sec}.pdf`
                  )
});
const filteredDocs = computed(() => {
  return loadedDocs.value.filter(
                    (it) =>
                      it.name !== `${props.data.sec}.pdf`
                  )
});
</script>
