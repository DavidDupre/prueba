<style scoped src="./ModalDestinatarios.css"></style>

<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="custom-modal">
      <q-card-section>
        <h2 class="modal-title">Importación de destinatarios</h2>
        <p class="modal-subtitle">Este es el formato que debes diligenciar para poder importar destinatarios:</p>
        <div class="row q-mt-md">
          <div class="col-12">
            <q-btn label="Formato importar destinatarios.xsls" icon="fas fa-file-excel" class="icon-excel-download"></q-btn>
          </div>
        </div>
        <q-card
          ref="dropzone"
          flat
          bordered
          class="dropzone q-mt-md"
          @dragover.prevent="onDragOver"
          @drop.prevent="onDrop"
        >
          <q-card-section class="text-center q-pa-md relative-position">
            <label v-if="files === null" class="select-label cursor-pointer">Drag & Drop an Excel file here or Click to select</label>
            <input
              type="file"
              ref="fileInput"
              class="absolute-top-right"
              @change="onFilesSelected"
              style="opacity: 0; width: 100%; height: 100%; cursor: pointer;"
              accept=".xls,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            />
            <i v-if="files" class="fa-solid fa-file-excel icon-excel"></i>
            <div v-if="files">{{ files.name }}</div>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-section class="buttons-section">
        <q-btn label="Cancelar" @click="cancel" class="modal-button" />
        <q-btn label="Importar archivo" color="accent" @click="submit" class="modal-button primary" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
  import { useModalDestinatariosLogic } from './ModalDestinatarios.Logic';
  import { defineComponent } from "vue";

  export default defineComponent({
  name: "ModalDestinatarios",
  setup(_, { emit }) {
    const { options, cancel, submit, isOpen, selectedOption, onDragOver, onDrop, files, onFilesSelected  } = useModalDestinatariosLogic(emit);
    return {
      options, cancel, submit, isOpen, selectedOption, onDragOver, onDrop, files, onFilesSelected
    }
  }
});
</script>


