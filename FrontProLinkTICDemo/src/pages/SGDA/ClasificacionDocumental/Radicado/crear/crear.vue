<template>
  <main>
    <BreadCrumbs :crumbs="crear_routes" class="tw-pl-6" />
    <div class="tw-flex tw-justify-between tw-items-center tw-pt-4 tw-mb-8">
      <h2 class="tw-font-bold tw-text-4xl tw-pl-8 tw-py-4">
        Crear tipo de Radicado
      </h2>
    </div>

    <q-form ref="form" class="tw-mt-3 tw-h-full" @submit.prevent="create">
      <div
        class="tw-w-full flex justify-center items-center tw-flex-col tw-gap-4"
      >
        <div
          class="flex tw-flex-col tw-w-11/12 tw-gap-4 tw-bg-white tw-p-8 tw-rounded-lg flex-wrap"
        >
          <h3 class="tw-text-2xl tw-text-left tw-font-bold">
            Tipo de Radicado
          </h3>

          <div class="flex tw-gap-4">
            <span class="tw-w-full">
              <label class="tw-text-label">Codigo tipo Radicado</label>
              <q-input
                v-model="formData.idTipoRadicado"
                type="number"
                outlined
                class="tw-rounded-lg"
                label="Inserte"
                dense
                :rules="[customRule]"
              ></q-input>
            </span>
            <span class="tw-w-full">
              <label class="tw-text-label">Nombre tipo de Radicado</label>
              <q-input
                v-model="formData.nombreTipoRadicado"
                outlined
                class="tw-rounded-lg"
                label="Inserte"
                dense
                :rules="[customRule]"
              ></q-input>
            </span>

            <span class="tw-w-1/2">
              <label class="text-[--subtitle-color] tw-text-label" dense
                >Estado</label
              >
              <div class="tw-flex items-center tw-justify-between">
                <p>{{ formData.status === true ? "Activo" : "Inactivo" }}</p>

                <q-toggle
                  v-model="formData.status"
                  :rules="[rulesValidation]"
                  color="secondary"
                ></q-toggle>
              </div>
            </span>
          </div>
        </div>

        <span
          v-if="showActions"
          class="w-full flex justify-center tw-gap-4 tw-mt-8"
        >
          <q-btn
            label="Cancelar"
            color="accent"
            textColor="black"
            @click="showModalCancel = true"
            class="tw-rounded-lg tw-p-2 tw-w-[200px]"
          ></q-btn>
          <q-btn
            label="Crear"
            type="submit"
            color="secondary"
            class="tw-rounded-lg tw-w-[200px] text-bold"
          ></q-btn>
        </span>
      </div>
    </q-form>

    <Modal
      v-model="showModal"
      title="Creación exitosa"
      :text="`El tipo de radicado ${formData.idTipoRadicado} ${formData.nombreTipoRadicado} se ha creado correctamente.`"
      is-success
      text-button="¡Ok!"
      @handleAccept="router.push('/SGDA/radicado')"
    />
    <Modal
      v-model="errorModal"
      title="Error"
     text="¡Ha ocurrido un error!"
      :is-success="false"
      text-button="Aceptar"
      @handleAccept="errorModal = false"
    />
    <Modal
      v-model="showModalCancel"
      title="¡Espera un momento!"
      @handleAccept="cancelar"
      cancelButton @closeModal="showModalCancel=false"
     :text="'¿Está seguro de abandonar la creación\n'+'del tipo de radicado en curso?'"
      text-button="SI"
      text-button-cancel="NO"
    />
  </main>
</template>

<script lang="ts" setup>
import {  ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import service from "src/services/Api";
import {stateOptions} from "src/constantes/state";
import Modal from "components/Modal/Modal.vue";
import BreadCrumbs from "src/components/BreadCrumbs/BreadCrumbs.vue";
import { crear_routes } from "..";
import { sgdeaAxios } from "src/services";

const formData = reactive({
  idTipoRadicado: "",
  nombreTipoRadicado: "",
  status: false,
});
const idTipoRadicadoRes = ref("");
const errorCreate = ref(false);
const showActions = ref(true);
const messageError = ref("");
const form = ref();
const confirmCreation = ref(false)
const showModalCancel = ref(false)
const errorModal = ref(false);
const showModal = ref(false)
const route = useRoute()
const router = useRouter();

const create = async () =>  {
  if (form.value.validate()) {
    const response = await sgdeaAxios.post("/tiporadicados/", {
      ...formData,
      idTipoRadicado: formData.idTipoRadicado,
      nombreTipoRadicado: formData.nombreTipoRadicado,
      status: formData.status,
    });

    if ([405, 401, 404, 400, 403, 500].includes(response?.status)) {
      errorModal.value = true
    } else if ([200,201].includes(response.status)) {
      showModal.value = true
    }
  }
}

const customRule = (val: any) => {
  if (val.length === 0) {
    return "Este campo es requerido";
  }
}

async function cancelar(){
  if (showModalCancel.value) {
    showModalCancel.value = false
    router.push('/SGDA/radicado')
  } else {
    errorModal.value = false
  }
}


</script>
