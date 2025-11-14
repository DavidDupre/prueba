<template>
  <div>
    <div class="tw-flex tw-justify-between tw-items-center">
      <div>
        <div class="tw-mt-2">
          <q-btn icon="chevron_left" label="Volver" flat class="tw-text-[#ff7500]"
            @click="router.push('/Correspondencia/Devoluciones')" />
        </div>
        <p class="pl-4 tw-font-bold tw-text-3xl tw-mb-3 text-bold">
          Caso {{ data?.idRadicado }}
        </p>
        <div
          class='tw-inline-block tw-p-1.5 tw-px-4 tw-rounded-lg tw-border tw-bg-[#FFF8E7] tw-border-[#FFB800] tw-text-[#2C3948]'>
          <span :class="['tw-font-semibold']">Devolución</span>
        </div>
      </div>
    </div>

    <q-card :key="uiTabsKey" class="tw-rounded-xl tw-mt-8 tw-mb-4" flat bordered>
      <template v-if="data?.estado?.estado != 'Devolucion'">
        <q-tabs v-model="tab" no-caps indicator-color="white" align="left" outside-arrows>
          <q-tab :key="tab.label" :name="tab.label" :ripple="false" class="tw-px-2" @click="showComponents(tab.label)"
            v-for="tab in tabs">
            <q-chip :icon="tab.icon" square :ripple="false" class="tw-pl-4"
              style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
              {{ tab.label }}
            </q-chip>
          </q-tab>
        </q-tabs>
      </template>
      <template v-else>
        <q-tab :key="tab.label" :name="tab.label" :ripple="false" class="tw-px-2" @click="showComponents(tab.label)"
          v-for="tab in itemsDevolucion">
          <q-chip :icon="tab.icon" square :ripple="false" class="tw-pl-4"
            style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
            {{ tab.label }}
          </q-chip>
        </q-tab>
      </template>
    </q-card>

    <InformacionGeneral v-if="labelComponet == 'Información General' && !edit" v-model:data="responseML" :docs="allDocs"
      class="tw-w-[100%]" :visualize="getBlobToIframe" :metadatos-info="metadatosInfo" />
    <Asignar v-if="labelComponet === 'Asignar'" :ml-data="data" :metadatos-info="metadatosInfo" />
    <Trazabilidad v-if="labelComponet === 'Trazabilidad'" :ml-data="data" />

    <div v-if="visualizadorPDF" class="tw-h-full tw-w-full">
      <q-dialog v-model="visualizadorPDF" seamless position="right" class="">
        <q-card class="tw-h-full tw-w-[2100px] tw-z-[1000] tw-overflow-hidden">
          <q-btn @click="visualizadorPDF = false"
            class="tw-absolute tw-ml-5 tw-mt-20 tw-z-[2000] tw-text-white tw-bg-red-500">Cerrar</q-btn>
          <iframe class="tw-h-full tw-w-full" :src="iframePdfUrl" frameborder="0"></iframe>
        </q-card>
      </q-dialog>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { DocsBD, Medicina, Metadatos as Meta } from "src/interfaces";
