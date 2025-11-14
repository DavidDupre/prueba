<template>
  <div class="q-py-lg">
    <a href="/facturacion/cuentas-cobro/radicadas" class="tw-text-primary" style="text-decoration: none;">
      <q-icon size="1.5em" name="chevron_left" color="primary" />
      <b>
        Volver </b>
    </a>

    <div class="tw-flex tw-items-center tw-justify-between">
      <div class="tw-flex tw-flex-col">
        <ComponentTitle class="q-mt-lg" :title="'Cuenta de cobro #' + initialData.sec ?? ''"
          classTitle="tw-font-bold tw-text-4xl" />

        <q-chip square :ripple="false"
          class="tw-border-[0.5px] tw-border-solid tw-border-[#0049ff] tw-bg-[#e5edff] tw-text-[#2c3948] tw-rounded-lg tw-mr-auto">
          {{ checkStatus(initialData.estado) }}
        </q-chip>
      </div>
    </div>

    <q-tabs :key="uiTabsKey" inline-label no-caps outside-arrows align="left"
      class=" tw-rounded-lg tw-my-4 tw-bg-white custom-tabs tw-flex rowsTab-alingCenter" indicator-color="transparent"
      active-color="primary" v-model="tab">
      <q-tab :icon="tab.icon" :key="tab.key" :name="tab.key" :label="tab.name" :ripple="false"
        class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]" v-for="tab in uiTabs"
        @click="event => handleSwitchTab(event, tab)">
      </q-tab>
    </q-tabs>

    <q-tab-panels v-model="tab" animated class="tw-bg-transparent">
      <q-tab-panel name="infoGeneral" class="q-pa-none">
        <InfoGeneral @update:data="handleUpdate" v-model:data="initialData"
          v-if="initialData && Object.keys(initialData) && Object.keys(initialData).length" />
      </q-tab-panel>
      <q-tab-panel name="reasignar" class="q-pa-none">
        <ReasignarOficina :data="initialData" @redirect="tab = 'infoGeneral'" @handleAcceptModal="saveReasignacion" />
      </q-tab-panel>
      <!-- Trazabilidad -->
      <q-tab-panel name="trazabilidad">
        <Trazabilidad :done-items="trazabilidadData" />
      </q-tab-panel>
      <q-tab-panel name="comentarios">
        <Comentarios :cobroData="initialData" :show-modal="noteModal" @closeModal="noteModal = false"
          text-default="Ha comentado sobre la radicación" />
      </q-tab-panel>
      <q-tab-panel name="gestion" class="q-pa-none">
        <q-card class="tw-rounded-xl tw-mt-4 q-pa-md" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <b class="tw-text-lg">Gestionar</b>
              </div>
            </template>

            <div class="q-pb-lg q-px-md tw-flex tw-justify-between tw-gap-8">
              <p class="tw-w-full">¿Es necesario realizar una nota de ajuste NC (Nota crédito) o ND (Nota
                debito)?</p>


            </div>
            <div class="tw-flex tw-leading-6 tw-w-1/2 tw-justify-between q-px-md">
              <q-radio v-model="realizarAjuste" label="Si" val="s"></q-radio>
              <q-radio v-model="realizarAjuste" label="No" val="n"></q-radio>
            </div>
            <div class="tw-flex-col tw-leading-6 tw-w-1/2 tw-justify-between q-px-md" v-if="realizarAjuste == 's'">

              <span class="tw-w-full">
                <label class="tw-text-label">Valor del Ajuste</label>
                <q-input label="Inserte" prefix="$" outlined class="tw-rounded-lg" dense mask="#.###.###.###"
                  unmasked-value reverse-fill-mask maxlength="10"></q-input>
              </span>
              <span class="tw-w-full">
                <label class="tw-text-label">Tipificacion</label>
                <q-select :options="['NC', 'ND']" dense flat outlined v-model="tipificacionSelect"></q-select>
              </span>
            </div>
            <div class="tw-flex tw-gap-5 tw-mt-10 tw-justify-end">
              <q-btn @click="() => modalRechazoCancelar = true" color="primary" label="Cancelar"
                class="q-px-xl"></q-btn>
              <q-btn icon="save" @click="guardarAjuste" color="secondary" label="Gestionar" class="q-pa-md"></q-btn>
            </div>
          </q-expansion-item>
        </q-card>
      </q-tab-panel>
      <q-tab-panel name="rechazar" class="q-pa-none">
        <q-form ref="rechazarForm">
          <q-card class="tw-rounded-xl tw-mt-4 tw-p-4" flat bordered>
            <q-expansion-item default-opened>
              <template v-slot:header>
                <div class="col row">
                  <b class="tw-text-lg">Rechazar</b>
                </div>
              </template>

              <div class="row q-col-gutter-md q-pb-md q-mt-sm">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <span class="text-weight-bold">Motivo de Rechazo *</span>
                  <q-select v-model="form.motivoRechazo" input-debounce="0" label="Seleccione"
                    :options="optionsMotivoRechazo" dense outlined class="tw-rounded-lg"
                    :rules="[(v) => inputRequired(v?.value)]">
                  </q-select>

                </div>

                <template v-if="form.motivoRechazo?.value.trim().toLowerCase() === 'otro'">
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <CommentTextArea v-model="form.otroMotivoRechazo" :is-required="true" :max-length="1000"
                      :min-length="10" label="Comentario" />
                  </div>
                </template>
              </div>
            </q-expansion-item>
          </q-card>

          <div class="col row justify-center q-gutter-x-md q-my-md">
            <q-btn color="accent" textColor="secondary" label="Cancelar" @click="modalRechazoCancelar = true"
              style="width: 330px; height: 60px; border-radius: 8px; font-size: 18px;" no-caps />

            <q-btn @click="validaRechazar" color="primary" label="Rechazar"
              style="width: 330px; height: 60px; border-radius: 8px; font-size: 18px;" no-caps />
          </div>
        </q-form>
      </q-tab-panel>
      <!-- Documentos relacionados -->
      <q-tab-panel name="docsRelacionados">
        <q-card class="tw-flex tw-p-2 tw-gap-10">
          <q-btn :color="typeDoc === 'De Entrada' ? 'primary' : 'grey-7'" outline icon="info" label="De entrada"
            @click="changeDocs('De Entrada')" />
          <q-btn :color="typeDoc === 'De Salida' ? 'primary' : 'grey-7'" outline icon="info" label="De salida"
            @click="changeDocs('De Salida')" />
        </q-card>
        <q-card class="tw-rounded-xl tw-mt-4 q-pa-md tw-max-w-full" flat bordered>
          <div class="col ">
            <div class="tw-flex tw-justify-between tw-mb-4">
              <p class="tw-text-lg text-weight-bold q-mx-lg">
                Listado de Documentos Cargados
              </p>
              <q-btn label="Subir un documento" color="primary" icon="add" @click="modalDocuments = true" />
            </div>
            <div class="tw-flex tw-justify-end tw-items-center w-full tw-gap-x-2 tw-py-3"
              v-if="selectedDocs.length !== 0">
              <p class="tw-text-sm tw-font-semilight q-mx-lg">
                Cantidad seleccionada: {{ selectedDocs.length }}</p>
              <q-btn label="Eliminar" color="negative" icon="delete" @click="deleteDocs" />
            </div>

            <div class="flex row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md tw-max-w-full">
              <TableDocs :DOCUMENTOS_BODY="filteredDocs" class="tw-w-full" v-model:selected-items="selectedDocs"
                :visualize="getBlobToIframe" />
            </div>
          </div>
        </q-card>
      </q-tab-panel>
      <!-- Incluir expediente -->
      <q-tab-panel name="incluirExpediente">
        <incluirExpediente :cobroData="initialData" />
      </q-tab-panel>
      <q-tab-panel name="aprobar" class="q-pa-none">

      </q-tab-panel>
      <q-tab-panel name="cambiar-aprobador" class="q-pa-none">
        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <h3 class="text-bold tw-text-xl  q-mx-md">
                  Aprobador Actual
                </h3>
              </div>
            </template>
            <div dense expand-separator class="tw-bg-white q-pa-md" style="border-radius: 5px">

              <div class="col full-width tw-justify-start justify-around q-mb-md">
                <div class="row full-width">
                  <div class="col-6">
                    <label class="q-px-md tw-text-label">Nombre
                    </label>
                    <span>
                      {{ initialData.aprobador }}
                    </span>
                  </div>

                  <div class="col-6">
                    <label class="q-px-md tw-text-label">Dependencia
                    </label>
                    <span>
                      {{ initialData.dependencia }}
                    </span>
                  </div>
                  <div class="q-mt-md q-mx-sm tw-flex tw-flex-col col-12">
                    <label class="titles block">¿Desea envíar a aprobación al usuario asignado inicialmente?
                      <div class="flex items-center tw-gap-16 q-mt-xs">
                        <q-radio v-model="asignaAprobador" val="si" label="Sí" />
                        <q-radio v-model="asignaAprobador" val="no" label="No" />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-card>
        <q-card v-if="asignaAprobador == 'no'" class="tw-rounded-xl tw-mt-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
                  Reemplazar Aprobador
                </h3>
              </div>
            </template>
            <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">

              <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex">
                <div class="width-container tw-w-1/2 q-px-sm tw-rounded-xl" style="border: 1px solid #e3e4e5">
                  <TableAsignar :TABLE_BODY="listUsers" :TABLE_HEADER="columnsAsignar"
                    @update:item-selected="handleAssign" row-key="key" :is-selection="false" type-selection="single" />
                </div>
                <div class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl"
                  style="border: 1px solid #e3e4e5">
                  <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
                    Estos son los usuarios que ha seleccionado
                  </span>
                  <div class="flex wrap tw-gap-3 q-pt-sm">
                    <div v-for="(asign, index) in cardsAsignar" :key="index">
                      <div v-if="asign.visible"
                        class="q-px-sm tw-text-base q-py-sm tw-gap-2 flex justify-between tw-text-[#2C3948] tw-rounded-3xl"
                        style="border: 1px solid #e3e4e5">
                        <q-icon size="24px" name="person_outline" />
                        {{ asign.name }}
                        <q-icon class="tw-cursor-pointer" size="24px" name="close" @click="removeCardAsignar(index)" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-card>

        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
                  Motivo de Asignación
                </h3>
              </div>
            </template>
            <div class="tw-bg-white q-mt-lg tw-p-4" style="border-radius: 5px">
              <q-form ref="secondForm">
                <div class="row full-width wrap tw-justify-start justify-around">

                  <div class="row full-width">
                    <div class="col-12">
                      <CommentTextArea v-model="asignarUsuarioBody.motivoAsignacion" :is-required="true"
                        :max-length="1000" :min-length="10" label="Observaciones" />
                    </div>
                  </div>
                </div>
                <div class="tw-flex tw-justify-center tw-p-10 q-gutter-x-md">
                  <q-btn label="Cancelar" type="reset" style="width: 240px;height: 40px;" text-color="black"
                    color="accent"
                    @click="() => { modalRechazoCancelar = true; textModal = '¿Está seguro de cancelar el envio a aprobación de la cuenta de cobro?' }"
                    class="tw-rounded-xl" />
                  <q-btn label="Asignar" text-color="white" @click="handleAprove" style="width: 240px;height: 40px;"
                    color="primary" class="tw-rounded-xl tw-btn tw-p-2" />
                </div>
              </q-form>
            </div>

          </q-expansion-item>
        </q-card>
      </q-tab-panel>
      <q-tab-panel name="cambiar-dependencia" class="q-pa-none">
        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
                  Cambiar Dependencia
                </h3>
              </div>
            </template>
            <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
              <div class="full-width q-px-lg q-pb-lg alineation tw-flex">
                <q-select v-model="selectedDependencia" map-options :options="filteredOptionsDependencias"
                  label="Seleccione" dense outlined class="tw-rounded-lg tw full-width" :rules="[inputRequired]"
                  @filter="selectOptionsFilterFn" use-input fill-input hide-selected>
                </q-select>
              </div>
            </div>
          </q-expansion-item>
        </q-card>

        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
                  Motivo de cambio
                </h3>
              </div>
            </template>
            <div class="tw-bg-white q-mt-lg tw-p-4" style="border-radius: 5px">

              <q-form ref="formCambiarAprobador" @submit.prevent="handleDependenciaForm">
                <div class="row full-width wrap tw-justify-start justify-around">

                  <div class="row full-width">
                    <div class="col-12">
                      <CommentTextArea v-model="asignarUsuarioBody.motivoAsignacion" :is-required="true"
                        :max-length="1000" :min-length="1" label="Observaciones" />
                    </div>
                  </div>
                </div>
                <div class="tw-flex tw-justify-center tw-p-10 q-gutter-x-md">
                  <q-btn label="Cancelar" type="reset" style="width: 240px;height: 40px;" text-color="black"
                    color="accent" class="tw-rounded-xl" />
                  <q-btn label="Asignar" text-color="white" type="submit" style="width: 240px;height: 40px;"
                    color="primary" class="tw-rounded-xl tw-btn tw-p-2" />
                </div>
              </q-form>
            </div>

          </q-expansion-item>
        </q-card>
      </q-tab-panel>
      <q-tab-panel name="metadatos" class="q-pa-none">
        <Metadatos :metadatos="metadatos" />
      </q-tab-panel>
    </q-tab-panels>
    <ConfirmModal text-cancel-modal="No" text-confirm-modal="Si" :text-show-modal="textModal"
      @update:show-modal="() => (modalRechazoCancelar = false)"
      @confirm-modal="modalRechazoCancelar = false; tab = 'infoGeneral'" v-model:show-modal="modalRechazoCancelar" />
    <ConfirmModal text-cancel-modal="No" text-confirm-modal="Si"
      text-show-modal="¿Está seguro de aprobar la cuenta de cobro?"
      @update:show-modal="() => (modalAprobarConfirmar = false)" @confirm-modal="handleAprobar"
      :show-modal="modalAprobarConfirmar" />
    <ConfirmModal text-cancel-modal="No" text-confirm-modal="Si" text-show-modal="¿Está seguro de enviar a aprobación?"
      @update:show-modal="() => (modalEnviarAprobarConfirmar = false)" @confirm-modal="handleReasignarForm"
      :show-modal="modalEnviarAprobarConfirmar" />

    <Modal v-model="rechazarConfirmar" title="Confirmación" text-button-cancel="No" :is-success="false" text-button="Si"
      @handleAccept="handleRechazar" cancel-button text="¿Está seguro de enviar a rechazo?"
      @close-modal="() => rechazarConfirmar = false" type="button" />
    <q-dialog v-model="modalDocuments" persistent>
      <q-card class="tw-p-5">
        <q-card-section class="row tw-p-4">
          <span class="tw-text-slate-500 text-center tw-text-2xl">
            Cargue un nuevo documento para la cuenta de cobro
          </span>
        </q-card-section>
        <q-card-section class="row tw-p-4">
          <FileLoader class="tw-w-full" v-model="newFileInput" multiple
            accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
            max-file-size-label='50' :maxFileSize="50 * 1024 * 1024" @rejected="rejected" />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn label="Cancelar" color="secondary" @click="modalDocuments = false" />
          <q-btn label="Subir" color="primary" @click="handleUploadFile" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
  <div v-if="visualizadorPDF" class="tw-h-full tw-w-full">
    <q-dialog v-model="visualizadorPDF" seamless position="right" class="">
      <q-card class="tw-h-full tw-w-[2000px] tw-z-[1000] tw-overflow-hidden">
        <q-btn @click="visualizadorPDF = false"
          class="tw-absolute tw-ml-12 tw-mt-3 tw-z-[2000] tw-text-white tw-bg-red-500">Cerrar</q-btn>
        <iframe class="tw-h-full tw-w-full" :src="iframePdfUrl" frameborder="0"></iframe>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import moment from "moment";
