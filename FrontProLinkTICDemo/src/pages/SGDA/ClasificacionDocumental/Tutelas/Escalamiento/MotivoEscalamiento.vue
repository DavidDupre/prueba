<template>
  <q-form ref="escalar" :greedy="true" disable>
    <q-card v-if="findRoles([0, 1, 6, 3])">
      <q-expansion-item class="tw-mt-10" default-opened>
        <template v-slot:header>
          <div class="col row">
            <h3 class="text-bold tw-text-xl q-py-md tw-flex-1 q-px-md">
              Asignación
            </h3>
          </div>
        </template>
        <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
          <div class="tw-bg-white q-mt-lg tw-rounded-md">
            <div
              class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex tw-flex-row"
            >
              <div
                class="width-container tw-w-1/2 q-px-sm tw-rounded-xl"
                style="border: 1px solid #e3e4e5"
              >
                <q-table
                  v-model:selected="selection"
                  :columns="columnsAsignarEscalar"
                  :row-class="getRowClass"
                  :rows="listUsers"
                  :rows-per-page-options="[8]"
                  :selection="findRoles([0, 1, 6, 3]) ? 'multiple' : 'none'"
                  class="sizes q-mr-md"
                  flat
                  row-key="id"
                  rows-per-page-label="Páginas"
                  style="
                    margin: 0 auto;
                    border-radius: 15px;
                    min-height: auto;
                    max-height: 400px;
                  "
                  table-header-class="text-black text-h6 "
                  virtual-scroll
                  @update:selected="handleAssign"
                  @update:dragEvent="dragGestor"
                  @update:handleDblClickEvent="handleDoubleClickEvent"
                >
                  <template
                    v-slot:body-cell-colaborador="props"
                    :draggable="true"
                    auto-width
                    class="tw-bg-blue"
                  >
                    <td
                      :draggable="true"
                      class="tw-text-center tw-bg-orage -cursor-pointer"
                      @dragstart="dragGestor(props.row)"
                    >
                      {{ props.row.colaborador }}
                    </td>
                  </template>
                  <template v-slot:header-selection="scope">
                    <q-checkbox v-model="scope.selected"/>
                  </template>

                  <template v-slot:body-selection="scope">
                    <q-checkbox
                      v-if="scope.row.escalado !== 'Si'"
                      v-model="scope.selected"
                    />
                  </template>
                  <template v-slot:top-left>
                    <span
                      class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold"
                    >
                      Seleccione los usuarios que desea asignar
                    </span>
                    <span class="tw-text-base tw-font-bold tw-mt-3"
                    >Filtrar por Oficina</span
                    >
                    <q-select
                      v-model="filterValue"
                      :options="opOfi"
                      class="tw-w-full"
                      dense
                      fill-input
                      hide-selected
                      input-debounce="0"
                      outlined
                      placeholder="Inserte"
                      rounded
                      use-input
                      @filter="filterOfi"
                    >
                      <template v-slot:prepend>
                        <q-icon name="search"/>
                      </template>

                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No hay resultados
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </template>
                </q-table>
              </div>
              <div
                :style="
                  errorUsers
                    ? 'border: 1px solid red'
                    : 'border: 1px solid #e3e4e5'
                "
                class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl"
                @drop="dropGestor()"
                @dragover.prevent
              >
                <span
                  class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold"
                >
                  Estos son los usuarios que ha seleccionado
                </span>
                <div class="flex wrap tw-gap-3 q-pt-sm">
                  <div v-for="(asign, index) in cardsAsignar" :key="index">
                    <div
                      v-if="asign.visible"
                      class="q-px-sm tw-text-base q-py-sm tw-gap-2 flex justify-between tw-text-[#2C3948] tw-rounded-3xl"
                      style="border: 1px solid #e3e4e5"
                    >
                      <q-icon name="person_outline" size="24px"/>
                      {{ asign.name }}
                      <q-icon
                        v-if="findRoles([0, 1, 6, 3])"
                        class="tw-cursor-pointer"
                        name="close"
                        size="24px"
                        @click="removeCardAsignar(index)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-expansion-item>
    </q-card>
    <q-card>
      <q-expansion-item class="tw-mt-10" default-opened>
        <template v-slot:header>
          <div class="col row">
            <h3 class="tw-text-xl text-bold text-weight-bold">
              Motivo de Escalamiento
            </h3>
          </div>
        </template>
        <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
          <div class="row q-col-gutter-md q-pb-md q-px-md">
            <div class="col-6">
              <span class="tw-text-label text-weight-bold"
              >Asunto de Escalamiento *</span
              >
              <q-input
                v-model="form.asunto"
                :disable="!findRoles([0, 1, 6, 3])"
                :rules="[
                  inputRequired,
                  alphanumericWithPoint,
                  (v) => maxLengthInput(200, v),
                ]"
                dense
                emit-value
                label="Inserte"
                outlined
                required
              />
            </div>

            <div class="col-6">
              <span class="tw-text-label text-weight-bold">Etapa *</span>
              <q-select
                v-model="form.etapa"
                :disable="!findRoles([0, 1, 6, 3])"
                :options="[
                  'Avoco',
                  'Fallo de primera instancia',
                  'Fallo de segunda instancia',
                  'Revisión corte',
                  'Desacato',
                  'Oficios',
                ]"
                :rules="[inputRequired, (v) => maxLengthInput(100, v)]"
                dense
                emit-value
                label="Inserte"
                outlined
              />
            </div>

            <div class="col-12">
              <span class="tw-text-label text-weight-bold"
              >Radicado de Entrada
              </span>
              <q-input
                v-model="form.radicado"
                :disable="!findRoles([0, 1, 6, 3])"
                :rules="[]"
                dense
                emit-value
                filled
                label="Inserte"
                readonly
              />
            </div>

            <div class="col-6">
              <span class="tw-text-label text-weight-bold"
              >Tipo de Documento *</span
              >
              <q-select
                v-model="form.tipoDoc"
                :disable="!findRoles([0, 1, 6, 3])"
                :options="tipoDocumentoEscalar"
                :rules="[inputRequired]"
                dense
                emit-value
                label="Seleccione"
                outlined
              />
            </div>

            <div class="col-6">
              <span class="tw-text-label text-weight-bold"
              >Número de Documento *</span
              >
              <q-input
                v-model="form.numeroDoc"
                :disable="!findRoles([0, 1, 6, 3])"
                :rules="[
                  inputRequired,
                  alphanumeric,
                  (v) => maxLengthInput(20, v),
                ]"
                dense
                emit-value
                label="Inserte"
                outlined
              />
            </div>

            <template
              v-if="
                form.tipoDoc === 'Sociedad Extranjera sin NIT en Colombia' ||
                form.tipoDoc === 'Número de Identificación Tributaria (NIT)'
              "
            >
              <div class="col-6">
                <span class="tw-text-label text-weight-bold"
                >Nombre Comercial *</span
                >
                <q-input
                  v-model="form.nombreComercial"
                  :disable="!findRoles([0, 1, 6, 3])"
                  :rules="[
                    inputRequired,
                    alphanumeric,
                    (v) => maxLengthInput(500, v),
                  ]"
                  dense
                  emit-value
                  label="Inserte"
                  outlined
                />
              </div>
              <div class="col-6">
                <span class="tw-text-label text-weight-bold"
                >Razón Social *</span
                >
                <q-input
                  v-model="form.razonSocial"
                  :disable="!findRoles([0, 1, 6, 3])"
                  :rules="[
                    inputRequired,
                    alphanumeric,
                    (v) => maxLengthInput(500, v),
                  ]"
                  dense
                  emit-value
                  label="Inserte"
                  outlined
                />
              </div>
            </template>

            <template v-else>
              <div class="col-6">
                <span class="tw-text-label text-weight-bold"
                >Nombre del Afectado *</span
                >
                <q-input
                  v-model="form.afectado"
                  :disable="!findRoles([0, 1, 6, 3])"
                  :rules="[inputRequired, v => maxLengthInput(200, v), alphabeticalWithSpecialCharacters]"
                  dense
                  emit-value
                  label="Inserte"
                  outlined
                />
              </div>
            </template>

            <div class="col-6">
              <span class="tw-text-label text-weight-bold"
              >Fecha Notificado Positiva *</span
              >
              <Datepicker
                ref="datePick"
                v-model:input-data-prop="form.fecha"
                :disabled="true"
                label="dd / mm / aaaa"
                mask="DD/MM/YYYY"
                @valida-fecha="emitValidation"
              />
            </div>

            <div class="col-12 tw-mt-4 tw-text-label">
              <span class="text-weight-bold"
              >Oportunidad de Entrega de Insumo *</span
              >
              <q-input
                v-model="form.insumo"
                :disable="!findRoles([0, 1, 6, 3])"
                :rules="[inputRequired]"
                dense
                emit-value
                outlined
                readonly
                type="textarea"
              />
            </div>

            <div class="col-12 tw-mt-4">
              <span class="tw-text-label text-weight-bold"
              >Detalle de la Pretensión *
                {{ form.pretension.length }}/10000</span
              >
              <!-- {{ form.pretension }} -->
              <q-field
                ref="fieldRef"
                v-model="form.pretension"
                :disable="!findRoles([0, 1, 6, 3])"
                :rules="[inputRequired, (v) => maxLengthInputForRich(10000, v)]"
                borderless
                label-slot
              >
                <!-- <template #label>Description</template> -->
                <template #control>
                  <q-editor
                    id="editorRich"
                    ref="editorPreten"
                    v-model="form.pretension"
                    :style="
                      fieldRef && fieldRef.hasError
                        ? 'border-color: var(--q-negative)'
                        : ''
                    "
                    :toolbar="[]"
                    class="full-width"
                    style="cursor: auto"
                    @paste="pasteCapture"
                  />
                </template>
              </q-field>
              <!-- <q-input :disable="!findRoles([0, 1, 5])" type="textarea" outlined label="Inserte" dense emit-value v-model="form.pretension" :rules="[inputRequired, v => maxLengthInput(10000, v)]"/> -->
            </div>

            <div class="col-12 tw-mt-4">
              <span class="tw-text-label text-weight-bold"
              >Observaciones * {{ form.observaciones.length }}/10000</span
              >
              <q-field
                ref="fieldRefObs"
                v-model="form.observaciones"
                :disable="!findRoles([0, 1, 6, 3])"
                :rules="[
                  inputRequired,
                  (v) => maxLengthInputForRich(10000, v),
                  (v) => minLengthInput(10, v),
                ]"
                borderless
                label-slot
              >
                <!-- <template #label>Description</template> -->
                <template #control>
                  <q-editor
                    id="editorRich"
                    ref="editorObs"
                    v-model="form.observaciones"
                    :style="
                      fieldRefObs && fieldRefObs.hasError
                        ? 'border-color: var(--q-negative)'
                        : ''
                    "
                    :toolbar="[]"
                    class="full-width"
                    style="cursor: auto"
                    @paste.native="(evt) => pasteCaptureObs(evt)"
                  />
                </template>
              </q-field>
            </div>

            <div class="cols-12 full-width">
              <div class="flex column flex-column-fixed q-mt-md">
                <p class="text-weight-bold">Documentos Adjuntos</p>

                <div class="flex q-mt-xs row q-gutter-sm tw-px-0">
                  <q-card
                    v-for="(
                      { nombre, formato, id, nodeId, username }, index
                    ) in listDocs.filter(
                      (it) =>
                        it.username ===
                          detailsTutela.escalamientoTutelas?.usuarioEscalador &&
                        it.tipo == 'De gestión '
                    )"
                    :key="index"
                    bordered
                    class="flex row items-center tw-gap-x-2 q-px-md"
                    flat
                  >
                    <img
                      v-if="extensiones.includes(formato.toLowerCase())"
                      v-lazy :data-url="tipoIcon(formato.toLowerCase())"
                      style="width: 26px"
                    />
                    <q-icon v-else name="sym_o_unknown_document" size="xs"/>
                    <p class="tw-text-xs tw-font-semibold">
                      {{ nombre }}
                    </p>
                    <div class="tw-flex tw-gap-1">
                      <q-icon
                        class="tw-cursor-pointer"
                        name="download"
                        size="16px"
                        @click="download(nodeId)"
                      />
                      <q-icon
                        v-if="formato == 'pdf' || formato == 'PDF'"
                        class="tw-cursor-pointer"
                        name="info"
                        size="16px"
                        @click="visualize(nodeId)"
                      />
                    </div>
                  </q-card>
                </div>
              </div>
              <span v-if="findRoles([0, 1, 6, 3])" class="tw-text-label"
              >Adjuntar Archivos</span
              >
              <FileLoader
                v-if="findRoles([0, 1, 6, 3])"
                v-model:model-value="form.archivos"
                :max-file-size="50 * 1024 * 1024"
                :max-files="30"
                :multiple="true"
                accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
                class="tw-w-full"
                max-file-size-label="50"
                sub-title="Puede adjuntar (30) Archivo(s) cada uno con un tamaño permitido de 50MB en cualquiera de las siguientes extenciones <hr>(pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)"
                @rejected="rejectedFiles"
              />
            </div>
          </div>
        </div>
      </q-expansion-item>
    </q-card>
    <div
      v-if="findRoles([0, 1, 6, 3])"
      class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5"
    >
      <q-btn
        class="tw-rounded-xl tw-w-[240px] tw-border-black tw-border tw-border-solid !tw-p-2"
        color="accent"
        label="Cancelar"
        text-color="black"
        type="reset"
        @click="cancelModal = true"
      />
      <q-btn
        :loading="loading"
        class="tw-rounded-xl !tw-p-2 tw-w-[240px]"
        color="primary"
        label="Escalar"
        text-color="white"
        @click="createEscalamiento"
      />
    </div>
  </q-form>
  <Modal
    v-model="confirmModal"
    :is-success="false"
    cancel-button
    text="¿Está seguro de escalar el trámite?"
    text-button="Si"
    textButtonCancel="No"
    title="Confirmación"
    type="button"
    @handleAccept="submitEscalamiento"
    @close-modal="confirmModal = false"
  />
  <Modal
    v-model="cancelModal"
    :is-success="false"
    cancel-button
    text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
    text-button="Si"
    textButtonCancel="No"
    title="Confirmación"
    type="button"
    @handleAccept="clear"
    @close-modal="cancelModal = false"
  />