import { intescoAxios, sgdeaAxios } from "src/services";
import { fourthFormatDate } from 'src/helpers/formtDate';
import { useAuthStore } from "src/stores/auth.store";
import { Ref, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import InformacionGeneral from "./informacionGeneral.vue";
import Asignar from "./asignacion.vue";
import Trazabilidad from "./trazabilidad.vue";
import { toast } from 'src/helpers/toast';

const router = useRouter();
const q = useQuasar();
const visualizadorPDF = ref(false)
const iframePdfUrl = ref()
const labelComponet = ref("Información General");
const edit = ref(false)
const data = ref(null);
const responseML: Ref<Medicina | null> = ref(null)
const metadatosInfo: Ref<Meta | null> = ref(null)
const listDocs = ref([])
const loadingDocs = ref(true)
const nameDocument = ref(null)
const tab = ref('vistaInformacionGeneral')
const uiTabsKey = ref(0);
const dbDocs: Ref<DocsBD[]> = ref([])
const intervalId = ref(null)
const auth = useAuthStore()
const emit = defineEmits(['image-loaded'])
const allDocs = ref()
const listDocs2 = ref()
const tabs = ref([])

const allNameTabs = {
  vistaInformacionGeneral: 'vistaInformacionGeneral',
  asignar: 'asignar',
  trazabilidad: 'trazabilidad',
}

const getTabs = () => {
  if (auth.$state.userInfo.role === "Asignador Responsable") {
    tabs.value = [
      {
        label: "Información General",
        name: allNameTabs.vistaInformacionGeneral,
        icon: "info",
      },
      {
        label: "Asignar",
        name: allNameTabs.asignar,
        icon: "move_up",
      },
      {
        label: "Trazabilidad",
        name: allNameTabs.trazabilidad,
        icon: "history",
      },
    ]

    return tabs.value;
  }

  if (auth.$state.userInfo.role === "Gestionador") {
    tabs.value = [
      {
        label: "Información General",
        name: allNameTabs.vistaInformacionGeneral,
        icon: "info",
      },
      {
        label: "Trazabilidad",
        name: allNameTabs.trazabilidad,
        icon: "history",
      },
    ]

    return tabs.value;
  }

  if (auth.$state.userInfo.role === "Revisor" || auth.$state.userInfo.role === "Aprobador") {
    tabs.value = [
      {
        label: "Información General",
        name: allNameTabs.vistaInformacionGeneral,
        icon: "info",
      },
      {
        label: "Asignar",
        name: allNameTabs.asignar,
        icon: "move_up",
      },
      {
        label: "Trazabilidad",
        name: allNameTabs.trazabilidad,
        icon: "history",
      },
    ]

    return tabs.value;
  }
};

const itemsDevolucion = ref([
  {
    label: "Información General",
    icon: "info",
  },
  {
    label: "Enviar por Correspondencia",
    icon: "send",
  },
  {
    label: "Enviar por Correo",
    icon: "send",
  },
  {
    label: "Nuevo Documento de Salida",
    icon: "post_add",
  },
  {
    label: "Cerrar Devolución",
    icon: "cancel",
  },
  {
    label: "Trazabilidad",
    icon: "history",
  },
]);

onMounted(async () => {
  await getData()
  await getTabs()
});

const getData = async () => {
  try {
    // const id = route.params.id;
    // const response = await sgdeaAxios.get<Medicina>(`/medicina/casos/${id}`);
    // responseML.value = response.data
    // idRadicado.value = responseML.value.idRadicado
    // data.value = response.data
    // state.value = responseML.value.estado.estado;
    // isDisabled.value = response.data.estado.estado === "Por revisar" && auth.userInfo.role === "Gestionador" ? true : false

    // isDocSalida.value = response.data?.asignacion?.documentoSalida ? true : false
    // radicationDate.value = data.value.fechaRadicacion;
    // disableButtonRechazarAfterThreeDaysSinceRadication();
  } catch (error) {
    toast.error('Ocurrió un problema al obtener el caso.');
    router.push('/envios-seguimientos/correos');
  }
};

const getBlobToIframe = async (id) => {
  const { data } = await sgdeaAxios.get(`/radicados/consultar_documento/${id}`);

  if (id) {
    nameDocument.value = data.name
  }

  const byteCharacters = atob(data.base64x);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });

  iframePdfUrl.value = URL.createObjectURL(blob);
  visualizadorPDF.value = true
}

const showComponents = (name: string) => {
  labelComponet.value = name;
  if (name == 'Nuevo Documento de Salida' && data.value.estado?.estado == 'Devolucion') {
    labelComponet.value = 'Documento de salida';
  } else {
    labelComponet.value = name;
  }
};

onBeforeUnmount(() => {
  clearInterval(intervalId.value);
})


</script>