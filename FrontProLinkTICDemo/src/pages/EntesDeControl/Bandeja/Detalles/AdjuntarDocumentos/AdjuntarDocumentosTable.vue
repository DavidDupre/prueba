<template>
  <div>
    <q-table flat :rows="props.TABLE_BODY" :columns="props.TABLE_HEADER" :row-key="props.keyId"
      table-header-class="text-black text-h6 " class="q-mr-md full-width tw-bg-transparent"
      rows-per-page-label="Páginas" hide-pagination v-model:pagination="pagination" :selection="props.isSelection"
      :loading="props.loading">
      <template v-slot:body-cell-formato="slot">
        <q-td class="tw-mx-auto">
          <div class="tw-flex tw-items-center tw-justify-center">
            <img :class="isTypeDoc(slot.row).alt == 'pdf' ? 'cursor-pointer' : ''" v-lazy
              :data-url="isTypeDoc(slot.row).img" :alt="isTypeDoc(slot.row).alt" @click="
                isTypeDoc(slot.row).view && visualizeFile(slot.row.nodeId)
                " width="30px" />
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="slot">
        <q-td class="text-center" v-if="props.rol?.toLowerCase().includes('gestionador')">
          <q-btn @click="emit('deleteDoc', slot.row.id)" v-if="props.btnDelete" color="primary" icon="delete" flat />
          <q-btn v-if="slot.row.showBotonAdjuntar" class="tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]"
            label="Adjuntar como soportes al Doc. salida" @click="showModalConfrim = true; idDoc = slot.row.id"
            no-caps />
        </q-td>

        <q-td class="text-center" v-else>
          <q-btn @click="emit('downloadDoc', slot.row.nodeId)" color="primary" icon="download" size="sm" flat />
          <q-btn v-if="types.pdf.includes(getType(slot.row.nombre.toLowerCase()))"
            @click="emit('printDoc', slot.row.nodeId)" color="primary" icon="print" size="sm" flat />
          <!-- <q-btn @click="emit('deleteDoc', slot.row.id)"
            v-if="props.btnDelete && props.from !== 'DocumentosRelacionados'" color="primary" icon="delete" size="sm"
            flat /> -->
          <q-btn @click="emit('deleteDoc', slot.row.id)"
            v-if="props.btnDelete && props.from !== 'DocumentosRelacionados' && $route.path !== '/consulta-general'"
            color="primary" icon="delete" size="sm" flat />
        </q-td>
        <ConfirmModal text-cancel-modal="NO" text-confirm-modal="SI"
          text-show-modal="¿Está seguro de anexar este documento como soporte de salida?"
          @update:show-modal="() => (showModalConfrim = false)"
          @confirm-modal="emit('AdjuntarComoSalida', idDoc); showModalConfrim = false" :show-modal="showModalConfrim" />
      </template>

      <template v-if="!props.loading" v-slot:no-data>
        <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
          <img v-lazy :data-url="require('src/assets/filterImage.svg')" alt="" width="120" />
          <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
            {{
              props.msgNoData
                ? props.msgNoData
                : "No existe data por el momento"
            }}
          </span>
        </div>
      </template>
    </q-table>

    <div class="row justify-between q-mt-md" v-if="TABLE_BODY.length">
      <div class="tw-flex tw-gap-x-3 tw-items-center">
        <span>Filas</span>
        <q-select :options="[5, 25, 50, 100]" v-model="pagination.rowsPerPage" dense outlined />
      </div>
      <q-pagination v-model="pagination.page" color="primary" :max="pagesNumber" size="md" direction-links
        boundary-links boundary-numbers />
      <q-btn icon="refresh" type="button" flat class="invisible" />
    </div>
  </div>

  <q-dialog v-model="visualizadorPDF" seamless position="right" class="tw-h-full tw-w-full">
    <q-card class="tw-h-full tw-w-[2000px] tw-z-[1000] tw-overflow-hidden">
      <q-card-section>
        <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
          <div>
            <q-btn @click="visualizadorPDF = false"
              class="tw-absolute tw-ml-5 tw-mt-20 tw-z-[2000] tw-text-white tw-bg-red-500">Cerrar</q-btn>
            <iframe class="tw-h-[80vh] tw-w-full" :src="iframePdfUrl" frameborder="0"></iframe>
          </div>
        </transition>
      </q-card-section>

      <q-inner-loading :showing="spinnerFile" label-class="text-teal" label-style="font-size: 1.1em" />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { sgdeaAxios } from "src/services";