</template>

<script lang="ts" setup>
import {
  alphabeticalWithSpecialCharacters,
  alphanumeric,
  alphanumericWithPoint,
  inputRequired,
  maxLengthInput,
  maxLengthInputForRich,
  minLengthInput
} from "src/helpers/validations";
import {onMounted, ref, watch,} from "vue";
import Modal from "components/Modal/Modal.vue";
import {toast} from "src/helpers/toast";
import {tipoDocumentoEscalar} from "src/constantes/options";
import FileLoader from "src/components/FormFields/FileLoader.vue";
import Datepicker from "src/components/FormFields/datePickerComponent.vue";
import {columnsAsignarEscalar} from "..";
import {formatDateTimeStandTwo, reverseFormatDate} from "src/helpers/formtDate";
import {useRouter} from "vue-router";
import {useAuthStore} from "src/stores/auth.store";
import PDFIcon from "src/assets/pdf.svg";
// @ts-ignore
import excelIcon from "src/assets/excel.svg";
import NoData from "assets/filterImage.svg";
import moment from "moment";
// @ts-ignore
import docxIcon from "src/assets/word.svg";
import service from "src/services/Api";
import {sgdeaAxios} from "src/services";
import {crearTrazabilidad} from "src/helpers/trazabilidad";

const {getUserInfo} = useAuthStore();
const auth = useAuthStore();
const router = useRouter();
const emit = defineEmits(["findDocs", "update:dragEvent"]);
const datePick = ref();
const opOficinas = ref();
const countImgs = ref(0);
const opOfi = ref();
const userInfo = ref();
const escalar = ref();
const listadoOficinas = ref([]);
const confirmModal = ref(false);
const cancelModal = ref(false);
const selection = ref([]);
const listUsers = ref([]);
const cardsAsignar = ref([]);
const filterValue = ref("");
const filteredOficinas = ref();
const loading = ref(false);
const errorUsers = ref(false);
const fieldRef = ref();
const fieldRefObs = ref();
const countImgsObs = ref(0);
const editorPreten = ref();
const editorObs = ref();
const rechazadoExist = ref();
const extensiones = ref(["pdf", "doc", "docs", "docx", "xls", "xml", "xlsx"]);
const form = ref({
  asunto: "",
  etapa: "",
  radicado: "",
  tipoDoc: "",
  numeroDoc: "",
  afectado: "",
  nombreComercial: "",
  razonSocial: "",
  fecha: "",
  insumo: "",
  pretension: "",
  observaciones: "",
  archivos: [],
  detailsTutela: "",
});
const loadOficina = async () => {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoOficinas");
    if (response.status == 200 || response.status == 201) {
      listadoOficinas.value = response.data.map(
        (e: { nombre: any; id: any }) => {
          return {
            label: e.nombre,
            value: e.id,
          };
        }
      );
      listadoOficinas.value = listadoOficinas.value.filter((e) => {
        return e.value !== 26;
      });
      filteredOficinas.value = listadoOficinas.value;
    }
  } catch (error) {
    console.error(error);
  }
};

