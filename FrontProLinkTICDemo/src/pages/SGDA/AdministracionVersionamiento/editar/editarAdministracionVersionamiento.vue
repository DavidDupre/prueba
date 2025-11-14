<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0  ">
      <BreadCrumbs :crumbs="routes" />
      <div class="tw-flex tw-justify-between tw-items-center tw-pt-4 ">

        <h1 class="tw-text-3xl tw-font-bold tw-my-4">Editar Versión</h1>

      </div>
      <q-card class="tw-mt-[20px] tw-rounded-xl q-pa-lg" flat>
        <q-form ref="formEditar" @submit.prevent="editSerie">
          <div class="tw-grid tw-grid-cols-2 tw-gap-5 tw-mb-12 ">

            <span class="tw-cols-1">
              <label for="code" class="tw-text-label">Código versión*</label>
              <q-input v-model="form.codigo" dense outlined disable :rules="[rulesValidation]" />
            </span>

            <span class="tw-cols-1">
              <label for="description" class="tw-text-label">Nombre versión*</label>
              <q-input v-model="form.nombreVersion" label="Inserte" outlined class="mb-3 " id="description" dense
                :rules="[(val) => lenghtValidation(50, val), rulesValidation, alphanumericNotSpecial]" />

            </span>
            <span class="tw-cols-1">
              <label for="initialDate" class="tw-text-label ">Fecha versión*</label>
              <DatePicker v-model:input-data-prop="form.fechaVersion" mask="YYYY-MM-DD" :rules="[rulesValidation, validateDateWithoutLimit]"
                disabled />
            </span>

            <span class="tw-cols-1">
              <label for="endingDate" class="tw-text-label">Fecha inicial*</label>
              <DatePicker v-model:input-data-prop="form.fechaInicio" mask="YYYY-MM-DD" :rules="[rulesValidation, validateDateWithoutLimit]" />
            </span>
            <!-- <span class=""> -->
              <!-- <label class="tw-text-label" for="state">Fecha final</label>
              <DatePicker v-model:input-data-prop="form.fechaFin" mask="YYYY-MM-DD" :rules="[rulesValidation]"
                :options="date => date >= form.fechaInicio" /> -->
            <!-- </span> -->
            <span class='tw-cols-1'>
              <label class="tw-text-label" for="state">Estado</label>
              <!--<div class="tw-flex items-center tw-justify-between">
                        <p>{{ form.estado === true ? 'Activo' : 'Inactivo'}}</p>
                        <q-toggle v-model="form.estado" color="secondary"></q-toggle>
                      </div>-->

              <q-select v-model="form.estado" map-options emit-value outlined dense class="tw-rounded-lg" label="Seleccione"
                :options="stateOptions" />

            </span>

            <span class="tw-cols-1">
              <p class="tw-text-label">Fondo</p>
              <q-select outlined v-model="form.idFondo" map-options emit-value :options="fondoptions" label="Seleccione"
                  dense />
            </span>

            <span class="tw-cols-2">
              <p class="tw-text-label tw-font-bold">Observación</p>
              <q-input outlined label="Observación" class="tw-w-full" type="textarea" dense
                v-model="form.observaciones" :rules="[(val) => maxLengthInput(250, val)]"/>
            </span>



          </div>
          <div class="row tw-flex tw-justify-center tw-gap-2 tw-pt-[5px]">
            <q-btn label="Cancelar" color="accent" textColor="secondary" class="tw-rounded-lg col-2"
               @click="() => cancelModal = true" />
            <q-btn label="Guardar Cambios" type="submit" color="secondary" class="tw-rounded-lg col-2"></q-btn>
          </div>
        </q-form>
      </q-card>
      <Modal v-model="showModal" title="Edición exitosa"
        :text="`Se ha modificado con éxito ${form.codigo} ${form.nombreVersion}.`" is-success text-button="¡Ok!"
        @handleAccept="() => router.push('/SGDA/administracion-versionamiento')" />
      <Modal v-model="errorModal" title="Error" :text="`¡Ha ocurrido un error! ${messageError}`" :is-success="false"
        text-button="Aceptar" @handleAccept="handleModal" />
      <Modal v-model="cancelModal" title="¿Desea cancelar la acción?" text-button-cancel="NO" text-button="SI"
        @handleAccept="() => router.push('/SGDA/administracion-versionamiento')" cancel-button @closeModal="() => cancelModal = false" />
    </main>
  </section>
</template>


