<template>
  <div>
    <div
      class="tw-justify-between tw-items-center tw-mb-10 tw-gap-6 tw-mt-10 tw-bg-white full-width"
    >
      <p
        class="tw-text-lg text-weight-bold q-mx-lg tw-text-left tw-mb-5 tw-ml-0 tw-pl-6 tw-pt-8"
      >
        Descargar formato masivo
      </p>

      <q-table
        flat
        :rows="filteredBody"
        :columns="headers"
        row-key="id"
        table-header-class="text-black text-h6 "
        class="q-mr-md full-width"
        hide-pagination
      >
        <template v-slot:body-cell-format="props">
          <q-td class="tw-mx-auto">
            <center>
              <img v-lazy :data-url="excel" alt="excel" />
            </center>
          </q-td>
        </template>

        <template v-slot:body-cell-type="props">
          <q-td class="tw-mx-auto">
            {{ props.row.type }}
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td class="tw-mx-auto">
            <q-btn
              @click="handleDownload()"
              size="sm"
              color="primary"
              icon="download"
              flat
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import excel from "assets/excel.svg";
import { ref } from "vue";
import { sgdeaAxios } from "src/services";
import { useRoute } from "vue-router";
import { TipoComunicacion } from "./types";
import { handleDownloadFile } from "./utils";
import { toast } from "src/helpers/toast";

const route = useRoute();
const props = withDefaults(
  defineProps<{
    tipoComunicacion: TipoComunicacion;
  }>(),
  {}
);

let nombreTipoComunicacion = ref("");
nombreTipoComunicacion.value = props?.tipoComunicacion?.nombre;

let headers: any = ref([
  {
    name: "format",
    label: "Formato",
    field: (row) => row.format,
    align: "center",
  },
  {
    name: "type",
    label: "Tipo",
    field: (row) => row.type,
    align: "center",
  },
  {
    name: "actions",
    label: "Acción",
    align: "center",
    field: "actions",
  },
]);

let body: any = ref([
  {
    id: 1,
    format: "formato",
    type: "Interna",
  },
  {
    id: 2,
    format: "formato",
    type: "Externa",
  },
]);

const filteredBody = body.value.filter(
  (item: any) => item.type === nombreTipoComunicacion.value
);

const handleDownload = async () => {
  try {
    const response = await sgdeaAxios.get(
      `/correspondencia/comunicacionMasiva/plantillaExcel?comunicacionMasivaId=${route.params.id}`,
      { responseType: "blob" }
    );

    if (response.status === 200) {
      const fileName = "Formato importación destinatarios.xls";
      handleDownloadFile(response, fileName);
      toast.success("El formato se descargó correctamente");
    }
  } catch (error) {
    const { message } = error.response.data
      if(message){
        toast.error(error.response.data.message);
      }
  }
};
</script>
