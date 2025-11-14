<template>
  <div>
    <div>
      <BreadCrumbs :crumbs="crumbs" />
      <h2 class="tw-font-bold tw-text-4xl tw-py-6">Reubicar expedientes</h2>
    </div>

    <div>
      <div class="tw-bg-white tw-p-8 tw-rounded-xl flex-wrap">
        <q-form ref="createForm">
          <div class="row q-col-gutter-md q-pb-md q-px-md">
            <span class="tw-w-1/3">
              <label class="tw-text-label">Seleccione sucursal *</label>
              <InputSearch
                :options="sucursalOptions"
                required
                :input-data-prop="dataForm.sucursal"
              />
            </span>
            <span class="tw-w-1/3">
              <label class="tw-text-label">Seleccione depósito *</label>
              <q-select
                :options="[]"
                emit-value
                label="Seleccione"
                map-options
                outlined
                v-model="dataForm.tipoRadicadoId"
                class=""
                dense
                :rules="[rulesValidation]"
              />
            </span>
            <span class="tw-w-1/3">
              <label class="tw-text-label">Seleccione pasillo *</label>
              <q-select
                :options="[]"
                emit-value
                label="Seleccione"
                map-options
                outlined
                v-model="dataForm.tipoRadicadoId"
                class=""
                dense
                :rules="[rulesValidation]"
              />
            </span>
            <span class="tw-w-1/3">
              <label class="tw-text-label">Seleccione tipo estante *</label>
              <q-select
                :options="[]"
                emit-value
                label="Seleccione"
                map-options
                outlined
                v-model="dataForm.tipoRadicadoId"
                class=""
                dense
                :rules="[rulesValidation]"
              />
            </span>
            <span class="tw-w-1/3">
              <label class="tw-text-label">Seleccione el estante *</label>
              <q-select
                :options="[]"
                emit-value
                label="Seleccione"
                map-options
                outlined
                v-model="dataForm.tipoRadicadoId"
                class=""
                dense
                :rules="[rulesValidation]"
              />
            </span>
            <span class="tw-w-1/3">
              <label class="tw-text-label">Seleccione entrepaño *</label>
              <q-select
                :options="[]"
                emit-value
                label="Seleccione"
                map-options
                outlined
                v-model="dataForm.tipoRadicadoId"
                class=""
                dense
                :rules="[rulesValidation]"
              />
            </span>
            <span class="tw-w-1/3">
              <label class="tw-text-label">Seleccione contenedor *</label>
              <q-select
                :options="[]"
                emit-value
                label="Seleccione"
                map-options
                outlined
                v-model="dataForm.tipoRadicadoId"
                class=""
                dense
                :rules="[rulesValidation]"
              />
            </span>

            <span class="tw-w-full">
              <label class="tw-text-label">Justificación</label>
              <q-input
                autogrow
                maxlength="200"
                v-model="dataForm.descripcion"
                outlined
                class="tw-rounded-lg"
                dense
                placeholder="Descripción"
                :rules="[
                  rulesValidation,
                  (val) =>
                    !/[^a-zA-ZáéíóúñÁÉÍÓÚÑ ]/.test(val) ||
                    'No simbolos ni Numeros ',
                ]"
              ></q-input>
            </span>
          </div>
          <span class="w-full flex justify-center tw-gap-4 tw-mt-8">
            <q-btn
              label="Cancelar"
              color="accent"
              textColor="black"
              class="tw-rounded-lg tw-w-[200px]"
              @click="() => cancelModal = true"
            ></q-btn>
            <q-btn
              label="Crear"
              color="secondary"
              class="tw-rounded-lg tw-p-2 tw-w-[200px] text-bold"
              type="submit"
              @click="reubicar"
            ></q-btn>
          </span>
        </q-form>
      </div>
      <Modal
        v-model="showModal"
        title="<Reubicación exitosa"
        :text="`Los expedientes seleccionados se reubicaron correctamente en el contenedor “Código + Nombre contenedor” del estante #Código estante en el pasillo #Código pasillo.`"
        is-success
        text-button="¡Ok!"
        @handleAccept=""
      />
      <Modal
        v-model="cancelModal"
        title="¡Espera un momento!"
        text="¿Estás seguro de abandonar la reubicación del expediente?"
        :is-success="false"
        text-button="Aceptar"
        @handleAccept="() => {cancelModal = false; router.push('/inventarioFisico/reubicacion');}"
      />
      <Modal
        v-model="errorModal"
        title="¡Espera un momento!"
        text="El expediente #Número expediente no cuenta con una ubicación inicial asignada por lo tanto no se puede reubicar, debe seleccionar la opción Asignar ubicación."
        :is-success="false"
        text-button="Aceptar"
        @handleAccept=""
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, onMounted } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import BreadCrumbs from "src/components/BreadCrumbs/BreadCrumbs.vue";
import InputSearch from "src/components/SearchInput/SearchInput.vue";
import Modal from "components/Modal/Modal.vue";
import { IDataDocumental, stateOptions } from "pages/SGDA/Administracion";
import { routes } from ".";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";

const radicado_options_op = ref([]);

const route = useRoute();
const router = useRouter();

const showModal = ref(false);
const errorModal = ref(false);
const cancelModal = ref(false);
const createForm = ref();
const dataModal = ref();
const sucursalOptions: Ref<any[]> = ref([]);
const dataForm: Ref<IDataDocumental> = ref({
  sucursal: "",
  descripcion: "",
  estado: "",
  id_tipo_documental: "",
  termino_tramite: "",
  tipoRadicadoId: "",
});

const crumbs = [
  ...routes,
  {
    name: "Reubicación de Expedientes",
    to: "/inventarioFisico/reubicacion"
  },
  {
    name: "Reubicar expedientes"
  }
]

const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return "Este campo es requerido";
  }
  return true;
};

onMounted(async () => {
  const { content: sucursales } = (await sgdeaAxios.get("/sucursales"))
    .data;

  sucursalOptions.value = sucursales.map((val: any) => {
    return { label: `${val.id} ${val.nombre}`, value: `${val.id}` };
  });
});

function showNotif() {
  toast.error("Diligencie todos los campos para asignar la ubicación");
}


const reubicar = async () => {
  if (await createForm.value.validate()) {

  } else {
    showNotif();
  }
}
</script>

<style></style>