import ConfirmModal from "src/components/Modal/ConfirmModal.vue";
import { useRoute } from "vue-router";
const route = useRoute()
const emit = defineEmits([
  "update:inputDataProp",
  'AdjuntarComoSalida',
  "downloadDoc",
  "deleteDoc",
  "printDoc",
]);

const props = withDefaults(
  defineProps<{
    TABLE_BODY: any[];
    TABLE_HEADER: any[];
    itemSelected?: any[];
    keyId?: string;
    msgNoData?: string;
    btnDelete?: boolean;
    isSelection?: "none" | "single" | "multiple";
    loading?: boolean;
    rol?: string;
    from?: string;
  }>(),
  {
    keyId: "id",
    isSelection: "none",
    loading: false,
    btnDelete: false,
  }
);

const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 5,
});

const showingFullText = ref(false);
const visualizadorPDF = ref(false);
const spinnerFile = ref(false);
const iframePdfUrl = ref("");
const showModalConfrim = ref(false);

const idDoc = ref(null);

const types = {
  doc: [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "docx",
    "doc",
  ],
  pdf: ["application/pdf", "pdf"],
  xls: [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "xlsx",
    "xls",
    "csv"
  ],
  xml: ["xml"],
  txt: ["txt", "bmp"],
  music: ["mp3"],
  img: ["jpg", "png", "jpeg", "webp"],
  video: ["avi", "mp4"],
  zip: ["zip", "rar"],
  msg: ["msg", "eml"],
  ppt: ["ppt", "pptx"]
};

let pagesNumber = computed(() =>
  Math.ceil(props.TABLE_BODY.length / pagination.value.rowsPerPage)
);

const getType = (nombreArchivo) => {
  const punto = nombreArchivo.lastIndexOf(".");
  if (punto === -1) return "";
  return nombreArchivo.slice(punto + 1);
};

const isTypeDoc = (row) => {
  const docType = getType(row.nombre.toLowerCase());

  if (types.pdf.includes(docType)) {
    return { img: require("src/assets/pdf.svg"), alt: "pdf", view: true };
  } else if (types.doc.includes(docType)) {
    return { img: require("src/assets/word.svg"), alt: "word", view: false };
  } else if (types.xls.includes(docType)) {
    return { img: require("src/assets/excel.svg"), alt: "excel", view: false };
  } else if (types.xml.includes(docType)) {
    return { img: require("src/assets/xml.svg"), alt: "excel", view: false };
  } else if (types.img.includes(docType)) {
    return { img: require("src/assets/img.svg"), alt: "img", view: false };
  } else if (types.music.includes(docType)) {
    return { img: require("src/assets/music.svg"), alt: "img", view: false };
  } else if (types.video.includes(docType)) {
    return { img: require("src/assets/video.svg"), alt: "img", view: false };
  } else if (types.txt.includes(docType)) {
    return { img: require("src/assets/txt.svg"), alt: "img", view: false };
  } else if (types.zip.includes(docType)) {
    return { img: require("src/assets/folder2.svg"), alt: "avi", view: false };
  } else if (types.msg.includes(docType)) {
    return { img: require("src/assets/mail.svg"), alt: "avi", view: false };
  } else if (types.ppt.includes(docType)) {
    return { img: require("src/assets/powerPoint.svg"), alt: "ppt", view: false };
  }
  else {
    return {
      img: require("src/assets/interrogation.svg"),
      alt: null,
      view: false,
    };
  }
};

const visualizeFile = async (nodeID: string) => {
  spinnerFile.value = true;
  visualizadorPDF.value = true;

  const { data } = await sgdeaAxios.get<any>(
    `/radicados/consultar_documento/${nodeID}`
  );

  const byteCharacters = atob(data.base64x);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });

  iframePdfUrl.value = URL.createObjectURL(blob);

  spinnerFile.value = false;
};
</script>

<style>
.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
}

.borderRechazo {
  border: 1px solid #ea7878;
}
</style>
