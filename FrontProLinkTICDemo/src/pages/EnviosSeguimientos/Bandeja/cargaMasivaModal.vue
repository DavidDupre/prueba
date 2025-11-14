<template>

  <!-- <q-dialog v-bind:model-value="showModal" persistent class="modal-custom-dialog"> -->
  <q-dialog v-bind:model-value="errorsModal" class="modal-custom-dialog">
    <q-card class="tw-p-[20px]   tw-w-[800px] tw-max-w-[800px] ">
      <q-form ref="formLoad" v-if="load">
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <q-card-section class="tw-px-0 tw-pt-0">
            <p class="tw-text-[16px] tw-text-red-600 tw-font-bold tw-ml-2">Una o más filas no presentan o cumplen con la
              estructura definida, por favor revise los siguientes errores en el documento e intente el cargue
              nuevamente</p>
          </q-card-section>

          <div class="tw-mt-2">
            <div class="row q-col-gutter-md q-pb-md">
              <div class="col-12">
                <q-scroll-area style="height: 350px">
                  <div v-html="errorList" class="q-py-xs">
                  </div>
                </q-scroll-area>
              </div>
            </div>
          </div>
        </q-card>

        <q-card-actions align="right" class="q-mt-sm tw-gap-[20px]">
          <q-btn type="button" flat label="Aceptar" class="tw-h-12 text-weight-bold tw-text-md" style="width: 40%"
            color="secondary" @click="errorsModal = false" />
        </q-card-actions>

      </q-form>

    </q-card>
  </q-dialog>
  <q-dialog persistent v-bind:model-value="showModal" class="modal-custom-dialog">
    <q-card class="tw-p-[25px]   tw-w-[800px] tw-max-w-[800px] ">
      <q-card-section class="text-h6 tw-max-w-sm tw-px-0 tw-pt-0">
        <p class=" tw-text-xl tw-text-modal-blue-main-title text-weight-bold">Cargar Masivo Guías</p>
        <!-- <p class="tw-text-[16px] q-mt-sm tw-text-modal-grey-subtitle  tw-font-bold tw-ml-2">Escriba aquí su motivo de rechazo.</p> -->
      </q-card-section>
      <q-form ref="formLoad" v-if="load">
        <q-card class="tw-rounded-xl" flat>
          <q-card-section class="tw-px-0 tw-pt-0">
            <p class="tw-text-[16px] tw-text-modal-grey-subtitle tw-font-bold tw-ml-6">Adjunte el Documento</p>
              <div class="col-12">
                <q-form ref="formFile">
                  <label class="tw-w-full">

                  <FileLoader :rules="[inputRequired]" v-model="loadDocument" class="tw-w-full" accept-file="xls, xlsx"
                    :max-file-size="45 * 1024 * 1024" max-file-size-label="45" :max-files="1"
                    @rejected="rejectedFiles" />
                </label>
                </q-form>

              </div>
            <q-card-actions align="center" class="">
              <q-btn type="button" flat label="Cancelar" class="tw-h-12 text-weight-bold tw-text-md" style="width: 40%"
                color="secondary" @click="emitHideModal" />
              <q-btn :loading="loading" type="button" flat label="Cargar"
                class="tw-h-12 bg-secondary text-weight-bold tw-text-md !tw-bg-modal-black-button" style="width: 40%"
                color="white" @click="validForm()" />
            </q-card-actions>
          </q-card-section>

        </q-card>



      </q-form>

    </q-card>
  </q-dialog>
  <Modal v-model="confirmarSubida" title="Confirmación"
        text="¿Está seguro de importar los destinatarios?"
        :is-success="false" cancel-button text-button-cancel="No" text-button="Si"
        @handleAccept="uploadExcelFile"/>
</template>


<script lang="ts" setup>
import { ref, defineProps, withDefaults, defineEmits } from 'vue';
import { useQuasar } from "quasar";
import { sgdeaAxios } from "src/services";
import { useRoute } from "vue-router";
import FileLoader from "src/components/FormFields/FileLoader.vue";
import { toast } from "src/helpers/toast";
import Modal from "src/components/Modal/Modal.vue";
import { inputRequired } from 'src/helpers/validations';
import { emit } from 'process';

const route = useRoute();