const pasteCapture = (paste) => {
  if (paste.clipboardData.getData("Text") == "") {
    if (countImgs.value == 6) {
      paste.preventDefault();
      paste.stopPropagation();
      toast.error("Máximo 6 recortes");
    }
  } else {
    if (paste.target.nodeName === "INPUT") return;
    let text, onPasteStripFormattingIEPaste;
    paste.preventDefault();
    paste.stopPropagation();
    if (paste.originalEvent && paste.originalEvent.clipboardData.getData) {
      text = paste.originalEvent.clipboardData.getData("text/plain");
      editorPreten.value.runCmd("insertText", text);
    } else if (paste.clipboardData && paste.clipboardData.getData) {
      text = paste.clipboardData.getData("text/plain");
      editorPreten.value.runCmd("insertText", text);
    } else if (window.clipboardData && window.clipboardData.getData) {
      if (!onPasteStripFormattingIEPaste) {
        onPasteStripFormattingIEPaste = true;
        editorPreten.value.runCmd("ms-pasteTextOnly", text);
      }
      onPasteStripFormattingIEPaste = false;
    }
  }
};

const pasteCaptureObs = (paste) => {
  if (paste.clipboardData.getData("Text") == "") {
    if (countImgsObs.value == 6) {
      paste.preventDefault();
      paste.stopPropagation();
      toast.error("Máximo 6 recortes");
    }
  } else {
    if (paste.target.nodeName === "INPUT") return;
    let text, onPasteStripFormattingIEPaste;
    paste.preventDefault();
    paste.stopPropagation();
    if (paste.originalEvent && paste.originalEvent.clipboardData.getData) {
      text = paste.originalEvent.clipboardData.getData("text/plain");
      editorObs.value.runCmd("insertText", text);
    } else if (paste.clipboardData && paste.clipboardData.getData) {
      text = paste.clipboardData.getData("text/plain");
      editorObs.value.runCmd("insertText", text);
    } else if (window.clipboardData && window.clipboardData.getData) {
      if (!onPasteStripFormattingIEPaste) {
        onPasteStripFormattingIEPaste = true;
        editorObs.value.runCmd("ms-pasteTextOnly", text);
      }
      onPasteStripFormattingIEPaste = false;
    }
  }
};

