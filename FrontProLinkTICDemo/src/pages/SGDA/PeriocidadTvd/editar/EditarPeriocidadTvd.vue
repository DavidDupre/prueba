<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0  ">
      <BreadCrumbs :crumbs="routes" />
      <div class="tw-flex tw-justify-between tw-items-center tw-pt-4 ">

        <h1 class="tw-text-3xl tw-font-bold tw-my-4">Editar periodicidad TVD</h1>

      </div>
      <q-card class="tw-mt-[20px] tw-rounded-xl q-pa-lg" flat>
        <q-form ref="formEditar" @submit.prevent="editPriocidad">
          <div class="tw-grid tw-grid-cols-2 tw-gap-5">
            <span class="">
              <label for="code" class="tw-text-label">Código periodicidad*</label>
              <q-input v-model="form.codigo_periodicidad" label="Inserte" outlined dense disable filled />
            </span>
            <span>
              <label for="description" class="tw-text-label">Nombre Periodicidad*</label>
              <q-input v-model="form.nombre_periodicidad" label="Inserte" outlined class="mb-3 "
                       :rules="[(val) => rulesValidation(val, 50), val => !!val || ' Campo  Requerido']" id="description"
                       dense />

            </span>
            <span class="">
              <label for="initialDate" class="tw-text-label">Fecha inicio período*</label>
              <DatePickerComponent v-model:input-data-prop="form.fecha_inicio_periodo" label="aaaa / mm / dd"
                                   :rules="[val => !!val || ' Campo  Requerido']" mask="YYYY/MM/DD" />
            </span>
            <span class="">
              <label for="endingDate" class="tw-text-label">Fecha final período*</label>
              <DatePickerComponent v-model:input-data-prop="form.fecha_fin_periodo"
                                   :options="date => date >= form.fecha_inicio_periodo" label="aaaa / mm / dd"
                                   :rules="[val => !!val || ' Campo  Requerido']" mask="YYYY/MM/DD" />
            </span>
            <span class="">
              <label for="initialDate" class="tw-text-label">Fecha periodicidad</label>
              <DatePickerComponent v-model:input-data-prop="form.fecha_periodicidad" label="aaaa / mm / dd"
                                   :rules="[val => !!val || ' Campo  Requerido']" mask="YYYY/MM/DD" disabled filled />
            </span>
            <span>
              <label class="tw-text-label" for="state">Estado</label>
              <div class="tw-flex items-center tw-justify-between">
                <p>{{ form.estado === true ? 'Activo' : 'Inactivo' }}</p>
                <q-toggle v-model="form.estado" color="secondary"></q-toggle>
              </div>
            </span>
          </div>
          <div class="tw-mb-16 tw-mt-4">
            <p class="tw-text-label">Observación</p>
            <q-input outlined class="tw-h-5 tw-w-full" v-model="form.observacion" type="textarea" dense
                     :rules="[(val) => rulesValidation(val, 200), val => !!val || ' Campo  Requerido']" />
          </div>
          <div class="row tw-flex tw-justify-center tw-gap-2 tw-pt-[100px]">
            <q-btn label="Cancelar" color="accent" textColor="black" class="tw-rounded-lg col-2"
                   @click="confirmModal = true" />
            <q-btn label="Guardar Cambios" type="submit" color="secondary" class="tw-rounded-lg col-2"></q-btn>
          </div>
        </q-form>
      </q-card>
      <Modal v-model="confirmModal" title="¡Espera un momento!" :text="'¿Está seguro de abandonar la edición de la periocidad TVD' + form.codigo_periodicidad + ' ' + form.nombre_periodicidad + '?'" :is-success="false"
             text-button="SI" @handleAccept="router.push('/SGDA/periocidad-tvd')" @closeModal="confirmModal = false" text-button-cancel="NO"
             cancel-button />
      <Modal v-model="showModal" title="Edición exitosa"
             :text="'La periodicidad ' + form.codigo_periodicidad + ' ' + form.nombre_periodicidad + ' fue modificada correctamente.'"
             is-success text-button="¡Ok!" @handleAccept="closeModal" />
      <Modal v-model="errorModal" title="Error" text="¡Ha ocurrido un error!" :is-success="false" text-button="Aceptar"
             @handleAccept="closeModal" />
    </main>
  </section>
</template>


<script  lang="ts" setup>
import { onMounted, ref, Ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { formatDate, secondFormatDate } from "src/helpers/formtDate";

import { sgdeaAxios } from "src/services";

import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';
import DatePickerComponent from 'src/components/FormFields/datePickerComponent.vue';
import Modal from 'components/Modal/Modal.vue';


const route = useRoute()
const router = useRouter()


const formEditar = ref();
const showModal = ref(false)
const errorModal = ref(false)
const confirmModal = ref(false);

const form = ref({
  nombre_periodicidad: "",
  fecha_inicio_periodo: "",
  fecha_fin_periodo: "",
  codigo_periodicidad: 0,
  estado: true,
  id: route.params.id,
  observacion: "",
  fecha_periodicidad: "",
});

const editPriocidad = async () => {
  if (await formEditar.value.validate()) {
    await handleModal()
  }
}

onMounted(async () => {
  form.value = await sgdeaAxios.get(`/periodicidadtvd/periodicidadtvd/${route.params.id}`);
});

const handleModal = async () => {
  const response = await sgdeaAxios.put(`/periodicidadtvd/periodicidadtvd/${route.params.id}`, {
    'nombrePeriodicidad': form.value.nombre_periodicidad,
    fechaInicio: secondFormatDate(form.value.fecha_inicio_periodo),
    fechaFin: secondFormatDate(form.value.fecha_fin_periodo),
    observacion: form.value.observacion,
    estado: form.value.estado
  })

  if ([405, 401, 404, 400, 403, 500].includes(response?.status)) {
    errorModal.value = true
  } else if ([200, 201].includes(response.status)) {
    showModal.value = true
  }
}

const closeModal = () => {
  if (showModal.value) {
    showModal.value = false
    router.push('/SGDA/periocidad-tvd')
  }

  errorModal.value = false
  confirmModal.value = false
}

const rulesValidation = (val: any, number?: number) => {
  if (val?.length > number) {
    return `Solo se permiten ${number} caracteres`
  }
}


const clearPeriocidad = () => {
  formData.value = {
    nombre_periodicidad: "",
    fecha_inicio_periodo: "",
    fecha_fin_periodo: "",
    codigo_periodicidad: 0,
    estado: true,
    id: 0,
    observacion: "",
    fecha_periodicidad: "",
  }
}

const routes = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'Módulo SGDEA',
  },
  {
    name: 'Clasificación documental',
  },
  {
    name: 'Periocidad TVD',
    to: '/SGDA/periocidad-tvd'
  },
  {
    name: 'Editar Periocidad',
  }
]

</script>
