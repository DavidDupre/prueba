<template>
  <div class="-tw-mt-4">
    <div class="tw-float-right">
      <q-btn icon="add" class="tw-bg-[#ff7500] tw-h-10 tw-text-white tw-font-bold tw-rounded-lg hover:tw-bg-[#dc7347]"
        @click="router.push('notificaciones/crear')">Crear
        notificación</q-btn>
    </div>
    <h2 class="tw-font-bold tw-text-2xl tw-pb-6">Notificaciones</h2>
    <q-card flat class="tw-p-4 tw-rounded-xl">
      <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2">Listado de notificaciones</h2>
      <div :key="key" class="my-custom-table">
        <TableNotificaciones :key="tableKey" :TABLE_HEADER="ASIGNACION_HEADER" :TABLE_BODY="dataTable"
          :TABLE_TOTAL_ROWS="dataTableTotalRows" :selection="undefined" :isLoading="loadingTable"
          :pagination.sync="pagination" v-model:item-selected="selection" @handle-edit-data="handleCaso"
          @handlePageChange="handlePageChange" @handleRowsPerPageChange="handleRowsPerPageChange" icon="edit" />
      </div>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import TableNotificaciones from './TableNotificaciones.vue';
import { ASIGNACION_HEADER } from '.';
import { useRouter } from 'vue-router';
import { sgdeaAxios } from "src/services";

const router = useRouter()
const dataTable = ref([]);
const key = ref(0);
const tableKey = ref(0)
const dataTableTotalRows = ref(0);
const selection = ref([]);
let loadingTable = ref(false);
let pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0
});

onMounted(async () => {
  await getNotif()
})

const handleCaso = (id) => {
  router.push(`/notificaciones/${id}`)
}

const handlePageChange = async (page: number) => {

  // formData.value.pageNo = page <= 0 ? 0 : page - 1;
  // await getData();
}

const handleRowsPerPageChange = async (rowsPerPage: any) => {
}

const getNotif = async () => {
  const { data } = await sgdeaAxios.get('/notificaciones');
  dataTable.value = data;
}

</script>
