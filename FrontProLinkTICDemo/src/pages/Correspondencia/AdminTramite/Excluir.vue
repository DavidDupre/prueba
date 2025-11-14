<template>
  <div class="q-pb-md q-px-md tw-mt-5">
    <a
      @click="emit('backView', true)"
      class="tw-text-primary tw-cursor-pointer"
      style="text-decoration: none"
    >
      <q-icon size="1.5em" name="chevron_left" color="primary" />
      <b> Volver </b>
    </a>
    <div class="col row">
      <h3 class="pl-4 tw-font-bold tw-text-3xl tw-mt-5 tw-mb-3 text-bold">
        Excluir
      </h3>
    </div>
    <q-card class="tw-px-4 tw-pt-2 tw-pb-4 tw-rounded-xl" flat>
      <div class="row q-col-gutter-md">
        <div class="col-6">
          <label class="q-px-md tw-text-label">
            <div class="tw-text-lg tw-font-semibold">Nombre</div>
            <div class="tw-text-lg tw-font-semibold tw-mt-2">
              {{
                (props.detailsRadicado.estado ===
                  props.detailsRadicado.asignador) !=
                  null && props.detailsRadicado.asignador === true
                  ? props.detailsRadicado.nombreAsignadorResponsable
                  : props.detailsRadicado.nombreUsuario
              }}
            </div>
          </label>
        </div>
        <div class="col-6">
          <label class="q-px-md tw-text-label">
            <div class="tw-text-lg tw-font-semibold">Oficina</div>
            <div class="tw-text-lg tw-font-semibold tw-mt-2">
              {{
                (props.detailsRadicado.estado ===
                  props.detailsRadicado.asignador) !=
                  null && props.detailsRadicado.asignador === true
                  ? props.detailsRadicado.nombreOficinaResponsable
                  : props.detailsRadicado.nombreOficina
              }}
            </div>
          </label>
        </div>
      </div>
    </q-card>

    <section>
      <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md q-px-sm">
          Motivo de Exclucion
        </h3>
        <q-form ref="formRef">
          <div class="row full-width wrap tw-justify-start justify-around">
            <div class="row full-width">
              <div class="col-12">
                <label class="q-px-md tw-text-label"
                  >Observaciones *
                  <q-input
                    type="textarea"
                    outlined
                    label="Inserte"
                    dense
                    emit-value
                    v-model="form.observaciones"
                    :rules="[
                      inputRequired,
                      alphanumeric,
                      (v) => maxLengthInput(1000, v),
                    ]"
                  />
                </label>
              </div>
            </div>
          </div>
          <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
            <q-btn
              class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]"
              no-caps
              style="border: 1px solid #2c3948"
              @click="emit('backView', true)"
              label="Cancelar"
            />
            <q-btn
              class="tw-w-1/4 tw-h-11 bg-primary text-white"
              @click="confirmExclusion"
              label="Excluir"
            />
          </div>
        </q-form>
      </div>
      <Modal
        v-model="confirmModal"
        title="Confirmación"
        persistent
        :text="'Está seguro de asignar el radicad'"
        :is-success="true"
        :cancelButton="true"
        @closeModal="confirmModal = false"
        textButtonCancel="No"
        text-button="Si"
        @handleAccept=""
      />
      <Modal
        v-model="cancelModal"
        title="Confirmación"
        :is-success="false"
        @handleAccept="$emit('backView')"
        cancel-button
        textButtonCancel="No"
        textButton="Si"
        text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
        @close-modal="cancelModal = false"
        type="button"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import Modal from "src/components/Modal/Modal.vue";
import { toast } from "src/helpers/toast";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import {
  alphanumeric,
  inputRequired,
  maxLengthInput,
} from "src/helpers/validations";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import { ref, onMounted } from "vue";

const props = withDefaults(
  defineProps<{
    type: string;
    detailsRadicado: any;
  }>(),
  {}
);

const cancelModal = ref(false);
const confirmModal = ref(false);
const { getUserInfo } = useAuthStore();
const userInfo = ref();

const selection = ref([]);
const oficinas = ref([]);

const form = ref({
  observaciones: "",
});

const emit = defineEmits(["findDocs", "backView", "uptadeTable"]);

const confirmExclusion = async () => {
  try {
    if (form.value.observaciones === "") {
      toast.error("Debe diligenciar los campos obligatorios");
      return;
    }

    let proceso = "";
    let response;

    switch (props.detailsRadicado.idFlujo) {
      case "PQRD":
        proceso = "PQRD";
        response = await sgdeaAxios.patch(
          `/pqrd/excluirGestionadores/${props.detailsRadicado.entidadId}`,
          {
            idGestionadores: [props.detailsRadicado.idUsuario],
            motivoExclusion: form.value.observaciones,
          }
        );
        break;
      case "ENTES_CONTROL":
        proceso = "ENTC";
        response = await sgdeaAxios.patch(
          `/api/entes/clonacion/excluirGestionadores/${props.detailsRadicado.entidadId}`,
          {
            gestionadores: [props.detailsRadicado.idUsuario],
            motivoExclusion: form.value.observaciones,
          }
        );
        break;
      default:
        toast.error("Flujo no reconocido");
        return;
    }

    if (response.status == 200 || response.status == 204) {
      const radicacion = props.detailsRadicado;
      await crearTrazabilidad({
        proceso: `${proceso}${radicacion.entidadId}`,
        secuencia: radicacion.numeroRadicado,
        estado: radicacion.estado,
        descripcion: "Se ha Excluido el radicado",
        comentario: "Exclusión",
        nombre: userInfo.value.name,
        tramite: radicacion.tipoTramite,
        accion: "El trámite ha sido Excluido",
      });
      selection.value = [];
      toast.success("La Exclusión fue exitosa");
      emit("backView", true);
    } else {
      toast.error("La operación no se completó correctamente");
    }
  } catch (error) {
    toast.error("Ha ocurrido un error al momento de hacer la Exclusión");
  }
};


onMounted(async () => {
  userInfo.value = await getUserInfo();
  const { data: oficinasAll } = await sgdeaAxios.get("oficinas/all");

  oficinas.value = oficinasAll
    .map((item) => ({
      label: item.nombre,
      value: item.id,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
});
</script>

<style scoped>
.tableclass ::-webkit-scrollbar-thumb {
  background-color: #ffa51e;
}

.tableclass ::-webkit-scrollbar-track {
  background-color: #ecf0f1;
}
</style>
