<template>
  <div>
    <a href="/sgda/administracion" class="text-primary q-mb-md block" style="text-decoration: none;">
      <q-icon size="1.5em" name="chevron_left" color="accent"></q-icon>
      <b>
        Volver
      </b>
    </a>
    <div>
      <BreadCrumbs :crumbs="crumbs" />
      <h2 class="tw-font-bold tw-text-4xl tw-py-6">Detalle tipo documental</h2>
    </div>

    <div>
      <q-form ref="editForm" @submit="editRadicado" class=" tw-bg-white tw-p-8 tw-rounded-xl flex-wrap " autofocus>

        <!-- <h3 class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold ">Nombre tipo documental (Largo) *</h3> -->


        <div class="tw-rounded-lg tw-p-2" flat>

          <div class="tw-flex tw-flex-wrap tw-full q-col-gutter-md tw-mt-2">
            <div class="tw-w-1/2">
              <p class="tw-text-label tw-font-bold">Código tipo documental</p>
              <span>{{ dataForm.id_tipo_documental }}</span>
            </div>
            <div class="tw-w-1/2">
              <p class="tw-text-label tw-font-bold">Descripción</p>
              <span>{{ dataForm.descripcion }}</span>
            </div>
            <div class="tw-w-1/2">
              <p class="tw-text-label tw-font-bold">Término trámite</p>
              <span>{{ dataForm.terminoTramite }}</span>
            </div>
            <div class="tw-w-1/2">
              <p class="tw-text-label tw-font-bold">Tipo de Radicado</p>
              <span>{{ dataForm.tipoRadicado }}</span>
            </div>
            <div class="tw-w-1/2">
              <p class="tw-text-label tw-font-bold tw-mb-2">Estado</p>
              <span
                :class="`tw-border ${dataForm.estado === true ? 'tw-border-green-700 tw-bg-green-100' : 'tw-border-gray-400 tw-bg-gray-200'} tw-rounded-xl tw-py-1 tw-px-4`">{{ dataForm.estado
                  === true ? 'Activo' : 'Inactivo' }}</span>
            </div>
            <!-- <div class="tw-w-1/2">
              <p class="tw-text-label tw-font-bold">Código tipo documental</p>
              <span>{{dataForm.descripcion}}</span>
            </div>
            <div class="tw-w-1/2">
              <p class="tw-text-label tw-font-bold">Nombre tipo documental (Largo) </p>
              <span>5756867867</span>
            </div>
            <div class="tw-w-1/2">
              <p class="tw-text-label tw-font-bold">Nombre corto (Sigla) </p>
              <span>Persona natural</span>
            </div>
            <div class="tw-w-1/2">
              <p class="tw-text-label tw-font-bold">Tipo documento</p>
              <span>Laura Sánchez</span>
            </div>
            <div class="tw-w-1/2">
              <p class="tw-text-label tw-font-bold">¿Es documento tipo plantilla?</p>
              <span>Si</span>
            </div>
            <div class="tw-w-1/2">
              <p class="tw-text-label tw-font-bold">¿Es un documento indexable? </p>
              <span>Si</span>
            </div>
            <div class="tw-w-1/2">
              <p class="tw-text-label tw-font-bold">¿Es un documento de gestión? </p>
              <span>Si</span>
            </div>
            <div class="tw-w-1/2">
              <p class="tw-text-label tw-font-bold">Sigla índice</p>
              <span>AVV</span>
            </div> -->
          </div>

          <!-- <div class="tw-flex  tw-full q-col-gutter-md tw-mt-2">
            <div class="tw-w-full">
              <p class="tw-text-label tw-font-bold">Descripción Índice </p>
            </div>

          </div>

          <div class="tw-flex tw-flex-wrap tw-full q-col-gutter-md tw-mt-2">
            <div class="tw-w-1/4">
              <p class="tw-text-label tw-font-bold">Label Índice</p>
              <span>Si</span>
            </div>
            <div class="tw-w-1/4">
              <p class="tw-text-label tw-font-bold">Bloqueo índice</p>
              <span>Si</span>
            </div>
            <div class="tw-w-1/4">
              <p class="tw-text-label tw-font-bold">Exigido Índice</p>
              <span>Si</span>

            </div>
            <div class="tw-w-1/4">
              <p class="tw-text-label tw-font-bold">Único Índice</p>
              <span>Si</span>

            </div>
            <div class="tw-w-1/4">
              <p class="tw-text-label tw-font-bold">Unico Índice</p>
              <span>Si</span>
            </div>
            <div class="tw-w-1/4">
              <p class="tw-text-label tw-font-bold">Indexable índice</p>
              <span>Si</span>
            </div>
            <div class="tw-w-1/4">
              <p class="tw-text-label tw-font-bold">Editable Índice</p>
              <span>Si</span>

            </div>
            <div class="tw-w-1/4">
              <p class="tw-text-label tw-font-bold">¿Es documento plantilla, Tipo formulario?</p>
              <span>Si</span>

            </div>
            <div class="tw-w-1/4">
              <p class="tw-text-label tw-font-bold">Estado</p>
              <span
                class="tw-border tw-border-green-700 tw-bg-green-100   tw-rounded-xl  tw-py-1 tw-px-4 mt-2">Activo</span>

            </div>
          </div>

          <div class="tw-flex  tw-full q-col-gutter-md tw-mt-2">

            <div class="tw-w-1/2 tw-mt-4">
              <p class="tw-text-label tw-font-bold">Plantilla adjunta</p>
              <article class=" q-pa-md tw-border tw-rounded-md">
                <div class="row tw-items-center">
                  <img :src="pdf" alt="">
                  <h4 class="tw-font-bold   q-pl-sm tw-mr-auto tw-items-center">Módulos y funcionalidades</h4>
                </div>
                <img :src="formatDummy" alt="">
                <div class="row">
                  <q-btn icon="download" flat color="blue-10" class="tw-ml-auto align">Descargar</q-btn>

                </div>
              </article>
            </div>

            <div class="tw-w-1/2 tw-mt-4">
              <p class="tw-text-label tw-font-bold">Observaciones</p>
            </div>
          </div> -->
        </div>


      </q-form>
    </div>

    <Modal v-model="showModal" title="Edición exitosa"
      :text="`El tipo documental ${dataForm.termino_tramite} ${dataForm.descripcion} fue modificado correctamente.`"
      is-success text-button="¡Ok!" @handleAccept="handleModal" />

    <Modal v-model="cancelModal" title="¡Espera un momento!"
      text="¿Está seguro de abandonar la creación del tipo documental en curso?" :is-success="false" text-button="Si"
      @handleAccept="handleCancel" cancel-button textButtonCancel="No" @close-modal="() => cancelModal = false" />


    <Modal v-model="errorModal" title="Error" text="¡Ha ocurrido un error!" :is-success="false" text-button="Aceptar"
      @handleAccept="handleModal" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";