<script  lang="ts" setup>
import { onMounted, ref, Ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import moment from "moment/moment";
import DatePicker from "src/components/FormFields/datePickerComponent.vue";
import Modal from 'components/Modal/Modal.vue';
import { useLoadingStore } from "src/stores/loading.store";
import { formatDate } from "src/helpers/formtDate";
import service from 'src/services/Api';
import { sgdeaAxios } from "src/services";
import { maxLengthInput, validateDateWithoutLimit } from "src/helpers/validations";


const stateOptions = [
  {
    label: 'Diseño',
    value: 55
  },
  {
    label: 'Inactivo',
    value: 56
  },
  {
    label: 'Productivo',
    value: 54
  }
];

const route = useRoute()
const router = useRouter()


const formEditar = ref();
const idSerie: Ref<any> = ref({});
const showModal = ref(false)
const errorModal = ref(false)
const initDate = ref();
const finishDate = ref();
const cancelModal = ref(false)
const messageError = ref("")
const fondoptions: Ref<{ label: string; value: string | number | boolean }[]> = ref([])

const form = ref({
  codigo: '',
  estado: '',
  fechaFin: "2030-12-31",
  fechaInicio: formatDate(new Date()),
  nombreVersion: '',
  id: 0,
  observaciones: null,
  fechaVersion: null,
  idFondo: ''
});


const rulesValidation = (val: any) => {
  if (val?.length === 0 || val === null) {
    return 'Este campo es requerido'
  }
}

const lenghtValidation = (n: number, val: string) => val.length < n || 'Maximo ' + n + ' Caracteres'

const editSerie = async () => {
  if (formEditar.value.validate()) {
    //cancelModal.value = true
    handleEdit();
  }
}

const handleEdit = async () => {
  try {

    let result = await service
      .updateAdministracionVerion({
        ...form.value,
        id_fondo: form.value.idFondo,
        estado: form.value.estado,
        observaciones: form.value.observaciones ?? ""
      })

    showModal.value = true;

    if (form.value.estado == "101") {

      const datos = {
        "idCCD": 0,
        "version": String(form.value.id)
      };

      service.createEstructuraAlfresco(
        datos

      )
        .then((result) => {

          showModal.value = true;
        })
        .catch((error) => {
          errorModal.value = true;
        });

    }

  }
  catch (error) {

    // Esta comprobación es para asegurarse de que estás accediendo a propiedades directas del objeto y no a propiedades heredadas
    if (error.response) {
      for (let clave in error.response.data.message) {
        if (error.response.data.message.hasOwnProperty(clave)) {
          messageError.value = messageError.value + "Campo : " + error.response.data.message[clave].object + " ";
          messageError.value = messageError.value + " presenta el siguiente error: " + error.response.data.message[clave].message + "\n";
        }
      }

      errorModal.value = true
    }
  };


}

onMounted(async () => {

  await service
    .getAdministracionVerionById(route.params.id)
    .then((result) => {

      form.value.codigo = result[0].codigo;
      form.value.estado = result[0].estado;
      form.value.fechaFin = result[0].fechaFin;
      form.value.fechaInicio = result[0].fechaInicio;

      form.value.nombreVersion = result[0].nombreVersion;
      form.value.id = result[0].id;
      form.value.observaciones = result[0].observaciones;
      form.value.fechaVersion = result[0].fechaVersion;
      form.value.idFondo = result[0].id_fondo
    })
    .catch((error) => {
      console.error(error);
      errorModal.value = true
    });

    const {data:response} = await sgdeaAxios("/fondo/FondosActivos");

  if (response)  {
    fondoptions.value = response.map((item: any) => ({
      label: item.nombre,
      value: item.idFondo
    }))

  }
  //form.value = (await new httpClient(`versiontrd/search?codigo=${route.params.id}&page=0&size=50`).get()).data[0];
});

const handleModal = () => {
  if (showModal.value) {
    showModal.value = false;
    router.push('/SGDA/administracion-versionamiento')
  } else {
    errorModal.value = false
  }
}


watch([initDate, finishDate], (newValue) => {
  form.value.fecha_vigencia_inicial = moment(newValue[0]).format("YYYY-MM-DD")
  form.value.fecha_vigencia_final = moment(newValue[1]).format("YYYY-MM-DD")
})

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
    name: 'Administración de Versionamiento',
    to: '/SGDA/administracion-versionamiento'
  },
  {
    name: 'Editar versión',
  }
]

</script>