const props = withDefaults(
  defineProps<{
    showModal: boolean;
    title?: string;
    detalleRadicado: any;
  }>(),
  {
    title: 'Carga masiva'
  })

const emits = defineEmits(['closeModal']);

const formFile = ref()
const errorsModal = ref(false)
const q = useQuasar();
const loading = ref(false)
const errorList = ref()
const load = ref(true);
const loadDocument = ref(null);
const confirmarSubida = ref(false)

/* const uploadExcelFile = async () => {
  loading.value = true
  const formData = new FormData();
  formData.append('files', loadDocument.value);
  try {
    const response = await sgdeaAxios.post(`/envios/comunicacionSeguimiento/envioCourierMasivo`, formData,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "accept": "*",
          "Content-Type": "multipart/form-data",
          "Content-Transfer-Encoding": "BINARY"
        }
      })

    if (response.status == 200 && response.data.exitosos > 0 && response.data.fallidos == 0) {
      toast.success("Cargue masivo correcto")
      loading.value = false
      emitHideModal()
    }
    else if (response.status == 200 && response.data.exitosos == 0 && response.data.fallidos > 0) {
      toast.error("Por favor verifique el encabezado, no tiene o no corresponde el nombre de la columna.");
      loading.value = false
    } else {
      toast.error("Por favor verifique el encabezado, no tiene o no corresponde el nombre de la columna.")
    }
  } catch (error) {
    if (error.response.status == 400) {
      toast.error("Por favor verifique el encabezado, no tiene o no corresponde el nombre de la columna")
      loading.value = false
    }else{
      toast.error("Por favor verifique el encabezado, no tiene o no corresponde el nombre de la columna")
      loading.value = false
    }
  }
};
 */

 const uploadExcelFile = async () => {
  loading.value = true;
  const formData = new FormData();
  formData.append("files", loadDocument.value);

  try {
    const response = await sgdeaAxios.post(
      `/envios/comunicacionSeguimiento/envioCourierMasivo`,
      formData,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          accept: "*",
          "Content-Type": "multipart/form-data",
          "Content-Transfer-Encoding": "BINARY",
        },
      }
    );

    if (
      response.status == 200 &&
      response.data.exitosos > 0 &&
      response.data.fallidos == 0
    ) {
      toast.success("Cargue masivo correcto");
      loading.value = false;
      emitHideModal();
    } else if (
      response.status == 200 &&
      response.data.exitosos == 0 &&
      response.data.fallidos > 0
    ) {
      if (response.data.subidosFallidos && response.data.subidosFallidos.length > 0) {
        const errorMessages = response.data.subidosFallidos
          .map((item) => item.numeroGuia)
          .join(", ");
        toast.error(`${errorMessages}`);
      } else {
        toast.error(
          "Por favor verifique el encabezado, no tiene o no corresponde el nombre de la columna."
        );
      }
      loading.value = false;
    } else {
      toast.error(
        "Por favor verifique el encabezado, no tiene o no corresponde el nombre de la columna."
      );
      loading.value = false;
    }
  } catch (error) {
    if (error.response && error.response.status == 400) {
      toast.error(
        "Por favor verifique el encabezado, no tiene o no corresponde el nombre de la columna"
      );
    } else {
      toast.error("Por favor verifique el encabezado, no tiene o no corresponde el nombre de la columna");
    }
    loading.value = false;
  }
};

const rejectedFiles = (error) => {
  if (error.some((it) => it.failedPropValidation === "max-file-size")) {
    toast.error("El archivo que está intentando importar supera los 45MB, para poder importar el archivo debe tener un tamaño menor, por favor verifique e intente nuevamente.");
  }
  if (error.some((it) => it.failedPropValidation === "max-files")) {
    toast.error("Solo se puede adjuntar 1 archivo.");
  }
  if (error.some((it) => it.failedPropValidation === "accept")) {
    toast.error(
      "El formato ingresado no es válido, por favor cargar un formato de tipo  xls y xlsx"
    );
  }
};

const validForm = async () => {
  if (await formFile.value.validate()) {
    uploadExcelFile()
  } else {
    toast.error('Debe diligenciar los campos obligatorios para continuar con el proceso')
  }
}

const emitHideModal = () => {
  loadDocument.value = null
  loading.value = false
  emits('closeModal');
}



</script>