import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';
import { IDataDocumental, stateOptions } from "pages/SGDA/Administracion";
import { radicadoOptions } from '../../../../constantes/tipoRadicado'
import Modal from 'components/Modal/Modal.vue';
import { routes } from "../"
import service from "src/services/Api";

const radicado_options_op = ref([]);
import { sgdeaAxios } from '../../../../services/index';


const route = useRoute()
const router = useRouter()
const showModal = ref(false)
const errorModal = ref(false)
const cancelModal = ref(false)

const dataModal = ref("")
const editForm = ref()
const idSerie = ref()
const dataForm: Ref<IDataDocumental> = ref(
  {
    descripcion: "",
    estado: false,
    id_tipo_documental: 0,
    termino_tramite: 0,
    tipoRadicadoId: "",
    observaciones: "",
  }
);

const archivo = ref()

const crumbs = ref([
  ...routes, {
    name: 'Tipos documentales',
    to: '/SGDA/administracion'
  },
  {
    name: 'Detalle tipo documental'
  }
])

const editRadicado = async () => {
  editForm.value.validate()
  const response = await sgdeaAxios.put("tiposdocumentales", {
    estado: dataForm.value.estado,
    descripcion: dataForm.value.descripcion,
    id: Number(route.params.id),
    id_tipo_documental: undefined,
    terminoDelTramite: dataForm.value.termino_tramite,
    tipoDeRadicado: dataForm.value.tipoRadicadoId.id_tipo_de_radicado
  })

  if ([405, 401, 404, 400, 403, 500].includes(response?.status)) {
    errorModal.value = true
  } else if ([200, 201].includes(response.status)) {
    dataModal.value = response.data.id_tipo_documental + " " + response.data.descripcion
    showModal.value = true
  }

}

const handleModalEdit = () => {
  if (showModal.value) {
    showModal.value = false
    router.push('/SGDA/administracion')
  } else {
    errorModal.value = false
  }
}


const handleModal = () => {
  if (showModal.value) {
    showModal.value = false
    router.push('/SGDA/administracion')
  } else {
    errorModal.value = false
  }
}


const handleCancel = () => {
  cancelModal.value = false
  router.push('/SGDA/administracion')
}

onMounted(async () => {
  const {data: response} = await sgdeaAxios.get(`/tiposdocumentales/${route.params.id}`);
  dataForm.value = {
    ...response,
    terminoTramite: response.termino_tramite,
    tipoRadicado: response.tipoRadicadoId.descripcion
  }
  getRadicado();

})


function getRadicado() {
  service.listTipoRadicadoTipoDocumental()
    .then(response => {
      response.map(function (value, key) {
        radicado_options_op.value = [...radicado_options_op.value, {
          label: value.descripcion,
          value: value.id_tipo_de_radicado,
        }]
      });

      return radicado_options_op;
    })
    .catch(error => {
      console.error(error);
    });
};



const isRequired = (val: string) => !!val || 'Campo Requerido'
const hasLength = (val: string, x: number) => (val.length <= x || 'Maximo ' + x + ' caracteres')


</script>

<style></style>
