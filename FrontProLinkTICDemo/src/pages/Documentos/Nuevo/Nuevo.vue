<template >
  <main>
    <BreadCrumbs :crumbs="crumbs" />
    <header class="tw-flex tw-justify-between tw-mb-8">
      <h2 class="tw-font-bold tw-text-2xl tw-py-4">Módulos y funcionalidades. word
      </h2>
      <nav class="flex tw-gap-3 tw-items-center">

        <q-btn :label="'Cancelar'" color="accent" class="tw-p-3" style="width: 210px;" flat
          @click="() => router.push('/documentos/plantillas')" />
        <q-btn label="Guardar cambios " style="width: 200px" class="tw-rounded-xl tw-p-3 tw-bg-[#E0F3FEB2]"
          @click="() => showModal = true" />
        <q-btn label="Guardar cambios y enviar" style="width: 200px" text-color="white"
          class="tw-rounded-xl tw-p-3 " @click="() => showModal = true" />
      </nav>
    </header>

    <iframe src="http://ec2-34-193-209-210.compute-1.amazonaws.com:8081/share/page/document-details?nodeRef=workspace://SpacesStore/b16f6ffd-7919-4183-bdac-87366eab7f18" 
      height="600" type="text/html" class="tw-w-full"></iframe>
    <Modal v-model="showModal" title="Creación exitosa"
      :text="`¿Estás seguro de guardar el documento con este nombre “ ${dataModal}”? `" is-success text-button="Si"
      @handleAccept="handleModal" cancel-button textButtonCancel="No" @closeModal="() => showModal = false" />
    <InputModal body="Nombre del documento" title="Cambiar nombre de documento" v-model="inputModal"
      @closeModal="() => inputModal = false" v-model:input="inputvalue" />

  </main>
</template>

<script setup lang="ts">
import BreadCrumbs from 'components/BreadCrumbs/BreadCrumbs.vue';
import { editCrumbs as crumbs, DOCUMENTOS_DUMMY_DATA, DOCUMENTOS_HEADER } from "../"
import Modal from 'components/Modal/Modal.vue';
import InputModal from 'components/Modal/InputModal.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const showModal = ref(false)
const dataModal = ref('')
const inputModal = ref(false)
const cancelModal = ref(false)
const inputvalue = ref('')


const handleModal = () => {
  inputModal.value = true
}
const handleCancel = () => { }
</script>
