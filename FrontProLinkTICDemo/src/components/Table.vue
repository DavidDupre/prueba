<template>
  <div>
    <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId" table-header-class="text-black text-h6 "
      class="q-mr-md full-width tw-bg-transparent" rows-per-page-label="Páginas" hide-pagination
      v-model:pagination="pagination" :selection="isSelection" :loading="loading" v-model:selected="selection">
      <template v-slot:body-cell-estados="props">
        <q-td class="tw-w-[125px]" v-if="isToggle">
          <!-- <q-toggle v-model="toggleValue" color="secondary" /> -->
        </q-td>
        <q-td class="tw-w-[125px]" v-else>
          <p :class="[
            'tw-border  tw-h-[20px] tw-rounded-xl col-8',
            props.row.estados
              ? ' tw-border-green-700 tw-bg-green-100'
              : ' tw-border-gray-400 tw-bg-gray-200 tw-text-black',
          ]">
            {{ props.row.estados ? "Activo" : "Inactivo" }}
          </p>
        </q-td>
      </template>

      <template v-slot:body-cell-enabled="props">
        <q-td class="tw-w-[125px]" v-if="isToggle">
          <q-toggle v-model="props.row.enabled" color="primary" @update:model-value="handleToggle(props.row)" />
        </q-td>
      </template>

      <template v-slot:body-cell-estado="props">

        <q-td class="tw-w-[auto]">
          <q-badge style="border-radius: 9px" align="middle" class="tw-px-2 tw-py-1 tw-text-sm tw-font-bold" :class="[
            props.row.estado == 'Escalamiento Rechazado'
              ? ' tw-border-red tw-bg-red-100 tw-text-gray-400 borderRechazo'
              : ' tw-border-gray-400 tw-bg-gray-200 tw-text-gray-400',
          ]">
            {{ convertirAMayusculas(props.row.estado) }}
          </q-badge>

        </q-td>
      </template>

      <template v-slot:body-cell-usuario="props">
        <q-td class="text-center">
          <div class="row">
          </div>
          <div class="column justify-center">
            <span class="text-black text-weight-bold !tw-w-fit text-no-wrap" style="letter-spacing: 0.5px;">{{
              props.row.usuario }}
            </span>
            <span class="text-black q-mt-xs !tw-w-fit"
              style="width: 150px; white-space: break-spaces; line-height: 17px">
              {{ props.row?.cargoUsuario ?? 'Desconocido' }}
            </span>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-usuarioA="props">
        <q-td class="text-center">
          <div class="column justify-center">
            <p class="tw-break-words tw-whitespace-normal tw-w-44">
              {{ props.row.nombre }} - {{ props.row.oficinaUsuario ? props.row.oficinaUsuario : "Sin oficina" }} - {{
                props.row.cargoUsuario ? props.row.cargoUsuario :"Sin cargo" }}
            </p>

          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-formato="props">
        <q-td v-if="['application/pdf', 'pdf'].includes(props.row.formato.split('.').pop().toLowerCase())"
          class="tw-mx-auto">
          <div class="tw-flex tw-justify-center tw-items-center">
            <img class="tw-w-9 tw-h-9" v-lazy :data-url="pdf" alt="pdf" />
          </div>
        </q-td>
        <q-td
          v-else-if="['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'docx', 'doc'].includes(props.row.formato.split('.').pop().toLowerCase())"
          class="tw-mx-auto">
          <div class="tw-flex tw-justify-center tw-items-center">
            <img class="tw-w-9 tw-h-9 tw-text-black" v-lazy :data-url="word" alt="word" />
          </div>
        </q-td>
        <q-td v-else-if="['jpg', 'png', 'jpeg', 'webp'].includes(props.row.formato.split('.').pop().toLowerCase())"
          class="tw-mx-auto">
          <div class="tw-flex tw-justify-center tw-items-center">
            <img class="tw-w-9 tw-h-9 tw-text-black" v-lazy :data-url="img" alt="image" />
          </div>
        </q-td>
        <q-td v-else-if="['mp3'].includes(props.row.formato.split('.').pop().toLowerCase())" class="tw-mx-auto">
          <div class="tw-flex tw-justify-center tw-items-center">
            <img class="tw-w-9 tw-h-9 tw-text-black" v-lazy :data-url="music" alt="music" />
          </div>
        </q-td>
        <q-td v-else-if="['avi', 'mp4'].includes(props.row.formato.split('.').pop().toLowerCase())" class="tw-mx-auto">
          <div class="tw-flex tw-justify-center tw-items-center">
            <img class="tw-w-9 tw-h-9 tw-text-black" v-lazy :data-url="video" alt="video" />
          </div>
        </q-td>
        <q-td v-else-if="['txt', 'bmp'].includes(props.row.formato.split('.').pop().toLowerCase())" class="tw-mx-auto">
          <div class="tw-flex tw-justify-center tw-items-center">
            <img class="tw-w-9 tw-h-9 tw-text-black" v-lazy :data-url="txt" alt="text" />
          </div>
        </q-td>
        <q-td
          v-else-if="['application/vnd.ms-excel', 'xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'xlsx', 'csv'].includes(props.row.formato.split('.').pop().toLowerCase())"
          class="tw-mx-auto">
          <div class="tw-flex tw-justify-center tw-items-center">
            <img class="tw-w-9 tw-h-9 tw-text-black" v-lazy :data-url="excel" alt="excel" />
          </div>
        </q-td>
        <q-td v-else-if="['zip', 'rar'].includes(props.row.formato.split('.').pop().toLowerCase())" class="tw-mx-auto">
          <div class="tw-flex tw-justify-center tw-items-center">
            <img class="tw-w-9 tw-h-9 tw-text-black" v-lazy :data-url="zip" alt="zip" />
          </div>
        </q-td>
        <q-td v-else-if="['msg', 'eml'].includes(props.row.formato.split('.').pop().toLowerCase())" class="tw-mx-auto">
          <div class="tw-flex tw-justify-center tw-items-center">
            <img class="tw-w-9 tw-h-9 tw-text-black" v-lazy :data-url="msg" alt="msg" />
          </div>
        </q-td>
        <q-td v-else-if="['ppt', 'pptx'].includes(props.row.formato.split('.').pop().toLowerCase())" class="tw-mx-auto">
          <div class="tw-flex tw-justify-center tw-items-center">
            <img class="tw-w-9 tw-h-9 tw-text-black" v-lazy :data-url="ppt" alt="ppt" />
          </div>
        </q-td>
        <q-td v-else-if="['xml'].includes(props.row.formato.split('.').pop().toLowerCase())" class="tw-mx-auto">
          <div class="tw-flex tw-justify-center tw-items-center">
            <img class="tw-w-9 tw-h-9 tw-text-black" v-lazy :data-url="xml" alt="xml" />
          </div>
        </q-td>
        <q-td v-else class="tw-mx-auto">
          <div class="tw-flex tw-justify-center tw-items-center">
            <img class="tw-w-9 tw-h-9 tw-text-black" v-lazy :data-url="interrogation" alt="" />
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-codigo="props">
        <q-td class="tw-flex tw-items-center tw-justify-center tw-gap-2">
          <p>
            {{ props.row.idTipologiaDocumental }}
          </p>
        </q-td>
      </template>
      <template v-slot:body-cell-canal="props">
        <q-td class="text-center">
          <p>
            {{ props.row.canal ? props.row.canal : "-" }}
          </p>
        </q-td>
      </template>

      <template v-slot:body-cell-caso="props">
        <q-td class="tw-w-[125px]" @click="handleCaso(props.row[rowId])">
          <p class="tw-py-1.5 tw-rounded-md col-8 tw-bg-gray-texts tw-px-4 tw-cursor-pointer tw-font-bold">
            {{ props.row.caso }}
          </p>
        </q-td>
      </template>

      <template v-slot:body-cell-trazabilidad="props">
        <q-td class="tw-cursor-pointer">
          <q-icon :name="iconTrazabilidad" size="xs" @click="handleTrazabilidad" />
        </q-td>
      </template>

      <template v-slot:body-cell-acciones="props">
        <q-td class="text-center">
          <q-btn size="sm" color="secondary" icon="edit" flat @click="
            editRow(
              props.row.id_seriesubserie || props.row.id || props.row[rowId]
            )
            " />
        </q-td>
      </template>

      <template v-slot:body-cell-actionsGE="props">
        <q-td
          v-if="['asignador líder', 'gestionador'].includes(useAuthStore().$state.userInfo.role?.toLowerCase()) && props.row.estado?.toLowerCase() === 'escalamiento rechazado'"
          class="text-center">
          <q-btn flat class="tw-w-auto tw-h-8 tw-bg-[#fde5e5]" @click="rechazar(props.row.id)">
            <span class="tw-pr-4 tw-pl-3 text-blue-grey-10"><q-icon name="close" size="24px"
                class="tw-mr-2" />Rechazar</span>
          </q-btn>
          <q-btn flat class="tw-w-auto tw-ml-2 tw-h-8 tw-bg-[#ebf8ea]" @click="aprobar(props.row.id)">
            <span class="tw-pr-4 tw-pl-3 text-blue-grey-10"> <q-icon name="check" size="24px"
                class="tw-mr-2" />Aceptar</span>
          </q-btn>
        </q-td>
        <q-td v-else class="text-center">
          <q-btn unelevated class="tw-w-auto text-black tw-h-9" color="grey-2" @click="handleEscalamiento(props.row)">

            <span class="tw-px-4">Ver Escalamiento</span>
          </q-btn>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td class="text-center">
          <q-btn v-if="(view && ['application/pdf', 'pdf'].includes(props.row.formato.toLowerCase()))" size="sm"
            color="primary" icon="info" flat @click="viewData(props.row.nodeId)" />
          <q-btn size="sm" color="primary" :icon="icon || 'edit'" flat @click="editData(props.row.nodeId)" />
          <q-btn size="sm" color="primary" :icon="secondIcon" flat
            v-if="isSecondIcon && (props.row?.username == auth.$state.userInfo.username)"
            @click="handleSecondIcon(props.row.nodeId)" />
        </q-td>
      </template>

      <template v-if="!loading" v-slot:no-data="{ icon, message }">
        <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
          <img v-lazy :data-url="NoData" alt="" width="120" />
          <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
            {{ msgNoData ? msgNoData : "No existe data por el momento" }}
          </span>
        </div>
      </template>

      <template v-slot:body-cell-procedimiento="props">
        <div class="tw-border-b-[1px] tw-w-96 tw-px-2">
          <p class="tw-text-center tw-border-0">
            {{ collapseContent(props.row.procedimiento, 200) }}
          </p>
          <div class="tw-flex tw-justify-end" v-if="props.row.procedimiento?.length >= 200">
            <q-btn flat color="secondary" @click="showingFullText = !showingFullText">
              {{ showingFullText ? "Ver menos" : "Ver más" }}
            </q-btn>
          </div>
        </div>
      </template>
