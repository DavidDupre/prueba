<template>
    <div>
        <q-table flat :rows="props.DOCUMENTOS_BODY" :columns="DOCUMENTOS_HEADER" row-key="nombreDocumento"
            table-header-class="text-black text-h6 " class="q-mr-md !tw-w-full" selection="multiple"
            v-model:selected="selection" no-data-label="No se encontraron resultados coincidentes con la búsqueda."
            no-results-label="No se encontraron resultados coincidentes con la búsqueda."
            v-model:pagination="pagination" hide-pagination>

            <template v-slot:body-cell-formato="props">
                <q-td v-if="props.row.formato == 'application/pdf'" class="tw-mx-auto tw-cursor-pointer">
                    <center>
                        <img @click="visualize(props.row.id)" v-lazy :data-url="pdf" alt="pdf" />
                    </center>
                </q-td>
                <q-td v-else-if="props.row.formato == 'application/docx'" class="tw-mx-auto">
                    <center>
                        <img v-lazy :data-url="word" alt="word" />
                    </center>
                </q-td>
                <q-td v-else-if="props.row.formato == 'application/xls' || props.row.formato == 'application/xml'"
                    class="tw-mx-auto">
                    <center>
                        <img @click="visualize(props.row.id)" v-lazy :data-url="excel" alt="excel" />
                    </center>
                </q-td>
              <q-td v-else-if="props.row.formato === 'image/png' || props.row.nombre?.split('.').pop()?.toLowerCase() === 'png'" class="tw-mx-auto tw-cursor-pointer">
                <center>
                  <img
                    @click="visualize(props.row.id)"
                    v-lazy
                    :data-url="img"
                    alt="imagen"
                    width="30px"
                  />
                </center>
              </q-td>


              <q-td v-else-if="props.row.formato === 'application/xml' ||
                   props.row.formato === 'text/xml' ||
                   props.row.nombre?.split('.').pop()?.toLowerCase() === 'xml'"
                    class="tw-mx-auto">
                <center>
                  <img v-lazy :data-url="xml" alt="xml" width="30px" />
                </center>
              </q-td>
                <q-td v-else class="tw-mx-auto">
                    <center>
                        <img v-lazy :data-url="unknown" alt="excel" />
                    </center>
                </q-td>
            </template>

            <template v-slot:body-cell-acciones="props">
                <q-td class="text-center">
                    <q-btn size="sm" color="primary" icon="download" flat padding="3px" :ripple="false"
                        @click="async () => await downloadFile(props.row)">
                        <q-tooltip class="bg-white" anchor="top right" self="top middle"
                            style="color: #222222; border: 1px solid #A5B1BF; border-radius: 200px;">
                            Descargar
                        </q-tooltip>
                    </q-btn>

                    <q-btn size="sm" color="primary" icon="print" flat padding="3px" :ripple="false">
                        <q-tooltip class="bg-white" anchor="top right" self="top middle"
                            style="color: #222222; border: 1px solid #A5B1BF; border-radius: 200px;">
                            Imprimir
                        </q-tooltip>
                    </q-btn>
                </q-td>
            </template>

            <template v-slot:bottom>
                <div class="row q-mt-md" style="width: 100%;">
                    <div class="col">
                        <label for="" class="flex items-center q-gutter-x-md">
                            <span style="font-size: 14px; font-weight: 500;">
                                Filas por página
                            </span>
                            <q-select style="width: 120px; height: 40px;" outlined dense mapOptions emitValue :options="[
                                { label: '5', value: '5' },
                                { label: '10', value: '10' }
                            ]" v-model:model-value="pagination.rowsPerPage" />
                        </label>
                    </div>

                    <q-pagination v-model="pagination.page" color="black" active-color="primary" direction-links
                        gutter="20px" :max="pagesNumber" class="col-8 q-pl-xl" />
                </div>
            </template>

            <template v-slot:no-data="{message}">
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
</template>

<script setup lang="ts">
import {ref, computed, watch} from "vue";
import { DOCUMENTOS_HEADER } from ".";
import pdf from "assets/pdf.svg";
import excel from "assets/excel.svg";
import word from "assets/word.svg";
import xml from "assets/xml.svg";
import img from "assets/img.svg";
import unknown from "assets/unknown_document.svg";
import {sgdeaAxios} from "src/services";
import {DocumentoRadicado} from "src/interfaces";

const props = withDefaults(defineProps<{
  DOCUMENTOS_BODY: any[],
  DOCUMENTOS_HEADER: any[],
  action?: string,
  target?: string,
    selectedItems?: any[],
    visualize?: (id: any) => {}
}>(), {
  target: ""
})

const emit = defineEmits(["update:selectedItems"])

const selection = ref([])

watch(selection, (value) => {
  emit("update:selectedItems", value);
  selection.value = value;
})

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
})

const pagesNumber = computed(() => Math.ceil((props.DOCUMENTOS_BODY?.length ?? 0) / pagination.value.rowsPerPage))

const downloadFile = async (row: any) => {
  const { data } = await sgdeaAxios.get<DocumentoRadicado>(
    `/radicados/consultar_documento/${row.nodeId}`
  );
  const byteCharacters = atob(data.base64x);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });

  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = String(row.nombreDocumento);

  link.click();

  URL.revokeObjectURL(blobUrl);
}
</script>
