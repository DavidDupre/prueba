<template>
  <div>
    <BreadCrumbs :crumbs="routes" />

    <div class="tw-flex tw-justify-between tw-items-center tw-py-4">
      <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold">
        Documentos Temporales
      </div>
    </div>

    <div class="col row"></div>
    <q-card class="q-pa-md tw-mt-4 tw-rounded-xl" flat>
      <div class="tw-flex tw-justify-between">
        <p class="tw-text-2xl tw-font-bold tw-pl-6">
          Listado documentos temporales
        </p>

        <div class="tw-flex tw-gap-4 tw-p-4">
          <q-btn
            :label="`Anular${rowsSelected.length > 0 ? ' ('+rowsSelected.length+')' : '' }`"
            @click="handleAnular"
            color="negative"
            class="tw-h-10 tw-w-[150px] tw-rounded-lg"
            />
            <q-btn
            :label="`Reasignar${rowsSelected.length > 0 ? ' ('+rowsSelected.length+')' : '' }`"
            color="secondary"
            @click="handleReasignar"
            class="tw-h-10 tw-w-[150px] tw-rounded-lg"
          />
        </div>
      </div>

      <q-table
        flat
        :rows-per-page-options="[5, 25, 50, 100]"
        :rows="dataTable"
        :columns="SUBSERIES_HEADER"
        row-key="id"
        table-header-class="text-black text-h6 "
        class="q-mr-md full-width"
        rows-per-page-label="Páginas"
        selection="multiple"
        v-model:selected="rowsSelected"
      >

        <template v-slot:body-cell-acciones="props">
          <q-td class="text-center">
            <q-btn
              size="sm"
              color="secondary"
              icon="cancel"
              flat
              @click="anularNombreDocumento = props.row.nombreDocumento; anularId = props.row.id; handleAnular()"
            />
            <q-btn
              size="sm"
              color="secondary"
              icon="edit"
              flat
              @click="$router.push('/documentos/temporales/editar/'+props.row.id)"
            />
            <q-btn
              size="sm"
              color="secondary"
              icon="assignment_ind"
              flat
              @click="reasignarModal = true; reasignarModalText = `¿Está seguro de reasignar el documento temporal '${anularNombreDocumento}'?`"
            />
          </q-td>
        </template>
        <template v-slot:no-data="{ icon, message }">
          <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
            <img v-lazy :data-url="NoData" alt="" width="120" />
            <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
              {{ msgFilter ? msgFilter : "No existe data por el momento" }}
            </span>
          </div>
        </template>
      </q-table>
    </q-card>
    <Modal
          v-model:model-value="anularModal"
          title="Advertencia"
          :text="anularModalText"
          :is-success="false"
          text-button="SÍ"
          text-button-cancel="NO"
          cancel-button
          @close-modal="anularModal = false"
          @handleAccept="anularDocs"
        />
        <Modal
          v-model:model-value="anuladoModal"
          title="Exitoso"
          :text="anuladoModalText"
          :is-success="true"
          text-button="Aceptar"
          @handleAccept="anuladoModal = false"
        />
        <Modal
          v-model:model-value="errorModal"
          title="Error"
          text="¡Ha ocurrido un error!"
          :is-success="false"
          text-button="Aceptar"
          @handleAccept="handleModal"
        />

        <Modal
          v-model:model-value="reasignarModal"
          title="¡Espera un momento!"
          :text="reasignarModalText"
          :is-success="false"
          textButtonCancel="No"
          cancel-button
          @handleAccept="reasignarModal = false; usuarioModal = true"
          text-button="Si"
          @close-modal="() => (reasignarModal = false)"
        />
        <SearchModal body="En el asistente de búsqueda podrá localizar el usuario al cual desea asignar el documento temporal" title="Reasiganción documento temporal" :model-value="usuarioModal" :select-options="[]" :selected-value="usuarioValue" @handle-accept="usuarioModal = false"/>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import BreadCrumbs from "components/BreadCrumbs/BreadCrumbs.vue";
import Modal from "components/Modal/Modal.vue";
import NoData from "assets/filterImage.svg";
import SearchModal from "components/Modal/SearchModal.vue"

import { SUBSERIES_HEADER, routes } from ".";

const router = useRouter();
const anularModal = ref(false);
const anularModalText = ref("");
const anularNombreDocumento = ref("");
const anularId = ref("");
const anuladoModal = ref(false);
const anuladoModalText = ref("");
const reasignarModal = ref(false);
const reasignarModalText = ref("");
const errorModal = ref(false);
const dataTable: Ref<any[]> = ref([]);
const usuarioModal: Ref<any> = ref(false);
const usuarioValue: Ref<any> = ref("");

const rowsSelected: Ref<any[]> = ref([]);

dataTable.value = [
  {
    id: 0,
    nombreDocumento: "Archivo Tecnologia",
    usuario: "Victor Rodriguez",
    fechaElaboracion: "01/03/2023",
    formatoDocumento: "PDF",
    size: "32.5Kb",
  },
  {
    id: 1,
    nombreDocumento: "Archivo Administracion",
    usuario: "Julio Perez",
    fechaElaboracion: "04/04/2023",
    formatoDocumento: "PDF",
    size: "5Kb",
  },
  {
    id: 2,
    nombreDocumento: "Archivo Gerencia",
    usuario: "Mauricio Gomez",
    fechaElaboracion: "23/05/2023",
    formatoDocumento: "PDF",
    size: "500Kb",
  },
  {
    id: 3,
    nombreDocumento: "Clasificacion",
    usuario: "Mario Lopez",
    fechaElaboracion: "01/01/2023",
    formatoDocumento: "PDF",
    size: "125Kb",
  },
];

const msgFilter = ref("");

const handleAnular = () => {
  anularModal.value = true;
  anularModalText.value = `¿Está seguro de anular el documento temporal '${anularNombreDocumento.value}'?`
  if (rowsSelected.value.length > 0) {
    anularModalText.value = `¿Está seguro de anular ${rowsSelected.value.length} ${rowsSelected.value.length <= 1 ? 'documento temporal' : 'documentos temporales'}?`
    anularId.value = "none";
  }
  anularModal.value = true;
}

const handleReasignar = () => {
  reasignarModalText.value = `¿Está seguro de reasignar ${rowsSelected.value.length} ${rowsSelected.value.length <= 1 ? 'documento temporal' : 'documentos temporales'}?`
  reasignarModal.value = rowsSelected.value.length > 0 ? true : false;
}

const anularDocs = () => {
  if (anularId.value != "none") {
    dataTable.value = dataTable.value.filter(data => data.id !== anularId.value)
    anuladoModalText.value = `Se anuló correctamente el documento temporal '${anularNombreDocumento.value}'`;
  } else {
    const anularIds = rowsSelected.value.map(val => val.id)
    for (const anular of anularIds) {
      dataTable.value = dataTable.value.filter(data => data.id !== anular)
    }
    anuladoModalText.value = `Se anularon correctamente ${rowsSelected.value.length} ${rowsSelected.value.length <= 1 ? 'documento temporal' : 'documentos temporales'}`
    rowsSelected.value = []
  }
  anularModal.value = false;
  anuladoModal.value = true;
}
</script>