<template v-slot:body-cell-detalle="props">
  <q-td :props="props" style="max-width: 350px; vertical-align: middle;">

    <p
      class="truncate-multiline"
      v-html="props.row?.descripcion || props.row?.nombre || 'Sin información'">
    </p>

    <div> <q-btn flat dense round @click="handleDetalle(props.row)">
        <q-icon name="visibility" color="primary" />
        <q-tooltip>Ver detalle completo</q-tooltip>
      </q-btn>
    </div>

  </q-td>
</template>
      <template v-slot:body-cell-action="props">
        <q-td class="text-center">
          <div class="tw-w-40 tw-px-2 tw-flex tw-row tw-items-center">
            <p class="tw-break-words tw-whitespace-normal tw-w-44">
              {{ props.row.accion }}
            </p>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-toggle="props">
        <q-td>
          <q-toggle v-model="props.row.toggle" color="secondary"></q-toggle>
        </q-td>
      </template>
    </q-table>
    <div class="row justify-between q-mt-md" v-if="TABLE_BODY?.length > 0">
      <div class="tw-flex tw-gap-x-3 tw-items-center">
        <span>Filas</span>
        <q-select :options="[5, 25, 50, 100]" v-model:model-value="rowsPerPage" dense outlined />
      </div>
      <q-pagination v-model="pagination.page" color="primary" :max="pagesNumber" size="md" direction-links
        boundary-links boundary-numbers />
      <q-btn icon="refresh" type="button" flat class="invisible" />
    </div>
  </div>
  <DetalleModal :isVisible="trazaModal" :data="trazabilidad" :detalle="detalleModal"
    @update:isVisible="trazaModal = $event" title="Detalle" />

  <q-dialog v-model="showState"><q-card :class="['tw-px-3', 'tw-p-4 tw-w-[480px]']"><q-card-section>
    <p class="tw-text-xl tw-font-bold">Cambiar Estado del Usuario</p>
    <br/>
    <p class="tw-mt-3">{{getDataProp ? '¿Está seguro de activar al usuario?' : 'Seleccione la causa de inactivación del usuario'}}</p>
    <q-select v-if="!getDataProp"  label="Seleccione" dense outlined class="tw-rounded-lg" v-model="inputMotivoValue" :options=motivoOptions />
    <br/>
    <q-input  v-if="!getDataProp && inputMotivoValue == 'Otro'" type="textarea" v-model="inputvalue" outlined label="Motivo de Inactivacion" />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn label="No" color="accent" text-color="black" class="tw-p-3" style="width: 210px;" flat @click="cancelChangeState" />
        <q-btn label="Si" style="width: 200px" text-color="white" color="secondary" class="tw-rounded-xl tw-p-3 "
          @click="cambiarEstado" />
      </q-card-actions>
      </q-card></q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import DetalleModal from "src/shared/components/Modal/DetalleModal.vue";
