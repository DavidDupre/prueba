<template>
  <div>
    <div class="tw-flex tw-justify-between tw-items-center tw-mb-10 tw-gap-6">
      <p class="tw-text-lg text-weight-bold q-mx-lg">
       {{title}}
      </p>

      <div class="tw-flex tw-gap-2 tw-min-h-[36px] q-mx-lg">
        <!-- <q-btn label="Cambiar tipo de documento" color="secondary" class="!tw-px-4" v-if="selected.length"
        @click="modalChangeDocType = true;" /> -->

        <q-btn v-if="selected.length" @click="deleteSelected" label="Eliminar" text-color="white" color="primary"
        class="!tw-px-4" row-key="id" />
      </div>

    </div>

    <q-table flat :rows="body" :columns="JUZGADOS_HEADER" row-key="id"
      table-header-class="text-black text-h6 " class="q-mr-md full-width"
      no-data-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
      v-model:pagination="pagination" hide-pagination selection="multiple"  v-model:selected="selected" >

      <template v-slot:body-cell-formato="props">
        <q-td  v-if="props.row.formato.toLowerCase() == 'pdf' || props.row.formato == 'application/pdf'" class="tw-mx-auto tw-cursor-pointer">
          <center>
            <img v-lazy :data-url="pdf" alt="pdf" />
          </center>
        </q-td>
        <q-td v-else-if="['docx', 'doc', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(props.row.formato.toLowerCase())" class="tw-mx-auto">
          <center>
            <img v-lazy :data-url="word" alt="word" />
          </center>
        </q-td>
        <q-td v-else-if="['xls', 'xlsx', 'application/vnd.ms-excel', 'application/xml', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(props.row.formato.toLowerCase())" class="tw-mx-auto">
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
        <q-td v-else-if="props.row.formato.toLowerCase() == 'mp3' " class="tw-mx-auto"  >
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
          <q-icon name="sym_o_unknown_document" size="xs" />
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td class="tw-mx-auto">
            <q-btn @click="handlePrint(props.row.id)" size="sm" color="primary" icon="print" flat />
        </q-td>
      </template>

      <template v-slot:bottom>
        <div class="row q-mt-md" style="width: 100%;">
          <div class="col">
            <label for="" class="flex items-center q-gutter-x-md">
              <span style="font-size: 14px; font-weight: 500;">
                Filas por página
              </span>
              <q-select style="width: 120px; height: 40px;" outlined dense mapOptions emitValue
                :options="[5, 25, 50, 100]" v-model:model-value="pagination.rowsPerPage" />
            </label>
          </div>

          <q-pagination v-model="pagination.page" color="black" active-color="primary" direction-links gutter="20px"
            :max="pagesNumber" :max-pages="6" class="col-8 q-pl-xl" />
        </div>
      </template>

      <template v-slot:no-data="{ message }">
        <div class="flex items-center justify-center full-width">
          <div class="flex items-center justify-center q-mt-lg"
            style="padding: 15px; border: 1px solid #E3E4E5; border-radius: 5px; gap: 9px;">
            <q-icon size="20px" name="cancel" color="negative" />
            <span class="text-weight-medium">
              {{ message }}
            </span>
          </div>
        </div>
      </template>
    </q-table>
  </div>

  <CustomModal v-model="modalChangeDocType" title-button="Guardar" left-title-button="Cancelar"
    :title="`Cambiar el tipo de documento de ${selected.length} ${selected.length > 1 ? 'documentos' : 'documento'}`"
    @close-modal="modalChangeDocType = false" @handle-accept="handleChangeDocType">
    <div class="tw-p-4">
      <p class="tw-text-base tw-font-medium tw-mb-1">¿Es un documento de salida?</p>
      <q-select v-model="esSalida" :options="[{ label: 'Sí', value: true }, { label: 'No', value: false }]"
        label="Seleccione" dense outlined emit-value required map-options />
    </div>
  </CustomModal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
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
import CustomModal from "src/components/Modal/CustomModal.vue";
// import { toast } from "src/helpers/toast";

const props = withDefaults(defineProps<{
  JUZGADOS_HEADER: any[],
  JUZGADOS_BODY: any[],
  title?: string,
  isChangeDocType?: boolean,
}>(), {
  title:'Listado de documentos cargados',
  isChangeDocType: true,
})

const emit = defineEmits([
    "update:itemDeleted",
    "update:showPrinter",
    "update:itemTypeChanged",

]);

const modalChangeDocType = ref(false);
const esSalida= ref('')
const body= ref(props.JUZGADOS_BODY)
const selected = ref([])
const pagination = ref({
  page: 1,
  rowsPerPage: 5,
})

const handlePrint=(id)=>{
  emit("update:showPrinter", id)
}

const handleChangeDocType = async () => {
  const idsSelected = selected.value.map((item: any) => item.id)
  emit("update:itemTypeChanged", { idsSelected, esSalida: esSalida.value })
  modalChangeDocType.value = false
  selected.value = []
}

const deleteSelected = async () => {

  const idsSelected = selected.value.map((item: any) => item.idDoc)

  // const destinatairesFiltered = props.JUZGADOS_BODY.filter((item: any) => !idsSelected.includes(item.id)).map((item: any) => item.id)
  emit("update:itemDeleted", idsSelected)
}

const pagesNumber = computed(() => Math.ceil(props.JUZGADOS_BODY.length / pagination.value.rowsPerPage));

</script>
