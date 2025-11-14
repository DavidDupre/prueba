<template>
  <div>
    <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId" table-header-class="text-black text-h6 "
      class="q-mr-md full-width tw-bg-transparent" rows-per-page-label="Páginas" hide-pagination
      v-model:pagination="pagination" :selection="isSelection" v-model:selected="selection">

      <template v-slot:body-cell-formato="props">
        <q-td v-if="['pdf', 'application/pdf'].includes(props.row.nombre.split('.').pop().toLowerCase())" class="tw-mx-auto tw-cursor-pointer">
          <center>
            <img v-lazy :data-url="pdf" alt="pdf" width="30px"/>
          </center>
        </q-td>
        <q-td v-else-if="['docx', 'doc', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(props.row.nombre.split('.').pop().toLowerCase())" class="tw-mx-auto">
          <center>
            <img v-lazy :data-url="word" alt="word" width="30px"/>
          </center>
        </q-td>
        <q-td v-else-if="['xls', 'xlsx', 'csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(props.row.nombre.split('.').pop().toLowerCase())" class="tw-mx-auto">
          <center>
            <img v-lazy :data-url="excel" alt="excel" width="30px"/>
          </center>
        </q-td>
        <q-td v-else-if="props.row.nombre.split('.').pop().toLowerCase() == 'xml'" class="tw-mx-auto">
          <center>
            <img v-lazy :data-url="xml" alt="xml" width="30px"/>
          </center>
        </q-td>
        <q-td v-else-if="['ppt', 'pptx'].includes(props.row.nombre.split('.').pop().toLowerCase())" class="tw-mx-auto">
          <center>
            <img v-lazy :data-url="ppt" alt="ppt" width="30px"/>
          </center>
        </q-td>
        <q-td v-else-if="['jpg', 'png', 'jpeg', 'webp'].includes(props.row.nombre.split('.').pop().toLowerCase())" class="tw-mx-auto">
          <center>
            <img v-lazy :data-url="img" alt="img" width="30px" />
          </center>
        </q-td>
        <q-td v-else-if="props.row.nombre.split('.').pop().toLowerCase() == 'mp3' " class="tw-mx-auto">
          <center>
            <img v-lazy :data-url="music" alt="mp3" width="30px" />
          </center>
        </q-td>
        <q-td v-else-if="['avi', 'mp4' ].includes(props.row.nombre.split('.').pop().toLowerCase())" class="tw-mx-auto">
          <center>
            <img v-lazy :data-url="video" alt="video" width="30px" />
          </center>
        </q-td>
        <q-td v-else-if="['txt', 'bmp' ].includes(props.row.nombre.split('.').pop().toLowerCase())" class="tw-mx-auto">
          <center>
            <img v-lazy :data-url="txt" alt="txt" width="30px" />
          </center>
        </q-td>
        <q-td v-else-if="['zip', 'rar' ].includes(props.row.nombre.split('.').pop().toLowerCase())" class="tw-mx-auto"  >
          <center>
            <img v-lazy :data-url="zip" alt="zip" width="30px" />
          </center>
        </q-td>
        <q-td v-else-if="props.row.nombre.split('.').pop().toLowerCase() == 'msg' || props.row.nombre.split('.').pop().toLowerCase() == 'eml'" class="tw-mx-auto"  >
          <center>
            <img v-lazy :data-url="msg" alt="msg" width="30px" />
          </center>
        </q-td>
        <q-td v-else class="tw-mx-auto">
          <center>
            <img v-lazy :data-url="interrogation" alt="" width="30px" />
          </center>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td class="text-center">
          <q-btn size="sm" color="primary" :icon="icon || 'edit'" flat @click="editData(props.row.nodeId)" />
          <q-btn size="sm" color="primary" :icon="secondIcon" flat
            v-if="isSecondIcon && obtenerExtension(props.row.nombre).toLowerCase() == 'pdf'"
            @click="handleSecondIcon(props.row.nodeId)" />
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
// @ts-ignore
import excel from "assets/excel.svg";
// @ts-ignore
import pdf from "assets/pdf.svg";
// @ts-ignore
import word from "assets/word.svg";
import img from "assets/img.svg";
import music from "assets/music.svg";
import video from "assets/video.svg";
import txt from "assets/txt.svg";
import zip from "assets/folder2.svg";
import msg from "assets/mail.svg";
import ppt from "assets/powerPoint.svg";
import xml from "assets/xml.svg";
import interrogation from "assets/interrogation.svg";


const props = withDefaults(
  defineProps<{
    TABLE_BODY: any[];
    TABLE_HEADER: any[];
    icon?: string;
    keyId?: string;
    isSecondIcon?: boolean;
    secondIcon?: string;
    isSelection?: "none" | "single" | "multiple" | undefined;
  }>(),
  {
    keyId: "codigo",
    secondIcon: "eye",
    isSelection: "none",
    loading: false,
    icon: "printer"
  }
);

const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 5,
});

const rowsPerPage = ref(5);
const selection = ref([]);

let pagesNumber = computed(() =>
  Math.ceil(props.TABLE_BODY.length / rowsPerPage.value)
);

const emit = defineEmits([
  "handleEditData",
  "handleSecondIcon"
]);

const editData = (id: number) => {
  emit("handleEditData", id);
};

const handleSecondIcon = (id: number) => {
  emit("handleSecondIcon", id);
};

watch(rowsPerPage, (value) => {
  pagination.value.rowsPerPage = value;
});

const cleanSelect = () => {
  selection.value = []
}

defineExpose({
  cleanSelect
})

const obtenerExtension = (nombreArchivo) => {
  const punto = nombreArchivo.lastIndexOf('.');
  if (punto === -1) return '';
  return nombreArchivo.slice(punto + 1);
}

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
</style>