import { QForm } from "quasar";
import ComponentTitle from "src/components/ComponentTitle/ComponentTitle.vue";
import FileLoader from "src/components/FormFields/FileLoader.vue";
import ConfirmModal from "src/components/Modal/ConfirmModal.vue";
import Modal from "src/components/Modal/Modal.vue";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import {
  inputRequired,
} from "src/helpers/validations";
import Trazabilidad from "src/pages/Expedientes/Trazabilidad/Trazabilidad.vue";
import { useAuthStore } from "src/stores/auth.store";
import { computed, onMounted, ref, watch } from "vue";
import { columnsAsignar } from ".";
import InfoGeneral from './components/InfoGeneral.vue';
import Comentarios from './components/comentarios.vue'
// @ts-ignore
import TableDocs from "pages/Facturacion/cobro/components/TableDocs.vue";
import TableAsignar from "src/components/Tables/TableAsignar.vue";
import { checkStatus } from "src/helpers/checkStatus";
import { toast } from "src/helpers/toast";
import { DocumentoRadicado, SelectInput } from "src/interfaces";
import { sgdeaAxios } from "src/services";
import { onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import incluirExpediente from "./IncluirExpediente/incluirExpediente.vue";
import Metadatos from 'src/components/metadtos/DynamicFields/Metadatos.vue';
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";
import ReasignarOficina from 'src/shared/components/ReasignarOficina/reasignacion.vue'

interface UITab {
  key: string;
  icon: string;
  name: string;
}

const asignaAprobador = ref('si')
const modalDocuments = ref(false);
const rechazarForm = ref()
const rechazarConfirmar = ref(false)
const textModal = ref("");
const newFileInput = ref<any>([]);

const tab = ref('infoGeneral')
const realizarAjuste = ref('n')
const modalAprobarConfirmar = ref(false);
const modalEnviarAprobarConfirmar = ref(false);
const modalRechazoCancelar = ref(false)
const uiTabsKey = ref(0)
const listUsers = ref([]);
const listUsersDependencia = ref([]);
const initialData = ref<any>({});
const noteModal = ref(false);
const form = ref({
  motivoRechazo: {
    label: '',
    value: '',
  },
  otroMotivoRechazo: '',
  comentario: ''
});
const metadatos = ref([])
const isMetadatos = ref(false)

const cardsAsignar = ref([])
const cardsAsignarDep = ref([])
const typeDoc= ref('De Entrada')

const optionsMotivoRechazo: SelectInput[] = [
  {
    label: 'El valor remitido a través de XML no coincide con el valor de la representación gráfica.',
    value: 'El valor remitido a través de XML no coincide con el valor de la representación gráfica.',
  },
  {
    label: 'Los servicios cobrados, no coinciden con los del valor de la factura o cuenta de cobro.',
    value: 'Los servicios cobrados, no coinciden con los del valor de la factura o cuenta de cobro.',
  },
  {
    label: 'El número de la factura ya se encuentra radicada en la base de datos de POSITIVA.',
    value: 'El número de la factura ya se encuentra radicada en la base de datos de POSITIVA.',
  },
  {
    label: 'La fecha de la factura o cuenta de cobro debe ser del mismo mes que se va a gestionar no se reciben facturas de meses anteriores.',
    value: 'La fecha de la factura o cuenta de cobro debe ser del mismo mes que se va a gestionar no se reciben facturas de meses anteriores.',
  },
  {
    label: 'Otro',
    value: 'Otro',
  },
];

const uiTabs: UITab[] = [
  {
    key: 'infoGeneral',
    icon: 'info',
    name: 'Información General'
  },
  {
    key: 'trazabilidad',
    icon: 'timer',
    name: 'Trazabilidad'
  },
  {
    key: 'docsRelacionados',
    icon: 'folder',
    name: 'Documentos Relacionados'
  },
  {
    key: 'comentarios',
    icon: 'comments',
    name: 'Comentarios'
  },
  {
    key: 'incluirExpediente',
    icon: 'folder',
    name: 'Incluir Expediente'
  },
  {
    key: 'cambiar-aprobador',
    icon: 'person',
    name: 'Cambiar Aprobador'
  },
  {
    key: 'cambiar-dependencia',
    icon: 'autorenew',
    name: 'Cambiar Dependencia'
  },
  {
    key: 'enviarAprobacion',
    icon: 'check_circle',
    name: 'Enviar a Aprobación'
  },
  {
    key: 'aprobar',
    icon: 'task_alt',
    name: 'Aprobar'
  },
  {
    key: 'rechazar',
    icon: 'cancel',
    name: 'Rechazar'
  },
  {
    key: 'metadatos',
    icon: 'folder_open',
    name: 'Metadatos'
  },
  {
    key: "reasignar",
    icon: "move_up",
    name: "Reasignar",
  },
];

const optionsDependencias = ref<SelectInput[]>([
  { label: 'GERENCIA JURÍDICA', value: 'GERENCIA JURÍDICA' },
  { label: 'OFICINA DE CONTROL DISCIPLINARIO', value: 'OFICINA DE CONTROL DISCIPLINARIO' },
  { label: 'OFICINA DE CONTROL INTERNO', value: 'OFICINA DE CONTROL INTERNO' },
  { label: 'OFICINA DE ESTRATEGIA Y DESARROLLO', value: 'OFICINA DE ESTRATEGIA Y DESARROLLO' },
  { label: 'OFICINA DE GESTIÓN INTEGRAL DE RIESGOS', value: 'OFICINA DE GESTIÓN INTEGRAL DE RIESGOS' },
  { label: 'OFICINA DE TECNOLOGÍAS DE LA INFORMACIÓN', value: 'OFICINA DE TECNOLOGÍAS DE LA INFORMACIÓN' },
  { label: 'PRESIDENCIA', value: 'PRESIDENCIA' },
  { label: 'SECRETARÍA GENERAL Y JURÍDICA', value: 'SECRETARÍA GENERAL Y JURÍDICA' },
]);
const filteredOptionsDependencias = ref<SelectInput[]>([]);

const nameDocument = ref('');
const iframePdfUrl = ref('');
const visualizadorPDF = ref(false);

const loadedDocs = ref<any[]>([]);
const selectedDocs = ref<any[]>([]);
const route = useRoute();
const router = useRouter();
const routeNumber = ref<string | string[]>('');
const auth = useAuthStore()
const trazabilidadData = ref<any[]>([])

const secondForm = ref()

const formCambiarAprobador = ref()

async function handleUploadFile() {
  const files: File[] | File = newFileInput.value;

  if (Array.isArray(files) && files.length === 0 || files === null) {
    toast.error("Debe seleccionar un archivo");
    return;
  }

  if (files.length > 20) {
    toast.error("Solo puede subir 20 archivos a la vez");
    return;
  }

  const formData = new FormData();
  for (const file of Array.isArray(files) ? files : [files]) {
    formData.append("anexos", file);
  }

  formData.append("idRadicado", initialData.value.nodeId);
  formData.append("descripcionRadicado", "CTO");

  try {
    const { data } = await sgdeaAxios.post("/api/v1/integracion/alfresco/agregarAnexos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (data) {
      toast.success("Archivo cargado correctamente");
      await crearTrazabilidad({
        proceso: "FAC" + initialData.value.idFactura,
        secuencia: initialData.value.sec,
        estado: initialData.value.estado,
        descripcion: "Se ha adjuntado un documento a la cuenta de cobro",
        comentario: 'Adjunto',
        nombre: auth.$state.userInfo.name
      })
      modalDocuments.value = false;
      getData()
    }
  } catch (error) {
    toast.error("Error al cargar el archivo");
  }
}

const handleUpdate = async (props: any) => {
  const response = await sgdeaAxios.put("/facturacion/actualizarCto", props)
  if (response.data.mensaje) {
    initialData.value = response.data.cto;
    await crearTrazabilidad({
      proceso: "CTO" + initialData.value.idCto,
      secuencia: initialData.value.sec,
      estado: initialData.value.estado,
      descripcion: "Se ha editado la información de la cuenta de cobro",
      comentario: "Adjunto",
      nombre: auth.$state.userInfo.name
    })
  } else {
    toast.error('Error al editar el radicado')
  }
}

const validaRechazar = async () => {
  if (await rechazarForm.value.validate()) {
    rechazarConfirmar.value = true
  } else {
    toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos.")
  }
}

const selectOptionsFilterFn = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredOptionsDependencias.value = optionsDependencias.value
    })
    return
  }
  update(() => {
    filteredOptionsDependencias.value = optionsDependencias.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const updateUiTabs = (key: string, add: boolean) => {
  const index = uiTabs.findIndex(tab => tab.key === key);
  if (add && index === -1) {
    uiTabs.push({
      key,
      icon: '',
      name: ''
    });
  } else if (!add && index !== -1) {
    uiTabs.splice(index, 1);
  }
  uiTabsKey.value++
};

const selectedDependencia = ref({ label: '', value: '' })

watch(
  () => selectedDependencia.value,
  async (newVal) => {
    const response = await sgdeaAxios.get(`/roles/usuarios?rol=${'Asignador Responsable'}`);
    listUsersDependencia.value = response.data
      .filter((responsable: any) => responsable.enabled).map((item) => ({
        colaborador: item.firstname + ' ' + item.lastname,
        cargo: item.cargo.nombre,
        id: item.id,
        user: item.userName,
        grupo: item.usuarioRelaciones.length ? item.usuarioRelaciones[0]?.nombre : ''
      }))
  }
)


const getBlobToIframe = async (id: string) => {
  const { data } = await sgdeaAxios.get<DocumentoRadicado>(
    `/radicados/consultar_documento/${id}`
  );

  if (id) {
    nameDocument.value = loadedDocs.value.find((it) => it.id === id)?.nombre
  }

  const byteCharacters = atob(data.base64x);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });

  iframePdfUrl.value = URL.createObjectURL(blob);

  visualizadorPDF.value = true
}