// @ts-ignore
import NoData from "assets/filterImage.svg";
// @ts-ignore
import excel from "assets/excel.svg";
// @ts-ignore
import pdf from "assets/pdf.svg";
// @ts-ignore
import word from "assets/word.svg";
// @ts-ignore
import img from "assets/img.svg";
import music from "assets/music.svg";
import video from "assets/video.svg";
import txt from "assets/txt.svg";
import zip from "assets/folder2.svg";
import msg from "assets/mail.svg";
import ppt from "assets/powerPoint.svg";
import xml from "assets/xml.svg";
import interrogation from "assets/interrogation.svg";
import { useAuthStore } from "src/stores/auth.store";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";

const props = withDefaults(
  defineProps<{
    TABLE_BODY: any[];
    TABLE_HEADER: any[];
    itemSelected?: any[];
    icon?: string;
    keyId?: string;
    msgNoData?: string;
    rowId?: string;
    isSecondIcon?: boolean;
    secondIcon?: string;
    isToggle?: boolean;
    iconTrazabilidad?: string;
    isThridIcon?: boolean;
    thridIcon?: string;
    isSelection?: "none" | "single" | "multiple" | undefined;
    loading?: boolean;
    view?: boolean;
  }>(),
  {
    keyId: "codigo",
    secondIcon: "eye",
    isSelection: "none",
    loading: false,
    icon: "printer",
    view: false,
    // target: ""
  }
);