const contarImagenes = () => {
  // Expresión regular para encontrar imágenes
  const regexImagenes = /<img\s+[^>]*>/g;

  // Buscar todas las coincidencias en el texto
  const coincidencias = form.value.pretension.match(regexImagenes);

  // Si hay coincidencias, devolver la cantidad
  if (coincidencias) {
    countImgs.value = coincidencias.length;
  }
};

const contarImagenesObs = () => {
  // Expresión regular para encontrar imágenes
  const regexImagenes = /<img\s+[^>]*>/g;

  // Buscar todas las coincidencias en el texto
  const coincidencias = form.value.observaciones.match(regexImagenes);

  // Si hay coincidencias, devolver la cantidad
  if (coincidencias) {
    countImgsObs.value = coincidencias.length;
  }
};

const loadEscalamiento = async () => {
  try {
    if (props.detailsTutela.usuarioEscalados.length > 0) {
      const response = await sgdeaAxios.get(
        `/tutela/${props.detailsTutela.idTutela}/escalamiento`
      );
      if (response.status == 200 || response.status == 201) {
        if (props.detailsTutela.escalamientoTutelas) {
          var data = response.data;

          form.value.asunto = data.asunto;
          form.value.pretension = data.detallePretencion;
          form.value.observaciones = data.motivoEscalamiento;
          setTimeout(async () => {
            selection.value = data.usuariosAsignados
              .filter(
                (item) =>
                  props.detailsTutela.usuarioEscalados.find(
                    (escal) => escal.usuario == item.usuario
                  ).estado !== "Escalamiento Rechazado"
              )
              .map((item) => ({
                colaborador: filterUser(item.id),
                id: item.id,
                user: item.user,
              }));
            cardsAsignar.value = data.usuariosAsignados
              .filter(
                (item) =>
                  props.detailsTutela.usuarioEscalados.find(
                    (escal) => escal.usuario == item.usuario
                  ).estado !== "Escalamiento Rechazado"
              )
              .map((item) => ({
                name: filterUser(item.id),
                visible: true,
                user: item.user,
                id: item.id,
              }));
          }, 200);
          form.value.fecha = formatDateTimeStandTwo(data.fechaNotificacion);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const rowGestor = ref();
// onBeforeMount(async () => await );
const dragGestor = (row: any) => {
  rowGestor.value = row;

  emit("update:dragEvent", row);
};

const dropGestor = () => {
  if (rowGestor.value) {
    const user = listUsers.value.find(
      (element) => element.id === rowGestor.value.id
    );
    if (user) {
      const exists = cardsAsignar.value.some(
        (element) => element.id === user.id
      );
      if (!exists) {
        cardsAsignar.value.push({
          id: user.id,
          name: user.colaborador,
          visible: true,
        });
        // Actualiza la selección para sincronizar con el checkbox
        const updatedSelection = selection.value.map((item) =>
          item.id === user.id ? {...item, selected: true} : item
        );
        selection.value = [...updatedSelection, {...user, selected: true}];
      }
    }
    rowGestor.value = null; // Resetea rowGestor después de agregar
  }
};
const handleDoubleClickEvent = (row: any) => {
  const user = listUsers.value.find((element) => element.id === row.id);
  if (user) {
    const isCardsAsignarEmpty = !cardsAsignar.value.find(
      (element) => element.user === user.id
    );
    if (isCardsAsignarEmpty) {
      cardsAsignar.value.push({
        user: user.id,
        name: user.colaborador,
        visible: true,
      });
    }
  }
};
const filterUser = (id) => {
  var user = listUsers.value.filter((it) => it.id == id)[0].colaborador;
  return user;
};

const loadUsers = async (selectedOffice?) => {
  try {
    const response = await sgdeaAxios.get(
      `/api/usuarios/rolYoficina?rolName=${"Gestionador Escalador"}&oficinaId=${
        selectedOffice ?? 18
      }`
    );
    if (response.status == 200) {
      listUsers.value = response.data;
      const res = listUsers.value.map((e, i) => {
        if (
          props.detailsTutela.usuarioEscalados &&
          props.detailsTutela.usuarioEscalados.find(
            (item) => item.usuarioId == e.id
          )?.estado == "Escalamiento Rechazado"
        ) {
          return {
            colaborador: e.firstname + " " + e.lastname,
            cargo: e.usuarioRelaciones.map(item => item.rol.nombre).join(", "),
            grupo: "GRUPO TUTELAS",
            id: e.id,
            user: e.userName,
            escalado: "Si",
            index: i,
          };
        } else {
          return {
            colaborador: e.firstname + " " + e.lastname,
            cargo: e.usuarioRelaciones.map(item => item.rol.nombre).join(", "),
            grupo: "GRUPO TUTELAS",
            id: e.id,
            user: e.userName,
            escalado: "No",
            index: i,
          };
        }
      });
      listUsers.value = res;
      listUsers.value.sort((a, b) =>
        a.colaborador.localeCompare(b.colaborador)
      );
    }
  } catch (error) {
    console.error(error);
  }
};

form.value.insumo = `Si la información se encuentra en los aplicativos de la compañía, se emitirá la respuesta de fondo a la Gerencia Jurídica, en un plazo máximo de cuatro (4) horas.
Si el insumo técnico requiere un escalamiento, el plazo para entregar se extiende a ocho (8) horas, en caso de tener más de un escalamiento el plazo es de doce (12) horas.
Si el término concedido por la autoridad judicial para responder el requerimiento es inferior a 4 horas, se informará a la operación el detalle del plazo de cada radicado y se gestionará conforme a la solicitud.`;

function getRowClass(row) {
  return row.escalado === "Si" ? "row-disabled" : "";
}

const validate = ref({
  fecha: false,
});
const emitValidation = ({type, data}) => {
  validate.value[type] = data;
};

const props = withDefaults(
  defineProps<{
    detailsTutela: any;
    listDocs: any[];
    download: () => {};
    visualize: () => {};
  }>(),
  {}
);

const handleAssign = (array) => {
  if (errorUsers.value) {
    errorUsers.value = false;
  }
  if (rechazadoExist.value) {
    var nArray = array.map((item) => ({
      id: item.id,
      index: item.index,
      nombre: item.colaborador,
    }));

    nArray.forEach((element) => {
      var valid = props.detailsTutela.usuarioEscalados.filter(
        (x) => x.usuarioId === element.id
      );
      if (valid.length) {
        setTimeout(() => {
          cardsAsignar.value = cardsAsignar.value.filter(
            (item) => item.id != element.id
          );
          selection.value = selection.value.filter(
            (item) => item.id != element.id
          );
          toast.error(`El usuario ${element.nombre} ya se encuentra escalado`);
        }, 5);
      }
    });
  }

  cardsAsignar.value = array.map((item) => ({
    name: item.colaborador,
    visible: true,
    user: item.user,
    id: item.id,
  }));
  selection.value = array;
};

onMounted(async () => {
  //getAllRegisters()
  contarImagenesObs();
  contarImagenes();
  await loadUsers();
  await loadEscalamiento();
  await loadOficina();

  const dataOfi = await sgdeaAxios.get("/seccionSubSeccion");
  opOficinas.value = dataOfi.data
    ?.sort((a, b) => a.nombre.localeCompare(b.nombre))
    .map((item: any) => ({
      label: item.nombre,
      value: item.idSeccionSubSeccion,
    }));
  opOfi.value = opOficinas.value;

  userInfo.value = await getUserInfo();

  form.value.etapa = props.detailsTutela.etapaProcesal.nombre;
  form.value.radicado = props.detailsTutela.idRadicado;
  form.value.tipoDoc =
    props.detailsTutela.informacionProceso.tipoDocumentoAfectado;
  form.value.numeroDoc =
    props.detailsTutela.informacionProceso.numeroDocumentoAfectado;
  form.value.afectado =
    props.detailsTutela.informacionProceso.primerNombreAfectado +
    " " +
    props.detailsTutela.informacionProceso.segundoNombreAfectado +
    " " +
    props.detailsTutela.informacionProceso.primerApellidoAfectado +
    " " +
    props.detailsTutela.informacionProceso.segundoApellidoAfectado;
  form.value.nombreComercial =
    props.detailsTutela.informacionProceso.primerNombreAfectado;
  form.value.razonSocial =
    props.detailsTutela.informacionProceso.primerApellidoAfectado;
  const fechaConvertida = moment(props.detailsTutela.fecha).format(
    "DD-MM-YYYY"
  );
  form.value.fecha = fechaConvertida;

  props.detailsTutela.usuarioEscalados.forEach((element) => {
    if (element.estado == "Escalamiento Rechazado") {
      rechazadoExist.value = true;
    }
  });

  if (rechazadoExist.value) {
    selection.value.forEach((element) => {
      var valid = props.detailsTutela.usuarioEscalados.filter(
        (x) => x.usuarioId === element.id
      );
      if (valid.length) {
        setTimeout(() => {
          cardsAsignar.value = cardsAsignar.value.filter(
            (item) => item.id != element.id
          );
          selection.value = selection.value.filter(
            (item) => item.id != element.id
          );
        }, 5);
      }
    });
  }
});

watch(
  () => form.value.pretension,
  (newOffice) => {
    // @ts-ignore
    contarImagenes();
  }
);

watch(
  () => form.value.observaciones,
  (newOffice) => {
    // @ts-ignore
    contarImagenesObs();
  }
);

const tipoIcon = (tipo) => {
  if (tipo === "pdf" || tipo === "PDF") return PDFIcon;
  if (
    tipo === "xls" ||
    tipo === "xml" ||
    tipo === "xlsx" ||
    tipo === "XLS" ||
    tipo === "XML" ||
    tipo === "XLSX"
  )
    return excelIcon;
  if (tipo === "doc" || tipo === "docx" || tipo === "DOC" || tipo === "DOCX")
    return docxIcon;
  else return NoData;
};

const rejectedFiles = (error) => {
  if (error.some((it) => it.failedPropValidation === "max-file-size")) {
    toast.error("El peso permitido es hasta 50MB.");
  }
  if (error.some((it) => it.failedPropValidation === "max-files")) {
    toast.error("Solo se pueden adjuntar 30 archivos.");
  }

  if (error.some((it) => it.failedPropValidation === "accept")) {
    toast.error(
      "Formato inválido, los formatos permitidos son (pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)."
    );
  }
};

const removeCardAsignar = (index) => {
  cardsAsignar.value.splice(index, 1);
  selection.value.splice(index, 1);
};

const clear = () => {
  router.push("/bandeja");
};

const filterOfi = (val, update) => {
  if (val === "") {
    update(() => {
      opOfi.value = opOficinas.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    opOfi.value = opOficinas.value.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

const createEscalamiento = async () => {
  datePick.value.validarFecha(form.value.fecha);
  if ((await escalar.value.validate()) && validate.value.fecha) {
    if (selection.value.length == 0) {
      errorUsers.value = true;
      toast.error("Debe seleccionar un usuario para completar la acción.");
    } else {
      confirmModal.value = true;
    }
  } else {
    toast.error(
      "Para continuar, asegúrese de que todos los campos requeridos estén completos."
    );
  }
};

const submitEscalamiento = async () => {
  selection.value.forEach((objeto) => delete objeto.enabled);
  var formEscalamiento = {
    usuarioEscalamiento: selection.value,
    usuario: userInfo.value.username,
    asunto: form.value.asunto,
    fechaNotificacion: reverseFormatDate(form.value.fecha) + "T12:00:00",
    detallePretencion: form.value.pretension,
    observacion: form.value.observaciones,
  };

  const response = await sgdeaAxios.post(
    `/tutela/${props.detailsTutela.idTutela}/escalar`,
    formEscalamiento
  );
  if (response.status == 200) {
    submitFiles();
    try {
      await crearTrazabilidad({
        proceso: `TUT${props.detailsTutela.idTutela}`,
        secuencia: props.detailsTutela.idRadicado,
        estado: props.detailsTutela.estado,
        descripcion: `Usuario: ${auth.$state.userInfo.name} \n` +
              `Motivo: ${form.value.observaciones}`,
        comentario: "Escalamiento",
        nombre: auth.$state.userInfo.name,
        tramite: "Tutela",
        accion: `${auth.$state.userInfo.name} ha escalado el trámite`,
      });
    } catch (error) {
      console.error(error);
    }
    toast.success("El escalamiento se ha realizado de manera correcta.");
    await router.push("/bandeja");
  }
};

const submitFiles = () => {
  if (form.value.archivos.length > 0) {
    var data = {
      files: form.value.archivos,
      node: props.detailsTutela.nodeId,
      userId: userInfo.value.userid,
      tutelaId: props.detailsTutela.idTutela,
      tipo: "De gestión ",
    };
    service.subirArchivos(data).then((resp) => {
      form.value.archivos = [];
      if (resp.status == 200) {
        // toast.success('Documento(s) subidos con éxito')
        emit("findDocs");
      } else {
        toast.error(
          "Hubo un error al intentar subir los documentos, intente de nuevo"
        );
      }
    });
  }
};

watch(
  () => filterValue.value,
  (newOffice) => {
    // @ts-ignore
    loadUsers(newOffice.value);
  }
);

const findRoles = (role) => {
  const nomenclatura = [
    'Administrador Master',
    'Asignador Responsable',
    'aprobador_sgdea',
    'Gestionador',
    'Radicador - Web',
    'Aprobador',
    'Asignador Líder',
    'Gestionador Escalador',
    'Administrador de Trámite'
  ];

  const userRoles = userInfo.value?.role || [];

  return role.some((element) => {
    const targetRole = nomenclatura[element];
    if (Array.isArray(userRoles)) {
      return userRoles.includes(targetRole);
    }
    return userRoles === targetRole;
  });
};

</script>

<style lang="css">
.row-disabled {
  pointer-events: none;
  opacity: 0.5;
}
</style>
