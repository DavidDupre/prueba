<template>
  <main class="q-py-md">
    <q-card flat class="tw-p-4 tw-rounded-xl tw-mt-6">
      <div class="show-table-icons">
        <CrearMasivaTable
          class="q-pa-md"
          :TABLE_HEADER="renderColumns()"
          :TABLE_BODY="tramitesComunicacionales"
          :module="module"
          key-id="id"
          icon="someIcon"
          :total="totalItems"
          @handleRowsPerPageChange="handleRowsPerPageChange"
          @handlePageChange="handlePageChange"
        />
      </div>
    </q-card>
  </main>
</template>

<script lang="ts" setup>
import moment from "moment/moment";
import {onMounted, ref} from "vue";
import {useAuthStore} from "stores/auth.store";
import {sgdeaAxios} from "src/services";
import CrearMasivaTable from "pages/Correspondencia/ComunicacionMasiva/crearMasivaTable.vue";

const emit = defineEmits(['pageChange', 'rowsChange'])
const allRadicados = ref([]);
const module = ref("crearMasiva");
const tramitesComunicacionales = ref([]);
const totalItems = ref(0);
const renderColumns = () => {
  const columns = [
    {
      name: "id",
      label: "Consecutivo",
      field: "id",
      sortable: true,
      align: "center",
    },
    {
      name: "nombreComunicacion",
      label: "Nombre de la Comunicación",
      field: "nombreComunicacion",
      sortable: true,
      align: "center",
    },
    {
      name: "fechaRadicacion",
      label: "Fecha de Creación",
      field: (row) => moment(row.fechaRadicacion).format("DD/MM/YYYY"),
      sortable: true,
      align: "center",
    },
    {
      name: "tipoComunicacion",
      label: "Tipo de Comunicación",
      field: (row) => row.tipoComunicacion.nombre,
      sortable: true,
      align: "center",
    },
    {
      name: "cantidad",
      label: "Cantidad",
      field: "cantidad",
      align: "center",
    },
    {
      name: "estado",
      label: "Estado",
      field: (row) => row.estado,
      align: "center",
    },
    {
      name: "subTramite",
      label: "Ver Sub Trámites",
      field: "subTramite",
      align: "center",
    },
    {
      name: "gestionDoc",
      label: "Gestión Documental",
      field: "gestionDoc",
      align: "center",
    },
    {
      name: "trazabilidad",
      label: "Trazabilidad",
      field: "trazabilidad",
      align: "center",
    },
  ];
  return columns;
};

onMounted(async () => {
  renderColumns();
  await getTramitesComunicacionales(0, 20);
});

const getTramitesComunicacionales = async (pageNumber, pageSize) => {
  const bodyParam = {
    usuario: useAuthStore().$state.userInfo.userid,
    size: pageSize,
    page: pageNumber,
  };

  try {
    const { data } = await sgdeaAxios.post(
      "/correspondencia/comunicaciones/masivas/bandeja",
      bodyParam
    );

    if (data) {
      tramitesComunicacionales.value = data.content
        .sort((a, b) => a.id - b.id)
        .map(comunicacion => (
          {...comunicacion, estado: comunicacion.estado.estado }
        ));
      totalItems.value = data.totalPages;

      allRadicados.value = tramitesComunicacionales.value;
    }
  } catch (error) {
    console.error(error);
  }
  return { data: tramitesComunicacionales?.value, total: tramitesComunicacionales?.value.length || 0 };
};

const handleRowsPerPageChange = (event) => {
  getTramitesComunicacionales(event.page, event.rowsPerPage);
  emit('rowsChange', tramitesComunicacionales.value)
};

const handlePageChange = (event) => {
  getTramitesComunicacionales(event.page - 1, event.rowsPerPage);
  emit('pageChange', tramitesComunicacionales.value)
};
defineExpose({
  getTramitesComunicacionales, // fetchData,
  filterByState
})

function filterByState(estado) {
  if (!estado) {
    tramitesComunicacionales.value = allRadicados.value
  } else {
    tramitesComunicacionales.value = allRadicados.value.filter((item) => item.estado == estado)
  }
}
</script>

<style scoped lang="scss">
</style>
