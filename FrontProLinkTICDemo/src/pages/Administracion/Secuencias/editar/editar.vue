<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0  ">
      <BreadCrumbs :crumbs="edit_routes" />
      <div class="tw-flex tw-justify-between tw-items-center tw-pt-4 ">

        <h1 class="tw-text-3xl tw-font-bold tw-my-4">Editar Secuencia</h1>

      </div>
      <q-card class="tw-mt-[20px] tw-rounded-xl q-pa-lg" flat>
        <h3 class="tw-text-2xl tw-font-bold tw-pl-2 tw-pb-6">Secuencia</h3>
        <q-form ref="editForm" @submit.prevent="editSecuencia">
          <div
            class="tw-grid tw-grid-cols-6 tw-gap-4 tw-border-b tw-border-b-gray-[#969EAF] tw-h-auto [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2">

            <span class="tw-col-span-6">
              <label for="code" class="tw-text-label">Codigo Secuencia * </label>
              <q-input v-model="data.idSecuencia" label="Inserte" outlined class="mb-3" dense disable filled/>
            </span>
            <span class="tw-col-span-3">
              <label for="code" class="tw-text-label">Nombre Secuencia * </label>
              <q-input
                v-model="data.nombre"
                label="Inserte"
                outlined
                class="mb-3"
                dense
                :rules="[v => lengthInput(50, v), inputRequired]"
              />
            </span>
            <span class="tw-col-span-3">
              <label for="code" class="tw-text-label">Nombre Corto </label>
              <q-input
                v-model="data.nombreCorto"
                label="Inserte"
                outlined
                class="mb-3"
               dense :rules="[v => lengthInput(20, v)]
                "/>
            </span>
            <span class="tw-col-span-3">
              <label for="code" class="tw-text-label">Funcionalidad * </label>
              <q-select
                v-model="data.idFuncionalidad"
                label="Seleccione"
                outlined
                class="mb-3"
                dense
                disable
                filled
                :options="optionsEntidades"
              />
            </span>
            <span class="tw-col-span-3">
              <label for="code" class="tw-text-label">Prefijo</label>
              <q-input v-model="data.prefijo" label="Inserte" outlined class="mb-3" dense disable filled />
            </span>
            <span class="tw-col-span-3">
              <label for="code" class="tw-text-label">Consecutivo Inicial * </label>
              <q-input v-model="data.consecutivoInicial" label="Inserte" outlined class="mb-3" dense disable filled />
            </span>
            <span class="tw-col-span-3">
              <label for="code" class="tw-text-label">Sufjio * </label>
              <q-input v-model="data.sufijo" label="Inserte" outlined class="mb-3" dense disable filled/>
            </span>

            <div class="tw-col-span-6 tw-h-[200px]">
              <p class="tw-text-label">Comentario</p>
              <q-input
                outlined
                v-model="data.comentario"
                :label="data.comentario === '' ? 'Inserte' : ''"
                class="tw-h-5"
                type="textarea"
                dense
                :rules="[v => lengthInput(1000, v)]"
              />
            </div>

            <!-- <section class='tw-w-full tw-col-span-6 tw-flex tw-flex-row tw-h-[450px]'>
              <p class="tw-text-gray-500 tw-text-[16px] tw-pb-8">Seleccione los datos adicionales para
                la parametrizacion del proceso seleccionado</p>
                <q-table
                  :rows="rows"
                  :columns="columns"
                  hide-pagination
                  card-class="card-table"
                  table-header-class="header-class"
                  rows-per-page-options="6"
                >
                  <template v-slot:body-cell-name="{ row }">
                    <td>
                      <p class="tw-text-[15px] tw-font-extralight tw-text-left">{{ row.name }}</p>
                    </td>
                  </template>
                  <template v-slot:body-cell="{ row, col }">
                    <td>
                      <q-radio disable v-model="row[col.field]" :val="true" disabled size="xs"/>
                    </td>
                  </template>
                </q-table>
            </section> -->


            <div class="tw-col-span-6 tw-h-[200px] tw-mt-8">
              <p class="tw-text-label">Observaciones *</p>
              <q-input
                outlined
                v-model="data.observacion"
                :label="data.observacion  === '' ? 'Inserte' : ''"
                class="tw-h-5"
                type="textarea"
                dense
                :rules="[v => lengthInput(200, v), inputRequired]"
                input-class="input-area"
              />

            </div>

            <span class="tw-col-span-3">
              <label class="tw-text-label" for="state">Reinicio Anual</label>
              <div class="tw-flex items-center tw-justify-between">
                <p>{{ data.reinicioAnual === true ? 'Activo' : 'Inactivo' }}</p>

                <q-toggle v-model="data.reinicioAnual" color="secondary"></q-toggle>
              </div>

            </span>

            <span class="tw-col-span-3">
              <label class="tw-text-label" for="state">Estado</label>
              <div class="tw-flex items-center tw-justify-between">
                <p>{{ data.activo === true ? 'Activo' : 'Inactivo' }}</p>

                <q-toggle v-model="data.activo" color="secondary"></q-toggle>
              </div>

            </span>

          </div>

          <div class="row tw-flex tw-mt-20 tw-justify-center tw-cols-6 tw-gap-2 [&>*]:tw-p-2">
            <q-btn label="Cancelar" color="accent" textColor="black" class="tw-rounded-lg col-2"
              @click="cancelModal = true" />
            <q-btn label="Guardar cambios" type="submit" color="secondary" class="tw-rounded-lg col-2"></q-btn>
          </div>
        </q-form>
      </q-card>
      <Modal
        v-model="cancelModal"
        title="¡Espera un momento!"
        :text="'¿Está seguro de abandonar la edición de la secuencia ' + data.idSecuencia + ' ' + data.nombre + '?'"
        text-cancel-button="NO"
        text-button="SI"
        @handleAccept="router.push('/administracion/secuencias')"
        cancel-button
        @closeModal="() => cancelModal = false"
        text-button-cancel="NO"
      />
      <Modal
        v-model="showModal"
        title="Edición exitosa"
        :text="`La Secuencia ${data.idSecuencia} ${data.nombre} fue Modificada correctamente.`"
        is-success
        text-button="¡Ok!"
        @handleAccept="handleModal"
      />
      <Modal
        v-model="errorModal"
        title="Error"
        :text="`${errorMessage}`"
        :is-success="false"
        text-button="Aceptar"
        @handleAccept="handleModal" />
    </main>
  </section>