onBeforeMount(async () => {
  routeNumber.value = route.params.id;
});

const removeCardAsignar = (index) => {
  cardsAsignar.value.splice(index, 1);
};

const asignarUsuarioBody = ref({
  type: 'FACTURA',
  id: parseInt(route.params.id as string),
  usuarioAsignado: '',
  motivoAsignacion: ''
})

const handleAssign = (array: any[]) => {
  cardsAsignar.value = array.map((item) =>
  ({
    name: item.colaborador,
    visible: true,
    user: item.user
  }),

    array.map(item => {
      asignarUsuarioBody.value.usuarioAsignado = item.colaborador;
    }),
  );
};

const cuentaCobroNotFound = (id?: number | string) => {
  let message = 'Cuenta de cobro no existe';

  if (Boolean(id)) {
    message = 'Cuenta de cobro con id ' + id + ' no existe.'
  }
  toast.error(message);
  router.replace('/facturacion/cuentas-cobro/');
}

async function getDependencies() {
  const { data } = await sgdeaAxios.get('/seccionSubSeccion')
  optionsDependencias.value = data.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((dependencia: any) => ({
    label: dependencia.nombre,
    value: dependencia.idSeccionSubSeccion
  }))
  filteredOptionsDependencias.value = optionsDependencias.value
}