const vuerouter = useRouter();
const route = useRoute();
const auth = useAuthStore()
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 25,
});

const convertirAMayusculas = (cadena) => {
  let palabras = cadena.split(" ");
  let palabrasMayusculas = palabras.map(palabra => {
    return palabra[0].toUpperCase() + palabra.slice(1);
  });
  return palabrasMayusculas.join(" ");
}

const rowsPerPage = ref(25);
const selection = ref([]);
const showingFullText = ref(false);
const SelectedToChange = ref({
  name: "",
  id: "",
});

const getDataProp = ref(false);
const inputvalue = ref('');
const showState = ref(false);


const motivoOptions = [
  "Vacaciones",
  "Incapacidad",
  "Retiro",
  "Licencia de maternidad",
  "Otro",
]



const inputMotivoValue = ref('')

let pagesNumber = computed(() =>
  Math.ceil(props.TABLE_BODY.length / rowsPerPage.value)
);

const emit = defineEmits([
  "update:itemSelected",
  "update:inputDataProp",
  "handleEditData",
  "handleSecondIcon",
  "handleTrazabilidad",
  "handleCaso",
  "handleThridIcon",
  'verEscalamiento',
  'viewDoc',
  'rechazar',
  'aprobar'
]);

const viewData = (id: number) => {
  emit('viewDoc', id)
}

