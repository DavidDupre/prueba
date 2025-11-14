<template>
  <q-dialog
    v-model="IsModalReiniciarGestion"
    backdrop-color="rgba(0, 0, 0, 0.5)"
    persistent
  >
    <q-card class="tw-w-[45%] mx-auto tw-rounded-md">
      <div class="tw-flex tw-justify-center tw-mt-3">
        <span
          class="tw-rounded-[100px] tw-flex tw-justify-center"
          style="background-color: #f6f6f9; width: 82px; height: 82px"
        >
          <img
            v-lazy :data-url="require('src/assets/interrogation-modal.svg')"
            alt="check"
          />
        </span>
      </div>
      <q-form ref="formReinicioGestion" greedy>
        <q-card-section class="tw-px-8">
          <div
            class="tw-text-xl tw-font-bold tw-text-[#0a1b48] tw-mb-4 tw-mt-2 flex tw-justify-center"
          >
            Confirmación
          </div>
          <div
            class="tw-text-sm tw-font-bold tw-text-[#0a1b48] tw-mb-4 tw-mt-4 flex tw-justify-center"
          >
            ¿Desea reiniciar la gestión?
          </div>
          <label class="tw-block tw-text-sm tw-font-bold tw-text-[#777e87]"
            >Observaciones *</label
          >
          <q-input
            type="textarea"
            outlined
            label="Inserte"
            dense
            emit-value
            v-model="observacionesReinicio.value"
            :ref="(val) => (observacionesReinicio.ref = val)"
            :rules="[inputRequired, (v) => maxLengthInput(1000, v)]"
          />
        </q-card-section>
        <div class="tw-flex tw-justify-center tw-items-center tw-pb-6 tw-gap-3">
          <q-btn
            flat
            label="NO"
            color="secondary"
            class="tw-w-[35%] tw-h-10"
            @click="CancelModalReiniciarGestion()"
          />
          <q-btn
            label="SI"
            color="secondary"
            class="tw-w-[35%] tw-h-10"
            @click="getModalReinicio"
          />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { toast } from "src/helpers/toast";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { inputRequired, maxLengthInput } from "src/helpers/validations";
import { informacionGeneralEmptyDefault } from "src/pages/EntesDeControl/Bandeja/Detalles/utils";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import { reactive, ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const idAsignacion = ref(null);

const showModalReiniciarGestion = ref(false);
const observacionesReinicio = reactive({ value: "", ref: null });
const currentTab = ref("InformacionGeneral");
const IsModalReiniciarGestion = ref(true);
const informacionGeneral = ref<any>(informacionGeneralEmptyDefault);
const isAprobacion = ref(false);
// const props = defineProps<{
//  path: string
// }>()

interface InfoGeneralProps {
  data: any;
  metadatos: any;
  detalleTutela: any;
  visualize: (nodeId: string) => {};
}

const props = defineProps<InfoGeneralProps>();



const emit = defineEmits([
  "closeModal",
  "handleAccept",
  "handleCancel",
  "update:modelValue",
  "handleDownloadFile",
]);

const allNameTabs = {
  InformacionGeneral: "InformacionGeneral",
  AdjuntarDocumentos: "AdjuntarDocumentos",
  Reclasificar: "Reclasificar",
  Trazabilidad: "Trazabilidad",
  MetaDatos: "MetaDatos",
  Reasignar: "Reasignar",
  Asignar: "Asignar",
  //Gestionador
  MetaDatosGestionador: "MetaDatosGestionador",
  ReasignarGestionador: "ReasignarGestionador",
  IncluirExpediente: "IncluirExpediente",
  IniciarGestion: "IniciarGestion",
  Comentarios: "Comentarios",
  //Gestionador Iniciar Gestion
  DocumentosRelacionados: "DocumentosRelacionados",
  ReinicioDeLaGestion: "ReinicioDeLaGestion",
  DocumentoDeSalida: "DocumentoDeSalida",
  EnviarAprobacion: "EnviarAprobacion",
  EnviarARevision: "EnviarARevision",
  DatosDeSalida: "DatosDeSalida",
  Solictudes: "Solicitudes",
  ExcluirGestionadores: "ExcluirGestionadores",
  AdjuntosClonación: "AdjuntosClonación",
  //MetadatosDinamicos
  MetadatosDinamic: "MetadatosDinamic",
};

const changeTab = async (tab: string) => {
  if (tab === allNameTabs.EnviarAprobacion) {
    isAprobacion.value = true;
  }
  if (tab === allNameTabs.EnviarARevision) {
    isAprobacion.value = false;
  }
  currentTab.value = tab;
};

const CancelModalReiniciarGestion = () => {
  IsModalReiniciarGestion.value = false;
  changeTab("InformacionGeneral");
};

const currentPath = computed(() => route.path);

const apiEndpoint = computed(() => {
  if (currentPath.value.includes("/pqrd/")) {
    return "/pqrd/reiniciarGestion";
  } else if (currentPath.value.includes("/tutelas/")) {
    return "/tutela/reiniciarGestion";
  } else {
    return "/default/reiniciarGestion"; // Un endpoint por defecto si no coincide con ninguno de los anteriores
  }
});

const goTo = () => {
  if (currentPath.value.includes("/pqrd/")) {
    router.push("/bandeja");
  } else if (currentPath.value.includes("/tutelas/")) {
    router.push("/bandeja");
  } else {
    router.push("/");
  }
};

const newTrazabilidad = async (status: string, comentario = "") => {

  await crearTrazabilidad({
    proceso: "PQRD" + props.data.id,
    secuencia: props.data.idRadicado,
    estado: props.data.estado.estado,
    descripcion: `Usuario: ${
      useAuthStore().$state.userInfo.name
    } Motivo:${comentario}`,
    comentario: comentario,
    nombre: useAuthStore().$state.userInfo.name,
    accion: `${
      useAuthStore().$state.userInfo.name
    } Ha reiniciado la gestión del radicado ${props.data.idRadicado}`,
    tramite: currentPath.value.includes("/pqrd/") ? "PQRD" : "Tutelas",
  });
};

const getModalReinicio = async () => {
  if (observacionesReinicio.ref?.validate()) {
    const requestBody = currentPath.value.includes("/tutelas/")
      ? {
          tutelaId: props.detalleTutela?.idTutela,
          motivo: observacionesReinicio.value,
        }
      : {
          asignacionId: idAsignacion.value,
          motivo: observacionesReinicio.value,
        };

    sgdeaAxios
      .patch(apiEndpoint.value, requestBody)
      .then((response) => {

        toast.success("Se reinició la gestión del trámite con éxito");
        newTrazabilidad("reiniciado", observacionesReinicio.value);
        goTo();
      })
      .catch((error) => {
        toast.error("Error al reiniciar la gestión del trámite");
      });
  }
};

onMounted(() => {
  const id = route.query.idAsignacion;
  idAsignacion.value = id ? Number(id) : null;
});
</script>