const getData = async () => {
  const idParams = route.params.id as string
  if (!idParams) cuentaCobroNotFound(idParams)

  try {
    const id = parseInt(idParams)
    const response = await sgdeaAxios.get('/facturacion/geCto/' + id);

    if (response.status !== 200) cuentaCobroNotFound(id);

    initialData.value = {
      ...response.data.cto,
      fechaRadicar: response.data.cto.fechaFormateada.split(' ')[0],
      horaInicio: response.data.cto.fechaFormateada.split(' ')[1],
    };
    await getDimanicDatos()

    if (!isMetadatos.value) {
      updateUiTabs('metadatos', false)
    }

    if ((initialData.value.estado) == 'Para gestión') {
      updateUiTabs('aprobar', false)
      updateUiTabs('reasignar', false)
      // updateUiTabs('enviarAprobacion', false)
    } else if ((initialData.value.estado) == 'Por aprobar') {
      updateUiTabs('enviarAprobacion', false)
      updateUiTabs('incluirExpediente', false)
      updateUiTabs('comentarios', false)
      updateUiTabs('cambiar-aprobador', false)
      updateUiTabs('cambiar-dependencia', false)
      updateUiTabs('reasignar', false)
    }

    //filterTabs(initialData.value.estado.toLowerCase())
  } catch (error) {
    cuentaCobroNotFound(idParams)
  }

  try {
    const response = await sgdeaAxios.get('/radicados/obtenerHijosPorNodo/' + initialData.value.nodeId);

    if (response.status !== 200 && response.status !== 201) {
      return;
    }

    const docs = response.data.list.entries.map((doc) => {
      return {
        nombreDocumento: doc?.entry.name,
        tipoDocumento: doc?.entry.name.startsWith('SAL') ? 'De Salida' : 'De Entrada',
        fechaCargue: moment(doc?.entry?.createdAt, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('DD/MM/YYYY'),
        cargadoPor: doc?.entry.createdByUser?.displayName,
        nodeId: doc?.entry.id
      }
    });
    loadedDocs.value = docs;
  } catch (error) {
    console.error(error);
  }
}

async function getDimanicDatos() {
  const user = auth?.$state?.userInfo
  const rolUserId = user.relations.find(it => it.rol === user.role)

  const getEstados = (await sgdeaAxios.get('/estadosProceso/all')).data
  const estadoProceso = getEstados.find((it) => it.estado === initialData.value.estado)

  const { data: getDimanicDatos } = await sgdeaAxios.get(`/parametrizacion-formulario/ListadoParametrizacion?id_flujo=5&id_rol=${rolUserId.idRol}&id_oficina=${user.oficina ? user.oficina : ''}&id_estado_proceso=${estadoProceso.id}`)

  if (getDimanicDatos.content.length > 0) {
    isMetadatos.value = true
    metadatos.value = await getDimanicDatos.content
  } else {
    isMetadatos.value = false
  }
}

const deleteDocs = async () => {
  try {
    for (const selectedDoc of selectedDocs.value) {
      const response = await sgdeaAxios.delete('/alfresco/deleteFile/' + selectedDoc.nodeId);
      if (response.status === 200) {
        toast.success('Documento eliminado con éxito');
        getData();
      }
    }
    selectedDocs.value = [];
  } catch (error) {
    toast.error('Ocurrió un problema al eliminar el documento');
  }
}

onMounted(getData)

const handleSwitchTab = async (_, currentTab: UITab) => {
  if (currentTab.key === 'rechazar') {
    tab.value = 'rechazar';
  } else if (currentTab.key === 'aprobar') {
    tab.value = 'infoGeneral'
    modalAprobarConfirmar.value = true;

  } else if (currentTab.key === 'trazabilidad') {
    await getTrazabilidad()
  } else if (currentTab.key === 'enviarAprobacion') {
    tab.value = 'infoGeneral'
    modalEnviarAprobarConfirmar.value = true;
  } else if (currentTab.key === 'cambiar-dependencia') {
    tab.value = 'cambiar-dependencia'
    getDependencies()
  } else if (currentTab.key === 'cambiar-aprobador') {
    tab.value = 'cambiar-aprobador'
    await getAllRegisters();
  }

}

const handleAprobar = async () => {
  try {
    const id = route.params?.id as string

    if (!id) return;

    const response = await sgdeaAxios.put('/facturacion/actualizarEstadoCuentasCobro/' + id, {
      estado: "Aprobado",
      motivo: 'Aprobado'
    });

    if (response.status === 200) {
        const mensaje = response.data.mensaje;
        let notifyType = '';
        let notifyMessage = '';
        switch (mensaje) {
          case 'Aprobacion exitosa':
            notifyType = 'positive';
            notifyMessage = 'Trámite aprobado correctamente.';
            break;
          case 'El id buscado no existe':
          case 'el estado no es Por aprobar':
            notifyType = 'negative';
            notifyMessage = 'Ocurrió un problema al aprobar el trámite. ' + mensaje;
            break;
        }
        if (notifyType && notifyMessage) {
          if (notifyType === 'positive') {
            toast.success(notifyMessage);
          } else {
            toast.error(notifyMessage);
          }
        }

        if (mensaje == "Aprobacion exitosa") {
          await crearTrazabilidad({
            proceso: "CTO" + initialData.value.idCto,
            secuencia: initialData.value.sec,
            estado: "Aprobado",
            descripcion: "Se ha aprobado la cuenta de cobro",
            comentario: "Aprobado",
            nombre: auth.$state.userInfo.name
          })
        }
      }
  } catch (error) {
    toast.error('Ocurrió un problema al aprobar el radicado.');
  }

  router.push('/facturacion/cuentas-cobro/radicadas')
}

const handleRechazar = async () => {
  try {
    const id = route.params?.id as string

    if (!id) return;
    let response = { status: null }

    let motivo = ''

    if (form.value.motivoRechazo.value.trim().toLowerCase() === 'otro') {
      motivo = form.value.otroMotivoRechazo
    } else {
      motivo = form.value.motivoRechazo.value;
    }
    if (initialData.value.estado.toLowerCase() == 'para gestión') {
      response = await sgdeaAxios.put(`/facturacion/updateFacAdminCto/${id}`, {
        "aprobadorUsuario": auth.$state.userInfo.name,
        "gestionObs": 'rechazado',
        "tipo": "CUENTA",
        "state": "RECHAZADA"
      });
    } else {
      response = await sgdeaAxios.put('/facturacion/actualizarEstadoCuentasCobro/' + id, {
        estado: initialData.value.estado == 'Por aprobar' ? "Aprobación rechazada" : "Gestión rechazada",
        motivo,
      });
    }


    if (response.status === 200) {
      toast.success('La radicación ha sido rechazada con éxito.')

      await crearTrazabilidad({
        proceso: "CTO" + initialData.value.idCto,
        secuencia: initialData.value.sec,
        estado: "Rechazado",
        descripcion: "Se ha rechazado la cuenta de cobro",
        comentario: motivo,
        nombre: auth.$state.userInfo.name
      })
    } else {
      toast.error('Ocurrió un problema al rechazar.');
    }
  } catch (error) {
    toast.error('Ocurrió un problema al rechazar.');
  }

  router.push('/facturacion/cuentas-cobro/radicadas')
}

const handleAprove = async () => {
  if (asignaAprobador.value == 'no' && !cardsAsignar.value.length) {
    toast.error('Debe seleccionar un usuario para continuar con la aprobación');
    return;
  } else if (await secondForm.value.validate()) {
    modalEnviarAprobarConfirmar.value = true
  } else {
    toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos');
  }
}

const guardarAjuste = async () => {
  try {
    const id = <number>initialData.value.idCto;
    const response = await sgdeaAxios.put(`/facturacion/updateFacAdminCto/${id}`, {
      "aprobadorUsuario": auth.$state.userInfo.name,
      "gestionObs": '',
      "gestionValorAjuste": 0,
      "tipo": "CUENTA",
      "state": "APROBAR"
    });
    await crearTrazabilidad({
      proceso: "CTO" + initialData.value.idCto,
      secuencia: initialData.value.sec,
      estado: "Gestionado",
      descripcion: "Se ha enviado la cuenta de cobro a aprobación",
      comentario: "Gestionado",
      nombre: auth.$state.userInfo.name
    })
    toast.success('La radicación ha sido gestionada con éxito.');
    router.push('/facturacion/cuentas-cobro/radicadas')
  } catch (error) {
    toast.error('Ocurrió un problema al gestionar la radicación.');
  }
}

// const response = await sgdeaAxios.get('/trazabilidad/obtenerPorCodProceso/TUT22142');
// const getTrazabilidad = async () => {
//   const response = await sgdeaAxios.get('/trazabilidad/obtenerPorCodProceso/' + 'CTO' + initialData.value.idCto);
//   trazabilidadData.value = response.data
//   //   ?.sort((a, b) => a.id - b.id)
//   //   ?.map((item, index) => ({
//   //     detalle: item.comentario,
//   //     fecha: moment(item.fechaHora).add(1, 'day').format('DD/MM/YYYY HH:mm:ss'),
//   //     estado: item.estado,
//   //     usuario: item.nombre,
//   //     cargoUsuario: item.cargoUsuario,
//   //     action: item?.accion ?? item.descripcion,
//   //     tramite: item.tramite,
//   //     index: index + 1,
//   //   }));
// }

const getTrazabilidad = async () => {
  const response = await sgdeaAxios.get('/trazabilidad/obtenerPorCodProceso/' + 'CTO' + initialData.value.idCto);
  if (!response?.data || response.data.length === 0) {
      trazabilidadData.value = [];
      return;
    }

    trazabilidadData.value = response.data
      .sort((a, b) => a.id - b.id)
      .map((item, index) => ({
        ...item,
      // action: item?.accion ?? item.descripcion,
      }));
}

async function getAllRegisters() {
  try {
    let role = "Aprobador"
    if (initialData.value.estado.toLowerCase() == 'por asignar') {
      role = "Gestionador"
    }
    const { data } = await sgdeaAxios.get(`/roles/usuarios?rol=${role}`);

    const usuarios = [];
    data.filter((responsable: any) => responsable.enabled).forEach((item) => {
      // Filtrar las relaciones que tienen el rol buscado
      const relacionesFiltradas = item.usuarioRelaciones.filter(
        (relacion: any) => relacion.rol.nombre === role
      );

      // Crear una entrada por cada relación
      relacionesFiltradas.forEach((relacion: any) => {
        usuarios.push({
          colaborador: item.firstname + ' ' + item.lastname,
          cargo: item.cargo.nombre,
          id: item.id,
          user: item.userName,
          grupo: relacion.oficina?.nombre || '',
          key: `${item.id}-${relacion.oficina?.id}`,
        });
      });
    });

    listUsers.value = usuarios;
  } catch (error) {
    console.error(error)
  }
}

const handleReasignarForm = async () => {
  if (asignaAprobador.value == 'si') {
    await guardarAjuste()
  } else {
    const sendData = { ...initialData.value };

    // Remove the property
    delete sendData.fechaFormateada;

    const response = await sgdeaAxios.put('/facturacion/actualizarCto', {
      ...sendData,
      aprobador: cardsAsignar.value[0].name,
    });
    await crearTrazabilidad({
      proceso: "CTO" + initialData.value.idCto,
      secuencia: initialData.value.sec,
      estado: initialData.value.estado,
      descripcion: "Se ha cambiado el aprobador a " + cardsAsignar.value[0].name,
      comentario: "Reasignado",
      nombre: auth.$state.userInfo.name
    })
    await guardarAjuste()
  }
}


const handleDependenciaForm = async () => {
  if (await formCambiarAprobador.value.validate()) {
      const id = route.params?.id as string
      try {
        await getData()
        const editData = initialData.value
        delete editData.fechaFormateada
        await sgdeaAxios.put('/facturacion/actualizarCto', {
          ...initialData.value,
          dependencia: selectedDependencia.value.label,
        })
        await crearTrazabilidad({
          proceso: "CTO" + initialData.value.idCto,
          secuencia: initialData.value.sec,
          estado: initialData.value.estado,
          descripcion: "Se ha cambiado la dependencia de la cuenta de cobro",
          comentario: "Adjunto",
          nombre: auth.$state.userInfo.name
        })
        toast.success('El radicado ha cambiado de dependencia correctamente')
        router.push('/bandeja')
      } catch (error) {
        toast.error('Ocurrió un problema al cambiar la dependencia del radicado')
      }


  } else {
    toast.error('Por favor diligencie todos los campos requeridos')
  }
}

const rejected = (file: any[]) => {
  if (file[0].failedPropValidation === "accept") {
    toast.error("El archivo no cumple con alguno de los formatos permitidos");
  } else if (file[0].failedPropValidation === "max-file-size") {
    toast.error("El archivo excede el tamaño permitido (50MB)");
  }
}

const saveReasignacion = async (event) => {
  try {
    const oficinaFinal = [];
    oficinaFinal.push(event.oficinaId);
    const response = await sgdeaAxios.put(`/oficinas/reasignar`, {
      idFlujo: 9,
      idCaso: initialData.value.idCto,
      idOficina: oficinaFinal
    })
    if (response.status == 200 || response.status == 201) {
      toast.success('El caso se reasigno con éxito');
      await crearTrazabilidad({
        proceso: "CTO" + initialData.value.idCto,
        secuencia: initialData.value.sec,
        estado: initialData.value.estado,
        descripcion: "Se ha reasignado la oficina del radicado",
        comentario: event.motivoAsignacion,
        nombre: auth.$state.userInfo.name,
        accion: `${auth.$state.userInfo.name} ha reasignado la oficina del radicado ${initialData.value.sec}`,
        tramite: 'Cuentas de Cobro',
      })
      router.push('/facturacion/cuentas-cobro/radicadas')
    }
  } catch (error) {
    toast.error(error?.response?.data?.message)
  }
}
const filteredDocs = computed(() => {
  return loadedDocs.value.filter(doc => doc.tipoDocumento === typeDoc.value);
});

const changeDocs=(type)=> {
      typeDoc.value = type;
    }
</script>

<style>
.titles {
  color: #6B737C;
  font-weight: bold;
  margin-top: 10px;
}
</style>
