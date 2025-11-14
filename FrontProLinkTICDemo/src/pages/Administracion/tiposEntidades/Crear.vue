<template>
  <div>
    <a href="/administracion/tiposEntidades" class="text-primary q-mb-md block" style="text-decoration: none;">
      <q-icon size="1.5em" name="chevron_left" color="accent"></q-icon>
      <b>
        Volver
      </b>
    </a>
    <div>
      <BreadCrumbs :crumbs="crumbs" />
      <h2 class="tw-font-bold tw-text-4xl tw-py-6">Crear Tipo entidad</h2>
    </div>

    <div>
      <div class=" tw-bg-white tw-p-8 tw-rounded-xl flex-wrap ">


        <q-form ref="createForm" @submit.prevent="createSerie" class="row flex col">
          <span class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <label class="tw-text-label">Tipo Entidad *</label>
            <q-input v-model="dataForm.tipoEntidad" outlined class="tw-rounded-lg" dense
              :rules="[rulesValidation, v => lengthValidation(50, v)]" label="Inserte"></q-input>
          </span>


          <span class="col-xs-12 col-sm-12 col-md-12 col-lg-12 ">
            <label class="tw-text-label">Detalle </label>
            <q-input v-model="dataForm.descripcion" outlined class="tw-rounded-lg" dense
              :rules="[rulesValidation, v => lengthValidation(500, v)]" label="Inserte" type="textarea"></q-input>
          </span>


          <span class="w-full flex justify-center tw-gap-4 tw-mt-8 col-12">

            <q-btn label="Cancelar" color="accent" textColor="black" class="tw-rounded-lg tw-w-[200px]"
              @click="() => cancelModal = true"></q-btn>
            <q-btn label="Crear" color="secondary" class="tw-rounded-lg tw-p-2 tw-w-[200px] text-bold"
              type="submit"></q-btn>
          </span>

        </q-form>
      </div>
      <Modal v-model="showModal" title="Asignación exitosa"
        :text="`La empresa “${idEmpresa} ${dataForm.tipoEntidad}” fue creada correctamente.`" is-success text-button="¡Ok!"
        @handleAccept="handleModal" />
      <Modal v-model="cancelModal" title="¿Desea cancelar la acción?" :text="``" text-button="¡Ok!"
        @handleAccept="() => router.push('/administracion/tiposEntidades')" label="Confirmar" cancelButton />
      <Modal v-model="errorModal" title="Error" text="¡Ha ocurrido un error!" :is-success="false" text-button="Aceptar"
        @handleAccept="handleModal" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { routes, IDataEmpresa, options } from "."
import { sgdeaAxios } from "src/services";

import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';
import Modal from 'components/Modal/Modal.vue';
import Datepicker from 'components/FormFields/datePickerComponent.vue';
import { adminAxios } from '../../../services/index';

const crumbs = ref([...routes, { name: "Crear Tipo de Entidad" }])

const route = useRoute()
const router = useRouter()

const showModal = ref(false)
const errorModal = ref(false)
const cancelModal = ref(false)

const dataForm = ref(
  {
    tipoEntidad: "",
    descripcion: "",
    idTipoEntidad: 0,
    estado: true,
  }
);

const createForm = ref();

const tipoSociedad: Ref<{ label: string, value: any }[]> = ref([]);

const idEmpresa = ref(0);

const rulesValidation = (val: string) => !!val || 'Este campo es requerido'
const lengthValidation = (n, val: string) => val.length < n || 'Maximo ' + n + ' Caracteres'

const createSerie = async () => {
  if (await createForm.value.validate()) {
    const headers = {
      "Content-Type": "application/json"
    }
    try {
      const response = await sgdeaAxios.post(
        `/tipoentidades/`,
        {
          ...dataForm.value
        }, {
        headers: headers
      });

      if ([200, 201].includes(response.status)) {
        idEmpresa.value = response.data.idTipoEntidad;
        showModal.value = true
      }
    } catch (e) {
      console.error(e);
      errorModal.value = true
    }
  }
}

const handleModal = () => {
  if (showModal.value) {
    showModal.value = false
    router.push('/administracion/tiposEntidades')
  } else {
    errorModal.value = false
  }
}

onMounted(async () => {
  const {data:response} = await adminAxios.get("/entidades/list/8");
  tipoSociedad.value = response.map((item: any) => ({
    label: item.entidad,
    value: item.idEntidad
  }))
})


</script>

<style></style>
