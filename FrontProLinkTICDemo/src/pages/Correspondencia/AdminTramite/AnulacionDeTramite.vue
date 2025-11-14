<template>
  <div class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
    <div class="tw-pt-4">
      <router-link to="/administracion-tramite">
        <q-btn flat color="primary" label="Volver" icon="chevron_left" />
      </router-link>
    </div>
    <main>
      <div class="q-pb-md q-px-md tw-mt-5">
        <div class="col row">
          <h3 class="pl-4 tw-font-bold tw-text-3xl tw-mt-5 tw-mb-3 text-bold">
            Anulación de trámite
          </h3>
        </div>
        <q-card class="tw-px-4 tw-pt-2 tw-pb-4 tw-rounded-xl" flat>
          <q-expansion-item
            expand-separator
            default-opened
            class="q-bg-white q-mt-lg"
          >
            <template v-slot:header>
              <div class="col row">
                <b class="tw-text-lg">
                  ¿Desea anular el trámite {{ anularTramite.numeroRadicado }}?
                </b>
              </div>
            </template>

            <q-form ref="formRef" greedy class="row q-px-md">
              <div class="col-12 q-px-md">
                <label class="q-px-md tw-text-label">
                  Motivo de anulación *
                  <q-input
                    type="textarea"
                    outlined
                    label="Inserte"
                    dense
                    emit-value
                    v-model="formulario.motivoAnulacion"
                    :rules="[
                      (v) => inputRequired(v),
                      (v) => maxLengthInput(1000, v),
                      (v) => minLengthInput(20, v),
                    ]"
                  />
                </label>
              </div>
            </q-form>
          </q-expansion-item>
        </q-card>
        <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
          <q-btn
            class="tw-w-1/4 tw-h-11 bg-primary text-white"
            no-caps
            label="Adjuntar archivos"
            @click="showModalAdjuntar = true"
          />
          <q-btn
            class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]"
            no-caps
            style="border: 1px solid #2c3948"
            label="Cancelar"
            @click="router.push('/administracion-tramite')"
          />
          <q-btn
            class="tw-w-1/4 tw-h-11 bg-primary text-white"
            type="submit"
            label="Aceptar"
            @click="handleSubmit"
          />
        </div>

        <Modal
          v-model="confirmModal"
          title="Confirmación"
          persistent
          :text="`Se anulará el trámite y se reiniciará la gestión.\n\nN° Radicado: ${anularTramite.numeroRadicado}`"
          :is-success="true"
          :cancelButton2="true"
          textButtonCancel2="No"
          text-button="Si"
          @handleAccept="handleConfirmation(true)"
          @handleCancel="handleConfirmation(false)"
        />
      </div>
    </main>

    <!-- Dialogo para adjuntar archivos -->
    <q-dialog full-width v-model="showModalAdjuntar">
      <q-card class="tw-w-[1000px]">
        <q-card-section>
          <AdjuntarDocumento
            @update-file="handlFiles"
            @backView="handleBackView"
            @succesView="handleSuccesview"
            :is-required="false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  inputRequired,
  maxLengthInput,
  minLengthInput,
} from "src/helpers/validations";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

import AdjuntarDocumento from "./AdjuntarDocumento.vue";
import Modal from "src/components/Modal/Modal.vue";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { useAuthStore } from "src/stores/auth.store";

const anularTramite = JSON.parse(localStorage.getItem("anularTramite"));

const confirmModal = ref(false);
// Configuración del enrutador
const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const filesUpdate = ref([]);

const userId = ref(auth.$state.userInfo.userid);

// Estado del formulario
const formulario = ref({
  motivoAnulacion: "",
});

// Estado para controlar la visibilidad del modal
const showModalAdjuntar = ref(false);

const handleBackView = () => {
  showModalAdjuntar.value = false;
  formulario.value.motivoAnulacion = "";
  filesUpdate.value = [];
};

const handleSuccesview = () => {
  showModalAdjuntar.value = false;
};

const handlFiles = async (files) => {
  filesUpdate.value = files;
};

const handleConfirmation = async (reiniciarGestion) => {
  // const id =
  //   anularTramite.idFlujo === "ENTES_CONTROL" ||
  //   anularTramite.idFlujo === "PQRD"
  //     ? anularTramite.subEntidadId
  //     : anularTramite.entidadId;

  const id = anularTramite.entidadId

  const formData = new FormData();
  formData.append("tramitadorId", userId.value);
  formData.append("flujo", anularTramite.idFlujo);
  formData.append("idRadicado", id);
  formData.append("reiniciarGestion", reiniciarGestion);
  formData.append("observacion", formulario.value.motivoAnulacion);

  // If you have files to upload, append them here
  if (filesUpdate.value) {
    for (let i = 0; i < filesUpdate.value.length; i++) {
      formData.append("files", filesUpdate.value[i]);
    }
  }

  try {
    const response = await sgdeaAxios.patch(
      "/administracion-tramite/anularTramite",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200) {
      toast.success("Trámite anulado con éxito");
      router.push("/administracion-tramite");
      localStorage.removeItem("anularTramite");
    }
  } catch (error) {
    toast.error("Hubo un error al anular el trámite");
  } finally {
    confirmModal.value = false;
  }
};

const handleSubmit = () => {
  if (
    formulario.value.motivoAnulacion.trim() === "" ||
    formulario.value.motivoAnulacion.trim().length < 20
  ) {
    toast.error("El motivo de anulación es obligatorio y debe tener al menos 20 caracteres");
    return;
  }
  confirmModal.value = true;
};
</script>