</template>

<script  lang="ts" setup>
import { ref, Ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';
import Modal from 'components/Modal/Modal.vue';

import { edit_routes } from "pages/Administracion/Secuencias";
import {useEntidades} from "src/composables/useEntidades";
import { lengthInput, inputRequired } from "src/helpers/validations";

import {
  columns,
} from "../";
import { sgdeaAxios } from "src/services";


const data = ref({
  observacion: '',
  consecutivoInicial: '',
  idFuncionalidad: '',
  idSecuencia: '',
  nombre: '',
  nombreCorto: '',
  prefijo: '',
  reinicioAnual: false,
  sufijo: '',
  activo: false,
  comentario: ''
})
const rows = ref([]);
const route = useRoute()
const router = useRouter()
const showModal = ref(false)
const errorModal = ref(false)
const cancelModal = ref(false)
const editForm = ref()
const { optionsEntidades } = useEntidades(9);
const dataTable = ref({})
let errorMessage = "¡Ha ocurrido un error!";

onMounted(async () => {
  const response = await sgdeaAxios.get(`/secuencias/${route.params.id}`);

  data.value = {
    ...response.data,
   idFuncionalidad: response.data.funcionalidad,
  }

  // dataTable.value = {
  //   parametrizacionAno: response.data.parametrizacionAno,
  //   parametrizacionDependencia: response.data.parametrizacionDependencia,
  //   parametrizacionDocumental: response.data.parametrizacionDocumental,
  //   parametrizacionRadicado: response.data.parametrizacionRadicado,
  //   parametrizacionSerie: response.data.parametrizacionSerie,
  //   parametrizacionSubserie: response.data.parametrizacionSubserie
  // }

  // rows.value = [
  //   {
  //     id: 1,
  //     antesPrefijo: dataTable.value.parametrizacionAno?.antesPrefijo ?? false,
  //     despuesPrefijo: dataTable.value.parametrizacionAno?.despuesPrefijo ?? false,
  //     antesSufijo: dataTable.value.parametrizacionAno?.antesSufijo ?? false,
  //     despuesSufijo: dataTable.value.parametrizacionAno?.despuesSufijo ?? false,
  //     name: 'Año'
  //   },
  //   {
  //     id: 2,
  //     antesPrefijo: dataTable.value.parametrizacionDependencia?.antesPrefijo ?? false,
  //     despuesPrefijo: dataTable.value.parametrizacionDependencia?.despuesPrefijo ?? false,
  //     antesSufijo: dataTable.value.parametrizacionDependencia?.antesSufijo ?? false,
  //     despuesSufijo: dataTable.value.parametrizacionDependencia?.despuesSufijo ?? false,
  //     name: 'Dependencia',
  //   },
  //   {
  //     id: 3,
  //     antesPrefijo: dataTable.value.parametrizacionSerie.antesPrefijo ?? false,
  //     despuesPrefijo: dataTable.value.parametrizacionSerie.despuesPrefijo ?? false,
  //     antesSufijo: dataTable.value.parametrizacionSerie.antesSufijo ?? false,
  //     despuesSufijo: dataTable.value.parametrizacionSerie.despuesSufijo ?? false,
  //     name: 'Serie',
  //   },
  //   {
  //     id: 4,
  //     antesPrefijo: dataTable.value.parametrizacionSubserie.antesPrefijo ?? false,
  //     despuesPrefijo: dataTable.value.parametrizacionSubserie.despuesPrefijo ?? false,
  //     antesSufijo: dataTable.value.parametrizacionSubserie.antesSufijo ?? false,
  //     despuesSufijo: dataTable.value.parametrizacionSubserie.despuesSufijo ?? false,
  //     name: 'Subserie',
  //   },
  //   {
  //     id: 5,
  //     antesPrefijo: dataTable.value.parametrizacionRadicado.antesPrefijo ?? false,
  //     despuesPrefijo: dataTable.value.parametrizacionRadicado.despuesPrefijo ?? false,
  //     antesSufijo: dataTable.value.parametrizacionRadicado.antesSufijo ?? false,
  //     despuesSufijo: dataTable.value.parametrizacionRadicado.despuesSufijo ?? false,
  //     name: 'Tipo radicado',
  //   },
  //   {
  //     id: 6,
  //     antesPrefijo: dataTable.value.parametrizacionDocumental?.antesPrefijo ?? false,
  //     despuesPrefijo: dataTable.value.parametrizacionDocumental?.despuesPrefijo ?? false,
  //     antesSufijo: dataTable.value.parametrizacionDocumental?.antesSufijo ?? false,
  //     despuesSufijo: dataTable.value.parametrizacionDocumental?.despuesSufijo ?? false,
  //     name: 'Tipo documental',
  //   },
  // ]
})


const editSecuencia = async () => {
  if (await editForm.value.validate()) {
    const response = await sgdeaAxios.put(`/secuencias/${route.params.id}`, {
      activo: data.value.activo,
      comentario: data.value.comentario,
      nombre: data.value.nombre,
      nombreCorto: data.value.nombreCorto,
      observacion: data.value.observacion,
      reinicioAnual: data.value.reinicioAnual
    })

    if ([405, 401, 404, 400, 403, 500].includes(response?.status)) {
      errorMessage = "¡Ha ocurrido un error!";
      if(typeof response.data?.message == "string") {
        errorMessage = response.data.message;
      }
      errorModal.value = true
    } else if ([200,201].includes(response.status)) {
      showModal.value = true
    }
  }
}


const handleModal = () => {
  if (showModal.value) {
    showModal.value = false
    router.push('/administracion/secuencias')
  } else {
    errorModal.value = false
  }
}

</script>

<style lang="scss" scoped>
.card-table {
  box-shadow: none !important;

  .header-class th {
    font-weight: 600 !important;
    font-size: 16px !important;
  }
}

input[type="radio"]:disabled {
  -webkit-appearance: none;
  display: inline-block;
  width: 12px;
  height: 12px;
  padding: 0px;
  background-clip: content-box;
  border: 1px solid #bbbbbb;
  background-color: white;
  border-radius: 50%;
}

input[type="radio"]:checked {
  background-color: #0c4970;
}
</style>