const editData = (id: number) => {
  emit("handleEditData", id);
};

const handleSecondIcon = (id: number) => {
  emit("handleSecondIcon", id);
};

const handleCaso = (id) => {
  emit("handleCaso", id);
};

const handleTrazabilidad = (id) => {
  emit("handleTrazabilidad", id);
};

const handleThridIcon = (id: number) => {
  emit("handleThridIcon", id);
};

const handleEscalamiento = (data) => {
  emit('verEscalamiento', data)
}

const rechazar = (data) => {
  emit("rechazar", data)
}

const aprobar = (data) => {
  emit("aprobar", data)
}

const handleToggle = (row) => {

  SelectedToChange.value.id = row.id;
  SelectedToChange.value.name = row.firstname + ' ' + row.lastname;
  getDataProp.value = row.enabled;
  showState.value = true
};

const cancelChangeState = () => {
  showState.value = false;
  let row = props.TABLE_BODY.filter(x => x.id == SelectedToChange.value.id);
  row[0].enabled = !getDataProp.value;
};


const cambiarEstado = async () => {
  let state = getDataProp.value ? 'Activo' : 'Inactivo'
  let seguir =
  (state === 'Inactivo' && inputMotivoValue.value !== "" &&
    (inputMotivoValue.value !== "Otro" || inputvalue.value !== ""))
  || state === 'Activo';
  if (seguir) {
    try {
      await sgdeaAxios.post("/usuarios/cambiarestado", null, {
        params: {
          userId: SelectedToChange.value.id,
          username: SelectedToChange.value.name,
          motivo: inputMotivoValue.value == 'Otro' ? inputvalue.value : inputMotivoValue.value,
          estado: state
        }
      });
      let row = props.TABLE_BODY.filter(x => x.id == SelectedToChange.value.id);
      row[0].enabled = state;
      row[0].enabled = getDataProp.value;
      showState.value = false;
      inputvalue.value = "";
      inputMotivoValue.value = "";
      toast.success("Estado actualizado exitosamente")
    } catch (error) {
      showState.value = false;
      toast.error(`No se ha podido modificar el estado a ${state} exitosamente.`)
    }
  } else {
    toast.error(`Ingrese o seleccione el Motivo de Inactivacion`)
  }


}

watch(rowsPerPage, (value) => {

  pagination.value.rowsPerPage = value;
});


watch(selection, (newdateData) => {
  selection.value = newdateData;
  emit("update:itemSelected", selection.value);
});

const cleanSelect = () => {
  selection.value = []
}

defineExpose({
  cleanSelect
})

function editRow(id: number) {
  vuerouter.push(route.path + "/editar/" + id);
}

function viewDetails(id: number) {
  vuerouter.push(route.path + "/visualizacion/" + id);
}

const collapseContent = (text = "", length: number) => {
  if (showingFullText.value) {
    return text;
  }
  const textLength = text?.length;
  return `${text?.slice(0, length).trim()}${textLength > length ? "..." : ""}`;
};
const trazaModal = ref(false);
const detalleModal = ref('');
const trazabilidad = ref()

const showModal = (detalle: string, traza) => {
  detalleModal.value = detalle;
  trazabilidad.value = traza;
  trazaModal.value = true;
};

// Aquí manejarás la lógica del botón para abrir el modal
const handleDetalle = (row) => {

  showModal(row.descripcion, row.traza);
};
</script>

<style>
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24
}

.borderRechazo {
  border: 1px solid #ea7878
}

.truncate {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /* Número de líneas a mostrar */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  /* Asegúrate de que el texto se ajuste */

}

.truncate-multiline {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-break: break-word;
}
</style>
