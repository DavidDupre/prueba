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
      <h2 class="tw-font-bold tw-text-4xl tw-py-6">Editar tipo documental</h2>
    </div>

    <div>
      <q-form ref="editForm" @submit="editRadicado" class=" tw-bg-white tw-p-8 tw-rounded-xl flex-wrap " autofocus>

        <h3 class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">Tipo documental</h3>

        <div class="flex w-full row q-col-gutter-md -tw-mt-5">
          <span class="tw-w-full">
                <label class="tw-text-label">Descripción *</label>
                <q-input v-model="dataForm.descripcion" label="Inserte" outlined dense
                  :rules="[isRequired, (val: string) => val ? (val.length <= 150 || 'Maximo 150 caracteres') : true]" />
              </span>
              <span class="tw-w-1/3">
                <label class="tw-text-label">Término trámite *</label>
                <q-input v-model="dataForm.terminoTramite" label="Inserte" outlined dense
                  :rules="[isRequired]" />
                </span>
                <span
                class="tw-w-1/3">
                <label for="" class="tw-text-label">Tipo de radicado *</label>
                <q-select :options="radicadoOptions" map-options v-model="dataForm.tipoRadicado" label="Inserte" outlined dense :rules="[isRequired]"/>
              </span>
              <span class="tw-w-1/3">
                <label for="" class="tw-text-label">Estado *</label>
                <div class="tw-flex items-center tw-justify-between">
                    <p>{{ dataForm.estado === true ? 'Activo' : 'Inactivo' }}</p>

                    <q-toggle v-model="dataForm.estado" :rules="[isRequired]" color="secondary"></q-toggle>
                  </div>
              </span>
        </div>
        <span class="w-full flex justify-center tw-gap-4 tw-mt-8">

          <q-btn label="Cancelar" color="accent" textColor="black" class="tw-rounded-lg tw-w-[200px]"
            @click="() => cancelModal = true"></q-btn>
          <q-btn label="Guardar Cambios" color="secondary" class="tw-rounded-lg tw-p-2 tw-w-[200px] text-bold"
            type="submit"></q-btn>
        </span>
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
import { IDataDocumental } from "pages/SGDA/Administracion";
import { radicadoOptions } from '../../../../constantes/tipoRadicado'
import Modal from 'components/Modal/Modal.vue';
import { routes } from "../"
import { isNumber } from '@tiptap/vue-3';
import { sgdeaAxios } from 'src/services';

const route = useRoute()
const router = useRouter()
const showModal = ref(false)
const errorModal = ref(false)
const cancelModal = ref(false)

const dataModal = ref("")
const editForm = ref()
const dataForm: Ref<IDataDocumental> = ref(
  {
    descripcion: "",
    estado: false,
    id_tipo_documental: 0,
    termino_tramite: 0,
    tipoRadicado: "",
    observaciones: "",
    terminoTramite: "",
  }
);

const crumbs = ref([
  ...routes,
  {
    name: 'Tipos documentales',
    to: "/SGDA/administracion"
  },
  {
    name: 'Editar'
  }
])

const editRadicado = async () => {
  editForm.value.validate()
  const response = await sgdeaAxios.put("tiposdocumentales", {
    descripcion: dataForm.value.descripcion,
    estado: dataForm.value.estado,
    //@ts-ignore
    id: parseInt(route.params.id),
    terminoDelTramite: dataForm.value.terminoTramite,
    //@ts-ignore
    tipoDeRadicado: isNumber(dataForm.value.tipoRadicado) ? dataForm.value.tipoRadicado : dataForm.value.tipoRadicado.value
  })

  if ([405, 401, 404, 400, 403, 500].includes(response?.status)) {
    errorModal.value = true
  } else if ([200, 201].includes(response.status)) {
    dataModal.value = response.data.id_tipo_documental + " " + response.data.descripcion
    showModal.value = true
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
  dataForm.value = {...response, terminoTramite: response.termino_tramite, tipoRadicado: response.tipoRadicadoId.id_tipo_de_radicado}
})

const isRequired = (val: string) => !!val || 'Campo Requerido'

</script>

<style></style>
