<template>
  <div>
    <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId" table-header-class="text-black text-h6 "
      class="q-mr-md full-width tw-bg-transparent" rows-per-page-label="Páginas" hide-pagination
      v-model:pagination="pagination" :selection="isSelection" :loading="loading" v-model:selected="selection">

      <template v-slot:body-cell-formato="props">
        <q-td v-if="['application/pdf', 'pdf'].includes(props.row.formato.toLowerCase())" class="tw-mx-auto tw-cursor-pointer">
          <center>
            <img @click="visualize(props.row.nodeId, null, true)" v-lazy :data-url="pdf" alt="pdf" />
          </center>
        </q-td>
        <q-td
          v-else-if="['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx', 'application/msword', 'doc'].includes(props.row.formato.toLowerCase())"
          class="tw-mx-auto">
          <center>
            <img v-lazy :data-url="word" alt="word" />
          </center>
        </q-td>
        <q-td
          v-else-if="['application/vnd.ms-excel', 'xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'xlsx'].includes(props.row.formato.toLowerCase())"
          class="tw-mx-auto">
          <center>
            <img v-lazy :data-url="excel" alt="excel" />
          </center>
        </q-td>
        <q-td v-else-if="['xml'].includes(props.row.formato.toLowerCase())" class="tw-mx-auto">
          <center>
            <img v-lazy :data-url="xml" alt="xml" width="30px" />
          </center>
        </q-td>
        <q-td v-else-if="['ppt', 'pptx'].includes(props.row.formato.toLowerCase())" class="tw-mx-auto">
          <center>
            <img v-lazy :data-url="ppt" alt="ppt" width="30px" />
          </center>
        </q-td>
        <q-td v-else-if="['jpg', 'png', 'jpeg', 'webp'].includes(props.row.formato.toLowerCase())" class="tw-mx-auto"  >
          <center>
            <img v-lazy :data-url="img" alt="img" width="30px"/>
          </center>
        </q-td>
        <q-td v-else-if="['mp3'].includes(props.row.formato.toLowerCase()) " class="tw-mx-auto"  >
          <center>
            <img v-lazy :data-url="music" alt="mp3" width="30px" />
          </center>
        </q-td>
        <q-td v-else-if="['avi', 'mp4' ].includes(props.row.formato.toLowerCase())" class="tw-mx-auto"  >
          <center>
            <img v-lazy :data-url="video" alt="video" width="30px" />
          </center>
        </q-td>
        <q-td v-else-if="['txt', 'bmp' ].includes(props.row.formato.toLowerCase())" class="tw-mx-auto"  >
          <center>
            <img v-lazy :data-url="txt" alt="txt" width="30px" />
          </center>
        </q-td>
        <q-td v-else-if="['zip', 'rar' ].includes(props.row.formato.toLowerCase())" class="tw-mx-auto"  >
          <center>
            <img v-lazy :data-url="zip" alt="zip" width="30px" />
          </center>
        </q-td>
        <q-td v-else-if="props.row.formato.toLowerCase() == 'msg' || props.row.formato.toLowerCase() == 'eml'" class="tw-mx-auto"  >
          <center>
            <img v-lazy :data-url="msg" alt="msg" width="30px" />
          </center>
        </q-td>
        <q-td v-else class="tw-mx-auto">
          <center>
            <q-icon name="sym_o_unknown_document" size="xs" />
          </center>
        </q-td>
      </template>

      <template v-slot:body-cell-codigo="props">
        <q-td class="tw-flex tw-items-center tw-justify-center tw-gap-2">
          <q-avatar size="xs">
            <img v-lazy data-url="https://cdn.quasar.dev/img/avatar.png" />
          </q-avatar>
          <p>
            {{ props.row.codigo }}
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
          <q-btn size="sm" color="secondary" :icon="icon || 'edit'" flat @click="
            editRow(
              props.row.id_seriesubserie || props.row.id || props.row[rowId]
            )
            " />
          <q-btn size="sm" color="secondary" :icon="secondIcon" flat v-if="isSecondIcon"
            @click="viewDetails(props.row[rowId])" />
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td class="text-center">
          <q-btn size="sm" color="primary" :icon="icon || 'edit'" flat @click="editData(props.row.id)" />
          <q-btn size="sm" color="primary" :icon="secondIcon" flat v-if="isSecondIcon"
            @click="handleSecondIcon(props.row.id)" />
        </q-td>
      </template>

      <template v-if="!loading" v-slot:no-data>
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
            {{ collapseContent(props.row.procedimiento) }}
          </p>
          <div class="tw-flex tw-justify-end" v-if="props.row.procedimiento?.length >= 200">
            <q-btn flat color="secondary" @click="showingFullText = !showingFullText">
              {{ showingFullText ? "Ver menos" : "Ver más" }}
            </q-btn>
          </div>
        </div>
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
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";


import NoData from "assets/filterImage.svg";
import excel from "assets/excel.svg";
import pdf from "assets/pdf.svg";
import word from "assets/word.svg";
import img from "assets/img.svg";
import music from "assets/music.svg";
import video from "assets/video.svg";
import txt from "assets/txt.svg";
import zip from "assets/folder2.svg";
import msg from "assets/mail.svg";
import ppt from "assets/powerPoint.svg";
import xml from "assets/xml.svg";

const props = withDefaults(
  defineProps<{
    TABLE_BODY: any[];
    TABLE_HEADER: any[];
    itemSelected: any[];
    icon?: string;
    keyId?: string;
    msgNoData?: string;
    rowId?: string;
    isSecondIcon?: boolean;
    secondIcon?: string;
    isToggle?: boolean;
    iconTrazabilidad?: string;
    isThridIcon?: boolean;
    thridIcon: string;
    isSelection?: "none" | "single" | "multiple" | undefined;
    loading?: boolean,
    visualize?: (id, list, action) => {},
  }>(),
  {
    keyId: "codigo",
    secondIcon: "eye",
    isSelection: "multiple",
    loading: false,
    icon: "printer",
    // target: ""
  }
);
const vuerouter = useRouter();
const route = useRoute();
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 5,
});

const rowsPerPage = ref(5);
const selection = ref([]);
const showingFullText = ref(false);

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
]);

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

const collapseContent = (text = "") => {
  if (showingFullText.value) {
    return text;
  }
  return `${text?.slice(0, 200).trim()}`;
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
</style>
